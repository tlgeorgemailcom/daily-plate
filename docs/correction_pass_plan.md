# Recipe Correction Pass — Work Plan
> Created 2026-06-28. Governs the "corrections and missing info" pass across ALL recipes.
> Do NOT produce new recipes during this pass. Fix what already exists.

---

## The Two Primary Tasks

### Task 1 — Add `Suggestions (not included):` to every recipe that lacks one
### Task 2 — Add preparation state to every `qty_display` that lacks it (fresh/raw ingredients)

### Secondary Task — Fix any other mistake discovered in the process.

---

## Ground Rules (do not skip)

1. **Safe append workflow** (Task 1 only):
   ```python
   # Pre-write count snapshot
   python3 -c "import csv; rows=[r for r in csv.reader(open('recipes_v3/data/recipe_instructions.csv')) if len(r)>0 and r[0].startswith('PREFIX_')]; print(len(rows), 'rows')"
   # Write using csv.writer + open(path, 'a')
   # Post-write count — must match pre + 1 per modified recipe, all other prefixes unchanged
   ```

2. **Never open `recipe_instructions.csv` with `'w'` mode.** Always `'a'` for appends.

3. **After every instruction change**: run `upload.py --recipe ID --commit`, then `generate_bundle.py`, then commit.

4. **For `qty_display` edits (Task 2)**: edit `recipe_ingredients.csv` directly (targeted replacement), then rebuild + upload + regenerate bundle + commit.

5. **`qty_display` must never contain a comma** — use parentheses instead. e.g. `"2 tbsp butter (melted)"` not `"2 tbsp butter, melted"`.

6. **Before any `qty_display` edit**: run `python3 recipes_v3/tools/preview_ingredients.py --recipe RECIPE_ID` to see current rendering. Run again after to verify the fix.

7. **Commit discipline**: one commit per recipe or small logical batch. Message format:
   - `"feat: add Suggestions step to RECIPE_ID Recipe Name"`
   - `"fix: add prep states to qty_display for RECIPE_ID Recipe Name"`

---

## Task 1 — Missing `Suggestions (not included):` Steps

### Current Counts (as of 2026-06-28)

| Category | Total recipes | Missing Suggestions | Notes |
|---|---|---|---|
| BKFST | 53 | 15 | See list below |
| BVRG | 152 | 44 | See list below |
| CRUST | 4 | 4 | Crust components — "Use for…" style |
| ENTR | 127 | 63 | See list below |
| PASTA | 16 | 0 | ✅ Complete |
| SALAD | 26 | 24 | See list below |
| SAND | 80 | 71 | See list below |
| SAUCE | 27 | 21 | "Serve with / use in…" style |
| SIDE | 40 | 37 | "Pairs well with…" style |
| SOUP | 22 | 3 | Almost done — SOUP_001, 004, 010 |
| STOCK | 7 | 7 | Component recipes — "Use in…" style |
| SWEET | 40 | 38 | See list below |

**Total missing: ~327 recipes**

---

### BKFST — 15 missing

