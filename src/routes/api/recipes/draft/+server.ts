import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryAll, queryOne } from '$lib/server/turso';
import { buildRecipeCommunity } from '$lib/nutrition/buildRecipeCommunity';
import type { CommunitySection, CommunityIngredient } from '$lib/nutrition/types';
import { fetchNutrientsByNdb } from '$lib/server/nutrition/fetchNutrients';

// ── Community nutrition builder ────────────────────────────────────────────────
async function calcCommunityNutrition(
  ingredientsRaw: unknown[],
  sectionsRaw: unknown[],
  servings: unknown,
  gramsPerServing: unknown,
): Promise<{ nutritionJson: object | null; plausibilityFlags: string[] }> {
  const sections = (sectionsRaw as unknown[]).filter(
    (s): s is CommunitySection =>
      !!s && typeof s === 'object' && typeof (s as Record<string, unknown>).sectionKey === 'string',
  );
  const ingredients: CommunityIngredient[] = (ingredientsRaw as unknown[]).map(r => {
    const obj = r as Record<string, unknown>;
    return {
      ndbNo:        String(obj.ndbNo ?? ''),
      portionGrams: Number(obj.portionGrams ?? 0),
      sectionKey:   typeof obj.section === 'string' ? obj.section : undefined,
      isOptional:   obj.ingredientStatus === 'optional' || obj.exempt === true,
      exempt:       obj.ingredientStatus === 'exempt',
    };
  }).filter(i => i.ndbNo && i.portionGrams > 0);

  if (ingredients.length === 0) return { nutritionJson: null, plausibilityFlags: [] };

  const ndbNos = ingredients
    .filter(i => !i.isOptional && !i.exempt)
    .map(i => i.ndbNo);

  const nutrientMap = await fetchNutrientsByNdb(ndbNos);
  const servingsNum        = Math.max(1, Number(servings ?? 1));
  const gramsPerServingNum = Math.max(1, Number(gramsPerServing ?? 100));

  const result = buildRecipeCommunity(sections, ingredients, nutrientMap, servingsNum, gramsPerServingNum);

  const p100  = result.per100g;
  const gps   = result.gramsPerServing;
  const scale = gps / 100;
  const nutritionJson = {
    perServing: {
      cal:  (p100.energy_KCal       ?? 0) * scale,
      pro:  (p100.protein           ?? 0) * scale,
      fat:  (p100.totalLipidFat     ?? 0) * scale,
      carb: (p100.carbohydrate      ?? 0) * scale,
      fib:  (p100.fiberTotalDietary ?? 0) * scale,
      sug:  (p100.sugarsTotal       ?? 0) * scale,
    },
    per100g: {
      Energy_KCal:       p100.energy_KCal       ?? 0,
      Protein:           p100.protein           ?? 0,
      TotalLipidFat:     p100.totalLipidFat     ?? 0,
      Carbohydrate:      p100.carbohydrate      ?? 0,
      FiberTotalDietary: p100.fiberTotalDietary ?? 0,
      SugarsTotal:       p100.sugarsTotal       ?? 0,
      Water:             p100.water             ?? 0,
    },
    gramsPerServing: gps,
    servings:        servingsNum,
  };
  return { nutritionJson, plausibilityFlags: result.plausibility.flags };
}

// Safe migration — add draft columns if they don't exist yet
async function ensureDraftColumns() {
  try {
    await execute(`ALTER TABLE player_recipes ADD COLUMN draft_saved_by_name TEXT`, []);
  } catch { /* column already exists */ }
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
    draft_saved_by_name: string | null;
  }>(
    'SELECT submitted_by, edit_code, draft_data, draft_updated_at, draft_is_creator_draft, draft_saved_by_name FROM player_recipes WHERE recipe_id = ?',
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
    draftIsCreatorDraft: !!(recipe.draft_is_creator_draft),
    draftSavedByName: recipe.draft_saved_by_name ?? null
  });
};

// POST — save a draft (creator or collaborator)
// Creator body: { recipeId, playerId, draftData }
// Collaborator body: { recipeId, code, draftData }
export const POST: RequestHandler = async ({ request }) => {
  await ensureDraftColumns();

  const body = await request.json();
  const { recipeId, code, playerId, draftData, collabName } = body;

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
    const rawIngs: unknown[] = Array.isArray(draftData?.ingredients) ? draftData.ingredients : [];
    let nutritionJson: string | null = null;
    const draftSections = Array.isArray(draftData?.sections) ? draftData.sections : [];
    const hasCommunityBuild =
      draftSections.length > 0 &&
      rawIngs.length > 0 &&
      rawIngs
        .filter((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return obj.ingredientStatus !== 'exempt' && obj.ingredientStatus !== 'optional' && obj.exempt !== true;
        })
        .every((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return typeof obj.ndbNo === 'string' && (obj.ndbNo as string).trim().length > 0;
        });
    if (hasCommunityBuild) {
      const comm = await calcCommunityNutrition(rawIngs, draftSections, draftData?.servings, draftData?.gramsPerServing ?? 100);
      if (comm.nutritionJson) nutritionJson = JSON.stringify(comm.nutritionJson);
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

  const savedByName = (typeof collabName === 'string' && collabName.trim()) ? collabName.trim().slice(0, 80) : null;
  await execute(
    `UPDATE player_recipes SET draft_data = ?, draft_updated_at = ?, draft_seen_by_creator = 0, draft_is_creator_draft = 0, draft_saved_by_name = ?, updated_at = datetime('now') WHERE recipe_id = ?`,
    [JSON.stringify(draftData), new Date().toISOString(), savedByName, recipeId]
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
