# Shared Resources

## Overview
Common data and utilities shared across all Daily Food Games.

**Location**: `src/lib/data/`

---

## Files

### `food-words.json`
Array of 802 valid food words (uppercase).

```json
["ABIYUCH", "ACEROLA", "AGAVE", ..., "ZUCCHINI"]
```

### `food-database.ts`
Main data module with types, constants, and helpers.

### `foods.ts`
Simple export of food words as a Set (legacy, used by some components).

```typescript
import foodWordsRaw from './food-words.json';
export const foodWords: Set<string> = new Set(foodWordsRaw.map(w => w.toUpperCase()));
```

---

## Types

### FoodGroup
```typescript
export type FoodGroup = 
  | 'vegetable' 
  | 'fruit' 
  | 'grain' 
  | 'protein' 
  | 'dairy' 
  | 'legume' 
  | 'nuts' 
  | 'fats'
  | 'spice'
  | 'prepared'
  | 'beverage';
```

### FoodEntry
```typescript
export interface FoodEntry {
  word: string;
  groups: FoodGroup[];    // Array for dual-identity foods
  facts?: string[];       // Optional fun facts
}
```

---

## Constants

### GROUP_COLORS
Background/badge colors for each group.
```typescript
export const GROUP_COLORS: Record<FoodGroup, string> = {
  vegetable: '#22c55e',  // green
  fruit: '#ef4444',      // red
  grain: '#a16207',      // brown
  protein: '#a855f7',    // purple
  dairy: '#f5f5f5',      // white/cream
  legume: '#f97316',     // orange
  nuts: '#eab308',       // yellow
  fats: '#fbbf24',       // amber
  spice: '#dc2626',      // deep red
  prepared: '#64748b',   // slate gray
  beverage: '#3b82f6',   // blue
};
```

### GROUP_TEXT_COLORS
Darker text-safe versions for readability.
```typescript
export const GROUP_TEXT_COLORS: Record<FoodGroup, string> = {
  vegetable: '#15803d',  // darker green
  fruit: '#b91c1c',      // darker red
  grain: '#78350f',      // darker brown
  protein: '#7e22ce',    // darker purple
  dairy: '#525252',      // gray (white won't work as text)
  legume: '#c2410c',     // darker orange
  nuts: '#a16207',       // darker yellow/amber
  fats: '#b45309',       // darker amber
  spice: '#991b1b',      // darker deep red
  prepared: '#334155',   // darker slate
  beverage: '#1d4ed8',   // darker blue
};
```

### GROUP_EMOJI
```typescript
export const GROUP_EMOJI: Record<FoodGroup, string> = {
  vegetable: '🥬',
  fruit: '🍎',
  grain: '🌾',
  protein: '🍗',
  dairy: '🥛',
  legume: '🫘',
  nuts: '🥜',
  fats: '🫒',
  spice: '🧂',
  prepared: '🍽️',
  beverage: '🥤',
};
```

### GROUP_NAMES
```typescript
export const GROUP_NAMES: Record<FoodGroup, string> = {
  vegetable: 'Vegetable',
  fruit: 'Fruit',
  grain: 'Grain',
  protein: 'Protein',
  dairy: 'Dairy',
  legume: 'Legume',
  nuts: 'Nuts/Seeds',
  fats: 'Fats/Oils',
  spice: 'Spices',
  prepared: 'Prepared',
  beverage: 'Beverage',
};
```

---

## Data Structures

### DUAL_IDENTITY_FOODS
Foods that belong to multiple groups with explanatory facts.
```typescript
export const DUAL_IDENTITY_FOODS: Record<string, { groups: FoodGroup[], facts: string[] }> = {
  'ALMOND': {
    groups: ['nuts', 'fats'],
    facts: ['High in healthy fats', 'Good source of protein']
  },
  'COCONUT': {
    groups: ['fruit', 'fats'],
    facts: ['Technically a fruit', 'High in saturated fat']
  },
  // ... many more
};
```

### FOOD_GROUPS
Single-identity food assignments.
```typescript
const FOOD_GROUPS: Record<string, FoodGroup> = {
  'APPLE': 'fruit',
  'BROCCOLI': 'vegetable',
  'CHICKEN': 'protein',
  // ... hundreds more
};
```

### FOOD_DATABASE
The main Map built from all sources.
```typescript
export const FOOD_DATABASE: Map<string, FoodEntry> = new Map();
```

Built at module load by iterating `food-words.json` and assigning:
1. Dual-identity foods → multiple groups
2. Known single-group foods → single group
3. Unknown foods → defaults to 'protein'

---

## Helper Functions

### isValidFood
```typescript
export function isValidFood(word: string): boolean {
  return FOOD_DATABASE.has(word.toUpperCase());
}
```

### getFoodEntry
```typescript
export function getFoodEntry(word: string): FoodEntry | undefined {
  return FOOD_DATABASE.get(word.toUpperCase());
}
```

### isDualIdentity
```typescript
export function isDualIdentity(word: string): boolean {
  const entry = FOOD_DATABASE.get(word.toUpperCase());
  return entry ? entry.groups.length > 1 : false;
}
```

### getWordsStartingWith
```typescript
export function getWordsStartingWith(letter: string): string[] {
  const result: string[] = [];
  for (const word of FOOD_DATABASE.keys()) {
    if (word.startsWith(letter.toUpperCase())) {
      result.push(word);
    }
  }
  return result;
}
```

### getAllFoodWords
```typescript
export function getAllFoodWords(): string[] {
  return Array.from(FOOD_DATABASE.keys());
}
```

---

## Usage in Games

### Import Pattern
```typescript
import { 
  getFoodEntry, 
  isValidFood, 
  isDualIdentity,
  GROUP_COLORS,
  GROUP_TEXT_COLORS,
  GROUP_EMOJI,
  GROUP_NAMES,
  FOOD_DATABASE,
  type FoodGroup,
  type FoodEntry
} from '$lib/data/food-database';
```

---

## Adding New Foods

1. Add word to `food-words.json` (alphabetically sorted)
2. Add group assignment to either:
   - `DUAL_IDENTITY_FOODS` (if multiple groups)
   - `FOOD_GROUPS` (if single group)
3. If neither, defaults to 'protein'

---

## Statistics

- **Total words**: 802
- **Food groups**: 11
- **Dual-identity foods**: ~50+
