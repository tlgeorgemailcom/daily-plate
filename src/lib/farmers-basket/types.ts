// Farmer's Basket - Game Types

export type AnimalType = 'rabbit' | 'mouse' | 'bird' | 'fox' | 'squirrel' | 'raccoon';

export type AnimalState = 
  | 'approaching'
  | 'blocked'
  | 'rerouting'
  | 'digging'
  | 'climbing'
  | 'squeezing'
  | 'leaping'
  | 'pushing'
  | 'sniffing'
  | 'stealing'
  | 'celebrating'  // Victory dance after stealing
  | 'distracted'
  | 'avoiding'
  | 'flying';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type FarmerState = 'idle' | 'walking' | 'carrying' | 'depositing' | 'waiting' | 'placing' | 'picking' | 'dropping' | 'recovering';

export type ToolType = 'fence' | 'scarecrow' | 'cat' | 'dog' | 'torch' | 'bell' | 'decoy' | 'lid' | 'net' | 'wall';

export type FoodType = 
  | 'lettuce' | 'tomato' | 'carrot' | 'cheese' | 'egg' 
  | 'bread' | 'apple' | 'grapes' | 'bacon' | 'butter'
  | 'chicken' | 'fish';

export interface Position {
  x: number;
  y: number;
}

export interface Animal {
  id: string;
  type: AnimalType;
  position: Position;
  gridPos: { col: number; row: number };  // Grid-based position
  state: AnimalState;
  direction: Direction;
  targetFood: FoodType | null;
  path: Position[];
  escapeProgress: number; // 0-100 for digging/climbing progress
  escapeTarget?: { col: number; row: number };  // Where animal is trying to escape to
  escapeBarrierType?: 'fence' | 'net' | 'scarecrow';  // What barrier we're escaping through
  stolenFood?: FoodType;  // Food the animal stole (shown during celebration)
}

export interface Farmer {
  position: Position;
  state: FarmerState;
  carrying: FoodType | null;
  targetPosition: Position | null;
}

export interface Barrier {
  id: string;
  type: 'fence' | 'scarecrow' | 'torch' | 'lid' | 'decoy' | 'net' | 'wall';
  position: Position;
  health?: number;  // For decoys: 0-100, consumed over time
}

export interface Tool {
  type: ToolType;
  count: number;
  emoji: string;
}

export interface FoodSource {
  type: FoodType;
  position: Position;
  emoji: string;
  supply: number; // -1 for unlimited
}

export interface BasketItem {
  type: FoodType;
  collected: boolean;
}

// Dietary preference categories
export type DietaryCategory = 'all' | 'pollo-pesca' | 'pollo' | 'pesca' | 'veggie' | 'vegan';

export interface NutritionJson {
  perServing: {
    cal: number; pro: number; fat: number;
    carb: number; fib: number; h2o: number; sug: number;
    /** v3 may add AddedSugars / IntrinsicSugars and other panel members. */
    [key: string]: number;
  };
  per100g?: {
    Energy_KCal: number; Protein: number; TotalLipidFat: number;
    Carbohydrate: number; FiberTotalDietary: number; SugarsTotal: number; Water: number;
    /** v3 emits a ~70-nutrient panel here (vitamins, minerals, fatty acids, amino acids). */
    [key: string]: number;
  };
  gramsPerServing: number | null;
  servings: number;
  /** Fraction of raw water retained after cooking (0–1). Used for live ingredient-sum recalculation. */
  yieldFactorWater?: number;
  /** Fraction of raw fat retained after cooking (0–1). Used for live ingredient-sum recalculation. */
  yieldFactorFat?: number;
  /** v3 provenance + extras (micros, addedSugars, sources, etc.). Open shape. */
  [key: string]: unknown;
}

export interface Level {
  id: string;
  name: string;
  category: string;
  dietaryCategory: DietaryCategory; // Dietary restriction this recipe fits
  levelNum: number;
  recipe: FoodType[];
  tools: Tool[];
  animalSpawns: { type: AnimalType; delay: number }[];
  foodSupply: Record<FoodType, number>; // -1 for unlimited
  // Recipe details (revealed when level is completed)
  recipeInstructions?: string[];  // Step-by-step cooking instructions
  recipeIngredients?: {           // Full ingredient list with quantities and optional nutrition links
    name: string;
    quantity?: string;
    section?: string;       // presentation group such as 'crust' or 'filling'
    foodWord?: string;      // key into food-portions.ts e.g. "BEEFGROUND"
    ndbNo?: string;         // USDA NDB#
    portionDesc?: string;   // e.g. "1 cup"
    portionGrams?: number;  // grams for this portion
    servingCount?: number;  // number of portions
    exempt?: boolean;       // true = no nutrition link needed (e.g. salt, water)
    isDish?: boolean;       // true = this row is the dish-level USDA entry
  }[];
  servings?: string;              // e.g., "Serves 2"
  prepTime?: string;              // e.g., "10 minutes"
  cookingMethod?: string;         // e.g., "Bake"
  dishFamily?: string;            // e.g., "Pasta", "Salad", "Soup"
  imageUrl?: string;              // Cloudinary URL for community recipe photos
  isCommunityRecipe?: boolean;    // True if this is a community-submitted recipe
  submittedBy?: string;           // Submitter player ID for community recipes
  linkType?: 'ingredient' | 'dish' | 'mixed';  // How ingredients were USDA-linked
  sr28Rule?: 'Rule A' | 'Rule B' | 'Rule C' | 'Rule D'; // Nutrient data confidence tier
  nutritionJson?: NutritionJson | null;         // Per-serving nutrients (null = unlinked)
}

