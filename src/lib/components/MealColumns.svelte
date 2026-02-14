<script lang="ts">
  import { addedFoods, removeFood, moveFoodToMeal, updateFoodQuantity, meals, type AddedFood } from '$lib/stores/gameStore';
  import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  let foods = $derived($addedFoods);
  let mealSlots = $derived($meals);
  
  // Track which meal name is being edited
  let editingMealId = $state<string | null>(null);
  let editingName = $state('');
  
  // Track which food is being quantity-edited
  let editingFoodId = $state<string | null>(null);
  let editingGrams = $state<number>(100);
  
  // For dnd - we need mutable local copies per meal
  let mealFoodsMap = $state<Record<string, AddedFood[]>>({});
  
  // Sync from store to local state when foods change
  $effect(() => {
    const newMap: Record<string, AddedFood[]> = {};
    for (const mealId of mealSlots.map(m => m.id)) {
      newMap[mealId] = foods.filter(f => f.mealId === mealId);
    }
    mealFoodsMap = newMap;
  });

  // Get foods for a specific meal (now from local state)
  function getFoodsForMeal(mealId: string) {
    return mealFoodsMap[mealId] || [];
  }
  
  // Get total calories for a meal
  function getMealTotal(mealId: string) {
    return getFoodsForMeal(mealId).reduce((sum, f) => sum + f.calories, 0);
  }
  
  // Handle dnd events
  function handleDndConsider(mealId: string, e: CustomEvent<{ items: AddedFood[] }>) {
    mealFoodsMap[mealId] = e.detail.items;
  }
  
  function handleDndFinalize(mealId: string, e: CustomEvent<{ items: AddedFood[] }>) {
    const { items } = e.detail;
    mealFoodsMap[mealId] = items;
    
    // Update the store - move any items that changed meals
    for (const item of items) {
      if (item.id !== SHADOW_PLACEHOLDER_ITEM_ID && item.mealId !== mealId) {
        moveFoodToMeal(item.id, mealId);
      }
    }
  }
  
  const flipDurationMs = 200;

  function formatName(word: string): string {
    return word.charAt(0) + word.slice(1).toLowerCase();
  }
  
  function startEditing(mealId: string, currentName: string) {
    editingMealId = mealId;
    editingName = currentName;
  }
  
  function saveEdit() {
    if (editingMealId && editingName.trim()) {
      meals.update(m => m.map(meal => 
        meal.id === editingMealId ? { ...meal, name: editingName.trim() } : meal
      ));
    }
    editingMealId = null;
    editingName = '';
  }
  
  function cancelEdit() {
    editingMealId = null;
    editingName = '';
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }
  
  // Quantity editing functions
  function startQuantityEdit(foodId: string, currentGrams: number) {
    editingFoodId = foodId;
    editingGrams = currentGrams;
  }
  
  function getGramsForFood(item: typeof foods[0]): number {
    if (item.customGrams) return item.customGrams;
    const mult = item.multiplier || 1;
    return Math.round(item.portion.gm * mult);
  }
  
  function saveQuantityEdit() {
    if (editingFoodId && editingGrams > 0) {
      updateFoodQuantity(editingFoodId, undefined, editingGrams);
    }
    editingFoodId = null;
    editingGrams = 100;
  }
  
  function cancelQuantityEdit() {
    editingFoodId = null;
    editingGrams = 100;
  }
  
  function handleQuantityKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveQuantityEdit();
    if (e.key === 'Escape') cancelQuantityEdit();
  }
</script>

