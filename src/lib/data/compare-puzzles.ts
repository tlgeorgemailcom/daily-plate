// Spot the Difference puzzle data
// Coordinates are percentages (0-100) of image dimensions

export interface Difference {
  x: number;        // X position (0-100% of image width)
  y: number;        // Y position (0-100% of image height)
  radius: number;   // Hit detection radius (% of image width)
  found: boolean;   // Runtime state - whether this difference has been found
}

export interface ComparePuzzle {
  id: string;
  imageA: string;   // Path to original image
  imageB: string;   // Path to modified image
  differences: Omit<Difference, 'found'>[];
}

// Puzzle library - add more puzzles here
export const COMPARE_PUZZLES: ComparePuzzle[] = [
  {
    id: 'puzzle-001',
    imageA: '/images/compare/puzzle-001-a.jpg',
    imageB: '/images/compare/puzzle-001-b.jpg',
    differences: [
      { x: 73, y: 21, radius: 8 },  // Difference 1
      { x: 13, y: 47, radius: 8 },  // Difference 2
      { x: 48, y: 65, radius: 8 },  // Difference 3
      { x: 34, y: 7, radius: 8 },   // Difference 4
    ]
  },
  {
    id: 'puzzle-002',
    imageA: '/images/compare/puzzle-002-a.jpg',
    imageB: '/images/compare/puzzle-002-b.jpg',
    differences: [
      { x: 54, y: 11, radius: 8 },  // Difference 1
      { x: 48, y: 29, radius: 8 },  // Difference 2
      { x: 40, y: 66, radius: 8 },  // Difference 3
      { x: 97, y: 50, radius: 8 },  // Difference 4
    ]
  },
  {
    id: 'puzzle-003',
    imageA: '/images/compare/puzzle-003-a.jpg',
    imageB: '/images/compare/puzzle-003-b.jpg',
    differences: [
      { x: 79, y: 50, radius: 8 },  // Difference 1
      { x: 79, y: 26, radius: 8 },  // Difference 2
      { x: 56, y: 24, radius: 8 },  // Difference 3
      { x: 48, y: 47, radius: 8 },  // Difference 4
    ]
  },
  {
    id: 'puzzle-004',
    imageA: '/images/compare/puzzle-004-a.jpg',
    imageB: '/images/compare/puzzle-004-b.jpg',
    differences: [
      { x: 51, y: 88, radius: 8 },  // Difference 1
      { x: 82, y: 38, radius: 8 },  // Difference 2
      { x: 45, y: 75, radius: 8 },  // Difference 3
      { x: 56, y: 67, radius: 8 },  // Difference 4
    ]
  },
  {
    id: 'puzzle-005',
    imageA: '/images/compare/puzzle-005-a.jpg',
    imageB: '/images/compare/puzzle-005-b.jpg',
    differences: [
      { x: 26, y: 55, radius: 8 },  // Difference 1
      { x: 73, y: 34, radius: 8 },  // Difference 2
      { x: 64, y: 22, radius: 8 },  // Difference 3
      { x: 51, y: 73, radius: 8 },  // Difference 4
    ]
  }
];

// Archive start date - puzzles cycle from this date
export const START_DATE = new Date('2026-02-18');

// Get days since start for a given date
function getDaysSinceStart(date: Date): number {
  return Math.floor((date.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
}

// Get puzzle by index (for daily rotation)
export function getDailyPuzzle(): ComparePuzzle {
  const today = new Date();
  const daysSinceStart = getDaysSinceStart(today);
  const puzzleIndex = daysSinceStart % COMPARE_PUZZLES.length;
  return COMPARE_PUZZLES[puzzleIndex];
}

// Get puzzle for a specific date
export function getPuzzleForDate(date: Date): ComparePuzzle | null {
  const daysSinceStart = getDaysSinceStart(date);
  if (daysSinceStart < 0) return null; // Before archive started
  const puzzleIndex = daysSinceStart % COMPARE_PUZZLES.length;
  return COMPARE_PUZZLES[puzzleIndex];
}

// Get all archive dates from start to today
export function getArchiveDates(): { date: Date; dateString: string; puzzle: ComparePuzzle }[] {
  const today = new Date();
  const dates: { date: Date; dateString: string; puzzle: ComparePuzzle }[] = [];
  
  let current = new Date(START_DATE);
  while (current <= today) {
    const puzzle = getPuzzleForDate(current);
    if (puzzle) {
      dates.push({
        date: new Date(current),
        dateString: current.toISOString().split('T')[0], // YYYY-MM-DD
        puzzle
      });
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates.reverse(); // Most recent first
}

// Format date for display
export function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00'); // Noon to avoid timezone issues
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Get puzzle by ID
export function getPuzzleById(id: string): ComparePuzzle | undefined {
  return COMPARE_PUZZLES.find(p => p.id === id);
}

// Check if a click hits any unfound difference
export function checkHit(
  clickX: number, 
  clickY: number, 
  differences: Difference[]
): number {
  // Returns index of hit difference, or -1 if no hit
  // Use a minimum touch-friendly radius of 10% for hit detection
  for (let i = 0; i < differences.length; i++) {
    if (differences[i].found) continue;
    
    const dx = clickX - differences[i].x;
    const dy = clickY - differences[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Hit radius minimum of 10 for touch-friendliness
    const hitRadius = Math.max(differences[i].radius, 10);
    
    if (distance <= hitRadius) {
      return i;
    }
  }
  return -1;
}
