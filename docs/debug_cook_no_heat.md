# Debug: "Cook * No heat" Bug — CRUST_001 (and all dev recipes)

**Date written:** 2026-07-02  
**Status:** Fix pushed in commit `7f9c89bc`. Vercel deploy may not have landed yet when user reported recurrence. Verify deployment, then follow steps below if still broken.

---

## What the user sees

Opening any dev recipe (e.g. CRUST_001) in `/moderate` → Published tab → the primary cook bar reads:

```
Cook *  [No heat ▾]  ⓘ
```

Time and Temp fields are hidden (they only appear when `cookingMethod !== 'No heat'`).  
**Expected:** `Bake ▾ | 25 min | 425°F`

---

## Root cause (confirmed)

The `/moderate` page's `recipeToFormData()` function was passing the raw Turso DB value directly to RecipeForm:

```javascript
// moderate/+page.svelte — BEFORE fix
cookingMethod: recipe.cookingMethod || 'Bake',
```

Turso stores `cooking_method` in **pipeline format** (lowercase past-tense):  
`'baked'`, `'boiled'`, `'pan grilled'`, `'fried'`, `'raw'`, etc.

RecipeForm's `COOKING_METHODS` list uses **UI format** (present-tense, capitalized):  
`['Bake', 'Boil', 'Simmer', 'Sub-simmer', 'Braise', 'Pan grill', 'Grill', 'Fry', 'No heat']`

RecipeForm init code:
```javascript
const _initCM = initialData.cookingMethod ?? '';                         // 'baked'
const _matchedCM = COOKING_METHODS.find(
  m => m.toLowerCase() === _initCM.toLowerCase()                         // 'baked' !== 'bake'
);                                                                        // → undefined (no match)
let cookingMethod = $state(_matchedCM ?? (_initCM ? 'No heat' : 'Bake')); // → 'No heat' ← BUG
```

`'baked'.toLowerCase()` is `'baked'`, but COOKING_METHODS has `'Bake'` which lowercases to `'bake'`.  
`'baked' !== 'bake'` → no match → `_initCM` is truthy → fallback is `'No heat'`.

---

## Fix applied (commit `7f9c89bc`)

Added `normalizeCookingMethod()` helper in two files:

### `src/routes/farmers-basket/moderate/+page.svelte` (PRIMARY FIX)

```javascript
function normalizeCookingMethod(raw?: string): string {
  if (!raw) return 'Bake';
  const map: Record<string, string> = {
    'baked':       'Bake',
    'boiled':      'Boil',
    'simmer':      'Simmer',
    'sub-simmer':  'Sub-simmer',
    'braise':      'Braise',
    'pan grilled': 'Pan grill',
    'grilled':     'Grill',
    'fried':       'Fry',
    'raw':         'No heat',
    'steamed':     'No heat',
    'microwave':   'No heat',
  };
  return map[raw.toLowerCase()] ?? raw;
}
```

Applied at: `cookingMethod: normalizeCookingMethod(recipe.cookingMethod),`

### `src/lib/farmers-basket/RecipeBook.svelte` (DEFENSIVE FIX)

Same helper added; applied in `collabInitialData()` and `creatorInitialData()` which both previously had the same `d.cookingMethod || selectedLevel.cookingMethod || 'Bake'` pattern.

---

## Data flow for CRUST_001 (after fix)

```
Turso dev_recipes.cooking_method = 'baked'
  → /api/recipes/moderate: cooking_method AS cookingMethod
  → recipe.cookingMethod = 'baked'
  → recipeToFormData: normalizeCookingMethod('baked') = 'Bake'
  → initialData.cookingMethod = 'Bake'
  → RecipeForm: _initCM = 'Bake', _matchedCM = 'Bake'
  → cookingMethod = 'Bake'  ✓
```

---

## Why the v3-build effect doesn't help / hurt

RecipeForm fires a `$effect` that fetches `/api/recipes/v3-build/CRUST_001`.  
CRUST_001 has no build JSON in `recipes_v3/output/` → API returns 404.

```javascript
if (res.status === 404) { v3Build = null; v3BuildMissing = true; return; }
// ← early return. cookingMethod is never touched.
```

The only place v3-build sets `cookingMethod` is deep inside the success handler, under the condition `if (data.cookMethod && (!data.sections || data.sections.length === 0))` — which only runs on a 200 response.

**No impact either way** for CRUST recipes.

---

## Why sections_json doesn't interfere

The moderate API returns `sections_json AS sectionsJson` for every recipe. For CRUST_001 this contains `cookingMethod: 'baked'` inside each section object. `recipeToFormData` passes this to `initialData.sections`.

RecipeForm inits `let sections = $state(initialData.sections ?? [])`. These sections are used for the **per-section prep display** (blind-bake row), not the primary `cookingMethod` state. The only code that reads section data to set `cookingMethod` is inside the v3-build success handler (404 for CRUST → never reached).

**No impact** from sections_json.

---

## Step-by-step verification when you return

### 1. Confirm deployment

Check https://vercel.com/tlgeorgemailcom/daily-plate/deployments — the latest deployment should show commit `7f9c89bc` ("fix: normalize cookingMethod from Turso DB format…").

### 2. Hard-refresh the moderate page

Shift+Reload or open in incognito to bust any cached JS bundle.  
Go to Published → select CRUST_001.

### 3. Expected result

Primary cook bar: **Bake ▾ | [25] min | [425] °F**

### 4. If still "No heat" after confirmed deployment

The fix is definitely deployed but still broken → the problem is NOT in `recipeToFormData` normalization. The next suspect is a `$effect` or `$derived` in RecipeForm that **re-evaluates cookingMethod after mount**.

Check RecipeForm for any reactive block other than the v3-build effect that could set `cookingMethod`. The full list of assignments:
```
Line 199  — $state initialization (runs once, should be 'Bake' after fix)
Line 1059 — inside v3-build success handler (unreachable for CRUST)
```
Only two assignment sites exist. If "No heat" persists post-deploy, add a console.log to line 199 in RecipeForm to verify what `_initCM` and `_matchedCM` are when CRUST_001 loads.

### 5. Alternative: add direct Turso SQL check

If the moderate API is somehow returning a different value:
```sql
SELECT cooking_method FROM dev_recipes WHERE recipe_id = 'CRUST_001';
-- Expected: 'baked'
```
Use the libsql_experimental pattern from CLAUDE.md (TURSO_SR28_URL / TURSO_SR28_TOKEN) or the Turso shell.

---

## Other recipes affected by this same bug

**All dev recipes** — every recipe in Turso's `dev_recipes` table stores `cooking_method` in pipeline format. Every recipe opened in `/moderate` was showing the wrong cooking method in the primary cook bar. The fix is general.

Spot-check a few when you return:
- `ENTR_001` → should show **Pan grill** (stored as `'pan grilled'`)
- `SIDE_001` → should show **Boil** (stored as `'boiled'`)
- `SAUCE_011` → should show **Boil** (stored as `'boiled'`)
- `BKFST_014` → should show **Pan grill** (stored as `'pan grilled'`, since waffles use waffle iron = griddle)
