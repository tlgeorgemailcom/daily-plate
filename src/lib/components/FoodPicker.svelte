<script lang="ts">
  import { FOODS, GROUP_COLORS, GROUP_NAMES, type Food, type FoodGroup } from '$lib/data/food-portions';
  import { createEventDispatcher } from 'svelte';
  import { customFoods, type CustomFood } from '$lib/stores/customFoodsStore';
  import { getRecipeLegendItems, type NutritionLegendKey } from '$lib/farmers-basket/nutrition-legend';
  import { openNutritionLegend } from '$lib/stores/nutritionLegendStore';

  export type RecipeFood = Food & {
    isRecipe: true;
    gramsPerServing: number;
    recipeType?: 'developer' | 'community';
    sr28Rule?: 'Rule A' | 'Rule B' | 'Rule C' | 'Rule D' | null;
    isCommunityRecipe?: boolean;
    recipeOrigin?: 'turso-dev' | 'turso-community' | 'ts-builtin' | null;
    micros?: Record<string, number | null> | null;
  };
  type SearchScope = 'all' | 'baby';

  const dispatch = createEventDispatcher<{ select: Food; addCustom: string }>();

  let {
    recipeFoods = [],
    enableBabyScope = false,
    promoteBabyScope = false,
    allowFullDatabaseSearch = false,
    hasPaidRecipeAccess = false,
    playerId = null
  }: {
    recipeFoods?: RecipeFood[];
    enableBabyScope?: boolean;
    promoteBabyScope?: boolean;
    allowFullDatabaseSearch?: boolean;
    hasPaidRecipeAccess?: boolean;
    playerId?: string | null;
  } = $props();
  
  function handleAddCustomFood() {
    // Pass current search query to pre-populate the form
    dispatch('addCustom', searchQuery.trim());
  }

  let searchQuery = $state('');
  let selectedGroup = $state<FoodGroup | 'all' | 'recipes'>('all');
  let searchScope = $state<SearchScope>('all');
  let remoteFoods = $state<Food[]>([]);
  let remoteLoading = $state(false);
  let remoteError = $state<string | null>(null);
  let remoteRequested = $state(false);
  
  // Long-press tooltip state
  let tooltipFood = $state<Food | null>(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  let nutrientDisplayMode = $state<'serving' | 'per100g'>('serving');
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let pointerStartPos = { x: 0, y: 0 };
  const SCROLL_THRESHOLD = 10; // pixels of movement to cancel long press
  
  const allGroups: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein', 'dairy', 'legume', 'nuts', 'fats', 'spice', 'prepared', 'sweets', 'beverage'];

  // Convert custom foods to Food format
  function customToFood(cf: CustomFood): Food & { isCustom: true } {
    return {
      word: cf.name,
      display: cf.name,
      desc: `Custom food - ${cf.calories} cal/100g`,
      ndb: cf.id,
      cal: cf.calories,
      pro: cf.protein,
      fat: cf.fat,
      carb: cf.carbs,
      fib: cf.fiber,
      sug: cf.sugar,
      h2o: cf.water,
      groups: [cf.foodGroup],
      portions: cf.portions,
      isCustom: true
    };
  }

  function matchesQuery(food: Food, queryWords: string[]): boolean {
    if (queryWords.length === 0) return true;

    const displayLower = food.display.toLowerCase();
    return queryWords.every(word => {
      const variations = [word];
      if (word.endsWith('s') && word.length > 2) {
        variations.push(word.slice(0, -1));
      }

      return variations.some(qw => {
        const regex = new RegExp(`\\b${qw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
        return regex.test(displayLower);
      });
    });
  }

  function normalizeExactName(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function isPaidTierSearchEnabled(): boolean {
    return hasPaidRecipeAccess;
  }

  function recipeIcon(food: RecipeFood): string {
    if (food.recipeType === 'developer') return '🧪';
    if (food.recipeType === 'community') return '👥';
    return '🍽️';
  }

  function recipeSourceBadges(food: RecipeFood) {
    return getRecipeLegendItems({
      sr28Rule: food.sr28Rule ?? null,
      isCommunityRecipe: food.isCommunityRecipe ?? food.recipeType === 'community'
    });
  }

  function isRecipeFallback(food: RecipeFood): boolean {
    return food.recipeOrigin === 'ts-builtin';
  }

  function recipeOriginTitle(food: RecipeFood): string {
    return isRecipeFallback(food)
      ? 'TS fallback: using generated TypeScript recipe data because Turso recipe row is unavailable.'
      : 'Live Turso row';
  }

  function openFallbackPopup(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    alert('Remote API failure. Fallback to file initiated.');
  }

  function openSourceLegend(key: NutritionLegendKey, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    openNutritionLegend(key);
  }

  function sortAlphabetically<T extends Food>(foods: T[]): T[] {
    return [...foods].sort((a, b) => a.display.localeCompare(b.display));
  }

  function dedupeFoods<T extends Food>(foods: T[]): T[] {
    const seen = new Set<string>();
    return foods.filter((food) => {
      const normalized = normalizeExactName(food.display);
      if (!normalized) return false;
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }

  const canUseRemoteSearch = $derived(allowFullDatabaseSearch && searchQuery.trim().length >= 2 && selectedGroup !== 'recipes');
  const useRemoteSearch = $derived(canUseRemoteSearch && remoteRequested);

  $effect(() => {
    searchQuery;
    selectedGroup;
    searchScope;
    remoteRequested = false;
    remoteFoods = [];
    remoteLoading = false;
    remoteError = null;
  });

  $effect(() => {
    if (!enableBabyScope && searchScope !== 'all') {
      searchScope = 'all';
    }
  });

  $effect(() => {
    if (!useRemoteSearch) {
      remoteFoods = [];
      remoteLoading = false;
      remoteError = null;
      return;
    }

    const query = searchQuery.trim();
    let cancelled = false;
    remoteLoading = true;
    remoteError = null;

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query, limit: '80', scope: searchScope });
        if (playerId) params.set('playerId', playerId);
        const res = await fetch(`/api/foods/search?${params.toString()}`);
        const data = await res.json() as { foods?: Food[] };
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!cancelled) {
          remoteFoods = data.foods ?? [];
          remoteLoading = false;
        }
      } catch (error) {
        if (!cancelled) {
          console.error('[FoodPicker] remote SR28 search failed:', error);
          remoteFoods = [];
          remoteLoading = false;
          remoteError = 'search_failed';
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  });

  const filteredFoods = $derived(() => {
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    let foods: (Food | (Food & { isCustom: true }) | RecipeFood)[];
    const paidTierSearch = isPaidTierSearchEnabled();
    const customAsFoods = sortAlphabetically($customFoods.map(customToFood));
    const matchedCustomFoods = sortAlphabetically(customAsFoods.filter(food => matchesQuery(food, queryWords)));
    const matchedRecipeFoods = recipeFoods
      .filter(food => matchesQuery(food, queryWords))
      .sort((a, b) => {
        const aRank = a.type === 'developer' ? 0 : 1;
        const bRank = b.type === 'developer' ? 0 : 1;
        if (aRank !== bRank) return aRank - bRank;
        return a.display.localeCompare(b.display);
      });
    const matchedCuratedFoods = sortAlphabetically(FOODS.filter(food => matchesQuery(food, queryWords)));

    if (useRemoteSearch) {
      const filteredRemoteFoods = sortAlphabetically((selectedGroup === 'all'
        ? remoteFoods
        : remoteFoods.filter(food => food.groups.includes(selectedGroup as FoodGroup))));

      const curatedFoodsForGroup = selectedGroup === 'all'
        ? matchedCuratedFoods
        : matchedCuratedFoods.filter(food => food.groups.includes(selectedGroup as FoodGroup));

      foods = selectedGroup === 'recipes'
        ? matchedRecipeFoods
        : paidTierSearch
          ? [...matchedCustomFoods, ...matchedRecipeFoods, ...curatedFoodsForGroup, ...filteredRemoteFoods]
          : [...matchedCustomFoods, ...curatedFoodsForGroup, ...filteredRemoteFoods];
      foods = dedupeFoods(foods);
    } else {
      foods = selectedGroup === 'recipes'
        ? (paidTierSearch ? [...matchedRecipeFoods] : [])
        : paidTierSearch
          ? dedupeFoods([...matchedCustomFoods, ...matchedRecipeFoods, ...matchedCuratedFoods])
          : [...customAsFoods, ...FOODS];
    }
    
    // Filter by group
    if (selectedGroup !== 'all' && selectedGroup !== 'recipes') {
      const group = selectedGroup as FoodGroup;
      foods = foods.filter(f => f.groups.includes(group));
    }
    
    // Filter by search - split into words and require ALL words to match (AND logic)
    // Also handle basic plurals by stripping trailing 's'
    if (queryWords.length > 0) {
      foods = foods.filter(f => matchesQuery(f, queryWords));
    }
    
    if (queryWords.length === 0) {
      return foods.sort((a, b) => a.display.localeCompare(b.display));
    }
    if (paidTierSearch) {
      return sortAlphabetically(foods);
    }
    // Rank: exact word match > prefix match, then by position (earlier = better),
    // then shorter name (more specific), then alphabetical
    const q0 = queryWords[0];
    const matchScore = (s: string) => {
      const ws = s.toLowerCase().split(/\s+/);
      const idx = ws.findIndex(w => w.startsWith(q0));
      if (idx === -1) return { pos: 999, exact: false };
      return { pos: idx, exact: ws[idx] === q0 };
    };
    return foods.sort((a, b) => {
      const sa = matchScore(a.display), sb = matchScore(b.display);
      // Exact word match beats prefix-only match
      if (sa.exact !== sb.exact) return sa.exact ? -1 : 1;
      const posDiff = sa.pos - sb.pos;
      if (posDiff !== 0) return posDiff;
      const lenDiff = a.display.split(/\s+/).length - b.display.split(/\s+/).length;
      if (lenDiff !== 0) return lenDiff;
      return a.display.localeCompare(b.display);
    });
  });

  function selectFood(food: Food) {
    dispatch('select', food);
  }

  function requestRemoteSearch() {
    if (!canUseRemoteSearch) return;
    remoteRequested = true;
  }

  function handlePointerDown(event: PointerEvent, food: Food) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Store starting position for scroll detection
    pointerStartPos = { x: event.clientX, y: event.clientY };
    
    longPressTimer = setTimeout(() => {
      tooltipFood = food;
      nutrientDisplayMode = 'serving';
      tooltipPosition = { 
        x: rect.left + rect.width / 2, 
        y: rect.top 
      };
    }, 500); // 500ms for long press
  }

  function handlePointerMove(event: PointerEvent) {
    if (!longPressTimer) return;
    
    // Cancel long press if finger moved too much (scrolling)
    const dx = Math.abs(event.clientX - pointerStartPos.x);
    const dy = Math.abs(event.clientY - pointerStartPos.y);
    
    if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handlePointerUp() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handlePointerLeave() {
    handlePointerUp();
  }

  function closeTooltip() {
    tooltipFood = null;
    nutrientDisplayMode = 'serving';
  }
</script>

<div class="food-picker">
  <!-- Search -->
  <div class="search-bar">
    <input 
      type="text" 
      placeholder="Search foods..." 
      bind:value={searchQuery}
      class="search-input"
    />
    <button class="add-custom-btn" onclick={handleAddCustomFood}>
      ➕ Add Custom Food
    </button>
  </div>

  {#if enableBabyScope}
    <div class="scope-tabs" class:scope-tabs-promoted={promoteBabyScope}>
      <button
        class="scope-tab"
        class:active={searchScope === 'all'}
        onclick={() => searchScope = 'all'}
      >
        All Foods
      </button>
      <button
        class="scope-tab scope-tab-baby"
        class:active={searchScope === 'baby'}
        onclick={() => searchScope = 'baby'}
      >
        Baby Food & Formulas
      </button>
    </div>
  {/if}

  <!-- Group filter tabs -->
  <div class="group-tabs">
    <button 
      class="tab" 
      class:active={selectedGroup === 'all'}
      onclick={() => selectedGroup = 'all'}
    >
      All
    </button>
    {#each allGroups as group}
      <button 
        class="tab"
        class:active={selectedGroup === group}
        style="--group-color: {GROUP_COLORS[group]}"
        onclick={() => selectedGroup = group}
      >
        {GROUP_NAMES[group]}
      </button>
    {/each}
    {#if recipeFoods.length > 0}
      <button
        class="tab tab-recipes"
        class:active={selectedGroup === 'recipes'}
        onclick={() => selectedGroup = 'recipes'}
      >
        🍽️ Recipes
      </button>
    {/if}
  </div>

  <!-- Food list -->
  <div class="food-list">
    {#if remoteLoading}
      <div class="search-status">Searching curated foods first, then DataCentralCombo…</div>
    {:else if remoteError}
      <div class="search-status search-status-error">DataCentralCombo fallback search is unavailable right now.</div>
    {/if}

    {#each filteredFoods() as food}
      <div class="food-row" class:recipe-row={'isRecipe' in food && food.isRecipe}>
        <button 
          class="food-item" 
          class:custom-food={'isCustom' in food && food.isCustom}
          class:recipe-food={'isRecipe' in food && food.isRecipe}
          onclick={() => selectFood(food)}
          onpointerdown={(e) => handlePointerDown(e, food)}
          onpointermove={handlePointerMove}
          onpointerup={handlePointerUp}
          onpointerleave={handlePointerLeave}
          onpointercancel={handlePointerUp}
          oncontextmenu={(e) => e.preventDefault()}
        >
          <span class="food-name">
            {'isCustom' in food && food.isCustom ? '🏠 ' : ''}{'isRecipe' in food && food.isRecipe ? `${recipeIcon(food as RecipeFood)} ` : ''}{food.display}
          </span>
          <span class="food-cal">
            {'isRecipe' in food && food.isRecipe
              ? `${Math.round(food.cal * (food as RecipeFood).gramsPerServing / 100)} cal/serving`
              : `${Math.round(food.cal)} cal/100g`}
          </span>
        </button>

        {#if 'isRecipe' in food && food.isRecipe}
          <div class="recipe-source-badges">
            {#if isRecipeFallback(food as RecipeFood)}
              <button
                type="button"
                class="origin-fallback-dot"
                title={recipeOriginTitle(food as RecipeFood)}
                aria-label={recipeOriginTitle(food as RecipeFood)}
                onclick={openFallbackPopup}
              />
            {/if}
            {#each recipeSourceBadges(food as RecipeFood) as badge (badge.key)}
              <a
                href="#recipe-badge-guide"
                class="source-badge"
                class:shared={badge.key === 'shared'}
                onclick={(event) => openSourceLegend(badge.key, event)}
                title={badge.title}
                aria-label={badge.title}
              >
                {badge.label}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {/each}

    {#if canUseRemoteSearch && !remoteRequested && filteredFoods().length > 0}
      <button class="load-more-btn" onclick={requestRemoteSearch}>
        Search Full Database for more results
      </button>
    {:else if canUseRemoteSearch && !remoteRequested && filteredFoods().length === 0}
      <button class="load-more-btn" onclick={requestRemoteSearch}>
        Search Full Database
      </button>
    {/if}
    
    {#if filteredFoods().length === 0}
      <div class="no-results">No foods found</div>
    {/if}
  </div>
</div>

<!-- USDA Description Tooltip -->
{#if tooltipFood}
  <div class="tooltip-overlay" onclick={closeTooltip} onkeydown={(e) => e.key === 'Escape' && closeTooltip()} role="button" tabindex="0">
    <div 
      class="tooltip"
      onclick={(e) => e.stopPropagation()}
      style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
    >
      <div class="tooltip-header">
        <strong>{tooltipFood.display}</strong>
        <button class="tooltip-close" onclick={closeTooltip}>✕</button>
      </div>
      <p class="tooltip-description">
        <span class="usda-desc">{tooltipFood.desc}</span>
        <span class="group-info">Groups: {tooltipFood.groups.join(', ')}</span>
        <span class="ndb-info">{'isRecipe' in tooltipFood ? `${recipeIcon(tooltipFood as RecipeFood)} ${(tooltipFood as RecipeFood).recipeType === 'developer' ? 'Developer recipe' : (tooltipFood as RecipeFood).recipeType === 'community' ? 'Community recipe' : 'Recipe'}${isRecipeFallback(tooltipFood as RecipeFood) ? ' · Fallback source' : ''} · ${recipeSourceBadges(tooltipFood as RecipeFood).map((b) => b.label).join(' · ')}` : `USDA NDB#${tooltipFood.ndb}`}</span>
      </p>
      {#if 'isRecipe' in tooltipFood && (tooltipFood as RecipeFood).micros}
        {@const micros = (tooltipFood as RecipeFood).micros!}
        {@const gramsPerServing = Math.max(1, Number((tooltipFood as RecipeFood).gramsPerServing ?? 100))}
        {@const amountScale = nutrientDisplayMode === 'serving' ? gramsPerServing / 100 : 1}
        {@const amountLabel = nutrientDisplayMode === 'serving' ? `per serving (${Math.round(gramsPerServing)}g)` : 'per 100g'}
        {@const NUTRIENT_ROWS: Array<{ key: string; label: string; rule: 'required' | 'optional' | 'other' }> = [
          // Nutrition label required core (latest FDA format)
          { key: 'Energy_KCal', label: 'Calories (kcal)', rule: 'required' },
          { key: 'TotalLipidFat', label: 'Total fat (g)', rule: 'required' },
          { key: 'FattyAcids_totalSaturated', label: 'Saturated fat (g)', rule: 'required' },
          { key: 'Cholesterol', label: 'Cholesterol (mg)', rule: 'required' },
          { key: 'Sodium_Na', label: 'Sodium (mg)', rule: 'required' },
          { key: 'Carbohydrate', label: 'Total carbohydrate (g)', rule: 'required' },
          { key: 'FiberTotalDietary', label: 'Dietary fiber (g)', rule: 'required' },
          { key: 'SugarsTotal', label: 'Total sugars (g)', rule: 'required' },
          { key: 'AddedSugars', label: 'Added sugars (g)', rule: 'required' },
          { key: 'Protein', label: 'Protein (g)', rule: 'required' },
          { key: 'VitaminD', label: 'Vitamin D (mcg)', rule: 'required' },
          { key: 'Calcium_Ca', label: 'Calcium (mg)', rule: 'required' },
          { key: 'Iron_Fe', label: 'Iron (mg)', rule: 'required' },
          { key: 'Potassium_K', label: 'Potassium (mg)', rule: 'required' },

          // Nutrition label optional disclosures
          { key: 'FattyAcids_totalMonounsaturated', label: 'Monounsaturated fat (g)', rule: 'optional' },
          { key: 'FattyAcids_totalPolyunsaturated', label: 'Polyunsaturated fat (g)', rule: 'optional' },
          { key: 'VitaminA_RAE', label: 'Vitamin A (mcg)', rule: 'optional' },
          { key: 'VitaminC_totalAscorbicAcid', label: 'Vitamin C (mg)', rule: 'optional' },

          // Other available per-100g nutrients (not standard label lines)
          { key: 'Water', label: 'Water (g)', rule: 'other' },
          { key: 'LinoleicAcid', label: 'Linoleic (g)', rule: 'other' },
          { key: 'alphaLinolenicAcid', label: 'ALA (g)', rule: 'other' },
          { key: 'EPA_20_5n3', label: 'EPA (g)', rule: 'other' },
          { key: 'DPA_22_5n3', label: 'DPA (g)', rule: 'other' },
          { key: 'DHA_22_6n3', label: 'DHA (g)', rule: 'other' },
          { key: 'omega3', label: 'Omega-3 (g)', rule: 'other' },
          { key: 'omega6', label: 'Omega-6 (g)', rule: 'other' },
          { key: 'Retinol', label: 'Retinol (mcg)', rule: 'other' },
          { key: 'Carotene_beta', label: 'Beta-carotene (mcg)', rule: 'other' },
          { key: 'VitaminE_alphaTocopherol', label: 'Vitamin E (mg)', rule: 'other' },
          { key: 'VitaminK_phylloquinone', label: 'Vitamin K (mcg)', rule: 'other' },
          { key: 'Thiamin', label: 'Thiamin (mg)', rule: 'other' },
          { key: 'Riboflavin', label: 'Riboflavin (mg)', rule: 'other' },
          { key: 'Niacin', label: 'Niacin (mg)', rule: 'other' },
          { key: 'PantothenicAcid', label: 'Pantothenic acid (mg)', rule: 'other' },
          { key: 'VitaminB6', label: 'Vitamin B6 (mg)', rule: 'other' },
          { key: 'Folate_total', label: 'Folate total (mcg)', rule: 'other' },
          { key: 'Folate_food', label: 'Folate food (mcg)', rule: 'other' },
          { key: 'Folate_DFE', label: 'Folate DFE (mcg)', rule: 'other' },
          { key: 'FolicAcid', label: 'Folic acid (mcg)', rule: 'other' },
          { key: 'VitaminB12', label: 'Vitamin B12 (mcg)', rule: 'other' },
          { key: 'Choline_total', label: 'Choline (mg)', rule: 'other' },
          { key: 'Betaine', label: 'Betaine (mg)', rule: 'other' },
          { key: 'LuteinZeaxanthin', label: 'Lutein + Zeaxanthin (mcg)', rule: 'other' },
          { key: 'Lycopene', label: 'Lycopene (mcg)', rule: 'other' },
          { key: 'Magnesium_Mg', label: 'Magnesium (mg)', rule: 'other' },
          { key: 'Phosphorus_P', label: 'Phosphorus (mg)', rule: 'other' },
          { key: 'Zinc_Zn', label: 'Zinc (mg)', rule: 'other' },
          { key: 'Copper_Cu', label: 'Copper (mg)', rule: 'other' },
          { key: 'Manganese_Mn', label: 'Manganese (mg)', rule: 'other' },
          { key: 'Selenium_Se', label: 'Selenium (mcg)', rule: 'other' },
          { key: 'Tryptophan', label: 'Tryptophan (g)', rule: 'other' },
          { key: 'Threonine', label: 'Threonine (g)', rule: 'other' },
          { key: 'Isoleucine', label: 'Isoleucine (g)', rule: 'other' },
          { key: 'Leucine', label: 'Leucine (g)', rule: 'other' },
          { key: 'Lysine', label: 'Lysine (g)', rule: 'other' },
          { key: 'Methionine', label: 'Methionine (g)', rule: 'other' },
          { key: 'Cystine', label: 'Cystine (g)', rule: 'other' },
          { key: 'Phenylalanine', label: 'Phenylalanine (g)', rule: 'other' },
          { key: 'Tyrosine', label: 'Tyrosine (g)', rule: 'other' },
          { key: 'Valine', label: 'Valine (g)', rule: 'other' },
          { key: 'Arginine', label: 'Arginine (g)', rule: 'other' },
          { key: 'Histidine', label: 'Histidine (g)', rule: 'other' },
          { key: 'Alanine', label: 'Alanine (g)', rule: 'other' },
          { key: 'AsparticAcid', label: 'Aspartic acid (g)', rule: 'other' },
          { key: 'GlutamicAcid', label: 'Glutamic acid (g)', rule: 'other' },
          { key: 'Glycine', label: 'Glycine (g)', rule: 'other' },
          { key: 'Proline', label: 'Proline (g)', rule: 'other' },
          { key: 'Serine', label: 'Serine (g)', rule: 'other' },
        ]}
        {@const satFat = Number(micros.FattyAcids_totalSaturated ?? 0)}
        {@const monoFat = Number(micros.FattyAcids_totalMonounsaturated ?? 0)}
        {@const polyFat = Number(micros.FattyAcids_totalPolyunsaturated ?? 0)}
        {@const totalFat = Number(micros.TotalLipidFat ?? 0)}
        {@const otherFat = Math.max(0, totalFat - satFat - monoFat - polyFat)}
        <div class="micros-grid">
          <div class="micros-head">
            <div class="micros-title">Nutrient label view ({amountLabel})</div>
            <div class="micros-units-toggle">
              <button
                type="button"
                class="units-btn"
                class:active={nutrientDisplayMode === 'serving'}
                onclick={() => nutrientDisplayMode = 'serving'}
              >Per serving</button>
              <button
                type="button"
                class="units-btn"
                class:active={nutrientDisplayMode === 'per100g'}
                onclick={() => nutrientDisplayMode = 'per100g'}
              >Per 100g</button>
            </div>
          </div>
          <div class="micros-subtitle">Required and optional label nutrients are listed first. Fat subtypes may not fully sum to total fat due to source-data rounding and unclassified fatty components.</div>
          {#each NUTRIENT_ROWS as row (row.key)}
            {#if micros[row.key] != null}
              <div class="micro-row">
                <span class="micro-label">{row.label} <span class="micro-rule {row.rule}">{row.rule === 'required' ? 'required label' : row.rule === 'optional' ? 'optional label' : 'other nutrient'}</span></span>
                <span class="micro-value">{((micros[row.key] as number) * amountScale).toFixed(2)}</span>
              </div>
            {/if}
          {/each}
          {#if totalFat > 0 && otherFat > 0.01}
            <div class="micro-row">
              <span class="micro-label">Other / unspecified fat (g) <span class="micro-rule other">other nutrient</span></span>
              <span class="micro-value">{(otherFat * amountScale).toFixed(2)}</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .food-picker {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    max-height: 500px;
  }

  .search-bar {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .add-custom-btn {
    align-self: flex-start;
    padding: 0.375rem 0.75rem;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 0.375rem;
    color: #166534;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .add-custom-btn:hover {
    background: #dcfce7;
    border-color: #4ade80;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .group-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .scope-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .scope-tabs-promoted {
    padding: 0.55rem;
    border: 1px solid #fed7aa;
    border-radius: 0.75rem;
    background: #fff7ed;
  }

  .scope-tab {
    padding: 0.35rem 0.7rem;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    background: white;
    color: #334155;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .scope-tab:hover {
    background: #f8fafc;
  }

  .scope-tab.active {
    background: #0f172a;
    color: white;
    border-color: transparent;
  }

  .scope-tab-baby.active {
    background: #9a3412;
  }

  .tab {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    background: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tab:hover {
    background: #f3f4f6;
  }

  .tab.active {
    background: var(--group-color, #3b82f6);
    color: white;
    border-color: transparent;
  }

  .tab-recipes {
    border-color: #fbbf24;
  }

  .tab-recipes:hover {
    background: #fef9c3;
  }

  .tab-recipes.active {
    background: #f59e0b;
    color: white;
    border-color: transparent;
  }

  .food-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .search-status {
    padding: 0.65rem 0.75rem;
    color: #475569;
    font-size: 0.82rem;
  }

  .search-status-error {
    color: #b91c1c;
  }

  .food-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    -webkit-user-select: none;
    user-select: none;
  }

  .food-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .food-row .food-item {
    flex: 1;
    min-width: 0;
  }

  .recipe-source-badges {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .origin-fallback-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 8px;
    block-size: 8px;
    margin: 0 2px;
    padding: 0;
    border-radius: 999px;
    border: 1px solid #fb923c;
    background: #fdba74;
    cursor: pointer;
    box-sizing: border-box;
  }

  .origin-fallback-dot:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
  }

  .source-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 52px;
    padding: 4px 0;
    border-radius: 999px;
    border: 1px solid #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-transform: uppercase;
    cursor: pointer;
    box-sizing: border-box;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .source-badge.shared {
    border-color: #c4b5fd;
    color: #6d28d9;
    background: #f5f3ff;
  }

  .source-badge:hover {
    background: #dbeafe;
    border-color: #3b82f6;
  }

  .source-badge.shared:hover {
    background: #ede9fe;
    border-color: #8b5cf6;
  }

  .source-badge:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .source-badge.shared:focus-visible {
    outline-color: #7c3aed;
  }

  .food-item:hover {
    background: #f9fafb;
    border-color: #3b82f6;
  }

  .food-item.custom-food {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .food-item.custom-food:hover {
    background: #dcfce7;
    border-color: #4ade80;
  }

  .food-item.recipe-food {
    background: #fffbeb;
    border-color: #fde68a;
  }

  .food-item.recipe-food:hover {
    background: #fef3c7;
    border-color: #f59e0b;
  }

  .load-more-btn {
    padding: 0.75rem 0.9rem;
    border: 1px dashed #94a3b8;
    border-radius: 0.5rem;
    background: #f8fafc;
    color: #0f172a;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
  }

  .load-more-btn:hover {
    background: #f1f5f9;
    border-color: #64748b;
  }

  .food-name {
    font-weight: 500;
    flex: 1;
  }

  .food-cal {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .no-results {
    padding: 2rem;
    text-align: center;
    color: #9ca3af;
  }

  /* Tooltip styles */
  .tooltip-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tooltip {
    position: fixed;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    max-width: 300px;
    width: 90%;
    transform: translate(-50%, -100%);
    margin-top: -1rem;
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .tooltip-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    color: #6b7280;
  }

  .tooltip-description {
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.5;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tooltip-description .usda-desc {
    font-style: italic;
    color: #1f2937;
    font-size: 0.95rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .tooltip-description .group-info {
    text-transform: capitalize;
    color: #4b5563;
  }

  .tooltip-description .ndb-info {
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .micros-grid {
    margin-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
    max-height: 260px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .micros-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-bottom: 0.35rem;
  }

  .micros-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .micros-units-toggle {
    display: inline-flex;
    gap: 0.25rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.15rem;
  }

  .units-btn {
    border: 0;
    background: transparent;
    color: #4b5563;
    font-size: 0.68rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0.35rem;
    cursor: pointer;
  }

  .units-btn.active {
    background: #ffffff;
    color: #111827;
    font-weight: 700;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  .micros-subtitle {
    font-size: 0.7rem;
    color: #6b7280;
    padding-bottom: 0.3rem;
  }

  .micro-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.75rem;
    padding: 0.1rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .micro-label {
    color: #4b5563;
    flex: 1;
  }

  .micro-rule {
    font-size: 0.66rem;
    font-weight: 600;
    margin-left: 0.35rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .micro-rule.required {
    color: #166534;
  }

  .micro-rule.optional {
    color: #92400e;
  }

  .micro-rule.other {
    color: #4b5563;
  }

  .micro-value {
    color: #111827;
    font-weight: 500;
    min-width: 4.5rem;
    text-align: right;
  }
</style>
