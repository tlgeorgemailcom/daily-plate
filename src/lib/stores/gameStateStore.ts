// Game State Persistence Store
// Persists foods added, meals, and game progress
// Free tier: localStorage only (persists on device)
// Premium tier: syncs to database (persists across devices)

import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { canUseStorage, playerStore } from './playerStore';
import { saveGameScore } from './scoreHistory';
import { 
  addedFoods, 
  meals, 
  selectedMeal, 
  selectedContainer,
  targets,
  nutrientTargets,
  nutrientProgress,
  selectedPieNutrient,
  customMealCategories,
  DEFAULT_MEALS,
  type AddedFood,
  type MealSlot,
  type Container,
  type DailyTargets,
  type NutrientTargets,
  type PieChartNutrient,
  type CustomMealCategory
} from './gameStore';
import { calculateNutrients, calculateNutrientsForGrams } from '$lib/data/food-portions';
import { getMicrosForGrams } from '$lib/data/food-micros';

const STORAGE_KEY = 'balancedDiet_gameState';
const STORAGE_VERSION = 1;

export interface GameState {
  addedFoods: AddedFood[];
  meals: MealSlot[];
  selectedMeal: string;
  selectedContainer: Container;
  targets: DailyTargets;
  nutrientTargets: NutrientTargets;
  selectedPieNutrient: PieChartNutrient;
}

interface StorageData {
  version: number;
  state: GameState;
  savedAt: string;  // ISO date string
}

// Load game state from localStorage
function loadGameState(): GameState | null {
  if (!browser) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StorageData = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      const savedDay = data.savedAt ? data.savedAt.split('T')[0] : null;
      if (data.version === STORAGE_VERSION && data.state && savedDay === today) {
        return data.state;
      }
    }
  } catch (e) {
    console.error('Failed to load game state from localStorage:', e);
  }
  return null;
}

// Save game state to localStorage (only for logged-in users)
function saveGameState(): void {
  if (!browser) return;
  if (!canUseStorage()) return;  // Guests don't persist
  
  try {
    const state: GameState = {
      addedFoods: get(addedFoods),
      meals: get(meals),
      selectedMeal: get(selectedMeal),
      selectedContainer: get(selectedContainer),
      targets: get(targets),
      nutrientTargets: get(nutrientTargets),
      selectedPieNutrient: get(selectedPieNutrient)
    };
    
    const data: StorageData = {
      version: STORAGE_VERSION,
      state,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game state to localStorage:', e);
  }
}

// Clear saved game state (for "New Game")
function clearGameState(): void {
  if (!browser) return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear game state from localStorage:', e);
  }
}

// ============ Cloud Sync for Premium Users ============

// Check if user is premium
function isPremiumUser(): boolean {
  const player = get(playerStore);
  const isPremium = player.status === 'logged-in' && player.tier === 'premium';
  console.log('[GameState] isPremiumUser check:', { status: player.status, tier: player.tier, isPremium });
  return isPremium;
}

// Get current player ID
function getPlayerId(): string | null {
  const player = get(playerStore);
  return player.id;
}

// Fetch game state from cloud
async function fetchFromCloud(): Promise<GameState | null> {
  const playerId = getPlayerId();
  console.log('[GameState] fetchFromCloud: playerId =', playerId);
  if (!playerId) return null;
  
  try {
    const res = await fetch(`/api/game-state?player_id=${playerId}`);
    console.log('[GameState] fetch response status:', res.status);
    if (!res.ok) {
      console.error('Failed to fetch game state from cloud:', res.status);
      return null;
    }
    
    const data = await res.json();
    if (data.state) {
      console.log('[GameState] Got state from cloud');
      return data.state as GameState;
    }
    return null;
  } catch (e) {
    console.error('Failed to fetch game state from cloud:', e);
    return null;
  }
}

// Save game state to cloud
let cloudSaveTimeout: ReturnType<typeof setTimeout> | null = null;

