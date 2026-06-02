# Sauces & Condiments — Recipe Category Survey

Survey of all sauces and condiments found across the existing recipe corpus (SWEET, BKFST, SAND — 150 recipes). Used to plan the Sauces & Condiments category.

---

## Already-Built Sauce Recipes

These are already in production as named standalone recipes (currently filed under the BKFST category):

| ID | Recipe | NDB / FNDDS | Rule | Notes |
|---|---|---|---|---|
| BKFST_006 | Hollandaise Sauce | FNDDS 81302010 | G | Also used as component in BKFST_003 Eggs Benedict |
| BKFST_012 | Sausage Gravy | FNDDS 27120120 | G | Also used as component in BKFST_002 Biscuits & Gravy |

---

## Sauces Embedded as Named Sections in Existing Recipes

These appear as dedicated preparation sections (not standalone recipes). Each is a candidate for extraction into its own Sauces & Condiments recipe.

| Section Label | Parent Recipe(s) | Cook Method | Ingredients |
|---|---|---|---|
| Sausage gravy | BKFST_002 Biscuits & Gravy | boiled | component_ref → BKFST_012 |
| Hollandaise sauce | BKFST_003 Eggs Benedict | steamed | component_ref → BKFST_006 |
| Open-Faced Roast Beef with Gravy | SAND_017 | boiled | beef_broth_canned + flour + worcestershire_sauce; inline section |
| Au jus | SAND_042 French Dip | raw | beef_broth_canned + tamari |
| Au jus | SAND_043 Italian Beef | raw | beef_broth_canned + herbs (oregano, basil, garlic, red pepper) |
| Remoulade sauce | SAND_044 Shrimp Po' Boy, SAND_045 Oyster Po' Boy | raw | mayo + mustard_yellow + pickle_relish_sweet + hot_sauce_tabasco |

---

## Store-Bought Condiments Used as Ingredients

These are used as-is from a jar/bottle across the corpus. Each could also have a homemade recipe built for the Sauces & Condiments category.

| Ingredient Key | NDB | SR Legacy Description | Recipes Used In | Count |
|---|---|---|---|---|
| `mayonnaise` | 4025 | Salad dressing, mayonnaise, regular | SAND_004–007, 009, 011, 018–023, 032 (slaw), 034–035, 037, 040–041, 044–045, 050, 054, 061–062, 067 | 25 |
| `mustard_yellow` | 2046 | Mustard, prepared, yellow | SAND_006, 013–014, 023, 026–029, 031, 039, 044–045, 055–058, 063–064, 067 | 19 |
| `ketchup` | 11935 | Catsup | SAND_031, 055–058, 063 | 6 |
| `worcestershire_sauce` | 6971 | Sauce, worcestershire | SAND_017, 031, 039, 042 | 4 |
| `pickle_relish_sweet` | 11945 | Pickle relish, sweet | SAND_044–045, 063–064 | 4 |
| `bbq_sauce` | 6150 | Sauce, barbecue | SAND_032 (slaw), 033 (assembly), 060 (assembly) | 3 |
| `apple_cider_vinegar` | 2048 | Vinegar, cider | SAND_032 (slaw), 054 (coleslaw), 067 (coleslaw) | 3 |
| `tartar_sauce` | 27049 | Sauce, tartar, ready-to-serve | SAND_038, 039 | 2 |
| `marinara_sauce` | 6931 | Sauce, pasta, spaghetti/marinara, ready-to-serve | SAND_046, 048 | 2 |
| `hot_sauce` / `hot_sauce_tabasco` | 6169 | Sauce, ready-to-serve, pepper, TABASCO | SAND_036 (buffalo), 044–045 (remoulade) | 3 |
| `tamari` | 16124 | Soy sauce made from soy (tamari) | SAND_042 (au jus), 050 (banh mi pork) | 2 |
| `vinegar_red_wine` | 2068 | Vinegar, red wine | SAND_047 (Italian sub), 050 (banh mi pickles) | 2 |
| `ranch_dressing` | 4639 | Salad dressing, ranch dressing, regular | SAND_036 (buffalo chicken) | 1 |
| `thousand_island_dressing` | 4017 | Salad dressing, thousand island, commercial, regular | SAND_025 (Reuben) | 1 |
| `tahini` | 12166 | Tahini (sesame butter) | SAND_052 (falafel pita) | 1 |
| `balsamic_vinegar` | 2069 | Vinegar, balsamic | SAND_051 (caprese) | 1 |

