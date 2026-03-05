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
    score: GameScore | null;
    checked: boolean;
    onToggle: (game: string) => void;
  }

  let { game, score, checked, onToggle }: Props = $props();

  const gameEmojis: Record<string, string> = {
    'chain': '🔗',
    'plate': '🍽️',
    'matching': '🃏',
    'tower': '🏗️',
    'scrambled': '🐝',
    'slider': '🧩',
    'farmers-basket': '🧺',
    'balanced-diet': '🥗'
  };

  const gameNames: Record<string, string> = {
    'chain': 'Food Chain',
    'plate': 'Daily Plate',
    'matching': 'Matching Meals',
    'tower': 'Tower of Nutrition',
    'scrambled': 'Scrambled Bees',
    'slider': 'Food Slider',
    'farmers-basket': "Farmer's Basket",
    'balanced-diet': 'Balanced Diet'
  };

  function formatScore(score: GameScore): string {
    const details = score.details || {};
    
    switch (score.game) {
      case 'chain':
      case 'plate':
        return `${score.score} pts` + (details.difficulty ? ` (${details.difficulty})` : '');
      case 'matching':
        return `${score.score} matches` + (details.level ? ` (Level ${details.level})` : '');
      case 'tower':
        return `${score.score} guesses`;
      case 'scrambled':
        return `${score.score}%`;
      case 'slider':
        return `${score.score} moves`;
      case 'farmers-basket':
        const won = details.won ?? score.score === 1;
        return won ? '✅ Won' : '❌ Lost';
      case 'balanced-diet':
        return `${score.score}/7 nutrients`;
      default:
        return `${score.score}`;
    }
  }

  function handleClick() {
    if (score) {
      onToggle(game);
    }
  }
</script>

<button 
  class="game-row" 
  class:disabled={!score}
  class:checked={checked && score}
  onclick={handleClick}
  disabled={!score}
>
  <span class="checkbox">
    {#if score}
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
    {#if score}
      {formatScore(score)}
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