| Recipe | Suggested text |
|---|---|
| BKFST_002 Biscuits & Gravy | `Suggestions (not included): Serve with scrambled eggs, hash browns, or fresh fruit.` |
| BKFST_003 Eggs Benedict | `Suggestions (not included): Serve with hash browns, sliced tomatoes, or fresh fruit.` |
| BKFST_004 English Muffin | `Suggestions (not included): Serve toasted with butter, jam, honey, or as a base for Eggs Benedict.` |
| BKFST_006 Hollandaise Sauce | `Suggestions (not included): Spoon over poached eggs, steamed asparagus, or grilled salmon.` |
| BKFST_009 Pancakes (buttermilk) | `Suggestions (not included): Serve with maple syrup, fresh berries, sliced bananas, or whipped cream.` |
| BKFST_013 Hash Brown Potatoes | `Suggestions (not included): Serve alongside scrambled eggs, bacon, sausage, or an omelette.` |
| BKFST_016 English Muffin (Thomas Style) | `Suggestions (not included): Serve toasted with butter, jam, honey, or as a base for Eggs Benedict.` |
| BKFST_030 Crustless Spinach Quiche | `Suggestions (not included): Serve with crispy roasted potatoes or fresh fruit.` |
| BKFST_035 Avocado Toast Tomato & Egg | `Suggestions (not included): Serve with fresh fruit, bacon, or a side salad.` |
| BKFST_040 Bagel & Cream Cheese | `Suggestions (not included): Serve with fresh fruit, sliced tomatoes, or hot coffee.` |
| BKFST_041 Bagel & Lox | `Suggestions (not included): Serve with a side salad, fresh fruit, or a sparkling water.` |
| BKFST_042 Denver Scrambler | `Suggestions (not included): Serve with hash browns, salsa, toast, or sour cream.` |
| BKFST_043 Migas without Tortillas | `Suggestions (not included): Serve with refried beans, avocado, salsa, or warm tortillas.` |
| BKFST_044 Migas with Tortillas | `Suggestions (not included): Serve with refried beans, avocado, or salsa.` |
| BKFST_045 Yogurt Parfait | `Suggestions (not included): Serve chilled with additional fresh fruit or a drizzle of honey.` |

---

### CRUST — 4 missing

| Recipe | Suggested text |
|---|---|
| CRUST_001 Pie Crust Single (Unbaked) | `Suggestions (not included): Use for single-crust pies (pumpkin, custard, pecan) or quiche.` |
| CRUST_002 Pie Crust Double (Unbaked) | `Suggestions (not included): Use for double-crust pies (apple, cherry, peach, beef pot pie).` |
| CRUST_003 Pie Crust Single (Pre-baked) | `Suggestions (not included): Use for no-bake or cream-filled pies (chocolate, lemon curd, banana cream).` |
| CRUST_004 Empanada Dough | `Suggestions (not included): Use for beef, chicken, or sweet empanadas.` |

---

### STOCK — 7 missing

| Recipe | Suggested text |
|---|---|
| STOCK_001 White Chicken Stock | `Suggestions (not included): Use in soups, risotto, pan sauces, braises, or Velouté sauce.` |
| STOCK_002 Brown Chicken Stock | `Suggestions (not included): Use in gravies, braised chicken dishes, or dark pan sauces.` |
| STOCK_003 Chicken Broth | `Suggestions (not included): Use in soups, stews, rice dishes, or as a base for Velouté sauce.` |
| STOCK_004 Beef Stock | `Suggestions (not included): Use in beef stews, French onion soup, braised short ribs, or gravies.` |
| STOCK_005 Beef Bone Broth | `Suggestions (not included): Serve warm as a sipping broth or use in soups, stews, and braises.` |
| STOCK_006 Fish Stock | `Suggestions (not included): Use in seafood soups, chowders, paella, or seafood risotto.` |
| STOCK_007 Vegetable Stock | `Suggestions (not included): Use in vegetarian soups, risotto, grains, or as a braising liquid.` |

---

### SAUCE — 21 missing

