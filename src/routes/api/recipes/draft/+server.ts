import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryOne } from '$lib/server/turso';

// Safe migration — add draft columns if they don't exist yet
async function ensureDraftColumns() {
  await Promise.allSettled([
    execute('ALTER TABLE recipes ADD COLUMN draft_data TEXT'),
    execute('ALTER TABLE recipes ADD COLUMN draft_updated_at TEXT'),
    execute('ALTER TABLE recipes ADD COLUMN draft_seen_by_creator INTEGER DEFAULT 1')
  ]);
}

// GET ?recipeId=xxx&code=xxx  — collaborator loads latest draft
//     ?recipeId=xxx&playerId=xxx — creator loads latest draft
export const GET: RequestHandler = async ({ url }) => {
  await ensureDraftColumns();

  const recipeId = url.searchParams.get('recipeId');
  const code = url.searchParams.get('code');
  const playerId = url.searchParams.get('playerId');

  if (!recipeId || (!code && !playerId)) {
    return json({ error: 'Missing recipeId and code or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{
    submitted_by: string;
    edit_code: string | null;
    draft_data: string | null;
    draft_updated_at: string | null;
  }>(
    'SELECT submitted_by, edit_code, draft_data, draft_updated_at FROM recipes WHERE id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });

  // Auth: creator by playerId, or collaborator by matching edit_code
  const isCreator = playerId && recipe.submitted_by === playerId;
  const isCollaborator = code && recipe.edit_code && recipe.edit_code === code.toUpperCase().trim();

  if (!isCreator && !isCollaborator) {
    return json({ error: 'Not authorized' }, { status: 403 });
  }

  const draft = recipe.draft_data ? JSON.parse(recipe.draft_data) : null;
  return json({ draft, draftUpdatedAt: recipe.draft_updated_at ?? null });
};

// POST — collaborator saves a draft
// Body: { recipeId, code, draftData }
export const POST: RequestHandler = async ({ request }) => {
  await ensureDraftColumns();

  const body = await request.json();
  const { recipeId, code, draftData } = body;

  if (!recipeId || !code || !draftData) {
    return json({ error: 'Missing recipeId, code, or draftData' }, { status: 400 });
  }

  const recipe = await queryOne<{ edit_code: string | null; status: string }>(
    'SELECT edit_code, status FROM recipes WHERE id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (!recipe.edit_code || recipe.edit_code !== code.toUpperCase().trim()) {
    return json({ error: 'Invalid edit code' }, { status: 403 });
  }
  if (recipe.status !== 'approved') {
    return json({ error: 'Recipe is not approved — drafts only apply to live recipes' }, { status: 409 });
  }

  await execute(
    `UPDATE recipes SET draft_data = ?, draft_updated_at = ?, draft_seen_by_creator = 0 WHERE id = ?`,
    [JSON.stringify(draftData), new Date().toISOString(), recipeId]
  );

  return json({ success: true });
};

// DELETE — creator clears the draft (after reviewing / submitting)
// Body: { recipeId, playerId }
export const DELETE: RequestHandler = async ({ request }) => {
  await ensureDraftColumns();

  const body = await request.json();
  const { recipeId, playerId } = body;

  if (!recipeId || !playerId) {
    return json({ error: 'Missing recipeId or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{ submitted_by: string }>(
    'SELECT submitted_by FROM recipes WHERE id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  await execute(
    `UPDATE recipes SET draft_data = NULL, draft_updated_at = NULL, draft_seen_by_creator = 1 WHERE id = ?`,
    [recipeId]
  );

  return json({ success: true });
};

// PATCH — mark draft as seen by creator
// Body: { recipeId, playerId }
export const PATCH: RequestHandler = async ({ request }) => {
  await ensureDraftColumns();

  const body = await request.json();
  const { recipeId, playerId } = body;

  if (!recipeId || !playerId) {
    return json({ error: 'Missing recipeId or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{ submitted_by: string }>(
    'SELECT submitted_by FROM recipes WHERE id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  await execute(
    `UPDATE recipes SET draft_seen_by_creator = 1 WHERE id = ?`,
    [recipeId]
  );

  return json({ success: true });
};
