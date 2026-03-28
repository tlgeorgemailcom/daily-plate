// Custom Foods Store - with localStorage persistence AND cloud sync for premium users
// Free tier: localStorage only (persists on device)
// Premium tier: syncs to database (persists across devices)

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { playerStore, canUseStorage } from './playerStore';
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

// Check if user is paid (should sync to cloud)
function isPremiumUser(): boolean {
  const player = get(playerStore);
  const isPremium = player.status === 'logged-in' && ['plus', 'allin', 'moderator'].includes(player.tier);
  console.log('[CustomFoods] isPremiumUser check:', { status: player.status, tier: player.tier, isPremium });
  return isPremium;
}

// Get current player ID
function getPlayerId(): string | null {
  const player = get(playerStore);
  console.log('[CustomFoods] getPlayerId:', player.id);
  return player.id;
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

// Save to localStorage (only for logged-in users)
function saveToStorage(foods: CustomFood[]): void {
  if (!browser) return;
  if (!canUseStorage()) return;  // Guests don't persist
  
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

// Fetch custom foods from API (for premium users)
async function fetchFromCloud(): Promise<CustomFood[]> {
  const playerId = getPlayerId();
  console.log('[CustomFoods] fetchFromCloud: playerId =', playerId);
  if (!playerId) {
    console.log('[CustomFoods] fetchFromCloud: no playerId, returning empty');
    return [];
  }
  
  try {
    const url = `/api/custom-foods?player_id=${playerId}`;
    console.log('[CustomFoods] Fetching from:', url);
    const res = await fetch(url);
    console.log('[CustomFoods] fetch response status:', res.status);
    if (!res.ok) {
      console.error('Failed to fetch custom foods from cloud:', res.status);
      return [];
    }
    
    const data = await res.json();
    console.log('[CustomFoods] Got data from cloud:', data.length, 'foods');
    // Convert API format to store format
    return data.map((f: Record<string, unknown>) => ({
      id: f.id,
      name: f.name,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      fiber: f.fiber,
      sugar: f.sugar,
      water: f.water,
      foodGroup: f.food_group as FoodGroup,
      portions: f.portions as Portion[],
      createdAt: new Date(f.created_at as string).getTime()
    }));
  } catch (e) {
    console.error('Failed to fetch custom foods from cloud:', e);
    return [];
  }
}

// Save a food to cloud (for premium users)
async function saveToCloud(food: CustomFood): Promise<boolean> {
  const playerId = getPlayerId();
  if (!playerId) {
    console.log('[CustomFoods] saveToCloud: no player ID, skipping');
    return false;
  }
  
  console.log('[CustomFoods] Saving to cloud:', { foodName: food.name, playerId });
  
  try {
    const res = await fetch('/api/custom-foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: food.id,
        player_id: playerId,
        name: food.name,
        food_group: food.foodGroup,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber,
        sugar: food.sugar,
        water: food.water,
        portions: food.portions
      })
    });
    
    console.log('[CustomFoods] saveToCloud response:', res.status, res.ok);
    if (!res.ok) {
      const errText = await res.text();
      console.error('[CustomFoods] saveToCloud error:', errText);
    }
    
    return res.ok;
  } catch (e) {
    console.error('Failed to save custom food to cloud:', e);
    return false;
  }
}

// Delete from cloud (for premium users)
async function deleteFromCloud(foodId: string): Promise<boolean> {
  const playerId = getPlayerId();
  if (!playerId) return false;
  
  try {
    const res = await fetch(`/api/custom-foods?id=${foodId}&player_id=${playerId}`, {
      method: 'DELETE'
    });
    
    return res.ok;
  } catch (e) {
    console.error('Failed to delete custom food from cloud:', e);
    return false;
  }
}

// Initialize store with empty array (will be populated on client mount)
const customFoodsWritable = writable<CustomFood[]>([]);

// Track if we've initialized on the client
let clientInitialized = false;

