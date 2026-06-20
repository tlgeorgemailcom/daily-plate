# Recipe Development — Source of Truth

> This file is the authoritative step-by-step guide for building dev recipes in `recipes_v3/`.
> All rules here are derived from accumulated lessons in `CLAUDE.md`. When a conflict exists, this file wins for authoring procedure; `CLAUDE.md` wins for pipeline internals.

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
| `servings_label` | Human-readable — `upload.py` does NOT write this; must be set via direct Turso SQL UPDATE after insert. **Always use `(makes N)` — never `(serves N)`.** See § servings_label format below. |

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
2. Turso `dev_recipes.servings` — runtime display; set via direct SQL UPDATE after insert
3. `src/lib/farmers-basket/generated-levels.ts` bundle — static display; regenerated by `generate_bundle.py`

`upload.py` **does not** touch any of these. After any label change: (a) edit `recipes.csv`, (b) Turso SQL UPDATE + `conn.commit()`, (c) run `generate_bundle.py`.

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

Columns: `recipe_id, row_order, ingredient_key, qty_display, grams, grams_min, grams_max, section, ingredient_group, is_optional, display_name_override, cook_section`

> **⚠ Write no CSV rows until the rendered ingredient list has been approved.** See the mandatory render rule in the Pre-Build Checklist above.

### 4a — Deriving `grams`

**Always look up M-series values in `food-portions-complete.csv`** before writing any `qty_display`/`grams` pair. Never compute from memory. Common traps:
- `salt_table` ¼ tsp = **1.5g** (M1 1 tsp = 6.0g × 0.25), not 0.5g
- `hamburger_bun` 1 roll = **44.0g** (M1), not 43g
- `butter_salted` 1 tbsp = **14.2g** (M2), not 14g
- `onion_raw` thin slice = **9.0g** (M9 per slice)

For fractional measures without a direct M-series entry, compute from the nearest unit using the exact M-series value.

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
- **`(not included)` for serving suggestions**: if an instruction mentions serving with something not in the ingredient list, append `(not included)` to that instruction step.

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

**"(not included)"**: any serving suggestion referencing an item not in the ingredient list must include `(not included)` in that step.

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

# 5. If servings_label changed (upload.py does not touch it):
#    Direct Turso SQL UPDATE + conn.commit()

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
- [ ] Instructions include `(not included)` where needed
- [ ] `upload.py` result reviewed — `"unchanged"` on a brand-new recipe is expected and correct (insert_new.py already wrote nutrition). `"changed cols:"` is expected on edits to an existing recipe. Either outcome means Turso is current.
- [ ] `servings_label` confirmed correct in Turso (insert_new.py reads it from `recipes.csv`; post-insert corrections need a direct Turso SQL UPDATE + `conn.commit()`)
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
