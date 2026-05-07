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

## Phase 8b-2 additions (2026-05-07) — root cleanup

To leave the project root free of stray scripts, the following were archived
to `_archived/scripts/`:

| File(s) | What it was | Why archived |
|---|---|---|
| `add_cancel_styles.py`, `fix_modals.py`, `update_convert.py`, `update_extract.py`, `update_foodpicker.py`, `update_landing.py`, `update_builtin_server.py` | One-shot string-rewriters that already patched their target files | Their changes are committed in the target files; re-running them is a no-op or worse |
| `run_migration_004.py`, `run_migration_005.py`, `run_migration_006.py` | One-off Turso DDL migrations (already applied) | Migration history; re-running would error on existing schema |
| `build_recipes_local.py`, `seed_recipes.py`, `match_ndb_numbers.py` | v1-era recipe loaders / NDB matchers | Superseded by `recipes_v3/tools/` |
| `setup_local_dev.py` | v1 dev-DB scaffolder | Predates v3 dev workflow |
| `analyze_variety.py` | One-off food-variety analysis | Done; output not consumed by anything |
| `scripts/added-sugar-rules.mjs` | Added-sugar policy table (JS) | Ported to `recipes_v3/lib/added_sugars.py` |
| `scripts/migrate-ingredients-camelcase.mjs` | One-time snake→camel migration of recipe JSON | Already applied |
| `scripts/copy-builtin-to-turso.mjs` | One-shot LEVELS → Turso copy | v3 upload pipeline supersedes |

## What was NOT archived (still live as of Phase 8b-2, 2026-05-07)

- **`scripts/sync-admin-recipes.mjs`** — wired to `npm run build` via the `prebuild` hook; syncs admin-added recipes from Turso → `LEVELS`.
- **`scripts/extract_food_words.py`** — USDA food-word extractor; small ETL utility kept at the scripts/ root.
- **`scripts/dev/`** — active dev/ops utilities relocated from project root: `daily_report.py`, `check_notes.py`, `convert_to_ts.py`, `extract_portion_data.py`. Not on any build hook; run on demand.
- **`recipes_v3/tools/generate_bundle.py`** — formerly `generate_levels.py` at the project root; moved into `recipes_v3/tools/` in Phase 8b-1 along with the lift of game-design literals to `recipes_v3/lib/game_design.py` + `recipes_v3/data/game_design.csv`.
- **`src/lib/data/recipe-nutrition.json` and `src/lib/data/recipe-nutrition.ts`** — Pipeline B per-serving sidecar. Still imported by `src/routes/farmers-basket/+page.svelte` and `src/routes/api/recipes/nutrition/+server.ts`. Retiring requires route migration. Phase 8b-3.
