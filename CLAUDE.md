# Daily Food Chain — AI Handoff

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

**For brand-new recipes, also run `insert_new.py` before `generate_bundle.py`** (see § insert_new.py below).

## insert_new.py — Initial Turso Insert

`recipes_v3/tools/insert_new.py` inserts a recipe row into Turso's `dev_recipes` table for the **first time**. It is NOT called by `upload.py`.

**Run it once per new recipe:**
```
python recipes_v3/tools/insert_new.py --recipe-id BKFST_XXX           # preview (dry-run by default)
python recipes_v3/tools/insert_new.py --recipe-id BKFST_XXX --commit  # write
```

**Before running `--commit`, verify the `_CATEGORY_MAP` covers the recipe's `category` value** (the column in `recipes.csv`). The map is near the top of `insert_new.py`. If the value is not in the map, it silently falls back to `"entrees-main-courses"`. Valid stored category IDs are defined in `src/lib/farmers-basket/recipe-categories.ts`.

Current map covers: `breakfast`, `breakfast & brunch`, `breakfast-brunch`, `soups & stews`, `soups-stews`, `salads`, `pasta & pizza`, `pasta-pizza`, `entrees & main courses`, `entrees-main-courses`, `sides`, `sweets & desserts`, `sweets-desserts`, `beverages`, `sauces & condiments`, `sauces-condiments`, `sandwiches & burgers`, `sandwiches-burgers`.

