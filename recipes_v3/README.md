# recipes_v3 — Self-Contained Recipe Pipeline

End-to-end nutrition pipeline for SWEET recipes. Reads its own CSVs, writes
its own JSON, uploads directly to Turso, and regenerates the SvelteKit bundle.

**Self-containment rule:** every input/output path used by this pipeline is
defined in [`config.py`](config.py). No file in `recipes_v3/` may hardcode an
absolute path. The only file we touch outside this tree is
[`comboo.db`](#combodb-and-other-cross-game-assets) (the USDA SR-Legacy
nutrient database, shared with other JetFoodData games) and one write to
`src/lib/farmers-basket/generated-levels.ts` (the SvelteKit bundle).

---

## Layout

```
recipes_v3/
├── README.md            ← this file
├── config.py            ← single source of paths (override via env vars)
├── data/                ← v3-owned inputs
│   ├── recipes.csv
│   ├── ingredients_ledger.csv
│   ├── recipe_ingredients.csv
│   ├── recipe_instructions.csv
│   └── game_design.csv  ← per-recipe foods for the game board
├── lib/                 ← pure modules, no side effects on import
│   ├── load.py          ← schema-validated loaders
│   ├── nutrients.py     ← per-100g lookups
│   ├── retention.py     ← USDA R6 retention factors
│   ├── added_sugars.py  ← added/intrinsic sugar split
│   ├── build.py         ← orchestrator (load → sum → retain → yield)
│   ├── audit.py         ← Rule A/B canonical comparison
│   ├── fingerprint.py
│   └── game_design.py   ← FOOD_ANIMAL, CATEGORY_DIFFICULTY, get_tools/spawns/supply
├── tools/               ← CLI entry points
│   ├── phase0_verify.py    ← pre-build data sanity checks
│   ├── build_one.py        ← build one recipe → output/builds/<id>.json
│   ├── build_all.py        ← build every recipe in recipes.csv
│   ├── compare.py / compare_one.py
│   ├── upload.py           ← write directly to Turso (gated by --commit)
│   └── generate_bundle.py  ← write src/lib/farmers-basket/generated-levels.ts
└── output/              ← gitignored
    ├── builds/<id>.json
    ├── audits/<id>.json
    ├── compare/<id>.json
    └── upload_log/<unix>-{commit,dryrun}.json
```

---

## The standard workflow (edit a recipe end-to-end)

1. **Edit a CSV in `data/`.** Most edits are to one of:
   - `recipes.csv` — recipe-level metadata, yield factors, cook method
   - `recipe_ingredients.csv` — per-recipe ingredient list + grams
   - `ingredients_ledger.csv` — NDB lookup + display name for each ingredient
   - `recipe_instructions.csv` — step-by-step instructions
   - `game_design.csv` — which board foods belong to which recipe
2. **Verify inputs.**
   ```sh
   python3 recipes_v3/tools/phase0_verify.py
   ```
3. **Build.**
   ```sh
   python3 recipes_v3/tools/build_one.py SWEET_022   # one recipe
   python3 recipes_v3/tools/build_all.py             # all recipes
   ```
4. **Upload to Turso (dry-run first).**
   ```sh
   python3 recipes_v3/tools/upload.py                # dry-run diff
   python3 recipes_v3/tools/upload.py --commit       # write
   ```
5. **Regenerate the bundle.**
   ```sh
   python3 recipes_v3/tools/generate_bundle.py
   ```

That's it. No file outside `recipes_v3/` needs to be edited.

---

## comboo.db and other cross-game assets

`comboo.db` (USDA SR-Legacy nutrient database, ~50 MB) lives in the **jetcool
Flutter app** at `/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db`
because multiple games in the JetFoodData family read it. v3 does not own a
copy.

The default path is set in [`config.py`](config.py). Override it with the
environment variable `RECIPES_V3_COMBOO_DB`:

```sh
export RECIPES_V3_COMBOO_DB=/path/to/your/comboo.db
python3 recipes_v3/tools/build_all.py
```

Likewise, `RECIPES_V3_BUNDLE_OUTPUT` overrides the SvelteKit bundle output
location.

---

## What this pipeline deliberately does **not** own

- **`src/lib/server/calcNutritionSR28.ts`** — the v1 TypeScript nutrition
  engine still serves user-submitted recipes through six API routes. Retiring
  it is a separate task (see `docs/v3.md` Phase 8b-3).
- **`src/lib/data/recipe-nutrition.{json,ts}`** — Pipeline-B sidecar, still
  imported by two routes.
- **All other root-level Python scripts** in `daily-food-chain/` (`fix_modals.py`,
  `seed_recipes.py`, etc.) are unrelated to recipes; they are app/UI helpers
  and stay where they are.

---

## See also

- `docs/v3.md` (in the jetcool repo) — full v3 plan, math contract, retention
  table, phase outcomes.
- `_archived/README.md` — what was retired and when.