---

## Embedded Sauces Built Inline (no separate section)

These sauces are cooked into the dish without a dedicated section, but could become standalone recipes:

| Sauce | Parent Recipe | Build Notes |
|---|---|---|
| Sloppy Joe sauce | SAND_031 | beef + onion + bell pepper + ketchup + tomato paste + mustard + worcestershire |
| Buffalo sauce | SAND_036 | hot_sauce (2 tbsp) + butter_salted (1 tbsp) — tossed on fried chicken inline |
| Nashville hot sauce | SAND_037 | butter_salted + red_pepper_flakes (cayenne) + sugar_brown — brushed on fried chicken inline |
| Tzatziki | SAND_053 Gyro | yogurt_greek_whole_milk + cucumber_peeled_raw + dill_fresh + garlic_powder + lemon_juice_raw + salt; raw section |

---

## Candidate Recipes for the Sauces & Condiments Category

Ranked roughly by cross-recipe relevance and culinary importance.

### High Priority (multi-recipe dependencies, classic sauces)

| Recipe | Basis | NDB Candidate | Dietary | Notes |
|---|---|---|---|---|
| BBQ Sauce | Homemade | (none — Rule D) | vegan | Used in 3 SAND recipes; tomato base + vinegar + brown sugar + spices |
| Tartar Sauce | Homemade | (none — Rule D) | veggie | Used in SAND_038, 039; mayo + relish + lemon |
| Remoulade Sauce | Homemade | (none — Rule D) | veggie | Used in SAND_044, 045; mayo + mustard + relish + tabasco |
| Marinara Sauce | Homemade | FNDDS or NDB | vegan | Used in SAND_046, 048; tomatoes + garlic + olive oil + herbs |
| Ranch Dressing | Homemade | (none — Rule D) | veggie | Used in SAND_036; buttermilk + mayo + herbs |
| Thousand Island Dressing | Homemade | NDB 4017 | veggie | Used in SAND_025 Reuben |
| Au Jus | Homemade | (none — Rule D) | all | Used in SAND_042, 043; beef broth base |

### Medium Priority (classic condiments, standalone value)

| Recipe | Basis | NDB Candidate | Dietary | Notes |
|---|---|---|---|---|
| Beef Gravy | Homemade | NDB 6168 | all | Brown gravy; drippings or broth + roux |
| Country (White) Gravy | Homemade | NDB 27040 | veggie | Milk gravy without sausage — base of BKFST_012 |
| Buffalo Sauce | Homemade | (none — Rule D) | veggie | hot sauce + butter; used inline in SAND_036 |
| Nashville Hot Sauce | Homemade | (none — Rule D) | veggie | cayenne + butter + brown sugar + paprika; used inline in SAND_037 |
| Honey Mustard | Homemade | (none — Rule D) | veggie | yellow mustard + honey; classic dipping sauce |
| Cocktail Sauce | Homemade | NDB 27034 | vegan | For seafood; ketchup + horseradish |
| Tzatziki | Homemade | (none — Rule D) | veggie | Used inline in SAND_053 Gyro |
| Béarnaise Sauce | Homemade | (none — Rule D) | veggie | Hollandaise variant with tarragon; steak companion |

### Lower Priority (useful but less cross-recipe demand)

| Recipe | Basis | NDB Candidate | Dietary | Notes |
|---|---|---|---|---|
| Béchamel / White Sauce | Homemade | (none — Rule D) | veggie | Mornay base; used in croque monsieur implicitly |
| Tomato Sauce | Homemade | NDB 11549 | vegan | Simpler than marinara; base sauce |
| Pesto (Basil) | Homemade | (none — Rule D) | veggie | basil + pine nuts + parmesan + olive oil + garlic |
| Homemade Mayonnaise | Homemade | NDB 4025 | veggie | egg yolk + oil + lemon; backbone of many SAND recipes |
| Sriracha Mayo / Aioli | Homemade | (none — Rule D) | veggie | mayo base + sriracha; popular sandwich spread |
| Hummus | Homemade | NDB 16167 | vegan | chickpeas + tahini + lemon + garlic |
| Guacamole | Homemade | NDB 9500 | vegan | avocado + lime + cilantro; BKFST_034/035 adjacent |
| Salsa (Fresh / Pico de Gallo) | Homemade | (none — Rule D) | vegan | tomato + onion + cilantro + jalapeño + lime |
---

