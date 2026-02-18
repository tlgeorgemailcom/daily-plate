<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    getDailyPuzzle, 
    checkHit,
    type ComparePuzzle,
    type Difference 
  } from '$lib/data/compare-puzzles';

  // Game state
  let puzzle = $state<ComparePuzzle | null>(null);
  let differences = $state<Difference[]>([]);
  let foundCount = $state(0);
  let isSolved = $state(false);
  
  // Celebration animation state (confetti + reinforcing text)
  // diffNumber: which difference was found (1-4)
  // phase: for last diff, 1='OUTSTANDING!', 2='PERFECTO!'
  let celebrations = $state<{ x: number; y: number; id: number; diffNumber: number; phase: number }[]>([]);
  let celebrationId = 0;

  // Get celebration message based on which difference was found
  function getCelebrationMessage(diffNumber: number, phase: number): string {
    if (diffNumber === 4) {
      return phase === 1 ? 'OUTSTANDING!' : 'PERFECTO!';
    }
    const messages = ['', 'SPOT ON!', 'GOOD EYE!', 'EXCELLENT!'];
    return messages[diffNumber] || 'NICE!';
  }

  // Dev mode for coordinate picking
  let devMode = $state(false);
  let hoverX = $state(0);
  let hoverY = $state(0);
  let clickLog = $state<string[]>([]);

  // Image refs for coordinate calculation
  let imageARef: HTMLImageElement;
  let imageBRef: HTMLImageElement;

  function initGame() {
    puzzle = getDailyPuzzle();
    differences = puzzle.differences.map(d => ({ ...d, found: false }));
    foundCount = 0;
    isSolved = false;
    celebrations = [];
  }

  function handleDevToggle() {
    const password = prompt('Enter dev password:');
    if (password === '4444') {
      devMode = true;
    }
  }

  function handleImageClick(e: MouseEvent) {
    const img = e.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (devMode) {
      // In dev mode, log coordinates instead of playing
      const coord = `{ x: ${Math.round(x)}, y: ${Math.round(y)}, radius: 8 }`;
      clickLog = [...clickLog, coord];
      navigator.clipboard?.writeText(coord);
      return;
    }

    if (isSolved || !puzzle) return;

    const hitIndex = checkHit(x, y, differences);
    
    if (hitIndex >= 0) {
      // Found a difference!
      differences[hitIndex].found = true;
      foundCount++;
      
      // Check if all found
      const isLastDiff = foundCount === differences.length;
      
      // Trigger celebration at both image locations
      triggerCelebration(differences[hitIndex].x, differences[hitIndex].y, foundCount);
      
      if (isLastDiff) {
        isSolved = true;
      }
    }
    // Silent on wrong click (per spec)
  }

  function handleImageHover(e: MouseEvent) {
    if (!devMode) return;
    const img = e.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    hoverX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    hoverY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
  }

  function triggerCelebration(x: number, y: number, diffNumber: number) {
    const id = celebrationId++;
    celebrations = [...celebrations, { x, y, id, diffNumber, phase: 1 }];
    
    // For the last difference (4th), switch to second message after 800ms
    if (diffNumber === 4) {
      setTimeout(() => {
        celebrations = celebrations.map(c => 
          c.id === id ? { ...c, phase: 2 } : c
        );
      }, 800);
    }
    
    // Remove celebration after animation
    setTimeout(() => {
      celebrations = celebrations.filter(c => c.id !== id);
    }, diffNumber === 4 ? 2500 : 2000);
  }

  function newPuzzle() {
    initGame();
  }

  onMount(() => {
    initGame();
  });
</script>

<svelte:head>
  <title>Touch/Click the Difference | Daily Food Chain</title>
</svelte:head>

