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
    stats: GameStats[];
    streak?: number;
  }

  let { stats, streak = 0 }: Props = $props();

  // Calculate totals
  const totalGamesPlayed = $derived(
    stats.reduce((sum, s) => sum + (Number(s.games_played) || 0), 0)
  );

  // Find best day (placeholder - would need more data)
  const lastPlayed = $derived(
    stats.length > 0 
      ? new Date(stats.reduce((latest, s) => 
          new Date(s.last_played) > new Date(latest) ? s.last_played : latest, 
          stats[0].last_played
        )).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'N/A'
  );

  // Win rate for games with wins (farmers-basket)
  const winRateStats = $derived(
    stats.filter(s => s.game === 'farmers-basket')
  );
  const winRate = $derived(
    winRateStats.length > 0 && winRateStats[0].games_played > 0
      ? Math.round((winRateStats[0].avg_score || 0) * 100)
      : null
  );
</script>

<div class="summary-cards">
  <div class="card">
    <div class="card-icon">🎮</div>
    <div class="card-value">{totalGamesPlayed}</div>
    <div class="card-label">Games Played</div>
  </div>
  
  <div class="card">
    <div class="card-icon">🔥</div>
    <div class="card-value">{streak}</div>
    <div class="card-label">Day Streak</div>
  </div>
  
  <div class="card">
    <div class="card-icon">📅</div>
    <div class="card-value">{lastPlayed}</div>
    <div class="card-label">Last Played</div>
  </div>
  
  {#if winRate !== null}
    <div class="card">
      <div class="card-icon">🏆</div>
      <div class="card-value">{winRate}%</div>
      <div class="card-label">Win Rate</div>
    </div>
  {/if}
</div>

<style>
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #f0f0f0;
  }

  .card-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    line-height: 1.2;
  }

  .card-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  @media (max-width: 480px) {
    .summary-cards {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .card-value {
      font-size: 24px;
    }
  }
</style>
