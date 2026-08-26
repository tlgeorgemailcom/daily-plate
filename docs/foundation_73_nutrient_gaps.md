# Foundation Foods: 73-Item Nutrient Gap Audit

## Method

Checked the 73 unique Foundation NDB identifiers in `docs/foundation_ledger_pairs.csv` against `docs/comboo-foundation.db`, table `DataCentralCombo`. A nutrient is listed only when its database value is `NULL`; a stored zero is not treated as missing.

The audit fields are the seven recipe audit macros plus key minerals and vitamins used in the nutrition panel. `N/A` fields can be expected for ingredients that do not contain that nutrient, but they are still absent from the Foundation row and cannot contribute data to a recipe calculation.

## Missing Values Summary

| Nutrient | Missing rows |
|---|---:|
| Protein | 2/73 |
| Total fat | 1/73 |
| Carbohydrate | 2/73 |
| Dietary fiber | 33/73 |
| Total sugars | 38/73 |
| Energy | 2/73 |
| Water | 1/73 |
| Calcium | 4/73 |
| Iron | 4/73 |
| Magnesium | 4/73 |
| Phosphorus | 4/73 |
| Potassium | 4/73 |
| Sodium | 5/73 |
| Zinc | 4/73 |
| Vitamin A (RAE) | 54/73 |
| Vitamin C | 44/73 |
| Thiamin (B1) | 27/73 |
| Riboflavin (B2) | 39/73 |
| Niacin (B3) | 26/73 |
| Vitamin B6 | 23/73 |
| Folate | 40/73 |
| Vitamin B12 | 61/73 |
| Vitamin D | 63/73 |
| Vitamin E | 53/73 |
| Vitamin K | 44/73 |
| Choline | 68/73 |

## Per-Food Results

Abbreviations: `P` protein, `F` total fat, `C` carbohydrate, `Fi` fiber, `Su` sugar, `E` energy, `W` water, `Ca` calcium, `Fe` iron, `Mg` magnesium, `Ph` phosphorus, `K` potassium, `Na` sodium, `Zn` zinc, `A` vitamin A, `C-vit` vitamin C, `B1` thiamin, `B2` riboflavin, `B3` niacin, `B6` vitamin B6, `Fol` folate, `B12` vitamin B12, `D` vitamin D, `E-vit` vitamin E, `K-vit` vitamin K, `Cho` choline.

