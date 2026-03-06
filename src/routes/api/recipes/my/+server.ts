import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';

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
}

// GET: Fetch recipes by IDs (anonymous) OR by player_id (subscribers)
export const GET: RequestHandler = async ({ url }) => {
  try {
    // For subscribers: query by player_id
    const playerId = url.searchParams.get('player_id');
    
    if (playerId) {
      // Subscriber: fetch all their recipes across devices
      const rows = await queryAll<RecipeRow>(
        `SELECT id, type, name, category, dietary_category, prep_time, servings,
                recipe_ingredients, recipe_instructions, image_url, submitted_by, submitter_name, status, created_at
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
        submittedAt: row.created_at
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
              recipe_ingredients, recipe_instructions, image_url, submitted_by, submitter_name, status, created_at
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
      submittedAt: row.created_at
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
    
    if (recipe.status !== 'pending') {
      return json({ error: 'Can only edit pending recipes' }, { status: 403 });
    }
    
    // Note: We rely on localStorage tracking for ownership since we don't have auth
    // The frontend only sends requests for recipes in the player's localStorage
    
    // Update the recipe
    await execute(
      `UPDATE recipes SET 
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        dietary_category = COALESCE(?, dietary_category),
        prep_time = COALESCE(?, prep_time),
        servings = COALESCE(?, servings),
        recipe_ingredients = COALESCE(?, recipe_ingredients),
        recipe_instructions = COALESCE(?, recipe_instructions),
        image_url = COALESCE(?, image_url)
       WHERE id = ? AND status = 'pending'`,
      [
        updates.recipeName || null,
        updates.category || null,
        updates.dietaryCategory || null,
        updates.prepTime || null,
        updates.servings || null,
        updates.ingredients ? JSON.stringify(updates.ingredients) : null,
        updates.instructions ? JSON.stringify(updates.instructions) : null,
        updates.imageUrl || null,
        id
      ]
    );
    
    console.log(`✏️ Player edited pending recipe: "${updates.recipeName || id}"`);
    
    return json({ 
      success: true, 
      id,
      message: 'Recipe updated!'
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
