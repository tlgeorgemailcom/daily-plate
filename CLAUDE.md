# Daily Food Chain — AI Handoff

> Claude AI is not required to ask permission to query the DataCentralCombo table in the comboo.db

## Project
SvelteKit + Svelte 5 + TypeScript food/word game. Nutrition data comes from a Python pipeline (`recipes_v3/`) that computes per-100g macros from raw ingredients using USDA SR Legacy data and FNDDS canonical references.

## Purpose and Strategic Intent of Recipe Development

Any AI assistant working on this project must understand that the recipes are not merely content — they are the primary mechanism by which this application achieves all of its goals simultaneously. This section exists so that purpose is never lost during tactical work.

**The four compounding functions of every recipe built:**

**1. User recipe templates.**
Community users build their own recipes by editing a dev recipe they recognize as "close enough." The wider and more diverse the dev recipe library, the smaller the gap between any user's intent and the nearest starting point. A user making lentil soup, red beans and rice, or baked ziti should find a dev recipe with matching cooking method, ingredient class, and structure — requiring only quantity tweaks rather than a rebuild from scratch. Coverage breadth matters as much as depth: one example of each meaningful cooking pattern is more valuable than five near-identical variants.

**2. Ingredient universe expansion.**
Every new recipe forces new entries into `ingredients_ledger.csv` and `food-portions-complete.csv`. These entries are permanent infrastructure. They expand what community users can select when building their own recipes, and they expand the word and food pool available to the chain and plate games. The ledger grows purposefully through recipe development — never arbitrarily.

**3. Game content.**
`food_word` entries tied to recipes are the raw material for both games. Recipe coverage across categories, cooking methods, and cuisines directly determines game playability and variety. A thin category produces a thin game experience in that domain.

**4. Algorithm calibration — the deepest and most important function.**
The nutrition computation pipeline (yield factors, water absorption model, fat-drain Atwater correction, fat-soluble vitamin partitioning, multi-section composition, component-ref composites) is novel. There is no prior implementation to copy or replicate. Every recipe built against a USDA canonical target (Rules A, B, C, F, G) is a calibration test. Rule C and G divergences are especially valuable: they reveal either a structural limitation of the model (irreducible, to be documented) or a modeling gap that can be closed. The more diverse the cooking methods, ingredient classes, and multi-stage compositions in the dev library, the more thoroughly the algorithm is stress-tested across its full operating range.

**The critical constraint that makes all of this urgent:**
Community users creating and editing their own recipes receive no AI assistance. The algorithm must work correctly without guidance. All modeling knowledge — smart defaults, guard rails, edge-case handling, yield factor behavior for every cooking method — must be pre-built into the code. The only way to pre-build that robustness is to encounter the edge cases in dev recipe work first, resolve them, and encode the resolution in the pipeline. Each recipe authored is a lesson permanently absorbed into the system.

**In summary:** The recipes are not the product. They are the curriculum. The product is an algorithm comprehensive enough to handle the full diversity of how humans cook — without AI assistance at runtime.

## Pipeline: recipes_v3

**Data lives in 6 CSVs** (`recipes_v3/data/`):

| File | Purpose |
|---|---|
| `recipes.csv` | Recipe metadata (22 cols: recipe_id, food_word, canonical_ndb_no, cooking_method, yield factors, status…) |
| `recipe_ingredients.csv` | Per-recipe rows (recipe_id, row_order, ingredient_key, grams, section…) |
| `ingredients_ledger.csv` | ingredient_key → NDB_No + display_name lookup |
| `recipe_sections.csv` | Named sections for multi-stage recipes (e.g. batter / filling / topping) |
| `recipe_instructions.csv` | Step-by-step cooking instructions |
| `game_design.csv` | Game presentation metadata |

**Math contract** (order is mandatory):
1. Sum raw ingredient grams
2. Apply retention factors (all macros = 1.00; micronutrients vary)
3. Apply yield model (`yield_factor_water`, `yield_factor_fat`, `yield_factor_protein`, `yield_factor_carbohydrate`, `yield_factor_other`)
4. Normalize to per-100g

**Yield factor reference:**
- `yfw` — water; `yff` — fat; `yfp` — protein; `yfc` — carbohydrate (Phase 8e); `yfo` — fat-soluble vitamins only (Phase 8f)
- When `yff`, `yfp`, or `yfc` < 1.0, Atwater energy is recomputed from retained P/F/C to avoid overcounting drained calories
- `yfo` applies only to `_FAT_SOLUBLE_NUTRIENTS` (VitK, VitA/RAE, carotenoids, VitD, VitE, tocopherols). Default `yfo=1.0` is a no-op for all non-stock recipes

**Edit-build-upload loop:**
```
python recipes_v3/tools/validate_ledger.py              # check ingredient_key integrity
python recipes_v3/tools/build_all.py --recipe RECIPE_ID  # compute macros → output/ (ALWAYS use --recipe; bare build_all.py rebuilds all 156 recipes and dirties unrelated JSON files)
python recipes_v3/tools/upload.py --recipe RECIPE_ID     # push to Turso
python recipes_v3/tools/generate_bundle.py               # write src/lib/farmers-basket/generated-levels.ts
```
Always commit `recipes_bundle.json` after generating.

**⚠️ `generate_bundle.py` silently excludes any recipe that has no rows in `recipe_instructions.csv`.** A recipe can pass audit and upload successfully yet be completely absent from the bundle and the UI. Always write instruction rows *before* generating the bundle.

**⚠️ Instruction text changes require BOTH `upload.py --commit` (updates Turso/runtime) AND `generate_bundle.py` (updates static bundle).** Running only `generate_bundle.py` after editing `recipe_instructions.csv` will leave the old text in Turso and the local app will not reflect the change.

**⚠️ Always use Python's `csv.writer` / `csv.DictWriter` to write rows to `recipe_instructions.csv`.** Instruction text frequently contains commas (e.g., "Mix salt, pepper, and herbs…"). Writing rows via shell heredoc (`cat >> file << 'EOF'`) produces unquoted CSV; `csv.DictReader` then splits the text at the first embedded comma, silently truncating the instruction. This bug will corrupt Turso after the next `upload.py --commit`. Never use heredoc for instruction rows.

**⚠️ `recipe_instructions.csv` has exactly 3 columns: `recipe_id,step_order,step_text`.** There is no `section_key` column. Writing a 4-column row (e.g. `[recipe_id, step_order, section_key, step_text]`) silently places the section key in `step_text` and discards the actual instruction text. Always write exactly `[recipe_id, str(step_num), step_text]`.

**For brand-new recipes, also run `insert_new.py` before `generate_bundle.py`** (see § insert_new.py below).

## Absorption Model (DataCentralCombo.bin)

The `bin` column in `DataCentralCombo` stores numeric **water-absorption factors** for dry starches and legumes that absorb cooking water rather than losing it. The factor equals the target cooked-water fraction of the finished ingredient.

**Math:**
```
bin_factor  = cooked_water_fraction  (e.g. 0.6213 → pasta cooks to 62.13% water)
retained_water = dry_non_water_g × bin / (1 − bin)
yfw = retained_water / raw_water_in_section
```
`yfw` will normally be >> 1.0 when the section has no explicit water ingredient (only the small residual moisture of the dry item is in `raw_water`). `build.py` handles yfw > 1 correctly: `water_lost = raw_water × (1 − yfw)` becomes negative (i.e. water gained).

**Derivation of bin from a reference cooked NDB:**
1. Look up the USDA cooked NDB water content (e.g. NDB 20521 cooked enriched pasta: 62.13% water).
2. Set `bin = cooked_water_fraction` (e.g. `0.6213`).
3. No explicit `water` row should appear in the section — the model provides the absorbed water automatically.

**Pipeline execution order (build.py priority):**
1. Absorption model fires first when `cook_method in ('boiled','simmered')` **and** the section contains at least one absorber NDB.
2. Manual `yield_factor_water` override from `recipe_sections.csv` (used for locked recipes only).
3. Physics-based evaporation model (`calc_yield_water`).
4. Default `yfw = 1.0`.

**Paths that implement this model:**
- Python pipeline: `DataCentralCombo.bin` → `load.py` → `nuts["_absorption_factor"]` → `build.py` `st["absorbers"][]` → weighted-average factor → auto-yfw.
- TypeScript community path: `bin` → `NutrientRow.absorptionFactor` (`types.ts`) → `buildRecipeCommunity.ts` weighted-average model. **Both paths must stay in sync.**

**Key authoring invariant:** Never add an explicit `water` row to a section that contains absorber NDBs. The model already accounts for absorbed water. Adding a water row inflates `raw_water` and drives `yfw` toward 1.0, silently producing an undercooked macro profile.

**Legacy `bin` values:** The column previously stored non-numeric strings (e.g. `'fridge'`, `'raw beans bin'`). `load.py` wraps the float parse in try/except and silently ignores non-numeric values. Only numeric rows trigger the model.

**56 NDBs with bin factors (ordered by bin value):**

| NDB | bin | Cooked H₂O% | Description |
|---|---|---|---|
| 16056 | 0.6021 | 60.2% | Chickpeas (garbanzo beans), mature seeds, raw |
| 16040 | 0.6120 | 61.2% | Beans, pink, mature seeds, raw |
| 20124 | 0.6180 | 61.8% | Pasta, whole-wheat, dry |
| 20135 | 0.6180 | 61.8% | Pasta, whole grain, 51% whole wheat, unenriched, dry |
| 20653 | 0.6180 | 61.8% | Pasta, whole grain, 51% whole wheat, enriched, dry |
| 20120 | 0.6213 | 62.1% | Pasta, dry, enriched |
| 20420 | 0.6213 | 62.1% | Pasta, dry, unenriched ← calibrated vs NDB 20521 |
| 16108 | 0.6255 | 62.6% | Soybeans, mature seeds, raw |
| 16042 | 0.6295 | 63.0% | Beans, pinto, mature seeds, raw |
| 16047 | 0.6298 | 63.0% | Beans, yellow, mature seeds, raw |
| 16049 | 0.6308 | 63.1% | Beans, white, mature seeds, raw |
| 16045 | 0.6324 | 63.2% | Beans, small white, mature seeds, raw |
| 16037 | 0.6381 | 63.8% | Beans, navy, mature seeds, raw |
| 16019 | 0.6465 | 64.7% | Beans, cranberry (roman), mature seeds, raw |
| 16014 | 0.6574 | 65.7% | Beans, black, mature seeds, raw |
| 16016 | 0.6574 | 65.7% | Beans, black turtle, mature seeds, raw |
| 16001 | 0.6629 | 66.3% | Beans, adzuki, mature seeds, raw |
| 16022 | 0.6657 | 66.6% | Beans, french, mature seeds, raw |
| 16030 | 0.6694 | 66.9% | Beans, kidney, california red, mature seeds, raw |
| 16032 | 0.6694 | 66.9% | Beans, kidney, red, mature seeds, raw |
| 16027 | 0.6694 | 66.9% | Beans, kidney, all types, mature seeds, raw |
| 16035 | 0.6694 | 66.9% | Beans, kidney, royal red, mature seeds, raw |
| 16074 | 0.6715 | 67.2% | Lima beans, thin seeded (baby), mature seeds, raw |
| 16135 | 0.6719 | 67.2% | Winged beans, mature seeds, raw |
| 20091 | 0.6831 | 68.3% | Pasta, gluten-free, corn, dry |
| 20044 | 0.6844 | 68.4% | Rice, white, long-grain, regular, raw, enriched |
| 20444 | 0.6844 | 68.4% | Rice, white, long-grain, regular, raw, unenriched |
| 20452 | 0.6853 | 68.5% | Rice, white, short-grain, raw, unenriched |
| 20050 | 0.6861 | 68.6% | Rice, white, medium-grain, raw, enriched |
| 20450 | 0.6861 | 68.6% | Rice, white, medium-grain, raw, unenriched |
| 16133 | 0.6880 | 68.8% | Yardlong beans, mature seeds, raw |
| 20005 | 0.6880 | 68.8% | Barley, pearled, raw |
| 16024 | 0.6900 | 69.0% | Beans, great northern, mature seeds, raw |
| 16067 | 0.6913 | 69.1% | Hyacinth beans, mature seeds, raw |
| 16078 | 0.6923 | 69.2% | Mothbeans, mature seeds, raw |
| 16069 | 0.6964 | 69.6% | Lentils, raw |
| 16144 | 0.6964 | 69.6% | Lentils, pink or red, raw |
| 16071 | 0.6979 | 69.8% | Lima beans, large, mature seeds, raw |
| 20040 | 0.7030 | 70.3% | Rice, brown, medium-grain, raw |
| 20048 | 0.7034 | 70.3% | Rice, white, long-grain, precooked or instant, enriched |
| 20046 | 0.7036 | 70.4% | Rice, white, long-grain, parboiled, enriched, dry |
| 20446 | 0.7036 | 70.4% | Rice, white, long-grain, parboiled, unenriched, dry |
| 16052 | 0.7154 | 71.5% | Broadbeans (fava beans), mature seeds, raw |
| 16083 | 0.7251 | 72.5% | Mungo beans, mature seeds, raw |
| 20028 | 0.7257 | 72.6% | Couscous, dry |
| 16080 | 0.7266 | 72.7% | Mung beans, mature seeds, raw |
| 20036 | 0.7296 | 73.0% | Rice, brown, long-grain, raw |
| 20042 | 0.7296 | 73.0% | Rice, brown, parboiled, dry |
| 20133 | 0.7382 | 73.8% | Rice noodles, dry |
| 20088 | 0.7393 | 73.9% | Wild rice, raw |
| 20009 | 0.7563 | 75.6% | Buckwheat groats, roasted, dry |
| 20054 | 0.7663 | 76.6% | Rice, white, glutinous, unenriched, uncooked |
| 20012 | 0.7776 | 77.8% | Bulgur, dry |
| 8120  | 0.8361 | 83.6% | Oats, regular and quick, not fortified, dry ← calibrated vs NDB 8121 |
| 8122  | 0.8361 | 83.6% | Oats, instant, fortified, plain, dry |
| 20033 | 0.8400 | 84.0% | Oat bran, raw |

