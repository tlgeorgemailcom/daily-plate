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
    ingredientStatus?: 'required' | 'optional' | 'exempt'; // Required (in math) | Optional (cook may omit, not in math) | Exempt (no NDB, not in math)
    isDish?: boolean;        // marks the synthesized dish-level row (Rule A/B/C)
    section?: string;        // v3 §18: section_key linking ingredient to a recipe section (cooking math FK)
    ingredient_group?: string; // v3 §19: display-only sub-label within a section (e.g. 'crust', 'filling')
  }

  // v3.md §18 — per-section cooking method metadata for multi-stage recipes.
  export interface RecipeSection {
    key: string;
    label: string;
    /** Optional pre-step before the primary (recipe-level) cook. undefined/'none' = no pre-step. */
    prepMethod?: string;
    /** Section cook method — driven by the recipe-level cookingMethod; used by the pipeline. Not shown in UI. */
    cookingMethod: string;
    yieldFactorWater?: number;
    yieldFactorFat?: number;
    yieldFactorOther?: number;
    /** Stovetop uncovered time for the prep step in minutes (feeds calcYieldWater prep pass). */
    boilMinutes?: number;
    /** Oven temperature °F for a baked/par-baked prep step. */
    prepTempF?: number;
    /** Primary oven temperature °F (single-stage bake). */
    cookTempF?: number;
    /** Primary oven time in minutes (single-stage bake). */
    cookMinutes?: number;
    /** Multi-stage oven sequence from recipe_sections.csv cook_stages. */
    stages?: Array<{ tempF: number; minutes: number }>;
    /** Explicit filling class from recipe_sections.csv (e.g. 'dense_fruit'). */
    fillClass?: string;
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
    gramsPerServing?: number | null;
    [key: string]: unknown;
  }
  
  export interface RecipeFormData {
    recipeName: string;     // combined: "Dish Name — Suffix"
    dishName: string;       // common dish name e.g. "Apple Pie"
    recipeSuffix: string;   // personal suffix e.g. "Grandma's"
    cookingMethod: string;  // Bake | Boil | Grill | Fry | No heat
    cookMinutes?: number;         // Primary cook time in minutes (recipe-level)
    cookTempF?: number;           // Oven temperature °F (recipe-level, Bake only)
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
    yieldFactorWater?: number;
    yieldFactorFat?: number;
    sr28Rule?: 'Rule A' | 'Rule B' | 'Rule C' | 'Rule D' | 'Rule F' | 'Rule G';
    sections?: RecipeSection[];
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
    /** SWEET_xxx recipe id — when supplied and Rule A/B, the audit chart
     *  pulls the "Built" column from recipes_v3/output/builds/<id>.json
     *  via /api/recipes/v3-build/<id>. Read-only; no Turso writes. */
    recipeId?: string;
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
    disableSuggestions = false,
    recipeId
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
  
  const COOKING_METHODS = ['Bake', 'Boil', 'Simmer', 'Sub-simmer', 'Braise', 'Pan grill', 'Grill', 'Fry', 'No heat'];
  const COOK_METHOD_DISPLAY: Record<string, string> = {
    'Boil':      'Boil (lid off)',
    'Simmer':    'Simmer (lid off)',
    'Sub-simmer':'Sub-simmer (lid off)',
    'Braise':    'Braise (covered)',
  };
  // v3.md §18.1 — lowercase enum stored in recipe_sections.csv::cooking_method.
  const SECTION_COOKING_METHODS = ['raw', 'boiled', 'steamed', 'baked', 'fried', 'pan grilled', 'grilled', 'microwave'];
  const SECTION_PREP_METHODS    = ['boiled', 'simmer', 'sub-simmer', 'braise', 'steamed', 'blanched', 'baked', 'par-baked', 'fried', 'pan grilled', 'grilled', 'marinated', 'chilled', 'microwave'];
  // Display labels for prep methods — stored values are clean identifiers;
  // UI annotations clarify open-pot vs covered assumption for the water model.
  const PREP_METHOD_DISPLAY: Record<string, string> = {
    'boiled':     'boiled (lid off)',
    'simmer':     'simmer (lid off)',
    'sub-simmer': 'sub-simmer (lid off)',
    'braise':     'braise (covered)',
  };
  // v3.md §18.6 — datalist suggestions; free-typing is always allowed.
  const SECTION_LABEL_VOCAB = [
    'base', 'batter', 'broth', 'cold prep', 'crust', 'dough', 'filling',
    'frosting', 'garnish', 'glaze', 'hot prep', 'marinade', 'raw assembly',
    'sauce', 'stage 1', 'stage 2', 'stage 3', 'topping'
  ];
  const LOCAL_FOODS_BY_NDB = new Map(FOODS.map(food => [food.ndb, food]));

  // Form state
  let recipeName = $state(initialData.recipeName || '');
  // Split existing recipeName into parts if present (format: "Dish Name — Suffix")
  let dishName = $state(initialData.dishName || (initialData.recipeName?.includes(' — ') ? initialData.recipeName.split(' — ')[0] : initialData.recipeName || ''));
  let recipeSuffix = $state(initialData.recipeSuffix || (initialData.recipeName?.includes(' — ') ? initialData.recipeName.split(' — ')[1] : ''));
  // Normalize the initial cook method: map pipeline values ('baked','boiled','raw','multi', etc.)
  // to UI labels ('Bake','Boil','No heat', …). Unknown/multi → 'No heat'; missing → 'Bake'.
  const _initCM = initialData.cookingMethod ?? '';
  const _matchedCM = COOKING_METHODS.find(m => m.toLowerCase() === _initCM.toLowerCase());
  let cookingMethod = $state<string>(_matchedCM ?? '');
  let cookMinutes = $state<number | undefined>(initialData.cookMinutes);
  let cookTempF = $state<number | undefined>(initialData.cookTempF);
  let cookHelpOpen = $state(false);
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
          ingredientStatus: ing.exempt ? 'exempt' : 'required',
          section: ing.section
        }))
      : [{ id: 1, name: '', quantity: '', gameFood: '', animal: '' }]
  );
  let sections = $state<RecipeSection[]>(initialData.sections ?? []);
  let sectionAdvancedOpen = $state<Record<number, boolean>>({});

  // Backfill missing/unknown ingredient.section assignments by carrying forward
  // the most recently-seen valid section (falls back to first section). This
  // eliminates "Unsectioned ingredients" for sectioned recipes whose drafts
  // pre-date section support or whose positional fallback didn't reach every
  // row. Run once at init AND whenever sections/ingredients shape changes.
  function fillMissingSections() {
    if (!sections.length) return;
    const validKeys = new Set(sections.map((s) => s.key));
    let lastSeen: string | undefined = undefined;
    for (const ing of ingredients) {
      if (ing.section && validKeys.has(ing.section)) {
        lastSeen = ing.section;
      } else {
        ing.section = lastSeen ?? sections[0].key;
        lastSeen = ing.section;
      }
    }
  }
  fillMissingSections();
  $effect(() => {
    // Re-run when section count or ingredient count changes
    sections.length;
    ingredients.length;
    fillMissingSections();
  });
  
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
  const sr28Rule = initialData.sr28Rule ?? undefined;
  const isCanonicalRule = sr28Rule === 'Rule A' || sr28Rule === 'Rule B';

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
    return Boolean(
      (ingredient.foodWord || ingredient.ndbNo) &&
      ingredient.portionGrams && ingredient.portionGrams > 0
    );
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
    const quantity = portionDesc === 'g'
      ? `${portionGrams}g`
      : count === 1
        ? portionDesc
        : `${count} ${portionDesc}`;
    ingredients = ingredients.map(i => i.id === ingId ? {
      ...i,
      foodWord: food.word,
      ndbNo: food.ndb,
      portionDesc,
      portionGrams,
      servingCount: portionDesc === 'g' ? 1 : count,
      quantity,
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

  function setIngredientStatus(ingId: number, status: 'required' | 'optional' | 'exempt') {
    ingredients = ingredients.map(i => i.id === ingId ? { ...i, ingredientStatus: status } : i);
  }
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

  // v3.md §18/§19 — group ingredients for header rendering.
  // Groups by ingredient_group (display sub-label) when present; falls back to
  // section (cooking-math FK). Returns an array of { section, header, items[] }.
  // `header` is empty when there is no section/group data for the recipe.
  function buildIngredientGroups<T extends { section?: string; ingredient_group?: string; name?: string; quantity?: string }>(
    list: T[]
  ): Array<{ section: string | undefined; header: string; items: T[] }> {
    const groups: Array<{ section: string | undefined; header: string; items: T[] }> = [];
    for (const ing of list) {
      const groupKey = ing.ingredient_group || ing.section;
      const last = groups[groups.length - 1];
      if (last && last.section === groupKey) {
        last.items.push(ing);
      } else {
        groups.push({ section: groupKey, header: formatSectionHeader(groupKey), items: [ing] });
      }
    }
    return groups;
  }

  function formatSectionHeader(sectionKey: string | undefined): string {
    if (!sectionKey) return '';
    const meta = sections.find((s) => s.key === sectionKey);
    if (meta) {
      const label = meta.label || (sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1));
      if (meta.prepMethod && meta.prepMethod !== 'none') {
        if (meta.cookingMethod && meta.cookingMethod !== meta.prepMethod) {
          return `${label} — ${meta.prepMethod} → ${meta.cookingMethod}`;
        }
        return `${label} — ${meta.prepMethod}`;
      }
      if (meta.cookingMethod) return `${label} — ${meta.cookingMethod}`;
      return `${label}`;
    }
    return sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1) + ':';
  }

  // v3.md §18.6 — sections editor helpers.
  function slugifySectionKey(label: string): string {
    return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }
  function uniqueSectionKey(base: string, excludeIdx: number = -1): string {
    const taken = new Set(sections.map((s, i) => i === excludeIdx ? '' : s.key).filter(Boolean));
    if (!taken.has(base)) return base;
    let n = 2;
    while (taken.has(`${base}_${n}`)) n++;
    return `${base}_${n}`;
  }
  function addSection() {
    const key = uniqueSectionKey('section_' + (sections.length + 1));
    sections = [...sections, { key, label: '', prepMethod: 'none', cookingMethod: 'baked', yieldFactorWater: 1.0, boilMinutes: undefined }];
  }
  function removeSection(idx: number) {
    const removedKey = sections[idx]?.key;
    sections = sections.filter((_, i) => i !== idx);
    // Detach ingredients from the removed section (keep them in the recipe,
    // unsectioned) so the author doesn't lose data on an accidental click.
    if (removedKey) {
      ingredients = ingredients.map((ing) =>
        ing.section === removedKey ? { ...ing, section: undefined } : ing
      );
    }
  }
  function onSectionLabelChange(idx: number, newLabel: string) {
    const old = sections[idx];
    if (!old) return;
    // If key was auto-derived from old label (or empty), re-derive.
    const wasAutoKey = !old.key || old.key === slugifySectionKey(old.label);
    const next = { ...old, label: newLabel };
    if (wasAutoKey) {
      const newKey = uniqueSectionKey(slugifySectionKey(newLabel) || `section_${idx + 1}`, idx);
      // Re-key any ingredients pointing at the old key.
      if (old.key && old.key !== newKey) {
        ingredients = ingredients.map((ing) =>
          ing.section === old.key ? { ...ing, section: newKey } : ing
        );
      }
      next.key = newKey;
    }
    sections = sections.map((s, i) => (i === idx ? next : s));
  }

  // v3.md §18.6 — add a new empty section AND a starter ingredient row inside
  // it, so the author sees an editable target immediately.
  function addSectionWithRow() {
    const idx = sections.length;
    const key = uniqueSectionKey(`section_${idx + 1}`);
    sections = [...sections, { key, label: '', prepMethod: 'none', cookingMethod: 'baked', yieldFactorWater: 1.0, boilMinutes: undefined }];
    addIngredientToSection(key);
  }

  let nutritionLinkedCount = $derived(
    ingredients.filter(i => i.name.trim() && i.ingredientStatus !== 'exempt' && i.ingredientStatus !== 'optional' && hasIngredientNutritionLink(i)).length
  );
  let nutritionTotalCount = $derived(
    ingredients.filter(i => i.name.trim() && i.ingredientStatus !== 'exempt' && i.ingredientStatus !== 'optional').length
  );
  let nutritionComplete = $derived(
    nutritionMode && nutritionTotalCount > 0 && (
      linkMode === 'dish'
        ? dishLink !== null && ingredients.filter(i => i.name.trim()).every(i => hasIngredientNutritionLink(i))
        : linkMode === 'mixed'
          ? ingredients.filter(i => i.name.trim()).every(i => hasIngredientNutritionLink(i))
          : nutritionLinkedCount === nutritionTotalCount
    )
  );
  // Preview can run as soon as we have ANY linked ingredient (or a dishLink for 'dish' mode).
  // Unlinked rows are simply excluded from the live calculation rather than blocking it.
  let nutritionPreviewReady = $derived(
    nutritionMode && (
      linkMode === 'dish'
        ? dishLink !== null
        : nutritionLinkedCount > 0
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
        exempt: i.ingredientStatus === 'exempt' || i.ingredientStatus === 'optional'
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

  const yieldFactorWater = $state<number | undefined>(
    typeof initialData.yieldFactorWater === 'number' ? initialData.yieldFactorWater
    : typeof (initialData.nutritionJson as Record<string, unknown> | undefined)?.yieldFactorWater === 'number'
      ? (initialData.nutritionJson as Record<string, unknown>).yieldFactorWater as number
      : undefined
  );
  const yieldFactorFat = $state<number | undefined>(
    typeof initialData.yieldFactorFat === 'number' ? initialData.yieldFactorFat
    : typeof (initialData.nutritionJson as Record<string, unknown> | undefined)?.yieldFactorFat === 'number'
      ? (initialData.nutritionJson as Record<string, unknown>).yieldFactorFat as number
      : undefined
  );

  function buildNutritionPayload() {
    return {
      // Only send linked rows to the preview API. Unlinked rows are not yet
      // calculable and are excluded from the live preview rather than blocking it.
      ingredients: ingredients
        .filter((i) => i.name.trim() && hasIngredientNutritionLink(i))
        .map((i) => {
          return {
            name: i.name.trim(),
            ndbNo: i.ndbNo,
            foodWord: i.foodWord,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount ?? 1,
            exempt: i.ingredientStatus === 'exempt' || i.ingredientStatus === 'optional',
          };
        }),
      dishLink: dishLink ?? undefined,
      linkType: linkMode,
      servings,
      cookingMethod,
      ...(typeof yieldFactorWater === 'number' ? { yieldFactorWater } : {}),
      ...(typeof yieldFactorFat   === 'number' ? { yieldFactorFat }   : {}),
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
    per100g?: { Energy_KCal: number; Protein: number; TotalLipidFat: number; Carbohydrate: number; FiberTotalDietary: number; SugarsTotal: number; Water: number };
    gramsPerServing: number | null;
    servings: number;
  };
  let liveNutritionJson = $state<PreviewNutrition | null>(null);
  let canonicalNutritionJson = $state<PreviewNutrition | null>(null);
  let previewLoading = $state(false);
  let previewError = $state(false);
  let previewTimer: ReturnType<typeof setTimeout> | null = null;
  let previewRequestId = 0;

  let persistedNutrition = $state<PersistedNutritionJson | null | undefined>(initialData.nutritionJson);

  let showStoredNutrition = $derived(
    !!persistedNutrition?.perServing &&
    (
      !nutritionFieldsDirty ||
      // Keep stored visible while the user is still linking new ingredient rows.
      // Switching to the partial live preview mid-edit produced confusing swaps.
      nutritionLinkedCount < nutritionTotalCount
    )
  );

  $effect(() => {
    if (!nutritionPreviewReady) {
      liveNutritionJson = null;
      canonicalNutritionJson = null;
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
        const data = await res.json() as { nutritionJson: PreviewNutrition | null; canonical?: PreviewNutrition | null };
        if (previewRequestId !== id) return;
        liveNutritionJson = data.nutritionJson ?? null;
        canonicalNutritionJson = data.canonical ?? null;
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

  // ─── v3 pipeline build (read-only file artifact) ─────────────────────────────
  // For Rule A/B SWEET_xxx recipes, fetch the v3 build's per-100g from
  // /api/recipes/v3-build/<recipe_id> (which reads recipes_v3/output/builds/<id>.json).
  // The audit gap chart prefers this over the live SR28 preview because v3 has
  // been independently validated against canonical USDA. v3 is never uploaded
  // to Turso here — this is read-only display.
  type V3Ingredient = {
    ingredient_key: string;
    ndb_no: string;
    long_desc: string;
    grams: number;
    section?: string;
    ingredient_group?: string;
    qty_display?: string;
    component_ref?: string;
  };
  type V3Build = {
    recipe_id: string;
    recipeName?: string;
    per100g?: PreviewNutrition['per100g'];
    perServing?: Record<string, number>;
    gramsPerServing?: number;
    yieldFactorWater?: number;
    yieldFactorFat?: number;
    srRule?: string;
    cookMethod?: string;
    auditStatus?: string;
    auditNotes?: string;
    ingredients?: V3Ingredient[];
    skippedIngredients?: Array<{ ingredient_key: string; reason: string }>;
    sections?: Array<{
      section_key: string;
      section_label: string;
      prep_method?: string;
      cook_method?: string;
      cooking_method: string;
      yield_factor_water?: number;
      yield_factor_fat?: number;
      yield_factor_other?: number;
      cook_stages?: Array<{ tempF: number; minutes: number }>;
      boil_minutes?: number;
      fill_class?: string;
    }>;
  };
  let v3Build = $state<V3Build | null>(null);
  let v3BuildMissing = $state(false);

  $effect(() => {
    const id = recipeId;
    // In moderatorMode we always want v3 data when a build exists (ingredient
    // groups, audit chart, etc.) regardless of canonical rule.
    if (!id || !/^[A-Z]+_[0-9]+$/.test(id) || (!isCanonicalRule && !moderatorMode)) {
      v3Build = null;
      v3BuildMissing = false;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/recipes/v3-build/${encodeURIComponent(id)}`);
        if (cancelled) return;
        if (res.status === 404) { v3Build = null; v3BuildMissing = true; return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as V3Build;
        v3Build = data;
        v3BuildMissing = false;
        // ── v3 is source of truth: replace form ingredients with v3 ingredients ──
        // Also import per-section metadata (label, cooking_method, yield factors)
        // so the inline section-headers-as-group-headers UI renders correctly.
        if (data.sections && data.sections.length > 0) {
          // For single-section recipes, use the live recipe name instead of
          // the section_label from the CSV (which would just be a cooking
          // method or a hardcoded name that drifts from the stored title).
          const autoLabel = data.sections.length === 1
            ? (recipeName || data.recipeName || data.sections[0].section_label)
            : null;
          sections = data.sections.map((s) => {
            const pm = (() => { const v = s.cook_method ?? s.cooking_method ?? s.prep_method; return (!v || v === 'raw') ? 'none' : v as string; })();
            const prepIsBaked = pm === 'baked' || pm === 'par-baked';
            const stageArr = Array.isArray(s.cook_stages) ? s.cook_stages as Array<{ tempF: number; minutes: number }> : [];
            const firstStage = stageArr[0];
            return {
              key: s.section_key,
              label: autoLabel ?? s.section_label,
              prepMethod: pm,
              cookingMethod: s.cooking_method,
              yieldFactorWater: s.yield_factor_water,
              yieldFactorFat: s.yield_factor_fat,
              yieldFactorOther: s.yield_factor_other,
              // For baked/par-baked prep steps, time and temp come from cook_stages[0].
              // For stovetop prep steps (boiled/simmer/…), use boil_minutes when set,
              // otherwise fall back to cook_stages[0].minutes (BKFST-style staging).
              boilMinutes: prepIsBaked
                ? (firstStage?.minutes ?? undefined)
                : (s.boil_minutes || firstStage?.minutes),
              prepTempF: prepIsBaked ? (firstStage?.tempF ?? undefined) : undefined,
              stages: stageArr.length > 0 ? stageArr : undefined,
              fillClass: s.fill_class ?? undefined,
            };
          });
          // If 2+ sections each have their own cook method, blank the recipe-level
          // primary cook — there's no single primary heat that applies to the whole dish.
          // Blank the primary cook bar whenever sections handle their own heat,
          // or when no real heat exists at the recipe level.
          // Exception: quiche pattern — all sections are raw-assembled but a real
          // oven bake applies to the whole dish (cookingMethod is a true heat like 'Bake').
          const nonRawSections = sections.filter(sec => sec.prepMethod && sec.prepMethod !== 'none');
          const hasAnySectionHeat = nonRawSections.length > 0;
          const allSectionsRaw = nonRawSections.length === 0;
          const primaryIsRawOrEmpty = !cookingMethod || cookingMethod === 'No heat';

          if (sections.length > 0) {
            if (hasAnySectionHeat || (allSectionsRaw && primaryIsRawOrEmpty)) {
              // Sections display their own heat, or there's no meaningful primary heat
              cookingMethod = '';
              cookMinutes = undefined;
              cookTempF = undefined;
            } else if (allSectionsRaw && !primaryIsRawOrEmpty) {
              // Quiche pattern: all sections assembled raw, but the whole dish bakes.
              // Derive cook time/temp from whichever section carries the oven stages.
              const eligibleSecs2 = sections.filter(
                sec => sec.prepMethod !== 'baked' && sec.prepMethod !== 'par-baked'
                    && Array.isArray(sec.stages) && sec.stages.length > 0
              );
              if (eligibleSecs2.length === 1) {
                const stgs = eligibleSecs2[0].stages as Array<{ tempF: number; minutes: number }>;
                const totalMins = stgs.reduce((sum, st) => sum + (st.minutes ?? 0), 0);
                if (totalMins > 0 && cookMinutes == null) cookMinutes = totalMins;
                const lastTempF = stgs[stgs.length - 1].tempF;
                if (lastTempF > 0 && cookTempF == null) cookTempF = lastTempF;
              }
            }
          }
        }
        // Composite recipes (Rule D) reference child recipes via `component_ref`
        // rows that have no NDB. We skip those here and rely on initialData's
        // pre-expanded children (from levelToFormData) to populate the editor.
        const v3LeafIngredients = (data.ingredients ?? []).filter((ing) => !ing.component_ref);
        if (v3LeafIngredients.length > 0) {
          const ndbToFood = new Map(FOODS.map(f => [f.ndb, f]));
          ingredients = v3LeafIngredients.map((ing, i) => {
            const food = ndbToFood.get(ing.ndb_no);
            return {
              id: i + 1,
              name: ing.long_desc || ing.ingredient_key,
              quantity: ing.qty_display || `${ing.grams.toFixed(1)} g`,
              gameFood: '' as FoodType | '',
              animal: '' as AnimalType | '',
              foodWord: food?.word,
              ndbNo: ing.ndb_no,
              portionDesc: ing.qty_display || `${ing.grams.toFixed(1)} g`,
              portionGrams: ing.grams,
              servingCount: 1,
              ingredientStatus: 'required' as const,
              section: ing.section,
              ingredient_group: ing.ingredient_group || ing.section,
            };
          });
          nextIngredientId = ingredients.length + 1;
          // Append moderator-added ingredients from stored data that aren't in the v3 build
          // (e.g. optional spices added via the Edit Recipe UI).
          const v3NdbNos = new Set(v3LeafIngredients.map((i) => i.ndb_no).filter(Boolean));
          const storedExtras = (initialData.ingredients ?? []).filter(
            (ing) => !ing.isDish && (ing.ndbNo ? !v3NdbNos.has(ing.ndbNo) : true)
          );
          if (storedExtras.length > 0) {
            let extraIdx = ingredients.length + 1;
            ingredients = [
              ...ingredients,
              ...storedExtras.map((ing) => ({
                id: extraIdx++,
                name: ing.name,
                quantity: ing.quantity || '',
                gameFood: '' as FoodType | '',
                animal: '' as AnimalType | '',
                foodWord: ing.foodWord,
                ndbNo: ing.ndbNo,
                portionDesc: ing.portionDesc,
                portionGrams: ing.portionGrams,
                servingCount: ing.servingCount ?? 1,
                ingredientStatus: (ing as RecipeIngredient).ingredientStatus ?? 'required' as 'required' | 'optional' | 'exempt',
                section: ing.section,
                ingredient_group: (ing as RecipeIngredient).ingredient_group || ing.section,
              })),
            ];
            nextIngredientId = extraIdx;
          }
          // Append any ingredients the build skipped due to missing ledger/NDB
          // data so the moderator can see and action them. These are shown with
          // exempt=true and a name that states the data-quality reason.
          if (data.skippedIngredients && data.skippedIngredients.length > 0) {
            let idx = ingredients.length + 1;
            for (const sk of data.skippedIngredients) {
              ingredients = [
                ...ingredients,
                {
                  id: idx++,
                  name: `⚠ ${sk.ingredient_key} [${sk.reason}]`,
                  quantity: '',
                  gameFood: '' as FoodType | '',
                  animal: '' as AnimalType | '',
                  foodWord: undefined,
                  ndbNo: undefined,
                  portionDesc: '',
                  portionGrams: 0,
                  servingCount: 1,
                  ingredientStatus: 'exempt' as const,
                  section: '',
                  ingredient_group: '',
                },
              ];
            }
            nextIngredientId = idx;
          }
          // When sections drive per-stage cooking methods, the recipe-wide
          // cookingMethod field is meaningless — leave it untouched (the UI
          // hides the field when sections.length > 0).
          if (data.cookMethod && (!data.sections || data.sections.length === 0)) {
            const cm = data.cookMethod.trim();
            const norm = cm.toLowerCase() === 'no heat' || cm.toLowerCase() === 'noheat' || cm.toLowerCase() === 'none'
              ? 'No heat'
              : cm.charAt(0).toUpperCase() + cm.slice(1).toLowerCase();
            const match = COOKING_METHODS.find(m => m.toLowerCase() === norm.toLowerCase());
            if (match) cookingMethod = match;
          }
        }
      } catch {
        if (!cancelled) { v3Build = null; v3BuildMissing = true; }
      }
    })();
    return () => { cancelled = true; };
  });
  // ─────────────────────────────────────────────────────────────────────────────

  // ─── Live macro totals from linked ingredients ───────────────────────────────
  const FOOD_MAP_LOCAL = new Map(FOODS.map(f => [f.word, f]));
  const FOOD_MAP_BY_NDB = new Map(FOODS.map(f => [f.ndb, f]));

  function parseServingsCount(s: string): number | null {
    if (!s) return null;
    // Extract from "(makes N)" pattern first — avoids "1 unit (makes 12)" → 112.
    const makesMatch = s.match(/\(makes\s+([\d.]+)\)/i);
    if (makesMatch) {
      const n = parseFloat(makesMatch[1]);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    // Fallback: plain number or legacy format.
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

  // v3.md §18.6 — add an ingredient already assigned to a section.
  function addIngredientToSection(sectionKey: string) {
    ingredients = [...ingredients, {
      id: ++nextIngredientId,
      name: '',
      quantity: '',
      gameFood: '',
      animal: '',
      section: sectionKey
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

  // ── Edit/Preview dialog ────────────────────────────────────────────────
  let showEditPreviewDialog = $state(false);
  let dialogView: 'preview' | 'edit' = $state('preview');
  let dialogIngredientsSnapshot: RecipeIngredient[] = [];
  let dialogInstructionsSnapshot: RecipeInstruction[] = [];

  function openEditPreviewDialog() {
    // Deep copy current arrays so Close can revert
    dialogIngredientsSnapshot = ingredients.map(i => ({ ...i }));
    dialogInstructionsSnapshot = instructions.map(s => ({ ...s }));
    dialogView = 'preview';
    showEditPreviewDialog = true;
  }

  function closeEditPreviewDiscard() {
    // Revert any reorders/edits made inside the dialog
    ingredients = dialogIngredientsSnapshot.map(i => ({ ...i }));
    instructions = dialogInstructionsSnapshot.map(s => ({ ...s }));
    showEditPreviewDialog = false;
  }

  function closeEditPreviewSave() {
    // Keep current ingredients/instructions order; user still has to hit
    // the form's main Save/Submit to persist to the server
    showEditPreviewDialog = false;
  }

  function moveIngredient(id: number, dir: -1 | 1) {
    const idx = ingredients.findIndex(i => i.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= ingredients.length) return;
    const next = [...ingredients];
    [next[idx], next[target]] = [next[target], next[idx]];
    ingredients = next;
  }

  function moveInstruction(id: number, dir: -1 | 1) {
    const idx = instructions.findIndex(s => s.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= instructions.length) return;
    const next = [...instructions];
    [next[idx], next[target]] = [next[target], next[idx]];
    instructions = next;
  }

  // "What changed" summary inside the dialog (snapshot vs current)
  function dialogChangeSummary(): string[] {
    const changes: string[] = [];
    const sameOrder = (a: { id: number }[], b: { id: number }[]) =>
      a.length === b.length && a.every((x, i) => x.id === b[i].id);
    if (!sameOrder(dialogIngredientsSnapshot, ingredients)) {
      changes.push('Ingredients reordered');
    }
    if (!sameOrder(dialogInstructionsSnapshot, instructions)) {
      changes.push('Instructions reordered');
    }
    // Text edits
    const ingTextChanges = ingredients.filter(cur => {
      const prev = dialogIngredientsSnapshot.find(p => p.id === cur.id);
      return prev && (prev.name !== cur.name || prev.quantity !== cur.quantity);
    }).length;
    if (ingTextChanges > 0) {
      changes.push(`${ingTextChanges} ingredient${ingTextChanges === 1 ? '' : 's'} edited`);
    }
    const stepTextChanges = instructions.filter(cur => {
      const prev = dialogInstructionsSnapshot.find(p => p.id === cur.id);
      return prev && prev.text !== cur.text;
    }).length;
    if (stepTextChanges > 0) {
      changes.push(`${stepTextChanges} step${stepTextChanges === 1 ? '' : 's'} edited`);
    }
    return changes;
  }

  // Form submission
  function handleSubmit(e: Event) {
    e.preventDefault();
    
    const combined = recipeSuffix.trim() ? `${dishName.trim()} — ${recipeSuffix.trim()}` : dishName.trim();
    recipeName = combined;
    const linked = nutritionMode; // per-ingredient NDB inclusion gated by hasIngredientNutritionLink; don't strip existing links if completeness drops
    const data: RecipeFormData = {
      recipeName: combined,
      dishName: dishName.trim(),
      recipeSuffix: recipeSuffix.trim(),
      cookingMethod,
      cookMinutes: cookMinutes ?? undefined,
      cookTempF: cookTempF ?? undefined,
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
        ...(i.section ? { section: i.section } : {}),
        ...(linked ? {
          ...(hasIngredientNutritionLink(i) ? {
            foodWord: i.foodWord,
            ndbNo: i.ndbNo,
            portionDesc: i.portionDesc,
            portionGrams: i.portionGrams,
            servingCount: i.servingCount ?? 1,
          } : {}),
          ...(i.ingredientStatus === 'exempt' ? { exempt: true } : {}),
          ...(i.ingredientStatus === 'optional' ? { is_optional: true } : {})
        } : {})
      })),
      instructions: instructions.filter(i => i.text.trim()),
      foodSupply: moderatorMode ? foodSupply : undefined,
      nutritionComplete: linked || undefined,
      ...(sections.length > 0 ? {
        // Inject recipe-level cook time/temp into every section so the pipeline
        // can build oven stages without needing per-section overrides.
        sections: sections.map(s => ({ ...s, cookMinutes: cookMinutes ?? undefined, cookTempF: cookTempF ?? undefined }))
      } : {})
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
    sections?: RecipeSection[] | null;
  }

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
      ingredientStatus: (ing as RecipeIngredient).ingredientStatus ?? 'required',
      // v3.md §18 — carry per-row section assignment so suggestion-fills
      // can reconstruct section grouping in the editor.
      section:
        (ing as RecipeIngredient).section ??
        (ing as { section_key?: string }).section_key ??
        undefined,
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

  async function fillFromSuggestion(suggestion: RecipeSuggestion) {
    applySuggestionMeta(suggestion);

    // For dev recipes, always fetch the v3-build API to get the inline-expanded
    // ingredient list. The suggest API returns recipe_ingredients_json verbatim,
    // which keeps composite recipes' component_ref stubs (isDish=true rows are
    // dropped) — so only the 2-3 non-ref leaf rows survive. The v3-build API's
    // `ingredients` array has those stubs replaced by each child recipe's actual
    // leaf ingredients, giving the full ingredient list the moderator sees.
    // Fall back to suggestion.ingredients if the API is unreachable.
    let v3Data: Record<string, unknown> | null = null;
    if (suggestion.sourceType === 'dev') {
      try {
        const res = await fetch(`/api/recipes/v3-build/${encodeURIComponent(suggestion.id)}`);
        if (res.ok) v3Data = await res.json();
      } catch {
        /* network error — fall through to suggestion data */
      }
    }

    const rawIngredients =
      (v3Data && Array.isArray(v3Data.ingredients) && (v3Data.ingredients as unknown[]).length > 0)
        ? (v3Data.ingredients as RecipeIngredient[])
        : suggestion.ingredients;
    if (Array.isArray(rawIngredients) && rawIngredients.length > 0) {
      ingredients = rawIngredients.map((ing, idx) => toMappedIngredient(ing, idx + 1));
      nextIngredientId = ingredients.length;
    }
    const rawInstructions = suggestion.instructions;
    if (Array.isArray(rawInstructions) && rawInstructions.length > 0) {
      instructions = rawInstructions.map((ins, idx) => toMappedInstruction(ins, idx + 1));
      nextInstructionId = instructions.length;
    }

    // v3.md §18 — reconstruct section metadata so the editor shows the same
    // section header bars (label / cooking method / yield factors) the
    // moderator screen does. Both player and dev recipes carry sections inline
    // via Turso sections_json (upload.py populates dev_recipes since 2026-07-01).
    let nextSections: RecipeSection[] | null = null;
    if (Array.isArray(suggestion.sections) && suggestion.sections.length > 0) {
      // Turso sections_json: normalize snake_case (dev recipes) or camelCase
      // (player recipes) to the RecipeSection interface used by the form.
      nextSections = (suggestion.sections as any[]).map((s) => ({
        key: s.key ?? s.section_key ?? '',
        label: s.label ?? s.section_label ?? '',
        prepMethod: (() => { const v = s.prepMethod ?? s.cook_method ?? s.prep_method; return (!v || v === 'raw') ? 'none' : v; })(),
        cookingMethod: s.cookingMethod ?? s.cook_method ?? s.cooking_method ?? 'baked',
        yieldFactorWater: s.yieldFactorWater ?? s.yield_factor_water ?? undefined,
        yieldFactorFat: s.yieldFactorFat ?? s.yield_factor_fat ?? undefined,
        yieldFactorOther: s.yieldFactorOther ?? s.yield_factor_other ?? undefined,
        boilMinutes: s.boilMinutes ?? s.boil_minutes ?? undefined,
        cookMinutes: s.cookMinutes ?? s.cook_minutes ?? undefined,
        cookTempF: s.cookTempF ?? s.cook_temp_f ?? undefined,
        stages: s.stages ?? s.cook_stages ?? undefined,
        fillClass: s.fillClass ?? s.fill_class ?? undefined,
      })).filter((s: RecipeSection) => s.key);
    } else if (v3Data && Array.isArray(v3Data.sections) && (v3Data.sections as unknown[]).length > 0) {
      // v3-build was already fetched above — use its sections (avoids a second fetch).
      nextSections = (v3Data.sections as Record<string, unknown>[]).map((s) => ({
        key: String(s.section_key ?? s.key ?? ''),
        label: String(s.section_label ?? s.label ?? ''),
        prepMethod: (() => { const v = typeof s.cook_method === 'string' ? s.cook_method : (typeof s.prepMethod === 'string' ? s.prepMethod : (typeof s.prep_method === 'string' ? s.prep_method : undefined)); return (!v || v === 'raw') ? 'none' : v; })(),
        cookingMethod: String(s.cooking_method ?? s.cookingMethod ?? 'baked'),
        yieldFactorWater: typeof s.yield_factor_water === 'number' ? s.yield_factor_water : (typeof s.yieldFactorWater === 'number' ? s.yieldFactorWater : undefined),
        yieldFactorFat: typeof s.yield_factor_fat === 'number' ? s.yield_factor_fat : (typeof s.yieldFactorFat === 'number' ? s.yieldFactorFat : undefined),
        yieldFactorOther: typeof s.yield_factor_other === 'number' ? s.yield_factor_other : (typeof s.yieldFactorOther === 'number' ? s.yieldFactorOther : undefined),
        boilMinutes: typeof s.boil_minutes === 'number' ? s.boil_minutes : (typeof s.boilMinutes === 'number' ? s.boilMinutes : undefined),
        cookMinutes: typeof s.cook_minutes === 'number' ? s.cook_minutes : (typeof s.cookMinutes === 'number' ? s.cookMinutes : undefined),
        cookTempF: typeof s.cook_temp_f === 'number' ? s.cook_temp_f : (typeof s.cookTempF === 'number' ? s.cookTempF : undefined),
        stages: Array.isArray(s.cook_stages) ? s.cook_stages : (Array.isArray(s.stages) ? s.stages : undefined),
        fillClass: typeof s.fill_class === 'string' ? (s.fill_class || undefined) : (typeof s.fillClass === 'string' ? (s.fillClass || undefined) : undefined),
      })).filter((s: RecipeSection) => s.key);
    }
    if ((!nextSections || nextSections.length === 0) && ingredients.some((i) => i.section)) {
      // Last-resort derivation: synthesise minimal section objects from the
      // unique per-row keys so grouping at least renders.
      const seen = new Set<string>();
      const derived: RecipeSection[] = [];
      for (const ing of ingredients) {
        const k = ing.section;
        if (k && !seen.has(k)) {
          seen.add(k);
          derived.push({
            key: k,
            label: formatSectionHeader(k),
            prepMethod: 'none',
            cookingMethod: 'baked',
          });
        }
      }
      nextSections = derived;
    }
    if (nextSections) {
      sections = nextSections;
      // Derive recipe-level cookTempF / cookMinutes from the first section
      // that carries a non-empty stages array (upload.py writes cook_stages
      // from recipe_sections.csv into Turso sections_json since 2026-07-01).
      // Skip baked/par-baked sections — their stages drive the Prep display.
      for (const sec of nextSections) {
        if (sec.prepMethod !== 'baked' && sec.prepMethod !== 'par-baked' && Array.isArray(sec.stages) && sec.stages.length > 0) {
          const stgs = sec.stages as Array<{ tempF: number; minutes: number }>;
          const totalMins = stgs.reduce((sum, st) => sum + (st.minutes ?? 0), 0);
          if (totalMins > 0 && cookMinutes == null) cookMinutes = totalMins;
          const lastTempF = stgs[stgs.length - 1].tempF;
          if (lastTempF > 0 && cookTempF == null) cookTempF = lastTempF;
          break;
        }
      }
    }

    suggestionsDismissed = true;
    // Load stored nutrition from the source recipe (comes from dev_recipes).
    persistedNutrition = suggestion.nutritionJson ?? null;
    // Reset the dirty signature so the form shows as clean after fill.
    initialNutritionSignature = buildNutritionSignature();
  }
  
  // Current form data (for customActions snippet)
  let formData = $derived<RecipeFormData>({
    recipeName: `${dishName.trim()}${recipeSuffix.trim() ? ` — ${recipeSuffix.trim()}` : ''}`,
    dishName: dishName.trim(),
    recipeSuffix: recipeSuffix.trim(),
    cookingMethod,
    cookMinutes: cookMinutes ?? undefined,
    cookTempF: cookTempF ?? undefined,
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

      {#if nutritionTotalCount > 0}
        <div class="nutrition-progress" class:complete={nutritionComplete}>
          {#if nutritionComplete}
            ✅ Nutrition complete — all {nutritionTotalCount} ingredient{nutritionTotalCount === 1 ? '' : 's'} accounted for
          {:else}
            🔗 Nutrition: {nutritionLinkedCount}/{nutritionTotalCount} ingredient{nutritionTotalCount === 1 ? '' : 's'} linked
          {/if}
        </div>

        {#if showStoredNutrition}
          {@const hasStoredPer100 = !!persistedNutrition?.per100g}
          {@const showStoredPer100 = macroPer === '100g' && hasStoredPer100}
          <div class="macro-preview stored">
            <div class="macro-preview-header">
              <span class="macro-preview-label">Stored nutrition (recipe record){isCanonicalRule ? ` · ${sr28Rule}` : ''}</span>
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
            {#if nutritionLinkedCount < nutritionTotalCount}
              {@const pending = nutritionTotalCount - nutritionLinkedCount}
              <p class="macro-preview-note">Showing stored values — link {pending} new ingredient{pending === 1 ? '' : 's'} to update the live calculation.</p>
            {/if}
          </div>
        {:else if liveNutritionJson?.perServing}
          {@const p100 = liveNutritionJson.per100g}
          {@const gps = liveNutritionJson.gramsPerServing}
          {@const hasLive100g = !!p100 || (gps != null && gps > 0)}
          {@const showLive100g = macroPer === '100g' && hasLive100g}
          {@const calVal  = showLive100g ? (p100 ? Math.round(p100.Energy_KCal)               : (gps ? Math.round(liveNutritionJson.perServing.cal  / gps * 100) : liveNutritionJson.perServing.cal))  : liveNutritionJson.perServing.cal}
          {@const proVal  = showLive100g ? (p100 ? Math.round(p100.Protein           * 10) / 10 : (gps ? Math.round(liveNutritionJson.perServing.pro  / gps * 100) : liveNutritionJson.perServing.pro))  : liveNutritionJson.perServing.pro}
          {@const fatVal  = showLive100g ? (p100 ? Math.round(p100.TotalLipidFat     * 10) / 10 : (gps ? Math.round(liveNutritionJson.perServing.fat  / gps * 100) : liveNutritionJson.perServing.fat))  : liveNutritionJson.perServing.fat}
          {@const carbVal = showLive100g ? (p100 ? Math.round(p100.Carbohydrate      * 10) / 10 : (gps ? Math.round(liveNutritionJson.perServing.carb / gps * 100) : liveNutritionJson.perServing.carb)) : liveNutritionJson.perServing.carb}
          {@const fibVal  = showLive100g ? (p100 ? Math.round(p100.FiberTotalDietary * 10) / 10 : (gps ? Math.round(liveNutritionJson.perServing.fib  / gps * 100) : liveNutritionJson.perServing.fib))  : liveNutritionJson.perServing.fib}
          {@const sugVal  = showLive100g ? (p100 ? Math.round(p100.SugarsTotal       * 10) / 10 : (gps ? Math.round(liveNutritionJson.perServing.sug  / gps * 100) : liveNutritionJson.perServing.sug))  : liveNutritionJson.perServing.sug}
          <div class="macro-preview" class:complete={true}>
            <div class="macro-preview-header">
              <span class="macro-preview-label">
                {#if showLive100g}
                  Per 100g
                {:else}
                  Per serving{hasValidServings ? ` (${parseServingsCount(servings)} servings)` : ''}
                {/if}
              </span>
              <span class="macro-preview-label">Calculated nutrition</span>
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
                  disabled={!hasLive100g}
                  onclick={() => macroPer = '100g'}
                >100g</button>
              </div>
            </div>
            <div class="macro-preview-values">
              <span><strong>{calVal}</strong> cal</span>
              <span><strong>{proVal}g</strong> protein</span>
              <span><strong>{fatVal}g</strong> fat</span>
              <span><strong>{carbVal}g</strong> carbs</span>
              <span><strong>{fibVal}g</strong> fibre</span>
              <span><strong>{sugVal}g</strong> sugar</span>
            </div>
            {#if nutritionLinkedCount < nutritionTotalCount}
              {@const excluded = nutritionTotalCount - nutritionLinkedCount}
              <p class="macro-preview-note">{excluded} ingredient{excluded === 1 ? '' : 's'} not yet linked — not included in this calculation.</p>
            {/if}
            {#if isCanonicalRule}
              <p class="macro-preview-note">⚠️ {sr28Rule} recipe — stored values use USDA canonical data with cooking-loss adjustments. This preview uses raw SR28 and may differ.</p>
            {/if}
          </div>
        {:else if persistedNutrition?.perServing}
          {@const hasStoredPer100 = !!persistedNutrition?.per100g}
          {@const showStoredPer100 = macroPer === '100g' && hasStoredPer100}
          <div class="macro-preview stored">
            <div class="macro-preview-header">
              <span class="macro-preview-label">Stored nutrition (recipe record){isCanonicalRule ? ` · ${sr28Rule}` : ''}</span>
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
            {#if previewError}
              <p class="macro-preview-note">Could not load recalculated nutrition. Showing stored values.</p>
            {:else if nutritionComplete}
              <p class="macro-preview-note">Recalculation in progress. Showing stored values until preview is ready.</p>
            {:else}
              {@const remainingLinks = Math.max(0, nutritionTotalCount - nutritionLinkedCount)}
              {#if remainingLinks > 0}
                <p class="macro-preview-note">Showing saved nutrition for now. Link {remainingLinks} more ingredient{remainingLinks === 1 ? '' : 's'} to refresh the calculation.</p>
              {:else}
                <p class="macro-preview-note">Showing saved nutrition for now while recalculation gets ready.</p>
              {/if}
            {/if}
          </div>
        {:else if previewLoading && nutritionComplete}
          <div class="macro-preview">
            <div class="macro-preview-header">
              <span class="macro-preview-label">⏳ Recalculating nutrition…</span>
            </div>
          </div>
        {:else if nutritionComplete && macroTotals.linkedCount > 0}
          <div class="macro-preview" class:complete={nutritionComplete}>
            <div class="macro-preview-header">
              <span class="macro-preview-label">
                {#if macroPer === '100g'}
                  Per 100g
                {:else}
                  Per serving{hasValidServings ? ` (${parseServingsCount(servings)} servings)` : ''}
                {/if}
              </span>
              <span class="macro-preview-label">Updated estimate</span>
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
                  onclick={() => macroPer = '100g'}
                >100g</button>
              </div>
            </div>
            <div class="macro-preview-values">
              <span><strong>{macroTotals.cal ?? '--'}</strong> cal</span>
              <span><strong>{macroTotals.pro === null ? '--' : `${macroTotals.pro}g`}</strong> protein</span>
              <span><strong>{macroTotals.fat === null ? '--' : `${macroTotals.fat}g`}</strong> fat</span>
              <span><strong>{macroTotals.carb === null ? '--' : `${macroTotals.carb}g`}</strong> carbs</span>
              <span><strong>{macroTotals.fib === null ? '--' : `${macroTotals.fib}g`}</strong> fibre</span>
              <span><strong>{macroTotals.sug === null ? '--' : `${macroTotals.sug}g`}</strong> sugar</span>
            </div>
          </div>
        {:else if macroTotals.linkedCount > 0}
          <!-- Fallback when preview unavailable but ingredients are linked -->
          <div class="macro-preview" class:complete={false}>
            <div class="macro-preview-header">
              <span class="macro-preview-label">
                {#if macroPer === '100g'}
                  Per 100g
                {:else}
                  Per serving{hasValidServings ? ` (${parseServingsCount(servings)} servings)` : ''}
                {/if}
              </span>
              <span class="macro-preview-label">Local estimate</span>
            </div>
            <div class="macro-preview-values">
              <span><strong>{macroTotals.cal ?? '--'}</strong> cal</span>
              <span><strong>{macroTotals.pro === null ? '--' : `${macroTotals.pro}g`}</strong> protein</span>
              <span><strong>{macroTotals.fat === null ? '--' : `${macroTotals.fat}g`}</strong> fat</span>
              <span><strong>{macroTotals.carb === null ? '--' : `${macroTotals.carb}g`}</strong> carbs</span>
              <span><strong>{macroTotals.fib === null ? '--' : `${macroTotals.fib}g`}</strong> fibre</span>
              <span><strong>{macroTotals.sug === null ? '--' : `${macroTotals.sug}g`}</strong> sugar</span>
            </div>
          </div>
        {/if}

        <!-- Audit gap chart: independent of which preview is showing -->
        {#if isCanonicalRule && canonicalNutritionJson?.per100g && (v3Build?.per100g || liveNutritionJson?.per100g)}
          {@const c = canonicalNutritionJson.per100g}
          {@const builtSource = v3Build?.per100g ? 'v3' : 'live'}
          {@const b = (v3Build?.per100g ?? liveNutritionJson!.per100g) as NonNullable<PreviewNutrition['per100g']>}
          {@const macros = [
            { key: 'cal',  label: 'Calories', unit: 'kcal', canon: c.Energy_KCal,       built: b.Energy_KCal,       major: true  },
            { key: 'pro',  label: 'Protein',  unit: 'g',    canon: c.Protein,           built: b.Protein,           major: true  },
            { key: 'fat',  label: 'Fat',      unit: 'g',    canon: c.TotalLipidFat,     built: b.TotalLipidFat,     major: true  },
            { key: 'carb', label: 'Carbs',    unit: 'g',    canon: c.Carbohydrate,      built: b.Carbohydrate,      major: true  },
            { key: 'fib',  label: 'Fiber',    unit: 'g',    canon: c.FiberTotalDietary, built: b.FiberTotalDietary, major: false },
            { key: 'sug',  label: 'Sugars',   unit: 'g',    canon: c.SugarsTotal,       built: b.SugarsTotal,       major: false },
            { key: 'h2o',  label: 'Water',    unit: 'g',    canon: c.Water,             built: b.Water,             major: true  },
          ]}
          {@const missingMajor = macros.filter(m => m.major && m.canon === 0 && m.built > 0)}
          {@const missingMinor = macros.filter(m => !m.major && m.canon === 0 && m.built > 0)}
          {@const gapsOver5 = macros.filter(m => m.canon > 0 && Math.abs((m.built - m.canon) / m.canon * 100) >= 5)}
          {@const allWithin5 = gapsOver5.length === 0 && missingMajor.length === 0 && missingMinor.length === 0}
          {@const ruleAdvice =
            sr28Rule === 'Rule A' && (missingMajor.length > 0 || missingMinor.length > 0)
              ? `⚠ Mislabel suspected: canonical is missing ${[...missingMajor, ...missingMinor].map(m => m.label).join(', ')}. A canonical with missing macros should be Rule B (fill from build), not Rule A.`
              : sr28Rule === 'Rule B' && missingMajor.length === 0 && missingMinor.length === 0
                ? `⚠ Mislabel suspected: canonical has all macros present. Rule B is reserved for canonicals with missing macros — this should likely be Rule A.`
                : ''}
          <div class="audit-gap-card">
            <div class="audit-gap-header">
              <span class="audit-gap-title">Audit · Canonical vs Built (per 100g)</span>
              <span class="audit-gap-rule">{sr28Rule}</span>
            </div>
            <div class="audit-gap-summary {allWithin5 ? 'pass' : 'fail'}">
              {#if allWithin5}
                ✓ All 7 macros within ±5% of canonical
              {:else}
                {gapsOver5.length} macro{gapsOver5.length === 1 ? '' : 's'} exceed ±5% gap{gapsOver5.length > 0 ? `: ${gapsOver5.map(m => m.label).join(', ')}` : ''}
              {/if}
            </div>
            <div class="audit-gap-source">
              Built source: <strong>{builtSource === 'v3' ? `v3 pipeline (file)` : 'live SR28 preview'}</strong>
              {#if builtSource === 'v3' && v3Build}
                · yfW={v3Build.yieldFactorWater?.toFixed(2) ?? '—'} · gps={v3Build.gramsPerServing ?? '—'}g
              {/if}
              {#if v3BuildMissing && recipeId}
                · <em>v3 build artifact not found for {recipeId} (run recipes_v3/tools/build_all.py)</em>
              {/if}
            </div>
            {#if v3Build?.auditStatus === 'accepted'}
              <div class="audit-gap-accepted">
                <strong>✓ Accepted as-is</strong>
                {#if v3Build.auditNotes}— {v3Build.auditNotes}{/if}
              </div>
            {/if}
            {#if v3Build?.ingredients && v3Build.ingredients.length > 0}
              <details class="v3-ingredients-panel">
                <summary>v3 source ingredients ({v3Build.ingredients.length}) — read-only reference</summary>
                <p class="v3-ingredients-note">
                  These are the grams the v3 audit chart used. If the form's ingredient list above shows different quantities, edit the form to match (or accept the gap).
                </p>
                <table class="v3-ingredients-table">
                  <thead><tr><th>Ingredient</th><th>NDB</th><th class="num">Grams</th><th>Display</th></tr></thead>
                  <tbody>
                    {#each v3Build.ingredients as ing}
                      <tr>
                        <td>{ing.long_desc || ing.ingredient_key}</td>
                        <td class="mono">{ing.ndb_no}</td>
                        <td class="num">{ing.grams.toFixed(1)}</td>
                        <td>{ing.qty_display || ''}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </details>
            {/if}
            <table class="audit-gap-table">
              <thead>
                <tr>
                  <th>Macro</th>
                  <th class="num">Canonical</th>
                  <th class="num">Built</th>
                  <th class="num">Δ (built − canonical)</th>
                  <th class="num">% gap</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {#each macros as m}
                  {@const delta = m.built - m.canon}
                  {@const pct = m.canon > 0 ? (delta / m.canon) * 100 : (m.built > 0 ? Infinity : 0)}
                  {@const canonMissing = m.canon === 0 && m.built > 0}
                  {@const status = canonMissing
                    ? (sr28Rule === 'Rule B' ? 'canonical missing — built value used' : '⚠ canonical missing — should be Rule B')
                    : (Math.abs(pct) < 5 ? 'match' : Math.abs(pct) < 15 ? '⚠ adjust ingredients' : '🔴 large gap — adjust or reclassify')}
                  {@const rowClass = canonMissing
                    ? (sr28Rule === 'Rule B' ? 'fill' : 'bad')
                    : (Math.abs(pct) < 5 ? 'ok' : Math.abs(pct) < 15 ? 'warn' : 'bad')}
                  <tr class="audit-row {rowClass}">
                    <td>{m.label}{m.major ? '' : ' (minor)'}</td>
                    <td class="num">{m.canon.toFixed(2)} {m.unit}</td>
                    <td class="num">{m.built.toFixed(2)} {m.unit}</td>
                    <td class="num">{delta >= 0 ? '+' : ''}{delta.toFixed(2)}</td>
                    <td class="num">{!Number.isFinite(pct) ? '∞' : (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%'}</td>
                    <td>{status}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
            {#if ruleAdvice}
              <p class="audit-gap-advice">{ruleAdvice}</p>
            {/if}
            <p class="audit-gap-note">
              <strong>Goal: every macro within ±5% of canonical.</strong> Adjust ingredient grams to close gaps.
              If a macro can't be brought within 5% (e.g. canonical reference is arithmetically impossible), reclassify the recipe as Rule B by hand and fill from build.
            </p>
          </div>
        {:else if isCanonicalRule}
          <div class="audit-gap-card" style="background:#fef3c7;border-color:#f59e0b;">
            <div class="audit-gap-title">Audit gap chart unavailable</div>
            <p class="audit-gap-note">
              {sr28Rule} recipe. Need both canonical and built per-100g data.
              canonical={canonicalNutritionJson?.per100g ? '✓' : '✗ (no dishLink or canonical fetch failed)'} ·
              built={liveNutritionJson?.per100g ? '✓' : '✗ (live preview not yet computed)'} ·
              previewReady={String(nutritionPreviewReady)} · dishLink.ndb={dishLink?.ndbNo ?? 'null'}
            </p>
          </div>
        {/if}
      {/if}
    {/if}

    <div class="ingredients-list">
      <p class="section-hint" style="margin: 0 0 8px 0;">List all ingredients with quantities (e.g., "2 cups flour", "1 tsp salt")</p>

      <datalist id="section-label-vocab">
        {#each SECTION_LABEL_VOCAB as v}
          <option value={v}></option>
        {/each}
      </datalist>

      {#snippet sectionHeaderBar(sec: RecipeSection, sIdx: number)}
        <div class="section-header-bar">
          <input
            type="text"
            list="section-label-vocab"
            placeholder="e.g. Pie crust"
            value={sec.label}
            oninput={(e) => onSectionLabelChange(sIdx, (e.currentTarget as HTMLInputElement).value)}
            class="form-input section-label-input"
          />
          <span class="section-card-dash">—</span>
          <!-- Prep method for this section (fires before the recipe-level primary Cook) -->
          <select
            bind:value={sections[sIdx].prepMethod}
            class="form-input section-method-select"
            title="How this section is prepared before the primary cook"
          >
            <option value="none">no heat</option>
            {#each SECTION_PREP_METHODS as m}
              <option value={m}>{PREP_METHOD_DISPLAY[m] ?? m}</option>
            {/each}
          </select>
          {#if moderatorMode}
            <button
              type="button"
              class="section-gear-btn"
              onclick={() => (sectionAdvancedOpen[sIdx] = !sectionAdvancedOpen[sIdx])}
              title="Yield factors"
              aria-label="Toggle advanced section settings"
            >⚙</button>
          {/if}
          <button
            type="button"
            class="remove-btn section-remove-btn"
            onclick={() => removeSection(sIdx)}
            aria-label="Remove section"
          >✕</button>
        </div>
        {#if sec.prepMethod && ['boiled','simmer','sub-simmer','braise','steamed','blanched','baked','par-baked','fried','pan grilled','grilled','microwave'].includes(sec.prepMethod)}
          <div class="section-times-bar">
            <label class="section-time-field" title="Lid-off cooking time only (boiled / simmer / sub-simmer). Do not include covered time — use 'braise' for covered cooking.">
              <span class="section-time-label">Prep (min)</span>
              <input
                type="number" min="0" max="600" step="1" placeholder="–"
                value={sec.boilMinutes ?? ''}
                oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).valueAsNumber; sections = sections.map((s, i) => i === sIdx ? { ...s, boilMinutes: Number.isFinite(v) && v >= 0 ? v : undefined } : s); }}
                class="form-input time-number-input"
              />
            </label>
            {#if sec.prepMethod === 'baked' || sec.prepMethod === 'par-baked'}
              <label class="section-time-field" title="Oven temperature °F for the prep step">
                <span class="section-time-label">Prep (°F)</span>
                <input
                  type="number" min="200" max="600" step="25" placeholder="–"
                  value={sec.prepTempF ?? ''}
                  oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).valueAsNumber; sections = sections.map((s, i) => i === sIdx ? { ...s, prepTempF: Number.isFinite(v) && v > 0 ? v : undefined } : s); }}
                  class="form-input time-number-input"
                />
              </label>
            {/if}
          </div>
        {/if}
        {#if moderatorMode && sectionAdvancedOpen[sIdx]}
          <div class="section-card-advanced">
            <label class="advanced-field">
              <span>Key</span>
              <input type="text" bind:value={sec.key} class="form-input" />
            </label>
            <label class="advanced-field">
              <span>Yield H₂O</span>
              <input type="number" step="0.01" min="0" max="2"
                bind:value={sec.yieldFactorWater} placeholder="1.00" class="form-input" />
            </label>
            <label class="advanced-field">
              <span>Yield Fat</span>
              <input type="number" step="0.01" min="0" max="2"
                bind:value={sec.yieldFactorFat} placeholder="1.00" class="form-input" />
            </label>
            <label class="advanced-field">
              <span>Yield Other</span>
              <input type="number" step="0.01" min="0" max="2"
                bind:value={sec.yieldFactorOther} placeholder="1.00" class="form-input" />
            </label>
            <label class="advanced-field" title="Filling class controls how much water is free to evaporate (binding coefficient). Leave blank for non-filling sections.">
              <span>Fill class</span>
              <select
                value={sec.fillClass ?? ''}
                onchange={(e) => { const v = (e.currentTarget as HTMLSelectElement).value; sections = sections.map((s, i) => i === sIdx ? { ...s, fillClass: v || undefined } : s); }}
                class="form-input"
              >
                <option value="">— none —</option>
                <option value="dense_fruit">dense_fruit — apple/pear open (0.94)</option>
                <option value="thickened_fruit">thickened_fruit — cornstarch berry/cherry (0.25)</option>
                <option value="moderate_fruit">moderate_fruit — stone fruit partial (0.40)</option>
                <option value="strudel_fruit">strudel_fruit — wrapped pastry (0.55)</option>
                <option value="mincemeat">mincemeat — dried fruit + fat (0.57)</option>
                <option value="syrup_custard">syrup_custard — corn syrup/egg (0.53)</option>
                <option value="vegetable_custard">vegetable_custard — pumpkin/squash (0.12)</option>
                <option value="dairy_custard">dairy_custard — cream/milk/egg (0.33)</option>
                <option value="starch_custard">starch_custard — cornstarch custard (0.099)</option>
                <option value="cake_batter">cake_batter — flour/butter/egg (0.74)</option>
                <option value="pastry">pastry — blind-baked crust (0.782)</option>
                <option value="crumb_crust">crumb_crust — cookie/cracker crust (0.432)</option>
                <option value="none">none — no-bake / cold-set (0.00)</option>
              </select>
            </label>
            <div class="advanced-field advanced-stages" style="grid-column: 1 / -1"
              title="Multi-stage oven bake: each entry fires in order. calcYieldWater() uses these for evaporation modelling.">
              <span>Cook stages (°F → min)</span>
              <div class="stages-rows">
                {#each (sec.stages ?? []) as stage, stIdx}
                  <div class="stage-row">
                    <input type="number" min="200" max="600" step="25" placeholder="°F"
                      value={stage.tempF}
                      oninput={(e) => {
                        const v = (e.currentTarget as HTMLInputElement).valueAsNumber;
                        const updated = (sec.stages ?? []).map((st, i) => i === stIdx ? { ...st, tempF: Number.isFinite(v) && v > 0 ? v : st.tempF } : st);
                        sections = sections.map((s, i) => i === sIdx ? { ...s, stages: updated } : s);
                      }}
                      class="form-input stage-temp-input" />
                    <input type="number" min="1" max="600" step="1" placeholder="min"
                      value={stage.minutes}
                      oninput={(e) => {
                        const v = (e.currentTarget as HTMLInputElement).valueAsNumber;
                        const updated = (sec.stages ?? []).map((st, i) => i === stIdx ? { ...st, minutes: Number.isFinite(v) && v > 0 ? v : st.minutes } : st);
                        sections = sections.map((s, i) => i === sIdx ? { ...s, stages: updated } : s);
                      }}
                      class="form-input stage-min-input" />
                    <button type="button"
                      onclick={() => {
                        const updated = (sec.stages ?? []).filter((_, i) => i !== stIdx);
                        sections = sections.map((s, i) => i === sIdx ? { ...s, stages: updated.length ? updated : undefined } : s);
                      }}
                      class="remove-btn stage-remove-btn" aria-label="Remove stage">✕</button>
                  </div>
                {/each}
                <button type="button"
                  onclick={() => {
                    const updated = [...(sec.stages ?? []), { tempF: 350, minutes: 30 }];
                    sections = sections.map((s, i) => i === sIdx ? { ...s, stages: updated } : s);
                  }}
                  class="add-stage-btn">+ stage</button>
              </div>
            </div>
          </div>
        {/if}
      {/snippet}

      {#snippet ingredientRow(ingredient: RecipeIngredient, displayNum: number)}
        <div class="ingredient-entry">
          <div class="ingredient-row">
            <span class="row-num">{displayNum}.</span>
            <div class="ingredient-fields">
              <input 
                type="text"
                bind:value={ingredient.quantity}
                placeholder="Qty (e.g., 2 cups)"
                class="form-input qty-input"
              />
              <div class="name-input-row">
                <input 
                  type="text"
                  bind:value={ingredient.name}
                  placeholder="Ingredient (e.g., flour)"
                  class="form-input name-input"
                />
                {#if ingredient.ingredientStatus === 'optional'}
                  <span class="name-status-label name-status-label--optional">(Optional)</span>
                {:else if ingredient.ingredientStatus === 'exempt'}
                  <span class="name-status-label name-status-label--exempt">(Exempt)</span>
                {/if}
              </div>
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
              {:else}
                <div class="nutrition-actions-row">
                  <button type="button" class="link-nutrition-info-btn" onclick={() => linkNutritionInfoOpen = !linkNutritionInfoOpen} title="How to link nutrition">How to link ℹ️</button>
                  <button type="button" class="link-nutrition-btn" onclick={() => openNutritionSearch(ingredient)}>
                    🔗 Link nutrition
                  </button>
                  <select
                    class="ingredient-status-select"
                    value={ingredient.ingredientStatus ?? 'required'}
                    onchange={(e) => setIngredientStatus(ingredient.id, (e.target as HTMLSelectElement).value as 'required' | 'optional' | 'exempt')}
                  >
                    <option value="required">Required</option>
                    <option value="optional">Optional</option>
                    <option value="exempt">Exempt</option>
                  </select>
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
      {/snippet}

      <div class="primary-cook-bar">
        <label class="primary-cook-label">
          <span class="primary-cook-name">Cook *</span>
          <select bind:value={cookingMethod} class="form-select primary-cook-select">
            <option value="">— select —</option>
            {#each COOKING_METHODS as m}
              <option value={m}>{COOK_METHOD_DISPLAY[m] ?? m}</option>
            {/each}
          </select>
        </label>
        <label class="section-time-field" title="Total cook time in minutes">
          <span class="section-time-label">{['Bake','Braise','Simmer','Sub-simmer'].includes(cookingMethod) ? `${cookingMethod} (min)` : 'Cook (min)'}</span>
          <input
            type="number" min="0" max="600" step="1" placeholder="–"
            value={cookMinutes ?? ''}
            oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).valueAsNumber; cookMinutes = Number.isFinite(v) && v >= 0 ? v : undefined; }}
            class="form-input time-number-input"
          />
        </label>
        <label class="section-time-field" title="Oven temperature °F">
          <span class="section-time-label">Temp (°F)</span>
          <input
            type="number" min="200" max="600" step="25" placeholder="–"
            value={cookTempF ?? ''}
            oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).valueAsNumber; cookTempF = Number.isFinite(v) && v > 0 ? v : undefined; }}
            class="form-input time-number-input"
          />
        </label>
        <button type="button" class="cook-help-btn" onclick={() => cookHelpOpen = true} title="How to fill in these fields">ⓘ</button>
      </div>

      {#if cookHelpOpen}
        <div class="cook-help-backdrop" onclick={() => cookHelpOpen = false} role="presentation">
          <div class="cook-help-dialog" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="How to use the cook form fields">
            <button type="button" class="cook-help-close" onclick={() => cookHelpOpen = false} aria-label="Close">✕</button>
            <h3 class="cook-help-title">How the cook fields work</h3>

            <h4 class="cook-help-section">Cook * — the primary heat (top bar)</h4>
            <p>This is the <strong>final application of heat</strong> after all sections are assembled. Set it once and it applies to every section.</p>
            <ul>
              <li><strong>Bake</strong> — oven. Enter Bake (min) and Temp (°F).</li>
              <li><strong>Boil (lid off)</strong> — rolling boil, 212 °F, uncovered. Pasta, blanching. <em>Lid on? Choose Braise instead — a covered pot loses less than 5 % of open-pot moisture.</em></li>
              <li><strong>Simmer (lid off)</strong> — 195 °F, uncovered. Sauce reductions, soups. <em>Lid on? Choose Braise instead.</em></li>
              <li><strong>Sub-simmer (lid off)</strong> — 180 °F, uncovered. Concentrating stock. <em>Lid on? Choose Braise instead.</em></li>
              <li><strong>Braise (covered)</strong> — 185 °F, lid on. Steam recondenses on the lid and drips back; only ~5 % of open-pot evaporation escapes. Use for any covered braise, pot roast, or Dutch-oven method.</li>
              <li><strong>Pan grill</strong> — stovetop skillet or griddle; dry heat, no water model applied.</li>
              <li><strong>Grill</strong> — outdoor grill, broiler, or grate; dry heat, no water model applied.</li>
              <li><strong>Fry</strong> — shallow or deep fry; dry heat, no water model applied.</li>
            </ul>

            <h4 class="cook-help-section">Each section's Prep method</h4>
            <p>Some sections need cooking <strong>before</strong> they join the rest of the dish. Pick the method that applies:</p>
            <ul>
              <li><strong>no heat</strong> — ingredients go in as-is (cold, raw, or already cooked). This is correct for most sections.</li>
              <li><strong>boiled (lid off)</strong> — rolling boil, 212 °F, uncovered. Blanching, par-boiling.</li>
              <li><strong>simmer (lid off)</strong> — 195 °F, uncovered. Sauce reductions, hollandaise bases.</li>
              <li><strong>sub-simmer (lid off)</strong> — 180 °F, uncovered. Concentrating stock, uncovered slow stews.</li>
              <li><strong>braise (covered)</strong> — 185 °F, <em>lid on</em>. Model uses only 5 % of open-pot evaporation (steam recondenses on lid and drips back). Use for any covered braise, covered stew, or Dutch-oven prep step.</li>
              <li><strong>steamed</strong> — steam basket or steamer insert.</li>
              <li><strong>baked / par-baked</strong> — pre-baked separately (e.g. blind-baking a pie crust). Enter Prep (min) and Prep (°F).</li>
              <li><strong>pan grilled / fried</strong> — sautéed or fried before combining. If fat drains off and is discarded, the model removes those calories from that section.</li>
              <li><strong>marinated / chilled</strong> — cold prep only; no heat calculations apply.</li>
              <li><strong>microwave</strong> — microwave oven. Dry heat; no evaporation model is applied. Enter the actual microwave time for record-keeping, but the model does not subtract moisture for this step.</li>
            </ul>

            <h4 class="cook-help-section">Why this matters for nutrition</h4>
            <p>The calculator runs <strong>two passes</strong> per section:</p>
            <ol>
              <li><strong>Prep pass</strong> — applies the section's prep method and time to calculate water lost (or absorbed) <em>before</em> assembly.</li>
              <li><strong>Cook pass</strong> — applies the recipe-level Cook method, time, and temp to whatever remains after prep.</li>
            </ol>
            <p>Skipping the stovetop simmer time means the model thinks a wet filling enters the oven at full weight and overestimates water content — understating calories, sugar concentration, and fat percentage in the final serving. Skipping a fat-drain step (pan grilling ground beef) overcounts calories because the rendered fat appears to stay in the dish.</p>
            <p class="cook-help-tip">💡 When in doubt, choose <strong>no heat</strong> — it's the safe default. Only add a prep method if that section literally goes on a burner, in an oven, or in a pan <em>by itself</em> before everything is combined.</p>

            <h4 class="cook-help-section">Altitude</h4>
            <p>Sea level is used as a universal baseline so recipes work the same way everywhere — but you can absolutely enter the values that reflect how <em>you</em> cook. If you enter altitude-adjusted values, note your elevation in the recipe instructions so readers at other elevations know to adjust.</p>
            <p><strong>Bake</strong> — baking is affected by altitude. Baked goods rise too quickly before structure sets, and moisture evaporates faster. At altitude, recipes typically need a higher oven temperature (+15–25 °F) and a shorter bake time (−5 to 8 min per 30 min). There are also ingredient adjustments for liquid, flour, and sugar. If you enter altitude-adjusted values, note that in your instructions.</p>
            <p><strong>Boil / Simmer / Sub-simmer</strong> — water boils at a lower temperature at altitude (≈ 207 °F at 3,000 ft; ≈ 202 °F at 5,000 ft; ≈ 194 °F at 10,000 ft), so moist-heat cooking takes longer and loses more moisture — the lower boiling point extends cook time, and the drier high-altitude air draws moisture out of the food more freely. Approximate time increases over the sea-level recipe:</p>
            <ul>
              <li><strong>3,000–5,000 ft</strong> — add 20–25 %</li>
              <li><strong>5,000–7,000 ft</strong> — add 30–35 %</li>
              <li><strong>7,000–10,000 ft</strong> — add 40–50 %</li>
            </ul>
            <p>If using an electric pressure cooker, add cooking time based on elevation (+5 % starting at 3,000 ft, then add an additional 5 % for each 1,000 ft):</p>
            <table class="cook-help-table">
              <thead><tr><th>Elevation</th><th>Add</th></tr></thead>
              <tbody>
                <tr><td>3,000 ft</td><td>+5 %</td></tr>
                <tr><td>4,000 ft</td><td>+10 %</td></tr>
                <tr><td>5,000 ft</td><td>+15 %</td></tr>
                <tr><td>6,000 ft</td><td>+20 %</td></tr>
                <tr><td>7,000 ft</td><td>+25 %</td></tr>
                <tr><td>8,000 ft</td><td>+30 %</td></tr>
                <tr><td>9,000 ft</td><td>+35 %</td></tr>
                <tr><td>10,000 ft</td><td>+40 %</td></tr>
              </tbody>
            </table>
            <p class="cook-help-tip">💡 <strong>Pressure cooker and nutrition:</strong> pressure-cooked ingredients (rice, beans, grains) produce the same nutritional result as conventionally boiled. Enter your actual ingredients — including the water you used — and select <strong>Boil</strong> as the cooking method. The model calculates final moisture from how much water each ingredient absorbs to reach its cooked state, not from cook time or total water in the pot. Whether you entered 1 cup or 2 cups of water, the per-100g nutrition comes out the same.</p>
            <p class="cook-help-tip">💡 Covering the pot (choose <strong>Braise</strong>) significantly reduces moisture loss at any elevation.</p>
          </div>
        </div>
      {/if}

      {#if sections.length === 0}
        {@const unsectioned = ingredients.filter((ing) => ing.name.trim() || ing.quantity.trim())}
        {#if unsectioned.length > 0}
          <div class="section-block needs-sectioning">
            <div class="ingredient-orphan-header">⚠ Needs sectioning</div>
            <p class="section-hint" style="margin: 4px 0 8px 0;">
              v3.md §18: each ingredient must live in a section with its own cooking method.
              Add sections below (e.g. <em>crust</em> baked, <em>filling</em> boiled, <em>topping</em> raw)
              and reassign each ingredient. <strong>Do not</strong> lump everything under one method —
              that's exactly what §18 was built to fix.
            </p>
            {#each unsectioned as ingredient (ingredient.id)}
              {@render ingredientRow(ingredient, ingredients.indexOf(ingredient) + 1)}
            {/each}
          </div>
        {:else}
          <div class="sections-empty-state">
            <p class="section-hint">Click <strong>+ Add a new section</strong> below to start (e.g. “Crust”, “Filling”, “Topping”). Each section carries its own cooking method.</p>
          </div>
        {/if}
      {:else}
        {#each sections as sec, sIdx (sIdx)}
          <div class="section-block">
            {@render sectionHeaderBar(sec, sIdx)}
            {#each buildIngredientGroups(ingredients.filter((ing) => ing.section === sec.key)) as subGroup}
              {#if subGroup.section !== sec.key && subGroup.section}
                <div class="ingredient-subgroup-header">{subGroup.header}</div>
              {/if}
              {#each subGroup.items as ingredient (ingredient.id)}
                {@render ingredientRow(ingredient, ingredients.indexOf(ingredient) + 1)}
              {/each}
            {/each}
            <button
              type="button"
              class="add-ingredient-to-section-btn"
              onclick={() => addIngredientToSection(sec.key)}
            >+ Add ingredient to {sec.label || sec.key}</button>
          </div>
        {/each}
        {@const orphanIngredients = ingredients.filter((ing) => !sections.some((s) => s.key === ing.section))}
        {#if orphanIngredients.length > 0}
          <div class="section-block">
            <div class="ingredient-orphan-header">Unsectioned ingredients</div>
            {#each orphanIngredients as ingredient (ingredient.id)}
              {@render ingredientRow(ingredient, ingredients.indexOf(ingredient) + 1)}
            {/each}
          </div>
        {/if}
      {/if}
    </div>
    
    <div class="ingredients-add-row">
      <button type="button" class="add-section-btn" onclick={addSectionWithRow}>
        + Add a new section
      </button>
    </div>
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
    <button type="button" class="edit-preview-btn" onclick={openEditPreviewDialog}>
      Edit / Preview
    </button>
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

{#if showEditPreviewDialog}
  <div class="ep-dialog-backdrop" role="presentation" onclick={closeEditPreviewDiscard}>
    <div
      class="ep-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Edit and preview recipe"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="ep-dialog-header">
        <div class="ep-toggle" role="tablist" aria-label="View mode">
          <button
            type="button"
            class="ep-toggle-btn"
            class:active={dialogView === 'preview'}
            role="tab"
            aria-selected={dialogView === 'preview'}
            onclick={() => (dialogView = 'preview')}
          >Preview</button>
          <button
            type="button"
            class="ep-toggle-btn"
            class:active={dialogView === 'edit'}
            role="tab"
            aria-selected={dialogView === 'edit'}
            onclick={() => (dialogView = 'edit')}
          >Edit</button>
        </div>
      </div>

      <div class="ep-dialog-body">
        {#if dialogView === 'preview'}
          <div class="ep-preview">
            <h2 class="ep-preview-title">{dishName.trim() || 'Untitled recipe'}{recipeSuffix.trim() ? ` — ${recipeSuffix.trim()}` : ''}</h2>
            <div class="ep-preview-meta">
              {#if prepTime}<span>⏱ {prepTime}</span>{/if}
              {#if servings}<span>🍽 {servings}</span>{/if}
              {#if cookingMethod}<span>🔥 {cookingMethod}</span>{/if}
            </div>
            <h3 class="ep-preview-h3">Ingredients</h3>
            <ul class="ep-preview-list">
              {#each buildIngredientGroups(ingredients.filter(i => i.name.trim() || i.quantity.trim())) as group}
                {#if group.header}
                  <li class="ep-preview-section-header"><strong>{group.header}</strong></li>
                {/if}
                {#each group.items as ing (ing.id)}
                  <li><strong>{ing.quantity}</strong> {ing.name}</li>
                {/each}
              {/each}
            </ul>
            <h3 class="ep-preview-h3">Instructions</h3>
            <ol class="ep-preview-list">
              {#each instructions.filter(s => s.text.trim()) as step (step.id)}
                <li>{step.text}</li>
              {/each}
            </ol>
          </div>
        {:else}
          <div class="ep-edit">
            <h3 class="ep-preview-h3">Ingredients</h3>
            <p class="ep-edit-hint">Use the arrows to reorder. Edits stay local until you press Save Reorder.</p>
            <div class="ep-edit-list">
              {#each ingredients as ing, i (ing.id)}
                {#if i === 0 ? ing.section : ing.section !== ingredients[i - 1].section}
                  {#if ing.section}
                    <div class="ep-edit-section-header">{formatSectionHeader(ing.section)}</div>
                  {/if}
                {/if}
                <div class="ep-edit-row">
                  <div class="ep-move-col">
                    <button type="button" class="ep-move-btn" disabled={i === 0} onclick={() => moveIngredient(ing.id, -1)} aria-label="Move ingredient up">▲</button>
                    <button type="button" class="ep-move-btn" disabled={i === ingredients.length - 1} onclick={() => moveIngredient(ing.id, 1)} aria-label="Move ingredient down">▼</button>
                  </div>
                  <span class="ep-row-num">{i + 1}.</span>
                  <input type="text" class="form-input ep-qty-input" bind:value={ing.quantity} placeholder="Qty" />
                  <input type="text" class="form-input ep-name-input" bind:value={ing.name} placeholder="Ingredient" />
                </div>
              {/each}
            </div>

            <h3 class="ep-preview-h3" style="margin-top: 18px;">Instructions</h3>
            <div class="ep-edit-list">
              {#each instructions as step, i (step.id)}
                <div class="ep-edit-row ep-edit-row-step">
                  <div class="ep-move-col">
                    <button type="button" class="ep-move-btn" disabled={i === 0} onclick={() => moveInstruction(step.id, -1)} aria-label="Move step up">▲</button>
                    <button type="button" class="ep-move-btn" disabled={i === instructions.length - 1} onclick={() => moveInstruction(step.id, 1)} aria-label="Move step down">▼</button>
                  </div>
                  <span class="ep-row-num">{i + 1}.</span>
                  <textarea class="form-textarea" rows="2" bind:value={step.text}></textarea>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="ep-dialog-footer">
        {#if dialogChangeSummary().length > 0}
          <div class="ep-changes">
            <strong>What changed:</strong> {dialogChangeSummary().join(' · ')}
          </div>
        {:else}
          <div class="ep-changes ep-changes-empty">No unsaved changes in this dialog.</div>
        {/if}
        <div class="ep-dialog-buttons">
          <button type="button" class="cancel-btn" onclick={closeEditPreviewDiscard}>Close</button>
          <button type="button" class="submit-btn" onclick={closeEditPreviewSave} disabled={dialogChangeSummary().length === 0}>
            Save Reorder
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

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

  .ingredient-section-header,
  .ep-edit-section-header {
    margin: 12px 0 4px;
    padding: 4px 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #4a5568;
    text-transform: capitalize;
    border-left: 3px solid #38a169;
    background: #f0fff4;
  }
  .ep-preview-section-header {
    list-style: none;
    margin-left: -20px;
    margin-top: 8px;
    color: #4a5568;
  }

  /* Sections editor (v3.md §18.6) — inline group header pattern.
     Sections ARE the ingredient list — each section's header sits directly
     above its own ingredient rows, followed by a per-section "+ Add" button. */
  .section-block {
    margin: 12px 0;
    padding: 8px 8px 6px;
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #38a169;
    border-radius: 4px;
  }
  .section-header-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 4px 0 8px;
    border-bottom: 1px dashed #cbd5e0;
    margin-bottom: 8px;
  }
  .section-header-bar .section-label-input {
    flex: 1 1 180px;
    min-width: 140px;
    padding: 5px 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #2d3748;
  }
  .section-header-bar .section-method-select {
    flex: 0 0 100px;
    padding: 5px 6px;
    font-size: 0.85rem;
    background: white;
  }
  .section-header-bar .section-type-select {
    flex: 0 0 68px;
    padding: 5px 6px;
    font-size: 0.8rem;
    font-weight: 600;
    background: #edf2f7;
    color: #4a5568;
    border-color: #cbd5e0;
  }
  .section-header-bar .section-prep-select {
    background: #fefcbf;
  }
  .section-card-dash {
    color: #a0aec0;
    font-weight: 600;
  }
  .section-gear-btn {
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .section-gear-btn:hover { background: #edf2f7; }
  .section-remove-btn { padding: 2px 8px; }
  .primary-cook-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    padding: 8px 2px 10px;
    margin-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }
  .primary-cook-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 0.85rem;
    color: #4a5568;
    margin: 0;
  }
  .primary-cook-name {
    white-space: nowrap;
  }
  .cook-help-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: #4299e1;
    padding: 0 2px;
    line-height: 1;
    flex-shrink: 0;
  }
  .cook-help-btn:hover { color: #2b6cb0; }
  .cook-help-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .cook-help-dialog {
    background: #fff;
    border-radius: 10px;
    padding: 24px 28px 20px;
    max-width: 520px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  }
  .cook-help-close {
    position: absolute;
    top: 12px;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #718096;
  }
  .cook-help-close:hover { color: #2d3748; }
  .cook-help-title {
    margin: 0 0 14px;
    font-size: 1.05rem;
    font-weight: 700;
    color: #2d3748;
  }
  .cook-help-section {
    margin: 14px 0 4px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #2d3748;
  }
  .cook-help-dialog p, .cook-help-dialog ul, .cook-help-dialog ol {
    font-size: 0.85rem;
    color: #4a5568;
    margin: 0 0 8px;
    line-height: 1.5;
  }
  .cook-help-dialog ul, .cook-help-dialog ol {
    padding-left: 18px;
  }
  .cook-help-dialog li { margin-bottom: 4px; }
  .cook-help-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    margin: 6px 0 10px;
    color: #4a5568;
  }
  .cook-help-table th, .cook-help-table td {
    border: 1px solid #e2e8f0;
    padding: 4px 10px;
    text-align: left;
  }
  .cook-help-table thead th {
    background: #f7fafc;
    font-weight: 600;
    color: #2d3748;
  }
  .cook-help-tip {
    background: #ebf8ff;
    border-left: 3px solid #4299e1;
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
    margin-top: 10px !important;
  }
  .primary-cook-select {
    font-size: 0.85rem;
    padding: 3px 8px;
  }
  .section-times-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 4px 2px 8px;
    margin-bottom: 4px;
  }
  .section-time-field {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    color: #718096;
    white-space: nowrap;
  }
  .section-time-label {
    font-weight: 500;
    color: #4a5568;
  }
  .time-number-input {
    width: 80px;
    padding: 3px 6px;
    font-size: 0.85rem;
    text-align: center;
  }
  .section-time-arrow {
    color: #a0aec0;
    font-size: 0.85rem;
    margin: 0 2px;
  }
  .section-card-advanced {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 8px;
    padding: 8px;
    background: white;
    border-radius: 4px;
  }
  .advanced-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.75rem;
    color: #4a5568;
  }
  .advanced-field .form-input {
    padding: 3px 6px;
    font-size: 0.85rem;
  }
  .stages-rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2px;
  }
  .stage-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .stage-temp-input, .stage-min-input {
    width: 70px;
    padding: 3px 6px;
    font-size: 0.85rem;
    text-align: center;
  }
  .stage-remove-btn {
    padding: 2px 6px;
    font-size: 0.75rem;
  }
  .add-stage-btn {
    align-self: flex-start;
    margin-top: 2px;
    padding: 2px 8px;
    background: white;
    color: #3182ce;
    border: 1px dashed #3182ce;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.78rem;
  }
  .add-stage-btn:hover { background: #ebf8ff; }
  .add-ingredient-to-section-btn {
    margin-top: 4px;
    padding: 5px 10px;
    background: white;
    color: #38a169;
    border: 1px dashed #38a169;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .add-ingredient-to-section-btn:hover { background: #f0fff4; }
  .ingredient-orphan-header {
    padding: 4px 0 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #718096;
    border-bottom: 1px dashed #cbd5e0;
    margin-bottom: 8px;
  }
  .ingredient-subgroup-header {
    padding: 6px 0 4px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 1px dotted #e2e8f0;
    margin: 8px 0 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .ingredients-add-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: wrap;
  }
  .add-section-btn {
    padding: 6px 10px;
    background: #38a169;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .add-section-btn:hover { background: #2f855a; }
  @media (max-width: 600px) {
    .section-card-advanced { grid-template-columns: repeat(2, 1fr); }
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

  .macro-preview.estimate {
    background: #FFF8E1;
    border-color: #FFD54F;
    color: #5D4037;
    opacity: 0.9;
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

  .macro-preview-note {
    margin: 6px 0 0;
    font-size: 0.78rem;
    color: #b45309;
    line-height: 1.4;
  }

  .audit-gap-card {
    margin-top: 10px;
    padding: 10px 12px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
  }
  .audit-gap-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }
  .audit-gap-title {
    font-weight: 600;
    font-size: 0.82rem;
    color: #1e293b;
  }
  .audit-gap-rule {
    font-size: 0.72rem;
    padding: 2px 6px;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 4px;
    font-weight: 600;
  }
  .audit-gap-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .audit-gap-table th,
  .audit-gap-table td {
    padding: 4px 6px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  .audit-gap-table th {
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
  }
  .audit-gap-table .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .audit-row.ok td   { color: #166534; }
  .audit-row.warn td { color: #b45309; background: #fffbeb; }
  .audit-row.bad td  { color: #b91c1c; background: #fef2f2; font-weight: 600; }
  .audit-row.fill td { color: #1e40af; background: #eff6ff; font-style: italic; }
  .audit-gap-advice {
    margin: 8px 0 0;
    padding: 6px 10px;
    background: #fef3c7;
    border-left: 3px solid #f59e0b;
    color: #92400e;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.4;
  }
  .audit-gap-summary {
    margin: 4px 0 8px;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .audit-gap-summary.pass {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
  }
  .audit-gap-summary.fail {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }
  .audit-gap-source {
    margin: 6px 0 0;
    font-size: 0.72rem;
    color: #475569;
    line-height: 1.4;
  }
  .audit-gap-source em {
    color: #b45309;
    font-style: italic;
  }
  .audit-gap-accepted {
    margin: 8px 0 0;
    padding: 8px 10px;
    background: #ecfeff;
    border: 1px solid #67e8f9;
    border-radius: 6px;
    font-size: 0.74rem;
    color: #155e75;
    line-height: 1.45;
  }
  .v3-ingredients-panel {
    margin: 10px 0 0;
    padding: 8px 10px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.74rem;
  }
  .v3-ingredients-panel > summary {
    cursor: pointer;
    font-weight: 600;
    color: #334155;
  }
  .v3-ingredients-note {
    margin: 6px 0 8px;
    font-size: 0.72rem;
    color: #64748b;
    line-height: 1.45;
  }
  .v3-ingredients-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.72rem;
  }
  .v3-ingredients-table th,
  .v3-ingredients-table td {
    padding: 4px 6px;
    border-bottom: 1px solid #e2e8f0;
    text-align: left;
  }
  .v3-ingredients-table th.num,
  .v3-ingredients-table td.num {
    text-align: right;
  }
  .v3-ingredients-table td.mono {
    font-family: monospace;
    color: #475569;
  }
  .audit-gap-note {
    margin: 8px 0 0;
    font-size: 0.72rem;
    color: #64748b;
    line-height: 1.4;
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

  .ingredient-status-select {
    padding: 4px 6px;
    border: 1px solid #BDBDBD;
    border-radius: 6px;
    font-size: 0.78rem;
    color: #555;
    background: #fff;
    cursor: pointer;
  }

  .name-input-row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
  }

  .name-status-label {
    font-size: 0.75rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .name-status-label--optional {
    color: #999;
  }

  .name-status-label--exempt {
    color: #E65100;
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

  /* ── Edit/Preview button + dialog ──────────────────────────────────────── */
  .edit-preview-btn {
    margin-right: auto; /* push siblings (Cancel / Submit) to the right */
    padding: 9px 16px;
    border: 1px solid #b8c8e0;
    background: #f0f4fa;
    color: #1A237E;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.92rem;
    cursor: pointer;
  }
  .edit-preview-btn:hover {
    background: #e3ebf6;
  }

  .ep-dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }
  .ep-dialog {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    width: min(720px, 100%);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ep-dialog-header {
    padding: 14px 16px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: center;
  }
  .ep-toggle {
    display: inline-flex;
    background: #f1f1f4;
    border-radius: 999px;
    padding: 3px;
    gap: 0;
  }
  .ep-toggle-btn {
    border: none;
    background: transparent;
    color: #555;
    padding: 6px 18px;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }
  .ep-toggle-btn.active {
    background: #1A237E;
    color: #fff;
  }
  .ep-dialog-body {
    padding: 16px 18px;
    overflow-y: auto;
    flex: 1;
  }
  .ep-preview-title {
    font-size: 1.4rem;
    margin: 0 0 6px;
    color: #1A237E;
  }
  .ep-preview-meta {
    color: #666;
    font-size: 0.9rem;
    display: flex;
    gap: 14px;
    margin-bottom: 12px;
  }
  .ep-preview-h3 {
    font-size: 1rem;
    margin: 14px 0 6px;
    color: #1A237E;
  }
  .ep-preview-list {
    margin: 0 0 8px;
    padding-left: 22px;
    line-height: 1.5;
  }
  .ep-preview-list li {
    margin: 3px 0;
  }
  .ep-edit-hint {
    font-size: 0.82rem;
    color: #777;
    margin: 0 0 8px;
  }
  .ep-edit-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ep-edit-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ep-edit-row-step {
    align-items: flex-start;
  }
  .ep-move-col {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ep-move-btn {
    width: 28px;
    height: 22px;
    border: 1px solid #ccc;
    background: #fafafa;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.7rem;
    padding: 0;
    line-height: 1;
    color: #444;
  }
  .ep-move-btn:hover:not(:disabled) {
    background: #eef;
    border-color: #99a;
  }
  .ep-move-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .ep-row-num {
    color: #999;
    min-width: 24px;
    font-variant-numeric: tabular-nums;
  }
  .ep-qty-input {
    flex: 0 0 110px;
  }
  .ep-name-input {
    flex: 1 1 auto;
  }
  .ep-edit-row textarea.form-textarea {
    flex: 1 1 auto;
  }
  .ep-dialog-footer {
    border-top: 1px solid #e6e6e6;
    padding: 12px 16px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ep-changes {
    font-size: 0.86rem;
    color: #1A237E;
  }
  .ep-changes-empty {
    color: #999;
    font-style: italic;
  }
  .ep-dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
