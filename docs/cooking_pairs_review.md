# Cooking Pair Review

Working list of possible raw-to-cooked or uncooked-to-prepared pairs found in `DataCentralCombo`.

## Screening Rules

- Food groups use the USDA code without the leading zero in `DataCentralCombo`: `0600` = `600`, `0700` = `700`, `0800` = `800`.
- Keep actual preparation states found in either `cookMethod` or `Long_Desc`.
- Do not discard a record only because `cookMethod` is `z`, `Home-Prepared`, or another broad status when the description supplies cooking evidence.
- Exclude non-cooking descriptors such as `instant`, `ready-to-serve`, `luncheon`, `spread`, and similar product/serving states unless the description independently documents a cooking transformation.
- This is a review list, not yet a fill-class assignment list.

## Group 0600: Soups, Sauces, and Gravies

These are valid prepared cooking records, but no raw counterparts were found in this food group.

| Prepared record | NDB | cookMethod | Description | Pair status |
|---|---:|---|---|---|
| Beef stock | `6170` | `Home-Prepared` | Soup, stock, beef, home-prepared | Prepared record; no raw counterpart in group |
| Chicken stock | `6172` | `Home-Prepared` | Soup, stock, chicken, home-prepared | Prepared record; no raw counterpart in group |
| Fish stock | `6174` | `Home-Prepared` | Soup, stock, fish, home-prepared | Prepared record; no raw counterpart in group |

## Group 0700: Sausages and Luncheon Meats

### Sausage pairs

| Uncooked/base record | NDB | cookMethod | Cooked record | NDB | cookMethod |
|---|---:|---|---|---:|---|
| Pork sausage, link/patty, unprepared | `7063` | `Unprepared` | Pork sausage, link/patty, cooked, pan-fried | `7064` | `Pan-Fried` |
| USDA Commodity pork sausage, bulk/links/patties, frozen, raw | `7907` | `Raw` | USDA Commodity pork sausage, bulk/links/patties, frozen, cooked | `7901` | `Cooked` |
| Turkey sausage, fresh, raw | `7955` | `Raw` | Turkey sausage, fresh, cooked | `7958` | `Cooked` |
| Pork sausage, link/patty, reduced fat, unprepared | `7965` | `Unprepared` | Pork sausage, link/patty, reduced fat, cooked, pan-fried | `7966` | `Pan-Fried` |

### Frankfurter and related pairs

| Uncooked/base record | NDB | cookMethod | Cooked record | NDB | cookMethod |
|---|---:|---|---|---:|---|
| Frankfurter, meat and poultry, unheated | `7962` | `Unheated` | Frankfurter, meat and poultry, cooked, boiled | `7963` | `Boiled` |
| Frankfurter, meat and poultry, unheated | `7962` | `Unheated` | Frankfurter, meat and poultry, cooked, grilled | `7964` | `Grilled` |
| Frankfurter, beef, unheated | `7022` | `Unheated` | Frankfurter, beef, heated | `7945` | `Heated` |

### Other preparation-related records to review

These records show cooking in the description or method but do not have a clean raw-to-cooked match in the current group:

| NDB | cookMethod | Description |
|---:|---|---|
| `7968` | `Grilled` | Kielbasa, fully cooked, grilled |
| `7969` | `Pan-Fried` | Kielbasa, fully cooked, pan-fried |
| `7973` | `Microwaved` | Turkey bacon, microwaved |
| `7974` | `Unprepared` | Bacon, turkey, low sodium |

### Fill-class review for group 0700

- The pork sausage and turkey bacon cooking behavior is broadly related to the existing `fried_meat` class.
- No `fill_class_hint` values are currently populated for these group `0700` records.
- Frankfurter boiling/grilling is a possible separate modeling category, but no new class is proposed here.

## Group 0800: Cereals and Breakfast Grains

These pairs are based primarily on cooking evidence in `Long_Desc`; several source records have `cookMethod='z'`.

| Dry/base record | NDB | cookMethod | Cooked record | NDB | cookMethod |
|---|---:|---|---|---:|---|
| Cereals, CREAM OF RICE, dry | `8100` | `z` | Cereals, CREAM OF RICE, cooked with water, without salt | `8101` | `z` |
| Cereals, CREAM OF RICE, dry | `8100` | `z` | Cereals, CREAM OF RICE, cooked with water, with salt | `8168` | `Cooked with salt` |
| Cereals, CREAM OF WHEAT, regular, dry | `8102` | `z` | Cereals, CREAM OF WHEAT, regular, 10 minute, cooked with water, without salt | `8103` | `z` |
| Cereals, CREAM OF WHEAT, regular, dry | `8102` | `z` | Cereals, CREAM OF WHEAT, regular, 10 minute, cooked with water, with salt | `8169` | `z` |
| Cereals, CREAM OF WHEAT, 1 minute, dry | `8576` | `z` | Cereals, CREAM OF WHEAT, 1 minute, cooked with water, stove-top | `8577` | `z` |
| Cereals, CREAM OF WHEAT, 1 minute, dry | `8576` | `z` | Cereals, CREAM OF WHEAT, 1 minute, cooked with water, microwaved | `8578` | `z` |
| Cereals, CREAM OF WHEAT, 2 1/2 minute, dry | `8573` | `z` | Cereals, CREAM OF WHEAT, 2 1/2 minute, cooked with water, stove-top | `8574` | `z` |
| Cereals, CREAM OF WHEAT, 2 1/2 minute, dry | `8573` | `z` | Cereals, CREAM OF WHEAT, 2 1/2 minute, cooked with water, microwaved | `8575` | `z` |
| Oats, regular and quick, dry | `8120` | `z` | Oats, regular and quick, cooked with water | `8121` | `Cooked w/o salt` |
| Corn grits, regular and quick, dry | `8090` | `z` | Corn grits, regular and quick, cooked with water, without salt | `8091` | `Cooked w/o salt` |
| Corn grits, regular and quick, dry | `8090` | `z` | Corn grits, regular and quick, cooked with water, without salt | `8164` | `Cooked w/o salt` |
| Corn grits, regular and quick, dry | `8090` | `z` | Corn grits, regular and quick, cooked with water, with salt | `8165` | `Cooked with salt` |

### Group 0800 review notes

- Salted and unsalted cooked records may be alternate targets for the same dry base, not separate cooking methods.
- Stove-top and microwaved Cream of Wheat records are separate cooking-method targets for the same dry product.
- These pairs may be useful for the existing absorption model rather than requiring new fill classes.

## Review Status

- `0600`: 3 prepared stock records; no raw pair found.
- `0700`: 7 strong raw/base-to-cooked pairs; additional fully cooked preparation records retained for review.
- `0800`: 11 dry-to-cooked cereal pairings; several are alternate salt or cooking-method targets.
- `0900`: 27 fruit cooking-state pairings, including fresh, dried, canned, and frozen transformations.
- Next group to inspect: `1000`.

## Group 0900: Fruits and Fruit Juices

### Fresh, canned, and frozen fruit

| Base record | NDB | cookMethod | Prepared record | NDB | cookMethod |
|---|---:|---|---|---:|---|
| Apples, raw, without skin | `9004` | `Raw` | Apples, raw, without skin, cooked, boiled | `9005` | `Boiled` |
| Apples, raw, without skin | `9004` | `Raw` | Apples, raw, without skin, cooked, microwave | `9006` | `Microwaved` |
| Apples, canned, sweetened, sliced, drained | `9007` | `Unheated` | Apples, canned, sweetened, sliced, drained, heated | `9008` | `Heated` |
| Apples, frozen, unsweetened, unheated | `9014` | `Unheated` | Apples, frozen, unsweetened, heated | `9015` | `Heated` |
| Rhubarb, frozen, uncooked | `9309` | `Uncooked` | Rhubarb, frozen, cooked, with sugar | `9310` | `Cooked` |

### Dried fruit, uncooked to stewed

