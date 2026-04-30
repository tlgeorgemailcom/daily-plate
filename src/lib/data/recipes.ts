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
    "prep_time": "45 min",
    "servings": "8 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during the saucepan pre-cook and oven bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18302 within an average macro discrepancy of 1.9%.",
    "status": "published",
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
        "ing_qty": "1 3/4 cups + 2 tbsp",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 234.4,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1 1/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 6.5,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "5 1/4 tablespoon (0.6 stick)",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 74.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening",
        "ing_qty": "5 tablespoon (2.25 oz)",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 64.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "5 tablespoon ice water",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 74.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "Granny Smith apples (peeled and cored)",
        "ing_qty": "6 medium apples (peeled and cored)",
        "sr28_long_desc": "Apples, raw, granny smith, with skin",
        "ndb_no": "9502",
        "portion_desc": "g",
        "portion_grams": 750.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 130.0,
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
        "ing_name": "unsalted butter (cut into pieces)",
        "ing_qty": "2 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 28.4,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "3 tablespoon",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 24.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
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
        "ing_name": "ground cloves",
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
        "ing_name": "allspice",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, allspice, ground",
        "ndb_no": "2001",
        "portion_desc": "g",
        "portion_grams": 2.0,
        "serving_count": 1.0,
        "notes": "optional;section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust whisk the flour and salt together. Cut in the chilled butter and shortening until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into two discs and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "In a large saucepan, combine the peeled and cored Granny Smith apple slices with the sugar, lemon juice, cornstarch, butter, and 1/4 cup water, plus any optional cinnamon, cloves, or allspice. Bring to a boil over medium heat, then reduce heat, cover, and simmer for 5 minutes, stirring occasionally. Uncover and simmer 5 minutes more, until the apples are slightly softened and the juices have thickened. Remove from heat and let cool while you roll out the crust."
      },
      {
        "step_order": 4,
        "step_text": "Roll out one disc and line the bottom of a 9-inch pie plate. Spoon the cooled apple filling into the crust, mounding slightly in the center."
      },
      {
        "step_order": 5,
        "step_text": "Roll out the second disc and cut into 1/2-inch strips. Lay the strips over the filling in a lattice pattern, weaving them over and under. Trim and crimp the edges to seal."
      },
      {
        "step_order": 6,
        "step_text": "Bake for 15 minutes. Lower the oven to 350 degrees F (175 degrees C) and bake 35 to 40 minutes more until the crust is golden brown and the filling is bubbling. Cool on a rack before slicing."
      }
    ]
  },
  {
    "recipe_id": "SWEET_002",
    "food_word": "APPLESTRUDEL",
    "recipe_name": "Apple Strudel",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "40 min",
    "servings": "12 pieces",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect water loss during the saucepan pre-cook and oven bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18354 within an average macro discrepancy of 1.8%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Strudel, apple",
        "ndb_no": "18354",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "puff pastry sheet",
        "ing_qty": "1 sheet",
        "sr28_long_desc": "Puff pastry, frozen, ready-to-bake, baked",
        "ndb_no": "18211",
        "portion_desc": "g",
        "portion_grams": 245.0,
        "serving_count": 1.0,
        "notes": "section=pastry"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "flour for dusting",
        "ing_qty": "2 tablespoons (for dusting)",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 16.0,
        "serving_count": 1.0,
        "notes": "section=pastry"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "Granny Smith apples (thinly sliced)",
        "ing_qty": "5 cups thinly sliced",
        "sr28_long_desc": "Apples, raw, granny smith, with skin",
        "ndb_no": "9502",
        "portion_desc": "g",
        "portion_grams": 542.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "3/4 cup + 2 tablespoons",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 160.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 36.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "raisins",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Raisins, seedless",
        "ndb_no": "9298",
        "portion_desc": "g",
        "portion_grams": 80.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "flour (for thickening)",
        "ing_qty": "2 tablespoons (for thickening)",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 16.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "water (evaporates during simmer)",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 59.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "dry bread crumbs",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Bread crumbs, dry, grated, plain",
        "ndb_no": "18079",
        "portion_desc": "g",
        "portion_grams": 55.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "butter (for browning the bread crumbs)",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 42.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
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
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "salt (pinch)",
        "ing_qty": "1/4 teaspoon (heaping)",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.3,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "optional;section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "large egg (beaten (for sealing and basting the pastry))",
        "ing_qty": "1 large egg",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=finish"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 375 degrees F (190 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "Melt the butter in a skillet and cook the bread crumbs over medium heat until lightly golden, then let them cool slightly."
      },
      {
        "step_order": 3,
        "step_text": "Combine apples, sugar, brown sugar, raisins, lemon juice, cinnamon, flour and 1/4 cup water in a sauce pan and bring to a boil. Cover and simmer for 5 minutes, stir occasionally, then uncover and simmer until thickened, about 5 minutes. The added water should evaporate."
      },
      {
        "step_order": 4,
        "step_text": "Roll the puff pastry to a 1/8 inch sheet or 16x12 rectangle on a lightly floured surface."
      },
      {
        "step_order": 5,
        "step_text": "Sprinkle the browned bread crumbs along one long side of the pastry several inches in, leaving a border on the sides so the roll can be sealed; the crumbs absorb juices and keep the bottom from going soggy."
      },
      {
        "step_order": 6,
        "step_text": "Spoon the cooled filling on top of the bread crumbs."
      },
      {
        "step_order": 7,
        "step_text": "Brush the exposed border with beaten egg. Fold the long end halfway over the filling then fold in the short ends. Continue rolling the pastry around the filling into a long strudel and seal the edge with egg. Tuck ends under. Place it seam-side down on a lined baking sheet. Brush with the remaining egg."
      },
      {
        "step_order": 8,
        "step_text": "Bake for about 30-40 minutes or until the pastry is browned and crisp and the apple filling is tender. Cool before slicing."
      }
    ]
  },
  {
    "recipe_id": "SWEET_003",
    "food_word": "BANANACREAMPIE",
    "recipe_name": "Pie Banana Cream",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "40 min",
    "servings": "8 slices",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect water loss during the bake of the crust and the cream filling set. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18304 within an average macro discrepancy of 4.5%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, banana cream, prepared from recipe",
        "ndb_no": "18304",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "3 tablespoon ice water",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 488.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/3 cup + 1 tablespoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 80.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "4 tablespoons",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 32.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 16.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon heaping",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "egg yolks (lightly beaten)",
        "ing_qty": "3 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 51.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "butter (cut into pieces)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "bananas (sliced ~1/4 inch thick)",
        "ing_qty": "2 1/2 medium (sliced)",
        "sr28_long_desc": "Bananas, raw",
        "ndb_no": "9040",
        "portion_desc": "g",
        "portion_grams": 295.0,
        "serving_count": 1.0,
        "notes": "section=assembly"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "heavy cream",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Cream, fluid, heavy whipping",
        "ndb_no": "1053",
        "portion_desc": "g",
        "portion_grams": 180.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "powdered sugar",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Sugars, powdered",
        "ndb_no": "19336",
        "portion_desc": "g",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 16,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0,
        "notes": "optional;section=topping"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the chilled dough into a 12-inch circle and fit into a 9-inch pie plate, trimming and crimping the edges. Line with parchment, fill with pie weights or dried beans, and blind-bake for 15 minutes. Remove the weights and bake 8-10 minutes more, until the crust is golden brown. Cool completely on a rack."
      },
      {
        "step_order": 4,
        "step_text": "For the pastry cream, whisk the sugar, cornstarch, and salt together in a heavy saucepan. Whisk in the milk a little at a time to keep the cornstarch smooth. Bring to a boil over medium heat, whisking constantly, until thick and bubbling, about 5-7 minutes. Boil 1 minute more, still whisking."
      },
      {
        "step_order": 5,
        "step_text": "Whisk a ladleful of the hot mixture into the egg yolks to temper, then whisk the tempered yolks back into the saucepan. Cook over medium-low heat, whisking constantly, for 2 more minutes until very thick. Remove from heat and whisk in the butter and vanilla until smooth."
      },
      {
        "step_order": 6,
        "step_text": "Spread half of the warm pastry cream over the cooled crust. Layer the sliced bananas evenly on top, then spread the remaining pastry cream over the bananas. Press plastic wrap directly onto the surface to prevent a skin from forming."
      },
      {
        "step_order": 7,
        "step_text": "Refrigerate the pie for at least 4 hours or until fully chilled and set."
      },
      {
        "step_order": 8,
        "step_text": "Just before serving, beat the heavy cream with the powdered sugar and vanilla until soft peaks form, then spread or pipe over the chilled pie. Slice with a clean knife and serve immediately."
      }
    ]
  },
  {
    "recipe_id": "SWEET_004",
    "food_word": "BLUEBERRYPIE",
    "recipe_name": "Pie Blueberry",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "8 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during the double-crust bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18306 within an average macro discrepancy of 1.4%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, blueberry, prepared from recipe",
        "ndb_no": "18306",
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
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "3/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (chilled)",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "5 tablespoon ice water",
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
        "ing_qty": "2 teaspoons",
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
        "ing_name": "blueberries (fresh)",
        "ing_qty": "5 cups",
        "sr28_long_desc": "Blueberries, raw",
        "ndb_no": "9050",
        "portion_desc": "g",
        "portion_grams": 740.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 32.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
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
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 1.3,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (dotted on top of filling)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "large egg (beaten with 1 tsp water; brush onto lattice)",
        "ing_qty": "1 large egg (for wash; ~half adheres)",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "1 teaspoon (egg wash)",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into two discs (one slightly larger than the other for the bottom crust), and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving a 1-inch overhang. Refrigerate while preparing the filling."
      },
      {
        "step_order": 4,
        "step_text": "In a large bowl, gently toss the blueberries with the sugar, cornstarch, lemon juice, cinnamon, and salt until evenly coated. Pour into the prepared crust, mounding slightly in the center, and dot the top with the butter."
      },
      {
        "step_order": 5,
        "step_text": "Roll out the second disc into an 11-inch circle, cut into 1/2-inch-wide strips, and weave into a lattice on top of the pie. Trim, crimp, and seal the lattice to the bottom crust."
      },
      {
        "step_order": 6,
        "step_text": "Lightly beat 1 large egg with 1 teaspoon water; brush the egg wash evenly over the lattice top to give it a deep golden, glossy finish during baking."
      },
      {
        "step_order": 7,
        "step_text": "Bake at 425 degrees F (220 degrees C) for 25 minutes to set the crust and activate the cornstarch. Reduce the heat to 375 degrees F (190 degrees C) and shield the crust edges with a 2- to 3-inch strip of aluminum foil (or a pie crust shield) to prevent over-browning. Continue baking for 50-55 minutes more (total bake time roughly 75-80 minutes), removing the foil for the last 15 minutes, until the crust is deep golden brown and the filling is bubbling thickly across the entire surface. An instant-read thermometer inserted through the lattice should read about 200 degrees F (93 degrees C)."
      },
      {
        "step_order": 8,
        "step_text": "Cool the pie on a wire rack for at least 3 hours before slicing to allow the filling to set. Serve at room temperature or slightly warm."
      }
    ]
  },
  {
    "recipe_id": "SWEET_005",
    "food_word": "CHERRYPIE",
    "recipe_name": "Pie Cherry",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 min",
    "servings": "8 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during the double-crust bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18309 within an average macro discrepancy of 1.4%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, cherry, prepared from recipe",
        "ndb_no": "18309",
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
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "3/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (chilled)",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "5 tablespoon ice water",
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
        "ing_qty": "2 teaspoons",
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
        "ing_name": "fresh or thawed frozen tart cherries, pitted",
        "ing_qty": "4 cups (pitted)",
        "sr28_long_desc": "Cherries, sour, red, raw",
        "ndb_no": "9063",
        "portion_desc": "g",
        "portion_grams": 620.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 32.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
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
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (dotted on top of filling)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "large egg (beaten with 1 tsp water; brush onto lattice)",
        "ing_qty": "1 large egg (for wash; ~half adheres)",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "1 teaspoon (egg wash)",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into two discs (one slightly larger than the other for the bottom crust) and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "While the dough chills, pit and halve the cherries. Add them to a medium saucepan with the sugar and lemon juice, and toss to combine. Cook over medium heat for a few minutes, stirring occasionally, until the cherries have released their juices."
      },
      {
        "step_order": 4,
        "step_text": "Use a slotted spoon to transfer the cherries into a bowl, leaving the juices in the saucepan. Spoon a few tablespoons of the hot juice into a small container, stir in the cornstarch until fully dissolved, then return the slurry to the saucepan with the remaining juices. Cook over medium heat for a few minutes, stirring constantly, until the sauce has thickened. Pour the thickened sauce over the cherries, stir in the salt, and set aside to cool slightly."
      },
      {
        "step_order": 5,
        "step_text": "Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving a 1-inch overhang. Pour the cooled cherry filling into the prepared crust and dot the top with the butter."
      },
      {
        "step_order": 6,
        "step_text": "Roll out the second disc into an 11-inch circle, cut into 1/2-inch-wide strips, and weave into a lattice on top of the pie. Trim, crimp, and seal the lattice to the bottom crust."
      },
      {
        "step_order": 7,
        "step_text": "Lightly beat 1 large egg with 1 teaspoon water; brush the egg wash evenly over the lattice top to give it a deep golden, glossy finish during baking."
      },
      {
        "step_order": 8,
        "step_text": "Bake at 425 degrees F (220 degrees C) for 25 minutes to set the crust. Reduce the heat to 375 degrees F (190 degrees C) and shield the crust edges with a 2- to 3-inch strip of aluminum foil (or a pie crust shield) to prevent over-browning. Continue baking for 50-55 minutes more (total bake time roughly 75-80 minutes), removing the foil for the last 15 minutes, until the crust is deep golden brown and the filling is bubbling thickly across the entire surface. An instant-read thermometer inserted through the lattice should read about 200 degrees F (93 degrees C)."
      },
      {
        "step_order": 9,
        "step_text": "Cool the pie on a wire rack for at least 3 hours before slicing to allow the filling to set. Serve at room temperature or slightly warm."
      }
    ]
  },
  {
    "recipe_id": "SWEET_006",
    "food_word": "LEMONMERINGUEPIE",
    "recipe_name": "Pie Lemon Meringue",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 min",
    "servings": "8 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during the bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18321 within an average macro discrepancy of 4.4%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, lemon meringue, prepared from recipe",
        "ndb_no": "18321",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (chilled)",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "3 tablespoon ice water",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "finely grated zest",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Lemon peel, raw",
        "ndb_no": "9156",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "egg yolks (reserve whites)",
        "ing_qty": "5 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (cut into 1/2-inch pieces)",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "lemon juice (fresh squeezed)",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Lemon juice, raw",
        "ndb_no": "9152",
        "portion_desc": "g",
        "portion_grams": 160.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "ice water (whisked with cornstarch into slurry)",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 237.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "cornstarch (slurry with water)",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 32.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "egg whites (room temperature; pair with 5 yolks above)",
        "ing_qty": "5 large whites",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 165.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 133.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=topping"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a single disc and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the chilled dough into a 12-inch circle and fit into a 9-inch pie plate, trimming and crimping the edges. Line with parchment, fill with pie weights or dried beans, and blind-bake for 15 minutes. Remove the weights and bake 8-10 minutes more, until the crust is golden brown. Cool completely on a rack. Reduce oven temperature to 350 degrees F (175 degrees C)."
      },
      {
        "step_order": 4,
        "step_text": "For the curd, whisk together the sugar, lemon zest, yolks, and salt in a heavy saucepan. In a separate bowl, whisk the cold water with the cornstarch until smooth, then whisk into the saucepan along with the lemon juice."
      },
      {
        "step_order": 5,
        "step_text": "Cook over medium heat, whisking constantly, until the mixture thickens and just comes to a gentle boil, about 8-10 minutes. Remove from heat and whisk in the butter a few pieces at a time until smooth and glossy. Pour the warm curd directly into the cooled crust and smooth the top."
      },
      {
        "step_order": 6,
        "step_text": "For the meringue, combine the egg whites, sugar, and salt in a large bowl. Beat on medium-high until stiff, glossy peaks form."
      },
      {
        "step_order": 7,
        "step_text": "Pile the meringue onto the pie, spreading it so it touches the crust all the way around to seal."
      },
      {
        "step_order": 8,
        "step_text": "Bake at 350F until the meringue begins to brown, 8-10 minutes."
      },
      {
        "step_order": 9,
        "step_text": "Cool the pie on a wire rack for at least 1 hour, then refrigerate for at least 3 hours before slicing to allow the filling to set fully."
      }
    ]
  },
  {
    "recipe_id": "SWEET_007",
    "food_word": "MINCEPIE",
    "recipe_name": "Pie Mince",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 min",
    "servings": "8 slices",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect water loss during the pre-cooked mincemeat simmer and the double-crust bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18322 within an average macro discrepancy of 4.4%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, mince, prepared from recipe",
        "ndb_no": "18322",
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
        "notes": "section=crust"
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
        "ing_name": "unsalted butter (chilled, cubed)",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "5 tablespoons",
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
        "ing_qty": "2 teaspoons",
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
        "ing_name": "dark raisins",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Raisins, seedless",
        "ndb_no": "9298",
        "portion_desc": "g",
        "portion_grams": 75.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "golden raisins",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Raisins, golden seedless",
        "ndb_no": "9297",
        "portion_desc": "g",
        "portion_grams": 75.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "currants",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Currants, zante, dried",
        "ndb_no": "9085",
        "portion_desc": "g",
        "portion_grams": 75.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "dried cranberries",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Cranberries, dried, sweetened",
        "ndb_no": "9079",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "medjool dates (pitted, chopped)",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Dates, medjool",
        "ndb_no": "9421",
        "portion_desc": "g",
        "portion_grams": 75.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "dried apricots (chopped)",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Apricots, dried, sulfured, uncooked",
        "ndb_no": "9032",
        "portion_desc": "g",
        "portion_grams": 65.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "mixed candied peel/citron",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Candied fruit",
        "ndb_no": "9426",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "peeled, cored, finely chopped",
        "ing_qty": "3 medium apples",
        "sr28_long_desc": "Apples, raw, granny smith, with skin",
        "ndb_no": "9502",
        "portion_desc": "g",
        "portion_grams": 360.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "brown sugar (packed)",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 110.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (cut into pieces)",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 42.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 16,
        "row_type": "ingredient",
        "ing_name": "ice water (or unsweetened apple juice)",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 160.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 17,
        "row_type": "ingredient",
        "ing_name": "grated zest",
        "ing_qty": "zest of 1 lemon",
        "sr28_long_desc": "Lemon peel, raw",
        "ndb_no": "9156",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 18,
        "row_type": "ingredient",
        "ing_name": "lemon juice",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Lemon juice, raw",
        "ndb_no": "9152",
        "portion_desc": "g",
        "portion_grams": 30.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 19,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 20,
        "row_type": "ingredient",
        "ing_name": "ground nutmeg",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, nutmeg, ground",
        "ndb_no": "2025",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 21,
        "row_type": "ingredient",
        "ing_name": "ground cloves",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, cloves, ground",
        "ndb_no": "2011",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 22,
        "row_type": "ingredient",
        "ing_name": "ground ginger",
        "ing_qty": "1/8 teaspoon",
        "sr28_long_desc": "Spices, ginger, ground",
        "ndb_no": "2021",
        "portion_desc": "g",
        "portion_grams": 0.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 23,
        "row_type": "ingredient",
        "ing_name": "allspice",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, allspice, ground",
        "ndb_no": "2001",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 24,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "3/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 25,
        "row_type": "ingredient",
        "ing_name": "~25g of beaten egg adheres to lattice",
        "ing_qty": "1 large egg",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      },
      {
        "row_order": 26,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust, whisk the flour, salt, and sugar together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into 2 discs (one slightly larger for the bottom) and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving overhang. Roll the second disc and cut into 1/2-inch strips for the lattice."
      },
      {
        "step_order": 4,
        "step_text": "For the mincemeat, melt the butter in a large saucepan over medium heat. Add the apples, dark and golden raisins, currants, dried cranberries, chopped dates and apricots, candied peel, brown sugar, lemon zest, lemon juice, water, cinnamon, nutmeg, cloves, ginger, allspice, and salt. Bring to a boil, stirring often, then reduce the heat to low and simmer, stirring frequently, until the apples have softened and most of the liquid has cooked away, about 25-30 minutes. The mixture should be glossy and thickened. Cool slightly. (Optional make-ahead: cool completely, transfer to an airtight container, and refrigerate up to 1 week; flavors deepen with rest. Stir in a tablespoon of rum or brandy weekly to keep up to 1 month.)"
      },
      {
        "step_order": 5,
        "step_text": "Pour the warm mincemeat into the prepared crust and smooth the top. Lay the lattice strips over the filling in a woven pattern. Trim, fold, and crimp the edges to seal."
      },
      {
        "step_order": 6,
        "step_text": "Whisk the egg with 1 teaspoon of water and brush the lattice top."
      },
      {
        "step_order": 7,
        "step_text": "Bake at 425F for 20 minutes, then reduce the temperature to 375F and bake for another 30-35 minutes, until the crust is deep golden brown and the filling is bubbling. Tent loosely with foil if the crust browns too quickly."
      },
      {
        "step_order": 8,
        "step_text": "Cool the pie on a wire rack for at least 2 hours before slicing to allow the filling to set."
      }
    ]
  },
  {
    "recipe_id": "SWEET_008",
    "food_word": "PEACHPIE",
    "recipe_name": "Pie Peach",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "60 min",
    "servings": "8 slices",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade peach pie spec. NOT validated against USDA SR Legacy NDB 18323 because that canonical entry's protein (1.9 g/100g) and fiber (0.8 g/100g) are inconsistent with any double-crust pie made with a standard wheat-flour shell \u2014 the crust alone exceeds those totals. Free-tier nutrient values are computed from the ingredients in this recipe; paid-tier values may substitute canonical fields where appropriate.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, peach",
        "ndb_no": "18323",
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
        "notes": "section=crust"
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
        "ing_name": "unsalted butter (chilled, cubed)",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "5 tablespoons",
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
        "ing_qty": "2 teaspoons",
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
        "ing_name": "peaches (peeled, pitted, sliced)",
        "ing_qty": "about 7 cups sliced (about 3 lb)",
        "sr28_long_desc": "Peaches, yellow, raw",
        "ndb_no": "9236",
        "portion_desc": "g",
        "portion_grams": 1360.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "1/4 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 55.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 32.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
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
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 1.3,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "ground nutmeg",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, nutmeg, ground",
        "ndb_no": "2025",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (cut into small pieces, dotted on top)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "~25g of beaten egg adheres to lattice",
        "ing_qty": "1 large egg",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      },
      {
        "row_order": 16,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "section=wash"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust, whisk the flour, salt, and sugar together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into 2 discs (one slightly larger for the bottom) and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving overhang. Roll the second disc and cut into 1/2-inch strips for the lattice; chill while you make the filling."
      },
      {
        "step_order": 4,
        "step_text": "Score a small X in the bottom of each peach, blanch in boiling water for 30-45 seconds, then transfer to an ice bath. Slip off the skins, halve, pit, and slice into 1/4-inch slices. Alternatively, use a vegetable peeler to remove the skin."
      },
      {
        "step_order": 5,
        "step_text": "Combine the sliced peaches, sugar, cornstarch, lemon juice, cinnamon, nutmeg, and salt in a heavy saucepan and toss gently to coat the fruit evenly. Set over medium heat."
      },
      {
        "step_order": 6,
        "step_text": "Cook, stirring every minute or two so nothing scorches, until the peaches release their juice and the cornstarch turns the syrup glossy and noticeably thickened, about 8-12 minutes. Remove from the heat as soon as the liquid looks like a glaze that coats the spoon."
      },
      {
        "step_order": 7,
        "step_text": "Spread the cooked filling on a sheet pan or shallow plate so it cools to at least lukewarm before going into the crust. Pouring hot filling onto raw dough will melt the butter and ruin the bottom crust."
      },
      {
        "step_order": 8,
        "step_text": "Scrape the cooled filling into the prepared bottom crust and smooth the surface. Dot with the butter pieces. Lay the lattice strips over the filling in a woven pattern. Trim, fold under, and crimp the edges to seal."
      },
      {
        "step_order": 9,
        "step_text": "Whisk the egg with 1 teaspoon of water and brush the lattice top."
      },
      {
        "step_order": 10,
        "step_text": "Bake at 425F for 20 minutes, then reduce the temperature to 375F and bake for another 25-30 minutes, until the crust is deep golden brown and the filling is bubbling slowly through the lattice. Tent the edges loosely with foil if they brown too quickly."
      },
      {
        "step_order": 11,
        "step_text": "Cool the pie on a wire rack for at least 3 hours before slicing so the filling sets firmly."
      }
    ]
  },
  {
    "recipe_id": "SWEET_009",
    "food_word": "pecan",
    "recipe_name": "Pecan Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "8 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during the bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18325 within an average macro discrepancy of 2.0%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, pecan, prepared from recipe",
        "ndb_no": "18325",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "3 tablespoons ice water",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "light corn syrup",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Syrups, corn, light",
        "ndb_no": "19350",
        "portion_desc": "g",
        "portion_grams": 328.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "1 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 220.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "large eggs (lightly beaten)",
        "ing_qty": "3 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "butter (melted)",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour (helps the filling set)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 8.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "5/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.75,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "pecan halves, coarsely chopped (save enough whole halves to line the top)",
        "ing_qty": "2 cups halves, coarsely chopped (save enough halves to line the top)",
        "sr28_long_desc": "Nuts, pecans",
        "ndb_no": "12142",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350 degrees F (175 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust, whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the dough into an 11-inch circle and fit into a 9-inch pie plate. Trim, fold under, and crimp the edges. Prick the bottom and sides with a fork."
      },
      {
        "step_order": 4,
        "step_text": "Line the crust with parchment paper and fill with pie weights or dried beans. Blind-bake for 12-15 minutes until the edges are set, then remove the parchment and weights and bake for another 5 minutes until the bottom looks dry and barely golden. Set aside while you make the filling."
      },
      {
        "step_order": 5,
        "step_text": "In a large bowl, whisk the eggs with the tablespoon of flour until the flour is fully dispersed and there are no lumps. Add the corn syrup, brown sugar, melted butter, vanilla, and salt and whisk until smooth. The flour helps the filling set so it does not run when sliced."
      },
      {
        "step_order": 6,
        "step_text": "Stir in the pecan halves so they are evenly coated."
      },
      {
        "step_order": 7,
        "step_text": "Pour the filling into the par-baked crust, arranging the pecans so they float in an even layer across the top."
      },
      {
        "step_order": 8,
        "step_text": "Bake at 350F for 50-60 minutes, until the edges are puffed, the pecans on top are well toasted, and the center is just set with only a slight jiggle when the pan is gently shaken. Tent the crust edges with foil if they brown too quickly."
      },
      {
        "step_order": 9,
        "step_text": "Cool on a wire rack for at least 2 hours before slicing so the filling sets fully."
      }
    ]
  },
  {
    "recipe_id": "SWEET_010",
    "food_word": "pumpkin",
    "recipe_name": "Pumpkin Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "8 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during the bake. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18327 within an average macro discrepancy of 2.9%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, pumpkin, prepared from recipe",
        "ndb_no": "18327",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "3 tablespoons ice water",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "canned pumpkin puree (not pumpkin pie filling)",
        "ing_qty": "1 can (15 oz)",
        "sr28_long_desc": "Pumpkin, canned, without salt",
        "ndb_no": "11424",
        "portion_desc": "g",
        "portion_grams": 425.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "evaporated milk",
        "ing_qty": "1 can (12 oz)",
        "sr28_long_desc": "Milk, canned, evaporated, with added vitamin D",
        "ndb_no": "1096",
        "portion_desc": "g",
        "portion_grams": 354.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "large eggs (lightly beaten)",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "pumpkin pie spice (or 1 1/2 tsp cinnamon + 1/2 tsp ginger + 1/2 tsp nutmeg + 1/4 tsp cloves)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Spices, pumpkin pie spice",
        "ndb_no": "2035",
        "portion_desc": "g",
        "portion_grams": 5.1,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "butter (melted)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust, whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the dough into an 11-inch circle and fit into a 9-inch pie plate. Trim, fold under, and crimp the edges. Prick the bottom and sides with a fork."
      },
      {
        "step_order": 4,
        "step_text": "Line the crust with parchment paper and fill with pie weights or dried beans. Blind-bake for 12-15 minutes until the edges are set, then remove the parchment and weights and bake for another 5 minutes until the bottom looks dry and barely golden. Set aside while you make the filling."
      },
      {
        "step_order": 5,
        "step_text": "In a large bowl, whisk the sugar, salt, and pumpkin pie spice together until evenly combined."
      },
      {
        "step_order": 6,
        "step_text": "Add the eggs and whisk to break them up, then whisk in the pumpkin puree until smooth."
      },
      {
        "step_order": 7,
        "step_text": "Gradually whisk in the evaporated milk and the melted butter until the filling is uniform with no streaks."
      },
      {
        "step_order": 8,
        "step_text": "Pour the filling into the par-baked crust. The crust should be nearly full but not overflowing."
      },
      {
        "step_order": 9,
        "step_text": "Bake at 425F for 15 minutes, then reduce the oven temperature to 350F and bake for another 40-50 minutes, until a knife inserted 1 inch from the edge comes out clean and the center is just set with only a slight jiggle. Tent the crust edges with foil if they brown too quickly."
      },
      {
        "step_order": 10,
        "step_text": "Cool on a wire rack for at least 2 hours so the filling sets completely before slicing."
      }
    ]
  },
  {
    "recipe_id": "SWEET_011",
    "food_word": "vanilla",
    "recipe_name": "Vanilla Cream Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "8 slices",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect water loss during the bake and stovetop cooking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18328 within an average macro discrepancy of 4.9%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, vanilla cream, prepared from recipe",
        "ndb_no": "18328",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "3 tablespoons ice water",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 488.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 cup + 1 tablespoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "7 tablespoons",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 56.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 24.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "3/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "egg yolks (lightly beaten)",
        "ing_qty": "4 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 68.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "butter (cut into pieces)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 8.4,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "heavy cream",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Cream, fluid, heavy whipping",
        "ndb_no": "1053",
        "portion_desc": "g",
        "portion_grams": 180.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "powdered sugar",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Sugars, powdered",
        "ndb_no": "19336",
        "portion_desc": "g",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0,
        "notes": "optional;section=topping"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 425 degrees F (220 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust, whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the dough into an 11-inch circle and fit into a 9-inch pie plate. Trim, fold under, and crimp the edges. Prick the bottom and sides with a fork."
      },
      {
        "step_order": 4,
        "step_text": "Line the crust with parchment and fill with pie weights or dried beans. Blind-bake at 425F for 12-15 minutes until the edges are set, then remove the parchment and weights, reduce the oven to 375F, and bake for another 8-10 minutes until the bottom is dry and golden. Cool completely on a rack."
      },
      {
        "step_order": 5,
        "step_text": "For the pastry cream, whisk the sugar, cornstarch, flour, and salt together in a heavy saucepan. Gradually whisk in the milk until smooth."
      },
      {
        "step_order": 6,
        "step_text": "Set over medium heat and cook, whisking constantly, until the mixture thickens, comes to a gentle boil, and bubbles for about 1 minute. The custard should coat the back of a spoon thickly."
      },
      {
        "step_order": 7,
        "step_text": "Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook, whisking constantly, for another 2 minutes until thickened and glossy. Do not let it scorch."
      },
      {
        "step_order": 8,
        "step_text": "Remove from the heat and whisk in the butter and vanilla extract until smooth."
      },
      {
        "step_order": 9,
        "step_text": "Pour the warm filling into the cooled crust and smooth the top. Press a piece of plastic wrap directly onto the surface to prevent a skin from forming, then refrigerate for at least 4 hours, or until fully set."
      },
      {
        "step_order": 10,
        "step_text": "Just before serving, whip the heavy cream with the powdered sugar and vanilla (if using) to soft peaks. Spread or pipe over the chilled pie and serve."
      }
    ]
  },
  {
    "recipe_id": "SWEET_012",
    "food_word": "boston",
    "recipe_name": "Boston Cream Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 min",
    "servings": "10 slices",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade Boston cream pie spec: 2-layer butter yellow cake, vanilla pastry cream filling, semisweet chocolate ganache glaze. NOT validated against USDA SR Legacy NDB 18090 because that record is for a commercially prepared sponge-cake version with much less fat and protein and much more glaze sugar; no homemade butter-cake recipe can represent it. Free-tier nutrient values are computed from the ingredients in this recipe; paid-tier values may substitute canonical fields where appropriate.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, boston cream pie, commercially prepared",
        "ndb_no": "18090",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 1/2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, softened",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "large eggs (room temperature)",
        "ing_qty": "3 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 1/2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 6.3,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 183.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 366.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 67.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 16.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "egg yolks (lightly beaten)",
        "ing_qty": "3 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 51.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "butter (cut in pieces)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 16,
        "row_type": "ingredient",
        "ing_name": "heavy cream",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cream, fluid, heavy whipping",
        "ndb_no": "1053",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=glaze"
      },
      {
        "row_order": 17,
        "row_type": "ingredient",
        "ing_name": "semisweet chocolate, chopped",
        "ing_qty": "4 ounces",
        "sr28_long_desc": "Candies, semisweet chocolate",
        "ndb_no": "19080",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=glaze"
      },
      {
        "row_order": 18,
        "row_type": "ingredient",
        "ing_name": "butter",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 14.0,
        "serving_count": 1.0,
        "notes": "section=glaze"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350 degrees F (175 degrees C). Grease two 8-inch round cake pans and line the bottoms with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "For the cake, whisk the flour, baking powder, and salt together and set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a stand mixer or large bowl, beat the softened butter and sugar on medium-high until pale and fluffy, about 3 minutes. Add the eggs one at a time, beating well after each, then beat in the vanilla."
      },
      {
        "step_order": 4,
        "step_text": "On low speed, add the flour mixture in three additions alternating with the milk in two additions, beginning and ending with the flour. Mix just until smooth."
      },
      {
        "step_order": 5,
        "step_text": "Divide the batter evenly between the two pans and smooth the tops. Bake for 22-26 minutes, until the centers spring back when lightly pressed and a toothpick comes out clean. Cool in the pans 10 minutes, then turn out onto a rack and cool completely."
      },
      {
        "step_order": 6,
        "step_text": "For the pastry cream, whisk the sugar, cornstarch, and salt in a heavy saucepan. Gradually whisk in the milk until smooth. Cook over medium heat, whisking constantly, until thickened and gently boiling, about 1 minute."
      },
      {
        "step_order": 7,
        "step_text": "Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook 1-2 minutes more, whisking constantly, until thick and glossy."
      },
      {
        "step_order": 8,
        "step_text": "Remove from the heat and whisk in the butter and vanilla. Press plastic wrap onto the surface and chill until cold, at least 1 hour."
      },
      {
        "step_order": 9,
        "step_text": "When the cake layers are completely cool and the pastry cream is set, place the bottom layer on a serving plate. Spread the pastry cream evenly to within 1/2 inch of the edge. Top with the second cake layer, pressing gently."
      },
      {
        "step_order": 10,
        "step_text": "For the glaze, heat the cream in a small saucepan or microwave until it just begins to steam. Pour over the chopped chocolate in a heatproof bowl, let sit 1 minute, then whisk until smooth. Whisk in the butter until glossy."
      },
      {
        "step_order": 11,
        "step_text": "Pour the warm glaze over the center of the top cake layer and spread gently with the back of a spoon, letting some drip down the sides. Refrigerate at least 1 hour before slicing so the glaze sets."
      }
    ]
  },
  {
    "recipe_id": "SWEET_013",
    "food_word": "chocolate",
    "recipe_name": "Chocolate Cream Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "8 slices",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade chocolate cream pie spec: chocolate cookie crumb crust, egg-yolk-thickened chocolate pastry cream, fresh whipped cream topping. NOT validated against USDA SR Legacy NDB 18310 because that record is for a commercially prepared product made with non-dairy whipped topping and a no-egg starch/gelatin filling (cholesterol only 12 mg/100 g vs ~70-80 mg in any homemade version with egg yolks and dairy). Free-tier nutrient values are computed from the ingredients in this recipe; paid-tier values may substitute canonical fields where appropriate.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, chocolate creme, commercially prepared",
        "ndb_no": "18310",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "chocolate sandwich cookies (such as Oreos), finely crushed",
        "ing_qty": "24 cookies",
        "sr28_long_desc": "Cookies, chocolate sandwich, with creme filling, regular",
        "ndb_no": "18166",
        "portion_desc": "g",
        "portion_grams": 240.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "butter (melted)",
        "ing_qty": "5 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 71.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 488.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "heavy cream",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Cream, fluid, heavy whipping",
        "ndb_no": "1053",
        "portion_desc": "g",
        "portion_grams": 115.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 133.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 24.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "unsweetened cocoa powder",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Cocoa, dry powder, unsweetened",
        "ndb_no": "19165",
        "portion_desc": "g",
        "portion_grams": 10.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "egg yolks (lightly beaten)",
        "ing_qty": "4 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 68.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "semisweet chocolate, chopped",
        "ing_qty": "8 ounces",
        "sr28_long_desc": "Candies, semisweet chocolate",
        "ndb_no": "19080",
        "portion_desc": "g",
        "portion_grams": 227.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "butter",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 42.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "heavy cream",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Cream, fluid, heavy whipping",
        "ndb_no": "1053",
        "portion_desc": "g",
        "portion_grams": 230.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "powdered sugar",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Sugars, powdered",
        "ndb_no": "19336",
        "portion_desc": "g",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0,
        "notes": "optional;section=topping"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350 degrees F (175 degrees C)."
      },
      {
        "step_order": 2,
        "step_text": "For the crust, pulse the cookies in a food processor to fine crumbs (or crush in a sealed bag with a rolling pin). Combine with the melted butter and stir until evenly moistened. Press firmly into the bottom and up the sides of a 9-inch pie plate. Bake for 8-10 minutes, then cool on a rack while you make the filling."
      },
      {
        "step_order": 3,
        "step_text": "For the filling, whisk the sugar, cornstarch, cocoa, and salt together in a heavy saucepan. Gradually whisk in the milk and heavy cream until smooth and no lumps remain."
      },
      {
        "step_order": 4,
        "step_text": "Set over medium heat and cook, whisking constantly, until the mixture thickens, comes to a gentle boil, and bubbles for about 1 minute."
      },
      {
        "step_order": 5,
        "step_text": "Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook 1-2 minutes more, whisking constantly, until thick and glossy."
      },
      {
        "step_order": 6,
        "step_text": "Remove from the heat and add the chopped chocolate, butter, and vanilla. Whisk until completely smooth and the chocolate is fully melted."
      },
      {
        "step_order": 7,
        "step_text": "Pour the warm filling into the cooled cookie crust and smooth the top. Press a piece of plastic wrap directly onto the surface and refrigerate for at least 4 hours, or until fully set."
      },
      {
        "step_order": 8,
        "step_text": "Just before serving, whip the heavy cream with the powdered sugar and vanilla (if using) to soft peaks. Spread or pipe over the chilled pie and serve."
      }
    ]
  },
  {
    "recipe_id": "SWEET_014",
    "food_word": "coconut",
    "recipe_name": "Coconut Cream Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "8 slices",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade coconut cream pie spec: blind-baked single pie crust, coconut milk + dairy pastry cream with toasted flaked coconut, fresh whipped cream topping. NOT validated against USDA SR Legacy NDB 18314 because that record is a mix-based no-bake commercial product (instant pudding mix + non-dairy whipped topping) with no egg yolks, far less fat and protein, and dramatically higher sodium from added phosphates. No homemade recipe can represent it. Free-tier nutrient values are computed from the ingredients in this recipe; paid-tier values may substitute canonical fields where appropriate.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, coconut cream, prepared from mix, no-bake type",
        "ndb_no": "18314",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "cold unsalted butter, cubed",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water (more as needed)",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "half-and-half",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Cream, fluid, half and half",
        "ndb_no": "1049",
        "portion_desc": "g",
        "portion_grams": 242.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "canned coconut milk (full-fat, well shaken)",
        "ing_qty": "1 can (13.5 oz)",
        "sr28_long_desc": "Nuts, coconut milk, canned",
        "ndb_no": "12118",
        "portion_desc": "g",
        "portion_grams": 400.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 133.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "4 tablespoons",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 32.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "egg yolks (lightly beaten)",
        "ing_qty": "4 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 68.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "butter",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 28.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "sweetened flaked coconut",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Nuts, coconut meat, dried, sweetened, flaked",
        "ndb_no": "12109",
        "portion_desc": "g",
        "portion_grams": 74.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "heavy cream",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Cream, fluid, heavy whipping",
        "ndb_no": "1053",
        "portion_desc": "g",
        "portion_grams": 345.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "powdered sugar",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Sugars, powdered",
        "ndb_no": "19336",
        "portion_desc": "g",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 16,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0,
        "notes": "optional;section=topping"
      },
      {
        "row_order": 17,
        "row_type": "ingredient",
        "ing_name": "sweetened flaked coconut, lightly toasted (for garnish)",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Nuts, coconut meat, dried, sweetened, flaked",
        "ndb_no": "12109",
        "portion_desc": "g",
        "portion_grams": 18.0,
        "serving_count": 1.0,
        "notes": "optional;section=topping"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "For the crust, whisk the flour and salt together in a bowl. Cut in the cold butter with a pastry cutter or your fingertips until the mixture resembles coarse crumbs with some pea-sized pieces. Sprinkle the ice water over and stir gently with a fork until the dough just comes together, adding a few more drops of water if needed."
      },
      {
        "step_order": 2,
        "step_text": "Shape the dough into a disk, wrap, and chill for at least 30 minutes. Roll out on a lightly floured surface to a 12-inch round, transfer to a 9-inch pie plate, trim, and crimp the edges. Prick the bottom all over with a fork and chill for another 15 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Preheat the oven to 400 degrees F (205 degrees C). Line the chilled shell with parchment and fill with pie weights or dried beans. Bake for 15 minutes, then remove the weights and parchment and bake another 8-10 minutes, until the crust is fully baked and lightly golden. Cool completely on a rack."
      },
      {
        "step_order": 4,
        "step_text": "For the filling, whisk the sugar, cornstarch, and salt together in a heavy saucepan. Gradually whisk in the half-and-half and coconut milk until smooth."
      },
      {
        "step_order": 5,
        "step_text": "Set over medium heat and cook, whisking constantly, until the mixture thickens, comes to a gentle boil, and bubbles for about 1 minute."
      },
      {
        "step_order": 6,
        "step_text": "Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook 1-2 minutes more, whisking constantly, until thick and glossy."
      },
      {
        "step_order": 7,
        "step_text": "Remove from the heat and whisk in the butter and vanilla until smooth. Stir in the flaked coconut."
      },
      {
        "step_order": 8,
        "step_text": "Pour the warm filling into the cooled crust and smooth the top. Press a piece of plastic wrap directly onto the surface to prevent a skin from forming, then refrigerate for at least 4 hours, or until fully set."
      },
      {
        "step_order": 9,
        "step_text": "Toast the coconut: place 1/4 cup of the sweetened flaked coconut on a parchment-lined baking sheet. Bake at 350 degrees F (175 degrees C) until light golden, about 5 minutes. Set aside to cool."
      },
      {
        "step_order": 10,
        "step_text": "Just before serving, whip the heavy cream with the powdered sugar and vanilla (if using) to soft peaks. Spread or pipe over the chilled pie. Sprinkle with toasted coconut and serve."
      }
    ]
  },
  {
    "recipe_id": "SWEET_015",
    "food_word": "custard",
    "recipe_name": "Egg Custard Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "8 slices",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade egg custard pie spec: blind-baked single pie crust filled with whole milk + whole egg custard, sweetened, lightly nutmegged. NOT validated against USDA SR Legacy NDB 18317 because that record is a commercially prepared pie that uses added starches, gums, and milk solids (evidenced by ~1.6 g/100g fiber and elevated protein and carbohydrate at lower sugar) that no authentic homemade custard pie contains. No homemade recipe can represent it. Free-tier nutrient values are computed from the ingredients in this recipe; paid-tier values may substitute canonical fields where appropriate.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Pie, egg custard, commercially prepared",
        "ndb_no": "18317",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "cold unsalted butter, cubed",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "ice water (more as needed)",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 45.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "large eggs",
        "ing_qty": "4 large eggs",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "ground nutmeg, plus more for sprinkling",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, nutmeg, ground",
        "ndb_no": "2025",
        "portion_desc": "g",
        "portion_grams": 0.55,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "whole milk, scalded",
        "ing_qty": "2 1/2 cups",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 610.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 8.4,
        "serving_count": 1.0,
        "notes": "section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "For the crust, whisk the flour and salt together. Cut in the cold butter until the mixture resembles coarse crumbs with pea-sized pieces. Sprinkle the ice water over and stir gently with a fork until the dough just comes together."
      },
      {
        "step_order": 2,
        "step_text": "Shape into a disk, wrap, and chill for at least 30 minutes. Roll out to a 12-inch round, transfer to a 9-inch pie plate, trim, and crimp the edges. Prick the bottom with a fork and chill for another 15 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Preheat the oven to 400 degrees F (205 degrees C). Line the chilled shell with parchment and fill with pie weights. Bake for 12 minutes, then remove the weights and parchment and bake another 5-7 minutes, until the bottom looks dry and just set (the crust should not be fully browned). Remove and lower the oven to 325 degrees F (165 degrees C)."
      },
      {
        "step_order": 4,
        "step_text": "For the filling, whisk the eggs in a large bowl until smooth. Whisk in the sugar, salt, and nutmeg."
      },
      {
        "step_order": 5,
        "step_text": "Heat the milk in a saucepan over medium heat just until steaming and small bubbles appear at the edges (do not boil). Slowly pour the hot milk into the egg mixture in a thin stream, whisking constantly. Stir in the vanilla."
      },
      {
        "step_order": 6,
        "step_text": "Place the par-baked crust on a rimmed baking sheet near the oven. Pour the custard through a fine-mesh strainer into the crust to remove any cooked egg bits and foam."
      },
      {
        "step_order": 7,
        "step_text": "Sprinkle a little more nutmeg over the top. Carefully transfer to the oven and bake at 325 degrees F (165 degrees C) for 35-45 minutes, until the edges are set and puffed and the center jiggles only slightly when nudged (a knife inserted 1 inch from the edge should come out clean)."
      },
      {
        "step_order": 8,
        "step_text": "Cool the pie completely on a rack, then refrigerate for at least 2 hours before slicing. Serve cold."
      }
    ]
  },
  {
    "recipe_id": "SWEET_016",
    "food_word": "CAKEWHITE",
    "recipe_name": "White Cake (No Frosting)",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "12 slices",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect water loss during baking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18139 within an average macro discrepancy of 1.8%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, white, prepared from recipe without frosting",
        "ndb_no": "18139",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour, sifted",
        "ing_qty": "2 1/4 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 281.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 12.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "5/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.75,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening, room temperature",
        "ing_qty": "1/2 cup + 2 1/4 teaspoons",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 105.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 1/2 cups + 1 tablespoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 312.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "whole milk, room temperature",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 244.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 8.4,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "egg whites, room temperature",
        "ing_qty": "4 large whites",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 132.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350 degrees F (175 degrees C). Grease a 9x13-inch baking pan or two 9-inch round pans, then dust with flour (or line with parchment)."
      },
      {
        "step_order": 2,
        "step_text": "Sift together the cake flour, baking powder, and salt into a medium bowl and set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the shortening and sugar together on medium-high speed until light and creamy, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed."
      },
      {
        "step_order": 4,
        "step_text": "Slowly add the egg whites until incorporated, then beat on high speed until smooth and well combined, about 2 minutes. Scrape down the bowl again."
      },
      {
        "step_order": 5,
        "step_text": "Add the vanilla and beat on medium-high until incorporated, about 1 minute."
      },
      {
        "step_order": 6,
        "step_text": "Add all of the sifted dry ingredients to the bowl. With the mixer running on low speed, slowly pour in the milk and beat just until the batter comes together. Do not overmix. Overmixing will cause gluten to form causing a dense bread-like cake. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl. The batter will be smooth and slightly thick."
      },
      {
        "step_order": 7,
        "step_text": "Divide the batter evenly between the prepared pan(s) and smooth the top. Tap the pan gently on the counter once or twice to release any large air bubbles."
      },
      {
        "step_order": 8,
        "step_text": "Bake until the top springs back when lightly pressed and a toothpick inserted in the center comes out clean: about 30-35 minutes for a 9x13 pan, or 22-26 minutes for 9-inch rounds."
      },
      {
        "step_order": 9,
        "step_text": "Cool in the pan(s) on a rack for 10 minutes, then turn out onto the rack and cool completely before slicing or frosting."
      }
    ]
  },
  {
    "recipe_id": "SWEET_017",
    "food_word": "CAKEWHITECOCONUTFROSTING",
    "recipe_name": "White Cake with Coconut Frosting",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "12 slices",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect water loss during baking and the boiled-frosting reduction. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18102 within an average macro discrepancy of 4.5%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, white, prepared from recipe with coconut frosting",
        "ndb_no": "18102",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour, sifted",
        "ing_qty": "2 1/4 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 281.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 12.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "5/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.75,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening, room temperature",
        "ing_qty": "1/2 cup + 2 tablespoons + 1/2 teaspoon",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 124.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 1/2 cups + 1 tablespoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 312.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "whole milk, room temperature",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 244.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 8.4,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "egg whites, room temperature",
        "ing_qty": "4 large whites",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 132.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "granulated sugar (for frosting)",
        "ing_qty": "2 1/2 cups",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 500.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "light corn syrup",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Syrups, corn, light",
        "ndb_no": "19350",
        "portion_desc": "g",
        "portion_grams": 41.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "water",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 79.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "egg whites",
        "ing_qty": "6 large whites",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 198.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "pinch of salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "sweetened flaked coconut (about 1/2 cup folded into frosting, remainder pressed onto top and sides)",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Nuts, coconut meat, dried, sweetened, flaked",
        "ndb_no": "12109",
        "portion_desc": "g",
        "portion_grams": 111.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350 degrees F (175 degrees C). Grease two 9-inch round cake pans, then dust with flour or line the bottoms with parchment."
      },
      {
        "step_order": 2,
        "step_text": "Sift together the flour, baking powder, and salt into a medium bowl and set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the shortening and sugar together on medium-high speed until light and creamy, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed."
      },
      {
        "step_order": 4,
        "step_text": "Slowly add the egg whites until incorporated, then beat on high speed until smooth and well combined, about 2 minutes. Scrape down the bowl again."
      },
      {
        "step_order": 5,
        "step_text": "Add the vanilla and beat on medium-high until incorporated, about 1 minute."
      },
      {
        "step_order": 6,
        "step_text": "Add all of the sifted dry ingredients to the bowl. With the mixer running on low speed, slowly pour in the milk and beat just until the batter comes together. Do not overmix. Overmixing will cause gluten to form causing a dense bread-like cake. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl. The batter will be smooth and slightly thick."
      },
      {
        "step_order": 7,
        "step_text": "Divide the batter evenly between the prepared pans and smooth the top. Tap the pans gently on the counter once or twice to release any large air bubbles."
      },
      {
        "step_order": 8,
        "step_text": "Bake until the tops spring back when lightly pressed and a toothpick inserted in the center comes out clean, about 22-26 minutes."
      },
      {
        "step_order": 9,
        "step_text": "Cool in the pans on a rack for 10 minutes, then turn the layers out onto the rack and cool completely before frosting."
      },
      {
        "step_order": 10,
        "step_text": "--- Seven-Minute Coconut Frosting ---"
      },
      {
        "step_order": 11,
        "step_text": "Place the top part of the double boiler or heatproof bowl over rapidly boiling water, ensuring the bottom pan's water stays at a steady boil and the water does not touch the top container."
      },
      {
        "step_order": 12,
        "step_text": "In the top part (off the heat), combine the egg whites, sugar, water, corn syrup, and salt and beat with a handheld electric mixer until thoroughly mixed."
      },
      {
        "step_order": 13,
        "step_text": "Place the top part over the rapidly boiling water and beat constantly on high speed for 7 minutes, until the frosting is bright white, glossy, and stands in stiff peaks. (The corn syrup acts as the stabilizer here, so cream of tartar is not needed.)"
      },
      {
        "step_order": 14,
        "step_text": "Remove from heat and quickly beat in the vanilla extract."
      },
      {
        "step_order": 15,
        "step_text": "Fold in about 1 cup of the flaked coconut with a rubber spatula, beating briefly until the frosting is thick enough to spread."
      },
      {
        "step_order": 16,
        "step_text": "Place one cooled cake layer on a serving plate or cake board. Spread about a quarter of the frosting over the top. Add the second layer and frost the top and sides with the remaining frosting in soft swoops."
      },
      {
        "step_order": 17,
        "step_text": "Press the remaining flaked coconut all over the top and sides of the frosted cake while the frosting is still tacky. Let the cake set for at least 30 minutes before slicing. Seven-minute frosting is best the day it is made."
      }
    ]
  },
  {
    "recipe_id": "SWEET_018",
    "food_word": "CAKEYELLOW",
    "recipe_name": "Yellow Cake (No Frosting)",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 min",
    "servings": "12 slices",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during baking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18146 within an average macro discrepancy of 1.8%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, yellow, prepared from recipe without frosting",
        "ndb_no": "18146",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour, sifted",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 187.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sifted cake flour",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Wheat flour, white, cake, enriched",
        "ndb_no": "20084",
        "portion_desc": "g",
        "portion_grams": 62.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "1 1/4 cups",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 250.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 8.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "3/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, soft",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening, soft",
        "ing_qty": "1/4 cup + 1 tablespoon",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 61.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 183.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 1/4 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 5.25,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "large eggs, unbeaten",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350 degrees F (175 degrees C). Grease two 9-inch round cake pans, then dust with flour or line the bottoms with parchment."
      },
      {
        "step_order": 2,
        "step_text": "Sift together the all-purpose flour, cake flour, baking powder, and salt into a medium bowl and set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the butter, shortening, and sugar together on medium-high speed until light and fluffy, about 4 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed."
      },
      {
        "step_order": 4,
        "step_text": "Add the eggs one at a time, beating well after each addition, then beat on high speed for 1 minute until smooth and well combined. Scrape down the bowl again."
      },
      {
        "step_order": 5,
        "step_text": "Add the vanilla and beat on medium-high until incorporated, about 30 seconds."
      },
      {
        "step_order": 6,
        "step_text": "Add about a third of the sifted dry ingredients to the bowl, followed by half of the milk, and beat on low until just combined. Repeat with another third of the dry ingredients and the rest of the milk, then finish with the remaining dry ingredients. Do not overmix. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl."
      },
      {
        "step_order": 7,
        "step_text": "Divide the batter evenly between the prepared pans and smooth the top. Tap the pans gently on the counter once or twice to release any large air bubbles."
      },
      {
        "step_order": 8,
        "step_text": "Bake until the tops are golden, spring back when lightly pressed, and a toothpick inserted in the center comes out clean, about 25-30 minutes."
      },
      {
        "step_order": 9,
        "step_text": "Cool in the pans on a rack for 10 minutes, then turn the layers out onto the rack and cool completely before slicing."
      }
    ]
  },
  {
    "recipe_id": "SWEET_019",
    "food_word": "frosting",
    "recipe_name": "Chocolate Glaze with Butter",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "10 min",
    "servings": "16 tablespoons",
    "sr28_rule": "Rule A",
    "sr28_notes": "The nutrient values reflect this glaze prepared from scratch and validated against USDA SR Legacy NDB 19409 (NFSMI Recipe No. C-32) within an average macro discrepancy of 3.0%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Frostings, glaze, chocolate, prepared-from-recipe, with butter, NFSMI Recipe No. C-32",
        "ndb_no": "19409",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "powdered sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, powdered",
        "ndb_no": "19336",
        "portion_desc": "g",
        "portion_grams": 120.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "unsweetened cocoa powder",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Cocoa, dry powder, unsweetened",
        "ndb_no": "19165",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, melted",
        "ing_qty": "2 1/2 teaspoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 12.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "evaporated milk",
        "ing_qty": "1 tablespoon + 1 teaspoon",
        "sr28_long_desc": "Milk, canned, evaporated, with added vitamin D",
        "ndb_no": "1096",
        "portion_desc": "g",
        "portion_grams": 21.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "boiling water",
        "ing_qty": "2 1/2 teaspoons",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 12.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "scant 1/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=frosting"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Sift the powdered sugar and cocoa powder together into a medium bowl."
      },
      {
        "step_order": 2,
        "step_text": "Whisk in the melted butter, then the milk, vanilla, and salt. Beat until smooth, glossy, and pourable. If too thick, add milk a teaspoon at a time; if too thin, add powdered sugar a tablespoon at a time."
      },
      {
        "step_order": 3,
        "step_text": "Pour or drizzle over a fully cooled cake. Let set 10\u201315 minutes before slicing."
      }
    ]
  },
  {
    "recipe_id": "SWEET_020",
    "food_word": "CAKEYELLOWCHOCOLATEFROSTING",
    "recipe_name": "Yellow Cake with Chocolate Glaze",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 min",
    "servings": "12 slices",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade yellow layer cake with chocolate glaze. NOT validated against USDA SR Legacy NDB 18140 because the canonical entry reflects commercial in-store-bakery production using hydrogenated shortening, reduced-egg formulations, and industrial frosting bases. Proportions aligned to classic homemade two-layer yellow cake references: butter + oil, buttermilk, 3 whole eggs + 2 yolks, and a cocoa powdered-sugar glaze.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, yellow, commercially prepared, with chocolate frosting, in-store bakery",
        "ndb_no": "18140",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour, sifted",
        "ing_qty": "2 2/3 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 333.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 1.2,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "1 3/4 cups",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 350.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "2 1/2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 10.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, soft",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "whole buttermilk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk, buttermilk, fluid, whole",
        "ndb_no": "1230",
        "portion_desc": "g",
        "portion_grams": 244.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 12.6,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "large eggs, unbeaten",
        "ing_qty": "3 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "large egg yolks",
        "ing_qty": "2 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 34.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "powdered sugar",
        "ing_qty": "3 cups",
        "sr28_long_desc": "Sugars, powdered",
        "ndb_no": "19336",
        "portion_desc": "g",
        "portion_grams": 360.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "unsweetened cocoa powder",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Cocoa, dry powder, unsweetened",
        "ndb_no": "19165",
        "portion_desc": "g",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, melted",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 83.0,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "boiling water if needed for consistency",
        "ing_qty": "1-2 tablespoons",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 18.0,
        "serving_count": 1.0,
        "notes": "optional;section=frosting"
      },
      {
        "row_order": 16,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=frosting"
      },
      {
        "row_order": 17,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=frosting"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350\u00b0F (175\u00b0C). Grease two 9-inch round cake pans, then dust with flour or line the bottoms with parchment."
      },
      {
        "step_order": 2,
        "step_text": "Sift together the flour, baking powder, baking soda, and salt into a medium bowl and set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the butter and sugar together on medium-high speed until light and fluffy, about 4 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed."
      },
      {
        "step_order": 4,
        "step_text": "Add the whole eggs one at a time, beating well after each addition. Beat in the yolks, then beat on high speed for 1 minute until smooth and well combined. Scrape down the bowl again."
      },
      {
        "step_order": 5,
        "step_text": "Add the vanilla and beat on medium-high until incorporated, about 30 seconds."
      },
      {
        "step_order": 6,
        "step_text": "Add about a third of the sifted dry ingredients to the bowl, followed by half of the buttermilk, and beat on low until just combined. Repeat with another third of the dry ingredients and the rest of the buttermilk, then finish with the remaining dry ingredients. Do not overmix. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl."
      },
      {
        "step_order": 7,
        "step_text": "Divide the batter evenly between the prepared pans and smooth the top. Tap the pans gently on the counter once or twice to release any large air bubbles."
      },
      {
        "step_order": 8,
        "step_text": "Bake until the tops are golden, spring back when lightly pressed, and a toothpick inserted in the center comes out clean, about 25\u201330 minutes."
      },
      {
        "step_order": 9,
        "step_text": "Cool in the pans on a rack for 10 minutes, then turn the layers out onto the rack and cool completely before glazing."
      },
      {
        "step_order": 10,
        "step_text": "--- Chocolate Glaze ---"
      },
      {
        "step_order": 11,
        "step_text": "Sift the powdered sugar and cocoa powder together into a medium bowl."
      },
      {
        "step_order": 12,
        "step_text": "Whisk in the melted butter, then the milk, vanilla, and salt. Beat until smooth, glossy, and spreadable. If too thick, add boiling water a teaspoon at a time; if too thin, add powdered sugar a tablespoon at a time."
      },
      {
        "step_order": 13,
        "step_text": "Place one cake layer on a serving plate. Spread about 1/3 of the warm glaze over the top, letting some run down the sides. Top with the second layer."
      },
      {
        "step_order": 14,
        "step_text": "Pour the remaining glaze over the top of the cake, using an offset spatula to coax it over the edges so it coats the top fully and drips down the sides. Let set 15\u201320 minutes before slicing."
      }
    ]
  },
  {
    "recipe_id": "SWEET_021",
    "food_word": "CAKEGINGERBREAD",
    "recipe_name": "Gingerbread",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "9 servings",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during baking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18116 within an average macro discrepancy of 2.3%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, gingerbread, prepared from recipe",
        "ndb_no": "18116",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour, sifted",
        "ing_qty": "2 1/4 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 281.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, softened",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 96.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "packed light brown sugar",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 73.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "unsulphured molasses",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Molasses",
        "ndb_no": "19304",
        "portion_desc": "g",
        "portion_grams": 252.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "hot water",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 4.6,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "ground ginger",
        "ing_qty": "1 1/2 teaspoons",
        "sr28_long_desc": "Spices, ginger, ground",
        "ndb_no": "2021",
        "portion_desc": "g",
        "portion_grams": 2.7,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "ground cloves",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Spices, cloves, ground",
        "ndb_no": "2011",
        "portion_desc": "g",
        "portion_grams": 1.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "3/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "ginger puree or grated fresh gingerroot (optional)",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Ginger root, raw",
        "ndb_no": "11216",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "optional;section=cake"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350\u00b0F (175\u00b0C). Grease a 9-inch square baking pan, then dust with flour or line the bottom with parchment."
      },
      {
        "step_order": 2,
        "step_text": "In a medium bowl, whisk together the all-purpose flour, baking soda, ginger, cinnamon, cloves, and salt. Set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the butter, shortening, and brown sugar together on medium-high speed until well blended and smooth, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed."
      },
      {
        "step_order": 4,
        "step_text": "Add the molasses (and the optional fresh gingerroot, if using) and beat on medium until fully incorporated, about 1 minute. Add the egg and beat until smooth."
      },
      {
        "step_order": 5,
        "step_text": "Add about half of the dry ingredients and beat on low until just combined. Pour in the hot water and beat until smooth \u2014 the batter will look loose, which is correct. Add the remaining dry ingredients and beat on low until just combined. Do not overmix."
      },
      {
        "step_order": 6,
        "step_text": "Pour the batter into the prepared pan and smooth the top."
      },
      {
        "step_order": 7,
        "step_text": "Bake until the top springs back when lightly pressed and a toothpick inserted in the center comes out with just a few moist crumbs, about 35\u201340 minutes."
      },
      {
        "step_order": 8,
        "step_text": "Cool in the pan on a wire rack for 15 minutes, then cut into 9 squares. Serve warm or at room temperature."
      }
    ]
  },
  {
    "recipe_id": "SWEET_022",
    "food_word": "CAKEPINEAPPLE",
    "recipe_name": "Pineapple Upside-Down Cake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 min",
    "servings": "9 servings",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during baking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18119 within an average macro discrepancy of 3.2%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, pineapple upside-down, prepared from recipe",
        "ndb_no": "18119",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter, melted (for the topping)",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 43.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "packed light brown sugar",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 147.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "pineapple slices, drained (reserve juice)",
        "ing_qty": "5 slices",
        "sr28_long_desc": "Pineapple, canned, juice pack, drained",
        "ndb_no": "9354",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "maraschino cherries, drained",
        "ing_qty": "5 cherries",
        "sr28_long_desc": "Maraschino cherries, canned, drained",
        "ndb_no": "9328",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour, sifted",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 187.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 8.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "7/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 5.25,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening",
        "ing_qty": "6 tablespoons",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 77.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 122.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon (optional)",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 1.3,
        "serving_count": 1.0,
        "notes": "optional;section=cake"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "ground cloves (optional)",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, cloves, ground",
        "ndb_no": "2011",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "optional;section=cake"
      },
      {
        "row_order": 15,
        "row_type": "ingredient",
        "ing_name": "ground ginger (optional)",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Spices, ginger, ground",
        "ndb_no": "2021",
        "portion_desc": "g",
        "portion_grams": 0.9,
        "serving_count": 1.0,
        "notes": "optional;section=cake"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat the oven to 350\u00b0F (175\u00b0C)."
      },
      {
        "step_order": 2,
        "step_text": "Pour the melted butter into a 9-inch round cake pan or 9-inch cast-iron skillet, tilting to coat the bottom evenly. Sprinkle the brown sugar over the butter in an even layer."
      },
      {
        "step_order": 3,
        "step_text": "Arrange the drained pineapple slices in a single layer over the brown sugar (one center, the rest around). Place a maraschino cherry in the center of each pineapple slice. Set aside."
      },
      {
        "step_order": 4,
        "step_text": "In a medium bowl, whisk together the flour, baking powder, salt, and the optional cinnamon, cloves, and ginger if using."
      },
      {
        "step_order": 5,
        "step_text": "In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the shortening and granulated sugar together on medium-high speed until light and fluffy, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed."
      },
      {
        "step_order": 6,
        "step_text": "Add the egg and vanilla and beat until smooth, about 1 minute."
      },
      {
        "step_order": 7,
        "step_text": "Add about half of the dry ingredients and beat on low until just combined. Pour in the milk and beat until smooth. Add the remaining dry ingredients and beat on low until just combined. Do not overmix."
      },
      {
        "step_order": 8,
        "step_text": "Pour the batter evenly over the pineapple and cherries in the prepared pan and smooth the top. Tap the pan gently on the counter once or twice to release any large air bubbles."
      },
      {
        "step_order": 9,
        "step_text": "Bake until the top is golden, springs back when lightly pressed, and a toothpick inserted in the cake portion comes out clean, about 35\u201345 minutes."
      },
      {
        "step_order": 10,
        "step_text": "Let the cake cool in the pan on a wire rack for exactly 10 minutes \u2014 no longer, or the topping will stick. Run a thin knife around the edge, place a serving plate over the pan, and quickly invert. Lift off the pan, replacing any pineapple or cherries that stick. Serve warm or at room temperature."
      }
    ]
  },
  {
    "recipe_id": "SWEET_023",
    "food_word": "CAKESHORTCAKE",
    "recipe_name": "Shortcake (Biscuit-Type)",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "8 biscuits",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during baking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18126 within an average macro discrepancy of 1.5%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, shortcake, biscuit-type, prepared from recipe",
        "ndb_no": "18126",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 250.0,
        "serving_count": 1.0,
        "notes": "section=biscuit"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 37.0,
        "serving_count": 1.0,
        "notes": "section=biscuit"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "double-acting baking powder",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 12.0,
        "serving_count": 1.0,
        "notes": "section=biscuit"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "table salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=biscuit"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 64.0,
        "serving_count": 1.0,
        "notes": "section=biscuit"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "whole milk",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
        "ndb_no": "1077",
        "portion_desc": "g",
        "portion_grams": 163.0,
        "serving_count": 1.0,
        "notes": "section=biscuit"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 450\u00b0F. Lightly grease a baking sheet or line with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "In a large bowl, whisk together the flour, sugar, baking powder, and salt until evenly blended."
      },
      {
        "step_order": 3,
        "step_text": "Cut the shortening into the dry ingredients with a pastry blender or two knives until the mixture resembles coarse crumbs the size of small peas."
      },
      {
        "step_order": 4,
        "step_text": "Pour in the milk all at once. Stir gently with a fork just until the dough comes together \u2014 do not overmix. The dough will be slightly sticky."
      },
      {
        "step_order": 5,
        "step_text": "Turn the dough out onto a lightly floured surface. Pat (do not roll) to about 3/4-inch thickness, folding once or twice to build flaky layers."
      },
      {
        "step_order": 6,
        "step_text": "Cut with a floured 2 1/2-inch round biscuit cutter, pressing straight down without twisting. Gather scraps gently and pat out once more to cut remaining biscuits. You should get 8 biscuits."
      },
      {
        "step_order": 7,
        "step_text": "Place biscuits on the prepared baking sheet with sides nearly touching for soft sides, or 1 inch apart for crisp sides."
      },
      {
        "step_order": 8,
        "step_text": "Bake 12\u201315 minutes until tops are golden brown and the biscuits have risen tall and split easily."
      },
      {
        "step_order": 9,
        "step_text": "Transfer to a rack. Serve warm, split horizontally with sweetened berries and whipped cream for classic strawberry shortcake."
      }
    ]
  },
  {
    "recipe_id": "SWEET_024",
    "food_word": "CAKESPONGE",
    "recipe_name": "Hot-Water Sponge Cake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "10 servings",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during baking. The water loss was calculated using published cooking-yield ranges from USDA Agricultural Handbook 102 and validated against USDA SR Legacy NDB 18134 within an average macro discrepancy of 3.0%.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, sponge, prepared from recipe",
        "ndb_no": "18134",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "5 large egg yolks",
        "ing_qty": "5 large yolks",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 85.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "5 large egg whites",
        "ing_qty": "5 large whites",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 165.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "sifted cake flour",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Wheat flour, white, cake, enriched",
        "ndb_no": "20084",
        "portion_desc": "g",
        "portion_grams": 114.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "hot water (about 180\u00b0F)",
        "ing_qty": "1/4 cup hot",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "fresh lemon juice",
        "ing_qty": "1 tablespoon",
        "sr28_long_desc": "Lemon juice, raw",
        "ndb_no": "9152",
        "portion_desc": "g",
        "portion_grams": 15.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "table salt",
        "ing_qty": "scant 1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 2.25,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "cream of tartar",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Leavening agents, cream of tartar",
        "ndb_no": "18373",
        "portion_desc": "g",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "section=cake"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Position a rack in the lower third of the oven and preheat to 325\u00b0F. Have ready an ungreased 10-inch tube (angel food) pan with a removable bottom \u2014 the batter must climb the sides as it bakes."
      },
      {
        "step_order": 2,
        "step_text": "Separate the eggs while cold (whites whip more cleanly when free of yolk). Place 5 yolks in a large mixing bowl and 5 whites in a separate clean, grease-free bowl. Let both come to room temperature, about 20 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Sift the cake flour once onto a sheet of parchment, then sift again with the salt. Set aside."
      },
      {
        "step_order": 4,
        "step_text": "Heat the water until just steaming (about 180\u00b0F) and stir in the lemon juice and vanilla. Set aside to cool slightly."
      },
      {
        "step_order": 5,
        "step_text": "Beat the yolks: With an electric mixer on high speed, beat the yolks until thick, pale yellow, and ribbon-stage \u2014 about 4\u20135 minutes. Gradually beat in half the sugar (1/2 cup / 100 g), then drizzle in the warm lemon-water mixture and beat 1 minute more until glossy and aerated."
      },
      {
        "step_order": 6,
        "step_text": "Beat the whites: With clean beaters, whip the whites on medium speed until foamy, then add the cream of tartar. Increase to high speed and beat to soft peaks. Gradually rain in the remaining sugar (1/2 cup / 100 g) and continue beating to firm, glossy peaks that hold their shape but still look moist (not dry or chunky)."
      },
      {
        "step_order": 7,
        "step_text": "Fold in the flour: Sift the flour mixture over the yolk mixture in three additions, gently folding with a large rubber spatula after each \u2014 turn the bowl as you fold to keep the batter light. Stop folding while a few flour streaks remain."
      },
      {
        "step_order": 8,
        "step_text": "Fold in the whites: Scoop one-third of the whipped whites onto the yolk batter and fold in to lighten. Add the remaining whites in two more additions, folding gently and just until no white streaks remain. Do not overmix \u2014 the airy whites are the only leavening."
      },
      {
        "step_order": 9,
        "step_text": "Pour the batter into the ungreased tube pan and gently smooth the top. Run a thin knife once through the batter in a circle to release any large air pockets."
      },
      {
        "step_order": 10,
        "step_text": "Bake on the lower rack for 40\u201350 minutes, until the top is golden, springs back when lightly pressed, and a wooden skewer inserted near the center comes out clean."
      },
      {
        "step_order": 11,
        "step_text": "Invert immediately: Flip the pan upside down onto the neck of a tall bottle (or use the pan's built-in feet) and let the cake cool completely upside-down, about 1 1/2 hours. This prevents the delicate sponge from collapsing under its own weight."
      },
      {
        "step_order": 12,
        "step_text": "To unmold: run a thin knife around the outer edge and around the center tube, then push the removable bottom up and out of the outer ring. Slide the knife under the cake to release it from the bottom. Slice with a serrated knife in a gentle sawing motion."
      }
    ]
  },
  {
    "recipe_id": "SWEET_025",
    "food_word": "CAKEANGELFOOD",
    "recipe_name": "Angel Food Cake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "12 servings",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade angel food cake. NOT validated against USDA SR Legacy NDB 18086 because the canonical entry reflects commercially prepared cake with industrial sodium-based preservatives, gums, and stabilizers (sodium 749 mg/100g vs ~189 mg/100g for the authentic from-scratch recipe). Built entirely from USDA single-NDB ingredients (egg whites, sugar, cake flour, cream of tartar, salt, vanilla, lemon juice) with no composite components.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, angelfood, commercially prepared",
        "ndb_no": "18086",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "12 large egg whites (about 1 1/2 cups)",
        "ing_qty": "12 large whites",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 396.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 300.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "sifted cake flour",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Wheat flour, white, cake, enriched",
        "ndb_no": "20084",
        "portion_desc": "g",
        "portion_grams": 114.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "cream of tartar",
        "ing_qty": "1 1/2 teaspoons",
        "sr28_long_desc": "Leavening agents, cream of tartar",
        "ndb_no": "18373",
        "portion_desc": "g",
        "portion_grams": 4.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "table salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 1/2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 6.3,
        "serving_count": 1.0,
        "notes": "section=cake"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Position a rack in the lower third of the oven and preheat to 350\u00b0F. Have ready a clean ungreased 10-inch tube (angel food) pan with a removable bottom \u2014 the batter must climb the ungreased sides as it bakes. Do not use a nonstick or greased pan; the cake will collapse."
      },
      {
        "step_order": 2,
        "step_text": "Separate the eggs while cold, letting not a speck of yolk fall into the whites (any fat will keep them from whipping). Place the 12 whites in a large grease-free metal or glass bowl. Let them stand at room temperature for 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Reserve 3/4 cup of the sugar for the meringue (this goes into the egg whites later). Sift the remaining 3/4 cup sugar together with the cake flour into a bowl. Re-sift the mixture two more times until well combined and airy \u2014 repeated sifting helps the sugar coat the flour particles, allowing them to fold into the delicate meringue without deflating it. Set aside."
      },
      {
        "step_order": 4,
        "step_text": "Add the cream of tartar and salt to the room-temperature whites. With an electric mixer on medium speed, beat until foamy and the whites turn opaque, about 1 minute. Add the vanilla."
      },
      {
        "step_order": 5,
        "step_text": "Increase the mixer to medium-high. Whip until the whites form soft peaks that gently flop over when the beaters are lifted, about 2\u20133 minutes."
      },
      {
        "step_order": 6,
        "step_text": "Still on medium-high, gradually rain in the reserved 3/4 cup sugar about 2 tablespoons at a time, beating well between additions. Continue until the whites form firm, glossy, moist peaks that hold their shape but are not dry or chunky, about 3\u20134 minutes more."
      },
      {
        "step_order": 7,
        "step_text": "Sift the flour-sugar mixture over the whites in four additions. After each addition, fold in gently with a large rubber spatula \u2014 cut down through the center, sweep across the bottom, and turn the bowl a quarter turn. Stop folding the moment no flour streaks remain. Do not overmix."
      },
      {
        "step_order": 8,
        "step_text": "Gently spoon the batter into the ungreased tube pan. Run a thin knife or skewer once through the batter in a circle to release any large air pockets, then smooth the top."
      },
      {
        "step_order": 9,
        "step_text": "Bake on the lower rack for 35\u201340 minutes, until the top is golden, springs back when lightly pressed, and a wooden skewer inserted near the center comes out clean. Cracks on the surface are normal and expected."
      },
      {
        "step_order": 10,
        "step_text": "Invert immediately: Flip the pan upside down and rest it on its built-in feet, or set it over something that elevates it. Let the cake cool completely upside-down, about 1 1/2 hours \u2014 this prevents the airy structure from collapsing under its own weight while it sets."
      },
      {
        "step_order": 11,
        "step_text": "To unmold: run a thin knife around the outer edge and around the center tube using a gentle sawing motion (do not press inward \u2014 keep the knife flush against the metal). Push the removable bottom up and out of the outer ring. Slide the knife under the cake to release it from the bottom."
      },
      {
        "step_order": 12,
        "step_text": "Slice with a serrated knife in a gentle sawing motion (a regular knife will compress the cake). Serve plain, with sweetened berries, or with a light glaze."
      }
    ]
  },
  {
    "recipe_id": "SWEET_026",
    "food_word": "CAKECHEESECAKE",
    "recipe_name": "Cheesecake (NY-Style)",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "45 min",
    "servings": "12 servings",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade NY-style cheesecake. NOT validated against USDA SR Legacy NDB 18147 because the canonical entry reflects commercially prepared cheesecake with industrial gums, modified starch, gelatin, and reduced-egg formulations (cholesterol 55 mg/100g vs ~121 mg/100g for the authentic full-fat recipe; sodium 438 mg/100g vs ~263 mg/100g without preservatives). Built entirely from USDA single-NDB ingredients (graham crackers, butter, cream cheese, sour cream, sugar, eggs, vanilla, salt) with no composite components.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cheesecake commercially prepared",
        "ndb_no": "18147",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "graham cracker crumbs (about 12 crackers)",
        "ing_qty": "1 1/2 cups crushed",
        "sr28_long_desc": "Cookies, graham crackers, plain or honey",
        "ndb_no": "18173",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (melted)",
        "ing_qty": "5 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 70.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "pinch",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "full-fat cream cheese, room temperature",
        "ing_qty": "32 oz (4 blocks)",
        "sr28_long_desc": "Cheese, cream",
        "ndb_no": "1017",
        "portion_desc": "g",
        "portion_grams": 908.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 1/4 cups",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 250.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "full-fat sour cream, room temperature",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Cream, sour, cultured",
        "ndb_no": "1056",
        "portion_desc": "g",
        "portion_grams": 115.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "large egg (room temperature)",
        "ing_qty": "4 large eggs",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "egg yolks",
        "ing_qty": "1 large yolk",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 17.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2 tablespoons",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 16.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "freshly grated lemon zest",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Lemon peel, raw",
        "ndb_no": "9156",
        "portion_desc": "g",
        "portion_grams": 2.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Position a rack in the lower-middle of the oven and preheat to 325\u00b0F."
      },
      {
        "step_order": 2,
        "step_text": "Use a springform pan protector, a leakproof springform pan, or wrap the outside bottom and sides of a 9-inch springform pan tightly with two layers of heavy-duty aluminum foil to prevent water from seeping in during the water bath."
      },
      {
        "step_order": 3,
        "step_text": "If not using a nonstick, non-toxic springform pan, line the bottom and sides with parchment paper."
      },
      {
        "step_order": 4,
        "step_text": "Make the crust: In a medium bowl, stir together the crushed graham crackers and 2 tablespoons of sugar. Drizzle in the melted butter and stir with a fork until the crumbs are evenly moistened and resemble wet sand."
      },
      {
        "step_order": 5,
        "step_text": "Transfer the crumb mixture to the springform pan. Press firmly and evenly across the bottom and about 1/2 inch up the sides using the flat bottom of a measuring cup. Bake the crust for 10 minutes, then transfer to a rack to cool while you prepare the filling. Maintain an oven temperature of 325\u00b0F."
      },
      {
        "step_order": 6,
        "step_text": "Make the filling: In the bowl of a stand mixer fitted with the paddle attachment (or a large bowl with a hand mixer), beat the room-temperature cream cheese on medium-low speed until completely smooth and lump-free, about 2\u20133 minutes. Scrape down the bowl and paddle thoroughly."
      },
      {
        "step_order": 7,
        "step_text": "Add the 1 1/4 cups sugar and salt and beat on medium-low until smooth and creamy, about 2 minutes. Scrape down again. Add the flour and lemon zest and beat until just combined. Beat in the sour cream and vanilla just until incorporated."
      },
      {
        "step_order": 8,
        "step_text": "With the mixer on low speed, add the whole eggs one at a time, beating just until each is incorporated and scraping down between additions. Finally beat in the extra yolk on low. Do not overbeat \u2014 overmixing incorporates air, which causes cracks during baking."
      },
      {
        "step_order": 9,
        "step_text": "Pour the filling into the cooled crust and gently smooth the top. Tap the pan gently on the counter a few times to release any large air bubbles."
      },
      {
        "step_order": 10,
        "step_text": "Set up the water bath: Place the springform pan in a large roasting pan. Pour very hot tap water into the roasting pan to come about 1 inch up the sides of the foil-wrapped springform \u2014 the water bath ensures gentle, even baking and prevents cracking."
      },
      {
        "step_order": 11,
        "step_text": "Bake at 325\u00b0F for 60\u201375 minutes, until the outer 2 inches are set and barely puffed, the center 3 inches still wobbles like just-set jelly when the pan is gently nudged, and the surface is pale ivory with no browning. Do not overbake \u2014 the center will firm up as it cools."
      },
      {
        "step_order": 12,
        "step_text": "Slow cool in the oven: Turn off the oven, prop the door open about 4 inches with a wooden spoon, and let the cheesecake cool slowly in the oven for 1 hour. This gradual cooling helps prevent surface cracks."
      },
      {
        "step_order": 13,
        "step_text": "Carefully remove the cheesecake from the water bath. Run a thin knife around the edge of the pan to release the cake from the sides (this also helps prevent cracking as it shrinks while cooling). Cool on a rack to room temperature, about 1 hour more."
      },
      {
        "step_order": 14,
        "step_text": "Chill: Cover loosely and refrigerate at least 8 hours, preferably overnight, to fully set the texture. To serve, release the springform ring, slide a thin spatula under the crust to lift onto a serving plate, and slice with a knife dipped in hot water and wiped clean between cuts."
      }
    ]
  },
  {
    "recipe_id": "SWEET_027",
    "food_word": "CAKECOFFEECAKE",
    "recipe_name": "Sour Cream Coffee Cake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "30 min",
    "servings": "10 servings",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade sour cream coffee cake with cinnamon crumb topping. NOT validated against USDA SR Legacy NDB 18104 because the canonical entry reflects commercially prepared coffee cake with hydrogenated shortening, reduced-egg formulations, low-moisture shelf-stable formulation, and sodium-based preservatives (cholesterol 32 mg/100g vs ~88 mg/100g for the authentic recipe; protein 6.8 g vs 5.0 g, fat 23.3 g vs 18.6 g; sodium 351 mg/100g vs ~255 mg/100g without preservatives). Built entirely from USDA single-NDB ingredients (AP flour, baking powder, baking soda, salt, butter, sugars, eggs, vanilla, sour cream, cinnamon) with no composite components.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Coffeecake, cinnamon with crumb topping, commercially prepared, enriched",
        "ndb_no": "18104",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 240.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 4.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 1.2,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (room temperature)",
        "ing_qty": "8 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 198.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "large egg (room temperature)",
        "ing_qty": "2 large eggs",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "sour cream (room temperature)",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Cream, sour, cultured",
        "ndb_no": "1056",
        "portion_desc": "g",
        "portion_grams": 230.0,
        "serving_count": 1.0,
        "notes": "section=cake"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 60.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "light brown sugar",
        "ing_qty": "1/4 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 55.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "pinch",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "section=topping"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (cold cut into pieces)",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 43.0,
        "serving_count": 1.0,
        "notes": "section=topping"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Position a rack in the center of the oven and preheat to 350\u00b0F. Butter a 9-inch square baking pan and line the bottom with a parchment sling (leaving an overhang on two sides for easy lift-out)."
      },
      {
        "step_order": 2,
        "step_text": "Make the crumb topping: In a medium bowl, whisk together the 1/2 cup flour, brown sugar, cinnamon, and pinch of salt. Add the cold cubed butter and rub it in with your fingertips (or cut in with a pastry blender) until the mixture forms damp, pebbly crumbs ranging from pea-sized to small-marble-sized. Refrigerate while you make the cake."
      },
      {
        "step_order": 3,
        "step_text": "Mix the dry ingredients: In a separate medium bowl, whisk together the 2 cups flour, baking powder, baking soda, and salt. Set aside."
      },
      {
        "step_order": 4,
        "step_text": "Cream the butter and sugar: In the bowl of a stand mixer fitted with the paddle attachment (or a large bowl with a hand mixer), beat the room-temperature butter on medium speed until smooth, about 1 minute. Add the granulated sugar and beat on medium-high until light, pale, and fluffy, 3\u20134 minutes, scraping down the bowl once."
      },
      {
        "step_order": 5,
        "step_text": "Add the eggs and vanilla: Reduce the mixer to medium and add the eggs one at a time, beating well and scraping down the bowl after each addition. Beat in the vanilla."
      },
      {
        "step_order": 6,
        "step_text": "Alternate dry and sour cream to protect the emulsion and minimize gluten development: With the mixer on low speed, add the flour and sour cream in 5 additions in this exact order, mixing just until each addition is incorporated and scraping down the bowl as needed: (a) Add one-third of the flour mixture and mix until just blended. (b) Add half of the sour cream and mix until just blended. (c) Add another one-third of the flour mixture and mix until just blended. (d) Add the remaining sour cream and mix until just blended. (e) Add the final one-third of the flour mixture and mix only until no flour streaks remain. The batter will be thick and creamy. Do not overmix."
      },
      {
        "step_order": 7,
        "step_text": "Assemble: Spread the batter evenly in the prepared pan, smoothing the top with an offset spatula. Scatter the chilled crumb topping evenly over the entire surface, breaking up any large clumps with your fingers so the crumbs are distributed in pebbles rather than sheets."
      },
      {
        "step_order": 8,
        "step_text": "Bake at 350\u00b0F for 40\u201350 minutes, until the topping is golden brown, the cake springs back when lightly pressed at the center, and a wooden toothpick inserted in the cake (not into a melted butter pocket) comes out with just a few moist crumbs."
      },
      {
        "step_order": 9,
        "step_text": "Transfer the pan to a wire rack and let cool for at least 30 minutes. Lift out using the parchment sling and slice into 10 squares (or 9 if you prefer larger pieces). Serve warm or at room temperature."
      },
      {
        "step_order": 10,
        "step_text": "Storage: Cover loosely with foil at room temperature for up to 2 days, or wrap individual slices and refrigerate up to 5 days. Reheat briefly in a 300\u00b0F oven or toaster oven to refresh the crumb texture."
      }
    ]
  },
  {
    "recipe_id": "SWEET_028",
    "food_word": "CAKEPOUND",
    "recipe_name": "Pound Cake",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "10 servings",
    "sr28_rule": "Rule C",
    "sr28_notes": "Authentic homemade American pound cake built in the classic 1:1 butter-to-sugar ratio. NOT validated against USDA SR Legacy NDB 18120 because the canonical entry reflects commercially prepared pound cake with reduced butter padded by corn syrup/water, reduced-egg formulations, and sodium-based preservatives (fat 14 g/100g vs ~22 g/100g for an authentic butter-rich pound cake; cholesterol 66 mg/100g vs ~131 mg/100g; sodium 377 mg/100g vs ~225 mg/100g without preservatives; sugar 33 g/100g vs ~22 g/100g without sugar/corn-syrup padding). Built entirely from USDA single-NDB ingredients (butter, granulated sugar, eggs, AP flour, baking powder, salt, whole milk, vanilla) with no composite components.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cake, pound, commercially prepared, butter (includes fresh and frozen)",
        "ndb_no": "18120",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter (room temperature)",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 227.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 198.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "large egg (room temperature)",
        "ing_qty": "4 large eggs",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 240.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 4.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "sour cream (room temperature)",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cream, sour, cultured",
        "ndb_no": "1056",
        "portion_desc": "g",
        "portion_grams": 58.0,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Position a rack in the lower-middle of the oven and preheat to 325\u00b0F. Generously butter a 9x5-inch loaf pan and dust with flour, tapping out the excess (or line with a parchment sling for easy lift-out)."
      },
      {
        "step_order": 2,
        "step_text": "Mix the dry ingredients: In a medium bowl, whisk together the AP flour, baking powder, and salt. Set aside."
      },
      {
        "step_order": 3,
        "step_text": "Cream the butter and sugar: In the bowl of a stand mixer fitted with the paddle attachment (or a large bowl with a hand mixer), beat the room-temperature butter on medium speed until smooth and creamy, about 1 minute. Add the sugar and beat on medium-high until very pale, light, and fluffy \u2014 about 5 minutes, scraping down the bowl twice. Do not rush this step; this is where pound cake gets most of its lift."
      },
      {
        "step_order": 4,
        "step_text": "Add the eggs: Reduce the mixer to medium and add the eggs one at a time, beating for 30 seconds and scraping down the bowl after each addition. The mixture should remain emulsified and creamy; if it looks curdled or broken, beat in a tablespoon of the measured flour to bring it back together. Beat in the vanilla and sour cream until fully incorporated."
      },
      {
        "step_order": 5,
        "step_text": "Add the dry ingredients: With the mixer on low speed, add the flour mixture in 3 additions, mixing just until each addition is incorporated and scraping down the bowl as needed: (a) Add one-third of the flour mixture and mix until just blended. (b) Add another one-third and mix until just blended. (c) Add the final one-third and mix only until no flour streaks remain. The batter will be thick, smooth, and dense. Do not overmix."
      },
      {
        "step_order": 6,
        "step_text": "Transfer to the pan: Scrape the batter into the prepared loaf pan and smooth the top with an offset spatula, building the batter slightly higher at the corners and ends than in the center (this helps the cake rise level instead of doming)."
      },
      {
        "step_order": 7,
        "step_text": "Bake at 325\u00b0F for 65\u201380 minutes, until the top is deep golden brown, a long crack runs down the center (this is normal and desirable), the cake springs back when lightly pressed, and a wooden skewer inserted in the deepest part comes out with just a few moist crumbs. If the top is browning too quickly past the 50-minute mark, tent loosely with foil."
      },
      {
        "step_order": 8,
        "step_text": "Cool: Transfer the pan to a wire rack and let cool for 15 minutes. Run a thin knife around the edge, then invert onto the rack and turn the cake right-side up. Let cool completely before slicing, at least 1 hour \u2014 pound cake's crumb continues to set as it cools and slices much more cleanly when fully cool."
      },
      {
        "step_order": 9,
        "step_text": "Slice and serve: Cut into 10 slices with a serrated knife in a gentle sawing motion. Serve plain, dusted with confectioners' sugar, with macerated berries, with a dollop of whipped cream, or toasted with butter for breakfast."
      },
      {
        "step_order": 10,
        "step_text": "Storage: Wrap tightly in plastic at room temperature for up to 3 days, or refrigerate up to 1 week, or freeze (whole or sliced) up to 3 months. The flavor improves on day 2 as the butter mellows."
      }
    ]
  },
  {
    "recipe_id": "SWEET_029",
    "food_word": "COOKIESBROWNIES",
    "recipe_name": "Brownies (Fudgy)",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "16 brownies",
    "sr28_rule": "Rule B",
    "sr28_notes": "The nutrient values reflect water loss during baking and were validated against USDA SR Legacy NDB 18154 on all usable nutrients. Sugar and fiber are excluded from strict validation because the canonical entry reports both as 0.0 g/100g despite a high-carbohydrate brownie profile.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, brownies, prepared from recipe",
        "ndb_no": "18154",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "vegetable shortening",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
        "ndb_no": "4031",
        "portion_desc": "g",
        "portion_grams": 130.0,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 57.0,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "granulated sugar",
        "ing_qty": "1 cup + 1 tablespoon",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 210.0,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "large eggs",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "pure vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "all-purpose flour",
        "ing_qty": "2/3 cup",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 80.0,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "unsweetened cocoa powder",
        "ing_qty": "1 cup + 1 tablespoon",
        "sr28_long_desc": "Cocoa, dry powder, unsweetened",
        "ndb_no": "19165",
        "portion_desc": "g",
        "portion_grams": 95.0,
        "serving_count": 1.0,
        "notes": "section=batter"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "table salt",
        "ing_qty": "scant 1 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 5.5,
        "serving_count": 1.0,
        "notes": "section=batter"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Position a rack in the center of the oven and preheat to 350\u00b0F. Grease a 9-inch square metal baking pan and line it with parchment, leaving overhang on two sides for easy lift-out."
      },
      {
        "step_order": 2,
        "step_text": "In a large bowl, stir together the vegetable shortening and butter until smooth and creamy."
      },
      {
        "step_order": 3,
        "step_text": "Add the sugar and whisk until glossy and well blended."
      },
      {
        "step_order": 4,
        "step_text": "Whisk in the eggs one at a time, then whisk in the vanilla until smooth."
      },
      {
        "step_order": 5,
        "step_text": "In a separate bowl, whisk together the flour, cocoa powder, and salt."
      },
      {
        "step_order": 6,
        "step_text": "Fold the dry ingredients into the wet mixture just until no dry streaks remain. Do not overmix."
      },
      {
        "step_order": 7,
        "step_text": "Spread the batter evenly in the prepared pan and smooth the top with an offset spatula."
      },
      {
        "step_order": 8,
        "step_text": "Bake for 22\u201328 minutes, until the top is set and a toothpick inserted 1 inch from the edge comes out with moist crumbs."
      },
      {
        "step_order": 9,
        "step_text": "Cool completely in the pan on a wire rack. Lift out using the parchment overhang and cut into 16 squares."
      }
    ]
  },
  {
    "recipe_id": "SWEET_030",
    "food_word": "COOKIESOATMEAL",
    "recipe_name": "Cookies, Oatmeal with Raisins",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "24 cookies",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from an authentic Quaker-style home recipe and treated as Rule 2. USDA SR Legacy NDB 18184 appears to reflect a different formulation with materially higher sodium and lower moisture than this batch profile.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, oatmeal, prepared from recipe, with raisins",
        "ndb_no": "18184",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1/2 cup + 6 tbsp",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 199.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "3/4 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 165.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 185.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "rolled oats (regular/quick oats)",
        "ing_qty": "3 cups",
        "sr28_long_desc": "Cereals, oats, regular and quick, not fortified, dry",
        "ndb_no": "8120",
        "portion_desc": "g",
        "portion_grams": 300.0,
        "serving_count": 1.0
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "raisins",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Raisins, seedless",
        "ndb_no": "9298",
        "portion_desc": "g",
        "portion_grams": 140.0,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 350\u00b0F. Line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Cream butter and sugar together until light and fluffy (2\u20133 minutes)."
      },
      {
        "step_order": 3,
        "step_text": "Beat in eggs one at a time, then add vanilla extract."
      },
      {
        "step_order": 4,
        "step_text": "In a separate bowl, whisk together flour, oats, baking soda, cinnamon, and salt."
      },
      {
        "step_order": 5,
        "step_text": "Fold dry ingredients into wet ingredients until just combined; do not overmix."
      },
      {
        "step_order": 6,
        "step_text": "Fold in raisins gently until evenly distributed."
      },
      {
        "step_order": 7,
        "step_text": "Scoop dough onto parchment sheets, spacing 2 inches apart (dough will spread)."
      },
      {
        "step_order": 8,
        "step_text": "Bake 13\u201317 minutes, until edges are golden and center is set."
      },
      {
        "step_order": 9,
        "step_text": "Cool on baking sheet for 5 minutes, then transfer to wire rack to cool completely."
      }
    ]
  },
  {
    "recipe_id": "SWEET_031",
    "food_word": "COOKIESSUGAR",
    "recipe_name": "Cookies, Sugar, from Recipe with Margarine",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "24 cookies",
    "sr28_rule": "Rule A",
    "sr28_notes": "Rule 1 validated. All 8 nutrients within \u00b15%: cal +0.58%, pro +2.46%, fat +3.25%, carb -2.06%, fib -2.84%, h2o +0.60%, sug +2.28%, sodium -2.99%. Formula: 2\u00be cups flour, 1 cup margarine, \u00be cup sugar + \u00bc cup rolling, 2 eggs, \u00bd tsp salt, 2 tsp baking powder. Yield 0.46 (54% water loss for thin rolled cookies). Recipe consensus from 5 reference sources; \u00bd tsp salt aligns with Recipes 1, 3, 4.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, sugar, prepared from recipe, made with margarine",
        "ndb_no": "18208",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2\u00be cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 350.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 8.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "\u00bd teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "margarine stick salted",
        "ing_qty": "1 cup (2 sticks)",
        "sr28_long_desc": "Margarine, regular, 80% fat, composite, stick, with salt",
        "ndb_no": "4610",
        "portion_desc": "g",
        "portion_grams": 227.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "\u00be cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 155.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "2 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "\u00bc cup for rolling",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=rolling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 375\u00b0F. Line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Beat margarine and sugar together until light and fluffy (2\u20133 minutes)."
      },
      {
        "step_order": 3,
        "step_text": "Add eggs one at a time, beating well after each addition, then mix in vanilla."
      },
      {
        "step_order": 4,
        "step_text": "In a separate bowl, whisk together flour, baking powder, and salt."
      },
      {
        "step_order": 5,
        "step_text": "Gradually mix dry ingredients into wet ingredients until a soft dough forms."
      },
      {
        "step_order": 6,
        "step_text": "Roll dough into 1-inch balls. Roll each ball in the reserved granulated sugar."
      },
      {
        "step_order": 7,
        "step_text": "Place 2 inches apart on prepared baking sheets; flatten slightly with the bottom of a glass."
      },
      {
        "step_order": 8,
        "step_text": "Bake 8\u201310 minutes, until edges are lightly golden. Do not overbake."
      },
      {
        "step_order": 9,
        "step_text": "Cool on baking sheet for 2 minutes, then transfer to a wire rack to cool completely."
      }
    ]
  },
  {
    "recipe_id": "SWEET_032",
    "food_word": "COOKIESGINGERSNAP",
    "recipe_name": "Cookies, Gingersnaps",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "48 cookies",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home gingersnap recipe consensus (5 reference sources). USDA SR Legacy NDB 18172 reflects a commercial packaged product with lower fat, analytically lower sugar, higher apparent fiber, and higher protein than achievable from home recipe formula.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, gingersnaps",
        "ndb_no": "18172",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2\u00bc cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 270.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 10.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "\u00bd teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "\u00bd cup (1 stick)",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "molasses",
        "ing_qty": "\u00bd cup",
        "sr28_long_desc": "Molasses",
        "ndb_no": "19304",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "ground ginger",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Spices, ginger, ground",
        "ndb_no": "2021",
        "portion_desc": "g",
        "portion_grams": 3.6,
        "serving_count": 1.0
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "ground cloves",
        "ing_qty": "\u00bd teaspoon",
        "sr28_long_desc": "Spices, cloves, ground",
        "ndb_no": "2011",
        "portion_desc": "g",
        "portion_grams": 2.1,
        "serving_count": 1.0
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "\u00bc cup for rolling",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=rolling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 375\u00b0F. Line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Beat butter and sugar together until light and fluffy (2\u20133 minutes)."
      },
      {
        "step_order": 3,
        "step_text": "Beat in egg, then stir in molasses until fully combined."
      },
      {
        "step_order": 4,
        "step_text": "In a separate bowl, whisk together flour, baking soda, salt, ginger, cinnamon, and cloves."
      },
      {
        "step_order": 5,
        "step_text": "Gradually mix dry ingredients into wet ingredients until a smooth dough forms."
      },
      {
        "step_order": 6,
        "step_text": "Roll dough into 1-inch balls. Roll each ball in the reserved granulated sugar."
      },
      {
        "step_order": 7,
        "step_text": "Place 2 inches apart on prepared baking sheets."
      },
      {
        "step_order": 8,
        "step_text": "Bake 10\u201312 minutes, until cookies are set and surface is cracked. Do not overbake."
      },
      {
        "step_order": 9,
        "step_text": "Cool on baking sheet for 5 minutes, then transfer to a wire rack."
      }
    ]
  },
  {
    "recipe_id": "SWEET_033",
    "food_word": "COOKIESBUTTER",
    "recipe_name": "Cookies, Butter, Homemade",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "60 cookies",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home butter cookie recipe consensus (Recipes 2, 4, 5). USDA SR Legacy NDB 18155 is a commercially prepared butter wafer with significantly lower fat, sugar, water, and sodium content than any home-based formula would produce. Not comparable to home recipe profile.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, butter, commercially prepared, enriched",
        "ndb_no": "18155",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1 cup (2 sticks)",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 227.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 200.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 8.4,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2\u00bc cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 280.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "\u00bc teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 325\u00b0F. Line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Beat butter and sugar together until light and fluffy (3\u20134 minutes)."
      },
      {
        "step_order": 3,
        "step_text": "Beat in egg and vanilla extract until well combined."
      },
      {
        "step_order": 4,
        "step_text": "In a separate bowl, whisk together flour and salt."
      },
      {
        "step_order": 5,
        "step_text": "Gradually mix dry ingredients into wet ingredients until a soft dough forms."
      },
      {
        "step_order": 6,
        "step_text": "Drop small spoonfuls (\u00bd teaspoon) onto prepared baking sheets, spacing 1 inch apart."
      },
      {
        "step_order": 7,
        "step_text": "Bake 12\u201315 minutes, until edges are set and bottoms are pale golden. Cookies should be soft."
      },
      {
        "step_order": 8,
        "step_text": "Cool on baking sheet for 3 minutes, then transfer to a wire rack."
      }
    ]
  },
  {
    "recipe_id": "SWEET_034",
    "food_word": "COOKIESCHOCOLATECHIP",
    "recipe_name": "Cookies, Chocolate Chip, Homemade",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "48 cookies",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home chocolate chip cookie recipe consensus (Recipes 2, 5). USDA SR Legacy NDB 18164 is a commercially prepared refrigerated dough product with stabilizers and very low moisture content not achievable in home formula. Canonical water (3.0g/100g) and sugar (0.0g) are product-specific anomalies. Not comparable to home recipe.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, chocolate chip, refrigerated dough, baked",
        "ndb_no": "18164",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2\u00bc cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 280.0,
        "serving_count": 1.0
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "\u00bd teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.0,
        "serving_count": 1.0
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "\u00be cup (1\u00bd sticks, melted)",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "\u00be cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "\u00bd cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "egg yolks",
        "ing_qty": "1 egg yolk",
        "sr28_long_desc": "Egg, yolk, raw, fresh",
        "ndb_no": "1125",
        "portion_desc": "g",
        "portion_grams": 18.0,
        "serving_count": 1.0
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "2 teaspoons",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 8.4,
        "serving_count": 1.0
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "chocolate chips semi-sweet",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Chocolate, dark, cacao solids 45-59%, including coatings",
        "ndb_no": "14106",
        "portion_desc": "g",
        "portion_grams": 340.0,
        "serving_count": 1.0
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 350\u00b0F. Line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Whisk together flour, baking soda, and salt in a bowl; set aside."
      },
      {
        "step_order": 3,
        "step_text": "In a separate bowl, stir together melted butter, brown sugar, and granulated sugar until combined."
      },
      {
        "step_order": 4,
        "step_text": "Beat in egg and egg yolk, then add vanilla extract and stir until well combined."
      },
      {
        "step_order": 5,
        "step_text": "Fold dry ingredients into wet ingredients until just combined. Do not overmix."
      },
      {
        "step_order": 6,
        "step_text": "Fold in chocolate chips gently until evenly distributed."
      },
      {
        "step_order": 7,
        "step_text": "Drop rounded tablespoons of dough onto prepared baking sheets, spacing 2 inches apart."
      },
      {
        "step_order": 8,
        "step_text": "Bake 11\u201313 minutes, until edges are set and centers are still soft. Do not overbake."
      },
      {
        "step_order": 9,
        "step_text": "Cool on baking sheet for 3 minutes, then transfer to a wire rack to cool completely."
      }
    ]
  },
  {
    "recipe_id": "SWEET_035",
    "food_word": "COOKIESFIGBAR",
    "recipe_name": "Cookies, Fig Bars",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "16 bars",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home fig bar recipe consensus (Recipes 1, 3, 4, 5). USDA SR Legacy NDB 18170 is a commercially prepared fig bar with very high fig-to-flour ratio and minimal fat binding not achievable in traditional home crust-based formula. Home recipes necessarily use more butter/flour for structure and yield higher protein/fat.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, fig bars",
        "ndb_no": "18170",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "dried figs",
        "ing_qty": "2 cups",
        "sr28_long_desc": "Figs, dried, uncooked",
        "ndb_no": "9094",
        "portion_desc": "g",
        "portion_grams": 300.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "\u00be cup",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 180.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1\u2153 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 180.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "\u2153 cup + 2 tbsp",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 70.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "\u2153 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 80.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 4.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "\u00bc teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=crust"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Prepare filling: Bring water to a boil in a small saucepan. Add chopped figs and remove from heat. Let sit 15 minutes, then stir to break figs into a paste."
      },
      {
        "step_order": 2,
        "step_text": "Preheat oven to 350\u00b0F. Grease an 8\u00d78 or 9\u00d79 inch baking pan."
      },
      {
        "step_order": 3,
        "step_text": "Make crust: Beat butter and brown sugar together until fluffy. Beat in egg and vanilla."
      },
      {
        "step_order": 4,
        "step_text": "Whisk together flour, baking powder, and salt. Fold into wet ingredients until just combined."
      },
      {
        "step_order": 5,
        "step_text": "Spread half the crust mixture into prepared pan, pressing gently."
      },
      {
        "step_order": 6,
        "step_text": "Spread fig filling evenly over crust layer."
      },
      {
        "step_order": 7,
        "step_text": "Top with remaining crust mixture, spreading or dropping spoonfuls to cover filling."
      },
      {
        "step_order": 8,
        "step_text": "Bake 30\u201335 minutes, until golden and a toothpick inserted comes out clean."
      },
      {
        "step_order": 9,
        "step_text": "Cool completely in pan, then cut into bars (16 squares)."
      }
    ]
  },
  {
    "recipe_id": "SWEET_036",
    "food_word": "COOKIESMACAROON",
    "recipe_name": "Cookies, Coconut Macaroon",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "15 min",
    "servings": "24 macaroons",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home coconut-macaroon references using classic egg-white method. Despite corrected ingredient proportions, USDA SR Legacy NDB 28309 remains non-convergent across key macros, indicating a commercial product profile not fully reproducible with home supermarket formulations.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, coconut macaroon",
        "ndb_no": "28309",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "egg whites",
        "ing_qty": "4 large",
        "sr28_long_desc": "Egg, white, raw, fresh",
        "ndb_no": "1124",
        "portion_desc": "g",
        "portion_grams": 132.0,
        "serving_count": 1.0,
        "notes": "section=macaroons"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=macaroons"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=macaroons"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/8 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 0.75,
        "serving_count": 1.0,
        "notes": "section=macaroons"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "sweetened shredded coconut",
        "ing_qty": "1 (14-ounce) bag (about 5 1/3 cups)",
        "sr28_long_desc": "Nuts, coconut meat, dried (desiccated), sweetened, shredded",
        "ndb_no": "12179",
        "portion_desc": "g",
        "portion_grams": 397.0,
        "serving_count": 1.0,
        "notes": "section=macaroons"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 325\u00b0F. Line two baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "In a clean bowl, whisk egg whites and salt until frothy (not stiff peaks)."
      },
      {
        "step_order": 3,
        "step_text": "Whisk in granulated sugar until dissolved and glossy."
      },
      {
        "step_order": 4,
        "step_text": "Stir in vanilla extract."
      },
      {
        "step_order": 5,
        "step_text": "Fold in sweetened shredded coconut until evenly coated and mixture holds together when pressed."
      },
      {
        "step_order": 6,
        "step_text": "Use a small cookie scoop or two spoons to portion 24 mounds onto prepared baking sheets."
      },
      {
        "step_order": 7,
        "step_text": "Bake 20\u201324 minutes until edges and tops are lightly golden."
      },
      {
        "step_order": 8,
        "step_text": "Cool on sheet 5 minutes, then transfer to a rack to cool completely."
      }
    ]
  },
  {
    "recipe_id": "SWEET_037",
    "food_word": "COOKIESMOLASSES",
    "recipe_name": "Cookies, Molasses",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "30 cookies",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home molasses-cookie references (Recipes 1-5) using standard pantry ingredients and classic crackle-cookie method. USDA SR Legacy NDB 18177 appears nutritionally non-equivalent to these home formulas, especially on sugar/fat/water profile, so this recipe is classified as Rule 2.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, molasses",
        "ndb_no": "18177",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 170.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "3/4 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 165.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "molasses",
        "ing_qty": "1/3 cup",
        "sr28_long_desc": "Molasses",
        "ndb_no": "19304",
        "portion_desc": "g",
        "portion_grams": 110.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2 1/4 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 281.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1 1/2 teaspoons",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 7.5,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "ground cinnamon",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, cinnamon, ground",
        "ndb_no": "2010",
        "portion_desc": "g",
        "portion_grams": 2.6,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "ground ginger",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Spices, ginger, ground",
        "ndb_no": "2021",
        "portion_desc": "g",
        "portion_grams": 2.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "ground cloves",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, cloves, ground",
        "ndb_no": "2011",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "3 tablespoons (for rolling)",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 36.0,
        "serving_count": 1.0,
        "notes": "optional;section=cookies"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 350\u00b0F and line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Cream softened butter and brown sugar until light and fluffy, about 2-3 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Beat in molasses and egg until fully combined."
      },
      {
        "step_order": 4,
        "step_text": "In a separate bowl, whisk flour, baking soda, cinnamon, ginger, cloves, and salt."
      },
      {
        "step_order": 5,
        "step_text": "Add dry ingredients to wet ingredients and mix just until no dry streaks remain."
      },
      {
        "step_order": 6,
        "step_text": "Cover and chill dough 20-30 minutes so it is easy to scoop and roll."
      },
      {
        "step_order": 7,
        "step_text": "Scoop into 1 to 1 1/2 tablespoon portions, roll into balls, and coat lightly in granulated sugar."
      },
      {
        "step_order": 8,
        "step_text": "Place 2 inches apart and bake 9-11 minutes, until puffed and crackled with set edges."
      },
      {
        "step_order": 9,
        "step_text": "Cool 5 minutes on the pan, then move to a wire rack to cool completely."
      }
    ]
  },
  {
    "recipe_id": "SWEET_038",
    "food_word": "COOKIESPEANUTBUTTER",
    "recipe_name": "Cookies, Peanut Butter",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "30 cookies",
    "sr28_rule": "Rule C",
    "sr28_notes": "Built from authentic home peanut-butter cookie references with proportions intentionally preserved when Rule 1 was not fully attainable. USDA SR Legacy NDB 18188 appears to represent a commercial refrigerated-dough profile with canonical sugar=0 artifact; therefore recipe is classified as Rule 2 while maintaining realistic home-recipe ratios.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, peanut butter, refrigerated dough, baked",
        "ndb_no": "18188",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 100.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "brown sugar",
        "ing_qty": "1/2 cup packed",
        "sr28_long_desc": "Sugars, brown",
        "ndb_no": "19334",
        "portion_desc": "g",
        "portion_grams": 106.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "smooth peanut butter",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Peanut butter, smooth style, with salt",
        "ndb_no": "16098",
        "portion_desc": "g",
        "portion_grams": 198.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "1 large",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 50.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "optional;section=cookies"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 180.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "baking soda",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Leavening agents, baking soda",
        "ndb_no": "18372",
        "portion_desc": "g",
        "portion_grams": 5.0,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "baking powder",
        "ing_qty": "1/2 teaspoon",
        "sr28_long_desc": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
        "ndb_no": "18369",
        "portion_desc": "g",
        "portion_grams": 2.0,
        "serving_count": 1.0,
        "notes": "optional;section=cookies"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=cookies"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "2 tablespoons (for rolling)",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 25.0,
        "serving_count": 1.0,
        "notes": "optional;section=rolling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 350\u00b0F and line baking sheets with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Cream butter, granulated sugar, and brown sugar until smooth and fluffy."
      },
      {
        "step_order": 3,
        "step_text": "Beat in peanut butter, egg, and vanilla until fully combined."
      },
      {
        "step_order": 4,
        "step_text": "Whisk flour, baking soda, baking powder, and salt in a separate bowl."
      },
      {
        "step_order": 5,
        "step_text": "Add dry mixture to wet and mix just until combined; do not overmix."
      },
      {
        "step_order": 6,
        "step_text": "Chill dough 20-30 minutes if soft."
      },
      {
        "step_order": 7,
        "step_text": "Scoop 1 to 1 1/2 tablespoon portions, roll into balls, and roll in granulated sugar."
      },
      {
        "step_order": 8,
        "step_text": "Place on baking sheet and press lightly with a fork to form crosshatch pattern."
      },
      {
        "step_order": 9,
        "step_text": "Bake 9-11 minutes until edges are set and tops are lightly cracked. Cool 5 minutes, then transfer to rack."
      }
    ]
  },
  {
    "recipe_id": "SWEET_039",
    "food_word": "COOKIESSHORTBREAD",
    "recipe_name": "Cookies, Shortbread",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "20 min",
    "servings": "36 cookies",
    "sr28_rule": "Rule A",
    "sr28_notes": "Validated against USDA SR Legacy NDB 18192 within Rule 1 tolerance bands using authentic shortbread ingredient structure.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "sr28_long_desc": "Cookies, shortbread, commercially prepared, plain",
        "ndb_no": "18192",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1 cup (slightly scant)",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 224.0,
        "serving_count": 1.0,
        "notes": "section=shortbread"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "3/4 cup",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=shortbread"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=shortbread"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 6.0,
        "serving_count": 1.0,
        "notes": "section=shortbread"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "2 1/2 cups + 1 tablespoon",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 320.0,
        "serving_count": 1.0,
        "notes": "section=shortbread"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "cornstarch",
        "ing_qty": "1/4 cup",
        "sr28_long_desc": "Cornstarch",
        "ndb_no": "20027",
        "portion_desc": "g",
        "portion_grams": 31.0,
        "serving_count": 1.0,
        "notes": "optional;section=shortbread"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "Preheat oven to 325\u00b0F and line a baking sheet with parchment paper."
      },
      {
        "step_order": 2,
        "step_text": "Cream butter and powdered sugar until smooth and fluffy, about 2 to 3 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Mix in vanilla and salt until combined."
      },
      {
        "step_order": 4,
        "step_text": "Whisk flour and cornstarch together in a separate bowl."
      },
      {
        "step_order": 5,
        "step_text": "Add dry ingredients to butter mixture and mix on low just until dough comes together."
      },
      {
        "step_order": 6,
        "step_text": "Turn dough onto a lightly floured surface, press into a disk, and roll to about 1/2-inch thickness."
      },
      {
        "step_order": 7,
        "step_text": "Cut into rounds or fingers and place on baking sheet; chill 10 to 15 minutes if dough is soft."
      },
      {
        "step_order": 8,
        "step_text": "Bake 18 to 24 minutes until tops are set and edges are just turning light golden."
      },
      {
        "step_order": 9,
        "step_text": "Cool on pan 5 minutes, then transfer to a rack to cool completely."
      }
    ]
  },
  {
    "recipe_id": "SWEET_040",
    "food_word": "BUTTERMILKPIE",
    "recipe_name": "Buttermilk Pie",
    "category": "Sweets & Desserts",
    "dietary_category": "veggie",
    "link_type": "dish",
    "prep_time": "25 min",
    "servings": "8 slices",
    "sr28_rule": "Rule D",
    "sr28_notes": "No canonical USDA SR Legacy NDB exists for Buttermilk Pie. Nutrient values are computed from the ingredient build using USDA SR Legacy data for each ingredient and yield assumptions based on published cooking-yield ranges from USDA Agricultural Handbook 102.",
    "status": "published",
    "ingredients": [
      {
        "row_order": 0,
        "row_type": "dish",
        "ing_qty": "custom (g)",
        "portion_desc": "custom (g)",
        "portion_grams": 100.0,
        "serving_count": 1.0
      },
      {
        "row_order": 1,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 188.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 2,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "9 1/2 tablespoons, chilled",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 135.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 3,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/2 teaspoon + pinch",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 3.6,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 4,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1/2 teaspoon + pinch",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 2.5,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 5,
        "row_type": "ingredient",
        "ing_name": "ice water",
        "ing_qty": "4 tablespoons + 1 teaspoon",
        "sr28_long_desc": "Water, tap, drinking",
        "ndb_no": "14411",
        "portion_desc": "g",
        "portion_grams": 72.0,
        "serving_count": 1.0,
        "notes": "section=crust"
      },
      {
        "row_order": 6,
        "row_type": "ingredient",
        "ing_name": "sugar",
        "ing_qty": "1 1/2 cups",
        "sr28_long_desc": "Sugars, granulated",
        "ndb_no": "19335",
        "portion_desc": "g",
        "portion_grams": 300.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 7,
        "row_type": "ingredient",
        "ing_name": "unsalted butter",
        "ing_qty": "1/2 cup, melted",
        "sr28_long_desc": "Butter, without salt",
        "ndb_no": "1145",
        "portion_desc": "g",
        "portion_grams": 113.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 8,
        "row_type": "ingredient",
        "ing_name": "large egg",
        "ing_qty": "3 large eggs",
        "sr28_long_desc": "Egg, whole, raw, fresh",
        "ndb_no": "1123",
        "portion_desc": "g",
        "portion_grams": 150.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 9,
        "row_type": "ingredient",
        "ing_name": "whole buttermilk",
        "ing_qty": "1 cup",
        "sr28_long_desc": "Milk, buttermilk, fluid, whole",
        "ndb_no": "1230",
        "portion_desc": "g",
        "portion_grams": 244.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 10,
        "row_type": "ingredient",
        "ing_name": "all-purpose enriched white flour",
        "ing_qty": "3 tablespoons",
        "sr28_long_desc": "Wheat flour, white, all-purpose, enriched, bleached",
        "ndb_no": "20081",
        "portion_desc": "g",
        "portion_grams": 24.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 11,
        "row_type": "ingredient",
        "ing_name": "vanilla extract",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Vanilla extract",
        "ndb_no": "2050",
        "portion_desc": "g",
        "portion_grams": 4.2,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 12,
        "row_type": "ingredient",
        "ing_name": "salt",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Salt, table",
        "ndb_no": "2047",
        "portion_desc": "g",
        "portion_grams": 1.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 13,
        "row_type": "ingredient",
        "ing_name": "ground nutmeg",
        "ing_qty": "1/4 teaspoon",
        "sr28_long_desc": "Spices, nutmeg, ground",
        "ndb_no": "2025",
        "portion_desc": "g",
        "portion_grams": 0.5,
        "serving_count": 1.0,
        "notes": "section=filling"
      },
      {
        "row_order": 14,
        "row_type": "ingredient",
        "ing_name": "lemon zest",
        "ing_qty": "1 teaspoon",
        "sr28_long_desc": "Lemon peel, raw",
        "ndb_no": "9156",
        "portion_desc": "g",
        "portion_grams": 2.0,
        "serving_count": 1.0,
        "notes": "section=filling"
      }
    ],
    "instructions": [
      {
        "step_order": 1,
        "step_text": "For the crust, whisk the flour, salt, and sugar together. Cut in the cold butter until the mixture resembles coarse crumbs with some pea-sized pieces remaining."
      },
      {
        "step_order": 2,
        "step_text": "Sprinkle the ice water over the mixture and stir gently with a fork just until the dough comes together. Form into a disk, wrap, and refrigerate for at least 30 minutes."
      },
      {
        "step_order": 3,
        "step_text": "Roll the chilled dough out on a lightly floured surface to a 12-inch round and fit into a 9-inch pie plate. Trim, fold the edges under, and crimp. Refrigerate the shell for 15 minutes."
      },
      {
        "step_order": 4,
        "step_text": "Preheat the oven to 400 degrees F (205 degrees C). Line the chilled shell with parchment and fill with pie weights. Blind-bake for 12 minutes, then remove the weights and parchment and bake another 5 to 7 minutes until the bottom looks dry but not yet browned. Remove and reduce the oven to 325 degrees F (165 degrees C)."
      },
      {
        "step_order": 5,
        "step_text": "For the filling, whisk the flour, sugar, and salt together in a large bowl. Add the eggs and whisk until smooth and pale."
      },
      {
        "step_order": 6,
        "step_text": "Whisk in the melted and slightly cooled butter, then the buttermilk, vanilla, and lemon zest, until completely combined and the filling is uniform."
      },
      {
        "step_order": 7,
        "step_text": "Pour the filling into the par-baked crust through a fine-mesh strainer to remove any lumps."
      },
      {
        "step_order": 8,
        "step_text": "Grate a light dusting of nutmeg over the surface."
      },
      {
        "step_order": 9,
        "step_text": "Bake at 325 degrees F (165 degrees C) for 45 to 55 minutes until the edges are puffed and set and the center jiggles only slightly when the pan is gently nudged. Tent the crust edges with foil if they brown too quickly."
      },
      {
        "step_order": 10,
        "step_text": "Cool completely on a wire rack for at least 2 hours before slicing. Serve at room temperature or chilled."
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
