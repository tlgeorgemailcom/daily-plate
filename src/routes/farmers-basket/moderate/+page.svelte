<script lang="ts">
  import { onMount } from 'svelte';
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  import type { FoodType, AnimalType, DietaryCategory } from '$lib/farmers-basket/types';
  import RecipeForm, { type RecipeFormData } from '$lib/farmers-basket/RecipeForm.svelte';
  
  interface SubmittedIngredient {
    name: string;
    quantity: string;
    gameFood?: string;
    animal?: string;
  }
  
  interface RecipeSubmission {
    id: string;
    recipeName: string;
    category: string;
    dietaryCategory?: string;
    submitterName: string;
    prepTime: string;
    servings: string;
    ingredients: SubmittedIngredient[];
    instructions: string[];
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    gameFoods?: string[];
    animalSpawns?: { type: string; delay: number }[];
    foodSupply?: Record<string, number>;
    modIngredients?: SubmittedIngredient[];
    editedAt?: string;
    editedBy?: string;
  }
  
  // Password protection
  let authenticated = $state(false);
  let passwordInput = $state('');
  let passwordError = $state(false);
  const MODERATOR_PASSWORD = '4444';
  
  // View state
  let activeView = $state<'pending' | 'published' | 'new'>('pending');
  
  // Pending recipes
  let recipes = $state<RecipeSubmission[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let selectedRecipe = $state<RecipeSubmission | null>(null);
  
  // Published recipes  
  let publishedRecipes = $state<RecipeSubmission[]>([]);
  let loadingPublished = $state(false);
  let selectedPublished = $state<RecipeSubmission | null>(null);
  
  // Form state
  let isSaving = $state(false);
  let saveError = $state<string | null>(null);
  let successMsg = $state<string | null>(null);
  
  onMount(async () => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('mod-auth') === 'true') {
      authenticated = true;
      await loadRecipes();
      await loadPublishedRecipes();
    }
  });
  
  async function handleLogin() {
    if (passwordInput === MODERATOR_PASSWORD) {
      authenticated = true;
      passwordError = false;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mod-auth', 'true');
      }
      await loadRecipes();
      await loadPublishedRecipes();
    } else {
      passwordError = true;
      passwordInput = '';
    }
  }
  
  async function loadRecipes() {
    loading = true;
    error = null;
    try {
      const res = await fetch('/api/recipes/list?status=pending');
      const data = await res.json();
      recipes = data.recipes || [];
    } catch (err) {
      error = 'Failed to load recipes';
    } finally {
      loading = false;
    }
  }
  
  async function loadPublishedRecipes() {
    loadingPublished = true;
    try {
      const res = await fetch('/api/recipes/moderate?filter=approved');
      const data = await res.json();
      publishedRecipes = data.recipes || [];
    } catch (err) {
      console.error('Failed to load published recipes', err);
    } finally {
      loadingPublished = false;
    }
  }
  
  function selectRecipe(recipe: RecipeSubmission) {
    selectedRecipe = recipe;
    selectedPublished = null;
    saveError = null;
  }
  
  function selectPublished(recipe: RecipeSubmission) {
    selectedPublished = recipe;
    selectedRecipe = null;
    saveError = null;
  }
  
  function recipeToFormData(recipe: RecipeSubmission): Partial<RecipeFormData> {
    const ingredients = recipe.modIngredients || recipe.ingredients;
    return {
      recipeName: recipe.recipeName,
      category: recipe.category,
      dietaryCategory: (recipe.dietaryCategory || 'all') as DietaryCategory,
      submitterName: recipe.submitterName,
      prepTime: recipe.prepTime || '',
      servings: recipe.servings || '',
      ingredients: ingredients.map((ing, i) => ({
        id: i + 1,
        name: ing.name,
        quantity: ing.quantity,
        gameFood: (ing.gameFood || '') as FoodType | '',
        animal: (ing.animal || '') as AnimalType | ''
      })),
      instructions: recipe.instructions.map((text, i) => ({
        id: i + 1,
        text
      })),
      foodSupply: recipe.foodSupply
    };
  }
  
  async function handleApprove(data: RecipeFormData) {
    if (!selectedRecipe) return;
    
    const mappedIngredients = data.ingredients.filter(i => i.gameFood && i.name.trim());
    if (mappedIngredients.length === 0) {
      saveError = 'Please map at least one ingredient to a game food';
      return;
    }
    
    const gameFoods = [...new Set(mappedIngredients.map(i => i.gameFood).filter(Boolean))] as string[];
    const animalSpawns: { type: string; delay: number }[] = [];
    let delay = 3;
    for (const ing of mappedIngredients) {
      if (ing.animal) {
        animalSpawns.push({ type: ing.animal, delay });
        delay += 2;
      }
    }
    if (animalSpawns.length === 0) {
      animalSpawns.push({ type: 'rabbit', delay: 3 });
    }
    
    // Build foodSupply from form data, defaulting to 3 for any selected food
    const foodSupply: Record<string, number> = {};
    for (const food of gameFoods) {
      foodSupply[food] = data.foodSupply?.[food as keyof typeof data.foodSupply] ?? 3;
    }
    
    isSaving = true;
    saveError = null;
    
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRecipe.id,
          action: 'approve',
          recipeName: data.recipeName,
          category: data.category,
          dietaryCategory: data.dietaryCategory,
          prepTime: data.prepTime,
          servings: data.servings,
          ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
            name: i.name,
            quantity: i.quantity,
            gameFood: i.gameFood || null,
            animal: i.animal || null
          })),
          instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text),
          gameFoods,
          animalSpawns,
          foodSupply
        })
      });
      
      if (!res.ok) throw new Error('Failed to approve');
      
      recipes = recipes.filter(r => r.id !== selectedRecipe!.id);
      selectedRecipe = null;
      successMsg = `Approved: ${data.recipeName}`;
      setTimeout(() => successMsg = null, 3000);
      await loadPublishedRecipes();
    } catch (err) {
      saveError = 'Failed to approve recipe';
    } finally {
      isSaving = false;
    }
  }
  
  async function handleReject() {
    if (!selectedRecipe) return;
    if (!confirm(`Reject "${selectedRecipe.recipeName}"?`)) return;
    
    isSaving = true;
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
      
      const name = selectedRecipe.recipeName;
      recipes = recipes.filter(r => r.id !== selectedRecipe!.id);
      selectedRecipe = null;
      successMsg = `Rejected: ${name}`;
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      saveError = 'Failed to reject recipe';
    } finally {
      isSaving = false;
    }
  }
  
  async function handleSavePublished(data: RecipeFormData) {
    if (!selectedPublished) return;
    
    const mappedIngredients = data.ingredients.filter(i => i.gameFood && i.name.trim());
    const gameFoods = mappedIngredients.length > 0 
      ? [...new Set(mappedIngredients.map(i => i.gameFood).filter(Boolean))] as string[]
      : selectedPublished.gameFoods || [];
    
    isSaving = true;
    saveError = null;
    
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPublished.id,
          updates: {
            recipeName: data.recipeName,
            category: data.category,
            dietaryCategory: data.dietaryCategory,
            prepTime: data.prepTime,
            servings: data.servings,
            gameFoods,
            ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity
            })),
            modIngredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity,
              gameFood: i.gameFood || null,
              animal: i.animal || null
            })),
            instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text)
          },
          editedBy: 'Moderator'
        })
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      successMsg = `Saved: ${data.recipeName}`;
      await loadPublishedRecipes();
      const updated = publishedRecipes.find(r => r.id === selectedPublished?.id);
      if (updated) selectPublished(updated);
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      saveError = 'Failed to save changes';
    } finally {
      isSaving = false;
    }
  }
  
  async function handleUnpublish() {
    if (!selectedPublished) return;
    if (!confirm(`Unpublish "${selectedPublished.recipeName}"?`)) return;
    
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPublished.id, deletedBy: 'Moderator' })
      });
      
      if (!res.ok) throw new Error('Failed to unpublish');
      
      successMsg = `Unpublished: ${selectedPublished.recipeName}`;
      selectedPublished = null;
      await loadPublishedRecipes();
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      saveError = 'Failed to unpublish';
    }
  }
  
  // Create new built-in recipe
  async function handleCreateNew(data: RecipeFormData) {
    const mappedIngredients = data.ingredients.filter(i => i.gameFood && i.name.trim());
    if (mappedIngredients.length === 0) {
      saveError = 'Please map at least one ingredient to a game food';
      return;
    }
    
    const gameFoods = [...new Set(mappedIngredients.map(i => i.gameFood).filter(Boolean))] as string[];
    const animalSpawns: { type: string; delay: number }[] = [];
    let delay = 3;
    for (const ing of mappedIngredients) {
      if (ing.animal) {
        animalSpawns.push({ type: ing.animal, delay });
        delay += 2;
      }
    }
    if (animalSpawns.length === 0) {
      animalSpawns.push({ type: 'rabbit', delay: 3 });
    }
    
    // Build foodSupply from form data, defaulting to 3 for any selected food
    const foodSupply: Record<string, number> = {};
    for (const food of gameFoods) {
      foodSupply[food] = data.foodSupply?.[food as keyof typeof data.foodSupply] ?? 3;
    }
    
    isSaving = true;
    saveError = null;
    
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-builtin',
          recipeName: data.recipeName,
          category: data.category,
          dietaryCategory: data.dietaryCategory,
          prepTime: data.prepTime,
          servings: data.servings,
          ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
            name: i.name,
            quantity: i.quantity,
            gameFood: i.gameFood || null,
            animal: i.animal || null
          })),
          instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text),
          gameFoods,
          animalSpawns,
          foodSupply
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create');
      }
      
      successMsg = `Created: ${data.recipeName}`;
      activeView = 'published';
      await loadPublishedRecipes();
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      saveError = err instanceof Error ? err.message : 'Failed to create recipe';
    } finally {
      isSaving = false;
    }
  }
  
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Recipe Moderation | Farmer's Basket</title>
</svelte:head>

