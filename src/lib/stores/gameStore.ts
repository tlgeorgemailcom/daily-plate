// Balanced Diet Game Store
import { writable, derived } from 'svelte/store';
import type { Food, Portion, FoodGroup } from '$lib/data/food-portions';
import { calculateNutrients, calculateNutrientsForGrams } from '$lib/data/food-portions';

// Container types
export type Container = 'plate' | 'bowl' | 'cup' | 'glass' | 'saucer';

// Meal slot for organizing foods by meal
export interface MealSlot {
  id: string;
  name: string;        // editable: "Breakfast", "Lunch", etc.
  foods: string[];     // array of AddedFood ids
}

// Default meal slots
export const DEFAULT_MEALS: MealSlot[] = [
  { id: 'breakfast', name: 'Bkfst', foods: [] },
  { id: 'snack', name: 'Snack', foods: [] },
  { id: 'lunch', name: 'Lunch', foods: [] },
  { id: 'beverage', name: 'Bev', foods: [] },
  { id: 'dinner', name: 'Dinner', foods: [] }
];

// A food item added to the day's diet
export interface AddedFood {
  id: string;
  food: Food;
  portion: Portion;
  customGrams?: number;  // If using custom amount
  multiplier?: number;   // Quantity multiplier (e.g., 2 eggs)
  calories: number;
  container: Container;
  mealId: string;        // Which meal this food belongs to
}

// Daily targets by calorie level (from USDA guidelines)
export interface DailyTargets {
  totalCalories: number;
  groups: Record<FoodGroup, number>;  // Target % of calories per group
}

// Nutrient targets for macros tracking
export interface NutrientTargets {
  calories: number;      // kcal - primary target
  water: number;         // cups - target (1 cup = 240ml)
  protein: number;       // grams - target
  carbohydrates: number; // grams - target
  fats: number;          // grams - target  
  fiber: number;         // grams - minimum
  sugar: number;         // grams - maximum (total sugar)
}

export const DEFAULT_NUTRIENT_TARGETS: NutrientTargets = {
  calories: 2000,
  water: 8,
  protein: 50,
  carbohydrates: 275,
  fats: 65,
  fiber: 28,
  sugar: 50
};

// Default 2000 calorie targets (USDA MyPlate inspired)
export const DEFAULT_TARGETS: DailyTargets = {
  totalCalories: 2000,
  groups: {
    vegetable: 30,   // ~600 cal
    fruit: 20,       // ~400 cal
    grain: 25,       // ~500 cal
    protein: 25,     // ~500 cal
    dairy: 0,        // included elsewhere or separate
    legume: 0,       // included in protein/vegetable
    nuts: 0,         // included in protein/fats
    fats: 0,         // distributed across groups
    spice: 0,        // negligible
    prepared: 0,     // depends on content
    beverage: 0      // mostly water/0 cal
  }
};

// Create stores
export const addedFoods = writable<AddedFood[]>([]);
export const targets = writable<DailyTargets>(DEFAULT_TARGETS);
export const nutrientTargets = writable<NutrientTargets>(DEFAULT_NUTRIENT_TARGETS);
export const selectedContainer = writable<Container>('plate');
export const meals = writable<MealSlot[]>(structuredClone(DEFAULT_MEALS));
export const selectedMeal = writable<string>('breakfast');

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Add a food to today's diet
export function addFood(
  food: Food, 
  portion: Portion, 
  container: Container,
  customGrams?: number,
  multiplier?: number,
  mealId?: string
): void {
  const mult = multiplier || 1;
  
  // Get current selected meal if not provided
  let currentMealId = mealId;
  if (!currentMealId) {
    selectedMeal.subscribe(m => currentMealId = m)();
  }
  
  // Calculate calories using new per-100g approach
  const calories = customGrams 
    ? calculateNutrientsForGrams(food, customGrams).calories
    : calculateNutrients(food, food.portions.indexOf(portion), mult).calories;

  const newFood: AddedFood = {
    id: generateId(),
    food,
    portion,
    customGrams,
    multiplier: mult > 1 ? mult : undefined,
    calories,
    container,
    mealId: currentMealId || 'breakfast'
  };

  addedFoods.update(foods => [...foods, newFood]);
}

// Remove a food from today's diet
export function removeFood(id: string): void {
  addedFoods.update(foods => foods.filter(f => f.id !== id));
}

// Move a food to a different meal
export function moveFoodToMeal(foodId: string, newMealId: string): void {
  addedFoods.update(foods => 
    foods.map(f => f.id === foodId ? { ...f, mealId: newMealId } : f)
  );
}

// Update a food's quantity (multiplier or custom grams)
export function updateFoodQuantity(foodId: string, multiplier?: number, customGrams?: number): void {
  addedFoods.update(foods => 
    foods.map(f => {
      if (f.id !== foodId) return f;
      
      // Recalculate calories based on new quantity
      let newCalories: number;
      if (customGrams !== undefined) {
        newCalories = calculateNutrientsForGrams(f.food, customGrams).calories;
      } else {
        const mult = multiplier || 1;
        const portionIndex = f.food.portions.indexOf(f.portion);
        newCalories = calculateNutrients(f.food, portionIndex >= 0 ? portionIndex : 0, mult).calories;
      }
      
      return {
        ...f,
        multiplier: multiplier && multiplier > 1 ? multiplier : undefined,
        customGrams,
        calories: newCalories
      };
    })
  );
}

