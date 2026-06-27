# Prep-in-Instructions Audit
**Generated:** 2026-06-27  
**Issue:** Ingredient prep methods (minced, diced, chopped, sliced, grated, shredded) appear in instruction text but are missing from `qty_display`. Per CLAUDE.md policy, all prep belongs in `qty_display`, not instructions.

**Note on "shredded":** Some hits are for cooked proteins (pulled pork, rotisserie chicken, shredded beef) which are shredded as a cooking step — not a raw-ingredient prep. Review those individually before fixing.

---

| Recipe ID | Recipe Name | Prep patterns missing from qty_display |
|---|---|---|
| BKFST_025 | Cheese Quiche | diced onion |
| BKFST_026 | Spinach Quiche | diced onion |
| BKFST_027 | Ham and Cheese Quiche | diced onion |
| BKFST_028 | Quiche Lorraine | diced onion |
| BKFST_029 | Crustless Quiche | diced onion |
| BKFST_030 | Crustless Spinach Quiche | diced onion |
| BKFST_031 | Crustless Ham and Cheese Quiche | diced onion |
| BKFST_032 | Crustless Quiche Lorraine | diced onion |
| BVRG_007 | Ginger Lemonade | grated ginger |
| ENTR_002 | Beef Asian Noodles | chopped garlic, sliced scallion, thinly sliced |
| ENTR_003 | Beef and Broccoli | minced garlic |
| ENTR_004 | Beef Bolognese | diced onion, finely diced |
| ENTR_005 | Beef Bourguignon | diced onion, minced garlic |
| ENTR_006 | Beef Birria | chopped onion |
| ENTR_007 | Beef Carbonnade | minced garlic, sliced onion, thinly sliced |
| ENTR_008 | Beef Carne Asada | diced onion, minced garlic |
| ENTR_009 | Beef Carne Guisada | diced bell pepper, diced onion, diced tomato, minced garlic |
| ENTR_011 | Beef Cottage Pie | chopped celery, chopped onion, finely chopped, minced garlic |
| ENTR_012 | Beef Churrasco | minced garlic |
| ENTR_013 | Beef Curry | diced onion, diced tomato, minced garlic |
| ENTR_014 | Beef Ropa Vieja | diced tomato, minced garlic, shredded, sliced onion, thinly sliced |
| ENTR_015 | Beef Steak Diane | chopped parsley, minced garlic |
| ENTR_017 | Beef Goulash | sliced onion |
| ENTR_018 | Beef Fajitas | shredded |
| ENTR_021 | Beef Italian Meatballs | diced onion, minced garlic |
| ENTR_026 | Beef Korean Beef | sliced scallion |
| ENTR_028 | Beef Mongolian Beef | sliced scallion |
| ENTR_029 | Beef Osso Buco | chopped garlic, chopped parsley, diced carrot, diced celery, diced onion, finely diced, minced garlic |
| ENTR_030 | Beef Pepper Steak | minced garlic |
| ENTR_031 | Beef Picadillo | diced bell pepper, diced onion, minced garlic |
| ENTR_036 | Beef Salisbury Steak | chopped onion, finely chopped, minced garlic, sliced mushroom |
| ENTR_037 | Beef Short Ribs | diced onion, minced garlic |
| ENTR_038 | Beef Skirt Steak with Marinade | minced garlic |
| ENTR_039 | Beef Stroganoff | minced garlic, sliced mushroom, sliced onion |
| ENTR_041 | Beef Teriyaki | grated ginger, minced garlic |
| ENTR_043 | Beef Stir Fry | grated ginger, minced garlic, sliced mushroom, sliced onion |
| ENTR_044 | Beef Soft Tacos | diced tomato, shredded |
| ENTR_045 | Chicken & Broccoli | grated ginger, minced garlic |
| ENTR_046 | Chicken Cacciatore | diced onion, minced garlic, sliced mushroom |
| ENTR_047 | Chicken Curry | diced onion, grated ginger, minced garlic |
| ENTR_048 | Chicken Enchiladas | diced onion, shredded |
| ENTR_049 | Chicken Florentine | minced garlic |
| ENTR_050 | Chicken Fried Rice | chopped onion, finely chopped, minced garlic |
| ENTR_051 | Chicken General Tso | grated ginger, minced garlic |
| ENTR_052 | Chicken Moo Goo Gai Pan | grated ginger, minced garlic, sliced mushroom |
| ENTR_056 | Chicken King Ranch | shredded |
| ENTR_057 | Chicken Marsala | finely diced, sliced mushroom |
| ENTR_058 | Chicken Masala | chopped tomato, diced onion, finely chopped, finely diced, grated ginger, minced garlic, sliced mushroom |
| ENTR_059 | Chicken Peanut Protein Bowls | grated ginger, minced garlic, sliced scallion |
| ENTR_060 | Chicken Sesame | minced garlic, sliced scallion |
| ENTR_064 | Chicken Korma | chopped onion, grated ginger, minced garlic |
| ENTR_066 | Chicken Scampi | minced garlic |
| ENTR_067 | Chicken Tetrazzini | chopped garlic, chopped onion, finely chopped, shredded, sliced mushroom |
| ENTR_068 | Chicken Tikka Masala | diced onion, finely diced, minced garlic |
| ENTR_069 | Chicken Marry Me | minced garlic |
| ENTR_070 | Lamb Kabobs | minced garlic |
| ENTR_071 | Lamb Kofta | minced garlic |
| ENTR_072 | Lamb Greek Souvlaki | minced garlic |
| ENTR_073 | Lamb Shepherd's Pie | diced onion, minced garlic |
| ENTR_074 | Lamb Rogan Josh | diced onion, grated ginger, minced garlic |
| ENTR_075 | Lamb Tagine | chopped cilantro, chopped parsley, diced onion, grated ginger, minced garlic |
| ENTR_076 | Lamb Moussaka | diced onion, minced garlic |
| ENTR_082 | Pork Carnitas | shredded |
| ENTR_101 | Seafood Salmon Poke Bowl | sliced scallion |
| ENTR_107 | Seafood Tuna Poke Bowl | grated ginger, sliced scallion |
| ENTR_115 | Vegetarian Tofu Nuggets | grated ginger |
| PASTA_002 | Garlic Bread Pizza | chopped parsley, minced garlic |
| PASTA_006 | Chicken Pesto Pasta | finely chopped |
| SALAD_012 | Chicken & Artichoke Pasta Salad | minced garlic |
| SALAD_017 | Ramen Noodle Salad | sliced scallion |
| SALAD_022 | Wedge Salad | diced tomato, sliced scallion |
| SAND_001 | Grilled Cheese Cheddar & Gruyere | shredded |
| SAND_008 | Chicken Salad Sandwich | shredded |
| SAND_012 | Cucumber Tea Sandwich | finely chopped |
| SAND_033 | Barbecue Brisket Sandwich | sliced onion |
| SAND_042 | French Dip | sliced onion |
| SAND_046 | Meatball Sub | shredded |
| SAND_052 | Falafel Pita | chopped parsley |
| SAND_059 | Mushroom Swiss Burger | minced garlic, sliced mushroom |
| SAND_062 | Veggie Burger | minced garlic, minced onion |
| SAND_065 | Chili Dog | chopped onion |
| SAND_068 | Beef Shawarma | chopped parsley, diced tomato, minced garlic, sliced onion |
| SAND_080 | Gorditas | chopped cilantro, diced onion |
| SAUCE_012 | Chili Sauce | diced bell pepper, diced onion |
| SAUCE_016 | Basic Vinaigrette | minced garlic |
| SAUCE_025 | Red Enchilada Sauce | chopped onion, minced garlic |
| SAUCE_027 | Italian Marinara Sauce | diced onion, minced garlic |
| SIDE_005 | Potato Salad (American Style) | diced celery |
| SIDE_006 | Potato Salad (German Style) | sliced onion |
| SIDE_010 | Tartiflette | minced garlic, sliced onion, thinly sliced |
| SIDE_028 | Braised Collard Greens | diced onion, minced garlic |
| SIDE_037 | Roasted Asparagus | minced garlic |
| SIDE_038 | Roasted Brussels Sprouts | minced garlic |
| SIDE_039 | Stuffed Mushrooms | chopped parsley, minced garlic |
| SIDE_040 | Succotash | diced onion |
| SOUP_007 | Tortilla Soup | shredded |
| SOUP_008 | Vegetarian Chili | shredded |
| SOUP_011 | Chili no Beans | diced onion, shredded |
| SOUP_012 | Chili with Beans | diced onion, shredded |
| SOUP_016 | Red Clam Chowder | chopped parsley |
| SOUP_021 | Pozole Rojo | shredded |
| SOUP_022 | Tomato Soup | diced onion |
| SWEET_036 | Cookies, Coconut Macaroon | shredded |

**Total: 103 recipes**

---

## Fix approach (per CLAUDE.md)

For each ingredient with a prep method in the instructions:
1. Update `qty_display` to include the ingredient name + prep — e.g. `"4 cloves garlic, minced"` or `"1 medium onion, diced"`
2. Remove the prep description from the instruction step (the instruction says "Add the garlic", not "Add the minced garlic")
3. Run `upload.py --recipe ID --commit` (no rebuild needed — display-only change)
4. Run `generate_bundle.py` after all uploads

**The dedup guard in `formatIngredientLine` will suppress name doubling** when the ingredient name appears in `qty_display` — follow the natural-English pattern: `"4 cloves garlic, minced"` (includes the noun so dedup fires).
