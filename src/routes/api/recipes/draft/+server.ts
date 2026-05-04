import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryAll, queryOne } from '$lib/server/turso';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';

function hasValidLink(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const obj = row as Record<string, unknown>;
  const hasFood = (typeof obj.foodWord === 'string' && obj.foodWord.trim().length > 0)
    || (typeof obj.ndbNo === 'string' && obj.ndbNo.trim().length > 0);
  const portion = Number(obj.portionGrams ?? 0);
  return hasFood && Number.isFinite(portion) && portion > 0;
}

function hasAllIngredientLinks(ingredients: unknown[]): boolean {
  return ingredients.length > 0 && ingredients.every((row) => hasValidLink(row));
}

function withDefaultServingCount(row: unknown): unknown {
  if (!row || typeof row !== 'object') return row;
  const obj = row as Record<string, unknown>;
  const count = Number(obj.servingCount ?? 1);
  return {
    ...obj,
    servingCount: Number.isFinite(count) && count > 0 ? count : 1,
  };
}

// Safe migration — add draft columns if they don't exist yet
async function ensureDraftColumns() {
  return;
}

// GET ?recipeId=xxx&code=xxx  — collaborator loads latest draft
//     ?recipeId=xxx&playerId=xxx — creator loads latest draft
//     ?playerId=xxx (no recipeId) — creator gets all recipe IDs with unseen drafts
export const GET: RequestHandler = async ({ url }) => {
  await ensureDraftColumns();

  const recipeId = url.searchParams.get('recipeId');
  const code = url.searchParams.get('code');
  const playerId = url.searchParams.get('playerId');

  // No recipeId: return all recipe IDs where creator has unseen collaborator drafts
  if (!recipeId && playerId) {
    const rows = await queryAll<{ id: string }>(
      `SELECT recipe_id AS id FROM player_recipes WHERE submitted_by = ? AND draft_data IS NOT NULL AND draft_seen_by_creator = 0 AND draft_is_creator_draft = 0`,
      [playerId]
    );
    return json({ unseenDraftIds: rows.map(r => r.id) });
  }

  if (!recipeId || (!code && !playerId)) {
    return json({ error: 'Missing recipeId and code or playerId' }, { status: 400 });
  }

  const recipe = await queryOne<{
    submitted_by: string;
    edit_code: string | null;
    draft_data: string | null;
    draft_updated_at: string | null;
    draft_is_creator_draft: number | null;
  }>(
    'SELECT submitted_by, edit_code, draft_data, draft_updated_at, draft_is_creator_draft FROM player_recipes WHERE recipe_id = ?',
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
  return json({
    draft,
    draftUpdatedAt: recipe.draft_updated_at ?? null,
    draftIsCreatorDraft: !!(recipe.draft_is_creator_draft)
  });
};

// POST — save a draft (creator or collaborator)
// Creator body: { recipeId, playerId, draftData }
// Collaborator body: { recipeId, code, draftData }
export const POST: RequestHandler = async ({ request }) => {
  await ensureDraftColumns();

  const body = await request.json();
  const { recipeId, code, playerId, draftData } = body;

  if (!recipeId || !draftData || (!code && !playerId)) {
    return json({ error: 'Missing recipeId, draftData, and either code or playerId' }, { status: 400 });
  }

  if (playerId) {
    // Creator saves their own draft
    const recipe = await queryOne<{ submitted_by: string; status: string }>(
      'SELECT submitted_by, status FROM player_recipes WHERE recipe_id = ?',
      [recipeId]
    );
    if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
    if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });
    if (recipe.status !== 'approved') {
      return json({ error: 'Recipe is not approved — drafts only apply to live recipes' }, { status: 409 });
    }
    // Compute nutrition_json from draft data if all ingredients are linked
    const linkType = typeof draftData?.linkMode === 'string' ? draftData.linkMode : null;
    const rawIngs: unknown[] = Array.isArray(draftData?.ingredients) ? draftData.ingredients : [];
    let nutritionJson: string | null = null;
    const hasCompleteIngredientLinks = hasAllIngredientLinks(rawIngs);
    const hasCompleteDishLink = (linkType !== 'dish' && linkType !== 'mixed') || hasValidLink(draftData?.dishLink);
    if (linkType && hasCompleteIngredientLinks && hasCompleteDishLink) {
      const normalizedIngs = rawIngs.map((row) => withDefaultServingCount(row));
      const dishLinkEntry = draftData?.dishLink ? { isDish: true, ...(withDefaultServingCount(draftData.dishLink) as object) } : null;
      const ingRows = (dishLinkEntry ? [dishLinkEntry, ...normalizedIngs] : normalizedIngs) as Parameters<typeof calcNutritionSR28>[0];
      const computed = await calcNutritionSR28(ingRows, linkType, draftData?.servings ?? null, draftData?.cookingMethod ?? draftData?.cookMethod ?? null);
      if (computed) nutritionJson = JSON.stringify(computed);
    }

    if (nutritionJson) {
      await execute(
        `UPDATE player_recipes SET draft_data = ?, draft_updated_at = ?, draft_seen_by_creator = 1, draft_is_creator_draft = 1, nutrition_json = ?, updated_at = datetime('now') WHERE recipe_id = ?`,
        [JSON.stringify(draftData), new Date().toISOString(), nutritionJson, recipeId]
      );
    } else {
      await execute(
        `UPDATE player_recipes SET draft_data = ?, draft_updated_at = ?, draft_seen_by_creator = 1, draft_is_creator_draft = 1, updated_at = datetime('now') WHERE recipe_id = ?`,
        [JSON.stringify(draftData), new Date().toISOString(), recipeId]
      );
    }
    return json({ success: true, nutritionJson: nutritionJson ? JSON.parse(nutritionJson) : null });
  }

  // Collaborator saves draft
  const recipe = await queryOne<{ edit_code: string | null; status: string }>(
    'SELECT edit_code, status FROM player_recipes WHERE recipe_id = ?',
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
    `UPDATE player_recipes SET draft_data = ?, draft_updated_at = ?, draft_seen_by_creator = 0, draft_is_creator_draft = 0, updated_at = datetime('now') WHERE recipe_id = ?`,
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
    'SELECT submitted_by FROM player_recipes WHERE recipe_id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  await execute(
    `UPDATE player_recipes SET draft_data = NULL, draft_updated_at = NULL, draft_seen_by_creator = 1, updated_at = datetime('now') WHERE recipe_id = ?`,
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
    'SELECT submitted_by FROM player_recipes WHERE recipe_id = ?',
    [recipeId]
  );

  if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
  if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });

  await execute(
    `UPDATE player_recipes SET draft_seen_by_creator = 1, updated_at = datetime('now') WHERE recipe_id = ?`,
    [recipeId]
  );

  return json({ success: true });
};