| Base record | NDB | cookMethod | Prepared record | NDB | cookMethod |
|---|---:|---|---|---:|---|
| Apples, dehydrated, sulfured | `9009` | `Uncooked` | Apples, dehydrated, sulfured, stewed | `9010` | `Stewed` |
| Apples, dried, sulfured | `9011` | `Uncooked` | Apples, dried, sulfured, stewed, without added sugar | `9012` | `Stewed` |
| Apples, dried, sulfured | `9011` | `Uncooked` | Apples, dried, sulfured, stewed, with added sugar | `9013` | `Stewed` |
| Apricots, dehydrated, sulfured | `9030` | `Uncooked` | Apricots, dehydrated, sulfured, stewed | `9031` | `Stewed` |
| Apricots, dried, sulfured | `9032` | `Uncooked` | Apricots, dried, sulfured, stewed, without added sugar | `9033` | `Stewed` |
| Apricots, dried, sulfured | `9032` | `Uncooked` | Apricots, dried, sulfured, stewed, with added sugar | `9034` | `Stewed` |
| Figs, dried | `9094` | `Uncooked` | Figs, dried, stewed | `9095` | `Stewed` |
| Peaches, dehydrated, sulfured | `9244` | `Uncooked` | Peaches, dehydrated, sulfured, stewed | `9245` | `Stewed` |
| Peaches, dried, sulfured | `9246` | `Uncooked` | Peaches, dried, sulfured, stewed, without added sugar | `9247` | `Stewed` |
| Peaches, dried, sulfured | `9246` | `Uncooked` | Peaches, dried, sulfured, stewed, with added sugar | `9248` | `Stewed` |
| Pears, dried, sulfured | `9259` | `Uncooked` | Pears, dried, sulfured, stewed, without added sugar | `9260` | `Stewed` |
| Pears, dried, sulfured | `9259` | `Uncooked` | Pears, dried, sulfured, stewed, with added sugar | `9261` | `Stewed` |
| Prunes, dehydrated | `9289` | `Uncooked` | Prunes, dehydrated, stewed | `9290` | `Stewed` |
| Plums, dried (prunes) | `9291` | `Uncooked` | Plums, dried (prunes), stewed, without added sugar | `9292` | `Stewed` |
| Plums, dried (prunes) | `9291` | `Uncooked` | Plums, dried (prunes), stewed, with added sugar | `9293` | `Stewed` |

### Additional prepared fruit record

| NDB | cookMethod | Description | Pair status |
|---:|---|---|---|
| `9143` | `Cooked` | Guava sauce, cooked | Cooked fruit product; no matching raw sauce base identified |
| `9278` | `Cooked` | Plantains, cooked | Cooked plantain record; raw counterpart requires separate description review |

### Group 0900 review notes

- The dried-fruit pairs are cooking/rehydration transformations, not merely serving-state differences.
- Sugar-added and no-sugar stewed records are alternate composition targets for the same cooking step.
- Apples, canned apples, frozen apples, and frozen rhubarb demonstrate distinct preparation paths that should remain separate during review.

## Group 1000: Pork and Pork Products

Group `1000` contains a large number of pork cooking records. The table below keeps the raw-to-cooked families together while retaining the important alternate fat descriptions and cooking methods.

| Raw/base family | Raw NDB(s) | Cooked/prepared NDB(s) and method |
|---|---|---|
| Pork, general | `10006` | `10007` Cooked |
| Pork back ribs | `10192` | `10193` Roasted |
| Pork, composite trimmed retail cuts | `10002` | `10093` Cooked |
| Pork, composite retail cuts, loin/shoulder/blade | `10226`, `10228` | `10229` Cooked |
| Ground pork | `10219` | `10220` Cooked |
| Ground pork, 84% lean / 16% fat | `10972` | `10978` Broiled |
| Ground pork, 96% lean / 4% fat | `10973` | `10979` Broiled |
| Pork leg/ham, rump half | `10012`, `10014` | `10013`, `10015` Roasted |
| Pork leg/ham, shank half | `10016`, `10018` | `10017`, `10019` Roasted |
| Pork leg/ham, whole | `10008`, `10010` | `10009`, `10011` Roasted |
| Pork leg, sirloin tip roast, boneless | `10963` | `10962` Braised |
| Pork loin back ribs, bone-in | `10980` | `10981` Roasted |
| Pork loin, center loin chops, bone-in | `10036`, `10040` | `10037`, `10041` Braised; `10038`, `10042`, `10176`, `10179` Broiled or Pan-Fried |
| Pork loin, center loin chops, boneless | `10094`, `10164` | `10163`, `10189` Broiled |
| Pork loin, country-style ribs | `10207`, `10204` | `10205`, `10208` Braised |
| Pork loin, tenderloin | `10060`, `10218`, `10944`, `10951` | `10061`, `10222`, `10943`, `10952` Roasted; `10221`, `10223` Broiled |
| Pork loin, top loin chops, boneless | `10066`, `10062`, `10948`, `10949` | `10067`, `10063` Braised; `10068`, `10064`, `10858`, `10859`, `10950` Broiled; `10181`, `10186` Pan-Fried |
| Pork loin, top loin roasts, boneless | `10225`, `10224` | `10069`, `10065` Roasted |
| Pork loin, whole | `10024`, `10020` | `10025`, `10021` Braised; `10026`, `10022` Broiled; `10027`, `10023` Roasted |
| Pork shoulder, arm picnic | `10074`, `10077` | `10075`, `10078` Braised; `10076`, `10079`, `10168`, `10169` Roasted |
| Pork shoulder, Boston butt blade steaks | `10080`, `10084`, `10946`, `10953` | `10081`, `10085`, `10945`, `10954` Braised |
| Pork shoulder breast, boneless | `10958` | `10959` Broiled |
| Pork shoulder petite tender, boneless | `10961` | `10960` Broiled |
| Pork shoulder, whole | `10070`, `10072` | `10071`, `10073` Roasted |
| Pork spareribs | `10088` | `10089` Braised; `10940` Roasted |
| Pork brain | `10096` | `10097` Braised |
| Pork chitterlings | `10098` | `10099` Simmered |
| Pork ears | `10100` | `10101` Simmered |
| Pork feet | `10102` | `10173` Simmered |
| Pork heart | `10103` | `10104` Braised |
| Pork kidneys | `10106` | `10107` Braised |
| Pork liver | `10110` | `10111` Braised |
| Pork lungs | `10112` | `10113` Braised |
| Pork pancreas | `10115` | `10116` Braised |
| Pork spleen | `10117` | `10118` Braised |
| Pork stomach | `10119` | `10863` Simmered |
| Pork tail | `10174` | `10175` Simmered |
| Pork tongue | `10121` | `10122` Braised |
| USDA Commodity ground pork, fine/coarse | `10805` | `10803` Cooked |

### Group 1000 review notes

- The cleanest new modeling candidates are `fried_meat`-related ground pork, `baked_pork`-related roasts, `braised_beef`-style braising behavior adapted for pork, and simmered variety meats.
- Cured ham records marked `Unheated`, `Roasted`, or `Pan-Broiled` are preparation variants of an already cured product, not raw-fresh pork cooking pairs; they remain outside the table unless a raw counterpart is explicit.

### Group 1000 fill-class comparison

