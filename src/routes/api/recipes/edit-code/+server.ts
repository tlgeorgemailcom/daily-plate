import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryOne } from '$lib/server/turso';

function generateCode(): string {
  // 6 chars — no O/0 or I/1 to avoid visual confusion
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// GET — return current edit code for a recipe (owner only)
export const GET: RequestHandler = async ({ url }) => {
  const recipeId = url.searchParams.get('recipeId');
  const playerId = url.searchParams.get('playerId');

  if (!recipeId || !playerId) {
    return json({ error: 'Missing recipeId or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{ submitted_by: string; edit_code: string | null }>(
    'SELECT submitted_by, edit_code FROM player_recipes WHERE recipe_id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  return json({ code: recipe.edit_code ?? null });
};

// POST — generate a new edit code (or return existing one)
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { recipeId, playerId } = body;

  if (!recipeId || !playerId) {
    return json({ error: 'Missing recipeId or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{ submitted_by: string; edit_code: string | null }>(
    'SELECT submitted_by, edit_code FROM player_recipes WHERE recipe_id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  let code = recipe.edit_code;
  if (!code) {
    code = generateCode();
    await execute('UPDATE player_recipes SET edit_code = ?, updated_at = datetime(\'now\') WHERE recipe_id = ?', [code, recipeId]);
  }

  return json({ code });
};

// DELETE — revoke the edit code
export const DELETE: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { recipeId, playerId } = body;

  if (!recipeId || !playerId) {
    return json({ error: 'Missing recipeId or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{ submitted_by: string }>(
    'SELECT submitted_by FROM player_recipes WHERE recipe_id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  await execute('UPDATE player_recipes SET edit_code = NULL, updated_at = datetime(\'now\') WHERE recipe_id = ?', [recipeId]);

  return json({ success: true });
};
