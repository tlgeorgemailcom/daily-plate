# How to Run a New Recipe Category Through the v3-Build API

> The Breakfast category (`BKFST`) is the completed reference. Every other category follows the exact same process. This document is the step-by-step guide for each remaining category.

---

## What "running through the v3-build API" means

The v3-build API (`/api/recipes/v3-build/[recipe_id]`) reads the build JSON from `recipes_v3/output/builds/` and returns section-level cook data to `RecipeForm.svelte`. For that data to be correct, each recipe in `recipe_sections.csv` must have:

- The right `cook_method` for every section (e.g. `pan seared`, `simmer`, `raw`)
- `cook_stages` in `tempF:minutes` format (e.g. `0:4` for a 4-minute stovetop step with no oven temp, `375:37` for oven baking)

When both are present, the form shows the correct **Prep header** per section and the correct **primary Cook bar** (or leaves it blank when sections handle all the heat themselves).

Breakfast (`docs/breakfast.md`) is the completed example. Every other category needs an equivalent spec file, then the same CSV + build + upload loop.

---

## Developer Input Format

When providing cook data for a recipe, use this format:

```
Recipe name
Top section: <blank> OR | Cook method | time | temp (if bake)
Prep: Section name | cook method | time (if applicable) | temp (if bake)
Prep: Section name | cook method | time (if applicable) | temp (if bake)
```

**Top section** is the primary Cook bar — the final heat that applies to the whole assembled dish (e.g. `Bake | 37 min | 375°F`). Leave it blank when sections handle all the heat themselves.

**Each Prep line** is one section. The section cook method and time feed directly into `cook_method` and `cook_stages` in `recipe_sections.csv`.

### Examples

```
Beef Stew
Top section: blank (sections handle all heat)
Prep: Beef | 8 min | pan seared
Prep: Stew | 90 min | braise

Cheese Quiche
Top section: | Bake | 37 min | 375°F
Prep: Pie crust | no heat
Prep: Cheese filling | no heat

Grilled Chicken
Top section: | Pan sear | 7 min
Prep: (single section — no separate preps)
```

---

## Step-by-Step Process for Each Category

### Step 1 — Create a spec file

Create `docs/{category}.md` (e.g. `docs/entrees.md`, `docs/sides.md`). List every recipe ID and name in that category. The developer fills in the top section and prep lines using the format above.

Use `docs/breakfast.md` as the template.

### Step 2 — Translate the spec to `recipe_sections.csv`

For each recipe, open `recipes_v3/data/recipe_sections.csv`. For each section row that belongs to the recipe:

| Spec line | CSV columns to set |
|---|---|
| `Prep: Eggs | pan seared | 2 min` | `cook_method=pan seared`, `cook_stages=0:2` |
| `Prep: Filling | simmer | 5 min` | `cook_method=simmer`, `cook_stages=0:5` |
| `Prep: Crust | baked | 15 min | 425°F` | `cook_method=baked`, `cook_stages=425:15` |
| `Prep: Assembly | no heat` | `cook_method=raw`, `cook_stages=` (empty) |
| `Top: Bake | 30 min | 350°F` | `recipes.csv` `cooking_method=baked`; section that carries stages gets `cook_stages=350:30` |

**`cook_stages` format:** `tempF:minutes`. For stovetop steps (no oven temp) use `0:minutes` (e.g. `0:7`). For multi-stage bakes use `temp1:min1,temp2:min2`.

### Step 3 — Update `recipes.csv` if needed

If the top-level `cooking_method` in `recipes.csv` needs to change (e.g. a recipe is currently listed as `raw` but should be `baked`), edit that column now.

**Quiche / casserole pattern:** top-level `cooking_method=baked`, ALL sections have `cook_method=raw` — the pipeline promotes the recipe-level method to `dish_method_label` and the form shows `Bake | time | temp` in the primary bar.

**Multi-section pattern:** top-level `cooking_method=multi` (or any value), sections each have their own `cook_method` — the form blanks the primary bar and shows each section's method in its prep header.

### Step 4 — Rebuild

```bash
python recipes_v3/tools/build_all.py --recipe RECIPE_ID
```

Verify the output JSON in `recipes_v3/output/builds/RECIPE_ID.json`. Check that:
- `sections[].cook_method` matches what you set
- `sections[].cook_stages` is populated correctly
- `cooking_method` at the top level is correct

### Step 5 — Upload to Turso

```bash
python recipes_v3/tools/upload.py --recipe RECIPE_ID --commit
```

### Step 6 — Verify `servings_label` format before bundling

**This step has caused repeated display bugs across SWEET and BKFST.** Before running `generate_bundle.py`, verify that every recipe in the category has the correct `servings_label` format in `recipes.csv`.

**Required format:**
| Situation | Correct | Wrong |
|---|---|---|
| Multi-serving (count > 1) | `1 patty (makes 12)` | `12 patties` |
| Multi-serving (count > 1) | `1 pancake (makes 4)` | `4 pancakes` |
| Single serving | `1 toast` | `1 toast` ✓ already fine |
| Fractional unit | `1/4 cup (makes 24)` | `24 servings` |