## Additional Easily-Homemade Candidates

### Salad Dressings

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Caesar Dressing | veggie | mayo + parmesan + lemon + garlic + worcestershire + anchovy paste | Anchovy makes it `pollo-pesca`; omit for veggie |
| Classic Vinaigrette | vegan | olive oil + red wine vinegar + dijon + garlic + salt | 3:1 oil-to-acid ratio; infinitely variable |
| Balsamic Vinaigrette | vegan | olive oil + balsamic vinegar + dijon + honey + garlic | Honey bumps to veggie |
| Blue Cheese Dressing | veggie | mayo + sour cream + blue cheese crumbles + buttermilk + lemon | Buffalo chicken companion |
| Green Goddess Dressing | veggie | mayo + sour cream + avocado + parsley + chives + tarragon + lemon | California-style; vivid green |
| Italian Dressing | vegan | olive oil + red wine vinegar + garlic + oregano + basil + red pepper flakes | Used as sub/hoagie drizzle |
| Honey Dijon Dressing | veggie | dijon + honey + olive oil + apple cider vinegar | Versatile salad or sandwich spread |

### Dipping Sauces & Spreads

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Garlic Aioli | veggie | mayo + roasted garlic + lemon juice + olive oil | Elevated mayo; fries, sandwiches, seafood |
| Spicy Mayo | veggie | mayo + sriracha (or hot sauce) + lime juice | Sushi, sandwiches, burgers |
| Special Sauce / Burger Sauce | veggie | mayo + ketchup + pickle relish + mustard + vinegar | Big Mac–style; burger and sandwich spread |
| Comeback Sauce | veggie | mayo + ketchup + hot sauce + worcestershire + garlic powder + lemon | Southern dipping sauce (Mississippi origin) |
| Fry Sauce | veggie | mayo + ketchup + pickle brine | Utah-style; french fry dip |
| Chimichurri | vegan | parsley + garlic + red wine vinegar + olive oil + red pepper flakes | Argentine; grilled meat companion |
| Horseradish Cream | veggie | sour cream + prepared horseradish + lemon + chives | For roast beef, prime rib |
| Nuoc Cham | pesca | fish sauce + lime juice + sugar + garlic + chilies | Vietnamese dipping sauce; banh mi-adjacent |

### Cooking Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Alfredo Sauce | veggie | butter + heavy cream + parmesan + garlic | Pasta staple; rich, no tomato |
| Vodka Sauce | veggie | crushed tomatoes + heavy cream + onion + garlic + red pepper flakes | Pink sauce; pasta category |
| Enchilada Sauce (Red) | vegan | ancho/guajillo chili powder + tomato paste + broth + garlic + cumin | Red chile base for enchiladas |
| Teriyaki Sauce | vegan | soy sauce + mirin + sake + sugar + garlic + ginger | Japanese-style glaze; chicken, salmon |
| Honey Garlic Sauce | vegan | honey + soy sauce + garlic + butter + cornstarch | Pan sauce for chicken wings/thighs |
| Orange Sauce | vegan | orange juice + soy sauce + rice vinegar + sugar + garlic + ginger + cornstarch | Chinese-American; orange chicken |
| Sofrito | vegan | tomato + onion + bell pepper + garlic + cilantro + olive oil | Latin base sauce for rice, beans, stews |
| Mango Chutney | vegan | mango + brown sugar + apple cider vinegar + ginger + red onion + spices | British-Indian condiment; pork, chicken, cheese |