async function saveToCloud(): Promise<boolean> {
  const playerId = getPlayerId();
  if (!playerId) {
    console.log('[GameState] saveToCloud: no player ID, skipping');
    return false;
  }
  
  const state: GameState = {
    addedFoods: get(addedFoods),
    meals: get(meals),
    selectedMeal: get(selectedMeal),
    selectedContainer: get(selectedContainer),
    targets: get(targets),
    nutrientTargets: get(nutrientTargets),
    selectedPieNutrient: get(selectedPieNutrient)
  };
  
  console.log('[GameState] Saving to cloud for player:', playerId);
  
  try {
    const res = await fetch('/api/game-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, state })
    });
    
    console.log('[GameState] saveToCloud response:', res.status, res.ok);
    return res.ok;
  } catch (e) {
    console.error('Failed to save game state to cloud:', e);
    return false;
  }
}

// Debounced cloud save (avoid too many requests)
function scheduleCloudSave(): void {
  if (!isPremiumUser()) return;
  
  if (cloudSaveTimeout) {
    clearTimeout(cloudSaveTimeout);
  }
  
  // Debounce: save to cloud 2 seconds after last change
  cloudSaveTimeout = setTimeout(() => {
    saveToCloud();
  }, 2000);
}

// Clear cloud game state
async function clearCloudGameState(): Promise<void> {
  const playerId = getPlayerId();
  if (!playerId || !isPremiumUser()) return;
  
  try {
    await fetch(`/api/game-state?player_id=${playerId}`, {
      method: 'DELETE'
    });
    console.log('[GameState] Cleared cloud state');
  } catch (e) {
    console.error('Failed to clear cloud game state:', e);
  }
}

// ============ End Cloud Sync ============

// ============ Daily Meal Log ============
// Writes per-food rows to daily_meal_log for all logged-in users.
// This is the data source for Reports, Meal History, and Jetcool sync.

function buildMealLogEntries(foods: AddedFood[]) {
  const now = new Date().toISOString();
  return foods.map(af => {
    const portionIndex = af.customGrams
      ? -1
      : af.food.portions.findIndex(p => p.desc === af.portion.desc && p.gm === af.portion.gm);
    const n = af.customGrams
      ? calculateNutrientsForGrams(af.food, af.customGrams)
      : calculateNutrients(af.food, portionIndex >= 0 ? portionIndex : 0, af.multiplier ?? 1);

    return {
      meal_category: af.mealId,
      food_id: af.food.ndb,
      food_name: af.food.display,
      brand_name: null,
      quantity_grams: n.grams,
      serving_description: af.portion.desc,
      kcal: n.calories,
      protein: n.protein,
      carbohydrate: n.carbs,
      fat: n.fat,
      sugar: n.sugar,
      fiber: n.fiber,
      water: n.water,
      sodium: getMicrosForGrams(af.food.ndb, n.grams)?.sodium ?? 0,
      source: 'web',
      logged_at: now,
    };
  });
}

// Active member override — when set, meal log reads/writes use this id instead of player.id
let _viewingUserId: string | null = null;
export function setViewingUserId(id: string | null): void { _viewingUserId = id; }
export function getViewingUserId(): string | null { return _viewingUserId; }

// Suppress saves during member switch reload so clearFoods/addFood don't overwrite DB
let _suppressMealLogSave = false;
export function suppressMealLogSave(v: boolean): void { _suppressMealLogSave = v; }

export async function saveMealLog(): Promise<void> {
  if (_suppressMealLogSave) {
    console.log('[MealLog] saveMealLog: suppressed, skipping');
    return;
  }
  const player = get(playerStore);
  if (!player.id) {
    console.log('[MealLog] saveMealLog: no player.id, skipping');
    return;
  }

  const effectiveUserId = _viewingUserId ?? player.id;
  const foods = get(addedFoods);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const entries = buildMealLogEntries(foods);

  try {
    const res = await fetch('/api/meal-log', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: effectiveUserId,
        meal_date: today,
        entries,
      }),
    });
  } catch (e) {
    console.error('[MealLog] Failed to save meal log:', e);
  }
}

// ============ End Daily Meal Log ============

