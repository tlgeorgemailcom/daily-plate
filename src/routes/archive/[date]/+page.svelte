<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getPuzzleForDate, formatDateDisplay, type ComparePuzzle } from '$lib/data/compare-puzzles';

  let puzzle = $state<ComparePuzzle | null>(null);
  let dateString = $state('');
  let displayDate = $state('');
  let isToday = $state(false);

  onMount(() => {
    dateString = $page.params.date;
    displayDate = formatDateDisplay(dateString);
    
    // Parse date and get puzzle
    const date = new Date(dateString + 'T12:00:00');
    puzzle = getPuzzleForDate(date);
    
    // Check if this is today
    const today = new Date().toISOString().split('T')[0];
    isToday = dateString === today;
  });
</script>

<svelte:head>
  <title>{displayDate} | Archive | Daily Food Chain</title>
</svelte:head>

<div class="archive-day">
  <header class="page-header">
    <a href="/archive" class="back-link">← Archive</a>
    <h1>📅 {displayDate}</h1>
    {#if isToday}
      <span class="today-badge">Today</span>
    {/if}
  </header>

  {#if puzzle}
    <div class="games-grid">
      <a href="/compare?date={dateString}" class="game-card">
        <div class="game-icon">👆</div>
        <div class="game-info">
          <h2>Compare</h2>
          <p>Find 4 differences</p>
        </div>
        <div class="game-thumbnail">
          <img src={puzzle.imageA} alt="Compare puzzle" />
          <img src={puzzle.imageB} alt="Compare puzzle modified" />
        </div>
      </a>

      <a href="/slider?date={dateString}" class="game-card">
        <div class="game-icon">🧩</div>
        <div class="game-info">
          <h2>Slider</h2>
          <p>Solve the tile puzzle</p>
        </div>
        <div class="game-thumbnail single">
          <img src={puzzle.imageA} alt="Slider puzzle" />
        </div>
      </a>
    </div>
  {:else}
    <div class="error-state">
      <p>No puzzle found for this date.</p>
      <a href="/archive">← Back to Archive</a>
    </div>
  {/if}
</div>

<style>
  .archive-day {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .back-link {
    display: inline-block;
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .page-header h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  .today-badge {
    display: inline-block;
    background: #22c55e;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    margin-top: 0.5rem;
  }

  .games-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .game-card {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 0.5rem 1rem;
    padding: 1rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .game-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .game-icon {
    font-size: 2rem;
    grid-row: span 2;
    display: flex;
    align-items: center;
  }

  .game-info h2 {
    margin: 0;
    font-size: 1.125rem;
  }

  .game-info p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .game-thumbnail {
    grid-column: span 2;
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .game-thumbnail img {
    flex: 1;
    height: 80px;
    object-fit: cover;
    border-radius: 0.375rem;
  }

  .game-thumbnail.single img {
    max-width: 160px;
  }

  .error-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
  }

  .error-state a {
    color: #3b82f6;
    text-decoration: none;
  }

  .error-state a:hover {
    text-decoration: underline;
  }
</style>
