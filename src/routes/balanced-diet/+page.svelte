<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import FoodPicker from '$lib/components/FoodPicker.svelte';
  import PortionSelector from '$lib/components/PortionSelector.svelte';
  import PieChart from '$lib/components/PieChart.svelte';
  import ContainerButtons from '$lib/components/ContainerButtons.svelte';
  import MealButtons from '$lib/components/MealButtons.svelte';
  import MealColumns from '$lib/components/MealColumns.svelte';
  import FoodsAdded from '$lib/components/FoodsAdded.svelte';
  import NutrientPicker from '$lib/components/NutrientPicker.svelte';
  import AddCustomFoodModal from '$lib/components/AddCustomFoodModal.svelte';
  import { initializeCustomFoods } from '$lib/stores/customFoodsStore';
  import { 
    addFood, 
    clearFoods,
    selectedContainer, 
    targets,
    overallProgress,
    nutrientTargets,
    DEFAULT_NUTRIENT_TARGETS,
    nutrientProgress,
    selectedPieNutrient
  } from '$lib/stores/gameStore';
  import { gameSettings, updateSettings, DEFAULT_SETTINGS, getSettings } from '$lib/stores/settingsStore';
  import { initializeGameState, startAutoSave, startNewGame, getSavedGameTime, hasSavedGame } from '$lib/stores/gameStateStore';
  import type { Food, Portion } from '$lib/data/food-portions';

  let selectedFood = $state<Food | null>(null);
  let showSettings = $state(false);
  let showAddCustomFood = $state(false);
  let showNewGameConfirm = $state(false);
  let showRules = $state(false);
  let showHistoryInfo = $state(false);
  let customFoodPrefill = $state('');
  let lastSavedTime = $state<Date | null>(null);
  
  // Initialize from stored settings
  let calorieTarget = $state($gameSettings.calorieTarget);
  let customCalories = $state($gameSettings.customCalories);
  let isCustomCalories = $state($gameSettings.isCustomCalories);
  
  // Nutrient target inputs (empty = use default scaled to calories)
  let waterInput = $state($gameSettings.waterInput);
  let proteinInput = $state($gameSettings.proteinInput);
  let carbsInput = $state($gameSettings.carbsInput);
  let fatsInput = $state($gameSettings.fatsInput);
  let fiberInput = $state($gameSettings.fiberInput);
  let sugarInput = $state($gameSettings.sugarInput);

  // Editable macro ratios (% of calories)
  let proteinRatio = $state($gameSettings.proteinRatio);
  let carbsRatio = $state($gameSettings.carbsRatio);
  let fatsRatio = $state($gameSettings.fatsRatio);
  
  // Plate ratios (food group % - MyPlate inspired defaults)
  let vegPlateRatio = $state($gameSettings.vegPlateRatio);
  let fruitPlateRatio = $state($gameSettings.fruitPlateRatio);
  let grainPlateRatio = $state($gameSettings.grainPlateRatio);
  let proteinPlateRatio = $state($gameSettings.proteinPlateRatio);
  
  // Macro presets modal
  let showMacroHints = $state(false);
  
  // Initialize game state from localStorage on mount
  onMount(() => {
    // Load saved game state (foods, meals, etc.)
    initializeGameState();
    
    // Load custom foods from localStorage
    initializeCustomFoods();
    
    // Start auto-saving game state on any changes
    startAutoSave();
    
    // Get last saved time for history info
    lastSavedTime = getSavedGameTime();
  });
  
  // Auto-save settings when any value changes (like iOS settings)
  $effect(() => {
    // Only auto-save when settings panel is open
    if (!showSettings) return;
    
    // Read all settings to create dependencies
    const currentSettings = {
      calorieTarget,
      isCustomCalories,
      customCalories,
      proteinRatio,
      carbsRatio,
      fatsRatio,
      vegPlateRatio,
      fruitPlateRatio,
      grainPlateRatio,
      proteinPlateRatio,
      waterInput,
      proteinInput,
      carbsInput,
      fatsInput,
      fiberInput,
      sugarInput
    };
    
    // Apply settings to game stores
    const targetValue = currentSettings.isCustomCalories ? currentSettings.customCalories : currentSettings.calorieTarget;
    const clampedValue = Math.max(800, Math.min(5000, targetValue));
    
    targets.update(t => ({ 
      ...t, 
      totalCalories: clampedValue,
      groups: {
        ...t.groups,
        vegetable: currentSettings.vegPlateRatio,
        fruit: currentSettings.fruitPlateRatio,
        grain: currentSettings.grainPlateRatio,
        protein: currentSettings.proteinPlateRatio
      }
    }));
    
    const scaled = getScaledDefaults(clampedValue, currentSettings.proteinRatio, currentSettings.carbsRatio, currentSettings.fatsRatio);
    
    nutrientTargets.update(t => ({
      calories: clampedValue,
      water: currentSettings.waterInput ? parseInt(currentSettings.waterInput) : scaled.water,
      protein: currentSettings.proteinInput ? parseInt(currentSettings.proteinInput) : scaled.protein,
      carbohydrates: currentSettings.carbsInput ? parseInt(currentSettings.carbsInput) : scaled.carbohydrates,
      fats: currentSettings.fatsInput ? parseInt(currentSettings.fatsInput) : scaled.fats,
      fiber: currentSettings.fiberInput ? parseInt(currentSettings.fiberInput) : scaled.fiber,
      sugar: currentSettings.sugarInput ? parseInt(currentSettings.sugarInput) : scaled.sugar
    }));
    
    // Persist to localStorage
    updateSettings(currentSettings);
  });
  
  function openSettings() {
    showSettings = true;
  }
  
  function closeSettings() {
    showSettings = false;
  }
  
  // Macro preset options (from nutritional guidelines)
  const macroPresets = [
    { title: 'Maintenance', desc: 'Balanced for current weight', p: 25, f: 30, c: 45 },
    { title: 'Weight Loss', desc: 'Higher protein, lower carbs', p: 35, f: 30, c: 35 },
    { title: 'Muscle Building', desc: 'Higher protein & carbs', p: 30, f: 20, c: 50 },
    { title: 'Keto', desc: 'Very low carbs, high fat', p: 20, f: 75, c: 5 },
    { title: 'Endurance', desc: 'Higher carbs for energy', p: 18, f: 22, c: 60 },
    { title: 'Mediterranean', desc: 'Moderate, heart-healthy fats', p: 18, f: 38, c: 44 },
    { title: 'Low Fat', desc: 'Lower fat, higher carbs', p: 25, f: 15, c: 60 },
    { title: 'Low Carb', desc: 'Lower carbs, higher fat', p: 25, f: 60, c: 15 }
  ];
  
  function applyMacroPreset(preset: { p: number; f: number; c: number }) {
    proteinRatio = preset.p;
    fatsRatio = preset.f;
    carbsRatio = preset.c;
    showMacroHints = false;
  }

  // Calculate scaled defaults based on calorie target and current ratios
  const getScaledDefaults = (calories: number, pRatio: number, cRatio: number, fRatio: number) => ({
    water: DEFAULT_NUTRIENT_TARGETS.water, // Water doesn't scale with calories
    protein: Math.round((calories * pRatio / 100) / 4), // 4 cal/g protein
    carbohydrates: Math.round((calories * cRatio / 100) / 4), // 4 cal/g carbs
    fats: Math.round((calories * fRatio / 100) / 9), // 9 cal/g fat
    fiber: Math.round(14 * (calories / 1000)), // 14g per 1000 cal (USDA recommendation)
    sugar: Math.round((calories * 0.10) / 4) // 10% of calories max, 4 cal/g
  });

  // Current effective calorie target
  const effectiveCalories = $derived(isCustomCalories ? customCalories : calorieTarget);
  
  // Scaled defaults for display
  const scaledDefaults = $derived(getScaledDefaults(effectiveCalories, proteinRatio, carbsRatio, fatsRatio));
  
  // Check if ratios sum to ~100%
  const ratioTotal = $derived(proteinRatio + carbsRatio + fatsRatio);
  const ratioWarning = $derived(ratioTotal < 95 || ratioTotal > 105);
  
  // Plate ratio total check
  const plateTotal = $derived(vegPlateRatio + fruitPlateRatio + grainPlateRatio + proteinPlateRatio);
  const plateWarning = $derived(plateTotal !== 100);

  // Apply stored settings to game stores on mount
  onMount(() => {
    if (browser) {
      const settings = getSettings();
      const clampedValue = Math.max(800, Math.min(5000, settings.isCustomCalories ? settings.customCalories : settings.calorieTarget));
      
      // Update targets store with stored values
      targets.update(t => ({ 
        ...t, 
        totalCalories: clampedValue,
        groups: {
          ...t.groups,
          vegetable: settings.vegPlateRatio,
          fruit: settings.fruitPlateRatio,
          grain: settings.grainPlateRatio,
          protein: settings.proteinPlateRatio
        }
      }));
      
      // Update nutrient targets with stored values
      const scaled = getScaledDefaults(clampedValue, settings.proteinRatio, settings.carbsRatio, settings.fatsRatio);
      nutrientTargets.update(t => ({
        calories: clampedValue,
        water: settings.waterInput ? parseInt(settings.waterInput) : scaled.water,
        protein: settings.proteinInput ? parseInt(settings.proteinInput) : scaled.protein,
        carbohydrates: settings.carbsInput ? parseInt(settings.carbsInput) : scaled.carbohydrates,
        fats: settings.fatsInput ? parseInt(settings.fatsInput) : scaled.fats,
        fiber: settings.fiberInput ? parseInt(settings.fiberInput) : scaled.fiber,
        sugar: settings.sugarInput ? parseInt(settings.sugarInput) : scaled.sugar
      }));
    }
  });

  let container = $derived($selectedContainer);
  let progress = $derived($overallProgress);

  function handleFoodSelect(event: CustomEvent<Food>) {
    selectedFood = event.detail;
  }

  function handleAddCustomFood(event: CustomEvent<string>) {
    customFoodPrefill = event.detail;
    showAddCustomFood = true;
  }

  function handlePortionConfirm(event: CustomEvent<{ portion: Portion; customGrams?: number; quantity?: number }>) {
    if (selectedFood) {
      addFood(selectedFood, event.detail.portion, container, event.detail.customGrams, event.detail.quantity);
      selectedFood = null;
    }
  }

  function cancelSelection() {
    selectedFood = null;
  }

  function resetNutrientDefaults() {
    // Reset macro ratios to defaults
    proteinRatio = DEFAULT_SETTINGS.proteinRatio;
    carbsRatio = DEFAULT_SETTINGS.carbsRatio;
    fatsRatio = DEFAULT_SETTINGS.fatsRatio;
    // Reset plate ratios to MyPlate defaults
    vegPlateRatio = DEFAULT_SETTINGS.vegPlateRatio;
    fruitPlateRatio = DEFAULT_SETTINGS.fruitPlateRatio;
    grainPlateRatio = DEFAULT_SETTINGS.grainPlateRatio;
    proteinPlateRatio = DEFAULT_SETTINGS.proteinPlateRatio;
    // Clear custom gram inputs
    waterInput = DEFAULT_SETTINGS.waterInput;
    proteinInput = DEFAULT_SETTINGS.proteinInput;
    carbsInput = DEFAULT_SETTINGS.carbsInput;
    fatsInput = DEFAULT_SETTINGS.fatsInput;
    fiberInput = DEFAULT_SETTINGS.fiberInput;
    sugarInput = DEFAULT_SETTINGS.sugarInput;
  }
  
  let nutrients = $derived($nutrientProgress);
