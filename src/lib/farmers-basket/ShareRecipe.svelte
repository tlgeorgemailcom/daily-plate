<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { canUseStorage } from '$lib/stores/playerStore';
  import { saveGameScore } from '$lib/stores/scoreHistory';
  import RecipeForm, { type RecipeFormData } from './RecipeForm.svelte';
  
  interface Props {
    onclose: () => void;
    onsubmit?: () => void;
    joinCode?: string;
  }
  
  let { onclose, onsubmit, joinCode }: Props = $props();
  
  // Submission state
  let isSubmitting = $state(false);
  let submitError = $state<string | null>(null);
  let submitSuccess = $state(false);

  // Draft state (recipe saved as status='draft' — not yet submitted)
  let draftRecipeId = $state<string | null>(null);
  let draftSaving = $state(false);
  let draftError = $state<string | null>(null);
  let draftSuccess = $state(false);
  let draftTimestamp = $state<string | null>(null);

  // Entry view: 'choose' (start vs join), 'new' (creating own recipe), 'join' (entering a code)
  // 'loading' is used transiently when auto-joining via a share link — prevents UI flash
  type EntryView = 'choose' | 'new' | 'join' | 'loading';
  let entryView = $state<EntryView>(joinCode ? 'loading' : 'choose');

  // Collaborator state — set when joining via edit code
  let isCollaborator = $state(false);
  let collabCode = $state('');
  let collabCodeError = $state<string | null>(null);
  let collabCodeLoading = $state(false);
  let collabInitialData = $state<Record<string, unknown> | null>(null);

  // Edit code state (available as soon as draft is saved)
  let shareEditCode = $state<string | null>(null);
  let generatingShareCode = $state(false);
  let shareCodeCopied = $state(false);
  let shareCodeError = $state<string | null>(null);

  // Polling — detect collaborator changes while the form is open
  let draftChangedWhileEditing = $state(false);
  let knownDraftTimestamp = $state<string | null>(null);
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  function startPoll() {
    stopPoll();
    pollInterval = setInterval(async () => {
      if (!draftRecipeId || !playerId) return;
      try {
        const res = await fetch(`/api/recipes/draft?recipeId=${draftRecipeId}&playerId=${encodeURIComponent(playerId)}`);
        if (!res.ok) return;
        const data = await res.json();
        const serverTimestamp: string | null = data.draftUpdatedAt ?? null;
        if (serverTimestamp && knownDraftTimestamp && serverTimestamp !== knownDraftTimestamp) {
          draftChangedWhileEditing = true;
          stopPoll();
        }
      } catch {}
    }, 12000);
  }

  function stopPoll() {
    if (pollInterval !== null) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  }

  onDestroy(() => stopPoll());

  // Collaborator: join a draft recipe by its edit code
  async function handleJoinByCode() {
    collabCodeError = null;
    const trimmed = collabCode.trim().toUpperCase();
    if (!trimmed) { collabCodeError = 'Enter the edit code'; return; }
    if (!playerId) { collabCodeError = 'Please log in first'; return; }
    collabCodeLoading = true;
    try {
      const res = await fetch(`/api/recipes/by-edit-code?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) { collabCodeError = data.error || 'Code not found'; entryView = 'join'; return; }
      draftRecipeId = data.recipeId;
      shareEditCode = trimmed;
      isCollaborator = true;
      collabInitialData = {
        recipeName: data.name || '',
        category: data.category || 'Dinner',
        dietaryCategory: data.dietaryCategory || 'all',
        submitterName: '',
        prepTime: data.prepTime || '',
        servings: data.servings || '',
        ingredients: data.ingredients?.length ? data.ingredients : [{ id: 1, name: '', quantity: '' }],
        instructions: data.instructions?.length ? data.instructions : [{ id: 1, text: '' }],
      };
      entryView = 'new';
    } catch {
      collabCodeError = 'Network error — please try again';
      entryView = 'join';
    } finally {
      collabCodeLoading = false;
    }
  }

  // Collaborator: save changes to the shared draft
  async function handleCollabSave(data: RecipeFormData) {
    if (!draftRecipeId || !shareEditCode) return;
    draftSaving = true;
    draftError = null;
    draftSuccess = false;
    try {
      let imageUrl: string | null = uploadedImageUrl;
      if (selectedImageFile && !uploadedImageUrl) {
        imageUrl = await uploadImage();
        if (imageUploadError) { draftError = imageUploadError; return; }
      }
      const payload = buildPayload(data, imageUrl);
      const res = await fetch('/api/recipes/submit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recipeId: draftRecipeId, code: shareEditCode, submit: false })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save changes');
      }
      draftSuccess = true;
      setTimeout(() => { draftSuccess = false; }, 3000);
    } catch (err) {
      draftError = err instanceof Error ? err.message : 'Failed to save changes';
    } finally {
      draftSaving = false;
    }
  }

  async function handleGenerateShareCode() {
    shareCodeError = null;
    if (!playerId) {
      shareCodeError = 'Please log in to generate an edit code';
      return;
    }
    if (!draftRecipeId) {
      shareCodeError = 'Save a draft first to generate an edit code';
      return;
    }
    generatingShareCode = true;
    try {
      const res = await fetch('/api/recipes/edit-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: draftRecipeId, playerId })
      });
      const data = await res.json();
      if (res.ok) {
        shareEditCode = data.code;
      } else {
        shareCodeError = data.error || 'Failed to generate code';
      }
    } catch {
      shareCodeError = 'Network error — please try again';
    } finally {
      generatingShareCode = false;
    }
  }

  function handleCopyShareCode() {
    if (!shareEditCode) return;
    navigator.clipboard.writeText(shareEditCode).then(() => {
      shareCodeCopied = true;
      setTimeout(() => { shareCodeCopied = false; }, 2000);
    });
  }

  let canNativeShare = $state(typeof navigator !== 'undefined' && !!navigator.share);

  async function handleShareCode() {
    if (!shareEditCode) return;
    const joinUrl = `${window.location.origin}/join?code=${shareEditCode}`;
    try {
      await navigator.share({
        title: 'Collaborate on my recipe',
        text: `Use code ${shareEditCode} to collaborate on my recipe draft.`,
        url: joinUrl
      });
    } catch {
      // User cancelled or share failed — fall through silently
    }
  }

  function handleEmailCode() {
    if (!shareEditCode) return;
    const joinUrl = `${window.location.origin}/join?code=${shareEditCode}`;
    const subject = encodeURIComponent('Collaborate on my recipe');
    const body = encodeURIComponent(
      `I'd like you to help with a recipe I'm working on.\n\nUse this code in the Daily Food Chain app: ${shareEditCode}\n\nOr open this link: ${joinUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  let revokingShareCode = $state(false);

  async function handleRevokeShareCode() {
    if (!draftRecipeId || !playerId) return;
    revokingShareCode = true;
    shareCodeError = null;
    try {
      const res = await fetch('/api/recipes/edit-code', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: draftRecipeId, playerId })
      });
      if (res.ok) {
        shareEditCode = null;
        shareCodeCopied = false;
      } else {
        const data = await res.json();
        shareCodeError = data.error || 'Failed to revoke code';
      }
    } catch {
      shareCodeError = 'Network error — please try again';
    } finally {
      revokingShareCode = false;
    }
  }

  async function handleSaveDraft(data: RecipeFormData) {
    if (!isSubscriber || !playerId) return;
    draftSaving = true;
    draftError = null;
    draftSuccess = false;

    try {
      // Upload image if needed
      let imageUrl: string | null = uploadedImageUrl;
      if (selectedImageFile && !uploadedImageUrl) {
        imageUrl = await uploadImage();
        if (imageUploadError) { draftError = imageUploadError; return; }
      }

      const payload = buildPayload(data, imageUrl);

      let id = draftRecipeId;
      if (!id) {
        // First save — create a draft row
        const res = await fetch('/api/recipes/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, draft: true })
        });
        if (!res.ok) throw new Error('Failed to save draft');
        const result = await res.json();
        id = result.id;
        draftRecipeId = id!;
        // Track in localStorage so "My Recipes" can show draft too
        if (id && canUseStorage()) {
          try {
            const stored = localStorage.getItem('my-recipe-submissions');
            const ids: string[] = stored ? JSON.parse(stored) : [];
            if (!ids.includes(id)) { ids.push(id); localStorage.setItem('my-recipe-submissions', JSON.stringify(ids)); }
          } catch {}
        }
      } else {
        // Subsequent saves — update existing draft row
        const res = await fetch('/api/recipes/submit', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, recipeId: id, playerId, submit: false })
        });
        if (!res.ok) throw new Error('Failed to update draft');
      }

      draftTimestamp = new Date().toISOString();
      knownDraftTimestamp = draftTimestamp;
      draftSuccess = true;
      draftChangedWhileEditing = false;
      startPoll();
      setTimeout(() => { draftSuccess = false; }, 3000);
    } catch (err) {
      draftError = err instanceof Error ? err.message : 'Failed to save draft';
    } finally {
      draftSaving = false;
    }
  }
  
  // Image upload state
  let selectedImageFile = $state<File | null>(null);
  let imagePreviewUrl = $state<string | null>(null);
  let uploadedImageUrl = $state<string | null>(null);
  let imageUploadError = $state<string | null>(null);
  let isUploadingImage = $state(false);
  
  // Info panel state
  let showNutrientInfo = $state(false);
  let showRankingsInfo = $state(false);

  // Player/subscriber detection - must match playerStore.ts
  const PLAYER_KEY = 'dailyfoodchain_player';

  // Player authentication state — initialized synchronously to avoid flash of
  // the 'Subscription Required' screen before onMount fires
  let playerId = $state<string | null>(
    typeof window !== 'undefined' ? (() => {
      try {
        const p = localStorage.getItem(PLAYER_KEY);
        return p ? (JSON.parse(p).id || null) : null;
      } catch { return null; }
    })() : null
  );
  let isLoggedIn = $state(playerId !== null);
  let isSubscriber = $state(
    typeof window !== 'undefined' ? (() => {
      try {
        const p = localStorage.getItem(PLAYER_KEY);
        if (!p) return false;
        const parsed = JSON.parse(p);
        const tier = parsed.tier || parsed.subscription_tier || 'free';
        return tier !== 'free';
      } catch { return false; }
    })() : false
  );
  
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
    // If opened via a share link, auto-trigger the join with the code
    if (joinCode) {
      collabCode = joinCode.toUpperCase().trim();
      handleJoinByCode();
    }
  });

  // Shared helper — builds the submission payload from form data
  function buildPayload(data: RecipeFormData, imageUrl: string | null): Record<string, unknown> {
    return {
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
      playerId,
      ...(imageUrl ? { imageUrl } : {})
    };
  }
  
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
      
      const payload = buildPayload(data, imageUrl);
      let recipeId: string;

      if (draftRecipeId) {
        // Promote existing draft to pending
        const response = await fetch('/api/recipes/submit', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, recipeId: draftRecipeId, playerId, submit: true })
        });
        if (!response.ok) throw new Error('Failed to submit recipe');
        recipeId = draftRecipeId;
      } else {
        // No draft — direct submit
        const response = await fetch('/api/recipes/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to submit recipe');
        const result = await response.json();
        recipeId = result.id;
      }

      stopPoll();

      if (recipeId && canUseStorage()) {
        try {
          const STORAGE_KEY = 'my-recipe-submissions';
          const stored = localStorage.getItem(STORAGE_KEY);
          const ids: string[] = stored ? JSON.parse(stored) : [];
          if (!ids.includes(recipeId)) {
            ids.push(recipeId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
          }
        } catch (e) {
          console.warn('Could not save recipe ID to localStorage:', e);
        }
        
        // Track recipe submission for premium users
        saveGameScore('farmers-basket', 1, {
          recipeSubmitted: true,
          recipeId,
          recipeName: data.recipeName,
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
    {:else if submitSuccess}
      <div class="success-view">
        <div class="success-icon">✅</div>
        <h3>Recipe Submitted!</h3>
        <p>Thank you for sharing your recipe. It will be reviewed by a moderator and added to the game soon!</p>

        <div class="success-actions">
          <button class="done-btn" onclick={onclose}>Done</button>
          <a href="/farmers-basket/my-recipes" class="my-recipes-link">View My Submissions</a>
        </div>
      </div>
    {:else if entryView === 'loading'}
      <!-- Auto-joining via share link — render nothing to avoid flash -->
    {:else if entryView === 'choose'}
      <!-- Entry screen: creator starts fresh or collaborator joins via code -->
      <div class="entry-view">
        <p class="entry-intro">What would you like to do?</p>
        <div class="entry-options">
          <button class="entry-option-btn" onclick={() => entryView = 'new'}>
            <span class="entry-icon">✍️</span>
            <span class="entry-label">Start a new recipe</span>
          </button>
          <button class="entry-option-btn entry-option-secondary" onclick={() => { entryView = 'join'; collabCodeError = null; collabCode = ''; }}>
            <span class="entry-icon">🤝</span>
            <span class="entry-label">Join with an edit code</span>
          </button>
        </div>
      </div>
    {:else if entryView === 'join'}
      <!-- Collaborator code entry -->
      <div class="join-view">
        <p class="join-hint">Enter the edit code shared by the recipe creator.</p>
        <div class="join-input-row">
          <input
            class="join-code-input"
            bind:value={collabCode}
            placeholder="e.g. ABC123"
            maxlength={6}
            onkeydown={(e) => { if (e.key === 'Enter') handleJoinByCode(); }}
          />
          <button class="join-load-btn" onclick={handleJoinByCode} disabled={collabCodeLoading}>
            {collabCodeLoading ? 'Loading...' : 'Load Recipe'}
          </button>
        </div>
        {#if collabCodeError}
          <p class="join-error">{collabCodeError}</p>
        {/if}
        <button class="join-back-link" onclick={() => { entryView = 'choose'; collabCodeError = null; }}>← Back</button>
      </div>
    {:else}
      <div class="form-container">
        <!-- Info Links -->
        <div class="info-links">
          <button type="button" class="info-link" onclick={() => { showNutrientInfo = !showNutrientInfo; showRankingsInfo = false; }}>
            🔗 Nutrient Linking
          </button>
          <button type="button" class="info-link" onclick={() => { showRankingsInfo = !showRankingsInfo; showNutrientInfo = false; }}>
            🏆 Rankings
          </button>
        </div>

        {#if showNutrientInfo}
          <div class="info-panel">
            <div class="info-panel-header">
              <h3>🔗 Nutrient Linking</h3>
              <button type="button" class="info-close-btn" onclick={() => showNutrientInfo = false}>×</button>
            </div>
            <div class="info-panel-body">
              <p>Most recipes — in cookbooks, on food blogs, on websites — list ingredients in their raw or pre-cooked state — "1 cup dry lentils" or "1 cup dry rice" — We appreciate you sharing recipes in this format, and your recipe submission will be visible to all players once reviewed.</p>
              <p>You also have the option to link each ingredient to the nutrition database.</p>
              <p>The nutrition database only contains food <strong>"as eaten"</strong> — the way it actually arrives on your plate, ready to consume.</p>
              <p>Nutrition science measures food the way your body actually receives it — after it has been cooked, prepared, and is ready to eat. That is the only measurement that tells you what your body actually got.</p>
              <p>The dataset used in the Basket game draws from the USDA SR Legacy Foods dataset — one of the most comprehensive nutrition references available — filtered to include only foods as they are actually eaten.</p>
              <p>If you choose to link, match every ingredient to its cooked or ready-to-eat form. Your recipe stays exactly as you wrote it — only the nutrition connection is added.</p>
              <p><strong>Linking is an enhancement, never a requirement.</strong> If you'd like to add nutrition links later, you can always come back and connect each ingredient to its as-eaten equivalent. Linked recipes earn a higher ranking and are guaranteed a rotation in the daily Recipe of the Day — but that's entirely your choice, whenever you're ready.</p>
            </div>
          </div>
        {/if}

        {#if showRankingsInfo}
          <div class="info-panel">
            <div class="info-panel-header">
              <h3>🏆 Rankings</h3>
              <button type="button" class="info-close-btn" onclick={() => showRankingsInfo = false}>×</button>
            </div>
            <div class="info-panel-body">
              <p><strong>Recipe Placement</strong></p>
              <p>Every newly approved shared recipe is pinned to the top of its meal category for one day. After that one day, it takes its ranked place in the daily shuffle.</p>
              <p>Every time a player attempts your recipe — win or lose — that counts as a vote of interest. A recipe tried 40 times ranks higher than a recipe won 5 times by 5 players. Wins are shown on your recipe card, but they don't determine your rank. Engagement does.</p>
              <p><strong>There are two tiers in every meal category.</strong></p>
              <p>Recipes in Breakfast, Snacks, Lunch, Dinner, Beverages, Salads, and Sides are organised into two tiers. Within each tier, recipes shuffle daily so every recipe gets seen. The highest-ranked recipe in each tier is always pinned at the top.</p>
              <p><strong>Tier 1 — Linked Recipes</strong><br>All recipes with ingredients connected to the nutrition database — whether built-in or player-shared — compete as equals. This is the most visible tier.</p>
              <p><strong>Tier 2 — Unlinked Recipes</strong><br>All recipes not yet linked to the database — built-in or player-shared — compete as equals. Link your recipe to move it into Tier 1.</p>
              <p><strong>Link your recipe to reach Tier 1 and Recipe of the Day.</strong><br>Linking all your ingredients moves your recipe into Tier 1 and qualifies it for the daily Recipe of the Day rotation. Every fully linked recipe is guaranteed a turn. Linking is always optional — but it is the clearest path to the top.</p>
            </div>
          </div>
        {/if}

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
        
        <!-- Draft saved notice -->
        {#if draftRecipeId && draftTimestamp}
          <div class="share-draft-notice">
            💾 Draft saved
            <span class="share-draft-time">· {new Date(draftTimestamp).toLocaleTimeString()}</span>
          </div>
        {/if}

        {#if draftChangedWhileEditing}
          <div class="share-updated-banner">
            <span>A collaborator saved changes while you were editing.</span>
            <button class="load-updated-btn" onclick={async () => {
              const res = await fetch(`/api/recipes/draft?recipeId=${draftRecipeId}&playerId=${encodeURIComponent(playerId ?? '')}`);
              if (res.ok) {
                const d = await res.json();
                knownDraftTimestamp = d.draftUpdatedAt;
                draftChangedWhileEditing = false;
                startPoll();
              }
            }}>Reload their version</button>
          </div>
        {/if}

        <RecipeForm
          moderatorMode={false}
          onsubmit={isCollaborator ? () => {} : handleFormSubmit}
          oncancel={onclose}
          submitting={isSubmitting || draftSaving || isUploadingImage}
          errorMessage={submitError || draftError || ''}
          initialData={collabInitialData ?? {}}
        >
          {#snippet customActions({ formData, isValid })}
            <div class="share-form-actions">
              <button type="button" class="cancel-btn" onclick={onclose}>Cancel</button>
              {#if isCollaborator}
                <button
                  type="button"
                  class="share-save-draft-btn"
                  disabled={draftSaving}
                  onclick={() => handleCollabSave(formData)}
                >
                  {draftSaving ? '⏳ Saving...' : draftSuccess ? '✓ Saved!' : '💾 Save Changes'}
                </button>
              {:else}
              <button
                type="button"
                class="share-save-draft-btn"
                disabled={draftSaving || isSubmitting}
                onclick={() => handleSaveDraft(formData)}
              >
                {draftSaving ? '⏳ Saving...' : draftSuccess ? '✓ Draft saved!' : '💾 Save Draft'}
              </button>
              <button
                type="submit"
                class="share-submit-btn"
                disabled={isSubmitting || draftSaving || !isValid}
              >
                {isSubmitting ? '⏳ Submitting...' : '📤 Submit for Approval'}
              </button>
              {/if}
            </div>
          {/snippet}
        </RecipeForm>

        <!-- Collaborator Edit Code — creator only; hides when joining via code -->
        {#if !isCollaborator}
        <div class="share-edit-code-section">
          <p class="edit-code-label">🔑 Collaborator Edit Code</p>
          {#if shareEditCode}
            <p class="edit-code-hint">Share this code so another player can suggest changes. Only you can submit for approval.</p>
            <div class="edit-code-display">
              <span class="edit-code-value">{shareEditCode}</span>
              <button class="copy-code-btn" onclick={handleCopyShareCode}>
                {shareCodeCopied ? '✓ Copied' : 'Copy'}
              </button>
              {#if canNativeShare}
                <button class="share-code-btn" onclick={handleShareCode}>Share</button>
              {/if}
              <button class="email-code-btn" onclick={handleEmailCode}>Email</button>
              <button class="revoke-code-btn" onclick={handleRevokeShareCode} disabled={revokingShareCode}>
                {revokingShareCode ? 'Revoking...' : 'Revoke'}
              </button>
            </div>
            {#if shareCodeError}
              <p class="edit-code-error">{shareCodeError}</p>
            {/if}
          {:else}
            <p class="edit-code-hint">Generate a code you can share with collaborators. Save a draft first if you haven't already. At minimum, a Recipe Name is required to save a draft.</p>
            {#if shareCodeError}
              <p class="edit-code-error">{shareCodeError}</p>
            {/if}
            <button class="generate-code-btn" onclick={handleGenerateShareCode} disabled={generatingShareCode}>
              {generatingShareCode ? 'Generating...' : 'Generate Edit Code'}
            </button>
          {/if}
        </div>
        {/if}
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
    overflow-x: hidden;
    padding: 20px;
  }

  /* Entry view — start new or join via code */
  .entry-view {
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .entry-intro {
    font-size: 1rem;
    color: #5D4037;
    margin: 0;
  }

  .entry-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 340px;
  }

  .entry-option-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 12px;
    border: 2px solid #8D6E63;
    background: #FFF8E1;
    cursor: pointer;
    font-size: 1rem;
    color: #3E2723;
    text-align: left;
    transition: background 0.15s;
  }

  .entry-option-btn:hover {
    background: #FFE0B2;
  }

  .entry-option-secondary {
    border-color: #A5D6A7;
    background: #F1F8E9;
    color: #1B5E20;
  }

  .entry-option-secondary:hover {
    background: #C8E6C9;
  }

  .entry-icon {
    font-size: 1.4rem;
  }

  .entry-label {
    font-weight: 600;
  }

  /* Join via code view */
  .join-view {
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .join-hint {
    font-size: 0.95rem;
    color: #5D4037;
    margin: 0;
  }

  .join-input-row {
    display: flex;
    gap: 8px;
  }

  .join-code-input {
    flex: 1;
    padding: 10px 14px;
    border: 2px solid #8D6E63;
    border-radius: 8px;
    font-size: 1.1rem;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: #FFF8E1;
  }

  .join-code-input:focus {
    outline: none;
    border-color: #F57F17;
  }

  .join-load-btn {
    padding: 10px 18px;
    background: #388E3C;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
  }

  .join-load-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .join-error {
    color: #C62828;
    font-size: 0.85rem;
    margin: 0;
  }

  .join-back-link {
    background: none;
    border: none;
    color: #8D6E63;
    font-size: 0.9rem;
    cursor: pointer;
    text-align: left;
    padding: 0;
    text-decoration: underline;
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

  /* Edit code section in success view */
  .share-edit-code-section {
    width: 100%;
    background: #f9f5f0;
    border: 1px solid #e0d5c5;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }

  /* Draft saved notice */
  .share-draft-notice {
    background: #f0faf3;
    border: 1px solid #b8dfc6;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.85rem;
    color: #3d6a4a;
    margin-bottom: 6px;
  }

  .share-draft-time {
    color: #6a9a7a;
  }

  /* Polling banner */
  .share-updated-banner {
    background: #fffbea;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.88rem;
    color: #7c5a00;
    margin-bottom: 8px;
  }

  .load-updated-btn {
    flex-shrink: 0;
    background: #f59e0b;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 0.82rem;
    cursor: pointer;
  }

  /* Form action buttons */
  .share-form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
    padding-top: 4px;
  }

  .share-save-draft-btn {
    background: #f0faf3;
    color: #3d6a4a;
    border: 1.5px solid #b8dfc6;
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }

  .share-save-draft-btn:hover:not(:disabled) {
    background: #d8f0e2;
    border-color: #88c4a4;
  }

  .share-save-draft-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .share-submit-btn {
    background: #3d6a4a;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .share-submit-btn:hover:not(:disabled) {
    background: #2e5238;
  }

  .share-submit-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .edit-code-label {
    margin: 0;
    font-weight: 600;
    color: #5a3e28;
    font-size: 0.95rem;
  }

  .edit-code-hint {
    margin: 0;
    font-size: 0.8rem;
    color: #888;
    line-height: 1.4;
  }

  .edit-code-display {
    display: flex;
    align-items: center;
    gap: 10px;
    background: white;
    border: 1.5px solid #c8a96e;
    border-radius: 8px;
    padding: 8px 14px;
  }

  .edit-code-value {
    font-family: 'Courier New', monospace;
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: 4px;
    color: #5a3e28;
  }

  .copy-code-btn {
    padding: 4px 10px;
    background: #8B4513;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .copy-code-btn:hover {
    background: #A0522D;
  }

  .share-code-btn {
    padding: 4px 10px;
    background: #5b7fa6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .share-code-btn:hover {
    background: #4a6d93;
  }

  .email-code-btn {
    padding: 4px 10px;
    background: #5b7fa6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .email-code-btn:hover {
    background: #4a6d93;
  }

  .revoke-code-btn {
    padding: 4px 10px;
    background: #C62828;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .revoke-code-btn:hover {
    background: #B71C1C;
  }

  .revoke-code-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .generate-code-btn {
    padding: 8px 20px;
    background: #4a7c59;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .generate-code-btn:hover:not(:disabled) {
    background: #3d6a4a;
  }

  .generate-code-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .edit-code-error {
    color: #C62828;
    font-size: 0.8rem;
    margin: 4px 0 8px;
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
  
  /* Info Links */
  .info-links {
    display: flex;
    gap: 10px;
    padding: 12px 20px;
    border-bottom: 1px solid #E8E0D0;
    background: #F5F0E8;
  }

  .info-link {
    flex: 1;
    padding: 8px 12px;
    background: #8B4513;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .info-link:hover {
    background: #A0522D;
  }

  /* Info Panels */
  .info-panel {
    margin: 0;
    border-bottom: 2px solid #C9B896;
    background: #FFFDF5;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .info-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: #F0E8D8;
    border-bottom: 1px solid #E0D0B8;
  }

  .info-panel-header h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #6B3410;
  }

  .info-close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #8B4513;
    cursor: pointer;
    line-height: 1;
    padding: 2px 6px;
  }

  .info-close-btn:hover {
    color: #C62828;
  }

  .info-panel-body {
    padding: 14px 16px;
    font-size: 0.85rem;
    color: #444;
    line-height: 1.6;
    max-height: 280px;
    overflow-y: auto;
  }

  .info-panel-body p {
    margin: 0 0 10px;
  }

  .info-panel-body p:last-child {
    margin-bottom: 0;
  }

  .coming-soon {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 16px 0;
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