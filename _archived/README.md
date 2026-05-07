# Archived: v1/v2-era recipe pipeline

This folder holds files that were retired when v3 became the sole recipe
nutrition pipeline (see `docs/v3.md` §14b–c).

Nothing in here is read by the running web app, the bundle generator, or the
v3 pipeline. It is preserved for code archaeology only. Do not re-introduce
any of these into the active tree.

## Contents

| Path | What it was | Replaced by |
|---|---|---|
| `recipes_v2/` | Original v2 sandbox CSVs + Python `lib/` (retention dict, fingerprint, snapshot tests) — never reached production | `recipes_v3/` |
| `scripts/upload-dev-recipe.deprecated.mjs` | v1 Turso uploader (already a stub when archived) | `recipes_v3/tools/upload.py` |
| `scripts/sync_sweet003.mjs` | One-off SWEET_003 sync from v2 → v1 CSVs | v3 build → upload pipeline |
| `scripts/convert_recipes_to_ts.py` | Generator that produced the dead `recipes.ts` export | (no replacement — `recipes.ts` had no consumers) |
| `sync_recipes_v2_to_app_data.py` | v2 → v1 CSV exporter (kept v1 contract alive while v2 was a sandbox) | v3 owns its own CSVs |
| `generate_recipe_nutrition.py` | Older Python nutrition generator that read `recipes_v2/data/recipes.csv` | `recipes_v3/lib/build.py` |
| `src_lib_data/recipes.csv` | v1 game-metadata CSV (categories, prep time, sr_rule labels) | `recipes_v3/data/recipes.csv` (Phase 8a, 2026-05-07) |
| `src_lib_data/recipe_ingredients.csv` | v1 ingredient display strings used by the bundle | `recipes_v3/data/recipe_ingredients.csv` (Phase 8a) |
| `src_lib_data/recipe_instructions.csv` | v1 instruction display strings used by the bundle | `recipes_v3/data/recipe_instructions.csv` (Phase 8a) |
| `src_lib_data/recipes.ts` | Nested `Recipe[]` TS export (output of `convert_recipes_to_ts.py`) | (no replacement — dead since before Phase 8a; no imports) |

## What was NOT archived (still live as of Phase 8a, 2026-05-07)

- `src/lib/data/recipe-nutrition.json` and `src/lib/data/recipe-nutrition.ts` — Pipeline B per-serving sidecar. Still imported by `src/routes/farmers-basket/+page.svelte` and `src/routes/api/recipes/nutrition/+server.ts`. Retiring these requires migrating those routes to read from the bundle (`generated-levels.ts`) or directly from Turso. Tracked separately from Phase 8a.
- `generate_levels.py` itself stays at the project root: it now reads exclusively from `recipes_v3/data/` (Phase 8a), with one read of `assets/comboo.db` for the dish-row `Long_Desc` display name.
