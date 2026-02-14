<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { 
    MATCHING_FOODS, 
    getRandomFood,
    resetFoodHistory,
    canCatch, 
    isValidMeal, 
    getContainerEmoji,
    getMealDisplay,
    type MatchingFood, 
    type MealCategory 
  } from '$lib/data/matching-foods';
  import type { Container } from '$lib/stores/gameStore';

  // Game state
  let gameState = $state<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  let gameMode = $state<'training' | 'timed'>('timed');
  let score = $state(0);
  let level = $state(1);
  let highScore = $state(0);
  let wordsMatched = $state(0);
  let trainingCorrect = $state(0);  // Correct matches in training
  let trainingSpeed = $state(25);   // Training speed: 10 (slow) to 100 (fast)
  
  // Current falling word
  let currentFood = $state<MatchingFood | null>(null);
  let wordY = $state(0);
  let wordCaught = $state(false);
  let caughtByContainer = $state<Container | null>(null);
  
  // Explosion state
  let showExplosion = $state(false);
  let explosionX = $state(0);
  let explosionY = $state(0);
  
  // Animation
  let animationFrame: number;
  let lastTime = 0;
  
  // Game area dimensions
  let gameAreaEl: HTMLDivElement;
  let gameAreaHeight = $state(400);
  let gameAreaWidth = $state(300);
  
  // Dragging state
  let draggingContainer = $state<Container | null>(null);
  let dragX = $state(0);  // Viewport X for fixed positioning
  let dragY = $state(0);  // Viewport Y for fixed positioning
  let dragOffsetX = $state(0);  // Offset from click to button top-left
  let dragOffsetY = $state(0);
  let dragGameX = $state(0);  // Game-area relative X for collision
  let dragGameY = $state(0);  // Game-area relative Y for collision
  
  // Container dock positions (will be set on mount)
  let containerDockPositions = $state<Record<Container, {x: number, y: number}>>({
    plate: {x: 0, y: 0},
    bowl: {x: 0, y: 0},
    cup: {x: 0, y: 0},
    glass: {x: 0, y: 0},
    saucer: {x: 0, y: 0}
  });
  
  // Containers in order
  const containers: Container[] = ['plate', 'bowl', 'cup', 'glass', 'saucer'];
  const meals: MealCategory[] = ['breakfast', 'snack', 'lunch', 'beverage', 'dinner'];
  
  // Level speeds (pixels per second) for timed mode
  const levelSpeeds = [60, 90, 120, 150, 180];
  
  $effect(() => {
    if (browser) {
      const saved = localStorage.getItem('matching-highscore');
      if (saved) highScore = parseInt(saved) || 0;
    }
  });

  function saveHighScore() {
    if (browser && score > highScore) {
      highScore = score;
      localStorage.setItem('matching-highscore', String(highScore));
    }
  }
  
  function startTraining() {
    gameMode = 'training';
    score = 0;
    trainingCorrect = 0;
    gameState = 'playing';
    resetFoodHistory();  // Clear food history for fresh randomization
    // Defer spawning until game area is rendered
    setTimeout(() => {
      if (gameAreaEl) {
        const rect = gameAreaEl.getBoundingClientRect();
        gameAreaHeight = rect.height;
        gameAreaWidth = rect.width;
      }
      spawnWord();
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(gameLoop);
    }, 50);
  }
  
  function startGame() {
    gameMode = 'timed';
    score = 0;
    level = 1;
    wordsMatched = 0;
    gameState = 'playing';
    resetFoodHistory();  // Clear food history for fresh randomization
    // Defer spawning until game area is rendered
    setTimeout(() => {
      if (gameAreaEl) {
        const rect = gameAreaEl.getBoundingClientRect();
        gameAreaHeight = rect.height;
        gameAreaWidth = rect.width;
      }
      spawnWord();
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(gameLoop);
    }, 50);
  }
  
  function spawnWord() {
    currentFood = getRandomFood();
    wordY = 0;  // Always start from top
    wordCaught = false;
    caughtByContainer = null;
  }
  
  function gameLoop(time: number) {
    if (gameState !== 'playing') return;
    
    const delta = (time - lastTime) / 1000; // seconds
    lastTime = time;
    
    if (!wordCaught && currentFood) {
      // Training mode uses adjustable speed, timed mode uses level speeds
      const speed = gameMode === 'training' 
        ? trainingSpeed
        : levelSpeeds[Math.min(level - 1, levelSpeeds.length - 1)];
      wordY += speed * delta;
      
      // Check if word hit bottom
      if (wordY >= gameAreaHeight - 60) {
        triggerExplosion();
        setTimeout(spawnWord, 500);
      }
    }
    
    animationFrame = requestAnimationFrame(gameLoop);
  }
  
  function triggerExplosion() {
    showExplosion = true;
    explosionX = gameAreaWidth / 2 - 40;
    explosionY = gameAreaHeight - 80;
    setTimeout(() => {
      showExplosion = false;
    }, 600);
  }
  
  function handleContainerDragStart(container: Container, e: PointerEvent) {
    if (gameState !== 'playing') return;
    
    draggingContainer = container;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const gameRect = gameAreaEl.getBoundingClientRect();
    
    // Calculate offset from click point to button's top-left corner
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    
    // Set initial position (viewport coords for fixed positioning)
    dragX = rect.left;
    dragY = rect.top;
    
    // Game-area relative coords for collision detection
    dragGameX = rect.left - gameRect.left;
    dragGameY = rect.top - gameRect.top;
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  
  function handleContainerDrag(e: PointerEvent) {
    if (!draggingContainer || gameState !== 'playing') return;
    
    const gameRect = gameAreaEl.getBoundingClientRect();
    
    // Viewport coords (for fixed positioning) - subtract offset to keep cursor at click point
    dragX = e.clientX - dragOffsetX;
    dragY = e.clientY - dragOffsetY;
    
    // Game-area relative coords (for collision detection)
    dragGameX = e.clientX - dragOffsetX - gameRect.left;
    dragGameY = e.clientY - dragOffsetY - gameRect.top;
    
    // Check collision with falling word
    if (!wordCaught && currentFood) {
      // Generous hitboxes for easier catching
      const padding = 20; // Extra padding for forgiving collision
      const wordCenterX = gameAreaWidth / 2;
      const wordCenterY = wordY + 20; // Center of word (40px tall / 2)
      
      const containerCenterX = dragGameX + 35; // Center of container (70px / 2)
      const containerCenterY = dragGameY + 35;
      
      // Distance-based collision (more forgiving than rectangle overlap)
      const distX = Math.abs(wordCenterX - containerCenterX);
      const distY = Math.abs(wordCenterY - containerCenterY);
      
      // Catch if centers are within threshold
      const catchThresholdX = 70; // Horizontal catch zone
      const catchThresholdY = 50; // Vertical catch zone
      
      if (distX < catchThresholdX && distY < catchThresholdY) {
        // Check if correct container
        if (canCatch(currentFood, draggingContainer)) {
          wordCaught = true;
          caughtByContainer = draggingContainer;
        }
        // Wrong container: word passes through (no action needed)
      }
    }
  }
  
  function handleContainerDragEnd(e: PointerEvent) {
    if (!draggingContainer) return;
    
    // Check if dropped on a meal zone
    if (wordCaught && currentFood && caughtByContainer) {
      // Use center of container for drop detection
      const containerCenterX = dragGameX + 35;
      const containerCenterY = dragGameY + 35;
      
      // Check each meal zone (on the left side)
      const mealZoneWidth = 70;
      const mealZoneHeight = 60;
      const mealZoneX = 10;
      
      for (let i = 0; i < meals.length; i++) {
        const mealZoneY = 60 + i * 70;
        
        if (
          containerCenterX >= mealZoneX &&
          containerCenterX <= mealZoneX + mealZoneWidth &&
          containerCenterY >= mealZoneY &&
          containerCenterY <= mealZoneY + mealZoneHeight
        ) {
          // Dropped on this meal zone
          if (isValidMeal(currentFood, meals[i])) {
            // Correct match!
            if (gameMode === 'training') {
              trainingCorrect += 1;
            } else {
              score += 1;
              wordsMatched += 1;
              
              // Level up every 5 words
              if (wordsMatched % 5 === 0 && level < levelSpeeds.length) {
                level += 1;
              }
              
              saveHighScore();
            }
            spawnWord();
          }
          // Wrong meal: just release (word stays caught, can retry)
          break;
        }
      }
    }
    
    draggingContainer = null;
    caughtByContainer = null;
    wordCaught = false;
  }
  
  function endGame() {
    gameState = 'gameover';
    cancelAnimationFrame(animationFrame);
    if (gameMode === 'timed') {
      saveHighScore();
    }
  }
  
  function resetGame() {
    gameState = 'ready';
    score = 0;
    level = 1;
    wordsMatched = 0;
    currentFood = null;
  }
  
  onMount(() => {
    if (gameAreaEl) {
      const rect = gameAreaEl.getBoundingClientRect();
      gameAreaHeight = rect.height;
      gameAreaWidth = rect.width;
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div class="matching-game">
  <header class="game-header">
    <h1>🎯 Matching Containers</h1>
    <div class="mode-links">
      <button 
        class="mode-link" 
        class:active={gameMode === 'training'}
        onclick={startTraining}
      >
        📚 Train
      </button>
      <button 
        class="mode-link" 
        class:active={gameMode === 'timed'}
        onclick={startGame}
      >
        ▶️ Play
      </button>
    </div>
    {#if gameState === 'playing'}
      <div class="stats">
        {#if gameMode === 'training'}
          <span class="score">Correct: {trainingCorrect}</span>
          <div class="speed-control">
            <label for="speed">Speed:</label>
            <input 
              type="range" 
              id="speed" 
              min="10" 
              max="100" 
              step="5"
              bind:value={trainingSpeed}
            />
            <span class="speed-value">{trainingSpeed}</span>
          </div>
        {:else}
          <span class="score">Score: {score}</span>
          <span class="level">Level {level}</span>
          <span class="high">Best: {highScore}</span>
        {/if}
      </div>
    {/if}
  </header>
  
  {#if gameState === 'ready'}
    <div class="instructions">
      <p><strong>How to Play:</strong> Drag a container to catch the food, then drop it on the correct meal.</p>
    </div>
  {:else if gameState === 'gameover'}
    <div class="gameover-banner">
      {#if gameMode === 'training'}
        <p>You matched <strong>{trainingCorrect}</strong> foods correctly! Click a mode above to continue.</p>
      {:else}
        <p>Final Score: <strong>{score}</strong>{#if score >= highScore && score > 0} 🎉 New High Score!{/if}</p>
      {/if}
    </div>
  {:else}
    <div 
      class="game-area" 
      bind:this={gameAreaEl}
      onpointermove={handleContainerDrag}
    >
      <!-- Meal zones (left side) -->
      <div class="meal-zones">
        {#each meals as meal, i}
          <div class="meal-zone" style="top: {60 + i * 70}px">
            <span class="meal-label">{getMealDisplay(meal)}</span>
          </div>
        {/each}
      </div>
      
      <!-- Falling word -->
      {#if currentFood && !wordCaught}
        <div 
          class="falling-word" 
          class:training-word={gameMode === 'training'}
          style="top: {wordY}px; left: 50%; transform: translateX(-50%);"
        >
          {currentFood.display}
        </div>
        {#if gameMode === 'training'}
          <div class="training-hint" style="top: {wordY + 50}px;">
            <div class="hint-containers">
              Use: {currentFood.containers.map(c => getContainerEmoji(c)).join(' ')}
            </div>
            <div class="hint-meals">
              For: {currentFood.meals.map(m => getMealDisplay(m)).join(', ')}
            </div>
          </div>
        {/if}
      {/if}
      
      <!-- Word attached to dragging container -->
      {#if wordCaught && currentFood && draggingContainer}
        <div 
          class="caught-word"
          style="left: {dragGameX + 35}px; top: {dragGameY - 20}px;"
        >
          {currentFood.display}
        </div>
      {/if}
      
      <!-- Explosion effect -->
      {#if showExplosion}
        <div class="explosion" style="left: {explosionX}px; top: {explosionY}px;">
          💥
        </div>
      {/if}
      
      <!-- Container dock (right side) -->
      <div class="container-dock">
        {#each containers as container, i}
          <button
            class="container-btn"
            class:dragging={draggingContainer === container}
            style={draggingContainer === container ? `position: fixed; left: ${dragX}px; top: ${dragY}px; z-index: 100;` : ''}
            onpointerdown={(e) => handleContainerDragStart(container, e)}
            onpointerup={handleContainerDragEnd}
            onpointercancel={handleContainerDragEnd}
          >
            <span class="container-emoji">{getContainerEmoji(container)}</span>
            <span class="container-name">{container}</span>
          </button>
        {/each}
      </div>
      
      <!-- End game button -->
      <button class="end-btn" onclick={endGame}>
        ⏹️ End
      </button>
    </div>
  {/if}
</div>

<style>
  .matching-game {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .game-header {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .game-header h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .mode-links {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
  
  .mode-link {
    padding: 0.4rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    background: white;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .mode-link:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
  
  .mode-link.active {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
  }
  
  .instructions {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    margin-bottom: 1rem;
    color: #64748b;
  }
  
  .instructions p {
    margin: 0;
    font-size: 0.9rem;
  }
  
  .gameover-banner {
    text-align: center;
    padding: 1rem;
    background: linear-gradient(135deg, #22c55e20, #3b82f620);
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .gameover-banner p {
    margin: 0;
    font-size: 1rem;
  }
  
  .stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 0.5rem;
    font-size: 1rem;
    flex-wrap: wrap;
  }
  
  .speed-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }
  
  .speed-control label {
    color: #6b7280;
  }
  
  .speed-control input[type="range"] {
    width: 80px;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #e2e8f0;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .speed-control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .speed-control input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  .speed-value {
    min-width: 24px;
    text-align: right;
    color: #3b82f6;
    font-weight: 600;
  }
  
  .score {
    color: #22c55e;
    font-weight: 600;
  }
  
  .level {
    color: #3b82f6;
    font-weight: 600;
  }
  
  .high {
    color: #f59e0b;
    font-weight: 600;
  }
  
  .start-screen, .gameover-screen {
    text-align: center;
    padding: 2rem;
    background: #f8fafc;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
  }
  
  .start-screen h2, .gameover-screen h2 {
    margin: 0 0 1rem 0;
  }
  
  .start-screen ol {
    text-align: left;
    max-width: 300px;
    margin: 0 auto 1.5rem;
    line-height: 1.8;
  }
  
  .final-score {
    font-size: 1.5rem;
    font-weight: bold;
    color: #22c55e;
  }
  
  .new-high {
    font-size: 1.25rem;
    color: #f59e0b;
    animation: bounce 0.5s ease infinite alternate;
  }
  
  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }
  
  .start-btn {
    padding: 1rem 2rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  
  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  }
  
  .start-buttons, .gameover-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .training-btn {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
  
  .training-btn:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  .play-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }
  
  .secondary-btn {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  .secondary-btn:hover {
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
  }
  
  .btn-desc {
    font-size: 0.75rem;
    font-weight: 400;
    opacity: 0.9;
  }
  
  .mode {
    color: #3b82f6;
    font-weight: 600;
  }
  
  .game-area {
    position: relative;
    height: 500px;
    background: linear-gradient(180deg, #e0f2fe 0%, #f0fdf4 100%);
    border-radius: 16px;
    border: 2px solid #cbd5e1;
    overflow: hidden;
    touch-action: none;
  }
  
  .meal-zones {
    position: absolute;
    left: 10px;
    top: 0;
    width: 70px;
  }
  
  .meal-zone {
    position: absolute;
    width: 70px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px dashed #94a3b8;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s;
  }
  
  .meal-zone:hover {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.1);
  }
  
  .meal-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
  }
  
  .falling-word {
    position: absolute;
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e40af;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: wobble 0.5s ease-in-out infinite;
    white-space: nowrap;
  }
  
  .falling-word.training-word {
    animation: none;
    font-size: 1.5rem;
    padding: 0.75rem 1.5rem;
  }
  
  .training-hint {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #475569;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .hint-containers {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  .hint-meals {
    font-size: 0.75rem;
    color: #64748b;
  }
  
  @keyframes wobble {
    0%, 100% { transform: translateX(-50%) rotate(-1deg); }
    50% { transform: translateX(-50%) rotate(1deg); }
  }
  
  .caught-word {
    position: absolute;
    padding: 0.25rem 0.5rem;
    background: #22c55e;
    color: white;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    pointer-events: none;
    white-space: nowrap;
  }
  
  .explosion {
    position: absolute;
    font-size: 4rem;
    animation: explode 0.6s ease-out forwards;
    pointer-events: none;
  }
  
  @keyframes explode {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  
  .container-dock {
    position: absolute;
    right: 10px;
    top: 60px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .container-btn {
    width: 70px;
    height: 70px;
    background: white;
    border: 2px solid #cbd5e1;
    border-radius: 12px;
    cursor: grab;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: transform 0.1s, box-shadow 0.1s, border-color 0.2s;
    touch-action: none;
  }
  
  .container-btn:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }
  
  .container-btn:active, .container-btn.dragging {
    cursor: grabbing;
    border-color: #22c55e;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .container-emoji {
    font-size: 1.75rem;
  }
  
  .container-name {
    font-size: 0.625rem;
    font-weight: 600;
    color: #64748b;
    text-transform: capitalize;
  }
  
  .end-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .end-btn:hover {
    background: #dc2626;
  }
</style>
