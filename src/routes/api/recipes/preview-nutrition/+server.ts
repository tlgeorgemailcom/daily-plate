import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calcNutritionJson } from '$lib/server/calcNutrition';

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
    cookingMethod
  } = body as Record<string, unknown>;

  if (typeof linkType !== 'string' || !linkType) {
    return json({ nutritionJson: null });
  }

  const rawIngs: unknown[] = Array.isArray(ingredients) ? ingredients : [];
  if (rawIngs.length === 0 && !dishLink) {
    return json({ nutritionJson: null });
  }

  // Build ingredient rows — mirror what draft/+server.ts and submit/+server.ts do.
  const dishLinkEntry = dishLink && typeof dishLink === 'object'
    ? { isDish: true, ...(dishLink as object) }
    : null;
  const ingRows = (dishLinkEntry ? [dishLinkEntry, ...rawIngs] : rawIngs) as Parameters<typeof calcNutritionJson>[0];

  const servingsStr = typeof servings === 'string' ? servings : null;
  const cookMethod = typeof cookingMethod === 'string' ? cookingMethod : null;

  const result = calcNutritionJson(ingRows, linkType, servingsStr, cookMethod);

  return json({ nutritionJson: result });
};
