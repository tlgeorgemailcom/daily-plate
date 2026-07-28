<script lang="ts">
  /**
   * FoodIcon - Renders food items as either emoji or custom SVG icons
   * 
   * Usage:
   *   <FoodIcon food="chicken" size={32} />
   *   <FoodIcon food="lettuce" size={24} />
   */
  interface Props {
    food: string;
    size?: number;
    class?: string;
  }

  let { food, size = 32, class: className = '' }: Props = $props();

  // Foods that use custom SVG icons (no good emoji exists)
  const SVG_FOODS: Set<string> = new Set(['chicken', 'fish']);

  // Foods that use emoji (good emoji exists)
  const EMOJI_MAP: Record<string, string> = {
    lettuce: '🥬',
    tomato: '🍅',
    carrot: '🥕',
    cheese: '🧀',
    egg: '🥚',
    bread: '🍞',
    apple: '🍎',
    grapes: '🍇',
    bacon: '🥓',
    butter: '🧈',
    sausage: '🌭',
    pork: '🥓'
  };

  // Future expansion - more SVG icons available:
  // beef, pork, lamb, turkey, patty, ground-meat

  let useSvg = $derived(SVG_FOODS.has(food));
  let emoji = $derived(EMOJI_MAP[food] || '🍽️');
  let svgPath = $derived(`/icons/food/${food}.svg`);
</script>

{#if useSvg}
  <img 
    src={svgPath} 
    alt={food} 
    width={size} 
    height={size}
    class="food-icon {className}"
    style="display: inline-block; vertical-align: middle;"
  />
{:else}
  <span 
    class="food-emoji {className}" 
    style="font-size: {size}px; line-height: 1; display: inline-block; vertical-align: middle;"
    role="img" 
    aria-label={food}
  >{emoji}</span>
{/if}

<style>
  .food-icon {
    object-fit: contain;
  }
  .food-emoji {
    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  }
</style>
