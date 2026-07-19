# Recipe Development — Source of Truth

> This file is the authoritative step-by-step guide for building dev recipes in `recipes_v3/`.
> All rules here are derived from accumulated lessons in `CLAUDE.md`. When a conflict exists, this file wins for authoring procedure; `CLAUDE.md` wins for pipeline internals.

---

## ⚠ V3 PARALLEL PIPELINE CONVERSION — IN PROGRESS (as of 2026-07-03)

### What the v3 parallel pipeline IS

The v3 pipeline is designed to compute `yfw` (water yield factor) from **first principles** using a physics-based evaporation model. The inputs are:
- `cook_method` in `recipe_sections.csv` — determines temperature (e.g. simmer=195°F, boiled=212°F, baked=350–450°F)
- `cook_stages` in `recipe_sections.csv` — stores time in `tempF:minutes` format (e.g. `450:14`, `0:7`, `325:30`)

When both are present and `yfw` is not manually locked, `build.py` calls `calc_yield_water()` to derive `yfw` automatically. **No recipe should have a manually locked `yfw` in the final v3 state.**

### ⚠ CRITICAL: Section-first computation — the core architectural rule

> **Every section's retention and yield are applied to its own ingredients BEFORE any assembly or final cook step.** This is the most important architectural fact about the v3 pipeline. Every new or migrated recipe must be structured with this in mind.

**How `build.py` processes a multi-section recipe:**