**To add bin factors to a new NDB:** `UPDATE DataCentralCombo SET bin = '<factor>' WHERE NDB_No = <ndb>` in `/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db`, then sync to Turso comboo DB using the `libsql_experimental` client (same pattern as `insert_new.py`'s `_connect()` but targeting `TURSO_SR28_URL` / `TURSO_SR28_TOKEN`).

## insert_new.py — Initial Turso Insert

`recipes_v3/tools/insert_new.py` inserts a recipe row into Turso's `dev_recipes` table for the **first time**. It is NOT called by `upload.py`.

**Run it once per new recipe:**
```
python recipes_v3/tools/insert_new.py --recipe-id BKFST_XXX           # preview (dry-run by default)
python recipes_v3/tools/insert_new.py --recipe-id BKFST_XXX --commit  # write
```

**Before running `--commit`, verify the `_CATEGORY_MAP` covers the recipe's `category` value** (the column in `recipes.csv`). The map is near the top of `insert_new.py`. If the value is not in the map, it silently falls back to `"entrees-main-courses"`. Valid stored category IDs are defined in `src/lib/farmers-basket/recipe-categories.ts`.

Current map covers: `breakfast`, `breakfast & brunch`, `breakfast-brunch`, `soups & stews`, `soups-stews`, `salads`, `pasta & pizza`, `pasta-pizza`, `entrees & main courses`, `entrees-main-courses`, `sides`, `sweets & desserts`, `sweets-desserts`, `beverages`, `sauces & condiments`, `sauces-condiments`, `sandwiches & burgers`, `sandwiches-burgers`. (**`pasta & pizza` and `sandwiches & burgers` were added during SAND_001 build — May 2026.**)

**Component-ref child recipe must have `status='approved'` in `recipes.csv`** — otherwise `validate_ledger.py` raises `component-ref @RECIPE_ID status='' (must be 'approved')`. Set `status='approved'` and `audit_status='PASS'` on the child recipe before running the composite build. (Found during SAUCE_002 build — June 2026.)

**`upload.py` deliberately does NOT update `category`, `food_word`, `cooking_method`, or `dietary_category`** — these identity columns are set once at insert time and preserved on every subsequent upload. To correct one of these columns in Turso after the fact, use a direct SQL UPDATE via the `libsql_experimental` Python client (same pattern as `insert_new.py`'s `_connect()`). **Always call `conn.commit()` after the UPDATE** — without it the change is visible only within the same connection and is not persisted to the remote database.

## Critical Invariants
- **Never edit a v3 recipe row in the Turso UI** — it returns 423 and blocks re-uploads. Edit the CSV only.
- **Turso is the sole ingredient source** — no hardcoded nutrition values in code.
- **fat column in `comboo.db`** is literal `'n'` for recipe entries — always use `TotalLipidFat`.
- **NDB_No is stored as integer** in `comboo.db` (no leading zeros).
- `step_order` must be plain integers (not "1a", "2b").
- `cooking_method` must be one of: `raw`, `boiled`, `steamed`, `baked`, `fried`, `pan grilled`, `grilled`, `microwave`. (`pan grilled` is an alias for `fried` — same retention factors, friendlier display label.) Compound strings not supported — use `recipe_sections.csv` for multi-stage.
- `dietary_category` must be one of: `all`, `pollo-pesca`, `pollo`, `pesca`, `veggie`, `vegan`. These are the keys in `DIETARY_INCLUDES` in `RecipeBook.svelte`; any other value silently hides the recipe from all users. Enforced by `validate_ledger.py`.
- `food_word` must exist in `food-portions-complete.csv` (except Rule D).
- **Every `section` value used in `recipe_ingredients.csv` must have a matching row in `recipe_sections.csv`.** Single-section recipes may mirror the recipe-level yield factors; multi-stage recipes set per-section yields. Enforced by `validate_ledger.py` Rule 6b.

## Key Data Sources
- **SR Legacy DB**: `/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db` — table `DataCentralCombo`
- **FNDDS Ingredients CSV**: `src/lib/data/2021-2023 FNDDS At A Glance - FNDDS Ingredients 2/FNDDS Ingredients-Table 1.csv`
- **food_word validation**: `food-portions-complete.csv` (project root)

## Recipe ID Prefixes

| Prefix | Status | Count |
|---|---|---|
| `SWEET_NNN` | ✅ Complete — all 40 in production | 40 |
| `BKFST_NNN` | 🔧 In progress | 39 (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 034, 035, 036, 037, 038, 039) |
| `SAND_NNN` | 🔧 In progress | 67 (001–067) |
| `SAUCE_NNN` | 🔧 In progress | 24 (001–024) |
| `STOCK_NNN` | 🔧 In progress | 7 (001–007) |
| `ENTR_NNN` | 🔧 In progress | 12 (001, 087, 088, 089, 090, 091, 092, 093, 094, 095, 096, 097) |
| `SIDE_NNN` | 🔧 In progress | 26 (001–026) |

## Validation Rules
- **Rule A** — SR Legacy NDB canonical; all graded macros ±5%
- **Rule B** — SR Legacy NDB canonical; some macros null/zero (acceptable divergence)
- **Rule C** — SR Legacy NDB canonical; >±5% (commercial composite divergence)
- **Rule F** — FNDDS FC canonical; all graded macros ±5%
- **Rule G** — FNDDS FC canonical; >±5% divergence
- **Rule D** — No canonical match anywhere; raw-ingredient calc only

## Current Work: BKFST Recipes

**Master recipe list**: `/Users/macminidata/vscode/jetfooddata/jetcool/docs/recipe_list.md`

Planned BKFST order (standalone components first, composites last):

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| BKFST_001 | Biscuit (savory) | 18016 | Rule A ✅ — yfw=0.75, 1g sugar trim to hit canonical |
| BKFST_002 | Biscuits & Gravy | composite | Rule D ✅ — 🧩 BKFST_001 (Rule A) + BKFST_012 (Rule G); no FNDDS canonical for the combined dish |
| BKFST_003 | Eggs Benedict | composite | Rule G ✅ — FNDDS FC 32101500; NDB 1131 (poached egg direct) + NDB 10130 (Canadian bacon raw) + @BKFST_004 + @BKFST_006; Protein −23.7% ❌ Fat +13.6% ❌ vs FNDDS canonical (FNDDS recipe not authored by a cook — excess Canadian bacon, margarine separate, insufficient hollandaise) |
| BKFST_004 | English Muffin | 18264 | Rule A ✅ component |
| BKFST_005 | French Toast | 18269 | Rule B ✅ — 4 slices white bread(18069)+1 egg(1123)+¼ cup 2% milk(1079)+1½ tbsp butter(1001)+⅛ tsp salt(2047); yfw=0.90 (pan-fried); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±2.4%; Na ~474 mg/100g vs canonical 479 (-1%) |
| BKFST_006 | Hollandaise Sauce | FNDDS 81302010 | Rule G ✅ — FNDDS FC 81302010 decomposition: 60g butter(1001)+30g egg yolk(1125)+10g lemon juice(9152) per 100g; Carbs +74.8% ❌ Sugar -40.3% ❌ vs official FDC (absolute: 0.77g C, 0.31g S per 100g sauce); SR Legacy NDB 1125 carb/sugar values differ from FNDDS updated FDC values; E/P/F/W all ≤±3% |
| BKFST_007 | Oatmeal, cooked | 8121 | Rule C ✅ — 40g rolled oats (NDB 8120) + 237g water; yfw=0.76; Fat -21.7% ❌ Fiber +8.5% ⚠️ Sugar -33% ❌ vs NDB 8121 (SR Legacy dry/cooked P/F ratio artifact — NDB 8120 P/F=2.017 vs NDB 8121 implied P/F=1.671; structurally irreducible) |
| BKFST_008 | Pancakes, blueberry | 18294 | Rule B ✅ — yfw=0.81 (blueberries burst during griddling); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±3.5%; same base as BKFST_010 + ½ cup blueberries_raw(9050) |
| BKFST_009 | Pancakes, buttermilk | 18390 | Rule B ✅ — yfw=0.78 (buttermilk batter more watery); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±2.9%; 1 cup flour+2 tsp bp+1 tbsp sugar+¼ tsp salt+1 egg+1 cup milk_buttermilk_whole(1230)+2 tbsp butter(1001) |
| BKFST_010 | Pancakes, plain | 18293 | Rule B ✅ — yfw=0.96 (griddled); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±3.4%; 1 cup flour+2 tsp bp+1 tbsp sugar+¼ tsp salt+1 egg+¾ cup milk+2 tbsp+1 tsp butter(1001) |
| BKFST_011 | Croissant Egg & Cheese Sandwich | (none) | Rule D ✅ — no canonical; 1 large croissant(18239)+2 eggs(1123)+21g cheese_cheddar_sharp_sliced(1270)+14g butter_salted(1001)+salt+pepper; yfw=1.00 → 202.4g; 1 sandwich/serving; 297.3 kcal·11.50P·20.77F·15.77C per 100g; dietary_category=veggie; **Note: BKFST_011 slot was formerly reserved for Poached Egg standalone (skipped); `egg_cooked_poached` ledger key (NDB 1131) is still used directly in composites** |
| BKFST_012 | Sausage Gravy | FNDDS 27120120 | Rule G ✅ — FNDDS FC canonical: 180 kcal·6.78P·13.61F·7.65C per 100g; E=-3.2% ✅ P=+28.6% ❌ F=-8.4% ❌ C=-13.9% ❌; sausage section yff=1.0 (fat renders into roux, stays in dish); Atwater fix applied |
| BKFST_013 | Hash Brown Potatoes | 11370 | Rule A ✅ — yfw=0.358 (pan-fried from boiled); all 7 macros ≤±4.4%; 225g boiled potato flesh(11367)+16g olive oil(4053)+3g salt; NDB 11367 P/C=0.0855 matches canonical 0.0854 |
| BKFST_014 | Waffles, plain | 18367 | Rule B ✅ — yfw=0.62 (waffle iron presses both sides); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±3.9%; 2 cups flour+1 tbsp bp+1 tbsp sugar+¾ tsp salt+2 eggs+1½ cups milk_whole(1077)+6 tbsp butter(1001) |
| BKFST_015 | Breakfast Sausage | 7064 | Rule B ✅ — yfw=0.73, yff=0.91 (fat-drain); Atwater energy recomputation → Energy now +1.5% ✅; Carbs +62.7% ❌ whole-spice form (structurally irreducible); P/F/Su/W all ✅ |
| BKFST_016 | English Muffin (Thomas Style) | 18639 | Rule B ✅ — yfw=0.90 (griddle); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±4.9% |
| BKFST_017 | Burrito with beans | FNDDS 58102605 | Rule F ✅ — FNDDS FC 58102605 decomposition verbatim; all 7 macros Δ=0.0% |
| BKFST_018 | Burrito with beans and cheese | FNDDS 58102610 | Rule F ✅ — FNDDS FC 58102610; 40g tortilla(18364)+30g refried beans(16403)+30g black beans(16015)+5g cheese(1251)+0.3g salt; all 7 macros ≤±1.3%; beans dilute tortilla SR Legacy sugar inflation |
| BKFST_019 | Burrito with cheese | FNDDS 58102680 | Rule G ✅ — FNDDS FC 58102680 ("Burrito, cheese only"); 60g tortilla(18364)+40g cheese(1251); FNDDS uses 99991410 aggregate for cheese; Sugar +7.3% ❌ (NDB 1251 Sugar=1.23 vs 99991410 est. 0.77g/100g); all other 6 macros ≤±4.5% |
| BKFST_020 | Egg burrito | FNDDS 34003100 | Rule F ✅ — FNDDS FC 34003100; 70g tortilla(18364)+110g eggs(1123)+7.7g olive oil(4053)+16.5g cheese(1251)+0.33g salt(2047); FNDDS 32130110 (egg omelet) inline-expanded ×1.1; yfw=0.783 (→180g cooked); all 7 macros Δ≤±0.11% |
| BKFST_021 | Beef and Cheese Burrito | FNDDS 58102310 | Rule F ✅ — FNDDS FC 58102310; 45g beef_ground_80lean_raw(23572)+60g tortilla(18364)+10g water(14411)+5g cheese_mexican_blend(1251); beef section yff=0.593 (fat drained); Atwater energy recomputation; all 7 macros ≤±5%: E=-2.0% P=-2.8% F=+1.0% C=-2.0% Fi=-2.0% Su=-0.9% W=+1.4% |
| BKFST_022 | Breakfast Burrito (eggs, cheese, potatoes) | (none) | Rule D ✅ — no canonical; 70g tortilla(18364)+100g eggs(1123)+130g potato_raw(11352)+28g cheese_mexican_blend(1251)+13.6g olive oil(4053)+1.5g salt(2047); yfw=0.82 → 305g cooked; 222 kcal·9.0P·12.1F·19.2C per 100g; dietary_category=veggie |
| BKFST_023 | Cheese Omelette | (none) | Rule D ✅ — no canonical match used (FNDDS FC 32130120 rejected — Foundation Foods cheese divergence, Carbs −42.8%); 100g eggs(1123)+0.3g salt(2047)+7g butter(1001)+15g cheese_mexican_blend(1251); yfw=1.00 → 122g cooked; 202 kcal·13.2P·15.9F·0.8C per 100g; dietary_category=veggie |
| BKFST_024 | Denver Omelette | (none) | Rule D ✅ — no canonical; 150g eggs(1123)+42g ham_diced_cooked(10136)+37g bell_pepper_green_raw(11333)+20g onion_raw(11282)+28g cheese_mexican_blend(1251)+7g butter(1001)+1.5g salt(2047); yfw=1.00 → 285.5g cooked; 159 kcal·12.4P·11.1F·1.8C per 100g; dietary_category=all |
| BKFST_025 | Cheese Quiche | (none) | Rule D ✅ — no canonical; homemade pie crust (156.25g flour+35.5g butter_unsalted+55.47g vegetable_shortening+3g salt+29.57g water) + filling (162g cheese_swiss+238g heavy_cream+150g eggs+35g onion+nutmeg+salt+pepper); crust yfw=0.38, filling yfw=0.90; 100g/slice; 374 kcal·10.8P·29.5F·16.6C per 100g; dietary_category=veggie |
| BKFST_026 | Spinach Quiche | (none) | Rule D ✅ — same crust as 025 + filling adds 180g spinach_cooked(11458); crust yfw=0.38, filling yfw=0.90; 120.5g/slice; 315 kcal·9.5P·24.6F·14.5C per 100g; dietary_category=veggie |
| BKFST_027 | Ham and Cheese Quiche | (none) | Rule D ✅ — same crust as 025 + filling adds 120g ham_diced_cooked(10136); crust yfw=0.38, filling yfw=0.90; 114g/slice; 351 kcal·12.4P·27.1F·14.6C per 100g; dietary_category=all |
| BKFST_028 | Quiche Lorraine | (none) | Rule D ✅ — same crust as 025 + filling adds 113.4g bacon_cooked_pan_fried(10862); crust yfw=0.38, filling yfw=0.90; 113.9g/slice; 387 kcal·13.7P·30.3F·14.8C per 100g; dietary_category=all |
| BKFST_029 | Crustless Quiche | (none) | Rule D ✅ — no crust; same filling as BKFST_025 (cheese_swiss+heavy_cream+eggs+onion+nutmeg+salt+pepper); single filling section yfw=0.90; 69.3g/slice; 303 kcal·12.6P·27.2F·2.4C per 100g; dietary_category=veggie |
| BKFST_030 | Crustless Spinach Quiche | (none) | Rule D ✅ — same filling as BKFST_026 + spinach_cooked(11458); single filling section yfw=0.90; 89.7g/slice; 239 kcal·10.5P·21.0F·2.8C per 100g; dietary_category=veggie |
| BKFST_031 | Crustless Ham and Cheese Quiche | (none) | Rule D ✅ — same filling as BKFST_027 + ham_diced_cooked(10136); single filling section yfw=0.90; 83.3g/slice; 284 kcal·14.5P·24.2F·2.0C per 100g; dietary_category=all |
| BKFST_032 | Crustless Quiche Lorraine | (none) | Rule D ✅ — same filling as BKFST_028 + bacon_cooked_pan_fried(10862); single filling section yfw=0.90; 83.1g/slice; 332 kcal·16.3P·28.6F·2.3C per 100g; dietary_category=all |
| BKFST_033 | Frittata Herbs and Cheese | (none) | Rule D ✅ — no canonical; 264g eggs(1123)+15.25g milk_whole(1077)+30g scallion_raw(11291)+15g parsley_fresh(11297)+8g cilantro_raw(11165)+3g chives_raw(11156)+2g thyme_fresh(2049)+0.4g salt+0.3g pepper+28.35g cheese_parmesan_hard(1033)+13.6g olive_oil(4053)+14.2g butter_unsalted(1145); yfw=0.90 → 354.7g cooked; 88.7g/slice (4 slices); 202 kcal·12.4P·15.9F·2.1C per 100g; dietary_category=veggie |
| BKFST_034 | Avocado Toast Basic | (none) | Rule D ✅ — no canonical; 38g bread_multigrain_toasted(18036)+75g avocado_raw(9038)+5g lemon_juice_raw(9152)+4.5g olive_oil(4053)+0.4g salt(2047)+0.3g red_pepper_flakes(2031); yfw=1.00 → 123.2g; 1 toast/serving; 224 kcal·5.7P·14.5F·20.2C per 100g; dietary_category=vegan |
| BKFST_035 | Avocado Toast Tomato & Egg | (none) | Rule D ✅ — no canonical; 38g bread_multigrain_toasted(18036)+75g avocado_raw(9038)+5g lemon_juice_raw(9152)+4.5g olive_oil(4053)+68g tomato_red_raw(11529)+50g egg_cooked_poached(1131)+0.4g salt(2047)+0.3g red_pepper_flakes(2031); yfw=1.00 → 241.2g; 1 toast/serving; 149 kcal·5.8P·9.4F·11.6C per 100g; dietary_category=veggie |

**Ingredients needed in ledger before building:**
- (none outstanding — corn_sweet_cooked (NDB 11168) added during SALAD_019 build; almonds_sliced (NDB 12061) + sunflower_seeds_dry_roasted (NDB 12037) + ramen_noodles_dry (NDB 6583) + vinegar_distilled (NDB 2053) added during SALAD_017 build; asparagus_raw (NDB 11011) + arugula_raw (NDB 11959) + pine_nuts_dried (NDB 12147) added during SALAD_007 build; artichoke_hearts_cooked (NDB 11008) added during SALAD_012 build; anchovy_canned (NDB 15002) added during SAUCE_023 build; cheese_blue (NDB 1004) added during SAUCE_021 build; marshmallow_mini (NDB 19116) added during SIDE_026 build; lettuce_romaine_raw (NDB 11251) + croutons_plain (NDB 18242) + cheese_feta (NDB 1019) + olives_black_canned (NDB 9193) + tortilla_chips_plain (NDB 19056) added during SALAD build); coconut_oil (NDB 4047) added during SIDE_025 build; sweet_potato_raw (NDB 11507) + maple_syrup (NDB 19353) added during SIDE_024 build; squash_yellow_raw (NDB 11641) added during SIDE_023 build; thyme_dried (NDB 2042) + okra_raw (NDB 11278) added during SAUCE_014/SIDE_021 build; pasta_dry_unenriched (NDB 20420) + tomatoes_canned_crushed (NDB 11693) added during SIDE_019/020 build; great_northern_beans_raw (NDB 16024) + salt_pork_raw (NDB 10165) added during SIDE_018 build; rosemary_fresh (NDB 2063) added during SIDE_017 build; potato_russet_raw (NDB 11353) added during SIDE_016 rebuild — May 2026; cabbage_red_raw (NDB 11112) + bell_pepper_red_raw (NDB 11821) + honey (NDB 19296) added during SIDE_014 build; cheese_brie (NDB 1006) added during SIDE_010 build; horseradish_prepared (NDB 2055) added during SAUCE_013 build; brown_sugar (NDB 19334) added during SAUCE_011 rebuild; mustard_seed_ground (NDB 2024) added during SAUCE_010 build; grapeseed_oil (NDB 4517) added during SAUCE_009 build; shallots_raw (NDB 11677) + tarragon_dried (NDB 2041) added during SAUCE_007 build; chicken_broth_canned (NDB 6194) added during SAUCE_006 build; tomato_puree (NDB 11547) added during SAUCE_005 build; white_pepper_ground (NDB 2032) added during SAUCE_001 build; beef_chili_no_beans (NDB 22911) added during SAND_065 build; celery_seed (NDB 2007) + peppers_hot_pickled (NDB 31034) added during SAND_064 build; frankfurter_beef (NDB 7022) added during SAND_063 build; tomato_red_raw (NDB 11529) added during BKFST_035 build (formerly cherry_tomato_raw); cheese_cheddar NDB 1009 + cheese_gruyere NDB 1023 added during SAND_001 build; cheese_american NDB 1253 added during SAND_002 build; mayonnaise NDB 4025 + lettuce_iceberg_raw NDB 11252 added during SAND_004 build; turkey_breast_deli NDB 7081 added during SAND_005 build; egg_cooked_hardboiled NDB 1129 + mustard_yellow NDB 2046 added during SAND_006 build; french_roll NDB 18349 + provolone_cheese NDB 1035 + tamari NDB 16124 added during SAND_042 build; oregano_dried NDB 2027 + basil_dried NDB 2003 added during SAND_043 build; pork_tenderloin_raw NDB 10214 + daikon_radish_raw NDB 11429 + carrot_raw NDB 11124 + cucumber_raw NDB 11205 + jalapeno_raw NDB 11979 + lime_juice_raw NDB 9160 + sesame_oil NDB 4058 added during SAND_050 build; focaccia_bread NDB 18414 + basil_fresh NDB 2044 + balsamic_vinegar NDB 2068 added during SAND_051 build; pita_white NDB 18413 + chickpeas_cooked NDB 16057 + chickpeas_raw_dried NDB 16056 + tahini NDB 12166 + coriander_seed NDB 2013 + cumin_ground NDB 2014 + mint_fresh NDB 2065 added during SAND_052 build; lamb_ground_raw NDB 17224 added during SAND_052/053 builds; smoked_salmon NDB 15086 added during BKFST_039 build; hamburger_bun NDB 18350 + ketchup NDB 11935 + pickle_dill NDB 11937 already in ledger — confirmed during SAND_055 build; pork_spareribs_raw (NDB 10088) added during ENTR_090 build — June 2026; pork_country_style_ribs_raw (NDB 10204) added during ENTR_091 build — June 2026; pork_loin_chop_boneless_raw (NDB 10062) + rosemary_dried (NDB 2036) added during ENTR_092 build — June 2026; no new ledger entries during ENTR_093 build — June 2026; no new ledger entries during ENTR_094 build — June 2026; no new ledger entries during ENTR_095 build — June 2026; no new ledger entries during ENTR_096 build — June 2026; crackers_saltines_unsalted_tops (NDB 18426) added during ENTR_097 build — June 2026)

## Current Work: SAND Recipes

## Current Work: SAUCE Recipes

**Sauces planning**: `/Volumes/training/Daily Food Chain/daily-food-chain/docs/sauces_condiments.md`

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| SAUCE_001 | Béchamel Sauce | (none) | Rule D ✅ — no canonical; 976g milk_whole(1077)+71g butter_unsalted(1145)+31.25g flour_ap(20581)+1.5g salt+0.6g white_pepper_ground(2032)+0.275g nutmeg_ground(2025)+0.35g cloves_ground(2011); yfw=0.88 → 975.8g; 16 servings × 61g (~¼ cup); 125.3 kcal·3.55P·9.20F·7.33C per 100g; dietary_category=veggie |
| SAUCE_002 | Mornay Sauce | (none) | Rule D ✅ — no canonical; @SAUCE_001(975.8g)+56.7g cheese_gruyere(1023)+56.7g cheese_parmesan_hard(1033); yfw=1.00, yff=1.00 → 1089.2g; 16 servings × 68g (~¼ cup); 154.1 kcal·6.59P·11.27F·6.75C per 100g; dietary_category=veggie |
| SAUCE_003 | Soubise Sauce | (none) | Rule D ✅ — no canonical; onion section: onion_raw(11282) 907.2g+butter_unsalted(1145) 56.8g+salt+white_pepper, pan grilled yfw=0.45 → 517.3g; @SAUCE_001(975.8g) raw; 1493.1g total; 24 servings × 62g (~¼ cup); 133.6 kcal·3.02P·9.16F·10.50C per 100g; dietary_category=veggie |
| SAUCE_004 | Sauce Crème | (none) | Rule D ✅ — no canonical; bechamel section @SAUCE_001(975.8g) raw yfw=1.0; cream section: heavy_cream(1053) 238g+lemon_juice_raw(9152) 5g+salt+white_pepper, boiled yfw=0.82; 1195.0g total; 16 servings × 74.7g (~¼ cup); 170.2 kcal·3.47P·14.70F·6.58C per 100g; dietary_category=veggie |
| SAUCE_005 | Sauce Aurore — Béchamel | (none) | Rule D ✅ — no canonical; @SAUCE_001(975.8g) raw + tomato_puree(11547) 150g+salt+white_pepper; 1127.6g total; 16 servings × 70.5g (~¼ cup); 113.5 kcal·3.29P·7.99F·7.56C per 100g; dietary_category=veggie |
| SAUCE_006 | Velouté | (none) | Rule D ✅ — no canonical; 2 sections: stock (raw yfw=1.0): @STOCK_001(249g); roux (boiled yfw=0.88): butter_unsalted(1145) 14.2g+flour_ap_white_enriched_unbleached(20581) 7.8g+salt+white_pepper; 271g cooked; 4 servings × 67.8g (~¼ cup); 67.7 kcal·2.70P·5.40F·2.24C per 100g; dietary_category=all |
| SAUCE_007 | Béarnaise Sauce | (none) | Rule D ✅ — no canonical; 2 sections: reduction (boiled yfw=0.20, strained): shallots_raw(11677) 60g+apple_cider_vinegar(2048) 45g+white_wine_dry(14106) 45g+tarragon_dried(2041) 2.25g+black_pepper_ground(2030) 0.75g; emulsion (raw yfw=1.0): egg_yolk_raw(1125) 54g+butter_unsalted(1145) 227g+salt_table(2047) 3g+chives_raw(11156) 3g+tarragon_dried(2041) 1.5g; 337.9g cooked; 4 servings × 84.5g (~⅓ cup); 563.7 kcal·3.86P·58.84F·4.80C per 100g; dietary_category=all |
| SAUCE_008 | Alfredo Sauce | (none) | Rule D ✅ — no canonical; butter_unsalted(1145) 28.4g+heavy_cream(1053) 120.0g+cheese_parmesan_hard(1033) 50.0g+garlic_raw(11215) 4.5g+salt_table(2047) 0.75g+white_pepper_ground(2032) 0.6g+nutmeg_ground(2025) 0.14g; yfw=0.88 → 193.4g cooked; 3 servings × 64.5g (~¼ cup); 422.4 kcal·11.32P·41.02F·3.56C per 100g; dietary_category=veggie |
| SAUCE_009 | Mayonnaise | (none) | Rule D ✅ — no canonical; sabayon method (yolks whisked over double boiler to 160°F); egg_yolk_raw(1125) 34.0g+lemon_juice_raw(9152) 15.25g+grapeseed_oil(4517) 218.0g+salt_table(2047) 3.0g+white_pepper_ground(2032) 0.3g; yfw=1.00 → 270.55g cooked; 18 servings × 15.0g (1 tbsp); 754.3 kcal·3.5P·83.5F·1.3C per 100g; dietary_category=veggie |
| SAUCE_010 | Dijon-Type Mustard | (none) | Rule D ✅ — no canonical; mustard_seed_ground(2024) 39.6g+white_wine_dry(14106) 58.8g+apple_cider_vinegar(2048) 29.8g+salt_table(2047) 3.0g+white_pepper_ground(2032) 0.3g; yfw=1.00 → 131.5g cooked; 26+ servings × 5g (1 tsp); 195.1 kcal·7.91P·10.92F·9.99C per 100g; dietary_category=vegan; cooking_method=raw (whisk-and-rest, no stovetop cook) |
| SAUCE_011 | Tomato Ketchup | (none) | Rule D ✅ — no canonical; tomato_red_raw(11529) 794.0g+apple_cider_vinegar(2048) 119.5g+brown_sugar(19334) 55.0g+salt_table(2047) 6.0g+onion_powder(2026) 1.2g+garlic_powder(2020) 0.775g+allspice_ground(2001) 0.475g+cloves_ground(2011) 0.2625g+celery_seed(2007) 0.25g; yfw=0.603 → 634.6g cooked; 37+ servings × 17g (1 tbsp); 60.9 kcal·1.17P·0.270F·13.88C·1.58Fi·11.79Su per 100g; dietary_category=vegan; cooking_method=boiled |
| SAUCE_012 | Chili Sauce | (none) | Rule D ✅ — no canonical; tomato_red_raw(11529) 794.0g+onion_raw(11282) 110.0g+bell_pepper_green_raw(11333) 119.0g+apple_cider_vinegar(2048) 60.0g+brown_sugar(19334) 27.0g+salt_table(2047) 6.0g+cinnamon_ground(2010) 1.3g+cloves_ground(2011) 0.525g+allspice_ground(2001) 1.0g+red_pepper_flakes(2031) 1.15g; yfw=0.63 → 743.6g cooked; 43+ servings × 17g (1 tbsp); 45.3 kcal·1.28P·0.310F·10.29C·1.99Fi·7.40Su per 100g; dietary_category=vegan; cooking_method=boiled |
| SAUCE_013 | Russian Dressing | (none) | Rule D ✅ — no canonical; @SAUCE_009(120g)+@SAUCE_012(51g)+horseradish_prepared(2055) 15.0g+worcestershire_sauce(6971) 5.0g+lemon_juice_raw(9152) 5.0g; yfw=1.00 → 196g; 6+ servings × 30g (2 tbsp); 479.9 kcal·1.67P·51.53F·4.78C per 100g; dietary_category=veggie; cooking_method=raw |
| SAUCE_014 | Creole Seasoning | (none) | Rule D ✅ — no canonical; paprika(2028) 17.0g+garlic_powder(2020) 19.4g+onion_powder(2026) 6.9g+black_pepper_ground(2030) 6.9g+cayenne_pepper(2031) 5.3g+oregano_dried(2027) 5.4g+thyme_dried(2042) 4.2g+celery_seed(2007) 6.5g+white_pepper_ground(2032) 7.2g; yfw=1.00 → 78.8g; 27+ servings × 2.9g (1 tsp); 193.6 kcal·8.46P·4.04F·42.11C·15.59Fi per 100g; Na=58 mg/100g; dietary_category=vegan; cooking_method=raw |
| SAUCE_015 | Cheese Sauce for Vegetables | (none) | Rule D ✅ — no canonical; butter_unsalted(1145) 28.4g+flour_ap_white_enriched_unbleached(20581) 15.6g+milk_whole(1077) 244.0g+cheese_cheddar(1009) 169.5g+garlic_powder(2020) 0.775g+onion_powder(2026) 0.6g+salt_table(2047) 1.5g+black_pepper_ground(2030) 0.3g; yfw=0.88 → 426.5g; 6 servings × 71.1g (¼ cup); 257.8 kcal·11.38P·20.54F·7.06C per 100g; dietary_category=veggie; cooking_method=boiled |
| SAUCE_016 | Basic Vinaigrette | (none) | Rule D ✅ — no canonical; olive_oil(4053) 163.2g+apple_cider_vinegar(2048) 59.6g+mustard_yellow(2046) 2.5g+honey(19296) 3.5g+garlic_raw(11215) 3.0g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 235.4g; 7+ servings × 33.6g (2 tbsp); 625.9 kcal·0.15P·69.39F·2.10C per 100g; dietary_category=vegan; cooking_method=raw |
| SAUCE_017 | Italian Vinaigrette | (none) | Rule D ✅ — no canonical; olive_oil(4053) 108.8g+vinegar_red_wine(2068) 60.0g+lemon_juice_raw(9152) 15.0g+garlic_raw(11215) 6.0g+oregano_dried(2027) 1.0g+basil_dried(2003) 0.7g+parsley_fresh(11297) 3.8g+mustard_yellow(2046) 2.5g+honey(19296) 3.5g+red_pepper_flakes(2031) 0.575g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 205.4g; 6+ servings × 34.2g (2 tbsp); 489.9 kcal·0.51P·53.14F·3.98C per 100g; dietary_category=vegan; cooking_method=raw |
| SAUCE_018 | Balsamic Vinaigrette | (none) | Rule D ✅ — no canonical; olive_oil(4053) 163.2g+balsamic_vinegar(2069) 60.0g+honey(19296) 21.0g+garlic_raw(11215) 3.0g+mustard_yellow(2046) 5.0g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 255.8g; 7+ servings × 36.5g (2 tbsp); 613.1 kcal·0.31P·63.88F·11.41C per 100g; dietary_category=vegan; cooking_method=raw |
| SAUCE_019 | Lemon Vinaigrette | (none) | Rule D ✅ — no canonical; olive_oil(4053) 108.8g+lemon_juice_raw(9152) 60.0g+mustard_yellow(2046) 5.0g+honey(19296) 3.5g+garlic_raw(11215) 3.0g+chives_raw(11156) 6.0g+thyme_fresh(2049) 2.4g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 192.3g; 6+ servings × 32.0g (2 tbsp); 519.5 kcal·0.51P·56.81F·4.95C per 100g; dietary_category=vegan; cooking_method=raw |
| SAUCE_020 | Ranch Dressing | (none) | Rule D ✅ — no canonical; mayonnaise(4025) 112.0g+sour_cream(1056) 115.0g+milk_buttermilk_whole(1230) 122.5g+dill_fresh(2045) 1.0g+parsley_fresh(11297) 3.8g+chives_raw(11156) 3.0g+garlic_powder(2020) 1.55g+onion_powder(2026) 0.6g+lemon_juice_raw(9152) 5.0g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 368.0g; 12+ servings × 30.7g (2 tbsp); 292.8 kcal·2.30P·29.96F·3.99C per 100g; dietary_category=veggie; cooking_method=raw |
| SAUCE_021 | Blue Cheese Dressing | (none) | Rule D ✅ — no canonical; mayonnaise(4025) 112.0g+sour_cream(1056) 57.5g+milk_buttermilk_whole(1230) 61.25g+cheese_blue(1004) 56.7g+lemon_juice_raw(9152) 15.0g+worcestershire_sauce(6971) 2.5g+garlic_powder(2020) 0.775g+salt_table(2047) 1.5g+black_pepper_ground(2030) 0.3g; yfw=1.00 → 307.5g; 10+ servings × 30.8g (2 tbsp); 364.9 kcal·5.46P·36.85F·3.22C per 100g; dietary_category=veggie; cooking_method=raw |
| SAUCE_022 | Honey Mustard Dressing | (none) | Rule D ✅ — no canonical; mayonnaise(4025) 112.0g+mustard_yellow(2046) 45.0g+honey(19296) 42.0g+lemon_juice_raw(9152) 5.0g+apple_cider_vinegar(2048) 5.0g+salt_table(2047) 1.5g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 211.1g; 7 servings × 30.1g (2 tbsp); 435.8 kcal·1.40P·40.44F·18.30C per 100g; dietary_category=veggie; cooking_method=raw |
| SAUCE_023 | Green Goddess Dressing | (none) | Rule D ✅ — no canonical; mayonnaise(4025) 112.0g+sour_cream(1056) 57.5g+parsley_fresh(11297) 30.4g+chives_raw(11156) 9.0g+dill_fresh(2045) 2.0g+tarragon_dried(2041) 0.75g+lemon_juice_raw(9152) 30.0g+olive_oil(4053) 13.6g+anchovy_canned(15002) 8.0g+garlic_raw(11215) 3.0g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 269.8g; 9 servings × 30.0g (2 tbsp); 386.1 kcal·2.44P·40.70F·3.54C per 100g; dietary_category=all; cooking_method=raw |
| SAUCE_024 | Caesar Salad Dressing | (none) | Rule D ✅ — no canonical; egg_yolk_raw(1125) 17.0g+lemon_juice_raw(9152) 30.0g+garlic_raw(11215) 6.0g+mustard_yellow(2046) 10.0g+worcestershire_sauce(6971) 5.0g+anchovy_canned(15002) 12.0g+olive_oil(4053) 108.8g+cheese_parmesan_hard(1033) 25.0g+salt_table(2047) 1.5g+black_pepper_ground(2030) 0.575g; yfw=1.00 → 215.9g; 7 servings × 30.8g (2 tbsp); 540.4 kcal·7.42P·56.23F·3.42C per 100g; dietary_category=all; cooking_method=raw; yolk pasteurized via double-boiler to 145°F |
## Current Work: STOCK Recipes

**Stock/broth yield factor tiers:**
- `yfp=0.366` — standard 3–4h simmer (STOCK_001–004)
- `yfp=0.395` — 24h bone broth (STOCK_005), calibrated vs Kettle & Fire commercial label (19g P / 479g serving)
- `yfo=0.02` — all stocks (fat-soluble vitamins leave with strained solids; VK: 10.77→0.22 µg/100g vs NDB 6172 canonical 0.20 µg)

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| STOCK_001 | White Chicken Stock | (none) | Rule D ✅ — no canonical; yfw=0.680, yff=0.089, yfp=0.366, yfc=0.02, yfo=0.02; boiled; dietary_category=all; cooked≈3735g, 4 servings × 933g (~1 qt) |
| STOCK_002 | Brown Chicken Stock | (none) | Rule D ✅ — same yield factors as STOCK_001; dietary_category=all |
| STOCK_003 | Chicken Broth | (none) | Rule D ✅ — lighter, boneless chicken; same yield factors as STOCK_001; dietary_category=all |
| STOCK_004 | Beef Stock | (none) | Rule D ✅ — same yield factors as STOCK_001–003; dietary_category=all; 3 servings |
| STOCK_005 | Beef Bone Broth | (none) | Rule D ✅ — 24h simmer; **yfp=0.395** (calibrated vs Kettle & Fire label); yfo=0.02; dietary_category=all; 2 servings × 1996g |
| STOCK_006 | Fish Stock | 6963 | Rule C ✅ — NDB 6963 Fish broth; yfw=0.900, yff=1.000, yfp=0.355, **yfc=0.293**, yfo=0.02; yfc captures soluble wine carbs (C=0.0% vs canonical); Su=+422% structural (wine sugars vs bare broth); E=−5.5% structural (ethanol evaporation); dietary_category=pesca; 3 servings |
| STOCK_007 | Vegetable Stock | 6700 | Rule C ✅ — NDB 6700; yfw=0.820, yff=0.950, yfp=0.484, yfc=0.290, yfo=0.02; P/F/C=0.0%; E=+5.6% structural (fiber Atwater); Su=+131% structural (fresh veg vs commercial broth); dietary_category=vegan; 2 servings |
## Current Work: ENTR Recipes

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| ENTR_001 | Chicken Fried Steak | (none) | Rule D ✅ — no canonical; steak section: sirloin_tip_raw(23061) 226.7g+flour(20581) 62.5g+egg_whole_raw(1123) 50g+paprika(2028)+garlic_powder(2020)+salt+black_pepper+vegetable_oil(4513) 27.2g absorbed; fried yfw=0.82 → 337.7g; gravy section: butter_unsalted(1145) 14.2g+flour(20581) 15.6g+milk_whole(1077) 244g+salt+black_pepper; boiled yfw=0.88 → 250.1g; cooked total 587.8g; 2 servings × 293.9g; 201.7 kcal·12.0P·11.2F·13.0C per 100g; dietary_category=all |
| ENTR_087 | Pork Egg Roll Bowls | (none) | Rule D ✅ — no canonical; 2-section: rice (boiled, bin model): rice_white_raw(20044) 370.0g+water(14411) 720.0g; filling (pan grilled, yfw=0.85): pork_boston_butt_raw(10214) 340.0g+cabbage_raw(11109) 280.0g+carrot_raw(11124) 122.0g+bean_sprouts_raw(11052) 120.0g+scallion_raw(11291) 60.0g+garlic_raw(11215) 6.0g+ginger_root_fresh(11216) 4.0g+tamari(16124) 30.0g+vegetable_oil(4513) 13.6g+sesame_oil(4058) 9.0g; cooked total 1904.5g; 4 servings × 476.1g; 125.2 kcal·5.18P·3.57F·17.83C per 100g; dietary_category=all |
| ENTR_088 | Pork Milanese | (none) | Rule D ✅ — no canonical; single section pan grilled yfw=0.90: pork_tenderloin_raw(10060) 226.8g+flour_ap(20581) 31.25g+egg_whole_raw(1123) 50.0g+bread_crumbs_dry(18079) 54.0g (panko preferred)+olive_oil(4053) 13.6g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g; cooked total 357.4g; 2 servings × 178.7g; 214.7 kcal·17.99P·7.40F·17.75C per 100g; dietary_category=all || ENTR_093 | Pork Tenderloin Stuffed | (none) | Rule D ✅ — no canonical; 3-section composite: tenderloin (baked yfw=0.82): pork_tenderloin_raw(10060) 793.8g+prosciutto(10141) 85g+cheese_parmesan_hard(1033) 50g+basil_fresh(2044) 25g+dill_fresh(2045) 20g+chives_raw(11156) 24g+scallion_raw(11291) 36g+thyme_fresh(2049) 2.4g+garlic_raw(11215) 3g+horseradish_prepared(2055) 10g+olive_oil(4053) 27.2g+salt+pepper; pan_sauce (pan grilled yfw=0.80): shallots_raw(11677) 60g+capers_canned(2054) 21.5g+rosemary_fresh(2063) 1.8g+thyme_fresh(2049) 1.2g+white_wine_dry(14106) 14.8g+orange_juice_raw(9206) 61g+butter_unsalted(1145) 14.2g; chicken_broth (raw yfw=1.0): @STOCK_003 60g; cooked total 1151.7g; 4 servings × 287.9g; 149.8 kcal·18.78P·6.77F·2.57C per 100g; dietary_category=all |
| ENTR_094 | Pork Shoulder | (none) | Rule D ✅ — no canonical; single section baked yfw=0.60: pork_boston_butt_raw(10080) 1360.8g+dry rub+olive_oil(4053) 13.6g; slow-roasted 325°F 4–5h; cooked total 1046.7g; 4 servings × 261.7g; 265.5 kcal·22.99P·17.58F·2.68C per 100g; dietary_category=all |
| ENTR_095 | Pork Fried Rice | (none) | Rule D ✅ — no canonical; 2-section: rice (boiled, bin model): rice_white_raw(20044) 370g+water 720g; filling (pan grilled yfw=0.85): pork_tenderloin_raw(10060) 340g+egg_whole_raw(1123) 100g+peas_green_frozen(11313) 80g+carrot_raw(11124) 61g+scallion_raw(11291) 60g+garlic_raw(11215) 6g+ginger_root_fresh(11216) 4g+tamari(16124) 30g+sesame_oil(4058) 9g+vegetable_oil(4513) 13.6g; cooked total 1662.2g; 4 servings × 415.5g; 132.2 kcal·7.19P·2.56F·19.41C per 100g; dietary_category=all |
| ENTR_096 | Pork & Beef Swedish Meatballs | (none) | Rule D ✅ — no canonical; 2-section: meatballs (pan grilled yfw=0.85): ground_pork_raw(10219) 226.8g+beef_ground_80lean_raw(23572) 226.8g+bread_crumbs_dry(18079) 36g+milk_whole(1077) 61g+egg_whole_raw(1123) 50g+onion_raw(11282) 80g+allspice_ground(2001) 1g+nutmeg_ground(2025) 0.55g+salt+pepper+butter_unsalted(1145) 14.2g; sauce (boiled yfw=0.88): butter_unsalted(1145) 28.4g+flour_ap(20581) 15.6g+beef_broth_canned(6008) 245g+heavy_cream(1053) 119g+worcestershire_sauce(6971) 5g+sour_cream(1056) 30g+salt+pepper; cooked total 1040.1g; 4 servings × 260.0g; 222.2 kcal·9.63P·17.93F·5.39C per 100g; dietary_category=all || ENTR_089 | Pork Baby Back Ribs | (none) | Rule D ✅ — no canonical; 2-section composite: ribs (baked yfw=0.73): pork_back_ribs_raw(10192) 680.0g+paprika(2028)+brown_sugar(19334)+chili_powder(2009)+garlic_powder(2020)+onion_powder(2026)+mustard_seed_ground(2024)+black_pepper_ground(2030)+salt_table(2047)+cayenne_pepper(2031); bbq_sauce (raw yfw=1.0): @SAUCE_026 120.0g; cooked total 749.4g; 4 servings × 187.3g; 244.0 kcal·18.23P·15.50F·9.02C per 100g; dietary_category=all |

| ENTR_097 | Seafood Crab Cakes | 15142 | Rule D ✅ — no canonical used; single section pan grilled yfw=0.90: crab_blue_cooked(15140) 453.6g+crackers_saltines_unsalted_tops(18426) 54g+egg_whole_raw(1123) 50g+mayonnaise(4025) 55.2g+mustard_yellow(2046) 5g+worcestershire_sauce(6971) 5g+lemon_juice_raw(9152) 15g+celery_raw(11143) 40g+parsley_fresh(11297) 7.6g+scallion_raw(11291) 30g+thyme_fresh(2049) 2.4g+salt+pepper+olive_oil(4053) 13.6g; cooked total 684.1g; 4 servings × 171.0g; 177.0 kcal·13.79P·10.21F·6.78C per 100g; dietary_category=pesca |

## Current Work: SIDE Recipes

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| SIDE_001 | Mashed Potatoes, Robuchon Style | (none) | Rule D ✅ — no canonical; potato_white_raw(11354) 907.2g+butter_unsalted(1145) 227.2g+milk_whole(1077) 244.0g+salt_table(2047) 6.0g; yfw=0.96 → ~1329g cooked; 6+ servings × 210g (1 cup); ~179 kcal·1.85P·14.36F·11.48C per 100g; dietary_category=veggie |
| SIDE_002 | Garlic Mashed Potatoes | (none) | Rule D ✅ — no canonical; 2-section: garlic_raw(11215) 30.0g+olive_oil(4053) 2.25g baked yfw=0.62 + potato_white_raw(11354) 907.2g+butter_unsalted(1145) 56.8g+milk_whole(1077) 122.0g+salt_table(2047) 6.0g boiled yfw=0.96; 1083.3g cooked; 5+ servings × 210g (1 cup); 108.2 kcal·1.98P·4.92F·14.62C per 100g; dietary_category=veggie |
| SIDE_003 | Mashed Potatoes, Butter Only | (none) | Rule D ✅ — see recipes.csv |
| SIDE_004 | Horseradish Mashed Potatoes | (none) | Rule D ✅ — see recipes.csv |
| SIDE_005 | Potato Salad (American Style) | 11414 | Rule C ✅ — canonical NDB 11414; 2-section: potato_white_raw(11354) 907.2g boiled yfw=0.96 + mayonnaise(4025) 165.0g+egg_cooked_hardboiled(1129) 150.0g+celery_raw(11143) 120.0g+onion_raw(11282) 40.0g+mustard_yellow(2046) 15.0g+apple_cider_vinegar(2048) 14.9g+salt+pepper dressing raw yfw=1.00; 1389g cooked; 5+ servings × 250g (1 cup); 146.1 kcal·2.71P·10.16F·11.07C per 100g; Fat +23.9% ❌ (mayo ratio); Fiber +39.2% ❌ (skin inclusion); both structurally irreducible; dietary_category=veggie |
| SIDE_006 | Potato Salad (German Style) | (none) | Rule D ✅ — no canonical; 2-section: potato_white_raw(11354) 907.2g boiled yfw=0.96 + bacon_cooked_pan_fried(10862) 113.4g+onion_raw(11282) 150.0g+apple_cider_vinegar(2048) 59.6g+sugar_granulated(19335) 12.6g+celery_seed(2007) 2.0g+salt+pepper+parsley_fresh(11297) 7.6g dressing pan grilled yfw=0.80; 1185g cooked; 4+ servings × 250g (1 cup); 108.9 kcal·4.73P·3.50F·14.63C per 100g; dietary_category=all |
| SIDE_007 | Gratin Dauphinois | (none) | Rule D ✅ — no canonical; potato_white_raw(11354) 907.2g+heavy_cream(1053) 476.0g+garlic_raw(11215) 6.0g+butter_unsalted(1145) 14.2g+salt+pepper+nutmeg; single section baked yfw=0.85 → 1257g cooked; 6+ servings × 190g (¾ cup); 187.6 kcal·2.33P·14.66F·12.54C per 100g; dietary_category=veggie |
| SIDE_008 | Potatoes au Gratin | (none) | Rule D ✅ — no canonical; potato_white_raw(11354) 907.2g+heavy_cream(1053) 238.0g+milk_whole(1077) 122.0g+cheese_gruyere(1023) 108.0g+butter_unsalted(1145) 14.2g+garlic_raw(11215) 6.0g+salt+pepper+nutmeg; single section baked yfw=0.85 → 1248g cooked; 6+ servings × 200g (¾ cup); 165.8 kcal·4.69P·11.00F·12.61C per 100g; dietary_category=veggie |
| SIDE_009 | Pommes Anna | (none) | Rule D ✅ — no canonical; potato_white_raw(11354) 907.2g+butter_unsalted(1145) 85.2g+salt+pepper; single section baked yfw=0.85 → 886g cooked; 4 servings × 220g (¾ cup); 139.8 kcal·1.80P·7.90F·16.10C per 100g; dietary_category=veggie |
| SIDE_010 | Tartiflette | (none) | Rule D ✅ — no canonical; 2-section: potatoes(11354) 907.2g boiled yfw=0.96 + gratin: cheese_brie(1006) 396.9g+bacon_cooked_pan_fried(10862) 113.4g+onion_raw(11282) 150.0g+white_wine_dry(14106) 58.8g+heavy_cream(1053) 60.0g+garlic_raw(11215) 6.0g baked yfw=0.82; 1590g cooked; 6 servings × 265g (1 cup); 176.8 kcal·8.84P·10.90F·10.41C per 100g; dietary_category=all; cheese_brie=Reblochon analog (NDB 1006, Reblochon not in SR Legacy) |
| SIDE_011 | Potato Gnocchi | (none) | Rule D ✅ — no canonical; 2-section: potatoes(11354) 907.2g boiled yfw=0.96 + dough: flour_ap_white_enriched_unbleached(20581) 250.0g+egg_whole_raw(1123) 100.0g+salt_table(2047) 6.0g boiled yfw=1.00; 1233.6g cooked; 6 servings × 205.6g (1 cup); 136.1 kcal·4.35P·1.04F·27.08C per 100g; dietary_category=veggie; food_word=GNOCCHI (bespoke Rule D) |
| SIDE_012 | Cornbread (2% Milk) | 18024 | Rule B ✅ — canonical NDB 18024 (2% milk); cornmeal_enriched_yellow(20022) 207.0g+flour_ap_white_enriched_unbleached(20581) 62.5g+baking_powder(18370) 13.8g+salt_table(2047) 6.0g+egg_whole_raw(1123) 50.0g+milk_lowfat_2pct(1079) 244.0g+butter_unsalted(1145) 28.4g; yfw=0.73 → 532.9g cooked; 8 servings × 66.6g (1 piece); 262.3 kcal·6.71P·6.92F·42.71C per 100g; Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±2.5%; dietary_category=veggie |
| SIDE_013 | Cornbread, Buttermilk | (none) | Rule D ✅ — no canonical; cornmeal_enriched_yellow(20022) 207.0g+flour_ap_white_enriched_unbleached(20581) 62.5g+baking_powder(18370) 13.8g+baking_soda(18372) 2.3g+salt_table(2047) 6.0g+egg_whole_raw(1123) 50.0g+milk_buttermilk_whole(1230) 245.0g+butter_unsalted(1145) 56.8g; yfw=0.73 → 563.8g cooked; 8 servings × 70.5g (1 piece); 289.3 kcal·6.35P·11.20F·40.41C per 100g; dietary_category=veggie |
| SIDE_014 | Rainbow Coleslaw | (none) | Rule D ✅ — no canonical; cabbage_raw(11109) 210.0g+cabbage_red_raw(11112) 140.0g+carrot_raw(11124) 220.0g+bell_pepper_red_raw(11821) 119.0g+scallion_raw(11291) 36.0g+mayonnaise(4025) 112.0g+apple_cider_vinegar(2048) 29.8g+honey(19296) 21.0g+salt_table(2047) 6.0g+black_pepper_ground(2030) 0.7g+celery_seed(2007) 0.7g; yfw=1.00 → 895.2g cooked; 8 servings × 111.9g (1 cup); 119.6 kcal·1.11P·9.54F·8.08C per 100g; dietary_category=veggie |
| SIDE_015 | Hasselback Potatoes | (none) | Rule D ✅ — no canonical; potato_white_raw(11354) 600.0g+butter_unsalted(1145) 56.8g+olive_oil(4053) 27.0g+garlic_raw(11215) 12.0g+thyme_fresh(2049) 2.4g+salt_table(2047) 6.0g+black_pepper_ground(2030) 0.575g; yfw=0.85 → 628.5g cooked; 4 servings × 157.1g (1 potato); 172.1 kcal·1.83P·11.74F·15.79C per 100g; dietary_category=veggie |
| SIDE_016 | Twice Baked Potatoes | (none) | Rule D ✅ — no canonical; potato_russet_raw(11353) 1476.0g+butter_unsalted(1145) 85.2g+sour_cream(1056) 230.0g+milk_whole(1077) 122.0g+cheese_cheddar(1009) 113.0g+bacon_cooked_pan_fried(10862) 92.0g+scallion_raw(11291) 90.0g+salt_table(2047) 12.0g+black_pepper_ground(2030) 1.15g+garlic_powder(2020) 3.1g; yfw=0.90 → 2064.9g cooked; 4 servings × 516.2g (1 potato); 156.7 kcal·4.9P·9.15F·14.43C per 100g; dietary_category=all |
| SIDE_017 | Smashed Potatoes | (none) | Rule D ✅ — no canonical; potato_white_raw(11354) 1200.0g+olive_oil(4053) 40.5g+rosemary_fresh(2063) 3.4g+garlic_powder(2020) 3.1g+salt_table(2047) 9.0g+black_pepper_ground(2030) 1.15g; yfw=0.82 → 1080.5g cooked; 4 servings × 270.1g (3 potatoes); 111.4 kcal·1.93P·3.88F·17.79C per 100g; dietary_category=vegan |
| SIDE_018 | Baked Beans | 16005 | Rule C ✅ — canonical NDB 16005; great_northern_beans_raw(16024) 454.0g+salt_pork_raw(10165) 113.4g+onion_raw(11282) 150.0g+molasses(19304) 80.0g+brown_sugar(19334) 27.6g+mustard_yellow(2046) 10.0g+ketchup(11935) 17.0g+salt_table(2047) 9.0g+black_pepper_ground(2030) 1.15g+water(14411) 1184.0g; yfw=0.88 → 1876.3g cooked; 7 servings × 268.0g (1 cup); 149.8 kcal·5.72P·5.17F·20.79C per 100g; Fiber −8.0% ⚠️ structurally irreducible (USDA canonical concentrates beans; home recipe carries more cooking liquid per gram); Sugar unscored (canonical=0); dietary_category=all |
| SIDE_019 | Mac and Cheese | (none) | Rule D ✅ — no canonical; 2-section: pasta (boiled yfw=0.3522): pasta_dry_unenriched(20420) 244.0g+water(14411) 1000.0g→581.2g cooked; sauce (boiled yfw=0.90): butter_unsalted(1145) 42.6g+flour_ap_white_enriched_unbleached(20581) 23.4g+milk_whole(1077) 488.0g+cheese_cheddar(1009) 170.0g+salt_table(2047) 6.0g+white_pepper_ground(2032) 0.6g; 1261.5g cooked; 6 servings × 210.2g (¾ cup); 180.9 kcal·7.05P·8.80F·18.17C per 100g; dietary_category=veggie; yfw=0.3522 calibrated to NDB 20521 water content (62.13%): dry_nonwater conserved, retained_water = cooked_total×0.6213 |
| SIDE_020 | Mac and Tomato | (none) | Rule D ✅ — no canonical; 2-section: pasta (boiled yfw=0.3522): pasta_dry_unenriched(20420) 244.0g+water(14411) 1000.0g→581.2g cooked; mac_tomato (boiled yfw=0.95): tomatoes_canned_crushed(11693) 411.0g+butter_salted(1001) 28.4g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g→418g cooked; 1005.6g cooked; 4 servings × 251.4g (1 cup); 123.5 kcal·3.86P·2.77F·21.14C per 100g; dietary_category=veggie |
| SIDE_021 | Stewed Okra and Tomatoes | (none) | Rule D ✅ — no canonical; 2-section: stew (boiled yfw=0.88): okra_raw(11278) 453.6g+tomatoes_canned_crushed(11693) 411.0g+onion_raw(11282) 150.0g+bell_pepper_green_raw(11333) 119.0g+celery_raw(11143) 75.0g+garlic_raw(11215) 12.0g+olive_oil(4053) 13.6g+salt+black_pepper; seasoning (raw yfw=1.0): @SAUCE_014 8.8g; 1114.8g cooked; 4 servings × 278.7g (1 cup); 47.9 kcal·1.82P·1.48F·8.39C·2.68Fi per 100g; dietary_category=vegan |
| SIDE_022 | Fried Okra | (none) | Rule D ✅ — no canonical; 2-section: coating (fried yfw=0.75): okra_raw(11278) 453.6g+milk_buttermilk_whole(1230) 122.5g+cornmeal_enriched_yellow(20022) 138.0g+flour_ap_white_enriched_unbleached(20581) 31.25g+salt_table(2047) 3.0g+black_pepper_ground(2030) 0.575g+cayenne_pepper(2031) 0.45g+olive_oil(4053) 40.8g; seasoning (raw yfw=1.0): @SAUCE_014 8.7g; 665.5g cooked; 4 servings × 166.4g (1 cup); 186.4 kcal·4.06P·7.39F·26.96C·3.46Fi per 100g; dietary_category=veggie |
| SIDE_023 | Fried Squash | (none) | Rule D ✅ — no canonical; 2-section: coating (fried yfw=0.75): squash_yellow_raw(11641) 453.6g+milk_buttermilk_whole(1230) 122.5g+egg_whole_raw(1123) 50.0g+cornmeal_enriched_yellow(20022) 103.5g+flour_ap_white_enriched_unbleached(20581) 62.5g+garlic_powder(2020) 0.775g+onion_powder(2026) 0.6g+salt_table(2047) 4.5g+black_pepper_ground(2030) 1.15g+olive_oil(4053) 40.8g; seasoning (raw yfw=1.0): @SAUCE_014 5.8g; 697.1g cooked; 4 servings × 174.3g (1 cup); 174.5 kcal·4.39P·7.65F·22.51C·1.80Fi per 100g; dietary_category=veggie |
| SIDE_024 | Sweet Potato Casserole | (none) | Rule D ✅ — no canonical; 2-section: filling (baked yfw=0.85): sweet_potato_raw(11507) 1360.8g+maple_syrup(19353) 80.0g+butter_unsalted(1145) 56.8g+milk_whole(1077) 122.0g+egg_whole_raw(1123) 50.0g+vanilla_extract(2050) 4.2g+cinnamon_ground(2010) 2.6g+nutmeg_ground(2025) 0.55g+salt_table(2047) 3.0g; topping (baked yfw=0.95): oats_rolled_old_fashioned_dry(8120) 60.8g+pecans_raw(12142) 81.8g+maple_syrup(19353) 83.0g+cinnamon_ground(2010) 2.6g+butter_unsalted(1145) 42.6g+salt_table(2047) 1.5g; 1764.7g cooked; 8 servings × 220.6g (1 cup); 185.7 kcal·2.73P·8.68F·25.32C·3.27Fi per 100g; dietary_category=veggie |
| SIDE_025 | Vegan Sweet Potato Casserole | (none) | Rule D ✅ — no canonical; 2-section: filling (baked yfw=0.85): sweet_potato_raw(11507) 1360.8g+maple_syrup(19353) 80.0g+coconut_oil(4047) 54.4g+vanilla_extract(2050) 4.2g+cinnamon_ground(2010) 2.6g+nutmeg_ground(2025) 0.55g+salt_table(2047) 3.0g; topping (baked yfw=0.95): oats_rolled_old_fashioned_dry(8120) 60.8g+pecans_raw(12142) 81.8g+maple_syrup(19353) 83.0g+cinnamon_ground(2010) 2.6g+coconut_oil(4047) 40.8g+salt_table(2047) 1.5g; 1612.2g cooked; 8 servings × 201.5g (3/4 cup); 202.6 kcal·2.31P·9.81F·27.33C·3.58Fi per 100g; dietary_category=vegan |
| SIDE_026 | Marshmallow Sweet Potato Casserole | (none) | Rule D ✅ — no canonical; 2-section: filling (baked yfw=0.85): sweet_potato_raw(11507) 1360.8g+maple_syrup(19353) 80.0g+butter_unsalted(1145) 56.8g+milk_whole(1077) 122.0g+egg_whole_raw(1123) 50.0g+vanilla_extract(2050) 4.2g+cinnamon_ground(2010) 2.6g+nutmeg_ground(2025) 0.55g+salt_table(2047) 3.0g; topping (baked yfw=1.0): marshmallow_mini(19116) 100.0g; 1594.6g cooked; 8 servings × 199.3g (3/4 cup); 142.4 kcal·2.13P·3.51F·26.21C·2.66Fi per 100g; dietary_category=veggie |
## Current Work: SALAD Recipes

| ID | Recipe | Dressing | Notes |
|---|---|---|---|
| SALAD_001 | Caesar Salad | @SAUCE_024 included | Rule D ✅ — romaine(11251) 188.0g+croutons_plain(18242) 15.0g+cheese_parmesan_hard(1033) 25.0g+@SAUCE_024 61.7g; 289.7g; 2 servings × 144.8g; 181.0 kcal·6.08P·14.74F·6.95C per 100g; 262 kcal/serving; dietary_category=all; composite (dish) |
| SALAD_002 | Chicken Caesar Salad | @SAUCE_024 included | Rule D ✅ — chicken_breast_raw(5062) 226.8g pan grilled yfw=0.75+romaine(11251) 188.0g+croutons_plain(18242) 15.0g+cheese_parmesan_hard(1033) 25.0g+@SAUCE_024 61.7g; 474.6g; 2 servings × 237.3g; 167.8 kcal·14.46P·10.25F·4.24C per 100g; 398 kcal/serving; dietary_category=all; composite (dish) |
| SALAD_003 | Cobb Salad | (none) | Rule D ✅ — chicken_breast_raw(5062) 170.1g pan grilled yfw=0.75+lettuce_romaine_raw(11251) 188.0g+bacon_cooked_pan_fried(10862) 46.0g+avocado_raw(9038) 136.0g+egg_cooked_hardboiled(1129) 100.0g+tomato_red_raw(11529) 123.0g+cheese_blue(1004) 56.7g+onion_raw(11282) 20.0g; 808.4g; 2 servings × 404.2g; 131.6 kcal·10.50P·8.57F·3.44C per 100g; 532 kcal/serving; dietary_category=all; no dressing included (serve with SAUCE_021 or SAUCE_020) |
| SALAD_004 | Chef Salad | (none) | Rule D ✅ — no canonical; lettuce_iceberg_raw(11252) 288.0g+turkey_breast_deli(7081) 64.0g+ham_diced_cooked(10136) 56.0g+egg_cooked_hardboiled(1129) 100.0g+cheese_cheddar(1009) 56.7g+tomato_red_raw(11529) 123.0g+cucumber_peeled_raw(11206) 119.0g; 806.7g; 2 servings × 403.4g; 77.9 kcal·7.72P·5.59F·2.86C per 100g; 314 kcal/serving; dietary_category=all; no dressing included (instructions suggest Ranch, Honey Mustard, or Italian Vinaigrette) |
| SALAD_005 | Greek Salad | @SAUCE_017 included | Rule D ✅ — lettuce_romaine_raw(11251) 188.0g+cucumber_peeled_raw(11206) 119.0g+tomato_red_raw(11529) 123.0g+olives_black_canned(9193) 44.0g+cheese_feta(1019) 56.7g+onion_raw(11282) 40.0g+@SAUCE_017 68.4g; 639.1g; 2 servings × 319.6g; 97.0 kcal·2.08P·8.47F·3.92C per 100g; 310 kcal/serving; dietary_category=veggie; composite (dish) |
| SALAD_006 | Taco Salad | sour cream | Rule D ✅ — beef_ground_80lean_raw(23572) 170.1g pan grilled yfw=0.75 yff=0.593+cumin_ground(2014) 2.0g+garlic_powder(2020) 1.55g+salt_table(2047) 1.5g+black_pepper_ground(2030) 0.575g; lettuce_iceberg_raw(11252) 288.0g+beans_black_cooked(16015) 172.0g+cheese_cheddar(1009) 56.7g+tortilla_chips_plain(19056) 28.35g+tomato_red_raw(11529) 123.0g+sour_cream(1056) 57.5g+onion_raw(11282) 40.0g; 900.8g; 2 servings × 450.4g; 121.6 kcal·8.64P·7.65F·10.47C per 100g; 548 kcal/serving; dietary_category=all; Atwater energy recomputed (yff=0.593) |
| SALAD_007 | Asparagus Salad | lemon vinaigrette | Rule D ✅ — asparagus_raw(11011) 340g boiled yfw=0.92 + arugula_raw(11959) 40g+tomato_red_raw(11529) 120g+pine_nuts_dried(12147) 20g+cheese_parmesan_hard(1033) 10g+lemon_juice_raw(9152) 22.5g+olive_oil(4053) 27g+garlic_raw(11215) 3g+salt+pepper raw; 558.9g cooked; 2 servings × 279.5g; 93.4 kcal·2.90P·7.92F·4.47C·1.82Fi per 100g; 261 kcal/serving; dietary_category=vegan |
| SALAD_008 | Burrata Salad | olive oil & balsamic | Rule D ✅ — arugula_raw(11959) 80g+tomato_red_raw(11529) 246g+cheese_mozzarella_wholemilk(1026) 170g+pine_nuts_dried(12147) 20g+basil_fresh(2044) 25g+olive_oil(4053) 13.6g+balsamic_vinegar(2069) 15g+salt+pepper; 571.4g; 2 servings × 285.7g; 148.6 kcal·7.97P·11.63F·3.89C·0.95Fi per 100g; 424 kcal/serving; dietary_category=veggie |
| SALAD_009 | Caprese Salad | olive oil & balsamic | Rule D ✅ — food_word=CAPRESALAD (CAPRESE taken by SAND_051); tomato_red_raw(11529) 369g+cheese_mozzarella_wholemilk(1026) 170g+basil_fresh(2044) 50g+olive_oil(4053) 13.6g+balsamic_vinegar(2069) 30g+salt+pepper; 634.4g; 2 servings × 317.2g; 115.9 kcal·6.73P·8.30F·3.89C·0.84Fi per 100g; 368 kcal/serving; dietary_category=veggie |
| SALAD_010 | Chickpea Salad | vinaigrette | Rule D ✅ — chickpeas_cooked(16057) 246g+cucumber_raw(11205) 150g+tomato_red_raw(11529) 123g+bell_pepper_red_raw(11821) 119g+onion_raw(11282) 40g+cheese_feta(1019) 56.7g+olives_black_canned(9193) 44g+parsley_fresh(11297) 15g+olive_oil(4053) 27g+lemon_juice_raw(9152) 30g+salt+pepper; 852.5g; 2 servings × 426.2g; 111.8 kcal·4.04P·6.00F·11.36C·3.07Fi per 100g; 476 kcal/serving; dietary_category=veggie |
| SALAD_011 | Chicken Pasta Salad | (none) | Rule D ✅ — chicken_breast_raw(5062) 340.2g pan grilled yfw=0.75+pasta_dry_unenriched(20420) 244g boiled (bin model)+mayonnaise(4025) 112g+celery_raw(11143) 120g+bell_pepper_red_raw(11821) 119g+onion_raw(11282) 40g+lemon_juice_raw(9152) 15g+parsley_fresh(11297) 15g+garlic_powder(2020)+salt+pepper; 1289.5g cooked; 4 servings × 322.4g; 170.6 kcal·8.73P·7.89F·15.54C per 100g; 550 kcal/serving; dietary_category=all |
| SALAD_012 | Chicken & Artichoke Pasta Salad | (none) | Rule D ✅ — chicken_breast_raw(5062) 226.8g pan grilled yfw=0.75+pasta_dry_unenriched(20420) 244g boiled (bin model)+artichoke_hearts_cooked(11008) 200g+tomato_red_raw(11529) 123g+olives_black_canned(9193) 44g+cheese_parmesan_hard(1033) 25g+olive_oil(4053) 27g+lemon_juice_raw(9152) 30g+garlic_raw(11215) 6g+oregano_dried+basil_dried+salt+pepper; 1232.0g cooked; 4 servings × 308.0g; 142.4 kcal·8.10P·4.34F·17.86C per 100g; 439 kcal/serving; dietary_category=all |
| SALAD_013 | Gnocchi Antipasto Salad | vinaigrette | Rule D ✅ — @SIDE_011(411.2g)+@SAUCE_017(68.5g)+salami_italian_dry(7926) 56g+provolone_cheese(1035) 56.7g+olives_black_canned(9193) 44g+artichoke_hearts_cooked(11008) 100g+tomato_red_raw(11529) 123g+bell_pepper_red_raw(11821) 60g+basil_fresh(2044) 10g+salt+pepper; 931.5g; 2 servings × 465.7g; 158.9 kcal·5.39P·8.81F·15.00C per 100g; 740 kcal/serving; dietary_category=all; composite (dish) |
| SALAD_014 | Grilled Chicken Salad | vinaigrette | Rule D ✅ — chicken_breast_raw(5062) 340.2g pan grilled yfw=0.75+olive_oil(4053) 13.6g+garlic_powder(2020)+salt+pepper; @SAUCE_016(67.2g); lettuce_romaine_raw(11251) 188.0g+tomato_red_raw(11529) 123.0g+cucumber_peeled_raw(11206) 201.0g+bell_pepper_red_raw(11821) 60.0g+onion_raw(11282) 18.0g+carrot_raw(11124) 61.0g+croutons_plain(18242) 15.0g; 1027.0g; 2 servings × 513.5g; 111.3 kcal·8.23P·6.98F·3.88C per 100g; 572 kcal/serving; dietary_category=all |
| SALAD_015 | Mediterranean Orzo Salad | vinaigrette | Rule D ✅ — pasta_dry_unenriched(20420) 226.8g boiled (bin model, displayed as "orzo")+water(14411) 946g; cucumber_peeled_raw(11206) 201g+tomato_red_raw(11529) 185g+olives_black_canned(9193) 88g+cheese_feta(1019) 113.4g+onion_raw(11282) 40g+parsley_fresh(11297) 15g+olive_oil(4053) 40.5g+lemon_juice_raw(9152) 45g+garlic_raw(11215) 6g+oregano_dried(2027) 2.7g+salt+pepper; 1282.3g; 4 servings × 320.6g; 133.1 kcal·3.97P·6.13F·15.83C per 100g; 427 kcal/serving; dietary_category=veggie; NDB 20420 used as orzo proxy (orzo not in SR Legacy; identical semolina composition by weight) |
| SALAD_016 | Mediterranean Pasta Salad | vinaigrette | Rule D ✅ — pasta_dry_unenriched(20420) 226.8g boiled (bin model)+water(14411) 946g; @SAUCE_017(68.5g); salami_italian_dry(7926) 56.7g+provolone_cheese(1035) 56.7g+olives_black_canned(9193) 44g+artichoke_hearts_cooked(11008) 100g+tomato_red_raw(11529) 123g+bell_pepper_red_raw(11821) 60g+cucumber_peeled_raw(11206) 100g+onion_raw(11282) 40g+basil_fresh(2044) 10g+salt+pepper; 1203.1g; 4 servings × 300.8g; 149.0 kcal·5.24P·6.79F·16.92C per 100g; 448 kcal/serving; dietary_category=all |
| SALAD_017 | Ramen Noodle Salad | (none) | Rule D ✅ — cabbage_raw(11109) 280g+carrot_raw(11124) 122g+scallion_raw(11291) 60g+ramen_noodles_dry(6583) 81g+almonds_sliced(12061) 23g+sunflower_seeds_dry_roasted(12037) 32g+sesame_oil(4058) 27.2g+olive_oil(4053) 27.2g+vinegar_distilled(2053) 45g+tamari(16124) 30g+sugar_granulated(19335) 24g+ginger_root_fresh(11216) 2g+salt+pepper; 755.5g; 4 servings × 188.9g; 187.7 kcal·3.75P·12.82F·15.91C per 100g; 354 kcal/serving; dietary_category=vegan; rice vinegar proxy = NDB 2053 (distilled vinegar) |
| SALAD_018 | Shrimp Caesar Salad | @SAUCE_024 included | Rule D ✅ — shrimp_raw(15270) 226.8g pan grilled yfw=0.75+olive_oil(4053) 13.6g+garlic_powder(2020)+salt+pepper; @SAUCE_024 61.7g; lettuce_romaine_raw(11251) 188.0g+croutons_plain(18242) 15.0g+cheese_parmesan_hard(1033) 25.0g; 488.2g; 2 servings × 244.1g; 172.2 kcal·12.98P·11.77F·4.28C per 100g; 420 kcal/serving; dietary_category=pesca; composite (dish) |
| SALAD_019 | Southwestern Salad | (none) | Rule D ✅ — chicken_breast_raw(5062) 226.8g pan grilled yfw=0.75+olive_oil(4053) 13.6g+cumin_ground(2014)+garlic_powder(2020)+salt+pepper; lettuce_romaine_raw(11251) 188.0g+beans_black_cooked(16015) 86.0g+corn_sweet_cooked(11168) 75.0g+avocado_raw(9038) 68.0g+tomato_red_raw(11529) 123.0g+onion_raw(11282) 18.0g+tortilla_chips_plain(19056) 28.35g+cheese_mexican_blend(1251) 28.25g+cilantro_raw(11165) 8.0g+olive_oil(4053) 27.2g+lime_juice_raw(9160) 30.0g+honey(19296) 7.0g+cumin_ground+salt+pepper; 891.9g; 2 servings × 445.9g; 142.5 kcal·8.49P·8.31F·9.52C per 100g; 636 kcal/serving; dietary_category=all |
| SALAD_020 | Shrimp and Avocado Salad | vinaigrette | Rule D ✅ — shrimp_raw(15270) 226.8g pan grilled yfw=0.75+olive_oil(4053) 13.6g+lime_juice_raw(9160) 15.0g+garlic_powder(2020)+paprika(2028)+salt+pepper; lettuce_romaine_raw(11251) 188.0g+avocado_raw(9038) 136.0g+tomato_red_raw(11529) 123.0g+cucumber_peeled_raw(11206) 119.0g+onion_raw(11282) 18.0g+cilantro_raw(11165) 8.0g+olive_oil(4053) 27.2g+lime_juice_raw(9160) 30.0g+honey(19296) 3.5g+salt+pepper; 866.1g; 2 servings × 433.0g; 102.6 kcal·6.16P·7.42F·4.12C per 100g; 444 kcal/serving; dietary_category=pesca |
| SALAD_021 | Tuna Macaroni Salad | (none) | Rule D ✅ — pasta_dry_unenriched(20420) 226.8g boiled (bin model, displayed as "elbow macaroni")+water(14411) 946g; tuna_canned_light_water(15121) 284.0g+mayonnaise(4025) 165.0g+celery_raw(11143) 120.0g+onion_raw(11282) 18.0g+pickle_relish_sweet(11945) 30.0g+mustard_yellow(2046) 15.0g+lemon_juice_raw(9152) 15.0g+salt+pepper; 1191.2g; 4 servings × 297.8g; 192.0 kcal·7.40P·10.96F·15.81C per 100g; 572 kcal/serving; dietary_category=pesca |
| SALAD_022 | Wedge Salad | blue cheese or ranch | Rule D ✅ — lettuce_iceberg_raw(11252) 288.0g+bacon_cooked_pan_fried(10862) 46.0g+tomato_red_raw(11529) 123.0g+cheese_blue(1004) 56.7g+scallion_raw(11291) 30.0g+chives_raw(11156) 6.0g+@SAUCE_021 61.6g; 611.3g; 2 servings × 305.6g; 116.8 kcal·5.81P·9.14F·3.25C per 100g; 357 kcal/serving; dietary_category=all; composite (dish) |
| SALAD_023 | Nicoise Salad | vinaigrette | planned |
| SALAD_024 | Spinach Salad | vinaigrette | planned |
| SALAD_025 | Three Bean Salad | vinaigrette | planned |
| SALAD_026 | Waldorf Salad | (none) | planned |

## Current Work: SAND Recipes

**Sandwiches planning**: `/Volumes/training/Daily Food Chain/daily-food-chain/docs/sandwiches.md`

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| SAND_001 | Grilled Cheese Cheddar & Gruyere, Restaurant Style | (none) | Rule D ✅ — no canonical; 60g bread_white_commercial(18069)+28g cheese_cheddar(1009)+28g cheese_gruyere(1023)+28g butter_salted(1001); yfw=0.90 → 139.4g; 1 sandwich/serving; 422.6 kcal·14.6P·30.9F·22.0C per 100g; dietary_category=veggie; food_word=GRILLEDCHEESE |
| SAND_002 | Grilled Cheese American | (none) | Rule D ✅ — no canonical; 60g bread_white_commercial(18069)+42g cheese_american(1253)+14g butter_salted(1001); yfw=0.90 → 111.9g; 1 sandwich/serving; 371.5 kcal·11.7P·23.9F·27.9C per 100g; dietary_category=veggie; food_word=GRILLEDCHEESEAMERICAN |
| SAND_003 | Grilled Cheese Cheddar | (none) | Rule D ✅ — no canonical; 60g bread_white_commercial(18069)+42g cheese_cheddar(1009)+14g butter_salted(1001); yfw=0.90 → 112.0g; 1 sandwich/serving; 383.5 kcal·13.4P·24.4F·27.6C per 100g; dietary_category=veggie; food_word=GRILLEDCHEESECHEDDAR |
| SAND_004 | BLT Sandwich | (none) | Rule D ✅ — no canonical; 50g bread_white_commercial(18069)+34.5g bacon_cooked_pan_fried(10862)+60g tomato_red_raw(11529)+21g mayonnaise(4025)+28g lettuce_iceberg_raw(11252); yfw=1.00 → 193.5g; 1 sandwich/serving; 233.6 kcal·8.8P·15.3F·14.8C per 100g; dietary_category=all; food_word=BLT |
| SAND_005 | Club Sandwich | (none) | Rule D ✅ — no canonical; 90g bread_white_commercial(18069)+80g turkey_breast_deli(7081)+23g bacon_cooked_pan_fried(10862)+60g tomato_red_raw(11529)+28g lettuce_iceberg_raw(11252)+21g mayonnaise(4025); yfw=1.00 → 302.0g; 1 sandwich/serving; 195.2 kcal·9.5P·9.9F·16.5C per 100g; dietary_category=all; food_word=CLUBSANDWICH |
| SAND_006 | Egg Salad Sandwich | (none) | Rule D ✅ — no canonical; 60g bread_white_commercial(18069)+100g egg_cooked_hardboiled(1129)+27.6g mayonnaise(4025)+6g scallion_raw(11291)+2.5g mustard_yellow(2046)+1.5g salt_table(2047); yfw=1.00 → 197.6g; 1 sandwich/serving; 255.9 kcal·9.3P·16.9F·15.9C per 100g; dietary_category=veggie; food_word=EGGSALAD |
| SAND_007 | Tuna Salad Sandwich | (none) | Rule D ✅ — 285.1g → 582 cal/serving; 204.1 kcal·11.7P·12.1F·12.2C per 100g; dietary_category=pesca; food_word=TUNASALAD |
| SAND_008 | Chicken Salad Sandwich | (none) | Rule D ✅ — 284.8g → 412 cal/serving; 144.8 kcal·15.7P·3.0F·13.0C per 100g; dietary_category=all; food_word=CHICKENSALAD |
| SAND_009 | Ham and Cheese Sandwich | (none) | Rule D ✅ — 191.8g → 505 cal/serving; 263.3 kcal·14.2P·14.8F·17.6C per 100g; dietary_category=all; food_word=HAMANDCHEESE |
| SAND_010 | Peanut Butter & Jelly Sandwich | (none) | Rule D ✅ — 112.0g → 407 cal/serving; 363.0 kcal·11.2P·16.5F·45.1C per 100g; dietary_category=vegan; food_word=PBJ |
| SAND_011 | Pimento Cheese Sandwich | (none) | Rule D ✅ — 201.7g → 684 cal/serving; 339.0 kcal·10.2P·25.5F·17.3C per 100g; dietary_category=veggie; food_word=PIMENTOCHEESE |
| SAND_012 | Cucumber Tea Sandwich | (none) | Rule D ✅ — 133.7g → 217 cal/serving; 162.3 kcal·4.3P·8.6F·17.3C per 100g; dietary_category=veggie; food_word=CUCUMBERTEA |
| SAND_013 | Croque Monsieur | (none) | Rule D ✅ — 313.5g → 797 cal/serving; 254.3 kcal·11.7P·16.8F·14.2C per 100g; dietary_category=all; food_word=CROQUEMONSIEUR; pan grilled |
| SAND_014 | Croque Madame | (none) | Rule D ✅ — 355.7g → 887 cal/serving; 249.5 kcal·12.1P·16.7F·12.6C per 100g; dietary_category=all; food_word=CROQUEMADAME; pan grilled |
| SAND_015 | Monte Cristo Sandwich | (none) | Rule D ✅ — 303.6g → 781 cal/serving; 257.3 kcal·13.8P·16.8F·12.5C per 100g; dietary_category=all; food_word=MONTECRISTO; pan grilled |
| SAND_016 | Hot Brown | (none) | Rule D ✅ — 408.3g → 1053 cal/serving; 257.8 kcal·11.2P·18.8F·11.1C per 100g; dietary_category=all; food_word=HOTBROWN; baked |
| SAND_017 | Open-Faced Roast Beef with Gravy | (none) | Rule D ✅ — 249.3g → 287 cal/serving; 115.0 kcal·10.3P·4.5F·7.8C per 100g; dietary_category=all; food_word=OPENFACEDROASTBEEF |
| SAND_018 | Turkey Sandwich | (none) | Rule D ✅ — 221.6g → 447 cal/serving; 201.5 kcal·9.6P·11.8F·14.0C per 100g; dietary_category=all; food_word=TURKEYSANDWICH |
| SAND_019 | Turkey with Provolone Sandwich | (none) | Rule D ✅ — 278.3g → 646 cal/serving; 232.0 kcal·12.8P·14.8F·11.6C per 100g; dietary_category=all; food_word=TURKEYPROVOLONE |
| SAND_020 | Turkey & Avocado Sandwich | (none) | Rule D ✅ — 289.6g → 560 cal/serving; 193.4 kcal·7.8P·12.7F·12.7C per 100g; dietary_category=all; food_word=TURKEYAVOCADO |
| SAND_021 | Turkey & Avocado with Provolone Sandwich | (none) | Rule D ✅ — 346.3g → 759 cal/serving; 219.2 kcal·10.7P·14.9F·11.0C per 100g; dietary_category=all; food_word=TURKEYAVOCADOPROVOLONE |
| SAND_022 | Turkey & Avocado with Bacon Sandwich | (none) | Rule D ✅ — 312.6g → 668 cal/serving; 213.6 kcal·9.7P·14.3F·11.9C per 100g; dietary_category=all; food_word=TURKEYAVOCADOBACON |
| SAND_023 | Roast Beef Sandwich | (none) | Rule D ✅ — 241.2g → 396 cal/serving; 164.2 kcal·12.4P·7.0F·12.5C per 100g; dietary_category=all; food_word=ROASTBEEFSANDWICH |
| SAND_024 | Avocado with Sprouts & Tomato Sandwich | (none) | Rule D ✅ — 168.2g → 272 cal/serving; 161.8 kcal·5.7P·7.7F·19.1C per 100g; dietary_category=vegan; food_word=AVOCADOSPROUTS |
| SAND_025 | Reuben Sandwich | (none) | Rule D ✅ — 291.5g → 826 cal/serving; 283.3 kcal·12.7P·19.8F·13.4C per 100g; dietary_category=all; food_word=REUBEN; pan grilled |
| SAND_026 | Pastrami Sandwich | (none) | Rule D ✅ — 219.0g → 449 cal/serving; 205.2 kcal·17.3P·8.1F·14.9C per 100g; dietary_category=all; food_word=PASTRAMI |
| SAND_027 | Corned Beef Sandwich | (none) | Rule D ✅ — 220.3g → 569 cal/serving; 258.4 kcal·15.5P·14.9F·14.8C per 100g; dietary_category=all; food_word=CORNEDBEEF |
| SAND_028 | Liverwurst Sandwich | (none) | Rule D ✅ — 214.1g → 464 cal/serving; 216.6 kcal·8.6P·12.6F·16.9C per 100g; dietary_category=all; food_word=LIVERWURST |
| SAND_029 | Limburger Sandwich | (none) | Rule D ✅ — 64g bread_rye(18023)+57g limburger_cheese(1024)+20g onion_raw(11282)+5g mustard_yellow(2046); yfw=1.00 → 146g; 363 cal/serving; 248.7 kcal·10.5P·14.4F·20.0C per 100g; dietary_category=all; food_word=LIMBURGERSANDWICH |
| SAND_030 | Patty Melt | (none) | Rule D ✅ — 64g bread_rye(18023)+113g beef_ground_80lean_raw(23572)+56g cheese_swiss(1040)+80g onion_raw(11282)+14g butter_salted(1001)+3g salt(2047)+0.3g black_pepper_ground(2030); yfw=0.82 → 296.4g; 806 cal/serving; 271.9 kcal·13.8P·18.1F·13.3C per 100g; dietary_category=all; food_word=PATTYMELT; pan grilled |
| SAND_031 | Sloppy Joe | (none) | Rule D ✅ — 249.2g → 421 cal/serving; 169.0 kcal·8.2P·9.1F·13.6C per 100g; dietary_category=all; food_word=SLOPPYJOE; pan grilled |
| SAND_032 | Pulled Pork Sandwich | (none) | Rule D ✅ — 243.2g → 509 cal/serving; 209.3 kcal·11.4P·10.8F·16.5C per 100g; dietary_category=all; food_word=PULLEDPORK; baked |
| SAND_033 | Barbecue Brisket Sandwich | (none) | Rule D ✅ — 249.3g → 580 cal/serving; 232.5 kcal·13.2P·11.4F·19.2C per 100g; dietary_category=all; food_word=BBQBRISKET; baked |
| SAND_034 | Grilled Chicken Sandwich | (none) | Rule D ✅ — 270.3g → 532 cal/serving; 196.9 kcal·14.3P·11.4F·9.3C per 100g; dietary_category=all; food_word=GRILLEDCHICKENSANDWICH; pan grilled |
| SAND_035 | Fried Chicken Sandwich | (none) | Rule D ✅ — 331.9g → 757 cal/serving; 228.2 kcal·12.0P·12.9F·15.5C per 100g; dietary_category=all; food_word=FRIEDCHICKENSANDWICH; fried |
| SAND_036 | Buffalo Chicken Sandwich | (none) | Rule D ✅ — 321.4g → 796 cal/serving; 247.7 kcal·12.4P·14.7F·16.1C per 100g; dietary_category=all; food_word=BUFFALOCHICKENSANDWICH; fried |
| SAND_037 | Nashville Hot Chicken Sandwich | (none) | Rule D ✅ — 293.7g → 781 cal/serving; 266.1 kcal·13.5P·15.1F·18.9C per 100g; dietary_category=all; food_word=NASHVILLEHOTCHICKENSANDWICH; fried |
| SAND_038 | Fish Sandwich | (none) | Rule D ✅ — 296.8g → 646 cal/serving; 217.6 kcal·12.0P·9.1F·21.5C per 100g; dietary_category=pesca; food_word=FISHSANDWICH; fried |
| SAND_039 | Crab Cake Sandwich | (none) | Rule D ✅ — 316.2g → 599 cal/serving; 189.5 kcal·9.6P·10.9F·13.0C per 100g; dietary_category=all; food_word=CRABCAKESANDWICH; pan grilled |
| SAND_040 | Lobster Roll | (none) | Rule D ✅ — 186.9g → 324 cal/serving; 173.4 kcal·14.0P·7.2F·12.3C per 100g; dietary_category=pesca; food_word=LOBSTERROLL; pan grilled |
| SAND_041 | Tuna Melt | (none) | Rule D ✅ — 337.3g → 839 cal/serving; 248.9 kcal·12.2P·17.6F·10.8C per 100g; dietary_category=pesca; food_word=TUNAMELT; pan grilled |
| SAND_042 | French Dip | (none) | Rule D ✅ — 3 sections: onion_saute (pan grilled): olive_oil(4053)+onion_raw(11282)+garlic_powder(2020)+salt_table(2047)+worcestershire_sauce(6971); au_jus (raw): beef_broth_canned(6008)+tamari(16124); assembly (raw): french_roll(18349)+roast_beef_deli(7043)+provolone_cheese(1035); yfw=1.00 → 372.2g; 438 cal/serving; 117.8 kcal·10.69P·5.16F·6.73C per 100g; dietary_category=all; food_word=FRENCHDIP |
| SAND_043 | Italian Beef Sandwich | (none) | Rule D ✅ — 3 sections: au_jus (raw): beef_broth_canned(6008)+garlic_powder(2020)+oregano_dried(2027)+basil_dried(2003)+red_pepper_flakes(2031)+salt_table(2047); sweet_peppers (pan grilled): olive_oil(4053)+bell_pepper_green_raw(11333); assembly (raw): french_roll(18349)+roast_beef_deli(7043); yfw=1.00 → 286.2g; 325 cal/serving; 113.4 kcal·10.80P·4.06F·7.97C per 100g; dietary_category=all; food_word=ITALIANBEEF |
| SAND_044 | Shrimp Po Boy | (none) | Rule D ✅ — 433.0g → 988 cal/serving; 228.2 kcal·11.6P·12.4F·17.0C per 100g; dietary_category=pesca; food_word=SHRIMPPOBOY; fried |
| SAND_045 | Oyster Po Boy | (none) | Rule D ✅ — 421.0g → 936 cal/serving; 222.2 kcal·5.4P·14.5F·17.9C per 100g; dietary_category=pesca; food_word=OYSTERPOBOY; fried |
| SAND_046 | Meatball Sub | (none) | Rule D ✅ — 352.8g → 914 cal/serving; 242.5 kcal·10.1P·14.3F·18.8C per 100g; dietary_category=all; food_word=MEATBALLSUB |
| SAND_047 | Italian Sub | (none) | Rule D ✅ — 297.3g → 733 cal/serving; 246.7 kcal·12.2P·15.2F·15.7C per 100g; dietary_category=all; food_word=ITALIANSUB |
| SAND_048 | Chicken Parm Sub | (none) | Rule D ✅ — 402.9g → 966 cal/serving; 239.8 kcal·14.1P·12.4F·18.8C per 100g; dietary_category=all; food_word=CHICKENPARMSUB |
| SAND_049 | Philly Cheesesteak | (none) | Rule D ✅ — 365.5g → 672 cal/serving; 183.7 kcal·11.0P·9.6F·13.7C per 100g; dietary_category=all; food_word=PHILLYCHEESESTEAK; pan grilled |
| SAND_050 | Banh Mi Sandwich | (none) | Rule D ✅ — 360.1g → 554 cal/serving; 153.8 kcal·9.0P·5.7F·16.1C per 100g; dietary_category=all; food_word=BANHMI |
| SAND_051 | Caprese Sandwich | (none) | Rule D ✅ — 340.8g → 711 cal/serving; 208.5 kcal·8.2P·13.0F·14.9C per 100g; dietary_category=veggie; food_word=CAPRESE |
| SAND_052 | Falafel Pita | (none) | Rule D ✅ — 3 sections: falafel (fried, yfw=0.80): chickpeas_raw_dried(16056)+parsley_fresh(11297)+cilantro_raw(11165)+onion_raw(11282)+garlic_powder(2020)+cumin_ground(2014)+coriander_seed(2013)+salt_table(2047)+olive_oil(4053); assembly (raw): pita_white(18413)+tomato_red_raw(11529)+onion_raw(11282)+tahini(12166)+yogurt_greek_whole_milk(1293)+dill_fresh(2045)+parsley_fresh(11297)+mint_fresh(2065)+lemon_juice_raw(9152)+salt_table(2047); yfw=1.00 → 343.2g; 852 cal/serving; 248.4 kcal·9.3P·14.8F·22.6C per 100g; dietary_category=veggie; food_word=FALAFELPITA |
| SAND_053 | Gyro | (none) | Rule D ✅ — 3 sections: lamb (pan grilled, yfw=0.75): lamb_ground_raw(17224)+garlic_powder(2020)+oregano_dried_ground(2027)+salt_table(2047)+black_pepper_ground(2030)+olive_oil(4053); tzatziki (raw): yogurt_greek_whole_milk(1293)+cucumber_peeled_raw(11206)+dill_fresh(2045)+garlic_powder(2020)+lemon_juice_raw(9152)+salt_table(2047); assembly (raw): pita_white(18413)+tomato_red_raw(11529)+onion_raw(11282); yfw=1.00 → 332.8g; 635 cal/serving; 190.9 kcal·9.3P·11.3F·12.9C per 100g; dietary_category=all; food_word=GYRO |
| SAND_054 | Rachel Sandwich | (none) | Rule D ✅ — 2 sections: coleslaw (raw): cabbage_raw(11109)+mayonnaise(4025)+apple_cider_vinegar(2048)+salt_table(2047); assembly (pan grilled, yfw=0.90): bread_rye(18023)+turkey_breast_deli(7081)+cheese_swiss(1040)+butter_salted(1001); yfw=0.90 → 258.6g; 629 cal/serving; 243.1 kcal·12.7P·16.7F·10.5C per 100g; dietary_category=all; food_word=RACHEL; pan grilled |
| SAND_055 | Classic Hamburger | (none) | Rule D ✅ — 2 sections: patty (pan grilled, yfw=0.75): beef_ground_80lean_raw(23572)+salt_table(2047)+black_pepper_ground(2030); assembly (raw): hamburger_bun(18350)+ketchup(11935)+mustard_yellow(2046)+pickle_dill(11937)+onion_raw(11282); yfw=1.00 → 202.3g; 438 cal/serving; 216.7 kcal·12.0P·12.1F·14.4C per 100g; dietary_category=all; food_word=HAMBURGER; pan grilled |
| SAND_056 | Cheeseburger | (none) | Rule D ✅ — SAND_055 + cheese_american(1253); yfw=1.00 → 223.3g; 516 cal/serving; 231.2 kcal·12.6P·14.0F·13.4C per 100g; dietary_category=all; food_word=CHEESEBURGER; pan grilled |
| SAND_057 | Bacon Cheeseburger | (none) | Rule D ✅ — SAND_056 + bacon_cooked_pan_fried(10862) 2 slices; yfw=1.00 → 246.3g; 624 cal/serving; 253.3 kcal·14.6P·16.0F·12.3C per 100g; dietary_category=all; food_word=BACONCHEESEBURGER; pan grilled |
| SAND_058 | Double Cheeseburger | (none) | Rule D ✅ — 2 × 2 oz patties + 2 cheese_american slices; yfw=1.00 → 245.2g; 597 cal/serving; 243.4 kcal·13.1P·15.6F·12.5C per 100g; dietary_category=all; food_word=DOUBLECHEESEBURGER; pan grilled |
| SAND_059 | Mushroom Swiss Burger | (none) | Rule D ✅ — 3 sections: mushrooms (pan grilled, yfw=0.90): butter_salted(1001)+onion_raw(11282)+mushroom_crimini_raw(11266)+garlic_raw(11215)+salt_table(2047)+black_pepper_ground(2030); patty (pan grilled, yfw=0.75): beef_ground_80lean_raw(23572)+salt_table+black_pepper_ground; assembly (raw): hamburger_bun(18350)+cheese_swiss(1040); yfw=1.00 → 312.0g; dietary_category=all; food_word=MUSHROOMSWISSBURGER; pan grilled |
| SAND_060 | BBQ Bacon Burger | (none) | Rule D ✅ — 2 sections: patty (pan grilled, yfw=0.75): beef_ground_80lean_raw(23572)+salt_table(2047)+black_pepper_ground(2030); assembly (raw): hamburger_bun(18350)+bbq_sauce(6150)+cheese_cheddar(1009)+bacon_cooked_pan_fried(10862)+onion_rings_fried(21130); yfw=1.00 → 253.3g; 322.2 kcal/100g; dietary_category=all; food_word=BBQBACONBURGER; pan grilled |
| SAND_061 | Turkey Burger | (none) | Rule D ✅ — 2 sections: patty (pan grilled, yfw=0.75): ground_turkey_raw(5665)+poultry_seasoning(2034)+salt_table(2047)+black_pepper_ground(2030); assembly (raw): hamburger_bun(18350)+lettuce_iceberg_raw(11252)+tomato_red_raw(11529)+mayonnaise(4025); yfw=1.00 → 219.0g; 182.1 kcal/100g; dietary_category=all; food_word=TURKEYBURGER; pan grilled |
| SAND_062 | Veggie Burger | (none) | Rule D ✅ — 2 sections: patty (pan grilled, yfw=0.85): beans_black_cooked(16015)+bread_crumbs_dry(18079)+onion_raw(11282)+garlic_raw(11215)+cumin_ground(2014)+salt_table(2047)+black_pepper_ground(2030)+olive_oil(4053); assembly (raw): hamburger_bun(18350)+lettuce_iceberg_raw(11252)+tomato_red_raw(11529)+mayonnaise(4025); yfw=1.00 → 233.3g; 225.6 kcal/100g; dietary_category=veggie; food_word=VEGGIEBURGER; pan grilled |
| SAND_063 | Classic Hot Dog | (none) | Rule D ✅ — 2 sections: frank (grilled, yfw=1.00): frankfurter_beef(7022); assembly (raw): hamburger_bun(18350)+ketchup(11935)+mustard_yellow(2046)+pickle_relish_sweet(11945); yfw=1.00 → 129.0g; 313 kcal/serving; 243.1 kcal·8.0P·12.0F·26.1C per 100g; dietary_category=all; food_word=HOTDOG; grilled |
| SAND_064 | Chicago Style Hot Dog | (none) | Rule D ✅ — 2 sections: frank (grilled, yfw=1.00): frankfurter_beef(7022); assembly (raw): hamburger_bun(18350)+mustard_yellow(2046)+pickle_relish_sweet(11945)+tomato_red_raw(11529)+pickle_dill(11937)+peppers_hot_pickled(31034)+celery_seed(2007)+salt_table(2047); yfw=1.00 → 190.7g; 310 kcal/serving; 162.5 kcal·5.6P·8.2F·16.6C per 100g; dietary_category=all; food_word=CHICAGOSTYLEHOTDOG; grilled |
| SAND_065 | Chili Dog | (none) | Rule D ✅ — 2 sections: frank (grilled, yfw=1.00): frankfurter_beef(7022); assembly (raw): hamburger_bun(18350)+beef_chili_no_beans(22911)+onion_raw(11282)+cheese_cheddar(1009); yfw=1.00 → 190.2g; 463 kcal/serving; 243.3 kcal·11.0P·15.2F·15.2C per 100g; dietary_category=all; food_word=CHILIDOG; grilled |
| SAND_066 | Corn Dog | (none) | Rule D ✅ — 1 section: corn_dog (fried, yfw=0.85): frankfurter_beef(7022)+cornmeal_enriched_yellow(20022)+flour_ap_white_enriched_unbleached(20581)+baking_powder(18370)+sugar_granulated(19335)+salt_table(2047)+egg_whole_raw(1123)+milk_whole(1077)+olive_oil(4053); batch of 6; 99.0g/corn dog; 307 kcal/serving; 309.6 kcal·9.2P·20.0F·22.6C per 100g; dietary_category=all; food_word=CORNDOG; fried |
| SAND_067 | Slaw Dog | (none) | Rule D ✅ — 2 sections: coleslaw (raw): cabbage_raw(11109)+mayonnaise(4025)+apple_cider_vinegar(2048)+salt_table(2047); assembly (grilled): frankfurter_beef(7022)+hamburger_bun(18350)+mustard_yellow(2046); yfw=1.00 → 120.8g; 313 kcal/serving; 259.1 kcal·8.6P·15.6F·20.6C per 100g; dietary_category=all; food_word=SLAWDOG; grilled |

## Human Approval Requirements

- **All ingredient ledger changes require human approval** before committing. Never add or modify a row in `ingredients_ledger.csv` without showing the proposed entry and waiting for explicit confirmation.
- **All `recipe_ingredients.csv` changes require human approval.** Present the full ingredient list before writing anything to the CSV.
- **Never select ingredients based on what is already in the ledger.** Design the recipe with the culinarily correct ingredients first; then identify any ledger entries that need to be added and propose them for approval. Silently substituting an ingredient because it happens to already be in the ledger (e.g. using `tomato_puree` instead of `tomato_red_raw`, or `sugar_granulated` instead of `brown_sugar`) is an error. The ledger serves the recipe; the recipe does not serve the ledger.

## Error Handling Policy

- **There are no "pre-existing" or "acceptable" errors.** If `validate_ledger.py`, `build_all.py`, or any other tool surfaces an error or warning, surface it to the human immediately.
- Finish the current task first, then fix every reported error before moving on. Do not silently defer, downgrade, or rationalize errors as "unrelated."
- The only acceptable warning is the `Rule D — bespoke key OK` note for recipes explicitly authored under Rule D. There will be one such warning per Rule D recipe — currently 207+ — and that is expected.
- **`sr_rule` values in `recipes.csv` must use the full `'Rule X'` prefix** — `'Rule A'`, `'Rule B'`, `'Rule C'`, `'Rule D'`, etc. Bare single letters (`'D'`, `'C'`) cause the validator to misclassify the recipe and produce false errors. The validator string-matches `== 'Rule D'` exactly.

## Recipe Audit Protocol

For any recipe with a `canonical_ndb_no` and `sr_rule` of **A, B, F, or G**, show a full audit before finalizing the recipe. Do not write CSV rows until the human approves.

**When the user says "show recipe audit"**, display:

1. **Ingredient list** — every ingredient in recipe units (display qty + grams), plus the total pre-yield gram weight
2. **Computed per-100g macros** — after applying yield model: Energy (kcal), Protein, Total Fat, Carbs, Fiber, Sugar, Water
3. **Canonical values** — the 7 macros from `comboo.db / DataCentralCombo` for the `canonical_ndb_no` (Rules A/B/C), or from the FNDDS Ingredients CSV for the FC code (Rules F/G)
4. **Gap table** — side-by-side diff showing computed vs canonical with % deviation; flag any macro outside ±5%

Example format:
```
--- Ingredient List ---
2 cups   flour_ap_white_enriched_unbleached   250.0g
1 tbsp   baking_powder                       13.8g
½ tsp    salt_table                           3.0g
5 tbsp   vegetable_shortening                64.0g
⅔ cup    milk_whole                         162.7g
                              TOTAL RAW:    493.5g  (×0.85 yield → 419.5g)

--- Per-100g Macros (computed) vs Canonical NDB 18126 ---
Macro       Computed    Canonical   Δ%
Energy      362 kcal    362 kcal    0.0%  ✅
Protein      6.2g        6.1g      +1.6%  ✅
Total Fat   14.1g       14.8g      -4.7%  ✅
Carbs       49.8g       49.6g      +0.4%  ✅
Fiber        1.6g        1.7g      -5.9%  ⚠️
Sugar        2.1g        2.4g     -12.5%  ❌
Water       27.4g       27.0g      +1.5%  ✅

Rule B — some canonical macros may be null/zero (acceptable).
```

## Savory Recipe Pitfalls
- Use **raw** NDB for meat ingredients (not cooked), set `cooking_method` so pipeline applies retention
- FNDDS canonical targets are per-100g of the finished dish
- Multi-stage recipes (e.g. gravy: cook sausage → make white sauce → combine) require `recipe_sections.csv` entries

## SR Legacy vs Foundation Foods Divergence

FNDDS published nutrient profiles use **Foundation Foods** values for common ingredients, not SR Legacy. SR Legacy and Foundation Foods can diverge significantly for "by difference" nutrients in egg products:

| NDB | Ingredient | SR Legacy carbs | Foundation Foods carbs |
|---|---|---|---|
| 1125 | Egg yolk, raw | 3.59g/100g | 1.02g/100g |

**Impact**: any recipe that uses egg yolk and targets an FNDDS FC canonical will have inflated computed carbs relative to the official published value. This is the root cause of BKFST_006's Carbs +74.8% gap. The recipe is internally correct (SR Legacy–sourced); the divergence is a database version mismatch → Rule G classification is appropriate.

**Lesson**: when Carbs or Sugar diverge significantly between computed and FNDDS canonical on an egg-rich recipe, check whether FNDDS is using Foundation Foods values that differ from SR Legacy "by difference" calculations.

## Authoring Lessons (from BKFST_001)
- **Yield factors for baked goods**: default `yfw=0.85` left macros too dilute for biscuits. `yfw=0.75` hit Rule A. Expect baked breads/biscuits to need 0.70–0.78.
- **Sugar fine-tuning**: when 6 macros pass but sugar is slightly under, adding 1g (¼ tsp) sugar shifts only the sugar column meaningfully without disturbing others. Don't add a full tbsp — overshoots by >100%.
- **Ingredient key naming must match NDB long_desc**: NDB 20581 is *unbleached* per `comboo.db`, despite the legacy `flour_ap_white_enriched_bleached` key. Always verify `Long_Desc` before naming a new ledger key.
- **`food-portions-complete.csv` lives in 3 places** — root, `src/lib/data/`, `docs/` — all must stay in sync. Edit all three together.
- **After any change to `food-portions-complete.csv`, regenerate `food-portions.ts`**: run `python3 scripts/dev/convert_to_ts.py`. Commit the updated TS with the CSV changes.
- **Game architecture — three separate word/data pipelines:**
  - **Chain, Plate, Tower, Bees**: use `src/lib/data/scrambled-words.csv` — a **manually curated, frozen list** of ~810 lowercase words (format: `word,groups`). Players type single lowercase words like `chicken`, `mushroom`, `brisket`. The uppercase `word` key from food-portions is never seen by players. **`generate-words.ts` is retired — do not run it.** New words must be added by hand after review (see curation protocol below).
  - **Balanced Diet / FoodPicker**: uses `food-portions.ts` (`FOODS` array). The `display` field is shown in the UI. The `word` key is the internal lookup key.
  - **Basket, Balance**: uses `generated-levels.ts` + Turso. Recipe names and macros only.
- **scrambled-words.csv curation protocol**: After completing a Rule A/B/C recipe, review the ingredient's `display` name for game-worthy words. A word qualifies if it is a real food name (not a cooking qualifier like `raw`, `boiled`, `dry`, `flat`, `lean`), ≥3 letters, and not already in the file. Append `word,group` to `src/lib/data/scrambled-words.csv` manually and commit with the recipe. No script needed.
- **Rule A/B/C food_words must be meaningful and recognizable to qualify for word games**: having an SR Legacy canonical is necessary but not sufficient. A food_word like `CAKEGINGERBREAD` is SR-anchored but not a natural word a player would recognize or type. The `display` name is what feeds chain/plate game words — keep `display` names clean, natural English (e.g. `Gingerbread`, `Cheesecake`, `Pound Cake`). Check whether a simpler standalone word already exists in food-portions before renaming — it may already occupy that NDB slot.
- **Rule D `food_word` values must NOT be added to `food-portions-complete.csv`**: Rule D recipes have no SR Legacy canonical anchor. Adding them to food-portions puts a non-SR-Legacy entry into the word game pool with fabricated nutrition values. The validator issues a `(Rule D — bespoke key OK)` warning specifically because the word is absent from food-portions — that absence is the correct state.
- **Duplicate NDB mappings in food-portions cause silent validator errors**: validator picks one `food_word` per NDB and flags ledger keys as "mismatched". Before adding a food-portions row, `grep ",NDB,"` to check for duplicates.
- **`food-portions-complete.csv` column layouts differ across copies** — `src/lib/data/` has 56 columns (`word,display,synonyms,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,...`) while root and `docs/` have 55 columns (no `synonyms` column: `word,display,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,...`). When scripting changes, use Python's `csv` module and verify column offsets per file — never assume the same integer index applies to all three copies.
- **CSV field-count discipline**: a single missing/extra comma in a manual edit breaks the row. After editing, verify `awk -F, '{print NF}'` matches the header field count.
- **Rounding is forbidden until final display**: two-part rule — (1) when adding a new NDB entry to `food-portions-complete.csv`, always query `comboo.db` directly and copy the stored value verbatim; never hand-approximate or truncate it. (2) During pre-build macro estimation, carry full precision through every intermediate step. Rounding nutrient values at either stage accumulates error that can shift a passing macro (e.g. Carbs +4.0% estimated) into a failing one (+6.7% actual). Always use the pipeline's built output to determine the final rule classification — never the hand-estimated audit.
- **Always derive `grams` from `food-portions-complete.csv` M-series — never from mental arithmetic**: before writing any `qty_display`/`grams` pair, look up the exact M-series entry (M1–M12) for that ingredient. Common traps found in SAND_055–061: `salt_table` ¼ tsp is **1.5g** (M1 1 tsp = 6.0g × 0.25), not 0.5g; `hamburger_bun` 1 roll is **44.0g** (M1), not 43g; `lettuce_iceberg_raw` 1 large leaf is **15.0g** (M6), not 28g; `onion_raw` 2 thin slices is **18.0g** (M9 × 2 = 9.0g × 2), not 20g; `butter_salted` 1 tbsp is **14.2g** (M2), not 14g. When a fractional measure (e.g. ½ tsp, ¼ tsp) has no direct M-series entry, compute from the nearest unit (tsp or tbsp) using the exact M-series value — never approximate.
- **Atwater energy correction for fat-drain recipes** (`yff < 1.0`): `build.py` passes `Energy_KCal` through `_MACRO_SET` unchanged, which overcounts calories when fat drains away. The fix (implemented May 2026) recomputes `Energy_KCal = P×4 + F×9 + C×4` after the retained-macro loop whenever `yff < 1.0`. Only three sections ever had `yff < 1.0`: BKFST_012.sausage (corrected to 1.0 — fat stays in the roux), BKFST_015.sausage (0.91), BKFST_021.beef (0.593). SWEET_* recipes are unaffected (all have `yff=1.0`).
- **`yff` for gravy/stew sausage**: fat rendered from sausage that becomes the roux base stays in the dish — `yff=1.0`, not <1.0. Only use `yff<1.0` when fat is physically drained away and discarded (e.g. ground beef patties, pan-fried sausage links). Getting this wrong is masked until the Atwater fix is applied, at which point energy plummets unexpectedly.
- **Use `pan grilled` for griddle-cooked sandwiches**: any sandwich or flatbread item cooked in a skillet/griddle should use `cooking_method = pan grilled`. This alias resolves to `fried` retention factors internally (all macros = 1.00 for both) but displays as “pan grilled” in the RecipeBook section header instead of “fried”, which is confusing for cheese sandwiches. Implemented in `retention.py` (alias map), `cookingLossModel.ts` (community recipe path), and `RecipeForm.svelte` (dropdown).
- **`food_word` naming for SAND series variants**: same-dish variants (e.g. grilled cheese with different cheeses) each need a unique `food_word` in `dev_recipes`. Follow the `GRILLEDCHEESE{VARIANT}` pattern: `GRILLEDCHEESE` (restaurant style), `GRILLEDCHEESEAMERICAN`, `GRILLEDCHEESECHEDDAR`. The base word (`GRILLEDCHEESE`) goes to the most distinctive/original variant; all others append the differentiator. For Rule D recipes the food_word need not exist in `food-portions-complete.csv`.
- **`section_label` must NOT include a trailing colon**: the display code appends its own colon to every section label. Writing `'Sauce:'` in `recipe_sections.csv` produces `'Sauce::'` in the UI. Always use bare labels like `'Sauce'`, `'Mayonnaise'`, `'To finish'`.
- **Composite recipes: one section per component_ref** — mirrors the Mornay pattern. Each `@CHILD_ID` gets its own section (with `source_recipe=CHILD_ID`) so it renders as a separate collapsible header. Do NOT lump multiple component_refs into a single section — they crowd under one header and lose their identity. Standalone leaf ingredients get their own section (e.g. `To finish`) with no `source_recipe`.
- **Every `@CHILD_ID` ingredient row must signal "recipe" in `qty_display` AND have a corresponding instruction step**: (1) `qty_display` must include the child recipe's display name and the word "recipe" — e.g. `"1/2 tsp Dijon-Style Mustard (recipe)"` or `"1 recipe Béchamel (1 cup, 245.08g)"`. Never use a bare measurement like `"1/2 tsp"` for a component_ref row. (2) The quantity prefix in `qty_display` must be a real culinary measure (tbsp, cup, oz, g) — never "N servings". "2 servings" is meaningless to a cook; "4 tbsp" is actionable. (3) The parent recipe's instructions must include a step "Make or prepare the [Child Recipe Name] (see the [Child Recipe Name] recipe)." placed before the step that first uses the child. This ensures users know a sub-recipe exists and can navigate to it. (Established June 2026, SAUCE_016/017/018/019/024 Dijon-Style Mustard component_ref pattern; "2 servings" anti-pattern found in SALAD_013/014/016 June 2026.)
- **Always use raw NDB + cooking section for cooked proteins**: Never use a pre-cooked NDB (e.g. `chicken_breast_cooked_roasted` NDB 5064) in a `raw` section — the pipeline applies no retention and the NDB's already-cooked values are used verbatim, double-counting the cooking. Use the raw NDB (e.g. `chicken_breast_raw` NDB 5062) and set the section `cook_method` appropriately (e.g. `pan grilled`, yfw=0.75). This applies to every cooked protein served cold (chicken salad, Cobb salad, etc.).
- **Section rows in `recipe_ingredients.csv` must be contiguous**: All rows for a given `section` key must appear together without interruption. If section A rows appear, then section B rows, then section A rows again, the renderer opens a second header for section A. Always group all rows for each section consecutively, and order sections so the minor section (e.g. `chicken`) comes first in row_order so it doesn't split the major section.
- **`qty_display` must be a pure measure — never embed the ingredient name**: The display layer appends the ingredient's own name automatically. Writing `"3 stalks celery"` produces `"3 stalks celery celery stalk"` (or similar doubling). Always use bare measures: `"3 stalks"`, `"4 medium"`, `"2 cups"`, `"1 tsp"`, `"2 tbsp"`, `"1 sprig"`, etc. The only exception is component_ref rows, where `qty_display` must include the child recipe name and the word "recipe" (e.g. `"1 recipe Pie Crust Double (Unbaked)"`).
- **Ingredient prep methods belong in `qty_display`, not in instructions**: When an ingredient requires a specific preparation (mincing, dicing, slicing, grating, etc.), embed it directly in the `qty_display` field. Do NOT repeat these prep notes in the instruction steps — e.g. "Add the garlic" is correct when `qty_display` already handles the prep. Established June 2026 during garlic audit of ENTR_052–069.
  - **Natural English order — include the ingredient name in `qty_display` when prep follows the name**: The pipeline renders `qty_display + " " + display_name`. Prep notes placed before the name produce unnatural output like "1 large, thinly sliced onion". When prep comes AFTER the ingredient name (the natural English pattern), include the name directly in `qty_display` — e.g. `"1 large onion, thinly sliced"`, `"2 medium carrots, cut into 1-inch pieces"`, `"4 cloves garlic, minced"`. The `formatIngredientLine` deduplication guard detects the name is already present and suppresses doubling. **Never** write `"4 cloves, minced"` — write `"4 cloves garlic, minced"`. Established June 2026, ENTR_077.
- **`display_name_override` replaces the ingredient name entirely — never use it for prep notes**: A value like "crumbled" or "diced" in `display_name_override` renders as "4 slices crumbled" with no ingredient name visible. Prep notes belong in the recipe instructions, not in the override column. Only use `display_name_override` for component_ref labels (e.g. `@SAUCE_024`) or other cases where the full display label is intentionally different from the default name.
- **Always use `BASE = "recipes_v3/data"` for all CSV writes in append scripts**: a root-level `recipe_instructions.csv` (dead legacy file, 4-column format) exists and will silently accept writes if the path prefix is omitted. Every pipeline CSV write must use `f"{BASE}/recipe_instructions.csv"`, `f"{BASE}/recipe_ingredients.csv"`, etc. Never use a bare filename for any `recipes_v3/data/` file.
- **`formatIngredientLine` name-deduplication guard**: `RecipeBook.svelte::formatIngredientLine` checks whether `quantity` already contains the ingredient `name` (case-insensitive). If so, it returns `quantity` as-is instead of appending `name` again. For absorbed oil, use `qty_display="1 tbsp olive oil (absorbed into crust)"` — the guard ensures it renders exactly as written without doubling the name. Also put the absorption note in the instructions (e.g. step: "(Oil in the ingredient list reflects only the amount absorbed into the crust.)"). Embedding the name is intentional here; the guard exists specifically to support this display pattern.
- **Phase 8e `yfc` (yield_factor_carbohydrate)**: Controls carbohydrate extraction from solids into the liquid phase. Essential for stocks with wine or other high-sugar liquid ingredients — set `yfc` to the fraction of carbs that actually leach into the finished stock. When `yfc < 1.0`, Atwater energy recompute fires automatically (same as `yff`/`yfp`). Lives in both `recipes.csv` col 16 and `recipe_sections.csv` col 8.
- **Phase 8f `yfo` (yield_factor_other)**: Applied only to fat-soluble vitamins and carotenoids (`_FAT_SOLUBLE_NUTRIENTS` set in `build.py`: VitK, VitA/RAE, carotenoids, VitD, VitE/tocopherols). These partition into fat/solids and leave with the discard when a stock is strained. Water-soluble vitamins (B vitamins, VitC) and minerals are unaffected. Default `yfo=1.0` is a no-op. Set `yfo=0.02` for all STOCK recipes (calibrated: VK 10.77→0.22 µg/100g vs NDB 6172 canonical 0.20 µg). Lives in both `recipes.csv` col 16 and `recipe_sections.csv` col 9.
- **`white_wine_dry` food_word collision**: NDB 14106 maps to `WINE` in `food-portions-complete.csv`, not `WHITEWINE`. Using `food_word=WHITEWINE` in the ledger causes a validator "mismatched food_word" error because no `WHITEWINE` entry exists in food-portions. Always use `food_word=WINE` for NDB 14106.
- **Two-tier yfp for stock simmer depth**: `yfp=0.366` for 3–4h simmers (chicken/beef stocks); `yfp=0.395` for 24h bone broth. Calibrated against Kettle & Fire bone broth label. Do not apply the bone broth yfp to regular stocks — it overstates protein extraction.
- **"(not included)" for serving suggestions**: When an instruction step mentions serving with a side dish, starch, or bread that is NOT in the recipe's ingredient list (e.g. "Serve over basmati rice or with naan bread"), always append `(not included)` — e.g. `"Serve over basmati rice or with naan bread (not included)."` This prevents users from thinking those items are part of the recipe's nutrition. Established June 2026, ENTR_074 (basmati rice/naan) and ENTR_075 (couscous/flatbread).
- **Serving count (10/90 rounding rule)**: `servings_count` must equal the number of full serving-unit measures a cook can pour from the finished recipe. Use `cooked_total_grams / serving_unit_grams` (e.g. 60g per ¼ cup) with this rule: if the leftover is **≤ 10%** of the serving unit (≤ 6g for a 60g ¼ cup) it is negligible — use floor, no `+`. If leftover is **≥ 90%** (≥ 54g) it rounds up to a full serving, no `+`. If leftover is in the **middle zone (10–90%)** use floor and append `+` to `servings_label` (e.g. `"1/4 cup (makes 4+)"`); the `+` signals at-least-N to the cook and absorbs cooking variation. **`servings_label` is NOT written by `upload.py`** — changes require both `generate_bundle.py` (bundle) and a direct Turso SQL UPDATE on the `servings` column (runtime), followed by `conn.commit()`. (Established June 2026, SAUCE_001–006.)

## Composite Recipes (Rule D, `component_ref`)

Composite recipes (e.g. BKFST_002 Biscuits & Gravy) reference child recipes via `component_ref` rows in `recipe_ingredients.csv` instead of listing leaf ingredients directly. The editor must inline-expand these refs in 3 places — miss any one and the form will either drop ingredients or duplicate them:

1. **`RecipeBook.svelte::levelToFormData`** — expand each `componentRef` ingredient into the child's leaf ingredients, scaling `portionGrams` by `parentGrams / childBatchGrams` and inheriting the parent's `section`. Strip parent dish-header rows (`isDish && !componentRef`).
2. **`/api/recipes/v3-build/[recipe_id]/+server.ts`** — before returning `ingredients`, inline-expand every `component_ref` row using `BUILDS_BY_ID` (bundled at build time). Child leaf ingredients are scaled by `parentGrams / childBatchGrams` and inherit the parent's `section`. Returns a flat list with no component_ref entries. Also substitutes the section's `cook_method` with the child recipe's dominant cook method (top-level `cooking_method`, or the child section with the largest `final_grams` when the child is itself multi-section) so section headers show the original preparation method, not `raw`.
3. **`moderate/+page.svelte::recipeToFormData`** — `mappedIngredients` includes `isDish: Boolean(ing.isDish)`. This ensures the `storedExtras` filter (`!ing.isDish`) in `RecipeForm.svelte` correctly excludes the Turso component_ref stub rows (which have `isDish: true`) so they are not double-appended after the server-side expansion.

**Authoring rule**: `recipe_sections.csv` for a composite recipe should set `cook_method='raw'` and `yield_factor_*=1.0` with the source recipe id in column 12 (`source_recipe`). The display layer handles the rest.

**Critical invariant — `normalizeRecipeIngredients` in `src/routes/api/recipes/builtin/+server.ts`**: This function must include `componentRef` in its return object. If `componentRef` is omitted, `groupRecipeIngredients`'s filter `!isDish || !!componentRef` silently drops every composite section row from the RecipeBook display — sections like "English muffin:" and "Hollandaise sauce:" disappear entirely with no error. If composite sections go missing in production, this is the first place to check.

**Section labels — two separate paths depending on recipe type**:
- **Builtin recipes (SWEET/BKFST)**: `formatSectionHeader` in `RecipeBook.svelte` reads `level.sections[].label` from the generated-levels.ts bundle (generated from `recipe_sections.csv`). `upload.py` does NOT write section labels to Turso. To rename a section header: edit `recipe_sections.csv` → run `generate_bundle.py` → git push. The Turso upload will report "0 changes" — that is correct and expected.
- **Composite builtin recipes (e.g. BKFST_003 Eggs Benedict)**: These are still builtins — section labels still come entirely from the bundle. The `component_ref` rows in Turso carry only the section *key* (e.g. `"muffin"`); the *label* ("English muffin (wheat):") is resolved at display time from the bundle's `level.sections[]`. Renaming a composite section header follows the same path: `recipe_sections.csv` → `generate_bundle.py` → git push. Turso will report "0 changes" — correct and expected.
- **Player/community recipes**: Section labels are stored directly in Turso's `sections_json` column as a `CommunitySection[]` array (`{ sectionKey, sectionLabel }`). `RecipeForm.svelte` serialises the form's `sections` state into the submit payload; `my/+server.ts` writes it to Turso and reads it back via `JSON.parse(row.sections_json)`. The TypeScript bundle is irrelevant for player recipes — no bundle entry exists or is needed.

- **Dry pasta + water is the correct model for boiled pasta recipes**: Always use the dry NDB (e.g. NDB 20420) + water as the boiling medium, not a pre-cooked NDB. Calibrate `yfw` so the pasta section's cooked water content matches the reference cooked NDB (NDB 20521 water = 62.13%): `dry_nonwater = dry_grams × (1 − dry_water_pct)` is conserved; `cooked_total = dry_nonwater / (1 − 0.6213)`; `retained_water = cooked_total × 0.6213`; `yfw = retained_water / raw_water_total`. For elbow macaroni: 244g dry (NDB 20420) + 1000g water → **581.2g cooked** at 62.13% water; `yfw = 360.7 / 1024.2 = 0.3522`. Do NOT calibrate to batch volume alone (that produces only 54% water in cooked pasta). NDB 20420 (dry) and NDB 20521 (cooked) are **not** a matched dry/cooked pair — USDA measured different product samples (fatty acid gains on "cooking" prove this). Do NOT use pre-cooked NDBs for ingredients a cook would prepare from dry.

## v3 Full Spec
`/Users/macminidata/vscode/jetfooddata/jetcool/docs/v3.md` — authoritative pipeline spec (phases, math contract, CSV schemas, authoring runbook §17)

## SR28 Food Search (`src/lib/server/sr28Search.ts`)

`buildSearchWhere()` converts a user/ingredient query into SQL WHERE + relevance score against `DataCentralCombo`.

**Key behaviors (as of June 2026):**
- **Punctuation stripped** — `.replace(/[^a-z0-9\s]/g, ' ')` before splitting, so USDA Long_Desc format ("Tomatoes, red, ripe, raw") works correctly.
- **OR between terms** — any matching term returns the row; no term is required. Prevents USDA descriptor noise ("year round average") from killing the result.
- **Plural stemming** — `stem()` helper: `onions→onion`, `tomatoes→tomato`, `berries→berry` (strips trailing `s`/`es`/`ies`) so plurals match SR28's singular keyword columns.
- **Weighted relevance scoring** — first term weight=8, second=4, rest=1 in the ORDER BY `scoreExpr`. Results sorted: score DESC → key10 (usage rank) DESC → Long_Desc ASC.
- **Baby food excluded** — `FdGrp_Cd <> '300'` always applied.

**Environment**: `.env.local` sets `TURSO_SR28_URL=libsql://comboo-tlgeorge.aws-us-east-1.turso.io` — dev and production both hit the remote Turso comboo DB. Vercel env vars `TURSO_SR28_URL` + `TURSO_SR28_TOKEN` must be set or production falls back to a local file path that doesn't exist on Vercel.

## Word Game Candidate Log

Whenever a new `ingredient_key` is added to `ingredients_ledger.csv` or a new row is added to `food-portions-complete.csv`, log the word here for later review. At a suitable checkpoint, review the log and decide whether each word should be added to `src/lib/data/scrambled-words.csv` (USDA level) and/or `src/lib/data/scrambled-words-combined.csv` (FOODIE/FOODIE21 levels).

**Curation rules reminder:**
- Single words only (no spaces)
- No adjectives or cooking qualifiers (`raw`, `boiled`, `dry`, `flat`, `lean`, `frozen`, etc.)
- No variety/place names that require context (`anjou`, `russet`, `napa`, `fuji`, etc.)
- Prefer singular form unless the plural is the natural food noun (`greens`, `nachos`)
- USDA words (SR Legacy sourced) go in both files; culinary extras (not SR Legacy) go in combined only
- Alcohol words go in combined only (the runtime `wine`/`bar` filter excludes them from FOODIE)

| Date | ingredient_key | word candidate | SR Legacy? | Decision |
|---|---|---|---|---|
| 2026-06-16 | pork_back_ribs_raw (NDB 10192) | ribs | Yes | pending |
| 2026-06-16 | pork_spareribs_raw (NDB 10088) | spareribs | Yes | pending |
| 2026-06-16 | pork_country_style_ribs_raw (NDB 10204) | (no candidate — not a standalone food noun) | Yes | skip |
| 2026-06-16 | pork_loin_chop_boneless_raw (NDB 10062) | (no candidate — not a standalone food noun) | Yes | skip |
| 2026-06-16 | rosemary_dried (NDB 2036) | rosemary | Yes | pending |
| 2026-06-17 | crackers_saltines_unsalted_tops (NDB 18426) | saltine | Yes | pending |