// Clear all foods
export function clearFoods(): void {
  addedFoods.set([]);
}

// Derived: Total calories consumed
export const totalCalories = derived(addedFoods, $foods => 
  $foods.reduce((sum, f) => sum + f.calories, 0)
);

// Derived: Calories by group
export const caloriesByGroup = derived(addedFoods, $foods => {
  const groups: Record<FoodGroup, number> = {
    vegetable: 0, fruit: 0, grain: 0, protein: 0, dairy: 0,
    legume: 0, nuts: 0, fats: 0, spice: 0, prepared: 0, beverage: 0
  };

  for (const added of $foods) {
    // Distribute calories across food's groups
    const numGroups = added.food.groups.length || 1;
    const calPerGroup = added.calories / numGroups;
    
    for (const group of added.food.groups as FoodGroup[]) {
      groups[group] += calPerGroup;
    }
  }

  return groups;
});

// Derived: Percentage of target for each group
export const groupProgress = derived(
  [caloriesByGroup, targets, totalCalories],
  ([$byGroup, $targets, $total]) => {
    const progress: Record<FoodGroup, { current: number; target: number; percent: number }> = {} as any;
    
    for (const group of Object.keys($byGroup) as FoodGroup[]) {
      const targetPercent = $targets.groups[group];
      const targetCal = ($targets.totalCalories * targetPercent) / 100;
      const currentCal = $byGroup[group];
      
      progress[group] = {
        current: Math.round(currentCal),
        target: Math.round(targetCal),
        percent: targetCal > 0 ? Math.round((currentCal / targetCal) * 100) : 0
      };
    }
    
    return progress;
  }
);

// Derived: Overall progress toward calorie goal
export const overallProgress = derived(
  [totalCalories, targets],
  ([$total, $targets]) => ({
    current: Math.round($total),
    target: $targets.totalCalories,
    percent: Math.round(($total / $targets.totalCalories) * 100)
  })
);

// Derived: Nutrient totals from all added foods
export const nutrientTotals = derived(addedFoods, $foods => {
  let totals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    water: 0,
    sugar: 0
  };

  for (const added of $foods) {
    // Calculate nutrients for this food item
    const grams = added.customGrams || added.portion.gm * (added.multiplier || 1);
    const nutrients = calculateNutrientsForGrams(added.food, grams);
    
    totals.calories += nutrients.calories;
    totals.protein += nutrients.protein;
    totals.fat += nutrients.fat;
    totals.carbs += nutrients.carbs;
    totals.fiber += nutrients.fiber;
    totals.water += nutrients.water;
    totals.sugar += nutrients.sugar;
  }

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10,
    water: Math.round(totals.water * 10) / 10,  // grams of water
    sugar: Math.round(totals.sugar * 10) / 10
  };
});

// Derived: Nutrient progress with percentage and color status
export const nutrientProgress = derived(
  [nutrientTotals, nutrientTargets],
  ([$totals, $targets]) => {
    // Convert water grams to cups (240g = 1 cup)
    const waterCups = $totals.water / 240;

    const getStatus = (percent: number, isMaximum = false): 'under' | 'warning' | 'over' => {
      if (isMaximum) {
        // For maximums (sugar): under is good, over is bad
        if (percent <= 100) return 'under';
        if (percent <= 120) return 'warning';
        return 'over';
      }
      // For targets: under 100% is progressing, over is warning
      if (percent <= 100) return 'under';
      if (percent <= 120) return 'warning';
      return 'over';
    };

    const makeProgress = (current: number, target: number, unit: string, isMaximum = false) => {
      const percent = target > 0 ? Math.round((current / target) * 100) : 0;
      return {
        current: Math.round(current * 10) / 10,
        target,
        percent,
        unit,
        status: getStatus(percent, isMaximum)
      };
    };

    return {
      calories: makeProgress($totals.calories, $targets.calories, 'kcal'),
      protein: makeProgress($totals.protein, $targets.protein, 'g'),
      fat: makeProgress($totals.fat, $targets.fats, 'g'),
      carbs: makeProgress($totals.carbs, $targets.carbohydrates, 'g'),
      fiber: makeProgress($totals.fiber, $targets.fiber, 'g'),
      water: makeProgress(waterCups, $targets.water, 'cups'),
      sugar: makeProgress($totals.sugar, $targets.sugar, 'g', true)  // sugar is a maximum
    };
  }
);

// Which nutrient is displayed in the pie chart
export type PieChartNutrient = 'calories' | 'protein' | 'fat' | 'carbs' | 'fiber' | 'water' | 'sugar';
export const selectedPieNutrient = writable<PieChartNutrient>('calories');
