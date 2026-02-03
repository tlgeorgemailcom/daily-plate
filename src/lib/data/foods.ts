// Food word database for Daily Food Chain game
// Extracted from USDA FoodData Central

import foodWordsData from './food-words.json';

// Export as a Set for O(1) lookup
export const foodWords: Set<string> = new Set(foodWordsData);

// Get all words starting with a specific letter
export function getWordsStartingWith(letter: string): string[] {
  const upperLetter = letter.toUpperCase();
  return foodWordsData.filter((word: string) => word.startsWith(upperLetter));
}

// Get all words ending with a specific letter
export function getWordsEndingWith(letter: string): string[] {
  const upperLetter = letter.toUpperCase();
  return foodWordsData.filter((word: string) => word.endsWith(upperLetter));
}

// Check if a word is valid
export function isValidFood(word: string): boolean {
  return foodWords.has(word.toUpperCase());
}

// Get a random food word (useful for starting words)
export function getRandomFood(): string {
  const index = Math.floor(Math.random() * foodWordsData.length);
  return foodWordsData[index];
}

// Get all words as array
export function getAllFoods(): string[] {
  return [...foodWordsData];
}

// Stats about the database
export const foodStats = {
  totalWords: foodWordsData.length,
  byStartingLetter: {} as Record<string, number>,
  byEndingLetter: {} as Record<string, number>
};

// Calculate stats
for (const word of foodWordsData) {
  const start = word[0];
  const end = word[word.length - 1];
  foodStats.byStartingLetter[start] = (foodStats.byStartingLetter[start] || 0) + 1;
  foodStats.byEndingLetter[end] = (foodStats.byEndingLetter[end] || 0) + 1;
}
