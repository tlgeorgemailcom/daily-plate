<script lang="ts">
  import { addedFoods, removeFood, moveFoodToMeal, updateFoodQuantity, meals, addFood, type AddedFood } from '$lib/stores/gameStore';
  import { playerStore } from '$lib/stores/playerStore';
  import { FOODS } from '$lib/data/food-portions';

  // All user IDs to include in meal history (owner + household members)
  let { allUserIds = [], householdMembers = [] }: {
    allUserIds: string[];
    householdMembers: Array<{ id: string; name: string; icon: string; color?: string }>;
  } = $props();
  import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  let foods = $derived($addedFoods);
  let mealSlots = $derived($meals);
  
  // Track which meal name is being edited

  
  // Track which food is being quantity-edited
  let editingFoodId = $state<string | null>(null);
  let editingGrams = $state<number>(100);
  
  // For dnd - we need mutable local copies per meal
  let mealFoodsMap = $state<Record<string, AddedFood[]>>({});
  
  // ── Meal History per Slot ──────────────────────────────────────────────────
  interface HistoryEntry {
    food_id: string; food_name: string; quantity_grams: number;
    kcal: number; protein: number; carbohydrate: number; fat: number;
    serving_description: string | null;
  }
  interface HistoryDay { meal_date: string; entries: HistoryEntry[]; total_kcal: number; }
  let historyMealId    = $state<string | null>(null);
  let historyDays      = $state<HistoryDay[]>([]);
  let historyLoading   = $state(false);
  let historyConfirm   = $state<HistoryDay | null>(null);  // awaiting confirmation

  async function openHistory(mealId: string) {
    const playerId = $playerStore.id;
    if (!playerId) return;
    historyMealId = mealId;
    historyDays = [];
    historyLoading = true;
    historyConfirm = null;

    // Use allUserIds if household members are present, otherwise just the owner
    const userIds = allUserIds.length > 0 ? allUserIds : [playerId];

    try {
      // Fetch history for all household members in parallel
      const allResults = await Promise.all(
        userIds.map(uid =>
          fetch(`/api/meal-log?user_id=${encodeURIComponent(uid)}&category=${encodeURIComponent(mealId)}&history=true&limit=30`)
            .then(r => r.ok ? r.json() : { days: [] })
            .then((d: { days?: HistoryDay[] }) => d.days ?? [])
        )
      );

      // Merge by date — union of entries, deduplicated by food_id
      const dayMap = new Map<string, HistoryDay>();
      for (const days of allResults) {
        for (const day of days) {
          if (!dayMap.has(day.meal_date)) {
            dayMap.set(day.meal_date, { meal_date: day.meal_date, entries: [], total_kcal: 0 });
          }
          const merged = dayMap.get(day.meal_date)!;
          for (const entry of day.entries) {
            if (!merged.entries.some(e => e.food_id === entry.food_id)) {
              merged.entries.push(entry);
              merged.total_kcal += entry.kcal;
            }
          }
        }
      }

      historyDays = Array.from(dayMap.values())
        .sort((a, b) => b.meal_date.localeCompare(a.meal_date));
    } finally {
      historyLoading = false;
    }
  }

  function closeHistory() { historyMealId = null; historyConfirm = null; }

  function requestLoad(day: HistoryDay) {
    const currentFoods = getFoodsForMeal(historyMealId!);
    if (currentFoods.length > 0) {
      historyConfirm = day;   // ask before replacing
    } else {
      applyHistoryDay(day);
    }
  }

  function applyHistoryDay(day: HistoryDay) {
    const targetMealId = historyMealId!;
    // Remove current foods in this slot
    for (const f of getFoodsForMeal(targetMealId)) removeFood(f.id);
    // Add foods from the history day
    for (const entry of day.entries) {
      const food = FOODS.find(f => f.ndb === entry.food_id);
      if (food) {
        // Use portions[0] (custom 100g base) with customGrams for exact reproduction
        addFood(food, food.portions[0], targetMealId, entry.quantity_grams);
      }
    }
    closeHistory();
  }

  // ── Saved Day Plans ────────────────────────────────────────────────────────
  interface TemplateEntry {
    food_id: string; food_name: string; quantity_grams: number;
    kcal: number; protein: number; carbohydrate: number; fat: number;
    serving_description: string;
  }
  interface TemplateMealData { [slotId: string]: TemplateEntry[] }
  interface MealTemplate {
    id: string; name: string; description?: string | null;
    meal_data: string; total_kcal: number;
    saved_from_date?: string | null; scheduled_for_date?: string | null;
    created_at: string; updated_at: string;
  }

  let showSaveModal       = $state(false);
  let saveName            = $state('');
  let saveScheduledDate   = $state('');   // optional future date to schedule this plan
  let saveError           = $state('');
  let savePending         = $state(false);

  let showLoadModal       = $state(false);
  let templateList        = $state<MealTemplate[]>([]);
  let templatesLoading    = $state(false);
  let loadConfirm         = $state<MealTemplate | null>(null);
  let deleteConfirm       = $state<string | null>(null);
  let templateSearch      = $state('');
  let previewTemplate     = $state<MealTemplate | null>(null);

  // Scheduled plan for today — shown as a banner when found on login
  let scheduledPlan       = $state<MealTemplate | null>(null);
  let scheduledDismissed  = $state(false);

  const SLOT_ORDER = ['breakfast','beverage','lunch','dinner','snack'] as const;
  const SLOT_LABELS: Record<string, string> = {
    breakfast: '🍳 Bkfst', beverage: '🥤 Bev', lunch: '🥗 Lunch',
    dinner: '🍽 Dinner', snack: '🍎 Snack',
  };
  const filteredTemplates = $derived(
    templateSearch.trim()
      ? templateList.filter(t => t.name.toLowerCase().includes(templateSearch.trim().toLowerCase()))
      : templateList
  );

  // Check for a meal plan scheduled for today on player login
  $effect(() => {
    const playerId = $playerStore.id;
    if (!playerId || scheduledDismissed || scheduledPlan) return;
    const today = new Date().toISOString().split('T')[0];
    (async () => {
      try {
        const res = await fetch(`/api/meal-templates?user_id=${encodeURIComponent(playerId)}&scheduled_for=${today}`);
        if (res.ok) {
          const data = await res.json();
          if (data.template) scheduledPlan = data.template;
        }
      } catch { /* silent */ }
    })();
  });

  function getPreviewSlots(t: MealTemplate) {
    try {
      const data: TemplateMealData = JSON.parse(t.meal_data);
      return SLOT_ORDER
        .filter(slot => (data[slot]?.length ?? 0) > 0)
        .map(slot => ({
          label: SLOT_LABELS[slot] ?? slot,
          foods: (data[slot] ?? []).map(e => e.food_name).join(', '),
          kcal: Math.round((data[slot] ?? []).reduce((s, e) => s + e.kcal, 0)),
        }));
    } catch { return []; }
  }

  function openSaveModal() {
    saveName = '';
    saveScheduledDate = '';
    saveError = '';
    showSaveModal = true;
  }

  async function saveDay() {
    const playerId = $playerStore.id;
    if (!playerId) return;
    if (!saveName.trim()) { saveError = 'Please enter a name'; return; }
    savePending = true;
    saveError = '';

    const mealData: TemplateMealData = {};
    let totalKcal = 0;
    for (const slot of mealSlots) {
      const slotFoods = getFoodsForMeal(slot.id);
      mealData[slot.id] = slotFoods.map(f => {
        const grams = f.customGrams ?? Math.round(f.portion.gm * (f.multiplier ?? 1));
        totalKcal += f.calories;
        return {
          food_id: f.food.ndb,
          food_name: f.food.display,
          quantity_grams: grams,
          kcal: Math.round(f.calories),
          protein: f.food.pro * grams / 100,
          carbohydrate: f.food.carb * grams / 100,
          fat: f.food.fat * grams / 100,
          serving_description: f.portion.desc,
        };
      });
    }

    try {
      const res = await fetch('/api/meal-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          user_id: playerId,
          name: saveName.trim(),
          meal_data: JSON.stringify(mealData),
          total_kcal: Math.round(totalKcal),
          saved_from_date: new Date().toISOString().split('T')[0],
          scheduled_for_date: saveScheduledDate || null,
        }),
      });
      if (!res.ok) { saveError = 'Save failed — try again'; }
      else { showSaveModal = false; }
    } catch {
      saveError = 'Connection error';
    } finally {
      savePending = false;
    }
  }

  async function openLoadModal() {
    const playerId = $playerStore.id;
    if (!playerId) return;
    showLoadModal = true;
    loadConfirm = null;
    deleteConfirm = null;
    templateSearch = '';
    previewTemplate = null;
    templatesLoading = true;
    try {
      const res = await fetch(`/api/meal-templates?user_id=${encodeURIComponent(playerId)}`);
      if (res.ok) {
        const data = await res.json();
        templateList = data.templates ?? [];
      }
    } finally {
      templatesLoading = false;
    }
  }

  function requestLoadTemplate(t: MealTemplate) {
    if (foods.length > 0) {
      loadConfirm = t;
    } else {
      applyTemplate(t);
    }
  }

  function applyTemplate(t: MealTemplate) {
    const mealData: TemplateMealData = JSON.parse(t.meal_data);
    // Clear all current foods
    for (const f of [...foods]) removeFood(f.id);
    // Re-populate from template
    for (const [slotId, entries] of Object.entries(mealData)) {
      for (const entry of entries) {
        const food = FOODS.find(f => f.ndb === entry.food_id);
        if (food) addFood(food, food.portions[0], slotId, entry.quantity_grams);
      }
    }
    showLoadModal = false;
    loadConfirm = null;
  }

  async function deleteTemplate(id: string) {
    const playerId = $playerStore.id;
    if (!playerId) return;
    await fetch(`/api/meal-templates?user_id=${encodeURIComponent(playerId)}&id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    templateList = templateList.filter(t => t.id !== id);
    deleteConfirm = null;
  }

  // ── Shared helpers ─────────────────────────────────────────────────────────
  // Sync from store to local state when foods change
  $effect(() => {
    const newMap: Record<string, AddedFood[]> = {};
    for (const mealId of mealSlots.map(m => m.id)) {
      newMap[mealId] = foods.filter(f => f.mealId === mealId);
    }
    mealFoodsMap = newMap;
  });

  function getFoodsForMeal(mealId: string) {
    return mealFoodsMap[mealId] || [];
  }
  
  function getMealTotal(mealId: string) {
    return getFoodsForMeal(mealId).reduce((sum, f) => sum + f.calories, 0);
  }
  
  function handleDndConsider(mealId: string, e: CustomEvent<{ items: AddedFood[] }>) {
    mealFoodsMap[mealId] = e.detail.items;
  }
  
  function handleDndFinalize(mealId: string, e: CustomEvent<{ items: AddedFood[] }>) {
    const { items } = e.detail;
    mealFoodsMap[mealId] = items;
    for (const item of items) {
      if (item.id !== SHADOW_PLACEHOLDER_ITEM_ID && item.mealId !== mealId) {
        moveFoodToMeal(item.id, mealId);
      }
    }
  }
  
  const flipDurationMs = 200;

  function formatName(word: string): string {
    return word.charAt(0) + word.slice(1).toLowerCase();
  }
  
  function startQuantityEdit(foodId: string, currentGrams: number) {
    editingFoodId = foodId;
    editingGrams = currentGrams;
  }
  
  function getGramsForFood(item: typeof foods[0]): number {
    if (item.customGrams) return item.customGrams;
    const mult = item.multiplier || 1;
    return Math.round(item.portion.gm * mult);
  }
  
  function saveQuantityEdit() {
    if (editingFoodId && editingGrams > 0) {
      updateFoodQuantity(editingFoodId, undefined, editingGrams);
    }
    editingFoodId = null;
    editingGrams = 100;
  }
  
  function cancelQuantityEdit() {
    editingFoodId = null;
    editingGrams = 100;
  }
  
  function handleQuantityKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveQuantityEdit();
    if (e.key === 'Escape') cancelQuantityEdit();
  }

  function formatDate(iso: string) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatSavedAt(isoDatetime: string) {
    const d = new Date(isoDatetime);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${date} at ${time}`;
  }

  const isLoggedIn = $derived($playerStore.status === 'logged-in');
  const isPlus = $derived(isLoggedIn && ['plus', 'allin', 'premium', 'moderator'].includes($playerStore.tier));
  const isAllin = $derived(isLoggedIn && ['allin', 'premium', 'moderator'].includes($playerStore.tier));

  // ── Phase 2: Share meal slot to household members ─────────────────────────
  // shareOpenMealId: which slot's share popover is currently open
  // sharingMealId:   which slot is actively being shared (shows spinner)
  // sharedSlots:     Set of "mealId|memberId" pairs shared this session (for avatar indicators)
  let shareOpenMealId = $state<string | null>(null);
  let sharingMealId   = $state<string | null>(null);
  let sharedSlots     = $state<Set<string>>(new Set());

  // Close share popover on any outside click
  function handleDocClick() { if (shareOpenMealId) shareOpenMealId = null; }

  function toggleSharePopover(mealId: string) {
    shareOpenMealId = shareOpenMealId === mealId ? null : mealId;
  }

  async function shareMealSlot(mealId: string, memberId: string, memberName: string) {
    const playerId = $playerStore.id;
    if (!playerId) return;

    const foods = getFoodsForMeal(mealId);
    if (foods.length === 0) return;

    sharingMealId = mealId;
    const today = new Date().toISOString().split('T')[0];

    // Build entries the same way saveMealLog does, but scoped to this slot only
    const entries = foods.map(af => {
      const grams = af.customGrams ?? af.portion.gm * (af.multiplier ?? 1);
      return {
        id: af.id,
        meal_category: mealId,
        food_id: af.food.ndb,
        food_name: af.food.display,
        brand_name: null,
        quantity_grams: grams,
        serving_description: af.portion.desc,
        kcal: 0, protein: 0, carbohydrate: 0, fat: 0,
        sugar: 0, fiber: 0, water: 0, sodium: 0,
        source: 'web',
        logged_at: new Date().toISOString(),
      };
    });

    try {
      // GET member's existing log so we don't wipe their other slots
      const getRes = await fetch(`/api/meal-log?user_id=${encodeURIComponent(memberId)}&date=${today}`);
      const existing: { id: string; meal_category: string; food_id: string; food_name: string;
        quantity_grams: number; serving_description: string | null; kcal: number;
        protein: number; carbohydrate: number; fat: number; sugar: number;
        fiber: number; water: number; sodium: number; source: string; logged_at: string }[] =
        getRes.ok ? ((await getRes.json()).rows ?? []) : [];

      // Replace only this meal slot's entries; keep all other slots intact
      const otherSlots = existing.filter(e => e.meal_category !== mealId);
      const merged = [...otherSlots, ...entries];

      await fetch('/api/meal-log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: memberId, meal_date: today, entries: merged }),
      });

      sharedSlots = new Set([...sharedSlots, `${mealId}|${memberId}`]);
    } catch (e) {
      console.error('[Share] Failed to share meal slot:', e);
    } finally {
      sharingMealId = null;
    }
  }