// Initialize stores from saved state (call on app mount)
export function initializeGameState(): boolean {
  const savedState = loadGameState();
  
  if (savedState) {
    // Restore all stores from saved state
    addedFoods.set(savedState.addedFoods);
    // Reorder slots to match DEFAULT_MEALS order (handles order changes between versions)
    const orderedMeals = DEFAULT_MEALS.map(def => savedState.meals.find((m: MealSlot) => m.id === def.id) ?? def);
    meals.set(orderedMeals);
    selectedMeal.set(savedState.selectedMeal);
    selectedContainer.set(savedState.selectedContainer);
    targets.set(savedState.targets);
    nutrientTargets.set(savedState.nutrientTargets);
    if (savedState.selectedPieNutrient) {
      selectedPieNutrient.set(savedState.selectedPieNutrient);
    }
    return true;  // Had saved state
  }
  
  return false;  // No saved state
}

// Subscribe to stores and auto-save on changes
let unsubscribers: (() => void)[] = [];

export function startAutoSave(): void {
  if (!browser) return;
  
  // Stop any existing subscriptions
  stopAutoSave();
  
  // Subscribe to all stores that should trigger saves
  unsubscribers = [
    addedFoods.subscribe(() => { saveGameState(); scheduleCloudSave(); saveMealLog(); }),
    meals.subscribe(() => { saveGameState(); scheduleCloudSave(); }),
    selectedMeal.subscribe(() => { saveGameState(); scheduleCloudSave(); }),
    selectedContainer.subscribe(() => { saveGameState(); scheduleCloudSave(); }),
    targets.subscribe(() => { saveGameState(); scheduleCloudSave(); }),
    nutrientTargets.subscribe(() => { saveGameState(); scheduleCloudSave(); }),
    selectedPieNutrient.subscribe(() => { saveGameState(); scheduleCloudSave(); })
  ];
}

export function stopAutoSave(): void {
  unsubscribers.forEach(unsub => unsub());
  unsubscribers = [];
}

// Save daily diet stats when starting a new game (for premium users)
// Tracks if each nutrient target was met (>= 80% of target)
function saveDailyDietStats(): void {
  if (!browser) return;
  
  // Only track if there are foods added
  const foods = get(addedFoods);
  if (foods.length === 0) {
    console.log('[GameState] No foods added, skipping diet stats');
    return;
  }
  
  // Get current nutrient progress
  const progress = get(nutrientProgress);
  const ntargets = get(nutrientTargets);
  
  // Check if each nutrient is >= 80% of target (for sugar, <= 120% is good)
  const caloriesMet = progress.calories.percent >= 80;
  const proteinMet = progress.protein.percent >= 80;
  const fatsMet = progress.fat.percent >= 80;
  const carbsMet = progress.carbs.percent >= 80;
  const fiberMet = progress.fiber.percent >= 80;
  const waterMet = progress.water.percent >= 80;
  const sugarMet = progress.sugar.percent <= 120; // Sugar is a max, so <= 120% is good
  
  // Count how many targets were met
  const targetsMetCount = [caloriesMet, proteinMet, fatsMet, carbsMet, fiberMet, waterMet, sugarMet]
    .filter(Boolean).length;
  
  // Save the daily diet to score history
  saveGameScore('balanced-diet', targetsMetCount, {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    foodsAdded: foods.length,
    caloriesTarget: ntargets.calories,
    caloriesActual: progress.calories.current,
    caloriesPercent: progress.calories.percent,
    caloriesMet,
    proteinPercent: progress.protein.percent,
    proteinMet,
    fatsPercent: progress.fat.percent,
    fatsMet,
    carbsPercent: progress.carbs.percent,
    carbsMet,
    fiberPercent: progress.fiber.percent,
    fiberMet,
    waterPercent: progress.water.percent,
    waterMet,
    sugarPercent: progress.sugar.percent,
    sugarMet,
    targetsMetCount
  });
  
  console.log('[GameState] Daily diet stats saved:', targetsMetCount, '/7 targets met');
}

// Start a new game - clear foods and meals but keep user's settings
export function startNewGame(): void {
  // Stop auto-save first to prevent saving the reset state before clearing
  stopAutoSave();
  
  // Save the current day's stats before clearing (for premium users)
  saveDailyDietStats();
  
  // Clear localStorage game state
  clearGameState();
  
  // Clear cloud state for premium users
  clearCloudGameState();
  
  // Reset game progress stores (foods, meals, selections)
  // Note: targets and nutrientTargets are kept - they're managed by settingsStore
  addedFoods.set([]);
  meals.set(structuredClone(DEFAULT_MEALS));
  selectedMeal.set('breakfast');
  selectedContainer.set('plate');
  
  // Re-enable auto-save
  startAutoSave();
}

