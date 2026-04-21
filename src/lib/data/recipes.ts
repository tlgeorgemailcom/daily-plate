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
    "servings": "8 slices",
    "sr28_rule": "Rule 1",
    "status": "todo",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, apple, prepared from recipe",
        "ndb_no": "18302",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 250.0,
        "serving_count": 1.0,
        "notes": "section=crust",
        "game_food": "bread"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.25,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "5 tablespoon",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 75.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2 teaspoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 8.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "apple pie filling, canned",
        "ing_qty": "1 can (21 ounces)",
        "sr28_long_desc": "Pie fillings, apple, canned",
        "ndb_no": "19312",
        "portion_desc": "custom (g)",
        "portion_grams": 595.0,
        "serving_count": 1.0,
        "notes": "section=filling",
        "game_food": "apple"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "5 tablespoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "lemon juice",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Lemon juice, raw",
        "ndb_no": "9152",
        "portion_desc": "g",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "4 tablespoon",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 31.25,
        "serving_count": 1.0,
        "notes": "section=filling",
        "game_food": "bread"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "Optional: ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0,
        "notes": "optional;section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "Optional: ground cloves",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cloves, ground",
        "ndb_no": "2011",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0,
        "notes": "optional;section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "Optional: allspice",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, allspice, ground",
        "ndb_no": "2001",
        "portion_desc": "g",
        "portion_grams": 2.0,
        "serving_count": 1.0,
        "notes": "optional;section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust whisk the all-purpose enriched white flour, salt and sugar together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water just until the dough comes together. Divide into two discs and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll out one disc and line the bottom of a 9-inch pie plate. Stir the apple pie filling with the sugar, lemon juice, butter, and all-purpose enriched white flour, plus any optional cinnamon, cloves, or allspice, then spoon it into the crust."
      },
      {
        "step_order": 4,
        "step_text": "Roll out the top crust and place it over the filling. Seal and crimp the edges then cut vents in the top crust."
      },
      {
        "step_order": 5,
        "step_text": "Bake for 15 minutes. Lower the oven to 350 degrees F (175 degrees C) and bake 35 to 40 minutes more until the crust is golden brown and the filling is bubbling. Cool on a rack before slicing."
      }
    ]
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
