<script lang="ts">
  import { onMount } from 'svelte';
  import { canUseStorage } from '$lib/stores/playerStore';
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
  
  // Player authentication state
  let playerId = $state<string | null>(null);
  let isLoggedIn = $state(false);
  let isSubscriber = $state(false);
  
  // Player/subscriber detection
  const PLAYER_KEY = 'daily-food-chain-player';
  
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
        const tier = parsed.subscription_tier || 'free';
        return tier !== 'free';
      }
      return false;
    } catch {
      return false;
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
      
      const submission: Record<string, unknown> = {
        recipeName: data.recipeName.trim(),
        category: data.category,
        dietaryCategory: data.dietaryCategory,
        submitterName: data.submitterName.trim() || 'Anonymous',
        prepTime: data.prepTime.trim(),
        servings: data.servings.trim(),
        ingredients: data.ingredients.map(i => ({
          name: i.name.trim(),
          quantity: i.quantity.trim()
        })),
        instructions: data.instructions.map(i => i.text.trim()),
        submittedAt: new Date().toISOString()
      };
      
      // Include playerId (required)
      submission.playerId = playerId;
      
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
        <RecipeForm 
          moderatorMode={false}
          onsubmit={handleFormSubmit}
          oncancel={onclose}
          submitLabel="📤 Submit Recipe"
          submitting={isSubmitting}
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
  
  @media (max-width: 500px) {
    .share-modal {
      max-height: 95vh;
    }
  }
</style>