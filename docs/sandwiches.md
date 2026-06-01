# Sandwiches — Canonical Bread Assignment

One bread per sandwich — the most commonly used version.

## On Sliced Bread

| Sandwich | Canonical Bread |
|---|---|
| Grilled Cheese | White |
| BLT | White |
| Club Sandwich | White (toasted) |
| Egg Salad | White |
| Tuna Salad | White |
| Chicken Salad Sandwich | White |
| Ham and Cheese | White |
| Peanut Butter & Jelly | White |
| Pimento Cheese | White |
| Cucumber Tea Sandwich | White (thin, crustless) |
| Croque Monsieur | White (pain de mie) |
| Monte Cristo | White (egg-dipped, pan-fried) |
| Hot Brown | White (open-faced) |
| Open-Faced Roast Beef with Gravy | White (open-faced) |
| Dagwood | White |
| Turkey Sandwich | Whole wheat |
| Turkey & Avocado | Whole wheat |
| Turkey & Avocado | Whole wheat | | Whole wheat |
| Avocado with Sprouts & Tomato | Multigrain |
| Reuben | Rye |
| Pastrami | Rye |
| Corned Beef | Rye |
| Liverwurst | Rye |
| Limburger | Rye |
| Patty Melt | Rye (griddle-toasted) |

## On Buns

| Sandwich | Canonical Bun |
|---|---|
| Sloppy Joe | Hamburger bun |
| Pulled Pork | Hamburger bun |
| Barbecue Brisket | Hamburger bun |
| Grilled Chicken | Hamburger bun |
| Fried Chicken Sandwich | Hamburger bun |
| Buffalo Chicken Sandwich | Hamburger bun |
| Nashville Hot Chicken Sandwich | Hamburger bun |
| Fish Sandwich | Hamburger bun |
| Crab Cake Sandwich | Hamburger bun |
| Lobster Roll | Hot dog bun |

## On Specialty / Artisan Bread

| Sandwich | Canonical Bread | SR Legacy NDB | Notes |
|---|---|---|---|
| French Dip | French roll | 18349 | Rolls, french ✓ |
| Italian Beef (Chicago style) | French roll | 18349 | Rolls, french ✓ |
| Po' Boy (shrimp or oyster) | French bread | 18029 | Bread, French or Vienna ✓ |
| Meatball Sub | Hoagie roll | 18353 | Use ledger key `hoagie_roll` |
| Italian Sub / Hoagie | Hoagie roll | 18353 | Use ledger key `hoagie_roll` |
| Chicken Parm Sub | Hoagie roll | 18353 | Use ledger key `hoagie_roll` |
| Philly Cheesesteak | Hoagie roll | 18353 | Use ledger key `hoagie_roll` |
| Banh Mi Sandwich | French baguette | 18029 | Bread, French or Vienna ✓ |
| Caprese Sandwich | Focaccia | 18973 | Focaccia, Italian flatbread, plain ✓ |
| Croissant Breakfast Sandwich | Croissant | 18239 | Croissants, butter ✓ |

## On Pita

| Sandwich | Canonical Bread | SR Legacy NDB |
|---|---|---|
| Falafel Pita | Pita, white | 18041 |
| Gyro | Pita, white | 18041 |

---

## Burgers (SAND_055+)

All burgers use a hamburger bun. SR Legacy NDB 18350 (Rolls, hamburger or hotdog, plain).

Planned order — build simplest (plain patty) first, composites last:

| ID | Recipe | food_word | dietary_category | Notes |
|---|---|---|---|---|
| SAND_055 | Classic Hamburger | HAMBURGER | all | Classic plain beef patty + bun + ketchup + mustard + pickle + onion; 80/20 ground beef |
| SAND_056 | Cheeseburger | CHEESEBURGER | all | SAND_055 base + American cheese slice |
| SAND_057 | Bacon Cheeseburger | BACONCHEESEBURGER | all | SAND_056 base + bacon |
| SAND_058 | Double Cheeseburger | DOUBLECHEESEBURGER | all | Two patties + two cheese slices; fast-food style |
| SAND_059 | Mushroom Swiss Burger | MUSHROOMSWISSBURGER | all | Beef patty + sautéed mushrooms + Swiss cheese |
| SAND_060 | BBQ Bacon Burger | BBQBACONBURGER | all | Beef patty + BBQ sauce + bacon + cheddar + onion rings |
| SAND_061 | Turkey Burger | TURKEYBURGER | all | Ground turkey patty + bun + lettuce + tomato + mayo |
| SAND_062 | Veggie Burger | VEGGIEBURGER | veggie | Bean/veggie patty + bun + standard toppings |

## Hot Dogs (SAND_063+)

Bun: same NDB 18350 (hamburger/hot dog bun). Frank: SR Legacy NDB 7022 (Frankfurter, beef, unheated).

| ID | Recipe | food_word | dietary_category | Notes |
|---|---|---|---|---|
| SAND_063 | Classic Hot Dog | HOTDOG | all | Beef frank + bun + ketchup + mustard + relish |
| SAND_064 | Chicago Style Hot Dog | CHICAGOSTYLEHOTDOG | all | Beef frank + bun + yellow mustard + sweet relish + tomato + pickle spear + sport peppers + celery salt; no ketchup |
| SAND_065 | Chili Dog | CHILIDOG | all | Beef frank + bun + beef chili + onion + cheddar |
| SAND_066 | Corn Dog | CORNDOG | all | Beef frank dipped in cornmeal batter and deep-fried; no bun |
| SAND_067 | Slaw Dog | SLAWDOG | all | Beef frank + bun + coleslaw + mustard (Southern style) |