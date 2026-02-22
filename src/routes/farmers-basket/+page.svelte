<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { 
    createGameState, LEVELS, GRID_WIDTH, GRID_HEIGHT, TOTAL_HEIGHT, PANTRY_HEIGHT,
    GRID_COLS, GRID_ROWS, CELL_SIZE, pixelToGrid, gridToPixel, snapToGrid
  } from '$lib/farmers-basket/game-state.svelte';
  import Animal from '$lib/farmers-basket/Animal.svelte';
  import Farmer from '$lib/farmers-basket/Farmer.svelte';
  import Basket from '$lib/farmers-basket/Basket.svelte';
  import FoodSource from '$lib/farmers-basket/FoodSource.svelte';
  import Toolbar from '$lib/farmers-basket/Toolbar.svelte';
  import Barrier from '$lib/farmers-basket/Barrier.svelte';
  import { FOOD_EMOJI, TOOL_EMOJI } from '$lib/farmers-basket/types';
  import type { ToolType, FoodType } from '$lib/farmers-basket/types';
  
  let game = createGameState();
  
  // Touch controls - target position for farmer to walk toward
  let touchTarget: { x: number; y: number } | null = $state(null);
  let gameAreaElement: HTMLDivElement | null = null;
  
  // Tap gesture detection
  let touchStartTime = 0;
  let touchStartPos: { x: number; y: number } | null = null;
  let hasMoved = false;
  let isDraggingFarmer = false;  // Only true if touch started on farmer
  let touchDragTool: ToolType | null = $state(null);  // Tool being touch-dragged
  
  // Placement cursor for keyboard tool placement
  // When a tool is selected, this shows where it will be placed
  let placementCursor = $state<{ col: number; row: number } | null>(null);
  
  // Selected barrier for repositioning with keyboard
  let selectedBarrierId = $state<string | null>(null);
  
  // Initialize cursor at farmer position when tool is selected
  $effect(() => {
    if (game.selectedTool && !placementCursor) {
      const farmerGrid = pixelToGrid(game.farmer.position);
      placementCursor = { col: farmerGrid.col, row: farmerGrid.row };
    } else if (!game.selectedTool) {
      placementCursor = null;
    }
  });
  
  // Clear selected barrier if it no longer exists
  $effect(() => {
    if (selectedBarrierId && !game.barriers.find(b => b.id === selectedBarrierId)) {
      selectedBarrierId = null;
    }
  });
  
  function handleKeyDown(e: KeyboardEvent) {
    // Tab cycles through placed barriers for repositioning
    if (e.key === 'Tab' && game.gameStatus === 'playing') {
      e.preventDefault();
      
      if (game.barriers.length === 0) return;
      
      // Clear tool selection when entering barrier edit mode
      if (game.selectedTool) {
        game.selectTool(null);
        placementCursor = null;
      }
      
      if (!selectedBarrierId) {
        // Select first barrier
        selectedBarrierId = game.barriers[0].id;
      } else {
        // Cycle to next barrier
        const currentIndex = game.barriers.findIndex(b => b.id === selectedBarrierId);
        const nextIndex = (currentIndex + 1) % game.barriers.length;
        selectedBarrierId = game.barriers[nextIndex].id;
      }
      return;
    }
    
    // When a barrier is selected for repositioning
    if (selectedBarrierId) {
      const barrier = game.barriers.find(b => b.id === selectedBarrierId);
      if (!barrier) {
        selectedBarrierId = null;
        return;
      }
      
      const currentGrid = pixelToGrid(barrier.position);
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        const newPos = gridToPixel({ col: Math.max(0, currentGrid.col - 1), row: currentGrid.row });
        game.moveBarrier(selectedBarrierId, newPos.x, newPos.y);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        const newPos = gridToPixel({ col: Math.min(GRID_COLS - 1, currentGrid.col + 1), row: currentGrid.row });
        game.moveBarrier(selectedBarrierId, newPos.x, newPos.y);
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        const newPos = gridToPixel({ col: currentGrid.col, row: Math.max(0, currentGrid.row - 1) });
        game.moveBarrier(selectedBarrierId, newPos.x, newPos.y);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        const newPos = gridToPixel({ col: currentGrid.col, row: Math.min(GRID_ROWS - 1, currentGrid.row + 1) });
        game.moveBarrier(selectedBarrierId, newPos.x, newPos.y);
        return;
      }
      
      // Enter or Escape deselects barrier
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        selectedBarrierId = null;
        return;
      }
    }
    
    // When a tool is selected, arrows move the placement cursor
    if (game.selectedTool && placementCursor) {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        placementCursor = { 
          col: Math.max(0, placementCursor.col - 1), 
          row: placementCursor.row 
        };
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        placementCursor = { 
          col: Math.min(GRID_COLS - 1, placementCursor.col + 1), 
          row: placementCursor.row 
        };
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        placementCursor = { 
          col: placementCursor.col, 
          row: Math.max(0, placementCursor.row - 1) 
        };
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        placementCursor = { 
          col: placementCursor.col, 
          row: Math.min(GRID_ROWS - 1, placementCursor.row + 1) 
        };
        return;
      }
      
      // Space or Enter confirms tool placement at cursor
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const pos = gridToPixel(placementCursor);
        game.placeToolAt(pos.x, pos.y);
        placementCursor = null;
        return;
      }
      
      // Escape cancels tool selection
      if (e.key === 'Escape') {
        e.preventDefault();
        game.selectTool(null);
        placementCursor = null;
        return;
      }
    }
    
    // Normal mode: Arrow keys move farmer one cell at a time
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      e.preventDefault();
      game.moveFarmerByCell(-1, 0);
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
      e.preventDefault();
      game.moveFarmerByCell(1, 0);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'w') {
      e.preventDefault();
      game.moveFarmerByCell(0, -1);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
      e.preventDefault();
      game.moveFarmerByCell(0, 1);
      return;
    }
    
    // Tool selection with number keys
    if (e.key >= '1' && e.key <= '5') {
      const toolIndex = parseInt(e.key) - 1;
      const tools: ToolType[] = ['net', 'decoy', 'fence', 'lid', 'scarecrow'];
      if (toolIndex < tools.length) {
        game.selectTool(tools[toolIndex]);
        // Initialize cursor at farmer position
        const farmerGrid = pixelToGrid(game.farmer.position);
        placementCursor = { col: farmerGrid.col, row: farmerGrid.row };
      }
      return;
    }
    
    // Escape to deselect tool
    if (e.key === 'Escape') {
      game.selectTool(null);
      placementCursor = null;
      return;
    }
    
    // Space to pick up food (only when no tool selected)
    if (e.key === ' ') {
      e.preventDefault();
      game.pickupFood();
      return;
    }
    
    // Enter to drop food in basket
    if (e.key === 'Enter') {
      game.dropFood();
      return;
    }
  }
  
  function handleKeyUp(e: KeyboardEvent) {
    // No longer need to track held keys for grid movement
  }
  
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });
  
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    game.stopLevel();
  });
  
  // Handle click on game area to place tools
  function handleGameClick(e: MouseEvent) {
    if (!game.selectedTool) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    game.placeToolAt(x, y);
  }
  
  // Handle drag over game area (allow drop)
  function handleDragOver(e: DragEvent) {
    if (game.gameStatus !== 'playing') return;
    
    // Allow drop for tools from toolbar or barrier repositioning
    if (e.dataTransfer?.types.includes('application/tool-type') ||
        e.dataTransfer?.types.includes('application/barrier-id')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = e.dataTransfer.types.includes('application/barrier-id') ? 'move' : 'copy';
    }
  }
  
  // Handle drop on game area
  function handleDrop(e: DragEvent) {
    if (game.gameStatus !== 'playing') return;
    e.preventDefault();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if dropping a new tool from toolbar
    const toolType = e.dataTransfer?.getData('application/tool-type');
    if (toolType) {
      game.placeToolByDrag(toolType as any, x, y);
      return;
    }
    
    // Check if repositioning an existing barrier
    const barrierId = e.dataTransfer?.getData('application/barrier-id');
    if (barrierId) {
      game.moveBarrier(barrierId, x, y);
      return;
    }
  }
  
  // Touch handlers for mobile movement
  function handleTouchStart(e: TouchEvent) {
    // Only handle touch when game is playing
    if (game.gameStatus !== 'playing') return;
    if (game.selectedTool) return; // Don't move when placing tools
    
    // If touch-dragging a tool, don't start farmer movement
    if (touchDragTool) return;
    
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Calculate actual scale from rendered vs logical size
    const scale = rect.width / GRID_WIDTH;
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    // Check if touch started near the farmer (within 50px)
    const farmerDist = Math.sqrt(
      Math.pow(x - game.farmer.position.x, 2) + 
      Math.pow(y - game.farmer.position.y, 2)
    );
    isDraggingFarmer = farmerDist < 50;
    
    // Track for tap gesture detection
    touchStartTime = Date.now();
    touchStartPos = { x, y };
    hasMoved = false;
    
    // Don't set touchTarget yet - wait until user actually drags
    // This prevents the farmer from jumping on tap
    if (isDraggingFarmer) {
      e.preventDefault();
    }
  }
  
  function handleTouchMove(e: TouchEvent) {
    // Only handle touch when game is playing
    if (game.gameStatus !== 'playing') return;
    if (game.selectedTool) return;
    
    // Tool dragging is handled by document-level listeners
    if (touchDragTool) return;
    
    if (!isDraggingFarmer) return;  // Only move if touch started on farmer
    
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const scale = rect.width / GRID_WIDTH;
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    // Check if moved significantly (more than 15px in game coords)
    if (touchStartPos) {
      const dist = Math.sqrt(
        Math.pow(x - touchStartPos.x, 2) + Math.pow(y - touchStartPos.y, 2)
      );
      if (dist > 15) {
        hasMoved = true;
        // Only start moving the farmer once drag is confirmed
        touchTarget = { x, y };
        game.setTouchTarget({ x, y });
        e.preventDefault(); // Only prevent default when actually dragging
      }
    }
    
    // Update position if already dragging
    if (hasMoved) {
      touchTarget = { x, y };
      game.setTouchTarget({ x, y });
      e.preventDefault();
    }
  }
  
  function handleTouchEnd(e: TouchEvent) {
    // Tool dragging is handled by document-level listeners
    if (touchDragTool) return;
    
    // Detect tap gesture: short duration and minimal movement
    const tapDuration = Date.now() - touchStartTime;
    const isTap = tapDuration < 300 && !hasMoved;
    
    // Tap on farmer area: pickup or deposit
    if (isTap && isDraggingFarmer && game.gameStatus === 'playing') {
      if (game.farmer.carrying) {
        game.dropFood();
      } else {
        game.pickupFood();
      }
    }
    
    touchTarget = null;
    game.setTouchTarget(null);
    touchStartPos = null;
    isDraggingFarmer = false;
  }
  
  // Tool inventory for toolbar - all tools always unlocked
  // Order: 1.Net 2.Decoy 3.Fence 4.Lid 5.Scarecrow
  const toolSlots = $derived([
    { type: 'net' as ToolType, remaining: game.tools.net, unlocked: true },
    { type: 'decoy' as ToolType, remaining: game.tools.decoy, unlocked: true },
    { type: 'fence' as ToolType, remaining: game.tools.fence, unlocked: true },
    { type: 'lid' as ToolType, remaining: game.tools.lid, unlocked: true },
    { type: 'scarecrow' as ToolType, remaining: game.tools.scarecrow, unlocked: true },
  ]);

  // Collected food for basket (only what's actually deposited)
  const collectedFood = $derived(
    game.foods.filter(f => f.inBasket).map(f => f.type)
  );
  
  // Handle tool touch drag from toolbar - uses document-level events to track drag from toolbar to game area
  function handleToolTouchDragStart(tool: ToolType) {
    touchDragTool = tool;
    
    // Add document-level touch listeners
    document.addEventListener('touchmove', handleToolTouchMove, { passive: false });
    document.addEventListener('touchend', handleToolTouchEnd);
    document.addEventListener('touchcancel', handleToolTouchEnd);
  }
  
  function handleToolTouchMove(e: TouchEvent) {
    if (!touchDragTool || !gameAreaElement) return;
    
    e.preventDefault(); // Prevent scrolling while dragging tool
    
    const touch = e.touches[0];
    const rect = gameAreaElement.getBoundingClientRect();
    const scale = rect.width / GRID_WIDTH;
    
    // Calculate position relative to game area
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    // Only show cursor if touch is within game area bounds
    if (x >= 0 && x <= GRID_WIDTH && y >= 0 && y <= TOTAL_HEIGHT) {
      touchTarget = { x, y };
    } else {
      touchTarget = null;
    }
  }
  
  function handleToolTouchEnd(e: Event) {
    // Remove document listeners
    document.removeEventListener('touchmove', handleToolTouchMove);
    document.removeEventListener('touchend', handleToolTouchEnd);
    document.removeEventListener('touchcancel', handleToolTouchEnd);
    
    // Place tool if we have a valid position
    if (touchDragTool && touchTarget) {
      game.placeToolByDrag(touchDragTool, touchTarget.x, touchTarget.y);
    }
    
    touchDragTool = null;
    touchTarget = null;
  }
