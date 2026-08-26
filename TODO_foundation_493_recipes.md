# TODO: Rebuild 493 Recipes with Foundation Foods

## Scope

- [ ] Treat the 493 recipes identified through the Foundation NDB mappings as the migration set.
- [ ] Use `docs/foundation_ledger_pairs.csv` as the authoritative ledger-to-Foundation mapping.
- [ ] Confirm that every affected ledger NDB has its leading-zero Foundation identifier in `recipes_v3/data/ingredients_ledger.csv`.
- [ ] Preserve recipe ingredient quantities, section structure, cooking methods, yield physics, and serving definitions unless a separate reviewed correction is required.
- [ ] Review the per-food missing-nutrient audit in [docs/foundation_73_nutrient_gaps.md](docs/foundation_73_nutrient_gaps.md) before rebuilding.

## Foundation NDB Reference

The identifiers below are the zero-padded Foundation NDB strings from `docs/foundation_ledger_pairs.csv`. They replace the corresponding SR Legacy identifiers in the ingredient mappings; recipe ratios and ingredient quantities remain unchanged.

| Foundation NDB | Foundation food description | Ledger key |
|---|---|---|
| `01001` | Butter, stick, salted | `butter_salted` |
| `01009` | Cheese, cheddar | `cheese_cheddar` |
| `01017` | Cream cheese, full fat, block | `cream_cheese` |
| `01019` | Cheese, feta, whole milk, crumbled | `cheese_feta` |
| `01036` | Cheese, ricotta, whole milk | `cheese_ricotta_wholemilk` |
| `01040` | Cheese, swiss | `cheese_swiss` |
| `01053` | Cream, heavy | `heavy_cream` |
| `01056` | Cream, sour, full fat | `sour_cream` |
| `01077` | Milk, whole, 3.25% milkfat, with added vitamin D | `milk_whole` |
| `01079` | Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D | `milk_lowfat_2pct` |
| `01123` | Eggs, Grade A, Large, egg whole | `egg_whole_raw` |
| `01124` | Eggs, Grade A, Large, egg white | `egg_white_raw` |
| `01125` | Eggs, Grade A, Large, egg yolk | `egg_yolk_raw` |
| `01145` | Butter, stick, unsalted | `butter_unsalted` |
| `01293` | Yogurt, Greek, plain, whole milk | `yogurt_greek_whole_milk` |
| `02046` | Mustard, prepared, yellow | `mustard_yellow` |
| `02047` | Salt, table, iodized | `salt_table` |
| `04047` | Oil, coconut | `coconut_oil` |
| `04582` | Oil, canola | `canola_oil` |
| `05665` | Turkey, ground, 93% lean/ 7% fat, raw | `ground_turkey_raw` |
| `06931` | Sauce, pasta, spaghetti/marinara, ready-to-serve | `marinara_sauce` |
| `07022` | Frankfurter, beef, unheated | `frankfurter_beef` |
| `09040` | Bananas, ripe and slightly ripe, raw | `banana_raw` |
| `09050` | Blueberries, raw | `blueberries_raw` |
| `09094` | Figs, dried, uncooked | `figs_dried_uncooked` |
| `09123` | Grapefruit juice, white, canned or bottled, unsweetened | `grapefruit_juice` |
| `09206` | Orange juice, no pulp, not fortified, not from concentrate, refrigerated | `orange_juice_raw` |
| `09236` | Peaches, yellow, raw | `peach_yellow_raw` |
| `09266` | Pineapple, raw | `pineapple_raw` |
| `09302` | Raspberries, raw | `raspberries_raw` |
| `09316` | Strawberries, raw | `strawberries_raw` |
| `09502` | Apples, granny smith, with skin, raw | `apple_granny_smith_raw` |
| `010219` | Pork, ground, raw | `pork_ground_raw` |
| `011052` | Beans, snap, green, raw | `green_beans_raw` |
| `011090` | Broccoli, raw | `broccoli_raw` |
| `011098` | Brussels sprouts, raw | `brussels_sprouts_raw` |
| `011109` | Cabbage, green, raw | `cabbage_raw` |
| `011112` | Cabbage, red, raw | `cabbage_red_raw` |
| `011124` | Carrots, mature, raw | `carrot_raw` |
| `011143` | Celery, raw | `celery_raw` |
| `011161` | Collards, raw | `collard_greens_raw` |
| `011205` | Cucumber, with peel, raw | `cucumber_raw` |
| `011209` | Eggplant, raw | `eggplant_raw` |
| `011215` | Garlic, raw | `garlic_raw` |
| `011233` | Kale, raw | `kale_raw` |
| `011238` | Mushrooms, shiitake | `mushroom_shiitake_raw` |
| `011251` | Lettuce, cos or romaine, raw | `lettuce_romaine_raw` |
| `011252` | Lettuce, iceberg, raw | `lettuce_iceberg_raw` |
| `011266` | Mushroom, crimini | `mushroom_crimini_raw` |
| `011333` | Peppers, bell, green, raw | `bell_pepper_green_raw` |
| `011457` | Spinach, mature | `spinach_raw` |
| `011540` | Tomato juice, with added ingredients, from concentrate, shelf stable | `tomato_juice` |
| `011546` | Tomato, paste, canned, without salt added | `tomato_paste` |
| `011693` | Tomatoes, crushed, canned | `tomatoes_canned_crushed` |
| `011821` | Peppers, bell, red, raw | `bell_pepper_red_raw` |
| `011937` | Pickles, cucumber, dill or kosher dill | `pickle_dill` |
| `012006` | Chia seeds, dry, raw | `chia_seeds` |
| `012061` | Nuts, almonds, whole, raw | `almonds_sliced` |
| `012087` | Nuts, cashew nuts, raw | `cashews_raw` |
| `012142` | Nuts, pecans, halves, raw | `pecans_raw` |
| `012147` | Nuts, pine nuts, raw | `pine_nuts_dried` |
| `012155` | Nuts, walnuts, English, halves, raw | `walnuts_raw` |
| `012220` | Flaxseed, ground | `flaxseed_ground` |
| `015121` | Fish, tuna, light, canned in water, drained solids | `tuna_canned_light_water` |
| `016098` | Peanut butter, creamy | `peanut_butter_smooth` |
| `016158` | Hummus, commercial | `hummus_commercial` |
| `017224` | Lamb, ground, raw | `lamb_ground_raw` |
| `019335` | Sugars, granulated | `sugar_granulated` |
| `020008` | Buckwheat, whole grain | `buckwheat_groats_raw` |
| `020036` | Rice, brown, long grain, unenriched, raw | `rice_brown_long_raw` |
| `020080` | Flour, whole wheat, unenriched | `flour_whole_wheat` |
| `020581` | Flour, wheat, all-purpose, enriched, unbleached | `flour_ap_white_enriched_unbleached` |
| `023572` | Beef, ground, 80% lean meat / 20% fat, raw | `beef_ground_80lean_raw` |

