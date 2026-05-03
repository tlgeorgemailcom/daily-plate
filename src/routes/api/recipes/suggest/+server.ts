import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';
import { toDisplayRecipeCategory } from '$lib/farmers-basket/recipe-categories';
import { LEVELS } from '$lib/farmers-basket/generated-levels';

interface SuggestionRow {
  id: string;
  title: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe_ingredients: string | null;
  recipe_instructions: string | null;
  source_type: 'dev' | 'player';
  dish_family: string | null;
  nutrition_json: string | null;
}

interface StoredNutritionJson {
  perServing: { cal: number; pro: number; fat: number; carb: number; fib: number; h2o: number; sug: number };
  gramsPerServing: number;
  servings: number;
}

interface CanonicalIngredient {
  name: string;
  quantity: string;
  foodWord?: string;
  ndbNo?: string;
  portionDesc?: string;
  portionGrams?: number;
  servingCount?: number;
  exempt?: boolean;
}

interface CanonicalInstruction {
  text: string;
}

const builtInRecipeById = new Map(
  LEVELS
    .filter((level) => /^SWEET_\d+$/i.test(level.id))
    .map((level) => [level.id, level])
);

function toCanonicalIngredientsFromLevel(recipeId: string): CanonicalIngredient[] {
  const level = builtInRecipeById.get(recipeId);
  if (!level?.recipeIngredients?.length) return [];
  return level.recipeIngredients
    .filter((item) => item.isDish !== true)
    .map((item) => ({
      name: item.name,
      quantity: item.quantity || '',
      foodWord: item.foodWord,
      ndbNo: item.ndbNo,
      portionDesc: item.portionDesc,
      portionGrams: item.portionGrams,
      servingCount: item.servingCount,
      exempt: item.exempt === true,
    }));
}

function toCanonicalInstructionsFromLevel(recipeId: string): CanonicalInstruction[] {
  const level = builtInRecipeById.get(recipeId);
  if (!level?.recipeInstructions?.length) return [];
  return level.recipeInstructions
    .map((text) => ({ text: text.trim() }))
    .filter((step) => step.text.length > 0);
}

// Normalise a dish name for comparison: lowercase, strip punctuation, collapse spaces
function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

// Score how well a stored recipe title matches the query dish name.
// Returns 0 if there is no meaningful overlap.
function score(storedTitle: string, queryDish: string): number {
  const stored = normalise(storedTitle.includes(' — ') ? storedTitle.split(' — ')[0] : storedTitle);
  const query = normalise(queryDish);
  if (!stored || !query) return 0;

  // Exact dish-name match
  if (stored === query) return 100;
  // Stored starts with query (e.g. "apple pie spiced" vs "apple pie")
  if (stored.startsWith(query)) return 80;
  // Query starts with stored
  if (query.startsWith(stored)) return 70;

  // Token overlap
  const storedTokens = new Set(stored.split(' '));
  const queryTokens = query.split(' ');
  const overlap = queryTokens.filter(t => storedTokens.has(t)).length;
  if (overlap === 0) return 0;
  return Math.round((overlap / queryTokens.length) * 60);
}

function toCanonicalIngredients(raw: unknown[]): CanonicalIngredient[] {
  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .filter(item => item.row_type !== 'dish' && item.isDish !== true)
    .map((item) => {
      const name =
        (typeof item.name === 'string' && item.name.trim()) ||
        (typeof item.ing_name === 'string' && item.ing_name.trim()) ||
        (typeof item.sr28_long_desc === 'string' && item.sr28_long_desc.trim()) ||
        '';
      const quantity =
        (typeof item.quantity === 'string' && item.quantity.trim()) ||
        (typeof item.ing_qty === 'string' && item.ing_qty.trim()) ||
        '';

      const portionGrams = typeof item.portionGrams === 'number'
        ? item.portionGrams
        : typeof item.portion_grams === 'number'
        ? item.portion_grams
        : undefined;

      const servingCount = typeof item.servingCount === 'number'
        ? item.servingCount
        : typeof item.serving_count === 'number'
        ? item.serving_count
        : undefined;

      return {
        name,
        quantity,
        foodWord: typeof item.foodWord === 'string' ? item.foodWord : undefined,
        ndbNo:
          typeof item.ndbNo === 'string'
            ? item.ndbNo
            : typeof item.ndb_no === 'string'
            ? item.ndb_no
            : undefined,
        portionDesc:
          typeof item.portionDesc === 'string'
            ? item.portionDesc
            : typeof item.portion_desc === 'string'
            ? item.portion_desc
            : undefined,
        portionGrams,
        servingCount,
        exempt: item.exempt === true,
      };
    })
    .filter(item => item.name.length > 0 || item.quantity.length > 0);
}

