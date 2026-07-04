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
  // upload.py writes cook_method, cook_stages, boil_minutes, fill_class, and
  // all yield factors into sections_json on every --commit run. Reading from
  // Turso means the form sees up-to-date section structure without requiring a
  // Vite rebuild. Fall back to the build JSON sections if Turso is unavailable
  // or the row has no sections_json yet.
  type SectionRow = Record<string, unknown>;
  type IngredientRow = Record<string, unknown>;

  let tursoSections: SectionRow[] | null = null;
  try {
    const db = getGameDb();
    const result = await db.execute({
      sql: 'SELECT sections_json FROM dev_recipes WHERE recipe_id = ?',
      args: [recipeId],
    });
    if (result.rows.length > 0) {
      const raw = result.rows[0].sections_json as string | null;
      if (raw) {
        const parsed_sections = JSON.parse(raw) as SectionRow[];
        if (Array.isArray(parsed_sections) && parsed_sections.length > 0) {
          tursoSections = parsed_sections;
        }
      }
    }
  } catch {
    // Turso unavailable — fall back to build JSON sections silently
  }

  // For composite recipes, override each component_ref section's cook_method
  // with the child recipe's actual cooking method so section headers show how
  // that component was prepared (e.g. "baked" for biscuit, not "raw").
  const rawIngredients = (parsed.ingredients ?? []) as IngredientRow[];
  const sectionToComponentRef = new Map<string, string>();
  for (const ing of rawIngredients) {
    const ref = ing.component_ref as string | undefined;
    const sec = ing.section as string | undefined;
    if (ref && sec && !sectionToComponentRef.has(sec)) {
      sectionToComponentRef.set(sec, ref);
    }
  }

  function enrichSection(sec: SectionRow): SectionRow {
    const ref = sectionToComponentRef.get(sec.section_key as string);
    if (!ref) return sec;
    const childBuild = BUILDS_BY_ID[ref];
    if (!childBuild) return sec;
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
  }

  const enrichedSections = tursoSections
    ? tursoSections.map(enrichSection)
    : ((parsed.sections ?? []) as SectionRow[]).map(enrichSection);

  // Inline-expand component_ref rows so the edit form gets a flat,
  // fully-editable ingredient list (same as RecipeBook::levelToFormData).
  // Each component_ref's child leaf ingredients are scaled to the grams
  // used in this recipe and inherit the parent row's section key.
  const expandedIngredients: IngredientRow[] = [];
  for (const ing of rawIngredients) {
    const ref = ing.component_ref as string | undefined;
    if (!ref) {
      expandedIngredients.push(ing);
      continue;
    }
    const childBuild = BUILDS_BY_ID[ref];
    if (!childBuild) {
      expandedIngredients.push(ing); // unknown child: keep ref as-is
      continue;
    }
    const childLeafs = ((childBuild.ingredients ?? []) as IngredientRow[]).filter(
      (c) => !c.component_ref,
    );
    if (childLeafs.length === 0) {
      expandedIngredients.push(ing); // empty child: keep ref as-is
      continue;
    }
    const childBatch = childLeafs.reduce((s, c) => s + ((c.grams as number) || 0), 0);
    const parentGrams = (ing.grams as number) || 0;
    const scale = childBatch > 0 && parentGrams > 0 ? parentGrams / childBatch : 1;
    for (const c of childLeafs) {
      expandedIngredients.push({
        ingredient_key: c.ingredient_key,
        ndb_no: c.ndb_no,
        long_desc: c.long_desc,
        grams: Math.round(((c.grams as number) || 0) * scale * 100) / 100,
        section: ing.section,
        ingredient_group: ing.ingredient_group ?? ing.section,
        // qty_display omitted intentionally — the scaled gram weight is shown
      });
    }
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
    recipeName: (parsed.recipe_name as string) ?? '',
    ingredients: expandedIngredients,
    sections: enrichedSections,
  });
};
