import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll } from '$lib/server/turso';

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
    const rows = await queryAll<SuggestionRow>(
      `SELECT recipe_id AS id, recipe_name AS title, category, dietary_category,
              prep_time, servings,
              recipe_ingredients_json AS recipe_ingredients,
              recipe_instructions_json AS recipe_instructions,
              'dev' AS source_type
       FROM dev_recipes
        WHERE status = 'published'
       UNION ALL
       SELECT id, title, category, dietary_category,
              prep_time, servings,
              recipe_ingredients_json AS recipe_ingredients,
              recipe_instructions_json AS recipe_instructions,
              'player' AS source_type
       FROM player_recipes
       WHERE status = 'approved'`,
      []
    );

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

      const ingredients = Array.isArray(rawIngredients) ? toCanonicalIngredients(rawIngredients) : [];
      const instructions = Array.isArray(rawInstructions) ? toCanonicalInstructions(rawInstructions) : [];

      return {
        id: row.id,
        dishName,
        version,
        category: row.category,
        dietaryCategory: row.dietary_category,
        prepTime: row.prep_time,
        servings: row.servings,
        ingredientCount: ingredients.length,
        ingredients,
        instructions,
        sourceType: row.source_type,
        matchScore: s,
      };
    });

    return json({ suggestions });
  } catch (err) {
    console.error('Recipe suggest error:', err);
    return json({ suggestions: [] });
  }
};
