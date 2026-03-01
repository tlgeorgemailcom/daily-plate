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
  import RecipeBook from '$lib/farmers-basket/RecipeBook.svelte';
  import ShareRecipe from '$lib/farmers-basket/ShareRecipe.svelte';
  import { FOOD_EMOJI, TOOL_EMOJI, ANIMAL_EMOJI } from '$lib/farmers-basket/types';
  import type { ToolType, FoodType } from '$lib/farmers-basket/types';
  
  let game = createGameState();
  
  // Recipe book modal state - start open to show Recipe of the Day
  let showRecipeBook = $state(true);
  let showRecipeOfDay = $state(true);
  
  // Share recipe modal state
  let showShareRecipe = $state(false);
  
  // Rules modal state
  let showRules = $state(false);
  
  // Touch controls - target position for farmer to walk toward
  let touchTarget: { x: number; y: number } | null = $state(null);
  let gameAreaElement: HTMLDivElement | null = null;
  
  // Responsive scaling for mobile
  let gameScale = $state(1);
  let scaledWidth = $derived(GRID_WIDTH * gameScale);
  let scaledHeight = $derived(TOTAL_HEIGHT * gameScale);
  
  // Calculate scale based on available space
  function updateGameScale() {
    if (typeof window === 'undefined') return;
    
    // Available space - minimal padding (5px each side = 10px)
    const containerPadding = 10;
    const availableWidth = window.innerWidth - containerPadding;
    const availableHeight = window.innerHeight - 220; // Room for header, toolbar, footer
    
    // Calculate scale to fit entirely within viewport
    const scaleX = availableWidth / GRID_WIDTH;
    const scaleY = availableHeight / TOTAL_HEIGHT;
    
    // Use the smaller scale to ensure it fits, cap at 1 (don't enlarge on desktop)
    const newScale = Math.min(scaleX, scaleY, 1);
    
    // Minimum scale to keep game playable (0.35 for very small phones)
    gameScale = Math.max(newScale, 0.35);
  }
  
  onMount(() => {
    updateGameScale();
    window.addEventListener('resize', updateGameScale);
    window.addEventListener('orientationchange', updateGameScale);
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateGameScale);
      window.removeEventListener('orientationchange', updateGameScale);
    }
  });
  
  // Mouse controls for desktop farmer movement
  let isDraggingFarmerMouse = false;
  let mouseTarget: { x: number; y: number } | null = $state(null);
  
  // Tap gesture detection
  let touchStartTime = 0;
  let touchStartPos: { x: number; y: number } | null = null;
  let hasMoved = false;
  let isDraggingFarmer = false;  // Only true if touch started on farmer
  let touchDragTool: ToolType | null = $state(null);  // Tool being touch-dragged from toolbar
  let touchDragBarrierId: string | null = $state(null);  // Barrier being touch-dragged to reposition
  let lastTouchTime = 0;  // Prevent click events from firing after touch on mobile
  
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
    // Skip game controls when a modal is open
    if (showRecipeBook || showShareRecipe) {
      return;
    }
    
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
  
  // Document-level touch handlers for tool/barrier dragging (always active)
  function handleDocumentTouchMove(e: TouchEvent) {
    // Handle either new tool placement or existing barrier repositioning
    const isDragging = touchDragTool || touchDragBarrierId;
    if (!isDragging || !gameAreaElement) {
      return;
    }
    
    e.preventDefault(); // Prevent scrolling while dragging
    
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
  
  function handleDocumentTouchEnd() {
    // Handle new tool placement
    if (touchDragTool) {
      if (touchTarget) {
        game.placeToolByDrag(touchDragTool, touchTarget.x, touchTarget.y);
      }
      touchDragTool = null;
      touchTarget = null;
      return;
    }
    
    // Handle barrier repositioning
    if (touchDragBarrierId) {
      if (touchTarget) {
        game.moveBarrier(touchDragBarrierId, touchTarget.x, touchTarget.y);
      }
      touchDragBarrierId = null;
      touchTarget = null;
      return;
    }
  }
  
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // Always-active document listeners for tool dragging (like game-area listeners for farmer)
    document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false });
    document.addEventListener('touchend', handleDocumentTouchEnd);
    document.addEventListener('touchcancel', handleDocumentTouchEnd);
    
    // Load community recipes
    loadCommunityRecipes();
  });
  
  // Load approved community recipes from server
  async function loadCommunityRecipes() {
    try {
      const res = await fetch('/api/recipes/approved');
      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        game.addCommunityRecipes(data.recipes);
      }
    } catch (err) {
      console.warn('Failed to load community recipes:', err);
    }
  }
  
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('touchmove', handleDocumentTouchMove);
    document.removeEventListener('touchend', handleDocumentTouchEnd);
    document.removeEventListener('touchcancel', handleDocumentTouchEnd);
    game.stopLevel();
  });
  
  // Handle click on game area to place tools or interact with farmer
  function handleGameClick(e: MouseEvent) {
    if (game.gameStatus !== 'playing') return;
    
    // Prevent click from firing after touch on mobile (browsers fire both)
    if (Date.now() - lastTouchTime < 500) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const scale = rect.width / GRID_WIDTH;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    // If tool selected, place it
    if (game.selectedTool) {
      game.placeToolAt(x, y);
      return;
    }
    
    // Check if clicked near farmer (within 50px) - toggle pickup/drop
    const farmerDist = Math.sqrt(
      Math.pow(x - game.farmer.position.x, 2) + 
      Math.pow(y - game.farmer.position.y, 2)
    );
    if (farmerDist < 50) {
      if (game.farmer.carrying) {
        game.dropFood();
      } else {
        game.pickupFood();
      }
    }
  }
  
  // Handle mouse down on game area - start farmer drag
  function handleMouseDown(e: MouseEvent) {
    if (game.gameStatus !== 'playing') return;
    if (game.selectedTool) return;  // Don't drag farmer when placing tools
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const scale = rect.width / GRID_WIDTH;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    // Check if mouse started near the farmer (within 50px)
    const farmerDist = Math.sqrt(
      Math.pow(x - game.farmer.position.x, 2) + 
      Math.pow(y - game.farmer.position.y, 2)
    );
    if (farmerDist < 50) {
      isDraggingFarmerMouse = true;
      e.preventDefault();
    }
  }
  
  // Handle mouse move on game area - move farmer while dragging
  function handleMouseMove(e: MouseEvent) {
    if (!isDraggingFarmerMouse) return;
    if (game.gameStatus !== 'playing') return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const scale = rect.width / GRID_WIDTH;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    mouseTarget = { x, y };
    game.setTouchTarget({ x, y });  // Reuse touch target system for movement
    e.preventDefault();
  }
  
  // Handle mouse up - stop farmer drag
  function handleMouseUp(e: MouseEvent) {
    if (isDraggingFarmerMouse) {
      isDraggingFarmerMouse = false;
      mouseTarget = null;
      game.setTouchTarget(null);
    }
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
    
    // If touch-dragging a tool or barrier, don't start farmer movement
    if (touchDragTool || touchDragBarrierId) return;
    
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Calculate actual scale from rendered vs logical size
    const scale = rect.width / GRID_WIDTH;
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    // Check if touch started near the farmer (within 60px for easier touch on mobile)
    const farmerDist = Math.sqrt(
      Math.pow(x - game.farmer.position.x, 2) + 
      Math.pow(y - game.farmer.position.y, 2)
    );
    isDraggingFarmer = farmerDist < 60;
    
    // Track for tap gesture detection
    touchStartTime = Date.now();
    touchStartPos = { x, y };
    hasMoved = false;
    
    // Prevent default to stop scroll interference when touching game area
    e.preventDefault();
  }
  
  function handleTouchMove(e: TouchEvent) {
    // Only handle touch when game is playing
    if (game.gameStatus !== 'playing') return;
    if (game.selectedTool) return;
    
    // Tool/barrier dragging is handled by document-level listeners
    if (touchDragTool || touchDragBarrierId) return;
    
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
    // Tool/barrier dragging is handled by document-level listeners
    if (touchDragTool || touchDragBarrierId) return;
    
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
    
    // Record touch time to prevent duplicate click event
    lastTouchTime = Date.now();
    
    touchTarget = null;
    game.setTouchTarget(null);
    touchStartPos = null;
    isDraggingFarmer = false;
  }
  
  // Tool inventory for toolbar - all tools always unlocked
  // Order: 1.Net 2.Decoy 3.Fence 4.Wall 5.Lid 6.Scarecrow
  const toolSlots = $derived([
    { type: 'net' as ToolType, remaining: game.tools.net, unlocked: true },
    { type: 'decoy' as ToolType, remaining: game.tools.decoy, unlocked: true },
    { type: 'fence' as ToolType, remaining: game.tools.fence, unlocked: true },
    { type: 'wall' as ToolType, remaining: game.tools.wall, unlocked: true },
    { type: 'lid' as ToolType, remaining: game.tools.lid, unlocked: true },
    { type: 'scarecrow' as ToolType, remaining: game.tools.scarecrow, unlocked: true },
  ]);

  // Collected food for basket (only what's actually deposited)
  const collectedFood = $derived(
    game.foods.filter(f => f.inBasket).map(f => f.type)
  );
  
  // Recently stolen food types (for visual feedback)
  const recentlyStolen = $derived(
    game.theftLog
      .filter(t => Date.now() - t.timestamp < 3000)
      .map(t => t.foodType)
  );
  
  // Handle tool touch drag from toolbar - just sets state, document listeners handle the rest
  function handleToolTouchDragStart(tool: ToolType) {
    touchDragTool = tool;
  }
  
  // Handle placed barrier touch drag - for repositioning existing barriers
  function handleBarrierTouchDragStart(barrierId: string) {
    touchDragBarrierId = barrierId;
  }