// Initialize custom foods - from cloud for premium, localStorage for free
export async function initializeCustomFoods(): Promise<void> {
  if (!browser || clientInitialized) return;
  
  // If premium user, load from cloud first
  if (isPremiumUser()) {
    const cloudFoods = await fetchFromCloud();
    if (cloudFoods.length > 0) {
      customFoodsWritable.set(cloudFoods);
      // Also cache to localStorage
      saveToStorage(cloudFoods);
      clientInitialized = true;
      return;
    }
  }
  
  // Fall back to localStorage
  const loaded = loadFromStorage();
  if (loaded.length > 0) {
    customFoodsWritable.set(loaded);
  }
  clientInitialized = true;
}

// Re-sync from cloud (call after login or tier upgrade)
export async function syncCustomFoodsFromCloud(): Promise<void> {
  console.log('[CustomFoods] syncCustomFoodsFromCloud called');
  
  if (!browser) {
    console.log('[CustomFoods] Not in browser, skipping sync');
    return;
  }
  
  if (!isPremiumUser()) {
    console.log('[CustomFoods] Not premium, skipping sync');
    return;
  }
  
  console.log('[CustomFoods] Starting cloud sync...');
  
  // Get current local foods before syncing
  const localFoods = get(customFoodsWritable);
  
  // Fetch from cloud
  const cloudFoods = await fetchFromCloud();
  
  // If user had local foods but cloud is empty (e.g., just upgraded),
  // push local foods to cloud
  if (localFoods.length > 0 && cloudFoods.length === 0) {
    console.log('Pushing local foods to cloud after upgrade');
    for (const food of localFoods) {
      await saveToCloud(food);
    }
    // Local store already has the foods, just save to localStorage too
    saveToStorage(localFoods);
    return;
  }
  
  // Merge: cloud is source of truth, but add any local-only foods
  const cloudIds = new Set(cloudFoods.map(f => f.id));
  const localOnly = localFoods.filter(f => !cloudIds.has(f.id));
  
  // Push any local-only foods to cloud
  for (const food of localOnly) {
    await saveToCloud(food);
  }
  
  // Combine: cloud foods + local-only foods
  const mergedFoods = [...cloudFoods, ...localOnly];
  customFoodsWritable.set(mergedFoods);
  saveToStorage(mergedFoods);
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

// Add a new custom food (syncs to cloud for premium)
export async function addCustomFood(food: Omit<CustomFood, 'id' | 'createdAt'>): Promise<CustomFood> {
  // VERY FIRST LINE - should always appear
  (window as unknown as { customFoodDebug: string }).customFoodDebug = 'entered';
  console.log('🍔🍔🍔 ENTERED addCustomFood 🍔🍔🍔');
  console.log('[CustomFoods] addCustomFood called:', food.name);
  
  const newFood: CustomFood = {
    ...food,
    id: generateId(),
    createdAt: Date.now()
  };
  
  customFoodsWritable.update(foods => [...foods, newFood]);
  
  // Sync to cloud for premium users
  const premium = isPremiumUser();
  console.log('[CustomFoods] Will sync to cloud:', premium);
  if (premium) {
    const success = await saveToCloud(newFood);
    console.log('[CustomFoods] Cloud save result:', success);
  }
  
  return newFood;
}

// Update an existing custom food (note: cloud update not implemented yet - would need PUT endpoint)
export function updateCustomFood(id: string, updates: Partial<Omit<CustomFood, 'id' | 'createdAt'>>): void {
  customFoodsWritable.update(foods => 
    foods.map(f => f.id === id ? { ...f, ...updates } : f)
  );
  // Note: for premium users, would need to implement cloud update
}

// Delete a custom food (syncs to cloud for premium)
export async function deleteCustomFood(id: string): Promise<void> {
  customFoodsWritable.update(foods => foods.filter(f => f.id !== id));
  
  // Sync to cloud for premium users
  if (isPremiumUser()) {
    await deleteFromCloud(id);
  }
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