| Pair area | Existing coverage | Decision |
|---|---|---|
| Ground pork, 84/16 and 96/4, pan-broiled | `pork_ground_patty_medium_fat` and `pork_ground_patty_low_fat` are already activated from cooked NDBs `10978` and `10979`. | Covered for formed patties. Add the cooked-crumble alternatives `10975` and `10976` to the review as distinct forms; do not reuse patty profiles for crumbles. |
| Ground pork, cooked crumbles | `pork_ground_crumbles_high_fat`, `pork_ground_crumbles_medium_fat`, and `pork_ground_crumbles_low_fat` are already activated from NDBs `10974`-`10976`. | Covered. The generic `fried_meat` fallback remains legacy behavior for NDB `10219` → `10220`, where the USDA endpoint is not explicitly labeled patty or crumbles. |
| Cured bacon, microwaved | Exact USDA pair `10123` (raw cured bacon) → `10861` (cooked, microwaved). `bacon_pan_fried` currently uses the separate `10862` pan-fried endpoint. | New `bacon_microwaved` class is justified. Microwave rendering should not inherit the pan-fried yield profile without calibration. |
| Pork shoulder/Boston butt, roasted | `baked_pork` exists, but its comment cites the wrong endpoint (`10082` is broiled, not roasted); current `ENTR_094` still uses a locked `yfw=0.60`. | Gap for an exact USDA-backed roasted-shoulder class. Do not treat the generic class as exact coverage. |
| Pork shoulder/Boston butt, braised | Pair `10080` → `10081` is present, but no exact `pork_shoulder_braised` profile is activated. | New class needed if braised shoulder/carnitas is to be physics-calibrated rather than use the temporary `braised_beef` proxy. |
| Pork chops and tenderloin | Specific activated profiles cover center-loin chops, top-loin chops, blade chops, sirloin chops, and tenderloin roasting/pan-grilling variants, with bone/fat-form distinctions. | Covered for the audited endpoints; future assignments must match cut, bone status, fat form, and operation. |
| Ribs | Back ribs roasted and spareribs roasted have profiles; country-style ribs braised has a profile for NDB `10208`. | Partial. Exact braised spareribs `10088` → `10089`, country-style pair `10204` → `10205`, and other bone-in rib variants need verification before class reuse. |
| Variety meats | Chitterlings, feet, and stomach simmered are activated. | Gaps remain for ears, heart, kidneys, liver, lungs, pancreas, spleen, tail, tongue, and brain if those foods become supported recipe inputs. |

**Conclusion:** We do not need a broad new “pork” class. We need exact operation/form classes only where the existing profile does not match the audited pair: roasted shoulder, braised shoulder, and selected braised ribs/variety meats. Ground pork is already covered by the specific profile families; the remaining work there is documentation and correct form assignment, not new calibration.

## Group 1100: Vegetables and Vegetable Products

Group `1100` is dominated by raw-to-boiled and frozen-to-boiled vegetable transformations, with separate USDA endpoints for baked, steamed, microwaved, sauteed, stir-fried, and fried preparations.

| Pair area | Representative USDA records | Existing fill-class comparison | Decision |
|---|---|---|---|
| Raw or frozen vegetables to boiled/drained | Raw vegetables such as peppers `11821`, spinach `11457`, and white corn `11900` have boiled endpoints including peppers `11823`/`11824` and corn `11901`/`11902`; frozen variants have their own boiled records. | Existing `simmered_vegetable` is a project proxy, not complete coverage of every USDA vegetable/cultivar endpoint. | Retain raw-vs-frozen and salted-vs-unsalted calibration candidates; do not collapse them into one universal vegetable yield. |
| Potatoes, boiled | Raw potato `11352` -> boiled flesh `11833`. | `simmered_vegetable` is used for simmered potato mixtures; `deep_fried_potato` is reserved for fries. | Covered for existing use; no general potato class should replace the operation-specific fry class. |
| Potatoes, baked | Raw potato `11352` -> baked flesh `11829`, with additional flesh/skin endpoints. | `roasted_vegetable` is calibrated for high-heat vegetables, not specifically baked potatoes. | Candidate for a potato-baked profile if baked potato recipes require USDA calibration. |
| Potatoes, microwaved | Raw potato `11352` -> microwaved flesh and skin `11835`; related skin-only and flesh-and-skin endpoints also exist. | No microwave vegetable class is currently present. | Distinct future candidate: `microwaved_potato` or a carefully scoped `microwaved_vegetable`; do not reuse boiled or baked potato yields. |
| Leafy vegetables, steamed | Group `1100` includes steamed sweet-potato leaves and steamed taro leaves, while many common vegetables are only represented as boiled. | No dedicated steamed-vegetable class is currently present. | Candidate only when a steamed recipe needs calibration; do not add it solely because the USDA endpoint exists. |
| Sauteed/stir-fried vegetables | Red peppers include sauteed record `11921`; sprouted soybeans include stir-fried `11924`; other stir-fried recipe inputs use the project's `simmered_vegetable` proxy. | Existing `simmered_vegetable` covers current short stovetop vegetable recipes, but it is not an exact USDA saute/stir-fry profile. | Audit before adding a class. A future `stir_fried_vegetable` class is more useful than separate classes for every vegetable. |
| Fried potatoes and battered vegetables | French-fried/par-fried potato records and fried-battered vegetable recipes are represented separately in USDA. | Existing `deep_fried_potato` and `fried_battered_vegetable` classes already cover these project patterns. | Covered. |

**Conclusion:** Group `1100` should be represented inclusively in the future fill-class plan. Existing project classes cover some boiled/simmered, roasted, casserole, wilted-spinach, deep-fried-potato, and battered-vegetable patterns, but they do not eliminate the need to model the other USDA operations. Preserve separate calibration candidates for microwaved vegetables/potatoes, steamed vegetables, sauteed vegetables, stir-fried vegetables, baked potatoes, boiled vegetables, and product-specific canned or frozen preparations. Each candidate still needs a selected raw-to-prepared pair before implementation.

## Group 1300: Beef and Beef Products

Group `1300` contains distinct raw-to-prepared transformations for ground beef, steaks, roasts, brisket, ribs, organs, and processed beef products. The inventory below is for fill-class creation only; no recipe matching is performed at this stage.

| Pair area | Representative USDA/profile endpoints | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Ground beef, formed patties | Low-, medium-, and high-fat patty profiles use cooked endpoints `23564`, `23574`, and `13496`. | Already represented by yesterday's beef patty fill-class work, with exact profile families `beef_ground_patty_low_fat`, `beef_ground_patty_medium_fat`, and `beef_ground_patty_high_fat`. | Covered. Keep patties separate from crumbles and preserve fat-band distinctions. |
| Ground beef, pan-browned crumbles | Low-, medium-, and high-fat crumble profiles use cooked endpoints `23565`, `23575`, and `13494`. | Already represented by yesterday's beef crumble fill-class work, with exact profile families `beef_ground_crumbles_low_fat`, `beef_ground_crumbles_medium_fat`, and `beef_ground_crumbles_high_fat`; generic `fried_ground_beef` remains available as a fallback. | Covered. Keep crumbles separate from patties and preserve fat-band distinctions. |
| Steaks, grilled or pan-grilled | Exact profiles cover flank, skirt, ribeye, tenderloin, round, strip/top loin, sirloin, shoulder, blade/flat iron, Denver, T-bone, and porterhouse variants. | Exact cut-specific classes exist in the USDA profile catalog. Generic `pan_grilled_steak` is only a fallback proxy. | Retain cut, bone-status, and operation distinctions for later matching. |
| Roasts | Exact profiles cover tri-tip, chuck eye, round tip, bottom round, ribeye, and eye of round roasted endpoints, including bone-in and lean-only variants. | Exact roasted profiles exist, but no broad generic `roasted_beef` binding is present. | Preserve roast-cut and bone/form candidates; do not collapse all roasted beef into one coefficient. |
| Braised beef, pot roast, brisket, and ribs | Profiles cover mock tender, underblade steak/pot roast, shoulder pot roast, pot roast, short ribs, and multiple brisket flat/point/lean-and-fat variants. | Generic `braised_beef` exists, alongside exact brisket profile classes. | Preserve exact braised cut/form candidates; generic `braised_beef` remains a proxy, not universal coverage. |
| Simmered or stewed beef | Brisket and beef variety-meat records include cooking-liquid preparations; the catalog includes `sub_simmered_beef` for a liquid-excluded serving model. | `sub_simmered_beef` exists; `braised_beef` is used for some longer covered cooks. | Keep simmered-in-liquid separate from dry roasting and covered braising. |
| Beef organs and variety meats | Exact profiles exist for brain, heart, kidneys, liver (braised and pan-grilled), and tripe stewed. | Dedicated profiles exist for these endpoints; no single generic organ-meat class is present. | Retain organ-specific and operation-specific candidates. |
| Breaded/fried, boiled, baked, and broiled beef products | Group records include additional preparation states beyond the currently catalogued steak, roast, braise, and ground-beef families. | No complete beef-specific profile set is currently exposed for every such operation. | Preserve each materially different USDA operation for later pair selection and calibration. |

