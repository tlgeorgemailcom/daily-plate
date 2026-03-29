<script lang="ts">
  let { data } = $props();

  function formatDate(d: string) {
    return new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Feather &amp; Spag — Archive</title>
</svelte:head>

<div class="page">
  <div class="header">
    <a href="/cartoon" class="back-link">← Today's strip</a>
    <h1>Feather &amp; Spag — Archive</h1>
    <p class="count">{data.total} strip{data.total !== 1 ? 's' : ''}</p>
  </div>

  {#if data.strips.length === 0}
    <p class="empty">No strips published yet. Check back soon.</p>
  {:else}
    <div class="grid">
      {#each data.strips as strip}
        <a href="/cartoon/{strip.publish_date}" class="thumb">
          <img
            src={strip.image_url}
            alt="Feather &amp; Spag — {strip.publish_date}"
            loading="lazy"
          />
          <span class="thumb-date">{formatDate(strip.publish_date)}</span>
        </a>
      {/each}
    </div>

    {#if data.pages > 1}
      <div class="pagination">
        {#if data.page > 1}
          <a href="?page={data.page - 1}" class="page-btn">← Newer</a>
        {/if}
        <span>Page {data.page} of {data.pages}</span>
        {#if data.page < data.pages}
          <a href="?page={data.page + 1}" class="page-btn">Older →</a>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem 0.75rem 3rem;
    font-family: Arial, sans-serif;
  }

  .header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
    border-bottom: 2px solid #1b5e20;
    padding-bottom: 0.6rem;
  }

  .back-link { font-size: 0.85rem; color: #1b5e20; text-decoration: none; }
  .back-link:hover { text-decoration: underline; }

  h1 {
    font-family: Georgia, serif;
    font-size: 1.3rem;
    color: #1b5e20;
    margin: 0;
    flex: 1;
  }

  .count { font-size: 0.85rem; color: #888; margin: 0; }

  .empty { color: #888; text-align: center; margin-top: 3rem; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .thumb {
    display: block;
    text-decoration: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
    transition: box-shadow 0.15s;
    background: #fafafa;
  }

  .thumb:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.12); }

  .thumb img {
    width: 100%;
    height: auto;
    display: block;
  }

  .thumb-date {
    display: block;
    font-size: 0.78rem;
    color: #666;
    padding: 0.3rem 0.5rem;
    text-align: right;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 2rem;
    font-size: 0.9rem;
    color: #555;
  }

  .page-btn {
    color: #1b5e20;
    text-decoration: none;
    border: 1px solid #1b5e20;
    border-radius: 6px;
    padding: 0.3rem 0.8rem;
  }
  .page-btn:hover { background: #e8f5e9; }
</style>
