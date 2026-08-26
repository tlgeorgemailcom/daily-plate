| Regular white long-grain rice parboiled before a covered braise, then drained | `parboiled_long_grain_rice` — supplies 1.05 cups parboil water per cup rice internally and uses the binding-based partial absorber endpoint. Do not add a water row. Do not reuse for fully boiled rice or other grains. |
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
| Quiche: crust pressed + filling mixed + whole thing baked | Two sections authored as assembly-only (`cook_method=raw`, no section fill class) plus recipe-level `cooking_method=baked`, `cook_temp_f`, and `cook_minutes`. The top-bar primary cook supplies the bake heat; sections remain unheated in the form. |
| Burrito: tortilla pan-seared + beans heated + cheese cold | Three sections: `tortilla` (pan seared) + `beans` (pan seared) + `cheese` (raw). |
| Stew: all ingredients cooked together | One section, cook_method=simmer or braise, with the stew's total time. |

**Why this matters for each new category:** When adapting ENTR, SIDE, SAND, SAUCE, etc. recipes to v3, the first question for every multi-component recipe is: *"Which ingredients are cooked separately before assembly, and which are cooked together?"* Each independently-cooked component must be its own section with the correct `cook_method`. Ingredients that are assembled cold and never cooked get `cook_method=raw`. There is no catch-all "final bake" that re-cooks everything — the section structure IS the cooking model.

### What has been done

- **BKFST recipes 1–52**: `cook_stages` added to all sections per `docs/breakfast.md` spec — commit `bda9c476` + `16e4c822` (2026-07-03)
- **Section splits completed** for burritos (BKFST_017–022), Avocado Toast Tomato & Egg (BKFST_035), Huevos Rancheros (BKFST_047) — each component (tortilla, beans, eggs, cheese, potatoes) now has its own section with the correct `cook_method` and `cook_stages`
- **Cook method corrections**: BKFST_033 Frittata changed `baked→pan seared`; BKFST_021 beef and BKFST_037/038 ham changed to `pan seared`; BKFST_012 gravy changed `boiled→simmer`
- All 36 affected BKFST recipes rebuilt, uploaded to Turso, bundle regenerated
- **Form fix** (`RecipeForm.svelte`): section cook-method dropdown was reading `prep_method` (physical action like "crumbled") instead of `cook_method` (heat method). Fixed — commits `b347ac3a` + `4466cd66`
- **Form fix** (`RecipeForm.svelte`): primary cook bar — `Cook *` dropdown was defaulting to `'Bake'` when no value was present, and `Temp (°F)` field was hidden unless `Bake` was selected, and `Cook (min)` was hidden for `'No heat'`. All three primary cook fields (`Cook`, `Cook (min)`, `Temp (°F)`) are now always visible and blank by default — commits `4942c81f` + `a105df1e` (2026-07-03)
- **Form fix** (`RecipeForm.svelte`): for multi-section recipes (2+ non-raw sections), the primary cook method, time, and temp are now cleared to blank when the v3-build API loads section data — preventing the recipe's stored top-level `cooking_method` (e.g. `'boiled'`) from incorrectly populating the primary cook dropdown. Commit `a105df1e` (2026-07-03)
- **BKFST section cook method audit and corrections** — commit `5ae1a0e0` + `ade05f4f` (2026-07-03): All BKFST recipe sections compared against `docs/breakfast.md` spec. 15 section rows and 7 `recipes.csv` rows corrected. See § **Category Section Review Process** below for the full methodology.

### What is still outstanding

1. **Locked `yfw` values must be cleared across ALL recipes.** Every explicit `yfw` value currently sitting in `recipe_sections.csv` (e.g. `yfw=0.75` for BKFST_001, `yfw=0.92` for BKFST_012, etc.) is a legacy calibration artifact. Once `cook_stages` are populated for all recipes, these must be removed column-by-column so the physics model takes over. This is a **separate phase** — do not clear them until cook_stages coverage is complete and verified.

2. **Cook minutes not displaying in section Prep display.** The form reads `boil_minutes` (from `boil_stages` CSV column) for stovetop sections. For BKFST sections, `boil_stages` is empty — the minutes live in `cook_stages[0].minutes`. The form's `boilMinutes` field needs to fall back to `firstStage?.minutes` when `boil_minutes` is 0 or absent. Fix location: `RecipeForm.svelte` `$effect` block, `boilMinutes` assignment (~line 940). **Status: still open — affects many recipes across all categories.**

6. **Primary cook bar shows wrong method for many non-BKFST multi-section recipes.** The fix in `a105df1e` clears the primary cook field for any recipe where the v3-build API returns 2+ sections with non-raw prep methods. However, ENTR, SIDE, SAND, SAUCE, SALAD, STOCK, and SWEET multi-section recipes were built before the `cook_stages` / `cook_method` infrastructure was fully in place — many will open the edit form with incorrect (stale) primary cook values until their build JSONs are rebuilt from current CSV state. Once cook_stages annotations are complete for each category, rebuild and regenerate the bundle to propagate corrections.

