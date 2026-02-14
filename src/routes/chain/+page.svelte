<script lang="ts">
  import { fly, scale, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { 
    getFoodEntry, 
    isValidFood, 
    isDualIdentity,
    GROUP_COLORS,
    GROUP_TEXT_COLORS,
    GROUP_EMOJI,
    GROUP_NAMES,
    FOOD_DATABASE,
    type FoodGroup,
    type FoodEntry
  } from '$lib/data/food-database';

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
  interface ChainWord {
    word: string;
    group: FoodGroup;
    entry: FoodEntry;
  }

  // Difficulty state
  let difficultyMode = $state<DifficultyMode | null>(null);
  let showDifficultySelector = $state(true);
  
  // Letter search state (for Medium mode)
  let letterSearchType = $state<'first' | 'last'>('first');
  let letterSearchQuery = $state('');
  let letterSearchResults = $state<string[]>([]);

  // Game state
  let chain: ChainWord[] = $state([]);
  let currentWord = $state('');
  let message = $state('');
  let messageType = $state<'error' | 'success' | 'info'>('info');
  let gameComplete = $state(false);
  let showResults = $state(false);
  let showRules = $state(false);
  let showGroupPicker = $state(false);
  let pendingWord = $state<{ word: string; entry: FoodEntry } | null>(null);
  let changingGroupIndex = $state<number | null>(null);
  let streak = $state(0);
  
  // Food groups panel state
  let expandedGroup = $state<FoodGroup | null>(null);
  const ALL_GROUPS: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'spice', 'prepared', 'beverage'];
  
  // Daily puzzle number (days since Jan 1, 2024)
  const puzzleNumber = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 86400000);
  
  // Seeded random for consistent daily starting word
  function seededRandom(seed: number): () => number {
    return function() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
  }
  
  // Get today's starting word
  function getDailyStartWord(): string {
    const rng = seededRandom(puzzleNumber * 31337);
    const allWords = Array.from(FOOD_DATABASE.keys());
    // Filter for good starting words (4-7 letters, common groups)
    const goodStarters = allWords.filter(w => w.length >= 4 && w.length <= 7);
    const index = Math.floor(rng() * goodStarters.length);
    return goodStarters[index];
  }

  // Initialize the game
  function initGame() {
    const startWord = getDailyStartWord();
    const entry = getFoodEntry(startWord);
    if (entry) {
      chain = [{
        word: startWord,
        group: entry.groups[0],
        entry
      }];
    }
  }
  
  // Initialize on mount
  $effect(() => {
    if (difficultyMode && chain.length === 0) {
      initGame();
    }
  });
  
  // Load streak from localStorage
  $effect(() => {
    if (typeof window !== 'undefined') {
      const savedStreak = localStorage.getItem('dailyChainStreak');
      if (savedStreak) streak = parseInt(savedStreak);
    }
  });
  
  // Computed values
  let lastLetter = $derived(chain.length > 0 ? chain[chain.length - 1].word.slice(-1).toUpperCase() : 'A');
  let wordsRemaining = $derived(11 - chain.length);
  
  // Animated score
  const animatedScore = tweened(0, { duration: 400, easing: cubicOut });
  
  // Select difficulty mode
  function selectDifficulty(mode: DifficultyMode) {
    difficultyMode = mode;
    showDifficultySelector = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailyChainDifficulty', mode);
    }
  }
  
  // Letter search for Medium mode
  function searchByLetter() {
    if (!letterSearchQuery || letterSearchQuery.length !== 1) {
      letterSearchResults = [];
      return;
    }
    
    const letter = letterSearchQuery.toUpperCase();
    const results: string[] = [];
    
    for (const [word] of FOOD_DATABASE) {
      // In chain mode, must start with last letter
      if (!word.startsWith(lastLetter)) continue;
      
      const match = letterSearchType === 'first' 
        ? word.startsWith(letter)
        : word.endsWith(letter);
      if (match && !chain.some(c => c.word === word)) {
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
  
  // Get foods for a specific group that can continue the chain
  function getFoodsForGroup(group: FoodGroup): string[] {
    const foods: string[] = [];
    for (const [word, entry] of FOOD_DATABASE) {
      if (entry.groups.includes(group) && word.startsWith(lastLetter) && !chain.some(c => c.word === word)) {
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
    currentWord = food;
    submitWord();
    expandedGroup = null;
  }
  
  // Calculate score
  function calculateScore(): number {
    let score = 0;
    
    // 1 point per letter (excluding starting word)
    for (let i = 1; i < chain.length; i++) {
      score += chain[i].word.length;
    }
    
    // Completion bonus (11 words)
    if (chain.length >= 11) {
      score += 25;
    }
    
    // Food group diversity bonus - 10 points per unique group
    const uniqueGroups = new Set(chain.map(c => c.group));
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
  
  // Update score on chain change
  $effect(() => {
    animatedScore.set(calculateScore());
  });
  
  function getGroupsUsed(): FoodGroup[] {
    return [...new Set(chain.map(c => c.group))];
  }

  function submitWord() {
    const word = currentWord.toUpperCase().trim();
    
    if (!word) return;
    
    // Check starting letter
    if (word[0] !== lastLetter) {
      showMessage(`Must start with "${lastLetter}"`, 'error');
      return;
    }
    
    // Check if in database
    if (!isValidFood(word)) {
      showMessage('Not a recognized food', 'error');
      return;
    }
    
    // Check for duplicates
    if (chain.some(c => c.word === word)) {
      showMessage('Already used!', 'error');
      return;
    }
    
    const entry = getFoodEntry(word)!;
    
    // If dual identity, show picker
    if (isDualIdentity(word)) {
      pendingWord = { word, entry };
      showGroupPicker = true;
      currentWord = '';
      return;
    }
    
    // Add word to chain
    addWordToChain(word, entry, entry.groups[0]);
  }
  
  function addWordToChain(word: string, entry: FoodEntry, group: FoodGroup) {
    chain = [...chain, { word, group, entry }];
    currentWord = '';
    
    // Check for completion
    if (chain.length >= 11) {
      gameComplete = true;
      showResults = true;
      saveProgress();
      showMessage('🎉 Chain Complete!', 'success');
    } else {
      showMessage(`Great! ${wordsRemaining} word${wordsRemaining !== 1 ? 's' : ''} to go`, 'success');
    }
  }
  
  // Remove the last word from the chain (undo)
  function removeLastWord() {
    if (chain.length <= 1) return; // Can't remove the starting word
    chain = chain.slice(0, -1);
    gameComplete = false; // In case we were complete
    showMessage('Word removed - try a different path!', 'info');
  }
  
  function selectGroup(group: FoodGroup) {
    if (!pendingWord) return;
    
    addWordToChain(pendingWord.word, pendingWord.entry, group);
    pendingWord = null;
    showGroupPicker = false;
  }
  
  // Change the group of an already-placed word
  function openGroupChanger(index: number) {
    changingGroupIndex = index;
  }
  
  function changeWordGroup(newGroup: FoodGroup) {
    if (changingGroupIndex === null) return;
    
    const item = chain[changingGroupIndex];
    chain = chain.map((c, i) => 
      i === changingGroupIndex ? { ...c, group: newGroup } : c
    );
    changingGroupIndex = null;
    showMessage(`Changed to ${GROUP_NAMES[newGroup]}`, 'success');
  }
  
  function showMessage(text: string, type: 'error' | 'success' | 'info') {
    message = text;
    messageType = type;
    setTimeout(() => { message = ''; }, 2000);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      submitWord();
    }
  }
  
  function saveProgress() {
    if (typeof window === 'undefined') return;
    
    const lastPlayed = localStorage.getItem('dailyChainLastPlayed');
    const today = new Date().toDateString();
    
    if (lastPlayed === today) return;
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastPlayed === yesterday) {
      streak += 1;
    } else if (lastPlayed !== today) {
      streak = 1;
    }
    
    localStorage.setItem('dailyChainStreak', streak.toString());
    localStorage.setItem('dailyChainLastPlayed', today);
  }
  
  function getAchievementBadge(): { emoji: string; label: string } {
    const uniqueGroups = new Set(chain.map(c => c.group)).size;
    
    if (uniqueGroups >= 11) return { emoji: '⭐', label: 'Perfect Chain' };
    if (uniqueGroups >= 9) return { emoji: '🌟', label: 'Excellent' };
    if (uniqueGroups >= 7) return { emoji: '✨', label: 'Great' };
    if (uniqueGroups >= 5) return { emoji: '👍', label: 'Good' };
    return { emoji: '✅', label: 'Complete' };
  }
  
  function shareResults() {
    const groups = getGroupsUsed();
    const badge = getAchievementBadge();
    const groupEmojis = groups.map(g => GROUP_EMOJI[g]).join('');
    const modeEmoji = difficultyMode ? DIFFICULTY_EMOJI[difficultyMode] : '';
    const modeLabel = difficultyMode ? DIFFICULTY_LABELS[difficultyMode] : '';
    
    const text = `🔗 Daily Food Chain #${puzzleNumber} ${modeEmoji}
${badge.emoji} ${badge.label}${groups.length >= 11 ? ' • Perfectly Balanced!' : groups.length >= 8 ? ' • Well Rounded!' : ''}
Score: ${Math.round($animatedScore)}${difficultyMode !== 'easy' ? ` (${modeLabel} Mode)` : ''}
${groupEmojis}
${streak > 1 ? `🔥 ${streak} day streak` : ''}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      showMessage('Copied to clipboard!', 'success');
    }
  }
</script>

<svelte:head>
  <title>Daily Food Chain</title>
</svelte:head>

<div class="game-container">
  <!-- Difficulty Selector Modal -->
  {#if showDifficultySelector}
    <div class="modal-overlay" in:fade>
      <div class="modal difficulty-modal" in:scale>
        <h2>🔗 Daily Food Chain #{puzzleNumber}</h2>
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

  <!-- Header -->
  <header>
    <h1>🔗 Daily Food Chain</h1>
    <p class="puzzle-number">
      #{puzzleNumber} · 
      {#if difficultyMode}
        <button class="mode-badge-btn" onclick={() => showDifficultySelector = true} title="Change difficulty">
          {DIFFICULTY_EMOJI[difficultyMode]} {DIFFICULTY_LABELS[difficultyMode]}
        </button> · 
      {/if}
      <button class="rules-link" onclick={() => showRules = true}>Rules</button>
    </p>
  </header>

  <!-- Score display -->
  <div class="score-bar">
    <div class="score">
      <span class="label">Score</span>
      <span class="value">{Math.round($animatedScore)}</span>
    </div>
    <div class="words-left">
      <span class="label">Words Left</span>
      <span class="value">{wordsRemaining}</span>
    </div>
    <div class="groups-count">
      <span class="label">Groups</span>
      <span class="value">{getGroupsUsed().length}/11</span>
    </div>
  </div>
  
  <!-- Food Groups Panel -->
  {#if difficultyMode && !showDifficultySelector}
    <div class="food-groups-panel">
      {#if true}
        {@const usedCount = new Set(chain.map(c => c.group)).size}
        {@const remainingCount = ALL_GROUPS.length - usedCount}
        {#if remainingCount > 0 && chain.length > 1}
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
      
      <!-- Group chips -->
      <div class="groups-bar">
        {#each ALL_GROUPS as group}
          {@const isUsed = chain.some(c => c.group === group)}
          {@const availableFoods = getFoodsForGroup(group).length}
          <button 
            class="group-chip" 
            class:expanded={expandedGroup === group && difficultyMode === 'easy'}
            class:used={isUsed}
            class:no-expand={difficultyMode !== 'easy'}
            class:no-foods={availableFoods === 0 && difficultyMode === 'easy'}
            style="--group-color: {GROUP_COLORS[group]}"
            onclick={() => difficultyMode === 'easy' && availableFoods > 0 && toggleGroupExpand(group)}
            title="{GROUP_NAMES[group]}{difficultyMode !== 'easy' ? ' (no hints in this mode)' : availableFoods === 0 ? ' (no foods starting with ' + lastLetter + ')' : ''}"
            disabled={difficultyMode === 'easy' && availableFoods === 0}
          >
            <span class="chip-emoji">{GROUP_EMOJI[group]}</span>
            <span class="chip-name">{GROUP_NAMES[group]}</span>
            {#if isUsed}
              <span class="used-check">✓</span>
            {:else if difficultyMode === 'easy' && availableFoods > 0}
              <span class="food-count">{availableFoods}</span>
            {/if}
          </button>
        {/each}
      </div>
      
      <!-- Easy Mode: Food list dropdown -->
      {#if difficultyMode === 'easy' && expandedGroup}
        <div class="group-food-list" transition:fly={{ y: -10, duration: 200 }}>
          <div class="list-header">
            <span>{GROUP_EMOJI[expandedGroup]} {GROUP_NAMES[expandedGroup]} (starting with {lastLetter})</span>
            <button class="close-list" onclick={() => expandedGroup = null}>✕</button>
          </div>
          <div class="food-items">
            {#each getFoodsForGroup(expandedGroup) as food}
              <button 
                class="food-tag selectable"
                onclick={() => insertFoodFromList(food)}
              >
                {food}
              </button>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Medium Mode: Letter search -->
      {#if difficultyMode === 'medium'}
        <div class="letter-search-panel" transition:fly={{ y: -10, duration: 200 }}>
          <div class="search-header">
            <span>🔍 Word Tips (starting with {lastLetter})</span>
          </div>
          <div class="search-controls">
            <select bind:value={letterSearchType} onchange={searchByLetter}>
              <option value="first">Also starts with</option>
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
                {#each letterSearchResults.slice(0, 30) as food}
                  <button 
                    class="food-tag selectable"
                    onclick={() => insertFoodFromList(food)}
                  >
                    {food}
                  </button>
                {/each}
                {#if letterSearchResults.length > 30}
                  <span class="more-results">...and {letterSearchResults.length - 30} more</span>
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
          <span>🧠 Hard Mode: Next word must start with <strong>{lastLetter}</strong></span>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Word chain display -->
  <div class="chain">
    {#each chain as item, i (item.word + i)}
      <div 
        class="word-card"
        class:starter={i === 0}
        in:fly={{ y: 30, duration: 300 }}
        animate:flip={{ duration: 300 }}
      >
        <span class="group-badge" style="background: {GROUP_COLORS[item.group]}">{GROUP_EMOJI[item.group]}</span>
        <span class="word">{item.word}</span>
        <span class="group-name" style="color: {GROUP_TEXT_COLORS[item.group]}">
          {GROUP_NAMES[item.group]}
          {#if item.entry.groups.length > 1}
            <button class="change-group-btn" onclick={() => openGroupChanger(i)} title="Change food group">🔄</button>
          {/if}
        </span>
        {#if i < chain.length - 1}
          <span class="connector">→</span>
        {:else if i > 0 && !gameComplete}
          <button class="remove-btn" onclick={removeLastWord} title="Remove this word">✕</button>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Input area -->
  {#if !gameComplete && difficultyMode}
    <div class="input-area">
      <div class="hint">
        Next word starts with: <strong class="letter">{lastLetter}</strong>
      </div>
      <div class="input-row">
        <input
          type="text"
          bind:value={currentWord}
          onkeydown={handleKeydown}
          placeholder="Type a food word..."
          autocomplete="off"
          autocapitalize="characters"
        />
        <button class="submit-btn" onclick={submitWord}>Add</button>
      </div>
    </div>
  {:else if gameComplete}
    <div class="complete-actions">
      <button class="view-results-btn" onclick={() => showResults = true}>🏆 View Results</button>
    </div>
  {/if}

  <!-- Group Picker Modal -->
  {#if showGroupPicker && pendingWord}
    <div class="modal-overlay" in:fade onclick={() => { showGroupPicker = false; pendingWord = null; }}>
      <div class="modal group-picker" in:scale onclick={(e) => e.stopPropagation()}>
        <h3>{pendingWord.word}</h3>
        <p class="dual-info">This food belongs to multiple groups. Pick one:</p>
        <div class="group-options">
          {#each pendingWord.entry.groups as group}
            <button 
              class="group-btn"
              style="background: {GROUP_COLORS[group]}"
              onclick={() => selectGroup(group)}
            >
              {GROUP_EMOJI[group]} {GROUP_NAMES[group]}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Group Changer Modal (for changing existing word's group) -->
  {#if changingGroupIndex !== null}
    {@const item = chain[changingGroupIndex]}
    <div class="modal-overlay" in:fade onclick={() => changingGroupIndex = null}>
      <div class="modal group-picker" in:scale onclick={(e) => e.stopPropagation()}>
        <h3>{item.word}</h3>
        <p class="dual-info">Change food group:</p>
        <div class="group-options">
          {#each item.entry.groups as group}
            <button 
              class="group-btn"
              class:current={group === item.group}
              style="background: {GROUP_COLORS[group]}"
              onclick={() => changeWordGroup(group)}
            >
              {GROUP_EMOJI[group]} {GROUP_NAMES[group]}
              {#if group === item.group}
                <span class="current-badge">current</span>
              {/if}
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
        <h2>🔗 Daily Food Chain #{puzzleNumber}</h2>
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
          View Chain
        </button>
      </div>
    </div>
  {/if}

  <!-- Rules Modal -->
  {#if showRules}
    <div class="modal-overlay" in:fade onclick={() => showRules = false}>
      <div class="modal rules-modal" in:scale onclick={(e) => e.stopPropagation()}>
        <h3>🔗 How to Play</h3>
        <div class="rules-content">
          <h4>🎯 Goal</h4>
          <p>Build a chain of 11 food words where each word starts with the last letter of the previous word.</p>
          
          <h4>📝 Rules</h4>
          <ul>
            <li>Each word must start with the last letter of the previous word</li>
            <li>Use real food words only</li>
            <li>No repeating words</li>
            <li>Try to use all 11 food groups for bonus points!</li>
          </ul>
          
          <h4>🏆 Scoring</h4>
          <ul>
            <li>+1 point per letter (after starting word)</li>
            <li>+10 points per unique food group</li>
            <li>+25 bonus for completing 11 words</li>
            <li>+50 bonus for using all 11 groups</li>
          </ul>
          
          <h4>🍽️ Food Groups</h4>
          <p>Vegetable, Fruit, Grain, Protein, Dairy, Legume, Nuts/Seeds, Fats/Oils, Spice, Prepared, Beverage</p>
        </div>
        <button class="close-rules" onclick={() => showRules = false}>Got it!</button>
      </div>
    </div>
  {/if}

  <!-- Message toast -->
  {#if message}
    <div 
      class="toast" 
      class:error={messageType === 'error'}
      class:success={messageType === 'success'}
      in:fly={{ y: 50, duration: 200 }}
    >
      {message}
    </div>
  {/if}
</div>

<style>
  .game-container {
    width: 100%;
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
  
  .rules-link, .mode-badge-btn {
    background: none;
    border: none;
    color: #6366f1;
    text-decoration: underline;
    cursor: pointer;
    font-size: inherit;
    padding: 0;
  }
  
  .mode-badge-btn {
    text-decoration-style: dotted;
    text-underline-offset: 2px;
    font-weight: 600;
    color: #374151;
  }
  
  .mode-badge-btn:hover {
    color: #6366f1;
  }
  
  .score-bar {
    display: flex;
    justify-content: space-around;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .score, .words-left, .groups-count {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .label {
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #22c55e;
  }
  
  /* Food Groups Panel */
  .food-groups-panel {
    margin-bottom: 1rem;
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
  
  .group-chip:hover:not(:disabled) {
    background: color-mix(in srgb, var(--group-color) 15%, white);
  }
  
  .group-chip.expanded {
    background: var(--group-color);
    color: white;
  }
  
  .group-chip.used {
    opacity: 0.5;
    background: #e5e7eb;
    border-color: #22c55e;
    border-width: 2px;
  }
  
  .group-chip.no-foods {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .group-chip.no-expand {
    cursor: default;
  }
  
  .chip-emoji {
    font-size: 0.75rem;
  }
  
  .chip-name {
    font-size: 0.65rem;
    white-space: nowrap;
  }
  
  .used-check {
    color: #22c55e;
    font-weight: bold;
  }
  
  .food-count {
    font-size: 0.6rem;
    background: var(--group-color);
    color: white;
    padding: 0.1rem 0.3rem;
    border-radius: 10px;
    font-weight: bold;
  }
  
  .groups-progress {
    text-align: center;
    padding: 0.35rem 0.75rem;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.5rem;
  }
  
  .groups-progress.complete {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
  }
  
  .group-food-list {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 0.75rem;
    margin-top: 0.5rem;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .close-list {
    background: #f3f4f6;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .food-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    max-height: 150px;
    overflow-y: auto;
  }
  
  .food-tag {
    padding: 0.35rem 0.6rem;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 15px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.1s;
  }
  
  .food-tag.selectable:hover {
    background: #22c55e;
    color: white;
    transform: scale(1.05);
  }
  
  /* Letter Search */
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
  
  .clear-search {
    padding: 0.5rem 0.75rem;
    background: #fbbf24;
    border: none;
    border-radius: 8px;
    cursor: pointer;
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
  
  .hard-mode-hint {
    background: linear-gradient(135deg, #fecaca, #fca5a5);
    border-radius: 12px;
    padding: 0.75rem;
    margin-top: 0.5rem;
    text-align: center;
    font-weight: 600;
    color: #991b1b;
  }
  
  /* Chain */
  .chain {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .word-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-left: 4px solid #22c55e;
  }
  
  .word-card.starter {
    border-left-color: #f59e0b;
    background: linear-gradient(90deg, #fffbeb 0%, white 30%);
  }
  
  .group-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .word {
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    flex: 1;
  }
  
  .group-name {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .connector {
    color: #22c55e;
    font-size: 1.25rem;
    font-weight: bold;
  }
  
  .remove-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #fecaca;
    color: #dc2626;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  
  .remove-btn:hover {
    background: #dc2626;
    color: white;
    transform: scale(1.1);
  }
  
  .change-group-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: #e5e7eb;
    color: #6b7280;
    font-size: 0.85rem;
    cursor: pointer;
    margin-left: 0.25rem;
    padding: 0;
    transition: all 0.15s ease;
    vertical-align: middle;
  }
  
  .change-group-btn:hover {
    background: #6366f1;
    color: white;
    transform: scale(1.1);
  }
  
  .group-btn.current {
    opacity: 0.7;
    position: relative;
  }
  
  .current-badge {
    font-size: 0.7rem;
    margin-left: 0.5rem;
    opacity: 0.8;
  }
  
  /* Input */
  .input-area {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .hint {
    text-align: center;
    font-size: 1rem;
    color: #666;
  }
  
  .letter {
    font-size: 1.5rem;
    font-weight: bold;
    color: #22c55e;
    background: #f0fdf4;
    padding: 0.1em 0.3em;
    border-radius: 6px;
  }
  
  .input-row {
    display: flex;
    gap: 0.5rem;
  }
  
  .input-row input {
    flex: 1;
    font-size: 1.1rem;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    text-transform: uppercase;
  }
  
  .input-row input:focus {
    outline: none;
    border-color: #22c55e;
  }
  
  .submit-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    transform: scale(1.02);
  }
  
  .complete-actions {
    text-align: center;
  }
  
  .view-results-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  /* Modals */
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
    max-width: 400px;
    width: 90%;
    text-align: center;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .modal h2, .modal h3 {
    margin: 0 0 0.5rem;
  }
  
  /* Difficulty Modal */
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

  
  /* Group Picker */
  .group-picker .dual-info {
    color: #6366f1;
    font-size: 0.9rem;
    margin: 0.5rem 0;
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
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  
  .group-btn:hover {
    transform: scale(1.02);
  }
  
  /* Results Modal */
  .results .difficulty-badge {
    color: #6b7280;
    font-weight: 600;
    margin: 0;
  }
  
  .complete-badge {
    font-size: 1.2rem;
    color: #22c55e;
    margin: 0.5rem 0;
  }
  
  .balanced {
    font-size: 1.1rem;
    color: #6366f1;
  }
  
  .achievement {
    margin: 1rem 0;
  }
  
  .achievement .badge {
    font-size: 3rem;
    display: block;
  }
  
  .final-score {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem 0;
  }
  
  .groups-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: center;
    margin: 1rem 0;
  }
  
  .group-tag {
    padding: 0.35rem 0.6rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }
  
  .streak {
    color: #f59e0b;
    font-size: 1.1rem;
  }
  
  .share-btn, .resume-btn, .close-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin: 0.25rem 0;
    color: white;
  }
  
  .share-btn {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
  
  .resume-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }
  
  .close-btn {
    background: #6b7280;
  }
  
  /* Rules Modal */
  .rules-modal {
    text-align: left;
  }
  
  .rules-modal h3 {
    text-align: center;
  }
  
  .rules-content h4 {
    margin: 1rem 0 0.5rem;
    color: #374151;
  }
  
  .rules-content p {
    margin: 0.5rem 0;
    color: #4b5563;
  }
  
  .rules-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  .rules-content li {
    margin: 0.25rem 0;
    color: #4b5563;
  }
  
  .close-rules {
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.75rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  /* Toast */
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    font-weight: 600;
    z-index: 200;
  }
  
  .toast.error {
    background: #fef2f2;
    color: #dc2626;
  }
  
  .toast.success {
    background: #f0fdf4;
    color: #16a34a;
  }
</style>