Check all recipes in one pass:

```bash
python3 -c "
import csv
with open('recipes_v3/data/recipes.csv') as f:
    for row in csv.DictReader(f):
        if not row['recipe_id'].startswith('CATEGORY_'):  # replace with your prefix e.g. ENTR_
            continue
        lbl = row.get('servings_label','').strip()
        import re
        m = re.match(r'^(\d+(?:\.\d+)?)\s+\S', lbl)
        if m and float(m.group(1)) > 1:
            print('BAD FORMAT:', row['recipe_id'], repr(lbl))
"
```

Any line printed needs its `servings_label` fixed in `recipes.csv` before bundling. `generate_bundle.py` passes this field through verbatim — a wrong value ends up wrong in the UI.

### Step 7 — Regenerate the bundle

After all recipes in the category are rebuilt and uploaded:

```bash
python recipes_v3/tools/generate_bundle.py
```

Commit `recipes_bundle.json` and `src/lib/farmers-basket/generated-levels.ts` together with the CSV changes.

### Step 8 — Verify in the form

Open the recipe in the app (`/moderate` or the recipe card). Confirm:
- Each section's prep header shows the correct method and time
- The primary Cook bar is either blank (sections handle heat) or shows the correct method/time/temp (quiche/casserole pattern)
- No "No heat" appears in the primary bar when it should be empty

---

## Categories and Their Recipe Prefixes

| Category | Prefix | Count | Spec file | Status |
|---|---|---|---|---|
| Breakfast | `BKFST_` | 53 | `docs/breakfast.md` | ✅ Complete (commit `ade05f4f`) |
| Sandwiches & Burgers | `SAND_` | 79 | `docs/sandwiches.md` | ⏳ Needs cook_stages pass |
| Salads | `SALAD_` | 26 | `docs/salads.md` | ⏳ Needs spec file |
| Entrees & Main Courses | `ENTR_` | 39 | `docs/entrees.md` | ⏳ Needs spec file |
| Sides | `SIDE_` | 26 | `docs/sides.md` | ⏳ Needs spec file |
| Sauces & Condiments | `SAUCE_` | 27 | `docs/sauces_condiments.md` | ⏳ Needs cook_stages pass |
| Stocks | `STOCK_` | 7 | *(inline in sauces doc)* | ⏳ Needs cook_stages pass |
| Sweets & Desserts | `SWEET_` | 40 | `docs/sweets.md` | ⏳ Needs spec file |
| Soups & Stews | *(ENTR prefix, soup sub-type)* | TBD | `docs/soups.md` | ⏳ Needs spec file |

---

## Notes on Specific Categories

### Sandwiches & Burgers (`SAND_`)

Most sandwiches have 2–3 sections: one for the protein (pan seared, fried, baked, or raw if pre-cooked deli), one for any sauce prep, and one for assembly (always `raw`). The primary cook bar should be blank for all sandwiches — sections handle all heat.

Hot dogs: the frank section is `grilled`. Corn dogs: `fried`.

### Salads (`SALAD_`)

Most salad sections are `raw`. Protein sections (chicken, shrimp) are `pan seared`. Dressing sections that reference `@SAUCE_*` are `raw`. The primary cook bar should be blank for all salads.

### Entrees & Main Courses (`ENTR_`)

Varies widely. Braised dishes (stews, braises): single section, `cook_method=braise`, long time (e.g. `0:90`). Roasted dishes: `cook_method=baked`, with oven temp and time (e.g. `325:240`). Pan-fried proteins: `cook_method=pan seared`. Multi-component dishes (e.g. shrimp & grits): separate sections for each component.

### Sides (`SIDE_`)

Boiled/mashed potatoes: `cook_method=boiled`, `0:20`. Baked casseroles: `cook_method=baked` with temp and time. Fried sides: `cook_method=fried` with stovetop time. Raw salad-style sides (coleslaw): `cook_method=raw`.

### Sauces & Condiments (`SAUCE_`)

Reduction sauces (béarnaise, velouté): `cook_method=simmer` or `boiled` with time. Raw emulsions (vinaigrette, mayo, ranch): `cook_method=raw`. Component-ref sauces (Mornay referencing Béchamel): each child section retains its own `cook_method`.

### Sweets & Desserts (`SWEET_`)

Baked goods: `cook_method=baked` with oven temp and time. No-bake desserts (puddings, icebox pies): `cook_method=raw` or `simmer` for the cooked component. Multi-stage bakes (e.g. par-baked crust + custard filling): two sections, each with appropriate `cook_method` and `cook_stages`.

---

## Quick Reference: `cook_stages` Values by Method

| Cook method | `cook_stages` format | Example |
|---|---|---|
| Stovetop (any temp) | `0:minutes` | `0:5` (5 min simmer) |
| Oven bake | `tempF:minutes` | `375:30` (30 min at 375°F) |
| Multi-stage oven | `temp1:min1,temp2:min2` | `425:10,350:25` |
| No heat / raw | *(empty)* | |
| Fried / pan seared | `0:minutes` | `0:3` (3 min pan grill) |
| Grilled | `0:minutes` | `0:7` (7 min grill) |
