<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { 
    getTodaysPuzzle, 
    getWordGroups, 
    FOOD_GROUP_INFO,
    FOOD_WORDS,
    type FoodGroup 
  } from '$lib/data/scrambled-puzzles';

  // Game state
  let gamePhase = $state<'loading' | 'phase1' | 'phase2' | 'complete'>('loading');
  let letters = $state<string[]>([]);
  let validWords = $state<string[]>([]);
  let foundWords = $state<string[]>([]);
  let currentInput = $state('');
  let inputError = $state('');
  let puzzleDate = $state('');
  
  // Phase 2 state
  let classifiedWords = $state<Map<string, { group: FoodGroup; attempts: number }>>(new Map());
  let draggedWord = $state<string | null>(null);
  let showFeedback = $state<{ word: string; correct: boolean; hint?: string } | null>(null);
  
  // Touch drag state
  let touchDragPos = $state<{ x: number; y: number } | null>(null);
  let groupElements: Map<string, HTMLElement> = new Map();
  
  // Scoring - track counts instead of points
  let wordsFoundBeforeReveal = $state(0);  // Words found before "give up"
  let firstTryCorrect = $state(0);  // Classifications correct on first attempt
  
  // Give up state
  let gaveUp = $state(false);
  let revealedWords = $state<string[]>([]);
  
  // Show results state
  let showResults = $state(false);
  
  // Persistence key
  const STORAGE_KEY = 'scrambled-game-state';
  
  // Hints: count words starting with each letter
  let letterHints = $derived(() => {
    const hints = new Map<string, { total: number; found: number }>();
    for (const word of validWords) {
      const firstLetter = word[0];
      const existing = hints.get(firstLetter) || { total: 0, found: 0 };
      existing.total++;
      if (foundWords.includes(word)) {
        existing.found++;
      }
      hints.set(firstLetter, existing);
    }
    return hints;
  });
  
  // Check if phase 1 complete
  let phase1Complete = $derived(foundWords.length === validWords.length && validWords.length > 0);
  
  // Check if phase 2 complete
  let phase2Complete = $derived(() => {
    if (foundWords.length === 0) return false;
    return foundWords.every(word => classifiedWords.has(word));
  });
  
  // Calculated percentages
  let phase1Percent = $derived(() => {
    if (validWords.length === 0) return 0;
    return (wordsFoundBeforeReveal / validWords.length) * 100;
  });
  
  let phase2Percent = $derived(() => {
    if (foundWords.length === 0) return 0;
    return (firstTryCorrect / foundWords.length) * 100;
  });
  
  // Initialize game
  onMount(() => {
    // Failsafe: if still loading after 3 seconds, force start
    const failsafe = setTimeout(() => {
      if (gamePhase === 'loading') {
        console.warn('Scrambled: Failsafe triggered, forcing phase1');
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        const puzzle = getTodaysPuzzle();
        letters = puzzle.letters;
        validWords = puzzle.validWords;
        puzzleDate = puzzle.date;
        gamePhase = 'phase1';
      }
    }, 3000);
    
    try {
      const puzzle = getTodaysPuzzle();
      letters = puzzle.letters;
      validWords = puzzle.validWords;
      puzzleDate = puzzle.date;
      
      // Try to restore saved state
      if (browser) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const state = JSON.parse(saved);
            if (state.date === puzzleDate) {
              // Filter out any words that no longer exist in the word list
              const savedFoundWords = (state.foundWords || []) as string[];
              foundWords = savedFoundWords.filter(w => FOOD_WORDS.has(w));
              
              // Restore validWords if saved (for completed games)
              if (state.validWords && state.validWords.length > 0) {
                // Also filter validWords to only include words still in FOOD_WORDS
                validWords = (state.validWords as string[]).filter(w => FOOD_WORDS.has(w));
              }
              
              // Filter classifiedWords to only include valid words
              const savedClassified = state.classifiedWords || [];
              classifiedWords = new Map(
                savedClassified.filter(([word]: [string, unknown]) => FOOD_WORDS.has(word))
              );
              
              wordsFoundBeforeReveal = state.wordsFoundBeforeReveal || 0;
              firstTryCorrect = state.firstTryCorrect || 0;
              gaveUp = state.gaveUp || false;
              
              // Determine phase
              if (state.gamePhase === 'complete') {
                gamePhase = 'complete';
              } else if (foundWords.length === validWords.length && validWords.length > 0) {
                gamePhase = 'phase2';
              } else {
                gamePhase = 'phase1';
              }
            } else {
              // New day, fresh game
              gamePhase = 'phase1';
            }
          } catch {
            // Corrupted state, clear and start fresh
            try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
            gamePhase = 'phase1';
          }
        } else {
          gamePhase = 'phase1';
        }
      } else {
        // Fallback if browser not available
        gamePhase = 'phase1';
      }
      
      clearTimeout(failsafe);
    } catch (e) {
      // Any error during init, just start fresh
      console.error('Failed to initialize Scrambled:', e);
      gamePhase = 'phase1';
      clearTimeout(failsafe);
    }
  });
  
  // Save state on changes
  $effect(() => {
    if (browser && gamePhase !== 'loading') {
      const state = {
        date: puzzleDate,
        foundWords,
        validWords,
        classifiedWords: [...classifiedWords.entries()],
        wordsFoundBeforeReveal,
        firstTryCorrect,
        gaveUp,
        gamePhase
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  });
  
  // Handle word submission
  function submitWord() {
    const word = currentInput.toLowerCase().trim();
    currentInput = '';
    inputError = '';
    
    if (word.length < 3) {
      inputError = 'Too short (min 3 letters)';
      return;
    }
    
    // Check if word uses only available letters
    const letterSet = new Set(letters);
    if (![...word].every(c => letterSet.has(c))) {
      inputError = 'Uses unavailable letters';
      return;
    }
    
    // Check if valid food word
    if (!validWords.includes(word)) {
      inputError = 'Not a food word';
      return;
    }
    
    // Check if already found
    if (foundWords.includes(word)) {
      inputError = 'Already found!';
      return;
    }
    
    // Add word - only counts toward score if found before reveal
    foundWords = [...foundWords, word].sort();
    if (!gaveUp) {
      wordsFoundBeforeReveal++;
    }
    
    // Check if phase 1 complete
    if (foundWords.length === validWords.length) {
      setTimeout(() => {
        gamePhase = 'phase2';
      }, 1000);
    }
  }
  
  // Handle key press in input
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      submitWord();
    }
  }
  
  // Give up - reveal all words and proceed to phase 2
  function giveUp() {
    gaveUp = true;
    // Track which words are being revealed (no points for these)
    revealedWords = validWords.filter(w => !foundWords.includes(w));
    // Add revealed words to foundWords for phase 2
    foundWords = [...validWords].sort();
    // Move to phase 2 after showing revealed words
    setTimeout(() => {
      gamePhase = 'phase2';
    }, 2000);
  }
  
  // Reset game - start fresh for today
  function resetGame() {
    console.log('resetGame called');
    if (browser) {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Reload fresh puzzle
    const puzzle = getTodaysPuzzle();
    console.log('Got puzzle:', puzzle);
    letters = puzzle.letters;
    validWords = puzzle.validWords;
    puzzleDate = puzzle.date;
    foundWords = [];
    classifiedWords = new Map();
    wordsFoundBeforeReveal = 0;
    firstTryCorrect = 0;
    gaveUp = false;
    revealedWords = [];
    showResults = false;
    gamePhase = 'phase1';
    console.log('gamePhase set to:', gamePhase);
  }
  
  // Developer reset with password
  function devReset() {
    const password = prompt('Enter developer password:');
    if (password === '4444') {
      resetGame();
    }
  }
  
  // Drag and drop handlers for Phase 2
  function handleDragStart(word: string) {
    draggedWord = word;
  }
  
  function handleDragEnd() {
    draggedWord = null;
  }
  
  function handleDrop(group: FoodGroup) {
    if (!draggedWord) return;
    
    const word = draggedWord;
    const correctGroups = getWordGroups(word);
    const isCorrect = correctGroups.includes(group);
    
    // Get current attempts for this word
    const existing = classifiedWords.get(word);
    const attempts = (existing?.attempts || 0) + 1;
    
    if (isCorrect) {
      // Correct classification
      classifiedWords.set(word, { group, attempts });
      classifiedWords = new Map(classifiedWords);
      
      // Track first-try correct
      if (attempts === 1) {
        firstTryCorrect++;
      }
      
      // Show success feedback
      const groupInfo = FOOD_GROUP_INFO[group];
      showFeedback = { 
        word, 
        correct: true, 
        hint: `${groupInfo.emoji} ${word} is a ${groupInfo.label.toLowerCase()}!` 
      };
    } else {
      // Wrong - update attempts but don't classify
      classifiedWords.set(word, { group: '' as FoodGroup, attempts });
      classifiedWords = new Map(classifiedWords);
      
      // Show hint
      const groupInfo = FOOD_GROUP_INFO[group];
      showFeedback = { 
        word, 
        correct: false, 
        hint: `${word} is not a ${groupInfo.label.toLowerCase()}. Try again!` 
      };
    }
    
    draggedWord = null;
    
    // Clear feedback after delay
    setTimeout(() => {
      showFeedback = null;
    }, 2000);
    
    // Check if complete
    const allClassified = foundWords.every(w => {
      const c = classifiedWords.get(w);
      return c && c.group !== '';
    });
    if (allClassified) {
      setTimeout(() => {
        gamePhase = 'complete';
      }, 1000);
    }
  }
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }
  
  // Touch drag handlers for mobile/tablet
  function handleTouchStart(e: TouchEvent, word: string) {
    e.preventDefault();
    draggedWord = word;
    const touch = e.touches[0];
    touchDragPos = { x: touch.clientX, y: touch.clientY };
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!draggedWord) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchDragPos = { x: touch.clientX, y: touch.clientY };
  }
  
  function handleTouchEnd(e: TouchEvent) {
    if (!draggedWord || !touchDragPos) {
      draggedWord = null;
      touchDragPos = null;
      return;
    }
    
    // Find which group element the touch ended over
    const touchX = touchDragPos.x;
    const touchY = touchDragPos.y;
    
    for (const [group, el] of groupElements) {
      const rect = el.getBoundingClientRect();
      if (touchX >= rect.left && touchX <= rect.right && 
          touchY >= rect.top && touchY <= rect.bottom) {
        handleDrop(group as FoodGroup);
        break;
      }
    }
    
    draggedWord = null;
    touchDragPos = null;
  }
  
  function registerGroupElement(el: HTMLElement, group: string) {
    groupElements.set(group, el);
    return {
      destroy() {
        groupElements.delete(group);
      }
    };
  }
  
  // Get unclassified words
  let unclassifiedWords = $derived(() => {
    return foundWords.filter(word => {
      const c = classifiedWords.get(word);
      return !c || c.group === '';
    });
  });
  
  // Get words classified into each group
  function getGroupWords(group: FoodGroup): string[] {
    const words: string[] = [];
    for (const [word, data] of classifiedWords) {
      if (data.group === group) {
        words.push(word);
      }
    }
    return words;
  }
  
  // Share result
  function shareResult() {
    const hints = letterHints();
    const hintLines = [...hints.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([letter, { total }]) => `${letter.toUpperCase()} ${'●'.repeat(total)}`)
      .join('\n');
    
    const p1Pct = phase1Percent();
    const p2Pct = phase2Percent();
    
    const text = `🐝 Scramble Bee ${puzzleDate}

Word Finding: ${wordsFoundBeforeReveal}/${validWords.length} (${p1Pct.toFixed(0)}%) ⭐
Classification: ${firstTryCorrect}/${foundWords.length} (${p2Pct.toFixed(0)}%) 🧠

${hintLines}

dailyfoodchain.com/scrambled`;

    if (navigator.share) {
      navigator.share({ text });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  }
</script>

<svelte:head>
  <title>Scramble Bee - Daily Food Word Game</title>
</svelte:head>

<main class="scrambled-game" class:wide-mode={gamePhase === 'phase2' || showResults}>
  <header>
    <h1>🐝 Scramble Bee</h1>
    <p class="date">{puzzleDate}</p>
    <button class="dev-reset" onclick={devReset} title="Dev Reset">⚙️</button>
  </header>
  
  {#if gamePhase === 'loading'}
    <div class="loading">
      <p>Loading puzzle...</p>
      <button 
        type="button" 
        class="manual-start" 
        onclick={(e) => { e.preventDefault(); console.log('Start clicked'); resetGame(); }}
        ontouchend={(e) => { e.preventDefault(); console.log('Start touched'); resetGame(); }}
      >
        Start Fresh Game
      </button>
    </div>
  
  {:else if gamePhase === 'phase1'}
    <section class="phase1">
      <div class="letters">
        {#each letters as letter}
          <span class="letter">{letter.toUpperCase()}</span>
        {/each}
      </div>
      
      <div class="input-area">
        <input 
          type="text" 
          bind:value={currentInput}
          onkeydown={handleKeydown}
          placeholder="Type a food word..."
          autocomplete="off"
          autocapitalize="off"
        />
        <button onclick={submitWord}>Submit</button>
      </div>
      
      {#if inputError}
        <p class="error">{inputError}</p>
      {/if}
      
      <div class="progress">
        <span class="found-count">{foundWords.length}/{validWords.length} words found</span>
        <span class="score">{validWords.length > 0 ? ((foundWords.length / validWords.length) * 100).toFixed(0) : 0}%</span>
      </div>
      
      <div class="hints">
        <h3>Hints</h3>
        <div class="hint-grid">
          {#each [...letterHints().entries()].sort((a, b) => a[0].localeCompare(b[0])) as [letter, { total, found }]}
            <div class="hint-item" class:complete={found === total}>
              <span class="hint-letter">{letter.toUpperCase()}</span>
              <span class="hint-count">{found}/{total}</span>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="found-words">
        <h3>Found Words</h3>
        <div class="word-list">
          {#each foundWords as word}
            <span class="word">{word}</span>
          {/each}
        </div>
      </div>
      
      {#if gaveUp}
        <div class="revealed-section">
          <h3>Missed Words ({revealedWords.length})</h3>
          <div class="word-list revealed">
            {#each revealedWords as word}
              <span class="word missed">{word}</span>
            {/each}
          </div>
          <p class="moving-on">Moving to classification...</p>
        </div>
      {:else}
        <button class="give-up" onclick={giveUp}>
          🏳️ I Give Up - Show Words
        </button>
      {/if}
    </section>
  
  {:else if gamePhase === 'phase2'}
    <section class="phase2">
      <h2>🧠 Classify Your Words</h2>
      <p class="instruction">Drag each word to its food group</p>
      
      {#if showFeedback}
        <div class="feedback" class:correct={showFeedback.correct} class:wrong={!showFeedback.correct}>
          {showFeedback.hint}
        </div>
      {/if}
      
      <div class="unclassified">
        {#each unclassifiedWords() as word}
          <span 
            class="drag-word"
            class:dragging={draggedWord === word}
            draggable="true"
            ondragstart={() => handleDragStart(word)}
            ondragend={handleDragEnd}
            ontouchstart={(e) => handleTouchStart(e, word)}
            ontouchmove={handleTouchMove}
            ontouchend={handleTouchEnd}
          >{word}</span>
        {/each}
      </div>
      
      <!-- Touch drag indicator -->
      {#if draggedWord && touchDragPos}
        <div 
          class="touch-drag-indicator"
          style="left: {touchDragPos.x}px; top: {touchDragPos.y}px;"
        >
          {draggedWord}
        </div>
      {/if}
      
      <div class="groups-grid">
        {#each Object.entries(FOOD_GROUP_INFO) as [group, info]}
          <div 
            class="group-drop"
            use:registerGroupElement={group}
            ondragover={handleDragOver}
            ondrop={() => handleDrop(group as FoodGroup)}
          >
            <div class="group-header">
              <span class="emoji">{info.emoji}</span>
              <span class="label">{info.label}</span>
            </div>
            <div class="group-words">
              {#each getGroupWords(group as FoodGroup) as word}
                <span class="classified-word">{word}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
      
      <div class="phase2-score">
        <span>First-try: {firstTryCorrect}/{foundWords.length - unclassifiedWords().length} classified</span>
      </div>
      
      <button class="reset-btn" onclick={resetGame}>
        🔄 Start Over
      </button>
    </section>
  
  {:else if gamePhase === 'complete'}
    <section class="complete">
      <h2>🎉 Complete!</h2>
      
      <div class="final-scores">
        <div class="score-row">
          <span>Word Finding:</span>
          <span class="score-value">{wordsFoundBeforeReveal}/{validWords.length}</span>
          <span class="score-percent">{phase1Percent().toFixed(0)}%</span>
        </div>
        <div class="score-row">
          <span>Classification:</span>
          <span class="score-value">{firstTryCorrect}/{foundWords.length}</span>
          <span class="score-percent">{phase2Percent().toFixed(0)}%</span>
        </div>
      </div>
      
      <button class="share-btn" onclick={shareResult}>
        📤 Share Result
      </button>
      
      <button class="show-results-btn" onclick={() => showResults = !showResults}>
        {showResults ? '▲ Hide Answers' : '▼ Show Answers'}
      </button>
      
      {#if showResults}
        {@const wordsToShow = validWords.length > 0 ? validWords : foundWords}
        <div class="results-grid">
          {#each [...wordsToShow].sort() as word}
            {@const groups = getWordGroups(word)}
            {@const groupInfo = groups[0] ? FOOD_GROUP_INFO[groups[0]] : null}
            <div class="result-item">
              <span class="result-word">{word}</span>
              <span class="result-group">
                {#if groupInfo}
                  {groupInfo.emoji} {groupInfo.label}
                {:else}
                  ❓ Unknown
                {/if}
              </span>
            </div>
          {/each}
        </div>
      {/if}
      
      <p class="comeback">Come back tomorrow for a new puzzle!</p>
    </section>
  {/if}
</main>

<style>
  .scrambled-game {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    padding-bottom: 6rem;
    font-family: system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
  
  /* Wider layout for Phase 2 with 11 groups */
  .scrambled-game.wide-mode {
    max-width: 900px;
  }
  
  header {
    text-align: center;
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  header h1 {
    margin: 0;
    font-size: 2rem;
  }
  
  .date {
    color: #666;
    margin: 0.25rem 0 0;
  }
  
  .dev-reset {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    font-size: 1rem;
    opacity: 0.3;
    cursor: pointer;
    padding: 0.25rem;
  }
  
  .dev-reset:hover {
    opacity: 0.6;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .loading p {
    margin-bottom: 1rem;
  }
  
  .manual-start {
    padding: 0.75rem 1.5rem;
    background: #4a9eff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .manual-start:hover {
    background: #357abd;
  }
  
  /* Phase 1 Styles */
  .letters {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .letter {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .input-area {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .input-area input {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  
  .input-area input:focus {
    outline: none;
    border-color: #4a9eff;
  }
  
  .input-area button {
    padding: 0.75rem 1.5rem;
    background: #4a9eff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .input-area button:hover {
    background: #357abd;
  }
  
  .error {
    color: #e53935;
    text-align: center;
    margin: 0.5rem 0;
  }
  
  .progress {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  .hints {
    margin: 1rem 0;
  }
  
  .hints h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }
  
  .hint-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .hint-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .hint-item.complete {
    background: #c8e6c9;
  }
  
  .hint-letter {
    font-weight: bold;
  }
  
  .hint-count {
    color: #666;
  }
  
  .found-words {
    margin: 1rem 0;
  }
  
  .found-words h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }
  
  .word-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .word {
    padding: 0.25rem 0.75rem;
    background: #e3f2fd;
    border-radius: 20px;
    font-size: 0.875rem;
  }
  
  .give-up {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-top: 1.5rem;
    background: #9e9e9e;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .give-up:hover {
    background: #757575;
  }
  
  .revealed-section {
    margin-top: 1rem;
    padding: 1rem;
    background: #fff3e0;
    border-radius: 8px;
  }
  
  .revealed-section h3 {
    margin: 0 0 0.5rem;
    color: #e65100;
  }
  
  .word.missed {
    background: #ffccbc;
    color: #bf360c;
  }
  
  .moving-on {
    margin: 1rem 0 0;
    color: #666;
    font-style: italic;
  }
  
  /* Phase 2 Styles */
  .phase2 {
    text-align: center;
    padding-bottom: 2rem;
  }
  
  .phase2 h2 {
    margin: 0 0 0.5rem;
  }
  
  .instruction {
    color: #666;
    margin: 0 0 1rem;
  }
  
  .feedback {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    z-index: 100;
    animation: fadeInUp 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .feedback.correct {
    background: #c8e6c9;
    color: #2e7d32;
  }
  
  .feedback.wrong {
    background: #ffcdd2;
    color: #c62828;
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  
  .unclassified {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 1rem;
    min-height: 3rem;
  }
  
  .drag-word {
    padding: 0.5rem 1rem;
    background: #fff;
    border: 2px solid #4a9eff;
    border-radius: 20px;
    cursor: grab;
    user-select: none;
    touch-action: none;
  }
  
  .drag-word:active {
    cursor: grabbing;
  }
  
  .drag-word.dragging {
    opacity: 0.5;
  }
  
  .touch-drag-indicator {
    position: fixed;
    transform: translate(-50%, -100%);
    padding: 0.5rem 1rem;
    background: #4a9eff;
    color: white;
    border-radius: 20px;
    font-weight: bold;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .groups-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  @media (max-width: 700px) {
    .groups-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 500px) {
    .groups-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .group-drop {
    padding: 0.5rem;
    background: #fff;
    border: 2px dashed #ddd;
    border-radius: 8px;
    min-height: 80px;
    max-height: 150px;
    overflow-y: auto;
    transition: border-color 0.2s, background 0.2s;
  }
  
  .group-drop:hover {
    border-color: #4a9eff;
    background: #f0f8ff;
  }
  
  .group-header {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    position: sticky;
    top: 0;
    background: #fff;
    padding-bottom: 0.25rem;
  }
  
  .emoji {
    font-size: 1.25rem;
  }
  
  .label {
    font-weight: 500;
  }
  
  .group-words {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .classified-word {
    padding: 0.125rem 0.5rem;
    background: #c8e6c9;
    border-radius: 12px;
    font-size: 0.75rem;
  }
  
  .phase2-score {
    margin-top: 1rem;
    text-align: center;
    color: #666;
  }
  
  .reset-btn {
    display: block;
    margin: 1rem auto 0;
    padding: 0.5rem 1.5rem;
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 8px;
    color: #666;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .reset-btn:hover {
    background: #eee;
  }
  
  /* Complete Styles */
  .complete {
    text-align: center;
  }
  
  .complete h2 {
    font-size: 2rem;
    margin: 0 0 1rem;
  }
  
  .final-scores {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    gap: 1rem;
  }
  
  .score-row > span:first-child {
    flex: 1;
  }
  
  .score-value {
    font-weight: bold;
    min-width: 4rem;
    text-align: center;
  }
  
  .score-percent {
    min-width: 4rem;
    text-align: right;
    color: #4a9eff;
    font-weight: bold;
  }
  
  .share-btn {
    padding: 1rem 2rem;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
  }
  
  .share-btn:hover {
    background: #43a047;
  }
  
  .show-results-btn {
    display: block;
    margin: 1rem auto;
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .show-results-btn:hover {
    background: #f5f5f5;
    border-color: #bbb;
  }
  
  .results-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
    text-align: left;
  }
  
  @media (max-width: 700px) {
    .results-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 500px) {
    .results-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .result-item {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0.75rem;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #eee;
  }
  
  .result-word {
    font-weight: 600;
    color: #333;
  }
  
  .result-group {
    font-size: 0.85rem;
    color: #666;
  }
  
  .comeback {
    margin-top: 1rem;
    color: #666;
    font-style: italic;
  }
</style>
