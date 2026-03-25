// Player Settings API - Balanced Diet preferences
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

interface PlayerSettings {
  player_id: string;
  calorie_target: number;
  is_custom_calories: number;
  custom_calories: number;
  protein_ratio: number;
  carbs_ratio: number;
  fats_ratio: number;
  veg_plate_ratio: number;
  fruit_plate_ratio: number;
  grain_plate_ratio: number;
  protein_plate_ratio: number;
  water_target: string;
  protein_target: string;
  carbs_target: string;
  fats_target: string;
  fiber_target: string;
  sugar_target: string;
  // Owner demographics — drives the "You" profile in jetcool
  owner_groupage: string;
  owner_age: string;
  owner_height: string;
  owner_height_unit: string;
  owner_weight: string;
  owner_weight_unit: string;
  owner_activity_level: string;
  owner_use_dri_macros: number;
  owner_custom_kcal: string;
  owner_custom_water_cups: string;
  owner_custom_sugar_max: string;
  owner_custom_fiber_g: string;
  updated_at: string;
}

// Default settings matching the client-side defaults
const DEFAULT_SETTINGS = {
  calorie_target: 2000,
  is_custom_calories: 0,
  custom_calories: 2000,
  protein_ratio: 25,
  carbs_ratio: 45,
  fats_ratio: 30,
  veg_plate_ratio: 30,
  fruit_plate_ratio: 20,
  grain_plate_ratio: 25,
  protein_plate_ratio: 25,
  water_target: '',
  protein_target: '',
  carbs_target: '',
  fats_target: '',
  fiber_target: '',
  sugar_target: '',
  owner_groupage: '',
  owner_age: '',
  owner_height: '',
  owner_height_unit: 'cm',
  owner_weight: '',
  owner_weight_unit: 'kilos',
  owner_activity_level: '',
  owner_use_dri_macros: 1,
  owner_custom_kcal: '',
  owner_custom_water_cups: '',
  owner_custom_sugar_max: '',
  owner_custom_fiber_g: ''
};

// GET /api/settings?player_id=xxx
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const settings = await queryOne<PlayerSettings>(
      'SELECT * FROM player_settings WHERE player_id = ?',
      [playerId]
    );
    
    if (!settings) {
      // Return defaults if no settings saved yet
      return json({ player_id: playerId, ...DEFAULT_SETTINGS });
    }
    
    return json(settings);
  } catch (e) {
    console.error('Failed to fetch settings:', e);
    throw error(500, 'Database error');
  }
};

