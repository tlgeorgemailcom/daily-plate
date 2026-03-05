<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { playerStore } from '$lib/stores/playerStore';
  import StatsSummaryCards from '$lib/components/stats/StatsSummaryCards.svelte';
  import GameStatsCard from '$lib/components/stats/GameStatsCard.svelte';

  interface GameStats {
    game: string;
    games_played: number;
    high_score: number;
    avg_score: number;
    first_played: string;
    last_played: string;
  }

  let loading = $state(true);
  let error = $state<string | null>(null);
  let stats = $state<GameStats[]>([]);
  let streak = $state(0);

  // Order games should appear
  const GAME_ORDER = [
    'chain', 'plate', 'matching', 'tower', 
    'scrambled', 'slider', 'farmers-basket', 'balanced-diet'
  ];

  const sortedStats = $derived(() => {
    return [...stats].sort((a, b) => {
      const aIdx = GAME_ORDER.indexOf(a.game);
      const bIdx = GAME_ORDER.indexOf(b.game);
      return aIdx - bIdx;
    });
  });

  async function loadStats() {
    const player = $playerStore;
    
    if (player.status !== 'logged-in' || player.tier !== 'premium') {
      error = 'Stats are available for premium members only';
      loading = false;
      return;
    }

    if (!player.id) {
      error = 'Please log in to view your stats';
      loading = false;
      return;
    }

    try {
      const response = await fetch(`/api/game-scores/stats?player_id=${player.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      stats = data.stats || [];
      
      // Calculate streak (days with at least one game)
      // This is a simplified version - proper streak would need daily aggregation
      streak = await calculateStreak(player.id);
    } catch (e) {
      error = 'Could not load your stats. Please try again.';
      console.error('Error loading stats:', e);
    } finally {
      loading = false;
    }
  }

  async function calculateStreak(playerId: string): Promise<number> {
    try {
      // Get recent scores to calculate streak
      const response = await fetch(`/api/game-scores?player_id=${playerId}&limit=100`);
      if (!response.ok) return 0;
      
      const data = await response.json();
      const scores = data.scores || [];
      
      if (scores.length === 0) return 0;
      
      // Get unique dates played
      const datesPlayed = new Set<string>();
      for (const score of scores) {
        const date = new Date(score.played_at).toISOString().split('T')[0];
        datesPlayed.add(date);
      }
      
      // Sort dates descending
      const sortedDates = Array.from(datesPlayed).sort().reverse();
      
      // Check if today or yesterday is in the list (streak must be current)
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (!datesPlayed.has(today) && !datesPlayed.has(yesterday)) {
        return 0; // Streak broken
      }
      
      // Count consecutive days
      let currentStreak = 0;
      let checkDate = new Date(sortedDates[0]);
      
      for (const dateStr of sortedDates) {
        const date = new Date(dateStr);
        const expectedDate = new Date(checkDate);
        expectedDate.setDate(expectedDate.getDate() - currentStreak);
        
        if (date.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      return currentStreak;
    } catch {
      return 0;
    }
  }

  onMount(() => {
    loadStats();
  });
</script>

<svelte:head>
  <title>All Stats | Daily Food Chain</title>
</svelte:head>

<div class="all-stats-page">
  <header class="page-header">
    <a href="/stats" class="back-link">← Back</a>
    <h1>📊 All Stats</h1>
  </header>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading your stats...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <div class="error-icon">🔒</div>
      <p>{error}</p>
      {#if $playerStore.tier !== 'premium'}
        <button class="upgrade-btn" onclick={() => goto('/account')}>
          Upgrade to Premium
        </button>
      {/if}
    </div>
  {:else if stats.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <p>No stats yet</p>
      <p class="hint">Play some games to build up your stats!</p>
      <a href="/" class="play-btn">Play Now</a>
    </div>
  {:else}
    <section class="summary-section">
      <StatsSummaryCards {stats} {streak} />
    </section>

    <section class="games-section">
      <h2>Per-Game Stats</h2>
      <div class="games-grid">
        {#each sortedStats() as gameStat (gameStat.game)}
          <GameStatsCard stats={gameStat} />
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .all-stats-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    background: #f8f9fa;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .back-link {
    display: inline-block;
    color: #666;
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .back-link:hover {
    color: #333;
  }

  .page-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .loading {
    text-align: center;
    padding: 60px 20px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e0e0e0;
    border-top-color: #4caf50;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading p {
    color: #888;
  }

  .error-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    margin: 20px 0;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-state p {
    color: #666;
    margin: 0 0 20px 0;
  }

  .upgrade-btn {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    margin: 20px 0;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-state p {
    color: #666;
    margin: 0;
  }

  .hint {
    font-size: 14px;
    color: #999 !important;
    margin-top: 8px !important;
  }

  .play-btn {
    display: inline-block;
    margin-top: 20px;
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
  }

  .summary-section {
    margin-bottom: 24px;
  }

  .games-section h2 {
    font-size: 16px;
    font-weight: 600;
    color: #666;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  @media (max-width: 640px) {
    .games-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
