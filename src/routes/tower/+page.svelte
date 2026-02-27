<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { 
    FOOD_WORDS,
    FOODIE_WORDS,
    FOODIE_21_WORDS,
    type FoodGroup,
    type GameLevel
  } from '$lib/data/scrambled-puzzles';

  // Level selection
  let currentLevel = $state<GameLevel>('usda');
  let showRules = $state(false);

  // Game state
  type GamePhase = 'playing' | 'complete';
  let gamePhase = $state<GamePhase>('playing');
  let currentFloor = $state(1); // 1-4, bottom to top
  let puzzleDate = $state('');
  
  // Floor configurations
  const FLOOR_CONFIG = [
    { length: 6, placedCount: 3 }, // Floor 1
    { length: 5, placedCount: 2 }, // Floor 2
    { length: 4, placedCount: 1 }, // Floor 3
    { length: 3, placedCount: 0 }, // Floor 4
  ];

  // Tower state - each floor has its word, guesses, and status
  interface FloorState {
    word: string;
    placedPositions: number[]; // indices of pre-placed letters
    unplacedLetter: string; // the hint letter shown beside the floor
    guesses: string[];
    solved: boolean;
  }
  
  let floors = $state<FloorState[]>([]);
  let currentInput = $state('');
  let inputError = $state('');
  let showResults = $state(false);

  // Word lists by length
  let wordsByLength = $derived(() => {
    const wordMap = getWordsForLevel(currentLevel);
    const byLength: Map<number, string[]> = new Map();
    
    for (const word of wordMap.keys()) {
      const len = word.length;
      if (!byLength.has(len)) {
        byLength.set(len, []);
      }
      byLength.get(len)!.push(word);
    }
    return byLength;
  });

  // Total word counts for level display
  const usdaWordCount = FOOD_WORDS.size;
  const foodieWordCount = FOODIE_WORDS.size;
  const foodie21WordCount = FOODIE_21_WORDS.size;

  // Get word map for level
  function getWordsForLevel(level: GameLevel) {
    switch (level) {
      case 'foodie21': return FOODIE_21_WORDS;
      case 'foodie': return FOODIE_WORDS;
      default: return FOOD_WORDS;
    }
  }

  // Seeded random number generator
  function seededRandom(seed: number) {
    return function() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
  }

  // Generate daily puzzle
  function generatePuzzle(level: GameLevel) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    puzzleDate = dateStr;
    
    // Create seed from date
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const levelOffset = level === 'usda' ? 0 : level === 'foodie' ? 1000 : 2000;
    const random = seededRandom(daysSinceEpoch + levelOffset);

    const words = wordsByLength();
    const newFloors: FloorState[] = [];

    for (let i = 0; i < 4; i++) {
      const config = FLOOR_CONFIG[i];
      const availableWords = words.get(config.length) || [];
      
      if (availableWords.length === 0) {
        console.error(`No ${config.length}-letter words available`);
        continue;
      }

      // Pick a random word
      const wordIndex = Math.floor(random() * availableWords.length);
      const word = availableWords[wordIndex];

      // Pick random positions for placed letters
      const positions = Array.from({ length: config.length }, (_, i) => i);
      const placedPositions: number[] = [];
      for (let j = 0; j < config.placedCount; j++) {
        const idx = Math.floor(random() * positions.length);
        placedPositions.push(positions.splice(idx, 1)[0]);
      }
      placedPositions.sort((a, b) => a - b);

      // Pick an unplaced letter (from remaining positions)
      let unplacedLetter = '';
      if (positions.length > 0) {
        const unplacedIdx = Math.floor(random() * positions.length);
        unplacedLetter = word[positions[unplacedIdx]];
      }

      newFloors.push({
        word,
        placedPositions,
        unplacedLetter,
        guesses: [],
        solved: false
      });
    }

    floors = newFloors;
    currentFloor = 1;
    currentInput = '';
    gamePhase = 'playing';
  }

  // Get storage key for persistence
  function getStorageKey(level: GameLevel) {
    return `tower-game-state-${level}`;
  }

  // Save game state
  function saveState() {
    if (!browser) return;
    const state = {
      floors,
      currentFloor,
      gamePhase,
      puzzleDate,
      level: currentLevel
    };
    localStorage.setItem(getStorageKey(currentLevel), JSON.stringify(state));
    localStorage.setItem('tower-level', currentLevel);
  }

  // Start/load level
  function startLevel(level: GameLevel) {
    currentLevel = level;
    
    if (browser) {
      const storageKey = getStorageKey(level);
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        try {
          const state = JSON.parse(saved);
          if (state.puzzleDate === today) {
            floors = state.floors;
            currentFloor = state.currentFloor;
            gamePhase = state.gamePhase;
            puzzleDate = state.puzzleDate;
            return;
          }
        } catch (e) {
          console.error('Failed to restore state', e);
        }
      }
    }
    
    generatePuzzle(level);
  }

  // Initialize on mount
  onMount(() => {
    const savedLevel = browser ? localStorage.getItem('tower-level') as GameLevel : null;
    if (savedLevel && ['usda', 'foodie', 'foodie21'].includes(savedLevel)) {
      startLevel(savedLevel);
    } else {
      startLevel('usda');
    }
  });

  // Save state when it changes
  $effect(() => {
    if (browser && floors.length > 0) {
      saveState();
    }
  });

  // Get current floor state
  let currentFloorState = $derived(() => floors[currentFloor - 1]);

  // Check if word is valid for current floor
  function isValidWord(word: string): boolean {
    const config = FLOOR_CONFIG[currentFloor - 1];
    if (word.length !== config.length) return false;
    
    const wordMap = getWordsForLevel(currentLevel);
    return wordMap.has(word.toLowerCase());
  }

  // Get letter status for a guess
  type LetterStatus = 'correct' | 'present' | 'absent' | 'placed';
  
  function getLetterStatuses(guess: string, target: string, placedPositions: number[]): LetterStatus[] {
    const statuses: LetterStatus[] = new Array(guess.length).fill('absent');
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark correct positions and placed letters
    for (let i = 0; i < guessLetters.length; i++) {
      if (placedPositions.includes(i)) {
        statuses[i] = 'placed'; // Pre-placed letters always shown as placed
      } else if (guessLetters[i] === targetLetters[i]) {
        statuses[i] = 'correct';
        targetLetters[i] = ''; // Mark as used
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < guessLetters.length; i++) {
      if (statuses[i] !== 'absent') continue;
      
      const targetIdx = targetLetters.indexOf(guessLetters[i]);
      if (targetIdx !== -1) {
        statuses[i] = 'present';
        targetLetters[targetIdx] = ''; // Mark as used
      }
    }
    
    return statuses;
  }

  // Submit a guess
  function submitGuess() {
    const guess = currentInput.toLowerCase().trim();
    inputError = '';
    
    const floor = floors[currentFloor - 1];
    if (!floor || floor.solved) return;
    
    const config = FLOOR_CONFIG[currentFloor - 1];
    
    // Validate length
    if (guess.length !== config.length) {
      inputError = `Word must be ${config.length} letters`;
      return;
    }
    
    // Validate it's a food word
    if (!isValidWord(guess)) {
      inputError = 'Not a valid food word';
      return;
    }
    
    // Check if pre-placed letters match
    for (const pos of floor.placedPositions) {
      if (guess[pos] !== floor.word[pos]) {
        inputError = `Letter at position ${pos + 1} must be "${floor.word[pos].toUpperCase()}"`;
        return;
      }
    }
    
    // Add guess
    floor.guesses = [...floor.guesses, guess];
    currentInput = '';
    
    // Check if correct
    if (guess === floor.word) {
      floor.solved = true;
      
      if (currentFloor < 4) {
        // Move to next floor
        currentFloor++;
      } else {
        // Tower complete!
        gamePhase = 'complete';
        showResults = true;
      }
    }
    
    // Trigger reactivity
    floors = [...floors];
  }

  // Handle keyboard input
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      submitGuess();
    }
  }

  // Calculate total guesses
  let totalGuesses = $derived(() => 
    floors.reduce((sum, floor) => sum + floor.guesses.length, 0)
  );

  // Get rating based on total guesses
  function getRating(guesses: number): { emoji: string; label: string } {
    if (guesses <= 4) return { emoji: '🏆', label: 'Master Builder' };
    if (guesses <= 8) return { emoji: '⭐', label: 'Expert' };
    if (guesses <= 12) return { emoji: '👍', label: 'Solid' };
    if (guesses <= 16) return { emoji: '🧱', label: 'Builder' };
    return { emoji: '🏗️', label: 'Apprentice' };
  }

  // Generate share text
  function generateShareText(): string {
    const rating = getRating(totalGuesses());
    const levelEmoji = currentLevel === 'usda' ? '🏛️' : currentLevel === 'foodie' ? '🍴' : '🍸';
    
    let text = `TOWER of FOOD 🗼\n${puzzleDate}\n\n`;
    
    // Show floors from top to bottom in share
    for (let i = 3; i >= 0; i--) {
      const floor = floors[i];
      if (!floor) continue;
      
      const lastGuess = floor.guesses[floor.guesses.length - 1];
      if (lastGuess) {
        const statuses = getLetterStatuses(lastGuess, floor.word, floor.placedPositions);
        const squares = statuses.map(s => {
          if (s === 'correct' || s === 'placed') return '🟩';
          if (s === 'present') return '🟨';
          return '⬜';
        }).join('');
        text += `Floor ${i + 1}: ${squares} (${floor.guesses.length})\n`;
      }
    }
    
    text += `\nTotal: ${totalGuesses()} guesses ${rating.emoji}\n`;
    text += `Level: ${currentLevel === 'foodie21' ? 'FOODIE 21+' : currentLevel.toUpperCase()} ${levelEmoji}`;
    
    return text;
  }

  // Copy share text to clipboard
  async function shareResults() {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    } catch {
      alert('Could not copy to clipboard');
    }
  }

  // Reset game
  function resetGame() {
    if (browser) {
      localStorage.removeItem(getStorageKey(currentLevel));
    }
    generatePuzzle(currentLevel);
    showResults = false;
  }
