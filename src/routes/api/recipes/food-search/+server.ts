import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchSr28FoodsWithNutrients, type FoodWithNutrients } from '$lib/server/sr28Search';
import { getGameDb } from '$lib/server/turso';
import type { NutrientRow } from '$lib/nutrition/types';

/** Recipe result shape — extends FoodWithNutrients with component-ref fields */
export type RecipeSearchResult = FoodWithNutrients & {
  recipeId: string;
  componentPer100g: Record<string, number>;
  gramsPerServing: number;
  dietaryCategory?: string;
};

export type FoodSearchResult = FoodWithNutrients | RecipeSearchResult;

/** Build a synthetic NutrientRow from a nutrition_json per100g panel */
function per100gToNutrientRow(recipeId: string, recipeName: string, p: Record<string, number>): NutrientRow {
  const n = (k: string) => Number(p[k] ?? 0);
  return {
    ndbNo: recipeId, longDesc: recipeName, fdGrpCd: '',
    energy_KCal: n('Energy_KCal'), water: n('Water'), protein: n('Protein'),
    totalLipidFat: n('TotalLipidFat'), carbohydrate: n('Carbohydrate'),
    sugarsTotal: n('SugarsTotal'), fiberTotalDietary: n('FiberTotalDietary'), ash: 0,
    fattyAcids_totalSaturated: n('FattyAcids_totalSaturated'),
    fattyAcids_totalMonounsaturated: n('FattyAcids_totalMonounsaturated'),
    fattyAcids_totalPolyunsaturated: n('FattyAcids_totalPolyunsaturated'),
    cholesterol: n('Cholesterol'), calcium_Ca: n('Calcium_Ca'), iron_Fe: n('Iron_Fe'),
    magnesium_Mg: n('Magnesium_Mg'), phosphorus_P: n('Phosphorus_P'),
    potassium_K: n('Potassium_K'), sodium_Na: n('Sodium_Na'), zinc_Zn: n('Zinc_Zn'),
    vitaminC_totalAscorbicAcid: n('VitaminC_totalAscorbicAcid'), thiamin: n('Thiamin'),
    riboflavin: n('Riboflavin'), niacin: n('Niacin'), vitaminB6: n('VitaminB6'),
    folateDFE: n('Folate_DFE'), vitaminB12: n('VitaminB12'), vitaminA_RAE: n('VitaminA_RAE'),
    vitaminD: n('VitaminD'), vitaminE_alphaTocopherol: n('VitaminE_alphaTocopherol'),
    vitaminK_phylloquinone: n('VitaminK_phylloquinone'),
  };
}

async function searchRecipes(query: string, limit = 8): Promise<RecipeSearchResult[]> {
  const db = getGameDb();
  const q = query.toLowerCase().trim();
  const likeQ = `%${q}%`;

  const [devResult, playerResult] = await Promise.all([
    db.execute({
      sql: `SELECT recipe_id, recipe_name, dietary_category, grams_per_serving, nutrition_json
            FROM dev_recipes
            WHERE status = 'published'
              AND (LOWER(recipe_name) LIKE ? OR LOWER(food_word) LIKE ?)
            ORDER BY CASE WHEN LOWER(recipe_name) = ? THEN 0 ELSE 1 END, recipe_name ASC
            LIMIT ?`,
      args: [likeQ, likeQ, q, limit],
    }),
    db.execute({
      sql: `SELECT recipe_id, recipe_name, dietary_category, grams_per_serving, nutrition_json
            FROM player_recipes
            WHERE status = 'approved'
              AND (LOWER(recipe_name) LIKE ? OR LOWER(food_word) LIKE ?)
            ORDER BY CASE WHEN LOWER(recipe_name) = ? THEN 0 ELSE 1 END, recipe_name ASC
            LIMIT ?`,
      args: [likeQ, likeQ, q, limit],
    }),
  ]);

  const results: RecipeSearchResult[] = [];
  const seenIds = new Set<string>();

  for (const row of [...devResult.rows, ...playerResult.rows]) {
    const recipeId = String(row.recipe_id ?? '');
    if (!recipeId || seenIds.has(recipeId)) continue;
    seenIds.add(recipeId);

    const recipeName = String(row.recipe_name ?? '');
    const gramsPerServing = Math.max(1, Number(row.grams_per_serving ?? 100));

    let per100g: Record<string, number> = {};
    try {
      const nj = JSON.parse(String(row.nutrition_json ?? '{}')) as Record<string, unknown>;
      per100g = (nj.per100g ?? {}) as Record<string, number>;
    } catch { /* malformed JSON — skip nutrition */ }

    const p = (k: string) => Number(per100g[k] ?? 0);
    results.push({
      word: `RECIPE_${recipeId}`,
      display: recipeName,
      groups: ['prepared'],
      ndb: '',
      desc: recipeName,
      cal: p('Energy_KCal'), pro: p('Protein'), fat: p('TotalLipidFat'),
      carb: p('Carbohydrate'), fib: p('FiberTotalDietary'),
      h2o: p('Water'), sug: p('SugarsTotal'),
      portions: [{ amt: 1, desc: '1 serving', gm: gramsPerServing }],
      nutrients: per100gToNutrientRow(recipeId, recipeName, per100g),
      recipeId,
      componentPer100g: per100g,
      gramsPerServing,
      dietaryCategory: String(row.dietary_category ?? ''),
    });
  }
  return results;
}

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const limitParam = Number(url.searchParams.get('limit') ?? '20');

  if (query.length < 2) return json({ foods: [] });

  try {
    const [sr28Foods, recipeFoods] = await Promise.all([
      searchSr28FoodsWithNutrients(query, 'all', limitParam),
      searchRecipes(query, 8),
    ]);
    // Recipes (exact-match-first) then SR28 results
    return json({ foods: [...recipeFoods, ...sr28Foods] });
  } catch (error) {
    console.error('[/api/recipes/food-search] search error:', error);
    return json({ foods: [], error: 'search_failed' }, { status: 500 });
  }
};