<script lang="ts">
  import { onMount } from 'svelte';
  import RecipeForm from '$lib/farmers-basket/RecipeForm.svelte';
  import type { RecipeFormData } from '$lib/farmers-basket/RecipeForm.svelte';
  
  interface MyRecipe {
    id: string;
    recipeName: string;
    category: string;
    dietaryCategory: string;
    prepTime: string;
    servings: string;
    ingredients: { name: string; quantity: string }[];
    instructions: string[];
    submitterName: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
  }
  
  let recipes = $state<MyRecipe[]>([]);
  let loading = $state(true);
  let error = $state('');
  
  // Editing state
  let editingRecipe = $state<MyRecipe | null>(null);
  let saving = $state(false);
  let saveError = $state('');
  
  // Player/subscriber state
  import { canUseStorage } from '$lib/stores/playerStore';
  
  let playerId = $state<string | null>(null);
  let isLoggedIn = $state(false);
  let isSubscriber = $state(false);
  
  // LocalStorage keys
  const STORAGE_KEY = 'my-recipe-submissions';
  const PLAYER_KEY = 'daily-food-chain-player';
  
  function getPlayerInfo(): { id: string | null; isSubscriber: boolean } {
    if (typeof window === 'undefined') return { id: null, isSubscriber: false };
    try {
      const player = localStorage.getItem(PLAYER_KEY);
      if (player) {
        const parsed = JSON.parse(player);
        const id = parsed.id || null;
        const tier = parsed.subscription_tier || 'free';
        return { 
          id, 
          isSubscriber: tier !== 'free' 
        };
      }
      return { id: null, isSubscriber: false };
    } catch {
      return { id: null, isSubscriber: false };
    }
  }
  
  function getStoredIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  function storeId(id: string) {
    if (!canUseStorage()) return;  // Guests don't persist
    const ids = getStoredIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  }
  
  function removeStoredId(id: string) {
    if (!canUseStorage()) return;  // Guests don't persist
    const ids = getStoredIds().filter(i => i !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  
  async function loadRecipes() {
    loading = true;
    error = '';
    
    // Check login and subscription state
    const playerInfo = getPlayerInfo();
    playerId = playerInfo.id;
    isLoggedIn = !!playerId;
    isSubscriber = playerInfo.isSubscriber;
    
    if (!isSubscriber) {
      // Not a subscriber: no recipes to show (must subscribe to submit)
      recipes = [];
      loading = false;
      return;
    }
    
    // Subscriber: fetch all recipes linked to their account from Turso
    try {
      const res = await fetch(`/api/recipes/my?player_id=${playerId}`);
      if (!res.ok) throw new Error('Failed to load recipes');
      
      const data = await res.json();
      recipes = data.recipes || [];
    } catch (err) {
      error = 'Failed to load your recipes';
      console.error(err);
    } finally {
      loading = false;
    }
  }
  
  async function handleEdit(recipe: MyRecipe) {
    if (recipe.status !== 'pending') {
      alert('You can only edit pending recipes');
      return;
    }
    editingRecipe = recipe;
    saveError = '';
  }
  
  async function handleSaveEdit(data: RecipeFormData) {
    if (!editingRecipe) return;
    
    saving = true;
    saveError = '';
    
    try {
      const res = await fetch('/api/recipes/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRecipe.id,
          updates: {
            recipeName: data.recipeName,
            category: data.category,
            dietaryCategory: data.dietaryCategory,
            prepTime: data.prepTime,
            servings: data.servings,
            ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity
            })),
            instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text)
          }
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      
      // Reload and close editor
      await loadRecipes();
      editingRecipe = null;
      
    } catch (err) {
      saveError = err instanceof Error ? err.message : 'Failed to save recipe';
    } finally {
      saving = false;
    }
  }
  
  async function handleWithdraw(recipe: MyRecipe) {
    if (recipe.status !== 'pending') {
      alert('You can only withdraw pending recipes');
      return;
    }
    
    if (!confirm(`Withdraw "${recipe.recipeName}"? This cannot be undone.`)) {
      return;
    }
    
    try {
      const res = await fetch('/api/recipes/my', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recipe.id })
      });
      
      if (!res.ok) throw new Error('Failed to withdraw');
      
      removeStoredId(recipe.id);
      await loadRecipes();
      
    } catch (err) {
      alert('Failed to withdraw recipe');
      console.error(err);
    }
  }
  
  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
  
  function getStatusEmoji(status: string): string {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  }
  
  function getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Not Approved';
      default: return status;
    }
  }
  
  onMount(() => {
    loadRecipes();
  });
