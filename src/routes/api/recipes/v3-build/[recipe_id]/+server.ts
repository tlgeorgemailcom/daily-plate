import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile } from 'node:fs/promises';
import { resolve, normalize } from 'node:path';

/**
 * GET /api/recipes/v3-build/[recipe_id]
 *
 * Returns the v3 pipeline's build artifact for a recipe, read directly from
 * `recipes_v3/output/builds/<recipe_id>.json`.
 *
 * Used by the Edit Recipe audit gap chart so moderators can see v3's per-100g
 * (which has been validated against canonical USDA) without v3 ever writing
 * to Turso. Read-only by design.
 *
 * Response 200: { recipe_id, per100g, gramsPerServing, yieldFactorWater,
 *                 yieldFactorFat, srRule, cookMethod, cookedTotalGrams,
 *                 servingsCount, builtAt }
 * Response 404: build artifact does not exist for this recipe_id
 */

const RECIPE_ID_RE = /^[A-Z]+_[0-9]+$/;
const BUILDS_DIR = resolve(process.cwd(), 'recipes_v3', 'output', 'builds');

export const GET: RequestHandler = async ({ params }) => {
  const recipeId = params.recipe_id;
  if (!recipeId || !RECIPE_ID_RE.test(recipeId)) {
    throw error(400, 'Invalid recipe_id');
  }

  const filePath = normalize(resolve(BUILDS_DIR, `${recipeId}.json`));
  if (!filePath.startsWith(BUILDS_DIR + '/')) {
    throw error(400, 'Path traversal blocked');
  }

  let raw: string;
  try {
    raw = await readFile(filePath, 'utf-8');
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err && err.code === 'ENOENT') {
      throw error(404, `No v3 build for ${recipeId}`);
    }
    throw error(500, `Failed to read v3 build: ${err?.message ?? 'unknown'}`);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw error(500, 'v3 build JSON is malformed');
  }

  return json({
    recipe_id: parsed.recipe_id,
    srRule: parsed.sr_rule,
    cookMethod: parsed.cooking_method ?? parsed.cook_method,
    cookMethodNormalized: parsed.cooking_method_normalized ?? parsed.cook_method_normalized,
    yieldFactorWater: parsed.yield_factor_water,
    yieldFactorFat: parsed.yield_factor_fat,
    servingsCount: parsed.servings_count,
    cookedTotalGrams: parsed.cooked_total_grams,
    gramsPerServing: parsed.grams_per_serving,
    per100g: parsed.per100g,
    perServing: parsed.per_serving,
    skippedIngredients: parsed.skipped_ingredients ?? [],
    auditStatus: parsed.audit_status ?? '',
    auditNotes: parsed.audit_notes ?? '',
    ingredients: parsed.ingredients ?? [],
  });
};
