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
    foodWord?: string;
    ndbNo?: string;
    portionDesc?: string;
    portionGrams?: number;
    servingCount?: number;
    exempt?: boolean;
    is_optional?: boolean;
    section?: string;
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
    status: 'pending' | 'approved' | 'rejected' | 'needs_changes';
    moderatorNote?: string;
    gameFoods?: string[];
    animalSpawns?: { type: string; delay: number }[];
    foodSupply?: Record<string, number>;
    modIngredients?: SubmittedIngredient[];
    imageUrl?: string;
    editedAt?: string;
    editedBy?: string;
    linkType?: 'ingredient' | 'dish' | 'mixed';
    cookingMethod?: string;
    dishFamily?: string | null;
    needsNameReview?: boolean;
    nutritionJson?: unknown | null;
    srRule?: string;
    sections?: unknown[];
  }
  
  // Password protection
  let authenticated = $state(false);
  let passwordInput = $state('');
  let passwordError = $state(false);
  const MODERATOR_PASSWORD = '4444';
  
  // View state
  let activeView = $state<'pending' | 'published' | 'community' | 'new'>('pending');
  
  // Pending recipes
  let recipes = $state<RecipeSubmission[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let selectedRecipe = $state<RecipeSubmission | null>(null);
  
  // Published recipes  
  let publishedRecipes = $state<RecipeSubmission[]>([]);
  let loadingPublished = $state(false);
  let selectedPublished = $state<RecipeSubmission | null>(null);

  const devRecipes = $derived(publishedRecipes.filter(r => !r.id.startsWith('recipe-')));
  const communityRecipes = $derived(publishedRecipes.filter(r => r.id.startsWith('recipe-')));
  const devRecipesCount = $derived(devRecipes.length);
  const communityRecipesCount = $derived(communityRecipes.length);
  
  // Form state
  let isSaving = $state(false);
  let saveError = $state<string | null>(null);
  let successMsg = $state<string | null>(null);
  
  // Request Changes panel state
  let showRequestChangesPanel = $state(false);
  let requestChangesNote = $state('');
  
  // Image upload state for published recipes
  let selectedImageFile = $state<File | null>(null);
  let imagePreviewUrl = $state<string | null>(null);
  let isUploadingImage = $state(false);
  let imageUploadError = $state<string | null>(null);
  
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
      const res = await fetch('/api/recipes/moderate?filter=pending');
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data?.error as string) || `Failed to load pending recipes (${res.status})`);
      }
      recipes = data.recipes || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load pending recipes';
    } finally {
      loading = false;
    }
  }
  
  async function loadPublishedRecipes() {
    loadingPublished = true;
    try {
      const res = await fetch('/api/recipes/moderate?filter=approved');
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data?.error as string) || `Failed to load published recipes (${res.status})`);
      }
      publishedRecipes = data.recipes || [];
    } catch (err) {
      console.error('Failed to load published recipes', err);
      error = err instanceof Error ? err.message : 'Failed to load published recipes';
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
    // Reset image state - show existing image if any
    selectedImageFile = null;
    imagePreviewUrl = recipe.imageUrl || null;
    imageUploadError = null;
  }

  function closeSelectedRecipe() {
    selectedRecipe = null;
    selectedPublished = null;
    saveError = null;
    showRequestChangesPanel = false;
    requestChangesNote = '';
    selectedImageFile = null;
    imagePreviewUrl = null;
    imageUploadError = null;
  }
  
  // Maps Turso DB cooking_method values (e.g. 'baked', 'boiled', 'pan seared')
  // to the UI COOKING_METHODS labels (e.g. 'Bake', 'Boil', 'Pan sear').
  function normalizeCookingMethod(raw?: string): string {
    if (!raw) return 'Bake';
    const map: Record<string, string> = {
      'baked':          'Bake',
      'baked covered':  'Bake (covered)',
      'bake covered':   'Bake (covered)',
      'boiled':         'Boil',
      'boiled covered': 'Boil (covered)',
      'simmer':         'Simmer',
      'sub-simmer':     'Sub-simmer',
      'braise':         'Braise',
      'steamed':        'Steam',
      'microwave':      'Microwave',
      'sauteed':        'Sauté',
      'sautéed':        'Sauté',
      'stir-fried':     'Stir-fry',
      'stir fry':       'Stir-fry',
      'pan seared':     'Pan sear',
      'grilled':        'Grill',
      'broiled':        'Broil',
      'fried':          'Fry',
      'deep-fried':     'Deep-fry',
      'deep fry':       'Deep-fry',
      'raw':            'No heat',
      'finish':         'Added after cooking',
    };
    return map[raw.toLowerCase()] ?? raw;
  }

  function recipeToFormData(recipe: RecipeSubmission): Partial<RecipeFormData> {
    const rawIngredients = (recipe.modIngredients || recipe.ingredients || []) as unknown as Array<Record<string, unknown>>;
    const rawInstructions = (recipe.instructions || []) as unknown[];
    // Component-ref rows (isDish=true AND componentRef set) are child-recipe
    // references, not dish-link rows — keep them in ingredientRows so they
    // appear in the form (English muffin, hollandaise, etc.).
    const dishRow = rawIngredients.find((ing) => (ing.row_type === 'dish' || ing.isDish === true) && !ing.componentRef);
    const ingredientRows = rawIngredients.filter((ing) => !(ing.row_type === 'dish' || (ing.isDish === true && !ing.componentRef)));

    const dishNdbNo = dishRow?.ndb_no || dishRow?.ndbNo;
    const dishLink = dishRow && dishNdbNo
      ? {
          foodWord: String(dishRow.food_word || dishRow.foodWord || ''),
          ndbNo: String(dishNdbNo),
          portionDesc: String(dishRow.portion_desc || dishRow.portionDesc || dishRow.ing_qty || 'custom (g)'),
          portionGrams: Number(dishRow.portion_grams ?? dishRow.portionGrams ?? 100),
          servingCount: Number(dishRow.serving_count ?? dishRow.servingCount ?? 1)
        }
      : undefined;

    const mappedIngredients = ingredientRows.map((ing, i) => ({
      id: i + 1,
      name: String(ing.name || ing.ing_name || ''),
      quantity: String(ing.quantity || ing.ing_qty || ''),
      gameFood: String(ing.gameFood || ing.game_food || ''),
      animal: String(ing.animal || ''),
      foodWord: ing.foodWord != null ? String(ing.foodWord) : (ing.food_word != null ? String(ing.food_word) : undefined),
      ndbNo: ing.ndbNo != null ? String(ing.ndbNo) : (ing.ndb_no != null ? String(ing.ndb_no) : undefined),
      portionDesc: ing.portionDesc != null ? String(ing.portionDesc) : (ing.portion_desc != null ? String(ing.portion_desc) : undefined),
      portionGrams: typeof ing.portionGrams === 'number' ? ing.portionGrams : (typeof ing.portion_grams === 'number' ? ing.portion_grams : undefined),
      servingCount: typeof ing.servingCount === 'number' ? ing.servingCount : (typeof ing.serving_count === 'number' ? ing.serving_count : undefined),
      exempt: ing.exempt === true,
      isDish: Boolean(ing.isDish),
      section: ing.section != null ? String(ing.section) : undefined
    }));

    return {
      recipeName: recipe.recipeName,
      category: recipe.category,
      dietaryCategory: (recipe.dietaryCategory || 'all') as DietaryCategory,
      submitterName: recipe.submitterName,
      prepTime: recipe.prepTime || '',
      servings: recipe.servings || '',
      cookingMethod: normalizeCookingMethod(recipe.cookingMethod),
      dishFamily: recipe.dishFamily || '',
      ingredients: mappedIngredients.map((ing) => ({
        ...ing,
        gameFood: (ing.gameFood || '') as FoodType | '',
        animal: (ing.animal || '') as AnimalType | ''
      })),
      instructions: rawInstructions.map((step, i) => ({
        id: i + 1,
        text:
          typeof step === 'string'
            ? step
            : typeof step === 'object' && step !== null && 'text' in step
              ? String((step as { text?: unknown }).text || '')
              : ''
      })),
      foodSupply: recipe.foodSupply,
      linkMode: recipe.linkType || (dishLink ? 'dish' : 'ingredient'),
      ...(dishLink ? { dishLink } : {}),
      nutritionJson: (recipe.nutritionJson as any) || undefined,
      sr28Rule: (recipe.srRule as 'Rule A' | 'Rule B' | 'Rule C' | 'Rule D' | undefined) || undefined,
      sections: (recipe.sections as any[] | undefined) || undefined,
      // Read top-bar cook time directly from dedicated Turso columns (cook_minutes, cook_temp_f).
      // These are set by upload.py for dev recipes and by the submit route for player recipes.
      cookMinutes: typeof (recipe as any).cookMinutes === 'number' ? (recipe as any).cookMinutes : undefined,
      cookTempF:   typeof (recipe as any).cookTempF   === 'number' ? (recipe as any).cookTempF   : undefined,
    };
  }
  
  // Image handling functions for published recipes
  function handleImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      imageUploadError = 'Please select an image file';
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      imageUploadError = 'Image must be under 5MB';
      return;
    }
    
    selectedImageFile = file;
    imageUploadError = null;
    
    // Create preview URL
    if (imagePreviewUrl && !selectedPublished?.imageUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    imagePreviewUrl = URL.createObjectURL(file);
  }
  
  function removeImage() {
    if (imagePreviewUrl && !selectedPublished?.imageUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    selectedImageFile = null;
    imagePreviewUrl = null;
  }
  
  async function uploadImage(): Promise<string | null> {
    if (!selectedImageFile) return selectedPublished?.imageUrl || null;
    
    isUploadingImage = true;
    imageUploadError = null;
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);
      if (selectedPublished?.imageUrl) {
        formData.append('oldImageUrl', selectedPublished.imageUrl);
      }
      
      const res = await fetch('/api/recipes/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await res.json();
      return data.url;
    } catch (err) {
      imageUploadError = err instanceof Error ? err.message : 'Failed to upload image';
      return null;
    } finally {
      isUploadingImage = false;
    }
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
          cookingMethod: data.cookingMethod || 'Bake',
          dishFamily: data.dishFamily || null,
          prepTime: data.prepTime,
          servings: data.servings,
          ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
            name: i.name,
            quantity: i.quantity,
            gameFood: i.gameFood || null,
            animal: i.animal || null,
            ...(i.section ? { section: i.section } : {})
          })),
          ...(data.sections && data.sections.length > 0 ? { sections: data.sections } : {}),
          instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text),
          nutritionJson: data.nutritionJson ?? null,
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
    if (!confirm(`Permanently reject "${selectedRecipe.recipeName}"? The player will NOT be able to edit and resubmit.`)) return;
    
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

  async function handleRequestChanges() {
    if (!selectedRecipe) return;
    if (!requestChangesNote.trim()) return;
    
    isSaving = true;
    try {
      const res = await fetch('/api/recipes/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRecipe.id,
          action: 'needs_changes',
          moderatorNote: requestChangesNote.trim()
        })
      });
      
      if (!res.ok) throw new Error('Failed to request changes');
      
      const name = selectedRecipe.recipeName;
      recipes = recipes.filter(r => r.id !== selectedRecipe!.id);
      selectedRecipe = null;
      showRequestChangesPanel = false;
      requestChangesNote = '';
      successMsg = `Changes requested for: ${name}`;
      setTimeout(() => successMsg = null, 3000);
    } catch (err) {
      saveError = 'Failed to request changes';
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
      // Upload image if a new one was selected
      let imageUrl = selectedPublished.imageUrl;
      if (selectedImageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (imageUploadError) {
          saveError = imageUploadError;
          isSaving = false;
          return;
        }
      } else if (!imagePreviewUrl) {
        // Image was removed
        imageUrl = undefined;
      }
      
      const res = await fetch('/api/recipes/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPublished.id,
          updates: {
            recipeName: data.recipeName,
            category: data.category,
            dietaryCategory: data.dietaryCategory,
            cookingMethod: data.cookingMethod,
            dishFamily: data.dishFamily || null,
            prepTime: data.prepTime,
            servings: data.servings,
            gameFoods,
            ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity,
              ...(i.section ? { section: i.section } : {}),
              foodWord: i.foodWord,
              ndbNo: i.ndbNo,
              portionDesc: i.portionDesc,
              portionGrams: i.portionGrams,
              servingCount: i.servingCount,
              ...(i.exempt ? { exempt: true } : {}),
              ...(i.is_optional ? { is_optional: true } : {})
            })),
            modIngredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity,
              ...(i.section ? { section: i.section } : {}),
              gameFood: i.gameFood || null,
              animal: i.animal || null,
              foodWord: i.foodWord,
              ndbNo: i.ndbNo,
              portionDesc: i.portionDesc,
              portionGrams: i.portionGrams,
              servingCount: i.servingCount,
              ...(i.exempt ? { exempt: true } : {}),
              ...(i.is_optional ? { is_optional: true } : {})
            })),
            ...(data.sections && data.sections.length > 0 ? { sections: data.sections } : {}),
            instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text),
            imageUrl
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
          cookingMethod: data.cookingMethod || 'Bake',
          dishFamily: data.dishFamily || null,
          prepTime: data.prepTime,
          servings: data.servings,
          ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
            name: i.name,
            quantity: i.quantity,
            gameFood: i.gameFood || null,
            animal: i.animal || null,
            ...(i.section ? { section: i.section } : {})
          })),
          ...(data.sections && data.sections.length > 0 ? { sections: data.sections } : {}),
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

  function shouldReviewName(recipe: RecipeSubmission): boolean {
    if (recipe.needsNameReview === true) return true;

    // Fallback heuristic for legacy rows where explicit flag is not present.
    const name = (recipe.recipeName || '').trim();
    if (!name) return true;
    if (name.split(/\s+/).filter(Boolean).length < 2) return true;
    return !name.includes(' — ');
  }
