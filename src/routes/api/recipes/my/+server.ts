import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';
import { calcNutritionJson } from '$lib/server/calcNutrition';

interface RecipeRow {
  id: string;
  type: string;
  name: string;
  category: string;
  dietary_category: string | null;
  prep_time: string | null;
  servings: string | null;
  recipe_ingredients: string | null;
  recipe_instructions: string | null;
  image_url: string | null;
  submitted_by: string;
  submitter_name: string | null;
  status: string;
  created_at: string;
  moderator_note: string | null;
  nutrition_json: string | null;
  link_type: string | null;
}

// GET: Fetch recipes by IDs (anonymous) OR by player_id (subscribers)
export const GET: RequestHandler = async ({ url }) => {
  try {
    // Ensure moderator_note column exists (safe migration)
    try { await execute(`ALTER TABLE recipes ADD COLUMN moderator_note TEXT`); } catch { /* already exists */ }
    
    // For subscribers: query by player_id
    const playerId = url.searchParams.get('player_id');
    
    if (playerId) {
      // Subscriber: fetch all their recipes across devices
      const rows = await queryAll<RecipeRow>(
        `SELECT id, type, name, category, dietary_category, prep_time, servings,
                recipe_ingredients, recipe_instructions, image_url, submitted_by, submitter_name, status, created_at,
                moderator_note, nutrition_json, link_type
         FROM recipes 
         WHERE submitted_by = ? AND type = 'community'
         ORDER BY created_at DESC`,
        [playerId]
      );
      
      const recipes = rows.map(row => ({
        id: row.id,
        recipeName: row.name,
        category: row.category,
        dietaryCategory: row.dietary_category || 'all',
        prepTime: row.prep_time || '',
        servings: row.servings || '',
        ingredients: row.recipe_ingredients ? JSON.parse(row.recipe_ingredients) : [],
        instructions: row.recipe_instructions ? JSON.parse(row.recipe_instructions) : [],
        imageUrl: row.image_url || null,
        submitterName: row.submitter_name || row.submitted_by,
        status: row.status,
        moderatorNote: row.moderator_note || null,
        submittedAt: row.created_at,
        linkType: row.link_type ?? null,
        nutritionJson: row.nutrition_json ? JSON.parse(row.nutrition_json) : null
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
      `SELECT id, type, name, category, dietary_category, prep_time, servings,
              recipe_ingredients, recipe_instructions, image_url, submitted_by, submitter_name, status, created_at,
              moderator_note, nutrition_json, link_type
       FROM recipes 
       WHERE id IN (${placeholders}) AND type = 'community'
       ORDER BY created_at DESC`,
      ids
    );
    
    // Convert to frontend format
    const recipes = rows.map(row => ({
      id: row.id,
      recipeName: row.name,
      category: row.category,
      dietaryCategory: row.dietary_category || 'all',
      prepTime: row.prep_time || '',
      servings: row.servings || '',
      ingredients: row.recipe_ingredients ? JSON.parse(row.recipe_ingredients) : [],
      instructions: row.recipe_instructions ? JSON.parse(row.recipe_instructions) : [],
      imageUrl: row.image_url || null,
      submitterName: row.submitter_name || row.submitted_by,
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
      'SELECT id, status, submitted_by FROM recipes WHERE id = ? AND type = ?',
      [id, 'community']
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
      ? `UPDATE recipes SET
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
          recipe_ingredients = COALESCE(?, recipe_ingredients),
          recipe_instructions = COALESCE(?, recipe_instructions),
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          nutrition_json = ?,
          status = 'pending',
          moderator_note = NULL
         WHERE id = ?`
      : `UPDATE recipes SET
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          dietary_category = COALESCE(?, dietary_category),
          prep_time = COALESCE(?, prep_time),
          servings = COALESCE(?, servings),
          recipe_ingredients = COALESCE(?, recipe_ingredients),
          recipe_instructions = COALESCE(?, recipe_instructions),
          image_url = COALESCE(?, image_url),
          link_type = COALESCE(?, link_type),
          nutrition_json = ?,
          status = 'pending'
         WHERE id = ?`;
    await execute(sql,
      [
        updates.recipeName || null,
        updates.category || null,
        updates.dietaryCategory || null,
        updates.prepTime || null,
        updates.servings || null,
        updates.ingredients ? JSON.stringify(updates.ingredients) : null,
        updates.instructions ? JSON.stringify(updates.instructions) : null,
        updates.imageUrl || null,
        linkType,
        nutritionJson,
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
      'SELECT id, name, status FROM recipes WHERE id = ? AND type = ?',
      [id, 'community']
    );
    
    if (existing.length === 0) {
      return json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const recipe = existing[0];
    
    if (recipe.status !== 'pending') {
      return json({ error: 'Can only withdraw pending recipes' }, { status: 403 });
    }
    
    // Delete the recipe
    await execute('DELETE FROM recipes WHERE id = ? AND status = ?', [id, 'pending']);
    
    console.log(`🗑️ Player withdrew pending recipe: "${recipe.name}"`);
    
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