### Group 1300 fill-class comparison

- The catalog and yesterday's fill-class work already provide strong exact coverage for ground beef patties and crumbles, many steak cuts, several roast cuts, braised cuts, brisket, and selected organs.
- The generic bindings `fried_ground_beef`, `pan_grilled_steak`, `braised_beef`, and `sub_simmered_beef` should be treated as broad proxies until exact profile selection is completed.
- Exact profile matching requires both the fill-class name and the source NDB to match; a generic class does not automatically activate a cut-specific USDA profile.
- The inclusive future inventory should retain operation candidates for grilled, pan-grilled, roasted, braised, simmered/stewed, broiled, fried/breaded, boiled, and baked beef, with cut, fat band, bone status, and organ type preserved where USDA data distinguishes them.

**Conclusion:** Group `1300` has a substantial exact USDA profile catalog, but the catalog and generic bindings are not the same layer. Complete the fill-class inventory and calibration first. Match those classes to recipes only after the full class set has been created; no current or known recipe set should determine which beef transformations are retained.

## Group 1200: Nuts and Seeds

Group `1200` is primarily raw-to-roasted nut and seed data. USDA distinguishes dry roasting from oil roasting, and also includes a smaller set of boiled/steamed chestnut and seed records.

| Pair area | Representative USDA records | Existing fill-class comparison | Decision |
|---|---|---|---|
| Almonds | Raw `12061` -> blanched `12062`, dry-roasted `12063`, and separate salted/oil-roasted records such as `12563` and `12567`. | No nut/seed USDA profile or dedicated nut fill class is currently present. | Keep blanching separate from roasting; add classes only if these operations are used in a recipe requiring cooked-weight calibration. |
| Cashews | Raw `12087` -> dry-roasted `12085`/`12585` or oil-roasted `12086`/`12586`, with salt variants. | No exact profile. | Candidate classes: `dry_roasted_nut` and `oil_roasted_nut`; do not combine them because added oil changes fat and final mass differently. |
| Seeds | Pumpkin/squash kernels have roasted endpoints `12016`, `12163`, and `12516`; sunflower kernels have dry-roasted `12037`/`12537` and oil-roasted `12038`; sesame has roasted/toasted `12024`. | Existing recipes use nuts and seeds mostly as raw ingredients; no seed roasting class exists. | Candidate for a scoped `dry_roasted_seed` class if roasted seeds become a cooked recipe section. Sesame roasting/toasting should be checked separately because the endpoint combines operations. |
| Chestnuts and breadfruit seeds | Chestnut raw records -> boiled/steamed `12095`/`12101` and roasted `12096`/`12167`; breadfruit seeds include raw `12001` -> boiled `12003` and roasted `12158`. | No boiled/steamed nut or seed class exists. | Candidate `boiled_chestnut` or broader `boiled_seed`; select by species and operation rather than treating these as ordinary roasted nuts. |
| Mixed and honey-roasted nuts | Mixed-nut dry/oil-roasted records and honey-roasted almonds `12206` are prepared products with composition changes beyond simple heat loss. | No matching class. | Treat as product-specific targets, not generic roasting calibration. |

**Conclusion:** Group `1200` should be represented inclusively in the future fill-class plan. Preserve distinct calibration candidates for `dry_roasted_nut`, `oil_roasted_nut`, blanched nuts, toasted seeds/coconut, boiled/steamed chestnuts or seeds, honey-roasted nuts, and mixed-nut products. Dry roasting and oil roasting must remain separate because their fat and final-mass behavior differs. These candidates can be implemented in priority order, but none should be discarded merely because the current recipe set does not use it.

## Group 1500: Finfish and Shellfish

Group `1500` contains raw fish and shellfish records plus distinct dry-heat, moist-heat, fried, breaded-fried, steamed, smoked, kippered, pickled, dried/salted, and prepared-frozen states. Species, wild/farmed status, and previously frozen status are also part of the USDA distinctions.

| Preparation area | Representative USDA endpoints | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Fish, dry heat | Cooked dry-heat records include cod `15016`, salmon `15086`, snapper `15102`, tuna yellowfin `15221`, tilapia `15262`, and many other species-specific endpoints. | No general seafood dry-heat class or exact seafood USDA profile catalog exists. | Preserve species and operation candidates; do not use a chicken or generic steak profile as a seafood substitute. |
| Fish and shellfish, moist heat | Moist-heat records include salmon `15082`, crab `15137`/`15140`, shrimp `15151`, lobster `15148`, clams `15159`, mussels `15165`, oysters `15169`, and other mollusks. | `fish_stock` exists only for stock extraction; it is not a seafood-piece cooking class. | Retain moist-heat candidates by broad seafood type and species where USDA data distinguishes them. |
| Fish, steamed | Group `1500` includes steamed seafood endpoints in addition to the larger dry-heat and moist-heat families. | No steamed seafood class exists. | Preserve steaming as a distinct future operation; do not merge it with moist heat without pair analysis. |
| Breaded and fried seafood | Fish sticks `15027`, breaded/fried seafood records, and fried abalone/squid endpoints `15156`/`15176` occur in the group. | Existing `fried_breaded_shrimp` and `fried_breaded_fish_fillet` cover specific dry-breaded/cornmeal patterns, not every wet batter, fish form, or mollusk. | Retain separate dry-breaded, wet-battered, shrimp, fish fillet, shellfish, and formed-product candidates. |
| Fried seafood without breading | Fried abalone `15156` and squid `15176` are distinct from breaded fish/shrimp. | No unbreaded fried seafood class exists. | Preserve an unbreaded-fried seafood candidate; do not reuse breaded profiles. |
| Smoked, kippered, pickled, and dried/salted fish | Atlantic herring includes kippered `15042`, pickled `15041`, and cod dried/salted `15018`; additional smoked records are present. | No preservation-process fill classes exist. | Retain these as preparation/product-state candidates, separate from heat-cooked seafood. |
| Raw, previously frozen, wild/farmed, and prepared frozen products | USDA descriptions distinguish raw versus previously frozen fish, wild versus farmed species, and prepared frozen products such as fish sticks. | No universal frozen or seafood form class exists. | Preserve these distinctions for later exact pair selection and calibration. |

### Group 1500 fill-class comparison

- Existing dedicated coverage is limited to `fried_breaded_shrimp`, `fried_breaded_fish_fillet`, and `fish_stock`.
- There is no exact USDA seafood profile catalog comparable to the beef catalog; most seafood operation endpoints therefore remain unrepresented by an ingredient-specific profile.
- Dry heat and moist heat must remain separate, and steamed seafood should remain separate until pair analysis demonstrates equivalence.
- Breaded/fried seafood must remain distinct from wet batter, unbreaded frying, and formed frozen products.
- Species, wild/farmed status, raw/frozen state, and shellfish type should be retained as candidate dimensions where they affect moisture, fat, or final mass.
- Recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Group `1500` has broad seafood operation coverage in USDA but limited fill-class representation in the project. Preserve all major cooking and preservation transformations as future candidates, with the existing shrimp/fish breading classes treated as scoped coverage rather than universal seafood defaults.

## Group 1600: Legumes and Legume Products

Group `1600` contains dry-legume hydration endpoints and a wide range of prepared legume products. USDA distinguishes boiled legumes with and without salt, canned and drained forms, baked and stewed products, roasted or fried products, spreads, fermented/processed soy foods, and formed meatless products.

