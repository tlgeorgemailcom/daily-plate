// Utility to load and apply built-in recipe overrides from the server
import type { Level, FoodType, AnimalType } from './types';
import { LEVELS } from './game-state.svelte';

export interface BuiltinOverride {
  id: string;
  name?: string;
  category?: string;
  dietaryCategory?: string;
  prepTime?: string;
  servings?: string;
  recipe?: FoodType[];
  animalSpawns?: { type: AnimalType; delay: number }[];
  editedAt?: string;
  editedBy?: string;
}

let cachedOverrides: Record<string, BuiltinOverride> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Fetch built-in recipe overrides from the server
 * Results are cached for 1 minute
 */
export async function fetchOverrides(): Promise<Record<string, BuiltinOverride>> {
  const now = Date.now();
  
  // Return cached if still valid
  if (cachedOverrides && now - lastFetchTime < CACHE_DURATION) {
    return cachedOverrides;
  }
  
  try {
    const res = await fetch('/api/recipes/builtin');
    if (!res.ok) throw new Error('Failed to fetch overrides');
    const data = await res.json();
    const overrides: Record<string, BuiltinOverride> = data.overrides || {};
    cachedOverrides = overrides;
    lastFetchTime = now;
    return overrides;
  } catch (err) {
    console.warn('Could not load built-in overrides:', err);
    return cachedOverrides ?? {};
  }
}

/**
 * Get all LEVELS with any overrides applied
 */
export async function getLevelsWithOverrides(): Promise<Level[]> {
  const overrides = await fetchOverrides();
  
  return LEVELS.map(level => {
    const override = overrides[level.id];
    if (!override) return level;
    
    // Merge override into level
    return {
      ...level,
      name: override.name ?? level.name,
      category: override.category ?? level.category,
      dietaryCategory: override.dietaryCategory ?? level.dietaryCategory,
      prepTime: override.prepTime ?? level.prepTime,
      servings: override.servings ?? level.servings,
      recipe: override.recipe ?? level.recipe,
      animalSpawns: override.animalSpawns ?? level.animalSpawns
    } as Level;
  });
}

/**
 * Get a single level by ID with any overrides applied
 */
export async function getLevelWithOverrides(id: string): Promise<Level | undefined> {
  const levels = await getLevelsWithOverrides();
  return levels.find(l => l.id === id);
}

/**
 * Clear the override cache (call after saving changes)
 */
export function clearOverrideCache() {
  cachedOverrides = null;
  lastFetchTime = 0;
}