| Recipe | Suggested text |
|---|---|
| SAUCE_001 Béchamel | `Suggestions (not included): Spoon over steamed vegetables, pasta, or use as a base for Mornay or Soubise sauce.` |
| SAUCE_002 Mornay | `Suggestions (not included): Pour over steamed broccoli, cauliflower, pasta, or crêpes.` |
| SAUCE_003 Soubise | `Suggestions (not included): Serve alongside roasted chicken, pork, or poached fish.` |
| SAUCE_004 Sauce Crème | `Suggestions (not included): Serve over poached fish, steamed vegetables, or with chicken.` |
| SAUCE_005 Sauce Aurore | `Suggestions (not included): Serve over poached eggs, fish, or chicken.` |
| SAUCE_006 Velouté | `Suggestions (not included): Serve alongside roasted chicken, poached fish, or steamed vegetables. Use as a base for other sauces.` |
| SAUCE_007 Béarnaise | `Suggestions (not included): Serve over grilled steak, roasted salmon, or steamed asparagus.` |
| SAUCE_009 Mayonnaise | `Suggestions (not included): Use as a sandwich spread, dip, or base for other dressings and sauces.` |
| SAUCE_010 Dijon-Type Mustard | `Suggestions (not included): Use as a sandwich condiment, in salad dressings, or as a glaze for pork and chicken.` |
| SAUCE_011 Tomato Ketchup | `Suggestions (not included): Serve with burgers, fries, hot dogs, or grilled meats.` |
| SAUCE_012 Chili Sauce | `Suggestions (not included): Serve with grilled meats, hot dogs, egg rolls, or as a dipping sauce.` |
| SAUCE_014 Creole Seasoning | `Suggestions (not included): Use to season shrimp, chicken, fish, or as a rub for grilled meats.` |
| SAUCE_016 Basic Vinaigrette | `Suggestions (not included): Toss with mixed greens, drizzle over roasted vegetables, or use as a light marinade.` |
| SAUCE_017 Italian Vinaigrette | `Suggestions (not included): Toss with romaine, pasta salad, or use as a marinade for grilled chicken.` |
| SAUCE_018 Balsamic Vinaigrette | `Suggestions (not included): Drizzle over arugula, caprese salad, roasted beets, or grilled vegetables.` |
| SAUCE_019 Lemon Vinaigrette | `Suggestions (not included): Toss with asparagus, arugula, grilled fish, or grain bowls.` |
| SAUCE_020 Ranch Dressing | `Suggestions (not included): Serve with salads, chicken wings, pizza, or as a dip for raw vegetables.` |
| SAUCE_021 Blue Cheese Dressing | `Suggestions (not included): Serve with a wedge salad, buffalo wings, or raw vegetables.` |
| SAUCE_022 Honey Mustard Dressing | `Suggestions (not included): Use as a salad dressing, sandwich spread, or dipping sauce for chicken tenders.` |
| SAUCE_023 Green Goddess Dressing | `Suggestions (not included): Toss with butter lettuce, drizzle over grilled chicken, or use as a dip for vegetables.` |
| SAUCE_024 Caesar Salad Dressing | `Suggestions (not included): Toss with romaine lettuce and croutons, or use as a dipping sauce for grilled chicken.` |

---

### SIDE — 37 missing (prioritized)

General rule: "Pairs well with grilled/roasted [protein] or [other side]."