| Preparation area | Representative USDA endpoints | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Dry legumes, boiled | Unsalted cooked endpoints include beans `16015`, chickpeas `16057`, lentils `16070`, split peas `16086`, and soybeans `16109`; salted counterparts are also present in the `163xx` series. | The absorption model supports numeric `bin` factors for dry legumes, but no legume-specific operation/profile catalog covers every species and salt state. | Preserve dry-to-boiled hydration, species, and salted/unsalted variants; do not reduce all legumes to one universal yield. |
| Canned, drained, rinsed, and solids/liquids forms | Group records include canned beans, chickpeas, low-sodium products, drained solids, and rinsed drained solids such as `16335`, `16345`, `16358`, and `16359`. | These are product-state and liquid-separation distinctions, not ordinary cooking classes. | Retain canned-with-liquid, drained, and rinsed states separately because the finished water and sodium composition differ. |
| Baked, stewed, and refried beans | Baked beans include `16005`/`16006`; stewed bean liquid includes `43125`; canned refried products include `16103`, `16171`, `16172`, and `16403`. | No dedicated baked-bean, stewed-bean-liquid, or refried-bean fill class exists. | Preserve baked, stewed-liquid, and refried candidates; refrying is not interchangeable with boiling because fat and solids concentration change. |
| Peanuts and other legume seeds, roasted | Peanuts have dry-roasted `16390`/`16090` and oil-roasted salted/unsalted families such as `16089` and `16389`. | No legume/nut roasting class or exact profile is currently present. | Keep dry roasting separate from oil roasting and preserve salt variants as product-state dimensions. |
| Fried tofu and formed soy products | Fried tofu endpoints include `16129` and `16429`; meatless breaded chicken and luncheon slices include `43410` and `43131`; veggie burgers are represented by unprepared `16147`. | No tofu-frying, formed-soy, or prepared meatless-product class exists. | Retain tofu frying, breaded formed products, luncheon slices, and unprepared formed products as separate candidates. |
| Hummus, falafel, spreads, and specialty products | Home-prepared hummus `16137`, falafel `16138`, meatless sandwich spread `43135`, tempeh `16174`, soybean curd cheese `43299`, and yokan `16004` represent distinct processing states. | No class captures grinding/processing, frying falafel, fermentation, curd formation, or sweet bean preparation. | Preserve these as product-specific preparation candidates; do not force them into boiled-legume or generic raw-food classes. |
| Roasted soybeans and soy flour | Roasted soybeans include `16110` and `16410`; roasted full-fat soy flour is `16116`. | No soy roasting or flour-processing profile exists. | Retain roasted whole soybean and roasted flour states separately because milling changes the product form and composition behavior. |

### Group 1600 fill-class comparison

- Existing numeric absorption factors provide important dry-legume-to-cooked hydration coverage, but they do not replace operation-specific classes or exact profiles for each legume family.
- Boiled legumes should remain distinct from canned, drained, rinsed, baked, stewed, and refried products; their water and solids handling are materially different.
- Dry-roasted and oil-roasted peanuts should remain separate, consistent with the nut and seed inventory in group `1200`.
- Tofu, hummus, falafel, tempeh, soybean curd, bean spreads, and formed meatless products represent processing/formulation families rather than one generic legume cook.
- Salted versus unsalted endpoints should be preserved when the salt is part of the USDA product state; sodium handling is not a yield-factor substitute.
- Recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Group `1600` has strong USDA coverage for boiled-legume hydration but broad unrepresented product and operation families. Preserve boiled, canned/drained, baked, stewed, refried, roasted, fried, ground/spread, fermented, curdled, and formed-soy transformations as inclusive future candidates without assigning them to recipes yet.

## Group 1700: Lamb, Veal, and Game

Group `1700` contains raw-to-prepared records for lamb, veal, and game meats. USDA distinguishes braised, roasted, broiled, grilled, pan-fried, fast-fried, stewed, and steamed endpoints, along with cut, bone status, separable lean versus lean-and-fat, species, origin, and fresh/frozen state.

| Preparation area | Representative USDA endpoints | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Lamb roasting and broiling | Lamb loin, rib, shoulder, leg, and chop records occur across broiled endpoints such as `17024`, `17030`, `17037`, and `17303`, plus many roasted and fast-roasted records. | Exact profiles already cover selected lamb broiled, grilled, roasted, and fast-roasted cuts, including loin, leg, shoulder, rack, and chops. No single generic lamb binding replaces those exact pairs. | Mark broiled, grilled, roasted, and fast-roasted lamb as substantially covered, while retaining uncovered cut, trim, and origin variants. |
| Lamb braising and stewing | Braised lamb includes foreshank `17008`, shoulder `17036`, cubed stew meat `17060`, imported/frozen cuts, and variety meats; stewed lamb endpoints are also present. | Exact profiles cover lamb foreshank, shoulder, and stew cubes for braising. Generic `braised_beef` remains a fallback only, not a lamb profile. | Mark core lamb braising as covered and retain additional stew, variety-meat, cut, fat band, bone status, and origin variants. |
| Veal roasting, braising, and frying | Veal leg, loin, rib, shoulder, sirloin, breast, shank, and osso buco records include braised endpoints such as `17095` and `17429`, with roasted, broiled, and breaded pan-fried variants. | Exact profiles cover veal top round braised/roasted/breaded-pan-fried/unbreaded-pan-fried, loin braised/roasted/grilled, rib braised/roasted, sirloin braised/roasted, breast and hindshank braised, and related ground/liver endpoints. | Mark these exact veal operation families as covered where the source NDB matches; retain the remaining cuts and forms as candidates. |
| Game meats | Bison and deer braised records include `17333` and `17346`; the group also contains game species with roasted, grilled, and fried endpoints. | Exact profiles cover roasted antelope, beaver, beefalo, bison, boar, buffalo, caribou, deer, elk, horse, moose, muskrat, squirrel, and domesticated rabbit, plus stewed bear and rabbit. No generic game binding covers the full group. | Mark those exact species/operations as covered and retain braised, grilled, fried, and uncovered species/form variants. |
| Ground lamb and veal | Ground lamb `17225` and ground veal `17143` have broiled endpoints; ground lamb also appears in braised records such as `17370`. | Exact veal ground broiled and pan-fried profiles exist. No equivalent exact ground-lamb profile is listed, and `fried_ground_beef` is explicitly beef-specific. | Mark ground veal broiling/pan-frying as covered; retain ground-lamb braised/broiled and other uncovered ground-meat pairs separately. |
| Pan-fried and breaded meats | Group records include pan-fried, fast-fried, and pan-fried-breaded lamb/veal endpoints, including veal cutlet-style records. | Exact profiles cover veal top-round breaded and unbreaded pan-frying and several lamb fast-fried endpoints. Generic fried classes remain non-specific fallbacks. | Mark those exact pairs as covered; retain unbreaded, breaded, and fast-frying candidates for other cuts and species. |
| Variety meats | Lamb and veal brain, heart, kidneys, liver, lungs, pancreas, spleen, thymus, tongue, and tripe appear in braised or other cooked states. | Exact profiles cover veal liver braised and pan-grilled; most lamb/veal organ endpoints remain without exact profiles. | Mark veal liver coverage and retain every other organ and operation as separate future dimensions. |
| Trim, origin, and state | Records distinguish separable lean versus lean-and-fat, 1/8-inch versus 1/4-inch trim, domestic versus Australian/New Zealand/imported, and fresh versus frozen. | Generic fill classes cannot encode all of these composition and yield differences. | Retain these USDA dimensions for later exact profile selection rather than treating them as metadata noise. |

### Group 1700 fill-class comparison

