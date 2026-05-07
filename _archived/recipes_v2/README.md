# Recipes v2

A parallel recipe build pipeline for reverse-engineering canonical SR Legacy whole-food recipes from `food-portions-complete.csv` and `comboo.db::DataCentralCombo`.

This pipeline runs **alongside** the existing v1 system and does not modify any v1 files. v1 remains the production source of truth until v2 is validated.

## Goals

The v1 pipeline works but the inner loop (author → build → eyeball deltas → tweak grams → rebuild) is painful. v2 implements nine improvements in parallel:

1. **Per-nutrient delta JSON artifact** — first-class output per recipe (`deltas/<RECIPE_ID>.json`).
2. **Solver** — least-squares optimizer for ingredient grams against canonical macros.
3. **Candidate ingredient suggester** — ranks NDB rows whose per-100g profile matches the dish.
4. **Cooking yield model** — `cook_method` + `yield_factor` adjust raw ingredient totals before per-100g math.
5. **Recipe fingerprint + approval lock** — sha256 over canonical NDB + ingredients + instructions; mismatched fingerprint blocks publish of approved recipes.
6. **State machine** — `draft → built → reviewed → approved → published`, with gates per transition.
7. **Snapshot regression tests** — every approved recipe writes a snapshot; rebuild must reproduce it.
8. **Ingredients ledger** — canonical reusable ingredient definitions decoupled from per-recipe quantities.
9. **Post-upload sanity probe** — verifies remote `dev_recipes.nutrition_json.per100g` matches `food-portions-complete.csv` `*_100g` columns.

## Directory layout

```
recipes_v2/
├── README.md
├── data/
│   ├── recipes.csv                    # recipe metadata (incl. status, fingerprint, cook_method)
│   ├── ingredients_ledger.csv         # canonical reusable ingredient definitions
│   ├── recipe_ingredients.csv         # per-recipe ingredient rows (refs ledger by key)
│   └── recipe_instructions.csv        # per-recipe instruction steps
├── lib/                               # python modules (no side effects on import)
│   ├── data.py                        # CSV + comboo.db loaders
│   ├── canonical.py                   # canonical per-100g + scaling
│   ├── build.py                       # built nutrition + yield model
│   ├── delta.py                       # per-nutrient delta report
│   ├── fingerprint.py                 # recipe fingerprint
│   ├── state.py                       # status state machine
│   ├── solver.py                      # gram optimizer (requires scipy)
│   ├── suggest.py                     # candidate ingredient suggester
│   ├── snapshot.py                    # snapshot regression test
│   └── probe.py                       # post-upload sanity probe
├── tools/
│   └── pipeline.py                    # CLI orchestrator
├── deltas/                            # generated per-recipe delta JSON
└── snapshots/                         # generated approved-recipe snapshots
```

## Quick start

From `/Volumes/training/Daily Food Chain/daily-food-chain/recipes_v2`:

```bash
# Build SWEET_001 and write delta report
python3 tools/pipeline.py SWEET_001

# Build, then run solver to optimize ingredient grams
python3 tools/pipeline.py SWEET_001 --solve

# Suggest candidate ingredients for the canonical dish
python3 tools/pipeline.py SWEET_001 --suggest

# Transition to a new status (gates enforced)
python3 tools/pipeline.py SWEET_001 --to-status reviewed
python3 tools/pipeline.py SWEET_001 --to-status approved

# Snapshot the current state (call after --to-status approved)
python3 tools/pipeline.py SWEET_001 --snapshot

# Verify current build still matches snapshot
python3 tools/pipeline.py SWEET_001 --test-snapshot

# Probe the live Turso row against food-portions-complete.csv
python3 tools/pipeline.py SWEET_001 --probe
```

## Status state machine

| State        | Means                                               | Gate to enter                                          |
|--------------|-----------------------------------------------------|--------------------------------------------------------|
| `draft`      | Recipe row exists, no nutrition computed yet        | (initial)                                              |
| `built`      | Built per-100g exists                               | Build succeeds and `deltas/<id>.json` written          |
| `reviewed`   | Human has examined the delta report                 | `deltas/<id>.json` exists and is non-empty             |
| `approved`   | Recipe text + grams locked                          | All major-delta fields are within tolerance OR fallback-justified |
| `published`  | Uploaded to Turso `dev_recipes` and probe passes    | Snapshot exists, fingerprint matches, probe passes     |

Transitions are linear; backward transitions require `--force`.

## Cook method / yield model

`cook_method` is one of: `raw`, `bake`, `boil`, `fry`, `roast`. Each maps to a per-nutrient retention dict in `lib/build.py`. For example, `bake` retains 70% of water and 100% of macros; `boil` retains 100% water but loses some water-soluble vitamins. The retention factors are applied to whole-recipe totals **before** per-100g division.

Default for SWEET_001 is `bake` to model post-bake apple pie.

## Fingerprint

The fingerprint is `sha256` over a canonical-form string built from:

- `recipe_id`
- `canonical_ndb_no`
- sorted list of `(ingredient_key, grams_rounded_to_2dp)` tuples
- ordered list of instruction step texts (whitespace-normalized)

Display strings (`qty_display`, `display_name_override`) are excluded — they don't affect nutrition. `cook_method` and `yield_factor` are included because they change the per-100g result.

## Comparison with v1

`lib/probe.py --compare-v1 SWEET_001` runs the v2 build against the v1 `recipes_dev.db` row for the same recipe and prints a per-nutrient diff. Use this during the v1→v2 migration to confirm v2 reproduces v1 results within tolerance (or to identify deltas that the v2 yield model legitimately introduces).

## What v2 deliberately does NOT do

- Does not write to `recipes_dev.db` or `dev_recipes`.
- Does not modify v1 CSVs or scripts.
- Does not replace `upload-dev-recipe.mjs`. v2 produces a `built/` payload directory; uploading remains a v1 concern until v2 is validated.

## Migration plan (separate work)

Once v2 has reproduced ≥10 v1 recipes within macro tolerance, a thin `tools/export_to_v1.py` script will translate v2 CSVs back into v1 CSVs so the existing upload pipeline can publish v2-built recipes without code changes downstream.
