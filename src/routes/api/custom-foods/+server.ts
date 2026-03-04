// Custom Foods API - User-created foods with nutrition data
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, queryAll, execute } from '$lib/server/turso';

interface CustomFood {
  id: string;
  player_id: string;
  name: string;
  food_group: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  water: number;
  portions: string; // JSON string
  created_at: string;
}

// GET /api/custom-foods?player_id=xxx
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const foods = await queryAll<CustomFood>(
      'SELECT * FROM custom_foods WHERE player_id = ? ORDER BY created_at DESC',
      [playerId]
    );
    
    // Parse portions JSON for each food
    const parsed = foods.map(food => ({
      ...food,
      portions: JSON.parse(food.portions || '[]')
    }));
    
    return json(parsed);
  } catch (e) {
    console.error('Failed to fetch custom foods:', e);
    throw error(500, 'Database error');
  }
};

// POST /api/custom-foods - Create a new custom food
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { 
    id, player_id, name, food_group, 
    calories, protein, carbs, fat, fiber, sugar, water,
    portions 
  } = body;
  
  if (!player_id || !name || !food_group) {
    throw error(400, 'Missing required fields: player_id, name, food_group');
  }
  
  // Generate ID if not provided
  const foodId = id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    await execute(
      `INSERT INTO custom_foods (
        id, player_id, name, food_group,
        calories, protein, carbs, fat, fiber, sugar, water,
        portions, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        foodId,
        player_id,
        name,
        food_group,
        calories || 0,
        protein || 0,
        carbs || 0,
        fat || 0,
        fiber || 0,
        sugar || 0,
        water || 0,
        JSON.stringify(portions || [])
      ]
    );
    
    const created = await queryOne<CustomFood>(
      'SELECT * FROM custom_foods WHERE id = ?',
      [foodId]
    );
    
    if (created) {
      return json({
        ...created,
        portions: JSON.parse(created.portions || '[]')
      }, { status: 201 });
    }
    
    throw error(500, 'Failed to retrieve created food');
  } catch (e) {
    if ((e as { status?: number }).status) throw e;
    console.error('Failed to create custom food:', e);
    throw error(500, 'Database error');
  }
};

// DELETE /api/custom-foods?id=xxx&player_id=xxx
export const DELETE: RequestHandler = async ({ url }) => {
  const foodId = url.searchParams.get('id');
  const playerId = url.searchParams.get('player_id');
  
  if (!foodId || !playerId) {
    throw error(400, 'Missing id or player_id parameter');
  }
  
  try {
    // Verify ownership before deleting
    const food = await queryOne<CustomFood>(
      'SELECT player_id FROM custom_foods WHERE id = ?',
      [foodId]
    );
    
    if (!food) {
      throw error(404, 'Food not found');
    }
    
    if (food.player_id !== playerId) {
      throw error(403, 'Not authorized to delete this food');
    }
    
    await execute(
      'DELETE FROM custom_foods WHERE id = ?',
      [foodId]
    );
    
    return json({ success: true });
  } catch (e) {
    if ((e as { status?: number }).status) throw e;
    console.error('Failed to delete custom food:', e);
    throw error(500, 'Database error');
  }
};