3. **cook_stages annotations for non-BKFST recipes** — **COMPLETED (July 2026): SAUCE_001–027 (except SAUCE_003 onion section — see below), STOCK_001–007, SIDE_001–040, BKFST, SAND, SOUP, SWEET, SALAD** all converted to physics with no locked yfw values. Remaining: **ENTR** (locks on ~50 sections pending unlock sessions), **CRUST** (2 locked sections), and **SAUCE_003 onion section** (deferred — requires `covered_sweat_aromatic` fill class calibration before physics model can correctly compute yfw; covered slow-sweat of onions has no existing fill class; `braise` model produces yfw=0.965 which is wrong, `sauteed_aromatic` model is open-pot and also wrong). All converted categories use `pm/cm/boil_stages/cook_stages/fill_class` pattern; top bar `cook_minutes`/`cook_temp_f` set directly in `recipes.csv`.

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
| `Top bar: Simmer (uncovered) \| 90 min` | `cooking_method='simmer'`, `cook_minutes=90` | "Simmer · 90 min" |
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
| `boiled (covered)` | `boiled covered` | `boiled covered` | time in minutes | *(none — absorption model for covered rice/grains)* |
| `scalded` | `scalded` | `scalded` | time in minutes | calibrated food-specific fill class when water loss is not simple boiling |
| `simmer (uncovered)` | `simmer` | `simmer` | time in minutes | `simmer_sauce` for butter/cream/sauce; none for plain liquid reduction |
| `sub-simmer (uncovered)` | `sub-simmer` | `sub-simmer` | time in minutes | `simmer_sauce` for cream/butter sauces |
| `sauteed` | `sauteed` | `sauteed` | time in minutes | `sauteed_aromatic` for garlic/onion/shallot/sofrito/sliced mushroom aromatics; `fried_meat` for ground meat/sausage |
| `pan seared` | `pan seared` | `pan seared` | time in minutes | `pan_grilled_chicken` (chicken/fish); `fried_meat` (ground meat, sausage, bacon) |
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

**Example — Spaghetti Bolognese (`Top bar: Simmer (uncovered) | 90 min`):**

| Spec line | pm | cm | boil_stages |
|---|---|---|---|
| `Prep Pasta \| boiled \| 8 min` | `boiled` | `simmer` | `8` |
| `Prep: Vegetables \| pan seared \| 9 min` | `pan seared` | `simmer` | `9` |
| `Prep: Tomatoes \| unheated` | `''` | `simmer` | *(empty)* |

**Example — Cacio e Pepe (`Top bar: blank`):**

| Spec line | pm | cm | boil_stages |
|---|---|---|---|
| `Prep Pasta \| boiled \| 8 min` | `boiled` | `boiled` | `8` |
| `Prep: Sauce \| unheated` | `''` | `raw` | *(empty)* |

---

#### `(uncovered)` qualifier

`simmer (uncovered)` and `sub-simmer (uncovered)` are display labels — the `(uncovered)` part is not stored anywhere. It just confirms that the open-pot evaporation model applies (the default for `simmer` and `sub-simmer`). The CSV value is simply `simmer` or `sub-simmer`.

`boiled (covered)` stores as `boiled covered`. It uses boiled retention at 212°F plus the covered-lid evaporation factor (5% of open-pot evaporation). Use it for covered rice, covered grains, or covered boiling prep steps where `braise` would be semantically wrong.

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
| Absorber-driven oatmeal / cooked oats | Recipe-level primary `fill_class=none`; keep section `fill_class` blank — absorption model computes `yfw` |
| Regular white long-grain rice parboiled before a covered braise, then drained | `parboiled_long_grain_rice` — supplies parboil water internally at 1.05 cups per cup of rice and uses the binding-based partial absorber endpoint. Do not add a water row or suggest a parboil time; use the 70% doneness endpoint. Do not reuse for fully boiled rice or other grains. |
| Cheese omelette / Denver omelette / Frittata Herbs and Cheese | Recipe-level primary `fill_class=none`; keep section `fill_class` blank — calibrated `yfw=1.00`, not `fried_meat` |
| Poached egg from raw whole egg | `poached_egg` — fixed `yfw=0.983687` from NDB 1123 raw whole egg → NDB 1131 poached egg; simmer time is display/doneness guidance only |
| Fried egg from raw whole egg | `fried_egg` — fixed `yfw=0.841897` from NDB 1123 raw whole egg → NDB 1128 fried egg by protein conservation; fry time is display/doneness guidance only |
| Scrambled egg from raw whole egg | `fill_class=none` — NDB 1132 is an outlier, not a clean moisture-calibration pair, because it carries added-ingredient/sample effects; set the section fill class explicitly to `none` so neutral `yfw=1.0` applies |
| Crusted quiches (`BKFST_025`–`BKFST_028`) | Recipe-level primary `fill_class=none` and filling section `fill_class=none` pending better calibration data — do not use top-bar `pastry` or section `dairy_custard` for these until the assembled pastry/custard bake is calibrated |
| Butter + cream sauce, simmering | `simmer_sauce` |
| Garlic, onion, shallot, sofrito, or sliced mushroom aromatic sauté | `sauteed_aromatic` |
| Larger sautéed vegetable pieces (broccoli florets, green beans, zucchini chunks, etc.) | Calibrate a distinct vegetable-specific fill class before use |
| Ground beef, sausage (fat stays or drains) | `fried_meat` |
| Pre-cooked sliced ham browned briefly | `fill_class=none` — already-cooked cured ham used for quick browning should not use `fried_meat`; set explicitly to `none` unless a ham-specific moisture-loss class is calibrated |
| Chicken breast, fish fillet (pan seared) | `pan_grilled_chicken` |
| Thin steak (pan seared, skirt/flank-style) | `pan_grilled_steak` |
| Thick steak (pan seared) | Calibrate a distinct steak-specific fill class before use |
| Lamb shoulder or cubed lamb (braised) | Calibrate a distinct lamb-specific braise fill class before use; do not reuse `braised_beef` without validation |
| Breaded fried shrimp (flour, cornmeal, cracker crumb, panko, or other dry coating) | `fried_breaded_shrimp` |
| Breaded fried chicken breast tender/strip (flour, cornmeal, cracker crumb, panko, or other dry coating) | `fried_breaded_chicken_tender` |
| Breaded fried fish fillet (flour, cornmeal, cracker crumb, panko, or other dry coating) | `fried_breaded_fish_fillet` |
| Wet-battered fried cutlet or fillet protein (beer batter, tempura-style, thick batter) | Calibrate a distinct `fried_battered_*` class before use |
| Legacy battered/breaded fried cutlet proxy (chicken fried steak, schnitzel, Milanese) | `fried_chicken` |
| Bacon (fat retained, not drained) | `fried_meat` |
| Roux cooked briefly in fat before liquid is added | `pan_grilled_batter` |
| Baked pasta/grain casserole | `casserole_baked` |
| Pizza dough / pastry crust | `pastry` or `thin_pizza_crust` |
| Pizza cheese topping | `pizza_cheese_topping` |
| Spinach wilted in pan | `wilt_squeezed_spinach` |
| Spinach scalded with boiling water, drained, and squeezed | `scalded_squeezed_spinach` |
| Other scalded foods (cabbage, milk, cream, tomatoes/peaches for peeling, poultry skin, meat tenderizing, green beans/broccoli color-setting) | Calibrate a distinct fill class only when the scalding changes retained water or edible yield |
| Vegetables roasted | `roasted_vegetable` |

