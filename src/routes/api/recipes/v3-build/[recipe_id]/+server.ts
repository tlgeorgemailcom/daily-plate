import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

/**
 * GET /api/recipes/v3-build/[recipe_id]
 *
 * Returns the v3 pipeline's build artifact for a recipe, reading entirely
 * from Turso. Previously this endpoint bundled 596 build JSONs via
 * import.meta.glob, adding ~7 MB to the serverless function. All the same
 * data lives in dev_recipes.nutrition_json (written by upload.py --commit),
 * so we query Turso instead.
 *
 * nutrition_json shape (written by to_turso_nutrition_json in build.py):
 *   { per100g, perServing, micros, gramsPerServing, servings,
 *     yieldFactorWater, yieldFactorFat, sources, ... }
 *
 * Response 200: { recipe_id, per100g, gramsPerServing, yieldFactorWater,
 *                 yieldFactorFat, srRule, cookMethod, cookedTotalGrams,
 *                 servingsCount, ... }
 * Response 404: recipe not found in Turso
 */

const RECIPE_ID_RE = /^[A-Z]+_[0-9]+$/;

type SectionRow = Record<string, unknown>;
type TursoIngredient = {
  name: string; quantity: string; section?: string; foodWord?: string;
  ndbNo: string | number; portionDesc?: string; portionGrams: number;
  servingCount?: number; isDish?: boolean; componentRef?: string;
  componentPer100g?: Record<string, number>;
};

function normalizeCookMethod(m: string): string {
  const aliases: Record<string, string> = {
    'simmer': 'boiled', 'sub-simmer': 'boiled', 'scalded': 'boiled',
    'saute': 'fried', 'sauté': 'fried', 'sauteed': 'fried', 'sautéed': 'fried',
    'stir_fry': 'fried', 'stir fry': 'fried', 'stir-fried': 'fried', 'stir fried': 'fried',
    'pan sear': 'fried', 'pan seared': 'fried', 'pan_seared': 'fried', 'pan-seared': 'fried',
    'sear': 'fried', 'seared': 'fried',
    'braise': 'boiled', 'boil covered': 'boiled', 'boil_covered': 'boiled',
    'boil (covered)': 'boiled', 'boiled covered': 'boiled',
    'boiled_covered': 'boiled', 'boiled (covered)': 'boiled',
    'finish': 'raw', 'broiled': 'baked',
  };
  return aliases[m] ?? m;
}

export const GET: RequestHandler = async ({ params }) => {
  const recipeId = params.recipe_id;
  if (!recipeId || !RECIPE_ID_RE.test(recipeId)) {
    throw error(400, 'Invalid recipe_id');
  }

  const db = getGameDb();

  // Primary query — everything we need in one round trip
  const result = await db.execute({
    sql: `SELECT recipe_name, cooking_method, cook_minutes, cook_temp_f,
           fill_class, cook2_fill_class, cook3_fill_class,
                 grams_per_serving, servings_count, nutrition_json,
                 sections_json, recipe_ingredients_json
          FROM dev_recipes WHERE recipe_id = ?`,
    args: [recipeId],
  });

  if (result.rows.length === 0) {
    throw error(404, `No recipe found for ${recipeId}`);
  }

  const row = result.rows[0];
  const nutritionJson = JSON.parse(row.nutrition_json as string) as Record<string, unknown>;
  const per100g = nutritionJson.per100g as Record<string, number>;
  const gramsPerServing = (nutritionJson.gramsPerServing ?? row.grams_per_serving) as number;
  const servingsCount = (nutritionJson.servings ?? row.servings_count) as number;
  const cookingMethod = (row.cooking_method as string) ?? '';

  // Parse sections and ingredients
  let sections: SectionRow[] = [];
  let ingredients: TursoIngredient[] = [];
  const rawSections = row.sections_json as string | null;
  if (rawSections) {
    const ps = JSON.parse(rawSections) as SectionRow[];
    if (Array.isArray(ps)) sections = ps;
  }
  const rawIngs = row.recipe_ingredients_json as string | null;
  if (rawIngs) {
    const pi = JSON.parse(rawIngs) as TursoIngredient[];
    if (Array.isArray(pi)) ingredients = pi;
  }

  // Collect unique component refs that need their own per-100g nutrition
  const componentRefs = [...new Set(
    ingredients.filter(i => i.componentRef).map(i => i.componentRef!)
  )];

  // Batch query child recipe nutrition (one round trip for all refs)
  const componentNutrition: Record<string, Record<string, number>> = {};
  if (componentRefs.length > 0) {
    const placeholders = componentRefs.map(() => '?').join(', ');
    const childResult = await db.execute({
      sql: `SELECT recipe_id, nutrition_json FROM dev_recipes WHERE recipe_id IN (${placeholders})`,
      args: componentRefs,
    });
    for (const childRow of childResult.rows) {
      const childId = childRow.recipe_id as string;
      const childNj = JSON.parse(childRow.nutrition_json as string) as Record<string, unknown>;
      componentNutrition[childId] = childNj.per100g as Record<string, number>;
    }
  }

  // Attach componentPer100g to component-ref ingredient rows
  const expandedIngredients: TursoIngredient[] = ingredients.map(ing => {
    if (!ing.componentRef) return ing;
    const componentPer100g = componentNutrition[ing.componentRef];
    return { ...ing, isDish: false, ...(componentPer100g ? { componentPer100g } : {}) };
  });

  return json({
    recipe_id: recipeId,
    srRule: '',
    cookMethod: cookingMethod,
    cookMethodNormalized: normalizeCookMethod(cookingMethod),
    cookMinutes: row.cook_minutes as number | null,
    cookTempF: row.cook_temp_f as number | null,
    fillClass: (row.fill_class as string | null) || '',
    cook2FillClass: (row.cook2_fill_class as string | null) || '',
    cook3FillClass: (row.cook3_fill_class as string | null) || '',
    yieldFactorWater: nutritionJson.yieldFactorWater ?? null,
    yieldFactorFat: nutritionJson.yieldFactorFat ?? null,
    servingsCount,
    cookedTotalGrams: gramsPerServing * servingsCount,
    gramsPerServing,
    per100g,
    perServing: nutritionJson.perServing,
    skippedIngredients: [],
    auditStatus: '',
    auditNotes: '',
    recipeName: (row.recipe_name as string) ?? '',
    ingredients: expandedIngredients,
    sections,
  });
};
