<script lang="ts">
  import { 
    FOOD_DATABASE, 
    getFoodEntry, 
    isValidFood, 
    isDualIdentity,
    GROUP_COLORS,
    GROUP_TEXT_COLORS,
    GROUP_EMOJI,
    GROUP_NAMES,
    type FoodGroup,
    type FoodEntry
  } from '$lib/data/food-database';
  import { fly, scale, fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';

  // Difficulty modes
  type DifficultyMode = 'easy' | 'medium' | 'hard';
  const DIFFICULTY_LABELS: Record<DifficultyMode, string> = {
    easy: 'Easy',
    medium: 'Medium', 
    hard: 'Hard'
  };
  const DIFFICULTY_EMOJI: Record<DifficultyMode, string> = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴'
  };
  const DIFFICULTY_MULTIPLIER: Record<DifficultyMode, number> = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };

  // Types
  interface PlacedWord {
    word: string;
    row: number;
    col: number;
    horizontal: boolean;
    group: FoodGroup; // The group the player chose (for dual-identity foods)
    entry: FoodEntry;
  }

  interface Cell {
    letter: string;
    wordIndices: number[]; // Which placed words use this cell
  }

  // Difficulty state
  let difficultyMode = $state<DifficultyMode | null>(null); // null = show selector
  let showDifficultySelector = $state(true);
  
  // Letter search state (for Medium mode)
  let letterSearchType = $state<'first' | 'last'>('first');
  let letterSearchQuery = $state('');
  let letterSearchResults = $state<string[]>([]);

  // Game state
  let placedWords: PlacedWord[] = $state([]);
  let errorMessage = $state('');
  let showGroupPicker = $state(false);
  let showRules = $state(false);
  let pendingWord = $state<{ word: string; entry: FoodEntry; placement: { row: number; col: number; horizontal: boolean } } | null>(null);
  let editingWordIndex = $state<number | null>(null); // Index of word being edited for group change
  let gameComplete = $state(false);
  let streak = $state(0);
  let showResults = $state(false);
  
  // Click-to-place state
  let selectedCell = $state<{ row: number; col: number } | null>(null);
  let isHorizontal = $state(true);
  let currentTyping = $state('');
  let reverseEntry = $state(false); // true = typing backward (←/↑), false = forward (→/↓)
  
  // Drag state - for dragging words directly on the grid
  let draggingWordIndex = $state<number | null>(null);
  let selectedForMove = $state<number | null>(null); // Word selected for moving from word list
  let dragStartPos = $state<{ row: number; col: number; horizontal: boolean } | null>(null);
  let dragCurrentPos = $state<{ row: number; col: number; horizontal: boolean } | null>(null);
  let dragCascade = $state<number[]>([]); // Words that will move together
  let dragOffset = $state<{ x: number; y: number }>({ x: 0, y: 0 });
  let gridElement: HTMLDivElement | null = $state(null);
  let cellSize = $state(28); // Will be measured from actual grid
  
  // Grid state - dynamic size
  const INITIAL_GRID_SIZE = 15;
  const MAX_GRID_SIZE = 25;
  let gridSize = $state(INITIAL_GRID_SIZE);
  let grid: Cell[][] = $state(
    Array(INITIAL_GRID_SIZE).fill(null).map(() => 
      Array(INITIAL_GRID_SIZE).fill(null).map(() => ({ letter: '', wordIndices: [] }))
    )
  );

  // Score animation
  const animatedScore = tweened(0, { duration: 300 });
  
  // Food groups panel state
  let expandedGroup = $state<FoodGroup | null>(null);
  const ALL_GROUPS: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'spice', 'prepared', 'beverage'];
  
  // Select difficulty mode
  function selectDifficulty(mode: DifficultyMode) {
    difficultyMode = mode;
    showDifficultySelector = false;
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailyPlateDifficulty', mode);
    }
  }
  
  // Load saved difficulty preference on mount
  $effect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailyPlateDifficulty') as DifficultyMode | null;
      if (saved && ['easy', 'medium', 'hard'].includes(saved)) {
        // Don't auto-select, but pre-highlight the saved preference
        // User still needs to confirm their choice each game
      }
    }
  });
  
  // Letter search for Medium mode
  function searchByLetter() {
    if (!letterSearchQuery || letterSearchQuery.length !== 1) {
      letterSearchResults = [];
      return;
    }
    
    const letter = letterSearchQuery.toUpperCase();
    const results: string[] = [];
    
    for (const [word] of FOOD_DATABASE) {
      const match = letterSearchType === 'first' 
        ? word.startsWith(letter)
        : word.endsWith(letter);
      if (match && !placedWords.some(p => p.word === word)) {
        results.push(word);
      }
    }
    
    letterSearchResults = results.sort();
  }
  
  // Clear letter search
  function clearLetterSearch() {
    letterSearchQuery = '';
    letterSearchResults = [];
  }
  
  // Get foods for a specific group
  function getFoodsForGroup(group: FoodGroup): string[] {
    const foods: string[] = [];
    for (const [word, entry] of FOOD_DATABASE) {
      if (entry.groups.includes(group)) {
        foods.push(word);
      }
    }
    return foods.sort();
  }
  
  // Toggle group expansion
  function toggleGroupExpand(group: FoodGroup) {
    expandedGroup = expandedGroup === group ? null : group;
  }
  
  // Insert food word from dropdown list
  function insertFoodFromList(food: string) {
    if (!selectedCell) {
      errorMessage = 'Click a letter on the grid first';
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    // Check if already placed
    if (placedWords.some(p => p.word === food)) {
      errorMessage = 'Already on your plate!';
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    // Check if word fits (would not exceed max grid size)
    if (!canPreviewWord(food)) {
      errorMessage = `"${food}" is too long to fit here`;
      setTimeout(() => errorMessage = '', 2500);
      return;
    }
    
    // Set the word as current typing
    currentTyping = food;
    
    // Close the dropdown
    expandedGroup = null;
  }

  // Daily puzzle - generate starting word from date
  const today = new Date();
  const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const puzzleNumber = dayNumber - 20454; // Starting from a reasonable number

  // Get a consistent starting word for today
  const allWords = Array.from(FOOD_DATABASE.keys());
  const startingWord = allWords[dayNumber % allWords.length];
  const startingEntry = getFoodEntry(startingWord)!;

  // Initialize with starting word
  function initGame() {
    // Reset grid size
    gridSize = INITIAL_GRID_SIZE;
    
    // Place starting word horizontally in center
    const startRow = Math.floor(INITIAL_GRID_SIZE / 2);
    const startCol = Math.floor((INITIAL_GRID_SIZE - startingWord.length) / 2);
    
    // Create fresh grid with starting word already placed
    const newGrid: Cell[][] = Array(INITIAL_GRID_SIZE).fill(null).map(() => 
      Array(INITIAL_GRID_SIZE).fill(null).map(() => ({ letter: '', wordIndices: [] }))
    );
    
    // Place starting word letters directly in the new grid
    for (let i = 0; i < startingWord.length; i++) {
      newGrid[startRow][startCol + i].letter = startingWord[i];
      newGrid[startRow][startCol + i].wordIndices.push(0);
    }
    
    // Now assign to reactive state
    grid = newGrid;
    
    const startingPlaced: PlacedWord = {
      word: startingWord,
      row: startRow,
      col: startCol,
      horizontal: true,
      group: startingEntry.groups[0],
      entry: startingEntry
    };
    
    placedWords = [startingPlaced];
    
    // Load streak from localStorage
    if (typeof window !== 'undefined') {
      streak = parseInt(localStorage.getItem('dailyPlateStreak') || '0');
    }
  }

  function placeWordOnGrid(placed: PlacedWord, index: number) {
    for (let i = 0; i < placed.word.length; i++) {
      const r = placed.horizontal ? placed.row : placed.row + i;
      const c = placed.horizontal ? placed.col + i : placed.col;
      grid[r][c].letter = placed.word[i];
      grid[r][c].wordIndices.push(index);
    }
  }

  // Check if two words share a cell (intersect)
  function wordsIntersect(wordA: PlacedWord, wordB: PlacedWord): boolean {
    const cellsA = new Set<string>();
    for (let i = 0; i < wordA.word.length; i++) {
      const r = wordA.horizontal ? wordA.row : wordA.row + i;
      const c = wordA.horizontal ? wordA.col + i : wordA.col;
      cellsA.add(`${r},${c}`);
    }
    
    for (let i = 0; i < wordB.word.length; i++) {
      const r = wordB.horizontal ? wordB.row : wordB.row + i;
      const c = wordB.horizontal ? wordB.col + i : wordB.col;
      if (cellsA.has(`${r},${c}`)) return true;
    }
    return false;
  }

  // Check if all words remain connected after removing one
  function canDeleteWord(indexToDelete: number): boolean {
    if (indexToDelete === 0) return false;
    
    const remaining = placedWords.filter((_, i) => i !== indexToDelete);
    if (remaining.length <= 1) return true; // Only starting word left
    
    // Build adjacency - which words connect to which
    const connections: Map<number, Set<number>> = new Map();
    remaining.forEach((_, i) => connections.set(i, new Set()));
    
    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        if (wordsIntersect(remaining[i], remaining[j])) {
          connections.get(i)!.add(j);
          connections.get(j)!.add(i);
        }
      }
    }
    
    // BFS from word 0 (starting word) - can we reach all other words?
    const visited = new Set<number>([0]);
    const queue = [0];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of connections.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    // All remaining words should be reachable from the starting word
    return visited.size === remaining.length;
  }

  // Delete a placed word (can't delete the starting word at index 0)
  function deleteWord(index: number) {
    if (index === 0) {
      errorMessage = "Can't delete the starting word";
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    // Check if deleting would disconnect other words
    if (!canDeleteWord(index)) {
      errorMessage = "Can't delete - other words depend on it";
      setTimeout(() => errorMessage = '', 2500);
      return;
    }
    
    // Cancel any current typing
    cancelTyping();
    
    // Remove from placedWords
    const newPlacedWords = placedWords.filter((_, i) => i !== index);
    
    // Rebuild the grid from scratch (use current grid dimensions)
    const currentRows = grid.length;
    const currentCols = grid[0]?.length || gridSize;
    const newGrid: Cell[][] = Array(currentRows).fill(null).map(() => 
      Array(currentCols).fill(null).map(() => ({ letter: '', wordIndices: [] }))
    );
    
    // Re-place all remaining words with updated indices
    newPlacedWords.forEach((placed, newIndex) => {
      for (let i = 0; i < placed.word.length; i++) {
        const r = placed.horizontal ? placed.row : placed.row + i;
        const c = placed.horizontal ? placed.col + i : placed.col;
        newGrid[r][c].letter = placed.word[i];
        newGrid[r][c].wordIndices.push(newIndex);
      }
    });
    
    grid = newGrid;
    placedWords = newPlacedWords;
  }

  // ========== DRAG WORD ON GRID FUNCTIONS ==========
  
  // Helper to check if two word positions intersect (share a cell)
  function positionsIntersect(
    a: { row: number; col: number; horizontal: boolean; word: string },
    b: { row: number; col: number; horizontal: boolean; word: string }
  ): boolean {
    const aCells = new Set<string>();
    for (let i = 0; i < a.word.length; i++) {
      const r = a.horizontal ? a.row : a.row + i;
      const c = a.horizontal ? a.col + i : a.col;
      aCells.add(`${r},${c}`);
    }
    for (let i = 0; i < b.word.length; i++) {
      const r = b.horizontal ? b.row : b.row + i;
      const c = b.horizontal ? b.col + i : b.col;
      if (aCells.has(`${r},${c}`)) return true;
    }
    return false;
  }
  
  // Find words that depend on a given word (only reachable through it)
  function findDependentWords(wordIndex: number): Set<number> {
    if (placedWords.length <= 2) return new Set();
    
    // Build current adjacency list
    const connections: Set<number>[] = placedWords.map(() => new Set<number>());
    for (let i = 0; i < placedWords.length; i++) {
      for (let j = i + 1; j < placedWords.length; j++) {
        const posA = { row: placedWords[i].row, col: placedWords[i].col, horizontal: placedWords[i].horizontal, word: placedWords[i].word };
        const posB = { row: placedWords[j].row, col: placedWords[j].col, horizontal: placedWords[j].horizontal, word: placedWords[j].word };
        if (positionsIntersect(posA, posB)) {
          connections[i].add(j);
          connections[j].add(i);
        }
      }
    }
    
    // BFS from starter, but NOT going through the moving word
    const reachableWithout = new Set<number>();
    const queue = [0];
    reachableWithout.add(0);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of connections[current]) {
        if (neighbor !== wordIndex && !reachableWithout.has(neighbor)) {
          reachableWithout.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    // Words NOT reachable without the moving word are dependents
    const dependents = new Set<number>();
    for (let i = 1; i < placedWords.length; i++) {
      if (i !== wordIndex && !reachableWithout.has(i)) {
        dependents.add(i);
      }
    }
    return dependents;
  }
  
  // Find the nearest valid position for the dragged word
  function findNearestValidPosition(
    wordIndex: number, 
    targetRow: number, 
    targetCol: number,
    preferHorizontal: boolean
  ): { row: number; col: number; horizontal: boolean } | null {
    const word = placedWords[wordIndex];
    if (!word) return null;
    
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    
    // Find dependent words first - they will move with this word
    const dependents = findDependentWords(wordIndex);
    
    // Get cells occupied by ANCHOR words (not moving word, not dependents)
    const anchorWordCells = new Map<string, string>();
    placedWords.forEach((placed, idx) => {
      if (idx === wordIndex || dependents.has(idx)) return; // Skip moving word and its dependents
      for (let i = 0; i < placed.word.length; i++) {
        const r = placed.horizontal ? placed.row : placed.row + i;
        const c = placed.horizontal ? placed.col + i : placed.col;
        anchorWordCells.set(`${r},${c}`, placed.word[i]);
      }
    });
    
    // Check if a position is valid (no conflicts, proper crossing with ANCHOR words)
    function isValidPosition(startRow: number, startCol: number, horizontal: boolean): boolean {
      const endRow = horizontal ? startRow : startRow + word.word.length - 1;
      const endCol = horizontal ? startCol + word.word.length - 1 : startCol;
      
      if (startRow < 0 || startCol < 0 || endRow >= rows || endCol >= cols) return false;
      
      let hasValidCrossing = false;
      
      // First pass: check for letter conflicts and valid crossings with anchor words
      for (let i = 0; i < word.word.length; i++) {
        const r = horizontal ? startRow : startRow + i;
        const c = horizontal ? startCol + i : startCol;
        const key = `${r},${c}`;
        const wordLetter = word.word[i];
        
        if (anchorWordCells.has(key)) {
          const existingLetter = anchorWordCells.get(key)!;
          if (existingLetter === wordLetter) {
            hasValidCrossing = true;
          } else {
            return false; // Letter conflict
          }
        }
      }
      
      if (!hasValidCrossing) return false;
      
      // Second pass: check for invalid adjacencies (parallel touching without crossing)
      for (let i = 0; i < word.word.length; i++) {
        const r = horizontal ? startRow : startRow + i;
        const c = horizontal ? startCol + i : startCol;
        const key = `${r},${c}`;
        
        // If this cell already has a valid crossing, skip adjacency check for it
        if (anchorWordCells.has(key)) continue;
        
        // Check adjacent cells perpendicular to word direction
        const adjacentCells = horizontal 
          ? [[r - 1, c], [r + 1, c]] // Check above and below for horizontal word
          : [[r, c - 1], [r, c + 1]]; // Check left and right for vertical word
        
        for (const [ar, ac] of adjacentCells) {
          const adjKey = `${ar},${ac}`;
          if (anchorWordCells.has(adjKey)) {
            // This cell touches another word without crossing - invalid!
            return false;
          }
        }
      }
      
      // Also check the cells immediately before and after the word
      // (to prevent words from touching end-to-end)
      const beforeRow = horizontal ? startRow : startRow - 1;
      const beforeCol = horizontal ? startCol - 1 : startCol;
      const afterRow = horizontal ? startRow : endRow + 1;
      const afterCol = horizontal ? endCol + 1 : startCol;
      
      if (beforeRow >= 0 && beforeCol >= 0) {
        const beforeKey = `${beforeRow},${beforeCol}`;
        if (anchorWordCells.has(beforeKey)) return false;
      }
      
      if (afterRow < rows && afterCol < cols) {
        const afterKey = `${afterRow},${afterCol}`;
        if (anchorWordCells.has(afterKey)) return false;
      }
      
      return true;
    }
    
    // Search in expanding radius from target position
    const maxRadius = Math.max(rows, cols);
    const orientations = preferHorizontal ? [true, false] : [false, true];
    
    for (let radius = 0; radius <= maxRadius; radius++) {
      for (const horizontal of orientations) {
        for (let dr = -radius; dr <= radius; dr++) {
          for (let dc = -radius; dc <= radius; dc++) {
            if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue; // Only check perimeter
            
            const r = targetRow + dr;
            const c = targetCol + dc;
            
            if (isValidPosition(r, c, horizontal)) {
              // Also check that all words remain connected after this move (with cascade)
              if (getMoveCascade(wordIndex, r, c, horizontal) !== null) {
                return { row: r, col: c, horizontal };
              }
            }
          }
        }
      }
    }
    
    return null;
  }
  
  // Check if moving a word to a new position would keep all words connected
  // Returns the list of word indices that need to move together (cascade), or null if invalid
  function getMoveCascade(
    movingWordIndex: number,
    newRow: number,
    newCol: number,
    newHorizontal: boolean
  ): number[] | null {
    if (placedWords.length <= 1) return [movingWordIndex];
    
    const movingWord = placedWords[movingWordIndex];
    const deltaRow = newRow - movingWord.row;
    const deltaCol = newCol - movingWord.col;
    const orientationChanged = newHorizontal !== movingWord.horizontal;
    
    // Helper to check if two word positions intersect
    function positionsIntersect(
      a: { row: number; col: number; horizontal: boolean; word: string },
      b: { row: number; col: number; horizontal: boolean; word: string }
    ): boolean {
      const aCells = new Set<string>();
      for (let i = 0; i < a.word.length; i++) {
        const r = a.horizontal ? a.row : a.row + i;
        const c = a.horizontal ? a.col + i : a.col;
        aCells.add(`${r},${c}`);
      }
      for (let i = 0; i < b.word.length; i++) {
        const r = b.horizontal ? b.row : b.row + i;
        const c = b.horizontal ? b.col + i : b.col;
        if (aCells.has(`${r},${c}`)) return true;
      }
      return false;
    }
    
    // Build current adjacency list (before move)
    const currentConnections: Set<number>[] = placedWords.map(() => new Set<number>());
    for (let i = 0; i < placedWords.length; i++) {
      for (let j = i + 1; j < placedWords.length; j++) {
        const posA = { row: placedWords[i].row, col: placedWords[i].col, horizontal: placedWords[i].horizontal, word: placedWords[i].word };
        const posB = { row: placedWords[j].row, col: placedWords[j].col, horizontal: placedWords[j].horizontal, word: placedWords[j].word };
        if (positionsIntersect(posA, posB)) {
          currentConnections[i].add(j);
          currentConnections[j].add(i);
        }
      }
    }
    
    // Find words that are ONLY reachable through the moving word
    // These need to move along with it
    function findDependents(excludeWord: number): Set<number> {
      // BFS from starter, but NOT going through the moving word
      const reachableWithout = new Set<number>();
      const queue = [0];
      reachableWithout.add(0);
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        for (const neighbor of currentConnections[current]) {
          if (neighbor !== excludeWord && !reachableWithout.has(neighbor)) {
            reachableWithout.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      
      // Words NOT reachable without the moving word are dependents
      const dependents = new Set<number>();
      for (let i = 1; i < placedWords.length; i++) { // Skip starter (0)
        if (i !== excludeWord && !reachableWithout.has(i)) {
          dependents.add(i);
        }
      }
      return dependents;
    }
    
    const dependents = findDependents(movingWordIndex);
    const cascadeWords = [movingWordIndex, ...dependents];
    
    // If orientation changes, cascade is more complex - for now just move the single word
    // and only allow if no dependents
    if (orientationChanged && dependents.size > 0) {
      return null; // Can't rotate a word with dependents
    }
    
    // Calculate new positions for all cascade words
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    
    const newPositions: Array<{ row: number; col: number; horizontal: boolean; word: string }> = 
      placedWords.map((placed, idx) => {
        if (idx === movingWordIndex) {
          return { row: newRow, col: newCol, horizontal: newHorizontal, word: placed.word };
        } else if (dependents.has(idx)) {
          // Move by same delta
          return { 
            row: placed.row + deltaRow, 
            col: placed.col + deltaCol, 
            horizontal: placed.horizontal, 
            word: placed.word 
          };
        }
        return { row: placed.row, col: placed.col, horizontal: placed.horizontal, word: placed.word };
      });
    
    // Validate all new positions are within bounds
    for (const pos of newPositions) {
      const endRow = pos.horizontal ? pos.row : pos.row + pos.word.length - 1;
      const endCol = pos.horizontal ? pos.col + pos.word.length - 1 : pos.col;
      if (pos.row < 0 || pos.col < 0 || endRow >= rows || endCol >= cols) {
        return null; // Out of bounds
      }
    }
    
    // Check for letter conflicts between cascade words and non-cascade words
    const nonCascadeCells = new Map<string, string>();
    newPositions.forEach((pos, idx) => {
      if (!cascadeWords.includes(idx)) {
        for (let i = 0; i < pos.word.length; i++) {
          const r = pos.horizontal ? pos.row : pos.row + i;
          const c = pos.horizontal ? pos.col + i : pos.col;
          nonCascadeCells.set(`${r},${c}`, pos.word[i]);
        }
      }
    });
    
    // Check cascade words don't conflict with non-cascade words
    for (const wordIdx of cascadeWords) {
      const pos = newPositions[wordIdx];
      for (let i = 0; i < pos.word.length; i++) {
        const r = pos.horizontal ? pos.row : pos.row + i;
        const c = pos.horizontal ? pos.col + i : pos.col;
        const key = `${r},${c}`;
        if (nonCascadeCells.has(key) && nonCascadeCells.get(key) !== pos.word[i]) {
          return null; // Letter conflict
        }
      }
    }
    
    // Check that moving word still crosses at least one non-cascade word
    const movingPos = newPositions[movingWordIndex];
    let hasValidCrossing = false;
    for (let i = 0; i < placedWords.length; i++) {
      if (!cascadeWords.includes(i)) {
        if (positionsIntersect(movingPos, newPositions[i])) {
          hasValidCrossing = true;
          break;
        }
      }
    }
    if (!hasValidCrossing) return null;
    
    // Build a map of ALL cells occupied by cascade words (to detect internal crossings)
    const cascadeCells = new Map<string, string[]>(); // key -> list of word letters at that cell
    for (const wordIdx of cascadeWords) {
      const pos = newPositions[wordIdx];
      for (let i = 0; i < pos.word.length; i++) {
        const r = pos.horizontal ? pos.row : pos.row + i;
        const c = pos.horizontal ? pos.col + i : pos.col;
        const key = `${r},${c}`;
        if (!cascadeCells.has(key)) cascadeCells.set(key, []);
        cascadeCells.get(key)!.push(pos.word[i]);
      }
    }
    
    // Check adjacency rules for cascade words against non-cascade words
    for (const wordIdx of cascadeWords) {
      const pos = newPositions[wordIdx];
      for (let i = 0; i < pos.word.length; i++) {
        const r = pos.horizontal ? pos.row : pos.row + i;
        const c = pos.horizontal ? pos.col + i : pos.col;
        const key = `${r},${c}`;
        
        // If this cell has a valid crossing with non-cascade word, skip
        if (nonCascadeCells.has(key)) continue;
        
        // If this cell is shared by multiple cascade words (internal crossing), skip
        const cellLetters = cascadeCells.get(key) || [];
        if (cellLetters.length > 1) continue;
        
        // Check perpendicular adjacent cells
        const adjacentCells = pos.horizontal 
          ? [[r - 1, c], [r + 1, c]]
          : [[r, c - 1], [r, c + 1]];
        
        for (const [ar, ac] of adjacentCells) {
          const adjKey = `${ar},${ac}`;
          if (nonCascadeCells.has(adjKey)) {
            return null; // Invalid adjacency
          }
        }
      }
      
      // Check end-to-end touching
      const endRow = pos.horizontal ? pos.row : pos.row + pos.word.length - 1;
      const endCol = pos.horizontal ? pos.col + pos.word.length - 1 : pos.col;
      const beforeKey = `${pos.horizontal ? pos.row : pos.row - 1},${pos.horizontal ? pos.col - 1 : pos.col}`;
      const afterKey = `${pos.horizontal ? pos.row : endRow + 1},${pos.horizontal ? endCol + 1 : pos.col}`;
      
      if (nonCascadeCells.has(beforeKey) || nonCascadeCells.has(afterKey)) {
        return null;
      }
    }
    
    // Verify all words are still connected after the move
    const newConnections: Set<number>[] = newPositions.map(() => new Set<number>());
    for (let i = 0; i < newPositions.length; i++) {
      for (let j = i + 1; j < newPositions.length; j++) {
        if (positionsIntersect(newPositions[i], newPositions[j])) {
          newConnections[i].add(j);
          newConnections[j].add(i);
        }
      }
    }
    
    const visited = new Set<number>();
    const queue = [0];
    visited.add(0);
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of newConnections[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    if (visited.size !== newPositions.length) {
      return null; // Not all words connected
    }
    
    return cascadeWords;
  }
  
  // Start dragging a word from the grid
  function startDragFromGrid(wordIndex: number, e: MouseEvent | TouchEvent) {
    if (wordIndex === 0 || gameComplete) return; // Can't drag starter word
    if (selectedForMove !== wordIndex) return; // Can only drag the word that's selected for move
    
    // Cancel any typing mode
    if (selectedCell) {
      cancelTyping();
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const word = placedWords[wordIndex];
    draggingWordIndex = wordIndex;
    dragStartPos = { row: word.row, col: word.col, horizontal: word.horizontal };
    dragCurrentPos = { ...dragStartPos };
    
    // Store initial touch/mouse position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    (window as any)._dragStartX = clientX;
    (window as any)._dragStartY = clientY;
    
    // Measure cell size
    if (gridElement) {
      const firstCell = gridElement.querySelector('.cell') as HTMLElement;
      if (firstCell) {
        cellSize = firstCell.offsetWidth + 2; // Include gap
      }
    }
  }
  
  // Handle drag movement
  function handleDragMove(e: MouseEvent | TouchEvent) {
    if (draggingWordIndex === null || !dragStartPos) return;
    
    // Prevent page scrolling on touch devices
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const startX = (window as any)._dragStartX || clientX;
    const startY = (window as any)._dragStartY || clientY;
    
    dragOffset = {
      x: clientX - startX,
      y: clientY - startY
    };
    
    // Calculate target grid position
    const cellDeltaX = Math.round(dragOffset.x / cellSize);
    const cellDeltaY = Math.round(dragOffset.y / cellSize);
    
    const targetRow = dragStartPos.row + cellDeltaY;
    const targetCol = dragStartPos.col + cellDeltaX;
    
    // Find nearest valid position
    const newPos = findNearestValidPosition(
      draggingWordIndex, 
      targetRow, 
      targetCol, 
      dragStartPos.horizontal
    );
    
    if (newPos) {
      dragCurrentPos = newPos;
      // Update cascade to show which words will move together
      const cascade = getMoveCascade(draggingWordIndex, newPos.row, newPos.col, newPos.horizontal);
      dragCascade = cascade || [draggingWordIndex];
    }
  }
  
  // End drag and apply the move
  function handleDragEnd() {
    if (draggingWordIndex === null || !dragStartPos || !dragCurrentPos) {
      resetDragState();
      return;
    }
    
    const wordIndex = draggingWordIndex;
    const newPosition = dragCurrentPos;
    
    // Check if position actually changed
    const changed = 
      newPosition.row !== dragStartPos.row ||
      newPosition.col !== dragStartPos.col ||
      newPosition.horizontal !== dragStartPos.horizontal;
    
    if (changed) {
      // Get all words that need to move together (cascade)
      const cascade = getMoveCascade(wordIndex, newPosition.row, newPosition.col, newPosition.horizontal);
      
      if (cascade && cascade.length > 0) {
        const movingWord = placedWords[wordIndex];
        const deltaRow = newPosition.row - movingWord.row;
        const deltaCol = newPosition.col - movingWord.col;
        
        // Move the primary word
        moveWordToPosition(wordIndex, newPosition);
        
        // Move dependent words by the same delta
        for (const depIdx of cascade) {
          if (depIdx !== wordIndex) {
            const depWord = placedWords[depIdx];
            moveWordToPosition(depIdx, {
              row: depWord.row + deltaRow,
              col: depWord.col + deltaCol,
              horizontal: depWord.horizontal
            });
          }
        }
      }
    }
    
    resetDragState();
  }
  
  function resetDragState() {
    draggingWordIndex = null;
    selectedForMove = null; // Clear move mode
    dragStartPos = null;
    dragCurrentPos = null;
    dragCascade = [];
    dragOffset = { x: 0, y: 0 };
    delete (window as any)._dragStartX;
    delete (window as any)._dragStartY;
  }
  
  // Toggle move mode for a word (activated from word list)
  function toggleMoveMode(wordIndex: number) {
    if (wordIndex === 0 || gameComplete) return; // Can't move starter word
    
    // Cancel any typing mode
    if (selectedCell) {
      cancelTyping();
    }
    
    if (selectedForMove === wordIndex) {
      // Already selected, cancel move mode
      selectedForMove = null;
    } else {
      // Select this word for moving
      selectedForMove = wordIndex;
    }
  }
  
  // Move a word to a new position on the grid
  function moveWordToPosition(wordIndex: number, newPosition: { row: number; col: number; horizontal: boolean }) {
    const word = placedWords[wordIndex];
    if (!word) return;
    
    // Clear old position from grid
    for (let i = 0; i < word.word.length; i++) {
      const r = word.horizontal ? word.row : word.row + i;
      const c = word.horizontal ? word.col + i : word.col;
      grid[r][c].wordIndices = grid[r][c].wordIndices.filter(idx => idx !== wordIndex);
      if (grid[r][c].wordIndices.length === 0) {
        grid[r][c].letter = '';
      }
    }
    
    // Update word position
    placedWords[wordIndex] = {
      ...word,
      row: newPosition.row,
      col: newPosition.col,
      horizontal: newPosition.horizontal
    };
    
    // Place at new position
    for (let i = 0; i < word.word.length; i++) {
      const r = newPosition.horizontal ? newPosition.row : newPosition.row + i;
      const c = newPosition.horizontal ? newPosition.col + i : newPosition.col;
      grid[r][c].letter = word.word[i];
      if (!grid[r][c].wordIndices.includes(wordIndex)) {
        grid[r][c].wordIndices.push(wordIndex);
      }
    }
    
    grid = [...grid];
    placedWords = [...placedWords];
  }
  
  // Check if a cell is part of the word being dragged
  function isCellBeingDragged(r: number, c: number): boolean {
    if (draggingWordIndex === null || !dragStartPos) return false;
    
    // Check the primary dragging word
    const word = placedWords[draggingWordIndex];
    if (word) {
      for (let i = 0; i < word.word.length; i++) {
        const wr = word.horizontal ? word.row : word.row + i;
        const wc = word.horizontal ? word.col + i : word.col;
        if (wr === r && wc === c) return true;
      }
    }
    
    // Check cascade words (dependent words that move together)
    for (const idx of dragCascade) {
      if (idx === draggingWordIndex) continue;
      const depWord = placedWords[idx];
      if (depWord) {
        for (let i = 0; i < depWord.word.length; i++) {
          const wr = depWord.horizontal ? depWord.row : depWord.row + i;
          const wc = depWord.horizontal ? depWord.col + i : depWord.col;
          if (wr === r && wc === c) return true;
        }
      }
    }
    
    return false;
  }
  
  // Check if a cell is in the drag preview position
  function isCellDragPreview(r: number, c: number): { inPreview: boolean; letter: string } {
    if (draggingWordIndex === null || !dragCurrentPos || !dragStartPos) return { inPreview: false, letter: '' };
    
    const movingWord = placedWords[draggingWordIndex];
    if (!movingWord) return { inPreview: false, letter: '' };
    
    const deltaRow = dragCurrentPos.row - dragStartPos.row;
    const deltaCol = dragCurrentPos.col - dragStartPos.col;
    
    // Check the primary dragging word preview
    for (let i = 0; i < movingWord.word.length; i++) {
      const wr = dragCurrentPos.horizontal ? dragCurrentPos.row : dragCurrentPos.row + i;
      const wc = dragCurrentPos.horizontal ? dragCurrentPos.col + i : dragCurrentPos.col;
      if (wr === r && wc === c) {
        return { inPreview: true, letter: movingWord.word[i] };
      }
    }
    
    // Check cascade words preview (shifted by same delta)
    for (const idx of dragCascade) {
      if (idx === draggingWordIndex) continue;
      const depWord = placedWords[idx];
      if (depWord) {
        for (let i = 0; i < depWord.word.length; i++) {
          const wr = depWord.horizontal ? depWord.row + deltaRow : depWord.row + deltaRow + i;
          const wc = depWord.horizontal ? depWord.col + deltaCol + i : depWord.col + deltaCol;
          if (wr === r && wc === c) {
            return { inPreview: true, letter: depWord.word[i] };
          }
        }
      }
    }
    
    return { inPreview: false, letter: '' };
  }
  
  // Get which word index a cell belongs to (for starting drag)
  function getMovableWordAtCell(row: number, col: number): number | null {
    const cell = grid[row][col];
    if (cell.letter === '' || cell.wordIndices.length === 0) return null;
    
    // Find a movable word (not the starter, index > 0)
    for (const idx of cell.wordIndices) {
      if (idx > 0) return idx;
    }
    return null;
  }
  
  // Check if a cell belongs to the word selected for move
  function isCellSelectedForMove(row: number, col: number): boolean {
    if (selectedForMove === null) return false;
    const cell = grid[row][col];
    return cell.wordIndices.includes(selectedForMove);
  }
  // ========== END DRAG FUNCTIONS ==========

  // Click on a cell to start typing from there
  function handleCellClick(row: number, col: number) {
    if (gameComplete) return;
    if (draggingWordIndex !== null) return; // Don't handle click while dragging
    if (selectedForMove !== null) return; // Don't open keyboard in move mode
    
    const cell = grid[row][col];
    
    // Normal typing mode - can only start from an existing letter
    if (cell.letter === '') {
      errorMessage = 'Click on an existing letter to start';
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    // Set selection
    selectedCell = { row, col };
    currentTyping = ''; // Start fresh - user types the full word
    
    // Focus hidden input for mobile keyboard immediately (must be in user gesture context)
    focusMobileInput();
    
    // Determine direction - perpendicular to existing word if possible
    const existingWord = placedWords[cell.wordIndices[0]];
    if (existingWord) {
      isHorizontal = !existingWord.horizontal; // Cross perpendicular
    }
  }

  // Toggle direction
  function toggleDirection() {
    if (!selectedCell) return;
    // Cycle through: → ↓ ← ↑
    if (isHorizontal && !reverseEntry) {
      // → to ↓
      isHorizontal = false;
      reverseEntry = false;
    } else if (!isHorizontal && !reverseEntry) {
      // ↓ to ←
      isHorizontal = true;
      reverseEntry = true;
    } else if (isHorizontal && reverseEntry) {
      // ← to ↑
      isHorizontal = false;
      reverseEntry = true;
    } else {
      // ↑ to →
      isHorizontal = true;
      reverseEntry = false;
    }
  }
  
  // Direction arrow based on orientation and reverse mode
  let directionArrow = $derived.by(() => {
    if (isHorizontal) {
      return reverseEntry ? '←' : '→';
    } else {
      return reverseEntry ? '↑' : '↓';
    }
  });
  
  // Toggle between forward and reverse entry
  function toggleReverseEntry() {
    reverseEntry = !reverseEntry;
  }

  // Handle typing (called from window keydown)
  function handleKeydown(e: KeyboardEvent) {
    // Handle escape to cancel drag mode
    if (e.key === 'Escape' && draggingWordIndex !== null) {
      resetDragState();
      e.preventDefault();
      return;
    }
    
    if (!selectedCell) return;
    
    // Prevent default for keys we handle
    if (['Escape', 'Enter', 'Backspace', 'Tab'].includes(e.key) || 
        (e.key.length === 1 && /[a-zA-Z]/.test(e.key))) {
      e.preventDefault();
    }
    
    if (e.key === 'Escape') {
      cancelTyping();
      return;
    }
    
    if (e.key === 'Enter') {
      submitTypedWord();
      return;
    }
    
    if (e.key === 'Backspace') {
      if (currentTyping.length > 0) {
        currentTyping = currentTyping.slice(0, -1);
      }
      return;
    }
    
    if (e.key === 'Tab') {
      toggleDirection();
      return;
    }
    
    // Only allow letters
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      const newLetter = e.key.toUpperCase();
      const newWord = currentTyping + newLetter;
      
      // Check if placement is valid
      if (canPreviewWord(newWord)) {
        currentTyping = newWord;
      }
    }
  }

  // Expand grid in a direction if needed
  function expandGrid(direction: 'top' | 'bottom' | 'left' | 'right', amount: number) {
    if (amount <= 0) return;
    
    const newSize = gridSize + amount;
    if (newSize > MAX_GRID_SIZE) return; // Don't expand beyond max
    
    if (direction === 'bottom') {
      // Add rows at bottom
      for (let i = 0; i < amount; i++) {
        grid.push(Array(gridSize).fill(null).map(() => ({ letter: '', wordIndices: [] })));
      }
      gridSize = grid.length;
    } else if (direction === 'right') {
      // Add columns at right
      for (const row of grid) {
        for (let i = 0; i < amount; i++) {
          row.push({ letter: '', wordIndices: [] });
        }
      }
      gridSize = grid[0].length;
    } else if (direction === 'top') {
      // Add rows at top - need to shift all coordinates
      for (let i = 0; i < amount; i++) {
        grid.unshift(Array(grid[0]?.length || gridSize).fill(null).map(() => ({ letter: '', wordIndices: [] })));
      }
      // Update all placed word positions and selected cell
      placedWords = placedWords.map(w => ({ ...w, row: w.row + amount }));
      if (selectedCell) {
        selectedCell = { row: selectedCell.row + amount, col: selectedCell.col };
      }
      // Update wordIndices in grid cells (they stay the same, just positions shifted)
      gridSize = grid.length;
    } else if (direction === 'left') {
      // Add columns at left - need to shift all coordinates
      for (const row of grid) {
        for (let i = 0; i < amount; i++) {
          row.unshift({ letter: '', wordIndices: [] });
        }
      }
      // Update all placed word positions and selected cell
      placedWords = placedWords.map(w => ({ ...w, col: w.col + amount }));
      if (selectedCell) {
        selectedCell = { row: selectedCell.row, col: selectedCell.col + amount };
      }
      gridSize = grid[0].length;
    }
    
    // Rebuild grid letter content from placedWords after expansion
    rebuildGridFromWords();
  }
  
  // Rebuild the grid content from placed words
  function rebuildGridFromWords() {
    // Clear all letters
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        grid[r][c] = { letter: '', wordIndices: [] };
      }
    }
    // Re-place all words
    placedWords.forEach((placed, index) => {
      for (let i = 0; i < placed.word.length; i++) {
        const r = placed.horizontal ? placed.row : placed.row + i;
        const c = placed.horizontal ? placed.col + i : placed.col;
        if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
          grid[r][c].letter = placed.word[i];
          grid[r][c].wordIndices.push(index);
        }
      }
    });
  }

  // Check if the current word preview fits (and expand grid if needed)
  function canPreviewWord(word: string): boolean {
    if (!selectedCell) return false;
    
    // Find which letter index we're starting from
    const anchorLetter = grid[selectedCell.row][selectedCell.col].letter;
    const letterIndex = word.toUpperCase().indexOf(anchorLetter);
    
    // If anchor letter not in word yet, allow typing (we'll validate on submit)
    if (letterIndex === -1) return true;
    
    // Calculate start position
    const startRow = isHorizontal ? selectedCell.row : selectedCell.row - letterIndex;
    const startCol = isHorizontal ? selectedCell.col - letterIndex : selectedCell.col;
    
    // Calculate end position
    const endRow = isHorizontal ? startRow : startRow + word.length - 1;
    const endCol = isHorizontal ? startCol + word.length - 1 : startCol;
    
    // Check if we need to expand and can expand
    const currentRows = grid.length;
    const currentCols = grid[0]?.length || gridSize;
    
    // Calculate needed expansions
    const needTop = startRow < 0 ? -startRow : 0;
    const needBottom = endRow >= currentRows ? endRow - currentRows + 1 : 0;
    const needLeft = startCol < 0 ? -startCol : 0;
    const needRight = endCol >= currentCols ? endCol - currentCols + 1 : 0;
    
    // Check if total size would exceed max
    const newRows = currentRows + needTop + needBottom;
    const newCols = currentCols + needLeft + needRight;
    if (newRows > MAX_GRID_SIZE || newCols > MAX_GRID_SIZE) {
      return false; // Can't expand further
    }
    
    // Expand as needed
    if (needTop > 0) expandGrid('top', needTop);
    if (needBottom > 0) expandGrid('bottom', needBottom);
    if (needLeft > 0) expandGrid('left', needLeft);
    if (needRight > 0) expandGrid('right', needRight);
    
    // After expansion, recalculate positions (selectedCell may have shifted)
    const newStartRow = isHorizontal ? selectedCell.row : selectedCell.row - letterIndex;
    const newStartCol = isHorizontal ? selectedCell.col - letterIndex : selectedCell.col;
    
    // Check conflicts with existing letters
    for (let i = 0; i < word.length; i++) {
      const r = isHorizontal ? newStartRow : newStartRow + i;
      const c = isHorizontal ? newStartCol + i : newStartCol;
      
      const cell = grid[r]?.[c];
      if (cell && cell.letter !== '' && cell.letter !== word[i]) return false;
    }
    
    return true;
  }

  // Check for invalid adjacencies when placing a word
  // Returns error message if invalid, null if OK
  function checkInvalidAdjacencies(word: string, startRow: number, startCol: number, horizontal: boolean): string | null {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    
    for (let i = 0; i < word.length; i++) {
      const r = horizontal ? startRow : startRow + i;
      const c = horizontal ? startCol + i : startCol;
      
      // Skip cells that are intentional crossings (already have a letter)
      if (grid[r]?.[c]?.letter !== '') continue;
      
      // For new cells, check perpendicular neighbors
      // Horizontal word: check cells above and below
      // Vertical word: check cells left and right
      if (horizontal) {
        // Check above
        if (r > 0 && grid[r - 1]?.[c]?.letter !== '') {
          // There's a letter above - is it part of a vertical word that crosses here?
          // If not, this creates an invalid adjacency
          const aboveCell = grid[r - 1][c];
          const crossesHere = aboveCell.wordIndices.some(idx => {
            const w = placedWords[idx];
            if (!w || w.horizontal) return false; // Only check vertical words
            // Does this vertical word extend to our row?
            const wordEndRow = w.row + w.word.length - 1;
            return r >= w.row && r <= wordEndRow;
          });
          if (!crossesHere) {
            return 'Word creates invalid adjacent letters';
          }
        }
        // Check below
        if (r < rows - 1 && grid[r + 1]?.[c]?.letter !== '') {
          const belowCell = grid[r + 1][c];
          const crossesHere = belowCell.wordIndices.some(idx => {
            const w = placedWords[idx];
            if (!w || w.horizontal) return false;
            // The row r must actually be within the vertical word's row range to be a valid crossing
            const wordEndRow = w.row + w.word.length - 1;
            return r >= w.row && r <= wordEndRow;
          });
          if (!crossesHere) {
            return 'Word creates invalid adjacent letters';
          }
        }
      } else {
        // Vertical word: check left and right
        // Check left
        if (c > 0 && grid[r]?.[c - 1]?.letter !== '') {
          const leftCell = grid[r][c - 1];
          const crossesHere = leftCell.wordIndices.some(idx => {
            const w = placedWords[idx];
            if (!w || !w.horizontal) return false; // Only check horizontal words
            // The cell c must actually be within the horizontal word's column range to be a valid crossing
            const wordEndCol = w.col + w.word.length - 1;
            return c >= w.col && c <= wordEndCol;
          });
          if (!crossesHere) {
            return 'Word creates invalid adjacent letters';
          }
        }
        // Check right
        if (c < cols - 1 && grid[r]?.[c + 1]?.letter !== '') {
          const rightCell = grid[r][c + 1];
          const crossesHere = rightCell.wordIndices.some(idx => {
            const w = placedWords[idx];
            if (!w || !w.horizontal) return false;
            // The cell c must actually be within the horizontal word's column range to be a valid crossing
            const wordEndCol = w.col + w.word.length - 1;
            return c >= w.col && c <= wordEndCol;
          });
          if (!crossesHere) {
            return 'Word creates invalid adjacent letters';
          }
        }
      }
    }
    
    // Also check the cells immediately before and after the word
    // to ensure we don't extend an existing word unintentionally
    if (horizontal) {
      // Check cell before word start
      const beforeCol = startCol - 1;
      if (beforeCol >= 0 && grid[startRow]?.[beforeCol]?.letter !== '') {
        return 'Word extends another word';
      }
      // Check cell after word end
      const afterCol = startCol + word.length;
      if (afterCol < cols && grid[startRow]?.[afterCol]?.letter !== '') {
        return 'Word extends another word';
      }
    } else {
      // Check cell before word start
      const beforeRow = startRow - 1;
      if (beforeRow >= 0 && grid[beforeRow]?.[startCol]?.letter !== '') {
        return 'Word extends another word';
      }
      // Check cell after word end
      const afterRow = startRow + word.length;
      if (afterRow < rows && grid[afterRow]?.[startCol]?.letter !== '') {
        return 'Word extends another word';
      }
    }
    
    return null; // All good
  }

  // Get preview cells for the current word being typed
  function getPreviewCells(): { row: number; col: number; letter: string; isNew: boolean }[] {
    if (!selectedCell || currentTyping.length === 0) return [];
    
    // For reverse entry mode, don't show preview in grid until Enter is pressed
    // Instead, the word is shown in the typing area
    if (reverseEntry) return [];
    
    const anchorLetter = grid[selectedCell.row][selectedCell.col].letter;
    const letterIndex = currentTyping.indexOf(anchorLetter);
    
    // For forward entry, word starts AT the anchor cell
    // So anchor letter should be at position 0 in the typed word
    if (letterIndex === -1) {
      // Anchor letter not yet typed - show letters starting from anchor cell
      const cells: { row: number; col: number; letter: string; isNew: boolean }[] = [];
      for (let i = 0; i < currentTyping.length; i++) {
        const r = isHorizontal ? selectedCell.row : selectedCell.row + i;
        const c = isHorizontal ? selectedCell.col + i : selectedCell.col;
        
        if (r >= 0 && r < grid.length && c >= 0 && c < (grid[0]?.length || 0)) {
          // Only show preview on empty cells or cells that match the letter
          const existingLetter = grid[r][c].letter;
          if (existingLetter === '' || existingLetter === currentTyping[i]) {
            cells.push({ row: r, col: c, letter: currentTyping[i], isNew: existingLetter === '' });
          }
        }
      }
      return cells;
    }
    
    // Anchor letter found - calculate position from anchor
    const startRow = isHorizontal ? selectedCell.row : selectedCell.row - letterIndex;
    const startCol = isHorizontal ? selectedCell.col - letterIndex : selectedCell.col;
    
    const cells: { row: number; col: number; letter: string; isNew: boolean }[] = [];
    
    for (let i = 0; i < currentTyping.length; i++) {
      const r = isHorizontal ? startRow : startRow + i;
      const c = isHorizontal ? startCol + i : startCol;
      
      if (r >= 0 && r < grid.length && c >= 0 && c < (grid[0]?.length || 0)) {
        const isNew = grid[r][c].letter === '';
        cells.push({ row: r, col: c, letter: currentTyping[i], isNew });
      }
    }
    
    return cells;
  }

  // Submit the typed word
  function submitTypedWord() {
    if (!selectedCell || currentTyping.length < 2) {
      errorMessage = 'Word too short';
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    const word = currentTyping.toUpperCase();
    const anchorLetter = grid[selectedCell.row][selectedCell.col].letter;
    
    // Validate it's a food
    if (!isValidFood(word)) {
      errorMessage = `"${word}" is not a valid food word`;
      setTimeout(() => errorMessage = '', 3000);
      return;
    }
    
    // Check if already placed
    if (placedWords.some(p => p.word === word)) {
      errorMessage = 'Already on your plate!';
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    // Get placement position based on entry mode
    let startRow: number;
    let startCol: number;
    
    if (reverseEntry) {
      // Reverse mode: word ENDS at anchor cell
      // So anchor letter should be the LAST letter of the word
      if (word[word.length - 1] !== anchorLetter) {
        errorMessage = `Word must end with "${anchorLetter}"`;
        setTimeout(() => errorMessage = '', 2500);
        return;
      }
      // Start position is (word.length - 1) cells BEFORE the anchor
      startRow = isHorizontal ? selectedCell.row : selectedCell.row - (word.length - 1);
      startCol = isHorizontal ? selectedCell.col - (word.length - 1) : selectedCell.col;
    } else {
      // Forward mode: word STARTS at anchor cell OR anchor is somewhere in the word
      const letterIndex = word.indexOf(anchorLetter);
      if (letterIndex === -1) {
        errorMessage = `Word must contain "${anchorLetter}"`;
        setTimeout(() => errorMessage = '', 2500);
        return;
      }
      startRow = isHorizontal ? selectedCell.row : selectedCell.row - letterIndex;
      startCol = isHorizontal ? selectedCell.col - letterIndex : selectedCell.col;
    }
    
    // Verify there's at least one crossing
    let hasCrossing = false;
    for (let i = 0; i < word.length; i++) {
      const r = isHorizontal ? startRow : startRow + i;
      const c = isHorizontal ? startCol + i : startCol;
      if (grid[r][c].letter !== '') {
        hasCrossing = true;
        break;
      }
    }
    
    if (!hasCrossing) {
      errorMessage = 'Must connect to existing word';
      setTimeout(() => errorMessage = '', 2000);
      return;
    }
    
    // Check for invalid adjacencies (parallel words too close)
    const adjacencyError = checkInvalidAdjacencies(word, startRow, startCol, isHorizontal);
    if (adjacencyError) {
      errorMessage = adjacencyError;
      setTimeout(() => errorMessage = '', 2500);
      return;
    }
    
    const entry = getFoodEntry(word)!;
    const placement = { row: startRow, col: startCol, horizontal: isHorizontal };
    
    // If dual identity, show picker
    if (isDualIdentity(word)) {
      pendingWord = { word, entry, placement };
      showGroupPicker = true;
    } else {
      placeWord(word, entry, entry.groups[0], placement);
    }
    
    cancelTyping();
  }

  function cancelTyping() {
    selectedCell = null;
    currentTyping = '';
    reverseEntry = false;
    // Input will be removed from DOM when selectedCell is null
  }

  function placeWord(word: string, entry: FoodEntry, group: FoodGroup, placement: { row: number; col: number; horizontal: boolean }) {
    const placed: PlacedWord = {
      word,
      row: placement.row,
      col: placement.col,
      horizontal: placement.horizontal,
      group,
      entry
    };
    
    const newIndex = placedWords.length;
    placedWords = [...placedWords, placed];
    placeWordOnGrid(placed, newIndex);
    
    // Update score
    animatedScore.set(calculateScore());
    
    // Check if complete (11 words)
    if (placedWords.length >= 11) {
      gameComplete = true;
      showResults = true;
      saveProgress();
    }
  }

  function selectGroup(group: FoodGroup) {
    // Handle editing existing word's group
    if (editingWordIndex !== null) {
      placedWords[editingWordIndex].group = group;
      placedWords = [...placedWords]; // Trigger reactivity
      editingWordIndex = null;
      showGroupPicker = false;
      return;
    }
    
    // Handle new word placement
    if (!pendingWord) return;
    
    placeWord(pendingWord.word, pendingWord.entry, group, pendingWord.placement);
    
    pendingWord = null;
    showGroupPicker = false;
  }
  
  // Change group of an already placed word
  function changeWordGroup(index: number) {
    const placed = placedWords[index];
    if (!placed || placed.entry.groups.length <= 1) return;
    
    editingWordIndex = index;
    showGroupPicker = true;
  }

  // Count how many other words a given word intersects with
  function countIntersections(wordIndex: number): number {
    const word = placedWords[wordIndex];
    let intersectionCount = 0;
    
    for (let i = 0; i < placedWords.length; i++) {
      if (i === wordIndex) continue;
      if (wordsIntersect(word, placedWords[i])) {
        intersectionCount++;
      }
    }
    
    return intersectionCount;
  }

  // Scoring
  function calculateScore(): number {
    let score = 0;
    
    // 1 point per letter (excluding starting word)
    for (let i = 1; i < placedWords.length; i++) {
      score += placedWords[i].word.length;
    }
    
    // Multi-crossing bonus: words that intersect with 2+ other words get bonus points
    // Tiered rewards for strategic placement spanning multiple rows/columns
    for (let i = 1; i < placedWords.length; i++) {
      const crossings = countIntersections(i);
      if (crossings >= 4) {
        // 4+ crossings is immensely difficult with limited food words
        score += 50;
      } else if (crossings >= 3) {
        // 3 crossings is highly difficult
        score += 25;
      } else if (crossings >= 2) {
        // 2 crossings is achievable
        score += 5;
      }
    }
    
    // Completion bonus (11 words)
    if (placedWords.length >= 11) {
      score += 25;
    }
    
    // Food group diversity bonus - 10 points per unique group
    const uniqueGroups = new Set(placedWords.map(p => p.group));
    const groupCount = uniqueGroups.size;
    score += groupCount * 10;
    
    // All 11 groups bonus
    if (groupCount >= 11) {
      score += 50;
    }
    
    // Apply difficulty multiplier
    const multiplier = difficultyMode ? DIFFICULTY_MULTIPLIER[difficultyMode] : 1;
    return Math.round(score * multiplier);
  }

  function getGroupsUsed(): FoodGroup[] {
    return [...new Set(placedWords.map(p => p.group))];
  }

  function saveProgress() {
    if (typeof window === 'undefined') return;
    
    const lastPlayed = localStorage.getItem('dailyPlateLastPlayed');
    const today = new Date().toDateString();
    
    if (lastPlayed === today) return; // Already played today
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastPlayed === yesterday) {
      streak += 1;
    } else if (lastPlayed !== today) {
      streak = 1;
    }
    
    localStorage.setItem('dailyPlateStreak', streak.toString());
    localStorage.setItem('dailyPlateLastPlayed', today);
  }

  function getAchievementBadge(): { emoji: string; label: string } {
    // Score thresholds for 11-word game with group diversity bonuses
    const score = $animatedScore;
    const uniqueGroups = new Set(placedWords.map(p => p.group)).size;
    
    // Perfect: all 11 groups used
    if (uniqueGroups >= 11) return { emoji: '⭐', label: 'Perfect Plate' };
    // Excellent: 9-10 groups
    if (uniqueGroups >= 9) return { emoji: '🌟', label: 'Excellent' };
    // Great: 7-8 groups
    if (uniqueGroups >= 7) return { emoji: '✨', label: 'Great' };
    // Good: 5-6 groups
    if (uniqueGroups >= 5) return { emoji: '👍', label: 'Good' };
    return { emoji: '✅', label: 'Complete' };
  }

  function shareResults() {
    const groups = getGroupsUsed();
    const badge = getAchievementBadge();
    const groupEmojis = groups.map(g => GROUP_EMOJI[g]).join('');
    const modeEmoji = difficultyMode ? DIFFICULTY_EMOJI[difficultyMode] : '';
    const modeLabel = difficultyMode ? DIFFICULTY_LABELS[difficultyMode] : '';
    
    const text = `🍽️ Daily Plate #${puzzleNumber} ${modeEmoji}
${badge.emoji} ${badge.label}${groups.length >= 11 ? ' • Perfectly Balanced!' : groups.length >= 8 ? ' • Well Rounded!' : ''}
Score: ${Math.round($animatedScore)}${difficultyMode !== 'easy' ? ` (${modeLabel} Mode)` : ''}
${groupEmojis}
${streak > 1 ? `🔥 ${streak} day streak` : ''}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  }

  // Hidden input for mobile keyboard
  let hiddenInput: HTMLInputElement | null = $state(null);
  
  // Focus the hidden input to trigger mobile keyboard
  function focusMobileInput() {
    if (hiddenInput) {
      // Clear and refocus to ensure keyboard appears
      hiddenInput.value = currentTyping;
      hiddenInput.focus();
      // Move cursor to end
      hiddenInput.setSelectionRange(hiddenInput.value.length, hiddenInput.value.length);
    }
  }
  
  // Handle input from mobile keyboard
  function handleMobileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    const prevLength = currentTyping.length;
    
    // Handle character addition
    if (value.length > prevLength) {
      // New character(s) typed - get the last one
      const newChar = value.slice(-1);
      if (/[A-Z]/.test(newChar)) {
        const newWord = currentTyping + newChar;
        if (canPreviewWord(newWord)) {
          currentTyping = newWord;
        }
      }
    } 
    // Handle backspace - allow backspace even if only 1 character
    else if (value.length < prevLength) {
      if (prevLength > 0) {
        currentTyping = currentTyping.slice(0, -1);
      }
    }
    
    // Always sync input to current state
    input.value = currentTyping;
  }
  
  // Computed: preview cells
  let previewCells = $derived(getPreviewCells());
  
  // Check if a cell is in the preview
  function isPreviewCell(row: number, col: number): { isPreview: boolean; letter: string; isExisting: boolean } {
    const found = previewCells.find(c => c.row === row && c.col === col);
    return found ? { isPreview: true, letter: found.letter, isExisting: !found.isNew } : { isPreview: false, letter: '', isExisting: false };
  }

  // Initialize
  $effect(() => {
    initGame();
  });
  
  // Attach touchmove listener with passive: false to allow preventDefault
  $effect(() => {
    const handler = (e: TouchEvent) => {
      if (draggingWordIndex !== null) {
        e.preventDefault();
        handleDragMove(e);
      }
    };
    
    window.addEventListener('touchmove', handler, { passive: false });
    
    return () => {
      window.removeEventListener('touchmove', handler);
    };
  });
</script>

<!-- Listen for keyboard events at window level -->
<svelte:window 
  onkeydown={handleKeydown}
  onmousemove={handleDragMove}
  onmouseup={handleDragEnd}
  ontouchend={handleDragEnd}
/>

<div class="game-container">
  <!-- Difficulty Selector Modal -->
  {#if showDifficultySelector}
    <div class="modal-overlay" in:fade>
      <div class="modal difficulty-modal" in:scale>
        <h2>🍽️ Daily Plate #{puzzleNumber}</h2>
        <p class="difficulty-subtitle">Choose your challenge level</p>
        
        <div class="difficulty-options">
          <button class="difficulty-option easy" onclick={() => selectDifficulty('easy')}>
            <span class="difficulty-emoji">🟢</span>
            <span class="difficulty-name">Easy</span>
            <span class="difficulty-desc">Food lists by group</span>
            <span class="difficulty-mult">1× score</span>
          </button>
          
          <button class="difficulty-option medium" onclick={() => selectDifficulty('medium')}>
            <span class="difficulty-emoji">🟡</span>
            <span class="difficulty-name">Medium</span>
            <span class="difficulty-desc">Letter search only</span>
            <span class="difficulty-mult">1.5× score</span>
          </button>
          
          <button class="difficulty-option hard" onclick={() => selectDifficulty('hard')}>
            <span class="difficulty-emoji">🔴</span>
            <span class="difficulty-name">Hard</span>
            <span class="difficulty-desc">No hints - memory only</span>
            <span class="difficulty-mult">2× score</span>
          </button>
        </div>
        
        <a href="/" class="cancel-link">← Back to Games</a>
      </div>
    </div>
  {/if}

  <header>
    <h1>🍽️ Daily Plate</h1>
    <p class="puzzle-number">#{puzzleNumber} · {#if difficultyMode}<button class="mode-badge-btn" onclick={() => showDifficultySelector = true} title="Change difficulty">{DIFFICULTY_EMOJI[difficultyMode]} {DIFFICULTY_LABELS[difficultyMode]}</button> · {/if}<button class="rules-link" onclick={() => showRules = true}>Rules</button></p>
  </header>

  <!-- Hidden input for mobile keyboard -->
  <input
    bind:this={hiddenInput}
    type="text"
    inputmode="text"
    enterkeyhint="done"
    class="mobile-input"
    autocomplete="off"
    autocapitalize="characters"
    autocorrect="off"
    spellcheck="false"
    value={currentTyping}
    oninput={handleMobileInput}
    onkeydown={(e) => {
      if (e.key === 'Enter') submitTypedWord();
      if (e.key === 'Escape') cancelTyping();
    }}
  />

  <!-- Typing Instructions -->
  {#if !gameComplete}
    <div class="typing-hint">
      {#if selectedCell}
        <span class="typing-display">Typing: <strong>{currentTyping || '_'}</strong></span>
        <button class="direction-btn" onclick={toggleDirection} title="Click to cycle direction">
          {directionArrow}
        </button>
        {#if reverseEntry}
          <span class="reverse-hint">Word ends here</span>
        {:else}
          <span class="forward-hint">Word starts here</span>
        {/if}
        <div class="action-buttons">
          <button class="action-btn cancel-btn" onclick={cancelTyping}>✕ Cancel</button>
          <button class="action-btn add-btn" onclick={submitTypedWord} disabled={currentTyping.length < 2}>✓ Add</button>
        </div>
      {:else}
        <span class="hint-text">Tap a letter to start typing a word</span>
      {/if}
    </div>
  {/if}
  
  <!-- Food Groups Panel -->
  <div class="food-groups-panel">
    {#if true}
      {@const usedCount = new Set(placedWords.map(p => p.group)).size}
      {@const remainingCount = ALL_GROUPS.length - usedCount}
      {#if remainingCount > 0 && placedWords.length > 0}
        <div class="groups-progress">
          <span class="progress-text">
            {#if remainingCount === 1}
              🎯 1 group left!
            {:else}
              {usedCount}/11 groups • {remainingCount} to go
            {/if}
          </span>
        </div>
      {:else if remainingCount === 0}
        <div class="groups-progress complete">
          <span class="progress-text">🌟 All 11 groups used!</span>
        </div>
      {/if}
    {/if}
    
    <!-- Group chips always shown to track progress -->
    <div class="groups-bar">
      {#each ALL_GROUPS as group}
        {@const isUsed = placedWords.some(p => p.group === group)}
        <button 
          class="group-chip" 
          class:expanded={expandedGroup === group && difficultyMode === 'easy'}
          class:used={isUsed}
          class:no-expand={difficultyMode !== 'easy'}
          style="--group-color: {GROUP_COLORS[group]}"
          onclick={() => difficultyMode === 'easy' && toggleGroupExpand(group)}
          title="{GROUP_NAMES[group]}{difficultyMode !== 'easy' ? ' (no hints in this mode)' : ''}"
        >
          <span class="chip-emoji">{GROUP_EMOJI[group]}</span>
          <span class="chip-name">{GROUP_NAMES[group]}</span>
          {#if isUsed}
            <span class="used-check">✓</span>
          {/if}
        </button>
      {/each}
    </div>
    
    <!-- Easy Mode: Food list dropdown -->
    {#if difficultyMode === 'easy' && expandedGroup}
      <div class="group-food-list" transition:fly={{ y: -10, duration: 200 }}>
        <div class="list-header">
          <span>{GROUP_EMOJI[expandedGroup]} {GROUP_NAMES[expandedGroup]}</span>
          <button class="close-list" onclick={() => expandedGroup = null}>✕</button>
        </div>
        <div class="food-items">
          {#each getFoodsForGroup(expandedGroup) as food}
            {@const isPlaced = placedWords.some(p => p.word === food)}
            <button 
              class="food-tag" 
              class:placed={isPlaced}
              class:selectable={selectedCell && !isPlaced}
              onclick={() => insertFoodFromList(food)}
              disabled={isPlaced}
              title={isPlaced ? 'Already placed' : selectedCell ? 'Click to insert' : 'Select a cell first'}
            >
              {food}
              {#if isPlaced}<span class="placed-dot">•</span>{/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Medium Mode: Letter search -->
    {#if difficultyMode === 'medium'}
      <div class="letter-search-panel" transition:fly={{ y: -10, duration: 200 }}>
        <div class="search-header">
          <span>🔍 Word Tips</span>
        </div>
        <div class="search-controls">
          <select bind:value={letterSearchType} onchange={searchByLetter}>
            <option value="first">Starts with</option>
            <option value="last">Ends with</option>
          </select>
          <input 
            type="text" 
            maxlength="1" 
            placeholder="A-Z"
            bind:value={letterSearchQuery}
            oninput={searchByLetter}
            class="letter-input"
          />
          {#if letterSearchQuery}
            <button class="clear-search" onclick={clearLetterSearch}>✕</button>
          {/if}
        </div>
        {#if letterSearchResults.length > 0}
          <div class="search-results">
            <span class="result-count">{letterSearchResults.length} foods found</span>
            <div class="result-list">
              {#each letterSearchResults.slice(0, 50) as food}
                <button 
                  class="food-tag selectable"
                  class:selectable={selectedCell}
                  onclick={() => insertFoodFromList(food)}
                  title={selectedCell ? 'Click to insert' : 'Select a cell first'}
                >
                  {food}
                </button>
              {/each}
              {#if letterSearchResults.length > 50}
                <span class="more-results">...and {letterSearchResults.length - 50} more</span>
              {/if}
            </div>
          </div>
        {:else if letterSearchQuery}
          <div class="no-results">No foods found</div>
        {/if}
      </div>
    {/if}
    
    <!-- Hard Mode: No hints message -->
    {#if difficultyMode === 'hard'}
      <div class="hard-mode-hint">
        <span>🧠 Hard Mode: Type foods from memory!</span>
      </div>
    {/if}
  </div>

  <!-- Grid Display -->
  <div class="grid-container">
    <div class="grid" class:dragging={draggingWordIndex !== null || selectedForMove !== null} bind:this={gridElement} style="--grid-size: {grid[0]?.length || gridSize}">
      {#each grid as row, r}
        {#each row as cell, c}
          {@const preview = isPreviewCell(r, c)}
          {@const beingDragged = isCellBeingDragged(r, c)}
          {@const dragPreview = isCellDragPreview(r, c)}
          {@const movableWordIdx = getMovableWordAtCell(r, c)}
          {@const isSelectedForMove = isCellSelectedForMove(r, c)}
          <div 
            class="cell" 
            class:filled={cell.letter !== ''}
            class:crossing={cell.wordIndices.length > 1}
            class:clickable={cell.letter !== '' && !gameComplete && draggingWordIndex === null && selectedForMove === null}
            class:draggable-word={movableWordIdx !== null && !gameComplete}
            class:selected-for-move={isSelectedForMove}
            class:selected={selectedCell?.row === r && selectedCell?.col === c}
            class:preview={preview.isPreview}
            class:preview-existing={preview.isPreview && preview.isExisting}
            class:being-dragged={beingDragged}
            class:drag-preview={dragPreview.inPreview && !beingDragged}
            onclick={() => handleCellClick(r, c)}
            onmousedown={(e) => movableWordIdx !== null && startDragFromGrid(movableWordIdx, e)}
            ontouchstart={(e) => movableWordIdx !== null && startDragFromGrid(movableWordIdx, e)}
          >
            {#if dragPreview.inPreview && !beingDragged}
              <span class="letter drag-preview-letter">{dragPreview.letter}</span>
            {:else if preview.isPreview && preview.letter && !preview.isExisting}
              <span class="letter new-letter">{preview.letter}</span>
            {:else if cell.letter}
              <span class="letter" class:faded={beingDragged} in:scale={{ duration: 200 }}>
                {cell.letter}
              </span>
            {/if}
          </div>
        {/each}
      {/each}
    </div>
  </div>

  <!-- Drag Hint -->
  {#if draggingWordIndex !== null}
    <div class="drag-hint" in:fly={{ y: -10, duration: 200 }}>
      <span>🎯 Drag to reposition • Release to place</span>
    </div>
  {:else if selectedForMove !== null}
    <div class="drag-hint move-mode" in:fly={{ y: -10, duration: 200 }}>
      <span>✋ Touch and drag the highlighted word • Tap here to cancel</span>
      <button class="cancel-move-btn" onclick={() => selectedForMove = null}>✕</button>
    </div>
  {/if}

  <!-- Placed Words Legend -->
  <div class="words-legend">
    {#each placedWords as placed, i}
      <div 
        class="word-item" 
        class:changeable={placed.entry.groups.length > 1}
        class:is-dragging={draggingWordIndex === i}
        class:selected-for-move={selectedForMove === i}
        in:fly={{ y: 20, duration: 300, delay: i * 50 }}
      >
        <span class="group-badge" style="background: {GROUP_COLORS[placed.group]}">
          {GROUP_EMOJI[placed.group]}
        </span>
        <span class="word-text">{placed.word}</span>
        <span class="group-name" style="color: {GROUP_TEXT_COLORS[placed.group]}">{GROUP_NAMES[placed.group]}</span>
        {#if placed.entry.groups.length > 1}
          <button 
            class="change-group-btn" 
            onclick={(e) => { e.stopPropagation(); changeWordGroup(i); }} 
            title="Change food group"
          >🔄</button>
        {/if}
        {#if i > 0}
          <button 
            class="move-word-btn" 
            class:active={selectedForMove === i}
            onclick={(e) => { e.stopPropagation(); toggleMoveMode(i); }} 
            title={selectedForMove === i ? "Cancel move" : "Move this word"}
          >↔</button>
          <button class="delete-word-btn" onclick={(e) => { e.stopPropagation(); deleteWord(i); }} title="Remove this word">✕</button>
        {/if}
      </div>
    {/each}
    {#if placedWords.length < 11}
      {#each Array(11 - placedWords.length) as _, i}
        <div class="word-item empty">
          <span class="placeholder">Word {placedWords.length + i + 1}</span>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Error Message -->
  {#if errorMessage}
    <p class="error-message" in:fly={{ y: -10 }} out:fade>⚠️ {errorMessage}</p>
  {/if}

  <!-- Rules Modal -->
  {#if showRules}
    <div class="modal-overlay" in:fade onclick={() => showRules = false}>
      <div class="modal rules-modal" in:scale onclick={(e) => e.stopPropagation()}>
        <h3>🍽️ How to Play</h3>
        <div class="rules-content">
          <p><strong>Build a crossword of food words!</strong></p>
          
          <h4>🎯 Goal</h4>
          <p>Place 11 food words, using as many different food groups as possible.</p>
          
          <h4>🔤 Placing Words</h4>
          <ul>
            <li>Click any letter on the grid</li>
            <li>Type a food word that includes that letter</li>
            <li>Words must connect to existing letters</li>
          </ul>
          
          <h4>✋ Moving Words</h4>
          <ul>
            <li>Tap the ↔ button next to a word in the list</li>
            <li>The word will highlight — now touch and drag it on the grid</li>
            <li>The word will snap to valid connecting spots</li>
            <li>Release to place — all words must stay connected!</li>
          </ul>
          
          <h4>🌟 Scoring</h4>
          <ul>
            <li><strong>+1 point</strong> per letter</li>
            <li><strong>+5 / +25 / +50</strong> for crossing 2 / 3 / 4+ words</li>
            <li><strong>+10 points</strong> per unique food group</li>
            <li><strong>+50 bonus</strong> for using all 11 groups</li>
            <li><strong>+25 bonus</strong> for completing 11 words</li>
          </ul>
          
          <h4>🌈 Food Groups</h4>
          <p class="group-list">
            🥬 Vegetable • 🍎 Fruit • 🌾 Grain • 🍗 Protein • 🥛 Dairy • 🫘 Legume • 🥜 Nuts • 🫒 Fats • 🧂 Spices/Condiments • 🍽️ Prepared • 🥤 Beverage
          </p>
          
          <h4>💡 Tips</h4>
          <ul>
            <li>Some foods belong to multiple groups — tap to choose!</li>
            <li>Aim for variety to maximize your score</li>
            <li>Place words that cross multiple others for bonus points!</li>
          </ul>
        </div>
        <button class="close-rules" onclick={() => showRules = false}>Got it!</button>
      </div>
    </div>
  {/if}

  <!-- Group Picker Modal -->
  {#if showGroupPicker && (pendingWord || editingWordIndex !== null)}
    {@const word = pendingWord?.word ?? placedWords[editingWordIndex!]?.word}
    {@const entry = pendingWord?.entry ?? placedWords[editingWordIndex!]?.entry}
    {@const currentGroup = editingWordIndex !== null ? placedWords[editingWordIndex]?.group : null}
    <div class="modal-overlay" in:fade onclick={() => { showGroupPicker = false; pendingWord = null; editingWordIndex = null; }}>
      <div class="modal" in:scale onclick={(e) => e.stopPropagation()}>
        <h3>{word}</h3>
        {#if editingWordIndex !== null}
          <p class="dual-info">🔄 Change food group</p>
        {:else}
          <p class="dual-info">ⓘ This food has multiple identities</p>
        {/if}
        {#if entry?.facts}
          <ul class="facts">
            {#each entry.facts as fact}
              <li>{fact}</li>
            {/each}
          </ul>
        {/if}
        <p>Count as:</p>
        <div class="group-options">
          {#each entry?.groups ?? [] as group}
            <button 
              class="group-btn"
              class:selected={currentGroup === group}
              style="background: {GROUP_COLORS[group]}"
              onclick={() => selectGroup(group)}
            >
              {GROUP_EMOJI[group]} {GROUP_NAMES[group]}
              {#if currentGroup === group}<span class="current-marker">✓</span>{/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Results Modal -->
  {#if showResults}
    <div class="modal-overlay" in:fade>
      <div class="modal results" in:scale>
        <h2>🍽️ Daily Plate #{puzzleNumber}</h2>
        {#if difficultyMode}
          <p class="difficulty-badge">{DIFFICULTY_EMOJI[difficultyMode]} {DIFFICULTY_LABELS[difficultyMode]} Mode</p>
        {/if}
        <p class="complete-badge">Complete!</p>
        
        {#if getGroupsUsed().length >= 11}
          <p class="balanced">🌈 Perfectly Balanced!</p>
        {:else if getGroupsUsed().length >= 8}
          <p class="balanced">🥗 Well Rounded!</p>
        {/if}
        
        <div class="achievement">
          <span class="badge">{getAchievementBadge().emoji}</span>
          <span class="label">{getAchievementBadge().label}</span>
        </div>
        
        <p class="final-score">Score: {Math.round($animatedScore)}{difficultyMode && difficultyMode !== 'easy' ? ` (${DIFFICULTY_MULTIPLIER[difficultyMode]}× multiplier)` : ''}</p>
        
        <div class="groups-summary">
          {#each getGroupsUsed() as group}
            <span class="group-tag" style="background: {GROUP_COLORS[group]}">
              {GROUP_EMOJI[group]} {GROUP_NAMES[group]}
            </span>
          {/each}
        </div>
        
        {#if streak > 1}
          <p class="streak">🔥 {streak} day streak</p>
        {/if}
        
        <button class="share-btn" onclick={shareResults}>
          📤 Share
        </button>
        
        <button class="resume-btn" onclick={() => { gameComplete = false; showResults = false; }}>
          ✏️ Keep Editing
        </button>
        
        <button class="close-btn" onclick={() => showResults = false}>
          View Plate
        </button>
      </div>
    </div>
  {/if}

  <!-- Score Display -->
  <div class="score-display">
    <span class="score-label">Score</span>
    <span class="score-value">{Math.round($animatedScore)}</span>
    {#if placedWords.length >= 11 && !showResults}
      <button class="view-results-btn" onclick={() => showResults = true}>
        🏆 Results
      </button>
    {/if}
  </div>
</div>

<style>
  .game-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 1rem;
  }

  header h1 {
    font-size: 2rem;
    margin: 0;
    background: linear-gradient(135deg, #22c55e, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .puzzle-number {
    color: #666;
    margin: 0;
  }

  .grid-container {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
    overflow: auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-size), var(--cell-size, 28px));
    gap: 2px;
    background: #e5e7eb;
    padding: 4px;
    border-radius: 8px;
    touch-action: manipulation;
  }
  
  .grid.dragging {
    touch-action: none;
  }

  .cell {
    width: var(--cell-size, 28px);
    height: var(--cell-size, 28px);
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: bold;
    font-size: var(--cell-font, 14px);
    transition: all 0.15s ease;
  }

  .cell.clickable {
    cursor: pointer;
  }

  .cell.clickable:hover {
    background: #e0f2fe;
    transform: scale(1.05);
  }

  .cell.selected {
    background: #3b82f6;
    box-shadow: 0 0 0 2px #1d4ed8;
  }

  .cell.selected .letter {
    color: white;
  }

  .cell.preview {
    background: #bbf7d0;
  }

  .cell.preview-existing {
    background: #86efac;
  }

  .cell.filled {
    background: #fef3c7;
  }

  .cell.crossing {
    background: #fde047;
  }

  /* Drag mode visuals */
  .cell.draggable-word {
    cursor: grab;
  }
  
  .cell.draggable-word:active {
    cursor: grabbing;
  }

  .cell.being-dragged {
    background: #fecaca;
    opacity: 0.5;
  }

  .cell.drag-preview {
    background: #86efac;
    box-shadow: inset 0 0 0 2px #22c55e;
  }

  .letter.faded {
    opacity: 0.3;
  }

  .letter.drag-preview-letter {
    color: #16a34a;
    font-weight: bold;
  }
  
  .drag-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #dbeafe;
    border: 2px solid #3b82f6;
    color: #1e40af;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    margin: 0.5rem 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .drag-hint.move-mode {
    background: #fef3c7;
    border-color: #f59e0b;
    color: #92400e;
    cursor: pointer;
  }
  
  .cancel-move-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: #f59e0b;
    color: white;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 0.5rem;
  }
  
  .cell.selected-for-move {
    background: #fef3c7;
    box-shadow: inset 0 0 0 2px #f59e0b;
    cursor: grab;
  }

  .letter {
    color: #1f2937;
  }

  .new-letter {
    animation: pop 0.2s ease;
    color: #16a34a;
  }

  @keyframes pop {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  /* Hidden input for mobile keyboard */
  .mobile-input {
    position: fixed;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    border: none;
    opacity: 0.01;
    pointer-events: none;
    z-index: -1;
    /* Prevent zoom on iOS */
    font-size: 16px;
  }

  .typing-hint {
    text-align: center;
    padding: 0.5rem;
    background: #f0f9ff;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .typing-display {
    font-size: 0.95rem;
  }

  .typing-hint .hint-text {
    color: #64748b;
    font-size: 0.9rem;
  }
  
  /* Action buttons for mobile */
  .action-buttons {
    display: flex;
    gap: 0.35rem;
  }
  
  .action-btn {
    padding: 0.3rem 0.6rem;
    border: none;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
  
  .action-btn:hover {
    transform: none;
    box-shadow: none;
  }
  
  .cancel-btn {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .cancel-btn:hover {
    background: #fecaca;
  }
  
  .add-btn {
    background: #dcfce7;
    color: #16a34a;
  }
  
  .add-btn:hover {
    background: #bbf7d0;
  }
  
  .add-btn:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .direction-btn {
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    width: 28px;
    height: 28px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .direction-btn:hover {
    background: #2563eb;
  }
  
  .direction-btn.secondary {
    background: #64748b;
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
  
  .direction-btn.secondary:hover {
    background: #475569;
  }
  
  .reverse-hint {
    color: #f59e0b;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .forward-hint {
    color: #10b981;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  /* Food Groups Panel */
  .food-groups-panel {
    margin-bottom: 0.75rem;
  }
  
  .groups-progress {
    text-align: center;
    padding: 0.35rem 0.75rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #92400e;
  }
  
  .groups-progress.complete {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
    animation: celebrate 0.5s ease;
  }
  
  @keyframes celebrate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .groups-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    justify-content: center;
    padding: 0.25rem;
  }
  
  .group-chip {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    padding: 0.2rem 0.4rem;
    border: 1px solid var(--group-color);
    background: white;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.7rem;
    transition: all 0.15s ease;
    position: relative;
  }
  
  .group-chip:hover {
    background: color-mix(in srgb, var(--group-color) 15%, white);
  }
  
  .group-chip.expanded {
    background: var(--group-color);
    color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
  
  .group-chip.used {
    opacity: 0.5;
    background: #e5e7eb;
    border-color: #22c55e;
    border-width: 2px;
  }
  
  .group-chip.used .chip-emoji {
    filter: grayscale(50%);
  }
  
  .group-chip.used .chip-name {
    color: #6b7280;
    text-decoration: line-through;
    text-decoration-color: #22c55e;
  }
  
  .group-chip:not(.used) {
    animation: subtle-pulse 2s ease-in-out infinite;
  }
  
  @keyframes subtle-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    50% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); }
  }

  .chip-emoji {
    font-size: 0.75rem;
    flex-shrink: 0;
  }
  
  .chip-name {
    font-size: 0.7rem;
    white-space: nowrap;
    color: #333;
    font-weight: 500;
  }
  
  .group-chip.expanded .chip-name {
    color: white;
  }
  
  .used-check {
    color: #22c55e;
    font-weight: bold;
    font-size: 0.6rem;
  }
  
  .group-chip.expanded .used-check {
    color: white;
  }
  
  .group-food-list {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem;
    margin-top: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .close-list {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #64748b;
    padding: 0.25rem;
    line-height: 1;
  }
  
  .close-list:hover {
    color: #ef4444;
  }
  
  .food-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  
  .food-tag {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: capitalize;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #374151;
  }
  
  .food-tag:hover:not(.placed):not(:disabled) {
    background: #e0f2fe;
    border-color: #3b82f6;
    transform: none;
    box-shadow: none;
  }
  
  .food-tag.selectable {
    background: #fffbeb;
    border-color: #f59e0b;
    color: #92400e;
  }
  
  .food-tag.selectable:hover {
    background: #fef3c7;
    border-color: #d97706;
  }
  
  .food-tag.placed {
    background: #dcfce7;
    border-color: #22c55e;
    color: #166534;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .food-tag:disabled {
    cursor: not-allowed;
  }
  
  .placed-dot {
    color: #22c55e;
    margin-left: 0.2rem;
  }

  .words-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin: 1rem 0;
  }

  .word-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #f3f4f6;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .word-item.is-dragging {
    background: #dbeafe;
    box-shadow: 0 0 0 2px #3b82f6;
  }
  
  .word-item.selected-for-move {
    background: #fef3c7;
    box-shadow: 0 0 0 2px #f59e0b;
    animation: pulse-move 1.5s infinite;
  }
  
  @keyframes pulse-move {
    0%, 100% { box-shadow: 0 0 0 2px #f59e0b; }
    50% { box-shadow: 0 0 0 4px #fbbf24; }
  }

  .word-item.empty {
    opacity: 0.4;
    border: 2px dashed #d1d5db;
    background: transparent;
  }
  
  .word-item.changeable {
    cursor: pointer;
  }
  
  .word-item.changeable:hover {
    background: #e0e7ff;
  }

  .group-badge {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .change-group-btn {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: none;
    background: #e0e7ff;
    color: #4f46e5;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all 0.15s ease;
  }
  
  .change-group-btn:hover {
    background: #c7d2fe;
    transform: scale(1.1);
  }

  .dual-indicator {
    color: #6366f1;
    cursor: help;
  }

  .group-name {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
  }

  .delete-word-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    padding: 0;
    transition: all 0.15s ease;
  }

  .delete-word-btn:hover {
    background: #dc2626;
    color: white;
    transform: scale(1.1);
  }
  
  .move-word-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: #fef3c7;
    color: #d97706;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 0.25rem;
    transition: all 0.15s ease;
  }
  
  .move-word-btn:hover {
    background: #fbbf24;
    color: white;
    transform: scale(1.1);
  }
  
  .move-word-btn.active {
    background: #f59e0b;
    color: white;
    animation: pulse-move 1.5s infinite;
  }

  .placeholder {
    color: #9ca3af;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.1s;
  }

  button:hover {
    transform: scale(1.02);
  }

  button:active {
    transform: scale(0.98);
  }

  .error-message {
    background: #fef2f2;
    border: 2px solid #ef4444;
    color: #dc2626;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    margin: 0.75rem 0;
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    max-width: 350px;
    width: 90%;
    text-align: center;
  }

  .modal h3 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
  }

  .rules-link {
    background: none;
    border: none;
    color: #6366f1;
    text-decoration: underline;
    cursor: pointer;
    font-size: inherit;
    padding: 0;
  }

  .rules-link:hover {
    color: #4f46e5;
  }

  .rules-modal {
    max-width: 400px;
    text-align: left;
    max-height: 80vh;
    overflow-y: auto;
  }

  .rules-modal h3 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .rules-content h4 {
    color: #374151;
    font-size: 1rem;
    margin: 1rem 0 0.5rem;
  }

  .rules-content p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #4b5563;
  }

  .rules-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    font-size: 0.9rem;
    color: #4b5563;
  }

  .rules-content li {
    margin: 0.25rem 0;
  }

  .group-list {
    font-size: 0.85rem !important;
    line-height: 1.6;
  }

  .close-rules {
    display: block;
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.75rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }

  .close-rules:hover {
    background: #4f46e5;
  }

  /* Difficulty Selector Styles */
  .difficulty-modal {
    max-width: 400px;
  }
  
  .difficulty-subtitle {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
  
  .difficulty-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .difficulty-option {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    grid-template-rows: auto auto;
    align-items: center;
    gap: 0.25rem 0.75rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }
  
  .difficulty-option:hover {
    transform: scale(1.02);
  }
  
  .difficulty-option.easy:hover {
    border-color: #22c55e;
    background: #f0fdf4;
  }
  
  .difficulty-option.medium:hover {
    border-color: #eab308;
    background: #fefce8;
  }
  
  .difficulty-option.hard:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }
  
  .difficulty-emoji {
    font-size: 1.5rem;
    grid-row: span 2;
  }
  
  .difficulty-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1f2937;
  }
  
  .difficulty-mult {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6366f1;
    grid-row: span 2;
  }
  
  .difficulty-desc {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .cancel-link {
    display: block;
    text-align: center;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .cancel-link:hover {
    color: #374151;
    background: #f3f4f6;
  }
  
  .mode-badge {
    font-weight: 600;
    color: #374151;
  }
  
  .mode-badge-btn {
    font-weight: 600;
    color: #374151;
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
  }
  
  .mode-badge-btn:hover {
    color: #6366f1;
  }
  
  /* Letter Search Styles (Medium Mode) */
  .letter-search-panel {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 12px;
    padding: 0.75rem;
    margin-top: 0.5rem;
  }
  
  .search-header {
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.5rem;
  }
  
  .search-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .search-controls select {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #d97706;
    background: white;
    font-size: 0.9rem;
  }
  
  .letter-input {
    width: 50px;
    padding: 0.5rem;
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    text-transform: uppercase;
    border: 2px solid #d97706;
    border-radius: 8px;
  }
  
  .letter-input:focus {
    outline: none;
    border-color: #92400e;
  }
  
  .clear-search {
    padding: 0.5rem 0.75rem;
    background: #fbbf24;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .search-results {
    margin-top: 0.75rem;
  }
  
  .result-count {
    font-size: 0.8rem;
    color: #92400e;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .result-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    max-height: 150px;
    overflow-y: auto;
  }
  
  .more-results {
    font-size: 0.8rem;
    color: #92400e;
    font-style: italic;
  }
  
  .no-results {
    color: #92400e;
    font-size: 0.9rem;
    text-align: center;
    padding: 0.5rem;
  }
  
  /* Hard Mode Styles */
  .hard-mode-hint {
    background: linear-gradient(135deg, #fecaca, #fca5a5);
    border-radius: 12px;
    padding: 0.75rem;
    margin-top: 0.5rem;
    text-align: center;
    font-weight: 600;
    color: #991b1b;
  }
  
  .group-chip.no-expand {
    cursor: default;
  }
  
  .group-chip.no-expand:hover {
    background: white;
  }

  .dual-info {
    color: #6366f1;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .facts {
    text-align: left;
    font-size: 0.85rem;
    color: #4b5563;
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .group-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .group-btn {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }
  
  .group-btn:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  
  .group-btn.selected {
    box-shadow: 0 0 0 3px white, 0 0 0 5px currentColor;
  }
  
  .current-marker {
    margin-left: 0.25rem;
    font-weight: bold;
  }

  .results h2 {
    margin: 0 0 0.5rem;
  }

  .difficulty-badge {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0 0 0.25rem;
    font-weight: 600;
  }

  .complete-badge {
    font-size: 1.2rem;
    color: #22c55e;
    margin: 0;
  }

  .balanced {
    font-size: 1.1rem;
    color: #6366f1;
    margin: 0.5rem 0;
  }

  .achievement {
    margin: 1rem 0;
  }

  .achievement .badge {
    font-size: 3rem;
    display: block;
  }

  .achievement .label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #374151;
  }

  .final-score {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
  }

  .groups-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin: 1rem 0;
  }

  .group-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    color: #1f2937;
  }

  .streak {
    font-size: 1.1rem;
    color: #f97316;
  }

  .share-btn {
    width: 100%;
    margin: 0.5rem 0;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  .resume-btn {
    width: 100%;
    margin: 0.5rem 0;
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }
  
  .resume-btn:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
  }

  .close-btn {
    width: 100%;
    background: #6b7280;
  }

  .score-display {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
  }

  .score-label {
    font-size: 0.75rem;
    color: #6b7280;
    display: block;
  }

  .score-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #22c55e;
  }

  .view-results-btn {
    display: block;
    margin-top: 0.5rem;
    padding: 0.35rem 0.75rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s;
  }
  
  .view-results-btn:hover {
    transform: scale(1.05);
  }
  
  /* Mobile Portrait Responsive Styles */
  @media (max-width: 480px) {
    .game-container {
      padding: 0.5rem;
      max-width: 100%;
      --cell-size: 20px;
      --cell-font: 11px;
    }
    
    header h1 {
      font-size: 1.5rem;
    }
    
    .grid {
      gap: 1px;
      padding: 2px;
    }
    
    .cell {
      border-radius: 2px;
    }
    
    .typing-hint {
      padding: 0.35rem;
      gap: 0.3rem;
      font-size: 0.85rem;
    }
    
    .typing-hint .hint-text {
      font-size: 0.7rem;
    }
    
    .direction-btn {
      width: 24px;
      height: 24px;
      font-size: 14px;
    }
    
    .reverse-hint, .forward-hint {
      font-size: 0.7rem;
    }
    
    .groups-bar {
      gap: 0.15rem;
    }
    
    .group-chip {
      padding: 0.15rem 0.3rem;
      font-size: 0.65rem;
      border-radius: 8px;
    }
    
    .chip-emoji {
      font-size: 0.65rem;
    }
    
    .chip-name {
      font-size: 0.6rem;
    }
    
    .group-food-list {
      max-height: 150px;
      padding: 0.35rem;
    }
    
    .list-header {
      font-size: 0.8rem;
      padding-bottom: 0.35rem;
    }
    
    .food-tag {
      font-size: 0.65rem;
      padding: 0.15rem 0.35rem;
    }
    
    .words-legend {
      gap: 0.3rem;
      margin: 0.5rem 0;
    }
    
    .word-item {
      padding: 0.25rem 0.4rem;
      font-size: 0.75rem;
      gap: 0.25rem;
    }
    
    .group-badge {
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
    }
    
    .score-display {
      padding: 0.35rem 0.75rem;
    }
    
    .score-value {
      font-size: 1.2rem;
    }
  }
  
  /* Extra small screens */
  @media (max-width: 360px) {
    .game-container {
      --cell-size: 16px;
      --cell-font: 9px;
    }
    
    .chip-name {
      display: none;
    }
    
    .chip-emoji {
      font-size: 0.75rem;
    }
  }
  
  /* Tablet Portrait (iPad mini, iPad 10.2") */
  @media (min-width: 600px) {
    .game-container {
      max-width: 700px;
      padding: 1.5rem;
      --cell-size: 32px;
      --cell-font: 16px;
    }
    
    header h1 {
      font-size: 2.25rem;
    }
    
    .group-chip {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
    
    .word-item {
      padding: 0.4rem 0.7rem;
      font-size: 1rem;
    }
    
    .group-badge {
      width: 28px;
      height: 28px;
      font-size: 0.9rem;
    }
    
    .food-tag {
      padding: 0.3rem 0.6rem;
      font-size: 0.85rem;
    }
  }
  
  /* Tablet Landscape (iPad 10.2", iPad Air) */
  @media (min-width: 800px) {
    .game-container {
      max-width: 850px;
      --cell-size: 36px;
      --cell-font: 18px;
    }
    
    header h1 {
      font-size: 2.5rem;
    }
    
    .typing-hint {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
    
    .direction-btn {
      width: 36px;
      height: 36px;
      font-size: 20px;
    }
    
    .groups-bar {
      gap: 0.5rem;
    }
    
    .group-chip {
      padding: 0.5rem 1rem;
    }
    
    .words-legend {
      gap: 0.6rem;
    }
    
    .word-item {
      padding: 0.5rem 0.8rem;
    }
    
    .move-word-btn,
    .delete-word-btn {
      width: 28px;
      height: 28px;
      font-size: 16px;
    }
    
    .score-display {
      padding: 0.6rem 1.2rem;
    }
    
    .score-value {
      font-size: 1.75rem;
    }
  }
  
  /* Large Tablet (iPad Pro 11", 12.9") */
  @media (min-width: 1024px) {
    .game-container {
      max-width: 1000px;
      padding: 2rem;
      --cell-size: 40px;
      --cell-font: 20px;
    }
    
    header h1 {
      font-size: 3rem;
    }
    
    .puzzle-number {
      font-size: 1.1rem;
    }
    
    .typing-hint {
      padding: 1rem 1.25rem;
      font-size: 1.1rem;
      border-radius: 16px;
    }
    
    .groups-bar {
      gap: 0.6rem;
    }
    
    .group-chip {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      border-radius: 20px;
    }
    
    .chip-emoji {
      font-size: 1.1rem;
    }
    
    .group-food-list {
      max-height: 250px;
      padding: 1rem;
    }
    
    .food-tag {
      padding: 0.4rem 0.8rem;
      font-size: 0.95rem;
    }
    
    .words-legend {
      gap: 0.75rem;
      margin: 1.25rem 0;
    }
    
    .word-item {
      padding: 0.6rem 1rem;
      font-size: 1.1rem;
      border-radius: 24px;
    }
    
    .group-badge {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
    
    .move-word-btn,
    .delete-word-btn {
      width: 32px;
      height: 32px;
      font-size: 18px;
    }
    
    .score-display {
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
    }
    
    .score-value {
      font-size: 2rem;
    }
    
    .modal {
      max-width: 450px;
      padding: 2rem;
    }
    
    .modal h3 {
      font-size: 1.5rem;
    }
    
    .rules-content {
      font-size: 1rem;
    }
  }
  
  /* Desktop / Very Large Tablet */
  @media (min-width: 1280px) {
    .game-container {
      max-width: 1100px;
      --cell-size: 44px;
      --cell-font: 22px;
    }
  }
</style>
