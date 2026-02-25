// Scrambled puzzle data - precomputed viable letter combinations
// Each puzzle has 10-16 valid food words

import type { FoodGroup } from './food-portions';
import scrambledWordsCsv from './scrambled-words.csv?raw';
import scrambledWordsFoodieCsv from './scrambled-words-foodie.csv?raw';

// Game levels
export type GameLevel = 'usda' | 'foodie';

// Parse CSV into word list
// Format: word,groups (groups separated by |)
function parseWordsCsv(csv: string): Array<{ word: string; groups: FoodGroup[] }> {
  const lines = csv.trim().split('\n');
  // Skip header row
  return lines.slice(1).map(line => {
    const [word, groupsStr] = line.split(',');
    const groups = groupsStr.trim().split('|').map(g => g.trim()) as FoodGroup[];
    return { word: word.trim(), groups };
  });
}

// Load word lists from CSV files
const usdaWordList = parseWordsCsv(scrambledWordsCsv);
const foodieExtraWordList = parseWordsCsv(scrambledWordsFoodieCsv);

// Convert to Map for efficient lookup (USDA level)
export const FOOD_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  usdaWordList.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// FOODIE level words - includes USDA plus additional foodie words
const allFoodieWords = [...usdaWordList, ...foodieExtraWordList];
export const FOODIE_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  allFoodieWords.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// Get word map for a level
export function getWordsForLevel(level: GameLevel): Map<string, { word: string; groups: FoodGroup[] }> {
  return level === 'foodie' ? FOODIE_WORDS : FOOD_WORDS;
}

// Check if a word can be made from the given letters (with letter reuse)
export function canMakeWord(word: string, letters: Set<string>): boolean {
  return [...word].every(char => letters.has(char));
}

// Get all valid words for a set of letters
export function getValidWords(letters: Set<string>, level: GameLevel = 'usda'): string[] {
  const wordMap = getWordsForLevel(level);
  const valid: string[] = [];
  for (const word of wordMap.keys()) {
    if (canMakeWord(word, letters)) {
      valid.push(word);
    }
  }
  return valid.sort();
}

// Get food groups for a word
export function getWordGroups(word: string, level: GameLevel = 'usda'): FoodGroup[] {
  const wordMap = getWordsForLevel(level);
  return wordMap.get(word)?.groups ?? [];
}

// Top 100 viable 7-letter combinations (pre-analyzed, sorted by word count)
// Each yields 10-16 valid food words
export const PUZZLE_COMBOS: string[] = [
  'ABCNORT', 'AEILPST', 'AELOPST', 'ABCENOR', 'ABENORT', 'AEKLPST', 'AELMOST', 
  'AEOPRST', 'ABCKNOR', 'ACENOPR', 'ACNORTU', 'AEFLPST', 'AEGOPST', 'AEILNPS', 
  'AELMPST', 'AELNPST', 'AEMOPST', 'ABCENPR', 'ABCEORT', 'ABCMNOR', 'ABCNORS', 
  'ABCNOTU', 'ABCORTU', 'ABELNOR', 'ABENORS', 'ABGNORT', 'ABINORT', 'ABNORST', 
  'ABNORTU', 'ACEHORT', 'ACEIORT', 'ACELNOR', 'ACENORS', 'ACENORT', 'ACEORST', 
  'ACINOST', 'ACINORT', 'ACIORST', 'ACLNORT', 'ACLORST', 'ACMORST', 'ACNOPRST',
  'ACNORST', 'ACORSTY', 'ADEINOR', 'ADEIORS', 'ADENORS', 'AEGLOPT', 'AEGLPST',
  'AEGMOST', 'AEGNOPR', 'AEGNOPS', 'AEGNOST', 'AEGOPRS', 'AEGORST', 'AEHOPST',
  'AEILOPST', 'AEILMPS', 'AEILMST', 'AEILNOP', 'AEILNOS', 'AEILNOT', 'AEILOPS',
  'AEILOPST', 'AEILORS', 'AEILORT', 'AEILOST', 'AEILPRT', 'AEILRST', 'AEIMOPS',
  'AEIMOST', 'AEINOPS', 'AEINORS', 'AEINORT', 'AEINOST', 'AEIOPRS', 'AEIOPST',
  'AEIPRST', 'AEIRSTT', 'AEKLMPS', 'AEKLNOP', 'AEKLNOS', 'AEKLNOT', 'AEKLOPS',
  'AEKLORS', 'AEKLOST', 'AEKMNOS', 'AEKMOPS', 'AEKMOST', 'AEKNOPS', 'AEKNORS',
  'AEKNORT', 'AEKNPST', 'AEKOPRS', 'AEKOPST', 'AEKORST', 'AEKPRST', 'AELMOPS',
  'AELMORS', 'AELMOST', 'AELMPRS'
];

// Get today's puzzle based on date and level
export function getTodaysPuzzle(level: GameLevel = 'usda'): { letters: string[]; validWords: string[]; date: string; level: GameLevel } {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Use date as seed for puzzle selection
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const puzzleIndex = daysSinceEpoch % PUZZLE_COMBOS.length;
  
  const letters = PUZZLE_COMBOS[puzzleIndex].toLowerCase().split('');
  const letterSet = new Set(letters);
  const validWords = getValidWords(letterSet, level);
  
  return { letters, validWords, date: dateStr, level };
}

// Get puzzle for a specific date (for testing/archives)
export function getPuzzleForDate(date: Date, level: GameLevel = 'usda'): { letters: string[]; validWords: string[]; date: string; level: GameLevel } {
  const dateStr = date.toISOString().split('T')[0];
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const puzzleIndex = daysSinceEpoch % PUZZLE_COMBOS.length;
  
  const letters = PUZZLE_COMBOS[puzzleIndex].toLowerCase().split('');
  const letterSet = new Set(letters);
  const validWords = getValidWords(letterSet, level);
  
  return { letters, validWords, date: dateStr, level };
}

// Group display info for classification phase
export const FOOD_GROUP_INFO: Record<FoodGroup, { emoji: string; label: string; hint: string }> = {
  vegetable: { emoji: '🥬', label: 'Vegetable', hint: 'Leafy greens, roots, stems' },
  fruit: { emoji: '🍎', label: 'Fruit', hint: 'Sweet produce with seeds' },
  grain: { emoji: '🌾', label: 'Grain', hint: 'Wheat, rice, oats, bread' },
  protein: { emoji: '🥩', label: 'Protein', hint: 'Meat, fish, poultry, eggs' },
  dairy: { emoji: '🥛', label: 'Dairy', hint: 'Milk, cheese, yogurt' },
  legume: { emoji: '🫘', label: 'Legume', hint: 'Beans, lentils, peas in pods' },
  nuts: { emoji: '🥜', label: 'Nuts & Seeds', hint: 'Tree nuts, seeds' },
  fats: { emoji: '🧈', label: 'Fats & Oils', hint: 'Butter, oil, lard' },
  spice: { emoji: '🌿', label: 'Herbs & Spices', hint: 'Basil, pepper, cinnamon, oregano' },
  prepared: { emoji: '🍳', label: 'Prepared', hint: 'Cooked dishes, lasagna, casseroles' },
  condiment: { emoji: '🥫', label: 'Condiments', hint: 'Sauces, ketchup, mayo, mustard' },
  beverage: { emoji: '🍵', label: 'Beverage', hint: 'Drinks, tea, coffee' }
};