{#if !authenticated}
  <div class="login-container">
    <div class="login-box">
      <h1>🔒 Moderator Access</h1>
      <p>Enter the moderator password to continue</p>
      <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input
          type="password"
          bind:value={passwordInput}
          placeholder="Password"
          class="password-input"
          class:error={passwordError}
        />
        {#if passwordError}
          <p class="error-text">Incorrect password</p>
        {/if}
        <button type="submit" class="login-btn">Enter</button>
      </form>
      <a href="/farmers-basket" class="back-link">← Back to Game</a>
    </div>
  </div>
{:else}
  <div class="mod-container">
    <header class="mod-header">
      <h1>🛡️ Recipe Manager</h1>
      <div class="header-actions">
        <a href="/farmers-basket" class="back-link">← Back to Game</a>
      </div>
    </header>
    
    {#if successMsg}
      <div class="success-banner">{successMsg}</div>
    {/if}
    
    <div class="view-tabs">
      <button 
        class="view-tab" 
        class:active={activeView === 'pending'}
        onclick={() => { activeView = 'pending'; selectedPublished = null; }}
      >
        📋 Pending ({recipes.length})
      </button>
      <button 
        class="view-tab" 
        class:active={activeView === 'published'}
        onclick={() => { activeView = 'published'; selectedRecipe = null; }}
      >
        ✅ Published ({publishedRecipes.length})
      </button>
      <button 
        class="view-tab new-tab" 
        class:active={activeView === 'new'}
        onclick={() => { activeView = 'new'; selectedRecipe = null; selectedPublished = null; }}
      >
        ➕ Add New
      </button>
    </div>
    
    <div class="mod-layout" class:full-width={activeView === 'new'}>
      {#if activeView !== 'new'}
      <aside class="recipe-list">
        {#if activeView === 'pending'}
          <h2>Pending ({recipes.length})</h2>
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
        {:else}
          <h2>Published ({publishedRecipes.length})</h2>
          {#if loadingPublished}
            <p class="status">Loading...</p>
          {:else if publishedRecipes.length === 0}
            <p class="status">No published recipes</p>
          {:else}
            <ul>
              {#each publishedRecipes as recipe (recipe.id)}
                <li>
                  <button 
                    class="recipe-item" 
                    class:selected={selectedPublished?.id === recipe.id}
                    onclick={() => selectPublished(recipe)}
                  >
                    <span class="recipe-name">{recipe.recipeName}</span>
                    <span class="recipe-meta">{recipe.dietaryCategory || 'all'} • {recipe.submitterName}</span>
                    {#if recipe.editedAt}
                      <span class="recipe-date">✏️ {formatDate(recipe.editedAt)}</span>
                    {/if}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
          <button class="refresh-btn" onclick={loadPublishedRecipes}>🔄 Refresh</button>
        {/if}
      </aside>
      {/if}
      
      <main class="recipe-detail">
        {#if activeView === 'pending'}
          {#if !selectedRecipe}
            <div class="empty-state">
              <p>Select a pending recipe to review</p>
            </div>
          {:else}
            <div class="detail-content">
              <div class="detail-header">
                <h2>📝 Review Submission</h2>
                <p class="submitted-info">By {selectedRecipe.submitterName} on {formatDate(selectedRecipe.submittedAt)}</p>
              </div>
              
              <div class="form-container">
                <RecipeForm
                  moderatorMode={true}
                  initialData={recipeToFormData(selectedRecipe)}
                  onsubmit={handleApprove}
                  submitLabel="✅ Approve"
                  submitting={isSaving}
                  errorMessage={saveError || ''}
                >
                  {#snippet customActions({ formData, isValid })}
                    <button 
                      type="button" 
                      class="reject-btn"
                      onclick={handleReject}
                      disabled={isSaving}
                    >
                      ❌ Reject
                    </button>
                    <button 
                      type="submit" 
                      class="approve-btn"
                      disabled={isSaving || !isValid || formData.ingredients.filter(i => i.gameFood && i.name.trim()).length === 0}
                    >
                      {isSaving ? 'Approving...' : '✅ Approve'}
                    </button>
                  {/snippet}
                </RecipeForm>
              </div>
            </div>
          {/if}
        {:else if activeView === 'published'}
          {#if !selectedPublished}
            <div class="empty-state">
              <p>Select a published recipe to edit</p>
            </div>
          {:else}
            <div class="detail-content">
              <div class="detail-header">
                <h2>✏️ Edit Published Recipe</h2>
                <p class="submitted-info">
                  By {selectedPublished.submitterName}
                  {#if selectedPublished.editedAt}
                    • Edited {formatDate(selectedPublished.editedAt)}
                  {/if}
                </p>
              </div>
              
              <div class="form-container">
                <RecipeForm
                  moderatorMode={true}
                  initialData={recipeToFormData(selectedPublished)}
                  onsubmit={handleSavePublished}
                  submitLabel="💾 Save"
                  submitting={isSaving}
                  errorMessage={saveError || ''}
                >
                  {#snippet customActions({ formData, isValid })}
                    <button 
                      type="button" 
                      class="unpublish-btn"
                      onclick={handleUnpublish}
                      disabled={isSaving}
                    >
                      🗑️ Unpublish
                    </button>
                    <button 
                      type="submit" 
                      class="save-btn"
                      disabled={isSaving || !isValid}
                    >
                      {isSaving ? 'Saving...' : '💾 Save'}
                    </button>
                  {/snippet}
                </RecipeForm>
              </div>
            </div>
          {/if}
        {:else}
          <!-- Add New Recipe View -->
          <div class="detail-content new-recipe-view">
            <div class="detail-header">
              <h2>➕ Add New Built-in Recipe</h2>
              <p class="submitted-info">Create a new recipe that will appear in the game</p>
            </div>
            
            <div class="form-container">
              <RecipeForm
                moderatorMode={true}
                initialData={{
                  recipeName: '',
                  category: 'Dinner',
                  dietaryCategory: 'all',
                  submitterName: 'Built-in',
                  prepTime: '',
                  servings: '',
                  ingredients: [{ id: 1, name: '', quantity: '', gameFood: '', animal: '' }],
                  instructions: [{ id: 1, text: '' }]
                }}
                onsubmit={handleCreateNew}
                submitLabel="➕ Create Recipe"
                submitting={isSaving}
                errorMessage={saveError || ''}
              >
                {#snippet customActions({ formData, isValid })}
                  <button 
                    type="submit" 
                    class="create-btn"
                    disabled={isSaving || !isValid || formData.ingredients.filter(i => i.gameFood && i.name.trim()).length === 0}
                  >
                    {isSaving ? 'Creating...' : '➕ Create Recipe'}
                  </button>
                {/snippet}
              </RecipeForm>
            </div>
          </div>
        {/if}
      </main>
    </div>
  </div>
{/if}

<style>
  /* Login */
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    padding: 20px;
  }
  
  .login-box {
    background: white;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    max-width: 360px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  
  .login-box h1 {
    margin: 0 0 8px;
    font-size: 1.5rem;
  }
  
  .login-box p {
    margin: 0 0 20px;
    color: #666;
  }
  
  .password-input {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #DDD;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 12px;
  }
  
  .password-input.error {
    border-color: #E53935;
  }
  
  .error-text {
    color: #E53935;
    font-size: 0.9rem;
    margin: 0 0 12px;
  }
  
  .login-btn {
    width: 100%;
    padding: 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
  
  .login-btn:hover {
    background: #388E3C;
  }
  
  .back-link {
    display: inline-block;
    margin-top: 16px;
    color: #8B4513;
    text-decoration: none;
  }
  
  /* Main Container */
  .mod-container {
    min-height: 100vh;
    background: #F5F5F5;
    display: flex;
    flex-direction: column;
  }
  
  .mod-header {
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: white;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .mod-header h1 {
    margin: 0;
    font-size: 1.4rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .header-actions .back-link {
    color: white;
    margin: 0;
  }
  
  .header-actions .hint {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.9;
  }
  
  .success-banner {
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    text-align: center;
    font-weight: bold;
  }
  
  /* Tabs */
  .view-tabs {
    display: flex;
    background: white;
    border-bottom: 2px solid #E0E0E0;
  }
  
  .view-tab {
    flex: 1;
    padding: 14px;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #666;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
  }
  
  .view-tab:hover {
    background: #F5F5F5;
  }
  
  .view-tab.active {
    color: #8B4513;
    font-weight: bold;
    border-bottom-color: #8B4513;
  }
  
  /* Layout */
  .mod-layout {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  
  .recipe-list {
    width: 280px;
    background: white;
    border-right: 2px solid #E0E0E0;
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
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    overflow-y: auto;
  }
  
  .recipe-item {
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    border-bottom: 1px solid #EEE;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .recipe-item:hover {
    background: #F5F5F5;
  }
  
  .recipe-item.selected {
    background: #FFF3E0;
    border-left: 3px solid #FF9800;
  }
  
  .recipe-name {
    font-weight: bold;
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
    color: #E53935;
  }
  
  .refresh-btn {
    margin: 12px;
    padding: 8px;
    background: #F5F5F5;
    border: 1px solid #DDD;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .refresh-btn:hover {
    background: #EEE;
  }
  
  /* Detail Area */
  .recipe-detail {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }
  
  .detail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .detail-header {
    padding: 16px 20px;
    background: #FAFAFA;
    border-bottom: 1px solid #EEE;
  }
  
  .detail-header h2 {
    margin: 0 0 4px;
    font-size: 1.2rem;
  }
  
  .submitted-info {
    margin: 0;
    font-size: 0.85rem;
    color: #666;
  }
  
  .form-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #FFFEF5;
  }
  
  /* Action Buttons */
  .reject-btn, .unpublish-btn {
    padding: 12px 20px;
    background: #FFEBEE;
    border: 2px solid #E53935;
    border-radius: 8px;
    color: #C62828;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
  
  .reject-btn:hover, .unpublish-btn:hover {
    background: #FFCDD2;
  }
  
  .approve-btn, .save-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
  }
  
  .approve-btn:hover:not(:disabled), .save-btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  
  .approve-btn:disabled, .save-btn:disabled,
  .reject-btn:disabled, .unpublish-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .mod-layout {
      flex-direction: column;
    }
    
    .recipe-list {
      width: 100%;
      max-height: 200px;
      border-right: none;
      border-bottom: 2px solid #E0E0E0;
    }
    
    .header-actions .hint {
      display: none;
    }
  }
  
  /* Add New View */
  .mod-layout.full-width {
    display: block;
  }
  
  .mod-layout.full-width .recipe-detail {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .new-tab {
    background: #4CAF50 !important;
    color: white !important;
  }
  
  .new-tab.active {
    background: #388E3C !important;
  }
  
  .new-recipe-view {
    padding-top: 0;
  }
  
  .create-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    transition: all 0.2s;
  }
  
  .create-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #45a049, #388E3C);
    transform: translateY(-1px);
  }
  
  .create-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
