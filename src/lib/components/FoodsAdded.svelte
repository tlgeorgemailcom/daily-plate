<script lang="ts">
  import { addedFoods, removeFood, moveFoodToMeal, updateFoodQuantity, totalCalories, targets, meals, type AddedFood } from '$lib/stores/gameStore';
  import { GROUP_COLORS, type FoodGroup } from '$lib/data/food-portions';
  import { dndzone, TRIGGERS, SOURCES, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  let foods = $derived($addedFoods);
  let total = $derived($totalCalories);
  let target = $derived($targets);
  let mealSlots = $derived($meals);
  
  // Track which meals are collapsed
  let collapsedMeals = $state<Set<string>>(new Set());
  
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

  // Group foods by meal, only including meals that have foods
  const foodsByMeal = $derived.by(() => {
    const grouped: { mealId: string; mealName: string; foods: AddedFood[]; totalCal: number }[] = [];
    
    // Get unique meal IDs that have foods, in the order foods were added
    const usedMealIds: string[] = [];
    for (const food of foods) {
      if (!usedMealIds.includes(food.mealId)) {
        usedMealIds.push(food.mealId);
      }
    }
    
    for (const mealId of usedMealIds) {
      const mealFoods = mealFoodsMap[mealId] || [];
      const meal = mealSlots.find(m => m.id === mealId);
      const totalCal = mealFoods.reduce((sum, f) => sum + f.calories, 0);
      
      grouped.push({
        mealId,
        mealName: meal?.name || mealId,
        foods: mealFoods,
        totalCal
      });
    }
    
    return grouped;
  });

  // Handle dnd events for a meal zone
  function handleDndConsider(mealId: string, e: CustomEvent<{ items: AddedFood[] }>) {
    mealFoodsMap[mealId] = e.detail.items;
  }
  
  function handleDndFinalize(mealId: string, e: CustomEvent<{ items: AddedFood[], info: { source: string, trigger: string } }>) {
    const { items, info } = e.detail;
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
  
  function toggleCollapse(mealId: string) {
    const newSet = new Set(collapsedMeals);
    if (newSet.has(mealId)) {
      newSet.delete(mealId);
    } else {
      newSet.add(mealId);
    }
    collapsedMeals = newSet;
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

<div class="foods-added">
  <div class="header">
    <h3>Today's Foods</h3>
    <span class="count">{foods.length} items</span>
  </div>

  {#if foods.length === 0}
    <div class="empty">
      <p>No foods added yet</p>
      <p class="hint">Select a container and meal, then pick foods to add</p>
    </div>
  {:else}
    <div class="foods-list">
      {#each foodsByMeal as mealGroup (mealGroup.mealId)}
        <div class="meal-group">
          <!-- Meal Header -->
          <div class="meal-header">
            <button class="collapse-btn" onclick={() => toggleCollapse(mealGroup.mealId)}>
              {collapsedMeals.has(mealGroup.mealId) ? '▶' : '▼'}
            </button>
            
            {#if editingMealId === mealGroup.mealId}
              <input 
                type="text"
                class="meal-name-input"
                bind:value={editingName}
                onblur={saveEdit}
                onkeydown={handleKeydown}
              />
            {:else}
              <span class="meal-name">{mealGroup.mealName}</span>
              <button class="edit-btn" onclick={() => startEditing(mealGroup.mealId, mealGroup.mealName)}>✏️</button>
            {/if}
            
            <span class="meal-total">{Math.round(mealGroup.totalCal)} cal</span>
          </div>
          
          <!-- Meal Foods (collapsible) with drag-drop -->
          {#if !collapsedMeals.has(mealGroup.mealId)}
            <div 
              class="meal-foods"
              use:dndzone={{ items: mealGroup.foods, flipDurationMs, dropTargetStyle: { outline: '2px solid #f59e0b' } }}
              onconsider={(e) => handleDndConsider(mealGroup.mealId, e)}
              onfinalize={(e) => handleDndFinalize(mealGroup.mealId, e)}
            >
              {#each mealGroup.foods as item (item.id)}
                <div class="food-item" animate:flip={{ duration: flipDurationMs }}>
                  <div class="drag-handle">⋮⋮</div>
                  <div class="food-info">
                    <span class="food-name">{formatName(item.food.word)}</span>
                    <span class="food-portion">
                      {#if editingFoodId === item.id}
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
                      {:else}
                        {getGramsForFood(item)}g
                        <button class="qty-edit-btn" onclick={() => startQuantityEdit(item.id, getGramsForFood(item))}>✏️</button>
                      {/if}
                    </span>
                  </div>
                  <div class="food-meta">
                    <span class="container-icon">
                      {#if item.container === 'plate'}🍽️
                      {:else if item.container === 'bowl'}🥣
                      {:else if item.container === 'cup'}☕
                      {:else if item.container === 'glass'}🥛
                      {:else}🍿
                      {/if}
                    </span>
                    <span class="calories">{Math.round(item.calories)} cal</span>
                    <button class="remove-btn" onclick={() => removeFood(item.id)}>×</button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .foods-added {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.75rem;
    max-height: 400px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .count {
    font-size: 0.75rem;
    color: #6b7280;
    background: #e5e7eb;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
  }

  .empty {
    text-align: center;
    padding: 2rem;
    color: #9ca3af;
  }

  .empty p {
    margin: 0.25rem 0;
  }

  .hint {
    font-size: 0.875rem;
  }

  .foods-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .meal-group {
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .meal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-bottom: 1px solid #fcd34d;
  }

  .collapse-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.625rem;
    color: #92400e;
    padding: 0;
    width: 16px;
  }

  .meal-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: #92400e;
  }

  .meal-name-input {
    font-weight: 600;
    font-size: 0.875rem;
    color: #92400e;
    border: 1px solid #f59e0b;
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    background: white;
    width: 80px;
  }

  .edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0;
    opacity: 0.6;
  }

  .edit-btn:hover {
    opacity: 1;
  }

  .meal-total {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 600;
    color: #92400e;
  }

  .meal-foods {
    display: flex;
    flex-direction: column;
  }

  .meal-foods .food-item {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #f3f4f6;
    padding: 0.375rem 0.75rem 0.375rem 1.5rem;
  }

  .meal-foods .food-item:last-child {
    border-bottom: none;
  }

  .food-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: white;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }

  .food-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    flex: 1;
  }

  .food-name {
    font-weight: 500;
    font-size: 0.875rem;
  }

  .food-portion {
    font-size: 0.75rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .food-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .container-icon {
    font-size: 1rem;
  }

  .calories {
    font-size: 0.75rem;
    font-weight: 600;
    color: #92400e;
    background: #fef3c7;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .remove-btn {
    width: 20px;
    height: 20px;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn:hover {
    background: #fecaca;
  }

  /* Drag & drop styles */
  .meal-group.drop-target {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
  }

  .food-item.dragging {
    opacity: 0.5;
    background: #fef3c7;
  }

  .drag-handle {
    color: #6b7280;
    font-size: 1rem;
    cursor: grab;
    padding: 0.25rem;
    user-select: none;
    background: #f3f4f6;
    border-radius: 0.25rem;
    line-height: 1;
  }

  .drag-handle:active {
    cursor: grabbing;
    background: #e5e7eb;
  }

  /* Quantity editing styles */
  .quantity-input {
    width: 45px;
    padding: 0.125rem 0.25rem;
    border: 1px solid #f59e0b;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    text-align: center;
  }

  .qty-edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.625rem;
    padding: 0;
    margin-left: 0.25rem;
    opacity: 0.4;
  }

  .qty-edit-btn:hover {
    opacity: 1;
  }
</style>