**`upload.py` deliberately does NOT update `category`, `food_word`, or `cooking_method`** — these identity columns are set once at insert time and preserved on every subsequent upload. To correct one of these columns in Turso after the fact, use a direct SQL UPDATE via the `libsql_experimental` Python client (same pattern as `insert_new.py`'s `_connect()`).

## Critical Invariants
- **Never edit a v3 recipe row in the Turso UI** — it returns 423 and blocks re-uploads. Edit the CSV only.
- **Turso is the sole ingredient source** — no hardcoded nutrition values in code.
- **fat column in `comboo.db`** is literal `'n'` for recipe entries — always use `TotalLipidFat`.
- **NDB_No is stored as integer** in `comboo.db` (no leading zeros).
- `step_order` must be plain integers (not "1a", "2b").
- `cooking_method` must be one of: `raw`, `boiled`, `steamed`, `baked`, `fried`, `grilled`, `microwave`. Compound strings not supported — use `recipe_sections.csv` for multi-stage.
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
| `BKFST_NNN` | 🔧 In progress | 8 (001, 002, 003, 004, 006, 012, 015, 016) |

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
| BKFST_005 | French Toast | 18269 | Rule A ✅ |
| BKFST_006 | Hollandaise Sauce | FNDDS 81302010 | Rule G ✅ — FNDDS FC 81302010 decomposition: 60g butter(1001)+30g egg yolk(1125)+10g lemon juice(9152) per 100g; Carbs +74.8% ❌ Sugar -40.3% ❌ vs official FDC (absolute: 0.77g C, 0.31g S per 100g sauce); SR Legacy NDB 1125 carb/sugar values differ from FNDDS updated FDC values; E/P/F/W all ≤±3% |
| BKFST_007 | Oatmeal, cooked | 08121 | Rule A ✅ |
| BKFST_008 | Pancakes, blueberry | 18294 | Rule A ✅ |
| BKFST_009 | Pancakes, buttermilk | 18390 | Rule A ✅ |
| BKFST_010 | Pancakes, plain | 18293 | Rule A ✅ |
| BKFST_011 | Poached Egg | 1131 | Not built as standalone — `egg_cooked_poached` ledger key (NDB 1131) used directly in composites |
| BKFST_012 | Sausage Gravy | FNDDS 27120120 | Rule G ✅ — FNDDS FC canonical: 180 kcal·6.78P·13.61F·7.65C per 100g; >±5% (no SR Legacy analog for homemade) |
| BKFST_013 | Scrambled Eggs | 01132 | Rule A ✅ |
| BKFST_014 | Waffles, plain | 18367 | Rule A ✅ |
| BKFST_015 | Breakfast Sausage | 7064 | Rule B ✅ — yfw=0.73, yff=0.91; whole-spice form drives Energy +9% and Carbs +50% vs canonical; P/F/Sugar/Water all ±5% |
| BKFST_016 | English Muffin (Thomas Style) | 18639 | Rule B ✅ — yfw=0.90 (griddle); Fiber+Sugar unscored (canonical=0); all 5 scored macros ≤±4.9% |

**Ingredients needed in ledger before building:**
- (none outstanding — sausage and black pepper ingredients added during BKFST_015 build)

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
- **`food-portions-complete.csv` has a `synonyms` column at index 2** (between `display` and `group1`). When manually writing a new row, leave `synonyms` empty (`,,`) or the `group1`/`NDB_NO` values shift left, causing the validator to fail with "ndb_no not in food-portions". Correct column order: `word,display,synonyms,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,...`
- **CSV field-count discipline**: a single missing/extra comma in a manual edit breaks the row. After editing, verify `awk -F, '{print NF}'` matches the header field count.

## Composite Recipes (Rule D, `component_ref`)

Composite recipes (e.g. BKFST_002 Biscuits & Gravy) reference child recipes via `component_ref` rows in `recipe_ingredients.csv` instead of listing leaf ingredients directly. The editor must inline-expand these refs in 3 places — miss any one and the form will either drop ingredients or duplicate them:

1. **`RecipeBook.svelte::levelToFormData`** — expand each `componentRef` ingredient into the child's leaf ingredients, scaling `portionGrams` by `parentGrams / childBatchGrams` and inheriting the parent's `section`. Strip parent dish-header rows (`isDish && !componentRef`).
2. **`/api/recipes/v3-build/[recipe_id]/+server.ts`** — before returning `ingredients`, inline-expand every `component_ref` row using `BUILDS_BY_ID` (bundled at build time). Child leaf ingredients are scaled by `parentGrams / childBatchGrams` and inherit the parent's `section`. Returns a flat list with no component_ref entries. Also substitutes the section's `cook_method` with the child recipe's dominant cook method (top-level `cooking_method`, or the child section with the largest `final_grams` when the child is itself multi-section) so section headers show the original preparation method, not `raw`.
3. **`moderate/+page.svelte::recipeToFormData`** — `mappedIngredients` includes `isDish: Boolean(ing.isDish)`. This ensures the `storedExtras` filter (`!ing.isDish`) in `RecipeForm.svelte` correctly excludes the Turso component_ref stub rows (which have `isDish: true`) so they are not double-appended after the server-side expansion.

**Authoring rule**: `recipe_sections.csv` for a composite recipe should set `cook_method='raw'` and `yield_factor_*=1.0` with the source recipe id in column 12 (`source_recipe`). The display layer handles the rest.

**Critical invariant — `normalizeRecipeIngredients` in `src/routes/api/recipes/builtin/+server.ts`**: This function must include `componentRef` in its return object. If `componentRef` is omitted, `groupRecipeIngredients`'s filter `!isDish || !!componentRef` silently drops every composite section row from the RecipeBook display — sections like "English muffin:" and "Hollandaise sauce:" disappear entirely with no error. If composite sections go missing in production, this is the first place to check.

**Section labels — two separate paths depending on recipe type**:
- **Builtin recipes (SWEET/BKFST)**: `formatSectionHeader` in `RecipeBook.svelte` reads `level.sections[].label` from the generated-levels.ts bundle (generated from `recipe_sections.csv`). `upload.py` does NOT write section labels to Turso. To rename a section header: edit `recipe_sections.csv` → run `generate_bundle.py` → git push. The Turso upload will report "0 changes" — that is correct and expected.
- **Player/community recipes**: Section labels are stored directly in Turso's `sections_json` column as a `CommunitySection[]` array (`{ sectionKey, sectionLabel }`). `RecipeForm.svelte` serialises the form's `sections` state into the submit payload; `my/+server.ts` writes it to Turso and reads it back via `JSON.parse(row.sections_json)`. The TypeScript bundle is irrelevant for player recipes — no bundle entry exists or is needed.

## v3 Full Spec
`/Users/macminidata/vscode/jetfooddata/jetcool/docs/v3.md` — authoritative pipeline spec (phases, math contract, CSV schemas, authoring runbook §17)