| Recipe | Suggested text |
|---|---|
| SIDE_001 Mashed Potatoes (Robuchon Style) | `Suggestions (not included): Pairs well with roasted chicken, grilled steak, or braised short ribs.` |
| SIDE_002 Garlic Mashed Potatoes | `Suggestions (not included): Pairs well with roasted chicken, grilled steak, or braised lamb.` |
| SIDE_003 Mashed Potatoes (Butter Only) | `Suggestions (not included): Pairs well with roasted chicken, pork chops, or beef pot roast.` |
| SIDE_004 Horseradish Mashed Potatoes | `Suggestions (not included): Pairs especially well with roast beef, prime rib, or brisket.` |
| SIDE_005 Potato Salad (American Style) | `Suggestions (not included): Serve alongside grilled burgers, BBQ ribs, fried chicken, or hot dogs.` |
| SIDE_006 Potato Salad (German Style) | `Suggestions (not included): Serve alongside grilled bratwurst, pork chops, or smoked sausage.` |
| SIDE_007 Gratin Dauphinois | `Suggestions (not included): Pairs well with roasted lamb, beef tenderloin, or roasted chicken.` |
| SIDE_008 Potatoes au Gratin | `Suggestions (not included): Pairs well with roasted chicken, pork tenderloin, or grilled steak.` |
| SIDE_009 Pommes Anna | `Suggestions (not included): Pairs well with roasted chicken, grilled steak, or seared salmon.` |
| SIDE_010 Tartiflette | `Suggestions (not included): Pairs well with a crisp green salad and a glass of dry white wine.` |
| SIDE_012 Cornbread (2% Milk) | `Suggestions (not included): Serve alongside chili, BBQ ribs, baked beans, or collard greens.` |
| SIDE_013 Cornbread (Buttermilk) | `Suggestions (not included): Serve alongside chili, BBQ ribs, baked beans, or collard greens.` |
| SIDE_014 Rainbow Coleslaw | `Suggestions (not included): Serve alongside grilled burgers, pulled pork, BBQ chicken, or fried fish.` |
| SIDE_015 Hasselback Potatoes | `Suggestions (not included): Pairs well with roasted chicken, grilled steak, or seared salmon.` |
| SIDE_016 Twice Baked Potatoes | `Suggestions (not included): Pairs well with grilled steak, BBQ ribs, or roasted chicken.` |
| SIDE_018 Baked Beans | `Suggestions (not included): Serve alongside BBQ ribs, pulled pork, hot dogs, or grilled chicken.` |
| SIDE_019 Mac and Cheese | `Suggestions (not included): Pairs well with BBQ ribs, pulled pork, fried chicken, or grilled steak.` |
| SIDE_020 Mac and Tomato | `Suggestions (not included): Pairs well with grilled chicken, pork chops, or as a light main course.` |
| SIDE_022 Fried Okra | `Suggestions (not included): Serve alongside grilled catfish, fried chicken, or BBQ pork.` |
| SIDE_023 Fried Squash | `Suggestions (not included): Serve alongside grilled chicken, fish, or as an appetizer with ranch dressing.` |
| SIDE_024 Sweet Potato Casserole | `Suggestions (not included): Pairs especially well with roast turkey, ham, or pork tenderloin.` |
| SIDE_025 Vegan Sweet Potato Casserole | `Suggestions (not included): Pairs especially well with roast turkey, ham, or pork tenderloin.` |
| SIDE_026 Marshmallow Sweet Potato Casserole | `Suggestions (not included): A classic holiday side — pairs especially well with roast turkey or glazed ham.` |
| SIDE_027 Deviled Eggs | `Suggestions (not included): Serve as an appetizer with pickles, olives, or alongside a charcuterie board.` |
| SIDE_028 Braised Collard Greens | `Suggestions (not included): Pairs well with BBQ ribs, fried chicken, cornbread, or black-eyed peas.` |
| SIDE_029 Creamed Corn | `Suggestions (not included): Pairs well with grilled steak, pork chops, roasted chicken, or fried fish.` |
| SIDE_030 Creamed Spinach | `Suggestions (not included): Pairs especially well with grilled steak, roasted beef tenderloin, or salmon.` |
| SIDE_031–040 | Use same "Pairs well with" pattern — derive from recipe name |

---

### SALAD — 24 missing

General rule: "Serve as a starter or light main course. Pairs well with [complement]."

