# Recipe Rebuild From Scratch

We are starting from scratch.

The only file to reference for recipe identity and recipe source data is `food-portions-complete.csv`.

## Source Of Truth

Use only `food-portions-complete.csv`.

This file provides the canonical fields needed to define and build the rebuild set:

- `display`: the recipe name
- `has_recipe`: `1` means this row is a recipe row that must be built
- `NDB_NO`: the canonical food identifier tied to that recipe row
- `usda_desc`: the canonical USDA description for that recipe row
- `cal_100g`: calories target
- `pro_100g`: protein target
- `fat_100g`: fat target
- `carb_100g`: carbohydrate target
- `fib_100g`: fiber target
- `h2o_100g`: water target
- `sug_100g`: sugar target
- `sodium_100g`: sodium target when available

No other file defines the recipe list or base recipe-source fields for this rebuild.

## Canonical Rule

1. A row is part of the rebuild only if `has_recipe = 1`.
2. The recipe name comes from `display`.
3. The canonical identifier comes from `NDB_NO`.
4. The canonical USDA reference text comes from `usda_desc`.
5. The canonical macro targets come from `cal_100g`, `pro_100g`, `fat_100g`, `carb_100g`, `fib_100g`, `h2o_100g`, `sug_100g`, and `sodium_100g` when sodium data is available.
6. If a row does not have `has_recipe = 1`, it is not a recipe target.
7. If another file disagrees with `food-portions-complete.csv`, that other file is wrong for this rebuild.

## What This Means

- We are rebuilding directly from the canonical 116 recipe rows.
- We are not using old generated recipe files as a baseline.
- We are not inheriting recipe names from other data files.
- We are not taking recipe identifiers from other files.
- We are not taking USDA descriptions from other files.
- We are not taking macro targets from other files.
- We are rebuilding only the recipe rows identified in `food-portions-complete.csv`.

## Rebuild Scope

For each row in `food-portions-complete.csv` where `has_recipe = 1`:

1. Use `display` as the recipe name.
2. Use `NDB_NO` as the canonical row identifier reference.
3. Use `usda_desc` as the canonical USDA description reference.
4. Use the canonical macro fields in that row, including sodium when available, as the nutrition target.
5. Create the recipe record.
6. Build the ingredient structure for that recipe one recipe at a time.
7. Add instructions only after the ingredient build is finalized.
8. Regenerate dependent recipe outputs only after the canonical recipe set is rebuilt.

## Reconstruction Method

Each recipe is built one at a time.

The recipe is reverse engineered by trying to produce a plausible recipe that a real cook would recognize as reasonable while also matching the nutrition profile as closely as possible.

There are 8 nutrition targets to compare for the whole recipe and for each ingredient contribution, with sodium treated as conditional when source data is missing:

- `cal_100g`
- `pro_100g`
- `fat_100g`
- `carb_100g`
- `fib_100g`
- `h2o_100g`
- `sug_100g`
- `sodium_100g`

The working goal is not just to hit calories alone. The ingredient set should match the full macro profile well enough that the final recipe is nutritionally believable and culinarily believable at the same time.

Sodium is included because it matters for recipe accuracy and for people managing low-sodium diets.

One of the differences between the 2015 SR28 data and the 2018 SR Legacy data is the addition of sodium handling in the source we are using.

The `DataCentralCombo` table is based on SR Legacy, but not every candidate ingredient is guaranteed to have a sodium value.

Because of that, sodium should be included in the comparison whenever it is available, but a clearly excellent overall ingredient match should not be eliminated only because sodium data is missing and there is no better replacement.

The target tolerance for a strong match is within `<=5%` of the canonical target value for each nutrition field, except where missing source data prevents a valid sodium comparison.

## Why `usda_desc` Matters

`usda_desc` is particularly important because critical food details live in that description.

It can distinguish meaningfully different foods and preparations such as whole milk versus 2% milk, raw versus cooked items, roasted versus boiled items, salted versus unsalted products, canned versus fresh forms, and other preparation details that materially affect nutrition and recipe realism.

That means `usda_desc` is not just a label. It is part of the evidence used to decide what the recipe probably is.

## Ingredient Build Standard

For each recipe:

