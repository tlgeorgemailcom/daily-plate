# Daily Plate Game

## Overview
Place 11 food words on a crossword-style grid where each word connects to the next by sharing a letter.

**URL**: `/plate`  
**File**: `src/routes/plate/+page.svelte`

---

## Gameplay

### Objective
Build a connected crossword of 11 food words using all 11 food groups for maximum points.

### Rules
1. Each word must connect to an existing word by sharing at least one letter
2. Words can be placed horizontally or vertically
3. Only valid food words from the database are accepted
4. No repeating words
5. All words must be connected (no isolated words)

### Grid
- 15×15 crossword grid
- First word placed at center
- Subsequent words must intersect existing letters

---

## Features

### Difficulty Modes
| Mode | Hints | Score Multiplier |
|------|-------|------------------|
| 🟢 Easy | Food lists by group (clickable dropdowns) | 1× |
| 🟡 Medium | Letter search only (first/last letter) | 1.5× |
| 🔴 Hard | No hints - memory only | 2× |

### Food Groups (11)
- 🥬 Vegetable
- 🍎 Fruit
- 🌾 Grain
- 🍗 Protein
- 🥛 Dairy
- 🫘 Legume
- 🥜 Nuts/Seeds
- 🫒 Fats/Oils
- 🧂 Spice
- 🍽️ Prepared
- 🥤 Beverage

### Dual-Identity Foods
Some foods belong to multiple groups (e.g., COCONUT can be Fruit or Fats). When placed, a picker modal appears letting the player choose which group to credit.

### Word Placement
1. Click a letter on the grid to select starting position
2. Type or select a food word
3. Choose direction (horizontal/vertical) if ambiguous
4. Word is validated for adjacency and valid intersections

---

## Scoring

| Component | Points |
|-----------|--------|
| Per letter placed | +1 |
| Per unique food group used | +10 |
| Completion bonus (11 words) | +25 |
| All 11 groups bonus | +50 |
| **Multiplied by difficulty** | ×1 / ×1.5 / ×2 |

### Achievement Badges
- ⭐ Perfect Plate: 11 groups
- 🌟 Excellent: 9-10 groups
- ✨ Great: 7-8 groups
- 👍 Good: 5-6 groups
- ✅ Complete: <5 groups

### Balance Badges
- 🌈 Perfectly Balanced: 11 groups
- 🥗 Well Rounded: 8-10 groups

---

## State Management

### Key State Variables
```typescript
let grid: Cell[][] = $state([]);               // 15x15 grid of cells
let placedWords: PlacedWord[] = $state([]);    // Array of placed words
let selectedCell = $state<{row: number, col: number} | null>(null);
let difficultyMode = $state<DifficultyMode | null>(null);
let gameComplete = $state(false);
let showResults = $state(false);
let expandedGroup = $state<FoodGroup | null>(null);
```

### Cell Structure
```typescript
interface Cell {
  letter: string | null;
  wordIds: number[];      // Which words use this cell
  isSelected: boolean;
}
```

### PlacedWord Structure
```typescript
interface PlacedWord {
  id: number;
  word: string;
  group: FoodGroup;
  row: number;
  col: number;
  direction: 'horizontal' | 'vertical';
}
```

### localStorage
- `dailyPlateStreak` - Player's current streak
- `dailyPlateLastPlayed` - Date of last completed game
- `dailyPlateDifficulty` - Last selected difficulty

---

## Daily Puzzle System

### Puzzle Number
Days since January 1, 2024:
```typescript
const puzzleNumber = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 86400000);
```

### Seeded Starting Word
Uses puzzle number to deterministically select the same starting word for all players on a given day.

---

## Shared Dependencies

### From `$lib/data/food-database`
- `FOOD_DATABASE` - Map of all food words with group assignments
- `getFoodEntry(word)` - Get food entry by word
- `isValidFood(word)` - Check if word is valid
- `isDualIdentity(word)` - Check if food has multiple groups
- `GROUP_COLORS`, `GROUP_TEXT_COLORS`, `GROUP_EMOJI`, `GROUP_NAMES`
- `FoodGroup`, `FoodEntry` types

---

## UI Components

### Grid Display
- Interactive 15×15 grid
- Clickable cells for word placement
- Color-coded by food group
- Highlights valid placement positions

### Modals
1. **Difficulty Selector** - Shown on game start
2. **Group Picker** - For dual-identity foods
3. **Direction Picker** - When placement direction is ambiguous
4. **Results Modal** - On completion with share button
5. **Rules Modal** - How to play

### Hint Panels (by mode)
- **Easy**: Expandable group chips with food lists
- **Medium**: Letter search (first/last letter filter)
- **Hard**: No hints shown

---

## Word Placement Validation

### Adjacency Rules
1. New word must share at least one letter with existing words
2. Shared letters must match exactly
3. No invalid crossings (letter conflicts)
4. Words cannot overlap completely

### Valid Placement Example
```
    C A R R O T
        I
        C
        E
```
CARROT (horizontal) and RICE (vertical) share the 'R'.

---

## Share Format
```
🍽️ Daily Plate #754 🟢
⭐ Perfect Plate • Perfectly Balanced!
Score: 185
🥬🍎🌾🍗🥛🫘🥜🫒🧂🍽️🥤
🔥 5 day streak
```

---

## Key Differences from Chain

| Aspect | Chain | Plate |
|--------|-------|-------|
| Mechanic | Last letter → first letter | Crossword intersections |
| Grid | Linear list | 15×15 grid |
| Constraint | Sequential letters | Spatial placement |
| Undo | Remove last word | Remove any word (breaks connections) |
| Visual | Vertical word list | 2D crossword |
