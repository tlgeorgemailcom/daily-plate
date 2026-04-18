// Auto-generated from recipes.csv, recipe_ingredients.csv, recipe_instructions.csv
// DO NOT EDIT - regenerate with convert_recipes_to_ts.py

export type LinkType = 'ingredient' | 'dish' | 'mixed';
export type RowType  = 'dish' | 'ingredient' | 'dish_ingredient' | 'exempt';
export type RecipeStatus = 'todo' | 'draft' | 'review' | 'published';

export interface RecipeIngredient {
  row_order?: number;
  row_type: RowType;
  ing_name?: string;   // optional — row_type='dish' reference rows have no ingredient name
  ing_qty?: string;
  sr28_long_desc?: string;
  ndb_no?: string;
  portion_desc?: string;
  portion_grams?: number;
  serving_count?: number;
  notes?: string;
  game_food?: string;
  animal?: string;
}

export interface RecipeInstruction {
  step_order: number;
  step_text: string;
}

export interface Recipe {
  recipe_id: string;
  food_word?: string;       // word key in food-portions-complete.csv (blank for ingredient-only recipes)
  recipe_name: string;
  category: string;
  dietary_category: string;
  link_type: LinkType;
  prep_time?: string;
  servings?: string;
  sr28_rule?: string;
  sr28_notes?: string;
  status: RecipeStatus;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}