Use `breaded` for dry-coated fried foods (flour dredge, cornmeal, cracker crumb, panko). Reserve `battered` for wet batter (beer batter, tempura-style, thick batter). The breaded shrimp class is protein-specific: TodayPage testing showed shrimp uniquely continued dripping moisture while resting over the oil, so do not reuse it for fish or chicken. `fried_chicken` is a legacy class name, not a poultry-only rule. It remains only as a proxy for older battered/breaded cutlets that have not received a food-specific class yet. Do not use fried protein classes for ground meat patties, loose sausage, or bacon; those remain `fried_meat`.

#### Procedure when adding a new fill class

Every new fill class must be added to all computation and UI surfaces in the same change. A fill class stored in Turso is just data; the frontend bundle must also know the key so the editor can display it as a valid human-friendly option.

1. **Classify the model type first.**
   - Use a binding coefficient when water loss depends on cook method, temperature, time, and ingredient free-water behavior.
   - Use a fixed `yfw` only when a USDA raw/cooked pair defines a cooked endpoint and elapsed time should not change the result, such as `poached_egg`.

2. **Update the Python dev pipeline.**
   - Binding class: add the key and calibrated coefficient to `recipes_v3/lib/yield_calc.py::BINDING` with the calibration note. For a partial absorber class such as `parboiled_long_grain_rice`, the absorber branch in `build.py` must explicitly use the class coefficient instead of the ingredient's full-cook `bin` factor.
   - Fixed-yield class: add the key and value to `recipes_v3/lib/yield_calc.py::FIXED_YIELD_WATER` with the raw/cooked NDB pair note.

3. **Update the TypeScript community pipeline in the same commit.**
   - Binding class: add the same key and coefficient to `src/lib/nutrition/yieldCalc.ts::BINDING`, and make the community absorber branch honor that override as Python does.
   - Fixed-yield class: add the same key and value to `src/lib/nutrition/yieldCalc.ts::FIXED_YIELD_WATER`.
   - Do not add a class to only one side. Dev recipes and community recipes must compute the same nutrition.

4. **Update editor UI labels.**
   - Add a human-friendly label in `src/lib/farmers-basket/RecipeForm.svelte::FILL_CLASS_LABELS`.
   - Confirm `FILL_CLASS_OPTIONS` includes the new class source (`BINDING` or `FIXED_YIELD_WATER`).
   - Confirm the unknown-value fallback checks the combined known set, not only `BINDING`; otherwise Turso can send a valid class and the UI will still show `unknown current value`.

5. **Document the class in this fill-class guide.**
   - Add one row in the table above with when to use the class, what ingredient/technique it represents, and whether it is binding-based or fixed-yield.
   - If the class should not be reused for adjacent foods, say so explicitly.

6. **Apply it to recipe data only after the model and UI know the key.**
   - Update `recipe_sections.csv` for section-owned classes or `recipes.csv` for primary/top-bar-owned classes.
   - Rebuild the affected recipe: `python recipes_v3/tools/build_all.py --recipe RECIPE_ID`.
   - Upload to Turso: `python recipes_v3/tools/upload.py --recipe RECIPE_ID --commit`.
   - Regenerate the bundle when recipe-visible data changed: `python recipes_v3/tools/generate_bundle.py`.

7. **Validate both data and code before shipping.**
   - Run the narrow recipe build/upload checks for the affected recipe.
   - Run `npm run check -- --threshold error` after TypeScript/Svelte changes.
   - For fixed-yield classes, add or run a small parity check proving time changes do not alter `yfw`.
   - Commit and push so Vercel deploys the updated frontend bundle; Turso alone cannot teach an old deployed UI a new fill-class key.

#### Multiple Primary Cook Recipes

- Frittata Herbs and Cheese

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
| `grilled` | `pan seared` or `sauteed` | Skillet/griddle cooking is not BBQ grill; choose `sauteed` for moderate moving ingredients, `pan seared` for high direct pan contact |
| `fried` | `pan seared` or `sauteed` | Skillet cooking is not deep fry; choose by heat/intensity |
| `steamed` | `simmer` | Hollandaise Sauce |
| component-ref section displays `raw` in Turso/form | keep source section `raw`; fix uploader/display metadata from child recipe | Eggs Benedict muffin + hollandaise sections |
| `fried` | `pan seared` | Eggs Benedict Canadian bacon section |
| `baked` on filling section | `raw` | Quiche filling sections (see quiche pattern below) |
| `raw` on sausage component-ref | `pan seared` | BKFST_037 Croissant Sausage |

