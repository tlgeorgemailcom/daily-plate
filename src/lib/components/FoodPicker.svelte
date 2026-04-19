<script lang="ts">
  import { FOODS, GROUP_COLORS, GROUP_NAMES, type Food, type FoodGroup } from '$lib/data/food-portions';
  import { createEventDispatcher } from 'svelte';
  import { customFoods, type CustomFood } from '$lib/stores/customFoodsStore';

  export type RecipeFood = Food & { isRecipe: true; gramsPerServing: number };

  const dispatch = createEventDispatcher<{ select: Food; addCustom: string }>();

  let { recipeFoods = [] }: { recipeFoods?: RecipeFood[] } = $props();
  
  function handleAddCustomFood() {
    // Pass current search query to pre-populate the form
    dispatch('addCustom', searchQuery.trim());
  }

  let searchQuery = $state('');
  let selectedGroup = $state<FoodGroup | 'all' | 'recipes'>('all');
  
  // Long-press tooltip state
  let tooltipFood = $state<Food | null>(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let pointerStartPos = { x: 0, y: 0 };
  const SCROLL_THRESHOLD = 10; // pixels of movement to cancel long press
  
  const allGroups: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'spice', 'prepared', 'sweets', 'beverage'];

  // Convert custom foods to Food format
  function customToFood(cf: CustomFood): Food & { isCustom: true } {
    return {
      word: cf.name,
      display: cf.name,
      desc: `Custom food - ${cf.calories} cal/100g`,
      ndb: cf.id,
      cal: cf.calories,
      pro: cf.protein,
      fat: cf.fat,
      carb: cf.carbs,
      fib: cf.fiber,
      sug: cf.sugar,
      h2o: cf.water,
      groups: [cf.foodGroup],
      portions: cf.portions,
      isCustom: true
    };
  }

  function matchesQuery(food: Food, queryWords: string[]): boolean {
    if (queryWords.length === 0) return true;

    const displayLower = food.display.toLowerCase();
    return queryWords.every(word => {
      const variations = [word];
      if (word.endsWith('s') && word.length > 2) {
        variations.push(word.slice(0, -1));
      }

      return variations.some(qw => {
        const regex = new RegExp(`\\b${qw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
        return regex.test(displayLower);
      });
    });
  }

  const filteredFoods = $derived(() => {
    // Combine custom foods with built-in foods and recipe foods
    const customAsFoods = $customFoods.map(customToFood);
    let foods: (Food | (Food & { isCustom: true }) | RecipeFood)[] =
      selectedGroup === 'recipes'
        ? [...recipeFoods]
        : [...customAsFoods, ...FOODS, ...recipeFoods];
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    // Filter by group
    if (selectedGroup !== 'all' && selectedGroup !== 'recipes') {
      const group = selectedGroup as FoodGroup;
      foods = foods.filter(f => f.groups.includes(group));
    }
    
    // Filter by search - split into words and require ALL words to match (AND logic)
    // Also handle basic plurals by stripping trailing 's'
    if (queryWords.length > 0) {
      foods = foods.filter(f => matchesQuery(f, queryWords));
    }
    
    if (queryWords.length === 0) {
      return foods.sort((a, b) => a.display.localeCompare(b.display));
    }
    // Rank: exact word match > prefix match, then by position (earlier = better),
    // then shorter name (more specific), then alphabetical
    const q0 = queryWords[0];
    const matchScore = (s: string) => {
      const ws = s.toLowerCase().split(/\s+/);
      const idx = ws.findIndex(w => w.startsWith(q0));
      if (idx === -1) return { pos: 999, exact: false };
      return { pos: idx, exact: ws[idx] === q0 };
    };
    return foods.sort((a, b) => {
      const sa = matchScore(a.display), sb = matchScore(b.display);
      // Exact word match beats prefix-only match
      if (sa.exact !== sb.exact) return sa.exact ? -1 : 1;
      const posDiff = sa.pos - sb.pos;
      if (posDiff !== 0) return posDiff;
      const lenDiff = a.display.split(/\s+/).length - b.display.split(/\s+/).length;
      if (lenDiff !== 0) return lenDiff;
      return a.display.localeCompare(b.display);
    });
  });

  function selectFood(food: Food) {
    dispatch('select', food);
  }

  function handlePointerDown(event: PointerEvent, food: Food) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Store starting position for scroll detection
    pointerStartPos = { x: event.clientX, y: event.clientY };
    
    longPressTimer = setTimeout(() => {
      tooltipFood = food;
      tooltipPosition = { 
        x: rect.left + rect.width / 2, 
        y: rect.top 
      };
    }, 500); // 500ms for long press
  }

  function handlePointerMove(event: PointerEvent) {
    if (!longPressTimer) return;
    
    // Cancel long press if finger moved too much (scrolling)
    const dx = Math.abs(event.clientX - pointerStartPos.x);
    const dy = Math.abs(event.clientY - pointerStartPos.y);
    
    if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handlePointerUp() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handlePointerLeave() {
    handlePointerUp();
  }

  function closeTooltip() {
    tooltipFood = null;
  }
</script>

<div class="food-picker">
  <!-- Search -->
  <div class="search-bar">
    <input 
      type="text" 
      placeholder="Search foods..." 
      bind:value={searchQuery}
      class="search-input"
    />
    <button class="add-custom-btn" onclick={handleAddCustomFood}>
      ➕ Add Custom Food
    </button>
  </div>

  <!-- Group filter tabs -->
  <div class="group-tabs">
    <button 
      class="tab" 
      class:active={selectedGroup === 'all'}
      onclick={() => selectedGroup = 'all'}
    >
      All
    </button>
    {#each allGroups as group}
      <button 
        class="tab"
        class:active={selectedGroup === group}
        style="--group-color: {GROUP_COLORS[group]}"
        onclick={() => selectedGroup = group}
      >
        {GROUP_NAMES[group]}
      </button>
    {/each}
    {#if recipeFoods.length > 0}
      <button
        class="tab tab-recipes"
        class:active={selectedGroup === 'recipes'}
        onclick={() => selectedGroup = 'recipes'}
      >
        🍽️ Recipes
      </button>
    {/if}
  </div>

  <!-- Food list -->
  <div class="food-list">
    {#each filteredFoods() as food}
      <button 
        class="food-item" 
        class:custom-food={'isCustom' in food && food.isCustom}
        class:recipe-food={'isRecipe' in food && food.isRecipe}
        onclick={() => selectFood(food)}
        onpointerdown={(e) => handlePointerDown(e, food)}
        onpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointerleave={handlePointerLeave}
        onpointercancel={handlePointerUp}
        oncontextmenu={(e) => e.preventDefault()}
      >
        <span class="food-name">
          {'isCustom' in food && food.isCustom ? '🏠 ' : ''}{'isRecipe' in food && food.isRecipe ? '🍽️ ' : ''}{food.display}
        </span>
        <span class="food-cal">
          {'isRecipe' in food && food.isRecipe
            ? `${Math.round(food.cal * (food as RecipeFood).gramsPerServing / 100)} cal/serving`
            : `${Math.round(food.cal)} cal/100g`}
        </span>
      </button>
    {/each}
    
    {#if filteredFoods().length === 0}
      <div class="no-results">No foods found</div>
    {/if}
  </div>
</div>

<!-- USDA Description Tooltip -->
{#if tooltipFood}
  <div class="tooltip-overlay" onclick={closeTooltip} onkeydown={(e) => e.key === 'Escape' && closeTooltip()} role="button" tabindex="0">
    <div 
      class="tooltip"
      style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
    >
      <div class="tooltip-header">
        <strong>{tooltipFood.display}</strong>
        <button class="tooltip-close" onclick={closeTooltip}>✕</button>
      </div>
      <p class="tooltip-description">
        <span class="usda-desc">{tooltipFood.desc}</span>
        <span class="nutrient-info">{Math.round(tooltipFood.cal)} cal · {tooltipFood.pro}g protein · {tooltipFood.fat}g fat · {tooltipFood.carb}g carbs per 100g</span>
        <span class="group-info">Groups: {tooltipFood.groups.join(', ')}</span>
        <span class="ndb-info">{'isRecipe' in tooltipFood ? '🍽️ Community recipe' : `USDA NDB#${tooltipFood.ndb}`}</span>
      </p>
    </div>
  </div>
{/if}

<style>
  .food-picker {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    max-height: 500px;
  }

  .search-bar {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .add-custom-btn {
    align-self: flex-start;
    padding: 0.375rem 0.75rem;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 0.375rem;
    color: #166534;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .add-custom-btn:hover {
    background: #dcfce7;
    border-color: #4ade80;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .group-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tab {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    background: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tab:hover {
    background: #f3f4f6;
  }

  .tab.active {
    background: var(--group-color, #3b82f6);
    color: white;
    border-color: transparent;
  }

  .tab-recipes {
    border-color: #fbbf24;
  }

  .tab-recipes:hover {
    background: #fef9c3;
  }

  .tab-recipes.active {
    background: #f59e0b;
    color: white;
    border-color: transparent;
  }

  .food-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .food-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    -webkit-user-select: none;
    user-select: none;
  }

  .food-item:hover {
    background: #f9fafb;
    border-color: #3b82f6;
  }

  .food-item.custom-food {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .food-item.custom-food:hover {
    background: #dcfce7;
    border-color: #4ade80;
  }

  .food-item.recipe-food {
    background: #fffbeb;
    border-color: #fde68a;
  }

  .food-item.recipe-food:hover {
    background: #fef3c7;
    border-color: #f59e0b;
  }

  .food-name {
    font-weight: 500;
    flex: 1;
  }

  .food-cal {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .no-results {
    padding: 2rem;
    text-align: center;
    color: #9ca3af;
  }

  /* Tooltip styles */
  .tooltip-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tooltip {
    position: fixed;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    max-width: 300px;
    width: 90%;
    transform: translate(-50%, -100%);
    margin-top: -1rem;
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .tooltip-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    color: #6b7280;
  }

  .tooltip-description {
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.5;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tooltip-description .usda-desc {
    font-style: italic;
    color: #1f2937;
    font-size: 0.95rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .tooltip-description .nutrient-info {
    font-weight: 500;
    color: #166534;
  }

  .tooltip-description .group-info {
    text-transform: capitalize;
    color: #4b5563;
  }

  .tooltip-description .ndb-info {
    font-size: 0.8rem;
    color: #9ca3af;
  }
</style>
