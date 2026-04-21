# Live Recipe Data Mismatch Report

Source files compared:
- `src/lib/data/recipes.csv`
- `src/lib/data/recipe_ingredients.csv`
- `src/lib/data/recipe-nutrition.ts`

This report uses the current live workspace files only.

## Summary

- coherent_across_live_files: 44
- missing_ingredients_and_nutrition: 99
- nutrition_mismatched: 1
- partially_aligned: 3
- strongly_mismatched_ingredients_and_nutrition: 18

## Notable Mismatches

- BFAST_001 | Pancakes | ing rows=6 | ingredient anchor=Potatoes hash brown home-prepared | nutrition=Potatoes, hash brown, home-prepared | status=strongly_mismatched_ingredients_and_nutrition
- BFAST_002 | Scrambled Eggs | ing rows=9 | ingredient anchor=Muffins corn prepared from recipe made with low fat 2% milk | nutrition=Muffins, corn, prepared from recipe, made with low fat (2%) milk | status=nutrition_mismatched
- BFAST_003 | Bacon | ing rows=9 | ingredient anchor=Muffins blueberry prepared from recipe made with low fat 2% milk | nutrition=Muffins, blueberry, prepared from recipe, made with low fat (2%) milk | status=strongly_mismatched_ingredients_and_nutrition
- BFAST_004 | French Toast | ing rows=9 | ingredient anchor=Pancakes buttermilk prepared from recipe | nutrition=Pancakes, buttermilk, prepared from recipe | status=strongly_mismatched_ingredients_and_nutrition
- BFAST_005 | Oatmeal | ing rows=10 | ingredient anchor=Pancakes blueberry prepared from recipe | nutrition=Pancakes, blueberry, prepared from recipe | status=strongly_mismatched_ingredients_and_nutrition
- BFAST_006 | Biscuits & Gravy | ing rows=10 | ingredient anchor=Pancakes gluten-free frozen ready-to-heat | nutrition=Pancakes, gluten-free, frozen, ready-to-heat | status=strongly_mismatched_ingredients_and_nutrition
- BFAST_007 | Eggs Benedict | ing rows=8 | ingredient anchor=Pancakes plain prepared from recipe | nutrition=Pancakes, plain, prepared from recipe | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_001 | French Fries | ing rows=5 | ingredient anchor=Biscuits, plain or buttermilk, prepared from recipe | nutrition=Biscuits, plain or buttermilk, prepared from recipe | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_002 | Onion Rings | ing rows=7 | ingredient anchor=Bread, cornbread, prepared from recipe, made with low fat (2%) milk | nutrition=Bread, cornbread, prepared from recipe, made with low fat (2%) milk | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_003 | Coleslaw | ing rows=7 | ingredient anchor=Hush puppies, prepared from recipe | nutrition=Hush puppies, prepared from recipe | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_005 | Potato Salad | ing rows=6 | ingredient anchor=Sauce, pasta, spaghetti/marinara, ready-to-serve | nutrition=Sauce, pasta, spaghetti/marinara, ready-to-serve | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_006 | Corn on the Cob | ing rows=5 | ingredient anchor=Sauce, peanut, made from peanut butter, water, soy sauce | nutrition=Sauce, peanut, made from peanut butter, water, soy sauce | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_007 | Baked Beans | ing rows=5 | ingredient anchor=Potatoes, scalloped, home-prepared with butter | nutrition=Potatoes, scalloped, home-prepared with butter | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_008 | Mac & Cheese | ing rows=7 | ingredient anchor=Restaurant, Chinese, fried rice, without meat | nutrition=Restaurant, Chinese, fried rice, without meat | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_009 | Mashed Potatoes | ing rows=7 | ingredient anchor=Rolls, dinner, plain, commercially prepared (includes brown-and-serve) | nutrition=Rolls, dinner, plain, commercially prepared (includes brown-and-serve) | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_010 | Steamed Broccoli | ing rows=7 | ingredient anchor=Rolls, dinner, sweet | nutrition=Rolls, dinner, sweet | status=strongly_mismatched_ingredients_and_nutrition
- SIDE_011 | Green Beans (cooked) | ing rows=7 | ingredient anchor=Rolls, dinner, wheat | nutrition=Rolls, dinner, wheat | status=strongly_mismatched_ingredients_and_nutrition
- SWEET_007 | Cake Coffee | ing rows=5 | ingredient anchor=Coffeecake, cinnamon with crumb topping, commercially prepared, enriched | nutrition=Coffeecake, cinnamon with crumb topping, commercially prepared, enriched | status=strongly_mismatched_ingredients_and_nutrition
- BEV_001 | Milkshake Choc | ing rows=4 | ingredient anchor=Milk shakes, thick chocolate | nutrition=Milk shakes, thick chocolate | status=strongly_mismatched_ingredients_and_nutrition

## Missing Coverage

