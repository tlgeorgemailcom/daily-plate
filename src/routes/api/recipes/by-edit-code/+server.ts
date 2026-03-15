import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne } from '$lib/server/turso';

// GET ?code=ABC123 — look up a draft recipe by its edit code
// Used by collaborators entering a code in the Share Your Recipe screen.
// Only returns recipes with status='draft' (new recipes in progress).
// Approved-recipe editing (RecipeBook flow) uses the draft endpoint directly.
export const GET: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code')?.toUpperCase().trim();

  if (!code) {
    return json({ error: 'Missing code' }, { status: 400 });
  }

  const recipe = await queryOne<{
    id: string;
    name: string;
    category: string;
    dietary_category: string | null;
    prep_time: string | null;
    servings: string | null;
    recipe_ingredients: string | null;
    recipe_instructions: string | null;
    status: string;
  }>(
    `SELECT id, name, category, dietary_category, prep_time, servings,
            recipe_ingredients, recipe_instructions, status
     FROM recipes WHERE edit_code = ? AND status = 'draft'`,
    [code]
  );

  if (!recipe) {
    return json({ error: 'Code not found — make sure the creator has saved a draft first' }, { status: 404 });
  }

  return json({
    recipeId: recipe.id,
    name: recipe.name,
    category: recipe.category,
    dietaryCategory: recipe.dietary_category ?? 'all',
    prepTime: recipe.prep_time ?? '',
    servings: recipe.servings ?? '',
    ingredients: recipe.recipe_ingredients ? JSON.parse(recipe.recipe_ingredients) : [],
    instructions: recipe.recipe_instructions ? JSON.parse(recipe.recipe_instructions) : [],
  });
};
