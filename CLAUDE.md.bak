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
python recipes_v3/build_all.py               # compute macros → output/
python recipes_v3/upload.py                  # push to Turso
python recipes_v3/generate_bundle.py         # write src/lib/data/recipes_bundle.json
```
Always commit `recipes_bundle.json` after generating.

## Critical Invariants
- **Never edit a v3 recipe row in the Turso UI** — it returns 423 and blocks re-uploads. Edit the CSV only.
- **Turso is the sole ingredient source** — no hardcoded nutrition values in code.
- **fat column in `comboo.db`** is literal `'n'` for recipe entries — always use `TotalLipidFat`.
- **NDB_No is stored as integer** in `comboo.db` (no leading zeros).
- `step_order` must be plain integers (not "1a", "2b").
- `cooking_method` must be one of: `raw`, `boiled`, `steamed`, `baked`, `fried`, `grilled`, `microwave`. Compound strings not supported — use `recipe_sections.csv` for multi-stage.
- `food_word` must exist in `food-portions-complete.csv` (except Rule D).

## Key Data Sources
- **SR Legacy DB**: `/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db` — table `DataCentralCombo`
- **FNDDS Ingredients CSV**: `src/lib/data/2021-2023 FNDDS At A Glance - FNDDS Ingredients 2/FNDDS Ingredients-Table 1.csv`
- **food_word validation**: `food-portions-complete.csv` (project root)

## Recipe ID Prefixes

| Prefix | Status | Count |
|---|---|---|
| `SWEET_NNN` | ✅ Complete — all 40 in production | 40 |
| `BKFST_NNN` | 🔧 In progress — none built yet | 0 |

## SR Legacy Rules
- **Rule A** — All 7 macros within ±5% of canonical NDB entry
- **Rule B** — Canonical has some missing/null macros (acceptable divergence)
- **Rule C** — Canonical present but >±5% (commercial composite divergence)
- **Rule D** — No canonical match; raw-ingredient calc only

## Current Work: BKFST Recipes

**Master recipe list**: `/Users/macminidata/vscode/jetfooddata/jetcool/docs/recipe_list.md`

Planned BKFST order (standalone components first, composites last):

| ID | Recipe | NDB | Notes |
|---|---|---|---|
| BKFST_001 | Biscuit (savory) | 18016 | Rule A/B — ingredient list from SWEET_023 minus sugar; audit pending |
| BKFST_002 | Biscuits & Gravy | composite | 🧩 BKFST_001 + BKFST_012 |
| BKFST_003 | Eggs Benedict | composite | 🧩 NDB 10998 (direct) + BKFST_004 + BKFST_006 + BKFST_011 |
| BKFST_004 | English Muffin | 18433 | Rule A ✅ component |
| BKFST_005 | French Toast | 18269 | Rule A ✅ |
| BKFST_006 | Hollandaise Sauce | FNDDS 81302010 | Rule C — 60g butter(1001)+30g egg yolk(1125)+10g lemon juice(9152) per 100g |
| BKFST_007 | Oatmeal, cooked | 08121 | Rule A ✅ |
| BKFST_008 | Pancakes, blueberry | 18294 | Rule A ✅ |
| BKFST_009 | Pancakes, buttermilk | 18390 | Rule A ✅ |
| BKFST_010 | Pancakes, plain | 18293 | Rule A ✅ |
| BKFST_011 | Poached Egg | 1129 | Rule A ✅ component |
| BKFST_012 | Sausage Gravy | FNDDS 27120120 | Rule C canonical: 180 kcal·6.78P·13.61F·7.65C per 100g |
| BKFST_013 | Scrambled Eggs | 01132 | Rule A ✅ |
| BKFST_014 | Waffles, plain | 18367 | Rule A ✅ |

**Ingredients needed in ledger before building:**
- `pork_sausage_cooked` → NDB **7064** (not yet in ledger)
- `black_pepper_ground` → NDB **2030** (not yet in ledger)

## Human Approval Requirements

- **All ingredient ledger changes require human approval** before committing. Never add or modify a row in `ingredients_ledger.csv` without showing the proposed entry and waiting for explicit confirmation.
- **All `recipe_ingredients.csv` changes require human approval.** Present the full ingredient list before writing anything to the CSV.

## Recipe Audit Protocol

For any recipe with a `canonical_ndb_no` and `sr_rule` of **A or B**, show a full audit before finalizing the recipe. Do not write CSV rows until the human approves.

**When the user says "show recipe audit"**, display:

1. **Ingredient list** — every ingredient in recipe units (display qty + grams), plus the total pre-yield gram weight
2. **Computed per-100g macros** — after applying yield model: Energy (kcal), Protein, Total Fat, Carbs, Fiber, Sugar, Water
3. **Canonical NDB values** — the 7 macros from `comboo.db / DataCentralCombo` for the `canonical_ndb_no`
4. **Gap table** — side-by-side diff showing computed vs canonical with % deviation; flag any macro outside ±5%

Example format:
```
--- Ingredient List ---
2 cups   flour_ap_white_enriched_bleached   250.0g
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

## v3 Full Spec
`/Users/macminidata/vscode/jetfooddata/jetcool/docs/v3.md` — authoritative pipeline spec (phases, math contract, CSV schemas, authoring runbook §17)
