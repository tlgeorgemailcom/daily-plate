<script lang="ts">
  import { onMount } from 'svelte';
  import { getArchiveDates, formatDateDisplay, type ComparePuzzle } from '$lib/data/compare-puzzles';

  interface ArchiveEntry {
    date: Date;
    dateString: string;
    puzzle: ComparePuzzle;
  }

  let archiveDates = $state<ArchiveEntry[]>([]);

  onMount(() => {
    archiveDates = getArchiveDates();
  });
</script>

<svelte:head>
  <title>Archive | Daily Food Chain</title>
</svelte:head>

<div class="archive-page">
  <header class="page-header">
    <h1>📅 Puzzle Archive</h1>
    <p class="subtitle">Play past Compare & Slider puzzles</p>
  </header>

  <div class="archive-grid">
    {#each archiveDates as entry}
      <a href="/archive/{entry.dateString}" class="archive-card">
        <div class="thumbnail">
          <img src={entry.puzzle.imageA} alt="Puzzle for {entry.dateString}" />
        </div>
        <div class="card-info">
          <span class="date">{formatDateDisplay(entry.dateString)}</span>
          <span class="puzzle-id">{entry.puzzle.id}</span>
        </div>
      </a>
    {/each}
  </div>

  {#if archiveDates.length === 0}
    <div class="empty-state">
      <p>No archived puzzles yet. Check back tomorrow!</p>
    </div>
  {/if}
</div>

<style>
  .archive-page {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
    margin: 0 0 0.25rem 0;
  }

  .subtitle {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
  }

  .archive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .archive-card {
    display: block;
    text-decoration: none;
    color: inherit;
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .archive-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .thumbnail {
    aspect-ratio: 1;
    overflow: hidden;
    background: #f3f4f6;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-info {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .date {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1f2937;
  }

  .puzzle-id {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
  }

  @media (max-width: 400px) {
    .archive-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }
</style>