- BFAST_008 | Breakfast Burrito | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- BFAST_009 | Breakfast Sandwich | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_001 | BLT | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_002 | Club Sandwich | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_003 | Grilled Cheese | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_004 | Reuben | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_005 | Tuna Salad Sandwich | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_006 | Chicken Salad Sandwich | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_007 | Egg Salad Sandwich | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_008 | Philly Cheesesteak | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- SANDW_009 | Italian Sub | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- BURG_001 | Hamburger | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- BURG_002 | Cheeseburger | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- BURG_003 | Bacon Cheeseburger | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- BURG_004 | Mushroom Swiss Burger | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- BURG_005 | Turkey Burger | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_001 | Fried Chicken (piece) | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_002 | Fried Chicken Dinner | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_003 | Meatloaf (slice) | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_004 | Meatloaf Dinner | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_005 | Roast Chicken Dinner | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_006 | Pot Roast Plate | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_007 | Beef Steak Dinner | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_008 | Pork Chop Dinner | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_009 | Salmon Dinner | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_010 | Chicken Pot Pie | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- AMER_011 | Shrimp & Grits | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- PIZZA_001 | Cheese Pizza | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- PIZZA_002 | Pepperoni Pizza | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- PIZZA_003 | Meat Lovers Pizza | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- PIZZA_004 | Veggie Pizza | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- PIZZA_005 | BBQ Chicken Pizza | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- ITAL_001 | Spaghetti & Meatballs | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- ITAL_002 | Fettuccine Alfredo | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- ITAL_003 | Chicken Parmesan | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- ITAL_004 | Lasagna | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- ITAL_005 | Baked Ziti | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- TEXMX_001 | Ground Beef Taco | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- TEXMX_002 | Chicken Taco | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition
- TEXMX_003 | Beef Burrito | ing rows=0 | nutrition_present=no | status=missing_ingredients_and_nutrition

## Full Table

