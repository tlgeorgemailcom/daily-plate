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
    ingredients: { name: string; quantity: string; foodWord?: string; ndbNo?: string; portionDesc?: string; portionGrams?: number; servingCount?: number; exempt?: boolean; isDish?: boolean }[];
    instructions: string[];
    imageUrl: string | null;
    submitterName: string;
    status: 'pending' | 'approved' | 'rejected' | 'needs_changes';
    moderatorNote?: string | null;
    submittedAt: string;
    linkType?: string | null;
    cookingMethod?: string;
    dishFamily?: string | null;
    nutritionJson?: { perServing: { cal: number; pro: number; fat: number; carb: number; fib: number; sug: number; h2o: number }; gramsPerServing: number; servings: number; sources: { ndb: string; name: string; grams: number }[] } | null;
  }
  
  let recipes = $state<MyRecipe[]>([]);
  let loading = $state(true);
  let error = $state('');
  
  // Editing state
  let editingRecipe = $state<MyRecipe | null>(null);
  let saving = $state(false);
  let saveError = $state('');
  
  // Image upload state for editing
  let selectedImageFile = $state<File | null>(null);
  let imagePreviewUrl = $state<string | null>(null);
  let uploadedImageUrl = $state<string | null>(null);
  let imageUploadError = $state<string | null>(null);
  let isUploadingImage = $state(false);
  
  // Player/subscriber state
  import { canUseStorage } from '$lib/stores/playerStore';
  
  let playerId = $state<string | null>(null);
  let isLoggedIn = $state(false);
  let isSubscriber = $state(false);
  
  // LocalStorage keys
  const STORAGE_KEY = 'my-recipe-submissions';
  const PLAYER_KEY = 'dailyfoodchain_player';  // Must match playerStore.ts
  
  function getPlayerInfo(): { id: string | null; isSubscriber: boolean } {
    if (typeof window === 'undefined') return { id: null, isSubscriber: false };
    try {
      const player = localStorage.getItem(PLAYER_KEY);
      if (player) {
        const parsed = JSON.parse(player);
        const id = parsed.id || null;
        // Check both 'tier' (current) and 'subscription_tier' (legacy)
        const tier = parsed.tier || parsed.subscription_tier || 'free';
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
    if (!['pending', 'needs_changes', 'approved'].includes(recipe.status)) {
      alert('You can only edit your own recipes');
      return;
    }
    editingRecipe = recipe;
    saveError = '';
    
    // Reset image state, show existing image if any
    selectedImageFile = null;
    imageUploadError = null;
    isUploadingImage = false;
    uploadedImageUrl = null;
    
    // If recipe has an image, show it as the preview
    if (recipe.imageUrl) {
      imagePreviewUrl = recipe.imageUrl;
    } else {
      imagePreviewUrl = null;
    }
  }
  
  // Image handling functions
  function handleImageSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      imageUploadError = 'Please select a JPEG, PNG, WebP, or GIF image';
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      imageUploadError = 'Image must be under 5MB';
      return;
    }
    
    imageUploadError = null;
    selectedImageFile = file;
    
    // Create preview URL
    if (imagePreviewUrl && !editingRecipe?.imageUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    imagePreviewUrl = URL.createObjectURL(file);
    uploadedImageUrl = null;
  }
  
  function removeImage() {
    if (imagePreviewUrl && imagePreviewUrl !== editingRecipe?.imageUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    selectedImageFile = null;
    imagePreviewUrl = null;
    uploadedImageUrl = null;
    imageUploadError = null;
  }
  
  async function uploadImage(): Promise<string | null> {
    if (!selectedImageFile) return null;
    
    isUploadingImage = true;
    imageUploadError = null;
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);
      
      const response = await fetch('/api/recipes/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      
      const result = await response.json();
      uploadedImageUrl = result.url;
      return result.url;
    } catch (err) {
      imageUploadError = err instanceof Error ? err.message : 'Image upload failed';
      return null;
    } finally {
      isUploadingImage = false;
    }
  }
  
  async function handleSaveEdit(data: RecipeFormData) {
    if (!editingRecipe) return;
    
    saving = true;
    saveError = '';
    
    try {
      // Upload image if a new one was selected
      let imageUrl: string | null | undefined = undefined; // undefined = don't change
      if (selectedImageFile && !uploadedImageUrl) {
        const url = await uploadImage();
        if (imageUploadError) {
          saveError = imageUploadError;
          saving = false;
          return;
        }
        imageUrl = url;
      } else if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else if (imagePreviewUrl === null && editingRecipe.imageUrl) {
        // Image was removed
        imageUrl = null;
      }
      
      const isLinked = data.nutritionComplete === true;
      const linkMode = data.linkMode ?? 'ingredient';

      let ingredientsPayload: Record<string, unknown>[];
      if (isLinked && (linkMode === 'dish' || linkMode === 'mixed') && data.dishLink) {
        const dishEntry = { isDish: true, ...data.dishLink };
        if (linkMode === 'dish') {
          ingredientsPayload = [
            dishEntry,
            ...data.ingredients.map(i => ({ name: i.name.trim(), quantity: i.quantity.trim() }))
          ];
        } else {
          ingredientsPayload = [
            dishEntry,
            ...data.ingredients.map(i => ({
              name: i.name.trim(),
              quantity: i.quantity.trim(),
              ...(i.foodWord ? { foodWord: i.foodWord, ndbNo: i.ndbNo, portionDesc: i.portionDesc, portionGrams: i.portionGrams, servingCount: i.servingCount } : {}),
              ...(i.exempt ? { exempt: true } : {})
            }))
          ];
        }
      } else {
        ingredientsPayload = data.ingredients.filter(i => i.name.trim()).map(i => ({
          name: i.name.trim(),
          quantity: i.quantity.trim(),
          ...(isLinked ? {
            ...(i.foodWord ? { foodWord: i.foodWord, ndbNo: i.ndbNo, portionDesc: i.portionDesc, portionGrams: i.portionGrams, servingCount: i.servingCount } : {}),
            ...(i.exempt ? { exempt: true } : {})
          } : {})
        }));
      }

      const updates: Record<string, unknown> = {
        recipeName: data.recipeName,
        category: data.category,
        dietaryCategory: data.dietaryCategory,
        prepTime: data.prepTime,
        servings: data.servings,
        cookingMethod: data.cookingMethod,
        dishFamily: data.dishFamily || null,
        ingredients: ingredientsPayload,
        instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text),
        ...(isLinked && data.linkMode ? { linkType: data.linkMode } : {})
      };
      
      // Only include imageUrl if it changed
      if (imageUrl !== undefined) {
        updates.imageUrl = imageUrl;
      }
      
      const res = await fetch('/api/recipes/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRecipe.id,
          updates
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      const result = await res.json().catch(() => ({}));
      // Update the recipe card immediately with the new nutritionJson
      if (result.nutritionJson) {
        recipes = recipes.map(r =>
          r.id === editingRecipe!.id ? { ...r, nutritionJson: result.nutritionJson } : r
        );
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
      case 'needs_changes': return '💬';
      default: return '❓';
    }
  }
  
  function getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Not Approved';
      case 'needs_changes': return 'Changes Requested';
      default: return status;
    }
  }
  
  onMount(() => {
    loadRecipes();
  });