</script>

<svelte:head>
  <title>Recipe Moderation | TodayPage</title>
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
        ✅ Published ({devRecipesCount})
      </button>
      <button 
        class="view-tab" 
        class:active={activeView === 'community'}
        onclick={() => { activeView = 'community'; selectedRecipe = null; }}
      >
        👥 Community ({communityRecipesCount})
      </button>
      <button 
        class="view-tab new-tab" 
        class:active={activeView === 'new'}
        onclick={() => { activeView = 'new'; selectedRecipe = null; selectedPublished = null; }}
      >
        ➕ Add New
      </button>
    </div>
    
    <div class="mod-layout" class:full-width={activeView === 'new'} class:community-view={activeView === 'community'}>
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
                    <span class="recipe-name-row">
                      <span class="recipe-name">{recipe.recipeName}</span>
                      {#if shouldReviewName(recipe)}
                        <span class="needs-name-badge">needs_name_review</span>
                      {/if}
                    </span>
                    <span class="recipe-meta">{recipe.category} • {recipe.submitterName}</span>
                    <span class="recipe-date">{formatDate(recipe.submittedAt)}</span>
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
          <button class="refresh-btn" onclick={loadRecipes}>🔄 Refresh</button>
        {:else if activeView === 'published'}
          <h2>Published ({devRecipesCount})</h2>
          {#if loadingPublished}
            <p class="status">Loading...</p>
          {:else if devRecipes.length === 0}
            <p class="status">No published recipes</p>
          {:else}
            <ul>
              {#each devRecipes as recipe (recipe.id)}
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
        {:else if activeView === 'community'}
          <h2>Community ({communityRecipesCount})</h2>
          {#if loadingPublished}
            <p class="status">Loading...</p>
          {:else if communityRecipes.length === 0}
            <p class="status">No approved community recipes</p>
          {:else}
            <ul>
              {#each communityRecipes as recipe (recipe.id)}
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
                <button type="button" class="close-detail-btn" onclick={closeSelectedRecipe}>Close</button>
                <p class="submitted-info">By {selectedRecipe.submitterName} on {formatDate(selectedRecipe.submittedAt)}</p>
                <p class="review-meta">
                  <span>Dish Family: {selectedRecipe.dishFamily || 'Unspecified'}</span>
                  <span>Cooking Method: {selectedRecipe.cookingMethod || 'Unspecified'}</span>
                  {#if shouldReviewName(selectedRecipe)}
                    <span class="needs-name-badge">needs_name_review</span>
                  {/if}
                </p>
              </div>
              
              <div class="form-container">
                {#key selectedRecipe.id}
                  <RecipeForm
                    moderatorMode={true}
                    recipeId={selectedRecipe.id}
                    initialData={recipeToFormData(selectedRecipe)}
                    onsubmit={handleApprove}
                    submitLabel="✅ Approve"
                    submitting={isSaving}
                    errorMessage={saveError || ''}
                    disableSuggestions={true}
                  >
                    {#snippet customActions({ formData, isValid })}
                      {#if showRequestChangesPanel}
                        <div class="request-changes-panel">
                          <label class="mod-note-label">💬 What needs to change?</label>
                          <textarea
                            class="mod-note-textarea"
                            bind:value={requestChangesNote}
                            placeholder="Describe what the player should fix before resubmitting..."
                            rows="3"
                            disabled={isSaving}
                          ></textarea>
                          <div class="request-changes-actions">
                            <button
                              type="button"
                              class="cancel-changes-btn"
                              onclick={() => { showRequestChangesPanel = false; requestChangesNote = ''; }}
                              disabled={isSaving}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              class="send-changes-btn"
                              onclick={handleRequestChanges}
                              disabled={isSaving || !requestChangesNote.trim()}
                            >
                              {isSaving ? 'Sending...' : '💬 Send Feedback'}
                            </button>
                          </div>
                        </div>
                      {:else}
                        <button 
                          type="button" 
                          class="request-changes-btn"
                          onclick={() => { showRequestChangesPanel = true; saveError = null; }}
                          disabled={isSaving}
                        >
                          💬 Request Changes
                        </button>
                        <button 
                          type="button" 
                          class="reject-btn"
                          onclick={handleReject}
                          disabled={isSaving}
                        >
                          ❌ Reject
                        </button>
                      {/if}
                      <button 
                        type="submit" 
                        class="approve-btn"
                        disabled={isSaving || !isValid || formData.ingredients.filter(i => i.gameFood && i.name.trim()).length === 0}
                      >
                        {isSaving ? 'Approving...' : '✅ Approve'}
                      </button>
                    {/snippet}
                  </RecipeForm>
                {/key}
              </div>
            </div>
          {/if}
        {:else if activeView === 'published' || activeView === 'community'}
          {#if !selectedPublished}
            <div class="empty-state">
              <p>Select a {activeView === 'community' ? 'community' : 'published'} recipe to edit</p>
            </div>
          {:else}
            <div class="detail-content">
              <div class="detail-header">
                <h2>✏️ Edit Published Recipe</h2>
                <button type="button" class="close-detail-btn" onclick={closeSelectedRecipe}>Close</button>
                <p class="submitted-info">
                  By {selectedPublished.submitterName}
                  {#if selectedPublished.editedAt}
                    • Edited {formatDate(selectedPublished.editedAt)}
                  {/if}
                </p>
                <p class="review-meta">
                  <span>Dish Family: {selectedPublished.dishFamily || 'Unspecified'}</span>
                  <span>Cooking Method: {selectedPublished.cookingMethod || 'Unspecified'}</span>
                  {#if shouldReviewName(selectedPublished)}
                    <span class="needs-name-badge">needs_name_review</span>
                  {/if}
                </p>
              </div>
              
              <div class="form-container">
                <!-- Image Upload Section -->
                <div class="image-upload-section">
                  <label class="section-label">Recipe Photo</label>
                  
                  {#if imagePreviewUrl}
                    <div class="image-preview-container">
                      <img src={imagePreviewUrl} alt="Recipe preview" class="image-preview" />
                      <button 
                        type="button" 
                        class="remove-image-btn"
                        onclick={removeImage}
                        disabled={isSaving || isUploadingImage}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  {:else}
                    <label class="image-picker">
                      <input 
                        type="file" 
                        accept="image/*"
                        onchange={handleImageSelect}
                        disabled={isSaving || isUploadingImage}
                      />
                      <span class="picker-content">
                        <span class="picker-icon">📷</span>
                        <span class="picker-text">Add Recipe Photo</span>
                        <span class="picker-hint">Max 5MB</span>
                      </span>
                    </label>
                  {/if}
                  
                  {#if imageUploadError}
                    <p class="image-error">{imageUploadError}</p>
                  {/if}
                  
                  {#if isUploadingImage}
                    <p class="image-uploading">Uploading image...</p>
                  {/if}
                </div>
                
                {#key selectedPublished.id}
                  <RecipeForm
                    moderatorMode={true}
                    recipeId={selectedPublished.id}
                    initialData={recipeToFormData(selectedPublished)}
                    onsubmit={handleSavePublished}
                    submitLabel="💾 Save"
                    submitting={isSaving}
                    errorMessage={saveError || ''}
                    disableSuggestions={true}
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
                {/key}
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
  
  .recipe-name-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .recipe-name {
    font-weight: bold;
    color: #333;
  }

  .needs-name-badge {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    font-size: 0.7rem;
    font-weight: 700;
    color: #8a4b08;
    background: #fff2d9;
    border: 1px solid #f0c891;
    border-radius: 999px;
    padding: 2px 8px;
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
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px 12px;
  }
  
  .detail-header h2 {
    margin: 0 0 4px;
    font-size: 1.2rem;
  }

  .close-detail-btn {
    justify-self: end;
    border: 1px solid #DDD;
    background: #FFF;
    color: #555;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    font-weight: 600;
  }

  .close-detail-btn:hover {
    background: #F7F7F7;
    border-color: #CCC;
  }
  
  .submitted-info {
    grid-column: 1 / -1;
    margin: 0;
    font-size: 0.85rem;
    color: #666;
  }

  .review-meta {
    grid-column: 1 / -1;
    margin: 6px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: center;
    font-size: 0.8rem;
    color: #555;
  }
  
  .form-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #FFFEF5;
  }
  
  /* Image Upload Section */
  .image-upload-section {
    margin-bottom: 20px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    border: 2px dashed #DDD;
  }
  
  .section-label {
    display: block;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333;
  }
  
  .image-picker {
    display: block;
    cursor: pointer;
  }
  
  .image-picker input {
    display: none;
  }
  
  .picker-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    background: #F5F5F5;
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .image-picker:hover .picker-content {
    background: #EEEEEE;
  }
  
  .picker-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }
  
  .picker-text {
    font-weight: 500;
    color: #333;
  }
  
  .picker-hint {
    font-size: 0.85rem;
    color: #666;
    margin-top: 4px;
  }
  
  .image-preview-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }
  
  .image-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .remove-image-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  
  .remove-image-btn:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  .image-error {
    color: #E53935;
    font-size: 0.9rem;
    margin: 8px 0 0;
  }
  
  .image-uploading {
    color: #1976D2;
    font-size: 0.9rem;
    margin: 8px 0 0;
  }
  
  /* Action Buttons */
  .request-changes-btn {
    padding: 12px 20px;
    background: #FFF8E1;
    border: 2px solid #F9A825;
    border-radius: 8px;
    color: #E65100;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }

  .request-changes-btn:hover {
    background: #FFF3CD;
  }

  .request-changes-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: #FFFDE7;
    border: 2px solid #F9A825;
    border-radius: 8px;
    flex: 1;
  }

  .mod-note-label {
    font-weight: bold;
    color: #E65100;
    font-size: 0.9rem;
  }

  .mod-note-textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #F9A825;
    border-radius: 6px;
    font-size: 0.9rem;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
  }

  .request-changes-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .cancel-changes-btn {
    padding: 8px 14px;
    background: transparent;
    border: 1px solid #aaa;
    border-radius: 6px;
    color: #555;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .cancel-changes-btn:hover {
    background: #f5f5f5;
  }

  .send-changes-btn {
    padding: 8px 16px;
    background: #F9A825;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 0.875rem;
    font-weight: bold;
    cursor: pointer;
  }

  .send-changes-btn:hover:not(:disabled) {
    background: #F57F17;
  }

  .send-changes-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

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

    .request-changes-btn,
    .reject-btn,
    .approve-btn {
      font-size: 0.8rem;
      padding: 8px 12px;
      flex: 1 1 auto;
      min-width: 0;
      text-align: center;
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