| Recipe | Suggested text |
|---|---|
| SALAD_001 Caesar Salad | `Suggestions (not included): Serve as a starter or add grilled chicken, shrimp, or salmon for a main course.` |
| SALAD_002 Chicken Caesar Salad | `Suggestions (not included): Serve with crusty bread or garlic bread on the side.` |
| SALAD_005 Greek Salad | `Suggestions (not included): Serve with warm pita bread, grilled chicken, or lamb kebabs.` |
| SALAD_006 Taco Salad | `Suggestions (not included): Serve with salsa, guacamole, sour cream, or warm tortillas.` |
| SALAD_007 Asparagus Salad | `Suggestions (not included): Serve as a first course or alongside grilled salmon or chicken.` |
| SALAD_008 Burrata Salad | `Suggestions (not included): Serve with crusty bread to soak up the dressing.` |
| SALAD_009 Caprese Salad | `Suggestions (not included): Serve with crusty bread or as a starter before pasta.` |
| SALAD_010 Chickpea Salad | `Suggestions (not included): Serve with warm pita bread or as a light main course.` |
| SALAD_011 Chicken Pasta Salad | `Suggestions (not included): Serve chilled alongside grilled corn, garlic bread, or fresh fruit.` |
| SALAD_012 Chicken & Artichoke Pasta Salad | `Suggestions (not included): Serve chilled with crusty bread or as a picnic main course.` |
| SALAD_013 Gnocchi Antipasto Salad | `Suggestions (not included): Serve with garlic bread or as a starter before a pasta main course.` |
| SALAD_014 Grilled Chicken Salad | `Suggestions (not included): Serve with crusty bread or garlic bread on the side.` |
| SALAD_015 Mediterranean Orzo Salad | `Suggestions (not included): Serve chilled alongside grilled chicken, lamb, or fish.` |
| SALAD_016 Mediterranean Pasta Salad | `Suggestions (not included): Serve chilled alongside grilled chicken, salmon, or as a picnic main course.` |
| SALAD_017 Ramen Noodle Salad | `Suggestions (not included): Serve alongside grilled chicken or pork, or as a light main course.` |
| SALAD_018 Shrimp Caesar Salad | `Suggestions (not included): Serve with crusty bread or garlic bread on the side.` |
| SALAD_019 Southwestern Salad | `Suggestions (not included): Serve with warm tortillas or tortilla chips and extra salsa on the side.` |
| SALAD_020 Shrimp and Avocado Salad | `Suggestions (not included): Serve with warm tortillas or crusty bread.` |
| SALAD_021 Tuna Macaroni Salad | `Suggestions (not included): Serve chilled alongside grilled corn, crusty bread, or fresh fruit.` |
| SALAD_022 Wedge Salad | `Suggestions (not included): Serve as a starter before grilled steak, beef tenderloin, or roasted chicken.` |
| SALAD_023 Nicoise Salad | `Suggestions (not included): Serve with crusty French bread and a glass of dry rosé or white wine.` |
| SALAD_024 Spinach Salad | `Suggestions (not included): Serve as a starter or alongside grilled chicken or seared salmon.` |
| SALAD_025 Three Bean Salad | `Suggestions (not included): Serve chilled alongside grilled chicken, BBQ ribs, or as a light main course.` |
| SALAD_026 Waldorf Salad | `Suggestions (not included): Serve on a bed of lettuce or alongside grilled chicken and crusty bread.` |

---

### SAND — 71 missing

All sandwiches follow the same pattern: `Suggestions (not included): Serve with [chips/fries/pickle/salad] and [beverage/soup].`