## Baseline and Safety Checks

- [ ] Record the 493 recipe IDs before rebuilding.
- [ ] Record each recipe's current build fingerprint, `sr_rule`, cooked weight, grams per serving, and per-100g nutrient panel.
- [ ] Record current Turso values before any upload.
- [ ] Confirm the Foundation and SR Legacy database paths being used; do not rely on the unavailable default combo database path.
- [ ] Verify that only the intended Foundation NDB mappings differ from the prior ingredient source.
- [ ] Do not overwrite or commit unrelated build artifacts from `recipes_v3/output/`.

## Rebuild Through Physics

- [ ] Rebuild each affected recipe with the Foundation database:

  ```bash
  RECIPES_V3_COMBOO_DB=docs/comboo-foundation.db \
    python3 recipes_v3/tools/build_all.py --recipe RECIPE_ID
  ```

- [ ] Use an explicit `--recipe` invocation for every affected recipe; do not run a bare full rebuild unless intentionally rebuilding the entire library.
- [ ] Confirm each build completes without errors or unexpected warnings.
- [ ] Confirm section-first physics still runs for every section.
- [ ] Confirm computed water yield, fat/protein/carbohydrate yields, cooked total, and serving grams remain structurally valid.
- [ ] Confirm no recipe ingredient rows, quantities, section assignments, or cooking metadata changed as a side effect.
- [ ] Check for anomalous results such as zero nutrients, missing NDB rows, negative weights, or unexpected `yfw` changes.

