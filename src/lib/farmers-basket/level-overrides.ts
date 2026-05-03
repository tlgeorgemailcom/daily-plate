// Utility to load and apply built-in recipe overrides from the server
import type { Level, FoodType, AnimalType } from './types';
import { LEVELS } from './game-state.svelte';
import { FOODS } from '$lib/data/food-portions';

export interface BuiltinOverride {
  id: string;
  name?: string;
  category?: string;
  dietaryCategory?: string;
  cookingMethod?: string;
  dishFamily?: string;
  prepTime?: string;
  servings?: string;
  recipe?: FoodType[];
  animalSpawns?: { type: AnimalType; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: Level['recipeIngredients'];
  nutritionJson?: Level['nutritionJson'];
  imageUrl?: string;
  editedAt?: string;
  editedBy?: string;
}

interface NewBuiltinRecipe {
  id: string;
  name: string;
  category: string;
  dietaryCategory: string;
  cookingMethod?: string;
  dishFamily?: string;
  prepTime?: string;
  servings?: string;
  recipe: FoodType[];
  animalSpawns: { type: AnimalType; delay: number }[];
  recipeInstructions?: string[];
  recipeIngredients?: Level['recipeIngredients'];
  nutritionJson?: Level['nutritionJson'];
  imageUrl?: string;
  createdAt: string;
}

interface OverridesCache {
  overrides: Record<string, BuiltinOverride>;
  newBuiltins: NewBuiltinRecipe[];
}

let cachedData: OverridesCache | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Fetch built-in recipe overrides and new admin-added recipes from the server
 * Results are cached for 1 minute
 */
export async function fetchOverrides(): Promise<Record<string, BuiltinOverride>> {
  const data = await fetchOverridesAndNew();
  return data.overrides;
}

async function fetchOverridesAndNew(): Promise<OverridesCache> {
  const now = Date.now();

  // Return cached if still valid
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const res = await fetch('/api/recipes/builtin');
    if (!res.ok) throw new Error('Failed to fetch overrides');
    const data = await res.json();
    cachedData = {
      overrides: data.overrides || {},
      newBuiltins: data.newBuiltins || []
    };
    lastFetchTime = now;
    return cachedData;
  } catch (err) {
    console.warn('Could not load built-in overrides:', err);
    return cachedData ?? { overrides: {}, newBuiltins: [] };
  }
}

/**
 * Merge override ingredients with original level ingredients.
 * Preserves portionGrams/foodWord/ndbNo from the original when the override
 * ingredient (saved before the full-metadata schema) lacks nutrition link data.
 * Matching is done by normalised name so reordering and minor edits still work.
 */
function mergeRecipeIngredients(
  overrideIngs: Level['recipeIngredients'],
  originalIngs: Level['recipeIngredients']
): Level['recipeIngredients'] {
  if (!overrideIngs) return originalIngs;
  if (!originalIngs || originalIngs.length === 0) return overrideIngs;

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const origByName = new Map(originalIngs.map(o => [normalize(o.name), o]));
  const validFoodWords = new Set(FOODS.map((f) => f.word));

  return overrideIngs.map(ing => {
    const hasValidFoodWord = !!ing.foodWord && validFoodWords.has(ing.foodWord);
    // Only preserve override nutrition links when they can actually map to FOODS.
    if ((ing.portionGrams && hasValidFoodWord) || ing.exempt || ing.isDish) return ing;

    // Otherwise try to find a matching original ingredient and copy its nutrition links.
    const orig = origByName.get(normalize(ing.name));
    if (!orig) return ing;

    return {
      ...ing,
      foodWord: orig.foodWord,
      ndbNo: orig.ndbNo,
      portionDesc: orig.portionDesc,
      portionGrams: orig.portionGrams,
      servingCount: orig.servingCount,
      exempt: orig.exempt,
      isDish: orig.isDish,
      section: ing.section ?? orig.section,
    };
  });
}

/**
 * Get all LEVELS with any overrides applied, plus admin-added new recipes
 */
export async function getLevelsWithOverrides(): Promise<Level[]> {
  const { overrides, newBuiltins } = await fetchOverridesAndNew();

  // Apply overrides to existing TypeScript LEVELS
  const mergedLevels = LEVELS.map(level => {
    const override = overrides[level.id];
    if (!override) return level;

    return {
      ...level,
      name: override.name ?? level.name,
      category: override.category ?? level.category,
      dietaryCategory: override.dietaryCategory ?? level.dietaryCategory,
      cookingMethod: override.cookingMethod ?? level.cookingMethod,
      dishFamily: override.dishFamily ?? level.dishFamily,
      prepTime: override.prepTime ?? level.prepTime,
      servings: override.servings ?? level.servings,
      recipe: override.recipe ?? level.recipe,
      animalSpawns: override.animalSpawns ?? level.animalSpawns,
      recipeInstructions: override.recipeInstructions ?? level.recipeInstructions,
      recipeIngredients: mergeRecipeIngredients(override.recipeIngredients, level.recipeIngredients),
      nutritionJson: override.nutritionJson ?? level.nutritionJson,
      imageUrl: override.imageUrl ?? level.imageUrl
    } as Level;
  });

  // Append admin-added recipes as Level objects (not in TypeScript LEVELS)
  const adminLevels: Level[] = newBuiltins.map((r, i) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    dietaryCategory: r.dietaryCategory as Level['dietaryCategory'],
    levelNum: LEVELS.length + i + 1,
    recipe: r.recipe as FoodType[],
    tools: [
      { type: 'fence' as const, count: 2, emoji: '🚧' },
      { type: 'wall' as const, count: 5, emoji: '🧱' }
    ],
    animalSpawns: r.animalSpawns as { type: AnimalType; delay: number }[],
    foodSupply: {} as Record<FoodType, number>,
    prepTime: r.prepTime,
    servings: r.servings,
    cookingMethod: r.cookingMethod,
    dishFamily: r.dishFamily,
    recipeInstructions: r.recipeInstructions,
    recipeIngredients: r.recipeIngredients,
    nutritionJson: r.nutritionJson,
    imageUrl: r.imageUrl
  }));

  return [...mergedLevels, ...adminLevels];
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
  cachedData = null;
  lastFetchTime = 0;
}
