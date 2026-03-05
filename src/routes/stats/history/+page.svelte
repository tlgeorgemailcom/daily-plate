<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { playerStore } from '$lib/stores/playerStore';
  import ScoreHistoryTable from '$lib/components/stats/ScoreHistoryTable.svelte';

  interface GameScore {
    id: number;
    game: string;
    score: number;
    played_at: string;
    details: Record<string, unknown> | null;
  }

  const GAMES = [
    { id: '', label: 'All Games' },
    { id: 'chain', label: 'Food Chain' },
    { id: 'plate', label: 'Daily Plate' },
    { id: 'matching', label: 'Matching Meals' },
    { id: 'tower', label: 'Tower' },
    { id: 'scrambled', label: 'Scrambled Bees' },
    { id: 'slider', label: 'Slider' },
    { id: 'farmers-basket', label: "Farmer's Basket" },
    { id: 'balanced-diet', label: 'Balanced Diet' }
  ];

  let loading = $state(true);
  let loadingMore = $state(false);
  let error = $state<string | null>(null);
  let scores = $state<GameScore[]>([]);
  let hasMore = $state(false);
  let selectedGame = $state('');
  let limit = 20;

  async function loadScores(reset = false) {
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

    if (reset) {
      scores = [];
      loading = true;
    } else {
      loadingMore = true;
    }

    try {
      const currentLimit = reset ? limit : scores.length + limit;
      let url = `/api/game-scores?player_id=${player.id}&limit=${currentLimit + 1}`;
      if (selectedGame) {
        url += `&game=${selectedGame}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      
      const data = await response.json();
      const fetchedScores = data.scores || [];
      
      // Check if there are more results
      hasMore = fetchedScores.length > currentLimit;
      scores = fetchedScores.slice(0, currentLimit);
    } catch (e) {
      error = 'Could not load your history. Please try again.';
      console.error('Error loading history:', e);
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  function handleGameFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedGame = target.value;
    loadScores(true);
  }

  function loadMore() {
    loadScores(false);
  }

  onMount(() => {
    loadScores(true);
  });
</script>

<svelte:head>
  <title>Score History | Daily Food Chain</title>
</svelte:head>

<div class="history-page">
  <header class="page-header">
    <a href="/stats" class="back-link">← Back</a>
    <h1>📜 Score History</h1>
  </header>

  {#if loading && scores.length === 0}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading your history...</p>
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
    <div class="filters">
      <label class="filter-label">
        Filter by game:
        <select value={selectedGame} onchange={handleGameFilter}>
          {#each GAMES as game}
            <option value={game.id}>{game.label}</option>
          {/each}
        </select>
      </label>
    </div>

    <ScoreHistoryTable 
      {scores} 
      {hasMore}
      loading={loadingMore}
      onLoadMore={loadMore}
    />
  {/if}
</div>

<style>
  .history-page {
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

  .filters {
    margin-bottom: 16px;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #666;
  }

  select {
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    min-width: 160px;
  }

  select:focus {
    outline: none;
    border-color: #4caf50;
  }
</style>