### Dessert Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Hot Fudge Sauce | veggie | heavy cream + cocoa powder + sugar + butter + vanilla | Chocolate sundae classic |
| Caramel Sauce | veggie | sugar + butter + heavy cream + vanilla + salt | Dry-method or wet-method; ice cream, cake |
| Strawberry Sauce | vegan | fresh strawberries + sugar + lemon juice | Cooked-down fruit sauce; cheesecake, ice cream |
| Lemon Curd | veggie | egg yolks + lemon juice + lemon zest + sugar + butter | Tart + creamy; fills tarts, layered cakes |
| Crème Anglaise | veggie | egg yolks + heavy cream + sugar + vanilla | Pourable custard sauce; warm cake companion |
| Cranberry Sauce | vegan | fresh cranberries + sugar + orange juice + orange zest | Thanksgiving staple; also turkey sandwiches |
| Applesauce | vegan | apples + sugar + lemon juice + cinnamon | Simple fruit sauce; also pork companion |
| Butterscotch Sauce | veggie | brown sugar + butter + heavy cream + vanilla + salt | Ice cream, bread pudding |
| Raspberry Coulis | vegan | raspberries + sugar + lemon juice | Strained smooth fruit sauce; cheesecakes, plated desserts |
| Blueberry Sauce | vegan | blueberries + sugar + lemon juice + cornstarch | Pancake syrup or cheesecake topping |
| Chocolate Ganache | veggie | heavy cream + dark chocolate | Glaze, truffle base, layer cake filling |
| Dulce de Leche | veggie | sweetened condensed milk (slow-cooked) | Argentine caramel; crepes, ice cream, cookies |

### Gravies & Pan Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Turkey Gravy | all | turkey drippings + flour + broth | Thanksgiving centerpiece |
| Chicken Gravy | all | chicken drippings or broth + flour + butter | Roast chicken, mashed potatoes |
| Pork Gravy | all | pork drippings + flour + broth + thyme | Roast pork companion |
| Mushroom Gravy | vegan | mushrooms + onion + vegetable broth + flour + thyme | Vegan gravy; also steak companion |
| Onion Gravy | vegan | caramelized onions + vegetable or beef broth + flour + thyme | Classic British style; sausages, bangers & mash |
| Pan Sauce (Red Wine) | all | pan drippings + shallots + red wine + beef broth + butter | French-style; steak and roasts |
| Pan Sauce (Lemon-Butter) | veggie | pan drippings + lemon juice + butter + capers + parsley | Piccata-style; chicken, fish, veal |
| Cream Pan Sauce | veggie | pan drippings + shallots + white wine + heavy cream + thyme | Pork tenderloin, chicken breasts |

### Compound Butters & Simple Spreads

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Garlic Herb Butter | veggie | butter + roasted garlic + parsley + chives + salt | Steak topper, bread spread, corn |
| Honey Butter | veggie | butter + honey + cinnamon | Cornbread, biscuits, waffles |
| Lemon Herb Butter | veggie | butter + lemon zest + dill + parsley | Fish and seafood companion |
| Blue Cheese Butter | veggie | butter + blue cheese + chives | Buffalo steak, burgers |
| Sundried Tomato Butter | veggie | butter + sundried tomatoes + basil + garlic | Pasta, grilled chicken, crostini |
| Whipped Ricotta Spread | veggie | ricotta + lemon zest + olive oil + honey | Crostini, flatbread, bruschetta |

### Pickles, Relishes & Chutneys

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Quick Pickled Red Onions | vegan | red onion + apple cider vinegar + sugar + salt | Tacos, sandwiches, salads; ready in 30 min |
| Bread and Butter Pickles | vegan | cucumbers + onion + apple cider vinegar + sugar + celery seed + turmeric | Sweet pickles; burger topping |
| Homemade Dill Pickles | vegan | cucumbers + dill + garlic + white vinegar + salt | Classic brined pickle |
| Corn Relish | vegan | corn + bell pepper + onion + apple cider vinegar + sugar + mustard seed | Grilled meats, hot dogs |
| Tomato Chutney | vegan | tomatoes + onion + apple cider vinegar + sugar + ginger + spices | Indian-style; grilled meats, cheese |
| Jalapeño Jam | vegan | jalapeños + sugar + apple cider vinegar + pectin | Sweet heat; cream cheese spread, pork companion |
| Onion Jam | vegan | onions + brown sugar + red wine vinegar + thyme + butter | Burger topping, cheese board accompaniment |

