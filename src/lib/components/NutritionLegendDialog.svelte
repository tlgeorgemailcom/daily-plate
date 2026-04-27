<script lang="ts">
  import { NUTRITION_LEGEND_ITEMS } from '$lib/farmers-basket/nutrition-legend';
  import { closeNutritionLegend, nutritionLegendModal } from '$lib/stores/nutritionLegendStore';

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeNutritionLegend();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeNutritionLegend();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if $nutritionLegendModal.open}
  <div
    class="legend-overlay"
    id="recipe-badge-guide"
    role="dialog"
    aria-modal="true"
    aria-labelledby="recipe-badge-guide-title"
    onclick={handleBackdropClick}
  >
    <div class="legend-dialog" onclick={(event) => event.stopPropagation()}>
      <header class="legend-header">
        <div>
          <p class="legend-kicker">Recipe badges</p>
          <h2 id="recipe-badge-guide-title">What the Basket recipe badges mean</h2>
        </div>
        <button type="button" class="legend-close" onclick={closeNutritionLegend} aria-label="Close badge guide">×</button>
      </header>

      <div class="legend-body">
        <p class="legend-intro">Every Basket recipe uses the same badge system so players can see where nutrition came from and whether a recipe was player shared.</p>

        <div class="legend-list">
          {#each NUTRITION_LEGEND_ITEMS as item (item.key)}
            <section class="legend-row" class:is-focused={$nutritionLegendModal.focusKey === item.key}>
              <span class="legend-chip">{item.label}</span>
              <div class="legend-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </section>
          {/each}
        </div>
      </div>

      <footer class="legend-footer">
        <button type="button" class="legend-dismiss" onclick={closeNutritionLegend}>Close</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .legend-overlay {
    position: fixed;
    inset: 0;
    z-index: 12000;
    background: rgba(28, 22, 14, 0.62);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .legend-dialog {
    width: min(680px, 100%);
    max-height: min(80vh, 720px);
    overflow: auto;
    background: #fffaf0;
    border: 3px solid #deb887;
    border-radius: 20px;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  }

  .legend-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 24px 10px;
  }

  .legend-kicker {
    margin: 0 0 6px;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9a5d20;
  }

  .legend-header h2 {
    margin: 0;
    color: #5d4037;
    font-size: 1.35rem;
  }

  .legend-close,
  .legend-dismiss {
    border: 2px solid #c99a62;
    background: white;
    color: #7a4a16;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
  }

  .legend-close {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
    line-height: 1;
  }

  .legend-body {
    padding: 0 24px 16px;
  }

  .legend-intro {
    margin: 0 0 18px;
    color: #6c5447;
    line-height: 1.55;
  }

  .legend-list {
    display: grid;
    gap: 12px;
  }

  .legend-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 14px;
    align-items: start;
    padding: 14px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid #edd6b6;
  }

  .legend-row.is-focused {
    border-color: #c67a2b;
    box-shadow: inset 0 0 0 2px rgba(198, 122, 43, 0.18);
    background: #fff3de;
  }

  .legend-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 74px;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid #c99a62;
    background: #fff;
    color: #7a4a16;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .legend-copy h3 {
    margin: 0 0 4px;
    color: #5d4037;
    font-size: 1rem;
  }

  .legend-copy p {
    margin: 0;
    color: #6b5b52;
    line-height: 1.55;
  }

  .legend-footer {
    padding: 0 24px 22px;
    display: flex;
    justify-content: flex-end;
  }

  .legend-dismiss {
    padding: 10px 16px;
    font-size: 0.95rem;
  }

  .legend-close:hover,
  .legend-dismiss:hover {
    background: #fff4e5;
    border-color: #9a5d20;
  }

  @media (max-width: 640px) {
    .legend-overlay {
      padding: 12px;
    }

    .legend-header,
    .legend-body,
    .legend-footer {
      padding-left: 16px;
      padding-right: 16px;
    }

    .legend-row {
      grid-template-columns: 1fr;
    }
  }
</style>