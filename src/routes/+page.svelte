<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { foodWords } from '$lib/data/foods';
  
  // Game state
  let chain: string[] = $state(['APPLE']);
  let currentWord = $state('');
  let message = $state('');
  let messageType = $state<'error' | 'success' | 'info'>('info');
  let gameComplete = $state(false);
  
  // Computed values (reactive)
  let lastLetter = $derived(chain[chain.length - 1].slice(-1).toUpperCase());
  let wordsRemaining = $derived(5 - (chain.length - 1));
  
  // Animated score
  const animatedScore = tweened(0, { duration: 400, easing: cubicOut });
  
  // Calculate score: 1 point per letter for words 2-5, +10 bonus for completion
  $effect(() => {
    const baseScore = chain.slice(1).reduce((sum, word) => sum + word.length, 0);
    const bonus = chain.length >= 6 ? 10 : 0;
    animatedScore.set(baseScore + bonus);
  });
  
  function submitWord() {
    const word = currentWord.toUpperCase().trim();
    
    if (!word) return;
    
    // Check starting letter
    if (word[0] !== lastLetter) {
      showMessage(`Must start with "${lastLetter}"`, 'error');
      return;
    }
    
    // Check if in database (240 real USDA food words)
    if (!foodWords.has(word)) {
      showMessage('Not a recognized food', 'error');
      return;
    }
    
    // Check for duplicates
    if (chain.includes(word)) {
      showMessage('Already used!', 'error');
      return;
    }
    
    // Add word to chain
    chain = [...chain, word];
    currentWord = '';
    
    // Check for completion
    if (chain.length >= 6) {
      gameComplete = true;
      showMessage('🎉 Chain Complete!', 'success');
    } else {
      showMessage(`Great! ${wordsRemaining} word${wordsRemaining !== 1 ? 's' : ''} to go`, 'success');
    }
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
  
  // Food emoji mapping for visual flair
  const foodEmojis: Record<string, string> = {
    APPLE: '🍎', APRICOT: '🍑', AVOCADO: '🥑', BANANA: '🍌',
    BROCCOLI: '🥦', CARROT: '🥕', CELERY: '🥬', CHERRY: '🍒', CHICKEN: '🍗',
    CORN: '🌽', CUCUMBER: '🥒', EGG: '🥚', EGGPLANT: '🍆',
    FISH: '🐟', GRAPE: '🍇', GRAPEFRUIT: '🍊', HAM: '🍖', HONEY: '🍯',
    KIWI: '🥝', LEMON: '🍋', LETTUCE: '🥬', LIME: '🍋', MANGO: '🥭',
    MELON: '🍈', MILK: '🥛', MUSHROOM: '🍄', OLIVE: '🫒', ONION: '🧅',
    ORANGE: '🍊', PEACH: '🍑', PEAR: '🍐', PEPPER: '🌶️', POTATO: '🥔',
    PUMPKIN: '🎃', RICE: '🍚', SALMON: '🐟', SPINACH: '🥬', SQUASH: '🎃',
    STRAWBERRY: '🍓', TOMATO: '🍅', TUNA: '🐟', TURKEY: '🦃', WALNUT: '🌰',
    WATERMELON: '🍉', YOGURT: '🥛', CHEESE: '🧀', BACON: '🥓',
    BEEF: '🥩', PORK: '🐷', LAMB: '🐑', SHRIMP: '🦐', CRAB: '🦀',
    LOBSTER: '🦞', COCONUT: '🥥', PEANUT: '🥜', GARLIC: '🧄',
    GINGER: '🫚', CHILI: '🌶️', TEA: '🍵', CHOCOLATE: '🍫',
    TACO: '🌮', SUSHI: '🍣', RAMEN: '🍜',
  };
  
  // Get emoji for a food word, with fallback
  function getEmoji(word: string): string {
    if (foodEmojis[word]) return foodEmojis[word];
    // Category-based fallbacks
    if (word.includes('FISH') || word.includes('SALMON') || word.includes('TUNA')) return '🐟';
    if (word.includes('MEAT') || word.includes('BEEF') || word.includes('PORK')) return '🥩';
    if (word.includes('NUT')) return '🥜';
    if (word.includes('BERRY')) return '🫐';
    return '🍽️';
  }
</script>

<svelte:head>
  <title>Daily Food Chain</title>
</svelte:head>

<div class="game-container">
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
  </div>
  
  <!-- Word chain display -->
  <div class="chain">
    {#each chain as word, i (word + i)}
      <div 
        class="word-card"
        class:starter={i === 0}
        in:fly={{ y: 30, duration: 300 }}
        animate:flip={{ duration: 300 }}
      >
        <span class="emoji">{getEmoji(word)}</span>
        <span class="word">{word}</span>
        {#if i < chain.length - 1}
          <span class="connector">→</span>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Input area -->
  {#if !gameComplete}
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
  {:else}
    <div class="complete-message" in:scale={{ duration: 400 }}>
      <h2>🎉 Excellent! 🎉</h2>
      <p>Final Score: {Math.round($animatedScore)}</p>
      <button class="share-btn">Share Result</button>
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
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .score-bar {
    display: flex;
    justify-content: space-around;
    background: var(--gradient-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-sm);
  }
  
  .score, .words-left {
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
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--color-primary);
  }
  
  .chain {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .word-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: white;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid var(--color-primary);
  }
  
  .word-card.starter {
    border-left-color: var(--color-secondary);
    background: linear-gradient(90deg, #fff8e1 0%, white 20%);
  }
  
  .emoji {
    font-size: 1.5rem;
  }
  
  .word {
    font-family: var(--font-display);
    font-size: 1.25rem;
    letter-spacing: 0.1em;
    flex: 1;
  }
  
  .connector {
    color: var(--color-primary);
    font-size: 1.25rem;
  }
  
  .input-area {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .hint {
    text-align: center;
    font-size: 1rem;
    color: #666;
  }
  
  .letter {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--color-primary);
    background: #e8f5e9;
    padding: 0.1em 0.3em;
    border-radius: var(--radius-sm);
  }
  
  .input-row {
    display: flex;
    gap: var(--spacing-sm);
  }
  
  .input-row input {
    flex: 1;
    font-size: 1.1rem;
    text-transform: uppercase;
  }
  
  .submit-btn {
    background: var(--gradient-success);
    color: white;
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 1rem;
  }
  
  .complete-message {
    text-align: center;
    background: var(--gradient-card);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
  
  .complete-message h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
  }
  
  .complete-message p {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-lg);
  }
  
  .share-btn {
    background: var(--gradient-food);
    color: white;
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: 1rem;
  }
  
  .toast {
    position: fixed;
    bottom: var(--spacing-xl);
    left: 50%;
    transform: translateX(-50%);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-full);
    font-weight: 600;
    z-index: 100;
  }
  
  .toast.error {
    background: #ffebee;
    color: #c62828;
  }
  
  .toast.success {
    background: #e8f5e9;
    color: #2e7d32;
  }
</style>
