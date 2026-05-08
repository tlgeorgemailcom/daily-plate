import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/recipes/v3-build/[recipe_id]
 *
 * Returns the v3 pipeline's build artifact for a recipe.
 *
 * The build JSONs (`recipes_v3/output/builds/<recipe_id>.json`) are bundled
 * at build time via Vite's `import.meta.glob({ eager: true })`, so they ship
 * inside the SvelteKit serverless function on Vercel without depending on
 * the deploy-time file layout. (A previous version used `fs.readFile` with
 * `process.cwd()`, which silently 404'd on Vercel because the function
 * bundle only includes files reachable through static imports.)
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

// Bundle every build JSON at build time. The path is relative to this file:
// src/routes/api/recipes/v3-build/[recipe_id]/  →  ../../../../../  →  repo root
// then  recipes_v3/output/builds/*.json
const BUILDS = import.meta.glob<Record<string, unknown>>(
  '../../../../../../recipes_v3/output/builds/*.json',
  { eager: true, import: 'default' },
);

const BUILDS_BY_ID: Record<string, Record<string, unknown>> = {};
for (const [path, data] of Object.entries(BUILDS)) {
  const m = path.match(/\/([A-Z]+_[0-9]+)\.json$/);
  if (m) BUILDS_BY_ID[m[1]] = data;
}

export const GET: RequestHandler = async ({ params }) => {
  const recipeId = params.recipe_id;
  if (!recipeId || !RECIPE_ID_RE.test(recipeId)) {
    throw error(400, 'Invalid recipe_id');
  }

  const parsed = BUILDS_BY_ID[recipeId];
  if (!parsed) {
    throw error(404, `No v3 build for ${recipeId}`);
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
