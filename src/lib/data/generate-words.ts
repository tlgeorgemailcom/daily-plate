// RETIRED — DO NOT RUN THIS SCRIPT.
//
// scrambled-words.csv is a manually curated word list for the Chain, Plate, Tower, and Bees games.
// It is frozen as of 2026-06-16. New words must be added by hand after review.
//
// Protocol for adding new words:
//   1. After completing a new recipe with a Rule A/B/C food_word, check whether the ingredient's
//      display name contributes any new, game-worthy lowercase words (3+ letters, no qualifiers
//      like "raw", "boiled", "dry", "flat").
//   2. If yes, append the word and its group(s) to src/lib/data/scrambled-words.csv manually.
//   3. Commit the CSV change with the recipe commit.
//
// This file is kept for historical reference only.

import { FOODS } from './food-portions';
import { writeFileSync } from 'fs';

// Extract words with the same logic as scrambled-puzzles.ts
const wordMap = new Map();

// First pass: collect all words, preferring exact matches
for (const food of FOODS) {
  const displayLower = food.display.toLowerCase();
  const displayClean = displayLower.replace(/[^a-z]/g, '');
  const words = displayLower.split(/\s+/);
  const isSingleWord = words.length === 1;
  
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, '');
    if (clean.length >= 3) {
      const existing = wordMap.get(clean);
      const isExactMatch = isSingleWord && clean === displayClean;
      
      if (!existing || (isExactMatch && !existing.isExact)) {
        wordMap.set(clean, { 
          word: clean, 
          groups: [...food.groups],
          isExact: isExactMatch,
          source: food.display
        });
      }
    }
  }
}

// Remove plurals
for (const word of [...wordMap.keys()]) {
  if (word.endsWith('s') && word.length > 3) {
    const singular = word.slice(0, -1);
    if (wordMap.has(singular)) {
      wordMap.delete(word);
    }
  }
}

// Convert to sorted array
const result = [...wordMap.values()]
  .sort((a, b) => a.word.localeCompare(b.word))
  .map(({ word, groups, source }) => ({ word, groups, source }));

writeFileSync('./scrambled-words.json', JSON.stringify(result, null, 2));
console.log(`Generated scrambled-words.json with ${result.length} words`);
