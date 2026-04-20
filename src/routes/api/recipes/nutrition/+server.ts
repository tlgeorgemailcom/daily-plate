import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';

// Pattern that matches auto-generated player IDs like "recipe-1771874787378-e6qosltqx"
const autoIdPattern = /^recipe-\d{10,}-\w+$/i;

export const GET: RequestHandler = async () => {
  // ── 1. Player recipes from Turso (approved, nutritionally linked) ────────
  let communityRecipes: object[] = [];
  try {
    const rows = await queryAll(`
      SELECT id, title, nutrition_json
      FROM player_recipes
      WHERE status = 'approved' AND nutrition_json IS NOT NULL AND nutrition_json != '{}'
      ORDER BY title ASC
    `);

    communityRecipes = (rows as Record<string, unknown>[])
      .filter((row) => {
        const name = row.title as string | null;
        return name && name.trim().length > 0 && !autoIdPattern.test(name.trim());
      })
      .map((row) => {
        const nj = JSON.parse(row.nutrition_json as string);
        const gpS: number = nj.gramsPerServing || 100;
        const ps = nj.perServing;
        // Normalise to per-100g so calculateNutrientsForGrams works correctly
        const scale = 100 / gpS;
        return {
          id:             row.id as string,
          name:           row.title as string,
          type:           'community',
          gramsPerServing: gpS,
          servings:       nj.servings as number,
          sources:        nj.sources ?? [],
          cal:  Math.round(ps.cal  * scale * 10) / 10,
          pro:  Math.round(ps.pro  * scale * 10) / 10,
          fat:  Math.round(ps.fat  * scale * 10) / 10,
          carb: Math.round(ps.carb * scale * 10) / 10,
          fib:  Math.round(ps.fib  * scale * 10) / 10,
          h2o:  Math.round(ps.h2o  * scale * 10) / 10,
          sug:  Math.round(ps.sug  * scale * 10) / 10,
        };
      });
  } catch (err) {
    console.error('[/api/recipes/nutrition] turso error:', err);
  }

  // ── 2. Developer recipes from Turso dev_recipes ──────────────────────────
  let devRecipes: object[] = [];
  try {
    const rows = await queryAll(`
      SELECT recipe_id, recipe_name, nutrition_json, source_ndb_no, source_long_desc
      FROM dev_recipes
      WHERE status = 'published' AND nutrition_json IS NOT NULL AND nutrition_json != '{}'
      ORDER BY recipe_name ASC
    `);

    devRecipes = (rows as Record<string, unknown>[]).map((row) => {
      const nutrition = JSON.parse(row.nutrition_json as string);
      const ps = nutrition.perServing;
      const gpS: number = nutrition.gramsPerServing || 100;
      const scale = 100 / gpS;
      return {
        id:              `dev-${row.recipe_id as string}`,
        name:            row.recipe_name as string,
        type:            'developer',
        gramsPerServing: gpS,
        servings:        nutrition.servings as number,
        sources:         [{ ndb: row.source_ndb_no as string | null, name: (row.source_long_desc as string | null) || (row.recipe_name as string), grams: gpS }],
        cal:  Math.round(((ps.cal ?? ps.Energy_KCal ?? 0) as number) * scale * 10) / 10,
        pro:  Math.round(((ps.pro ?? ps.Protein ?? 0) as number) * scale * 10) / 10,
        fat:  Math.round(((ps.fat ?? ps.TotalLipidFat ?? 0) as number) * scale * 10) / 10,
        carb: Math.round(((ps.carb ?? ps.Carbohydrate ?? 0) as number) * scale * 10) / 10,
        fib:  Math.round(((ps.fib ?? ps.FiberTotalDietary ?? 0) as number) * scale * 10) / 10,
        h2o:  Math.round(((ps.h2o ?? ps.Water ?? 0) as number) * scale * 10) / 10,
        sug:  Math.round(((ps.sug ?? ps.SugarsTotal ?? 0) as number) * scale * 10) / 10,
        micros: nutrition.micros ?? nutrition.per100g ?? null,
      };
    });
  } catch (err) {
    console.error('[/api/recipes/nutrition] dev_recipes error:', err);
  }

  return json([...communityRecipes, ...devRecipes], {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
};
