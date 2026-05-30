# Daily Food Chain — AI Handoff

> Claude AI is not required to ask permission to query the DataCentralCombo table in the comboo.db

## Project
SvelteKit + Svelte 5 + TypeScript food/word game. Nutrition data comes from a Python pipeline (`recipes_v3/`) that computes per-100g macros from raw ingredients using USDA SR Legacy data and FNDDS canonical references.

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
3. Apply yield model (`yield_factor_water`, `yield_factor_fat`)
4. Normalize to per-100g

**Edit-build-upload loop:**
```
python recipes_v3/tools/validate_ledger.py   # check ingredient_key integrity
python recipes_v3/tools/build_all.py         # compute macros → output/
python recipes_v3/tools/upload.py            # push to Turso
python recipes_v3/tools/generate_bundle.py  # write src/lib/farmers-basket/generated-levels.ts
```
Always commit `recipes_bundle.json` after generating.

**⚠️ `generate_bundle.py` silently excludes any recipe that has no rows in `recipe_instructions.csv`.** A recipe can pass audit and upload successfully yet be completely absent from the bundle and the UI. Always write instruction rows *before* generating the bundle.

**⚠️ Instruction text changes require BOTH `upload.py --commit` (updates Turso/runtime) AND `generate_bundle.py` (updates static bundle).** Running only `generate_bundle.py` after editing `recipe_instructions.csv` will leave the old text in Turso and the local app will not reflect the change.

**⚠️ Always use Python's `csv.writer` / `csv.DictWriter` to write rows to `recipe_instructions.csv`.** Instruction text frequently contains commas (e.g., "Mix salt, pepper, and herbs…"). Writing rows via shell heredoc (`cat >> file << 'EOF'`) produces unquoted CSV; `csv.DictReader` then splits the text at the first embedded comma, silently truncating the instruction. This bug will corrupt Turso after the next `upload.py --commit`. Never use heredoc for instruction rows.

**For brand-new recipes, also run `insert_new.py` before `generate_bundle.py`** (see § insert_new.py below).

## insert_new.py — Initial Turso Insert

`recipes_v3/tools/insert_new.py` inserts a recipe row into Turso's `dev_recipes` table for the **first time**. It is NOT called by `upload.py`.

**Run it once per new recipe:**
```
python recipes_v3/tools/insert_new.py --recipe-id BKFST_XXX           # preview (dry-run by default)
python recipes_v3/tools/insert_new.py --recipe-id BKFST_XXX --commit  # write
```

**Before running `--commit`, verify the `_CATEGORY_MAP` covers the recipe's `category` value** (the column in `recipes.csv`). The map is near the top of `insert_new.py`. If the value is not in the map, it silently falls back to `"entrees-main-courses"`. Valid stored category IDs are defined in `src/lib/farmers-basket/recipe-categories.ts`.

Current map covers: `breakfast`, `breakfast & brunch`, `breakfast-brunch`, `soups & stews`, `soups-stews`, `salads`, `pasta & pizza`, `pasta-pizza`, `entrees & main courses`, `entrees-main-courses`, `sides`, `sweets & desserts`, `sweets-desserts`, `beverages`, `sauces & condiments`, `sauces-condiments`, `sandwiches & burgers`, `sandwiches-burgers`. (**`pasta & pizza` and `sandwiches & burgers` were added during SAND_001 build — May 2026.**)

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
| `BKFST_NNN` | 🔧 In progress | 34 (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 034, 035) |
| `SAND_NNN` | 🔧 In progress | 43 (001–043) |

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
| BKFST_011 | Croissant Egg & Cheese Sandwich | (none) | Rule D ✅ — no canonical; 1 large croissant(18239)+2 eggs(1123)+21g cheese_cheddar_sharp_sliced(1270)+2g butter_salted(1001)+salt+pepper; yfw=1.00 → 190.4g; 1 sandwich/serving; 270.9 kcal·12.17P·16.97F·16.76C per 100g; dietary_category=veggie; **Note: BKFST_011 slot was formerly reserved for Poached Egg standalone (skipped); `egg_cooked_poached` ledger key (NDB 1131) is still used directly in composites** |
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
- (none outstanding — tomato_red_raw (NDB 11529) added during BKFST_035 build (formerly cherry_tomato_raw); cheese_cheddar NDB 1009 + cheese_gruyere NDB 1023 added during SAND_001 build; cheese_american NDB 1253 added during SAND_002 build; mayonnaise NDB 4025 + lettuce_iceberg_raw NDB 11252 added during SAND_004 build; turkey_breast_deli NDB 7081 added during SAND_005 build; egg_cooked_hardboiled NDB 1129 + mustard_yellow NDB 2046 added during SAND_006 build; french_roll NDB 18349 + provolone_cheese NDB 1035 + tamari NDB 16124 added during SAND_042 build; oregano_dried NDB 2027 + basil_dried NDB 2003 added during SAND_043 build)

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

## Human Approval Requirements

