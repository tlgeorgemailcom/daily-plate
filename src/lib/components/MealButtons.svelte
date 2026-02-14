<script lang="ts">
  import { meals, selectedMeal } from '$lib/stores/gameStore';

  let mealList = $derived($meals);
  let current = $derived($selectedMeal);

  function select(mealId: string) {
    selectedMeal.set(mealId);
  }
</script>

<div class="meal-buttons">
  {#each mealList as meal}
    <button 
      class="meal-btn"
      class:selected={current === meal.id}
      onclick={() => select(meal.id)}
      title={meal.name}
    >
      {meal.name}
    </button>
  {/each}
</div>

<style>
  .meal-buttons {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .meal-btn {
    flex: 1;
    min-width: 0;
    padding: 0.375rem 0.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.7rem;
    font-weight: 500;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meal-btn:hover {
    border-color: #f59e0b;
    background: #fffbeb;
  }

  .meal-btn.selected {
    border-color: #f59e0b;
    background: #fef3c7;
    color: #92400e;
    box-shadow: 0 2px 4px rgb(245 158 11 / 0.2);
  }
</style>
