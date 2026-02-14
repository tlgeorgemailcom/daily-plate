content = '''<script lang="ts">
  import { FOODS, GROUP_COLORS, GROUP_NAMES, type Food, type FoodGroup } from '$lib/data/food-portions';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ select: Food }>();

  let searchQuery = $state('');
  let selectedGroup = $state<FoodGroup | 'all'>('all');
  
  // Long-press tooltip state
  let tooltipFood = $state<Food | null>(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  
  const allGroups: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'spice', 'prepared', 'beverage'];

  const filteredFoods = $derived(() => {
    let foods = FOODS;
    
    // Filter by group
    if (selectedGroup !== 'all') {
      foods = foods.filter(f => f.groups.includes(selectedGroup));
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      foods = foods.filter(f => f.word.toLowerCase().includes(query));
    }
    
    return foods; // Show all matching foods
  });

  function selectFood(food: Food) {
    dispatch('select', food);
  }

  function handlePointerDown(event: PointerEvent, food: Food) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    longPressTimer = setTimeout(() => {
      tooltipFood = food;
      tooltipPosition = { 
        x: rect.left + rect.width / 2, 
        y: rect.top 
      };
    }, 500); // 500ms for long press
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
  </div>

  <!-- Food list -->
  <div class="food-list">
    {#each filteredFoods() as food}
      <button 
        class="food-item" 
        onclick={() => selectFood(food)}
        onpointerdown={(e) => handlePointerDown(e, food)}
        onpointerup={handlePointerUp}
        onpointerleave={handlePointerLeave}
        onpointercancel={handlePointerUp}
      >
        <span class="food-name">{food.display}</span>
        <span class="food-cal">{food.portions[0]?.cal || 0} cal</span>
      </button>
    {/each}
    
    {#if filteredFoods().length === 0}
      <div class="no-results">No foods found</div>
    {/if}
  </div>
</div>

<!-- USDA Description Tooltip -->
{#if tooltipFood}
  <div class="tooltip-overlay" onclick={closeTooltip}>
    <div 
      class="tooltip" 
      style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="tooltip-header">
        <span class="tooltip-title">{tooltipFood.display}</span>
        <button class="tooltip-close" onclick={closeTooltip}>×</button>
      </div>
      <p class="tooltip-desc">{tooltipFood.usda_desc || 'No USDA description available'}</p>
      <p class="tooltip-hint">Tap anywhere to close</p>
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
    touch-action: manipulation;
    user-select: none;
  }

  .food-item:hover {
    background: #f9fafb;
    border-color: #3b82f6;
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

  /* Tooltip overlay */
  .tooltip-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tooltip {
    position: absolute;
    transform: translate(-50%, -100%) translateY(-0.5rem);
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    max-width: 320px;
    width: 90vw;
    z-index: 101;
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .tooltip-title {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1f2937;
  }

  .tooltip-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #9ca3af;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem;
  }

  .tooltip-close:hover {
    color: #374151;
  }

  .tooltip-desc {
    font-size: 0.9rem;
    color: #4b5563;
    line-height: 1.5;
    margin: 0 0 0.75rem;
  }

  .tooltip-hint {
    font-size: 0.75rem;
    color: #9ca3af;
    text-align: center;
    margin: 0;
  }
</style>
'''

with open('src/lib/components/FoodPicker.svelte', 'w') as f:
    f.write(content)
print('FoodPicker.svelte updated with long-press tooltip!')
