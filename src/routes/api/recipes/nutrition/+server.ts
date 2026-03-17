import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';

export const GET: RequestHandler = async () => {
  try {
    const rows = await queryAll(`
      SELECT id, name, nutrition_json
      FROM recipes
      WHERE status = 'approved' AND nutrition_json IS NOT NULL
      ORDER BY name ASC
    `);

    // Pattern that matches auto-generated IDs like "recipe-1771874787378-e6qosltqx"
    const autoIdPattern = /^recipe-\d{10,}-\w+$/i;

    const recipes = rows
      .filter((row: Record<string, unknown>) => {
        const name = row.name as string | null;
        // Skip if name is missing or looks like an auto-generated ID
        return name && name.trim().length > 0 && !autoIdPattern.test(name.trim());
      })
      .map((row: Record<string, unknown>) => {
        const nj = JSON.parse(row.nutrition_json as string);
        const gpS: number = nj.gramsPerServing || 100;
        const ps = nj.perServing;
        // Normalise to per-100g so the Balance game's calculateNutrientsForGrams works correctly
        const scale = 100 / gpS;
        return {
          id: row.id as string,
          name: row.name as string,
          gramsPerServing: gpS,
          servings: nj.servings as number,
          sources: nj.sources ?? [],
          // Per-100g nutrient values (what Food interface requires)
          cal:  Math.round(ps.cal  * scale * 10) / 10,
          pro:  Math.round(ps.pro  * scale * 10) / 10,
          fat:  Math.round(ps.fat  * scale * 10) / 10,
          carb: Math.round(ps.carb * scale * 10) / 10,
          fib:  Math.round(ps.fib  * scale * 10) / 10,
          h2o:  Math.round(ps.h2o  * scale * 10) / 10,
          sug:  Math.round(ps.sug  * scale * 10) / 10,
        };
      });

    return json(recipes, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error('[/api/recipes/nutrition] error:', err);
    return json([], { status: 500 });
  }
};
