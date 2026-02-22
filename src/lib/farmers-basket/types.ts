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
  | 'distracted'
  | 'avoiding'
  | 'flying';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type FarmerState = 'idle' | 'walking' | 'carrying' | 'depositing' | 'waiting' | 'placing' | 'picking' | 'dropping' | 'recovering';

export type ToolType = 'fence' | 'scarecrow' | 'cat' | 'dog' | 'torch' | 'bell' | 'decoy' | 'umbrella' | 'net';

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
  state: AnimalState;
  direction: Direction;
  targetFood: FoodType | null;
  path: Position[];
  escapeProgress: number; // 0-100 for digging/climbing progress
}

export interface Farmer {
  position: Position;
  state: FarmerState;
  carrying: FoodType | null;
  targetPosition: Position | null;
}

export interface Barrier {
  id: string;
  type: 'fence' | 'scarecrow' | 'torch';
  position: Position;
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

export interface Level {
  id: string;
  name: string;
  world: number;
  levelNum: number;
  recipe: FoodType[];
  tools: Tool[];
  animalSpawns: { type: AnimalType; delay: number }[];
  foodSupply: Record<FoodType, number>; // -1 for unlimited
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
  decoy: '🧀',
  umbrella: '☂️',
  net: '🥅'
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
  rabbit: 3000,   // 3 seconds to dig
  mouse: 1000,    // 1 second to squeeze
  bird: 0,        // Instant fly
  fox: 2000,      // 2 seconds to leap
  squirrel: 2000, // 2 seconds to climb
  raccoon: 4000   // 4 seconds to push
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
