<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createGameState, LEVELS, GRID_WIDTH, GRID_HEIGHT } from '$lib/farmers-basket/game-state.svelte';
  import Animal from '$lib/farmers-basket/Animal.svelte';
  import Farmer from '$lib/farmers-basket/Farmer.svelte';
  import Basket from '$lib/farmers-basket/Basket.svelte';
  import FoodSource from '$lib/farmers-basket/FoodSource.svelte';
  import Toolbar from '$lib/farmers-basket/Toolbar.svelte';
  import Barrier from '$lib/farmers-basket/Barrier.svelte';
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  import type { ToolType, FoodType } from '$lib/farmers-basket/types';
  
  let game = createGameState();
  
  // Touch controls - target position for farmer to walk toward
  let touchTarget: { x: number; y: number } | null = $state(null);
  let gameAreaElement: HTMLDivElement | null = null;
  
  // Tap gesture detection
  let touchStartTime = 0;
  let touchStartPos: { x: number; y: number } | null = null;
  let hasMoved = false;
  
  // Keyboard controls
  let keysPressed = new Set<string>();
  
  function handleKeyDown(e: KeyboardEvent) {
    keysPressed.add(e.key);
    
    // Tool selection with number keys
    if (e.key >= '1' && e.key <= '5') {
      const toolIndex = parseInt(e.key) - 1;
      const tools: ToolType[] = ['fence', 'decoy', 'umbrella', 'net', 'scarecrow'];
      if (toolIndex < tools.length) {
        game.selectTool(tools[toolIndex]);
      }
    }
    
    // Escape to deselect tool
    if (e.key === 'Escape') {
      game.selectTool(null);
    }
    
    // Space to pick up food or place tool
    if (e.key === ' ') {
      e.preventDefault();
      if (game.selectedTool) {
        game.placeTool();
      } else {
        game.pickupFood();
      }
    }
    
    // Enter to drop food
    if (e.key === 'Enter') {
      game.dropFood();
    }
  }
  
  function handleKeyUp(e: KeyboardEvent) {
    keysPressed.delete(e.key);
  }
  
  // Game loop for input
  let inputLoop: number;
  
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    inputLoop = window.setInterval(updateFarmerInput, 16);
  });
  
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    clearInterval(inputLoop);
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
  
  // Touch handlers for mobile movement
  function handleTouchStart(e: TouchEvent) {
    // Only handle touch when game is playing
    if (game.gameStatus !== 'playing') return;
    if (game.selectedTool) return; // Don't move when placing tools
    
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Calculate actual scale from rendered vs logical size
    const scale = rect.width / GRID_WIDTH;
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    // Track for tap gesture detection
    touchStartTime = Date.now();
    touchStartPos = { x, y };
    hasMoved = false;
    
    // Don't set touchTarget yet - wait until user actually drags
    // This prevents the farmer from jumping on tap
    e.preventDefault();
  }
  
  function handleTouchMove(e: TouchEvent) {
    // Only handle touch when game is playing
    if (game.gameStatus !== 'playing') return;
    if (game.selectedTool) return;
    
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Calculate actual scale from rendered vs logical size
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
  
  function handleTouchEnd() {
    // Detect tap gesture: short duration and minimal movement
    const tapDuration = Date.now() - touchStartTime;
    const isTap = tapDuration < 300 && !hasMoved;
    
    if (isTap && game.gameStatus === 'playing') {
      // Tap gesture: pickup or deposit based on context
      if (game.farmer.carrying) {
        // If carrying food, deposit it
        game.dropFood();
      } else {
        // If not carrying, try to pickup
        game.pickupFood();
      }
    }
    
    touchTarget = null;
    game.setTouchTarget(null);
    touchStartPos = null;
  }
  
  // Update farmer direction based on keys OR touch target
  function updateFarmerInput() {
    let dx = 0;
    let dy = 0;
    
    // Keyboard input
    if (keysPressed.has('ArrowLeft') || keysPressed.has('a')) dx -= 1;
    if (keysPressed.has('ArrowRight') || keysPressed.has('d')) dx += 1;
    if (keysPressed.has('ArrowUp') || keysPressed.has('w')) dy -= 1;
    if (keysPressed.has('ArrowDown') || keysPressed.has('s')) dy += 1;
    
    // Touch input (if no keyboard input) - just for visual indicator, actual movement handled by game state
    if (dx === 0 && dy === 0 && touchTarget) {
      // Touch target is handled directly by game.setTouchTarget()
      // No need to convert to dx/dy here
    }
    
    game.setFarmerInput(dx, dy);
  }
  
  // Tool inventory for toolbar
  const toolSlots = $derived([
    { type: 'fence' as ToolType, remaining: game.tools.fence, unlocked: true },
    { type: 'decoy' as ToolType, remaining: game.tools.decoy, unlocked: game.levelIndex >= 1 },
    { type: 'umbrella' as ToolType, remaining: game.tools.umbrella, unlocked: game.levelIndex >= 2 },
    { type: 'net' as ToolType, remaining: game.tools.net, unlocked: game.levelIndex >= 3 },
    { type: 'scarecrow' as ToolType, remaining: game.tools.scarecrow, unlocked: game.levelIndex >= 4 },
  ]);

  // Collected food for basket (only what's actually deposited)
  const collectedFood = $derived(
    game.foods.filter(f => f.inBasket).map(f => f.type)
  );
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
    />
  </div>
  
  <div 
    class="game-area"
    class:placing-mode={game.selectedTool !== null}
    style="width: {GRID_WIDTH}px; height: {GRID_HEIGHT}px;"
    onclick={handleGameClick}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    bind:this={gameAreaElement}
    role="application"
    aria-label="Game area"
  >
    <!-- Touch target indicator -->
    {#if touchTarget}
      <div class="touch-target" style="left: {touchTarget.x}px; top: {touchTarget.y}px;"></div>
    {/if}
    
    <!-- Background grass -->
    <div class="grass-background"></div>
    
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
        type={barrier.type}
        position={barrier.position}
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
    <span>⬆️⬇️⬅️➡️ Move</span>
    <span>Space: Pick up / Place</span>
    <span>Enter: Drop in basket</span>
    <span>1-5: Select tool</span>
    <span>Esc: Cancel</span>
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
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, #8BC34A 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, #9CCC65 0%, transparent 30%),
      radial-gradient(circle at 40% 80%, #8BC34A 0%, transparent 35%),
      #7CB342;
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