// PUT /api/settings - Create or update settings
export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, ...settings } = body;
  
  if (!player_id) {
    throw error(400, 'Missing player_id');
  }
  
  try {
    // Check if settings exist
    const existing = await queryOne<PlayerSettings>(
      'SELECT player_id FROM player_settings WHERE player_id = ?',
      [player_id]
    );
    
    // Build the settings object with defaults
    const finalSettings = { ...DEFAULT_SETTINGS, ...settings };
    
    if (existing) {
      // Update existing
      await execute(
        `UPDATE player_settings SET
          calorie_target = ?,
          is_custom_calories = ?,
          custom_calories = ?,
          protein_ratio = ?,
          carbs_ratio = ?,
          fats_ratio = ?,
          veg_plate_ratio = ?,
          fruit_plate_ratio = ?,
          grain_plate_ratio = ?,
          protein_plate_ratio = ?,
          water_target = ?,
          protein_target = ?,
          carbs_target = ?,
          fats_target = ?,
          fiber_target = ?,
          sugar_target = ?,
          owner_groupage = ?,
          owner_age = ?,
          owner_height = ?,
          owner_height_unit = ?,
          owner_weight = ?,
          owner_weight_unit = ?,
          owner_activity_level = ?,
          owner_use_dri_macros = ?,
          owner_custom_kcal = ?,
          owner_custom_water_cups = ?,
          owner_custom_sugar_max = ?,
          owner_custom_fiber_g = ?,
          updated_at = datetime('now')
        WHERE player_id = ?`,
        [
          finalSettings.calorie_target,
          finalSettings.is_custom_calories ? 1 : 0,
          finalSettings.custom_calories,
          finalSettings.protein_ratio,
          finalSettings.carbs_ratio,
          finalSettings.fats_ratio,
          finalSettings.veg_plate_ratio,
          finalSettings.fruit_plate_ratio,
          finalSettings.grain_plate_ratio,
          finalSettings.protein_plate_ratio,
          finalSettings.water_target,
          finalSettings.protein_target,
          finalSettings.carbs_target,
          finalSettings.fats_target,
          finalSettings.fiber_target,
          finalSettings.sugar_target,
          finalSettings.owner_groupage,
          finalSettings.owner_age,
          finalSettings.owner_height,
          finalSettings.owner_height_unit,
          finalSettings.owner_weight,
          finalSettings.owner_weight_unit,
          finalSettings.owner_activity_level,
          finalSettings.owner_use_dri_macros ? 1 : 0,
          finalSettings.owner_custom_kcal,
          finalSettings.owner_custom_water_cups,
          finalSettings.owner_custom_sugar_max,
          finalSettings.owner_custom_fiber_g,
          player_id
        ]
      );
    } else {
      // Insert new
      await execute(
        `INSERT INTO player_settings (
          player_id, calorie_target, is_custom_calories, custom_calories,
          protein_ratio, carbs_ratio, fats_ratio,
          veg_plate_ratio, fruit_plate_ratio, grain_plate_ratio, protein_plate_ratio,
          water_target, protein_target, carbs_target, fats_target, fiber_target, sugar_target,
          owner_groupage, owner_age, owner_height, owner_height_unit,
          owner_weight, owner_weight_unit, owner_activity_level, owner_use_dri_macros,
          owner_custom_kcal, owner_custom_water_cups, owner_custom_sugar_max, owner_custom_fiber_g
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          player_id,
          finalSettings.calorie_target,
          finalSettings.is_custom_calories ? 1 : 0,
          finalSettings.custom_calories,
          finalSettings.protein_ratio,
          finalSettings.carbs_ratio,
          finalSettings.fats_ratio,
          finalSettings.veg_plate_ratio,
          finalSettings.fruit_plate_ratio,
          finalSettings.grain_plate_ratio,
          finalSettings.protein_plate_ratio,
          finalSettings.water_target,
          finalSettings.protein_target,
          finalSettings.carbs_target,
          finalSettings.fats_target,
          finalSettings.fiber_target,
          finalSettings.sugar_target,
          finalSettings.owner_groupage,
          finalSettings.owner_age,
          finalSettings.owner_height,
          finalSettings.owner_height_unit,
          finalSettings.owner_weight,
          finalSettings.owner_weight_unit,
          finalSettings.owner_activity_level,
          finalSettings.owner_use_dri_macros ? 1 : 0,
          finalSettings.owner_custom_kcal,
          finalSettings.owner_custom_water_cups,
          finalSettings.owner_custom_sugar_max,
          finalSettings.owner_custom_fiber_g
        ]
      );
    }
    
    // Return updated settings
    const updated = await queryOne<PlayerSettings>(
      'SELECT * FROM player_settings WHERE player_id = ?',
      [player_id]
    );
    
    return json(updated);
  } catch (e) {
    console.error('Failed to save settings:', e);
    throw error(500, 'Database error');
  }
};

// POST /api/settings/sync - Sync localStorage settings to cloud
export const POST: RequestHandler = async ({ request }) => {
  // Same as PUT, used for sync operation
  const body = await request.json();
  const { player_id, localSettings, lastSyncAt } = body;
  
  if (!player_id) {
    throw error(400, 'Missing player_id');
  }
  
  try {
    // Get cloud settings
    const cloudSettings = await queryOne<PlayerSettings>(
      'SELECT * FROM player_settings WHERE player_id = ?',
      [player_id]
    );
    
    // If no cloud settings, use local
    if (!cloudSettings) {
      // Save local to cloud
      if (localSettings) {
        await execute(
          `INSERT INTO player_settings (
            player_id, calorie_target, is_custom_calories, custom_calories,
            protein_ratio, carbs_ratio, fats_ratio,
            veg_plate_ratio, fruit_plate_ratio, grain_plate_ratio, protein_plate_ratio,
            water_target, protein_target, carbs_target, fats_target, fiber_target, sugar_target,
            owner_groupage, owner_age, owner_height, owner_height_unit,
            owner_weight, owner_weight_unit, owner_activity_level, owner_use_dri_macros,
            owner_custom_kcal, owner_custom_water_cups, owner_custom_sugar_max, owner_custom_fiber_g
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            player_id,
            localSettings.calorie_target ?? DEFAULT_SETTINGS.calorie_target,
            localSettings.is_custom_calories ? 1 : 0,
            localSettings.custom_calories ?? DEFAULT_SETTINGS.custom_calories,
            localSettings.protein_ratio ?? DEFAULT_SETTINGS.protein_ratio,
            localSettings.carbs_ratio ?? DEFAULT_SETTINGS.carbs_ratio,
            localSettings.fats_ratio ?? DEFAULT_SETTINGS.fats_ratio,
            localSettings.veg_plate_ratio ?? DEFAULT_SETTINGS.veg_plate_ratio,
            localSettings.fruit_plate_ratio ?? DEFAULT_SETTINGS.fruit_plate_ratio,
            localSettings.grain_plate_ratio ?? DEFAULT_SETTINGS.grain_plate_ratio,
            localSettings.protein_plate_ratio ?? DEFAULT_SETTINGS.protein_plate_ratio,
            localSettings.water_target ?? '',
            localSettings.protein_target ?? '',
            localSettings.carbs_target ?? '',
            localSettings.fats_target ?? '',
            localSettings.fiber_target ?? '',
            localSettings.sugar_target ?? '',
            localSettings.owner_groupage ?? '',
            localSettings.owner_age ?? '',
            localSettings.owner_height ?? '',
            localSettings.owner_height_unit ?? 'cm',
            localSettings.owner_weight ?? '',
            localSettings.owner_weight_unit ?? 'kilos',
            localSettings.owner_activity_level ?? '',
            localSettings.owner_use_dri_macros ? 1 : 0,
            localSettings.owner_custom_kcal ?? '',
            localSettings.owner_custom_water_cups ?? '',
            localSettings.owner_custom_sugar_max ?? '',
            localSettings.owner_custom_fiber_g ?? ''
          ]
        );
      }
      
      const saved = await queryOne<PlayerSettings>(
        'SELECT * FROM player_settings WHERE player_id = ?',
        [player_id]
      );
      return json({ action: 'created', settings: saved || { player_id, ...DEFAULT_SETTINGS } });
    }
    
    // Cloud wins - return cloud settings for client to adopt
    return json({ action: 'cloud_wins', settings: cloudSettings });
  } catch (e) {
    console.error('Failed to sync settings:', e);
    throw error(500, 'Database error');
  }
};