</script>

<svelte:head>
  <title>Tower of Food - Daily Food Chain</title>
</svelte:head>

<main class="tower-game">
  <header>
    <h1>🗼 TOWER of FOOD</h1>
    <p class="date">{puzzleDate}</p>
  </header>

  <!-- Level Switcher -->
  <div class="level-switcher">
    <div class="level-option" class:active={currentLevel === 'usda'}>
      <button class="level-name" onclick={() => startLevel('usda')}>
        🏛️ USDA
      </button>
      <button class="rules-link" onclick={() => { currentLevel = 'usda'; showRules = true; }}>
        Rules
      </button>
    </div>
    
    <div class="level-option" class:active={currentLevel === 'foodie'}>
      <button class="level-name" onclick={() => startLevel('foodie')}>
        🍴 FOODIE
      </button>
      <button class="rules-link" onclick={() => { currentLevel = 'foodie'; showRules = true; }}>
        Rules
      </button>
    </div>
    
    <div class="level-option" class:active={currentLevel === 'foodie21'}>
      <button class="level-name" onclick={() => startLevel('foodie21')}>
        🍸 FOODIE 21+
      </button>
      <button class="rules-link" onclick={() => { currentLevel = 'foodie21'; showRules = true; }}>
        Rules
      </button>
    </div>
  </div>

  <!-- Tower Display -->
  <div class="tower">
    {#each [4, 3, 2, 1] as floorNum}
      {@const floor = floors[floorNum - 1]}
      {@const config = FLOOR_CONFIG[floorNum - 1]}
      {@const isActive = floorNum === currentFloor && gamePhase === 'playing'}
      {@const isLocked = floorNum > currentFloor}
      {@const isSolved = floor?.solved}
      
      <div class="floor" class:active={isActive} class:locked={isLocked} class:solved={isSolved}>
        <div class="floor-label">F{floorNum}</div>
        
        <div class="floor-content">
          {#if floor}
            <!-- Show guesses or empty slots -->
            <div class="guesses">
              {#each floor.guesses as guess, guessIdx}
                {@const statuses = getLetterStatuses(guess, floor.word, floor.placedPositions)}
                <div class="guess-row">
                  {#each guess.split('') as letter, i}
                    <span class="letter" class:correct={statuses[i] === 'correct'} class:placed={statuses[i] === 'placed'} class:present={statuses[i] === 'present'} class:absent={statuses[i] === 'absent'}>
                      {letter.toUpperCase()}
                    </span>
                  {/each}
                </div>
              {/each}
              
              {#if isActive && !isSolved}
                <!-- Current input row with pre-placed letters -->
                <div class="input-row">
                  {#each Array(config.length) as _, i}
                    {#if floor.placedPositions.includes(i)}
                      <span class="letter placed">{floor.word[i].toUpperCase()}</span>
                    {:else}
                      <span class="letter empty">{currentInput[i]?.toUpperCase() || ''}</span>
                    {/if}
                  {/each}
                </div>
              {:else if isLocked}
                <!-- Locked floor - show empty squares -->
                <div class="input-row locked">
                  {#each Array(config.length) as _, i}
                    <span class="letter locked">?</span>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
        
        <!-- Unplaced letter hint (beside the floor) -->
        {#if floor && !isSolved && !isLocked}
          <div class="hint-letter" title="This letter is in the word">
            +{floor.unplacedLetter.toUpperCase()}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Input area (only when playing) -->
  {#if gamePhase === 'playing'}
    {@const floor = floors[currentFloor - 1]}
    {@const config = FLOOR_CONFIG[currentFloor - 1]}
    
    {#if floor && !floor.solved}
      <div class="input-area">
        <input
          type="text"
          bind:value={currentInput}
          onkeydown={handleKeydown}
          placeholder={`${config.length}-letter food`}
          maxlength={config.length}
          autocomplete="off"
          autocapitalize="off"
        />
        <button onclick={submitGuess}>Guess</button>
      </div>
      
      {#if inputError}
        <p class="error">{inputError}</p>
      {/if}
      
      <p class="floor-info">
        Floor {currentFloor}: {config.length} letters
        {#if floor.guesses.length > 0}
          • {floor.guesses.length} guess{floor.guesses.length !== 1 ? 'es' : ''}
        {/if}
      </p>
    {/if}
  {/if}

  <!-- Results -->
  {#if showResults && gamePhase === 'complete'}
    {@const rating = getRating(totalGuesses())}
    <div class="results">
      <h2>🎉 Tower Complete!</h2>
      <p class="rating">{rating.emoji} {rating.label}</p>
      <p class="total">Total guesses: {totalGuesses()}</p>
      
      <div class="results-buttons">
        <button class="share-btn" onclick={shareResults}>
          📤 Share Results
        </button>
        <button class="reset-btn" onclick={resetGame}>
          🔄 Play Again
        </button>
      </div>
    </div>
  {/if}

  <!-- Rules Modal -->
  {#if showRules}
    <div class="modal-backdrop" onclick={() => showRules = false}>
      <div class="rules-modal" onclick={(e) => e.stopPropagation()}>
        <h3>📖 {currentLevel === 'usda' ? 'USDA' : currentLevel === 'foodie' ? 'FOODIE' : 'FOODIE 21+'} Rules</h3>
        
        <div class="rules-content">
          <p><strong>🗼 Build the Tower!</strong></p>
          <p>Guess food words to build a 4-floor tower. Start at the bottom and work your way up!</p>
          
          <h4>Tower Structure</h4>
          <ul>
            <li>Floor 1 (bottom): 6-letter word, 3 letters shown</li>
            <li>Floor 2: 5-letter word, 2 letters shown</li>
            <li>Floor 3: 4-letter word, 1 letter shown</li>
            <li>Floor 4 (top): 3-letter word, 0 letters shown</li>
          </ul>
          
          <h4>Hints</h4>
          <ul>
            <li>🟩 Green = correct letter in correct spot</li>
            <li>🟨 Yellow = letter is in the word but wrong spot</li>
            <li>⬜ Gray = letter is not in the word</li>
            <li>+X beside floor = this letter is in the word</li>
          </ul>
          
          <h4>Level: {currentLevel === 'usda' ? 'USDA' : currentLevel === 'foodie' ? 'FOODIE' : 'FOODIE 21+'}</h4>
          {#if currentLevel === 'usda'}
            <p>Official USDA food names only. <em>Alcoholic beverages not included.</em></p>
          {:else if currentLevel === 'foodie'}
            <p>Includes international and specialty foods. <em>Alcoholic beverages not included.</em></p>
          {:else}
            <p>Full experience including wines, spirits, and cocktails!</p>
          {/if}
        </div>
        
        <button class="modal-close-btn" onclick={() => showRules = false}>
          Got it!
        </button>
      </div>
    </div>
  {/if}
</main>

<style>
  .tower-game {
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    text-align: center;
    margin-bottom: 1rem;
  }

  header h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .date {
    color: #666;
    font-size: 0.9rem;
    margin: 0.25rem 0;
  }

  /* Level Switcher */
  .level-switcher {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .level-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: #f5f5f5;
    opacity: 0.7;
    transition: all 0.2s;
  }

  .level-option.active {
    opacity: 1;
    background: #e3f2fd;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .level-name {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }

  .rules-link {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: #666;
    cursor: pointer;
    text-decoration: underline;
  }

  /* Tower */
  .tower {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .floor {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f9f9f9;
    border-radius: 8px;
    border: 2px solid #ddd;
    transition: all 0.3s;
  }

  .floor.active {
    border-color: #4a9eff;
    background: #e3f2fd;
  }

  .floor.solved {
    border-color: #4caf50;
    background: #e8f5e9;
  }

  .floor.locked {
    opacity: 0.5;
  }

  .floor-label {
    font-weight: bold;
    color: #666;
    font-size: 0.8rem;
    width: 1.5rem;
  }

  .floor-content {
    flex: 1;
  }

  .guesses {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .guess-row, .input-row {
    display: flex;
    gap: 0.25rem;
  }

  .letter {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 4px;
    border: 2px solid #ccc;
    background: white;
    text-transform: uppercase;
  }

  .letter.correct {
    background: #6aaa64;
    border-color: #6aaa64;
    color: white;
  }

  .letter.placed {
    background: #6aaa64;
    border-color: #538d4e;
    color: white;
  }

  .letter.present {
    background: #c9b458;
    border-color: #c9b458;
    color: white;
  }

  .letter.absent {
    background: #787c7e;
    border-color: #787c7e;
    color: white;
  }

  .letter.empty {
    background: white;
    border-color: #ccc;
  }

  .letter.locked {
    background: #eee;
    color: #999;
  }

  .hint-letter {
    background: #fff3e0;
    color: #e65100;
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  /* Input Area */
  .input-area {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .input-area input {
    padding: 0.75rem;
    font-size: 1.1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    text-align: center;
    text-transform: uppercase;
    width: 200px;
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
    background: #3a8eef;
  }

  .error {
    color: #d32f2f;
    text-align: center;
    margin: 0.5rem 0;
  }

  .floor-info {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  /* Results */
  .results {
    text-align: center;
    padding: 1.5rem;
    background: #f5f5f5;
    border-radius: 12px;
    margin-top: 1rem;
  }

  .results h2 {
    margin: 0 0 0.5rem;
  }

  .rating {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }

  .total {
    color: #666;
    margin-bottom: 1rem;
  }

  .results-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .share-btn, .reset-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }

  .share-btn {
    background: #4caf50;
    color: white;
  }

  .reset-btn {
    background: #9e9e9e;
    color: white;
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .rules-modal {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .rules-modal h3 {
    margin: 0 0 1rem;
    text-align: center;
  }

  .rules-content {
    font-size: 0.9rem;
  }

  .rules-content h4 {
    margin: 1rem 0 0.5rem;
    color: #333;
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
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    background: #4a9eff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