</script>

<svelte:head>
  <title>Farmer's Basket</title>
</svelte:head>

<div class="game-container">
  <header class="header">
    <h1>🧑‍🌾 Farmer's Basket</h1>
    <div class="level-info">
      Level {game.currentLevel?.id ?? '?'}: {game.currentLevel?.name ?? 'Loading...'}
    </div>
    <div class="recipe-display">
      <span class="recipe-label">Collect:</span>
      {#each game.currentLevel?.recipe ?? [] as food}
        <span class="recipe-item" class:collected={collectedFood.includes(food)}>
          {FOOD_EMOJI[food]}
          {#if collectedFood.includes(food)}
            <span class="check">✓</span>
          {/if}
        </span>
      {/each}
    </div>
  </header>
  
  <div class="toolbar-area">
    <Toolbar 
      tools={toolSlots}
      selectedTool={game.selectedTool}
      onselect={(t) => game.selectTool(t)}
      ontouchdragstart={handleToolTouchDragStart}
    />
  </div>
  
  <div 
    class="game-area"
    class:placing-mode={game.selectedTool !== null}
    style="width: {GRID_WIDTH}px; height: {TOTAL_HEIGHT}px;"
    onclick={handleGameClick}
    ondragover={handleDragOver}
    ondrop={handleDrop}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    bind:this={gameAreaElement}
    role="application"
    aria-label="Game area"
  >
    <!-- Touch target indicator (only for farmer movement, not tool dragging) -->
    {#if touchTarget && !touchDragTool}
      <div class="touch-target" style="left: {touchTarget.x}px; top: {touchTarget.y}px;"></div>
    {/if}
    
    <!-- Placement cursor for keyboard tool placement -->
    {#if placementCursor && game.selectedTool}
      {@const cursorPos = gridToPixel(placementCursor)}
      <div 
        class="placement-cursor" 
        style="left: {cursorPos.x}px; top: {cursorPos.y}px; width: {CELL_SIZE}px; height: {CELL_SIZE}px;"
      >
        <span class="cursor-tool">{TOOL_EMOJI[game.selectedTool]}</span>
        <span class="cursor-hint">↵</span>
      </div>
    {/if}
    
    <!-- Touch drag tool indicator -->
    {#if touchDragTool && touchTarget}
      {@const snapPos = snapToGrid(touchTarget)}
      <div 
        class="placement-cursor touch-drag" 
        style="left: {snapPos.x}px; top: {snapPos.y}px; width: {CELL_SIZE}px; height: {CELL_SIZE}px;"
      >
        <span class="cursor-tool">{TOOL_EMOJI[touchDragTool]}</span>
        <span class="cursor-hint">👆</span>
      </div>
    {/if}
    
    <!-- Background grass (main game area) -->
    <div class="grass-background" style="height: {GRID_HEIGHT}px;"></div>
    
    <!-- Pantry area (below main game) -->
    <div class="pantry-area" style="top: {GRID_HEIGHT}px; height: {PANTRY_HEIGHT}px;"></div>
    
    <!-- Grid lines overlay (main game area only) -->
    <div class="grid-overlay" style="height: {GRID_HEIGHT}px;"></div>
    
    <!-- Food sources at bottom with quantities -->
    {#each game.foodSources as source}
      <FoodSource
        type={source.type}
        position={source.position}
        remaining={source.remaining}
      />
    {/each}
    
    <!-- Placed barriers/tools -->
    {#each game.barriers as barrier}
      <Barrier 
        id={barrier.id}
        type={barrier.type}
        position={barrier.position}
        selected={barrier.id === selectedBarrierId}
      />
    {/each}
    
    <!-- Animals -->
    {#each game.animals as animal}
      <Animal {animal} />
    {/each}
    
    <!-- Farmer -->
    <Farmer 
      state={game.farmer.state}
      position={game.farmer.position}
      carrying={game.farmer.carrying ? FOOD_EMOJI[game.farmer.carrying] : null}
      direction={game.farmer.direction}
    />
    
    <!-- Basket -->
    <Basket 
      contents={collectedFood}
    />
  </div>
  
  <!-- Game status overlays -->
  {#if game.gameStatus === 'won'}
    <div class="overlay win">
      <div class="overlay-content">
        <h2>🎉 Level Complete!</h2>
        <p>You gathered all the ingredients!</p>
        {#if game.levelIndex < LEVELS.length - 1}
          <button onclick={() => game.nextLevel()}>Next Level →</button>
        {:else}
          <p>Congratulations! You've completed all levels!</p>
          <button onclick={() => game.initLevel(0)}>Play Again</button>
        {/if}
      </div>
    </div>
  {/if}
  
  {#if game.gameStatus === 'lost'}
    <div class="overlay lose">
      <div class="overlay-content">
        <h2>😢 The animals got everything!</h2>
        <p>Don't worry, try again!</p>
        <button onclick={() => game.initLevel(game.levelIndex)}>Retry Level</button>
      </div>
    </div>
  {/if}
  
  {#if !game.gameStatus || game.gameStatus === 'ready'}
    <div class="overlay start">
      <div class="overlay-content">
        <h2>{game.currentLevel?.name ?? 'Loading'}</h2>
        <p>Collect: {game.currentLevel?.recipe?.map(f => FOOD_EMOJI[f]).join(' ') ?? ''}</p>
        <p class="hint desktop-hint">Use arrow keys to move, Space to pick up food</p>
        <p class="hint mobile-hint">Drag farmer to move • Tap when near food/basket</p>
        <button onclick={() => game.startLevel()}>Start Level</button>
      </div>
    </div>
  {/if}
  
  <footer class="controls-help desktop-only">
    {#if selectedBarrierId}
      <span class="mode-indicator">✋ Move Tool</span>
      <span>⬆️⬇️⬅️➡️ Move tool</span>
      <span>Tab: Next tool</span>
      <span>Enter/Esc: Done</span>
    {:else if game.selectedTool}
      <span class="mode-indicator">🎯 Place Tool</span>
      <span>⬆️⬇️⬅️➡️ Move cursor</span>
      <span>Enter: Place tool</span>
      <span>Esc: Cancel</span>
    {:else}
      <span>⬆️⬇️⬅️➡️ Move farmer</span>
      <span>Space: Pick up</span>
      <span>Enter: Drop in basket</span>
      <span>1-5: Select tool</span>
      <span>Tab: Edit tools</span>
    {/if}
  </footer>
  
  <!-- Mobile gesture hints -->
  <div class="mobile-controls">
    <div class="gesture-hint">
      <span class="gesture-icon">👆</span>
      <span class="gesture-text">Drag to move • Tap when near {game.farmer.carrying ? 'basket 🧺' : 'food 🥬'}</span>
    </div>
  </div>
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(180deg, #87CEEB 0%, #90EE90 100%);
    padding: 20px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .header {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .header h1 {
    font-size: 2rem;
    margin: 0;
    color: #5D4037;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
  }
  
  .level-info {
    font-size: 1rem;
    color: #795548;
  }
  
  .recipe-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    padding: 6px 16px;
    background: rgba(255,255,240,0.9);
    border-radius: 20px;
    border: 2px solid #8B4513;
  }
  
  .recipe-label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #5D4037;
  }
  
  .recipe-item {
    position: relative;
    font-size: 1.5rem;
    transition: opacity 0.2s;
  }
  
  .recipe-item.collected {
    opacity: 0.5;
    filter: grayscale(0.5);
  }
  
  .recipe-item .check {
    position: absolute;
    top: -4px;
    right: -4px;
    font-size: 0.7rem;
    color: #4CAF50;
    font-weight: bold;
    background: white;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
  }
  
  .toolbar-area {
    margin-bottom: 10px;
  }
  
  .game-area {
    position: relative;
    background: #7CB342;
    border: 4px solid #5D4037;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    overflow: hidden;
    cursor: default;
  }
  
  .game-area.placing-mode {
    cursor: crosshair;
  }
  
  .grass-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: 
      radial-gradient(circle at 20% 30%, #8BC34A 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, #9CCC65 0%, transparent 30%),
      radial-gradient(circle at 40% 80%, #8BC34A 0%, transparent 35%),
      #7CB342;
  }
  
  /* Pantry area - distinct zone for food sources */
  .pantry-area {
    position: absolute;
    left: 0;
    right: 0;
    background: 
      linear-gradient(to bottom, #5D4037 0%, #4E342E 100%);
    border-top: 3px solid #3E2723;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
  }
  
  /* Grid overlay - 13x9 cells, each 50x50px (main game area only) */
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    background-image: 
      linear-gradient(to right, rgba(139, 69, 19, 0.15) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(139, 69, 19, 0.15) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 1;
  }
  
  .overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.6);
    z-index: 100;
  }
  
  .overlay-content {
    background: #FFFDE7;
    border: 4px solid #8B4513;
    border-radius: 16px;
    padding: 30px 50px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }
  
  .overlay-content h2 {
    font-size: 1.8rem;
    margin: 0 0 10px;
    color: #5D4037;
  }
  
  .overlay-content p {
    margin: 10px 0;
    color: #795548;
  }
  
  .overlay-content .hint {
    font-size: 0.9rem;
    color: #9E9E9E;
  }
  
  .overlay-content button {
    margin-top: 15px;
    padding: 12px 30px;
    font-size: 1.2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
  }
  
  .overlay-content button:hover {
    background: #43A047;
    transform: scale(1.05);
  }
  
  .win .overlay-content {
    border-color: #FFD700;
    background: linear-gradient(180deg, #FFF8E1, #FFFDE7);
  }
  
  .lose .overlay-content {
    border-color: #D32F2F;
  }
  
  .controls-help {
    margin-top: 15px;
    display: flex;
    gap: 20px;
    font-size: 0.85rem;
    color: #5D4037;
    background: rgba(255,255,255,0.7);
    padding: 8px 16px;
    border-radius: 8px;
  }
  
  .controls-help span {
    white-space: nowrap;
  }
  
  .mode-indicator {
    background: #FFD700;
    color: #5D4037;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
  }
  
  /* Touch target indicator */
  .touch-target {
    position: absolute;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    margin-top: -10px;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    pointer-events: none;
    animation: pulse 0.8s ease-out infinite;
    z-index: 50;
  }
  
  /* Placement cursor for keyboard tool placement */
  .placement-cursor {
    position: absolute;
    transform: translate(-50%, -50%);
    border: 3px dashed #FFD700;
    border-radius: 8px;
    background: rgba(255, 215, 0, 0.2);
    pointer-events: none;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: cursor-pulse 0.6s ease-in-out infinite alternate;
  }
  
  @keyframes cursor-pulse {
    from { 
      border-color: #FFD700;
      background: rgba(255, 215, 0, 0.2);
    }
    to { 
      border-color: #FFA000;
      background: rgba(255, 160, 0, 0.3);
    }
  }
  
  .cursor-tool {
    font-size: 28px;
    opacity: 0.8;
  }
  
  .cursor-hint {
    position: absolute;
    bottom: -18px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #FFD700;
    background: rgba(0, 0, 0, 0.7);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }
  
  /* Touch drag tool indicator */
  .placement-cursor.touch-drag {
    border-color: #00BFFF;
    background: rgba(0, 191, 255, 0.3);
  }
  
  .placement-cursor.touch-drag .cursor-hint {
    color: #00BFFF;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  
  /* Mobile controls */
  .mobile-controls {
    display: none;
    margin-top: 15px;
  }
  
  .gesture-hint {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.8);
    padding: 12px 20px;
    border-radius: 20px;
    font-size: 1rem;
    color: #5D4037;
  }
  
  .gesture-icon {
    font-size: 1.4rem;
  }
  
  .gesture-text {
    font-weight: 500;
  }
  
  .mobile-hint {
    display: none;
  }
  
  /* Tablet sizing (larger game) */
  @media (min-width: 768px) and (max-width: 1024px) and (pointer: coarse) {
    .game-area {
      transform: scale(1.2);
      transform-origin: top center;
      margin-bottom: 80px;
    }
  }
  
  /* Large tablet / iPad Pro */
  @media (min-width: 1024px) and (pointer: coarse) {
    .game-area {
      transform: scale(1.4);
      transform-origin: top center;
      margin-bottom: 150px;
    }
  }
  
  /* Responsive: show mobile controls on touch devices */
  @media (pointer: coarse), (max-width: 768px) {
    .mobile-controls {
      display: flex;
    }
    
    .desktop-only, .desktop-hint {
      display: none;
    }
    
    .mobile-hint {
      display: block;
    }
    
    .game-area {
      max-width: calc(100vw - 20px);
      touch-action: none;
    }
    
    .game-container {
      padding: 10px;
    }
    
    .header h1 {
      font-size: 1.5rem;
    }
  }
  
  /* Phone (smaller screens) - scale down if needed */
  @media (max-width: 620px) and (pointer: coarse) {
    .game-area {
      transform: scale(calc((100vw - 20px) / 600));
      transform-origin: top center;
      margin-bottom: -50px;
    }
  }
  
  @media (pointer: fine) and (min-width: 769px) {
    .mobile-hint {
      display: none;
    }
  }
</style>