// Check if there's a saved game
export function hasSavedGame(): boolean {
  if (!browser) return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

// Get saved game timestamp
export function getSavedGameTime(): Date | null {
  if (!browser) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StorageData = JSON.parse(stored);
      return new Date(data.savedAt);
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

// Sync game state from cloud (call after login)
export async function syncGameStateFromCloud(): Promise<void> {
  console.log('[GameState] syncGameStateFromCloud called');
  
  if (!browser) {
    console.log('[GameState] Not in browser, skipping sync');
    return;
  }
  
  if (!isPremiumUser()) {
    console.log('[GameState] Not premium, skipping sync');
    return;
  }
  
  console.log('[GameState] Starting cloud sync...');
  
  const cloudState = await fetchFromCloud();
  
  if (cloudState) {
    // Cloud state exists - use it (cloud is source of truth)
    console.log('[GameState] Applying cloud state');
    
    // Stop auto-save to prevent loops
    stopAutoSave();
    
    // Restore all stores from cloud state
    addedFoods.set(cloudState.addedFoods || []);
    // Reorder slots to match DEFAULT_MEALS order (handles order changes between versions)
    const rawCloudMeals: MealSlot[] = cloudState.meals || structuredClone(DEFAULT_MEALS);
    const orderedCloudMeals = DEFAULT_MEALS.map(def => rawCloudMeals.find((m: MealSlot) => m.id === def.id) ?? def);
    meals.set(orderedCloudMeals);
    selectedMeal.set(cloudState.selectedMeal || 'breakfast');
    selectedContainer.set(cloudState.selectedContainer || 'plate');
    targets.set(cloudState.targets);
    nutrientTargets.set(cloudState.nutrientTargets);
    if (cloudState.selectedPieNutrient) {
      selectedPieNutrient.set(cloudState.selectedPieNutrient);
    }
    
    // Also save to localStorage for offline access
    saveGameState();
    
    // Re-enable auto-save
    startAutoSave();
  } else {
    // No cloud state - push local to cloud if we have local state
    const localState = loadGameState();
    if (localState) {
      console.log('[GameState] No cloud state, pushing local');
      await saveToCloud();
    }
  }
}

// ============ Custom Meal Categories (ALL·IN) ============

// Load custom categories from DB and append as meal slots.
// Must be called after initializeGameState() so default slots are in place first.
export async function loadCustomCategories(userId: string): Promise<void> {
  try {
    const res = await fetch(`/api/meal-categories?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) return;
    const cats: CustomMealCategory[] = await res.json();
    if (cats.length === 0) return;
    customMealCategories.set(cats);
    // Append custom slots to the meals store (after the 5 defaults)
    meals.update(current => {
      const existingIds = new Set(current.map(m => m.id));
      const newSlots: MealSlot[] = cats
        .filter(c => !existingIds.has(c.name))
        .map(c => ({ id: c.name, name: `${c.emoji} ${c.label}`, foods: [], custom: true }));
      return newSlots.length > 0 ? [...current, ...newSlots] : current;
    });
  } catch { /* non-critical */ }
}

// Append a single newly-created custom category to the stores (call after POST succeeds).
export function appendCustomCategory(cat: CustomMealCategory): void {
  customMealCategories.update(list => [...list, cat]);
  meals.update(current => {
    if (current.some(m => m.id === cat.name)) return current;
    return [...current, { id: cat.name, name: `${cat.emoji} ${cat.label}`, foods: [], custom: true }];
  });
}

// Remove a custom category from the stores and drop its foods (call after DELETE succeeds).
export function removeCustomCategoryLocally(categoryName: string): void {
  customMealCategories.update(list => list.filter(c => c.name !== categoryName));
  addedFoods.update(fs => fs.filter(f => f.mealId !== categoryName));
  meals.update(current => current.filter(m => m.id !== categoryName));
}
