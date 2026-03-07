// Scrambled puzzle data - precomputed viable letter combinations
// Each puzzle has 10-16 valid food words

import type { FoodGroup } from './food-portions';
import scrambledWordsCsv from './scrambled-words.csv?raw';
import scrambledWordsCombinedCsv from './scrambled-words-combined.csv?raw';

// Game levels
// usda: Official USDA food names only
// foodie: USDA + international foods (excludes wine & bar)
// foodie21: Full experience including wine & spirits
export type GameLevel = 'usda' | 'foodie' | 'foodie21';

// Groups to exclude from FOODIE level (alcohol-related)
const ALCOHOL_GROUPS = new Set(['wine', 'bar']);

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
const combinedWordList = parseWordsCsv(scrambledWordsCombinedCsv);

// Convert to Map for efficient lookup (USDA level)
export const FOOD_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  usdaWordList.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// FOODIE level words - combined list excluding wine & bar groups
const foodieWords = combinedWordList.filter(entry => 
  !entry.groups.some(g => ALCOHOL_GROUPS.has(g))
);
export const FOODIE_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  foodieWords.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// FOODIE 21+ level words - full combined list including wine & bar
export const FOODIE_21_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  combinedWordList.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// Get word map for a level
export function getWordsForLevel(level: GameLevel): Map<string, { word: string; groups: FoodGroup[] }> {
  switch (level) {
    case 'foodie21': return FOODIE_21_WORDS;
    case 'foodie': return FOODIE_WORDS;
    default: return FOOD_WORDS;
  }
}

// Check if a word can be made from the given letters (with letter reuse)
export function canMakeWord(word: string, letters: Set<string>): boolean {
  return [...word].every(char => letters.has(char));
}

// Get all valid words for a set of letters (minimum 3 letters)
export function getValidWords(letters: Set<string>, level: GameLevel = 'usda'): string[] {
  const wordMap = getWordsForLevel(level);
  const valid: string[] = [];
  for (const word of wordMap.keys()) {
    if (word.length >= 3 && canMakeWord(word, letters)) {
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

// Seeded random number generator for consistent daily puzzles
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Generate a puzzle dynamically from a seed
function generatePuzzleFromSeed(seed: number, level: GameLevel): string[] {
  const random = seededRandom(seed);
  const wordMap = getWordsForLevel(level);
  
  // Get all unique letters from the word list
  const allLetters = new Set<string>();
  for (const word of wordMap.keys()) {
    for (const c of word) {
      allLetters.add(c);
    }
  }
  const letterPool = Array.from(allLetters);
  
  // Try to generate a good set (10+ valid words)
  // We'll try multiple times with the seeded random to find a good combo
  for (let attempt = 0; attempt < 50; attempt++) {
    // Shuffle the letter pool using seeded random
    const shuffled = [...letterPool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Pick 7 letters
    const picked = shuffled.slice(0, 7);
    const letterSet = new Set(picked);
    
    // Count valid words
    let wordCount = 0;
    for (const word of wordMap.keys()) {
      if (word.length >= 3 && canMakeWord(word, letterSet)) {
        wordCount++;
        if (wordCount >= 10) break; // Good enough
      }
    }
    
    if (wordCount >= 10) {
      return picked.sort(); // Sort alphabetically for consistent display
    }
  }
  
  // Fallback to a known good combo if generation fails
  return PUZZLE_COMBOS[seed % PUZZLE_COMBOS.length].toLowerCase().split('');
}

// Get today's puzzle based on date and level
export function getTodaysPuzzle(level: GameLevel = 'usda'): { letters: string[]; validWords: string[]; date: string; level: GameLevel } {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Use date components to create a unique seed for each day
  // This gives us 365 unique seeds per year, plus level offset
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const levelOffset = level === 'usda' ? 0 : level === 'foodie' ? 10000 : 20000;
  const seed = (year * 10000 + month * 100 + day) + levelOffset;
  
  const letters = generatePuzzleFromSeed(seed, level);
  const letterSet = new Set(letters);
  const validWords = getValidWords(letterSet, level);
  
  return { letters, validWords, date: dateStr, level };
}

// Get puzzle for a specific date (for testing/archives)
export function getPuzzleForDate(date: Date, level: GameLevel = 'usda'): { letters: string[]; validWords: string[]; date: string; level: GameLevel } {
  const dateStr = date.toISOString().split('T')[0];
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const levelOffset = level === 'usda' ? 0 : level === 'foodie' ? 10000 : 20000;
  const seed = (year * 10000 + month * 100 + day) + levelOffset;
  
  const letters = generatePuzzleFromSeed(seed, level);
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
  spice: { emoji: '🌿', label: 'Spices & Condiments', hint: 'Basil, pepper, cinnamon, ketchup, mayo' },
  prepared: { emoji: '🍳', label: 'Prepared', hint: 'Cooked dishes, lasagna, casseroles' },

  beverage: { emoji: '🍵', label: 'Beverage', hint: 'Drinks, tea, coffee' },
  wine: { emoji: '🍷', label: 'Wine', hint: 'Red, white, sparkling wines' },
  bar: { emoji: '🍸', label: 'Bar', hint: 'Spirits, cocktails, beer' }
};
