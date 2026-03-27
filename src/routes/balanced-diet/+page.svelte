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
  import ReportsModal from '$lib/components/ReportsModal.svelte';
  import LoginModal from '$lib/farmers-basket/LoginModal.svelte';
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
  import { playerStore } from '$lib/stores/playerStore';
  import { initializeGameState, startAutoSave, startNewGame, getSavedGameTime, hasSavedGame, setViewingUserId, saveMealLog, suppressMealLogSave, loadCustomCategories } from '$lib/stores/gameStateStore';
  import { FOODS } from '$lib/data/food-portions';
  import type { Food, Portion } from '$lib/data/food-portions';
  import type { RecipeFood } from '$lib/components/FoodPicker.svelte';
  import { getMemberTargets } from '$lib/data/dri';
  import type { MemberProfile } from '$lib/data/dri';

  let selectedFood = $state<Food | null>(null);
  let showSettings = $state(false);
  let showAddCustomFood = $state(false);
  let showNewGameConfirm = $state(false);
  let showRules = $state(false);
  let showHistoryInfo = $state(false);
  let customFoodPrefill = $state('');

  // Hamburger menu state
  let showMenu = $state(false);
  let showReports = $state(false);
  let showLoginModal = $state(false);
  function closeMenu() { showMenu = false; }

  // Tier gates — derived from playerStore
  const isPlus = $derived($playerStore.status === 'logged-in' && ['plus', 'allin', 'premium', 'moderator'].includes($playerStore.tier));
  const isAllin = $derived($playerStore.status === 'logged-in' && ['allin', 'premium', 'moderator'].includes($playerStore.tier));

  // Notes state
  let showNotes = $state(false);
  let notesView = $state<'editor' | 'history'>('editor');
  let noteContent = $state('');
  let noteSentiment = $state<'positive' | 'negative' | 'neutral' | ''>('');
  let noteSaving = $state(false);
  let noteDeleting = $state(false);
  let noteExists = $state(false);   // true if the note for noteDate is already saved in DB
  let noteDate = $state(new Date().toISOString().slice(0, 10));  // date being edited (ISO YYYY-MM-DD)
  const yesterdayStr = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
  let notesHistory = $state<Array<{ id: number; note_date: string; note_content: string; sentiment_flag: string | null; symptoms: string | null; updated_at: string }>>([]);
  let notesHistoryLoading = $state(false);

  // Date picker lookup (history tab)
  let historyPickDate = $state('');
  let historyPickNote = $state<{ note_content: string; sentiment_flag: string | null; symptoms: string | null } | null>(null);
  let historyPickLoading = $state(false);
  let historyPickSearched = $state(false);

  // Symptom state — Jetcool HybridSymptom-compatible JSON contract
  type HybridSymptom = {
    id: string;
    name: string;
    severity: number;
    timestamp: string;
    category: string;
    custom: boolean;
    isCustom: boolean;
    notes: string;
  };

  const SYMPTOM_CATEGORIES: Record<string, string[]> = {
    'Activity & Exercise': ['Cardio workout', 'Cycling', 'Light activity/walk', 'Pilates', 'Sedentary day', 'Sports activity', 'Strength training', 'Swimming', 'Yoga/stretching'],
    'Diet Changes': ['Food restriction', 'Intermittent fasting', 'New food tried'],
    'Health & Mood': ['Anxious/worried', 'Calm/peaceful', 'Brain fog', 'Drowsy/sluggish', 'Excited/motivated', 'Feeling better', 'Good mood/positive', 'Irritable/angry', 'Mood swings', 'Sad/depressed', 'Swollen joints/hands'],
    'Medication': ['Injection/insulin', 'Missed medication', 'Morning medications', 'Supplements taken'],
    'Gastrointestinal': ['Abdominal Pain', 'Bloated after Meals', 'Constipation', 'Diarrhea', 'Heartburn/Acid Reflux'],
    'Sleep & Energy': ['Daytime fatigue', 'Great sleep', 'High energy', 'Insomnia', 'Low energy', 'Night sweats', 'Poor sleep', 'Sleep schedule change'],
    'Other Symptoms': ['Autoimmune flare', 'Back pain', 'Blood pressure issue', 'Breathing difficulties', 'Chest pain', 'Cough', 'Dizziness', 'Fever/temperature', 'Food reaction/allergy', 'Gout', 'Headache/migraine', 'Hearing issues', 'Heart palpitations', 'Joint/muscle pain', 'Migraine episode', 'Nausea/stomach upset', 'Rash', 'Sleep issues', 'Swollen hands', 'Vision problems', 'Weakness'],
  };

  let noteSymptoms = $state<HybridSymptom[]>([]);
  let symptomsExpanded = $state(false);
  let symptomsExpandedCategory = $state<string | null>(null);
  let customSymptomInput = $state('');

  async function lookUpNoteByDate() {
    if (!$playerStore.id || !historyPickDate) return;
    historyPickLoading = true;
    historyPickSearched = false;
    historyPickNote = null;
    try {
      const res = await fetch(`/api/notes?user_id=${$playerStore.id}&date=${historyPickDate}`);
      if (res.ok) historyPickNote = await res.json();
    } catch { /* non-critical */ }
    historyPickSearched = true;
    historyPickLoading = false;
  }

  function todayDateStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  async function loadNoteForDate(date: string) {
    if (!$playerStore.id) return;
    try {
      const res = await fetch(`/api/notes?user_id=${$playerStore.id}&date=${date}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          noteContent   = data.note_content ?? '';
          noteSentiment = data.sentiment_flag ?? '';
          noteExists    = true;
          try { noteSymptoms = data.symptoms ? JSON.parse(data.symptoms) : []; } catch { noteSymptoms = []; }
        } else {
          noteContent   = '';
          noteSentiment = '';
          noteSymptoms  = [];
          noteExists    = false;
        }
      }
    } catch { /* non-critical */ }
  }

  async function loadNotesHistory() {
    if (!$playerStore.id) return;
    notesHistoryLoading = true;
    try {
      const res = await fetch(`/api/notes?user_id=${$playerStore.id}&history=true&limit=30`);
      if (res.ok) notesHistory = await res.json();
    } catch { /* non-critical */ }
    notesHistoryLoading = false;
  }

  async function saveNote() {
    if (!$playerStore.id || (!noteContent.trim() && noteSymptoms.length === 0)) return;
    noteSaving = true;
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:        $playerStore.id,
          note_date:      noteDate,
          note_content:   noteContent.trim(),
          sentiment_flag: noteSentiment || null,
          symptoms:       noteSymptoms.length > 0 ? JSON.stringify(noteSymptoms) : null,
        }),
      });
      noteExists = true;
    } catch { /* non-critical */ }
    noteSaving = false;
  }

  async function deleteNote() {
    if (!$playerStore.id || !noteExists) return;
    noteDeleting = true;
    try {
      await fetch(`/api/notes/${noteDate}?user_id=${$playerStore.id}`, { method: 'DELETE' });
      noteContent   = '';
      noteSentiment = '';
      noteSymptoms  = [];
      noteExists    = false;
    } catch { /* non-critical */ }
    noteDeleting = false;
  }

  async function switchNoteDate(d: string) {
    noteDate = d;
    noteContent = '';
    noteSentiment = '';
    noteSymptoms = [];
    noteExists = false;
    await loadNoteForDate(d);
  }

  function openNotes() {
    notesView = 'editor';
    noteDate = todayDateStr();
    symptomsExpanded = false;
    symptomsExpandedCategory = null;
    showNotes = true;
    loadNoteForDate(noteDate);
  }

  function generateSymptomId(): string {
    return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  function addSymptom(name: string, category: string, isCustom: boolean = false) {
    if (noteSymptoms.some(s => s.name === name)) return;
    noteSymptoms = [...noteSymptoms, {
      id: generateSymptomId(),
      name,
      severity: 5,
      timestamp: new Date().toISOString(),
      category,
      custom: isCustom,
      isCustom,
      notes: '',
    }];
  }

  function removeSymptom(id: string) {
    noteSymptoms = noteSymptoms.filter(s => s.id !== id);
  }

  function updateSymptomSeverity(id: string, severity: number) {
    noteSymptoms = noteSymptoms.map(s => s.id === id ? { ...s, severity } : s);
  }

  function addCustomSymptom() {
    const name = customSymptomInput.trim();
    if (!name) return;
    addSymptom(name, 'Custom', true);
    customSymptomInput = '';
  }

  // Sharing / household members
  let settingsTab = $state<'targets' | 'sharing'>('targets');
  let householdMembers = $state<Array<{
    id?: string;
    name: string; icon: string; color: string;
    groupage: string; age: string;
    height: string; height_unit: string;
    weight: string; weight_unit: string;
    activity_level: string;
  }>>([]);
  let showAddMember = $state(false);
  let activeMemberId = $state<string>('');
  const activeMember = $derived(householdMembers.find(m => m.id === activeMemberId) ?? null);
  const activeMemberTargets = $derived(activeMember ? getMemberTargets(activeMember) : null);
  const memberDisplayNutrients = $derived(activeMemberTargets ? {
    kcal:    Math.round(activeMemberTargets.kcal),
    water:   Math.round(activeMemberTargets.driRow.water * 4.1667),
    protein: activeMemberTargets.driRow.protein,
    carbs:   activeMemberTargets.driRow.carbohydrate,
    fats:    activeMemberTargets.driRow.fat,
    fiber:   activeMemberTargets.driRow.fiber,
    sugar:   Math.round((activeMemberTargets.kcal * 0.10) / 4),
  } : null);
  let newMemberName = $state('');
  let newMemberIcon = $state('👤');
  let newMemberColor = $state('#60a5fa');
  let newMemberGroupage = $state('Males');
  let newMemberAge = $state('');
  let newMemberHeight = $state('');
  let newMemberHeightUnit = $state('inches');
  let newMemberWeight = $state('');
  let newMemberWeightUnit = $state('pounds');
  let newMemberActivityLevel = $state('Sedentary');

  const MEMBER_GROUPS = ['Infants', 'Children', 'Males', 'Females', 'Pregnancy', 'Lactation'];
  const MEMBER_ACTIVITY_LEVELS = ['Sedentary', 'Low Active', 'Active', 'Very Active'];

  // Live preview of calorie target for the member being added
  const newMemberTargets = $derived(
    getMemberTargets({
      groupage: newMemberGroupage,
      age: newMemberAge,
      height: newMemberHeight,
      height_unit: newMemberHeightUnit,
      weight: newMemberWeight,
      weight_unit: newMemberWeightUnit,
      activity_level: newMemberActivityLevel,
    } satisfies MemberProfile)
  );
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

  // Owner DRI profile (drives calorie + nutrient targets)
  let ownerGroupage = $state($gameSettings.ownerGroupage ?? 'Males');
  let ownerAge = $state($gameSettings.ownerAge ?? '');
  let ownerHeight = $state($gameSettings.ownerHeight ?? '');
  let ownerHeightUnit = $state($gameSettings.ownerHeightUnit ?? 'cm');
  let ownerWeight = $state($gameSettings.ownerWeight ?? '');
  let ownerWeightUnit = $state($gameSettings.ownerWeightUnit ?? 'kilos');
  let ownerActivityLevel = $state($gameSettings.ownerActivityLevel ?? 'Sedentary');
  const ownerDRITargets = $derived(getMemberTargets({
    groupage: ownerGroupage, age: ownerAge,
    height: ownerHeight, height_unit: ownerHeightUnit,
    weight: ownerWeight, weight_unit: ownerWeightUnit,
    activity_level: ownerActivityLevel,
  } satisfies MemberProfile));

  // Active member's DRI row — whichever member is selected (owner or household).
  // Passed to NutrientPicker and ReportsModal so both always reflect current member.
  const activeDRIRow = $derived(
    activeMember
      ? (activeMemberTargets?.driRow ?? null)
      : (ownerDRITargets?.driRow ?? null)
  );
  const activeProfile = $derived<MemberProfile>(
    activeMember
      ? activeMember
      : {
          groupage: ownerGroupage, age: ownerAge,
          height: ownerHeight, height_unit: ownerHeightUnit,
          weight: ownerWeight, weight_unit: ownerWeightUnit,
          activity_level: ownerActivityLevel,
        }
  );

  // Member editing state (editable DRI fields for the active member)
  let editingMemberGroupage = $state('Males');
  let editingMemberAge = $state('');
  let editingMemberHeight = $state('');
  let editingMemberHeightUnit = $state('cm');
  let editingMemberWeight = $state('');
  let editingMemberWeightUnit = $state('kilos');
  let editingMemberActivityLevel = $state('Sedentary');
  let memberProfileDirty = $state(false);
  let ownerProfileDirty = $state(false);
  const editingMemberDRITargets = $derived(getMemberTargets({
    groupage: editingMemberGroupage, age: editingMemberAge,
    height: editingMemberHeight, height_unit: editingMemberHeightUnit,
    weight: editingMemberWeight, weight_unit: editingMemberWeightUnit,
    activity_level: editingMemberActivityLevel,
  } satisfies MemberProfile));

  // Editable macro ratios (% of calories)
  let proteinRatio = $state($gameSettings.proteinRatio);
  let carbsRatio = $state($gameSettings.carbsRatio);
  let fatsRatio = $state($gameSettings.fatsRatio);

  // Whether to use DRI grams or custom ratio sliders for macros
  let ownerUseDRIMacros = $state($gameSettings.ownerUseDRIMacros ?? true);
  let editingMemberUseDRIMacros = $state(true);
  // Custom overrides for kcal, water, fiber, sugar (empty = use DRI calculated value)
  let ownerCustomKcal = $state($gameSettings.ownerCustomKcal ?? '');
  let ownerCustomWaterCups = $state($gameSettings.ownerCustomWaterCups ?? '');
  let ownerCustomSugarMax = $state($gameSettings.ownerCustomSugarMax ?? '');
  let ownerCustomFiberG = $state($gameSettings.ownerCustomFiberG ?? '');
  let editingMemberCustomKcal = $state('');
  let editingMemberCustomWaterCups = $state('');
  let editingMemberCustomSugarMax = $state('');
  let editingMemberCustomFiberG = $state('');
  
  // Plate ratios (food group % - MyPlate inspired defaults)
  let vegPlateRatio = $state($gameSettings.vegPlateRatio);
  let fruitPlateRatio = $state($gameSettings.fruitPlateRatio);
  let grainPlateRatio = $state($gameSettings.grainPlateRatio);
  let proteinPlateRatio = $state($gameSettings.proteinPlateRatio);

  // Recipe foods fetched from approved Basket game recipes
  let recipeFoods = $state<RecipeFood[]>([]);
  
  // Macro presets modal
  let showMacroHints = $state(false);
  
  // Initialize game state from localStorage on mount
  onMount(async () => {
    // Load saved game state (foods, meals, etc.)
    initializeGameState();
    
    // Load custom foods (from cloud for premium users, localStorage for others)
    await initializeCustomFoods();

    // Suppress DB meal-log writes until we have loaded authoritative data from
    // the server.  Without this, startAutoSave()'s immediate subscriber fire
    // would write whatever is in localStorage (possibly a household member's
    // foods from a prior session) into the owner's meal-log, wiping real data.
    suppressMealLogSave(true);

    // Start auto-saving game state on any changes
    startAutoSave();
    
    // Get last saved time for history info
    lastSavedTime = getSavedGameTime();

    // Load household members from API (ALL·IN users)
    if ($playerStore.status === 'logged-in' && $playerStore.id) {
      try {
        const hm = await fetch(`/api/household-members?player_id=${$playerStore.id}`);
        if (hm.ok) householdMembers = await hm.json();
      } catch { /* non-critical */ }

      // Load custom meal categories so their slots exist before we add foods
      if (isAllin) {
        await loadCustomCategories($playerStore.id);
      }

      // Sync today's meals from DB — DB is source of truth, overrides any stale
      // localStorage data (e.g. a household member's foods from a prior session).
      try {
        const today = new Date().toISOString().split('T')[0];
        const mealRes = await fetch(
          `/api/meal-log?user_id=${encodeURIComponent($playerStore.id)}&date=${today}`
        );
        if (mealRes.ok) {
          const mealData: { rows: { food_id: string; meal_category: string; quantity_grams: number }[] } =
            await mealRes.json();
          clearFoods();
          loadRowsIntoPlate(mealData.rows ?? []);
        }
      } catch { /* non-critical — localStorage state left intact */ } finally {
        suppressMealLogSave(false);
      }

      // Load today's note (Plus + ALL·IN users)
      await loadNoteForDate(todayDateStr());
    } else {
      // Not logged in — nothing to load from DB; unsuppress immediately.
      suppressMealLogSave(false);
    }

    // Load approved recipes as extra food options
    try {
      const res = await fetch('/api/recipes/nutrition');
      if (res.ok) {
        const data = await res.json();
        recipeFoods = data.map((r: {
          id: string; name: string; gramsPerServing: number;
          cal: number; pro: number; fat: number;
          carb: number; fib: number; h2o: number; sug: number;
        }): RecipeFood => ({
          word:     r.name,
          display:  r.name,
          groups:   ['prepared'],
          ndb:      r.id,
          desc:     `Community recipe · ${r.gramsPerServing}g per serving`,
          cal:      r.cal,
          pro:      r.pro,
          fat:      r.fat,
          carb:     r.carb,
          fib:      r.fib,
          h2o:      r.h2o,
          sug:      r.sug,
          portions: [
            { amt: 100, desc: 'custom (g)', gm: 100 },
            { amt: 1,   desc: 'serving', gm: r.gramsPerServing },
          ],
          isRecipe: true,
          gramsPerServing: r.gramsPerServing,
        }));
      }
    } catch {
      // Non-critical — Balance game works without recipes
    }
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
      sugarInput,
      ownerGroupage,
      ownerAge,
      ownerHeight,
      ownerHeightUnit,
      ownerWeight,
      ownerWeightUnit,
      ownerActivityLevel,
      ownerUseDRIMacros,
      ownerCustomKcal,
      ownerCustomWaterCups,
      ownerCustomSugarMax,
      ownerCustomFiberG,
    };
    
    // Apply settings to game stores (owner only — member-switch $effect handles members)
    if (!activeMemberId) {
      const mt = ownerDRITargets;
      const kcalFromDRI = mt ? Math.round(mt.kcal) : null;
      const baseKcal = kcalFromDRI ?? Math.max(800, Math.min(5000, currentSettings.isCustomCalories ? currentSettings.customCalories : currentSettings.calorieTarget));
      const effKcal = currentSettings.ownerCustomKcal ? (parseInt(currentSettings.ownerCustomKcal) || baseKcal) : baseKcal;
      
      targets.update(t => ({
        ...t,
        totalCalories: effKcal,
        groups: {
          ...t.groups,
          vegetable: currentSettings.vegPlateRatio,
          fruit: currentSettings.fruitPlateRatio,
          grain: currentSettings.grainPlateRatio,
          protein: currentSettings.proteinPlateRatio
        }
      }));
      
      if (mt && ownerUseDRIMacros) {
        const effWater = currentSettings.ownerCustomWaterCups ? (parseInt(currentSettings.ownerCustomWaterCups) || Math.round(mt.driRow.water * 4.1667)) : Math.round(mt.driRow.water * 4.1667);
        const driSugarDef = (currentSettings.ownerGroupage === 'Females' || currentSettings.ownerGroupage === 'Girls') ? 26 : 36;
        const effSugar = currentSettings.ownerCustomSugarMax ? (parseInt(currentSettings.ownerCustomSugarMax) || driSugarDef) : driSugarDef;
        const effFiber = currentSettings.ownerCustomFiberG ? (parseInt(currentSettings.ownerCustomFiberG) || mt.driRow.fiber) : mt.driRow.fiber;
        nutrientTargets.update(() => ({
          calories: effKcal,
          water: effWater,
          protein: mt.driRow.protein,
          carbohydrates: mt.driRow.carbohydrate,
          fats: mt.driRow.fat,
          fiber: effFiber,
          sugar: effSugar,
        }));
      } else {
        const scaled = getScaledDefaults(effKcal, currentSettings.proteinRatio, currentSettings.carbsRatio, currentSettings.fatsRatio);
        nutrientTargets.update(() => ({
          calories: effKcal,
          water: currentSettings.waterInput ? parseInt(currentSettings.waterInput) : scaled.water,
          protein: currentSettings.proteinInput ? parseInt(currentSettings.proteinInput) : scaled.protein,
          carbohydrates: currentSettings.carbsInput ? parseInt(currentSettings.carbsInput) : scaled.carbohydrates,
          fats: currentSettings.fatsInput ? parseInt(currentSettings.fatsInput) : scaled.fats,
          fiber: currentSettings.fiberInput ? parseInt(currentSettings.fiberInput) : scaled.fiber,
          sugar: currentSettings.sugarInput ? parseInt(currentSettings.sugarInput) : scaled.sugar
        }));
      }
    }
    
    // Persist to localStorage
    updateSettings(currentSettings);
  });

  // Load rows from DB into the plate, deduplicating by (food_id, meal_category).
  // Load rows from Turso into the plate. When Turso has both a Jetcool row
  // (source='jetcool') and a stale web-originated row for the same food+slot,
  // we must NOT sum them — that causes the displayed quantity to double on
  // every sync cycle (12g → 24g → 36g…). Instead we take exactly ONE row per
  // (food_id, meal_category): prefer the jetcool row (canonical source of
  // truth), or the most recently updated web row when no jetcool row exists.
  type MealRow = { food_id: string; meal_category: string; quantity_grams: number; source?: string; updated_at?: string };
  function loadRowsIntoPlate(rows: MealRow[]) {
    const best = new Map<string, MealRow>();
    for (const entry of rows) {
      const key = `${entry.food_id}|${entry.meal_category}`;
      if (!best.has(key)) {
        best.set(key, entry);
      } else {
        const cur = best.get(key)!;
        const curIsJetcool  = cur.source   === 'jetcool';
        const newIsJetcool  = entry.source === 'jetcool';
        // Jetcool beats web; between two web rows keep the more recent one.
        if (!curIsJetcool && (newIsJetcool || (entry.updated_at ?? '') > (cur.updated_at ?? ''))) {
          best.set(key, entry);
        }
      }
    }
    for (const entry of best.values()) {
      const food = FOODS.find(f => f.ndb === entry.food_id);
      if (food) addFood(food, food.portions[0], 'plate', entry.quantity_grams, 1, entry.meal_category);
    }
  }

  // Switch to a household member (or back to owner when newId = '').
  // Called from the select onchange and from the member delete button.
  async function switchToMember(newId: string) {
    const playerId = $playerStore.id;
    if (!playerId) return;

    // 1. Flush current member's plate to DB before changing anything
    await saveMealLog();

    // 2. Switch context so future saves target the new id
    activeMemberId = newId;
    setViewingUserId(newId || null);

    // 3. Load new member's today meals — suppress auto-saves during reload
    suppressMealLogSave(true);
    const today = new Date().toISOString().split('T')[0];
    const effectiveUserId = newId || playerId;
    try {
      const res = await fetch(`/api/meal-log?user_id=${encodeURIComponent(effectiveUserId)}&date=${today}`);
      clearFoods();
      if (res.ok) {
        const data: { rows: { food_id: string; meal_category: string; quantity_grams: number }[] } = await res.json();
        loadRowsIntoPlate(data.rows ?? []);
      }
    } catch {
      clearFoods();
    } finally {
      suppressMealLogSave(false);
    }
  }

  // Sync editing member fields when the active member changes
  $effect(() => {
    const member = activeMember;
    if (member) {
      editingMemberGroupage = member.groupage ?? 'Males';
      editingMemberAge = member.age ?? '';
      editingMemberHeight = member.height ?? '';
      editingMemberHeightUnit = member.height_unit ?? 'cm';
      editingMemberWeight = member.weight ?? '';
      editingMemberWeightUnit = member.weight_unit ?? 'kilos';
      editingMemberActivityLevel = member.activity_level ?? 'Sedentary';
      editingMemberCustomKcal = member.custom_kcal ?? '';
      editingMemberCustomWaterCups = member.custom_water_cups ?? '';
      editingMemberCustomSugarMax = member.custom_sugar_max ?? '';
      editingMemberCustomFiberG = member.custom_fiber_g ?? '';
      memberProfileDirty = false;
      editingMemberUseDRIMacros = true;
    }
  });

  // Switch game targets when a household member is selected (or DRI profile changes)
  $effect(() => {
    const memberId = activeMemberId;
    if (!memberId) {
      // Owner — use DRI targets if available and DRI macro mode is on, else use ratio sliders
      const mt = ownerDRITargets;
      const baseKcal = mt ? Math.round(mt.kcal) : Math.max(800, Math.min(5000, isCustomCalories ? customCalories : calorieTarget));
      const effKcal = ownerCustomKcal ? (parseInt(ownerCustomKcal) || baseKcal) : baseKcal;
      targets.update(t => ({ ...t, totalCalories: effKcal }));
      if (mt && ownerUseDRIMacros) {
        const effWater = ownerCustomWaterCups ? (parseInt(ownerCustomWaterCups) || Math.round(mt.driRow.water * 4.1667)) : Math.round(mt.driRow.water * 4.1667);
        const driSugarDef = (ownerGroupage === 'Females' || ownerGroupage === 'Girls') ? 26 : 36;
        const effSugar = ownerCustomSugarMax ? (parseInt(ownerCustomSugarMax) || driSugarDef) : driSugarDef;
        const effFiber = ownerCustomFiberG ? (parseInt(ownerCustomFiberG) || mt.driRow.fiber) : mt.driRow.fiber;
        nutrientTargets.update(() => ({
          calories: effKcal,
          water: effWater,
          protein: mt.driRow.protein,
          carbohydrates: mt.driRow.carbohydrate,
          fats: mt.driRow.fat,
          fiber: effFiber,
          sugar: effSugar,
        }));
      } else {
        const scaled = getScaledDefaults(effKcal, proteinRatio, carbsRatio, fatsRatio);
        nutrientTargets.update(() => ({
          calories: effKcal,
          water: waterInput ? parseInt(waterInput) : scaled.water,
          protein: proteinInput ? parseInt(proteinInput) : scaled.protein,
          carbohydrates: carbsInput ? parseInt(carbsInput) : scaled.carbohydrates,
          fats: fatsInput ? parseInt(fatsInput) : scaled.fats,
          fiber: fiberInput ? parseInt(fiberInput) : scaled.fiber,
          sugar: sugarInput ? parseInt(sugarInput) : scaled.sugar,
        }));
      }
      return;
    }
    // Member — use live editing fields for instant preview
    const mt = editingMemberDRITargets;
    if (mt) {
      const baseKcal = Math.round(mt.kcal);
      const effKcal = editingMemberCustomKcal ? (parseInt(editingMemberCustomKcal) || baseKcal) : baseKcal;
      targets.update(t => ({ ...t, totalCalories: effKcal }));
      if (editingMemberUseDRIMacros) {
        const effWater = editingMemberCustomWaterCups ? (parseInt(editingMemberCustomWaterCups) || Math.round(mt.driRow.water * 4.1667)) : Math.round(mt.driRow.water * 4.1667);
        const driSugarDef = (editingMemberGroupage === 'Females' || editingMemberGroupage === 'Girls') ? 26 : 36;
        const effSugar = editingMemberCustomSugarMax ? (parseInt(editingMemberCustomSugarMax) || driSugarDef) : driSugarDef;
        const effFiber = editingMemberCustomFiberG ? (parseInt(editingMemberCustomFiberG) || mt.driRow.fiber) : mt.driRow.fiber;
        nutrientTargets.update(() => ({
          calories: effKcal,
          water: effWater,
          protein: mt.driRow.protein,
          carbohydrates: mt.driRow.carbohydrate,
          fats: mt.driRow.fat,
          fiber: effFiber,
          sugar: effSugar,
        }));
      } else {
        const scaled = getScaledDefaults(effKcal, proteinRatio, carbsRatio, fatsRatio);
        nutrientTargets.update(() => ({
          calories: effKcal,
          water: scaled.water,
          protein: scaled.protein,
          carbohydrates: scaled.carbohydrates,
          fats: scaled.fats,
          fiber: scaled.fiber,
          sugar: scaled.sugar,
        }));
      }
    }
  });

  let ownerSaving = $state(false);

  async function saveOwnerDRI() {
    const playerId = $playerStore.id;
    console.log('[saveOwnerDRI] playerId:', playerId, 'status:', $playerStore.status);
    if (!playerId) {
      alert('Not logged in — please log in and try again.');
      return;
    }
    ownerSaving = true;
    try {
      const payload = {
        player_id: playerId,
        owner_groupage: ownerGroupage,
        owner_age: ownerAge,
        owner_height: String(ownerHeight),
        owner_height_unit: ownerHeightUnit,
        owner_weight: String(ownerWeight),
        owner_weight_unit: ownerWeightUnit,
        owner_activity_level: ownerActivityLevel,
      };
      console.log('[saveOwnerDRI] Sending:', payload);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseText = await res.text();
      console.log('[saveOwnerDRI] Response:', res.status, responseText);
      if (res.ok) {
        updateSettings({
          ownerGroupage,
          ownerAge,
          ownerHeight: String(ownerHeight),
          ownerHeightUnit,
          ownerWeight: String(ownerWeight),
          ownerWeightUnit,
          ownerActivityLevel,
        });
        ownerProfileDirty = false;
      } else {
        alert('Save failed: ' + responseText);
      }
    } catch (e) {
      console.error('[saveOwnerDRI] Failed:', e);
      alert('Save error: ' + String(e));
    } finally {
      ownerSaving = false;
    }
  }

  async function saveMemberDRI() {
    if (!activeMember?.id || !$playerStore.id) return;
    await fetch(`/api/household-members/${activeMember.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: $playerStore.id,
        groupage: editingMemberGroupage,
        age: editingMemberAge,
        height: editingMemberHeight,
        height_unit: editingMemberHeightUnit,
        weight: editingMemberWeight,
        weight_unit: editingMemberWeightUnit,
        activity_level: editingMemberActivityLevel,
        custom_kcal: editingMemberCustomKcal,
        custom_water_cups: editingMemberCustomWaterCups,
        custom_sugar_max: editingMemberCustomSugarMax,
        custom_fiber_g: editingMemberCustomFiberG,
      }),
    });
    // Refresh member list so stored data matches
    const res = await fetch(`/api/household-members?player_id=${$playerStore.id}`);
    if (res.ok) householdMembers = await res.json();
    memberProfileDirty = false;
  }
  
  async function openSettings() {
    // Fetch fresh member data BEFORE revealing the panel so the UI never
    // shows stale demographics. cache:'no-store' bypasses both browser
    // cache and any CDN layer.
    if ($playerStore.id) {
      try {
        const r = await fetch(
          `/api/household-members?player_id=${encodeURIComponent($playerStore.id)}`,
          { cache: 'no-store' }
        );
        if (r.ok) householdMembers = await r.json();
      } catch { /* non-critical — show whatever we have */ }
    }
    showSettings = true;
  }

  let syncingMobile = $state(false);
  let syncMobileResult = $state<'ok' | 'error' | null>(null);
  let syncMobileTimer: ReturnType<typeof setTimeout> | null = null;

  async function syncFromJetcool() {
    if (syncingMobile || !$playerStore.id) return;
    syncingMobile = true;
    syncMobileResult = null;
    if (syncMobileTimer) clearTimeout(syncMobileTimer);
    const today = new Date().toISOString().split('T')[0];
    const effectiveUserId = activeMemberId || $playerStore.id;
    try {
      const res = await fetch(
        `/api/meal-log?user_id=${encodeURIComponent(effectiveUserId)}&date=${today}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { rows: { food_id: string; meal_category: string; quantity_grams: number }[] } =
        await res.json();
      suppressMealLogSave(true);
      clearFoods();
      loadRowsIntoPlate(data.rows ?? []);
      syncMobileResult = 'ok';
    } catch {
      syncMobileResult = 'error';
    } finally {
      suppressMealLogSave(false);
      syncingMobile = false;
      // Also refresh household members so demographic changes from Jetcool show immediately.
      if ($playerStore.id) {
        fetch(`/api/household-members?player_id=${$playerStore.id}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data) householdMembers = data; })
          .catch(() => {});
      }
      syncMobileTimer = setTimeout(() => { syncMobileResult = null; }, 4000);
    }
  }
  
  function closeSettings() {
    showSettings = false;
  }

  // Called when the user logs in mid-session via the LoginModal.
  // onMount only runs once, so we must replicate its DB-reload block here;
  // otherwise the plate never reflects Turso state for the newly signed-in user.
  async function handleLoginSuccess() {
    showLoginModal = false;
    const playerId = $playerStore.id;
    if (!playerId) return;

    const today = new Date().toISOString().split('T')[0];

    // Load household members (needed for the member-switcher dropdown).
    try {
      const hm = await fetch(`/api/household-members?player_id=${encodeURIComponent(playerId)}`);
      if (hm.ok) householdMembers = await hm.json();
    } catch { /* non-critical */ }

    // Load custom meal categories for ALL·IN users.
    if (isAllin) {
      await loadCustomCategories(playerId);
    }

    // Reload today's meals from Turso — suppress auto-saves during the reload
    // so clearFoods() does not trigger a PUT that wipes the DB rows.
    suppressMealLogSave(true);
    try {
      const res = await fetch(`/api/meal-log?user_id=${encodeURIComponent(playerId)}&date=${today}`);
      if (res.ok) {
        const data: { rows: { food_id: string; meal_category: string; quantity_grams: number; source?: string; updated_at?: string }[] } =
          await res.json();
        clearFoods();
        loadRowsIntoPlate(data.rows ?? []);
      }
    } catch { /* non-critical — leave plate as-is */ } finally {
      suppressMealLogSave(false);
    }

    // Load today's note for Plus+ users.
    await loadNoteForDate(todayDateStr());
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
  <title>Balanced Diet | TodayPage</title>
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

<div class="game-wrapper" class:scroll-locked={showNotes}>
<div class="game-container">
  <!-- Header -->
  <header class="game-header">
    <h1>🥗 Balanced Diet</h1>
    {#if householdMembers.filter(m => m.id).length > 0}
      <div class="member-switcher">
        <select class="member-select-pill" value={activeMemberId} onchange={(e) => switchToMember((e.currentTarget as HTMLSelectElement).value)}>
          <option value="">👤 {$playerStore.displayName ?? 'You'}</option>
          {#each householdMembers.filter(m => m.id) as m (m.id)}
            <option value={m.id}>{m.icon} {m.name}</option>
          {/each}
        </select>
      </div>
    {/if}
    <div class="header-actions">
      <button class="new-game-btn" onclick={() => showNewGameConfirm = true}>
        🆕 New
      </button>
      <div class="hamburger-wrap">
        <button
          class="hamburger-btn"
          onclick={() => showMenu = !showMenu}
          aria-label="Menu"
          aria-expanded={showMenu}
        >☰</button>
        {#if showMenu}
          <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
          <div class="menu-backdrop" onclick={closeMenu}></div>
          <div class="menu-dropdown">
            {#if $playerStore.status === 'logged-in'}
              <button class="menu-item" onclick={() => { openNotes(); closeMenu(); }}>
                📓 Notes{#if noteExists}<span class="notes-dot"></span>{/if}
                <span class="menu-tier-badge">Plus</span>
              </button>
              <button class="menu-item" onclick={() => { showReports = true; closeMenu(); }}>
                📊 Reports
                <span class="menu-tier-badge">ALL·IN</span>
              </button>
              <div class="menu-divider"></div>
            {/if}
            <button class="menu-item" onclick={() => { lastSavedTime = getSavedGameTime(); showHistoryInfo = true; closeMenu(); }}>
              📜 History
            </button>
            <button class="menu-item" onclick={() => { showRules = true; closeMenu(); }}>
              📖 Rules
            </button>
            {#if $playerStore.status === 'logged-in'}
              <button class="menu-item" onclick={() => { syncFromJetcool(); closeMenu(); }} disabled={syncingMobile}>
                {#if syncingMobile}
                  ⏳ Syncing…
                {:else if syncMobileResult === 'ok'}
                  ✅ Synced!
                {:else if syncMobileResult === 'error'}
                  ❌ Sync failed
                {:else}
                  📱 Sync from Jetcool
                {/if}
              </button>
            {/if}
            <button class="menu-item" onclick={() => { openSettings(); closeMenu(); }}>
              ⚙️ Settings
            </button>
            {#if $playerStore.status === 'logged-in'}
              <div class="menu-divider"></div>
              <div class="menu-account-name">👤 {$playerStore.displayName ?? $playerStore.email ?? 'Account'}<span class="menu-account-tier">{$playerStore.tier}</span></div>
              <button class="menu-item menu-item--logout" onclick={() => { setViewingUserId(null); activeMemberId = ''; playerStore.logout(); closeMenu(); }}>
                🚪 Sign Out
              </button>
            {:else}
              <div class="menu-divider"></div>
              <button class="menu-item" onclick={() => { showLoginModal = true; closeMenu(); }}>
                👤 Login / Register
              </button>
            {/if}
          </div>
        {/if}
      </div>
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

  <!-- Notes Modal -->
  {#if showNotes}
    <div class="modal-backdrop" onclick={() => showNotes = false}>
      <div class="notes-modal" onclick={(e) => e.stopPropagation()}>
      {#if !isPlus}
        <div class="notes-upgrade">
          <div class="upgrade-icon">📓</div>
          <h4>Notes is a Plus feature</h4>
          <p>Track how you feel each day, log symptoms, and build a personal health diary that feeds into Reports.</p>
          <ul class="upgrade-features">
            <li class="upgrade-feature">😊 Daily sentiment tracker</li>
            <li class="upgrade-feature">🔴 Symptom logger with severity rating</li>
            <li class="upgrade-feature">📅 30-day history with date search</li>
            <li class="upgrade-feature">📊 Feeds into Reports correlation</li>
          </ul>
          <button class="upgrade-cta">Upgrade to Plus — $4.95/mo</button>
          <button class="upgrade-skip" onclick={() => showNotes = false}>Maybe later</button>
        </div>
      {:else}
        <!-- Header with tab switcher -->
        <div class="notes-modal-header">
          <h3>📓 Daily Notes</h3>
          <div class="notes-tabs">
            <button
              class="notes-tab"
              class:active={notesView === 'editor'}
              onclick={() => notesView = 'editor'}
            >Today</button>
            <button
              class="notes-tab"
              class:active={notesView === 'history'}
              onclick={() => { notesView = 'history'; historyPickDate = ''; historyPickNote = null; historyPickSearched = false; loadNotesHistory(); }}
            >History</button>
          </div>
        </div>

        {#if notesView === 'editor'}
          <!-- Note editor — supports any past date via the quick buttons / date picker -->
          <div class="notes-editor">
            <div class="notes-date-row">
              <span class="notes-save-for">Save note for</span>
              <button
                class="notes-quick-date"
                class:active={noteDate === todayDateStr()}
                onclick={() => switchNoteDate(todayDateStr())}
              >Today</button>
              <button
                class="notes-quick-date"
                class:active={noteDate === yesterdayStr}
                onclick={() => switchNoteDate(yesterdayStr)}
              >Yesterday</button>
              <input
                id="note-date-edit"
                type="date"
                class="note-date-input"
                class:active={noteDate !== todayDateStr() && noteDate !== yesterdayStr}
                max={todayDateStr()}
                bind:value={noteDate}
                onchange={() => switchNoteDate(noteDate)}
              />
            </div>

            <!-- Sentiment picker -->
            <div class="sentiment-row">
              <span class="sentiment-label">How are you feeling overall today?</span>
              <button
                class="sentiment-btn"
                class:selected={noteSentiment === 'positive'}
                onclick={() => noteSentiment = noteSentiment === 'positive' ? '' : 'positive'}
                title="Positive"
              >😊</button>
              <button
                class="sentiment-btn"
                class:selected={noteSentiment === 'neutral'}
                onclick={() => noteSentiment = noteSentiment === 'neutral' ? '' : 'neutral'}
                title="Neutral"
              >😐</button>
              <button
                class="sentiment-btn"
                class:selected={noteSentiment === 'negative'}
                onclick={() => noteSentiment = noteSentiment === 'negative' ? '' : 'negative'}
                title="Negative"
              >😔</button>
              <span class="sentiment-important">&larr; Important</span>
            </div>

            <textarea
              class="notes-textarea"
              placeholder="Please select how you feel today. It is important. Also, if you are experiencing a symptom worth noting please select the closest match from the symptoms list below. This is the only way to determine your normal level of nutrients, that is, nutrient levels not associated with a symptom. Add any additional thoughts here."
              bind:value={noteContent}
              rows="5"
            ></textarea>

            <!-- Added symptoms list -->
            {#if noteSymptoms.length > 0}
              <div class="symptoms-added">
                {#each noteSymptoms as symptom (symptom.id)}
                  <div class="symptom-card">
                    <div class="symptom-card-header">
                      <span class="symptom-name">{symptom.name}</span>
                      <button class="symptom-remove" onclick={() => removeSymptom(symptom.id)} title="Remove">✕</button>
                    </div>
                    <div class="symptom-severity-row">
                      <span class="sev-label">Severity</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={symptom.severity}
                        oninput={(e) => updateSymptomSeverity(symptom.id, parseInt((e.target as HTMLInputElement).value))}
                        class="severity-slider"
                      />
                      <span
                        class="severity-value"
                        class:sev-mild={symptom.severity <= 3}
                        class:sev-moderate={symptom.severity > 3 && symptom.severity <= 6}
                        class:sev-severe={symptom.severity > 6}
                      >{symptom.severity}/10</span>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Symptom & observation picker -->
            <div class="symptoms-section">
              <button
                class="symptoms-toggle"
                onclick={() => { symptomsExpanded = !symptomsExpanded; if (!symptomsExpanded) symptomsExpandedCategory = null; }}
              >
                <span>{symptomsExpanded ? '−' : '+'} Symptoms &amp; Observations</span>
                <span class="symptoms-arrow" class:open={symptomsExpanded}>▾</span>
              </button>
              {#if symptomsExpanded}
                {@const OBSERVATION_CATS = ['Activity & Exercise', 'Diet Changes', 'Medication']}
                {@const SYMPTOM_CATS = ['Gastrointestinal', 'Health & Mood', 'Sleep & Energy', 'Other Symptoms']}
                <div class="symptoms-picker">
                  <div class="symptom-section-heading">Observations</div>
                  {#each OBSERVATION_CATS as cat}
                    {@const items = SYMPTOM_CATEGORIES[cat]}
                    <div class="symptom-category">
                      <button
                        class="symptom-cat-header"
                        class:open={symptomsExpandedCategory === cat}
                        onclick={() => symptomsExpandedCategory = symptomsExpandedCategory === cat ? null : cat}
                      >{cat} <span class="cat-arrow">▾</span></button>
                      {#if symptomsExpandedCategory === cat}
                        <div class="symptom-chips">
                          {#each items as item}
                            {@const alreadyAdded = noteSymptoms.some(s => s.name === item)}
                            <button
                              class="symptom-chip"
                              class:added={alreadyAdded}
                              onclick={() => {
                                if (alreadyAdded) {
                                  const found = noteSymptoms.find(s => s.name === item);
                                  if (found) removeSymptom(found.id);
                                } else {
                                  addSymptom(item, cat);
                                }
                              }}
                            >{alreadyAdded ? '✓ ' : ''}{item}</button>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  {/each}
                  <div class="symptom-section-heading">Symptoms</div>
                  {#each SYMPTOM_CATS as cat}
                    {@const items = SYMPTOM_CATEGORIES[cat]}
                    <div class="symptom-category">
                      <button
                        class="symptom-cat-header"
                        class:open={symptomsExpandedCategory === cat}
                        onclick={() => symptomsExpandedCategory = symptomsExpandedCategory === cat ? null : cat}
                      >{cat} <span class="cat-arrow">▾</span></button>
                      {#if symptomsExpandedCategory === cat}
                        <div class="symptom-chips">
                          {#each items as item}
                            {@const alreadyAdded = noteSymptoms.some(s => s.name === item)}
                            <button
                              class="symptom-chip"
                              class:added={alreadyAdded}
                              onclick={() => {
                                if (alreadyAdded) {
                                  const found = noteSymptoms.find(s => s.name === item);
                                  if (found) removeSymptom(found.id);
                                } else {
                                  addSymptom(item, cat);
                                }
                              }}
                            >{alreadyAdded ? '✓ ' : ''}{item}</button>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  {/each}
                  <div class="custom-symptom-row">
                    <input
                      type="text"
                      class="custom-symptom-input"
                      placeholder="Custom symptom…"
                      bind:value={customSymptomInput}
                      onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSymptom(); } }}
                      maxlength="60"
                    />
                    <button class="custom-symptom-add" onclick={addCustomSymptom} disabled={!customSymptomInput.trim()}>Add</button>
                  </div>
                </div>
              {/if}
            </div>

            <div class="notes-actions">
              {#if noteExists}
                <button class="delete-note-btn" onclick={deleteNote} disabled={noteDeleting}>
                  {noteDeleting ? 'Deleting…' : '🗑 Delete'}
                </button>
              {/if}
              <button
                class="save-note-btn"
                onclick={saveNote}
                disabled={noteSaving || (!noteContent.trim() && noteSymptoms.length === 0)}
              >
                {noteSaving ? 'Saving…' : noteExists ? '💾 Update' : '💾 Save'}
              </button>
            </div>
          </div>

        {:else}
          <!-- Notes history -->
          <div class="notes-history">
            <!-- Date picker for any historical date -->
            <div class="history-date-picker">
              <label class="history-pick-label" for="notes-date-pick">Look up a date</label>
              <input
                id="notes-date-pick"
                type="date"
                class="history-pick-input"
                bind:value={historyPickDate}
                max={todayDateStr()}
                onchange={lookUpNoteByDate}
              />
            </div>

            {#if historyPickDate}
              <div class="history-pick-result">
                {#if historyPickLoading}
                  <p class="notes-loading">Looking up…</p>
                {:else if historyPickSearched && historyPickNote}
                  <div class="history-entry history-entry--picked">
                    <div class="history-entry-header">
                      <span class="history-date">
                        {new Date(historyPickDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      {#if historyPickNote.sentiment_flag === 'positive'}
                        <span class="history-sentiment">😊</span>
                      {:else if historyPickNote.sentiment_flag === 'neutral'}
                        <span class="history-sentiment">😐</span>
                      {:else if historyPickNote.sentiment_flag === 'negative'}
                        <span class="history-sentiment">😔</span>
                      {/if}
                    </div>
                    <p class="history-entry-text">{historyPickNote.note_content}</p>
                    {#if historyPickNote.symptoms}
                      {@const pickedS = (() => { try { return JSON.parse(historyPickNote.symptoms as string) as HybridSymptom[]; } catch { return [] as HybridSymptom[]; } })()}
                      {#if pickedS.length > 0}
                        <div class="history-symptoms">
                          {#each pickedS as s}
                            <span class="history-symptom-chip" class:chip-mild={s.severity <= 3} class:chip-moderate={s.severity > 3 && s.severity <= 6} class:chip-severe={s.severity > 6}>{s.name} <span class="chip-sev">{s.severity}</span></span>
                          {/each}
                        </div>
                      {/if}
                    {/if}
                  </div>
                {:else if historyPickSearched && !historyPickNote}
                  <p class="history-pick-empty">No note for {new Date(historyPickDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.</p>
                {/if}
              </div>
              <div class="history-divider">
                <span>Recent notes</span>
              </div>
            {/if}

            {#if notesHistoryLoading}
              <p class="notes-loading">Loading…</p>
            {:else if notesHistory.length === 0}
              <p class="notes-empty">No notes yet. Start writing today!</p>
            {:else}
              {#each notesHistory as entry (entry.id)}
                <div class="history-entry">
                  <div class="history-entry-header">
                    <span class="history-date">
                      {new Date(entry.note_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    {#if entry.sentiment_flag === 'positive'}
                      <span class="history-sentiment">😊</span>
                    {:else if entry.sentiment_flag === 'neutral'}
                      <span class="history-sentiment">😐</span>
                    {:else if entry.sentiment_flag === 'negative'}
                      <span class="history-sentiment">😔</span>
                    {/if}
                  </div>
                  <p class="history-entry-text">{entry.note_content}</p>
                  {#if entry.symptoms}
                    {@const parsedS = (() => { try { return JSON.parse(entry.symptoms as string) as HybridSymptom[]; } catch { return [] as HybridSymptom[]; } })()}
                    {#if parsedS.length > 0}
                      <div class="history-symptoms">
                        {#each parsedS as s}
                          <span class="history-symptom-chip" class:chip-mild={s.severity <= 3} class:chip-moderate={s.severity > 3 && s.severity <= 6} class:chip-severe={s.severity > 6}>{s.name} <span class="chip-sev">{s.severity}</span></span>
                        {/each}
                      </div>
                    {/if}
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        {/if}

        <button class="modal-close-btn" onclick={() => showNotes = false}>Close</button>
      {/if}
      </div>
    </div>
  {/if}

  <!-- Reports Modal -->
  {#if showReports}
    <ReportsModal memberProfile={activeProfile} onClose={() => showReports = false} />
  {/if}

  {#if showLoginModal}
    <LoginModal
      onClose={() => showLoginModal = false}
      onSuccess={handleLoginSuccess}
    />
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
      <div class="settings-tabs">
        <button
          class="settings-tab"
          class:active={settingsTab === 'targets'}
          onclick={() => settingsTab = 'targets'}
        >📊 Targets</button>
        <button
          class="settings-tab"
          class:active={settingsTab === 'sharing'}
          onclick={() => settingsTab = 'sharing'}
        >👨‍👩‍👧 Sharing</button>
      </div>

      {#if settingsTab === 'targets'}
      <div class="targets-owner-label">
        📊 {activeMember ? activeMember.name + '\'s' : ($playerStore.displayName ? $playerStore.displayName + '\'s' : 'Your')} targets
      </div>

      <!-- DRI Profile — editable for owner AND members -->
      <div class="settings-section">
        <h4>DRI Profile</h4>
        <div class="profile-fields">
          <div class="profile-row">
            <label class="member-label half">
              Group
              <select
                class="member-select"
                value={activeMember ? editingMemberGroupage : ownerGroupage}
                onchange={(e) => {
                  const val = e.currentTarget.value;
                  if (activeMember) {
                    editingMemberGroupage = val;
                    memberProfileDirty = true;
                  } else {
                    ownerGroupage = val;
                    ownerProfileDirty = true;
                  }
                }}
              >
                {#each MEMBER_GROUPS as g}
                  <option value={g}>{g}</option>
                {/each}
              </select>
            </label>
            <label class="member-label half">
              Age
              <input
                type="number"
                class="member-input-sm"
                value={activeMember ? editingMemberAge : ownerAge}
                oninput={(e) => {
                  if (activeMember) { editingMemberAge = e.currentTarget.value; memberProfileDirty = true; }
                  else { ownerAge = e.currentTarget.value; ownerProfileDirty = true; }
                }}
                min="0"
                max="120"
                placeholder="e.g. 35"
              />
            </label>
          </div>

          <div class="profile-row">
            <label class="member-label half">
              Height
              <div class="input-unit-row">
                {#if activeMember}
                  <input type="number" value={editingMemberHeight} oninput={(e) => { editingMemberHeight = e.currentTarget.value; memberProfileDirty = true; }} placeholder={editingMemberHeightUnit === 'inches' ? '68' : '173'} min="20" max="300" class="member-input-sm {!editingMemberHeight ? 'field-missing' : ''}" />
                  <select class="unit-select" value={editingMemberHeightUnit} onchange={(e) => { editingMemberHeightUnit = e.currentTarget.value; memberProfileDirty = true; }}>
                    <option value="inches">in</option>
                    <option value="cm">cm</option>
                  </select>
                {:else}
                  <input type="number" bind:value={ownerHeight} oninput={() => ownerProfileDirty = true} placeholder={ownerHeightUnit === 'inches' ? '68' : '173'} min="20" max="300" class="member-input-sm {!ownerHeight ? 'field-missing' : ''}" />
                  <select class="unit-select" bind:value={ownerHeightUnit} onchange={() => ownerProfileDirty = true}>
                    <option value="inches">in</option>
                    <option value="cm">cm</option>
                  </select>
                {/if}
              </div>
            </label>
            <label class="member-label half">
              Weight
              <div class="input-unit-row">
                {#if activeMember}
                  <input type="number" value={editingMemberWeight} oninput={(e) => { editingMemberWeight = e.currentTarget.value; memberProfileDirty = true; }} placeholder={editingMemberWeightUnit === 'pounds' ? '154' : '70'} min="5" max="500" class="member-input-sm {!editingMemberWeight ? 'field-missing' : ''}" />
                  <select class="unit-select" value={editingMemberWeightUnit} onchange={(e) => { editingMemberWeightUnit = e.currentTarget.value; memberProfileDirty = true; }}>
                    <option value="pounds">lb</option>
                    <option value="kilos">kg</option>
                  </select>
                {:else}
                  <input type="number" bind:value={ownerWeight} oninput={() => ownerProfileDirty = true} placeholder={ownerWeightUnit === 'pounds' ? '154' : '70'} min="5" max="500" class="member-input-sm {!ownerWeight ? 'field-missing' : ''}" />
                  <select class="unit-select" bind:value={ownerWeightUnit} onchange={() => ownerProfileDirty = true}>
                    <option value="pounds">lb</option>
                    <option value="kilos">kg</option>
                  </select>
                {/if}
              </div>
            </label>
          </div>

          <label class="member-label">
            Activity Level
            <select
              class="member-select"
              value={activeMember ? editingMemberActivityLevel : ownerActivityLevel}
              onchange={(e) => {
                if (activeMember) { editingMemberActivityLevel = e.currentTarget.value; memberProfileDirty = true; }
                else { ownerActivityLevel = e.currentTarget.value; ownerProfileDirty = true; }
              }}
            >
              {#each MEMBER_ACTIVITY_LEVELS as level}
                <option value={level}>{level}</option>
              {/each}
            </select>
          </label>
        </div>

        <!-- Live DRI preview -->
        {#each [activeMember ? editingMemberDRITargets : ownerDRITargets] as mt}
          {#if mt}
            {@const customKcal     = activeMember ? editingMemberCustomKcal      : ownerCustomKcal}
            {@const customWater    = activeMember ? editingMemberCustomWaterCups  : ownerCustomWaterCups}
            {@const customSugar    = activeMember ? editingMemberCustomSugarMax   : ownerCustomSugarMax}
            {@const customFiber    = activeMember ? editingMemberCustomFiberG     : ownerCustomFiberG}
            {@const setCustomKcal  = (v: string) => { if (activeMember) { editingMemberCustomKcal = v; memberProfileDirty = true; } else ownerCustomKcal = v; }}
            {@const setCustomWater = (v: string) => { if (activeMember) { editingMemberCustomWaterCups = v; memberProfileDirty = true; } else ownerCustomWaterCups = v; }}
            {@const setCustomSugar = (v: string) => { if (activeMember) { editingMemberCustomSugarMax = v; memberProfileDirty = true; } else ownerCustomSugarMax = v; }}
            {@const setCustomFiber = (v: string) => { if (activeMember) { editingMemberCustomFiberG = v; memberProfileDirty = true; } else ownerCustomFiberG = v; }}
            {@const groupage = activeMember ? editingMemberGroupage : ownerGroupage}
            {@const driKcal  = Math.round(mt.kcal)}
            {@const driWater = Math.round(mt.driRow.water * 4.1667)}
            {@const effKcal  = customKcal ? (parseInt(customKcal) || driKcal) : driKcal}
            {@const driSugar = (groupage === 'Females' || groupage === 'Girls') ? 26 : 36}
            <div class="dri-targets-preview">
              <div class="dri-preview-header">
                <div class="dri-kcal-edit">
                  <input
                    type="number" min="500" max="6000"
                    class="dri-kcal-input"
                    value={customKcal || String(driKcal)}
                    oninput={(e) => setCustomKcal(e.currentTarget.value)}
                  />
                  <span class="kcal-unit">kcal</span>
                </div>
                {#if customKcal}
                  <span class="dri-tag custom">custom</span>
                  <button class="dri-reset-btn" title="Reset to DRI value" onclick={() => setCustomKcal('')}>↺</button>
                {:else if mt.kcalIsPersonalised}
                  <span class="dri-tag personalised">personalised EER</span>
                {:else}
                  <span class="dri-tag population">DRI average</span>
                {/if}
              </div>
              {#if !mt.kcalIsPersonalised && !customKcal}
                <p class="missing-fields-hint">⚠ Add {[!(activeMember ? editingMemberHeight : ownerHeight) && 'height', !(activeMember ? editingMemberWeight : ownerWeight) && 'weight'].filter(Boolean).join(' + ')} above for a personalised calorie target</p>
              {/if}
              <div class="dri-two-col">
                <div class="dri-col-left">
                  <div class="dri-target-row">
                    <span>💧 Water</span>
                    <span class="dri-editable-wrap">
                      <input type="number" min="1" max="30" class="dri-inline-input" value={customWater || String(driWater)} oninput={(e) => setCustomWater(e.currentTarget.value)} />
                      <span class="dri-unit">cups</span>
                      {#if customWater}<button class="dri-reset-btn" onclick={() => setCustomWater('')}>↺</button>{/if}
                    </span>
                  </div>
                  <div class="dri-target-row"><span>🌾 Fiber</span>
                    <span class="dri-editable-wrap">
                      <input type="number" min="1" max="100" class="dri-inline-input" value={customFiber || String(mt.driRow.fiber)} oninput={(e) => setCustomFiber(e.currentTarget.value)} />
                      <span class="dri-unit">g</span>
                      {#if customFiber}<button class="dri-reset-btn" onclick={() => setCustomFiber('')}>↺</button>{/if}
                    </span>
                  </div>
                  <div class="dri-target-row">
                    <span>🍬 Sugar max</span>
                    <span class="dri-editable-wrap">
                      <input type="number" min="1" max="200" class="dri-inline-input" value={customSugar || String(driSugar)} oninput={(e) => setCustomSugar(e.currentTarget.value)} />
                      <span class="dri-unit">g</span>
                      {#if customSugar}<button class="dri-reset-btn" onclick={() => setCustomSugar('')}>↺</button>{/if}
                    </span>
                  </div>
                </div>
                {#if activeMember ? editingMemberUseDRIMacros : ownerUseDRIMacros}
                  <div class="dri-col-right">
                    <div class="dri-target-row"><span>🥩 Protein</span><strong>{mt.driRow.protein} g</strong></div>
                    <div class="dri-target-row"><span>🧈 Fats</span><strong>{mt.driRow.fat} g</strong></div>
                    <div class="dri-target-row"><span>🍞 Carbs</span><strong>{mt.driRow.carbohydrate} g</strong></div>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <p class="ratio-hint" style="margin-top:0.5rem">Add height, weight, and activity level for a personalised EER calculation. Group + Age alone gives the DRI population average.</p>
          {/if}
        {/each}

        {#if activeMember && memberProfileDirty}
          <button class="save-dri-btn" onclick={saveMemberDRI}>💾 Save {activeMember.name}'s Profile</button>
        {:else if !activeMember}
          <button class="save-dri-btn" onclick={saveOwnerDRI} disabled={ownerSaving}>{ownerSaving ? '⏳ Saving…' : '💾 Save Your Profile'}</button>
        {/if}
      </div>

      <!-- Macro Ratios — DRI or custom, available to everyone -->
      <div class="settings-section">
        <h4>
          Macro Ratios
          {#if !(activeMember ? editingMemberUseDRIMacros : ownerUseDRIMacros)}
            <span class="ratio-hint">(should total ~100%)</span>
          {/if}
        </h4>

        <p class="macro-source-label">Macro gram targets — select source:</p>
        <div class="macro-mode-toggle">
          <button
            class="macro-mode-btn"
            class:active={activeMember ? editingMemberUseDRIMacros : ownerUseDRIMacros}
            onclick={() => { if (activeMember) editingMemberUseDRIMacros = true; else ownerUseDRIMacros = true; }}
          >DRI <span class="default-badge">default</span></button>
          <button
            class="macro-mode-btn"
            class:active={activeMember ? !editingMemberUseDRIMacros : !ownerUseDRIMacros}
            onclick={() => { if (activeMember) editingMemberUseDRIMacros = false; else ownerUseDRIMacros = false; }}
          >Custom ratios</button>
        </div>

        {#if activeMember ? editingMemberUseDRIMacros : ownerUseDRIMacros}
          {@const mt = activeMember ? editingMemberDRITargets : ownerDRITargets}
          {#if mt}
            <div class="dri-macro-readonly">
              <div class="dri-macro-row"><span>🥩 Protein</span><strong>{mt.driRow.protein} g</strong></div>
              <div class="dri-macro-row"><span>🧈 Fats</span><strong>{mt.driRow.fat} g</strong></div>
              <div class="dri-macro-row"><span>🍞 Carbs</span><strong>{mt.driRow.carbohydrate} g</strong></div>
            </div>
            <p class="ratio-hint" style="margin-top:0.25rem">Values from DRI profile above. Switch to Custom to set your own ratios.</p>
          {/if}
        {:else}
          <button class="show-presets-link" onclick={() => showMacroHints = !showMacroHints}>
            {showMacroHints ? '▲ Hide presets' : '▾ Show ratio presets'}
          </button>
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
        {/if}
      </div>

      <!-- Plate Ratios — unaffected by DRI/Custom, available to everyone -->
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

      <div class="settings-actions">
        <button class="close-btn" onclick={closeSettings}>Done</button>
      </div>
      <div class="autosave-notice">✓ Changes save automatically</div>
      {/if}

      {#if settingsTab === 'sharing'}
      {#if !isAllin}
        <div class="settings-upgrade-wrap">
          <div class="upgrade-icon">👨‍👩‍👧</div>
          <h4>Household Sharing is an ALL·IN feature</h4>
          <p>Track nutrition for up to 3 additional family members, each with their own personalised DRI targets.</p>
          <ul class="upgrade-features">
            <li class="upgrade-feature">👤 Per-person DRI profiles (age, gender, activity level)</li>
            <li class="upgrade-feature">📊 Individual nutrient targets auto-calculated per member</li>
            <li class="upgrade-feature">🍽 Shared meal logging across household (coming soon)</li>
            <li class="upgrade-feature">🏠 Up to 4 people — $3.74/person at ALL·IN</li>
          </ul>
          <button class="upgrade-cta">Upgrade to ALL·IN — $14.95/mo</button>
        </div>
      {:else}
      <div class="settings-section">
        <h4>Household Members</h4>
        <p class="ratio-hint">Add family members to track their nutrition targets separately.</p>

        {#if householdMembers.length === 0 && !showAddMember}
          <div class="members-empty">
            <span class="members-empty-icon">👨‍👩‍👧</span>
            <p>No household members yet</p>
            <button class="add-member-btn" onclick={() => showAddMember = true}>+ Add Member</button>
          </div>
        {:else}
          <div class="members-list">
            {#each householdMembers as member, i}
              <div class="member-row">
                <div class="member-avatar" style="background-color: {member.color}">
                  {member.icon}
                </div>
                <div class="member-info">
                  <span class="member-name">{member.name}</span>
                  {#each [getMemberTargets(member)] as t}
                    {#if t}
                      <span class="member-meta">{member.groupage} · {member.age} · {t.kcal} kcal{t.kcalIsPersonalised ? '' : '*'}</span>
                    {:else}
                      <span class="member-meta">{member.groupage} · {member.age}</span>
                    {/if}
                  {/each}
                </div>
                <div class="member-row-actions">
                  <button class="member-btn" title="Edit" onclick={() => { switchToMember(member.id ?? ''); settingsTab = 'targets'; }}>✏️</button>
                  <button class="member-btn" onclick={async () => {
                    if (member.id) {
                      await fetch(`/api/household-members/${member.id}?player_id=${$playerStore.id}`, { method: 'DELETE' });
                      if (activeMemberId === member.id) await switchToMember('');
                      householdMembers = householdMembers.filter(m => m.id !== member.id);
                    } else {
                      householdMembers = householdMembers.filter((_, idx) => idx !== i);
                    }
                  }} title="Remove">🗑️</button>
                </div>
              </div>
            {/each}
            {#if !showAddMember}
              <button class="add-member-btn" onclick={() => showAddMember = true}>+ Add Member</button>
            {/if}
          </div>
        {/if}

        {#if showAddMember}
          <div class="add-member-form">
            <h5 class="form-heading">New Member</h5>
            <label class="member-label">
              Name
              <input type="text" bind:value={newMemberName} placeholder="e.g. Jake" class="member-input" maxlength="24" />
            </label>

            <div class="avatar-picker">
              <span class="picker-label">Avatar</span>
              <div class="icon-picker">
                {#each ['👦', '👧', '👨', '👩', '🧓', '👴', '👵', '👤'] as icon}
                  <button
                    class="icon-option"
                    class:selected={newMemberIcon === icon}
                    onclick={() => newMemberIcon = icon}
                  >{icon}</button>
                {/each}
              </div>
            </div>

            <div class="color-picker-row">
              <span class="picker-label">Colour</span>
              <div class="color-swatches">
                {#each ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#fb923c', '#94a3b8'] as color}
                  <button
                    class="color-swatch"
                    class:selected={newMemberColor === color}
                    style="background-color: {color}"
                    onclick={() => newMemberColor = color}
                    title={color}
                  ></button>
                {/each}
              </div>
            </div>

            <div class="profile-fields">
              <div class="profile-row">
                <label class="member-label half">
                  Group
                  <select
                    class="member-select"
                    value={newMemberGroupage}
                    onchange={(e) => {
                      newMemberGroupage = e.currentTarget.value;
                    }}
                  >
                    {#each MEMBER_GROUPS as g}
                      <option value={g}>{g}</option>
                    {/each}
                  </select>
                </label>
                <label class="member-label half">
                  Age
                  <input
                    type="number"
                    class="member-input-sm"
                    bind:value={newMemberAge}
                    min="0"
                    max="120"
                    placeholder="e.g. 10"
                  />
                </label>
              </div>

              <div class="profile-row">
                <label class="member-label half">
                  Height
                  <div class="input-unit-row">
                    <input type="number" bind:value={newMemberHeight} placeholder={newMemberHeightUnit === 'inches' ? '68' : '173'} min="20" max="300" class="member-input-sm" />
                    <select class="unit-select" bind:value={newMemberHeightUnit}>
                      <option value="inches">in</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </label>
                <label class="member-label half">
                  Weight
                  <div class="input-unit-row">
                    <input type="number" bind:value={newMemberWeight} placeholder={newMemberWeightUnit === 'pounds' ? '154' : '70'} min="5" max="500" class="member-input-sm" />
                    <select class="unit-select" bind:value={newMemberWeightUnit}>
                      <option value="pounds">lb</option>
                      <option value="kilos">kg</option>
                    </select>
                  </div>
                </label>
              </div>

              <label class="member-label">
                Activity Level
                <select class="member-select" bind:value={newMemberActivityLevel}>
                  {#each MEMBER_ACTIVITY_LEVELS as level}
                    <option value={level}>{level}</option>
                  {/each}
                </select>
              </label>
            </div>

            <div class="form-footer">
              {#if newMemberTargets}
                <div class="dri-preview">
                  <span class="dri-kcal">{newMemberTargets.kcal} kcal</span>
                  {#if newMemberTargets.kcalIsPersonalised}
                    <span class="dri-tag personalised">personalised</span>
                  {:else}
                    <span class="dri-tag population">DRI average</span>
                  {/if}
                </div>
              {/if}
              <div class="form-footer-btns">
              <button
                class="cancel-member-btn"
                onclick={() => {
                  showAddMember = false;
                  newMemberName = '';
                  newMemberIcon = '👤';
                  newMemberColor = '#60a5fa';
                  newMemberGroupage = 'Males';
                  newMemberAge = '';
                  newMemberHeight = '';
                  newMemberHeightUnit = 'inches';
                  newMemberWeight = '';
                  newMemberWeightUnit = 'pounds';
                  newMemberActivityLevel = 'Sedentary';
                }}
              >Cancel</button>
              <button
                class="save-member-btn"
                disabled={!newMemberName.trim()}
                onclick={async () => {
                  if (!newMemberName.trim()) return;
                  const newId = crypto.randomUUID();
                  const member = {
                    id: newId,
                    name: newMemberName.trim(),
                    icon: newMemberIcon,
                    color: newMemberColor,
                    groupage: newMemberGroupage,
                    age: newMemberAge,
                    height: newMemberHeight,
                    height_unit: newMemberHeightUnit,
                    weight: newMemberWeight,
                    weight_unit: newMemberWeightUnit,
                    activity_level: newMemberActivityLevel,
                  };
                  if ($playerStore.status === 'logged-in' && $playerStore.id) {
                    await fetch('/api/household-members', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ player_id: $playerStore.id, ...member }),
                    });
                    const res = await fetch(`/api/household-members?player_id=${$playerStore.id}`);
                    if (res.ok) householdMembers = await res.json();
                  } else {
                    householdMembers = [...householdMembers, member];
                  }
                  showAddMember = false;
                  newMemberName = '';
                  newMemberIcon = '👤';
                  newMemberColor = '#60a5fa';
                  newMemberGroupage = 'Males';
                  newMemberAge = '';
                  newMemberHeight = '';
                  newMemberHeightUnit = 'inches';
                  newMemberWeight = '';
                  newMemberWeightUnit = 'pounds';
                  newMemberActivityLevel = 'Sedentary';
                }}
              >Save Member</button>
              </div>
            </div>
          </div>
        {/if}
      </div>
      {/if}

      <div class="settings-actions">
        <button class="close-btn" onclick={closeSettings}>Done</button>
      </div>
      {/if}

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
      <FoodPicker recipeFoods={recipeFoods} on:select={handleFoodSelect} on:addCustom={handleAddCustomFood} />
    </div>

    <!-- Right: Pie chart + nutrient picker -->
    <div class="results-area">
      <PieChart />
      
      <!-- Nutrient bar chart (expandable) -->
      <NutrientPicker driRow={activeDRIRow} />
    </div>
    
    <!-- Today's Foods list (separate for grid positioning) -->
    <div class="foods-area">
      <div class="foods-columns-view">
        <MealColumns
          allUserIds={[$playerStore.id, ...householdMembers.filter(m => m.id).map(m => m.id)].filter((id): id is string => !!id)}
          householdMembers={householdMembers.filter(m => m.id).map(m => ({ id: m.id, name: m.name, icon: m.icon ?? '👤' }))}
        />
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
  .game-wrapper.scroll-locked { overflow: hidden; }

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

  .member-switcher {
    display: flex;
    align-items: center;
  }

  .member-select-pill {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 1rem;
    padding: 0.3rem 0.75rem;
    font-size: 0.85rem;
    cursor: pointer;
    appearance: auto;
  }

  .member-select-pill:focus {
    outline: none;
    border-color: rgba(255,255,255,0.6);
  }

  .member-select-pill option {
    background: #166534;
    color: white;
  }

  .dri-readonly-value {
    font-size: 1.1rem;
    padding: 0.4rem 0;
    color: #1e3a5f;
  }

  .dri-badge {
    display: inline-block;
    background: #166534;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.1rem 0.4rem;
    border-radius: 0.3rem;
    vertical-align: middle;
    margin-left: 0.3rem;
  }

  .dri-targets-preview {
    margin-top: 0.75rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.5rem;
    padding: 0.6rem 0.75rem;
  }

  .dri-preview-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .dri-kcal-big {
    font-size: 1.1rem;
    font-weight: 700;
    color: #166534;
  }

  .dri-two-col {
    display: flex;
    gap: 1.25rem;
    font-size: 0.85rem;
  }

  .dri-col-left,
  .dri-col-right {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
  }

  .dri-col-right {
    border-left: 1px solid #bbf7d0;
    padding-left: 1rem;
  }

  .dri-target-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.15rem 0;
  }

  .dri-target-row strong {
    color: #166534;
  }

  .save-dri-btn {
    margin-top: 0.75rem;
    width: 100%;
    padding: 0.5rem 1rem;
    background: #166534;
    color: white;
    border: none;
    border-radius: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  .save-dri-btn:hover {
    background: #14532d;
  }

  .nutrient-input.dri-readonly {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.5rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.4rem;
  }

  .nutrient-input.dri-readonly strong {
    margin-left: auto;
    font-size: 1rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-shrink: 0;
  }

  .new-game-btn {
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 0.5rem;
    background: rgba(255,255,255,0.2);
    color: white;
    cursor: pointer;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .new-game-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  /* Hamburger */
  .hamburger-wrap {
    position: relative;
  }

  .hamburger-btn {
    padding: 0.375rem 0.6rem;
    border: none;
    border-radius: 0.5rem;
    background: rgba(255,255,255,0.2);
    color: white;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
  }

  .hamburger-btn:hover {
    background: rgba(255,255,255,0.35);
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 199;
  }

  .menu-dropdown {
    position: absolute;
    top: calc(100% + 0.35rem);
    right: 0;
    background: white;
    border-radius: 0.6rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    min-width: 180px;
    padding: 0.35rem 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.55rem 1rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.9rem;
    color: #1a2e1a;
    white-space: nowrap;
  }

  .menu-item:hover {
    background: #f0fdf4;
  }

  .menu-item--locked {
    opacity: 0.65;
    cursor: default;
  }

  .menu-item--locked:hover {
    background: none;
  }

  .menu-tier-badge {
    margin-left: auto;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 0.3rem;
    background: #6d28d9;
    color: white;
    letter-spacing: 0.02em;
  }

  .menu-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.25rem 0;
  }

  .menu-account-name {
    padding: 0.35rem 0.85rem;
    font-size: 0.75rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .menu-account-tier {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7c3aed;
    background: #f3e8ff;
    border-radius: 4px;
    padding: 1px 5px;
  }

  .menu-item--logout {
    color: #dc2626;
  }

  .menu-item--logout:hover {
    background: #fef2f2;
    color: #b91c1c;
  }

  @media (max-width: 480px) {
    .game-header {
      flex-wrap: nowrap;
    }

    .game-header h1 {
      font-size: 1.1rem;
      flex: 1 1 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* New Game Confirmation Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 4.5rem;
    overflow: hidden;
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
    flex-shrink: 0;
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

  /* Notes dot indicator (used inside hamburger menu item) */
  .notes-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fbbf24;
    margin-left: 4px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  /* Notes Modal */
  .notes-modal {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    width: min(580px, 95vw);
    max-height: calc(100vh - 5.5rem);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .notes-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .notes-modal-header h3 {
    margin: 0;
    color: #7c3aed;
  }

  /* ── Upgrade prompts ─────────────────────────────────────────────────────── */
  .notes-upgrade, .settings-upgrade-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem 1rem;
    gap: 0.75rem;
  }

  .notes-upgrade .upgrade-icon, .settings-upgrade-wrap .upgrade-icon {
    font-size: 2.5rem;
    line-height: 1;
  }

  .notes-upgrade h4, .settings-upgrade-wrap h4 {
    margin: 0;
    font-size: 1.05rem;
    color: #111827;
  }

  .notes-upgrade p, .settings-upgrade-wrap p {
    margin: 0;
    font-size: 0.88rem;
    color: #6b7280;
    max-width: 320px;
    line-height: 1.5;
  }

  .upgrade-features {
    list-style: none;
    margin: 0.25rem 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    max-width: 300px;
  }

  .upgrade-feature {
    background: #f3f4f6;
    border-radius: 0.4rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
    color: #374151;
    text-align: left;
  }

  .upgrade-cta {
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.6rem 1.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .upgrade-cta:hover { background: #6d28d9; }

  .upgrade-skip {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0.25rem;
  }

  .upgrade-skip:hover { color: #6b7280; }

  .notes-tabs {
    display: flex;
    gap: 0.25rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
    padding: 0.2rem;
  }

  .notes-tab {
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    font-size: 0.85rem;
    cursor: pointer;
    color: #6b7280;
  }

  .notes-tab.active {
    background: white;
    color: #111827;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .notes-editor {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    overscroll-behavior: contain;
  }

  .notes-date-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .notes-save-for {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
    margin-right: 0.1rem;
  }

  .notes-quick-date {
    font-size: 0.8rem;
    padding: 0.25rem 0.65rem;
    border: 1.5px solid #d1d5db;
    border-radius: 99px;
    background: #fff;
    color: #374151;
    cursor: pointer;
    font-weight: 500;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    white-space: nowrap;
  }

  .notes-quick-date:hover {
    border-color: #6366f1;
    color: #6366f1;
  }

  .notes-quick-date.active {
    background: #6366f1;
    border-color: #6366f1;
    color: #fff;
  }

  .note-date-input {
    font-size: 0.8rem;
    border: 1.5px solid #d1d5db;
    border-radius: 99px;
    padding: 0.22rem 0.65rem;
    color: #374151;
    background: #fff;
    cursor: pointer;
    font-weight: 500;
    transition: border-color 0.15s;
  }

  .note-date-input:focus {
    outline: none;
    border-color: #6366f1;
  }

  .note-date-input.active {
    background: #6366f1;
    border-color: #6366f1;
    color: #fff;
    color-scheme: dark;
  }

  .notes-date-label {
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .sentiment-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sentiment-label {
    font-size: 0.85rem;
    color: #374151;
    margin-right: 0.25rem;
  }

  .sentiment-important {
    color: #e07b00;
    font-size: 0.75rem;
    font-style: italic;
    font-weight: 600;
    margin-left: 0.25rem;
  }

  .sentiment-btn {
    font-size: 1.4rem;
    background: none;
    border: 2px solid transparent;
    border-radius: 0.5rem;
    padding: 0.2rem 0.35rem;
    cursor: pointer;
    line-height: 1;
    opacity: 0.5;
    transition: opacity 0.15s, border-color 0.15s;
  }

  .sentiment-btn.selected {
    opacity: 1;
    border-color: #7c3aed;
  }

  .sentiment-btn:hover {
    opacity: 0.85;
  }

  .notes-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.6;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
  }

  .notes-textarea:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124,58,237,0.15);
  }

  .notes-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .save-note-btn {
    padding: 0.5rem 1.25rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .save-note-btn:hover:not(:disabled) {
    background: #6d28d9;
  }

  .save-note-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .delete-note-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    color: #ef4444;
    border: 1px solid #ef4444;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .delete-note-btn:hover:not(:disabled) {
    background: #fef2f2;
  }

  .delete-note-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Notes history view */
  .notes-history {
    flex: 1;
    overflow-y: auto;
    max-height: 55vh;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .notes-loading, .notes-empty {
    color: #6b7280;
    font-style: italic;
    font-size: 0.9rem;
    text-align: center;
    padding: 2rem 0;
  }

  .history-entry {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  .history-entry-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .history-date {
    font-size: 0.8rem;
    font-weight: 600;
    color: #7c3aed;
  }

  .history-sentiment {
    font-size: 1rem;
  }

  .history-entry-text {
    margin: 0;
    font-size: 0.85rem;
    color: #374151;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  /* Date picker row in history tab */
  .history-date-picker {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .history-pick-label {
    font-size: 0.8rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .history-pick-input {
    flex: 1;
    padding: 0.3rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    font-family: inherit;
    color: #111827;
  }

  .history-pick-input:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .history-pick-result {
    margin-bottom: 0.75rem;
  }

  .history-entry--picked {
    border-color: #7c3aed;
    background: #faf5ff;
  }

  .history-pick-empty {
    font-size: 0.85rem;
    color: #9ca3af;
    font-style: italic;
    margin: 0 0 0.5rem;
  }

  /* ── Symptom editor ── */
  .symptoms-added {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .symptom-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.45rem 0.6rem;
    background: #f9fafb;
  }

  .symptom-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }

  .symptom-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
  }

  .symptom-remove {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0 0.2rem;
    line-height: 1;
  }

  .symptom-remove:hover { color: #ef4444; }

  .symptom-severity-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .sev-label {
    font-size: 0.72rem;
    color: #9ca3af;
    white-space: nowrap;
  }

  .severity-slider {
    flex: 1;
    height: 4px;
    cursor: pointer;
    accent-color: #7c3aed;
  }

  .severity-value {
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    min-width: 2.75rem;
    text-align: right;
  }

  .sev-mild     { color: #16a34a; }
  .sev-moderate { color: #d97706; }
  .sev-severe   { color: #dc2626; }

  .symptoms-section {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    max-height: min(55vh, 420px);
  }

  .symptoms-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f9fafb;
    border: none;
    padding: 0.45rem 0.75rem;
    font-size: 0.82rem;
    color: #6b7280;
    cursor: pointer;
    text-align: left;
  }

  .symptoms-toggle:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .symptoms-arrow {
    display: inline-block;
    transform: rotate(-90deg);
    transition: transform 0.15s;
    font-size: 0.7rem;
    color: #9ca3af;
  }

  .symptoms-arrow.open { transform: rotate(0deg); }

  .symptoms-picker {
    padding: 0.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .symptom-section-heading {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #6b7280;
    padding: 0.35rem 0.25rem 0.1rem;
    margin-top: 0.2rem;
  }
  .symptom-section-heading:first-child { margin-top: 0; }
  .symptom-category { border-radius: 0.375rem; }

  .symptom-cat-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f3f4f6;
    border: none;
    padding: 0.32rem 0.6rem;
    font-size: 0.79rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    text-align: left;
  }

  .symptom-cat-header:hover { background: #e5e7eb; }

  .cat-arrow {
    font-size: 0.62rem;
    color: #9ca3af;
  }

  .symptom-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.28rem;
    padding: 0.35rem 0.4rem 0.45rem;
  }

  .symptom-chip {
    padding: 0.18rem 0.55rem;
    border: 1px solid #d1d5db;
    border-radius: 2rem;
    background: white;
    font-size: 0.74rem;
    color: #374151;
    cursor: pointer;
    white-space: nowrap;
  }

  .symptom-chip:hover {
    border-color: #7c3aed;
    color: #7c3aed;
  }

  .symptom-chip.added {
    background: #7c3aed;
    border-color: #7c3aed;
    color: white;
  }

  .custom-symptom-row {
    display: flex;
    gap: 0.4rem;
    padding: 0.4rem;
    border-top: 1px solid #f3f4f6;
    margin-top: 0.1rem;
  }

  .custom-symptom-input {
    flex: 1;
    padding: 0.28rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.79rem;
    font-family: inherit;
  }

  .custom-symptom-input:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .custom-symptom-add {
    padding: 0.28rem 0.65rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.79rem;
    cursor: pointer;
  }

  .custom-symptom-add:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* History symptom chips */
  .history-symptoms {
    display: flex;
    flex-wrap: wrap;
    gap: 0.28rem;
    margin-top: 0.4rem;
  }

  .history-symptom-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.14rem 0.45rem;
    border-radius: 2rem;
    font-size: 0.71rem;
    font-weight: 500;
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .history-symptom-chip.chip-mild     { background: #dcfce7; border-color: #86efac; color: #15803d; }
  .history-symptom-chip.chip-moderate { background: #fef3c7; border-color: #fcd34d; color: #b45309; }
  .history-symptom-chip.chip-severe   { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }

  .chip-sev {
    font-weight: 700;
    opacity: 0.75;
  }

  .history-divider {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0 0.75rem;
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .history-divider::before,
  .history-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
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

  .show-presets-link {
    background: none;
    border: none;
    padding: 0.25rem 0;
    margin: 0.4rem 0 0.1rem 0;
    font-size: 0.8rem;
    color: #16a34a;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    display: block;
  }

  .show-presets-link:hover {
    color: #15803d;
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

  /* ── Settings tabs ───────────────────────────────────── */
  .targets-owner-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #3b82f6;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 0.375rem;
    padding: 0.3rem 0.6rem;
    margin-bottom: 0.25rem;
    display: inline-block;
  }

  .settings-tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 0.25rem;
  }

  .settings-panel .settings-tab {
    flex: 1;
    padding: 0.45rem 0.75rem !important;
    background: transparent !important;
    color: #6b7280 !important;
    border: none !important;
    border-bottom: 3px solid transparent !important;
    border-radius: 0 !important;
    font-size: 0.85rem;
    cursor: pointer;
    margin-bottom: -2px;
    font-weight: 400;
    transition: color 0.15s, background 0.15s;
  }

  .settings-panel .settings-tab:hover {
    color: #374151 !important;
    background: #f3f4f6 !important;
  }

  .settings-panel .settings-tab.active {
    color: #3b82f6 !important;
    border-bottom-color: #3b82f6 !important;
    font-weight: 600;
    background: transparent !important;
  }

  /* ── Household member list ───────────────────────────── */
  .members-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    color: #9ca3af;
    font-size: 0.85rem;
    text-align: center;
  }

  .members-empty p {
    margin: 0;
  }

  .members-empty-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .settings-panel .add-member-btn {
    padding: 0.4rem 0.75rem !important;
    background: #3b82f6 !important;
    color: white !important;
    border: none !important;
    border-radius: 0.375rem !important;
    font-size: 0.8rem !important;
    cursor: pointer;
    margin-top: 0.25rem;
  }

  .settings-panel .add-member-btn:hover {
    background: #2563eb !important;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .member-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.6rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .member-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .member-name {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .member-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .member-meta {
    font-size: 0.7rem;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .member-row-actions {
    display: flex;
    gap: 0.25rem;
  }

  .settings-panel .member-btn {
    background: transparent !important;
    color: #6b7280 !important;
    border: none !important;
    padding: 0.2rem 0.35rem !important;
    font-size: 0.9rem !important;
    cursor: pointer;
    border-radius: 0.25rem !important;
    opacity: 0.7;
    transition: opacity 0.15s;
  }

  .settings-panel .member-btn:hover {
    opacity: 1;
    background: #f3f4f6 !important;
  }

  /* ── Add member form ─────────────────────────────────── */
  .add-member-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
  }

  .form-heading {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .member-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: #374151;
    font-weight: 500;
  }

  .member-input {
    padding: 0.4rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    width: 100%;
    box-sizing: border-box;
  }

  .member-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }

  .avatar-picker,
  .color-picker-row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .profile-fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.25rem;
    border-top: 1px solid #f3f4f6;
  }

  .profile-row {
    display: flex;
    gap: 0.5rem;
  }

  .member-label.half {
    flex: 1;
    min-width: 0;
  }

  .member-select {
    padding: 0.35rem 0.4rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.8rem;
    width: 100%;
    box-sizing: border-box;
    background: white;
  }

  .member-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }

  .input-unit-row {
    display: flex;
    gap: 0.3rem;
  }

  .member-input-sm {
    flex: 1;
    min-width: 0;
    padding: 0.35rem 0.4rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.8rem;
    box-sizing: border-box;
  }

  .member-input-sm:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }

  .unit-select {
    width: 3rem;
    padding: 0.35rem 0.2rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    background: #f9fafb;
    flex-shrink: 0;
  }

  .picker-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
  }

  .icon-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .settings-panel .icon-option {
    width: 2.2rem !important;
    height: 2.2rem !important;
    font-size: 1.2rem !important;
    background: #f3f4f6 !important;
    color: inherit !important;
    border: 2px solid transparent !important;
    border-radius: 0.375rem !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    transition: border-color 0.15s;
  }

  .settings-panel .icon-option.selected {
    border-color: #3b82f6 !important;
    background: #eff6ff !important;
  }

  .settings-panel .icon-option:hover {
    border-color: #93c5fd !important;
  }

  .color-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .settings-panel .color-swatch {
    width: 1.75rem !important;
    height: 1.75rem !important;
    border-radius: 50% !important;
    border: 3px solid transparent !important;
    cursor: pointer;
    padding: 0 !important;
    transition: transform 0.1s, border-color 0.15s;
  }

  .settings-panel .color-swatch:hover {
    transform: scale(1.15);
  }

  .settings-panel .color-swatch.selected {
    border-color: #1f2937 !important;
    transform: scale(1.1);
  }

  .form-footer {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding-top: 0.25rem;
  }

  .dri-preview {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.5rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.375rem;
  }

  .dri-kcal {
    font-size: 0.8rem;
    font-weight: 600;
    color: #166534;
  }

  .dri-tag {
    font-size: 0.65rem;
    padding: 0.1rem 0.35rem;
    border-radius: 99px;
    font-weight: 500;
  }

  .dri-tag.personalised {
    background: #dcfce7;
    color: #15803d;
  }

  .dri-tag.population {
    background: #fef9c3;
    color: #854d0e;
  }

  .dri-tag.custom {
    background: #fff7ed;
    color: #c2410c;
    border: 1px solid #fed7aa;
    border-radius: 4px;
  }

  .dri-kcal-edit {
    display: flex;
    align-items: baseline;
    gap: 0.3rem;
  }

  .dri-kcal-input {
    width: 5rem;
    font-size: 1.6rem;
    font-weight: 700;
    color: #166534;
    border: none;
    border-bottom: 2px solid #bbf7d0;
    background: transparent;
    outline: none;
    padding: 0;
    text-align: right;
    appearance: textfield;
  }

  .dri-kcal-input:focus {
    border-bottom-color: #16a34a;
  }

  .kcal-unit {
    font-size: 0.9rem;
    font-weight: 600;
    color: #166534;
  }

  .dri-editable-wrap {
    display: inline-flex;
    align-items: baseline;
    gap: 0.2rem;
  }

  .dri-inline-input {
    width: 3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #166534;
    border: none;
    border-bottom: 1.5px solid #bbf7d0;
    background: transparent;
    outline: none;
    padding: 0;
    text-align: right;
    appearance: textfield;
  }

  .dri-inline-input:focus {
    border-bottom-color: #16a34a;
  }

  .dri-unit {
    font-size: 0.78rem;
    color: #6b7280;
  }

  .dri-reset-btn {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0 0.1rem;
    line-height: 1;
  }

  .dri-reset-btn:hover {
    color: #6b7280;
  }

  .macro-source-label {
    font-size: 0.78rem;
    color: #6b7280;
    margin: 0 0 0.4rem 0;
    font-style: italic;
  }

  .macro-mode-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 0.75rem;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #d1d5db;
    width: fit-content;
  }

  .macro-mode-btn {
    padding: 0.25rem 0.85rem;
    font-size: 0.78rem;
    font-weight: 500;
    background: #f9fafb;
    color: #6b7280;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .macro-mode-btn.active {
    background: #1d4ed8;
    color: #fff;
  }

  .default-badge {
    font-size: 0.65rem;
    font-weight: 400;
    opacity: 0.75;
    margin-left: 0.2rem;
    vertical-align: middle;
  }

  .macro-mode-btn.active .default-badge {
    opacity: 0.85;
  }

  .dri-macro-readonly {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
  }

  .dri-macro-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 0.3rem 0.7rem;
    font-size: 0.78rem;
    gap: 0.1rem;
  }

  .dri-macro-row strong {
    font-size: 0.9rem;
    color: #15803d;
  }

  .field-missing {
    border-color: #f59e0b !important;
    background: #fffbeb;
  }

  .missing-fields-hint {
    font-size: 0.72rem;
    color: #92400e;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem 0 0;
  }

  .form-footer-btns {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .settings-panel .cancel-member-btn {
    padding: 0.4rem 0.75rem !important;
    background: #f3f4f6 !important;
    color: #374151 !important;
    border: 1px solid #d1d5db !important;
    border-radius: 0.375rem !important;
    font-size: 0.8rem !important;
    cursor: pointer;
  }

  .settings-panel .cancel-member-btn:hover {
    background: #e5e7eb !important;
  }

  .settings-panel .save-member-btn {
    padding: 0.4rem 0.75rem !important;
    background: #10b981 !important;
    color: white !important;
    border: none !important;
    border-radius: 0.375rem !important;
    font-size: 0.8rem !important;
    cursor: pointer;
  }

  .settings-panel .save-member-btn:hover:not(:disabled) {
    background: #059669 !important;
  }

  .settings-panel .save-member-btn:disabled {
    background: #d1fae5 !important;
    color: #6ee7b7 !important;
    cursor: not-allowed;
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