**Rule: `grilled` = outdoor/open-flame grill, broiler grate, or waffle iron. Use `sauteed` for moderate skillet/griddle cooking with frequent movement (aromatics, vegetables, crepes/pancakes where gentle griddle heat is intended). Use `pan seared` for higher-heat direct pan contact (browned proteins, Canadian bacon, cutlets, crisped surfaces). Do not author new `pan grilled` rows.**

### Composite recipe (component-ref) section fixes

Component recipes are consumed as finished recipe ingredients. Do not inline or expose the child recipe's leaf ingredients in the parent just to make display or physics work. The parent ingredient row stays as `@CHILD_ID`, and parent nutrition uses the child's built per-100g panel.

For **pure component sections** (every ingredient row in the section is an `@` recipe ref):

- Keep `recipe_sections.csv::cook_method='raw'` and yield factors at 1.0. This is the source/math convention: the parent is not re-cooking the child.
- Keep `source_recipe=CHILD_ID` and the `@CHILD_ID` ingredient row intact.
- Display/editor JSON may show the child recipe's actual cook method (for example `BKFST_002` biscuit displays `baked` from `BKFST_001`). `upload.py` resolves this when writing `sections_json`; do not change the CSV section to force the display label.

For **mixed or cooking-liquid sections** (an `@` recipe ref shares a section with regular ingredients), the section's own method and physics apply. Example: stock used as the cooking liquid for rice belongs in the same heated rice section, not in a separate pure raw component section.

### Quiche pattern (primary cook with assembly-only sections)

For baked dishes where the assembly steps involve no heat (press crust, mix filling) and the entire bake happens as a single final step:

- **All assembly sections**: set `cm=raw`, clear section `fill_class`, and clear section `cook_stages`. The sections show "no heat" in the section headers.
- **Recipe row**: set `cooking_method=baked`, `cook_temp_f=<oven temp>`, `cook_minutes=<minutes>`, and the recipe-level primary `fill_class` (for example `pastry`). The primary cook bar shows "Bake | N min | T°F" and exposes the fill class separately from section metadata.
- **Turso sync**: recipe-level primary cook fill classes live in `recipes.csv` as `fill_class`, `cook2_fill_class`, and `cook3_fill_class`, mirroring the three primary cook method slots in Turso. Do not move these values into `recipe_sections.csv` just to make the form show them.
- **Build behavior**: the Python and TypeScript builders apply the recipe-level primary cook as the effective heat for all raw non-finish sections. Section metadata remains raw/none for the form; physics derives water yield from the effective primary cook.

This pattern applies to any dish where: multiple ingredient groups exist, but only the combined bake/cook matters as the primary step. Examples: quiches, casseroles, stratas, gratins, lasagnas.

### Primary-owned `fill_class` in section JSON

Some legacy/physics rows still keep a section-level `filling_class` in `recipe_sections.csv` even after the matching primary top-bar `fill_class` has been added to `recipes.csv`. This is allowed for Python build continuity, but the serialized UI data must not duplicate ownership.

When a section's `filling_class` equals the recipe-level primary `fill_class`, the section `cook_method` equals the recipe `cooking_method`, and `primary_entry_stage` is blank or `1`, `upload.py` and `generate_bundle.py` must write the section JSON/bundle `fill_class` as blank/omitted. The top bar owns that fill class. This rule applies even if the section has prep heat; prep/no-prep is not the ownership test.

Do keep a section `fill_class` in JSON when it is genuinely prep-owned or stage-owned: the value differs from the top-bar fill class, the section uses a different method, or `primary_entry_stage` is `2` or `3`. The TypeScript V3 builder falls back to the active primary fill class when the section value is absent, so physics still receives the top-bar value without duplicating it in section metadata.

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
- [ ] `cooking_method` is one of: `raw`, `boiled`, `scalded`, `steamed`, `baked`, `fried`, `sauteed`, `pan seared`, `grilled`, `microwave`
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
| `cooking_method` | One of: `raw`, `boiled`, `scalded`, `steamed`, `baked`, `fried`, `sauteed`, `pan seared`, `grilled`, `microwave` |
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

**Default rule for dev recipe templates:** keep cooking liquids in the visible heated section that uses them. If chicken broth simmers with chicken, put `@STOCK_003` in the Chicken section. If stock boils with rice, put the stock row in the Rice/Risotto section. This is the only pattern a community user can see, understand, and recreate in the form.

**Rare internal-use exception:** `cook_section` may decouple display from math for legacy/admin data, but do not use it for a user-facing dev template when the hidden destination section carries heat, minutes, or evaporation physics. A separate raw Chicken Broth header with hidden `cook_section=chicken` leaves the visible recipe misleading: the user sees broth as unheated even though nutrition depends on simmering it. Prefer the mixed/cooking-liquid section pattern below.

| | `section` | `cook_section` |
|---|---|---|
| Display grouping | ✅ used | ignored |
| Pipeline nutrient math | ignored | ✅ used (falls back to `section` if empty) |

**Preferred pattern — stock as cooking liquid in the visible heated section:**

```
# recipe_sections.csv
SIDE_036, risotto, Risotto, boiled, ...   ← bin model fires here

# recipe_ingredients.csv
SIDE_036, 1, @STOCK_003, "4 cups Chicken Broth (recipe)", 960g, section=risotto
SIDE_036, 2, rice_white_short_raw, ...,    section=risotto, cook_section=(empty)
```

Result: the Risotto section visibly contains both the broth and rice, and the bin model sees the 960g of broth water inside the risotto section and computes the correct auto_yfw. A community user can recreate this directly.

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

### comboo.db path for local builds

