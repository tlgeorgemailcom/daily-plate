import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';
import { buildRecipeCommunityV3, type CommunitySectionV3, type PrimaryCookStage } from '$lib/nutrition/buildRecipeCommunityV3';
import type { CommunityIngredient, NutrientRow } from '$lib/nutrition/types';
import { normalizeIngredientRemoval } from '$lib/nutrition/allocation';
import { fetchNutrientsByNdb } from '$lib/server/nutrition/fetchNutrients.js';

function hasValidLink(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const obj = row as Record<string, unknown>;
  const hasFood = (typeof obj.foodWord === 'string' && obj.foodWord.trim().length > 0)
    || (typeof obj.ndbNo === 'string' && obj.ndbNo.trim().length > 0)
    || (typeof obj.componentRef === 'string' && obj.componentRef.trim().length > 0
        && !!(obj as Record<string, unknown>).componentPer100g);
  const portion = Number(obj.portionGrams ?? 0);
  return hasFood && Number.isFinite(portion) && portion > 0;
}

function withDefaultServingCount(row: unknown): unknown {
  if (!row || typeof row !== 'object') return row;
  const obj = row as Record<string, unknown>;
  const count = Number(obj.servingCount ?? 1);
  return {
    ...obj,
    servingCount: Number.isFinite(count) && count > 0 ? count : 1,
  };
}

function totalIngredientGrams(row: unknown): number {
  if (!row || typeof row !== 'object') return 0;
  const obj = row as Record<string, unknown>;
  const grams = Number(obj.portionGrams ?? 0);
  const count = Number(obj.servingCount ?? 1);
  return Number.isFinite(grams) && grams > 0 && Number.isFinite(count) && count > 0
    ? grams * count
    : 0;
}

function allocationPreviewSections(buildResult: ReturnType<typeof buildRecipeCommunityV3>) {
  return buildResult.sections.map((section) => ({
    sectionKey: section.sectionKey,
    cookedGrams: section.cookedGrams,
    renderedFatEstimateGrams: section.renderedFatEstimateGrams,
    renderedFatAllocation: section.renderedFatAllocation,
    reservedPoolGrams: section.reservedPoolGrams,
    consumedReservedPoolGrams: section.consumedReservedPoolGrams,
  }));
}

/**
 * POST /api/recipes/preview-nutrition
 *
 * Computes canonical nutrition for the current form state without writing to the DB.
 * Uses the same calcNutritionJson() path as all save/submit endpoints so the number
 * shown while editing exactly matches what will be stored on save.
 *
 * Body:
 *   ingredients   — array of ingredient rows (same shape as recipe_ingredients_json)
 *   dishLink      — optional dish-level link row { foodWord, portionGrams, servingCount, ... }
 *   linkType      — 'ingredient' | 'dish' | 'mixed'
 *   servings      — servings string e.g. "8"
 *   cookingMethod — optional cooking method string e.g. "Bake"
 *
 * Response:
 *   { nutritionJson: NutritionJson }  — canonical per-serving nutrition
 *   { nutritionJson: null }           — not enough linked data to compute
 */
