import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryOne } from '$lib/server/turso';
import { calcNutritionJson } from '$lib/server/calcNutrition';

const EMPTY_NUTRITION_JSON = '{}';
const DEFAULT_VERSION = 'pending';

// Generate unique ID
function generateId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// PATCH — promote a draft recipe to pending, or update its data
// Auth: creator uses playerId; collaborators use edit code (code field).
// Collaborators can only save (submit=false) — they cannot submit for approval.
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { recipeId, playerId, code, submit, ...fields } = body;

    if (!recipeId || (!playerId && !code)) {
      return json({ error: 'Missing recipeId and playerId or code' }, { status: 400 });
    }

    const recipe = await queryOne<{ submitted_by: string; status: string; edit_code: string | null }>(
      'SELECT user_id AS submitted_by, status, edit_code FROM player_recipes WHERE id = ?',
      [recipeId]
    );
    if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
    if (recipe.status !== 'draft') return json({ error: 'Only draft recipes can be updated here' }, { status: 400 });

    const isCreator = playerId && recipe.submitted_by === playerId;
    const isCollaborator = code && recipe.edit_code && recipe.edit_code === code.toUpperCase().trim();

    if (!isCreator && !isCollaborator) {
      return json({ error: 'Not authorized' }, { status: 403 });
    }
    if (isCollaborator && submit) {
      return json({ error: 'Only the recipe creator can submit for approval' }, { status: 403 });
    }
    if (isCreator && submit) {
      const creator = await queryOne<{ subscription_tier: string }>(
        'SELECT subscription_tier FROM players WHERE id = ?',
        [playerId]
      );
      if (!creator || creator.subscription_tier === 'free') {
        return json({ error: 'Subscription required to submit recipes' }, { status: 403 });
      }
    }

    const newStatus = submit ? 'pending' : 'draft';

    const nutritionJson = (fields.linkType && Array.isArray(fields.ingredients) && fields.ingredients.length > 0)
      ? calcNutritionJson(fields.ingredients, fields.linkType, fields.servings, fields.cookMethod ?? null)
      : null;

    if (fields.recipeName) {
      await execute(
        `UPDATE player_recipes SET
          title = ?, category = ?, dietary_category = ?,
          prep_time = ?, servings = ?,
          recipe_ingredients_json = ?, recipe_instructions_json = ?,
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          cook_method = COALESCE(?, cook_method),
          nutrition_json = ?,
          updated_at = datetime('now'),
          status = ?
        WHERE id = ?`,
        [
          fields.recipeName,
          fields.category,
          fields.dietaryCategory || null,
          fields.prepTime || null,
          fields.servings || null,
          JSON.stringify(fields.ingredients || []),
          JSON.stringify(fields.instructions || []),
          fields.imageUrl || null,
          fields.linkType || null,
          fields.cookMethod || null,
          nutritionJson ? JSON.stringify(nutritionJson) : EMPTY_NUTRITION_JSON,
          newStatus,
          recipeId
        ]
      );
    } else {
      // status-only change (just submitting)
      await execute('UPDATE player_recipes SET status = ?, updated_at = datetime(\'now\') WHERE id = ?', [newStatus, recipeId]);
    }

    return json({ success: true, id: recipeId, status: newStatus, nutritionJson });
  } catch (err) {
    console.error('Failed to update draft recipe:', err);
    return json({ error: 'Failed to update draft' }, { status: 500 });
  }
};

interface RecipeRow {
  id: string;
  name: string;
  category: string;
  submitted_by: string;
  status: string;
  created_at: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Require player ID and paid subscription - free users cannot submit recipes
    if (!body.playerId) {
      return json({ error: 'Login required to submit recipes' }, { status: 401 });
    }
    
    // Verify player has paid subscription (database usage costs money)
    const player = await queryOne<{ subscription_tier: string }>(
      'SELECT subscription_tier FROM players WHERE id = ?',
      [body.playerId]
    );
    
    if (!player || player.subscription_tier === 'free') {
      return json({ error: 'Subscription required to submit recipes' }, { status: 403 });
    }
    
    // Validate required fields
    // Drafts only need a recipe name — collaborators fill in the rest.
    // Full submissions require ingredients and instructions too.
    if (!body.recipeName || !body.category) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (body.draft !== true && (!body.ingredients?.length || !body.instructions?.length)) {
      return json({ error: 'Ingredients and instructions are required to submit for approval' }, { status: 400 });
    }
    
    const recipeId = generateId();
    
    const submittedBy = body.playerId;
    const submitterName = body.submitterName || 'Player';
    const status = body.draft === true ? 'draft' : 'pending';
    
    // Insert into Turso
    await execute(
      `INSERT INTO player_recipes (
        id, user_id, title, category, dietary_category,
        prep_time, servings,
        recipe_ingredients_json, recipe_instructions_json,
        image_url, link_type, cook_method, nutrition_json,
        submitter_name, status, created_at, updated_at,
        grams_per_serving, nutrient_version, retention_model_version, source_match_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?, ?)`,
      [
        recipeId,
        submittedBy,
        body.recipeName,
        body.category,
        body.dietaryCategory || null,
        body.prepTime || null,
        body.servings || null,
        JSON.stringify(body.ingredients),
        JSON.stringify(body.instructions),
        body.imageUrl || null,
        body.linkType || null,
        body.cookMethod || null,
        EMPTY_NUTRITION_JSON,
        submitterName,
        status
        ,0,
        DEFAULT_VERSION,
        DEFAULT_VERSION,
        DEFAULT_VERSION
      ]
    );
    
    console.log(`✅ New recipe ${status === 'draft' ? 'draft saved' : 'submitted'}: "${body.recipeName}" by ${submitterName} (player: ${submittedBy})`);
    
    return json({ 
      success: true, 
      id: recipeId,
      status,
      message: status === 'draft' ? 'Draft saved!' : 'Recipe submitted for review!'
    });
    
  } catch (err) {
    console.error('Failed to save recipe:', err);
    return json({ error: 'Failed to submit recipe' }, { status: 500 });
  }
};