The v3 pipeline reads USDA nutrient data from `comboo.db`. The default path in
`recipes_v3/config.py` points to the shared JetFoodData checkout, which may not
be available in every workspace. For builds in this repository, set the
supported environment override to the workspace copy before running the build:

```bash
export RECIPES_V3_COMBOO_DB="$PWD/docs/comboo.db"
```

Run that export from the repository root once per terminal session. It applies
to all subsequent `build_all.py` commands in that session. For a one-off build,
prefix the command instead:

```bash
RECIPES_V3_COMBOO_DB="$PWD/docs/comboo.db" \
   python3 recipes_v3/tools/build_all.py --recipe RECIPE_ID
```

Always keep `--recipe RECIPE_ID` (repeat it for multiple IDs); a bare
`build_all.py` rebuilds the entire catalog and dirties unrelated build output.

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

**Sandbox rule:** Run `git push` with network access outside the terminal sandbox. If the sandbox blocks the push, do not retry it inside the sandbox; rerun the same command from an unsandboxed host terminal or request unsandboxed execution. Confirm the remote reports `main -> main` before declaring the push complete.

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
| `recipes.csv` (pipeline source of truth) | pipeline format | `baked`, `sauteed`, `pan seared`, `boiled`, `raw` |
| Turso `dev_recipes.cooking_method` | UI format | `Bake`, `Sauté`, `Pan sear`, `Boil`, `No heat` |
| `RecipeForm.svelte` `COOKING_METHODS` | UI format | `Bake`, `Sauté`, `Scalded`, `Pan sear`, `Boil`, `No heat` |

**Rule:** `cooking_method` must be stored in UI format in Turso for all recipes — dev and community alike. Community recipes are saved through RecipeForm.svelte, which writes UI-format values. Dev recipes are inserted via `insert_new.py`, which normalizes pipeline format to UI format at insert time using `_normalize_cook_method()`.

**Normalization map (`insert_new.py::_normalize_cook_method` and `/moderate/+page.svelte::normalizeCookingMethod`):**

| Pipeline (recipes.csv) | UI (Turso / RecipeForm) |
|---|---|
| `baked` | `Bake` |
| `boiled` | `Boil` |
| `simmer` | `Simmer` |
| `sub-simmer` | `Sub-simmer` |
| `braise` | `Braise` |
| `sauteed` | `Sauté` |
| `scalded` | `Scalded` |
| `pan seared` | `Pan sear` |
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
2. Clear every assembly section's `fill_class`. A raw section should not show a pastry/custard/etc. fill class in the form.
3. Set the recipe's `cooking_method` to the actual method (e.g. `baked`) in `recipes.csv`.
4. Set `cook_temp_f` and `cook_minutes` directly in `recipes.csv`; these drive the primary cook bar and provide the effective stages for Python physics when all non-finish sections are raw.
5. In `build.py` `_build_recipe_multi()`: when all non-finish sections are raw and `recipe.cooking_method` is a non-raw primary method, the builder uses that primary method as the effective cook for retention and yield while preserving raw section metadata in `sections_json`.

**Key invariant:** quiche-pattern section metadata remains raw/no fill class for display. The top bar stores the primary cook method, time, and temperature.

---

## TODO / Deferred Work

### Tomorrow — approve Foundation Foods search keys (2026-08-12)

- Review all 363 Foundation Foods rows individually.
- Approve the curated `keyword` and `key0`–`key8` search values for each row; do not generate them automatically from the description.
- Use the existing SR Legacy key conventions as a reference, including the distinction between the primary `keyword` and supplemental key fields.
- Do not write approved search keys to local `docs/comboo.db` until each entry has been reviewed and approved.
- After approval, update and validate local search results before considering any production Turso synchronization.

### Completed: `pan grilled` → `pan seared` physics migration

Completed 2026-07-23. All stored `pan grilled` recipe and section methods were migrated to `pan seared`, the affected recipes were rebuilt through physics, and the rebuilt nutrition was uploaded to Turso. `pan seared` is now the canonical stored value for higher-heat direct pan contact and uses the explicit **230°F** evaporation path in `_method_stovetop_temp()`.

`pan grilled` is no longer an authoring value. If an old reference is found, replace it with either `pan seared` or `sauteed` and rebuild that recipe before upload.

**During future audits, evaluate whether sections should be `sauteed` instead of `pan seared`:**
Now that `sauteed` (200°F) is a first-class method scoped to aromatics and vegetable softening, some `pan seared` sections may be better reclassified:
- Onion/garlic/shallot softening in butter or oil → `sauteed`
- Short vegetable sweating (celery, peppers, mushrooms as aromatics) → `sauteed`
- Protein sections (chicken breast, fish fillet, ground meat) → stay `pan seared`
Reclassifying to `sauteed` also changes evaporation temp (200°F vs 230°F), so physics rerun is required for those sections too.

---

### Cook method UI additions (from `docs/cook_temp_proposal.md`)

- Add `stir-fried` as a first-class UI method:
  - `RecipeForm.svelte`: add to `SECTION_COOKING_METHODS`, `SECTION_PREP_METHODS`, `COOKING_METHODS` (between Sauté and Pan sear), `normalizeCookMethodLabel`
  - `build.py::_method_stovetop_temp`: change `stir-fried` from 230°F → **220°F** (separate from `pan seared` 230°F)
  - `buildRecipeCommunityV3.ts` + `buildRecipeCommunity.ts`: same temp split in `methodStovetopTempF()`
  - `buildRecipeCommunityV3.ts::HINT_COOK_MAP`: add `stir-fried` to `pan_grilled_chicken` and `fried_meat` hint lists
  - `insert_new.py` and `moderate/+page.svelte`: add `stir-fried` to normalization maps
  - `docs/recipe_development.md`: add `stir-fried` row to cook_method keyword table and fill_class guide

