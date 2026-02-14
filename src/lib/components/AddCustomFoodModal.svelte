<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { GROUP_NAMES, type FoodGroup } from '$lib/data/food-portions';
  import { addCustomFood } from '$lib/stores/customFoodsStore';

  interface Props {
    prefillName?: string;
  }

  let { prefillName = '' }: Props = $props();

  const dispatch = createEventDispatcher<{ close: void; saved: void }>();

  // Form state
  let name = $state(prefillName);
  let calories = $state<number | null>(null);
  let protein = $state<number | null>(null);
  let carbs = $state<number | null>(null);
  let fat = $state<number | null>(null);
  let fiber = $state<number | null>(null);
  let sugar = $state<number | null>(null);
  let foodGroup = $state<FoodGroup>('prepared');
  let portionName = $state('serving');
  let portionGrams = $state<number | null>(100);
  
  let showMacros = $state(false);
  let errorMessage = $state('');

  const foodGroups: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'prepared', 'beverage'];

  // Validation
  const isValid = $derived(
    name.trim().length >= 2 &&
    calories !== null && calories >= 0 && calories <= 1000 &&
    portionName.trim().length > 0 &&
    portionGrams !== null && portionGrams >= 1 && portionGrams <= 2000
  );

  function handleSave() {
    if (!isValid) {
      errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    // Convert portion-based values to per-100g (how the system stores them)
    const grams = portionGrams!;
    const ratio = 100 / grams;
    const caloriesPer100g = Math.round(calories! * ratio);
    const proteinPer100g = Math.round((protein ?? 0) * ratio * 10) / 10;
    const carbsPer100g = Math.round((carbs ?? 0) * ratio * 10) / 10;
    const fatPer100g = Math.round((fat ?? 0) * ratio * 10) / 10;
    const fiberPer100g = Math.round((fiber ?? 0) * ratio * 10) / 10;
    const sugarPer100g = Math.round((sugar ?? 0) * ratio * 10) / 10;

    console.log('Saving custom food:', {
      name: name.trim(),
      portionCalories: calories,
      portionGrams: grams,
      caloriesPer100g
    });

    addCustomFood({
      name: name.trim(),
      calories: caloriesPer100g,
      protein: proteinPer100g,
      carbs: carbsPer100g,
      fat: fatPer100g,
      fiber: fiberPer100g,
      sugar: sugarPer100g,
      water: 0,
      foodGroup,
      portions: [
        { amt: 1, desc: 'custom (g)', gm: 100 },  // Always include 100g base
        { amt: 1, desc: portionName.trim(), gm: grams }
      ]
    });

    dispatch('saved');
    dispatch('close');
  }

  function handleClose() {
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-overlay" onclick={handleClose} role="button" tabindex="-1">
  <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="modal-title">
    <div class="modal-header">
      <h2 id="modal-title">➕ Add Custom Food</h2>
      <button class="close-btn" onclick={handleClose}>✕</button>
    </div>

    <div class="modal-body">
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}

      <div class="form-group">
        <label for="food-name">Food Name *</label>
        <input 
          id="food-name"
          type="text" 
          bind:value={name} 
          placeholder="e.g., Chicken Tikka"
          maxlength="100"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="calories">Portion Calories *</label>
          <div class="input-with-unit">
            <input 
              id="calories"
              type="number" 
              bind:value={calories} 
              placeholder="e.g., 170"
              min="0"
              max="2000"
            />
            <span class="unit">cal</span>
          </div>
        </div>

        <div class="form-group">
          <label for="food-group">Food Group *</label>
          <select id="food-group" bind:value={foodGroup}>
            {#each foodGroups as group}
              <option value={group}>{GROUP_NAMES[group]}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Default Portion *</label>
        <div class="portion-row">
          <span class="portion-prefix">1</span>
          <input 
            type="text" 
            bind:value={portionName} 
            placeholder="serving"
            class="portion-name"
          />
          <span class="equals">=</span>
          <input 
            type="number" 
            bind:value={portionGrams} 
            placeholder="100"
            min="1"
            max="2000"
            class="portion-grams"
          />
          <span class="unit">g</span>
        </div>
      </div>

      <button class="toggle-macros" onclick={() => showMacros = !showMacros}>
        {showMacros ? '▼' : '▶'} Macros (optional)
      </button>

      {#if showMacros}
        <div class="macros-section">
          <div class="macro-row">
            <div class="form-group small">
              <label for="protein">Protein</label>
              <div class="input-with-unit">
                <input id="protein" type="number" bind:value={protein} placeholder="0" min="0" max="100" />
                <span class="unit">g</span>
              </div>
            </div>
            <div class="form-group small">
              <label for="carbs">Carbs</label>
              <div class="input-with-unit">
                <input id="carbs" type="number" bind:value={carbs} placeholder="0" min="0" max="100" />
                <span class="unit">g</span>
              </div>
            </div>
            <div class="form-group small">
              <label for="fat">Fat</label>
              <div class="input-with-unit">
                <input id="fat" type="number" bind:value={fat} placeholder="0" min="0" max="100" />
                <span class="unit">g</span>
              </div>
            </div>
          </div>
          <div class="macro-row">
            <div class="form-group small">
              <label for="fiber">Fiber</label>
              <div class="input-with-unit">
                <input id="fiber" type="number" bind:value={fiber} placeholder="0" min="0" max="100" />
                <span class="unit">g</span>
              </div>
            </div>
            <div class="form-group small">
              <label for="sugar">Sugar</label>
              <div class="input-with-unit">
                <input id="sugar" type="number" bind:value={sugar} placeholder="0" min="0" max="100" />
                <span class="unit">g</span>
              </div>
            </div>
            <div class="form-group small">
              <!-- Empty spacer for alignment -->
            </div>
          </div>
          <p class="macro-hint">Values for the portion above</p>
        </div>
      {/if}
    </div>

    <div class="modal-footer">
      <button class="cancel-btn" onclick={handleClose}>Cancel</button>
      <button class="save-btn" onclick={handleSave} disabled={!isValid}>Save Food</button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 420px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.125rem;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
  }

  .close-btn:hover {
    color: #1f2937;
  }

  .modal-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .error-message {
    background: #fef2f2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .form-group.small {
    flex: 1;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .form-row .form-group {
    flex: 1;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input, select {
    padding: 0.625rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.9rem;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .input-with-unit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .input-with-unit input {
    flex: 1;
    min-width: 0;
  }

  .unit {
    font-size: 0.8rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .portion-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .portion-prefix {
    font-weight: 500;
    color: #374151;
  }

  .portion-name {
    flex: 1;
    min-width: 80px;
  }

  .portion-grams {
    width: 70px;
  }

  .equals {
    color: #9ca3af;
  }

  .toggle-macros {
    background: none;
    border: none;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    text-align: left;
  }

  .toggle-macros:hover {
    color: #374151;
  }

  .macros-section {
    background: #f9fafb;
    padding: 0.75rem;
    border-radius: 0.375rem;
  }

  .macro-row {
    display: flex;
    gap: 0.75rem;
  }

  .macro-hint {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 0 0 0.75rem 0.75rem;
  }

  .cancel-btn {
    padding: 0.625rem 1rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .cancel-btn:hover {
    background: #f3f4f6;
  }

  .save-btn {
    padding: 0.625rem 1.25rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }

  .save-btn:hover:not(:disabled) {
    background: #059669;
  }

  .save-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
</style>
