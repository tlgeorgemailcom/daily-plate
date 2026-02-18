<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Puzzle configuration
  const GRID_SIZE = 3;
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
  const EMPTY_TILE = TOTAL_TILES - 1; // 8 for 3x3
  const SHUFFLE_MOVES = 100;

  // Image path
  const puzzleImage = '/images/puzzle/daily-001.jpg';

  // Board state: array of tile IDs at each position
  // Index = position (0-8), Value = tile ID (0-8 where 8 is empty)
  let board = $state<number[]>([]);
  let initialBoard = $state<number[]>([]);
  let emptyPos = $state(EMPTY_TILE);
  let moves = $state(0);
  let isSolved = $state(false);
  let showPeek = $state(false);
  let isSolving = $state(false);
  let emptyHistory = $state<number[]>([]); // Sequence of empty positions during shuffle
  let solveSpeed = $state(800); // ms per move (600-1000)

  // Puzzle area dimensions
  let puzzleEl: HTMLDivElement;
  let tileSize = $state(100);

  // Drag state
  let draggingTile = $state<number | null>(null);
  let dragStartX = $state(0);
  let dragStartY = $state(0);
  let dragOffsetX = $state(0);
  let dragOffsetY = $state(0);
  let dragDeltaX = $state(0);
  let dragDeltaY = $state(0);
  let dragDirection = $state<'horizontal' | 'vertical' | null>(null);

  // Get solved board state
  function getSolvedBoard(): number[] {
    return Array.from({ length: TOTAL_TILES }, (_, i) => i);
  }

  // Get position (row, col) from index
  function getRowCol(index: number): { row: number; col: number } {
    return {
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE
    };
  }

  // Get index from row, col
  function getIndex(row: number, col: number): number {
    return row * GRID_SIZE + col;
  }

  // Get valid moves from current empty position
  function getValidMoves(emptyIndex: number): number[] {
    const { row, col } = getRowCol(emptyIndex);
    const moves: number[] = [];
    
    if (row > 0) moves.push(getIndex(row - 1, col)); // tile above can slide down
    if (row < GRID_SIZE - 1) moves.push(getIndex(row + 1, col)); // tile below can slide up
    if (col > 0) moves.push(getIndex(row, col - 1)); // tile left can slide right
    if (col < GRID_SIZE - 1) moves.push(getIndex(row, col + 1)); // tile right can slide left
    
    return moves;
  }

  // Swap tiles
  function swapTiles(boardState: number[], pos1: number, pos2: number): number[] {
    const newBoard = [...boardState];
    [newBoard[pos1], newBoard[pos2]] = [newBoard[pos2], newBoard[pos1]];
    return newBoard;
  }

  // Shuffle by making valid moves from solved state
  // Returns both the shuffled board and the sequence of empty positions (for solution playback)
  function shuffleBoard(): { board: number[]; emptyHistory: number[] } {
    let currentBoard = getSolvedBoard();
    let currentEmpty = EMPTY_TILE;
    let lastMove = -1;
    const emptyHistory: number[] = [EMPTY_TILE]; // Start position of empty

    for (let i = 0; i < SHUFFLE_MOVES; i++) {
      const validMoves = getValidMoves(currentEmpty).filter(m => m !== lastMove);
      const moveFrom = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      currentBoard = swapTiles(currentBoard, currentEmpty, moveFrom);
      lastMove = currentEmpty;
      currentEmpty = moveFrom;
      emptyHistory.push(currentEmpty); // Track where empty moved to
    }

    return { board: currentBoard, emptyHistory };
  }

  // Check if puzzle is solved
  function checkSolved(boardState: number[]): boolean {
    return boardState.every((tile, index) => tile === index);
  }

  // Manhattan distance heuristic for A*/IDA*
  function manhattanDistance(boardState: number[]): number {
    let distance = 0;
    for (let pos = 0; pos < boardState.length; pos++) {
      const tile = boardState[pos];
      if (tile === EMPTY_TILE) continue;
      
      const goalRow = Math.floor(tile / GRID_SIZE);
      const goalCol = tile % GRID_SIZE;
      const currentRow = Math.floor(pos / GRID_SIZE);
      const currentCol = pos % GRID_SIZE;
      
      distance += Math.abs(goalRow - currentRow) + Math.abs(goalCol - currentCol);
    }
    return distance;
  }

  // IDA* algorithm to find optimal solution
  function findOptimalSolution(startBoard: number[]): number[] {
    const startEmpty = startBoard.indexOf(EMPTY_TILE);
    
    // Quick check if already solved
    if (checkSolved(startBoard)) return [];
    
    const bound = manhattanDistance(startBoard);
    
    interface SearchResult {
      found: boolean;
      path: number[];
      newBound: number;
    }
    
    function search(
      boardState: number[], 
      emptyIdx: number, 
      g: number, 
      bound: number, 
      path: number[],
      lastEmpty: number
    ): SearchResult {
      const f = g + manhattanDistance(boardState);
      
      if (f > bound) {
        return { found: false, path: [], newBound: f };
      }
      
      if (checkSolved(boardState)) {
        return { found: true, path: [...path], newBound: f };
      }
      
      let minBound = Infinity;
      const neighbors = getValidMoves(emptyIdx);
      
      for (const neighborPos of neighbors) {
        // Don't go back to where we just came from
        if (neighborPos === lastEmpty) continue;
        
        // Make move
        const newBoard = swapTiles(boardState, emptyIdx, neighborPos);
        const newPath = [...path, neighborPos];
        
        const result = search(newBoard, neighborPos, g + 1, bound, newPath, emptyIdx);
        
        if (result.found) {
          return result;
        }
        
        if (result.newBound < minBound) {
          minBound = result.newBound;
        }
      }
      
      return { found: false, path: [], newBound: minBound };
    }
    
    let currentBound = bound;
    
    // IDA* main loop
    while (currentBound < 100) { // Safety limit
      const result = search(startBoard, startEmpty, 0, currentBound, [], -1);
      
      if (result.found) {
        return result.path;
      }
      
      if (result.newBound === Infinity) {
        break; // No solution (shouldn't happen with valid puzzle)
      }
      
      currentBound = result.newBound;
    }
    
    return []; // Fallback (shouldn't reach here)
  }

  // Initialize puzzle
  function initPuzzle() {
    const result = shuffleBoard();
    board = result.board;
    initialBoard = [...result.board];
    emptyHistory = result.emptyHistory;
    emptyPos = result.board.indexOf(EMPTY_TILE);
    moves = 0;
    isSolved = false;
    isSolving = false;
  }

  // Reset to initial shuffled state
  function resetPuzzle() {
    board = [...initialBoard];
    emptyPos = board.indexOf(EMPTY_TILE);
    moves = 0;
    isSolved = false;
    isSolving = false;
  }

  // New shuffle
  function newPuzzle() {
    initPuzzle();
  }

  // Move a tile if adjacent to empty
  function moveTile(tilePos: number) {
    if (isSolved || isSolving) return;
    
    const validMoves = getValidMoves(emptyPos);
    if (!validMoves.includes(tilePos)) return;

    board = swapTiles(board, emptyPos, tilePos);
    emptyPos = tilePos;
    moves++;

    if (checkSolved(board)) {
      isSolved = true;
    }
  }

  // Demonstrate optimal solution using IDA*
  async function demonstrateSolution() {
    if (isSolving || isSolved) return;
    
    isSolving = true;
    
    // First reset to initial state
    board = [...initialBoard];
    emptyPos = board.indexOf(EMPTY_TILE);
    moves = 0;
    
    // Find optimal solution path
    const solutionPath = findOptimalSolution([...board]);
    
    // Animate the optimal solution
    for (const targetPos of solutionPath) {
      await new Promise(resolve => setTimeout(resolve, solveSpeed));
      
      board = swapTiles(board, emptyPos, targetPos);
      emptyPos = targetPos;
      moves++;
    }
    
    // Mark as solved
    isSolved = true;
    isSolving = false;
  }

  // Get background position for a tile
  function getTileBackground(tileId: number): string {
    if (tileId === EMPTY_TILE) return 'none';
    
    const { row, col } = getRowCol(tileId);
    const offsetX = col * tileSize;
    const offsetY = row * tileSize;
    
    return `url('${puzzleImage}')`;
  }

  function getTileBackgroundPosition(tileId: number): string {
    const { row, col } = getRowCol(tileId);
    return `-${col * tileSize}px -${row * tileSize}px`;
  }

  function getTileBackgroundSize(): string {
    return `${tileSize * GRID_SIZE}px ${tileSize * GRID_SIZE}px`;
  }

  // Drag handlers
  function handlePointerDown(e: PointerEvent, position: number) {
    if (isSolved || isSolving) return;
    
    const tileId = board[position];
    if (tileId === EMPTY_TILE) return;

    // Check if this tile can move (adjacent to empty)
    const validMoves = getValidMoves(emptyPos);
    if (!validMoves.includes(position)) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    draggingTile = position;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragDeltaX = 0;
    dragDeltaY = 0;
    dragDirection = null;

    // Determine allowed direction based on empty position
    const tileRC = getRowCol(position);
    const emptyRC = getRowCol(emptyPos);
    
    if (tileRC.row === emptyRC.row) {
      dragDirection = 'horizontal';
    } else {
      dragDirection = 'vertical';
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (draggingTile === null) return;

    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;

    const tileRC = getRowCol(draggingTile);
    const emptyRC = getRowCol(emptyPos);

    if (dragDirection === 'horizontal') {
      // Constrain to movement toward empty space
      const maxDelta = (emptyRC.col - tileRC.col) * tileSize;
      if (maxDelta > 0) {
        dragDeltaX = Math.max(0, Math.min(deltaX, maxDelta));
      } else {
        dragDeltaX = Math.min(0, Math.max(deltaX, maxDelta));
      }
      dragDeltaY = 0;
    } else if (dragDirection === 'vertical') {
      const maxDelta = (emptyRC.row - tileRC.row) * tileSize;
      if (maxDelta > 0) {
        dragDeltaY = Math.max(0, Math.min(deltaY, maxDelta));
      } else {
        dragDeltaY = Math.min(0, Math.max(deltaY, maxDelta));
      }
      dragDeltaX = 0;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (draggingTile === null) return;

    // Check if dragged more than 50% of tile size
    const threshold = tileSize * 0.5;
    const shouldMove = Math.abs(dragDeltaX) > threshold || Math.abs(dragDeltaY) > threshold;

    if (shouldMove) {
      moveTile(draggingTile);
    }

    draggingTile = null;
    dragDeltaX = 0;
    dragDeltaY = 0;
    dragDirection = null;
  }

  // Peek at solution
  function togglePeek() {
    showPeek = true;
    setTimeout(() => {
      showPeek = false;
    }, 1500);
  }

  // Calculate tile size based on container
  function updateTileSize() {
    if (puzzleEl) {
      const containerSize = Math.min(puzzleEl.clientWidth, 360);
      tileSize = Math.floor(containerSize / GRID_SIZE);
    }
  }

  onMount(() => {
    updateTileSize();
    initPuzzle();

    const resizeObserver = new ResizeObserver(() => {
      updateTileSize();
    });
    resizeObserver.observe(puzzleEl);

    return () => resizeObserver.disconnect();
  });
</script>

<svelte:head>
  <title>Food Slider | Daily Food Chain</title>
</svelte:head>

<div class="slider-game">
  <header class="game-header">
    <h1>🧩 Food Slider</h1>
    <div class="moves-display">Moves: {moves}</div>
  </header>

  <div class="puzzle-container" bind:this={puzzleEl}>
    {#if showPeek}
      <div class="peek-overlay">
        <img src={puzzleImage} alt="Solution" class="peek-image" />
      </div>
    {:else}
      <div 
        class="puzzle-grid"
        style="width: {tileSize * GRID_SIZE}px; height: {tileSize * GRID_SIZE}px;"
      >
        {#each board as tileId, position}
          {@const isBeingDragged = draggingTile === position}
          {@const { row, col } = getRowCol(position)}
          {@const showTileImage = tileId !== EMPTY_TILE || isSolved}
          <div
            class="tile"
            class:empty={tileId === EMPTY_TILE && !isSolved}
            class:dragging={isBeingDragged}
            class:solved={isSolved}
            style="
              width: {tileSize}px;
              height: {tileSize}px;
              left: {col * tileSize + (isBeingDragged ? dragDeltaX : 0)}px;
              top: {row * tileSize + (isBeingDragged ? dragDeltaY : 0)}px;
              background-image: {showTileImage ? getTileBackground(tileId) : 'none'};
              background-position: {showTileImage ? getTileBackgroundPosition(tileId) : '0 0'};
              background-size: {getTileBackgroundSize()};
            "
            onpointerdown={(e) => handlePointerDown(e, position)}
            onpointermove={handlePointerMove}
            onpointerup={handlePointerUp}
            onpointercancel={handlePointerUp}
          >
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if isSolved}
    <div class="solved-banner">
      {#if moves > 0}
        🎉 Solved in {moves} moves! Tap New to play again.
      {:else}
        🎉 Solved! Tap Reset to try again.
      {/if}
    </div>
  {/if}

  <div class="controls">
    <button class="btn" onclick={togglePeek} disabled={isSolved || showPeek || isSolving}>
      👁️ Peek
    </button>
    <button class="btn" onclick={demonstrateSolution} disabled={isSolved || isSolving}>
      💡 Solution
    </button>
    <button class="btn" onclick={resetPuzzle} disabled={moves === 0 || isSolving}>
      ↩️ Reset
    </button>
  </div>

  <div class="speed-control">
    <label>
      <span class="speed-label">Solution Speed: {solveSpeed >= 1000 ? '1s' : `${solveSpeed}ms`}/move</span>
      <input 
        type="range" 
        min="600" 
        max="1500" 
        step="100"
        bind:value={solveSpeed}
        disabled={isSolving}
      />
      <span class="speed-range">Fast ← → Slow</span>
    </label>
  </div>

  <div class="instructions">
    <p>Drag tiles to slide them into the empty space. Arrange the tiles to complete the image.</p>
  </div>
</div>

<style>
  .slider-game {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .game-header h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  .moves-display {
    font-size: 1.125rem;
    font-weight: 600;
    color: #3b82f6;
  }

  .puzzle-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    max-width: 360px;
    margin: 0 auto;
    background: #1e293b;
    border-radius: 0.5rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .puzzle-grid {
    position: relative;
    touch-action: none;
  }

  .tile {
    position: absolute;
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    cursor: grab;
    user-select: none;
    touch-action: none;
    transition: box-shadow 0.15s;
  }

  .tile:active {
    cursor: grabbing;
  }

  .tile.empty {
    background: transparent;
    border: none;
    cursor: default;
  }

  .tile.solved {
    border: none;
    cursor: default;
  }

  .tile.dragging {
    z-index: 10;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    transition: none;
  }

  .peek-overlay {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  .peek-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 0.25rem;
  }

  .solved-banner {
    text-align: center;
    padding: 0.75rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    font-weight: 600;
    border-radius: 0.5rem;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn.primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  .btn.primary:hover {
    background: #2563eb;
    border-color: #2563eb;
  }

  .speed-control {
    text-align: center;
  }

  .speed-control label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .speed-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .speed-control input[type="range"] {
    width: 180px;
    cursor: pointer;
  }

  .speed-range {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .instructions {
    text-align: center;
    color: #64748b;
    font-size: 0.875rem;
  }

  .instructions p {
    margin: 0;
  }
</style>
