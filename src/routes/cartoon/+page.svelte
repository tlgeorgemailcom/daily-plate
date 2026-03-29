<script lang="ts">
  import CartoonViewer from '$lib/components/CartoonViewer.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Feather &amp; Spag — Daily Comic Strip</title>
  {#if data.strip}
    <meta property="og:title"       content="Feather &amp; Spag — {data.strip.publish_date}" />
    <meta property="og:image"       content={data.strip.image_url} />
    <meta property="og:description" content={data.strip.alt_text || 'Daily comic strip — Feather & Spag'} />
    <meta property="og:type"        content="website" />
  {/if}
</svelte:head>

<div class="page">
  <CartoonViewer strip={data.strip} prev={data.prev} next={data.next} />

  <div class="cartoon-cta">
    <span>New strip every day</span>
    <a href="/">▶ Play today's food games</a>
  </div>
</div>

<style>
  .page {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 0.75rem 0.5rem 2rem;
    box-sizing: border-box;
  }

  .cartoon-cta {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    padding: 0.85rem 0 0;
    font-family: Arial, sans-serif;
    font-size: 0.85rem;
    color: #666;
    flex-wrap: wrap;
  }

  .cartoon-cta a {
    color: #1b5e20;
    text-decoration: none;
    font-weight: 600;
  }
  .cartoon-cta a:hover { text-decoration: underline; }
</style>
