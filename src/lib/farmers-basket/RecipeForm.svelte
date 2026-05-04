<script lang="ts">
  import { FOOD_EMOJI } from '$lib/farmers-basket/types';
  import { RECIPE_CATEGORY_OPTIONS, toStoredRecipeCategory } from '$lib/farmers-basket/recipe-categories';
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
    exempt?: boolean;        // explicitly marked as not nutritionally significant
  }
  
  export interface RecipeInstruction {
    id: number;
    text: string;
  }

  interface PersistedNutritionJson {
    perServing?: {
      cal?: number;
      pro?: number;
      fat?: number;
      carb?: number;
      fib?: number;
      sug?: number;
      h2o?: number;
    };
    per100g?: {
      Energy_KCal?: number;
      Protein?: number;
      TotalLipidFat?: number;
      Carbohydrate?: number;
      FiberTotalDietary?: number;
      SugarsTotal?: number;
    };
  }
  
  export interface RecipeFormData {
    recipeName: string;     // combined: "Dish Name — Suffix"
    dishName: string;       // common dish name e.g. "Apple Pie"
    recipeSuffix: string;   // personal suffix e.g. "Grandma's"
    cookingMethod: string;  // Bake | Boil | Grill | Fry | No heat
    category: string;
    dietaryCategory: DietaryCategory;
    submitterName: string;
    prepTime: string;
    servings: string;
    ingredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
    foodSupply?: Record<FoodType, number>; // How many of each food available in game
    nutritionComplete?: boolean;           // true when all ingredients have nutrition links
    linkMode?: 'ingredient' | 'dish' | 'mixed';
    dishLink?: { foodWord: string; ndbNo: string; portionDesc: string; portionGrams: number; servingCount: number };
    dishFamily?: string;
    nutritionJson?: PersistedNutritionJson;
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
    /** If true, suppresses the suggestion panel (useful in edit mode) */
    disableSuggestions?: boolean;
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
    customActions,
    disableSuggestions = false
  }: Props = $props();
  
  // Constants
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
  
  const COOKING_METHODS = ['Bake', 'Boil', 'Grill', 'Fry', 'No heat'];
  const LOCAL_FOODS_BY_NDB = new Map(FOODS.map(food => [food.ndb, food]));

  // Form state
  let recipeName = $state(initialData.recipeName || '');
  // Split existing recipeName into parts if present (format: "Dish Name — Suffix")
  let dishName = $state(initialData.dishName || (initialData.recipeName?.includes(' — ') ? initialData.recipeName.split(' — ')[0] : initialData.recipeName || ''));
  let recipeSuffix = $state(initialData.recipeSuffix || (initialData.recipeName?.includes(' — ') ? initialData.recipeName.split(' — ')[1] : ''));
  let cookingMethod = $state(initialData.cookingMethod || 'Bake');
  let dishFamily = $state(initialData.dishFamily || '');
  let category = $state(toStoredRecipeCategory(initialData.category));
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
          servingCount: ing.servingCount,
          exempt: ing.exempt
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
  let linkMode = $state(
    (initialData as RecipeFormData).linkMode ?? 'ingredient'
  );
  // ─── Dish-level link state (for 'dish' and 'mixed' modes) ───────────────────
  let dishSearchOpen = $state(false);
  let dishSearchQ = $state('');
  let dishPendingFood = $state<FoodData | null>(null);
  let dishPendingPortionIdx = $state(0);
  let dishPendingCount = $state(1);
  let dishCustomGrams = $state<number | null>(null);
  let dishLink = $state<{ foodWord: string; ndbNo: string; portionDesc: string; portionGrams: number; servingCount: number } | null>(
    (initialData as RecipeFormData).dishLink ?? null
  );
  // ─── Nutrition linking state (keyed by ingredient id) ───────────────────────
  let nutritionOpen = $state<Record<number, boolean>>({});
  let nutritionSearchQ = $state<Record<number, string>>({});
  let nutritionPendingFood = $state<Record<number, FoodData | null>>({});
  let nutritionPendingPortionIdx = $state<Record<number, number>>({});
  let nutritionPendingCount = $state<Record<number, number>>({});
  let nutritionCustomGrams = $state<Record<number, number | null>>({});
  let dishSearchResults = $state<FoodData[]>([]);
  let dishSearchLoading = $state(false);
  let nutritionSearchResults = $state<Record<number, FoodData[]>>({});
  let nutritionSearchLoading = $state<Record<number, boolean>>({});
  let dishSearchUsingFallback = $state(false);
  let nutritionSearchUsingFallback = $state<Record<number, boolean>>({});
  let dishSearchTimer: ReturnType<typeof setTimeout> | null = null;
  let dishSearchRequestId = 0;
  let nutritionSearchTimers = new Map<number, ReturnType<typeof setTimeout>>();
  let nutritionSearchRequestIds = new Map<number, number>();

  function normalizeSearchText(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function searchFoods(query: string): FoodData[] {
    if (!query.trim()) return [];
    const words = Array.from(
      new Set(normalizeSearchText(query).split(/\s+/).filter(w => w.length > 0))
    );
    if (words.length === 0) return [];
    const queryNorm = normalizeSearchText(query);
    const scored = FOODS.map((f) => {
      const displayNorm = normalizeSearchText(f.display);
      const descNorm = normalizeSearchText(f.desc);
      const synonymsNorm = (f.synonyms ?? []).map(s => normalizeSearchText(s)).join(' ');
      const searchSpace = `${displayNorm} ${descNorm} ${synonymsNorm}`;
      const overlap = words.filter(w => searchSpace.includes(w)).length;
      if (overlap === 0) return null;

      // Encourage broader matches for verbose ingredient names.
      // For 1-word queries require 1 hit; otherwise allow >=1 token but rank higher by overlap.
      const requires = words.length <= 1 ? 1 : 1;
      if (overlap < requires) return null;

      const firstPos = words.reduce((best, w) => {
        const p = searchSpace.indexOf(w);
        if (p === -1) return best;
        return best === -1 ? p : Math.min(best, p);
      }, -1);

      let score = overlap * 100;
      if (searchSpace.includes(queryNorm)) score += 220;
      if (displayNorm.includes(queryNorm)) score += 120;
      if (firstPos >= 0) score += Math.max(0, 80 - firstPos);
      score -= Math.max(0, displayNorm.split(/\s+/).length - words.length) * 2;

      return { food: f, score };
    }).filter((x): x is { food: FoodData; score: number } => x !== null);

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.food.display.localeCompare(b.food.display);
    });

    return scored.slice(0, 20).map(s => s.food);
  }

  function hydrateRemoteFoods(foods: FoodData[]): FoodData[] {
    return foods.map((food) => {
      const local = LOCAL_FOODS_BY_NDB.get(food.ndb);
      if (!local) return food;
      return {
        ...food,
        word: local.word,
        portions: local.portions?.length ? local.portions : food.portions,
        synonyms: local.synonyms ?? food.synonyms
      };
    });
  }

  async function fetchRemoteFoods(query: string, limit = 20): Promise<FoodData[]> {
    const params = new URLSearchParams({ q: query.trim(), limit: String(limit) });
    const res = await fetch(`/api/recipes/food-search?${params.toString()}`);
    const data = await res.json() as { foods?: FoodData[] };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return hydrateRemoteFoods(data.foods ?? []);
  }

  function queueDishFoodSearch(query: string) {
    if (dishSearchTimer) clearTimeout(dishSearchTimer);
    if (query.trim().length < 2) {
      dishSearchResults = [];
      dishSearchLoading = false;
      dishSearchUsingFallback = false;
      return;
    }

    const requestId = ++dishSearchRequestId;
    dishSearchLoading = true;
    dishSearchTimer = setTimeout(async () => {
      try {
        const foods = await fetchRemoteFoods(query, 20);
        if (requestId !== dishSearchRequestId) return;
        dishSearchResults = foods;
        dishSearchUsingFallback = false;
      } catch {
        if (requestId !== dishSearchRequestId) return;
        // Keep search usable if the SR28 endpoint is temporarily unavailable.
        dishSearchResults = searchFoods(query);
        dishSearchUsingFallback = true;
      } finally {
        if (requestId === dishSearchRequestId) {
          dishSearchLoading = false;
        }
      }
    }, 180);
  }

  function queueNutritionFoodSearch(ingredientId: number, query: string) {
    const existingTimer = nutritionSearchTimers.get(ingredientId);
    if (existingTimer) clearTimeout(existingTimer);

    if (query.trim().length < 2) {
      nutritionSearchResults = { ...nutritionSearchResults, [ingredientId]: [] };
      nutritionSearchLoading = { ...nutritionSearchLoading, [ingredientId]: false };
      nutritionSearchUsingFallback = { ...nutritionSearchUsingFallback, [ingredientId]: false };
      return;
    }

    const requestId = (nutritionSearchRequestIds.get(ingredientId) ?? 0) + 1;
    nutritionSearchRequestIds.set(ingredientId, requestId);
    nutritionSearchLoading = { ...nutritionSearchLoading, [ingredientId]: true };

    const timer = setTimeout(async () => {
      try {
        const foods = await fetchRemoteFoods(query, 20);
        if (nutritionSearchRequestIds.get(ingredientId) !== requestId) return;
        nutritionSearchResults = { ...nutritionSearchResults, [ingredientId]: foods };
        nutritionSearchUsingFallback = { ...nutritionSearchUsingFallback, [ingredientId]: false };
      } catch {
        if (nutritionSearchRequestIds.get(ingredientId) !== requestId) return;
        // Keep search usable if the SR28 endpoint is temporarily unavailable.
        nutritionSearchResults = {
          ...nutritionSearchResults,
          [ingredientId]: searchFoods(query)
        };
        nutritionSearchUsingFallback = {
          ...nutritionSearchUsingFallback,
          [ingredientId]: true
        };
      } finally {
        if (nutritionSearchRequestIds.get(ingredientId) === requestId) {
          nutritionSearchLoading = { ...nutritionSearchLoading, [ingredientId]: false };
        }
      }
    }, 180);

    nutritionSearchTimers.set(ingredientId, timer);
  }

  function openNutritionSearchFresh(ing: RecipeIngredient) {
    // Always go to search screen (change food)
    nutritionSearchQ = { ...nutritionSearchQ, [ing.id]: ing.name };
    nutritionPendingFood = { ...nutritionPendingFood, [ing.id]: null };
    nutritionCustomGrams = { ...nutritionCustomGrams, [ing.id]: null };
    nutritionOpen = { ...nutritionOpen, [ing.id]: true };
    queueNutritionFoodSearch(ing.id, ing.name);
  }

  function openNutritionSearch(ing: RecipeIngredient) {
    nutritionSearchQ = { ...nutritionSearchQ, [ing.id]: ing.name };
    nutritionOpen = { ...nutritionOpen, [ing.id]: true };
    // If already linked, skip search and pre-load the portion picker
    if (ing.foodWord || ing.ndbNo) {
      const existing = (ing.foodWord ? FOODS.find(f => f.word === ing.foodWord) : undefined)
        ?? (ing.ndbNo ? FOODS.find(f => f.ndb === ing.ndbNo) : undefined)
        ?? null;
      nutritionPendingFood = { ...nutritionPendingFood, [ing.id]: existing };
      if (existing) {
        // Restore current portion selection if possible
        const matchIdx = existing.portions.findIndex(p => p.desc === ing.portionDesc);
        const firstNamedIdx = existing.portions.findIndex(p => p.desc !== 'custom (g)');
        const fallbackIdx = firstNamedIdx >= 0 ? firstNamedIdx : 0;
        const resolvedIdx = matchIdx >= 0 ? matchIdx : fallbackIdx;
        const useIdx = existing.portions[resolvedIdx]?.desc === 'custom (g)' && firstNamedIdx >= 0
          ? firstNamedIdx
          : resolvedIdx;
        nutritionPendingPortionIdx = { ...nutritionPendingPortionIdx, [ing.id]: useIdx };
        nutritionPendingCount = { ...nutritionPendingCount, [ing.id]: ing.servingCount ?? 1 };
        // Restore custom grams if the previous link used a custom gram amount
        nutritionCustomGrams = { ...nutritionCustomGrams, [ing.id]: ing.portionDesc === 'g' ? (ing.portionGrams ?? null) : null };
      }
    } else {
      nutritionPendingFood = { ...nutritionPendingFood, [ing.id]: null };
      queueNutritionFoodSearch(ing.id, ing.name);
    }
  }

  function hasIngredientNutritionLink(ingredient: RecipeIngredient): boolean {
    return Boolean((ingredient.foodWord || ingredient.ndbNo) && ingredient.portionGrams);
  }

  function getIngredientNutritionLabel(ingredient: RecipeIngredient): string {
    return FOODS.find((food) => food.word === ingredient.foodWord || food.ndb === ingredient.ndbNo)?.display
      ?? ingredient.name
      ?? ingredient.ndbNo
      ?? 'Linked ingredient';
  }

  function selectPendingFood(ingId: number, food: FoodData) {
    nutritionPendingFood = { ...nutritionPendingFood, [ingId]: food };
    const firstNamedIdx = food.portions.findIndex(p => p.desc !== 'custom (g)');
    const defaultIdx = firstNamedIdx >= 0 ? firstNamedIdx : 0;
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
      const firstNamedIdx = food.portions.findIndex(p => p.desc !== 'custom (g)');
      const fallbackIdx = firstNamedIdx >= 0 ? firstNamedIdx : 0;
      const rawIdx = nutritionPendingPortionIdx[ingId] ?? fallbackIdx;
      const portionIdx = food.portions[rawIdx]?.desc === 'custom (g)' && firstNamedIdx >= 0
        ? firstNamedIdx
        : rawIdx;
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

  function setLinkMode(mode: 'ingredient' | 'dish' | 'mixed') {
    linkMode = mode;
    if (mode === 'ingredient') {
      dishLink = null;
      dishSearchOpen = false;
    }
  }

  function toggleExempt(ingId: number) {
    ingredients = ingredients.map(i => i.id === ingId ? { ...i, exempt: !i.exempt } : i);
  }

  let exemptInfoOpen = $state(false);
  let linkNutritionInfoOpen = $state(false);

  function confirmDishLink() {
    if (!dishPendingFood) return;
    const customG = dishCustomGrams;
    const count = dishPendingCount ?? 1;
    let portionDesc: string;
    let portionGrams: number;
    if (customG && customG > 0) {
      portionDesc = 'g';
      portionGrams = customG;
    } else {
      const portionIdx = dishPendingPortionIdx ?? (dishPendingFood.portions.length > 1 ? 1 : 0);
      const portion = dishPendingFood.portions[portionIdx] ?? dishPendingFood.portions[0];
      portionDesc = portion.desc;
      portionGrams = portion.gm;
    }
    dishLink = {
      foodWord: dishPendingFood.word,
      ndbNo: dishPendingFood.ndb,
      portionDesc,
      portionGrams,
      servingCount: count
    };
    dishSearchOpen = false;
    dishPendingFood = null;
  }

  let nutritionLinkedCount = $derived(
    ingredients.filter(i => i.name.trim() && hasIngredientNutritionLink(i)).length
  );
  let nutritionExemptCount = $derived(
    ingredients.filter(i => i.name.trim() && i.exempt && !hasIngredientNutritionLink(i)).length
  );
  let nutritionTotalCount = $derived(ingredients.filter(i => i.name.trim()).length);
  let nutritionComplete = $derived(
    nutritionMode && nutritionTotalCount > 0 && (
      linkMode === 'dish'
        ? dishLink !== null
        : linkMode === 'mixed'
          ? dishLink !== null && ingredients.filter(i => i.name.trim()).every(i => hasIngredientNutritionLink(i) || i.exempt)
          : (nutritionLinkedCount + nutritionExemptCount) === nutritionTotalCount
    )
  );

  function buildNutritionSignature(): string {
    const ingredientSignature = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        name: i.name.trim(),
        quantity: i.quantity?.trim() || '',
        foodWord: i.foodWord || '',
        ndbNo: i.ndbNo || '',
        portionDesc: i.portionDesc || '',
        portionGrams: i.portionGrams ?? null,
        servingCount: i.servingCount ?? null,
        exempt: i.exempt === true
      }));

    return JSON.stringify({
      servings: servings.trim(),
      cookingMethod,
      linkMode,
      ingredients: ingredientSignature,
      dishLink: dishLink
        ? {
            foodWord: dishLink.foodWord,
            ndbNo: dishLink.ndbNo,
            portionDesc: dishLink.portionDesc,
            portionGrams: dishLink.portionGrams,
            servingCount: dishLink.servingCount
          }
        : null
    });
  }

  function buildNutritionPayload() {
    return {
      ingredients: ingredients
        .filter((i) => i.name.trim())
        .map((i) => {
          const hasNutritionLinkMeta = Boolean((i.foodWord || i.ndbNo) && i.portionGrams);
          return {
            ...(hasNutritionLinkMeta ? {
              ndbNo: i.ndbNo,
              foodWord: i.foodWord,
              portionGrams: i.portionGrams,
              servingCount: i.servingCount,
            } : {}),
            ...(i.exempt ? { exempt: true } : {}),
          };
        }),
      dishLink: dishLink ?? undefined,
      linkType: linkMode,
      servings,
      cookingMethod,
    };
  }

  let initialNutritionSignature = $state('');
  let capturedNutritionSignature = $state(false);

  $effect(() => {
    if (capturedNutritionSignature) return;
    initialNutritionSignature = buildNutritionSignature();
    capturedNutritionSignature = true;
  });

  let nutritionFieldsDirty = $derived(
    capturedNutritionSignature && buildNutritionSignature() !== initialNutritionSignature
  );

  // ─── Canonical live preview ──────────────────────────────────────────────────
  type PreviewNutrition = {
    perServing: { cal: number; pro: number; fat: number; carb: number; fib: number; sug: number };
    gramsPerServing: number | null;
    servings: number;
  };
  let liveNutritionJson = $state<PreviewNutrition | null>(null);
  let previewLoading = $state(false);
  let previewError = $state(false);
  let previewTimer: ReturnType<typeof setTimeout> | null = null;
  let previewRequestId = 0;

  let showStoredNutrition = $derived(
    !!persistedNutrition?.perServing &&
    !nutritionComplete &&
    !nutritionFieldsDirty &&
    !previewLoading &&
    !liveNutritionJson
  );

  $effect(() => {
    if (!nutritionComplete) {
      liveNutritionJson = null;
      previewLoading = false;
      previewError = false;
      if (previewTimer) { clearTimeout(previewTimer); previewTimer = null; }
      return;
    }
    const payload = buildNutritionPayload();
    if (previewTimer) clearTimeout(previewTimer);
    const id = ++previewRequestId;
    previewLoading = true;
    previewError = false;
    previewTimer = setTimeout(async () => {
      try {
        const res = await fetch('/api/recipes/preview-nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (previewRequestId !== id) return;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as { nutritionJson: PreviewNutrition | null };
        if (previewRequestId !== id) return;
        liveNutritionJson = data.nutritionJson ?? null;
        previewError = false;
      } catch {
        if (previewRequestId !== id) return;
        previewError = true;
      } finally {
        if (previewRequestId === id) previewLoading = false;
      }
    }, 400);
  });
  // ─────────────────────────────────────────────────────────────────────────────

  // ─── Live macro totals from linked ingredients ───────────────────────────────
  const FOOD_MAP_LOCAL = new Map(FOODS.map(f => [f.word, f]));
  const FOOD_MAP_BY_NDB = new Map(FOODS.map(f => [f.ndb, f]));

  function parseServingsCount(s: string): number | null {
    if (!s) return null;
    // Keep decimal values (e.g. "1.5") so per-serving math is accurate.
    const cleaned = s.replace(/[^0-9.]/g, '');
    if (!cleaned) return null;
    const n = parseFloat(cleaned);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  let hasValidServings = $derived(parseServingsCount(servings) !== null);

  let macroPer = $state<'serving' | '100g'>('serving');

  $effect(() => {
    if (!hasValidServings && macroPer === 'serving') {
      macroPer = '100g';
    }
  });

  let macroTotals = $derived.by(() => {
    let cal = 0, pro = 0, fat = 0, carb = 0, fib = 0, sug = 0;
    let linkedCount = 0;
    let totalGrams = 0;
    for (const ing of ingredients) {
      if (!ing.portionGrams) continue;
      const food = (ing.foodWord ? FOOD_MAP_LOCAL.get(ing.foodWord) : undefined)
        ?? (ing.ndbNo ? FOOD_MAP_BY_NDB.get(ing.ndbNo) : undefined);
      if (!food) continue;
      const g = ing.portionGrams * (ing.servingCount ?? 1);
      const scale = g / 100;
      cal  += food.cal  * scale;
      pro  += food.pro  * scale;
      fat  += food.fat  * scale;
      carb += food.carb * scale;
      fib  += food.fib  * scale;
      sug  += food.sug  * scale;
      totalGrams += g;
      linkedCount++;
    }
    const srv = parseServingsCount(servings);
    const r1 = (v: number) => Math.round(v * 10) / 10;
    const divisor = macroPer === '100g'
      ? (totalGrams > 0 ? totalGrams / 100 : null)
      : srv;
    const divide = (v: number) => (divisor ? r1(v / divisor) : null);
    return {
      cal:  divide(cal),
      pro:  divide(pro),
      fat:  divide(fat),
      carb: divide(carb),
      fib:  divide(fib),
      sug:  divide(sug),
      linkedCount,
      totalGrams,
    };
  });
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
    
    const combined = recipeSuffix.trim() ? `${dishName.trim()} — ${recipeSuffix.trim()}` : dishName.trim();
    recipeName = combined;
    const linked = nutritionMode && nutritionComplete;
    const data: RecipeFormData = {
      recipeName: combined,
      dishName: dishName.trim(),
      recipeSuffix: recipeSuffix.trim(),
      cookingMethod,
      dishFamily: dishFamily || undefined,
      category,
      dietaryCategory,
      submitterName,
      prepTime,
      servings,
      linkMode: nutritionMode ? linkMode : undefined,
      dishLink: (linked && (linkMode === 'dish' || linkMode === 'mixed') && dishLink) ? dishLink : undefined,
      ingredients: ingredients.filter(i => i.name.trim()).map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        gameFood: i.gameFood,
        animal: i.animal,
        ...(linked && linkMode !== 'dish' ? {
          ...(hasIngredientNutritionLink(i) ? {
            foodWord: i.foodWord,
            ndbNo: i.ndbNo,
            portionDesc: i.portionDesc,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount,
          } : {}),
          ...(i.exempt ? { exempt: true } : {})
        } : {})
      })),
      instructions: instructions.filter(i => i.text.trim()),
      foodSupply: moderatorMode ? foodSupply : undefined,
      nutritionComplete: linked || undefined
    };
    
    onsubmit(data);
  }
  
  // Validation
  let dishNameTooGeneric = $derived(
    dishName.trim().split(/\s+/).length < 2 && dishName.trim().length > 0
  );
  let nameReady = $derived(
    dishName.trim().length > 0 && (moderatorMode || recipeSuffix.trim().length > 0)
  );
  let isValid = $derived(
    dishName.trim().length > 0 &&
    (moderatorMode || recipeSuffix.trim().length > 0) &&
    ingredients.some(i => i.name.trim()) &&
    instructions.some(i => i.text.trim()) &&
    (
      !nutritionMode ||
      !nutritionComplete ||
      (
        !previewLoading &&
        !previewError &&
        !!liveNutritionJson?.perServing
      )
    )
  );

  // ── Dish Name typeahead ────────────────────────────────────────────────────
  let dishNameTypeahead = $state<string[]>([]);
  let dishNameTypeaheadOpen = $state(false);
  let dishNameTypeaheadTimer = $state<ReturnType<typeof setTimeout> | null>(null);

  function onDishNameInput() {
    const q = dishName.trim();
    if (q.length < 2) {
      dishNameTypeahead = [];
      dishNameTypeaheadOpen = false;
      return;
    }
    if (dishNameTypeaheadTimer) clearTimeout(dishNameTypeaheadTimer);
    dishNameTypeaheadTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/recipes/suggest?dish=${encodeURIComponent(q)}`);
        const data: { suggestions: Array<{ dishName: string }> } = await res.json();
        const names = Array.from(
          new Set((data.suggestions ?? []).map((s) => s.dishName).filter(Boolean))
        );
        dishNameTypeahead = names;
        dishNameTypeaheadOpen = names.length > 0;
      } catch {
        dishNameTypeahead = [];
        dishNameTypeaheadOpen = false;
      }
    }, 220);
  }

  function selectDishNameTypeahead(name: string) {
    dishName = name;
    dishNameTypeaheadOpen = false;
    dishNameTypeahead = [];
  }

  // ── Recipe Suggestion ──────────────────────────────────────────────────────
  interface RecipeSuggestion {
    id: string;
    dishName: string;
    version: string;
    category: string;
    dietaryCategory: string | null;
    prepTime: string | null;
    servings: string | null;
    ingredientCount: number;
    ingredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
    sourceType: 'dev' | 'player';
    dishFamily?: string | null;
    nutritionJson?: PersistedNutritionJson | null;
  }

  let persistedNutrition = $state<PersistedNutritionJson | null | undefined>(initialData.nutritionJson);

  let suggestions = $state<RecipeSuggestion[]>([]);
  let suggestionsLoading = $state(false);
  let suggestionsDismissed = $state(false);
  let expandedSuggestionId = $state<string | null>(null);

  // Reset suggestions when the dish name changes after they were loaded
  $effect(() => {
    dishName; // track
    suggestionsDismissed = false;
    expandedSuggestionId = null;
    suggestions = [];
  });

  // Fetch suggestions when nameReady becomes true
  $effect(() => {
    if (!nameReady || disableSuggestions) return;
    const currentDish = dishName.trim();
    suggestionsLoading = true;
    fetch(`/api/recipes/suggest?dish=${encodeURIComponent(currentDish)}`)
      .then(r => r.json())
      .then((data: { suggestions: RecipeSuggestion[] }) => {
        suggestions = data.suggestions ?? [];
      })
      .catch(() => { suggestions = []; })
      .finally(() => { suggestionsLoading = false; });
  });

  function applySuggestionMeta(suggestion: RecipeSuggestion) {
    category = toStoredRecipeCategory(suggestion.category);
    if (suggestion.dietaryCategory) dietaryCategory = suggestion.dietaryCategory as never;
    if (suggestion.prepTime) prepTime = suggestion.prepTime;
    if (suggestion.servings) servings = suggestion.servings;
    if (suggestion.dishFamily) dishFamily = suggestion.dishFamily;
  }

  function toMappedIngredient(ing: RecipeIngredient, id: number): RecipeIngredient {
    const name =
      (ing as RecipeIngredient).name ??
      (ing as { ing_name?: string }).ing_name ??
      '';
    const ndbNo =
      (ing as RecipeIngredient).ndbNo ??
      (ing as { ndb_no?: string }).ndb_no;
    const portionDesc =
      (ing as RecipeIngredient).portionDesc ??
      (ing as { portion_desc?: string }).portion_desc;
    const portionGramsRaw =
      (ing as RecipeIngredient).portionGrams ??
      (ing as { portion_grams?: number | string }).portion_grams;
    const portionGrams =
      typeof portionGramsRaw === 'number'
        ? portionGramsRaw
        : typeof portionGramsRaw === 'string'
        ? Number(portionGramsRaw)
        : undefined;

    return {
      id,
      name,
      quantity:
        (ing as RecipeIngredient).quantity ??
        (ing as { ing_qty?: string }).ing_qty ??
        '',
      gameFood: (ing as RecipeIngredient).gameFood,
      animal: (ing as RecipeIngredient).animal,
      foodWord: (ing as RecipeIngredient).foodWord ?? (ing as { food_word?: string }).food_word,
      ndbNo,
      portionDesc,
      portionGrams,
      servingCount:
        (ing as RecipeIngredient).servingCount ??
        (ing as { serving_count?: number }).serving_count ??
        undefined,
      exempt: (ing as RecipeIngredient).exempt,
    };
  }

  function toMappedInstruction(ins: RecipeInstruction, id: number): RecipeInstruction {
    return {
      id,
      text:
        (ins as RecipeInstruction).text ??
        (ins as { step_text?: string }).step_text ??
        '',
    };
  }

  function fillSuggestionIngredient(ing: RecipeIngredient, suggestion: RecipeSuggestion) {
    const blankIndex = ingredients.findIndex(i => !i.name.trim() && !i.quantity.trim());
    if (blankIndex >= 0) {
      const targetId = ingredients[blankIndex].id;
      const mapped = toMappedIngredient(ing, targetId);
      ingredients = ingredients.map((item, idx) => idx === blankIndex ? mapped : item);
    } else {
      const targetId = ++nextIngredientId;
      ingredients = [...ingredients, toMappedIngredient(ing, targetId)];
    }
    applySuggestionMeta(suggestion);
  }

  function fillSuggestionInstruction(ins: RecipeInstruction, suggestion: RecipeSuggestion) {
    const mappedText = ((ins as RecipeInstruction).text ?? (ins as { step_text?: string }).step_text ?? '').trim();
    if (!mappedText) return;
    const blankIndex = instructions.findIndex(i => !i.text.trim());
    if (blankIndex >= 0) {
      const targetId = instructions[blankIndex].id;
      const mapped = toMappedInstruction(ins, targetId);
      instructions = instructions.map((item, idx) => idx === blankIndex ? mapped : item);
    } else {
      const targetId = ++nextInstructionId;
      instructions = [...instructions, toMappedInstruction(ins, targetId)];
    }
    applySuggestionMeta(suggestion);
  }

  function fillFromSuggestion(suggestion: RecipeSuggestion) {
    applySuggestionMeta(suggestion);
    const rawIngredients = suggestion.ingredients;
    if (Array.isArray(rawIngredients) && rawIngredients.length > 0) {
      ingredients = rawIngredients.map((ing, idx) => toMappedIngredient(ing, idx + 1));
      nextIngredientId = ingredients.length;
    }
    const rawInstructions = suggestion.instructions;
    if (Array.isArray(rawInstructions) && rawInstructions.length > 0) {
      instructions = rawInstructions.map((ins, idx) => toMappedInstruction(ins, idx + 1));
      nextInstructionId = instructions.length;
    }
    suggestionsDismissed = true;
    // Avoid stale baseline values from suggested recipes; canonical preview is authoritative.
    persistedNutrition = null;
    // Reset the dirty signature so the form shows as clean after fill.
    initialNutritionSignature = buildNutritionSignature();
  }
  
  // Current form data (for customActions snippet)
  let formData = $derived<RecipeFormData>({
    dishName: dishName.trim(),
    recipeSuffix: recipeSuffix.trim(),
    cookingMethod,
    dishFamily: dishFamily || undefined,
    category,
    dietaryCategory,
    submitterName,
    prepTime,
    servings,
    linkMode: nutritionMode ? linkMode : undefined,
    dishLink: (nutritionMode && (linkMode === 'dish' || linkMode === 'mixed')) ? dishLink ?? undefined : undefined,
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
        Dish Name *
        <div class="dish-name-wrap">
          <input
            type="text"
            bind:value={dishName}
            oninput={onDishNameInput}
            onblur={() => setTimeout(() => { dishNameTypeaheadOpen = false; }, 150)}
            placeholder="e.g., Apple Pie"
            class="form-input"
            autocomplete="off"
            required
          />
          {#if dishNameTypeaheadOpen && dishNameTypeahead.length > 0}
            <ul class="dish-typeahead-list">
              {#each dishNameTypeahead as name}
                <li>
                  <button
                    type="button"
                    class="dish-typeahead-item"
                    onmousedown={() => selectDishNameTypeahead(name)}
                  >{name}</button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <span class="field-hint">Use the common dish name (e.g. "Apple Pie") — your personal touch goes in <strong>Your Version</strong></span>
        {#if dishNameTooGeneric}
          <span class="field-hint">More specific names improve matches (example: "Apple Pie")</span>
        {/if}
      </label>

      <label class="form-label">
        Your Version *
        <input
          type="text"
          bind:value={recipeSuffix}
          placeholder="e.g., Grandma's"
          class="form-input"
        />
        <span class="field-hint">Makes your recipe unique</span>
      </label>
    </div>

    <div class="form-row">
      <label class="form-label">
        Dish Family *
        <select bind:value={category} class="form-select">
          {#each RECIPE_CATEGORY_OPTIONS as cat}
            <option value={cat.id}>{cat.label}</option>
          {/each}
        </select>
      </label>

      <label class="form-label">
        Final Dish Preparation
        <select bind:value={cookingMethod} class="form-select">
          {#each COOKING_METHODS as m}
            <option value={m}>{m}</option>
          {/each}
        </select>
        <span class="field-hint">Choose how the finished dish is prepared, not each ingredient step</span>
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
  
  <!-- Lock hint / Suggestion panel -->
  {#if !nameReady}
    <div class="name-lock-hint">
      Name your recipe first to unlock the rest
    </div>
  {:else if suggestionsLoading}
    <div class="name-lock-hint">Searching for similar recipes…</div>
  {:else if suggestionsDismissed && suggestions.length > 0}
    <div class="suggestion-reopen-wrap">
      <button type="button" class="suggestion-reopen-btn" onclick={() => suggestionsDismissed = false}>
        Show Similar Recipes Again
      </button>
    </div>
  {:else if !suggestionsDismissed && suggestions.length > 0}
    <div class="suggestion-panel">
      <div class="suggestion-header">
        <span class="suggestion-title">Similar recipes found — tap to preview</span>
        <button type="button" class="suggestion-dismiss" onclick={() => suggestionsDismissed = true}>
          Start blank ✕
        </button>
      </div>
      {#each suggestions as s}
        <div class="suggestion-row">
          <button
            type="button"
            class="suggestion-row-btn"
            class:expanded={expandedSuggestionId === s.id}
            onclick={() => expandedSuggestionId = expandedSuggestionId === s.id ? null : s.id}
          >
            <span class="suggestion-name">{s.dishName} — {s.version}</span>
            <span class="suggestion-meta">{s.category}{s.servings ? ' · ' + s.servings : ''} · {s.ingredientCount} ingredient{s.ingredientCount === 1 ? '' : 's'}</span>
            <span class="suggestion-chevron">{expandedSuggestionId === s.id ? '▲' : '▼'}</span>
          </button>
          {#if expandedSuggestionId === s.id}
            <div class="suggestion-preview">
              {#if s.ingredients.length > 0}
                <p class="suggestion-preview-heading">Ingredients</p>
                <ul class="suggestion-preview-list">
                  {#each s.ingredients as ing}
                    <li class="suggestion-preview-item">
                      <span>{ing.quantity ? ing.quantity + ' ' : ''}{ing.name}</span>
                      <button type="button" class="suggestion-add-item-btn" onclick={() => fillSuggestionIngredient(ing, s)}>
                        Add
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
              {#if s.instructions.length > 0}
                <p class="suggestion-preview-heading">Instructions</p>
                <ol class="suggestion-preview-list">
                  {#each s.instructions as ins}
                    <li class="suggestion-preview-item">
                      <span>{ins.text}</span>
                      <button type="button" class="suggestion-add-item-btn" onclick={() => fillSuggestionInstruction(ins, s)}>
                        Add
                      </button>
                    </li>
                  {/each}
                </ol>
              {/if}
              <div class="suggestion-actions">
                <button type="button" class="suggestion-fill-btn" onclick={() => fillFromSuggestion(s)}>
                  Fill Entire Recipe
                </button>
                <button type="button" class="suggestion-skip-btn" onclick={() => expandedSuggestionId = null}>
                  Close
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <div class="form-body" class:locked={!nameReady}>
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
    
    {#if nutritionMode}
      <div class="link-mode-selector">
        <span class="link-mode-label">Linking method:</span>
        <div class="link-mode-options">
          <button type="button" class="link-mode-btn" class:selected={linkMode === 'ingredient'} onclick={() => setLinkMode('ingredient')}>
            ✅ Each ingredient
          </button>
          <button type="button" class="link-mode-btn" class:selected={linkMode === 'dish'} onclick={() => setLinkMode('dish')}>
            🍽️ Whole dish
          </button>
          <button type="button" class="link-mode-btn" class:selected={linkMode === 'mixed'} onclick={() => setLinkMode('mixed')}>
            🍽️➕ Mixed
          </button>
        </div>
      </div>

      {#if linkMode === 'dish' || linkMode === 'mixed'}
        <div class="dish-link-section">
          <div class="dish-link-label">
            {linkMode === 'dish' ? '🍽️ Link this whole recipe as a single dish:' : '🍽️ Link the primary dish:'}
          </div>
          {#if dishLink}
            <div class="nutrition-badge">
              <span class="nutrition-badge-text">
                ✓ {FOODS.find(f => f.word === dishLink!.foodWord)?.display}
                · {dishLink.portionDesc === 'g'
                    ? `${dishLink.servingCount * dishLink.portionGrams}g`
                    : `${dishLink.servingCount}×${dishLink.portionDesc}`}
              </span>
              <span class="nutrition-badge-edit-label">Edit:</span>
              <button type="button" class="nutrition-relink-btn" onclick={() => { dishSearchOpen = true; dishPendingFood = FOODS.find(f => f.word === dishLink!.foodWord) ?? null; dishCustomGrams = null; }}>qty</button>
              <button type="button" class="nutrition-relink-btn" onclick={() => { dishSearchOpen = true; dishSearchQ = ''; dishPendingFood = null; }}>food</button>
              <button type="button" class="nutrition-unlink-btn" onclick={() => { dishLink = null; }}>✕</button>
            </div>
          {:else}
            <button type="button" class="link-nutrition-btn" onclick={() => { dishSearchOpen = true; dishSearchQ = ''; dishPendingFood = null; }}>
              🔗 Search for this dish…
            </button>
          {/if}
          {#if dishSearchOpen}
            <div class="nutrition-search-panel">
              {#if !dishPendingFood}
                <input
                  type="text"
                  class="nutrition-search-input"
                  placeholder="e.g. pancakes, apple pie…"
                  value={dishSearchQ}
                  oninput={(e) => {
                    dishSearchQ = (e.target as HTMLInputElement).value;
                    queueDishFoodSearch(dishSearchQ);
                  }}
                />
                {#if dishSearchLoading}
                  <p class="nutrition-search-hint">Searching USDA foods…</p>
                {:else if dishSearchUsingFallback}
                  <p class="nutrition-fallback-indicator" title="API unavailable; showing local fallback results">
                    <span class="origin-fallback-dot" aria-hidden="true"></span>
                    API unavailable; showing local fallback results
                  </p>
                {:else if dishSearchResults.length > 0}
                  <div class="nutrition-results">
                    {#each dishSearchResults as food}
                      <button type="button" class="nutrition-result-btn" onclick={() => {
                        dishPendingFood = food;
                        dishPendingPortionIdx = food.portions.length > 1 ? 1 : 0;
                        dishPendingCount = 1;
                        dishCustomGrams = null;
                      }}>
                        <span class="result-name">{food.display}</span>
                        <span class="result-cal">{food.cal} cal/100g</span>
                      </button>
                    {/each}
                  </div>
                {:else if dishSearchQ.trim().length > 1}
                  <p class="nutrition-no-results">No matches — try a shorter word</p>
                {:else}
                  <p class="nutrition-search-hint">Type to search 1,300+ USDA foods</p>
                {/if}
              {:else}
                {@const pFood = dishPendingFood}
                {@const namedPortions = pFood.portions.map((p, idx) => ({...p, idx})).filter(p => p.desc !== 'custom (g)')}
                <div class="portion-picker">
                  <div class="portion-food-name">📌 {pFood.display}</div>
                  <div class="portion-controls">
                    <label class="portion-label">
                      How many?
                      <input
                        type="number" min="0.25" step="0.25"
                        class="portion-count-input"
                        value={dishPendingCount}
                        oninput={(e) => { dishPendingCount = parseFloat((e.target as HTMLInputElement).value) || 1; }}
                      />
                    </label>
                    {#if namedPortions.length > 0}
                      <label class="portion-label">
                        Portion size
                        <select
                          class="portion-select"
                          onchange={(e) => {
                            dishCustomGrams = null;
                            dishPendingPortionIdx = parseInt((e.target as HTMLSelectElement).value);
                          }}
                        >
                          {#each namedPortions as p}
                            <option value={p.idx} selected={p.idx === dishPendingPortionIdx}>
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
                        value={dishCustomGrams ?? ''}
                        oninput={(e) => {
                          const v = parseFloat((e.target as HTMLInputElement).value);
                          dishCustomGrams = isNaN(v) ? null : v;
                        }}
                      />
                    </label>
                  </div>
                  <div class="portion-actions">
                    <button type="button" class="portion-back-btn" onclick={() => { dishPendingFood = null; }}>← Back</button>
                    <button type="button" class="portion-confirm-btn" onclick={() => confirmDishLink()}>✓ Confirm</button>
                  </div>
                </div>
              {/if}
              <button type="button" class="nutrition-cancel-btn" onclick={() => { dishSearchOpen = false; }}>Cancel</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if nutritionTotalCount > 0 && linkMode !== 'dish'}
        <div class="nutrition-progress" class:complete={nutritionComplete}>
          {#if nutritionComplete}
            ✅ Nutrition complete — all {nutritionTotalCount} ingredient{nutritionTotalCount === 1 ? '' : 's'} accounted for
          {:else}
            🔗 Nutrition: {nutritionLinkedCount + nutritionExemptCount}/{nutritionTotalCount} ingredient{nutritionTotalCount === 1 ? '' : 's'} accounted for
          {/if}
        </div>
        {#if showStoredNutrition}
          {@const hasStoredPer100 = !!persistedNutrition?.per100g}
          {@const showStoredPer100 = macroPer === '100g' && hasStoredPer100}
          <div class="macro-preview stored">
            <div class="macro-preview-header">
              <span class="macro-preview-label">
                {#if showStoredPer100}
                  Per 100g
                {:else}
                  Per serving{hasValidServings ? ` (${parseServingsCount(servings)} servings)` : ''}
                {/if}
              </span>
              <span class="macro-preview-label">Stored nutrition from dev_recipes/player_recipes (saved values)</span>
              <div class="macro-per-toggle">
                <button
                  type="button"
                  class="macro-per-btn"
                  class:active={macroPer === 'serving'}
                  disabled={!hasValidServings}
                  onclick={() => macroPer = 'serving'}
                >Per serving</button>
                <button
                  type="button"
                  class="macro-per-btn"
                  class:active={macroPer === '100g'}
                  disabled={!hasStoredPer100}
                  onclick={() => macroPer = '100g'}
                >100g</button>
              </div>
            </div>
            <div class="macro-preview-values">
              <span><strong>{showStoredPer100 ? (persistedNutrition?.per100g?.Energy_KCal ?? '--') : (persistedNutrition?.perServing?.cal ?? '--')}</strong> cal</span>
              <span><strong>{showStoredPer100 ? (persistedNutrition?.per100g?.Protein ?? '--') : (persistedNutrition?.perServing?.pro ?? '--')}g</strong> protein</span>
              <span><strong>{showStoredPer100 ? (persistedNutrition?.per100g?.TotalLipidFat ?? '--') : (persistedNutrition?.perServing?.fat ?? '--')}g</strong> fat</span>
              <span><strong>{showStoredPer100 ? (persistedNutrition?.per100g?.Carbohydrate ?? '--') : (persistedNutrition?.perServing?.carb ?? '--')}g</strong> carbs</span>
              <span><strong>{showStoredPer100 ? (persistedNutrition?.per100g?.FiberTotalDietary ?? '--') : (persistedNutrition?.perServing?.fib ?? '--')}g</strong> fibre</span>
              <span><strong>{showStoredPer100 ? (persistedNutrition?.per100g?.SugarsTotal ?? '--') : (persistedNutrition?.perServing?.sug ?? '--')}g</strong> sugar</span>
            </div>
          </div>
        {:else if nutritionComplete}
          {#if previewLoading}
            <div class="macro-preview loading">
              <div class="macro-preview-header">
                <span class="macro-preview-label">Recalculating…</span>
              </div>
              {#if liveNutritionJson?.perServing}
                {@const ps = liveNutritionJson.perServing}
                <div class="macro-preview-values">
                  <span><strong>{ps.cal}</strong> cal</span>
                  <span><strong>{ps.pro}g</strong> protein</span>
                  <span><strong>{ps.fat}g</strong> fat</span>
                  <span><strong>{ps.carb}g</strong> carbs</span>
                  <span><strong>{ps.fib}g</strong> fibre</span>
                  <span><strong>{ps.sug}g</strong> sugar</span>
                </div>
              {/if}
            </div>
          {:else if liveNutritionJson?.perServing}
            {@const ps = liveNutritionJson.perServing}
            {@const gpS = liveNutritionJson.gramsPerServing}
            {@const per100Scale = gpS && gpS > 0 ? 100 / gpS : null}
            {@const r1 = (v: number) => Math.round(v * 10) / 10}
            {@const s = macroPer === '100g' && per100Scale ? per100Scale : 1}
            <div class="macro-preview complete">
              <div class="macro-preview-header">
                <span class="macro-preview-label">
                  {#if macroPer === '100g'}
                    Per 100g
                  {:else}
                    Per serving{hasValidServings ? ` (${parseServingsCount(servings)} servings)` : ''}
                  {/if}
                </span>
                <span class="macro-preview-label">Canonical preview (matches what Save will store)</span>
                <div class="macro-per-toggle">
                  <button
                    type="button"
                    class="macro-per-btn"
                    class:active={macroPer === 'serving'}
                    disabled={!hasValidServings}
                    onclick={() => macroPer = 'serving'}
                  >Per serving</button>
                  <button
                    type="button"
                    class="macro-per-btn"
                    class:active={macroPer === '100g'}
                    disabled={!per100Scale}
                    onclick={() => macroPer = '100g'}
                  >100g</button>
                </div>
              </div>
              <div class="macro-preview-values">
                <span><strong>{r1(ps.cal * s)}</strong> cal</span>
                <span><strong>{r1(ps.pro * s)}g</strong> protein</span>
                <span><strong>{r1(ps.fat * s)}g</strong> fat</span>
                <span><strong>{r1(ps.carb * s)}g</strong> carbs</span>
                <span><strong>{r1(ps.fib * s)}g</strong> fibre</span>
                <span><strong>{r1(ps.sug * s)}g</strong> sugar</span>
              </div>
            </div>
          {:else if previewError}
            <div class="macro-preview-error">
              ⚠️ Nutrition preview unavailable — will be calculated on save
            </div>
          {:else}
            <div class="macro-preview-error">
              ⚠️ Nutrition preview unavailable — please wait and retry
            </div>
          {/if}
        {/if}
      {/if}
    {/if}

    <div class="ingredients-list">
      <p class="section-hint" style="margin: 0 0 8px 0;">List all ingredients with quantities (e.g., "2 cups flour", "1 tsp salt")</p>
      {#each ingredients as ingredient, i (ingredient.id)}
        <div class="ingredient-entry">
          <div class="ingredient-row">
            <span class="row-num">{i + 1}.</span>
            <div class="ingredient-fields">
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
            </div>
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

          {#if nutritionMode && linkMode !== 'dish'}
            <div class="nutrition-row">
              {#if hasIngredientNutritionLink(ingredient)}
                <div class="nutrition-badge">
                  <span class="nutrition-badge-text">
                    ✓ {getIngredientNutritionLabel(ingredient)}
                    · {ingredient.portionDesc === 'g'
                        ? `${(ingredient.servingCount ?? 1) * (ingredient.portionGrams ?? 0)}g`
                        : `${ingredient.servingCount}×${ingredient.portionDesc}`}
                  </span>
                  <span class="nutrition-badge-edit-label">Edit:</span>
                  <button type="button" class="nutrition-relink-btn" onclick={() => openNutritionSearch(ingredient)}>qty</button>
                  <button type="button" class="nutrition-relink-btn" onclick={() => openNutritionSearchFresh(ingredient)}>food</button>
                  <button type="button" class="nutrition-unlink-btn" onclick={() => unlinkNutrition(ingredient.id)}>✕</button>
                </div>
              {:else if ingredient.exempt}
                <div class="exempt-badge">
                  <span class="exempt-badge-text">⊘ Exempt</span>
                  <button type="button" class="exempt-info-btn" title="What can be exempted?" onclick={() => exemptInfoOpen = !exemptInfoOpen}>ℹ️</button>
                  <button type="button" class="nutrition-unlink-btn" title="Remove exemption" onclick={() => toggleExempt(ingredient.id)}>✕</button>
                </div>
              {:else}
                <div class="nutrition-actions-row">
                  <button type="button" class="link-nutrition-info-btn" onclick={() => linkNutritionInfoOpen = !linkNutritionInfoOpen} title="How to link nutrition">How to link ℹ️</button>
                  <button type="button" class="link-nutrition-btn" onclick={() => openNutritionSearch(ingredient)}>
                    🔗 Link nutrition
                  </button>
                  <button type="button" class="exempt-btn" onclick={() => toggleExempt(ingredient.id)}>
                    Exempt
                  </button>
                  <button type="button" class="exempt-info-btn" title="What can be exempted?" onclick={() => exemptInfoOpen = !exemptInfoOpen}>ℹ️</button>
                </div>
              {/if}

              {#if linkNutritionInfoOpen}
                <div class="link-nutrition-info-panel">
                  <button type="button" class="exempt-info-close" onclick={() => linkNutritionInfoOpen = false}>✕</button>
                  <p class="exempt-info-heading">How to link an ingredient</p>
                  <p class="exempt-info-section">1 · Search for the food as you'd eat it</p>
                  <p class="exempt-info-body">Type the ingredient name. Match to its <strong>cooked or ready-to-eat form</strong> — not raw, unless it's eaten raw. Choose "chicken breast, roasted" not "chicken breast, raw".</p>
                  <p class="exempt-info-section">2 · Baking ingredients stay raw</p>
                  <p class="exempt-info-body">Eggs, flour, butter, and sugar that bake <em>into</em> a dish should be linked to their raw or plain form. Nutrient losses from baking heat will be automatically corrected for your recipe using USDA retention data. Water evaporates during baking, concentrating the finished product — but this should be within normal recipe estimation range.</p>
                  <p class="exempt-info-section">3 · Pick the right portion</p>
                  <p class="exempt-info-body">After selecting a food, choose the portion size that matches your recipe quantity — cup, ounce, tablespoon, or enter grams directly.</p>
                  <p class="exempt-info-note">Nutrition uses USDA SR28 data with cooking retention factors applied — values reflect what ends up in the finished dish.</p>
                </div>
              {/if}

              {#if exemptInfoOpen}
                <div class="exempt-info-panel">
                  <button type="button" class="exempt-info-close" onclick={() => exemptInfoOpen = false}>✕</button>
                  <p class="exempt-info-heading">What can be exempted?</p>
                  <p class="exempt-info-note">Moderators review all exemptions. When in doubt, link it.</p>
                  <p class="exempt-info-section">✅ Spices &amp; seasonings (not salt)</p>
                  <p class="exempt-info-body">Black pepper, cumin, paprika, cinnamon, dried herbs, vanilla extract, spice blends used in trace amounts. <strong>Salt is not exempt</strong> — sodium is tracked.</p>
                  <p class="exempt-info-section">✅ Leavening agents</p>
                  <p class="exempt-info-body">Baking powder, baking soda, cream of tartar, yeast used for rising.</p>
                  <p class="exempt-info-section">✅ Functional cooking agents</p>
                  <p class="exempt-info-body">Cooking spray, parchment paper, water used only for blanching or processing (discarded), food coloring.</p>
                  <p class="exempt-info-section">❌ Not exempt</p>
                  <p class="exempt-info-body">Salt · butter/oil/fat · sugar/honey · flour/starch · dairy · any protein (meat, fish, eggs, legumes, tofu)</p>
                </div>
              {/if}

              {#if nutritionOpen[ingredient.id]}
                <div class="nutrition-search-panel">
                  {#if !nutritionPendingFood[ingredient.id]}
                    <input
                      type="text"
                      class="nutrition-search-input"
                      placeholder="Search food (e.g. flour, chicken)..."
                      value={nutritionSearchQ[ingredient.id] ?? ''}
                      oninput={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        nutritionSearchQ = { ...nutritionSearchQ, [ingredient.id]: value };
                        queueNutritionFoodSearch(ingredient.id, value);
                      }}
                    />
                    {#if nutritionSearchLoading[ingredient.id]}
                      <p class="nutrition-search-hint">Searching USDA foods…</p>
                    {:else if nutritionSearchUsingFallback[ingredient.id]}
                      <p class="nutrition-fallback-indicator" title="API unavailable; showing local fallback results">
                        <span class="origin-fallback-dot" aria-hidden="true"></span>
                        API unavailable; showing local fallback results
                      </p>
                    {:else if (nutritionSearchResults[ingredient.id] ?? []).length > 0}
                      <div class="nutrition-results">
                        {#each nutritionSearchResults[ingredient.id] ?? [] as food}
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
                <option value="">— Select chaser —</option>
                {#each ANIMAL_TYPES as animal}
                  <option value={animal}>🐾 {animal}</option>
                {/each}
              </select>
            </div>
          </div>
        {/each}
      </div>
      
      {#if ingredients.filter(i => i.name.trim() && i.gameFood).length === 0}
        <p class="mapping-warning">⚠️ Select at least one food and chaser to enable gameplay</p>
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
  </div> <!-- /form-body -->
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

  .input-error {
    border-color: #E53935 !important;
  }

  .name-lock-hint {
    text-align: center;
    font-size: 0.82rem;
    color: #999;
    padding: 6px 0 2px;
    letter-spacing: 0.01em;
  }

  /* ── Suggestion panel ───────────────────────────────────────────────────── */
  .suggestion-panel {
    border: 1px solid #d4e4c0;
    border-radius: 10px;
    overflow: hidden;
    margin: 4px 0 8px;
    background: #f8fbf4;
  }

  .suggestion-reopen-wrap {
    display: flex;
    justify-content: center;
    margin: 4px 0 8px;
  }

  .suggestion-reopen-btn {
    border: 1px solid #c6dbad;
    background: #f2fae8;
    color: #3f6b1e;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .suggestion-reopen-btn:hover {
    background: #e8f5d8;
    border-color: #9ec27d;
  }

  /* ── Dish Name typeahead ────────────────────────────────────────────────────── */
  .dish-name-wrap {
    position: relative;
  }

  .dish-typeahead-list {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #c6dbad;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin: 0;
    padding: 4px 0;
    list-style: none;
    z-index: 200;
    max-height: 220px;
    overflow-y: auto;
  }

  .dish-typeahead-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 9px 14px;
    font-size: 0.88rem;
    color: #2e4a12;
    cursor: pointer;
  }

  .dish-typeahead-item:hover {
    background: #f0f7e8;
  }

  .suggestion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #edf5e0;
    border-bottom: 1px solid #d4e4c0;
  }

  .suggestion-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: #4a6c2a;
  }

  .suggestion-dismiss {
    font-size: 0.78rem;
    color: #888;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 4px;
  }
  .suggestion-dismiss:hover { color: #444; }

  .suggestion-row {
    border-bottom: 1px solid #e4eeda;
  }
  .suggestion-row:last-child { border-bottom: none; }

  .suggestion-row-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  .suggestion-row-btn:hover { background: #f0f7e8; }
  .suggestion-row-btn.expanded { background: #f0f7e8; }

  .suggestion-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: #2e4a12;
    flex: 1;
  }

  .suggestion-meta {
    font-size: 0.76rem;
    color: #7a9a58;
    white-space: nowrap;
  }

  .suggestion-chevron {
    font-size: 0.7rem;
    color: #aaa;
    margin-left: 4px;
  }

  .suggestion-preview {
    padding: 10px 14px 14px;
    border-top: 1px solid #e4eeda;
    background: #fcfff8;
  }

  .suggestion-preview-heading {
    font-size: 0.78rem;
    font-weight: 700;
    color: #4a6c2a;
    margin: 8px 0 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .suggestion-preview-heading:first-child { margin-top: 0; }

  .suggestion-preview-list {
    margin: 0 0 6px 16px;
    padding: 0;
    font-size: 0.83rem;
    color: #333;
    line-height: 1.55;
  }

  .suggestion-preview-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
  }

  .suggestion-add-item-btn {
    flex-shrink: 0;
    padding: 3px 8px;
    border: 1px solid #b7d2a0;
    border-radius: 6px;
    background: #f2fae8;
    color: #3f6b1e;
    font-size: 0.74rem;
    font-weight: 600;
    cursor: pointer;
  }

  .suggestion-add-item-btn:hover {
    background: #e8f5d8;
    border-color: #9ec27d;
  }

  .suggestion-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .suggestion-fill-btn {
    flex: 1;
    padding: 8px 12px;
    background: #4a7c2a;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
  }
  .suggestion-fill-btn:hover { background: #3a6020; }

  .suggestion-skip-btn {
    padding: 8px 12px;
    background: none;
    color: #888;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.84rem;
    cursor: pointer;
  }
  .suggestion-skip-btn:hover { color: #444; border-color: #999; }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-body.locked {
    opacity: 0.35;
    pointer-events: none;
    user-select: none;
  }

  .field-hint {
    font-size: 0.78rem;
    color: #888;
    margin-top: 3px;
    display: block;
  }

  .field-hint-warn {
    color: #E53935;
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
  
  .ingredient-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }

  .ingredient-fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1 1 auto;
    min-width: 0;
  }

  .instruction-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }

  .row-num {
    min-width: 24px;
    padding-top: 10px;
    font-weight: bold;
    color: #8B4513;
  }

  .qty-input,
  .name-input {
    width: 100%;
    min-width: 0;
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

    .ingredient-row {
      flex-wrap: wrap;
    }

    .qty-input {
      width: 100%;
      min-width: 0;
      flex: 1 1 100%;
    }

    .name-input {
      width: 100%;
      min-width: 0;
      flex: 1 1 100%;
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
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
  }
  
  .mapping-ingredient {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 1 1 120px;
    min-width: 0;
  }
  
  .mapping-num {
    font-weight: bold;
    color: #E65100;
  }
  
  .mapping-name {
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
  }
  
  .mapping-selects {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex-shrink: 0;
  }
  
  .game-food-select {
    width: 150px;
    min-width: 150px;
    flex: 1 1 150px;
    padding: 6px 8px;
    font-size: 0.9rem;
  }
  
  .animal-select {
    width: 150px;
    min-width: 150px;
    flex: 1 1 150px;
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

  .macro-preview {
    margin-top: 6px;
    padding: 8px 12px;
    background: #FFF8E1;
    border: 1px solid #FFD54F;
    border-radius: 8px;
    font-size: 0.82rem;
    color: #5D4037;
  }

  .macro-preview.complete {
    background: #F1F8E9;
    border-color: #AED581;
  }

  .macro-preview.stored {
    background: #E3F2FD;
    border-color: #90CAF9;
    color: #0D47A1;
  }

  .macro-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .macro-preview-label {
    font-size: 0.78rem;
    color: #888;
  }

  .macro-per-toggle {
    display: flex;
    gap: 2px;
  }

  .macro-per-btn {
    font-size: 0.72rem;
    padding: 2px 7px;
    border: 1px solid #FFD54F;
    background: transparent;
    color: #888;
    border-radius: 4px;
    cursor: pointer;
    line-height: 1.4;
  }

  .macro-per-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .macro-per-btn.active {
    background: #FFD54F;
    color: #5D4037;
    border-color: #FFB300;
  }

  .macro-preview.complete .macro-per-btn {
    border-color: #AED581;
  }

  .macro-preview.complete .macro-per-btn.active {
    background: #AED581;
    color: #33691E;
    border-color: #7CB342;
  }

  .macro-preview-values {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
  }

  .macro-preview-values span {
    white-space: nowrap;
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

  .nutrition-fallback-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #9a3412;
    margin: 0;
    padding: 2px 4px;
  }

  .origin-fallback-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    border: 1px solid #fb923c;
    background: #fdba74;
    box-sizing: border-box;
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

  /* ── Link mode selector ─────────────────────────────────────────────────── */

  .link-mode-selector {
    margin-bottom: 10px;
  }

  .link-mode-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;
    display: block;
    margin-bottom: 6px;
  }

  .link-mode-options {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .link-mode-btn {
    padding: 5px 12px;
    background: #F5F5F5;
    border: 1px solid #DDD;
    border-radius: 16px;
    font-size: 0.82rem;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
  }

  .link-mode-btn:hover {
    border-color: #4CAF50;
    color: #2E7D32;
    background: #F1F8E9;
  }

  .link-mode-btn.selected {
    background: #E8F5E9;
    border-color: #4CAF50;
    color: #2E7D32;
    font-weight: 600;
  }

  .dish-link-section {
    background: #FAFAFA;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .dish-link-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5D4037;
  }

  /* ── Exempt ─────────────────────────────────────────────────────────────── */

  .nutrition-actions-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .exempt-btn {
    padding: 4px 10px;
    background: none;
    border: 1px dashed #BDBDBD;
    border-radius: 6px;
    color: #888;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .exempt-btn:hover {
    border-color: #FF8F00;
    color: #E65100;
    background: #FFF8E1;
  }

  .exempt-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: #FFF8E1;
    border: 1px solid #FFD54F;
    border-radius: 6px;
    font-size: 0.82rem;
    color: #E65100;
  }

  .exempt-badge-text {
    flex: 1;
    min-width: 0;
  }

  .exempt-info-btn {
    background: none;
    border: none;
    padding: 0 2px;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
    opacity: 0.7;
  }

  .exempt-info-btn:hover {
    opacity: 1;
  }

  .exempt-info-panel {
    position: relative;
    background: #FFFDE7;
    border: 1px solid #FFD54F;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.82rem;
    color: #4E342E;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .exempt-info-close {
    position: absolute;
    top: 6px;
    right: 8px;
    background: none;
    border: none;
    font-size: 0.8rem;
    color: #999;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .exempt-info-heading {
    font-weight: 700;
    margin: 0 0 4px 0;
    font-size: 0.85rem;
    color: #5D4037;
  }

  .exempt-info-note {
    margin: 0 0 6px 0;
    font-style: italic;
    color: #888;
  }

  .exempt-info-section {
    font-weight: 600;
    margin: 4px 0 0 0;
    color: #4E342E;
  }

  .exempt-info-body {
    margin: 0 0 2px 0;
    color: #5D4037;
    padding-left: 4px;
  }

  /* ── Link Nutrition info ─────────────────────────────────────────────────── */
  .link-nutrition-info-btn {
    background: none;
    border: none;
    font-size: 0.78rem;
    color: #1565C0;
    cursor: pointer;
    padding: 0 6px 0 0;
    text-decoration: underline;
    text-underline-offset: 2px;
    white-space: nowrap;
    align-self: center;
  }

  .link-nutrition-info-btn:hover {
    color: #0D47A1;
  }

  .link-nutrition-info-panel {
    position: relative;
    background: #E3F2FD;
    border: 1px solid #90CAF9;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.82rem;
    color: #1A237E;
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 4px;
  }
</style>
