// Game Settings Store - with localStorage persistence
// Settings persist across page refreshes on the same device/browser

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

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

// Save to localStorage
function saveToStorage(settings: GameSettings): void {
  if (!browser) return;
  
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

// Initialize store with data from localStorage
const settingsWritable = writable<GameSettings>(loadFromStorage());

// Auto-save whenever the store changes
settingsWritable.subscribe(settings => {
  saveToStorage(settings);
});

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