export const POST: RequestHandler = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return json({ error: 'Missing body' }, { status: 400 });
  }

  const {
    ingredients,
    dishLink,
    linkType,
    servings,
    cookingMethod,
    yieldFactorWater,
    yieldFactorFat,
    communityBuild,
    sections: sectionsRaw,
    nutrientMap: nutrientMapRaw,
    dishCookMethod,
    dishCookTempF,
    dishCookMinutes,
    fillClass,
    cook2Method,
    cook2Minutes,
    cook2TempF,
    cook2FillClass,
    cook3Method,
    cook3Minutes,
    cook3TempF,
    cook3FillClass,
  } = body as Record<string, unknown>;

  const primaryCookStages: PrimaryCookStage[] = [
    {
      stage: 2,
      method: typeof cook2Method === 'string' ? cook2Method : undefined,
      minutes: typeof cook2Minutes === 'number' ? cook2Minutes : undefined,
      tempF: typeof cook2TempF === 'number' ? cook2TempF : undefined,
      fillClass: typeof cook2FillClass === 'string' ? cook2FillClass : undefined,
    },
    {
      stage: 3,
      method: typeof cook3Method === 'string' ? cook3Method : undefined,
      minutes: typeof cook3Minutes === 'number' ? cook3Minutes : undefined,
      tempF: typeof cook3TempF === 'number' ? cook3TempF : undefined,
      fillClass: typeof cook3FillClass === 'string' ? cook3FillClass : undefined,
    },
  ];

  if (typeof linkType !== 'string' || !linkType) {
    return json({ nutritionJson: null });
  }

  if (linkType !== 'ingredient' && linkType !== 'dish' && linkType !== 'mixed') {
    return json({ nutritionJson: null });
  }

  const rawIngs: unknown[] = Array.isArray(ingredients) ? ingredients : [];
  if (rawIngs.length === 0 && !dishLink) {
    return json({ nutritionJson: null });
  }

  // ── Community recipe fast-path ──────────────────────────────────────────────
  // When the form sends communityBuild=true with sections + embedded NutrientRow
  // data (nutrientMap), use buildRecipeCommunity for the live preview.
  // This avoids an extra Turso round-trip because the browser cached nutrients
  // from the ingredient search results.
  if (communityBuild === true && Array.isArray(sectionsRaw) && sectionsRaw.length > 0) {
    const rawMap = (nutrientMapRaw && typeof nutrientMapRaw === 'object') ? nutrientMapRaw as Record<string, NutrientRow> : {};
    const nutrientMap = new Map<string, NutrientRow>(Object.entries(rawMap));
    const sectionsList = (sectionsRaw as unknown[]).filter(
      (s): s is CommunitySectionV3 =>
        !!s && typeof s === 'object' &&
        typeof (s as Record<string, unknown>).sectionKey === 'string'
    );
    const ingList: CommunityIngredient[] = (rawIngs as unknown[]).map(r => {
      const obj = r as Record<string, unknown>;
      const removal = normalizeIngredientRemoval(obj);
      return {
        ndbNo:         String(obj.ndbNo ?? ''),
        portionGrams:  totalIngredientGrams(obj),
        sectionKey:    typeof (obj.sectionKey ?? obj.section) === 'string' ? String(obj.sectionKey ?? obj.section) : undefined,
        isOptional:    obj.exempt === true,
        exempt:        false,
        removedAfterPrep: removal.removedAfterPrep,
        removalAmount: removal.removalAmount,
        removalUnit: removal.removalUnit,
        discarded:     obj.discarded === true,
        discardPercent: typeof obj.discardPercent === 'number' ? obj.discardPercent : undefined,
        ...(obj.componentPer100g ? { componentPer100g: obj.componentPer100g as Record<string, number> } : {}),
      };
    }).filter(i => (i.ndbNo || i.componentPer100g) && i.portionGrams > 0);

    const servingsNum = Number(servings ?? 1);
    const gramsPerServing = 100; // placeholder; refined at save time

    const buildResult = buildRecipeCommunityV3(
      sectionsList,
      ingList,
      nutrientMap,
      servingsNum > 0 ? servingsNum : 1,
      gramsPerServing,
      typeof cookingMethod === 'string' ? cookingMethod : undefined,
      typeof dishCookTempF === 'number' ? dishCookTempF : undefined,
      typeof dishCookMinutes === 'number' ? dishCookMinutes : undefined,
      typeof fillClass === 'string' ? fillClass : undefined,
      primaryCookStages,
    );

    // Map BuildResult → PreviewNutrition shape for the form
    const p100 = buildResult.per100g;
    // gramsPerServing was passed as a placeholder (100); compute from actual cooked weight.
    const gps  = buildResult.servings > 0
      ? buildResult.totalCookedGrams / buildResult.servings
      : buildResult.gramsPerServing;
    const srv  = buildResult.servings;
    const scale = gps / 100;
    const nutritionJson = {
      perServing: {
        cal:  ((p100.energy_KCal ?? 0) * scale),
        pro:  ((p100.protein     ?? 0) * scale),
        fat:  ((p100.totalLipidFat ?? 0) * scale),
        carb: ((p100.carbohydrate ?? 0) * scale),
        fib:  ((p100.fiberTotalDietary ?? 0) * scale),
        sug:  ((p100.sugarsTotal  ?? 0) * scale),
      },
      per100g: {
        Energy_KCal:       p100.energy_KCal       ?? 0,
        Protein:           p100.protein           ?? 0,
        TotalLipidFat:     p100.totalLipidFat     ?? 0,
        Carbohydrate:      p100.carbohydrate      ?? 0,
        FiberTotalDietary: p100.fiberTotalDietary ?? 0,
        SugarsTotal:       p100.sugarsTotal       ?? 0,
        Water:             p100.water             ?? 0,
      },
      gramsPerServing: gps,
      servings: srv,
    };
    console.log(`[PREVIEW/community] sections=${sectionsList.length} ings=${ingList.length} cal=${nutritionJson.perServing.cal.toFixed(1)}`);
    return json({ nutritionJson: { ...nutritionJson, allocationSections: allocationPreviewSections(buildResult) }, canonical: null });
  }

  // ── Sections-aware path: sections sent but no embedded nutrientMap ──────────
  // When buildNutritionPayload sends sections (multi-section recipes), fetch
  // nutrients from Turso and run V3 so per-section cook methods, yield factors,
  // fill classes, and oven stages are all applied correctly.
  if (Array.isArray(sectionsRaw) && sectionsRaw.length > 0 && communityBuild !== true) {
    const sectionsList = (sectionsRaw as unknown[]).filter(
      (s): s is CommunitySectionV3 =>
        !!s && typeof s === 'object' &&
        typeof (s as Record<string, unknown>).sectionKey === 'string'
    );
    if (sectionsList.length > 0) {
      const ndbNos = rawIngs
        .filter(r => { const o = r as Record<string, unknown>; return !o.exempt && Number(o.portionGrams ?? 0) > 0; })
        .map(r => String((r as Record<string, unknown>).ndbNo ?? ''))
        .filter(ndb => ndb.length > 0);
      let sectionNutrientMap: Map<string, NutrientRow>;
      try {
        sectionNutrientMap = await fetchNutrientsByNdb(ndbNos);
      } catch {
        // Turso unavailable — fall through to flat SR28 path
        sectionNutrientMap = new Map();
      }
      const hasEmbeddedComponents = rawIngs.some((row) => {
        const value = row as Record<string, unknown>;
        return !!value.componentPer100g;
      });
      if (sectionNutrientMap.size > 0 || hasEmbeddedComponents) {
        const ingList: CommunityIngredient[] = rawIngs.map(r => {
          const o = r as Record<string, unknown>;
          const removal = normalizeIngredientRemoval(o);
          return {
            ndbNo:        String(o.ndbNo ?? ''),
            portionGrams: totalIngredientGrams(o),
            sectionKey:   typeof (o.sectionKey ?? o.section) === 'string' ? String(o.sectionKey ?? o.section) : undefined,
            isOptional:   o.exempt === true,
            exempt:       false,
            displayName:  String(o.name ?? ''),
            removedAfterPrep: removal.removedAfterPrep,
            removalAmount: removal.removalAmount,
            removalUnit: removal.removalUnit,
            discarded: o.discarded === true,
            discardPercent: typeof o.discardPercent === 'number' ? o.discardPercent : undefined,
            ...(o.componentPer100g ? { componentPer100g: o.componentPer100g as Record<string, number> } : {}),
          };
        }).filter(i => (i.ndbNo || i.componentPer100g) && i.portionGrams > 0);
        const servingsNum = Number(servings ?? 1);
        const buildResult = buildRecipeCommunityV3(
          sectionsList,
          ingList,
          sectionNutrientMap,
          servingsNum > 0 ? servingsNum : 1,
          100, // placeholder; actual grams-per-serving computed by V3
          typeof dishCookMethod === 'string' ? dishCookMethod
            : (typeof cookingMethod === 'string' ? cookingMethod : undefined),
          typeof dishCookTempF   === 'number' ? (dishCookTempF   as number) : undefined,
          typeof dishCookMinutes === 'number' ? (dishCookMinutes as number) : undefined,
          typeof fillClass === 'string' ? fillClass : undefined,
          primaryCookStages,
        );
        const p100 = buildResult.per100g;
        // gramsPerServing was passed as a placeholder (100); compute from actual cooked weight.
        const gps  = buildResult.servings > 0
          ? buildResult.totalCookedGrams / buildResult.servings
          : buildResult.gramsPerServing;
        const srv  = buildResult.servings;
        const scale = gps / 100;
        return json({
          nutritionJson: {
            perServing: {
              cal:  (p100.energy_KCal       ?? 0) * scale,
              pro:  (p100.protein           ?? 0) * scale,
              fat:  (p100.totalLipidFat     ?? 0) * scale,
              carb: (p100.carbohydrate      ?? 0) * scale,
              fib:  (p100.fiberTotalDietary ?? 0) * scale,
              sug:  (p100.sugarsTotal       ?? 0) * scale,
            },
            per100g: {
              Energy_KCal:       p100.energy_KCal       ?? 0,
              Protein:           p100.protein           ?? 0,
              TotalLipidFat:     p100.totalLipidFat     ?? 0,
              Carbohydrate:      p100.carbohydrate      ?? 0,
              FiberTotalDietary: p100.fiberTotalDietary ?? 0,
              SugarsTotal:       p100.sugarsTotal       ?? 0,
              Water:             p100.water             ?? 0,
            },
            gramsPerServing: gps,
            servings: srv,
            allocationSections: allocationPreviewSections(buildResult),
          },
          canonical: null,
        });
      }
    }
  }

  // ── Flat V3 path: no sections but has componentPer100g ingredients ─────────
  // When any ingredient is a componentRef (recipe-as-ingredient), SR28 lookup
  // can't handle it. Use V3 with empty sections so componentPer100g is applied.
  const hasComponentRefs = rawIngs.some(r => !!(r as Record<string, unknown>).componentPer100g);
  const hasCanonicalRemoval = rawIngs.some(r => {
    if (!r || typeof r !== 'object') return false;
    const obj = r as Record<string, unknown>;
    return obj.removedAfterPrep === true;
  });
  if ((hasComponentRefs || hasCanonicalRemoval) && (!Array.isArray(sectionsRaw) || sectionsRaw.length === 0)) {
    const sr28Ndbs = rawIngs
      .filter(r => { const o = r as Record<string, unknown>; return !o.exempt && Number(o.portionGrams ?? 0) > 0 && o.ndbNo; })
      .map(r => String((r as Record<string, unknown>).ndbNo ?? ''))
      .filter(ndb => ndb.length > 0);
    let flatNutrientMap: Map<string, NutrientRow>;
    try { flatNutrientMap = await fetchNutrientsByNdb(sr28Ndbs); }
    catch { flatNutrientMap = new Map(); }
    const flatIngList: CommunityIngredient[] = rawIngs.map(r => {
      const o = r as Record<string, unknown>;
      const removal = normalizeIngredientRemoval(o);
      return {
        ndbNo:        String(o.ndbNo ?? ''),
        portionGrams: totalIngredientGrams(o),
        isOptional:   o.exempt === true,
        exempt:       false,
        displayName:  String(o.name ?? ''),
        removedAfterPrep: removal.removedAfterPrep,
        removalAmount: removal.removalAmount,
        removalUnit: removal.removalUnit,
        discarded: o.discarded === true,
        discardPercent: typeof o.discardPercent === 'number' ? o.discardPercent : undefined,
        ...(o.componentPer100g ? { componentPer100g: o.componentPer100g as Record<string, number> } : {}),
      };
    }).filter(i => (i.ndbNo || i.componentPer100g) && i.portionGrams > 0);
    if (flatIngList.length > 0) {
      const servingsNum = Number(servings ?? 1);
      const flatResult = buildRecipeCommunityV3([], flatIngList, flatNutrientMap,
        servingsNum > 0 ? servingsNum : 1, 100,
        typeof cookingMethod === 'string' ? cookingMethod : undefined);
      const p100 = flatResult.per100g;
      const gps = flatResult.totalCookedGrams / Math.max(1, flatResult.servings);
      const scale = gps / 100;
      return json({
        nutritionJson: {
          perServing: { cal: (p100.energy_KCal ?? 0) * scale, pro: (p100.protein ?? 0) * scale, fat: (p100.totalLipidFat ?? 0) * scale, carb: (p100.carbohydrate ?? 0) * scale, fib: (p100.fiberTotalDietary ?? 0) * scale, sug: (p100.sugarsTotal ?? 0) * scale },
          per100g: { Energy_KCal: p100.energy_KCal ?? 0, Protein: p100.protein ?? 0, TotalLipidFat: p100.totalLipidFat ?? 0, Carbohydrate: p100.carbohydrate ?? 0, FiberTotalDietary: p100.fiberTotalDietary ?? 0, SugarsTotal: p100.sugarsTotal ?? 0, Water: p100.water ?? 0 },
          gramsPerServing: gps,
          servings: flatResult.servings,
          allocationSections: allocationPreviewSections(flatResult),
        },
        canonical: null,
      });
    }
  }

  // Drop any rows that are not yet nutritionally linked. Live preview computes
  // from whatever IS linked rather than blocking on partial data.
  const linkedIngs = rawIngs.filter((row) => hasValidLink(row));
  if (linkedIngs.length === 0 && !hasValidLink(dishLink)) {
    return json({ nutritionJson: null });
  }

  if (linkType === 'dish' && !hasValidLink(dishLink)) {
    return json({ nutritionJson: null });
  }

  // When real ingredient rows are present, always sum them directly.
  // The isDish row (e.g. a USDA composite NDB) is a UI reference only — never
  // use it as the nutrition source for a live preview. This matches the v2
  // pipeline which always derived nutrition from the ingredient list.
  const normalizedIngs = linkedIngs.map((row) => withDefaultServingCount(row));
  const hasRealIngredients = normalizedIngs.length > 0;

  let ingRows: Parameters<typeof calcNutritionSR28>[0];
  let resolvedLinkType: string;

  if (hasRealIngredients) {
    // Strip any isDish rows — sum the actual ingredients only.
    ingRows = normalizedIngs.filter((r) => !(r as Record<string, unknown>).isDish) as Parameters<typeof calcNutritionSR28>[0];
    resolvedLinkType = 'ingredient';
  } else {
    // No ingredient rows — fall back to dishLink lookup as before.
    const dishLinkEntry = (linkType === 'dish' || linkType === 'mixed') && dishLink && typeof dishLink === 'object'
      ? { isDish: true, ...(withDefaultServingCount(dishLink) as object) }
      : null;
    ingRows = (dishLinkEntry ? [dishLinkEntry, ...normalizedIngs] : normalizedIngs) as Parameters<typeof calcNutritionSR28>[0];
    resolvedLinkType = linkType;
  }

  const servingsStr = typeof servings === 'string' ? servings : null;
  const cookMethod = typeof cookingMethod === 'string' ? cookingMethod : null;

  const yieldOpts = {
    ...(typeof yieldFactorWater === 'number' ? { yieldFactorWater } : {}),
    ...(typeof yieldFactorFat   === 'number' ? { yieldFactorFat }   : {}),
  };
  const result = await calcNutritionSR28(ingRows, resolvedLinkType, servingsStr, cookMethod, yieldOpts);
  const ingHash = ingRows.map(r => `${r.ndbNo || r.foodWord || 'unlinked'}:${r.portionGrams}`).join('|');
  console.log(`[PREVIEW] linkType=${resolvedLinkType} rows=${ingRows.length} cal=${result?.perServing?.cal ?? 'null'} ings=[${ingHash}]`);

  // ── Canonical sidecar for Rule A/B audit gap chart ────────────────────────
  // When a dishLink is present, also compute pure canonical nutrition (single
  // SR28 row scaled to its portion) so the form can chart the gap between
  // canonical and the ingredient-summed build. Independent of linkType — we
  // always want canonical when it exists, even in 'ingredient' mode where it
  // would normally be unused.
  let canonical: typeof result = null;
  if (hasValidLink(dishLink)) {
    const dishOnly = [{ isDish: true, ...(withDefaultServingCount(dishLink) as object) }] as Parameters<typeof calcNutritionSR28>[0];
    canonical = await calcNutritionSR28(dishOnly, 'dish', servingsStr, cookMethod, yieldOpts);
  }

  return json({ nutritionJson: result, canonical });
};
