/**
 * buildRecipeCommunityV3.ts — TypeScript port of the recipes_v3 Python pipeline.
 *
 * This is a PARALLEL implementation of buildRecipeCommunity.ts that mirrors
 * recipes_v3/lib/build.py exactly:
 *
 *   1. prep_method is DISPLAY ONLY — never enters retention or yield calculations.
 *   2. yieldFactorWater is used DIRECTLY when provided (locked value from
 *      upload.py / sections_json). calcYieldWater() fires only as a fallback
 *      when the locked value is absent.
 *   3. yieldFactorFat, yieldFactorProtein, yieldFactorCarbohydrate, yieldFactorOther
 *      are applied as explicit post-retention multipliers to section totals
 *      (fat-drain, protein loss to stock, carbohydrate leaching, fat-soluble vitamins).
 *   4. Atwater energy recompute fires when any of yff/yfp/yfc < 1.0, matching
 *      the Python build.py behaviour.
 *   5. fillClass comes from section metadata (CommunitySectionV3.fillClass);
 *      inferFillingClass() is only a fallback when fillClass is absent.
 *
 * The existing buildRecipeCommunity.ts (V1) is unchanged — this runs alongside it.
 *
 * STATUS: parity testing in progress. Not yet wired into production paths.
 */

import type {
  CommunitySection,
  CommunityIngredient,
  NutrientRow,
  BuildResult,
  SectionBuildResult,
  MacroMap,
  SkippedIngredient,
} from './types.js';
import { inferFillingClass } from './inferFillingClass.js';
import { calcYieldWater }    from './yieldCalc.js';
import { plausibilityCheck } from './plausibilityCheck.js';
import {
  applyRetention,
  getRetentionFactor,
  mapDishMethodToCookingMethod,
  type CookingMethod,
} from '$lib/data/cookingLossModel.js';

// ── Nutrient key list (same as V1) ────────────────────────────────────────────
const MACRO_KEYS: Array<keyof Omit<NutrientRow, 'ndbNo' | 'longDesc' | 'fdGrpCd'>> = [
  'energy_KCal',
  'water',
  'protein',
  'totalLipidFat',
  'carbohydrate',
  'sugarsTotal',
  'fiberTotalDietary',
  'ash',
  'fattyAcids_totalSaturated',
  'fattyAcids_totalMonounsaturated',
  'fattyAcids_totalPolyunsaturated',
  'cholesterol',
  'calcium_Ca',
  'iron_Fe',
  'magnesium_Mg',
  'phosphorus_P',
  'potassium_K',
  'sodium_Na',
  'zinc_Zn',
  'vitaminC_totalAscorbicAcid',
  'thiamin',
  'riboflavin',
  'niacin',
  'vitaminB6',
  'folateDFE',
  'vitaminB12',
  'vitaminA_RAE',
  'vitaminD',
  'vitaminE_alphaTocopherol',
  'vitaminK_phylloquinone',
];

// Map NutrientRow camelCase keys → DataCentralCombo column names for applyRetention
const KEY_TO_COLUMN: Partial<Record<keyof Omit<NutrientRow, 'ndbNo' | 'longDesc' | 'fdGrpCd'>, string>> = {
  energy_KCal:                    'Energy_KCal',
  water:                          'Water',
  protein:                        'Protein',
  totalLipidFat:                  'TotalLipidFat',
  carbohydrate:                   'Carbohydrate',
  sugarsTotal:                    'SugarsTotal',
  fiberTotalDietary:              'FiberTotalDietary',
  ash:                            'Ash',
  fattyAcids_totalSaturated:     'FattyAcids_totalSaturated',
  fattyAcids_totalMonounsaturated:'FattyAcids_totalMonounsaturated',
  fattyAcids_totalPolyunsaturated:'FattyAcids_totalPolyunsaturated',
  cholesterol:                    'Cholesterol',
  calcium_Ca:                     'Calcium_Ca',
  iron_Fe:                        'Iron_Fe',
  magnesium_Mg:                   'Magnesium_Mg',
  phosphorus_P:                   'Phosphorus_P',
  potassium_K:                    'Potassium_K',
  sodium_Na:                      'Sodium_Na',
  zinc_Zn:                        'Zinc_Zn',
  vitaminC_totalAscorbicAcid:    'VitaminC_totalAscorbicAcid',
  thiamin:                        'Thiamin',
  riboflavin:                     'Riboflavin',
  niacin:                         'Niacin',
  vitaminB6:                      'VitaminB6',
  folateDFE:                      'Folate_DFE',
  vitaminB12:                     'VitaminB12',
  vitaminA_RAE:                   'VitaminA_RAE',
  vitaminD:                       'VitaminD',
  vitaminE_alphaTocopherol:      'VitaminE_alphaTocopherol',
  vitaminK_phylloquinone:        'VitaminK_phylloquinone',
};

