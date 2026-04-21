// Auto-generated — do not edit. Run generate_levels.py to regenerate.
import type { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 'SWEET_001',
    name: 'Pie Apple',
    category: 'Desserts',
    dietaryCategory: 'veggie',
    levelNum: 1,
    recipe: ['apple', 'bread', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'squirrel', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: {
      lettuce: 0,
      tomato: 0,
      carrot: 0,
      cheese: 0,
      egg: 0,
      bread: 0,
      apple: 5,
      grapes: 0,
      bacon: 0,
      butter: 4,
      chicken: 0,
      fish: 0
    },
    servings: '1 pie (8 slices)',
    prepTime: '45 mins',
    linkType: 'dish',
    recipeIngredients: [
      {
        name: 'Pie, apple, prepared from recipe',
        quantity: 'custom (g)',
        ndbNo: '18302',
        portionDesc: 'custom (g)',
        portionGrams: 100.0,
        isDish: true
      },
      {
        name: 'pastry for a 9-inch double-crust pie',
        ndbNo: '18335',
        portionDesc: 'custom (g)',
        portionGrams: 280.0
      },
      {
        name: 'apple pie filling, canned',
        quantity: '1 can (21 ounces)',
        ndbNo: '19312',
        portionDesc: 'custom (g)',
        portionGrams: 595.0,
        foodWord: 'APPLE'
      },
      {
        name: 'butter',
        quantity: '3 tablespoons',
        ndbNo: '1145',
        portionDesc: 'g',
        portionGrams: 42.0,
        foodWord: 'BUTTER'
      },
      {
        name: 'ground cinnamon',
        quantity: '1 teaspoon',
        ndbNo: '2010',
        portionDesc: 'g',
        portionGrams: 2.6
      },
      {
        name: 'lemon juice',
        quantity: '1 tablespoon',
        ndbNo: '9152',
        portionDesc: 'g',
        portionGrams: 15.0
      },
      {
        name: 'for egg wash',
        quantity: '1 whole egg',
        ndbNo: '1123',
        portionDesc: 'g',
        portionGrams: 50.0,
        foodWord: 'EGG'
      }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C). Line a 9-inch pie plate with bottom crust.',
      'Stir the cinnamon and lemon juice into the apple pie filling, then spoon it into the lined pie plate and scatter the butter over the top.',
      'Cover with top crust and seal. Cut holes in top crust to allow venting, then brush the top crust with the egg wash.',
      'Bake for 15 minutes. Lower the oven to 350°F and bake 35 to 40 minutes more, until the crust is golden brown and the filling is bubbling.',
      'Set the pie on a rack and let it cool for at least 2 hours before slicing.'
    ]
  }
];
