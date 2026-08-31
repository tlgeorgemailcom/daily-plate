# Foundation Foods: 73-Item Nutrient Gap Audit

## Method

Checked the 73 unique Foundation NDB identifiers in `docs/foundation_ledger_pairs.csv` against `docs/comboo-foundation.db`, table `DataCentralCombo`. A nutrient is listed only when its database value is `NULL`; a stored zero is not treated as missing.

The audit fields are the seven recipe audit macros plus key minerals and vitamins used in the nutrition panel. `N/A` fields can be expected for ingredients that do not contain that nutrient, but they are still absent from the Foundation row and cannot contribute data to a recipe calculation.

## Missing Values Summary

| Nutrient | Missing rows |
|---|---:|
| Protein | 2/73 |
| Total fat | 1/73 |
| Carbohydrate | 3/73 |
| Dietary fiber | 33/73 |
| Total sugars | 38/73 |
| Energy | 0/73 |
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

### Energy estimates for butter

Foundation Foods does not report Energy for the two butter rows below. Do not copy
the SR Legacy Energy value into the Foundation profile. Instead, calculate Energy
from the Foundation macronutrients using the butter-specific Atwater factors from
the [FAO energy conversion factors](https://www.fao.org/4/y5022e/y5022e04.htm),
Table 3.1:

- Protein: `4.27 kcal/g`
- Fat: `8.79 kcal/g`
- Total carbohydrate: `3.87 kcal/g`

The calculated values are:

| Foundation NDB | Description | Foundation P/F/C (g/100g) | Calculation | Energy to store (kcal/100g) |
|---|---|---|---|---:|
| `01001` | Butter, stick, salted | `0.85 / 82.2 / 0.58` | `(0.85 x 4.27) + (82.2 x 8.79) + (0.58 x 3.87) = 728.4121` | `728` |
| `01145` | Butter, stick, unsalted | `0.85 / 81.5 / 0.06` | `(0.85 x 4.27) + (81.5 x 8.79) + (0.06 x 3.87) = 720.2467` | `720` |

These are Foundation-based calculated estimates, not Foundation-reported Energy
values. The salted value differs from the SR Legacy value of `717 kcal/100g`
because SR Legacy used its own macronutrient profile (`0.85 / 81.11 / 0.06`).

### FAO specific-factor references for remaining gaps

The FAO Table 3.1 provides the following specific Atwater factors for categories
represented among the remaining Foundation rows. These factors are references for
the calculations below; no remaining database values are changed by this section.

| FAO category | Protein (kcal/g) | Fat (kcal/g) | Total carbohydrate (kcal/g) |
|---|---:|---:|---:|
| Other vegetable fats and oils | `--` | `8.84` | `--` |
| Fruits, all except lemons and limes | `3.36` | `8.37` | `3.60` |
| Fruit juice, except lemon and lime | `3.36` | `8.37` | `3.92` |
| Mature dry beans, peas, nuts | `3.47` | `8.37` | `4.07` |
| Other vegetables | `2.44` | `8.37` | `3.57` |

These categories cover the listed olive, sunflower, peanut, soybean, safflower,
corn, and canola oils; blackberries and the other listed fruits and vegetables;
the listed fruit juices; and the 0%-moisture dry bean rows. `Salt, table,
iodized` has no energy-producing macronutrients and therefore does not require an
Atwater energy estimate. The FAO table does not provide a separate factor for
each individual food in these groups, so the category assignment should be
recorded with each subsequent calculation.

#### Oil calculations

For these oil rows, SR Legacy reports protein and carbohydrate as `0`, while
Foundation reports only the fat value. Using the FAO factor for other vegetable
fats and oils (`8.84 kcal/g`):

| Foundation NDB | Description | Foundation fat (g/100g) | Calculation | Estimated Energy (kcal/100g) |
|---|---|---:|---|---:|
| `0100258` | Oil, olive, extra light | `92.9` | `92.9 x 8.84 = 821.236` | `821` |
| `0100262` | Oil, sunflower | `93.2` | `93.2 x 8.84 = 823.888` | `824` |
| `04042` | Oil, peanut | `93.4` | `93.4 x 8.84 = 825.656` | `826` |
| `04044` | Oil, soybean | `94.6` | `94.6 x 8.84 = 836.264` | `836` |
| `04063` | Oil, olive, extra virgin | `93.7` | `93.7 x 8.84 = 828.308` | `828` |
| `04511` | Oil, safflower | `93.2` | `93.2 x 8.84 = 823.888` | `824` |
| `04518` | Oil, corn | `94.0` | `94.0 x 8.84 = 830.960` | `831` |
| `04582` | Oil, canola | `94.5` | `94.5 x 8.84 = 835.380` | `835` |

These are calculated estimates, not Foundation-reported Energy values. Only
`04582` (canola oil) is included in the 73-food paired audit; the other oil rows
are additional missing-energy rows in the full Foundation database.

#### Watermelon calculation

Foundation watermelon `0100383` reports protein but no fat or carbohydrate:
`P=0.871 g` per 100 g. SR Legacy `09326` reports `F=0.15 g` and `C=7.55 g`
per 100 g, which are used here as provisional cross-source estimates. Using the
FAO factor for fruits,
except lemons and limes (`P=3.36`, `F=8.37`, `C=3.60 kcal/g`):

`(0.871 x 3.36) + (0.15 x 8.37) + (7.55 x 3.60) = 31.36206`

Estimated Energy: **31 kcal/100 g**. This is a calculated estimate using two
SR Legacy macronutrients, not a Foundation-reported Energy value.

### Foundation search-source cleanup history

The following local database actions retired exact Foundation duplicates from
search by setting `key10=0`. Matching Legacy rows were kept searchable. These
actions changed search-source selection only; they did not merge nutrient
columns between databases.

Current inventory of Foundation rows whose stored `NDB_NO` begins with `0`:

- **363 total rows**
- **63 rows** with `key10=0`
- **300 rows** with positive `key10` and therefore still searchable

The leading-zero subset contains 363 distinct numeric NDB identities; the
counts are not inflated by duplicate padded and unpadded identifiers.

| Batch | Exact identities or scope | Foundation result |
|---|---|---|
| Eggs | Whole egg `01123`/`1123`, egg white `01124`/`1124`, egg yolk `01125`/`1125` | 3 rows retired |
| Meat, seafood, and peanut butter | Ground turkey `05665`, ground pork `010219`, ground beef `023572`, ground lamb `017224`, beef frankfurter `07022`, canned light tuna `015121`, peanut butter `016098` | 7 rows retired |
| Fruits and juices | Exact normalized NDB matches in the audited fruit/juice set | 40 rows processed; 39 changed to `key10=0`; records without Legacy counterparts were left untouched |
| Vegetables and pickles | Previously retired exact duplicates plus cucumber `11206` and tomato `11529` | Cucumber and tomato retired; earlier duplicate rows remained retired |
| Nuts and seeds | Chia `12006`, almonds `12061`, cashews `12087`, pecans `12142`, pine nuts `12147`, walnuts `12155`, flaxseed `12220` | All 7 were already at `key10=0` |
| Grains, starches, and sugar | Buckwheat `20008`, brown rice `20040`, whole-wheat flour `20080`, white flour `20581`, granulated sugar `19335` | 9 rows found across padded/unpadded IDs; 5 changed to `key10=0`, 4 were already retired |

### Exact Legacy duplicate retirements

On 2026-08-28, exact shared numeric NDB matches were checked in the local
Foundation and SR Legacy databases for four prepared-food and sauce items.
Foundation rows were retired from search by setting `key10=0`; nutrient values
were not changed. Both padded and unpadded Foundation identifiers were handled
where present.

| Legacy NDB | Item | Foundation rows retired or already retired | Legacy `key10` retained |
|---:|---|---|---:|
| `2046` | Mustard, prepared, yellow | `02046`, `2046` | `11` |
| `6931` | Sauce, pasta, spaghetti/marinara, ready-to-serve | `06931`, `6931` | `4` |
| `16158` | Hummus, commercial | `016158`, `16158` | `11` |
| `15121` | Fish, tuna, light, canned in water, drained solids | `015121`, `15121` | `2` |

Eight Foundation rows now have `key10=0`; three searchable rows were changed
and five were already retired. The corresponding Legacy rows remain searchable
and their `key10` values were unchanged.

- [ ] Decide whether missing core fields should block Foundation migration. They affect `salt_table`, `canola_oil`, and two protein rows and should be reviewed before rebuild.
- [ ] Decide whether missing micronutrients should remain `NULL`, be treated as zero only where USDA semantics support that interpretation, or be supplemented from an approved source.
- [ ] Do not silently replace missing Foundation values with SR Legacy values; that would create a mixed-source nutrient profile.
- [ ] After any approved data correction, rerun the 73-item audit and all affected recipe builds.