## Nutrient and Audit Review

- [ ] Compare each Foundation build against the prior SR Legacy build for all pipeline nutrients, not only the seven audit macros.
- [ ] Identify every per-100g nutrient whose change is attributable to the Foundation ingredient data.
- [ ] Run the audit against the Foundation database:

  ```bash
  RECIPES_V3_COMBOO_DB=docs/comboo-foundation.db \
    PYTHONPATH=recipes_v3 \
    python3 recipes_v3/tools/audit.py
  ```

- [ ] Review every Rule A/B result outside the +/-5% threshold.
- [ ] Keep recipes that still pass as Rule A or Rule B.
- [ ] Reclassify only reviewed failures as Rule C, with the failing nutrient(s) documented in `sr_notes` or the audit notes.
- [ ] Do not use stale JSON files in `recipes_v3/output/audit/` to determine the current failure set; use the freshly generated audit summary.
- [ ] Re-run the audit after any classification changes and confirm there are no unexpected Rule A/B failures.

## Bundle Update

- [ ] Regenerate the static bundle from the rebuilt Foundation outputs:

  ```bash
  RECIPES_V3_COMBOO_DB=docs/comboo-foundation.db \
    python3 recipes_v3/tools/generate_bundle.py
  ```

- [ ] Confirm the bundle contains all 493 rebuilt recipes and the updated nutrient panels.
- [ ] Confirm the bundle's recipe rules and Foundation-derived nutrition match the verified build outputs.
- [ ] Review the diff for unrelated recipe or metadata changes.
- [ ] Keep `src/lib/farmers-basket/generated-levels.ts` synchronized with the Foundation builds.

## Turso Update

- [ ] Determine whether the production `dev_recipes` rows currently contain SR Legacy-derived nutrition for the 493 recipes.
- [ ] Upload each rebuilt recipe's Foundation-derived nutrition to Turso only after local build and audit review:

  ```bash
  python3 recipes_v3/tools/upload.py --recipe RECIPE_ID --commit
  ```

- [ ] Verify the upload diff for every recipe before committing it remotely.
- [ ] Confirm `nutrition_json`, cooked weight, serving values, sections, and cooking metadata match the verified local Foundation build.
- [ ] Confirm upload parameter order remains synchronized among `_UPDATE_COLS`, `_UPDATE_SQL`, and the SQL parameter tuple.
- [ ] Re-query a representative sample and then the full 493-recipe set from Turso to verify stored nutrition matches local output.
- [ ] Remember that `sr_rule` is not currently included in `upload.py`'s update columns; classification metadata must be handled separately if runtime needs it.

## Final Verification

- [ ] Run the ledger validator:

  ```bash
  python3 recipes_v3/tools/validate_ledger.py
  ```

- [ ] Check that the Foundation NDB mapping count and affected recipe count remain 493.
- [ ] Compare local Foundation build output, generated bundle data, and Turso `nutrition_json` for every affected recipe.
- [ ] Confirm no recipe ratios or ingredient quantities changed.
- [ ] Confirm no stale SR Legacy nutrition remains in the affected Turso rows.
- [ ] Review `git diff` and `git status` for only the intended source, bundle, and documentation changes.
- [ ] Commit only after all local and Turso verification steps pass.
