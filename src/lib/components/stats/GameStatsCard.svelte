<script lang="ts">
  interface GameStats {
    game: string;
    games_played: number;
    high_score: number;
    avg_score: number;
    first_played: string;
    last_played: string;
  }

  interface Props {
    stats: GameStats;
  }

  let { stats }: Props = $props();

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

  const gameColors: Record<string, string> = {
    'chain': '#4caf50',
    'plate': '#2196f3',
    'matching': '#9c27b0',
    'tower': '#ff9800',
    'scrambled': '#ffc107',
    'slider': '#00bcd4',
    'farmers-basket': '#8bc34a',
    'balanced-diet': '#ff5722'
  };

  function formatScore(game: string, score: number, isHigh: boolean): string {
    switch (game) {
      case 'chain':
      case 'plate':
        return `${Math.round(score)} pts`;
      case 'matching':
        return `${Math.round(score)} matches`;
      case 'tower':
        return `${Math.round(score)} guesses`;
      case 'scrambled':
        return `${Math.round(score)}%`;
      case 'slider':
        return `${Math.round(score)} moves`;
      case 'farmers-basket':
        return isHigh ? '1 (Win)' : `${Math.round(score * 100)}% wins`;
      case 'balanced-diet':
        return `${Math.round(score)}/7`;
      default:
        return `${Math.round(score)}`;
    }
  }

  const color = $derived(gameColors[stats.game] || '#666');
</script>

<div class="game-card" style="--accent-color: {color}">
  <div class="card-header">
    <span class="emoji">{gameEmojis[stats.game] || '🎮'}</span>
    <span class="name">{gameNames[stats.game] || stats.game}</span>
  </div>
  
  <div class="card-stats">
    <div class="stat">
      <span class="stat-value">{stats.games_played}</span>
      <span class="stat-label">Played</span>
    </div>
    
    <div class="stat">
      <span class="stat-value">{formatScore(stats.game, stats.high_score, true)}</span>
      <span class="stat-label">{stats.game === 'slider' || stats.game === 'tower' ? 'Best' : 'High'}</span>
    </div>
    
    <div class="stat">
      <span class="stat-value">{formatScore(stats.game, stats.avg_score, false)}</span>
      <span class="stat-label">Average</span>
    </div>
  </div>
  
  <div class="card-footer">
    <span class="date">
      Last played: {new Date(stats.last_played).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
    </span>
  </div>
</div>

<style>
  .game-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #f0f0f0;
    border-left: 4px solid var(--accent-color);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .emoji {
    font-size: 24px;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .card-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }

  .stat {
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: var(--accent-color);
  }

  .stat-label {
    display: block;
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  .card-footer {
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
  }

  .date {
    font-size: 13px;
    color: #888;
  }
</style>