</script>

<svelte:head>
  <title>My Recipes | TodayPage</title>
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
        <h2>{editingRecipe?.status === 'approved' ? 'Edit & Resubmit for Approval' : 'Edit Recipe'}</h2>
        
        <!-- Image Upload Section -->
        <div class="image-upload-section">
          <h3>📸 Recipe Photo</h3>
          
          {#if imagePreviewUrl}
            <div class="image-preview-container">
              <img src={imagePreviewUrl} alt="Recipe preview" class="image-preview" />
              <button 
                type="button" 
                class="remove-image-btn" 
                onclick={removeImage}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          {:else}
            <label class="image-upload-label">
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/gif"
                onchange={handleImageSelect}
                class="image-input"
              />
              <div class="upload-placeholder">
                <span class="upload-icon">📷</span>
                <span class="upload-text">Tap to add photo</span>
                <span class="upload-hint">JPEG, PNG, WebP or GIF (max 5MB)</span>
              </div>
            </label>
          {/if}
          
          {#if imageUploadError}
            <p class="image-error">{imageUploadError}</p>
          {/if}
          
          {#if isUploadingImage}
            <p class="uploading-text">⏳ Uploading image...</p>
          {/if}
        </div>
        
        <RecipeForm
          initialData={{
            recipeName: editingRecipe.recipeName,
            category: editingRecipe.category,
            dietaryCategory: editingRecipe.dietaryCategory as any,
            submitterName: editingRecipe.submitterName,
            prepTime: editingRecipe.prepTime,
            servings: editingRecipe.servings,
            cookingMethod: editingRecipe.cookingMethod || 'Bake',
            dishFamily: editingRecipe.dishFamily || '',
            linkMode: (editingRecipe.linkType as any) ?? 'ingredient',
            ...((() => {
              const dish = editingRecipe.ingredients.find(i => i.isDish);
              return dish ? { dishLink: { foodWord: dish.foodWord!, ndbNo: dish.ndbNo!, portionDesc: dish.portionDesc!, portionGrams: dish.portionGrams!, servingCount: dish.servingCount! } } : {};
            })()),
            ingredients: editingRecipe.ingredients.filter(i => !i.isDish).map((ing, i) => ({
              id: i + 1,
              name: ing.name,
              quantity: ing.quantity,
              gameFood: '',
              animal: '',
              ...(ing.foodWord ? {
                foodWord: ing.foodWord,
                ndbNo: ing.ndbNo,
                portionDesc: ing.portionDesc,
                portionGrams: ing.portionGrams,
                servingCount: ing.servingCount
              } : {}),
              ...(ing.exempt ? { exempt: true } : {})
            })),
            instructions: editingRecipe.instructions.map((text, i) => ({
              id: i + 1,
              text: typeof text === 'string' ? text : (text as any).text || ''
            }))
          }}
          onsubmit={handleSaveEdit}
          oncancel={() => editingRecipe = null}
          submitLabel={isUploadingImage ? '⏳ Uploading...' : editingRecipe?.status === 'approved' ? 'Submit for Re-approval' : 'Save Changes'}
          submitting={saving || isUploadingImage}
          errorMessage={saveError}
          disableSuggestions={true}
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
          <div class="recipe-card" class:pending={recipe.status === 'pending'} class:approved={recipe.status === 'approved'} class:rejected={recipe.status === 'rejected'} class:needs-changes={recipe.status === 'needs_changes'}>
            <div class="recipe-header">
              <h3>{recipe.recipeName}</h3>
              <span class="status-badge" class:pending={recipe.status === 'pending'} class:approved={recipe.status === 'approved'} class:rejected={recipe.status === 'rejected'} class:needs-changes={recipe.status === 'needs_changes'}>
                {getStatusEmoji(recipe.status)} {getStatusLabel(recipe.status)}
              </span>
            </div>
            
            <div class="recipe-meta">
              <span class="category">{recipe.category}</span>
              {#if recipe.dishFamily}
                <span class="dish-family">{recipe.dishFamily}</span>
              {/if}
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

            {#if recipe.nutritionJson}
              <p class="recipe-nutrition">🔬 Per serving: {recipe.nutritionJson.perServing.cal} cal&nbsp;|&nbsp;{recipe.nutritionJson.perServing.pro}g protein&nbsp;|&nbsp;{recipe.nutritionJson.perServing.fat}g fat&nbsp;|&nbsp;{recipe.nutritionJson.perServing.carb}g carbs&nbsp;|&nbsp;{recipe.nutritionJson.perServing.fib}g fiber&nbsp;|&nbsp;{recipe.nutritionJson.perServing.sug}g sugar&nbsp;|&nbsp;{recipe.nutritionJson.perServing.h2o}g water</p>
            {/if}
            
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
              <div class="recipe-actions">
                <button class="edit-btn" onclick={() => handleEdit(recipe)}>
                  ✏️ Edit
                </button>
              </div>
            {:else if recipe.status === 'rejected'}
              <div class="rejected-message">
                This recipe wasn't approved. You can submit a new one!
              </div>
            {:else if recipe.status === 'needs_changes'}
              <div class="needs-changes-message">
                <p class="changes-title">💬 The moderator has some feedback:</p>
                <p class="changes-note">{recipe.moderatorNote}</p>
                <button class="resubmit-btn" onclick={() => handleEdit(recipe)}>
                  ✏️ Edit & Resubmit
                </button>
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

  .recipe-card.needs-changes {
    border-left-color: #f59e0b;
  }

  .recipe-nutrition {
    margin: 0.75rem 0 0;
    font-size: 0.78rem;
    color: #2a7a2a;
    background: #f0faf0;
    border-radius: 6px;
    padding: 5px 10px;
    line-height: 1.5;
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

  .status-badge.needs-changes {
    background: #fef3c7;
    color: #92400e;
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

  .needs-changes-message {
    padding: 0.75rem 1rem;
    background: #FFFDE7;
    border: 1px solid #F9A825;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .changes-title {
    font-weight: 600;
    color: #E65100;
    margin: 0 0 0.4rem 0;
  }

  .changes-note {
    color: #4e4e4e;
    margin: 0 0 0.75rem 0;
    white-space: pre-wrap;
  }

  .resubmit-btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #F9A825;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: bold;
    cursor: pointer;
  }

  .resubmit-btn:hover {
    background: #F57F17;
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
    overflow-x: hidden;
  }
  
  .edit-content h2 {
    margin: 0 0 1rem;
    color: #2d5a3d;
  }
  
  /* Image Upload Styles */
  .image-upload-section {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 12px;
    background: #f9f9f5;
    border: 1px solid #e0d8c8;
  }
  
  .image-upload-section h3 {
    margin: 0 0 12px;
    font-size: 1rem;
    color: #5D4037;
  }
  
  .image-upload-label {
    display: block;
    cursor: pointer;
  }
  
  .image-input {
    display: none;
  }
  
  .upload-placeholder {
    border: 2px dashed #C9B896;
    border-radius: 12px;
    padding: 24px 16px;
    text-align: center;
    background: white;
    transition: border-color 0.2s, background-color 0.2s;
  }
  
  .upload-placeholder:hover {
    border-color: #8B4513;
    background: #FFF9EB;
  }
  
  .upload-icon {
    display: block;
    font-size: 2rem;
    margin-bottom: 8px;
  }
  
  .upload-text {
    display: block;
    font-weight: 600;
    color: #8B4513;
    margin-bottom: 4px;
  }
  
  .upload-hint {
    display: block;
    font-size: 0.75rem;
    color: #999;
  }
  
  .image-preview-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }
  
  .image-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .remove-image-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #E53935;
    color: white;
    border: 2px solid white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .remove-image-btn:hover {
    background: #C62828;
  }
  
  .image-error {
    margin: 8px 0 0;
    color: #C62828;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .uploading-text {
    margin: 8px 0 0;
    color: #8B4513;
    font-size: 0.85rem;
    font-weight: 500;
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