- Add `deep-fried` as a first-class UI method:
  - `RecipeForm.svelte`: add to `SECTION_COOKING_METHODS`, `SECTION_PREP_METHODS`, `COOKING_METHODS`
  - Physics: alias to `fried` retention at 212°F — no temp change needed
  - `insert_new.py` and `moderate/+page.svelte`: add to normalization maps
  - `docs/recipe_development.md`: add `deep-fried` row to cook_method keyword table

---

### Staged primary cook timeline

Current top-bar authoring supports one primary assembled cook. Some recipes need an ordered visible cook timeline instead of a single top-bar method because the later phase is still part of the primary cook, not a finish or section-only prep.

Examples to use as validation cases when designing this:
- `ENTR_075` Lamb Tagine: covered braise 30 min, then add chickpeas and dried apricots and continue covered braise 20-30 min. It now uses the staged primary-cook model; `braised_beef` remains a provisional substitute until lamb braise physics is calibrated against a lamb reference.
- `ENTR_076` Lamb Moussaka: staged bake where an assembled covered phase and later uncovered/browning phase both belong to the primary cook timeline.
- `ENTR_081` Lamb Biryani: staged covered rice/lamb cook where primary cook phases and section participation need explicit timeline support.
- Beef Lasagna: best concrete UI/spec test case. Bake covered, then bake uncovered. The covered/uncovered distinction changes evaporation and must be visible to community users.

Expected authoring format for the Beef Lasagna validation case:

```text
Beef Lasagna

Top bar 1: Bake (covered) | 375 | 30 min
Top bar 2: Bake (uncovered) | 375 | 17 min

Prep: Pasta | boiled | 8 min | ingredients: lasagna noodles, water
Prep: Brown Beef | pan seared | 11 min | ingredients: ground beef, olive oil
Prep: Onion & Garlic | pan seared | 3 min | ingredients: onion, garlic
Prep: Tomatoes & Spices | simmer (lid off) | 17 min | ingredients: crushed tomatoes, tomato puree, oregano, basil, salt, black pepper
Prep: Cheese Filling | unheated | ingredients: ricotta, mozzarella, Parmesan, egg, parsley, salt, black pepper
```

In the edit form this should render as a **Primary Cook Timeline** with `Assembled / Primary` and `Assembled / Primary 2`. Normal prep stages feed the initial assembly before Primary 1. A later primary stage may expose `Add prep before this stage` for rare ingredient additions between primary cook phases.

Expected authoring format for the Lamb Tagine validation case, where additional ingredients are added before the second primary cook:

```text
Lamb Tagine

Top bar 1: Braise (covered) | 30 min
Top bar 2: Braise (covered) | 25 min
Prep before Top bar 2: Additional Ingredients 2 | unheated | ingredients: chickpeas, apricots, honey, lemon juice

Prep: Brown Lamb | pan seared | 4 min | ingredients: lamb, salt, cayenne pepper
Prep: Onion | sauteed | 9 min | ingredients: onion
Prep: Seasoning | sauteed | 1 min | ingredients: garlic, ginger, paprika, cumin, coriander, cinnamon, turmeric, cayenne
Prep: Tomatoes | simmer (uncovered) | 2 min | ingredients: crushed tomatoes
```

In the edit form, the `Additional Ingredients 2` prep stage belongs inside the `Assembled / Primary 2` timeline card as `Add prep before this stage`. Those ingredients are excluded from Primary 1 and included in Primary 2.

`ENTR_075` currently uses `braised_beef` as a provisional substitute for the missing calibrated lamb braise fill class. This is a known modeling limitation, not validated lamb physics; replace it after calibrating against lamb shoulder or cubed lamb before treating the result as lamb-specific.

### Deferred: `simmered_pork` fill class (ENTR_082 Pork Carnitas)

Pork Carnitas uses `braised_beef` as a temporary physics proxy for its 100-minute uncovered simmer before the 4-minute broil. This is a stopgap: the existing class is calibrated to a beef brisket braise, not pork shoulder simmered in citrus and its rendered fat. The recipe must remain marked as proxy-based until a pork-specific class is available.

What is needed: calibrate a `simmered_pork` fill class against a raw pork shoulder/butt NDB and a cooked pork reference that matches the carnitas process (uncovered simmer, liquid reduction, rendered fat, then brief broiling). Replace `braised_beef` in `ENTR_082` after calibration and rebuild the recipe through the physics pipeline.

Permanent naming rule for stage-entry additions: use numbered section labels tied to the primary cook stage they feed. Ingredients present before Primary 1 use `Prep: Additional Ingredients 1`; ingredients added after Primary 1 and before Primary 2 use `Prep: Additional Ingredients 2`; ingredients added after Primary 2 and before Primary 3 use `Prep: Additional Ingredients 3`. These ingredients still live in the same ingredient list as all other prep ingredients; the stable numbered section name plus the section's primary-entry metadata removes ambiguity in generated JSON and Turso section data.

Storage rule: do not create separate arrays such as `additionalIngredients2` or `additionalIngredients3`. Stage-entry ingredients are ordinary rows in `recipe_ingredients_json` / `recipe_ingredients.csv` whose `section` is the matching normal section key, e.g. `additional_ingredients_2` or `additional_ingredients_3`. The matching section row carries the visible label (`Additional Ingredients 2`) and `primary_entry_stage=2`, so the codebase knows exactly which primary cook stage first includes those ingredients.

Participation rule: a section's `primary_entry_stage` is the first primary cook stage that applies to that section. Blank or `1` means the section is present before Primary 1 and participates in Primary 1, Primary 2, and Primary 3. `primary_entry_stage=2` means the section skips Primary 1 and participates only in Primary 2 and Primary 3. `primary_entry_stage=3` means the section participates only in Primary 3. Example: Beef Lasagna ingredients present at assembly get both covered and uncovered bake stages; cheese added before a later Cook2 stage would get only Cook2 and later stages, never Cook1.