</script>

<svelte:head>
  <title>Balanced Diet Game</title>
  <style>
    html, body {
      overflow: hidden !important;
      width: 100vw !important;
      height: 100vh !important;
      min-width: 100vw !important;
    }
    .app {
      max-width: 100vw !important;
      width: 100vw !important;
      overflow: visible !important;
      padding: 0 !important;
    }
    .app main {
      width: 100vw !important;
      max-width: 100vw !important;
    }
  </style>
</svelte:head>

<div class="game-wrapper">
<div class="game-container">
  <!-- Header -->
  <header class="game-header">
    <h1>🥗 Balanced Diet</h1>
    <div class="header-actions">
      <button class="rules-btn" onclick={() => showRules = true}>
        📖 Rules
      </button>
      <button class="history-btn" onclick={() => { lastSavedTime = getSavedGameTime(); showHistoryInfo = true; }}>
        📜 History
      </button>
      <button class="settings-btn" onclick={openSettings}>
        ⚙️ Settings
      </button>
      <button class="new-game-btn" onclick={() => showNewGameConfirm = true}>
        🆕 New Game
      </button>
    </div>
  </header>

  <!-- History Info Modal -->
  {#if showHistoryInfo}
    <div class="modal-backdrop" onclick={() => showHistoryInfo = false}>
      <div class="history-modal" onclick={(e) => e.stopPropagation()}>
        <h3>📜 Game History</h3>
        <div class="history-content">
          {#if lastSavedTime}
            <p class="last-saved">
              <strong>Last saved:</strong><br/>
              {lastSavedTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          {:else}
            <p class="no-history">No saved game history yet.</p>
          {/if}
          
          <div class="history-warning">
            <span class="warning-icon">⚠️</span>
            <p>
              Your game data is stored locally on this device. 
              <strong>Clearing your browser history or data will also delete your game progress.</strong>
            </p>
          </div>
          
          <p class="history-note">
            Game progress auto-saves as you play. Your foods, meals, and settings are preserved between sessions.
          </p>
        </div>
        <button class="modal-close-btn" onclick={() => showHistoryInfo = false}>
          Got it!
        </button>
      </div>
    </div>
  {/if}

  <!-- Add Custom Food Modal -->
  {#if showAddCustomFood}
    <AddCustomFoodModal 
      prefillName={customFoodPrefill}
      on:close={() => showAddCustomFood = false}
      on:saved={() => showAddCustomFood = false}
    />
  {/if}

  <!-- Rules Modal -->
  {#if showRules}
    <div class="modal-backdrop" onclick={() => showRules = false}>
      <div class="rules-modal" onclick={(e) => e.stopPropagation()}>
        <h3>🥗 How to Play Balanced Diet</h3>
        <div class="rules-content">
          <p><strong>Build a balanced day of meals!</strong></p>
          
          <h4>🎯 Goal</h4>
          <p>Fill your plate to meet daily nutrient targets without exceeding limits on sugar.</p>
          
          <h4>🍽️ Adding Foods</h4>
          <ul>
            <li>Select a container size (Bowl, Plate, Cup, etc.)</li>
            <li>Choose a meal (Breakfast, Lunch, Dinner, Snacks)</li>
            <li>Search for foods and select portions</li>
            <li>Foods are added to your daily totals</li>
          </ul>
          
          <h4>📊 The Pie Chart</h4>
          <ul>
            <li><strong>Outer ring:</strong> Macronutrients (All Protein, Fat, Carbs)</li>
            <li><strong>Inner ring:</strong> MyPlate food groups (Veg, Fruit, Grain, Protein Rich)</li>
            <li>Crosshatch = target, Solid fill = consumed</li>
          </ul>
          
          <h4>🌟 Progress Bars</h4>
          <ul>
            <li><strong>Green:</strong> On track (within target)</li>
            <li><strong>Yellow:</strong> Getting close</li>
            <li><strong>Red:</strong> Over the limit (for sugar)</li>
            <li><strong>Tap</strong> the progress bar to show all bars, then tap one to display</li>
          </ul>
          
          <h4>⚙️ Settings</h4>
          <ul>
            <li>Adjust calorie target</li>
            <li>Customize macro ratios (P/F/C percentages)</li>
            <li>Set specific nutrient goals</li>
          </ul>
          
          <h4>💡 Tips</h4>
          <ul>
            <li>Balance protein-rich foods with vegetables and fruits</li>
            <li>Watch your sugar intake — it adds up fast!</li>
            <li>Fiber helps you stay full — aim for the target</li>
          </ul>
        </div>
        <button class="close-rules" onclick={() => showRules = false}>Got it!</button>
      </div>
    </div>
  {/if}

  <!-- New Game Confirmation Modal -->
  {#if showNewGameConfirm}
    <div class="modal-backdrop" onclick={() => showNewGameConfirm = false}>
      <div class="confirm-modal" onclick={(e) => e.stopPropagation()}>
        <h3>🆕 Start New Game?</h3>
        <p>This will clear all foods you've added and reset the game.</p>
        <p class="confirm-note">Your settings (calorie targets, ratios) will be kept.</p>
        <div class="confirm-actions">
          <button class="cancel-btn" onclick={() => showNewGameConfirm = false}>
            Cancel
          </button>
          <button class="confirm-btn" onclick={() => {
            startNewGame();
            showNewGameConfirm = false;
          }}>
            Start New Game
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Settings panel -->
  {#if showSettings}
    <div class="settings-panel">
      <div class="settings-section">
        <h4>Calorie Target</h4>
        <label>
          <select 
            value={isCustomCalories ? 'custom' : calorieTarget}
            onchange={(e) => {
              const val = e.currentTarget.value;
              if (val === 'custom') {
                isCustomCalories = true;
              } else {
                isCustomCalories = false;
                calorieTarget = parseInt(val);
              }
            }}
          >
            <option value={1200}>1,200 cal</option>
            <option value={1400}>1,400 cal</option>
            <option value={1600}>1,600 cal</option>
            <option value={1800}>1,800 cal</option>
            <option value={2000}>2,000 cal</option>
            <option value={2200}>2,200 cal</option>
            <option value={2400}>2,400 cal</option>
            <option value={2600}>2,600 cal</option>
            <option value={2800}>2,800 cal</option>
            <option value="custom">Custom...</option>
          </select>
          {#if isCustomCalories}
            <input 
              type="number" 
              bind:value={customCalories}
              min="800"
              max="5000"
              step="50"
              class="custom-input-small"
            />
          {/if}
        </label>
      </div>

      <div class="settings-section">
        <h4>
          Macro Ratios 
          <span class="ratio-hint">(should total ~100%)</span>
          <button class="hint-btn" onclick={() => showMacroHints = !showMacroHints} title="Show macro ratio presets">
            💡
          </button>
        </h4>
        
        {#if showMacroHints}
          <div class="macro-hints-panel">
            <div class="hints-header">
              <span>📊 Macro Ratio Presets <span style="font-weight: normal; opacity: 0.7;">(click to select)</span></span>
              <button class="close-hints" onclick={() => showMacroHints = false}>✕</button>
            </div>
            <div class="hints-list">
              {#each macroPresets as preset}
                <button 
                  class="preset-option"
                  onclick={() => applyMacroPreset(preset)}
                >
                  <div class="preset-title">{preset.title}</div>
                  <div class="preset-desc">{preset.desc}</div>
                  <div class="preset-ratios">
                    <span class="p">P:{preset.p}%</span>
                    <span class="f">F:{preset.f}%</span>
                    <span class="c">C:{preset.c}%</span>
                  </div>
                </button>
              {/each}
            </div>
            <p class="macro-hints-footer">Choose an option above to guide your macro and calorie targets. Consult a professional for personalized advice.</p>
          </div>
        {/if}
        
        <div class="ratio-inputs">
          <label class="ratio-input">
            <span>🥩 Protein</span>
            <input type="number" bind:value={proteinRatio} min="5" max="50" />
            <span class="unit">%</span>
          </label>
          <label class="ratio-input">
            <span>🧈 Fats</span>
            <input type="number" bind:value={fatsRatio} min="10" max="50" />
            <span class="unit">%</span>
          </label>
          <label class="ratio-input">
            <span>🍞 Carbs</span>
            <input type="number" bind:value={carbsRatio} min="20" max="70" />
            <span class="unit">%</span>
          </label>
          <span class="ratio-total" class:warning={ratioWarning}>
            Total: {ratioTotal}%
          </span>
        </div>
      </div>

      <div class="settings-section">
        <h4>Plate Ratios <span class="ratio-hint">(MyPlate inspired, should total 100%)</span></h4>
        <div class="ratio-inputs">
          <label class="ratio-input">
            <span>🥬 Vegetables</span>
            <input type="number" bind:value={vegPlateRatio} min="0" max="50" />
            <span class="unit">%</span>
          </label>
          <label class="ratio-input">
            <span>🍎 Fruit</span>
            <input type="number" bind:value={fruitPlateRatio} min="0" max="50" />
            <span class="unit">%</span>
          </label>
          <label class="ratio-input">
            <span>🌾 Grains</span>
            <input type="number" bind:value={grainPlateRatio} min="0" max="50" />
            <span class="unit">%</span>
          </label>
          <label class="ratio-input">
            <span>🍗 Protein</span>
            <input type="number" bind:value={proteinPlateRatio} min="0" max="50" />
            <span class="unit">%</span>
          </label>
          <span class="ratio-total" class:warning={plateWarning}>
            Total: {plateTotal}%
          </span>
        </div>
      </div>

      <div class="settings-section">
        <h4>Nutrient Targets</h4>
        <p class="ratio-hint">(P/F/C calculated from ratios and calorie target. The WHO recommends Fiber based on 14g/1000 calories and Sugar based on 10% of calories converted to grams (calories × 0.10/4). The AHA recommends 25g of sugar for women and 36g of sugar for men.)</p>
        <div class="nutrient-grid">
          <label class="nutrient-input">
            <span>💧 Water</span>
            <input type="number" bind:value={waterInput} placeholder="{scaledDefaults.water}" min="1" max="20" />
            <span class="unit">cups</span>
          </label>
          <label class="nutrient-input">
            <span>🥩 Protein</span>
            <input type="number" bind:value={proteinInput} placeholder="{scaledDefaults.protein}" min="10" max="300" />
            <span class="unit">g</span>
          </label>
          <label class="nutrient-input">
            <span>🍞 Carbs</span>
            <input type="number" bind:value={carbsInput} placeholder="{scaledDefaults.carbohydrates}" min="50" max="500" />
            <span class="unit">g</span>
          </label>
          <label class="nutrient-input">
            <span>🧈 Fats</span>
            <input type="number" bind:value={fatsInput} placeholder="{scaledDefaults.fats}" min="20" max="200" />
            <span class="unit">g</span>
          </label>
          <label class="nutrient-input">
            <span>🌾 Fiber</span>
            <input type="number" bind:value={fiberInput} placeholder="{scaledDefaults.fiber}" min="10" max="60" />
            <span class="unit">g min</span>
          </label>
          <label class="nutrient-input">
            <span>🍬 Sugar</span>
            <input type="number" bind:value={sugarInput} placeholder="{scaledDefaults.sugar}" min="10" max="150" />
            <span class="unit">g max</span>
          </label>
        </div>
      </div>

      <div class="settings-actions">
        <button class="reset-defaults-btn" onclick={resetNutrientDefaults}>Reset Defaults</button>
        <button class="close-btn" onclick={closeSettings}>Done</button>
      </div>
      <div class="autosave-notice">✓ Changes save automatically</div>
    </div>
  {/if}

  <!-- Main game area -->
  <div class="game-grid">
    <!-- Left: Container selection + Portion selector -->
    <div class="selection-area">
      <div class="container-section">
        <h3 class="section-title">1. Choose Container</h3>
        <ContainerButtons />
      </div>

      <div class="meal-section">
        <h3 class="section-title">2. Choose Meal</h3>
        <MealButtons />
      </div>

      <div class="portion-section">
        <h3 class="section-title">3. Select Portion</h3>
        {#if selectedFood}
          <PortionSelector 
            food={selectedFood}
            container={container}
            on:confirm={handlePortionConfirm}
          />
          <button class="cancel-btn" onclick={cancelSelection}>Cancel</button>
        {:else}
          <div class="no-food-selected">
            <p>👈 Pick a food from the list</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Center: Food picker (main area) -->
    <div class="picker-area">
      <FoodPicker on:select={handleFoodSelect} on:addCustom={handleAddCustomFood} />
    </div>

    <!-- Right: Pie chart + nutrient picker -->
    <div class="results-area">
      <PieChart />
      
      <!-- Nutrient bar chart (expandable) -->
      <NutrientPicker />
    </div>
    
    <!-- Today's Foods list (separate for grid positioning) -->
    <div class="foods-area">
      <div class="foods-columns-view">
        <MealColumns />
      </div>
      <div class="foods-list-view">
        <FoodsAdded />
      </div>
    </div>
  </div>
</div>
</div>

<style>
  .game-wrapper {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
    min-height: 0;
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .game-container {
    max-width: 1100px;
    width: 100%;
    height: auto;
    min-height: min-content;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-sizing: border-box;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
    position: relative;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 0.75rem;
    color: white;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .game-header h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .settings-btn, .new-game-btn, .rules-btn, .history-btn {
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 0.5rem;
    background: rgba(255,255,255,0.2);
    color: white;
    cursor: pointer;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .settings-btn:hover, .new-game-btn:hover, .rules-btn:hover, .history-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  @media (max-width: 480px) {
    .game-header {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    
    .game-header h1 {
      font-size: 1.25rem;
    }
    
    .header-actions {
      justify-content: center;
    }
  }

  /* New Game Confirmation Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .confirm-modal {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    max-width: 320px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  /* History Modal */
  .history-modal {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    max-width: 400px;
    text-align: left;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .history-modal h3 {
    margin: 0 0 1rem;
    color: #3b82f6;
  }

  .history-content {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .last-saved {
    background: #f0fdf4;
    border: 1px solid #22c55e;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .no-history {
    color: #6b7280;
    font-style: italic;
    margin-bottom: 1rem;
  }

  .history-warning {
    display: flex;
    gap: 0.5rem;
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .warning-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .history-warning p {
    margin: 0;
    font-size: 0.85rem;
  }

  .history-note {
    color: #6b7280;
    font-size: 0.8rem;
    margin: 0;
  }

  .modal-close-btn {
    display: block;
    width: 100%;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }

  .modal-close-btn:hover {
    background: #2563eb;
  }

  /* Rules Modal */
  .rules-modal {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    text-align: left;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .rules-modal h3 {
    margin: 0 0 1rem;
    color: #22c55e;
  }

  .rules-content {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .rules-content h4 {
    margin: 1rem 0 0.5rem;
    color: #16a34a;
  }

  .rules-content ul {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  .rules-content li {
    margin-bottom: 0.25rem;
  }

  .close-rules {
    display: block;
    width: 100%;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }

  .close-rules:hover {
    background: #16a34a;
  }

  .confirm-modal h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
  }

  .confirm-modal p {
    margin: 0 0 0.5rem 0;
    color: #4b5563;
    font-size: 0.95rem;
  }

  .confirm-note {
    font-size: 0.8rem !important;
    color: #6b7280 !important;
    font-style: italic;
  }

  .confirm-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .confirm-actions button {
    flex: 1;
    padding: 0.625rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .cancel-btn {
    background: #e5e7eb;
    color: #374151;
  }

  .cancel-btn:hover {
    background: #d1d5db;
  }

  .confirm-btn {
    background: #10b981;
    color: white;
  }

  .confirm-btn:hover {
    background: #059669;
  }

  .settings-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    max-height: 60vh;
    overflow-y: auto;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .settings-section h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.25rem;
  }

  .ratio-hint {
    font-weight: normal;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .hint-btn {
    background: none;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.15rem 0.35rem;
    opacity: 0.9;
    transition: opacity 0.2s, transform 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }

  .hint-btn:hover,
  .hint-btn:focus {
    opacity: 1;
    transform: scale(1.2);
    background: none;
    background-color: transparent;
    outline: none;
  }

  .macro-hints-panel {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .hints-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  .close-hints {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0 0.25rem;
  }

  .hints-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
  }

  .preset-option {
    background: #ffffff !important;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 0.4rem 0.5rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s;
  }

  .preset-option:hover {
    background: #f9fafb !important;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  .preset-title {
    font-weight: 600;
    font-size: 0.8rem;
    color: #1f2937;
  }

  .preset-desc {
    font-size: 0.7rem;
    color: #6b7280;
    margin: 0.15rem 0;
  }

  .preset-ratios {
    display: flex;
    gap: 0.4rem;
    font-size: 0.7rem;
    font-weight: 500;
  }

  .preset-ratios .p { color: #dc2626; }
  .preset-ratios .f { color: #ea580c; }
  .preset-ratios .c { color: #16a34a; }

  @media (max-width: 500px) {
    .hints-list {
      grid-template-columns: 1fr;
    }
  }

  .macro-hints-footer {
    font-size: 0.7rem;
    color: #6b7280;
    text-align: center;
    margin: 0.5rem 0 0 0;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .ratio-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .ratio-input {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
  }

  .ratio-input input {
    width: 50px;
    padding: 0.3rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.85rem;
    text-align: center;
  }

  .ratio-input input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .ratio-total {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    background: #d1fae5;
    color: #059669;
    border-radius: 0.25rem;
  }

  .ratio-total.warning {
    background: #fef3c7;
    color: #d97706;
  }

  .settings-panel label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .settings-panel select {
    padding: 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }

  .custom-input-small {
    width: 80px;
    padding: 0.4rem;
    border: 2px solid #3b82f6;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    text-align: center;
  }

  .nutrient-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .nutrient-input {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
  }

  .nutrient-input span:first-child {
    width: 70px;
  }

  .nutrient-input input {
    width: 60px;
    padding: 0.3rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.85rem;
    text-align: center;
  }

  .nutrient-input input::placeholder {
    color: #9ca3af;
  }

  .nutrient-input input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .nutrient-input .unit {
    font-size: 0.75rem;
    color: #6b7280;
    width: 35px;
  }

  .settings-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .reset-defaults-btn {
    padding: 0.4rem 0.75rem;
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .reset-defaults-btn:hover {
    background: #e5e7eb;
  }

  .autosave-notice {
    text-align: center;
    color: #059669;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem;
    background: #d1fae5;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
  }

  .close-btn {
    padding: 0.4rem 0.75rem;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .close-btn:hover {
    background: #4b5563;
  }

  .confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .confirm-popup {
    background: white;
    padding: 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    max-width: 320px;
    width: 90%;
  }

  .confirm-message {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    color: #374151;
    text-align: center;
  }

  .confirm-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .settings-panel button {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .settings-panel button.hint-btn {
    background: none;
    padding: 0.15rem 0.35rem;
    color: inherit;
    filter: brightness(0.7);
  }

  .custom-calories {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .custom-calories input {
    width: 100px;
    padding: 0.5rem;
    border: 2px solid #3b82f6;
    border-radius: 0.25rem;
    font-size: 1rem;
    text-align: center;
  }

  .custom-calories input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  .game-grid {
    display: grid;
    grid-template-columns: 280px minmax(300px, 500px) 320px;
    grid-template-rows: 1fr auto;
    gap: 1.5rem;
    flex: 1;
    min-height: 0;
    isolation: isolate;
    contain: layout style;
    justify-content: center;
  }

  .selection-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    position: relative;
    z-index: 1;
    min-width: 0;
    max-width: 100%;
    grid-column: 1;
    grid-row: 1;
  }

  .container-section {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  }

  .section-title {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .meal-section {
    background: white;
    border-radius: 0.75rem;
    padding: 0.75rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  }

  .portion-section {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 300px;
  }

  .no-food-selected {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    text-align: center;
  }

  .no-food-selected p {
    margin: 0;
    font-size: 1rem;
  }

  .cancel-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .cancel-btn:hover {
    background: #f3f4f6;
  }

  .picker-area {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
    min-width: 0;
    max-width: 100%;
    grid-column: 2;
    grid-row: 1;
  }

  .results-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
    min-width: 0;
    max-width: 100%;
    grid-column: 3;
    grid-row: 1;
    -webkit-overflow-scrolling: touch;
  }
  
  .foods-area {
    grid-column: 1 / 4;
    grid-row: 2;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 0;
    max-width: 100%;
  }
  
  /* Show columns view on wide screens, list view on narrow */
  .foods-columns-view {
    display: block;
  }
  
  .foods-list-view {
    display: none;
  }

  .progress-message {
    padding: 0.75rem 1.5rem;
    background: #f3f4f6;
    border-radius: 2rem;
    text-align: center;
  }

  .message {
    font-weight: 500;
  }

  .message.success {
    color: #16a34a;
  }

  .message.warning {
    color: #dc2626;
  }

  /* Responsive layouts */
  @media (max-width: 950px) {
    .game-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto 1fr;
      justify-content: stretch;
    }

    .selection-area {
      grid-column: 1;
      grid-row: 1;
    }

    .picker-area {
      grid-column: 2;
      grid-row: 1;
    }

    .results-area {
      grid-column: 1;
      grid-row: 2 / 4;
    }
    
    .foods-area {
      grid-column: 2;
      grid-row: 2 / 4;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    /* Swap views for 2-column layout */
    .foods-columns-view {
      display: none;
    }
    
    .foods-list-view {
      display: block;
    }
  }

  @media (max-width: 600px) {
    .game-grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto auto;
    }

    .selection-area,
    .picker-area,
    .results-area,
    .foods-area {
      grid-column: 1;
      grid-row: auto;
    }
    
    /* Use list view on mobile */
    .foods-columns-view {
      display: none;
    }
    
    .foods-list-view {
      display: block;
    }
  }
</style>