1. Start from the canonical row in `food-portions-complete.csv`.
2. Use `NDB_NO`, `usda_desc`, and the recipe-level nutrition values in that row as the reverse-engineering target.
3. Propose ingredients and amounts that a competent cook would consider normal for that dish.
4. Compare the summed ingredient nutrition against the recipe nutrition targets, including sodium when available.
5. Adjust ingredient choices and amounts until the recipe is a strong fit nutritionally and still makes sense as food.
6. Do not keep an ingredient list that matches macros well if it produces an implausible recipe.
7. Do not keep a plausible ingredient list if the macro fit is clearly poor when a better fit is possible.
8. Use `usda_desc` details to avoid false matches caused by similar foods with different fat levels, water content, or cooking methods.
9. If salt is part of the recipe, include it explicitly rather than assuming it away.
10. Treat sodium as an important comparison target, but do not reject an otherwise excellent match solely because a candidate ingredient lacks sodium data and no good replacement exists.
11. Treat `<=5%` deviation from the canonical target as the working standard for a strong nutrition match.

## Instruction Timing

Cooking instructions are added only after the ingredients are finalized.

Instruction writing is downstream from ingredient reconstruction, not part of the initial guesswork.

After a recipe is complete, show it to the developer for review.

No recipe moves forward to the next stage until it has been reviewed in completed form.

## Heat-Loss Adjustment Rule

Where it applies, values will be adjusted based on scientific research about nutrient loss from heat and cooking.

That means the final reconstructed ingredient totals may require correction for known cooking effects before the recipe is treated as complete.

These adjustments should be applied carefully and only when they materially improve the realism of the final recipe.

## Sodium Rule

If salt is part of the recipe, include it explicitly.

This matters both for realism and for users who need low-sodium accuracy.

Sodium should be matched where data exists.

However, the source dataset may not provide sodium for every ingredient candidate.

When sodium data is missing for an otherwise excellent ingredient match, that missing sodium value should not automatically disqualify the ingredient if no better realistic replacement exists.

## Match Tolerance

The working tolerance for a strong match is `<=5%` deviation from each canonical nutrition target.

This applies to calories, protein, fat, carbohydrate, fiber, water, sugar, and sodium when sodium data is available.

If sodium data is missing in an otherwise excellent candidate set, the recipe can still pass as long as the non-missing targets are strong and the sodium omission is due to source data limits rather than avoidable ingredient choice.

## Approval And Test Workflow

After a recipe is completed, present it to the developer.

The developer review happens before export or upload.

After the first developer approval:

1. Create a TypeScript file for the free tier.
2. Use that TypeScript output as the artifact for free-tier testing.
3. Upload the approved recipe to the Turso `dev_recipes` table.
4. Test end-to-end functionality against the Turso dev flow.

This means recipe completion is followed by review, then TypeScript export, then Turso dev-table testing.

## Recipe Source Identification

We need a clear way to distinguish the TypeScript-contained recipe from the Turso-served recipe.

That identification must be present during review and testing so there is no confusion about which source produced the recipe being displayed.

At minimum, each recipe artifact should carry a source marker that identifies whether it came from:

1. The free-tier TypeScript file
2. The Turso `dev_recipes` table

This source marker should remain visible or inspectable wherever recipes are compared, approved, exported, or tested.

The purpose is to prevent false conclusions caused by mixing a local TypeScript recipe with a remotely served Turso recipe that happens to have the same name.

The source distinction also reflects a real data difference:

1. The free-tier TypeScript file contains only the 7 primary nutrition targets used for the lightweight recipe build.
2. The Turso `dev_recipes` table contains the full nutrient profile, approximately 57 nutrients.

Because the data payloads are different, the UI should make the recipe source subtly but clearly distinguishable during testing.

Possible cues include a subtle difference in font weight, color, or visual style so testers can tell whether they are looking at the TypeScript free-tier recipe or the Turso-served full-nutrient recipe without adding noisy labels.

## Save Progress Rule

Work must be saved progressively in a way that does not overwrite previously saved work.

As recipe reconstruction moves forward, earlier completed or approved work must remain recoverable.

That means the workflow should preserve prior versions, prior approvals, and prior exported artifacts rather than replacing them in place without traceability.

When saving a new iteration, use a method that prevents accidental destruction of the last good state.

The goal is to make sure that progress accumulates safely as recipes are rebuilt one at a time.

Every 20 recipes, save the work into a clearly labeled file that is separate from the file containing the entire workload.