### Asian-Style Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Sweet and Sour Sauce | vegan | pineapple juice + rice vinegar + ketchup + sugar + cornstarch | Chinese-American; egg rolls, fried pork |
| General Tso's Sauce | vegan | soy sauce + rice vinegar + sugar + hoisin + garlic + ginger + cornstarch + red pepper | Classic Chinese-American stir-fry sauce |
| Kung Pao Sauce | vegan | soy sauce + rice vinegar + sugar + sesame oil + cornstarch + dried chilies | Szechuan-style; chicken, shrimp, tofu |
| Oyster Sauce (from scratch) | pesca | oyster liquid + soy sauce + sugar + cornstarch | Cantonese base; stir-fries, braises |
| Peanut Sauce | vegan | peanut butter + soy sauce + lime juice + garlic + ginger + sesame oil + coconut milk | Thai-style; satay, rice noodles, spring rolls |
| Gochujang Sauce | vegan | gochujang + sesame oil + soy sauce + garlic + sugar + rice vinegar | Korean; bibimbap, Korean chicken |
| Ponzu | pesca | citrus juice (yuzu or lemon) + soy sauce + mirin + rice vinegar + dashi | Japanese dipping sauce; sashimi, grilled meats |
| Hoisin Sauce (homemade) | vegan | black bean paste + soy sauce + honey + sesame oil + garlic + five spice | Chinese; Peking duck, moo shu wraps |

### BBQ & Grilling Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Kansas City BBQ Sauce | vegan | ketchup + brown sugar + molasses + apple cider vinegar + worcestershire + spices | Thick, sweet, tomato-based |
| Carolina Vinegar BBQ Sauce | vegan | apple cider vinegar + red pepper flakes + sugar + salt + black pepper | Thin, tangy; Eastern NC style; pulled pork |
| Alabama White BBQ Sauce | veggie | mayo + apple cider vinegar + horseradish + lemon + black pepper | White sauce; smoked chicken |
| Texas Mop Sauce | all | beef broth + butter + worcestershire + hot sauce + apple cider vinegar | Basting sauce; beef brisket |
| Dry Rub (Memphis Style) | vegan | paprika + brown sugar + garlic powder + onion powder + cayenne + cumin + salt + pepper | Technically a rub but forms a crust/bark that acts as a sauce surface |
| Bourbon Glaze | vegan | bourbon + brown sugar + soy sauce + garlic + ginger | Ribs, chicken wings, salmon |

---

## Classical French Sauces (Peterson / Escoffier Tradition)

### Mother Sauces & Their Derivatives

