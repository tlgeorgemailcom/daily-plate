<script lang="ts">
  import type { Food, Portion } from '$lib/data/food-portions';
  import { calculateNutrients, calculateNutrientsForGrams } from '$lib/data/food-portions';
  import type { Container } from '$lib/stores/gameStore';
  import { createEventDispatcher } from 'svelte';

  interface Props {
    food: Food;
    container: Container;
  }

  let { food, container }: Props = $props();

  const containerLabels: Record<Container, string> = {
    plate: 'Plate',
    bowl: 'Bowl',
    cup: 'Cup',
    glass: 'Glass',
    saucer: 'Saucer'
  };
  
  const dispatch = createEventDispatcher<{ 
    confirm: { portion: Portion; customGrams?: number; quantity?: number } 
  }>();

  let selectedIndex = $state(1); // Start at first USDA portion (M1), not custom
  let customGrams = $state(100);
  let useCustom = $state(false);
  let quantity = $state(1);

  // Reset selection when food changes
  $effect(() => {
    // Access food.ndb to track when food changes
    const _ = food.ndb;
    // Reset to first real portion (index 1), or 0 if only one portion
    selectedIndex = food.portions.length > 1 ? 1 : 0;
    useCustom = false;
    quantity = 1;
    customGrams = 100;
  });

  const portions = $derived(food.portions);
  
  const currentNutrients = $derived(() => {
    console.log('PortionSelector debug:', {
      foodName: food.word,
      foodCal: food.cal,
      selectedIndex,
      useCustom,
      portions: food.portions,
      selectedPortion: food.portions[selectedIndex]
    });
    if (useCustom) {
      const nutrients = calculateNutrientsForGrams(food, customGrams * quantity);
      return nutrients;
    } else {
      const nutrients = calculateNutrients(food, selectedIndex, quantity);
      return nutrients;
    }
  });

  function confirm() {
    if (useCustom) {
      dispatch('confirm', { 
        portion: food.portions[0], // Use M0 as base
        customGrams: customGrams * quantity
      });
    } else {
      dispatch('confirm', { 
        portion: portions[selectedIndex],
        quantity
      });
    }
  }

  function formatPortion(p: Portion, index: number): string {
    if (p.desc === 'custom (g)') return 'Custom amount...';
    const nutrients = calculateNutrients(food, index);
    // Always show amt (e.g., "1 large", "0.5 cup", "4 oz")
    return `${p.amt} ${p.desc} (${nutrients.calories} cal)`;
  }
</script>

<div class="portion-selector">
  <h3 class="food-title">{food.word}</h3>
  
  <!-- Preset portions -->
  <div class="portions-list">
    {#each portions as portion, i}
      {#if i === 0}
        <!-- Custom option -->
        <button 
          class="portion-option"
          class:selected={useCustom}
          onclick={() => { useCustom = true; }}
        >
          <span class="portion-name">Custom amount</span>
        </button>
      {:else}
        <button 
          class="portion-option"
          class:selected={!useCustom && selectedIndex === i}
          onclick={() => { useCustom = false; selectedIndex = i; }}
        >
          <span class="portion-name">{formatPortion(portion, i)}</span>
          <span class="portion-grams">{Math.round(portion.gm)}g</span>
        </button>
      {/if}
    {/each}
  </div>

  <!-- Custom input -->
  {#if useCustom}
    <div class="custom-input">
      <label>
        <span>Enter grams:</span>
        <input 
          type="number" 
          bind:value={customGrams}
          min="1"
          max="2000"
        />
        <span class="unit">g</span>
      </label>
    </div>
  {/if}

  <!-- Quantity multiplier -->
  <div class="quantity-selector">
    <span class="quantity-label">Quantity:</span>
    <div class="quantity-buttons">
      {#each [0.5, 1, 2, 3, 4] as q}
        <button 
          class="quantity-btn"
          class:selected={quantity === q}
          onclick={() => quantity = q}
        >
          {q === 0.5 ? '½' : `×${q}`}
        </button>
      {/each}
    </div>
  </div>

  <!-- Calorie display -->
  <div class="calorie-display">
    <span class="cal-value">{currentNutrients().calories}</span>
    <span class="cal-label">calories</span>
  </div>

  <!-- Confirm button -->
  <button class="confirm-btn" onclick={confirm}>
    Add to {containerLabels[container]}
  </button>
</div>

<style>
  .portion-selector {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .food-title {
    font-size: 1rem;
    font-weight: 600;
    text-transform: capitalize;
    margin: 0;
    padding: 0.5rem;
    background: #f0fdf4;
    border-radius: 0.375rem;
    color: #166534;
  }

  .portions-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-height: 180px;
    overflow-y: auto;
  }

  .portion-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    background: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    font-size: 0.8rem;
  }

  .portion-option:hover {
    border-color: #3b82f6;
  }

  .portion-option.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .portion-name {
    font-size: 0.8rem;
  }

  .portion-grams {
    font-size: 0.7rem;
    color: #6b7280;
  }

  .custom-input {
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 0.25rem;
  }

  .custom-input label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
  }

  .custom-input input {
    width: 70px;
    padding: 0.375rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    text-align: center;
  }

  .custom-input input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .unit {
    color: #6b7280;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f0f9ff;
    border-radius: 0.375rem;
  }

  .quantity-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .quantity-buttons {
    display: flex;
    gap: 0.25rem;
    flex: 1;
    justify-content: flex-end;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .quantity-btn {
    padding: 0.375rem 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
    min-width: 2.25rem;
  }

  .quantity-btn:hover {
    border-color: #3b82f6;
  }

  .quantity-btn.selected {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
  }

  .calorie-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 0.375rem;
  }

  .cal-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #92400e;
  }

  .cal-label {
    font-size: 0.75rem;
    color: #a16207;
  }

  .confirm-btn {
    padding: 0.625rem 1rem;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .confirm-btn:hover {
    background: #16a34a;
  }
</style>
