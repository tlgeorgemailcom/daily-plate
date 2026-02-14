// Game State Persistence Store
// Persists foods added, meals, and game progress to localStorage
// Survives page refresh and browser closing until player starts a "New Game"

import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { 
  addedFoods, 
  meals, 
  selectedMeal, 
  selectedContainer,
  targets,
  nutrientTargets,
  selectedPieNutrient,
  DEFAULT_MEALS,
  type AddedFood,
  type MealSlot,
  type Container,
  type DailyTargets,
  type NutrientTargets,
  type PieChartNutrient
} from './gameStore';

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
      if (data.version === STORAGE_VERSION && data.state) {
        return data.state;
      }
    }
  } catch (e) {
    console.error('Failed to load game state from localStorage:', e);
  }
  return null;
}

// Save game state to localStorage
function saveGameState(): void {
  if (!browser) return;
  
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

// Initialize stores from saved state (call on app mount)
export function initializeGameState(): boolean {
  const savedState = loadGameState();
  
  if (savedState) {
    // Restore all stores from saved state
    addedFoods.set(savedState.addedFoods);
    meals.set(savedState.meals);
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
    addedFoods.subscribe(() => saveGameState()),
    meals.subscribe(() => saveGameState()),
    selectedMeal.subscribe(() => saveGameState()),
    selectedContainer.subscribe(() => saveGameState()),
    targets.subscribe(() => saveGameState()),
    nutrientTargets.subscribe(() => saveGameState()),
    selectedPieNutrient.subscribe(() => saveGameState())
  ];
}

export function stopAutoSave(): void {
  unsubscribers.forEach(unsub => unsub());
  unsubscribers = [];
}

// Start a new game - clear foods and meals but keep user's settings
export function startNewGame(): void {
  // Stop auto-save first to prevent saving the reset state before clearing
  stopAutoSave();
  
  // Clear localStorage game state
  clearGameState();
  
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