That batch-save file is a checkpoint artifact, not a replacement for the full master file.

The full workload file remains the cumulative source for the entire rebuild, while each 20-recipe file provides a recoverable milestone.

The labeling should make it obvious which checkpoint batch the file contains.

## Definition Of A Good Rebuild

A rebuilt recipe is acceptable only if both of these are true:

1. The ingredient list would seem reasonable to a cook.
2. The ingredient totals match the nutrition targets within `<=5%`, including sodium where sodium data exists.

## Non-Negotiable Constraint

The rebuild must stay anchored to `food-portions-complete.csv` from start to finish.

Do not introduce recipe rows from any other file.

## Working Rule For Every Decision

When deciding whether a recipe exists, ask only:

- Is there a row in `food-portions-complete.csv`?
- Does that row have `has_recipe = 1`?
- What is the `display` value for that row?
- What is the `NDB_NO` value for that row?
- What is the `usda_desc` value for that row?
- What are the nutrition target values for that row, including sodium when available?

If those answers are clear, that is the recipe definition.

## Immediate Next Step

The next recipe to reverse engineer is:

- `word`: `APPLESTRUDEL`
- `display`: `Apple Strudel`
- `NDB_NO`: `18354`
- `usda_desc`: `Strudel, apple`

Use the canonical row for `APPLESTRUDEL` in `food-portions-complete.csv` as the fixed rebuild target for the next recipe pass.

After `Apple Strudel` is completed, route it through developer review before creating the free-tier TypeScript file and testing it in Turso `dev_recipes`.

## First-Pass Ingredient Hypothesis For Apple Strudel

The canonical `APPLESTRUDEL` row suggests a dessert that is clearly fruit-forward and sugar-forward, but not as fat-heavy as pie and not as lean as plain baked apples.

Canonical target per `100g`:

- `cal_100g`: `274.0`
- `pro_100g`: `3.3`
- `fat_100g`: `11.2`
- `carb_100g`: `41.1`
- `fib_100g`: `2.2`
- `h2o_100g`: `43.5`
- `sug_100g`: `25.8`

That profile points toward a pastry-based apple dessert with meaningful added sugar and butter or pastry fat, but probably not a dense double-crust pie model.

The first-pass culinary hypothesis should therefore be a classic apple strudel structure:

- Pastry:
	- `phyllo dough` or a thin strudel pastry equivalent
	- `melted butter`
- Filling:
	- `apples`
	- `sugar`
	- `raisins`
	- `bread crumbs`
	- `ground cinnamon`
	- `lemon juice`
- Optional finishing ingredient to test only if needed:
	- `powdered sugar`

Why this is the right first guess:

- `apples` explain the high water content and fruit sugar base
- `sugar` is required because `25.8g` sugar per `100g` is too high for apples alone
- `butter` or pastry fat is needed to reach `11.2g` fat per `100g`
- a thin layered pastry model fits strudel better than a pie crust model
- `bread crumbs` are common in apple strudel because they absorb apple juices and add some starch without making the dessert read like pie
- `raisins` are common in many recognizable apple strudels and can help move sugar upward without forcing excessive plain sugar
- `cinnamon` and `lemon juice` improve culinary realism even if their macro effect is minor

What to test first:

1. Start with a thin-pastry strudel model, not a pie model.
2. Use fresh apples first, not canned pie filling.
3. Include bread crumbs from the beginning because they are structurally normal for strudel and may help the carb profile.
4. Include raisins in the first nutrition pass because the sugar target is relatively high.
5. Add powdered sugar only if the first-pass build is still too low in sugar after the core strudel structure is tested.

What to avoid in the first pass:

- do not start from the `Pie Apple` canned-filling model
- do not start from a double-crust pastry assumption
- do not omit pastry fat and then try to repair the fat gap later with unrealistic butter additions inside the filling

The working question for the first Apple Strudel pass is whether a realistic thin-pastry apple strudel with apples, sugar, raisins, bread crumbs, cinnamon, lemon juice, and butter can land within the normal `<=5%` target window before any more specialized adjustments are introduced.

## First Candidate Gram-Weight Build For Apple Strudel

The first candidate should be treated as a test build, not an approved recipe.

Use this as the opening quantitative pass:

- Pastry:
	- `phyllo dough` or thin strudel pastry sheets: `120g`
	- `melted butter`: `45g`
- Filling:
	- `apples`: `650g`
	- `sugar`: `90g`
	- `raisins`: `60g`
	- `bread crumbs`: `55g`
	- `lemon juice`: `15g`
	- `ground cinnamon`: `3g`

Why this is a reasonable first numeric pass:

- `650g` apples keeps the dessert clearly apple-centered and should contribute most of the water mass
- `120g` pastry keeps the structure thin enough to read as strudel instead of pie or turnover
- `45g` butter gives enough pastry fat to move toward the `11.2g` fat target without making the dessert read as laminated pastry
- `90g` sugar plus `60g` raisins gives a realistic sweet filling and should push total sugar much closer to the `25.8g` target
- `55g` bread crumbs is enough to absorb moisture and support the carbohydrate profile without overpowering the filling
- `15g` lemon juice and `3g` cinnamon keep the recipe recognizable without materially distorting the macro model

First-pass evaluation questions for this build:

1. Is sugar still too low even with raisins included?
2. Is fat still too low, which would imply either more butter or a richer pastry is needed?
3. Is water too high, which would imply either less apple, more crumb absorption, or stronger bake-loss modeling is needed?
4. Is fiber too low, which would imply the apple variety or raisin share may need adjustment?
5. Does the final pastry-to-filling ratio still read like strudel to a cook?

If this first candidate misses badly, the next changes should be small and controlled:

- raise or lower butter before changing the pastry style entirely
- adjust sugar and raisins before introducing a glaze or powdered-sugar finish
- adjust bread crumbs before replacing fresh apples with a more processed apple component

Only after this candidate is tested should we decide whether Apple Strudel needs a more enriched pastry model or a more prepared apple filling model.

## What We Learned From Building Pie Apple

Building `Pie Apple` established several practical rules that should guide the rest of the rebuild.

First, the canonical target row must stay fixed, but the ingredient model may need to move away from an overly literal first guess. In the case of `Pie Apple`, modeling the filling as plain fresh apples alone did not fit the canonical nutrition well enough. A better fit came from treating the filling as closer to a prepared sweetened filling while still keeping the final recipe readable to a cook.

Second, recipe realism and nutrition fit have to be solved together. A recipe that looks plausible in a kitchen can still miss the nutrition targets badly, and a recipe that matches the nutrition targets can still read like nonsense to a cook. The apple pie work showed that both standards have to be checked at the same time.

Third, small culinary details can matter numerically when the recipe is already close to target. For `Pie Apple`, butter amount, sugar amount, and the inclusion of a whole-egg wash were not trivial details. Those adjustments materially changed calories, fat, protein, carbohydrate, and water per `100g`.

Fourth, spices and acidifiers may be kept for realism even when their nutritional effect is small. In `Pie Apple`, cinnamon and lemon juice helped the recipe read like an actual pie recipe even though they were not the primary drivers of the macro fit.

Fifth, baked-food comparisons must be handled carefully. A naive bake-loss model that simply reduces total weight without specifically modeling water loss is not good enough. Moisture adjustment must be treated explicitly rather than assumed through a generic shrink percentage.

Sixth, the saved recipe artifact and the tested nutrition model must stay synchronized. If a quantity improves the fit during testing, that quantity must be reflected in the active recipe files before the recipe is treated as complete.

For future rebuild work, `Pie Apple` should be treated as the example that proved the process: start from the canonical row, try plausible ingredient structures, test the full nutrition profile, adjust the ingredients without losing culinary realism, and only then lock the saved recipe state.

## Ingredients From Pie Apple That Can Be Reused In Other Pies

The current approved `Pie Apple` approach should be recorded explicitly because it is now the working example for how a rebuilt pie can use a realistic ingredient structure while still staying anchored to the canonical food row.

The active `Pie Apple` build uses this structure:

- Crust:
	- `all-purpose flour`
	- `salt`
	- `vegetable shortening`
	- `ice-cold water`
	- `sugar`
- Filling:
	- `apple pie filling, canned`
	- `sugar`
	- `lemon juice`
	- optional `ground cinnamon`
	- optional `ground cloves`
	- optional `allspice`

The current saved recipe text reflects that structure directly:

- Crust:
	- `2 cups all-purpose flour`
	- `3/4 teaspoon salt`
	- `2/3 cup vegetable shortening chilled`
	- `6 tablespoons ice-cold water`
	- `2 teaspoons sugar`
- Filling:
	- `1 can (21 ounces) apple pie filling, canned`
	- `5 tablespoon sugar`
	- `1 tablespoon lemon juice`
	- `1 teaspoon Optional: ground cinnamon`
	- `1 teaspoon Optional: ground cloves`
	- `1 teaspoon Optional: allspice`

The current nutrition-source rule for `Pie Apple` is also part of the approach and should be reused in later recipe work when canonical dish data is incomplete:

- the rebuilt recipe remains anchored to the canonical food row for identity and primary nutrient authority
- the recipe text shown to the user comes from the rebuilt ingredient and instruction files
- displayed nutrient values use the canonical dish row first
- if a canonical nutrient value is `0` and the rebuilt recipe value for that same nutrient is not `0`, use the rebuilt value for that nutrient as a fallback

For `Pie Apple`, this means the displayed recipe still inherits its nutrient identity from canonical row `18302`, while sugar and fiber can fall back to the rebuilt recipe when the canonical values appear to be unavailable or defective.

The `Pie Apple` build also produced a practical list of pie ingredients that can be reused in later pie reconstructions when the target recipe makes culinary sense.

- `pastry for a 9-inch double-crust pie`  
	`sr28_long_desc`: `pie crust, frozen, baked`  
	`NDB_NO`: `18335`  
	reusable for many fruit pies and other double-crust baked pies
- `butter`  
	`sr28_long_desc`: `butter unsalted`  
	`NDB_NO`: `1145`  
	reusable as a filling enrichment ingredient in many homemade pies
- `1 whole egg` for egg wash  
	`sr28_long_desc`: `egg whole`  
	`NDB_NO`: `1123`  
	reusable when a pie uses a brushed top crust
- `ground cinnamon`  
	`sr28_long_desc`: `cinnamon ground`  
	`NDB_NO`: `2010`  
	reusable in many fruit pies, especially apple, pear, peach, and mixed-spice sweet pies
- `lemon juice`  
	`sr28_long_desc`: `lemon juice raw`  
	`NDB_NO`: `9152`  
	reusable as an acidifier in many fruit pies where brightness or anti-browning effect makes sense

Some ingredients are reusable only as a pattern, not as a literal carry-forward ingredient:

- `apple pie filling, canned`  
	`sr28_long_desc`: `pie filling, apple, canned`  
	`NDB_NO`: `19312`  
	this should not be treated as a universal pie ingredient, but it proved that some pie reconstructions may need to model the filling as a prepared sweetened fruit filling rather than as plain raw fruit alone

For future pie recipes, the reusable pie-ingredient checklist should therefore begin with these questions:

- Does the pie use a single crust or a double crust?
- Does the filling need butter?
- Does the top crust use an egg wash?
- Does the filling plausibly use cinnamon or other warm spices?
- Does the filling plausibly use lemon juice or another acidifier?
- Should the filling be modeled as plain fruit, sweetened fruit, or a more prepared filling equivalent?

## Nutrient Fallback Rule

Canonical nutrient values remain the primary authority.

However, a canonical nutrient value should not be treated as authoritative when it is clearly unusable for that specific nutrient.

Use this rule:

1. Use the canonical nutrient value by default.
2. Use the rebuilt recipe value only for the specific nutrient that is demonstrably defective in the canonical row.
3. Keep fallback decisions nutrient-by-nutrient, not recipe-wide.
4. Do not replace a canonical nutrient value just because the rebuilt value seems more plausible.

For this rebuild, a canonical nutrient value counts as demonstrably defective when at least one of these is true:

- the value is missing or null
- the value is `0` even though the rebuilt recipe contains clear contributing ingredients for that nutrient
- the value is impossible or internally inconsistent for that nutrient
- the value is so incompatible with the ingredient model that it is more likely to be a source defect than a recipe-design error

This means the practical decision rule is:

- use canonical unless that nutrient value is demonstrably defective
- if it is demonstrably defective, use the rebuilt value for that nutrient only

For `Pie Apple`, this rule justifies using rebuilt fallback values for nutrients such as sugar or fiber when the canonical row gives `0`, while preserving canonical authority for nutrients that remain usable.
