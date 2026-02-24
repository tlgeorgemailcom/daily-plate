<script lang="ts">
  import { onMount } from 'svelte';
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  
  // Available food types for mapping
  const GAME_FOODS = Object.keys(FOOD_EMOJI) as Array<keyof typeof FOOD_EMOJI>;
  
  // Animal types
  const ANIMAL_TYPES = ['rabbit', 'squirrel', 'raccoon', 'crow', 'mouse'];
  
  interface SubmittedIngredient {
    name: string;
    quantity: string;
  }
  
  interface RecipeSubmission {
    id: string;
    recipeName: string;
    category: string;
    submitterName: string;
    prepTime: string;
    servings: string;
    ingredients: SubmittedIngredient[];
    instructions: string[];
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
  }
  
  // State
  let recipes = $state<RecipeSubmission[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let selectedRecipe = $state<RecipeSubmission | null>(null);
  
  // Moderation form for selected recipe
  let gameFoods = $state<string[]>([]);
  let animalSpawns = $state<{ type: string; delay: number }[]>([]);
  let moderating = $state(false);
  
  onMount(async () => {
    await loadRecipes();
  });
  
  async function loadRecipes() {
    loading = true;
    error = null;
    try {
      const res = await fetch('/api/recipes/list?status=pending');
      const data = await res.json();
      recipes = data.recipes || [];
    } catch (err) {
      error = 'Failed to load recipes';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  function selectRecipe(recipe: RecipeSubmission) {
    selectedRecipe = recipe;
    gameFoods = [];
    animalSpawns = [{ type: 'rabbit', delay: 3 }];
  }
  
  function toggleFood(food: string) {
    if (gameFoods.includes(food)) {
      gameFoods = gameFoods.filter(f => f !== food);
    } else {
      gameFoods = [...gameFoods, food];
    }
  }
  
  function addAnimalSpawn() {
    animalSpawns = [...animalSpawns, { type: 'rabbit', delay: 5 }];
  }
  
  function removeAnimalSpawn(index: number) {
    animalSpawns = animalSpawns.filter((_, i) => i !== index);
  }
  
  async function handleApprove() {
    if (!selectedRecipe || gameFoods.length === 0) {
      alert('Please select at least one game food');
      return;
    }
    
    moderating = true;
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRecipe.id,
          action: 'approve',
          gameFoods,
          animalSpawns
        })
      });
      
      if (!res.ok) throw new Error('Failed to approve');
      
      // Remove from list and clear selection
      recipes = recipes.filter(r => r.id !== selectedRecipe!.id);
      selectedRecipe = null;
      gameFoods = [];
    } catch (err) {
      alert('Failed to approve recipe');
    } finally {
      moderating = false;
    }
  }
  
  async function handleReject() {
    if (!selectedRecipe) return;
    
    if (!confirm(`Reject "${selectedRecipe.recipeName}"?`)) return;
    
    moderating = true;
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRecipe.id,
          action: 'reject'
        })
      });
      
      if (!res.ok) throw new Error('Failed to reject');
      
      recipes = recipes.filter(r => r.id !== selectedRecipe!.id);
      selectedRecipe = null;
    } catch (err) {
      alert('Failed to reject recipe');
    } finally {
      moderating = false;
    }
  }
  
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Recipe Moderation | Farmer's Basket</title>
</svelte:head>

