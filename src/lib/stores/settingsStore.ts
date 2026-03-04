// Game Settings Store - with localStorage persistence AND cloud sync for premium
// Free tier: localStorage only (persists on device)
// Premium tier: syncs to database (persists across devices)

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { canUseStorage, playerStore } from './playerStore';

const STORAGE_KEY = 'balancedDiet_settings';
const STORAGE_VERSION = 1;

export interface GameSettings {
  // Calorie target
  calorieTarget: number;
  isCustomCalories: boolean;
  customCalories: number;
  
  // Macro ratios (% of calories)
  proteinRatio: number;
  carbsRatio: number;
  fatsRatio: number;
  
  // Plate ratios (food group %)
  vegPlateRatio: number;
  fruitPlateRatio: number;
  grainPlateRatio: number;
  proteinPlateRatio: number;
  
  // Nutrient targets (empty string = use default)
  waterInput: string;
  proteinInput: string;
  carbsInput: string;
  fatsInput: string;
  fiberInput: string;
  sugarInput: string;
}

export const DEFAULT_SETTINGS: GameSettings = {
  calorieTarget: 2000,
  isCustomCalories: false,
  customCalories: 2000,
  proteinRatio: 25,
  carbsRatio: 45,
  fatsRatio: 30,
  vegPlateRatio: 30,
  fruitPlateRatio: 20,
  grainPlateRatio: 25,
  proteinPlateRatio: 25,
  waterInput: '',
  proteinInput: '',
  carbsInput: '',
  fatsInput: '',
  fiberInput: '',
  sugarInput: ''
};

interface StorageData {
  version: number;
  settings: GameSettings;
}

// Load from localStorage
function loadFromStorage(): GameSettings {
  if (!browser) return { ...DEFAULT_SETTINGS };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StorageData = JSON.parse(stored);
      // Merge with defaults to handle any new fields added in future versions
      if (data.version === STORAGE_VERSION) {
        return { ...DEFAULT_SETTINGS, ...data.settings };
      }
      // Handle older versions here if needed
      return { ...DEFAULT_SETTINGS, ...data.settings };
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

// Save to localStorage (only for logged-in users, not guests)
function saveToStorage(settings: GameSettings): void {
  if (!browser) return;
  if (!canUseStorage()) return;  // Guests don't persist
  
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      settings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

// ============ Cloud Sync for Premium Users ============

// Check if user is premium (should sync to cloud)
function isPremiumUser(): boolean {
  const player = get(playerStore);
  const isPremium = player.status === 'logged-in' && player.tier === 'premium';
  console.log('[Settings] isPremiumUser check:', { status: player.status, tier: player.tier, isPremium });
  return isPremium;
}

// Get current player ID
function getPlayerId(): string | null {
  const player = get(playerStore);
  return player.id;
}

// Convert client format to API format
function toApiFormat(settings: GameSettings): Record<string, unknown> {
  return {
    calorie_target: settings.calorieTarget,
    is_custom_calories: settings.isCustomCalories ? 1 : 0,
    custom_calories: settings.customCalories,
    protein_ratio: settings.proteinRatio,
    carbs_ratio: settings.carbsRatio,
    fats_ratio: settings.fatsRatio,
    veg_plate_ratio: settings.vegPlateRatio,
    fruit_plate_ratio: settings.fruitPlateRatio,
    grain_plate_ratio: settings.grainPlateRatio,
    protein_plate_ratio: settings.proteinPlateRatio,
    water_target: settings.waterInput,
    protein_target: settings.proteinInput,
    carbs_target: settings.carbsInput,
    fats_target: settings.fatsInput,
    fiber_target: settings.fiberInput,
    sugar_target: settings.sugarInput
  };
}

// Convert API format to client format
function fromApiFormat(api: Record<string, unknown>): GameSettings {
  return {
    calorieTarget: api.calorie_target as number,
    isCustomCalories: Boolean(api.is_custom_calories),
    customCalories: api.custom_calories as number,
    proteinRatio: api.protein_ratio as number,
    carbsRatio: api.carbs_ratio as number,
    fatsRatio: api.fats_ratio as number,
    vegPlateRatio: api.veg_plate_ratio as number,
    fruitPlateRatio: api.fruit_plate_ratio as number,
    grainPlateRatio: api.grain_plate_ratio as number,
    proteinPlateRatio: api.protein_plate_ratio as number,
    waterInput: (api.water_target as string) || '',
    proteinInput: (api.protein_target as string) || '',
    carbsInput: (api.carbs_target as string) || '',
    fatsInput: (api.fats_target as string) || '',
    fiberInput: (api.fiber_target as string) || '',
    sugarInput: (api.sugar_target as string) || ''
  };
}

// Fetch settings from cloud
async function fetchFromCloud(): Promise<GameSettings | null> {
  const playerId = getPlayerId();
  console.log('[Settings] fetchFromCloud: playerId =', playerId);
  if (!playerId) return null;
  
  try {
    const res = await fetch(`/api/settings?player_id=${playerId}`);
    console.log('[Settings] fetch response status:', res.status);
    if (!res.ok) {
      console.error('Failed to fetch settings from cloud:', res.status);
      return null;
    }
    
    const data = await res.json();
    console.log('[Settings] Got settings from cloud');
    return fromApiFormat(data);
  } catch (e) {
    console.error('Failed to fetch settings from cloud:', e);
    return null;
  }
}

// Save settings to cloud
async function saveToCloud(settings: GameSettings): Promise<boolean> {
  const playerId = getPlayerId();
  if (!playerId) {
    console.log('[Settings] saveToCloud: no player ID, skipping');
    return false;
  }
  
  console.log('[Settings] Saving to cloud for player:', playerId);
  
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerId,
        ...toApiFormat(settings)
      })
    });
    
    console.log('[Settings] saveToCloud response:', res.status, res.ok);
    return res.ok;
  } catch (e) {
    console.error('Failed to save settings to cloud:', e);
    return false;
  }
}