| recipe_id | recipe_name | ingredient_rows | nutrition | ingredient_overlap | nutrition_overlap | status |
|---|---|---:|---|---:|---:|---|
| BFAST_001 | Pancakes | 6 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BFAST_002 | Scrambled Eggs | 9 | yes | 0.5 | 0.0 | nutrition_mismatched |
| BFAST_003 | Bacon | 9 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BFAST_004 | French Toast | 9 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BFAST_005 | Oatmeal | 10 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BFAST_006 | Biscuits & Gravy | 10 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BFAST_007 | Eggs Benedict | 8 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BFAST_008 | Breakfast Burrito | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| BFAST_009 | Breakfast Sandwich | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_001 | BLT | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_002 | Club Sandwich | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_003 | Grilled Cheese | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_004 | Reuben | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_005 | Tuna Salad Sandwich | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_006 | Chicken Salad Sandwich | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_007 | Egg Salad Sandwich | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_008 | Philly Cheesesteak | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SANDW_009 | Italian Sub | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| BURG_001 | Hamburger | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| BURG_002 | Cheeseburger | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| BURG_003 | Bacon Cheeseburger | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| BURG_004 | Mushroom Swiss Burger | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| BURG_005 | Turkey Burger | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_001 | Fried Chicken (piece) | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_002 | Fried Chicken Dinner | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_003 | Meatloaf (slice) | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_004 | Meatloaf Dinner | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_005 | Roast Chicken Dinner | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_006 | Pot Roast Plate | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_007 | Beef Steak Dinner | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_008 | Pork Chop Dinner | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_009 | Salmon Dinner | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_010 | Chicken Pot Pie | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| AMER_011 | Shrimp & Grits | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| PIZZA_001 | Cheese Pizza | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| PIZZA_002 | Pepperoni Pizza | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| PIZZA_003 | Meat Lovers Pizza | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| PIZZA_004 | Veggie Pizza | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| PIZZA_005 | BBQ Chicken Pizza | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ITAL_001 | Spaghetti & Meatballs | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ITAL_002 | Fettuccine Alfredo | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ITAL_003 | Chicken Parmesan | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ITAL_004 | Lasagna | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ITAL_005 | Baked Ziti | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_001 | Ground Beef Taco | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_002 | Chicken Taco | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_003 | Beef Burrito | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_004 | Chicken Burrito | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_005 | Cheese Quesadilla | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_006 | Chicken Quesadilla | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_007 | Nachos | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_008 | Beef Enchiladas | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_009 | Chicken Fajitas | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_010 | Guacamole & Chips | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| TEXMX_011 | Taco Salad | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_001 | Egg Roll | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_002 | Egg Drop Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_003 | Chicken Fried Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_004 | Pork Fried Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_005 | Shrimp Fried Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_006 | Beef with Broccoli | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_007 | Beef with Broccoli + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_008 | General Tso's Chicken | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_009 | General Tso's Chicken + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_010 | Kung Pao Chicken | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_011 | Kung Pao Chicken + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_012 | Sweet & Sour Pork | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_013 | Sweet & Sour Pork + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_014 | Lo Mein (Chicken) | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_015 | Wonton Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| CHIN_016 | Moo Shu Pork | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_001 | Edamame | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_002 | Miso Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_003 | Miso Soup + Rice | 1 | yes | 0.33 | 0.33 | partially_aligned |
| JAPAN_004 | Teriyaki Chicken | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_005 | Teriyaki Chicken + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_006 | Beef Teriyaki | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_007 | Beef Teriyaki + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_008 | California Roll | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_009 | Shrimp Tempura | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_010 | Shrimp Tempura + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_011 | Ramen Bowl | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_012 | Chicken Katsu | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| JAPAN_013 | Chicken Katsu + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_001 | Pad Thai (Chicken) | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_002 | Pho (Beef) | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_003 | Vietnamese Spring Roll | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_004 | Korean Bibimbap | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_005 | Korean BBQ Beef | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_006 | Korean BBQ Beef + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_007 | Curry Chicken | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_008 | Curry Chicken + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_009 | Thai Green Curry | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| ASIAN_010 | Thai Green Curry + Rice | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_001 | Chicken Noodle Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_002 | Tomato Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_003 | Beef Stew | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_004 | Clam Chowder (New England) | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_005 | French Onion Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_006 | Split Pea Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_007 | Lentil Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_008 | Beef Chili | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_009 | Chili + Cornbread | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_010 | Hot & Sour Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SOUP_011 | Minestrone Soup | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SALAD_001 | Caesar Salad | 7 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SALAD_002 | Chicken Caesar Salad | 8 | yes | 0.33 | 0.33 | partially_aligned |
| SALAD_003 | Cobb Salad | 5 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SALAD_004 | Greek Salad | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SALAD_005 | Chef Salad | 0 | no | 0.0 | 0.0 | missing_ingredients_and_nutrition |
| SIDE_001 | French Fries | 5 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_002 | Onion Rings | 7 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_003 | Coleslaw | 7 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_004 | Macaroni Salad | 5 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SIDE_005 | Potato Salad | 6 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_006 | Corn on the Cob | 5 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_007 | Baked Beans | 5 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_008 | Mac & Cheese | 7 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_009 | Mashed Potatoes | 7 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_010 | Steamed Broccoli | 7 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_011 | Green Beans (cooked) | 7 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SIDE_012 | Cheese Sauce | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_001 | Pie Apple | 3 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_002 | Apple Strudel | 7 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_003 | Cake Angel Food | 5 | yes | 0.33 | 0.33 | partially_aligned |
| SWEET_004 | Cake Cheesecake | 5 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_005 | Cake Chocolate no Frosting | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_006 | Cake Chocolate Frosting | 7 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_007 | Cake Coffee | 5 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| SWEET_008 | Cake Gingerbread | 7 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_009 | Cake Pineapple | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_010 | Cake Pound | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_011 | Cake Shortcake | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_012 | Cake Sponge | 4 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_013 | Cake White no Frosting | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_014 | Cake White Coconut Frosting | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_015 | Cake Yellow Choc Frosting | 7 | yes | 0.75 | 0.75 | coherent_across_live_files |
| SWEET_016 | Cake Yellow Vanilla Frosting | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_017 | Cookies Brownies | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_018 | Cookies Butter | 4 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_019 | Cookies Choc Chip | 5 | yes | 0.67 | 0.67 | coherent_across_live_files |
| SWEET_020 | Cookies Fig Bar | 5 | yes | 0.67 | 0.67 | coherent_across_live_files |
| SWEET_021 | Cookies Gingersnap | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_022 | Cookies Macaroon | 4 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_023 | Cookies Molasses | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_024 | Cookies Oatmeal | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_025 | Cookies Oatmeal Raisin | 6 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_026 | Cookies Peanut Butter | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_027 | Cookies Shortbread | 4 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_028 | Cookies Sugar | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_029 | Doughnut Cake-type Glazed | 5 | yes | 1.0 | 1.0 | coherent_across_live_files |
| SWEET_030 | Pies Banana Cream | 6 | yes | 0.67 | 0.67 | coherent_across_live_files |
| SWEET_031 | Pies Blueberry | 5 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_032 | Pies Boston Cream | 4 | yes | 0.67 | 0.67 | coherent_across_live_files |
| SWEET_033 | Pies Cherry | 3 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_034 | Pies Chocolate | 7 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_035 | Pies Coconut | 5 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_036 | Pies Dutch Apple | 7 | yes | 0.67 | 0.67 | coherent_across_live_files |
| SWEET_037 | Pies Lemon | 6 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_038 | Pies Mince | 6 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_039 | Pies Peach | 4 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_040 | Pies Pecan | 6 | yes | 0.5 | 0.5 | coherent_across_live_files |
| SWEET_041 | Pies Pumpkin | 7 | yes | 0.5 | 0.5 | coherent_across_live_files |
| BEV_001 | Milkshake Choc | 4 | yes | 0.0 | 0.0 | strongly_mismatched_ingredients_and_nutrition |
| BEV_002 | Milkshake Vanilla | 3 | yes | 0.5 | 0.5 | coherent_across_live_files |