/**
 * Fat-soluble nutrient keys — yieldFactorOther (yfo) applies only to these.
 * Mirrors recipes_v3/lib/build.py::_FAT_SOLUBLE_NUTRIENTS.
 */
const FAT_SOLUBLE_KEYS = new Set<string>([
  'vitaminK_phylloquinone',
  'vitaminA_RAE',
  'vitaminD',
  'vitaminE_alphaTocopherol',
]);

// ── Extended section interface ────────────────────────────────────────────────

/**
 * CommunitySection extended with the yield factors written by upload.py into
 * sections_json, and an explicit fillClass from recipe_sections.csv metadata.
 *
 * All new fields are optional — the function falls back gracefully when absent.
 * This interface is a strict superset of CommunitySection so it can be passed
 * wherever CommunitySection is accepted.
 */
export interface CommunitySectionV3 extends CommunitySection {
  /**
   * Pre-computed yield factor from the Python pipeline (sections_json).
   * When this is a finite number it is used directly — no call to calcYieldWater().
   * This is the primary path for all dev recipes imported from Turso.
   */
  yieldFactorWater?: number;

  /**
   * Fat drain factor.  < 1.0 when fat is physically discarded after cooking
   * (e.g. ground beef drained after browning, sausage fat drained from pan).
   * Applied to totalLipidFat and all fatty acid sub-columns after retention.
   */
  yieldFactorFat?: number;

  /**
   * Protein yield factor.  < 1.0 for stocks and broths where collagen and
   * myosin extract into the liquid but solids are strained out.
   * Applied to protein (and downstream amino acids) after retention.
   */
  yieldFactorProtein?: number;

  /**
   * Carbohydrate yield factor.  < 1.0 for stocks where wine or high-sugar
   * ingredients leach soluble carbs into the liquid phase (Phase 8e).
   * Applied to carbohydrate and sugarsTotal after retention.
   */
  yieldFactorCarbohydrate?: number;

  /**
   * Fat-soluble vitamin factor (Phase 8f).  < 1.0 for stocks — VitK, VitA,
   * VitD, VitE partition into fat/solids and leave with the strained discard.
   * Applied only to FAT_SOLUBLE_KEYS after retention.
   */
  yieldFactorOther?: number;