</script>

<svelte:head>
  <title>My Recipes - Farmer's Basket</title>
</svelte:head>

<div class="my-recipes-page">
  <header>
    <a href="/farmers-basket" class="back-link">← Back to Game</a>
    <h1>📋 My Recipe Submissions</h1>
    <p class="subtitle">Track your submitted recipes and their review status</p>
  </header>
  
  {#if editingRecipe}
    <div class="edit-modal">
      <div class="edit-content">
        <h2>Edit Recipe</h2>
        <RecipeForm
          initialData={{
            recipeName: editingRecipe.recipeName,
            category: editingRecipe.category,
            dietaryCategory: editingRecipe.dietaryCategory as any,
            submitterName: editingRecipe.submitterName,
            prepTime: editingRecipe.prepTime,
            servings: editingRecipe.servings,
            ingredients: editingRecipe.ingredients.map((ing, i) => ({
              id: i + 1,
              name: ing.name,
              quantity: ing.quantity,
              gameFood: '',
              animal: ''
            })),
            instructions: editingRecipe.instructions.map((text, i) => ({
              id: i + 1,
              text: typeof text === 'string' ? text : (text as any).text || ''
            }))
          }}
          onsubmit={handleSaveEdit}
          oncancel={() => editingRecipe = null}
          submitLabel="Save Changes"
          submitting={saving}
          errorMessage={saveError}
        />
      </div>
    </div>
  {/if}
  
  <main>
    {#if loading}
      <div class="status-message">Loading your recipes...</div>
    {:else if !isSubscriber}
      <div class="empty-state login-prompt">
        <span class="empty-icon">⭐</span>
        <h2>Subscription Required</h2>
        <p>Subscribe to submit recipes, save progress to the cloud, and track your submissions across devices.</p>
        <a href="/subscribe" class="primary-btn">Subscribe Now</a>
        <a href="/farmers-basket" class="secondary-link">Back to Game</a>
      </div>
    {:else if error}
      <div class="status-message error">{error}</div>
    {:else if recipes.length === 0}
      <div class="empty-state">
        <span class="empty-icon">📝</span>
        <h2>No submissions yet</h2>
        <p>When you submit a recipe in the game, it will appear here so you can track its status.</p>
        <a href="/farmers-basket" class="primary-btn">Go to Game</a>
      </div>
    {:else}
      <div class="recipes-list">
        {#each recipes as recipe (recipe.id)}
          <div class="recipe-card" class:pending={recipe.status === 'pending'} class:approved={recipe.status === 'approved'} class:rejected={recipe.status === 'rejected'}>
            <div class="recipe-header">
              <h3>{recipe.recipeName}</h3>
              <span class="status-badge" class:pending={recipe.status === 'pending'} class:approved={recipe.status === 'approved'} class:rejected={recipe.status === 'rejected'}>
                {getStatusEmoji(recipe.status)} {getStatusLabel(recipe.status)}
              </span>
            </div>
            
            <div class="recipe-meta">
              <span class="category">{recipe.category}</span>
              <span class="date">Submitted {formatDate(recipe.submittedAt)}</span>
            </div>
            
            <div class="recipe-details">
              <div class="detail-row">
                <strong>Ingredients:</strong>
                <span>{recipe.ingredients.length} items</span>
              </div>
              <div class="detail-row">
                <strong>Steps:</strong>
                <span>{recipe.instructions.length} steps</span>
              </div>
              {#if recipe.prepTime}
                <div class="detail-row">
                  <strong>Prep time:</strong>
                  <span>{recipe.prepTime}</span>
                </div>
              {/if}
            </div>
            
            {#if recipe.status === 'pending'}
              <div class="recipe-actions">
                <button class="edit-btn" onclick={() => handleEdit(recipe)}>
                  ✏️ Edit
                </button>
                <button class="withdraw-btn" onclick={() => handleWithdraw(recipe)}>
                  🗑️ Withdraw
                </button>
              </div>
            {:else if recipe.status === 'approved'}
              <div class="approved-message">
                🎉 Your recipe is now available in the game!
              </div>
            {:else if recipe.status === 'rejected'}
              <div class="rejected-message">
                This recipe wasn't approved. You can submit a new one!
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  .my-recipes-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f9e8 0%, #e8f4e5 100%);
    padding: 1rem;
  }
  
  header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .back-link {
    display: inline-block;
    color: #4a7c59;
    text-decoration: none;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  h1 {
    font-size: 2rem;
    color: #2d5a3d;
    margin: 0 0 0.5rem;
  }
  
  .subtitle {
    color: #5a7a5f;
    margin: 0;
  }
  
  main {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .status-message {
    text-align: center;
    padding: 2rem;
    color: #5a7a5f;
  }
  
  .status-message.error {
    color: #c53030;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .empty-icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
  }
  
  .empty-state h2 {
    color: #2d5a3d;
    margin: 0 0 0.5rem;
  }
  
  .empty-state p {
    color: #5a7a5f;
    margin: 0 0 1.5rem;
  }
  
  .primary-btn {
    display: inline-block;
    background: #4a7c59;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .primary-btn:hover {
    background: #3d6a4a;
  }
  
  .recipes-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .recipe-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-left: 4px solid #ccc;
  }
  
  .recipe-card.pending {
    border-left-color: #eab308;
  }
  
  .recipe-card.approved {
    border-left-color: #22c55e;
  }
  
  .recipe-card.rejected {
    border-left-color: #ef4444;
  }
  
  .recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .recipe-header h3 {
    margin: 0;
    color: #2d5a3d;
    font-size: 1.25rem;
  }
  
  .status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .status-badge.pending {
    background: #fef3c7;
    color: #92400e;
  }
  
  .status-badge.approved {
    background: #dcfce7;
    color: #166534;
  }
  
  .status-badge.rejected {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .recipe-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
  
  .recipe-details {
    display: grid;
    gap: 0.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .detail-row {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  
  .detail-row strong {
    color: #374151;
  }
  
  .detail-row span {
    color: #6b7280;
  }
  
  .recipe-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .edit-btn, .withdraw-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .edit-btn {
    background: #4a7c59;
    color: white;
  }
  
  .edit-btn:hover {
    background: #3d6a4a;
  }
  
  .withdraw-btn {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .withdraw-btn:hover {
    background: #fecaca;
  }
  
  .approved-message {
    padding: 0.75rem;
    background: #dcfce7;
    color: #166534;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    text-align: center;
  }
  
  .rejected-message {
    padding: 0.75rem;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    text-align: center;
  }
  
  /* Edit Modal */
  .edit-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
  }
  
  .edit-content {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .edit-content h2 {
    margin: 0 0 1rem;
    color: #2d5a3d;
  }
  
  .secondary-link {
    color: #5a7a5f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  .secondary-link:hover {
    color: #4a7c59;
  }
  
  .login-prompt h2 {
    color: #8B4513;
  }
  
  @media (max-width: 600px) {
    h1 {
      font-size: 1.5rem;
    }
    
    .recipe-header {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .recipe-actions {
      flex-direction: column;
    }
  }
</style>
