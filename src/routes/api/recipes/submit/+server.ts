import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute, queryOne } from '$lib/server/turso';

// Generate unique ID
function generateId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// PATCH — promote a draft recipe to pending, or update its data
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { recipeId, playerId, submit, ...fields } = body;

    if (!recipeId || !playerId) {
      return json({ error: 'Missing recipeId or playerId' }, { status: 400 });
    }

    const recipe = await queryOne<{ submitted_by: string; status: string }>(
      'SELECT submitted_by, status FROM recipes WHERE id = ?',
      [recipeId]
    );
    if (!recipe) return json({ error: 'Recipe not found' }, { status: 404 });
    if (recipe.submitted_by !== playerId) return json({ error: 'Not authorized' }, { status: 403 });
    if (recipe.status !== 'draft') return json({ error: 'Only draft recipes can be updated here' }, { status: 400 });

    const newStatus = submit ? 'pending' : 'draft';

    if (fields.recipeName) {
      await execute(
        `UPDATE recipes SET
          name = ?, category = ?, dietary_category = ?,
          prep_time = ?, servings = ?,
          recipe_ingredients = ?, recipe_instructions = ?,
          image_url = COALESCE(?, image_url),
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
          newStatus,
          recipeId
        ]
      );
    } else {
      // status-only change (just submitting)
      await execute('UPDATE recipes SET status = ? WHERE id = ?', [newStatus, recipeId]);
    }

    return json({ success: true, id: recipeId, status: newStatus });
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
    if (!body.recipeName || !body.category || !body.ingredients?.length || !body.instructions?.length) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const recipeId = generateId();
    
    const submittedBy = body.playerId;
    const submitterName = body.submitterName || 'Player';
    const status = body.draft === true ? 'draft' : 'pending';
    
    // Insert into Turso
    await execute(
      `INSERT INTO recipes (
        id, type, name, category, dietary_category,
        prep_time, servings,
        recipe_ingredients, recipe_instructions,
        image_url,
        submitted_by, submitter_name, status, created_at
      ) VALUES (?, 'community', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        recipeId,
        body.recipeName,
        body.category,
        body.dietaryCategory || null,
        body.prepTime || null,
        body.servings || null,
        JSON.stringify(body.ingredients),
        JSON.stringify(body.instructions),
        body.imageUrl || null,
        submittedBy,
        submitterName,
        status
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
