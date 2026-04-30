import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';
import { calcNutritionJson } from '$lib/server/calcNutrition';
import { toDisplayRecipeCategory, toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';

interface RecipeRow {
  id: string;
  title: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe_ingredients_json: string | null;
  recipe_instructions_json: string | null;
  image_url: string | null;
  user_id: string;
  submitter_name: string | null;
  status: string;
  created_at: string;
  moderator_note: string | null;
  nutrition_json: string | null;
  link_type: string | null;
}

const EMPTY_NUTRITION_JSON = '{}';

// GET: Fetch recipes by IDs (anonymous) OR by player_id (subscribers)
export const GET: RequestHandler = async ({ url }) => {
  try {
    // For subscribers: query by player_id
    const playerId = url.searchParams.get('player_id');
    
    if (playerId) {
      // Subscriber: fetch all their recipes across devices
      const rows = await queryAll<RecipeRow>(
        `SELECT id, title, category, dietary_category, prep_time, servings,
          recipe_ingredients_json, recipe_instructions_json, image_url, user_id, submitter_name, status, created_at,
                moderator_note, nutrition_json, link_type
         FROM player_recipes 
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [playerId]
      );
      
      const recipes = rows.map(row => ({
        id: row.id,
        recipeName: row.title,
        category: toDisplayRecipeCategory(row.category),
        dietaryCategory: row.dietary_category || 'all',
        prepTime: row.prep_time || '',
        servings: row.servings || '',
        ingredients: row.recipe_ingredients_json ? JSON.parse(row.recipe_ingredients_json) : [],
        instructions: row.recipe_instructions_json ? JSON.parse(row.recipe_instructions_json) : [],
        imageUrl: row.image_url || null,
        submitterName: row.submitter_name || row.user_id,
        status: row.status,
        moderatorNote: row.moderator_note || null,
        submittedAt: row.created_at,
        linkType: row.link_type ?? null,
        nutritionJson: row.nutrition_json && row.nutrition_json !== EMPTY_NUTRITION_JSON
          ? JSON.parse(row.nutrition_json)
          : null
      }));
      
      return json({ recipes });
    }
    
    // For anonymous: query by IDs from localStorage
    const idsParam = url.searchParams.get('ids');
    
    if (!idsParam) {
      return json({ error: 'Missing ids or player_id parameter' }, { status: 400 });
    }
    
    const ids = idsParam.split(',').filter(id => id.trim());
    
    if (ids.length === 0) {
      return json({ recipes: [] });
    }
    
    // Build query with placeholders
    const placeholders = ids.map(() => '?').join(', ');
    const rows = await queryAll<RecipeRow>(
      `SELECT id, title, category, dietary_category, prep_time, servings,
              recipe_ingredients_json, recipe_instructions_json, image_url, user_id, submitter_name, status, created_at,
              moderator_note, nutrition_json, link_type
       FROM player_recipes 
       WHERE id IN (${placeholders})
       ORDER BY created_at DESC`,
      ids
    );
    
    // Convert to frontend format
    const recipes = rows.map(row => ({
      id: row.id,
      recipeName: row.title,
      category: toDisplayRecipeCategory(row.category),
      dietaryCategory: row.dietary_category || 'all',
      prepTime: row.prep_time || '',
      servings: row.servings || '',
      ingredients: row.recipe_ingredients_json ? JSON.parse(row.recipe_ingredients_json) : [],
      instructions: row.recipe_instructions_json ? JSON.parse(row.recipe_instructions_json) : [],
      imageUrl: row.image_url || null,
      submitterName: row.submitter_name || row.user_id,
      status: row.status,
      moderatorNote: row.moderator_note || null,
      submittedAt: row.created_at,
      linkType: row.link_type ?? null,
    }));
    
    return json({ recipes });
    
  } catch (err) {
    console.error('Failed to fetch player recipes:', err);
    return json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
};

// PATCH: Update a pending recipe (player can only edit their own pending recipes)
export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, updates, submitterName } = body;
    
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    if (!updates || typeof updates !== 'object') {
      return json({ error: 'Missing updates object' }, { status: 400 });
    }
    
    // Verify the recipe exists, is pending, and belongs to this submitter
    const existing = await queryAll<RecipeRow>(
      'SELECT id, status, user_id, title, category, dietary_category, prep_time, servings, recipe_ingredients_json, recipe_instructions_json, image_url, submitter_name, moderator_note, nutrition_json, link_type, created_at FROM player_recipes WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const recipe = existing[0];
    
    if (!['pending', 'needs_changes', 'approved'].includes(recipe.status)) {
      return json({ error: 'Can only edit pending, needs_changes, or approved recipes' }, { status: 403 });
    }
    
    // Note: We rely on localStorage tracking for ownership since we don't have auth
    // The frontend only sends requests for recipes in the player's localStorage
    
    // Reset approved recipes back to pending (re-approval required)
    const shouldResetToPending = recipe.status === 'needs_changes' || recipe.status === 'approved';

    // Compute nutrition_json if linkType is provided
    const linkType = typeof updates.linkType === 'string' ? updates.linkType : null;
    const rawIngs: unknown[] = Array.isArray(updates.ingredients) ? updates.ingredients : [];
    let nutritionJson: string | null = null;
    if (linkType && rawIngs.length > 0) {
      const computed = calcNutritionJson(
        rawIngs as Parameters<typeof calcNutritionJson>[0],
        linkType,
        typeof updates.servings === 'string' ? updates.servings : null
      );
      if (computed) nutritionJson = JSON.stringify(computed);
    }

    // Update the recipe and reset to pending (clears any needs_changes or approved state)
    const sql = shouldResetToPending
      ? `UPDATE player_recipes SET
        title = COALESCE(?, title),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
        recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
        recipe_instructions_json = COALESCE(?, recipe_instructions_json),
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          nutrition_json = ?,
        updated_at = datetime('now'),
          status = 'pending',
          moderator_note = NULL
         WHERE id = ?`
      : `UPDATE player_recipes SET
        title = COALESCE(?, title),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
        recipe_ingredients_json = COALESCE(?, recipe_ingredients_json),
        recipe_instructions_json = COALESCE(?, recipe_instructions_json),
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          nutrition_json = ?,
        updated_at = datetime('now'),
          status = 'pending'
         WHERE id = ?`;
    await execute(sql,
      [
        updates.recipeName || null,
        (updates.category ? toStoredRecipeCategory(updates.category) : null),
        updates.dietaryCategory || null,
        updates.prepTime || null,
        updates.servings || null,
        updates.ingredients ? JSON.stringify(updates.ingredients) : null,
        updates.instructions ? JSON.stringify(updates.instructions) : null,
        updates.imageUrl || null,
        linkType,
        nutritionJson || EMPTY_NUTRITION_JSON,
        id
      ]
    );

    console.log(`✏️ Player edited pending recipe: "${updates.recipeName || id}"`);

    return json({
      success: true,
      id,
      message: 'Recipe updated!',
      nutritionJson: nutritionJson ? JSON.parse(nutritionJson) : null
    });
    
  } catch (err) {
    console.error('Failed to update recipe:', err);
    return json({ error: 'Failed to update recipe' }, { status: 500 });
  }
};

// DELETE: Withdraw a pending recipe
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return json({ error: 'Missing recipe id' }, { status: 400 });
    }
    
    // Verify the recipe exists and is pending
    const existing = await queryAll<RecipeRow>(
      'SELECT id, title, status, user_id, category, dietary_category, prep_time, servings, recipe_ingredients_json, recipe_instructions_json, image_url, submitter_name, moderator_note, nutrition_json, link_type, created_at FROM player_recipes WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const recipe = existing[0];
    
    if (recipe.status !== 'pending') {
      return json({ error: 'Can only withdraw pending recipes' }, { status: 403 });
    }
    
    // Delete the recipe
    await execute('DELETE FROM player_recipes WHERE id = ? AND status = ?', [id, 'pending']);
    
    console.log(`🗑️ Player withdrew pending recipe: "${recipe.title}"`);
    
    return json({ 
      success: true, 
      id,
      message: 'Recipe withdrawn'
    });
    
  } catch (err) {
    console.error('Failed to withdraw recipe:', err);
    return json({ error: 'Failed to withdraw recipe' }, { status: 500 });
  }
};
