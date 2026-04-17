import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';
import { RECIPES } from '$lib/data/recipes';
import { FOODS } from '$lib/data/food-portions';

// Built once per cold start — avoids O(n) scan per recipe
const FOOD_MAP = new Map(FOODS.map(f => [f.word, f]));

function parseServingCount(s: string | undefined): number {
  if (!s) return 1;
  const n = parseInt(s.replace(/[^0-9]/g, ''));
  return n > 0 ? n : 1;
}

// Pattern that matches auto-generated player IDs like "recipe-1771874787378-e6qosltqx"
const autoIdPattern = /^recipe-\d{10,}-\w+$/i;

export const GET: RequestHandler = async () => {
  // ── 1. Community recipes from Turso (player-submitted, approved) ─────────
  let communityRecipes: object[] = [];
  try {
    const rows = await queryAll(`
      SELECT id, name, nutrition_json
      FROM recipes
      WHERE status = 'approved' AND nutrition_json IS NOT NULL
      ORDER BY name ASC
    `);

    communityRecipes = rows
      .filter((row: Record<string, unknown>) => {
        const name = row.name as string | null;
        return name && name.trim().length > 0 && !autoIdPattern.test(name.trim());
      })
      .map((row: Record<string, unknown>) => {
        const nj = JSON.parse(row.nutrition_json as string);
        const gpS: number = nj.gramsPerServing || 100;
        const ps = nj.perServing;
        // Normalise to per-100g so calculateNutrientsForGrams works correctly
        const scale = 100 / gpS;
        return {
          id:             row.id as string,
          name:           row.name as string,
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

  // ── 2. Developer recipes from recipes.ts (status='published', food_word set) ─
  // Nutrition comes directly from the SR28 food-portions entry via food_word.
  // gramsPerServing uses the first real (non-custom) portion in that food entry.
  const devRecipes = RECIPES
    .filter(r => r.status === 'published' && r.food_word)
    .flatMap(r => {
      const food = FOOD_MAP.get(r.food_word!);
      if (!food) return [];
      const portion = food.portions.find(p => !p.desc.startsWith('custom')) ?? food.portions[0];
      const gramsPerServing = portion?.gm ?? 100;
      return [{
        id:              `dev-${r.food_word}`,
        name:            r.recipe_name,
        type:            'developer',
        gramsPerServing,
        servings:        parseServingCount(r.servings),
        sources:         [{ ndb: food.ndb, name: food.display, grams: gramsPerServing }],
        // Already per-100g in food-portions.ts — no scaling needed
        cal:  food.cal,
        pro:  food.pro,
        fat:  food.fat,
        carb: food.carb,
        fib:  food.fib,
        h2o:  food.h2o,
        sug:  food.sug,
      }];
    });

  return json([...communityRecipes, ...devRecipes], {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
};