// Emoji mappings
export const ANIMAL_EMOJI: Record<AnimalType, string> = {
  rabbit: '🐰',
  mouse: '🐭',
  bird: '🐦',
  fox: '🦊',
  squirrel: '🐿️',
  raccoon: '🦝'
};

// Fallback emojis - prefer using FoodIcon component for proper rendering
// Foods marked with (*) have custom SVG icons at /icons/food/{name}.svg
export const FOOD_EMOJI: Record<FoodType, string> = {
  lettuce: '🥬',
  tomato: '🍅',
  carrot: '🥕',
  cheese: '🧀',
  egg: '🥚',
  bread: '🍞',
  apple: '🍎',
  grapes: '🍇',
  bacon: '🥓',
  butter: '🧈',
  chicken: '🍗',  // (*) SVG: /icons/food/chicken.svg (grilled breast)
  fish: '🐟'      // (*) SVG: /icons/food/fish.svg (salmon fillet)
};

// Foods that should use custom SVG icons instead of emoji
// These have better visual representations as SVGs
export const SVG_FOOD_ICONS: Set<FoodType> = new Set(['chicken', 'fish']);

// Additional SVG icons available for future food types:
// beef.svg, pork.svg, lamb.svg, turkey.svg, patty.svg, ground-meat.svg

export const TOOL_EMOJI: Record<ToolType, string> = {
  fence: '🚧',
  scarecrow: '🎃',
  cat: '🐱',
  dog: '🐕',
  torch: '🔥',
  bell: '🔔',
  decoy: '🍯',
  lid: '🥏',
  net: '🥅',
  wall: '🧱'
};

// Animal characteristics
export const ANIMAL_SPEED: Record<AnimalType, number> = {
  rabbit: 2,    // Medium
  mouse: 3,     // Fast
  bird: 2,      // Medium (but flies)
  fox: 4,       // Fast (2x)
  squirrel: 3,  // Fast
  raccoon: 1    // Slow
};

export const ANIMAL_ESCAPE_TIME: Record<AnimalType, number> = {
  rabbit: 3000,   // Default dig time
  mouse: 1000,    // 1 second to squeeze
  bird: 0,        // Instant fly
  fox: 2000,      // 2 seconds to leap
  squirrel: 2000, // 2 seconds to climb
  raccoon: 4000   // 4 seconds to push
};

// Barrier-specific escape times (overrides animal default)
export const ESCAPE_TIME_BY_BARRIER: Record<string, Record<string, number>> = {
  rabbit: {
    fence: 500,    // Squeezes through fence gaps quickly
    net: 4000,     // Must dig under net - takes longer
    scarecrow: 1000
  },
  mouse: {
    fence: 0,      // Walks right through fence
    net: 1500,     // Squeezes through net holes
    scarecrow: 500
  },
  squirrel: {
    fence: 2000,   // Climbs over
    net: 2500,     // Climbs but net tangles
    scarecrow: 1500
  }
};

// What foods each animal wants to steal
export const ANIMAL_TARGETS: Record<AnimalType, FoodType[]> = {
  rabbit: ['lettuce', 'carrot'],
  mouse: ['cheese', 'bread'],
  bird: ['grapes', 'bread', 'fish'],
  fox: ['egg', 'bacon', 'chicken'],
  squirrel: ['apple', 'bread'],
  raccoon: ['lettuce', 'tomato', 'carrot', 'cheese', 'egg', 'bread', 'apple', 'grapes', 'bacon', 'butter', 'chicken', 'fish']
};

// Food-to-animal mapping: which animal appears when this food is picked up
export const FOOD_ANIMAL_MAP: Record<FoodType, AnimalType> = {
  lettuce: 'rabbit',
  carrot: 'rabbit',
  cheese: 'mouse',
  bread: 'mouse',
  grapes: 'bird',
  egg: 'fox',
  bacon: 'fox',
  apple: 'squirrel',
  tomato: 'raccoon',
  butter: 'raccoon',
  chicken: 'fox',
  fish: 'bird'
};