| Recipe | Suggested text |
|---|---|
| SAND_001–003 Grilled Cheese variants | `Suggestions (not included): Serve with tomato soup, a dill pickle, or a simple green salad.` |
| SAND_004 BLT | `Suggestions (not included): Serve with potato chips, a dill pickle, or a bowl of tomato soup.` |
| SAND_005 Club | `Suggestions (not included): Serve with potato chips, french fries, or a side salad.` |
| SAND_006 Egg Salad | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_007 Tuna Salad | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of soup.` |
| SAND_008 Chicken Salad | `Suggestions (not included): Serve with potato chips, a dill pickle, or fresh fruit.` |
| SAND_009 Ham and Cheese | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_010 PBJ | `Suggestions (not included): Serve with a glass of cold milk, fresh fruit, or potato chips.` |
| SAND_011 Pimento Cheese | `Suggestions (not included): Serve with potato chips, a dill pickle, or fresh sliced tomatoes.` |
| SAND_012 Cucumber Tea | `Suggestions (not included): Serve with hot tea, finger sandwiches, or fresh fruit for an afternoon tea.` |
| SAND_013 Croque Monsieur | `Suggestions (not included): Serve with a simple green salad or french fries.` |
| SAND_014 Croque Madame | `Suggestions (not included): Serve with a simple green salad or french fries.` |
| SAND_016 Hot Brown | `Suggestions (not included): Serve with a simple green salad or roasted potatoes.` |
| SAND_017 Open-Faced Roast Beef | `Suggestions (not included): Serve with mashed potatoes, green beans, or a simple green salad.` |
| SAND_018–022 Turkey variants | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of soup.` |
| SAND_023 Roast Beef | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of soup.` |
| SAND_024 Avocado Sprouts | `Suggestions (not included): Serve with a cup of soup, fresh fruit, or a side salad.` |
| SAND_025 Reuben | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_026 Pastrami | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_027 Corned Beef | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_028 Liverwurst | `Suggestions (not included): Serve with potato chips, a dill pickle, or sliced raw onion.` |
| SAND_029 Limburger | `Suggestions (not included): Serve with potato chips and a cold beer.` |
| SAND_030 Patty Melt | `Suggestions (not included): Serve with french fries, onion rings, or a side salad.` |
| SAND_031 Sloppy Joe | `Suggestions (not included): Serve with potato chips, coleslaw, or a side of macaroni and cheese.` |
| SAND_032 Pulled Pork | `Suggestions (not included): Serve with coleslaw, baked beans, or potato chips.` |
| SAND_033 BBQ Brisket | `Suggestions (not included): Serve with baked beans, coleslaw, or potato chips.` |
| SAND_034 Grilled Chicken | `Suggestions (not included): Serve with french fries, coleslaw, or a side salad.` |
| SAND_035–037 Fried/Buffalo/Nashville Hot Chicken | `Suggestions (not included): Serve with french fries, coleslaw, or pickle chips.` |
| SAND_038 Fish Sandwich | `Suggestions (not included): Serve with french fries, coleslaw, or tartar sauce.` |
| SAND_039 Crab Cake Sandwich | `Suggestions (not included): Serve with coleslaw, a side salad, or french fries.` |
| SAND_040 Lobster Roll | `Suggestions (not included): Serve with potato chips, coleslaw, or a cup of chowder.` |
| SAND_041 Tuna Melt | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_042 French Dip | `Suggestions (not included): Serve with french fries, a side salad, or onion rings.` |
| SAND_043 Italian Beef | `Suggestions (not included): Serve with french fries, giardiniera, or a side salad.` |
| SAND_044 Shrimp Po Boy | `Suggestions (not included): Serve with potato chips, a cup of gumbo, or coleslaw.` |
| SAND_045 Oyster Po Boy | `Suggestions (not included): Serve with potato chips, a cup of gumbo, or coleslaw.` |
| SAND_046 Meatball Sub | `Suggestions (not included): Serve with a side salad, potato chips, or garlic bread.` |
| SAND_047 Italian Sub | `Suggestions (not included): Serve with potato chips, a dill pickle, or a side salad.` |
| SAND_048 Chicken Parm Sub | `Suggestions (not included): Serve with a side salad, garlic bread, or pasta.` |
| SAND_049 Philly Cheesesteak | `Suggestions (not included): Serve with french fries, a side salad, or potato chips.` |
| SAND_050 Banh Mi | `Suggestions (not included): Serve with a cup of pho, pot stickers, or spring rolls.` |
| SAND_051 Caprese | `Suggestions (not included): Serve with a side salad or a cup of soup.` |
| SAND_052 Falafel Pita | `Suggestions (not included): Serve with hummus, tabbouleh, or a side of pickled vegetables.` |
| SAND_053 Gyro | `Suggestions (not included): Serve with Greek fries, tabbouleh, or hummus.` |
| SAND_054 Rachel | `Suggestions (not included): Serve with potato chips, a dill pickle, or a cup of tomato soup.` |
| SAND_055–058 Burger variants | `Suggestions (not included): Serve with french fries, onion rings, or coleslaw.` |
| SAND_059 Mushroom Swiss Burger | `Suggestions (not included): Serve with french fries, onion rings, or a side salad.` |
| SAND_060 BBQ Bacon Burger | `Suggestions (not included): Serve with french fries, onion rings, or coleslaw.` |
| SAND_061 Turkey Burger | `Suggestions (not included): Serve with french fries, a side salad, or sweet potato fries.` |
| SAND_062 Veggie Burger | `Suggestions (not included): Serve with sweet potato fries, a side salad, or coleslaw.` |
| SAND_063–067 Hot Dog variants | `Suggestions (not included): Serve with potato chips, french fries, or coleslaw.` |
| SAND_070 Chicken Caesar Wrap | `Suggestions (not included): Serve with potato chips, a side salad, or fresh fruit.` |
| SAND_071 Fish Wrap | `Suggestions (not included): Serve with potato chips, fresh fruit, or a cup of soup.` |
| SAND_072 Lamb Burger | `Suggestions (not included): Serve with Greek fries, tabbouleh, or a side salad.` |
| SAND_073 Mediterranean Chicken Wrap | `Suggestions (not included): Serve with hummus, tabbouleh, or a side salad.` |
| SAND_074 Bacon Cheeseburger Bites | `Suggestions (not included): Serve as an appetizer with dipping sauces, or alongside french fries and coleslaw.` |
| SAND_075 Pinwheel Sandwiches | `Suggestions (not included): Serve as an appetizer or party snack with dipping sauces or a side salad.` |

---

### SOUP — 3 missing (quick wins)

| Recipe | Suggested text |
|---|---|
| SOUP_001 | Derive from recipe name — "Serve with crusty bread, a side salad, or grilled cheese." |
| SOUP_004 | Derive from recipe name |
| SOUP_010 | Derive from recipe name |

---

### SWEET — 38 missing

General rule: `Suggestions (not included): Serve with [ice cream/whipped cream/coffee/hot tea].`

Examples:
- Chocolate cake → `Serve with a scoop of vanilla ice cream or whipped cream and fresh berries.`
- Cookies → `Serve with a glass of cold milk or hot coffee.`
- Pie → `Serve warm with vanilla ice cream or whipped cream.`
- Cheesecake → `Serve chilled with fresh berries or a fruit compote.`
- Ice cream → `Serve in a cone or bowl with toppings such as hot fudge, caramel, or fresh fruit.`

Derive specific text from each recipe name — these are standard dessert accompaniments.

---

### ENTR — 63 missing

General rule: `Suggestions (not included): Serve with [starch side] and [vegetable side].`

Examples:
- Beef dishes → steamed rice or mashed potatoes + roasted vegetables or salad
- Pasta dishes → garlic bread + salad
- Seafood → lemon wedges + rice or roasted vegetables
- Chicken → mashed potatoes or rice + green salad or roasted vegetables

Derive specific text from each recipe name.

---

## Task 2 — Add Preparation State to `qty_display`

### What this means

Every fresh or raw ingredient must have an explicit prep state in `qty_display`. From `recipe_development.md` §4e:

> **Fresh/raw ingredients**: always include a prep state — active (`chopped`, `minced`, `sliced`, `diced`, `grated`) or explicit no-prep (`whole`, `leaves`, `sprigs`, `wedges`). Never leave a fresh ingredient with just a quantity.

### How to audit a recipe

```bash
python3 recipes_v3/tools/preview_ingredients.py --recipe RECIPE_ID --raw
```

Look for ingredient lines where `qty_display` is **bare measure only** for a fresh/raw ingredient:
- `"2 cloves"` → should be `"2 cloves garlic, minced"` (or just `"2 cloves"` is OK only if the user doesn't need prep info)
- `"1 cup"` for onion → should indicate chopped/diced
- `"3 stalks"` for celery → should say `"3 stalks celery, diced"` (with `display_name_override='celery'` per the celery pattern)

### Key pattern rules (from CLAUDE.md)

1. **Plain noun display names** (garlic, onion, butter): use `"4 cloves garlic, minced"` — dedup fires, no doubling.
2. **Qualifier-suffixed names** (e.g. `"chicken breast, raw"`): use measure-only OR set `display_name_override` with a clean noun.
3. **Adjective-prefixed names** (e.g. `"fresh thyme leaves"`): always measure-only. Never embed the leading adjective.
4. **`celery_raw` special case**: set `display_name_override='celery'` then embed `'celery'` in `qty_display`.
5. **Never use commas in `qty_display`** — always parentheses.

### Edit workflow for `qty_display` fixes

```
1. python3 recipes_v3/tools/preview_ingredients.py --recipe RECIPE_ID --raw
2. Identify bare measures for fresh/raw ingredients
3. Edit recipe_ingredients.csv — use replace_string_in_file with 3 lines of context
4. python3 recipes_v3/tools/preview_ingredients.py --recipe RECIPE_ID    # verify fix
5. python3 recipes_v3/tools/build_all.py --recipe RECIPE_ID
6. python3 recipes_v3/tools/upload.py --recipe RECIPE_ID --commit
7. python3 recipes_v3/tools/generate_bundle.py
8. git add + commit
```

---

## Recommended Work Order for Tomorrow

### Priority 1 — BKFST (15 recipes, exact text already written above)
These are all in CLAUDE.md and well understood. Start here.

### Priority 2 — STOCK + CRUST + SOUP_001/004/010 (14 recipes, exact text already written above)
Quick wins — short, clear component recipes.

### Priority 3 — SAUCE (21 recipes, exact text already written above)
Short component recipes with clear "use in / serve over" patterns.

### Priority 4 — SALAD (24 recipes, exact text already written above)
All follow the same pattern.

### Priority 5 — SAND (71 recipes, bulk of the text already written above)
Many share the same "fries/chips/pickle/salad" boilerplate. Process in batches by sub-type.

### Priority 6 — SIDE (37 recipes)
"Pairs well with" pattern. Derive from recipe name.

### Priority 7 — SWEET (38 recipes)
"Serve with ice cream / whipped cream / coffee" pattern. Derive from recipe name.

### Priority 8 — ENTR (63 recipes — the largest batch)
"Serve with starch + vegetable" pattern. Process in sub-batches by protein type.

### Priority 9 — BVRG (44 recipes)
These may already have a natural "Serve chilled / over ice / etc." pattern from the prior session.

---

## How Each Session Should Flow

```
1. Load this file at start of session — review where we left off
2. Pick the next recipe(s) from the priority list
3. For Suggestions:
   a. Confirm max step_order for the recipe
   b. Write + append + count check
   c. Upload + regenerate bundle + commit
