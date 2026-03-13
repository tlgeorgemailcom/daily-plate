<script lang="ts">
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  import type { FoodType, AnimalType, DietaryCategory } from '$lib/farmers-basket/types';
  import FoodIcon from '$lib/farmers-basket/FoodIcon.svelte';
  import { FOODS } from '$lib/data/food-portions';
  import type { Food as FoodData } from '$lib/data/food-portions';
  
  // Types for ingredients and instructions
  export interface RecipeIngredient {
    id: number;
    name: string;
    quantity: string;
    gameFood?: FoodType | '';
    animal?: AnimalType | '';
    // Nutrition linking
    foodWord?: string;       // key into food-portions.ts e.g. "BEEFGROUND"
    ndbNo?: string;          // USDA NDB#
    portionDesc?: string;    // e.g. "1 cup"
    portionGrams?: number;   // grams per one portion
    servingCount?: number;   // number of portions used in recipe
  }
  
  export interface RecipeInstruction {
    id: number;
    text: string;
  }
  
  export interface RecipeFormData {
    recipeName: string;
    category: string;
    dietaryCategory: DietaryCategory;
    submitterName: string;
    prepTime: string;
    servings: string;
    ingredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
    foodSupply?: Record<FoodType, number>; // How many of each food available in game
    nutritionComplete?: boolean;           // true when all ingredients have nutrition links
  }
  
  // Props
  interface Props {
    /** If true, shows game food and animal mapping per ingredient */
    moderatorMode?: boolean;
    /** If true, shows nutrition linking per ingredient (default true) */
    nutritionMode?: boolean;
    /** Initial data for editing existing recipes */
    initialData?: Partial<RecipeFormData>;
    /** Called when form is submitted with full form data */
    onsubmit: (data: RecipeFormData) => void | Promise<void>;
    /** Called when cancel/close is clicked */
    oncancel?: () => void;
    /** Custom label for submit button */
    submitLabel?: string;
    /** Whether submission is in progress (disables submit) */
    submitting?: boolean;
    /** Error message to display */
    errorMessage?: string;
    /** Hide default action buttons (for custom actions snippet) */
    hideDefaultActions?: boolean;
    /** Custom actions snippet - receives formData and isValid */
    customActions?: import('svelte').Snippet<[{ formData: RecipeFormData; isValid: boolean }]>;
  }
  
  let { 
    moderatorMode = false,
    nutritionMode = true,
    initialData = {},
    onsubmit,
    oncancel,
    submitLabel = 'Submit',
    submitting = false,
    errorMessage = '',
    hideDefaultActions = false,
    customActions
  }: Props = $props();
  
  // Constants
  const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Salads', 'Sides', 'Beverages'];
  
  const DIETARY_CATEGORIES = [
    { id: 'all' as DietaryCategory, name: 'All Foods', emoji: '🍽️', description: 'No restrictions' },
    { id: 'pollo-pesca' as DietaryCategory, name: 'Pollo-Pesca', emoji: '🍗🐟', description: 'No red meat' },
    { id: 'pollo' as DietaryCategory, name: 'Pollo', emoji: '🍗', description: 'Chicken only' },
    { id: 'pesca' as DietaryCategory, name: 'Pesca', emoji: '🐟', description: 'Fish only' },
    { id: 'veggie' as DietaryCategory, name: 'Veggie', emoji: '🥚🧀', description: 'Vegetarian' },
    { id: 'vegan' as DietaryCategory, name: 'Vegan', emoji: '🌱', description: 'Plant-based' }
  ];
  
  const GAME_FOODS = Object.keys(FOOD_EMOJI) as FoodType[];
  const ANIMAL_TYPES: AnimalType[] = ['rabbit', 'squirrel', 'raccoon', 'bird', 'mouse', 'fox'];
  
  // Form state
  let recipeName = $state(initialData.recipeName || '');
  let category = $state(initialData.category || 'Dinner');
  let dietaryCategory = $state<DietaryCategory>(initialData.dietaryCategory || 'all');
  let submitterName = $state(initialData.submitterName || '');
  let prepTime = $state(initialData.prepTime || '');
  let servings = $state(initialData.servings || '');
  
  // Initialize ingredients from initialData or create empty one
  let nextIngredientId = $state(1);
  let ingredients = $state<RecipeIngredient[]>(
    initialData.ingredients?.length 
      ? initialData.ingredients.map((ing, i) => ({
          id: i + 1,
          name: ing.name || '',
          quantity: ing.quantity || '',
          gameFood: ing.gameFood || '',
          animal: ing.animal || '',
          foodWord: ing.foodWord,
          ndbNo: ing.ndbNo,
          portionDesc: ing.portionDesc,
          portionGrams: ing.portionGrams,
          servingCount: ing.servingCount
        }))
      : [{ id: 1, name: '', quantity: '', gameFood: '', animal: '' }]
  );
  
  // Initialize instructions
  let nextInstructionId = $state(1);
  let instructions = $state<RecipeInstruction[]>(
    initialData.instructions?.length
      ? initialData.instructions.map((inst, i) => ({
          id: i + 1,
          text: inst.text || ''
        }))
      : [{ id: 1, text: '' }]
  );
  
  // Initialize food supply (default 3 of each selected food)
  let foodSupply = $state<Record<FoodType, number>>(initialData.foodSupply || {} as Record<FoodType, number>);

  // ─── Nutrition linking state (keyed by ingredient id) ───────────────────────
  let nutritionOpen = $state<Record<number, boolean>>({});
  let nutritionSearchQ = $state<Record<number, string>>({});
  let nutritionPendingFood = $state<Record<number, FoodData | null>>({});
  let nutritionPendingPortionIdx = $state<Record<number, number>>({});
  let nutritionPendingCount = $state<Record<number, number>>({});
  let nutritionCustomGrams = $state<Record<number, number | null>>({});

  function searchFoods(query: string): FoodData[] {
    if (!query.trim()) return [];
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return [];
    const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const matches = FOODS.filter(f => {
      const d = f.display.toLowerCase();
      return escaped.every(w => d.includes(w));
    });
    // rank: any word in display starts with first query word → top; then alphabetical
    const wordStarts = (s: string) =>
      s.toLowerCase().split(/\s+/).some(w => w.startsWith(words[0]));
    matches.sort((a, b) => {
      const aMatch = wordStarts(a.display) ? 0 : 1;
      const bMatch = wordStarts(b.display) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return a.display.localeCompare(b.display);
    });
    return matches.slice(0, 20);
  }

  function openNutritionSearchFresh(ing: RecipeIngredient) {
    // Always go to search screen (change food)
    nutritionSearchQ = { ...nutritionSearchQ, [ing.id]: ing.name };
    nutritionPendingFood = { ...nutritionPendingFood, [ing.id]: null };
    nutritionCustomGrams = { ...nutritionCustomGrams, [ing.id]: null };
    nutritionOpen = { ...nutritionOpen, [ing.id]: true };
  }

  function openNutritionSearch(ing: RecipeIngredient) {
    nutritionSearchQ = { ...nutritionSearchQ, [ing.id]: ing.name };
    nutritionOpen = { ...nutritionOpen, [ing.id]: true };
    // If already linked, skip search and pre-load the portion picker
    if (ing.foodWord) {
      const existing = FOODS.find(f => f.word === ing.foodWord) ?? null;
      nutritionPendingFood = { ...nutritionPendingFood, [ing.id]: existing };
      if (existing) {
        // Restore current portion selection if possible
        const matchIdx = existing.portions.findIndex(p => p.desc === ing.portionDesc);
        nutritionPendingPortionIdx = { ...nutritionPendingPortionIdx, [ing.id]: matchIdx >= 0 ? matchIdx : (existing.portions.length > 1 ? 1 : 0) };
        nutritionPendingCount = { ...nutritionPendingCount, [ing.id]: ing.servingCount ?? 1 };
        // Restore custom grams if the previous link used a custom gram amount
        nutritionCustomGrams = { ...nutritionCustomGrams, [ing.id]: ing.portionDesc === 'g' ? (ing.portionGrams ?? null) : null };
      }
    } else {
      nutritionPendingFood = { ...nutritionPendingFood, [ing.id]: null };
    }
  }

  function selectPendingFood(ingId: number, food: FoodData) {
    nutritionPendingFood = { ...nutritionPendingFood, [ingId]: food };
    const defaultIdx = food.portions.length > 1 ? 1 : 0;
    nutritionPendingPortionIdx = { ...nutritionPendingPortionIdx, [ingId]: defaultIdx };
    nutritionPendingCount = { ...nutritionPendingCount, [ingId]: 1 };
    nutritionCustomGrams = { ...nutritionCustomGrams, [ingId]: null };
  }

  function confirmNutritionLink(ingId: number) {
    const food = nutritionPendingFood[ingId];
    if (!food) return;
    const customG = nutritionCustomGrams[ingId];
    const count = nutritionPendingCount[ingId] ?? 1;
    let portionDesc: string;
    let portionGrams: number;
    if (customG && customG > 0) {
      portionDesc = 'g';
      portionGrams = customG;
    } else {
      const portionIdx = nutritionPendingPortionIdx[ingId] ?? (food.portions.length > 1 ? 1 : 0);
      const portion = food.portions[portionIdx] ?? food.portions[0];
      portionDesc = portion.desc;
      portionGrams = portion.gm;
    }
    ingredients = ingredients.map(i => i.id === ingId ? {
      ...i,
      foodWord: food.word,
      ndbNo: food.ndb,
      portionDesc,
      portionGrams,
      servingCount: count
    } : i);
    nutritionOpen = { ...nutritionOpen, [ingId]: false };
  }

  function unlinkNutrition(ingId: number) {
    ingredients = ingredients.map(i => i.id === ingId ? {
      ...i,
      foodWord: undefined, ndbNo: undefined,
      portionDesc: undefined, portionGrams: undefined, servingCount: undefined
    } : i);
  }

  let nutritionLinkedCount = $derived(
    ingredients.filter(i => i.name.trim() && i.foodWord && i.portionGrams).length
  );
  let nutritionTotalCount = $derived(ingredients.filter(i => i.name.trim()).length);
  let nutritionComplete = $derived(
    nutritionMode && nutritionTotalCount > 0 && nutritionLinkedCount === nutritionTotalCount
  );
  // ────────────────────────────────────────────────────────────────────────────

  // Update next IDs based on initial data
  $effect(() => {
    if (initialData.ingredients?.length) {
      nextIngredientId = Math.max(...ingredients.map(i => i.id)) + 1;
    }
    if (initialData.instructions?.length) {
      nextInstructionId = Math.max(...instructions.map(i => i.id)) + 1;
    }
  });
  
  // Ingredient functions
  function addIngredient() {
    ingredients = [...ingredients, { 
      id: ++nextIngredientId, 
      name: '', 
      quantity: '', 
      gameFood: '', 
      animal: '' 
    }];
  }
  
  function removeIngredient(id: number) {
    if (ingredients.length > 1) {
      ingredients = ingredients.filter(i => i.id !== id);
    }
  }
  
  // Instruction functions
  function addInstruction() {
    instructions = [...instructions, { id: ++nextInstructionId, text: '' }];
  }
  
  function removeInstruction(id: number) {
    if (instructions.length > 1) {
      instructions = instructions.filter(i => i.id !== id);
    }
  }
  
  // Form submission
  function handleSubmit(e: Event) {
    e.preventDefault();
    
    const linked = nutritionMode && nutritionComplete;
    const data: RecipeFormData = {
      recipeName,
      category,
      dietaryCategory,
      submitterName,
      prepTime,
      servings,
      ingredients: ingredients.filter(i => i.name.trim()).map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        gameFood: i.gameFood,
        animal: i.animal,
        ...(linked ? {
          foodWord: i.foodWord,
          ndbNo: i.ndbNo,
          portionDesc: i.portionDesc,
          portionGrams: i.portionGrams,
          servingCount: i.servingCount
        } : {})
      })),
      instructions: instructions.filter(i => i.text.trim()),
      foodSupply: moderatorMode ? foodSupply : undefined,
      nutritionComplete: linked || undefined
    };
    
    onsubmit(data);
  }
  
  // Validation
  let isValid = $derived(
    recipeName.trim().length > 0 &&
    ingredients.some(i => i.name.trim()) &&
    instructions.some(i => i.text.trim())
  );
  
  // Current form data (for customActions snippet)
  let formData = $derived<RecipeFormData>({
    recipeName,
    category,
    dietaryCategory,
    submitterName,
    prepTime,
    servings,
    ingredients: ingredients.filter(i => i.name.trim()),
    instructions: instructions.filter(i => i.text.trim()),
    foodSupply: moderatorMode ? foodSupply : undefined,
    nutritionComplete: nutritionMode ? nutritionComplete : undefined
  });