- Existing exact profiles already cover substantial lamb operations: braised foreshank/shoulder/stew cubes, roasted and broiled cuts, grilled chops, fast-roasted racks, and fast-fried chops.
- Existing exact profiles also cover substantial veal operations: top-round braised/roasted/breaded-pan-fried/unbreaded-pan-fried, loin braised/roasted/grilled, rib and sirloin braised/roasted, breast/hindshank braised, ground broiled/pan-fried, and liver braised/pan-grilled.
- Game exact profiles cover many species-specific roasted endpoints and stewed bear/rabbit, but no universal game coefficient should replace those pairs; braised, grilled, and fried game remain additional candidates.
- Ground lamb and ground veal must remain separate from whole-muscle meat and from the existing beef ground-meat classes; only ground veal currently has exact profiles here.
- Lean-only versus lean-and-fat endpoints, bone status, trim level, origin, and frozen state should remain candidate dimensions when USDA provides paired records.
- Recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Yesterday's fill-class/profile work already covers most of the major group `1700` lamb and veal operation families, plus many species-specific game roasts and some stews. The remaining inventory must preserve uncovered cuts, species, organs, ground lamb, game braising/grilling/frying, trim, bone, origin, and frozen-state distinctions. Generic bindings remain fallbacks; exact profile matching still requires both the class and source NDB.

## Group 1800: Grain Products and Baked Goods

Group `1800` is the grain-products and baked-goods group. Most records are prepared products whose operation is encoded in `Long_Desc`; explicit states include baked, ready-to-heat, ready-to-bake, no-bake, unbaked, fried, grated, toasted, and stovetop.

| Preparation area | Representative USDA endpoints | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Baked breads and grain products | Baked endpoints include frozen biscuits `18009`, baked pie crusts `18333`, `18336`, `18946`, and `18947`, cinnamon rolls `18358`, and baked taco shells `18360`/`18448`. | Existing `biscuit`, `pastry`, `crumb_crust`, `cake_batter`, and `wellington_pastry` bindings cover selected structures, not all grain products. | Preserve biscuit, yeast/sweet-roll, bread, pastry crust, shell/taco, and other baked-product families separately. |
| Unbaked and ready-to-bake doughs | Unbaked pie crusts include `18402`, `18945`, and `18948`; ready-to-bake puff pastry and pie crusts include `18211`, `18334`, `18335`, `18337`, and `18446`. | `pastry` exists for blind-baked crust physics, but no complete raw-dough-to-baked-product profile catalog exists. | Keep unbaked, ready-to-bake, blind-baked, and fully baked pastry states distinct. |
| Fried grain products | Fried fruit pies include `18319`, `18444`, and `18445`. | No dedicated fried-pie or fried-dough class exists; generic fried classes are protein or vegetable specific. | Preserve fried pastry/dough as a separate candidate from baked pastry and breaded protein frying. |
| Toasted and reheated products | Toasted toaster pastries include `18939`; ready-to-heat pancakes, waffles, and French toast include `18268`, `18288`, `18365`, `18932`, `18934`, `18935`, and `18936`. | Batter and griddle classes model preparation from raw batter, not reheating a previously cooked frozen product. | Retain toast, microwave/reheat, and frozen ready-to-heat states as product-state candidates. |
| No-bake and chilled prepared products | No-bake cheesecake `18148`, banana cream pie `18303`, chocolate mousse pie `18312`, and coconut cream pie `18314` are prepared without a bake step. | `none` can represent no evaporation, but does not model setting, chilling, or formulation changes. | Preserve no-bake/chilled setting as a distinct preparation-state family. |
| Grated and crumb products | Dry plain and seasoned grated breadcrumbs are `18079` and `18376`. | `crumb_crust` models a baked crumb crust, not grinding or seasoning a dry bread product. | Keep grated/crumb processing separate from crumb-crust baking. |
| Stovetop prepared grain products | Stove Top stuffing mix `18567` is a prepared dry mix requiring stovetop hydration. | No stuffing/hydrated-bread class exists; `none` would not express water uptake and product setting. | Preserve stuffing hydration and stovetop preparation separately from boiled grains and baked dressing. |
| Commercial frozen and specialty products | Frozen paratha `28286`, frozen garlic bread `18963`, and frozen chapati/roti `28285` occur with prepared or unspecified cook methods. | No universal frozen-product or commercial reheat class exists. | Retain product form, frozen state, and preparation instruction as separate dimensions. |

### Group 1800 fill-class comparison

- Relevant existing bindings include `biscuit`, `pastry`, `crumb_crust`, `cake_batter`, `pan_grilled_batter`, `pan_grilled_masa`, and `wellington_pastry`; these are structural classes, not universal grain-product defaults.
- The exact USDA profile catalog has no dedicated group `1800` family comparable to the meat profiles.
- Baked products, fried pastries, toasted/reheated products, no-bake set products, grated crumbs, and stovetop hydrated stuffing should remain separate because they change water, fat, structure, or product state differently.
- Ready-to-heat products must not be modeled like raw batter: the USDA endpoint already represents a cooked/frozen product and the final microwave or toast step may add little or no bulk moisture loss.
- Pastry crust, crumb-crust, and batter physics should remain separate; `none` is insufficient for baked goods that undergo structural setting.
- Recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Group `1800` is partly represented by structural baked-good bindings, but its USDA coverage is much broader. Preserve baked bread and pastry, fried pastry, toasted/reheated frozen products, no-bake set products, grated crumbs, and stovetop hydrated stuffing as separate future families before matching them to recipes.

## Group 1900: Sweets and Desserts

Group `1900` is primarily a finished-sweets and dessert-formulation group rather than a conventional raw-to-cooked ingredient group. Of the 362 records, 313 have no explicit preparation method; the labeled records include instant mixes, ready-to-eat puddings and frostings, and a small number of other prepared states.

| Preparation area | Representative USDA records | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Candy and confectionery | Chocolate bars, caramels, fudge, brittle, fondant, marshmallows, gumdrops, hard candy, pralines, and truffles include `19074`, `19100`-`19104`, `19107`, `19116`, `19138`, `19148`, and `19216`. | No confectionery cooking, concentration, crystallization, or aeration class exists. | Preserve chocolate, caramel/toffee, fudge, brittle, fondant, aerated candy, and fruit-gel confectionery as distinct formulation families. |
| Syrups, toppings, and spreads | Fruit syrups and toppings include `19018`, `19030`, `19137`, and `19113`; chocolate and nut spreads include `19125` and `19029`. | `syrup_custard` models a baked corn-syrup/egg matrix, not a free syrup or confectionery coating. | Keep syrup reduction, fruit topping, chocolate coating, and nut/spread products separate from custards. |
| Ice cream, sherbet, and frozen desserts | Vanilla and chocolate ice creams, soft-serve, sherbet, frozen yogurt, and frozen novelties include `19088`-`19097`, `19217`, `19280`-`19293`, and `42185`-`43514`. | No freezing, churning, overrun, or frozen-novelty class exists. | Preserve frozen dessert base, churning/aeration, soft-serve, sherbet/ice, and coated novelty states separately. |
| Dry mixes and reconstituted desserts | Instant or dry pudding, custard, gelatin, and cocoa records include `19169`-`19176`, `19187`-`19214`, and `44061`/`44260`. | Existing custard classes model heat-set matrices; `none` does not distinguish dry mix from prepared product. | Keep dry mix, instant reconstitution, water-prepared gelatin, milk-prepared pudding, and heat-set custard as separate states. |
| Ready-to-eat puddings and frostings | Ready-to-eat chocolate, rice, vanilla, and tapioca puddings plus frostings include `19183`, `19193`, `19201`, `19218`, and `19226`-`19235`. | `dairy_custard` and `starch_custard` are structural baked or cooked matrices, not universal packaged dessert profiles. | Preserve ready-to-eat pudding, rice/tapioca suspension, frosting, and reduced-calorie formulation variants. |
| Baked custards and fruit desserts | Baked egg custard `19168`, flan `19094`, apple crisp `19186`, and mousse `19182` are prepared-from-recipe endpoints. | Existing `syrup_custard`, `dairy_custard`, `starch_custard`, and `dense_fruit` cover selected structures. | Retain baked custard, caramel flan, fruit crisp, mousse, and other dessert matrices as separate candidates where operation or water state differs. |
| No-bake and chilled set desserts | Prepared mousse, pudding, gelatin, and frozen products include no explicit heat method and may set by chilling, hydration, or freezing. | `none` represents no modeled heat loss but does not represent gelatin setting, chilling, or freezing. | Preserve no-bake set, chilled suspension, gelatin, and frozen states rather than treating them as raw assembly equivalents. |
| Product and formulation variants | Records distinguish regular versus reduced-calorie, milk type, fat-free, sugar-free, coated, nut-containing, and prepared-from-recipe forms. | Generic bindings cannot encode these formulation and overrun differences. | Retain formulation, dairy base, sweetener, coating, inclusions, and serving-state dimensions for later exact matching. |

