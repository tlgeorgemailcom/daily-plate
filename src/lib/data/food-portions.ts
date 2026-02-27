// Auto-generated from food-portions-complete.csv
// DO NOT EDIT - regenerate with convert_to_ts.py

export type FoodGroup = 
  | 'vegetable' | 'fruit' | 'grain' | 'protein' | 'dairy'
  | 'legume' | 'nuts' | 'fats' | 'spice' | 'prepared' | 'condiment' | 'beverage'
  | 'wine' | 'bar';

export interface Portion {
  amt: number;      // Amount (e.g., 1, 0.5, 2)
  desc: string;     // Description (e.g., "cup, sliced" or "custom (g)")
  gm: number;       // Weight in grams
}

export interface Food {
  word: string;
  display: string;  // Readable name (e.g., "Chicken Wing")
  groups: FoodGroup[];
  ndb: string;       // USDA NDB number (primary key)
  desc: string;      // USDA LONG_DESC
  // Nutrients per 100g
  cal: number;      // Calories (Energy_KCal)
  pro: number;      // Protein (g)
  fat: number;      // Total Fat (g)
  carb: number;     // Carbohydrates (g)
  fib: number;      // Fiber (g)
  h2o: number;      // Water (g)
  sug: number;      // Total Sugar (g)
  portions: Portion[];  // [0] is always custom (100g base)
}

export interface NutrientValues {
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  water: number;
  sugar: number;
}

export const FOODS: Food[] = [
  {
    "word": "ALMONDMILK",
    "display": "Almond Milk",
    "groups": [
      "beverage"
    ],
    "ndb": "14016",
    "desc": "Beverages, almond milk, sweetened, vanilla flavor, ready-to-drink",
    "cal": 38.0,
    "pro": 0.4,
    "fat": 1.0,
    "carb": 6.6,
    "fib": 0.4,
    "h2o": 91.8,
    "sug": 6.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 8.0,
        "desc": "fl oz",
        "gm": 240.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "ALOEVERAJUICE",
    "display": "Aloe Vera Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "14216",
    "desc": "Beverages, aloe vera juice drink, fortified with Vitamin C",
    "cal": 15.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 3.8,
    "fib": 0.0,
    "h2o": 96.2,
    "sug": 3.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 8.0,
        "desc": "fl oz",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "APPLEJUICE",
    "display": "Apple Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9016",
    "desc": "Apple juice, canned or bottled, unsweetened, without added ascorbic acid",
    "cal": 46.0,
    "pro": 0.1,
    "fat": 0.1,
    "carb": 11.3,
    "fib": 0.2,
    "h2o": 88.2,
    "sug": 9.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 248.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.0
      },
      {
        "amt": 1.0,
        "desc": "drink box (8.45 fl oz)",
        "gm": 262.0
      }
    ]
  },
  {
    "word": "BEER",
    "display": "Beer",
    "groups": [
      "beverage"
    ],
    "ndb": "14003",
    "desc": "Alcoholic beverage, beer, regular, all",
    "cal": 43.0,
    "pro": 0.5,
    "fat": 0.0,
    "carb": 3.5,
    "fib": 0.0,
    "h2o": 92.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.7
      },
      {
        "amt": 1.0,
        "desc": "can",
        "gm": 356.0
      }
    ]
  },
  {
    "word": "CARBONATED",
    "display": "Carbonated",
    "groups": [
      "beverage"
    ],
    "ndb": "14121",
    "desc": "Beverages, Carbonated beverage, club soda",
    "cal": 0.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 99.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.6
      },
      {
        "amt": 1.0,
        "desc": "can or bottle (16 fl oz)",
        "gm": 474.0
      },
      {
        "amt": 1.0,
        "desc": "can or bottle (12 fl oz)",
        "gm": 355.0
      }
    ]
  },
  {
    "word": "CAROBMILK",
    "display": "Carob Milk",
    "groups": [
      "beverage"
    ],
    "ndb": "14169",
    "desc": "Beverages, Carob-flavor beverage mix, powder, prepared with whole milk",
    "cal": 75.0,
    "pro": 3.2,
    "fat": 3.1,
    "carb": 8.7,
    "fib": 0.4,
    "h2o": 84.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 256.0
      }
    ]
  },
  {
    "word": "CARROTJUICE",
    "display": "Carrot Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "11655",
    "desc": "Carrot juice, canned",
    "cal": 40.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 9.3,
    "fib": 0.8,
    "h2o": 88.9,
    "sug": 3.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 236.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.5
      }
    ]
  },
  {
    "word": "CHOCOLATEMILK",
    "display": "Chocolate Milk",
    "groups": [
      "beverage"
    ],
    "ndb": "14177",
    "desc": "Beverages, Chocolate-flavor beverage mix, powder, prepared with whole milk",
    "cal": 85.0,
    "pro": 3.2,
    "fat": 3.2,
    "carb": 11.9,
    "fib": 0.4,
    "h2o": 80.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 266.0
      }
    ]
  },
  {
    "word": "COCONUTMILK",
    "display": "Coconut Milk",
    "groups": [
      "beverage"
    ],
    "ndb": "12117",
    "desc": "Nuts, coconut milk, raw (liquid expressed from grated meat and water)",
    "cal": 230.0,
    "pro": 2.3,
    "fat": 23.8,
    "carb": 5.5,
    "fib": 2.2,
    "h2o": 67.6,
    "sug": 3.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "COFFEE",
    "display": "Coffee",
    "groups": [
      "beverage"
    ],
    "ndb": "14209",
    "desc": "Coffee, brewed, prepared with tap water",
    "cal": 1.0,
    "pro": 0.1,
    "fat": 0.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 99.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.6
      },
      {
        "amt": 6.0,
        "desc": "fl oz",
        "gm": 178.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 237.0
      }
    ]
  },
  {
    "word": "COLA",
    "display": "Cola",
    "groups": [
      "beverage"
    ],
    "ndb": "14148",
    "desc": "Beverages, carbonated, cola, regular",
    "cal": 42.0,
    "pro": 0.0,
    "fat": 0.2,
    "carb": 10.4,
    "fib": 0.0,
    "h2o": 89.4,
    "sug": 9.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.7
      },
      {
        "amt": 1.0,
        "desc": "can or bottle (12 fl oz)",
        "gm": 370.0
      },
      {
        "amt": 1.0,
        "desc": "can or bottle (16 fl oz)",
        "gm": 492.0
      },
      {
        "amt": 1.0,
        "desc": "drink, small (16 fl oz)",
        "gm": 492.0
      },
      {
        "amt": 1.0,
        "desc": "drink, medium (22 fl oz)",
        "gm": 676.0
      },
      {
        "amt": 1.0,
        "desc": "drink, large (32 fl oz)",
        "gm": 984.0
      },
      {
        "amt": 1.0,
        "desc": "drink, extra large (44 fl oz)",
        "gm": 1353.0
      }
    ]
  },
  {
    "word": "CRANBERRYJUICE",
    "display": "Cranberry Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "14284",
    "desc": "Beverages, Cranberry juice cocktail",
    "cal": 52.0,
    "pro": 0.0,
    "fat": 0.3,
    "carb": 12.2,
    "fib": 0.0,
    "h2o": 87.4,
    "sug": 11.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 271.0
      }
    ]
  },
  {
    "word": "EGGNOG",
    "display": "Eggnog",
    "groups": [
      "beverage"
    ],
    "ndb": "1057",
    "desc": "Eggnog",
    "cal": 88.0,
    "pro": 4.5,
    "fat": 4.2,
    "carb": 8.1,
    "fib": 0.0,
    "h2o": 82.5,
    "sug": 8.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 254.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.8
      },
      {
        "amt": 1.0,
        "desc": "quart",
        "gm": 1016.0
      }
    ]
  },
  {
    "word": "GRAPEFRUITJUICE",
    "display": "Grapefruit Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9123",
    "desc": "Grapefruit juice, white, canned or bottled, unsweetened",
    "cal": 34.0,
    "pro": 0.6,
    "fat": 0.1,
    "carb": 7.9,
    "fib": 0.8,
    "h2o": 91.2,
    "sug": 7.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 247.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.9
      }
    ]
  },
  {
    "word": "GRAPEJUICE",
    "display": "Grape Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9135",
    "desc": "Grape juice, canned or bottled, unsweetened, without added ascorbic acid",
    "cal": 60.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 14.8,
    "fib": 0.2,
    "h2o": 84.5,
    "sug": 14.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 253.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.6
      }
    ]
  },
  {
    "word": "LEMONADE",
    "display": "Lemonade",
    "groups": [
      "beverage"
    ],
    "ndb": "14095",
    "desc": "Beverages, MINUTE MAID, Lemonada, Limeade",
    "cal": 50.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 13.8,
    "fib": 0.0,
    "h2o": 86.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 8.0,
        "desc": "fl oz",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "LIMEADE",
    "display": "Limeade",
    "groups": [
      "beverage"
    ],
    "ndb": "14303",
    "desc": "Limeade, frozen concentrate, prepared with water",
    "cal": 52.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 13.8,
    "fib": 0.0,
    "h2o": 86.1,
    "sug": 13.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.9
      },
      {
        "amt": 1.0,
        "desc": "cup 8 fl oz",
        "gm": 247.0
      }
    ]
  },
  {
    "word": "MALTED",
    "display": "Malted",
    "groups": [
      "beverage"
    ],
    "ndb": "14317",
    "desc": "Malted drink mix, chocolate, powder",
    "cal": 411.0,
    "pro": 5.1,
    "fat": 4.8,
    "carb": 86.9,
    "fib": 4.8,
    "h2o": 1.3,
    "sug": 66.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving (3 heaping tsp or 1 envelope)",
        "gm": 21.0
      }
    ]
  },
  {
    "word": "ORANGEJUICE",
    "display": "Orange Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9207",
    "desc": "Orange juice, canned, unsweetened",
    "cal": 47.0,
    "pro": 0.7,
    "fat": 0.1,
    "carb": 11.0,
    "fib": 0.3,
    "h2o": 87.7,
    "sug": 8.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 249.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.1
      },
      {
        "amt": 1.0,
        "desc": "drink box (8.45 fl oz)",
        "gm": 263.0
      }
    ]
  },
  {
    "word": "PEACHNECTAR",
    "display": "Peach Nectar",
    "groups": [
      "beverage"
    ],
    "ndb": "9251",
    "desc": "Peach nectar, canned, without added ascorbic acid",
    "cal": 54.0,
    "pro": 0.3,
    "fat": 0.0,
    "carb": 13.9,
    "fib": 0.6,
    "h2o": 85.6,
    "sug": 13.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 249.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.1
      }
    ]
  },
  {
    "word": "PEARNECTAR",
    "display": "Pear Nectar",
    "groups": [
      "beverage"
    ],
    "ndb": "9262",
    "desc": "Pear nectar, canned, without added ascorbic acid",
    "cal": 60.0,
    "pro": 0.1,
    "fat": 0.0,
    "carb": 15.8,
    "fib": 0.6,
    "h2o": 84.0,
    "sug": 15.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 250.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.2
      }
    ]
  },
  {
    "word": "PINEAPPLEJUICE",
    "display": "Pineapple Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9273",
    "desc": "Pineapple juice, canned or bottled, unsweetened, without added ascorbic acid",
    "cal": 53.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 12.9,
    "fib": 0.2,
    "h2o": 86.4,
    "sug": 10.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 250.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.3
      }
    ]
  },
  {
    "word": "PRUNEJUICE",
    "display": "Prune Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9294",
    "desc": "Prune juice, canned",
    "cal": 71.0,
    "pro": 0.6,
    "fat": 0.0,
    "carb": 17.4,
    "fib": 1.0,
    "h2o": 81.2,
    "sug": 16.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 256.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 32.0
      }
    ]
  },
  {
    "word": "PUNCH",
    "display": "Punch",
    "groups": [
      "beverage"
    ],
    "ndb": "14276",
    "desc": "Beverages, Tropical Punch, ready-to-drink",
    "cal": 10.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 2.5,
    "fib": 0.0,
    "h2o": 97.5,
    "sug": 2.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA Serving",
        "gm": 210.0
      },
      {
        "amt": 200.0,
        "desc": "ml",
        "gm": 200.0
      }
    ]
  },
  {
    "word": "SHEEPMILK",
    "display": "Sheep Milk",
    "groups": [
      "beverage"
    ],
    "ndb": "1109",
    "desc": "Milk, sheep, fluid",
    "cal": 108.0,
    "pro": 6.0,
    "fat": 7.0,
    "carb": 5.4,
    "fib": 0.0,
    "h2o": 80.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      },
      {
        "amt": 1.0,
        "desc": "quart",
        "gm": 980.0
      }
    ]
  },
  {
    "word": "SMOOTHIE",
    "display": "Smoothie",
    "groups": [
      "beverage"
    ],
    "ndb": "9531",
    "desc": "Fruit juice smoothie, NAKED JUICE, strawberry banana",
    "cal": 50.0,
    "pro": 0.5,
    "fat": 0.3,
    "carb": 11.7,
    "fib": 0.6,
    "h2o": 87.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 228.0
      }
    ]
  },
  {
    "word": "TANGERINEJUICE",
    "display": "Tangerine Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "9221",
    "desc": "Tangerine juice, raw",
    "cal": 43.0,
    "pro": 0.5,
    "fat": 0.2,
    "carb": 10.1,
    "fib": 0.2,
    "h2o": 88.9,
    "sug": 9.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 247.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.9
      }
    ]
  },
  {
    "word": "TEA",
    "display": "Tea",
    "groups": [
      "beverage"
    ],
    "ndb": "14355",
    "desc": "Beverages, tea, black, brewed, prepared with tap water",
    "cal": 1.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.3,
    "fib": 0.0,
    "h2o": 99.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.6
      },
      {
        "amt": 6.0,
        "desc": "fl oz",
        "gm": 178.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 237.0
      }
    ]
  },
  {
    "word": "VEGETABLEJUICE",
    "display": "Vegetable Juice",
    "groups": [
      "beverage"
    ],
    "ndb": "11578",
    "desc": "Vegetable juice cocktail, canned",
    "cal": 22.0,
    "pro": 0.9,
    "fat": 0.3,
    "carb": 3.9,
    "fib": 0.5,
    "h2o": 94.1,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 253.0
      },
      {
        "amt": 6.0,
        "desc": "fl oz",
        "gm": 182.0
      }
    ]
  },
  {
    "word": "WATER",
    "display": "Water",
    "groups": [
      "beverage"
    ],
    "ndb": "14411",
    "desc": "Water, tap, drinking",
    "cal": 0.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 99.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.6
      },
      {
        "amt": 1.0,
        "desc": "serving 8 fl oz",
        "gm": 237.0
      },
      {
        "amt": 1.0,
        "desc": "liter",
        "gm": 1000.0
      }
    ]
  },
  {
    "word": "WHISKEY",
    "display": "Whiskey",
    "groups": [
      "beverage"
    ],
    "ndb": "14550",
    "desc": "Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 86 proof",
    "cal": 250.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.1,
    "fib": 0.0,
    "h2o": 63.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 27.8
      },
      {
        "amt": 1.0,
        "desc": "Jigger 1.5 fl oz",
        "gm": 42.0
      }
    ]
  },
  {
    "word": "WINE",
    "display": "Wine",
    "groups": [
      "beverage"
    ],
    "ndb": "14106",
    "desc": "Alcoholic beverage, wine, table, white",
    "cal": 82.0,
    "pro": 0.1,
    "fat": 0.0,
    "carb": 2.6,
    "fib": 0.0,
    "h2o": 86.9,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.4
      },
      {
        "amt": 1.0,
        "desc": "serving (5 fl oz)",
        "gm": 147.0
      }
    ]
  },
  {
    "word": "AMERICAN",
    "display": "American Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1061",
    "desc": "Cheese, American, nonfat or fat free",
    "cal": 126.0,
    "pro": 21.1,
    "fat": 0.0,
    "carb": 10.5,
    "fib": 0.0,
    "h2o": 65.5,
    "sug": 5.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "ASIAGO",
    "display": "Asiago",
    "groups": [
      "dairy"
    ],
    "ndb": "28234",
    "desc": "SUNSHINE, CHEEZ-IT, Asiago Crackers",
    "cal": 502.0,
    "pro": 8.7,
    "fat": 24.7,
    "carb": 62.6,
    "fib": 2.1,
    "h2o": 2.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 25.0,
        "desc": "crackers",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "BLUECHEESE",
    "display": "Blue Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1004",
    "desc": "Cheese, blue",
    "cal": 353.0,
    "pro": 21.4,
    "fat": 28.7,
    "carb": 2.3,
    "fib": 0.0,
    "h2o": 42.4,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crumbled, not packed",
        "gm": 135.0
      }
    ]
  },
  {
    "word": "BREADCHEESE",
    "display": "Bread Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "18972",
    "desc": "Bread, cheese",
    "cal": 408.0,
    "pro": 10.4,
    "fat": 20.8,
    "carb": 44.8,
    "fib": 2.1,
    "h2o": 21.1,
    "sug": 2.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 48.0
      }
    ]
  },
  {
    "word": "BRICKCHEESE",
    "display": "Brick Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1005",
    "desc": "Cheese, brick",
    "cal": 371.0,
    "pro": 23.2,
    "fat": 29.7,
    "carb": 2.8,
    "fib": 0.0,
    "h2o": 41.1,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "BRIECHEESE",
    "display": "Brie Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1006",
    "desc": "Cheese, brie",
    "cal": 334.0,
    "pro": 20.8,
    "fat": 27.7,
    "carb": 0.5,
    "fib": 0.0,
    "h2o": 48.4,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 144.0
      },
      {
        "amt": 1.0,
        "desc": "cup, melted",
        "gm": 240.0
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "package (4.5 oz)",
        "gm": 128.0
      }
    ]
  },
  {
    "word": "BUTTERMILK",
    "display": "Buttermilk",
    "groups": [
      "dairy",
      "beverage"
    ],
    "ndb": "1230",
    "desc": "Milk, buttermilk, fluid, whole",
    "cal": 62.0,
    "pro": 3.2,
    "fat": 3.3,
    "carb": 4.9,
    "fib": 0.0,
    "h2o": 87.9,
    "sug": 4.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "BUTTERSALTED",
    "display": "Butter Salted",
    "groups": [
      "dairy",
      "fats"
    ],
    "ndb": "1001",
    "desc": "Butter, salted",
    "cal": 717.0,
    "pro": 0.8,
    "fat": 81.1,
    "carb": 0.1,
    "fib": 0.0,
    "h2o": 15.9,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pat (1\" sq, 1/3\" high)",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 227.0
      },
      {
        "amt": 1.0,
        "desc": "stick",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "BUTTERUNSALTED",
    "display": "Butter Unsalted",
    "groups": [
      "dairy"
    ],
    "ndb": "1145",
    "desc": "Butter, without salt",
    "cal": 717.0,
    "pro": 0.8,
    "fat": 81.1,
    "carb": 0.1,
    "fib": 0.0,
    "h2o": 17.9,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pat (1\" sq, 1/3\" high)",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 227.0
      },
      {
        "amt": 1.0,
        "desc": "stick",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "CAMEMBERT",
    "display": "Camembert",
    "groups": [
      "dairy"
    ],
    "ndb": "1007",
    "desc": "Cheese, camembert",
    "cal": 300.0,
    "pro": 19.8,
    "fat": 24.3,
    "carb": 0.5,
    "fib": 0.0,
    "h2o": 51.8,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 246.0
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "wedge (1.33 oz)",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "CARAWAYCHEESE",
    "display": "Caraway Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1008",
    "desc": "Cheese, caraway",
    "cal": 376.0,
    "pro": 25.2,
    "fat": 29.2,
    "carb": 3.1,
    "fib": 0.0,
    "h2o": 39.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CASEIN",
    "display": "Casein",
    "groups": [
      "dairy"
    ],
    "ndb": "1068",
    "desc": "Cream substitute, liquid, with lauric acid oil and sodium caseinate",
    "cal": 136.0,
    "pro": 1.0,
    "fat": 10.0,
    "carb": 11.4,
    "fib": 0.0,
    "h2o": 77.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "container, individual",
        "gm": 15.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 120.0
      }
    ]
  },
  {
    "word": "CHEDDAR",
    "display": "Cheddar",
    "groups": [
      "dairy"
    ],
    "ndb": "1009",
    "desc": "Cheese, cheddar",
    "cal": 404.0,
    "pro": 22.9,
    "fat": 33.3,
    "carb": 3.1,
    "fib": 0.0,
    "h2o": 37.0,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, melted",
        "gm": 244.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "CHESHIRE",
    "display": "Cheshire",
    "groups": [
      "dairy"
    ],
    "ndb": "1010",
    "desc": "Cheese, cheshire",
    "cal": 387.0,
    "pro": 23.4,
    "fat": 30.6,
    "carb": 4.8,
    "fib": 0.0,
    "h2o": 37.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "COLBY",
    "display": "Colby",
    "groups": [
      "dairy"
    ],
    "ndb": "1011",
    "desc": "Cheese, colby",
    "cal": 394.0,
    "pro": 23.8,
    "fat": 32.1,
    "carb": 2.6,
    "fib": 0.0,
    "h2o": 38.2,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "COTTAGE",
    "display": "Cottage",
    "groups": [
      "dairy"
    ],
    "ndb": "1012",
    "desc": "Cheese, cottage, creamed, large or small curd",
    "cal": 98.0,
    "pro": 11.1,
    "fat": 4.3,
    "carb": 3.4,
    "fib": 0.0,
    "h2o": 79.8,
    "sug": 2.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 4.0,
        "desc": "oz",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "cup, large curd (not packed)",
        "gm": 210.0
      },
      {
        "amt": 1.0,
        "desc": "cup, small curd (not packed)",
        "gm": 225.0
      }
    ]
  },
  {
    "word": "CREAM",
    "display": "Cream",
    "groups": [
      "dairy"
    ],
    "ndb": "1053",
    "desc": "Cream, fluid, heavy whipping",
    "cal": 340.0,
    "pro": 2.8,
    "fat": 36.1,
    "carb": 2.7,
    "fib": 0.0,
    "h2o": 57.8,
    "sug": 2.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whipped",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "cup, fluid (yields 2 cups whipped)",
        "gm": 238.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.8
      }
    ]
  },
  {
    "word": "CREAMCHEESE",
    "display": "Cream Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1017",
    "desc": "Cheese, cream",
    "cal": 350.0,
    "pro": 6.2,
    "fat": 34.4,
    "carb": 5.5,
    "fib": 0.0,
    "h2o": 52.6,
    "sug": 3.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 232.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp, whipped",
        "gm": 10.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "package, small (3 oz)",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "DRYWHITECHEESE",
    "display": "Dry White Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1227",
    "desc": "Cheese, dry white, queso seco",
    "cal": 325.0,
    "pro": 24.5,
    "fat": 24.4,
    "carb": 2.0,
    "fib": 0.0,
    "h2o": 42.2,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup grated",
        "gm": 97.0
      }
    ]
  },
  {
    "word": "EDAM",
    "display": "Edam",
    "groups": [
      "dairy"
    ],
    "ndb": "1018",
    "desc": "Cheese, edam",
    "cal": 357.0,
    "pro": 25.0,
    "fat": 27.8,
    "carb": 1.4,
    "fib": 0.0,
    "h2o": 41.6,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (7 oz)",
        "gm": 198.0
      }
    ]
  },
  {
    "word": "FETA",
    "display": "Feta",
    "groups": [
      "dairy"
    ],
    "ndb": "1019",
    "desc": "Cheese, feta",
    "cal": 264.0,
    "pro": 14.2,
    "fat": 21.3,
    "carb": 4.1,
    "fib": 0.0,
    "h2o": 55.2,
    "sug": 4.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crumbled",
        "gm": 150.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "wedge (1.33 oz)",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "FONTINA",
    "display": "Fontina",
    "groups": [
      "dairy"
    ],
    "ndb": "1020",
    "desc": "Cheese, fontina",
    "cal": 389.0,
    "pro": 25.6,
    "fat": 31.1,
    "carb": 1.6,
    "fib": 0.0,
    "h2o": 37.9,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 108.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "package (8 oz)",
        "gm": 227.0
      }
    ]
  },
  {
    "word": "GHEE",
    "display": "Ghee",
    "groups": [
      "dairy",
      "fats"
    ],
    "ndb": "1003",
    "desc": "Butter oil, anhydrous",
    "cal": 876.0,
    "pro": 0.3,
    "fat": 99.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "GJETOST",
    "display": "Gjetost",
    "groups": [
      "dairy"
    ],
    "ndb": "1021",
    "desc": "Cheese, gjetost",
    "cal": 466.0,
    "pro": 9.7,
    "fat": 29.5,
    "carb": 42.6,
    "fib": 0.0,
    "h2o": 13.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (8 oz)",
        "gm": 227.0
      }
    ]
  },
  {
    "word": "GOATCHEESE",
    "display": "Goat Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1159",
    "desc": "Cheese, goat, soft type",
    "cal": 264.0,
    "pro": 18.5,
    "fat": 21.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 60.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "GOATMILK",
    "display": "Goat Milk",
    "groups": [
      "dairy",
      "beverage"
    ],
    "ndb": "1106",
    "desc": "Milk, goat, fluid, with added vitamin D",
    "cal": 69.0,
    "pro": 3.6,
    "fat": 4.1,
    "carb": 4.5,
    "fib": 0.0,
    "h2o": 87.0,
    "sug": 4.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 244.0
      },
      {
        "amt": 1.0,
        "desc": "quart",
        "gm": 976.0
      }
    ]
  },
  {
    "word": "GORGONZOLA",
    "display": "Gorgonzola",
    "groups": [
      "dairy"
    ],
    "ndb": "1004",
    "desc": "Cheese, blue",
    "cal": 353.0,
    "pro": 21.4,
    "fat": 28.7,
    "carb": 2.3,
    "fib": 0.0,
    "h2o": 42.4,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crumbled, not packed",
        "gm": 135.0
      }
    ]
  },
  {
    "word": "GOUDA",
    "display": "Gouda",
    "groups": [
      "dairy"
    ],
    "ndb": "1022",
    "desc": "Cheese, gouda",
    "cal": 356.0,
    "pro": 24.9,
    "fat": 27.4,
    "carb": 2.2,
    "fib": 0.0,
    "h2o": 41.5,
    "sug": 2.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (7 oz)",
        "gm": 198.0
      }
    ]
  },
  {
    "word": "GRUYERE",
    "display": "Gruyere",
    "groups": [
      "dairy"
    ],
    "ndb": "1023",
    "desc": "Cheese, gruyere",
    "cal": 413.0,
    "pro": 29.8,
    "fat": 32.3,
    "carb": 0.4,
    "fib": 0.0,
    "h2o": 33.2,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 108.0
      },
      {
        "amt": 1.0,
        "desc": "package (6 oz)",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "HALFANDHALF",
    "display": "Half and Half",
    "groups": [
      "dairy",
      "beverage"
    ],
    "ndb": "1049",
    "desc": "Cream, fluid, half and half",
    "cal": 123.0,
    "pro": 3.1,
    "fat": 10.4,
    "carb": 4.7,
    "fib": 0.0,
    "h2o": 81.2,
    "sug": 4.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.2
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 242.0
      },
      {
        "amt": 1.0,
        "desc": "container, individual (.5 fl oz)",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "ICECREAM",
    "display": "Ice Cream",
    "groups": [
      "dairy",
      "prepared"
    ],
    "ndb": "19095",
    "desc": "Ice creams, vanilla",
    "cal": 207.0,
    "pro": 3.5,
    "fat": 11.0,
    "carb": 23.6,
    "fib": 0.7,
    "h2o": 61.0,
    "sug": 21.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1/2 cup",
        "gm": 66.0
      }
    ]
  },
  {
    "word": "ICECREAMCHOC",
    "display": "Ice Cream Chocolate",
    "groups": [
      "dairy",
      "prepared"
    ],
    "ndb": "19270",
    "desc": "Ice creams, chocolate",
    "cal": 216.0,
    "pro": 3.8,
    "fat": 11.0,
    "carb": 28.2,
    "fib": 1.2,
    "h2o": 55.7,
    "sug": 25.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "individual (3.5 fl oz)",
        "gm": 58.0
      },
      {
        "amt": 0.5,
        "desc": "cup (4 fl oz)",
        "gm": 66.0
      }
    ]
  },
  {
    "word": "ICECREAMSTRAW",
    "display": "Ice Cream Strawberry",
    "groups": [
      "dairy",
      "prepared"
    ],
    "ndb": "19271",
    "desc": "Ice creams, strawberry",
    "cal": 192.0,
    "pro": 3.2,
    "fat": 8.4,
    "carb": 27.6,
    "fib": 0.9,
    "h2o": 60.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "individual (3.5 fl oz)",
        "gm": 58.0
      },
      {
        "amt": 0.5,
        "desc": "cup (4 fl oz)",
        "gm": 66.0
      }
    ]
  },
  {
    "word": "KEFIR",
    "display": "Kefir",
    "groups": [
      "dairy"
    ],
    "ndb": "1289",
    "desc": "Kefir, lowfat, plain, LIFEWAY",
    "cal": 41.0,
    "pro": 3.8,
    "fat": 0.9,
    "carb": 4.5,
    "fib": 0.0,
    "h2o": 90.1,
    "sug": 4.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "MEXICANBLEND",
    "display": "Mexican Blend Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1251",
    "desc": "Cheese, Mexican blend",
    "cal": 358.0,
    "pro": 23.5,
    "fat": 28.5,
    "carb": 1.8,
    "fib": 0.0,
    "h2o": 42.5,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.25,
        "desc": "cup shredded",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "MILK",
    "display": "Milk",
    "groups": [
      "dairy",
      "beverage"
    ],
    "ndb": "1077",
    "desc": "Milk, whole, 3.25% milkfat, with added vitamin D",
    "cal": 61.0,
    "pro": 3.1,
    "fat": 3.2,
    "carb": 4.8,
    "fib": 0.0,
    "h2o": 88.1,
    "sug": 5.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 244.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.5
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "quart",
        "gm": 976.0
      }
    ]
  },
  {
    "word": "MILKCONDENSED",
    "display": "Milk Condensed",
    "groups": [
      "dairy"
    ],
    "ndb": "1095",
    "desc": "Milk, canned, condensed, sweetened",
    "cal": 321.0,
    "pro": 7.9,
    "fat": 8.7,
    "carb": 54.4,
    "fib": 0.0,
    "h2o": 27.2,
    "sug": 54.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 38.2
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 306.0
      }
    ]
  },
  {
    "word": "MILKEVAPORATED",
    "display": "Milk Evaporated",
    "groups": [
      "dairy"
    ],
    "ndb": "1214",
    "desc": "Milk, canned, evaporated, without added vitamin A and vitamin D",
    "cal": 135.0,
    "pro": 6.8,
    "fat": 7.6,
    "carb": 10.0,
    "fib": 0.0,
    "h2o": 74.0,
    "sug": 10.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 252.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.5
      },
      {
        "amt": 1.0,
        "desc": "can (13 oz)",
        "gm": 369.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 126.0
      }
    ]
  },
  {
    "word": "MONTEREY",
    "display": "Monterey",
    "groups": [
      "dairy"
    ],
    "ndb": "1025",
    "desc": "Cheese, monterey",
    "cal": 373.0,
    "pro": 24.5,
    "fat": 30.3,
    "carb": 0.7,
    "fib": 0.0,
    "h2o": 41.0,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "package (6 oz)",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "MOZZARELLA",
    "display": "Mozzarella",
    "groups": [
      "dairy"
    ],
    "ndb": "1026",
    "desc": "Cheese, mozzarella, whole milk",
    "cal": 300.0,
    "pro": 22.2,
    "fat": 22.4,
    "carb": 2.2,
    "fib": 0.0,
    "h2o": 50.0,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 112.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 6.0,
        "desc": "slices",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "MUENSTER",
    "display": "Muenster",
    "groups": [
      "dairy"
    ],
    "ndb": "1030",
    "desc": "Cheese, muenster",
    "cal": 368.0,
    "pro": 23.4,
    "fat": 30.0,
    "carb": 1.1,
    "fib": 0.0,
    "h2o": 41.8,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 18.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "package (6 oz)",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "NEUFCHATEL",
    "display": "Neufchatel",
    "groups": [
      "dairy"
    ],
    "ndb": "1031",
    "desc": "Cheese, neufchatel",
    "cal": 253.0,
    "pro": 9.2,
    "fat": 22.8,
    "carb": 3.6,
    "fib": 0.0,
    "h2o": 63.1,
    "sug": 3.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (3 oz)",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PARMESAN",
    "display": "Parmesan",
    "groups": [
      "dairy"
    ],
    "ndb": "1033",
    "desc": "Cheese, parmesan, hard",
    "cal": 392.0,
    "pro": 35.8,
    "fat": 25.8,
    "carb": 3.2,
    "fib": 0.0,
    "h2o": 29.2,
    "sug": 0.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 10.3
      },
      {
        "amt": 5.0,
        "desc": "package (5 oz)",
        "gm": 142.0
      }
    ]
  },
  {
    "word": "PORTDESALUT",
    "display": "Port de Salut",
    "groups": [
      "dairy"
    ],
    "ndb": "1034",
    "desc": "Cheese, port de salut",
    "cal": 352.0,
    "pro": 23.8,
    "fat": 28.2,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 45.5,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "package (6 oz)",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "PROVOLONE",
    "display": "Provolone",
    "groups": [
      "dairy"
    ],
    "ndb": "1035",
    "desc": "Cheese, provolone",
    "cal": 351.0,
    "pro": 25.6,
    "fat": 26.6,
    "carb": 2.1,
    "fib": 0.0,
    "h2o": 41.0,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "package (6 oz)",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "QUESOANEJO",
    "display": "Queso Anejo",
    "groups": [
      "dairy"
    ],
    "ndb": "1165",
    "desc": "Cheese, mexican, queso anejo",
    "cal": 373.0,
    "pro": 21.4,
    "fat": 30.0,
    "carb": 4.6,
    "fib": 0.0,
    "h2o": 38.1,
    "sug": 4.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crumbled",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "QUESOASADERO",
    "display": "Queso Asadero",
    "groups": [
      "dairy"
    ],
    "ndb": "1166",
    "desc": "Cheese, mexican, queso asadero",
    "cal": 356.0,
    "pro": 22.6,
    "fat": 28.3,
    "carb": 2.9,
    "fib": 0.0,
    "h2o": 42.2,
    "sug": 2.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 18.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "QUESOBLANCO",
    "display": "Queso Blanco",
    "groups": [
      "dairy"
    ],
    "ndb": "1229",
    "desc": "Cheese, white, queso blanco",
    "cal": 310.0,
    "pro": 20.4,
    "fat": 24.3,
    "carb": 2.5,
    "fib": 0.0,
    "h2o": 48.7,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crumbled",
        "gm": 118.0
      }
    ]
  },
  {
    "word": "QUESOCHIHUAHUA",
    "display": "Queso Chihuahua",
    "groups": [
      "dairy"
    ],
    "ndb": "1167",
    "desc": "Cheese, mexican, queso chihuahua",
    "cal": 374.0,
    "pro": 21.6,
    "fat": 29.7,
    "carb": 5.6,
    "fib": 0.0,
    "h2o": 39.1,
    "sug": 5.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "QUESOCOTIJA",
    "display": "Queso Cotija",
    "groups": [
      "dairy"
    ],
    "ndb": "1267",
    "desc": "Cheese, mexican, queso cotija",
    "cal": 366.0,
    "pro": 20.0,
    "fat": 30.0,
    "carb": 4.0,
    "fib": 0.0,
    "h2o": 38.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tsp",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "RICOTTA",
    "display": "Ricotta",
    "groups": [
      "dairy"
    ],
    "ndb": "1036",
    "desc": "Cheese, ricotta, whole milk",
    "cal": 174.0,
    "pro": 11.3,
    "fat": 13.0,
    "carb": 3.0,
    "fib": 0.0,
    "h2o": 71.7,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 124.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 246.0
      }
    ]
  },
  {
    "word": "ROMANO",
    "display": "Romano",
    "groups": [
      "dairy"
    ],
    "ndb": "1038",
    "desc": "Cheese, romano",
    "cal": 387.0,
    "pro": 31.8,
    "fat": 26.9,
    "carb": 3.6,
    "fib": 0.0,
    "h2o": 30.9,
    "sug": 0.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 5.0,
        "desc": "package (5 oz)",
        "gm": 142.0
      }
    ]
  },
  {
    "word": "ROQUEFORT",
    "display": "Roquefort",
    "groups": [
      "dairy"
    ],
    "ndb": "1039",
    "desc": "Cheese, roquefort",
    "cal": 369.0,
    "pro": 21.5,
    "fat": 30.6,
    "carb": 2.0,
    "fib": 0.0,
    "h2o": 39.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (3 oz)",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SHAKE",
    "display": "Shake",
    "groups": [
      "dairy",
      "beverage"
    ],
    "ndb": "14347",
    "desc": "Shake, fast food, vanilla",
    "cal": 148.0,
    "pro": 3.4,
    "fat": 6.5,
    "carb": 19.6,
    "fib": 0.9,
    "h2o": 69.7,
    "sug": 13.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 20.8
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 166.0
      },
      {
        "amt": 1.0,
        "desc": "milkshake (10 fl oz)",
        "gm": 208.0
      },
      {
        "amt": 1.0,
        "desc": "small McDonald's shake (12 fl oz)",
        "gm": 250.0
      },
      {
        "amt": 1.0,
        "desc": "medium McDonald's shake (16 fl oz)",
        "gm": 333.0
      },
      {
        "amt": 1.0,
        "desc": "large McDonald's shake (22 fl oz)",
        "gm": 458.0
      }
    ]
  },
  {
    "word": "SOURCREAM",
    "display": "Sour Cream",
    "groups": [
      "dairy"
    ],
    "ndb": "1178",
    "desc": "Sour cream, reduced fat",
    "cal": 181.0,
    "pro": 7.0,
    "fat": 14.1,
    "carb": 7.0,
    "fib": 0.0,
    "h2o": 71.0,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 12.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 230.0
      }
    ]
  },
  {
    "word": "STILTON",
    "display": "Stilton",
    "groups": [
      "dairy"
    ],
    "ndb": "1004",
    "desc": "Cheese, blue",
    "cal": 353.0,
    "pro": 21.4,
    "fat": 28.7,
    "carb": 2.3,
    "fib": 0.0,
    "h2o": 42.4,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crumbled, not packed",
        "gm": 135.0
      }
    ]
  },
  {
    "word": "SUNDAE",
    "display": "Sundae",
    "groups": [
      "dairy",
      "prepared"
    ],
    "ndb": "21032",
    "desc": "Fast foods, sundae, caramel",
    "cal": 196.0,
    "pro": 4.7,
    "fat": 6.0,
    "carb": 31.8,
    "fib": 0.0,
    "h2o": 56.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sundae",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "SWISSCHEESE",
    "display": "Swiss Cheese",
    "groups": [
      "dairy"
    ],
    "ndb": "1040",
    "desc": "Cheese, swiss",
    "cal": 393.0,
    "pro": 27.0,
    "fat": 31.0,
    "carb": 1.4,
    "fib": 0.0,
    "h2o": 37.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, melted",
        "gm": 244.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 108.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "TILSIT",
    "display": "Tilsit",
    "groups": [
      "dairy"
    ],
    "ndb": "1041",
    "desc": "Cheese, tilsit",
    "cal": 340.0,
    "pro": 24.4,
    "fat": 26.0,
    "carb": 1.9,
    "fib": 0.0,
    "h2o": 42.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (6 oz)",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "WHEY",
    "display": "Whey",
    "groups": [
      "dairy"
    ],
    "ndb": "1112",
    "desc": "Whey, acid, fluid",
    "cal": 24.0,
    "pro": 0.8,
    "fat": 0.1,
    "carb": 5.1,
    "fib": 0.0,
    "h2o": 93.4,
    "sug": 5.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 246.0
      },
      {
        "amt": 1.0,
        "desc": "quart",
        "gm": 984.0
      }
    ]
  },
  {
    "word": "WHIPPING",
    "display": "Whipping",
    "groups": [
      "dairy"
    ],
    "ndb": "1053",
    "desc": "Cream, fluid, heavy whipping",
    "cal": 340.0,
    "pro": 2.8,
    "fat": 36.1,
    "carb": 2.7,
    "fib": 0.0,
    "h2o": 57.8,
    "sug": 2.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whipped",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "cup, fluid (yields 2 cups whipped)",
        "gm": 238.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 29.8
      }
    ]
  },
  {
    "word": "YOGURT",
    "display": "Yogurt",
    "groups": [
      "dairy"
    ],
    "ndb": "1116",
    "desc": "Yogurt, plain, whole milk, 8 grams protein per 8 ounce",
    "cal": 61.0,
    "pro": 3.5,
    "fat": 3.2,
    "carb": 4.7,
    "fib": 0.0,
    "h2o": 87.9,
    "sug": 4.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "container (6 oz)",
        "gm": 170.0
      },
      {
        "amt": 1.0,
        "desc": "container (8 oz)",
        "gm": 227.0
      },
      {
        "amt": 0.5,
        "desc": "container (4 oz)",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "BABASSU",
    "display": "Babassu",
    "groups": [
      "fats"
    ],
    "ndb": "4534",
    "desc": "Oil, babassu",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "CANOLA",
    "display": "Canola",
    "groups": [
      "fats"
    ],
    "ndb": "4582",
    "desc": "Oil, canola",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "COCOABUTTER",
    "display": "Cocoa Butter",
    "groups": [
      "fats"
    ],
    "ndb": "4501",
    "desc": "Oil, cocoa butter",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "COTTONSEED",
    "display": "Cottonseed",
    "groups": [
      "fats"
    ],
    "ndb": "4502",
    "desc": "Oil, cottonseed, salad or cooking",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "FLAXSEEDOIL",
    "display": "Flaxseed Oil",
    "groups": [
      "fats"
    ],
    "ndb": "42231",
    "desc": "Oil, flaxseed, cold pressed",
    "cal": 884.0,
    "pro": 0.1,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      }
    ]
  },
  {
    "word": "GRAPESEEDOIL",
    "display": "Grapeseed Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4517",
    "desc": "Oil, grapeseed",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "HAZELNUTOIL",
    "display": "Hazelnut Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4532",
    "desc": "Oil, hazelnut",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "LARD",
    "display": "Lard",
    "groups": [
      "fats"
    ],
    "ndb": "4002",
    "desc": "Lard",
    "cal": 902.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "LECITHIN",
    "display": "Lecithin",
    "groups": [
      "fats"
    ],
    "ndb": "4531",
    "desc": "Oil, soybean lecithin",
    "cal": 763.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "MARGARINE",
    "display": "Margarine",
    "groups": [
      "fats"
    ],
    "ndb": "4073",
    "desc": "Margarine, regular, hard, soybean (hydrogenated)",
    "cal": 719.0,
    "pro": 0.9,
    "fat": 80.5,
    "carb": 0.9,
    "fib": 0.0,
    "h2o": 15.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.7
      },
      {
        "amt": 1.0,
        "desc": "stick",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "MENHADEN",
    "display": "Menhaden",
    "groups": [
      "fats"
    ],
    "ndb": "4591",
    "desc": "Fish oil, menhaden",
    "cal": 902.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      }
    ]
  },
  {
    "word": "OIL",
    "display": "Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4053",
    "desc": "Oil, olive, salad or cooking",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 216.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "OLIVEOIL",
    "display": "Oliveoil",
    "groups": [
      "fats"
    ],
    "ndb": "4053",
    "desc": "Oil, olive, salad or cooking",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 216.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "PALMOIL",
    "display": "Palm Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4055",
    "desc": "Oil, palm",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 216.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "PEANUTOIL",
    "display": "Peanut Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4042",
    "desc": "Oil, peanut, salad or cooking",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 216.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "SARDINEOIL",
    "display": "Sardine Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4594",
    "desc": "Fish oil, sardine",
    "cal": 902.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      }
    ]
  },
  {
    "word": "SHEANUT",
    "display": "Sheanut",
    "groups": [
      "fats"
    ],
    "ndb": "4536",
    "desc": "Oil, sheanut",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "SHORTENING",
    "display": "Shortening",
    "groups": [
      "fats"
    ],
    "ndb": "4031",
    "desc": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "SOYBEANOIL",
    "display": "Soy Bean Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4044",
    "desc": "Oil, soybean, salad or cooking",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "SOYLECITHIN",
    "display": "Soy Lecithin",
    "groups": [
      "fats"
    ],
    "ndb": "4531",
    "desc": "Oil, soybean lecithin",
    "cal": 763.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "SPRAYOIL",
    "display": "Spray Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4679",
    "desc": "Oil, PAM cooking spray, original",
    "cal": 792.0,
    "pro": 0.3,
    "fat": 78.7,
    "carb": 20.7,
    "fib": 0.0,
    "h2o": 0.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "spray , about 1/3 second (1 NLEA serving)",
        "gm": 0.3
      }
    ]
  },
  {
    "word": "TALLOW",
    "display": "Tallow",
    "groups": [
      "fats"
    ],
    "ndb": "4001",
    "desc": "Fat, beef tallow",
    "cal": 902.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "TEASEED",
    "display": "Teaseed",
    "groups": [
      "fats"
    ],
    "ndb": "4516",
    "desc": "Oil, teaseed",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "TOMATOSEEDOIL",
    "display": "Tomato Seed Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4515",
    "desc": "Oil, tomatoseed",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "UCUHUBAOIL",
    "display": "Ucuuba Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4573",
    "desc": "Oil, ucuhuba butter",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "VEGETABLEOIL",
    "display": "Vegetable Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4513",
    "desc": "Vegetable oil, palm kernel",
    "cal": 862.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp (1/8 cup)",
        "gm": 27.0
      }
    ]
  },
  {
    "word": "WALNUTOIL",
    "display": "Walnut Oil",
    "groups": [
      "fats"
    ],
    "ndb": "4528",
    "desc": "Oil, walnut",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "ACEROLA",
    "display": "Acerola",
    "groups": [
      "fruit"
    ],
    "ndb": "9001",
    "desc": "Acerola, (west indian cherry), raw",
    "cal": 32.0,
    "pro": 0.4,
    "fat": 0.3,
    "carb": 7.7,
    "fib": 1.1,
    "h2o": 91.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 98.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 4.8
      }
    ]
  },
  {
    "word": "APPLE",
    "display": "Apple",
    "groups": [
      "fruit"
    ],
    "ndb": "9003",
    "desc": "Apples, raw, with skin",
    "cal": 52.0,
    "pro": 0.3,
    "fat": 0.2,
    "carb": 13.8,
    "fib": 2.4,
    "h2o": 85.6,
    "sug": 10.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, quartered or chopped",
        "gm": 125.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 109.0
      },
      {
        "amt": 1.0,
        "desc": "large (3-1/4\" dia)",
        "gm": 223.0
      },
      {
        "amt": 1.0,
        "desc": "medium (3\" dia)",
        "gm": 182.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-3/4\" dia)",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "extra small (2-1/2\" dia)",
        "gm": 101.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 242.0
      }
    ]
  },
  {
    "word": "APRICOT",
    "display": "Apricot",
    "groups": [
      "fruit"
    ],
    "ndb": "9021",
    "desc": "Apricots, raw",
    "cal": 48.0,
    "pro": 1.4,
    "fat": 0.4,
    "carb": 11.1,
    "fib": 2.0,
    "h2o": 86.3,
    "sug": 9.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, halves",
        "gm": 155.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "apricot",
        "gm": 35.0
      }
    ]
  },
  {
    "word": "APRICOTJAM",
    "display": "Apricot Jam",
    "groups": [
      "fruit",
      "spice"
    ],
    "ndb": "19719",
    "desc": "Jams and preserves, apricot",
    "cal": 242.0,
    "pro": 0.7,
    "fat": 0.2,
    "carb": 64.4,
    "fib": 0.3,
    "h2o": 34.5,
    "sug": 43.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "packet (0.5 oz)",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "APRICOTOIL",
    "display": "Apricot Oil",
    "groups": [
      "fruit",
      "fats"
    ],
    "ndb": "4530",
    "desc": "Oil, apricot kernel",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "BALSAMPEAR",
    "display": "Balsam-Pear",
    "groups": [
      "fruit"
    ],
    "ndb": "11022",
    "desc": "Balsam-pear (bitter gourd), leafy tips, raw",
    "cal": 30.0,
    "pro": 5.3,
    "fat": 0.7,
    "carb": 3.3,
    "fib": 0.0,
    "h2o": 89.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 4.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 24.0
      }
    ]
  },
  {
    "word": "BANANA",
    "display": "Banana",
    "groups": [
      "fruit"
    ],
    "ndb": "9040",
    "desc": "Bananas, raw",
    "cal": 89.0,
    "pro": 1.1,
    "fat": 0.3,
    "carb": 22.8,
    "fib": 2.6,
    "h2o": 74.9,
    "sug": 12.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, mashed",
        "gm": 225.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 150.0
      },
      {
        "amt": 1.0,
        "desc": "extra small (less than 6\" long)",
        "gm": 81.0
      },
      {
        "amt": 1.0,
        "desc": "small (6\" to 6-7/8\" long)",
        "gm": 101.0
      },
      {
        "amt": 1.0,
        "desc": "medium (7\" to 7-7/8\" long)",
        "gm": 118.0
      },
      {
        "amt": 1.0,
        "desc": "large (8\" to 8-7/8\" long)",
        "gm": 136.0
      },
      {
        "amt": 1.0,
        "desc": "extra large (9\" or longer)",
        "gm": 152.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 126.0
      }
    ]
  },
  {
    "word": "BLACKBERRY",
    "display": "Blackberry",
    "groups": [
      "fruit"
    ],
    "ndb": "9042",
    "desc": "Blackberries, raw",
    "cal": 43.0,
    "pro": 1.4,
    "fat": 0.5,
    "carb": 9.6,
    "fib": 5.3,
    "h2o": 88.2,
    "sug": 4.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 144.0
      }
    ]
  },
  {
    "word": "BLUEBERRIES",
    "display": "Blueberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9050",
    "desc": "Blueberries, raw",
    "cal": 57.0,
    "pro": 0.7,
    "fat": 0.3,
    "carb": 14.5,
    "fib": 2.4,
    "h2o": 84.2,
    "sug": 10.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 148.0
      },
      {
        "amt": 50.0,
        "desc": "berries",
        "gm": 68.0
      }
    ]
  },
  {
    "word": "BOYSENBERRIES",
    "display": "Boysenberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9057",
    "desc": "Boysenberries, frozen, unsweetened",
    "cal": 50.0,
    "pro": 1.1,
    "fat": 0.3,
    "carb": 12.2,
    "fib": 5.3,
    "h2o": 85.9,
    "sug": 6.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, unthawed",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "package (10 oz)",
        "gm": 284.0
      }
    ]
  },
  {
    "word": "BREADFRUIT",
    "display": "Breadfruit",
    "groups": [
      "fruit"
    ],
    "ndb": "9059",
    "desc": "Breadfruit, raw",
    "cal": 103.0,
    "pro": 1.1,
    "fat": 0.2,
    "carb": 27.1,
    "fib": 4.9,
    "h2o": 70.7,
    "sug": 11.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 220.0
      },
      {
        "amt": 0.25,
        "desc": "fruit, small",
        "gm": 96.0
      }
    ]
  },
  {
    "word": "CANTALOUPE",
    "display": "Cantaloupe",
    "groups": [
      "fruit"
    ],
    "ndb": "9181",
    "desc": "Melons, cantaloupe, raw",
    "cal": 34.0,
    "pro": 0.8,
    "fat": 0.2,
    "carb": 8.2,
    "fib": 0.9,
    "h2o": 90.2,
    "sug": 7.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, balls",
        "gm": 177.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 160.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 156.0
      },
      {
        "amt": 1.0,
        "desc": "melon, large (about 6-1/2\" dia)",
        "gm": 814.0
      },
      {
        "amt": 1.0,
        "desc": "wedge, large (1/8 of large melon)",
        "gm": 102.0
      },
      {
        "amt": 1.0,
        "desc": "melon, medium (about 5\" dia)",
        "gm": 552.0
      },
      {
        "amt": 1.0,
        "desc": "wedge, medium (1/8 of medium melon)",
        "gm": 69.0
      },
      {
        "amt": 1.0,
        "desc": "melon, small (about 4-1/4\" dia)",
        "gm": 441.0
      },
      {
        "amt": 1.0,
        "desc": "wedge, small (1/8 of small melon)",
        "gm": 55.0
      },
      {
        "amt": 10.0,
        "desc": "cantaloupe balls",
        "gm": 138.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 134.0
      }
    ]
  },
  {
    "word": "CARAMBOLA",
    "display": "Carambola",
    "groups": [
      "fruit"
    ],
    "ndb": "9060",
    "desc": "Carambola, (starfruit), raw",
    "cal": 31.0,
    "pro": 1.0,
    "fat": 0.3,
    "carb": 6.7,
    "fib": 2.8,
    "h2o": 91.4,
    "sug": 4.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 108.0
      },
      {
        "amt": 1.0,
        "desc": "large (4-1/2\" long)",
        "gm": 124.0
      },
      {
        "amt": 1.0,
        "desc": "medium (3-5/8\" long)",
        "gm": 91.0
      },
      {
        "amt": 1.0,
        "desc": "small (3-1/8\" long)",
        "gm": 70.0
      }
    ]
  },
  {
    "word": "CARISSA",
    "display": "Carissa",
    "groups": [
      "fruit"
    ],
    "ndb": "9061",
    "desc": "Carissa, (natal-plum), raw",
    "cal": 62.0,
    "pro": 0.5,
    "fat": 1.3,
    "carb": 13.6,
    "fib": 0.0,
    "h2o": 84.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 150.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without skin and seeds",
        "gm": 20.0
      }
    ]
  },
  {
    "word": "CHAYOTE",
    "display": "Chayote",
    "groups": [
      "fruit"
    ],
    "ndb": "11150",
    "desc": "Chayote, fruit, cooked, boiled, drained, without salt",
    "cal": 24.0,
    "pro": 0.6,
    "fat": 0.5,
    "carb": 5.1,
    "fib": 2.8,
    "h2o": 93.4,
    "sug": 1.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1\" pieces)",
        "gm": 160.0
      }
    ]
  },
  {
    "word": "CHERIMOYA",
    "display": "Cherimoya",
    "groups": [
      "fruit"
    ],
    "ndb": "9062",
    "desc": "Cherimoya, raw",
    "cal": 75.0,
    "pro": 1.6,
    "fat": 0.7,
    "carb": 17.7,
    "fib": 3.0,
    "h2o": 79.4,
    "sug": 12.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pieces",
        "gm": 160.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without skin and seeds",
        "gm": 235.0
      }
    ]
  },
  {
    "word": "CHERRIES",
    "display": "Cherries",
    "groups": [
      "fruit"
    ],
    "ndb": "9070",
    "desc": "Cherries, sweet, raw",
    "cal": 63.0,
    "pro": 1.1,
    "fat": 0.2,
    "carb": 16.0,
    "fib": 2.1,
    "h2o": 82.2,
    "sug": 12.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, with pits, yields",
        "gm": 138.0
      },
      {
        "amt": 1.0,
        "desc": "cup, without pits",
        "gm": 154.0
      },
      {
        "amt": 1.0,
        "desc": "cherry",
        "gm": 8.2
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 140.0
      }
    ]
  },
  {
    "word": "CHOKECHERRIES",
    "display": "Chokecherries",
    "groups": [
      "fruit"
    ],
    "ndb": "35179",
    "desc": "Chokecherries, raw, pitted (Shoshone Bannock)",
    "cal": 156.0,
    "pro": 2.9,
    "fat": 1.0,
    "carb": 33.9,
    "fib": 17.0,
    "h2o": 61.5,
    "sug": 14.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CITRUS",
    "display": "Citrus",
    "groups": [
      "fruit"
    ],
    "ndb": "14262",
    "desc": "Citrus fruit juice drink, frozen concentrate",
    "cal": 162.0,
    "pro": 1.2,
    "fat": 0.1,
    "carb": 40.2,
    "fib": 0.2,
    "h2o": 57.4,
    "sug": 28.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 35.2
      },
      {
        "amt": 1.0,
        "desc": "can (12 fl oz)",
        "gm": 423.0
      }
    ]
  },
  {
    "word": "CLEMENTINE",
    "display": "Clementine",
    "groups": [
      "fruit"
    ],
    "ndb": "9433",
    "desc": "Clementines, raw",
    "cal": 47.0,
    "pro": 0.8,
    "fat": 0.1,
    "carb": 12.0,
    "fib": 1.7,
    "h2o": 86.6,
    "sug": 9.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fruit",
        "gm": 74.0
      }
    ]
  },
  {
    "word": "CLOUDBERRY",
    "display": "Cloudberry",
    "groups": [
      "fruit"
    ],
    "ndb": "35027",
    "desc": "Cloudberries, raw (Alaska Native)",
    "cal": 51.0,
    "pro": 2.4,
    "fat": 0.8,
    "carb": 8.6,
    "fib": 0.0,
    "h2o": 87.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "COCONUT",
    "display": "Coconut",
    "groups": [
      "fruit",
      "nuts",
      "fats"
    ],
    "ndb": "4047",
    "desc": "Oil, coconut",
    "cal": 892.0,
    "pro": 0.0,
    "fat": 99.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "CRABAPPLE",
    "display": "Crabapple",
    "groups": [
      "fruit"
    ],
    "ndb": "9077",
    "desc": "Crabapples, raw",
    "cal": 76.0,
    "pro": 0.4,
    "fat": 0.3,
    "carb": 19.9,
    "fib": 0.0,
    "h2o": 78.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 110.0
      }
    ]
  },
  {
    "word": "CRANBERRY",
    "display": "Cranberry",
    "groups": [
      "fruit"
    ],
    "ndb": "35030",
    "desc": "Cranberry, low bush or lingenberry, raw (Alaska Native)",
    "cal": 55.0,
    "pro": 0.4,
    "fat": 0.5,
    "carb": 12.2,
    "fib": 0.0,
    "h2o": 86.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CURRANT",
    "display": "Currant",
    "groups": [
      "fruit"
    ],
    "ndb": "9083",
    "desc": "Currants, european black, raw",
    "cal": 63.0,
    "pro": 1.4,
    "fat": 0.4,
    "carb": 15.4,
    "fib": 0.0,
    "h2o": 82.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 112.0
      }
    ]
  },
  {
    "word": "DATE",
    "display": "Date",
    "groups": [
      "fruit"
    ],
    "ndb": "9087",
    "desc": "Dates, deglet noor",
    "cal": 282.0,
    "pro": 2.5,
    "fat": 0.4,
    "carb": 75.0,
    "fib": 8.0,
    "h2o": 20.5,
    "sug": 63.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 147.0
      },
      {
        "amt": 1.0,
        "desc": "date, pitted",
        "gm": 7.1
      }
    ]
  },
  {
    "word": "DURIAN",
    "display": "Durian",
    "groups": [
      "fruit"
    ],
    "ndb": "9422",
    "desc": "Durian, raw or frozen",
    "cal": 147.0,
    "pro": 1.5,
    "fat": 5.3,
    "carb": 27.1,
    "fib": 3.8,
    "h2o": 65.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 243.0
      },
      {
        "amt": 1.0,
        "desc": "fruit",
        "gm": 602.0
      }
    ]
  },
  {
    "word": "ELDERBERRIES",
    "display": "Elderberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9088",
    "desc": "Elderberries, raw",
    "cal": 73.0,
    "pro": 0.7,
    "fat": 0.5,
    "carb": 18.4,
    "fib": 7.0,
    "h2o": 79.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 145.0
      }
    ]
  },
  {
    "word": "FEIJOA",
    "display": "Feijoa",
    "groups": [
      "fruit"
    ],
    "ndb": "9334",
    "desc": "Feijoa, raw",
    "cal": 61.0,
    "pro": 0.7,
    "fat": 0.4,
    "carb": 15.2,
    "fib": 6.4,
    "h2o": 83.3,
    "sug": 8.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pureed",
        "gm": 243.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without peel",
        "gm": 42.0
      },
      {
        "amt": 1.0,
        "desc": "cup 1/2\" chunks",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "FIG",
    "display": "Fig",
    "groups": [
      "fruit"
    ],
    "ndb": "9094",
    "desc": "Figs, dried, uncooked",
    "cal": 249.0,
    "pro": 3.3,
    "fat": 0.9,
    "carb": 63.9,
    "fib": 9.8,
    "h2o": 30.1,
    "sug": 47.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "fig",
        "gm": 8.4
      }
    ]
  },
  {
    "word": "FRUITCOCKTAIL",
    "display": "Fruit Cocktail",
    "groups": [
      "fruit"
    ],
    "ndb": "9097",
    "desc": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, juice pack, solids and liquids",
    "cal": 46.0,
    "pro": 0.5,
    "fat": 0.0,
    "carb": 11.9,
    "fib": 1.0,
    "h2o": 87.4,
    "sug": 10.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 237.0
      }
    ]
  },
  {
    "word": "GOJI",
    "display": "Goji",
    "groups": [
      "fruit"
    ],
    "ndb": "9110",
    "desc": "Goji berries, dried",
    "cal": 349.0,
    "pro": 14.3,
    "fat": 0.4,
    "carb": 77.1,
    "fib": 13.0,
    "h2o": 7.5,
    "sug": 45.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 5.0,
        "desc": "tbsp",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "GOOSEBERRIES",
    "display": "Gooseberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9107",
    "desc": "Gooseberries, raw",
    "cal": 44.0,
    "pro": 0.9,
    "fat": 0.6,
    "carb": 10.2,
    "fib": 4.3,
    "h2o": 87.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 150.0
      }
    ]
  },
  {
    "word": "GRAPE",
    "display": "Grape",
    "groups": [
      "fruit"
    ],
    "ndb": "9132",
    "desc": "Grapes, red or green (European type, such as Thompson seedless), raw",
    "cal": 69.0,
    "pro": 0.7,
    "fat": 0.2,
    "carb": 18.1,
    "fib": 0.9,
    "h2o": 80.5,
    "sug": 15.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 151.0
      },
      {
        "amt": 10.0,
        "desc": "grapes",
        "gm": 49.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 126.0
      }
    ]
  },
  {
    "word": "GRAPEFRUIT",
    "display": "Grapefruit",
    "groups": [
      "fruit"
    ],
    "ndb": "9116",
    "desc": "Grapefruit, raw, white, all areas",
    "cal": 33.0,
    "pro": 0.7,
    "fat": 0.1,
    "carb": 8.4,
    "fib": 1.1,
    "h2o": 90.5,
    "sug": 7.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup sections, with juice",
        "gm": 230.0
      },
      {
        "amt": 0.5,
        "desc": "fruit (3-3/4\" dia)",
        "gm": 118.0
      }
    ]
  },
  {
    "word": "GUANABANA",
    "display": "Guanabana",
    "groups": [
      "fruit"
    ],
    "ndb": "9434",
    "desc": "Guanabana nectar, canned",
    "cal": 59.0,
    "pro": 0.1,
    "fat": 0.2,
    "carb": 14.9,
    "fib": 0.1,
    "h2o": 84.7,
    "sug": 13.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 251.0
      }
    ]
  },
  {
    "word": "GUAVA",
    "display": "Guava",
    "groups": [
      "fruit"
    ],
    "ndb": "9143",
    "desc": "Guava sauce, cooked",
    "cal": 36.0,
    "pro": 0.3,
    "fat": 0.1,
    "carb": 9.5,
    "fib": 3.6,
    "h2o": 89.6,
    "sug": 5.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 238.0
      }
    ]
  },
  {
    "word": "HONEYDEW",
    "display": "Honeydew",
    "groups": [
      "fruit"
    ],
    "ndb": "9184",
    "desc": "Melons, honeydew, raw",
    "cal": 36.0,
    "pro": 0.5,
    "fat": 0.1,
    "carb": 9.1,
    "fib": 0.8,
    "h2o": 89.8,
    "sug": 8.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced (approx 20 pieces per cup)",
        "gm": 170.0
      },
      {
        "amt": 1.0,
        "desc": "cup, balls",
        "gm": 177.0
      },
      {
        "amt": 1.0,
        "desc": "melon (5-1/4\" dia)",
        "gm": 1000.0
      },
      {
        "amt": 1.0,
        "desc": "melon (6\" - 7\" dia)",
        "gm": 1280.0
      },
      {
        "amt": 1.0,
        "desc": "wedge (1/8 of 5-1/4\" dia melon)",
        "gm": 125.0
      },
      {
        "amt": 1.0,
        "desc": "wedge (1/8 of 6\" to 7\" dia melon)",
        "gm": 160.0
      },
      {
        "amt": 10.0,
        "desc": "honeydew balls",
        "gm": 138.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 134.0
      }
    ]
  },
  {
    "word": "HORNED",
    "display": "Horned",
    "groups": [
      "fruit"
    ],
    "ndb": "9451",
    "desc": "Horned melon (Kiwano)",
    "cal": 44.0,
    "pro": 1.8,
    "fat": 1.3,
    "carb": 7.6,
    "fib": 0.0,
    "h2o": 89.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 233.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (4-2/3\" long x 2-3/4\" dia)",
        "gm": 209.0
      }
    ]
  },
  {
    "word": "HUCKLEBERRIES",
    "display": "Huckleberries",
    "groups": [
      "fruit"
    ],
    "ndb": "35043",
    "desc": "Huckleberries, raw (Alaska Native)",
    "cal": 37.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 8.7,
    "fib": 0.0,
    "h2o": 90.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "JACKFRUIT",
    "display": "Jackfruit",
    "groups": [
      "fruit"
    ],
    "ndb": "9144",
    "desc": "Jackfruit, raw",
    "cal": 95.0,
    "pro": 1.7,
    "fat": 0.6,
    "carb": 23.2,
    "fib": 1.5,
    "h2o": 73.5,
    "sug": 19.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "cup 1\" pieces",
        "gm": 151.0
      }
    ]
  },
  {
    "word": "JUJUBE",
    "display": "Jujube",
    "groups": [
      "fruit"
    ],
    "ndb": "9146",
    "desc": "Jujube, raw",
    "cal": 79.0,
    "pro": 1.2,
    "fat": 0.2,
    "carb": 20.2,
    "fib": 0.0,
    "h2o": 77.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "KIWI",
    "display": "Kiwi",
    "groups": [
      "fruit"
    ],
    "ndb": "9148",
    "desc": "Kiwifruit, green, raw",
    "cal": 61.0,
    "pro": 1.1,
    "fat": 0.5,
    "carb": 14.7,
    "fib": 3.0,
    "h2o": 83.1,
    "sug": 9.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (2\" dia)",
        "gm": 69.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 148.0
      }
    ]
  },
  {
    "word": "KUMQUAT",
    "display": "Kumquat",
    "groups": [
      "fruit"
    ],
    "ndb": "9149",
    "desc": "Kumquats, raw",
    "cal": 71.0,
    "pro": 1.9,
    "fat": 0.9,
    "carb": 15.9,
    "fib": 6.5,
    "h2o": 80.8,
    "sug": 9.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "LEMONPEEL",
    "display": "Lemon Peel",
    "groups": [
      "fruit"
    ],
    "ndb": "9156",
    "desc": "Lemon peel, raw",
    "cal": 47.0,
    "pro": 1.5,
    "fat": 0.3,
    "carb": 16.0,
    "fib": 10.6,
    "h2o": 81.6,
    "sug": 4.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.0
      }
    ]
  },
  {
    "word": "LIME",
    "display": "Lime",
    "groups": [
      "fruit"
    ],
    "ndb": "9159",
    "desc": "Limes, raw",
    "cal": 30.0,
    "pro": 0.7,
    "fat": 0.2,
    "carb": 10.5,
    "fib": 2.8,
    "h2o": 88.3,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (2\" dia)",
        "gm": 67.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 67.0
      }
    ]
  },
  {
    "word": "LINGONBERRY",
    "display": "Lingonberry",
    "groups": [
      "fruit"
    ],
    "ndb": "9078",
    "desc": "Cranberries, raw",
    "cal": 46.0,
    "pro": 0.5,
    "fat": 0.1,
    "carb": 12.0,
    "fib": 3.6,
    "h2o": 87.3,
    "sug": 4.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 110.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whole",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "LITCHI",
    "display": "Litchi",
    "groups": [
      "fruit"
    ],
    "ndb": "9164",
    "desc": "Litchis, raw",
    "cal": 66.0,
    "pro": 0.8,
    "fat": 0.4,
    "carb": 16.5,
    "fib": 1.3,
    "h2o": 81.8,
    "sug": 15.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 190.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 9.6
      }
    ]
  },
  {
    "word": "LOGANBERRIES",
    "display": "Loganberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9167",
    "desc": "Loganberries, frozen",
    "cal": 55.0,
    "pro": 1.5,
    "fat": 0.3,
    "carb": 13.0,
    "fib": 5.3,
    "h2o": 84.6,
    "sug": 7.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, unthawed",
        "gm": 147.0
      }
    ]
  },
  {
    "word": "LONGAN",
    "display": "Longan",
    "groups": [
      "fruit"
    ],
    "ndb": "9172",
    "desc": "Longans, raw",
    "cal": 60.0,
    "pro": 1.3,
    "fat": 0.1,
    "carb": 15.1,
    "fib": 1.1,
    "h2o": 82.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 3.2
      }
    ]
  },
  {
    "word": "LOQUAT",
    "display": "Loquat",
    "groups": [
      "fruit"
    ],
    "ndb": "9174",
    "desc": "Loquats, raw",
    "cal": 47.0,
    "pro": 0.4,
    "fat": 0.2,
    "carb": 12.1,
    "fib": 1.7,
    "h2o": 86.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubed",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 13.6
      }
    ]
  },
  {
    "word": "MAMEY",
    "display": "Mamey",
    "groups": [
      "fruit"
    ],
    "ndb": "9314",
    "desc": "Sapote, mamey, raw",
    "cal": 124.0,
    "pro": 1.4,
    "fat": 0.5,
    "carb": 32.1,
    "fib": 5.4,
    "h2o": 64.9,
    "sug": 20.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup 1\" pieces",
        "gm": 175.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 558.0
      }
    ]
  },
  {
    "word": "MANDARIN",
    "display": "Mandarin",
    "groups": [
      "fruit"
    ],
    "ndb": "9218",
    "desc": "Tangerines, (mandarin oranges), raw",
    "cal": 53.0,
    "pro": 0.8,
    "fat": 0.3,
    "carb": 13.3,
    "fib": 1.8,
    "h2o": 85.2,
    "sug": 10.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sections",
        "gm": 195.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-1/4\" dia)",
        "gm": 76.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2-1/2\" dia)",
        "gm": 88.0
      },
      {
        "amt": 1.0,
        "desc": "large (2-3/4\" dia)",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 109.0
      }
    ]
  },
  {
    "word": "MANGO",
    "display": "Mango",
    "groups": [
      "fruit"
    ],
    "ndb": "9176",
    "desc": "Mangos, raw",
    "cal": 60.0,
    "pro": 0.8,
    "fat": 0.4,
    "carb": 15.0,
    "fib": 1.6,
    "h2o": 83.5,
    "sug": 13.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup pieces",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 336.0
      }
    ]
  },
  {
    "word": "MANGOSTEEN",
    "display": "Mangosteen",
    "groups": [
      "fruit"
    ],
    "ndb": "9177",
    "desc": "Mangosteen, canned, syrup pack",
    "cal": 73.0,
    "pro": 0.4,
    "fat": 0.6,
    "carb": 17.9,
    "fib": 1.8,
    "h2o": 80.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, drained",
        "gm": 196.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 216.0
      }
    ]
  },
  {
    "word": "MARASCHINO",
    "display": "Maraschino",
    "groups": [
      "fruit"
    ],
    "ndb": "9328",
    "desc": "Maraschino cherries, canned, drained",
    "cal": 165.0,
    "pro": 0.2,
    "fat": 0.2,
    "carb": 42.0,
    "fib": 3.2,
    "h2o": 57.3,
    "sug": 38.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cherry (NLEA serving)",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "MELON",
    "display": "Melon",
    "groups": [
      "fruit"
    ],
    "ndb": "9185",
    "desc": "Melon balls, frozen",
    "cal": 33.0,
    "pro": 0.8,
    "fat": 0.2,
    "carb": 7.9,
    "fib": 0.7,
    "h2o": 90.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, unthawed",
        "gm": 173.0
      }
    ]
  },
  {
    "word": "MULBERRY",
    "display": "Mulberry",
    "groups": [
      "fruit"
    ],
    "ndb": "9190",
    "desc": "Mulberries, raw",
    "cal": 43.0,
    "pro": 1.4,
    "fat": 0.4,
    "carb": 9.8,
    "fib": 1.7,
    "h2o": 87.7,
    "sug": 8.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 140.0
      },
      {
        "amt": 10.0,
        "desc": "fruit",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "NANCE",
    "display": "Nance",
    "groups": [
      "fruit"
    ],
    "ndb": "9449",
    "desc": "Nance, frozen, unsweetened",
    "cal": 73.0,
    "pro": 0.7,
    "fat": 1.2,
    "carb": 17.0,
    "fib": 7.5,
    "h2o": 80.6,
    "sug": 8.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup without pits, thawed",
        "gm": 112.0
      },
      {
        "amt": 3.0,
        "desc": "fruit without pits, thawed",
        "gm": 9.8
      }
    ]
  },
  {
    "word": "NECTARINE",
    "display": "Nectarine",
    "groups": [
      "fruit"
    ],
    "ndb": "9191",
    "desc": "Nectarines, raw",
    "cal": 44.0,
    "pro": 1.1,
    "fat": 0.3,
    "carb": 10.6,
    "fib": 1.7,
    "h2o": 87.6,
    "sug": 7.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 143.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-1/3\" dia)",
        "gm": 129.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2-1/2\" dia)",
        "gm": 142.0
      },
      {
        "amt": 1.0,
        "desc": "large (2-3/4\" dia)",
        "gm": 156.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 140.0
      }
    ]
  },
  {
    "word": "OHELOBERRY",
    "display": "Oheloberry",
    "groups": [
      "fruit"
    ],
    "ndb": "9192",
    "desc": "Oheloberries, raw",
    "cal": 28.0,
    "pro": 0.4,
    "fat": 0.2,
    "carb": 6.8,
    "fib": 0.0,
    "h2o": 92.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 140.0
      },
      {
        "amt": 10.0,
        "desc": "fruit",
        "gm": 11.0
      }
    ]
  },
  {
    "word": "OLIVEBLACK",
    "display": "Olive Black",
    "groups": [
      "fruit",
      "fats"
    ],
    "ndb": "9193",
    "desc": "Olives, ripe, canned (small-extra large)",
    "cal": 115.0,
    "pro": 0.8,
    "fat": 10.7,
    "carb": 6.3,
    "fib": 3.2,
    "h2o": 80.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.4
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 4.4
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 3.2
      }
    ]
  },
  {
    "word": "OLIVEGREEN",
    "display": "Olive Green",
    "groups": [
      "fruit",
      "fats"
    ],
    "ndb": "9195",
    "desc": "Olives, pickled, canned or bottled, green",
    "cal": 145.0,
    "pro": 1.0,
    "fat": 15.3,
    "carb": 3.8,
    "fib": 3.3,
    "h2o": 75.3,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "olive",
        "gm": 2.7
      }
    ]
  },
  {
    "word": "ORANGE",
    "display": "Orange",
    "groups": [
      "fruit"
    ],
    "ndb": "9200",
    "desc": "Oranges, raw, all commercial varieties",
    "cal": 47.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 11.8,
    "fib": 2.4,
    "h2o": 86.8,
    "sug": 9.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sections",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "large (3-1/16\" dia)",
        "gm": 184.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-3/8\" dia)",
        "gm": 96.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (2-5/8\" dia)",
        "gm": 131.0
      }
    ]
  },
  {
    "word": "PAPAYA",
    "display": "Papaya",
    "groups": [
      "fruit"
    ],
    "ndb": "9226",
    "desc": "Papayas, raw",
    "cal": 43.0,
    "pro": 0.5,
    "fat": 0.3,
    "carb": 10.8,
    "fib": 1.7,
    "h2o": 88.1,
    "sug": 7.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup 1\" pieces",
        "gm": 145.0
      },
      {
        "amt": 1.0,
        "desc": "cup, mashed",
        "gm": 230.0
      },
      {
        "amt": 1.0,
        "desc": "fruit, small",
        "gm": 157.0
      },
      {
        "amt": 1.0,
        "desc": "fruit, large",
        "gm": 781.0
      }
    ]
  },
  {
    "word": "PASILLA",
    "display": "Pasilla",
    "groups": [
      "fruit",
      "spice"
    ],
    "ndb": "11982",
    "desc": "Peppers, pasilla, dried",
    "cal": 345.0,
    "pro": 12.3,
    "fat": 15.8,
    "carb": 51.1,
    "fib": 26.8,
    "h2o": 14.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pepper",
        "gm": 7.0
      }
    ]
  },
  {
    "word": "PASSION",
    "display": "Passion",
    "groups": [
      "fruit"
    ],
    "ndb": "9231",
    "desc": "Passion-fruit, (granadilla), purple, raw",
    "cal": 97.0,
    "pro": 2.2,
    "fat": 0.7,
    "carb": 23.4,
    "fib": 10.4,
    "h2o": 72.9,
    "sug": 11.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 236.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 18.0
      }
    ]
  },
  {
    "word": "PEACH",
    "display": "Peach",
    "groups": [
      "fruit"
    ],
    "ndb": "9236",
    "desc": "Peaches, yellow, raw",
    "cal": 39.0,
    "pro": 0.9,
    "fat": 0.2,
    "carb": 9.5,
    "fib": 1.5,
    "h2o": 88.9,
    "sug": 8.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 154.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-1/2\" dia)",
        "gm": 130.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2-2/3\" dia)",
        "gm": 150.0
      },
      {
        "amt": 1.0,
        "desc": "large (2-3/4\" dia)",
        "gm": 175.0
      },
      {
        "amt": 1.0,
        "desc": "extra large (3\" dia)",
        "gm": 224.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 147.0
      }
    ]
  },
  {
    "word": "PEAR",
    "display": "Pear",
    "groups": [
      "fruit"
    ],
    "ndb": "9252",
    "desc": "Pears, raw",
    "cal": 57.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 15.2,
    "fib": 3.1,
    "h2o": 84.0,
    "sug": 9.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, slices",
        "gm": 140.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 161.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 148.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 178.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 230.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 166.0
      }
    ]
  },
  {
    "word": "PERSIMMON",
    "display": "Persimmon",
    "groups": [
      "fruit"
    ],
    "ndb": "9263",
    "desc": "Persimmons, japanese, raw",
    "cal": 70.0,
    "pro": 0.6,
    "fat": 0.2,
    "carb": 18.6,
    "fib": 3.6,
    "h2o": 80.3,
    "sug": 12.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (2-1/2\" dia)",
        "gm": 168.0
      }
    ]
  },
  {
    "word": "PINEAPPLE",
    "display": "Pineapple",
    "groups": [
      "fruit"
    ],
    "ndb": "9266",
    "desc": "Pineapple, raw, all varieties",
    "cal": 50.0,
    "pro": 0.5,
    "fat": 0.1,
    "carb": 13.1,
    "fib": 1.4,
    "h2o": 86.0,
    "sug": 9.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chunks",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "fruit",
        "gm": 905.0
      },
      {
        "amt": 1.0,
        "desc": "slice (4-2/3\" dia x 3/4\" thick)",
        "gm": 166.0
      },
      {
        "amt": 1.0,
        "desc": "slice (3-1/2\" dia x 3/4\" thick)",
        "gm": 84.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thin (3-1/2\" dia x 1/2\" thick)",
        "gm": 56.0
      }
    ]
  },
  {
    "word": "PITANGA",
    "display": "Pitanga",
    "groups": [
      "fruit"
    ],
    "ndb": "9276",
    "desc": "Pitanga, (surinam-cherry), raw",
    "cal": 33.0,
    "pro": 0.8,
    "fat": 0.4,
    "carb": 7.5,
    "fib": 0.0,
    "h2o": 90.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 173.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 7.0
      }
    ]
  },
  {
    "word": "PLAINTAIN",
    "display": "Plaintain",
    "groups": [
      "fruit"
    ],
    "ndb": "9277",
    "desc": "Plantains, raw",
    "cal": 122.0,
    "pro": 1.3,
    "fat": 0.4,
    "carb": 31.9,
    "fib": 2.3,
    "h2o": 65.3,
    "sug": 15.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 148.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 179.0
      }
    ]
  },
  {
    "word": "PLUM",
    "display": "Plum",
    "groups": [
      "fruit"
    ],
    "ndb": "9291",
    "desc": "Plums, dried (prunes), uncooked",
    "cal": 240.0,
    "pro": 2.2,
    "fat": 0.4,
    "carb": 63.9,
    "fib": 7.1,
    "h2o": 30.9,
    "sug": 38.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pitted",
        "gm": 174.0
      },
      {
        "amt": 1.0,
        "desc": "prune, pitted",
        "gm": 9.5
      }
    ]
  },
  {
    "word": "POMEGRANATE",
    "display": "Pomegranate",
    "groups": [
      "fruit"
    ],
    "ndb": "9286",
    "desc": "Pomegranates, raw",
    "cal": 83.0,
    "pro": 1.7,
    "fat": 1.2,
    "carb": 18.7,
    "fib": 4.0,
    "h2o": 77.9,
    "sug": 13.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup arils (seed/juice sacs)",
        "gm": 87.0
      },
      {
        "amt": 1.0,
        "desc": "pomegranate (4\" dia)",
        "gm": 282.0
      }
    ]
  },
  {
    "word": "PRICKLYPEAR",
    "display": "Prickly Pear",
    "groups": [
      "fruit"
    ],
    "ndb": "9287",
    "desc": "Prickly pears, raw",
    "cal": 41.0,
    "pro": 0.7,
    "fat": 0.5,
    "carb": 9.6,
    "fib": 3.6,
    "h2o": 87.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 103.0
      }
    ]
  },
  {
    "word": "PRUNE",
    "display": "Prune",
    "groups": [
      "fruit"
    ],
    "ndb": "9289",
    "desc": "Prunes, dehydrated (low-moisture), uncooked",
    "cal": 339.0,
    "pro": 3.7,
    "fat": 0.7,
    "carb": 89.1,
    "fib": 0.0,
    "h2o": 4.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 132.0
      }
    ]
  },
  {
    "word": "PUMMELO",
    "display": "Pummelo",
    "groups": [
      "fruit"
    ],
    "ndb": "9295",
    "desc": "Pummelo, raw",
    "cal": 38.0,
    "pro": 0.8,
    "fat": 0.0,
    "carb": 9.6,
    "fib": 1.0,
    "h2o": 89.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sections",
        "gm": 190.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 609.0
      }
    ]
  },
  {
    "word": "QUINCE",
    "display": "Quince",
    "groups": [
      "fruit"
    ],
    "ndb": "9296",
    "desc": "Quinces, raw",
    "cal": 57.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 15.3,
    "fib": 1.9,
    "h2o": 83.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 92.0
      }
    ]
  },
  {
    "word": "RAISIN",
    "display": "Raisin",
    "groups": [
      "fruit"
    ],
    "ndb": "9297",
    "desc": "Raisins, golden seedless",
    "cal": 302.0,
    "pro": 3.4,
    "fat": 0.5,
    "carb": 79.5,
    "fib": 4.0,
    "h2o": 15.0,
    "sug": 59.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, packed",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "cup (not packed)",
        "gm": 145.0
      }
    ]
  },
  {
    "word": "RASPBERRIES",
    "display": "Raspberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9302",
    "desc": "Raspberries, raw",
    "cal": 52.0,
    "pro": 1.2,
    "fat": 0.7,
    "carb": 11.9,
    "fib": 6.5,
    "h2o": 85.8,
    "sug": 4.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 123.0
      },
      {
        "amt": 1.0,
        "desc": "pint as purchased, yields",
        "gm": 312.0
      },
      {
        "amt": 10.0,
        "desc": "raspberries",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "RHUBARB",
    "display": "Rhubarb",
    "groups": [
      "fruit"
    ],
    "ndb": "9309",
    "desc": "Rhubarb, frozen, uncooked",
    "cal": 21.0,
    "pro": 0.6,
    "fat": 0.1,
    "carb": 5.1,
    "fib": 1.8,
    "h2o": 93.5,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 137.0
      }
    ]
  },
  {
    "word": "ROSELLE",
    "display": "Roselle",
    "groups": [
      "fruit"
    ],
    "ndb": "9311",
    "desc": "Roselle, raw",
    "cal": 49.0,
    "pro": 1.0,
    "fat": 0.6,
    "carb": 11.3,
    "fib": 0.0,
    "h2o": 86.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, without refuse",
        "gm": 57.0
      }
    ]
  },
  {
    "word": "SAPOTE",
    "display": "Sapote",
    "groups": [
      "fruit"
    ],
    "ndb": "9314",
    "desc": "Sapote, mamey, raw",
    "cal": 124.0,
    "pro": 1.4,
    "fat": 0.5,
    "carb": 32.1,
    "fib": 5.4,
    "h2o": 64.9,
    "sug": 20.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup 1\" pieces",
        "gm": 175.0
      },
      {
        "amt": 1.0,
        "desc": "fruit without refuse",
        "gm": 558.0
      }
    ]
  },
  {
    "word": "SERANO",
    "display": "Serano",
    "groups": [
      "fruit",
      "spice"
    ],
    "ndb": "11977",
    "desc": "Peppers, serrano, raw",
    "cal": 32.0,
    "pro": 1.7,
    "fat": 0.4,
    "carb": 6.7,
    "fib": 3.7,
    "h2o": 90.2,
    "sug": 3.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 105.0
      },
      {
        "amt": 1.0,
        "desc": "pepper",
        "gm": 6.1
      }
    ]
  },
  {
    "word": "SOURSOP",
    "display": "Soursop",
    "groups": [
      "fruit"
    ],
    "ndb": "9315",
    "desc": "Soursop, raw",
    "cal": 66.0,
    "pro": 1.0,
    "fat": 0.3,
    "carb": 16.8,
    "fib": 3.3,
    "h2o": 81.2,
    "sug": 13.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pulp",
        "gm": 225.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (7\" x 5-1/4\" dia)",
        "gm": 625.0
      }
    ]
  },
  {
    "word": "STARFRUIT",
    "display": "Starfruit",
    "groups": [
      "fruit"
    ],
    "ndb": "9060",
    "desc": "Carambola, (starfruit), raw",
    "cal": 31.0,
    "pro": 1.0,
    "fat": 0.3,
    "carb": 6.7,
    "fib": 2.8,
    "h2o": 91.4,
    "sug": 4.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 108.0
      },
      {
        "amt": 1.0,
        "desc": "large (4-1/2\" long)",
        "gm": 124.0
      },
      {
        "amt": 1.0,
        "desc": "medium (3-5/8\" long)",
        "gm": 91.0
      },
      {
        "amt": 1.0,
        "desc": "small (3-1/8\" long)",
        "gm": 70.0
      }
    ]
  },
  {
    "word": "STRAWBERRIES",
    "display": "Strawberries",
    "groups": [
      "fruit"
    ],
    "ndb": "9316",
    "desc": "Strawberries, raw",
    "cal": 32.0,
    "pro": 0.7,
    "fat": 0.3,
    "carb": 7.7,
    "fib": 2.0,
    "h2o": 91.0,
    "sug": 4.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, halves",
        "gm": 152.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pureed",
        "gm": 232.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 166.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whole",
        "gm": 144.0
      },
      {
        "amt": 1.0,
        "desc": "extra large (1-5/8\" dia)",
        "gm": 27.0
      },
      {
        "amt": 1.0,
        "desc": "large (1-3/8\" dia)",
        "gm": 18.0
      },
      {
        "amt": 1.0,
        "desc": "medium (1-1/4\" dia)",
        "gm": 12.0
      },
      {
        "amt": 1.0,
        "desc": "pint as purchased, yields",
        "gm": 357.0
      },
      {
        "amt": 1.0,
        "desc": "small (1\" dia)",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 147.0
      }
    ]
  },
  {
    "word": "TAMARIND",
    "display": "Tamarind",
    "groups": [
      "fruit"
    ],
    "ndb": "9322",
    "desc": "Tamarinds, raw",
    "cal": 239.0,
    "pro": 2.8,
    "fat": 0.6,
    "carb": 62.5,
    "fib": 5.1,
    "h2o": 31.4,
    "sug": 38.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pulp",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "fruit (3\" x 1\")",
        "gm": 2.0
      }
    ]
  },
  {
    "word": "TANGERINE",
    "display": "Tangerine",
    "groups": [
      "fruit"
    ],
    "ndb": "9218",
    "desc": "Tangerines, (mandarin oranges), raw",
    "cal": 53.0,
    "pro": 0.8,
    "fat": 0.3,
    "carb": 13.3,
    "fib": 1.8,
    "h2o": 85.2,
    "sug": 10.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sections",
        "gm": 195.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-1/4\" dia)",
        "gm": 76.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2-1/2\" dia)",
        "gm": 88.0
      },
      {
        "amt": 1.0,
        "desc": "large (2-3/4\" dia)",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 109.0
      }
    ]
  },
  {
    "word": "WATERMELON",
    "display": "Watermelon",
    "groups": [
      "fruit"
    ],
    "ndb": "9326",
    "desc": "Watermelon, raw",
    "cal": 30.0,
    "pro": 0.6,
    "fat": 0.1,
    "carb": 7.5,
    "fib": 0.4,
    "h2o": 91.5,
    "sug": 6.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, balls",
        "gm": 154.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 152.0
      },
      {
        "amt": 1.0,
        "desc": "melon (15\" long x 7-1/2\" dia)",
        "gm": 4518.0
      },
      {
        "amt": 1.0,
        "desc": "wedge (approx 1/16 of melon)",
        "gm": 286.0
      },
      {
        "amt": 10.0,
        "desc": "watermelon balls",
        "gm": 122.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 280.0
      }
    ]
  },
  {
    "word": "WAXGOURD",
    "display": "Waxgourd",
    "groups": [
      "fruit"
    ],
    "ndb": "11594",
    "desc": "Waxgourd, (chinese preserving melon), cooked, boiled, drained, without salt",
    "cal": 14.0,
    "pro": 0.4,
    "fat": 0.2,
    "carb": 3.0,
    "fib": 1.0,
    "h2o": 96.1,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 175.0
      }
    ]
  },
  {
    "word": "AMARANTH",
    "display": "Amaranth",
    "groups": [
      "grain"
    ],
    "ndb": "20002",
    "desc": "Amaranth grain, cooked",
    "cal": 102.0,
    "pro": 3.8,
    "fat": 1.6,
    "carb": 18.7,
    "fib": 2.1,
    "h2o": 75.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 246.0
      }
    ]
  },
  {
    "word": "BAGEL",
    "display": "Bagel",
    "groups": [
      "grain"
    ],
    "ndb": "28319",
    "desc": "Bagels, whole grain white",
    "cal": 255.0,
    "pro": 9.3,
    "fat": 0.0,
    "carb": 54.5,
    "fib": 4.7,
    "h2o": 34.5,
    "sug": 9.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "piece bagel 1 serving",
        "gm": 43.0
      }
    ]
  },
  {
    "word": "BARLEY",
    "display": "Barley",
    "groups": [
      "grain"
    ],
    "ndb": "20006",
    "desc": "Barley, pearled, cooked",
    "cal": 123.0,
    "pro": 2.3,
    "fat": 0.4,
    "carb": 28.2,
    "fib": 3.8,
    "h2o": 68.8,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 157.0
      }
    ]
  },
  {
    "word": "BUCKWHEAT",
    "display": "Buckwheat",
    "groups": [
      "grain"
    ],
    "ndb": "20011",
    "desc": "Buckwheat flour, whole-groat",
    "cal": 335.0,
    "pro": 12.6,
    "fat": 3.1,
    "carb": 70.6,
    "fib": 10.0,
    "h2o": 11.2,
    "sug": 2.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 120.0
      }
    ]
  },
  {
    "word": "BUCKWHEATCOOKED",
    "display": "Buckwheat Cooked",
    "groups": [
      "grain"
    ],
    "ndb": "2000",
    "desc": "",
    "cal": 0,
    "pro": 0,
    "fat": 0,
    "carb": 0,
    "fib": 0,
    "h2o": 0,
    "sug": 0,
    "portions": []
  },
  {
    "word": "BULGUR",
    "display": "Bulgur",
    "groups": [
      "grain"
    ],
    "ndb": "20013",
    "desc": "Bulgur, cooked",
    "cal": 83.0,
    "pro": 3.1,
    "fat": 0.2,
    "carb": 18.6,
    "fib": 4.5,
    "h2o": 77.8,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 182.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.4
      }
    ]
  },
  {
    "word": "CEERALGRAHMS",
    "display": "Cereal Honey Grahms",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8035",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, GOLDEN GRAHAMS",
    "cal": 374.0,
    "pro": 5.3,
    "fat": 3.2,
    "carb": 85.1,
    "fib": 5.6,
    "h2o": 2.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup (1 NLEA serving)",
        "gm": 31.0
      }
    ]
  },
  {
    "word": "CEREALCAPN",
    "display": "Cereal Cap'n Crunch",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8010",
    "desc": "Cereals ready-to-eat, QUAKER, CAP'N CRUNCH",
    "cal": 398.0,
    "pro": 4.4,
    "fat": 5.1,
    "carb": 85.5,
    "fib": 2.5,
    "h2o": 2.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup (1 NLEA serving)",
        "gm": 27.0
      }
    ]
  },
  {
    "word": "CEREALCHARMS",
    "display": "Cereal Lucky Charms",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8050",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, LUCKY CHARMS",
    "cal": 380.0,
    "pro": 7.7,
    "fat": 5.0,
    "carb": 80.9,
    "fib": 5.0,
    "h2o": 4.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup (1 NLEA serving)",
        "gm": 27.0
      }
    ]
  },
  {
    "word": "CEREALCHERRIOS",
    "display": "Cereal Cherrios",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8013",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, CHEERIOS",
    "cal": 376.0,
    "pro": 12.1,
    "fat": 6.7,
    "carb": 73.2,
    "fib": 9.4,
    "h2o": 5.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1 NLEA serving)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "CEREALCORN",
    "display": "Cereal Corn Flakes",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8020",
    "desc": "Cereals ready-to-eat, KELLOGG, KELLOGG'S Corn Flakes",
    "cal": 357.0,
    "pro": 7.5,
    "fat": 0.4,
    "carb": 84.1,
    "fib": 3.3,
    "h2o": 3.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1 NLEA serving)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "CEREALCRUNCH",
    "display": "Cereal Cinnamon Crunch",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8272",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, CINNAMON TOAST CRUNCH",
    "cal": 410.0,
    "pro": 5.5,
    "fat": 10.2,
    "carb": 78.0,
    "fib": 6.8,
    "h2o": 3.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup (1 NLEA serving)",
        "gm": 31.0
      }
    ]
  },
  {
    "word": "CEREALFROSTED",
    "display": "Cereal Frosted Flakes",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8069",
    "desc": "Cereals ready-to-eat, KELLOGG, KELLOGG'S FROSTED FLAKES",
    "cal": 369.0,
    "pro": 4.0,
    "fat": 1.7,
    "carb": 89.2,
    "fib": 2.2,
    "h2o": 4.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup ( 1 NLEA serving)",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 42.0
      }
    ]
  },
  {
    "word": "CEREALHONEY",
    "display": "Cereal Honey Nut Cheerios",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8045",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, HONEY NUT CHEERIOS",
    "cal": 376.0,
    "pro": 8.8,
    "fat": 5.0,
    "carb": 79.7,
    "fib": 7.1,
    "h2o": 2.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup (1 NLEA serving)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "CEREALLOOPS",
    "display": "Cereal Fruit Loops",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8030",
    "desc": "Cereals ready-to-eat, KELLOGG, KELLOGG'S FROOT LOOPS",
    "cal": 375.0,
    "pro": 5.3,
    "fat": 3.4,
    "carb": 88.0,
    "fib": 9.3,
    "h2o": 2.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1 NLEA serving)",
        "gm": 29.0
      }
    ]
  },
  {
    "word": "CEREALPUFFS",
    "display": "Cereal Cocoa Puffs",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8271",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, COCOA PUFFS",
    "cal": 383.0,
    "pro": 5.6,
    "fat": 5.2,
    "carb": 83.7,
    "fib": 5.7,
    "h2o": 1.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.75,
        "desc": "cup (1 NLEA serving)",
        "gm": 27.0
      }
    ]
  },
  {
    "word": "CEREALRAISIN",
    "display": "Cereal Raisin Bran",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8060",
    "desc": "Cereals ready-to-eat, KELLOGG, KELLOGG'S RAISIN BRAN",
    "cal": 318.0,
    "pro": 7.7,
    "fat": 2.7,
    "carb": 77.3,
    "fib": 11.4,
    "h2o": 10.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup ( 1 NLEA serving)",
        "gm": 59.0
      }
    ]
  },
  {
    "word": "CEREALRICE",
    "display": "Cereal Rice Krispies",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8065",
    "desc": "Cereals ready-to-eat, KELLOGG, KELLOGG'S RICE KRISPIES",
    "cal": 381.0,
    "pro": 6.8,
    "fat": 2.0,
    "carb": 85.0,
    "fib": 0.4,
    "h2o": 5.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.25,
        "desc": "cup (1 NLEA serving)",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 29.0
      }
    ]
  },
  {
    "word": "CEREALTRIX",
    "display": "Cereal Trix",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8078",
    "desc": "Cereals ready-to-eat, GENERAL MILLS, TRIX",
    "cal": 384.0,
    "pro": 4.9,
    "fat": 3.8,
    "carb": 86.2,
    "fib": 3.9,
    "h2o": 1.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1 NLEA serving)",
        "gm": 32.0
      }
    ]
  },
  {
    "word": "CORNMEAL",
    "display": "Cornmeal",
    "groups": [
      "grain"
    ],
    "ndb": "20020",
    "desc": "Cornmeal, whole-grain, yellow",
    "cal": 362.0,
    "pro": 8.1,
    "fat": 3.6,
    "carb": 76.9,
    "fib": 7.3,
    "h2o": 10.3,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 122.0
      }
    ]
  },
  {
    "word": "COUSCOUS",
    "display": "Couscous",
    "groups": [
      "grain"
    ],
    "ndb": "20029",
    "desc": "Couscous, cooked",
    "cal": 112.0,
    "pro": 3.8,
    "fat": 0.2,
    "carb": 23.2,
    "fib": 1.4,
    "h2o": 72.6,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cooked",
        "gm": 157.0
      },
      {
        "amt": 1.0,
        "desc": "cup, dry, yields",
        "gm": 528.0
      },
      {
        "amt": 1.0,
        "desc": "oz, dry, yields",
        "gm": 86.0
      }
    ]
  },
  {
    "word": "CRACKERWHOLE",
    "display": "Cracker Whole Wheat",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18235",
    "desc": "Crackers, whole-wheat",
    "cal": 427.0,
    "pro": 10.6,
    "fat": 14.1,
    "carb": 69.5,
    "fib": 10.3,
    "h2o": 2.9,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 28.0
      },
      {
        "amt": 6.0,
        "desc": "crackers, Triscuits, regular size",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "cracker",
        "gm": 4.6
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 94.0
      },
      {
        "amt": 10.0,
        "desc": "Triscuit Bits",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "CRACKERCHEESE",
    "display": "Cracker Cheese",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18214",
    "desc": "Crackers, cheese, regular",
    "cal": 489.0,
    "pro": 10.9,
    "fat": 22.7,
    "carb": 59.4,
    "fib": 2.3,
    "h2o": 3.5,
    "sug": 4.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup, bite size",
        "gm": 62.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 72.0
      },
      {
        "amt": 1.0,
        "desc": "gold fish",
        "gm": 0.6
      },
      {
        "amt": 1.0,
        "desc": "bag, single serving",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "snack stick",
        "gm": 2.0
      },
      {
        "amt": 1.0,
        "desc": "cracker (1\" square)",
        "gm": 1.0
      }
    ]
  },
  {
    "word": "CRACKERMATZO",
    "display": "Cracker Matzo",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18217",
    "desc": "Crackers, matzo, plain",
    "cal": 395.0,
    "pro": 10.0,
    "fat": 1.4,
    "carb": 83.7,
    "fib": 3.0,
    "h2o": 4.3,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "matzo",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "CRACKERMEAL",
    "display": "Cracker Meal",
    "groups": [
      "grain"
    ],
    "ndb": "18236",
    "desc": "Cracker meal",
    "cal": 383.0,
    "pro": 9.3,
    "fat": 1.7,
    "carb": 80.9,
    "fib": 2.6,
    "h2o": 7.6,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 115.0
      }
    ]
  },
  {
    "word": "CRACKERMELBA",
    "display": "Cracker Melba",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18220",
    "desc": "Crackers, melba toast, plain",
    "cal": 390.0,
    "pro": 12.1,
    "fat": 3.2,
    "carb": 76.6,
    "fib": 6.3,
    "h2o": 5.1,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup pieces",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "cup, rounds",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "melba round",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "piece (3-3/4\" x 1-3/4\" x 1/8\")",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "CRACKERMULTI",
    "display": "Cracker Multi-Grain",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "28292",
    "desc": "Crackers, multigrain",
    "cal": 482.0,
    "pro": 7.1,
    "fat": 20.4,
    "carb": 67.6,
    "fib": 3.5,
    "h2o": 2.5,
    "sug": 12.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 4.0,
        "desc": "crackers",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "CRACKERRUSK",
    "display": "Cracker Rusk",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18224",
    "desc": "Crackers, rusk toast",
    "cal": 407.0,
    "pro": 13.5,
    "fat": 7.2,
    "carb": 72.3,
    "fib": 0.0,
    "h2o": 5.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "rusk",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "CRACKERRYE",
    "display": "Cracker Rye",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18226",
    "desc": "Crackers, rye, wafers, plain",
    "cal": 334.0,
    "pro": 9.6,
    "fat": 0.9,
    "carb": 80.4,
    "fib": 22.9,
    "h2o": 5.0,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 61.0
      },
      {
        "amt": 1.0,
        "desc": "cracker (4-1/2\" x 2-1/2\" x 1/8\")",
        "gm": 11.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, triple",
        "gm": 25.0
      }
    ]
  },
  {
    "word": "CRACKERSALTINES",
    "display": "Cracker Saltines",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18228",
    "desc": "Crackers, saltines (includes oyster, soda, soup)",
    "cal": 418.0,
    "pro": 9.5,
    "fat": 8.6,
    "carb": 74.0,
    "fib": 2.8,
    "h2o": 5.0,
    "sug": 1.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 5.0,
        "desc": "crackers",
        "gm": 14.9
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 70.0
      },
      {
        "amt": 5.0,
        "desc": "crackers square (1 serving)",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cracker square",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, round large",
        "gm": 10.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, oyster",
        "gm": 1.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, rectangle",
        "gm": 6.0
      },
      {
        "amt": 1.0,
        "desc": "cup oyster crackers",
        "gm": 45.0
      }
    ]
  },
  {
    "word": "CRACKERWHEAT",
    "display": "Cracker Wheat",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18232",
    "desc": "Crackers, wheat, regular",
    "cal": 455.0,
    "pro": 7.3,
    "fat": 16.4,
    "carb": 70.7,
    "fib": 6.9,
    "h2o": 2.8,
    "sug": 15.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 16.0,
        "desc": "crackers 1 serving",
        "gm": 34.0
      },
      {
        "amt": 2.0,
        "desc": "crackers 1 serving",
        "gm": 14.5
      }
    ]
  },
  {
    "word": "CREAMOFWHEAT",
    "display": "Cream of Wheat",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "8103",
    "desc": "Cereals, CREAM OF WHEAT, regular (10 minute), cooked with water, without salt",
    "cal": 50.0,
    "pro": 1.4,
    "fat": 0.2,
    "carb": 10.5,
    "fib": 0.5,
    "h2o": 87.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1 serving)",
        "gm": 251.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "CROUTON",
    "display": "Crouton",
    "groups": [
      "grain"
    ],
    "ndb": "18242",
    "desc": "Croutons, plain",
    "cal": 407.0,
    "pro": 11.9,
    "fat": 6.6,
    "carb": 73.5,
    "fib": 5.1,
    "h2o": 5.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "ENGLISHMUFFIN",
    "display": "English Muffin",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "28320",
    "desc": "English muffins, whole grain white",
    "cal": 245.0,
    "pro": 7.0,
    "fat": 1.8,
    "carb": 50.2,
    "fib": 3.5,
    "h2o": 39.5,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "muffin 1 serving",
        "gm": 57.0
      }
    ]
  },
  {
    "word": "FARINA",
    "display": "Farina",
    "groups": [
      "grain"
    ],
    "ndb": "8113",
    "desc": "Cereals, farina, enriched, cooked with water, without salt",
    "cal": 53.0,
    "pro": 1.8,
    "fat": 0.3,
    "carb": 10.9,
    "fib": 0.8,
    "h2o": 86.5,
    "sug": 0.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "GRITS",
    "display": "Grits",
    "groups": [
      "grain"
    ],
    "ndb": "8161",
    "desc": "Cereals, corn grits, white, regular and quick, enriched, cooked with water, with salt",
    "cal": 71.0,
    "pro": 1.7,
    "fat": 0.5,
    "carb": 14.8,
    "fib": 0.8,
    "h2o": 82.9,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 257.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "HOMINY",
    "display": "Hominy",
    "groups": [
      "grain"
    ],
    "ndb": "20030",
    "desc": "Hominy, canned, white",
    "cal": 72.0,
    "pro": 1.5,
    "fat": 0.9,
    "carb": 14.3,
    "fib": 2.5,
    "h2o": 82.5,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 165.0
      }
    ]
  },
  {
    "word": "INCAPARINA",
    "display": "Incaparina",
    "groups": [
      "grain"
    ],
    "ndb": "8580",
    "desc": "Incaparina, dry mix (corn and soy flours), unprepared",
    "cal": 379.0,
    "pro": 21.8,
    "fat": 5.6,
    "carb": 60.5,
    "fib": 9.9,
    "h2o": 7.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.9
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 128.0
      }
    ]
  },
  {
    "word": "MACARONI",
    "display": "Macaroni",
    "groups": [
      "grain"
    ],
    "ndb": "20106",
    "desc": "Macaroni, vegetable, enriched, cooked",
    "cal": 128.0,
    "pro": 4.5,
    "fat": 0.1,
    "carb": 26.6,
    "fib": 4.3,
    "h2o": 68.4,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup spiral shaped",
        "gm": 134.0
      }
    ]
  },
  {
    "word": "MASA",
    "display": "Masa",
    "groups": [
      "grain"
    ],
    "ndb": "20019",
    "desc": "Corn flour, masa, unenriched, white",
    "cal": 363.0,
    "pro": 8.5,
    "fat": 3.7,
    "carb": 76.6,
    "fib": 6.4,
    "h2o": 9.8,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 114.0
      }
    ]
  },
  {
    "word": "MILLET",
    "display": "Millet",
    "groups": [
      "grain"
    ],
    "ndb": "20032",
    "desc": "Millet, cooked",
    "cal": 119.0,
    "pro": 3.5,
    "fat": 1.0,
    "carb": 23.7,
    "fib": 1.3,
    "h2o": 71.4,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 174.0
      }
    ]
  },
  {
    "word": "NOODLEEGG",
    "display": "Noodle Egg",
    "groups": [
      "grain"
    ],
    "ndb": "20110",
    "desc": "Noodles, egg, enriched, cooked",
    "cal": 138.0,
    "pro": 4.5,
    "fat": 2.1,
    "carb": 25.2,
    "fib": 1.2,
    "h2o": 67.7,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 160.0
      }
    ]
  },
  {
    "word": "NOODLESOBA",
    "display": "Noodle Soba",
    "groups": [
      "grain"
    ],
    "ndb": "20115",
    "desc": "Noodles, japanese, soba, cooked",
    "cal": 99.0,
    "pro": 5.1,
    "fat": 0.1,
    "carb": 21.4,
    "fib": 0.0,
    "h2o": 73.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 114.0
      }
    ]
  },
  {
    "word": "NOODLESOMEN",
    "display": "Noodle Somen",
    "groups": [
      "grain"
    ],
    "ndb": "20117",
    "desc": "Noodles, japanese, somen, cooked",
    "cal": 131.0,
    "pro": 4.0,
    "fat": 0.2,
    "carb": 27.5,
    "fib": 0.0,
    "h2o": 67.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 176.0
      }
    ]
  },
  {
    "word": "OAT",
    "display": "Oat",
    "groups": [
      "grain",
      "fats"
    ],
    "ndb": "20034",
    "desc": "Oat bran, cooked",
    "cal": 40.0,
    "pro": 3.2,
    "fat": 0.9,
    "carb": 11.4,
    "fib": 2.6,
    "h2o": 84.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 219.0
      }
    ]
  },
  {
    "word": "OATBRAN",
    "display": "Oat Bran",
    "groups": [
      "grain"
    ],
    "ndb": "20033",
    "desc": "Oat bran, raw",
    "cal": 246.0,
    "pro": 17.3,
    "fat": 7.0,
    "carb": 66.2,
    "fib": 15.4,
    "h2o": 6.5,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 94.0
      }
    ]
  },
  {
    "word": "OATBRANCOOKED",
    "display": "Oat Bran Cooked",
    "groups": [
      "grain"
    ],
    "ndb": "20034",
    "desc": "Oat bran, cooked",
    "cal": 40.0,
    "pro": 3.2,
    "fat": 0.9,
    "carb": 11.4,
    "fib": 2.6,
    "h2o": 84.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 219.0
      }
    ]
  },
  {
    "word": "OATMEAL",
    "display": "Oatmeal",
    "groups": [
      "grain"
    ],
    "ndb": "8640",
    "desc": "Cereals, QUAKER, Instant Oatmeal Organic, Regular",
    "cal": 367.0,
    "pro": 16.0,
    "fat": 6.3,
    "carb": 67.0,
    "fib": 9.8,
    "h2o": 8.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 41.0
      }
    ]
  },
  {
    "word": "PASTA",
    "display": "Pasta",
    "groups": [
      "grain"
    ],
    "ndb": "20420",
    "desc": "Pasta, dry, unenriched",
    "cal": 371.0,
    "pro": 13.0,
    "fat": 1.5,
    "carb": 74.7,
    "fib": 3.2,
    "h2o": 9.9,
    "sug": 2.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup spaghetti",
        "gm": 91.0
      },
      {
        "amt": 2.0,
        "desc": "oz",
        "gm": 57.0
      },
      {
        "amt": 1.0,
        "desc": "cup elbows",
        "gm": 122.0
      },
      {
        "amt": 1.0,
        "desc": "cup penne",
        "gm": 95.0
      },
      {
        "amt": 1.0,
        "desc": "cup farfalle",
        "gm": 81.0
      },
      {
        "amt": 1.0,
        "desc": "cup rotini",
        "gm": 96.0
      },
      {
        "amt": 1.0,
        "desc": "cup shells",
        "gm": 64.0
      },
      {
        "amt": 1.0,
        "desc": "cup lasagna",
        "gm": 90.0
      }
    ]
  },
  {
    "word": "PIKIBREAD",
    "display": "Piki Bread",
    "groups": [
      "grain"
    ],
    "ndb": "35234",
    "desc": "Piki bread, made from blue cornmeal (Hopi)",
    "cal": 390.0,
    "pro": 9.1,
    "fat": 7.2,
    "carb": 72.2,
    "fib": 9.2,
    "h2o": 9.0,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "POPCORN",
    "display": "Popcorn",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "19807",
    "desc": "Snacks, popcorn, oil-popped, white popcorn, salt added",
    "cal": 500.0,
    "pro": 9.0,
    "fat": 28.1,
    "carb": 57.2,
    "fib": 10.0,
    "h2o": 2.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 11.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "QUINOA",
    "display": "Quinoa",
    "groups": [
      "grain",
      "protein"
    ],
    "ndb": "20137",
    "desc": "Quinoa, cooked",
    "cal": 120.0,
    "pro": 4.4,
    "fat": 1.9,
    "carb": 21.3,
    "fib": 2.8,
    "h2o": 71.6,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 185.0
      }
    ]
  },
  {
    "word": "RAMEN",
    "display": "Ramen",
    "groups": [
      "grain"
    ],
    "ndb": "20110",
    "desc": "Noodles, Japanese, ramen, dry",
    "cal": 436.0,
    "pro": 10.0,
    "fat": 17.0,
    "carb": 62.0,
    "fib": 2.0,
    "h2o": 5.0,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "package",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "block",
        "gm": 43.0
      }
    ]
  },
  {
    "word": "RICEBRAN",
    "display": "Rice Bran",
    "groups": [
      "grain"
    ],
    "ndb": "20060",
    "desc": "Rice bran, crude",
    "cal": 316.0,
    "pro": 13.3,
    "fat": 20.9,
    "carb": 49.7,
    "fib": 21.0,
    "h2o": 6.1,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 118.0
      }
    ]
  },
  {
    "word": "RICEBROWN",
    "display": "Brown Rice",
    "groups": [
      "grain"
    ],
    "ndb": "20037",
    "desc": "Rice, brown, long-grain, cooked",
    "cal": 123.0,
    "pro": 2.7,
    "fat": 1.0,
    "carb": 25.6,
    "fib": 1.6,
    "h2o": 70.3,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 202.0
      }
    ]
  },
  {
    "word": "RICEFLOURBROWN",
    "display": "Rice Flour Brown",
    "groups": [
      "grain"
    ],
    "ndb": "20090",
    "desc": "Rice flour, brown",
    "cal": 363.0,
    "pro": 7.2,
    "fat": 2.8,
    "carb": 76.5,
    "fib": 4.6,
    "h2o": 12.0,
    "sug": 0.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 158.0
      }
    ]
  },
  {
    "word": "RICEFLOURWHITE",
    "display": "Rice Flour White",
    "groups": [
      "grain"
    ],
    "ndb": "20061",
    "desc": "Rice flour, white, unenriched",
    "cal": 366.0,
    "pro": 6.0,
    "fat": 1.4,
    "carb": 80.1,
    "fib": 2.4,
    "h2o": 11.9,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 158.0
      }
    ]
  },
  {
    "word": "RICEWHITE",
    "display": "White Rice",
    "groups": [
      "grain"
    ],
    "ndb": "20545",
    "desc": "Rice, white, long-grain, regular, cooked, unenriched, with salt",
    "cal": 130.0,
    "pro": 2.7,
    "fat": 0.3,
    "carb": 28.2,
    "fib": 0.4,
    "h2o": 68.4,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 158.0
      }
    ]
  },
  {
    "word": "RYE",
    "display": "Rye",
    "groups": [
      "grain"
    ],
    "ndb": "20062",
    "desc": "Rye grain",
    "cal": 338.0,
    "pro": 10.3,
    "fat": 1.6,
    "carb": 75.9,
    "fib": 15.1,
    "h2o": 10.6,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 169.0
      }
    ]
  },
  {
    "word": "SEMOLINA",
    "display": "Semolina",
    "groups": [
      "grain"
    ],
    "ndb": "20466",
    "desc": "Semolina, unenriched",
    "cal": 360.0,
    "pro": 12.7,
    "fat": 1.1,
    "carb": 72.8,
    "fib": 3.9,
    "h2o": 12.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 167.0
      }
    ]
  },
  {
    "word": "SORGHUM",
    "display": "Sorghum",
    "groups": [
      "grain"
    ],
    "ndb": "20067",
    "desc": "Sorghum grain",
    "cal": 329.0,
    "pro": 10.6,
    "fat": 3.5,
    "carb": 72.1,
    "fib": 6.7,
    "h2o": 12.4,
    "sug": 2.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 192.0
      }
    ]
  },
  {
    "word": "SORGHUMFLOUR",
    "display": "Sorghum Flour",
    "groups": [
      "grain"
    ],
    "ndb": "20648",
    "desc": "Sorghum flour, whole-grain",
    "cal": 359.0,
    "pro": 8.4,
    "fat": 3.3,
    "carb": 76.6,
    "fib": 6.6,
    "h2o": 10.3,
    "sug": 1.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 121.0
      }
    ]
  },
  {
    "word": "SPAGHETTI",
    "display": "Spaghetti",
    "groups": [
      "grain"
    ],
    "ndb": "20127",
    "desc": "Spaghetti, spinach, cooked",
    "cal": 130.0,
    "pro": 4.6,
    "fat": 0.6,
    "carb": 26.1,
    "fib": 0.0,
    "h2o": 68.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 140.0
      }
    ]
  },
  {
    "word": "SPELT",
    "display": "Spelt",
    "groups": [
      "grain"
    ],
    "ndb": "20140",
    "desc": "Spelt, uncooked",
    "cal": 338.0,
    "pro": 14.6,
    "fat": 2.4,
    "carb": 70.2,
    "fib": 10.7,
    "h2o": 11.0,
    "sug": 6.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 174.0
      }
    ]
  },
  {
    "word": "TEFF",
    "display": "Teff",
    "groups": [
      "grain"
    ],
    "ndb": "20143",
    "desc": "Teff, cooked",
    "cal": 101.0,
    "pro": 3.9,
    "fat": 0.7,
    "carb": 19.9,
    "fib": 2.8,
    "h2o": 74.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 252.0
      }
    ]
  },
  {
    "word": "TOAST",
    "display": "Toast",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18030",
    "desc": "Bread, french or vienna, toasted (includes sourdough)",
    "cal": 319.0,
    "pro": 13.0,
    "fat": 2.1,
    "carb": 61.9,
    "fib": 3.1,
    "h2o": 20.6,
    "sug": 3.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice, small",
        "gm": 29.0
      },
      {
        "amt": 1.0,
        "desc": "slice, medium",
        "gm": 59.0
      },
      {
        "amt": 1.0,
        "desc": "slice, large",
        "gm": 88.0
      }
    ]
  },
  {
    "word": "TOASTMULTI",
    "display": "Toast Multi",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18036",
    "desc": "Bread, multi-grain, toasted (includes whole-grain)",
    "cal": 288.0,
    "pro": 14.5,
    "fat": 4.6,
    "carb": 47.1,
    "fib": 8.1,
    "h2o": 31.5,
    "sug": 6.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice regular",
        "gm": 24.0
      },
      {
        "amt": 1.0,
        "desc": "slice large",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "TORTILLACORN",
    "display": "Tortilla Corn",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18363",
    "desc": "Tortillas, ready-to-bake or -fry, corn",
    "cal": 218.0,
    "pro": 5.7,
    "fat": 2.9,
    "carb": 44.6,
    "fib": 6.3,
    "h2o": 45.9,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "enchilada",
        "gm": 19.0
      },
      {
        "amt": 1.0,
        "desc": "tortilla",
        "gm": 24.0
      }
    ]
  },
  {
    "word": "TORTILLAFLOUR",
    "display": "Tortilla Flour",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "18364",
    "desc": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
    "cal": 306.0,
    "pro": 8.2,
    "fat": 8.0,
    "carb": 49.4,
    "fib": 3.5,
    "h2o": 32.0,
    "sug": 3.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tortilla",
        "gm": 48.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "tortilla medium (approx 6\" dia)",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "package",
        "gm": 407.0
      },
      {
        "amt": 1.0,
        "desc": "tortilla (approx 10\" dia)",
        "gm": 72.0
      },
      {
        "amt": 1.0,
        "desc": "tortilla (approx 12\" dia)",
        "gm": 117.0
      },
      {
        "amt": 1.0,
        "desc": "tortilla (approx 7-8\" dia)",
        "gm": 49.0
      }
    ]
  },
  {
    "word": "TRICALE",
    "display": "Tricale",
    "groups": [
      "grain"
    ],
    "ndb": "20070",
    "desc": "Triticale flour, whole-grain",
    "cal": 338.0,
    "pro": 13.2,
    "fat": 1.8,
    "carb": 73.1,
    "fib": 14.6,
    "h2o": 10.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 130.0
      }
    ]
  },
  {
    "word": "WHEAT",
    "display": "Wheat",
    "groups": [
      "grain"
    ],
    "ndb": "20581",
    "desc": "Wheat flour, white, all-purpose, enriched, unbleached",
    "cal": 364.0,
    "pro": 10.3,
    "fat": 1.0,
    "carb": 76.3,
    "fib": 2.7,
    "h2o": 11.9,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 125.0
      }
    ]
  },
  {
    "word": "WHEATGERM",
    "display": "Wheat Germ",
    "groups": [
      "grain",
      "fats"
    ],
    "ndb": "4038",
    "desc": "Oil, wheat germ",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      }
    ]
  },
  {
    "word": "ZWIEBACK",
    "display": "Zwieback",
    "groups": [
      "grain",
      "prepared"
    ],
    "ndb": "3217",
    "desc": "Zwieback",
    "cal": 426.0,
    "pro": 10.1,
    "fat": 9.7,
    "carb": 74.2,
    "fib": 2.5,
    "h2o": 4.5,
    "sug": 12.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "rusk",
        "gm": 10.0
      },
      {
        "amt": 1.0,
        "desc": "toast, Gerber Zwieback",
        "gm": 7.0
      }
    ]
  },
  {
    "word": "ADZUKI",
    "display": "Adzuki",
    "groups": [
      "legume"
    ],
    "ndb": "16001",
    "desc": "Beans, adzuki, mature seeds, raw",
    "cal": 329.0,
    "pro": 19.9,
    "fat": 0.5,
    "carb": 62.9,
    "fib": 12.7,
    "h2o": 13.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 197.0
      }
    ]
  },
  {
    "word": "BEAN",
    "display": "Bean",
    "groups": [
      "legume",
      "protein"
    ],
    "ndb": "11053",
    "desc": "Beans, snap, green, cooked, boiled, drained, without salt",
    "cal": 35.0,
    "pro": 1.9,
    "fat": 0.3,
    "carb": 7.9,
    "fib": 3.2,
    "h2o": 89.2,
    "sug": 3.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 125.0
      }
    ]
  },
  {
    "word": "BLACKBEAN",
    "display": "Black Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16015",
    "desc": "Beans, black, mature seeds, cooked, boiled, without salt",
    "cal": 132.0,
    "pro": 8.9,
    "fat": 0.5,
    "carb": 23.7,
    "fib": 8.7,
    "h2o": 65.7,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 172.0
      }
    ]
  },
  {
    "word": "BLACKEYEPEA",
    "display": "Black-eyed Pea",
    "groups": [
      "legume"
    ],
    "ndb": "11192",
    "desc": "Cowpeas (blackeyes), immature seeds, cooked, boiled, drained, without salt",
    "cal": 97.0,
    "pro": 3.2,
    "fat": 0.4,
    "carb": 20.3,
    "fib": 5.0,
    "h2o": 75.5,
    "sug": 3.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 165.0
      }
    ]
  },
  {
    "word": "BROADBEAN",
    "display": "Broadbean",
    "groups": [
      "legume"
    ],
    "ndb": "16053",
    "desc": "Broadbeans (fava beans), mature seeds, cooked, boiled, without salt",
    "cal": 110.0,
    "pro": 7.6,
    "fat": 0.4,
    "carb": 19.6,
    "fib": 5.4,
    "h2o": 71.5,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "CHICKPEA",
    "display": "Chickpea",
    "groups": [
      "legume",
      "protein"
    ],
    "ndb": "16057",
    "desc": "Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt",
    "cal": 164.0,
    "pro": 8.9,
    "fat": 2.6,
    "carb": 27.4,
    "fib": 7.6,
    "h2o": 60.2,
    "sug": 4.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 164.0
      }
    ]
  },
  {
    "word": "COWPEA",
    "display": "Cowpea",
    "groups": [
      "legume"
    ],
    "ndb": "16063",
    "desc": "Cowpeas, common (blackeyes, crowder, southern), mature seeds, cooked, boiled, without salt",
    "cal": 116.0,
    "pro": 7.7,
    "fat": 0.5,
    "carb": 20.8,
    "fib": 6.5,
    "h2o": 70.0,
    "sug": 3.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 171.0
      }
    ]
  },
  {
    "word": "EDAMAME",
    "display": "Edamame",
    "groups": [
      "legume"
    ],
    "ndb": "11212",
    "desc": "Edamame, frozen, prepared",
    "cal": 121.0,
    "pro": 11.9,
    "fat": 5.2,
    "carb": 8.9,
    "fib": 5.2,
    "h2o": 72.8,
    "sug": 2.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "FAVABEAN",
    "display": "Fava Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16053",
    "desc": "Broadbeans (fava beans), mature seeds, cooked, boiled, without salt",
    "cal": 110.0,
    "pro": 7.6,
    "fat": 0.4,
    "carb": 19.6,
    "fib": 5.4,
    "h2o": 71.5,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "FRENCHBEAN",
    "display": "French Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16023",
    "desc": "Beans, french, mature seeds, cooked, boiled, without salt",
    "cal": 129.0,
    "pro": 7.0,
    "fat": 0.8,
    "carb": 24.0,
    "fib": 9.4,
    "h2o": 66.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 177.0
      }
    ]
  },
  {
    "word": "GREENBEAN",
    "display": "Green Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16023",
    "desc": "Beans, french, mature seeds, cooked, boiled, without salt",
    "cal": 129.0,
    "pro": 7.0,
    "fat": 0.8,
    "carb": 24.0,
    "fib": 9.4,
    "h2o": 66.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 177.0
      }
    ]
  },
  {
    "word": "HUMMUS",
    "display": "Hummus",
    "groups": [
      "legume"
    ],
    "ndb": "16158",
    "desc": "Hummus, commercial",
    "cal": 166.0,
    "pro": 7.9,
    "fat": 9.6,
    "carb": 14.3,
    "fib": 6.0,
    "h2o": 66.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 246.0
      }
    ]
  },
  {
    "word": "KIDNEYBEAN",
    "display": "Kidney Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16028",
    "desc": "Beans, kidney, all types, mature seeds, cooked, boiled, without salt",
    "cal": 127.0,
    "pro": 8.7,
    "fat": 0.5,
    "carb": 22.8,
    "fib": 6.4,
    "h2o": 66.9,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 177.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 11.0
      }
    ]
  },
  {
    "word": "LENTIL",
    "display": "Lentil",
    "groups": [
      "legume",
      "protein"
    ],
    "ndb": "16070",
    "desc": "Lentils, mature seeds, cooked, boiled, without salt",
    "cal": 116.0,
    "pro": 9.0,
    "fat": 0.4,
    "carb": 20.1,
    "fib": 7.9,
    "h2o": 69.6,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 198.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.3
      }
    ]
  },
  {
    "word": "LIMABEAN",
    "display": "Lima Bean",
    "groups": [
      "legume"
    ],
    "ndb": "11032",
    "desc": "Lima beans, immature seeds, cooked, boiled, drained, without salt",
    "cal": 123.0,
    "pro": 6.8,
    "fat": 0.3,
    "carb": 23.6,
    "fib": 5.4,
    "h2o": 67.2,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "LUPINS",
    "display": "Lupins",
    "groups": [
      "legume"
    ],
    "ndb": "16077",
    "desc": "Lupins, mature seeds, cooked, boiled, without salt",
    "cal": 119.0,
    "pro": 15.6,
    "fat": 2.9,
    "carb": 9.9,
    "fib": 2.8,
    "h2o": 71.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 166.0
      }
    ]
  },
  {
    "word": "MOTHBEAN",
    "display": "Mothbean",
    "groups": [
      "legume"
    ],
    "ndb": "16079",
    "desc": "Mothbeans, mature seeds, cooked, boiled, without salt",
    "cal": 117.0,
    "pro": 7.8,
    "fat": 0.6,
    "carb": 21.0,
    "fib": 0.0,
    "h2o": 69.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 177.0
      }
    ]
  },
  {
    "word": "MUNGBEAN",
    "display": "Mungbean",
    "groups": [
      "legume"
    ],
    "ndb": "11044",
    "desc": "Mung beans, mature seeds, sprouted, cooked, boiled, drained, without salt",
    "cal": 21.0,
    "pro": 2.0,
    "fat": 0.1,
    "carb": 4.2,
    "fib": 0.8,
    "h2o": 93.4,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 124.0
      }
    ]
  },
  {
    "word": "MUNGO",
    "display": "Mungo",
    "groups": [
      "legume"
    ],
    "ndb": "16084",
    "desc": "Mungo beans, mature seeds, cooked, boiled, without salt",
    "cal": 105.0,
    "pro": 7.5,
    "fat": 0.6,
    "carb": 18.3,
    "fib": 6.4,
    "h2o": 72.5,
    "sug": 2.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "oz dry, yield after cooking",
        "gm": 69.0
      }
    ]
  },
  {
    "word": "NATTO",
    "display": "Natto",
    "groups": [
      "legume"
    ],
    "ndb": "16113",
    "desc": "Natto",
    "cal": 211.0,
    "pro": 19.4,
    "fat": 11.0,
    "carb": 12.7,
    "fib": 5.4,
    "h2o": 55.0,
    "sug": 4.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 175.0
      }
    ]
  },
  {
    "word": "NAVYBEAN",
    "display": "Navy Bean",
    "groups": [
      "legume"
    ],
    "ndb": "11047",
    "desc": "Beans, navy, mature seeds, sprouted, cooked, boiled, drained, without salt",
    "cal": 78.0,
    "pro": 7.1,
    "fat": 0.8,
    "carb": 15.0,
    "fib": 0.0,
    "h2o": 76.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "NORTHERNBEAN",
    "display": "Northern Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16025",
    "desc": "Beans, great northern, mature seeds, cooked, boiled, without salt",
    "cal": 118.0,
    "pro": 8.3,
    "fat": 0.5,
    "carb": 21.1,
    "fib": 7.0,
    "h2o": 69.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 177.0
      }
    ]
  },
  {
    "word": "OKARA",
    "display": "Okara",
    "groups": [
      "legume"
    ],
    "ndb": "16130",
    "desc": "Okara",
    "cal": 76.0,
    "pro": 3.5,
    "fat": 1.7,
    "carb": 12.2,
    "fib": 0.0,
    "h2o": 81.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 122.0
      }
    ]
  },
  {
    "word": "PEANUT",
    "display": "Peanut",
    "groups": [
      "legume",
      "nuts",
      "fats"
    ],
    "ndb": "16390",
    "desc": "Peanuts, all types, dry-roasted, without salt",
    "cal": 587.0,
    "pro": 24.4,
    "fat": 49.7,
    "carb": 21.3,
    "fib": 8.4,
    "h2o": 1.8,
    "sug": 4.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 146.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "peanut",
        "gm": 1.0
      }
    ]
  },
  {
    "word": "PEANUTBUTTER",
    "display": "Peanut Butter",
    "groups": [
      "legume",
      "nuts",
      "fats"
    ],
    "ndb": "16098",
    "desc": "Peanut butter, smooth style, with salt",
    "cal": 598.0,
    "pro": 22.2,
    "fat": 51.4,
    "carb": 22.3,
    "fib": 5.0,
    "h2o": 1.2,
    "sug": 10.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 32.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 258.0
      }
    ]
  },
  {
    "word": "PEAS",
    "display": "Peas",
    "groups": [
      "legume"
    ],
    "ndb": "11313",
    "desc": "Peas, green, frozen, cooked, boiled, drained, without salt",
    "cal": 78.0,
    "pro": 5.2,
    "fat": 0.3,
    "carb": 14.3,
    "fib": 4.5,
    "h2o": 79.5,
    "sug": 4.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 80.0
      },
      {
        "amt": 1.0,
        "desc": "package (10 oz) yields",
        "gm": 253.0
      }
    ]
  },
  {
    "word": "PIGEONPEAS",
    "display": "Pigeonpeas",
    "groups": [
      "legume"
    ],
    "ndb": "11345",
    "desc": "Pigeonpeas, immature seeds, cooked, boiled, drained, without salt",
    "cal": 111.0,
    "pro": 6.0,
    "fat": 1.4,
    "carb": 19.5,
    "fib": 4.2,
    "h2o": 71.8,
    "sug": 2.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 153.0
      }
    ]
  },
  {
    "word": "PINTOBEAN",
    "display": "Pinto Bean",
    "groups": [
      "legume"
    ],
    "ndb": "11654",
    "desc": "Beans, pinto, mature seeds, sprouted, cooked, boiled, drained, without salt",
    "cal": 22.0,
    "pro": 1.9,
    "fat": 0.3,
    "carb": 4.1,
    "fib": 0.0,
    "h2o": 93.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "REDBEAN",
    "display": "Red Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16033",
    "desc": "Beans, kidney, red, mature seeds, cooked, boiled, without salt",
    "cal": 127.0,
    "pro": 8.7,
    "fat": 0.5,
    "carb": 22.8,
    "fib": 7.4,
    "h2o": 66.9,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 177.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 11.0
      }
    ]
  },
  {
    "word": "REFRIEDBEAN",
    "display": "Refried Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16403",
    "desc": "Refried beans, canned, traditional, reduced sodium",
    "cal": 89.0,
    "pro": 5.0,
    "fat": 2.0,
    "carb": 13.6,
    "fib": 3.7,
    "h2o": 77.8,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 238.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "SHELLIEBEAN",
    "display": "Shellie Bean",
    "groups": [
      "legume"
    ],
    "ndb": "11050",
    "desc": "Beans, shellie, canned, solids and liquids",
    "cal": 30.0,
    "pro": 1.8,
    "fat": 0.2,
    "carb": 6.2,
    "fib": 3.4,
    "h2o": 90.7,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "SOYBEAN",
    "display": "Soybean",
    "groups": [
      "legume",
      "protein",
      "fats"
    ],
    "ndb": "11451",
    "desc": "Soybeans, green, cooked, boiled, drained, without salt",
    "cal": 141.0,
    "pro": 12.3,
    "fat": 6.4,
    "carb": 11.1,
    "fib": 4.2,
    "h2o": 68.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "SOYMILK",
    "display": "Soy Milk",
    "groups": [
      "legume",
      "beverage"
    ],
    "ndb": "16120",
    "desc": "Soymilk, original and vanilla, unfortified",
    "cal": 54.0,
    "pro": 3.3,
    "fat": 1.8,
    "carb": 6.3,
    "fib": 0.6,
    "h2o": 88.0,
    "sug": 4.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 243.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.6
      }
    ]
  },
  {
    "word": "SOYNUT",
    "display": "Soynut",
    "groups": [
      "legume",
      "nuts"
    ],
    "ndb": "11451",
    "desc": "Soybeans, green, cooked, boiled, drained, without salt",
    "cal": 141.0,
    "pro": 12.3,
    "fat": 6.4,
    "carb": 11.1,
    "fib": 4.2,
    "h2o": 68.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "SPLITPEA",
    "display": "Split Pea",
    "groups": [
      "legume"
    ],
    "ndb": "16086",
    "desc": "Peas, split, mature seeds, cooked, boiled, without salt",
    "cal": 118.0,
    "pro": 8.3,
    "fat": 0.4,
    "carb": 21.1,
    "fib": 8.3,
    "h2o": 69.5,
    "sug": 2.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 196.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.2
      }
    ]
  },
  {
    "word": "TURTLEBEANS",
    "display": "Turtle Beans",
    "groups": [
      "legume"
    ],
    "ndb": "16017",
    "desc": "Beans, black turtle, mature seeds, cooked, boiled, without salt",
    "cal": 130.0,
    "pro": 8.2,
    "fat": 0.3,
    "carb": 24.4,
    "fib": 8.3,
    "h2o": 65.7,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 185.0
      }
    ]
  },
  {
    "word": "WHITEBEAN",
    "display": "White Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16050",
    "desc": "Beans, white, mature seeds, cooked, boiled, without salt",
    "cal": 139.0,
    "pro": 9.7,
    "fat": 0.3,
    "carb": 25.1,
    "fib": 6.3,
    "h2o": 63.1,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 179.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 11.2
      }
    ]
  },
  {
    "word": "WINGEDBEAN",
    "display": "Winged Bean",
    "groups": [
      "legume"
    ],
    "ndb": "16136",
    "desc": "Winged beans, mature seeds, cooked, boiled, without salt",
    "cal": 147.0,
    "pro": 10.6,
    "fat": 5.8,
    "carb": 14.9,
    "fib": 0.0,
    "h2o": 67.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 172.0
      }
    ]
  },
  {
    "word": "ACORN",
    "display": "Acorn",
    "groups": [
      "nuts"
    ],
    "ndb": "12059",
    "desc": "Nuts, acorns, dried",
    "cal": 509.0,
    "pro": 8.1,
    "fat": 31.4,
    "carb": 53.7,
    "fib": 0.0,
    "h2o": 5.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "ACORNFLOUR",
    "display": "Acorn Flour",
    "groups": [
      "nuts"
    ],
    "ndb": "12060",
    "desc": "Nuts, acorn flour, full fat",
    "cal": 501.0,
    "pro": 7.5,
    "fat": 30.2,
    "carb": 54.6,
    "fib": 0.0,
    "h2o": 6.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "ALMOND",
    "display": "Almond",
    "groups": [
      "nuts",
      "fats",
      "protein"
    ],
    "ndb": "4529",
    "desc": "Oil, almond",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "ALMONDBUTTER",
    "display": "Almond Butter",
    "groups": [
      "nuts",
      "fats",
      "protein"
    ],
    "ndb": "12195",
    "desc": "Nuts, almond butter, plain, without salt added",
    "cal": 614.0,
    "pro": 21.0,
    "fat": 55.5,
    "carb": 18.8,
    "fib": 10.3,
    "h2o": 1.6,
    "sug": 4.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 250.0
      }
    ]
  },
  {
    "word": "BEECHNUT",
    "display": "Beechnut",
    "groups": [
      "nuts"
    ],
    "ndb": "12077",
    "desc": "Nuts, beechnuts, dried",
    "cal": 576.0,
    "pro": 6.2,
    "fat": 50.0,
    "carb": 33.5,
    "fib": 0.0,
    "h2o": 6.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CAROB",
    "display": "Carob",
    "groups": [
      "nuts"
    ],
    "ndb": "16055",
    "desc": "Carob flour",
    "cal": 222.0,
    "pro": 4.6,
    "fat": 0.7,
    "carb": 88.9,
    "fib": 39.8,
    "h2o": 3.6,
    "sug": 49.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 103.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.0
      }
    ]
  },
  {
    "word": "CASHEW",
    "display": "Cashew",
    "groups": [
      "nuts"
    ],
    "ndb": "12085",
    "desc": "Nuts, cashew nuts, dry roasted, without salt added",
    "cal": 574.0,
    "pro": 15.3,
    "fat": 46.4,
    "carb": 32.7,
    "fib": 3.0,
    "h2o": 1.7,
    "sug": 5.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, halves and whole",
        "gm": 137.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.6
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CASHEWBUTTER",
    "display": "Cashew Butter",
    "groups": [
      "nuts"
    ],
    "ndb": "12088",
    "desc": "Nuts, cashew butter, plain, without salt added",
    "cal": 587.0,
    "pro": 17.6,
    "fat": 49.4,
    "carb": 27.6,
    "fib": 2.0,
    "h2o": 3.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CELERYSEED",
    "display": "Celery Seed",
    "groups": [
      "nuts"
    ],
    "ndb": "2007",
    "desc": "Spices, celery seed",
    "cal": 392.0,
    "pro": 18.1,
    "fat": 25.3,
    "carb": 41.4,
    "fib": 11.8,
    "h2o": 6.0,
    "sug": 0.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.5
      }
    ]
  },
  {
    "word": "CHESTNUT",
    "display": "Chestnut",
    "groups": [
      "nuts"
    ],
    "ndb": "12096",
    "desc": "Nuts, chestnuts, chinese, roasted",
    "cal": 239.0,
    "pro": 4.5,
    "fat": 1.2,
    "carb": 52.4,
    "fib": 0.0,
    "h2o": 40.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CHIA",
    "display": "Chia",
    "groups": [
      "nuts"
    ],
    "ndb": "12006",
    "desc": "Seeds, chia seeds, dried",
    "cal": 486.0,
    "pro": 16.5,
    "fat": 30.7,
    "carb": 42.1,
    "fib": 34.4,
    "h2o": 5.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "FENGUGREEK",
    "display": "Fengugreek",
    "groups": [
      "nuts"
    ],
    "ndb": "2019",
    "desc": "Spices, fenugreek seed",
    "cal": 323.0,
    "pro": 23.0,
    "fat": 6.4,
    "carb": 58.4,
    "fib": 24.6,
    "h2o": 8.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 3.7
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 11.1
      }
    ]
  },
  {
    "word": "FILBERT",
    "display": "Filbert",
    "groups": [
      "nuts"
    ],
    "ndb": "12120",
    "desc": "Nuts, hazelnuts or filberts",
    "cal": 628.0,
    "pro": 14.9,
    "fat": 60.8,
    "carb": 16.7,
    "fib": 9.7,
    "h2o": 5.3,
    "sug": 4.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 115.0
      },
      {
        "amt": 1.0,
        "desc": "cup, ground",
        "gm": 75.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whole",
        "gm": 135.0
      },
      {
        "amt": 1.0,
        "desc": "oz (21 whole kernels)",
        "gm": 28.35
      },
      {
        "amt": 10.0,
        "desc": "nuts",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "FLAXSEED",
    "display": "Flaxseed",
    "groups": [
      "nuts"
    ],
    "ndb": "12220",
    "desc": "Seeds, flaxseed",
    "cal": 534.0,
    "pro": 18.3,
    "fat": 42.2,
    "carb": 28.9,
    "fib": 27.3,
    "h2o": 7.0,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp, whole",
        "gm": 10.3
      },
      {
        "amt": 1.0,
        "desc": "cup, whole",
        "gm": 168.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp, ground",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, whole",
        "gm": 3.4
      },
      {
        "amt": 1.0,
        "desc": "tsp, ground",
        "gm": 2.5
      }
    ]
  },
  {
    "word": "GINKGO",
    "display": "Ginkgo",
    "groups": [
      "nuts"
    ],
    "ndb": "12127",
    "desc": "Nuts, ginkgo nuts, raw",
    "cal": 182.0,
    "pro": 4.3,
    "fat": 1.7,
    "carb": 37.6,
    "fib": 0.0,
    "h2o": 55.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "HAZELNUT",
    "display": "Hazelnut",
    "groups": [
      "nuts"
    ],
    "ndb": "12120",
    "desc": "Nuts, hazelnuts or filberts",
    "cal": 628.0,
    "pro": 14.9,
    "fat": 60.8,
    "carb": 16.7,
    "fib": 9.7,
    "h2o": 5.3,
    "sug": 4.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 115.0
      },
      {
        "amt": 1.0,
        "desc": "cup, ground",
        "gm": 75.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whole",
        "gm": 135.0
      },
      {
        "amt": 1.0,
        "desc": "oz (21 whole kernels)",
        "gm": 28.35
      },
      {
        "amt": 10.0,
        "desc": "nuts",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "HEMP",
    "display": "Hemp",
    "groups": [
      "nuts"
    ],
    "ndb": "12012",
    "desc": "Seeds, hemp seed, hulled",
    "cal": 553.0,
    "pro": 31.6,
    "fat": 48.8,
    "carb": 8.7,
    "fib": 4.0,
    "h2o": 5.0,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "tbsp",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "HICKORYNUT",
    "display": "Hickory Nut",
    "groups": [
      "nuts"
    ],
    "ndb": "12130",
    "desc": "Nuts, hickorynuts, dried",
    "cal": 657.0,
    "pro": 12.7,
    "fat": 64.4,
    "carb": 18.2,
    "fib": 6.4,
    "h2o": 2.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "nut",
        "gm": 3.0
      }
    ]
  },
  {
    "word": "MACADAMIA",
    "display": "Macadamia",
    "groups": [
      "nuts"
    ],
    "ndb": "12632",
    "desc": "Nuts, macadamia nuts, dry roasted, with salt added",
    "cal": 716.0,
    "pro": 7.8,
    "fat": 76.1,
    "carb": 12.8,
    "fib": 8.0,
    "h2o": 1.6,
    "sug": 4.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, whole or halves",
        "gm": 132.0
      },
      {
        "amt": 1.0,
        "desc": "oz (10-12 kernels)",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "MOUSENUT",
    "display": "Mousenut",
    "groups": [
      "nuts"
    ],
    "ndb": "12004",
    "desc": "Seeds, breadnut tree seeds, raw",
    "cal": 217.0,
    "pro": 6.0,
    "fat": 1.0,
    "carb": 46.3,
    "fib": 0.0,
    "h2o": 45.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz (8-14 seeds)",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "PECAN",
    "display": "Pecan",
    "groups": [
      "nuts"
    ],
    "ndb": "12142",
    "desc": "Nuts, pecans",
    "cal": 691.0,
    "pro": 9.2,
    "fat": 72.0,
    "carb": 13.9,
    "fib": 9.6,
    "h2o": 3.5,
    "sug": 4.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 109.0
      },
      {
        "amt": 1.0,
        "desc": "cup, halves",
        "gm": 99.0
      },
      {
        "amt": 1.0,
        "desc": "oz (19 halves)",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "PILINUT",
    "display": "Pilinut",
    "groups": [
      "nuts"
    ],
    "ndb": "12145",
    "desc": "Nuts, pilinuts, dried",
    "cal": 719.0,
    "pro": 10.8,
    "fat": 79.5,
    "carb": 4.0,
    "fib": 0.0,
    "h2o": 2.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "oz (15 kernels)",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "PINE",
    "display": "Pine",
    "groups": [
      "nuts"
    ],
    "ndb": "12149",
    "desc": "Nuts, pine nuts, pinyon, dried",
    "cal": 629.0,
    "pro": 11.6,
    "fat": 61.0,
    "carb": 19.3,
    "fib": 10.7,
    "h2o": 5.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 10.0,
        "desc": "nuts",
        "gm": 1.0
      }
    ]
  },
  {
    "word": "PINON",
    "display": "Pinon",
    "groups": [
      "nuts"
    ],
    "ndb": "35207",
    "desc": "Pinon Nuts, roasted (Navajo)",
    "cal": 541.0,
    "pro": 7.4,
    "fat": 34.1,
    "carb": 51.1,
    "fib": 43.4,
    "h2o": 5.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "PISTACHIO",
    "display": "Pistachio",
    "groups": [
      "nuts"
    ],
    "ndb": "12152",
    "desc": "Nuts, pistachio nuts, dry roasted, without salt added",
    "cal": 572.0,
    "pro": 21.1,
    "fat": 45.8,
    "carb": 28.3,
    "fib": 10.3,
    "h2o": 1.9,
    "sug": 7.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 123.0
      },
      {
        "amt": 1.0,
        "desc": "oz (49 kernels)",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "kernel",
        "gm": 0.7
      }
    ]
  },
  {
    "word": "POPPYSEED",
    "display": "Poppyseed",
    "groups": [
      "nuts",
      "fats"
    ],
    "ndb": "2033",
    "desc": "Spices, poppy seed",
    "cal": 525.0,
    "pro": 18.0,
    "fat": 41.6,
    "carb": 28.1,
    "fib": 19.5,
    "h2o": 6.0,
    "sug": 3.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.8
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.8
      }
    ]
  },
  {
    "word": "SAFFLOWER",
    "display": "Safflower",
    "groups": [
      "nuts",
      "fats"
    ],
    "ndb": "4510",
    "desc": "Oil, safflower, salad or cooking, linoleic, (over 70%)",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "SESAME",
    "display": "Sesame",
    "groups": [
      "nuts"
    ],
    "ndb": "12024",
    "desc": "Seeds, sesame seeds, whole, roasted and toasted",
    "cal": 565.0,
    "pro": 17.0,
    "fat": 48.0,
    "carb": 25.7,
    "fib": 14.0,
    "h2o": 3.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "SESAMEBUTTER",
    "display": "Sesame Butter",
    "groups": [
      "nuts",
      "spice"
    ],
    "ndb": "12166",
    "desc": "Seeds, sesame butter, tahini, from roasted and toasted kernels (most common type)",
    "cal": 595.0,
    "pro": 17.0,
    "fat": 53.8,
    "carb": 21.2,
    "fib": 9.3,
    "h2o": 3.0,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "SESAMEFLOUR",
    "display": "Sesame Flour",
    "groups": [
      "nuts"
    ],
    "ndb": "12032",
    "desc": "Seeds, sesame flour, partially defatted",
    "cal": 382.0,
    "pro": 40.3,
    "fat": 11.9,
    "carb": 35.1,
    "fib": 0.0,
    "h2o": 6.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "SUNFLOWER",
    "display": "Sunflower",
    "groups": [
      "nuts",
      "fats"
    ],
    "ndb": "4060",
    "desc": "Oil, sunflower, linoleic (less than 60%)",
    "cal": 884.0,
    "pro": 0.0,
    "fat": 100.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.6
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 218.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.5
      }
    ]
  },
  {
    "word": "WALNUT",
    "display": "Walnut",
    "groups": [
      "nuts",
      "fats"
    ],
    "ndb": "12157",
    "desc": "Nuts, walnuts, dry roasted, with salt added",
    "cal": 643.0,
    "pro": 14.3,
    "fat": 60.7,
    "carb": 17.9,
    "fib": 7.1,
    "h2o": 4.4,
    "sug": 3.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "ACORNSTEW",
    "display": "Acorn Stew",
    "groups": [
      "prepared"
    ],
    "ndb": "35182",
    "desc": "Acorn stew (Apache)",
    "cal": 95.0,
    "pro": 6.8,
    "fat": 3.5,
    "carb": 9.2,
    "fib": 0.7,
    "h2o": 79.8,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "ANGLEFOOD",
    "display": "Angel Food",
    "groups": [
      "prepared"
    ],
    "ndb": "18087",
    "desc": "Cake, angelfood, dry mix",
    "cal": 366.0,
    "pro": 6.4,
    "fat": 0.3,
    "carb": 86.1,
    "fib": 0.5,
    "h2o": 3.7,
    "sug": 61.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 38.0
      },
      {
        "amt": 1.0,
        "desc": "package (14.5 oz)",
        "gm": 411.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "APPLEPIE",
    "display": "Apple Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18302",
    "desc": "Pie, apple, prepared from recipe",
    "cal": 265.0,
    "pro": 2.4,
    "fat": 12.5,
    "carb": 37.1,
    "fib": 0.0,
    "h2o": 47.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "APPLESAUCE",
    "display": "Applesauce",
    "groups": [
      "prepared"
    ],
    "ndb": "9019",
    "desc": "Applesauce, canned, unsweetened, without added ascorbic acid (includes USDA commodity)",
    "cal": 42.0,
    "pro": 0.2,
    "fat": 0.1,
    "carb": 11.3,
    "fib": 1.1,
    "h2o": 88.2,
    "sug": 9.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 244.0
      }
    ]
  },
  {
    "word": "APPLESTRUDEL",
    "display": "Apple Strudel",
    "groups": [
      "prepared"
    ],
    "ndb": "18354",
    "desc": "Strudel, apple",
    "cal": 274.0,
    "pro": 3.3,
    "fat": 11.2,
    "carb": 41.1,
    "fib": 2.2,
    "h2o": 43.5,
    "sug": 25.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 71.0
      }
    ]
  },
  {
    "word": "BAKEDBEANS",
    "display": "Baked Beans",
    "groups": [
      "prepared"
    ],
    "ndb": "16006",
    "desc": "Beans, baked, canned, plain or vegetarian",
    "cal": 94.0,
    "pro": 4.8,
    "fat": 0.4,
    "carb": 21.1,
    "fib": 4.1,
    "h2o": 72.0,
    "sug": 8.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 254.0
      }
    ]
  },
  {
    "word": "BANANAPIE",
    "display": "Banana Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18304",
    "desc": "Pie, banana cream, prepared from recipe",
    "cal": 269.0,
    "pro": 4.4,
    "fat": 13.6,
    "carb": 32.9,
    "fib": 0.7,
    "h2o": 47.9,
    "sug": 12.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "pie (9\" dia)",
        "gm": 1186.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 144.0
      }
    ]
  },
  {
    "word": "BEEFALO",
    "display": "Beefalo",
    "groups": [
      "prepared"
    ],
    "ndb": "17152",
    "desc": "Game meat, beefalo, composite of cuts, raw",
    "cal": 143.0,
    "pro": 23.3,
    "fat": 4.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "BISCUIT",
    "display": "Biscuit",
    "groups": [
      "prepared"
    ],
    "ndb": "18015",
    "desc": "Biscuits, plain or buttermilk, refrigerated dough, higher fat, baked",
    "cal": 324.0,
    "pro": 6.8,
    "fat": 11.2,
    "carb": 49.0,
    "fib": 2.8,
    "h2o": 29.7,
    "sug": 8.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "biscuit",
        "gm": 51.0
      },
      {
        "amt": 1.0,
        "desc": "biscuit (2-1/2\" dia)",
        "gm": 27.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "BLUEBERRYPIE",
    "display": "Blueberry Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18306",
    "desc": "Pie, blueberry, prepared from recipe",
    "cal": 245.0,
    "pro": 2.7,
    "fat": 11.9,
    "carb": 33.5,
    "fib": 0.0,
    "h2o": 51.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 147.0
      }
    ]
  },
  {
    "word": "BLUECORN",
    "display": "Blue Corn",
    "groups": [
      "prepared"
    ],
    "ndb": "35130",
    "desc": "Mush, blue corn with ash (Navajo)",
    "cal": 54.0,
    "pro": 0.7,
    "fat": 0.5,
    "carb": 11.7,
    "fib": 1.1,
    "h2o": 86.7,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "BREADRYE",
    "display": "Bread Rye",
    "groups": [
      "prepared"
    ],
    "ndb": "18060",
    "desc": "Bread, rye",
    "cal": 259.0,
    "pro": 8.5,
    "fat": 3.3,
    "carb": 48.3,
    "fib": 5.8,
    "h2o": 37.3,
    "sug": 3.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice, regular",
        "gm": 32.0
      },
      {
        "amt": 1.0,
        "desc": "slice, snack-size",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thin",
        "gm": 25.0
      }
    ]
  },
  {
    "word": "BREADWHITE",
    "display": "Bread White",
    "groups": [
      "prepared"
    ],
    "ndb": "18967",
    "desc": "Bread, white wheat",
    "cal": 238.0,
    "pro": 10.7,
    "fat": 2.1,
    "carb": 43.9,
    "fib": 9.2,
    "h2o": 39.6,
    "sug": 5.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "BREADWHOLE",
    "display": "Bread Whole Wheat",
    "groups": [
      "prepared"
    ],
    "ndb": "18075",
    "desc": "Bread, whole-wheat, commercially prepared",
    "cal": 252.0,
    "pro": 12.4,
    "fat": 3.5,
    "carb": 42.7,
    "fib": 6.0,
    "h2o": 39.0,
    "sug": 4.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 32.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "BURGER",
    "display": "Burger",
    "groups": [
      "prepared"
    ],
    "ndb": "21141",
    "desc": "BURGER KING, Vanilla Shake",
    "cal": 168.0,
    "pro": 3.2,
    "fat": 8.7,
    "carb": 19.0,
    "fib": 0.0,
    "h2o": 68.1,
    "sug": 11.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 24.8
      },
      {
        "amt": 1.0,
        "desc": "small 12 fl oz",
        "gm": 298.0
      },
      {
        "amt": 1.0,
        "desc": "medium 16 fl oz",
        "gm": 397.0
      }
    ]
  },
  {
    "word": "BURRITO",
    "display": "Burrito",
    "groups": [
      "prepared"
    ],
    "ndb": "22928",
    "desc": "Burrito, beef and bean, microwaved",
    "cal": 298.0,
    "pro": 8.7,
    "fat": 11.9,
    "carb": 39.0,
    "fib": 6.9,
    "h2o": 38.1,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "burrito cooked",
        "gm": 116.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "BUTTERSCOTCH",
    "display": "Butterscotch",
    "groups": [
      "prepared"
    ],
    "ndb": "19364",
    "desc": "Toppings, butterscotch or caramel",
    "cal": 216.0,
    "pro": 1.2,
    "fat": 0.0,
    "carb": 57.0,
    "fib": 0.0,
    "h2o": 40.6,
    "sug": 57.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 41.0
      }
    ]
  },
  {
    "word": "CAKEWHITE",
    "display": "Cake White",
    "groups": [
      "prepared"
    ],
    "ndb": "18139",
    "desc": "Cake, white, prepared from recipe without frosting",
    "cal": 357.0,
    "pro": 5.4,
    "fat": 12.4,
    "carb": 57.2,
    "fib": 0.8,
    "h2o": 23.3,
    "sug": 35.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/12 of 9\" dia)",
        "gm": 74.0
      },
      {
        "amt": 1.0,
        "desc": "cake, 2-layer (8\" or 9\" dia)",
        "gm": 887.0
      }
    ]
  },
  {
    "word": "CAKEYELLOW",
    "display": "Cake Yellow",
    "groups": [
      "prepared"
    ],
    "ndb": "18141",
    "desc": "Cake, yellow, commercially prepared, with vanilla frosting",
    "cal": 391.0,
    "pro": 3.0,
    "fat": 17.9,
    "carb": 56.2,
    "fib": 0.3,
    "h2o": 22.1,
    "sug": 41.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 67.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CARAMEL",
    "display": "Caramel",
    "groups": [
      "prepared"
    ],
    "ndb": "19074",
    "desc": "Candies, caramels",
    "cal": 382.0,
    "pro": 4.6,
    "fat": 8.1,
    "carb": 77.0,
    "fib": 0.0,
    "h2o": 8.5,
    "sug": 65.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "package (2.5 oz)",
        "gm": 71.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 10.1
      }
    ]
  },
  {
    "word": "CHEESEBURGER",
    "display": "Cheeseburger",
    "groups": [
      "prepared"
    ],
    "ndb": "21091",
    "desc": "Fast foods, cheeseburger; single, regular patty, with condiments and vegetables",
    "cal": 254.0,
    "pro": 13.1,
    "fat": 11.5,
    "carb": 25.0,
    "fib": 1.4,
    "h2o": 48.1,
    "sug": 5.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sandwich",
        "gm": 115.0
      }
    ]
  },
  {
    "word": "CHEESECAKE",
    "display": "Cheesecake",
    "groups": [
      "prepared"
    ],
    "ndb": "18147",
    "desc": "Cheesecake commercially prepared",
    "cal": 321.0,
    "pro": 5.5,
    "fat": 22.5,
    "carb": 25.5,
    "fib": 0.4,
    "h2o": 45.6,
    "sug": 21.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/6 of 17 oz cake)",
        "gm": 80.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1 NLEA serving)",
        "gm": 125.0
      }
    ]
  },
  {
    "word": "CHERRYFRIEDPIE",
    "display": "Cherry Fried Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18444",
    "desc": "Pie, fried pies, cherry",
    "cal": 316.0,
    "pro": 3.0,
    "fat": 16.1,
    "carb": 42.6,
    "fib": 2.6,
    "h2o": 37.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "pie (5\" x 3-3/4\")",
        "gm": 128.0
      }
    ]
  },
  {
    "word": "CHERRYPIE",
    "display": "Cherry Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18309",
    "desc": "Pie, cherry, prepared from recipe",
    "cal": 270.0,
    "pro": 2.8,
    "fat": 12.2,
    "carb": 38.5,
    "fib": 0.0,
    "h2o": 45.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "CHILI",
    "display": "Chili",
    "groups": [
      "prepared",
      "protein"
    ],
    "ndb": "22911",
    "desc": "Chili, no beans, canned entree",
    "cal": 118.0,
    "pro": 7.5,
    "fat": 7.1,
    "carb": 6.1,
    "fib": 0.5,
    "h2o": 77.7,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "CHILIBEANS",
    "display": "Chili Beans",
    "groups": [
      "prepared",
      "protein"
    ],
    "ndb": "16059",
    "desc": "Chili with beans, canned",
    "cal": 103.0,
    "pro": 6.1,
    "fat": 3.8,
    "carb": 13.2,
    "fib": 3.3,
    "h2o": 75.5,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 256.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "CHILIDOG",
    "display": "Chili Dog",
    "groups": [
      "prepared"
    ],
    "ndb": "21119",
    "desc": "Fast foods, hotdog, with chili",
    "cal": 260.0,
    "pro": 11.8,
    "fat": 11.8,
    "carb": 27.4,
    "fib": 0.0,
    "h2o": 47.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sandwich",
        "gm": 114.0
      }
    ]
  },
  {
    "word": "CHOCOLATECAKE",
    "display": "Chocolate Cake",
    "groups": [
      "prepared"
    ],
    "ndb": "18101",
    "desc": "Cake, chocolate, prepared from recipe without frosting",
    "cal": 371.0,
    "pro": 5.3,
    "fat": 15.1,
    "carb": 53.4,
    "fib": 1.6,
    "h2o": 24.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/12 of 9\" dia)",
        "gm": 95.0
      },
      {
        "amt": 1.0,
        "desc": "cake, 2-layer (8\" or 9\" dia)",
        "gm": 1137.0
      }
    ]
  },
  {
    "word": "CHOCOLATEPIE",
    "display": "Chocolate Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18310",
    "desc": "Pie, chocolate creme, commercially prepared",
    "cal": 353.0,
    "pro": 4.2,
    "fat": 22.4,
    "carb": 38.4,
    "fib": 0.8,
    "h2o": 33.9,
    "sug": 27.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving .167 pie",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/4 of 6\" pie)",
        "gm": 99.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/6 of 8\" pie)",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "CINNAMONROLL",
    "display": "Cinnamon Roll",
    "groups": [
      "prepared"
    ],
    "ndb": "18358",
    "desc": "Sweet rolls, cinnamon, refrigerated dough with frosting, baked",
    "cal": 362.0,
    "pro": 5.4,
    "fat": 13.2,
    "carb": 56.1,
    "fib": 0.0,
    "h2o": 22.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "roll",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "CLUBSANDWICH",
    "display": "Club Sandwich",
    "groups": [
      "prepared"
    ],
    "ndb": "21152",
    "desc": "SUBWAY, SUBWAY CLUB sub on white bread with lettuce and tomato",
    "cal": 146.0,
    "pro": 10.7,
    "fat": 2.4,
    "carb": 20.4,
    "fib": 1.4,
    "h2o": 64.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 6.0,
        "desc": "inch sub",
        "gm": 207.0
      },
      {
        "amt": 12.0,
        "desc": "inch sub",
        "gm": 413.0
      }
    ]
  },
  {
    "word": "COCONUTPIE",
    "display": "Coconut Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18313",
    "desc": "Pie, coconut creme, commercially prepared",
    "cal": 298.0,
    "pro": 2.1,
    "fat": 16.6,
    "carb": 37.3,
    "fib": 1.3,
    "h2o": 43.2,
    "sug": 18.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/6 of 7\" pie)",
        "gm": 64.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 7\" pie)",
        "gm": 48.0
      }
    ]
  },
  {
    "word": "COFFEECAKE",
    "display": "Coffee Cake",
    "groups": [
      "prepared"
    ],
    "ndb": "18103",
    "desc": "Coffeecake, cheese",
    "cal": 339.0,
    "pro": 7.0,
    "fat": 15.2,
    "carb": 44.3,
    "fib": 1.0,
    "h2o": 32.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/6 of 16 oz cake)",
        "gm": 76.0
      }
    ]
  },
  {
    "word": "CORNBREAD",
    "display": "Cornbread",
    "groups": [
      "prepared"
    ],
    "ndb": "18024",
    "desc": "Bread, cornbread, prepared from recipe, made with low fat (2%) milk",
    "cal": 266.0,
    "pro": 6.7,
    "fat": 7.1,
    "carb": 43.5,
    "fib": 0.0,
    "h2o": 39.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 65.0
      }
    ]
  },
  {
    "word": "CORNDOG",
    "display": "Corn Dog",
    "groups": [
      "prepared"
    ],
    "ndb": "21120",
    "desc": "Fast foods, hotdog, with corn flour coating (corndog)",
    "cal": 263.0,
    "pro": 9.6,
    "fat": 10.8,
    "carb": 31.9,
    "fib": 0.0,
    "h2o": 46.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sandwich",
        "gm": 175.0
      }
    ]
  },
  {
    "word": "CROISSANT",
    "display": "Croissant",
    "groups": [
      "prepared"
    ],
    "ndb": "18239",
    "desc": "Croissants, butter",
    "cal": 406.0,
    "pro": 8.2,
    "fat": 21.0,
    "carb": 45.8,
    "fib": 2.6,
    "h2o": 23.2,
    "sug": 11.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "croissant, mini",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "croissant, small",
        "gm": 42.0
      },
      {
        "amt": 1.0,
        "desc": "croissant, medium",
        "gm": 57.0
      },
      {
        "amt": 1.0,
        "desc": "croissant, large",
        "gm": 67.0
      }
    ]
  },
  {
    "word": "CUSTARD",
    "display": "Custard",
    "groups": [
      "prepared"
    ],
    "ndb": "19170",
    "desc": "Egg custards, dry mix, prepared with whole milk",
    "cal": 122.0,
    "pro": 4.0,
    "fat": 4.0,
    "carb": 17.6,
    "fib": 0.0,
    "h2o": 73.5,
    "sug": 4.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 141.0
      }
    ]
  },
  {
    "word": "DANISH",
    "display": "Danish",
    "groups": [
      "prepared"
    ],
    "ndb": "18230",
    "desc": "Crackers, standard snack-type, sandwich, with cheese filling",
    "cal": 477.0,
    "pro": 9.3,
    "fat": 21.1,
    "carb": 61.7,
    "fib": 1.9,
    "h2o": 3.9,
    "sug": 3.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cracker, sandwich",
        "gm": 7.0
      }
    ]
  },
  {
    "word": "DINNERROLL",
    "display": "Dinner Roll",
    "groups": [
      "prepared"
    ],
    "ndb": "18347",
    "desc": "Rolls, dinner, wheat",
    "cal": 273.0,
    "pro": 8.6,
    "fat": 6.3,
    "carb": 46.0,
    "fib": 3.8,
    "h2o": 37.0,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "DIVINITY",
    "display": "Divinity",
    "groups": [
      "prepared"
    ],
    "ndb": "19384",
    "desc": "Candies, divinity, prepared-from-recipe",
    "cal": 364.0,
    "pro": 1.3,
    "fat": 0.1,
    "carb": 89.0,
    "fib": 0.0,
    "h2o": 9.2,
    "sug": 79.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 11.0
      }
    ]
  },
  {
    "word": "DOUGHNUTCAKE",
    "display": "Doughnut Cake",
    "groups": [
      "prepared"
    ],
    "ndb": "18248",
    "desc": "Doughnuts, cake-type, plain (includes unsugared, old-fashioned)",
    "cal": 434.0,
    "pro": 5.3,
    "fat": 24.9,
    "carb": 47.1,
    "fib": 1.7,
    "h2o": 20.8,
    "sug": 18.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "donut",
        "gm": 40.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "doughnut stick",
        "gm": 52.0
      },
      {
        "amt": 1.0,
        "desc": "doughnut, long type (twist) (4-1/2\" long)",
        "gm": 52.0
      },
      {
        "amt": 1.0,
        "desc": "doughnut medium (3-1/4\" dia)",
        "gm": 54.0
      },
      {
        "amt": 1.0,
        "desc": "doughnut, mini (1-1/2\" dia) or doughnut hole",
        "gm": 14.0
      },
      {
        "amt": 1.0,
        "desc": "doughnut, large (4\" dia)",
        "gm": 71.0
      }
    ]
  },
  {
    "word": "DOUGHNUTYEAST",
    "display": "Doughnut Yeast",
    "groups": [
      "prepared"
    ],
    "ndb": "18436",
    "desc": "Doughnuts, yeast-leavened, glazed, unenriched (includes honey buns)",
    "cal": 403.0,
    "pro": 6.4,
    "fat": 22.8,
    "carb": 44.3,
    "fib": 1.2,
    "h2o": 25.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "doughnut, medium (3-1/4\" dia)",
        "gm": 60.0
      }
    ]
  },
  {
    "word": "DUMPLING",
    "display": "Dumpling",
    "groups": [
      "prepared"
    ],
    "ndb": "32025",
    "desc": "Dumpling, potato- or cheese-filled, frozen",
    "cal": 195.0,
    "pro": 5.3,
    "fat": 6.1,
    "carb": 29.6,
    "fib": 0.9,
    "h2o": 57.2,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "pieces pierogies",
        "gm": 114.0
      }
    ]
  },
  {
    "word": "ECLAIR",
    "display": "Eclair",
    "groups": [
      "prepared"
    ],
    "ndb": "18969",
    "desc": "Cream puff, eclair, custard or cream filled, iced",
    "cal": 334.0,
    "pro": 4.4,
    "fat": 18.5,
    "carb": 37.4,
    "fib": 0.9,
    "h2o": 38.6,
    "sug": 22.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 4.0,
        "desc": "oz",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "EGGROLL",
    "display": "Egg Roll",
    "groups": [
      "prepared"
    ],
    "ndb": "22955",
    "desc": "Egg rolls, vegetable, frozen, prepared",
    "cal": 214.0,
    "pro": 6.0,
    "fat": 7.0,
    "carb": 31.8,
    "fib": 2.4,
    "h2o": 53.4,
    "sug": 6.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "egg roll",
        "gm": 68.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "EGGROLLCHICKEN",
    "display": "Egg Roll Chicken",
    "groups": [
      "prepared"
    ],
    "ndb": "22954",
    "desc": "Egg rolls, chicken, refrigerated, heated",
    "cal": 197.0,
    "pro": 10.4,
    "fat": 4.5,
    "carb": 28.5,
    "fib": 2.4,
    "h2o": 54.2,
    "sug": 5.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll",
        "gm": 80.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "EGGROLLPORK",
    "display": "Egg Roll Pork",
    "groups": [
      "prepared"
    ],
    "ndb": "22953",
    "desc": "Egg rolls, pork, refrigerated, heated",
    "cal": 222.0,
    "pro": 9.9,
    "fat": 7.2,
    "carb": 29.5,
    "fib": 2.1,
    "h2o": 51.3,
    "sug": 5.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "EMU",
    "display": "Emu",
    "groups": [
      "prepared"
    ],
    "ndb": "5622",
    "desc": "Emu, ground, cooked, pan-broiled",
    "cal": 163.0,
    "pro": 28.4,
    "fat": 4.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "patty (yield from 135.8 g raw meat)",
        "gm": 109.0
      },
      {
        "amt": 1.0,
        "desc": "serving ( 3 oz )",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "FALAFEL",
    "display": "Falafel",
    "groups": [
      "prepared"
    ],
    "ndb": "16138",
    "desc": "Falafel, home-prepared",
    "cal": 333.0,
    "pro": 13.3,
    "fat": 17.8,
    "carb": 31.8,
    "fib": 0.0,
    "h2o": 34.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "patty (approx 2-1/4\" dia)",
        "gm": 17.0
      }
    ]
  },
  {
    "word": "FISHBROTH",
    "display": "Fish Broth",
    "groups": [
      "prepared"
    ],
    "ndb": "6963",
    "desc": "Fish broth",
    "cal": 16.0,
    "pro": 2.0,
    "fat": 0.6,
    "carb": 0.4,
    "fib": 0.0,
    "h2o": 96.0,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 244.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.5
      }
    ]
  },
  {
    "word": "FLAN",
    "display": "Flan",
    "groups": [
      "prepared"
    ],
    "ndb": "19232",
    "desc": "Flan, caramel custard, dry mix, prepared with whole milk",
    "cal": 113.0,
    "pro": 3.0,
    "fat": 3.0,
    "carb": 18.7,
    "fib": 0.0,
    "h2o": 74.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "FOCACCIA",
    "display": "Focaccia",
    "groups": [
      "prepared"
    ],
    "ndb": "18973",
    "desc": "Focaccia, Italian flatbread, plain",
    "cal": 249.0,
    "pro": 8.8,
    "fat": 7.9,
    "carb": 35.8,
    "fib": 1.8,
    "h2o": 45.9,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 57.0
      }
    ]
  },
  {
    "word": "FONDANT",
    "display": "Fondant",
    "groups": [
      "prepared"
    ],
    "ndb": "19099",
    "desc": "Candies, fondant, prepared-from-recipe",
    "cal": 373.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 93.2,
    "fib": 0.0,
    "h2o": 6.7,
    "sug": 88.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "FORTUNECOOKIE",
    "display": "Fortune Cookie",
    "groups": [
      "prepared"
    ],
    "ndb": "18171",
    "desc": "Cookies, fortune",
    "cal": 378.0,
    "pro": 4.2,
    "fat": 2.7,
    "carb": 84.0,
    "fib": 1.6,
    "h2o": 8.0,
    "sug": 45.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cookie",
        "gm": 8.0
      }
    ]
  },
  {
    "word": "FRENCHBREAD",
    "display": "French Bread",
    "groups": [
      "prepared"
    ],
    "ndb": "18029",
    "desc": "Bread, french or vienna (includes sourdough)",
    "cal": 272.0,
    "pro": 10.8,
    "fat": 2.4,
    "carb": 51.9,
    "fib": 2.2,
    "h2o": 33.0,
    "sug": 4.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 139.0
      }
    ]
  },
  {
    "word": "FRENCHTOAST",
    "display": "French Toast",
    "groups": [
      "prepared"
    ],
    "ndb": "18269",
    "desc": "French toast, prepared from recipe, made with low fat (2%) milk",
    "cal": 229.0,
    "pro": 7.7,
    "fat": 10.8,
    "carb": 25.0,
    "fib": 0.0,
    "h2o": 54.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 65.0
      }
    ]
  },
  {
    "word": "FROSTING",
    "display": "Frosting",
    "groups": [
      "prepared"
    ],
    "ndb": "19244",
    "desc": "Frostings, vanilla, creamy, dry mix",
    "cal": 410.0,
    "pro": 0.3,
    "fat": 4.9,
    "carb": 93.8,
    "fib": 0.1,
    "h2o": 0.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "package",
        "gm": 411.0
      },
      {
        "amt": 0.08,
        "desc": "package",
        "gm": 34.0
      }
    ]
  },
  {
    "word": "FRYBREAD",
    "display": "Fry Bread",
    "groups": [
      "prepared",
      "grain"
    ],
    "ndb": "35142",
    "desc": "Frybread, made with lard (Navajo)",
    "cal": 330.0,
    "pro": 6.7,
    "fat": 12.2,
    "carb": 48.3,
    "fib": 0.0,
    "h2o": 31.6,
    "sug": 2.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 152.0
      }
    ]
  },
  {
    "word": "FUDGE",
    "display": "Fudge",
    "groups": [
      "prepared"
    ],
    "ndb": "19100",
    "desc": "Candies, fudge, chocolate, prepared-from-recipe",
    "cal": 411.0,
    "pro": 2.4,
    "fat": 10.4,
    "carb": 76.4,
    "fib": 1.7,
    "h2o": 9.8,
    "sug": 73.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 17.0
      }
    ]
  },
  {
    "word": "GARLICBREAD",
    "display": "Garlic Bread",
    "groups": [
      "prepared"
    ],
    "ndb": "18963",
    "desc": "Garlic bread, frozen",
    "cal": 350.0,
    "pro": 8.4,
    "fat": 16.6,
    "carb": 41.7,
    "fib": 2.5,
    "h2o": 31.8,
    "sug": 3.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice presliced",
        "gm": 43.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 59.0
      }
    ]
  },
  {
    "word": "GELATIN",
    "display": "Gelatin",
    "groups": [
      "prepared"
    ],
    "ndb": "19177",
    "desc": "Gelatins, dry powder, unsweetened",
    "cal": 335.0,
    "pro": 85.6,
    "fat": 0.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 13.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "envelope (1 tbsp)",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "package (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "GINGERBREAD",
    "display": "Gingerbread",
    "groups": [
      "prepared"
    ],
    "ndb": "18116",
    "desc": "Cake, gingerbread, prepared from recipe",
    "cal": 356.0,
    "pro": 3.9,
    "fat": 16.4,
    "carb": 49.2,
    "fib": 0.0,
    "h2o": 28.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/9 of 8\" square)",
        "gm": 74.0
      }
    ]
  },
  {
    "word": "GRAHAM",
    "display": "Graham",
    "groups": [
      "prepared"
    ],
    "ndb": "18173",
    "desc": "Cookies, graham crackers, plain or honey (includes cinnamon)",
    "cal": 430.0,
    "pro": 6.7,
    "fat": 10.6,
    "carb": 77.7,
    "fib": 3.4,
    "h2o": 3.4,
    "sug": 24.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cracker",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 84.0
      },
      {
        "amt": 1.0,
        "desc": "large rectangular piece or 2 squares or 4 small re",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "GRANOLA",
    "display": "Granola",
    "groups": [
      "prepared"
    ],
    "ndb": "8037",
    "desc": "Cereals ready-to-eat, granola, homemade",
    "cal": 489.0,
    "pro": 13.7,
    "fat": 24.3,
    "carb": 53.9,
    "fib": 8.9,
    "h2o": 5.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 122.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "GRAVY",
    "display": "Gravy",
    "groups": [
      "prepared"
    ],
    "ndb": "6318",
    "desc": "Gravy, CAMPBELL'S, country style cream",
    "cal": 76.0,
    "pro": 1.7,
    "fat": 5.1,
    "carb": 5.1,
    "fib": 0.0,
    "h2o": 86.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.25,
        "desc": "cup",
        "gm": 59.0
      }
    ]
  },
  {
    "word": "GUMDROP",
    "display": "Gumdrop",
    "groups": [
      "prepared"
    ],
    "ndb": "19106",
    "desc": "Candies, gumdrops, starch jelly pieces",
    "cal": 396.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 98.9,
    "fib": 0.1,
    "h2o": 1.0,
    "sug": 59.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup gumdrops",
        "gm": 182.0
      },
      {
        "amt": 10.0,
        "desc": "gumdrops",
        "gm": 36.0
      },
      {
        "amt": 10.0,
        "desc": "gummy bears",
        "gm": 22.0
      },
      {
        "amt": 10.0,
        "desc": "gummy dinosaurs",
        "gm": 63.0
      },
      {
        "amt": 10.0,
        "desc": "gummy fish",
        "gm": 50.0
      },
      {
        "amt": 10.0,
        "desc": "gummy worms",
        "gm": 74.0
      },
      {
        "amt": 1.0,
        "desc": "spice stick",
        "gm": 9.5
      },
      {
        "amt": 1.0,
        "desc": "spice drop",
        "gm": 24.0
      },
      {
        "amt": 1.0,
        "desc": "gumdrop, small (1/2\" dia)",
        "gm": 3.2
      },
      {
        "amt": 1.0,
        "desc": "gumdrop, medium (3/4\" dia)",
        "gm": 4.2
      },
      {
        "amt": 1.0,
        "desc": "gumdrop, large (1\" dia)",
        "gm": 11.6
      },
      {
        "amt": 1.0,
        "desc": "jelly ring (1-1/4\" dia)",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "HAMBURGER",
    "display": "Hamburger",
    "groups": [
      "prepared"
    ],
    "ndb": "21109",
    "desc": "Fast foods, hamburger; single, regular patty; with condiments and vegetables",
    "cal": 254.0,
    "pro": 11.7,
    "fat": 12.2,
    "carb": 24.8,
    "fib": 0.0,
    "h2o": 49.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "item",
        "gm": 110.0
      }
    ]
  },
  {
    "word": "HOTDOG",
    "display": "Hot Dog",
    "groups": [
      "prepared"
    ],
    "ndb": "21118",
    "desc": "Fast foods, hotdog, plain",
    "cal": 247.0,
    "pro": 10.6,
    "fat": 14.8,
    "carb": 18.4,
    "fib": 0.0,
    "h2o": 54.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sandwich",
        "gm": 98.0
      }
    ]
  },
  {
    "word": "HOTDOGBUN",
    "display": "Hot Dog Bun",
    "groups": [
      "prepared"
    ],
    "ndb": "28313",
    "desc": "Rolls, hamburger or hot dog, whole wheat",
    "cal": 269.0,
    "pro": 12.4,
    "fat": 4.4,
    "carb": 44.9,
    "fib": 6.1,
    "h2o": 35.9,
    "sug": 5.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll",
        "gm": 56.0
      }
    ]
  },
  {
    "word": "ICING",
    "display": "Icing",
    "groups": [
      "prepared"
    ],
    "ndb": "19230",
    "desc": "Frostings, vanilla, creamy, ready-to-eat",
    "cal": 418.0,
    "pro": 0.0,
    "fat": 16.2,
    "carb": 67.9,
    "fib": 0.0,
    "h2o": 15.1,
    "sug": 63.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.08,
        "desc": "package",
        "gm": 38.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp creamy",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "package (16 oz)",
        "gm": 462.0
      }
    ]
  },
  {
    "word": "JAM",
    "display": "Jam",
    "groups": [
      "prepared"
    ],
    "ndb": "19297",
    "desc": "Jams and preserves",
    "cal": 278.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 68.9,
    "fib": 1.1,
    "h2o": 30.5,
    "sug": 48.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "packet (0.5 oz)",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "JELLIES",
    "display": "Jellies",
    "groups": [
      "prepared"
    ],
    "ndb": "19300",
    "desc": "Jellies",
    "cal": 266.0,
    "pro": 0.1,
    "fat": 0.0,
    "carb": 70.0,
    "fib": 1.0,
    "h2o": 29.8,
    "sug": 51.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1 tbsp",
        "gm": 21.0
      },
      {
        "amt": 1.0,
        "desc": "packet (0.5 oz)",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "JELLYBEAN",
    "display": "Jellybean",
    "groups": [
      "prepared"
    ],
    "ndb": "19108",
    "desc": "Candies, jellybeans",
    "cal": 375.0,
    "pro": 0.0,
    "fat": 0.1,
    "carb": 93.5,
    "fib": 0.2,
    "h2o": 6.3,
    "sug": 70.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 10.0,
        "desc": "small",
        "gm": 11.0
      },
      {
        "amt": 10.0,
        "desc": "large (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "KETCHUP",
    "display": "Ketchup",
    "groups": [
      "prepared"
    ],
    "ndb": "11935",
    "desc": "Catsup",
    "cal": 101.0,
    "pro": 1.0,
    "fat": 0.1,
    "carb": 27.4,
    "fib": 0.3,
    "h2o": 68.5,
    "sug": 21.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 9.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "LADYFINGERS",
    "display": "Ladyfingers",
    "groups": [
      "prepared"
    ],
    "ndb": "18175",
    "desc": "Cookies, ladyfingers, with lemon juice and rind",
    "cal": 365.0,
    "pro": 10.6,
    "fat": 9.1,
    "carb": 59.7,
    "fib": 1.0,
    "h2o": 19.5,
    "sug": 25.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "anisette sponge (4\" x 1-1/8\" x 7/8\")",
        "gm": 13.0
      },
      {
        "amt": 1.0,
        "desc": "breakfast treat (approx 4\" x 2\" x 7/8\")",
        "gm": 24.0
      },
      {
        "amt": 1.0,
        "desc": "ladyfinger",
        "gm": 11.0
      }
    ]
  },
  {
    "word": "LASAGNA",
    "display": "Lasagna",
    "groups": [
      "prepared"
    ],
    "ndb": "22910",
    "desc": "Lasagna, cheese, frozen, prepared",
    "cal": 130.0,
    "pro": 6.5,
    "fat": 5.3,
    "carb": 13.8,
    "fib": 1.7,
    "h2o": 72.8,
    "sug": 4.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup 1 serving",
        "gm": 225.0
      }
    ]
  },
  {
    "word": "LASAGNAMEAT",
    "display": "Lasagna with Meat",
    "groups": [
      "prepared"
    ],
    "ndb": "22977",
    "desc": "Lasagna with meat sauce, frozen, prepared",
    "cal": 135.0,
    "pro": 7.3,
    "fat": 4.9,
    "carb": 15.4,
    "fib": 1.7,
    "h2o": 70.9,
    "sug": 3.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece side",
        "gm": 123.0
      },
      {
        "amt": 1.0,
        "desc": "piece corner",
        "gm": 114.0
      },
      {
        "amt": 1.0,
        "desc": "piece center",
        "gm": 255.0
      }
    ]
  },
  {
    "word": "LEMONFRIEDPIE",
    "display": "Lemon Fried Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18445",
    "desc": "Pie, fried pies, lemon",
    "cal": 316.0,
    "pro": 3.0,
    "fat": 16.1,
    "carb": 42.6,
    "fib": 2.6,
    "h2o": 37.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "pie (5\" x 3-3/4\")",
        "gm": 128.0
      }
    ]
  },
  {
    "word": "LEMONPIE",
    "display": "Lemon Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18321",
    "desc": "Pie, lemon meringue, prepared from recipe",
    "cal": 285.0,
    "pro": 3.8,
    "fat": 12.9,
    "carb": 39.1,
    "fib": 0.0,
    "h2o": 43.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 127.0
      }
    ]
  },
  {
    "word": "MACARONICHEESE",
    "display": "Macaroni and Cheese",
    "groups": [
      "prepared"
    ],
    "ndb": "22970",
    "desc": "Macaroni and cheese, frozen entree",
    "cal": 149.0,
    "pro": 5.6,
    "fat": 6.4,
    "carb": 17.3,
    "fib": 1.1,
    "h2o": 69.4,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 137.0
      },
      {
        "amt": 1.0,
        "desc": "container (mean weight over brands)",
        "gm": 283.0
      }
    ]
  },
  {
    "word": "MACAROON",
    "display": "Macaroon",
    "groups": [
      "prepared"
    ],
    "ndb": "28309",
    "desc": "Cookies, coconut macaroon",
    "cal": 460.0,
    "pro": 3.0,
    "fat": 22.6,
    "carb": 61.2,
    "fib": 5.1,
    "h2o": 11.5,
    "sug": 45.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "cookie 1 serving",
        "gm": 36.0
      }
    ]
  },
  {
    "word": "MARSHMALLOW",
    "display": "Marshmallow",
    "groups": [
      "prepared"
    ],
    "ndb": "19116",
    "desc": "Candies, marshmallows",
    "cal": 318.0,
    "pro": 1.8,
    "fat": 0.2,
    "carb": 81.3,
    "fib": 0.1,
    "h2o": 16.4,
    "sug": 57.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup of miniature",
        "gm": 50.0
      },
      {
        "amt": 10.0,
        "desc": "miniatures",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "regular",
        "gm": 7.2
      }
    ]
  },
  {
    "word": "MATZO",
    "display": "Matzo",
    "groups": [
      "prepared"
    ],
    "ndb": "18219",
    "desc": "Crackers, matzo, whole-wheat",
    "cal": 351.0,
    "pro": 13.1,
    "fat": 1.5,
    "carb": 78.9,
    "fib": 11.8,
    "h2o": 4.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "matzo",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "MEATLESSBACON",
    "display": "Meatless Bacon",
    "groups": [
      "prepared",
      "grain"
    ],
    "ndb": "16104",
    "desc": "Bacon, meatless",
    "cal": 309.0,
    "pro": 11.7,
    "fat": 29.5,
    "carb": 5.3,
    "fib": 2.6,
    "h2o": 49.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 144.0
      },
      {
        "amt": 1.0,
        "desc": "oz cooked, yield",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "strip",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "MELBA",
    "display": "Melba",
    "groups": [
      "prepared"
    ],
    "ndb": "18220",
    "desc": "Crackers, melba toast, plain",
    "cal": 390.0,
    "pro": 12.1,
    "fat": 3.2,
    "carb": 76.6,
    "fib": 6.3,
    "h2o": 5.1,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup pieces",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "cup, rounds",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "melba round",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "piece (3-3/4\" x 1-3/4\" x 1/8\")",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "MUFFIN",
    "display": "Muffin",
    "groups": [
      "prepared"
    ],
    "ndb": "18566",
    "desc": "Artificial Blueberry Muffin Mix, dry",
    "cal": 407.0,
    "pro": 4.7,
    "fat": 8.7,
    "carb": 77.5,
    "fib": 0.0,
    "h2o": 6.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "muffin",
        "gm": 31.0
      }
    ]
  },
  {
    "word": "MUFFINCORN",
    "display": "Muffin Corn",
    "groups": [
      "prepared"
    ],
    "ndb": "18412",
    "desc": "Bread, cornbread, dry mix, unenriched (includes corn muffin mix)",
    "cal": 418.0,
    "pro": 7.0,
    "fat": 12.2,
    "carb": 69.5,
    "fib": 6.5,
    "h2o": 7.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "package (8.5 oz)",
        "gm": 241.0
      }
    ]
  },
  {
    "word": "MULTIGRAIN",
    "display": "Multigrain",
    "groups": [
      "prepared",
      "grain"
    ],
    "ndb": "3996",
    "desc": "Babyfood, Multigrain whole grain cereal, dry fortified",
    "cal": 407.0,
    "pro": 6.7,
    "fat": 6.7,
    "carb": 80.1,
    "fib": 6.7,
    "h2o": 4.6,
    "sug": 26.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "NAAN",
    "display": "Naan",
    "groups": [
      "prepared"
    ],
    "ndb": "28307",
    "desc": "Bread, naan, plain, commercially prepared, refrigerated",
    "cal": 291.0,
    "pro": 9.6,
    "fat": 5.7,
    "carb": 50.4,
    "fib": 2.2,
    "h2o": 32.6,
    "sug": 3.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 90.0
      }
    ]
  },
  {
    "word": "NACHOS",
    "display": "Nachos",
    "groups": [
      "prepared"
    ],
    "ndb": "21078",
    "desc": "Fast foods, nachos, with cheese",
    "cal": 343.0,
    "pro": 4.3,
    "fat": 21.5,
    "carb": 34.9,
    "fib": 3.2,
    "h2o": 37.4,
    "sug": 2.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 80.0
      }
    ]
  },
  {
    "word": "PANCAKE",
    "display": "Pancake",
    "groups": [
      "prepared"
    ],
    "ndb": "18390",
    "desc": "Pancakes, buttermilk, prepared from recipe",
    "cal": 227.0,
    "pro": 6.8,
    "fat": 9.3,
    "carb": 28.7,
    "fib": 0.0,
    "h2o": 52.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "pancake (4\" dia)",
        "gm": 38.0
      },
      {
        "amt": 1.0,
        "desc": "pancake (6\" dia)",
        "gm": 77.0
      }
    ]
  },
  {
    "word": "PANDULCE",
    "display": "Pandulce",
    "groups": [
      "prepared"
    ],
    "ndb": "18955",
    "desc": "Bread, pan dulce, sweet yeast bread",
    "cal": 367.0,
    "pro": 9.4,
    "fat": 11.6,
    "carb": 56.4,
    "fib": 2.3,
    "h2o": 21.5,
    "sug": 12.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice (average weight of 1 slice)",
        "gm": 63.0
      }
    ]
  },
  {
    "word": "PAPAD",
    "display": "Papad",
    "groups": [
      "prepared"
    ],
    "ndb": "42200",
    "desc": "Papad",
    "cal": 371.0,
    "pro": 25.6,
    "fat": 3.2,
    "carb": 59.9,
    "fib": 18.6,
    "h2o": 3.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "PARATHA",
    "display": "Paratha",
    "groups": [
      "prepared"
    ],
    "ndb": "28286",
    "desc": "Bread, paratha, whole wheat, commercially prepared, frozen",
    "cal": 326.0,
    "pro": 6.4,
    "fat": 13.2,
    "carb": 45.4,
    "fib": 9.6,
    "h2o": 33.5,
    "sug": 4.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 79.0
      }
    ]
  },
  {
    "word": "PASTRY",
    "display": "Pastry",
    "groups": [
      "prepared"
    ],
    "ndb": "18430",
    "desc": "Danish pastry, cinnamon, unenriched",
    "cal": 403.0,
    "pro": 7.0,
    "fat": 22.4,
    "carb": 44.6,
    "fib": 1.2,
    "h2o": 24.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "large (approx 7\" dia)",
        "gm": 142.0
      },
      {
        "amt": 1.0,
        "desc": "small or frozen (approx 3\" dia)",
        "gm": 35.0
      },
      {
        "amt": 1.0,
        "desc": "pastry (4-1/4\" dia)",
        "gm": 65.0
      },
      {
        "amt": 1.0,
        "desc": "Toaster Strudel",
        "gm": 53.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 15 oz ring)",
        "gm": 53.0
      }
    ]
  },
  {
    "word": "PASTRYCHEESE",
    "display": "Pastry Cheese",
    "groups": [
      "prepared"
    ],
    "ndb": "18245",
    "desc": "Danish pastry, cheese",
    "cal": 374.0,
    "pro": 8.0,
    "fat": 21.9,
    "carb": 37.2,
    "fib": 1.0,
    "h2o": 31.4,
    "sug": 7.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 71.0
      }
    ]
  },
  {
    "word": "PEACHPIE",
    "display": "Peach Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18323",
    "desc": "Pie, peach",
    "cal": 224.0,
    "pro": 1.9,
    "fat": 10.0,
    "carb": 32.9,
    "fib": 0.8,
    "h2o": 54.4,
    "sug": 16.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/6 of 8\" pie)",
        "gm": 117.0
      }
    ]
  },
  {
    "word": "PECANPIE",
    "display": "Pecan Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18325",
    "desc": "Pie, pecan, prepared from recipe",
    "cal": 412.0,
    "pro": 4.9,
    "fat": 22.2,
    "carb": 52.2,
    "fib": 0.0,
    "h2o": 19.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 122.0
      }
    ]
  },
  {
    "word": "PESTO",
    "display": "Pesto",
    "groups": [
      "prepared"
    ],
    "ndb": "6626",
    "desc": "Sauce, pesto, ready-to-serve, refrigerated",
    "cal": 418.0,
    "pro": 9.8,
    "fat": 37.6,
    "carb": 10.1,
    "fib": 1.8,
    "h2o": 39.0,
    "sug": 6.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.25,
        "desc": "cup",
        "gm": 63.0
      }
    ]
  },
  {
    "word": "PHYLLO",
    "display": "Phyllo",
    "groups": [
      "prepared"
    ],
    "ndb": "18338",
    "desc": "Phyllo dough",
    "cal": 299.0,
    "pro": 7.1,
    "fat": 6.0,
    "carb": 52.6,
    "fib": 1.9,
    "h2o": 32.6,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "sheet dough",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "PIECRUST",
    "display": "Piecrust",
    "groups": [
      "prepared"
    ],
    "ndb": "18946",
    "desc": "Pie crust, refrigerated, regular, baked",
    "cal": 506.0,
    "pro": 3.4,
    "fat": 28.7,
    "carb": 58.5,
    "fib": 1.4,
    "h2o": 8.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pie crust",
        "gm": 198.0
      }
    ]
  },
  {
    "word": "PITA",
    "display": "Pita",
    "groups": [
      "prepared"
    ],
    "ndb": "18413",
    "desc": "Bread, pita, white, unenriched",
    "cal": 275.0,
    "pro": 9.1,
    "fat": 1.2,
    "carb": 55.7,
    "fib": 2.2,
    "h2o": 32.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "pita, large (6-1/2\" dia)",
        "gm": 60.0
      }
    ]
  },
  {
    "word": "PIZZA",
    "display": "Pizza",
    "groups": [
      "prepared"
    ],
    "ndb": "21224",
    "desc": "Pizza, cheese topping, regular crust, frozen, cooked",
    "cal": 268.0,
    "pro": 10.4,
    "fat": 12.3,
    "carb": 29.0,
    "fib": 2.2,
    "h2o": 46.3,
    "sug": 3.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 9 servings per 24 oz package",
        "gm": 81.0
      },
      {
        "amt": 1.0,
        "desc": "serving 3 servings per 15.1 oz package",
        "gm": 151.0
      },
      {
        "amt": 1.0,
        "desc": "serving 2 servings per 9.8 oz package",
        "gm": 146.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1 serving per 8 oz box",
        "gm": 199.0
      },
      {
        "amt": 1.0,
        "desc": "package 24 oz pizza",
        "gm": 727.0
      },
      {
        "amt": 1.0,
        "desc": "package 15.1 oz pizza",
        "gm": 452.0
      },
      {
        "amt": 1.0,
        "desc": "package 9.8 oz pizza",
        "gm": 293.0
      },
      {
        "amt": 1.0,
        "desc": "package 8 oz pizza",
        "gm": 199.0
      }
    ]
  },
  {
    "word": "POPTARTBLUE",
    "display": "Pop Tart Blueberry",
    "groups": [
      "prepared"
    ],
    "ndb": "18476",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Blueberry",
    "cal": 412.0,
    "pro": 4.6,
    "fat": 13.3,
    "carb": 68.4,
    "fib": 1.1,
    "h2o": 12.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTBLUE",
    "display": "Pop Tart Frost Blueberry",
    "groups": [
      "prepared"
    ],
    "ndb": "18477",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Frosted blueberry",
    "cal": 391.0,
    "pro": 4.6,
    "fat": 10.0,
    "carb": 71.8,
    "fib": 1.1,
    "h2o": 12.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTBRWN",
    "display": "Pop Tart Frost Brown",
    "groups": [
      "prepared"
    ],
    "ndb": "18479",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Frosted brown sugar cinnamon",
    "cal": 417.0,
    "pro": 4.6,
    "fat": 13.8,
    "carb": 69.0,
    "fib": 1.4,
    "h2o": 11.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 50.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTCHERRY",
    "display": "Pop Tart Frost Cherry",
    "groups": [
      "prepared"
    ],
    "ndb": "18481",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Frosted cherry",
    "cal": 397.0,
    "pro": 4.2,
    "fat": 10.2,
    "carb": 72.0,
    "fib": 1.0,
    "h2o": 12.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTCHOC",
    "display": "Pop Tart Frost Choc",
    "groups": [
      "prepared"
    ],
    "ndb": "18482",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Frosted chocolate fudge",
    "cal": 384.0,
    "pro": 4.9,
    "fat": 9.3,
    "carb": 70.4,
    "fib": 2.1,
    "h2o": 12.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTRASP",
    "display": "Pop Tart Frost Raspberry",
    "groups": [
      "prepared"
    ],
    "ndb": "18486",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Frosted raspberry",
    "cal": 399.0,
    "pro": 4.2,
    "fat": 10.6,
    "carb": 71.6,
    "fib": 1.0,
    "h2o": 12.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTSTRAW",
    "display": "Pop Tart Frost Strawberry",
    "groups": [
      "prepared"
    ],
    "ndb": "18497",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S LOW FAT POP TARTS, Frosted strawberry",
    "cal": 363.0,
    "pro": 4.2,
    "fat": 5.4,
    "carb": 74.4,
    "fib": 5.6,
    "h2o": 12.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 50.0
      }
    ]
  },
  {
    "word": "POPTARTFRSTWILD",
    "display": "Pop Tart Frost Wild Berry",
    "groups": [
      "prepared"
    ],
    "ndb": "18490",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Frosted wild berry",
    "cal": 390.0,
    "pro": 4.0,
    "fat": 9.5,
    "carb": 72.4,
    "fib": 1.3,
    "h2o": 12.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTSMORES",
    "display": "Pop Tart Smores",
    "groups": [
      "prepared"
    ],
    "ndb": "18487",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, S'mores",
    "cal": 392.0,
    "pro": 6.2,
    "fat": 10.5,
    "carb": 69.6,
    "fib": 1.4,
    "h2o": 12.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POPTARTSTRAW",
    "display": "Pop Tart Strawberry",
    "groups": [
      "prepared"
    ],
    "ndb": "18488",
    "desc": "Toaster Pastries, KELLOGG, KELLOGG'S POP TARTS, Strawberry",
    "cal": 398.0,
    "pro": 4.7,
    "fat": 10.5,
    "carb": 71.1,
    "fib": 1.1,
    "h2o": 12.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pastry",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "POTATOCHIP",
    "display": "Potato Chip",
    "groups": [
      "prepared"
    ],
    "ndb": "19411",
    "desc": "Snacks, potato chips, plain, salted",
    "cal": 532.0,
    "pro": 6.4,
    "fat": 34.0,
    "carb": 53.8,
    "fib": 3.1,
    "h2o": 1.9,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.0
      },
      {
        "amt": 22.0,
        "desc": "chips",
        "gm": 28.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "bag (8 oz)",
        "gm": 227.0
      }
    ]
  },
  {
    "word": "POTATOSALAD",
    "display": "Potato Salad",
    "groups": [
      "prepared"
    ],
    "ndb": "11414",
    "desc": "Potato salad, home-prepared",
    "cal": 143.0,
    "pro": 2.7,
    "fat": 8.2,
    "carb": 11.2,
    "fib": 1.3,
    "h2o": 76.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 250.0
      }
    ]
  },
  {
    "word": "POUNDCAKE",
    "display": "Pound Cake",
    "groups": [
      "prepared"
    ],
    "ndb": "18133",
    "desc": "Cake, sponge, commercially prepared",
    "cal": 290.0,
    "pro": 5.4,
    "fat": 2.7,
    "carb": 61.0,
    "fib": 0.5,
    "h2o": 29.7,
    "sug": 36.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/12 of 16 oz cake)",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "PRETZEL",
    "display": "Pretzel",
    "groups": [
      "prepared"
    ],
    "ndb": "25024",
    "desc": "Pretzels, soft, unsalted",
    "cal": 345.0,
    "pro": 8.2,
    "fat": 3.1,
    "carb": 71.0,
    "fib": 1.7,
    "h2o": 15.0,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 143.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 115.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 62.0
      }
    ]
  },
  {
    "word": "PUDDINGCHOC",
    "display": "Pudding Chocolate",
    "groups": [
      "prepared"
    ],
    "ndb": "19183",
    "desc": "Puddings, chocolate, ready-to-eat",
    "cal": 142.0,
    "pro": 2.1,
    "fat": 4.6,
    "carb": 23.0,
    "fib": 0.0,
    "h2o": 69.5,
    "sug": 17.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "container refrigerated, 4 oz",
        "gm": 108.0
      },
      {
        "amt": 1.0,
        "desc": "container shelf stable, 3.5 oz",
        "gm": 98.0
      }
    ]
  },
  {
    "word": "PUDDINGLEMON",
    "display": "Pudding Lemon",
    "groups": [
      "prepared"
    ],
    "ndb": "19204",
    "desc": "Puddings, lemon, dry mix, instant, prepared with 2% milk",
    "cal": 107.0,
    "pro": 2.8,
    "fat": 1.7,
    "carb": 20.2,
    "fib": 0.0,
    "h2o": 74.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 8.0
      },
      {
        "amt": 1.0,
        "desc": "package",
        "gm": 32.0
      }
    ]
  },
  {
    "word": "PUDDINGRICE",
    "display": "Pudding Rice",
    "groups": [
      "prepared"
    ],
    "ndb": "19193",
    "desc": "Puddings, rice, ready-to-eat",
    "cal": 108.0,
    "pro": 3.2,
    "fat": 2.1,
    "carb": 18.4,
    "fib": 0.3,
    "h2o": 75.2,
    "sug": 11.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 4 oz pudding cup",
        "gm": 113.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "can (5 oz)",
        "gm": 142.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 172.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 92.0
      }
    ]
  },
  {
    "word": "PUDDINGTAPICOA",
    "display": "Pudding Tapicoa",
    "groups": [
      "prepared"
    ],
    "ndb": "19218",
    "desc": "Puddings, tapioca, ready-to-eat",
    "cal": 130.0,
    "pro": 1.9,
    "fat": 3.9,
    "carb": 21.7,
    "fib": 0.0,
    "h2o": 71.8,
    "sug": 14.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "container refrigerated 4 oz",
        "gm": 110.0
      },
      {
        "amt": 1.0,
        "desc": "container",
        "gm": 97.0
      }
    ]
  },
  {
    "word": "PUDDINGVANILLA",
    "display": "Pudding Vanilla",
    "groups": [
      "prepared"
    ],
    "ndb": "19203",
    "desc": "Puddings, vanilla, dry mix, instant, prepared with whole milk",
    "cal": 114.0,
    "pro": 2.7,
    "fat": 2.9,
    "carb": 19.7,
    "fib": 0.0,
    "h2o": 73.5,
    "sug": 18.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 142.0
      },
      {
        "amt": 1.0,
        "desc": "package yield (2 cups)",
        "gm": 569.0
      }
    ]
  },
  {
    "word": "PUMPERNICKEL",
    "display": "Pumpernickel",
    "groups": [
      "prepared"
    ],
    "ndb": "18044",
    "desc": "Bread, pumpernickel",
    "cal": 250.0,
    "pro": 8.7,
    "fat": 3.1,
    "carb": 47.5,
    "fib": 6.5,
    "h2o": 37.9,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice, regular",
        "gm": 26.0
      },
      {
        "amt": 1.0,
        "desc": "slice, snack-size",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thin",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "slice (5\" x 4\" x 3/8\")",
        "gm": 32.0
      }
    ]
  },
  {
    "word": "PUMPKINPIE",
    "display": "Pumpkin Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18327",
    "desc": "Pie, pumpkin, prepared from recipe",
    "cal": 204.0,
    "pro": 4.5,
    "fat": 9.3,
    "carb": 26.4,
    "fib": 0.0,
    "h2o": 58.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "RAISINBREAD",
    "display": "Raisin Bread",
    "groups": [
      "prepared"
    ],
    "ndb": "18414",
    "desc": "Bread, raisin, unenriched",
    "cal": 274.0,
    "pro": 7.9,
    "fat": 4.4,
    "carb": 52.3,
    "fib": 4.3,
    "h2o": 33.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice, large",
        "gm": 32.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 26.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thin",
        "gm": 23.0
      }
    ]
  },
  {
    "word": "RAVIOLI",
    "display": "Ravioli",
    "groups": [
      "prepared"
    ],
    "ndb": "36055",
    "desc": "Restaurant, Italian, cheese ravioli with marinara sauce",
    "cal": 154.0,
    "pro": 7.1,
    "fat": 5.7,
    "carb": 18.5,
    "fib": 1.2,
    "h2o": 67.3,
    "sug": 4.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving serving size varied by diameter and count",
        "gm": 427.0
      }
    ]
  },
  {
    "word": "RENNIN",
    "display": "Rennin",
    "groups": [
      "prepared"
    ],
    "ndb": "19223",
    "desc": "Rennin, vanilla, dry mix, prepared with whole milk",
    "cal": 89.0,
    "pro": 3.0,
    "fat": 3.1,
    "carb": 12.2,
    "fib": 0.0,
    "h2o": 81.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "ROLLDINNER",
    "display": "Rolldinner",
    "groups": [
      "prepared"
    ],
    "ndb": "18347",
    "desc": "Rolls, dinner, wheat",
    "cal": 273.0,
    "pro": 8.6,
    "fat": 6.3,
    "carb": 46.0,
    "fib": 3.8,
    "h2o": 37.0,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "ROLLHAMBURGER",
    "display": "Roll Hamburger",
    "groups": [
      "prepared"
    ],
    "ndb": "18350",
    "desc": "Rolls, hamburger or hotdog, plain",
    "cal": 279.0,
    "pro": 9.8,
    "fat": 3.9,
    "carb": 50.1,
    "fib": 1.8,
    "h2o": 34.3,
    "sug": 7.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll 1 serving",
        "gm": 44.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "RUSK",
    "display": "Rusk",
    "groups": [
      "prepared"
    ],
    "ndb": "18224",
    "desc": "Crackers, rusk toast",
    "cal": 407.0,
    "pro": 13.5,
    "fat": 7.2,
    "carb": 72.3,
    "fib": 0.0,
    "h2o": 5.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "rusk",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "SALSA",
    "display": "Salsa",
    "groups": [
      "prepared"
    ],
    "ndb": "6164",
    "desc": "Sauce, salsa, ready-to-serve",
    "cal": 29.0,
    "pro": 1.5,
    "fat": 0.2,
    "carb": 6.6,
    "fib": 1.9,
    "h2o": 89.3,
    "sug": 4.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 36.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 130.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 259.0
      }
    ]
  },
  {
    "word": "SALSAVERDE",
    "display": "Salsa Verde",
    "groups": [
      "prepared"
    ],
    "ndb": "27047",
    "desc": "Sauce, salsa, verde, ready-to-serve",
    "cal": 38.0,
    "pro": 1.1,
    "fat": 0.9,
    "carb": 6.4,
    "fib": 1.9,
    "h2o": 89.5,
    "sug": 3.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "Tbsp",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "SALTINE",
    "display": "Saltine",
    "groups": [
      "prepared"
    ],
    "ndb": "18228",
    "desc": "Crackers, saltines (includes oyster, soda, soup)",
    "cal": 418.0,
    "pro": 9.5,
    "fat": 8.6,
    "carb": 74.0,
    "fib": 2.8,
    "h2o": 5.0,
    "sug": 1.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 5.0,
        "desc": "crackers",
        "gm": 14.9
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 70.0
      },
      {
        "amt": 5.0,
        "desc": "crackers square (1 serving)",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cracker square",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, round large",
        "gm": 10.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, oyster",
        "gm": 1.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, rectangle",
        "gm": 6.0
      },
      {
        "amt": 1.0,
        "desc": "cup oyster crackers",
        "gm": 45.0
      }
    ]
  },
  {
    "word": "SAUCE",
    "display": "Sauce",
    "groups": [
      "prepared"
    ],
    "ndb": "1164",
    "desc": "Cheese sauce, prepared from recipe",
    "cal": 197.0,
    "pro": 10.3,
    "fat": 14.9,
    "carb": 5.5,
    "fib": 0.1,
    "h2o": 66.9,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 243.0
      }
    ]
  },
  {
    "word": "SAUERKRAUT",
    "display": "Sauerkraut",
    "groups": [
      "prepared"
    ],
    "ndb": "11439",
    "desc": "Sauerkraut, canned, solids and liquids",
    "cal": 19.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 4.3,
    "fib": 2.9,
    "h2o": 92.5,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 142.0
      },
      {
        "amt": 1.0,
        "desc": "cup, undrained",
        "gm": 236.0
      }
    ]
  },
  {
    "word": "SHERBET",
    "display": "Sherbet",
    "groups": [
      "prepared"
    ],
    "ndb": "19097",
    "desc": "Sherbet, orange",
    "cal": 144.0,
    "pro": 1.1,
    "fat": 2.0,
    "carb": 30.4,
    "fib": 1.3,
    "h2o": 66.1,
    "sug": 24.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup (4 fl oz)",
        "gm": 74.0
      },
      {
        "amt": 1.0,
        "desc": "bar (2.75 fl oz)",
        "gm": 66.0
      }
    ]
  },
  {
    "word": "SHORTBREAD",
    "display": "Shortbread",
    "groups": [
      "prepared"
    ],
    "ndb": "18192",
    "desc": "Cookies, shortbread, commercially prepared, plain",
    "cal": 514.0,
    "pro": 5.4,
    "fat": 26.2,
    "carb": 63.8,
    "fib": 1.3,
    "h2o": 3.6,
    "sug": 21.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cookie",
        "gm": 11.8
      }
    ]
  },
  {
    "word": "SNACK",
    "display": "Snack",
    "groups": [
      "prepared"
    ],
    "ndb": "19056",
    "desc": "Snacks, tortilla chips, plain, white corn, salted",
    "cal": 472.0,
    "pro": 7.1,
    "fat": 20.7,
    "carb": 67.8,
    "fib": 5.4,
    "h2o": 2.6,
    "sug": 0.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "bag",
        "gm": 213.0
      }
    ]
  },
  {
    "word": "SOUPBEEFBROTH",
    "display": "Soup Beef Broth",
    "groups": [
      "prepared"
    ],
    "ndb": "6008",
    "desc": "Soup, beef broth or bouillon canned, ready-to-serve",
    "cal": 7.0,
    "pro": 1.1,
    "fat": 0.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 97.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      },
      {
        "amt": 1.0,
        "desc": "can 14.5 oz",
        "gm": 435.0
      },
      {
        "amt": 1.0,
        "desc": "container 32 oz",
        "gm": 960.0
      }
    ]
  },
  {
    "word": "SOUPBROCCOLI",
    "display": "Soup Broccoli",
    "groups": [
      "prepared"
    ],
    "ndb": "6546",
    "desc": "CAMPBELL'S Homestyle Potato Broccoli Cheese Soup",
    "cal": 65.0,
    "pro": 1.2,
    "fat": 3.7,
    "carb": 6.9,
    "fib": 1.2,
    "h2o": 88.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "SOUPCHICKBROTH",
    "display": "Soup Chicken Broth",
    "groups": [
      "prepared"
    ],
    "ndb": "6194",
    "desc": "Soup, chicken broth, ready-to-serve",
    "cal": 6.0,
    "pro": 0.6,
    "fat": 0.2,
    "carb": 0.4,
    "fib": 0.0,
    "h2o": 97.8,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 249.0
      }
    ]
  },
  {
    "word": "SOUPCHICKNOODLE",
    "display": "Soup Chicken Noodle",
    "groups": [
      "prepared"
    ],
    "ndb": "6018",
    "desc": "Soup, chunky chicken noodle, canned, ready-to-serve",
    "cal": 41.0,
    "pro": 3.1,
    "fat": 1.2,
    "carb": 4.5,
    "fib": 0.8,
    "h2o": 89.9,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "can",
        "gm": 530.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 243.0
      }
    ]
  },
  {
    "word": "SOUPCLAM",
    "display": "Soup Clam",
    "groups": [
      "prepared"
    ],
    "ndb": "27042",
    "desc": "Soup, clam chowder, new england, canned, ready-to-serve",
    "cal": 79.0,
    "pro": 2.6,
    "fat": 3.9,
    "carb": 8.3,
    "fib": 1.0,
    "h2o": 83.8,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 254.0
      },
      {
        "amt": 1.0,
        "desc": "can",
        "gm": 521.0
      }
    ]
  },
  {
    "word": "SOUPCLAMRED",
    "display": "Soup Clam Red",
    "groups": [
      "prepared"
    ],
    "ndb": "6027",
    "desc": "Soup, clam chowder, manhattan style, canned, chunky, ready-to-serve",
    "cal": 56.0,
    "pro": 3.0,
    "fat": 1.4,
    "carb": 7.8,
    "fib": 1.2,
    "h2o": 86.0,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 240.0
      },
      {
        "amt": 1.0,
        "desc": "can (19 oz)",
        "gm": 539.0
      }
    ]
  },
  {
    "word": "SOUPMINESTRONE",
    "display": "Soup Minestrone",
    "groups": [
      "prepared"
    ],
    "ndb": "6544",
    "desc": "CAMPBELL'S Homestyle Minestrone Soup",
    "cal": 41.0,
    "pro": 1.6,
    "fat": 0.4,
    "carb": 7.3,
    "fib": 1.6,
    "h2o": 88.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "SOUPMUSHROOM",
    "display": "Soup Mushroom",
    "groups": [
      "prepared"
    ],
    "ndb": "6443",
    "desc": "Soup, cream of mushroom, canned, prepared with equal volume water",
    "cal": 39.0,
    "pro": 0.7,
    "fat": 2.6,
    "carb": 3.3,
    "fib": 0.3,
    "h2o": 92.5,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1 cup",
        "gm": 248.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 31.0
      }
    ]
  },
  {
    "word": "SOUPTOMATO",
    "display": "Soup Tomato",
    "groups": [
      "prepared"
    ],
    "ndb": "6588",
    "desc": "CAMPBELL'S Soup on the Go, Classic Tomato Soup",
    "cal": 46.0,
    "pro": 1.0,
    "fat": 0.2,
    "carb": 10.2,
    "fib": 0.7,
    "h2o": 88.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "container",
        "gm": 305.0
      }
    ]
  },
  {
    "word": "SOUPTORTILLA",
    "display": "Soup Tortilla",
    "groups": [
      "prepared"
    ],
    "ndb": "6543",
    "desc": "CAMPBELL'S Homestyle Mexican Style Chicken Tortilla Soup",
    "cal": 53.0,
    "pro": 2.9,
    "fat": 0.8,
    "carb": 8.2,
    "fib": 1.2,
    "h2o": 86.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "SOUPVEG",
    "display": "Soup Vegetable",
    "groups": [
      "prepared"
    ],
    "ndb": "6468",
    "desc": "Soup, vegetarian vegetable, canned, prepared with equal volume water",
    "cal": 28.0,
    "pro": 0.9,
    "fat": 0.8,
    "carb": 4.9,
    "fib": 0.3,
    "h2o": 92.4,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 241.0
      },
      {
        "amt": 1.0,
        "desc": "can (10.5 oz), prepared",
        "gm": 586.0
      }
    ]
  },
  {
    "word": "SPONGECAKE",
    "display": "Sponge Cake",
    "groups": [
      "prepared"
    ],
    "ndb": "18133",
    "desc": "Cake, sponge, commercially prepared",
    "cal": 290.0,
    "pro": 5.4,
    "fat": 2.7,
    "carb": 61.0,
    "fib": 0.5,
    "h2o": 29.7,
    "sug": 36.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/12 of 16 oz cake)",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "STRUDEL",
    "display": "Strudel",
    "groups": [
      "prepared"
    ],
    "ndb": "18354",
    "desc": "Strudel, apple",
    "cal": 274.0,
    "pro": 3.3,
    "fat": 11.2,
    "carb": 41.1,
    "fib": 2.2,
    "h2o": 43.5,
    "sug": 25.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 71.0
      }
    ]
  },
  {
    "word": "SUBMARINE",
    "display": "Submarine",
    "groups": [
      "prepared"
    ],
    "ndb": "21126",
    "desc": "Fast foods, submarine sandwich, tuna on white bread with lettuce and tomato",
    "cal": 218.0,
    "pro": 12.3,
    "fat": 12.0,
    "carb": 15.9,
    "fib": 0.7,
    "h2o": 58.2,
    "sug": 1.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 6.0,
        "desc": "inch sub",
        "gm": 237.0
      },
      {
        "amt": 12.0,
        "desc": "inch sub",
        "gm": 474.0
      }
    ]
  },
  {
    "word": "TACOSHELL",
    "display": "Tacoshell",
    "groups": [
      "prepared"
    ],
    "ndb": "18360",
    "desc": "Taco shells, baked",
    "cal": 476.0,
    "pro": 6.4,
    "fat": 21.8,
    "carb": 63.5,
    "fib": 6.7,
    "h2o": 6.4,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "shell",
        "gm": 12.9
      },
      {
        "amt": 1.0,
        "desc": "taco",
        "gm": 12.7
      },
      {
        "amt": 1.0,
        "desc": "medium (approx 5\" dia)",
        "gm": 13.3
      },
      {
        "amt": 1.0,
        "desc": "large (6-1/2\" dia)",
        "gm": 21.0
      },
      {
        "amt": 1.0,
        "desc": "miniature (3\" dia)",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "TAMALESCHEESE",
    "display": "Tamales Cheese",
    "groups": [
      "prepared"
    ],
    "ndb": "36056",
    "desc": "Restaurant, Mexican, cheese tamales",
    "cal": 216.0,
    "pro": 9.0,
    "fat": 12.0,
    "carb": 18.0,
    "fib": 2.2,
    "h2o": 59.1,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving serving size varied from 1 to 3 tamales",
        "gm": 302.0
      },
      {
        "amt": 1.0,
        "desc": "tamale",
        "gm": 179.0
      },
      {
        "amt": 2.0,
        "desc": "tamale",
        "gm": 351.0
      },
      {
        "amt": 3.0,
        "desc": "tamale",
        "gm": 550.0
      }
    ]
  },
  {
    "word": "TAMALESPORK",
    "display": "Tamales Pork",
    "groups": [
      "prepared"
    ],
    "ndb": "35237",
    "desc": "Tamales, masa and pork filling (Hopi)",
    "cal": 168.0,
    "pro": 13.2,
    "fat": 4.7,
    "carb": 18.3,
    "fib": 3.3,
    "h2o": 62.4,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 4.0,
        "desc": "oz",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "TART",
    "display": "Tart",
    "groups": [
      "prepared"
    ],
    "ndb": "18459",
    "desc": "Breakfast tart, low fat",
    "cal": 372.0,
    "pro": 4.0,
    "fat": 6.0,
    "carb": 76.8,
    "fib": 1.5,
    "h2o": 12.0,
    "sug": 4.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tart",
        "gm": 52.0
      }
    ]
  },
  {
    "word": "TORTILLACHIP",
    "display": "Tortilla Chip",
    "groups": [
      "prepared"
    ],
    "ndb": "19433",
    "desc": "Tortilla chips, low fat, baked without fat",
    "cal": 415.0,
    "pro": 11.0,
    "fat": 5.7,
    "carb": 80.0,
    "fib": 5.3,
    "h2o": 1.7,
    "sug": 0.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "TRAILMIX",
    "display": "Trail Mix",
    "groups": [
      "prepared"
    ],
    "ndb": "19059",
    "desc": "Snacks, trail mix, regular",
    "cal": 462.0,
    "pro": 13.8,
    "fat": 29.4,
    "carb": 44.9,
    "fib": 0.0,
    "h2o": 9.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 150.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.5,
        "desc": "oz",
        "gm": 42.0
      }
    ]
  },
  {
    "word": "TRUFFLES",
    "display": "Truffles",
    "groups": [
      "prepared"
    ],
    "ndb": "19138",
    "desc": "Candies, truffles, prepared-from-recipe",
    "cal": 510.0,
    "pro": 6.2,
    "fat": 33.8,
    "carb": 44.9,
    "fib": 2.5,
    "h2o": 13.5,
    "sug": 38.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 12.0
      },
      {
        "amt": 1.0,
        "desc": "recipe yield, recipe makes 49     1 \" x 1\"     pie",
        "gm": 612.0
      }
    ]
  },
  {
    "word": "TURKEYPOTPIE",
    "display": "Turkey Pot Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "22528",
    "desc": "Turkey Pot Pie, frozen entree",
    "cal": 176.0,
    "pro": 6.5,
    "fat": 8.8,
    "carb": 17.7,
    "fib": 1.1,
    "h2o": 65.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "package yields",
        "gm": 397.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 397.0
      }
    ]
  },
  {
    "word": "TURKEYSANDWICH",
    "display": "Turkey Sandwich",
    "groups": [
      "prepared"
    ],
    "ndb": "21207",
    "desc": "SUBWAY, turkey breast sub on white bread with lettuce and tomato",
    "cal": 147.0,
    "pro": 9.1,
    "fat": 2.3,
    "carb": 22.4,
    "fib": 1.3,
    "h2o": 64.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 6.0,
        "desc": "inch sub",
        "gm": 184.0
      },
      {
        "amt": 12.0,
        "desc": "inch sub",
        "gm": 367.0
      }
    ]
  },
  {
    "word": "TURNOVER",
    "display": "Turnover",
    "groups": [
      "prepared"
    ],
    "ndb": "32015",
    "desc": "Turnover, cheese-filled, tomato-based sauce, frozen, unprepared",
    "cal": 235.0,
    "pro": 10.2,
    "fat": 9.4,
    "carb": 27.3,
    "fib": 1.6,
    "h2o": 50.4,
    "sug": 7.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 4.5 oz",
        "gm": 127.0
      }
    ]
  },
  {
    "word": "VANILLAPIE",
    "display": "Vanilla Pie",
    "groups": [
      "prepared"
    ],
    "ndb": "18328",
    "desc": "Pie, vanilla cream, prepared from recipe",
    "cal": 278.0,
    "pro": 4.8,
    "fat": 14.4,
    "carb": 32.6,
    "fib": 0.6,
    "h2o": 47.0,
    "sug": 12.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" dia)",
        "gm": 126.0
      }
    ]
  },
  {
    "word": "WAFER",
    "display": "Wafer",
    "groups": [
      "prepared"
    ],
    "ndb": "18226",
    "desc": "Crackers, rye, wafers, plain",
    "cal": 334.0,
    "pro": 9.6,
    "fat": 0.9,
    "carb": 80.4,
    "fib": 22.9,
    "h2o": 5.0,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "oz",
        "gm": 14.2
      },
      {
        "amt": 1.0,
        "desc": "cup, crushed",
        "gm": 61.0
      },
      {
        "amt": 1.0,
        "desc": "cracker (4-1/2\" x 2-1/2\" x 1/8\")",
        "gm": 11.0
      },
      {
        "amt": 1.0,
        "desc": "cracker, triple",
        "gm": 25.0
      }
    ]
  },
  {
    "word": "WAFFLE",
    "display": "Waffle",
    "groups": [
      "prepared"
    ],
    "ndb": "18367",
    "desc": "Waffles, plain, prepared from recipe",
    "cal": 291.0,
    "pro": 7.9,
    "fat": 14.1,
    "carb": 32.9,
    "fib": 0.0,
    "h2o": 42.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "waffle, round (7\" dia)",
        "gm": 75.0
      }
    ]
  },
  {
    "word": "WHOLEWHEAT",
    "display": "Whole Wheat",
    "groups": [
      "prepared"
    ],
    "ndb": "8145",
    "desc": "Cereals, whole wheat hot natural cereal, cooked with water, without salt",
    "cal": 62.0,
    "pro": 2.0,
    "fat": 0.4,
    "carb": 13.7,
    "fib": 1.6,
    "h2o": 83.6,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 242.0
      },
      {
        "amt": 0.75,
        "desc": "cup",
        "gm": 182.0
      }
    ]
  },
  {
    "word": "WONTON",
    "display": "Wonton",
    "groups": [
      "prepared"
    ],
    "ndb": "18368",
    "desc": "Wonton wrappers (includes egg roll wrappers)",
    "cal": 291.0,
    "pro": 9.8,
    "fat": 1.5,
    "carb": 57.9,
    "fib": 1.8,
    "h2o": 28.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "wrapper, eggroll (7\" square)",
        "gm": 32.0
      },
      {
        "amt": 1.0,
        "desc": "wrapper, wonton (3-1/2\" square)",
        "gm": 8.0
      }
    ]
  },
  {
    "word": "ABALONE",
    "display": "Abalone",
    "groups": [
      "protein"
    ],
    "ndb": "15155",
    "desc": "Mollusks, abalone, mixed species, raw",
    "cal": 105.0,
    "pro": 17.1,
    "fat": 0.8,
    "carb": 6.0,
    "fib": 0.0,
    "h2o": 74.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "AGUTUK",
    "display": "Agutuk",
    "groups": [
      "protein"
    ],
    "ndb": "35001",
    "desc": "Agutuk, fish/berry with seal oil (Alaskan ice cream) (Alaska Native)",
    "cal": 353.0,
    "pro": 3.4,
    "fat": 31.8,
    "carb": 13.4,
    "fib": 0.5,
    "h2o": 47.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "ANCHOVY",
    "display": "Anchovy",
    "groups": [
      "protein"
    ],
    "ndb": "15001",
    "desc": "Fish, anchovy, european, raw",
    "cal": 131.0,
    "pro": 20.4,
    "fat": 4.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ANTELOPE",
    "display": "Antelope",
    "groups": [
      "protein"
    ],
    "ndb": "17144",
    "desc": "Game meat, antelope, raw",
    "cal": 114.0,
    "pro": 22.4,
    "fat": 2.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "ASCIDIANS",
    "display": "Ascidians",
    "groups": [
      "protein"
    ],
    "ndb": "35004",
    "desc": "Ascidians (tunughnak) (Alaska Native)",
    "cal": 20.0,
    "pro": 3.8,
    "fat": 0.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 90.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "BACON",
    "display": "Bacon",
    "groups": [
      "protein"
    ],
    "ndb": "10862",
    "desc": "Pork, cured, bacon, pre-sliced, cooked, pan-fried",
    "cal": 468.0,
    "pro": 33.9,
    "fat": 35.1,
    "carb": 1.7,
    "fib": 0.0,
    "h2o": 23.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 11.5
      }
    ]
  },
  {
    "word": "BASS",
    "display": "Bass",
    "groups": [
      "protein"
    ],
    "ndb": "15187",
    "desc": "Fish, bass, freshwater, mixed species, cooked, dry heat",
    "cal": 146.0,
    "pro": 24.2,
    "fat": 4.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 62.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "BEAR",
    "display": "Bear",
    "groups": [
      "protein"
    ],
    "ndb": "35008",
    "desc": "Bear, polar, meat, raw (Alaska Native)",
    "cal": 130.0,
    "pro": 25.6,
    "fat": 3.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "BEAVER",
    "display": "Beaver",
    "groups": [
      "protein"
    ],
    "ndb": "17150",
    "desc": "Game meat, beaver, raw",
    "cal": 146.0,
    "pro": 24.1,
    "fat": 4.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 71.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "BEEF",
    "display": "Beef",
    "groups": [
      "protein"
    ],
    "ndb": "13364",
    "desc": "Beef, composite of trimmed retail cuts, separable lean only, trimmed to 0\" fat, all grades, cooked",
    "cal": 203.0,
    "pro": 29.9,
    "fat": 8.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 61.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "BEEFGROUND",
    "display": "Beef Ground",
    "groups": [
      "protein"
    ],
    "ndb": "23570",
    "desc": "Beef, ground, 85% lean meat / 15% fat, crumbles, cooked, pan-browned",
    "cal": 256.0,
    "pro": 27.7,
    "fat": 15.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 55.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "BEEFSTEW",
    "display": "Beef Stew",
    "groups": [
      "protein"
    ],
    "ndb": "22905",
    "desc": "Beef stew, canned entree",
    "cal": 99.0,
    "pro": 4.4,
    "fat": 5.5,
    "carb": 7.8,
    "fib": 0.9,
    "h2o": 80.8,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1 serving)",
        "gm": 196.0
      }
    ]
  },
  {
    "word": "BEERWURST",
    "display": "Beerwurst",
    "groups": [
      "protein"
    ],
    "ndb": "7002",
    "desc": "Beerwurst, beer salami, pork and beef",
    "cal": 277.0,
    "pro": 14.0,
    "fat": 22.5,
    "carb": 3.8,
    "fib": 0.9,
    "h2o": 56.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "oz",
        "gm": 56.0
      }
    ]
  },
  {
    "word": "BISON",
    "display": "Bison",
    "groups": [
      "protein"
    ],
    "ndb": "17149",
    "desc": "Bison, ground, grass-fed, raw",
    "cal": 146.0,
    "pro": 20.2,
    "fat": 7.2,
    "carb": 0.1,
    "fib": 0.0,
    "h2o": 71.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "patty (cooked from 4 oz raw)",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "BLACKFISH",
    "display": "Blackfish",
    "groups": [
      "protein"
    ],
    "ndb": "35016",
    "desc": "Fish, blackfish, whole (Alaska Native)",
    "cal": 82.0,
    "pro": 15.5,
    "fat": 1.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 80.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "BLUEFIN",
    "display": "Bluefin",
    "groups": [
      "protein"
    ],
    "ndb": "15118",
    "desc": "Fish, tuna, fresh, bluefin, cooked, dry heat",
    "cal": 184.0,
    "pro": 29.9,
    "fat": 6.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "BLUEFISH",
    "display": "Bluefish",
    "groups": [
      "protein"
    ],
    "ndb": "15189",
    "desc": "Fish, bluefish, cooked, dry heat",
    "cal": 159.0,
    "pro": 25.7,
    "fat": 5.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 117.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "BOAR",
    "display": "Boar",
    "groups": [
      "protein"
    ],
    "ndb": "17159",
    "desc": "Game meat, boar, wild, cooked, roasted",
    "cal": 160.0,
    "pro": 28.3,
    "fat": 4.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 63.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 340.0
      }
    ]
  },
  {
    "word": "BOCKWURST",
    "display": "Bockwurst",
    "groups": [
      "protein"
    ],
    "ndb": "7006",
    "desc": "Bockwurst, pork, veal, raw",
    "cal": 301.0,
    "pro": 14.0,
    "fat": 25.9,
    "carb": 3.0,
    "fib": 1.0,
    "h2o": 54.5,
    "sug": 1.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sausage",
        "gm": 91.0
      }
    ]
  },
  {
    "word": "BOLOGNA",
    "display": "Bologna",
    "groups": [
      "protein"
    ],
    "ndb": "7007",
    "desc": "Bologna, beef",
    "cal": 299.0,
    "pro": 10.9,
    "fat": 26.1,
    "carb": 4.3,
    "fib": 0.0,
    "h2o": 55.3,
    "sug": 2.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "BOSTONBUTT",
    "display": "Boston Butt",
    "groups": [
      "protein"
    ],
    "ndb": "10083",
    "desc": "Pork, fresh, shoulder, blade, boston (roasts), separable lean and fat, cooked, roasted",
    "cal": 269.0,
    "pro": 23.1,
    "fat": 18.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 262.0
      }
    ]
  },
  {
    "word": "BRAIN",
    "display": "Brain",
    "groups": [
      "protein"
    ],
    "ndb": "13319",
    "desc": "Beef, variety meats and by-products, brain, cooked, pan-fried",
    "cal": 196.0,
    "pro": 12.6,
    "fat": 15.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 351.0
      }
    ]
  },
  {
    "word": "BRATWURST",
    "display": "Bratwurst",
    "groups": [
      "protein"
    ],
    "ndb": "7013",
    "desc": "Bratwurst, pork, cooked",
    "cal": 333.0,
    "pro": 13.7,
    "fat": 29.2,
    "carb": 2.9,
    "fib": 0.0,
    "h2o": 51.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "link cooked",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "BRAUNSCHWEIGER",
    "display": "Braunschweiger",
    "groups": [
      "protein"
    ],
    "ndb": "7014",
    "desc": "Braunschweiger (a liver sausage), pork",
    "cal": 327.0,
    "pro": 14.5,
    "fat": 28.5,
    "carb": 3.1,
    "fib": 0.0,
    "h2o": 50.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice (2-1/2\" dia x 1/4\" thick)",
        "gm": 18.0
      }
    ]
  },
  {
    "word": "BRISKET",
    "display": "Brisket",
    "groups": [
      "protein"
    ],
    "ndb": "13804",
    "desc": "Beef, brisket, whole, separable lean and fat, trimmed to 1/8\" fat, all grades, cooked, braised",
    "cal": 331.0,
    "pro": 25.9,
    "fat": 24.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 49.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 329.0
      }
    ]
  },
  {
    "word": "BROILERS",
    "display": "Broilers",
    "groups": [
      "protein"
    ],
    "ndb": "5013",
    "desc": "Chicken, broilers or fryers, meat only, roasted",
    "cal": 190.0,
    "pro": 28.9,
    "fat": 7.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 63.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 140.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.7
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook chicken)",
        "gm": 146.0
      }
    ]
  },
  {
    "word": "BROTWURST",
    "display": "Brotwurst",
    "groups": [
      "protein"
    ],
    "ndb": "7015",
    "desc": "Brotwurst, pork, beef, link",
    "cal": 323.0,
    "pro": 14.3,
    "fat": 27.8,
    "carb": 3.0,
    "fib": 0.0,
    "h2o": 51.3,
    "sug": 3.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "link",
        "gm": 70.0
      }
    ]
  },
  {
    "word": "BUFFALO",
    "display": "Buffalo",
    "groups": [
      "protein"
    ],
    "ndb": "17161",
    "desc": "Game meat, buffalo, water, cooked, roasted",
    "cal": 131.0,
    "pro": 26.8,
    "fat": 1.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 340.0
      }
    ]
  },
  {
    "word": "BUTTERFISH",
    "display": "Butterfish",
    "groups": [
      "protein"
    ],
    "ndb": "15191",
    "desc": "Fish, butterfish, cooked, dry heat",
    "cal": 187.0,
    "pro": 22.1,
    "fat": 10.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 25.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CARIBOU",
    "display": "Caribou",
    "groups": [
      "protein"
    ],
    "ndb": "17183",
    "desc": "Game meat, squirrel, raw",
    "cal": 120.0,
    "pro": 21.2,
    "fat": 3.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "CARP",
    "display": "Carp",
    "groups": [
      "protein"
    ],
    "ndb": "15009",
    "desc": "Fish, carp, cooked, dry heat",
    "cal": 162.0,
    "pro": 22.9,
    "fat": 7.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "CATFISH",
    "display": "Catfish",
    "groups": [
      "protein"
    ],
    "ndb": "15011",
    "desc": "Fish, catfish, channel, cooked, breaded and fried",
    "cal": 229.0,
    "pro": 18.1,
    "fat": 13.3,
    "carb": 8.0,
    "fib": 0.7,
    "h2o": 58.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 87.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CHEESEFURTER",
    "display": "Cheesefurter",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "7016",
    "desc": "Cheesefurter, cheese smokie, pork, beef",
    "cal": 328.0,
    "pro": 14.1,
    "fat": 29.0,
    "carb": 1.5,
    "fib": 0.0,
    "h2o": 52.5,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.33,
        "desc": "links",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CHICKENBREAST",
    "display": "Chicken Breast",
    "groups": [
      "protein"
    ],
    "ndb": "5064",
    "desc": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
    "cal": 165.0,
    "pro": 31.0,
    "fat": 3.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 140.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook chicken)",
        "gm": 52.0
      },
      {
        "amt": 0.5,
        "desc": "breast, bone and skin removed",
        "gm": 86.0
      }
    ]
  },
  {
    "word": "CHICKENDRUMSTICK",
    "display": "Chicken Drumstick",
    "groups": [
      "protein"
    ],
    "ndb": "5069",
    "desc": "Chicken, broilers or fryers, drumstick, meat and skin, cooked, roasted",
    "cal": 191.0,
    "pro": 23.4,
    "fat": 10.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "drumstick with skin (yield from 1 lb ready-to-cook",
        "gm": 105.0
      },
      {
        "amt": 1.0,
        "desc": "drumstick without skin",
        "gm": 96.0
      }
    ]
  },
  {
    "word": "CHICKENLEG",
    "display": "Chicken Leg",
    "groups": [
      "protein"
    ],
    "ndb": "5078",
    "desc": "Chicken, broilers or fryers, leg, meat and skin, cooked, roasted",
    "cal": 184.0,
    "pro": 24.0,
    "fat": 9.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "leg, with skin (Sum of drumstick+thigh+back)",
        "gm": 258.0
      },
      {
        "amt": 1.0,
        "desc": "thigh with skin",
        "gm": 133.0
      },
      {
        "amt": 1.0,
        "desc": "drumstick with skin",
        "gm": 91.0
      },
      {
        "amt": 1.0,
        "desc": "back with skin",
        "gm": 35.0
      }
    ]
  },
  {
    "word": "CHICKENLIVERPATE",
    "display": "Chicken Liver Pate",
    "groups": [
      "protein"
    ],
    "ndb": "7053",
    "desc": "Pate, chicken liver, canned",
    "cal": 201.0,
    "pro": 13.4,
    "fat": 13.1,
    "carb": 6.5,
    "fib": 0.0,
    "h2o": 65.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CHICKENTHIGH",
    "display": "Chicken Thigh",
    "groups": [
      "protein"
    ],
    "ndb": "5094",
    "desc": "Chicken, broilers or fryers, thigh, meat and skin, cooked, roasted",
    "cal": 232.0,
    "pro": 23.3,
    "fat": 14.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "thigh with skin",
        "gm": 137.0
      },
      {
        "amt": 1.0,
        "desc": "thigh without skin",
        "gm": 116.0
      }
    ]
  },
  {
    "word": "CHICKENWING",
    "display": "Chicken Wing",
    "groups": [
      "protein"
    ],
    "ndb": "5103",
    "desc": "Chicken, broilers or fryers, wing, meat and skin, cooked, roasted",
    "cal": 254.0,
    "pro": 23.8,
    "fat": 16.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CHILCHEN",
    "display": "Chilchen",
    "groups": [
      "protein"
    ],
    "ndb": "35133",
    "desc": "Chilchen (Red Berry Beverage) (Navajo)",
    "cal": 44.0,
    "pro": 0.8,
    "fat": 0.6,
    "carb": 8.7,
    "fib": 0.0,
    "h2o": 89.7,
    "sug": 2.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CHINOOK",
    "display": "Chinook",
    "groups": [
      "protein"
    ],
    "ndb": "15210",
    "desc": "Fish, salmon, chinook, cooked, dry heat",
    "cal": 231.0,
    "pro": 25.7,
    "fat": 13.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 154.0
      }
    ]
  },
  {
    "word": "CHITON",
    "display": "Chiton",
    "groups": [
      "protein"
    ],
    "ndb": "35026",
    "desc": "Chiton, leathery, gumboots (Alaska Native)",
    "cal": 83.0,
    "pro": 17.1,
    "fat": 1.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 78.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CHORIZO",
    "display": "Chorizo",
    "groups": [
      "protein"
    ],
    "ndb": "7019",
    "desc": "Chorizo, pork and beef",
    "cal": 455.0,
    "pro": 24.1,
    "fat": 38.3,
    "carb": 1.9,
    "fib": 0.0,
    "h2o": 31.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "link (4\" long)",
        "gm": 60.0
      }
    ]
  },
  {
    "word": "CHUCKROAST",
    "display": "Chuck Roast",
    "groups": [
      "protein"
    ],
    "ndb": "13816",
    "desc": "Beef, chuck, blade roast, separable lean and fat, trimmed to 1/8\" fat, all grades, cooked, braised",
    "cal": 341.0,
    "pro": 26.8,
    "fat": 25.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 47.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 247.0
      }
    ]
  },
  {
    "word": "CHUM",
    "display": "Chum",
    "groups": [
      "protein"
    ],
    "ndb": "15211",
    "desc": "Fish, salmon, chum, cooked, dry heat",
    "cal": 154.0,
    "pro": 25.8,
    "fat": 4.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 154.0
      }
    ]
  },
  {
    "word": "CISCO",
    "display": "Cisco",
    "groups": [
      "protein"
    ],
    "ndb": "15014",
    "desc": "Fish, cisco, smoked",
    "cal": 177.0,
    "pro": 16.4,
    "fat": 11.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CLAM",
    "display": "Clam",
    "groups": [
      "protein"
    ],
    "ndb": "15159",
    "desc": "Mollusks, clam, mixed species, cooked, moist heat",
    "cal": 148.0,
    "pro": 25.6,
    "fat": 1.9,
    "carb": 5.1,
    "fib": 0.0,
    "h2o": 63.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 20.0,
        "desc": "small",
        "gm": 190.0
      }
    ]
  },
  {
    "word": "COD",
    "display": "Cod",
    "groups": [
      "protein"
    ],
    "ndb": "15016",
    "desc": "Fish, cod, Atlantic, cooked, dry heat",
    "cal": 105.0,
    "pro": 22.8,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 75.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "COHO",
    "display": "Coho",
    "groups": [
      "protein"
    ],
    "ndb": "15082",
    "desc": "Fish, salmon, coho, wild, cooked, moist heat",
    "cal": 184.0,
    "pro": 27.4,
    "fat": 7.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "CONCH",
    "display": "Conch",
    "groups": [
      "protein"
    ],
    "ndb": "15250",
    "desc": "Mollusks, conch, baked or broiled",
    "cal": 130.0,
    "pro": 26.3,
    "fat": 1.2,
    "carb": 1.7,
    "fib": 0.0,
    "h2o": 69.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 127.0
      },
      {
        "amt": 1.0,
        "desc": "oz cooked, yield",
        "gm": 17.0
      }
    ]
  },
  {
    "word": "CORNEDBEEF",
    "display": "Corned Beef",
    "groups": [
      "protein"
    ],
    "ndb": "13347",
    "desc": "Beef, cured, corned beef, brisket, cooked",
    "cal": 251.0,
    "pro": 18.2,
    "fat": 19.0,
    "carb": 0.5,
    "fib": 0.0,
    "h2o": 59.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 320.0
      }
    ]
  },
  {
    "word": "CORNISH",
    "display": "Cornish",
    "groups": [
      "protein"
    ],
    "ndb": "5308",
    "desc": "Chicken, cornish game hens, meat and skin, cooked, roasted",
    "cal": 259.0,
    "pro": 22.3,
    "fat": 18.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 58.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "bird",
        "gm": 129.0
      },
      {
        "amt": 1.0,
        "desc": "bird whole",
        "gm": 257.0
      }
    ]
  },
  {
    "word": "COUNTRYSTYLERIB",
    "display": "Country Style Rib",
    "groups": [
      "protein"
    ],
    "ndb": "10991",
    "desc": "Pork, fresh, loin, country-style ribs, separable lean and fat, boneless, cooked, broiled",
    "cal": 247.0,
    "pro": 26.3,
    "fat": 15.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "rack",
        "gm": 122.0
      }
    ]
  },
  {
    "word": "CRAB",
    "display": "Crab",
    "groups": [
      "protein"
    ],
    "ndb": "15140",
    "desc": "Crustaceans, crab, blue, cooked, moist heat",
    "cal": 83.0,
    "pro": 17.9,
    "fat": 0.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 79.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, flaked and pieces",
        "gm": 118.0
      },
      {
        "amt": 1.0,
        "desc": "cup (not packed)",
        "gm": 135.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CRAWFISH",
    "display": "Crawfish",
    "groups": [
      "protein"
    ],
    "ndb": "15146",
    "desc": "Crustaceans, crayfish, mixed species, wild, cooked, moist heat",
    "cal": 82.0,
    "pro": 16.8,
    "fat": 1.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 79.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CRAYFISH",
    "display": "Crayfish",
    "groups": [
      "protein"
    ],
    "ndb": "15146",
    "desc": "Crustaceans, crayfish, mixed species, wild, cooked, moist heat",
    "cal": 82.0,
    "pro": 16.8,
    "fat": 1.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 79.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CROAKER",
    "display": "Croaker",
    "groups": [
      "protein"
    ],
    "ndb": "15021",
    "desc": "Fish, croaker, Atlantic, cooked, breaded and fried",
    "cal": 221.0,
    "pro": 18.2,
    "fat": 12.7,
    "carb": 7.5,
    "fib": 0.4,
    "h2o": 59.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 87.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CURED",
    "display": "Cured",
    "groups": [
      "protein"
    ],
    "ndb": "10879",
    "desc": "Pork, cured, ham -- water added, whole, boneless, separable lean only, heated, roasted",
    "cal": 117.0,
    "pro": 18.0,
    "fat": 4.4,
    "carb": 1.6,
    "fib": 0.0,
    "h2o": 72.6,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast whole",
        "gm": 1867.0
      }
    ]
  },
  {
    "word": "CUSK",
    "display": "Cusk",
    "groups": [
      "protein"
    ],
    "ndb": "15193",
    "desc": "Fish, cusk, cooked, dry heat",
    "cal": 112.0,
    "pro": 24.4,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 95.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "CUTTLEFISH",
    "display": "Cuttlefish",
    "groups": [
      "protein"
    ],
    "ndb": "15229",
    "desc": "Mollusks, cuttlefish, mixed species, cooked, moist heat",
    "cal": 158.0,
    "pro": 32.5,
    "fat": 1.4,
    "carb": 1.6,
    "fib": 0.0,
    "h2o": 61.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "DEER",
    "display": "Deer",
    "groups": [
      "protein"
    ],
    "ndb": "17165",
    "desc": "Game meat, deer, cooked, roasted",
    "cal": 158.0,
    "pro": 30.2,
    "fat": 3.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 340.0
      }
    ]
  },
  {
    "word": "DEVILFISH",
    "display": "Devilfish",
    "groups": [
      "protein"
    ],
    "ndb": "35034",
    "desc": "Fish, devilfish, meat (Alaska Native)",
    "cal": 97.0,
    "pro": 11.7,
    "fat": 5.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 80.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "DRUM",
    "display": "Drum",
    "groups": [
      "protein"
    ],
    "ndb": "15195",
    "desc": "Fish, drum, freshwater, cooked, dry heat",
    "cal": 153.0,
    "pro": 22.5,
    "fat": 6.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 154.0
      }
    ]
  },
  {
    "word": "DRUMETTE",
    "display": "Drumette",
    "groups": [
      "protein"
    ],
    "ndb": "5103",
    "desc": "Chicken, broilers or fryers, wing, meat and skin, cooked, roasted",
    "cal": 254.0,
    "pro": 23.8,
    "fat": 16.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "DRUMSTICK",
    "display": "Drumstick",
    "groups": [
      "protein",
      "vegetable"
    ],
    "ndb": "11223",
    "desc": "Drumstick leaves, cooked, boiled, drained, without salt",
    "cal": 60.0,
    "pro": 5.3,
    "fat": 0.9,
    "carb": 11.2,
    "fib": 2.0,
    "h2o": 81.7,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 42.0
      }
    ]
  },
  {
    "word": "DUCK",
    "display": "Duck",
    "groups": [
      "protein"
    ],
    "ndb": "5140",
    "desc": "Duck, domesticated, meat and skin, cooked, roasted",
    "cal": 337.0,
    "pro": 19.0,
    "fat": 28.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 51.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 140.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook duck)",
        "gm": 173.0
      },
      {
        "amt": 0.5,
        "desc": "duck",
        "gm": 382.0
      }
    ]
  },
  {
    "word": "DUCKEGG",
    "display": "Duck Egg",
    "groups": [
      "protein"
    ],
    "ndb": "1138",
    "desc": "Egg, duck, whole, fresh, raw",
    "cal": 185.0,
    "pro": 12.8,
    "fat": 13.8,
    "carb": 1.4,
    "fib": 0.0,
    "h2o": 70.8,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "egg",
        "gm": 70.0
      }
    ]
  },
  {
    "word": "EEL",
    "display": "Eel",
    "groups": [
      "protein"
    ],
    "ndb": "15026",
    "desc": "Fish, eel, mixed species, cooked, dry heat",
    "cal": 236.0,
    "pro": 23.6,
    "fat": 14.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz, boneless",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "oz with bone (yield after bone removed)",
        "gm": 22.0
      },
      {
        "amt": 1.0,
        "desc": "cubic inch, boneless",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 159.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "EGG",
    "display": "Egg",
    "groups": [
      "protein"
    ],
    "ndb": "1123",
    "desc": "Egg, whole, raw, fresh",
    "cal": 143.0,
    "pro": 12.6,
    "fat": 9.5,
    "carb": 0.7,
    "fib": 0.0,
    "h2o": 76.2,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 50.0
      },
      {
        "amt": 1.0,
        "desc": "extra large",
        "gm": 56.0
      },
      {
        "amt": 1.0,
        "desc": "jumbo",
        "gm": 63.0
      },
      {
        "amt": 1.0,
        "desc": "cup (4.86 large eggs)",
        "gm": 243.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 44.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "EGGBOILED",
    "display": "Egg Boiled",
    "groups": [
      "protein"
    ],
    "ndb": "1129",
    "desc": "Egg, whole, cooked, hard-boiled",
    "cal": 155.0,
    "pro": 12.6,
    "fat": 10.6,
    "carb": 1.1,
    "fib": 0.0,
    "h2o": 74.6,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 136.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 8.5
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 50.0
      }
    ]
  },
  {
    "word": "EGGFRIED",
    "display": "Egg Fried",
    "groups": [
      "protein"
    ],
    "ndb": "1128",
    "desc": "Egg, whole, cooked, fried",
    "cal": 196.0,
    "pro": 13.6,
    "fat": 14.8,
    "carb": 0.8,
    "fib": 0.0,
    "h2o": 69.5,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 46.0
      }
    ]
  },
  {
    "word": "EGGOMELET",
    "display": "Egg Omelet",
    "groups": [
      "protein"
    ],
    "ndb": "1130",
    "desc": "Egg, whole, cooked, omelet",
    "cal": 154.0,
    "pro": 10.6,
    "fat": 11.7,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 76.1,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 61.0
      }
    ]
  },
  {
    "word": "EGGPOACHED",
    "display": "Egg Poached",
    "groups": [
      "protein"
    ],
    "ndb": "1131",
    "desc": "Egg, whole, cooked, poached",
    "cal": 143.0,
    "pro": 12.5,
    "fat": 9.5,
    "carb": 0.7,
    "fib": 0.0,
    "h2o": 75.8,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 50.0
      }
    ]
  },
  {
    "word": "EGGSCRAMBLED",
    "display": "Egg Scrambled",
    "groups": [
      "protein"
    ],
    "ndb": "1132",
    "desc": "Egg, whole, cooked, scrambled",
    "cal": 149.0,
    "pro": 10.0,
    "fat": 11.0,
    "carb": 1.6,
    "fib": 0.0,
    "h2o": 76.4,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 61.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.7
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 220.0
      }
    ]
  },
  {
    "word": "EGGWHITE",
    "display": "Egg White",
    "groups": [
      "protein"
    ],
    "ndb": "1124",
    "desc": "Egg, white, raw, fresh",
    "cal": 52.0,
    "pro": 10.9,
    "fat": 0.2,
    "carb": 0.7,
    "fib": 0.0,
    "h2o": 87.6,
    "sug": 0.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 243.0
      }
    ]
  },
  {
    "word": "EGGYOLK",
    "display": "Egg Yolk",
    "groups": [
      "protein"
    ],
    "ndb": "1125",
    "desc": "Egg, yolk, raw, fresh",
    "cal": 322.0,
    "pro": 15.9,
    "fat": 26.5,
    "carb": 3.6,
    "fib": 0.0,
    "h2o": 52.3,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 243.0
      }
    ]
  },
  {
    "word": "ELK",
    "display": "Elk",
    "groups": [
      "protein"
    ],
    "ndb": "17167",
    "desc": "Game meat, elk, cooked, roasted",
    "cal": 146.0,
    "pro": 30.2,
    "fat": 1.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 340.0
      }
    ]
  },
  {
    "word": "EYEOFROUND",
    "display": "Eye of Round",
    "groups": [
      "protein"
    ],
    "ndb": "13417",
    "desc": "Beef, round, eye of round roast, boneless, separable lean and fat, trimmed to 0\" fat, select, cooked, roasted",
    "cal": 162.0,
    "pro": 29.4,
    "fat": 4.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast (yield from 426 g raw meat)",
        "gm": 337.0
      }
    ]
  },
  {
    "word": "FILETMIGNON",
    "display": "Filet Mignon",
    "groups": [
      "protein"
    ],
    "ndb": "23600",
    "desc": "Beef, tenderloin, steak, separable lean only, trimmed to 1/8\" fat, all grades, cooked, broiled",
    "cal": 200.0,
    "pro": 29.0,
    "fat": 8.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "FISHSTICK",
    "display": "Fish Stick",
    "groups": [
      "protein"
    ],
    "ndb": "15027",
    "desc": "Fish, fish sticks, frozen, prepared",
    "cal": 277.0,
    "pro": 11.0,
    "fat": 16.2,
    "carb": 21.7,
    "fib": 1.5,
    "h2o": 49.5,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece (4\" x 2\" x 1/2\")",
        "gm": 57.0
      },
      {
        "amt": 1.0,
        "desc": "stick (4\" x 1\" x 1/2\")",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "FLANKSTEAK",
    "display": "Flank Steak",
    "groups": [
      "protein"
    ],
    "ndb": "13948",
    "desc": "Beef, flank, steak, separable lean and fat, trimmed to 0\" fat, all grades, cooked, broiled",
    "cal": 192.0,
    "pro": 27.7,
    "fat": 8.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak (yield from 475 g raw meat)",
        "gm": 383.0
      }
    ]
  },
  {
    "word": "FLATFISH",
    "display": "Flatfish",
    "groups": [
      "protein"
    ],
    "ndb": "15029",
    "desc": "Fish, flatfish (flounder and sole species), cooked, dry heat",
    "cal": 86.0,
    "pro": 15.2,
    "fat": 2.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 81.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 127.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "FLOUNDER",
    "display": "Flounder",
    "groups": [
      "protein"
    ],
    "ndb": "15029",
    "desc": "Fish, flatfish (flounder and sole species), cooked, dry heat",
    "cal": 86.0,
    "pro": 15.2,
    "fat": 2.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 81.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 127.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "FOIEGRAS",
    "display": "Foiegras",
    "groups": [
      "protein"
    ],
    "ndb": "5282",
    "desc": "Pate de foie gras, canned (goose liver pate), smoked",
    "cal": 462.0,
    "pro": 11.4,
    "fat": 43.8,
    "carb": 4.7,
    "fib": 0.0,
    "h2o": 37.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "FORESHANKLAMB",
    "display": "Foreshank Lamb",
    "groups": [
      "protein"
    ],
    "ndb": "17008",
    "desc": "Lamb, domestic, foreshank, separable lean and fat, trimmed to 1/4\" fat, choice, cooked, braised",
    "cal": 243.0,
    "pro": 28.4,
    "fat": 13.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 148.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "FRANKFURTER",
    "display": "Frankfurter",
    "groups": [
      "protein"
    ],
    "ndb": "7945",
    "desc": "Frankfurter, beef, heated",
    "cal": 322.0,
    "pro": 11.7,
    "fat": 29.4,
    "carb": 2.7,
    "fib": 0.0,
    "h2o": 53.5,
    "sug": 1.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "frankfurter",
        "gm": 48.0
      },
      {
        "amt": 1.0,
        "desc": "package",
        "gm": 451.0
      }
    ]
  },
  {
    "word": "FROG",
    "display": "Frog",
    "groups": [
      "protein"
    ],
    "ndb": "80200",
    "desc": "Frog legs, raw",
    "cal": 73.0,
    "pro": 16.4,
    "fat": 0.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 81.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "leg",
        "gm": 45.0
      }
    ]
  },
  {
    "word": "FRYERS",
    "display": "Fryers",
    "groups": [
      "protein"
    ],
    "ndb": "5045",
    "desc": "Chicken, broilers or fryers, dark meat, meat only, cooked, roasted",
    "cal": 205.0,
    "pro": 27.4,
    "fat": 9.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 63.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 140.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook chicken)",
        "gm": 81.0
      },
      {
        "amt": 0.5,
        "desc": "chicken, bone and skin removed",
        "gm": 136.0
      }
    ]
  },
  {
    "word": "GEFILTEFISH",
    "display": "Gefilte Fish",
    "groups": [
      "protein"
    ],
    "ndb": "15030",
    "desc": "Fish, gefiltefish, commercial, sweet recipe",
    "cal": 84.0,
    "pro": 9.1,
    "fat": 1.7,
    "carb": 7.4,
    "fib": 0.0,
    "h2o": 80.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 42.0
      }
    ]
  },
  {
    "word": "GIBLETS",
    "display": "Giblets",
    "groups": [
      "protein"
    ],
    "ndb": "5021",
    "desc": "Chicken, broilers or fryers, giblets, cooked, fried",
    "cal": 277.0,
    "pro": 32.5,
    "fat": 13.5,
    "carb": 4.3,
    "fib": 0.0,
    "h2o": 47.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 145.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook chicken)",
        "gm": 13.0
      }
    ]
  },
  {
    "word": "GIZZARD",
    "display": "Gizzard",
    "groups": [
      "protein"
    ],
    "ndb": "5024",
    "desc": "Chicken, gizzard, all classes, cooked, simmered",
    "cal": 154.0,
    "pro": 30.4,
    "fat": 2.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 67.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup chopped or dice",
        "gm": 145.0
      }
    ]
  },
  {
    "word": "GOAT",
    "display": "Goat",
    "groups": [
      "protein"
    ],
    "ndb": "17169",
    "desc": "Game meat, goat, cooked, roasted",
    "cal": 143.0,
    "pro": 27.1,
    "fat": 3.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 340.0
      }
    ]
  },
  {
    "word": "GOOSE",
    "display": "Goose",
    "groups": [
      "protein"
    ],
    "ndb": "5149",
    "desc": "Goose, domesticated, meat only, cooked, roasted",
    "cal": 238.0,
    "pro": 29.0,
    "fat": 12.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook goose)",
        "gm": 143.0
      },
      {
        "amt": 0.5,
        "desc": "goose",
        "gm": 591.0
      }
    ]
  },
  {
    "word": "GOOSEEGG",
    "display": "Goose Egg",
    "groups": [
      "protein"
    ],
    "ndb": "1139",
    "desc": "Egg, goose, whole, fresh, raw",
    "cal": 185.0,
    "pro": 13.9,
    "fat": 13.3,
    "carb": 1.4,
    "fib": 0.0,
    "h2o": 70.4,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "egg",
        "gm": 144.0
      }
    ]
  },
  {
    "word": "GOOSELIVER",
    "display": "Goose Liver",
    "groups": [
      "protein"
    ],
    "ndb": "7054",
    "desc": "Pate, goose liver, smoked, canned",
    "cal": 462.0,
    "pro": 11.4,
    "fat": 43.8,
    "carb": 4.7,
    "fib": 0.0,
    "h2o": 37.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "GROUPER",
    "display": "Grouper",
    "groups": [
      "protein"
    ],
    "ndb": "15032",
    "desc": "Fish, grouper, mixed species, cooked, dry heat",
    "cal": 118.0,
    "pro": 24.8,
    "fat": 1.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 202.0
      }
    ]
  },
  {
    "word": "GUINEA",
    "display": "Guinea",
    "groups": [
      "protein"
    ],
    "ndb": "5151",
    "desc": "Guinea hen, meat and skin, raw",
    "cal": 158.0,
    "pro": 23.4,
    "fat": 6.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook guinea)",
        "gm": 359.0
      },
      {
        "amt": 0.5,
        "desc": "guinea",
        "gm": 345.0
      }
    ]
  },
  {
    "word": "HADDOCK",
    "display": "Haddock",
    "groups": [
      "protein"
    ],
    "ndb": "15034",
    "desc": "Fish, haddock, cooked, dry heat",
    "cal": 90.0,
    "pro": 20.0,
    "fat": 0.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 79.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 150.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "HALIBUT",
    "display": "Halibut",
    "groups": [
      "protein"
    ],
    "ndb": "15037",
    "desc": "Fish, halibut, Atlantic and Pacific, cooked, dry heat",
    "cal": 111.0,
    "pro": 22.5,
    "fat": 1.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 76.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 159.0
      }
    ]
  },
  {
    "word": "HAM",
    "display": "Ham",
    "groups": [
      "protein"
    ],
    "ndb": "7029",
    "desc": "Ham, sliced, regular (approximately 11% fat)",
    "cal": 163.0,
    "pro": 16.6,
    "fat": 8.6,
    "carb": 3.8,
    "fib": 1.3,
    "h2o": 67.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 56.0,
        "desc": "grams 1 serving",
        "gm": 56.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "HERRING",
    "display": "Herring",
    "groups": [
      "protein"
    ],
    "ndb": "15040",
    "desc": "Fish, herring, Atlantic, cooked, dry heat",
    "cal": 203.0,
    "pro": 23.0,
    "fat": 11.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 143.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "HINDSHANKLAMB",
    "display": "Hindshank Lamb",
    "groups": [
      "protein"
    ],
    "ndb": "17440",
    "desc": "Lamb, Australian, imported, fresh, leg, hindshank, heel on, bone-in, separable lean only, trimmed to 1/8\" fat, cooked, braised",
    "cal": 174.0,
    "pro": 30.7,
    "fat": 5.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "leg hindshank, heel on",
        "gm": 418.0
      }
    ]
  },
  {
    "word": "HORSE",
    "display": "Horse",
    "groups": [
      "protein"
    ],
    "ndb": "17171",
    "desc": "Game meat, horse, cooked, roasted",
    "cal": 175.0,
    "pro": 28.1,
    "fat": 6.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 340.0
      }
    ]
  },
  {
    "word": "JELLYFISH",
    "display": "Jellyfish",
    "groups": [
      "protein"
    ],
    "ndb": "43497",
    "desc": "Jellyfish, dried, salted",
    "cal": 36.0,
    "pro": 5.5,
    "fat": 1.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 58.0
      }
    ]
  },
  {
    "word": "KIELBASA",
    "display": "Kielbasa",
    "groups": [
      "protein"
    ],
    "ndb": "7968",
    "desc": "Kielbasa, fully cooked, grilled",
    "cal": 337.0,
    "pro": 12.4,
    "fat": 29.7,
    "carb": 5.0,
    "fib": 0.0,
    "h2o": 49.4,
    "sug": 2.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "link",
        "gm": 367.0
      }
    ]
  },
  {
    "word": "LAMBCHOP",
    "display": "Lamb Chop",
    "groups": [
      "protein"
    ],
    "ndb": "17078",
    "desc": "Lamb, New Zealand, imported, loin chop, separable lean only, raw",
    "cal": 142.0,
    "pro": 20.0,
    "fat": 6.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 71.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 115.0
      }
    ]
  },
  {
    "word": "LAMBGROUND",
    "display": "Lamb Ground",
    "groups": [
      "protein"
    ],
    "ndb": "17224",
    "desc": "Lamb, ground, raw",
    "cal": 282.0,
    "pro": 16.6,
    "fat": 23.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 4.0,
        "desc": "oz",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "LAMBLEG",
    "display": "Lamb Leg",
    "groups": [
      "protein"
    ],
    "ndb": "17012",
    "desc": "Lamb, domestic, leg, whole (shank and sirloin), separable lean and fat, trimmed to 1/4\" fat, choice, cooked, roasted",
    "cal": 258.0,
    "pro": 25.6,
    "fat": 16.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 265.0
      }
    ]
  },
  {
    "word": "LAMBRACK",
    "display": "Lamb Rack",
    "groups": [
      "protein"
    ],
    "ndb": "17463",
    "desc": "Lamb, Australian, imported, fresh, rack, roast, frenched, bone-in, separable lean and fat, trimmed to 1/8\" fat, cooked, roasted",
    "cal": 291.0,
    "pro": 26.0,
    "fat": 20.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 53.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast",
        "gm": 447.0
      }
    ]
  },
  {
    "word": "LAMBSHANK",
    "display": "Lamb Shank",
    "groups": [
      "protein"
    ],
    "ndb": "17295",
    "desc": "Lamb, Australian, imported, fresh, leg, shank half, separable lean and fat, trimmed to 1/8\" fat, cooked, roasted",
    "cal": 231.0,
    "pro": 25.2,
    "fat": 13.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 60.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 277.0
      }
    ]
  },
  {
    "word": "LING",
    "display": "Ling",
    "groups": [
      "protein"
    ],
    "ndb": "15198",
    "desc": "Fish, ling, cooked, dry heat",
    "cal": 111.0,
    "pro": 24.4,
    "fat": 0.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 151.0
      }
    ]
  },
  {
    "word": "LINGCOD",
    "display": "Lingcod",
    "groups": [
      "protein"
    ],
    "ndb": "15199",
    "desc": "Fish, lingcod, cooked, dry heat",
    "cal": 109.0,
    "pro": 22.6,
    "fat": 1.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 75.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 151.0
      }
    ]
  },
  {
    "word": "LIVER",
    "display": "Liver",
    "groups": [
      "protein"
    ],
    "ndb": "7040",
    "desc": "Liver cheese, pork",
    "cal": 304.0,
    "pro": 15.2,
    "fat": 25.6,
    "carb": 2.1,
    "fib": 0.0,
    "h2o": 53.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 38.0
      }
    ]
  },
  {
    "word": "LIVERWURST",
    "display": "Liverwurst",
    "groups": [
      "protein"
    ],
    "ndb": "7911",
    "desc": "Liverwurst spread",
    "cal": 305.0,
    "pro": 12.4,
    "fat": 25.4,
    "carb": 5.9,
    "fib": 2.5,
    "h2o": 53.5,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.25,
        "desc": "cup",
        "gm": 55.0
      }
    ]
  },
  {
    "word": "LOBSTER",
    "display": "Lobster",
    "groups": [
      "protein"
    ],
    "ndb": "15148",
    "desc": "Crustaceans, lobster, northern, cooked, moist heat",
    "cal": 89.0,
    "pro": 19.0,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 78.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 145.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MACKEREL",
    "display": "Mackerel",
    "groups": [
      "protein"
    ],
    "ndb": "15047",
    "desc": "Fish, mackerel, Atlantic, cooked, dry heat",
    "cal": 262.0,
    "pro": 23.9,
    "fat": 17.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 53.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 88.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MAHI",
    "display": "Mahi",
    "groups": [
      "protein"
    ],
    "ndb": "15194",
    "desc": "Fish, mahimahi, cooked, dry heat",
    "cal": 109.0,
    "pro": 23.7,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 71.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 159.0
      }
    ]
  },
  {
    "word": "MEATBALLS",
    "display": "Meatballs",
    "groups": [
      "protein"
    ],
    "ndb": "43132",
    "desc": "Meatballs, meatless",
    "cal": 197.0,
    "pro": 21.0,
    "fat": 9.0,
    "carb": 8.0,
    "fib": 4.6,
    "h2o": 58.0,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 144.0
      }
    ]
  },
  {
    "word": "MIGNON",
    "display": "Mignon",
    "groups": [
      "protein"
    ],
    "ndb": "13921",
    "desc": "Beef, tenderloin, steak, separable lean and fat, trimmed to 1/8\" fat, choice, cooked, broiled",
    "cal": 273.0,
    "pro": 26.4,
    "fat": 17.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 55.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "steak (yield from 181 g raw meat)",
        "gm": 140.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MILKFISH",
    "display": "Milkfish",
    "groups": [
      "protein"
    ],
    "ndb": "15202",
    "desc": "Fish, milkfish, cooked, dry heat",
    "cal": 190.0,
    "pro": 26.3,
    "fat": 8.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MONKFISH",
    "display": "Monkfish",
    "groups": [
      "protein"
    ],
    "ndb": "15203",
    "desc": "Fish, monkfish, cooked, dry heat",
    "cal": 97.0,
    "pro": 18.6,
    "fat": 1.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 78.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MOOSE",
    "display": "Moose",
    "groups": [
      "protein"
    ],
    "ndb": "35049",
    "desc": "Moose, meat, raw (Alaska Native)",
    "cal": 103.0,
    "pro": 22.3,
    "fat": 1.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "MORTADELLA",
    "display": "Mortadella",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "7050",
    "desc": "Mortadella, beef, pork",
    "cal": 311.0,
    "pro": 16.4,
    "fat": 25.4,
    "carb": 3.0,
    "fib": 0.0,
    "h2o": 52.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice (15 per 8 oz package)",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "MULLET",
    "display": "Mullet",
    "groups": [
      "protein"
    ],
    "ndb": "15056",
    "desc": "Fish, mullet, striped, cooked, dry heat",
    "cal": 150.0,
    "pro": 24.8,
    "fat": 4.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 93.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MUSKRAT",
    "display": "Muskrat",
    "groups": [
      "protein"
    ],
    "ndb": "17175",
    "desc": "Game meat, muskrat, cooked, roasted",
    "cal": 234.0,
    "pro": 30.1,
    "fat": 11.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 55.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 313.0
      }
    ]
  },
  {
    "word": "MUSSEL",
    "display": "Mussel",
    "groups": [
      "protein"
    ],
    "ndb": "15165",
    "desc": "Mollusks, mussel, blue, cooked, moist heat",
    "cal": 172.0,
    "pro": 23.8,
    "fat": 4.5,
    "carb": 7.4,
    "fib": 0.0,
    "h2o": 61.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "MUTTON",
    "display": "Mutton",
    "groups": [
      "protein"
    ],
    "ndb": "35141",
    "desc": "Mutton, cooked, roasted (Navajo)",
    "cal": 234.0,
    "pro": 33.4,
    "fat": 11.1,
    "carb": 0.1,
    "fib": 0.0,
    "h2o": 54.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "NECK",
    "display": "Neck",
    "groups": [
      "protein"
    ],
    "ndb": "5089",
    "desc": "Chicken, broilers or fryers, neck, meat only, cooked, fried",
    "cal": 229.0,
    "pro": 26.9,
    "fat": 11.9,
    "carb": 1.8,
    "fib": 0.0,
    "h2o": 58.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook chicken)",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "neck, bone and skin removed",
        "gm": 22.0
      }
    ]
  },
  {
    "word": "NEWYORKSTRIP",
    "display": "New York Strip",
    "groups": [
      "protein"
    ],
    "ndb": "23284",
    "desc": "Beef, top loin filet, boneless, separable lean and fat, trimmed to 1/8\" fat, all grades, cooked, grilled",
    "cal": 239.0,
    "pro": 27.4,
    "fat": 14.1,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 56.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 135.0
      }
    ]
  },
  {
    "word": "OCTOPUS",
    "display": "Octopus",
    "groups": [
      "protein"
    ],
    "ndb": "35054",
    "desc": "Octopus (Alaska Native)",
    "cal": 56.0,
    "pro": 12.3,
    "fat": 0.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 84.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "OPOSSUM",
    "display": "Opossum",
    "groups": [
      "protein"
    ],
    "ndb": "17176",
    "desc": "Game meat, opossum, cooked, roasted",
    "cal": 221.0,
    "pro": 30.2,
    "fat": 10.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 58.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 399.0
      }
    ]
  },
  {
    "word": "OSTRICH",
    "display": "Ostrich",
    "groups": [
      "protein"
    ],
    "ndb": "5647",
    "desc": "Ostrich, inside strip, cooked",
    "cal": 164.0,
    "pro": 29.4,
    "fat": 4.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving ( 3 oz )",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "OYSTERCOOKED",
    "display": "Oyster Cooked",
    "groups": [
      "protein"
    ],
    "ndb": "15231",
    "desc": "Mollusks, oyster, Pacific, cooked, moist heat",
    "cal": 163.0,
    "pro": 18.9,
    "fat": 4.6,
    "carb": 9.9,
    "fib": 0.0,
    "h2o": 64.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 25.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "OYSTERRAW",
    "display": "Oyster Raw",
    "groups": [
      "protein"
    ],
    "ndb": "15171",
    "desc": "Mollusks, oyster, Pacific, raw",
    "cal": 81.0,
    "pro": 9.4,
    "fat": 2.3,
    "carb": 5.0,
    "fib": 0.0,
    "h2o": 82.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 50.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PASTRAMI",
    "display": "Pastrami",
    "groups": [
      "protein"
    ],
    "ndb": "13355",
    "desc": "Beef, cured, pastrami",
    "cal": 147.0,
    "pro": 21.8,
    "fat": 5.8,
    "carb": 0.4,
    "fib": 0.0,
    "h2o": 69.5,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "package, 2.5 oz",
        "gm": 71.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1 oz)",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "PATE",
    "display": "Pate",
    "groups": [
      "protein"
    ],
    "ndb": "7942",
    "desc": "Pate, truffle flavor",
    "cal": 327.0,
    "pro": 11.2,
    "fat": 28.5,
    "carb": 6.3,
    "fib": 0.0,
    "h2o": 51.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 2 oz",
        "gm": 56.0
      }
    ]
  },
  {
    "word": "PEPPERONI",
    "display": "Pepperoni",
    "groups": [
      "protein"
    ],
    "ndb": "7057",
    "desc": "Pepperoni, beef and pork, sliced",
    "cal": 504.0,
    "pro": 19.2,
    "fat": 46.3,
    "carb": 1.2,
    "fib": 0.0,
    "h2o": 28.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 2.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "PERCH",
    "display": "Perch",
    "groups": [
      "protein"
    ],
    "ndb": "15061",
    "desc": "Fish, perch, mixed species, cooked, dry heat",
    "cal": 117.0,
    "pro": 24.9,
    "fat": 1.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 46.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PHEASANT",
    "display": "Pheasant",
    "groups": [
      "protein"
    ],
    "ndb": "43283",
    "desc": "Pheasant, cooked, total edible",
    "cal": 239.0,
    "pro": 32.4,
    "fat": 12.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 54.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 140.0
      }
    ]
  },
  {
    "word": "PIGEON",
    "display": "Pigeon",
    "groups": [
      "protein"
    ],
    "ndb": "5160",
    "desc": "Squab, (pigeon), meat and skin, raw",
    "cal": 294.0,
    "pro": 18.5,
    "fat": 23.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook squab)",
        "gm": 297.0
      },
      {
        "amt": 1.0,
        "desc": "squab",
        "gm": 199.0
      }
    ]
  },
  {
    "word": "PIKE",
    "display": "Pike",
    "groups": [
      "protein"
    ],
    "ndb": "15063",
    "desc": "Fish, pike, northern, cooked, dry heat",
    "cal": 113.0,
    "pro": 24.7,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "POKE",
    "display": "Poke",
    "groups": [
      "protein"
    ],
    "ndb": "11351",
    "desc": "Pokeberry shoots, (poke), cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 2.3,
    "fat": 0.4,
    "carb": 3.1,
    "fib": 1.5,
    "h2o": 92.9,
    "sug": 1.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "POLLOCK",
    "display": "Pollock",
    "groups": [
      "protein"
    ],
    "ndb": "15205",
    "desc": "Fish, pollock, Atlantic, cooked, dry heat",
    "cal": 118.0,
    "pro": 24.9,
    "fat": 1.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 72.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 151.0
      }
    ]
  },
  {
    "word": "POMPANO",
    "display": "Pompano",
    "groups": [
      "protein"
    ],
    "ndb": "15069",
    "desc": "Fish, pompano, florida, cooked, dry heat",
    "cal": 211.0,
    "pro": 23.7,
    "fat": 12.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 63.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 88.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PORKGROUND",
    "display": "Pork Ground",
    "groups": [
      "protein"
    ],
    "ndb": "10975",
    "desc": "Pork, ground, 84% lean / 16% fat, cooked, crumbles",
    "cal": 289.0,
    "pro": 26.7,
    "fat": 20.0,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 51.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz grilled patties",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PORK",
    "display": "Pork",
    "groups": [
      "protein"
    ],
    "ndb": "10062",
    "desc": "Pork, fresh, loin, top loin (chops), boneless, separable lean and fat, raw",
    "cal": 155.0,
    "pro": 21.6,
    "fat": 6.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "chop",
        "gm": 185.0
      }
    ]
  },
  {
    "word": "PORKBACKRIB",
    "display": "Pork Back Rib",
    "groups": [
      "protein"
    ],
    "ndb": "10193",
    "desc": "Pork, fresh, backribs, separable lean and fat, cooked, roasted",
    "cal": 292.0,
    "pro": 23.0,
    "fat": 21.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 54.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PORKBELLY",
    "display": "Pork Belly",
    "groups": [
      "protein"
    ],
    "ndb": "10005",
    "desc": "Pork, fresh, belly, raw",
    "cal": 518.0,
    "pro": 9.3,
    "fat": 53.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 36.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "PORKCHOP",
    "display": "Pork Chop",
    "groups": [
      "protein"
    ],
    "ndb": "10189",
    "desc": "Pork, fresh, loin, center loin (chops), boneless, separable lean and fat, cooked, pan-broiled",
    "cal": 229.0,
    "pro": 26.7,
    "fat": 13.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "chop",
        "gm": 137.0
      }
    ]
  },
  {
    "word": "PORKHAMLEG",
    "display": "Pork Ham Leg",
    "groups": [
      "protein"
    ],
    "ndb": "10009",
    "desc": "Pork, fresh, leg (ham), whole, separable lean and fat, cooked, roasted",
    "cal": 273.0,
    "pro": 26.8,
    "fat": 17.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 55.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 135.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PORKPICNIC",
    "display": "Pork Picnic",
    "groups": [
      "protein"
    ],
    "ndb": "10076",
    "desc": "Pork, fresh, shoulder, arm picnic, separable lean and fat, cooked, roasted",
    "cal": 317.0,
    "pro": 23.5,
    "fat": 24.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 52.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 135.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PORKSAUSAGE",
    "display": "Pork Sausage",
    "groups": [
      "protein"
    ],
    "ndb": "7064",
    "desc": "Pork sausage, link/patty, cooked, pan-fried",
    "cal": 325.0,
    "pro": 18.5,
    "fat": 27.2,
    "carb": 1.4,
    "fib": 0.0,
    "h2o": 49.9,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "patty",
        "gm": 27.0
      },
      {
        "amt": 1.0,
        "desc": "link",
        "gm": 23.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 48.0
      }
    ]
  },
  {
    "word": "PORKSHOULDER",
    "display": "Pork Shoulder",
    "groups": [
      "protein"
    ],
    "ndb": "10083",
    "desc": "Pork, fresh, shoulder, blade, boston (roasts), separable lean and fat, cooked, roasted",
    "cal": 269.0,
    "pro": 23.1,
    "fat": 18.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 262.0
      }
    ]
  },
  {
    "word": "PORKTENDERLOIN",
    "display": "Pork Tenderloin",
    "groups": [
      "protein"
    ],
    "ndb": "10221",
    "desc": "Pork, fresh, loin, tenderloin, separable lean and fat, cooked, broiled",
    "cal": 201.0,
    "pro": 29.9,
    "fat": 8.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 61.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "chop, excluding refuse (yield from 1 raw chop, wit",
        "gm": 76.0
      }
    ]
  },
  {
    "word": "PORTERHOUSEBEEF",
    "display": "Porterhouse Beef",
    "groups": [
      "protein"
    ],
    "ndb": "13459",
    "desc": "Beef, short loin, porterhouse steak, separable lean and fat, trimmed to 0\" fat, all grades, cooked, broiled",
    "cal": 276.0,
    "pro": 24.0,
    "fat": 19.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 54.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "PORTERHOUSEPORK",
    "display": "Porterhouse Pork",
    "groups": [
      "protein"
    ],
    "ndb": "10037",
    "desc": "Pork, fresh, loin, center loin (chops), bone-in, separable lean and fat, cooked, braised",
    "cal": 242.0,
    "pro": 28.2,
    "fat": 13.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 58.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "chop",
        "gm": 187.0
      }
    ]
  },
  {
    "word": "POTPIEBEEF",
    "display": "Pot Pie Beef",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "22529",
    "desc": "Beef Pot Pie, frozen entree, prepared",
    "cal": 220.0,
    "pro": 7.2,
    "fat": 11.4,
    "carb": 22.1,
    "fib": 0.8,
    "h2o": 58.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pie, cooked (average weight)",
        "gm": 268.0
      }
    ]
  },
  {
    "word": "POTPIECHICKEN",
    "display": "Pot Pie Chicken",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "22906",
    "desc": "Chicken pot pie, frozen entree, prepared",
    "cal": 204.0,
    "pro": 5.1,
    "fat": 11.8,
    "carb": 19.2,
    "fib": 1.1,
    "h2o": 62.6,
    "sug": 2.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "pie",
        "gm": 302.0
      }
    ]
  },
  {
    "word": "POTPIETURKEY",
    "display": "Pot Pie Turkey",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "22528",
    "desc": "Turkey Pot Pie, frozen entree",
    "cal": 176.0,
    "pro": 6.5,
    "fat": 8.8,
    "carb": 17.7,
    "fib": 1.1,
    "h2o": 65.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "package yields",
        "gm": 397.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 397.0
      }
    ]
  },
  {
    "word": "POTROAST",
    "display": "Pot Roast",
    "groups": [
      "protein"
    ],
    "ndb": "13373",
    "desc": "Beef, chuck, arm pot roast, separable lean and fat, trimmed to 0\" fat, all grades, cooked, braised",
    "cal": 297.0,
    "pro": 28.9,
    "fat": 19.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 51.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast (yield from 1601 g raw meat)",
        "gm": 1166.0
      }
    ]
  },
  {
    "word": "POUT",
    "display": "Pout",
    "groups": [
      "protein"
    ],
    "ndb": "15206",
    "desc": "Fish, pout, ocean, cooked, dry heat",
    "cal": 102.0,
    "pro": 21.3,
    "fat": 1.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 76.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 137.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "PRAWN",
    "display": "Prawn",
    "groups": [
      "protein"
    ],
    "ndb": "15151",
    "desc": "Crustaceans, shrimp, mixed species, cooked, moist heat (may have been previously frozen)",
    "cal": 119.0,
    "pro": 22.8,
    "fat": 1.7,
    "carb": 1.5,
    "fib": 0.0,
    "h2o": 71.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 4.0,
        "desc": "large",
        "gm": 22.0
      }
    ]
  },
  {
    "word": "PROSCIUTTO",
    "display": "Prosciutto",
    "groups": [
      "protein"
    ],
    "ndb": "7057",
    "desc": "Pepperoni, beef and pork, sliced",
    "cal": 504.0,
    "pro": 19.2,
    "fat": 46.3,
    "carb": 1.2,
    "fib": 0.0,
    "h2o": 28.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 2.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "QUAIL",
    "display": "Quail",
    "groups": [
      "protein"
    ],
    "ndb": "43282",
    "desc": "Quail, cooked, total edible",
    "cal": 227.0,
    "pro": 25.1,
    "fat": 14.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 60.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.0
      }
    ]
  },
  {
    "word": "QUAILEGG",
    "display": "Quail Egg",
    "groups": [
      "protein"
    ],
    "ndb": "1140",
    "desc": "Egg, quail, whole, fresh, raw",
    "cal": 158.0,
    "pro": 13.1,
    "fat": 11.1,
    "carb": 0.4,
    "fib": 0.0,
    "h2o": 74.3,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "egg",
        "gm": 9.0
      }
    ]
  },
  {
    "word": "RABBIT",
    "display": "Rabbit",
    "groups": [
      "protein"
    ],
    "ndb": "17178",
    "desc": "Game meat, rabbit, domesticated, composite of cuts, cooked, roasted",
    "cal": 197.0,
    "pro": 29.1,
    "fat": 8.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 60.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 313.0
      }
    ]
  },
  {
    "word": "RACCOON",
    "display": "Raccoon",
    "groups": [
      "protein"
    ],
    "ndb": "17182",
    "desc": "Game meat, raccoon, cooked, roasted",
    "cal": 255.0,
    "pro": 29.2,
    "fat": 14.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 54.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked (yield from 1 lb raw meat, boneless)",
        "gm": 399.0
      }
    ]
  },
  {
    "word": "RACK",
    "display": "Rack",
    "groups": [
      "protein"
    ],
    "ndb": "17081",
    "desc": "Lamb, New Zealand, imported, rack - partly frenched, separable lean and fat, cooked, fast roasted",
    "cal": 253.0,
    "pro": 22.1,
    "fat": 18.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "RIBEYE",
    "display": "Ribeye",
    "groups": [
      "protein"
    ],
    "ndb": "23266",
    "desc": "Beef, ribeye cap steak, boneless, separable lean only, trimmed to 0\" fat, all grades, cooked, grilled",
    "cal": 246.0,
    "pro": 24.7,
    "fat": 15.7,
    "carb": 1.5,
    "fib": 0.0,
    "h2o": 57.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak",
        "gm": 209.0
      }
    ]
  },
  {
    "word": "RIBS",
    "display": "Ribs",
    "groups": [
      "protein"
    ],
    "ndb": "23430",
    "desc": "Beef, New Zealand, imported, ribs prepared, cooked, fast roasted",
    "cal": 197.0,
    "pro": 27.2,
    "fat": 9.7,
    "carb": 0.1,
    "fib": 0.0,
    "h2o": 61.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ROASTBEEF",
    "display": "Roast Beef",
    "groups": [
      "protein"
    ],
    "ndb": "7043",
    "desc": "Roast beef, deli style, prepackaged, sliced",
    "cal": 115.0,
    "pro": 18.6,
    "fat": 3.7,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 73.7,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice oval",
        "gm": 9.3
      },
      {
        "amt": 1.0,
        "desc": "slice rectangle",
        "gm": 13.8
      }
    ]
  },
  {
    "word": "ROCKFISH",
    "display": "Rockfish",
    "groups": [
      "protein"
    ],
    "ndb": "15071",
    "desc": "Fish, rockfish, Pacific, mixed species, cooked, dry heat",
    "cal": 109.0,
    "pro": 22.2,
    "fat": 1.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 149.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ROE",
    "display": "Roe",
    "groups": [
      "protein"
    ],
    "ndb": "15072",
    "desc": "Fish, roe, mixed species, raw",
    "cal": 143.0,
    "pro": 22.3,
    "fat": 6.4,
    "carb": 1.5,
    "fib": 0.0,
    "h2o": 67.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "can (8 oz), solids and liquid",
        "gm": 227.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ROLLHOTDOG",
    "display": "Roll Hotdog",
    "groups": [
      "protein"
    ],
    "ndb": "18350",
    "desc": "Rolls, hamburger or hotdog, plain",
    "cal": 279.0,
    "pro": 9.8,
    "fat": 3.9,
    "carb": 50.1,
    "fib": 1.8,
    "h2o": 34.3,
    "sug": 7.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roll 1 serving",
        "gm": 44.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "ROUGHY",
    "display": "Roughy",
    "groups": [
      "protein"
    ],
    "ndb": "15232",
    "desc": "Fish, roughy, orange, cooked, dry heat",
    "cal": 105.0,
    "pro": 22.6,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 67.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ROUNDROASTBOTTOM",
    "display": "Round Roast Bottom",
    "groups": [
      "protein"
    ],
    "ndb": "13399",
    "desc": "Beef, round, bottom round, roast, separable lean and fat, trimmed to 0\" fat, all grades, cooked, roasted",
    "cal": 187.0,
    "pro": 27.4,
    "fat": 7.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast (yield from 600 g raw meat)",
        "gm": 489.0
      }
    ]
  },
  {
    "word": "ROUNDROASTTOP",
    "display": "Round Roast Top",
    "groups": [
      "protein"
    ],
    "ndb": "23348",
    "desc": "Beef, round, top round roast, boneless, separable lean and fat, trimmed to 0\" fat, all grades, cooked, roasted",
    "cal": 160.0,
    "pro": 29.9,
    "fat": 4.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ROUNDSTEAK",
    "display": "Round Steak",
    "groups": [
      "protein"
    ],
    "ndb": "13491",
    "desc": "Beef, round, top round steak, boneless, separable lean only, trimmed to 0\" fat, all grades, cooked, grilled",
    "cal": 162.0,
    "pro": 30.1,
    "fat": 3.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 64.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak",
        "gm": 277.0
      }
    ]
  },
  {
    "word": "RUMP",
    "display": "Rump",
    "groups": [
      "protein"
    ],
    "ndb": "10013",
    "desc": "Pork, fresh, leg (ham), rump half, separable lean and fat, cooked, roasted",
    "cal": 209.0,
    "pro": 27.0,
    "fat": 10.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 61.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 135.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SABLEFISH",
    "display": "Sablefish",
    "groups": [
      "protein"
    ],
    "ndb": "15208",
    "desc": "Fish, sablefish, cooked, dry heat",
    "cal": 250.0,
    "pro": 17.2,
    "fat": 19.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 151.0
      }
    ]
  },
  {
    "word": "SALAMI",
    "display": "Salami",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "7068",
    "desc": "Salami, cooked, beef",
    "cal": 261.0,
    "pro": 12.6,
    "fat": 22.2,
    "carb": 1.9,
    "fib": 0.0,
    "h2o": 60.0,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 26.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "SALISBURY",
    "display": "Salisbury",
    "groups": [
      "protein"
    ],
    "ndb": "32031",
    "desc": "Salisbury steak with gravy, frozen",
    "cal": 149.0,
    "pro": 7.0,
    "fat": 10.5,
    "carb": 6.8,
    "fib": 1.0,
    "h2o": 74.2,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "patty",
        "gm": 63.0
      }
    ]
  },
  {
    "word": "SALMON",
    "display": "Salmon",
    "groups": [
      "protein",
      "fats"
    ],
    "ndb": "15210",
    "desc": "Fish, salmon, chinook, cooked, dry heat",
    "cal": 231.0,
    "pro": 25.7,
    "fat": 13.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 154.0
      }
    ]
  },
  {
    "word": "SALTPORK",
    "display": "Salt Pork",
    "groups": [
      "protein"
    ],
    "ndb": "10165",
    "desc": "Pork, cured, salt pork, raw",
    "cal": 748.0,
    "pro": 5.0,
    "fat": 80.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 11.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 8.0,
        "desc": "oz",
        "gm": 227.0
      }
    ]
  },
  {
    "word": "SARDINE",
    "display": "Sardine",
    "groups": [
      "protein"
    ],
    "ndb": "15088",
    "desc": "Fish, sardine, Atlantic, canned in oil, drained solids with bone",
    "cal": 208.0,
    "pro": 24.6,
    "fat": 11.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, drained",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "can (3.75 oz)",
        "gm": 92.0
      },
      {
        "amt": 1.0,
        "desc": "small (2-2/3\" x 1/2\" x 1/4\")",
        "gm": 12.0
      },
      {
        "amt": 2.0,
        "desc": "sardines",
        "gm": 24.0
      }
    ]
  },
  {
    "word": "SAUSAGEBEEF",
    "display": "Sausage Beef",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "7956",
    "desc": "Beef sausage, fresh, cooked",
    "cal": 332.0,
    "pro": 18.2,
    "fat": 28.0,
    "carb": 0.3,
    "fib": 0.0,
    "h2o": 51.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 43.0
      }
    ]
  },
  {
    "word": "SCALLOP",
    "display": "Scallop",
    "groups": [
      "protein"
    ],
    "ndb": "90240",
    "desc": "Mollusks, scallop, (bay and sea), cooked, steamed",
    "cal": 111.0,
    "pro": 20.5,
    "fat": 0.8,
    "carb": 5.4,
    "fib": 0.0,
    "h2o": 70.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SCROD",
    "display": "Scrod",
    "groups": [
      "protein"
    ],
    "ndb": "15016",
    "desc": "Fish, cod, Atlantic, cooked, dry heat",
    "cal": 105.0,
    "pro": 22.8,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 75.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "SCUP",
    "display": "Scup",
    "groups": [
      "protein"
    ],
    "ndb": "15213",
    "desc": "Fish, scup, cooked, dry heat",
    "cal": 135.0,
    "pro": 24.2,
    "fat": 3.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 50.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SEABASS",
    "display": "Sea Bass",
    "groups": [
      "protein"
    ],
    "ndb": "15092",
    "desc": "Fish, sea bass, mixed species, cooked, dry heat",
    "cal": 124.0,
    "pro": 23.6,
    "fat": 2.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 72.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 101.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SEAL",
    "display": "Seal",
    "groups": [
      "protein",
      "fats"
    ],
    "ndb": "35056",
    "desc": "Seal, bearded (Oogruk), meat, raw (Alaska Native)",
    "cal": 110.0,
    "pro": 26.7,
    "fat": 0.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "SEALION",
    "display": "Sealion",
    "groups": [
      "protein"
    ],
    "ndb": "35230",
    "desc": "Sea lion, Steller, meat with fat (Alaska Native)",
    "cal": 242.0,
    "pro": 22.1,
    "fat": 14.7,
    "carb": 5.5,
    "fib": 0.0,
    "h2o": 56.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "SEATROUT",
    "display": "Sea Trout",
    "groups": [
      "protein"
    ],
    "ndb": "15214",
    "desc": "Fish, seatrout, mixed species, cooked, dry heat",
    "cal": 133.0,
    "pro": 21.5,
    "fat": 4.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 71.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 186.0
      }
    ]
  },
  {
    "word": "SHAD",
    "display": "Shad",
    "groups": [
      "protein"
    ],
    "ndb": "15215",
    "desc": "Fish, shad, american, cooked, dry heat",
    "cal": 252.0,
    "pro": 21.7,
    "fat": 17.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 144.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SHANKPORK",
    "display": "Shank Pork",
    "groups": [
      "protein"
    ],
    "ndb": "10017",
    "desc": "Pork, fresh, leg (ham), shank half, separable lean and fat, cooked, roasted",
    "cal": 232.0,
    "pro": 26.0,
    "fat": 13.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 60.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast",
        "gm": 2900.0
      }
    ]
  },
  {
    "word": "SHARK",
    "display": "Shark",
    "groups": [
      "protein"
    ],
    "ndb": "15096",
    "desc": "Fish, shark, mixed species, cooked, batter-dipped and fried",
    "cal": 228.0,
    "pro": 18.6,
    "fat": 13.8,
    "carb": 6.4,
    "fib": 0.0,
    "h2o": 60.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SHEEFISH",
    "display": "Sheefish",
    "groups": [
      "protein"
    ],
    "ndb": "35169",
    "desc": "Fish, sheefish, raw (Alaska Native)",
    "cal": 115.0,
    "pro": 22.2,
    "fat": 2.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "SHEEPSHEAD",
    "display": "Sheepshead",
    "groups": [
      "protein"
    ],
    "ndb": "15098",
    "desc": "Fish, sheepshead, cooked, dry heat",
    "cal": 126.0,
    "pro": 26.0,
    "fat": 1.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 186.0
      }
    ]
  },
  {
    "word": "SHORTRIB",
    "display": "Short Rib",
    "groups": [
      "protein"
    ],
    "ndb": "13148",
    "desc": "Beef, rib, shortribs, separable lean and fat, choice, cooked, braised",
    "cal": 471.0,
    "pro": 21.6,
    "fat": 42.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 35.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 225.0
      }
    ]
  },
  {
    "word": "SHOULDER",
    "display": "Shoulder",
    "groups": [
      "protein"
    ],
    "ndb": "10071",
    "desc": "Pork, fresh, shoulder, whole, separable lean and fat, cooked, roasted",
    "cal": 292.0,
    "pro": 23.3,
    "fat": 21.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 54.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, diced",
        "gm": 135.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SHRIMP",
    "display": "Shrimp",
    "groups": [
      "protein"
    ],
    "ndb": "15150",
    "desc": "Crustaceans, shrimp, mixed species, cooked, breaded and fried",
    "cal": 242.0,
    "pro": 21.4,
    "fat": 12.3,
    "carb": 11.5,
    "fib": 0.4,
    "h2o": 52.9,
    "sug": 0.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 4.0,
        "desc": "large",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "SIRLOIN",
    "display": "Sirloin",
    "groups": [
      "protein"
    ],
    "ndb": "13930",
    "desc": "Beef, top sirloin, steak, separable lean and fat, trimmed to 1/8\" fat, all grades, cooked, broiled",
    "cal": 243.0,
    "pro": 27.0,
    "fat": 14.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 58.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 306.0
      }
    ]
  },
  {
    "word": "SIRLOINROAST",
    "display": "Sirloinroast",
    "groups": [
      "protein"
    ],
    "ndb": "23259",
    "desc": "Beef, loin, top sirloin petite roast, boneless, separable lean only, trimmed to 0\" fat, all grades, cooked, roasted",
    "cal": 170.0,
    "pro": 29.1,
    "fat": 5.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 63.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "roast",
        "gm": 768.0
      }
    ]
  },
  {
    "word": "SKIRTSTEAK",
    "display": "Skirtsteak",
    "groups": [
      "protein"
    ],
    "ndb": "23214",
    "desc": "Beef, plate steak, boneless, inside skirt, separable lean and fat, trimmed to 0\" fat, all grades, cooked, grilled",
    "cal": 245.0,
    "pro": 29.4,
    "fat": 14.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak",
        "gm": 254.0
      }
    ]
  },
  {
    "word": "SMELT",
    "display": "Smelt",
    "groups": [
      "protein"
    ],
    "ndb": "35184",
    "desc": "Smelt, dried (Alaska Native)",
    "cal": 386.0,
    "pro": 56.2,
    "fat": 17.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 16.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "SMOKED",
    "display": "Smoked",
    "groups": [
      "protein"
    ],
    "ndb": "7074",
    "desc": "Smoked link sausage, pork",
    "cal": 309.0,
    "pro": 12.0,
    "fat": 28.2,
    "carb": 0.9,
    "fib": 0.0,
    "h2o": 56.5,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "link (4\" long x 1-1/8\" dia)",
        "gm": 68.0
      },
      {
        "amt": 1.0,
        "desc": "link, little (2\" long x 3/4\" dia)",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "SNAIL",
    "display": "Snail",
    "groups": [
      "protein"
    ],
    "ndb": "90560",
    "desc": "Mollusks, snail, raw",
    "cal": 90.0,
    "pro": 16.1,
    "fat": 1.4,
    "carb": 2.0,
    "fib": 0.0,
    "h2o": 79.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SNAPPER",
    "display": "Snapper",
    "groups": [
      "protein"
    ],
    "ndb": "15102",
    "desc": "Fish, snapper, mixed species, cooked, dry heat",
    "cal": 128.0,
    "pro": 26.3,
    "fat": 1.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "SOCKEYE",
    "display": "Sockeye",
    "groups": [
      "protein"
    ],
    "ndb": "15086",
    "desc": "Fish, salmon, sockeye, cooked, dry heat",
    "cal": 156.0,
    "pro": 26.5,
    "fat": 5.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 67.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "SOLE",
    "display": "Sole",
    "groups": [
      "protein"
    ],
    "ndb": "15029",
    "desc": "Fish, flatfish (flounder and sole species), cooked, dry heat",
    "cal": 86.0,
    "pro": 15.2,
    "fat": 2.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 81.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 127.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SPAM",
    "display": "Spam",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "7908",
    "desc": "Luncheon meat, pork with ham, minced, canned, includes SPAM (Hormel)",
    "cal": 315.0,
    "pro": 13.4,
    "fat": 26.6,
    "carb": 4.6,
    "fib": 0.0,
    "h2o": 51.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "oz 1 NLEA serving",
        "gm": 56.0
      }
    ]
  },
  {
    "word": "SPARERIBB",
    "display": "Spareribb",
    "groups": [
      "protein"
    ],
    "ndb": "10089",
    "desc": "Pork, fresh, spareribs, separable lean and fat, cooked, braised",
    "cal": 397.0,
    "pro": 29.1,
    "fat": 30.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 40.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 177.0
      }
    ]
  },
  {
    "word": "SPLEEN",
    "display": "Spleen",
    "groups": [
      "protein"
    ],
    "ndb": "10118",
    "desc": "Pork, fresh, variety meats and by-products, spleen, cooked, braised",
    "cal": 149.0,
    "pro": 28.2,
    "fat": 3.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SPOT",
    "display": "Spot",
    "groups": [
      "protein"
    ],
    "ndb": "15216",
    "desc": "Fish, spot, cooked, dry heat",
    "cal": 158.0,
    "pro": 23.7,
    "fat": 6.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 50.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SQUAB",
    "display": "Squab",
    "groups": [
      "protein"
    ],
    "ndb": "5160",
    "desc": "Squab, (pigeon), meat and skin, raw",
    "cal": 294.0,
    "pro": 18.5,
    "fat": 23.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook squab)",
        "gm": 297.0
      },
      {
        "amt": 1.0,
        "desc": "squab",
        "gm": 199.0
      }
    ]
  },
  {
    "word": "SQUID",
    "display": "Squid",
    "groups": [
      "protein"
    ],
    "ndb": "15176",
    "desc": "Mollusks, squid, mixed species, cooked, fried",
    "cal": 175.0,
    "pro": 17.9,
    "fat": 7.5,
    "carb": 7.8,
    "fib": 0.0,
    "h2o": 64.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SQUIRREL",
    "display": "Squirrel",
    "groups": [
      "protein"
    ],
    "ndb": "35075",
    "desc": "Squirrel, ground, meat (Alaska Native)",
    "cal": 111.0,
    "pro": 19.3,
    "fat": 3.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 75.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "STEAK",
    "display": "Steak",
    "groups": [
      "protein"
    ],
    "ndb": "23266",
    "desc": "Beef, ribeye cap steak, boneless, separable lean only, trimmed to 0\" fat, all grades, cooked, grilled",
    "cal": 246.0,
    "pro": 24.7,
    "fat": 15.7,
    "carb": 1.5,
    "fib": 0.0,
    "h2o": 57.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak",
        "gm": 209.0
      }
    ]
  },
  {
    "word": "STEELHEAD",
    "display": "Steelhead",
    "groups": [
      "protein"
    ],
    "ndb": "35181",
    "desc": "Steelhead trout, boiled, canned (Alaska Native)",
    "cal": 159.0,
    "pro": 21.1,
    "fat": 8.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "STRIPSTEAK",
    "display": "Strip Steak",
    "groups": [
      "protein"
    ],
    "ndb": "13000",
    "desc": "Beef, grass-fed, strip steaks, lean only, raw",
    "cal": 117.0,
    "pro": 23.1,
    "fat": 2.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak",
        "gm": 214.0
      }
    ]
  },
  {
    "word": "STURGEON",
    "display": "Sturgeon",
    "groups": [
      "protein"
    ],
    "ndb": "15105",
    "desc": "Fish, sturgeon, mixed species, cooked, dry heat",
    "cal": 135.0,
    "pro": 20.7,
    "fat": 5.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cooked",
        "gm": 136.0
      },
      {
        "amt": 1.0,
        "desc": "piece (4-1/2\" x 2-1/8\" x 7/8\")",
        "gm": 145.0
      },
      {
        "amt": 1.0,
        "desc": "oz, boneless",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cubic inch, boneless",
        "gm": 17.0
      }
    ]
  },
  {
    "word": "SUCKER",
    "display": "Sucker",
    "groups": [
      "protein"
    ],
    "ndb": "15217",
    "desc": "Fish, sucker, white, cooked, dry heat",
    "cal": 119.0,
    "pro": 21.5,
    "fat": 3.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 124.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SUET",
    "display": "Suet",
    "groups": [
      "protein"
    ],
    "ndb": "13335",
    "desc": "Beef, variety meats and by-products, suet, raw",
    "cal": 854.0,
    "pro": 1.5,
    "fat": 94.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 4.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 4.0,
        "desc": "oz",
        "gm": 113.0
      }
    ]
  },
  {
    "word": "SUNFISH",
    "display": "Sunfish",
    "groups": [
      "protein"
    ],
    "ndb": "15218",
    "desc": "Fish, sunfish, pumpkin seed, cooked, dry heat",
    "cal": 114.0,
    "pro": 24.9,
    "fat": 0.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 37.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SURIMI",
    "display": "Surimi",
    "groups": [
      "protein"
    ],
    "ndb": "15109",
    "desc": "Fish, surimi",
    "cal": 99.0,
    "pro": 15.2,
    "fat": 0.9,
    "carb": 6.8,
    "fib": 0.0,
    "h2o": 76.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SWEETBREAD",
    "display": "Sweetbread",
    "groups": [
      "protein"
    ],
    "ndb": "23437",
    "desc": "Beef, New Zealand, imported, sweetbread, cooked, boiled",
    "cal": 318.0,
    "pro": 12.5,
    "fat": 29.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "SWORDFISH",
    "display": "Swordfish",
    "groups": [
      "protein"
    ],
    "ndb": "15111",
    "desc": "Fish, swordfish, cooked, dry heat",
    "cal": 172.0,
    "pro": 23.4,
    "fat": 7.9,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 106.0
      }
    ]
  },
  {
    "word": "TBONE",
    "display": "Tbone",
    "groups": [
      "protein"
    ],
    "ndb": "13236",
    "desc": "Beef, short loin, t-bone steak, bone-in, separable lean only, trimmed to 1/8\" fat, choice, cooked, grilled",
    "cal": 217.0,
    "pro": 27.5,
    "fat": 11.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 60.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "steak",
        "gm": 360.0
      }
    ]
  },
  {
    "word": "TEMPEH",
    "display": "Tempeh",
    "groups": [
      "protein",
      "legume"
    ],
    "ndb": "16174",
    "desc": "Tempeh, cooked",
    "cal": 195.0,
    "pro": 19.9,
    "fat": 11.4,
    "carb": 7.6,
    "fib": 0.0,
    "h2o": 59.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "TENDERLOIN",
    "display": "Tenderloin",
    "groups": [
      "protein"
    ],
    "ndb": "23600",
    "desc": "Beef, tenderloin, steak, separable lean only, trimmed to 1/8\" fat, all grades, cooked, broiled",
    "cal": 200.0,
    "pro": 29.0,
    "fat": 8.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "TENDERS",
    "display": "Tenders",
    "groups": [
      "protein"
    ],
    "ndb": "21401",
    "desc": "Fast foods, chicken tenders",
    "cal": 271.0,
    "pro": 19.2,
    "fat": 13.9,
    "carb": 17.2,
    "fib": 1.2,
    "h2o": 46.6,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "strip",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 184.0
      }
    ]
  },
  {
    "word": "THIGH",
    "display": "Thigh",
    "groups": [
      "protein"
    ],
    "ndb": "5094",
    "desc": "Chicken, broilers or fryers, thigh, meat and skin, cooked, roasted",
    "cal": 232.0,
    "pro": 23.3,
    "fat": 14.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "thigh with skin",
        "gm": 137.0
      },
      {
        "amt": 1.0,
        "desc": "thigh without skin",
        "gm": 116.0
      }
    ]
  },
  {
    "word": "TILAPIA",
    "display": "Tilapia",
    "groups": [
      "protein"
    ],
    "ndb": "15262",
    "desc": "Fish, tilapia, cooked, dry heat",
    "cal": 128.0,
    "pro": 26.1,
    "fat": 2.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 71.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 87.0
      }
    ]
  },
  {
    "word": "TIPNUK",
    "display": "Tipnuk",
    "groups": [
      "protein"
    ],
    "ndb": "35064",
    "desc": "Fish, salmon, tipnuk, fermented (Alaska Native)",
    "cal": 159.0,
    "pro": 15.9,
    "fat": 10.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 68.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "TOFU",
    "display": "Tofu",
    "groups": [
      "protein",
      "legume"
    ],
    "ndb": "16126",
    "desc": "Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)",
    "cal": 78.0,
    "pro": 9.0,
    "fat": 4.2,
    "carb": 2.9,
    "fib": 0.9,
    "h2o": 82.9,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 126.0
      },
      {
        "amt": 0.25,
        "desc": "block",
        "gm": 81.0
      },
      {
        "amt": 0.2,
        "desc": "block",
        "gm": 91.0
      }
    ]
  },
  {
    "word": "TONGUEBEEF",
    "display": "Tonguebeef",
    "groups": [
      "protein"
    ],
    "ndb": "13340",
    "desc": "Beef, variety meats and by-products, tongue, cooked, simmered",
    "cal": 284.0,
    "pro": 19.3,
    "fat": 22.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "TONGUELAMB",
    "display": "Tonguelamb",
    "groups": [
      "protein"
    ],
    "ndb": "17221",
    "desc": "Lamb, variety meats and by-products, tongue, cooked, braised",
    "cal": 275.0,
    "pro": 21.6,
    "fat": 20.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 57.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "unit, cooked (yield from 1 lb raw meat)",
        "gm": 255.0
      }
    ]
  },
  {
    "word": "TONGUEPORK",
    "display": "Tonguepork",
    "groups": [
      "protein"
    ],
    "ndb": "10122",
    "desc": "Pork, fresh, variety meats and by-products, tongue, cooked, braised",
    "cal": 271.0,
    "pro": 24.1,
    "fat": 18.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 231.0
      }
    ]
  },
  {
    "word": "TRIPE",
    "display": "Tripe",
    "groups": [
      "protein"
    ],
    "ndb": "23444",
    "desc": "Beef, New Zealand, imported, variety meats and by-products, tripe cooked, boiled",
    "cal": 103.0,
    "pro": 19.0,
    "fat": 3.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 77.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "TRITIP",
    "display": "Tritip",
    "groups": [
      "protein"
    ],
    "ndb": "13953",
    "desc": "Beef, bottom sirloin, tri-tip roast, separable lean and fat, trimmed to 0\" fat, all grades, cooked, roasted",
    "cal": 211.0,
    "pro": 26.1,
    "fat": 11.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "roast (yield from 690g raw meat)",
        "gm": 569.0
      }
    ]
  },
  {
    "word": "TROUT",
    "display": "Trout",
    "groups": [
      "protein"
    ],
    "ndb": "15116",
    "desc": "Fish, trout, rainbow, wild, cooked, dry heat",
    "cal": 150.0,
    "pro": 22.9,
    "fat": 5.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 143.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "TUNALIGHT",
    "display": "Tuna Light",
    "groups": [
      "protein"
    ],
    "ndb": "15121",
    "desc": "Fish, tuna, light, canned in water, drained solids",
    "cal": 86.0,
    "pro": 19.4,
    "fat": 1.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 78.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "can",
        "gm": 165.0
      },
      {
        "amt": 1.0,
        "desc": "cup, solid or chunks",
        "gm": 154.0
      },
      {
        "amt": 1.0,
        "desc": "can (12.5 oz), drained",
        "gm": 315.0
      }
    ]
  },
  {
    "word": "TUNABLUEFIN",
    "display": "Tuna Bluefin",
    "groups": [
      "protein"
    ],
    "ndb": "15118",
    "desc": "Fish, tuna, fresh, bluefin, cooked, dry heat",
    "cal": 184.0,
    "pro": 29.9,
    "fat": 6.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "TUNASKIPJACK",
    "display": "Tuna Skipjack",
    "groups": [
      "protein"
    ],
    "ndb": "15220",
    "desc": "Fish, tuna, skipjack, fresh, cooked, dry heat",
    "cal": 132.0,
    "pro": 28.2,
    "fat": 1.3,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 62.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 154.0
      }
    ]
  },
  {
    "word": "TUNAWHITE",
    "display": "Tuna White",
    "groups": [
      "protein"
    ],
    "ndb": "15186",
    "desc": "Fish, tuna, white, canned in water, without salt, drained solids",
    "cal": 128.0,
    "pro": 23.6,
    "fat": 3.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "can",
        "gm": 172.0
      }
    ]
  },
  {
    "word": "TUNAYELLOWFIN",
    "display": "Tuna Yellowfin",
    "groups": [
      "protein"
    ],
    "ndb": "15221",
    "desc": "Fish, tuna, yellowfin, fresh, cooked, dry heat",
    "cal": 130.0,
    "pro": 29.1,
    "fat": 0.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 69.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "TUNASALAD",
    "display": "Tuna Salad",
    "groups": [
      "protein"
    ],
    "ndb": "15128",
    "desc": "Fish, tuna salad",
    "cal": 187.0,
    "pro": 16.0,
    "fat": 9.3,
    "carb": 9.4,
    "fib": 0.0,
    "h2o": 63.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "TURBOT",
    "display": "Turbot",
    "groups": [
      "protein"
    ],
    "ndb": "15222",
    "desc": "Fish, turbot, european, cooked, dry heat",
    "cal": 122.0,
    "pro": 20.6,
    "fat": 3.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 70.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 159.0
      }
    ]
  },
  {
    "word": "TURKEY",
    "display": "Turkey",
    "groups": [
      "protein"
    ],
    "ndb": "5168",
    "desc": "Turkey, whole, meat only, cooked, roasted",
    "cal": 159.0,
    "pro": 29.1,
    "fat": 3.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 66.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "bird",
        "gm": 3812.0
      }
    ]
  },
  {
    "word": "TURKEYBREAST",
    "display": "Turkey Breast",
    "groups": [
      "protein"
    ],
    "ndb": "7081",
    "desc": "Turkey breast, sliced, prepackaged",
    "cal": 106.0,
    "pro": 14.8,
    "fat": 3.8,
    "carb": 2.2,
    "fib": 0.0,
    "h2o": 76.0,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "TURKEYDRUMSTICK",
    "display": "Turkey Drumstick",
    "groups": [
      "protein"
    ],
    "ndb": "5739",
    "desc": "Turkey, drumstick, from whole bird, meat only, roasted",
    "cal": 139.0,
    "pro": 30.1,
    "fat": 2.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 67.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "drumstick",
        "gm": 206.0
      }
    ]
  },
  {
    "word": "TURKEYLEG",
    "display": "Turkey Leg",
    "groups": [
      "protein"
    ],
    "ndb": "5192",
    "desc": "Turkey, all classes, breast, meat and skin, cooked, roasted",
    "cal": 189.0,
    "pro": 28.7,
    "fat": 7.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 63.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook turkey)",
        "gm": 112.0
      },
      {
        "amt": 0.5,
        "desc": "breast, bone removed",
        "gm": 864.0
      }
    ]
  },
  {
    "word": "TURKEYSLICED",
    "display": "Turkey Sliced",
    "groups": [
      "protein"
    ],
    "ndb": "7081",
    "desc": "Turkey breast, sliced, prepackaged",
    "cal": 106.0,
    "pro": 14.8,
    "fat": 3.8,
    "carb": 2.2,
    "fib": 0.0,
    "h2o": 76.0,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "TURKEYWING",
    "display": "Turkey Wing",
    "groups": [
      "protein"
    ],
    "ndb": "5196",
    "desc": "Turkey, all classes, wing, meat and skin, cooked, roasted",
    "cal": 229.0,
    "pro": 27.4,
    "fat": 12.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 59.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "unit (yield from 1 lb ready-to-cook turkey)",
        "gm": 24.0
      },
      {
        "amt": 1.0,
        "desc": "wing, bone removed",
        "gm": 186.0
      }
    ]
  },
  {
    "word": "VEAL",
    "display": "Veal",
    "groups": [
      "protein"
    ],
    "ndb": "17093",
    "desc": "Veal, composite of trimmed retail cuts, separable fat, cooked",
    "cal": 642.0,
    "pro": 9.4,
    "fat": 66.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 21.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "unit, cooked (yield from 1 lb raw meat)",
        "gm": 290.0
      }
    ]
  },
  {
    "word": "VEALBREAST",
    "display": "Veal Breast",
    "groups": [
      "protein"
    ],
    "ndb": "17272",
    "desc": "Veal, breast, whole, boneless, separable lean and fat, cooked, braised",
    "cal": 266.0,
    "pro": 27.0,
    "fat": 16.8,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 56.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 283.0
      }
    ]
  },
  {
    "word": "VEALLOIN",
    "display": "Veal Loin",
    "groups": [
      "protein"
    ],
    "ndb": "17437",
    "desc": "Veal, loin, chop, separable lean and fat, cooked, grilled",
    "cal": 198.0,
    "pro": 28.0,
    "fat": 9.5,
    "carb": 0.2,
    "fib": 0.0,
    "h2o": 61.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "chop",
        "gm": 153.0
      }
    ]
  },
  {
    "word": "VEALRIB",
    "display": "Veal Rib",
    "groups": [
      "protein"
    ],
    "ndb": "17111",
    "desc": "Veal, rib, separable lean and fat, cooked, braised",
    "cal": 251.0,
    "pro": 32.4,
    "fat": 12.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 53.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 177.0
      }
    ]
  },
  {
    "word": "VEALSHANK",
    "display": "Veal Shank",
    "groups": [
      "protein"
    ],
    "ndb": "17277",
    "desc": "Veal, shank (fore and hind), separable lean and fat, cooked, braised",
    "cal": 191.0,
    "pro": 31.5,
    "fat": 6.2,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 61.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 194.0
      }
    ]
  },
  {
    "word": "VEALSIRLOIN",
    "display": "Veal Sirloin",
    "groups": [
      "protein"
    ],
    "ndb": "17135",
    "desc": "Veal, sirloin, separable lean and fat, cooked, braised",
    "cal": 252.0,
    "pro": 31.3,
    "fat": 13.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 54.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "piece, cooked, excluding refuse (yield from 1 lb r",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "VENISON",
    "display": "Venison",
    "groups": [
      "protein"
    ],
    "ndb": "17164",
    "desc": "Game meat, deer, raw",
    "cal": 120.0,
    "pro": 23.0,
    "fat": 2.4,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "lb",
        "gm": 453.6
      }
    ]
  },
  {
    "word": "WALLEYE",
    "display": "Walleye",
    "groups": [
      "protein"
    ],
    "ndb": "15204",
    "desc": "Fish, pike, walleye, cooked, dry heat",
    "cal": 119.0,
    "pro": 24.5,
    "fat": 1.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 73.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 124.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "WALRUS",
    "display": "Walrus",
    "groups": [
      "protein",
      "fats"
    ],
    "ndb": "35081",
    "desc": "Walrus, meat, raw (Alaska Native)",
    "cal": 199.0,
    "pro": 19.2,
    "fat": 13.6,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "WHALE",
    "display": "Whale",
    "groups": [
      "protein",
      "fats"
    ],
    "ndb": "35011",
    "desc": "Whale, beluga, meat, raw (Alaska Native)",
    "cal": 111.0,
    "pro": 26.5,
    "fat": 0.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 72.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "WHELK",
    "display": "Whelk",
    "groups": [
      "protein"
    ],
    "ndb": "15178",
    "desc": "Mollusks, whelk, unspecified, cooked, moist heat",
    "cal": 275.0,
    "pro": 47.7,
    "fat": 0.8,
    "carb": 15.5,
    "fib": 0.0,
    "h2o": 32.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "WHITEFISH",
    "display": "Whitefish",
    "groups": [
      "protein"
    ],
    "ndb": "15223",
    "desc": "Fish, whitefish, mixed species, cooked, dry heat",
    "cal": 172.0,
    "pro": 24.5,
    "fat": 7.5,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 65.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 154.0
      }
    ]
  },
  {
    "word": "WHITING",
    "display": "Whiting",
    "groups": [
      "protein"
    ],
    "ndb": "15133",
    "desc": "Fish, whiting, mixed species, cooked, dry heat",
    "cal": 116.0,
    "pro": 23.5,
    "fat": 1.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fillet",
        "gm": 72.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "WING",
    "display": "Wing",
    "groups": [
      "protein"
    ],
    "ndb": "20080",
    "desc": "Wheat flour, whole-grain",
    "cal": 340.0,
    "pro": 13.2,
    "fat": 2.5,
    "carb": 72.0,
    "fib": 10.7,
    "h2o": 10.7,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 120.0
      }
    ]
  },
  {
    "word": "WOLFFISH",
    "display": "Wolffish",
    "groups": [
      "protein"
    ],
    "ndb": "15224",
    "desc": "Fish, wolffish, Atlantic, cooked, dry heat",
    "cal": 123.0,
    "pro": 22.4,
    "fat": 3.1,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 74.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 119.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "YELLOWTAIL",
    "display": "Yellowtail",
    "groups": [
      "protein"
    ],
    "ndb": "15225",
    "desc": "Fish, yellowtail, mixed species, cooked, dry heat",
    "cal": 187.0,
    "pro": 29.7,
    "fat": 6.7,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 67.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "fillet",
        "gm": 146.0
      },
      {
        "amt": 3.0,
        "desc": "oz",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "YOLK",
    "display": "Yolk",
    "groups": [
      "protein"
    ],
    "ndb": "1125",
    "desc": "Egg, yolk, raw, fresh",
    "cal": 322.0,
    "pro": 15.9,
    "fat": 26.5,
    "carb": 3.6,
    "fib": 0.0,
    "h2o": 52.3,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 243.0
      }
    ]
  },
  {
    "word": "ALLSPICE",
    "display": "Allspice",
    "groups": [
      "spice"
    ],
    "ndb": "2001",
    "desc": "Spices, allspice, ground",
    "cal": 263.0,
    "pro": 6.1,
    "fat": 8.7,
    "carb": 72.1,
    "fib": 21.6,
    "h2o": 8.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 1.9
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.0
      }
    ]
  },
  {
    "word": "ALMONDPASTE",
    "display": "Almond Paste",
    "groups": [
      "spice"
    ],
    "ndb": "12071",
    "desc": "Nuts, almond paste",
    "cal": 458.0,
    "pro": 9.0,
    "fat": 27.7,
    "carb": 47.8,
    "fib": 4.8,
    "h2o": 14.1,
    "sug": 36.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "cup, firmly packed",
        "gm": 227.0
      }
    ]
  },
  {
    "word": "ANISE",
    "display": "Anise",
    "groups": [
      "spice"
    ],
    "ndb": "2002",
    "desc": "Spices, anise seed",
    "cal": 337.0,
    "pro": 17.6,
    "fat": 15.9,
    "carb": 50.0,
    "fib": 14.6,
    "h2o": 9.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, whole",
        "gm": 2.1
      },
      {
        "amt": 1.0,
        "desc": "tbsp, whole",
        "gm": 6.7
      }
    ]
  },
  {
    "word": "BAKINGSODA",
    "display": "Baking Soda",
    "groups": [
      "spice"
    ],
    "ndb": "18372",
    "desc": "Leavening agents, baking soda",
    "cal": 0.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.6
      },
      {
        "amt": 0.5,
        "desc": "tsp",
        "gm": 2.3
      }
    ]
  },
  {
    "word": "BARBECUE",
    "display": "Barbecue",
    "groups": [
      "spice"
    ],
    "ndb": "7001",
    "desc": "Barbecue loaf, pork, beef",
    "cal": 173.0,
    "pro": 15.8,
    "fat": 8.9,
    "carb": 6.4,
    "fib": 0.0,
    "h2o": 64.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "slice (5-7/8\" x 3-1/2\" x 1/16\")",
        "gm": 23.0
      }
    ]
  },
  {
    "word": "BASIL",
    "display": "Basil",
    "groups": [
      "spice"
    ],
    "ndb": "2044",
    "desc": "Basil, fresh",
    "cal": 23.0,
    "pro": 3.1,
    "fat": 0.6,
    "carb": 2.6,
    "fib": 1.6,
    "h2o": 92.1,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 5.0,
        "desc": "leaves",
        "gm": 2.5
      },
      {
        "amt": 2.0,
        "desc": "tbsp, chopped",
        "gm": 5.3
      },
      {
        "amt": 0.25,
        "desc": "cup leaves, whole",
        "gm": 6.0
      }
    ]
  },
  {
    "word": "BAYLEAF",
    "display": "Bay Leaf",
    "groups": [
      "spice"
    ],
    "ndb": "2004",
    "desc": "Spices, bay leaf",
    "cal": 313.0,
    "pro": 7.6,
    "fat": 8.4,
    "carb": 75.0,
    "fib": 26.3,
    "h2o": 5.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, crumbled",
        "gm": 0.6
      },
      {
        "amt": 1.0,
        "desc": "tbsp, crumbled",
        "gm": 1.8
      }
    ]
  },
  {
    "word": "CAESARDRESSING",
    "display": "Caesar Dressing",
    "groups": [
      "spice"
    ],
    "ndb": "43015",
    "desc": "Salad dressing, caesar dressing, regular",
    "cal": 542.0,
    "pro": 2.2,
    "fat": 57.9,
    "carb": 3.3,
    "fib": 0.5,
    "h2o": 34.3,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.7
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 235.0
      },
      {
        "amt": 1.0,
        "desc": "serving (2 tbsp)",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "CAPER",
    "display": "Caper",
    "groups": [
      "spice"
    ],
    "ndb": "2054",
    "desc": "Capers, canned",
    "cal": 23.0,
    "pro": 2.4,
    "fat": 0.9,
    "carb": 4.9,
    "fib": 3.2,
    "h2o": 83.8,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp, drained",
        "gm": 8.6
      }
    ]
  },
  {
    "word": "CARAWAY",
    "display": "Caraway",
    "groups": [
      "spice"
    ],
    "ndb": "2005",
    "desc": "Spices, caraway seed",
    "cal": 333.0,
    "pro": 19.8,
    "fat": 14.6,
    "carb": 49.9,
    "fib": 38.0,
    "h2o": 9.9,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.1
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.7
      }
    ]
  },
  {
    "word": "CARDAMOM",
    "display": "Cardamom",
    "groups": [
      "spice"
    ],
    "ndb": "2006",
    "desc": "Spices, cardamom",
    "cal": 311.0,
    "pro": 10.8,
    "fat": 6.7,
    "carb": 68.5,
    "fib": 28.0,
    "h2o": 8.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, ground",
        "gm": 2.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp, ground",
        "gm": 5.8
      }
    ]
  },
  {
    "word": "CATSUP",
    "display": "Catsup",
    "groups": [
      "spice"
    ],
    "ndb": "11935",
    "desc": "Catsup",
    "cal": 101.0,
    "pro": 1.0,
    "fat": 0.1,
    "carb": 27.4,
    "fib": 0.3,
    "h2o": 68.5,
    "sug": 21.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 9.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "CAYENNE",
    "display": "Cayenne",
    "groups": [
      "spice"
    ],
    "ndb": "2031",
    "desc": "Spices, pepper, red or cayenne",
    "cal": 318.0,
    "pro": 12.0,
    "fat": 17.3,
    "carb": 56.6,
    "fib": 27.2,
    "h2o": 8.1,
    "sug": 10.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 1.8
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 5.3
      }
    ]
  },
  {
    "word": "CHERVIL",
    "display": "Chervil",
    "groups": [
      "spice"
    ],
    "ndb": "2008",
    "desc": "Spices, chervil, dried",
    "cal": 237.0,
    "pro": 23.2,
    "fat": 3.9,
    "carb": 49.1,
    "fib": 11.3,
    "h2o": 7.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 0.6
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 1.9
      }
    ]
  },
  {
    "word": "CHIVE",
    "display": "Chive",
    "groups": [
      "spice"
    ],
    "ndb": "11156",
    "desc": "Chives, raw",
    "cal": 30.0,
    "pro": 3.3,
    "fat": 0.7,
    "carb": 4.3,
    "fib": 2.5,
    "h2o": 90.7,
    "sug": 1.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp chopped",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "tsp chopped",
        "gm": 1.0
      }
    ]
  },
  {
    "word": "CHOCOLATE",
    "display": "Chocolate",
    "groups": [
      "spice"
    ],
    "ndb": "19077",
    "desc": "Baking chocolate, unsweetened, liquid",
    "cal": 472.0,
    "pro": 12.1,
    "fat": 47.7,
    "carb": 36.2,
    "fib": 18.1,
    "h2o": 0.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "CHOCOLATESYRUP",
    "display": "Chocolate Syrup",
    "groups": [
      "spice"
    ],
    "ndb": "14181",
    "desc": "Beverages, Chocolate syrup",
    "cal": 279.0,
    "pro": 2.1,
    "fat": 1.1,
    "carb": 65.1,
    "fib": 2.6,
    "h2o": 31.0,
    "sug": 49.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving 2 tbsp",
        "gm": 39.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 300.0
      }
    ]
  },
  {
    "word": "CILANTRO",
    "display": "Cilantro",
    "groups": [
      "spice"
    ],
    "ndb": "11165",
    "desc": "Coriander (cilantro) leaves, raw",
    "cal": 23.0,
    "pro": 2.1,
    "fat": 0.5,
    "carb": 3.7,
    "fib": 2.8,
    "h2o": 92.2,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.25,
        "desc": "cup",
        "gm": 4.0
      },
      {
        "amt": 9.0,
        "desc": "sprigs",
        "gm": 20.0
      }
    ]
  },
  {
    "word": "CINNAMON",
    "display": "Cinnamon",
    "groups": [
      "spice"
    ],
    "ndb": "2010",
    "desc": "Spices, cinnamon, ground",
    "cal": 247.0,
    "pro": 4.0,
    "fat": 1.2,
    "carb": 80.6,
    "fib": 53.1,
    "h2o": 10.6,
    "sug": 2.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.6
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 7.8
      }
    ]
  },
  {
    "word": "CLOVE",
    "display": "Clove",
    "groups": [
      "spice"
    ],
    "ndb": "2011",
    "desc": "Spices, cloves, ground",
    "cal": 274.0,
    "pro": 6.0,
    "fat": 13.0,
    "carb": 65.5,
    "fib": 33.9,
    "h2o": 9.9,
    "sug": 2.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.1
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.5
      }
    ]
  },
  {
    "word": "COCOA",
    "display": "Cocoa",
    "groups": [
      "spice",
      "beverage"
    ],
    "ndb": "14194",
    "desc": "Beverages, Cocoa mix, powder, prepared with water",
    "cal": 55.0,
    "pro": 0.9,
    "fat": 0.6,
    "carb": 11.5,
    "fib": 0.5,
    "h2o": 86.3,
    "sug": 9.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 34.3
      },
      {
        "amt": 1.0,
        "desc": "serving 6 fl oz",
        "gm": 206.0
      }
    ]
  },
  {
    "word": "CORIANDER",
    "display": "Coriander",
    "groups": [
      "spice"
    ],
    "ndb": "11165",
    "desc": "Coriander (cilantro) leaves, raw",
    "cal": 23.0,
    "pro": 2.1,
    "fat": 0.5,
    "carb": 3.7,
    "fib": 2.8,
    "h2o": 92.2,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.25,
        "desc": "cup",
        "gm": 4.0
      },
      {
        "amt": 9.0,
        "desc": "sprigs",
        "gm": 20.0
      }
    ]
  },
  {
    "word": "CORNSTARCH",
    "display": "Cornstarch",
    "groups": [
      "spice"
    ],
    "ndb": "20027",
    "desc": "Cornstarch",
    "cal": 381.0,
    "pro": 0.3,
    "fat": 0.1,
    "carb": 91.3,
    "fib": 0.9,
    "h2o": 8.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 128.0
      }
    ]
  },
  {
    "word": "CRANBERRYSAUCE",
    "display": "Cranberry Sauce",
    "groups": [
      "spice"
    ],
    "ndb": "9081",
    "desc": "Cranberry sauce, canned, sweetened",
    "cal": 159.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 40.4,
    "fib": 1.1,
    "h2o": 58.5,
    "sug": 31.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 277.0
      },
      {
        "amt": 1.0,
        "desc": "slice (1/2\" thick, approx 8 slices per can)",
        "gm": 57.0
      }
    ]
  },
  {
    "word": "CREAMOFTARTAR",
    "display": "Cream of Tartar",
    "groups": [
      "spice"
    ],
    "ndb": "18373",
    "desc": "Leavening agents, cream of tartar",
    "cal": 258.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 61.5,
    "fib": 0.2,
    "h2o": 1.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 3.0
      },
      {
        "amt": 0.5,
        "desc": "tsp",
        "gm": 1.5
      }
    ]
  },
  {
    "word": "CUMIN",
    "display": "Cumin",
    "groups": [
      "spice"
    ],
    "ndb": "2014",
    "desc": "Spices, cumin seed",
    "cal": 375.0,
    "pro": 17.8,
    "fat": 22.3,
    "carb": 44.2,
    "fib": 10.5,
    "h2o": 8.1,
    "sug": 2.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, whole",
        "gm": 2.1
      },
      {
        "amt": 1.0,
        "desc": "tbsp, whole",
        "gm": 6.0
      }
    ]
  },
  {
    "word": "CURRY",
    "display": "Curry",
    "groups": [
      "spice"
    ],
    "ndb": "2015",
    "desc": "Spices, curry powder",
    "cal": 325.0,
    "pro": 14.3,
    "fat": 14.0,
    "carb": 55.8,
    "fib": 53.2,
    "h2o": 8.8,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.3
      }
    ]
  },
  {
    "word": "DILL",
    "display": "Dill",
    "groups": [
      "spice"
    ],
    "ndb": "2045",
    "desc": "Dill weed, fresh",
    "cal": 43.0,
    "pro": 3.5,
    "fat": 1.1,
    "carb": 7.0,
    "fib": 2.1,
    "h2o": 86.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 5.0,
        "desc": "sprigs",
        "gm": 1.0
      },
      {
        "amt": 1.0,
        "desc": "cup sprigs",
        "gm": 8.9
      }
    ]
  },
  {
    "word": "DRESSINGBLUE",
    "display": "Dressing Blue",
    "groups": [
      "spice"
    ],
    "ndb": "4539",
    "desc": "Salad dressing, blue or roquefort cheese dressing, commercial, regular",
    "cal": 484.0,
    "pro": 1.4,
    "fat": 51.1,
    "carb": 4.8,
    "fib": 0.4,
    "h2o": 39.7,
    "sug": 3.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "DRESSINGBUTTERMILK",
    "display": "Dressing Buttermilk",
    "groups": [
      "spice"
    ],
    "ndb": "43215",
    "desc": "Salad dressing, buttermilk, lite",
    "cal": 202.0,
    "pro": 1.2,
    "fat": 12.4,
    "carb": 21.3,
    "fib": 1.1,
    "h2o": 62.0,
    "sug": 3.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "serving (2 tbsp)",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "DRESSINGCAESAR",
    "display": "Dressing Caesar",
    "groups": [
      "spice"
    ],
    "ndb": "43015",
    "desc": "Salad dressing, caesar dressing, regular",
    "cal": 542.0,
    "pro": 2.2,
    "fat": 57.9,
    "carb": 3.3,
    "fib": 0.5,
    "h2o": 34.3,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.7
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 235.0
      },
      {
        "amt": 1.0,
        "desc": "serving (2 tbsp)",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "DRESSINGFRENCH",
    "display": "Dressing French",
    "groups": [
      "spice"
    ],
    "ndb": "4120",
    "desc": "Salad dressing, french dressing, commercial, regular",
    "cal": 457.0,
    "pro": 0.8,
    "fat": 44.8,
    "carb": 15.6,
    "fib": 0.0,
    "h2o": 36.6,
    "sug": 15.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 250.0
      }
    ]
  },
  {
    "word": "DRESSINGGREENGODDESS",
    "display": "Dressing Green Goddess",
    "groups": [
      "spice"
    ],
    "ndb": "43017",
    "desc": "Salad dressing, green goddess, regular",
    "cal": 427.0,
    "pro": 1.9,
    "fat": 43.3,
    "carb": 7.4,
    "fib": 0.1,
    "h2o": 45.0,
    "sug": 6.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "DRESSINGHONEYMUST",
    "display": "Dressing Honey Mustard",
    "groups": [
      "spice"
    ],
    "ndb": "4703",
    "desc": "Salad dressing, honey mustard, regular",
    "cal": 464.0,
    "pro": 0.9,
    "fat": 40.8,
    "carb": 23.3,
    "fib": 0.4,
    "h2o": 32.6,
    "sug": 15.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "DRESSINGITALIAN",
    "display": "Dressing Italian",
    "groups": [
      "spice"
    ],
    "ndb": "4114",
    "desc": "Salad dressing, italian dressing, commercial, regular",
    "cal": 240.0,
    "pro": 0.4,
    "fat": 21.1,
    "carb": 12.1,
    "fib": 0.0,
    "h2o": 63.4,
    "sug": 10.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.7
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 235.0
      }
    ]
  },
  {
    "word": "DRESSINGMAYO",
    "display": "Dressing Mayo",
    "groups": [
      "spice"
    ],
    "ndb": "4025",
    "desc": "Salad dressing, mayonnaise, regular",
    "cal": 680.0,
    "pro": 1.0,
    "fat": 74.8,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 21.6,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 220.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "DRESSINGRANCH",
    "display": "Dressing Ranch",
    "groups": [
      "spice"
    ],
    "ndb": "4639",
    "desc": "Salad dressing, ranch dressing, regular",
    "cal": 430.0,
    "pro": 1.3,
    "fat": 44.5,
    "carb": 5.9,
    "fib": 0.0,
    "h2o": 45.7,
    "sug": 4.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "DRESSINGRUSSIAN",
    "display": "Dressing Tussian",
    "groups": [
      "spice"
    ],
    "ndb": "4015",
    "desc": "Salad dressing, russian dressing",
    "cal": 355.0,
    "pro": 0.7,
    "fat": 26.2,
    "carb": 31.9,
    "fib": 0.7,
    "h2o": 38.5,
    "sug": 17.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      },
      {
        "amt": 1.0,
        "desc": "serving (2 tbsp)",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "DRESSINGSESAME",
    "display": "Dressing Sesame",
    "groups": [
      "spice"
    ],
    "ndb": "4016",
    "desc": "Salad dressing, sesame seed dressing, regular",
    "cal": 443.0,
    "pro": 3.1,
    "fat": 45.2,
    "carb": 8.6,
    "fib": 1.0,
    "h2o": 39.2,
    "sug": 8.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "DRESSINGTHOUSAND",
    "display": "Dressing Thousand",
    "groups": [
      "spice"
    ],
    "ndb": "4017",
    "desc": "Salad dressing, thousand island, commercial, regular",
    "cal": 379.0,
    "pro": 1.1,
    "fat": 35.1,
    "carb": 14.6,
    "fib": 0.8,
    "h2o": 46.5,
    "sug": 15.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 250.0
      },
      {
        "amt": 1.0,
        "desc": "serving (2 tbsp)",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "EPAZOTE",
    "display": "Epazote",
    "groups": [
      "spice"
    ],
    "ndb": "11984",
    "desc": "Epazote, raw",
    "cal": 32.0,
    "pro": 0.3,
    "fat": 0.5,
    "carb": 7.4,
    "fib": 3.8,
    "h2o": 89.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 0.8
      },
      {
        "amt": 1.0,
        "desc": "sprig",
        "gm": 2.0
      }
    ]
  },
  {
    "word": "HOISIN",
    "display": "Hoisin",
    "groups": [
      "spice"
    ],
    "ndb": "6175",
    "desc": "Sauce, hoisin, ready-to-serve",
    "cal": 220.0,
    "pro": 3.3,
    "fat": 3.4,
    "carb": 44.1,
    "fib": 2.8,
    "h2o": 44.2,
    "sug": 27.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      }
    ]
  },
  {
    "word": "HONEY",
    "display": "Honey",
    "groups": [
      "spice"
    ],
    "ndb": "19296",
    "desc": "Honey",
    "cal": 304.0,
    "pro": 0.3,
    "fat": 0.0,
    "carb": 82.4,
    "fib": 0.2,
    "h2o": 17.1,
    "sug": 82.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 339.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 21.0
      },
      {
        "amt": 1.0,
        "desc": "packet (0.5 oz)",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "JALAPENO",
    "display": "Jalapeno",
    "groups": [
      "spice"
    ],
    "ndb": "11979",
    "desc": "Peppers, jalapeno, raw",
    "cal": 29.0,
    "pro": 0.9,
    "fat": 0.4,
    "carb": 6.5,
    "fib": 2.8,
    "h2o": 91.7,
    "sug": 4.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 90.0
      },
      {
        "amt": 1.0,
        "desc": "pepper",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "LEMONJUICE",
    "display": "Lemon Juice",
    "groups": [
      "spice"
    ],
    "ndb": "9152",
    "desc": "Lemon juice, raw",
    "cal": 22.0,
    "pro": 0.3,
    "fat": 0.2,
    "carb": 6.9,
    "fib": 0.3,
    "h2o": 92.3,
    "sug": 2.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 244.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.5
      },
      {
        "amt": 1.0,
        "desc": "lemon yields",
        "gm": 48.0
      },
      {
        "amt": 1.0,
        "desc": "wedge yields",
        "gm": 5.9
      }
    ]
  },
  {
    "word": "LIMEJUICE",
    "display": "Lime Juice",
    "groups": [
      "spice"
    ],
    "ndb": "9160",
    "desc": "Lime juice, raw",
    "cal": 25.0,
    "pro": 0.4,
    "fat": 0.1,
    "carb": 8.4,
    "fib": 0.4,
    "h2o": 90.8,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 242.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 30.8
      },
      {
        "amt": 1.0,
        "desc": "lime yields",
        "gm": 44.0
      }
    ]
  },
  {
    "word": "MAPLESUGAR",
    "display": "Maple Sugar",
    "groups": [
      "spice"
    ],
    "ndb": "19340",
    "desc": "Sugars, maple",
    "cal": 354.0,
    "pro": 0.1,
    "fat": 0.2,
    "carb": 90.9,
    "fib": 0.0,
    "h2o": 8.0,
    "sug": 84.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1-3/4\" x 1-1/4\" x 1/2\")",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "MAPLESYPUP",
    "display": "Maple Sypup",
    "groups": [
      "spice"
    ],
    "ndb": "19353",
    "desc": "Syrups, maple",
    "cal": 260.0,
    "pro": 0.0,
    "fat": 0.1,
    "carb": 67.0,
    "fib": 0.0,
    "h2o": 32.4,
    "sug": 60.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1/4 cup",
        "gm": 83.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 315.0
      }
    ]
  },
  {
    "word": "MARJORAM",
    "display": "Marjoram",
    "groups": [
      "spice"
    ],
    "ndb": "2023",
    "desc": "Spices, marjoram, dried",
    "cal": 271.0,
    "pro": 12.7,
    "fat": 7.0,
    "carb": 60.6,
    "fib": 40.3,
    "h2o": 7.6,
    "sug": 4.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 0.6
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 1.7
      }
    ]
  },
  {
    "word": "MARMALADE",
    "display": "Marmalade",
    "groups": [
      "spice"
    ],
    "ndb": "19303",
    "desc": "Marmalade, orange",
    "cal": 246.0,
    "pro": 0.3,
    "fat": 0.0,
    "carb": 66.3,
    "fib": 0.7,
    "h2o": 33.2,
    "sug": 60.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "package (0.5 oz)",
        "gm": 14.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 320.0
      }
    ]
  },
  {
    "word": "MAYO",
    "display": "Mayo",
    "groups": [
      "spice"
    ],
    "ndb": "4025",
    "desc": "Salad dressing, mayonnaise, regular",
    "cal": 680.0,
    "pro": 1.0,
    "fat": 74.8,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 21.6,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 220.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "MAYONNAISE",
    "display": "Mayonnaise",
    "groups": [
      "spice"
    ],
    "ndb": "4025",
    "desc": "Salad dressing, mayonnaise, regular",
    "cal": 680.0,
    "pro": 1.0,
    "fat": 74.8,
    "carb": 0.6,
    "fib": 0.0,
    "h2o": 21.6,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.8
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 220.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "MISO",
    "display": "Miso",
    "groups": [
      "spice"
    ],
    "ndb": "16112",
    "desc": "Miso",
    "cal": 198.0,
    "pro": 12.8,
    "fat": 6.0,
    "carb": 25.4,
    "fib": 5.4,
    "h2o": 43.0,
    "sug": 6.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 275.0
      }
    ]
  },
  {
    "word": "MOLASSES",
    "display": "Molasses",
    "groups": [
      "spice"
    ],
    "ndb": "19304",
    "desc": "Molasses",
    "cal": 290.0,
    "pro": 0.0,
    "fat": 0.1,
    "carb": 74.7,
    "fib": 0.0,
    "h2o": 21.9,
    "sug": 74.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 337.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1 tbsp",
        "gm": 20.0
      }
    ]
  },
  {
    "word": "MUSTARD",
    "display": "Mustard",
    "groups": [
      "spice"
    ],
    "ndb": "2046",
    "desc": "Mustard, prepared, yellow",
    "cal": 60.0,
    "pro": 3.7,
    "fat": 3.3,
    "carb": 5.8,
    "fib": 4.0,
    "h2o": 83.7,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp or 1 packet",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 249.0
      }
    ]
  },
  {
    "word": "NUTMEG",
    "display": "Nutmeg",
    "groups": [
      "spice"
    ],
    "ndb": "2025",
    "desc": "Spices, nutmeg, ground",
    "cal": 525.0,
    "pro": 5.8,
    "fat": 36.3,
    "carb": 49.3,
    "fib": 20.8,
    "h2o": 6.2,
    "sug": 3.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.2
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 7.0
      }
    ]
  },
  {
    "word": "OREGANO",
    "display": "Oregano",
    "groups": [
      "spice"
    ],
    "ndb": "2027",
    "desc": "Spices, oregano, dried",
    "cal": 265.0,
    "pro": 9.0,
    "fat": 4.3,
    "carb": 68.9,
    "fib": 42.5,
    "h2o": 9.9,
    "sug": 4.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, leaves",
        "gm": 1.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, ground",
        "gm": 1.8
      }
    ]
  },
  {
    "word": "PAPRIKA",
    "display": "Paprika",
    "groups": [
      "spice"
    ],
    "ndb": "2028",
    "desc": "Spices, paprika",
    "cal": 282.0,
    "pro": 14.1,
    "fat": 12.9,
    "carb": 54.0,
    "fib": 34.9,
    "h2o": 11.2,
    "sug": 10.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.3
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 6.8
      }
    ]
  },
  {
    "word": "PARSLEY",
    "display": "Parsley",
    "groups": [
      "spice"
    ],
    "ndb": "11297",
    "desc": "Parsley, fresh",
    "cal": 36.0,
    "pro": 3.0,
    "fat": 0.8,
    "carb": 6.3,
    "fib": 3.3,
    "h2o": 87.7,
    "sug": 0.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup chopped",
        "gm": 60.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 3.8
      },
      {
        "amt": 10.0,
        "desc": "sprigs",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "PEPPERMINT",
    "display": "Peppermint",
    "groups": [
      "spice"
    ],
    "ndb": "2064",
    "desc": "Peppermint, fresh",
    "cal": 70.0,
    "pro": 3.8,
    "fat": 0.9,
    "carb": 14.9,
    "fib": 8.0,
    "h2o": 78.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "leaves",
        "gm": 0.1
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 3.2
      }
    ]
  },
  {
    "word": "PICKLE",
    "display": "Pickle",
    "groups": [
      "spice"
    ],
    "ndb": "11937",
    "desc": "Pickles, cucumber, dill or kosher dill",
    "cal": 12.0,
    "pro": 0.5,
    "fat": 0.3,
    "carb": 2.4,
    "fib": 1.0,
    "h2o": 94.3,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "spear, small",
        "gm": 35.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "large (4\" long)",
        "gm": 135.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or diced",
        "gm": 143.0
      },
      {
        "amt": 1.0,
        "desc": "cup (about 23 slices)",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "PIMIENTO",
    "display": "Pimiento",
    "groups": [
      "spice"
    ],
    "ndb": "11943",
    "desc": "Pimento, canned",
    "cal": 23.0,
    "pro": 1.1,
    "fat": 0.3,
    "carb": 5.1,
    "fib": 1.9,
    "h2o": 93.1,
    "sug": 2.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 192.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 1.0
      },
      {
        "amt": 1.0,
        "desc": "pimiento, whole",
        "gm": 66.0
      }
    ]
  },
  {
    "word": "PRESERVES",
    "display": "Preserves",
    "groups": [
      "spice"
    ],
    "ndb": "19920",
    "desc": "Jams, preserves, marmalades, sweetened with fruit juice",
    "cal": 212.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 52.9,
    "fib": 0.9,
    "h2o": 46.8,
    "sug": 42.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "RANCHDRESSING",
    "display": "Ranch Dressing",
    "groups": [
      "spice"
    ],
    "ndb": "4640",
    "desc": "Salad dressing, ranch dressing, reduced fat",
    "cal": 196.0,
    "pro": 1.2,
    "fat": 12.4,
    "carb": 21.3,
    "fib": 1.1,
    "h2o": 62.0,
    "sug": 3.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tablespoon",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "serving (2 tbsp)",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "RANCHSTYLE",
    "display": "Ranch Style",
    "groups": [
      "spice"
    ],
    "ndb": "43112",
    "desc": "Beans, chili, barbecue, ranch style, cooked",
    "cal": 97.0,
    "pro": 5.0,
    "fat": 1.0,
    "carb": 16.9,
    "fib": 4.2,
    "h2o": 75.5,
    "sug": 5.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 253.0
      }
    ]
  },
  {
    "word": "RELISH",
    "display": "Relish",
    "groups": [
      "spice"
    ],
    "ndb": "11944",
    "desc": "Pickle relish, hot dog",
    "cal": 91.0,
    "pro": 1.5,
    "fat": 0.5,
    "carb": 23.4,
    "fib": 1.5,
    "h2o": 71.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 122.0
      }
    ]
  },
  {
    "word": "ROSEMARY",
    "display": "Rosemary",
    "groups": [
      "spice"
    ],
    "ndb": "2063",
    "desc": "Rosemary, fresh",
    "cal": 131.0,
    "pro": 3.3,
    "fat": 5.9,
    "carb": 20.7,
    "fib": 14.1,
    "h2o": 67.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 0.7
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 1.7
      }
    ]
  },
  {
    "word": "SAFFRON",
    "display": "Saffron",
    "groups": [
      "spice"
    ],
    "ndb": "2037",
    "desc": "Spices, saffron",
    "cal": 310.0,
    "pro": 11.4,
    "fat": 5.8,
    "carb": 65.4,
    "fib": 3.9,
    "h2o": 11.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 0.7
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 2.1
      }
    ]
  },
  {
    "word": "SAGE",
    "display": "Sage",
    "groups": [
      "spice"
    ],
    "ndb": "28367",
    "desc": "SAGE VALLEY, Gluten Free Vanilla Sandwich Cookies",
    "cal": 499.0,
    "pro": 3.1,
    "fat": 22.1,
    "carb": 71.9,
    "fib": 1.0,
    "h2o": 2.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 3.0,
        "desc": "cookies",
        "gm": 44.0
      }
    ]
  },
  {
    "word": "SALT",
    "display": "Salt",
    "groups": [
      "spice"
    ],
    "ndb": "2047",
    "desc": "Salt, table",
    "cal": 0.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 0.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 6.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 18.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 292.0
      },
      {
        "amt": 1.0,
        "desc": "dash",
        "gm": 0.4
      }
    ]
  },
  {
    "word": "SORGHUMSYRUP",
    "display": "Sorghum Syrup",
    "groups": [
      "spice"
    ],
    "ndb": "19355",
    "desc": "Syrups, sorghum",
    "cal": 290.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 74.9,
    "fib": 0.0,
    "h2o": 22.7,
    "sug": 74.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 330.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 21.0
      }
    ]
  },
  {
    "word": "SOYSAUCE",
    "display": "Soy Sauce",
    "groups": [
      "spice"
    ],
    "ndb": "16123",
    "desc": "Soy sauce made from soy and wheat (shoyu)",
    "cal": 53.0,
    "pro": 8.1,
    "fat": 0.6,
    "carb": 4.9,
    "fib": 0.8,
    "h2o": 71.2,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 5.3
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 255.0
      },
      {
        "amt": 1.0,
        "desc": "individual packet",
        "gm": 8.9
      }
    ]
  },
  {
    "word": "SPEARMINT",
    "display": "Spearmint",
    "groups": [
      "spice"
    ],
    "ndb": "2065",
    "desc": "Spearmint, fresh",
    "cal": 44.0,
    "pro": 3.3,
    "fat": 0.7,
    "carb": 8.4,
    "fib": 6.8,
    "h2o": 85.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "leaves",
        "gm": 0.3
      },
      {
        "amt": 2.0,
        "desc": "tbsp",
        "gm": 11.4
      }
    ]
  },
  {
    "word": "SRIRACHA",
    "display": "Sriracha",
    "groups": [
      "spice"
    ],
    "ndb": "6631",
    "desc": "Sauce, hot chile, sriracha",
    "cal": 93.0,
    "pro": 1.9,
    "fat": 0.9,
    "carb": 19.2,
    "fib": 2.2,
    "h2o": 71.8,
    "sug": 15.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 6.5
      }
    ]
  },
  {
    "word": "SUGAR",
    "display": "Sugar",
    "groups": [
      "spice"
    ],
    "ndb": "19335",
    "desc": "Sugars, granulated",
    "cal": 387.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 100.0,
    "fib": 0.0,
    "h2o": 0.0,
    "sug": 99.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving packet",
        "gm": 2.8
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.2
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 200.0
      },
      {
        "amt": 1.0,
        "desc": "serving 1 cube",
        "gm": 2.3
      }
    ]
  },
  {
    "word": "SUGARBROWN",
    "display": "Sugar Brown",
    "groups": [
      "spice"
    ],
    "ndb": "19334",
    "desc": "Sugars, brown",
    "cal": 380.0,
    "pro": 0.1,
    "fat": 0.0,
    "carb": 98.1,
    "fib": 0.0,
    "h2o": 1.3,
    "sug": 97.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp unpacked",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "cup packed",
        "gm": 220.0
      },
      {
        "amt": 1.0,
        "desc": "cup unpacked",
        "gm": 145.0
      },
      {
        "amt": 1.0,
        "desc": "tsp packed",
        "gm": 4.6
      },
      {
        "amt": 1.0,
        "desc": "tsp brownulated",
        "gm": 3.2
      }
    ]
  },
  {
    "word": "SUGARMAPLE",
    "display": "Sugar Maple",
    "groups": [
      "spice"
    ],
    "ndb": "19340",
    "desc": "Sugars, maple",
    "cal": 354.0,
    "pro": 0.1,
    "fat": 0.2,
    "carb": 90.9,
    "fib": 0.0,
    "h2o": 8.0,
    "sug": 84.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      },
      {
        "amt": 1.0,
        "desc": "piece (1-3/4\" x 1-1/4\" x 1/2\")",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "SUGARPOWDERED",
    "display": "Sugar Powdered",
    "groups": [
      "spice"
    ],
    "ndb": "18336",
    "desc": "Pie crust, standard-type, prepared from recipe, baked",
    "cal": 527.0,
    "pro": 6.4,
    "fat": 34.6,
    "carb": 47.5,
    "fib": 1.7,
    "h2o": 9.8,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece (1/8 of 9\" crust)",
        "gm": 23.0
      },
      {
        "amt": 1.0,
        "desc": "crust, single 9\"",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "SWEETENER",
    "display": "Sweetener",
    "groups": [
      "spice"
    ],
    "ndb": "19337",
    "desc": "Sweeteners, tabletop, aspartame, EQUAL, packets",
    "cal": 365.0,
    "pro": 2.2,
    "fat": 0.0,
    "carb": 89.1,
    "fib": 0.0,
    "h2o": 8.8,
    "sug": 80.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 3.5
      },
      {
        "amt": 1.0,
        "desc": "serving 1 packet",
        "gm": 1.0
      }
    ]
  },
  {
    "word": "SYRUPAGAVE",
    "display": "Syrup Agave",
    "groups": [
      "spice"
    ],
    "ndb": "19912",
    "desc": "Sweetener, syrup, agave",
    "cal": 310.0,
    "pro": 0.1,
    "fat": 0.5,
    "carb": 76.4,
    "fib": 0.2,
    "h2o": 22.9,
    "sug": 68.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 6.9
      },
      {
        "amt": 0.25,
        "desc": "cup",
        "gm": 55.0
      }
    ]
  },
  {
    "word": "SYRUPCANE",
    "display": "Syrup Cane",
    "groups": [
      "spice"
    ],
    "ndb": "90480",
    "desc": "Syrup, Cane",
    "cal": 269.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 73.1,
    "fib": 0.0,
    "h2o": 26.0,
    "sug": 73.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 21.0
      }
    ]
  },
  {
    "word": "SYRUPCHOC",
    "display": "Syrupchoc",
    "groups": [
      "spice"
    ],
    "ndb": "14182",
    "desc": "Beverages, Chocolate syrup, prepared with whole milk",
    "cal": 90.0,
    "pro": 3.1,
    "fat": 3.0,
    "carb": 12.8,
    "fib": 0.3,
    "h2o": 80.5,
    "sug": 11.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (8 fl oz)",
        "gm": 282.0
      }
    ]
  },
  {
    "word": "SYRUPCORNDARK",
    "display": "Syrup Corn Dark",
    "groups": [
      "spice"
    ],
    "ndb": "19349",
    "desc": "Syrups, corn, dark",
    "cal": 286.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 77.6,
    "fib": 0.0,
    "h2o": 22.0,
    "sug": 77.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 328.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 20.0
      }
    ]
  },
  {
    "word": "SYRUPCORNLIGHT",
    "display": "Syrup Corn Light",
    "groups": [
      "spice"
    ],
    "ndb": "19350",
    "desc": "Syrups, corn, light",
    "cal": 283.0,
    "pro": 0.0,
    "fat": 0.2,
    "carb": 76.8,
    "fib": 0.0,
    "h2o": 22.8,
    "sug": 76.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 341.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 22.0
      }
    ]
  },
  {
    "word": "SYRUPHIGHFRUCTOSE",
    "display": "Syrup High Fructose",
    "groups": [
      "spice"
    ],
    "ndb": "19351",
    "desc": "Syrups, corn, high-fructose",
    "cal": 281.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 76.0,
    "fib": 0.0,
    "h2o": 24.0,
    "sug": 75.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 310.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "SYRUPPANCAKE",
    "display": "Syrup Pancake",
    "groups": [
      "spice"
    ],
    "ndb": "19129",
    "desc": "Syrups, table blends, pancake",
    "cal": 234.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 61.5,
    "fib": 0.0,
    "h2o": 38.0,
    "sug": 21.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 314.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 20.0
      }
    ]
  },
  {
    "word": "SYRUPSORGHUM",
    "display": "Syrup Sorghum",
    "groups": [
      "spice"
    ],
    "ndb": "19355",
    "desc": "Syrups, sorghum",
    "cal": 290.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 74.9,
    "fib": 0.0,
    "h2o": 22.7,
    "sug": 74.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 330.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 21.0
      }
    ]
  },
  {
    "word": "TABASCO",
    "display": "Tabasco",
    "groups": [
      "spice"
    ],
    "ndb": "6169",
    "desc": "Sauce, ready-to-serve, pepper, TABASCO",
    "cal": 12.0,
    "pro": 1.3,
    "fat": 0.8,
    "carb": 0.8,
    "fib": 0.6,
    "h2o": 95.2,
    "sug": 0.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.7
      },
      {
        "amt": 0.25,
        "desc": "tsp",
        "gm": 1.2
      }
    ]
  },
  {
    "word": "TAHINI",
    "display": "Tahini",
    "groups": [
      "spice"
    ],
    "ndb": "12166",
    "desc": "Seeds, sesame butter, tahini, from roasted and toasted kernels (most common type)",
    "cal": 595.0,
    "pro": 17.0,
    "fat": 53.8,
    "carb": 21.2,
    "fib": 9.3,
    "h2o": 3.0,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "oz",
        "gm": 28.35
      }
    ]
  },
  {
    "word": "TARRAGON",
    "display": "Tarragon",
    "groups": [
      "spice"
    ],
    "ndb": "2041",
    "desc": "Spices, tarragon, dried",
    "cal": 295.0,
    "pro": 22.8,
    "fat": 7.2,
    "carb": 50.2,
    "fib": 7.4,
    "h2o": 7.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, leaves",
        "gm": 0.6
      },
      {
        "amt": 1.0,
        "desc": "tbsp, leaves",
        "gm": 1.8
      },
      {
        "amt": 1.0,
        "desc": "tsp, ground",
        "gm": 1.6
      },
      {
        "amt": 1.0,
        "desc": "tbsp, ground",
        "gm": 4.8
      }
    ]
  },
  {
    "word": "TERIYAKI",
    "display": "Teriyaki",
    "groups": [
      "spice"
    ],
    "ndb": "6112",
    "desc": "Sauce, teriyaki, ready-to-serve",
    "cal": 89.0,
    "pro": 5.9,
    "fat": 0.0,
    "carb": 15.6,
    "fib": 0.1,
    "h2o": 67.7,
    "sug": 14.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 18.0
      },
      {
        "amt": 1.0,
        "desc": "fl oz",
        "gm": 36.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 288.0
      }
    ]
  },
  {
    "word": "THYME",
    "display": "Thyme",
    "groups": [
      "spice"
    ],
    "ndb": "2049",
    "desc": "Thyme, fresh",
    "cal": 101.0,
    "pro": 5.6,
    "fat": 1.7,
    "carb": 24.4,
    "fib": 14.0,
    "h2o": 65.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 0.8
      },
      {
        "amt": 0.5,
        "desc": "tsp",
        "gm": 0.4
      }
    ]
  },
  {
    "word": "TOMATOSAUCE",
    "display": "Tomato Sauce",
    "groups": [
      "spice"
    ],
    "ndb": "43217",
    "desc": "Tomato sauce, canned, no salt added",
    "cal": 24.0,
    "pro": 1.2,
    "fat": 0.3,
    "carb": 5.3,
    "fib": 1.5,
    "h2o": 91.3,
    "sug": 3.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "TOMATOSUNDRIED",
    "display": "Tomato Sun-dried",
    "groups": [
      "spice"
    ],
    "ndb": "11956",
    "desc": "Tomatoes, sun-dried, packed in oil, drained",
    "cal": 213.0,
    "pro": 5.1,
    "fat": 14.1,
    "carb": 23.3,
    "fib": 5.8,
    "h2o": 53.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 110.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 3.0
      }
    ]
  },
  {
    "word": "TURMERIC",
    "display": "Turmeric",
    "groups": [
      "spice"
    ],
    "ndb": "2043",
    "desc": "Spices, turmeric, ground",
    "cal": 312.0,
    "pro": 9.7,
    "fat": 3.2,
    "carb": 67.1,
    "fib": 22.7,
    "h2o": 12.8,
    "sug": 3.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 9.4
      }
    ]
  },
  {
    "word": "VANILLA",
    "display": "Vanilla",
    "groups": [
      "spice",
      "fruit"
    ],
    "ndb": "2050",
    "desc": "Vanilla extract",
    "cal": 288.0,
    "pro": 0.1,
    "fat": 0.1,
    "carb": 12.7,
    "fib": 0.0,
    "h2o": 52.6,
    "sug": 12.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.2
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 13.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 208.0
      }
    ]
  },
  {
    "word": "VINEGARBALSAMIC",
    "display": "Vinegar Balsamic",
    "groups": [
      "spice"
    ],
    "ndb": "2069",
    "desc": "Vinegar, balsamic",
    "cal": 88.0,
    "pro": 0.5,
    "fat": 0.0,
    "carb": 17.0,
    "fib": 0.0,
    "h2o": 76.5,
    "sug": 14.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 16.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 255.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 5.3
      }
    ]
  },
  {
    "word": "VINEGARCIDER",
    "display": "Vinegar Cider",
    "groups": [
      "spice"
    ],
    "ndb": "2048",
    "desc": "Vinegar, cider",
    "cal": 21.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.9,
    "fib": 0.0,
    "h2o": 93.8,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.9
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 239.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "VINEGARDISTILLED",
    "display": "Vinegar Distilled",
    "groups": [
      "spice"
    ],
    "ndb": "2053",
    "desc": "Vinegar, distilled",
    "cal": 18.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.0,
    "fib": 0.0,
    "h2o": 94.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.9
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 238.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "VINEGARREDWINE",
    "display": "Vinegar Red Wine",
    "groups": [
      "spice"
    ],
    "ndb": "2068",
    "desc": "Vinegar, red wine",
    "cal": 19.0,
    "pro": 0.0,
    "fat": 0.0,
    "carb": 0.3,
    "fib": 0.0,
    "h2o": 94.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 14.9
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 239.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "WASABI",
    "display": "Wasabi",
    "groups": [
      "spice"
    ],
    "ndb": "11990",
    "desc": "Wasabi, root, raw",
    "cal": 109.0,
    "pro": 4.8,
    "fat": 0.6,
    "carb": 23.5,
    "fib": 7.8,
    "h2o": 69.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 130.0
      },
      {
        "amt": 1.0,
        "desc": "root",
        "gm": 169.0
      }
    ]
  },
  {
    "word": "WHEATGLUTEN",
    "display": "Wheat Gluten",
    "groups": [
      "spice"
    ],
    "ndb": "48052",
    "desc": "Vital wheat gluten",
    "cal": 370.0,
    "pro": 75.2,
    "fat": 1.9,
    "carb": 13.8,
    "fib": 0.6,
    "h2o": 8.2,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "YEAST",
    "display": "Yeast",
    "groups": [
      "spice"
    ],
    "ndb": "18375",
    "desc": "Leavening agents, yeast, baker's, active dry",
    "cal": 325.0,
    "pro": 40.4,
    "fat": 7.6,
    "carb": 41.2,
    "fib": 26.9,
    "h2o": 5.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 4.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 12.0
      },
      {
        "amt": 1.0,
        "desc": "packet",
        "gm": 7.2
      }
    ]
  },
  {
    "word": "ABIYUCH",
    "display": "Abiyuch",
    "groups": [
      "vegetable"
    ],
    "ndb": "9427",
    "desc": "Abiyuch, raw",
    "cal": 69.0,
    "pro": 1.5,
    "fat": 0.1,
    "carb": 17.6,
    "fib": 5.3,
    "h2o": 79.9,
    "sug": 8.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 114.0
      }
    ]
  },
  {
    "word": "AGAVE",
    "display": "Agave",
    "groups": [
      "vegetable"
    ],
    "ndb": "35192",
    "desc": "Agave, raw (Southwest)",
    "cal": 68.0,
    "pro": 0.5,
    "fat": 0.1,
    "carb": 16.2,
    "fib": 6.6,
    "h2o": 81.8,
    "sug": 2.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "ALFALFA",
    "display": "Alfalfa",
    "groups": [
      "vegetable"
    ],
    "ndb": "11001",
    "desc": "Alfalfa seeds, sprouted, raw",
    "cal": 23.0,
    "pro": 4.0,
    "fat": 0.7,
    "carb": 2.1,
    "fib": 1.9,
    "h2o": 92.8,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 3.0
      }
    ]
  },
  {
    "word": "AMARANTHLEAVE",
    "display": "Amaranth Leave",
    "groups": [
      "vegetable"
    ],
    "ndb": "11004",
    "desc": "Amaranth leaves, cooked, boiled, drained, without salt",
    "cal": 21.0,
    "pro": 2.1,
    "fat": 0.2,
    "carb": 4.1,
    "fib": 0.0,
    "h2o": 91.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 132.0
      }
    ]
  },
  {
    "word": "ARROWHEAD",
    "display": "Arrowhead",
    "groups": [
      "vegetable"
    ],
    "ndb": "11005",
    "desc": "Arrowhead, raw",
    "cal": 99.0,
    "pro": 5.3,
    "fat": 0.3,
    "carb": 20.2,
    "fib": 0.0,
    "h2o": 72.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 25.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 12.0
      }
    ]
  },
  {
    "word": "ARROWROOT",
    "display": "Arrowroot",
    "groups": [
      "vegetable"
    ],
    "ndb": "11697",
    "desc": "Arrowroot, raw",
    "cal": 65.0,
    "pro": 4.2,
    "fat": 0.2,
    "carb": 13.4,
    "fib": 1.3,
    "h2o": 80.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "root",
        "gm": 33.0
      }
    ]
  },
  {
    "word": "ARTICHOKE",
    "display": "Artichoke",
    "groups": [
      "vegetable"
    ],
    "ndb": "11008",
    "desc": "Artichokes, (globe or french), cooked, boiled, drained, without salt",
    "cal": 53.0,
    "pro": 2.9,
    "fat": 0.3,
    "carb": 11.9,
    "fib": 5.7,
    "h2o": 84.1,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "artichoke, medium",
        "gm": 120.0
      },
      {
        "amt": 0.5,
        "desc": "cup hearts",
        "gm": 84.0
      }
    ]
  },
  {
    "word": "ARUGULA",
    "display": "Arugula",
    "groups": [
      "vegetable"
    ],
    "ndb": "11959",
    "desc": "Arugula, raw",
    "cal": 25.0,
    "pro": 2.6,
    "fat": 0.7,
    "carb": 3.6,
    "fib": 1.6,
    "h2o": 91.7,
    "sug": 2.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 2.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "ASPARAGUS",
    "display": "Asparagus",
    "groups": [
      "vegetable"
    ],
    "ndb": "11019",
    "desc": "Asparagus, frozen, cooked, boiled, drained, without salt",
    "cal": 18.0,
    "pro": 3.0,
    "fat": 0.4,
    "carb": 1.9,
    "fib": 1.6,
    "h2o": 94.1,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "package (10 oz) yields",
        "gm": 293.0
      },
      {
        "amt": 4.0,
        "desc": "spears",
        "gm": 60.0
      }
    ]
  },
  {
    "word": "AVOCADO",
    "display": "Avocado",
    "groups": [
      "vegetable",
      "fruit",
      "fats"
    ],
    "ndb": "9038",
    "desc": "Avocados, raw, California",
    "cal": 167.0,
    "pro": 2.0,
    "fat": 15.4,
    "carb": 8.6,
    "fib": 6.8,
    "h2o": 72.3,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pureed",
        "gm": 230.0
      },
      {
        "amt": 1.0,
        "desc": "fruit, without skin and seed",
        "gm": 136.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 30.0
      }
    ]
  },
  {
    "word": "BAMBOO",
    "display": "Bamboo",
    "groups": [
      "vegetable"
    ],
    "ndb": "11026",
    "desc": "Bamboo shoots, raw",
    "cal": 27.0,
    "pro": 2.6,
    "fat": 0.3,
    "carb": 5.2,
    "fib": 2.2,
    "h2o": 91.0,
    "sug": 3.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1/2\" slices)",
        "gm": 151.0
      },
      {
        "amt": 0.5,
        "desc": "cup (1/2\" pieces)",
        "gm": 76.0
      }
    ]
  },
  {
    "word": "BEET",
    "display": "Beet",
    "groups": [
      "vegetable"
    ],
    "ndb": "11080",
    "desc": "Beets, raw",
    "cal": 43.0,
    "pro": 1.6,
    "fat": 0.2,
    "carb": 9.6,
    "fib": 2.8,
    "h2o": 87.6,
    "sug": 6.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 136.0
      },
      {
        "amt": 1.0,
        "desc": "beet (2\" dia)",
        "gm": 82.0
      }
    ]
  },
  {
    "word": "BEETCOOKED",
    "display": "Beet Cooked",
    "groups": [
      "vegetable"
    ],
    "ndb": "11081",
    "desc": "Beets, cooked, boiled, drained",
    "cal": 44.0,
    "pro": 1.7,
    "fat": 0.2,
    "carb": 10.0,
    "fib": 2.0,
    "h2o": 87.1,
    "sug": 8.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 85.0
      },
      {
        "amt": 2.0,
        "desc": "beets (2\" dia, sphere)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "BEETPICKLED",
    "display": "Beet Pickled",
    "groups": [
      "vegetable"
    ],
    "ndb": "11609",
    "desc": "Beets, pickled, canned, solids and liquids",
    "cal": 65.0,
    "pro": 0.8,
    "fat": 0.1,
    "carb": 16.3,
    "fib": 0.8,
    "h2o": 81.9,
    "sug": 11.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 227.0
      }
    ]
  },
  {
    "word": "BOK CHOY",
    "display": "Bok Choy",
    "groups": [
      "vegetable"
    ],
    "ndb": "11116",
    "desc": "Cabbage, chinese (pak-choi), raw",
    "cal": 13.0,
    "pro": 1.5,
    "fat": 0.2,
    "carb": 2.2,
    "fib": 1.0,
    "h2o": 95.3,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 70.0
      },
      {
        "amt": 1.0,
        "desc": "head",
        "gm": 840.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "BORAGE",
    "display": "Borage",
    "groups": [
      "vegetable"
    ],
    "ndb": "11614",
    "desc": "Borage, cooked, boiled, drained, without salt",
    "cal": 25.0,
    "pro": 2.1,
    "fat": 0.8,
    "carb": 3.5,
    "fib": 0.0,
    "h2o": 91.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "BROCCOLI",
    "display": "Broccoli",
    "groups": [
      "vegetable"
    ],
    "ndb": "11090",
    "desc": "Broccoli, raw",
    "cal": 34.0,
    "pro": 2.8,
    "fat": 0.4,
    "carb": 6.6,
    "fib": 2.6,
    "h2o": 89.3,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup chopped",
        "gm": 91.0
      },
      {
        "amt": 1.0,
        "desc": "bunch",
        "gm": 608.0
      },
      {
        "amt": 1.0,
        "desc": "spear (about 5\" long)",
        "gm": 31.0
      },
      {
        "amt": 1.0,
        "desc": "stalk",
        "gm": 151.0
      },
      {
        "amt": 0.5,
        "desc": "cup, chopped or diced",
        "gm": 44.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 148.0
      }
    ]
  },
  {
    "word": "BROCCOLICOOKED",
    "display": "Broccoli Cooked",
    "groups": [
      "vegetable"
    ],
    "ndb": "11091",
    "desc": "Broccoli, cooked, boiled, drained, without salt",
    "cal": 35.0,
    "pro": 2.4,
    "fat": 0.4,
    "carb": 7.2,
    "fib": 3.3,
    "h2o": 89.2,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup, chopped",
        "gm": 78.0
      },
      {
        "amt": 1.0,
        "desc": "stalk, large (11\"-12\" long)",
        "gm": 280.0
      },
      {
        "amt": 1.0,
        "desc": "stalk, medium (7-1/2\" - 8\" long)",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "stalk, small (5\" long)",
        "gm": 140.0
      },
      {
        "amt": 1.0,
        "desc": "spear (about 5\" long)",
        "gm": 37.0
      }
    ]
  },
  {
    "word": "BROCCOLIRAAB",
    "display": "Broccoli Raab",
    "groups": [
      "vegetable"
    ],
    "ndb": "11097",
    "desc": "Broccoli raab, cooked",
    "cal": 33.0,
    "pro": 3.8,
    "fat": 0.5,
    "carb": 3.1,
    "fib": 2.8,
    "h2o": 91.4,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 85.0
      },
      {
        "amt": 1.0,
        "desc": "bunch cooked",
        "gm": 437.0
      }
    ]
  },
  {
    "word": "BRUSSELSPROUTS",
    "display": "Brussel Sprouts",
    "groups": [
      "vegetable"
    ],
    "ndb": "11099",
    "desc": "Brussels sprouts, cooked, boiled, drained, without salt",
    "cal": 36.0,
    "pro": 2.5,
    "fat": 0.5,
    "carb": 7.1,
    "fib": 2.6,
    "h2o": 88.9,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "sprout",
        "gm": 21.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 78.0
      }
    ]
  },
  {
    "word": "BURDOCK",
    "display": "Burdock",
    "groups": [
      "vegetable"
    ],
    "ndb": "11105",
    "desc": "Burdock root, cooked, boiled, drained, without salt",
    "cal": 88.0,
    "pro": 2.1,
    "fat": 0.1,
    "carb": 21.1,
    "fib": 1.8,
    "h2o": 75.6,
    "sug": 3.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1\" pieces)",
        "gm": 125.0
      },
      {
        "amt": 1.0,
        "desc": "root",
        "gm": 166.0
      }
    ]
  },
  {
    "word": "BUTTERBUR",
    "display": "Butterbur",
    "groups": [
      "vegetable"
    ],
    "ndb": "11107",
    "desc": "Butterbur, cooked, boiled, drained, without salt",
    "cal": 8.0,
    "pro": 0.2,
    "fat": 0.0,
    "carb": 2.2,
    "fib": 0.0,
    "h2o": 96.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CABBAGE",
    "display": "Cabbage",
    "groups": [
      "vegetable"
    ],
    "ndb": "11109",
    "desc": "Cabbage, raw",
    "cal": 25.0,
    "pro": 1.3,
    "fat": 0.1,
    "carb": 5.8,
    "fib": 2.5,
    "h2o": 92.2,
    "sug": 3.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 89.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 70.0
      },
      {
        "amt": 1.0,
        "desc": "head, large (about 7\" dia)",
        "gm": 1248.0
      },
      {
        "amt": 1.0,
        "desc": "leaf, large",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "head, medium (about 5-3/4\" dia)",
        "gm": 908.0
      },
      {
        "amt": 1.0,
        "desc": "leaf, medium",
        "gm": 23.0
      },
      {
        "amt": 1.0,
        "desc": "head, small (about 4-1/2\" dia)",
        "gm": 714.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "CABBAGECOOKED",
    "display": "Cabbage Cooked",
    "groups": [
      "vegetable"
    ],
    "ndb": "11110",
    "desc": "Cabbage, cooked, boiled, drained, without salt",
    "cal": 23.0,
    "pro": 1.3,
    "fat": 0.1,
    "carb": 5.5,
    "fib": 1.9,
    "h2o": 92.6,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup, shredded",
        "gm": 75.0
      },
      {
        "amt": 1.0,
        "desc": "head",
        "gm": 1262.0
      }
    ]
  },
  {
    "word": "CARDOON",
    "display": "Cardoon",
    "groups": [
      "vegetable"
    ],
    "ndb": "11123",
    "desc": "Cardoon, cooked, boiled, drained, without salt",
    "cal": 22.0,
    "pro": 0.8,
    "fat": 0.1,
    "carb": 5.3,
    "fib": 1.7,
    "h2o": 93.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "CARROT",
    "display": "Carrot",
    "groups": [
      "vegetable"
    ],
    "ndb": "11124",
    "desc": "Carrots, raw",
    "cal": 41.0,
    "pro": 0.9,
    "fat": 0.2,
    "carb": 9.6,
    "fib": 2.8,
    "h2o": 88.3,
    "sug": 4.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup chopped",
        "gm": 128.0
      },
      {
        "amt": 1.0,
        "desc": "cup grated",
        "gm": 110.0
      },
      {
        "amt": 1.0,
        "desc": "cup strips or slices",
        "gm": 122.0
      },
      {
        "amt": 1.0,
        "desc": "large (7-1/4\" to 8-/1/2\" long)",
        "gm": 72.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 61.0
      },
      {
        "amt": 1.0,
        "desc": "small (5-1/2\" long)",
        "gm": 50.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "strip large (3\" long)",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "strip medium",
        "gm": 4.0
      }
    ]
  },
  {
    "word": "CARROTCOOKED",
    "display": "Carrot Cooked",
    "groups": [
      "vegetable"
    ],
    "ndb": "11125",
    "desc": "Carrots, cooked, boiled, drained, without salt",
    "cal": 35.0,
    "pro": 0.8,
    "fat": 0.2,
    "carb": 8.2,
    "fib": 3.0,
    "h2o": 90.2,
    "sug": 3.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 9.7
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 78.0
      },
      {
        "amt": 1.0,
        "desc": "carrot",
        "gm": 46.0
      }
    ]
  },
  {
    "word": "CASSAVA",
    "display": "Cassava",
    "groups": [
      "vegetable"
    ],
    "ndb": "11134",
    "desc": "Cassava, raw",
    "cal": 160.0,
    "pro": 1.4,
    "fat": 0.3,
    "carb": 38.1,
    "fib": 1.8,
    "h2o": 59.7,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 206.0
      },
      {
        "amt": 1.0,
        "desc": "root",
        "gm": 408.0
      }
    ]
  },
  {
    "word": "CATTAIL",
    "display": "Cattail",
    "groups": [
      "vegetable"
    ],
    "ndb": "35195",
    "desc": "Cattail, Narrow Leaf Shoots (Northern Plains Indians)",
    "cal": 25.0,
    "pro": 1.2,
    "fat": 0.0,
    "carb": 5.1,
    "fib": 4.5,
    "h2o": 92.7,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "shoot",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "CAULIFLOWER",
    "display": "Cauliflower",
    "groups": [
      "vegetable"
    ],
    "ndb": "11135",
    "desc": "Cauliflower, raw",
    "cal": 25.0,
    "pro": 1.9,
    "fat": 0.3,
    "carb": 5.0,
    "fib": 2.0,
    "h2o": 92.1,
    "sug": 1.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup chopped (1/2\" pieces)",
        "gm": 107.0
      },
      {
        "amt": 1.0,
        "desc": "floweret",
        "gm": 13.0
      },
      {
        "amt": 1.0,
        "desc": "head large (6-7\" dia.)",
        "gm": 840.0
      },
      {
        "amt": 1.0,
        "desc": "head medium (5-6\" dia.)",
        "gm": 588.0
      },
      {
        "amt": 1.0,
        "desc": "head small (4\" dia.)",
        "gm": 265.0
      }
    ]
  },
  {
    "word": "CAULIFLOWERCOOKED",
    "display": "Cauliflower Cooked",
    "groups": [
      "vegetable"
    ],
    "ndb": "11136",
    "desc": "Cauliflower, cooked, boiled, drained, without salt",
    "cal": 23.0,
    "pro": 1.8,
    "fat": 0.5,
    "carb": 4.1,
    "fib": 2.3,
    "h2o": 93.0,
    "sug": 2.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup (1\" pieces)",
        "gm": 62.0
      },
      {
        "amt": 3.0,
        "desc": "flowerets",
        "gm": 54.0
      }
    ]
  },
  {
    "word": "CELERIAC",
    "display": "Celeriac",
    "groups": [
      "vegetable"
    ],
    "ndb": "11142",
    "desc": "Celeriac, cooked, boiled, drained, without salt",
    "cal": 27.0,
    "pro": 1.0,
    "fat": 0.2,
    "carb": 5.9,
    "fib": 1.2,
    "h2o": 92.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup pieces",
        "gm": 155.0
      }
    ]
  },
  {
    "word": "CELERY",
    "display": "Celery",
    "groups": [
      "vegetable"
    ],
    "ndb": "11143",
    "desc": "Celery, raw",
    "cal": 16.0,
    "pro": 0.7,
    "fat": 0.2,
    "carb": 3.0,
    "fib": 1.6,
    "h2o": 95.4,
    "sug": 1.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup chopped",
        "gm": 101.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA serving",
        "gm": 110.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 7.5
      },
      {
        "amt": 1.0,
        "desc": "stalk, large (11\"-12\" long)",
        "gm": 64.0
      },
      {
        "amt": 1.0,
        "desc": "stalk, medium (7-1/2\" - 8\" long)",
        "gm": 40.0
      },
      {
        "amt": 1.0,
        "desc": "stalk, small (5\" long)",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "strip (4\" long)",
        "gm": 4.0
      }
    ]
  },
  {
    "word": "CELTUCE",
    "display": "Celtuce",
    "groups": [
      "vegetable"
    ],
    "ndb": "11145",
    "desc": "Celtuce, raw",
    "cal": 18.0,
    "pro": 0.8,
    "fat": 0.3,
    "carb": 3.6,
    "fib": 1.7,
    "h2o": 94.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 8.0
      }
    ]
  },
  {
    "word": "CHANTERELLE",
    "display": "Chanterelle",
    "groups": [
      "vegetable"
    ],
    "ndb": "11239",
    "desc": "Mushrooms, Chanterelle, raw",
    "cal": 38.0,
    "pro": 1.5,
    "fat": 0.5,
    "carb": 6.9,
    "fib": 3.8,
    "h2o": 89.8,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 54.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 5.4
      }
    ]
  },
  {
    "word": "CHARD",
    "display": "Chard",
    "groups": [
      "vegetable"
    ],
    "ndb": "11148",
    "desc": "Chard, swiss, cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 1.9,
    "fat": 0.1,
    "carb": 4.1,
    "fib": 2.1,
    "h2o": 92.7,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 175.0
      }
    ]
  },
  {
    "word": "CHICORY",
    "display": "Chicory",
    "groups": [
      "vegetable"
    ],
    "ndb": "11154",
    "desc": "Chicory roots, raw",
    "cal": 72.0,
    "pro": 1.4,
    "fat": 0.2,
    "carb": 17.5,
    "fib": 1.5,
    "h2o": 80.0,
    "sug": 8.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "root",
        "gm": 60.0
      },
      {
        "amt": 0.5,
        "desc": "cup (1\" pieces)",
        "gm": 45.0
      }
    ]
  },
  {
    "word": "CHRYSANTHEMUM",
    "display": "Chrysanthemum",
    "groups": [
      "vegetable"
    ],
    "ndb": "11158",
    "desc": "Chrysanthemum, garland, cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 1.6,
    "fat": 0.1,
    "carb": 4.3,
    "fib": 2.3,
    "h2o": 92.5,
    "sug": 2.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1\" pieces)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "COLESLAW",
    "display": "Coleslaw",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "21127",
    "desc": "Fast foods, coleslaw",
    "cal": 153.0,
    "pro": 0.9,
    "fat": 9.9,
    "carb": 14.9,
    "fib": 1.9,
    "h2o": 73.4,
    "sug": 12.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 191.0
      },
      {
        "amt": 1.0,
        "desc": "package",
        "gm": 116.0
      }
    ]
  },
  {
    "word": "COLLARD",
    "display": "Collard",
    "groups": [
      "vegetable"
    ],
    "ndb": "11162",
    "desc": "Collards, cooked, boiled, drained, without salt",
    "cal": 33.0,
    "pro": 2.7,
    "fat": 0.7,
    "carb": 5.7,
    "fib": 4.0,
    "h2o": 90.2,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 190.0
      }
    ]
  },
  {
    "word": "CORN",
    "display": "Corn",
    "groups": [
      "vegetable",
      "grain"
    ],
    "ndb": "11168",
    "desc": "Corn, sweet, yellow, cooked, boiled, drained, without salt",
    "cal": 96.0,
    "pro": 3.4,
    "fat": 1.5,
    "carb": 21.0,
    "fib": 2.4,
    "h2o": 73.4,
    "sug": 4.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "ear small (5-1/2\" to 6-1/2\" long)",
        "gm": 89.0
      },
      {
        "amt": 1.0,
        "desc": "ear medium (6-3/4\" to 7-1/2\" long)",
        "gm": 103.0
      },
      {
        "amt": 1.0,
        "desc": "ear large (7-3/4\" to 9\" long)",
        "gm": 118.0
      },
      {
        "amt": 1.0,
        "desc": "cup cut",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "baby ear",
        "gm": 8.0
      }
    ]
  },
  {
    "word": "CORNSALAD",
    "display": "Corn Salad",
    "groups": [
      "vegetable"
    ],
    "ndb": "11190",
    "desc": "Cornsalad, raw",
    "cal": 21.0,
    "pro": 2.0,
    "fat": 0.4,
    "carb": 3.6,
    "fib": 0.0,
    "h2o": 92.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 56.0
      }
    ]
  },
  {
    "word": "CROOKNECK",
    "display": "Crookneck",
    "groups": [
      "vegetable"
    ],
    "ndb": "11468",
    "desc": "Squash, summer, crookneck and straightneck, cooked, boiled, drained, without salt",
    "cal": 23.0,
    "pro": 1.0,
    "fat": 0.4,
    "carb": 3.8,
    "fib": 1.1,
    "h2o": 94.2,
    "sug": 2.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 180.0
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 90.0
      }
    ]
  },
  {
    "word": "CUCUMBER",
    "display": "Cucumber",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11206",
    "desc": "Cucumber, peeled, raw",
    "cal": 12.0,
    "pro": 0.6,
    "fat": 0.2,
    "carb": 2.2,
    "fib": 0.7,
    "h2o": 96.7,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, pared, chopped",
        "gm": 133.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 119.0
      },
      {
        "amt": 1.0,
        "desc": "large (8-1/4\" long)",
        "gm": 280.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 201.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 7.0
      },
      {
        "amt": 1.0,
        "desc": "small (6-3/8\" long)",
        "gm": 158.0
      },
      {
        "amt": 1.0,
        "desc": "stick (4\" long)",
        "gm": 9.0
      }
    ]
  },
  {
    "word": "DANDELION",
    "display": "Dandelion",
    "groups": [
      "vegetable"
    ],
    "ndb": "11208",
    "desc": "Dandelion greens, cooked, boiled, drained, without salt",
    "cal": 33.0,
    "pro": 2.0,
    "fat": 0.6,
    "carb": 6.4,
    "fib": 2.9,
    "h2o": 89.8,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 105.0
      }
    ]
  },
  {
    "word": "DOCK",
    "display": "Dock",
    "groups": [
      "vegetable"
    ],
    "ndb": "11617",
    "desc": "Dock, cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 1.8,
    "fat": 0.6,
    "carb": 2.9,
    "fib": 2.6,
    "h2o": 93.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "EGGPLANT",
    "display": "Eggplant",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11210",
    "desc": "Eggplant, cooked, boiled, drained, without salt",
    "cal": 35.0,
    "pro": 0.8,
    "fat": 0.2,
    "carb": 8.7,
    "fib": 2.5,
    "h2o": 89.7,
    "sug": 3.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup (1\" cubes)",
        "gm": 99.0
      }
    ]
  },
  {
    "word": "ENDIVE",
    "display": "Endive",
    "groups": [
      "vegetable"
    ],
    "ndb": "11213",
    "desc": "Endive, raw",
    "cal": 17.0,
    "pro": 1.2,
    "fat": 0.2,
    "carb": 3.4,
    "fib": 3.1,
    "h2o": 93.8,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup, chopped",
        "gm": 25.0
      },
      {
        "amt": 1.0,
        "desc": "head",
        "gm": 513.0
      }
    ]
  },
  {
    "word": "ENOKI",
    "display": "Enoki",
    "groups": [
      "vegetable"
    ],
    "ndb": "11950",
    "desc": "Mushrooms, enoki, raw",
    "cal": 37.0,
    "pro": 2.7,
    "fat": 0.3,
    "carb": 7.8,
    "fib": 2.7,
    "h2o": 88.3,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 3.0
      },
      {
        "amt": 1.0,
        "desc": "cup whole",
        "gm": 64.0
      },
      {
        "amt": 1.0,
        "desc": "cup sliced",
        "gm": 65.0
      }
    ]
  },
  {
    "word": "EPPAW",
    "display": "Eppaw",
    "groups": [
      "vegetable"
    ],
    "ndb": "11618",
    "desc": "Eppaw, raw",
    "cal": 150.0,
    "pro": 4.6,
    "fat": 1.8,
    "carb": 31.7,
    "fib": 0.0,
    "h2o": 60.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "ESCAROLE",
    "display": "Escarole",
    "groups": [
      "vegetable"
    ],
    "ndb": "11214",
    "desc": "Escarole, cooked, boiled, drained, no salt added",
    "cal": 19.0,
    "pro": 1.1,
    "fat": 0.2,
    "carb": 3.1,
    "fib": 2.8,
    "h2o": 94.3,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 150.0
      }
    ]
  },
  {
    "word": "FENNEL",
    "display": "Fennel",
    "groups": [
      "vegetable"
    ],
    "ndb": "11957",
    "desc": "Fennel, bulb, raw",
    "cal": 31.0,
    "pro": 1.2,
    "fat": 0.2,
    "carb": 7.3,
    "fib": 3.1,
    "h2o": 90.2,
    "sug": 3.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 87.0
      },
      {
        "amt": 1.0,
        "desc": "bulb",
        "gm": 234.0
      }
    ]
  },
  {
    "word": "FERN",
    "display": "Fern",
    "groups": [
      "vegetable"
    ],
    "ndb": "11995",
    "desc": "Fiddlehead ferns, raw",
    "cal": 34.0,
    "pro": 4.5,
    "fat": 0.4,
    "carb": 5.5,
    "fib": 0.0,
    "h2o": 88.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "FIDDLEHEAD",
    "display": "Fiddlehead",
    "groups": [
      "vegetable"
    ],
    "ndb": "11995",
    "desc": "Fiddlehead ferns, raw",
    "cal": 34.0,
    "pro": 4.5,
    "fat": 0.4,
    "carb": 5.5,
    "fib": 0.0,
    "h2o": 88.7,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "FIREWEED",
    "display": "Fireweed",
    "groups": [
      "vegetable"
    ],
    "ndb": "11985",
    "desc": "Fireweed, leaves, raw",
    "cal": 103.0,
    "pro": 4.7,
    "fat": 2.8,
    "carb": 19.2,
    "fib": 10.6,
    "h2o": 70.8,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 23.0
      },
      {
        "amt": 1.0,
        "desc": "plant",
        "gm": 22.0
      }
    ]
  },
  {
    "word": "FRENCHFRIES",
    "display": "French Fries",
    "groups": [
      "vegetable"
    ],
    "ndb": "11403",
    "desc": "Potatoes, french fried, all types, salt added in processing, frozen, home-prepared, oven heated",
    "cal": 158.0,
    "pro": 2.8,
    "fat": 5.5,
    "carb": 25.6,
    "fib": 2.0,
    "h2o": 64.4,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 10.0,
        "desc": "fries",
        "gm": 76.0
      },
      {
        "amt": 1.0,
        "desc": "package (9 oz), yields",
        "gm": 198.0
      }
    ]
  },
  {
    "word": "GARLIC",
    "display": "Garlic",
    "groups": [
      "vegetable",
      "spice"
    ],
    "ndb": "11215",
    "desc": "Garlic, raw",
    "cal": 149.0,
    "pro": 6.4,
    "fat": 0.5,
    "carb": 33.1,
    "fib": 2.1,
    "h2o": 58.6,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 136.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.8
      },
      {
        "amt": 1.0,
        "desc": "clove",
        "gm": 3.0
      },
      {
        "amt": 3.0,
        "desc": "cloves",
        "gm": 9.0
      }
    ]
  },
  {
    "word": "GINGER",
    "display": "Ginger",
    "groups": [
      "vegetable",
      "spice"
    ],
    "ndb": "11216",
    "desc": "Ginger root, raw",
    "cal": 80.0,
    "pro": 1.8,
    "fat": 0.8,
    "carb": 17.8,
    "fib": 2.0,
    "h2o": 78.9,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 2.0
      },
      {
        "amt": 0.25,
        "desc": "cup slices (1\" dia)",
        "gm": 24.0
      },
      {
        "amt": 5.0,
        "desc": "slices (1\" dia)",
        "gm": 11.0
      }
    ]
  },
  {
    "word": "GOURD",
    "display": "Gourd",
    "groups": [
      "vegetable"
    ],
    "ndb": "11023",
    "desc": "Balsam-pear (bitter gourd), leafy tips, cooked, boiled, drained, without salt",
    "cal": 34.0,
    "pro": 3.6,
    "fat": 0.2,
    "carb": 6.7,
    "fib": 1.9,
    "h2o": 88.7,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 58.0
      }
    ]
  },
  {
    "word": "GRAPELEAVE",
    "display": "Grape Leave",
    "groups": [
      "vegetable"
    ],
    "ndb": "11974",
    "desc": "Grape leaves, raw",
    "cal": 93.0,
    "pro": 5.6,
    "fat": 2.1,
    "carb": 17.3,
    "fib": 11.0,
    "h2o": 73.3,
    "sug": 6.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 14.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 3.0
      }
    ]
  },
  {
    "word": "HASHBROWN",
    "display": "Hash Brown",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "11370",
    "desc": "Potatoes, hash brown, home-prepared",
    "cal": 265.0,
    "pro": 3.0,
    "fat": 12.5,
    "carb": 35.1,
    "fib": 3.2,
    "h2o": 47.2,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 156.0
      }
    ]
  },
  {
    "word": "HEARTOFPALM",
    "display": "Heart of Palm",
    "groups": [
      "vegetable"
    ],
    "ndb": "43392",
    "desc": "Hearts of palm, raw",
    "cal": 115.0,
    "pro": 2.7,
    "fat": 0.2,
    "carb": 25.6,
    "fib": 1.5,
    "h2o": 69.5,
    "sug": 17.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "HORSERADISH",
    "display": "Horseradish",
    "groups": [
      "vegetable",
      "spice"
    ],
    "ndb": "2055",
    "desc": "Horseradish, prepared",
    "cal": 48.0,
    "pro": 1.2,
    "fat": 0.7,
    "carb": 11.3,
    "fib": 3.3,
    "h2o": 85.1,
    "sug": 8.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "HYACINTH",
    "display": "Hyacinth",
    "groups": [
      "vegetable"
    ],
    "ndb": "11225",
    "desc": "Hyacinth-beans, immature seeds, cooked, boiled, drained, without salt",
    "cal": 50.0,
    "pro": 3.0,
    "fat": 0.3,
    "carb": 9.2,
    "fib": 0.0,
    "h2o": 86.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 87.0
      }
    ]
  },
  {
    "word": "JERUSALEM",
    "display": "Jerusalem",
    "groups": [
      "vegetable"
    ],
    "ndb": "11226",
    "desc": "Jerusalem-artichokes, raw",
    "cal": 73.0,
    "pro": 2.0,
    "fat": 0.0,
    "carb": 17.4,
    "fib": 1.6,
    "h2o": 78.0,
    "sug": 9.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 150.0
      }
    ]
  },
  {
    "word": "JICAMA",
    "display": "Jicama",
    "groups": [
      "vegetable"
    ],
    "ndb": "11603",
    "desc": "Yambean (jicama), raw",
    "cal": 38.0,
    "pro": 0.7,
    "fat": 0.1,
    "carb": 8.8,
    "fib": 4.9,
    "h2o": 90.1,
    "sug": 1.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 120.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 130.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 1200.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 659.0
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 6.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 365.0
      }
    ]
  },
  {
    "word": "JUTE",
    "display": "Jute",
    "groups": [
      "vegetable"
    ],
    "ndb": "11232",
    "desc": "Jute, potherb, cooked, boiled, drained, without salt",
    "cal": 37.0,
    "pro": 3.7,
    "fat": 0.2,
    "carb": 7.3,
    "fib": 2.0,
    "h2o": 87.2,
    "sug": 1.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 87.0
      }
    ]
  },
  {
    "word": "KALE",
    "display": "Kale",
    "groups": [
      "vegetable"
    ],
    "ndb": "11234",
    "desc": "Kale, cooked, boiled, drained, without salt",
    "cal": 28.0,
    "pro": 1.9,
    "fat": 0.4,
    "carb": 5.6,
    "fib": 2.0,
    "h2o": 91.2,
    "sug": 1.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 130.0
      }
    ]
  },
  {
    "word": "KANPYO",
    "display": "Kanpyo",
    "groups": [
      "vegetable"
    ],
    "ndb": "11237",
    "desc": "Kanpyo, (dried gourd strips)",
    "cal": 258.0,
    "pro": 8.6,
    "fat": 0.6,
    "carb": 65.0,
    "fib": 9.8,
    "h2o": 20.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "strip",
        "gm": 6.3
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 27.0
      }
    ]
  },
  {
    "word": "KELP",
    "display": "Kelp",
    "groups": [
      "vegetable"
    ],
    "ndb": "11445",
    "desc": "Seaweed, kelp, raw",
    "cal": 43.0,
    "pro": 1.7,
    "fat": 0.6,
    "carb": 9.6,
    "fib": 1.3,
    "h2o": 81.6,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp (1/8 cup)",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "KIMCHI",
    "display": "Kimchi",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "11118",
    "desc": "Cabbage, kimchi",
    "cal": 15.0,
    "pro": 1.1,
    "fat": 0.5,
    "carb": 2.4,
    "fib": 1.6,
    "h2o": 94.3,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 150.0
      }
    ]
  },
  {
    "word": "KOHLRABI",
    "display": "Kohlrabi",
    "groups": [
      "vegetable"
    ],
    "ndb": "11242",
    "desc": "Kohlrabi, cooked, boiled, drained, without salt",
    "cal": 29.0,
    "pro": 1.8,
    "fat": 0.1,
    "carb": 6.7,
    "fib": 1.1,
    "h2o": 90.3,
    "sug": 2.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 165.0
      }
    ]
  },
  {
    "word": "LAMBSQUARTERS",
    "display": "Lambsquarters",
    "groups": [
      "vegetable"
    ],
    "ndb": "11245",
    "desc": "Lambsquarters, cooked, boiled, drained, without salt",
    "cal": 32.0,
    "pro": 3.2,
    "fat": 0.7,
    "carb": 5.0,
    "fib": 2.1,
    "h2o": 88.9,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "LEEK",
    "display": "Leek",
    "groups": [
      "vegetable"
    ],
    "ndb": "11247",
    "desc": "Leeks, (bulb and lower leaf-portion), cooked, boiled, drained, without salt",
    "cal": 31.0,
    "pro": 0.8,
    "fat": 0.2,
    "carb": 7.6,
    "fib": 1.0,
    "h2o": 90.8,
    "sug": 2.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "leek",
        "gm": 124.0
      },
      {
        "amt": 0.25,
        "desc": "cup, chopped or diced",
        "gm": 26.0
      }
    ]
  },
  {
    "word": "LETTUCE",
    "display": "Lettuce",
    "groups": [
      "vegetable"
    ],
    "ndb": "11252",
    "desc": "Lettuce, iceberg (includes crisphead types), raw",
    "cal": 14.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 3.0,
    "fib": 1.2,
    "h2o": 95.6,
    "sug": 2.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup shredded",
        "gm": 72.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped (1/2\" pieces, loosely packed)",
        "gm": 57.0
      },
      {
        "amt": 1.0,
        "desc": "head, large",
        "gm": 755.0
      },
      {
        "amt": 1.0,
        "desc": "head, medium (6\" dia)",
        "gm": 539.0
      },
      {
        "amt": 1.0,
        "desc": "head, small",
        "gm": 324.0
      },
      {
        "amt": 1.0,
        "desc": "leaf, large",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "leaf, medium",
        "gm": 8.0
      },
      {
        "amt": 1.0,
        "desc": "leaf, small",
        "gm": 5.0
      },
      {
        "amt": 1.0,
        "desc": "NLEA Serving",
        "gm": 89.0
      }
    ]
  },
  {
    "word": "LOTUS",
    "display": "Lotus",
    "groups": [
      "vegetable"
    ],
    "ndb": "11255",
    "desc": "Lotus root, cooked, boiled, drained, without salt",
    "cal": 66.0,
    "pro": 1.6,
    "fat": 0.1,
    "carb": 16.0,
    "fib": 3.1,
    "h2o": 81.4,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 60.0
      },
      {
        "amt": 10.0,
        "desc": "slices (2-1/2\" dia)",
        "gm": 89.0
      }
    ]
  },
  {
    "word": "MAITAKE",
    "display": "Maitake",
    "groups": [
      "vegetable"
    ],
    "ndb": "11993",
    "desc": "Mushrooms, maitake, raw",
    "cal": 31.0,
    "pro": 1.9,
    "fat": 0.2,
    "carb": 7.0,
    "fib": 2.7,
    "h2o": 90.4,
    "sug": 2.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup diced",
        "gm": 70.0
      },
      {
        "amt": 1.0,
        "desc": "piece whole",
        "gm": 1.1
      }
    ]
  },
  {
    "word": "MOREL",
    "display": "Morel",
    "groups": [
      "vegetable"
    ],
    "ndb": "11240",
    "desc": "Mushrooms, morel, raw",
    "cal": 31.0,
    "pro": 3.1,
    "fat": 0.6,
    "carb": 5.1,
    "fib": 2.8,
    "h2o": 89.6,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 66.0
      },
      {
        "amt": 1.0,
        "desc": "piece",
        "gm": 12.9
      }
    ]
  },
  {
    "word": "MOUNTAINYAM",
    "display": "Mountain Yam",
    "groups": [
      "vegetable"
    ],
    "ndb": "11259",
    "desc": "Mountain yam, hawaii, cooked, steamed, without salt",
    "cal": 82.0,
    "pro": 1.7,
    "fat": 0.1,
    "carb": 20.0,
    "fib": 0.0,
    "h2o": 77.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 145.0
      }
    ]
  },
  {
    "word": "MUSHROOM",
    "display": "Mushroom",
    "groups": [
      "vegetable"
    ],
    "ndb": "11261",
    "desc": "Mushrooms, white, cooked, boiled, drained, without salt",
    "cal": 28.0,
    "pro": 2.2,
    "fat": 0.5,
    "carb": 5.3,
    "fib": 2.2,
    "h2o": 91.1,
    "sug": 2.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup pieces",
        "gm": 156.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 9.8
      },
      {
        "amt": 1.0,
        "desc": "mushroom",
        "gm": 12.0
      }
    ]
  },
  {
    "word": "MUSTARDGREEN",
    "display": "Mustard Greens",
    "groups": [
      "vegetable"
    ],
    "ndb": "11271",
    "desc": "Mustard greens, cooked, boiled, drained, without salt",
    "cal": 26.0,
    "pro": 2.6,
    "fat": 0.5,
    "carb": 4.5,
    "fib": 2.0,
    "h2o": 91.8,
    "sug": 1.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 140.0
      }
    ]
  },
  {
    "word": "NAPA",
    "display": "Napa",
    "groups": [
      "vegetable"
    ],
    "ndb": "11970",
    "desc": "Cabbage, napa, cooked",
    "cal": 12.0,
    "pro": 1.1,
    "fat": 0.2,
    "carb": 2.2,
    "fib": 0.0,
    "h2o": 96.3,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 109.0
      }
    ]
  },
  {
    "word": "NETTLES",
    "display": "Nettles",
    "groups": [
      "vegetable"
    ],
    "ndb": "35205",
    "desc": "Stinging Nettles, blanched (Northern Plains Indians)",
    "cal": 42.0,
    "pro": 2.7,
    "fat": 0.1,
    "carb": 7.5,
    "fib": 6.9,
    "h2o": 87.7,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 89.0
      }
    ]
  },
  {
    "word": "NOPALES",
    "display": "Nopales",
    "groups": [
      "vegetable"
    ],
    "ndb": "11964",
    "desc": "Nopales, cooked, without salt",
    "cal": 15.0,
    "pro": 1.4,
    "fat": 0.1,
    "carb": 3.3,
    "fib": 2.0,
    "h2o": 94.3,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "pad",
        "gm": 29.0
      }
    ]
  },
  {
    "word": "OKRA",
    "display": "Okra",
    "groups": [
      "vegetable"
    ],
    "ndb": "11279",
    "desc": "Okra, cooked, boiled, drained, without salt",
    "cal": 22.0,
    "pro": 1.9,
    "fat": 0.2,
    "carb": 4.5,
    "fib": 2.5,
    "h2o": 92.6,
    "sug": 2.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 80.0
      },
      {
        "amt": 8.0,
        "desc": "pods (3\" long)",
        "gm": 85.0
      }
    ]
  },
  {
    "word": "ONION",
    "display": "Onion",
    "groups": [
      "vegetable",
      "spice"
    ],
    "ndb": "11282",
    "desc": "Onions, raw",
    "cal": 40.0,
    "pro": 1.1,
    "fat": 0.1,
    "carb": 9.3,
    "fib": 1.7,
    "h2o": 89.1,
    "sug": 4.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 160.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 115.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp chopped",
        "gm": 10.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 150.0
      },
      {
        "amt": 1.0,
        "desc": "slice, large (1/4\" thick)",
        "gm": 38.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2-1/2\" dia)",
        "gm": 110.0
      },
      {
        "amt": 1.0,
        "desc": "slice, medium (1/8\" thick)",
        "gm": 14.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 70.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thin",
        "gm": 9.0
      },
      {
        "amt": 10.0,
        "desc": "rings",
        "gm": 60.0
      }
    ]
  },
  {
    "word": "ONIONRING",
    "display": "Onion Ring",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "11289",
    "desc": "Onions, frozen, whole, unprepared",
    "cal": 35.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 8.4,
    "fib": 1.7,
    "h2o": 90.2,
    "sug": 3.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.33,
        "desc": "package (10 oz)",
        "gm": 95.0
      },
      {
        "amt": 1.0,
        "desc": "package (10 oz)",
        "gm": 284.0
      }
    ]
  },
  {
    "word": "OYSTERMUSHROOM",
    "display": "Oyster Mushroom",
    "groups": [
      "vegetable"
    ],
    "ndb": "11987",
    "desc": "Mushrooms, oyster, raw",
    "cal": 33.0,
    "pro": 3.3,
    "fat": 0.4,
    "carb": 6.1,
    "fib": 2.3,
    "h2o": 89.2,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 148.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "cup sliced",
        "gm": 86.0
      }
    ]
  },
  {
    "word": "PAKCHOI",
    "display": "Pakchoi",
    "groups": [
      "vegetable"
    ],
    "ndb": "11117",
    "desc": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
    "cal": 12.0,
    "pro": 1.6,
    "fat": 0.2,
    "carb": 1.8,
    "fib": 1.0,
    "h2o": 95.5,
    "sug": 0.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 170.0
      }
    ]
  },
  {
    "word": "PARSNIP",
    "display": "Parsnip",
    "groups": [
      "vegetable"
    ],
    "ndb": "11299",
    "desc": "Parsnips, cooked, boiled, drained, without salt",
    "cal": 71.0,
    "pro": 1.3,
    "fat": 0.3,
    "carb": 17.0,
    "fib": 3.6,
    "h2o": 80.2,
    "sug": 4.8,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 78.0
      },
      {
        "amt": 1.0,
        "desc": "parsnip (9\" long)",
        "gm": 160.0
      }
    ]
  },
  {
    "word": "PEPPER",
    "display": "Pepper",
    "groups": [
      "vegetable",
      "fruit",
      "spice"
    ],
    "ndb": "2030",
    "desc": "Spices, pepper, black",
    "cal": 251.0,
    "pro": 10.4,
    "fat": 3.3,
    "carb": 64.0,
    "fib": 25.3,
    "h2o": 12.5,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tsp, ground",
        "gm": 2.3
      },
      {
        "amt": 1.0,
        "desc": "tbsp, ground",
        "gm": 6.9
      },
      {
        "amt": 1.0,
        "desc": "tsp, whole",
        "gm": 2.9
      },
      {
        "amt": 1.0,
        "desc": "dash",
        "gm": 0.1
      }
    ]
  },
  {
    "word": "PORTABELLA",
    "display": "Portabella",
    "groups": [
      "vegetable"
    ],
    "ndb": "1265",
    "desc": "Cheese, cheddar, nonfat or fat free",
    "cal": 157.0,
    "pro": 32.1,
    "fat": 0.0,
    "carb": 7.1,
    "fib": 0.0,
    "h2o": 57.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "serving",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "POTATOESAUGRATIN",
    "display": "Potatoes au Gratin",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "11373",
    "desc": "Potatoes, au gratin, home-prepared from recipe using butter",
    "cal": 132.0,
    "pro": 5.1,
    "fat": 7.6,
    "carb": 11.3,
    "fib": 1.8,
    "h2o": 74.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "POTATOESBAKED",
    "display": "Potatoes Baked",
    "groups": [
      "vegetable"
    ],
    "ndb": "11363",
    "desc": "Potatoes, baked, flesh, without salt",
    "cal": 93.0,
    "pro": 2.0,
    "fat": 0.1,
    "carb": 21.6,
    "fib": 1.5,
    "h2o": 75.4,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 61.0
      },
      {
        "amt": 1.0,
        "desc": "potato (2-1/3\" x 4-3/4\")",
        "gm": 156.0
      }
    ]
  },
  {
    "word": "POTATOESBOILED",
    "display": "Potatoes Boiled",
    "groups": [
      "vegetable"
    ],
    "ndb": "11367",
    "desc": "Potatoes, boiled, cooked without skin, flesh, without salt",
    "cal": 86.0,
    "pro": 1.7,
    "fat": 0.1,
    "carb": 20.0,
    "fib": 1.8,
    "h2o": 77.5,
    "sug": 0.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 78.0
      },
      {
        "amt": 1.0,
        "desc": "large (3\" to 4-1/4\" dia.)",
        "gm": 300.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2-1/4\" to 3-1/4\" dia.)",
        "gm": 167.0
      },
      {
        "amt": 1.0,
        "desc": "small (1-3/4\" to 2-1/2\" dia.)",
        "gm": 125.0
      }
    ]
  },
  {
    "word": "POTATOESMASHED",
    "display": "Potatoes Mashed",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "11657",
    "desc": "Potatoes, mashed, home-prepared, whole milk added",
    "cal": 83.0,
    "pro": 1.9,
    "fat": 0.6,
    "carb": 17.6,
    "fib": 1.5,
    "h2o": 78.5,
    "sug": 1.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 210.0
      }
    ]
  },
  {
    "word": "POTATOESSCALLOPED",
    "display": "Potatoes Scalloped",
    "groups": [
      "vegetable",
      "prepared"
    ],
    "ndb": "11372",
    "desc": "Potatoes, scalloped, home-prepared with butter",
    "cal": 88.0,
    "pro": 2.9,
    "fat": 3.7,
    "carb": 10.8,
    "fib": 1.9,
    "h2o": 80.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "PUMPKIN",
    "display": "Pumpkin",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11424",
    "desc": "Pumpkin, canned, without salt",
    "cal": 34.0,
    "pro": 1.1,
    "fat": 0.3,
    "carb": 8.1,
    "fib": 2.9,
    "h2o": 90.0,
    "sug": 3.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 245.0
      }
    ]
  },
  {
    "word": "PURSLANE",
    "display": "Purslane",
    "groups": [
      "vegetable"
    ],
    "ndb": "11428",
    "desc": "Purslane, cooked, boiled, drained, without salt",
    "cal": 18.0,
    "pro": 1.5,
    "fat": 0.2,
    "carb": 3.5,
    "fib": 0.0,
    "h2o": 93.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 115.0
      },
      {
        "amt": 1.0,
        "desc": "squash",
        "gm": 431.0
      }
    ]
  },
  {
    "word": "RADICCHIO",
    "display": "Radicchio",
    "groups": [
      "vegetable"
    ],
    "ndb": "11952",
    "desc": "Radicchio, raw",
    "cal": 23.0,
    "pro": 1.4,
    "fat": 0.2,
    "carb": 4.5,
    "fib": 0.9,
    "h2o": 93.1,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 40.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 8.0
      }
    ]
  },
  {
    "word": "RADISH",
    "display": "Radish",
    "groups": [
      "vegetable"
    ],
    "ndb": "11429",
    "desc": "Radishes, raw",
    "cal": 16.0,
    "pro": 0.7,
    "fat": 0.1,
    "carb": 3.4,
    "fib": 1.6,
    "h2o": 95.3,
    "sug": 1.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 116.0
      },
      {
        "amt": 1.0,
        "desc": "large (1\" to 1-1/4\" dia)",
        "gm": 9.0
      },
      {
        "amt": 1.0,
        "desc": "medium (3/4\" to 1\" dia)",
        "gm": 4.5
      },
      {
        "amt": 1.0,
        "desc": "slice",
        "gm": 1.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 2.0
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 58.0
      }
    ]
  },
  {
    "word": "RUTABAGA",
    "display": "Rutabaga",
    "groups": [
      "vegetable"
    ],
    "ndb": "11436",
    "desc": "Rutabagas, cooked, boiled, drained, without salt",
    "cal": 30.0,
    "pro": 0.9,
    "fat": 0.2,
    "carb": 6.8,
    "fib": 1.8,
    "h2o": 91.5,
    "sug": 4.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 170.0
      },
      {
        "amt": 1.0,
        "desc": "cup, mashed",
        "gm": 240.0
      }
    ]
  },
  {
    "word": "SALSIFY",
    "display": "Salsify",
    "groups": [
      "vegetable"
    ],
    "ndb": "11438",
    "desc": "Salsify, cooked, boiled, drained, without salt",
    "cal": 68.0,
    "pro": 2.7,
    "fat": 0.2,
    "carb": 15.4,
    "fib": 3.1,
    "h2o": 81.0,
    "sug": 2.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 135.0
      }
    ]
  },
  {
    "word": "SAVOY",
    "display": "Savoy",
    "groups": [
      "vegetable"
    ],
    "ndb": "11115",
    "desc": "Cabbage, savoy, cooked, boiled, drained, without salt",
    "cal": 24.0,
    "pro": 1.8,
    "fat": 0.1,
    "carb": 5.4,
    "fib": 2.8,
    "h2o": 92.0,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, shredded",
        "gm": 145.0
      }
    ]
  },
  {
    "word": "SCALLION",
    "display": "Scallion",
    "groups": [
      "vegetable"
    ],
    "ndb": "11291",
    "desc": "Onions, spring or scallions (includes tops and bulb), raw",
    "cal": 32.0,
    "pro": 1.8,
    "fat": 0.2,
    "carb": 7.3,
    "fib": 2.6,
    "h2o": 89.8,
    "sug": 2.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp chopped",
        "gm": 6.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 25.0
      },
      {
        "amt": 1.0,
        "desc": "medium (4-1/8\" long)",
        "gm": 15.0
      },
      {
        "amt": 1.0,
        "desc": "small (3\" long)",
        "gm": 5.0
      }
    ]
  },
  {
    "word": "SEAWEED",
    "display": "Seaweed",
    "groups": [
      "vegetable"
    ],
    "ndb": "11444",
    "desc": "Seaweed, irishmoss, raw",
    "cal": 49.0,
    "pro": 1.5,
    "fat": 0.2,
    "carb": 12.3,
    "fib": 1.3,
    "h2o": 81.3,
    "sug": 0.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 2.0,
        "desc": "tbsp (1/8 cup)",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "SHALLOT",
    "display": "Shallot",
    "groups": [
      "vegetable"
    ],
    "ndb": "11677",
    "desc": "Shallots, raw",
    "cal": 72.0,
    "pro": 2.5,
    "fat": 0.1,
    "carb": 16.8,
    "fib": 3.2,
    "h2o": 79.8,
    "sug": 7.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp chopped",
        "gm": 10.0
      }
    ]
  },
  {
    "word": "SHIITAKE",
    "display": "Shiitake",
    "groups": [
      "vegetable"
    ],
    "ndb": "11238",
    "desc": "Mushrooms, shiitake, raw",
    "cal": 34.0,
    "pro": 2.2,
    "fat": 0.5,
    "carb": 6.8,
    "fib": 2.5,
    "h2o": 89.7,
    "sug": 2.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "piece whole",
        "gm": 19.0
      }
    ]
  },
  {
    "word": "SNAPBEAN",
    "display": "Snap Bean",
    "groups": [
      "vegetable"
    ],
    "ndb": "11053",
    "desc": "Beans, snap, green, cooked, boiled, drained, without salt",
    "cal": 35.0,
    "pro": 1.9,
    "fat": 0.3,
    "carb": 7.9,
    "fib": 3.2,
    "h2o": 89.2,
    "sug": 3.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 125.0
      }
    ]
  },
  {
    "word": "SORREL",
    "display": "Sorrel",
    "groups": [
      "vegetable"
    ],
    "ndb": "11617",
    "desc": "Dock, cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 1.8,
    "fat": 0.6,
    "carb": 2.9,
    "fib": 2.6,
    "h2o": 93.6,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "SPINACH",
    "display": "Spinach",
    "groups": [
      "vegetable"
    ],
    "ndb": "11457",
    "desc": "Spinach, raw",
    "cal": 23.0,
    "pro": 2.9,
    "fat": 0.4,
    "carb": 3.6,
    "fib": 2.2,
    "h2o": 91.4,
    "sug": 0.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 30.0
      },
      {
        "amt": 1.0,
        "desc": "bunch",
        "gm": 340.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 10.0
      },
      {
        "amt": 1.0,
        "desc": "package (10 oz)",
        "gm": 284.0
      }
    ]
  },
  {
    "word": "SPIRULINA",
    "display": "Spirulina",
    "groups": [
      "vegetable"
    ],
    "ndb": "11666",
    "desc": "Seaweed, spirulina, raw",
    "cal": 26.0,
    "pro": 5.9,
    "fat": 0.4,
    "carb": 2.4,
    "fib": 0.4,
    "h2o": 90.7,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "SPROUTS",
    "display": "Sprouts",
    "groups": [
      "vegetable"
    ],
    "ndb": "11001",
    "desc": "Alfalfa seeds, sprouted, raw",
    "cal": 23.0,
    "pro": 4.0,
    "fat": 0.7,
    "carb": 2.1,
    "fib": 1.9,
    "h2o": 92.8,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 33.0
      },
      {
        "amt": 1.0,
        "desc": "tbsp",
        "gm": 3.0
      }
    ]
  },
  {
    "word": "SQUASHACORN",
    "display": "Squash Acorn",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11862",
    "desc": "Squash, summer, zucchini, includes skin, frozen, cooked, boiled, drained, with salt",
    "cal": 14.0,
    "pro": 1.1,
    "fat": 0.1,
    "carb": 3.0,
    "fib": 1.3,
    "h2o": 94.7,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 223.0
      }
    ]
  },
  {
    "word": "SQUASHSUMMER",
    "display": "Squash Summer",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11642",
    "desc": "Squash, summer, all varieties, cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 0.9,
    "fat": 0.3,
    "carb": 4.3,
    "fib": 1.4,
    "h2o": 93.7,
    "sug": 2.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 180.0
      }
    ]
  },
  {
    "word": "SQUASHWINTER",
    "display": "Squash Winter",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11483",
    "desc": "Squash, winter, acorn, cooked, baked, without salt",
    "cal": 56.0,
    "pro": 1.1,
    "fat": 0.1,
    "carb": 14.6,
    "fib": 4.4,
    "h2o": 82.9,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 205.0
      }
    ]
  },
  {
    "word": "SUCCOTASH",
    "display": "Succotash",
    "groups": [
      "vegetable"
    ],
    "ndb": "11496",
    "desc": "Succotash, (corn and limas), cooked, boiled, drained, without salt",
    "cal": 115.0,
    "pro": 5.1,
    "fat": 0.8,
    "carb": 24.4,
    "fib": 4.5,
    "h2o": 68.4,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 192.0
      }
    ]
  },
  {
    "word": "SWEETPOTATO",
    "display": "Sweet Potato",
    "groups": [
      "vegetable"
    ],
    "ndb": "11508",
    "desc": "Sweet potato, cooked, baked in skin, flesh, without salt",
    "cal": 90.0,
    "pro": 2.0,
    "fat": 0.1,
    "carb": 20.7,
    "fib": 3.3,
    "h2o": 75.8,
    "sug": 6.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 200.0
      },
      {
        "amt": 1.0,
        "desc": "large",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "medium (2\" dia, 5\" long, raw)",
        "gm": 114.0
      },
      {
        "amt": 1.0,
        "desc": "small",
        "gm": 60.0
      }
    ]
  },
  {
    "word": "SWISSCHARD",
    "display": "Swiss Chard",
    "groups": [
      "vegetable"
    ],
    "ndb": "11147",
    "desc": "Chard, swiss, raw",
    "cal": 19.0,
    "pro": 1.8,
    "fat": 0.2,
    "carb": 3.7,
    "fib": 1.6,
    "h2o": 92.7,
    "sug": 1.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 36.0
      },
      {
        "amt": 1.0,
        "desc": "leaf",
        "gm": 48.0
      }
    ]
  },
  {
    "word": "TAPIOCA",
    "display": "Tapioca",
    "groups": [
      "vegetable"
    ],
    "ndb": "20068",
    "desc": "Tapioca, pearl, dry",
    "cal": 358.0,
    "pro": 0.2,
    "fat": 0.0,
    "carb": 88.7,
    "fib": 0.9,
    "h2o": 11.0,
    "sug": 3.4,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup",
        "gm": 152.0
      }
    ]
  },
  {
    "word": "TARO",
    "display": "Taro",
    "groups": [
      "vegetable"
    ],
    "ndb": "11519",
    "desc": "Taro, cooked, without salt",
    "cal": 142.0,
    "pro": 0.5,
    "fat": 0.1,
    "carb": 34.6,
    "fib": 5.1,
    "h2o": 63.8,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 132.0
      }
    ]
  },
  {
    "word": "TOMATILLO",
    "display": "Tomatillo",
    "groups": [
      "vegetable"
    ],
    "ndb": "11954",
    "desc": "Tomatillos, raw",
    "cal": 32.0,
    "pro": 1.0,
    "fat": 1.0,
    "carb": 5.8,
    "fib": 1.9,
    "h2o": 91.6,
    "sug": 3.9,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "medium",
        "gm": 34.0
      },
      {
        "amt": 0.5,
        "desc": "cup, chopped or diced",
        "gm": 66.0
      }
    ]
  },
  {
    "word": "TOMATO",
    "display": "Tomato",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11529",
    "desc": "Tomatoes, red, ripe, raw, year round average",
    "cal": 18.0,
    "pro": 0.9,
    "fat": 0.2,
    "carb": 3.9,
    "fib": 1.2,
    "h2o": 94.5,
    "sug": 2.6,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup cherry tomatoes",
        "gm": 149.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped or sliced",
        "gm": 180.0
      },
      {
        "amt": 1.0,
        "desc": "Italian tomato",
        "gm": 62.0
      },
      {
        "amt": 1.0,
        "desc": "cherry",
        "gm": 17.0
      },
      {
        "amt": 1.0,
        "desc": "large whole (3\" dia)",
        "gm": 182.0
      },
      {
        "amt": 1.0,
        "desc": "medium whole (2-3/5\" dia)",
        "gm": 123.0
      },
      {
        "amt": 1.0,
        "desc": "slice, medium (1/4\" thick)",
        "gm": 20.0
      },
      {
        "amt": 1.0,
        "desc": "plum tomato",
        "gm": 62.0
      },
      {
        "amt": 1.0,
        "desc": "small whole (2-2/5\" dia)",
        "gm": 91.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thick/large (1/2\" thick)",
        "gm": 27.0
      },
      {
        "amt": 1.0,
        "desc": "wedge (1/4 of medium tomato)",
        "gm": 31.0
      },
      {
        "amt": 1.0,
        "desc": "slice, thin/small",
        "gm": 15.0
      }
    ]
  },
  {
    "word": "TURNIP",
    "display": "Turnip",
    "groups": [
      "vegetable"
    ],
    "ndb": "11565",
    "desc": "Turnips, cooked, boiled, drained, without salt",
    "cal": 22.0,
    "pro": 0.7,
    "fat": 0.1,
    "carb": 5.1,
    "fib": 2.0,
    "h2o": 93.6,
    "sug": 3.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 156.0
      },
      {
        "amt": 1.0,
        "desc": "cup, mashed",
        "gm": 230.0
      }
    ]
  },
  {
    "word": "TURNIPGREEN",
    "display": "Turnip Green",
    "groups": [
      "vegetable"
    ],
    "ndb": "11569",
    "desc": "Turnip greens, cooked, boiled, drained, without salt",
    "cal": 20.0,
    "pro": 1.1,
    "fat": 0.2,
    "carb": 4.4,
    "fib": 3.5,
    "h2o": 93.2,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 144.0
      }
    ]
  },
  {
    "word": "VEGETABLEMIXED",
    "display": "Vegetables Mixed",
    "groups": [
      "vegetable"
    ],
    "ndb": "11584",
    "desc": "Vegetables, mixed, frozen, cooked, boiled, drained, without salt",
    "cal": 65.0,
    "pro": 2.9,
    "fat": 0.1,
    "carb": 13.1,
    "fib": 4.4,
    "h2o": 83.2,
    "sug": 3.1,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup",
        "gm": 91.0
      },
      {
        "amt": 1.0,
        "desc": "package (10 oz) yields",
        "gm": 275.0
      }
    ]
  },
  {
    "word": "WATERCHESTNUT",
    "display": "Water Chestnut",
    "groups": [
      "vegetable"
    ],
    "ndb": "11590",
    "desc": "Waterchestnuts, chinese, canned, solids and liquids",
    "cal": 50.0,
    "pro": 0.9,
    "fat": 0.1,
    "carb": 12.3,
    "fib": 2.5,
    "h2o": 86.4,
    "sug": 2.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 0.5,
        "desc": "cup slices",
        "gm": 70.0
      },
      {
        "amt": 4.0,
        "desc": "waterchestnuts",
        "gm": 28.0
      }
    ]
  },
  {
    "word": "WATERCRESS",
    "display": "Watercress",
    "groups": [
      "vegetable"
    ],
    "ndb": "11591",
    "desc": "Watercress, raw",
    "cal": 11.0,
    "pro": 2.3,
    "fat": 0.1,
    "carb": 1.3,
    "fib": 0.5,
    "h2o": 95.1,
    "sug": 0.2,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, chopped",
        "gm": 34.0
      },
      {
        "amt": 1.0,
        "desc": "sprig",
        "gm": 2.5
      },
      {
        "amt": 10.0,
        "desc": "sprigs",
        "gm": 25.0
      }
    ]
  },
  {
    "word": "YAM",
    "display": "Yam",
    "groups": [
      "vegetable"
    ],
    "ndb": "11602",
    "desc": "Yam, cooked, boiled, drained, or baked, without salt",
    "cal": 116.0,
    "pro": 1.5,
    "fat": 0.1,
    "carb": 27.5,
    "fib": 3.9,
    "h2o": 70.1,
    "sug": 0.5,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, cubes",
        "gm": 136.0
      },
      {
        "amt": 0.5,
        "desc": "cup, cubes",
        "gm": 68.0
      }
    ]
  },
  {
    "word": "YAMBEAN",
    "display": "Yambean",
    "groups": [
      "vegetable"
    ],
    "ndb": "11604",
    "desc": "Yambean (jicama), cooked, boiled, drained, without salt",
    "cal": 38.0,
    "pro": 0.7,
    "fat": 0.1,
    "carb": 8.8,
    "fib": 0.0,
    "h2o": 90.1,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      }
    ]
  },
  {
    "word": "YARDLONG",
    "display": "Yardlong",
    "groups": [
      "vegetable"
    ],
    "ndb": "11200",
    "desc": "Yardlong bean, cooked, boiled, drained, without salt",
    "cal": 47.0,
    "pro": 2.5,
    "fat": 0.1,
    "carb": 9.2,
    "fib": 0.0,
    "h2o": 87.5,
    "sug": 0.0,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup slices",
        "gm": 104.0
      },
      {
        "amt": 1.0,
        "desc": "pod",
        "gm": 14.0
      }
    ]
  },
  {
    "word": "ZUCCHINI",
    "display": "Zucchini",
    "groups": [
      "vegetable",
      "fruit"
    ],
    "ndb": "11478",
    "desc": "Squash, summer, zucchini, includes skin, cooked, boiled, drained, without salt",
    "cal": 15.0,
    "pro": 1.1,
    "fat": 0.4,
    "carb": 2.7,
    "fib": 1.0,
    "h2o": 95.2,
    "sug": 1.7,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "cup, sliced",
        "gm": 180.0
      },
      {
        "amt": 0.5,
        "desc": "cup, mashed",
        "gm": 120.0
      }
    ]
  },
  {
    "word": "SALISBURY",
    "display": "Salisbury",
    "groups": [
      "protein",
      "prepared"
    ],
    "ndb": "32031",
    "desc": "Salisbury steak with gravy, frozen",
    "cal": 149.0,
    "pro": 7.0,
    "fat": 10.5,
    "carb": 6.8,
    "fib": 1.0,
    "h2o": 74.2,
    "sug": 0.3,
    "portions": [
      {
        "amt": 1.0,
        "desc": "custom (g)",
        "gm": 100.0
      },
      {
        "amt": 1.0,
        "desc": "patty",
        "gm": 63.0
      }
    ]
  }
];

// Calculate nutrients for a given portion and multiplier
export function calculateNutrients(food: Food, portionIndex: number, multiplier: number = 1): NutrientValues {
  const portion = food.portions[portionIndex] || food.portions[0];
  const grams = portion.gm * multiplier;
  const ratio = grams / 100;
  
  return {
    grams: Math.round(grams),
    calories: Math.round(food.cal * ratio),
    protein: Math.round(food.pro * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    carbs: Math.round(food.carb * ratio * 10) / 10,
    fiber: Math.round(food.fib * ratio * 10) / 10,
    water: Math.round(food.h2o * ratio * 10) / 10,
    sugar: Math.round(food.sug * ratio * 10) / 10,
  };
}

// Calculate nutrients for custom gram amount
export function calculateNutrientsForGrams(food: Food, grams: number): NutrientValues {
  const ratio = grams / 100;
  
  return {
    grams: Math.round(grams),
    calories: Math.round(food.cal * ratio),
    protein: Math.round(food.pro * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    carbs: Math.round(food.carb * ratio * 10) / 10,
    fiber: Math.round(food.fib * ratio * 10) / 10,
    water: Math.round(food.h2o * ratio * 10) / 10,
    sugar: Math.round(food.sug * ratio * 10) / 10,
  };
}

// Group colors
export const GROUP_COLORS: Record<FoodGroup, string> = {
  vegetable: '#22c55e',
  fruit: '#ef4444',
  grain: '#a16207',
  protein: '#a855f7',
  dairy: '#fef3c7',
  legume: '#f97316',
  nuts: '#92400e',
  fats: '#fcd34d',
  spice: '#14b8a6',
  prepared: '#6b7280',
  beverage: '#3b82f6'
};

// Group display names
export const GROUP_NAMES: Record<FoodGroup, string> = {
  vegetable: 'Vegetables',
  fruit: 'Fruits',
  grain: 'Grains',
  protein: 'Protein',
  dairy: 'Dairy',
  legume: 'Legumes',
  nuts: 'Nuts & Seeds',
  fats: 'Fats & Oils',
  spice: 'Spices/Condiments',
  prepared: 'Prepared Foods',
  beverage: 'Beverages'
};
