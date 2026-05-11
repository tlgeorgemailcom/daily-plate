import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne } from '$lib/server/turso';

// POST — validate an edit code and return the associated recipe ID
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { code } = body;

  if (!code || typeof code !== 'string') {
    return json({ error: 'Missing code' }, { status: 400 });
  }

  const recipe = await queryOne<{ recipe_id: string; recipe_name: string; submitted_by: string }>(
    `SELECT recipe_id, recipe_name, submitted_by FROM player_recipes WHERE edit_code = ?`,
    [code.toUpperCase().trim()]
  );

  if (!recipe) return json({ error: 'Invalid or expired edit code' }, { status: 404 });

  return json({ recipeId: recipe.recipe_id, recipeName: recipe.recipe_name });
};
