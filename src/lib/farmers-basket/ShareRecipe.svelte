<script lang="ts">
  // All available categories
  const CATEGORIES = [
    'Breakfast',
    'Snacks',
    'Lunch',
    'Dinner',
    'Beverages',
    'Salads',
    'Sides'
  ];
  
  interface Ingredient {
    id: number;
    name: string;
    quantity: string;
  }
  
  interface Instruction {
    id: number;
    text: string;
  }
  
  interface Props {
    onclose: () => void;
    onsubmit?: () => void;
  }
  
  let { onclose, onsubmit }: Props = $props();
  
  // Form state
  let recipeName = $state('');
  let category = $state('Dinner');
  let submitterName = $state('');
  let prepTime = $state('');
  let servings = $state('');
  
  // Dynamic ingredients list
  let ingredients = $state<Ingredient[]>([
    { id: 1, name: '', quantity: '' },
    { id: 2, name: '', quantity: '' },
    { id: 3, name: '', quantity: '' }
  ]);
  let nextIngredientId = $state(4);
  
  // Dynamic instructions list
  let instructions = $state<Instruction[]>([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' }
  ]);
  let nextInstructionId = $state(4);
  
  // Submission state
  let isSubmitting = $state(false);
  let submitError = $state<string | null>(null);
  let submitSuccess = $state(false);
  
  function addIngredient() {
    ingredients = [...ingredients, { id: nextIngredientId, name: '', quantity: '' }];
    nextIngredientId++;
  }
  
  function removeIngredient(id: number) {
    if (ingredients.length > 1) {
      ingredients = ingredients.filter(i => i.id !== id);
    }
  }
  
  function addInstruction() {
    instructions = [...instructions, { id: nextInstructionId, text: '' }];
    nextInstructionId++;
  }
  
  function removeInstruction(id: number) {
    if (instructions.length > 1) {
      instructions = instructions.filter(i => i.id !== id);
    }
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Validate
    if (!recipeName.trim()) {
      submitError = 'Please enter a recipe name';
      return;
    }
    
    const validIngredients = ingredients.filter(i => i.name.trim());
    if (validIngredients.length === 0) {
      submitError = 'Please add at least one ingredient';
      return;
    }
    
    const validInstructions = instructions.filter(i => i.text.trim());
    if (validInstructions.length === 0) {
      submitError = 'Please add at least one instruction';
      return;
    }
    
    isSubmitting = true;
    submitError = null;
    
    try {
      const submission = {
        recipeName: recipeName.trim(),
        category,
        submitterName: submitterName.trim() || 'Anonymous',
        prepTime: prepTime.trim(),
        servings: servings.trim(),
        ingredients: validIngredients.map(i => ({
          name: i.name.trim(),
          quantity: i.quantity.trim()
        })),
        instructions: validInstructions.map(i => i.text.trim()),
        submittedAt: new Date().toISOString()
      };
      
      const response = await fetch('/api/recipes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit recipe');
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
    
    {#if submitSuccess}
      <div class="success-view">
        <div class="success-icon">✅</div>
        <h3>Recipe Submitted!</h3>
        <p>Thank you for sharing your recipe. It will be reviewed by a moderator and added to the game soon!</p>
        <button class="done-btn" onclick={onclose}>Done</button>
      </div>
    {:else}
      <form class="recipe-form" onsubmit={handleSubmit}>
        {#if submitError}
          <div class="error-msg">{submitError}</div>
        {/if}
        
        <div class="form-section">
          <label class="form-label">
            Recipe Name *
            <input 
              type="text" 
              bind:value={recipeName}
              placeholder="e.g., Grandma's Apple Pie"
              class="form-input"
            />
          </label>
          
          <div class="form-row">
            <label class="form-label">
              Category *
              <select bind:value={category} class="form-select">
                {#each CATEGORIES as cat}
                  <option value={cat}>{cat}</option>
                {/each}
              </select>
            </label>
            
            <label class="form-label">
              Your Name (optional)
              <input 
                type="text" 
                bind:value={submitterName}
                placeholder="Anonymous"
                class="form-input"
              />
            </label>
          </div>
          
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
        
        <div class="form-actions">
          <button type="button" class="cancel-btn" onclick={onclose}>Cancel</button>
          <button type="submit" class="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : '📤 Submit Recipe'}
          </button>
        </div>
      </form>
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
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
    border-radius: 4px;
  }
  
  .close-btn:hover {
    background: rgba(255,255,255,0.2);
  }
  
  .recipe-form {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
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
    width: 120px;
    flex-shrink: 0;
  }
  
  .name-input {
    flex: 1;
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
  
  @media (max-width: 500px) {
    .share-modal {
      max-height: 95vh;
    }
    
    .form-row {
      flex-direction: column;
    }
    
    .qty-input {
      width: 100px;
    }
  }
</style>
