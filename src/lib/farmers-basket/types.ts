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
  | 'bread' | 'apple' | 'grapes' | 'bacon' | 'butter';

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
  servings?: string;              // e.g., "Serves 2"
  prepTime?: string;              // e.g., "10 minutes"
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
  butter: '🧈'
};

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
  bird: ['grapes', 'bread'],
  fox: ['egg', 'bacon'],
  squirrel: ['apple', 'bread'],
  raccoon: ['lettuce', 'tomato', 'carrot', 'cheese', 'egg', 'bread', 'apple', 'grapes', 'bacon', 'butter']
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
  butter: 'raccoon'
};