<div class="meal-columns-container">
  <div class="meal-columns-header">
    <h3>Today's Foods</h3>
    <span class="total-count">{foods.length} items</span>
  </div>
  
  <div class="meal-columns">
    {#each mealSlots as meal}
      {@const mealFoods = getFoodsForMeal(meal.id)}
      {@const mealTotal = getMealTotal(meal.id)}
      
      <div class="meal-column">
        <!-- Meal Header -->
        <div class="column-header">
          {#if editingMealId === meal.id}
            <input 
              type="text"
              class="meal-name-input"
              bind:value={editingName}
              onblur={saveEdit}
              onkeydown={handleKeydown}
              autofocus
            />
          {:else}
            <span class="meal-name">{meal.name}</span>
            <button class="edit-btn" onclick={() => startEditing(meal.id, meal.name)}>✏️</button>
          {/if}
        </div>
        
        <!-- Foods List with DnD -->
        <div 
          class="column-foods"
          use:dndzone={{ 
            items: mealFoods, 
            flipDurationMs,
            dropTargetStyle: { outline: '2px dashed #3b82f6', background: '#eff6ff' }
          }}
          onconsider={(e) => handleDndConsider(meal.id, e)}
          onfinalize={(e) => handleDndFinalize(meal.id, e)}
        >
          {#each mealFoods as item (item.id)}
            <div 
              class="food-row"
              animate:flip={{ duration: flipDurationMs }}
            >
              <span class="drag-handle">⋮⋮</span>
              <div class="food-info">
                <span class="food-name" title={item.food.word}>{formatName(item.food.word)}</span>
                {#if editingFoodId === item.id}
                  <span class="food-qty">
                    <input 
                      type="number"
                      class="quantity-input"
                      min="1"
                      max="2000"
                      step="1"
                      bind:value={editingGrams}
                      onblur={saveQuantityEdit}
                      onkeydown={handleQuantityKeydown}
                      onclick={(e) => e.stopPropagation()}
                      autofocus
                    />g
                  </span>
                {:else}
                  <span class="food-qty" onclick={() => startQuantityEdit(item.id, getGramsForFood(item))} title="Click to edit">
                    {getGramsForFood(item)}g
                  </span>
                {/if}
              </div>
              <span class="food-cal">{Math.round(item.calories)}</span>
              <button class="remove-btn" onclick={() => removeFood(item.id)}>×</button>
            </div>
          {/each}
        </div>
        
        <!-- Meal Total -->
        <div class="column-total">
          {Math.round(mealTotal)} cal
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .meal-columns-container {
    background: #f9fafb;
    border-radius: 0.75rem;
    padding: 0.75rem;
  }

  .meal-columns-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0 0.25rem;
  }

  .meal-columns-header h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .total-count {
    font-size: 0.7rem;
    color: #6b7280;
    background: #e5e7eb;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
  }

  .meal-columns {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    min-height: 120px;
  }

  .meal-column {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.375rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-bottom: 1px solid #fcd34d;
    min-height: 28px;
  }

  .meal-name {
    font-weight: 600;
    font-size: 0.75rem;
    color: #92400e;
  }

  .meal-name-input {
    font-weight: 600;
    font-size: 0.75rem;
    color: #92400e;
    border: 1px solid #f59e0b;
    border-radius: 0.25rem;
    padding: 0.125rem;
    background: white;
    width: 50px;
    text-align: center;
  }

  .edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.625rem;
    padding: 0;
    opacity: 0.5;
    line-height: 1;
  }

  .edit-btn:hover {
    opacity: 1;
  }

  .column-foods {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.25rem;
    min-height: 60px;
    overflow-y: auto;
  }

  .empty-meal {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d1d5db;
    font-size: 0.875rem;
  }

  .food-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.25rem;
    background: #f9fafb;
    border-radius: 0.25rem;
    font-size: 0.7rem;
  }

  .food-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .food-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #374151;
    font-weight: 500;
  }

  .food-qty {
    font-size: 0.6rem;
    color: #6b7280;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .food-qty:hover {
    color: #f59e0b;
  }

  .food-cal {
    font-size: 0.625rem;
    color: #92400e;
    font-weight: 500;
    flex-shrink: 0;
  }

  .remove-btn {
    width: 14px;
    height: 14px;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.625rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: #fecaca;
  }

  .column-total {
    padding: 0.25rem;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: #92400e;
    background: #fffbeb;
    border-top: 1px solid #fde68a;
  }

  /* Drag & drop styles */
  .column-foods {
    min-height: 30px;
  }

  .drag-handle {
    color: #6b7280;
    font-size: 0.75rem;
    cursor: grab;
    user-select: none;
    flex-shrink: 0;
    background: #f3f4f6;
    border-radius: 0.125rem;
    padding: 0 0.125rem;
    line-height: 1;
  }

  .drag-handle:active {
    cursor: grabbing;
    background: #e5e7eb;
  }

  /* Quantity editing styles */
  .quantity-input {
    width: 35px;
    padding: 0.125rem;
    border: 1px solid #f59e0b;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    text-align: center;
  }
</style>