4. For qty_display:
   a. preview_ingredients --raw
   b. Fix bare measures for fresh/raw ingredients
   c. Preview again to verify
   d. Build + upload + regenerate bundle + commit
5. Update this file — mark ✅ for completed items
6. Push at natural stopping points or end of session
```

---

## Progress Tracker

Mark recipes as ✅ when Suggestions step is added and committed.

### BKFST
- [ ] BKFST_002 Biscuits & Gravy
- [ ] BKFST_003 Eggs Benedict
- [ ] BKFST_004 English Muffin
- [ ] BKFST_006 Hollandaise Sauce
- [ ] BKFST_009 Pancakes (buttermilk)
- [ ] BKFST_013 Hash Brown Potatoes
- [ ] BKFST_016 English Muffin (Thomas Style)
- [ ] BKFST_030 Crustless Spinach Quiche
- [ ] BKFST_035 Avocado Toast Tomato & Egg
- [ ] BKFST_040 Bagel & Cream Cheese
- [ ] BKFST_041 Bagel & Lox
- [ ] BKFST_042 Denver Scrambler
- [ ] BKFST_043 Migas without Tortillas
- [ ] BKFST_044 Migas with Tortillas
- [ ] BKFST_045 Yogurt Parfait

### CRUST
- [ ] CRUST_001 Pie Crust Single (Unbaked)
- [ ] CRUST_002 Pie Crust Double (Unbaked)
- [ ] CRUST_003 Pie Crust Single (Pre-baked)
- [ ] CRUST_004 Empanada Dough

### STOCK
- [ ] STOCK_001 through STOCK_007 (all 7)

### SOUP (partial)
- [ ] SOUP_001
- [ ] SOUP_004
- [ ] SOUP_010

### SAUCE
- [ ] SAUCE_001 through SAUCE_027 minus those already done (21 total)

### SALAD
- [ ] SALAD_001 through SALAD_026 minus SALAD_003/004 (24 total)

### SAND
- [ ] SAND_001 through SAND_079 minus SAND_015/066/068/069/076/077/078/079/080 (71 total)

### SIDE
- [ ] SIDE_001 through SIDE_040 minus SIDE_011/017/021 (37 total)

### SWEET
- [ ] SWEET_001 through SWEET_040 minus SWEET_023/025 (38 total)

### ENTR
- [ ] See full list from the audit — 63 recipes across all protein types

### BVRG
- [ ] See full list from the audit — 44 recipes