export const RECIPES: Recipe[] = [
  {
    "recipe_id": "SWEET_001",
    "food_word": "APPLEPIE",
    "recipe_name": "Pie Apple",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, apple, commercially prepared, enriched flour",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, apple, commercially prepared, enriched flour",
        "ndb_no": "18301",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "double-crust apple pie, 8 slices"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie crust, frozen, baked",
        "ing_qty": "2 crusts / 8",
        "sr28_long_desc": "Pie crust, standard-type, frozen, ready-to-bake, enriched, baked",
        "ndb_no": "18335",
        "portion_desc": "custom (g)",
        "portion_grams": 38.0,
        "serving_count": 1.0,
        "notes": "batch: 2\u00d7154g / 8"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "apple pie filling, canned",
        "ing_qty": "600g filling / 8",
        "sr28_long_desc": "Pie fillings, apple, canned",
        "ndb_no": "19312",
        "portion_desc": "custom (g)",
        "portion_grams": 75.0,
        "serving_count": 1.0,
        "notes": "batch: 600g / 8"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_002",
    "food_word": "APPLESTRUDEL",
    "recipe_name": "Apple Strudel",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Strudel, apple",
        "ing_qty": "1 piece (71g)",
        "sr28_long_desc": "Strudel, apple",
        "ndb_no": "18354",
        "portion_desc": "custom (g)",
        "portion_grams": 71.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "strudel, apple",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Strudel, apple",
        "ndb_no": "18354",
        "portion_desc": "custom (g)",
        "portion_grams": 71.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_001",
    "food_word": "BEEFPOTPIE",
    "recipe_name": "Beef Pot Pie",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Beef Pot Pie frozen entree prepared",
        "ndb_no": "22529",
        "portion_desc": "1 pie cooked (average weight)",
        "portion_grams": 268.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "BEEFPOTPIE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie crust baked",
        "ing_qty": "portion",
        "sr28_long_desc": "Pie crust, standard-type, frozen, ready-to-bake, enriched, baked",
        "ndb_no": "18335",
        "portion_desc": "custom (g)",
        "portion_grams": 78.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "beef bottom round braised",
        "ing_qty": "1.5 oz",
        "sr28_long_desc": "Beef, round, bottom round, steak, separable lean only, trimmed to 0\" fat, all grades, cooked, braised",
        "ndb_no": "13407",
        "portion_desc": "custom (g)",
        "portion_grams": 39.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "peas green cooked",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Peas, green, cooked, boiled, drained, without salt",
        "ndb_no": "11305",
        "portion_desc": "custom (g)",
        "portion_grams": 38.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "potato boiled",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Potatoes, boiled, cooked without skin, flesh, without salt",
        "ndb_no": "11367",
        "portion_desc": "custom (g)",
        "portion_grams": 56.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "beef gravy canned",
        "ing_qty": "4 tbsp",
        "sr28_long_desc": "Gravy, beef, canned, ready-to-serve",
        "ndb_no": "6116",
        "portion_desc": "custom (g)",
        "portion_grams": 57.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_002",
    "food_word": "BEEFSTEW",
    "recipe_name": "Beef Stew",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "90 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Beef stew canned entree",
        "ndb_no": "22905",
        "portion_desc": "1 cup (1 serving)",
        "portion_grams": 196.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "BEEFSTEW"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "beef bottom round braised",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Beef, round, bottom round, steak, separable lean only, trimmed to 0\" fat, all grades, cooked, braised",
        "ndb_no": "13407",
        "portion_desc": "custom (g)",
        "portion_grams": 50.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "potato boiled",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Potatoes, boiled, cooked without skin, flesh, without salt",
        "ndb_no": "11367",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "carrots cooked",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Carrots, cooked, boiled, drained, without salt",
        "ndb_no": "11125",
        "portion_desc": "custom (g)",
        "portion_grams": 35.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "onion cooked",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Onions, cooked, boiled, drained, without salt",
        "ndb_no": "11283",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "beef gravy canned",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Gravy, beef, canned, ready-to-serve",
        "ndb_no": "6116",
        "portion_desc": "custom (g)",
        "portion_grams": 31.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_001",
    "food_word": "BISCUIT",
    "recipe_name": "Biscuit",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "12 biscuits",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "DINR_003",
    "food_word": "BURRITO",
    "recipe_name": "Burrito Beef Bean",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods burrito with beans and beef",
        "ndb_no": "21063",
        "portion_desc": "1 item",
        "portion_grams": 241.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "BURRITO"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "flour tortilla",
        "ing_qty": "1 large",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
        "ndb_no": "18364",
        "portion_desc": "custom (g)",
        "portion_grams": 37.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ground beef 90/10 cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Beef, ground, 90% lean meat / 10% fat, loaf, cooked, baked",
        "ndb_no": "23566",
        "portion_desc": "custom (g)",
        "portion_grams": 86.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "refried beans canned",
        "ing_qty": "6 tbsp",
        "sr28_long_desc": "Refried beans, canned, traditional style (includes USDA commodity)",
        "ndb_no": "16103",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "2/3 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 18.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_004",
    "food_word": "BURRITOBEANCHEESE",
    "recipe_name": "Burrito Bean Cheese",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Burrito bean and cheese frozen",
        "ndb_no": "22918",
        "portion_desc": "1 burrito",
        "portion_grams": 129.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "BURRITOBEANCHEESE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "flour tortilla",
        "ing_qty": "1 medium",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
        "ndb_no": "18364",
        "portion_desc": "custom (g)",
        "portion_grams": 36.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "refried beans canned",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Refried beans, canned, traditional style (includes USDA commodity)",
        "ndb_no": "16103",
        "portion_desc": "custom (g)",
        "portion_grams": 64.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 29.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_005",
    "food_word": "BURRITOBEANCHEESEBEEF",
    "recipe_name": "Burrito Bean Cheese Beef",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods burrito with beans cheese and beef",
        "ndb_no": "21064",
        "portion_desc": "1 burrito",
        "portion_grams": 241.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "BURRITOBEANCHEESEBEEF"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "flour tortilla",
        "ing_qty": "2 medium",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
        "ndb_no": "18364",
        "portion_desc": "custom (g)",
        "portion_grams": 51.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ground beef 90/10 cooked",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Beef, ground, 90% lean meat / 10% fat, loaf, cooked, baked",
        "ndb_no": "23566",
        "portion_desc": "custom (g)",
        "portion_grams": 66.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "refried beans canned",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Refried beans, canned, traditional style (includes USDA commodity)",
        "ndb_no": "16103",
        "portion_desc": "custom (g)",
        "portion_grams": 116.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "1/4 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 8.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_006",
    "food_word": "BURRITOBEANS",
    "recipe_name": "Burrito Bean",
    "category": "Dinner",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods burrito with beans",
        "ndb_no": "21060",
        "portion_desc": "2 pieces",
        "portion_grams": 217.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "BURRITOBEANS"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "flour tortilla",
        "ing_qty": "2 medium",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
        "ndb_no": "18364",
        "portion_desc": "custom (g)",
        "portion_grams": 115.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "refried beans canned",
        "ing_qty": "6 tbsp",
        "sr28_long_desc": "Refried beans, canned, traditional style (includes USDA commodity)",
        "ndb_no": "16103",
        "portion_desc": "custom (g)",
        "portion_grams": 102.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_003",
    "food_word": "CAKEANGELFOOD",
    "recipe_name": "Cake Angel Food",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, angelfood, commercially prepared",
        "ing_qty": "1 piece (1/12 of 12oz cake)",
        "sr28_long_desc": "Cake, angelfood, commercially prepared",
        "ndb_no": "18086",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, angelfood, commercially prepared",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, angelfood, commercially prepared",
        "ndb_no": "18086",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_004",
    "food_word": "CAKECHEESECAKE",
    "recipe_name": "Cake Cheesecake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cheesecake commercially prepared",
        "ing_qty": "1 slice (1/12 of 9\" cheesecake)",
        "sr28_long_desc": "Cheesecake commercially prepared",
        "ndb_no": "18147",
        "portion_desc": "custom (g)",
        "portion_grams": 112.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cheesecake commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Cheesecake commercially prepared",
        "ndb_no": "18147",
        "portion_desc": "custom (g)",
        "portion_grams": 112.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_005",
    "food_word": "CAKECHOCOLATE",
    "recipe_name": "Cake Chocolate no Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "35 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, chocolate, prepared from recipe without frosting",
        "ing_qty": "1 piece (1/12 of 9\" dia)",
        "sr28_long_desc": "Cake, chocolate, prepared from recipe without frosting",
        "ndb_no": "18101",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, chocolate, prepared from recipe without frosting",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, chocolate, prepared from recipe without frosting",
        "ndb_no": "18101",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_006",
    "food_word": "CAKECHOCOLATEFROSTING",
    "recipe_name": "Cake Chocolate Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, chocolate, commercially prepared with chocolate frosting, in-store bakery",
        "ing_qty": "1 piece (1/12 of cake)",
        "sr28_long_desc": "Cake, chocolate, commercially prepared with chocolate frosting, in-store bakery",
        "ndb_no": "18096",
        "portion_desc": "custom (g)",
        "portion_grams": 138.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, chocolate, commercially prepared with chocolate frosting",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, chocolate, commercially prepared with chocolate frosting, in-store bakery",
        "ndb_no": "18096",
        "portion_desc": "custom (g)",
        "portion_grams": 138.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_007",
    "food_word": "CAKECOFFEECAKE",
    "recipe_name": "Cake Coffee",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "40 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Coffeecake, cinnamon with crumb topping, commercially prepared, enriched",
        "ing_qty": "1 individual cake (57g)",
        "sr28_long_desc": "Coffeecake, cinnamon with crumb topping, commercially prepared, enriched",
        "ndb_no": "18104",
        "portion_desc": "custom (g)",
        "portion_grams": 57.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "coffeecake, cinnamon with crumb topping, commercially prepared",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Coffeecake, cinnamon with crumb topping, commercially prepared, enriched",
        "ndb_no": "18104",
        "portion_desc": "custom (g)",
        "portion_grams": 57.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_008",
    "food_word": "CAKEGINGERBREAD",
    "recipe_name": "Cake Gingerbread",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "40 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, gingerbread, prepared from recipe",
        "ing_qty": "1 piece (~74g)",
        "sr28_long_desc": "Cake, gingerbread, prepared from recipe",
        "ndb_no": "18116",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, gingerbread, prepared from recipe",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, gingerbread, prepared from recipe",
        "ndb_no": "18116",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_009",
    "food_word": "CAKEPINEAPPLE",
    "recipe_name": "Cake Pineapple",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, pineapple upside-down, prepared from recipe",
        "ing_qty": "1 piece (1/8 of 9\" round)",
        "sr28_long_desc": "Cake, pineapple upside-down, prepared from recipe",
        "ndb_no": "18119",
        "portion_desc": "custom (g)",
        "portion_grams": 115.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, pineapple upside-down, prepared from recipe",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, pineapple upside-down, prepared from recipe",
        "ndb_no": "18119",
        "portion_desc": "custom (g)",
        "portion_grams": 115.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_010",
    "food_word": "CAKEPOUND",
    "recipe_name": "Cake Pound",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, pound, commercially prepared, butter (includes fresh and frozen)",
        "ing_qty": "1 slice (1/6 of loaf)",
        "sr28_long_desc": "Cake, pound, commercially prepared, butter (includes fresh and frozen)",
        "ndb_no": "18120",
        "portion_desc": "custom (g)",
        "portion_grams": 61.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, pound, commercially prepared, butter",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Cake, pound, commercially prepared, butter (includes fresh and frozen)",
        "ndb_no": "18120",
        "portion_desc": "custom (g)",
        "portion_grams": 61.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_011",
    "food_word": "CAKESHORTCAKE",
    "recipe_name": "Cake Shortcake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "8 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, shortcake, biscuit-type, prepared from recipe",
        "ing_qty": "1 biscuit (~65g)",
        "sr28_long_desc": "Cake, shortcake, biscuit-type, prepared from recipe",
        "ndb_no": "18126",
        "portion_desc": "custom (g)",
        "portion_grams": 65.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, shortcake, biscuit-type, prepared from recipe",
        "ing_qty": "1 biscuit",
        "sr28_long_desc": "Cake, shortcake, biscuit-type, prepared from recipe",
        "ndb_no": "18126",
        "portion_desc": "custom (g)",
        "portion_grams": 65.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_012",
    "food_word": "CAKESPONGE",
    "recipe_name": "Cake Sponge",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "40 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, sponge, commercially prepared",
        "ing_qty": "1 piece (1/12 of 10\" cake)",
        "sr28_long_desc": "Cake, sponge, commercially prepared",
        "ndb_no": "18133",
        "portion_desc": "custom (g)",
        "portion_grams": 63.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, sponge, commercially prepared",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, sponge, commercially prepared",
        "ndb_no": "18133",
        "portion_desc": "custom (g)",
        "portion_grams": 63.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_013",
    "food_word": "CAKEWHITE",
    "recipe_name": "Cake White no Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "35 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, white, prepared from recipe without frosting",
        "ing_qty": "1 piece (1/12 of 9\" dia)",
        "sr28_long_desc": "Cake, white, prepared from recipe without frosting",
        "ndb_no": "18139",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, white, prepared from recipe without frosting",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, white, prepared from recipe without frosting",
        "ndb_no": "18139",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_014",
    "food_word": "CAKEWHITECOCONUTFROSTING",
    "recipe_name": "Cake White Coconut Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, white, prepared from recipe with coconut frosting",
        "ing_qty": "1 piece (~95g)",
        "sr28_long_desc": "Cake, white, prepared from recipe with coconut frosting",
        "ndb_no": "18102",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, white, prepared from recipe with coconut frosting",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, white, prepared from recipe with coconut frosting",
        "ndb_no": "18102",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_015",
    "food_word": "CAKEYELLOWCHOCOLATEFROSTING",
    "recipe_name": "Cake Yellow Choc Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, yellow, commercially prepared, with chocolate frosting, in-store bakery",
        "ing_qty": "1 piece (1/12 of cake)",
        "sr28_long_desc": "Cake, yellow, commercially prepared, with chocolate frosting, in-store bakery",
        "ndb_no": "18140",
        "portion_desc": "custom (g)",
        "portion_grams": 144.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, yellow, commercially prepared, with chocolate frosting",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Cake, yellow, commercially prepared, with chocolate frosting, in-store bakery",
        "ndb_no": "18140",
        "portion_desc": "custom (g)",
        "portion_grams": 144.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_016",
    "food_word": "CAKEYELLOWFROSTING",
    "recipe_name": "Cake Yellow Vanilla Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "12 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, yellow, commercially prepared, with vanilla frosting",
        "ing_qty": "1 serving (67g)",
        "sr28_long_desc": "Cake, yellow, commercially prepared, with vanilla frosting",
        "ndb_no": "18141",
        "portion_desc": "custom (g)",
        "portion_grams": 67.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cake, yellow, commercially prepared, with vanilla frosting",
        "ing_qty": "1 serving",
        "sr28_long_desc": "Cake, yellow, commercially prepared, with vanilla frosting",
        "ndb_no": "18141",
        "portion_desc": "custom (g)",
        "portion_grams": 67.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_001",
    "food_word": "CHEESEBURGER",
    "recipe_name": "Cheeseburger",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods cheeseburger single regular patty with condiments and vegetables",
        "ndb_no": "21091",
        "portion_desc": "1 sandwich",
        "portion_grams": 115.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "hamburger bun",
        "ing_qty": "1 bun",
        "sr28_long_desc": "Rolls hamburger or hotdog plain",
        "ndb_no": "18350",
        "portion_desc": "1 roll",
        "portion_grams": 44.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "beef patty cooked",
        "ing_qty": "1 patty",
        "sr28_long_desc": "Beef ground 70% lean meat / 30% fat patty cooked pan-broiled",
        "ndb_no": "13496",
        "portion_desc": "custom (g)",
        "portion_grams": 43.0,
        "serving_count": 1.0,
        "notes": "Regular fast food patty approx 1.5 oz cooked",
        "animal": "beef"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "American cheese",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Cheese pasteurized process American fortified with vitamin D",
        "ndb_no": "1042",
        "portion_desc": "custom (g)",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "Fast food slice approx 14g"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ketchup",
        "ing_qty": "1 tsp",
        "sr28_long_desc": "Catsup",
        "ndb_no": "11935",
        "portion_desc": "1 tsp",
        "portion_grams": 5.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "mustard",
        "ing_qty": "0.5 tsp",
        "sr28_long_desc": "Mustard prepared yellow",
        "ndb_no": "2046",
        "portion_desc": "custom (g)",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "dill pickle slices",
        "ing_qty": "3 slices",
        "sr28_long_desc": "Pickles cucumber dill or kosher dill",
        "ndb_no": "11937",
        "portion_desc": "custom (g)",
        "portion_grams": 4.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "onion",
        "ing_qty": "1 tsp chopped",
        "sr28_long_desc": "Onions raw",
        "ndb_no": "11282",
        "portion_desc": "custom (g)",
        "portion_grams": 3.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_007",
    "food_word": "CHICKENPARMESAN",
    "recipe_name": "Chicken Parmesan",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "40 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "sr28_notes": "SR28 restaurant entry without pasta - note in recipe",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Italian chicken parmesan without pasta",
        "ndb_no": "36059",
        "portion_desc": "1 serving",
        "portion_grams": 301.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "CHICKENPARMESAN"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "chicken breast fried flour",
        "ing_qty": "5.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, flour",
        "ndb_no": "5059",
        "portion_desc": "custom (g)",
        "portion_grams": 160.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "mozzarella whole milk",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Cheese, mozzarella, whole milk",
        "ndb_no": "1026",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "pasta cooked enriched",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Pasta, cooked, enriched, with added salt",
        "ndb_no": "20321",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "marinara sauce",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Sauce, pasta, spaghetti/marinara, ready-to-serve",
        "ndb_no": "6931",
        "portion_desc": "custom (g)",
        "portion_grams": 31.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_008",
    "food_word": "CHICKENPOTPIE",
    "recipe_name": "Chicken Pot Pie",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Chicken pot pie frozen entree prepared",
        "ndb_no": "22906",
        "portion_desc": "1 pie",
        "portion_grams": 302.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "CHICKENPOTPIE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie crust baked",
        "ing_qty": "portion",
        "sr28_long_desc": "Pie crust, standard-type, frozen, ready-to-bake, enriched, baked",
        "ndb_no": "18335",
        "portion_desc": "custom (g)",
        "portion_grams": 73.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "chicken breast roasted",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        "ndb_no": "5064",
        "portion_desc": "custom (g)",
        "portion_grams": 77.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "peas green cooked",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Peas, green, cooked, boiled, drained, without salt",
        "ndb_no": "11305",
        "portion_desc": "custom (g)",
        "portion_grams": 61.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "potato boiled",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Potatoes, boiled, cooked without skin, flesh, without salt",
        "ndb_no": "11367",
        "portion_desc": "custom (g)",
        "portion_grams": 61.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "chicken gravy canned",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Gravy, chicken, canned or bottled, ready-to-serve",
        "ndb_no": "6119",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_009",
    "food_word": "CHICKENRICE",
    "recipe_name": "Chicken Rice",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Latino chicken and rice entree prepared",
        "ndb_no": "36401",
        "portion_desc": "1 cup",
        "portion_grams": 141.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "CHICKENRICE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 88.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "chicken breast roasted",
        "ing_qty": "1.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        "ndb_no": "5064",
        "portion_desc": "custom (g)",
        "portion_grams": 47.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "olive oil",
        "ing_qty": "1 tsp",
        "sr28_long_desc": "Oil, olive, salad or cooking",
        "ndb_no": "4053",
        "portion_desc": "custom (g)",
        "portion_grams": 6.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_010",
    "food_word": "CHICKENSESAME",
    "recipe_name": "Chicken Sesame",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese sesame chicken",
        "ndb_no": "36633",
        "portion_desc": "1 order",
        "portion_grams": 547.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHICKENSESAME"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "fried chicken batter",
        "ing_qty": "6.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, batter",
        "ndb_no": "5058",
        "portion_desc": "custom (g)",
        "portion_grams": 185.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "4 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "Sesame sauce sweetener"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "6 tbsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "Stir-fry and sauce oil"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 90.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 15.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 112.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_011",
    "food_word": "CHILI",
    "recipe_name": "Chili",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Chili con carne with beans canned entree",
        "ndb_no": "22904",
        "portion_desc": "1 cup",
        "portion_grams": 242.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "CHILI"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "ground beef 80/20 cooked",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Beef, ground, 80% lean meat / 20% fat, loaf, cooked, baked",
        "ndb_no": "23576",
        "portion_desc": "custom (g)",
        "portion_grams": 50.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "kidney beans cooked",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Beans, kidney, red, mature seeds, cooked, boiled, without salt",
        "ndb_no": "16033",
        "portion_desc": "custom (g)",
        "portion_grams": 80.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "onion cooked",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Onions, cooked, boiled, drained, without salt",
        "ndb_no": "11283",
        "portion_desc": "custom (g)",
        "portion_grams": 35.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "tomato sauce canned",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Tomato products, canned, sauce",
        "ndb_no": "11549",
        "portion_desc": "custom (g)",
        "portion_grams": 77.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_012",
    "food_word": "CHILIBEANS",
    "recipe_name": "Chili Beans",
    "category": "Dinner",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Chili with beans canned",
        "ndb_no": "16059",
        "portion_desc": "1 cup",
        "portion_grams": 253.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "CHILIBEANS"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "ground beef 80/20 cooked",
        "ing_qty": "1.5 oz",
        "sr28_long_desc": "Beef, ground, 80% lean meat / 20% fat, loaf, cooked, baked",
        "ndb_no": "23576",
        "portion_desc": "custom (g)",
        "portion_grams": 41.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "kidney beans cooked",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Beans, kidney, red, mature seeds, cooked, boiled, without salt",
        "ndb_no": "16033",
        "portion_desc": "custom (g)",
        "portion_grams": 102.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "onion cooked",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Onions, cooked, boiled, drained, without salt",
        "ndb_no": "11283",
        "portion_desc": "custom (g)",
        "portion_grams": 16.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "tomato sauce canned",
        "ing_qty": "6 tbsp",
        "sr28_long_desc": "Tomato products, canned, sauce",
        "ndb_no": "11549",
        "portion_desc": "custom (g)",
        "portion_grams": 97.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_002",
    "food_word": "CHILIDOG",
    "recipe_name": "Chili Dog",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods hotdog with chili",
        "ndb_no": "21119",
        "portion_desc": "1 sandwich",
        "portion_grams": 114.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "hot dog bun",
        "ing_qty": "1 bun",
        "sr28_long_desc": "Rolls hamburger or hotdog plain",
        "ndb_no": "18350",
        "portion_desc": "1 roll",
        "portion_grams": 44.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "beef frankfurter cooked",
        "ing_qty": "1 frank",
        "sr28_long_desc": "Frankfurter beef low fat",
        "ndb_no": "42179",
        "portion_desc": "custom (g)",
        "portion_grams": 49.0,
        "serving_count": 1.0,
        "notes": "Fast food frank approx 49g",
        "animal": "beef"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "chili with beans",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Chili with beans canned",
        "ndb_no": "16059",
        "portion_desc": "custom (g)",
        "portion_grams": 18.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "mustard",
        "ing_qty": "0.5 tsp",
        "sr28_long_desc": "Mustard prepared yellow",
        "ndb_no": "2046",
        "portion_desc": "custom (g)",
        "portion_grams": 3.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_013",
    "food_word": "CHINESEBEEFVEG",
    "recipe_name": "Chinese Beef and Veg",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese beef and vegetables",
        "ndb_no": "36603",
        "portion_desc": "1 order",
        "portion_grams": 574.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESEBEEFVEG"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "beef round lean braised",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Beef, round, bottom round, steak, separable lean only, trimmed to 0\" fat, all grades, cooked, braised",
        "ndb_no": "13407",
        "portion_desc": "custom (g)",
        "portion_grams": 90.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "broccoli cooked",
        "ing_qty": "7.5 oz",
        "sr28_long_desc": "Broccoli, cooked, boiled, drained, without salt",
        "ndb_no": "11091",
        "portion_desc": "custom (g)",
        "portion_grams": 220.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 110.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "2.5 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 40.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "4 tsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 20.0,
        "serving_count": 1.0,
        "notes": "Stir-fry oil"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 94.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_014",
    "food_word": "CHINESECHICKCHOWMEIN",
    "recipe_name": "Chinese Chicken Chow Mein",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese chicken chow mein",
        "ndb_no": "36623",
        "portion_desc": "1 order",
        "portion_grams": 604.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESECHICKCHOWMEIN"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg noodles cooked",
        "ing_qty": "5.5 oz",
        "sr28_long_desc": "Noodles, egg, cooked, enriched, with added salt",
        "ndb_no": "20310",
        "portion_desc": "custom (g)",
        "portion_grams": 155.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "chicken breast roasted",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        "ndb_no": "5064",
        "portion_desc": "custom (g)",
        "portion_grams": 105.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "11 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 320.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 15.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "2 tsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 9.0,
        "serving_count": 1.0,
        "notes": "Stir-fry oil"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_015",
    "food_word": "CHINESEGENERAL",
    "recipe_name": "Chinese General Tso\u2019s Chicken",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese general tso's chicken",
        "ndb_no": "36618",
        "portion_desc": "1 order",
        "portion_grams": 535.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESEGENERAL"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "fried chicken batter",
        "ing_qty": "6.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, batter",
        "ndb_no": "5058",
        "portion_desc": "custom (g)",
        "portion_grams": 185.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "4.5 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 70.0,
        "serving_count": 1.0,
        "notes": "Sweet chili sauce base"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "5.5 tbsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 80.0,
        "serving_count": 1.0,
        "notes": "Stir-fry and sauce oil"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 70.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_016",
    "food_word": "CHINESEKUNGPAOCHICK",
    "recipe_name": "Chinese Kung Pao Chicken",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese kung pao chicken",
        "ndb_no": "36619",
        "portion_desc": "1 order",
        "portion_grams": 604.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESEKUNGPAOCHICK"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "chicken breast roasted",
        "ing_qty": "6.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        "ndb_no": "5064",
        "portion_desc": "custom (g)",
        "portion_grams": 185.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "peanuts raw",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Peanuts, all types, raw",
        "ndb_no": "16087",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "9.5 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 270.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "2 tsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 10.0,
        "serving_count": 1.0,
        "notes": "Stir-fry oil"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "2.5 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "Sauce sweetener"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 54.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_017",
    "food_word": "CHINESELEMONCHICK",
    "recipe_name": "Chinese Lemon Chicken",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese lemon chicken",
        "ndb_no": "36617",
        "portion_desc": "1 order",
        "portion_grams": 623.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESELEMONCHICK"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "fried chicken batter",
        "ing_qty": "8.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, batter",
        "ndb_no": "5058",
        "portion_desc": "custom (g)",
        "portion_grams": 240.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "4 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "Lemon sauce sweetener"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "olive oil",
        "ing_qty": "4 tbsp",
        "sr28_long_desc": "Oil, olive, salad or cooking",
        "ndb_no": "4053",
        "portion_desc": "custom (g)",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "Frying and sauce oil"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 120.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "1.5 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 118.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_018",
    "food_word": "CHINESESHRIMPVEG",
    "recipe_name": "Chinese Shrimp and veg",
    "category": "Dinner",
    "dietary_category": "pesca",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese shrimp and vegetables",
        "ndb_no": "36620",
        "portion_desc": "1 order",
        "portion_grams": 601.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESESHRIMPVEG"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "shrimp cooked",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Crustaceans, shrimp, mixed species, cooked, moist heat (may have been previously frozen)",
        "ndb_no": "15151",
        "portion_desc": "custom (g)",
        "portion_grams": 105.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "broccoli cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Broccoli, cooked, boiled, drained, without salt",
        "ndb_no": "11091",
        "portion_desc": "custom (g)",
        "portion_grams": 80.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "9.5 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 270.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "1.5 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "Stir-fry oil"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 106.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_019",
    "food_word": "CHINESESWSOURCHICK",
    "recipe_name": "Chinese Sweet Sour Chicken",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese sweet and sour chicken",
        "ndb_no": "36621",
        "portion_desc": "1 order",
        "portion_grams": 706.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESESWSOURCHICK"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "fried chicken batter",
        "ing_qty": "8.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, batter",
        "ndb_no": "5058",
        "portion_desc": "custom (g)",
        "portion_grams": 240.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "7 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0,
        "notes": "Sweet sour sauce sweetener"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "canola oil",
        "ing_qty": "4 tbsp",
        "sr28_long_desc": "Oil, canola",
        "ndb_no": "4582",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0,
        "notes": "Frying and sauce oil"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "pineapple raw",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Pineapple, raw, all varieties",
        "ndb_no": "9266",
        "portion_desc": "custom (g)",
        "portion_grams": 75.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "catsup",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Catsup",
        "ndb_no": "11935",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "Sweet sour sauce base"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "5 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 150.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "green bell pepper",
        "ing_qty": "1.5 oz",
        "sr28_long_desc": "Peppers, sweet, green, raw",
        "ndb_no": "11333",
        "portion_desc": "custom (g)",
        "portion_grams": 46.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_020",
    "food_word": "CHINESESWSOURPORK",
    "recipe_name": "Chinese Sweet Sour Pork",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese sweet and sour pork",
        "ndb_no": "36622",
        "portion_desc": "1 order",
        "portion_grams": 609.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESESWSOURPORK"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pork shoulder blade broiled",
        "ing_qty": "7.5 oz",
        "sr28_long_desc": "Pork, fresh, shoulder, blade, boston (steaks), separable lean and fat, cooked, broiled",
        "ndb_no": "10082",
        "portion_desc": "custom (g)",
        "portion_grams": 220.0,
        "serving_count": 1.0,
        "notes": "Proxy for battered/fried pork"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "7 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0,
        "notes": "Sweet sour sauce sweetener"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "canola oil",
        "ing_qty": "4 tbsp",
        "sr28_long_desc": "Oil, canola",
        "ndb_no": "4582",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0,
        "notes": "Frying and sauce oil"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "pineapple raw",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Pineapple, raw, all varieties",
        "ndb_no": "9266",
        "portion_desc": "custom (g)",
        "portion_grams": 70.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "catsup",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Catsup",
        "ndb_no": "11935",
        "portion_desc": "custom (g)",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "Sweet sour sauce base"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "white rice cooked",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Rice, white, long-grain, regular, enriched, cooked",
        "ndb_no": "20045",
        "portion_desc": "custom (g)",
        "portion_grams": 119.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_021",
    "food_word": "CHINESEVEGCHOWMEIN",
    "recipe_name": "Chinese Veg Chow Mein",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese vegetable chow mein without meat or noodles",
        "ndb_no": "36624",
        "portion_desc": "1 order",
        "portion_grams": 777.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESEVEGCHOWMEIN"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg noodles cooked",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Noodles, egg, cooked, enriched, with added salt",
        "ndb_no": "20310",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "broccoli cooked",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Broccoli, cooked, boiled, drained, without salt",
        "ndb_no": "11091",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "3.5 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "1.5 tsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 8.0,
        "serving_count": 1.0,
        "notes": "Stir-fry oil"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "carrots raw",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Carrots, raw",
        "ndb_no": "11124",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "17.5 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 494.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_022",
    "food_word": "CHINESEVEGLOMEIN",
    "recipe_name": "Chinese Veg lo Mein",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Chinese vegetable lo mein without meat",
        "ndb_no": "36625",
        "portion_desc": "1 order",
        "portion_grams": 741.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant order size",
        "game_food": "CHINESEVEGLOMEIN"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg noodles cooked",
        "ing_qty": "9 oz",
        "sr28_long_desc": "Noodles, egg, cooked, enriched, with added salt",
        "ndb_no": "20310",
        "portion_desc": "custom (g)",
        "portion_grams": 255.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "broccoli cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Broccoli, cooked, boiled, drained, without salt",
        "ndb_no": "11091",
        "portion_desc": "custom (g)",
        "portion_grams": 90.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "soy sauce",
        "ing_qty": "1.5 tbsp",
        "sr28_long_desc": "Soy sauce made from soy and wheat (shoyu)",
        "ndb_no": "16123",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "sesame oil",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Oil, sesame, salad or cooking",
        "ndb_no": "4058",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "Lo mein sauce oil"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 16.0,
        "serving_count": 1.0,
        "notes": "Sauce sweetener"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "carrots raw",
        "ing_qty": "0.5 oz",
        "sr28_long_desc": "Carrots, raw",
        "ndb_no": "11124",
        "portion_desc": "custom (g)",
        "portion_grams": 15.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "bok choy cooked",
        "ing_qty": "10.5 oz",
        "sr28_long_desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
        "ndb_no": "11117",
        "portion_desc": "custom (g)",
        "portion_grams": 295.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_003",
    "food_word": "CLUBSANDWICH",
    "recipe_name": "Sandwich Club",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "SUBWAY SUBWAY CLUB sub on white bread with lettuce and tomato",
        "ndb_no": "21152",
        "portion_desc": "6 inch sub",
        "portion_grams": 207.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference - SUBWAY Club (turkey + ham + roast beef)"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "white sub roll",
        "ing_qty": "1 roll",
        "sr28_long_desc": "Bread white commercially prepared",
        "ndb_no": "18069",
        "portion_desc": "custom (g)",
        "portion_grams": 65.0,
        "serving_count": 1.0,
        "notes": "6-inch sub roll portion"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "turkey breast deli",
        "ing_qty": "3 slices",
        "sr28_long_desc": "Turkey breast low salt prepackaged or deli luncheon meat",
        "ndb_no": "7046",
        "portion_desc": "custom (g)",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "animal": "turkey"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "ham deli",
        "ing_qty": "2 slices",
        "sr28_long_desc": "Ham sliced pre-packaged deli meat 96% fat free water added",
        "ndb_no": "7028",
        "portion_desc": "custom (g)",
        "portion_grams": 26.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "roast beef deli",
        "ing_qty": "3 slices",
        "sr28_long_desc": "Roast beef deli style prepackaged sliced",
        "ndb_no": "7043",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0,
        "animal": "beef"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "lettuce iceberg",
        "ing_qty": "2 leaves",
        "sr28_long_desc": "Lettuce iceberg raw",
        "ndb_no": "11252",
        "portion_desc": "custom (g)",
        "portion_grams": 20.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "tomato",
        "ing_qty": "2 slices",
        "sr28_long_desc": "Tomatoes red ripe raw year round average",
        "ndb_no": "11529",
        "portion_desc": "custom (g)",
        "portion_grams": 16.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_017",
    "food_word": "COOKIESBROWNIES",
    "recipe_name": "Cookies Brownies",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "24 brownies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, brownies, commercially prepared",
        "ing_qty": "1 large square (56g)",
        "sr28_long_desc": "Cookies, brownies, commercially prepared",
        "ndb_no": "18151",
        "portion_desc": "custom (g)",
        "portion_grams": 56.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, brownies, commercially prepared",
        "ing_qty": "1 large square",
        "sr28_long_desc": "Cookies, brownies, commercially prepared",
        "ndb_no": "18151",
        "portion_desc": "custom (g)",
        "portion_grams": 56.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_018",
    "food_word": "COOKIESBUTTER",
    "recipe_name": "Cookies Butter",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, butter, commercially prepared, enriched",
        "ing_qty": "1 oz (28g)",
        "sr28_long_desc": "Cookies, butter, commercially prepared, enriched",
        "ndb_no": "18155",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, butter, commercially prepared, enriched",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Cookies, butter, commercially prepared, enriched",
        "ndb_no": "18155",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_019",
    "food_word": "COOKIESCHOCOLATECHIP",
    "recipe_name": "Cookies Choc Chip",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, chocolate chip, commercially prepared, regular, lower fat",
        "ing_qty": "3 cookies (34g)",
        "sr28_long_desc": "Cookies, chocolate chip, commercially prepared, regular, lower fat",
        "ndb_no": "18158",
        "portion_desc": "custom (g)",
        "portion_grams": 34.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, chocolate chip, commercially prepared, regular, lower fat",
        "ing_qty": "3 cookies",
        "sr28_long_desc": "Cookies, chocolate chip, commercially prepared, regular, lower fat",
        "ndb_no": "18158",
        "portion_desc": "custom (g)",
        "portion_grams": 34.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_020",
    "food_word": "COOKIESFIGBAR",
    "recipe_name": "Cookies Fig Bar",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "24 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, fig bars",
        "ing_qty": "1 Figaroo (43g)",
        "sr28_long_desc": "Cookies, fig bars",
        "ndb_no": "18170",
        "portion_desc": "custom (g)",
        "portion_grams": 43.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, fig bars",
        "ing_qty": "1 Figaroo (2 halves)",
        "sr28_long_desc": "Cookies, fig bars",
        "ndb_no": "18170",
        "portion_desc": "custom (g)",
        "portion_grams": 43.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_021",
    "food_word": "COOKIESGINGERSNAP",
    "recipe_name": "Cookies Gingersnap",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, gingersnaps",
        "ing_qty": "4 cookies (28g)",
        "sr28_long_desc": "Cookies, gingersnaps",
        "ndb_no": "18172",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, gingersnaps",
        "ing_qty": "4 cookies",
        "sr28_long_desc": "Cookies, gingersnaps",
        "ndb_no": "18172",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_022",
    "food_word": "COOKIESMACAROON",
    "recipe_name": "Cookies Macaroon",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "24 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, coconut macaroon",
        "ing_qty": "2 cookies (36g)",
        "sr28_long_desc": "Cookies, coconut macaroon",
        "ndb_no": "28309",
        "portion_desc": "custom (g)",
        "portion_grams": 36.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, coconut macaroon",
        "ing_qty": "2 cookies",
        "sr28_long_desc": "Cookies, coconut macaroon",
        "ndb_no": "28309",
        "portion_desc": "custom (g)",
        "portion_grams": 36.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_023",
    "food_word": "COOKIESMOLASSES",
    "recipe_name": "Cookies Molasses",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, molasses",
        "ing_qty": "1 large cookie (32g)",
        "sr28_long_desc": "Cookies, molasses",
        "ndb_no": "18177",
        "portion_desc": "custom (g)",
        "portion_grams": 32.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, molasses",
        "ing_qty": "1 large cookie",
        "sr28_long_desc": "Cookies, molasses",
        "ndb_no": "18177",
        "portion_desc": "custom (g)",
        "portion_grams": 32.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_024",
    "food_word": "COOKIESOATMEAL",
    "recipe_name": "Cookies Oatmeal",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, oatmeal, commercially prepared, regular",
        "ing_qty": "1 big cookie (25g)",
        "sr28_long_desc": "Cookies, oatmeal, commercially prepared, regular",
        "ndb_no": "18178",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, oatmeal, commercially prepared, regular",
        "ing_qty": "1 big cookie",
        "sr28_long_desc": "Cookies, oatmeal, commercially prepared, regular",
        "ndb_no": "18178",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_025",
    "food_word": "COOKIESOATMEALRAISIN",
    "recipe_name": "Cookies Oatmeal Raisin",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, oatmeal, prepared from recipe, with raisins",
        "ing_qty": "3 cookies (45g)",
        "sr28_long_desc": "Cookies, oatmeal, prepared from recipe, with raisins",
        "ndb_no": "18184",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, oatmeal, prepared from recipe, with raisins",
        "ing_qty": "3 cookies",
        "sr28_long_desc": "Cookies, oatmeal, prepared from recipe, with raisins",
        "ndb_no": "18184",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_026",
    "food_word": "COOKIESPEANUTBUTTER",
    "recipe_name": "Cookies Peanut Butter",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, peanut butter, commercially prepared, regular",
        "ing_qty": "1 cookie (31g)",
        "sr28_long_desc": "Cookies, peanut butter, commercially prepared, regular",
        "ndb_no": "18185",
        "portion_desc": "custom (g)",
        "portion_grams": 31.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, peanut butter, commercially prepared, regular",
        "ing_qty": "1 cookie",
        "sr28_long_desc": "Cookies, peanut butter, commercially prepared, regular",
        "ndb_no": "18185",
        "portion_desc": "custom (g)",
        "portion_grams": 31.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_027",
    "food_word": "COOKIESSHORTBREAD",
    "recipe_name": "Cookies Shortbread",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, shortbread, commercially prepared, plain",
        "ing_qty": "4 cookies (47g)",
        "sr28_long_desc": "Cookies, shortbread, commercially prepared, plain",
        "ndb_no": "18192",
        "portion_desc": "custom (g)",
        "portion_grams": 47.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, shortbread, commercially prepared, plain",
        "ing_qty": "4 cookies",
        "sr28_long_desc": "Cookies, shortbread, commercially prepared, plain",
        "ndb_no": "18192",
        "portion_desc": "custom (g)",
        "portion_grams": 47.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_028",
    "food_word": "COOKIESSUGAR",
    "recipe_name": "Cookies Sugar",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "36 cookies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cookies, sugar, commercially prepared, regular (includes vanilla)",
        "ing_qty": "3 cookies (51g)",
        "sr28_long_desc": "Cookies, sugar, commercially prepared, regular (includes vanilla)",
        "ndb_no": "18204",
        "portion_desc": "custom (g)",
        "portion_grams": 51.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cookies, sugar, commercially prepared, regular",
        "ing_qty": "3 cookies",
        "sr28_long_desc": "Cookies, sugar, commercially prepared, regular (includes vanilla)",
        "ndb_no": "18204",
        "portion_desc": "custom (g)",
        "portion_grams": 51.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_002",
    "food_word": "CORNBREAD",
    "recipe_name": "Cornbread",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "9 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SNACK_001",
    "food_word": "CORNDOG",
    "recipe_name": "Corn Dog",
    "category": "Snacks",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Corn dogs, frozen, prepared",
        "ing_qty": "1 corn dog (78g)",
        "sr28_long_desc": "Corn dogs, frozen, prepared",
        "ndb_no": "22973",
        "portion_desc": "custom (g)",
        "portion_grams": 78.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "corn dogs, frozen, prepared",
        "ing_qty": "1 corn dog",
        "sr28_long_desc": "Corn dogs, frozen, prepared",
        "ndb_no": "22973",
        "portion_desc": "custom (g)",
        "portion_grams": 78.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_029",
    "food_word": "DOUGHNUTCAKEGLAZE",
    "recipe_name": "Doughnut Cake-type Glazed",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "12 doughnuts",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Doughnuts, cake-type, plain, sugared or glazed",
        "ing_qty": "1 medium doughnut (45g)",
        "sr28_long_desc": "Doughnuts, cake-type, plain, sugared or glazed",
        "ndb_no": "18250",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "doughnuts, cake-type, plain, sugared or glazed",
        "ing_qty": "1 medium doughnut",
        "sr28_long_desc": "Doughnuts, cake-type, plain, sugared or glazed",
        "ndb_no": "18250",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SNACK_002",
    "food_word": "EGGROLL",
    "recipe_name": "Egg Roll",
    "category": "Snacks",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 roll",
    "sr28_rule": "Rule 1",
    "sr28_notes": "SR28 vegetable egg roll",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Restaurant, Chinese, egg rolls, assorted",
        "ing_qty": "1 piece (89g)",
        "sr28_long_desc": "Restaurant, Chinese, egg rolls, assorted",
        "ndb_no": "36601",
        "portion_desc": "custom (g)",
        "portion_grams": 89.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg rolls, restaurant Chinese, assorted",
        "ing_qty": "1 piece",
        "sr28_long_desc": "Restaurant, Chinese, egg rolls, assorted",
        "ndb_no": "36601",
        "portion_desc": "custom (g)",
        "portion_grams": 89.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SNACK_003",
    "food_word": "EGGROLLCHICKEN",
    "recipe_name": "Egg Roll Chicken",
    "category": "Snacks",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 roll",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Egg rolls, chicken, refrigerated, heated",
        "ing_qty": "1 roll (80g)",
        "sr28_long_desc": "Egg rolls, chicken, refrigerated, heated",
        "ndb_no": "22954",
        "portion_desc": "custom (g)",
        "portion_grams": 80.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg rolls, chicken, refrigerated, heated",
        "ing_qty": "1 roll",
        "sr28_long_desc": "Egg rolls, chicken, refrigerated, heated",
        "ndb_no": "22954",
        "portion_desc": "custom (g)",
        "portion_grams": 80.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SNACK_004",
    "food_word": "EGGROLLPORK",
    "recipe_name": "Egg Roll Pork",
    "category": "Snacks",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "1 roll",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Egg rolls, pork, refrigerated, heated",
        "ing_qty": "1 roll (85g)",
        "sr28_long_desc": "Egg rolls, pork, refrigerated, heated",
        "ndb_no": "22953",
        "portion_desc": "custom (g)",
        "portion_grams": 85.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg rolls, pork, refrigerated, heated",
        "ing_qty": "1 roll",
        "sr28_long_desc": "Egg rolls, pork, refrigerated, heated",
        "ndb_no": "22953",
        "portion_desc": "custom (g)",
        "portion_grams": 85.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_023",
    "food_word": "ENCHILADACHEESE",
    "recipe_name": "Enchiladas Cheese",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "40 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Mexican cheese enchilada",
        "ndb_no": "36050",
        "portion_desc": "1 serving (1-3 enchiladas)",
        "portion_grams": 244.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "ENCHILADACHEESE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "corn tortilla",
        "ing_qty": "2 tortillas",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, corn",
        "ndb_no": "18363",
        "portion_desc": "custom (g)",
        "portion_grams": 76.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 119.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "enchilada sauce",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "PACE, Enchilada Sauce",
        "ndb_no": "6599",
        "portion_desc": "custom (g)",
        "portion_grams": 49.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_004",
    "food_word": "FALAFEL",
    "recipe_name": "Falafel",
    "category": "Lunch",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Falafel home-prepared",
        "ndb_no": "16138",
        "portion_desc": "3 patties",
        "portion_grams": 51.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference - 3 patties per serving / 4 servings per batch. Weight divergence expected: water lost during deep frying"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cooked chickpeas",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Chickpeas garbanzo beans bengal gram mature seeds cooked boiled without salt",
        "ndb_no": "16057",
        "portion_desc": "custom (g)",
        "portion_grams": 42.0,
        "serving_count": 1.0,
        "notes": "Traditional falafel uses soaked raw chickpeas - cooked entry used to match finished kcal"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "1 tsp",
        "sr28_long_desc": "Wheat flour white all-purpose enriched bleached",
        "ndb_no": "20081",
        "portion_desc": "custom (g)",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "Binder"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "onion",
        "ing_qty": "2 tbsp chopped",
        "sr28_long_desc": "Onions raw",
        "ndb_no": "11282",
        "portion_desc": "custom (g)",
        "portion_grams": 8.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "parsley fresh",
        "ing_qty": "1 tbsp chopped",
        "sr28_long_desc": "Parsley fresh",
        "ndb_no": "11297",
        "portion_desc": "custom (g)",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "garlic",
        "ing_qty": "1 small clove",
        "sr28_long_desc": "Garlic raw",
        "ndb_no": "11215",
        "portion_desc": "custom (g)",
        "portion_grams": 1.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "vegetable oil",
        "ing_qty": "2 tsp",
        "sr28_long_desc": "USDA Commodity Food oil vegetable soybean refined",
        "ndb_no": "4669",
        "portion_desc": "custom (g)",
        "portion_grams": 9.0,
        "serving_count": 1.0,
        "notes": "Oil absorbed during deep frying"
      },
      {
        "row_order": 7,
        "row_type": "exempt",
        "ing_name": "cumin",
        "ing_qty": "1/2 tsp",
        "notes": "spice"
      },
      {
        "row_order": 8,
        "row_type": "exempt",
        "ing_name": "coriander",
        "ing_qty": "1/2 tsp",
        "notes": "spice"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "per-serving salt"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_005",
    "food_word": "HAMBURGER",
    "recipe_name": "Hamburger",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods hamburger single regular patty with condiments and vegetables",
        "ndb_no": "21109",
        "portion_desc": "1 item",
        "portion_grams": 110.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "hamburger bun",
        "ing_qty": "1 bun",
        "sr28_long_desc": "Rolls hamburger or hotdog plain",
        "ndb_no": "18350",
        "portion_desc": "1 roll",
        "portion_grams": 44.0,
        "serving_count": 1.0,
        "animal": "beef"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "beef patty cooked",
        "ing_qty": "1 patty",
        "sr28_long_desc": "Beef ground 70% lean meat / 30% fat patty cooked pan-broiled",
        "ndb_no": "13496",
        "portion_desc": "custom (g)",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "Regular patty ~2 oz cooked; higher than cheeseburger \u2014 no cheese",
        "animal": "beef"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "ketchup",
        "ing_qty": "1 tsp",
        "sr28_long_desc": "Catsup",
        "ndb_no": "11935",
        "portion_desc": "1 tsp",
        "portion_grams": 5.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "mustard",
        "ing_qty": "0.5 tsp",
        "sr28_long_desc": "Mustard prepared yellow",
        "ndb_no": "2046",
        "portion_desc": "custom (g)",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "dill pickle slices",
        "ing_qty": "3 slices",
        "sr28_long_desc": "Pickles cucumber dill or kosher dill",
        "ndb_no": "11937",
        "portion_desc": "custom (g)",
        "portion_grams": 4.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "onion",
        "ing_qty": "1 tsp chopped",
        "sr28_long_desc": "Onions raw",
        "ndb_no": "11282",
        "portion_desc": "custom (g)",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "lettuce",
        "ing_qty": "1 leaf",
        "sr28_long_desc": "Lettuce butterhead includes boston and bibb types raw",
        "ndb_no": "11250",
        "portion_desc": "custom (g)",
        "portion_grams": 10.0,
        "serving_count": 1.0
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "tomato",
        "ing_qty": "2 slices",
        "sr28_long_desc": "Tomatoes red ripe raw year round average",
        "ndb_no": "11529",
        "portion_desc": "custom (g)",
        "portion_grams": 23.0,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Form ground beef into a patty about 3/4 inch thick and season both sides with salt and pepper."
      },
      {
        "step_order": 2,
        "step_text": "Heat a skillet or grill over medium-high heat. Cook patty 3\u20134 minutes per side for medium."
      },
      {
        "step_order": 3,
        "step_text": "Toast the bun cut-side down in the pan for 1 minute."
      },
      {
        "step_order": 4,
        "step_text": "Layer lettuce and tomato on the bottom bun. Add the patty and top bun. Serve immediately."
      }
    ]
  },
  {
    "recipe_id": "BFAST_001",
    "food_word": "HASHBROWN",
    "recipe_name": "Hash Brown",
    "category": "Breakfast",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Potatoes hash brown home-prepared",
        "ndb_no": "11370",
        "portion_desc": "1 cup",
        "portion_grams": 156.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference. Weight divergence expected: 328g raw input \u2192 156g finished (53% water loss during frying)"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "russet potato raw",
        "ing_qty": "2 medium",
        "sr28_long_desc": "Potatoes russet flesh and skin raw",
        "ndb_no": "11353",
        "portion_desc": "custom (g)",
        "portion_grams": 303.0,
        "serving_count": 1.0,
        "notes": "Grated raw. Loses ~53% weight as water during pan-frying"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "canola oil",
        "ing_qty": "4 tsp",
        "sr28_long_desc": "Oil canola",
        "ndb_no": "4582",
        "portion_desc": "custom (g)",
        "portion_grams": 20.0,
        "serving_count": 1.0,
        "notes": "Oil absorbed during frying accounts for finished fat content"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "onion",
        "ing_qty": "1 tbsp chopped",
        "sr28_long_desc": "Onions raw",
        "ndb_no": "11282",
        "portion_desc": "custom (g)",
        "portion_grams": 5.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "to taste",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "per-serving salt"
      },
      {
        "row_order": 5,
        "row_type": "exempt",
        "ing_name": "black pepper",
        "ing_qty": "to taste",
        "notes": "spice"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SNACK_005",
    "food_word": "HUMMUS",
    "recipe_name": "Hummus",
    "category": "Snacks",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "10 mins",
    "servings": "8 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Hummus, commercial",
        "ing_qty": "~100g serving",
        "sr28_long_desc": "Hummus, commercial",
        "ndb_no": "16158",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "hummus, commercial",
        "ing_qty": "~100g",
        "sr28_long_desc": "Hummus, commercial",
        "ndb_no": "16158",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_003",
    "food_word": "HUSHPUPPIES",
    "recipe_name": "Hush Puppies",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "12 hush puppies",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "DINR_024",
    "food_word": "LASAGNA",
    "recipe_name": "Lasagna",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "8 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Lasagna cheese frozen prepared",
        "ndb_no": "22910",
        "portion_desc": "1 cup 1 serving",
        "portion_grams": 225.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "LASAGNA"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pasta fresh cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Pasta, fresh-refrigerated, plain, cooked",
        "ndb_no": "20094",
        "portion_desc": "custom (g)",
        "portion_grams": 83.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ricotta whole milk",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Cheese, ricotta, whole milk",
        "ndb_no": "1036",
        "portion_desc": "custom (g)",
        "portion_grams": 55.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "mozzarella part skim",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Cheese, mozzarella, part skim milk",
        "ndb_no": "1028",
        "portion_desc": "custom (g)",
        "portion_grams": 29.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "tomato sauce canned",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Tomato products, canned, sauce",
        "ndb_no": "11549",
        "portion_desc": "custom (g)",
        "portion_grams": 58.0,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Cook lasagna noodles according to package directions. Drain and lay flat on a towel."
      },
      {
        "step_order": 2,
        "step_text": "Mix ricotta cheese with egg and half the parsley. Season with salt and pepper."
      },
      {
        "step_order": 3,
        "step_text": "Spread a thin layer of marinara sauce in the bottom of a 9x13 baking dish."
      },
      {
        "step_order": 4,
        "step_text": "Layer noodles, ricotta mixture, mozzarella slices and marinara. Repeat for 3 layers."
      },
      {
        "step_order": 5,
        "step_text": "Top with remaining marinara and mozzarella. Sprinkle with Parmesan and remaining parsley."
      },
      {
        "step_order": 6,
        "step_text": "Cover with foil and bake at 375\u00b0F for 25 minutes. Uncover and bake 15 minutes more until bubbly."
      },
      {
        "step_order": 7,
        "step_text": "Rest 10 minutes before cutting into 8 servings."
      }
    ]
  },
  {
    "recipe_id": "DINR_025",
    "food_word": "LASAGNAMEAT",
    "recipe_name": "Lasagna with Meat",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "8 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Italian lasagna with meat",
        "ndb_no": "36041",
        "portion_desc": "1 serving",
        "portion_grams": 457.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant serving",
        "game_food": "LASAGNAMEAT"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pasta fresh cooked",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Pasta, fresh-refrigerated, plain, cooked",
        "ndb_no": "20094",
        "portion_desc": "custom (g)",
        "portion_grams": 110.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ground beef 80/20 cooked",
        "ing_qty": "4.5 oz",
        "sr28_long_desc": "Beef, ground, 80% lean meat / 20% fat, loaf, cooked, baked",
        "ndb_no": "23576",
        "portion_desc": "custom (g)",
        "portion_grams": 125.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "ricotta whole milk",
        "ing_qty": "6 tbsp",
        "sr28_long_desc": "Cheese, ricotta, whole milk",
        "ndb_no": "1036",
        "portion_desc": "custom (g)",
        "portion_grams": 105.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "mozzarella part skim",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Cheese, mozzarella, part skim milk",
        "ndb_no": "1028",
        "portion_desc": "custom (g)",
        "portion_grams": 75.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "tomato sauce canned",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Tomato products, canned, sauce",
        "ndb_no": "11549",
        "portion_desc": "custom (g)",
        "portion_grams": 42.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_004",
    "food_word": "MACARONICHEESE",
    "recipe_name": "Macaroni and Cheese",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_005",
    "food_word": "MARINARASAUCE",
    "recipe_name": "Marinara Sauce",
    "category": "Sides",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "sr28_notes": "Ready-to-serve SR28 entry",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "DINR_026",
    "food_word": "MEATBALLS",
    "recipe_name": "Meatballs",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Meatballs frozen Italian style",
        "ndb_no": "7972",
        "portion_desc": "3 oz",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "MEATBALLS"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "ground beef 80/20 cooked",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Beef, ground, 80% lean meat / 20% fat, loaf, cooked, baked",
        "ndb_no": "23576",
        "portion_desc": "custom (g)",
        "portion_grams": 56.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "bread crumbs dry",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Bread crumbs, dry, grated, plain",
        "ndb_no": "18079",
        "portion_desc": "custom (g)",
        "portion_grams": 19.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "egg whole raw",
        "ing_qty": "1/8 egg",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 6.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "parmesan hard",
        "ing_qty": "1 tsp",
        "sr28_long_desc": "Cheese, parmesan, hard",
        "ndb_no": "1033",
        "portion_desc": "custom (g)",
        "portion_grams": 4.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "BEV_001",
    "food_word": "MILKSHAKECHOC",
    "recipe_name": "Milkshake Choc",
    "category": "Beverages",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "5 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "BEV_002",
    "food_word": "MILKSHAKEVANILLA",
    "recipe_name": "Milkshake Vanilla",
    "category": "Beverages",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "5 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "BFAST_002",
    "food_word": "MUFFINCORN",
    "recipe_name": "Muffin Corn",
    "category": "Breakfast",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "12 muffins",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Muffins corn prepared from recipe made with low fat 2% milk",
        "ndb_no": "18282",
        "portion_desc": "1 muffin",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference. 12 muffins per batch. Weight divergence: ~760g raw input baked to 684g (12x57g)"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "cornmeal",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Cornmeal degermed enriched yellow",
        "ndb_no": "20022",
        "portion_desc": "1 cup",
        "portion_grams": 13.08,
        "serving_count": 1.0,
        "notes": "Full batch: 157.0g \u00f7 12 muffins"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Wheat flour white all-purpose enriched bleached",
        "ndb_no": "20081",
        "portion_desc": "1 cup",
        "portion_grams": 10.42,
        "serving_count": 1.0,
        "notes": "Full batch: 125.0g \u00f7 12 muffins"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Sugars granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 4.17,
        "serving_count": 1.0,
        "notes": "Full batch: 50.0g \u00f7 12 muffins"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Leavening agents baking powder double-acting",
        "ndb_no": "18369",
        "portion_desc": "custom (g)",
        "portion_grams": 1.17,
        "serving_count": 1.0,
        "notes": "Full batch: 14.0g \u00f7 12 muffins"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "eggs",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg whole raw fresh",
        "ndb_no": "1123",
        "portion_desc": "1 large",
        "portion_grams": 8.33,
        "serving_count": 1.0,
        "notes": "Full batch: 2 eggs (100g) \u00f7 12 muffins"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "2% milk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk reduced fat 2% milkfat",
        "ndb_no": "1079",
        "portion_desc": "1 cup",
        "portion_grams": 20.33,
        "serving_count": 1.0,
        "notes": "SR Legacy recipe uses low fat 2% milk (per-muffin portion: 244.0g total \u00f7 12 muffins)"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "canola oil",
        "ing_qty": "5 tbsp",
        "sr28_long_desc": "Oil canola",
        "ndb_no": "4582",
        "portion_desc": "custom (g)",
        "portion_grams": 5.83,
        "serving_count": 1.0,
        "notes": "Full batch: 70.0g \u00f7 12 muffins"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 0.25,
        "serving_count": 1.0,
        "notes": "Full batch salt \u00f7 serving yield"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "BFAST_003",
    "food_word": "MUFFUNBLUEBERRY",
    "recipe_name": "Muffin Blueberry",
    "category": "Breakfast",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "12 muffins",
    "sr28_rule": "Rule 1",
    "sr28_notes": "Word key typo MUFFUN vs MUFFIN - fix in food-portions-complete.csv",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Muffins blueberry prepared from recipe made with low fat 2% milk",
        "ndb_no": "18278",
        "portion_desc": "1 muffin",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference. Batch makes 12x57g muffins. Raw input ~938g baked to 684g"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Wheat flour white all-purpose enriched bleached",
        "ndb_no": "20081",
        "portion_desc": "custom (g)",
        "portion_grams": 19.5,
        "serving_count": 1.0,
        "notes": "Full batch 234g \u00f7 12 muffins"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Sugars granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 5.58,
        "serving_count": 1.0,
        "notes": "Full batch 67g \u00f7 12 muffins"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Leavening agents baking powder double-acting",
        "ndb_no": "18369",
        "portion_desc": "custom (g)",
        "portion_grams": 1.17,
        "serving_count": 1.0,
        "notes": "Full batch 14g \u00f7 12 muffins"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "eggs",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg whole raw fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 8.33,
        "serving_count": 1.0,
        "notes": "Full batch 2 eggs (100g) \u00f7 12 muffins"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "2% milk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk reduced fat 2% milkfat",
        "ndb_no": "1079",
        "portion_desc": "custom (g)",
        "portion_grams": 20.33,
        "serving_count": 1.0,
        "notes": "Full batch 244g \u00f7 12 muffins"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "canola oil",
        "ing_qty": "3.5 tbsp",
        "sr28_long_desc": "Oil canola",
        "ndb_no": "4582",
        "portion_desc": "custom (g)",
        "portion_grams": 4.17,
        "serving_count": 1.0,
        "notes": "Full batch 50g \u00f7 12 muffins"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "blueberries",
        "ing_qty": "1.5 cups",
        "sr28_long_desc": "Blueberries raw",
        "ndb_no": "9050",
        "portion_desc": "custom (g)",
        "portion_grams": 18.75,
        "serving_count": 1.0,
        "notes": "Full batch 225g \u00f7 12 muffins"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 0.25,
        "serving_count": 1.0,
        "notes": "Full batch salt \u00f7 serving yield"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "BFAST_004",
    "food_word": "PANCAKE",
    "recipe_name": "Pancake Buttermilk",
    "category": "Breakfast",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "8 pancakes",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Pancakes buttermilk prepared from recipe",
        "ndb_no": "18390",
        "portion_desc": "1 pancake",
        "portion_grams": 38.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference. Batch makes 8x38g pancakes (4\" dia). Raw batter ~425g \u2192 304g finished"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Wheat flour white all-purpose enriched bleached",
        "ndb_no": "20081",
        "portion_desc": "custom (g)",
        "portion_grams": 11.25,
        "serving_count": 1.0,
        "notes": "Full batch 90g \u00f7 8 pancakes"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Sugars granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "Full batch 12g \u00f7 8 pancakes"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1.5 tsp",
        "sr28_long_desc": "Leavening agents baking powder double-acting",
        "ndb_no": "18369",
        "portion_desc": "custom (g)",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "Full batch 6g \u00f7 8 pancakes"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Leavening agents baking soda",
        "ndb_no": "18372",
        "portion_desc": "custom (g)",
        "portion_grams": 0.25,
        "serving_count": 1.0,
        "notes": "Full batch 2g \u00f7 8 pancakes"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg whole raw fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 6.25,
        "serving_count": 1.0,
        "notes": "Full batch 1 egg (50g) \u00f7 8 pancakes"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "buttermilk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk buttermilk fluid cultured lowfat",
        "ndb_no": "1088",
        "portion_desc": "custom (g)",
        "portion_grams": 30.62,
        "serving_count": 1.0,
        "notes": "Full batch 245g \u00f7 8 pancakes"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "butter melted",
        "ing_qty": "1.5 tbsp",
        "sr28_long_desc": "Butter salted",
        "ndb_no": "1001",
        "portion_desc": "custom (g)",
        "portion_grams": 2.5,
        "serving_count": 1.0,
        "notes": "Full batch 20g \u00f7 8 pancakes"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 0.38,
        "serving_count": 1.0,
        "notes": "Full batch salt \u00f7 serving yield"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "BFAST_005",
    "food_word": "PANCAKEBLUEBERRY",
    "recipe_name": "Pancake Blueberry",
    "category": "Breakfast",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "8 pancakes",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Pancakes blueberry prepared from recipe",
        "ndb_no": "18294",
        "portion_desc": "1 pancake",
        "portion_grams": 38.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference. Batch makes 8x38g pancakes (4\" dia). Raw batter ~483g \u2192 304g finished"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Wheat flour white all-purpose enriched bleached",
        "ndb_no": "20081",
        "portion_desc": "custom (g)",
        "portion_grams": 9.38,
        "serving_count": 1.0,
        "notes": "Full batch 75g \u00f7 8 pancakes"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Sugars granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "Full batch 12g \u00f7 8 pancakes"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1.5 tsp",
        "sr28_long_desc": "Leavening agents baking powder double-acting",
        "ndb_no": "18369",
        "portion_desc": "custom (g)",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "Full batch 6g \u00f7 8 pancakes"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Leavening agents baking soda",
        "ndb_no": "18372",
        "portion_desc": "custom (g)",
        "portion_grams": 0.25,
        "serving_count": 1.0,
        "notes": "Full batch 2g \u00f7 8 pancakes"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg whole raw fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 6.25,
        "serving_count": 1.0,
        "notes": "Full batch 1 egg (50g) \u00f7 8 pancakes"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "buttermilk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk buttermilk fluid cultured lowfat",
        "ndb_no": "1088",
        "portion_desc": "custom (g)",
        "portion_grams": 30.62,
        "serving_count": 1.0,
        "notes": "Full batch 245g \u00f7 8 pancakes"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "butter melted",
        "ing_qty": "1.5 tbsp",
        "sr28_long_desc": "Butter salted",
        "ndb_no": "1001",
        "portion_desc": "custom (g)",
        "portion_grams": 2.5,
        "serving_count": 1.0,
        "notes": "Full batch 20g \u00f7 8 pancakes"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "blueberries",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Blueberries raw",
        "ndb_no": "9050",
        "portion_desc": "custom (g)",
        "portion_grams": 8.75,
        "serving_count": 1.0,
        "notes": "Full batch 70g \u00f7 8 pancakes"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 0.38,
        "serving_count": 1.0,
        "notes": "Full batch 3g \u00f7 8 pancakes"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "BFAST_006",
    "food_word": "PANCAKEGLUTENFREE",
    "recipe_name": "Pancake Gluten Free",
    "category": "Breakfast",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "8 pancakes",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Pancakes gluten-free frozen ready-to-heat",
        "ndb_no": "28347",
        "portion_desc": "1 pancake",
        "portion_grams": 48.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference (Van's/commercial GF). Batch makes 8x48g pancakes. From-recipe GF version"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "white rice flour",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Rice flour white unenriched",
        "ndb_no": "20061",
        "portion_desc": "custom (g)",
        "portion_grams": 9.38,
        "serving_count": 1.0,
        "notes": "Full batch 75g \u00f7 8 pancakes"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "cornstarch (tapioca proxy)",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "custom (g)",
        "portion_grams": 1.88,
        "serving_count": 1.0,
        "notes": "Full batch 15g \u00f7 8; tapioca starch not in SR28 so cornstarch used as proxy"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Sugars granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 1.88,
        "serving_count": 1.0,
        "notes": "Full batch 15g \u00f7 8 pancakes"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1.5 tsp",
        "sr28_long_desc": "Leavening agents baking powder double-acting",
        "ndb_no": "18369",
        "portion_desc": "custom (g)",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "Full batch 6g \u00f7 8 pancakes"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg whole raw fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 6.25,
        "serving_count": 1.0,
        "notes": "Full batch 1 egg (50g) \u00f7 8 pancakes"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk whole 3.25% milkfat with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "custom (g)",
        "portion_grams": 28.75,
        "serving_count": 1.0,
        "notes": "Full batch 230g \u00f7 8 pancakes"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "canola oil",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Oil canola",
        "ndb_no": "4582",
        "portion_desc": "custom (g)",
        "portion_grams": 3.12,
        "serving_count": 1.0,
        "notes": "Full batch 25g \u00f7 8 pancakes"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 0.19,
        "serving_count": 1.0,
        "notes": "Full batch 1.5g \u00f7 8 pancakes"
      },
      {
        "row_order": 9,
        "row_type": "exempt",
        "ing_name": "xanthan gum",
        "ing_qty": "1/4 tsp",
        "notes": "Binder; trace amount; no SR28 NDB available"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "BFAST_007",
    "food_word": "PANCAKEPLAIN",
    "recipe_name": "Pancake Plain",
    "category": "Breakfast",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "8 pancakes",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Pancakes plain prepared from recipe",
        "ndb_no": "18293",
        "portion_desc": "1 pancake (4\" dia)",
        "portion_grams": 38.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference. Batch makes 8x38g pancakes (4\" dia). Whole milk version (no baking soda)"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Wheat flour white all-purpose enriched bleached",
        "ndb_no": "20081",
        "portion_desc": "custom (g)",
        "portion_grams": 10.0,
        "serving_count": 1.0,
        "notes": "Full batch 80g \u00f7 8 pancakes"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Sugars granulated",
        "ndb_no": "19335",
        "portion_desc": "custom (g)",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "Full batch 12g \u00f7 8 pancakes"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1.5 tsp",
        "sr28_long_desc": "Leavening agents baking powder double-acting",
        "ndb_no": "18369",
        "portion_desc": "custom (g)",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "Full batch 6g \u00f7 8 pancakes"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg whole raw fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 6.25,
        "serving_count": 1.0,
        "notes": "Full batch 1 egg (50g) \u00f7 8 pancakes"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk whole 3.25% milkfat with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "custom (g)",
        "portion_grams": 30.62,
        "serving_count": 1.0,
        "notes": "Full batch 245g \u00f7 8 pancakes"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "butter melted",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Butter salted",
        "ndb_no": "1001",
        "portion_desc": "custom (g)",
        "portion_grams": 2.25,
        "serving_count": 1.0,
        "notes": "Full batch 18g \u00f7 8 pancakes (reduced vs buttermilk version)"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 tsp",
        "sr28_long_desc": "Salt table",
        "ndb_no": "2047",
        "portion_desc": "custom (g)",
        "portion_grams": 0.19,
        "serving_count": 1.0,
        "notes": "Full batch 1.5g \u00f7 8 pancakes"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_027",
    "food_word": "PASTAPOMODOROCHIC",
    "recipe_name": "Pasta Chicken Pomodoro",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "KASHI Chicken Pasta Pomodoro Frozen Entree",
        "ndb_no": "22984",
        "portion_desc": "1 package",
        "portion_grams": 283.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "PASTAPOMODOROCHIC"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pasta fresh cooked",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Pasta, fresh-refrigerated, plain, cooked",
        "ndb_no": "20094",
        "portion_desc": "custom (g)",
        "portion_grams": 84.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "chicken breast roasted",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        "ndb_no": "5064",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "tomato sauce canned",
        "ing_qty": "4 oz",
        "sr28_long_desc": "Tomato products, canned, sauce",
        "ndb_no": "11549",
        "portion_desc": "custom (g)",
        "portion_grams": 110.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "olive oil",
        "ing_qty": "2 tsp",
        "sr28_long_desc": "Oil, olive, salad or cooking",
        "ndb_no": "4053",
        "portion_desc": "custom (g)",
        "portion_grams": 9.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "broccoli cooked",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Broccoli, cooked, boiled, drained, without salt",
        "ndb_no": "11091",
        "portion_desc": "custom (g)",
        "portion_grams": 50.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_028",
    "food_word": "PASTAPRIMAVERAPESTO",
    "recipe_name": "Pasta Pesto Primavera",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "KASHI Pesto Pasta Primavera frozen unprepared",
        "ndb_no": "22987",
        "portion_desc": "1 entree",
        "portion_grams": 283.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "PASTAPRIMAVERAPESTO"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pasta fresh cooked",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Pasta, fresh-refrigerated, plain, cooked",
        "ndb_no": "20094",
        "portion_desc": "custom (g)",
        "portion_grams": 60.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "pesto refrigerated",
        "ing_qty": "2.5 tbsp",
        "sr28_long_desc": "Sauce, pasta, pesto, ready-to-serve, refrigerated",
        "ndb_no": "6626",
        "portion_desc": "custom (g)",
        "portion_grams": 38.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "broccoli cooked",
        "ing_qty": "3.5 oz",
        "sr28_long_desc": "Broccoli, cooked, boiled, drained, without salt",
        "ndb_no": "11091",
        "portion_desc": "custom (g)",
        "portion_grams": 95.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "zucchini raw",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Squash, summer, zucchini, includes skin, raw",
        "ndb_no": "11477",
        "portion_desc": "custom (g)",
        "portion_grams": 90.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_029",
    "food_word": "PASTATOMATOMEATLESS",
    "recipe_name": "Pasta with Tomato Sauce Meatless",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Pasta with tomato sauce no meat canned",
        "ndb_no": "22914",
        "portion_desc": "1 serving (1 NLEA serving)",
        "portion_grams": 252.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "PASTATOMATOMEATLESS"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pasta cooked enriched",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Pasta, cooked, enriched, with added salt",
        "ndb_no": "20321",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "tomato sauce canned",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Tomato products, canned, sauce",
        "ndb_no": "11549",
        "portion_desc": "custom (g)",
        "portion_grams": 176.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "olive oil",
        "ing_qty": "1/2 tsp",
        "sr28_long_desc": "Oil, olive, salad or cooking",
        "ndb_no": "4053",
        "portion_desc": "custom (g)",
        "portion_grams": 2.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_030",
    "food_word": "PASTATORTCHEESE",
    "recipe_name": "Pasta Cheese Tortellini",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Tortellini pasta with cheese filling fresh-refrigerated as purchased",
        "ndb_no": "22901",
        "portion_desc": "0.75 cup",
        "portion_grams": 81.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "PASTATORTCHEESE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "Batch: 140g flour+95g ricotta+65g egg=300g raw\u2192250g cooked; scaled 81/250"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ricotta whole milk",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Cheese, ricotta, whole milk",
        "ndb_no": "1036",
        "portion_desc": "custom (g)",
        "portion_grams": 31.0,
        "serving_count": 1.0,
        "notes": "Filling component; batch technique"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "egg whole raw",
        "ing_qty": "1/6 egg",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "custom (g)",
        "portion_grams": 21.0,
        "serving_count": 1.0,
        "notes": "Pasta dough binder; batch technique"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_006",
    "food_word": "PEANUTSAUCE",
    "recipe_name": "Peanut Sauce",
    "category": "Sides",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "10 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_030",
    "food_word": "PIEBANANACREAM",
    "recipe_name": "Pies Banana Cream",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, banana cream, prepared from mix, no-bake type",
        "ing_qty": "1 slice (~74g)",
        "sr28_long_desc": "Pie, banana cream, prepared from mix, no-bake type",
        "ndb_no": "18303",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, banana cream, prepared from mix, no-bake type",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, banana cream, prepared from mix, no-bake type",
        "ndb_no": "18303",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_031",
    "food_word": "PIEBLUEBERRY",
    "recipe_name": "Pies Blueberry",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, blueberry, commercially prepared",
        "ing_qty": "1 slice (~116g)",
        "sr28_long_desc": "Pie, blueberry, commercially prepared",
        "ndb_no": "18305",
        "portion_desc": "custom (g)",
        "portion_grams": 116.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, blueberry, commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, blueberry, commercially prepared",
        "ndb_no": "18305",
        "portion_desc": "custom (g)",
        "portion_grams": 116.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_032",
    "food_word": "PIEBOSTONCREAM",
    "recipe_name": "Pies Boston Cream",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Cake, boston cream pie, commercially prepared",
        "ing_qty": "1 slice (1/12 of cake)",
        "sr28_long_desc": "Cake, boston cream pie, commercially prepared",
        "ndb_no": "18090",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0,
        "notes": "sponge + custard + chocolate glaze"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "sponge cake base",
        "ing_qty": "45g sponge layer",
        "sr28_long_desc": "Cake, sponge, commercially prepared",
        "ndb_no": "18133",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "vanilla custard cream filling",
        "ing_qty": "20g vanilla custard",
        "sr28_long_desc": "Puddings, vanilla, ready-to-eat",
        "ndb_no": "19201",
        "portion_desc": "custom (g)",
        "portion_grams": 20.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "chocolate frosting glaze",
        "ing_qty": "9g chocolate glaze",
        "sr28_long_desc": "Frostings, chocolate, creamy, ready-to-eat",
        "ndb_no": "19226",
        "portion_desc": "custom (g)",
        "portion_grams": 9.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_033",
    "food_word": "PIECHERRY",
    "recipe_name": "Pies Cherry",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, cherry, commercially prepared",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, cherry, commercially prepared",
        "ndb_no": "18308",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "double-crust cherry pie, 8 slices"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie crust, frozen, baked",
        "ing_qty": "2 crusts / 8",
        "sr28_long_desc": "Pie crust, standard-type, frozen, ready-to-bake, enriched, baked",
        "ndb_no": "18335",
        "portion_desc": "custom (g)",
        "portion_grams": 39.0,
        "serving_count": 1.0,
        "notes": "batch: 2\u00d7154g / 8"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "cherry pie filling, canned",
        "ing_qty": "592g filling / 8",
        "sr28_long_desc": "Pie fillings, canned, cherry",
        "ndb_no": "19314",
        "portion_desc": "custom (g)",
        "portion_grams": 74.0,
        "serving_count": 1.0,
        "notes": "batch: 592g / 8"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_034",
    "food_word": "PIECHOCOLATE",
    "recipe_name": "Pies Chocolate",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, chocolate creme, commercially prepared",
        "ing_qty": "1 serving (1/6 of pie)",
        "sr28_long_desc": "Pie, chocolate creme, commercially prepared",
        "ndb_no": "18310",
        "portion_desc": "custom (g)",
        "portion_grams": 120.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, chocolate creme, commercially prepared",
        "ing_qty": "1 serving",
        "sr28_long_desc": "Pie, chocolate creme, commercially prepared",
        "ndb_no": "18310",
        "portion_desc": "custom (g)",
        "portion_grams": 120.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_035",
    "food_word": "PIECOCONUT",
    "recipe_name": "Pies Coconut",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, coconut creme, commercially prepared",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, coconut creme, commercially prepared",
        "ndb_no": "18313",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, coconut creme, commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, coconut creme, commercially prepared",
        "ndb_no": "18313",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_036",
    "food_word": "PIEDUTCHAPPLE",
    "recipe_name": "Pies Dutch Apple",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, Dutch Apple, Commercially Prepared",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, Dutch Apple, Commercially Prepared",
        "ndb_no": "18944",
        "portion_desc": "custom (g)",
        "portion_grams": 131.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, Dutch Apple, commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, Dutch Apple, Commercially Prepared",
        "ndb_no": "18944",
        "portion_desc": "custom (g)",
        "portion_grams": 131.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_037",
    "food_word": "PIELEMON",
    "recipe_name": "Pies Lemon",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, lemon meringue, commercially prepared",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, lemon meringue, commercially prepared",
        "ndb_no": "18320",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, lemon meringue, commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, lemon meringue, commercially prepared",
        "ndb_no": "18320",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_038",
    "food_word": "PIEMINCE",
    "recipe_name": "Pies Mince",
    "category": "Sweets & Desserts",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "sr28_notes": "May contain suet/meat - verify dietary category",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, mince, prepared from recipe",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, mince, prepared from recipe",
        "ndb_no": "18322",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, mince, prepared from recipe",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, mince, prepared from recipe",
        "ndb_no": "18322",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_039",
    "food_word": "PIEPEACH",
    "recipe_name": "Pies Peach",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, peach",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, peach",
        "ndb_no": "18323",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, peach",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, peach",
        "ndb_no": "18323",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_040",
    "food_word": "PIEPECAN",
    "recipe_name": "Pies Pecan",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, pecan, commercially prepared",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, pecan, commercially prepared",
        "ndb_no": "18324",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, pecan, commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, pecan, commercially prepared",
        "ndb_no": "18324",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SWEET_041",
    "food_word": "PIEPUMPKIN",
    "recipe_name": "Pies Pumpkin",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "50 mins",
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_name": "Pie, pumpkin, commercially prepared",
        "ing_qty": "1 slice (1/8 of 9\" pie)",
        "sr28_long_desc": "Pie, pumpkin, commercially prepared",
        "ndb_no": "18326",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie, pumpkin, commercially prepared",
        "ing_qty": "1 slice",
        "sr28_long_desc": "Pie, pumpkin, commercially prepared",
        "ndb_no": "18326",
        "portion_desc": "custom (g)",
        "portion_grams": 113.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_007",
    "food_word": "POTATOESSCALLOPED",
    "recipe_name": "Scalloped Potatoes",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SALAD_001",
    "food_word": "POTATOSALAD",
    "recipe_name": "Potato Salad",
    "category": "Salads",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_006",
    "food_word": "QUESADILLACHEESE",
    "recipe_name": "Quesadilla Cheese",
    "category": "Lunch",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "10 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Mexican cheese quesadilla",
        "ndb_no": "36052",
        "portion_desc": "1 quesadilla 8-10 inch",
        "portion_grams": 194.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "flour tortilla",
        "ing_qty": "2 tortillas",
        "sr28_long_desc": "Tortillas ready-to-bake or -fry flour shelf stable",
        "ndb_no": "18970",
        "portion_desc": "1 tortilla",
        "portion_grams": 49.0,
        "serving_count": 2.0,
        "notes": "8-inch tortillas"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese",
        "ing_qty": "3 oz shredded",
        "sr28_long_desc": "Cheese cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 85.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "butter",
        "ing_qty": "1.5 tsp",
        "sr28_long_desc": "Butter salted",
        "ndb_no": "1001",
        "portion_desc": "custom (g)",
        "portion_grams": 7.0,
        "serving_count": 1.0,
        "notes": "For cooking on griddle"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "queso asadero",
        "ing_qty": "1 tbsp",
        "sr28_long_desc": "Cheese mexican queso asadero",
        "ndb_no": "1166",
        "portion_desc": "custom (g)",
        "portion_grams": 4.0,
        "serving_count": 1.0,
        "notes": "Restaurant blend component"
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_031",
    "food_word": "RAVIOLI",
    "recipe_name": "Ravioli",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Italian cheese ravioli with marinara sauce",
        "ndb_no": "36055",
        "portion_desc": "1 serving",
        "portion_grams": 427.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference; restaurant serving",
        "game_food": "RAVIOLI"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pasta fresh cooked",
        "ing_qty": "5.5 oz",
        "sr28_long_desc": "Pasta, fresh-refrigerated, plain, cooked",
        "ndb_no": "20094",
        "portion_desc": "custom (g)",
        "portion_grams": 158.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ricotta whole milk",
        "ing_qty": "6 tbsp",
        "sr28_long_desc": "Cheese, ricotta, whole milk",
        "ndb_no": "1036",
        "portion_desc": "custom (g)",
        "portion_grams": 87.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "marinara sauce",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sauce, pasta, spaghetti/marinara, ready-to-serve",
        "ndb_no": "6931",
        "portion_desc": "custom (g)",
        "portion_grams": 140.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "parmesan hard grated",
        "ing_qty": "3 tbsp",
        "sr28_long_desc": "Cheese, parmesan, hard",
        "ndb_no": "1033",
        "portion_desc": "custom (g)",
        "portion_grams": 22.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "butter salted",
        "ing_qty": "1.5 tbsp",
        "sr28_long_desc": "Butter, salted",
        "ndb_no": "1001",
        "portion_desc": "custom (g)",
        "portion_grams": 20.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_008",
    "food_word": "RICEFRIED",
    "recipe_name": "Chinese Rice Fried",
    "category": "Sides",
    "dietary_category": "vegan",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_009",
    "food_word": "ROLLDINNER",
    "recipe_name": "Dinner Roll",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "12 rolls",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_010",
    "food_word": "ROLLDINNERSWEET",
    "recipe_name": "Sweet Dinner Roll",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 mins",
    "servings": "12 rolls",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SIDE_011",
    "food_word": "ROLLDINNERWHOLE",
    "recipe_name": "Whole Wheat Dinner Roll",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "12 rolls",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_007",
    "food_word": "SANDSUBBLT",
    "recipe_name": "Sandwich Sub BLT",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "10 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods submarine sandwich bacon lettuce and tomato on white bread",
        "ndb_no": "21162",
        "portion_desc": "6 inch sub",
        "portion_grams": 148.0,
        "serving_count": 1.0,
        "notes": "SR28 whole-dish reference"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "white sub roll",
        "ing_qty": "1 roll",
        "sr28_long_desc": "Bread white commercially prepared",
        "ndb_no": "18075",
        "portion_desc": "custom (g)",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "6-inch sub roll; white Italian bread proxy"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "bacon cooked",
        "ing_qty": "3 strips",
        "sr28_long_desc": "Pork cured bacon pre-sliced cooked pan-fried",
        "ndb_no": "10862",
        "portion_desc": "custom (g)",
        "portion_grams": 24.0,
        "serving_count": 1.0,
        "notes": "3 strips \u00d7 8g each"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "lettuce",
        "ing_qty": "2 leaves",
        "sr28_long_desc": "Lettuce butterhead includes boston and bibb types raw",
        "ndb_no": "11250",
        "portion_desc": "custom (g)",
        "portion_grams": 20.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "tomato",
        "ing_qty": "2 slices",
        "sr28_long_desc": "Tomatoes red ripe raw year round average",
        "ndb_no": "11529",
        "portion_desc": "custom (g)",
        "portion_grams": 46.0,
        "serving_count": 1.0,
        "notes": "2 slices \u00d7 23g"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "mayonnaise",
        "ing_qty": "2 tsp",
        "sr28_long_desc": "Salad dressing mayonnaise regular",
        "ndb_no": "4025",
        "portion_desc": "custom (g)",
        "portion_grams": 10.0,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Cook bacon in a skillet over medium heat until crispy. Drain on paper towels."
      },
      {
        "step_order": 2,
        "step_text": "Toast the sub roll until lightly golden."
      },
      {
        "step_order": 3,
        "step_text": "Spread mayonnaise on both cut sides of the roll."
      },
      {
        "step_order": 4,
        "step_text": "Layer lettuce and tomato slices on the bottom half. Add bacon and close the sandwich."
      }
    ]
  },
  {
    "recipe_id": "SIDE_012",
    "food_word": "SAUCE",
    "recipe_name": "Cheese Sauce",
    "category": "Sides",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_008",
    "food_word": "SOUPEGGDROP",
    "recipe_name": "Soup Egg Drop",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "LUNCH_009",
    "food_word": "SOUPHOTSOUR",
    "recipe_name": "Soup Hot Sour",
    "category": "Lunch",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "SALAD_002",
    "food_word": "TACOSALAD",
    "recipe_name": "Taco Salad",
    "category": "Salads",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "1 serving",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "DINR_032",
    "food_word": "TACOBEEF",
    "recipe_name": "Taco Beef Lettuce Cheese",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 tacos",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods taco with beef cheese and lettuce hard shell",
        "ndb_no": "21082",
        "portion_desc": "1 each taco",
        "portion_grams": 69.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "TACOBEEF"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "taco shell baked",
        "ing_qty": "1 shell",
        "sr28_long_desc": "Taco shells, baked",
        "ndb_no": "18360",
        "portion_desc": "custom (g)",
        "portion_grams": 11.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ground beef 90/10 cooked",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Beef, ground, 90% lean meat / 10% fat, loaf, cooked, baked",
        "ndb_no": "23566",
        "portion_desc": "custom (g)",
        "portion_grams": 30.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "1/3 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 9.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "lettuce iceberg",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Lettuce, iceberg (includes crisphead types), raw",
        "ndb_no": "11252",
        "portion_desc": "custom (g)",
        "portion_grams": 9.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "tomato raw",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Tomatoes, red, ripe, raw, year round average",
        "ndb_no": "11529",
        "portion_desc": "custom (g)",
        "portion_grams": 10.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_033",
    "food_word": "TACOCHICKEN",
    "recipe_name": "Taco Chicken Lettuce Cheese",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "20 mins",
    "servings": "2 tacos",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Fast foods taco with chicken lettuce and cheese soft",
        "ndb_no": "21487",
        "portion_desc": "1 each taco",
        "portion_grams": 98.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "TACOCHICKEN"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "flour tortilla small",
        "ing_qty": "1 small",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
        "ndb_no": "18364",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "chicken breast roasted",
        "ing_qty": "1.5 oz",
        "sr28_long_desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
        "ndb_no": "5064",
        "portion_desc": "custom (g)",
        "portion_grams": 38.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "1/3 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 10.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "salsa ready-to-serve",
        "ing_qty": "2 tbsp",
        "sr28_long_desc": "Sauce, salsa, ready-to-serve",
        "ndb_no": "6164",
        "portion_desc": "custom (g)",
        "portion_grams": 25.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_034",
    "food_word": "TAMALESCHEESE",
    "recipe_name": "Tamales Cheese",
    "category": "Dinner",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Mexican cheese tamales",
        "ndb_no": "36056",
        "portion_desc": "1 serving (1-3 tamales)",
        "portion_grams": 302.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "TAMALESCHEESE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "corn tortilla dough",
        "ing_qty": "portion",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, corn",
        "ndb_no": "18363",
        "portion_desc": "custom (g)",
        "portion_grams": 155.0,
        "serving_count": 1.0,
        "notes": "Masa proxy \u2014 corn tortilla dough"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "cheddar cheese shredded",
        "ing_qty": "2.5 oz",
        "sr28_long_desc": "Cheese, cheddar",
        "ndb_no": "1009",
        "portion_desc": "custom (g)",
        "portion_grams": 70.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "enchilada sauce",
        "ing_qty": "5 tbsp",
        "sr28_long_desc": "PACE, Enchilada Sauce",
        "ndb_no": "6599",
        "portion_desc": "custom (g)",
        "portion_grams": 77.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_035",
    "food_word": "TAMALESPORK",
    "recipe_name": "Tamales Pork",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Restaurant Latino tamale pork",
        "ndb_no": "36412",
        "portion_desc": "1 piece",
        "portion_grams": 142.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "TAMALESPORK"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "corn tortilla dough",
        "ing_qty": "portion",
        "sr28_long_desc": "Tortillas, ready-to-bake or -fry, corn",
        "ndb_no": "18363",
        "portion_desc": "custom (g)",
        "portion_grams": 77.0,
        "serving_count": 1.0,
        "notes": "Masa proxy \u2014 corn tortilla dough"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "pork shoulder roasted lean",
        "ing_qty": "1 oz",
        "sr28_long_desc": "Pork, fresh, shoulder, whole, separable lean only, cooked, roasted",
        "ndb_no": "10073",
        "portion_desc": "custom (g)",
        "portion_grams": 28.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "enchilada sauce",
        "ing_qty": "2.5 tbsp",
        "sr28_long_desc": "PACE, Enchilada Sauce",
        "ndb_no": "6599",
        "portion_desc": "custom (g)",
        "portion_grams": 37.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "DINR_036",
    "food_word": "TRIPE",
    "recipe_name": "Tripe",
    "category": "Dinner",
    "dietary_category": "all",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Beef variety meats and by-products tripe cooked simmered",
        "ndb_no": "23640",
        "portion_desc": "1 serving",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "TRIPE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "beef tripe cooked simmered",
        "ing_qty": "3 oz",
        "sr28_long_desc": "Beef, variety meats and by-products, tripe, cooked, simmered",
        "ndb_no": "23640",
        "portion_desc": "custom (g)",
        "portion_grams": 85.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  },
  {
    "recipe_id": "SALAD_003",
    "food_word": "TUNASALAD",
    "recipe_name": "Tuna Salad",
    "category": "Salads",
    "dietary_category": "pesca",
    "link_type": "dish",
    "prep_time": "15 mins",
    "servings": "4 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [],
    "instructions": []
  },
  {
    "recipe_id": "DINR_037",
    "food_word": "TURKEYPOTPIE",
    "recipe_name": "Turkey Pot Pie",
    "category": "Dinner",
    "dietary_category": "pollo",
    "link_type": "dish",
    "prep_time": "60 mins",
    "servings": "6 servings",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "sr28_long_desc": "Turkey Pot Pie frozen entree",
        "ndb_no": "22528",
        "portion_desc": "1 package yields",
        "portion_grams": 397.0,
        "serving_count": 1.0,
        "notes": "SR28 dish-only reference",
        "game_food": "TURKEYPOTPIE"
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "pie crust baked",
        "ing_qty": "portion",
        "sr28_long_desc": "Pie crust, standard-type, frozen, ready-to-bake, enriched, baked",
        "ndb_no": "18335",
        "portion_desc": "custom (g)",
        "portion_grams": 90.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "turkey breast roasted",
        "ing_qty": "2 oz",
        "sr28_long_desc": "Turkey, all classes, breast, meat and skin, cooked, roasted",
        "ndb_no": "5192",
        "portion_desc": "custom (g)",
        "portion_grams": 50.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "peas green cooked",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Peas, green, cooked, boiled, drained, without salt",
        "ndb_no": "11305",
        "portion_desc": "custom (g)",
        "portion_grams": 75.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "potato boiled",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Potatoes, boiled, cooked without skin, flesh, without salt",
        "ndb_no": "11367",
        "portion_desc": "custom (g)",
        "portion_grams": 65.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "chicken gravy canned",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Gravy, chicken, canned or bottled, ready-to-serve",
        "ndb_no": "6119",
        "portion_desc": "custom (g)",
        "portion_grams": 117.0,
        "serving_count": 1.0
      }
    ],
    "instructions": []
  }
];

/** Look up a recipe by its food_word key */
export function getRecipeByWord(word: string): Recipe | undefined {
  return RECIPES.find(r => r.food_word === word);
}

/** All published recipes */
export function publishedRecipes(): Recipe[] {
  return RECIPES.filter(r => r.status === 'published');
}
