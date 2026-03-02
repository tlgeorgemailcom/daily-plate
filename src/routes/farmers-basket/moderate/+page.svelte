<script lang="ts">
  import { onMount } from 'svelte';
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  import type { FoodType, AnimalType, DietaryCategory } from '$lib/farmers-basket/types';
  import RecipeForm, { type RecipeFormData, type RecipeIngredient } from '$lib/farmers-basket/RecipeForm.svelte';
  
  // Available food types for mapping
  const GAME_FOODS = Object.keys(FOOD_EMOJI) as FoodType[];
  
  // Animal types
  const ANIMAL_TYPES: AnimalType[] = ['rabbit', 'squirrel', 'raccoon', 'bird', 'mouse', 'fox'];
  
  // Meal categories
  const MEAL_CATEGORIES = ['Breakfast', 'Snacks', 'Lunch', 'Dinner', 'Beverages', 'Salads', 'Sides'];
  
  // Dietary categories
  const DIETARY_CATEGORIES = [
    { id: 'all', name: 'All Foods', emoji: '🍽️' },
    { id: 'pollo-pesca', name: 'Pollo-Pesca', emoji: '🍗🐟' },
    { id: 'pollo', name: 'Pollo', emoji: '🍗' },
    { id: 'pesca', name: 'Pesca', emoji: '🐟' },
    { id: 'veggie', name: 'Veggie', emoji: '🥚🧀' },
    { id: 'vegan', name: 'Vegan', emoji: '🌱' }
  ];
  
  // Moderation ingredient with game mapping
  interface ModIngredient {
    id: number;
    name: string;
    quantity: string;
    gameFood: FoodType | '';  // Which game food this maps to
    animal: AnimalType | '';   // Which animal tries to steal it
  }
  
  interface SubmittedIngredient {
    name: string;
    quantity: string;
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
    // Enhanced fields for full recipe data
    modIngredients?: ModIngredient[];
    editedAt?: string;
    editedBy?: string;
  }
  
  // State - view toggle for user submissions
  let activeView = $state<'pending' | 'published'>('pending');
  
  // State - pending recipes
  let recipes = $state<RecipeSubmission[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let selectedRecipe = $state<RecipeSubmission | null>(null);
  
  // State - published recipes
  let publishedRecipes = $state<RecipeSubmission[]>([]);
  let loadingPublished = $state(false);
  let selectedPublished = $state<RecipeSubmission | null>(null);
  
  // State - built-in recipes
  
  // Moderation form for pending recipes (full editing)
  let modForm = $state({
    recipeName: '',
    category: '',
    dietaryCategory: '',
    submitterName: '',
    prepTime: '',
    servings: '',
    ingredients: [] as ModIngredient[],
    instructions: [] as { id: number; text: string }[]
  });
  let nextIngId = $state(1);
  let nextInstId = $state(1);
  let moderating = $state(false);
  
  // Edit form for published recipe AND built-in recipe
  let editForm = $state({
    recipeName: '',
    category: '',
    dietaryCategory: '',
    prepTime: '',
    servings: '',
    gameFoods: [] as string[],
    animalSpawns: [] as { type: string; delay: number }[],
    // Full recipe editing for published
    ingredients: [] as ModIngredient[],
    instructions: [] as { id: number; text: string }[]
  });
  let saving = $state(false);
  let successMsg = $state<string | null>(null);
  
  // Password protection
  let authenticated = $state(false);
  let passwordInput = $state('');
  let passwordError = $state(false);
  const MODERATOR_PASSWORD = '4444';
  
  onMount(async () => {
    // Check if already authenticated this session
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
      console.error(err);
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
    // Initialize modForm with submitted recipe data
    nextIngId = recipe.ingredients.length + 1;
    nextInstId = recipe.instructions.length + 1;
    modForm = {
      recipeName: recipe.recipeName,
      category: recipe.category,
      dietaryCategory: recipe.dietaryCategory || 'all',
      submitterName: recipe.submitterName,
      prepTime: recipe.prepTime || '',
      servings: recipe.servings || '',
      ingredients: recipe.ingredients.map((ing, i) => ({
        id: i + 1,
        name: ing.name,
        quantity: ing.quantity,
        gameFood: '' as FoodType | '',
        animal: '' as AnimalType | ''
      })),
      instructions: recipe.instructions.map((text, i) => ({
        id: i + 1,
        text
      }))
    };
  }
  
  // Moderation form ingredient functions
  function addModIngredient() {
    modForm.ingredients = [...modForm.ingredients, { 
      id: nextIngId++, 
      name: '', 
      quantity: '', 
      gameFood: '', 
      animal: '' 
    }];
  }
  
  function removeModIngredient(id: number) {
    if (modForm.ingredients.length > 1) {
      modForm.ingredients = modForm.ingredients.filter(i => i.id !== id);
    }
  }
  
  function addModInstruction() {
    modForm.instructions = [...modForm.instructions, { id: nextInstId++, text: '' }];
  }
  
  function removeModInstruction(id: number) {
    if (modForm.instructions.length > 1) {
      modForm.instructions = modForm.instructions.filter(i => i.id !== id);
    }
  }

  async function handleApprove() {
    if (!selectedRecipe) return;
    
    // Validate: at least one ingredient has a game food mapping
    const mappedIngredients = modForm.ingredients.filter(i => i.gameFood && i.name.trim());
    if (mappedIngredients.length === 0) {
      alert('Please map at least one ingredient to a game food');
      return;
    }
    
    // Build gameFoods array (unique foods)
    const gameFoods = [...new Set(mappedIngredients.map(i => i.gameFood).filter(Boolean))] as string[];
    
    // Build animalSpawns from ingredients that have animals assigned
    // Each ingredient with an animal creates a spawn with staggered delay
    const animalSpawns: { type: string; delay: number }[] = [];
    let delay = 3;
    for (const ing of mappedIngredients) {
      if (ing.animal) {
        animalSpawns.push({ type: ing.animal, delay });
        delay += 2; // Stagger spawns
      }
    }
    // Default spawn if none assigned
    if (animalSpawns.length === 0) {
      animalSpawns.push({ type: 'rabbit', delay: 3 });
    }
    
    moderating = true;
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRecipe.id,
          action: 'approve',
          // Updated recipe data
          recipeName: modForm.recipeName,
          category: modForm.category,
          dietaryCategory: modForm.dietaryCategory,
          prepTime: modForm.prepTime,
          servings: modForm.servings,
          ingredients: modForm.ingredients.filter(i => i.name.trim()).map(i => ({
            name: i.name,
            quantity: i.quantity,
            gameFood: i.gameFood || null,
            animal: i.animal || null
          })),
          instructions: modForm.instructions.filter(i => i.text.trim()).map(i => i.text),
          gameFoods,
          animalSpawns
        })
      });
      
      if (!res.ok) throw new Error('Failed to approve');
      
      // Remove from list and clear selection
      recipes = recipes.filter(r => r.id !== selectedRecipe!.id);
      selectedRecipe = null;
      successMsg = `Approved: ${modForm.recipeName}`;
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      alert('Failed to approve recipe');
    } finally {
      moderating = false;
    }
  }
  
  async function handleReject() {
    if (!selectedRecipe) return;
    
    if (!confirm(`Reject "${modForm.recipeName}"?`)) return;
    
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
  
  
  // Published recipe functions
  function selectPublished(recipe: RecipeSubmission) {
    selectedPublished = recipe;
    
    // Convert ingredients - if modIngredients exist (enhanced), use those; otherwise use basic
    const ingredients: ModIngredient[] = recipe.modIngredients 
      ? recipe.modIngredients.map((ing, i) => ({
          id: i + 1,
          name: ing.name,
          quantity: ing.quantity,
          gameFood: (ing.gameFood || '') as FoodType | '',
          animal: (ing.animal || '') as AnimalType | ''
        }))
      : recipe.ingredients.map((ing, i) => ({
          id: i + 1,
          name: ing.name,
          quantity: ing.quantity,
          gameFood: '' as FoodType | '',
          animal: '' as AnimalType | ''
        }));
    
    editForm = {
      recipeName: recipe.recipeName,
      category: recipe.category,
      dietaryCategory: recipe.dietaryCategory || 'all',
      prepTime: recipe.prepTime || '',
      servings: recipe.servings || '',
      gameFoods: [...(recipe.gameFoods || [])],
      animalSpawns: [...(recipe.animalSpawns || [{ type: 'rabbit', delay: 3 }])],
      ingredients,
      instructions: recipe.instructions.map((text, i) => ({ id: i + 1, text }))
    };
  }
  
  function toggleEditFood(food: string) {
    if (editForm.gameFoods.includes(food)) {
      editForm.gameFoods = editForm.gameFoods.filter(f => f !== food);
    } else {
      editForm.gameFoods = [...editForm.gameFoods, food];
    }
  }
  
  function addEditSpawn() {
    editForm.animalSpawns = [...editForm.animalSpawns, { type: 'rabbit', delay: 5 }];
  }
  
  function removeEditSpawn(index: number) {
    editForm.animalSpawns = editForm.animalSpawns.filter((_, i) => i !== index);
  }
  
  function addEditIngredient() {
    const newId = Math.max(...editForm.ingredients.map(i => i.id), 0) + 1;
    editForm.ingredients = [...editForm.ingredients, { 
      id: newId, name: '', quantity: '', gameFood: '', animal: '' 
    }];
  }
  
  function removeEditIngredient(id: number) {
    if (editForm.ingredients.length > 1) {
      editForm.ingredients = editForm.ingredients.filter(i => i.id !== id);
    }
  }
  
  function addEditInstruction() {
    const newId = Math.max(...editForm.instructions.map(i => i.id), 0) + 1;
    editForm.instructions = [...editForm.instructions, { id: newId, text: '' }];
  }
  
  function removeEditInstruction(id: number) {
    if (editForm.instructions.length > 1) {
      editForm.instructions = editForm.instructions.filter(i => i.id !== id);
    }
  }
  
  async function saveEdit() {
    if (!selectedPublished) return;
    
    // Build gameFoods from ingredients
    const mappedIngredients = editForm.ingredients.filter(i => i.gameFood && i.name.trim());
    const gameFoods = mappedIngredients.length > 0 
      ? [...new Set(mappedIngredients.map(i => i.gameFood).filter(Boolean))] as string[]
      : editForm.gameFoods;
    
    saving = true;
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPublished.id,
          updates: {
            recipeName: editForm.recipeName,
            category: editForm.category,
            dietaryCategory: editForm.dietaryCategory,
            prepTime: editForm.prepTime,
            servings: editForm.servings,
            gameFoods,
            animalSpawns: editForm.animalSpawns,
            ingredients: editForm.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity
            })),
            modIngredients: editForm.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity,
              gameFood: i.gameFood || null,
              animal: i.animal || null
            })),
            instructions: editForm.instructions.filter(i => i.text.trim()).map(i => i.text)
          },
          editedBy: 'Moderator'
        })
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      successMsg = `Saved: ${editForm.recipeName}`;
      await loadPublishedRecipes();
      // Re-select the updated recipe
      const updated = publishedRecipes.find(r => r.id === selectedPublished?.id);
      if (updated) selectPublished(updated);
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      alert('Failed to save changes');
    } finally {
      saving = false;
    }
  }
  
  async function unpublishRecipe() {
    if (!selectedPublished) return;
    if (!confirm(`Unpublish "${selectedPublished.recipeName}"? This removes it from the game.`)) return;
    
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPublished.id,
          deletedBy: 'Moderator'
        })
      });
      
      if (!res.ok) throw new Error('Failed to unpublish');
      
      successMsg = `Unpublished: ${selectedPublished.recipeName}`;
      selectedPublished = null;
      await loadPublishedRecipes();
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      alert('Failed to unpublish');
    }
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
    <h1>🛡️ Recipe Moderation</h1>
    <a href="/farmers-basket" class="back-link">← Back to Game</a>
  </header>
  
  {#if successMsg}
    <div class="success-banner">{successMsg}</div>
  {/if}
  
  <!-- View Toggle Tabs -->
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
  </div>
  
  <div class="mod-layout">
    <!-- Recipe List -->
    <aside class="recipe-list">
      {#if activeView === 'pending'}
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
      {:else}
        <h2>Published Recipes ({publishedRecipes.length})</h2>
        
        {#if loadingPublished}
          <p class="status">Loading...</p>
        {:else if publishedRecipes.length === 0}
          <p class="status">No published recipes yet</p>
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
    
    <!-- Recipe Detail / Moderation Form -->
    <main class="recipe-detail">
      {#if activeView === 'pending'}
        {#if !selectedRecipe}
          <div class="empty-state">
            <p>Select a recipe to review</p>
          </div>
        {:else}
        <div class="detail-content scrollable">
          <h2>📝 Review & Edit Recipe</h2>
          <p class="submitted-by">Submitted by: {selectedRecipe.submitterName} on {formatDate(selectedRecipe.submittedAt)}</p>
          
          <!-- Basic Info -->
          <div class="mod-form">
            <div class="field">
              <label>Recipe Name</label>
              <input type="text" bind:value={modForm.recipeName} class="text-input" />
            </div>
            
            <div class="field-row">
              <div class="field">
                <label>Category</label>
                <select bind:value={modForm.category}>
                  {#each MEAL_CATEGORIES as cat}
                    <option value={cat}>{cat}</option>
                  {/each}
                </select>
              </div>
              
              <div class="field">
                <label>Dietary Category</label>
                <select bind:value={modForm.dietaryCategory}>
                  {#each DIETARY_CATEGORIES as cat}
                    <option value={cat.id}>{cat.emoji} {cat.name}</option>
                  {/each}
                </select>
              </div>
            </div>
            
            <div class="field-row">
              <div class="field">
                <label>Prep Time</label>
                <input type="text" bind:value={modForm.prepTime} placeholder="15 mins" class="text-input" />
              </div>
              <div class="field">
                <label>Servings</label>
                <input type="text" bind:value={modForm.servings} placeholder="4" class="text-input" />
              </div>
            </div>
            
            <!-- Ingredients with Game Mapping -->
            <div class="field">
              <label>🥗 Ingredients &amp; Game Mapping</label>
              <p class="hint">Edit ingredients and map each to a game food + animal that tries to steal it</p>
              
              <div class="ingredient-mapping-list">
                {#each modForm.ingredients as ing, i (ing.id)}
                  <div class="ingredient-mapping-row">
                    <span class="row-num">{i + 1}.</span>
                    <input 
                      type="text" 
                      bind:value={ing.quantity} 
                      placeholder="Qty" 
                      class="qty-input"
                    />
                    <input 
                      type="text" 
                      bind:value={ing.name} 
                      placeholder="Ingredient name" 
                      class="name-input"
                    />
                    <span class="arrow">→</span>
                    <select bind:value={ing.gameFood} class="game-food-select">
                      <option value="">No game food</option>
                      {#each GAME_FOODS as food}
                        <option value={food}>{FOOD_EMOJI[food]} {food}</option>
                      {/each}
                    </select>
                    <select bind:value={ing.animal} class="animal-select">
                      <option value="">No animal</option>
                      {#each ANIMAL_TYPES as animal}
                        <option value={animal}>🐾 {animal}</option>
                      {/each}
                    </select>
                    <button 
                      type="button" 
                      class="remove-btn"
                      onclick={() => removeModIngredient(ing.id)}
                      disabled={modForm.ingredients.length <= 1}
                    >✕</button>
                  </div>
                {/each}
              </div>
              <button type="button" class="add-btn" onclick={addModIngredient}>+ Add Ingredient</button>
            </div>
            
            <!-- Instructions -->
            <div class="field">
              <label>📋 Instructions</label>
              <div class="instructions-edit-list">
                {#each modForm.instructions as inst, i (inst.id)}
                  <div class="instruction-row">
                    <span class="row-num">{i + 1}.</span>
                    <textarea 
                      bind:value={inst.text}
                      placeholder="Step description..."
                      rows="2"
                    ></textarea>
                    <button 
                      type="button"
                      class="remove-btn"
                      onclick={() => removeModInstruction(inst.id)}
                      disabled={modForm.instructions.length <= 1}
                    >✕</button>
                  </div>
                {/each}
              </div>
              <button type="button" class="add-btn" onclick={addModInstruction}>+ Add Step</button>
            </div>
          </div>
          
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
              disabled={moderating || modForm.ingredients.filter(i => i.gameFood && i.name.trim()).length === 0}
            >
              {moderating ? 'Approving...' : '✅ Approve'}
            </button>
          </div>
        </div>
        {/if}
      {:else}
        <!-- Published Recipes Edit View -->
        {#if !selectedPublished}
          <div class="empty-state">
            <p>Select a published recipe to edit</p>
          </div>
        {:else}
          <div class="detail-content scrollable">
            <h2>✏️ Edit Published Recipe</h2>
            <p class="submitted-by">
              Submitted by: {selectedPublished.submitterName}
              {#if selectedPublished.editedAt}
                • Last edited: {formatDate(selectedPublished.editedAt)} by {selectedPublished.editedBy}
              {/if}
            </p>
            
            <div class="edit-form">
              <div class="field">
                <label>Recipe Name</label>
                <input type="text" bind:value={editForm.recipeName} class="text-input" />
              </div>
              
              <div class="field-row">
                <div class="field">
                  <label>Category</label>
                  <select bind:value={editForm.category}>
                    {#each MEAL_CATEGORIES as cat}
                      <option value={cat}>{cat}</option>
                    {/each}
                  </select>
                </div>
                
                <div class="field">
                  <label>Dietary Category</label>
                  <select bind:value={editForm.dietaryCategory}>
                    {#each DIETARY_CATEGORIES as cat}
                      <option value={cat.id}>{cat.emoji} {cat.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
              
              <div class="field-row">
                <div class="field">
                  <label>Prep Time</label>
                  <input type="text" bind:value={editForm.prepTime} placeholder="15 mins" class="text-input" />
                </div>
                <div class="field">
                  <label>Servings</label>
                  <input type="text" bind:value={editForm.servings} placeholder="4" class="text-input" />
                </div>
              </div>
              
              <!-- Ingredients with Game Mapping -->
              <div class="field">
                <label>🥗 Ingredients &amp; Game Mapping</label>
                <p class="hint">Edit ingredients and map each to a game food + animal</p>
                
                <div class="ingredient-mapping-list">
                  {#each editForm.ingredients as ing, i (ing.id)}
                    <div class="ingredient-mapping-row">
                      <span class="row-num">{i + 1}.</span>
                      <input 
                        type="text" 
                        bind:value={ing.quantity} 
                        placeholder="Qty" 
                        class="qty-input"
                      />
                      <input 
                        type="text" 
                        bind:value={ing.name} 
                        placeholder="Ingredient name" 
                        class="name-input"
                      />
                      <span class="arrow">→</span>
                      <select bind:value={ing.gameFood} class="game-food-select">
                        <option value="">No game food</option>
                        {#each GAME_FOODS as food}
                          <option value={food}>{FOOD_EMOJI[food]} {food}</option>
                        {/each}
                      </select>
                      <select bind:value={ing.animal} class="animal-select">
                        <option value="">No animal</option>
                        {#each ANIMAL_TYPES as animal}
                          <option value={animal}>🐾 {animal}</option>
                        {/each}
                      </select>
                      <button 
                        type="button" 
                        class="remove-btn"
                        onclick={() => removeEditIngredient(ing.id)}
                        disabled={editForm.ingredients.length <= 1}
                      >✕</button>
                    </div>
                  {/each}
                </div>
                <button type="button" class="add-btn" onclick={addEditIngredient}>+ Add Ingredient</button>
              </div>
              
              <!-- Instructions -->
              <div class="field">
                <label>📋 Instructions</label>
                <div class="instructions-edit-list">
                  {#each editForm.instructions as inst, i (inst.id)}
                    <div class="instruction-row">
                      <span class="row-num">{i + 1}.</span>
                      <textarea 
                        bind:value={inst.text}
                        placeholder="Step description..."
                        rows="2"
                      ></textarea>
                      <button 
                        type="button"
                        class="remove-btn"
                        onclick={() => removeEditInstruction(inst.id)}
                        disabled={editForm.instructions.length <= 1}
                      >✕</button>
                    </div>
                  {/each}
                </div>
                <button type="button" class="add-btn" onclick={addEditInstruction}>+ Add Step</button>
              </div>
              
              <!-- Animal Spawns (for fine-tuning timing) -->
              <div class="field">
                <label>🐾 Animal Spawn Timing</label>
                <p class="hint">Fine-tune when animals appear (auto-generated from ingredients above)</p>
                <div class="spawns-list">
                  {#each editForm.animalSpawns as spawn, i}
                    <div class="spawn-row">
                      <select bind:value={spawn.type}>
                        {#each ANIMAL_TYPES as type}
                          <option value={type}>{type}</option>
                        {/each}
                      </select>
                      <span>after</span>
                      <input type="number" bind:value={spawn.delay} min="1" max="30" />
                      <span>sec</span>
                      <button type="button" onclick={() => removeEditSpawn(i)}>✕</button>
                    </div>
                  {/each}
                </div>
                <button type="button" class="add-spawn-btn" onclick={addEditSpawn}>+ Add Animal</button>
              </div>
            </div>
            
            <div class="actions">
              <button 
                class="unpublish-btn" 
                onclick={unpublishRecipe}
              >
                🗑️ Unpublish
              </button>
              <button 
                class="save-btn" 
                onclick={saveEdit}
                disabled={saving || editForm.ingredients.filter(i => i.gameFood && i.name.trim()).length === 0}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>
{/if}

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #5D4037 0%, #8B4513 100%);
    padding: 20px;
  }
  
  .login-box {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 320px;
    width: 100%;
  }
  
  .login-box h1 {
    margin: 0 0 8px 0;
    font-size: 1.5rem;
    color: #5D4037;
  }
  
  .login-box p {
    margin: 0 0 24px 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .login-box form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .password-input {
    padding: 12px 16px;
    border: 2px solid #DDD;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
    letter-spacing: 4px;
  }
  
  .password-input:focus {
    outline: none;
    border-color: #8B4513;
  }
  
  .password-input.error {
    border-color: #E53935;
    animation: shake 0.3s;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .error-text {
    color: #E53935;
    font-size: 0.85rem;
    margin: 0;
  }
  
  .login-btn {
    background: linear-gradient(135deg, #5D4037 0%, #8B4513 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .login-btn:hover {
    opacity: 0.9;
  }
  
  .login-box .back-link {
    display: block;
    margin-top: 20px;
    color: #8B4513;
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  .login-box .back-link:hover {
    text-decoration: underline;
  }
  
  .mod-container {
    min-height: 100vh;
    background: #F5F5F5;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .success-banner {
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    text-align: center;
    font-weight: 500;
  }
  
  .view-tabs {
    display: flex;
    background: white;
    border-bottom: 1px solid #DDD;
    padding: 0 16px;
  }
  
  .view-tab {
    padding: 12px 24px;
    border: none;
    background: transparent;
    font-size: 1rem;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    color: #666;
  }
  
  .view-tab:hover {
    background: #F5F5F5;
  }
  
  .view-tab.active {
    color: #5D4037;
    border-bottom-color: #8B4513;
    font-weight: 600;
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
  
  /* Edit form styles */
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .text-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #DDD;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  .edit-info {
    background: #F5F5F5;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #666;
  }
  
  .edit-info p {
    margin: 4px 0;
  }
  
  .save-btn, .unpublish-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .save-btn {
    background: #4CAF50;
    color: white;
  }
  
  .save-btn:hover:not(:disabled) {
    background: #388E3C;
  }
  
  .save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .unpublish-btn {
    background: #FFEBEE;
    color: #C62828;
  }
  
  .unpublish-btn:hover {
    background: #FFCDD2;
  }
  
  /* Built-in recipe styles */
  
  .instructions-preview {
    margin: 8px 0 0 20px;
    padding: 0;
    font-size: 0.9rem;
    color: #555;
  }
  
  .instructions-preview li {
    margin-bottom: 4px;
  }
  
  /* Ingredient Mapping Styles */
  .scrollable {
    overflow-y: auto;
    max-height: calc(100vh - 200px);
  }
  
  .submitted-by {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 16px 0;
  }
  
  .mod-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .ingredient-mapping-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }
  
  .ingredient-mapping-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: #FAFAFA;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
    flex-wrap: wrap;
  }
  
  .ingredient-mapping-row .row-num {
    font-weight: bold;
    color: #666;
    min-width: 24px;
  }
  
  .ingredient-mapping-row .qty-input {
    width: 80px;
    padding: 8px;
    border: 1px solid #DDD;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .ingredient-mapping-row .name-input {
    flex: 1;
    min-width: 120px;
    padding: 8px;
    border: 1px solid #DDD;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .ingredient-mapping-row .arrow {
    color: #888;
    font-size: 1.2rem;
  }
  
  .ingredient-mapping-row .game-food-select,
  .ingredient-mapping-row .animal-select {
    padding: 8px;
    border: 1px solid #DDD;
    border-radius: 4px;
    font-size: 0.9rem;
    background: white;
    min-width: 100px;
  }
  
  .ingredient-mapping-row .game-food-select {
    border-color: #4CAF50;
    background: #E8F5E9;
  }
  
  .ingredient-mapping-row .animal-select {
    border-color: #FF9800;
    background: #FFF3E0;
  }
  
  .instructions-edit-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }
  
  .instruction-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  
  .instruction-row .row-num {
    font-weight: bold;
    color: #666;
    padding-top: 8px;
    min-width: 24px;
  }
  
  .instruction-row textarea {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #DDD;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: inherit;
    resize: vertical;
  }
  
  .add-btn {
    margin-top: 8px;
    padding: 8px 16px;
    background: #E3F2FD;
    border: 1px dashed #2196F3;
    border-radius: 6px;
    color: #1976D2;
    cursor: pointer;
    font-size: 0.9rem;
    align-self: flex-start;
  }
  
  .add-btn:hover {
    background: #BBDEFB;
  }
  
  .remove-btn {
    background: transparent;
    border: none;
    color: #C62828;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    opacity: 0.6;
  }
  
  .remove-btn:hover:not(:disabled) {
    opacity: 1;
    background: #FFEBEE;
  }
  
  .remove-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  /* Responsive adjustments for ingredient mapping */
  @media (max-width: 768px) {
    .ingredient-mapping-row {
      flex-direction: column;
      align-items: stretch;
    }
    
    .ingredient-mapping-row .row-num {
      display: none;
    }
    
    .ingredient-mapping-row .qty-input,
    .ingredient-mapping-row .name-input {
      width: 100%;
    }
    
    .ingredient-mapping-row .arrow {
      display: none;
    }
    
    .ingredient-mapping-row .game-food-select,
    .ingredient-mapping-row .animal-select {
      width: 100%;
    }
  }
</style>
