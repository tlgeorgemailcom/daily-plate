# Phase 0 Report — Pre-Build Data Verification

**Date:** 2026-05-06
**Status:** ✅ PASSED — ready to start Phase 1 (build)

---

## Verification Summary

| Check | Result | Notes |
|---|---|---|
| 1. SWEET coverage | ✅ PASS | All 40 SWEET recipes (SWEET_001 → SWEET_040) present in `data/recipes.csv` |
| 2. Recipe ingredient rows | ✅ PASS | Every recipe has ≥1 ingredient row. Min: SWEET_036 (5 ings), Max: SWEET_007 (26 ings) |
| 3. Ingredient ledger integrity | ✅ PASS (after fix) | 1 orphan key found and resolved |
| 4. NDB integrity vs comboo.db | ✅ PASS | All 71 ledger NDBs exist in `comboo.db::DataCentralCombo` (8,790 rows total) |
| 5. Rule A/B canonical NDB | ✅ PASS | All 21 Rule A/B recipes have a `canonical_ndb_no` |

---

## Data Loaded

| File | Rows |
|---|---:|
| `data/recipes.csv` | 40 |
| `data/ingredients_ledger.csv` | 72 (was 71, +1 added) |
| `data/recipe_ingredients.csv` | 476 |
| `data/recipe_instructions.csv` | 377 |

---

## Issues Found and Resolved

### Issue 1: orphan `ingredient_key = water` in SWEET_035
- **Problem:** `recipe_ingredients.csv` row `SWEET_035, row_order=2, ingredient_key=water, 180g, section=filling` referenced a key not present in `ingredients_ledger.csv`.
- **Impact if unfixed:** v3 build would fail to look up nutrition for water (would crash or treat as zero).
- **Resolution:** Added ledger row:
  ```
  water,14411,"Water, tap, drinking",water,cup,237.0,Tap water; nutritionally inert (0 kcal)
  ```
- **NDB choice:** `14411` (Water, tap, drinking) — standard SR Legacy entry for plain tap water in recipes. Alternatives considered: `14555` (bottled, generic), `14559` (Evian) — both wrong context. Tap is correct for cooking.

### Informational: 6 unused ledger keys
- 6 ingredient_keys exist in `ingredients_ledger.csv` but are never referenced by any recipe.
- Not an error; left in place. Will revisit if cleanup needed in Phase 8.

---

## Baseline Captured

`recipes_v3/baselines/turso_locked2_baseline.json` — snapshot of all 21 `locked=2` Turso `dev_recipes` rows including:
- `recipe_name`, `servings_count`, `grams_per_serving`, `cooking_method`
- `nutrition_json.yieldFactorWater`, `yieldFactorFat`
- `nutrition_json.per100g` (full nutrient dict)
- `nutrition_json.perServing`

This is the **Phase 3 acceptance target**: v3 must reproduce these per-100g values within ±0.5% per nutrient.

The 21 baseline recipes:
```
SWEET_001, 002, 003, 004, 005, 006, 007, 009, 010, 011,
SWEET_016, 017, 018, 019, 021, 022, 023, 024, 029, 031, 039
```

---

## Phase 1 Readiness

✅ All inputs validated
✅ Math contract specified in [docs/v3.md §4](../../jetcool/docs/v3.md)
✅ Retention table specified in [docs/v3.md §5](../../jetcool/docs/v3.md)
✅ Output schema specified in [docs/v3.md §8](../../jetcool/docs/v3.md)

**Next:** Build `lib/load.py`, `lib/nutrients.py`, `lib/retention.py`, `lib/yield_model.py`, `lib/build.py`, `tools/build_one.py`. First target recipe: **SWEET_001** (Apple Pie).