1. For each section in `recipe_sections.csv`:
   - Sum the raw ingredient grams for that section
   - Apply **retention factors** (based on the section's `cook_method`)
   - Apply **yield factors** (`yfw`, `yff`, `yfp`, `yfc`, `yfo`) — either from `cook_stages` physics model or locked values
   - Produce the section's **cooked nutrient totals**
2. Sum all sections' cooked nutrient totals into the recipe total
3. Divide by total cooked grams to produce **per-100g values**

There is no "final cook" phase in the pipeline. If a recipe has a final assembly step (e.g. baked quiche, braised stew), that step is modelled by giving the appropriate section a `cook_method` and `cook_stages` that reflect the actual cooking. The pipeline then applies those factors to that section's ingredients.

**Practical implications for authoring:**

| Scenario | How to model it |
|---|---|
| Sausage browned then combined into gravy | Two sections: `sausage` (fried) + `gravy` (simmer). Each section gets its own retention. |
| Eggs poached, muffin grilled, sauce simmered, assembled cold | Four sections, each with their own cook method. No "assembly cook". |
| Quiche: crust pressed + filling mixed + whole thing baked | Two sections: `crust` (baked, with temp:time) + `filling` (raw). The bake applies to the crust section. Filling's assembly involves no heat. |
| Burrito: tortilla pan-grilled + beans heated + cheese cold | Three sections: `tortilla` (pan grilled) + `beans` (pan grilled) + `cheese` (raw). |
| Stew: all ingredients cooked together | One section, cook_method=simmer or braise, with the stew's total time. |

**Why this matters for each new category:** When adapting ENTR, SIDE, SAND, SAUCE, etc. recipes to v3, the first question for every multi-component recipe is: *"Which ingredients are cooked separately before assembly, and which are cooked together?"* Each independently-cooked component must be its own section with the correct `cook_method`. Ingredients that are assembled cold and never cooked get `cook_method=raw`. There is no catch-all "final bake" that re-cooks everything — the section structure IS the cooking model.

### What has been done

- **BKFST recipes 1–52**: `cook_stages` added to all sections per `docs/breakfast.md` spec — commit `bda9c476` + `16e4c822` (2026-07-03)
- **Section splits completed** for burritos (BKFST_017–022), Avocado Toast Tomato & Egg (BKFST_035), Huevos Rancheros (BKFST_047) — each component (tortilla, beans, eggs, cheese, potatoes) now has its own section with the correct `cook_method` and `cook_stages`
- **Cook method corrections**: BKFST_033 Frittata changed `baked→pan grilled`; BKFST_021 beef and BKFST_037/038 ham changed to `pan grilled`; BKFST_012 gravy changed `boiled→simmer`
- All 36 affected BKFST recipes rebuilt, uploaded to Turso, bundle regenerated
- **Form fix** (`RecipeForm.svelte`): section cook-method dropdown was reading `prep_method` (physical action like "crumbled") instead of `cook_method` (heat method). Fixed — commits `b347ac3a` + `4466cd66`
- **Form fix** (`RecipeForm.svelte`): primary cook bar — `Cook *` dropdown was defaulting to `'Bake'` when no value was present, and `Temp (°F)` field was hidden unless `Bake` was selected, and `Cook (min)` was hidden for `'No heat'`. All three primary cook fields (`Cook`, `Cook (min)`, `Temp (°F)`) are now always visible and blank by default — commits `4942c81f` + `a105df1e` (2026-07-03)
- **Form fix** (`RecipeForm.svelte`): for multi-section recipes (2+ non-raw sections), the primary cook method, time, and temp are now cleared to blank when the v3-build API loads section data — preventing the recipe's stored top-level `cooking_method` (e.g. `'boiled'`) from incorrectly populating the primary cook dropdown. Commit `a105df1e` (2026-07-03)
- **BKFST section cook method audit and corrections** — commit `5ae1a0e0` + `ade05f4f` (2026-07-03): All BKFST recipe sections compared against `docs/breakfast.md` spec. 15 section rows and 7 `recipes.csv` rows corrected. See § **Category Section Review Process** below for the full methodology.

### What is still outstanding

1. **Locked `yfw` values must be cleared across ALL recipes.** Every explicit `yfw` value currently sitting in `recipe_sections.csv` (e.g. `yfw=0.75` for BKFST_001, `yfw=0.92` for BKFST_012, etc.) is a legacy calibration artifact. Once `cook_stages` are populated for all recipes, these must be removed column-by-column so the physics model takes over. This is a **separate phase** — do not clear them until cook_stages coverage is complete and verified.

2. **Cook minutes not displaying in section Prep display.** The form reads `boil_minutes` (from `boil_stages` CSV column) for stovetop sections. For BKFST sections, `boil_stages` is empty — the minutes live in `cook_stages[0].minutes`. The form's `boilMinutes` field needs to fall back to `firstStage?.minutes` when `boil_minutes` is 0 or absent. Fix location: `RecipeForm.svelte` `$effect` block, `boilMinutes` assignment (~line 940). **Status: still open — affects many recipes across all categories.**

6. **Primary cook bar shows wrong method for many non-BKFST multi-section recipes.** The fix in `a105df1e` clears the primary cook field for any recipe where the v3-build API returns 2+ sections with non-raw prep methods. However, ENTR, SIDE, SAND, SAUCE, SALAD, STOCK, and SWEET multi-section recipes were built before the `cook_stages` / `cook_method` infrastructure was fully in place — many will open the edit form with incorrect (stale) primary cook values until their build JSONs are rebuilt from current CSV state. Once cook_stages annotations are complete for each category, rebuild and regenerate the bundle to propagate corrections.

3. **cook_stages annotations for non-BKFST recipes** — **COMPLETED (July 2026): SAUCE_001–027, STOCK_001–007, SIDE_001–040, BKFST, SAND, SOUP, SWEET, SALAD** all converted to physics with no locked yfw values. Remaining: **ENTR** (locks on ~50 sections pending unlock sessions) and **CRUST** (2 locked sections). All converted categories use `pm/cm/boil_stages/cook_stages/fill_class` pattern; top bar `cook_minutes`/`cook_temp_f` set directly in `recipes.csv`.

4. **`simmer` vs `boiled` display**: For any section still showing the wrong cook method label in the form dropdown, verify `recipe_sections.csv::cook_method` is set correctly. The form now reads `cook_method` correctly (fixed in this session), so what's in the CSV is what shows.

5. **Retention factors**: `simmer`, `sub-simmer`, and `braise` all map to `"boiled"` retention percentages in `retention.py` (by design — they share nutrient retention). The distinction between simmer and boiled exists **only** in the evaporation model (`build.py` lines 583–586: simmer=195°F, boiled=212°F). This is correct and intentional. No re-evaluation of existing recipes is needed on retention grounds.

### Key invariant going forward

> **`yfw` must never be hardcoded in a new or rebuilt section.** Leave `yfw` empty (or 1.0 as a no-op placeholder) and let the physics model compute it from `cook_stages`. The locked values in existing sections are technical debt to be resolved in a dedicated cleanup phase.

### ⚠ The V3 end state: every recipe, every section, physics-only yield factors

The goal of the v3 conversion is that **every recipe in every category** runs entirely through the physics-based pipeline with no manually-locked yield factors anywhere — not at the recipe level, not at the section level. This means:

- Each prep section gets `cook_method` + `cook_stages` (temp:time) → pipeline derives `yfw` automatically
- If the recipe has a final assembly section (e.g. a bake after components are prepped), that section also gets its own `cook_method` + `cook_stages`
- No `yield_factor_water`, `yield_factor_fat`, etc. are set by hand in `recipe_sections.csv` once the physics model takes over
- The locked values currently in the CSV (`yfw=0.75`, `yfw=0.92`, etc.) are temporary placeholders from the pre-v3 calibration era — they will be cleared category by category after `cook_stages` coverage is confirmed

**This applies to ALL categories: BKFST, ENTR, SIDE, SAND, SAUCE, SALAD, STOCK, SWEET, SOUP, PASTA, BVRG.** BKFST is the first category to reach `cook_stages` coverage. Each remaining category will be adapted in the same way: spec file → audit → section splits → cook_method + cook_stages → rebuild → verify.

### ⚠ Turso and the bundle MUST always be in sync

Every change to recipe data requires **both** of the following — skipping either leaves the app in a split-brain state:

| What changed | Command required |
|---|---|
| `recipe_ingredients.csv`, `recipe_sections.csv`, ingredient grams, nutrition | `python recipes_v3/tools/upload.py --recipe ID --commit` → updates Turso (runtime API) |
| Any recipe data visible in the basket UI or edit form | `python recipes_v3/tools/generate_bundle.py` → updates `generated-levels.ts` (static bundle) |

**Why both are needed:** The basket app serves recipe data from two sources simultaneously — Turso (live API calls for edit/moderate paths) and the static bundle compiled into the app (for the play/view paths). A change pushed to Turso but not bundled will show correctly in the edit form but revert to old data in the game. A bundle regenerated without uploading to Turso will show correctly in the game but serve stale data to the edit form.

**After every fix session:** the complete sequence is always:
```
python recipes_v3/tools/build_all.py --recipe ID   # recompute nutrition
python recipes_v3/tools/upload.py --recipe ID --commit  # push to Turso
python recipes_v3/tools/generate_bundle.py         # update static bundle
git add ... && git commit && git push              # deploy
```

---

## Category Section Review Process

When reviewing a food category (BKFST, ENTR, SIDE, etc.) for correctness, use the following workflow. Each category gets a spec file (e.g. `docs/breakfast.md`) that lists the correct cook method and time for every recipe and every section. The AI compares the spec against the CSVs and fixes all discrepancies.

### Spec file format

Category spec files (e.g. `docs/pasta_pizza.md`, `docs/breakfast.md`, `docs/sandwiches.md`) use a pipe-delimited format that maps directly to `recipe_sections.csv` and `recipes.csv` columns. Every conversion session starts by reading the spec for the recipe being worked on.

---

#### Top bar line

The first line after the recipe name specifies the **primary assembled cook** — the method shown in the top bar of the edit form.

| Spec line | `recipes.csv` effect | Form top bar |
|---|---|---|
| `Top bar: blank` | `cooking_method=''`, `cook_minutes=''`, `cook_temp_f=''` | blank |
| `Top bar: Simmer (lid off) \| 90 min` | `cooking_method='simmer'`, `cook_minutes=90` | "Simmer · 90 min" |
| `Top bar: Bake \| 375 \| 18 min` | `cooking_method='baked'`, `cook_temp_f=375`, `cook_minutes=18` | "Bake · 18 min · 375°F" |
| `Top bar: Bake \| 450 \| 20 min` | `cooking_method='baked'`, `cook_temp_f=450`, `cook_minutes=20` | "Bake · 20 min · 450°F" |

**Blank top bar** means every section carries its own prep display independently. The primary `cooking_method` must be cleared to `''` in `recipes.csv` (upload.py writes this to Turso on every `--commit`).

**Non-blank top bar** means there is one assembled cook that applies to all non-raw sections simultaneously. Each non-raw section gets `cm=<top bar method>` plus the top bar `cook_stages` (e.g. `375:18`). The `pm` (prep_method) on each section is that section's own pre-step.

---

#### Prep lines

Each `Prep:` line defines one section in `recipe_sections.csv`.

**Full format:**
```
Prep: Section Label | cook_method | [temp |] time min | ingredients: ingredient, ingredient, ...
```

**Unheated / Added after cooking:**
```
Prep: Section Label | unheated | ingredients: ingredient, ingredient
Prep: Section Label | Added after cooking | ingredients: ingredient, ingredient
```

---

#### Mapping a Prep line to recipe_sections.csv

| Spec field | CSV column(s) | Notes |
|---|---|---|
| `Section Label` | `section_label` | The collapsible header shown in the form. No trailing colon. |
| `cook_method` | `prep_method` (pm) + `cook_method` (cm) | See table below |
| `time min` | `boil_stages` (stovetop) or `cook_stages` (oven) | Minutes only for stovetop; `tempF:minutes` for oven |
| `temp` (optional) | `cook_stages` first field | Only for baked/par-baked sections |
| `ingredients` | row_order + section key in `recipe_ingredients.csv` | Lists which ingredient keys belong to this section |

---

#### cook_method keyword → pm / cm values

| Spec keyword | `prep_method` (pm) | `cook_method` (cm) | `boil_stages` | `fill_class` hint |
|---|---|---|---|---|
| `boiled` | `boiled` | `boiled` | time in minutes | *(none — absorption model for pasta/rice/beans)* |
| `simmer (lid off)` | `simmer` | `simmer` | time in minutes | `simmer_sauce` for butter/cream/sauce; none for plain liquid reduction |
| `sub-simmer (lid off)` | `sub-simmer` | `sub-simmer` | time in minutes | `simmer_sauce` for cream/butter sauces |
| `pan grilled` | `pan grilled` | `pan grilled` | time in minutes | `pan_grilled_chicken` (chicken/fish); `fried_meat` (ground meat, sausage, bacon); none (aromatics, short sautés) |
| `baked` | `baked` | `baked` | *(empty — use `cook_stages`)* | `pastry` (doughs); `casserole_baked` (assembled bakes); `cake_batter` (batters) |
| `baked (covered)` | `baked covered` | `baked covered` | *(empty — use `cook_stages`)* | `casserole_baked` |
| `unheated` | `''` (empty) | `raw` | *(empty)* | *(none)* |
| `Added after cooking` | `finish` | `raw` | *(empty)* | *(none)* |

**Two-stage rule when top bar is non-blank:**
- `pm` = the section's own pre-step (what the spec line says)
- `cm` = the top bar method (the assembled cook applied to all sections simultaneously)

**Example — Baked Ziti (`Top bar: Bake | 375 | 18 min`):**

| Spec line | pm | cm | cook_stages | boil_stages |
|---|---|---|---|---|
| `Prep: Pasta \| boiled \| 2 min` | `boiled` | `baked` | `375:18` | `2` |
| `Prep: Marinara Sauce \| unheated` | `''` | `baked` | `375:18` | *(empty)* |
| `Prep: Cheese layer \| baked (covered) \| 375 \| 25 min` | `baked covered` | `baked` | `375:18` | *(empty)* + own `cook_stages=375:25` |

**Example — Spaghetti Bolognese (`Top bar: Simmer (lid off) | 90 min`):**

| Spec line | pm | cm | boil_stages |
|---|---|---|---|
| `Prep Pasta \| boiled \| 8 min` | `boiled` | `simmer` | `8` |
| `Prep: Vegetables \| pan grilled \| 9 min` | `pan grilled` | `simmer` | `9` |
| `Prep: Tomatoes \| unheated` | `''` | `simmer` | *(empty)* |

**Example — Cacio e Pepe (`Top bar: blank`):**

| Spec line | pm | cm | boil_stages |
|---|---|---|---|
| `Prep Pasta \| boiled \| 8 min` | `boiled` | `boiled` | `8` |
| `Prep: Sauce \| unheated` | `''` | `raw` | *(empty)* |

---

#### `(lid off)` qualifier

`simmer (lid off)` and `sub-simmer (lid off)` are display labels — the `(lid off)` part is not stored anywhere. It just confirms that the open-pot evaporation model applies (the default for `simmer` and `sub-simmer`). The CSV value is simply `simmer` or `sub-simmer`.

---

#### Section display order rule

Sections must appear in `recipe_ingredients.csv` in the order they should display in the UI:

1. Unheated/raw sections first (`pm=''`)
2. Cooked sections in descending cook time (longest first)
3. `finish` section last ("Added after cooking")

The `recipe_sections.csv` order controls physics; the `recipe_ingredients.csv` row order controls the UI display order.

---

#### `fill_class` selection guide (for stovetop sections)

Without a `fill_class`, `calc_yield_water` returns `yfw=1.0` for all stovetop sections even when `boil_stages` is set. Always assign `fill_class` for any section that should lose water during cooking.

| Section contents | `fill_class` |
|---|---|
| Butter + cream sauce, simmering | `simmer_sauce` |
| Onion, aromatics, short sauté | *(none — negligible water loss at 1–2 min)* |
| Ground beef, sausage (fat stays or drains) | `fried_meat` |
| Chicken breast, fish fillet (pan grilled) | `pan_grilled_chicken` |
| Battered/breaded fried cutlet or fillet protein (chicken fried steak, schnitzel, Milanese, fried fish fillet) | `fried_chicken` |
| Bacon (fat retained, not drained) | `fried_meat` |
| Roux cooked briefly in fat before liquid is added | `pan_grilled_batter` |
| Baked pasta/grain casserole | `casserole_baked` |
| Pizza dough / pastry crust | `pastry` or `thin_pizza_crust` |
| Pizza cheese topping | `pizza_cheese_topping` |
| Spinach wilted in pan | `wilt_squeezed_spinach` |
| Vegetables roasted | `roasted_vegetable` |

`fried_chicken` is a legacy class name, not a poultry-only rule. Use it for fried battered or breaded protein cutlets/fillets where the food behaves like the calibrated fried chicken path. Do not use it for ground meat patties, loose sausage, or bacon; those remain `fried_meat`.

### Audit command

```python
python3 -c "
import csv
BASE = 'recipes_v3/data'
secs = {}
with open(f'{BASE}/recipe_sections.csv') as f:
    for row in csv.DictReader(f):
        rid = row['recipe_id']
        if rid.startswith('PREFIX_'):
            secs.setdefault(rid, []).append(row)
for rid in sorted(secs):
    for s in secs[rid]:
        print(f'{rid} | {s[\"section_key\"]:25} | cm={s[\"cook_method\"]:15} | stages={s[\"cook_stages\"]}')
    print()
"
```

Replace `PREFIX_` with the category prefix (e.g. `BKFST_`, `ENTR_`, `SIDE_`).

### Common errors found during BKFST review (2026-07-03)

| Wrong value | Correct value | Affected recipes |
|---|---|---|
| `grilled` | `pan grilled` | Pancakes, English Muffins (griddle = pan grill, not BBQ grill) |
| `fried` | `pan grilled` | French Toast (skillet = pan grill, not deep fry) |
| `steamed` | `simmer` | Hollandaise Sauce |
| `raw` on component-ref section | actual cook method of that section | Eggs Benedict muffin + hollandaise sections |
| `fried` | `pan grilled` | Eggs Benedict Canadian bacon section |
| `baked` on filling section | `raw` | Quiche filling sections (see quiche pattern below) |
| `raw` on sausage component-ref | `pan grilled` | BKFST_037 Croissant Sausage |

**Rule: `grilled` = outdoor/open-flame grill (waffles use `grilled` correctly — waffle iron). `pan grilled` = stovetop skillet or griddle. When in doubt: pancakes, crepes, French toast, English muffins, quesadillas, sautéed items → `pan grilled`.**

### Composite recipe (component-ref) section fixes

When a section uses `source_recipe=CHILD_ID`, its `cook_method` defaults to `raw` because the parent doesn't "know" how the child was cooked. Two fix strategies:

1. **Just change `cook_method` on the parent section** — works when the parent section merely needs to display the correct prep label and the child ingredients are correctly expanded. The `source_recipe` link stays intact and ingredients still render from the child recipe. (Used for BKFST_003 muffin, hollandaise; BKFST_037 sausage.)

2. **Break the composite entirely** — remove `source_recipe`, delete the component-ref row from `recipe_ingredients.csv`, and inline all child leaf ingredients with correct section assignments and scaled grams. Required when the child has multiple internal sections that need to appear as separate parent sections. (Used for BKFST_002 `@BKFST_012` → two sections: `sausage_crumbles` + `milk_gravy`.)

Scale factor for inlining: `target_grams (from parent) / child_raw_total_grams`.

### Quiche pattern (primary cook with assembly-only sections)

For baked dishes where the assembly steps involve no heat (press crust, mix filling) and the entire bake happens as a single final step:

- **Crust section**: keep `cm=baked`, `stages=375:37` (or whatever temp:time). This single non-raw section drives the primary cook bar → shows "Bake | 37 min | 375°F".
- **Filling section**: set `cm=raw`, clear `cook_stages`. This shows "no heat" in the section header.
- Result: 1 non-raw section → multi-section blank logic does NOT fire → primary cook bar is populated from the crust section. ✅

This pattern applies to any dish where: multiple ingredient groups exist, but only the combined bake/cook matters as the primary step. Examples: quiches, casseroles, stratas, gratins, lasagnas.

### Fix script pattern

```python
SECTION_FIXES = {
    ('RECIPE_ID', 'section_key'): {'cook_method': 'new_value'},
    ('RECIPE_ID', 'section_key'): {'cook_method': 'new_value', 'cook_stages': ''},
    ...
}
RECIPE_CM_FIXES = {
    'RECIPE_ID': 'new_cooking_method',
    ...
}
# Then: DictReader → apply fixes → DictWriter → overwrite both CSVs
```

After running the fix script, always:
1. `python recipes_v3/tools/build_all.py --recipe ID1 --recipe ID2 ...`
2. `python recipes_v3/tools/upload.py --recipe ID --commit` (for each)
3. `python recipes_v3/tools/generate_bundle.py`
4. `git add ... && git commit && git push`

### BKFST review status (as of 2026-07-03)

All 52 BKFST recipes have had `cook_stages` added and section splits completed. A second-pass cook method audit corrected 15 section rows and 7 `recipes.csv` rows. The user is still reviewing the full BKFST set in the UI — further corrections may be identified.

**When BKFST review is complete:** start the next category using the same spec-file + audit-script + fix-script workflow. Create `docs/[category].md` with the spec entries, then follow the process above.

---

---

## The Non-Negotiable Pre-Build Checklist

Run these gates **before writing a single CSV row**. Skipping any one causes a pipeline error, a display bug, or a silent nutrition error.

- [ ] Recipe ID chosen and confirmed not already in `recipes.csv`
- [ ] `food_word` confirmed present in `food-portions-complete.csv` (Rule A/B/C/F/G) OR confirmed Rule D (bespoke key, absence is correct)
- [ ] `canonical_ndb_no` identified — or explicitly confirmed as Rule D (none)
- [ ] `dietary_category` is one of: `all`, `pollo-pesca`, `pollo`, `pesca`, `veggie`, `vegan`
- [ ] `cooking_method` is one of: `raw`, `boiled`, `steamed`, `baked`, `fried`, `pan grilled`, `grilled`, `microwave`
- [ ] Every ingredient looked up in `ingredients_ledger.csv` — missing keys identified and proposed for human approval **before** writing any row
- [ ] For every new ingredient: NDB queried from `comboo.db` (`DataCentralCombo`), `default_display_name` confirmed, `food_word` confirmed against `food-portions-complete.csv`
- [ ] For every new ingredient: `food-portions-complete.csv` checked for duplicate NDB — `grep NDB_NO` — before adding
- [ ] If recipe calls for chicken broth → use `@STOCK_003`; beef broth → `@STOCK_004`; fish broth → `@STOCK_006`. Never add canned broth NDBs to the ledger.
- [ ] Human approval received for all new ledger entries and the full ingredient list — **see the mandatory render rule directly below**

> ### ⚠ MANDATORY: Show ingredients in rendered UI format for approval
> Before writing a single row to `recipe_ingredients.csv`, simulate the full rendered output for every proposed ingredient. Apply the `formatIngredientLine` dedup logic — `qty_display + " " + display_name` with the guard that suppresses the name when it already appears in `qty_display` — using the actual `default_display_name` values from the ledger. Show the developer **exactly what they will see in the app**.
>
> **Never present raw CSV rows for ingredient approval.** The developer cannot detect doubling bugs, awkward phrasing, or wrong display names from raw CSV. Bugs caught before writing cost seconds. Bugs caught after upload require a round-trip fix.
>
> To simulate: load the ledger, apply `format_line(qty_display, display_name)` for each row, group by section label, and print. See the session history for a working Python snippet.

---

## Step 1 — Add New Ingredients to the Ledger

File: `recipes_v3/data/ingredients_ledger.csv`
**Canonical copy** — `src/lib/data/ingredients_ledger.csv` is a symlink to this file. Edit only here.

For each new ingredient:

1. Query `comboo.db`: `SELECT NDB_No, Long_Desc, Energy_KCal, Protein, TotalLipidFat, Carbohydrate, FiberTotalDietary, Water, SugarsTotal FROM DataCentralCombo WHERE NDB_No = <ndb>`
2. Derive `food_word` by looking up the NDB in `food-portions-complete.csv` — the `word` column for that `NDB_NO` is the required `food_word`. If no entry exists, a new food-portions row is needed (see Step 1b).
3. Append the row using `csv.DictWriter` — never a shell heredoc or manual edit.

**Ledger columns:** `ingredient_key, ndb_no, food_word, default_long_desc, default_display_name, common_unit, common_unit_grams, notes`

**Key rule:** `food_word` in the ledger must exactly equal the `word` mapped to that NDB in `food-portions-complete.csv`. The validator enforces this. A mismatch is an error, not a warning.

### Step 1b — Add to food-portions-complete.csv (when NDB not present)

Three copies exist; all must be updated together:
- `food-portions-complete.csv` (root) — 55 columns, no `synonyms` column
- `docs/food-portions-complete.csv` — 55 columns
- `src/lib/data/food-portions-complete.csv` — 56 columns, has `synonyms` column

Use `extrasaction='ignore'` in `csv.DictWriter`. Copy nutrition values **verbatim** from `comboo.db` — never hand-approximate.

After updating food-portions, regenerate the TypeScript file:
```
python3 scripts/dev/convert_to_ts.py
```

---

## Step 2 — Add the Recipe Row

File: `recipes_v3/data/recipes.csv`

Required columns and constraints:

| Column | Rule |
|---|---|
| `recipe_id` | Prefix_NNN format (ENTR_103, SIDE_027, etc.) |
| `food_word` | Must exist in `food-portions-complete.csv` (Rule A/B/C/F/G) or Rule D bespoke |
| `recipe_name` | Display name shown in UI |
| `category` | Must match a key in `_CATEGORY_MAP` in `insert_new.py` |
| `dietary_category` | One of: `all`, `pollo-pesca`, `pollo`, `pesca`, `veggie`, `vegan` |
| `link_type` | `builtin` |
| `sr_rule` | `Rule A`, `Rule B`, `Rule C`, `Rule D`, `Rule F`, or `Rule G` — full prefix required, never bare letter |
| `cooking_method` | One of: `raw`, `boiled`, `steamed`, `baked`, `fried`, `pan grilled`, `grilled`, `microwave` |
| `yield_factor_water` | Calibrated to canonical or physics model — see yield factor reference in CLAUDE.md |
| `yield_factor_fat` | `1.0` unless fat drains away (ground beef, pan-fried sausage) |
| `yield_factor_protein` | `1.0` unless stock/broth (use `0.366` or `0.395`) |
| `yield_factor_carbohydrate` | `1.0` unless stock with wine/high-sugar liquid |
| `yield_factor_other` | `1.0` unless stock/broth (use `0.02`) |
| `status` | `approved` |
| `audit_status` | `PASS` |
| `servings_count` | Integer — use 10/90 rounding rule (see CLAUDE.md) |
| `servings_label` | Human-readable — `upload.py` writes this on every `--commit` (fixed July 2026). **Always use `(makes N)` — never `(serves N)`.** See § servings_label format below. |

**Component-ref child recipes** must have `status='approved'` and `audit_status='PASS'` before the composite build runs.

### servings_label format

`servings_label` appears in the recipe selector UI (`🍽️ …`) **and** drives the per-serving nutrition label. Two rules:

1. **Always use `(makes N)`, never `(serves N)`.** The `formatPerServingLabel()` function in `RecipeBook.svelte` strips the `(makes N)` / `(serves N)` parenthetical from the nutrition line automatically. Using `(serves N)` is not wrong at the UI layer (the regex catches both), but `(makes N)` is the project standard for all new recipes.

2. **Never leave `servings_label` empty.** An empty label causes the selector to show nothing (`🍽️` with no text). `upload.py` never writes `servings_label`, so it must be set explicitly via `insert_new.py` → Turso SQL UPDATE when first creating a recipe, and any corrections also require a direct Turso SQL UPDATE + `conn.commit()`.

**Pattern by category:**

| Category | Pattern | Example |
|---|---|---|
| ENTR, BKFST, SALAD | `"1 serving (makes N)"` or `"N pieces (makes N)"` | `"1 slice (makes 8)"`, `"3 enchiladas (makes 4)"` |
| SAND | `"1 sandwich (makes 1)"` or `"1 serving (makes N)"` | `"1 sandwich (makes 1)"` |
| SAUCE / STOCK | `"1/4 cup (makes N+)"` etc. | `"1/4 cup (makes 16+)"` |
| SIDE | `"1 cup (makes N+)"` etc. | `"1 cup (makes 6+)"` |

**How `servings_label` propagates (3 places):**
1. `recipes_v3/data/recipes.csv` col 9 — source of truth
2. Turso `dev_recipes.servings` — runtime display; written by `upload.py --commit` on every run (fixed July 2026)
3. `src/lib/farmers-basket/generated-levels.ts` bundle — static display; regenerated by `generate_bundle.py`

After any label change: (a) edit `recipes.csv`, (b) run `upload.py --recipe ID --commit`, (c) run `generate_bundle.py`.

---

## Step 3 — Add Recipe Sections

File: `recipes_v3/data/recipe_sections.csv`

Every `section` key used in `recipe_ingredients.csv` must have a matching row here. The validator enforces this.

| Column | Rule |
|---|---|
| `section_key` | Lowercase, no spaces (e.g. `scallops`, `crust`, `filling`) |
| `section_label` | Human-readable. **No trailing colon** — the display layer adds its own |
| `cook_method` | Same valid set as `cooking_method` in recipes.csv |
| `yield_factor_*` | Match recipe-level or set per-section for multi-stage recipes |
| `source_recipe` | For composite/component-ref sections only |

Single-section recipes may mirror the recipe-level yield factors.

**Validator rule 14 — two distinct component-ref section patterns:**

| Pattern | Description | `cook_method` constraint |
|---|---|---|
| **Pure-composite** | Every ingredient row in the section is a `@`-ref (e.g. `@SAUCE_001` alone under "Béchamel") | Must be `raw`; all yield factors must be 1.0 |
| **Mixed / cooking-liquid** | A `@`-ref coexists with regular ingredients (e.g. `@STOCK_006` + rice + spices in a boiled rice section) | No constraint — section's own `cook_method` and yield factors apply |

The mixed pattern is the correct authoring approach whenever a stock or broth component-ref is used as a **cooking liquid** for an absorbing grain or stew (paella, risotto, pilaf, soups). The `@`-ref's nutrients are absorbed by the grain during boiling; restricting the section to `raw` would be nutritionally incorrect.

> **Separate-section variant (use `cook_section`):** If you want the stock to display under its own pre-collapsed header rather than inline with the grain, place the `@`-ref row in a separate `raw` display section AND set `cook_section=<grain_section>` on that row. The pipeline will route its nutrients into the grain section for math. See Step 4, section 4a-2.

---

## Step 4 — Add Ingredients

File: `recipes_v3/data/recipe_ingredients.csv`

Columns: `recipe_id, row_order, ingredient_key, qty_display, grams, grams_min, grams_max, section, ingredient_group, is_optional, display_name_override, cook_section, is_discarded, discard_percent`

> **⚠ Write no CSV rows until the rendered ingredient list has been approved.** See the mandatory render rule in the Pre-Build Checklist above.

### 4a — Deriving `grams`

**Always look up M-series values in `food-portions-complete.csv`** before writing any `qty_display`/`grams` pair. Never compute from memory. Common traps:
- `salt_table` ¼ tsp = **1.5g** (M1 1 tsp = 6.0g × 0.25), not 0.5g
- `hamburger_bun` 1 roll = **44.0g** (M1), not 43g
- `butter_salted` 1 tbsp = **14.2g** (M2), not 14g
- `onion_raw` thin slice = **9.0g** (M9 per slice)

For fractional measures without a direct M-series entry, compute from the nearest unit using the exact M-series value.

### 4a-1 — Discarded ingredients

Use `is_discarded=true` for ingredients that must appear in the recipe but are removed before eating: marinades, brines, steeping liquids, spice sachets, or other used-and-discarded components. Set `discard_percent` to the percentage discarded. A fully discarded marinade or brine uses `discard_percent=100`; if part is retained in the finished dish, use the actual discarded fraction.

The pipeline keeps `grams` and `qty_display` for rendering, but scales nutrition and cooked mass by the retained fraction: `effective_grams = grams × (1 - discard_percent / 100)`. Do not use `is_optional` for this case — optional means the cook may omit the ingredient entirely.

### 4a-2 — cook_section: decoupling display section from pipeline section (Phase 8d)

`cook_section` is the 12th column. When non-empty, it tells the pipeline to accumulate this ingredient's nutrients into the named section for math purposes, while `section` continues to control which collapsible header the ingredient appears under in the UI.

**When to use it:** a sub-recipe (@STOCK_003, @STOCK_006, etc.) is the actual cooking liquid for an absorber NDB (rice, pasta, legumes) BUT you want it to display in its own pre-collapsed section rather than inline with the grain.

| | `section` | `cook_section` |
|---|---|---|
| Display grouping | ✅ used | ignored |
| Pipeline nutrient math | ignored | ✅ used (falls back to `section` if empty) |

**Pattern — stock as cooking liquid with separate display section:**

```
# recipe_sections.csv
SIDE_036, broth,   Chicken Broth, raw,    yfw=1.0   ← display only
SIDE_036, risotto, Risotto,       boiled, yfw=1.0   ← bin model fires here

# recipe_ingredients.csv
SIDE_036, 1, @STOCK_003, "4 cups ...", 960g, section=broth, cook_section=risotto
SIDE_036, 2, rice_white_short_raw, ...,    section=risotto, cook_section=(empty)
```

Result: Chicken Broth header pre-collapses (all items `isDish: true`); Risotto header starts expanded with the 10 regular ingredients visible. The bin model sees the 960g of broth water inside the risotto section and computes the correct auto_yfw.

**When NOT to use it:** if the @-ref and the absorber are already in the same section (e.g. ENTR_110 Paella, where `@STOCK_006` is in the same `rice` section as the rice), no `cook_section` is needed — they already share a section accumulator.

**Empty = backward compatible.** All 368 pre-Phase-8d recipes have empty `cook_section`; the pipeline falls back to `section` for all of them.

---

### 4b — Proteins: always use raw NDB

Never use a pre-cooked NDB in a `raw` section. Use the raw NDB and set `cook_method` on the section. This applies to proteins served cold (chicken salad, Cobb salad, etc.) — the pipeline applies retention; the cooked NDB already baked it in.

### 4c — Absorber ingredients (pasta, rice, legumes)

Do NOT add an explicit `water` row to a section containing an absorber NDB (e.g. rice, dry pasta, dry beans). The absorption model provides the water automatically. Adding a water row inflates `raw_water` and silently undercooks the macro profile.

**Exception — blend-and-strain / cold-infusion techniques (see 4c-1):** These processes are the one valid reason to have both a water row AND an absorber NDB in the same section, because the water is the carrier liquid, not the cooking medium. The fix is to use `cook_method='raw'` for that section (see below).

### 4c-1 — Blend-and-strain / cold-infusion: always use `cook_method='raw'`

When an absorber NDB (rice, oats, nuts) is soaked in water, blended, and then **strained** — rather than cooked to absorption — the pipeline's absorption model must not fire. The absorption model fires whenever `cook_method in ('boiled', 'simmered')` and the section contains an absorber NDB; it computes the cooked-water fraction for the grain and **silently overrides** any manual `yield_factor_water` set in `recipe_sections.csv`.

**Rule:** For any blend-and-strain or cold-infusion section (horchata, oat milk, nut milk, cold-brew concentrate), set `cook_method='raw'` on that section. The manual `yield_factor_water` from `recipe_sections.csv` then applies via the `elif s.yield_factor_water is not None` branch — priority #2 in `build.py` — and models the fraction of liquid that passes through the strainer.

| Technique | `cook_method` | Absorption model fires? | Manual `yfw` respected? |
|---|---|---|---|
| Rice / pasta / beans cooked to absorption | `boiled` | ✅ yes (correct) | ❌ overridden |
| Blend-and-strain (horchata, nut milk) | `raw` | ❌ no (correct) | ✅ yes |
| Cold infusion strained (cold-brew, tisane) | `raw` | ❌ no (correct) | ✅ yes |

**Calibration approach for a strained section:**  
Set `yfw` to the fraction of raw water that passes through the strainer into the final liquid (typically 0.85–0.95 for fine-mesh straining). Set `yfp`/`yff`/`yfc` to the fraction of each macro that dissolves or emulsifies into the liquid vs. remains in the discarded solids. Put the sugar/sweetener and any post-strain additions in a separate `raw` section with all yield factors = 1.0, so `yfc` for the blend section does not reduce the added sugar.

**Discovered:** BVRG_020 Horchata (2026-06-24). `cook_method='boiled'` + rice NDB 20044 drove auto-yfw to 0.253 (absorption model), producing only 375g cooked from 1163g raw. Changing blend_strain section to `cook_method='raw'` restored manual yfw=0.908 and gave the correct 1004g cooked, matching canonical NDB 14638 within 0.1% on all scored macros.

### 4d — Section row ordering

All rows for a given `section` key must be **contiguous** — no interleaving of sections. The renderer opens a new header each time a section key is first seen; a second appearance opens a second duplicate header.

### 4e — Writing `qty_display` — THE DECISION GATE

The renderer outputs: `qty_display + " " + display_name`. Look up `default_display_name` in the ledger for each ingredient before writing `qty_display`. Apply exactly one of the three patterns below:

---

**Pattern 1 — Plain noun display name** (e.g. `"olive oil"`, `"garlic"`, `"butter"`)

The natural-English pattern is safe. Include the noun plus prep after it.

```
"2 tbsp"                          → 2 tbsp olive oil
"4 cloves garlic, minced"         → 4 cloves garlic, minced   ← dedup fires, no doubling
"2 tbsp butter, melted"           → 2 tbsp butter, melted     ← dedup fires
```

Rule: the noun in `qty_display` must be an **exact** match for `display_name` (case-insensitive). Synonyms, spacing differences, or abbreviations bypass the dedup guard and produce doubling. When in doubt, use measure-only.

---

**Pattern 2 — Qualifier-suffixed display name** (e.g. `"sea scallops, raw"`, `"beans, black, cooked"`, `"chicken breast, raw"`)

The suffix (`, raw`, `, cooked`, `, canned`) is part of the display name. A partial match does not trigger the dedup guard.

Two safe options:

- **(a) Measure-only** — accept the suffix in output:
  ```
  qty_display = "1.3 lbs (about 12 large), patted dry"
  → 1.3 lbs (about 12 large), patted dry  sea scallops, raw
  ```
- **(b) display_name_override** — replace the display name with a clean noun, then embed that exact noun in `qty_display`:
  ```
  display_name_override = "sea scallops"
  qty_display = "1.3 lbs raw sea scallops (about 12 large), patted dry"
  → 1.3 lbs raw sea scallops (about 12 large), patted dry   ← dedup fires on "sea scallops"
  ```

Never embed a partial match like `"sea scallops"` in `qty_display` without also setting `display_name_override = "sea scallops"`.

---

**Pattern 3 — Adjective-prefixed display name** (e.g. `"fresh thyme leaves"`, `"dry roasted peanuts"`, `"frozen green peas"`)

Use **measure-only** `qty_display` always. Never embed a leading partial — `"4 sprigs fresh thyme"` does not match `"fresh thyme leaves"` and both will be appended.

```
qty_display = "4 sprigs"
display_name = "fresh thyme leaves"
→ 4 sprigs fresh thyme leaves   ✓
```

---

**`qty_display` additional rules:**

- **Fresh/raw ingredients**: always include a prep state — active (`chopped`, `minced`, `sliced`) or explicit no-prep (`whole`, `leaves`, `sprigs`). Never leave a fresh ingredient with just a quantity.
- **Component-ref rows**: `qty_display` must include the child recipe name and the word "recipe". Never a bare measure. Never "N servings" — use a real culinary measure (tbsp, cup, oz, g).
- **Prep notes belong in `qty_display`, not in instructions**: embed dicing, mincing, etc. in `qty_display`. The instruction step just says "Add the garlic."
- **Never embed a comma in `qty_display`**: commas are CSV field delimiters. `"2 1/4 tablespoons pork backfat, finely chopped"` parses as two fields, silently putting `"finely chopped"` in the `grams` column and corrupting the build. Use parentheses instead: `"2 1/4 tablespoons pork backfat (finely chopped)"`. (Discovered June 2026, BKFST_015 pork backfat row.)
- **`Suggestions (not included):` for serving suggestions**: when a recipe has optional accompaniments not in the ingredient list, write a dedicated final instruction step: `Suggestions (not included): [serving text].` — never append `(not included)` inline to a regular instruction step.

### 4f — display_name_override rules

- Replaces the ingredient name entirely in the rendered line.
- Only valid uses: (1) component_ref labels, (2) qualifier-suffix cleanup per Pattern 2b above.
- Never use for prep notes — `"diced"` in the override field produces `"4 cups diced"` with no ingredient name.

---

## Step 5 — Add Instructions

File: `recipes_v3/data/recipe_instructions.csv`

Columns: **exactly 3** — `recipe_id, step_order, step_text`. No `section_key` column.

**Always use `csv.writer`** — never shell heredoc. Instruction text frequently contains commas; heredoc produces unquoted CSV that `csv.DictReader` silently truncates at the first embedded comma.

**Step order**: plain integers only — never `"1a"`, `"2b"`.

**Before writing**: snapshot prefix counts (`BKFST_`, `ENTR_`, etc.) to detect accidental truncation.
**After writing**: re-run the count check — confirm no non-target prefix counts changed.

**`Suggestions (not included):`**: when the recipe has optional accompaniments not in the ingredient list, add a dedicated final instruction step using this prefix — e.g. `Suggestions (not included): Serve with steamed rice and crusty bread.` Never append `(not included)` as a trailing qualifier on a regular instruction step.

**For single-recipe edits**: never rewrite the entire file. Replace only the target recipe block.

**For new recipes (appending)**: open the file in append mode (`'a'`) and write only the new rows with `csv.writer`. Never open the file with `'w'` mode — that truncates the file immediately, before any rows are written. If the write then fails mid-way, all pre-existing data is lost and cannot be recovered without git. The rule is simple: `open(path, 'a')` for appends, `open(path, 'w')` only when deliberately rewriting the entire file (and only after snapshotting prefix counts).

---

## Step 6 — Preview Ingredient Rendering (Required Before Upload)

Run this before `upload.py`. It replicates the exact `formatIngredientLine` logic from `RecipeBook.svelte` and shows you precisely what the user will see in the app.

```bash
python3 recipes_v3/tools/preview_ingredients.py --recipe RECIPE_ID
```

Add `--raw` to also see `qty_display` and `display_name` columns side-by-side for debugging:

```bash
python3 recipes_v3/tools/preview_ingredients.py --recipe RECIPE_ID --raw
```

**Do not proceed to Step 7 (upload) until the preview matches what you and the user agreed on.**

To scan all recipes for doubling issues at any time:

```bash
python3 recipes_v3/tools/preview_ingredients.py --all
```

If the preview shows any `⚠️ POSSIBLE DOUBLING` warning, fix `qty_display` or `display_name_override` in `recipe_ingredients.csv` and re-run the preview before uploading.

---

## Step 7 — Build, Validate, Insert, Upload

Run in this exact order:

```bash
# 1. Validate ledger integrity
python3 recipes_v3/tools/validate_ledger.py

# 2. Build nutrition for the new recipe only
python3 recipes_v3/tools/build_all.py --recipe RECIPE_ID

# 3. First-time Turso insert (dry-run first, then commit)
python3 recipes_v3/tools/insert_new.py --recipe-id RECIPE_ID
python3 recipes_v3/tools/insert_new.py --recipe-id RECIPE_ID --commit

# 4. Upload nutrition/ingredients/instructions to Turso
python3 recipes_v3/tools/upload.py --recipe RECIPE_ID --commit
# ⚠️  For brand-new recipes, upload.py will report "unchanged" with 0 rows written.
#     This is CORRECT — insert_new.py already computed and wrote the nutrition data
#     from the build output in the same transaction. "unchanged" means the diff
#     found nothing to update, not that the upload was skipped or failed.
#     Only subsequent edits (ingredient tweaks, instruction changes) will show
#     "changed cols:" output from upload.py.

# 5. If servings_label changed: edit recipes.csv then re-run upload.py --commit
#    (upload.py writes servings to Turso on every --commit as of July 2026)
#    No direct Turso SQL UPDATE required.

# 6. Regenerate static bundle
python3 recipes_v3/tools/generate_bundle.py
```

**Never run bare `build_all.py`** — it rebuilds all 338 recipes and dirties unrelated JSON files.

**`generate_bundle.py` silently excludes** any recipe with no rows in `recipe_instructions.csv`. Always write instructions before generating the bundle.

**Instruction text changes** require BOTH `upload.py --commit` (updates Turso runtime) AND `generate_bundle.py` (updates static bundle).

---

## Step 8 — Post-Build Verification

- [ ] `validate_ledger.py` exits with `OK` — the only acceptable non-error output is `Rule D — bespoke key OK` (one per Rule D recipe)
- [ ] Build output shows expected `kcal` and `gps` (grams per serving)
- [ ] For Rule A/B/F/G: run full audit table — computed vs canonical ±5% for all scored macros
- [ ] `preview_ingredients.py --recipe RECIPE_ID` run — output matches approved ingredient list exactly, no `⚠️` warnings
- [ ] Every fresh/raw ingredient has a prep state in `qty_display`
- [ ] Serving suggestions use a dedicated `Suggestions (not included):` final step where needed
- [ ] `upload.py` result reviewed — `"unchanged"` on a brand-new recipe is expected and correct (insert_new.py already wrote nutrition). `"changed cols:"` is expected on edits to an existing recipe. Either outcome means Turso is current.
- [ ] `servings_label` confirmed correct in Turso — `upload.py` now writes this column on every `--commit` (fixed July 2026). Any correction requires editing `recipes.csv` and re-running `upload.py --commit`; no direct SQL UPDATE needed.
- [ ] Bundle regenerated and confirmed at expected level count

---

## Step 9 — Commit

```bash
git add -A
git commit -m "Add RECIPE_ID Recipe Name (Rule X, dietary_category, cooking_method yfw=N.NN)

- Key facts: ingredient count, cooked total, servings × grams_per_serving
- Per 100g: N kcal · NP · NF · NC
- New ledger entries (if any)
- New food-portions entries (if any)"
git push
```

**`git push` is required for Vercel to deploy the update.** The static bundle (`generated-levels.ts`), `food-portions.ts`, and all CSV-derived assets are baked into the Vercel build at deploy time. Turso is updated the moment `upload.py --commit` and `insert_new.py --commit` run, but the front-end app (served by Vercel) will not reflect any new recipe, food-portions entry, or instruction change until a push triggers a new Vercel deployment.

Always commit `recipes_bundle.json` if `generate_bundle.py` was run.

---

## Yield Factor Quick Reference

| Scenario | yfw | yff | yfp | yfc | yfo |
|---|---|---|---|---|---|
| Baked goods (biscuits, bread) | 0.70–0.78 | 1.0 | 1.0 | 1.0 | 1.0 |
| Pan-grilled proteins | 0.75–0.90 | 1.0 | 1.0 | 1.0 | 1.0 |
| Fat-drain (ground beef patty, sausage links) | varies | <1.0 | 1.0 | 1.0 | 1.0 |
| Stocks/broths (3–4h simmer) | 0.68 | 0.089–1.0 | 0.366 | varies | 0.02 |
| Bone broth (24h) | varies | varies | 0.395 | varies | 0.02 |
| Boiled pasta (absorption model) | computed | 1.0 | 1.0 | 1.0 | 1.0 |
| Boiled rice/legumes (absorption model) | computed | 1.0 | 1.0 | 1.0 | 1.0 |

When `yff < 1.0` or `yfp < 1.0` or `yfc < 1.0`: Atwater energy recompute fires automatically (`E = P×4 + F×9 + C×4`).

Fat that renders into a sauce/roux and stays in the dish: `yff = 1.0` (not drained).

---

## Error Handling Policy

There are no pre-existing or acceptable errors. Every error from `validate_ledger.py`, `build_all.py`, or any tool must be resolved before moving on. The only acceptable warning is `Rule D — bespoke key OK`.

---

## Dev Recipe ↔ Community Recipe Parity

The project maintains two parallel computation paths that must always stay in sync. A failure in either breaks the platform.

### The Two Paths

**Python pipeline (dev recipes)**
```
recipes.csv (pipeline format) → build_all.py → output/builds/*.json → insert_new.py → Turso dev_recipes
→ generate_bundle.py → generated-levels.ts → RecipeBook.svelte
```

**TypeScript community path**
```
RecipeForm.svelte (UI format) → /api/recipes/my POST → Turso dev_recipes
→ buildRecipeCommunity.ts → RecipeBook.svelte
```

Both paths terminate in the same Turso table (`dev_recipes`) and the same display component (`RecipeBook.svelte`). Any format or value mismatch between the two paths surfaces as a UI bug in `/moderate` or the recipe viewer.

### `cooking_method` Format Convention

This is the most common parity pitfall. Two distinct formats exist:

| Context | Format | Examples |
|---|---|---|
| `recipes.csv` (pipeline source of truth) | pipeline format | `baked`, `pan grilled`, `boiled`, `raw` |
| Turso `dev_recipes.cooking_method` | UI format | `Bake`, `Pan grill`, `Boil`, `No heat` |
| `RecipeForm.svelte` `COOKING_METHODS` | UI format | `Bake`, `Pan grill`, `Boil`, `No heat` |

**Rule:** `cooking_method` must be stored in UI format in Turso for all recipes — dev and community alike. Community recipes are saved through RecipeForm.svelte, which writes UI-format values. Dev recipes are inserted via `insert_new.py`, which normalizes pipeline format to UI format at insert time using `_normalize_cook_method()`.

**Normalization map (`insert_new.py::_normalize_cook_method` and `/moderate/+page.svelte::normalizeCookingMethod`):**

| Pipeline (recipes.csv) | UI (Turso / RecipeForm) |
|---|---|
| `baked` | `Bake` |
| `boiled` | `Boil` |
| `simmer` | `Simmer` |
| `sub-simmer` | `Sub-simmer` |
| `braise` | `Braise` |
| `pan grilled` | `Pan grill` |
| `grilled` | `Grill` |
| `fried` | `Fry` |
| `raw` | `No heat` |
| `steamed` | `No heat` |
| `microwave` | `No heat` |

**Why this matters:** `RecipeForm.svelte` initializes `cookingMethod` via a case-insensitive match against `COOKING_METHODS = ['Bake', 'Boil', ...]`. If Turso stores `'baked'`, the match `'baked' === 'bake'` fails, `_initCM` is truthy, and the form falls through to `'No heat'`. Every recipe where `insert_new.py` previously wrote the raw pipeline value would silently show `'No heat'` in the cook bar regardless of actual cooking method.

**The defensive code fix** (`normalizeCookingMethod()` in `/moderate/+page.svelte` and `RecipeBook.svelte`) converts pipeline-format values to UI-format before RecipeForm receives them. This is a safety net — the authoritative fix is the Turso data and the `insert_new.py` normalization at write time.

**One-time migration tool** — if you ever need to re-normalize all existing rows (e.g. after importing a batch of recipes written directly to `recipes.csv`):
```bash
python3 recipes_v3/tools/normalize_cooking_method.py          # dry-run
python3 recipes_v3/tools/normalize_cooking_method.py --commit  # write to Turso
```
The script handles per-recipe overrides for composite-method recipes (e.g. `multi` legacy value).

### Absorption Model Parity

The water-absorption model for dry starches and legumes is implemented in two separate codebases. Both must stay in sync whenever the model changes.

| Layer | Implementation |
|---|---|
| Python pipeline | `DataCentralCombo.bin` → `load.py` → `nuts["_absorption_factor"]` → `build.py` section absorbers → auto-yfw |
| TypeScript community | `DataCentralCombo.bin` → `NutrientRow.absorptionFactor` (`types.ts`) → `buildRecipeCommunity.ts` weighted-average model |

**Key invariant:** a bin factor added to a new NDB in `comboo.db` (via `UPDATE DataCentralCombo SET bin = '...'`) takes effect for dev recipes at the next `build_all.py --recipe` run, and for community recipes immediately (TypeScript reads `bin` from Turso at runtime). No code change is needed in either path — only the DB update and a dev-recipe rebuild.

### Moderation UI Parity (`/moderate`)

`/moderate` is the shared admin editing surface for both dev recipes and community recipe approvals. Its `recipeToFormData()` function must handle all possible Turso states, including legacy pipeline-format `cooking_method` values. The `normalizeCookingMethod()` helper at the top of `moderate/+page.svelte` ensures this.

The same helper exists in `RecipeBook.svelte` (`collabInitialData()` / `creatorInitialData()`) for the in-app draft loading paths.

**When a dev recipe shows `'No heat'` in the cook bar of `/moderate`:** the Turso row has a pipeline-format `cooking_method`. Fix with a direct Turso SQL UPDATE or re-run `normalize_cooking_method.py --commit`.

### Primary Cook Bar Blanking Rules (RecipeForm.svelte `$effect`)

The primary cook bar (`cookingMethod`, `cookMinutes`, `cookTempF`) is blanked automatically when the v3-build API response is loaded into the form. The rule is:

| Situation | Primary cook bar |
|---|---|
| Any section has its own heat (1+ non-raw sections) | Blanked — sections display their own heat |
| All sections raw AND `cookingMethod` is empty or `'No heat'` | Blanked — no meaningful heat exists |
| All sections raw AND `cookingMethod` is a real heat (e.g. `'Bake'`) | **Kept** — quiche pattern; time/temp derived from section stages |

**The quiche pattern** applies when the entire assembled dish goes into the oven as a unit (e.g. BKFST_025–030). The sections (`crust`, `filling`) are assembled raw (`cook_method='raw'` in `recipe_sections.csv`) and the recipe-level `cooking_method='baked'` in `recipes.csv`. `build.py` promotes the recipe-level method to `dish_method_label` when all sections are raw, which flows through the API as `data.cookMethod='baked'` → normalized to `'Bake'` in the form → kept by the quiche branch.

**The blanking pattern** applies to:
- Assembly-only recipes with no cooking (avocado toast, bagels, smoked salmon croissant): all sections raw, `cooking_method='raw'` → `cookingMethod='No heat'` → blanked
- Multi-section recipes where sections handle all cooking (croissant sandwiches, Eggs Benedict): one or more sections have a prep method → blanked

**Where this is implemented:** `RecipeForm.svelte`, inside the v3-build `$effect`, after sections are populated from `data.sections`. Committed `4f0ec712` (2026-07-04).

### Quiche-Pattern Section Authoring

For recipes where all sections are assembled raw but the whole dish applies a single primary heat:

1. Set every section's `cook_method` to `'raw'` in `recipe_sections.csv`. The sections will display as "no heat" in the prep headers — this is correct. The sections are pre-assembled before the oven; no individual section is cooked separately.
2. Set the recipe's `cooking_method` to the actual method (e.g. `baked`) in `recipes.csv`.
3. Add `cook_stages` (e.g. `375:37`) to whichever section carries the oven time/temp — typically the crust or the first section listed. The pipeline stores these stages in the section JSON so the form can read them back.
4. In `build.py` `_build_recipe_multi()`: the `elif` branch fires when all sections are raw AND `recipe.cooking_method` is a non-raw, non-empty, non-multi value — it sets `dish_method_label = recipe.cooking_method`, which the API returns as `data.cookMethod`.
5. The form's quiche branch picks up `cookingMethod='Bake'` (not raw/empty), finds `eligibleSecs2` with stages, and populates `cookMinutes` and `cookTempF`.

**Key invariant:** a quiche-pattern recipe must have exactly ONE section with non-empty `cook_stages` (so `eligibleSecs2.length === 1`). If two sections both carry stages the branch does not fire and time/temp will not be derived.