- **All ingredient ledger changes require human approval** before committing. Never add or modify a row in `ingredients_ledger.csv` without showing the proposed entry and waiting for explicit confirmation.
- **All `recipe_ingredients.csv` changes require human approval.** Present the full ingredient list before writing anything to the CSV.

## Error Handling Policy

- **There are no "pre-existing" or "acceptable" errors.** If `validate_ledger.py`, `build_all.py`, or any other tool surfaces an error or warning, surface it to the human immediately.
- Finish the current task first, then fix every reported error before moving on. Do not silently defer, downgrade, or rationalize errors as "unrelated."
- The only acceptable warning is the `Rule D — bespoke key OK` note for recipes explicitly authored under Rule D.

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
- **Duplicate NDB mappings in food-portions cause silent validator errors**: validator picks one `food_word` per NDB and flags ledger keys as "mismatched". Before adding a food-portions row, `grep ",NDB,"` to check for duplicates.
- **`food-portions-complete.csv` column layouts differ across copies** — `src/lib/data/` has 56 columns (`word,display,synonyms,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,...`) while root and `docs/` have 55 columns (no `synonyms` column: `word,display,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,...`). When scripting changes, use Python's `csv` module and verify column offsets per file — never assume the same integer index applies to all three copies.
- **CSV field-count discipline**: a single missing/extra comma in a manual edit breaks the row. After editing, verify `awk -F, '{print NF}'` matches the header field count.
- **Rounding is forbidden until final display**: two-part rule — (1) when adding a new NDB entry to `food-portions-complete.csv`, always query `comboo.db` directly and copy the stored value verbatim; never hand-approximate or truncate it. (2) During pre-build macro estimation, carry full precision through every intermediate step. Rounding nutrient values at either stage accumulates error that can shift a passing macro (e.g. Carbs +4.0% estimated) into a failing one (+6.7% actual). Always use the pipeline's built output to determine the final rule classification — never the hand-estimated audit.
- **Atwater energy correction for fat-drain recipes** (`yff < 1.0`): `build.py` passes `Energy_KCal` through `_MACRO_SET` unchanged, which overcounts calories when fat drains away. The fix (implemented May 2026) recomputes `Energy_KCal = P×4 + F×9 + C×4` after the retained-macro loop whenever `yff < 1.0`. Only three sections ever had `yff < 1.0`: BKFST_012.sausage (corrected to 1.0 — fat stays in the roux), BKFST_015.sausage (0.91), BKFST_021.beef (0.593). SWEET_* recipes are unaffected (all have `yff=1.0`).
- **`yff` for gravy/stew sausage**: fat rendered from sausage that becomes the roux base stays in the dish — `yff=1.0`, not <1.0. Only use `yff<1.0` when fat is physically drained away and discarded (e.g. ground beef patties, pan-fried sausage links). Getting this wrong is masked until the Atwater fix is applied, at which point energy plummets unexpectedly.
- **Use `pan grilled` for griddle-cooked sandwiches**: any sandwich or flatbread item cooked in a skillet/griddle should use `cooking_method = pan grilled`. This alias resolves to `fried` retention factors internally (all macros = 1.00 for both) but displays as “pan grilled” in the RecipeBook section header instead of “fried”, which is confusing for cheese sandwiches. Implemented in `retention.py` (alias map), `cookingLossModel.ts` (community recipe path), and `RecipeForm.svelte` (dropdown).
- **`food_word` naming for SAND series variants**: same-dish variants (e.g. grilled cheese with different cheeses) each need a unique `food_word` in `dev_recipes`. Follow the `GRILLEDCHEESE{VARIANT}` pattern: `GRILLEDCHEESE` (restaurant style), `GRILLEDCHEESEAMERICAN`, `GRILLEDCHEESECHEDDAR`. The base word (`GRILLEDCHEESE`) goes to the most distinctive/original variant; all others append the differentiator. For Rule D recipes the food_word need not exist in `food-portions-complete.csv`.
- **Always use `BASE = "recipes_v3/data"` for all CSV writes in append scripts**: a root-level `recipe_instructions.csv` (dead legacy file, 4-column format) exists and will silently accept writes if the path prefix is omitted. Every pipeline CSV write must use `f"{BASE}/recipe_instructions.csv"`, `f"{BASE}/recipe_ingredients.csv"`, etc. Never use a bare filename for any `recipes_v3/data/` file.
- **`formatIngredientLine` name-deduplication guard**: `RecipeBook.svelte::formatIngredientLine` checks whether `quantity` already contains the ingredient `name` (case-insensitive). If so, it returns `quantity` as-is instead of appending `name` again. For absorbed oil, use `qty_display="1 tbsp olive oil (absorbed into crust)"` — the guard ensures it renders exactly as written without doubling the name. Also put the absorption note in the instructions (e.g. step: "(Oil in the ingredient list reflects only the amount absorbed into the crust.)"). Embedding the name is intentional here; the guard exists specifically to support this display pattern.

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

## v3 Full Spec
`/Users/macminidata/vscode/jetfooddata/jetcool/docs/v3.md` — authoritative pipeline spec (phases, math contract, CSV schemas, authoring runbook §17)
