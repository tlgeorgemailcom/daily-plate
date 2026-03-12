<script lang="ts">
  import { onMount } from 'svelte';
  import { canUseStorage } from '$lib/stores/playerStore';
  import { saveGameScore } from '$lib/stores/scoreHistory';
  import RecipeForm, { type RecipeFormData } from './RecipeForm.svelte';
  
  interface Props {
    onclose: () => void;
    onsubmit?: () => void;
  }
  
  let { onclose, onsubmit }: Props = $props();
  
  // Submission state
  let isSubmitting = $state(false);
  let submitError = $state<string | null>(null);
  let submitSuccess = $state(false);
  
  // Image upload state
  let selectedImageFile = $state<File | null>(null);
  let imagePreviewUrl = $state<string | null>(null);
  let uploadedImageUrl = $state<string | null>(null);
  let imageUploadError = $state<string | null>(null);
  let isUploadingImage = $state(false);
  
  // Player authentication state
  let playerId = $state<string | null>(null);
  let isLoggedIn = $state(false);
  let isSubscriber = $state(false);
  
  // Player/subscriber detection - must match playerStore.ts
  const PLAYER_KEY = 'dailyfoodchain_player';
  
  function getPlayerId(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const player = localStorage.getItem(PLAYER_KEY);
      if (player) {
        const parsed = JSON.parse(player);
        return parsed.id || null;
      }
      return null;
    } catch {
      return null;
    }
  }
  
  function checkSubscriber(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const player = localStorage.getItem(PLAYER_KEY);
      if (player) {
        const parsed = JSON.parse(player);
        // Check both 'tier' (current) and 'subscription_tier' (legacy)
        const tier = parsed.tier || parsed.subscription_tier || 'free';
        return tier !== 'free';
      }
      return false;
    } catch {
      return false;
    }
  }
  
  // Image handling
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
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    imagePreviewUrl = URL.createObjectURL(file);
    uploadedImageUrl = null; // Reset any previous upload
  }
  
  function removeImage() {
    if (imagePreviewUrl) {
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
  
  onMount(() => {
    playerId = getPlayerId();
    isLoggedIn = !!playerId;
    isSubscriber = checkSubscriber();
  });
  
  async function handleFormSubmit(data: RecipeFormData) {
    isSubmitting = true;
    submitError = null;
    
    try {
      // Subscription required (checked at mount, but verify again)
      if (!isSubscriber || !playerId) {
        submitError = 'Subscription required to submit recipes';
        isSubmitting = false;
        return;
      }
      
      // Upload image if selected
      let imageUrl: string | null = uploadedImageUrl;
      if (selectedImageFile && !uploadedImageUrl) {
        imageUrl = await uploadImage();
        if (imageUploadError) {
          submitError = imageUploadError;
          isSubmitting = false;
          return;
        }
      }
      
      const submission: Record<string, unknown> = {
        recipeName: data.recipeName.trim(),
        category: data.category,
        dietaryCategory: data.dietaryCategory,
        submitterName: data.submitterName.trim() || 'Anonymous',
        prepTime: data.prepTime.trim(),
        servings: data.servings.trim(),
        ingredients: data.ingredients.map(i => ({
          name: i.name.trim(),
          quantity: i.quantity.trim(),
          ...(data.nutritionComplete ? {
            foodWord: i.foodWord,
            ndbNo: i.ndbNo,
            portionDesc: i.portionDesc,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount
          } : {})
        })),
        ...(data.nutritionComplete ? { nutritionComplete: true } : {}),
        instructions: data.instructions.map(i => i.text.trim()),
        submittedAt: new Date().toISOString()
      };
      
      // Include playerId (required)
      submission.playerId = playerId;
      
      // Include image URL if uploaded
      if (imageUrl) {
        submission.imageUrl = imageUrl;
      }
      
      const response = await fetch('/api/recipes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit recipe');
      }
      
      // Get the recipe ID and store it in localStorage for "My Recipes" tracking
      // (Only for logged-in users - guests don't persist)
      const result = await response.json();
      if (result.id && canUseStorage()) {
        try {
          const STORAGE_KEY = 'my-recipe-submissions';
          const stored = localStorage.getItem(STORAGE_KEY);
          const ids: string[] = stored ? JSON.parse(stored) : [];
          if (!ids.includes(result.id)) {
            ids.push(result.id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
          }
        } catch (e) {
          console.warn('Could not save recipe ID to localStorage:', e);
        }
        
        // Track recipe submission for premium users
        saveGameScore('farmers-basket', 1, {
          recipeSubmitted: true,
          recipeId: result.id,
          recipeName: data.name,
          ingredientCount: data.ingredients.length
        });
      }
      
      submitSuccess = true;
      onsubmit?.();
    } catch (err) {
      submitError = err instanceof Error ? err.message : 'Failed to submit';
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onclose();
    }
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Share Recipe">
  <div class="share-modal">
    <header class="modal-header">
      <h2>📝 Share Your Recipe</h2>
      <button class="close-btn" onclick={onclose} aria-label="Close">×</button>
    </header>
    
    {#if !isSubscriber}
      <div class="login-required">
        <div class="login-icon">⭐</div>
        <h3>Subscription Required</h3>
        <p>Subscribe to submit recipes, save progress to the cloud, and appear on leaderboards.</p>
        <div class="login-actions">
          <a href="/subscribe" class="login-btn">Subscribe Now</a>
          <button class="cancel-btn" onclick={onclose}>Maybe Later</button>
        </div>
      </div>
    {:else if submitSuccess}}
      <div class="success-view">
        <div class="success-icon">✅</div>
        <h3>Recipe Submitted!</h3>
        <p>Thank you for sharing your recipe. It will be reviewed by a moderator and added to the game soon!</p>
        <div class="success-actions">
          <button class="done-btn" onclick={onclose}>Done</button>
          <a href="/farmers-basket/my-recipes" class="my-recipes-link">View My Submissions</a>
        </div>
      </div>
    {:else}
      <div class="form-container">
        <!-- Image Upload Section -->
        <div class="image-upload-section">
          <h3>📸 Recipe Photo (Optional)</h3>
          <p class="image-tip">Adding a photo helps your recipe stand out!</p>
          
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
          moderatorMode={false}
          onsubmit={handleFormSubmit}
          oncancel={onclose}
          submitLabel={isUploadingImage ? "⏳ Uploading..." : "📤 Submit Recipe"}
          submitting={isSubmitting || isUploadingImage}
          errorMessage={submitError || ''}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .share-modal {
    background: #FFFEF5;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: white;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.3rem;
  }
  
  .close-btn {
    background: #E53935;
    border: 2px solid white;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .close-btn:hover {
    background: #C62828;
  }
  
  .form-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  /* Success view */
  .success-view {
    padding: 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .success-icon {
    font-size: 4rem;
  }
  
  .success-view h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #2E7D32;
  }
  
  .success-view p {
    margin: 0;
    color: #666;
    max-width: 300px;
  }
  
  .done-btn {
    margin-top: 12px;
    padding: 12px 32px;
    background: #8B4513;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
  
  .done-btn:hover {
    background: #A0522D;
  }
  
  .success-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin-top: 8px;
  }
  
  .my-recipes-link {
    color: #4a7c59;
    font-size: 0.9rem;
    text-decoration: underline;
  }
  
  .my-recipes-link:hover {
    color: #3d6a4a;
  }
  
  /* Login required view */
  .login-required {
    padding: 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .login-icon {
    font-size: 4rem;
  }
  
  .login-required h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #8B4513;
  }
  
  .login-required p {
    margin: 0;
    color: #666;
    max-width: 300px;
  }
  
  .login-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin-top: 8px;
  }
  
  .login-btn {
    padding: 12px 32px;
    background: #4a7c59;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
  }
  
  .login-btn:hover {
    background: #3d6a4a;
  }
  
  .cancel-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .cancel-btn:hover {
    color: #333;
  }
  
  /* Image Upload Styles */
  .image-upload-section {
    padding: 16px 20px;
    border-bottom: 1px solid #E8E0D0;
    background: #FAFAF5;
  }
  
  .image-upload-section h3 {
    margin: 0 0 4px;
    font-size: 1rem;
    color: #8B4513;
  }
  
  .image-tip {
    margin: 0 0 12px;
    font-size: 0.85rem;
    color: #666;
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
  
  @media (max-width: 500px) {
    .share-modal {
      max-height: 95vh;
    }
    
    .image-upload-section {
      padding: 12px 16px;
    }
    
    .upload-placeholder {
      padding: 20px 12px;
    }
  }
</style>