function toCanonicalInstructions(raw: unknown[]): CanonicalInstruction[] {
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        return { text: item.trim() };
      }
      if (typeof item === 'object' && item !== null) {
        const row = item as Record<string, unknown>;
        const text =
          (typeof row.text === 'string' && row.text.trim()) ||
          (typeof row.step_text === 'string' && row.step_text.trim()) ||
          '';
        return { text };
      }
      return { text: '' };
    })
    .filter(step => step.text.length > 0);
}

export const GET: RequestHandler = async ({ url }) => {
  const dish = url.searchParams.get('dish')?.trim() ?? '';
  if (!dish || dish.length < 2) {
    return json({ suggestions: [] });
  }

  try {
    // Fetch all published/approved recipes from both tables. We filter and rank in JS
    // to keep the SQL simple and avoid LIKE coupling to the split format.
    console.log(`[SUGGEST] Fetching recipes for dish="${dish}"`);
    const rows = await queryAll<SuggestionRow>(
      `SELECT recipe_id AS id, recipe_name AS title, category, dietary_category,
              prep_time, servings,
              recipe_ingredients_json AS recipe_ingredients,
              recipe_instructions_json AS recipe_instructions,
              dish_family,
              nutrition_json,
              'dev' AS source_type
       FROM dev_recipes
        WHERE status = 'published'
       UNION ALL
      SELECT recipe_id AS id, recipe_name AS title, category, dietary_category,
              prep_time, servings,
              recipe_ingredients_json AS recipe_ingredients,
              recipe_instructions_json AS recipe_instructions,
              dish_family,
              nutrition_json,
              'player' AS source_type
       FROM player_recipes
       WHERE status = 'approved'`,
            []
    );
    console.log(`[SUGGEST] Found ${rows.length} total recipes`);


    const scored = rows
      .map(row => ({ row, s: score(row.title, dish) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6);

    const suggestions = scored.map(({ row, s }) => {
      const titleParts = row.title.includes(' — ') ? row.title.split(' — ') : [row.title, ''];
      const dishName = titleParts[0].trim();
      const version = titleParts.slice(1).join(' — ').trim();

      let rawIngredients: unknown[] = [];
      let rawInstructions: unknown[] = [];
      try { rawIngredients = JSON.parse(row.recipe_ingredients ?? '[]'); } catch { /* leave empty */ }
      try { rawInstructions = JSON.parse(row.recipe_instructions ?? '[]'); } catch { /* leave empty */ }

      const dbIngredients = Array.isArray(rawIngredients) ? toCanonicalIngredients(rawIngredients) : [];
      const dbInstructions = Array.isArray(rawInstructions) ? toCanonicalInstructions(rawInstructions) : [];
      const builtInIngredients = row.source_type === 'dev' ? toCanonicalIngredientsFromLevel(row.id) : [];
      const builtInInstructions = row.source_type === 'dev' ? toCanonicalInstructionsFromLevel(row.id) : [];
      const ingredients = builtInIngredients.length > dbIngredients.length ? builtInIngredients : dbIngredients;
      const instructions = builtInInstructions.length > dbInstructions.length ? builtInInstructions : dbInstructions;

      return {
        id: row.id,
        dishName,
        version,
        category: toDisplayRecipeCategory(row.category),
        dietaryCategory: row.dietary_category,
        prepTime: row.prep_time,
        servings: row.servings,
        ingredientCount: ingredients.length,
        ingredients,
        instructions,
        sourceType: row.source_type,
        dishFamily: row.dish_family || null,
        matchScore: s,
        nutritionJson: (() => { try { return row.nutrition_json ? (JSON.parse(row.nutrition_json) as StoredNutritionJson) : null; } catch { return null; } })(),
      };
    });

    return json({ suggestions });
  } catch (err) {
    console.error('[SUGGEST] Error:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) console.error('[SUGGEST] Stack:', err.stack);
    return json({ error: 'Failed to fetch suggestions', suggestions: [] }, { status: 500 });
  }
};
