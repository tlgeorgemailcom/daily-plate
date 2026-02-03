<script lang="ts">
  import { 
    FOOD_DATABASE, 
    getFoodEntry, 
    isValidFood, 
    isDualIdentity,
    GROUP_COLORS,
    GROUP_EMOJI,
    GROUP_NAMES,
    type FoodGroup,
    type FoodEntry
  } from '$lib/data/food-database';
  import { fly, scale, fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';

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

  // Click on a cell to start typing from there
  function handleCellClick(row: number, col: number) {
    if (gameComplete) return;
    
    const cell = grid[row][col];
    
    // Can only start from an existing letter
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
            const wordStartRow = w.row;
            return r >= wordStartRow - 1 && r < wordStartRow + w.word.length;
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
            const wordStartCol = w.col;
            return c >= wordStartCol - 1 && c < wordStartCol + w.word.length;
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

  // Scoring
  function calculateScore(): number {
    let score = 0;
    
    // 1 point per letter (excluding starting word)
    for (let i = 1; i < placedWords.length; i++) {
      score += placedWords[i].word.length;
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
    
    return score;
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
    
    const text = `🍽️ Daily Plate #${puzzleNumber}
${badge.emoji} ${badge.label}${groups.length >= 3 ? ' • Balanced!' : ''}
Score: ${Math.round($animatedScore)}
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
</script>

<!-- Listen for keyboard events at window level -->
<svelte:window onkeydown={handleKeydown} />

<div class="game-container">
  <header>
    <h1>🍽️ Daily Plate</h1>
    <p class="puzzle-number">#{puzzleNumber} · <button class="rules-link" onclick={() => showRules = true}>Rules</button></p>
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
    <div class="groups-bar">
      {#each ALL_GROUPS as group}
        {@const isUsed = placedWords.some(p => p.group === group)}
        <button 
          class="group-chip" 
          class:expanded={expandedGroup === group}
          class:used={isUsed}
          style="--group-color: {GROUP_COLORS[group]}"
          onclick={() => toggleGroupExpand(group)}
          title="{GROUP_NAMES[group]}"
        >
          <span class="chip-emoji">{GROUP_EMOJI[group]}</span>
          <span class="chip-name">{GROUP_NAMES[group]}</span>
          {#if isUsed}
            <span class="used-check">✓</span>
          {/if}
        </button>
      {/each}
    </div>
    
    {#if expandedGroup}
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
  </div>

  <!-- Grid Display -->
  <div class="grid-container">
    <div class="grid" style="--grid-size: {grid[0]?.length || gridSize}">
      {#each grid as row, r}
        {#each row as cell, c}
          {@const preview = isPreviewCell(r, c)}
          <div 
            class="cell" 
            class:filled={cell.letter !== ''}
            class:crossing={cell.wordIndices.length > 1}
            class:clickable={cell.letter !== '' && !gameComplete}
            class:selected={selectedCell?.row === r && selectedCell?.col === c}
            class:preview={preview.isPreview}
            class:preview-existing={preview.isPreview && preview.isExisting}
            onclick={() => handleCellClick(r, c)}
          >
            {#if preview.isPreview && preview.letter && !preview.isExisting}
              <span class="letter new-letter">{preview.letter}</span>
            {:else if cell.letter}
              <span class="letter" in:scale={{ duration: 200 }}>
                {cell.letter}
              </span>
            {/if}
          </div>
        {/each}
      {/each}
    </div>
  </div>

  <!-- Placed Words Legend -->
  <div class="words-legend">
    {#each placedWords as placed, i}
      <div 
        class="word-item" 
        class:changeable={placed.entry.groups.length > 1}
        in:fly={{ y: 20, duration: 300, delay: i * 50 }}
        onclick={() => placed.entry.groups.length > 1 && changeWordGroup(i)}
      >
        <span class="group-badge" style="background: {GROUP_COLORS[placed.group]}">
          {GROUP_EMOJI[placed.group]}
        </span>
        <span class="word-text">{placed.word}</span>
        <span class="group-name" style="color: {GROUP_COLORS[placed.group]}">{GROUP_NAMES[placed.group]}</span>
        {#if placed.entry.groups.length > 1}
          <button 
            class="change-group-btn" 
            onclick={(e) => { e.stopPropagation(); changeWordGroup(i); }} 
            title="Change food group"
          >↔</button>
        {/if}
        {#if i > 0}
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
          
          <h4>🌟 Scoring</h4>
          <ul>
            <li><strong>+1 point</strong> per letter</li>
            <li><strong>+10 points</strong> per unique food group</li>
            <li><strong>+50 bonus</strong> for using all 11 groups</li>
            <li><strong>+25 bonus</strong> for completing 11 words</li>
          </ul>
          
          <h4>🌈 Food Groups</h4>
          <p class="group-list">
            🥬 Vegetable • 🍎 Fruit • 🌾 Grain • 🍗 Protein • 🥛 Dairy • 🫘 Legume • 🥜 Nuts • 🫒 Fats • 🧂 Spices • 🍽️ Prepared • 🥤 Beverage
          </p>
          
          <h4>💡 Tips</h4>
          <ul>
            <li>Some foods belong to multiple groups — tap to choose!</li>
            <li>Aim for variety to maximize your score</li>
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
        <p class="complete-badge">Complete!</p>
        
        {#if getGroupsUsed().length >= 3}
          <p class="balanced">🌈 Balanced!</p>
        {/if}
        
        <div class="achievement">
          <span class="badge">{getAchievementBadge().emoji}</span>
          <span class="label">{getAchievementBadge().label}</span>
        </div>
        
        <p class="final-score">Score: {Math.round($animatedScore)}</p>
        
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
  </div>
</div>

<style>
  .game-container {
    max-width: 500px;
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
    grid-template-columns: repeat(var(--grid-size), 28px);
    gap: 2px;
    background: #e5e7eb;
    padding: 4px;
    border-radius: 8px;
  }

  .cell {
    width: 28px;
    height: 28px;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: bold;
    font-size: 14px;
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
    border-width: 2px;
  }
  
  .group-chip.used::after {
    content: '';
    position: absolute;
    top: -3px;
    right: -3px;
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
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
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    padding: 0;
    transition: all 0.15s ease;
  }

  .delete-word-btn:hover {
    background: #dc2626;
    color: white;
    transform: scale(1.1);
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
  
  /* Mobile Portrait Responsive Styles */
  @media (max-width: 480px) {
    .game-container {
      padding: 0.5rem;
      max-width: 100%;
    }
    
    header h1 {
      font-size: 1.5rem;
    }
    
    .grid {
      grid-template-columns: repeat(var(--grid-size), 20px);
      gap: 1px;
      padding: 2px;
    }
    
    .cell {
      width: 20px;
      height: 20px;
      font-size: 11px;
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
    .grid {
      grid-template-columns: repeat(var(--grid-size), 16px);
    }
    
    .cell {
      width: 16px;
      height: 16px;
      font-size: 9px;
    }
    
    .chip-name {
      display: none;
    }
    
    .chip-emoji {
      font-size: 0.75rem;
    }
  }
</style>