</script>

<svelte:head>
  <title>Farmer's Basket</title>
</svelte:head>

<div class="game-container">
  
  <header class="header">
    <div class="header-top">
      <h1>🧑‍🌾 Farmer's Basket</h1>
      <div class="header-buttons">
        <button class="rules-btn" onclick={() => showRules = true}>
          Rules
        </button>
        <button class="recipe-book-btn" onclick={() => { showRecipeOfDay = false; showRecipeBook = true; }}>
          📖 Recipes
        </button>
      </div>
    </div>
    <div class="level-info">
      Level {game.currentLevel?.id ?? '?'}: {game.currentLevel?.name ?? 'Loading...'} 
      <span style="color: {game.gameStatus === 'playing' ? 'green' : 'red'}; font-weight: bold;">
        [{game.gameStatus}]
      </span>
    </div>
    <div class="recipe-display">
      <span class="recipe-label">Collect:</span>
      {#each game.currentLevel?.recipe ?? [] as food, i}
        {@const isCollected = collectedFood.filter(f => f === food).length > collectedFood.slice(0, collectedFood.indexOf(food)).filter(f => f === food).length || collectedFood.includes(food)}
        {@const isStolen = recentlyStolen.includes(food) && !collectedFood.includes(food)}
        <span 
          class="recipe-item" 
          class:collected={collectedFood.includes(food)}
          class:stolen={isStolen}
        >
          {FOOD_EMOJI[food]}
          {#if collectedFood.includes(food)}
            <span class="check">✓</span>
          {:else if isStolen}
            <span class="stolen-mark">!</span>
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
  
  <!-- Theft notification area -->
  {#if game.theftLog.length > 0}
    <div class="theft-notifications">
      {#each game.theftLog as theft (theft.id)}
        <div class="theft-entry" class:fresh={Date.now() - theft.timestamp < 3000}>
          <span class="thief-emoji">{ANIMAL_EMOJI[theft.animalType]}</span>
          <span class="theft-text">stolen</span>
          <span class="stolen-emoji">{FOOD_EMOJI[theft.foodType]}</span>
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Scaled game wrapper - takes up scaled dimensions -->
  <div class="game-scale-wrapper" style="width: {scaledWidth}px; height: {scaledHeight}px;">
    <div 
      class="game-area"
      class:placing-mode={game.selectedTool !== null}
      class:dragging-farmer={isDraggingFarmerMouse}
      style="width: {GRID_WIDTH}px; height: {TOTAL_HEIGHT}px; transform: scale({gameScale}); transform-origin: top left;"
    onclick={handleGameClick}
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseUp}
    ondragover={handleDragOver}
    ondrop={handleDrop}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    bind:this={gameAreaElement}
    role="application"
    aria-label="Game area"
  >
    <!-- Mouse/Touch target indicator (for farmer movement) -->
    {#if (touchTarget || mouseTarget) && !touchDragTool && !touchDragBarrierId}
      {@const target = mouseTarget || touchTarget}
      <div class="touch-target" style="left: {target?.x}px; top: {target?.y}px;"></div>
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
    
    <!-- Touch drag tool indicator (new tool from toolbar) -->
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
    
    <!-- Touch drag barrier indicator (repositioning existing barrier) -->
    {#if touchDragBarrierId && touchTarget}
      {@const snapPos = snapToGrid(touchTarget)}
      {@const draggedBarrier = game.barriers.find(b => b.id === touchDragBarrierId)}
      {#if draggedBarrier}
        <div 
          class="placement-cursor touch-drag" 
          style="left: {snapPos.x}px; top: {snapPos.y}px; width: {CELL_SIZE}px; height: {CELL_SIZE}px;"
        >
          <span class="cursor-tool">{TOOL_EMOJI[draggedBarrier.type]}</span>
          <span class="cursor-hint">↔️</span>
        </div>
      {/if}
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
        health={barrier.health}
        selected={barrier.id === selectedBarrierId}
        ontouchdragbarrier={handleBarrierTouchDragStart}
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
  </div> <!-- end game-scale-wrapper -->
  
  <!-- Game status overlays -->
  {#if game.gameStatus === 'won'}
    <div class="overlay win">
      <div class="overlay-content">
        <h2>🎉 Recipe Unlocked!</h2>
        <h3 class="recipe-title">{game.currentLevel?.name}</h3>
        
        {#if game.currentLevel?.recipeInstructions}
          <div class="unlocked-recipe">
            <div class="recipe-meta-win">
              {#if game.currentLevel.prepTime}<span>⏱️ {game.currentLevel.prepTime}</span>{/if}
              {#if game.currentLevel.servings}<span>🍽️ {game.currentLevel.servings}</span>{/if}
            </div>
            <ol class="recipe-steps">
              {#each game.currentLevel.recipeInstructions as step}
                <li>{step}</li>
              {/each}
            </ol>
          </div>
        {/if}
        
        <div class="win-buttons">
          <button onclick={() => { game.initLevel(game.levelIndex); showRecipeBook = true; }}>📖 Choose Next Recipe</button>
          <button class="secondary" onclick={() => { game.initLevel(game.levelIndex); game.startLevel(); }}>🔄 Play Again</button>
        </div>
      </div>
    </div>
  {/if}
  
  {#if game.gameStatus === 'lost'}
    <div class="overlay lose">
      <div class="overlay-content">
        <h2>😢 The animals got everything!</h2>
        <p>Don't worry, try again!</p>
        <div class="lose-buttons">
          <button onclick={() => { game.initLevel(game.levelIndex); game.startLevel(); }}>🔄 Try Again</button>
          <button class="secondary" onclick={() => { game.initLevel(game.levelIndex); showRecipeBook = true; }}>📖 Choose Another Recipe</button>
        </div>
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
        <button onclick={() => game.startLevel()}>▶️ Play</button>
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
  
  <!-- Scroll indicator for mobile -->
  <div class="scroll-indicator">
    <span class="scroll-arrow up">▲</span>
    <span class="scroll-arrow down">▼</span>
  </div>
</div>

<!-- Recipe Book Modal -->
{#if showRecipeBook}
  <RecipeBook 
    levels={game.allLevels}
    completedLevels={game.completedLevels}
    currentLevelId={game.currentLevel?.id ?? null}
    startWithRecipeOfDay={showRecipeOfDay}
    onselect={(id) => { game.loadLevel(id); game.startLevel(); showRecipeBook = false; showRecipeOfDay = true; }}
    onclose={() => { 
      showRecipeBook = false;
      showRecipeOfDay = true;
      // Auto-start if game is in ready state
      if (game.gameStatus === 'ready') {
        game.startLevel();
      }
    }}
    onshare={() => { showRecipeBook = false; showShareRecipe = true; }}
  />
{/if}

<!-- Share Recipe Modal -->
{#if showShareRecipe}
  <ShareRecipe 
    onclose={() => { showShareRecipe = false; showRecipeBook = true; }}
    onsubmit={() => { /* Recipe submitted successfully */ }}
  />
{/if}

<!-- Rules Modal -->
{#if showRules}
  <div class="modal-backdrop" onclick={() => showRules = false}>
    <div class="rules-modal" onclick={(e) => e.stopPropagation()}>
      <header class="rules-header">
        <h3>📖 How to Play</h3>
        <button class="modal-close-x" onclick={() => showRules = false} aria-label="Close">×</button>
      </header>
      
      <div class="rules-content">
        <p><strong>🧑‍🌾 Help the farmer collect ingredients!</strong></p>
        
        <h4>Goal</h4>
        <p>Collect all the foods shown in the recipe before the animals steal them!</p>
        
        <h4>Controls</h4>
        <ul>
          <li><strong>Move:</strong> Tap/click where you want the farmer to walk, or drag the farmer</li>
          <li><strong>Pick up:</strong> Tap a food source that the farmer is near to collect it</li>
          <li><strong>Drop off:</strong> Tap the basket when the farmer is near to deposit the food</li>
          <li><strong>Place tools:</strong> Select a tool, then tap in a cell or drag to place it on the field</li>
        </ul>
        
        <h4>Barriers & Tools</h4>
        <ul>
          <li>🧱 <strong>Bricks</strong> - Impassable for all ground animals AND farmer. Only birds fly over.</li>
          <li>🚧 <strong>Fence</strong> - Mouse passes instantly. Rabbit squeezes through (0.5s). Squirrel climbs (2s). Blocks fox/raccoon.</li>
          <li>🥅 <strong>Net</strong> - Rabbit digs under (4s). Mouse squeezes (1.5s). Squirrel climbs (2.5s). Blocks fox/raccoon.</li>
          <li>🍯 <strong>Honey Pot</strong> - Distracts all animals as they stop to eat the honey.</li>
          <li>🥏 <strong>Lid</strong> - Covers the basket so no animal can steal from it.</li>
          <li>🎃 <strong>Scarecrow</strong> - Repels birds from nearby cells.</li>
        </ul>
        
        <h4>Tips</h4>
        <ul>
          <li>The farmer cannot walk through barriers or animals - reposition them if stuck!</li>
          <li>Different animals target different foods (rabbits love carrots, mice love cheese, etc.)</li>
          <li>Place barriers strategically to slow or block animal paths!</li>
        </ul>
      </div>
      
      <button class="modal-close-btn" onclick={() => showRules = false}>
        Got it!
      </button>
    </div>
  </div>
{/if}

<style>
  .header {
    margin-bottom: 10px;
    text-align: center;
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    min-height: 100dvh;
    background: linear-gradient(180deg, #87CEEB 0%, #90EE90 100%);
    padding: 5px;
    font-family: system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }
  
  /* Scroll indicator - no longer needed since we use scaling */
  .scroll-indicator-edge {
    display: none;
  }

  .game-scale-wrapper {
    position: relative;
    overflow: hidden;
    /* Width and height set via inline style based on scale */
  }
  
  .toolbar-area {
    margin-bottom: 10px;
    overflow: hidden; /* Contain the scaled toolbar */
  }
  
  .header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  
  .header h1 {
    font-size: 2rem;
    margin: 0;
    color: #5D4037;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
  }
  
  .header-buttons {
    display: flex;
    gap: 8px;
  }

  .rules-btn {
    background: #607D8B;
    color: white;
    border: 2px solid #455A64;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .rules-btn:hover {
    background: #78909C;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
  }

  .rules-btn:active {
    transform: translateY(0);
  }

  .recipe-book-btn {
    background: #8B4513;
    color: white;
    border: 2px solid #5D4037;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .recipe-book-btn:hover {
    background: #A0522D;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
  }
  
  .recipe-book-btn:active {
    transform: translateY(0);
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
    transition: all 0.3s ease;
    padding: 2px 4px;
    border-radius: 6px;
    border: 2px solid transparent;
  }
  
  .recipe-item.collected {
    background: rgba(76, 175, 80, 0.2);
    border-color: #4CAF50;
  }
  
  .recipe-item.stolen {
    animation: stolen-flash 0.5s ease 3;
    border-color: #f44336;
    background: rgba(244, 67, 54, 0.2);
  }
  
  @keyframes stolen-flash {
    0%, 100% { transform: scale(1); background: rgba(244, 67, 54, 0.2); }
    50% { transform: scale(1.1); background: rgba(244, 67, 54, 0.4); }
  }
  
  .recipe-item .check {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 0.7rem;
    color: white;
    font-weight: bold;
    background: #4CAF50;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  
  .recipe-item .stolen-mark {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 0.7rem;
    color: white;
    font-weight: bold;
    background: #f44336;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    animation: pulse-warn 0.5s ease infinite;
  }
  
  @keyframes pulse-warn {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  /* Theft notifications area */
  .theft-notifications {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
    animation: alert-pulse 1s ease-in-out infinite;
  }
  
  @keyframes alert-pulse {
    0%, 100% { box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3); }
    50% { box-shadow: 0 2px 16px rgba(255, 0, 0, 0.6); }
  }
  
  .theft-entry {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 14px;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    animation: slide-in 0.3s ease-out;
  }
  
  .theft-entry.fresh {
    animation: slide-in 0.3s ease-out, shake-alert 0.5s ease-in-out 0.3s;
  }
  
  @keyframes slide-in {
    from { opacity: 0; transform: translateY(-10px) scale(0.9); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  @keyframes shake-alert {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  
  .thief-emoji {
    font-size: 20px;
  }
  
  .theft-text {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
  }
  
  .stolen-emoji {
    font-size: 20px;
  }
  
  .game-area {
    position: relative;
    background: #7CB342;
    border: 4px solid #5D4037;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    cursor: default;
    touch-action: none; /* Prevent browser gestures - game handles all touch */
    overflow: visible; /* Ensure children aren't clipped */
  }
  
  .game-area.placing-mode {
    cursor: crosshair;
  }
  
  .game-area.dragging-farmer {
    cursor: grabbing;
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
    max-width: 450px;
  }
  
  .recipe-title {
    color: #8B4513;
    margin: 0 0 12px 0;
    font-size: 1.3rem;
  }
  
  .unlocked-recipe {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    text-align: left;
    border: 2px solid #DEB887;
  }
  
  .recipe-meta-win {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 12px;
    justify-content: center;
  }
  
  .recipe-steps {
    margin: 0;
    padding-left: 24px;
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
  }
  
  .recipe-steps li {
    margin-bottom: 6px;
  }
  
  .win-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .win-buttons button.secondary {
    background: #8B4513;
    font-size: 0.9rem;
    padding: 8px 16px;
  }
  
  .win-buttons button.secondary:hover {
    background: #A0522D;
  }
  
  .lose-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    margin-top: 12px;
  }
  
  .lose-buttons button.secondary {
    background: #666;
    font-size: 0.9rem;
    padding: 8px 16px;
  }
  
  .lose-buttons button.secondary:hover {
    background: #888;
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
  
  /* Scroll indicator - narrow strip on right edge */
  .scroll-indicator {
    display: none; /* Hidden by default, show on mobile */
    position: fixed;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 6px 3px;
    background: rgba(139, 69, 19, 0.7);
    border-radius: 10px;
    z-index: 100;
  }
  
  .scroll-arrow {
    color: white;
    font-size: 12px;
    opacity: 0.9;
    animation: scroll-bounce 1.5s ease-in-out infinite;
  }
  
  .scroll-arrow.up {
    animation-delay: 0s;
  }
  
  .scroll-arrow.down {
    animation-delay: 0.75s;
  }
  
  @keyframes scroll-bounce {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  .mobile-hint {
    display: none;
  }
  
  /* Tablet sizing - now handled by JS scaling */
  /* Removed transform overrides that conflict with JS scaling */
  
  /* Responsive: show mobile controls on touch devices */
  @media (pointer: coarse), (max-width: 768px) {
    .mobile-controls {
      display: flex;
    }
    
    .scroll-indicator {
      display: flex;
    }
    
    .desktop-only, .desktop-hint {
      display: none;
    }
    
    .mobile-hint {
      display: block;
    }
    
    .game-container {
      padding: 10px;
      min-height: auto; /* Allow scrolling beyond viewport */
    }
    
    .header h1 {
      font-size: 1.5rem;
    }
  }
  
  /* Small screens */
  @media (max-width: 680px) {
    .game-container {
      padding: 8px;
    }
    
    .header h1 {
      font-size: 1.3rem;
    }
    
    .header-buttons {
      gap: 4px;
    }
    
    .rules-btn, .recipe-book-btn {
      padding: 4px 8px;
      font-size: 0.85rem;
    }
  }
  
  /* Very small screens */
  @media (max-width: 400px) {
    .game-container {
      padding: 6px;
      padding-right: 35px;
    }
    
    .header h1 {
      font-size: 1.1rem;
    }
    
    .level-info {
      font-size: 0.85rem;
    }
    
    .recipe-item {
      font-size: 1.2rem;
    }
    
    .toolbar-area {
      margin-bottom: 4px;
    }
  }
  
  /* Landscape on small screens */
  @media (max-height: 500px) and (orientation: landscape) {
    .game-container {
      padding: 4px;
      min-height: auto;
    }
    
    .header h1 {
      font-size: 1rem;
    }
    
    .level-info {
      font-size: 0.75rem;
    }
    
    .recipe-display {
      gap: 2px;
    }
    
    .recipe-item {
      font-size: 1rem;
    }
    
    .toolbar-area {
      margin-bottom: 2px;
    }
    
    .theft-notifications {
      max-height: 40px;
    }
  }
  
  /* Landscape on phone touch devices - add scroll padding on right */
  @media (pointer: coarse) and (max-height: 500px) and (orientation: landscape) {
    .game-container {
      padding-right: 40px; /* Space for scroll area in landscape */
    }
  }
  
  @media (pointer: fine) and (min-width: 769px) {
    .mobile-hint {
      display: none;
    }
  }

  /* Rules Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .rules-modal {
    background: white;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .rules-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #8B4513;
    border-radius: 12px 12px 0 0;
  }

  .rules-header h3 {
    margin: 0;
    color: white;
    font-size: 1.1rem;
  }
  
  .modal-close-x {
    background: #E53935;
    border: 2px solid white;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .modal-close-x:hover {
    background: #C62828;
  }

  .rules-content {
    font-size: 0.9rem;
    color: #333;
    padding: 1rem 1.5rem;
  }

  .rules-content h4 {
    margin: 1rem 0 0.5rem;
    color: #5D4037;
  }

  .rules-content ul {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  .rules-content li {
    margin: 0.25rem 0;
  }

  .modal-close-btn {
    display: block;
    width: calc(100% - 3rem);
    margin: 1rem 1.5rem 1.5rem;
    padding: 0.75rem;
    background: #8B4513;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }

  .modal-close-btn:hover {
    background: #A0522D;
  }
</style>
