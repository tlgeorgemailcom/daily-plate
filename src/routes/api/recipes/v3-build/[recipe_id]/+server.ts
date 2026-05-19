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

  // For composite recipes (Rule D with component_ref ingredients), the
  // recipe_sections.csv records cook_method='raw' because at the composite
  // assembly step the components are already cooked. For display in the
  // editor we want the SOURCE recipe's cook_method (e.g. baked for biscuit,
  // boiled for milk gravy) so each section header shows how that component
  // was actually prepared.
  type SectionRow = Record<string, unknown>;
  type IngredientRow = Record<string, unknown>;
  const rawIngredients = (parsed.ingredients ?? []) as IngredientRow[];
  const sectionToComponentRef = new Map<string, string>();
  for (const ing of rawIngredients) {
    const ref = ing.component_ref as string | undefined;
    const sec = ing.section as string | undefined;
    if (ref && sec && !sectionToComponentRef.has(sec)) {
      sectionToComponentRef.set(sec, ref);
    }
  }
  const enrichedSections = ((parsed.sections ?? []) as SectionRow[]).map((sec) => {
    const ref = sectionToComponentRef.get(sec.section_key as string);
    if (!ref) return sec;
    const childBuild = BUILDS_BY_ID[ref];
    if (!childBuild) return sec;
    // Prefer the child's top-level cooking_method; when the child is itself
    // multi-section (e.g. sausage gravy = fry sausage + simmer gravy), pick
    // the section with the largest final_grams as the dominant cook step.
    let childCook =
      (childBuild.cooking_method as string | undefined) ??
      (childBuild.cook_method as string | undefined);
    if (!childCook || childCook === 'multi') {
      const childSecs = (childBuild.sections as SectionRow[] | undefined) ?? [];
      const dominant = childSecs
        .slice()
        .sort((a, b) => ((b.final_grams as number) ?? 0) - ((a.final_grams as number) ?? 0))[0];
      childCook = dominant?.cook_method as string | undefined;
    }
    if (!childCook || childCook === 'multi') return sec;
    return { ...sec, cook_method: childCook, cooking_method: childCook, cooking_method_normalized: childCook };
  });

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
    recipeName: (parsed.recipe_name as string) ?? '',
    ingredients: rawIngredients,
    sections: enrichedSections,
  });
};