  /**
   * Explicit filling class from recipe_sections.csv (e.g. 'dense_fruit',
   * 'dairy_custard', 'pastry').  When present, used directly.  When absent,
   * inferFillingClass() fires as a fallback (same as V1 behaviour).
   */
  fillClass?: string;
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Build the nutrition profile for a community recipe using the recipes_v3
 * Python pipeline math contract.
 *
 * Math contract (mandatory order):
 *   1. Partition active ingredients by section.
 *   2. For each section:
 *        a. Apply retention factors using cook_method only (prep_method ignored).
 *        b. Sum retained nutrients.
 *        c. Scale water column by yieldFactorWater (locked → direct; else computed).
 *        d. Scale fat by yieldFactorFat, protein by yieldFactorProtein,
 *           carbs by yieldFactorCarbohydrate, fat-soluble vitamins by yieldFactorOther.
 *        e. Recompute Atwater energy when any of yff/yfp/yfc < 1.0.
 *   3. Sum section totals → global totals.
 *   4. Divide by total cooked grams → per-100g profile.
 *   5. Plausibility check.
 *
 * @param sections        Array of CommunitySectionV3 (superset of CommunitySection).
 * @param ingredients     All recipe ingredients.
 * @param nutrientMap     NutrientRow keyed by ndbNo.
 * @param servings        Number of servings.
 * @param gramsPerServing Expected grams per serving for plausibility check.
 */
export function buildRecipeCommunityV3(
  sections: CommunitySectionV3[],
  ingredients: CommunityIngredient[],
  nutrientMap: Map<string, NutrientRow>,
  servings: number,
  gramsPerServing: number,
  dishCookMethod?: string,
  dishCookTempF?: number,
  dishCookMinutes?: number,
): BuildResult {
  // ── Recipe-level (top bar) primary cook parameters ──────────────────────────
  // The top bar represents the final assembled-bake or primary cook applied to
  // the whole dish. When set it overrides each section’s own cook_method for
  // effectiveCookMethod. Sections without their own oven stages inherit the
  // top-bar temp/minutes as the oven stage source.
  const primaryCookMethod: CookingMethod | undefined = dishCookMethod
    ? mapDishMethodToCookingMethod(dishCookMethod)
    : undefined;
  const rawDish = dishCookMethod?.trim().toLowerCase() ?? '';
  const primaryCookTempF =
    rawDish === 'sub-simmer' ? 180 :
    rawDish === 'simmer'     ? 195 :
    rawDish === 'braise'     ? 185 : 212;
  const primaryCookLidOn = rawDish === 'braise';

  const sectionResults: SectionBuildResult[] = [];
  const globalSkipped: SkippedIngredient[]   = [];

  // ── Partition ingredients by section ────────────────────────────────────────
  const sectionKeys = sections.map(s => s.sectionKey);
  const buckets = new Map<string, CommunityIngredient[]>();
  for (const sk of [...sectionKeys, '__unsectioned__']) {
    buckets.set(sk, []);
  }
  for (const ing of ingredients) {
    const key = ing.sectionKey ?? '__unsectioned__';
    const bucket = buckets.get(key) ?? buckets.get('__unsectioned__')!;
    bucket.push(ing);
  }

  // ── Wrapped-section detection (same heuristic as V1) ────────────────────────
  const wrappedKeys = new Set<string>();
  let hasPastrySection = false;
  for (const sec of sections) {
    const lbl = sec.sectionLabel.toLowerCase();
    if (/crust|pastry|shell|wrapper/i.test(lbl)) {
      hasPastrySection = true;
    } else if (hasPastrySection && /fill|fruit|custard|top/i.test(lbl)) {
      wrappedKeys.add(sec.sectionKey);
    }
  }

  // ── Global accumulators ──────────────────────────────────────────────────────
  let totalCookedGrams = 0;
  let totalRawGrams    = 0;
  const globalTotals: MacroMap = {};
  for (const key of MACRO_KEYS) {
    (globalTotals as Record<string, number>)[key] = 0;
  }

  const allSections: CommunitySectionV3[] = [
    ...sections,
    ...(buckets.get('__unsectioned__')!.length > 0
      ? [{ sectionKey: '__unsectioned__', sectionLabel: 'Unsectioned', cookMethod: dishCookMethod ?? 'raw' } as CommunitySectionV3]
      : []),
  ];

  // ── Section loop ─────────────────────────────────────────────────────────────
  for (const sec of allSections) {
    const bucket = buckets.get(sec.sectionKey) ?? [];

    // effectiveCookMethod = top bar’s method (if set) OR section’s own cook_method.
    // This represents the final/assembled cook applied to the whole dish.
    const effectiveCookMethod: CookingMethod = primaryCookMethod ?? mapDishMethodToCookingMethod(sec.cookMethod);
    // Stovetop temperature for evaporation model when effectiveCookMethod=‘boiled’.
    const secCookStr = sec.cookMethod.toLowerCase();
    const effectiveTempF = primaryCookMethod
      ? primaryCookTempF
      : (secCookStr === 'sub-simmer' ? 180 : secCookStr === 'simmer' ? 195 : secCookStr === 'braise' ? 185 : 212);
    const effectiveLidOn = primaryCookMethod ? primaryCookLidOn : (secCookStr === 'braise');

    // Pre-step: section’s own prepMethod fires BEFORE the primary cook.
    // e.g. simmer the apple filling 5 min, then bake the assembled pie 52 min.
    // Only active when the pre-step resolves to a DIFFERENT cook method than the
    // primary (prevents double-counting when the section IS the primary cook,
    // e.g. a soup where prepMethod=‘simmer’ ≡ effectiveCookMethod=‘boiled’).
    const prepMethodStr = ((sec as any).prepMethod ?? (sec as any).prep_method ?? '') as string;
    const prepCookMethodRaw: CookingMethod | null =
      (prepMethodStr && prepMethodStr !== 'none' && prepMethodStr !== 'raw')
        ? mapDishMethodToCookingMethod(prepMethodStr)
        : null;
    const hasPrepStep = prepCookMethodRaw !== null && prepCookMethodRaw !== effectiveCookMethod;
    const prepCookMethod: CookingMethod | null = hasPrepStep ? prepCookMethodRaw : null;
    const prepTempF = prepMethodStr === 'sub-simmer' ? 180 : prepMethodStr === 'simmer' ? 195 : prepMethodStr === 'braise' ? 185 : 212;
    const prepLidOn = prepMethodStr === 'braise';

    const skipped: SkippedIngredient[] = [];
    const active: Array<{ grams: number; nutrients: NutrientRow }> = [];
    for (const ing of bucket) {
      if (ing.isOptional) { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'optional'    }); continue; }
      if (ing.exempt)     { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'exempt'      }); continue; }
      const nr = nutrientMap.get(ing.ndbNo);
      if (!nr)            { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'missing_ndb' }); continue; }
      active.push({ grams: ing.portionGrams, nutrients: nr });
    }
    globalSkipped.push(...skipped);

    if (active.length === 0) continue;

    const isWrapped = wrappedKeys.has(sec.sectionKey);

    // ── Water yield ────────────────────────────────────────────────────────────
    // Priority 1: locked value from Python pipeline (sections_json).
    // Priority 2: compute via calcYieldWater with fill class + oven stages.
    // Priority 3: 1.0 (no water loss — raw / unrecognised method).
    const initialWaterG = active.reduce((sum, a) =>
      sum + (a.nutrients.water / 100) * a.grams, 0
    );

    let yieldWater: number;

    if (typeof sec.yieldFactorWater === 'number' && isFinite(sec.yieldFactorWater)) {
      // ── Path A: locked value (dev recipe import from Turso sections_json) ──
      yieldWater = sec.yieldFactorWater;
    } else {
      // ── Path B: compute from filling class + oven stages ──────────────────
      // fillClass: prefer explicit metadata; fall back to ingredient inference.
      const fillClass = (sec.fillClass && sec.fillClass !== '')
        ? sec.fillClass
        : inferFillingClass(active, isWrapped);

      // Build oven stages from section metadata (same logic as V1).
      const stages: Array<[number, number]> =
        sec.stages && sec.stages.length > 0
          ? sec.stages
              .filter(st => st.tempF > 0 && st.minutes > 0)
              .map(st => [st.tempF, st.minutes] as [number, number])
          : sec.cookTempF && sec.cookMinutes && sec.cookTempF > 0
            ? [[sec.cookTempF, sec.cookMinutes]]
            : [];

      // For boiled sections: check absorption model first (pasta, legumes, grains).
      // Matches the Python absorption model in build.py.
      if (effectiveCookMethod === 'boiled') {
        const absorbers = active.filter(a => a.nutrients.absorptionFactor != null);
        if (absorbers.length > 0) {
          const absorberGrams    = absorbers.reduce((s, a) => s + a.grams, 0);
          const weightedFactor   = absorbers.reduce((s, a) => s + (a.nutrients.absorptionFactor! * a.grams), 0) / absorberGrams;
          const totalRawG        = active.reduce((s, a) => s + a.grams, 0);
          const dryNonWaterG     = totalRawG - initialWaterG;
          const retainedWaterG   = dryNonWaterG * weightedFactor / (1 - weightedFactor);
          yieldWater = initialWaterG > 0 ? retainedWaterG / initialWaterG : 1.0;
        } else {
          const boilMins = (sec as any).boilMinutes ?? (sec as any).boil_minutes ?? 0;
          yieldWater = calcYieldWater(stages, initialWaterG, fillClass, boilMins, 212, false);
        }
      } else {
        const boilMins = (sec as any).boilMinutes ?? (sec as any).boil_minutes ?? 0;
        yieldWater = calcYieldWater(stages, initialWaterG, fillClass, boilMins);
      }
    }

    // ── Read yield factors (default 1.0 = no effect) ──────────────────────────
    const yff = sec.yieldFactorFat          ?? 1.0;
    const yfp = sec.yieldFactorProtein      ?? 1.0;
    const yfc = sec.yieldFactorCarbohydrate ?? 1.0;
    const yfo = sec.yieldFactorOther        ?? 1.0;

    // ── Step 1+2: Sum retained nutrients ──────────────────────────────────────────────
    // Two-pass when hasPrepStep: pre-step retention × primary cook retention.
    // Each cook method has its own factor table in COOKING_RETENTION.
    // Single-pass otherwise (primary cook only).
    const sectionTotals: Record<string, number> = {};
    let rawGrams = 0;

    for (const { grams, nutrients } of active) {
      rawGrams += grams;
      for (const key of MACRO_KEYS) {
        const rawPer100g = (nutrients as unknown as Record<string, number>)[key] ?? 0;
        const colName    = KEY_TO_COLUMN[key] ?? key;
        let retained: number;
        if (key === 'water') {
          // Water: yield factor applied via yieldWater below.
          retained = rawPer100g * (grams / 100);
        } else if (hasPrepStep && prepCookMethod) {
          // Two-pass: pre-step retention × primary cook retention.
          // e.g. simmer’s VitC 0.50 × baked’s VitC factor.
          const prepFactor    = getRetentionFactor(prepCookMethod, colName);
          const primaryFactor = getRetentionFactor(effectiveCookMethod, colName);
          retained = rawPer100g * (grams / 100) * prepFactor * primaryFactor;
        } else {
          retained = applyRetention(rawPer100g, grams, effectiveCookMethod, colName);
        }
        sectionTotals[key] = (sectionTotals[key] ?? 0) + retained;
      }
    }

    // ── Step 3: Apply water yield to water column ──────────────────────────────
    sectionTotals['water'] = (sectionTotals['water'] ?? 0) * yieldWater;

    // ── Step 4: Apply fat / protein / carb yield factors (post-retention) ──────
    if (yff !== 1.0) {
      sectionTotals['totalLipidFat']                  = (sectionTotals['totalLipidFat'] ?? 0) * yff;
      sectionTotals['fattyAcids_totalSaturated']      = (sectionTotals['fattyAcids_totalSaturated'] ?? 0) * yff;
      sectionTotals['fattyAcids_totalMonounsaturated']= (sectionTotals['fattyAcids_totalMonounsaturated'] ?? 0) * yff;
      sectionTotals['fattyAcids_totalPolyunsaturated']= (sectionTotals['fattyAcids_totalPolyunsaturated'] ?? 0) * yff;
      sectionTotals['cholesterol']                    = (sectionTotals['cholesterol'] ?? 0) * yff;
    }
    if (yfp !== 1.0) {
      sectionTotals['protein'] = (sectionTotals['protein'] ?? 0) * yfp;
    }
    if (yfc !== 1.0) {
      sectionTotals['carbohydrate'] = (sectionTotals['carbohydrate'] ?? 0) * yfc;
      sectionTotals['sugarsTotal']  = (sectionTotals['sugarsTotal']  ?? 0) * yfc;
      sectionTotals['fiberTotalDietary'] = (sectionTotals['fiberTotalDietary'] ?? 0) * yfc;
    }
    if (yfo !== 1.0) {
      for (const fatKey of FAT_SOLUBLE_KEYS) {
        sectionTotals[fatKey] = (sectionTotals[fatKey] ?? 0) * yfo;
      }
    }

    // ── Step 5: Atwater energy recompute (matches Python build.py) ─────────────
    // Fires when any macro yield factor < 1.0 to avoid overcounting drained calories.
    if (yff < 1.0 || yfp < 1.0 || yfc < 1.0) {
      sectionTotals['energy_KCal'] =
        (sectionTotals['protein']      ?? 0) * 4 +
        (sectionTotals['totalLipidFat']?? 0) * 9 +
        (sectionTotals['carbohydrate'] ?? 0) * 4;
    }

    // ── Cooked grams = raw grams minus water lost ──────────────────────────────
    const waterLost   = initialWaterG * (1 - yieldWater);
    const cookedGrams = rawGrams - waterLost;

    // ── Accumulate into global totals ──────────────────────────────────────────
    for (const key of MACRO_KEYS) {
      (globalTotals as Record<string, number>)[key]! += sectionTotals[key] ?? 0;
    }
    totalRawGrams    += rawGrams;
    totalCookedGrams += cookedGrams;

    // Infer fillClass for the result record (for plausibility + display).
    const fillingClass = (sec.fillClass && sec.fillClass !== '')
      ? sec.fillClass
      : inferFillingClass(active, isWrapped);

    sectionResults.push({
      sectionKey:        sec.sectionKey,
      sectionLabel:      sec.sectionLabel,
      fillingClass,
      yieldFactorWater:  yieldWater,
      cookMethod:        effectiveCookMethod,
      rawGrams,
      cookedGrams,
      retainedNutrients: sectionTotals as MacroMap,
      skipped,
    });
  }

  // ── Per-100g profile ─────────────────────────────────────────────────────────
  const per100g: MacroMap = {};
  if (totalCookedGrams > 0) {
    for (const key of MACRO_KEYS) {
      (per100g as Record<string, number>)[key] =
        ((globalTotals as Record<string, number>)[key] ?? 0) / totalCookedGrams * 100;
    }
  }

  const plausibility = plausibilityCheck(per100g, totalCookedGrams, globalSkipped, sectionResults);

  return {
    per100g,
    gramsPerServing,
    totalRawGrams,
    totalCookedGrams,
    servings,
    sections: sectionResults,
    plausibility,
  };
}