</script>

<!-- ═══════════════════ MAIN LAYOUT ═══════════════════ -->
<div class="meal-columns-container" onclick={handleDocClick}>
  <div class="meal-columns-header">
    <h3>Today's Foods</h3>
    <div class="header-actions">
      {#if isLoggedIn}
        <button class="action-btn" title="Save today's day as a template" onclick={openSaveModal}>
          💾 Save Day
        </button>
        <button class="action-btn" title="Load a saved day plan" onclick={openLoadModal}>
          📂 Load Day
        </button>
      {/if}
      <span class="total-count">{foods.length} items</span>
    </div>
  </div>

  {#if scheduledPlan && !scheduledDismissed}
    <div class="mc-scheduled-banner">
      <span class="mc-scheduled-icon">📅</span>
      <span class="mc-scheduled-text">
        You have a planned meal for today: <strong>{scheduledPlan.name}</strong>
        ({Math.round(scheduledPlan.total_kcal)} cal)
      </span>
      <button class="mc-scheduled-load" onclick={() => { requestLoadTemplate(scheduledPlan!); scheduledDismissed = true; }}>
        Load it
      </button>
      <button class="mc-scheduled-dismiss" onclick={() => scheduledDismissed = true} aria-label="Dismiss">×</button>
    </div>
  {/if}

  <div class="meal-columns">
    {#each mealSlots as meal}
      {@const mealFoods = getFoodsForMeal(meal.id)}
      {@const mealTotal = getMealTotal(meal.id)}
      
      <div class="meal-column">
        <!-- Meal Header -->
        <div class="column-header">
            {#if isLoggedIn}
              <button class="history-btn" title="Meal history" onclick={() => openHistory(meal.id)}>🕐</button>
            {/if}
            <span class="meal-name">{meal.name}</span>
            {#if householdMembers.length > 0}
              <div class="share-wrap">
                <button
                  class="share-btn{shareOpenMealId === meal.id ? ' share-btn--open' : ''}"
                  title="Share this meal with a household member"
                  onclick={(e) => { e.stopPropagation(); toggleSharePopover(meal.id); }}
                  disabled={sharingMealId === meal.id}
                >{sharingMealId === meal.id ? '⏳' : '👥'}</button>
                <!-- Avatar indicators: filled = already shared this session -->
                <span class="share-indicators">
                  {#each householdMembers as m (m.id)}
                    <span
                      class="share-avatar{sharedSlots.has(`${meal.id}|${m.id}`) ? ' share-avatar--shared' : ' share-avatar--unshared'}"
                      title={sharedSlots.has(`${meal.id}|${m.id}`) ? `Shared with ${m.name}` : m.name}
                    >{m.icon}</span>
                  {/each}
                </span>
                <!-- Popover anchored inside share-wrap so position:absolute works correctly -->
                {#if shareOpenMealId === meal.id && isAllin && householdMembers.length > 0}
                  <div class="share-popover" role="menu">
                    <p class="share-popover-title">Share {meal.name} with:</p>
                    {#each householdMembers as m (m.id)}
                      <button
                        class="share-member-btn{sharedSlots.has(`${meal.id}|${m.id}`) ? ' share-member-btn--done' : ''}"
                        onclick={() => { shareMealSlot(meal.id, m.id, m.name); shareOpenMealId = null; }}
                        disabled={getFoodsForMeal(meal.id).length === 0}
                      >
                        <span class="share-member-icon">{m.icon}</span>
                        <span>{m.name}</span>
                        {#if sharedSlots.has(`${meal.id}|${m.id}`)}<span class="share-check">✓</span>{/if}
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
        </div>
        <!-- Foods List with DnD -->
        <div 
          class="column-foods"
          use:dndzone={{ 
            items: mealFoods, 
            flipDurationMs,
            dropTargetStyle: { outline: '2px dashed #3b82f6', background: '#eff6ff' }
          }}
          onconsider={(e) => handleDndConsider(meal.id, e)}
          onfinalize={(e) => handleDndFinalize(meal.id, e)}
        >
          {#each mealFoods as item (item.id)}
            <div 
              class="food-row"
              animate:flip={{ duration: flipDurationMs }}
            >
              <span class="drag-handle">⋮⋮</span>
              <div class="food-info">
                <span class="food-name" title={item.food.word}>{formatName(item.food.word)}</span>
                {#if editingFoodId === item.id}
                  <span class="food-qty">
                    <input 
                      type="number"
                      class="quantity-input"
                      min="1"
                      max="2000"
                      step="1"
                      bind:value={editingGrams}
                      onblur={saveQuantityEdit}
                      onkeydown={handleQuantityKeydown}
                      onclick={(e) => e.stopPropagation()}
                      autofocus
                    />g
                  </span>
                {:else}
                  <span class="food-qty" onclick={() => startQuantityEdit(item.id, getGramsForFood(item))} title="Click to edit">
                    {getGramsForFood(item)}g
                  </span>
                {/if}
              </div>
              <span class="food-cal">{Math.round(item.calories)}</span>
              <button class="remove-btn" onclick={() => removeFood(item.id)}>×</button>
            </div>
          {/each}
        </div>
        
        <!-- Meal Total -->
        <div class="column-total">
          {Math.round(mealTotal)} cal
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- ═══════════════════ MEAL HISTORY MODAL ═══════════════════ -->
{#if historyMealId}
  <div class="mc-backdrop" onclick={closeHistory} role="dialog" aria-modal="true" aria-label="Meal history">
    <div class="mc-modal" onclick={(e) => e.stopPropagation()}>
      <div class="mc-modal-header">
        <span class="mc-modal-title">
          🕐 {mealSlots.find(m => m.id === historyMealId)?.name ?? historyMealId} History
        </span>
        <button class="mc-close" onclick={closeHistory}>×</button>
      </div>

      {#if historyConfirm}
        <div class="mc-confirm">
          <p>Replace current {mealSlots.find(m => m.id === historyMealId)?.name} with {formatDate(historyConfirm.meal_date)}?</p>
          <div class="mc-confirm-btns">
            <button class="mc-btn mc-btn--primary" onclick={() => { applyHistoryDay(historyConfirm!); historyConfirm = null; }}>Replace</button>
            <button class="mc-btn" onclick={() => historyConfirm = null}>Keep current</button>
          </div>
        </div>
      {:else if historyLoading}
        <div class="mc-empty">Loading…</div>
      {:else if historyDays.length === 0}
        <div class="mc-empty">No history yet — meals are saved as you log them.</div>
      {:else}
        <div class="mc-list">
          {#each historyDays as day}
            <button class="mc-day-row" onclick={() => requestLoad(day)}>
              <span class="mc-day-date">{formatDate(day.meal_date)}</span>
              <span class="mc-day-foods">
                {day.entries.map(e => e.food_name).join(', ')}
              </span>
              <span class="mc-day-kcal">{Math.round(day.total_kcal)} cal</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- ═══════════════════ SAVE DAY MODAL ═══════════════════ -->
{#if showSaveModal}
  <div class="mc-backdrop" onclick={() => showSaveModal = false} role="dialog" aria-modal="true" aria-label="Save day plan">
    <div class="mc-modal mc-modal--narrow" onclick={(e) => e.stopPropagation()}>
      <div class="mc-modal-header">
        <span class="mc-modal-title">💾 Save Day As…</span>
        <button class="mc-close" onclick={() => showSaveModal = false}>×</button>
      </div>
      <div class="mc-body">
        {#if !isPlus}
          <div class="mc-upgrade">
            <div class="upgrade-icon">💾</div>
            <h4>Saved Day Plans is a Plus feature</h4>
            <p>Save named day plans you can reload any day, with optional scheduling to a future date.</p>
            <ul class="upgrade-features">
              <li class="upgrade-feature">📅 Schedule plans for specific dates</li>
              <li class="upgrade-feature">🔔 Banner reminder on the scheduled day</li>
              <li class="upgrade-feature">📂 Unlimited saved plan templates</li>
            </ul>
            <button class="upgrade-cta">Upgrade to Plus — $4.95/mo</button>
            <button class="upgrade-skip" onclick={() => showSaveModal = false}>Maybe later</button>
          </div>
        {:else}
        <p class="mc-save-hint">Save today's full meal plan as a named template you can reload any day.</p>
        <input
          type="text"
          class="mc-name-input"
          placeholder="e.g. High Protein Saturday"
          maxlength="60"
          bind:value={saveName}
          onkeydown={(e) => { if (e.key === 'Enter') saveDay(); if (e.key === 'Escape') showSaveModal = false; }}
          autofocus
        />
        <label class="mc-date-label">
          📅 Plan this meal for a specific date <span class="mc-date-hint">(optional)</span>
          <input
            type="date"
            class="mc-date-input"
            bind:value={saveScheduledDate}
            min={new Date().toISOString().split('T')[0]}
          />
        </label>
        {#if saveError}
          <p class="mc-error">{saveError}</p>
        {/if}
        <div class="mc-modal-footer">
          <button class="mc-btn mc-btn--primary" onclick={saveDay} disabled={savePending}>
            {savePending ? 'Saving…' : 'Save'}
          </button>
          <button class="mc-btn" onclick={() => showSaveModal = false}>Cancel</button>
        </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- ═══════════════════ LOAD DAY MODAL ═══════════════════ -->
{#if showLoadModal}
  <div class="mc-backdrop" onclick={() => { showLoadModal = false; loadConfirm = null; deleteConfirm = null; previewTemplate = null; }} role="dialog" aria-modal="true" aria-label="Load saved day">
    <div class="mc-modal" onclick={(e) => e.stopPropagation()}>
      <div class="mc-modal-header">
        <span class="mc-modal-title">📂 Saved Day Plans</span>
        <button class="mc-close" onclick={() => showLoadModal = false}>×</button>
      </div>

      {#if !isPlus}
        <div class="mc-upgrade">
          <div class="upgrade-icon">📂</div>
          <h4>Saved Day Plans is a Plus feature</h4>
          <p>Save named day plans you can reload any day, with optional scheduling to a future date.</p>
          <ul class="upgrade-features">
            <li class="upgrade-feature">📅 Schedule plans for specific dates</li>
            <li class="upgrade-feature">🔔 Banner reminder on the scheduled day</li>
            <li class="upgrade-feature">📂 Unlimited saved plan templates</li>
          </ul>
          <button class="upgrade-cta">Upgrade to Plus — $4.95/mo</button>
          <button class="upgrade-skip" onclick={() => showLoadModal = false}>Maybe later</button>
        </div>
      {:else if loadConfirm}
        <div class="mc-confirm">
          <p>Load "<strong>{loadConfirm.name}</strong>"? This will replace all current foods.</p>
          <div class="mc-confirm-btns">
            <button class="mc-btn mc-btn--primary" onclick={() => applyTemplate(loadConfirm!)}>Load</button>
            <button class="mc-btn" onclick={() => loadConfirm = null}>Cancel</button>
          </div>
        </div>
      {:else if previewTemplate}
        <div class="mc-preview">
          <div class="mc-preview-header">
            <span class="mc-preview-name">{previewTemplate.name}</span>
            <span class="mc-preview-meta">
              {Math.round(previewTemplate.total_kcal)} cal total · saved {formatSavedAt(previewTemplate.updated_at)}
              {#if previewTemplate.scheduled_for_date}
                · <strong>📅 Planned for {formatDate(previewTemplate.scheduled_for_date)}</strong>
              {/if}
            </span>
          </div>
          <div class="mc-preview-slots">
            {#each getPreviewSlots(previewTemplate) as slot}
              <div class="mc-preview-slot">
                <span class="mc-preview-slot-label">{slot.label}</span>
                <span class="mc-preview-slot-foods">{slot.foods}</span>
                <span class="mc-preview-slot-kcal">{slot.kcal} cal</span>
              </div>
            {/each}
          </div>
          <div class="mc-confirm-btns">
            <button class="mc-btn mc-btn--primary" onclick={() => { requestLoadTemplate(previewTemplate!); previewTemplate = null; }}>Load this plan</button>
            <button class="mc-btn" onclick={() => previewTemplate = null}>← Back</button>
          </div>
        </div>
      {:else if deleteConfirm}
        <div class="mc-confirm">
          <p>Delete this plan? This cannot be undone.</p>
          <div class="mc-confirm-btns">
            <button class="mc-btn mc-btn--danger" onclick={() => deleteTemplate(deleteConfirm!)}>Delete</button>
            <button class="mc-btn" onclick={() => deleteConfirm = null}>Cancel</button>
          </div>
        </div>
      {:else if templatesLoading}
        <div class="mc-empty">Loading…</div>
      {:else if templateList.length === 0}
        <div class="mc-empty">No saved plans yet — use "Save Day" to create one.</div>
      {:else}
        <div class="mc-search-wrap">
          <input
            type="search"
            class="mc-search-input"
            placeholder="Search plans…"
            bind:value={templateSearch}
          />
        </div>
        <div class="mc-list">
          {#each filteredTemplates as t}
            <div class="mc-template-row">
              <button class="mc-template-info" onclick={() => previewTemplate = t}>
                <span class="mc-template-name">{t.name}</span>
                <span class="mc-template-meta">
                  {Math.round(t.total_kcal)} cal · saved {formatSavedAt(t.updated_at)}
                  {#if t.scheduled_for_date}
                    <span class="mc-scheduled-badge">📅 {formatDate(t.scheduled_for_date)}</span>
                  {/if}
                </span>
              </button>
              <button class="mc-delete-btn" title="Delete" onclick={() => deleteConfirm = t.id}>🗑</button>
            </div>
          {:else}
            <div class="mc-empty" style="padding:0.75rem 1rem">No plans match "{templateSearch}"</div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .meal-columns-container {
    background: #f9fafb;
    border-radius: 0.75rem;
    padding: 0.75rem;
  }

  .meal-columns-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0 0.25rem;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .meal-columns-header h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .action-btn {
    font-size: 0.65rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.125rem 0.4rem;
    cursor: pointer;
    color: #374151;
    white-space: nowrap;
  }

  .action-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .total-count {
    font-size: 0.7rem;
    color: #6b7280;
    background: #e5e7eb;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
  }

  .meal-columns {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    min-height: 120px;
  }

  .meal-column {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    padding: 0.375rem 0.25rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-bottom: 1px solid #fcd34d;
    min-height: 28px;
  }

  .meal-name {
    font-weight: 600;
    font-size: 0.75rem;
    color: #92400e;
    flex: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .history-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.625rem;
    padding: 0;
    opacity: 0.5;
    line-height: 1;
    flex-shrink: 0;
  }

  .history-btn:hover {
    opacity: 1;
  }

  /* ── Share button + popover ── */
  .share-wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.15rem;
    margin-left: auto;
    flex-shrink: 0;
  }

  .share-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.65rem;
    padding: 0;
    opacity: 0.55;
    line-height: 1;
  }

  .share-btn:hover:not(:disabled) { opacity: 1; }
  .share-btn--open { opacity: 1; }

  .share-indicators {
    display: flex;
    gap: 0.1rem;
  }

  .share-avatar {
    font-size: 0.6rem;
    line-height: 1;
    transition: opacity 0.2s;
  }

  .share-avatar--shared  { opacity: 1; }
  .share-avatar--unshared { opacity: 0.25; }

  .share-popover {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 100;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    padding: 0.4rem 0.3rem;
    min-width: 130px;
  }

  .share-popover-title {
    font-size: 0.6rem;
    color: #6b7280;
    margin: 0 0 0.3rem 0.3rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .share-member-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    background: none;
    border: none;
    border-radius: 0.375rem;
    padding: 0.3rem 0.4rem;
    font-size: 0.75rem;
    cursor: pointer;
    text-align: left;
    color: #111827;
  }

  .share-member-btn:hover:not(:disabled) { background: #f3f4f6; }
  .share-member-btn:disabled { opacity: 0.4; cursor: default; }
  .share-member-btn--done { color: #16a34a; }

  .share-member-icon { font-size: 0.85rem; }
  .share-check { margin-left: auto; font-size: 0.75rem; color: #16a34a; }

  .column-foods {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.25rem;
    min-height: 60px;
    overflow-y: auto;
  }

  .empty-meal {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d1d5db;
    font-size: 0.875rem;
  }

  .food-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.25rem;
    background: #f9fafb;
    border-radius: 0.25rem;
    font-size: 0.7rem;
  }

  .food-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
  }

  .food-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #374151;
    font-weight: 500;
  }

  .food-qty {
    font-size: 0.6rem;
    color: #6b7280;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .food-qty:hover {
    color: #f59e0b;
  }

  .food-cal {
    font-size: 0.625rem;
    color: #92400e;
    font-weight: 500;
    flex-shrink: 0;
  }

  .remove-btn {
    width: 14px;
    height: 14px;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.625rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: #fecaca;
  }

  .column-total {
    padding: 0.25rem;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: #92400e;
    background: #fffbeb;
    border-top: 1px solid #fde68a;
  }

  .drag-handle {
    color: #6b7280;
    font-size: 0.75rem;
    cursor: grab;
    user-select: none;
    flex-shrink: 0;
    background: #f3f4f6;
    border-radius: 0.125rem;
    padding: 0 0.125rem;
    line-height: 1;
  }

  .drag-handle:active {
    cursor: grabbing;
    background: #e5e7eb;
  }

  .quantity-input {
    width: 35px;
    padding: 0.125rem;
    border: 1px solid #f59e0b;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    text-align: center;
  }

  /* ── Shared modal chrome ── */
  .mc-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 1000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 5rem;
    overflow-y: auto;
  }

  .mc-modal {
    background: white;
    border-radius: 0.75rem;
    width: 90%;
    max-width: 480px;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }

  .mc-modal--narrow {
    max-width: 360px;
  }

  .mc-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 0.75rem 0.75rem 0 0;
    color: white;
  }

  .mc-modal-title {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .mc-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-close:hover { background: rgba(255,255,255,0.35); }

  .mc-empty {
    padding: 2rem 1rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.85rem;
  }

  .mc-list {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  /* ── History day row ── */
  .mc-day-row {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: 3.5rem 1fr auto;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .mc-day-row:hover { background: #f0fdf4; border-color: #86efac; }

  .mc-day-date {
    font-weight: 600;
    color: #166534;
    white-space: nowrap;
    font-size: 0.75rem;
  }

  .mc-day-foods {
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mc-day-kcal {
    color: #92400e;
    font-weight: 600;
    white-space: nowrap;
    font-size: 0.75rem;
  }

  /* ── Template row ── */
  .mc-template-row {
    display: flex;
    align-items: stretch;
    gap: 0.25rem;
  }

  .mc-template-info {
    flex: 1;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.5rem 0.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .mc-template-info:hover { background: #f0fdf4; border-color: #86efac; }

  .mc-template-name {
    font-weight: 600;
    font-size: 0.85rem;
    color: #111827;
  }

  .mc-template-meta {
    font-size: 0.7rem;
    color: #6b7280;
  }

  .mc-delete-btn {
    padding: 0 0.5rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    color: #dc2626;
  }

  .mc-delete-btn:hover { background: #fee2e2; }

  /* ── Save day body ── */
  .mc-body {
    padding: 1rem;
  }

  .mc-save-hint {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0 0 0.75rem;
  }

  /* ── Plus upgrade prompt ───────────────────────────────────────────────── */
  .mc-upgrade {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.25rem 1rem;
    gap: 0.65rem;
  }

  .mc-upgrade .upgrade-icon { font-size: 2.25rem; line-height: 1; }

  .mc-upgrade h4 { margin: 0; font-size: 1rem; color: #111827; }

  .mc-upgrade p {
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
    max-width: 280px;
    line-height: 1.45;
  }

  .upgrade-features {
    list-style: none;
    margin: 0.2rem 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    width: 100%;
    max-width: 260px;
  }

  .upgrade-feature {
    background: #f3f4f6;
    border-radius: 0.4rem;
    padding: 0.3rem 0.7rem;
    font-size: 0.82rem;
    color: #374151;
    text-align: left;
  }

  .upgrade-cta {
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.55rem 1.2rem;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .upgrade-cta:hover { background: #6d28d9; }

  .upgrade-skip {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 0.83rem;
    cursor: pointer;
    padding: 0.2rem;
  }

  .upgrade-skip:hover { color: #6b7280; }

  .mc-name-input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    outline: none;
  }

  .mc-name-input:focus { border-color: #22c55e; box-shadow: 0 0 0 2px #bbf7d0; }

  .mc-error {
    font-size: 0.8rem;
    color: #dc2626;
    margin: 0.375rem 0 0;
  }

  .mc-modal-footer {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  /* ── Confirmation inline panel ── */
  .mc-confirm {
    padding: 1rem;
  }

  .mc-confirm p {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    color: #374151;
  }

  .mc-confirm-btns {
    display: flex;
    gap: 0.5rem;
  }

  /* ── Shared button styles ── */
  .mc-btn {
    padding: 0.375rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
    color: #374151;
  }

  .mc-btn:hover { background: #f9fafb; }

  .mc-btn--primary {
    background: #22c55e;
    border-color: #16a34a;
    color: white;
  }

  .mc-btn--primary:hover { background: #16a34a; }
  .mc-btn--primary:disabled { opacity: 0.6; cursor: default; }

  .mc-btn--danger {
    background: #dc2626;
    border-color: #b91c1c;
    color: white;
  }

  .mc-btn--danger:hover { background: #b91c1c; }

  /* ── Template search ── */
  .mc-search-wrap {
    padding: 0.5rem 0.5rem 0;
  }

  .mc-search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.375rem 0.625rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    outline: none;
    color: #374151;
    background: white;
  }

  .mc-search-input:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 2px #bbf7d0;
  }

  /* ── Template preview panel ── */
  .mc-preview {
    padding: 0.75rem 1rem 1rem;
  }

  .mc-preview-header {
    margin-bottom: 0.75rem;
  }

  .mc-preview-name {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    color: #111827;
  }

  .mc-preview-meta {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.125rem;
  }

  .mc-preview-slots {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .mc-preview-slot {
    display: grid;
    grid-template-columns: 4.5rem 1fr auto;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.78rem;
  }

  .mc-preview-slot-label {
    font-weight: 600;
    color: #166534;
    white-space: nowrap;
  }

  .mc-preview-slot-foods {
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mc-preview-slot-kcal {
    color: #92400e;
    font-weight: 500;
    white-space: nowrap;
    font-size: 0.72rem;
  }

  /* ── Scheduled plan banner ──────────────────────────── */
  .mc-scheduled-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    flex-wrap: wrap;
  }
  .mc-scheduled-icon { font-size: 1rem; flex-shrink: 0; }
  .mc-scheduled-text { flex: 1; color: #166534; }
  .mc-scheduled-load {
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    padding: 0.25rem 0.6rem;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }
  .mc-scheduled-load:hover { background: #16a34a; }
  .mc-scheduled-dismiss {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 1rem;
    padding: 0 0.2rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .mc-scheduled-dismiss:hover { color: #374151; }

  /* ── Scheduled date badge in template list ──────────── */
  .mc-scheduled-badge {
    display: inline-block;
    background: #dcfce7;
    color: #166534;
    padding: 0.1rem 0.35rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    margin-left: 0.25rem;
    white-space: nowrap;
  }

  /* ── Schedule date picker in Save modal ─────────────── */
  .mc-date-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
    margin-top: 0.75rem;
  }
  .mc-date-hint { font-weight: 400; color: #9ca3af; }
  .mc-date-input {
    padding: 0.4rem 0.6rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    color: #111827;
    background: #fff;
    cursor: pointer;
  }
  .mc-date-input:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 2px #bbf7d0;
  }
</style>