`Additional Ingredients N` sections are normal recipe sections and must support the same section-level physics fields as any other section, including `fill_class`. The moderator edit form already allows setting a fill class per section; the staged primary model must preserve that capability for these numbered sections, and the later community recipe path should expose the same control. `primary_entry_stage` answers *when this section joins the primary timeline*; `fill_class` answers *how this section's ingredients behave under the cook stages they participate in*.

Future model should be a **Primary Cook Timeline** rather than duplicate independent top bars. Each phase needs method, covered/uncovered state, time, optional temp, display label, and section/ingredient participation so both UI rendering and moisture physics can follow the same staged cook plan.

---

### Deferred: `covered_sweat_aromatic` fill class (SAUCE_003 onion section)

The Soubise Sauce (SAUCE_003) onion section uses a covered slow-sweat technique — 907g onions cooked in butter over very low heat with the lid on for 30–40 min until completely melted and translucent (no browning, no added liquid). This produces ~517g cooked (yfw≈0.45 from original calibration).

No existing fill class models this correctly:
- `sauteed_aromatic` (200°F, open-pot) — wrong: it's covered
- `braise` (185°F, covered, 5% of open-pot evaporation) — computes yfw=0.965 (near-zero water loss), which is physically wrong for 35 min of onion sweating

**What is needed:** A new `covered_sweat_aromatic` fill class calibrated against a USDA raw/cooked onion NDB pair for covered stovetop cooking. Calibration approach: find or measure onion water content after 35 min covered low-heat sweat; derive `binding_coeff` from that reference.

**Until calibrated:** SAUCE_003's onion section retains its current `pm='braise'`, `cm='sub-simmer'` state and is excluded from the physics-complete claim. Do not clear the section's locked `yfw` until this fill class exists.

---

### `sauteed` reclassification candidates

Sections currently stored as `pan seared` that should be reclassified to `sauteed` based on instruction analysis. Most involve aromatic softening (onion, garlic, peppers, mushrooms, carrots, celery) cooked at **medium heat** — not protein searing. Larger sautéed vegetable pieces need a separate calibrated fill class before being treated as water-loss equivalents.

**Steps required per section:**
1. Update `recipe_sections.csv` — change `cook_method` (and/or `prep_method`) from `pan seared` → `sauteed`
2. Rerun physics: `python recipes_v3/tools/build_all.py --recipe RECIPE_ID`
3. Verify macros — evaporation temp drops from 230°F → 200°F; water column may shift slightly
4. Upload: `python recipes_v3/tools/upload.py --recipe RECIPE_ID --commit`
5. Commit CSV change

Sections marked **two-stage** have `cook_method` = simmer/braise/baked (the assembled cook); only `prep_method` changes.

#### Completed `sauteed` reclassifications