### Group 1900 fill-class comparison

- Existing `dense_fruit`, `syrup_custard`, `vegetable_custard`, `dairy_custard`, `starch_custard`, `cake_batter`, `pastry`, `crumb_crust`, and `none` bindings cover selected dessert structures, not the full group.
- No dedicated exact USDA group `1900` profile family comparable to the meat profiles was found.
- Candy concentration/crystallization, chocolate tempering or coating, frozen-dessert churning and overrun, instant reconstitution, gelatin hydration, pudding thickening, frosting formulation, and baked custard are materially different transformations and must remain separate candidates.
- Ready-to-eat, dry-mix, prepared-from-recipe, frozen, and reduced-calorie records are product-state or formulation distinctions; they should not be collapsed into an ordinary heat-loss coefficient.
- `none` may describe an unheated assembly, but it does not by itself model setting, chilling, freezing, aeration, or concentration.
- Recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Group `1900` contributes a broad inventory of confectionery, syrup, frozen-dessert, dry-mix, ready-to-eat, chilled-set, and baked-dessert states. Existing dessert bindings are useful structural anchors, but they are not universal equivalents; preserve the distinct transformations before any recipe matching or implementation.

## Group 2000: Cereal Grains and Grain Products

Group `2000` is a compact grain and cereal group centered on dry-to-cooked hydration. The USDA records include 37 cooked endpoints, six cooked-with-salt endpoints, four cooked-without-salt endpoints, plus parboiled, instant, steamed, roasted, and dry-roasted states.

| Preparation area | Representative USDA endpoints | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Cooked rice and other grains | Cooked, salted, and unsalted records cover rice, barley, oats, and other grain products across the group. | No universal grain-hydration class exists; the project has NDB-specific absorption factors for selected rice, pasta, couscous, barley, and oats. | Preserve grain type, dry form, cooking liquid, salt state, and cooked endpoint as separate dimensions. |
| Parboiled and partially cooked grains | Parboiled endpoints are explicitly present in group `2000`, separate from ordinary cooked grains. | `parboiled_long_grain_rice` exists as a narrow exact structural class, not a general parboil default. | Keep parboiling, draining, and final cooking or braising as a separate multi-stage family. |
| Instant and quick-cooking grains | Instant endpoints are distinct from ordinary cooked products and may involve precooking, drying, flaking, or rapid rehydration. | No general instant-grain reconstitution class exists. | Preserve instant, quick-cooking, and conventionally hydrated products separately; do not infer the same water uptake or solids retention. |
| Steamed grains | A steamed endpoint occurs separately from boiled or cooked records. | No dedicated steaming grain class exists. | Retain steaming as a distinct operation where the endpoint or water contact differs from immersion cooking. |
| Roasted and dry-roasted grains | Roasted and dry-roasted endpoints are distinct low-moisture states. | No grain-roasting or dry-roasting class exists. | Preserve dry-roast and roast transformations separately from hydration-based cooking. |
| Salted versus unsalted preparation | USDA distinguishes cooked with salt from cooked without salt. | Generic yield factors do not encode salt addition, sodium uptake, or cooking-liquid composition. | Retain salt state as a composition and endpoint dimension, even where bulk yield is otherwise similar. |
| Dry grain ingredients and flour-like products | Uncooked, raw, and unspecified records coexist with prepared grain endpoints. | Absorption factors apply only to configured NDBs; ordinary `none` does not model water uptake. | Keep dry ingredient, milled product, parboiled product, and cooked grain states distinct. |

### Group 2000 fill-class comparison

- Existing NDB-specific absorption factors are the closest coverage for dry-to-cooked grains, but they are not a universal coefficient: rice varieties, barley, oats, couscous, pasta, and other starches have different cooked-water fractions.
- `parboiled_long_grain_rice` covers one narrow partial-cook pathway and should not replace ordinary boiled-rice or other parboiled-grain families.
- Boiled or steamed hydration, instant reconstitution, parboiling with draining, roasting, and dry-roasting materially differ in water uptake, solids retention, and final composition.
- Salted and unsalted cooked endpoints should remain paired where USDA provides both; salt changes mineral composition even when the mass yield is otherwise similar.
- No dedicated exact group `2000` profile catalog comparable to the meat profiles was found; exact matching still requires the source NDB and preparation state.
- Recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Group `2000` confirms that grain hydration cannot be represented by one generic cooked-grain class. Preserve NDB-specific absorption, parboiling, instant reconstitution, steaming, roasting, dry-roasting, and salt-state distinctions before matching these families to recipes.

## Group 3500: American Indian and Alaska Native Foods

Group `3500` is a culturally specific, heterogeneous food group rather than a single ingredient class. It contains Alaska Native, Navajo, Apache, Northern Plains, Southwest, Klamath, and Hopi foods, with preparation states ranging from raw and dried ingredients to smoked, fermented, boiled, steamed, roasted, broiled, braised, and prepared traditional dishes.

| Preparation area | Representative USDA records | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Raw, dried, and partially dried marine and game foods | Raw or dried caribou, seal, walrus, whale, fish, smelt, and steelhead records include `35009`, `35011`, `35042`, `35055`, `35056`, `35060`, `35160`, `35161`, `35165`, `35171`, `35180`, and `35184`. | Existing meat and seafood classes are based on different species and source NDBs; drying is not represented by ordinary roasting or frying. | Preserve raw, air-dried, half-dried, partially dried, and dried-in-oil states as separate dehydration and preservation families. |
| Smoked, kippered, fermented, and canned fish | Smoked salmon `35066`, `35067`, `35166`, and `35190`; fermented salmon `35064`; kippered/canned salmon `35065`, `35167`, and `35168`; canned smoked or boiled fish include `35066` and `35157`. | No dedicated smoking, kippering, fermentation, or canning class exists. | Retain smoking, brining, kippering, fermentation, canning, and bone-removal states separately from cooked fish. |
| Boiled, steamed, roasted, and braised animal foods | Moose liver `35051` is braised; steelhead `35181` is boiled; Navajo mutton `35141` is roasted; halibut `35188` and elk `35172`/`35176`/`35178` are cooked. | Existing exact profiles cover selected generic game roasts and some organ/meat operations, but not these culturally specific source NDBs. | Keep species, cut, organ, bone/skin, and operation distinctions; do not substitute a generic game or fish coefficient. |
| Indigenous plants, berries, roots, and tubers | Raw berries, wild leaves, mashu roots, prairie turnips, agave, cattail shoots, prickly pears, and wocas include `35015`, `35027`, `35038`, `35050`, `35192`, `35195`, `35196`, `35200`, `35202`, `35205`, `35232`, and `35235`. | Existing vegetable, fruit, leafy-green, and starch classes cover unrelated species and do not model blanching, boiling, drying, or traditional processing. | Preserve species and state-specific families for raw, blanched, boiled, broiled, dried, and cooked plant foods. |
| Corn and masa processing | Blue, white, and yellow cornmeal, dried corn, ash-treated blue-corn mush, steamed corn, piki bread, tortillas, tamales, frybread, and related products include `35130`-`35137`, `35142`, `35143`, `35147`, `35148`, `35234`, `35237`, `35239`, and `35240`. | `pan_grilled_masa` and grain absorption are structural anchors, not universal equivalents for ash-treated nixtamal-like products, steamed masa, tortillas, tamales, or fried breads. | Retain dry corn, ash-treated meal, masa, steamed masa, griddled tortilla, fried bread, tamale, and baked/flatbread families separately. |
| Traditional mixed dishes | Agutuk/fish or meat “Alaskan ice cream” `35001`, `35003`, and `35225`; caribou and moose stews `35024` and `35048`; Navajo dumpling, hominy, and mutton stews `35144`-`35146`; Apache acorn stew `35182`; Hopi bean-hominy stew `35236`; tamales `35147`/`35237`. | No existing composite fill class models the ingredient-specific preservation, hydration, rendering, and assembly stages in these dishes. | Preserve each dish as a composite preparation candidate with separate component operations; do not reduce it to the dominant ingredient's class. |
| Fats, oils, and preserved mixtures | Beluga, seal, walrus, and bowhead oils include `35014`, `35057`, `35084`, and `35087`; muktuk and meat-with-fat products include `35082`, `35085`, and `35086`; willow leaves in oil are `35092`. | No dedicated rendering, preserved-fat, oil-packing, or fat-infusion class exists. | Retain rendered oil, raw subcutaneous fat, skin-and-fat, oil-packed, and infused plant states separately. |
| Regional and species metadata | Records identify Alaska Native, Navajo, Apache, Northern Plains, Southwest, Klamath, Hopi, and Shoshone Bannock foods, often with species, cut, skin, bone, or fat distinctions. | Generic bindings cannot encode these source-food and cultural preparation dimensions. | Treat provenance, species, cut, and traditional preparation as meaningful profile dimensions, not noise. |

