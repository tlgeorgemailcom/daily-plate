// Custom Foods Sync API - Sync localStorage with cloud
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';

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
  portions: string;
  created_at: string;
}

interface LocalCustomFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  water: number;
  foodGroup: string;     // Note: different casing from DB
  portions: Array<{ amt: number; desc: string; gm: number }>;
  createdAt: number;     // Timestamp vs ISO string
}

// POST /api/custom-foods/sync - Merge local and cloud foods
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, localFoods } = body as { 
    player_id: string; 
    localFoods: LocalCustomFood[] 
  };
  
  if (!player_id) {
    throw error(400, 'Missing player_id');
  }
  
  try {
    // Get all cloud foods for this player
    const cloudFoods = await queryAll<CustomFood>(
      'SELECT * FROM custom_foods WHERE player_id = ?',
      [player_id]
    );
    
    // Build a map of cloud foods by ID
    const cloudMap = new Map(cloudFoods.map(f => [f.id, f]));
    const localMap = new Map((localFoods || []).map(f => [f.id, f]));
    
    // Foods to add to cloud (in local but not in cloud)
    const toAdd: LocalCustomFood[] = [];
    // Foods to return to local (in cloud but not in local)
    const toReturn: CustomFood[] = [];
    
    // Check local foods
    for (const localFood of localFoods || []) {
      if (!cloudMap.has(localFood.id)) {
        toAdd.push(localFood);
      }
    }
    
    // Check cloud foods
    for (const cloudFood of cloudFoods) {
      if (!localMap.has(cloudFood.id)) {
        toReturn.push(cloudFood);
      }
    }
    
    // Add local foods to cloud
    for (const food of toAdd) {
      await execute(
        `INSERT INTO custom_foods (
          id, player_id, name, food_group,
          calories, protein, carbs, fat, fiber, sugar, water,
          portions, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          food.id,
          player_id,
          food.name,
          food.foodGroup,
          food.calories || 0,
          food.protein || 0,
          food.carbs || 0,
          food.fat || 0,
          food.fiber || 0,
          food.sugar || 0,
          food.water || 0,
          JSON.stringify(food.portions || []),
          new Date(food.createdAt).toISOString()
        ]
      );
    }
    
    // Get final merged list
    const finalFoods = await queryAll<CustomFood>(
      'SELECT * FROM custom_foods WHERE player_id = ? ORDER BY created_at DESC',
      [player_id]
    );
    
    // Convert to local format for client
    const mergedFoods = finalFoods.map(f => ({
      id: f.id,
      name: f.name,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      fiber: f.fiber,
      sugar: f.sugar,
      water: f.water,
      foodGroup: f.food_group,
      portions: JSON.parse(f.portions || '[]'),
      createdAt: new Date(f.created_at).getTime()
    }));
    
    return json({
      action: 'merged',
      added_to_cloud: toAdd.length,
      added_from_cloud: toReturn.length,
      foods: mergedFoods
    });
  } catch (e) {
    console.error('Failed to sync custom foods:', e);
    throw error(500, 'Database error');
  }
};