</script>

<form class="recipe-form" onsubmit={handleSubmit}>
  {#if errorMessage}
    <div class="error-msg">{errorMessage}</div>
  {/if}
  
  <!-- Basic Info Section -->
  <div class="form-section">
    <h3 class="section-title">📝 Recipe Details</h3>
    
    <div class="form-row">
      <label class="form-label flex-2">
        Recipe Name *
        <input 
          type="text" 
          bind:value={recipeName}
          placeholder="e.g., Grandma's Apple Pie"
          class="form-input"
          required
        />
      </label>
      
      <label class="form-label">
        Meal Type *
        <select bind:value={category} class="form-select">
          {#each CATEGORIES as cat}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </label>
    </div>
    
    {#if !moderatorMode}
      <label class="form-label">
        Your Name (optional)
        <input 
          type="text" 
          bind:value={submitterName}
          placeholder="Anonymous"
          class="form-input"
        />
      </label>
    {/if}
  </div>
  
  <!-- Dietary Category Section -->
  <div class="form-section dietary-section">
    <h3 class="section-title">🥗 Dietary Category *</h3>
    <p class="section-hint">Select the most restrictive category this recipe fits</p>
    <div class="dietary-grid">
      {#each DIETARY_CATEGORIES as diet}
        <button
          type="button"
          class="dietary-btn"
          class:selected={dietaryCategory === diet.id}
          onclick={() => dietaryCategory = diet.id}
        >
          <span class="dietary-emoji">{diet.emoji}</span>
          <span class="dietary-name">{diet.name}</span>
          <span class="dietary-desc">{diet.description}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Prep/Servings Row -->
  <div class="form-section">
    <div class="form-row">
      <label class="form-label">
        Prep Time
        <input 
          type="text" 
          bind:value={prepTime}
          placeholder="e.g., 30 mins"
          class="form-input"
        />
      </label>
      
      <label class="form-label">
        Servings
        <input 
          type="text" 
          bind:value={servings}
          placeholder="e.g., 4 servings"
          class="form-input"
        />
      </label>
    </div>
  </div>
  
  <!-- Ingredients Section -->
  <div class="form-section">
    <h3 class="section-title">🥗 Ingredients</h3>
    <p class="section-hint">List all ingredients with quantities (e.g., "2 cups flour", "1 tsp salt")</p>
    
    {#if nutritionMode && nutritionTotalCount > 0}
      <div class="nutrition-progress" class:complete={nutritionComplete}>
        {#if nutritionComplete}
          ✅ Nutrition complete — all {nutritionTotalCount} ingredient{nutritionTotalCount === 1 ? '' : 's'} linked
        {:else}
          🔗 Nutrition: {nutritionLinkedCount}/{nutritionTotalCount} ingredient{nutritionTotalCount === 1 ? '' : 's'} linked
        {/if}
      </div>
    {/if}

    <div class="ingredients-list">
      {#each ingredients as ingredient, i (ingredient.id)}
        <div class="ingredient-entry">
          <div class="ingredient-row">
            <span class="row-num">{i + 1}.</span>
            {#if !nutritionMode || !ingredient.foodWord}
              <input 
                type="text"
                bind:value={ingredient.quantity}
                placeholder="Qty (e.g., 2 cups)"
                class="form-input qty-input"
              />
            {/if}
            <input 
              type="text"
              bind:value={ingredient.name}
              placeholder="Ingredient (e.g., flour)"
              class="form-input name-input"
            />
            <button 
              type="button"
              class="remove-btn"
              onclick={() => removeIngredient(ingredient.id)}
              disabled={ingredients.length <= 1}
              aria-label="Remove ingredient"
            >
              ✕
            </button>
          </div>

          {#if nutritionMode}
            <div class="nutrition-row">
              {#if ingredient.foodWord}
                <div class="nutrition-badge">
                  <span class="nutrition-badge-text">
                    ✓ {FOODS.find(f => f.word === ingredient.foodWord)?.display}
                    · {ingredient.portionDesc === 'g'
                        ? `${(ingredient.servingCount ?? 1) * (ingredient.portionGrams ?? 0)}g`
                        : `${ingredient.servingCount}×${ingredient.portionDesc}`}
                  </span>
                  <span class="nutrition-badge-edit-label">Edit:</span>
                  <button type="button" class="nutrition-relink-btn" onclick={() => openNutritionSearch(ingredient)}>qty</button>
                  <button type="button" class="nutrition-relink-btn" onclick={() => openNutritionSearchFresh(ingredient)}>food</button>
                  <button type="button" class="nutrition-unlink-btn" onclick={() => unlinkNutrition(ingredient.id)}>✕</button>
                </div>
              {:else}
                <button type="button" class="link-nutrition-btn" onclick={() => openNutritionSearch(ingredient)}>
                  🔗 Link nutrition
                </button>
              {/if}

              {#if nutritionOpen[ingredient.id]}
                <div class="nutrition-search-panel">
                  {#if !nutritionPendingFood[ingredient.id]}
                    <input
                      type="text"
                      class="nutrition-search-input"
                      placeholder="Search food (e.g. flour, chicken)..."
                      value={nutritionSearchQ[ingredient.id] ?? ''}
                      oninput={(e) => { nutritionSearchQ = { ...nutritionSearchQ, [ingredient.id]: (e.target as HTMLInputElement).value }; }}
                    />
                    {@const results = searchFoods(nutritionSearchQ[ingredient.id] ?? '')}
                    {#if results.length > 0}
                      <div class="nutrition-results">
                        {#each results as food}
                          <button type="button" class="nutrition-result-btn" onclick={() => selectPendingFood(ingredient.id, food)}>
                            <span class="result-name">{food.display}</span>
                            <span class="result-cal">{food.cal} cal/100g</span>
                          </button>
                        {/each}
                      </div>
                    {:else if (nutritionSearchQ[ingredient.id] ?? '').trim().length > 1}
                      <p class="nutrition-no-results">No matches — try a shorter word</p>
                    {:else}
                      <p class="nutrition-search-hint">Type to search 1,300+ USDA foods</p>
                    {/if}
                  {:else}
                    {@const pFood = nutritionPendingFood[ingredient.id]!}
                    {@const namedPortions = pFood.portions.map((p, idx) => ({...p, idx})).filter(p => p.desc !== 'custom (g)')}
                    <div class="portion-picker">
                      <div class="portion-food-name">📌 {pFood.display}</div>
                      <div class="portion-controls">
                        <label class="portion-label">
                          How many?
                          <input
                            type="number" min="0.25" step="0.25"
                            class="portion-count-input"
                            value={nutritionPendingCount[ingredient.id] ?? 1}
                            oninput={(e) => {
                              nutritionPendingCount = { ...nutritionPendingCount, [ingredient.id]: parseFloat((e.target as HTMLInputElement).value) || 1 };
                            }}
                          />
                        </label>
                        {#if namedPortions.length > 0}
                            <label class="portion-label">
                              Portion size
                              <select
                                class="portion-select"
                                onchange={(e) => {
                                  nutritionCustomGrams = { ...nutritionCustomGrams, [ingredient.id]: null };
                                  nutritionPendingPortionIdx = { ...nutritionPendingPortionIdx, [ingredient.id]: parseInt((e.target as HTMLSelectElement).value) };
                                }}
                              >
                                {#each namedPortions as p}
                                  <option value={p.idx} selected={p.idx === (nutritionPendingPortionIdx[ingredient.id] ?? namedPortions[0].idx)}>
                                    {p.amt} {p.desc} ({p.gm}g)
                                  </option>
                                {/each}
                              </select>
                            </label>
                          {:else}
                            <p class="portion-note">Nutrient values per 100g</p>
                          {/if}
                        <label class="portion-label">
                          Custom grams
                          <input
                            type="number" min="1" step="1"
                            class="portion-custom-grams-input"
                            placeholder="e.g. 150"
                            value={nutritionCustomGrams[ingredient.id] ?? ''}
                            oninput={(e) => {
                              const v = parseFloat((e.target as HTMLInputElement).value);
                              nutritionCustomGrams = { ...nutritionCustomGrams, [ingredient.id]: isNaN(v) ? null : v };
                            }}
                          />
                        </label>
                      </div>
                      <div class="portion-actions">
                        <button type="button" class="portion-back-btn" onclick={() => { nutritionPendingFood = { ...nutritionPendingFood, [ingredient.id]: null }; }}>← Back</button>
                        <button type="button" class="portion-confirm-btn" onclick={() => confirmNutritionLink(ingredient.id)}>✓ Confirm</button>
                      </div>
                    </div>
                  {/if}
                  <button type="button" class="nutrition-cancel-btn" onclick={() => { nutritionOpen = { ...nutritionOpen, [ingredient.id]: false }; }}>Cancel</button>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
    <button type="button" class="add-btn" onclick={addIngredient}>
      + Add Ingredient
    </button>
  </div>
  
  <!-- Instructions Section -->
  <div class="form-section">
    <h3 class="section-title">📋 Instructions</h3>
    <p class="section-hint">Step-by-step directions to make this recipe</p>
    
    <div class="instructions-list">
      {#each instructions as instruction, i (instruction.id)}
        <div class="instruction-row">
          <span class="row-num">{i + 1}.</span>
          <textarea 
            bind:value={instruction.text}
            placeholder="Describe this step..."
            class="form-textarea"
            rows="2"
          ></textarea>
          <button 
            type="button"
            class="remove-btn"
            onclick={() => removeInstruction(instruction.id)}
            disabled={instructions.length <= 1}
            aria-label="Remove step"
          >
            ✕
          </button>
        </div>
      {/each}
    </div>
    
    <button type="button" class="add-btn" onclick={addInstruction}>
      + Add Step
    </button>
  </div>
  
  <!-- Game Mapping Section (Moderator Only) -->
  {#if moderatorMode}
    <div class="form-section game-mapping-section">
      <h3 class="section-title">🎮 Game Settings</h3>
      <p class="section-hint">Select which ingredients appear in gameplay and which animal tries to steal them</p>
      
      <div class="game-mapping-list">
        {#each ingredients.filter(i => i.name.trim()) as ingredient, i (ingredient.id)}
          <div class="game-mapping-row">
            <span class="mapping-ingredient">
              <span class="mapping-num">{i + 1}.</span>
              <span class="mapping-name">{ingredient.quantity} {ingredient.name}</span>
            </span>
            <div class="mapping-selects">
              <select bind:value={ingredient.gameFood} class="form-select game-food-select">
                <option value="">— Select food —</option>
                {#each GAME_FOODS as food}
                  <option value={food}>{FOOD_EMOJI[food]} {food}</option>
                {/each}
              </select>
              <select bind:value={ingredient.animal} class="form-select animal-select">
                <option value="">— Select animal —</option>
                {#each ANIMAL_TYPES as animal}
                  <option value={animal}>🐾 {animal}</option>
                {/each}
              </select>
            </div>
          </div>
        {/each}
      </div>
      
      {#if ingredients.filter(i => i.name.trim() && i.gameFood).length === 0}
        <p class="mapping-warning">⚠️ Select at least one game food to enable gameplay</p>
      {/if}
    </div>
    
    <!-- Food Supply Section -->
    {@const selectedFoods = [...new Set(ingredients.filter(i => i.gameFood).map(i => i.gameFood as FoodType))]}
    {#if selectedFoods.length > 0}
      <div class="form-section food-supply-section">
        <h3 class="section-title">📦 Food Supply</h3>
        <p class="section-hint">How many of each food can be collected? (-1 = unlimited)</p>
        
        <div class="food-supply-grid">
          {#each selectedFoods as food}
            <div class="food-supply-item">
              <span class="food-supply-label">
                {FOOD_EMOJI[food]} {food}
              </span>
              <input 
                type="number" 
                min="-1" 
                max="20"
                value={foodSupply[food] ?? 3}
                onchange={(e) => {
                  const val = parseInt((e.target as HTMLInputElement).value) || 3;
                  foodSupply = { ...foodSupply, [food]: val };
                }}
                class="food-supply-input"
              />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
  
  <!-- Form Actions -->
  <div class="form-actions">
    {#if customActions}
      {@render customActions({ formData, isValid })}
    {:else if !hideDefaultActions}
      {#if oncancel}
        <button type="button" class="cancel-btn" onclick={oncancel}>Cancel</button>
      {/if}
      <button type="submit" class="submit-btn" disabled={submitting || !isValid}>
        {submitting ? 'Submitting...' : submitLabel}
      </button>
    {/if}
  </div>
</form>

<style>
  .recipe-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .error-msg {
    background: #FFEBEE;
    color: #C62828;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
  }
  
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .section-title {
    margin: 0;
    font-size: 1.1rem;
    color: #5D4037;
    border-bottom: 2px solid #DDD;
    padding-bottom: 8px;
  }
  
  .section-hint {
    margin: 0;
    font-size: 0.85rem;
    color: #888;
    font-style: italic;
  }
  
  .form-row {
    display: flex;
    gap: 12px;
  }
  
  .form-row .form-label {
    flex: 1;
  }
  
  .form-row .form-label.flex-2 {
    flex: 2;
  }
  
  .form-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #5D4037;
  }
  
  .form-input, .form-select, .form-textarea {
    padding: 10px 12px;
    border: 2px solid #DDD;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: #8B4513;
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 60px;
  }
  
  /* Ingredients & Instructions lists */
  .ingredients-list, .instructions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .ingredient-row, .instruction-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  
  .row-num {
    min-width: 24px;
    padding-top: 10px;
    font-weight: bold;
    color: #8B4513;
  }
  
  .qty-input {
    width: 100px;
    flex-shrink: 0;
  }
  
  .name-input {
    flex: 1;
    min-width: 120px;
  }
  
  .instruction-row .form-textarea {
    flex: 1;
  }
  
  .remove-btn {
    background: #FFEBEE;
    border: none;
    color: #C62828;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 4px;
    flex-shrink: 0;
  }
  
  .remove-btn:hover:not(:disabled) {
    background: #FFCDD2;
  }
  
  .remove-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .add-btn {
    align-self: flex-start;
    padding: 8px 16px;
    background: #E8F5E9;
    border: 2px solid #81C784;
    border-radius: 8px;
    color: #2E7D32;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .add-btn:hover {
    background: #C8E6C9;
  }
  
  /* Form actions */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 12px;
    border-top: 2px solid #EEE;
  }
  
  .cancel-btn {
    padding: 12px 24px;
    background: #EEE;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    color: #666;
  }
  
  .cancel-btn:hover {
    background: #DDD;
  }
  
  .submit-btn {
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
  
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
  }
  
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Dietary category selection */
  .dietary-section {
    margin-top: 8px;
  }
  
  .dietary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 8px;
  }
  
  .dietary-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    background: white;
    border: 2px solid #E0E0E0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .dietary-btn:hover {
    border-color: #8B4513;
    background: #FFF8E7;
  }
  
  .dietary-btn.selected {
    border-color: #4CAF50;
    background: #E8F5E9;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }
  
  .dietary-emoji {
    font-size: 1.5rem;
    margin-bottom: 4px;
  }
  
  .dietary-name {
    font-weight: bold;
    font-size: 0.85rem;
    color: #333;
  }
  
  .dietary-desc {
    font-size: 0.65rem;
    color: #666;
    text-align: center;
    margin-top: 2px;
  }
  
  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
    
    .qty-input {
      width: 80px;
    }
    
    .name-input {
      min-width: 0;
    }
    
    .dietary-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .game-mapping-row {
      flex-direction: column;
      align-items: stretch;
    }
    
    .mapping-selects {
      flex-direction: column;
      gap: 6px;
    }
    
    .game-food-select,
    .animal-select {
      width: 100%;
    }
  }
  
  /* Game Mapping Section */
  .game-mapping-section {
    background: #FFF8E1;
    padding: 16px;
    border-radius: 12px;
    border: 2px solid #FFB74D;
  }
  
  .game-mapping-section .section-title {
    color: #E65100;
    border-bottom-color: #FFB74D;
  }
  
  .game-mapping-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .game-mapping-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
  }
  
  .mapping-ingredient {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }
  
  .mapping-num {
    font-weight: bold;
    color: #E65100;
  }
  
  .mapping-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .mapping-selects {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  
  .game-food-select {
    width: 130px;
    padding: 6px 8px;
    font-size: 0.9rem;
  }
  
  .animal-select {
    width: 130px;
    padding: 6px 8px;
    font-size: 0.9rem;
  }
  
  .mapping-warning {
    margin: 8px 0 0;
    padding: 8px 12px;
    background: #FFEBEE;
    color: #C62828;
    border-radius: 6px;
    font-size: 0.85rem;
  }
  
  /* Food Supply Section */
  .food-supply-section {
    background: #E8F5E9;
    padding: 16px;
    border-radius: 12px;
    border: 2px solid #66BB6A;
    margin-top: 16px;
  }
  
  .food-supply-section .section-title {
    color: #2E7D32;
    border-bottom-color: #66BB6A;
  }
  
  .food-supply-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .food-supply-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #C8E6C9;
  }
  
  .food-supply-label {
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .food-supply-input {
    width: 60px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #C8E6C9;
    text-align: center;
    font-size: 0.95rem;
  }
  
  .food-supply-input:focus {
    outline: none;
    border-color: #66BB6A;
    box-shadow: 0 0 0 2px rgba(102, 187, 106, 0.2);
  }

  /* ── Nutrition linking ──────────────────────────────────────────────────── */

  .ingredient-entry {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 10px;
    border-bottom: 1px solid #F0F0F0;
  }

  .ingredient-entry:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .nutrition-progress {
    padding: 7px 12px;
    background: #FFF8E1;
    border: 1px solid #FFD54F;
    border-radius: 8px;
    font-size: 0.83rem;
    color: #F57F17;
    font-weight: 500;
  }

  .nutrition-progress.complete {
    background: #E8F5E9;
    border-color: #81C784;
    color: #2E7D32;
  }

  .nutrition-row {
    padding-left: 28px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .nutrition-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: #E8F5E9;
    border: 1px solid #81C784;
    border-radius: 6px;
    font-size: 0.82rem;
    color: #2E7D32;
    min-width: 0;
    max-width: 100%;
  }

  .nutrition-badge-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nutrition-badge-edit-label {
    font-size: 0.78rem;
    color: #888;
    margin-right: 2px;
  }

  .nutrition-relink-btn {
    background: none;
    border: none;
    color: #388E3C;
    font-size: 0.75rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    white-space: nowrap;
  }

  .nutrition-unlink-btn {
    background: none;
    border: none;
    color: #C62828;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0 2px;
    line-height: 1;
  }

  .link-nutrition-btn {
    align-self: flex-start;
    padding: 4px 10px;
    background: none;
    border: 1px dashed #BDBDBD;
    border-radius: 6px;
    color: #757575;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .link-nutrition-btn:hover {
    border-color: #4CAF50;
    color: #2E7D32;
    background: #F1F8E9;
  }

  .nutrition-search-panel {
    background: #FAFAFA;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nutrition-search-input {
    padding: 8px 10px;
    border: 1px solid #DDD;
    border-radius: 6px;
    font-size: 0.9rem;
    width: 100%;
    box-sizing: border-box;
  }

  .nutrition-search-input:focus {
    outline: none;
    border-color: #4CAF50;
  }

  .nutrition-results {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 400px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .nutrition-result-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 10px;
    background: white;
    border: 1px solid #E8E8E8;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.1s;
  }

  .nutrition-result-btn:hover {
    background: #F1F8E9;
    border-color: #81C784;
  }

  .result-name {
    font-size: 0.88rem;
    font-weight: 500;
    color: #333;
  }

  .result-cal {
    font-size: 0.75rem;
    color: #888;
    margin-left: 8px;
    white-space: nowrap;
  }

  .nutrition-no-results, .nutrition-search-hint {
    font-size: 0.82rem;
    color: #888;
    margin: 0;
    padding: 2px 4px;
    font-style: italic;
  }

  .portion-picker {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .portion-food-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #5D4037;
  }

  .portion-controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .portion-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #555;
  }

  .portion-count-input {
    width: 70px;
    padding: 6px 8px;
    border: 1px solid #DDD;
    border-radius: 6px;
    font-size: 0.9rem;
    text-align: center;
  }

  .portion-select {
    padding: 6px 8px;
    border: 1px solid #DDD;
    border-radius: 6px;
    font-size: 0.85rem;
    max-width: 220px;
  }

  .portion-custom-grams-input {
    padding: 6px 8px;
    border: 1px solid #DDD;
    border-radius: 6px;
    font-size: 0.85rem;
    width: 100px;
  }

  .portion-custom-grams-input:focus {
    outline: none;
    border-color: #8B4513;
  }

  .portion-note {
    font-size: 0.82rem;
    color: #888;
    margin: 0;
    font-style: italic;
    align-self: flex-end;
    padding-bottom: 6px;
  }

  .portion-actions {
    display: flex;
    gap: 8px;
  }

  .portion-back-btn {
    padding: 7px 14px;
    background: #EEE;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    color: #555;
  }

  .portion-back-btn:hover {
    background: #DDD;
  }

  .portion-confirm-btn {
    padding: 7px 14px;
    background: #4CAF50;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
  }

  .portion-confirm-btn:hover {
    background: #388E3C;
  }

  .nutrition-cancel-btn {
    align-self: flex-start;
    padding: 4px 10px;
    background: none;
    border: none;
    color: #999;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
