import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

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

  // ── Section cook data: prefer Turso (always current) over build JSON ──────
  // ── Sections + Ingredients: Turso is the sole source of truth ────────────
  // upload.py writes both sections_json and recipe_ingredients_json on every
  // --commit run. Reading from Turso means forms always see current data
  // without requiring a Vite rebuild. Fall back to build JSON only when Turso
  // is unavailable.
  type SectionRow = Record<string, unknown>;
  type TursoIngredient = {
    name: string; quantity: string; section?: string; foodWord?: string;
    ndbNo: string | number; portionDesc?: string; portionGrams: number;
    servingCount?: number; isDish?: boolean; componentRef?: string;
    componentPer100g?: Record<string, number>;
  };

  let tursoSections: SectionRow[] | null = null;
  let tursoIngredients: TursoIngredient[] | null = null;
  // Turso is the source of truth for all form-populating fields.
  // cooking_method is read from Turso so the form top bar reflects what
  // is actually stored — not what the pipeline happened to compute.
  let tursoCookingMethod: string | null = null;
  let tursoCookMinutes: number | null = null;
  let tursoCookTempF: number | null = null;
  try {
    const db = getGameDb();
    const result = await db.execute({
      sql: 'SELECT sections_json, recipe_ingredients_json, cooking_method, cook_minutes, cook_temp_f FROM dev_recipes WHERE recipe_id = ?',
      args: [recipeId],
    });
    if (result.rows.length > 0) {
      const rawSections = result.rows[0].sections_json as string | null;
      if (rawSections) {
        const ps = JSON.parse(rawSections) as SectionRow[];
        if (Array.isArray(ps) && ps.length > 0) tursoSections = ps;
      }
      const rawIngs = result.rows[0].recipe_ingredients_json as string | null;
      if (rawIngs) {
        const pi = JSON.parse(rawIngs) as TursoIngredient[];
        if (Array.isArray(pi) && pi.length > 0) tursoIngredients = pi;
      }
      tursoCookingMethod = (result.rows[0].cooking_method as string | null) ?? null;
      tursoCookMinutes = (result.rows[0].cook_minutes as number | null) ?? null;
      tursoCookTempF   = (result.rows[0].cook_temp_f  as number | null) ?? null;
    }
  } catch {
    // Turso unavailable — fall back to build JSON silently
  }

  // Build expanded ingredient list — component_ref rows are kept as single lines
  // (not expanded into constituent raw ingredients).
  let expandedIngredients: TursoIngredient[] = [];
  if (tursoIngredients !== null) {
    for (const ing of tursoIngredients) {
      if (!ing.componentRef) { expandedIngredients.push(ing); continue; }
      // Keep component-ref rows as single ingredient lines — do NOT expand into
      // constituent raw ingredients. Attach pre-built per-100g nutrition from
      // BUILDS_BY_ID so the TypeScript community pipeline uses the same values
      // as the Python pipeline (treating dev sub-recipes as SR Legacy items).
      const childBuild = BUILDS_BY_ID[ing.componentRef];
      const componentPer100g = childBuild?.per100g as Record<string, number> | undefined;
      expandedIngredients.push({ ...ing, isDish: false, ...(componentPer100g ? { componentPer100g } : {}) });
    }
  } else {
    // Fallback: populate from build JSON when Turso is unavailable.
    // Component-ref rows are kept as single lines here too.
    type IngredientRow = Record<string, unknown>;
    const rawIngredients = (parsed.ingredients ?? []) as IngredientRow[];
    for (const ing of rawIngredients) {
      expandedIngredients.push({
        name: (ing.long_desc as string) || (ing.ingredient_key as string),
        quantity: (ing.qty_display as string) || '',
        ndbNo: (ing.ndb_no as string) || '',
        portionGrams: (ing.grams as number) || 0,
        section: ing.section as string | undefined,
        ...(ing.component_ref ? { componentRef: ing.component_ref as string, isDish: false } : {}),
      });
    }
  }

  const enrichedSections = tursoSections ?? ((parsed.sections ?? []) as SectionRow[]);

  return json({
    recipe_id: parsed.recipe_id,
    srRule: parsed.sr_rule,
    // Turso is the source of truth: use the stored cooking_method when Turso
    // is available (even if empty — empty means no primary cook method is set).
    // Fall back to the build JSON only when Turso was unreachable (tursoCookingMethod===null).
    cookMethod: tursoCookingMethod !== null ? tursoCookingMethod : (parsed.cooking_method ?? parsed.cook_method),
    cookMethodNormalized: parsed.cooking_method_normalized ?? parsed.cook_method_normalized,
    cookMinutes: tursoCookMinutes ?? (parsed.cook_minutes as number | null) ?? null,
    cookTempF:   tursoCookTempF   ?? (parsed.cook_temp_f  as number | null) ?? null,
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
    recipeName: (parsed.recipe_name as string) ?? '',
    ingredients: expandedIngredients,
    sections: enrichedSections,
  });
};