### Group 3500 fill-class comparison

- Group `3500` has no single useful generic coefficient. Its records span preservation, hydration, heat treatment, rendering, fermentation, and composite dish assembly.
- Existing game, seafood, vegetable, leafy-green, grain, masa, and stew bindings can provide structural starting points, but exact profile matching requires the group-specific source NDB and preparation state.
- Drying, smoking, kippering, fermentation, and canning must remain distinct from boiling, steaming, roasting, broiling, and braising because they alter water, salt, fat, and preservation state differently.
- Traditional corn and masa products require separate dry-meal, ash-treated, steamed, griddled, fried, tortilla, tamale, and bread candidates; `pan_grilled_masa` is not a universal replacement.
- Mixed dishes such as stews, tamales, and agutuk should remain composite candidates with component operations rather than being assigned to a single meat, fish, grain, or fat class.
- No dedicated exact USDA group `3500` profile catalog comparable to the meat profiles was found; recipe matching and implementation remain deferred until the complete fill-class and profile inventory is created.

**Conclusion:** Group `3500` is an inventory of culturally specific ingredients and traditional preparation states, not one cooking family. Preserve drying, smoking, fermentation, canning, rendering, corn/masa processing, plant preparation, species-specific cooking, and composite dishes as separate future classes before any recipe matching.

## Group 1400: Beverages

Group `1400` is primarily a prepared-beverage and beverage-mix group rather than a conventional raw-to-cooked ingredient group. Most records use `cookMethod='z'`, null, or `Instant`; the preparation evidence is in `Long_Desc`.

| Preparation area | Representative USDA records | Existing fill-class comparison | Inventory decision |
|---|---|---|---|
| Brewed coffee and espresso | Brewed coffee records include `14180`, `14201`, `14209`, and espresso records `14202`/`14210`. | No beverage extraction or brewing fill class exists. | Retain brewed coffee and espresso as preparation-state candidates; do not treat them as ordinary raw-to-cooked yield classes. |
| Brewed tea and herbal infusions | Brewed oolong `14185`, green tea `14260`/`14278`, black tea `14352`/`14355`, and herbal tea `14381`/`14545`/`14649`. | No tea-infusion fill class exists. | Preserve brewed tea, herbal infusion, water type, and caffeine/form distinctions where USDA separates them. |
| Instant powders prepared with water | Coffee, tea, cocoa, lemonade, and drink powders include prepared records such as `14215`, `14219`, `14367`, `14371`, `14288`, and `14390`. | No instant-reconstitution fill class exists. | Treat powder and prepared beverage as distinct ingredient states; model dilution through the ingredient/water composition rather than a heat-yield class. |
| Frozen concentrates prepared with water | Citrus, fruit punch, lemonade, limeade, and orange-drink concentrate pairs include `14262`/`14263`, `14268`/`14269`, and `14292`/`14293`. | No concentrate-reconstitution fill class exists. | Preserve concentrate-to-prepared pairs as dilution candidates; do not merge them with instant powders. |
| Alcoholic mixed drinks | Canned or prepared daiquiri, pina colada, tequila sunrise, and whiskey sour records occur alongside mix-with-water records such as `14025`. | No beverage or alcohol-evaporation fill class exists. | Keep product/form distinctions for future beverage modeling; these records do not establish a cooking-loss profile. |
| Horchata and specialty dry mixes | Horchata dry mix `14631` is marked unprepared. | No dry-mix preparation class exists. | Retain as a specialty mix candidate, separate from instant coffee/tea and frozen concentrates. |

### Group 1400 fill-class comparison

- No existing fill class is a direct match for brewing, infusion, instant reconstitution, or concentrate dilution.
- These transformations generally add water or represent extraction and formulation, so a conventional `yield_factor_water` fill class would be the wrong abstraction unless a future recipe explicitly cooks the beverage base.
- The inclusive inventory should preserve brewed coffee, espresso, brewed tea, herbal infusion, instant powder reconstitution, frozen-concentrate dilution, alcoholic mixed-drink products, and specialty dry mixes as separate preparation-state candidates.
- Recipe matching and implementation remain deferred until the complete fill-class and ingredient-state catalog is created.

**Conclusion:** Group `1400` contributes beverage preparation states more than cooking-yield pairs. Preserve the distinctions found in the USDA records, but do not force them into the existing cooked-food fill-class system. A later beverage model may need extraction, dilution, and alcohol-specific composition handling rather than ordinary heat-loss coefficients.

## Updated Review Status

- `0900`: fruit transformations recorded.
- `1000`: 40 pork raw/base-to-cooked families recorded.
- `1100`: vegetable raw/base-to-prepared families and operation variants recorded.
- `1200`: nut and seed raw/base-to-prepared families recorded.
- `1300`: beef raw/base-to-prepared families compared against the existing fill-class and USDA profile catalogs; recipe matching deferred until the full class inventory is complete.
- `1400`: beverage preparation-state families recorded; recipe matching deferred until the full class inventory is complete.
- `1500`: finfish and shellfish raw/base-to-prepared families compared against existing seafood fill classes; recipe matching deferred until the full class inventory is complete.
- `1600`: legume and legume-product raw/base-to-prepared families compared against existing absorption and fill-class coverage; recipe matching deferred until the full class inventory is complete.
- `1700`: lamb, veal, and game raw/base-to-prepared families compared against existing fill-class and profile coverage; recipe matching deferred until the full class inventory is complete.
- `1800`: grain-product and baked-good raw/base-to-prepared families compared against existing structural fill classes; recipe matching deferred until the full class inventory is complete.
- `1900`: sweet, confectionery, frozen-dessert, dry-mix, and prepared-dessert families compared against existing structural fill classes; recipe matching deferred until the full class inventory is complete.
- `2000`: cereal-grain and grain-product hydration, parboiled, instant, steamed, roasted, and salted/unsalted cooked families compared against existing absorption coverage; recipe matching deferred until the full class inventory is complete.
- `3500`: American Indian and Alaska Native raw, preserved, cooked, plant, corn/masa, fat, and composite-dish families compared against existing structural classes; recipe matching deferred until the full class inventory is complete.