<div class="compare-game">
  <header class="game-header">
    <h1>👆 Touch/Click the Difference <button class="dev-toggle" onclick={handleDevToggle}>🛠️</button></h1>
    <div class="found-display">Found: {foundCount}/{differences.length}</div>
  </header>

  {#if devMode}
    <div class="dev-panel">
      <div class="coord-display">Hover: x: {hoverX}%, y: {hoverY}%</div>
      <div class="click-log">
        <strong>Clicked coordinates (copied to clipboard):</strong>
        {#each clickLog as coord, i}
          <div>{i + 1}. {coord}</div>
        {/each}
      </div>
      <button class="btn" onclick={() => clickLog = []}>Clear Log</button>
      <button class="btn" onclick={() => devMode = false}>Exit Dev Mode</button>
    </div>
  {/if}

  {#if puzzle}
    <div class="images-container">
      <!-- Image A -->
      <div class="image-wrapper">
        <img 
          src={puzzle.imageA} 
          alt="Image A" 
          class="puzzle-image"
          bind:this={imageARef}
          onclick={handleImageClick}
          onmousemove={handleImageHover}
        />
        
        <!-- Found circles -->
        {#each differences as diff}
          {#if diff.found}
            <div 
              class="found-circle"
              style="left: {diff.x}%; top: {diff.y}%; width: {diff.radius * 2}%; height: {diff.radius * 2}%;"
            ></div>
          {/if}
        {/each}
        
        <!-- Celebrations (confetti + Nice!/Perfect!) -->
        {#each celebrations as cel (cel.id)}
          <div 
            class="confetti-container"
            style="left: {cel.x}%; top: {cel.y}%;"
          >
            <div class="confetti confetti-1">●</div>
            <div class="confetti confetti-2">★</div>
            <div class="confetti confetti-3">◆</div>
            <div class="confetti confetti-4">♦</div>
            <div class="confetti confetti-5">●</div>
            <div class="confetti confetti-6">★</div>
            <div class="confetti confetti-7">◆</div>
            <div class="confetti confetti-8">♦</div>
          </div>
        {/each}
        
        <!-- Centered text -->
        {#each celebrations as cel (cel.id)}
          <div class="nice-text-container">
            <div class="nice-text" class:phase-change={cel.diffNumber === 4}>{getCelebrationMessage(cel.diffNumber, cel.phase)}</div>
          </div>
        {/each}
      </div>

      <!-- Image B -->
      <div class="image-wrapper">
        <img 
          src={puzzle.imageB} 
          alt="Image B" 
          class="puzzle-image"
          bind:this={imageBRef}
          onclick={handleImageClick}
          onmousemove={handleImageHover}
        />
        
        <!-- Found circles -->
        {#each differences as diff}
          {#if diff.found}
            <div 
              class="found-circle"
              style="left: {diff.x}%; top: {diff.y}%; width: {diff.radius * 2}%; height: {diff.radius * 2}%;"
            ></div>
          {/if}
        {/each}
        
        <!-- Celebrations (confetti + Nice!/Perfect!) -->
        {#each celebrations as cel (cel.id)}
          <div 
            class="confetti-container"
            style="left: {cel.x}%; top: {cel.y}%;"
          >
            <div class="confetti confetti-1">●</div>
            <div class="confetti confetti-2">★</div>
            <div class="confetti confetti-3">◆</div>
            <div class="confetti confetti-4">♦</div>
            <div class="confetti confetti-5">●</div>
            <div class="confetti confetti-6">★</div>
            <div class="confetti confetti-7">◆</div>
            <div class="confetti confetti-8">♦</div>
          </div>
        {/each}
        
        <!-- Centered text -->
        {#each celebrations as cel (cel.id)}
          <div class="nice-text-container">
            <div class="nice-text" class:phase-change={cel.diffNumber === 4}>{getCelebrationMessage(cel.diffNumber, cel.phase)}</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if isSolved}
    <div class="solved-banner">
      🎉 You found all the differences!
    </div>
  {/if}

  <div class="bottom-row">
    <div class="checkbox-row">
      {#each differences as diff, i}
        <div class="checkbox" class:checked={diff.found}>
          {#if diff.found}
            ☑
          {:else}
            ☐
          {/if}
        </div>
      {/each}
    </div>
    <button class="btn" onclick={newPuzzle}>
      🔄 Reset
    </button>
  </div>
</div>

<style>
  .compare-game {
    position: relative;
    width: calc(100vw - 2rem);
    max-width: 1200px;
    margin-left: calc(-50vw + 50% + 1rem);
    margin-right: calc(-50vw + 50% + 1rem);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Reset breakout on mobile since parent is already full width */
  @media (max-width: 600px) {
    .compare-game {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      padding: 0.5rem;
    }
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .dev-toggle {
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    background: white;
    cursor: pointer;
    opacity: 0.4;
    margin-left: 0.5rem;
    vertical-align: middle;
  }

  .dev-toggle:hover {
    opacity: 0.8;
  }

  .dev-panel {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 0.5rem;
    padding: 1rem;
    font-family: monospace;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .coord-display {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .click-log {
    margin: 0.5rem 0;
    max-height: 150px;
    overflow-y: auto;
  }

  .click-log div {
    padding: 0.125rem 0;
  }

  .game-header h1 {
    font-size: 1.25rem;
    margin: 0;
  }

  .found-display {
    font-size: 1.125rem;
    font-weight: 600;
    color: #3b82f6;
  }

  .images-container {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: flex-start;
  }

  .image-wrapper {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    line-height: 0;
    flex: 1 1 0;
    min-width: 200px;
    max-width: 700px;
  }

  /* Stack images on mobile - must come after base styles */
  @media (max-width: 600px) {
    .images-container {
      flex-direction: column;
      align-items: center;
    }

    .image-wrapper {
      flex: none;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }
  }

  .puzzle-image {
    display: block;
    width: 100%;
    height: auto;
    cursor: crosshair;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    touch-action: manipulation;
  }

  .found-circle {
    position: absolute;
    transform: translate(-50%, -50%);
    border: 3px solid #22c55e;
    border-radius: 50%;
    pointer-events: none;
    animation: circle-pop 0.3s ease-out;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
  }

  @keyframes circle-pop {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  .confetti-container {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .nice-text-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .nice-text {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(34,197,94,0.8);
    animation: nice-pop 1.8s ease-out forwards;
    white-space: nowrap;
  }

  .nice-text.phase-change {
    animation: nice-pop-final 2.3s ease-out forwards;
  }

  @keyframes nice-pop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    15% {
      transform: scale(1.3);
      opacity: 1;
    }
    25% {
      transform: scale(1);
      opacity: 1;
    }
    70% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-30px) scale(1);
      opacity: 0;
    }
  }

  @keyframes nice-pop-final {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    10% {
      transform: scale(1.3);
      opacity: 1;
    }
    20% {
      transform: scale(1);
      opacity: 1;
    }
    80% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-30px) scale(1);
      opacity: 0;
    }
  }

  .confetti {
    position: absolute;
    font-size: 1.5rem;
    color: white;
    text-shadow: 0 1px 3px rgba(0,0,0,0.6);
    animation: confetti-burst 1.5s ease-out forwards;
  }

  @keyframes confetti-burst {
    0% {
      transform: translate(0, 0) scale(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx, 30px), var(--ty, -30px)) scale(1) rotate(var(--rot, 180deg));
      opacity: 0;
    }
  }

  .confetti-1 { --tx: -40px; --ty: -45px; --rot: 180deg; animation-delay: 0ms; }
  .confetti-2 { --tx: 40px; --ty: -40px; --rot: -120deg; animation-delay: 50ms; }
  .confetti-3 { --tx: -50px; --ty: 10px; --rot: 200deg; animation-delay: 100ms; }
  .confetti-4 { --tx: 50px; --ty: 15px; --rot: -200deg; animation-delay: 150ms; }
  .confetti-5 { --tx: -20px; --ty: -55px; --rot: 150deg; animation-delay: 75ms; }
  .confetti-6 { --tx: 25px; --ty: -50px; --rot: -150deg; animation-delay: 125ms; }
  .confetti-7 { --tx: -35px; --ty: 35px; --rot: 220deg; animation-delay: 175ms; }
  .confetti-8 { --tx: 35px; --ty: 40px; --rot: -220deg; animation-delay: 200ms; }

  .solved-banner {
    text-align: center;
    padding: 0.5rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    font-weight: 600;
    border-radius: 0.5rem;
    animation: banner-pop 0.5s ease-out;
    margin-top: 0.5rem;
  }

  @keyframes banner-pop {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .bottom-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .checkbox-row {
    display: flex;
    gap: 0.5rem;
  }

  .checkbox {
    font-size: 1.25rem;
    color: #9ca3af;
    transition: all 0.2s;
  }

  .checkbox.checked {
    color: #22c55e;
  }

  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
</style>