| Foundation NDB | Ledger key | Missing important nutrients |
|---|---|---|
| `01001` | `butter_salted` | B1, K-vit, Cho |
| `01009` | `cheese_cheddar` | Fi, C-vit, D, Cho |
| `01017` | `cream_cheese` | Fi, Su, A, C-vit, B2, Fol, D, E-vit, Cho |
| `01019` | `cheese_feta` | Fi, A, C-vit, Fol, B12, E-vit, Cho |
| `01036` | `cheese_ricotta_wholemilk` | Fi, Su, C-vit, D, Cho |
| `01040` | `cheese_swiss` | Fi, C-vit |
| `01053` | `heavy_cream` | Fi, Su, A, C-vit, B2, Fol, D, E-vit, Cho |
| `01056` | `sour_cream` | Fi, Su, A, C-vit, B2, Fol, D, E-vit, Cho |
| `01077` | `milk_whole` | Fi, C-vit, K-vit |
| `01079` | `milk_lowfat_2pct` | Fi, C-vit, K-vit |
| `01123` | `egg_whole_raw` | C-vit, E-vit, K-vit |
| `01124` | `egg_white_raw` | Fi, Su, Ca, Fe, Mg, Ph, K, Na, Zn, A, C-vit, B1, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `01125` | `egg_yolk_raw` | Fi, Su, Ca, Fe, Mg, Ph, K, Na, Zn, A, C-vit, B1, B3, B6, Fol, B12, D, K-vit, Cho |
| `01145` | `butter_unsalted` | A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `01293` | `yogurt_greek_whole_milk` | Fi, A, C-vit, Fol, B12, E-vit, Cho |
| `02046` | `mustard_yellow` | B12, D, Cho |
| `02047` | `salt_table` | P, F, C, Fi, Su, E, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `04047` | `coconut_oil` | Fi, Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, Cho |
| `04582` | `canola_oil` | P, C, Fi, Su, E, W, Ca, Fe, Mg, Ph, K, Na, Zn, A, C-vit, B1, B2, B3, B6, Fol, B12, D, K-vit, Cho |
| `05665` | `ground_turkey_raw` | Fi, Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `06931` | `marinara_sauce` | C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `07022` | `frankfurter_beef` | Fi, C-vit, D, K-vit, Cho |
| `09040` | `banana_raw` | B12, D, E-vit, Cho |
| `09050` | `blueberries_raw` | Fi, A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `09094` | `figs_dried_uncooked` | B12, D, Cho |
| `09123` | `grapefruit_juice` | A, B12, D, K-vit, Cho |
| `09206` | `orange_juice_raw` | Fi, A, B2, B12, D, E-vit, K-vit, Cho |
| `09236` | `peach_yellow_raw` | B12, D, E-vit, Cho |
| `09266` | `pineapple_raw` | A, B2, Fol, B12, D, E-vit, K-vit, Cho |
| `09302` | `raspberries_raw` | Fi, A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `09316` | `strawberries_raw` | Fi, A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `09502` | `apple_granny_smith_raw` | A, C-vit, B12, D, E-vit, K-vit, Cho |
| `010219` | `pork_ground_raw` | Fi, Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `011052` | `green_beans_raw` | A, C-vit, B2, Fol, B12, D, E-vit, Cho |
| `011090` | `broccoli_raw` | B12, D, Cho |
| `011098` | `brussels_sprouts_raw` | Su, A, B1, B2, B3, B6, B12, D, E-vit, K-vit, Cho |
| `011109` | `cabbage_raw` | Fi, Su, A, B1, B2, B3, Fol, B12, D, E-vit, Cho |
| `011112` | `cabbage_red_raw` | Fi, Su, A, B1, B2, B3, Fol, B12, D, E-vit, Cho |
| `011124` | `carrot_raw` | Su, A, C-vit, B12, D, E-vit, K-vit, Cho |
| `011143` | `celery_raw` | Fi, Su, A, C-vit, B1, B2, B3, Fol, B12, D, E-vit, K-vit, Cho |
| `011161` | `collard_greens_raw` | Su, A, B1, B2, B3, B6, B12, D, E-vit, K-vit, Cho |
| `011205` | `cucumber_raw` | Fi, Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, Cho |
| `011209` | `eggplant_raw` | A, B1, B2, B3, B6, B12, D, E-vit, K-vit, Cho |
| `011215` | `garlic_raw` | Su, Ca, Fe, Mg, Ph, K, Na, Zn, A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `011233` | `kale_raw` | B12, D, Cho |
| `011238` | `mushroom_shiitake_raw` | Su, A, C-vit, B12, E-vit, K-vit, Cho |
| `011251` | `lettuce_romaine_raw` | Na, B12, D, Cho |
| `011252` | `lettuce_iceberg_raw` | Fi, Su, A, C-vit, B2, Fol, B12, D, E-vit, Cho |
| `011266` | `mushroom_crimini_raw` | Su, A, C-vit, Fol, B12, E-vit, K-vit, Cho |
| `011333` | `bell_pepper_green_raw` | Su, A, B12, D, E-vit, K-vit, Cho |
| `011457` | `spinach_raw` | Su, B12, D, E-vit, K-vit, Cho |
| `011540` | `tomato_juice` | Fi, A, B2, B12, D, E-vit, K-vit, Cho |
| `011546` | `tomato_paste` | A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `011693` | `tomatoes_canned_crushed` | A, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `011821` | `bell_pepper_red_raw` | Su, A, B12, D, E-vit, K-vit, Cho |
| `011937` | `pickle_dill` | B12, D, Cho |
| `012006` | `chia_seeds` | Fi, Su, A, C-vit, B2, Fol, B12, D, E-vit, K-vit, Cho |
| `012061` | `almonds_sliced` | Su, A, C-vit, B2, Fol, B12, D, E-vit, Cho |
| `012087` | `cashews_raw` | Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `012142` | `pecans_raw` | Su, A, C-vit, B2, Fol, B12, D, E-vit, Cho |
| `012147` | `pine_nuts_dried` | Su, A, C-vit, B2, Fol, B12, D, E-vit, Cho |
| `012155` | `walnuts_raw` | Su, A, C-vit, B2, Fol, B12, D, E-vit, Cho |
| `012220` | `flaxseed_ground` | Su, A, C-vit, B2, B12, D, Cho |
| `015121` | `tuna_canned_light_water` | Fi, A, C-vit, Fol, E-vit, K-vit, Cho |
| `016098` | `peanut_butter_smooth` | Su, A, C-vit, B2, B12, D, Cho |
| `016158` | `hummus_commercial` | B12, D |
| `017224` | `lamb_ground_raw` | Fi, Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `019335` | `sugar_granulated` | Fi, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |
| `020008` | `buckwheat_groats_raw` | Su, A, C-vit, Fol, B12, D, E-vit, K-vit, Cho |
| `020036` | `rice_brown_long_raw` | Su, A, C-vit, Fol, B12, D, E-vit, K-vit, Cho |
| `020080` | `flour_whole_wheat` | Su, A, C-vit, B12, D, E-vit, K-vit, Cho |
| `020581` | `flour_ap_white_enriched_unbleached` | A, C-vit, B12, D, E-vit, K-vit, Cho |
| `023572` | `beef_ground_80lean_raw` | Fi, Su, A, C-vit, B1, B2, B3, B6, Fol, B12, D, E-vit, K-vit, Cho |

## Migration Actions

- [ ] Decide whether missing core fields should block Foundation migration. They affect `salt_table`, `canola_oil`, and two protein rows and should be reviewed before rebuild.
- [ ] Decide whether missing micronutrients should remain `NULL`, be treated as zero only where USDA semantics support that interpretation, or be supplemented from an approved source.
- [ ] Do not silently replace missing Foundation values with SR Legacy values; that would create a mixed-source nutrient profile.
- [ ] After any approved data correction, rerun the 73-item audit and all affected recipe builds.