// ============ End Cloud Sync ============

// Initialize store with data from localStorage
const settingsWritable = writable<GameSettings>(loadFromStorage());

// Track if cloud sync is in progress to avoid save loops
let syncInProgress = false;

// Auto-save whenever the store changes
settingsWritable.subscribe(settings => {
  saveToStorage(settings);
  
  // Also save to cloud for premium users (but not during sync operations)
  if (!syncInProgress && isPremiumUser()) {
    saveToCloud(settings);
  }
});

// Sync settings from cloud (call after login or tier upgrade)
export async function syncSettingsFromCloud(): Promise<void> {
  console.log('[Settings] syncSettingsFromCloud called');
  
  if (!browser) {
    console.log('[Settings] Not in browser, skipping sync');
    return;
  }
  
  if (!isPremiumUser()) {
    console.log('[Settings] Not premium, skipping sync');
    return;
  }
  
  console.log('[Settings] Starting cloud sync...');
  syncInProgress = true;
  
  try {
    const cloudSettings = await fetchFromCloud();
    
    if (cloudSettings) {
      // Cloud settings exist - use them
      console.log('[Settings] Applying cloud settings');
      settingsWritable.set(cloudSettings);
      saveToStorage(cloudSettings);
    } else {
      // No cloud settings - push local to cloud
      const local = get(settingsWritable);
      console.log('[Settings] No cloud settings, pushing local');
      await saveToCloud(local);
    }
  } finally {
    syncInProgress = false;
  }
}

// Read-only export
export const gameSettings = { subscribe: settingsWritable.subscribe };

// Update settings (partial update)
export function updateSettings(updates: Partial<GameSettings>): void {
  settingsWritable.update(s => ({ ...s, ...updates }));
}

// Reset to defaults
export function resetSettings(): void {
  settingsWritable.set({ ...DEFAULT_SETTINGS });
}

// Get current settings (for one-time reads)
export function getSettings(): GameSettings {
  return get(settingsWritable);
}
