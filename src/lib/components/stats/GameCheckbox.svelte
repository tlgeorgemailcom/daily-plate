<script lang="ts">
  interface GameScore {
    id: number;
    game: string;
    score: number;
    played_at: string;
    details: Record<string, unknown> | null;
  }

  interface Props {
    game: string;
    scores: GameScore[];  // All scores for this game today
    checked: boolean;
    onToggle: (game: string) => void;
  }

  let { game, scores, checked, onToggle }: Props = $props();

  const played = $derived(scores.length > 0);

  const gameEmojis: Record<string, string> = {
    'chain': '🔗',
    'plate': '🍽️',
    'matching': '🃏',
    'tower': '🗼',
    'scrambled': '🐝',
    'slider': '🧩',
    'farmers-basket': '🧺',
    'balanced-diet': '🥗'
  };

  const gameNames: Record<string, string> = {
    'chain': 'Food Chain',
    'plate': 'Daily Plate',
    'matching': 'Matching Containers',
    'tower': 'Tower of Food',
    'scrambled': 'Scrambled Bees',
    'slider': 'Food Slider',
    'farmers-basket': "Farmer's Basket",
    'balanced-diet': 'Balanced Diet'
  };

  // Simple summary - details are in the Message Preview
  function getSummary(): string {
    if (scores.length === 0) return '';
    if (scores.length > 1) return `${scores.length} plays`;
    return 'Played ✓';
  }

  function handleClick() {
    if (played) {
      onToggle(game);
    }
  }
</script>

<button 
  class="game-row" 
  class:disabled={!played}
  class:checked={checked && played}
  onclick={handleClick}
  disabled={!played}
>
  <span class="checkbox">
    {#if played}
      {checked ? '☑' : '☐'}
    {:else}
      <span class="unchecked">☐</span>
    {/if}
  </span>
  
  <span class="game-info">
    <span class="emoji">{gameEmojis[game] || '🎮'}</span>
    <span class="name">{gameNames[game] || game}</span>
  </span>
  
  <span class="score">
    {#if played}
      {getSummary()}
    {:else}
      <span class="not-played">not played today</span>
    {/if}
  </span>
</button>

<style>
  .game-row {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    margin-bottom: 8px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    font-size: 15px;
  }

  .game-row:hover:not(.disabled) {
    background: #f8f8f8;
    border-color: #ddd;
  }

  .game-row.checked {
    background: #e8f5e9;
    border-color: #4caf50;
  }

  .game-row.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox {
    font-size: 20px;
    margin-right: 12px;
    color: #4caf50;
  }

  .checkbox .unchecked {
    color: #ccc;
  }

  .game-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .emoji {
    font-size: 20px;
  }

  .name {
    font-weight: 500;
    color: #333;
  }

  .score {
    font-weight: 600;
    color: #2196f3;
  }

  .not-played {
    font-weight: 400;
    font-size: 13px;
    color: #999;
    font-style: italic;
  }
</style>
