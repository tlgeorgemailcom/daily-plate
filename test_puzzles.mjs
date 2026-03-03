import { getPuzzleForDate, PUZZLE_COMBOS } from './src/lib/data/scrambled-puzzles.ts';

// Test puzzle variety over 10 days
console.log('Testing puzzle variety over 10 days:\n');

const dates = [];
for (let i = 0; i < 10; i++) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  dates.push(d);
}

for (const date of dates) {
  const puzzle = getPuzzleForDate(date, 'usda');
  console.log(`${puzzle.date}: ${puzzle.letters.join('').toUpperCase()} (${puzzle.validWords.length} words)`);
  console.log(`  Sample words: ${puzzle.validWords.slice(0, 5).join(', ')}`);
}

// Check for uniqueness
const letterSets = new Set();
for (let i = 0; i < 365; i++) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const puzzle = getPuzzleForDate(d, 'usda');
  letterSets.add(puzzle.letters.join(''));
}
console.log(`\nUnique letter combos in 365 days: ${letterSets.size}`);
