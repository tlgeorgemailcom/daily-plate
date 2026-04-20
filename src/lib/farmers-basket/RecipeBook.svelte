<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { canUseStorage } from '$lib/stores/playerStore';
  import type { Level, FoodType, DietaryCategory } from './types';
  import FoodIcon from './FoodIcon.svelte';
  import RecipeForm, { type RecipeFormData, type RecipeIngredient } from './RecipeForm.svelte';
  import { clearOverrideCache } from './level-overrides';
  
  // All available meal categories (shown even if empty)
  const BASE_CATEGORIES = [
    'Breakfast',
    'Soups & Stews',
    'Sandwiches & Burgers',
    'Salads',
    'Pasta & Pizza',
    'Entrees & Main Courses',
    'Sides',
    'Desserts',
    'Beverages',
    'Sauces & Condiments'
  ];
  
  // Dietary preference categories
  // Using cooked food emojis (not live animals) for child-friendly display
  const DIETARY_CATEGORIES: { id: DietaryCategory; name: string; emoji: string; description: string }[] = [
    { id: 'all', name: 'All Foods', emoji: '🍽️', description: 'All ingredients' },
    { id: 'pollo-pesca', name: 'Pollo-Pesca', emoji: '🍗🐟', description: 'Poultry & seafood' },
    { id: 'pollo', name: 'Pollo', emoji: '🍗', description: 'Poultry only' },
    { id: 'pesca', name: 'Pesca', emoji: '🐟', description: 'Seafood only' },
    { id: 'veggie', name: 'Veggie', emoji: '🥚🧀', description: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan', emoji: '🌱', description: 'Plant-based' }
  ];
  
  // Dietary hierarchy: which categories include which
  // 'all' includes everything, 'vegan' is most restrictive
  const DIETARY_INCLUDES: Record<DietaryCategory, DietaryCategory[]> = {
    'all': ['all', 'pollo-pesca', 'pollo', 'pesca', 'veggie', 'vegan'],
    'pollo-pesca': ['pollo-pesca', 'pollo', 'pesca', 'veggie', 'vegan'],
    'pollo': ['pollo', 'veggie', 'vegan'],
    'pesca': ['pesca', 'veggie', 'vegan'],
    'veggie': ['veggie', 'vegan'],
    'vegan': ['vegan']
  };
  
  const DIETARY_STORAGE_KEY = 'farmers-basket-dietary-preference';
  
  interface Props {
    levels: Level[];
    completedLevels: Set<string>;
    currentLevelId: string | null;
    canReadAllRecipes?: boolean;
    hasInfantProfile?: boolean;
    onselect: (levelId: string) => void;
    onclose: () => void;
    onshare?: () => void;
    onLevelsUpdated?: () => void | Promise<void>;  // Called after recipe save to refresh levels
    startWithRecipeOfDay?: boolean;
  }
  
  let { levels, completedLevels, currentLevelId, canReadAllRecipes = false, hasInfantProfile = false, onselect, onclose, onshare, onLevelsUpdated, startWithRecipeOfDay = false }: Props = $props();
  
  // View states: 'dietary-select' | 'recipe-of-day' | 'index' | 'detail'
  let showDietarySelect = $state(false);
  let showRecipeOfDay = $state(startWithRecipeOfDay);
  
  // Moderator mode - allows editing the currently selected recipe
  let isModeratorMode = $state(false);
  // Add new built-in recipe mode (moderator only, no pre-filled data)
  let isAddingNewBuiltin = $state(false);
  let isSaving = $state(false);
  let saveError = $state<string | null>(null);
  let saveSuccess = $state(false);

  // Player edit mode - creator editing their own approved recipe
  let myRecipeIds = $state<string[]>([]);
  let currentPlayerId = $state<string | null>(null);
  let isPlayerEditing = $state(false);
  let playerEditSaving = $state(false);
  let playerEditError = $state<string | null>(null);
  let playerEditSuccess = $state(false);

  // Edit code modal - non-creator requesting collaborator access (Phase 2)
  let showEditCodeModal = $state(false);
  let editCodeInput = $state('');
  let editCodeError = $state('');
  let editCodeValidating = $state(false);
  let editCodeValidated = $state(false);

  // Collaborator edit mode (after code is validated)
  let isCollabEditing = $state(false);
  let collabRecipeId = $state<string | null>(null);
  let collabValidatedCode = $state('');
  let collabEditSaving = $state(false);
  let collabEditError = $state<string | null>(null);
  let collabEditSuccess = $state(false);
  let collabDraftChangedWhileEditing = $state(false);
  let collabKnownDraftTimestamp = $state<string | null>(null);
  let collabPollInterval: ReturnType<typeof setInterval> | null = null;

  // Creator draft state (draft left by collaborators or creator's own saved draft)
  let creatorDraft = $state<Record<string, unknown> | null>(null);
  let creatorDraftUpdatedAt = $state<string | null>(null);
  let creatorDraftIsOwn = $state(false);
  let creatorDraftLoading = $state(false);
  let creatorDraftLoadingIntoForm = $state(false);
  // Player (creator) save-draft state
  let playerDraftSaving = $state(false);
  let playerDraftError = $state<string | null>(null);
  let playerDraftSuccess = $state(false);
  // Set of recipe IDs that have unseen collaborator drafts (for badge in list view)
  let unseenDraftIds = $state<Set<string>>(new Set());

  // Creator edit code management
  let creatorEditCode = $state<string | null>(null);
  let editCodeGenerating = $state(false);
  let editCodeRevoking = $state(false);
  let editCodeCopied = $state(false);
  const MODERATOR_PASSWORD = '4444';
  
  // Image upload state for moderator mode
  let selectedImageFile = $state<File | null>(null);
  let imagePreviewUrl = $state<string | null>(null);
  let isUploadingImage = $state(false);
  let imageUploadError = $state<string | null>(null);
  
  // Dietary preference (loaded from localStorage)
  let dietaryPreference = $state<DietaryCategory>('all');
  
  // Load dietary preference on mount
  onMount(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DIETARY_STORAGE_KEY);
      if (saved && DIETARY_CATEGORIES.some(d => d.id === saved)) {
        dietaryPreference = saved as DietaryCategory;
        showDietarySelect = false;
      } else {
        // First time: show dietary selector
        showDietarySelect = true;
        showRecipeOfDay = false;
      }
      // Load IDs of recipes submitted from this device (for owner-edit detection)
      const storedIds = localStorage.getItem('my-recipe-submissions');
      myRecipeIds = storedIds ? JSON.parse(storedIds) : [];
      // Load current player ID so server-side ownership can also be checked
      const storedPlayer = localStorage.getItem('dailyfoodchain_player');
      if (storedPlayer) {
        try {
          const parsed = JSON.parse(storedPlayer);
          currentPlayerId = parsed.id || null;
        } catch { /* ignore */ }
      }
      // Load which of the creator's recipes have unseen collaborator drafts
      if (currentPlayerId) {
        fetch(`/api/recipes/draft?playerId=${currentPlayerId}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.unseenDraftIds) {
              unseenDraftIds = new Set(data.unseenDraftIds);
            }
          })
          .catch(() => {});
      }
    }
  });
  
  // Save dietary preference (only for logged-in users)
  function setDietaryPreference(pref: DietaryCategory) {
    dietaryPreference = pref;
    if (typeof window !== 'undefined' && canUseStorage()) {
      localStorage.setItem(DIETARY_STORAGE_KEY, pref);
    }
    showDietarySelect = false;
    showRecipeOfDay = false;
  }
  
  // Filter levels by dietary preference
  let filteredLevels = $derived(
    levels.filter(l => DIETARY_INCLUDES[dietaryPreference].includes(l.dietaryCategory))
  );
  
  // Which level is expanded (null = show index view)
  let selectedLevel = $state<Level | null>(null);
  
  // Recipe of the Day - daily recipe for current dietary preference
  let recipeOfTheDay = $derived(() => {
    const eligible = filteredLevels;
    if (eligible.length === 0) return levels[0]; // Fallback
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceEpoch = Math.floor(Date.now() / msPerDay);
    return eligible[daysSinceEpoch % eligible.length];
  });
  
  // Search/filter
  let searchQuery = $state('');

  let categories = $state<string[]>(BASE_CATEGORIES);

  $effect(() => {
    categories = hasInfantProfile ? [...BASE_CATEGORIES, 'Baby Food'] : BASE_CATEGORIES;
  });
  
  // Collapsed categories (set of category names that are collapsed)
  let collapsedCategories = $state<Set<string>>(new Set());
  
  // Group filtered levels by category
  let categoryGroups = $derived(() => {
    const groups = new Map<string, Level[]>();
    // Initialize all categories (even empty ones)
    for (const cat of categories) {
      groups.set(cat, []);
    }
    // Fill with filtered levels
    for (const level of filteredLevels) {
      const categoryLevels = groups.get(level.category) || [];
      categoryLevels.push(level);
      groups.set(level.category, categoryLevels);
    }
    return groups;
  });
  
  // Category completion stats (based on filtered levels)
  let categoryStats = $derived(() => {
    const stats = new Map<string, { completed: number; total: number }>();
    for (const category of categories) {
      const categoryLevels = categoryGroups().get(category) || [];
      const completed = categoryLevels.filter(l => completedLevels.has(l.id)).length;
      stats.set(category, { completed, total: categoryLevels.length });
    }
    return stats;
  });
  
  // Filtered levels based on search (searches filtered categories)
  let isSearching = $derived(searchQuery.trim().length > 0);
  let searchResults = $derived(
    isSearching
      ? filteredLevels.filter(l => 
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []
  );
  
  // Reference to scroll container
  let scrollContainer: HTMLDivElement;
  
  function toggleCategory(category: string) {
    const newSet = new Set(collapsedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    collapsedCategories = newSet;
  }
  
  function scrollToCategory(category: string) {
    // Expand if collapsed
    if (collapsedCategories.has(category)) {
      toggleCategory(category);
    }
    // Scroll to category section
    setTimeout(() => {
      const section = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
      if (section && scrollContainer) {
        scrollContainer.scrollTo({
          top: section.offsetTop - scrollContainer.offsetTop,
          behavior: 'smooth'
        });
      }
    }, 50);
  }
  
  function handleSelect(level: Level) {
    selectedLevel = level;
    showRecipeOfDay = false;
    searchQuery = ''; // Clear search when viewing detail
  }
  
  function handlePlay(levelId: string) {
    onselect(levelId);
    onclose();
  }
  
  function handleBack() {
    // If adding new built-in, exit that first
    if (isAddingNewBuiltin) {
      isAddingNewBuiltin = false;
      saveError = null;
      saveSuccess = false;
      return;
    }
    // If in moderator mode, exit that first
    if (isModeratorMode) {
      isModeratorMode = false;
      return;
    }
    // If player is editing their own recipe, exit edit form first
    if (isPlayerEditing) {
      isPlayerEditing = false;
      playerEditError = null;
      playerEditSuccess = false;
      return;
    }
    // If collaborator is editing, exit collab edit form first
    if (isCollabEditing) {
      closeCollabEdit();
      return;
    }
    // If edit code modal is open, close it first
    if (showEditCodeModal) {
      showEditCodeModal = false;
      return;
    }
    selectedLevel = null;
  }
  
  function handleClose() {
    // From add-new mode, exit that first
    if (isAddingNewBuiltin) {
      isAddingNewBuiltin = false;
      saveError = null;
      saveSuccess = false;
      return;
    }
    // From moderator mode, exit that first
    if (isModeratorMode) {
      isModeratorMode = false;
      return;
    }
    // From player edit mode, exit that first
    if (isPlayerEditing) {
      isPlayerEditing = false;
      playerEditError = null;
      playerEditSuccess = false;
      return;
    }
    // From collaborator edit mode, exit first
    if (isCollabEditing) {
      closeCollabEdit();
      return;
    }
    // Close edit code modal
    if (showEditCodeModal) {
      showEditCodeModal = false;
      return;
    }
    // From detail view, go back to index first
    if (selectedLevel) {
      selectedLevel = null;
      return;
    }
    // From index view, close the modal
    onclose();
  }
  
  function handleBrowseAll() {
    showRecipeOfDay = false;
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (isAddingNewBuiltin) {
        isAddingNewBuiltin = false;
        saveError = null;
        saveSuccess = false;
      } else if (isModeratorMode) {
        isModeratorMode = false;
      } else if (isPlayerEditing) {
        isPlayerEditing = false;
        playerEditError = null;
        playerEditSuccess = false;
      } else if (isCollabEditing) {
        closeCollabEdit();
      } else if (showEditCodeModal) {
        showEditCodeModal = false;
      } else if (selectedLevel) {
        selectedLevel = null;
      } else if (!showRecipeOfDay) {
        onclose();
      } else {
        showRecipeOfDay = false;
      }
    }
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      if (isAddingNewBuiltin) {
        isAddingNewBuiltin = false;
        saveError = null;
        saveSuccess = false;
        return;
      }
      if (isModeratorMode) {
        isModeratorMode = false;
        return;
      }
      if (isPlayerEditing) {
        isPlayerEditing = false;
        playerEditError = null;
        playerEditSuccess = false;
        return;
      }
      if (isCollabEditing) {
        closeCollabEdit();
        return;
      }
      if (showEditCodeModal) {
        showEditCodeModal = false;
        return;
      }
      if (selectedLevel) {
        selectedLevel = null;
      } else {
        onclose();
      }
    }
  }
  
  function handleSettingsClick() {
    // If already in moderator mode, toggle off
    if (isModeratorMode && selectedLevel) {
      isModeratorMode = false;
      return;
    }
    
    // Prompt for password and enter edit mode
    if (selectedLevel) {
      const password = prompt('Enter moderator password:');
      if (password === MODERATOR_PASSWORD) {
        isModeratorMode = true;
        saveError = null;
        saveSuccess = false;
        
        // Initialize image state - show existing image if any
        selectedImageFile = null;
        isUploadingImage = false;
        imageUploadError = null;
        imagePreviewUrl = selectedLevel.imageUrl || null;
      }
    }
  }
  
  // Secret admin access via book icon
  function handleSecretAdmin(e: MouseEvent) {
    e.stopPropagation();
    const code = prompt('');
    if (code === '4444') {
      window.open('/farmers-basket/moderate', '_blank');
    }
  }
  
  // Image handling functions for moderator mode
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
    if (imagePreviewUrl && !selectedLevel?.imageUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    imagePreviewUrl = URL.createObjectURL(file);
  }
  
  function removeImage() {
    if (imagePreviewUrl && !selectedLevel?.imageUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    selectedImageFile = null;
    imagePreviewUrl = null;
  }
  
  async function uploadImage(): Promise<string | null> {
    if (!selectedImageFile) return selectedLevel?.imageUrl || null;
    
    isUploadingImage = true;
    imageUploadError = null;
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);
      
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
  
  // Convert Level to RecipeFormData for editing
  function levelToFormData(level: Level): Partial<RecipeFormData> {
    // Use recipeIngredients if available (has real quantities), otherwise fall back to recipe array
    let ingredients;
    if (level.recipeIngredients && level.recipeIngredients.length > 0) {
      // Map recipeIngredients to form ingredients, matching with game foods from recipe array
      ingredients = level.recipeIngredients.map((ing, i) => {
        // Try to match this ingredient to a game food
        const matchedFood = level.recipe.find(food => 
          ing.name.toLowerCase().includes(food.toLowerCase()) ||
          food.toLowerCase().includes(ing.name.toLowerCase().split(' ')[0])
        ) || level.recipe[i] || '';
        return {
          id: i + 1,
          name: ing.name,
          quantity: ing.quantity || '',
          gameFood: matchedFood,
          animal: level.animalSpawns[i]?.type || '',
          // Preserve existing nutrition links so the creator can see and update them
          foodWord: ing.foodWord,
          ndbNo: ing.ndbNo,
          portionDesc: ing.portionDesc,
          portionGrams: ing.portionGrams,
          servingCount: ing.servingCount
        };
      });
    } else {
      // Fallback: convert recipe foods to ingredients
      ingredients = level.recipe.map((food, i) => ({
        id: i + 1,
        name: food,
        quantity: '1',
        gameFood: food,
        animal: level.animalSpawns[i]?.type || ''
      }));
    }
    
    return {
      recipeName: level.name,
      category: level.category,
      dietaryCategory: level.dietaryCategory,
      prepTime: level.prepTime || '',
      servings: level.servings || '',
      ingredients,
      instructions: (level.recipeInstructions || []).map((text, i) => ({
        id: i + 1,
        text
      }))
    };
  }
  
  // Handle moderator save
  async function handleModeratorSave(data: RecipeFormData) {
    if (!selectedLevel) return;
    
    isSaving = true;
    saveError = null;
    
    try {
      // Upload image if a new one was selected
      let imageUrl = selectedLevel.imageUrl;
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
      
      // Build the updates
      const gameFoods = data.ingredients
        .filter(i => i.gameFood)
        .map(i => i.gameFood) as string[];
      
      const animalSpawns = data.ingredients
        .filter(i => i.gameFood && i.animal)
        .map((ing, i) => ({
          type: ing.animal as string,
          delay: (i + 1) * 2000  // Staggered delays
        }));
      
      // Default spawn if none
      if (animalSpawns.length === 0 && gameFoods.length > 0) {
        animalSpawns.push({ type: 'rabbit', delay: 3000 });
      }
      
      // Check if this is a community recipe (id starts with 'recipe-')
      const isCommunityRecipe = selectedLevel.isCommunityRecipe || selectedLevel.id.startsWith('recipe-');
      
      let res;
      if (isCommunityRecipe) {
        // Use moderate API for community recipes
        res = await fetch('/api/recipes/moderate', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedLevel.id,
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
              instructions: data.instructions.map(i => i.text),
              animalSpawns: animalSpawns.map(s => ({ type: s.type, delay: s.delay / 1000 })),
              imageUrl
            },
            editedBy: 'Moderator'
          })
        });
      } else {
        // Use builtin API for built-in recipes
        res = await fetch('/api/recipes/builtin', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedLevel.id,
            updates: {
              name: data.recipeName,
              category: data.category,
              dietaryCategory: data.dietaryCategory,
              prepTime: data.prepTime,
              servings: data.servings,
              recipe: gameFoods,
              animalSpawns,
              recipeInstructions: data.instructions.map(i => i.text),
              recipeIngredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
                name: i.name,
                quantity: i.quantity || ''
              })),
              imageUrl
            },
            editedBy: 'Moderator'
          })
        });
      }
      
      if (!res.ok) throw new Error('Failed to save');
      
      // Clear override cache so changes take effect
      clearOverrideCache();
      
      // Notify parent to reload levels
      if (onLevelsUpdated) {
        await onLevelsUpdated();
      }
      
      saveSuccess = true;
      setTimeout(() => {
        saveSuccess = false;
        isModeratorMode = false;
      }, 1500);
    } catch (err) {
      saveError = err instanceof Error ? err.message : 'Failed to save';
    } finally {
      isSaving = false;
    }
  }
  
  // Handle cancel from moderator form
  function handleModeratorCancel() {
    isModeratorMode = false;
    saveError = null;
    saveSuccess = false;
  }

  // Open the "Add New Built-In Recipe" form (prompts for moderator password)
  function handleAddNewBuiltinClick() {
    const password = prompt('Enter moderator password:');
    if (password === MODERATOR_PASSWORD) {
      isAddingNewBuiltin = true;
      saveError = null;
      saveSuccess = false;
      selectedImageFile = null;
      imagePreviewUrl = null;
      isUploadingImage = false;
      imageUploadError = null;
    }
  }

  // Handle save of a brand-new built-in recipe
  async function handleAddNewBuiltinSave(data: RecipeFormData) {
    isSaving = true;
    saveError = null;

    try {
      // Upload image if one was selected
      let imageUrl: string | undefined;
      if (selectedImageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (imageUploadError) {
          saveError = imageUploadError;
          isSaving = false;
          return;
        }
      }

      const gameFoods = data.ingredients
        .filter(i => i.gameFood)
        .map(i => i.gameFood) as string[];

      const animalSpawns = data.ingredients
        .filter(i => i.gameFood && i.animal)
        .map((ing, i) => ({
          type: ing.animal as string,
          delay: (i + 1) * 2000
        }));

      if (animalSpawns.length === 0 && gameFoods.length > 0) {
        animalSpawns.push({ type: 'rabbit', delay: 3000 });
      }

      const res = await fetch('/api/recipes/builtin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe: {
            name: data.recipeName,
            category: data.category,
            dietaryCategory: data.dietaryCategory,
            prepTime: data.prepTime,
            servings: data.servings,
            recipe: gameFoods,
            animalSpawns,
            recipeInstructions: data.instructions.map(i => i.text),
            recipeIngredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
              name: i.name,
              quantity: i.quantity || ''
            })),
            imageUrl
          }
        })
      });

      if (!res.ok) throw new Error('Failed to save');

      clearOverrideCache();
      if (onLevelsUpdated) {
        await onLevelsUpdated();
      }

      saveSuccess = true;
      setTimeout(() => {
        saveSuccess = false;
        isAddingNewBuiltin = false;
      }, 1500);
    } catch (err) {
      saveError = err instanceof Error ? err.message : 'Failed to save';
    } finally {
      isSaving = false;
    }
  }

  // Handle cancel from add-new form
  function handleAddNewBuiltinCancel() {
    isAddingNewBuiltin = false;
    saveError = null;
    saveSuccess = false;
  }

  // Handle edit icon click — creator gets edit form, non-creator gets edit code modal
  async function handleEditIconClick(level: Level, e: MouseEvent) {
    e.stopPropagation();
    if (!level.isCommunityRecipe) return;
    selectedLevel = level;
    showRecipeOfDay = false;
    searchQuery = '';
    if (myRecipeIds.includes(level.id) || (currentPlayerId && level.submittedBy === currentPlayerId)) {
      playerEditError = null;
      playerEditSuccess = false;
      playerDraftError = null;
      playerDraftSuccess = false;
      selectedImageFile = null;
      imageUploadError = null;
      isUploadingImage = false;
      imagePreviewUrl = level.imageUrl || null;
      creatorEditCode = null;
      editCodeCopied = false;
      creatorDraft = null;
      creatorDraftUpdatedAt = null;
      creatorDraftIsOwn = false;
      // Load draft first so creatorInitialData is ready before form mounts
      await handleCheckCreatorDraft(level.id);
      isPlayerEditing = true;
      handleLoadCreatorEditCode(level.id);
      // Clear the unseen badge immediately
      unseenDraftIds = new Set([...unseenDraftIds].filter(id => id !== level.id));
    } else {
      showEditCodeModal = true;
      editCodeInput = '';
      editCodeError = '';
      editCodeValidated = false;
    }
  }

  // Handle player save — uses /api/recipes/my PATCH (same as my-recipes page)
  async function handlePlayerSave(data: RecipeFormData) {
    if (!selectedLevel) return;
    playerEditSaving = true;
    playerEditError = null;

    try {
      let imageUrl = selectedLevel.imageUrl;
      if (selectedImageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (imageUploadError) {
          playerEditError = imageUploadError;
          playerEditSaving = false;
          return;
        }
      } else if (!imagePreviewUrl) {
        imageUrl = undefined;
      }

      const updates: Record<string, unknown> = {
        recipeName: data.recipeName,
        category: data.category,
        dietaryCategory: data.dietaryCategory,
        prepTime: data.prepTime,
        servings: data.servings,
        ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
          name: i.name,
          quantity: i.quantity,
          // Preserve nutrition links
          ...(i.foodWord ? {
            foodWord: i.foodWord,
            ndbNo: i.ndbNo,
            portionDesc: i.portionDesc,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount
          } : {})
        })),
        instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text)
      };

      if (imageUrl !== undefined) updates.imageUrl = imageUrl;

      const res = await fetch('/api/recipes/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLevel.id, updates })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save');
      }

      clearOverrideCache();
      if (onLevelsUpdated) await onLevelsUpdated();

      playerEditSuccess = true;
      setTimeout(() => {
        playerEditSuccess = false;
        isPlayerEditing = false;
      }, 2000);
    } catch (err) {
      playerEditError = err instanceof Error ? err.message : 'Failed to save';
    } finally {
      playerEditSaving = false;
    }
  }

  function handlePlayerEditCancel() {
    isPlayerEditing = false;
    playerEditError = null;
    playerEditSuccess = false;
    playerDraftError = null;
    playerDraftSuccess = false;
    creatorEditCode = null;
    editCodeCopied = false;
  }

  // Creator saves their own draft (no submission for approval)
  async function handlePlayerSaveDraft(data: RecipeFormData) {
    if (!selectedLevel || !currentPlayerId) return;
    playerDraftSaving = true;
    playerDraftError = null;
    try {
      const draftData = {
        recipeName: data.recipeName,
        category: data.category,
        dietaryCategory: data.dietaryCategory,
        prepTime: data.prepTime,
        servings: data.servings,
        linkMode: data.linkMode ?? 'ingredient',
        ...(data.dishLink ? { dishLink: data.dishLink } : {}),
        ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
          name: i.name,
          quantity: i.quantity,
          ...(i.foodWord ? {
            foodWord: i.foodWord,
            ndbNo: i.ndbNo,
            portionDesc: i.portionDesc,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount
          } : {}),
          ...(i.exempt ? { exempt: true } : {})
        })),
        instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text)
      };
      const res = await fetch('/api/recipes/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: selectedLevel.id, playerId: currentPlayerId, draftData })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save draft');
      }
      const result = await res.json().catch(() => ({}));
      // Update selectedLevel.nutritionJson in-place so the 🔬 line shows immediately
      if (result.nutritionJson && selectedLevel) {
        selectedLevel = { ...selectedLevel, nutritionJson: result.nutritionJson };
      }
      // Update local draft state so a re-open auto-fills
      creatorDraft = draftData as Record<string, unknown>;
      creatorDraftIsOwn = true;
      playerDraftSuccess = true;
      setTimeout(() => { playerDraftSuccess = false; }, 3000);
    } catch (err) {
      playerDraftError = err instanceof Error ? err.message : 'Failed to save draft';
    } finally {
      playerDraftSaving = false;
    }
  }

  async function handleLoadCreatorEditCode(recipeId: string) {
    if (!currentPlayerId) return;
    try {
      const res = await fetch(`/api/recipes/edit-code?recipeId=${recipeId}&playerId=${currentPlayerId}`);
      if (res.ok) {
        const data = await res.json();
        creatorEditCode = data.code ?? null;
      }
    } catch { /* non-critical */ }
  }

  async function handleGenerateCreatorCode() {
    if (!selectedLevel || !currentPlayerId) return;
    editCodeGenerating = true;
    try {
      const res = await fetch('/api/recipes/edit-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: selectedLevel.id, playerId: currentPlayerId })
      });
      if (res.ok) {
        const data = await res.json();
        creatorEditCode = data.code;
      }
    } finally {
      editCodeGenerating = false;
    }
  }

  async function handleRevokeCreatorCode() {
    if (!selectedLevel || !currentPlayerId) return;
    editCodeRevoking = true;
    try {
      const res = await fetch('/api/recipes/edit-code', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: selectedLevel.id, playerId: currentPlayerId })
      });
      if (res.ok) creatorEditCode = null;
    } finally {
      editCodeRevoking = false;
    }
  }

  function handleCopyCreatorCode() {
    if (!creatorEditCode) return;
    navigator.clipboard.writeText(creatorEditCode).then(() => {
      editCodeCopied = true;
      setTimeout(() => { editCodeCopied = false; }, 2000);
    });
  }

  async function handleValidateEditCode() {
    if (!editCodeInput.trim()) return;
    editCodeValidating = true;
    editCodeError = '';
    try {
      const res = await fetch('/api/recipes/edit-code/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editCodeInput.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        editCodeValidated = true;
        collabRecipeId = data.recipeId;
        collabValidatedCode = editCodeInput.trim().toUpperCase();
        // Close the modal and open the collab edit form
        showEditCodeModal = false;
        isCollabEditing = true;
        collabEditError = null;
        collabEditSuccess = false;
        collabEditSaving = false;
        // Load any existing draft for this recipe
        handleLoadCollabDraft();
      } else {
        const data = await res.json().catch(() => ({}));
        editCodeError = data.error || 'Invalid edit code';
      }
    } catch {
      editCodeError = 'Could not verify code';
    } finally {
      editCodeValidating = false;
    }
  }

  // Load any existing draft so collaborator sees latest state
  async function handleLoadCollabDraft() {
    if (!collabRecipeId || !collabValidatedCode) return;
    try {
      const res = await fetch(
        `/api/recipes/draft?recipeId=${collabRecipeId}&code=${collabValidatedCode}`
      );
      if (res.ok) {
        const data = await res.json();
        collabDraft = data.draft ?? null;
        collabKnownDraftTimestamp = data.draftUpdatedAt ?? null;
        collabDraftChangedWhileEditing = false;
        startCollabPoll();
      }
    } catch { /* non-critical */ }
  }

  function startCollabPoll() {
    stopCollabPoll();
    collabPollInterval = setInterval(async () => {
      if (!collabRecipeId || !collabValidatedCode) return;
      try {
        const res = await fetch(
          `/api/recipes/draft?recipeId=${collabRecipeId}&code=${collabValidatedCode}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const serverTimestamp: string | null = data.draftUpdatedAt ?? null;
        if (serverTimestamp && serverTimestamp !== collabKnownDraftTimestamp) {
          collabDraftChangedWhileEditing = true;
          stopCollabPoll();
        }
      } catch { /* non-critical */ }
    }, 12000);
  }

  function stopCollabPoll() {
    if (collabPollInterval !== null) {
      clearInterval(collabPollInterval);
      collabPollInterval = null;
    }
  }

  function closeCollabEdit() {
    isCollabEditing = false;
    collabEditError = null;
    collabEditSuccess = false;
    collabDraft = null;
    collabDraftChangedWhileEditing = false;
    stopCollabPoll();
  }

  onDestroy(() => {
    stopCollabPoll();
  });

  // Save collaborator draft
  async function handleCollabSave(data: RecipeFormData) {
    if (!collabRecipeId || !collabValidatedCode) return;
    collabEditSaving = true;
    collabEditError = null;
    try {
      const draftData = {
        recipeName: data.recipeName,
        category: data.category,
        dietaryCategory: data.dietaryCategory,
        prepTime: data.prepTime,
        servings: data.servings,
        ingredients: data.ingredients.filter(i => i.name.trim()).map(i => ({
          name: i.name,
          quantity: i.quantity,
          ...(i.foodWord ? {
            foodWord: i.foodWord,
            ndbNo: i.ndbNo,
            portionDesc: i.portionDesc,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount
          } : {})
        })),
        instructions: data.instructions.filter(i => i.text.trim()).map(i => i.text)
      };

      const res = await fetch('/api/recipes/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: collabRecipeId,
          code: collabValidatedCode,
          draftData
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save draft');
      }

      collabEditSuccess = true;
      setTimeout(() => { collabEditSuccess = false; }, 3000);
      // Refresh timestamp baseline so poller knows what we just saved
      handleLoadCollabDraft();
    } catch (err) {
      collabEditError = err instanceof Error ? err.message : 'Failed to save draft';
    } finally {
      collabEditSaving = false;
    }
  }

  function handleCollabCancel() {
    closeCollabEdit();
  }

  // Load the collaborator draft into the creator's form
  async function handleLoadCreatorDraft() {
    if (!selectedLevel || !currentPlayerId) return;
    creatorDraftLoadingIntoForm = true;
    try {
      const res = await fetch(
        `/api/recipes/draft?recipeId=${selectedLevel.id}&playerId=${currentPlayerId}`
      );
      if (res.ok) {
        const data = await res.json();
        creatorDraft = data.draft ?? null;
        creatorDraftUpdatedAt = data.draftUpdatedAt ?? null;
      }
    } catch { /* non-critical */ }
    creatorDraftLoadingIntoForm = false;
    // Mark as seen
    if (currentPlayerId) {
      fetch('/api/recipes/draft', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: selectedLevel.id, playerId: currentPlayerId })
      }).catch(() => {});
    }
  }

  // Check for unseen draft when creator opens edit view
  async function handleCheckCreatorDraft(recipeId: string) {
    if (!currentPlayerId) return;
    creatorDraftLoading = true;
    try {
      const res = await fetch(
        `/api/recipes/draft?recipeId=${recipeId}&playerId=${currentPlayerId}`
      );
      if (res.ok) {
        const data = await res.json();
        creatorDraft = data.draft ?? null;
        creatorDraftUpdatedAt = data.draftUpdatedAt ?? null;
        creatorDraftIsOwn = !!(data.draftIsCreatorDraft);
      }
    } catch { /* non-critical */ }
    creatorDraftLoading = false;
  }

  // Creator discards the collaborator draft
  async function handleDiscardCreatorDraft() {
    if (!selectedLevel || !currentPlayerId) return;
    try {
      await fetch('/api/recipes/draft', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: selectedLevel.id, playerId: currentPlayerId })
      });
      creatorDraft = null;
      creatorDraftUpdatedAt = null;
    } catch { /* non-critical */ }
  }

  // Derive initial form data for collaborator: use draft if available, else live level
  let collabDraft = $state<Record<string, unknown> | null>(null);

  let collabInitialData = $derived((): Partial<RecipeFormData> => {
    if (!selectedLevel) return {};
    if (collabDraft) {
      // Map draft back to RecipeFormData shape
      const d = collabDraft as {
        recipeName?: string;
        category?: string;
        dietaryCategory?: string;
        prepTime?: string;
        servings?: string;
        ingredients?: { name: string; quantity: string; foodWord?: string; ndbNo?: string; portionDesc?: string; portionGrams?: number; servingCount?: number }[];
        instructions?: string[];
      };
      return {
        recipeName: d.recipeName || selectedLevel.name,
        category: d.category || selectedLevel.category,
        dietaryCategory: (d.dietaryCategory as DietaryCategory) || selectedLevel.dietaryCategory,
        prepTime: d.prepTime || selectedLevel.prepTime || '',
        servings: d.servings || selectedLevel.servings || '',
        ingredients: (d.ingredients || []).map((ing, i) => ({
          id: i + 1,
          name: ing.name,
          quantity: ing.quantity || '',
          gameFood: selectedLevel.recipe[i] || '',
          animal: selectedLevel.animalSpawns[i]?.type || '',
          foodWord: ing.foodWord,
          ndbNo: ing.ndbNo,
          portionDesc: ing.portionDesc,
          portionGrams: ing.portionGrams,
          servingCount: ing.servingCount
        })),
        instructions: (d.instructions || []).map((text, i) => ({ id: i + 1, text }))
      };
    }
    return levelToFormData(selectedLevel);
  });

  // Derive initial form data for creator: auto-load their own saved draft if present
  let creatorInitialData = $derived((): Partial<RecipeFormData> => {
    if (!selectedLevel) return {};
    if (creatorDraft && creatorDraftIsOwn) {
      const d = creatorDraft as {
        recipeName?: string;
        category?: string;
        dietaryCategory?: string;
        prepTime?: string;
        servings?: string;
        ingredients?: { name: string; quantity: string; foodWord?: string; ndbNo?: string; portionDesc?: string; portionGrams?: number; servingCount?: number }[];
        instructions?: string[];
      };
      return {
        recipeName: d.recipeName || selectedLevel.name,
        category: d.category || selectedLevel.category,
        dietaryCategory: (d.dietaryCategory as DietaryCategory) || selectedLevel.dietaryCategory,
        prepTime: d.prepTime || selectedLevel.prepTime || '',
        servings: d.servings || selectedLevel.servings || '',
        ingredients: (d.ingredients || []).map((ing, i) => ({
          id: i + 1,
          name: ing.name,
          quantity: ing.quantity || '',
          gameFood: selectedLevel.recipe[i] || '',
          animal: selectedLevel.animalSpawns[i]?.type || '',
          foodWord: ing.foodWord,
          ndbNo: ing.ndbNo,
          portionDesc: ing.portionDesc,
          portionGrams: ing.portionGrams,
          servingCount: ing.servingCount
        })),
        instructions: (d.instructions || []).map((text, i) => ({ id: i + 1, text }))
      };
    }
    return levelToFormData(selectedLevel);
  });

  let currentCategory = $derived(
    currentLevelId 
      ? levels.find(l => l.id === currentLevelId)?.category ?? '' 
      : ''
  );
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Recipe Book">
  <div class="recipe-book" class:detail-view={selectedLevel}>
    <header class="book-header">
      {#if selectedLevel || isAddingNewBuiltin}
        <button class="back-btn" onclick={handleBack} aria-label="Back to index">
          ← Back
        </button>
      {:else}
        <h2><button class="secret-admin-btn" onclick={handleSecretAdmin}>📖</button> Recipe Book</h2>
      {/if}
      <div class="header-actions">
        <span class="level-count">{completedLevels.size}/{filteredLevels.length} ✓</span>
        {#if onshare}
          <button class="share-btn" onclick={onshare} aria-label="Share a recipe">
            📝 Share
          </button>
        {/if}
        {#if !selectedLevel && !isAddingNewBuiltin}
          <button class="add-builtin-btn" onclick={handleAddNewBuiltinClick} aria-label="Add new built-in recipe">➕</button>
        {/if}
        {#if selectedLevel}
          <button class="settings-btn" onclick={handleSettingsClick} aria-label="Edit recipe">⚙️</button>
        {/if}
        <button class="close-btn" onclick={onclose} aria-label="Close">✕</button>
      </div>
    </header>
    
    {#if showDietarySelect && !selectedLevel}
      <!-- DIETARY PREFERENCE SELECTOR (first-time users or change preference) -->
      <div class="dietary-select">
        <div class="dietary-header">
          <h3>🥗 Choose Your Food Preference</h3>
          <p>Select what kinds of foods you'd like in your recipes</p>
        </div>
        
        <div class="dietary-grid">
          {#each DIETARY_CATEGORIES as diet}
            <button
              class="dietary-btn"
              class:selected={dietaryPreference === diet.id}
              onclick={() => setDietaryPreference(diet.id)}
            >
              <span class="dietary-emoji">{diet.emoji}</span>
              <span class="dietary-name">{diet.name}</span>
              <span class="dietary-desc">{diet.description}</span>
            </button>
          {/each}
        </div>
        
        <p class="dietary-hint">You can change this anytime in the Recipe Book</p>
      </div>
    {:else if showRecipeOfDay && !selectedLevel && recipeOfTheDay()}
      <!-- RECIPE OF THE DAY VIEW -->
      {@const todaysRecipe = recipeOfTheDay()}
      {@const currentDiet = DIETARY_CATEGORIES.find(d => d.id === dietaryPreference)}
      <div class="recipe-of-day">
        <button class="diet-badge" onclick={() => showDietarySelect = true} title="Change food preference">
          {currentDiet?.emoji} {currentDiet?.name}
        </button>
        <div class="cotd-badge">🌟 Recipe of the Day</div>
        
        <div class="cotd-card">
          <h3 class="cotd-name">{todaysRecipe.name}</h3>
          <span class="cotd-category">{todaysRecipe.category}</span>
          
          {#if todaysRecipe.imageUrl}
            <div class="cotd-image-container">
              <img 
                src={todaysRecipe.imageUrl} 
                alt={todaysRecipe.name}
                class="cotd-image"
                loading="lazy"
              />
            </div>
          {/if}
          
          <div class="cotd-ingredients">
            {#each todaysRecipe.recipe as food}
              <span class="cotd-ingredient" title={food}><FoodIcon {food} size={28} /></span>
            {/each}
          </div>
          
          <div class="cotd-actions">
            <button 
              class="cotd-play-btn"
              onclick={() => handleSelect(todaysRecipe)}
            >
              ▶ Make This Recipe
            </button>
            <button 
              class="cotd-browse-btn"
              onclick={handleBrowseAll}
            >
              Browse All Recipes
            </button>
          </div>
        </div>
      </div>
    {:else if selectedLevel}
      <!-- DETAIL VIEW: Full recipe card or Moderator Edit Form -->
      {@const isCompleted = completedLevels.has(selectedLevel.id)}
      {@const isCurrent = selectedLevel.id === currentLevelId}
      {@const canReadRecipe = isCompleted || canReadAllRecipes}
      
      {#if isModeratorMode}
        <!-- MODERATOR EDIT MODE -->
        <div class="moderator-edit-view">
          <div class="mod-header">
            <h3>✏️ Edit Recipe: {selectedLevel.name}</h3>
            {#if saveSuccess}
              <span class="save-success">✓ Saved!</span>
            {/if}
          </div>
          
          <div class="mod-form-container">
            <!-- Image Upload Section -->
            <div class="mod-image-section">
              <label class="mod-section-label">📷 Recipe Photo</label>
              
              {#if imagePreviewUrl}
                <div class="mod-image-preview-container">
                  <img src={imagePreviewUrl} alt="Recipe preview" class="mod-image-preview" />
                  <button 
                    type="button" 
                    class="mod-remove-image-btn"
                    onclick={removeImage}
                    disabled={isSaving || isUploadingImage}
                  >
                    ✕ Remove
                  </button>
                </div>
              {:else}
                <label class="mod-image-picker">
                  <input 
                    type="file" 
                    accept="image/*"
                    onchange={handleImageSelect}
                    disabled={isSaving || isUploadingImage}
                  />
                  <span class="mod-picker-content">
                    <span class="mod-picker-icon">📷</span>
                    <span class="mod-picker-text">Add Photo</span>
                    <span class="mod-picker-hint">Max 5MB</span>
                  </span>
                </label>
              {/if}
              
              {#if imageUploadError}
                <p class="mod-image-error">{imageUploadError}</p>
              {/if}
              
              {#if isUploadingImage}
                <p class="mod-image-uploading">Uploading image...</p>
              {/if}
            </div>
            
            <RecipeForm
              moderatorMode={true}
              initialData={levelToFormData(selectedLevel)}
              onsubmit={handleModeratorSave}
              oncancel={handleModeratorCancel}
              submitLabel="💾 Save Changes"
              submitting={isSaving}
              errorMessage={saveError || ''}
            />
          </div>
        </div>
      {:else if isPlayerEditing}
        <!-- PLAYER EDIT MODE (recipe creator editing their own approved recipe) -->
        <div class="moderator-edit-view">
          <div class="mod-header">
            <h3>✏️ Edit: {selectedLevel.name}</h3>
            {#if playerEditSuccess}
              <span class="save-success">✓ Submitted for re-approval!</span>
            {/if}
            {#if selectedLevel.nutritionJson}
              <p class="recipe-nutrition recipe-nutrition-edit">🔬 Per serving: {selectedLevel.nutritionJson.perServing.cal} cal&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.pro}g protein&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.fat}g fat&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.carb}g carbs&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.fib}g fiber&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.sug}g sugar&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.h2o}g water</p>
            {/if}
          </div>

          <div class="mod-form-container">
            <!-- Image Upload Section -->
            <div class="mod-image-section">
              <label class="mod-section-label">📷 Recipe Photo</label>

              {#if imagePreviewUrl}
                <div class="mod-image-preview-container">
                  <img src={imagePreviewUrl} alt="Recipe preview" class="mod-image-preview" />
                  <button
                    type="button"
                    class="mod-remove-image-btn"
                    onclick={removeImage}
                    disabled={playerEditSaving || isUploadingImage}
                  >
                    ✕ Remove
                  </button>
                </div>
              {:else}
                <label class="mod-image-picker">
                  <input
                    type="file"
                    accept="image/*"
                    onchange={handleImageSelect}
                    disabled={playerEditSaving || isUploadingImage}
                  />
                  <span class="mod-picker-content">
                    <span class="mod-picker-icon">📷</span>
                    <span class="mod-picker-text">Add Photo</span>
                    <span class="mod-picker-hint">Max 5MB</span>
                  </span>
                </label>
              {/if}

              {#if imageUploadError}
                <p class="mod-image-error">{imageUploadError}</p>
              {/if}

              {#if isUploadingImage}
                <p class="mod-image-uploading">Uploading image...</p>
              {/if}
            </div>

            <RecipeForm
              initialData={creatorInitialData()}
              onsubmit={handlePlayerSave}
              oncancel={handlePlayerEditCancel}
              submitting={playerEditSaving || playerDraftSaving}
              errorMessage={playerEditError || playerDraftError || ''}
            >
              {#snippet customActions({ formData, isValid })}
                <div class="creator-form-actions">
                  <button type="button" class="cancel-btn" onclick={handlePlayerEditCancel}>Cancel</button>
                  <button
                    type="button"
                    class="creator-save-draft-btn"
                    disabled={playerDraftSaving || playerEditSaving}
                    onclick={() => handlePlayerSaveDraft(formData)}
                  >
                    {playerDraftSaving ? '⏳ Saving...' : playerDraftSuccess ? '✓ Draft saved!' : '💾 Save Draft'}
                  </button>
                  <button
                    type="submit"
                    class="creator-submit-btn"
                    disabled={playerEditSaving || playerDraftSaving || !isValid}
                  >
                    {playerEditSaving ? '⏳ Submitting...' : '📤 Submit for Re-approval'}
                  </button>
                </div>
              {/snippet}
            </RecipeForm>

            <!-- Collaborator Edit Code -->
            <div class="creator-edit-code-section">
              <p class="creator-code-label">🔑 Collaborator Edit Code</p>
              <p class="creator-code-hint">Share this code so another player can suggest changes. Only you can submit for approval.</p>
              {#if creatorEditCode}
                <div class="creator-code-display">
                  <span class="creator-code-value">{creatorEditCode}</span>
                  <button class="copy-creator-code-btn" onclick={handleCopyCreatorCode}>
                    {editCodeCopied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <button
                  class="revoke-code-btn"
                  onclick={handleRevokeCreatorCode}
                  disabled={editCodeRevoking}
                >
                  {editCodeRevoking ? 'Revoking...' : 'Revoke Code'}
                </button>
              {:else}
                <button
                  class="gen-creator-code-btn"
                  onclick={handleGenerateCreatorCode}
                  disabled={editCodeGenerating}
                >
                  {editCodeGenerating ? 'Generating...' : 'Generate Edit Code'}
                </button>
              {/if}
            </div>

            <!-- Creator Own Draft Notice -->
            {#if creatorDraft && creatorDraftIsOwn}
              <div class="creator-own-draft-notice">
                <span>💾 Draft restored</span>
                {#if creatorDraftUpdatedAt}<span class="creator-own-draft-time">· saved {new Date(creatorDraftUpdatedAt).toLocaleString()}</span>{/if}
                <button class="creator-own-draft-discard" onclick={handleDiscardCreatorDraft}>Discard draft</button>
              </div>
            {/if}

            <!-- Collaborator Draft Banner (only shown when a collaborator saved the draft) -->
            {#if creatorDraft && !creatorDraftIsOwn && !creatorDraftLoading}
              <div class="collab-draft-banner">
                <span class="collab-draft-icon">📝</span>
                <div class="collab-draft-text">
                  <span class="collab-draft-title">Draft saved by a collaborator</span>
                  {#if creatorDraftUpdatedAt}
                    <span class="collab-draft-time">{new Date(creatorDraftUpdatedAt).toLocaleString()}</span>
                  {/if}
                </div>
                <div class="collab-draft-actions">
                  <button class="load-draft-btn" onclick={handleLoadCreatorDraft} disabled={creatorDraftLoadingIntoForm}>
                    {creatorDraftLoadingIntoForm ? 'Loading...' : 'Load Draft'}
                  </button>
                  <button class="discard-draft-btn" onclick={handleDiscardCreatorDraft}>Discard</button>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {:else if isCollabEditing}
        <!-- COLLABORATOR EDIT MODE -->
        <div class="moderator-edit-view">
          <div class="mod-header">
            <h3>✏️ Edit Draft: {selectedLevel.name}</h3>
            {#if collabEditSuccess}
              <span class="save-success">✓ Draft saved!</span>
            {/if}
          </div>
          {#if collabDraftChangedWhileEditing}
            <div class="collab-updated-banner">
              <span>Someone saved changes while you were editing.</span>
              <button class="load-updated-btn" onclick={() => handleLoadCollabDraft()}>Load their version</button>
            </div>
          {/if}
          <p class="collab-edit-note">Your changes will be saved as a draft. The recipe creator reviews and submits for approval.</p>

          <div class="mod-form-container">
            <RecipeForm
              initialData={collabInitialData()}
              onsubmit={handleCollabSave}
              oncancel={handleCollabCancel}
              submitLabel={collabEditSaving ? '⏳ Saving...' : '💾 Save Draft'}
              submitting={collabEditSaving}
              errorMessage={collabEditError || ''}
            />
          </div>
        </div>
      {:else}
        <!-- NORMAL RECIPE VIEW -->
        <div class="detail-card">
          {#if isCurrent}
            <div class="current-badge">Now Playing</div>
          {/if}
          
          <div class="recipe-header">
            <span class="recipe-number">#{selectedLevel.levelNum}</span>
            <h3 class="recipe-name">{selectedLevel.name}</h3>
            <span class="recipe-category">{selectedLevel.category}</span>
          </div>
          
          {#if selectedLevel.imageUrl}
            <div class="recipe-image-container">
              <img 
                src={selectedLevel.imageUrl} 
                alt={selectedLevel.name}
                class="recipe-image"
                loading="lazy"
              />
            </div>
          {/if}
          
          <div class="ingredients">
            <span class="ingredients-label">Ingredients:</span>
            <div class="ingredient-icons">
              {#each selectedLevel.recipe as food}
                <span class="ingredient" title={food}><FoodIcon {food} size={28} /></span>
              {/each}
            </div>
          </div>
          
          {#if canReadRecipe && selectedLevel.recipeInstructions}
            <div class="recipe-details">
              <div class="recipe-meta">
                {#if selectedLevel.prepTime}<span>⏱️ {selectedLevel.prepTime}</span>{/if}
                {#if selectedLevel.servings}<span>🍽️ {selectedLevel.servings}</span>{/if}
              </div>
              
              {#if selectedLevel.recipeIngredients && selectedLevel.recipeIngredients.length > 0}
                <div class="full-ingredients">
                  <span class="ingredients-label">📝 Full Ingredient List:</span>
                  <ul>
                    {#each selectedLevel.recipeIngredients.filter(i => !i.isDish) as ing}
                      <li>{ing.quantity ? `${ing.quantity} ` : ''}{ing.name}</li>
                    {/each}
                  </ul>
                </div>
                {#if selectedLevel.nutritionJson}
                  <p class="recipe-nutrition">🔬 Per serving: {selectedLevel.nutritionJson.perServing.cal} cal&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.pro}g protein&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.fat}g fat&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.carb}g carbs&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.fib}g fiber&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.sug}g sugar&nbsp;|&nbsp;{selectedLevel.nutritionJson.perServing.h2o}g water</p>
                {/if}
              {/if}
              
              <div class="instructions">
                <span class="instructions-label">How to make:</span>
                <ol>
                  {#each selectedLevel.recipeInstructions as step}
                    <li>{step}</li>
                  {/each}
                </ol>
              </div>
            </div>
          {:else}
            <div class="locked-message">
              <span class="lock-icon">🔒</span>
              <span>Complete this recipe to unlock the instructions!</span>
            </div>
          {/if}
          
          <button class="play-btn" onclick={() => handlePlay(selectedLevel!.id)}>
            {isCurrent ? '🔄 Replay' : isCompleted ? '🎮 Replay' : '▶️ Play'}
          </button>
          {#if !canReadRecipe}
            <p class="paid-tier-note">Upgrade to a paid tier if you do not want to play the game</p>
          {/if}
        </div>
      {/if}
    {:else if isAddingNewBuiltin}
      <!-- ADD NEW BUILT-IN RECIPE MODE -->
      <div class="moderator-edit-view">
        <div class="mod-header">
          <h3>➕ Add New Built-In Recipe</h3>
          {#if saveSuccess}
            <span class="save-success">✓ Saved!</span>
          {/if}
        </div>

        <div class="mod-form-container">
          <!-- Image Upload Section -->
          <div class="mod-image-section">
            <label class="mod-section-label">📷 Recipe Photo</label>

            {#if imagePreviewUrl}
              <div class="mod-image-preview-container">
                <img src={imagePreviewUrl} alt="Recipe preview" class="mod-image-preview" />
                <button
                  type="button"
                  class="mod-remove-image-btn"
                  onclick={removeImage}
                  disabled={isSaving || isUploadingImage}
                >
                  ✕ Remove
                </button>
              </div>
            {:else}
              <label class="mod-image-picker">
                <input
                  type="file"
                  accept="image/*"
                  onchange={handleImageSelect}
                  disabled={isSaving || isUploadingImage}
                />
                <span class="mod-picker-content">
                  <span class="mod-picker-icon">📷</span>
                  <span class="mod-picker-text">Add Photo</span>
                  <span class="mod-picker-hint">Max 5MB</span>
                </span>
              </label>
            {/if}

            {#if imageUploadError}
              <p class="mod-image-error">{imageUploadError}</p>
            {/if}

            {#if isUploadingImage}
              <p class="mod-image-uploading">Uploading image...</p>
            {/if}
          </div>

          <RecipeForm
            moderatorMode={true}
            onsubmit={handleAddNewBuiltinSave}
            oncancel={handleAddNewBuiltinCancel}
            submitLabel="➕ Add Recipe"
            submitting={isSaving}
            errorMessage={saveError || ''}
          />
        </div>
      </div>
    {:else}
      <!-- Dietary Filter Strip (compact horizontal) -->
      <div class="dietary-strip">
        <div class="dietary-strip-scroll">
          {#each DIETARY_CATEGORIES as diet}
            <button
              class="diet-pill"
              class:active={dietaryPreference === diet.id}
              onclick={() => setDietaryPreference(diet.id)}
              title={diet.description}
            >
              <span class="pill-emoji">{diet.emoji}</span>
              <span class="pill-name">{diet.name}</span>
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Recipe of the Day link -->
      <button class="rotd-link" onclick={() => showRecipeOfDay = true}>
        🌟 Today's Recipe: {recipeOfTheDay()?.name}
      </button>
      
      <!-- INDEX VIEW: Category tabs + recipes -->
      <div class="index-layout">
        <!-- Side tabs for categories (like rolodex dividers) -->
        <div class="category-tabs">
          {#each categories as category (category)}
            {@const stats = categoryStats().get(category)}
            {@const isCurrentCategory = category === currentCategory}
            {@const isEmpty = stats?.total === 0}
            <button 
              class="category-tab"
              class:current={isCurrentCategory}
              class:complete={stats && stats.total > 0 && stats.completed === stats.total}
              class:empty={isEmpty}
              onclick={() => scrollToCategory(category)}
              title="{category}: {isEmpty ? 'Coming soon' : `${stats?.completed}/${stats?.total} completed`}"
            >
              <span class="category-name">{category}</span>
              {#if isEmpty}
                <span class="category-progress empty">—</span>
              {:else if stats && stats.completed === stats.total}
                <span class="category-check">✓</span>
              {:else if stats}
                <span class="category-progress">{stats.completed}/{stats.total}</span>
              {/if}
            </button>
          {/each}
        </div>
        
        <div class="main-content">
          <!-- Search bar -->
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="🔍 Search recipes..." 
              bind:value={searchQuery}
              class="search-input"
            />
          </div>
          
          <div class="rolodex-index" bind:this={scrollContainer}>
            {#if isSearching}
              <!-- Search results -->
              <div class="search-results-header">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
              {#each searchResults as level (level.id)}
                {@const isCompleted = completedLevels.has(level.id)}
                {@const isCurrent = level.id === currentLevelId}
                <div class="recipe-tab-row">
                <button 
                  class="recipe-tab"
                  class:completed={isCompleted}
                  class:current={isCurrent}
                  onclick={() => handleSelect(level)}
                >
                  <span class="tab-number">#{level.levelNum}</span>
                  <span class="tab-name">{level.name}</span>
                  <span class="tab-status">
                    {#if isCurrent}🎮{:else if isCompleted}✓{:else}🔒{/if}
                  </span>
                </button>
                {#if level.isCommunityRecipe}
                  <button class="edit-icon-btn" onclick={(e) => handleEditIconClick(level, e)} title="Edit recipe" aria-label="Edit recipe">
                    ✏️
                    {#if unseenDraftIds.has(level.id)}<span class="draft-badge"></span>{/if}
                  </button>
                {/if}
                </div>
              {/each}
              {#if searchResults.length === 0}
                <div class="no-results">No recipes found</div>
              {/if}
            {:else}
              <!-- Category sections -->
              {#each categories as category (category)}
                {@const categoryLevels = categoryGroups().get(category) || []}
                {@const stats = categoryStats().get(category)}
                {@const isCollapsed = collapsedCategories.has(category)}
                {@const isEmpty = categoryLevels.length === 0}
                <div class="category-section" id="category-{category.replace(/\s+/g, '-')}">
                  <button class="category-header" class:empty={isEmpty} onclick={() => toggleCategory(category)}>
                    <span class="category-title">
                      <span class="expand-icon">{isCollapsed ? '▶' : '▼'}</span>
                      {category}
                    </span>
                    <div class="category-stats">
                      {#if isEmpty}
                        <span class="stat-text empty">Coming soon</span>
                      {:else}
                        <span class="stat-text">{stats?.completed}/{stats?.total}</span>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            style="width: {stats && stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%"
                          ></div>
                        </div>
                      {/if}
                    </div>
                  </button>
                  
                  {#if !isCollapsed}
                    <div class="category-recipes">
                      {#if isEmpty}
                        <div class="empty-category">No recipes yet - check back soon!</div>
                      {:else}
                        {#each categoryLevels as level (level.id)}
                          {@const isCompleted = completedLevels.has(level.id)}
                          {@const isCurrent = level.id === currentLevelId}
                          <div class="recipe-tab-row">
                          <button 
                            class="recipe-tab"
                            class:completed={isCompleted}
                            class:current={isCurrent}
                            onclick={() => handleSelect(level)}
                          >
                            <span class="tab-number">#{level.levelNum}</span>
                            <span class="tab-name">{level.name}</span>
                            <span class="tab-status">
                              {#if isCurrent}🎮{:else if isCompleted}✓{:else}🔒{/if}
                            </span>
                            <span class="tab-ingredients">
                              {#each level.recipe.slice(0, 3) as food}
                                <span class="mini-emoji"><FoodIcon {food} size={14} /></span>
                              {/each}
                              {#if level.recipe.length > 3}
                                <span class="more">+{level.recipe.length - 3}</span>
                              {/if}
                          </span>
                        </button>
                        {#if level.isCommunityRecipe}
                          <button class="edit-icon-btn" onclick={(e) => handleEditIconClick(level, e)} title="Edit recipe" aria-label="Edit recipe">
                            ✏️
                            {#if unseenDraftIds.has(level.id)}<span class="draft-badge"></span>{/if}
                          </button>
                        {/if}
                        </div>
                      {/each}
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

{#if showEditCodeModal && selectedLevel}
  <div class="edit-code-overlay" role="dialog" aria-modal="true" aria-label="Edit code required">
    <div class="edit-code-modal">
      <h3>🔑 Enter Edit Code</h3>
      {#if editCodeValidated}
        <p class="edit-code-accepted">✅ Code accepted! Collaborative editing is coming soon — your access has been noted.</p>
        <div class="edit-code-actions">
          <button class="edit-code-cancel" onclick={() => { showEditCodeModal = false; editCodeValidated = false; editCodeInput = ''; }}>Close</button>
        </div>
      {:else}
        <p>Ask the recipe creator for their edit code to suggest changes.</p>
        <input
          type="text"
          class="edit-code-input"
          placeholder="Enter edit code"
          bind:value={editCodeInput}
          maxlength="10"
          oninput={() => { editCodeInput = editCodeInput.toUpperCase(); }}
        />
        {#if editCodeError}
          <p class="edit-code-error">{editCodeError}</p>
        {/if}
        <div class="edit-code-actions">
          <button class="edit-code-cancel" onclick={() => { showEditCodeModal = false; editCodeError = ''; editCodeInput = ''; }}>Cancel</button>
          <button
            class="edit-code-submit"
            onclick={handleValidateEditCode}
            disabled={editCodeValidating || !editCodeInput.trim()}
          >{editCodeValidating ? 'Checking...' : 'Continue'}</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

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
  
  .recipe-book {
    background: linear-gradient(135deg, #FDF5E6 0%, #F5DEB3 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 520px;
    max-height: 85vh;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 4px solid #8B4513;
  }
  
  .recipe-book.detail-view {
    max-width: 480px;
  }
  
  .book-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: #8B4513;
    color: white;
    gap: 12px;
  }
  
  .book-header h2 {
    margin: 0;
    font-size: 1.2rem;
    flex: 1;
  }
  
  .secret-admin-btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: default;
    font-size: inherit;
    line-height: 1;
  }
  
  .back-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .back-btn:hover {
    background: rgba(255,255,255,0.3);
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .level-count {
    font-size: 0.85rem;
    opacity: 0.9;
    background: rgba(255,255,255,0.15);
    padding: 4px 10px;
    border-radius: 12px;
  }
  
  .share-btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background 0.2s;
  }
  
  .share-btn:hover {
    background: rgba(255,255,255,0.35);
  }
  
  .header-diet-btn {
    background: rgba(255,255,255,0.25);
    border: 1px solid rgba(255,255,255,0.3);
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;
  }
  
  .header-diet-btn:hover {
    background: rgba(255,255,255,0.4);
    transform: scale(1.1);
  }
  
  .settings-btn {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.4);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    opacity: 0.6;
  }
  
  .settings-btn:hover {
    opacity: 1;
    color: rgba(255,255,255,0.8);
  }

  .add-builtin-btn {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.4);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    opacity: 0.6;
  }

  .add-builtin-btn:hover {
    opacity: 1;
    color: rgba(255,255,255,0.8);
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
  
  /* Dietary Filter Strip (compact horizontal) */
  .dietary-strip {
    width: 100%;
    background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%);
    border-bottom: 1px solid #DDD;
    padding: 8px 8px 10px 8px;
    margin-bottom: 4px;
    position: relative;
  }
  
  /* Fade hint on right edge to show scrollability */
  .dietary-strip::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 80px;
    background: linear-gradient(to right, transparent 0%, #EEEEEE 60%, #EEEEEE 100%);
    pointer-events: none;
  }
  
  .dietary-strip-scroll {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    padding-bottom: 4px;
    padding-right: 24px; /* Space for fade hint */
  }
  
  .dietary-strip-scroll::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
  
  .diet-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: white;
    border: 1.5px solid #DDD;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }
  
  .diet-pill:hover {
    border-color: #8B4513;
    color: #8B4513;
  }
  
  .diet-pill.active {
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    border-color: #8B4513;
    color: white;
    box-shadow: 0 2px 4px rgba(139, 69, 19, 0.3);
  }
  
  .pill-emoji {
    font-size: 0.9rem;
  }
  
  .pill-name {
    font-size: 0.7rem;
    letter-spacing: 0.02em;
  }
  
  @media (max-width: 480px) {
    .dietary-strip {
      padding: 4px 6px;
    }
    
    .diet-pill {
      padding: 3px 8px;
    }
    
    .pill-name {
      font-size: 0.65rem;
    }
  }
  
  /* Recipe of the Day link in index view */
  .rotd-link {
    display: block;
    width: 100%;
    padding: 8px 16px;
    background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
    border: none;
    border-bottom: 2px solid #DEB887;
    color: #8B4513;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }
  
  .rotd-link:hover {
    background: linear-gradient(135deg, #FFECB3 0%, #FFE082 100%);
  }
  
  /* INDEX LAYOUT: Side tabs + main content */
  .index-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  /* Category tabs (side rolodex dividers) */
  .category-tabs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 0 8px 4px;
    background: #D2B48C;
    overflow-y: auto;
    min-width: 120px;
    max-width: 140px;
  }
  
  .category-tab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 8px 10px;
    background: #FDF5E6;
    border: none;
    border-radius: 6px 0 0 6px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: bold;
    color: #8B4513;
    text-align: left;
    transition: all 0.15s;
    gap: 2px;
  }
  
  .category-tab:hover {
    background: #FFF8E7;
    transform: translateX(-2px);
  }
  
  .category-tab.current {
    background: #FF9800;
    color: white;
  }
  
  .category-tab.complete {
    background: #C8E6C9;
    color: #2E7D32;
  }
  
  .category-tab.empty {
    background: #f0f0f0;
    color: #999;
  }
  
  .category-tab.empty:hover {
    background: #e8e8e8;
  }
  
  .category-name {
    font-size: 0.8rem;
    line-height: 1.2;
  }
  
  .category-check {
    font-size: 0.7rem;
  }
  
  .category-progress {
    font-size: 0.65rem;
    opacity: 0.8;
  }
  
  .category-progress.empty {
    opacity: 0.5;
  }
  
  .empty-category {
    padding: 12px;
    text-align: center;
    color: #999;
    font-style: italic;
    font-size: 0.85rem;
  }
  
  .category-header.empty {
    opacity: 0.7;
  }
  
  .stat-text.empty {
    font-style: italic;
    opacity: 0.7;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* Search bar */
  .search-bar {
    padding: 10px 12px 6px;
  }
  
  .search-input {
    width: 100%;
    padding: 8px 12px;
    border: 2px solid #DEB887;
    border-radius: 8px;
    font-size: 0.95rem;
    background: white;
    box-sizing: border-box;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #8B4513;
  }
  
  .search-results-header {
    padding: 8px 12px;
    font-size: 0.85rem;
    color: #666;
    background: #FFF8E7;
    border-radius: 6px;
    margin-bottom: 6px;
  }
  
  /* INDEX VIEW: Rolodex content */
  .rolodex-index {
    flex: 1;
    overflow-y: auto;
    padding: 6px 12px 12px;
  }
  
  /* Category sections */
  .category-section {
    margin-bottom: 8px;
  }
  
  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .category-header:hover {
    filter: brightness(1.1);
  }
  
  .category-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .expand-icon {
    font-size: 0.7rem;
    width: 12px;
  }
  
  .category-stats {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .stat-text {
    font-size: 0.75rem;
    opacity: 0.9;
  }
  
  .progress-bar {
    width: 50px;
    height: 6px;
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #4CAF50;
    border-radius: 3px;
    transition: width 0.3s;
  }
  
  .category-recipes {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px 0 0 0;
  }
  
  .recipe-tab {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: white;
    border: 2px solid #DEB887;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  
  .recipe-tab:hover {
    border-color: #8B4513;
    background: #FFF8E7;
  }
  
  .recipe-tab.completed {
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    border-color: #81C784;
  }
  
  .recipe-tab.completed:hover {
    border-color: #4CAF50;
  }
  
  .recipe-tab.current {
    border-color: #FF9800;
    border-width: 3px;
    background: #FFF3E0;
  }
  
  .tab-number {
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    background: #8B4513;
    padding: 2px 6px;
    border-radius: 4px;
    min-width: 36px;
    text-align: center;
  }
  
  .recipe-tab.completed .tab-number {
    background: #4CAF50;
  }
  
  .tab-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5D4037;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .tab-status {
    font-size: 0.9rem;
    min-width: 20px;
    text-align: center;
  }
  
  .recipe-tab.completed .tab-status {
    color: #4CAF50;
    font-weight: bold;
  }
  
  .tab-ingredients {
    display: flex;
    gap: 1px;
  }
  
  .mini-emoji {
    font-size: 0.8rem;
  }
  
  .more {
    font-size: 0.65rem;
    color: #999;
    margin-left: 2px;
  }
  
  .no-results {
    text-align: center;
    padding: 30px;
    color: #999;
    font-style: italic;
  }
  
  /* MODERATOR EDIT VIEW */
  .moderator-edit-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .mod-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: linear-gradient(135deg, #E65100 0%, #FF9800 100%);
    color: white;
  }
  
  .mod-header h3 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  .save-success {
    background: #4CAF50;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: bold;
  }
  
  .mod-form-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 20px;
    background: #FFFEF5;
  }
  
  /* Moderator Image Upload Section */
  .mod-image-section {
    margin-bottom: 16px;
    padding: 12px;
    background: white;
    border-radius: 12px;
    border: 2px dashed #DDD;
  }
  
  .mod-section-label {
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
    font-size: 0.95rem;
  }
  
  .mod-image-picker {
    display: block;
    cursor: pointer;
  }
  
  .mod-image-picker input {
    display: none;
  }
  
  .mod-picker-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background: #F5F5F5;
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .mod-image-picker:hover .mod-picker-content {
    background: #EEEEEE;
  }
  
  .mod-picker-icon {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }
  
  .mod-picker-text {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }
  
  .mod-picker-hint {
    font-size: 0.75rem;
    color: #666;
    margin-top: 2px;
  }
  
  .mod-image-preview-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }
  
  .mod-image-preview {
    max-width: 100%;
    max-height: 150px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .mod-remove-image-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 4px 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .mod-remove-image-btn:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  .mod-image-error {
    color: #E53935;
    font-size: 0.85rem;
    margin: 6px 0 0;
  }
  
  .mod-image-uploading {
    color: #1976D2;
    font-size: 0.85rem;
    margin: 6px 0 0;
  }
  
  /* DETAIL VIEW: Recipe card */
  .detail-card {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
  }
  
  .current-badge {
    position: absolute;
    top: 8px;
    right: 20px;
    background: #FF9800;
    color: white;
    padding: 4px 12px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .recipe-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .recipe-number {
    background: #8B4513;
    color: white;
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .recipe-name {
    margin: 0;
    font-size: 1.4rem;
    color: #5D4037;
    flex: 1;
  }
  
  .recipe-category {
    font-size: 0.8rem;
    color: #888;
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 12px;
  }
  
  /* Recipe Image (community recipes) */
  .recipe-image-container {
    width: 100%;
    border-radius: 8px;
    background: #f5f5f5;
    margin: -4px 0 4px;
  }

  .recipe-image {
    width: 100%;
    max-height: 160px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }

  .ingredients {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    background: white;
    border-radius: 12px;
    border: 2px solid #DEB887;
  }
  
  .ingredients-label {
    font-size: 0.85rem;
    color: #888;
    font-weight: bold;
  }
  
  .ingredient-icons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .ingredient {
    font-size: 2rem;
    background: #FFF9C4;
    padding: 8px 12px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .recipe-details {
    background: white;
    border-radius: 12px;
    border: 2px solid #81C784;
    padding: 14px;
  }
  
  .recipe-meta {
    display: flex;
    gap: 16px;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 12px;
  }
  
  .full-ingredients {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #DDD;
  }
  
  .full-ingredients ul {
    margin: 8px 0 0;
    padding-left: 20px;
    font-size: 0.85rem;
    color: #555;
    line-height: 1.4;
  }
  
  .full-ingredients li {
    margin-bottom: 4px;
  }

  .recipe-nutrition {
    margin: 8px 0 0;
    font-size: 0.78rem;
    color: #2a7a2a;
    background: #f0faf0;
    border-radius: 6px;
    padding: 5px 10px;
    text-align: center;
    line-height: 1.5;
  }
  
  .instructions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .instructions-label {
    font-size: 0.85rem;
    color: #4CAF50;
    font-weight: bold;
  }
  
  .instructions ol {
    margin: 0;
    padding-left: 22px;
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
  }
  
  .instructions li {
    margin-bottom: 6px;
  }
  
  .locked-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #999;
    font-size: 1rem;
    padding: 30px 20px;
    background: #f5f5f5;
    border-radius: 12px;
    border: 2px dashed #ddd;
  }
  
  .lock-icon {
    font-size: 2rem;
  }

  .paid-tier-note {
    margin: 12px 0 0;
    text-align: center;
    font-size: 1rem;
    font-weight: 400;
    color: #4b5563;
  }
  
  .play-btn {
    margin-top: auto;
    padding: 14px 24px;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: white;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .play-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
  }
  
  .play-btn:active {
    transform: translateY(0);
  }
  
  /* DIETARY PREFERENCE SELECTOR */
  .dietary-select {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px;
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    text-align: center;
    gap: 16px;
    overflow-y: auto;
  }
  
  .dietary-header h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #2E7D32;
  }
  
  .dietary-header p {
    margin: 4px 0 0;
    color: #558B2F;
    font-size: 0.9rem;
  }
  
  .dietary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 400px;
  }
  
  .dietary-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 8px;
    background: white;
    border: 2px solid #E0E0E0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .dietary-btn:hover {
    border-color: #8B4513;
    background: #FFF8E7;
    transform: scale(1.02);
  }
  
  .dietary-btn.selected {
    border-color: #4CAF50;
    background: #E8F5E9;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }
  
  .dietary-emoji {
    font-size: 1.6rem;
    margin-bottom: 4px;
  }
  
  .dietary-name {
    font-weight: bold;
    font-size: 0.8rem;
    color: #333;
  }
  
  .dietary-desc {
    font-size: 0.65rem;
    color: #666;
    text-align: center;
    margin-top: 2px;
  }
  
  .dietary-hint {
    font-size: 0.8rem;
    color: #666;
    margin-top: 8px;
  }
  
  /* Diet badge (clickable to change preference) */
  .diet-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: white;
    border: 2px solid #4CAF50;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.8rem;
    color: #2E7D32;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .diet-badge:hover {
    background: #E8F5E9;
    transform: scale(1.05);
  }
  
  /* RECIPE OF THE DAY */
  .recipe-of-day {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 30px 20px;
    background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
    text-align: center;
    gap: 16px;
    position: relative;
    overflow-y: auto;
  }
  
  .cotd-badge {
    font-size: 1.4rem;
    font-weight: bold;
    color: #D84315;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .cotd-card {
    background: white;
    border-radius: 16px;
    padding: 24px 32px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 320px;
    border: 3px solid #FFB74D;
  }
  
  .cotd-name {
    margin: 0;
    font-size: 1.6rem;
    color: #5D4037;
    font-weight: bold;
  }
  
  .cotd-category {
    font-size: 0.9rem;
    color: #8D6E63;
    font-style: italic;
  }
  
  .cotd-image-container {
    width: 100%;
    max-width: 280px;
    max-height: 180px;
    margin: 12px auto;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .cotd-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .cotd-ingredients {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    padding: 12px 0;
  }
  
  .cotd-ingredient {
    font-size: 2rem;
    background: #FFF3E0;
    padding: 8px 12px;
    border-radius: 12px;
    border: 2px solid #FFE0B2;
    transition: transform 0.2s;
  }
  
  .cotd-ingredient:hover {
    transform: scale(1.15);
  }
  
  .cotd-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-top: 8px;
  }
  
  .cotd-play-btn {
    padding: 14px 28px;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
    color: white;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 12px rgba(244, 81, 30, 0.4);
  }
  
  .cotd-play-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(244, 81, 30, 0.5);
  }
  
  .cotd-browse-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 2px solid #8D6E63;
    border-radius: 10px;
    background: transparent;
    color: #8D6E63;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .cotd-browse-btn:hover {
    background: #8D6E63;
    color: white;
  }
  
  @media (max-width: 480px) {
    .recipe-book {
      max-height: 90vh;
      margin: 10px;
    }
    
    .dietary-select {
      padding: 16px 12px;
      gap: 12px;
    }
    
    .dietary-header h3 {
      font-size: 1.1rem;
    }
    
    .dietary-header p {
      font-size: 0.8rem;
    }
    
    .dietary-grid {
      gap: 8px;
    }
    
    .dietary-btn {
      padding: 10px 6px;
    }
    
    .dietary-emoji {
      font-size: 1.3rem;
    }
    
    .dietary-name {
      font-size: 0.75rem;
    }
    
    .dietary-desc {
      font-size: 0.6rem;
    }
    
    .recipe-of-day {
      padding: 16px 12px;
      gap: 12px;
    }
    
    .diet-badge {
      position: static;
      align-self: center;
      padding: 4px 12px;
      font-size: 0.75rem;
      margin-bottom: -4px;
    }
    
    .cotd-badge {
      font-size: 1.1rem;
    }
    
    .cotd-card {
      padding: 16px 20px;
      gap: 12px;
    }
    
    .cotd-name {
      font-size: 1.3rem;
    }
    
    .cotd-ingredients {
      gap: 6px;
      padding: 8px 0;
    }
    
    .cotd-ingredient {
      font-size: 1.6rem;
      padding: 6px 10px;
    }
    
    .cotd-play-btn, .cotd-browse-btn {
      padding: 10px 16px;
      font-size: 0.9rem;
    }
    
    .category-tabs {
      min-width: 80px;
      max-width: 100px;
      padding: 6px 0 6px 2px;
    }
    
    .category-tab {
      padding: 6px 6px;
    }
    
    .category-name {
      font-size: 0.7rem;
    }
    
    .recipe-tab {
      padding: 6px 8px;
      gap: 6px;
    }
    
    .tab-name {
      font-size: 0.8rem;
    }
    
    .mini-emoji {
      font-size: 0.7rem;
    }
    
    .recipe-name {
      font-size: 1.2rem;
    }
    
    .ingredient {
      font-size: 1.6rem;
      padding: 6px 10px;
    }
  }
  
  /* Extra small screens (iPhone SE) */
  @media (max-width: 375px) {
    .dietary-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .dietary-select {
      padding: 12px 8px;
    }
    
    .recipe-of-day {
      padding: 12px 8px;
    }
    
    .cotd-card {
      padding: 12px 16px;
      max-width: 280px;
    }
  }

  /* Edit icon row layout */
  .recipe-tab-row {
    display: flex;
    align-items: stretch;
    gap: 4px;
    margin-bottom: 2px;
  }

  .recipe-tab-row .recipe-tab {
    flex: 1;
    min-width: 0;
    margin-bottom: 0;
  }

  .edit-icon-btn {
    flex-shrink: 0;
    width: 32px;
    background: none;
    border: 2px solid #DEB887;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
    color: #8B4513;
    padding: 0;
    position: relative;
  }

  .draft-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 9px;
    height: 9px;
    background: #e74c3c;
    border-radius: 50%;
    border: 1.5px solid #FDF5E6;
    pointer-events: none;
  }

  .edit-icon-btn:hover {
    background: #FFF8E7;
    border-color: #8B4513;
  }

  /* Edit code modal */
  .edit-code-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .edit-code-modal {
    background: #FFF8E7;
    border: 3px solid #DEB887;
    border-radius: 16px;
    padding: 24px;
    max-width: 340px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    text-align: center;
  }

  .edit-code-modal h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: #8B4513;
  }

  .edit-code-modal p {
    font-size: 0.9rem;
    color: #5C4033;
    margin: 0 0 12px;
  }

  .edit-code-input {
    width: 100%;
    padding: 8px 12px;
    border: 2px solid #DEB887;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
    letter-spacing: 0.1em;
    box-sizing: border-box;
    margin-bottom: 8px;
  }

  .edit-code-input:focus {
    outline: none;
    border-color: #8B4513;
  }

  .edit-code-error {
    color: #C0392B;
    font-size: 0.85rem;
    margin: 0 0 8px;
  }

  .edit-code-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 10px;
  }

  .edit-code-cancel {
    padding: 8px 20px;
    background: none;
    border: 2px solid #DEB887;
    border-radius: 8px;
    cursor: pointer;
    color: #8B4513;
    font-size: 0.9rem;
  }

  .edit-code-submit {
    padding: 8px 20px;
    background: #8B4513;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
  }

  .edit-code-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .edit-code-accepted {
    color: #2E7D32;
    font-weight: 600;
    font-size: 0.9rem;
    margin: 0;
  }

  /* Creator edit code management section (inside creator edit view) */
  .creator-edit-code-section {
    margin-top: 20px;
    background: #f9f5f0;
    border: 1px solid #e0d5c5;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .creator-code-label {
    margin: 0;
    font-weight: 600;
    color: #5a3e28;
    font-size: 0.9rem;
  }

  .creator-code-hint {
    margin: 0;
    font-size: 0.78rem;
    color: #888;
    line-height: 1.4;
  }

  .creator-code-display {
    display: flex;
    align-items: center;
    gap: 10px;
    background: white;
    border: 1.5px solid #c8a96e;
    border-radius: 8px;
    padding: 8px 14px;
    align-self: flex-start;
  }

  .creator-code-value {
    font-family: 'Courier New', monospace;
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: 4px;
    color: #5a3e28;
  }

  .copy-creator-code-btn {
    padding: 4px 10px;
    background: #8B4513;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .copy-creator-code-btn:hover {
    background: #A0522D;
  }

  .revoke-code-btn {
    padding: 6px 14px;
    background: transparent;
    color: #c0392b;
    border: 1px solid #c0392b;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    align-self: flex-start;
  }

  .revoke-code-btn:hover:not(:disabled) {
    background: #fdf0ee;
  }

  .revoke-code-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .gen-creator-code-btn {
    padding: 8px 18px;
    background: #4a7c59;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    align-self: flex-start;
  }

  .gen-creator-code-btn:hover:not(:disabled) {
    background: #3d6a4a;
  }

  .gen-creator-code-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  /* Collaborator edit note */
  .collab-edit-note {
    font-size: 0.82rem;
    color: #6b5a3e;
    background: #fef9e7;
    border-left: 3px solid #f39c12;
    padding: 8px 12px;
    margin: 0 0 12px 0;
    border-radius: 0 6px 6px 0;
  }

  /* Creator draft banner */
  .collab-draft-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #eaf4ff;
    border: 1px solid #90caf9;
    border-radius: 8px;
    padding: 12px;
    margin-top: 14px;
  }

  .collab-draft-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .collab-draft-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .collab-draft-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #1565c0;
  }

  .collab-draft-time {
    font-size: 0.75rem;
    color: #5c7a9e;
  }

  .collab-draft-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }

  .load-draft-btn {
    padding: 6px 14px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .load-draft-btn:hover:not(:disabled) {
    background: #1565c0;
  }

  .load-draft-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .discard-draft-btn {
    padding: 5px 12px;
    background: transparent;
    color: #c0392b;
    border: 1px solid #c0392b;
    border-radius: 6px;
    font-size: 0.78rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .discard-draft-btn:hover {
    background: #fdf0ee;
  }

  .collab-updated-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #fff3cd;
    border: 1px solid #e6a817;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #7d5a00;
    margin-bottom: 10px;
  }

  .load-updated-btn {
    padding: 5px 12px;
    background: #e6a817;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .load-updated-btn:hover {
    background: #c8940f;
  }

  .creator-form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .creator-save-draft-btn {
    padding: 10px 20px;
    background: transparent;
    color: #1976d2;
    border: 2px solid #1976d2;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  .creator-save-draft-btn:hover:not(:disabled) {
    background: #e3f0fb;
  }

  .creator-save-draft-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .creator-submit-btn {
    padding: 10px 20px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  .creator-submit-btn:hover:not(:disabled) {
    background: #1565c0;
  }

  .creator-submit-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .creator-own-draft-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #e8f5e9;
    border: 1px solid #81c784;
    border-radius: 8px;
    font-size: 0.82rem;
    color: #2e7d32;
    margin-bottom: 8px;
  }

  .creator-own-draft-time {
    flex: 1;
    color: #4caf50;
  }

  .creator-own-draft-discard {
    background: none;
    border: none;
    color: #c62828;
    font-size: 0.78rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  .creator-own-draft-discard:hover {
    color: #b71c1c;
  }
</style>