<div class="mod-container">
  <header class="mod-header">
    <h1>🛡️ Recipe Moderation</h1>
    <a href="/farmers-basket" class="back-link">← Back to Game</a>
  </header>
  
  <div class="mod-layout">
    <!-- Recipe List -->
    <aside class="recipe-list">
      <h2>Pending Recipes ({recipes.length})</h2>
      
      {#if loading}
        <p class="status">Loading...</p>
      {:else if error}
        <p class="status error">{error}</p>
      {:else if recipes.length === 0}
        <p class="status">No pending recipes 🎉</p>
      {:else}
        <ul>
          {#each recipes as recipe (recipe.id)}
            <li>
              <button 
                class="recipe-item" 
                class:selected={selectedRecipe?.id === recipe.id}
                onclick={() => selectRecipe(recipe)}
              >
                <span class="recipe-name">{recipe.recipeName}</span>
                <span class="recipe-meta">{recipe.category} • {recipe.submitterName}</span>
                <span class="recipe-date">{formatDate(recipe.submittedAt)}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
      
      <button class="refresh-btn" onclick={loadRecipes}>🔄 Refresh</button>
    </aside>
    
    <!-- Recipe Detail / Moderation Form -->
    <main class="recipe-detail">
      {#if !selectedRecipe}
        <div class="empty-state">
          <p>Select a recipe to review</p>
        </div>
      {:else}
        <div class="detail-content">
          <h2>{selectedRecipe.recipeName}</h2>
          <p class="meta">
            <span class="category">{selectedRecipe.category}</span>
            <span>By {selectedRecipe.submitterName}</span>
            {#if selectedRecipe.prepTime}<span>⏱️ {selectedRecipe.prepTime}</span>{/if}
            {#if selectedRecipe.servings}<span>🍽️ {selectedRecipe.servings}</span>{/if}
          </p>
          
          <section class="section">
            <h3>📝 Submitted Ingredients</h3>
            <ul class="ingredients-list">
              {#each selectedRecipe.ingredients as ing}
                <li><strong>{ing.quantity}</strong> {ing.name}</li>
              {/each}
            </ul>
          </section>
          
          <section class="section">
            <h3>📋 Instructions</h3>
            <ol class="instructions-list">
              {#each selectedRecipe.instructions as step}
                <li>{step}</li>
              {/each}
            </ol>
          </section>
          
          <hr />
          
          <section class="section moderation">
            <h3>🎮 Game Configuration</h3>
            
            <div class="field">
              <label>Select Game Foods (for gameplay)</label>
              <p class="hint">Click the ingredients players will collect in the game</p>
              <div class="food-grid">
                {#each GAME_FOODS as food}
                  <button 
                    class="food-btn" 
                    class:selected={gameFoods.includes(food)}
                    onclick={() => toggleFood(food)}
                    type="button"
                  >
                    <span class="emoji">{FOOD_EMOJI[food]}</span>
                    <span class="name">{food}</span>
                  </button>
                {/each}
              </div>
              <p class="selected-foods">
                Selected: {gameFoods.length === 0 ? 'None' : gameFoods.map(f => FOOD_EMOJI[f as keyof typeof FOOD_EMOJI]).join(' ')}
              </p>
            </div>
            
            <div class="field">
              <label>Animal Spawns</label>
              <div class="spawns-list">
                {#each animalSpawns as spawn, i}
                  <div class="spawn-row">
                    <select bind:value={spawn.type}>
                      {#each ANIMAL_TYPES as type}
                        <option value={type}>{type}</option>
                      {/each}
                    </select>
                    <span>after</span>
                    <input type="number" bind:value={spawn.delay} min="1" max="30" />
                    <span>sec</span>
                    <button type="button" onclick={() => removeAnimalSpawn(i)}>✕</button>
                  </div>
                {/each}
              </div>
              <button type="button" class="add-spawn-btn" onclick={addAnimalSpawn}>+ Add Animal</button>
            </div>
          </section>
          
          <div class="actions">
            <button 
              class="reject-btn" 
              onclick={handleReject}
              disabled={moderating}
            >
              ❌ Reject
            </button>
            <button 
              class="approve-btn" 
              onclick={handleApprove}
              disabled={moderating || gameFoods.length === 0}
            >
              ✅ Approve
            </button>
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
  .mod-container {
    min-height: 100vh;
    background: #F5F5F5;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .mod-header {
    background: linear-gradient(135deg, #5D4037 0%, #8B4513 100%);
    color: white;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .mod-header h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .back-link {
    color: white;
    text-decoration: none;
    opacity: 0.9;
  }
  
  .back-link:hover {
    opacity: 1;
    text-decoration: underline;
  }
  
  .mod-layout {
    display: flex;
    height: calc(100vh - 60px);
  }
  
  .recipe-list {
    width: 300px;
    background: white;
    border-right: 1px solid #DDD;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .recipe-list h2 {
    margin: 0;
    padding: 16px;
    font-size: 1rem;
    border-bottom: 1px solid #EEE;
    background: #FAFAFA;
  }
  
  .recipe-list ul {
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    overflow-y: auto;
  }
  
  .recipe-item {
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    background: none;
    border: none;
    border-bottom: 1px solid #EEE;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .recipe-item:hover {
    background: #F5F5F5;
  }
  
  .recipe-item.selected {
    background: #E3F2FD;
    border-left: 3px solid #2196F3;
  }
  
  .recipe-name {
    font-weight: 600;
    color: #333;
  }
  
  .recipe-meta {
    font-size: 0.8rem;
    color: #666;
  }
  
  .recipe-date {
    font-size: 0.75rem;
    color: #999;
  }
  
  .status {
    padding: 20px;
    text-align: center;
    color: #666;
  }
  
  .status.error {
    color: #C62828;
  }
  
  .refresh-btn {
    margin: 12px;
    padding: 8px;
    background: #EEE;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .recipe-detail {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }
  
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 1.1rem;
  }
  
  .detail-content h2 {
    margin: 0 0 8px;
    color: #333;
  }
  
  .meta {
    display: flex;
    gap: 16px;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
  
  .category {
    background: #E8F5E9;
    color: #2E7D32;
    padding: 2px 10px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section h3 {
    margin: 0 0 10px;
    font-size: 1rem;
    color: #5D4037;
  }
  
  .ingredients-list, .instructions-list {
    margin: 0;
    padding-left: 20px;
  }
  
  .ingredients-list li, .instructions-list li {
    margin-bottom: 6px;
  }
  
  hr {
    border: none;
    border-top: 2px solid #EEE;
    margin: 24px 0;
  }
  
  .moderation h3 {
    color: #1565C0;
  }
  
  .field {
    margin-bottom: 20px;
  }
  
  .field label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .hint {
    font-size: 0.85rem;
    color: #888;
    margin: 0 0 8px;
  }
  
  .food-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .food-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 12px;
    border: 2px solid #DDD;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .food-btn:hover {
    border-color: #888;
  }
  
  .food-btn.selected {
    border-color: #4CAF50;
    background: #E8F5E9;
  }
  
  .food-btn .emoji {
    font-size: 1.5rem;
  }
  
  .food-btn .name {
    font-size: 0.7rem;
    color: #666;
  }
  
  .selected-foods {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .spawns-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .spawn-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .spawn-row select, .spawn-row input {
    padding: 6px 10px;
    border: 1px solid #DDD;
    border-radius: 4px;
  }
  
  .spawn-row input {
    width: 60px;
  }
  
  .spawn-row button {
    background: #FFEBEE;
    border: none;
    color: #C62828;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .add-spawn-btn {
    background: #E3F2FD;
    border: 1px solid #90CAF9;
    color: #1565C0;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #EEE;
  }
  
  .reject-btn, .approve-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .reject-btn {
    background: #FFEBEE;
    color: #C62828;
  }
  
  .reject-btn:hover {
    background: #FFCDD2;
  }
  
  .approve-btn {
    background: #4CAF50;
    color: white;
  }
  
  .approve-btn:hover:not(:disabled) {
    background: #388E3C;
  }
  
  .approve-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
