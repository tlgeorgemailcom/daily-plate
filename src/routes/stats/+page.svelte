<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { playerStore } from '$lib/stores/playerStore';
  import GameCheckbox from '$lib/components/stats/GameCheckbox.svelte';
  import ShareButton from '$lib/components/stats/ShareButton.svelte';

  interface GameScore {
    id: number;
    game: string;
    score: number;
    played_at: string;
    details: Record<string, unknown> | null;
  }

  // All possible games
  const ALL_GAMES = [
    'chain', 'plate', 'matching', 'tower', 
    'scrambled', 'slider', 'farmers-basket', 'balanced-diet'
  ];

  let loading = $state(true);
  let error = $state<string | null>(null);
  let todaysScores = $state<GameScore[]>([]);
  let checkedGames = $state<Set<string>>(new Set());

  // Get score for each game (most recent if multiple)
  const scoresByGame = $derived(() => {
    const map = new Map<string, GameScore>();
    for (const score of todaysScores) {
      if (!map.has(score.game)) {
        map.set(score.game, score);
      }
    }
    return map;
  });

  // Get selected scores for sharing
  const selectedScores = $derived(() => {
    return todaysScores.filter(s => checkedGames.has(s.game));
  });

  // Today's date formatted
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  function toggleGame(game: string) {
    const newChecked = new Set(checkedGames);
    if (newChecked.has(game)) {
      newChecked.delete(game);
    } else {
      newChecked.add(game);
    }
    checkedGames = newChecked;
  }

  async function loadTodaysScores() {
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
      const response = await fetch(`/api/game-scores/today?player_id=${player.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      
      const data = await response.json();
      todaysScores = data.scores || [];
      
      // Check all played games by default
      checkedGames = new Set(todaysScores.map(s => s.game));
    } catch (e) {
      error = 'Could not load your stats. Please try again.';
      console.error('Error loading stats:', e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadTodaysScores();
  });
</script>

<svelte:head>
  <title>Today's Stats | Daily Food Chain</title>
</svelte:head>

<div class="stats-page">
  <header class="page-header">
    <h1>Today's Stats</h1>
    <p class="date">{todayDate}</p>
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
  {:else}
    <section class="games-section">
      <h2>Games Played Today</h2>
      
      {#if todaysScores.length === 0}
        <div class="empty-today">
          <p>No games played yet today</p>
          <p class="hint">Play a game to see your stats here!</p>
        </div>
      {:else}
        <div class="games-list">
          {#each ALL_GAMES as game}
            {@const score = scoresByGame().get(game) || null}
            <GameCheckbox 
              {game} 
              {score}
              checked={checkedGames.has(game)}
              onToggle={toggleGame}
            />
          {/each}
        </div>
        
        <ShareButton 
          selectedGames={selectedScores()} 
          disabled={selectedScores().length === 0}
        />
      {/if}
    </section>

    <nav class="page-nav">
      <a href="/stats/history" class="nav-link">
        <span class="nav-icon">📜</span>
        <span class="nav-text">View Full History</span>
        <span class="nav-arrow">→</span>
      </a>
      
      <a href="/stats/all" class="nav-link">
        <span class="nav-icon">📊</span>
        <span class="nav-text">View All Stats</span>
        <span class="nav-arrow">→</span>
      </a>
    </nav>
  {/if}
</div>

<style>
  .stats-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    background: #f8f9fa;
  }

  .page-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .page-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 4px 0;
  }

  .date {
    color: #888;
    font-size: 15px;
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

  .games-section {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .games-section h2 {
    font-size: 16px;
    font-weight: 600;
    color: #666;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .empty-today {
    text-align: center;
    padding: 32px 16px;
    color: #888;
  }

  .empty-today p {
    margin: 0;
  }

  .hint {
    font-size: 14px;
    color: #aaa !important;
    margin-top: 8px !important;
  }

  .games-list {
    margin-bottom: 8px;
  }

  .page-nav {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: white;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .nav-link:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .nav-icon {
    font-size: 24px;
    margin-right: 14px;
  }

  .nav-text {
    flex: 1;
    font-weight: 500;
    color: #333;
  }

  .nav-arrow {
    color: #999;
    font-size: 18px;
  }
</style>
