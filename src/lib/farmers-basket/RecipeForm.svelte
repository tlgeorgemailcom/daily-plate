<script lang="ts">
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  import type { FoodType, AnimalType, DietaryCategory } from '$lib/farmers-basket/types';
  import FoodIcon from '$lib/farmers-basket/FoodIcon.svelte';
  
  // Types for ingredients and instructions
  export interface RecipeIngredient {
    id: number;
    name: string;
    quantity: string;
    gameFood?: FoodType | '';
    animal?: AnimalType | '';
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
  }
  
  // Props
  interface Props {
    /** If true, shows game food and animal mapping per ingredient */
    moderatorMode?: boolean;
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
          animal: ing.animal || ''
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
      id: nextIngredientId++, 
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
    instructions = [...instructions, { id: nextInstructionId++, text: '' }];
  }
  
  function removeInstruction(id: number) {
    if (instructions.length > 1) {
      instructions = instructions.filter(i => i.id !== id);
    }
  }
  
  // Form submission
  function handleSubmit(e: Event) {
    e.preventDefault();
    
    const data: RecipeFormData = {
      recipeName,
      category,
      dietaryCategory,
      submitterName,
      prepTime,
      servings,
      ingredients: ingredients.filter(i => i.name.trim()),
      instructions: instructions.filter(i => i.text.trim()),
      foodSupply: moderatorMode ? foodSupply : undefined
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
    foodSupply: moderatorMode ? foodSupply : undefined
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
    
    <div class="ingredients-list">
      {#each ingredients as ingredient, i (ingredient.id)}
        <div class="ingredient-row">
          <span class="row-num">{i + 1}.</span>
          <input 
            type="text"
            bind:value={ingredient.quantity}
            placeholder="Qty (e.g., 2 cups)"
            class="form-input qty-input"
          />
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
</style>