**Espagnole (Brown Mother Sauce) family:**

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Espagnole | all | veal stock + mirepoix + tomato paste + roux + bouquet garni | Classic brown mother sauce; base for all derivatives |
| Demi-glace | all | espagnole + veal stock (1:1 reduction) | Rich, glossy, concentrated; base for most brown sauces |
| Jus de Veau Lié | all | veal stock + cornstarch or arrowroot | Lighter alternative to demi-glace; modern restaurant style |
| Bordelaise | all | demi-glace + red wine + shallots + thyme + bone marrow | Red wine sauce; steak classic |
| Périgueux | all | demi-glace + Madeira + black truffles | Truffle sauce; filet mignon, tournedos |
| Robert | all | demi-glace + onion + white wine + mustard | Mustard-finished brown sauce; pork |
| Charcutière | all | Robert sauce + julienned cornichons | Pork chops and grilled meats |
| Madeira Sauce | all | demi-glace + Madeira wine | Ham, veal, roasted meats |
| Chasseur (Hunter's Sauce) | all | demi-glace + mushrooms + shallots + tomatoes + white wine + tarragon | Chicken, veal, rabbit |
| Lyonnaise | all | demi-glace + caramelized onions + white wine vinegar | Onion-forward; sautéed meats, offal |

**Velouté (White Stock Mother Sauce) family:**

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Velouté | all | white stock (chicken/veal/fish) + blond roux | White mother sauce; base for cream derivatives |
| Allemande (Parisienne) | all | veal velouté + egg yolks + cream + lemon | Enriched velouté; veal, chicken |
| Suprême | all | chicken velouté + heavy cream + butter | Rich chicken sauce; classic French poultry dish |
| Normande | pesca | fish velouté + cream + mushroom liquid + egg yolks | Fish and shellfish; sole, scallops |
| Aurore | all | velouté or béchamel + tomato purée | Pink-tinted; eggs, chicken, veal |

**Béchamel (Milk Mother Sauce) family:**

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Mornay | veggie | béchamel + gruyère + parmesan | Cheese sauce; gratin, croque monsieur, pasta |
| Soubise | veggie | béchamel + onion purée + cream | Onion cream sauce; lamb, veal, eggs |
| Nantua | pesca | béchamel + crayfish butter + cream | Pink shellfish cream sauce; quenelles, eggs |

### Hollandaise & Béarnaise Family

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Choron | veggie | béarnaise + tomato purée | Red-tinted béarnaise; grilled fish, veal |
| Foyot (Valois) | veggie | béarnaise + meat glaze (glace de viande) | Richer béarnaise variant; grilled meats |
| Maltaise | veggie | hollandaise + blood orange juice + zest | Citrus hollandaise; asparagus |
| Paloise | veggie | béarnaise with fresh mint instead of tarragon | Mint-forward; lamb |

### Cold Egg-Based Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Gribiche | veggie | hard-boiled egg yolks + oil + vinegar + capers + cornichons + herbs | Cold sauce; calf's head, cold poached fish |
| Ravigote (Cold) | veggie | vinaigrette + capers + shallots + parsley + tarragon + chervil | Sharp herb vinaigrette sauce; cold meats, offal |
| Rouille | pesca | garlic + breadcrumbs + saffron + olive oil + chili | Provençal; served with bouillabaisse |

### Butter Sauces (Beurre)

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Beurre Blanc | veggie | shallots + white wine + white wine vinegar + cold butter (mounted) | Emulsified butter sauce; fish, vegetables |
| Beurre Rouge | veggie | shallots + red wine + cold butter (mounted) | Red wine version of beurre blanc; salmon, duck |
| Beurre Nantais | veggie | Muscadet wine + shallots + cold butter | Loire Valley style beurre blanc |
| Beurre Maître d'Hôtel | veggie | butter + parsley + lemon juice + salt | Classic compound butter; steak, fish |

---

## Mediterranean & World Sauces

| Recipe | Dietary | Key Ingredients | Notes |
|---|---|---|---|
| Pistou | vegan | basil + garlic + olive oil (no pine nuts) | Provençal; stirred into soupe au pistou |
| Salsa Verde (Italian) | pesca | parsley + capers + anchovies + garlic + olive oil + lemon | Italian herb sauce; boiled meats, fish |
| Romesco | vegan | roasted red pepper + tomato + almonds + hazelnuts + olive oil + garlic + sherry vinegar | Catalan; grilled fish, vegetables, calçots |
| Chermoula | vegan | cilantro + parsley + garlic + cumin + paprika + preserved lemon + olive oil | North African; fish, chicken, lamb |
| Harissa | vegan | dried hot chilies + garlic + caraway + coriander + olive oil | Tunisian; couscous, merguez, tagine |
| Mole Negro | all | dried chilies + chocolate + tomato + onion + garlic + spices + turkey stock | Oaxacan; complex; turkey, chicken |
| Mole Verde | vegan | tomatillos + pepitas + cilantro + jalapeño + garlic + broth | Green mole; chicken, pork, vegetables |
| Mole Poblano | all | dried chilies + chocolate + tomato + sesame + spices | Pueblan classic; turkey, chicken |
| Tapenade | pesca | black olives + capers + anchovies + garlic + olive oil + lemon | Provençal; spread or sauce; lamb, crostini |
| Sauce Vierge | vegan | olive oil + tomato + lemon + basil + coriander seed | Warm uncooked French sauce; white fish |
| Salmorejo | vegan | tomatoes + stale bread + olive oil + garlic + sherry vinegar | Spanish cold sauce (Córdoba); thicker than gazpacho |