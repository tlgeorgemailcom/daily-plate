// Custom Foods Store - with localStorage persistence
// Foods persist across page refreshes on the same device/browser

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { FoodGroup, Portion } from '$lib/data/food-portions';

const STORAGE_KEY = 'balancedDiet_customFoods';
const STORAGE_VERSION = 1;

export interface CustomFood {
  id: string;
  name: string;           // Display name
  calories: number;       // kcal per 100g
  protein: number;        // grams per 100g
  carbs: number;          // grams per 100g
  fat: number;            // grams per 100g
  fiber: number;          // grams per 100g
  sugar: number;          // grams per 100g
  water: number;          // grams per 100g (default 0)
  foodGroup: FoodGroup;   // Primary group for pie chart
  portions: Portion[];    // Uses standard Portion interface (amt, desc, gm)
  createdAt: number;      // Timestamp
}

interface StorageData {
  version: number;
  foods: CustomFood[];
}

// Load from localStorage
function loadFromStorage(): CustomFood[] {
  if (!browser) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StorageData = JSON.parse(stored);
      // Version check for future migrations
      if (data.version === STORAGE_VERSION) {
        return data.foods;
      }
      // Handle older versions here if needed
      return data.foods;
    }
  } catch (e) {
    console.error('Failed to load custom foods from localStorage:', e);
  }
  return [];
}

// Save to localStorage
function saveToStorage(foods: CustomFood[]): void {
  if (!browser) return;
  
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      foods
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save custom foods to localStorage:', e);
  }
}

// Initialize store with empty array (will be populated on client mount)
const customFoodsWritable = writable<CustomFood[]>([]);

// Track if we've initialized on the client
let clientInitialized = false;

// Initialize custom foods from localStorage (call on app mount)
export function initializeCustomFoods(): void {
  if (!browser || clientInitialized) return;
  
  const loaded = loadFromStorage();
  if (loaded.length > 0) {
    customFoodsWritable.set(loaded);
  }
  clientInitialized = true;
}

// Auto-save whenever the store changes (only after initialization)
customFoodsWritable.subscribe(foods => {
  if (clientInitialized) {
    saveToStorage(foods);
  }
});

// Read-only export
export const customFoods = { subscribe: customFoodsWritable.subscribe };

// Count for UI display
export const customFoodsCount = derived(customFoodsWritable, $foods => $foods.length);

// Generate unique ID
function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add a new custom food
export function addCustomFood(food: Omit<CustomFood, 'id' | 'createdAt'>): CustomFood {
  const newFood: CustomFood = {
    ...food,
    id: generateId(),
    createdAt: Date.now()
  };
  
  customFoodsWritable.update(foods => [...foods, newFood]);
  return newFood;
}

// Update an existing custom food
export function updateCustomFood(id: string, updates: Partial<Omit<CustomFood, 'id' | 'createdAt'>>): void {
  customFoodsWritable.update(foods => 
    foods.map(f => f.id === id ? { ...f, ...updates } : f)
  );
}

// Delete a custom food
export function deleteCustomFood(id: string): void {
  customFoodsWritable.update(foods => foods.filter(f => f.id !== id));
}

// Get a custom food by ID
export function getCustomFood(id: string): CustomFood | undefined {
  let found: CustomFood | undefined;
  customFoodsWritable.subscribe(foods => {
    found = foods.find(f => f.id === id);
  })();
  return found;
}

// Clear all custom foods (useful for testing/reset)
export function clearCustomFoods(): void {
  customFoodsWritable.set([]);
}
