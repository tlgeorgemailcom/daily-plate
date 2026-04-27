import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';
import { LEVELS } from '$lib/farmers-basket/generated-levels';
import { RECIPE_NUTRITION } from '$lib/data/recipe-nutrition';

// Pattern that matches auto-generated player IDs like "recipe-1771874787378-e6qosltqx"
const autoIdPattern = /^recipe-\d{10,}-\w+$/i;

function normalizeRecipeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const basketLevelById = new Map(
  LEVELS
    .filter((level) => /^SWEET_\d+$/i.test(level.id))
    .map((level) => [level.id, level])
);

export const GET: RequestHandler = async ({ url }) => {
  const blockTurso = url.searchParams.get('blockTurso') === '1';
  // ── 1. Player recipes from Turso (approved, nutritionally linked) ────────
  let communityRecipes: Array<Record<string, unknown>> = [];
  try {
    if (blockTurso) throw new Error('Turso blocked for local fallback test');
    const rows = await queryAll(`
      SELECT id, title, category, nutrition_json
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
          recipeOrigin:   'turso-community',
          isCommunityRecipe: true,
          sr28Rule: null,
          category:       row.category as string | null,
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
  let devRecipes: Array<Record<string, unknown>> = [];
  try {
    if (blockTurso) throw new Error('Turso blocked for local fallback test');
    const rows = await queryAll(`
      SELECT recipe_id, recipe_name, category, nutrition_json, source_ndb_no, source_long_desc
      FROM dev_recipes
      WHERE status = 'published' AND nutrition_json IS NOT NULL AND nutrition_json != '{}'
      ORDER BY recipe_name ASC
    `);

    devRecipes = (rows as Record<string, unknown>[]).map((row) => {
      const recipeId = row.recipe_id as string;
      const basketLevel = basketLevelById.get(recipeId);
      const nutrition = JSON.parse(row.nutrition_json as string);
      const ps = nutrition.perServing;
      const gpS: number = nutrition.gramsPerServing || 100;
      const scale = 100 / gpS;
      return {
        id:              `dev-${recipeId}`,
        name:            row.recipe_name as string,
        type:            'developer',
        recipeOrigin:    'turso-dev',
        isCommunityRecipe: false,
        sr28Rule: basketLevel?.sr28Rule ?? null,
        category:        row.category as string | null,
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

  // ── 3. Built-in Basket recipes from generated TS (all SWEET_* levels) ────
  const builtInRecipes = LEVELS
    .filter((level) => /^SWEET_\d+$/i.test(level.id))
    .map((level) => {
      const nutrition = RECIPE_NUTRITION[level.id];
      if (!nutrition) return null;

      const per100 = nutrition.per100g ?? {};
      return {
        id: `dev-${level.id}`,
        name: level.name,
        type: 'developer',
        recipeOrigin: 'ts-builtin',
        isCommunityRecipe: !!level.isCommunityRecipe,
        sr28Rule: level.sr28Rule ?? null,
        category: level.category ?? null,
        gramsPerServing: nutrition.gramsPerServing,
        servings: nutrition.servings,
        sources: [{ ndb: nutrition.ndb ?? null, name: nutrition.long_desc || level.name, grams: nutrition.gramsPerServing }],
        cal: Math.round((Number(per100.Energy_KCal ?? 0)) * 10) / 10,
        pro: Math.round((Number(per100.Protein ?? 0)) * 10) / 10,
        fat: Math.round((Number(per100.TotalLipidFat ?? 0)) * 10) / 10,
        carb: Math.round((Number(per100.Carbohydrate ?? 0)) * 10) / 10,
        fib: Math.round((Number(per100.FiberTotalDietary ?? 0)) * 10) / 10,
        h2o: Math.round((Number(per100.Water ?? 0)) * 10) / 10,
        sug: Math.round((Number(per100.SugarsTotal ?? 0)) * 10) / 10,
      };
    })
    .filter((recipe): recipe is Record<string, unknown> => recipe !== null);

  const seenNames = new Set<string>();
  const combinedRecipes = [...devRecipes, ...builtInRecipes, ...communityRecipes].filter((recipe) => {
    const normalized = normalizeRecipeName((recipe.name as string | undefined) ?? '');
    if (!normalized) return false;
    if (seenNames.has(normalized)) return false;
    seenNames.add(normalized);
    return true;
  });

  return json(combinedRecipes, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
};
