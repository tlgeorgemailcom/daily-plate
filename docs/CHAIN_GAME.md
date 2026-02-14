# Daily Chain Game

## Overview
Build a chain of 11 food words where each word starts with the last letter of the previous word.

**URL**: `/chain`  
**File**: `src/routes/chain/+page.svelte`

---

## Gameplay

### Objective
Complete a chain of 11 food words using all 11 food groups for maximum points.

### Rules
1. Each word must start with the last letter of the previous word
2. Only valid food words from the database are accepted
3. No repeating words
4. Starting word is determined daily (seeded random based on puzzle number)

### Example Chain
```
APPLE → EGGPLANT → TOMATO → OATMEAL → LEMON → ...
```

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
Some foods belong to multiple groups (e.g., ALMOND can be Nuts or Fats). When entered, a picker modal appears letting the player choose which group to credit.

### Undo/Remove Feature
The last word in the chain (except the starting word) shows a ✕ button to remove it, allowing players to backtrack when stuck.

---

## Scoring

| Component | Points |
|-----------|--------|
| Per letter (after starting word) | +1 |
| Per unique food group used | +10 |
| Completion bonus (11 words) | +25 |
| All 11 groups bonus | +50 |
| **Multiplied by difficulty** | ×1 / ×1.5 / ×2 |

### Achievement Badges
- ⭐ Perfect Chain: 11 groups
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
let chain: ChainWord[] = $state([]);           // Array of {word, group, entry}
let difficultyMode = $state<DifficultyMode | null>(null);
let gameComplete = $state(false);
let showResults = $state(false);
let expandedGroup = $state<FoodGroup | null>(null);
let letterSearchQuery = $state('');
```

### Derived Values
```typescript
let lastLetter = $derived(chain[chain.length - 1].word.slice(-1).toUpperCase());
let wordsRemaining = $derived(11 - chain.length);
```

### localStorage
- `dailyChainStreak` - Player's current streak
- `dailyChainLastPlayed` - Date of last completed game
- `dailyChainDifficulty` - Last selected difficulty

---

## Daily Puzzle System

### Puzzle Number
Days since January 1, 2024:
```typescript
const puzzleNumber = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 86400000);
```

### Seeded Starting Word
Uses puzzle number to deterministically select the same starting word for all players on a given day:
```typescript
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}
```

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

### Modals
1. **Difficulty Selector** - Shown on game start
2. **Group Picker** - For dual-identity foods
3. **Results Modal** - On completion with share button
4. **Rules Modal** - How to play

### Hint Panels (by mode)
- **Easy**: Expandable group chips with food lists
- **Medium**: Letter search (first/last letter filter)
- **Hard**: Simple "must start with X" reminder

---

## Share Format
```
🔗 Daily Food Chain #754 🟢
⭐ Perfect Chain • Perfectly Balanced!
Score: 185
🥬🍎🌾🍗🥛🫘🥜🫒🧂🍽️🥤
🔥 5 day streak
```
