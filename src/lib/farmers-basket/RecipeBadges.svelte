<script lang="ts">
  import { getRecipeLegendItems, type NutritionLegendKey } from '$lib/farmers-basket/nutrition-legend';
  import { openNutritionLegend } from '$lib/stores/nutritionLegendStore';

  interface Props {
    sr28Rule?: string | null;
    isCommunityRecipe?: boolean;
    plausibilityFlags?: string[] | null;
    compact?: boolean;
  }

  let { sr28Rule = null, isCommunityRecipe = false, plausibilityFlags = null, compact = false }: Props = $props();

  const badges = $derived(getRecipeLegendItems({ sr28Rule, isCommunityRecipe, plausibilityFlags }));

  function handleBadgeClick(key: NutritionLegendKey, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    openNutritionLegend(key);
  }
</script>

{#if badges.length > 0}
  <span class="recipe-badges" class:compact>
    {#each badges as badge (badge.key)}
      <a
        href="#recipe-badge-guide"
        class="recipe-badge-link"
        class:compact
        class:shared={badge.key === 'shared'}
        onclick={(event) => handleBadgeClick(badge.key, event)}
        aria-label={badge.title}
        title={badge.title}
      >
        {badge.label}
      </a>
    {/each}
  </span>
{/if}

<style>
  .recipe-badges {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  .recipe-badge-link {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 64px;
    padding: 5px 0;
    border-radius: 999px;
    border: 1px solid #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .recipe-badge-link.compact {
    inline-size: 60px;
    padding: 4px 0;
    font-size: 0.66rem;
  }

  .recipe-badge-link.shared {
    border-color: #c4b5fd;
    color: #6d28d9;
    background: #f5f3ff;
  }

  .recipe-badge-link:hover {
    background: #dbeafe;
    border-color: #3b82f6;
  }

  .recipe-badge-link.shared:hover {
    background: #ede9fe;
    border-color: #8b5cf6;
  }

  .recipe-badge-link:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .recipe-badge-link.shared:focus-visible {
    outline-color: #7c3aed;
  }
</style>