| Recipe | Recipe Name | Section key | New method | Label |
|---|---|---|---|---|
| ENTR_015 | Beef Steak Diane | shallots_garlic | sauteed | Shallots and Garlic |
| ENTR_015 | Beef Steak Diane | mushrooms | sauteed | Mushrooms |
| ENTR_015 | Beef Steak Diane | brandy | simmer | Brandy |
| PASTA_007 | Lemon Pasta | garlic | sauteed | Garlic |
| PASTA_010 | Cheese Ravioli | wilted_spinach | scalded | Wilt spinach |
| PASTA_010 | Cheese Ravioli | brown_butter | sauteed | Brown butter |
| PASTA_010 | Cheese Ravioli | garlic_sage | sauteed | Garlic sage |
| SAND_042 | French Dip | onion_saute | sauteed *(broil cm)* two-stage | Sautéed onion |
| SAND_059 | Mushroom Swiss Burger | onion | sauteed | Caramelized onion |
| SAND_059 | Mushroom Swiss Burger | mushrooms | sauteed | Mushrooms |
| SIDE_010 | Tartiflette | bacon | sauteed *(baked cm)* two-stage | Bacon |
| SIDE_010 | Tartiflette | onion_garlic | sauteed *(baked cm)* two-stage | Onion & garlic |
| SIDE_010 | Tartiflette | white_wine | simmer *(baked cm)* two-stage | White wine |
| SIDE_006 | Potato Salad (German Style) | bacon | sauteed | Bacon |
| SIDE_006 | Potato Salad (German Style) | onion | sauteed | Onion |
| SIDE_019 | Mac and Cheese | roux | sauteed *(baked cm)* two-stage | Roux |
| SIDE_029 | Creamed Corn | roux | sauteed *(simmer cm)* two-stage | Roux |
| SAUCE_025 | Red Enchilada Sauce | onion_mixture | sauteed *(simmer cm)* two-stage | Onion and garlic |
| SAUCE_025 | Red Enchilada Sauce | tomatoes | simmer *(simmer cm)* two-stage | Tomatoes and spices |
| SAUCE_027 | Italian Marinara Sauce | onion | sauteed *(simmer cm)* two-stage | Onion |
| SAUCE_027 | Italian Marinara Sauce | garlic | sauteed *(simmer cm)* two-stage | Garlic |
| SAUCE_001 | Béchamel Sauce | roux | sauteed *(simmer cm)* two-stage | Roux |
| SAUCE_006 | Velouté | roux | sauteed *(sub-simmer cm)* two-stage | Roux |
| SAUCE_015 | Cheese Sauce for Vegetables | roux | sauteed *(sub-simmer cm)* two-stage | Roux |
| SIDE_028 | Braised Collard Greens | onions | sauteed *(simmer cm)* two-stage | Onions |
| SIDE_028 | Braised Collard Greens | garlic | sauteed *(simmer cm)* two-stage | Garlic |
| SIDE_030 | Creamed Spinach | onion | sauteed *(sub-simmer cm)* two-stage | Onion |
| SIDE_030 | Creamed Spinach | garlic | sauteed *(sub-simmer cm)* two-stage | Garlic |
| SIDE_035 | Rice Pilaf | onion | sauteed *(braise cm)* two-stage | Onion |
| SIDE_035 | Rice Pilaf | garlic | sauteed *(braise cm)* two-stage | Garlic |
| SIDE_036 | Risotto | onion | sauteed *(simmer cm)* two-stage | Onion |
| SIDE_036 | Risotto | garlic_thyme | sauteed *(simmer cm)* two-stage | Garlic & thyme |
| SIDE_036 | Risotto | wine | simmer *(simmer cm)* two-stage | Wine |
| STOCK_006 | Fish Stock | onion | sauteed *(sub-simmer cm)* two-stage | Onion and aromatics |
| PASTA_005 | Garlic Butter Shrimp Pasta | garlic | sauteed *(simmer cm)* two-stage | Garlic |
| ENTR_001 | Chicken Fried Steak | roux | sauteed | Roux |
| ENTR_013 | Beef Curry | onions | sauteed | Onions |
| ENTR_013 | Beef Curry | garlic | sauteed | Garlic & Ginger |
| ENTR_013 | Beef Curry | curry_tomato_paste | sauteed | Curry and Tomato Paste |
| ENTR_014 | Beef Ropa Vieja | onions_peppers | sauteed | Onions and Peppers |
| ENTR_014 | Beef Ropa Vieja | garlic | sauteed | Garlic |
| ENTR_014 | Beef Ropa Vieja | cumin_oregano | sauteed | Cumin and Oregano |
| ENTR_014 | Beef Ropa Vieja | tomato_paste | sauteed | Tomato Paste |
| ENTR_017 | Beef Goulash | onions | sauteed | Onions |
| ENTR_017 | Beef Goulash | garlic_bell_pepper | sauteed | Garlic and Bell Peppers |
| ENTR_017 | Beef Goulash | spices | sauteed | Spices |
| ENTR_017 | Beef Goulash | tomato_paste_section | sauteed | Tomato Paste |
| ENTR_019 | Beef Hamburger Steak | onions | sauteed | Onions |
| ENTR_019 | Beef Hamburger Steak | mushrooms_garlic | sauteed | Mushrooms and Garlic |
| ENTR_019 | Beef Hamburger Steak | flour | sauteed | Flour |
| ENTR_029 | Beef Osso Buco | vegetables | sauteed *(braise cm)* two-stage | Vegetables |
| ENTR_029 | Beef Osso Buco | garlic | sauteed *(braise cm)* two-stage | Garlic |
| ENTR_031 | Beef Picadillo | onion_peppers | sauteed *(braise cm)* two-stage | Onions & Peppers |
| ENTR_031 | Beef Picadillo | garlic | sauteed *(braise cm)* two-stage | Garlic |
| ENTR_034 | Beef Ragu | vegetables | sauteed *(braise cm)* two-stage | Vegetables |
| ENTR_034 | Beef Ragu | garlic_tomato_paste | sauteed *(braise cm)* two-stage | Garlic & Tomato Paste |
| ENTR_034 | Beef Ragu | red_wine | simmer *(braise cm)* two-stage | Red Wine |
| ENTR_036 | Beef Salisbury Steak | onions_mushrooms | sauteed *(simmer cm)* two-stage | Onions & Mushrooms |
| ENTR_036 | Beef Salisbury Steak | garlic | sauteed *(simmer cm)* two-stage | Garlic |
| ENTR_036 | Beef Salisbury Steak | flour | sauteed *(simmer cm)* two-stage | Flour |
| ENTR_037 | Beef Short Ribs | vegetables | sauteed *(baked covered cm)* two-stage | Vegetables |
| ENTR_037 | Beef Short Ribs | garlic_tomato_paste | sauteed *(baked covered cm)* two-stage | Garlic & Tomato Paste |
| ENTR_039 | Beef Stroganoff | onions_mushrooms | sauteed *(simmer cm)* two-stage | Onions & Mushrooms |
| ENTR_039 | Beef Stroganoff | garlic | sauteed *(simmer cm)* two-stage | Garlic |
| ENTR_039 | Beef Stroganoff | flour | sauteed *(simmer cm)* two-stage | Flour |

#### Batch A — medium-heat-only recipes

| Recipe | Recipe Name | Section key | Current method | Label |
|---|---|---|---|---|
| ENTR_058 | Chicken Masala | sauce | pan seared | Masala Sauce |
| ENTR_095 | Pork Fried Rice | filling | pan seared | Filling |
| ENTR_110 | Seafood Paella | paella | pan seared | Seafood and Sofrito |
| ENTR_120 | Vegetarian Shakshuka | shakshuka | pan seared | Shakshuka |
#### Batch B — medium-high initial sear → reduce to medium for aromatics

| Recipe | Recipe Name | Section key | Current method | Label |
|---|---|---|---|---|
| ENTR_049 | Chicken Florentine | garlic | *(simmer cm)* two-stage | Garlic |
| ENTR_073 | Lamb Shepherd's Pie | filling | pan seared | Filling |
| ENTR_111 | Seafood Shrimp Scampi | scampi | pan seared | Shrimp Scampi |
| ENTR_118 | Vegetarian Dal | dal_base | pan seared | Dal Sauce |
| ENTR_119 | Vegetarian Chana Masala | chana_masala | pan seared | Chana Masala |
