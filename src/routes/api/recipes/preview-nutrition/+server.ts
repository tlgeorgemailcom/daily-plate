import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';

function hasValidLink(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const obj = row as Record<string, unknown>;
  const hasFood = (typeof obj.foodWord === 'string' && obj.foodWord.trim().length > 0)
    || (typeof obj.ndbNo === 'string' && obj.ndbNo.trim().length > 0);
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
  } = body as Record<string, unknown>;

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
