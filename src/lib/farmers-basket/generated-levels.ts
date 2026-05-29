// Auto-generated — do not edit. Run recipes_v3/tools/generate_bundle.py to regenerate.
import type { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 'SWEET_001',
    name: 'Pie Apple',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 1,
    recipe: ['apple', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'squirrel', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 5, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":416.9,"pro":3.8,"fat":18.9,"carb":58.6,"fib":3.8,"h2o":70.2,"sug":25.8,"perServing":{"cal":416.9,"pro":3.8,"fat":18.9,"carb":58.6,"fib":3.8,"h2o":70.2,"sug":25.8,"AddedSugars":16.6,"IntrinsicSugars":9.1},"micros":{"vitaminA":36.5,"vitaminC":0.3,"vitaminD":0.0,"vitaminE":0.65,"vitaminK":5.61,"vitaminB6":0.02,"vitaminB12":0.01,"thiamin":0.13,"riboflavin":0.11,"niacin":1.1,"folate":31.89,"calcium":12.46,"iron":1.12,"magnesium":8.76,"phosphorus":31.91,"potassium":102.97,"sodium":146.02,"zinc":0.19,"copper":0.05,"selenium":7.24,"cholesterol":12.51,"saturatedFat":4.81,"monoFat":4.42,"polyFat":1.75,"omega3":0.01,"omega6":0.11},"gramsPerServing":152.6,"servings":8,"per100g":{"Energy_KCal":273.23,"Water":46.02,"Protein":2.48,"TotalLipidFat":12.42,"Carbohydrate":38.39,"FiberTotalDietary":2.51,"SugarsTotal":16.89,"Cholesterol":12.51,"FattyAcids_totalSaturated":4.81,"FattyAcids_totalMonounsaturated":4.42,"FattyAcids_totalPolyunsaturated":1.75,"LinoleicAcid":0.11,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":36.5,"Retinol":33.18,"Carotene_beta":36.78,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.65,"VitaminK_phylloquinone":5.61,"VitaminC_totalAscorbicAcid":0.3,"Thiamin":0.13,"Riboflavin":0.11,"Niacin":1.1,"PantothenicAcid":0.11,"VitaminB6":0.02,"Folate_total":31.89,"Folate_food":6.66,"Folate_DFE":48.11,"FolicAcid":31.54,"VitaminB12":0.01,"Choline_total":3.03,"Betaine":0.01,"LuteinZeaxanthin":39.32,"Lycopene":0.03,"Calcium_Ca":12.46,"Iron_Fe":1.12,"Magnesium_Mg":8.76,"Phosphorus_P":31.91,"Potassium_K":102.97,"Sodium_Na":146.02,"Zinc_Zn":0.19,"Copper_Cu":0.05,"Manganese_Mn":0.31,"Selenium_Se":7.24,"Tryptophan":0.03,"Threonine":0.06,"Isoleucine":0.08,"Leucine":0.15,"Lysine":0.05,"Methionine":0.04,"Cystine":0.04,"Phenylalanine":0.11,"Tyrosine":0.07,"Valine":0.09,"Arginine":0.09,"Histidine":0.05,"Alanine":0.07,"AsparticAcid":0.09,"GlutamicAcid":0.72,"Glycine":0.08,"Proline":0.25,"Serine":0.11,"omega3":0.01,"omega6":0.11,"AddedSugars":10.9,"IntrinsicSugars":5.99},"addedSugars":16.6,"intrinsicSugars":9.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18302","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.71,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"1145","name":"Butter, without salt","grams":7.1},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":11.2},{"ndb":"14411","name":"Water, tap, drinking","grams":9.3},{"ndb":"9502","name":"Apples, raw, granny smith, with skin","grams":93.8},{"ndb":"19335","name":"Sugars, granulated","grams":16.7},{"ndb":"9152","name":"Lemon juice, raw","grams":1.9},{"ndb":"1145","name":"Butter, without salt","grams":1.8},{"ndb":"20027","name":"Cornstarch","grams":5.0},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.3},{"ndb":"2011","name":"Spices, cloves, ground","grams":0.3},{"ndb":"2001","name":"Spices, allspice, ground","grams":0.2},{"ndb":"14411","name":"Water, tap, drinking","grams":7.4}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":474.96,"raw_water_grams":113.99,"raw_fat_grams":138.12,"final_grams":454.44},{"section_key":"filling","section_label":"Apple filling","prep_method":"boiled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.6497390527830742,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":1018.63,"raw_water_grams":720.76,"raw_fat_grams":13.47,"final_grams":766.18}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Pie, apple, prepared from recipe', quantity: 'custom (g)', foodWord: 'APPLEPIE', ndbNo: '18302', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'unsalted butter', quantity: '4 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 56.8 },
      { name: 'vegetable shortening', quantity: '7 tablespoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 89.6 },
      { name: 'ice water', quantity: '5 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 74.0625 },
      { name: 'Granny Smith apples (peeled and cored)', quantity: 'just under 7 cups sliced', section: 'filling', ndbNo: '9502', portionDesc: 'g', portionGrams: 750.0 },
      { name: 'sugar', quantity: '2/3 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 133.3333 },
      { name: 'lemon juice', quantity: '1 tablespoon', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'unsalted butter (cut into pieces)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 },
      { name: 'cornstarch', quantity: '5 tablespoon', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'filling', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'ground cloves', quantity: '1 teaspoon', section: 'filling', ndbNo: '2011', portionDesc: 'g', portionGrams: 2.1 },
      { name: 'allspice', quantity: '1 teaspoon', section: 'filling', ndbNo: '2001', portionDesc: 'g', portionGrams: 1.9 },
      { name: 'ice water', quantity: '1/4 cup', section: 'filling', ndbNo: '14411', portionDesc: 'g', portionGrams: 59.25 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust whisk the flour and salt together. Cut in the chilled butter and shortening until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into two discs and chill for at least 30 minutes.',
      'In a large saucepan, combine the peeled and cored Granny Smith apple slices with the sugar, lemon juice, cornstarch, butter, and 1/4 cup water, plus any optional cinnamon, cloves, or allspice. Bring to a boil over medium heat, then reduce heat, cover, and simmer for 5 minutes, stirring occasionally. Uncover and simmer 5 minutes more, until the apples are slightly softened and the juices have thickened. Remove from heat and let cool while you roll out the crust.',
      'Roll out one disc and line the bottom of a 9-inch pie plate. Spoon the cooled apple filling into the crust, mounding slightly in the center.',
      'Roll out the second disc and cut into 1/2-inch strips. Lay the strips over the filling in a lattice pattern, weaving them over and under. Trim and crimp the edges to seal.',
      'Bake for 15 minutes. Lower the oven to 350 degrees F (175 degrees C) and bake 35 to 40 minutes more until the crust is golden brown and the filling is bubbling. Cool on a rack before slicing.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'filling', label: 'Apple filling', cookingMethod: '' }
    ],
  },
  {
    id: 'SWEET_002',
    name: 'Apple Strudel',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 2,
    recipe: ['apple', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'squirrel', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 5, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '12 pieces',
    prepTime: '40 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":291.5,"pro":3.4,"fat":11.5,"carb":45.2,"fib":2.2,"h2o":44.9,"sug":27.9,"perServing":{"cal":291.5,"pro":3.4,"fat":11.5,"carb":45.2,"fib":2.2,"h2o":44.9,"sug":27.9,"AddedSugars":16.4,"IntrinsicSugars":11.4},"micros":{"vitaminA":27.63,"vitaminC":0.39,"vitaminD":3.23,"vitaminE":0.28,"vitaminK":5.14,"vitaminB6":0.04,"vitaminB12":0.05,"thiamin":0.1,"riboflavin":0.11,"niacin":1.04,"folate":17.53,"calcium":23.05,"iron":1.12,"magnesium":11.62,"phosphorus":44.54,"potassium":163.5,"sodium":134.48,"zinc":0.27,"copper":0.08,"selenium":7.68,"cholesterol":21.87,"saturatedFat":2.94,"monoFat":2.56,"polyFat":3.66,"omega3":0.01,"omega6":0.12},"gramsPerServing":105.8,"servings":12,"per100g":{"Energy_KCal":275.63,"Water":42.41,"Protein":3.17,"TotalLipidFat":10.9,"Carbohydrate":42.69,"FiberTotalDietary":2.1,"SugarsTotal":26.33,"Cholesterol":21.87,"FattyAcids_totalSaturated":2.94,"FattyAcids_totalMonounsaturated":2.56,"FattyAcids_totalPolyunsaturated":3.66,"LinoleicAcid":0.12,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":27.63,"Retinol":25.45,"Carotene_beta":24.42,"VitaminD":3.23,"VitaminE_alphaTocopherol":0.28,"VitaminK_phylloquinone":5.14,"VitaminC_totalAscorbicAcid":0.39,"Thiamin":0.1,"Riboflavin":0.11,"Niacin":1.04,"PantothenicAcid":0.12,"VitaminB6":0.04,"Folate_total":17.53,"Folate_food":6.12,"Folate_DFE":24.45,"FolicAcid":14.26,"VitaminB12":0.05,"Choline_total":16.25,"Betaine":0.05,"LuteinZeaxanthin":45.02,"Lycopene":0.0,"Calcium_Ca":23.05,"Iron_Fe":1.12,"Magnesium_Mg":11.62,"Phosphorus_P":44.54,"Potassium_K":163.5,"Sodium_Na":134.48,"Zinc_Zn":0.27,"Copper_Cu":0.08,"Manganese_Mn":0.19,"Selenium_Se":7.68,"Tryptophan":0.04,"Threonine":0.09,"Isoleucine":0.11,"Leucine":0.2,"Lysine":0.09,"Methionine":0.05,"Cystine":0.05,"Phenylalanine":0.14,"Tyrosine":0.08,"Valine":0.13,"Arginine":0.15,"Histidine":0.06,"Alanine":0.11,"AsparticAcid":0.16,"GlutamicAcid":0.81,"Glycine":0.1,"Proline":0.29,"Serine":0.15,"omega3":0.01,"omega6":0.12,"AddedSugars":15.53,"IntrinsicSugars":10.81},"addedSugars":16.4,"intrinsicSugars":11.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18354","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.83,"yieldFactorFat":1.0,"sources":[{"ndb":"18211","name":"Puff pastry, frozen, ready-to-bake, baked","grams":20.4},{"ndb":"9502","name":"Apples, raw, granny smith, with skin","grams":45.2},{"ndb":"19335","name":"Sugars, granulated","grams":13.5},{"ndb":"19334","name":"Sugars, brown","grams":3.0},{"ndb":"9298","name":"Raisins, seedless","grams":11.2},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":1.3},{"ndb":"14411","name":"Water, tap, drinking","grams":4.9},{"ndb":"18079","name":"Bread crumbs, dry, grated, plain","grams":4.5},{"ndb":"1145","name":"Butter, without salt","grams":3.6},{"ndb":"9152","name":"Lemon juice, raw","grams":1.3},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":4.2}],"sections":[{"section_key":"pastry","section_label":"Puff pastry","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":245.0,"raw_water_grams":18.13,"raw_fat_grams":94.33,"final_grams":241.74},{"section_key":"filling","section_label":"Apple-raisin filling","prep_method":"boiled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8505723914981532,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":1062.79,"raw_water_grams":570.69,"raw_fat_grams":39.25,"final_grams":977.51},{"section_key":"finish","section_label":"Egg wash finish","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":50.0,"raw_water_grams":38.08,"raw_fat_grams":4.75,"final_grams":50.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Strudel, apple', quantity: 'custom (g)', foodWord: 'APPLESTRUDEL', ndbNo: '18354', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'puff pastry sheet', quantity: '1 sheet', section: 'pastry', ndbNo: '18211', portionDesc: 'g', portionGrams: 245.0 },
      { name: 'Granny Smith apples (thinly sliced)', quantity: '5 cups thinly sliced', section: 'filling', ndbNo: '9502', portionDesc: 'g', portionGrams: 542.0 },
      { name: 'sugar', quantity: '3/4 cup + 1 tablespoon', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 162.5 },
      { name: 'brown sugar', quantity: '1/4 cup', section: 'filling', ndbNo: '19334', portionDesc: 'g', portionGrams: 36.0 },
      { name: 'raisins', quantity: '3/4 cup + 1 tablespoon', section: 'filling', ndbNo: '9298', portionDesc: 'g', portionGrams: 134.0625 },
      { name: 'flour (for thickening)', quantity: '2 tablespoons', section: 'filling', ndbNo: '20581', portionDesc: 'g', portionGrams: 15.625 },
      { name: 'water (evaporates during simmer)', quantity: '1/4 cup', section: 'filling', ndbNo: '14411', portionDesc: 'g', portionGrams: 59.25 },
      { name: 'dry bread crumbs', quantity: '1/2 cup', section: 'filling', ndbNo: '18079', portionDesc: 'g', portionGrams: 54.0 },
      { name: 'butter (for browning the bread crumbs)', quantity: '3 tablespoons', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 42.6 },
      { name: 'lemon juice', quantity: '1 tablespoon', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'salt (pinch)', quantity: '1/4 teaspoon (heaping)', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'filling', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'large egg (beaten (for sealing and basting the pastry))', quantity: '1 large egg', section: 'finish', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C).',
      'Melt the butter in a skillet and cook the bread crumbs over medium heat until lightly golden, then let them cool slightly.',
      'Combine apples, sugar, brown sugar, raisins, lemon juice, cinnamon, flour and 1/4 cup water in a sauce pan and bring to a boil. Cover and simmer for 5 minutes, stir occasionally, then uncover and simmer until thickened, about 5 minutes. The added water should evaporate.',
      'Roll the puff pastry to a 1/8 inch sheet or 16x12 rectangle on a lightly floured surface.',
      'Sprinkle the browned bread crumbs along one long side of the pastry several inches in, leaving a border on the sides so the roll can be sealed; the crumbs absorb juices and keep the bottom from going soggy.',
      'Spoon the cooled filling on top of the bread crumbs.',
      'Brush the exposed border with beaten egg. Fold the long end halfway over the filling then fold in the short ends. Continue rolling the pastry around the filling into a long strudel and seal the edge with egg. Tuck ends under. Place it seam-side down on a lined baking sheet. Brush with the remaining egg.',
      'Bake for about 30-40 minutes or until the pastry is browned and crisp and the apple filling is tender. Cool before slicing.'
    ],
    sections: [
      { key: 'pastry', label: 'Puff pastry', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'filling', label: 'Apple-raisin filling', cookingMethod: '' },
      { key: 'finish', label: 'Egg wash finish', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_003',
    name: 'Pie Banana Cream',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 3,
    recipe: ['egg', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '40 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":260.7,"pro":4.5,"fat":13.1,"carb":31.2,"fib":0.7,"h2o":48.6,"sug":12.0,"perServing":{"cal":260.7,"pro":4.5,"fat":13.1,"carb":31.2,"fib":0.7,"h2o":48.6,"sug":12.0,"AddedSugars":8.5,"IntrinsicSugars":3.4},"micros":{"vitaminA":121.38,"vitaminC":0.6,"vitaminD":38.1,"vitaminE":0.45,"vitaminK":1.12,"vitaminB6":0.05,"vitaminB12":0.28,"thiamin":0.14,"riboflavin":0.2,"niacin":1.07,"folate":36.52,"calcium":60.41,"iron":1.07,"magnesium":10.9,"phosphorus":77.69,"potassium":107.02,"sodium":159.41,"zinc":0.41,"copper":0.05,"selenium":11.25,"cholesterol":81.65,"saturatedFat":7.83,"monoFat":3.73,"polyFat":0.65,"omega3":0.03,"omega6":0.24},"gramsPerServing":98.6,"servings":8,"per100g":{"Energy_KCal":264.45,"Water":49.34,"Protein":4.59,"TotalLipidFat":13.29,"Carbohydrate":31.62,"FiberTotalDietary":0.74,"SugarsTotal":12.15,"Cholesterol":81.65,"FattyAcids_totalSaturated":7.83,"FattyAcids_totalMonounsaturated":3.73,"FattyAcids_totalPolyunsaturated":0.65,"LinoleicAcid":0.24,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":121.38,"Retinol":118.86,"Carotene_beta":25.99,"VitaminD":38.1,"VitaminE_alphaTocopherol":0.45,"VitaminK_phylloquinone":1.12,"VitaminC_totalAscorbicAcid":0.6,"Thiamin":0.14,"Riboflavin":0.2,"Niacin":1.07,"PantothenicAcid":0.35,"VitaminB6":0.05,"Folate_total":36.52,"Folate_food":12.1,"Folate_DFE":53.64,"FolicAcid":30.52,"VitaminB12":0.28,"Choline_total":40.07,"Betaine":0.32,"LuteinZeaxanthin":48.77,"Lycopene":0.0,"Calcium_Ca":60.41,"Iron_Fe":1.07,"Magnesium_Mg":10.9,"Phosphorus_P":77.69,"Potassium_K":107.02,"Sodium_Na":159.41,"Zinc_Zn":0.41,"Copper_Cu":0.05,"Manganese_Mn":0.16,"Selenium_Se":11.25,"Tryptophan":0.06,"Threonine":0.16,"Isoleucine":0.2,"Leucine":0.37,"Lysine":0.24,"Methionine":0.1,"Cystine":0.06,"Phenylalanine":0.22,"Tyrosine":0.18,"Valine":0.24,"Arginine":0.18,"Histidine":0.12,"Alanine":0.16,"AsparticAcid":0.31,"GlutamicAcid":1.17,"Glycine":0.13,"Proline":0.44,"Serine":0.26,"omega3":0.03,"omega6":0.24,"AddedSugars":8.65,"IntrinsicSugars":3.49},"addedSugars":8.5,"intrinsicSugars":3.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18304","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.7,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":19.5},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"1145","name":"Butter, without salt","grams":7.1},{"ndb":"14411","name":"Water, tap, drinking","grams":7.4},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":45.8},{"ndb":"19335","name":"Sugars, granulated","grams":7.8},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":4.4},{"ndb":"1145","name":"Butter, without salt","grams":2.2},{"ndb":"2050","name":"Vanilla extract","grams":0.5},{"ndb":"9040","name":"Bananas, raw","grams":6.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":7.4},{"ndb":"19336","name":"Sugars, powdered","grams":0.8}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"baked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.75,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":273.8,"raw_water_grams":88.01,"raw_fat_grams":47.6,"final_grams":251.8},{"section_key":"filling","section_label":"Vanilla custard filling","prep_method":"boiled","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.719953504083733,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":518.95,"raw_water_grams":348.93,"raw_fat_grams":35.6,"final_grams":421.23},{"section_key":"assembly","section_label":"Banana layer","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":50.0,"raw_water_grams":37.45,"raw_fat_grams":0.17,"final_grams":50.0},{"section_key":"topping","section_label":"Whipped cream topping","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":65.5,"raw_water_grams":34.41,"raw_fat_grams":21.47,"final_grams":65.5}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, banana cream, prepared from recipe', quantity: 'custom (g)', foodWord: 'BANANACREAMPIE', ndbNo: '18304', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'unsalted butter', quantity: '4 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 56.8 },
      { name: 'ice water', quantity: '4 tablespoons ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 59.25 },
      { name: 'whole milk', quantity: '1 1/2 cups', section: 'filling', ndbNo: '1077', portionDesc: 'g', portionGrams: 366.0 },
      { name: 'sugar', quantity: '5 tablespoons', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 62.5 },
      { name: 'cornstarch', quantity: '4 tablespoons', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'egg yolks (lightly beaten)', quantity: '2 large yolks', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'butter (cut into pieces)', quantity: '1 1/4 tablespoons', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 17.75 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'bananas (sliced ~1/4 inch thick) a little more than 1/3 medium banana', quantity: '50 grams (sliced)', section: 'assembly', ndbNo: '9040', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'heavy cream', quantity: '1/4 cup', section: 'topping', ndbNo: '1053', portionDesc: 'g', portionGrams: 59.5 },
      { name: 'powdered sugar', quantity: '3/4 tablespoon', section: 'topping', ndbNo: '19336', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'vanilla extract', quantity: '1/2 teaspoon', section: 'topping', ndbNo: '2050', portionDesc: 'g', portionGrams: 2.1 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes.',
      'Roll the chilled dough into a 12-inch circle and fit into a 9-inch pie plate, trimming and crimping the edges. Line with parchment, fill with pie weights or dried beans, and blind-bake for 15 minutes. Remove the weights and bake 8-10 minutes more, until the crust is golden brown. Cool completely on a rack.',
      'For the pastry cream, whisk the sugar, cornstarch, and salt together in a heavy saucepan. Whisk in the milk a little at a time to keep the cornstarch smooth. Bring to a boil over medium heat, whisking constantly, until thick and bubbling, about 5-7 minutes. Boil 1 minute more, still whisking.',
      'Whisk a ladleful of the hot mixture into the egg yolks to temper, then whisk the tempered yolks back into the saucepan. Cook over medium-low heat, whisking constantly, for 2 more minutes until very thick. Remove from heat and whisk in the butter and vanilla until smooth.',
      'Spread half of the warm pastry cream over the cooled crust. Layer the sliced bananas evenly on top, then spread the remaining pastry cream over the bananas. Press plastic wrap directly onto the surface to prevent a skin from forming.',
      'Refrigerate the pie for at least 4 hours or until fully chilled and set.',
      'Just before serving, beat the heavy cream with the powdered sugar and vanilla until soft peaks form, then spread or pipe over the chilled pie. Slice with a clean knife and serve immediately.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.75 },
      { key: 'filling', label: 'Vanilla custard filling', cookingMethod: '' },
      { key: 'assembly', label: 'Banana layer', cookingMethod: '', yieldFactorWater: 1.0 },
      { key: 'topping', label: 'Whipped cream topping', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_004',
    name: 'Pie Blueberry',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 4,
    recipe: ['egg', 'butter', 'cheese'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 3, egg: 5, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":404.8,"pro":4.5,"fat":19.6,"carb":54.8,"fib":3.2,"h2o":86.5,"sug":22.9,"perServing":{"cal":404.8,"pro":4.5,"fat":19.6,"carb":54.8,"fib":3.2,"h2o":86.5,"sug":22.9,"AddedSugars":13.5,"IntrinsicSugars":9.4},"micros":{"vitaminA":84.93,"vitaminC":3.21,"vitaminD":1.54,"vitaminE":0.6,"vitaminK":11.19,"vitaminB6":0.03,"vitaminB12":0.04,"thiamin":0.12,"riboflavin":0.12,"niacin":1.14,"folate":31.54,"calcium":11.98,"iron":1.09,"magnesium":8.23,"phosphorus":34.44,"potassium":70.64,"sodium":180.24,"zinc":0.26,"copper":0.06,"selenium":7.25,"cholesterol":36.75,"saturatedFat":7.09,"monoFat":3.19,"polyFat":0.49,"omega3":0.03,"omega6":0.28},"gramsPerServing":166.5,"servings":8,"per100g":{"Energy_KCal":243.07,"Water":51.92,"Protein":2.72,"TotalLipidFat":11.78,"Carbohydrate":32.88,"FiberTotalDietary":1.92,"SugarsTotal":13.75,"Cholesterol":36.75,"FattyAcids_totalSaturated":7.09,"FattyAcids_totalMonounsaturated":3.19,"FattyAcids_totalPolyunsaturated":0.49,"LinoleicAcid":0.28,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":84.93,"Retinol":81.97,"Carotene_beta":31.97,"VitaminD":1.54,"VitaminE_alphaTocopherol":0.6,"VitaminK_phylloquinone":11.19,"VitaminC_totalAscorbicAcid":3.21,"Thiamin":0.12,"Riboflavin":0.12,"Niacin":1.14,"PantothenicAcid":0.17,"VitaminB6":0.03,"Folate_total":31.54,"Folate_food":8.42,"Folate_DFE":47.76,"FolicAcid":28.9,"VitaminB12":0.04,"Choline_total":10.93,"Betaine":0.12,"LuteinZeaxanthin":51.2,"Lycopene":0.01,"Calcium_Ca":11.98,"Iron_Fe":1.09,"Magnesium_Mg":8.23,"Phosphorus_P":34.44,"Potassium_K":70.64,"Sodium_Na":180.24,"Zinc_Zn":0.26,"Copper_Cu":0.06,"Manganese_Mn":0.33,"Selenium_Se":7.25,"Tryptophan":0.03,"Threonine":0.08,"Isoleucine":0.1,"Leucine":0.19,"Lysine":0.07,"Methionine":0.05,"Cystine":0.05,"Phenylalanine":0.13,"Tyrosine":0.08,"Valine":0.12,"Arginine":0.11,"Histidine":0.06,"Alanine":0.1,"AsparticAcid":0.14,"GlutamicAcid":0.76,"Glycine":0.1,"Proline":0.26,"Serine":0.13,"omega3":0.03,"omega6":0.28,"AddedSugars":8.12,"IntrinsicSugars":5.63},"addedSugars":13.5,"intrinsicSugars":9.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18306","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"1145","name":"Butter, without salt","grams":21.3},{"ndb":"14411","name":"Water, tap, drinking","grams":9.3},{"ndb":"19335","name":"Sugars, granulated","grams":1.1},{"ndb":"9050","name":"Blueberries, raw","grams":92.5},{"ndb":"19335","name":"Sugars, granulated","grams":12.5},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"9152","name":"Lemon juice, raw","grams":1.9},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.2},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"1145","name":"Butter, without salt","grams":1.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":3.1},{"ndb":"14411","name":"Water, tap, drinking","grams":0.6}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":507.21,"raw_water_grams":134.34,"raw_fat_grams":140.54,"final_grams":483.03},{"section_key":"filling","section_label":"Blueberry filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8675410890738492,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":904.25,"raw_water_grams":642.6,"raw_fat_grams":14.03,"final_grams":819.13},{"section_key":"wash","section_label":"Egg wash","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":30.0,"raw_water_grams":24.03,"raw_fat_grams":2.38,"final_grams":30.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, blueberry, prepared from recipe', quantity: 'custom (g)', foodWord: 'BLUEBERRYPIE', ndbNo: '18306', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'unsalted butter (chilled)', quantity: '3/4 cup', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 170.25 },
      { name: 'ice water', quantity: '5 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 74.0625 },
      { name: 'sugar', quantity: '2 teaspoons', section: 'crust', ndbNo: '19335', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'blueberries (fresh)', quantity: '5 cups', section: 'filling', ndbNo: '9050', portionDesc: 'g', portionGrams: 740.0 },
      { name: 'sugar', quantity: '1/2 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'cornstarch', quantity: '1/4 cup', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'lemon juice', quantity: '1 tablespoon', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'ground cinnamon', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2010', portionDesc: 'g', portionGrams: 1.3 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'unsalted butter (dotted on top of filling)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 },
      { name: 'large egg (beaten with 1 tsp water; brush onto lattice)', quantity: '1 large egg (for wash; ~half adheres)', section: 'wash', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'ice water', quantity: '1 teaspoon (egg wash)', section: 'wash', ndbNo: '14411', portionDesc: 'g', portionGrams: 5.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into two discs (one slightly larger than the other for the bottom crust), and chill for at least 30 minutes.',
      'Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving a 1-inch overhang. Refrigerate while preparing the filling.',
      'In a large bowl, gently toss the blueberries with the sugar, cornstarch, lemon juice, cinnamon, and salt until evenly coated. Pour into the prepared crust, mounding slightly in the center, and dot the top with the butter.',
      'Roll out the second disc into an 11-inch circle, cut into 1/2-inch-wide strips, and weave into a lattice on top of the pie. Trim, crimp, and seal the lattice to the bottom crust.',
      'Lightly beat 1 large egg with 1 teaspoon water; brush the egg wash evenly over the lattice top to give it a deep golden, glossy finish during baking.',
      'Bake at 425 degrees F (220 degrees C) for 25 minutes to set the crust and activate the cornstarch. Reduce the heat to 375 degrees F (190 degrees C) and shield the crust edges with a 2- to 3-inch strip of aluminum foil (or a pie crust shield) to prevent over-browning. Continue baking for 50-55 minutes more (total bake time roughly 75-80 minutes), removing the foil for the last 15 minutes, until the crust is deep golden brown and the filling is bubbling thickly across the entire surface. An instant-read thermometer inserted through the lattice should read about 200 degrees F (93 degrees C).',
      'Cool the pie on a wire rack for at least 3 hours before slicing to allow the filling to set. Serve at room temperature or slightly warm.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'filling', label: 'Blueberry filling', cookingMethod: '' },
      { key: 'wash', label: 'Egg wash', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_005',
    name: 'Pie Cherry',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 5,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":438.8,"pro":4.6,"fat":19.5,"carb":63.1,"fib":2.1,"h2o":76.8,"sug":32.7,"perServing":{"cal":438.8,"pro":4.6,"fat":19.5,"carb":63.1,"fib":2.1,"h2o":76.8,"sug":32.7,"AddedSugars":26.0,"IntrinsicSugars":6.7},"micros":{"vitaminA":109.6,"vitaminC":2.82,"vitaminD":1.55,"vitaminE":0.36,"vitaminK":1.92,"vitaminB6":0.02,"vitaminB12":0.04,"thiamin":0.12,"riboflavin":0.12,"niacin":1.11,"folate":32.08,"calcium":15.3,"iron":1.08,"magnesium":9.09,"phosphorus":34.94,"potassium":108.88,"sodium":182.44,"zinc":0.22,"copper":0.08,"selenium":7.29,"cholesterol":37.01,"saturatedFat":7.16,"monoFat":3.22,"polyFat":0.47,"omega3":0.03,"omega6":0.29},"gramsPerServing":165.3,"servings":8,"per100g":{"Energy_KCal":265.37,"Water":46.44,"Protein":2.79,"TotalLipidFat":11.82,"Carbohydrate":38.19,"FiberTotalDietary":1.29,"SugarsTotal":19.8,"Cholesterol":37.01,"FattyAcids_totalSaturated":7.16,"FattyAcids_totalMonounsaturated":3.22,"FattyAcids_totalPolyunsaturated":0.47,"LinoleicAcid":0.29,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":109.6,"Retinol":82.56,"Carotene_beta":306.53,"VitaminD":1.55,"VitaminE_alphaTocopherol":0.36,"VitaminK_phylloquinone":1.92,"VitaminC_totalAscorbicAcid":2.82,"Thiamin":0.12,"Riboflavin":0.12,"Niacin":1.11,"PantothenicAcid":0.17,"VitaminB6":0.02,"Folate_total":32.08,"Folate_food":8.79,"Folate_DFE":48.41,"FolicAcid":29.11,"VitaminB12":0.04,"Choline_total":10.55,"Betaine":0.01,"LuteinZeaxanthin":47.97,"Lycopene":0.0,"Calcium_Ca":15.3,"Iron_Fe":1.08,"Magnesium_Mg":9.09,"Phosphorus_P":34.94,"Potassium_K":108.88,"Sodium_Na":182.44,"Zinc_Zn":0.22,"Copper_Cu":0.08,"Manganese_Mn":0.18,"Selenium_Se":7.29,"Tryptophan":0.03,"Threonine":0.07,"Isoleucine":0.09,"Leucine":0.17,"Lysine":0.07,"Methionine":0.04,"Cystine":0.04,"Phenylalanine":0.12,"Tyrosine":0.07,"Valine":0.1,"Arginine":0.1,"Histidine":0.05,"Alanine":0.08,"AsparticAcid":0.12,"GlutamicAcid":0.71,"Glycine":0.08,"Proline":0.25,"Serine":0.12,"omega3":0.03,"omega6":0.29,"AddedSugars":15.72,"IntrinsicSugars":4.08},"addedSugars":26.0,"intrinsicSugars":6.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18309","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"1145","name":"Butter, without salt","grams":21.3},{"ndb":"14411","name":"Water, tap, drinking","grams":9.3},{"ndb":"19335","name":"Sugars, granulated","grams":1.1},{"ndb":"9063","name":"Cherries, sour, red, raw","grams":77.5},{"ndb":"19335","name":"Sugars, granulated","grams":25.0},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"9152","name":"Lemon juice, raw","grams":1.9},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"1145","name":"Butter, without salt","grams":1.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":3.1},{"ndb":"14411","name":"Water, tap, drinking","grams":0.6}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":507.21,"raw_water_grams":134.34,"raw_fat_grams":140.54,"final_grams":483.03},{"section_key":"filling","section_label":"Cherry filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8675410890738492,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":882.95,"raw_water_grams":553.34,"raw_fat_grams":13.43,"final_grams":809.66},{"section_key":"wash","section_label":"Egg wash","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":30.0,"raw_water_grams":24.03,"raw_fat_grams":2.38,"final_grams":30.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, cherry, prepared from recipe', quantity: 'custom (g)', foodWord: 'CHERRYPIE', ndbNo: '18309', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'unsalted butter (chilled)', quantity: '3/4 cup', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 170.25 },
      { name: 'ice water', quantity: '5 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 74.0625 },
      { name: 'sugar', quantity: '2 teaspoons', section: 'crust', ndbNo: '19335', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'fresh or thawed frozen tart cherries, pitted', quantity: '4 cups (pitted)', section: 'filling', ndbNo: '9063', portionDesc: 'g', portionGrams: 620.0 },
      { name: 'sugar', quantity: '1 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'cornstarch', quantity: '1/4 cup', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'lemon juice', quantity: '1 tablespoon', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'unsalted butter (dotted on top of filling)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 },
      { name: 'large egg (beaten with 1 tsp water; brush onto lattice)', quantity: '1 large egg (for wash; ~half adheres)', section: 'wash', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'ice water', quantity: '1 teaspoon (egg wash)', section: 'wash', ndbNo: '14411', portionDesc: 'g', portionGrams: 5.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into two discs (one slightly larger than the other for the bottom crust) and chill for at least 30 minutes.',
      'While the dough chills, pit and halve the cherries. Add them to a medium saucepan with the sugar and lemon juice, and toss to combine. Cook over medium heat for a few minutes, stirring occasionally, until the cherries have released their juices.',
      'Use a slotted spoon to transfer the cherries into a bowl, leaving the juices in the saucepan. Spoon a few tablespoons of the hot juice into a small container, stir in the cornstarch until fully dissolved, then return the slurry to the saucepan with the remaining juices. Cook over medium heat for a few minutes, stirring constantly, until the sauce has thickened. Pour the thickened sauce over the cherries, stir in the salt, and set aside to cool slightly.',
      'Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving a 1-inch overhang. Pour the cooled cherry filling into the prepared crust and dot the top with the butter.',
      'Roll out the second disc into an 11-inch circle, cut into 1/2-inch-wide strips, and weave into a lattice on top of the pie. Trim, crimp, and seal the lattice to the bottom crust.',
      'Lightly beat 1 large egg with 1 teaspoon water; brush the egg wash evenly over the lattice top to give it a deep golden, glossy finish during baking.',
      'Bake at 425 degrees F (220 degrees C) for 25 minutes to set the crust. Reduce the heat to 375 degrees F (190 degrees C) and shield the crust edges with a 2- to 3-inch strip of aluminum foil (or a pie crust shield) to prevent over-browning. Continue baking for 50-55 minutes more (total bake time roughly 75-80 minutes), removing the foil for the last 15 minutes, until the crust is deep golden brown and the filling is bubbling thickly across the entire surface. An instant-read thermometer inserted through the lattice should read about 200 degrees F (93 degrees C).',
      'Cool the pie on a wire rack for at least 3 hours before slicing to allow the filling to set. Serve at room temperature or slightly warm.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'filling', label: 'Cherry filling', cookingMethod: '' },
      { key: 'wash', label: 'Egg wash', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_006',
    name: 'Pie Lemon Meringue',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 6,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":477.0,"pro":6.6,"fat":21.9,"carb":65.3,"fib":0.8,"h2o":76.5,"sug":42.4,"perServing":{"cal":477.0,"pro":6.6,"fat":21.9,"carb":65.3,"fib":0.8,"h2o":76.5,"sug":42.4,"AddedSugars":41.6,"IntrinsicSugars":0.8},"micros":{"vitaminA":101.83,"vitaminC":2.57,"vitaminD":13.49,"vitaminE":0.48,"vitaminK":0.97,"vitaminB6":0.02,"vitaminB12":0.13,"thiamin":0.09,"riboflavin":0.15,"niacin":0.71,"folate":28.11,"calcium":14.66,"iron":0.81,"magnesium":5.66,"phosphorus":41.13,"potassium":53.3,"sodium":224.25,"zinc":0.24,"copper":0.03,"selenium":10.67,"cholesterol":96.03,"saturatedFat":7.4,"monoFat":3.81,"polyFat":0.6,"omega3":0.03,"omega6":0.26},"gramsPerServing":171.7,"servings":8,"per100g":{"Energy_KCal":277.8,"Water":44.55,"Protein":3.87,"TotalLipidFat":12.73,"Carbohydrate":38.01,"FiberTotalDietary":0.47,"SugarsTotal":24.7,"Cholesterol":96.03,"FattyAcids_totalSaturated":7.4,"FattyAcids_totalMonounsaturated":3.81,"FattyAcids_totalPolyunsaturated":0.6,"LinoleicAcid":0.26,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":101.83,"Retinol":99.73,"Carotene_beta":23.27,"VitaminD":13.49,"VitaminE_alphaTocopherol":0.48,"VitaminK_phylloquinone":0.97,"VitaminC_totalAscorbicAcid":2.57,"Thiamin":0.09,"Riboflavin":0.15,"Niacin":0.71,"PantothenicAcid":0.22,"VitaminB6":0.02,"Folate_total":28.11,"Folate_food":11.29,"Folate_DFE":39.9,"FolicAcid":21.02,"VitaminB12":0.13,"Choline_total":46.02,"Betaine":0.09,"LuteinZeaxanthin":59.71,"Lycopene":0.0,"Calcium_Ca":14.66,"Iron_Fe":0.81,"Magnesium_Mg":5.66,"Phosphorus_P":41.13,"Potassium_K":53.3,"Sodium_Na":224.25,"Zinc_Zn":0.24,"Copper_Cu":0.03,"Manganese_Mn":0.1,"Selenium_Se":10.67,"Tryptophan":0.04,"Threonine":0.14,"Isoleucine":0.19,"Leucine":0.32,"Lysine":0.21,"Methionine":0.1,"Cystine":0.07,"Phenylalanine":0.2,"Tyrosine":0.14,"Valine":0.22,"Arginine":0.2,"Histidine":0.09,"Alanine":0.18,"AsparticAcid":0.31,"GlutamicAcid":0.81,"Glycine":0.13,"Proline":0.26,"Serine":0.25,"omega3":0.03,"omega6":0.26,"AddedSugars":24.22,"IntrinsicSugars":0.48},"addedSugars":41.6,"intrinsicSugars":0.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18321","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.78,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":10.7},{"ndb":"14411","name":"Water, tap, drinking","grams":5.6},{"ndb":"19335","name":"Sugars, granulated","grams":25.0},{"ndb":"9156","name":"Lemon peel, raw","grams":0.8},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":10.6},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":12.4},{"ndb":"9152","name":"Lemon juice, raw","grams":20.3},{"ndb":"14411","name":"Water, tap, drinking","grams":29.6},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"1124","name":"Egg, white, raw, fresh","grams":20.6},{"ndb":"19335","name":"Sugars, granulated","grams":16.7},{"ndb":"2047","name":"Salt, table","grams":0.2}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"baked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.84,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":320.14,"raw_water_grams":82.03,"raw_fat_grams":70.94,"final_grams":307.01},{"section_key":"filling","section_label":"Lemon curd filling","prep_method":"boiled","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.92,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":825.07,"raw_water_grams":456.82,"raw_fat_grams":103.61,"final_grams":788.52},{"section_key":"topping","section_label":"Meringue topping","prep_method":"baked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.85,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":299.83,"raw_water_grams":144.52,"raw_fat_grams":0.28,"final_grams":278.16}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, lemon meringue, prepared from recipe', quantity: 'custom (g)', foodWord: 'LEMONMERINGUEPIE', ndbNo: '18321', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter (chilled)', quantity: '6 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 85.2 },
      { name: 'ice water', quantity: '3 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 44.4375 },
      { name: 'sugar', quantity: '1 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'finely grated zest', quantity: '1 tablespoon', section: 'filling', ndbNo: '9156', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'egg yolks (reserve whites)', quantity: '5 large yolks', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter (cut into 1/2-inch pieces)', quantity: '7 tablespoons', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 99.4 },
      { name: 'lemon juice (fresh squeezed)', quantity: '2/3 cup', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 162.6667 },
      { name: 'ice water (whisked with cornstarch into slurry)', quantity: '1 cup', section: 'filling', ndbNo: '14411', portionDesc: 'g', portionGrams: 237.0 },
      { name: 'cornstarch (slurry with water)', quantity: '1/4 cup', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'egg whites (room temperature; pair with 5 yolks above)', quantity: '5 large whites', section: 'topping', ndbNo: '1124', portionDesc: 'g', portionGrams: 165.0 },
      { name: 'sugar', quantity: '2/3 cup', section: 'topping', ndbNo: '19335', portionDesc: 'g', portionGrams: 133.3333 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'topping', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a single disc and chill for at least 30 minutes.',
      'Roll the chilled dough into a 12-inch circle and fit into a 9-inch pie plate, trimming and crimping the edges. Line with parchment, fill with pie weights or dried beans, and blind-bake for 15 minutes. Remove the weights and bake 8-10 minutes more, until the crust is golden brown. Cool completely on a rack. Reduce oven temperature to 350 degrees F (175 degrees C).',
      'For the curd, whisk together the sugar, lemon zest, yolks, and salt in a heavy saucepan. In a separate bowl, whisk the cold water with the cornstarch until smooth, then whisk into the saucepan along with the lemon juice.',
      'Cook over medium heat, whisking constantly, until the mixture thickens and just comes to a gentle boil, about 8-10 minutes. Remove from heat and whisk in the butter a few pieces at a time until smooth and glossy. Pour the warm curd directly into the cooled crust and smooth the top.',
      'For the meringue, combine the egg whites, sugar, and salt in a large bowl. Beat on medium-high until stiff, glossy peaks form.',
      'Pile the meringue onto the pie, spreading it so it touches the crust all the way around to seal.',
      'Bake at 350F until the meringue begins to brown, 8-10 minutes.',
      'Cool the pie on a wire rack for at least 1 hour, then refrigerate for at least 3 hours before slicing to allow the filling to set fully.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.84 },
      { key: 'filling', label: 'Lemon curd filling', cookingMethod: '', yieldFactorWater: 0.92 },
      { key: 'topping', label: 'Meringue topping', cookingMethod: '', yieldFactorWater: 0.85 }
    ],
  },
  {
    id: 'SWEET_007',
    name: 'Pie Mince',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 7,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '60 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":657.7,"pro":6.1,"fat":25.0,"carb":106.9,"fib":5.8,"h2o":90.1,"sug":68.2,"perServing":{"cal":657.7,"pro":6.1,"fat":25.0,"carb":106.9,"fib":5.8,"h2o":90.1,"sug":68.2,"AddedSugars":40.0,"IntrinsicSugars":28.2},"micros":{"vitaminA":38.84,"vitaminC":0.79,"vitaminD":1.11,"vitaminE":0.66,"vitaminK":4.55,"vitaminB6":0.05,"vitaminB12":0.02,"thiamin":0.11,"riboflavin":0.11,"niacin":1.1,"folate":27.78,"calcium":30.39,"iron":1.31,"magnesium":13.3,"phosphorus":41.71,"potassium":207.86,"sodium":248.31,"zinc":0.23,"copper":0.1,"selenium":6.57,"cholesterol":16.61,"saturatedFat":4.31,"monoFat":3.81,"polyFat":1.48,"omega3":0.01,"omega6":0.12},"gramsPerServing":230.8,"servings":8,"per100g":{"Energy_KCal":285.01,"Water":39.03,"Protein":2.63,"TotalLipidFat":10.83,"Carbohydrate":46.31,"FiberTotalDietary":2.51,"SugarsTotal":29.57,"Cholesterol":16.61,"FattyAcids_totalSaturated":4.31,"FattyAcids_totalMonounsaturated":3.81,"FattyAcids_totalPolyunsaturated":1.48,"LinoleicAcid":0.12,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":38.84,"Retinol":32.87,"Carotene_beta":67.05,"VitaminD":1.11,"VitaminE_alphaTocopherol":0.66,"VitaminK_phylloquinone":4.55,"VitaminC_totalAscorbicAcid":0.79,"Thiamin":0.11,"Riboflavin":0.11,"Niacin":1.1,"PantothenicAcid":0.15,"VitaminB6":0.05,"Folate_total":27.78,"Folate_food":6.93,"Folate_DFE":41.63,"FolicAcid":26.07,"VitaminB12":0.02,"Choline_total":8.0,"Betaine":0.05,"LuteinZeaxanthin":33.94,"Lycopene":0.02,"Calcium_Ca":30.39,"Iron_Fe":1.31,"Magnesium_Mg":13.3,"Phosphorus_P":41.71,"Potassium_K":207.86,"Sodium_Na":248.31,"Zinc_Zn":0.23,"Copper_Cu":0.1,"Manganese_Mn":0.24,"Selenium_Se":6.57,"Tryptophan":0.03,"Threonine":0.06,"Isoleucine":0.08,"Leucine":0.15,"Lysine":0.06,"Methionine":0.04,"Cystine":0.04,"Phenylalanine":0.1,"Tyrosine":0.06,"Valine":0.09,"Arginine":0.1,"Histidine":0.05,"Alanine":0.07,"AsparticAcid":0.13,"GlutamicAcid":0.64,"Glycine":0.08,"Proline":0.24,"Serine":0.11,"omega3":0.01,"omega6":0.12,"AddedSugars":17.33,"IntrinsicSugars":12.24},"addedSugars":40.0,"intrinsicSugars":28.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18322","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":39.1},{"ndb":"2047","name":"Salt, table","grams":0.8},{"ndb":"1145","name":"Butter, without salt","grams":8.9},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":13.9},{"ndb":"14411","name":"Water, tap, drinking","grams":9.3},{"ndb":"9298","name":"Raisins, seedless","grams":6.9},{"ndb":"9297","name":"Raisins, golden seedless","grams":6.0},{"ndb":"9085","name":"Currants, zante, dried","grams":9.1},{"ndb":"9079","name":"Cranberries, dried, sweetened","grams":5.0},{"ndb":"9421","name":"Dates, medjool","grams":6.2},{"ndb":"9032","name":"Apricots, dried, sulfured, uncooked","grams":5.4},{"ndb":"9426","name":"Candied fruit","grams":7.5},{"ndb":"9502","name":"Apples, raw, granny smith, with skin","grams":75.0},{"ndb":"19334","name":"Sugars, brown","grams":31.2},{"ndb":"1145","name":"Butter, without salt","grams":3.5},{"ndb":"14411","name":"Water, tap, drinking","grams":18.5},{"ndb":"9156","name":"Lemon peel, raw","grams":0.8},{"ndb":"9152","name":"Lemon juice, raw","grams":3.8},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.3},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.1},{"ndb":"2011","name":"Spices, cloves, ground","grams":0.1},{"ndb":"2021","name":"Spices, ginger, ground","grams":0.0},{"ndb":"2001","name":"Spices, allspice, ground","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":3.1},{"ndb":"14411","name":"Water, tap, drinking","grams":0.6}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":575.25,"raw_water_grams":123.99,"raw_fat_grams":171.58,"final_grams":552.93},{"section_key":"filling","section_label":"Mincemeat filling","prep_method":"boiled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.7699685429310585,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":19,"raw_grams":1441.07,"raw_water_grams":772.7,"raw_fat_grams":26.06,"final_grams":1263.32},{"section_key":"wash","section_label":"Egg wash","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":29.94,"raw_water_grams":23.97,"raw_fat_grams":2.38,"final_grams":29.94}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, mince, prepared from recipe', quantity: 'custom (g)', foodWord: 'MINCEPIE', ndbNo: '18322', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 312.5 },
      { name: 'salt', quantity: '1 1/8 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.75 },
      { name: 'unsalted butter', quantity: '5 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 71.0 },
      { name: 'vegetable shortening', quantity: '8 tablespoon + 2 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 110.9333 },
      { name: 'ice water', quantity: '5 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 74.0625 },
      { name: 'dark raisins', quantity: '1/3 cup', section: 'filling', ndbNo: '9298', portionDesc: 'g', portionGrams: 55.0 },
      { name: 'golden raisins', quantity: '1/3 cup', section: 'filling', ndbNo: '9297', portionDesc: 'g', portionGrams: 48.3333 },
      { name: 'currants', quantity: '1/2 cup', section: 'filling', ndbNo: '9085', portionDesc: 'g', portionGrams: 72.5 },
      { name: 'dried cranberries', quantity: '1/3 cup', section: 'filling', ndbNo: '9079', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'medjool dates (pitted, chopped)', quantity: '1/3 cup', section: 'filling', ndbNo: '9421', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'dried apricots (chopped)', quantity: '1/3 cup', section: 'filling', ndbNo: '9032', portionDesc: 'g', portionGrams: 43.3333 },
      { name: 'mixed candied peel/citron', quantity: '1/3 cup', section: 'filling', ndbNo: '9426', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'peeled, cored, finely chopped', quantity: '5 medium apples', section: 'filling', ndbNo: '9502', portionDesc: 'g', portionGrams: 600.0 },
      { name: 'brown sugar (packed)', quantity: '1 1/4 cup', section: 'filling', ndbNo: '19334', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'unsalted butter (cut into pieces)', quantity: '2 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 28.4 },
      { name: 'ice water (or unsweetened apple juice)', quantity: '1/2 cup + 2 tablespoon', section: 'filling', ndbNo: '14411', portionDesc: 'g', portionGrams: 148.125 },
      { name: 'grated zest', quantity: 'zest of 1 lemon', section: 'filling', ndbNo: '9156', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'lemon juice', quantity: '2 tablespoons', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 30.5 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'filling', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'ground nutmeg', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.55 },
      { name: 'ground cloves', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2011', portionDesc: 'g', portionGrams: 0.525 },
      { name: 'ground ginger', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2021', portionDesc: 'g', portionGrams: 0.225 },
      { name: 'allspice', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2001', portionDesc: 'g', portionGrams: 0.475 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: '~25g of beaten egg adheres to lattice', quantity: '1 large egg', section: 'wash', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'ice water', quantity: '1 teaspoon', section: 'wash', ndbNo: '14411', portionDesc: 'g', portionGrams: 4.9375 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust, whisk the flour, salt, and sugar together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into 2 discs (one slightly larger for the bottom) and chill for at least 30 minutes.',
      'Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving overhang. Roll the second disc and cut into 1/2-inch strips for the lattice.',
      'For the mincemeat, melt the butter in a large saucepan over medium heat. Add the apples, dark and golden raisins, currants, dried cranberries, chopped dates and apricots, candied peel, brown sugar, lemon zest, lemon juice, water, cinnamon, nutmeg, cloves, ginger, allspice, and salt. Bring to a boil, stirring often, then reduce the heat to low and simmer, stirring frequently, until the apples have softened and most of the liquid has cooked away, about 25-30 minutes. The mixture should be glossy and thickened. Cool slightly. (Optional make-ahead: cool completely, transfer to an airtight container, and refrigerate up to 1 week; flavors deepen with rest. Stir in a tablespoon of rum or brandy weekly to keep up to 1 month.)',
      'Pour the warm mincemeat into the prepared crust and smooth the top. Lay the lattice strips over the filling in a woven pattern. Trim, fold, and crimp the edges to seal.',
      'Whisk the egg with 1 teaspoon of water and brush the lattice top.',
      'Bake at 425F for 20 minutes, then reduce the temperature to 375F and bake for another 30-35 minutes, until the crust is deep golden brown and the filling is bubbling. Tent loosely with foil if the crust browns too quickly.',
      'Cool the pie on a wire rack for at least 2 hours before slicing to allow the filling to set.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'filling', label: 'Mincemeat filling', cookingMethod: '' },
      { key: 'wash', label: 'Egg wash', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_008',
    name: 'Pie Peach',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 8,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '60 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":444.8,"pro":5.4,"fat":19.8,"carb":64.3,"fib":3.5,"h2o":147.3,"sug":34.6,"perServing":{"cal":444.8,"pro":5.4,"fat":19.8,"carb":64.3,"fib":3.5,"h2o":147.3,"sug":34.6,"AddedSugars":20.2,"IntrinsicSugars":14.4},"micros":{"vitaminA":67.95,"vitaminC":2.76,"vitaminD":1.07,"vitaminE":0.67,"vitaminK":2.46,"vitaminB6":0.02,"vitaminB12":0.03,"thiamin":0.09,"riboflavin":0.09,"niacin":1.15,"folate":22.47,"calcium":12.77,"iron":0.85,"magnesium":10.14,"phosphorus":33.8,"potassium":158.7,"sodium":156.61,"zinc":0.24,"copper":0.07,"selenium":5.13,"cholesterol":25.64,"saturatedFat":4.95,"monoFat":2.25,"polyFat":0.35,"omega3":0.02,"omega6":0.2},"gramsPerServing":238.7,"servings":8,"per100g":{"Energy_KCal":186.36,"Water":61.7,"Protein":2.26,"TotalLipidFat":8.28,"Carbohydrate":26.96,"FiberTotalDietary":1.48,"SugarsTotal":14.5,"Cholesterol":25.64,"FattyAcids_totalSaturated":4.95,"FattyAcids_totalMonounsaturated":2.25,"FattyAcids_totalPolyunsaturated":0.35,"LinoleicAcid":0.2,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":67.95,"Retinol":57.19,"Carotene_beta":104.69,"VitaminD":1.07,"VitaminE_alphaTocopherol":0.67,"VitaminK_phylloquinone":2.46,"VitaminC_totalAscorbicAcid":2.76,"Thiamin":0.09,"Riboflavin":0.09,"Niacin":1.15,"PantothenicAcid":0.17,"VitaminB6":0.02,"Folate_total":22.47,"Folate_food":6.34,"Folate_DFE":33.78,"FolicAcid":20.16,"VitaminB12":0.03,"Choline_total":9.5,"Betaine":0.22,"LuteinZeaxanthin":59.38,"Lycopene":0.01,"Calcium_Ca":12.77,"Iron_Fe":0.85,"Magnesium_Mg":10.14,"Phosphorus_P":33.8,"Potassium_K":158.7,"Sodium_Na":156.61,"Zinc_Zn":0.24,"Copper_Cu":0.07,"Manganese_Mn":0.15,"Selenium_Se":5.13,"Tryptophan":0.03,"Threonine":0.05,"Isoleucine":0.07,"Leucine":0.13,"Lysine":0.07,"Methionine":0.04,"Cystine":0.04,"Phenylalanine":0.09,"Tyrosine":0.06,"Valine":0.08,"Arginine":0.07,"Histidine":0.04,"Alanine":0.07,"AsparticAcid":0.37,"GlutamicAcid":0.53,"Glycine":0.07,"Proline":0.18,"Serine":0.1,"omega3":0.02,"omega6":0.2,"AddedSugars":8.46,"IntrinsicSugars":6.04},"addedSugars":20.2,"intrinsicSugars":14.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18323","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.78,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"2047","name":"Salt, table","grams":0.8},{"ndb":"1145","name":"Butter, without salt","grams":21.3},{"ndb":"14411","name":"Water, tap, drinking","grams":9.3},{"ndb":"19335","name":"Sugars, granulated","grams":1.1},{"ndb":"9236","name":"Peaches, yellow, raw","grams":170.0},{"ndb":"19335","name":"Sugars, granulated","grams":12.5},{"ndb":"19334","name":"Sugars, brown","grams":6.9},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"9152","name":"Lemon juice, raw","grams":1.9},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.2},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"1145","name":"Butter, without salt","grams":1.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":3.1},{"ndb":"14411","name":"Water, tap, drinking","grams":0.6}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":508.71,"raw_water_grams":134.34,"raw_fat_grams":140.54,"final_grams":484.53},{"section_key":"filling","section_label":"Peach filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8496276454978179,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":1579.8,"raw_water_grams":1228.85,"raw_fat_grams":15.19,"final_grams":1395.01},{"section_key":"wash","section_label":"Egg wash","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":29.94,"raw_water_grams":23.97,"raw_fat_grams":2.38,"final_grams":29.94}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, peach', quantity: 'custom (g)', foodWord: 'PEACHPIE', ndbNo: '18323', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'salt', quantity: '1 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'unsalted butter (chilled, cubed)', quantity: '3/4 cup', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 170.25 },
      { name: 'ice water', quantity: '5 tablespoons', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 74.0625 },
      { name: 'sugar', quantity: '2 teaspoons', section: 'crust', ndbNo: '19335', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'peaches (peeled, pitted, sliced)', quantity: 'about 7 cups sliced (about 3 lb)', section: 'filling', ndbNo: '9236', portionDesc: 'g', portionGrams: 1360.0 },
      { name: 'sugar', quantity: '1/2 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'brown sugar', quantity: '1/4 cup packed', section: 'filling', ndbNo: '19334', portionDesc: 'g', portionGrams: 55.0 },
      { name: 'cornstarch', quantity: '1/4 cup', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'lemon juice', quantity: '1 tablespoon', section: 'filling', ndbNo: '9152', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'ground cinnamon', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2010', portionDesc: 'g', portionGrams: 1.3 },
      { name: 'ground nutmeg', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.55 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'unsalted butter (cut into small pieces, dotted on top)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 },
      { name: '~25g of beaten egg adheres to lattice', quantity: '1 large egg', section: 'wash', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'ice water', quantity: '1 teaspoon', section: 'wash', ndbNo: '14411', portionDesc: 'g', portionGrams: 4.9375 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust, whisk the flour, salt, and sugar together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Divide into 2 discs (one slightly larger for the bottom) and chill for at least 30 minutes.',
      'Roll the larger disc into a 12-inch circle and fit into a 9-inch pie plate, leaving overhang. Roll the second disc and cut into 1/2-inch strips for the lattice; chill while you make the filling.',
      'Score a small X in the bottom of each peach, blanch in boiling water for 30-45 seconds, then transfer to an ice bath. Slip off the skins, halve, pit, and slice into 1/4-inch slices. Alternatively, use a vegetable peeler to remove the skin.',
      'Combine the sliced peaches, sugar, cornstarch, lemon juice, cinnamon, nutmeg, and salt in a heavy saucepan and toss gently to coat the fruit evenly. Set over medium heat.',
      'Cook, stirring every minute or two so nothing scorches, until the peaches release their juice and the cornstarch turns the syrup glossy and noticeably thickened, about 8-12 minutes. Remove from the heat as soon as the liquid looks like a glaze that coats the spoon.',
      'Spread the cooked filling on a sheet pan or shallow plate so it cools to at least lukewarm before going into the crust. Pouring hot filling onto raw dough will melt the butter and ruin the bottom crust.',
      'Scrape the cooled filling into the prepared bottom crust and smooth the surface. Dot with the butter pieces. Lay the lattice strips over the filling in a woven pattern. Trim, fold under, and crimp the edges to seal.',
      'Whisk the egg with 1 teaspoon of water and brush the lattice top.',
      'Bake at 425F for 20 minutes, then reduce the temperature to 375F and bake for another 25-30 minutes, until the crust is deep golden brown and the filling is bubbling slowly through the lattice. Tent the edges loosely with foil if they brown too quickly.',
      'Cool the pie on a wire rack for at least 3 hours before slicing so the filling sets firmly.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'filling', label: 'Peach filling', cookingMethod: '' },
      { key: 'wash', label: 'Egg wash', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_009',
    name: 'Pecan Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 9,
    recipe: ['egg', 'grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'bird', delay: 5000 },
      { type: 'raccoon', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 0, apple: 0, grapes: 4, bacon: 0, butter: 3, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":642.3,"pro":7.3,"fat":34.5,"carb":82.0,"fib":3.1,"h2o":30.4,"sug":60.6,"perServing":{"cal":642.3,"pro":7.3,"fat":34.5,"carb":82.0,"fib":3.1,"h2o":30.4,"sug":60.6,"AddedSugars":59.4,"IntrinsicSugars":1.2},"micros":{"vitaminA":82.76,"vitaminC":0.1,"vitaminD":9.35,"vitaminE":0.55,"vitaminK":1.37,"vitaminB6":0.05,"vitaminB12":0.11,"thiamin":0.18,"riboflavin":0.15,"niacin":0.97,"folate":30.62,"calcium":41.42,"iron":1.47,"magnesium":26.4,"phosphorus":88.41,"potassium":125.84,"sodium":249.93,"zinc":1.13,"copper":0.23,"selenium":10.11,"cholesterol":69.06,"saturatedFat":7.12,"monoFat":9.16,"polyFat":3.27,"omega3":0.03,"omega6":0.36},"gramsPerServing":156.2,"servings":8,"per100g":{"Energy_KCal":411.1,"Water":19.49,"Protein":4.71,"TotalLipidFat":22.08,"Carbohydrate":52.49,"FiberTotalDietary":1.96,"SugarsTotal":38.79,"Cholesterol":69.06,"FattyAcids_totalSaturated":7.12,"FattyAcids_totalMonounsaturated":9.16,"FattyAcids_totalPolyunsaturated":3.27,"LinoleicAcid":0.36,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":82.76,"Retinol":81.1,"Carotene_beta":18.19,"VitaminD":9.35,"VitaminE_alphaTocopherol":0.55,"VitaminK_phylloquinone":1.37,"VitaminC_totalAscorbicAcid":0.1,"Thiamin":0.18,"Riboflavin":0.15,"Niacin":0.97,"PantothenicAcid":0.36,"VitaminB6":0.05,"Folate_total":30.62,"Folate_food":11.37,"Folate_DFE":44.12,"FolicAcid":24.06,"VitaminB12":0.11,"Choline_total":39.85,"Betaine":0.17,"LuteinZeaxanthin":52.8,"Lycopene":0.0,"Calcium_Ca":41.42,"Iron_Fe":1.47,"Magnesium_Mg":26.4,"Phosphorus_P":88.41,"Potassium_K":125.84,"Sodium_Na":249.93,"Zinc_Zn":1.13,"Copper_Cu":0.23,"Manganese_Mn":0.84,"Selenium_Se":10.11,"Tryptophan":0.05,"Threonine":0.16,"Isoleucine":0.19,"Leucine":0.34,"Lysine":0.2,"Methionine":0.1,"Cystine":0.08,"Phenylalanine":0.23,"Tyrosine":0.15,"Valine":0.24,"Arginine":0.35,"Histidine":0.12,"Alanine":0.2,"AsparticAcid":0.38,"GlutamicAcid":1.05,"Glycine":0.18,"Proline":0.31,"Serine":0.28,"omega3":0.03,"omega6":0.36,"AddedSugars":38.02,"IntrinsicSugars":0.77},"addedSugars":59.4,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18325","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.78,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":10.7},{"ndb":"14411","name":"Water, tap, drinking","grams":5.6},{"ndb":"19350","name":"Syrups, corn, light","grams":42.6},{"ndb":"19334","name":"Sugars, brown","grams":27.5},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"1145","name":"Butter, without salt","grams":7.1},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":1.0},{"ndb":"2050","name":"Vanilla extract","grams":0.5},{"ndb":"2047","name":"Salt, table","grams":0.5},{"ndb":"12142","name":"Nuts, pecans","grams":25.0}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.84,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":320.14,"raw_water_grams":82.03,"raw_fat_grams":70.94,"final_grams":307.01},{"section_key":"filling","section_label":"Pecan custard filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.811339303174065,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":983.51,"raw_water_grams":215.32,"raw_fat_grams":205.0,"final_grams":942.89}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Pie, pecan, prepared from recipe', quantity: 'custom (g)', foodWord: 'PIEPECAN', ndbNo: '18325', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '6 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 85.2 },
      { name: 'ice water', quantity: '3 tablespoons ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 44.4375 },
      { name: 'light corn syrup', quantity: '1 cup', section: 'filling', ndbNo: '19350', portionDesc: 'g', portionGrams: 341.0 },
      { name: 'brown sugar', quantity: '1 cup packed', section: 'filling', ndbNo: '19334', portionDesc: 'g', portionGrams: 220.0 },
      { name: 'large eggs (lightly beaten)', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'butter (melted)', quantity: '1/4 cup', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 56.75 },
      { name: 'all-purpose flour (helps the filling set)', quantity: '1 tablespoon', section: 'filling', ndbNo: '20581', portionDesc: 'g', portionGrams: 7.8125 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'salt', quantity: '5/8 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.75 },
      { name: 'pecan halves, coarsely chopped (save enough whole halves to line the top)', quantity: '2 cups halves, coarsely chopped (save enough halves to line the top)', section: 'filling', ndbNo: '12142', portionDesc: 'g', portionGrams: 200.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350 degrees F (175 degrees C).',
      'For the crust, whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes.',
      'Roll the dough into an 11-inch circle and fit into a 9-inch pie plate. Trim, fold under, and crimp the edges. Prick the bottom and sides with a fork.',
      'Line the crust with parchment paper and fill with pie weights or dried beans. Blind-bake for 12-15 minutes until the edges are set, then remove the parchment and weights and bake for another 5 minutes until the bottom looks dry and barely golden. Set aside while you make the filling.',
      'In a large bowl, whisk the eggs with the tablespoon of flour until the flour is fully dispersed and there are no lumps. Add the corn syrup, brown sugar, melted butter, vanilla, and salt and whisk until smooth. The flour helps the filling set so it does not run when sliced.',
      'Stir in the pecan halves so they are evenly coated.',
      'Pour the filling into the par-baked crust, arranging the pecans so they float in an even layer across the top.',
      'Bake at 350F for 50-60 minutes, until the edges are puffed, the pecans on top are well toasted, and the center is just set with only a slight jiggle when the pan is gently shaken. Tent the crust edges with foil if they brown too quickly.',
      'Cool on a wire rack for at least 2 hours before slicing so the filling sets fully.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.84 },
      { key: 'filling', label: 'Pecan custard filling', cookingMethod: '' }
    ],
  },
  {
    id: 'SWEET_010',
    name: 'Pumpkin Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 10,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":330.2,"pro":7.3,"fat":15.0,"carb":42.9,"fib":2.2,"h2o":93.4,"sug":25.1,"perServing":{"cal":330.2,"pro":7.3,"fat":15.0,"carb":42.9,"fib":2.2,"h2o":93.4,"sug":25.1,"AddedSugars":18.7,"IntrinsicSugars":6.3},"micros":{"vitaminA":289.38,"vitaminC":1.1,"vitaminD":26.72,"vitaminE":0.58,"vitaminK":5.83,"vitaminB6":0.04,"vitaminB12":0.11,"thiamin":0.09,"riboflavin":0.19,"niacin":0.77,"folate":25.91,"calcium":91.51,"iron":1.3,"magnesium":18.55,"phosphorus":98.31,"potassium":180.02,"sodium":224.29,"zinc":0.47,"copper":0.06,"selenium":7.46,"cholesterol":53.54,"saturatedFat":5.5,"monoFat":2.62,"polyFat":0.4,"omega3":0.02,"omega6":0.24},"gramsPerServing":160.7,"servings":8,"per100g":{"Energy_KCal":205.43,"Water":58.14,"Protein":4.56,"TotalLipidFat":9.35,"Carbohydrate":26.71,"FiberTotalDietary":1.35,"SugarsTotal":15.6,"Cholesterol":53.54,"FattyAcids_totalSaturated":5.5,"FattyAcids_totalMonounsaturated":2.62,"FattyAcids_totalPolyunsaturated":0.4,"LinoleicAcid":0.24,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":289.38,"Retinol":69.65,"Carotene_beta":1848.09,"VitaminD":26.72,"VitaminE_alphaTocopherol":0.58,"VitaminK_phylloquinone":5.83,"VitaminC_totalAscorbicAcid":1.1,"Thiamin":0.09,"Riboflavin":0.19,"Niacin":0.77,"PantothenicAcid":0.41,"VitaminB6":0.04,"Folate_total":25.91,"Folate_food":10.94,"Folate_DFE":36.41,"FolicAcid":18.72,"VitaminB12":0.11,"Choline_total":32.74,"Betaine":0.02,"LuteinZeaxanthin":34.38,"Lycopene":0.02,"Calcium_Ca":91.51,"Iron_Fe":1.3,"Magnesium_Mg":18.55,"Phosphorus_P":98.31,"Potassium_K":180.02,"Sodium_Na":224.29,"Zinc_Zn":0.47,"Copper_Cu":0.06,"Manganese_Mn":0.2,"Selenium_Se":7.46,"Tryptophan":0.06,"Threonine":0.17,"Isoleucine":0.22,"Leucine":0.37,"Lysine":0.27,"Methionine":0.1,"Cystine":0.06,"Phenylalanine":0.22,"Tyrosine":0.18,"Valine":0.25,"Arginine":0.2,"Histidine":0.11,"Alanine":0.17,"AsparticAcid":0.34,"GlutamicAcid":1.02,"Glycine":0.12,"Proline":0.38,"Serine":0.26,"omega3":0.02,"omega6":0.24,"AddedSugars":11.64,"IntrinsicSugars":3.95},"addedSugars":18.7,"intrinsicSugars":6.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18327","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.95,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":19.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":10.7},{"ndb":"14411","name":"Water, tap, drinking","grams":4.6},{"ndb":"11424","name":"Pumpkin, canned, without salt","grams":53.1},{"ndb":"1096","name":"Milk, canned, evaporated, with added vitamin D","grams":44.2},{"ndb":"19335","name":"Sugars, granulated","grams":18.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":12.5},{"ndb":"2035","name":"Spices, pumpkin pie spice","grams":0.6},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":1.8}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.84,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":281.48,"raw_water_grams":70.91,"raw_fat_grams":70.64,"final_grams":270.14},{"section_key":"filling","section_label":"Pumpkin custard filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9506184910547713,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":1051.3,"raw_water_grams":723.64,"raw_fat_grams":49.62,"final_grams":1015.57}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Pie, pumpkin, prepared from recipe', quantity: 'custom (g)', foodWord: 'PIEPUMPKIN', ndbNo: '18327', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '6 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 85.2 },
      { name: 'ice water', quantity: '2 1/2 tablespoons ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 37.0312 },
      { name: 'canned pumpkin puree (not pumpkin pie filling)', quantity: '1 can (15 oz)', section: 'filling', ndbNo: '11424', portionDesc: 'g', portionGrams: 425.0 },
      { name: 'evaporated milk', quantity: '1 can (12 oz)', section: 'filling', ndbNo: '1096', portionDesc: 'g', portionGrams: 354.0 },
      { name: 'sugar', quantity: '3/4 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'large eggs (lightly beaten)', quantity: '2 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'pumpkin pie spice (or 1 1/2 tsp cinnamon + 1/2 tsp ginger + 1/2 tsp nutmeg + 1/4 tsp cloves)', quantity: '1 tablespoon', section: 'filling', ndbNo: '2035', portionDesc: 'g', portionGrams: 5.1 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'butter (melted)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust, whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes.',
      'Roll the dough into an 11-inch circle and fit into a 9-inch pie plate. Trim, fold under, and crimp the edges. Prick the bottom and sides with a fork.',
      'Line the crust with parchment paper and fill with pie weights or dried beans. Blind-bake for 12-15 minutes until the edges are set, then remove the parchment and weights and bake for another 5 minutes until the bottom looks dry and barely golden. Set aside while you make the filling.',
      'In a large bowl, whisk the sugar, salt, and pumpkin pie spice together until evenly combined.',
      'Add the eggs and whisk to break them up, then whisk in the pumpkin puree until smooth.',
      'Gradually whisk in the evaporated milk and the melted butter until the filling is uniform with no streaks.',
      'Pour the filling into the par-baked crust. The crust should be nearly full but not overflowing.',
      'Bake at 425F for 15 minutes, then reduce the oven temperature to 350F and bake for another 40-50 minutes, until a knife inserted 1 inch from the edge comes out clean and the center is just set with only a slight jiggle. Tent the crust edges with foil if they brown too quickly.',
      'Cool on a wire rack for at least 2 hours so the filling sets completely before slicing.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.84 },
      { key: 'filling', label: 'Pumpkin custard filling', cookingMethod: '' }
    ],
  },
  {
    id: 'SWEET_011',
    name: 'Vanilla Cream Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 11,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":395.0,"pro":7.1,"fat":20.4,"carb":45.5,"fib":0.8,"h2o":68.0,"sug":19.1,"perServing":{"cal":395.0,"pro":7.1,"fat":20.4,"carb":45.5,"fib":0.8,"h2o":68.0,"sug":19.1,"AddedSugars":15.3,"IntrinsicSugars":3.8},"micros":{"vitaminA":135.25,"vitaminC":0.06,"vitaminD":43.53,"vitaminE":0.51,"vitaminK":1.14,"vitaminB6":0.03,"vitaminB12":0.31,"thiamin":0.14,"riboflavin":0.21,"niacin":1.03,"folate":37.89,"calcium":61.0,"iron":1.12,"magnesium":9.15,"phosphorus":83.78,"potassium":85.49,"sodium":254.18,"zinc":0.45,"copper":0.04,"selenium":12.73,"cholesterol":110.5,"saturatedFat":8.27,"monoFat":4.07,"polyFat":0.76,"omega3":0.04,"omega6":0.25},"gramsPerServing":143.1,"servings":8,"per100g":{"Energy_KCal":276.07,"Water":47.5,"Protein":4.98,"TotalLipidFat":14.24,"Carbohydrate":31.81,"FiberTotalDietary":0.59,"SugarsTotal":13.31,"Cholesterol":110.5,"FattyAcids_totalSaturated":8.27,"FattyAcids_totalMonounsaturated":4.07,"FattyAcids_totalPolyunsaturated":0.76,"LinoleicAcid":0.25,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":135.25,"Retinol":132.64,"Carotene_beta":27.05,"VitaminD":43.53,"VitaminE_alphaTocopherol":0.51,"VitaminK_phylloquinone":1.14,"VitaminC_totalAscorbicAcid":0.06,"Thiamin":0.14,"Riboflavin":0.21,"Niacin":1.03,"PantothenicAcid":0.39,"VitaminB6":0.03,"Folate_total":37.89,"Folate_food":13.27,"Folate_DFE":55.16,"FolicAcid":32.06,"VitaminB12":0.31,"Choline_total":57.12,"Betaine":0.32,"LuteinZeaxanthin":69.03,"Lycopene":0.0,"Calcium_Ca":61.0,"Iron_Fe":1.12,"Magnesium_Mg":9.15,"Phosphorus_P":83.78,"Potassium_K":85.49,"Sodium_Na":254.18,"Zinc_Zn":0.45,"Copper_Cu":0.04,"Manganese_Mn":0.15,"Selenium_Se":12.73,"Tryptophan":0.06,"Threonine":0.18,"Isoleucine":0.22,"Leucine":0.4,"Lysine":0.26,"Methionine":0.11,"Cystine":0.06,"Phenylalanine":0.24,"Tyrosine":0.19,"Valine":0.26,"Arginine":0.21,"Histidine":0.12,"Alanine":0.18,"AsparticAcid":0.34,"GlutamicAcid":1.23,"Glycine":0.14,"Proline":0.46,"Serine":0.29,"omega3":0.04,"omega6":0.25,"AddedSugars":10.66,"IntrinsicSugars":2.65},"addedSugars":15.3,"intrinsicSugars":3.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18328","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.86,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":10.7},{"ndb":"14411","name":"Water, tap, drinking","grams":5.6},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":61.0},{"ndb":"19335","name":"Sugars, granulated","grams":14.1},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":6.3},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":10.0},{"ndb":"1145","name":"Butter, without salt","grams":1.8},{"ndb":"2050","name":"Vanilla extract","grams":1.1},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":14.9},{"ndb":"19336","name":"Sugars, powdered","grams":1.2}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"baked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8399302309307645,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":320.14,"raw_water_grams":82.03,"raw_fat_grams":70.94,"final_grams":307.01},{"section_key":"filling","section_label":"Vanilla pastry cream","prep_method":"boiled","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.8325673950340446,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":790.38,"raw_water_grams":487.63,"raw_fat_grams":49.13,"final_grams":708.74},{"section_key":"topping","section_label":"Whipped cream topping","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":129.0,"raw_water_grams":68.82,"raw_fat_grams":42.94,"final_grams":129.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, vanilla cream, prepared from recipe', quantity: 'custom (g)', foodWord: 'PIEVANILLACREAM', ndbNo: '18328', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '6 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 85.2 },
      { name: 'ice water', quantity: '3 tablespoons ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 44.4375 },
      { name: 'whole milk', quantity: '2 cups', section: 'filling', ndbNo: '1077', portionDesc: 'g', portionGrams: 488.0 },
      { name: 'sugar', quantity: '1/2 cup + 1 tablespoon', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 112.5 },
      { name: 'cornstarch', quantity: '1/4 cup', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '6 1/2 tablespoons', section: 'filling', ndbNo: '20581', portionDesc: 'g', portionGrams: 50.7812 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'egg yolks (lightly beaten)', quantity: '4 large yolks', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 80.0 },
      { name: 'butter (cut into pieces)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 },
      { name: 'pure vanilla extract', quantity: '2 teaspoons', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'heavy cream', quantity: '1/2 cup', section: 'topping', ndbNo: '1053', portionDesc: 'g', portionGrams: 119.0 },
      { name: 'powdered sugar', quantity: '1 1/4 tablespoons', section: 'topping', ndbNo: '19336', portionDesc: 'g', portionGrams: 10.0 },
      { name: 'vanilla extract', quantity: '1/2 teaspoon', section: 'topping', ndbNo: '2050', portionDesc: 'g', portionGrams: 2.1 }
    ],
    recipeInstructions: [
      'Preheat the oven to 425 degrees F (220 degrees C).',
      'For the crust, whisk the flour and salt together. Cut in the chilled butter until the mixture resembles coarse crumbs, then add the ice water 1 tablespoon at a time just until the dough comes together. Form into a disc and chill for at least 30 minutes.',
      'Roll the dough into an 11-inch circle and fit into a 9-inch pie plate. Trim, fold under, and crimp the edges. Prick the bottom and sides with a fork.',
      'Line the crust with parchment and fill with pie weights or dried beans. Blind-bake at 425F for 12-15 minutes until the edges are set, then remove the parchment and weights, reduce the oven to 375F, and bake for another 8-10 minutes until the bottom is dry and golden. Cool completely on a rack.',
      'For the pastry cream, whisk the sugar, cornstarch, flour, and salt together in a heavy saucepan. Gradually whisk in the milk until smooth.',
      'Set over medium heat and cook, whisking constantly, until the mixture thickens, comes to a gentle boil, and bubbles for about 1 minute. The custard should coat the back of a spoon thickly.',
      'Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook, whisking constantly, for another 2 minutes until thickened and glossy. Do not let it scorch.',
      'Remove from the heat and whisk in the butter and vanilla extract until smooth.',
      'Pour the warm filling into the cooled crust and smooth the top. Press a piece of plastic wrap directly onto the surface to prevent a skin from forming, then refrigerate for at least 4 hours, or until fully set.',
      'Just before serving, whip the heavy cream with the powdered sugar and vanilla (if using) to soft peaks. Spread or pipe over the chilled pie and serve.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '' },
      { key: 'filling', label: 'Vanilla pastry cream', cookingMethod: '' },
      { key: 'topping', label: 'Whipped cream topping', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_012',
    name: 'Boston Cream Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 12,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '10 slices',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":428.5,"pro":7.1,"fat":21.8,"carb":53.0,"fib":1.2,"h2o":65.5,"sug":36.0,"perServing":{"cal":428.5,"pro":7.1,"fat":21.8,"carb":53.0,"fib":1.2,"h2o":65.5,"sug":36.0,"AddedSugars":32.8,"IntrinsicSugars":3.2},"micros":{"vitaminA":113.12,"vitaminC":0.02,"vitaminD":36.18,"vitaminE":0.47,"vitaminK":1.38,"vitaminB6":0.03,"vitaminB12":0.3,"thiamin":0.1,"riboflavin":0.19,"niacin":0.7,"folate":28.03,"calcium":90.18,"iron":1.15,"magnesium":16.73,"phosphorus":132.97,"potassium":107.23,"sodium":125.21,"zinc":0.55,"copper":0.09,"selenium":11.13,"cholesterol":102.93,"saturatedFat":8.39,"monoFat":4.3,"polyFat":0.75,"omega3":0.04,"omega6":0.34},"gramsPerServing":149.5,"servings":10,"per100g":{"Energy_KCal":286.66,"Water":43.85,"Protein":4.77,"TotalLipidFat":14.58,"Carbohydrate":35.49,"FiberTotalDietary":0.8,"SugarsTotal":24.08,"Cholesterol":102.93,"FattyAcids_totalSaturated":8.39,"FattyAcids_totalMonounsaturated":4.3,"FattyAcids_totalPolyunsaturated":0.75,"LinoleicAcid":0.34,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":113.12,"Retinol":111.18,"Carotene_beta":20.35,"VitaminD":36.18,"VitaminE_alphaTocopherol":0.47,"VitaminK_phylloquinone":1.38,"VitaminC_totalAscorbicAcid":0.02,"Thiamin":0.1,"Riboflavin":0.19,"Niacin":0.7,"PantothenicAcid":0.39,"VitaminB6":0.03,"Folate_total":28.03,"Folate_food":12.58,"Folate_DFE":38.87,"FolicAcid":19.32,"VitaminB12":0.3,"Choline_total":58.82,"Betaine":0.28,"LuteinZeaxanthin":71.63,"Lycopene":0.0,"Calcium_Ca":90.18,"Iron_Fe":1.15,"Magnesium_Mg":16.73,"Phosphorus_P":132.97,"Potassium_K":107.23,"Sodium_Na":125.21,"Zinc_Zn":0.55,"Copper_Cu":0.09,"Manganese_Mn":0.15,"Selenium_Se":11.13,"Tryptophan":0.06,"Threonine":0.18,"Isoleucine":0.22,"Leucine":0.39,"Lysine":0.28,"Methionine":0.11,"Cystine":0.06,"Phenylalanine":0.24,"Tyrosine":0.19,"Valine":0.27,"Arginine":0.23,"Histidine":0.12,"Alanine":0.2,"AsparticAcid":0.38,"GlutamicAcid":1.01,"Glycine":0.15,"Proline":0.37,"Serine":0.3,"omega3":0.04,"omega6":0.34,"AddedSugars":21.92,"IntrinsicSugars":2.16},"addedSugars":32.8,"intrinsicSugars":3.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18090","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.92,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":18.8},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.7},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1145","name":"Butter, without salt","grams":11.3},{"ndb":"19335","name":"Sugars, granulated","grams":20.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":15.0},{"ndb":"2050","name":"Vanilla extract","grams":0.6},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":18.3},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":36.6},{"ndb":"19335","name":"Sugars, granulated","grams":6.7},{"ndb":"20027","name":"Cornstarch","grams":1.6},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":5.1},{"ndb":"1145","name":"Butter, without salt","grams":1.4},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":6.0},{"ndb":"19080","name":"Candies, semisweet chocolate","grams":11.3},{"ndb":"1145","name":"Butter, without salt","grams":1.4}],"sections":[{"section_key":"cake","section_label":"Yellow butter cake","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.870727082683845,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":848.7,"raw_water_grams":321.85,"raw_fat_grams":114.11,"final_grams":807.09},{"section_key":"filling","section_label":"Vanilla pastry cream","prep_method":"boiled","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.9497702185102134,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":518.82,"raw_water_grams":355.34,"raw_fat_grams":36.96,"final_grams":500.97},{"section_key":"glaze","section_label":"Chocolate ganache glaze","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":186.7,"raw_water_grams":37.74,"raw_fat_grams":66.89,"final_grams":186.7}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Cake, boston cream pie, commercially prepared', quantity: 'custom (g)', foodWord: 'PIEBOSTONCREAM', ndbNo: '18090', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/2 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'baking powder', quantity: '1 1/2 teaspoons', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 6.9 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'unsalted butter, softened', quantity: '1/2 cup', section: 'cake', ndbNo: '1145', portionDesc: 'g', portionGrams: 113.5 },
      { name: 'sugar', quantity: '1 cup', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'large eggs (room temperature)', quantity: '3 large', section: 'cake', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'vanilla extract', quantity: '1 1/2 teaspoons', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 6.3 },
      { name: 'whole milk', quantity: '3/4 cup', section: 'cake', ndbNo: '1077', portionDesc: 'g', portionGrams: 183.0 },
      { name: 'whole milk', quantity: '1 1/2 cups', section: 'filling', ndbNo: '1077', portionDesc: 'g', portionGrams: 366.0 },
      { name: 'sugar', quantity: '1/3 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 66.6667 },
      { name: 'cornstarch', quantity: '2 tablespoons', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 16.0 },
      { name: 'salt', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 },
      { name: 'egg yolks (lightly beaten)', quantity: '3 large yolks', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 51.0 },
      { name: 'butter (cut in pieces)', quantity: '1 tablespoon', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'heavy cream', quantity: '1/4 cup', section: 'glaze', ndbNo: '1053', portionDesc: 'g', portionGrams: 59.5 },
      { name: 'semisweet chocolate, chopped', quantity: '4 ounces', section: 'glaze', ndbNo: '19080', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'butter', quantity: '1 tablespoon', section: 'glaze', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350 degrees F (175 degrees C). Grease two 8-inch round cake pans and line the bottoms with parchment paper.',
      'For the cake, whisk the flour, baking powder, and salt together and set aside.',
      'In a stand mixer or large bowl, beat the softened butter and sugar on medium-high until pale and fluffy, about 3 minutes. Add the eggs one at a time, beating well after each, then beat in the vanilla.',
      'On low speed, add the flour mixture in three additions alternating with the milk in two additions, beginning and ending with the flour. Mix just until smooth.',
      'Divide the batter evenly between the two pans and smooth the tops. Bake for 22-26 minutes, until the centers spring back when lightly pressed and a toothpick comes out clean. Cool in the pans 10 minutes, then turn out onto a rack and cool completely.',
      'For the pastry cream, whisk the sugar, cornstarch, and salt in a heavy saucepan. Gradually whisk in the milk until smooth. Cook over medium heat, whisking constantly, until thickened and gently boiling, about 1 minute.',
      'Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook 1-2 minutes more, whisking constantly, until thick and glossy.',
      'Remove from the heat and whisk in the butter and vanilla. Press plastic wrap onto the surface and chill until cold, at least 1 hour.',
      'When the cake layers are completely cool and the pastry cream is set, place the bottom layer on a serving plate. Spread the pastry cream evenly to within 1/2 inch of the edge. Top with the second cake layer, pressing gently.',
      'For the glaze, heat the cream in a small saucepan or microwave until it just begins to steam. Pour over the chopped chocolate in a heatproof bowl, let sit 1 minute, then whisk until smooth. Whisk in the butter until glossy.',
      'Pour the warm glaze over the center of the top cake layer and spread gently with the back of a spoon, letting some drip down the sides. Refrigerate at least 1 hour before slicing so the glaze sets.'
    ],
    sections: [
      { key: 'cake', label: 'Yellow butter cake', cookingMethod: '' },
      { key: 'filling', label: 'Vanilla pastry cream', cookingMethod: '' },
      { key: 'glaze', label: 'Chocolate ganache glaze', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_013',
    name: 'Chocolate Cream Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 13,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":681.8,"pro":7.7,"fat":46.3,"carb":66.1,"fib":3.1,"h2o":76.7,"sug":50.8,"perServing":{"cal":681.8,"pro":7.7,"fat":46.3,"carb":66.1,"fib":3.1,"h2o":76.7,"sug":50.8,"AddedSugars":46.2,"IntrinsicSugars":4.5},"micros":{"vitaminA":159.13,"vitaminC":0.11,"vitaminD":39.11,"vitaminE":0.83,"vitaminK":6.0,"vitaminB6":0.03,"vitaminB12":0.23,"thiamin":0.04,"riboflavin":0.15,"niacin":0.41,"folate":14.72,"calcium":57.79,"iron":2.4,"magnesium":27.22,"phosphorus":84.54,"potassium":143.4,"sodium":95.24,"zinc":0.59,"copper":0.17,"selenium":5.63,"cholesterol":90.19,"saturatedFat":13.19,"monoFat":7.2,"polyFat":1.26,"omega3":0.07,"omega6":0.32},"gramsPerServing":198.8,"servings":8,"per100g":{"Energy_KCal":342.99,"Water":38.59,"Protein":3.87,"TotalLipidFat":23.29,"Carbohydrate":33.27,"FiberTotalDietary":1.54,"SugarsTotal":25.55,"Cholesterol":90.19,"FattyAcids_totalSaturated":13.19,"FattyAcids_totalMonounsaturated":7.2,"FattyAcids_totalPolyunsaturated":1.26,"LinoleicAcid":0.32,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":159.13,"Retinol":156.23,"Carotene_beta":30.4,"VitaminD":39.11,"VitaminE_alphaTocopherol":0.83,"VitaminK_phylloquinone":6.0,"VitaminC_totalAscorbicAcid":0.11,"Thiamin":0.04,"Riboflavin":0.15,"Niacin":0.41,"PantothenicAcid":0.32,"VitaminB6":0.03,"Folate_total":14.72,"Folate_food":7.72,"Folate_DFE":19.67,"FolicAcid":8.75,"VitaminB12":0.23,"Choline_total":43.66,"Betaine":2.59,"LuteinZeaxanthin":37.63,"Lycopene":0.0,"Calcium_Ca":57.79,"Iron_Fe":2.4,"Magnesium_Mg":27.22,"Phosphorus_P":84.54,"Potassium_K":143.4,"Sodium_Na":95.24,"Zinc_Zn":0.59,"Copper_Cu":0.17,"Manganese_Mn":0.25,"Selenium_Se":5.63,"Tryptophan":0.06,"Threonine":0.15,"Isoleucine":0.17,"Leucine":0.3,"Lysine":0.21,"Methionine":0.07,"Cystine":0.04,"Phenylalanine":0.18,"Tyrosine":0.15,"Valine":0.22,"Arginine":0.15,"Histidine":0.09,"Alanine":0.15,"AsparticAcid":0.32,"GlutamicAcid":0.77,"Glycine":0.11,"Proline":0.3,"Serine":0.2,"omega3":0.07,"omega6":0.32,"AddedSugars":23.27,"IntrinsicSugars":2.28},"addedSugars":46.2,"intrinsicSugars":4.5,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18310","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.78,"yieldFactorFat":1.0,"sources":[{"ndb":"18166","name":"Cookies, chocolate sandwich, with creme filling, regular","grams":30.0},{"ndb":"1145","name":"Butter, without salt","grams":8.9},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":61.0},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":14.9},{"ndb":"19335","name":"Sugars, granulated","grams":16.7},{"ndb":"20027","name":"Cornstarch","grams":3.0},{"ndb":"19165","name":"Cocoa, dry powder, unsweetened","grams":1.4},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":8.5},{"ndb":"19080","name":"Candies, semisweet chocolate","grams":28.4},{"ndb":"1145","name":"Butter, without salt","grams":5.3},{"ndb":"2050","name":"Vanilla extract","grams":0.5},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"19336","name":"Sugars, powdered","grams":2.0}],"sections":[{"section_key":"crust","section_label":"Chocolate cookie crumb crust","prep_method":"baked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9699893469904408,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":311.0,"raw_water_grams":20.2,"raw_fat_grams":103.52,"final_grams":310.39},{"section_key":"filling","section_label":"Chocolate pastry cream","prep_method":"boiled","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.8325673950340446,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":1117.68,"raw_water_grams":548.23,"raw_fat_grams":180.99,"final_grams":1025.89},{"section_key":"topping","section_label":"Whipped cream topping","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":254.0,"raw_water_grams":137.62,"raw_fat_grams":85.87,"final_grams":254.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, chocolate creme, commercially prepared', quantity: 'custom (g)', foodWord: 'PIECHOCOLATE', ndbNo: '18310', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'chocolate sandwich cookies (such as Oreos), finely crushed', quantity: '24 cookies', section: 'crust', ndbNo: '18166', portionDesc: 'g', portionGrams: 240.0 },
      { name: 'butter (melted)', quantity: '5 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 71.0 },
      { name: 'whole milk', quantity: '2 cups', section: 'filling', ndbNo: '1077', portionDesc: 'g', portionGrams: 488.0 },
      { name: 'heavy cream', quantity: '1/2 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 119.0 },
      { name: 'sugar', quantity: '2/3 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 133.3333 },
      { name: 'cornstarch', quantity: '3 tablespoons', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 24.0 },
      { name: 'unsweetened cocoa powder', quantity: '2 tablespoons', section: 'filling', ndbNo: '19165', portionDesc: 'g', portionGrams: 10.8 },
      { name: 'salt', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 },
      { name: 'egg yolks (lightly beaten)', quantity: '4 large yolks', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 68.0 },
      { name: 'semisweet chocolate, chopped', quantity: '8 ounces', section: 'filling', ndbNo: '19080', portionDesc: 'g', portionGrams: 227.0 },
      { name: 'butter', quantity: '3 tablespoons', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 42.6 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'heavy cream', quantity: '1 cup', section: 'topping', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'powdered sugar', quantity: '2 tablespoons', section: 'topping', ndbNo: '19336', portionDesc: 'g', portionGrams: 16.0 },
      { name: 'vanilla extract', quantity: '1/2 teaspoon', section: 'topping', ndbNo: '2050', portionDesc: 'g', portionGrams: 2.1 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350 degrees F (175 degrees C).',
      'For the crust, pulse the cookies in a food processor to fine crumbs (or crush in a sealed bag with a rolling pin). Combine with the melted butter and stir until evenly moistened. Press firmly into the bottom and up the sides of a 9-inch pie plate. Bake for 8-10 minutes, then cool on a rack while you make the filling.',
      'For the filling, whisk the sugar, cornstarch, cocoa, and salt together in a heavy saucepan. Gradually whisk in the milk and heavy cream until smooth and no lumps remain.',
      'Set over medium heat and cook, whisking constantly, until the mixture thickens, comes to a gentle boil, and bubbles for about 1 minute.',
      'Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook 1-2 minutes more, whisking constantly, until thick and glossy.',
      'Remove from the heat and add the chopped chocolate, butter, and vanilla. Whisk until completely smooth and the chocolate is fully melted.',
      'Pour the warm filling into the cooled cookie crust and smooth the top. Press a piece of plastic wrap directly onto the surface and refrigerate for at least 4 hours, or until fully set.',
      'Just before serving, whip the heavy cream with the powdered sugar and vanilla (if using) to soft peaks. Spread or pipe over the chilled pie and serve.'
    ],
    sections: [
      { key: 'crust', label: 'Chocolate cookie crumb crust', cookingMethod: '' },
      { key: 'filling', label: 'Chocolate pastry cream', cookingMethod: '' },
      { key: 'topping', label: 'Whipped cream topping', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_014',
    name: 'Coconut Cream Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 14,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":633.1,"pro":7.4,"fat":46.5,"carb":49.4,"fib":1.6,"h2o":91.0,"sug":24.7,"perServing":{"cal":633.1,"pro":7.4,"fat":46.5,"carb":49.4,"fib":1.6,"h2o":91.0,"sug":24.7,"AddedSugars":22.0,"IntrinsicSugars":2.7},"micros":{"vitaminA":164.15,"vitaminC":0.33,"vitaminD":24.03,"vitaminE":0.52,"vitaminK":1.46,"vitaminB6":0.03,"vitaminB12":0.14,"thiamin":0.09,"riboflavin":0.14,"niacin":0.75,"folate":25.33,"calcium":41.81,"iron":1.42,"magnesium":17.14,"phosphorus":79.45,"potassium":114.87,"sodium":168.22,"zinc":0.43,"copper":0.08,"selenium":8.39,"cholesterol":93.47,"saturatedFat":16.44,"monoFat":5.01,"polyFat":0.86,"omega3":0.06,"omega6":0.38},"gramsPerServing":196.6,"servings":8,"per100g":{"Energy_KCal":322.02,"Water":46.31,"Protein":3.77,"TotalLipidFat":23.65,"Carbohydrate":25.14,"FiberTotalDietary":0.81,"SugarsTotal":12.58,"Cholesterol":93.47,"FattyAcids_totalSaturated":16.44,"FattyAcids_totalMonounsaturated":5.01,"FattyAcids_totalPolyunsaturated":0.86,"LinoleicAcid":0.38,"alphaLinolenicAcid":0.05,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.0,"VitaminA_RAE":164.15,"Retinol":161.31,"Carotene_beta":32.32,"VitaminD":24.03,"VitaminE_alphaTocopherol":0.52,"VitaminK_phylloquinone":1.46,"VitaminC_totalAscorbicAcid":0.33,"Thiamin":0.09,"Riboflavin":0.14,"Niacin":0.75,"PantothenicAcid":0.34,"VitaminB6":0.03,"Folate_total":25.33,"Folate_food":10.65,"Folate_DFE":35.63,"FolicAcid":18.36,"VitaminB12":0.14,"Choline_total":40.22,"Betaine":0.21,"LuteinZeaxanthin":42.06,"Lycopene":0.0,"Calcium_Ca":41.81,"Iron_Fe":1.42,"Magnesium_Mg":17.14,"Phosphorus_P":79.45,"Potassium_K":114.87,"Sodium_Na":168.22,"Zinc_Zn":0.43,"Copper_Cu":0.08,"Manganese_Mn":0.31,"Selenium_Se":8.39,"Tryptophan":0.05,"Threonine":0.13,"Isoleucine":0.16,"Leucine":0.29,"Lysine":0.16,"Methionine":0.07,"Cystine":0.05,"Phenylalanine":0.18,"Tyrosine":0.14,"Valine":0.2,"Arginine":0.23,"Histidine":0.08,"Alanine":0.15,"AsparticAcid":0.27,"GlutamicAcid":0.89,"Glycine":0.12,"Proline":0.32,"Serine":0.19,"omega3":0.06,"omega6":0.38,"AddedSugars":11.18,"IntrinsicSugars":1.39},"addedSugars":22.0,"intrinsicSugars":2.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18314","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.92,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":10.7},{"ndb":"14411","name":"Water, tap, drinking","grams":5.6},{"ndb":"1049","name":"Cream, fluid, half and half","grams":30.2},{"ndb":"12118","name":"Nuts, coconut milk, canned","grams":50.0},{"ndb":"19335","name":"Sugars, granulated","grams":16.7},{"ndb":"20027","name":"Cornstarch","grams":4.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":8.5},{"ndb":"1145","name":"Butter, without salt","grams":3.5},{"ndb":"2050","name":"Vanilla extract","grams":0.5},{"ndb":"12109","name":"Nuts, coconut meat, dried, sweetened, flaked","grams":9.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":44.6},{"ndb":"19336","name":"Sugars, powdered","grams":2.0}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"baked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.83058510032129,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":320.14,"raw_water_grams":82.03,"raw_fat_grams":70.94,"final_grams":306.24},{"section_key":"filling","section_label":"Coconut pastry cream","prep_method":"boiled","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.8325673950340445,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":984.93,"raw_water_grams":545.13,"raw_fat_grams":172.28,"final_grams":893.66},{"section_key":"topping","section_label":"Whipped cream topping","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":373.0,"raw_water_grams":206.42,"raw_fat_grams":128.81,"final_grams":373.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pie, coconut cream, prepared from mix, no-bake type', quantity: 'custom (g)', foodWord: 'PIECOCONUTCREAM', ndbNo: '18314', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'cold unsalted butter, cubed', quantity: '6 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 85.2 },
      { name: 'ice water (more as needed)', quantity: '3 tablespoons', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 44.4375 },
      { name: 'half-and-half', quantity: '1 cup', section: 'filling', ndbNo: '1049', portionDesc: 'g', portionGrams: 242.0 },
      { name: 'canned coconut milk (full-fat, well shaken)', quantity: '1 can (13.5 oz)', section: 'filling', ndbNo: '12118', portionDesc: 'g', portionGrams: 400.0 },
      { name: 'sugar', quantity: '2/3 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 133.3333 },
      { name: 'cornstarch', quantity: '4 tablespoons', section: 'filling', ndbNo: '20027', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'egg yolks (lightly beaten)', quantity: '4 large yolks', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 68.0 },
      { name: 'butter', quantity: '2 tablespoons', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 28.4 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'sweetened flaked coconut', quantity: '1 cup', section: 'filling', ndbNo: '12109', portionDesc: 'g', portionGrams: 74.0 },
      { name: 'heavy cream', quantity: '1 1/2 cups', section: 'topping', ndbNo: '1053', portionDesc: 'g', portionGrams: 357.0 },
      { name: 'powdered sugar', quantity: '2 tablespoons', section: 'topping', ndbNo: '19336', portionDesc: 'g', portionGrams: 16.0 },
      { name: 'vanilla extract', quantity: '1/2 teaspoon', section: 'topping', ndbNo: '2050', portionDesc: 'g', portionGrams: 2.1 },
      { name: 'sweetened flaked coconut, lightly toasted (for garnish)', quantity: '1/4 cup', section: 'topping', ndbNo: '12109', portionDesc: 'g', portionGrams: 18.5 }
    ],
    recipeInstructions: [
      'For the crust, whisk the flour and salt together in a bowl. Cut in the cold butter with a pastry cutter or your fingertips until the mixture resembles coarse crumbs with some pea-sized pieces. Sprinkle the ice water over and stir gently with a fork until the dough just comes together, adding a few more drops of water if needed.',
      'Shape the dough into a disk, wrap, and chill for at least 30 minutes. Roll out on a lightly floured surface to a 12-inch round, transfer to a 9-inch pie plate, trim, and crimp the edges. Prick the bottom all over with a fork and chill for another 15 minutes.',
      'Preheat the oven to 400 degrees F (205 degrees C). Line the chilled shell with parchment and fill with pie weights or dried beans. Bake for 15 minutes, then remove the weights and parchment and bake another 8-10 minutes, until the crust is fully baked and lightly golden. Cool completely on a rack.',
      'For the filling, whisk the sugar, cornstarch, and salt together in a heavy saucepan. Gradually whisk in the half-and-half and coconut milk until smooth.',
      'Set over medium heat and cook, whisking constantly, until the mixture thickens, comes to a gentle boil, and bubbles for about 1 minute.',
      'Whisk a ladleful of the hot custard into the egg yolks to temper them, then return the yolks to the saucepan. Cook 1-2 minutes more, whisking constantly, until thick and glossy.',
      'Remove from the heat and whisk in the butter and vanilla until smooth. Stir in the flaked coconut.',
      'Pour the warm filling into the cooled crust and smooth the top. Press a piece of plastic wrap directly onto the surface to prevent a skin from forming, then refrigerate for at least 4 hours, or until fully set.',
      'Toast the coconut: place 1/4 cup of the sweetened flaked coconut on a parchment-lined baking sheet. Bake at 350 degrees F (175 degrees C) until light golden, about 5 minutes. Set aside to cool.',
      'Just before serving, whip the heavy cream with the powdered sugar and vanilla (if using) to soft peaks. Spread or pipe over the chilled pie. Sprinkle with toasted coconut and serve.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '' },
      { key: 'filling', label: 'Coconut pastry cream', cookingMethod: '' },
      { key: 'topping', label: 'Whipped cream topping', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SWEET_015',
    name: 'Egg Custard Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 15,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":319.9,"pro":8.1,"fat":13.8,"carb":40.6,"fib":0.7,"h2o":88.7,"sug":22.9,"perServing":{"cal":319.9,"pro":8.1,"fat":13.8,"carb":40.6,"fib":0.7,"h2o":88.7,"sug":22.9,"AddedSugars":18.7,"IntrinsicSugars":4.2},"micros":{"vitaminA":82.19,"vitaminC":0.0,"vitaminD":36.88,"vitaminE":0.34,"vitaminK":0.7,"vitaminB6":0.04,"vitaminB12":0.34,"thiamin":0.11,"riboflavin":0.22,"niacin":0.82,"folate":30.76,"calcium":69.92,"iron":1.02,"magnesium":10.66,"phosphorus":92.58,"potassium":107.85,"sodium":188.55,"zinc":0.51,"copper":0.05,"selenium":12.2,"cholesterol":80.74,"saturatedFat":4.99,"monoFat":2.51,"polyFat":0.54,"omega3":0.03,"omega6":0.34},"gramsPerServing":153.0,"servings":8,"per100g":{"Energy_KCal":209.09,"Water":57.99,"Protein":5.27,"TotalLipidFat":8.99,"Carbohydrate":26.57,"FiberTotalDietary":0.42,"SugarsTotal":14.94,"Cholesterol":80.74,"FattyAcids_totalSaturated":4.99,"FattyAcids_totalMonounsaturated":2.51,"FattyAcids_totalPolyunsaturated":0.54,"LinoleicAcid":0.34,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":82.19,"Retinol":80.99,"Carotene_beta":11.72,"VitaminD":36.88,"VitaminE_alphaTocopherol":0.34,"VitaminK_phylloquinone":0.7,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.11,"Riboflavin":0.22,"Niacin":0.82,"PantothenicAcid":0.43,"VitaminB6":0.04,"Folate_total":30.76,"Folate_food":11.89,"Folate_DFE":44.0,"FolicAcid":23.59,"VitaminB12":0.34,"Choline_total":50.81,"Betaine":0.35,"LuteinZeaxanthin":66.01,"Lycopene":0.0,"Calcium_Ca":69.92,"Iron_Fe":1.02,"Magnesium_Mg":10.66,"Phosphorus_P":92.58,"Potassium_K":107.85,"Sodium_Na":188.55,"Zinc_Zn":0.51,"Copper_Cu":0.05,"Manganese_Mn":0.11,"Selenium_Se":12.2,"Tryptophan":0.07,"Threonine":0.2,"Isoleucine":0.25,"Leucine":0.44,"Lysine":0.32,"Methionine":0.13,"Cystine":0.07,"Phenylalanine":0.27,"Tyrosine":0.21,"Valine":0.3,"Arginine":0.24,"Histidine":0.13,"Alanine":0.22,"AsparticAcid":0.42,"GlutamicAcid":1.17,"Glycine":0.16,"Proline":0.43,"Serine":0.33,"omega3":0.03,"omega6":0.34,"AddedSugars":12.23,"IntrinsicSugars":2.71},"addedSugars":18.7,"intrinsicSugars":4.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18317","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.92,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":10.7},{"ndb":"14411","name":"Water, tap, drinking","grams":5.6},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":25.0},{"ndb":"19335","name":"Sugars, granulated","grams":18.8},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.1},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":76.2},{"ndb":"2050","name":"Vanilla extract","grams":1.1}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8691432012308246,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":320.14,"raw_water_grams":82.03,"raw_fat_grams":70.94,"final_grams":309.4},{"section_key":"filling","section_label":"Egg custard filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9193990639077321,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":970.45,"raw_water_grams":694.38,"raw_fat_grams":39.05,"final_grams":914.48}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Pie, egg custard, commercially prepared', quantity: 'custom (g)', foodWord: 'PIEEGGCUSTARD', ndbNo: '18317', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'cold unsalted butter, cubed', quantity: '6 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 85.2 },
      { name: 'ice water (more as needed)', quantity: '3 tablespoons', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 44.4375 },
      { name: 'large eggs', quantity: '4 large eggs', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'sugar', quantity: '3/4 cup', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'ground nutmeg, plus more for sprinkling', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.55 },
      { name: 'whole milk, scalded', quantity: '2 1/2 cups', section: 'filling', ndbNo: '1077', portionDesc: 'g', portionGrams: 610.0 },
      { name: 'vanilla extract', quantity: '2 teaspoons', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 8.4 }
    ],
    recipeInstructions: [
      'For the crust, whisk the flour and salt together. Cut in the cold butter until the mixture resembles coarse crumbs with pea-sized pieces. Sprinkle the ice water over and stir gently with a fork until the dough just comes together.',
      'Shape into a disk, wrap, and chill for at least 30 minutes. Roll out to a 12-inch round, transfer to a 9-inch pie plate, trim, and crimp the edges. Prick the bottom with a fork and chill for another 15 minutes.',
      'Preheat the oven to 400 degrees F (205 degrees C). Line the chilled shell with parchment and fill with pie weights. Bake for 12 minutes, then remove the weights and parchment and bake another 5-7 minutes, until the bottom looks dry and just set (the crust should not be fully browned). Remove and lower the oven to 325 degrees F (165 degrees C).',
      'For the filling, whisk the eggs in a large bowl until smooth. Whisk in the sugar, salt, and nutmeg.',
      'Heat the milk in a saucepan over medium heat just until steaming and small bubbles appear at the edges (do not boil). Slowly pour the hot milk into the egg mixture in a thin stream, whisking constantly. Stir in the vanilla.',
      'Place the par-baked crust on a rimmed baking sheet near the oven. Pour the custard through a fine-mesh strainer into the crust to remove any cooked egg bits and foam.',
      'Sprinkle a little more nutmeg over the top. Carefully transfer to the oven and bake at 325 degrees F (165 degrees C) for 35-45 minutes, until the edges are set and puffed and the center jiggles only slightly when nudged (a knife inserted 1 inch from the edge should come out clean).',
      'Cool the pie completely on a rack, then refrigerate for at least 2 hours before slicing. Serve cold.'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '' },
      { key: 'filling', label: 'Egg custard filling', cookingMethod: '' }
    ],
  },
  {
    id: 'SWEET_016',
    name: 'White Cake (No Frosting)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 16,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '12 slices',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":305.2,"pro":4.8,"fat":10.4,"carb":48.4,"fib":0.6,"h2o":20.7,"sug":30.3,"perServing":{"cal":305.2,"pro":4.8,"fat":10.4,"carb":48.4,"fib":0.6,"h2o":20.7,"sug":30.3,"AddedSugars":29.1,"IntrinsicSugars":1.2},"micros":{"vitaminA":8.09,"vitaminC":0.0,"vitaminD":10.02,"vitaminE":0.65,"vitaminK":4.7,"vitaminB6":0.01,"vitaminB12":0.1,"thiamin":0.17,"riboflavin":0.24,"niacin":1.4,"folate":41.34,"calcium":127.8,"iron":1.46,"magnesium":10.8,"phosphorus":182.37,"potassium":89.72,"sodium":288.1,"zinc":0.28,"copper":0.05,"selenium":14.05,"cholesterol":2.07,"saturatedFat":3.22,"monoFat":4.9,"polyFat":2.45,"omega3":0.0,"omega6":0.0},"gramsPerServing":86.0,"servings":12,"per100g":{"Energy_KCal":354.85,"Water":24.04,"Protein":5.56,"TotalLipidFat":12.15,"Carbohydrate":56.27,"FiberTotalDietary":0.74,"SugarsTotal":35.21,"Cholesterol":2.07,"FattyAcids_totalSaturated":3.22,"FattyAcids_totalMonounsaturated":4.9,"FattyAcids_totalPolyunsaturated":2.45,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":8.09,"Retinol":7.91,"Carotene_beta":1.38,"VitaminD":10.02,"VitaminE_alphaTocopherol":0.65,"VitaminK_phylloquinone":4.7,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.17,"Riboflavin":0.24,"Niacin":1.4,"PantothenicAcid":0.2,"VitaminB6":0.01,"Folate_total":41.34,"Folate_food":7.76,"Folate_DFE":64.89,"FolicAcid":41.97,"VitaminB12":0.1,"Choline_total":2.87,"Betaine":0.18,"LuteinZeaxanthin":15.07,"Lycopene":0.0,"Calcium_Ca":127.8,"Iron_Fe":1.46,"Magnesium_Mg":10.8,"Phosphorus_P":182.37,"Potassium_K":89.72,"Sodium_Na":288.1,"Zinc_Zn":0.28,"Copper_Cu":0.05,"Manganese_Mn":0.19,"Selenium_Se":14.05,"Tryptophan":0.06,"Threonine":0.19,"Isoleucine":0.26,"Leucine":0.45,"Lysine":0.27,"Methionine":0.14,"Cystine":0.1,"Phenylalanine":0.31,"Tyrosine":0.2,"Valine":0.31,"Arginine":0.25,"Histidine":0.14,"Alanine":0.24,"AsparticAcid":0.41,"GlutamicAcid":1.39,"Glycine":0.19,"Proline":0.47,"Serine":0.33,"omega3":0.0,"omega6":0.0,"AddedSugars":33.85,"IntrinsicSugars":1.36},"addedSugars":29.1,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18139","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.62,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":1.2},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":9.6},{"ndb":"19335","name":"Sugars, granulated","grams":29.2},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":17.8},{"ndb":"2050","name":"Vanilla extract","grams":0.7},{"ndb":"1124","name":"Egg, white, raw, fresh","grams":16.5}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"mixed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.62,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":1184.0,"raw_water_grams":400.12,"raw_fat_grams":125.34,"final_grams":1031.96}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, white, prepared from recipe without frosting', quantity: 'custom (g)', foodWord: 'CAKEWHITE', ndbNo: '18139', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour, sifted', quantity: '2 1/4 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'baking powder', quantity: '1 tablespoon', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 13.8 },
      { name: 'salt', quantity: '5/8 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.75 },
      { name: 'vegetable shortening, room temperature', quantity: '1/2 cup + 1 tablespoon', section: 'cake', ndbNo: '4031', portionDesc: 'g', portionGrams: 115.3 },
      { name: 'sugar', quantity: '1 3/4 cups', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 350.0 },
      { name: 'whole milk, room temperature', quantity: '7/8 cup', section: 'cake', ndbNo: '1077', portionDesc: 'g', portionGrams: 213.5 },
      { name: 'pure vanilla extract', quantity: '2 teaspoons', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'egg whites, room temperature', quantity: '6 large whites', section: 'cake', ndbNo: '1124', portionDesc: 'g', portionGrams: 198.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350 degrees F (175 degrees C). Grease a 9x13-inch baking pan or two 9-inch round pans, then dust with flour (or line with parchment).',
      'Sift together the cake flour, baking powder, and salt into a medium bowl and set aside.',
      'In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the shortening and sugar together on medium-high speed until light and creamy, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed.',
      'Slowly add the egg whites until incorporated, then beat on high speed until smooth and well combined, about 2 minutes. Scrape down the bowl again.',
      'Add the vanilla and beat on medium-high until incorporated, about 1 minute.',
      'Add all of the sifted dry ingredients to the bowl. With the mixer running on low speed, slowly pour in the milk and beat just until the batter comes together. Do not overmix. Overmixing will cause gluten to form causing a dense bread-like cake. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl. The batter will be smooth and slightly thick.',
      'Divide the batter evenly between the prepared pan(s) and smooth the top. Tap the pan gently on the counter once or twice to release any large air bubbles.',
      'Bake until the top springs back when lightly pressed and a toothpick inserted in the center comes out clean: about 30-35 minutes for a 9x13 pan, or 22-26 minutes for 9-inch rounds.',
      'Cool in the pan(s) on a rack for 10 minutes, then turn out onto the rack and cool completely before slicing or frosting.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.62 }
    ],
  },
  {
    id: 'SWEET_017',
    name: 'White Cake with Coconut Frosting',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 17,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '12 slices',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":481.7,"pro":6.1,"fat":13.9,"carb":84.4,"fib":1.9,"h2o":28.6,"sug":64.2,"perServing":{"cal":481.7,"pro":6.1,"fat":13.9,"carb":84.4,"fib":1.9,"h2o":28.6,"sug":64.2,"AddedSugars":62.8,"IntrinsicSugars":1.5},"micros":{"vitaminA":5.14,"vitaminC":0.06,"vitaminD":6.37,"vitaminE":0.41,"vitaminK":2.99,"vitaminB6":0.01,"vitaminB12":0.07,"thiamin":0.11,"riboflavin":0.18,"niacin":0.94,"folate":26.71,"calcium":83.69,"iron":1.06,"magnesium":12.14,"phosphorus":125.29,"potassium":114.15,"sodium":248.86,"zinc":0.24,"copper":0.06,"selenium":11.65,"cholesterol":1.31,"saturatedFat":4.46,"monoFat":3.24,"polyFat":1.58,"omega3":0.0,"omega6":0.02},"gramsPerServing":135.3,"servings":12,"per100g":{"Energy_KCal":355.96,"Water":21.1,"Protein":4.52,"TotalLipidFat":10.29,"Carbohydrate":62.37,"FiberTotalDietary":1.43,"SugarsTotal":47.46,"Cholesterol":1.31,"FattyAcids_totalSaturated":4.46,"FattyAcids_totalMonounsaturated":3.24,"FattyAcids_totalPolyunsaturated":1.58,"LinoleicAcid":0.02,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":5.14,"Retinol":5.03,"Carotene_beta":0.87,"VitaminD":6.37,"VitaminE_alphaTocopherol":0.41,"VitaminK_phylloquinone":2.99,"VitaminC_totalAscorbicAcid":0.06,"Thiamin":0.11,"Riboflavin":0.18,"Niacin":0.94,"PantothenicAcid":0.14,"VitaminB6":0.01,"Folate_total":26.71,"Folate_food":5.37,"Folate_DFE":41.67,"FolicAcid":26.67,"VitaminB12":0.07,"Choline_total":3.42,"Betaine":0.25,"LuteinZeaxanthin":9.58,"Lycopene":0.0,"Calcium_Ca":83.69,"Iron_Fe":1.06,"Magnesium_Mg":12.14,"Phosphorus_P":125.29,"Potassium_K":114.15,"Sodium_Na":248.86,"Zinc_Zn":0.24,"Copper_Cu":0.06,"Manganese_Mn":0.21,"Selenium_Se":11.65,"Tryptophan":0.05,"Threonine":0.15,"Isoleucine":0.21,"Leucine":0.36,"Lysine":0.23,"Methionine":0.12,"Cystine":0.08,"Phenylalanine":0.25,"Tyrosine":0.16,"Valine":0.26,"Arginine":0.25,"Histidine":0.11,"Alanine":0.21,"AsparticAcid":0.37,"GlutamicAcid":1.05,"Glycine":0.16,"Proline":0.34,"Serine":0.28,"omega3":0.0,"omega6":0.02,"AddedSugars":46.37,"IntrinsicSugars":1.08},"addedSugars":62.8,"intrinsicSugars":1.5,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18102","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.58,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":1.2},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":9.6},{"ndb":"19335","name":"Sugars, granulated","grams":29.2},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":17.8},{"ndb":"2050","name":"Vanilla extract","grams":0.7},{"ndb":"1124","name":"Egg, white, raw, fresh","grams":16.5},{"ndb":"1124","name":"Egg, white, raw, fresh","grams":8.2},{"ndb":"19335","name":"Sugars, granulated","grams":29.2},{"ndb":"12119","name":"Nuts, coconut water","grams":6.7},{"ndb":"18373","name":"Leavening agents, cream of tartar","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"2050","name":"Vanilla extract","grams":0.2},{"ndb":"12109","name":"Nuts, coconut meat, dried, sweetened, flaked","grams":12.3}],"sections":[{"section_key":"cake","section_label":"White butter cake (SWEET_016 base)","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.62,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":1184.0,"raw_water_grams":400.12,"raw_fat_grams":125.34,"final_grams":1031.96},{"section_key":"frosting","section_label":"7-minute coconut frosting","prep_method":"raw","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.5,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":686.3,"raw_water_grams":188.98,"raw_fat_grams":41.76,"final_grams":591.81}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Cake, white, prepared from recipe with coconut frosting', quantity: 'custom (g)', foodWord: 'CAKEWHITECOCONUTFROSTING', ndbNo: '18102', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'sifted all-purpose flour', quantity: '2 1/4 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'baking powder', quantity: '1 tablespoon', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 13.8 },
      { name: 'salt', quantity: '5/8 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.75 },
      { name: 'room temperature', quantity: '1/2 cup + 1 tablespoon', section: 'cake', ndbNo: '4031', portionDesc: 'g', portionGrams: 115.3 },
      { name: 'sugar', quantity: '1 3/4 cups', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 350.0 },
      { name: 'room temperature', quantity: '7/8 cup', section: 'cake', ndbNo: '1077', portionDesc: 'g', portionGrams: 213.5 },
      { name: 'pure vanilla extract', quantity: '2 teaspoons', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'room temperature', quantity: '6 large whites', section: 'cake', ndbNo: '1124', portionDesc: 'g', portionGrams: 198.0 },
      { name: 'room temperature', quantity: '3 large whites', section: 'frosting', ndbNo: '1124', portionDesc: 'g', portionGrams: 99.0 },
      { name: 'sugar', quantity: '1 3/4 cups', section: 'frosting', ndbNo: '19335', portionDesc: 'g', portionGrams: 350.0 },
      { name: 'coconut water', quantity: '1/3 cup', section: 'frosting', ndbNo: '12119', portionDesc: 'g', portionGrams: 80.0 },
      { name: 'cream of tartar', quantity: '1/2 teaspoon', section: 'frosting', ndbNo: '18373', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'frosting', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'coconut-flavored extract', quantity: '1 teaspoon', section: 'frosting', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'pure vanilla extract', quantity: '1/2 teaspoon', section: 'frosting', ndbNo: '2050', portionDesc: 'g', portionGrams: 2.1 },
      { name: 'sweetened flaked coconut', quantity: '2 cups', section: 'frosting', ndbNo: '12109', portionDesc: 'g', portionGrams: 148.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350 degrees F (175 degrees C). Grease two 9-inch round cake pans, then dust with flour or line the bottoms with parchment.',
      'Sift together the flour, baking powder, and salt into a medium bowl and set aside.',
      'In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the shortening and sugar together on medium-high speed until light and creamy, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed.',
      'Slowly add the egg whites until incorporated, then beat on high speed until smooth and well combined, about 2 minutes. Scrape down the bowl again.',
      'Add the vanilla and beat on medium-high until incorporated, about 1 minute.',
      'Add all of the sifted dry ingredients to the bowl. With the mixer running on low speed, slowly pour in the milk and beat just until the batter comes together. Do not overmix. Overmixing will cause gluten to form causing a dense bread-like cake. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl. The batter will be smooth and slightly thick.',
      'Divide the batter evenly between the prepared pans and smooth the top. Tap the pans gently on the counter once or twice to release any large air bubbles.',
      'Bake until the tops spring back when lightly pressed and a toothpick inserted in the center comes out clean, about 22-26 minutes.',
      'Cool in the pans on a rack for 10 minutes, then turn the layers out onto the rack and cool completely before frosting.',
      '--- Seven-Minute Coconut Frosting ---',
      'Place the top part of the double boiler or heatproof bowl over rapidly boiling water, ensuring the bottom pan\'s water stays at a steady boil and the water does not touch the top container.',
      'In the top part (off the heat), combine the egg whites, sugar, water, corn syrup, and salt and beat with a handheld electric mixer until thoroughly mixed.',
      'Place the top part over the rapidly boiling water and beat constantly on high speed for 7 minutes, until the frosting is bright white, glossy, and stands in stiff peaks. (The corn syrup acts as the stabilizer here, so cream of tartar is not needed.)',
      'Remove from heat and quickly beat in the vanilla extract.',
      'Fold in about 1 cup of the flaked coconut with a rubber spatula, beating briefly until the frosting is thick enough to spread.',
      'Place one cooled cake layer on a serving plate or cake board. Spread about a quarter of the frosting over the top. Add the second layer and frost the top and sides with the remaining frosting in soft swoops.',
      'Press the remaining flaked coconut all over the top and sides of the frosted cake while the frosting is still tacky. Let the cake set for at least 30 minutes before slicing. Seven-minute frosting is best the day it is made.'
    ],
    sections: [
      { key: 'cake', label: 'White butter cake (SWEET_016 base)', cookingMethod: '', yieldFactorWater: 0.62 },
      { key: 'frosting', label: '7-minute coconut frosting', cookingMethod: '', yieldFactorWater: 0.5 }
    ],
  },
  {
    id: 'SWEET_018',
    name: 'Yellow Cake (No Frosting)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 18,
    recipe: ['butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'raccoon', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 5, chicken: 0, fish: 0 },
    servings: '12 slices',
    prepTime: '25 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":273.3,"pro":4.0,"fat":11.0,"carb":39.9,"fib":0.6,"h2o":17.9,"sug":21.6,"perServing":{"cal":273.3,"pro":4.0,"fat":11.0,"carb":39.9,"fib":0.6,"h2o":17.9,"sug":21.6,"AddedSugars":20.8,"IntrinsicSugars":0.8},"micros":{"vitaminA":65.69,"vitaminC":0.0,"vitaminD":21.56,"vitaminE":0.7,"vitaminK":3.55,"vitaminB6":0.03,"vitaminB12":0.21,"thiamin":0.21,"riboflavin":0.23,"niacin":1.69,"folate":53.86,"calcium":112.17,"iron":2.14,"magnesium":10.2,"phosphorus":180.85,"potassium":78.38,"sodium":303.96,"zinc":0.48,"copper":0.06,"selenium":13.09,"cholesterol":78.06,"saturatedFat":5.94,"monoFat":5.23,"polyFat":2.02,"omega3":0.03,"omega6":0.26},"gramsPerServing":74.2,"servings":12,"per100g":{"Energy_KCal":368.46,"Water":24.18,"Protein":5.39,"TotalLipidFat":14.84,"Carbohydrate":53.74,"FiberTotalDietary":0.75,"SugarsTotal":29.18,"Cholesterol":78.06,"FattyAcids_totalSaturated":5.94,"FattyAcids_totalMonounsaturated":5.23,"FattyAcids_totalPolyunsaturated":2.02,"LinoleicAcid":0.26,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":65.69,"Retinol":64.66,"Carotene_beta":10.6,"VitaminD":21.56,"VitaminE_alphaTocopherol":0.7,"VitaminK_phylloquinone":3.55,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.21,"Riboflavin":0.23,"Niacin":1.69,"PantothenicAcid":0.38,"VitaminB6":0.03,"Folate_total":53.86,"Folate_food":16.19,"Folate_DFE":80.15,"FolicAcid":46.98,"VitaminB12":0.21,"Choline_total":48.24,"Betaine":0.16,"LuteinZeaxanthin":66.06,"Lycopene":0.0,"Calcium_Ca":112.17,"Iron_Fe":2.14,"Magnesium_Mg":10.2,"Phosphorus_P":180.85,"Potassium_K":78.38,"Sodium_Na":303.96,"Zinc_Zn":0.48,"Copper_Cu":0.06,"Manganese_Mn":0.22,"Selenium_Se":13.09,"Tryptophan":0.07,"Threonine":0.18,"Isoleucine":0.23,"Leucine":0.41,"Lysine":0.25,"Methionine":0.12,"Cystine":0.09,"Phenylalanine":0.27,"Tyrosine":0.19,"Valine":0.28,"Arginine":0.25,"Histidine":0.12,"Alanine":0.21,"AsparticAcid":0.36,"GlutamicAcid":1.38,"Glycine":0.18,"Proline":0.48,"Serine":0.32,"omega3":0.03,"omega6":0.26,"AddedSugars":28.03,"IntrinsicSugars":1.14},"addedSugars":20.8,"intrinsicSugars":0.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18146","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.78,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":15.6},{"ndb":"20084","name":"Wheat flour, white, cake, enriched","grams":7.8},{"ndb":"19335","name":"Sugars, granulated","grams":20.8},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.8},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":4.7},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":5.3},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":13.6},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":8.3},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":1.4}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"mixed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.78,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":11,"raw_grams":950.67,"raw_water_grams":275.85,"raw_fat_grams":132.04,"final_grams":889.98}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, yellow, prepared from recipe without frosting', quantity: 'custom (g)', foodWord: 'CAKEYELLOW', ndbNo: '18146', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour, sifted', quantity: '1 1/2 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'sifted cake flour', quantity: '3/4 cup', section: 'cake', ndbNo: '20084', portionDesc: 'g', portionGrams: 93.75 },
      { name: 'granulated sugar', quantity: '1 1/4 cups', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'baking powder', quantity: '2 teaspoons', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'unsalted butter, soft', quantity: '1/4 cup', section: 'cake', ndbNo: '1145', portionDesc: 'g', portionGrams: 56.75 },
      { name: 'vegetable shortening, soft', quantity: '1/4 cup + 1 tablespoon', section: 'cake', ndbNo: '4031', portionDesc: 'g', portionGrams: 64.05 },
      { name: 'whole milk', quantity: '2/3 cup', section: 'cake', ndbNo: '1077', portionDesc: 'g', portionGrams: 162.6667 },
      { name: 'pure vanilla extract', quantity: '1 1/4 teaspoons', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 5.25 },
      { name: 'large eggs, unbeaten', quantity: '2 large', section: 'cake', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'extra yolk for richness', quantity: '1 large yolk', section: 'cake', ndbNo: '1125', portionDesc: 'g', portionGrams: 17.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350 degrees F (175 degrees C). Grease two 9-inch round cake pans, then dust with flour or line the bottoms with parchment.',
      'Sift together the all-purpose flour, cake flour, baking powder, and salt into a medium bowl and set aside.',
      'In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the butter, shortening, and sugar together on medium-high speed until light and fluffy, about 4 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed.',
      'Add the eggs one at a time, beating well after each addition, then beat on high speed for 1 minute until smooth and well combined. Scrape down the bowl again.',
      'Add the vanilla and beat on medium-high until incorporated, about 30 seconds.',
      'Add about a third of the sifted dry ingredients to the bowl, followed by half of the milk, and beat on low until just combined. Repeat with another third of the dry ingredients and the rest of the milk, then finish with the remaining dry ingredients. Do not overmix. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl.',
      'Divide the batter evenly between the prepared pans and smooth the top. Tap the pans gently on the counter once or twice to release any large air bubbles.',
      'Bake until the tops are golden, spring back when lightly pressed, and a toothpick inserted in the center comes out clean, about 25-30 minutes.',
      'Cool in the pans on a rack for 10 minutes, then turn the layers out onto the rack and cool completely before slicing.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.78 }
    ],
  },
  {
    id: 'SWEET_019',
    name: 'Chocolate Glaze with Butter',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 19,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '16 tablespoons',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":147.0,"pro":0.5,"fat":8.0,"carb":19.9,"fib":0.4,"h2o":5.2,"sug":19.0,"perServing":{"cal":147.0,"pro":0.5,"fat":8.0,"carb":19.9,"fib":0.4,"h2o":5.2,"sug":19.0,"AddedSugars":18.8,"IntrinsicSugars":0.2},"micros":{"vitaminA":148.87,"vitaminC":0.0,"vitaminD":5.75,"vitaminE":0.55,"vitaminK":2.67,"vitaminB6":0.01,"vitaminB12":0.09,"thiamin":0.02,"riboflavin":0.05,"niacin":0.11,"folate":3.91,"calcium":25.51,"iron":0.69,"magnesium":25.71,"phosphorus":42.14,"potassium":98.23,"sodium":12.89,"zinc":0.42,"copper":0.15,"selenium":1.79,"cholesterol":46.29,"saturatedFat":14.52,"monoFat":7.09,"polyFat":0.85,"omega3":0.07,"omega6":0.45},"gramsPerServing":33.8,"servings":16,"per100g":{"Energy_KCal":434.82,"Water":15.29,"Protein":1.41,"TotalLipidFat":23.68,"Carbohydrate":59.01,"FiberTotalDietary":1.23,"SugarsTotal":56.25,"Cholesterol":46.29,"FattyAcids_totalSaturated":14.52,"FattyAcids_totalMonounsaturated":7.09,"FattyAcids_totalPolyunsaturated":0.85,"LinoleicAcid":0.45,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":148.87,"Retinol":146.03,"Carotene_beta":33.98,"VitaminD":5.75,"VitaminE_alphaTocopherol":0.55,"VitaminK_phylloquinone":2.67,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.02,"Riboflavin":0.05,"Niacin":0.11,"PantothenicAcid":0.09,"VitaminB6":0.01,"Folate_total":3.91,"Folate_food":3.91,"Folate_DFE":3.91,"FolicAcid":0.0,"VitaminB12":0.09,"Choline_total":10.16,"Betaine":0.07,"LuteinZeaxanthin":3.76,"Lycopene":0.0,"Calcium_Ca":25.51,"Iron_Fe":0.69,"Magnesium_Mg":25.71,"Phosphorus_P":42.14,"Potassium_K":98.23,"Sodium_Na":12.89,"Zinc_Zn":0.42,"Copper_Cu":0.15,"Manganese_Mn":0.17,"Selenium_Se":1.79,"Tryptophan":0.02,"Threonine":0.05,"Isoleucine":0.06,"Leucine":0.1,"Lysine":0.09,"Methionine":0.02,"Cystine":0.01,"Phenylalanine":0.07,"Tyrosine":0.06,"Valine":0.09,"Arginine":0.07,"Histidine":0.03,"Alanine":0.06,"AsparticAcid":0.13,"GlutamicAcid":0.25,"Glycine":0.05,"Proline":0.09,"Serine":0.07,"omega3":0.07,"omega6":0.45,"AddedSugars":55.57,"IntrinsicSugars":0.68},"addedSugars":18.8,"intrinsicSugars":0.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"19409","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":7.1},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":3.8},{"ndb":"19350","name":"Syrups, corn, light","grams":1.4},{"ndb":"2050","name":"Vanilla extract","grams":0.3},{"ndb":"19080","name":"Candies, semisweet chocolate","grams":7.1},{"ndb":"19336","name":"Sugars, powdered","grams":14.2}],"sections":[{"section_key":"glaze","section_label":"Chocolate glaze","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":540.8,"raw_water_grams":82.68,"raw_fat_grams":128.07,"final_grams":540.8}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Frostings, glaze, chocolate, prepared-from-recipe, with butter, NFSMI Recipe No. C-32', quantity: 'custom (g)', foodWord: 'FROSTING', ndbNo: '19409', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter', quantity: '8 tablespoons', section: 'glaze', ndbNo: '1145', portionDesc: 'g', portionGrams: 113.6 },
      { name: 'whole milk', quantity: '1/4 cup', section: 'glaze', ndbNo: '1077', portionDesc: 'g', portionGrams: 61.0 },
      { name: 'light corn syrup', quantity: '1 tablespoon', section: 'glaze', ndbNo: '19350', portionDesc: 'g', portionGrams: 22.0 },
      { name: 'pure vanilla extract', quantity: '1 teaspoon', section: 'glaze', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'semisweet chocolate, finely chopped', quantity: '4 ounces', section: 'glaze', ndbNo: '19080', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'powdered sugar', quantity: '2 cups', section: 'glaze', ndbNo: '19336', portionDesc: 'g', portionGrams: 227.0 }
    ],
    recipeInstructions: [
      'Combine the butter, milk, and corn syrup in a small saucepan over medium heat. Stir until the butter is melted and the mixture just comes to a simmer. Add chopped chocolate whisking until melted.',
      'Remove from heat. Let sit 1 minute, then whisk until completely smooth. Whisk in the vanilla extract, then sift in the powdered sugar and whisk until glossy and pourable. If too thick, add milk a teaspoon at a time.',
      'Pour or drizzle over a fully cooled cake. Let set 10–15 minutes before slicing.'
    ],
    sections: [
      { key: 'glaze', label: 'Chocolate glaze', cookingMethod: '' }
    ],
  },
  {
    id: 'SWEET_020',
    name: 'Yellow Cake with Chocolate Glaze',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 20,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '12 slices',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":559.5,"pro":6.9,"fat":22.9,"carb":85.0,"fib":2.5,"h2o":37.6,"sug":60.2,"perServing":{"cal":559.5,"pro":6.9,"fat":22.9,"carb":85.0,"fib":2.5,"h2o":37.6,"sug":60.2,"AddedSugars":58.5,"IntrinsicSugars":1.8},"micros":{"vitaminA":119.05,"vitaminC":0.0,"vitaminD":18.79,"vitaminE":0.48,"vitaminK":1.25,"vitaminB6":0.03,"vitaminB12":0.2,"thiamin":0.12,"riboflavin":0.17,"niacin":0.99,"folate":33.52,"calcium":83.32,"iron":1.55,"magnesium":22.79,"phosphorus":144.9,"potassium":108.62,"sodium":253.24,"zinc":0.57,"copper":0.16,"selenium":11.04,"cholesterol":84.47,"saturatedFat":8.73,"monoFat":4.24,"polyFat":0.69,"omega3":0.04,"omega6":0.4},"gramsPerServing":155.1,"servings":12,"per100g":{"Energy_KCal":360.78,"Water":24.22,"Protein":4.45,"TotalLipidFat":14.79,"Carbohydrate":54.8,"FiberTotalDietary":1.62,"SugarsTotal":38.82,"Cholesterol":84.47,"FattyAcids_totalSaturated":8.73,"FattyAcids_totalMonounsaturated":4.24,"FattyAcids_totalPolyunsaturated":0.69,"LinoleicAcid":0.4,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":119.05,"Retinol":116.93,"Carotene_beta":23.67,"VitaminD":18.79,"VitaminE_alphaTocopherol":0.48,"VitaminK_phylloquinone":1.25,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.12,"Riboflavin":0.17,"Niacin":0.99,"PantothenicAcid":0.3,"VitaminB6":0.03,"Folate_total":33.52,"Folate_food":11.45,"Folate_DFE":48.99,"FolicAcid":27.58,"VitaminB12":0.2,"Choline_total":40.22,"Betaine":0.07,"LuteinZeaxanthin":53.44,"Lycopene":0.0,"Calcium_Ca":83.32,"Iron_Fe":1.55,"Magnesium_Mg":22.79,"Phosphorus_P":144.9,"Potassium_K":108.62,"Sodium_Na":253.24,"Zinc_Zn":0.57,"Copper_Cu":0.16,"Manganese_Mn":0.25,"Selenium_Se":11.04,"Tryptophan":0.05,"Threonine":0.16,"Isoleucine":0.19,"Leucine":0.34,"Lysine":0.22,"Methionine":0.09,"Cystine":0.07,"Phenylalanine":0.22,"Tyrosine":0.16,"Valine":0.24,"Arginine":0.21,"Histidine":0.1,"Alanine":0.18,"AsparticAcid":0.33,"GlutamicAcid":1.03,"Glycine":0.15,"Proline":0.36,"Serine":0.26,"omega3":0.04,"omega6":0.4,"AddedSugars":37.69,"IntrinsicSugars":1.13},"addedSugars":58.5,"intrinsicSugars":1.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18140","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.83,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":27.8},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.1},{"ndb":"19335","name":"Sugars, granulated","grams":29.2},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":1.0},{"ndb":"2047","name":"Salt, table","grams":0.5},{"ndb":"1145","name":"Butter, without salt","grams":14.2},{"ndb":"1230","name":"Milk, buttermilk, fluid, whole","grams":20.4},{"ndb":"2050","name":"Vanilla extract","grams":1.1},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":12.5},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":2.8},{"ndb":"19336","name":"Sugars, powdered","grams":30.0},{"ndb":"19165","name":"Cocoa, dry powder, unsweetened","grams":4.8},{"ndb":"1145","name":"Butter, without salt","grams":9.5},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":6.8},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"2047","name":"Salt, table","grams":0.1}],"sections":[{"section_key":"cake","section_label":"Butter-buttermilk yellow cake","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.8328650569062638,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":1314.23,"raw_water_grams":425.05,"raw_fat_grams":172.76,"final_grams":1243.19},{"section_key":"frosting","section_label":"Bittersweet chocolate glaze","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":617.87,"raw_water_grams":96.8,"raw_fat_grams":102.56,"final_grams":617.87}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Cake, yellow, commercially prepared, with chocolate frosting, in-store bakery', quantity: 'custom (g)', foodWord: 'CAKEYELLOWCHOCOLATEFROSTING', ndbNo: '18140', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour, sifted', quantity: '2 2/3 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 333.3333 },
      { name: 'baking soda', quantity: '1/4 teaspoon', section: 'cake', ndbNo: '18372', portionDesc: 'g', portionGrams: 1.15 },
      { name: 'granulated sugar', quantity: '1 3/4 cups', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 350.0 },
      { name: 'baking powder', quantity: '2 1/2 teaspoons', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 11.5 },
      { name: 'salt', quantity: '1 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'unsalted butter, soft', quantity: '3/4 cup', section: 'cake', ndbNo: '1145', portionDesc: 'g', portionGrams: 170.25 },
      { name: 'whole buttermilk', quantity: '1 cup', section: 'cake', ndbNo: '1230', portionDesc: 'g', portionGrams: 245.0 },
      { name: 'pure vanilla extract', quantity: '1 tablespoon', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 13.0 },
      { name: 'large eggs, unbeaten', quantity: '3 large', section: 'cake', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'large egg yolks', quantity: '2 large yolks', section: 'cake', ndbNo: '1125', portionDesc: 'g', portionGrams: 34.0 },
      { name: 'powdered sugar', quantity: '3 cups', section: 'frosting', ndbNo: '19336', portionDesc: 'g', portionGrams: 360.0 },
      { name: 'unsweetened cocoa powder', quantity: '2/3 cup', section: 'frosting', ndbNo: '19165', portionDesc: 'g', portionGrams: 57.3333 },
      { name: 'unsalted butter, melted', quantity: '1/2 cup', section: 'frosting', ndbNo: '1145', portionDesc: 'g', portionGrams: 113.5 },
      { name: 'whole milk', quantity: '1/3 cup', section: 'frosting', ndbNo: '1077', portionDesc: 'g', portionGrams: 81.3333 },
      { name: 'boiling water if needed for consistency', quantity: '1-2 tablespoons', section: 'frosting', ndbNo: '14411', portionDesc: 'g', portionGrams: 22.2 },
      { name: 'pure vanilla extract', quantity: '1 teaspoon', section: 'frosting', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'frosting', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350°F (175°C). Grease two 9-inch round cake pans, then dust with flour or line the bottoms with parchment.',
      'Sift together the flour, baking powder, baking soda, and salt into a medium bowl and set aside.',
      'In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the butter and sugar together on medium-high speed until light and fluffy, about 4 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed.',
      'Add the whole eggs one at a time, beating well after each addition. Beat in the yolks, then beat on high speed for 1 minute until smooth and well combined. Scrape down the bowl again.',
      'Add the vanilla and beat on medium-high until incorporated, about 30 seconds.',
      'Add about a third of the sifted dry ingredients to the bowl, followed by half of the buttermilk, and beat on low until just combined. Repeat with another third of the dry ingredients and the rest of the buttermilk, then finish with the remaining dry ingredients. Do not overmix. Finish with a few hand strokes using a whisk or spatula to make sure there are no flour pockets at the bottom of the bowl.',
      'Divide the batter evenly between the prepared pans and smooth the top. Tap the pans gently on the counter once or twice to release any large air bubbles.',
      'Bake until the tops are golden, spring back when lightly pressed, and a toothpick inserted in the center comes out clean, about 25–30 minutes.',
      'Cool in the pans on a rack for 10 minutes, then turn the layers out onto the rack and cool completely before glazing.',
      '--- Chocolate Glaze ---',
      'Sift the powdered sugar and cocoa powder together into a medium bowl.',
      'Whisk in the melted butter, then the milk, vanilla, and salt. Beat until smooth, glossy, and spreadable. If too thick, add boiling water a teaspoon at a time; if too thin, add powdered sugar a tablespoon at a time.',
      'Place one cake layer on a serving plate. Spread about 1/3 of the warm glaze over the top, letting some run down the sides. Top with the second layer.',
      'Pour the remaining glaze over the top of the cake, using an offset spatula to coax it over the edges so it coats the top fully and drips down the sides. Let set 15–20 minutes before slicing.'
    ],
    sections: [
      { key: 'cake', label: 'Butter-buttermilk yellow cake', cookingMethod: '' },
      { key: 'frosting', label: 'Bittersweet chocolate glaze', cookingMethod: '' }
    ],
  },
  {
    id: 'SWEET_021',
    name: 'Gingerbread',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 21,
    recipe: ['butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'raccoon', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 5, chicken: 0, fish: 0 },
    servings: '9 servings',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":381.9,"pro":4.0,"fat":17.4,"carb":53.4,"fib":1.1,"h2o":28.0,"sug":29.0,"perServing":{"cal":381.9,"pro":4.0,"fat":17.4,"carb":53.4,"fib":1.1,"h2o":28.0,"sug":29.0,"AddedSugars":28.9,"IntrinsicSugars":0.1},"micros":{"vitaminA":42.14,"vitaminC":0.01,"vitaminD":4.12,"vitaminE":0.8,"vitaminK":5.16,"vitaminB6":0.15,"vitaminB12":0.05,"thiamin":0.18,"riboflavin":0.16,"niacin":1.74,"folate":45.81,"calcium":74.45,"iron":2.88,"magnesium":73.92,"phosphorus":53.41,"potassium":448.35,"sodium":339.46,"zinc":0.38,"copper":0.18,"selenium":16.8,"cholesterol":32.58,"saturatedFat":5.97,"monoFat":6.14,"polyFat":2.6,"omega3":0.02,"omega6":0.18},"gramsPerServing":105.0,"servings":9,"per100g":{"Energy_KCal":363.54,"Water":26.68,"Protein":3.84,"TotalLipidFat":16.56,"Carbohydrate":50.79,"FiberTotalDietary":1.03,"SugarsTotal":27.59,"Cholesterol":32.58,"FattyAcids_totalSaturated":5.97,"FattyAcids_totalMonounsaturated":6.14,"FattyAcids_totalPolyunsaturated":2.6,"LinoleicAcid":0.18,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":42.14,"Retinol":41.43,"Carotene_beta":8.15,"VitaminD":4.12,"VitaminE_alphaTocopherol":0.8,"VitaminK_phylloquinone":5.16,"VitaminC_totalAscorbicAcid":0.01,"Thiamin":0.18,"Riboflavin":0.16,"Niacin":1.74,"PantothenicAcid":0.38,"VitaminB6":0.15,"Folate_total":45.81,"Folate_food":9.16,"Folate_DFE":71.51,"FolicAcid":45.81,"VitaminB12":0.05,"Choline_total":18.55,"Betaine":0.05,"LuteinZeaxanthin":35.5,"Lycopene":0.04,"Calcium_Ca":74.45,"Iron_Fe":2.88,"Magnesium_Mg":73.92,"Phosphorus_P":53.41,"Potassium_K":448.35,"Sodium_Na":339.46,"Zinc_Zn":0.38,"Copper_Cu":0.18,"Manganese_Mn":0.83,"Selenium_Se":16.8,"Tryptophan":0.05,"Threonine":0.12,"Isoleucine":0.14,"Leucine":0.28,"Lysine":0.12,"Methionine":0.08,"Cystine":0.07,"Phenylalanine":0.19,"Tyrosine":0.12,"Valine":0.17,"Arginine":0.17,"Histidine":0.09,"Alanine":0.14,"AsparticAcid":0.21,"GlutamicAcid":1.13,"Glycine":0.14,"Proline":0.39,"Serine":0.21,"omega3":0.02,"omega6":0.18,"AddedSugars":27.47,"IntrinsicSugars":0.12},"addedSugars":28.9,"intrinsicSugars":0.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18116","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.88,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"1145","name":"Butter, without salt","grams":6.3},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":11.4},{"ndb":"19334","name":"Sugars, brown","grams":8.1},{"ndb":"19304","name":"Molasses","grams":28.1},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":5.6},{"ndb":"14411","name":"Water, tap, drinking","grams":16.5},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.5},{"ndb":"2021","name":"Spices, ginger, ground","grams":0.3},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.3},{"ndb":"2011","name":"Spices, cloves, ground","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.5}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"mixed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.88,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":12,"raw_grams":979.83,"raw_water_grams":286.68,"raw_fat_grams":156.58,"final_grams":945.42}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, gingerbread, prepared from recipe', quantity: 'custom (g)', foodWord: 'CAKEGINGERBREAD', ndbNo: '18116', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour, sifted', quantity: '2 1/4 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'unsalted butter, softened', quantity: '1/4 cup', section: 'cake', ndbNo: '1145', portionDesc: 'g', portionGrams: 56.75 },
      { name: 'vegetable shortening', quantity: '1/2 cup', section: 'cake', ndbNo: '4031', portionDesc: 'g', portionGrams: 102.5 },
      { name: 'packed light brown sugar', quantity: '1/3 cup', section: 'cake', ndbNo: '19334', portionDesc: 'g', portionGrams: 73.0 },
      { name: 'unsulphured molasses', quantity: '3/4 cup', section: 'cake', ndbNo: '19304', portionDesc: 'g', portionGrams: 252.75 },
      { name: 'large egg', quantity: '1 large', section: 'cake', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'hot water', quantity: '5/8 cup', section: 'cake', ndbNo: '14411', portionDesc: 'g', portionGrams: 148.125 },
      { name: 'baking soda', quantity: '1 teaspoon', section: 'cake', ndbNo: '18372', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'ground ginger', quantity: '1 1/2 teaspoons', section: 'cake', ndbNo: '2021', portionDesc: 'g', portionGrams: 2.7 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'cake', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'ground cloves', quantity: '1/2 teaspoon', section: 'cake', ndbNo: '2011', portionDesc: 'g', portionGrams: 1.05 },
      { name: 'salt', quantity: '3/4 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'ginger puree or grated fresh gingerroot (optional)', quantity: '1 tablespoon', section: 'cake', ndbNo: '11216', portionDesc: 'g', portionGrams: 6.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350°F (175°C). Grease a 9-inch square baking pan, then dust with flour or line the bottom with parchment.',
      'In a medium bowl, whisk together the all-purpose flour, baking soda, ginger, cinnamon, cloves, and salt. Set aside.',
      'In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the butter, shortening, and brown sugar together on medium-high speed until well blended and smooth, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed.',
      'Add the molasses (and the optional fresh gingerroot, if using) and beat on medium until fully incorporated, about 1 minute. Add the egg and beat until smooth.',
      'Add about half of the dry ingredients and beat on low until just combined. Pour in the hot water and beat until smooth — the batter will look loose, which is correct. Add the remaining dry ingredients and beat on low until just combined. Do not overmix.',
      'Pour the batter into the prepared pan and smooth the top.',
      'Bake until the top springs back when lightly pressed and a toothpick inserted in the center comes out with just a few moist crumbs, about 35–40 minutes.',
      'Cool in the pan on a wire rack for 15 minutes, then cut into 9 squares. Serve warm or at room temperature.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.88 }
    ],
  },
  {
    id: 'SWEET_022',
    name: 'Pineapple Upside-Down Cake',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 22,
    recipe: ['egg', 'grapes'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'bird', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 0, apple: 0, grapes: 4, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '9 servings',
    prepTime: '25 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":361.1,"pro":4.2,"fat":14.1,"carb":55.6,"fib":0.9,"h2o":38.2,"sug":39.0,"perServing":{"cal":361.1,"pro":4.2,"fat":14.1,"carb":55.6,"fib":0.9,"h2o":38.2,"sug":39.0,"AddedSugars":34.9,"IntrinsicSugars":4.0},"micros":{"vitaminA":42.58,"vitaminC":1.01,"vitaminD":13.35,"vitaminE":0.61,"vitaminK":3.61,"vitaminB6":0.04,"vitaminB12":0.13,"thiamin":0.13,"riboflavin":0.15,"niacin":0.99,"folate":31.89,"calcium":105.31,"iron":1.3,"magnesium":11.18,"phosphorus":140.97,"potassium":94.43,"sodium":293.34,"zinc":0.33,"copper":0.07,"selenium":10.02,"cholesterol":46.37,"saturatedFat":4.52,"monoFat":4.53,"polyFat":1.9,"omega3":0.01,"omega6":0.2},"gramsPerServing":114.0,"servings":9,"per100g":{"Energy_KCal":316.71,"Water":33.49,"Protein":3.64,"TotalLipidFat":12.37,"Carbohydrate":48.8,"FiberTotalDietary":0.83,"SugarsTotal":34.17,"Cholesterol":46.37,"FattyAcids_totalSaturated":4.52,"FattyAcids_totalMonounsaturated":4.53,"FattyAcids_totalPolyunsaturated":1.9,"LinoleicAcid":0.2,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":42.58,"Retinol":41.48,"Carotene_beta":11.26,"VitaminD":13.35,"VitaminE_alphaTocopherol":0.61,"VitaminK_phylloquinone":3.61,"VitaminC_totalAscorbicAcid":1.01,"Thiamin":0.13,"Riboflavin":0.15,"Niacin":0.99,"PantothenicAcid":0.25,"VitaminB6":0.04,"Folate_total":31.89,"Folate_food":9.37,"Folate_DFE":47.67,"FolicAcid":28.14,"VitaminB12":0.13,"Choline_total":29.37,"Betaine":0.11,"LuteinZeaxanthin":45.43,"Lycopene":0.0,"Calcium_Ca":105.31,"Iron_Fe":1.3,"Magnesium_Mg":11.18,"Phosphorus_P":140.97,"Potassium_K":94.43,"Sodium_Na":293.34,"Zinc_Zn":0.33,"Copper_Cu":0.07,"Manganese_Mn":0.14,"Selenium_Se":10.02,"Tryptophan":0.04,"Threonine":0.12,"Isoleucine":0.15,"Leucine":0.27,"Lysine":0.16,"Methionine":0.08,"Cystine":0.06,"Phenylalanine":0.18,"Tyrosine":0.12,"Valine":0.18,"Arginine":0.17,"Histidine":0.08,"Alanine":0.14,"AsparticAcid":0.24,"GlutamicAcid":0.89,"Glycine":0.12,"Proline":0.31,"Serine":0.21,"omega3":0.01,"omega6":0.2,"AddedSugars":30.65,"IntrinsicSugars":3.52},"addedSugars":34.9,"intrinsicSugars":4.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18119","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.86,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":4.7},{"ndb":"19334","name":"Sugars, brown","grams":16.3},{"ndb":"9354","name":"Pineapple, canned, juice pack, drained","grams":22.2},{"ndb":"9328","name":"Maraschino cherries, canned, drained","grams":2.8},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":20.8},{"ndb":"19335","name":"Sugars, granulated","grams":18.1},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":1.0},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":8.5},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":13.6},{"ndb":"2050","name":"Vanilla extract","grams":0.5},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":11.1}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"batter","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.86,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":667.45,"raw_water_grams":208.64,"raw_fat_grams":92.12,"final_grams":638.24},{"section_key":"topping","section_label":"Topping","prep_method":"combined","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.86,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":414.6,"raw_water_grams":190.95,"raw_fat_grams":34.83,"final_grams":387.87}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, pineapple upside-down, prepared from recipe', quantity: 'custom (g)', foodWord: 'CAKEPINEAPPLE', ndbNo: '18119', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter, melted (for the topping)', quantity: '3 tablespoons', section: 'topping', ndbNo: '1145', portionDesc: 'g', portionGrams: 42.6 },
      { name: 'packed light brown sugar', quantity: '2/3 cup', section: 'topping', ndbNo: '19334', portionDesc: 'g', portionGrams: 147.0 },
      { name: 'pineapple slices, drained (reserve juice)', quantity: '5 slices', section: 'topping', ndbNo: '9354', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'maraschino cherries, drained', quantity: '5 cherries', section: 'topping', ndbNo: '9328', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'all-purpose flour, sifted', quantity: '1 1/2 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'granulated sugar', quantity: '3/4 cup + 1 tablespoon', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 162.5 },
      { name: 'baking powder', quantity: '2 teaspoons', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'salt', quantity: '7/8 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 5.25 },
      { name: 'vegetable shortening', quantity: '6 tablespoons', section: 'cake', ndbNo: '4031', portionDesc: 'g', portionGrams: 76.8 },
      { name: 'whole milk', quantity: '1/2 cup', section: 'cake', ndbNo: '1077', portionDesc: 'g', portionGrams: 122.0 },
      { name: 'pure vanilla extract', quantity: '1 teaspoon', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'large egg', quantity: '2 large', section: 'cake', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'ground cinnamon (optional)', quantity: '1/2 teaspoon', section: 'cake', ndbNo: '2010', portionDesc: 'g', portionGrams: 1.3 },
      { name: 'ground cloves (optional)', quantity: '1/4 teaspoon', section: 'cake', ndbNo: '2011', portionDesc: 'g', portionGrams: 0.525 },
      { name: 'ground ginger (optional)', quantity: '1/2 teaspoon', section: 'cake', ndbNo: '2021', portionDesc: 'g', portionGrams: 0.9 }
    ],
    recipeInstructions: [
      'Preheat the oven to 350°F (175°C).',
      'Pour the melted butter into a 9-inch round cake pan or 9-inch cast-iron skillet, tilting to coat the bottom evenly. Sprinkle the brown sugar over the butter in an even layer.',
      'Arrange the drained pineapple slices in a single layer over the brown sugar (one center, the rest around). Place a maraschino cherry in the center of each pineapple slice. Set aside.',
      'In a medium bowl, whisk together the flour, baking powder, salt, and the optional cinnamon, cloves, and ginger if using.',
      'In a large bowl with a handheld mixer or in a stand mixer fitted with the paddle attachment, beat the shortening and granulated sugar together on medium-high speed until light and fluffy, about 3 minutes. Stop and scrape down the sides and bottom of the bowl with a silicone spatula as needed.',
      'Add the egg and vanilla and beat until smooth, about 1 minute.',
      'Add about half of the dry ingredients and beat on low until just combined. Pour in the milk and beat until smooth. Add the remaining dry ingredients and beat on low until just combined. Do not overmix.',
      'Pour the batter evenly over the pineapple and cherries in the prepared pan and smooth the top. Tap the pan gently on the counter once or twice to release any large air bubbles.',
      'Bake until the top is golden, springs back when lightly pressed, and a toothpick inserted in the cake portion comes out clean, about 35–45 minutes.',
      'Let the cake cool in the pan on a wire rack for exactly 10 minutes — no longer, or the topping will stick. Run a thin knife around the edge, place a serving plate over the pan, and quickly invert. Lift off the pan, replacing any pineapple or cherries that stick. Serve warm or at room temperature.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.86 },
      { key: 'topping', label: 'Topping', cookingMethod: '', yieldFactorWater: 0.86 }
    ],
  },
  {
    id: 'SWEET_023',
    name: 'Shortcake (Biscuit-Type)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 23,
    recipe: ['butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'raccoon', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 5, chicken: 0, fish: 0 },
    servings: '8 biscuits',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":215.9,"pro":3.9,"fat":9.0,"carb":29.9,"fib":0.8,"h2o":18.5,"sug":5.8,"perServing":{"cal":215.9,"pro":3.9,"fat":9.0,"carb":29.9,"fib":0.8,"h2o":18.5,"sug":5.8,"AddedSugars":4.7,"IntrinsicSugars":1.1},"micros":{"vitaminA":12.6,"vitaminC":0.0,"vitaminD":15.61,"vitaminE":0.78,"vitaminK":5.41,"vitaminB6":0.02,"vitaminB12":0.13,"thiamin":0.3,"riboflavin":0.28,"niacin":2.51,"folate":73.78,"calcium":245.32,"iron":2.62,"magnesium":15.19,"phosphorus":351.61,"potassium":95.84,"sodium":460.93,"zinc":0.47,"copper":0.08,"selenium":18.03,"cholesterol":3.22,"saturatedFat":3.84,"monoFat":5.64,"polyFat":2.86,"omega3":0.0,"omega6":0.0},"gramsPerServing":63.1,"servings":8,"per100g":{"Energy_KCal":342.07,"Water":29.25,"Protein":6.13,"TotalLipidFat":14.21,"Carbohydrate":47.41,"FiberTotalDietary":1.34,"SugarsTotal":9.17,"Cholesterol":3.22,"FattyAcids_totalSaturated":3.84,"FattyAcids_totalMonounsaturated":5.64,"FattyAcids_totalPolyunsaturated":2.86,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":12.6,"Retinol":12.32,"Carotene_beta":2.2,"VitaminD":15.61,"VitaminE_alphaTocopherol":0.78,"VitaminK_phylloquinone":5.41,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.3,"Riboflavin":0.28,"Niacin":2.51,"PantothenicAcid":0.28,"VitaminB6":0.02,"Folate_total":73.78,"Folate_food":12.78,"Folate_DFE":116.56,"FolicAcid":76.25,"VitaminB12":0.13,"Choline_total":4.17,"Betaine":0.19,"LuteinZeaxanthin":27.38,"Lycopene":0.0,"Calcium_Ca":245.32,"Iron_Fe":2.62,"Magnesium_Mg":15.19,"Phosphorus_P":351.61,"Potassium_K":95.84,"Sodium_Na":460.93,"Zinc_Zn":0.47,"Copper_Cu":0.08,"Manganese_Mn":0.34,"Selenium_Se":18.03,"Tryptophan":0.07,"Threonine":0.18,"Isoleucine":0.22,"Leucine":0.44,"Lysine":0.19,"Methionine":0.11,"Cystine":0.1,"Phenylalanine":0.31,"Tyrosine":0.2,"Valine":0.27,"Arginine":0.23,"Histidine":0.14,"Alanine":0.2,"AsparticAcid":0.3,"GlutamicAcid":1.94,"Glycine":0.2,"Proline":0.69,"Serine":0.31,"omega3":0.0,"omega6":0.0,"AddedSugars":7.41,"IntrinsicSugars":1.76},"addedSugars":4.7,"intrinsicSugars":1.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18126","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.85,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"19335","name":"Sugars, granulated","grams":4.7},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":1.7},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":8.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":20.3}],"sections":[{"section_key":"biscuit","section_label":"Biscuit","prep_method":"formed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.85,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":530.97,"raw_water_grams":173.72,"raw_fat_grams":71.74,"final_grams":504.91}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, shortcake, biscuit-type, prepared from recipe', quantity: 'custom (g)', foodWord: 'CAKESHORTCAKE', ndbNo: '18126', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '2 cups', section: 'biscuit', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'granulated sugar', quantity: '3 tablespoons', section: 'biscuit', ndbNo: '19335', portionDesc: 'g', portionGrams: 37.5 },
      { name: 'double-acting baking powder', quantity: '1 tablespoon', section: 'biscuit', ndbNo: '18370', portionDesc: 'g', portionGrams: 13.8 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'biscuit', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'vegetable shortening', quantity: '5 tablespoons', section: 'biscuit', ndbNo: '4031', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'whole milk', quantity: '2/3 cup', section: 'biscuit', ndbNo: '1077', portionDesc: 'g', portionGrams: 162.6667 }
    ],
    recipeInstructions: [
      'Preheat oven to 450°F. Lightly grease a baking sheet or line with parchment paper.',
      'In a large bowl, whisk together the flour, sugar, baking powder, and salt until evenly blended.',
      'Cut the shortening into the dry ingredients with a pastry blender or two knives until the mixture resembles coarse crumbs the size of small peas.',
      'Pour in the milk all at once. Stir gently with a fork just until the dough comes together — do not overmix. The dough will be slightly sticky.',
      'Turn the dough out onto a lightly floured surface. Pat (do not roll) to about 3/4-inch thickness, folding once or twice to build flaky layers.',
      'Cut with a floured 2 1/2-inch round biscuit cutter, pressing straight down without twisting. Gather scraps gently and pat out once more to cut remaining biscuits. You should get 8 biscuits.',
      'Place biscuits on the prepared baking sheet with sides nearly touching for soft sides, or 1 inch apart for crisp sides.',
      'Bake 12–15 minutes until tops are golden brown and the biscuits have risen tall and split easily.',
      'Transfer to a rack. Serve warm, split horizontally with sweetened berries and whipped cream for classic strawberry shortcake.'
    ],
    sections: [
      { key: 'biscuit', label: 'Biscuit', cookingMethod: '', yieldFactorWater: 0.85 }
    ],
  },
  {
    id: 'SWEET_024',
    name: 'Hot-Water Sponge Cake',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 24,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '10 servings',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":166.0,"pro":4.1,"fat":2.4,"carb":32.0,"fib":0.2,"h2o":15.3,"sug":22.8,"perServing":{"cal":166.0,"pro":4.1,"fat":2.4,"carb":32.0,"fib":0.2,"h2o":15.3,"sug":22.8,"AddedSugars":22.4,"IntrinsicSugars":0.3},"micros":{"vitaminA":50.48,"vitaminC":0.6,"vitaminD":32.28,"vitaminE":0.35,"vitaminK":0.16,"vitaminB6":0.05,"vitaminB12":0.3,"thiamin":0.16,"riboflavin":0.29,"niacin":1.24,"folate":50.73,"calcium":26.26,"iron":2.01,"magnesium":7.83,"phosphorus":83.38,"potassium":115.84,"sodium":219.08,"zinc":0.51,"copper":0.05,"selenium":16.06,"cholesterol":169.14,"saturatedFat":1.52,"monoFat":1.75,"polyFat":0.59,"omega3":0.01,"omega6":0.0},"gramsPerServing":54.5,"servings":10,"per100g":{"Energy_KCal":304.5,"Water":28.12,"Protein":7.5,"TotalLipidFat":4.38,"Carbohydrate":58.73,"FiberTotalDietary":0.36,"SugarsTotal":41.72,"Cholesterol":169.14,"FattyAcids_totalSaturated":1.52,"FattyAcids_totalMonounsaturated":1.75,"FattyAcids_totalPolyunsaturated":0.59,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":50.48,"Retinol":49.16,"Carotene_beta":11.0,"VitaminD":32.28,"VitaminE_alphaTocopherol":0.35,"VitaminK_phylloquinone":0.16,"VitaminC_totalAscorbicAcid":0.6,"Thiamin":0.16,"Riboflavin":0.29,"Niacin":1.24,"PantothenicAcid":0.53,"VitaminB6":0.05,"Folate_total":50.73,"Folate_food":27.48,"Folate_DFE":66.79,"FolicAcid":28.85,"VitaminB12":0.3,"Choline_total":117.46,"Betaine":0.23,"LuteinZeaxanthin":120.11,"Lycopene":0.0,"Calcium_Ca":26.26,"Iron_Fe":2.01,"Magnesium_Mg":7.83,"Phosphorus_P":83.38,"Potassium_K":115.84,"Sodium_Na":219.08,"Zinc_Zn":0.51,"Copper_Cu":0.05,"Manganese_Mn":0.15,"Selenium_Se":16.06,"Tryptophan":0.09,"Threonine":0.29,"Isoleucine":0.4,"Leucine":0.64,"Lysine":0.49,"Methionine":0.2,"Cystine":0.14,"Phenylalanine":0.39,"Tyrosine":0.29,"Valine":0.46,"Arginine":0.43,"Histidine":0.19,"Alanine":0.39,"AsparticAcid":0.68,"GlutamicAcid":1.34,"Glycine":0.26,"Proline":0.42,"Serine":0.53,"omega3":0.01,"omega6":0.0,"AddedSugars":41.18,"IntrinsicSugars":0.53},"addedSugars":22.4,"intrinsicSugars":0.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18134","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.55,"yieldFactorFat":1.0,"sources":[{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":8.5},{"ndb":"1124","name":"Egg, white, raw, fresh","grams":16.5},{"ndb":"19335","name":"Sugars, granulated","grams":22.5},{"ndb":"20084","name":"Wheat flour, white, cake, enriched","grams":11.4},{"ndb":"14411","name":"Water, tap, drinking","grams":5.9},{"ndb":"9152","name":"Lemon juice, raw","grams":1.5},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"18373","name":"Leavening agents, cream of tartar","grams":0.1}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"mixed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.55,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":670.7,"raw_water_grams":278.75,"raw_fat_grams":23.86,"final_grams":545.26}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, sponge, prepared from recipe', quantity: 'custom (g)', foodWord: 'CAKESPONGE', ndbNo: '18134', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: '5 large egg yolks', quantity: '5 large yolks', section: 'cake', ndbNo: '1125', portionDesc: 'g', portionGrams: 85.0 },
      { name: '5 large egg whites', quantity: '5 large whites', section: 'cake', ndbNo: '1124', portionDesc: 'g', portionGrams: 165.0 },
      { name: 'granulated sugar', quantity: '1 cup + 2 tablespoons', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 225.0 },
      { name: 'sifted cake flour', quantity: '1 cup', section: 'cake', ndbNo: '20084', portionDesc: 'g', portionGrams: 114.0 },
      { name: 'hot water (about 180°F)', quantity: '1/4 cup hot', section: 'cake', ndbNo: '14411', portionDesc: 'g', portionGrams: 59.25 },
      { name: 'fresh lemon juice', quantity: '1 tablespoon', section: 'cake', ndbNo: '9152', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'pure vanilla extract', quantity: '1 teaspoon', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'table salt', quantity: 'scant 1/2 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 2.25 },
      { name: 'cream of tartar', quantity: '1/4 teaspoon', section: 'cake', ndbNo: '18373', portionDesc: 'g', portionGrams: 0.75 }
    ],
    recipeInstructions: [
      'Position a rack in the lower third of the oven and preheat to 325°F. Have ready an ungreased 10-inch tube (angel food) pan with a removable bottom — the batter must climb the sides as it bakes.',
      'Separate the eggs while cold (whites whip more cleanly when free of yolk). Place 5 yolks in a large mixing bowl and 5 whites in a separate clean, grease-free bowl. Let both come to room temperature, about 20 minutes.',
      'Sift the cake flour once onto a sheet of parchment, then sift again with the salt. Set aside.',
      'Heat the water until just steaming (about 180°F) and stir in the lemon juice and vanilla. Set aside to cool slightly.',
      'Beat the yolks: With an electric mixer on high speed, beat the yolks until thick, pale yellow, and ribbon-stage — about 4–5 minutes. Gradually beat in half the sugar (1/2 cup / 100 g), then drizzle in the warm lemon-water mixture and beat 1 minute more until glossy and aerated.',
      'Beat the whites: With clean beaters, whip the whites on medium speed until foamy, then add the cream of tartar. Increase to high speed and beat to soft peaks. Gradually rain in the remaining sugar (1/2 cup / 100 g) and continue beating to firm, glossy peaks that hold their shape but still look moist (not dry or chunky).',
      'Fold in the flour: Sift the flour mixture over the yolk mixture in three additions, gently folding with a large rubber spatula after each — turn the bowl as you fold to keep the batter light. Stop folding while a few flour streaks remain.',
      'Fold in the whites: Scoop one-third of the whipped whites onto the yolk batter and fold in to lighten. Add the remaining whites in two more additions, folding gently and just until no white streaks remain. Do not overmix — the airy whites are the only leavening.',
      'Pour the batter into the ungreased tube pan and gently smooth the top. Run a thin knife once through the batter in a circle to release any large air pockets.',
      'Bake on the lower rack for 40–50 minutes, until the top is golden, springs back when lightly pressed, and a wooden skewer inserted near the center comes out clean.',
      'Invert immediately: Flip the pan upside down onto the neck of a tall bottle (or use the pan\'s built-in feet) and let the cake cool completely upside-down, about 1 1/2 hours. This prevents the delicate sponge from collapsing under its own weight.',
      'To unmold: run a thin knife around the outer edge and around the center tube, then push the removable bottom up and out of the outer ring. Slide the knife under the cake to release it from the bottom. Slice with a serrated knife in a gentle sawing motion.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.55 }
    ],
  },
  {
    id: 'SWEET_025',
    name: 'Angel Food Cake',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 25,
    recipe: ['egg', 'grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'bird', delay: 5000 },
      { type: 'raccoon', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 0, apple: 0, grapes: 4, bacon: 0, butter: 3, chicken: 0, fish: 0 },
    servings: '12 servings',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":150.8,"pro":4.4,"fat":0.1,"carb":33.0,"fib":0.2,"h2o":16.7,"sug":25.3,"perServing":{"cal":150.8,"pro":4.4,"fat":0.1,"carb":33.0,"fib":0.2,"h2o":16.7,"sug":25.3,"AddedSugars":24.9,"IntrinsicSugars":0.3},"micros":{"vitaminA":0.0,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":0.0,"vitaminK":0.05,"vitaminB6":0.01,"vitaminB12":0.05,"thiamin":0.12,"riboflavin":0.32,"niacin":1.05,"folate":27.69,"calcium":7.31,"iron":1.37,"magnesium":9.52,"phosphorus":23.84,"potassium":231.38,"sodium":189.42,"zinc":0.13,"copper":0.04,"selenium":13.15,"cholesterol":0.0,"saturatedFat":0.02,"monoFat":0.01,"polyFat":0.05,"omega3":0.0,"omega6":0.0},"gramsPerServing":54.9,"servings":12,"per100g":{"Energy_KCal":274.86,"Water":30.45,"Protein":7.98,"TotalLipidFat":0.25,"Carbohydrate":60.06,"FiberTotalDietary":0.3,"SugarsTotal":46.08,"Cholesterol":0.0,"FattyAcids_totalSaturated":0.02,"FattyAcids_totalMonounsaturated":0.01,"FattyAcids_totalPolyunsaturated":0.05,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":0.0,"Retinol":0.0,"Carotene_beta":0.0,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.0,"VitaminK_phylloquinone":0.05,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.12,"Riboflavin":0.32,"Niacin":1.05,"PantothenicAcid":0.16,"VitaminB6":0.01,"Folate_total":27.69,"Folate_food":8.44,"Folate_DFE":40.99,"FolicAcid":23.9,"VitaminB12":0.05,"Choline_total":2.22,"Betaine":0.18,"LuteinZeaxanthin":0.36,"Lycopene":0.0,"Calcium_Ca":7.31,"Iron_Fe":1.37,"Magnesium_Mg":9.52,"Phosphorus_P":23.84,"Potassium_K":231.38,"Sodium_Na":189.42,"Zinc_Zn":0.13,"Copper_Cu":0.04,"Manganese_Mn":0.12,"Selenium_Se":13.15,"Tryptophan":0.09,"Threonine":0.3,"Isoleucine":0.45,"Leucine":0.7,"Lysine":0.53,"Methionine":0.26,"Cystine":0.18,"Phenylalanine":0.47,"Tyrosine":0.31,"Valine":0.54,"Arginine":0.44,"Histidine":0.2,"Alanine":0.46,"AsparticAcid":0.79,"GlutamicAcid":1.4,"Glycine":0.29,"Proline":0.42,"Serine":0.55,"omega3":0.0,"omega6":0.0,"AddedSugars":45.48,"IntrinsicSugars":0.6},"addedSugars":24.9,"intrinsicSugars":0.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18086","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.55,"yieldFactorFat":1.0,"sources":[{"ndb":"1124","name":"Egg, white, raw, fresh","grams":33.0},{"ndb":"19335","name":"Sugars, granulated","grams":25.0},{"ndb":"20084","name":"Wheat flour, white, cake, enriched","grams":9.5},{"ndb":"18373","name":"Leavening agents, cream of tartar","grams":0.4},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"2050","name":"Vanilla extract","grams":0.5}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"mixed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.55,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":822.3,"raw_water_grams":364.49,"raw_fat_grams":1.66,"final_grams":658.28}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cake, angelfood, commercially prepared', quantity: 'custom (g)', foodWord: 'CAKEANGELFOOD', ndbNo: '18086', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: '12 large egg whites (about 1 1/2 cups)', quantity: '12 large whites', section: 'cake', ndbNo: '1124', portionDesc: 'g', portionGrams: 396.0 },
      { name: 'granulated sugar', quantity: '1 1/2 cups', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 300.0 },
      { name: 'sifted cake flour', quantity: '1 cup', section: 'cake', ndbNo: '20084', portionDesc: 'g', portionGrams: 114.0 },
      { name: 'cream of tartar', quantity: '1 1/2 teaspoons', section: 'cake', ndbNo: '18373', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'table salt', quantity: '1/4 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'pure vanilla extract', quantity: '1 1/2 teaspoons', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 6.3 }
    ],
    recipeInstructions: [
      'Position a rack in the lower third of the oven and preheat to 350°F. Have ready a clean ungreased 10-inch tube (angel food) pan with a removable bottom — the batter must climb the ungreased sides as it bakes. Do not use a nonstick or greased pan; the cake will collapse.',
      'Separate the eggs while cold, letting not a speck of yolk fall into the whites (any fat will keep them from whipping). Place the 12 whites in a large grease-free metal or glass bowl. Let them stand at room temperature for 30 minutes.',
      'Reserve 3/4 cup of the sugar for the meringue (this goes into the egg whites later). Sift the remaining 3/4 cup sugar together with the cake flour into a bowl. Re-sift the mixture two more times until well combined and airy — repeated sifting helps the sugar coat the flour particles, allowing them to fold into the delicate meringue without deflating it. Set aside.',
      'Add the cream of tartar and salt to the room-temperature whites. With an electric mixer on medium speed, beat until foamy and the whites turn opaque, about 1 minute. Add the vanilla.',
      'Increase the mixer to medium-high. Whip until the whites form soft peaks that gently flop over when the beaters are lifted, about 2–3 minutes.',
      'Still on medium-high, gradually rain in the reserved 3/4 cup sugar about 2 tablespoons at a time, beating well between additions. Continue until the whites form firm, glossy, moist peaks that hold their shape but are not dry or chunky, about 3–4 minutes more.',
      'Sift the flour-sugar mixture over the whites in four additions. After each addition, fold in gently with a large rubber spatula — cut down through the center, sweep across the bottom, and turn the bowl a quarter turn. Stop folding the moment no flour streaks remain. Do not overmix.',
      'Gently spoon the batter into the ungreased tube pan. Run a thin knife or skewer once through the batter in a circle to release any large air pockets, then smooth the top.',
      'Bake on the lower rack for 35–40 minutes, until the top is golden, springs back when lightly pressed, and a wooden skewer inserted near the center comes out clean. Cracks on the surface are normal and expected.',
      'Invert immediately: Flip the pan upside down and rest it on its built-in feet, or set it over something that elevates it. Let the cake cool completely upside-down, about 1 1/2 hours — this prevents the airy structure from collapsing under its own weight while it sets.',
      'To unmold: run a thin knife around the outer edge and around the center tube using a gentle sawing motion (do not press inward — keep the knife flush against the metal). Push the removable bottom up and out of the outer ring. Slide the knife under the cake to release it from the bottom.',
      'Slice with a serrated knife in a gentle sawing motion (a regular knife will compress the cake). Serve plain, with sweetened berries, or with a light glaze.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.55 }
    ],
  },
  {
    id: 'SWEET_026',
    name: 'Cheesecake (NY-Style)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 26,
    recipe: ['butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'raccoon', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 5, chicken: 0, fish: 0 },
    servings: '12 servings',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":502.9,"pro":8.2,"fat":36.0,"carb":38.5,"fib":0.5,"h2o":57.2,"sug":29.3,"perServing":{"cal":502.9,"pro":8.2,"fat":36.0,"carb":38.5,"fib":0.5,"h2o":57.2,"sug":29.3,"AddedSugars":26.0,"IntrinsicSugars":3.3},"micros":{"vitaminA":190.45,"vitaminC":0.12,"vitaminD":11.23,"vitaminE":0.74,"vitaminK":2.68,"vitaminB6":0.05,"vitaminB12":0.24,"thiamin":0.04,"riboflavin":0.22,"niacin":0.43,"folate":17.64,"calcium":74.82,"iron":0.68,"magnesium":10.81,"phosphorus":107.81,"potassium":114.14,"sodium":279.41,"zinc":0.56,"copper":0.03,"selenium":10.02,"cholesterol":121.51,"saturatedFat":14.19,"monoFat":6.47,"polyFat":1.37,"omega3":0.11,"omega6":0.97},"gramsPerServing":141.7,"servings":12,"per100g":{"Energy_KCal":354.91,"Water":40.4,"Protein":5.81,"TotalLipidFat":25.42,"Carbohydrate":27.16,"FiberTotalDietary":0.34,"SugarsTotal":20.66,"Cholesterol":121.51,"FattyAcids_totalSaturated":14.19,"FattyAcids_totalMonounsaturated":6.47,"FattyAcids_totalPolyunsaturated":1.37,"LinoleicAcid":0.97,"alphaLinolenicAcid":0.1,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.0,"VitaminA_RAE":190.45,"Retinol":187.46,"Carotene_beta":32.62,"VitaminD":11.23,"VitaminE_alphaTocopherol":0.74,"VitaminK_phylloquinone":2.68,"VitaminC_totalAscorbicAcid":0.12,"Thiamin":0.04,"Riboflavin":0.22,"Niacin":0.43,"PantothenicAcid":0.48,"VitaminB6":0.05,"Folate_total":17.64,"Folate_food":11.43,"Folate_DFE":22.03,"FolicAcid":7.77,"VitaminB12":0.24,"Choline_total":53.91,"Betaine":0.46,"LuteinZeaxanthin":57.16,"Lycopene":0.0,"Calcium_Ca":74.82,"Iron_Fe":0.68,"Magnesium_Mg":10.81,"Phosphorus_P":107.81,"Potassium_K":114.14,"Sodium_Na":279.41,"Zinc_Zn":0.56,"Copper_Cu":0.03,"Manganese_Mn":0.11,"Selenium_Se":10.02,"Tryptophan":0.06,"Threonine":0.21,"Isoleucine":0.27,"Leucine":0.52,"Lysine":0.44,"Methionine":0.16,"Cystine":0.05,"Phenylalanine":0.26,"Tyrosine":0.24,"Valine":0.34,"Arginine":0.24,"Histidine":0.14,"Alanine":0.2,"AsparticAcid":0.47,"GlutamicAcid":0.99,"Glycine":0.14,"Proline":0.45,"Serine":0.34,"omega3":0.11,"omega6":0.97,"AddedSugars":18.33,"IntrinsicSugars":2.33},"addedSugars":26.0,"intrinsicSugars":3.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18147","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.92,"yieldFactorFat":1.0,"sources":[{"ndb":"18173","name":"Cookies, graham crackers, plain or honey","grams":12.5},{"ndb":"19335","name":"Sugars, granulated","grams":2.1},{"ndb":"1145","name":"Butter, without salt","grams":5.9},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1017","name":"Cheese, cream","grams":75.7},{"ndb":"19335","name":"Sugars, granulated","grams":20.8},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1056","name":"Cream, sour, cultured","grams":9.6},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":16.7},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":1.4},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":1.3},{"ndb":"9156","name":"Lemon peel, raw","grams":0.2}],"sections":[{"section_key":"crust","section_label":"Crust","prep_method":"pressed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.92,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":246.75,"raw_water_grams":17.83,"raw_fat_grams":73.49,"final_grams":245.32},{"section_key":"filling","section_label":"Filling","prep_method":"whisked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.92,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":1513.33,"raw_water_grams":728.77,"raw_fat_grams":358.66,"final_grams":1455.02}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cheesecake commercially prepared', quantity: 'custom (g)', foodWord: 'CAKECHEESECAKE', ndbNo: '18147', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'graham cracker crumbs (about 12 crackers)', quantity: '1 1/2 cups crushed', section: 'crust', ndbNo: '18173', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'sugar', quantity: '2 tablespoons', section: 'crust', ndbNo: '19335', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'unsalted butter (melted)', quantity: '5 tablespoons', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 71.0 },
      { name: 'salt', quantity: 'pinch', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 },
      { name: 'full-fat cream cheese, room temperature', quantity: '32 oz (4 blocks)', section: 'filling', ndbNo: '1017', portionDesc: 'g', portionGrams: 908.0 },
      { name: 'sugar', quantity: '1 1/4 cups', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'full-fat sour cream, room temperature', quantity: '1/2 cup', section: 'filling', ndbNo: '1056', portionDesc: 'g', portionGrams: 115.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'large egg (room temperature)', quantity: '4 large eggs', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'egg yolks', quantity: '1 large yolk', section: 'filling', ndbNo: '1125', portionDesc: 'g', portionGrams: 17.0 },
      { name: 'all-purpose flour', quantity: '2 tablespoons', section: 'filling', ndbNo: '20581', portionDesc: 'g', portionGrams: 15.625 },
      { name: 'freshly grated lemon zest', quantity: '1 teaspoon', section: 'filling', ndbNo: '9156', portionDesc: 'g', portionGrams: 2.0 }
    ],
    recipeInstructions: [
      'Position a rack in the lower-middle of the oven and preheat to 325°F.',
      'Use a springform pan protector, a leakproof springform pan, or wrap the outside bottom and sides of a 9-inch springform pan tightly with two layers of heavy-duty aluminum foil to prevent water from seeping in during the water bath.',
      'If not using a nonstick, non-toxic springform pan, line the bottom and sides with parchment paper.',
      'Make the crust: In a medium bowl, stir together the crushed graham crackers and 2 tablespoons of sugar. Drizzle in the melted butter and stir with a fork until the crumbs are evenly moistened and resemble wet sand.',
      'Transfer the crumb mixture to the springform pan. Press firmly and evenly across the bottom and about 1/2 inch up the sides using the flat bottom of a measuring cup. Bake the crust for 10 minutes, then transfer to a rack to cool while you prepare the filling. Maintain an oven temperature of 325°F.',
      'Make the filling: In the bowl of a stand mixer fitted with the paddle attachment (or a large bowl with a hand mixer), beat the room-temperature cream cheese on medium-low speed until completely smooth and lump-free, about 2–3 minutes. Scrape down the bowl and paddle thoroughly.',
      'Add the 1 1/4 cups sugar and salt and beat on medium-low until smooth and creamy, about 2 minutes. Scrape down again. Add the flour and lemon zest and beat until just combined. Beat in the sour cream and vanilla just until incorporated.',
      'With the mixer on low speed, add the whole eggs one at a time, beating just until each is incorporated and scraping down between additions. Finally beat in the extra yolk on low. Do not overbeat — overmixing incorporates air, which causes cracks during baking.',
      'Pour the filling into the cooled crust and gently smooth the top. Tap the pan gently on the counter a few times to release any large air bubbles.',
      'Set up the water bath: Place the springform pan in a large roasting pan. Pour very hot tap water into the roasting pan to come about 1 inch up the sides of the foil-wrapped springform — the water bath ensures gentle, even baking and prevents cracking.',
      'Bake at 325°F for 60–75 minutes, until the outer 2 inches are set and barely puffed, the center 3 inches still wobbles like just-set jelly when the pan is gently nudged, and the surface is pale ivory with no browning. Do not overbake — the center will firm up as it cools.',
      'Slow cool in the oven: Turn off the oven, prop the door open about 4 inches with a wooden spoon, and let the cheesecake cool slowly in the oven for 1 hour. This gradual cooling helps prevent surface cracks.',
      'Carefully remove the cheesecake from the water bath. Run a thin knife around the edge of the pan to release the cake from the sides (this also helps prevent cracking as it shrinks while cooling). Cool on a rack to room temperature, about 1 hour more.',
      'Chill: Cover loosely and refrigerate at least 8 hours, preferably overnight, to fully set the texture. To serve, release the springform ring, slide a thin spatula under the crust to lift onto a serving plate, and slice with a knife dipped in hot water and wiped clean between cuts.'
    ],
    sections: [
      { key: 'crust', label: 'Crust', cookingMethod: '', yieldFactorWater: 0.92 },
      { key: 'filling', label: 'Filling', cookingMethod: '', yieldFactorWater: 0.92 }
    ],
  },
  {
    id: 'SWEET_027',
    name: 'Sour Cream Coffee Cake',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 27,
    recipe: ['butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'raccoon', delay: 3500 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 5, chicken: 0, fish: 0 },
    servings: '10 servings',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":386.0,"pro":5.2,"fat":18.4,"carb":50.8,"fib":1.0,"h2o":26.0,"sug":26.3,"perServing":{"cal":386.0,"pro":5.2,"fat":18.4,"carb":50.8,"fib":1.0,"h2o":26.0,"sug":26.3,"AddedSugars":25.3,"IntrinsicSugars":1.0},"micros":{"vitaminA":126.56,"vitaminC":0.12,"vitaminD":7.66,"vitaminE":0.53,"vitaminK":1.54,"vitaminB6":0.03,"vitaminB12":0.15,"thiamin":0.19,"riboflavin":0.23,"niacin":1.58,"folate":50.2,"calcium":77.35,"iron":1.74,"magnesium":11.38,"phosphorus":118.82,"potassium":87.77,"sodium":234.65,"zinc":0.44,"copper":0.06,"selenium":14.62,"cholesterol":82.96,"saturatedFat":10.4,"monoFat":4.77,"polyFat":0.77,"omega3":0.05,"omega6":0.49},"gramsPerServing":101.7,"servings":10,"per100g":{"Energy_KCal":379.59,"Water":25.54,"Protein":5.11,"TotalLipidFat":18.08,"Carbohydrate":49.92,"FiberTotalDietary":0.97,"SugarsTotal":25.84,"Cholesterol":82.96,"FattyAcids_totalSaturated":10.4,"FattyAcids_totalMonounsaturated":4.77,"FattyAcids_totalPolyunsaturated":0.77,"LinoleicAcid":0.49,"alphaLinolenicAcid":0.05,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":126.56,"Retinol":124.26,"Carotene_beta":24.42,"VitaminD":7.66,"VitaminE_alphaTocopherol":0.53,"VitaminK_phylloquinone":1.54,"VitaminC_totalAscorbicAcid":0.12,"Thiamin":0.19,"Riboflavin":0.23,"Niacin":1.58,"PantothenicAcid":0.35,"VitaminB6":0.03,"Folate_total":50.2,"Folate_food":12.34,"Folate_DFE":76.76,"FolicAcid":47.33,"VitaminB12":0.15,"Choline_total":32.65,"Betaine":0.18,"LuteinZeaxanthin":52.65,"Lycopene":0.03,"Calcium_Ca":77.35,"Iron_Fe":1.74,"Magnesium_Mg":11.38,"Phosphorus_P":118.82,"Potassium_K":87.77,"Sodium_Na":234.65,"Zinc_Zn":0.44,"Copper_Cu":0.06,"Manganese_Mn":0.26,"Selenium_Se":14.62,"Tryptophan":0.06,"Threonine":0.18,"Isoleucine":0.22,"Leucine":0.41,"Lysine":0.23,"Methionine":0.11,"Cystine":0.09,"Phenylalanine":0.27,"Tyrosine":0.18,"Valine":0.26,"Arginine":0.24,"Histidine":0.12,"Alanine":0.2,"AsparticAcid":0.33,"GlutamicAcid":1.41,"Glycine":0.17,"Proline":0.5,"Serine":0.3,"omega3":0.05,"omega6":0.49,"AddedSugars":24.88,"IntrinsicSugars":0.96},"addedSugars":25.3,"intrinsicSugars":1.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18104","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.83,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":25.0},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.5},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"1145","name":"Butter, without salt","grams":11.4},{"ndb":"19335","name":"Sugars, granulated","grams":20.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":10.0},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"1056","name":"Cream, sour, cultured","grams":23.0},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":6.2},{"ndb":"19334","name":"Sugars, brown","grams":5.5},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.3},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1145","name":"Butter, without salt","grams":4.3}],"sections":[{"section_key":"cake","section_label":"Cake","prep_method":"batter","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.83,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":906.55,"raw_water_grams":296.83,"raw_fat_grams":148.61,"final_grams":856.09},{"section_key":"topping","section_label":"Topping","prep_method":"crumbled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.83,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":163.45,"raw_water_grams":16.11,"raw_fat_grams":35.2,"final_grams":160.71}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Coffeecake, cinnamon with crumb topping, commercially prepared, enriched', quantity: 'custom (g)', foodWord: 'CAKECOFFEECAKE', ndbNo: '18104', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '2 cups', section: 'cake', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'baking powder', quantity: '1 teaspoon', section: 'cake', ndbNo: '18370', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'baking soda', quantity: '1/4 teaspoon', section: 'cake', ndbNo: '18372', portionDesc: 'g', portionGrams: 1.15 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'cake', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter (room temperature)', quantity: '8 tablespoons', section: 'cake', ndbNo: '1145', portionDesc: 'g', portionGrams: 113.6 },
      { name: 'sugar', quantity: '1 cup', section: 'cake', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'large egg (room temperature)', quantity: '2 large eggs', section: 'cake', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'cake', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'sour cream (room temperature)', quantity: '1 cup', section: 'cake', ndbNo: '1056', portionDesc: 'g', portionGrams: 230.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1/2 cup', section: 'topping', ndbNo: '20581', portionDesc: 'g', portionGrams: 62.5 },
      { name: 'light brown sugar', quantity: '1/4 cup packed', section: 'topping', ndbNo: '19334', portionDesc: 'g', portionGrams: 55.0 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'topping', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'salt', quantity: 'pinch', section: 'topping', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 },
      { name: 'unsalted butter (cold cut into pieces)', quantity: '3 tablespoons', section: 'topping', ndbNo: '1145', portionDesc: 'g', portionGrams: 42.6 }
    ],
    recipeInstructions: [
      'Position a rack in the center of the oven and preheat to 350°F. Butter a 9-inch square baking pan and line the bottom with a parchment sling (leaving an overhang on two sides for easy lift-out).',
      'Make the crumb topping: In a medium bowl, whisk together the 1/2 cup flour, brown sugar, cinnamon, and pinch of salt. Add the cold cubed butter and rub it in with your fingertips (or cut in with a pastry blender) until the mixture forms damp, pebbly crumbs ranging from pea-sized to small-marble-sized. Refrigerate while you make the cake.',
      'Mix the dry ingredients: In a separate medium bowl, whisk together the 2 cups flour, baking powder, baking soda, and salt. Set aside.',
      'Cream the butter and sugar: In the bowl of a stand mixer fitted with the paddle attachment (or a large bowl with a hand mixer), beat the room-temperature butter on medium speed until smooth, about 1 minute. Add the granulated sugar and beat on medium-high until light, pale, and fluffy, 3–4 minutes, scraping down the bowl once.',
      'Add the eggs and vanilla: Reduce the mixer to medium and add the eggs one at a time, beating well and scraping down the bowl after each addition. Beat in the vanilla.',
      'Alternate dry and sour cream to protect the emulsion and minimize gluten development: With the mixer on low speed, add the flour and sour cream in 5 additions in this exact order, mixing just until each addition is incorporated and scraping down the bowl as needed: (a) Add one-third of the flour mixture and mix until just blended. (b) Add half of the sour cream and mix until just blended. (c) Add another one-third of the flour mixture and mix until just blended. (d) Add the remaining sour cream and mix until just blended. (e) Add the final one-third of the flour mixture and mix only until no flour streaks remain. The batter will be thick and creamy. Do not overmix.',
      'Assemble: Spread the batter evenly in the prepared pan, smoothing the top with an offset spatula. Scatter the chilled crumb topping evenly over the entire surface, breaking up any large clumps with your fingers so the crumbs are distributed in pebbles rather than sheets.',
      'Bake at 350°F for 40–50 minutes, until the topping is golden brown, the cake springs back when lightly pressed at the center, and a wooden toothpick inserted in the cake (not into a melted butter pocket) comes out with just a few moist crumbs.',
      'Transfer the pan to a wire rack and let cool for at least 30 minutes. Lift out using the parchment sling and slice into 10 squares (or 9 if you prefer larger pieces). Serve warm or at room temperature.',
      'Storage: Cover loosely with foil at room temperature for up to 2 days, or wrap individual slices and refrigerate up to 5 days. Reheat briefly in a 300°F oven or toaster oven to refresh the crumb texture.'
    ],
    sections: [
      { key: 'cake', label: 'Cake', cookingMethod: '', yieldFactorWater: 0.83 },
      { key: 'topping', label: 'Topping', cookingMethod: '', yieldFactorWater: 0.83 }
    ],
  },
  {
    id: 'SWEET_028',
    name: 'Pound Cake',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 28,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '10 servings',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":372.6,"pro":5.4,"fat":21.7,"carb":39.7,"fib":0.7,"h2o":22.7,"sug":20.4,"perServing":{"cal":372.6,"pro":5.4,"fat":21.7,"carb":39.7,"fib":0.7,"h2o":22.7,"sug":20.4,"AddedSugars":20.0,"IntrinsicSugars":0.4},"micros":{"vitaminA":182.34,"vitaminC":0.03,"vitaminD":17.19,"vitaminE":0.77,"vitaminK":1.9,"vitaminB6":0.04,"vitaminB12":0.23,"thiamin":0.17,"riboflavin":0.24,"niacin":1.41,"folate":49.59,"calcium":66.65,"iron":1.75,"magnesium":10.11,"phosphorus":134.7,"potassium":75.1,"sodium":205.25,"zinc":0.52,"copper":0.06,"selenium":16.75,"cholesterol":139.7,"saturatedFat":14.02,"monoFat":6.64,"polyFat":1.07,"omega3":0.08,"omega6":0.77},"gramsPerServing":90.6,"servings":10,"per100g":{"Energy_KCal":411.15,"Water":25.07,"Protein":5.99,"TotalLipidFat":23.91,"Carbohydrate":43.77,"FiberTotalDietary":0.75,"SugarsTotal":22.47,"Cholesterol":139.7,"FattyAcids_totalSaturated":14.02,"FattyAcids_totalMonounsaturated":6.64,"FattyAcids_totalPolyunsaturated":1.07,"LinoleicAcid":0.77,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":182.34,"Retinol":179.41,"Carotene_beta":33.15,"VitaminD":17.19,"VitaminE_alphaTocopherol":0.77,"VitaminK_phylloquinone":1.9,"VitaminC_totalAscorbicAcid":0.03,"Thiamin":0.17,"Riboflavin":0.24,"Niacin":1.41,"PantothenicAcid":0.44,"VitaminB6":0.04,"Folate_total":49.59,"Folate_food":15.6,"Folate_DFE":73.43,"FolicAcid":42.48,"VitaminB12":0.23,"Choline_total":63.69,"Betaine":0.1,"LuteinZeaxanthin":93.14,"Lycopene":0.0,"Calcium_Ca":66.65,"Iron_Fe":1.75,"Magnesium_Mg":10.11,"Phosphorus_P":134.7,"Potassium_K":75.1,"Sodium_Na":205.25,"Zinc_Zn":0.52,"Copper_Cu":0.06,"Manganese_Mn":0.2,"Selenium_Se":16.75,"Tryptophan":0.07,"Threonine":0.22,"Isoleucine":0.27,"Leucine":0.47,"Lysine":0.29,"Methionine":0.14,"Cystine":0.11,"Phenylalanine":0.31,"Tyrosine":0.21,"Valine":0.33,"Arginine":0.31,"Histidine":0.14,"Alanine":0.26,"AsparticAcid":0.44,"GlutamicAcid":1.41,"Glycine":0.2,"Proline":0.48,"Serine":0.38,"omega3":0.08,"omega6":0.77,"AddedSugars":22.03,"IntrinsicSugars":0.45},"addedSugars":20.0,"intrinsicSugars":0.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18120","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.85,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":22.7},{"ndb":"19335","name":"Sugars, granulated","grams":20.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":20.0},{"ndb":"2050","name":"Vanilla extract","grams":0.4},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":25.0},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.5},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"1056","name":"Cream, sour, cultured","grams":5.8}]},
    recipeIngredients: [
      { name: 'Cake, pound, commercially prepared, butter (includes fresh and frozen)', quantity: 'custom (g)', foodWord: 'CAKEPOUND', ndbNo: '18120', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter (room temperature)', quantity: '1 cup', ndbNo: '1145', portionDesc: 'g', portionGrams: 227.0 },
      { name: 'sugar', quantity: '1 cup', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'large egg (room temperature)', quantity: '4 large eggs', ndbNo: '1123', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'all-purpose flour', quantity: '2 cups', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'baking powder', quantity: '1 teaspoon', ndbNo: '18370', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'salt', quantity: '1/2 teaspoon', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'sour cream (room temperature)', quantity: '1/4 cup', ndbNo: '1056', portionDesc: 'g', portionGrams: 57.5 }
    ],
    recipeInstructions: [
      'Position a rack in the lower-middle of the oven and preheat to 325°F. Generously butter a 9x5-inch loaf pan and dust with flour, tapping out the excess (or line with a parchment sling for easy lift-out).',
      'Mix the dry ingredients: In a medium bowl, whisk together the AP flour, baking powder, and salt. Set aside.',
      'Cream the butter and sugar: In the bowl of a stand mixer fitted with the paddle attachment (or a large bowl with a hand mixer), beat the room-temperature butter on medium speed until smooth and creamy, about 1 minute. Add the sugar and beat on medium-high until very pale, light, and fluffy — about 5 minutes, scraping down the bowl twice. Do not rush this step; this is where pound cake gets most of its lift.',
      'Add the eggs: Reduce the mixer to medium and add the eggs one at a time, beating for 30 seconds and scraping down the bowl after each addition. The mixture should remain emulsified and creamy; if it looks curdled or broken, beat in a tablespoon of the measured flour to bring it back together. Beat in the vanilla and sour cream until fully incorporated.',
      'Add the dry ingredients: With the mixer on low speed, add the flour mixture in 3 additions, mixing just until each addition is incorporated and scraping down the bowl as needed: (a) Add one-third of the flour mixture and mix until just blended. (b) Add another one-third and mix until just blended. (c) Add the final one-third and mix only until no flour streaks remain. The batter will be thick, smooth, and dense. Do not overmix.',
      'Transfer to the pan: Scrape the batter into the prepared loaf pan and smooth the top with an offset spatula, building the batter slightly higher at the corners and ends than in the center (this helps the cake rise level instead of doming).',
      'Bake at 325°F for 65–80 minutes, until the top is deep golden brown, a long crack runs down the center (this is normal and desirable), the cake springs back when lightly pressed, and a wooden skewer inserted in the deepest part comes out with just a few moist crumbs. If the top is browning too quickly past the 50-minute mark, tent loosely with foil.',
      'Cool: Transfer the pan to a wire rack and let cool for 15 minutes. Run a thin knife around the edge, then invert onto the rack and turn the cake right-side up. Let cool completely before slicing, at least 1 hour — pound cake\'s crumb continues to set as it cools and slices much more cleanly when fully cool.',
      'Slice and serve: Cut into 10 slices with a serrated knife in a gentle sawing motion. Serve plain, dusted with confectioners\' sugar, with macerated berries, with a dollop of whipped cream, or toasted with butter for breakfast.',
      'Storage: Wrap tightly in plastic at room temperature for up to 3 days, or refrigerate up to 1 week, or freeze (whole or sliced) up to 3 months. The flavor improves on day 2 as the butter mellows.'
    ],
  },
  {
    id: 'SWEET_029',
    name: 'Brownies (Fudgy)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 29,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '16 brownies',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":234.1,"pro":3.1,"fat":14.7,"carb":26.7,"fib":2.6,"h2o":6.9,"sug":18.9,"perServing":{"cal":234.1,"pro":3.1,"fat":14.7,"carb":26.7,"fib":2.6,"h2o":6.9,"sug":18.9,"AddedSugars":18.8,"IntrinsicSugars":0.2},"micros":{"vitaminA":63.74,"vitaminC":0.0,"vitaminD":13.95,"vitaminE":1.19,"vitaminK":7.99,"vitaminB6":0.04,"vitaminB12":0.15,"thiamin":0.07,"riboflavin":0.16,"niacin":0.75,"folate":25.31,"calcium":30.88,"iron":2.62,"magnesium":70.66,"phosphorus":141.34,"potassium":241.71,"sodium":284.61,"zinc":1.22,"copper":0.51,"selenium":11.11,"cholesterol":81.18,"saturatedFat":10.75,"monoFat":10.47,"polyFat":3.99,"omega3":0.03,"omega6":0.36},"gramsPerServing":52.4,"servings":16,"per100g":{"Energy_KCal":447.09,"Water":13.2,"Protein":5.9,"TotalLipidFat":28.15,"Carbohydrate":50.93,"FiberTotalDietary":4.9,"SugarsTotal":36.17,"Cholesterol":81.18,"FattyAcids_totalSaturated":10.75,"FattyAcids_totalMonounsaturated":10.47,"FattyAcids_totalPolyunsaturated":3.99,"LinoleicAcid":0.36,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":63.74,"Retinol":62.99,"Carotene_beta":8.64,"VitaminD":13.95,"VitaminE_alphaTocopherol":1.19,"VitaminK_phylloquinone":7.99,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.07,"Riboflavin":0.16,"Niacin":0.75,"PantothenicAcid":0.31,"VitaminB6":0.04,"Folate_total":25.31,"Folate_food":13.05,"Folate_DFE":33.9,"FolicAcid":15.32,"VitaminB12":0.15,"Choline_total":51.71,"Betaine":0.05,"LuteinZeaxanthin":72.73,"Lycopene":0.0,"Calcium_Ca":30.88,"Iron_Fe":2.62,"Magnesium_Mg":70.66,"Phosphorus_P":141.34,"Potassium_K":241.71,"Sodium_Na":284.61,"Zinc_Zn":1.22,"Copper_Cu":0.51,"Manganese_Mn":0.57,"Selenium_Se":11.11,"Tryptophan":0.08,"Threonine":0.23,"Isoleucine":0.26,"Leucine":0.42,"Lysine":0.32,"Methionine":0.11,"Cystine":0.09,"Phenylalanine":0.3,"Tyrosine":0.22,"Valine":0.35,"Arginine":0.34,"Histidine":0.12,"Alanine":0.28,"AsparticAcid":0.54,"GlutamicAcid":1.04,"Glycine":0.23,"Proline":0.32,"Serine":0.34,"omega3":0.03,"omega6":0.36,"AddedSugars":35.82,"IntrinsicSugars":0.35},"addedSugars":18.8,"intrinsicSugars":0.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18154","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.79,"yieldFactorFat":1.0,"sources":[{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":8.5},{"ndb":"1145","name":"Butter, without salt","grams":3.5},{"ndb":"19335","name":"Sugars, granulated","grams":15.9},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":9.4},{"ndb":"2050","name":"Vanilla extract","grams":0.3},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":5.2},{"ndb":"19165","name":"Cocoa, dry powder, unsweetened","grams":5.7},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"19080","name":"Candies, semisweet chocolate","grams":5.3}],"sections":[{"section_key":"batter","section_label":"Batter","prep_method":"mixed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.79,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":867.05,"raw_water_grams":139.95,"raw_fat_grams":235.8,"final_grams":837.66}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, brownies, prepared from recipe', quantity: 'custom (g)', foodWord: 'COOKIESBROWNIES', ndbNo: '18154', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'vegetable shortening', quantity: '2/3 cup', section: 'batter', ndbNo: '4031', portionDesc: 'g', portionGrams: 136.6667 },
      { name: 'unsalted butter', quantity: '1/4 cup', section: 'batter', ndbNo: '1145', portionDesc: 'g', portionGrams: 56.75 },
      { name: 'granulated sugar', quantity: '1 1/4 cups + 1 teaspoon', section: 'batter', ndbNo: '19335', portionDesc: 'g', portionGrams: 254.2 },
      { name: 'large eggs', quantity: '3 large', section: 'batter', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'pure vanilla extract', quantity: '1 teaspoon', section: 'batter', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'all-purpose flour', quantity: '2/3 cup', section: 'batter', ndbNo: '20581', portionDesc: 'g', portionGrams: 83.3333 },
      { name: 'unsweetened cocoa powder', quantity: '1 cup + 1 tablespoon', section: 'batter', ndbNo: '19165', portionDesc: 'g', portionGrams: 91.4 },
      { name: 'table salt', quantity: 'scant 1 teaspoon', section: 'batter', ndbNo: '2047', portionDesc: 'g', portionGrams: 5.5 },
      { name: 'semi-sweet chocolate chips', quantity: '1/2 cup', section: 'batter', ndbNo: '19080', portionDesc: 'g', portionGrams: 85.0 }
    ],
    recipeInstructions: [
      'Position a rack in the center of the oven and preheat to 350°F. Grease a 9-inch square metal baking pan and line it with parchment, leaving overhang on two sides for easy lift-out.',
      'In a large bowl, stir together the vegetable shortening and butter until smooth and creamy.',
      'Add the sugar and whisk until glossy and well blended.',
      'Whisk in the eggs one at a time, then whisk in the vanilla until smooth.',
      'In a separate bowl, whisk together the flour, cocoa powder, and salt.',
      'Fold the dry ingredients into the wet mixture just until no dry streaks remain. Do not overmix.',
      'Spread the batter evenly in the prepared pan and smooth the top with an offset spatula.',
      'Bake for 22–28 minutes, until the top is set and a toothpick inserted 1 inch from the edge comes out with moist crumbs.',
      'Cool completely in the pan on a wire rack. Lift out using the parchment overhang and cut into 16 squares.'
    ],
    sections: [
      { key: 'batter', label: 'Batter', cookingMethod: '', yieldFactorWater: 0.79 }
    ],
  },
  {
    id: 'SWEET_030',
    name: 'Cookies, Oatmeal with Raisins',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 30,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '24 cookies',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":195.7,"pro":3.0,"fat":7.9,"carb":29.3,"fib":1.6,"h2o":5.6,"sug":15.1,"perServing":{"cal":195.7,"pro":3.0,"fat":7.9,"carb":29.3,"fib":1.6,"h2o":5.6,"sug":15.1,"AddedSugars":10.8,"IntrinsicSugars":4.2},"micros":{"vitaminA":115.69,"vitaminC":0.19,"vitaminD":6.98,"vitaminE":0.56,"vitaminK":2.23,"vitaminB6":0.06,"vitaminB12":0.1,"thiamin":0.19,"riboflavin":0.17,"niacin":1.17,"folate":34.68,"calcium":45.31,"iron":2.27,"magnesium":41.41,"phosphorus":145.08,"potassium":245.52,"sodium":239.12,"zinc":1.08,"copper":0.17,"selenium":15.24,"cholesterol":71.59,"saturatedFat":9.54,"monoFat":4.7,"polyFat":1.02,"omega3":0.04,"omega6":0.44},"gramsPerServing":46.5,"servings":24,"per100g":{"Energy_KCal":420.73,"Water":11.96,"Protein":6.35,"TotalLipidFat":16.94,"Carbohydrate":63.02,"FiberTotalDietary":3.32,"SugarsTotal":32.38,"Cholesterol":71.59,"FattyAcids_totalSaturated":9.54,"FattyAcids_totalMonounsaturated":4.7,"FattyAcids_totalPolyunsaturated":1.02,"LinoleicAcid":0.44,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":115.69,"Retinol":113.69,"Carotene_beta":22.84,"VitaminD":6.98,"VitaminE_alphaTocopherol":0.56,"VitaminK_phylloquinone":2.23,"VitaminC_totalAscorbicAcid":0.19,"Thiamin":0.19,"Riboflavin":0.17,"Niacin":1.17,"PantothenicAcid":0.43,"VitaminB6":0.06,"Folate_total":34.68,"Folate_food":13.98,"Folate_DFE":49.19,"FolicAcid":25.86,"VitaminB12":0.1,"Choline_total":36.42,"Betaine":0.1,"LuteinZeaxanthin":68.61,"Lycopene":0.03,"Calcium_Ca":45.31,"Iron_Fe":2.27,"Magnesium_Mg":41.41,"Phosphorus_P":145.08,"Potassium_K":245.52,"Sodium_Na":239.12,"Zinc_Zn":1.08,"Copper_Cu":0.17,"Manganese_Mn":1.0,"Selenium_Se":15.24,"Tryptophan":0.08,"Threonine":0.19,"Isoleucine":0.24,"Leucine":0.46,"Lysine":0.28,"Methionine":0.11,"Cystine":0.14,"Phenylalanine":0.31,"Tyrosine":0.19,"Valine":0.31,"Arginine":0.39,"Histidine":0.14,"Alanine":0.26,"AsparticAcid":0.48,"GlutamicAcid":1.4,"Glycine":0.25,"Proline":0.4,"Serine":0.34,"omega3":0.04,"omega6":0.44,"AddedSugars":23.28,"IntrinsicSugars":9.11},"addedSugars":10.8,"intrinsicSugars":4.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18184","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.7,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":8.3},{"ndb":"19334","name":"Sugars, brown","grams":6.9},{"ndb":"19335","name":"Sugars, granulated","grams":4.2},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":4.2},{"ndb":"2050","name":"Vanilla extract","grams":0.2},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":7.8},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.2},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"8120","name":"Cereals, oats, regular and quick, not fortified, dry","grams":10.1},{"ndb":"9298","name":"Raisins, seedless","grams":6.9}]},
    recipeIngredients: [
      { name: 'Cookies, oatmeal, prepared from recipe, with raisins', quantity: 'custom (g)', foodWord: 'COOKIESOATMEAL', ndbNo: '18184', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter', quantity: '1/2 cup + 6 tbsp', ndbNo: '1145', portionDesc: 'g', portionGrams: 198.7 },
      { name: 'brown sugar', quantity: '3/4 cup packed', ndbNo: '19334', portionDesc: 'g', portionGrams: 165.0 },
      { name: 'sugar', quantity: '1/2 cup', ndbNo: '19335', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'large egg', quantity: '2 large', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/2 cups', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'baking soda', quantity: '1 teaspoon', ndbNo: '18372', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'salt', quantity: '1/2 teaspoon', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'rolled oats (regular/quick oats)', quantity: '3 cups', ndbNo: '8120', portionDesc: 'g', portionGrams: 243.0 },
      { name: 'raisins', quantity: '1 cup', ndbNo: '9298', portionDesc: 'g', portionGrams: 165.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 350°F. Line baking sheets with parchment paper.',
      'Cream butter and sugar together until light and fluffy (2–3 minutes).',
      'Beat in eggs one at a time, then add vanilla extract.',
      'In a separate bowl, whisk together flour, oats, baking soda, cinnamon, and salt.',
      'Fold dry ingredients into wet ingredients until just combined; do not overmix.',
      'Fold in raisins gently until evenly distributed.',
      'Scoop dough onto parchment sheets, spacing 2 inches apart (dough will spread).',
      'Bake 13–17 minutes, until edges are golden and center is set.',
      'Cool on baking sheet for 5 minutes, then transfer to wire rack to cool completely.'
    ],
  },
  {
    id: 'SWEET_031',
    name: 'Cookies, Sugar, from Recipe with Margarine',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 31,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '24 cookies',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":158.9,"pro":2.0,"fat":8.2,"carb":19.5,"fib":0.4,"h2o":3.0,"sug":8.4,"perServing":{"cal":158.9,"pro":2.0,"fat":8.2,"carb":19.5,"fib":0.4,"h2o":3.0,"sug":8.4,"AddedSugars":8.3,"IntrinsicSugars":0.1},"micros":{"vitaminA":213.93,"vitaminC":0.03,"vitaminD":9.71,"vitaminE":2.36,"vitaminK":25.16,"vitaminB6":0.03,"vitaminB12":0.13,"thiamin":0.26,"riboflavin":0.26,"niacin":2.16,"folate":67.64,"calcium":99.1,"iron":2.37,"magnesium":12.29,"phosphorus":186.14,"potassium":69.5,"sodium":466.81,"zinc":0.46,"copper":0.07,"selenium":18.5,"cholesterol":46.37,"saturatedFat":4.75,"monoFat":10.91,"polyFat":5.83,"omega3":0.42,"omega6":0.16},"gramsPerServing":33.4,"servings":24,"per100g":{"Energy_KCal":475.25,"Water":9.02,"Protein":6.04,"TotalLipidFat":24.44,"Carbohydrate":58.25,"FiberTotalDietary":1.16,"SugarsTotal":25.11,"Cholesterol":46.37,"FattyAcids_totalSaturated":4.75,"FattyAcids_totalMonounsaturated":10.91,"FattyAcids_totalPolyunsaturated":5.83,"LinoleicAcid":0.16,"alphaLinolenicAcid":0.42,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":213.93,"Retinol":201.67,"Carotene_beta":138.43,"VitaminD":9.71,"VitaminE_alphaTocopherol":2.36,"VitaminK_phylloquinone":25.16,"VitaminC_totalAscorbicAcid":0.03,"Thiamin":0.26,"Riboflavin":0.26,"Niacin":2.16,"PantothenicAcid":0.32,"VitaminB6":0.03,"Folate_total":67.64,"Folate_food":14.85,"Folate_DFE":104.67,"FolicAcid":65.99,"VitaminB12":0.13,"Choline_total":36.12,"Betaine":0.04,"LuteinZeaxanthin":67.59,"Lycopene":0.0,"Calcium_Ca":99.1,"Iron_Fe":2.37,"Magnesium_Mg":12.29,"Phosphorus_P":186.14,"Potassium_K":69.5,"Sodium_Na":466.81,"Zinc_Zn":0.46,"Copper_Cu":0.07,"Manganese_Mn":0.3,"Selenium_Se":18.5,"Tryptophan":0.07,"Threonine":0.19,"Isoleucine":0.23,"Leucine":0.44,"Lysine":0.21,"Methionine":0.12,"Cystine":0.11,"Phenylalanine":0.31,"Tyrosine":0.19,"Valine":0.28,"Arginine":0.28,"Histidine":0.14,"Alanine":0.23,"AsparticAcid":0.35,"GlutamicAcid":1.7,"Glycine":0.21,"Proline":0.57,"Serine":0.34,"omega3":0.42,"omega6":0.16,"AddedSugars":24.88,"IntrinsicSugars":0.23},"addedSugars":8.3,"intrinsicSugars":0.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18208","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.46,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":14.3},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.4},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"4610","name":"Margarine, regular, 80% fat, composite, stick, with salt","grams":9.5},{"ndb":"19335","name":"Sugars, granulated","grams":6.2},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":4.2},{"ndb":"2050","name":"Vanilla extract","grams":0.2},{"ndb":"19335","name":"Sugars, granulated","grams":2.1}],"sections":[{"section_key":"rolling","section_label":"Cookies","prep_method":"rolled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.46,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":50.0,"raw_water_grams":0.01,"raw_fat_grams":0.0,"final_grams":49.99},{"section_key":"dough","section_label":"Dough","prep_method":"rolled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.46,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":837.15,"raw_water_grams":157.24,"raw_fat_grams":196.09,"final_grams":752.24}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, sugar, prepared from recipe, made with margarine', quantity: 'custom (g)', foodWord: 'COOKIESSUGAR', ndbNo: '18208', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2¾ cups', section: 'dough', ndbNo: '20581', portionDesc: 'g', portionGrams: 343.75 },
      { name: 'baking powder', quantity: '2 teaspoons', section: 'dough', ndbNo: '18370', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'salt', quantity: '½ teaspoon', section: 'dough', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'margarine stick salted', quantity: '1 cup (2 sticks)', section: 'dough', ndbNo: '4610', portionDesc: 'g', portionGrams: 227.0 },
      { name: 'sugar', quantity: '¾ cup', section: 'dough', ndbNo: '19335', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'large egg', quantity: '2 large', section: 'dough', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'dough', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'sugar', quantity: '¼ cup for rolling', section: 'rolling', ndbNo: '19335', portionDesc: 'g', portionGrams: 50.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 375°F. Line baking sheets with parchment paper.',
      'Beat margarine and sugar together until light and fluffy (2–3 minutes).',
      'Add eggs one at a time, beating well after each addition, then mix in vanilla.',
      'In a separate bowl, whisk together flour, baking powder, and salt.',
      'Gradually mix dry ingredients into wet ingredients until a soft dough forms.',
      'Roll dough into 1-inch balls. Roll each ball in the reserved granulated sugar.',
      'Place 2 inches apart on prepared baking sheets; flatten slightly with the bottom of a glass.',
      'Bake 8–10 minutes, until edges are lightly golden. Do not overbake.',
      'Cool on baking sheet for 2 minutes, then transfer to a wire rack to cool completely.'
    ],
    sections: [
      { key: 'rolling', label: 'Cookies', cookingMethod: '', yieldFactorWater: 0.46 },
      { key: 'dough', label: 'Dough', cookingMethod: '', yieldFactorWater: 0.46 }
    ],
  },
  {
    id: 'SWEET_032',
    name: 'Cookies, Gingersnaps',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 32,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '48 cookies',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":70.5,"pro":0.8,"fat":2.1,"carb":12.4,"fib":0.2,"h2o":1.1,"sug":7.8,"perServing":{"cal":70.5,"pro":0.8,"fat":2.1,"carb":12.4,"fib":0.2,"h2o":1.1,"sug":7.8,"AddedSugars":7.8,"IntrinsicSugars":0.0},"micros":{"vitaminA":90.49,"vitaminC":0.01,"vitaminD":4.84,"vitaminE":0.42,"vitaminK":1.33,"vitaminB6":0.13,"vitaminB12":0.07,"thiamin":0.21,"riboflavin":0.2,"niacin":1.97,"folate":53.92,"calcium":59.99,"iron":2.87,"magnesium":60.87,"phosphorus":61.0,"potassium":365.09,"sodium":476.81,"zinc":0.43,"copper":0.16,"selenium":18.08,"cholesterol":53.42,"saturatedFat":7.38,"monoFat":3.39,"polyFat":0.56,"omega3":0.04,"omega6":0.34},"gramsPerServing":16.8,"servings":48,"per100g":{"Energy_KCal":420.73,"Water":6.44,"Protein":4.57,"TotalLipidFat":12.43,"Carbohydrate":74.08,"FiberTotalDietary":1.22,"SugarsTotal":46.79,"Cholesterol":53.42,"FattyAcids_totalSaturated":7.38,"FattyAcids_totalMonounsaturated":3.39,"FattyAcids_totalPolyunsaturated":0.56,"LinoleicAcid":0.34,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":90.49,"Retinol":88.87,"Carotene_beta":18.5,"VitaminD":4.84,"VitaminE_alphaTocopherol":0.42,"VitaminK_phylloquinone":1.33,"VitaminC_totalAscorbicAcid":0.01,"Thiamin":0.21,"Riboflavin":0.2,"Niacin":1.97,"PantothenicAcid":0.37,"VitaminB6":0.13,"Folate_total":53.92,"Folate_food":10.87,"Folate_DFE":84.11,"FolicAcid":53.81,"VitaminB12":0.07,"Choline_total":21.56,"Betaine":0.05,"LuteinZeaxanthin":41.7,"Lycopene":0.04,"Calcium_Ca":59.99,"Iron_Fe":2.87,"Magnesium_Mg":60.87,"Phosphorus_P":61.0,"Potassium_K":365.09,"Sodium_Na":476.81,"Zinc_Zn":0.43,"Copper_Cu":0.16,"Manganese_Mn":0.85,"Selenium_Se":18.08,"Tryptophan":0.05,"Threonine":0.14,"Isoleucine":0.17,"Leucine":0.33,"Lysine":0.14,"Methionine":0.09,"Cystine":0.08,"Phenylalanine":0.23,"Tyrosine":0.15,"Valine":0.21,"Arginine":0.2,"Histidine":0.1,"Alanine":0.17,"AsparticAcid":0.25,"GlutamicAcid":1.35,"Glycine":0.16,"Proline":0.46,"Serine":0.25,"omega3":0.04,"omega6":0.34,"AddedSugars":46.64,"IntrinsicSugars":0.15},"addedSugars":7.8,"intrinsicSugars":0.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18172","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.4,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":5.9},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.2},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1145","name":"Butter, without salt","grams":2.4},{"ndb":"19335","name":"Sugars, granulated","grams":4.2},{"ndb":"19304","name":"Molasses","grams":3.5},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":1.0},{"ndb":"2021","name":"Spices, ginger, ground","grams":0.1},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.1},{"ndb":"2011","name":"Spices, cloves, ground","grams":0.0},{"ndb":"19335","name":"Sugars, granulated","grams":1.0}],"sections":[{"section_key":"rolling","section_label":"Cookies","prep_method":"rolled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.4,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":50.0,"raw_water_grams":0.01,"raw_fat_grams":0.0,"final_grams":49.99},{"section_key":"dough","section_label":"Dough","prep_method":"rolled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.4,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":832.7,"raw_water_grams":129.61,"raw_fat_grams":100.06,"final_grams":754.93}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, gingersnaps', quantity: 'custom (g)', foodWord: 'COOKIESGINGERSNAP', ndbNo: '18172', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2¼ cups', section: 'dough', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'baking soda', quantity: '2 teaspoons', section: 'dough', ndbNo: '18372', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'salt', quantity: '½ teaspoon', section: 'dough', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '½ cup (1 stick)', section: 'dough', ndbNo: '1145', portionDesc: 'g', portionGrams: 113.5 },
      { name: 'sugar', quantity: '1 cup', section: 'dough', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'molasses', quantity: '½ cup', section: 'dough', ndbNo: '19304', portionDesc: 'g', portionGrams: 168.5 },
      { name: 'large egg', quantity: '1 large', section: 'dough', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'ground ginger', quantity: '2 teaspoons', section: 'dough', ndbNo: '2021', portionDesc: 'g', portionGrams: 3.6 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'dough', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'ground cloves', quantity: '½ teaspoon', section: 'dough', ndbNo: '2011', portionDesc: 'g', portionGrams: 1.05 },
      { name: 'sugar', quantity: '¼ cup for rolling', section: 'rolling', ndbNo: '19335', portionDesc: 'g', portionGrams: 50.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 375°F. Line baking sheets with parchment paper.',
      'Beat butter and sugar together until light and fluffy (2–3 minutes).',
      'Beat in egg, then stir in molasses until fully combined.',
      'In a separate bowl, whisk together flour, baking soda, salt, ginger, cinnamon, and cloves.',
      'Gradually mix dry ingredients into wet ingredients until a smooth dough forms.',
      'Roll dough into 1-inch balls. Roll each ball in the reserved granulated sugar.',
      'Place 2 inches apart on prepared baking sheets.',
      'Bake 10–12 minutes, until cookies are set and surface is cracked. Do not overbake.',
      'Cool on baking sheet for 5 minutes, then transfer to a wire rack.'
    ],
    sections: [
      { key: 'rolling', label: 'Cookies', cookingMethod: '', yieldFactorWater: 0.4 },
      { key: 'dough', label: 'Dough', cookingMethod: '', yieldFactorWater: 0.4 }
    ],
  },
  {
    id: 'SWEET_033',
    name: 'Cookies, Butter, Homemade',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 33,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '60 cookies',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":58.7,"pro":0.6,"fat":3.2,"carb":6.9,"fib":0.1,"h2o":0.7,"sug":3.4,"perServing":{"cal":58.7,"pro":0.6,"fat":3.2,"carb":6.9,"fib":0.1,"h2o":0.7,"sug":3.4,"AddedSugars":3.3,"IntrinsicSugars":0.0},"micros":{"vitaminA":199.47,"vitaminC":0.0,"vitaminD":5.6,"vitaminE":0.79,"vitaminK":2.31,"vitaminB6":0.02,"vitaminB12":0.11,"thiamin":0.24,"riboflavin":0.23,"niacin":2.05,"folate":62.67,"calcium":18.39,"iron":2.02,"magnesium":10.56,"phosphorus":65.79,"potassium":63.38,"sodium":98.56,"zinc":0.41,"copper":0.07,"selenium":16.41,"cholesterol":96.88,"saturatedFat":16.76,"monoFat":7.54,"polyFat":1.03,"omega3":0.08,"omega6":0.69},"gramsPerServing":11.6,"servings":60,"per100g":{"Energy_KCal":506.08,"Water":6.38,"Protein":5.36,"TotalLipidFat":27.54,"Carbohydrate":59.81,"FiberTotalDietary":1.09,"SugarsTotal":29.0,"Cholesterol":96.88,"FattyAcids_totalSaturated":16.76,"FattyAcids_totalMonounsaturated":7.54,"FattyAcids_totalPolyunsaturated":1.03,"LinoleicAcid":0.69,"alphaLinolenicAcid":0.08,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":199.47,"Retinol":195.86,"Carotene_beta":41.56,"VitaminD":5.6,"VitaminE_alphaTocopherol":0.79,"VitaminK_phylloquinone":2.31,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.24,"Riboflavin":0.23,"Niacin":2.05,"PantothenicAcid":0.27,"VitaminB6":0.02,"Folate_total":62.67,"Folate_food":12.86,"Folate_DFE":97.59,"FolicAcid":62.25,"VitaminB12":0.11,"Choline_total":24.52,"Betaine":0.02,"LuteinZeaxanthin":47.66,"Lycopene":0.0,"Calcium_Ca":18.39,"Iron_Fe":2.02,"Magnesium_Mg":10.56,"Phosphorus_P":65.79,"Potassium_K":63.38,"Sodium_Na":98.56,"Zinc_Zn":0.41,"Copper_Cu":0.07,"Manganese_Mn":0.28,"Selenium_Se":16.41,"Tryptophan":0.06,"Threonine":0.16,"Isoleucine":0.21,"Leucine":0.39,"Lysine":0.17,"Methionine":0.11,"Cystine":0.1,"Phenylalanine":0.27,"Tyrosine":0.17,"Valine":0.24,"Arginine":0.23,"Histidine":0.12,"Alanine":0.19,"AsparticAcid":0.29,"GlutamicAcid":1.58,"Glycine":0.18,"Proline":0.54,"Serine":0.29,"omega3":0.08,"omega6":0.69,"AddedSugars":28.69,"IntrinsicSugars":0.31},"addedSugars":3.3,"intrinsicSugars":0.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18155","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.38,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":3.8},{"ndb":"19335","name":"Sugars, granulated","grams":3.3},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":0.8},{"ndb":"2050","name":"Vanilla extract","grams":0.1},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":4.7},{"ndb":"2047","name":"Salt, table","grams":0.0}]},
    recipeIngredients: [
      { name: 'Cookies, butter, commercially prepared, enriched', quantity: 'custom (g)', foodWord: 'COOKIESBUTTER', ndbNo: '18155', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter', quantity: '1 cup (2 sticks)', ndbNo: '1145', portionDesc: 'g', portionGrams: 227.0 },
      { name: 'sugar', quantity: '1 cup', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'large egg', quantity: '1 large', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'vanilla extract', quantity: '2 teaspoons', ndbNo: '2050', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2¼ cups', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'salt', quantity: '¼ teaspoon', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Preheat oven to 325°F. Line baking sheets with parchment paper.',
      'Beat butter and sugar together until light and fluffy (3–4 minutes).',
      'Beat in egg and vanilla extract until well combined.',
      'In a separate bowl, whisk together flour and salt.',
      'Gradually mix dry ingredients into wet ingredients until a soft dough forms.',
      'Drop small spoonfuls (½ teaspoon) onto prepared baking sheets, spacing 1 inch apart.',
      'Bake 12–15 minutes, until edges are set and bottoms are pale golden. Cookies should be soft.',
      'Cool on baking sheet for 3 minutes, then transfer to a wire rack.'
    ],
  },
  {
    id: 'SWEET_034',
    name: 'Cookies, Chocolate Chip, Homemade',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 34,
    recipe: ['egg', 'butter', 'bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '48 cookies',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":103.9,"pro":1.1,"fat":5.3,"carb":14.2,"fib":0.6,"h2o":0.8,"sug":9.0,"perServing":{"cal":103.9,"pro":1.1,"fat":5.3,"carb":14.2,"fib":0.6,"h2o":0.8,"sug":9.0,"AddedSugars":9.0,"IntrinsicSugars":0.1},"micros":{"vitaminA":106.82,"vitaminC":0.0,"vitaminD":7.3,"vitaminE":0.53,"vitaminK":2.92,"vitaminB6":0.03,"vitaminB12":0.09,"thiamin":0.17,"riboflavin":0.19,"niacin":1.49,"folate":47.11,"calcium":35.43,"iron":2.51,"magnesium":45.72,"phosphorus":92.75,"potassium":180.47,"sodium":249.46,"zinc":0.84,"copper":0.28,"selenium":13.32,"cholesterol":71.53,"saturatedFat":14.36,"monoFat":7.08,"polyFat":0.86,"omega3":0.04,"omega6":0.36},"gramsPerServing":21.8,"servings":48,"per100g":{"Energy_KCal":477.31,"Water":3.8,"Protein":5.18,"TotalLipidFat":24.16,"Carbohydrate":65.19,"FiberTotalDietary":2.65,"SugarsTotal":41.43,"Cholesterol":71.53,"FattyAcids_totalSaturated":14.36,"FattyAcids_totalMonounsaturated":7.08,"FattyAcids_totalPolyunsaturated":0.86,"LinoleicAcid":0.36,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":106.82,"Retinol":104.88,"Carotene_beta":22.02,"VitaminD":7.3,"VitaminE_alphaTocopherol":0.53,"VitaminK_phylloquinone":2.92,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.17,"Riboflavin":0.19,"Niacin":1.49,"PantothenicAcid":0.26,"VitaminB6":0.03,"Folate_total":47.11,"Folate_food":13.95,"Folate_DFE":70.37,"FolicAcid":41.45,"VitaminB12":0.09,"Choline_total":34.87,"Betaine":0.04,"LuteinZeaxanthin":49.03,"Lycopene":0.0,"Calcium_Ca":35.43,"Iron_Fe":2.51,"Magnesium_Mg":45.72,"Phosphorus_P":92.75,"Potassium_K":180.47,"Sodium_Na":249.46,"Zinc_Zn":0.84,"Copper_Cu":0.28,"Manganese_Mn":0.46,"Selenium_Se":13.32,"Tryptophan":0.06,"Threonine":0.17,"Isoleucine":0.2,"Leucine":0.36,"Lysine":0.2,"Methionine":0.09,"Cystine":0.08,"Phenylalanine":0.26,"Tyrosine":0.17,"Valine":0.26,"Arginine":0.25,"Histidine":0.11,"Alanine":0.2,"AsparticAcid":0.35,"GlutamicAcid":1.28,"Glycine":0.19,"Proline":0.43,"Serine":0.27,"omega3":0.04,"omega6":0.36,"AddedSugars":41.22,"IntrinsicSugars":0.21},"addedSugars":9.0,"intrinsicSugars":0.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18164","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.33,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":5.9},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"1145","name":"Butter, without salt","grams":3.5},{"ndb":"19334","name":"Sugars, brown","grams":3.1},{"ndb":"19335","name":"Sugars, granulated","grams":2.1},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":1.0},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":0.4},{"ndb":"2050","name":"Vanilla extract","grams":0.2},{"ndb":"19080","name":"Candies, semisweet chocolate","grams":7.1}]},
    recipeIngredients: [
      { name: 'Cookies, chocolate chip, refrigerated dough, baked', quantity: 'custom (g)', foodWord: 'COOKIESCHOCOLATECHIP', ndbNo: '18164', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2¼ cups', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'baking soda', quantity: '1 teaspoon', ndbNo: '18372', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'salt', quantity: '½ teaspoon', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '¾ cup (1½ sticks, melted)', ndbNo: '1145', portionDesc: 'g', portionGrams: 170.25 },
      { name: 'brown sugar', quantity: '¾ cup packed', ndbNo: '19334', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'sugar', quantity: '½ cup', ndbNo: '19335', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'large egg', quantity: '1 large', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'egg yolks', quantity: '1 egg yolk', ndbNo: '1125', portionDesc: 'g', portionGrams: 18.0 },
      { name: 'vanilla extract', quantity: '2 teaspoons', ndbNo: '2050', portionDesc: 'g', portionGrams: 8.4 },
      { name: 'chocolate chips semi-sweet', quantity: '2 cups', ndbNo: '19080', portionDesc: 'g', portionGrams: 340.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 350°F. Line baking sheets with parchment paper.',
      'Whisk together flour, baking soda, and salt in a bowl; set aside.',
      'In a separate bowl, stir together melted butter, brown sugar, and granulated sugar until combined.',
      'Beat in egg and egg yolk, then add vanilla extract and stir until well combined.',
      'Fold dry ingredients into wet ingredients until just combined. Do not overmix.',
      'Fold in chocolate chips gently until evenly distributed.',
      'Drop rounded tablespoons of dough onto prepared baking sheets, spacing 2 inches apart.',
      'Bake 11–13 minutes, until edges are set and centers are still soft. Do not overbake.',
      'Cool on baking sheet for 3 minutes, then transfer to a wire rack to cool completely.'
    ],
  },
  {
    id: 'SWEET_035',
    name: 'Cookies, Fig Bars',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 35,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '16 bars',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":155.6,"pro":2.1,"fat":5.8,"carb":25.0,"fib":2.1,"h2o":13.5,"sug":13.9,"perServing":{"cal":155.6,"pro":2.1,"fat":5.8,"carb":25.0,"fib":2.1,"h2o":13.5,"sug":13.9,"AddedSugars":4.8,"IntrinsicSugars":9.1},"micros":{"vitaminA":88.95,"vitaminC":0.26,"vitaminD":5.15,"vitaminE":0.49,"vitaminK":6.87,"vitaminB6":0.05,"vitaminB12":0.07,"thiamin":0.16,"riboflavin":0.17,"niacin":1.33,"folate":38.0,"calcium":128.9,"iron":2.09,"magnesium":34.37,"phosphorus":127.5,"potassium":320.54,"sodium":144.08,"zinc":0.48,"copper":0.15,"selenium":10.0,"cholesterol":54.15,"saturatedFat":7.24,"monoFat":3.36,"polyFat":0.61,"omega3":0.03,"omega6":0.34},"gramsPerServing":47.3,"servings":16,"per100g":{"Energy_KCal":329.06,"Water":28.5,"Protein":4.54,"TotalLipidFat":12.37,"Carbohydrate":52.78,"FiberTotalDietary":4.48,"SugarsTotal":29.42,"Cholesterol":54.15,"FattyAcids_totalSaturated":7.24,"FattyAcids_totalMonounsaturated":3.36,"FattyAcids_totalPolyunsaturated":0.61,"LinoleicAcid":0.34,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":88.95,"Retinol":87.43,"Carotene_beta":19.46,"VitaminD":5.15,"VitaminE_alphaTocopherol":0.49,"VitaminK_phylloquinone":6.87,"VitaminC_totalAscorbicAcid":0.26,"Thiamin":0.16,"Riboflavin":0.17,"Niacin":1.33,"PantothenicAcid":0.34,"VitaminB6":0.05,"Folate_total":38.0,"Folate_food":10.86,"Folate_DFE":57.03,"FolicAcid":33.92,"VitaminB12":0.07,"Choline_total":25.66,"Betaine":0.31,"LuteinZeaxanthin":44.33,"Lycopene":0.0,"Calcium_Ca":128.9,"Iron_Fe":2.09,"Magnesium_Mg":34.37,"Phosphorus_P":127.5,"Potassium_K":320.54,"Sodium_Na":144.08,"Zinc_Zn":0.48,"Copper_Cu":0.15,"Manganese_Mn":0.36,"Selenium_Se":10.0,"Tryptophan":0.05,"Threonine":0.13,"Isoleucine":0.16,"Leucine":0.29,"Lysine":0.15,"Methionine":0.08,"Cystine":0.07,"Phenylalanine":0.19,"Tyrosine":0.12,"Valine":0.2,"Arginine":0.18,"Histidine":0.09,"Alanine":0.18,"AsparticAcid":0.44,"GlutamicAcid":1.01,"Glycine":0.15,"Proline":0.55,"Serine":0.23,"omega3":0.03,"omega6":0.34,"AddedSugars":10.26,"IntrinsicSugars":19.16},"addedSugars":4.8,"intrinsicSugars":9.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18170","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.62,"yieldFactorFat":1.0,"sources":[{"ndb":"9094","name":"Figs, dried, uncooked","grams":18.8},{"ndb":"14411","name":"Water, tap, drinking","grams":11.1},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":10.4},{"ndb":"1145","name":"Butter, without salt","grams":6.5},{"ndb":"19334","name":"Sugars, brown","grams":5.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":3.1},{"ndb":"2050","name":"Vanilla extract","grams":0.3},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.3},{"ndb":"2047","name":"Salt, table","grams":0.1}],"sections":[{"section_key":"crust","section_label":"Crust","prep_method":"pressed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.62,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":411.03,"raw_water_grams":80.08,"raw_fat_grams":90.8,"final_grams":380.6},{"section_key":"filling","section_label":"Filling","prep_method":"simmered","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.62,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":477.75,"raw_water_grams":267.72,"raw_fat_grams":2.79,"final_grams":376.02}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, fig bars', quantity: 'custom (g)', foodWord: 'COOKIESFIGBAR', ndbNo: '18170', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'dried figs', quantity: '2 cups', section: 'filling', ndbNo: '9094', portionDesc: 'g', portionGrams: 300.0 },
      { name: 'ice water', quantity: '¾ cup', section: 'filling', ndbNo: '14411', portionDesc: 'g', portionGrams: 177.75 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1⅓ cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 166.6667 },
      { name: 'unsalted butter', quantity: '⅓ cup + 2 tbsp', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 104.0667 },
      { name: 'brown sugar', quantity: '⅓ cup packed', section: 'crust', ndbNo: '19334', portionDesc: 'g', portionGrams: 80.0 },
      { name: 'large egg', quantity: '1 large', section: 'crust', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'crust', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'baking powder', quantity: '1 teaspoon', section: 'crust', ndbNo: '18370', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'salt', quantity: '¼ teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Prepare filling: Bring water to a boil in a small saucepan. Add chopped figs and remove from heat. Let sit 15 minutes, then stir to break figs into a paste.',
      'Preheat oven to 350°F. Grease an 8×8 or 9×9 inch baking pan.',
      'Make crust: Beat butter and brown sugar together until fluffy. Beat in egg and vanilla.',
      'Whisk together flour, baking powder, and salt. Fold into wet ingredients until just combined.',
      'Spread half the crust mixture into prepared pan, pressing gently.',
      'Spread fig filling evenly over crust layer.',
      'Top with remaining crust mixture, spreading or dropping spoonfuls to cover filling.',
      'Bake 30–35 minutes, until golden and a toothpick inserted comes out clean.',
      'Cool completely in pan, then cut into bars (16 squares).'
    ],
    sections: [
      { key: 'crust', label: 'Crust', cookingMethod: '', yieldFactorWater: 0.62 },
      { key: 'filling', label: 'Filling', cookingMethod: '', yieldFactorWater: 0.62 }
    ],
  },
  {
    id: 'SWEET_036',
    name: 'Cookies, Coconut Macaroon',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 36,
    recipe: ['apple', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'squirrel', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 5, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '24 macaroons',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":102.4,"pro":1.1,"fat":5.9,"carb":12.1,"fib":0.7,"h2o":3.8,"sug":11.4,"perServing":{"cal":102.4,"pro":1.1,"fat":5.9,"carb":12.1,"fib":0.7,"h2o":3.8,"sug":11.4,"AddedSugars":11.3,"IntrinsicSugars":0.1},"micros":{"vitaminA":0.0,"vitaminC":0.27,"vitaminD":0.0,"vitaminE":0.24,"vitaminK":0.2,"vitaminB6":0.14,"vitaminB12":0.02,"thiamin":0.02,"riboflavin":0.11,"niacin":0.31,"folate":5.31,"calcium":12.61,"iron":1.39,"magnesium":38.23,"phosphorus":79.65,"potassium":279.55,"sodium":277.76,"zinc":1.3,"copper":0.23,"selenium":16.71,"cholesterol":0.0,"saturatedFat":22.36,"monoFat":1.02,"polyFat":0.22,"omega3":0.0,"omega6":0.0},"gramsPerServing":23.3,"servings":24,"per100g":{"Energy_KCal":439.87,"Water":16.51,"Protein":4.62,"TotalLipidFat":25.27,"Carbohydrate":52.05,"FiberTotalDietary":3.2,"SugarsTotal":48.82,"Cholesterol":0.0,"FattyAcids_totalSaturated":22.36,"FattyAcids_totalMonounsaturated":1.02,"FattyAcids_totalPolyunsaturated":0.22,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":0.0,"Retinol":0.0,"Carotene_beta":0.0,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.24,"VitaminK_phylloquinone":0.2,"VitaminC_totalAscorbicAcid":0.27,"Thiamin":0.02,"Riboflavin":0.11,"Niacin":0.31,"PantothenicAcid":0.47,"VitaminB6":0.14,"Folate_total":5.31,"Folate_food":5.31,"Folate_DFE":5.31,"FolicAcid":0.0,"VitaminB12":0.02,"Choline_total":12.58,"Betaine":0.07,"LuteinZeaxanthin":0.0,"Lycopene":0.0,"Calcium_Ca":12.61,"Iron_Fe":1.39,"Magnesium_Mg":38.23,"Phosphorus_P":79.65,"Potassium_K":279.55,"Sodium_Na":277.76,"Zinc_Zn":1.3,"Copper_Cu":0.23,"Manganese_Mn":1.76,"Selenium_Se":16.71,"Tryptophan":0.05,"Threonine":0.18,"Isoleucine":0.23,"Leucine":0.39,"Lysine":0.27,"Methionine":0.13,"Cystine":0.09,"Phenylalanine":0.26,"Tyrosine":0.16,"Valine":0.31,"Arginine":0.49,"Histidine":0.11,"Alanine":0.26,"AsparticAcid":0.49,"GlutamicAcid":0.83,"Glycine":0.19,"Proline":0.18,"Serine":0.29,"omega3":0.0,"omega6":0.0,"AddedSugars":48.56,"IntrinsicSugars":0.26},"addedSugars":11.3,"intrinsicSugars":0.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"28309","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.55,"yieldFactorFat":1.0,"sources":[{"ndb":"1124","name":"Egg, white, raw, fresh","grams":5.5},{"ndb":"19335","name":"Sugars, granulated","grams":4.2},{"ndb":"2050","name":"Vanilla extract","grams":0.2},{"ndb":"2047","name":"Salt, table","grams":0.0},{"ndb":"12179","name":"Nuts, coconut meat, dried (desiccated), sweetened, shredded","grams":16.5}],"sections":[{"section_key":"macaroons","section_label":"Macaroons","prep_method":"scooped","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.55,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":633.95,"raw_water_grams":167.65,"raw_fat_grams":141.12,"final_grams":558.51}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, coconut macaroon', quantity: 'custom (g)', foodWord: 'COOKIESMACAROON', ndbNo: '28309', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'egg whites', quantity: '4 large', section: 'macaroons', ndbNo: '1124', portionDesc: 'g', portionGrams: 132.0 },
      { name: 'sugar', quantity: '1/2 cup', section: 'macaroons', ndbNo: '19335', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'macaroons', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'salt', quantity: '1/8 teaspoon', section: 'macaroons', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 },
      { name: 'sweetened shredded coconut', quantity: '1 (14-ounce) bag (about 5 1/3 cups)', section: 'macaroons', ndbNo: '12179', portionDesc: 'g', portionGrams: 397.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 325°F. Line two baking sheets with parchment paper.',
      'In a clean bowl, whisk egg whites and salt until frothy (not stiff peaks).',
      'Whisk in granulated sugar until dissolved and glossy.',
      'Stir in vanilla extract.',
      'Fold in sweetened shredded coconut until evenly coated and mixture holds together when pressed.',
      'Use a small cookie scoop or two spoons to portion 24 mounds onto prepared baking sheets.',
      'Bake 20–24 minutes until edges and tops are lightly golden.',
      'Cool on sheet 5 minutes, then transfer to a rack to cool completely.'
    ],
    sections: [
      { key: 'macaroons', label: 'Macaroons', cookingMethod: '', yieldFactorWater: 0.55 }
    ],
  },
  {
    id: 'SWEET_037',
    name: 'Cookies, Molasses',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 37,
    recipe: ['egg', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'fox', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 5, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '30 cookies',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":109.4,"pro":1.2,"fat":4.9,"carb":15.5,"fib":0.3,"h2o":2.0,"sug":8.2,"perServing":{"cal":109.4,"pro":1.2,"fat":4.9,"carb":15.5,"fib":0.3,"h2o":2.0,"sug":8.2,"AddedSugars":8.1,"IntrinsicSugars":0.0},"micros":{"vitaminA":146.52,"vitaminC":0.01,"vitaminD":5.39,"vitaminE":0.62,"vitaminK":1.9,"vitaminB6":0.11,"vitaminB12":0.09,"thiamin":0.24,"riboflavin":0.22,"niacin":2.13,"folate":60.42,"calcium":70.62,"iron":2.92,"magnesium":50.5,"phosphorus":67.88,"potassium":320.56,"sodium":367.53,"zinc":0.45,"copper":0.15,"selenium":18.76,"cholesterol":76.43,"saturatedFat":12.19,"monoFat":5.52,"polyFat":0.81,"omega3":0.06,"omega6":0.52},"gramsPerServing":24.1,"servings":30,"per100g":{"Energy_KCal":454.49,"Water":8.24,"Protein":5.16,"TotalLipidFat":20.2,"Carbohydrate":64.33,"FiberTotalDietary":1.3,"SugarsTotal":33.95,"Cholesterol":76.43,"FattyAcids_totalSaturated":12.19,"FattyAcids_totalMonounsaturated":5.52,"FattyAcids_totalPolyunsaturated":0.81,"LinoleicAcid":0.52,"alphaLinolenicAcid":0.06,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":146.52,"Retinol":143.86,"Carotene_beta":30.49,"VitaminD":5.39,"VitaminE_alphaTocopherol":0.62,"VitaminK_phylloquinone":1.9,"VitaminC_totalAscorbicAcid":0.01,"Thiamin":0.24,"Riboflavin":0.22,"Niacin":2.13,"PantothenicAcid":0.39,"VitaminB6":0.11,"Folate_total":60.42,"Folate_food":12.44,"Folate_DFE":94.06,"FolicAcid":59.97,"VitaminB12":0.09,"Choline_total":24.78,"Betaine":0.07,"LuteinZeaxanthin":46.47,"Lycopene":0.05,"Calcium_Ca":70.62,"Iron_Fe":2.92,"Magnesium_Mg":50.5,"Phosphorus_P":67.88,"Potassium_K":320.56,"Sodium_Na":367.53,"Zinc_Zn":0.45,"Copper_Cu":0.15,"Manganese_Mn":0.71,"Selenium_Se":18.76,"Tryptophan":0.06,"Threonine":0.16,"Isoleucine":0.2,"Leucine":0.37,"Lysine":0.16,"Methionine":0.1,"Cystine":0.09,"Phenylalanine":0.26,"Tyrosine":0.17,"Valine":0.23,"Arginine":0.23,"Histidine":0.12,"Alanine":0.19,"AsparticAcid":0.28,"GlutamicAcid":1.51,"Glycine":0.18,"Proline":0.52,"Serine":0.28,"omega3":0.06,"omega6":0.52,"AddedSugars":33.79,"IntrinsicSugars":0.16},"addedSugars":8.1,"intrinsicSugars":0.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18177","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.46,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":5.7},{"ndb":"19334","name":"Sugars, brown","grams":5.5},{"ndb":"19304","name":"Molasses","grams":3.7},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":1.7},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":9.4},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.2},{"ndb":"2010","name":"Spices, cinnamon, ground","grams":0.1},{"ndb":"2021","name":"Spices, ginger, ground","grams":0.1},{"ndb":"2011","name":"Spices, cloves, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.1}],"sections":[{"section_key":"cookies","section_label":"Cookies","prep_method":"scooped","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.46,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":792.16,"raw_water_grams":129.44,"raw_fat_grams":145.89,"final_grams":722.26}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, molasses', quantity: 'custom (g)', foodWord: 'COOKIESMOLASSES', ndbNo: '18177', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter', quantity: '3/4 cup', section: 'cookies', ndbNo: '1145', portionDesc: 'g', portionGrams: 170.25 },
      { name: 'brown sugar', quantity: '3/4 cup packed', section: 'cookies', ndbNo: '19334', portionDesc: 'g', portionGrams: 165.0 },
      { name: 'molasses', quantity: '1/3 cup', section: 'cookies', ndbNo: '19304', portionDesc: 'g', portionGrams: 112.3333 },
      { name: 'large egg', quantity: '1 large', section: 'cookies', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 1/4 cups', section: 'cookies', ndbNo: '20581', portionDesc: 'g', portionGrams: 281.25 },
      { name: 'baking soda', quantity: '1 1/2 teaspoons', section: 'cookies', ndbNo: '18372', portionDesc: 'g', portionGrams: 6.9 },
      { name: 'ground cinnamon', quantity: '1 teaspoon', section: 'cookies', ndbNo: '2010', portionDesc: 'g', portionGrams: 2.6 },
      { name: 'ground ginger', quantity: '1 teaspoon', section: 'cookies', ndbNo: '2021', portionDesc: 'g', portionGrams: 1.8 },
      { name: 'ground cloves', quantity: '1/4 teaspoon', section: 'cookies', ndbNo: '2011', portionDesc: 'g', portionGrams: 0.525 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'cookies', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'sugar', quantity: '3 tablespoons (for rolling)', section: 'cookies', ndbNo: '19335', portionDesc: 'g', portionGrams: 37.5 }
    ],
    recipeInstructions: [
      'Preheat oven to 350°F and line baking sheets with parchment paper.',
      'Cream softened butter and brown sugar until light and fluffy, about 2-3 minutes.',
      'Beat in molasses and egg until fully combined.',
      'In a separate bowl, whisk flour, baking soda, cinnamon, ginger, cloves, and salt.',
      'Add dry ingredients to wet ingredients and mix just until no dry streaks remain.',
      'Cover and chill dough 20-30 minutes so it is easy to scoop and roll.',
      'Scoop into 1 to 1 1/2 tablespoon portions, roll into balls, and coat lightly in granulated sugar.',
      'Place 2 inches apart and bake 9-11 minutes, until puffed and crackled with set edges.',
      'Cool 5 minutes on the pan, then move to a wire rack to cool completely.'
    ],
    sections: [
      { key: 'cookies', label: 'Cookies', cookingMethod: '', yieldFactorWater: 0.46 }
    ],
  },
  {
    id: 'SWEET_038',
    name: 'Cookies, Peanut Butter',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 38,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '30 cookies',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":201.3,"pro":3.6,"fat":10.8,"carb":23.7,"fib":1.0,"h2o":1.9,"sug":14.5,"perServing":{"cal":201.3,"pro":3.6,"fat":10.8,"carb":23.7,"fib":1.0,"h2o":1.9,"sug":14.5,"AddedSugars":13.8,"IntrinsicSugars":0.8},"micros":{"vitaminA":118.56,"vitaminC":0.0,"vitaminD":6.34,"vitaminE":1.61,"vitaminK":1.43,"vitaminB6":0.09,"vitaminB12":0.09,"thiamin":0.17,"riboflavin":0.18,"niacin":3.75,"folate":56.38,"calcium":64.95,"iron":1.9,"magnesium":42.33,"phosphorus":152.95,"potassium":223.65,"sodium":399.43,"zinc":0.89,"copper":0.17,"selenium":13.35,"cholesterol":70.05,"saturatedFat":11.22,"monoFat":9.03,"polyFat":2.99,"omega3":0.04,"omega6":0.45},"gramsPerServing":40.9,"servings":30,"per100g":{"Energy_KCal":491.93,"Water":4.57,"Protein":8.89,"TotalLipidFat":26.51,"Carbohydrate":57.98,"FiberTotalDietary":2.37,"SugarsTotal":35.52,"Cholesterol":70.05,"FattyAcids_totalSaturated":11.22,"FattyAcids_totalMonounsaturated":9.03,"FattyAcids_totalPolyunsaturated":2.99,"LinoleicAcid":0.45,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":118.56,"Retinol":116.52,"Carotene_beta":23.57,"VitaminD":6.34,"VitaminE_alphaTocopherol":1.61,"VitaminK_phylloquinone":1.43,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.17,"Riboflavin":0.18,"Niacin":3.75,"PantothenicAcid":0.43,"VitaminB6":0.09,"Folate_total":56.38,"Folate_food":25.02,"Folate_DFE":78.37,"FolicAcid":39.2,"VitaminB12":0.09,"Choline_total":36.63,"Betaine":0.25,"LuteinZeaxanthin":42.75,"Lycopene":0.0,"Calcium_Ca":64.95,"Iron_Fe":1.9,"Magnesium_Mg":42.33,"Phosphorus_P":152.95,"Potassium_K":223.65,"Sodium_Na":399.43,"Zinc_Zn":0.89,"Copper_Cu":0.17,"Manganese_Mn":0.57,"Selenium_Se":13.35,"Tryptophan":0.09,"Threonine":0.23,"Isoleucine":0.28,"Leucine":0.6,"Lysine":0.28,"Methionine":0.14,"Cystine":0.11,"Phenylalanine":0.44,"Tyrosine":0.3,"Valine":0.34,"Arginine":0.75,"Histidine":0.2,"Alanine":0.34,"AsparticAcid":0.86,"GlutamicAcid":2.11,"Glycine":0.43,"Proline":0.65,"Serine":0.52,"omega3":0.04,"omega6":0.45,"AddedSugars":33.64,"IntrinsicSugars":1.88},"addedSugars":13.8,"intrinsicSugars":0.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18188","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.35,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":7.6},{"ndb":"16097","name":"Peanut butter, chunk style, with salt","grams":8.6},{"ndb":"19335","name":"Sugars, granulated","grams":6.7},{"ndb":"19334","name":"Sugars, brown","grams":7.3},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":3.3},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":10.4},{"ndb":"18372","name":"Leavening agents, baking soda","grams":0.2},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":0.2},{"ndb":"2047","name":"Salt, table","grams":0.1}],"sections":[{"section_key":"cookies","section_label":"Cookies","prep_method":"scooped","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.35,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":1332.0,"raw_water_grams":160.26,"raw_fat_grams":325.54,"final_grams":1227.83}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, peanut butter, refrigerated dough, baked', quantity: 'custom (g)', foodWord: 'COOKIESPEANUTBUTTER', ndbNo: '18188', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter', quantity: '1 cup', section: 'cookies', ndbNo: '1145', portionDesc: 'g', portionGrams: 227.0 },
      { name: 'crunchy peanut butter', quantity: '1 cup', section: 'cookies', ndbNo: '16097', portionDesc: 'g', portionGrams: 258.0 },
      { name: 'white sugar', quantity: '1 cup', section: 'cookies', ndbNo: '19335', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'packed brown sugar', quantity: '1 cup packed', section: 'cookies', ndbNo: '19334', portionDesc: 'g', portionGrams: 220.0 },
      { name: 'large eggs', quantity: '2 large', section: 'cookies', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'all-purpose flour', quantity: '2 1/2 cups', section: 'cookies', ndbNo: '20581', portionDesc: 'g', portionGrams: 312.5 },
      { name: 'baking soda', quantity: '1 1/2 teaspoons', section: 'cookies', ndbNo: '18372', portionDesc: 'g', portionGrams: 6.9 },
      { name: 'baking powder', quantity: '1 teaspoon', section: 'cookies', ndbNo: '18370', portionDesc: 'g', portionGrams: 4.6 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'cookies', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 350°F and line baking sheets with parchment paper.',
      'Cream butter, granulated sugar, and brown sugar until smooth and fluffy.',
      'Beat in peanut butter, egg, and vanilla until fully combined.',
      'Whisk flour, baking soda, baking powder, and salt in a separate bowl.',
      'Add dry mixture to wet and mix just until combined; do not overmix.',
      'Chill dough 20-30 minutes if soft.',
      'Scoop 1 to 1 1/2 tablespoon portions, roll into balls, and roll in granulated sugar.',
      'Place on baking sheet and press lightly with a fork to form crosshatch pattern.',
      'Bake 9-11 minutes until edges are set and tops are lightly cracked. Cool 5 minutes, then transfer to rack.'
    ],
    sections: [
      { key: 'cookies', label: 'Cookies', cookingMethod: '', yieldFactorWater: 0.35 }
    ],
  },
  {
    id: 'SWEET_039',
    name: 'Cookies, Shortbread',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 39,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '36 cookies',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":93.5,"pro":1.0,"fat":5.1,"carb":11.0,"fib":0.2,"h2o":0.7,"sug":4.2,"perServing":{"cal":93.5,"pro":1.0,"fat":5.1,"carb":11.0,"fib":0.2,"h2o":0.7,"sug":4.2,"AddedSugars":4.2,"IntrinsicSugars":0.0},"micros":{"vitaminA":200.95,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":0.78,"vitaminK":2.44,"vitaminB6":0.02,"vitaminB12":0.05,"thiamin":0.29,"riboflavin":0.24,"niacin":2.49,"folate":73.19,"calcium":16.23,"iron":2.32,"magnesium":11.65,"phosphorus":61.71,"potassium":62.68,"sodium":363.91,"zinc":0.38,"copper":0.08,"selenium":17.24,"cholesterol":74.31,"saturatedFat":17.52,"monoFat":7.73,"polyFat":0.99,"omega3":0.08,"omega6":0.63},"gramsPerServing":18.0,"servings":36,"per100g":{"Energy_KCal":519.17,"Water":3.73,"Protein":5.4,"TotalLipidFat":28.52,"Carbohydrate":60.96,"FiberTotalDietary":1.33,"SugarsTotal":23.34,"Cholesterol":74.31,"FattyAcids_totalSaturated":17.52,"FattyAcids_totalMonounsaturated":7.73,"FattyAcids_totalPolyunsaturated":0.99,"LinoleicAcid":0.63,"alphaLinolenicAcid":0.08,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":200.95,"Retinol":197.13,"Carotene_beta":44.08,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.78,"VitaminK_phylloquinone":2.44,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.29,"Riboflavin":0.24,"Niacin":2.49,"PantothenicAcid":0.21,"VitaminB6":0.02,"Folate_total":73.19,"Folate_food":12.3,"Folate_DFE":115.89,"FolicAcid":76.11,"VitaminB12":0.05,"Choline_total":5.85,"Betaine":0.0,"LuteinZeaxanthin":27.33,"Lycopene":0.0,"Calcium_Ca":16.23,"Iron_Fe":2.32,"Magnesium_Mg":11.65,"Phosphorus_P":61.71,"Potassium_K":62.68,"Sodium_Na":363.91,"Zinc_Zn":0.38,"Copper_Cu":0.08,"Manganese_Mn":0.34,"Selenium_Se":17.24,"Tryptophan":0.06,"Threonine":0.15,"Isoleucine":0.19,"Leucine":0.38,"Lysine":0.13,"Methionine":0.1,"Cystine":0.1,"Phenylalanine":0.27,"Tyrosine":0.17,"Valine":0.22,"Arginine":0.21,"Histidine":0.12,"Alanine":0.17,"AsparticAcid":0.23,"GlutamicAcid":1.77,"Glycine":0.19,"Proline":0.62,"Serine":0.27,"omega3":0.08,"omega6":0.63,"AddedSugars":23.1,"IntrinsicSugars":0.24},"addedSugars":4.2,"intrinsicSugars":0.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18192","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.3,"yieldFactorFat":1.0,"sources":[{"ndb":"1145","name":"Butter, without salt","grams":6.2},{"ndb":"19335","name":"Sugars, granulated","grams":4.2},{"ndb":"2050","name":"Vanilla extract","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":8.9}],"sections":[{"section_key":"shortbread","section_label":"Shortbread","prep_method":"formed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.3,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":704.51,"raw_water_grams":80.62,"raw_fat_grams":184.83,"final_grams":648.08}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cookies, shortbread, commercially prepared, plain', quantity: 'custom (g)', foodWord: 'COOKIESSHORTBREAD', ndbNo: '18192', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'unsalted butter', quantity: '1 cup (slightly scant)', section: 'shortbread', ndbNo: '1145', portionDesc: 'g', portionGrams: 224.0 },
      { name: 'sugar', quantity: '3/4 cup', section: 'shortbread', ndbNo: '19335', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'shortbread', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'salt', quantity: '1 teaspoon', section: 'shortbread', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 1/2 cups + 1 tablespoon', section: 'shortbread', ndbNo: '20581', portionDesc: 'g', portionGrams: 320.3125 }
    ],
    recipeInstructions: [
      'Preheat oven to 325°F and line a baking sheet with parchment paper.',
      'Cream butter and powdered sugar until smooth and fluffy, about 2 to 3 minutes.',
      'Mix in vanilla and salt until combined.',
      'Measure flour into a separate bowl.',
      'Add dry ingredients to butter mixture and mix on low just until dough comes together.',
      'Turn dough onto a lightly floured surface, press into a disk, and roll to about 1/2-inch thickness.',
      'Cut into rounds or fingers and place on baking sheet; chill 10 to 15 minutes if dough is soft.',
      'Bake 18 to 24 minutes until tops are set and edges are just turning light golden.',
      'Cool on pan 5 minutes, then transfer to a rack to cool completely.'
    ],
    sections: [
      { key: 'shortbread', label: 'Shortbread', cookingMethod: '', yieldFactorWater: 0.3 }
    ],
  },
  {
    id: 'SWEET_040',
    name: 'Buttermilk Pie',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 40,
    recipe: ['grapes', 'butter'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'bird', delay: 3500 },
      { type: 'raccoon', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 5, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '25 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":512.7,"pro":6.3,"fat":28.3,"carb":59.7,"fib":0.8,"h2o":52.6,"sug":39.5,"perServing":{"cal":512.7,"pro":6.3,"fat":28.3,"carb":59.7,"fib":0.8,"h2o":52.6,"sug":39.5,"AddedSugars":37.7,"IntrinsicSugars":1.7},"micros":{"vitaminA":147.21,"vitaminC":0.12,"vitaminD":20.06,"vitaminE":0.57,"vitaminK":1.54,"vitaminB6":0.03,"vitaminB12":0.22,"thiamin":0.12,"riboflavin":0.18,"niacin":0.92,"folate":32.16,"calcium":39.4,"iron":1.07,"magnesium":8.13,"phosphorus":66.97,"potassium":70.89,"sodium":209.47,"zinc":0.39,"copper":0.04,"selenium":11.04,"cholesterol":94.34,"saturatedFat":11.4,"monoFat":5.28,"polyFat":0.79,"omega3":0.05,"omega6":0.55},"gramsPerServing":148.3,"servings":8,"per100g":{"Energy_KCal":345.81,"Water":35.46,"Protein":4.27,"TotalLipidFat":19.06,"Carbohydrate":40.27,"FiberTotalDietary":0.51,"SugarsTotal":26.62,"Cholesterol":94.34,"FattyAcids_totalSaturated":11.4,"FattyAcids_totalMonounsaturated":5.28,"FattyAcids_totalPolyunsaturated":0.79,"LinoleicAcid":0.55,"alphaLinolenicAcid":0.05,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":147.21,"Retinol":144.72,"Carotene_beta":27.79,"VitaminD":20.06,"VitaminE_alphaTocopherol":0.57,"VitaminK_phylloquinone":1.54,"VitaminC_totalAscorbicAcid":0.12,"Thiamin":0.12,"Riboflavin":0.18,"Niacin":0.92,"PantothenicAcid":0.32,"VitaminB6":0.03,"Folate_total":32.16,"Folate_food":10.26,"Folate_DFE":47.53,"FolicAcid":27.39,"VitaminB12":0.22,"Choline_total":39.71,"Betaine":0.04,"LuteinZeaxanthin":54.38,"Lycopene":0.0,"Calcium_Ca":39.4,"Iron_Fe":1.07,"Magnesium_Mg":8.13,"Phosphorus_P":66.97,"Potassium_K":70.89,"Sodium_Na":209.47,"Zinc_Zn":0.39,"Copper_Cu":0.04,"Manganese_Mn":0.13,"Selenium_Se":11.04,"Tryptophan":0.05,"Threonine":0.15,"Isoleucine":0.19,"Leucine":0.34,"Lysine":0.22,"Methionine":0.1,"Cystine":0.07,"Phenylalanine":0.22,"Tyrosine":0.16,"Valine":0.23,"Arginine":0.2,"Histidine":0.1,"Alanine":0.18,"AsparticAcid":0.31,"GlutamicAcid":1.01,"Glycine":0.13,"Proline":0.36,"Serine":0.26,"omega3":0.05,"omega6":0.55,"AddedSugars":25.45,"IntrinsicSugars":1.17},"addedSugars":37.7,"intrinsicSugars":1.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":23.4},{"ndb":"1145","name":"Butter, without salt","grams":16.9},{"ndb":"2047","name":"Salt, table","grams":0.5},{"ndb":"19335","name":"Sugars, granulated","grams":0.3},{"ndb":"14411","name":"Water, tap, drinking","grams":8.0},{"ndb":"19335","name":"Sugars, granulated","grams":37.5},{"ndb":"1145","name":"Butter, without salt","grams":14.2},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"1230","name":"Milk, buttermilk, fluid, whole","grams":30.6},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":2.9},{"ndb":"2050","name":"Vanilla extract","grams":0.5},{"ndb":"2047","name":"Salt, table","grams":0.2},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.1},{"ndb":"9156","name":"Lemon peel, raw","grams":0.2}],"sections":[{"section_key":"crust","section_label":"Crust","prep_method":"rolled","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":392.69,"raw_water_grams":110.68,"raw_fat_grams":111.25,"final_grams":381.62},{"section_key":"filling","section_label":"Filling","prep_method":"whisked","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":840.19,"raw_water_grams":356.7,"raw_fat_grams":114.87,"final_grams":804.52}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Buttermilk Pie', quantity: 'custom (g)', foodWord: 'BUTTERMILKPIE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 187.5 },
      { name: 'unsalted butter', quantity: '9 1/2 tablespoons, chilled', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 134.9 },
      { name: 'salt', quantity: '1/2 teaspoon + pinch', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.6 },
      { name: 'sugar', quantity: '1/2 teaspoon + pinch', section: 'crust', ndbNo: '19335', portionDesc: 'g', portionGrams: 2.5 },
      { name: 'ice water', quantity: '4 tablespoons + 1 teaspoon', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 64.1875 },
      { name: 'sugar', quantity: '1 1/2 cups', section: 'filling', ndbNo: '19335', portionDesc: 'g', portionGrams: 300.0 },
      { name: 'unsalted butter', quantity: '1/2 cup, melted', section: 'filling', ndbNo: '1145', portionDesc: 'g', portionGrams: 113.5 },
      { name: 'large egg', quantity: '3 large eggs', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'whole buttermilk', quantity: '1 cup', section: 'filling', ndbNo: '1230', portionDesc: 'g', portionGrams: 245.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '3 tablespoons', section: 'filling', ndbNo: '20581', portionDesc: 'g', portionGrams: 23.4375 },
      { name: 'vanilla extract', quantity: '1 teaspoon', section: 'filling', ndbNo: '2050', portionDesc: 'g', portionGrams: 4.2 },
      { name: 'salt', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'ground nutmeg', quantity: '1/4 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.55 },
      { name: 'lemon zest', quantity: '1 teaspoon', section: 'filling', ndbNo: '9156', portionDesc: 'g', portionGrams: 2.0 }
    ],
    recipeInstructions: [
      'For the crust, whisk the flour, salt, and sugar together. Cut in the cold butter until the mixture resembles coarse crumbs with some pea-sized pieces remaining.',
      'Sprinkle the ice water over the mixture and stir gently with a fork just until the dough comes together. Form into a disk, wrap, and refrigerate for at least 30 minutes.',
      'Roll the chilled dough out on a lightly floured surface to a 12-inch round and fit into a 9-inch pie plate. Trim, fold the edges under, and crimp. Refrigerate the shell for 15 minutes.',
      'Preheat the oven to 400 degrees F (205 degrees C). Line the chilled shell with parchment and fill with pie weights. Blind-bake for 12 minutes, then remove the weights and parchment and bake another 5 to 7 minutes until the bottom looks dry but not yet browned. Remove and reduce the oven to 325 degrees F (165 degrees C).',
      'For the filling, whisk the flour, sugar, and salt together in a large bowl. Add the eggs and whisk until smooth and pale.',
      'Whisk in the melted and slightly cooled butter, then the buttermilk, vanilla, and lemon zest, until completely combined and the filling is uniform.',
      'Pour the filling into the par-baked crust through a fine-mesh strainer to remove any lumps.',
      'Grate a light dusting of nutmeg over the surface.',
      'Bake at 325 degrees F (165 degrees C) for 45 to 55 minutes until the edges are puffed and set and the center jiggles only slightly when the pan is gently nudged. Tent the crust edges with foil if they brown too quickly.',
      'Cool completely on a wire rack for at least 2 hours before slicing. Serve at room temperature or chilled.'
    ],
    sections: [
      { key: 'crust', label: 'Crust', cookingMethod: '', yieldFactorWater: 0.9 },
      { key: 'filling', label: 'Filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'CRUST_001',
    name: 'Pie Crust Double',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 41,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 double crust',
    prepTime: '20 min',
    linkType: 'component',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":2627.2,"pro":32.9,"fat":171.6,"carb":238.5,"fib":8.4,"h2o":47.1,"sug":0.9,"perServing":{"cal":2627.2,"pro":32.9,"fat":171.6,"carb":238.5,"fib":8.4,"h2o":47.1,"sug":0.9,"AddedSugars":0.0,"IntrinsicSugars":0.9},"micros":{"vitaminA":82.83,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":1.56,"vitaminK":10.22,"vitaminB6":0.02,"vitaminB12":0.02,"thiamin":0.37,"riboflavin":0.3,"niacin":3.15,"folate":92.14,"calcium":13.6,"iron":2.92,"magnesium":14.24,"phosphorus":71.14,"potassium":70.62,"sodium":528.36,"zinc":0.45,"copper":0.09,"selenium":21.4,"cholesterol":30.63,"saturatedFat":12.85,"monoFat":12.63,"polyFat":5.2,"omega3":0.03,"omega6":0.26},"gramsPerServing":498.4,"servings":1,"per100g":{"Energy_KCal":527.16,"Water":9.45,"Protein":6.6,"TotalLipidFat":34.43,"Carbohydrate":47.86,"FiberTotalDietary":1.69,"SugarsTotal":0.18,"Cholesterol":30.63,"FattyAcids_totalSaturated":12.85,"FattyAcids_totalMonounsaturated":12.63,"FattyAcids_totalPolyunsaturated":5.2,"LinoleicAcid":0.26,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":82.83,"Retinol":81.25,"Carotene_beta":18.51,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.56,"VitaminK_phylloquinone":10.22,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.37,"Riboflavin":0.3,"Niacin":3.15,"PantothenicAcid":0.24,"VitaminB6":0.02,"Folate_total":92.14,"Folate_food":14.89,"Folate_DFE":146.32,"FolicAcid":96.56,"VitaminB12":0.02,"Choline_total":2.45,"Betaine":0.0,"LuteinZeaxanthin":34.68,"Lycopene":0.0,"Calcium_Ca":13.6,"Iron_Fe":2.92,"Magnesium_Mg":14.24,"Phosphorus_P":71.14,"Potassium_K":70.62,"Sodium_Na":528.36,"Zinc_Zn":0.45,"Copper_Cu":0.09,"Manganese_Mn":0.43,"Selenium_Se":21.4,"Tryptophan":0.08,"Threonine":0.18,"Isoleucine":0.23,"Leucine":0.46,"Lysine":0.15,"Methionine":0.12,"Cystine":0.12,"Phenylalanine":0.33,"Tyrosine":0.2,"Valine":0.26,"Arginine":0.26,"Histidine":0.15,"Alanine":0.21,"AsparticAcid":0.28,"GlutamicAcid":2.2,"Glycine":0.23,"Proline":0.76,"Serine":0.33,"omega3":0.03,"omega6":0.26,"AddedSugars":0.0,"IntrinsicSugars":0.18},"addedSugars":0.0,"intrinsicSugars":0.9,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.38,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":312.5},{"ndb":"2047","name":"Salt, table","grams":6.8},{"ndb":"1145","name":"Butter, without salt","grams":71.0},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":110.9},{"ndb":"14411","name":"Water, tap, drinking","grams":74.1}],"sections":[{"section_key":"crust","section_label":"Double pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.38,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":575.25,"raw_water_grams":123.99,"raw_fat_grams":171.58,"final_grams":498.37}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Pie Crust Double', quantity: 'custom (g)', foodWord: 'PIEDOUBLECRUST', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 312.5 },
      { name: 'salt', quantity: '1 1/8 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.75 },
      { name: 'unsalted butter', quantity: '5 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 71.0 },
      { name: 'vegetable shortening', quantity: '8 tablespoon + 2 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 110.9333 },
      { name: 'ice water', quantity: '5 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 74.0625 }
    ],
    recipeInstructions: [
      'Whisk flour and salt together in a large bowl.',
      'Cut in chilled butter and shortening until the mixture resembles coarse crumbs with a few pea-sized pieces.',
      'Add ice water 1 tablespoon at a time, stirring until the dough just comes together.',
      'Divide dough into two equal pieces, shape each into a disc, and wrap in plastic.',
      'Refrigerate at least 30 minutes before rolling.',
      'Roll each disc on a lightly floured surface to about 1/8-inch thickness for a 9-inch pie plate.'
    ],
    sections: [
      { key: 'crust', label: 'Double pie crust', cookingMethod: '', yieldFactorWater: 0.38 }
    ],
  },
  {
    id: 'CRUST_002',
    name: 'Pie Crust Single',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 42,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 single crust',
    prepTime: '15 min',
    linkType: 'component',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":1313.6,"pro":16.4,"fat":85.8,"carb":119.3,"fib":4.2,"h2o":23.6,"sug":0.4,"perServing":{"cal":1313.6,"pro":16.4,"fat":85.8,"carb":119.3,"fib":4.2,"h2o":23.6,"sug":0.4,"AddedSugars":0.0,"IntrinsicSugars":0.4},"micros":{"vitaminA":82.95,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":1.57,"vitaminK":10.23,"vitaminB6":0.02,"vitaminB12":0.02,"thiamin":0.37,"riboflavin":0.3,"niacin":3.15,"folate":92.28,"calcium":13.58,"iron":2.92,"magnesium":14.26,"phosphorus":71.25,"potassium":70.72,"sodium":470.74,"zinc":0.46,"copper":0.09,"selenium":21.43,"cholesterol":30.68,"saturatedFat":12.87,"monoFat":12.65,"polyFat":5.2,"omega3":0.03,"omega6":0.26},"gramsPerServing":248.8,"servings":1,"per100g":{"Energy_KCal":527.95,"Water":9.47,"Protein":6.61,"TotalLipidFat":34.48,"Carbohydrate":47.93,"FiberTotalDietary":1.7,"SugarsTotal":0.18,"Cholesterol":30.68,"FattyAcids_totalSaturated":12.87,"FattyAcids_totalMonounsaturated":12.65,"FattyAcids_totalPolyunsaturated":5.2,"LinoleicAcid":0.26,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":82.95,"Retinol":81.38,"Carotene_beta":18.54,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.57,"VitaminK_phylloquinone":10.23,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.37,"Riboflavin":0.3,"Niacin":3.15,"PantothenicAcid":0.24,"VitaminB6":0.02,"Folate_total":92.28,"Folate_food":14.91,"Folate_DFE":146.54,"FolicAcid":96.71,"VitaminB12":0.02,"Choline_total":2.45,"Betaine":0.0,"LuteinZeaxanthin":34.73,"Lycopene":0.0,"Calcium_Ca":13.58,"Iron_Fe":2.92,"Magnesium_Mg":14.26,"Phosphorus_P":71.25,"Potassium_K":70.72,"Sodium_Na":470.74,"Zinc_Zn":0.46,"Copper_Cu":0.09,"Manganese_Mn":0.43,"Selenium_Se":21.43,"Tryptophan":0.08,"Threonine":0.18,"Isoleucine":0.23,"Leucine":0.46,"Lysine":0.15,"Methionine":0.12,"Cystine":0.12,"Phenylalanine":0.33,"Tyrosine":0.2,"Valine":0.26,"Arginine":0.26,"Histidine":0.15,"Alanine":0.21,"AsparticAcid":0.28,"GlutamicAcid":2.2,"Glycine":0.23,"Proline":0.76,"Serine":0.33,"omega3":0.03,"omega6":0.26,"AddedSugars":0.0,"IntrinsicSugars":0.18},"addedSugars":0.0,"intrinsicSugars":0.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18336","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.38,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":156.2},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"1145","name":"Butter, without salt","grams":35.5},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":55.5},{"ndb":"14411","name":"Water, tap, drinking","grams":37.0}],"sections":[{"section_key":"crust","section_label":"Single pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.38,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":287.25,"raw_water_grams":61.99,"raw_fat_grams":85.79,"final_grams":248.81}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Pie crust, standard-type, prepared from recipe, baked', quantity: 'custom (g)', foodWord: 'PIESINGLECRUST', ndbNo: '18336', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '2 1/2 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 35.5 },
      { name: 'vegetable shortening', quantity: '4 tablespoon + 1 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 55.4667 },
      { name: 'ice water', quantity: '2 1/2 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 37.0312 }
    ],
    recipeInstructions: [
      'Whisk flour and salt together in a large bowl.',
      'Cut in chilled butter and shortening until the mixture resembles coarse crumbs with a few pea-sized pieces.',
      'Add ice water 1 tablespoon at a time, stirring until the dough just comes together.',
      'Shape into a disc, wrap in plastic, and refrigerate at least 30 minutes.',
      'Roll dough on a lightly floured surface to about 1/8-inch thickness and fit into a 9-inch pie plate.',
      'Trim and crimp the edges; chill 15 minutes.',
      'Line with parchment and fill with pie weights. Bake at 375 degrees F (190 degrees C) for 20 minutes. Remove weights and bake 8 to 10 minutes more until golden.'
    ],
    sections: [
      { key: 'crust', label: 'Single pie crust', cookingMethod: '', yieldFactorWater: 0.38 }
    ],
  },
  {
    id: 'CRUST_003',
    name: 'Pie Crust Single (Unbaked)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 43,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 single crust',
    prepTime: '15 min',
    linkType: 'component',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":1313.6,"pro":16.4,"fat":85.8,"carb":119.3,"fib":4.2,"h2o":54.5,"sug":0.4,"perServing":{"cal":1313.6,"pro":16.4,"fat":85.8,"carb":119.3,"fib":4.2,"h2o":54.5,"sug":0.4,"AddedSugars":0.0,"IntrinsicSugars":0.4},"micros":{"vitaminA":86.79,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":1.64,"vitaminK":9.58,"vitaminB6":0.02,"vitaminB12":0.02,"thiamin":0.44,"riboflavin":0.28,"niacin":3.3,"folate":102.58,"calcium":12.0,"iron":2.6,"magnesium":12.66,"phosphorus":63.36,"potassium":62.89,"sodium":418.52,"zinc":0.4,"copper":0.08,"selenium":19.06,"cholesterol":27.28,"saturatedFat":11.44,"monoFat":11.84,"polyFat":5.79,"omega3":0.04,"omega6":0.27},"gramsPerServing":279.8,"servings":1,"per100g":{"Energy_KCal":469.5,"Water":19.49,"Protein":5.88,"TotalLipidFat":30.66,"Carbohydrate":42.62,"FiberTotalDietary":1.51,"SugarsTotal":0.16,"Cholesterol":27.28,"FattyAcids_totalSaturated":11.44,"FattyAcids_totalMonounsaturated":11.84,"FattyAcids_totalPolyunsaturated":5.79,"LinoleicAcid":0.27,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":86.79,"Retinol":85.14,"Carotene_beta":20.61,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.64,"VitaminK_phylloquinone":9.58,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.44,"Riboflavin":0.28,"Niacin":3.3,"PantothenicAcid":0.25,"VitaminB6":0.02,"Folate_total":102.58,"Folate_food":16.58,"Folate_DFE":162.89,"FolicAcid":86.0,"VitaminB12":0.02,"Choline_total":2.43,"Betaine":0.0,"LuteinZeaxanthin":44.12,"Lycopene":0.0,"Calcium_Ca":12.0,"Iron_Fe":2.6,"Magnesium_Mg":12.66,"Phosphorus_P":63.36,"Potassium_K":62.89,"Sodium_Na":418.52,"Zinc_Zn":0.4,"Copper_Cu":0.08,"Manganese_Mn":0.38,"Selenium_Se":19.06,"Tryptophan":0.07,"Threonine":0.16,"Isoleucine":0.2,"Leucine":0.41,"Lysine":0.13,"Methionine":0.1,"Cystine":0.12,"Phenylalanine":0.3,"Tyrosine":0.18,"Valine":0.24,"Arginine":0.23,"Histidine":0.13,"Alanine":0.19,"AsparticAcid":0.25,"GlutamicAcid":1.96,"Glycine":0.21,"Proline":0.67,"Serine":0.29,"omega3":0.04,"omega6":0.27,"AddedSugars":0.0,"IntrinsicSugars":0.16},"addedSugars":0.0,"intrinsicSugars":0.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18402","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":156.2},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"1145","name":"Butter, without salt","grams":35.5},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":55.5},{"ndb":"14411","name":"Water, tap, drinking","grams":29.6}],"sections":[{"section_key":"crust","section_label":"Single pie crust (unbaked)","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":279.79,"raw_water_grams":54.54,"raw_fat_grams":85.79,"final_grams":279.79}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Pie crust, standard-type, prepared from recipe, unbaked', quantity: 'custom (g)', foodWord: 'PIECRUSTRAW', ndbNo: '18402', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'unsalted butter', quantity: '2 1/2 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 35.5 },
      { name: 'vegetable shortening', quantity: '4 tablespoon + 1 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 55.4667 },
      { name: 'ice water', quantity: '2 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 29.57 }
    ],
    recipeInstructions: [
      'Whisk flour and salt together in a large bowl.',
      'Cut in chilled butter and shortening until the mixture resembles coarse crumbs with a few pea-sized pieces.',
      'Add ice water 1 tablespoon at a time, stirring until the dough just comes together.',
      'Shape into a disc, wrap in plastic, and refrigerate at least 30 minutes.',
      'Roll dough on a lightly floured surface to about 1/8-inch thickness and fit into a 9-inch pie plate.',
      'Trim and crimp the edges; chill until ready to fill and bake with filling.'
    ],
    sections: [
      { key: 'crust', label: 'Single pie crust (unbaked)', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'CRUST_004',
    name: 'Pie Crust Double (Unbaked)',
    category: 'Sweets & Desserts',
    dietaryCategory: 'veggie',
    levelNum: 44,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 double crust',
    prepTime: '20 min',
    linkType: 'component',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":2627.2,"pro":32.9,"fat":171.6,"carb":238.5,"fib":8.4,"h2o":109.1,"sug":0.9,"perServing":{"cal":2627.2,"pro":32.9,"fat":171.6,"carb":238.5,"fib":8.4,"h2o":109.1,"sug":0.9,"AddedSugars":0.0,"IntrinsicSugars":0.9},"micros":{"vitaminA":86.79,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":1.64,"vitaminK":9.58,"vitaminB6":0.02,"vitaminB12":0.02,"thiamin":0.44,"riboflavin":0.28,"niacin":3.3,"folate":102.58,"calcium":12.0,"iron":2.6,"magnesium":12.66,"phosphorus":63.36,"potassium":62.89,"sodium":418.52,"zinc":0.4,"copper":0.08,"selenium":19.06,"cholesterol":27.28,"saturatedFat":11.44,"monoFat":11.84,"polyFat":5.79,"omega3":0.04,"omega6":0.27},"gramsPerServing":559.6,"servings":1,"per100g":{"Energy_KCal":469.5,"Water":19.49,"Protein":5.88,"TotalLipidFat":30.66,"Carbohydrate":42.62,"FiberTotalDietary":1.51,"SugarsTotal":0.16,"Cholesterol":27.28,"FattyAcids_totalSaturated":11.44,"FattyAcids_totalMonounsaturated":11.84,"FattyAcids_totalPolyunsaturated":5.79,"LinoleicAcid":0.27,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":86.79,"Retinol":85.14,"Carotene_beta":20.61,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.64,"VitaminK_phylloquinone":9.58,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.44,"Riboflavin":0.28,"Niacin":3.3,"PantothenicAcid":0.25,"VitaminB6":0.02,"Folate_total":102.58,"Folate_food":16.58,"Folate_DFE":162.89,"FolicAcid":86.0,"VitaminB12":0.02,"Choline_total":2.43,"Betaine":0.0,"LuteinZeaxanthin":44.12,"Lycopene":0.0,"Calcium_Ca":12.0,"Iron_Fe":2.6,"Magnesium_Mg":12.66,"Phosphorus_P":63.36,"Potassium_K":62.89,"Sodium_Na":418.52,"Zinc_Zn":0.4,"Copper_Cu":0.08,"Manganese_Mn":0.38,"Selenium_Se":19.06,"Tryptophan":0.07,"Threonine":0.16,"Isoleucine":0.2,"Leucine":0.41,"Lysine":0.13,"Methionine":0.1,"Cystine":0.12,"Phenylalanine":0.3,"Tyrosine":0.18,"Valine":0.24,"Arginine":0.23,"Histidine":0.13,"Alanine":0.19,"AsparticAcid":0.25,"GlutamicAcid":1.96,"Glycine":0.21,"Proline":0.67,"Serine":0.29,"omega3":0.04,"omega6":0.27,"AddedSugars":0.0,"IntrinsicSugars":0.16},"addedSugars":0.0,"intrinsicSugars":0.9,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":312.5},{"ndb":"2047","name":"Salt, table","grams":6.0},{"ndb":"1145","name":"Butter, without salt","grams":71.0},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":110.9},{"ndb":"14411","name":"Water, tap, drinking","grams":59.1}],"sections":[{"section_key":"crust","section_label":"Crust","prep_method":"rolled","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":559.57,"raw_water_grams":109.08,"raw_fat_grams":171.58,"final_grams":559.57}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Pie Crust Double (Unbaked)', quantity: 'custom (g)', foodWord: 'PIEDOUBLECRUSTRAW', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 1/2 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 312.5 },
      { name: 'salt', quantity: '1 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'unsalted butter', quantity: '5 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 71.0 },
      { name: 'vegetable shortening', quantity: '8 tablespoon + 2 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 110.9334 },
      { name: 'ice water', quantity: '4 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 59.14 }
    ],
    recipeInstructions: [
      'Whisk flour and salt together in a large bowl.',
      'Cut in chilled butter and shortening until the mixture resembles coarse crumbs with a few pea-sized pieces.',
      'Add ice water 1 tablespoon at a time, stirring until the dough just comes together.',
      'Divide dough into two equal pieces, shape each into a disc, and wrap in plastic.',
      'Refrigerate at least 30 minutes before rolling.',
      'Roll each disc on a lightly floured surface to about 1/8-inch thickness and fit into the pie plate; chill until ready to fill and bake.'
    ],
    sections: [
      { key: 'crust', label: 'Crust', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_001',
    name: 'Biscuit',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 45,
    recipe: ['butter', 'bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'raccoon', delay: 5000 },
      { type: 'mouse', delay: 6500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 3, apple: 0, grapes: 0, bacon: 0, butter: 4, chicken: 0, fish: 0 },
    servings: '8 biscuits',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":198.2,"pro":3.9,"fat":9.0,"carb":25.4,"fib":0.8,"h2o":16.3,"sug":1.2,"perServing":{"cal":198.2,"pro":3.9,"fat":9.0,"carb":25.4,"fib":0.8,"h2o":16.3,"sug":1.2,"AddedSugars":0.1,"IntrinsicSugars":1.1},"micros":{"vitaminA":14.1,"vitaminC":0.0,"vitaminD":17.47,"vitaminE":0.87,"vitaminK":6.06,"vitaminB6":0.02,"vitaminB12":0.15,"thiamin":0.34,"riboflavin":0.31,"niacin":2.8,"folate":82.59,"calcium":274.54,"iron":2.93,"magnesium":17.0,"phosphorus":393.61,"potassium":107.12,"sodium":515.91,"zinc":0.52,"copper":0.09,"selenium":20.13,"cholesterol":3.61,"saturatedFat":4.3,"monoFat":6.32,"polyFat":3.2,"omega3":0.0,"omega6":0.0},"gramsPerServing":56.4,"servings":8,"per100g":{"Energy_KCal":351.61,"Water":28.89,"Protein":6.86,"TotalLipidFat":15.9,"Carbohydrate":44.99,"FiberTotalDietary":1.5,"SugarsTotal":2.19,"Cholesterol":3.61,"FattyAcids_totalSaturated":4.3,"FattyAcids_totalMonounsaturated":6.32,"FattyAcids_totalPolyunsaturated":3.2,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":14.1,"Retinol":13.79,"Carotene_beta":2.46,"VitaminD":17.47,"VitaminE_alphaTocopherol":0.87,"VitaminK_phylloquinone":6.06,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.34,"Riboflavin":0.31,"Niacin":2.8,"PantothenicAcid":0.32,"VitaminB6":0.02,"Folate_total":82.59,"Folate_food":14.3,"Folate_DFE":130.48,"FolicAcid":85.36,"VitaminB12":0.15,"Choline_total":4.67,"Betaine":0.22,"LuteinZeaxanthin":30.65,"Lycopene":0.0,"Calcium_Ca":274.54,"Iron_Fe":2.93,"Magnesium_Mg":17.0,"Phosphorus_P":393.61,"Potassium_K":107.12,"Sodium_Na":515.91,"Zinc_Zn":0.52,"Copper_Cu":0.09,"Manganese_Mn":0.38,"Selenium_Se":20.13,"Tryptophan":0.08,"Threonine":0.2,"Isoleucine":0.25,"Leucine":0.5,"Lysine":0.22,"Methionine":0.13,"Cystine":0.11,"Phenylalanine":0.35,"Tyrosine":0.23,"Valine":0.3,"Arginine":0.26,"Histidine":0.16,"Alanine":0.22,"AsparticAcid":0.34,"GlutamicAcid":2.18,"Glycine":0.23,"Proline":0.77,"Serine":0.35,"omega3":0.0,"omega6":0.0,"AddedSugars":0.22,"IntrinsicSugars":1.97},"addedSugars":0.1,"intrinsicSugars":1.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18016","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.75,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":31.2},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":1.7},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":8.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":20.3},{"ndb":"19335","name":"Sugars, granulated","grams":0.1}],"sections":[{"section_key":"biscuit","section_label":"Biscuit","prep_method":"formed","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.75,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":494.47,"raw_water_grams":173.72,"raw_fat_grams":71.74,"final_grams":451.04}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Biscuits, plain or buttermilk, prepared from recipe', quantity: 'custom (g)', foodWord: 'BISCUIT', ndbNo: '18016', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '2 cups', section: 'biscuit', ndbNo: '20581', portionDesc: 'g', portionGrams: 250.0 },
      { name: 'double-acting baking powder', quantity: '1 tablespoon', section: 'biscuit', ndbNo: '18370', portionDesc: 'g', portionGrams: 13.8 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'biscuit', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'vegetable shortening', quantity: '5 tablespoons', section: 'biscuit', ndbNo: '4031', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'whole milk', quantity: '2/3 cup', section: 'biscuit', ndbNo: '1077', portionDesc: 'g', portionGrams: 162.6667 },
      { name: 'granulated sugar', quantity: '1/4 teaspoon', section: 'biscuit', ndbNo: '19335', portionDesc: 'g', portionGrams: 1.0 }
    ],
    recipeInstructions: [
      'Preheat oven to 450°F. Lightly grease a baking sheet or line with parchment paper.',
      'In a large bowl, whisk together the flour, baking powder, salt, and sugar until evenly blended.',
      'Cut the vegetable shortening into the dry ingredients with a pastry blender or two knives until the mixture resembles coarse crumbs the size of small peas.',
      'Pour in the milk all at once. Stir gently with a fork just until the dough comes together — do not overmix. The dough will be slightly sticky.',
      'Turn the dough out onto a lightly floured surface. Pat (do not roll) to about 3/4-inch thickness, folding once or twice to build flaky layers.',
      'Cut with a floured 2 1/2-inch round biscuit cutter, pressing straight down without twisting. Gather scraps gently and pat out once more to cut remaining biscuits. You should get 8 biscuits.',
      'Place biscuits on the prepared baking sheet with sides nearly touching for soft sides, or 1 inch apart for crisp sides.',
      'Bake 12–15 minutes until tops are golden brown and the biscuits have risen tall and split easily.',
      'Transfer to a rack and serve warm with butter, gravy, or jam.'
    ],
    sections: [
      { key: 'biscuit', label: 'Biscuit', cookingMethod: '', yieldFactorWater: 0.75 }
    ],
  },
  {
    id: 'BKFST_015',
    name: 'Breakfast Sausage',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 46,
    recipe: ['sausage', 'pork'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [

    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0, sausage: 4, pork: 3 },
    servings: '12 patties',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":114.5,"pro":6.5,"fat":9.5,"carb":0.8,"fib":0.2,"h2o":17.0,"sug":0.4,"perServing":{"cal":114.5,"pro":6.5,"fat":9.5,"carb":0.8,"fib":0.2,"h2o":17.0,"sug":0.4,"AddedSugars":0.4,"IntrinsicSugars":0.0},"micros":{"vitaminA":5.65,"vitaminC":0.46,"vitaminD":8.9,"vitaminE":0.08,"vitaminK":6.02,"vitaminB6":0.33,"vitaminB12":0.66,"thiamin":0.6,"riboflavin":0.23,"niacin":3.87,"folate":5.44,"calcium":28.42,"iron":1.25,"magnesium":24.4,"phosphorus":197.69,"potassium":342.03,"sodium":620.63,"zinc":2.48,"copper":0.06,"selenium":27.58,"cholesterol":82.71,"saturatedFat":11.07,"monoFat":13.5,"polyFat":2.17,"omega3":0.0,"omega6":0.0},"gramsPerServing":34.7,"servings":12,"per100g":{"Energy_KCal":329.73,"Water":49.06,"Protein":18.81,"TotalLipidFat":27.25,"Carbohydrate":2.31,"FiberTotalDietary":0.46,"SugarsTotal":1.13,"Cholesterol":82.71,"FattyAcids_totalSaturated":11.07,"FattyAcids_totalMonounsaturated":13.5,"FattyAcids_totalPolyunsaturated":2.17,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":5.65,"Retinol":2.05,"Carotene_beta":39.25,"VitaminD":8.9,"VitaminE_alphaTocopherol":0.08,"VitaminK_phylloquinone":6.02,"VitaminC_totalAscorbicAcid":0.46,"Thiamin":0.6,"Riboflavin":0.23,"Niacin":3.87,"PantothenicAcid":0.6,"VitaminB6":0.33,"Folate_total":5.44,"Folate_food":5.44,"Folate_DFE":5.44,"FolicAcid":0.0,"VitaminB12":0.66,"Choline_total":1.7,"Betaine":0.15,"LuteinZeaxanthin":24.52,"Lycopene":0.09,"Calcium_Ca":28.42,"Iron_Fe":1.25,"Magnesium_Mg":24.4,"Phosphorus_P":197.69,"Potassium_K":342.03,"Sodium_Na":620.63,"Zinc_Zn":2.48,"Copper_Cu":0.06,"Manganese_Mn":0.11,"Selenium_Se":27.58,"Tryptophan":0.23,"Threonine":0.85,"Isoleucine":0.88,"Leucine":1.5,"Lysine":1.67,"Methionine":0.49,"Cystine":0.2,"Phenylalanine":0.74,"Tyrosine":0.64,"Valine":1.01,"Arginine":1.17,"Histidine":0.74,"Alanine":1.09,"AsparticAcid":1.74,"GlutamicAcid":2.94,"Glycine":0.89,"Proline":0.76,"Serine":0.77,"omega3":0.0,"omega6":0.0,"AddedSugars":1.07,"IntrinsicSugars":0.06},"addedSugars":0.4,"intrinsicSugars":0.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"7064","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.73,"yieldFactorFat":0.91,"sources":[{"ndb":"10219","name":"Pork, fresh, ground, raw","grams":37.8},{"ndb":"2038","name":"Spices, sage, ground","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.5},{"ndb":"2030","name":"Spices, pepper, black","grams":0.2},{"ndb":"2027","name":"Spices, oregano, dried","grams":0.1},{"ndb":"2020","name":"Spices, garlic powder","grams":0.1},{"ndb":"2026","name":"Spices, onion powder","grams":0.1},{"ndb":"2028","name":"Spices, paprika","grams":0.0},{"ndb":"10004","name":"Pork, fresh, backfat, raw","grams":2.7},{"ndb":"19334","name":"Sugars, brown","grams":0.4}],"sections":[{"section_key":"sausage","section_label":"Sausage","prep_method":"patty","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.73,"yield_factor_fat":0.91,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":503.77,"raw_water_grams":280.19,"raw_fat_grams":124.84,"final_grams":416.88}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'Pork sausage, link/patty, cooked, pan-fried', quantity: 'custom (g)', foodWord: 'PORKSAUSAGE', ndbNo: '7064', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'raw ground pork', quantity: '1 lb', section: 'sausage', ndbNo: '10219', portionDesc: 'g', portionGrams: 453.59 },
      { name: 'sage', quantity: '1 1/2 tsp dried or 1 1/2 Tbsp fresh chopped', section: 'sausage', ndbNo: '2038', portionDesc: 'g', portionGrams: 1.05 },
      { name: 'table salt', quantity: '1 teaspoon', section: 'sausage', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.0 },
      { name: 'ground black pepper', quantity: '1 teaspoon', section: 'sausage', ndbNo: '2030', portionDesc: 'g', portionGrams: 2.3 },
      { name: 'oregano', quantity: '1/2 tsp dried or 1 1/2 tsp fresh chopped', section: 'sausage', ndbNo: '2027', portionDesc: 'g', portionGrams: 0.9 },
      { name: 'garlic powder', quantity: '1/2 teaspoon', section: 'sausage', ndbNo: '2020', portionDesc: 'g', portionGrams: 1.55 },
      { name: 'onion powder', quantity: '1/2 teaspoon', section: 'sausage', ndbNo: '2026', portionDesc: 'g', portionGrams: 1.2 },
      { name: 'paprika', quantity: '1/4 teaspoon', section: 'sausage', ndbNo: '2028', portionDesc: 'g', portionGrams: 0.58 },
      { name: 'pork backfat (finely chopped)', quantity: '2 1/4 tablespoons finely chopped', section: 'sausage', ndbNo: '10004', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'brown sugar', quantity: '1 teaspoon packed', section: 'sausage', ndbNo: '19334', portionDesc: 'g', portionGrams: 4.6 }
    ],
    recipeInstructions: [
      'In a medium bowl, combine the ground sage, salt, black pepper, oregano, garlic powder, onion powder, paprika, and brown sugar. Whisk until evenly blended.',
      'Add the raw ground pork to the bowl with the spice mix. If using 80/20 ground pork, also add the finely chopped pork backfat. Using clean hands or a fork, mix gently but thoroughly until the spices and fat are evenly distributed — do not overwork, or the patties will be tough.',
      'Divide the seasoned pork into 12 equal portions (about 1.5 oz / 42 g each raw — they shrink to about 35 g cooked). Roll each into a ball, then flatten into a patty roughly 2 1/2 inches across and 1/3-inch thick. Press a small dimple into the center of each patty to prevent doming during cooking.',
      'For best flavor, cover and refrigerate the patties for at least 30 minutes (or overnight) to let the spices bloom and the pork firm up.',
      'Heat a large heavy skillet (cast iron preferred) over medium heat until hot. The pork has enough fat that no additional oil is needed.',
      'Place patties in the skillet without crowding. Cook 3–4 minutes per side, turning once, until deeply browned on both faces and an instant-read thermometer reads 160°F at the center. Total cook time about 7–8 minutes.',
      'Transfer cooked patties to a paper-towel-lined plate to drain briefly. Serve hot alongside eggs, biscuits, or as the protein in biscuits & gravy.'
    ],
    sections: [
      { key: 'sausage', label: 'Sausage', cookingMethod: '', yieldFactorWater: 0.73, yieldFactorFat: 0.91 }
    ],
  },
  {
    id: 'BKFST_012',
    name: 'Sausage Gravy',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 47,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 servings',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule G',
    nutritionJson: {"cal":202.1,"pro":10.1,"fat":14.4,"carb":7.6,"fib":0.3,"h2o":81.8,"sug":4.3,"perServing":{"cal":202.1,"pro":10.1,"fat":14.4,"carb":7.6,"fib":0.3,"h2o":81.8,"sug":4.3,"AddedSugars":0.4,"IntrinsicSugars":3.9},"micros":{"vitaminA":47.91,"vitaminC":0.16,"vitaminD":33.53,"vitaminE":0.15,"vitaminK":2.63,"vitaminB6":0.12,"vitaminB12":0.47,"thiamin":0.24,"riboflavin":0.18,"niacin":1.45,"folate":8.03,"calcium":74.28,"iron":0.57,"magnesium":14.25,"phosphorus":116.48,"potassium":187.86,"sodium":356.26,"zinc":1.06,"copper":0.04,"selenium":12.52,"cholesterol":39.56,"saturatedFat":5.7,"monoFat":4.65,"polyFat":0.73,"omega3":0.01,"omega6":0.06},"gramsPerServing":116.0,"servings":8,"per100g":{"Energy_KCal":174.29,"Water":70.53,"Protein":8.72,"TotalLipidFat":12.46,"Carbohydrate":6.59,"FiberTotalDietary":0.28,"SugarsTotal":3.71,"Cholesterol":39.56,"FattyAcids_totalSaturated":5.7,"FattyAcids_totalMonounsaturated":4.65,"FattyAcids_totalPolyunsaturated":0.73,"LinoleicAcid":0.06,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":47.91,"Retinol":45.7,"Carotene_beta":22.23,"VitaminD":33.53,"VitaminE_alphaTocopherol":0.15,"VitaminK_phylloquinone":2.63,"VitaminC_totalAscorbicAcid":0.16,"Thiamin":0.24,"Riboflavin":0.18,"Niacin":1.45,"PantothenicAcid":0.38,"VitaminB6":0.12,"Folate_total":8.03,"Folate_food":4.66,"Folate_DFE":10.4,"FolicAcid":5.19,"VitaminB12":0.47,"Choline_total":8.71,"Betaine":0.45,"LuteinZeaxanthin":10.76,"Lycopene":0.05,"Calcium_Ca":74.28,"Iron_Fe":0.57,"Magnesium_Mg":14.25,"Phosphorus_P":116.48,"Potassium_K":187.86,"Sodium_Na":356.26,"Zinc_Zn":1.06,"Copper_Cu":0.04,"Manganese_Mn":0.08,"Selenium_Se":12.52,"Tryptophan":0.11,"Threonine":0.38,"Isoleucine":0.41,"Leucine":0.72,"Lysine":0.74,"Methionine":0.22,"Cystine":0.08,"Phenylalanine":0.37,"Tyrosine":0.33,"Valine":0.48,"Arginine":0.46,"Histidine":0.31,"Alanine":0.44,"AsparticAcid":0.78,"GlutamicAcid":1.56,"Glycine":0.35,"Proline":0.5,"Serine":0.4,"omega3":0.01,"omega6":0.06,"AddedSugars":0.36,"IntrinsicSugars":3.35},"addedSugars":0.4,"intrinsicSugars":3.9,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.87,"yieldFactorFat":0.94,"sources":[{"ndb":"10219","name":"Pork, fresh, ground, raw","grams":42.5},{"ndb":"2038","name":"Spices, sage, ground","grams":0.1},{"ndb":"2047","name":"Salt, table","grams":0.6},{"ndb":"2030","name":"Spices, pepper, black","grams":0.2},{"ndb":"2027","name":"Spices, oregano, dried","grams":0.1},{"ndb":"2020","name":"Spices, garlic powder","grams":0.1},{"ndb":"2026","name":"Spices, onion powder","grams":0.1},{"ndb":"2028","name":"Spices, paprika","grams":0.1},{"ndb":"19334","name":"Sugars, brown","grams":0.4},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":3.9},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":76.2},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.1},{"ndb":"1001","name":"Butter, salted","grams":3.5}],"sections":[{"section_key":"sausage","section_label":"Browned pork sausage crumbles","prep_method":"crumbled","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.73,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":353.84,"raw_water_grams":208.29,"raw_fat_grams":72.35,"final_grams":297.6},{"section_key":"gravy","section_label":"Milk gravy","prep_method":"raw","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.92,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":673.8,"raw_water_grams":545.97,"raw_fat_grams":43.2,"final_grams":630.12}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Sausage Gravy', quantity: 'custom (g)', foodWord: 'SAUSAGEGRAVY', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'raw ground pork', quantity: '3/4 lb', section: 'sausage', ndbNo: '10219', portionDesc: 'g', portionGrams: 340.19 },
      { name: 'ground sage', quantity: 'scant 1 1/4 tsp dried', section: 'sausage', ndbNo: '2038', portionDesc: 'g', portionGrams: 0.79 },
      { name: 'table salt', quantity: '3/4 teaspoon', section: 'sausage', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'ground black pepper', quantity: '3/4 teaspoon', section: 'sausage', ndbNo: '2030', portionDesc: 'g', portionGrams: 1.73 },
      { name: 'dried oregano', quantity: 'scant 1/2 tsp dried', section: 'sausage', ndbNo: '2027', portionDesc: 'g', portionGrams: 0.68 },
      { name: 'garlic powder', quantity: 'scant 1/2 teaspoon', section: 'sausage', ndbNo: '2020', portionDesc: 'g', portionGrams: 1.16 },
      { name: 'onion powder', quantity: 'scant 1/2 teaspoon', section: 'sausage', ndbNo: '2026', portionDesc: 'g', portionGrams: 0.9 },
      { name: 'paprika', quantity: 'scant 1/4 teaspoon', section: 'sausage', ndbNo: '2028', portionDesc: 'g', portionGrams: 0.44 },
      { name: 'brown sugar', quantity: '3/4 teaspoon packed', section: 'sausage', ndbNo: '19334', portionDesc: 'g', portionGrams: 3.45 },
      { name: 'all-purpose flour', quantity: '1/4 cup', section: 'gravy', ndbNo: '20581', portionDesc: 'g', portionGrams: 31.25 },
      { name: 'whole milk', quantity: '2 1/2 cups', section: 'gravy', ndbNo: '1077', portionDesc: 'g', portionGrams: 610.0 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'gravy', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'freshly cracked black pepper', quantity: '1/2 teaspoon', section: 'gravy', ndbNo: '2030', portionDesc: 'g', portionGrams: 1.15 },
      { name: 'salted butter (for richness)', quantity: '2 tablespoons', section: 'gravy', ndbNo: '1001', portionDesc: 'g', portionGrams: 28.4 }
    ],
    recipeInstructions: [
      'In a large heavy skillet over medium heat, crumble in the seasoned ground pork (or pre-made BKFST_015 sausage). Cook 6–8 minutes, breaking into small pieces with a wooden spoon, until well-browned with no pink remaining.',
      'Transfer the browned sausage to a paper-towel-lined plate, leaving 1–2 tablespoons of rendered fat in the skillet. Discard excess fat or supplement with butter if needed.',
      'Add 2 tablespoons of butter to the rendered sausage fat over medium heat and let it melt. Whisk in the flour and cook the roux for about 1 minute, stirring constantly, until pale blonde and smooth.',
      'Gradually pour in the whole milk, whisking continuously to prevent lumps. Whisk in the salt and black pepper.',
      'Bring the gravy to a gentle simmer, whisking often, and cook 4–6 minutes until thickened to a pourable sauce that coats the back of a spoon.',
      'Return the browned sausage to the skillet and stir to combine. Simmer 1–2 minutes more to reheat. Taste and adjust salt and pepper.',
      'Serve hot over split biscuits.'
    ],
    sections: [
      { key: 'sausage', label: 'Browned pork sausage crumbles', cookingMethod: '', yieldFactorWater: 0.73 },
      { key: 'gravy', label: 'Milk gravy', cookingMethod: '', yieldFactorWater: 0.92 }
    ],
  },
  {
    id: 'BKFST_002',
    name: 'Biscuits & Gravy',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 48,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 servings',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":597.4,"pro":17.8,"fat":32.3,"carb":58.3,"fib":2.0,"h2o":113.8,"sug":6.7,"perServing":{"cal":597.4,"pro":17.8,"fat":32.3,"carb":58.3,"fib":2.0,"h2o":113.8,"sug":6.7,"AddedSugars":0.7,"IntrinsicSugars":6.1},"micros":{"vitaminA":31.18,"vitaminC":0.08,"vitaminD":25.58,"vitaminE":0.51,"vitaminK":4.33,"vitaminB6":0.07,"vitaminB12":0.31,"thiamin":0.29,"riboflavin":0.24,"niacin":2.12,"folate":44.92,"calcium":173.36,"iron":1.74,"magnesium":15.61,"phosphorus":253.59,"potassium":147.91,"sodium":435.24,"zinc":0.79,"copper":0.06,"selenium":16.28,"cholesterol":21.77,"saturatedFat":5.01,"monoFat":5.48,"polyFat":1.95,"omega3":0.01,"omega6":0.03},"gramsPerServing":228.0,"servings":4,"per100g":{"Energy_KCal":262.02,"Water":49.93,"Protein":7.8,"TotalLipidFat":14.16,"Carbohydrate":25.59,"FiberTotalDietary":0.88,"SugarsTotal":2.96,"Cholesterol":21.77,"FattyAcids_totalSaturated":5.01,"FattyAcids_totalMonounsaturated":5.48,"FattyAcids_totalPolyunsaturated":1.95,"LinoleicAcid":0.03,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":31.18,"Retinol":29.91,"Carotene_beta":12.45,"VitaminD":25.58,"VitaminE_alphaTocopherol":0.51,"VitaminK_phylloquinone":4.33,"VitaminC_totalAscorbicAcid":0.08,"Thiamin":0.29,"Riboflavin":0.24,"Niacin":2.12,"PantothenicAcid":0.35,"VitaminB6":0.07,"Folate_total":44.92,"Folate_food":9.43,"Folate_DFE":69.81,"FolicAcid":44.85,"VitaminB12":0.31,"Choline_total":6.71,"Betaine":0.34,"LuteinZeaxanthin":20.6,"Lycopene":0.03,"Calcium_Ca":173.36,"Iron_Fe":1.74,"Magnesium_Mg":15.61,"Phosphorus_P":253.59,"Potassium_K":147.91,"Sodium_Na":435.24,"Zinc_Zn":0.79,"Copper_Cu":0.06,"Manganese_Mn":0.23,"Selenium_Se":16.28,"Tryptophan":0.1,"Threonine":0.29,"Isoleucine":0.33,"Leucine":0.61,"Lysine":0.48,"Methionine":0.18,"Cystine":0.09,"Phenylalanine":0.36,"Tyrosine":0.28,"Valine":0.39,"Arginine":0.36,"Histidine":0.24,"Alanine":0.33,"AsparticAcid":0.56,"GlutamicAcid":1.87,"Glycine":0.29,"Proline":0.63,"Serine":0.38,"omega3":0.01,"omega6":0.03,"AddedSugars":0.29,"IntrinsicSugars":2.67},"addedSugars":0.7,"intrinsicSugars":6.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"","name":"Biscuit","grams":112.8},{"ndb":"","name":"Sausage Gravy","grams":115.2}],"sections":[{"section_key":"biscuit","section_label":"Biscuit","prep_method":"split","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":451.2,"raw_water_grams":130.35,"raw_fat_grams":71.74,"final_grams":451.2},{"section_key":"gravy","section_label":"Sausage gravy","prep_method":"ladled","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":460.8,"raw_water_grams":325.0,"raw_fat_grams":57.42,"final_grams":460.8}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Biscuits & Gravy', quantity: 'custom (g)', foodWord: 'BISCUITSGRAVY', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: '(2 per serving, 56.4 g ea.)', quantity: '8 biscuits', section: 'biscuit', foodWord: 'BISCUIT', ndbNo: '18016', portionDesc: 'g', portionGrams: 451.2, isDish: true, componentRef: 'BKFST_001' },
      { name: 'Sausage gravy (2 cups total; 1/2 cup per serving x 4 servings)', quantity: '2 cups', section: 'gravy', foodWord: 'SAUSAGEGRAVY', portionDesc: 'g', portionGrams: 460.8, isDish: true, componentRef: 'BKFST_012' }
    ],
    recipeInstructions: [
      'For each serving:',
      'Split 2 warm biscuits open and arrange on a plate.',
      'Ladle about 1/2 cup (115 g) of hot sausage gravy over the split biscuits. Serve immediately.'
    ],
    sections: [
      { key: 'biscuit', label: 'Biscuit', cookingMethod: '', yieldFactorWater: 1.0 },
      { key: 'gravy', label: 'Sausage gravy', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_004',
    name: 'English Muffin (Wheat)',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 49,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '10 muffins',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":120.9,"pro":4.5,"fat":1.1,"carb":24.1,"fib":2.4,"h2o":23.2,"sug":0.9,"perServing":{"cal":120.9,"pro":4.5,"fat":1.1,"carb":24.1,"fib":2.4,"h2o":23.2,"sug":0.9,"AddedSugars":0.1,"IntrinsicSugars":0.8},"micros":{"vitaminA":9.05,"vitaminC":0.0,"vitaminD":11.91,"vitaminE":0.21,"vitaminK":0.63,"vitaminB6":0.12,"vitaminB12":0.1,"thiamin":0.43,"riboflavin":0.28,"niacin":3.18,"folate":87.66,"calcium":43.56,"iron":2.39,"magnesium":48.84,"phosphorus":166.04,"potassium":186.43,"sodium":867.05,"zinc":1.2,"copper":0.17,"selenium":28.12,"cholesterol":2.46,"saturatedFat":0.64,"monoFat":0.4,"polyFat":0.37,"omega3":0.0,"omega6":0.0},"gramsPerServing":54.5,"servings":10,"per100g":{"Energy_KCal":221.75,"Water":42.49,"Protein":8.32,"TotalLipidFat":1.95,"Carbohydrate":44.16,"FiberTotalDietary":4.38,"SugarsTotal":1.62,"Cholesterol":2.46,"FattyAcids_totalSaturated":0.64,"FattyAcids_totalMonounsaturated":0.4,"FattyAcids_totalPolyunsaturated":0.37,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":9.05,"Retinol":8.85,"Carotene_beta":2.73,"VitaminD":11.91,"VitaminE_alphaTocopherol":0.21,"VitaminK_phylloquinone":0.63,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.43,"Riboflavin":0.28,"Niacin":3.18,"PantothenicAcid":0.54,"VitaminB6":0.12,"Folate_total":87.66,"Folate_food":55.02,"Folate_DFE":110.54,"FolicAcid":43.51,"VitaminB12":0.1,"Choline_total":11.73,"Betaine":20.79,"LuteinZeaxanthin":54.91,"Lycopene":0.0,"Calcium_Ca":43.56,"Iron_Fe":2.39,"Magnesium_Mg":48.84,"Phosphorus_P":166.04,"Potassium_K":186.43,"Sodium_Na":867.05,"Zinc_Zn":1.2,"Copper_Cu":0.17,"Manganese_Mn":1.35,"Selenium_Se":28.12,"Tryptophan":0.1,"Threonine":0.26,"Isoleucine":0.3,"Leucine":0.59,"Lysine":0.3,"Methionine":0.15,"Cystine":0.13,"Phenylalanine":0.42,"Tyrosine":0.23,"Valine":0.37,"Arginine":0.36,"Histidine":0.21,"Alanine":0.3,"AsparticAcid":0.48,"GlutamicAcid":2.52,"Glycine":0.32,"Proline":1.03,"Serine":0.41,"omega3":0.0,"omega6":0.0,"AddedSugars":0.18,"IntrinsicSugars":1.43},"addedSugars":0.1,"intrinsicSugars":0.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18264","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":1.0,"sources":[{"ndb":"20080","name":"Wheat flour, whole-grain","grams":15.4},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":15.4},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":13.4},{"ndb":"14411","name":"Water, tap, drinking","grams":13.6},{"ndb":"18375","name":"Leavening agents, yeast, baker's, active dry","grams":1.2},{"ndb":"2047","name":"Salt, table","grams":1.2},{"ndb":"19335","name":"Sugars, granulated","grams":0.1}],"sections":[{"section_key":"main","section_label":"English muffin dough","prep_method":"formed","cook_method":"grilled","cooking_method":"grilled","cooking_method_normalized":"grilled","yield_factor_water":0.8,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":603.0,"raw_water_grams":289.49,"raw_fat_grams":10.63,"final_grams":545.1}],"cookingMethod":"grilled"},
    recipeIngredients: [
      { name: 'English muffins, wheat', quantity: 'custom (g)', foodWord: 'ENGLISHMUFFINWT', ndbNo: '18264', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat flour', quantity: '1 1/4 cups', section: 'main', ndbNo: '20080', portionDesc: 'g', portionGrams: 154.0 },
      { name: 'all-purpose flour (unbleached)', quantity: '1 1/4 cups', section: 'main', ndbNo: '20581', portionDesc: 'g', portionGrams: 154.0 },
      { name: 'whole milk', quantity: '1/2 cup + 1 tablespoon', section: 'main', ndbNo: '1077', portionDesc: 'g', portionGrams: 134.0 },
      { name: 'water', quantity: '1/2 cup + 1 tablespoon', section: 'main', ndbNo: '14411', portionDesc: 'g', portionGrams: 136.0 },
      { name: 'active dry yeast', quantity: '4 teaspoons', section: 'main', ndbNo: '18375', portionDesc: 'g', portionGrams: 12.0 },
      { name: 'table salt', quantity: '2 teaspoons', section: 'main', ndbNo: '2047', portionDesc: 'g', portionGrams: 12.0 },
      { name: 'granulated sugar', quantity: '1/4 teaspoon', section: 'main', ndbNo: '19335', portionDesc: 'g', portionGrams: 1.0 }
    ],
    recipeInstructions: [
      'In a large bowl, whisk together the whole wheat flour, all-purpose flour, salt, and sugar.',
      'Warm the milk and water together to 110°F (just warm to the touch — not hot). Sprinkle in the active dry yeast and let stand 5 minutes until foamy.',
      'Pour the yeast mixture into the flour bowl. Stir with a wooden spoon until a shaggy, slightly sticky dough forms. Do not add extra flour — the dough should be soft.',
      'Turn dough out onto a lightly floured surface and knead 6–8 minutes until smooth and elastic. Shape into a ball, place in a lightly oiled bowl, cover with plastic wrap, and let rise in a warm spot 1–1.5 hours until doubled.',
      'Punch down the dough. On a lightly floured surface, pat or roll to about ½-inch thickness. Cut into rounds with a 3-inch biscuit cutter. You should get about 10 muffins.',
      'Arrange cut rounds on a cornmeal-dusted sheet pan. Cover loosely and let rest 20–30 minutes until slightly puffed.',
      'Heat a cast-iron skillet or griddle over medium-low heat. Cook muffins in batches 5–7 minutes per side, pressing gently, until deep golden brown on both faces and cooked through. Adjust heat as needed — too high scorches the outside before the center sets.',
      'Cool on a rack. To serve, split with a fork (never a knife) to preserve the characteristic nooks and crannies. Toast before eating.'
    ],
    sections: [
      { key: 'main', label: 'English muffin dough', cookingMethod: '', yieldFactorWater: 0.8 }
    ],
  },
  {
    id: 'BKFST_016',
    name: 'English Muffin (Thomas Style)',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 50,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '11 muffins',
    prepTime: '1 hr 30 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":141.1,"pro":4.5,"fat":1.1,"carb":27.7,"fib":1.1,"h2o":25.1,"sug":1.2,"perServing":{"cal":141.1,"pro":4.5,"fat":1.1,"carb":27.7,"fib":1.1,"h2o":25.1,"sug":1.2,"AddedSugars":0.0,"IntrinsicSugars":1.2},"micros":{"vitaminA":13.54,"vitaminC":0.0,"vitaminD":17.83,"vitaminE":0.12,"vitaminK":0.26,"vitaminB6":0.04,"vitaminB12":0.14,"thiamin":0.41,"riboflavin":0.35,"niacin":3.12,"folate":100.17,"calcium":51.09,"iron":2.74,"magnesium":17.16,"phosphorus":100.66,"potassium":121.22,"sodium":374.35,"zinc":0.63,"copper":0.09,"selenium":21.2,"cholesterol":3.68,"saturatedFat":0.78,"monoFat":0.39,"polyFat":0.23,"omega3":0.0,"omega6":0.0},"gramsPerServing":59.3,"servings":11,"per100g":{"Energy_KCal":237.99,"Water":42.38,"Protein":7.61,"TotalLipidFat":1.85,"Carbohydrate":46.66,"FiberTotalDietary":1.86,"SugarsTotal":2.02,"Cholesterol":3.68,"FattyAcids_totalSaturated":0.78,"FattyAcids_totalMonounsaturated":0.39,"FattyAcids_totalPolyunsaturated":0.23,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":13.54,"Retinol":13.25,"Carotene_beta":2.53,"VitaminD":17.83,"VitaminE_alphaTocopherol":0.12,"VitaminK_phylloquinone":0.26,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.41,"Riboflavin":0.35,"Niacin":3.12,"PantothenicAcid":0.43,"VitaminB6":0.04,"Folate_total":100.17,"Folate_food":32.88,"Folate_DFE":147.36,"FolicAcid":89.72,"VitaminB12":0.14,"Choline_total":5.04,"Betaine":0.26,"LuteinZeaxanthin":29.91,"Lycopene":0.0,"Calcium_Ca":51.09,"Iron_Fe":2.74,"Magnesium_Mg":17.16,"Phosphorus_P":100.66,"Potassium_K":121.22,"Sodium_Na":374.35,"Zinc_Zn":0.63,"Copper_Cu":0.09,"Manganese_Mn":0.4,"Selenium_Se":21.2,"Tryptophan":0.09,"Threonine":0.23,"Isoleucine":0.28,"Leucine":0.55,"Lysine":0.26,"Methionine":0.14,"Cystine":0.11,"Phenylalanine":0.38,"Tyrosine":0.25,"Valine":0.34,"Arginine":0.29,"Histidine":0.18,"Alanine":0.25,"AsparticAcid":0.39,"GlutamicAcid":2.35,"Glycine":0.26,"Proline":0.83,"Serine":0.39,"omega3":0.0,"omega6":0.0,"AddedSugars":0.0,"IntrinsicSugars":2.02},"addedSugars":0.0,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18639","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":34.5},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":21.8},{"ndb":"14411","name":"Water, tap, drinking","grams":4.5},{"ndb":"18375","name":"Leavening agents, yeast, baker's, active dry","grams":0.6},{"ndb":"2047","name":"Salt, table","grams":0.5}],"sections":[{"section_key":"muffin","section_label":"English muffin dough","prep_method":"formed","cook_method":"grilled","cooking_method":"grilled","cooking_method_normalized":"grilled","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":683.0,"raw_water_grams":307.13,"raw_fat_grams":12.06,"final_grams":652.29}],"cookingMethod":"grilled"},
    recipeIngredients: [
      { name: 'GEORGE WESTON BAKERIES, Thomas English Muffins', quantity: 'custom (g)', foodWord: 'ENGLISHMUFFIN', ndbNo: '18639', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '3 cups', section: 'muffin', ndbNo: '20581', portionDesc: 'g', portionGrams: 380.0 },
      { name: 'whole milk', quantity: '1 cup', section: 'muffin', ndbNo: '1077', portionDesc: 'g', portionGrams: 240.0 },
      { name: 'warm water', quantity: '3 tablespoons + 1 teaspoon', section: 'muffin', ndbNo: '14411', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'active dry yeast', quantity: '1 packet (2 1/4 tsp)', section: 'muffin', ndbNo: '18375', portionDesc: 'g', portionGrams: 7.0 },
      { name: 'table salt', quantity: '1 teaspoon', section: 'muffin', ndbNo: '2047', portionDesc: 'g', portionGrams: 6.0 }
    ],
    recipeInstructions: [
      'Warm the milk to about 110°F — it should feel warm but not hot. Add the 3 tablespoons + 1 teaspoon warm water. Sprinkle the yeast over the warm liquid and let stand 5 minutes until foamy and fragrant.',
      'In a large bowl, whisk together the flour and salt. Make a well in the center.',
      'Pour the yeast-milk mixture into the well. Stir with a wooden spoon until a shaggy dough forms, then continue mixing until no dry flour remains.',
      'Turn the dough onto a lightly floured surface and knead 5–7 minutes until smooth and slightly tacky but not sticky. The dough will be soft.',
      'Shape dough into a ball and place in a lightly oiled bowl. Cover with plastic wrap or a damp towel and let rise in a warm spot until doubled, about 1 hour.',
      'Punch down the dough. On a lightly floured surface, pat or roll to 3/4-inch thickness.',
      'Cut rounds with a floured 3-inch round cutter or glass. Re-pat scraps gently and cut remaining muffins. You should get about 11 muffins.',
      'Place rounds on the work surface, cover loosely, and let rest 15 minutes.',
      'Heat a dry cast-iron skillet or griddle over medium-low heat. Cook muffins in batches 7–8 minutes per side until both sides are deep golden brown and the centers feel firm. Adjust heat so they don\'t brown too quickly before cooking through.',
      'Transfer to a wire rack and cool at least 5 minutes. Split with a fork — never a knife — to preserve the classic nooks and crannies. Serve toasted or as-is.'
    ],
    sections: [
      { key: 'muffin', label: 'English muffin dough', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_006',
    name: 'Hollandaise Sauce',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 51,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 servings',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule G',
    nutritionJson: {"cal":224.8,"pro":2.2,"fat":24.1,"carb":0.8,"fib":0.0,"h2o":14.6,"sug":0.2,"perServing":{"cal":224.8,"pro":2.2,"fat":24.1,"carb":0.8,"fib":0.0,"h2o":14.6,"sug":0.2,"AddedSugars":0.0,"IntrinsicSugars":0.2},"micros":{"vitaminA":498.46,"vitaminC":2.9,"vitaminD":65.4,"vitaminE":2.07,"vitaminK":4.19,"vitaminB6":0.09,"vitaminB12":0.65,"thiamin":0.05,"riboflavin":0.17,"niacin":0.03,"folate":40.46,"calcium":51.02,"iron":0.8,"magnesium":3.13,"phosphorus":125.59,"potassium":54.53,"sodium":380.28,"zinc":0.71,"copper":0.02,"selenium":16.54,"cholesterol":454.5,"saturatedFat":33.69,"monoFat":16.13,"polyFat":2.78,"omega3":0.18,"omega6":1.23},"gramsPerServing":42.5,"servings":4,"per100g":{"Energy_KCal":529.0,"Water":34.45,"Protein":5.3,"TotalLipidFat":56.65,"Carbohydrate":1.8,"FiberTotalDietary":0.03,"SugarsTotal":0.46,"Cholesterol":454.5,"FattyAcids_totalSaturated":33.69,"FattyAcids_totalMonounsaturated":16.13,"FattyAcids_totalPolyunsaturated":2.78,"LinoleicAcid":1.23,"alphaLinolenicAcid":0.16,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.02,"VitaminA_RAE":498.46,"Retinol":488.2,"Carotene_beta":115.23,"VitaminD":65.4,"VitaminE_alphaTocopherol":2.07,"VitaminK_phylloquinone":4.19,"VitaminC_totalAscorbicAcid":2.9,"Thiamin":0.05,"Riboflavin":0.17,"Niacin":0.03,"PantothenicAcid":0.83,"VitaminB6":0.09,"Folate_total":40.46,"Folate_food":40.46,"Folate_DFE":40.46,"FolicAcid":0.0,"VitaminB12":0.65,"Choline_total":244.96,"Betaine":0.45,"LuteinZeaxanthin":280.25,"Lycopene":0.0,"Calcium_Ca":51.02,"Iron_Fe":0.8,"Magnesium_Mg":3.13,"Phosphorus_P":125.59,"Potassium_K":54.53,"Sodium_Na":380.28,"Zinc_Zn":0.71,"Copper_Cu":0.02,"Manganese_Mn":0.02,"Selenium_Se":16.54,"Tryptophan":0.06,"Threonine":0.22,"Isoleucine":0.29,"Leucine":0.47,"Lysine":0.4,"Methionine":0.12,"Cystine":0.08,"Phenylalanine":0.23,"Tyrosine":0.23,"Valine":0.31,"Arginine":0.35,"Histidine":0.13,"Alanine":0.26,"AsparticAcid":0.5,"GlutamicAcid":0.69,"Glycine":0.15,"Proline":0.24,"Serine":0.42,"omega3":0.18,"omega6":1.23,"AddedSugars":0.0,"IntrinsicSugars":0.46},"addedSugars":0.0,"intrinsicSugars":0.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"1001","name":"Butter, salted","grams":25.5},{"ndb":"1125","name":"Egg, yolk, raw, fresh","grams":12.8},{"ndb":"9152","name":"Lemon juice, raw","grams":4.2}],"sections":[{"section_key":"sauce","section_label":"Hollandaise sauce","prep_method":"whisked","cook_method":"steamed","cooking_method":"steamed","cooking_method_normalized":"steamed","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":170.0,"raw_water_grams":58.56,"raw_fat_grams":96.31,"final_grams":170.0}],"cookingMethod":"steamed"},
    recipeIngredients: [
      { name: 'Hollandaise Sauce', quantity: 'custom (g)', foodWord: 'HOLLANDAISESAUCE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'salted butter', quantity: '7 tablespoons', section: 'sauce', ndbNo: '1001', portionDesc: 'g', portionGrams: 102.0 },
      { name: 'egg yolks', quantity: '3 large yolks', section: 'sauce', ndbNo: '1125', portionDesc: 'g', portionGrams: 51.0 },
      { name: 'fresh lemon juice', quantity: '1 tablespoon + 1 teaspoon', section: 'sauce', ndbNo: '9152', portionDesc: 'g', portionGrams: 17.0 }
    ],
    recipeInstructions: [
      'Fill a small saucepan with 2 inches of water and bring to a gentle simmer. Place a heatproof bowl over the pan — the bottom should not touch the water.',
      'Separate 3 large eggs, keeping only the yolks. Add the yolks and lemon juice to the bowl. Whisk vigorously until pale, thick, and about doubled in volume, about 2 minutes.',
      'Melt the butter in a small saucepan over low heat. Keep warm but not hot.',
      'With the bowl over the barely simmering water, slowly drizzle the melted butter into the yolk mixture one tablespoon at a time, whisking constantly. Adding it too fast will break the emulsion.',
      'Once all the butter is incorporated, the sauce should be thick enough to coat the back of a spoon. Remove from heat immediately.',
      'Season with a pinch of salt. Serve right away over poached eggs, or keep warm by setting the bowl over the hot water (heat off) for up to 15 minutes, whisking occasionally.'
    ],
    sections: [
      { key: 'sauce', label: 'Hollandaise sauce', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_003',
    name: 'Eggs Benedict',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 52,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '2 servings',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule G',
    nutritionJson: {"cal":966.9,"pro":35.2,"fat":80.0,"carb":28.8,"fib":2.5,"h2o":182.6,"sug":2.4,"perServing":{"cal":966.9,"pro":35.2,"fat":80.0,"carb":28.8,"fib":2.5,"h2o":182.6,"sug":2.4,"AddedSugars":0.1,"IntrinsicSugars":2.2},"micros":{"vitaminA":223.75,"vitaminC":1.04,"vitaminD":51.05,"vitaminE":1.1,"vitaminK":1.7,"vitaminB6":0.11,"vitaminB12":0.48,"thiamin":0.16,"riboflavin":0.23,"niacin":1.55,"folate":36.82,"calcium":41.04,"iron":1.19,"magnesium":15.75,"phosphorus":164.55,"potassium":201.02,"sodium":488.35,"zinc":1.0,"copper":0.06,"selenium":25.78,"cholesterol":282.68,"saturatedFat":13.3,"monoFat":7.14,"polyFat":1.6,"omega3":0.08,"omega6":0.49},"gramsPerServing":334.0,"servings":2,"per100g":{"Energy_KCal":289.49,"Water":54.68,"Protein":10.54,"TotalLipidFat":23.97,"Carbohydrate":8.62,"FiberTotalDietary":0.76,"SugarsTotal":0.71,"Cholesterol":282.68,"FattyAcids_totalSaturated":13.3,"FattyAcids_totalMonounsaturated":7.14,"FattyAcids_totalPolyunsaturated":1.6,"LinoleicAcid":0.49,"alphaLinolenicAcid":0.06,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.02,"VitaminA_RAE":223.75,"Retinol":219.76,"Carotene_beta":41.87,"VitaminD":51.05,"VitaminE_alphaTocopherol":1.1,"VitaminK_phylloquinone":1.7,"VitaminC_totalAscorbicAcid":1.04,"Thiamin":0.16,"Riboflavin":0.23,"Niacin":1.55,"PantothenicAcid":0.79,"VitaminB6":0.11,"Folate_total":36.82,"Folate_food":31.25,"Folate_DFE":40.72,"FolicAcid":7.43,"VitaminB12":0.48,"Choline_total":161.28,"Betaine":4.38,"LuteinZeaxanthin":222.56,"Lycopene":0.0,"Calcium_Ca":41.04,"Iron_Fe":1.19,"Magnesium_Mg":15.75,"Phosphorus_P":164.55,"Potassium_K":201.02,"Sodium_Na":488.35,"Zinc_Zn":1.0,"Copper_Cu":0.06,"Manganese_Mn":0.24,"Selenium_Se":25.78,"Tryptophan":0.13,"Threonine":0.44,"Isoleucine":0.52,"Leucine":0.88,"Lysine":0.77,"Methionine":0.27,"Cystine":0.16,"Phenylalanine":0.5,"Tyrosine":0.41,"Valine":0.6,"Arginine":0.65,"Histidine":0.31,"Alanine":0.56,"AsparticAcid":0.98,"GlutamicAcid":1.7,"Glycine":0.39,"Proline":0.55,"Serine":0.65,"omega3":0.08,"omega6":0.49,"AddedSugars":0.03,"IntrinsicSugars":0.67},"addedSugars":0.1,"intrinsicSugars":2.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"1131","name":"Egg, whole, cooked, poached","grams":100.0},{"ndb":"","name":"English Muffin (Wheat)","grams":57.0},{"ndb":"10130","name":"Canadian bacon, unprepared","grams":57.0},{"ndb":"","name":"Hollandaise Sauce","grams":120.0}],"sections":[{"section_key":"egg","section_label":"Poached egg","prep_method":"poached","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":200.0,"raw_water_grams":151.7,"raw_fat_grams":18.94,"final_grams":200.0},{"section_key":"muffin","section_label":"English muffin (wheat)","prep_method":"toasted","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":114.0,"raw_water_grams":48.44,"raw_fat_grams":2.22,"final_grams":114.0},{"section_key":"bacon","section_label":"Canadian bacon","prep_method":"pan-fried","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":114.0,"raw_water_grams":82.47,"raw_fat_grams":2.99,"final_grams":114.0},{"section_key":"hollandaise","section_label":"Hollandaise sauce","prep_method":"spooned","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":240.0,"raw_water_grams":82.68,"raw_fat_grams":135.96,"final_grams":240.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Eggs Benedict', quantity: 'custom (g)', foodWord: 'EGGSBENEDICT', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'poached eggs', quantity: '4 large eggs', section: 'egg', ndbNo: '1131', portionDesc: 'g', portionGrams: 200.0 },
      { name: 'split in half', quantity: '2 English muffins', section: 'muffin', foodWord: 'ENGLISHMUFFINWT', ndbNo: '18264', portionDesc: 'g', portionGrams: 114.0, isDish: true, componentRef: 'BKFST_004' },
      { name: 'Canadian bacon', quantity: '4 slices', section: 'bacon', ndbNo: '10130', portionDesc: 'g', portionGrams: 114.0 },
      { name: 'hollandaise (4 x 1/4 cup)', quantity: '1 cup', section: 'hollandaise', foodWord: 'HOLLANDAISESAUCE', portionDesc: 'g', portionGrams: 240.0, isDish: true, componentRef: 'BKFST_006' }
    ],
    recipeInstructions: [
      'Fill a wide saucepan with about 3 inches of water, add a splash of white vinegar, and bring to a gentle simmer over medium heat. One at a time, crack each egg into a small cup and slide it gently into the simmering water. Poach for 3–4 minutes until the whites are fully set but the yolks are still runny. Remove with a slotted spoon and set aside on a warm plate.',
      'Split the English muffins in half. Spread a thin layer of butter on the cut sides and toast in a skillet over medium heat or under the broiler until golden brown.',
      'Heat a skillet over medium heat. Add the Canadian bacon slices and cook 1–2 minutes per side until lightly browned and heated through.',
      'If the hollandaise sauce has cooled, gently rewarm it by setting the bowl over a pot of warm (not simmering) water for a minute, stirring constantly. Do not overheat or the sauce will break.',
      'Place two toasted muffin halves on each plate. Lay a slice of Canadian bacon on each half, then set a poached egg on top.',
      'Spoon about 1/4 cup hollandaise sauce over each egg. Season with a pinch of salt, white pepper, and paprika if desired. Serve immediately.'
    ],
    sections: [
      { key: 'egg', label: 'Poached egg', cookingMethod: '', yieldFactorWater: 1.0 },
      { key: 'muffin', label: 'English muffin (wheat)', cookingMethod: '', yieldFactorWater: 1.0 },
      { key: 'bacon', label: 'Canadian bacon', cookingMethod: '', yieldFactorWater: 1.0 },
      { key: 'hollandaise', label: 'Hollandaise sauce', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_005',
    name: 'French Toast',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 53,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 slices',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":144.1,"pro":4.8,"fat":6.8,"carb":15.8,"fib":0.8,"h2o":33.2,"sug":2.6,"perServing":{"cal":144.1,"pro":4.8,"fat":6.8,"carb":15.8,"fib":0.8,"h2o":33.2,"sug":2.6,"AddedSugars":0.0,"IntrinsicSugars":2.6},"micros":{"vitaminA":84.91,"vitaminC":0.03,"vitaminD":28.96,"vitaminE":0.39,"vitaminK":0.73,"vitaminB6":0.06,"vitaminB12":0.29,"thiamin":0.21,"riboflavin":0.24,"niacin":1.89,"folate":48.84,"calcium":117.42,"iron":2.12,"magnesium":16.89,"phosphorus":115.81,"potassium":130.89,"sodium":452.49,"zinc":0.76,"copper":0.06,"selenium":17.7,"cholesterol":95.85,"saturatedFat":5.69,"monoFat":2.97,"polyFat":1.08,"omega3":0.08,"omega6":0.41},"gramsPerServing":61.8,"servings":4,"per100g":{"Energy_KCal":233.31,"Water":53.77,"Protein":7.85,"TotalLipidFat":11.0,"Carbohydrate":25.52,"FiberTotalDietary":1.31,"SugarsTotal":4.27,"Cholesterol":95.85,"FattyAcids_totalSaturated":5.69,"FattyAcids_totalMonounsaturated":2.97,"FattyAcids_totalPolyunsaturated":1.08,"LinoleicAcid":0.41,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":84.91,"Retinol":84.02,"Carotene_beta":11.65,"VitaminD":28.96,"VitaminE_alphaTocopherol":0.39,"VitaminK_phylloquinone":0.73,"VitaminC_totalAscorbicAcid":0.03,"Thiamin":0.21,"Riboflavin":0.24,"Niacin":1.89,"PantothenicAcid":0.54,"VitaminB6":0.06,"Folate_total":48.84,"Folate_food":17.5,"Folate_DFE":70.7,"FolicAcid":41.78,"VitaminB12":0.29,"Choline_total":65.53,"Betaine":49.85,"LuteinZeaxanthin":80.08,"Lycopene":0.0,"Calcium_Ca":117.42,"Iron_Fe":2.12,"Magnesium_Mg":16.89,"Phosphorus_P":115.81,"Potassium_K":130.89,"Sodium_Na":452.49,"Zinc_Zn":0.76,"Copper_Cu":0.06,"Manganese_Mn":0.26,"Selenium_Se":17.7,"Tryptophan":0.04,"Threonine":0.15,"Isoleucine":0.19,"Leucine":0.31,"Lysine":0.27,"Methionine":0.1,"Cystine":0.05,"Phenylalanine":0.19,"Tyrosine":0.15,"Valine":0.24,"Arginine":0.19,"Histidine":0.09,"Alanine":0.18,"AsparticAcid":0.35,"GlutamicAcid":0.56,"Glycine":0.1,"Proline":0.2,"Serine":0.25,"omega3":0.08,"omega6":0.41,"AddedSugars":0.0,"IntrinsicSugars":4.27},"addedSugars":0.0,"intrinsicSugars":2.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18269","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":30.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":12.5},{"ndb":"1079","name":"Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D","grams":17.5},{"ndb":"1001","name":"Butter, salted","grams":5.2},{"ndb":"2047","name":"Salt, table","grams":0.2}],"sections":[{"section_key":"main","section_label":"French toast","prep_method":"dipped","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":261.75,"raw_water_grams":147.56,"raw_fat_grams":27.17,"final_grams":246.99}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'French toast, prepared from recipe, made with low fat (2%) milk', quantity: 'custom (g)', foodWord: 'FRENCHTOAST', ndbNo: '18269', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white sandwich bread', quantity: '4 slices', section: 'main', ndbNo: '18069', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'large egg, beaten', quantity: '1 large egg, beaten', section: 'main', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: '2% milk', quantity: '¼ cup', section: 'main', ndbNo: '1079', portionDesc: 'g', portionGrams: 70.0 },
      { name: 'butter', quantity: '1½ tablespoons', section: 'main', ndbNo: '1001', portionDesc: 'g', portionGrams: 21.0 },
      { name: 'salt', quantity: '⅛ tsp', section: 'main', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 }
    ],
    recipeInstructions: [
      'Whisk together the egg, milk, and salt in a shallow bowl until well combined.',
      'Dip each slice of bread into the egg mixture, letting it soak for about 10–15 seconds per side so the bread absorbs the custard.',
      'Melt the butter in a skillet or griddle over medium heat until foamy.',
      'Place the soaked bread slices in the pan and cook until golden brown on the bottom, about 2–3 minutes.',
      'Flip and cook the second side until golden brown, about 2 minutes more. Serve immediately.'
    ],
    sections: [
      { key: 'main', label: 'French toast', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_007',
    name: 'Oatmeal',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 54,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule C',
    nutritionJson: {"cal":151.6,"pro":5.3,"fat":2.6,"carb":27.1,"fib":4.0,"h2o":183.2,"sug":0.4,"perServing":{"cal":151.6,"pro":5.3,"fat":2.6,"carb":27.1,"fib":4.0,"h2o":183.2,"sug":0.4,"AddedSugars":0.0,"IntrinsicSugars":0.4},"micros":{"vitaminA":0.0,"vitaminC":0.0,"vitaminD":0.0,"vitaminE":0.07,"vitaminK":0.35,"vitaminB6":0.01,"vitaminB12":0.0,"thiamin":0.05,"riboflavin":0.02,"niacin":0.13,"folate":3.8,"calcium":10.83,"iron":0.62,"magnesium":21.02,"phosphorus":63.61,"potassium":52.86,"sodium":4.61,"zinc":0.57,"copper":0.07,"selenium":5.01,"cholesterol":0.0,"saturatedFat":0.2,"monoFat":0.36,"polyFat":0.36,"omega3":0.0,"omega6":0.0},"gramsPerServing":219.1,"servings":1,"per100g":{"Energy_KCal":69.18,"Water":83.62,"Protein":2.4,"TotalLipidFat":1.19,"Carbohydrate":12.36,"FiberTotalDietary":1.84,"SugarsTotal":0.18,"Cholesterol":0.0,"FattyAcids_totalSaturated":0.2,"FattyAcids_totalMonounsaturated":0.36,"FattyAcids_totalPolyunsaturated":0.36,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":0.0,"Retinol":0.0,"Carotene_beta":0.0,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.07,"VitaminK_phylloquinone":0.35,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.05,"Riboflavin":0.02,"Niacin":0.13,"PantothenicAcid":0.14,"VitaminB6":0.01,"Folate_total":3.8,"Folate_food":3.8,"Folate_DFE":3.8,"FolicAcid":0.0,"VitaminB12":0.0,"Choline_total":6.27,"Betaine":0.0,"LuteinZeaxanthin":24.64,"Lycopene":0.0,"Calcium_Ca":10.83,"Iron_Fe":0.62,"Magnesium_Mg":21.02,"Phosphorus_P":63.61,"Potassium_K":52.86,"Sodium_Na":4.61,"Zinc_Zn":0.57,"Copper_Cu":0.07,"Manganese_Mn":0.63,"Selenium_Se":5.01,"Tryptophan":0.03,"Threonine":0.07,"Isoleucine":0.09,"Leucine":0.18,"Lysine":0.11,"Methionine":0.04,"Cystine":0.08,"Phenylalanine":0.12,"Tyrosine":0.07,"Valine":0.12,"Arginine":0.16,"Histidine":0.05,"Alanine":0.1,"AsparticAcid":0.22,"GlutamicAcid":0.52,"Glycine":0.12,"Proline":0.08,"Serine":0.13,"omega3":0.0,"omega6":0.0,"AddedSugars":0.0,"IntrinsicSugars":0.18},"addedSugars":0.0,"intrinsicSugars":0.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"8121","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.76,"yieldFactorFat":1.0,"sources":[{"ndb":"8120","name":"Cereals, oats, regular and quick, not fortified, dry","grams":40.0},{"ndb":"14411","name":"Water, tap, drinking","grams":237.0}],"sections":[{"section_key":"oatmeal","section_label":"Oatmeal","prep_method":"raw","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.76,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":277.0,"raw_water_grams":241.1,"raw_fat_grams":2.61,"final_grams":219.14}],"cookingMethod":"boiled"},
    recipeIngredients: [
      { name: 'Cereals, oats, regular and quick, unenriched, cooked with water (includes boiling and microwaving), without salt', quantity: 'custom (g)', foodWord: 'CEREALOATS', ndbNo: '8121', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rolled oats', quantity: '½ cup', section: 'oatmeal', ndbNo: '8120', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'water', quantity: '1 cup', section: 'oatmeal', ndbNo: '14411', portionDesc: 'g', portionGrams: 237.0 }
    ],
    recipeInstructions: [
      'Bring the water to a boil in a small saucepan over medium-high heat.',
      'Stir in the rolled oats. Reduce heat to medium-low.',
      'Cook, stirring occasionally, for 5 minutes until the oats are tender and most of the water is absorbed.',
      'Remove from heat and let stand 1–2 minutes before serving.'
    ],
    sections: [
      { key: 'oatmeal', label: 'Oatmeal', cookingMethod: '', yieldFactorWater: 0.76 }
    ],
  },
  {
    id: 'BKFST_010',
    name: 'Pancakes plain',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 55,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 pancakes',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":226.9,"pro":6.2,"fat":9.7,"carb":28.7,"fib":0.8,"h2o":52.6,"sug":5.4,"perServing":{"cal":226.9,"pro":6.2,"fat":9.7,"carb":28.7,"fib":0.8,"h2o":52.6,"sug":5.4,"AddedSugars":3.0,"IntrinsicSugars":2.4},"micros":{"vitaminA":77.99,"vitaminC":0.0,"vitaminD":31.91,"vitaminE":0.32,"vitaminK":0.76,"vitaminB6":0.03,"vitaminB12":0.28,"thiamin":0.18,"riboflavin":0.25,"niacin":1.46,"folate":47.49,"calcium":234.71,"iron":1.89,"magnesium":13.74,"phosphorus":325.73,"potassium":111.94,"sodium":418.06,"zinc":0.55,"copper":0.06,"selenium":15.81,"cholesterol":68.82,"saturatedFat":5.52,"monoFat":2.59,"polyFat":0.52,"omega3":0.02,"omega6":0.3},"gramsPerServing":100.0,"servings":4,"per100g":{"Energy_KCal":226.96,"Water":52.63,"Protein":6.18,"TotalLipidFat":9.66,"Carbohydrate":28.74,"FiberTotalDietary":0.81,"SugarsTotal":5.44,"Cholesterol":68.82,"FattyAcids_totalSaturated":5.52,"FattyAcids_totalMonounsaturated":2.59,"FattyAcids_totalPolyunsaturated":0.52,"LinoleicAcid":0.3,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":77.99,"Retinol":76.77,"Carotene_beta":13.23,"VitaminD":31.91,"VitaminE_alphaTocopherol":0.32,"VitaminK_phylloquinone":0.76,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.18,"Riboflavin":0.25,"Niacin":1.46,"PantothenicAcid":0.4,"VitaminB6":0.03,"Folate_total":47.49,"Folate_food":12.83,"Folate_DFE":71.8,"FolicAcid":46.21,"VitaminB12":0.28,"Choline_total":40.34,"Betaine":0.34,"LuteinZeaxanthin":56.28,"Lycopene":0.0,"Calcium_Ca":234.71,"Iron_Fe":1.89,"Magnesium_Mg":13.74,"Phosphorus_P":325.73,"Potassium_K":111.94,"Sodium_Na":418.06,"Zinc_Zn":0.55,"Copper_Cu":0.06,"Manganese_Mn":0.21,"Selenium_Se":15.81,"Tryptophan":0.08,"Threonine":0.21,"Isoleucine":0.27,"Leucine":0.49,"Lysine":0.3,"Methionine":0.14,"Cystine":0.09,"Phenylalanine":0.32,"Tyrosine":0.23,"Valine":0.32,"Arginine":0.27,"Histidine":0.15,"Alanine":0.24,"AsparticAcid":0.42,"GlutamicAcid":1.58,"Glycine":0.19,"Proline":0.57,"Serine":0.36,"omega3":0.02,"omega6":0.3,"AddedSugars":2.99,"IntrinsicSugars":2.44},"addedSugars":3.0,"intrinsicSugars":2.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18293","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.96,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":30.0},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":2.3},{"ndb":"19335","name":"Sugars, granulated","grams":3.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":12.5},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":45.8},{"ndb":"1001","name":"Butter, salted","grams":8.2}],"sections":[{"section_key":"batter","section_label":"Pancake batter","prep_method":"raw","cook_method":"grilled","cooking_method":"grilled","cooking_method_normalized":"grilled","yield_factor_water":0.96,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":408.7,"raw_water_grams":219.27,"raw_fat_grams":38.64,"final_grams":399.93}],"cookingMethod":"grilled"},
    recipeIngredients: [
      { name: 'Pancakes, plain, prepared from recipe', quantity: 'custom (g)', foodWord: 'PANCAKEPLAIN', ndbNo: '18293', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 cup', section: 'batter', ndbNo: '20581', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'baking powder', quantity: '2 tsp', section: 'batter', ndbNo: '18370', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'sugar', quantity: '1 tbsp', section: 'batter', ndbNo: '19335', portionDesc: 'g', portionGrams: 12.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'batter', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'egg', quantity: '1 large', section: 'batter', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'whole milk', quantity: '¾ cup', section: 'batter', ndbNo: '1077', portionDesc: 'g', portionGrams: 183.0 },
      { name: 'butter (melted)', quantity: '2 tbsp + 1 tsp', section: 'batter', ndbNo: '1001', portionDesc: 'g', portionGrams: 33.0 }
    ],
    recipeInstructions: [
      'Whisk together the flour, baking powder, sugar, and salt in a large bowl.',
      'In a separate bowl, beat the egg, then stir in the milk and melted butter.',
      'Pour the wet ingredients into the dry and stir just until combined; a few lumps are fine.',
      'Heat a lightly greased griddle or skillet over medium heat. Pour ¼ cup batter per pancake and cook until bubbles form on the surface and edges look set, about 2 minutes. Flip and cook until golden brown, about 1–2 minutes more.'
    ],
    sections: [
      { key: 'batter', label: 'Pancake batter', cookingMethod: '', yieldFactorWater: 0.96 }
    ],
  },
  {
    id: 'BKFST_008',
    name: 'Pancakes blueberry',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 56,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 pancakes',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":237.5,"pro":6.3,"fat":9.7,"carb":31.4,"fib":1.3,"h2o":57.0,"sug":7.3,"perServing":{"cal":237.5,"pro":6.3,"fat":9.7,"carb":31.4,"fib":1.3,"h2o":57.0,"sug":7.3,"AddedSugars":3.0,"IntrinsicSugars":4.3},"micros":{"vitaminA":73.09,"vitaminC":0.84,"vitaminD":29.73,"vitaminE":0.37,"vitaminK":3.7,"vitaminB6":0.04,"vitaminB12":0.26,"thiamin":0.17,"riboflavin":0.24,"niacin":1.41,"folate":45.03,"calcium":219.74,"iron":1.81,"magnesium":13.84,"phosphorus":305.59,"potassium":117.59,"sodium":389.72,"zinc":0.54,"copper":0.06,"selenium":14.75,"cholesterol":64.13,"saturatedFat":5.15,"monoFat":2.42,"polyFat":0.51,"omega3":0.02,"omega6":0.28},"gramsPerServing":107.3,"servings":4,"per100g":{"Energy_KCal":221.31,"Water":53.14,"Protein":5.89,"TotalLipidFat":9.06,"Carbohydrate":29.28,"FiberTotalDietary":1.17,"SugarsTotal":6.78,"Cholesterol":64.13,"FattyAcids_totalSaturated":5.15,"FattyAcids_totalMonounsaturated":2.42,"FattyAcids_totalPolyunsaturated":0.51,"LinoleicAcid":0.28,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":73.09,"Retinol":71.53,"Carotene_beta":16.74,"VitaminD":29.73,"VitaminE_alphaTocopherol":0.37,"VitaminK_phylloquinone":3.7,"VitaminC_totalAscorbicAcid":0.84,"Thiamin":0.17,"Riboflavin":0.24,"Niacin":1.41,"PantothenicAcid":0.39,"VitaminB6":0.04,"Folate_total":45.03,"Folate_food":12.74,"Folate_DFE":67.67,"FolicAcid":43.06,"VitaminB12":0.26,"Choline_total":38.52,"Betaine":0.35,"LuteinZeaxanthin":61.41,"Lycopene":0.0,"Calcium_Ca":219.74,"Iron_Fe":1.81,"Magnesium_Mg":13.84,"Phosphorus_P":305.59,"Potassium_K":117.59,"Sodium_Na":389.72,"Zinc_Zn":0.54,"Copper_Cu":0.06,"Manganese_Mn":0.25,"Selenium_Se":14.75,"Tryptophan":0.07,"Threonine":0.2,"Isoleucine":0.25,"Leucine":0.46,"Lysine":0.28,"Methionine":0.13,"Cystine":0.08,"Phenylalanine":0.3,"Tyrosine":0.21,"Valine":0.31,"Arginine":0.26,"Histidine":0.14,"Alanine":0.23,"AsparticAcid":0.4,"GlutamicAcid":1.49,"Glycine":0.19,"Proline":0.53,"Serine":0.34,"omega3":0.02,"omega6":0.28,"AddedSugars":2.79,"IntrinsicSugars":3.99},"addedSugars":3.0,"intrinsicSugars":4.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18294","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.81,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":30.0},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":2.3},{"ndb":"19335","name":"Sugars, granulated","grams":3.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":12.5},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":45.8},{"ndb":"1001","name":"Butter, salted","grams":8.2},{"ndb":"9050","name":"Blueberries, raw","grams":18.5}],"sections":[{"section_key":"batter","section_label":"Pancake batter","prep_method":"raw","cook_method":"grilled","cooking_method":"grilled","cooking_method_normalized":"grilled","yield_factor_water":0.81,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":482.7,"raw_water_grams":281.58,"raw_fat_grams":38.89,"final_grams":429.2}],"cookingMethod":"grilled"},
    recipeIngredients: [
      { name: 'Pancakes, blueberry, prepared from recipe', quantity: 'custom (g)', foodWord: 'PANCAKEBLUEBERRY', ndbNo: '18294', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 cup', section: 'batter', ndbNo: '20581', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'baking powder', quantity: '2 tsp', section: 'batter', ndbNo: '18370', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'sugar', quantity: '1 tbsp', section: 'batter', ndbNo: '19335', portionDesc: 'g', portionGrams: 12.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'batter', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'egg', quantity: '1 large', section: 'batter', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'whole milk', quantity: '¾ cup', section: 'batter', ndbNo: '1077', portionDesc: 'g', portionGrams: 183.0 },
      { name: 'butter (melted)', quantity: '2 tbsp + 1 tsp', section: 'batter', ndbNo: '1001', portionDesc: 'g', portionGrams: 33.0 },
      { name: 'fresh blueberries', quantity: '½ cup', section: 'batter', ndbNo: '9050', portionDesc: 'g', portionGrams: 74.0 }
    ],
    recipeInstructions: [
      'Whisk together the flour, baking powder, sugar, and salt in a large bowl.',
      'In a separate bowl, beat the egg, then stir in the milk and melted butter.',
      'Pour the wet ingredients into the dry and stir just until combined; a few lumps are fine. Gently fold in the blueberries.',
      'Heat a lightly greased griddle or skillet over medium heat. Pour ¼ cup batter per pancake and cook until bubbles form on the surface and edges look set, about 2 minutes. Flip and cook until golden brown, about 1–2 minutes more.'
    ],
    sections: [
      { key: 'batter', label: 'Pancake batter', cookingMethod: '', yieldFactorWater: 0.81 }
    ],
  },
  {
    id: 'BKFST_009',
    name: 'Pancakes buttermilk',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 57,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 pancakes',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":228.7,"pro":6.7,"fat":9.3,"carb":29.5,"fib":0.8,"h2o":53.2,"sug":6.1,"perServing":{"cal":228.7,"pro":6.7,"fat":9.3,"carb":29.5,"fib":0.8,"h2o":53.2,"sug":6.1,"AddedSugars":3.0,"IntrinsicSugars":3.1},"micros":{"vitaminA":76.71,"vitaminC":0.0,"vitaminD":39.39,"vitaminE":0.3,"vitaminK":0.72,"vitaminB6":0.04,"vitaminB12":0.34,"thiamin":0.18,"riboflavin":0.27,"niacin":1.45,"folate":47.31,"calcium":249.32,"iron":1.86,"magnesium":15.04,"phosphorus":333.92,"potassium":131.93,"sodium":448.37,"zinc":0.6,"copper":0.06,"selenium":16.12,"cholesterol":67.47,"saturatedFat":5.16,"monoFat":2.44,"polyFat":0.51,"omega3":0.02,"omega6":0.27},"gramsPerServing":101.5,"servings":4,"per100g":{"Energy_KCal":225.29,"Water":52.36,"Protein":6.6,"TotalLipidFat":9.13,"Carbohydrate":29.09,"FiberTotalDietary":0.8,"SugarsTotal":6.02,"Cholesterol":67.47,"FattyAcids_totalSaturated":5.16,"FattyAcids_totalMonounsaturated":2.44,"FattyAcids_totalPolyunsaturated":0.51,"LinoleicAcid":0.27,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":76.71,"Retinol":75.5,"Carotene_beta":12.45,"VitaminD":39.39,"VitaminE_alphaTocopherol":0.3,"VitaminK_phylloquinone":0.72,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.18,"Riboflavin":0.27,"Niacin":1.45,"PantothenicAcid":0.44,"VitaminB6":0.04,"Folate_total":47.31,"Folate_food":13.19,"Folate_DFE":71.25,"FolicAcid":45.5,"VitaminB12":0.34,"Choline_total":41.66,"Betaine":0.06,"LuteinZeaxanthin":55.43,"Lycopene":0.0,"Calcium_Ca":249.32,"Iron_Fe":1.86,"Magnesium_Mg":15.04,"Phosphorus_P":333.92,"Potassium_K":131.93,"Sodium_Na":448.37,"Zinc_Zn":0.6,"Copper_Cu":0.06,"Manganese_Mn":0.21,"Selenium_Se":16.12,"Tryptophan":0.08,"Threonine":0.23,"Isoleucine":0.29,"Leucine":0.53,"Lysine":0.34,"Methionine":0.15,"Cystine":0.09,"Phenylalanine":0.34,"Tyrosine":0.25,"Valine":0.36,"Arginine":0.28,"Histidine":0.16,"Alanine":0.25,"AsparticAcid":0.46,"GlutamicAcid":1.68,"Glycine":0.2,"Proline":0.61,"Serine":0.39,"omega3":0.02,"omega6":0.27,"AddedSugars":2.95,"IntrinsicSugars":3.07},"addedSugars":3.0,"intrinsicSugars":3.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18390","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.78,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":30.0},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":2.3},{"ndb":"19335","name":"Sugars, granulated","grams":3.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":12.5},{"ndb":"1230","name":"Milk, buttermilk, fluid, whole","grams":61.2},{"ndb":"1001","name":"Butter, salted","grams":7.1}],"sections":[{"section_key":"batter","section_label":"Pancake batter","prep_method":"raw","cook_method":"grilled","cooking_method":"grilled","cooking_method_normalized":"grilled","yield_factor_water":0.78,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":466.1,"raw_water_grams":272.64,"raw_fat_grams":37.08,"final_grams":406.12}],"cookingMethod":"grilled"},
    recipeIngredients: [
      { name: 'Pancakes, buttermilk, prepared from recipe', quantity: 'custom (g)', foodWord: 'PANCAKE', ndbNo: '18390', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour (AP)', quantity: '1 cup', section: 'batter', ndbNo: '20581', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'baking powder', quantity: '2 tsp', section: 'batter', ndbNo: '18370', portionDesc: 'g', portionGrams: 9.2 },
      { name: 'sugar', quantity: '1 tbsp', section: 'batter', ndbNo: '19335', portionDesc: 'g', portionGrams: 12.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'batter', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'egg', quantity: '1 large', section: 'batter', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'whole buttermilk', quantity: '1 cup', section: 'batter', ndbNo: '1230', portionDesc: 'g', portionGrams: 245.0 },
      { name: 'butter (melted)', quantity: '2 tbsp', section: 'batter', ndbNo: '1001', portionDesc: 'g', portionGrams: 28.4 }
    ],
    recipeInstructions: [
      'Whisk together the flour, baking powder, sugar, and salt in a large bowl.',
      'In a separate bowl, beat the egg, then stir in the buttermilk and melted butter.',
      'Pour the wet ingredients into the dry and stir just until combined; a few lumps are fine.',
      'Heat a lightly greased griddle or skillet over medium heat. Pour ¼ cup batter per pancake and cook until bubbles form on the surface and edges look set, about 2 minutes. Flip and cook until golden brown, about 1–2 minutes more.'
    ],
    sections: [
      { key: 'batter', label: 'Pancake batter', cookingMethod: '', yieldFactorWater: 0.78 }
    ],
  },
  {
    id: 'BKFST_014',
    name: 'Waffles plain',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 58,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 waffles',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule B',
    nutritionJson: {"cal":476.1,"pro":12.4,"fat":23.2,"carb":54.2,"fib":1.6,"h2o":68.4,"sug":7.9,"perServing":{"cal":476.1,"pro":12.4,"fat":23.2,"carb":54.2,"fib":1.6,"h2o":68.4,"sug":7.9,"AddedSugars":3.0,"IntrinsicSugars":4.9},"micros":{"vitaminA":111.49,"vitaminC":0.0,"vitaminD":39.04,"vitaminE":0.44,"vitaminK":1.11,"vitaminB6":0.04,"vitaminB12":0.35,"thiamin":0.22,"riboflavin":0.31,"niacin":1.78,"folate":58.17,"calcium":236.09,"iron":2.23,"magnesium":16.6,"phosphorus":329.44,"potassium":137.61,"sodium":563.73,"zinc":0.67,"copper":0.07,"selenium":19.36,"cholesterol":90.52,"saturatedFat":8.27,"monoFat":3.78,"polyFat":0.71,"omega3":0.03,"omega6":0.41},"gramsPerServing":163.4,"servings":4,"per100g":{"Energy_KCal":291.27,"Water":41.86,"Protein":7.59,"TotalLipidFat":14.2,"Carbohydrate":33.16,"FiberTotalDietary":1.0,"SugarsTotal":4.82,"Cholesterol":90.52,"FattyAcids_totalSaturated":8.27,"FattyAcids_totalMonounsaturated":3.78,"FattyAcids_totalPolyunsaturated":0.71,"LinoleicAcid":0.41,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":111.49,"Retinol":109.69,"Carotene_beta":19.9,"VitaminD":39.04,"VitaminE_alphaTocopherol":0.44,"VitaminK_phylloquinone":1.11,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.22,"Riboflavin":0.31,"Niacin":1.78,"PantothenicAcid":0.49,"VitaminB6":0.04,"Folate_total":58.17,"Folate_food":15.77,"Folate_DFE":87.9,"FolicAcid":56.53,"VitaminB12":0.35,"Choline_total":49.86,"Betaine":0.42,"LuteinZeaxanthin":68.86,"Lycopene":0.0,"Calcium_Ca":236.09,"Iron_Fe":2.23,"Magnesium_Mg":16.6,"Phosphorus_P":329.44,"Potassium_K":137.61,"Sodium_Na":563.73,"Zinc_Zn":0.67,"Copper_Cu":0.07,"Manganese_Mn":0.26,"Selenium_Se":19.36,"Tryptophan":0.09,"Threonine":0.26,"Isoleucine":0.33,"Leucine":0.6,"Lysine":0.37,"Methionine":0.17,"Cystine":0.11,"Phenylalanine":0.39,"Tyrosine":0.28,"Valine":0.4,"Arginine":0.33,"Histidine":0.18,"Alanine":0.29,"AsparticAcid":0.52,"GlutamicAcid":1.94,"Glycine":0.24,"Proline":0.7,"Serine":0.45,"omega3":0.03,"omega6":0.41,"AddedSugars":1.83,"IntrinsicSugars":2.99},"addedSugars":3.0,"intrinsicSugars":4.9,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"18367","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.62,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":60.0},{"ndb":"18370","name":"Leavening agents, baking powder, double-acting, straight phosphate","grams":3.5},{"ndb":"19335","name":"Sugars, granulated","grams":3.0},{"ndb":"2047","name":"Salt, table","grams":1.1},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":25.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":91.5},{"ndb":"1001","name":"Butter, salted","grams":21.3}],"sections":[{"section_key":"batter","section_label":"Waffle batter","prep_method":"raw","cook_method":"grilled","cooking_method":"grilled","cooking_method_normalized":"grilled","yield_factor_water":0.62,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":821.5,"raw_water_grams":441.4,"raw_fat_grams":92.86,"final_grams":653.77}],"cookingMethod":"grilled"},
    recipeIngredients: [
      { name: 'Waffles, plain, prepared from recipe', quantity: 'custom (g)', foodWord: 'WAFFLE', ndbNo: '18367', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour (AP)', quantity: '2 cups', section: 'batter', ndbNo: '20581', portionDesc: 'g', portionGrams: 240.0 },
      { name: 'baking powder', quantity: '1 tbsp', section: 'batter', ndbNo: '18370', portionDesc: 'g', portionGrams: 13.8 },
      { name: 'sugar', quantity: '1 tbsp', section: 'batter', ndbNo: '19335', portionDesc: 'g', portionGrams: 12.0 },
      { name: 'salt', quantity: '¾ tsp', section: 'batter', ndbNo: '2047', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'eggs', quantity: '2 large', section: 'batter', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'whole milk', quantity: '1½ cups', section: 'batter', ndbNo: '1077', portionDesc: 'g', portionGrams: 366.0 },
      { name: 'butter (melted)', quantity: '6 tbsp', section: 'batter', ndbNo: '1001', portionDesc: 'g', portionGrams: 85.2 }
    ],
    recipeInstructions: [
      'Whisk together the flour, baking powder, sugar, and salt in a large bowl.',
      'In a separate bowl, beat the eggs, then stir in the milk and melted butter.',
      'Pour the wet ingredients into the dry and stir just until combined; a few lumps are fine.',
      'Preheat a waffle iron and lightly grease it. Pour batter into the center and cook until the waffle is golden brown and crisp, about 4–5 minutes.'
    ],
    sections: [
      { key: 'batter', label: 'Waffle batter', cookingMethod: '', yieldFactorWater: 0.62 }
    ],
  },
  {
    id: 'BKFST_013',
    name: 'Hash brown potatoes',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 59,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '2 servings',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule A',
    nutritionJson: {"cal":167.5,"pro":1.9,"fat":8.1,"carb":22.5,"fib":2.0,"h2o":31.2,"sug":1.0,"perServing":{"cal":167.5,"pro":1.9,"fat":8.1,"carb":22.5,"fib":2.0,"h2o":31.2,"sug":1.0,"AddedSugars":0.0,"IntrinsicSugars":1.0},"micros":{"vitaminA":0.0,"vitaminC":6.3,"vitaminD":0.0,"vitaminE":1.32,"vitaminK":9.93,"vitaminB6":0.33,"vitaminB12":0.0,"thiamin":0.11,"riboflavin":0.02,"niacin":1.78,"folate":11.5,"calcium":14.29,"iron":0.6,"magnesium":34.09,"phosphorus":68.13,"potassium":558.95,"sodium":888.92,"zinc":0.46,"copper":0.27,"selenium":0.51,"cholesterol":0.0,"saturatedFat":1.71,"monoFat":8.84,"polyFat":1.01,"omega3":0.0,"omega6":0.0},"gramsPerServing":66.0,"servings":2,"per100g":{"Energy_KCal":253.54,"Water":47.23,"Protein":2.91,"TotalLipidFat":12.28,"Carbohydrate":34.08,"FiberTotalDietary":3.07,"SugarsTotal":1.52,"Cholesterol":0.0,"FattyAcids_totalSaturated":1.71,"FattyAcids_totalMonounsaturated":8.84,"FattyAcids_totalPolyunsaturated":1.01,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.0,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":0.0,"Retinol":0.0,"Carotene_beta":1.36,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.32,"VitaminK_phylloquinone":9.93,"VitaminC_totalAscorbicAcid":6.3,"Thiamin":0.11,"Riboflavin":0.02,"Niacin":1.78,"PantothenicAcid":0.68,"VitaminB6":0.33,"Folate_total":11.5,"Folate_food":11.5,"Folate_DFE":11.5,"FolicAcid":0.0,"VitaminB12":0.0,"Choline_total":20.27,"Betaine":0.35,"LuteinZeaxanthin":9.96,"Lycopene":0.0,"Calcium_Ca":14.29,"Iron_Fe":0.6,"Magnesium_Mg":34.09,"Phosphorus_P":68.13,"Potassium_K":558.95,"Sodium_Na":888.92,"Zinc_Zn":0.46,"Copper_Cu":0.27,"Manganese_Mn":0.24,"Selenium_Se":0.51,"Tryptophan":0.03,"Threonine":0.1,"Isoleucine":0.12,"Leucine":0.17,"Lysine":0.17,"Methionine":0.03,"Cystine":0.03,"Phenylalanine":0.12,"Tyrosine":0.1,"Valine":0.15,"Arginine":0.12,"Histidine":0.05,"Alanine":0.09,"AsparticAcid":0.7,"GlutamicAcid":0.48,"Glycine":0.09,"Proline":0.1,"Serine":0.12,"omega3":0.0,"omega6":0.0,"AddedSugars":0.0,"IntrinsicSugars":1.52},"addedSugars":0.0,"intrinsicSugars":1.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"11370","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.358,"yieldFactorFat":1.0,"sources":[{"ndb":"11367","name":"Potatoes, boiled, cooked without skin, flesh, without salt","grams":112.5},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":8.0},{"ndb":"2047","name":"Salt, table","grams":1.5}],"sections":[{"section_key":"hashbrown","section_label":"Hash brown","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.358,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":244.0,"raw_water_grams":174.29,"raw_fat_grams":16.23,"final_grams":132.11}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'Potatoes, hash brown, home-prepared', quantity: 'custom (g)', foodWord: 'HASHBROWN', ndbNo: '11370', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'boiled potatoes (shredded)\n(Yukon Gold or Red potatoes)', quantity: '2 medium', section: 'hashbrown', ndbNo: '11367', portionDesc: 'g', portionGrams: 225.0 },
      { name: 'olive oil', quantity: '1 tbsp + 1 tsp', section: 'hashbrown', ndbNo: '4053', portionDesc: 'g', portionGrams: 16.0 },
      { name: 'salt', quantity: '½ tsp', section: 'hashbrown', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 }
    ],
    recipeInstructions: [
      'Place the potatoes in a saucepan, cover with cold water, and bring to a boil. Turn off heat and let potatoes sit in water for 5 minutes. Drain, let cool slightly, then peel and coarsely shred.',
      'Season the shredded potato with the salt and toss to combine.',
      'Heat the olive oil in a large skillet over medium-high heat until shimmering.',
      'Add the potato in an even layer and press down firmly. Cook undisturbed until the bottom is deep golden brown, about 5–6 minutes. Flip in sections and cook the second side until crisp and golden, 4–5 minutes more.'
    ],
    sections: [
      { key: 'hashbrown', label: 'Hash brown', cookingMethod: '', yieldFactorWater: 0.358 }
    ],
  },
  {
    id: 'BKFST_017',
    name: 'Burrito with beans',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 60,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 burrito',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule F',
    nutritionJson: {"cal":188.7,"pro":7.4,"fat":4.0,"carb":30.9,"fib":5.1,"h2o":55.8,"sug":1.7,"perServing":{"cal":188.7,"pro":7.4,"fat":4.0,"carb":30.9,"fib":5.1,"h2o":55.8,"sug":1.7,"AddedSugars":0.0,"IntrinsicSugars":1.7},"micros":{"vitaminA":0.0,"vitaminC":0.24,"vitaminD":0.0,"vitaminE":0.29,"vitaminK":4.55,"vitaminB6":0.07,"vitaminB12":0.0,"thiamin":0.29,"riboflavin":0.15,"niacin":2.02,"folate":89.83,"calcium":75.05,"iron":2.51,"magnesium":40.18,"phosphorus":151.55,"potassium":251.47,"sodium":451.02,"zinc":0.72,"copper":0.14,"selenium":10.99,"cholesterol":0.0,"saturatedFat":1.39,"monoFat":0.89,"polyFat":1.14,"omega3":0.13,"omega6":0.92},"gramsPerServing":100.3,"servings":1,"per100g":{"Energy_KCal":188.14,"Water":55.67,"Protein":7.41,"TotalLipidFat":3.95,"Carbohydrate":30.84,"FiberTotalDietary":5.1,"SugarsTotal":1.74,"Cholesterol":0.0,"FattyAcids_totalSaturated":1.39,"FattyAcids_totalMonounsaturated":0.89,"FattyAcids_totalPolyunsaturated":1.14,"LinoleicAcid":0.92,"alphaLinolenicAcid":0.13,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":0.0,"Retinol":0.0,"Carotene_beta":0.0,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.29,"VitaminK_phylloquinone":4.55,"VitaminC_totalAscorbicAcid":0.24,"Thiamin":0.29,"Riboflavin":0.15,"Niacin":2.02,"PantothenicAcid":0.35,"VitaminB6":0.07,"Folate_total":89.83,"Folate_food":58.33,"Folate_DFE":111.76,"FolicAcid":31.51,"VitaminB12":0.0,"Choline_total":19.69,"Betaine":2.11,"LuteinZeaxanthin":3.59,"Lycopene":0.0,"Calcium_Ca":75.05,"Iron_Fe":2.51,"Magnesium_Mg":40.18,"Phosphorus_P":151.55,"Potassium_K":251.47,"Sodium_Na":451.02,"Zinc_Zn":0.72,"Copper_Cu":0.14,"Manganese_Mn":0.43,"Selenium_Se":10.99,"Tryptophan":0.07,"Threonine":0.22,"Isoleucine":0.26,"Leucine":0.48,"Lysine":0.33,"Methionine":0.09,"Cystine":0.08,"Phenylalanine":0.33,"Tyrosine":0.17,"Valine":0.31,"Arginine":0.33,"Histidine":0.15,"Alanine":0.24,"AsparticAcid":0.59,"GlutamicAcid":1.35,"Glycine":0.23,"Proline":0.44,"Serine":0.34,"omega3":0.13,"omega6":0.92,"AddedSugars":0.0,"IntrinsicSugars":1.74},"addedSugars":0.0,"intrinsicSugars":1.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18364","name":"Tortillas, ready-to-bake or -fry, flour, refrigerated","grams":40.0},{"ndb":"16403","name":"Refried beans, canned, traditional style, reduced sodium","grams":30.0},{"ndb":"16015","name":"Beans, black, mature seeds, cooked, boiled, without salt","grams":30.0},{"ndb":"2047","name":"Salt, table","grams":0.3}],"sections":[{"section_key":"burrito","section_label":"Bean burrito","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":100.3,"raw_water_grams":55.84,"raw_fat_grams":3.96,"final_grams":100.3}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Burrito with beans', quantity: 'custom (g)', foodWord: 'BURRITOBEANS', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour tortilla', quantity: '1', section: 'burrito', ndbNo: '18364', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'refried beans', quantity: '2 tbsp', section: 'burrito', ndbNo: '16403', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'black beans', quantity: '2 tbsp', section: 'burrito', ndbNo: '16015', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'salt', quantity: 'pinch', section: 'burrito', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Warm the flour tortilla in a dry skillet over medium heat for 30 seconds per side, or microwave for 15–20 seconds, until soft and pliable.',
      'Warm the refried beans and black beans together in a small saucepan over medium heat, stirring until heated through, about 3 minutes.',
      'Spoon the bean mixture onto the center of the tortilla and season with a pinch of salt.',
      'Fold the sides in and roll tightly into a burrito.'
    ],
    sections: [
      { key: 'burrito', label: 'Bean burrito', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_018',
    name: 'Burrito with beans and cheese',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 61,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 burrito',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule F',
    nutritionJson: {"cal":206.6,"pro":8.6,"fat":5.4,"carb":31.0,"fib":5.1,"h2o":58.0,"sug":1.8,"perServing":{"cal":206.6,"pro":8.6,"fat":5.4,"carb":31.0,"fib":5.1,"h2o":58.0,"sug":1.8,"AddedSugars":0.0,"IntrinsicSugars":1.8},"micros":{"vitaminA":8.26,"vitaminC":0.23,"vitaminD":1.0,"vitaminE":0.29,"vitaminK":4.45,"vitaminB6":0.07,"vitaminB12":0.06,"thiamin":0.28,"riboflavin":0.16,"niacin":1.93,"folate":86.18,"calcium":102.77,"iron":2.42,"magnesium":39.46,"phosphorus":165.15,"potassium":243.57,"sodium":445.65,"zinc":0.83,"copper":0.13,"selenium":11.18,"cholesterol":4.51,"saturatedFat":2.13,"monoFat":1.22,"polyFat":1.13,"omega3":0.13,"omega6":0.88},"gramsPerServing":105.3,"servings":1,"per100g":{"Energy_KCal":196.2,"Water":55.05,"Protein":8.18,"TotalLipidFat":5.12,"Carbohydrate":29.46,"FiberTotalDietary":4.86,"SugarsTotal":1.71,"Cholesterol":4.51,"FattyAcids_totalSaturated":2.13,"FattyAcids_totalMonounsaturated":1.22,"FattyAcids_totalPolyunsaturated":1.13,"LinoleicAcid":0.88,"alphaLinolenicAcid":0.13,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":8.26,"Retinol":8.07,"Carotene_beta":2.66,"VitaminD":1.0,"VitaminE_alphaTocopherol":0.29,"VitaminK_phylloquinone":4.45,"VitaminC_totalAscorbicAcid":0.23,"Thiamin":0.28,"Riboflavin":0.16,"Niacin":1.93,"PantothenicAcid":0.34,"VitaminB6":0.07,"Folate_total":86.18,"Folate_food":56.17,"Folate_DFE":107.08,"FolicAcid":30.01,"VitaminB12":0.06,"Choline_total":19.5,"Betaine":2.02,"LuteinZeaxanthin":3.42,"Lycopene":0.0,"Calcium_Ca":102.77,"Iron_Fe":2.42,"Magnesium_Mg":39.46,"Phosphorus_P":165.15,"Potassium_K":243.57,"Sodium_Na":445.65,"Zinc_Zn":0.83,"Copper_Cu":0.13,"Manganese_Mn":0.41,"Selenium_Se":11.18,"Tryptophan":0.08,"Threonine":0.25,"Isoleucine":0.31,"Leucine":0.56,"Lysine":0.39,"Methionine":0.12,"Cystine":0.08,"Phenylalanine":0.37,"Tyrosine":0.21,"Valine":0.36,"Arginine":0.35,"Histidine":0.18,"Alanine":0.26,"AsparticAcid":0.64,"GlutamicAcid":1.54,"Glycine":0.24,"Proline":0.54,"Serine":0.38,"omega3":0.13,"omega6":0.88,"AddedSugars":0.0,"IntrinsicSugars":1.71},"addedSugars":0.0,"intrinsicSugars":1.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18364","name":"Tortillas, ready-to-bake or -fry, flour, refrigerated","grams":40.0},{"ndb":"16403","name":"Refried beans, canned, traditional style, reduced sodium","grams":30.0},{"ndb":"16015","name":"Beans, black, mature seeds, cooked, boiled, without salt","grams":30.0},{"ndb":"1251","name":"Cheese, Mexican blend","grams":5.0},{"ndb":"2047","name":"Salt, table","grams":0.3}],"sections":[{"section_key":"burrito","section_label":"Bean and cheese burrito","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":105.3,"raw_water_grams":57.96,"raw_fat_grams":5.39,"final_grams":105.3}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Burrito with beans and cheese', quantity: 'custom (g)', foodWord: 'BURRITOBEANCHEESE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour tortilla', quantity: '1', section: 'burrito', ndbNo: '18364', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'refried beans', quantity: '2 tbsp', section: 'burrito', ndbNo: '16403', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'black beans', quantity: '2 tbsp', section: 'burrito', ndbNo: '16015', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'Mexican cheese blend', quantity: '1 tsp shredded', section: 'burrito', ndbNo: '1251', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'salt', quantity: 'pinch', section: 'burrito', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Warm the flour tortilla in a dry skillet over medium heat for 30 seconds per side, or microwave for 15–20 seconds, until soft and pliable.',
      'Warm the refried beans and black beans together in a small saucepan over medium heat, stirring until heated through, about 3 minutes.',
      'Spoon the bean mixture onto the center of the tortilla, top with the shredded cheese, and season with a pinch of salt.',
      'Fold the sides in and roll tightly into a burrito.'
    ],
    sections: [
      { key: 'burrito', label: 'Bean and cheese burrito', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_019',
    name: 'Burrito with cheese',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 62,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 burrito',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule G',
    nutritionJson: {"cal":326.8,"pro":14.3,"fat":16.2,"carb":30.3,"fib":2.1,"h2o":36.2,"sug":2.7,"perServing":{"cal":326.8,"pro":14.3,"fat":16.2,"carb":30.3,"fib":2.1,"h2o":36.2,"sug":2.7,"AddedSugars":0.0,"IntrinsicSugars":2.7},"micros":{"vitaminA":69.6,"vitaminC":0.0,"vitaminD":8.4,"vitaminE":0.1,"vitaminK":5.32,"vitaminB6":0.05,"vitaminB12":0.49,"thiamin":0.31,"riboflavin":0.29,"niacin":2.69,"folate":61.6,"calcium":351.2,"iron":2.41,"magnesium":23.2,"phosphorus":298.8,"potassium":109.0,"sodium":576.8,"zinc":1.52,"copper":0.07,"selenium":19.38,"cholesterol":38.0,"saturatedFat":8.56,"monoFat":4.2,"polyFat":1.72,"omega3":0.13,"omega6":1.22},"gramsPerServing":100.0,"servings":1,"per100g":{"Energy_KCal":326.8,"Water":36.18,"Protein":14.34,"TotalLipidFat":16.2,"Carbohydrate":30.33,"FiberTotalDietary":2.1,"SugarsTotal":2.72,"Cholesterol":38.0,"FattyAcids_totalSaturated":8.56,"FattyAcids_totalMonounsaturated":4.2,"FattyAcids_totalPolyunsaturated":1.72,"LinoleicAcid":1.22,"alphaLinolenicAcid":0.13,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":69.6,"Retinol":68.0,"Carotene_beta":22.4,"VitaminD":8.4,"VitaminE_alphaTocopherol":0.1,"VitaminK_phylloquinone":5.32,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.31,"Riboflavin":0.29,"Niacin":2.69,"PantothenicAcid":0.43,"VitaminB6":0.05,"Folate_total":61.6,"Folate_food":14.2,"Folate_DFE":94.6,"FolicAcid":47.4,"VitaminB12":0.49,"Choline_total":11.02,"Betaine":3.26,"LuteinZeaxanthin":5.4,"Lycopene":0.0,"Calcium_Ca":351.2,"Iron_Fe":2.41,"Magnesium_Mg":23.2,"Phosphorus_P":298.8,"Potassium_K":109.0,"Sodium_Na":576.8,"Zinc_Zn":1.52,"Copper_Cu":0.07,"Manganese_Mn":0.33,"Selenium_Se":19.38,"Tryptophan":0.18,"Threonine":0.43,"Isoleucine":0.65,"Leucine":1.08,"Lysine":0.73,"Methionine":0.29,"Cystine":0.11,"Phenylalanine":0.64,"Tyrosine":0.54,"Valine":0.73,"Arginine":0.44,"Histidine":0.36,"Alanine":0.36,"AsparticAcid":0.76,"GlutamicAcid":3.22,"Glycine":0.27,"Proline":1.4,"Serine":0.63,"omega3":0.13,"omega6":1.22,"AddedSugars":0.0,"IntrinsicSugars":2.72},"addedSugars":0.0,"intrinsicSugars":2.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18364","name":"Tortillas, ready-to-bake or -fry, flour, refrigerated","grams":60.0},{"ndb":"1251","name":"Cheese, Mexican blend","grams":40.0}],"sections":[{"section_key":"burrito","section_label":"Cheese burrito","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":2,"raw_grams":100.0,"raw_water_grams":36.18,"raw_fat_grams":16.2,"final_grams":100.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Burrito with cheese', quantity: 'custom (g)', foodWord: 'BURRITOCHEESE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour tortilla', quantity: '1 (60g)', section: 'burrito', ndbNo: '18364', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'Mexican cheese blend', quantity: '~3 tbsp shredded', section: 'burrito', ndbNo: '1251', portionDesc: 'g', portionGrams: 40.0 }
    ],
    recipeInstructions: [
      'Warm the flour tortilla in a dry skillet over medium heat for 30 seconds per side, or microwave for 15–20 seconds, until soft and pliable.',
      'Sprinkle the shredded Mexican cheese blend evenly over the center of the warm tortilla.',
      'Fold the sides in and roll tightly into a burrito.'
    ],
    sections: [
      { key: 'burrito', label: 'Cheese burrito', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_020',
    name: 'Egg burrito',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 63,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 burrito',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule F',
    nutritionJson: {"cal":498.6,"pro":23.4,"fat":28.5,"carb":35.6,"fib":2.5,"h2o":88.6,"sug":3.2,"perServing":{"cal":498.6,"pro":23.4,"fat":28.5,"carb":35.6,"fib":2.5,"h2o":88.6,"sug":3.2,"AddedSugars":0.0,"IntrinsicSugars":3.2},"micros":{"vitaminA":91.0,"vitaminC":0.0,"vitaminD":49.44,"vitaminE":0.96,"vitaminK":5.21,"vitaminB6":0.1,"vitaminB12":0.56,"thiamin":0.17,"riboflavin":0.37,"niacin":1.41,"folate":49.86,"calcium":151.52,"iron":2.56,"magnesium":18.19,"phosphorus":241.3,"potassium":140.81,"sodium":475.19,"zinc":1.27,"copper":0.08,"selenium":28.81,"cholesterol":236.08,"saturatedFat":5.19,"monoFat":6.75,"polyFat":1.94,"omega3":0.09,"omega6":1.38},"gramsPerServing":180.0,"servings":1,"per100g":{"Energy_KCal":277.06,"Water":49.23,"Protein":13.02,"TotalLipidFat":15.81,"Carbohydrate":19.81,"FiberTotalDietary":1.36,"SugarsTotal":1.78,"Cholesterol":236.08,"FattyAcids_totalSaturated":5.19,"FattyAcids_totalMonounsaturated":6.75,"FattyAcids_totalPolyunsaturated":1.94,"LinoleicAcid":1.38,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.02,"VitaminA_RAE":91.0,"Retinol":90.7,"Carotene_beta":4.11,"VitaminD":49.44,"VitaminE_alphaTocopherol":0.96,"VitaminK_phylloquinone":5.21,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.17,"Riboflavin":0.37,"Niacin":1.41,"PantothenicAcid":0.94,"VitaminB6":0.1,"Folate_total":49.86,"Folate_food":26.81,"Folate_DFE":65.9,"FolicAcid":30.73,"VitaminB12":0.56,"Choline_total":165.69,"Betaine":2.27,"LuteinZeaxanthin":202.11,"Lycopene":0.0,"Calcium_Ca":151.52,"Iron_Fe":2.56,"Magnesium_Mg":18.19,"Phosphorus_P":241.3,"Potassium_K":140.81,"Sodium_Na":475.19,"Zinc_Zn":1.27,"Copper_Cu":0.08,"Manganese_Mn":0.22,"Selenium_Se":28.81,"Tryptophan":0.15,"Threonine":0.47,"Isoleucine":0.6,"Leucine":1.0,"Lysine":0.75,"Methionine":0.32,"Cystine":0.19,"Phenylalanine":0.63,"Tyrosine":0.46,"Valine":0.74,"Arginine":0.65,"Histidine":0.29,"Alanine":0.57,"AsparticAcid":1.04,"GlutamicAcid":2.2,"Glycine":0.37,"Proline":0.79,"Serine":0.8,"omega3":0.09,"omega6":1.38,"AddedSugars":0.0,"IntrinsicSugars":1.78},"addedSugars":0.0,"intrinsicSugars":3.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.783,"yieldFactorFat":1.0,"sources":[{"ndb":"18364","name":"Tortillas, ready-to-bake or -fry, flour, refrigerated","grams":70.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":110.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":7.7},{"ndb":"1251","name":"Cheese, Mexican blend","grams":16.5},{"ndb":"2047","name":"Salt, table","grams":0.3}],"sections":[{"section_key":"burrito","section_label":"Egg burrito","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.783,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":204.53,"raw_water_grams":113.16,"raw_fat_grams":28.46,"final_grams":179.97}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'Egg burrito', quantity: 'custom (g)', foodWord: 'BURRITOEGG', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour tortilla', quantity: '1 large', section: 'burrito', ndbNo: '18364', portionDesc: 'g', portionGrams: 70.0 },
      { name: 'eggs', quantity: '2 large eggs', section: 'burrito', ndbNo: '1123', portionDesc: 'g', portionGrams: 110.0 },
      { name: 'olive oil', quantity: '1¾ tsp', section: 'burrito', ndbNo: '4053', portionDesc: 'g', portionGrams: 7.7 },
      { name: 'Mexican cheese blend', quantity: '2 tbsp', section: 'burrito', ndbNo: '1251', portionDesc: 'g', portionGrams: 16.5 },
      { name: 'salt', quantity: 'pinch', section: 'burrito', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.33 }
    ],
    recipeInstructions: [
      'Crack the eggs into a bowl and beat lightly.',
      'Heat olive oil in a small skillet over medium heat.',
      'Pour in the beaten eggs and add a pinch of salt. Scramble gently until just set.',
      'Sprinkle the Mexican cheese blend over the eggs and fold to melt, about 30 seconds.',
      'Warm the flour tortilla in a dry skillet for 30 seconds per side, or microwave for 15–20 seconds.',
      'Spoon the egg and cheese mixture onto the center of the tortilla. Fold in the sides and roll up tightly.',
      '1 burrito (180g): 498.6 cal | 23.4g protein | 28.5g fat | 35.7g carbs | 2.4g fiber | 3.2g sugar | 88.6g water'
    ],
    sections: [
      { key: 'burrito', label: 'Egg burrito', cookingMethod: '', yieldFactorWater: 0.783 }
    ],
  },
  {
    id: 'BKFST_021',
    name: 'Beef and cheese burrito',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 64,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 burrito',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule F',
    nutritionJson: {"cal":280.4,"pro":13.8,"fat":11.6,"carb":29.7,"fib":2.1,"h2o":49.9,"sug":2.3,"perServing":{"cal":280.4,"pro":13.8,"fat":11.6,"carb":29.7,"fib":2.1,"h2o":49.9,"sug":2.3,"AddedSugars":0.0,"IntrinsicSugars":2.3},"micros":{"vitaminA":9.47,"vitaminC":0.0,"vitaminD":2.18,"vitaminE":0.07,"vitaminK":4.83,"vitaminB6":0.13,"vitaminB12":0.82,"thiamin":0.29,"riboflavin":0.23,"niacin":3.9,"folate":55.49,"calcium":120.44,"iron":2.88,"magnesium":20.74,"phosphorus":202.31,"potassium":187.51,"sodium":456.37,"zinc":2.2,"copper":0.08,"selenium":19.5,"cholesterol":34.28,"saturatedFat":5.62,"monoFat":5.06,"polyFat":1.49,"omega3":0.13,"omega6":1.14},"gramsPerServing":107.1,"servings":1,"per100g":{"Energy_KCal":261.94,"Water":46.58,"Protein":12.91,"TotalLipidFat":10.79,"Carbohydrate":27.76,"FiberTotalDietary":1.96,"SugarsTotal":2.14,"Cholesterol":34.28,"FattyAcids_totalSaturated":5.62,"FattyAcids_totalMonounsaturated":5.06,"FattyAcids_totalPolyunsaturated":1.49,"LinoleicAcid":1.14,"alphaLinolenicAcid":0.13,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":9.47,"Retinol":9.28,"Carotene_beta":2.62,"VitaminD":2.18,"VitaminE_alphaTocopherol":0.07,"VitaminK_phylloquinone":4.83,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.29,"Riboflavin":0.23,"Niacin":3.9,"PantothenicAcid":0.49,"VitaminB6":0.13,"Folate_total":55.49,"Folate_food":11.22,"Folate_DFE":86.32,"FolicAcid":44.27,"VitaminB12":0.82,"Choline_total":26.5,"Betaine":6.43,"LuteinZeaxanthin":5.04,"Lycopene":0.0,"Calcium_Ca":120.44,"Iron_Fe":2.88,"Magnesium_Mg":20.74,"Phosphorus_P":202.31,"Potassium_K":187.51,"Sodium_Na":456.37,"Zinc_Zn":2.2,"Copper_Cu":0.08,"Manganese_Mn":0.3,"Selenium_Se":19.5,"Tryptophan":0.08,"Threonine":0.4,"Isoleucine":0.48,"Leucine":0.86,"Lysine":0.74,"Methionine":0.26,"Cystine":0.13,"Phenylalanine":0.48,"Tyrosine":0.35,"Valine":0.54,"Arginine":0.62,"Histidine":0.33,"Alanine":0.57,"AsparticAcid":0.84,"GlutamicAcid":2.32,"Glycine":0.61,"Proline":0.83,"Serine":0.49,"omega3":0.13,"omega6":1.14,"AddedSugars":0.0,"IntrinsicSugars":2.14},"addedSugars":0.0,"intrinsicSugars":2.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"23572","name":"Beef, ground, 80% lean meat / 20% fat, raw","grams":45.0},{"ndb":"18364","name":"Tortillas, ready-to-bake or -fry, flour, refrigerated","grams":60.0},{"ndb":"14411","name":"Water, tap, drinking","grams":10.0},{"ndb":"1251","name":"Cheese, Mexican blend","grams":5.0}],"sections":[{"section_key":"beef","section_label":"Ground beef","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.6669,"yield_factor_fat":0.593,"yield_factor_other":1.0,"ingredient_count":1,"raw_grams":45.0,"raw_water_grams":27.84,"raw_fat_grams":9.0,"final_grams":32.06},{"section_key":"assembly","section_label":"Burrito assembly","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":75.0,"raw_water_grams":31.3,"raw_fat_grams":6.22,"final_grams":75.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Beef and cheese burrito', quantity: 'custom (g)', foodWord: 'BURRITOBEEF', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'ground beef', quantity: '1½ oz', section: 'beef', ndbNo: '23572', portionDesc: 'g', portionGrams: 45.0 },
      { name: 'flour tortilla', quantity: '1 large', section: 'assembly', ndbNo: '18364', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'water', quantity: '2 tsp', section: 'assembly', ndbNo: '14411', portionDesc: 'g', portionGrams: 10.0 },
      { name: 'Mexican cheese blend', quantity: '1 tbsp', section: 'assembly', ndbNo: '1251', portionDesc: 'g', portionGrams: 5.0 }
    ],
    recipeInstructions: [
      'Cook the ground beef with 2 tsp water in a skillet over medium-high heat, breaking it apart, until browned and no longer pink, about 5–7 minutes. Drain off any excess fat.',
      'Warm the flour tortilla in a dry skillet over medium heat for 30 seconds per side, or microwave for 15–20 seconds.',
      'Spoon the cooked beef onto the center of the warm tortilla.',
      'Sprinkle the Mexican cheese blend over the beef.',
      'Fold in the sides and roll up tightly into a burrito.',
      '1 burrito (107g): 280 cal | 13.8g protein | 11.6g fat | 29.7g carbs | 2.1g fiber | 2.3g sugar | 49.9g water'
    ],
    sections: [
      { key: 'beef', label: 'Ground beef', cookingMethod: '', yieldFactorWater: 0.6669, yieldFactorFat: 0.593 },
      { key: 'assembly', label: 'Burrito assembly', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_022',
    name: 'Breakfast burrito with eggs, cheese, and potatoes',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 65,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 burrito',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":677.8,"pro":27.6,"fat":36.8,"carb":58.5,"fib":5.2,"h2o":175.0,"sug":4.4,"perServing":{"cal":677.8,"pro":27.6,"fat":36.8,"carb":58.5,"fib":5.2,"h2o":175.0,"sug":4.4,"AddedSugars":0.0,"IntrinsicSugars":4.4},"micros":{"vitaminA":54.8,"vitaminC":4.2,"vitaminD":27.4,"vitaminE":0.76,"vitaminK":4.97,"vitaminB6":0.15,"vitaminB12":0.34,"thiamin":0.12,"riboflavin":0.23,"niacin":1.2,"folate":33.46,"calcium":117.77,"iron":1.83,"magnesium":21.11,"phosphorus":176.89,"potassium":263.25,"sodium":440.23,"zinc":0.95,"copper":0.09,"selenium":16.75,"cholesterol":130.83,"saturatedFat":3.88,"monoFat":5.58,"polyFat":1.29,"omega3":0.05,"omega6":0.78},"gramsPerServing":304.7,"servings":1,"per100g":{"Energy_KCal":222.45,"Water":57.45,"Protein":9.04,"TotalLipidFat":12.08,"Carbohydrate":19.2,"FiberTotalDietary":1.7,"SugarsTotal":1.44,"Cholesterol":130.83,"FattyAcids_totalSaturated":3.88,"FattyAcids_totalMonounsaturated":5.58,"FattyAcids_totalPolyunsaturated":1.29,"LinoleicAcid":0.78,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":54.8,"Retinol":54.51,"Carotene_beta":4.46,"VitaminD":27.4,"VitaminE_alphaTocopherol":0.76,"VitaminK_phylloquinone":4.97,"VitaminC_totalAscorbicAcid":4.2,"Thiamin":0.12,"Riboflavin":0.23,"Niacin":1.2,"PantothenicAcid":0.62,"VitaminB6":0.15,"Folate_total":33.46,"Folate_food":19.85,"Folate_DFE":42.94,"FolicAcid":18.15,"VitaminB12":0.34,"Choline_total":94.38,"Betaine":1.42,"LuteinZeaxanthin":111.15,"Lycopene":0.0,"Calcium_Ca":117.77,"Iron_Fe":1.83,"Magnesium_Mg":21.11,"Phosphorus_P":176.89,"Potassium_K":263.25,"Sodium_Na":440.23,"Zinc_Zn":0.95,"Copper_Cu":0.09,"Manganese_Mn":0.19,"Selenium_Se":16.75,"Tryptophan":0.11,"Threonine":0.32,"Isoleucine":0.41,"Leucine":0.68,"Lysine":0.52,"Methionine":0.21,"Cystine":0.11,"Phenylalanine":0.43,"Tyrosine":0.32,"Valine":0.51,"Arginine":0.43,"Histidine":0.2,"Alanine":0.36,"AsparticAcid":0.83,"GlutamicAcid":1.6,"Glycine":0.24,"Proline":0.57,"Serine":0.52,"omega3":0.05,"omega6":0.78,"AddedSugars":0.0,"IntrinsicSugars":1.44},"addedSugars":0.0,"intrinsicSugars":4.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"18364","name":"Tortillas, ready-to-bake or -fry, flour, refrigerated","grams":70.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":100.0},{"ndb":"11352","name":"Potatoes, flesh and skin, raw","grams":130.0},{"ndb":"1251","name":"Cheese, Mexican blend","grams":28.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":13.6},{"ndb":"2047","name":"Salt, table","grams":1.5}],"sections":[{"section_key":"burrito","section_label":"Breakfast burrito","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":343.1,"raw_water_grams":213.46,"raw_fat_grams":36.8,"final_grams":304.68}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'Breakfast burrito with eggs, cheese, and potatoes', quantity: 'custom (g)', foodWord: 'BURRITOBREAKFAST', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'flour tortilla', quantity: '1 large', section: 'burrito', ndbNo: '18364', portionDesc: 'g', portionGrams: 70.0 },
      { name: 'eggs', quantity: '2 large', section: 'burrito', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'potato (diced)', quantity: '1 cup', section: 'burrito', ndbNo: '11352', portionDesc: 'g', portionGrams: 130.0 },
      { name: 'Mexican cheese blend', quantity: '¼ cup', section: 'burrito', ndbNo: '1251', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'olive oil', quantity: '1 tbsp', section: 'burrito', ndbNo: '4053', portionDesc: 'g', portionGrams: 13.6 },
      { name: 'salt', quantity: '¼ tsp', section: 'burrito', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Scrub the potato and cut into ½-inch dice. Heat ½ tbsp of the olive oil in a medium skillet over medium-high heat. Add the potato and salt, and cook, stirring occasionally, until golden and tender, about 8–10 minutes.',
      'Push the potatoes to one side of the pan. Add the remaining ½ tbsp olive oil, then crack in the eggs and scramble gently until just set, about 2 minutes. Fold the eggs into the potatoes.',
      'Warm the flour tortilla in a dry skillet over medium heat for 30 seconds per side, or microwave for 15–20 seconds, until pliable.',
      'Spoon the potato-egg mixture onto the center of the warm tortilla.',
      'Sprinkle the Mexican cheese blend evenly over the filling. Fold in the sides and roll up tightly into a burrito.',
      '1 burrito (305g): 678 cal | 27.6g protein | 36.8g fat | 58.5g carbs | 5.2g fiber | 4.4g sugar | 175.0g water'
    ],
    sections: [
      { key: 'burrito', label: 'Breakfast burrito', cookingMethod: '', yieldFactorWater: 0.82 }
    ],
  },
  {
    id: 'BKFST_023',
    name: 'Cheese omelette',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 66,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 omelette',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":246.9,"pro":16.1,"fat":19.5,"carb":1.0,"fib":0.0,"h2o":83.6,"sug":0.6,"perServing":{"cal":246.9,"pro":16.1,"fat":19.5,"carb":1.0,"fib":0.0,"h2o":83.6,"sug":0.6,"AddedSugars":0.0,"IntrinsicSugars":0.6},"micros":{"vitaminA":153.05,"vitaminC":0.0,"vitaminD":66.14,"vitaminE":0.77,"vitaminK":0.86,"vitaminB6":0.11,"vitaminB12":0.76,"thiamin":0.03,"riboflavin":0.37,"niacin":0.06,"folate":30.15,"calcium":128.05,"iron":1.51,"magnesium":13.0,"phosphorus":216.99,"potassium":124.66,"sodium":289.44,"zinc":1.43,"copper":0.06,"selenium":27.0,"cholesterol":328.13,"saturatedFat":7.58,"monoFat":5.15,"polyFat":1.38,"omega3":0.05,"omega6":1.1},"gramsPerServing":122.3,"servings":1,"per100g":{"Energy_KCal":201.87,"Water":68.38,"Protein":13.21,"TotalLipidFat":15.92,"Carbohydrate":0.81,"FiberTotalDietary":0.0,"SugarsTotal":0.46,"Cholesterol":328.13,"FattyAcids_totalSaturated":7.58,"FattyAcids_totalMonounsaturated":5.15,"FattyAcids_totalPolyunsaturated":1.38,"LinoleicAcid":1.1,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.02,"VitaminA_RAE":153.05,"Retinol":152.07,"Carotene_beta":12.73,"VitaminD":66.14,"VitaminE_alphaTocopherol":0.77,"VitaminK_phylloquinone":0.86,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.03,"Riboflavin":0.37,"Niacin":0.06,"PantothenicAcid":1.03,"VitaminB6":0.11,"Folate_total":30.15,"Folate_food":30.15,"Folate_DFE":30.15,"FolicAcid":0.0,"VitaminB12":0.76,"Choline_total":218.91,"Betaine":0.29,"LuteinZeaxanthin":267.33,"Lycopene":0.0,"Calcium_Ca":128.05,"Iron_Fe":1.51,"Magnesium_Mg":13.0,"Phosphorus_P":216.99,"Potassium_K":124.66,"Sodium_Na":289.44,"Zinc_Zn":1.43,"Copper_Cu":0.06,"Manganese_Mn":0.02,"Selenium_Se":27.0,"Tryptophan":0.17,"Threonine":0.56,"Isoleucine":0.72,"Leucine":1.15,"Lysine":0.95,"Methionine":0.39,"Cystine":0.2,"Phenylalanine":0.71,"Tyrosine":0.54,"Valine":0.88,"Arginine":0.77,"Histidine":0.34,"Alanine":0.68,"AsparticAcid":1.28,"GlutamicAcid":2.04,"Glycine":0.4,"Proline":0.74,"Serine":0.94,"omega3":0.05,"omega6":1.1,"AddedSugars":0.0,"IntrinsicSugars":0.46},"addedSugars":0.0,"intrinsicSugars":0.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":100.0},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"1001","name":"Butter, salted","grams":7.0},{"ndb":"1251","name":"Cheese, Mexican blend","grams":15.0}],"sections":[{"section_key":"omelette","section_label":"Cheese omelette","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":122.3,"raw_water_grams":83.63,"raw_fat_grams":19.46,"final_grams":122.3}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'Cheese omelette', quantity: 'custom (g)', foodWord: 'OMELETCHEESE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'eggs', quantity: '2 large', section: 'omelette', ndbNo: '1123', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'salt', quantity: '⅛ tsp', section: 'omelette', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'butter', quantity: '1½ tsp', section: 'omelette', ndbNo: '1001', portionDesc: 'g', portionGrams: 7.0 },
      { name: 'shredded cheese', quantity: '3 tbsp', section: 'omelette', ndbNo: '1251', portionDesc: 'g', portionGrams: 15.0 }
    ],
    recipeInstructions: [
      'Beat eggs with salt in a bowl until lightly combined.',
      'Melt butter in a non-toxic nonstick skillet over medium heat until foamy.',
      'Pour in the egg mixture; let the edges set, then gently push cooked edges toward the center.',
      'When eggs are nearly set but still glossy on top, sprinkle cheese over one half.',
      'Fold the omelette in half over the cheese, press lightly, and slide onto a plate.',
      '1 omelette (122 g): 247 cal | 16.2g protein | 19.5g fat | 1.0g carbs | 0g fiber | 0.6g sugar | 83.6g water'
    ],
    sections: [
      { key: 'omelette', label: 'Cheese omelette', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_024',
    name: 'Denver omelette',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 67,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 omelette',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":455.1,"pro":35.5,"fat":31.8,"carb":5.2,"fib":1.0,"h2o":206.9,"sug":2.6,"perServing":{"cal":455.1,"pro":35.5,"fat":31.8,"carb":5.2,"fib":1.0,"h2o":206.9,"sug":2.6,"AddedSugars":0.0,"IntrinsicSugars":2.6},"micros":{"vitaminA":96.18,"vitaminC":5.47,"vitaminD":47.36,"vitaminE":0.55,"vitaminK":1.41,"vitaminB6":0.13,"vitaminB12":0.59,"thiamin":0.1,"riboflavin":0.29,"niacin":0.82,"folate":21.83,"calcium":98.85,"iron":1.24,"magnesium":14.04,"phosphorus":193.53,"potassium":174.55,"sodium":548.49,"zinc":1.37,"copper":0.07,"selenium":20.57,"cholesterol":218.71,"saturatedFat":5.04,"monoFat":3.86,"polyFat":1.03,"omega3":0.03,"omega6":0.69},"gramsPerServing":285.5,"servings":1,"per100g":{"Energy_KCal":159.4,"Water":72.47,"Protein":12.44,"TotalLipidFat":11.14,"Carbohydrate":1.81,"FiberTotalDietary":0.34,"SugarsTotal":0.92,"Cholesterol":218.71,"FattyAcids_totalSaturated":5.04,"FattyAcids_totalMonounsaturated":3.86,"FattyAcids_totalPolyunsaturated":1.03,"LinoleicAcid":0.69,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":96.18,"Retinol":93.75,"Carotene_beta":29.11,"VitaminD":47.36,"VitaminE_alphaTocopherol":0.55,"VitaminK_phylloquinone":1.41,"VitaminC_totalAscorbicAcid":5.47,"Thiamin":0.1,"Riboflavin":0.29,"Niacin":0.82,"PantothenicAcid":0.76,"VitaminB6":0.13,"Folate_total":21.83,"Folate_food":21.83,"Folate_DFE":21.83,"FolicAcid":0.0,"VitaminB12":0.59,"Choline_total":153.46,"Betaine":1.07,"LuteinZeaxanthin":200.68,"Lycopene":0.0,"Calcium_Ca":98.85,"Iron_Fe":1.24,"Magnesium_Mg":14.04,"Phosphorus_P":193.53,"Potassium_K":174.55,"Sodium_Na":548.49,"Zinc_Zn":1.37,"Copper_Cu":0.07,"Manganese_Mn":0.04,"Selenium_Se":20.57,"Tryptophan":0.15,"Threonine":0.51,"Isoleucine":0.62,"Leucine":1.02,"Lysine":0.89,"Methionine":0.34,"Cystine":0.17,"Phenylalanine":0.61,"Tyrosine":0.47,"Valine":0.73,"Arginine":0.71,"Histidine":0.34,"Alanine":0.63,"AsparticAcid":1.16,"GlutamicAcid":1.93,"Glycine":0.42,"Proline":0.65,"Serine":0.75,"omega3":0.03,"omega6":0.69,"AddedSugars":0.0,"IntrinsicSugars":0.92},"addedSugars":0.0,"intrinsicSugars":2.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":150.0},{"ndb":"10136","name":"Pork, cured, ham, boneless, regular (approximately 11% fat), roasted","grams":42.0},{"ndb":"11333","name":"Peppers, sweet, green, raw","grams":37.0},{"ndb":"11282","name":"Onions, raw","grams":20.0},{"ndb":"1251","name":"Cheese, Mexican blend","grams":28.0},{"ndb":"1001","name":"Butter, salted","grams":7.0},{"ndb":"2047","name":"Salt, table","grams":1.5}],"sections":[{"section_key":"omelette","section_label":"Denver omelette","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":285.5,"raw_water_grams":206.9,"raw_fat_grams":31.8,"final_grams":285.5}],"cookingMethod":"fried"},
    recipeIngredients: [
      { name: 'Denver omelette', quantity: 'custom (g)', foodWord: 'OMELETDENVER', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'eggs', quantity: '3 large', section: 'omelette', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'diced ham', quantity: '1½ oz', section: 'omelette', ndbNo: '10136', portionDesc: 'g', portionGrams: 42.0 },
      { name: 'green bell pepper', quantity: '¼ cup', section: 'omelette', ndbNo: '11333', portionDesc: 'g', portionGrams: 37.0 },
      { name: 'onion', quantity: '2 tbsp', section: 'omelette', ndbNo: '11282', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'shredded cheese', quantity: '1 oz', section: 'omelette', ndbNo: '1251', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'butter', quantity: '1½ tsp', section: 'omelette', ndbNo: '1001', portionDesc: 'g', portionGrams: 7.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'omelette', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Dice the ham, green bell pepper, and onion into small pieces.',
      'Beat eggs with salt in a bowl until lightly combined.',
      'Melt butter in a non-toxic nonstick skillet over medium heat; add ham, bell pepper, and onion and sauté 2–3 minutes until softened.',
      'Pour the egg mixture over the filling; let the edges set, then gently push cooked edges toward the center.',
      'When eggs are nearly set but still glossy on top, sprinkle cheese over one half; fold the omelette in half and slide onto a plate.',
      '1 omelette (286 g): 455 cal | 35.5g protein | 31.8g fat | 5.2g carbs | 1.0g fiber | 2.6g sugar | 206.9g water'
    ],
    sections: [
      { key: 'omelette', label: 'Denver omelette', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_025',
    name: 'Cheese Quiche',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 68,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '1 hr',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":373.8,"pro":10.8,"fat":29.5,"carb":16.6,"fib":0.6,"h2o":41.3,"sug":1.2,"perServing":{"cal":373.8,"pro":10.8,"fat":29.5,"carb":16.6,"fib":0.6,"h2o":41.3,"sug":1.2,"AddedSugars":0.0,"IntrinsicSugars":1.2},"micros":{"vitaminA":204.78,"vitaminC":0.28,"vitaminD":32.41,"vitaminE":0.99,"vitaminK":4.48,"vitaminB6":0.05,"vitaminB12":0.76,"thiamin":0.13,"riboflavin":0.28,"niacin":1.02,"folate":39.01,"calcium":215.84,"iron":1.31,"magnesium":16.01,"phosphorus":194.14,"potassium":97.73,"sodium":364.36,"zinc":1.35,"copper":0.05,"selenium":19.41,"cholesterol":131.72,"saturatedFat":15.14,"monoFat":8.7,"polyFat":2.5,"omega3":0.08,"omega6":0.67},"gramsPerServing":100.0,"servings":8,"per100g":{"Energy_KCal":373.71,"Water":41.29,"Protein":10.77,"TotalLipidFat":29.53,"Carbohydrate":16.6,"FiberTotalDietary":0.62,"SugarsTotal":1.18,"Cholesterol":131.72,"FattyAcids_totalSaturated":15.14,"FattyAcids_totalMonounsaturated":8.7,"FattyAcids_totalPolyunsaturated":2.5,"LinoleicAcid":0.67,"alphaLinolenicAcid":0.06,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":204.78,"Retinol":201.9,"Carotene_beta":32.91,"VitaminD":32.41,"VitaminE_alphaTocopherol":0.99,"VitaminK_phylloquinone":4.48,"VitaminC_totalAscorbicAcid":0.28,"Thiamin":0.13,"Riboflavin":0.28,"Niacin":1.02,"PantothenicAcid":0.51,"VitaminB6":0.05,"Folate_total":39.01,"Folate_food":14.95,"Folate_DFE":55.88,"FolicAcid":30.07,"VitaminB12":0.76,"Choline_total":57.9,"Betaine":0.19,"LuteinZeaxanthin":78.18,"Lycopene":0.18,"Calcium_Ca":215.84,"Iron_Fe":1.31,"Magnesium_Mg":16.01,"Phosphorus_P":194.14,"Potassium_K":97.73,"Sodium_Na":364.36,"Zinc_Zn":1.35,"Copper_Cu":0.05,"Manganese_Mn":0.15,"Selenium_Se":19.41,"Tryptophan":0.15,"Threonine":0.4,"Isoleucine":0.55,"Leucine":1.01,"Lysine":0.78,"Methionine":0.28,"Cystine":0.14,"Phenylalanine":0.61,"Tyrosine":0.54,"Valine":0.72,"Arginine":0.44,"Histidine":0.33,"Alanine":0.41,"AsparticAcid":0.71,"GlutamicAcid":2.33,"Glycine":0.27,"Proline":1.17,"Serine":0.64,"omega3":0.08,"omega6":0.67,"AddedSugars":0.0,"IntrinsicSugars":1.18},"addedSugars":0.0,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":19.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":4.4},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":6.9},{"ndb":"14411","name":"Water, tap, drinking","grams":3.7},{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.38,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":279.79,"raw_water_grams":54.54,"raw_fat_grams":85.8,"final_grams":245.98},{"section_key":"filling","section_label":"Cheese filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":588.57,"raw_water_grams":344.02,"raw_fat_grams":150.48,"final_grams":554.17}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Cheese Quiche', quantity: 'custom (g)', foodWord: 'CHESEQUICHE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'cold unsalted butter (diced)', quantity: '2 1/2 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 35.5 },
      { name: 'vegetable shortening', quantity: '4 tablespoons + 1 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 55.47 },
      { name: 'ice water', quantity: '2 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 29.57 },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C).',
      'Whisk the flour and salt together. Cut in the cold diced butter and shortening until the mixture resembles coarse crumbs. Add the ice water 1 tablespoon at a time, mixing just until the dough comes together. Flatten into a disc and refrigerate for 30 minutes.',
      'Roll the chilled dough out on a lightly floured surface and fit it into a 9-inch pie pan. Fold over and crimp the edges. Line with parchment and fill with pie weights or dried beans. Blind-bake for 15 minutes; remove the weights and parchment and bake 5 minutes more until just beginning to brown.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg until smooth. Scatter the shredded Swiss cheese and diced onion evenly over the warm crust.',
      'Pour the custard over the cheese and onion. Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (100.0 g): 373.8 cal | 10.8g protein | 29.5g fat | 16.6g carbs | 0.6g fiber | 1.2g sugar | 41.3g water'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.38 },
      { key: 'filling', label: 'Cheese filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_026',
    name: 'Spinach Quiche',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 69,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '1 hr',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":378.9,"pro":11.4,"fat":29.6,"carb":17.4,"fib":1.2,"h2o":59.8,"sug":1.3,"perServing":{"cal":378.9,"pro":11.4,"fat":29.6,"carb":17.4,"fib":1.2,"h2o":59.8,"sug":1.3,"AddedSugars":0.0,"IntrinsicSugars":1.3},"micros":{"vitaminA":253.21,"vitaminC":1.24,"vitaminD":26.91,"vitaminE":1.15,"vitaminK":91.31,"vitaminB6":0.08,"vitaminB12":0.63,"thiamin":0.12,"riboflavin":0.27,"niacin":0.93,"folate":54.2,"calcium":204.61,"iron":1.75,"magnesium":29.54,"phosphorus":171.65,"potassium":168.18,"sodium":315.59,"zinc":1.26,"copper":0.08,"selenium":16.4,"cholesterol":109.36,"saturatedFat":12.58,"monoFat":7.23,"polyFat":2.09,"omega3":0.07,"omega6":0.56},"gramsPerServing":120.5,"servings":8,"per100g":{"Energy_KCal":314.57,"Water":49.61,"Protein":9.49,"TotalLipidFat":24.57,"Carbohydrate":14.48,"FiberTotalDietary":0.96,"SugarsTotal":1.06,"Cholesterol":109.36,"FattyAcids_totalSaturated":12.58,"FattyAcids_totalMonounsaturated":7.23,"FattyAcids_totalPolyunsaturated":2.09,"LinoleicAcid":0.56,"alphaLinolenicAcid":0.05,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":253.21,"Retinol":167.63,"Carotene_beta":966.88,"VitaminD":26.91,"VitaminE_alphaTocopherol":1.15,"VitaminK_phylloquinone":91.31,"VitaminC_totalAscorbicAcid":1.24,"Thiamin":0.12,"Riboflavin":0.27,"Niacin":0.93,"PantothenicAcid":0.44,"VitaminB6":0.08,"Folate_total":54.2,"Folate_food":34.23,"Folate_DFE":68.21,"FolicAcid":24.97,"VitaminB12":0.63,"Choline_total":51.38,"Betaine":16.78,"LuteinZeaxanthin":1543.34,"Lycopene":0.15,"Calcium_Ca":204.61,"Iron_Fe":1.75,"Magnesium_Mg":29.54,"Phosphorus_P":171.65,"Potassium_K":168.18,"Sodium_Na":315.59,"Zinc_Zn":1.26,"Copper_Cu":0.08,"Manganese_Mn":0.3,"Selenium_Se":16.4,"Tryptophan":0.13,"Threonine":0.36,"Isoleucine":0.48,"Leucine":0.88,"Lysine":0.68,"Methionine":0.24,"Cystine":0.12,"Phenylalanine":0.53,"Tyrosine":0.47,"Valine":0.63,"Arginine":0.4,"Histidine":0.29,"Alanine":0.37,"AsparticAcid":0.64,"GlutamicAcid":2.0,"Glycine":0.25,"Proline":0.99,"Serine":0.55,"omega3":0.07,"omega6":0.56,"AddedSugars":0.0,"IntrinsicSugars":1.06},"addedSugars":0.0,"intrinsicSugars":1.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":19.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":4.4},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":6.9},{"ndb":"14411","name":"Water, tap, drinking","grams":3.7},{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0},{"ndb":"11458","name":"Spinach, cooked, boiled, drained, without salt","grams":22.5}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.38,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":279.79,"raw_water_grams":54.54,"raw_fat_grams":85.8,"final_grams":245.98},{"section_key":"filling","section_label":"Spinach cheese filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":768.57,"raw_water_grams":508.2,"raw_fat_grams":150.95,"final_grams":717.75}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Spinach Quiche', quantity: 'custom (g)', foodWord: 'SPINACHQUICHE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'cold unsalted butter (diced)', quantity: '2 1/2 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 35.5 },
      { name: 'vegetable shortening', quantity: '4 tablespoons + 1 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 55.47 },
      { name: 'ice water', quantity: '2 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 29.57 },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'cooked spinach', quantity: '1 cup', section: 'filling', ndbNo: '11458', portionDesc: 'g', portionGrams: 180.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C).',
      'Whisk the flour and salt together. Cut in the cold diced butter and shortening until the mixture resembles coarse crumbs. Add the ice water 1 tablespoon at a time, mixing just until the dough comes together. Flatten into a disc and refrigerate for 30 minutes.',
      'Roll the chilled dough out on a lightly floured surface and fit it into a 9-inch pie pan. Fold over and crimp the edges. Line with parchment and fill with pie weights or dried beans. Blind-bake for 15 minutes; remove the weights and parchment and bake 5 minutes more until just beginning to brown.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg until smooth. Squeeze any excess moisture from the cooked spinach and scatter it with the shredded Swiss cheese and diced onion evenly over the warm crust.',
      'Pour the custard over the cheese and onion. Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (120.5 g): 378.9 cal | 11.4g protein | 29.6g fat | 17.4g carbs | 1.2g fiber | 1.3g sugar | 59.8g water'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.38 },
      { key: 'filling', label: 'Spinach cheese filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_027',
    name: 'Ham and Cheese Quiche',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 70,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '1 hr',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":400.5,"pro":14.2,"fat":30.9,"carb":16.6,"fib":0.6,"h2o":50.0,"sug":1.2,"perServing":{"cal":400.5,"pro":14.2,"fat":30.9,"carb":16.6,"fib":0.6,"h2o":50.0,"sug":1.2,"AddedSugars":0.0,"IntrinsicSugars":1.2},"micros":{"vitaminA":179.58,"vitaminC":0.24,"vitaminD":32.42,"vitaminE":0.9,"vitaminK":3.93,"vitaminB6":0.08,"vitaminB12":0.75,"thiamin":0.18,"riboflavin":0.29,"niacin":1.58,"folate":34.52,"calcium":190.34,"iron":1.32,"magnesium":16.93,"phosphorus":207.21,"potassium":139.5,"sodium":516.81,"zinc":1.51,"copper":0.07,"selenium":19.63,"cholesterol":123.27,"saturatedFat":13.69,"monoFat":8.19,"polyFat":2.34,"omega3":0.07,"omega6":0.59},"gramsPerServing":114.0,"servings":8,"per100g":{"Energy_KCal":351.14,"Water":43.85,"Protein":12.42,"TotalLipidFat":27.08,"Carbohydrate":14.55,"FiberTotalDietary":0.54,"SugarsTotal":1.03,"Cholesterol":123.27,"FattyAcids_totalSaturated":13.69,"FattyAcids_totalMonounsaturated":8.19,"FattyAcids_totalPolyunsaturated":2.34,"LinoleicAcid":0.59,"alphaLinolenicAcid":0.05,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":179.58,"Retinol":177.06,"Carotene_beta":28.86,"VitaminD":32.42,"VitaminE_alphaTocopherol":0.9,"VitaminK_phylloquinone":3.93,"VitaminC_totalAscorbicAcid":0.24,"Thiamin":0.18,"Riboflavin":0.29,"Niacin":1.58,"PantothenicAcid":0.53,"VitaminB6":0.08,"Folate_total":34.52,"Folate_food":13.42,"Folate_DFE":49.32,"FolicAcid":26.37,"VitaminB12":0.75,"Choline_total":61.24,"Betaine":0.94,"LuteinZeaxanthin":68.56,"Lycopene":0.16,"Calcium_Ca":190.34,"Iron_Fe":1.32,"Magnesium_Mg":16.93,"Phosphorus_P":207.21,"Potassium_K":139.5,"Sodium_Na":516.81,"Zinc_Zn":1.51,"Copper_Cu":0.07,"Manganese_Mn":0.14,"Selenium_Se":19.63,"Tryptophan":0.16,"Threonine":0.47,"Isoleucine":0.6,"Leucine":1.09,"Lysine":0.9,"Methionine":0.32,"Cystine":0.16,"Phenylalanine":0.64,"Tyrosine":0.56,"Valine":0.75,"Arginine":0.56,"Histidine":0.39,"Alanine":0.52,"AsparticAcid":0.87,"GlutamicAcid":2.47,"Glycine":0.38,"Proline":1.14,"Serine":0.67,"omega3":0.07,"omega6":0.59,"AddedSugars":0.0,"IntrinsicSugars":1.03},"addedSugars":0.0,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":19.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":4.4},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":6.9},{"ndb":"14411","name":"Water, tap, drinking","grams":3.7},{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0},{"ndb":"10136","name":"Pork, cured, ham, boneless, regular (approximately 11% fat), roasted","grams":15.0}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.38,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":279.79,"raw_water_grams":54.54,"raw_fat_grams":85.8,"final_grams":245.98},{"section_key":"filling","section_label":"Ham and cheese filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":708.57,"raw_water_grams":421.47,"raw_fat_grams":161.31,"final_grams":666.43}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Ham and Cheese Quiche', quantity: 'custom (g)', foodWord: 'HAMCHEESEQUICHE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'cold unsalted butter (diced)', quantity: '2 1/2 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 35.5 },
      { name: 'vegetable shortening', quantity: '4 tablespoons + 1 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 55.47 },
      { name: 'ice water', quantity: '2 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 29.57 },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'diced cooked ham', quantity: '4 1/4 oz', section: 'filling', ndbNo: '10136', portionDesc: 'g', portionGrams: 120.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C).',
      'Whisk the flour and salt together. Cut in the cold diced butter and shortening until the mixture resembles coarse crumbs. Add the ice water 1 tablespoon at a time, mixing just until the dough comes together. Flatten into a disc and refrigerate for 30 minutes.',
      'Roll the chilled dough out on a lightly floured surface and fit it into a 9-inch pie pan. Fold over and crimp the edges. Line with parchment and fill with pie weights or dried beans. Blind-bake for 15 minutes; remove the weights and parchment and bake 5 minutes more until just beginning to brown.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg until smooth. Scatter the diced ham, shredded Swiss cheese, and diced onion evenly over the warm crust.',
      'Pour the custard over the cheese and onion. Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (114.0 g): 400.5 cal | 14.2g protein | 30.9g fat | 16.6g carbs | 0.6g fiber | 1.2g sugar | 50.0g water'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.38 },
      { key: 'filling', label: 'Ham and cheese filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_028',
    name: 'Quiche Lorraine',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 71,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '1 hr',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":440.1,"pro":15.6,"fat":34.5,"carb":16.8,"fib":0.6,"h2o":44.3,"sug":1.2,"perServing":{"cal":440.1,"pro":15.6,"fat":34.5,"carb":16.8,"fib":0.6,"h2o":44.3,"sug":1.2,"AddedSugars":0.0,"IntrinsicSugars":1.2},"micros":{"vitaminA":181.05,"vitaminC":0.24,"vitaminD":30.48,"vitaminE":0.92,"vitaminK":3.94,"vitaminB6":0.09,"vitaminB12":0.79,"thiamin":0.16,"riboflavin":0.27,"niacin":2.0,"folate":34.26,"calcium":190.97,"iron":1.27,"magnesium":17.92,"phosphorus":218.85,"potassium":147.97,"sodium":529.72,"zinc":1.57,"copper":0.06,"selenium":23.36,"cholesterol":128.03,"saturatedFat":14.79,"monoFat":9.48,"polyFat":2.8,"omega3":0.09,"omega6":1.14},"gramsPerServing":113.9,"servings":8,"per100g":{"Energy_KCal":386.55,"Water":38.92,"Protein":13.68,"TotalLipidFat":30.31,"Carbohydrate":14.79,"FiberTotalDietary":0.54,"SugarsTotal":1.04,"Cholesterol":128.03,"FattyAcids_totalSaturated":14.79,"FattyAcids_totalMonounsaturated":9.48,"FattyAcids_totalPolyunsaturated":2.8,"LinoleicAcid":1.14,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":181.05,"Retinol":178.52,"Carotene_beta":28.91,"VitaminD":30.48,"VitaminE_alphaTocopherol":0.92,"VitaminK_phylloquinone":3.94,"VitaminC_totalAscorbicAcid":0.24,"Thiamin":0.16,"Riboflavin":0.27,"Niacin":2.0,"PantothenicAcid":0.56,"VitaminB6":0.09,"Folate_total":34.26,"Folate_food":13.13,"Folate_DFE":49.09,"FolicAcid":26.42,"VitaminB12":0.79,"Choline_total":60.89,"Betaine":1.17,"LuteinZeaxanthin":68.68,"Lycopene":0.16,"Calcium_Ca":190.97,"Iron_Fe":1.27,"Magnesium_Mg":17.92,"Phosphorus_P":218.85,"Potassium_K":147.97,"Sodium_Na":529.72,"Zinc_Zn":1.57,"Copper_Cu":0.06,"Manganese_Mn":0.14,"Selenium_Se":23.36,"Tryptophan":0.18,"Threonine":0.54,"Isoleucine":0.68,"Leucine":1.24,"Lysine":1.06,"Methionine":0.36,"Cystine":0.16,"Phenylalanine":0.71,"Tyrosine":0.64,"Valine":0.85,"Arginine":0.66,"Histidine":0.47,"Alanine":0.61,"AsparticAcid":1.02,"GlutamicAcid":2.7,"Glycine":0.43,"Proline":1.2,"Serine":0.74,"omega3":0.09,"omega6":1.14,"AddedSugars":0.0,"IntrinsicSugars":1.04},"addedSugars":0.0,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":1.0,"sources":[{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":19.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"1145","name":"Butter, without salt","grams":4.4},{"ndb":"4031","name":"Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)","grams":6.9},{"ndb":"14411","name":"Water, tap, drinking","grams":3.7},{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0},{"ndb":"10862","name":"Pork, cured, bacon, pre-sliced, cooked, pan-fried","grams":14.2}],"sections":[{"section_key":"crust","section_label":"Pie crust","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.38,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":279.79,"raw_water_grams":54.54,"raw_fat_grams":85.8,"final_grams":245.98},{"section_key":"filling","section_label":"Bacon and cheese filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":701.97,"raw_water_grams":370.84,"raw_fat_grams":190.28,"final_grams":664.89}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Quiche Lorraine', quantity: 'custom (g)', foodWord: 'QUICHELORRAINE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'all-purpose flour', quantity: '1 1/4 cups', section: 'crust', ndbNo: '20581', portionDesc: 'g', portionGrams: 156.25 },
      { name: 'table salt', quantity: '1/2 teaspoon', section: 'crust', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'cold unsalted butter (diced)', quantity: '2 1/2 tablespoon', section: 'crust', ndbNo: '1145', portionDesc: 'g', portionGrams: 35.5 },
      { name: 'vegetable shortening', quantity: '4 tablespoons + 1 teaspoon', section: 'crust', ndbNo: '4031', portionDesc: 'g', portionGrams: 55.47 },
      { name: 'ice water', quantity: '2 tablespoon ice water', section: 'crust', ndbNo: '14411', portionDesc: 'g', portionGrams: 29.57 },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'cooked bacon, crumbled', quantity: 'about 10 strips', section: 'filling', ndbNo: '10862', portionDesc: 'g', portionGrams: 113.4 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C).',
      'Whisk the flour and salt together. Cut in the cold diced butter and shortening until the mixture resembles coarse crumbs. Add the ice water 1 tablespoon at a time, mixing just until the dough comes together. Flatten into a disc and refrigerate for 30 minutes.',
      'Roll the chilled dough out on a lightly floured surface and fit it into a 9-inch pie pan. Fold over and crimp the edges. Line with parchment and fill with pie weights or dried beans. Blind-bake for 15 minutes; remove the weights and parchment and bake 5 minutes more until just beginning to brown.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg until smooth. Break the cooked bacon into small crumbles and scatter with the shredded Swiss cheese and diced onion evenly over the warm crust.',
      'Pour the custard over the cheese and onion. Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (113.9 g): 440.1 cal | 15.6g protein | 34.5g fat | 16.8g carbs | 0.6g fiber | 1.2g sugar | 44.3g water'
    ],
    sections: [
      { key: 'crust', label: 'Pie crust', cookingMethod: '', yieldFactorWater: 0.38 },
      { key: 'filling', label: 'Bacon and cheese filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_029',
    name: 'Crustless Quiche',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 72,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '50 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":209.6,"pro":8.7,"fat":18.8,"carb":1.7,"fib":0.1,"h2o":38.7,"sug":1.1,"perServing":{"cal":209.6,"pro":8.7,"fat":18.8,"carb":1.7,"fib":0.1,"h2o":38.7,"sug":1.1,"AddedSugars":0.0,"IntrinsicSugars":1.1},"micros":{"vitaminA":258.42,"vitaminC":0.4,"vitaminD":46.79,"vitaminE":0.73,"vitaminK":1.88,"vitaminB6":0.07,"vitaminB12":1.08,"thiamin":0.02,"riboflavin":0.27,"niacin":0.06,"folate":14.89,"calcium":305.59,"iron":0.58,"magnesium":16.72,"phosphorus":248.32,"potassium":109.36,"sodium":314.78,"zinc":1.74,"copper":0.04,"selenium":18.4,"cholesterol":176.41,"saturatedFat":16.08,"monoFat":6.89,"polyFat":1.27,"omega3":0.09,"omega6":0.85},"gramsPerServing":69.3,"servings":8,"per100g":{"Energy_KCal":302.53,"Water":55.87,"Protein":12.58,"TotalLipidFat":27.15,"Carbohydrate":2.44,"FiberTotalDietary":0.13,"SugarsTotal":1.62,"Cholesterol":176.41,"FattyAcids_totalSaturated":16.08,"FattyAcids_totalMonounsaturated":6.89,"FattyAcids_totalPolyunsaturated":1.27,"LinoleicAcid":0.85,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":258.42,"Retinol":254.98,"Carotene_beta":39.2,"VitaminD":46.79,"VitaminE_alphaTocopherol":0.73,"VitaminK_phylloquinone":1.88,"VitaminC_totalAscorbicAcid":0.4,"Thiamin":0.02,"Riboflavin":0.27,"Niacin":0.06,"PantothenicAcid":0.62,"VitaminB6":0.07,"Folate_total":14.89,"Folate_food":14.89,"Folate_DFE":14.89,"FolicAcid":0.0,"VitaminB12":1.08,"Choline_total":82.5,"Betaine":0.27,"LuteinZeaxanthin":97.29,"Lycopene":0.26,"Calcium_Ca":305.59,"Iron_Fe":0.58,"Magnesium_Mg":16.72,"Phosphorus_P":248.32,"Potassium_K":109.36,"Sodium_Na":314.78,"Zinc_Zn":1.74,"Copper_Cu":0.04,"Manganese_Mn":0.03,"Selenium_Se":18.4,"Tryptophan":0.19,"Threonine":0.5,"Isoleucine":0.69,"Leucine":1.26,"Lysine":1.05,"Methionine":0.36,"Cystine":0.15,"Phenylalanine":0.73,"Tyrosine":0.68,"Valine":0.93,"Arginine":0.52,"Histidine":0.42,"Alanine":0.5,"AsparticAcid":0.91,"GlutamicAcid":2.38,"Glycine":0.29,"Proline":1.35,"Serine":0.78,"omega3":0.09,"omega6":0.85,"AddedSugars":0.0,"IntrinsicSugars":1.62},"addedSugars":0.0,"intrinsicSugars":1.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0}],"sections":[{"section_key":"filling","section_label":"Cheese filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":588.57,"raw_water_grams":344.02,"raw_fat_grams":150.48,"final_grams":554.17}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Crustless Quiche', quantity: 'custom (g)', foodWord: 'CRUSTLESSQUICHE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C). Generously butter a 9-inch pie pan or baking dish.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg together until smooth.',
      'Scatter the shredded Swiss cheese and diced onion evenly over the bottom of the prepared pan.',
      'Pour the egg custard over the cheese and onion.',
      'Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (69.3 g): 209.6 cal | 8.7g protein | 18.8g fat | 1.7g carbs | 0.1g fiber | 1.1g sugar | 38.7g water'
    ],
    sections: [
      { key: 'filling', label: 'Cheese filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_030',
    name: 'Crustless Spinach Quiche',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 73,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '50 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":214.7,"pro":9.4,"fat":18.9,"carb":2.5,"fib":0.6,"h2o":57.2,"sug":1.2,"perServing":{"cal":214.7,"pro":9.4,"fat":18.9,"carb":2.5,"fib":0.6,"h2o":57.2,"sug":1.2,"AddedSugars":0.0,"IntrinsicSugars":1.2},"micros":{"vitaminA":311.22,"vitaminC":1.66,"vitaminD":36.13,"vitaminE":1.01,"vitaminK":119.05,"vitaminB6":0.1,"vitaminB12":0.84,"thiamin":0.03,"riboflavin":0.27,"niacin":0.15,"folate":40.79,"calcium":270.05,"iron":1.34,"magnesium":34.73,"phosphorus":205.77,"potassium":201.3,"sodium":260.6,"zinc":1.54,"copper":0.07,"selenium":14.59,"cholesterol":136.2,"saturatedFat":12.42,"monoFat":5.32,"polyFat":1.0,"omega3":0.07,"omega6":0.66},"gramsPerServing":89.7,"servings":8,"per100g":{"Energy_KCal":239.35,"Water":63.72,"Protein":10.46,"TotalLipidFat":21.03,"Carbohydrate":2.83,"FiberTotalDietary":0.7,"SugarsTotal":1.36,"Cholesterol":136.2,"FattyAcids_totalSaturated":12.42,"FattyAcids_totalMonounsaturated":5.32,"FattyAcids_totalPolyunsaturated":1.0,"LinoleicAcid":0.66,"alphaLinolenicAcid":0.05,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":311.22,"Retinol":196.86,"Carotene_beta":1291.8,"VitaminD":36.13,"VitaminE_alphaTocopherol":1.01,"VitaminK_phylloquinone":119.05,"VitaminC_totalAscorbicAcid":1.66,"Thiamin":0.03,"Riboflavin":0.27,"Niacin":0.15,"PantothenicAcid":0.51,"VitaminB6":0.1,"Folate_total":40.79,"Folate_food":40.79,"Folate_DFE":40.79,"FolicAcid":0.0,"VitaminB12":0.84,"Choline_total":68.14,"Betaine":22.53,"LuteinZeaxanthin":2060.21,"Lycopene":0.2,"Calcium_Ca":270.05,"Iron_Fe":1.34,"Magnesium_Mg":34.73,"Phosphorus_P":205.77,"Potassium_K":201.3,"Sodium_Na":260.6,"Zinc_Zn":1.54,"Copper_Cu":0.07,"Manganese_Mn":0.26,"Selenium_Se":14.59,"Tryptophan":0.15,"Threonine":0.42,"Isoleucine":0.57,"Leucine":1.03,"Lysine":0.86,"Methionine":0.29,"Cystine":0.12,"Phenylalanine":0.59,"Tyrosine":0.56,"Valine":0.76,"Arginine":0.44,"Histidine":0.34,"Alanine":0.42,"AsparticAcid":0.76,"GlutamicAcid":1.93,"Glycine":0.26,"Proline":1.07,"Serine":0.63,"omega3":0.07,"omega6":0.66,"AddedSugars":0.0,"IntrinsicSugars":1.36},"addedSugars":0.0,"intrinsicSugars":1.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0},{"ndb":"11458","name":"Spinach, cooked, boiled, drained, without salt","grams":22.5}],"sections":[{"section_key":"filling","section_label":"Spinach filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":768.57,"raw_water_grams":508.2,"raw_fat_grams":150.95,"final_grams":717.75}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Crustless Spinach Quiche', quantity: 'custom (g)', foodWord: 'CRUSTLESSSPINACHQUICHE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'cooked spinach', quantity: '1 cup', section: 'filling', ndbNo: '11458', portionDesc: 'g', portionGrams: 180.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C). Generously butter a 9-inch pie pan or baking dish.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg together until smooth.',
      'Scatter the shredded Swiss cheese, squeezed cooked spinach, and diced onion evenly over the bottom of the prepared pan.',
      'Pour the egg custard over the filling.',
      'Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (89.7 g): 214.7 cal | 9.4g protein | 18.9g fat | 2.5g carbs | 0.6g fiber | 1.2g sugar | 57.2g water'
    ],
    sections: [
      { key: 'filling', label: 'Spinach filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_031',
    name: 'Crustless Ham and Cheese Quiche',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 74,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '50 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":236.3,"pro":12.1,"fat":20.2,"carb":1.7,"fib":0.1,"h2o":47.4,"sug":1.1,"perServing":{"cal":236.3,"pro":12.1,"fat":20.2,"carb":1.7,"fib":0.1,"h2o":47.4,"sug":1.1,"AddedSugars":0.0,"IntrinsicSugars":1.1},"micros":{"vitaminA":214.89,"vitaminC":0.33,"vitaminD":44.38,"vitaminE":0.65,"vitaminK":1.56,"vitaminB6":0.1,"vitaminB12":1.01,"thiamin":0.11,"riboflavin":0.28,"niacin":0.99,"folate":12.81,"calcium":255.55,"iron":0.72,"magnesium":17.87,"phosphorus":257.09,"potassium":164.58,"sodium":531.86,"zinc":1.89,"copper":0.06,"selenium":18.87,"cholesterol":157.32,"saturatedFat":13.93,"monoFat":6.49,"polyFat":1.26,"omega3":0.08,"omega6":0.71},"gramsPerServing":83.3,"servings":8,"per100g":{"Energy_KCal":283.63,"Water":56.92,"Protein":14.53,"TotalLipidFat":24.2,"Carbohydrate":2.03,"FiberTotalDietary":0.11,"SugarsTotal":1.35,"Cholesterol":157.32,"FattyAcids_totalSaturated":13.93,"FattyAcids_totalMonounsaturated":6.49,"FattyAcids_totalPolyunsaturated":1.26,"LinoleicAcid":0.71,"alphaLinolenicAcid":0.06,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":214.89,"Retinol":212.03,"Carotene_beta":32.6,"VitaminD":44.38,"VitaminE_alphaTocopherol":0.65,"VitaminK_phylloquinone":1.56,"VitaminC_totalAscorbicAcid":0.33,"Thiamin":0.11,"Riboflavin":0.28,"Niacin":0.99,"PantothenicAcid":0.63,"VitaminB6":0.1,"Folate_total":12.81,"Folate_food":12.81,"Folate_DFE":12.81,"FolicAcid":0.0,"VitaminB12":1.01,"Choline_total":82.93,"Betaine":1.29,"LuteinZeaxanthin":80.9,"Lycopene":0.21,"Calcium_Ca":255.55,"Iron_Fe":0.72,"Magnesium_Mg":17.87,"Phosphorus_P":257.09,"Potassium_K":164.58,"Sodium_Na":531.86,"Zinc_Zn":1.89,"Copper_Cu":0.06,"Manganese_Mn":0.03,"Selenium_Se":18.87,"Tryptophan":0.2,"Threonine":0.58,"Isoleucine":0.73,"Leucine":1.33,"Lysine":1.18,"Methionine":0.39,"Cystine":0.17,"Phenylalanine":0.76,"Tyrosine":0.69,"Valine":0.93,"Arginine":0.67,"Histidine":0.48,"Alanine":0.63,"AsparticAcid":1.09,"GlutamicAcid":2.56,"Glycine":0.43,"Proline":1.27,"Serine":0.8,"omega3":0.08,"omega6":0.71,"AddedSugars":0.0,"IntrinsicSugars":1.35},"addedSugars":0.0,"intrinsicSugars":1.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0},{"ndb":"10136","name":"Pork, cured, ham, boneless, regular (approximately 11% fat), roasted","grams":15.0}],"sections":[{"section_key":"filling","section_label":"Ham and cheese filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":708.57,"raw_water_grams":421.47,"raw_fat_grams":161.31,"final_grams":666.43}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Crustless Ham and Cheese Quiche', quantity: 'custom (g)', foodWord: 'CRUSTLESSHAMCHEESEQUICHE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'diced cooked ham', quantity: '4 1/4 oz', section: 'filling', ndbNo: '10136', portionDesc: 'g', portionGrams: 120.0 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C). Generously butter a 9-inch pie pan or baking dish.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg together until smooth.',
      'Scatter the shredded Swiss cheese, diced ham, and diced onion evenly over the bottom of the prepared pan.',
      'Pour the egg custard over the filling.',
      'Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (83.3 g): 236.3 cal | 12.1g protein | 20.2g fat | 1.7g carbs | 0.1g fiber | 1.1g sugar | 47.4g water'
    ],
    sections: [
      { key: 'filling', label: 'Ham and cheese filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_032',
    name: 'Crustless Quiche Lorraine',
    category: 'Breakfast',
    dietaryCategory: 'all',
    levelNum: 75,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '8 slices',
    prepTime: '50 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":275.9,"pro":13.5,"fat":23.8,"carb":1.9,"fib":0.1,"h2o":41.7,"sug":1.1,"perServing":{"cal":275.9,"pro":13.5,"fat":23.8,"carb":1.9,"fib":0.1,"h2o":41.7,"sug":1.1,"AddedSugars":0.0,"IntrinsicSugars":1.1},"micros":{"vitaminA":216.98,"vitaminC":0.33,"vitaminD":41.75,"vitaminE":0.67,"vitaminK":1.57,"vitaminB6":0.12,"vitaminB12":1.07,"thiamin":0.09,"riboflavin":0.27,"niacin":1.56,"folate":12.41,"calcium":256.58,"iron":0.64,"magnesium":19.22,"phosphorus":273.15,"potassium":176.25,"sodium":549.58,"zinc":1.97,"copper":0.05,"selenium":23.99,"cholesterol":163.92,"saturatedFat":15.44,"monoFat":8.26,"polyFat":1.89,"omega3":0.11,"omega6":1.47},"gramsPerServing":83.1,"servings":8,"per100g":{"Energy_KCal":331.97,"Water":50.2,"Protein":16.27,"TotalLipidFat":28.62,"Carbohydrate":2.32,"FiberTotalDietary":0.11,"SugarsTotal":1.35,"Cholesterol":163.92,"FattyAcids_totalSaturated":15.44,"FattyAcids_totalMonounsaturated":8.26,"FattyAcids_totalPolyunsaturated":1.89,"LinoleicAcid":1.47,"alphaLinolenicAcid":0.09,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.01,"VitaminA_RAE":216.98,"Retinol":214.11,"Carotene_beta":32.67,"VitaminD":41.75,"VitaminE_alphaTocopherol":0.67,"VitaminK_phylloquinone":1.57,"VitaminC_totalAscorbicAcid":0.33,"Thiamin":0.09,"Riboflavin":0.27,"Niacin":1.56,"PantothenicAcid":0.68,"VitaminB6":0.12,"Folate_total":12.41,"Folate_food":12.41,"Folate_DFE":12.41,"FolicAcid":0.0,"VitaminB12":1.07,"Choline_total":82.5,"Betaine":1.6,"LuteinZeaxanthin":81.09,"Lycopene":0.21,"Calcium_Ca":256.58,"Iron_Fe":0.64,"Magnesium_Mg":19.22,"Phosphorus_P":273.15,"Potassium_K":176.25,"Sodium_Na":549.58,"Zinc_Zn":1.97,"Copper_Cu":0.05,"Manganese_Mn":0.03,"Selenium_Se":23.99,"Tryptophan":0.22,"Threonine":0.67,"Isoleucine":0.85,"Leucine":1.53,"Lysine":1.4,"Methionine":0.46,"Cystine":0.18,"Phenylalanine":0.85,"Tyrosine":0.8,"Valine":1.07,"Arginine":0.81,"Histidine":0.59,"Alanine":0.75,"AsparticAcid":1.3,"GlutamicAcid":2.87,"Glycine":0.5,"Proline":1.36,"Serine":0.89,"omega3":0.11,"omega6":1.47,"AddedSugars":0.0,"IntrinsicSugars":1.35},"addedSugars":0.0,"intrinsicSugars":1.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"1040","name":"Cheese, swiss","grams":20.2},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":29.8},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":18.8},{"ndb":"11282","name":"Onions, raw","grams":4.4},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.0},{"ndb":"10862","name":"Pork, cured, bacon, pre-sliced, cooked, pan-fried","grams":14.2}],"sections":[{"section_key":"filling","section_label":"Bacon filling","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":701.97,"raw_water_grams":370.84,"raw_fat_grams":190.28,"final_grams":664.89}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Crustless Quiche Lorraine', quantity: 'custom (g)', foodWord: 'CRUSTLESSLORRAINE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'shredded Swiss cheese', quantity: '1 1/2 cups shredded', section: 'filling', ndbNo: '1040', portionDesc: 'g', portionGrams: 162.0 },
      { name: 'heavy cream', quantity: '1 cup', section: 'filling', ndbNo: '1053', portionDesc: 'g', portionGrams: 238.0 },
      { name: 'large egg', quantity: '3 large', section: 'filling', ndbNo: '1123', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'onion', quantity: '1/4 cup diced', section: 'filling', ndbNo: '11282', portionDesc: 'g', portionGrams: 35.0 },
      { name: 'ground nutmeg', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.275 },
      { name: 'salt', quantity: '1/2 teaspoon', section: 'filling', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '1/8 teaspoon', section: 'filling', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'cooked bacon, crumbled', quantity: 'about 10 strips', section: 'filling', ndbNo: '10862', portionDesc: 'g', portionGrams: 113.4 }
    ],
    recipeInstructions: [
      'Preheat the oven to 375 degrees F (190 degrees C). Generously butter a 9-inch pie pan or baking dish.',
      'Whisk the eggs, heavy cream, salt, pepper, and nutmeg together until smooth.',
      'Scatter the shredded Swiss cheese, crumbled bacon, and diced onion evenly over the bottom of the prepared pan.',
      'Pour the egg custard over the filling.',
      'Bake for 35 to 40 minutes until the custard is just set in the center and the top is lightly golden. Cool on a rack for at least 10 minutes before slicing.',
      '1 slice (83.1 g): 275.9 cal | 13.5g protein | 23.8g fat | 1.9g carbs | 0.1g fiber | 1.1g sugar | 41.7g water'
    ],
    sections: [
      { key: 'filling', label: 'Bacon filling', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_033',
    name: 'Frittata Herbs and Cheese',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 76,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '4 slices',
    prepTime: '25 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":185.1,"pro":11.3,"fat":14.6,"carb":1.9,"fib":0.5,"h2o":62.3,"sug":0.7,"perServing":{"cal":185.1,"pro":11.3,"fat":14.6,"carb":1.9,"fib":0.5,"h2o":62.3,"sug":0.7,"AddedSugars":0.0,"IntrinsicSugars":0.7},"micros":{"vitaminA":162.78,"vitaminC":4.91,"vitaminD":59.54,"vitaminE":1.3,"vitaminK":90.81,"vitaminB6":0.11,"vitaminB12":0.68,"thiamin":0.03,"riboflavin":0.36,"niacin":0.18,"folate":38.93,"calcium":153.98,"iron":1.88,"magnesium":18.15,"phosphorus":208.41,"potassium":176.5,"sodium":258.07,"zinc":1.26,"copper":0.08,"selenium":24.14,"cholesterol":282.03,"saturatedFat":6.08,"monoFat":6.54,"polyFat":1.56,"omega3":0.05,"omega6":1.01},"gramsPerServing":91.6,"servings":4,"per100g":{"Energy_KCal":202.09,"Water":68.0,"Protein":12.36,"TotalLipidFat":15.92,"Carbohydrate":2.13,"FiberTotalDietary":0.53,"SugarsTotal":0.8,"Cholesterol":282.03,"FattyAcids_totalSaturated":6.08,"FattyAcids_totalMonounsaturated":6.54,"FattyAcids_totalPolyunsaturated":1.56,"LinoleicAcid":1.01,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.02,"VitaminA_RAE":162.78,"Retinol":134.9,"Carotene_beta":312.31,"VitaminD":59.54,"VitaminE_alphaTocopherol":1.3,"VitaminK_phylloquinone":90.81,"VitaminC_totalAscorbicAcid":4.91,"Thiamin":0.03,"Riboflavin":0.36,"Niacin":0.18,"PantothenicAcid":1.02,"VitaminB6":0.11,"Folate_total":38.93,"Folate_food":38.93,"Folate_DFE":38.93,"FolicAcid":0.0,"VitaminB12":0.68,"Choline_total":193.98,"Betaine":0.25,"LuteinZeaxanthin":493.54,"Lycopene":0.01,"Calcium_Ca":153.98,"Iron_Fe":1.88,"Magnesium_Mg":18.15,"Phosphorus_P":208.41,"Potassium_K":176.5,"Sodium_Na":258.07,"Zinc_Zn":1.26,"Copper_Cu":0.08,"Manganese_Mn":0.07,"Selenium_Se":24.14,"Tryptophan":0.16,"Threonine":0.52,"Isoleucine":0.65,"Leucine":1.08,"Lysine":0.94,"Methionine":0.35,"Cystine":0.19,"Phenylalanine":0.66,"Tyrosine":0.52,"Valine":0.83,"Arginine":0.71,"Histidine":0.33,"Alanine":0.63,"AsparticAcid":1.17,"GlutamicAcid":1.92,"Glycine":0.38,"Proline":0.73,"Serine":0.88,"omega3":0.05,"omega6":1.01,"AddedSugars":0.0,"IntrinsicSugars":0.8},"addedSugars":0.0,"intrinsicSugars":0.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":66.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":3.8},{"ndb":"11291","name":"Onions, spring or scallions (includes tops and bulb), raw","grams":7.5},{"ndb":"11297","name":"Parsley, fresh","grams":3.8},{"ndb":"11165","name":"Coriander (cilantro) leaves, raw","grams":2.0},{"ndb":"11156","name":"Chives, raw","grams":0.8},{"ndb":"2049","name":"Thyme, fresh","grams":0.5},{"ndb":"2047","name":"Salt, table","grams":0.1},{"ndb":"2030","name":"Spices, pepper, black","grams":0.1},{"ndb":"1033","name":"Cheese, parmesan, hard","grams":7.1},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":3.4},{"ndb":"1145","name":"Butter, without salt","grams":3.5}],"sections":[{"section_key":"frittata","section_label":"Frittata","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":12,"raw_grams":394.1,"raw_water_grams":276.83,"raw_fat_grams":58.32,"final_grams":366.42}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Frittata Herbs and Cheese', quantity: 'custom (g)', foodWord: 'FRITTATA', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'large egg', quantity: '6 medium eggs', section: 'frittata', ndbNo: '1123', portionDesc: 'g', portionGrams: 264.0 },
      { name: 'whole milk', quantity: '1 tablespoon', section: 'frittata', ndbNo: '1077', portionDesc: 'g', portionGrams: 15.25 },
      { name: 'scallion (green onion)', quantity: '2 scallions chopped', section: 'frittata', ndbNo: '11291', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'fresh parsley', quantity: '4 tablespoons chopped', section: 'frittata', ndbNo: '11297', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'fresh cilantro', quantity: '3 tablespoons chopped', section: 'frittata', ndbNo: '11165', portionDesc: 'g', portionGrams: 8.0 },
      { name: 'fresh chives', quantity: '1 tablespoon chopped', section: 'frittata', ndbNo: '11156', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'fresh thyme leaves', quantity: '2 teaspoons leaves', section: 'frittata', ndbNo: '2049', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'salt', quantity: '1 pinch', section: 'frittata', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 },
      { name: 'ground black pepper', quantity: '1 pinch', section: 'frittata', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'Parmesan cheese', quantity: '1 oz freshly grated', section: 'frittata', ndbNo: '1033', portionDesc: 'g', portionGrams: 28.35 },
      { name: 'olive oil', quantity: '1 tablespoon', section: 'frittata', ndbNo: '4053', portionDesc: 'g', portionGrams: 13.6 },
      { name: 'unsalted butter', quantity: '1 tablespoon', section: 'frittata', ndbNo: '1145', portionDesc: 'g', portionGrams: 14.2 }
    ],
    recipeInstructions: [
      'Heat olive oil and butter in a 10-inch oven-safe skillet over medium heat until the butter is melted.',
      'Add the scallions and cook for 2 minutes until softened. Stir in the parsley, cilantro, chives, and thyme and cook for 1 minute.',
      'Whisk the eggs with the milk, salt, and pepper in a bowl until well combined.',
      'Pour the egg mixture over the herbs in the skillet. Sprinkle the grated Parmesan evenly over the top. Cook undisturbed for 2 to 3 minutes until the edges begin to set.',
      'Transfer the skillet to a broiler set to high and broil for 3 to 4 minutes until the top is set and lightly golden. Let rest for 2 minutes before slicing into 4 wedges.',
      '1 slice (91.6 g): 185.1 cal | 11.3g protein | 14.6g fat | 1.9g carbs | 0.5g fiber | 0.7g sugar | 62.3g water'
    ],
    sections: [
      { key: 'frittata', label: 'Frittata', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'BKFST_034',
    name: 'Avocado Toast Basic',
    category: 'Breakfast',
    dietaryCategory: 'vegan',
    levelNum: 77,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 toast',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":276.5,"pro":7.0,"fat":17.9,"carb":24.9,"fib":8.3,"h2o":70.8,"sug":3.0,"perServing":{"cal":276.5,"pro":7.0,"fat":17.9,"carb":24.9,"fib":8.3,"h2o":70.8,"sug":3.0,"AddedSugars":0.0,"IntrinsicSugars":3.0},"micros":{"vitaminA":9.33,"vitaminC":7.14,"vitaminD":0.0,"vitaminE":1.93,"vitaminK":15.64,"vitaminB6":0.26,"vitaminB12":0.0,"thiamin":0.12,"riboflavin":0.13,"niacin":2.54,"folate":76.84,"calcium":42.87,"iron":1.25,"magnesium":44.49,"phosphorus":110.1,"potassium":394.9,"sodium":258.59,"zinc":0.99,"copper":0.2,"selenium":11.31,"cholesterol":0.0,"saturatedFat":2.09,"monoFat":8.88,"polyFat":2.13,"omega3":0.07,"omega6":0.0},"gramsPerServing":123.2,"servings":1,"per100g":{"Energy_KCal":224.45,"Water":57.5,"Protein":5.72,"TotalLipidFat":14.5,"Carbohydrate":20.21,"FiberTotalDietary":6.72,"SugarsTotal":2.45,"Cholesterol":0.0,"FattyAcids_totalSaturated":2.09,"FattyAcids_totalMonounsaturated":8.88,"FattyAcids_totalPolyunsaturated":2.13,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":9.33,"Retinol":0.0,"Carotene_beta":91.57,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.93,"VitaminK_phylloquinone":15.64,"VitaminC_totalAscorbicAcid":7.14,"Thiamin":0.12,"Riboflavin":0.13,"Niacin":2.54,"PantothenicAcid":1.01,"VitaminB6":0.26,"Folate_total":76.84,"Folate_food":76.84,"Folate_DFE":76.84,"FolicAcid":0.0,"VitaminB12":0.0,"Choline_total":17.87,"Betaine":0.43,"LuteinZeaxanthin":227.54,"Lycopene":0.0,"Calcium_Ca":42.87,"Iron_Fe":1.25,"Magnesium_Mg":44.49,"Phosphorus_P":110.1,"Potassium_K":394.9,"Sodium_Na":258.59,"Zinc_Zn":0.99,"Copper_Cu":0.2,"Manganese_Mn":0.77,"Selenium_Se":11.31,"Tryptophan":0.05,"Threonine":0.13,"Isoleucine":0.16,"Leucine":0.27,"Lysine":0.17,"Methionine":0.06,"Cystine":0.07,"Phenylalanine":0.18,"Tyrosine":0.1,"Valine":0.19,"Arginine":0.21,"Histidine":0.09,"Alanine":0.18,"AsparticAcid":0.33,"GlutamicAcid":0.9,"Glycine":0.18,"Proline":0.29,"Serine":0.19,"omega3":0.07,"omega6":0.0,"AddedSugars":0.0,"IntrinsicSugars":2.45},"addedSugars":0.0,"intrinsicSugars":3.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18036","name":"Bread, multi-grain, toasted (includes whole-grain)","grams":38.0},{"ndb":"9038","name":"Avocados, raw, California","grams":75.0},{"ndb":"9152","name":"Lemon juice, raw","grams":5.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":4.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2031","name":"Spices, pepper, red or cayenne","grams":0.3}],"sections":[{"section_key":"toast","section_label":"Avocado Toast","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":123.2,"raw_water_grams":70.84,"raw_fat_grams":17.87,"final_grams":123.2}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Avocado Toast Basic', quantity: 'custom (g)', foodWord: 'AVOCADOTOAST', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'multigrain toast', quantity: '1 thick slice', section: 'toast', ndbNo: '18036', portionDesc: 'g', portionGrams: 38.0 },
      { name: 'avocado', quantity: '½ avocado', section: 'toast', ndbNo: '9038', portionDesc: 'g', portionGrams: 75.0 },
      { name: 'lemon juice', quantity: '1 teaspoon', section: 'toast', ndbNo: '9152', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'olive oil', quantity: '1 teaspoon', section: 'toast', ndbNo: '4053', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'salt', quantity: '1 pinch', section: 'toast', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 },
      { name: 'red pepper flakes', quantity: '1 pinch', section: 'toast', ndbNo: '2031', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Toast the bread until golden and crisp.',
      'Halve the avocado and scoop the flesh of one half into a small bowl.',
      'Add the lemon juice and mash with a fork to your preferred texture — smooth or slightly chunky.',
      'Spread the mashed avocado evenly on top of the warm toast.',
      'Drizzle with olive oil, then finish with a pinch of flaked salt and red pepper flakes.',
      '1 toast (123.2 g): 276.5 cal | 7.0g protein | 17.9g fat | 24.9g carbs | 8.3g fiber | 3.0g sugar | 70.8g water'
    ],
    sections: [
      { key: 'toast', label: 'Avocado Toast', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'BKFST_035',
    name: 'Avocado Toast Tomato and Egg',
    category: 'Breakfast',
    dietaryCategory: 'veggie',
    levelNum: 78,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 5, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 4, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 toast',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":360.3,"pro":13.9,"fat":22.7,"carb":27.9,"fib":9.1,"h2o":173.0,"sug":5.0,"perServing":{"cal":360.3,"pro":13.9,"fat":22.7,"carb":27.9,"fib":9.1,"h2o":173.0,"sug":5.0,"AddedSugars":0.0,"IntrinsicSugars":5.0},"micros":{"vitaminA":49.77,"vitaminC":7.51,"vitaminD":17.0,"vitaminE":1.35,"vitaminK":10.28,"vitaminB6":0.19,"vitaminB12":0.15,"thiamin":0.08,"riboflavin":0.15,"niacin":1.48,"folate":50.73,"calcium":36.32,"iron":1.08,"magnesium":28.31,"phosphorus":103.84,"potassium":297.13,"sodium":195.06,"zinc":0.82,"copper":0.13,"selenium":12.12,"cholesterol":76.7,"saturatedFat":1.72,"monoFat":5.3,"polyFat":1.51,"omega3":0.04,"omega6":0.0},"gramsPerServing":241.2,"servings":1,"per100g":{"Energy_KCal":149.36,"Water":71.74,"Protein":5.76,"TotalLipidFat":9.43,"Carbohydrate":11.57,"FiberTotalDietary":3.77,"SugarsTotal":2.07,"Cholesterol":76.7,"FattyAcids_totalSaturated":1.72,"FattyAcids_totalMonounsaturated":5.3,"FattyAcids_totalPolyunsaturated":1.51,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":49.77,"Retinol":32.96,"Carotene_beta":173.36,"VitaminD":17.0,"VitaminE_alphaTocopherol":1.35,"VitaminK_phylloquinone":10.28,"VitaminC_totalAscorbicAcid":7.51,"Thiamin":0.08,"Riboflavin":0.15,"Niacin":1.48,"PantothenicAcid":0.85,"VitaminB6":0.19,"Folate_total":50.73,"Folate_food":50.73,"Folate_DFE":50.73,"FolicAcid":0.0,"VitaminB12":0.15,"Choline_total":59.55,"Betaine":0.31,"LuteinZeaxanthin":254.76,"Lycopene":725.39,"Calcium_Ca":36.32,"Iron_Fe":1.08,"Magnesium_Mg":28.31,"Phosphorus_P":103.84,"Potassium_K":297.13,"Sodium_Na":195.06,"Zinc_Zn":0.82,"Copper_Cu":0.13,"Manganese_Mn":0.43,"Selenium_Se":12.12,"Tryptophan":0.06,"Threonine":0.19,"Isoleucine":0.22,"Leucine":0.37,"Lysine":0.28,"Methionine":0.11,"Cystine":0.09,"Phenylalanine":0.24,"Tyrosine":0.16,"Valine":0.28,"Arginine":0.28,"Histidine":0.11,"Alanine":0.25,"AsparticAcid":0.48,"GlutamicAcid":0.93,"Glycine":0.19,"Proline":0.26,"Serine":0.3,"omega3":0.04,"omega6":0.0,"AddedSugars":0.0,"IntrinsicSugars":2.07},"addedSugars":0.0,"intrinsicSugars":5.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18036","name":"Bread, multi-grain, toasted (includes whole-grain)","grams":38.0},{"ndb":"9038","name":"Avocados, raw, California","grams":75.0},{"ndb":"9152","name":"Lemon juice, raw","grams":5.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":4.5},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":68.0},{"ndb":"1131","name":"Egg, whole, cooked, poached","grams":50.0},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2031","name":"Spices, pepper, red or cayenne","grams":0.3}],"sections":[{"section_key":"toast","section_label":"Avocado Egg Toast","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":241.2,"raw_water_grams":173.04,"raw_fat_grams":22.74,"final_grams":241.2}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Avocado Toast Tomato and Egg', quantity: 'custom (g)', foodWord: 'AVOCADOEGGTOAST', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'multigrain toast', quantity: '1 thick slice', section: 'toast', ndbNo: '18036', portionDesc: 'g', portionGrams: 38.0 },
      { name: 'avocado', quantity: '½ avocado', section: 'toast', ndbNo: '9038', portionDesc: 'g', portionGrams: 75.0 },
      { name: 'lemon juice', quantity: '1 teaspoon', section: 'toast', ndbNo: '9152', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'olive oil', quantity: '1 teaspoon', section: 'toast', ndbNo: '4053', portionDesc: 'g', portionGrams: 4.5 },
      { name: 'cherry tomatoes', quantity: '4', section: 'toast', ndbNo: '11529', portionDesc: 'g', portionGrams: 68.0 },
      { name: 'poached egg', quantity: '1', section: 'toast', ndbNo: '1131', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'salt', quantity: '1 pinch', section: 'toast', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 },
      { name: 'red pepper flakes', quantity: '1 pinch', section: 'toast', ndbNo: '2031', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Bring a small saucepan of water to a gentle simmer and add a splash of white vinegar. Crack the egg into a small cup, then gently slide it into the simmering water. Poach for 3 to 4 minutes until the white is set and the yolk is still soft. Remove with a slotted spoon and blot dry.',
      'Toast the bread until golden and crisp.',
      'Halve the avocado and scoop the flesh of one half into a small bowl. Add the lemon juice and mash with a fork to your preferred texture — smooth or slightly chunky.',
      'Spread the mashed avocado evenly on top of the warm toast.',
      'Drizzle with olive oil. Place the poached egg on top of the avocado, then arrange the cherry tomato halves around the egg.',
      'Finish with a pinch of flaked salt and red pepper flakes.',
      '1 toast (241.2 g): 360 cal | 13.9g protein | 22.7g fat | 27.9g carbs | 9.1g fiber | 5.0g sugar | 173.0g water'
    ],
    sections: [
      { key: 'toast', label: 'Avocado Egg Toast', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_001',
    name: 'Grilled Cheese Cheddar & Gruyere, Restaurant Style',
    category: 'sandwiches & burgers',
    dietaryCategory: 'veggie',
    levelNum: 79,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":589.1,"pro":20.3,"fat":43.1,"carb":30.6,"fib":1.6,"h2o":41.4,"sug":3.6,"perServing":{"cal":589.1,"pro":20.3,"fat":43.1,"carb":30.6,"fib":1.6,"h2o":41.4,"sug":3.6,"AddedSugars":0.0,"IntrinsicSugars":3.6},"micros":{"vitaminA":206.48,"vitaminC":0.0,"vitaminD":9.16,"vitaminE":0.57,"vitaminK":2.26,"vitaminB6":0.05,"vitaminB12":0.49,"thiamin":0.18,"riboflavin":0.22,"niacin":1.68,"folate":41.86,"calcium":412.47,"iron":1.62,"magnesium":22.95,"phosphorus":259.91,"potassium":90.59,"sodium":614.61,"zinc":1.85,"copper":0.06,"selenium":18.31,"cholesterol":85.16,"saturatedFat":18.2,"monoFat":8.35,"polyFat":1.45,"omega3":0.09,"omega6":0.35},"gramsPerServing":139.4,"servings":1,"per100g":{"Energy_KCal":422.6,"Water":29.67,"Protein":14.56,"TotalLipidFat":30.91,"Carbohydrate":21.98,"FiberTotalDietary":1.16,"SugarsTotal":2.62,"Cholesterol":85.16,"FattyAcids_totalSaturated":18.2,"FattyAcids_totalMonounsaturated":8.35,"FattyAcids_totalPolyunsaturated":1.45,"LinoleicAcid":0.35,"alphaLinolenicAcid":0.09,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":206.48,"Retinol":203.91,"Carotene_beta":44.35,"VitaminD":9.16,"VitaminE_alphaTocopherol":0.57,"VitaminK_phylloquinone":2.26,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.18,"Riboflavin":0.22,"Niacin":1.68,"PantothenicAcid":0.36,"VitaminB6":0.05,"Folate_total":41.86,"Folate_food":14.1,"Folate_DFE":61.22,"FolicAcid":37.01,"VitaminB12":0.49,"Choline_total":14.82,"Betaine":44.06,"LuteinZeaxanthin":12.31,"Lycopene":0.0,"Calcium_Ca":412.47,"Iron_Fe":1.62,"Magnesium_Mg":22.95,"Phosphorus_P":259.91,"Potassium_K":90.59,"Sodium_Na":614.61,"Zinc_Zn":1.85,"Copper_Cu":0.06,"Manganese_Mn":0.23,"Selenium_Se":18.31,"Tryptophan":0.19,"Threonine":0.43,"Isoleucine":0.57,"Leucine":1.03,"Lysine":0.76,"Methionine":0.28,"Cystine":0.07,"Phenylalanine":0.57,"Tyrosine":0.58,"Valine":0.74,"Arginine":0.31,"Histidine":0.34,"Alanine":0.35,"AsparticAcid":0.69,"GlutamicAcid":2.19,"Glycine":0.22,"Proline":1.29,"Serine":0.51,"omega3":0.09,"omega6":0.35,"AddedSugars":0.0,"IntrinsicSugars":2.62},"addedSugars":0.0,"intrinsicSugars":3.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"1009","name":"Cheese, cheddar","grams":28.0},{"ndb":"1023","name":"Cheese, gruyere","grams":28.0},{"ndb":"1001","name":"Butter, salted","grams":28.0}],"sections":[{"section_key":"sandwich","section_label":"Grilled Cheese","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":144.0,"raw_water_grams":45.95,"raw_fat_grams":43.09,"final_grams":139.4}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Grilled Cheese Cheddar & Gruyere, Restaurant Style', quantity: 'custom (g)', foodWord: 'GRILLEDCHEESE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'Cheddar cheese', quantity: '1 oz', section: 'sandwich', ndbNo: '1009', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'Gruyere cheese', quantity: '1 oz', section: 'sandwich', ndbNo: '1023', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'salted butter', quantity: '2 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 28.0 }
    ],
    recipeInstructions: [
      'Spread softened butter on both sides of each bread slice — all four faces — dividing the 2 tablespoons evenly.',
      'Heat a skillet or griddle over medium-low to medium heat.',
      'Place both slices of bread in the pan. Toast the bottom sides until deep golden brown.',
      'Flip both slices over and evenly distribute the shredded cheddar and gruyère over one of the toasted slices. Top with the second toasted slice, toasted side over the cheese.',
      'Cook until the bottom is deep golden brown, about 3–4 minutes. Flip carefully and cook the second side until golden and the cheese is fully melted, about 2–3 more minutes.',
      'Transfer to a cutting board, rest 1 minute, then cut diagonally and serve.',
      '1 sandwich (139.4 g): 589.1 cal | 20.3g protein | 43.1g fat | 30.6g carbs | 1.6g fiber | 3.7g sugar | 41.4g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Grilled Cheese', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'SAND_002',
    name: 'Grilled Cheese American',
    category: 'sandwiches & burgers',
    dietaryCategory: 'veggie',
    levelNum: 80,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":415.8,"pro":13.0,"fat":26.7,"carb":31.2,"fib":1.6,"h2o":36.6,"sug":4.4,"perServing":{"cal":415.8,"pro":13.0,"fat":26.7,"carb":31.2,"fib":1.6,"h2o":36.6,"sug":4.4,"AddedSugars":0.0,"IntrinsicSugars":4.4},"micros":{"vitaminA":143.49,"vitaminC":0.0,"vitaminD":8.2,"vitaminE":0.53,"vitaminK":1.76,"vitaminB6":0.05,"vitaminB12":0.5,"thiamin":0.22,"riboflavin":0.2,"niacin":2.07,"folate":47.16,"calcium":472.32,"iron":2.17,"magnesium":22.34,"phosphorus":296.06,"potassium":120.08,"sodium":970.11,"zinc":1.34,"copper":0.07,"selenium":19.5,"cholesterol":64.42,"saturatedFat":13.57,"monoFat":6.03,"polyFat":1.29,"omega3":0.11,"omega6":0.45},"gramsPerServing":111.9,"servings":1,"per100g":{"Energy_KCal":371.49,"Water":32.73,"Protein":11.65,"TotalLipidFat":23.86,"Carbohydrate":27.89,"FiberTotalDietary":1.45,"SugarsTotal":3.89,"Cholesterol":64.42,"FattyAcids_totalSaturated":13.57,"FattyAcids_totalMonounsaturated":6.03,"FattyAcids_totalPolyunsaturated":1.29,"LinoleicAcid":0.45,"alphaLinolenicAcid":0.11,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":143.49,"Retinol":140.09,"Carotene_beta":39.83,"VitaminD":8.2,"VitaminE_alphaTocopherol":0.53,"VitaminK_phylloquinone":1.76,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.22,"Riboflavin":0.2,"Niacin":2.07,"PantothenicAcid":0.36,"VitaminB6":0.05,"Folate_total":47.16,"Folate_food":12.58,"Folate_DFE":71.28,"FolicAcid":46.1,"VitaminB12":0.5,"Choline_total":21.39,"Betaine":54.66,"LuteinZeaxanthin":15.33,"Lycopene":0.0,"Calcium_Ca":472.32,"Iron_Fe":2.17,"Magnesium_Mg":22.34,"Phosphorus_P":296.06,"Potassium_K":120.08,"Sodium_Na":970.11,"Zinc_Zn":1.34,"Copper_Cu":0.07,"Manganese_Mn":0.3,"Selenium_Se":19.5,"Tryptophan":0.09,"Threonine":0.29,"Isoleucine":0.36,"Leucine":0.65,"Lysine":0.57,"Methionine":0.18,"Cystine":0.04,"Phenylalanine":0.35,"Tyrosine":0.35,"Valine":0.45,"Arginine":0.2,"Histidine":0.21,"Alanine":0.23,"AsparticAcid":0.59,"GlutamicAcid":1.55,"Glycine":0.13,"Proline":0.68,"Serine":0.41,"omega3":0.11,"omega6":0.45,"AddedSugars":0.0,"IntrinsicSugars":3.89},"addedSugars":0.0,"intrinsicSugars":4.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"1253","name":"Cheese, pasteurized process, American, without added vitamin D","grams":42.0},{"ndb":"1001","name":"Butter, salted","grams":14.0}],"sections":[{"section_key":"sandwich","section_label":"Grilled Cheese","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":116.0,"raw_water_grams":40.71,"raw_fat_grams":26.71,"final_grams":111.93}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Grilled Cheese American', quantity: 'custom (g)', foodWord: 'GRILLEDCHEESEAMERICAN', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'American cheese', quantity: '1½ oz', section: 'sandwich', ndbNo: '1253', portionDesc: 'g', portionGrams: 42.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.0 }
    ],
    recipeInstructions: [
      'Spread softened butter on one side of each bread slice.',
      'Heat a skillet or griddle over medium heat.',
      'Place one slice butter-side down in the pan. Layer the American cheese over the top, then cover with the second slice, butter-side up.',
      'Cook until the bottom is deep golden brown, about 3–4 minutes. Flip carefully and cook the second side until golden and the cheese is fully melted, about 2–3 more minutes.',
      'Transfer to a cutting board, rest 1 minute, then cut diagonally and serve.',
      '1 sandwich (111.9 g): 415.8 cal | 13.0g protein | 26.7g fat | 31.2g carbs | 1.6g fiber | 4.4g sugar | 36.6g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Grilled Cheese', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'SAND_003',
    name: 'Grilled Cheese Cheddar',
    category: 'sandwiches & burgers',
    dietaryCategory: 'veggie',
    levelNum: 81,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":429.7,"pro":15.0,"fat":27.3,"carb":31.0,"fib":1.6,"h2o":35.7,"sug":3.6,"perServing":{"cal":429.7,"pro":15.0,"fat":27.3,"carb":31.0,"fib":1.6,"h2o":35.7,"sug":3.6,"AddedSugars":0.0,"IntrinsicSugars":3.6},"micros":{"vitaminA":167.34,"vitaminC":0.0,"vitaminD":8.55,"vitaminE":0.51,"vitaminK":1.69,"vitaminB6":0.05,"vitaminB12":0.37,"thiamin":0.22,"riboflavin":0.26,"niacin":2.07,"folate":52.46,"calcium":346.28,"iron":1.99,"magnesium":22.69,"phosphorus":226.05,"potassium":98.97,"sodium":587.55,"zinc":1.77,"copper":0.06,"selenium":22.59,"cholesterol":63.98,"saturatedFat":13.86,"monoFat":6.41,"polyFat":1.33,"omega3":0.08,"omega6":0.22},"gramsPerServing":112.0,"servings":1,"per100g":{"Energy_KCal":383.5,"Water":31.83,"Protein":13.42,"TotalLipidFat":24.41,"Carbohydrate":27.63,"FiberTotalDietary":1.45,"SugarsTotal":3.22,"Cholesterol":63.98,"FattyAcids_totalSaturated":13.86,"FattyAcids_totalMonounsaturated":6.41,"FattyAcids_totalPolyunsaturated":1.33,"LinoleicAcid":0.22,"alphaLinolenicAcid":0.08,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":167.34,"Retinol":166.04,"Carotene_beta":41.29,"VitaminD":8.55,"VitaminE_alphaTocopherol":0.51,"VitaminK_phylloquinone":1.69,"VitaminC_totalAscorbicAcid":0.0,"Thiamin":0.22,"Riboflavin":0.26,"Niacin":2.07,"PantothenicAcid":0.36,"VitaminB6":0.05,"Folate_total":52.46,"Folate_food":17.91,"Folate_DFE":76.55,"FolicAcid":46.06,"VitaminB12":0.37,"Choline_total":14.72,"Betaine":54.87,"LuteinZeaxanthin":15.32,"Lycopene":0.0,"Calcium_Ca":346.28,"Iron_Fe":1.99,"Magnesium_Mg":22.69,"Phosphorus_P":226.05,"Potassium_K":98.97,"Sodium_Na":587.55,"Zinc_Zn":1.77,"Copper_Cu":0.06,"Manganese_Mn":0.29,"Selenium_Se":22.59,"Tryptophan":0.2,"Threonine":0.39,"Isoleucine":0.46,"Leucine":0.73,"Lysine":0.39,"Methionine":0.2,"Cystine":0.04,"Phenylalanine":0.41,"Tyrosine":0.42,"Valine":0.53,"Arginine":0.21,"Histidine":0.2,"Alanine":0.28,"AsparticAcid":0.66,"GlutamicAcid":1.79,"Glycine":0.2,"Proline":0.94,"Serine":0.3,"omega3":0.08,"omega6":0.22,"AddedSugars":0.0,"IntrinsicSugars":3.22},"addedSugars":0.0,"intrinsicSugars":3.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"1009","name":"Cheese, cheddar","grams":42.0},{"ndb":"1001","name":"Butter, salted","grams":14.0}],"sections":[{"section_key":"sandwich","section_label":"Grilled Cheese","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":116.0,"raw_water_grams":39.62,"raw_fat_grams":27.34,"final_grams":112.04}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Grilled Cheese Cheddar', quantity: 'custom (g)', foodWord: 'GRILLEDCHEESECHEDDAR', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'Cheddar cheese', quantity: '1½ oz', section: 'sandwich', ndbNo: '1009', portionDesc: 'g', portionGrams: 42.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.0 }
    ],
    recipeInstructions: [
      'Spread softened butter on one side of each bread slice.',
      'Heat a skillet or griddle over medium heat.',
      'Place one slice butter-side down in the pan. Layer the cheddar over the top, then cover with the second slice, butter-side up.',
      'Cook until the bottom is deep golden brown, about 3–4 minutes. Flip carefully and cook the second side until golden and the cheese is fully melted, about 2–3 more minutes.',
      'Transfer to a cutting board, rest 1 minute, then cut diagonally and serve.',
      '1 sandwich (112.0 g): 429.7 cal | 15.0g protein | 27.3g fat | 31.0g carbs | 1.6g fiber | 3.6g sugar | 35.7g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Grilled Cheese', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'SAND_004',
    name: 'BLT Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 82,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":447.5,"pro":16.9,"fat":29.6,"carb":27.6,"fib":2.1,"h2o":87.8,"sug":4.4,"perServing":{"cal":447.5,"pro":16.9,"fat":29.6,"carb":27.6,"fib":2.1,"h2o":87.8,"sug":4.4,"AddedSugars":0.0,"IntrinsicSugars":4.4},"micros":{"vitaminA":18.01,"vitaminC":3.98,"vitaminD":4.43,"vitaminE":0.73,"vitaminK":25.08,"vitaminB6":0.16,"vitaminB12":0.24,"thiamin":0.29,"riboflavin":0.13,"niacin":3.79,"folate":40.88,"calcium":51.16,"iron":1.43,"magnesium":17.16,"phosphorus":121.49,"potassium":221.85,"sodium":581.92,"zinc":0.94,"copper":0.07,"selenium":17.52,"cholesterol":25.97,"saturatedFat":4.19,"monoFat":5.56,"polyFat":7.46,"omega3":0.77,"omega6":6.03},"gramsPerServing":165.5,"servings":1,"per100g":{"Energy_KCal":270.37,"Water":53.05,"Protein":10.19,"TotalLipidFat":17.89,"Carbohydrate":16.68,"FiberTotalDietary":1.25,"SugarsTotal":2.68,"Cholesterol":25.97,"FattyAcids_totalSaturated":4.19,"FattyAcids_totalMonounsaturated":5.56,"FattyAcids_totalPolyunsaturated":7.46,"LinoleicAcid":6.03,"alphaLinolenicAcid":0.77,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":18.01,"Retinol":4.2,"Carotene_beta":149.95,"VitaminD":4.43,"VitaminE_alphaTocopherol":0.73,"VitaminK_phylloquinone":25.08,"VitaminC_totalAscorbicAcid":3.98,"Thiamin":0.29,"Riboflavin":0.13,"Niacin":3.79,"PantothenicAcid":0.44,"VitaminB6":0.16,"Folate_total":40.88,"Folate_food":14.89,"Folate_DFE":59.0,"FolicAcid":25.98,"VitaminB12":0.24,"Choline_total":29.84,"Betaine":32.51,"LuteinZeaxanthin":73.37,"Lycopene":699.61,"Calcium_Ca":51.16,"Iron_Fe":1.43,"Magnesium_Mg":17.16,"Phosphorus_P":121.49,"Potassium_K":221.85,"Sodium_Na":581.92,"Zinc_Zn":0.94,"Copper_Cu":0.07,"Manganese_Mn":0.21,"Selenium_Se":17.52,"Tryptophan":0.09,"Threonine":0.33,"Isoleucine":0.35,"Leucine":0.6,"Lysine":0.65,"Methionine":0.2,"Cystine":0.08,"Phenylalanine":0.31,"Tyrosine":0.29,"Valine":0.37,"Arginine":0.47,"Histidine":0.3,"Alanine":0.42,"AsparticAcid":0.72,"GlutamicAcid":1.24,"Glycine":0.33,"Proline":0.3,"Serine":0.31,"omega3":0.77,"omega6":6.03,"AddedSugars":0.0,"IntrinsicSugars":2.68},"addedSugars":0.0,"intrinsicSugars":4.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":50.0},{"ndb":"10862","name":"Pork, cured, bacon, pre-sliced, cooked, pan-fried","grams":34.5},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":45.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":21.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":15.0}],"sections":[{"section_key":"sandwich","section_label":"BLT","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":165.5,"raw_water_grams":87.8,"raw_fat_grams":29.6,"final_grams":165.5}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'BLT Sandwich', quantity: 'custom (g)', foodWord: 'BLT', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (25g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'cooked bacon', quantity: '3 strips', section: 'sandwich', ndbNo: '10862', portionDesc: 'g', portionGrams: 34.5 },
      { name: 'tomato raw', quantity: '3 thin slices (45g)', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 45.0 },
      { name: 'mayonnaise', quantity: '1½ tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 21.0 },
      { name: 'iceberg lettuce', quantity: '1 large leaf (15g)', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 15.0 }
    ],
    recipeInstructions: [
      'Cook the bacon in a skillet over medium heat until crisp and browned, about 6–8 minutes. Drain on paper towels.',
      'Toast the bread slices until golden.',
      'Spread mayonnaise evenly over one side of each toast slice.',
      'On one slice (mayo side up), layer the lettuce leaf, tomato slices, and bacon. Top with the second slice, mayo side down.',
      'Cut diagonally and serve immediately.',
      '1 sandwich (165.5g): 447.5 cal | 10.2g protein | 17.9g fat | 16.7g carbs | 1.2g fiber | 2.7g sugar | 53.0g water'
    ],
    sections: [
      { key: 'sandwich', label: 'BLT', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_005',
    name: 'Club Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 83,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":587.5,"pro":28.5,"fat":29.9,"carb":49.5,"fib":3.3,"h2o":174.6,"sug":7.8,"perServing":{"cal":587.5,"pro":28.5,"fat":29.9,"carb":49.5,"fib":3.3,"h2o":174.6,"sug":7.8,"AddedSugars":0.0,"IntrinsicSugars":7.8},"micros":{"vitaminA":12.06,"vitaminC":2.99,"vitaminD":3.52,"vitaminE":0.5,"vitaminK":14.8,"vitaminB6":0.2,"vitaminB12":0.2,"thiamin":0.23,"riboflavin":0.14,"niacin":4.43,"folate":40.66,"calcium":53.19,"iron":1.41,"magnesium":17.61,"phosphorus":137.87,"potassium":239.63,"sodium":582.9,"zinc":0.79,"copper":0.06,"selenium":14.66,"cholesterol":24.49,"saturatedFat":2.27,"monoFat":2.97,"polyFat":4.53,"omega3":0.47,"omega6":3.49},"gramsPerServing":289.0,"servings":1,"per100g":{"Energy_KCal":203.3,"Water":60.42,"Protein":9.85,"TotalLipidFat":10.36,"Carbohydrate":17.14,"FiberTotalDietary":1.15,"SugarsTotal":2.71,"Cholesterol":24.49,"FattyAcids_totalSaturated":2.27,"FattyAcids_totalMonounsaturated":2.97,"FattyAcids_totalPolyunsaturated":4.53,"LinoleicAcid":3.49,"alphaLinolenicAcid":0.47,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":12.06,"Retinol":1.97,"Carotene_beta":109.17,"VitaminD":3.52,"VitaminE_alphaTocopherol":0.5,"VitaminK_phylloquinone":14.8,"VitaminC_totalAscorbicAcid":2.99,"Thiamin":0.23,"Riboflavin":0.14,"Niacin":4.43,"PantothenicAcid":0.37,"VitaminB6":0.2,"Folate_total":40.66,"Folate_food":13.88,"Folate_DFE":59.34,"FolicAcid":26.78,"VitaminB12":0.2,"Choline_total":24.23,"Betaine":33.43,"LuteinZeaxanthin":54.49,"Lycopene":534.19,"Calcium_Ca":53.19,"Iron_Fe":1.41,"Magnesium_Mg":17.61,"Phosphorus_P":137.87,"Potassium_K":239.63,"Sodium_Na":582.9,"Zinc_Zn":0.79,"Copper_Cu":0.06,"Manganese_Mn":0.2,"Selenium_Se":14.66,"Tryptophan":0.08,"Threonine":0.33,"Isoleucine":0.34,"Leucine":0.61,"Lysine":0.66,"Methionine":0.21,"Cystine":0.08,"Phenylalanine":0.3,"Tyrosine":0.27,"Valine":0.35,"Arginine":0.51,"Histidine":0.25,"Alanine":0.44,"AsparticAcid":0.73,"GlutamicAcid":1.25,"Glycine":0.37,"Proline":0.31,"Serine":0.32,"omega3":0.47,"omega6":3.49,"AddedSugars":0.0,"IntrinsicSugars":2.71},"addedSugars":0.0,"intrinsicSugars":7.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":90.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":80.0},{"ndb":"10862","name":"Pork, cured, bacon, pre-sliced, cooked, pan-fried","grams":23.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":60.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":15.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":21.0}],"sections":[{"section_key":"sandwich","section_label":"Club Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":289.0,"raw_water_grams":174.61,"raw_fat_grams":29.94,"final_grams":289.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Club Sandwich', quantity: 'custom (g)', foodWord: 'CLUBSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '3 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 90.0 },
      { name: 'deli turkey breast', quantity: '5 slices (80g)', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 80.0 },
      { name: 'cooked bacon', quantity: '2 strips', section: 'sandwich', ndbNo: '10862', portionDesc: 'g', portionGrams: 23.0 },
      { name: 'tomato raw', quantity: '4 thin slices (60g)', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'iceberg lettuce', quantity: '1 large leaf (15g)', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'mayonnaise', quantity: '1½ tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 21.0 }
    ],
    recipeInstructions: [
      'Cook the bacon in a skillet over medium heat until crisp and browned, about 6–8 minutes. Drain on paper towels.',
      'Toast all 3 bread slices until golden.',
      'Spread mayonnaise evenly on one side of each slice.',
      'On the bottom slice (mayo side up), layer the lettuce leaf and 4 thin tomato slices.',
      'Place the middle slice on top, mayo-side down. Spread mayo on the top of the middle slice, then layer the thin-sliced turkey (prepackaged thin-sliced or deli-sliced) and bacon.',
      'Top with the third slice, mayo-side down. Secure with 4 toothpicks, cut diagonally into 4 triangles, and serve immediately.',
      '1 sandwich (289.0g): 587.5 cal | 28.5g protein | 29.9g fat | 49.5g carbs | 3.3g fiber | 7.8g sugar | 174.6g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Club Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_006',
    name: 'Egg Salad Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'veggie',
    levelNum: 84,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":505.1,"pro":18.3,"fat":33.4,"carb":31.4,"fib":1.8,"h2o":108.1,"sug":4.8,"perServing":{"cal":505.1,"pro":18.3,"fat":33.4,"carb":31.4,"fib":1.8,"h2o":108.1,"sug":4.8,"AddedSugars":0.0,"IntrinsicSugars":4.8},"micros":{"vitaminA":79.52,"vitaminC":0.39,"vitaminD":45.47,"vitaminE":1.07,"vitaminK":27.47,"vitaminB6":0.09,"vitaminB12":0.58,"thiamin":0.2,"riboflavin":0.34,"niacin":1.51,"folate":58.65,"calcium":73.32,"iron":1.8,"magnesium":13.34,"phosphorus":123.1,"potassium":113.54,"sodium":614.96,"zinc":0.8,"copper":0.04,"selenium":23.26,"cholesterol":196.62,"saturatedFat":3.53,"monoFat":4.67,"polyFat":7.53,"omega3":0.83,"omega6":5.5},"gramsPerServing":195.6,"servings":1,"per100g":{"Energy_KCal":258.21,"Water":55.28,"Protein":9.37,"TotalLipidFat":17.05,"Carbohydrate":16.04,"FiberTotalDietary":0.93,"SugarsTotal":2.45,"Cholesterol":196.62,"FattyAcids_totalSaturated":3.53,"FattyAcids_totalMonounsaturated":4.67,"FattyAcids_totalPolyunsaturated":7.53,"LinoleicAcid":5.5,"alphaLinolenicAcid":0.81,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.02,"VitaminA_RAE":79.52,"Retinol":77.78,"Carotene_beta":19.35,"VitaminD":45.47,"VitaminE_alphaTocopherol":1.07,"VitaminK_phylloquinone":27.47,"VitaminC_totalAscorbicAcid":0.39,"Thiamin":0.2,"Riboflavin":0.34,"Niacin":1.51,"PantothenicAcid":0.9,"VitaminB6":0.09,"Folate_total":58.65,"Folate_food":32.27,"Folate_DFE":77.05,"FolicAcid":26.38,"VitaminB12":0.58,"Choline_total":159.91,"Betaine":31.57,"LuteinZeaxanthin":220.36,"Lycopene":0.0,"Calcium_Ca":73.32,"Iron_Fe":1.8,"Magnesium_Mg":13.34,"Phosphorus_P":123.1,"Potassium_K":113.54,"Sodium_Na":614.96,"Zinc_Zn":0.8,"Copper_Cu":0.04,"Manganese_Mn":0.18,"Selenium_Se":23.26,"Tryptophan":0.08,"Threonine":0.32,"Isoleucine":0.36,"Leucine":0.57,"Lysine":0.48,"Methionine":0.2,"Cystine":0.15,"Phenylalanine":0.35,"Tyrosine":0.27,"Valine":0.4,"Arginine":0.4,"Histidine":0.15,"Alanine":0.37,"AsparticAcid":0.67,"GlutamicAcid":0.87,"Glycine":0.22,"Proline":0.27,"Serine":0.49,"omega3":0.83,"omega6":5.5,"AddedSugars":0.0,"IntrinsicSugars":2.45},"addedSugars":0.0,"intrinsicSugars":4.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"1129","name":"Egg, whole, cooked, hard-boiled","grams":100.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":27.6},{"ndb":"11291","name":"Onions, spring or scallions (includes tops and bulb), raw","grams":4.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":2.5},{"ndb":"2047","name":"Salt, table","grams":1.5}],"sections":[{"section_key":"sandwich","section_label":"Egg Salad","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":195.6,"raw_water_grams":108.14,"raw_fat_grams":33.36,"final_grams":195.6}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Egg Salad Sandwich', quantity: 'custom (g)', foodWord: 'EGGSALAD', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'hard-boiled egg', quantity: '2 large eggs', section: 'sandwich', ndbNo: '1129', portionDesc: 'g', portionGrams: 100.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 27.6 },
      { name: 'scallion (green onion)', quantity: '2 tsp chopped', section: 'sandwich', ndbNo: '11291', portionDesc: 'g', portionGrams: 4.0 },
      { name: 'yellow mustard', quantity: '½ tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 2.5 },
      { name: 'salt', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Hard boil the eggs: place in a saucepan, cover with cold water, bring to a boil, then cover and remove from heat. Let sit 10 minutes, then transfer to an ice bath. Peel and chop.',
      'In a bowl, combine the chopped eggs, mayonnaise, green onion, mustard, and salt. Mix well.',
      'Spread the egg salad evenly over one bread slice and top with the second slice.',
      'Cut diagonally and serve immediately, or refrigerate the egg salad up to 2 days.',
      '1 sandwich (195.6g): 505.1 cal | 18.3g protein | 33.4g fat | 31.4g carbs | 1.8g fiber | 4.8g sugar | 108.1g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Egg Salad', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_007',
    name: 'Tuna Salad Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'pesca',
    levelNum: 85,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":581.9,"pro":33.5,"fat":34.4,"carb":34.8,"fib":2.5,"h2o":176.7,"sug":7.1,"perServing":{"cal":581.9,"pro":33.5,"fat":34.4,"carb":34.8,"fib":2.5,"h2o":176.7,"sug":7.1,"AddedSugars":0.0,"IntrinsicSugars":7.1},"micros":{"vitaminA":11.82,"vitaminC":1.45,"vitaminD":24.42,"vitaminE":0.72,"vitaminK":26.95,"vitaminB6":0.18,"vitaminB12":1.29,"thiamin":0.13,"riboflavin":0.1,"niacin":6.07,"folate":27.65,"calcium":41.83,"iron":1.64,"magnesium":17.38,"phosphorus":94.75,"potassium":136.0,"sodium":522.53,"zinc":0.53,"copper":0.05,"selenium":40.13,"cholesterol":24.03,"saturatedFat":1.95,"monoFat":2.62,"polyFat":6.97,"omega3":0.92,"omega6":5.66},"gramsPerServing":285.1,"servings":1,"per100g":{"Energy_KCal":204.06,"Water":61.98,"Protein":11.74,"TotalLipidFat":12.07,"Carbohydrate":12.22,"FiberTotalDietary":0.87,"SugarsTotal":2.49,"Cholesterol":24.03,"FattyAcids_totalSaturated":1.95,"FattyAcids_totalMonounsaturated":2.62,"FattyAcids_totalPolyunsaturated":6.97,"LinoleicAcid":5.66,"alphaLinolenicAcid":0.81,"EPA_20_5n3":0.01,"DPA_22_5n3":0.0,"DHA_22_6n3":0.1,"VitaminA_RAE":11.82,"Retinol":10.64,"Carotene_beta":12.24,"VitaminD":24.42,"VitaminE_alphaTocopherol":0.72,"VitaminK_phylloquinone":26.95,"VitaminC_totalAscorbicAcid":1.45,"Thiamin":0.13,"Riboflavin":0.1,"Niacin":6.07,"PantothenicAcid":0.22,"VitaminB6":0.18,"Folate_total":27.65,"Folate_food":9.56,"Folate_DFE":40.28,"FolicAcid":18.1,"VitaminB12":1.29,"Choline_total":23.17,"Betaine":22.8,"LuteinZeaxanthin":30.39,"Lycopene":0.0,"Calcium_Ca":41.83,"Iron_Fe":1.64,"Magnesium_Mg":17.38,"Phosphorus_P":94.75,"Potassium_K":136.0,"Sodium_Na":522.53,"Zinc_Zn":0.53,"Copper_Cu":0.05,"Manganese_Mn":0.12,"Selenium_Se":40.13,"Tryptophan":0.1,"Threonine":0.41,"Isoleucine":0.43,"Leucine":0.77,"Lysine":0.86,"Methionine":0.28,"Cystine":0.1,"Phenylalanine":0.37,"Tyrosine":0.32,"Valine":0.49,"Arginine":0.57,"Histidine":0.27,"Alanine":0.57,"AsparticAcid":0.97,"GlutamicAcid":1.41,"Glycine":0.45,"Proline":0.33,"Serine":0.39,"omega3":0.92,"omega6":5.66,"AddedSugars":0.0,"IntrinsicSugars":2.49},"addedSugars":0.0,"intrinsicSugars":7.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"15121","name":"Fish, tuna, light, canned in water, drained solids","grams":142.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":41.4},{"ndb":"9003","name":"Apples, raw, with skin","grams":31.2},{"ndb":"11291","name":"Onions, spring or scallions (includes tops and bulb), raw","grams":4.0},{"ndb":"9152","name":"Lemon juice, raw","grams":5.0},{"ndb":"2047","name":"Salt, table","grams":1.5}],"sections":[{"section_key":"sandwich","section_label":"Tuna Salad","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":285.15,"raw_water_grams":176.72,"raw_fat_grams":34.42,"final_grams":285.15}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Tuna Salad Sandwich', quantity: 'custom (g)', foodWord: 'TUNASALAD', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'canned light tuna', quantity: '1 can drained (5 oz)', section: 'sandwich', ndbNo: '15121', portionDesc: 'g', portionGrams: 142.0 },
      { name: 'mayonnaise', quantity: '3 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 41.4 },
      { name: 'apple', quantity: '¼ cup chopped', section: 'sandwich', ndbNo: '9003', portionDesc: 'g', portionGrams: 31.25 },
      { name: 'scallion (green onion)', quantity: '2 tsp chopped', section: 'sandwich', ndbNo: '11291', portionDesc: 'g', portionGrams: 4.0 },
      { name: 'lemon juice', quantity: '1 tsp', section: 'sandwich', ndbNo: '9152', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'Open and drain the tuna well. Flake into a mixing bowl.',
      'Add the mayonnaise, diced apple, green onion, lemon juice, and salt. Mix to combine.',
      'Spread the tuna salad evenly over one bread slice and top with the second slice.',
      'Cut diagonally and serve immediately, or refrigerate the tuna salad up to 2 days.',
      '1 sandwich (285.15g): 581.9 cal | 33.5g protein | 34.4g fat | 34.8g carbs | 2.5g fiber | 7.1g sugar | 176.7g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Tuna Salad', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_008',
    name: 'Chicken Salad Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 86,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":412.3,"pro":44.8,"fat":8.4,"carb":37.1,"fib":2.9,"h2o":191.0,"sug":9.0,"perServing":{"cal":412.3,"pro":44.8,"fat":8.4,"carb":37.1,"fib":2.9,"h2o":191.0,"sug":9.0,"AddedSugars":0.0,"IntrinsicSugars":9.0},"micros":{"vitaminA":5.66,"vitaminC":1.72,"vitaminD":1.98,"vitaminE":0.21,"vitaminK":5.88,"vitaminB6":0.28,"vitaminB12":0.25,"thiamin":0.15,"riboflavin":0.14,"niacin":6.53,"folate":30.51,"calcium":57.51,"iron":1.23,"magnesium":20.0,"phosphorus":136.44,"potassium":190.72,"sodium":349.69,"zinc":0.66,"copper":0.04,"selenium":17.17,"cholesterol":35.79,"saturatedFat":0.93,"monoFat":0.96,"polyFat":0.73,"omega3":0.05,"omega6":0.03},"gramsPerServing":284.8,"servings":1,"per100g":{"Energy_KCal":144.8,"Water":67.07,"Protein":15.72,"TotalLipidFat":2.95,"Carbohydrate":13.04,"FiberTotalDietary":1.01,"SugarsTotal":3.16,"Cholesterol":35.79,"FattyAcids_totalSaturated":0.93,"FattyAcids_totalMonounsaturated":0.96,"FattyAcids_totalPolyunsaturated":0.73,"LinoleicAcid":0.03,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":5.66,"Retinol":2.54,"Carotene_beta":36.19,"VitaminD":1.98,"VitaminE_alphaTocopherol":0.21,"VitaminK_phylloquinone":5.88,"VitaminC_totalAscorbicAcid":1.72,"Thiamin":0.15,"Riboflavin":0.14,"Niacin":6.53,"PantothenicAcid":0.58,"VitaminB6":0.28,"Folate_total":30.51,"Folate_food":12.39,"Folate_DFE":43.15,"FolicAcid":18.12,"VitaminB12":0.25,"Choline_total":40.39,"Betaine":23.95,"LuteinZeaxanthin":53.54,"Lycopene":0.0,"Calcium_Ca":57.51,"Iron_Fe":1.23,"Magnesium_Mg":20.0,"Phosphorus_P":136.44,"Potassium_K":190.72,"Sodium_Na":349.69,"Zinc_Zn":0.66,"Copper_Cu":0.04,"Manganese_Mn":0.13,"Selenium_Se":17.17,"Tryptophan":0.14,"Threonine":0.52,"Isoleucine":0.65,"Leucine":0.93,"Lysine":1.05,"Methionine":0.34,"Cystine":0.16,"Phenylalanine":0.49,"Tyrosine":0.41,"Valine":0.61,"Arginine":0.75,"Histidine":0.38,"Alanine":0.67,"AsparticAcid":1.11,"GlutamicAcid":1.86,"Glycine":0.61,"Proline":0.51,"Serine":0.42,"omega3":0.05,"omega6":0.03,"AddedSugars":0.0,"IntrinsicSugars":3.16},"addedSugars":0.0,"intrinsicSugars":9.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"5064","name":"Chicken, broilers or fryers, breast, meat only, cooked, roasted","grams":113.0},{"ndb":"1293","name":"Yogurt, Greek, plain, whole milk","grams":45.0},{"ndb":"9003","name":"Apples, raw, with skin","grams":31.2},{"ndb":"11143","name":"Celery, raw","grams":25.0},{"ndb":"11291","name":"Onions, spring or scallions (includes tops and bulb), raw","grams":4.0},{"ndb":"9152","name":"Lemon juice, raw","grams":5.0},{"ndb":"2047","name":"Salt, table","grams":1.5}],"sections":[{"section_key":"sandwich","section_label":"Chicken Salad","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":284.75,"raw_water_grams":190.99,"raw_fat_grams":8.4,"final_grams":284.75}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Chicken Salad Sandwich', quantity: 'custom (g)', foodWord: 'CHICKENSALAD', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'cooked chicken breast', quantity: '4 oz cooked', section: 'sandwich', ndbNo: '5064', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'Greek whole milk yogurt', quantity: '3 tbsp', section: 'sandwich', ndbNo: '1293', portionDesc: 'g', portionGrams: 45.0 },
      { name: 'apple', quantity: '¼ cup chopped', section: 'sandwich', ndbNo: '9003', portionDesc: 'g', portionGrams: 31.25 },
      { name: 'celery stalk', quantity: '¼ cup chopped', section: 'sandwich', ndbNo: '11143', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'scallion (green onion)', quantity: '2 tsp chopped', section: 'sandwich', ndbNo: '11291', portionDesc: 'g', portionGrams: 4.0 },
      { name: 'lemon juice', quantity: '1 tsp', section: 'sandwich', ndbNo: '9152', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 }
    ],
    recipeInstructions: [
      'In a bowl, combine the Greek yogurt, lemon juice, and salt. Stir to mix.',
      'Add the shredded chicken, diced apple, chopped celery, and green onion. Toss to coat evenly.',
      'Spread the chicken salad evenly over one bread slice and top with the second slice.',
      'Cut diagonally and serve immediately, or refrigerate the chicken salad up to 3 days.',
      '1 sandwich (284.75g): 412.3 cal | 44.8g protein | 8.4g fat | 37.1g carbs | 2.9g fiber | 9.0g sugar | 191.0g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Chicken Salad', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_009',
    name: 'Ham and Cheese Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 87,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":505.0,"pro":27.3,"fat":28.5,"carb":33.7,"fib":2.9,"h2o":96.7,"sug":3.5,"perServing":{"cal":505.0,"pro":27.3,"fat":28.5,"carb":33.7,"fib":2.9,"h2o":96.7,"sug":3.5,"AddedSugars":0.0,"IntrinsicSugars":3.5},"micros":{"vitaminA":43.33,"vitaminC":1.78,"vitaminD":13.36,"vitaminE":0.44,"vitaminK":12.03,"vitaminB6":0.18,"vitaminB12":0.64,"thiamin":0.45,"riboflavin":0.2,"niacin":2.8,"folate":39.83,"calcium":187.83,"iron":1.66,"magnesium":23.09,"phosphorus":186.58,"potassium":182.52,"sodium":761.6,"zinc":1.5,"copper":0.08,"selenium":21.47,"cholesterol":41.86,"saturatedFat":5.02,"monoFat":4.55,"polyFat":4.28,"omega3":0.46,"omega6":2.92},"gramsPerServing":191.8,"servings":1,"per100g":{"Energy_KCal":263.31,"Water":50.44,"Protein":14.23,"TotalLipidFat":14.85,"Carbohydrate":17.56,"FiberTotalDietary":1.53,"SugarsTotal":1.84,"Cholesterol":41.86,"FattyAcids_totalSaturated":5.02,"FattyAcids_totalMonounsaturated":4.55,"FattyAcids_totalPolyunsaturated":4.28,"LinoleicAcid":2.92,"alphaLinolenicAcid":0.46,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":43.33,"Retinol":42.39,"Carotene_beta":10.67,"VitaminD":13.36,"VitaminE_alphaTocopherol":0.44,"VitaminK_phylloquinone":12.03,"VitaminC_totalAscorbicAcid":1.78,"Thiamin":0.45,"Riboflavin":0.2,"Niacin":2.8,"PantothenicAcid":0.43,"VitaminB6":0.18,"Folate_total":39.83,"Folate_food":12.92,"Folate_DFE":58.6,"FolicAcid":26.9,"VitaminB12":0.64,"Choline_total":46.17,"Betaine":34.36,"LuteinZeaxanthin":18.74,"Lycopene":0.15,"Calcium_Ca":187.83,"Iron_Fe":1.66,"Magnesium_Mg":23.09,"Phosphorus_P":186.58,"Potassium_K":182.52,"Sodium_Na":761.6,"Zinc_Zn":1.5,"Copper_Cu":0.08,"Manganese_Mn":0.42,"Selenium_Se":21.47,"Tryptophan":0.13,"Threonine":0.4,"Isoleucine":0.48,"Leucine":0.88,"Lysine":0.88,"Methionine":0.26,"Cystine":0.12,"Phenylalanine":0.47,"Tyrosine":0.44,"Valine":0.62,"Arginine":0.51,"Histidine":0.37,"Alanine":0.46,"AsparticAcid":0.75,"GlutamicAcid":1.72,"Glycine":0.38,"Proline":0.79,"Serine":0.48,"omega3":0.46,"omega6":2.92,"AddedSugars":0.0,"IntrinsicSugars":1.84},"addedSugars":0.0,"intrinsicSugars":3.5,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"7029","name":"Ham, sliced, regular (approximately 11% fat)","grams":85.0},{"ndb":"1040","name":"Cheese, swiss","grams":28.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":5.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":13.8}],"sections":[{"section_key":"sandwich","section_label":"Ham and Cheese","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":191.8,"raw_water_grams":96.74,"raw_fat_grams":28.48,"final_grams":191.8}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Ham and Cheese Sandwich', quantity: 'custom (g)', foodWord: 'HAMANDCHEESE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'sliced ham', quantity: '3 oz sliced', section: 'sandwich', ndbNo: '7029', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'Swiss cheese', quantity: '1 oz (1 slice)', section: 'sandwich', ndbNo: '1040', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'yellow mustard', quantity: '1 tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'mayonnaise', quantity: '1 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 13.8 }
    ],
    recipeInstructions: [
      'Spread mustard and mayonnaise on one or both bread slices.',
      'Layer the sliced ham and Swiss cheese on one slice, then top with the second slice.',
      'Cut diagonally and serve.',
      '1 sandwich (191.8 g): 505.0 cal | 27.3g protein | 28.5g fat | 33.7g carbs | 2.9g fiber | 3.5g sugar | 96.7g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Ham and Cheese', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_010',
    name: 'Peanut Butter & Jelly Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'vegan',
    levelNum: 88,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":406.6,"pro":12.5,"fat":18.4,"carb":50.6,"fib":3.4,"h2o":28.3,"sug":16.5,"perServing":{"cal":406.6,"pro":12.5,"fat":18.4,"carb":50.6,"fib":3.4,"h2o":28.3,"sug":16.5,"AddedSugars":0.0,"IntrinsicSugars":16.5},"micros":{"vitaminA":0.0,"vitaminC":1.57,"vitaminD":0.0,"vitaminE":2.74,"vitaminK":0.19,"vitaminB6":0.17,"vitaminB12":0.0,"thiamin":0.33,"riboflavin":0.2,"niacin":6.31,"folate":86.29,"calcium":94.71,"iron":2.52,"magnesium":61.04,"phosphorus":151.61,"potassium":240.68,"sodium":389.93,"zinc":1.12,"copper":0.19,"selenium":13.31,"cholesterol":0.0,"saturatedFat":3.32,"monoFat":7.73,"polyFat":4.44,"omega3":0.09,"omega6":3.49},"gramsPerServing":112.0,"servings":1,"per100g":{"Energy_KCal":363.0,"Water":25.3,"Protein":11.15,"TotalLipidFat":16.47,"Carbohydrate":45.15,"FiberTotalDietary":3.07,"SugarsTotal":14.7,"Cholesterol":0.0,"FattyAcids_totalSaturated":3.32,"FattyAcids_totalMonounsaturated":7.73,"FattyAcids_totalPolyunsaturated":4.44,"LinoleicAcid":3.49,"alphaLinolenicAcid":0.09,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":0.0,"Retinol":0.0,"Carotene_beta":0.0,"VitaminD":0.0,"VitaminE_alphaTocopherol":2.74,"VitaminK_phylloquinone":0.19,"VitaminC_totalAscorbicAcid":1.57,"Thiamin":0.33,"Riboflavin":0.2,"Niacin":6.31,"PantothenicAcid":0.61,"VitaminB6":0.17,"Folate_total":86.29,"Folate_food":40.21,"Folate_DFE":118.43,"FolicAcid":46.07,"VitaminB12":0.0,"Choline_total":27.64,"Betaine":54.82,"LuteinZeaxanthin":23.57,"Lycopene":0.0,"Calcium_Ca":94.71,"Iron_Fe":2.52,"Magnesium_Mg":61.04,"Phosphorus_P":151.61,"Potassium_K":240.68,"Sodium_Na":389.93,"Zinc_Zn":1.12,"Copper_Cu":0.19,"Manganese_Mn":0.77,"Selenium_Se":13.31,"Tryptophan":0.07,"Threonine":0.15,"Isoleucine":0.18,"Leucine":0.45,"Lysine":0.2,"Methionine":0.07,"Cystine":0.06,"Phenylalanine":0.35,"Tyrosine":0.24,"Valine":0.23,"Arginine":0.79,"Histidine":0.16,"Alanine":0.27,"AsparticAcid":0.9,"GlutamicAcid":1.47,"Glycine":0.41,"Proline":0.4,"Serine":0.43,"omega3":0.09,"omega6":3.49,"AddedSugars":0.0,"IntrinsicSugars":14.7},"addedSugars":0.0,"intrinsicSugars":16.5,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"16098","name":"Peanut butter, smooth style, with salt","grams":32.0},{"ndb":"19297","name":"Jams and preserves","grams":20.0}],"sections":[{"section_key":"sandwich","section_label":"Peanut Butter & Jelly","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":112.0,"raw_water_grams":28.34,"raw_fat_grams":18.45,"final_grams":112.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Peanut Butter & Jelly Sandwich', quantity: 'custom (g)', foodWord: 'PBJ', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'smooth peanut butter', quantity: '2 tbsp', section: 'sandwich', ndbNo: '16098', portionDesc: 'g', portionGrams: 32.0 },
      { name: 'jelly or jam', quantity: '1 tbsp', section: 'sandwich', ndbNo: '19297', portionDesc: 'g', portionGrams: 20.0 }
    ],
    recipeInstructions: [
      'Spread peanut butter evenly on one bread slice and jelly on the other.',
      'Press the slices together and cut diagonally.',
      '1 sandwich (112.0 g): 406.6 cal | 12.5g protein | 18.4g fat | 50.6g carbs | 3.4g fiber | 16.5g sugar | 28.3g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Peanut Butter & Jelly', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_011',
    name: 'Pimento Cheese Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'veggie',
    levelNum: 89,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":683.5,"pro":20.7,"fat":51.4,"carb":34.9,"fib":2.3,"h2o":89.9,"sug":5.7,"perServing":{"cal":683.5,"pro":20.7,"fat":51.4,"carb":34.9,"fib":2.3,"h2o":89.9,"sug":5.7,"AddedSugars":0.0,"IntrinsicSugars":5.7},"micros":{"vitaminA":156.83,"vitaminC":11.79,"vitaminD":7.71,"vitaminE":0.93,"vitaminK":24.98,"vitaminB6":0.08,"vitaminB12":0.36,"thiamin":0.17,"riboflavin":0.23,"niacin":1.54,"folate":43.45,"calcium":259.42,"iron":1.42,"magnesium":17.18,"phosphorus":177.84,"potassium":106.06,"sodium":539.35,"zinc":1.36,"copper":0.05,"selenium":16.13,"cholesterol":47.79,"saturatedFat":9.96,"monoFat":6.33,"polyFat":7.23,"omega3":0.8,"omega6":5.44},"gramsPerServing":201.7,"servings":1,"per100g":{"Energy_KCal":338.96,"Water":44.57,"Protein":10.24,"TotalLipidFat":25.5,"Carbohydrate":17.33,"FiberTotalDietary":1.14,"SugarsTotal":2.81,"Cholesterol":47.79,"FattyAcids_totalSaturated":9.96,"FattyAcids_totalMonounsaturated":6.33,"FattyAcids_totalPolyunsaturated":7.23,"LinoleicAcid":5.44,"alphaLinolenicAcid":0.79,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.0,"VitaminA_RAE":156.83,"Retinol":137.44,"Carotene_beta":238.61,"VitaminD":7.71,"VitaminE_alphaTocopherol":0.93,"VitaminK_phylloquinone":24.98,"VitaminC_totalAscorbicAcid":11.79,"Thiamin":0.17,"Riboflavin":0.23,"Niacin":1.54,"PantothenicAcid":0.37,"VitaminB6":0.08,"Folate_total":43.45,"Folate_food":17.86,"Folate_DFE":61.31,"FolicAcid":25.59,"VitaminB12":0.36,"Choline_total":18.4,"Betaine":30.64,"LuteinZeaxanthin":67.89,"Lycopene":0.06,"Calcium_Ca":259.42,"Iron_Fe":1.42,"Magnesium_Mg":17.18,"Phosphorus_P":177.84,"Potassium_K":106.06,"Sodium_Na":539.35,"Zinc_Zn":1.36,"Copper_Cu":0.05,"Manganese_Mn":0.22,"Selenium_Se":16.13,"Tryptophan":0.16,"Threonine":0.34,"Isoleucine":0.4,"Leucine":0.66,"Lysine":0.38,"Methionine":0.18,"Cystine":0.05,"Phenylalanine":0.35,"Tyrosine":0.36,"Valine":0.47,"Arginine":0.2,"Histidine":0.18,"Alanine":0.25,"AsparticAcid":0.6,"GlutamicAcid":1.56,"Glycine":0.18,"Proline":0.81,"Serine":0.29,"omega3":0.8,"omega6":5.44,"AddedSugars":0.0,"IntrinsicSugars":2.81},"addedSugars":0.0,"intrinsicSugars":5.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"1009","name":"Cheese, cheddar","grams":56.7},{"ndb":"1017","name":"Cheese, cream","grams":28.4},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":27.6},{"ndb":"11943","name":"Pimento, canned","grams":28.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.6},{"ndb":"2047","name":"Salt, table","grams":0.4}],"sections":[{"section_key":"sandwich","section_label":"Pimento Cheese","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":201.65,"raw_water_grams":89.88,"raw_fat_grams":51.41,"final_grams":201.65}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Pimento Cheese Sandwich', quantity: 'custom (g)', foodWord: 'PIMENTOCHEESE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'Cheddar cheese', quantity: '2 oz shredded', section: 'sandwich', ndbNo: '1009', portionDesc: 'g', portionGrams: 56.7 },
      { name: 'cream cheese', quantity: '1 oz', section: 'sandwich', ndbNo: '1017', portionDesc: 'g', portionGrams: 28.35 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 27.6 },
      { name: 'canned pimentos', quantity: '2 tbsp drained', section: 'sandwich', ndbNo: '11943', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'ground black pepper', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.6 },
      { name: 'salt', quantity: 'pinch', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 }
    ],
    recipeInstructions: [
      'Mix shredded cheddar, softened cream cheese, mayonnaise, drained pimentos, salt, and pepper until well combined.',
      'Spread generously on both slices of white bread.',
      'Press the slices together and serve. Cut diagonally if desired.',
      '1 sandwich (201.65g): 683.5 cal | 20.7g protein | 51.4g fat | 34.9g carbs | 2.3g fiber | 5.7g sugar | 89.9g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Pimento Cheese', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_012',
    name: 'Cucumber Tea Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'veggie',
    levelNum: 90,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving (4 finger sandwiches)',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":217.0,"pro":5.8,"fat":11.4,"carb":23.1,"fib":1.6,"h2o":91.5,"sug":4.3,"perServing":{"cal":217.0,"pro":5.8,"fat":11.4,"carb":23.1,"fib":1.6,"h2o":91.5,"sug":4.3,"AddedSugars":0.0,"IntrinsicSugars":4.3},"micros":{"vitaminA":72.36,"vitaminC":3.01,"vitaminD":0.0,"vitaminE":0.27,"vitaminK":4.91,"vitaminB6":0.06,"vitaminB12":0.05,"thiamin":0.18,"riboflavin":0.13,"niacin":1.48,"folate":43.37,"calcium":73.48,"iron":1.28,"magnesium":15.29,"phosphorus":63.17,"potassium":138.92,"sodium":332.09,"zinc":0.42,"copper":0.07,"selenium":8.51,"cholesterol":21.91,"saturatedFat":4.6,"monoFat":2.12,"polyFat":0.81,"omega3":0.07,"omega6":0.17},"gramsPerServing":133.7,"servings":1,"per100g":{"Energy_KCal":162.29,"Water":68.46,"Protein":4.31,"TotalLipidFat":8.56,"Carbohydrate":17.29,"FiberTotalDietary":1.21,"SugarsTotal":3.19,"Cholesterol":21.91,"FattyAcids_totalSaturated":4.6,"FattyAcids_totalMonounsaturated":2.12,"FattyAcids_totalPolyunsaturated":0.81,"LinoleicAcid":0.17,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":72.36,"Retinol":65.72,"Carotene_beta":37.19,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.27,"VitaminK_phylloquinone":4.91,"VitaminC_totalAscorbicAcid":3.01,"Thiamin":0.18,"Riboflavin":0.13,"Niacin":1.48,"PantothenicAcid":0.39,"VitaminB6":0.06,"Folate_total":43.37,"Folate_food":17.64,"Folate_DFE":61.32,"FolicAcid":25.73,"VitaminB12":0.05,"Choline_total":12.97,"Betaine":30.7,"LuteinZeaxanthin":24.37,"Lycopene":0.04,"Calcium_Ca":73.48,"Iron_Fe":1.28,"Magnesium_Mg":15.29,"Phosphorus_P":63.17,"Potassium_K":138.92,"Sodium_Na":332.09,"Zinc_Zn":0.42,"Copper_Cu":0.07,"Manganese_Mn":0.23,"Selenium_Se":8.51,"Tryptophan":0.02,"Threonine":0.06,"Isoleucine":0.08,"Leucine":0.15,"Lysine":0.13,"Methionine":0.05,"Cystine":0.01,"Phenylalanine":0.08,"Tyrosine":0.07,"Valine":0.09,"Arginine":0.07,"Histidine":0.04,"Alanine":0.06,"AsparticAcid":0.13,"GlutamicAcid":0.38,"Glycine":0.04,"Proline":0.15,"Serine":0.09,"omega3":0.07,"omega6":0.17,"AddedSugars":0.0,"IntrinsicSugars":3.19},"addedSugars":0.0,"intrinsicSugars":4.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":40.0},{"ndb":"11206","name":"Cucumber, peeled, raw","grams":60.0},{"ndb":"1017","name":"Cheese, cream","grams":29.0},{"ndb":"11156","name":"Chives, raw","grams":0.5},{"ndb":"2045","name":"Dill weed, fresh","grams":1.0},{"ndb":"9152","name":"Lemon juice, raw","grams":2.5},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.3}],"sections":[{"section_key":"sandwich","section_label":"Cucumber Tea","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":133.7,"raw_water_grams":91.52,"raw_fat_grams":11.45,"final_grams":133.7}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Cucumber Tea Sandwich', quantity: 'custom (g)', foodWord: 'CUCUMBERTEA', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices crusts removed (~20g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'cucumber peeled', quantity: 'about 8 thin slices (60g)', section: 'sandwich', ndbNo: '11206', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'cream cheese', quantity: '2 tbsp', section: 'sandwich', ndbNo: '1017', portionDesc: 'g', portionGrams: 29.0 },
      { name: 'fresh chives', quantity: '½ tsp chopped', section: 'sandwich', ndbNo: '11156', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'fresh dill', quantity: '1 tsp', section: 'sandwich', ndbNo: '2045', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'lemon juice', quantity: '½ tsp', section: 'sandwich', ndbNo: '9152', portionDesc: 'g', portionGrams: 2.5 },
      { name: 'salt', quantity: 'pinch', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 },
      { name: 'ground black pepper', quantity: 'pinch', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Mix cream cheese with lemon juice, salt, black pepper, and finely chopped herbs until smooth.',
      'Remove crusts from bread slices and spread cream cheese mixture evenly on one side of each bread slice.',
      'Layer thin cucumber slices over the spread on one bread slice, then top with the remaining bread slice.',
      'Cut each sandwich into three fingers or four triangles.',
      'Chill sandwiches in the refrigerator until they firm up slightly and maintain their shape when served.',
      'Sandwiches can be stored covered overnight.',
      '1 sandwich (133.7g): 217.0 cal | 5.8g protein | 11.4g fat | 23.1g carbs | 1.6g fiber | 4.3g sugar | 91.5g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Cucumber Tea', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_013',
    name: 'Croque Monsieur',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 91,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":797.3,"pro":36.6,"fat":52.5,"carb":44.5,"fib":2.9,"h2o":172.1,"sug":9.9,"perServing":{"cal":797.3,"pro":36.6,"fat":52.5,"carb":44.5,"fib":2.9,"h2o":172.1,"sug":9.9,"AddedSugars":0.0,"IntrinsicSugars":9.9},"micros":{"vitaminA":103.17,"vitaminC":0.36,"vitaminD":27.9,"vitaminE":0.27,"vitaminK":1.27,"vitaminB6":0.08,"vitaminB12":0.47,"thiamin":0.2,"riboflavin":0.18,"niacin":1.32,"folate":23.54,"calcium":262.69,"iron":1.07,"magnesium":20.53,"phosphorus":195.13,"potassium":149.91,"sodium":569.15,"zinc":1.27,"copper":0.05,"selenium":13.46,"cholesterol":53.44,"saturatedFat":9.48,"monoFat":4.97,"polyFat":0.85,"omega3":0.04,"omega6":0.16},"gramsPerServing":313.5,"servings":1,"per100g":{"Energy_KCal":254.29,"Water":54.89,"Protein":11.69,"TotalLipidFat":16.75,"Carbohydrate":14.21,"FiberTotalDietary":0.92,"SugarsTotal":3.15,"Cholesterol":53.44,"FattyAcids_totalSaturated":9.48,"FattyAcids_totalMonounsaturated":4.97,"FattyAcids_totalPolyunsaturated":0.85,"LinoleicAcid":0.16,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":103.17,"Retinol":101.4,"Carotene_beta":19.25,"VitaminD":27.9,"VitaminE_alphaTocopherol":0.27,"VitaminK_phylloquinone":1.27,"VitaminC_totalAscorbicAcid":0.36,"Thiamin":0.2,"Riboflavin":0.18,"Niacin":1.32,"PantothenicAcid":0.36,"VitaminB6":0.08,"Folate_total":23.54,"Folate_food":8.25,"Folate_DFE":34.21,"FolicAcid":20.39,"VitaminB12":0.47,"Choline_total":25.06,"Betaine":20.73,"LuteinZeaxanthin":8.14,"Lycopene":0.01,"Calcium_Ca":262.69,"Iron_Fe":1.07,"Magnesium_Mg":20.53,"Phosphorus_P":195.13,"Potassium_K":149.91,"Sodium_Na":569.15,"Zinc_Zn":1.27,"Copper_Cu":0.05,"Manganese_Mn":0.24,"Selenium_Se":13.46,"Tryptophan":0.12,"Threonine":0.36,"Isoleucine":0.47,"Leucine":0.88,"Lysine":0.8,"Methionine":0.24,"Cystine":0.08,"Phenylalanine":0.48,"Tyrosine":0.47,"Valine":0.62,"Arginine":0.38,"Histidine":0.33,"Alanine":0.35,"AsparticAcid":0.63,"GlutamicAcid":1.81,"Glycine":0.25,"Proline":0.96,"Serine":0.49,"omega3":0.04,"omega6":0.16,"AddedSugars":0.0,"IntrinsicSugars":3.15},"addedSugars":0.0,"intrinsicSugars":9.9,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.88,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"7029","name":"Ham, sliced, regular (approximately 11% fat)","grams":56.0},{"ndb":"1023","name":"Cheese, gruyere","grams":56.7},{"ndb":"1001","name":"Butter, salted","grams":28.4},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":8.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":122.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":5.0},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.3},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.2}],"sections":[{"section_key":"sandwich","section_label":"Croque Monsieur","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.88,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":10,"raw_grams":337.0,"raw_water_grams":195.55,"raw_fat_grams":52.51,"final_grams":313.53}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Croque Monsieur', quantity: 'custom (g)', foodWord: 'CROQUEMONSIEUR', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'sliced ham', quantity: '2 oz', section: 'sandwich', ndbNo: '7029', portionDesc: 'g', portionGrams: 56.0 },
      { name: 'Gruyere cheese', quantity: '2 oz', section: 'sandwich', ndbNo: '1023', portionDesc: 'g', portionGrams: 56.7 },
      { name: 'salted butter', quantity: '2 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 28.4 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 tbsp', section: 'sandwich', ndbNo: '20581', portionDesc: 'g', portionGrams: 8.0 },
      { name: 'whole milk', quantity: '½ cup', section: 'sandwich', ndbNo: '1077', portionDesc: 'g', portionGrams: 122.0 },
      { name: 'yellow mustard', quantity: '1 tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'ground nutmeg', quantity: 'pinch', section: 'sandwich', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'salt', quantity: 'pinch', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 },
      { name: 'ground black pepper', quantity: 'pinch', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.2 }
    ],
    recipeInstructions: [
      'Melt 1 tablespoon of butter in a small saucepan over medium heat, whisk in flour, and cook for 1 minute. Gradually whisk in milk and cook, stirring constantly, until thickened, about 3 minutes. Season with nutmeg, salt, and pepper. The sauce should be a spreadable thickness and as it cools it becomes thicker.',
      'Spread mustard on the inside of both bread slices, then spread a layer of béchamel over the mustard. Layer ham over one slice, add half the Gruyère, and close the sandwich.',
      'Melt remaining butter in a skillet over medium heat. Place the sandwich in the pan and cook 3 minutes until the bottom is golden.',
      'Flip the sandwich, spoon remaining béchamel over the top, and scatter remaining Gruyère over it. Cover the pan and cook 2–3 minutes until the bottom is golden and the cheese on top is melted.',
      '1 sandwich (313.53g): 797.3 cal | 36.6g protein | 52.5g fat | 44.5g carbs | 2.9g fiber | 9.9g sugar | 172.1g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Croque Monsieur', cookingMethod: '', yieldFactorWater: 0.88 }
    ],
  },
  {
    id: 'SAND_014',
    name: 'Croque Madame',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 92,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":887.5,"pro":42.9,"fat":59.3,"carb":44.9,"fib":2.9,"h2o":200.2,"sug":10.1,"perServing":{"cal":887.5,"pro":42.9,"fat":59.3,"carb":44.9,"fib":2.9,"h2o":200.2,"sug":10.1,"AddedSugars":0.0,"IntrinsicSugars":10.1},"micros":{"vitaminA":113.6,"vitaminC":0.32,"vitaminD":35.4,"vitaminE":0.36,"vitaminK":1.77,"vitaminB6":0.08,"vitaminB12":0.52,"thiamin":0.18,"riboflavin":0.22,"niacin":1.17,"folate":25.69,"calcium":239.57,"iron":1.19,"magnesium":19.77,"phosphorus":199.81,"potassium":151.79,"sodium":528.45,"zinc":1.3,"copper":0.06,"selenium":16.15,"cholesterol":98.96,"saturatedFat":8.92,"monoFat":5.18,"polyFat":1.06,"omega3":0.04,"omega6":0.14},"gramsPerServing":355.7,"servings":1,"per100g":{"Energy_KCal":249.5,"Water":56.29,"Protein":12.06,"TotalLipidFat":16.68,"Carbohydrate":12.63,"FiberTotalDietary":0.81,"SugarsTotal":2.82,"Cholesterol":98.96,"FattyAcids_totalSaturated":8.92,"FattyAcids_totalMonounsaturated":5.18,"FattyAcids_totalPolyunsaturated":1.06,"LinoleicAcid":0.14,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":113.6,"Retinol":111.73,"Carotene_beta":20.59,"VitaminD":35.4,"VitaminE_alphaTocopherol":0.36,"VitaminK_phylloquinone":1.77,"VitaminC_totalAscorbicAcid":0.32,"Thiamin":0.18,"Riboflavin":0.22,"Niacin":1.17,"PantothenicAcid":0.49,"VitaminB6":0.08,"Folate_total":25.69,"Folate_food":12.22,"Folate_DFE":35.11,"FolicAcid":17.97,"VitaminB12":0.52,"Choline_total":59.0,"Betaine":18.32,"LuteinZeaxanthin":52.82,"Lycopene":0.01,"Calcium_Ca":239.57,"Iron_Fe":1.19,"Magnesium_Mg":19.77,"Phosphorus_P":199.81,"Potassium_K":151.79,"Sodium_Na":528.45,"Zinc_Zn":1.3,"Copper_Cu":0.06,"Manganese_Mn":0.21,"Selenium_Se":16.15,"Tryptophan":0.13,"Threonine":0.39,"Isoleucine":0.51,"Leucine":0.93,"Lysine":0.84,"Methionine":0.27,"Cystine":0.1,"Phenylalanine":0.52,"Tyrosine":0.48,"Valine":0.67,"Arginine":0.45,"Histidine":0.33,"Alanine":0.41,"AsparticAcid":0.74,"GlutamicAcid":1.83,"Glycine":0.28,"Proline":0.92,"Serine":0.57,"omega3":0.04,"omega6":0.14,"AddedSugars":0.0,"IntrinsicSugars":2.82},"addedSugars":0.0,"intrinsicSugars":10.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.88,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"7029","name":"Ham, sliced, regular (approximately 11% fat)","grams":56.0},{"ndb":"1023","name":"Cheese, gruyere","grams":56.7},{"ndb":"1001","name":"Butter, salted","grams":28.4},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":8.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":122.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":5.0},{"ndb":"1128","name":"Egg, whole, cooked, fried","grams":46.0},{"ndb":"2025","name":"Spices, nutmeg, ground","grams":0.3},{"ndb":"2047","name":"Salt, table","grams":0.4},{"ndb":"2030","name":"Spices, pepper, black","grams":0.2}],"sections":[{"section_key":"sandwich","section_label":"Croque Madame","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.88,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":11,"raw_grams":383.0,"raw_water_grams":227.51,"raw_fat_grams":59.34,"final_grams":355.7}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Croque Madame', quantity: 'custom (g)', foodWord: 'CROQUEMADAME', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'sliced ham', quantity: '2 oz', section: 'sandwich', ndbNo: '7029', portionDesc: 'g', portionGrams: 56.0 },
      { name: 'Gruyere cheese', quantity: '2 oz', section: 'sandwich', ndbNo: '1023', portionDesc: 'g', portionGrams: 56.7 },
      { name: 'salted butter', quantity: '2 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 28.4 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 tbsp', section: 'sandwich', ndbNo: '20581', portionDesc: 'g', portionGrams: 8.0 },
      { name: 'whole milk', quantity: '½ cup', section: 'sandwich', ndbNo: '1077', portionDesc: 'g', portionGrams: 122.0 },
      { name: 'yellow mustard', quantity: '1 tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'fried egg', quantity: '1 large', section: 'sandwich', ndbNo: '1128', portionDesc: 'g', portionGrams: 46.0 },
      { name: 'ground nutmeg', quantity: 'pinch', section: 'sandwich', ndbNo: '2025', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'salt', quantity: 'pinch', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.4 },
      { name: 'ground black pepper', quantity: 'pinch', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.2 }
    ],
    recipeInstructions: [
      'Melt 1 tablespoon of butter in a small saucepan over medium heat, whisk in flour, and cook for 1 minute. Gradually whisk in milk and cook, stirring constantly, until thickened, about 3 minutes. Season with nutmeg, salt, and pepper. The sauce should be a spreadable thickness and as it cools it becomes thicker.',
      'Spread mustard on the inside of both bread slices, then spread a layer of béchamel over the mustard. Layer ham over one slice, add half the Gruyère, and close the sandwich.',
      'Melt remaining butter in a skillet over medium heat. Place the sandwich in the pan and cook 3 minutes until the bottom is golden.',
      'Flip the sandwich, spoon remaining béchamel over the top, and scatter remaining Gruyère over it. Cover the pan and cook 2–3 minutes until the bottom is golden and the cheese on top is melted. Remove to a plate.',
      'In the same pan, fry the egg sunny side up until the white is set but the yolk is still runny. Place on top of the sandwich and serve immediately.',
      '1 sandwich (355.7g): 887.5 cal | 42.9g protein | 59.3g fat | 44.9g carbs | 2.9g fiber | 10.1g sugar | 200.2g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Croque Madame', cookingMethod: '', yieldFactorWater: 0.88 }
    ],
  },
  {
    id: 'SAND_015',
    name: 'Monte Cristo Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 93,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 sandwich',
    prepTime: '15 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":781.3,"pro":41.9,"fat":50.9,"carb":38.0,"fib":2.4,"h2o":165.1,"sug":8.1,"perServing":{"cal":781.3,"pro":41.9,"fat":50.9,"carb":38.0,"fib":2.4,"h2o":165.1,"sug":8.1,"AddedSugars":2.5,"IntrinsicSugars":5.6},"micros":{"vitaminA":108.17,"vitaminC":0.37,"vitaminD":23.76,"vitaminE":0.42,"vitaminK":0.87,"vitaminB6":0.14,"vitaminB12":0.66,"thiamin":0.18,"riboflavin":0.22,"niacin":2.28,"folate":25.42,"calcium":182.8,"iron":1.29,"magnesium":19.93,"phosphorus":217.64,"potassium":195.24,"sodium":589.35,"zinc":1.44,"copper":0.06,"selenium":20.32,"cholesterol":115.05,"saturatedFat":8.9,"monoFat":4.91,"polyFat":1.09,"omega3":0.07,"omega6":0.57},"gramsPerServing":303.6,"servings":1,"per100g":{"Energy_KCal":257.32,"Water":54.38,"Protein":13.81,"TotalLipidFat":16.76,"Carbohydrate":12.51,"FiberTotalDietary":0.77,"SugarsTotal":2.66,"Cholesterol":115.05,"FattyAcids_totalSaturated":8.9,"FattyAcids_totalMonounsaturated":4.91,"FattyAcids_totalPolyunsaturated":1.09,"LinoleicAcid":0.57,"alphaLinolenicAcid":0.06,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.01,"VitaminA_RAE":108.17,"Retinol":106.56,"Carotene_beta":19.21,"VitaminD":23.76,"VitaminE_alphaTocopherol":0.42,"VitaminK_phylloquinone":0.87,"VitaminC_totalAscorbicAcid":0.37,"Thiamin":0.18,"Riboflavin":0.22,"Niacin":2.28,"PantothenicAcid":0.47,"VitaminB6":0.14,"Folate_total":25.42,"Folate_food":12.67,"Folate_DFE":34.31,"FolicAcid":17.0,"VitaminB12":0.66,"Choline_total":69.61,"Betaine":22.05,"LuteinZeaxanthin":60.22,"Lycopene":0.11,"Calcium_Ca":182.8,"Iron_Fe":1.29,"Magnesium_Mg":19.93,"Phosphorus_P":217.64,"Potassium_K":195.24,"Sodium_Na":589.35,"Zinc_Zn":1.44,"Copper_Cu":0.06,"Manganese_Mn":0.21,"Selenium_Se":20.32,"Tryptophan":0.15,"Threonine":0.49,"Isoleucine":0.59,"Leucine":1.06,"Lysine":1.02,"Methionine":0.33,"Cystine":0.13,"Phenylalanine":0.57,"Tyrosine":0.52,"Valine":0.73,"Arginine":0.65,"Histidine":0.38,"Alanine":0.58,"AsparticAcid":0.97,"GlutamicAcid":2.0,"Glycine":0.44,"Proline":0.87,"Serine":0.63,"omega3":0.07,"omega6":0.57,"AddedSugars":0.81,"IntrinsicSugars":1.86},"addedSugars":2.5,"intrinsicSugars":5.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.88,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"7029","name":"Ham, sliced, regular (approximately 11% fat)","grams":56.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":56.7},{"ndb":"1040","name":"Cheese, swiss","grams":42.5},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":50.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":30.0},{"ndb":"1001","name":"Butter, salted","grams":28.4},{"ndb":"19336","name":"Sugars, powdered","grams":2.5}],"sections":[{"section_key":"sandwich","section_label":"Monte Cristo Sandwich","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.88,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":326.12,"raw_water_grams":187.63,"raw_fat_grams":50.9,"final_grams":303.61}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Monte Cristo Sandwich', quantity: 'custom (g)', foodWord: 'MONTECRISTO', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'sliced ham', quantity: '2 oz', section: 'sandwich', ndbNo: '7029', portionDesc: 'g', portionGrams: 56.0 },
      { name: 'deli turkey breast', quantity: '2 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 56.7 },
      { name: 'Swiss cheese', quantity: '1½ oz', section: 'sandwich', ndbNo: '1040', portionDesc: 'g', portionGrams: 42.525 },
      { name: 'large egg', quantity: '1 large', section: 'sandwich', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'whole milk', quantity: '2 tbsp', section: 'sandwich', ndbNo: '1077', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'salted butter', quantity: '2 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 28.4 },
      { name: 'powdered sugar', quantity: '1 tsp', section: 'sandwich', ndbNo: '19336', portionDesc: 'g', portionGrams: 2.5 }
    ],
    recipeInstructions: [
      'Beat egg and milk together in a shallow dish until well combined.',
      'Layer ham, turkey, and Swiss cheese between the two slices of bread and press firmly together.',
      'Dip the assembled sandwich in the egg batter, turning to coat all sides evenly. Let any excess drip off.',
      'Melt butter in a skillet over medium heat. Place the sandwich in the pan, cover with a lid or foil, and cook 3 minutes until the bottom is deep golden brown.',
      'Flip and cook another 2–3 minutes uncovered until both sides are golden and the cheese is melted through.',
      'Transfer to a plate, dust with powdered sugar, and serve immediately. Consider raspberry jam (not included in nutrient calculation) alongside for dipping.',
      '1 sandwich (303.61g): 781.3 cal | 41.9g protein | 50.9g fat | 38.0g carbs | 2.4g fiber | 8.1g sugar | 165.1g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Monte Cristo Sandwich', cookingMethod: '', yieldFactorWater: 0.88 }
    ],
  },
  {
    id: 'SAND_016',
    name: 'Hot Brown',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 94,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":1052.7,"pro":45.5,"fat":76.8,"carb":45.5,"fib":2.7,"h2o":230.9,"sug":9.8,"perServing":{"cal":1052.7,"pro":45.5,"fat":76.8,"carb":45.5,"fib":2.7,"h2o":230.9,"sug":9.8,"AddedSugars":0.0,"IntrinsicSugars":9.8},"micros":{"vitaminA":142.28,"vitaminC":1.2,"vitaminD":21.26,"vitaminE":0.48,"vitaminK":2.5,"vitaminB6":0.14,"vitaminB12":0.27,"thiamin":0.11,"riboflavin":0.17,"niacin":3.0,"folate":20.03,"calcium":134.89,"iron":0.94,"magnesium":18.01,"phosphorus":180.09,"potassium":224.19,"sodium":576.89,"zinc":0.86,"copper":0.04,"selenium":12.93,"cholesterol":64.59,"saturatedFat":10.74,"monoFat":4.96,"polyFat":1.19,"omega3":0.08,"omega6":0.74},"gramsPerServing":408.3,"servings":1,"per100g":{"Energy_KCal":257.82,"Water":56.55,"Protein":11.16,"TotalLipidFat":18.81,"Carbohydrate":11.14,"FiberTotalDietary":0.66,"SugarsTotal":2.4,"Cholesterol":64.59,"FattyAcids_totalSaturated":10.74,"FattyAcids_totalMonounsaturated":4.96,"FattyAcids_totalPolyunsaturated":1.19,"LinoleicAcid":0.74,"alphaLinolenicAcid":0.07,"EPA_20_5n3":0.0,"DPA_22_5n3":0.01,"DHA_22_6n3":0.0,"VitaminA_RAE":142.28,"Retinol":133.24,"Carotene_beta":93.36,"VitaminD":21.26,"VitaminE_alphaTocopherol":0.48,"VitaminK_phylloquinone":2.5,"VitaminC_totalAscorbicAcid":1.2,"Thiamin":0.11,"Riboflavin":0.17,"Niacin":3.0,"PantothenicAcid":0.37,"VitaminB6":0.14,"Folate_total":20.03,"Folate_food":7.51,"Folate_DFE":28.78,"FolicAcid":15.65,"VitaminB12":0.27,"Choline_total":20.93,"Betaine":16.49,"LuteinZeaxanthin":28.16,"Lycopene":321.38,"Calcium_Ca":134.89,"Iron_Fe":0.94,"Magnesium_Mg":18.01,"Phosphorus_P":180.09,"Potassium_K":224.19,"Sodium_Na":576.89,"Zinc_Zn":0.86,"Copper_Cu":0.04,"Manganese_Mn":0.12,"Selenium_Se":12.93,"Tryptophan":0.13,"Threonine":0.43,"Isoleucine":0.48,"Leucine":0.87,"Lysine":0.86,"Methionine":0.28,"Cystine":0.08,"Phenylalanine":0.45,"Tyrosine":0.43,"Valine":0.55,"Arginine":0.58,"Histidine":0.34,"Alanine":0.5,"AsparticAcid":0.87,"GlutamicAcid":1.93,"Glycine":0.41,"Proline":0.7,"Serine":0.46,"omega3":0.08,"omega6":0.74,"AddedSugars":0.0,"IntrinsicSugars":2.4},"addedSugars":0.0,"intrinsicSugars":9.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.92,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":60.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":113.4},{"ndb":"10862","name":"Pork, cured, bacon, pre-sliced, cooked, pan-fried","grams":23.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":60.0},{"ndb":"1001","name":"Butter, salted","grams":14.2},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":8.0},{"ndb":"1053","name":"Cream, fluid, heavy whipping","grams":119.0},{"ndb":"1033","name":"Cheese, parmesan, hard","grams":30.0},{"ndb":"2028","name":"Spices, paprika","grams":0.3},{"ndb":"2047","name":"Salt, table","grams":0.3},{"ndb":"2030","name":"Spices, pepper, black","grams":0.2}],"sections":[{"section_key":"sandwich","section_label":"Hot Brown","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.92,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":11,"raw_grams":428.4,"raw_water_grams":250.97,"raw_fat_grams":76.79,"final_grams":408.32}],"cookingMethod":"baked"},
    recipeIngredients: [
      { name: 'Hot Brown', quantity: 'custom (g)', foodWord: 'HOTBROWN', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '2 slices (30g each)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'deli turkey breast', quantity: '4 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 113.4 },
      { name: 'cooked bacon', quantity: '2 strips', section: 'sandwich', ndbNo: '10862', portionDesc: 'g', portionGrams: 23.0 },
      { name: 'tomato raw', quantity: '4 thin slices (60g)', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.2 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '1 tbsp', section: 'sandwich', ndbNo: '20581', portionDesc: 'g', portionGrams: 8.0 },
      { name: 'heavy cream', quantity: '½ cup', section: 'sandwich', ndbNo: '1053', portionDesc: 'g', portionGrams: 119.0 },
      { name: 'Parmesan cheese', quantity: '¼ cup + 1 tbsp', section: 'sandwich', ndbNo: '1033', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'paprika', quantity: 'pinch', section: 'sandwich', ndbNo: '2028', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'salt', quantity: 'pinch', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'ground black pepper', quantity: 'pinch', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.2 }
    ],
    recipeInstructions: [
      'Melt butter in a small saucepan over medium heat, whisk in flour, and cook 1 minute or until lightly brown. Gradually whisk in heavy cream and cook, stirring constantly, until thickened, about 3–4 minutes. Remove from heat, stir in parmesan, and season with salt, pepper, and paprika.',
      'Toast the bread slices and arrange them open-faced side by side in a broiler-safe baking dish.',
      'Top evenly with the sliced turkey, tomato slices and cheese sauce. Sprinkle with the remaining 1 tablespoon of parmesan.',
      'Broil 3–4 minutes until the sauce is bubbling and parmesan lightly browned on top.',
      'Remove from the oven and transfer to serving plate. Cross two bacon strips over the top of each slice and serve immediately.',
      '1 serving (408g): 1053 cal | 45.5g protein | 76.8g fat | 45.5g carbs | 2.7g fiber | 9.8g sugar | 230.9g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Hot Brown', cookingMethod: '', yieldFactorWater: 0.92 }
    ],
  },
  {
    id: 'SAND_017',
    name: 'Open-Faced Roast Beef with Gravy',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 95,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":286.8,"pro":25.7,"fat":11.3,"carb":19.3,"fib":1.0,"h2o":186.5,"sug":2.2,"perServing":{"cal":286.8,"pro":25.7,"fat":11.3,"carb":19.3,"fib":1.0,"h2o":186.5,"sug":2.2,"AddedSugars":0.0,"IntrinsicSugars":2.2},"micros":{"vitaminA":18.81,"vitaminC":0.05,"vitaminD":0.45,"vitaminE":0.3,"vitaminK":1.07,"vitaminB6":0.14,"vitaminB12":0.82,"thiamin":0.06,"riboflavin":0.12,"niacin":2.33,"folate":12.84,"calcium":21.25,"iron":1.26,"magnesium":10.9,"phosphorus":111.69,"potassium":275.91,"sodium":651.53,"zinc":1.33,"copper":0.05,"selenium":9.75,"cholesterol":29.32,"saturatedFat":2.2,"monoFat":1.41,"polyFat":0.35,"omega3":0.03,"omega6":0.11},"gramsPerServing":249.3,"servings":1,"per100g":{"Energy_KCal":115.03,"Water":74.79,"Protein":10.29,"TotalLipidFat":4.51,"Carbohydrate":7.75,"FiberTotalDietary":0.41,"SugarsTotal":0.89,"Cholesterol":29.32,"FattyAcids_totalSaturated":2.2,"FattyAcids_totalMonounsaturated":1.41,"FattyAcids_totalPolyunsaturated":0.35,"LinoleicAcid":0.11,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":18.81,"Retinol":18.43,"Carotene_beta":4.56,"VitaminD":0.45,"VitaminE_alphaTocopherol":0.3,"VitaminK_phylloquinone":1.07,"VitaminC_totalAscorbicAcid":0.05,"Thiamin":0.06,"Riboflavin":0.12,"Niacin":2.33,"PantothenicAcid":0.24,"VitaminB6":0.14,"Folate_total":12.84,"Folate_food":4.51,"Folate_DFE":18.66,"FolicAcid":12.82,"VitaminB12":0.82,"Choline_total":20.17,"Betaine":12.28,"LuteinZeaxanthin":5.47,"Lycopene":0.02,"Calcium_Ca":21.25,"Iron_Fe":1.26,"Magnesium_Mg":10.9,"Phosphorus_P":111.69,"Potassium_K":275.91,"Sodium_Na":651.53,"Zinc_Zn":1.33,"Copper_Cu":0.05,"Manganese_Mn":0.09,"Selenium_Se":9.75,"Tryptophan":0.0,"Threonine":0.01,"Isoleucine":0.01,"Leucine":0.01,"Lysine":0.01,"Methionine":0.0,"Cystine":0.0,"Phenylalanine":0.01,"Tyrosine":0.01,"Valine":0.01,"Arginine":0.01,"Histidine":0.0,"Alanine":0.01,"AsparticAcid":0.01,"GlutamicAcid":0.06,"Glycine":0.01,"Proline":0.02,"Serine":0.01,"omega3":0.03,"omega6":0.11,"AddedSugars":0.0,"IntrinsicSugars":0.89},"addedSugars":0.0,"intrinsicSugars":2.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.87,"yieldFactorFat":1.0,"sources":[{"ndb":"18069","name":"Bread, white, commercially prepared (includes soft bread crumbs)","grams":30.0},{"ndb":"7043","name":"Roast beef, deli style, prepackaged, sliced","grams":113.4},{"ndb":"1001","name":"Butter, salted","grams":7.1},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":4.0},{"ndb":"6008","name":"Soup, beef broth or bouillon canned, ready-to-serve","grams":120.0},{"ndb":"6971","name":"Sauce, worcestershire","grams":1.4},{"ndb":"2026","name":"Spices, onion powder","grams":0.3},{"ndb":"2047","name":"Salt, table","grams":0.8},{"ndb":"2030","name":"Spices, pepper, black","grams":0.2}],"sections":[{"section_key":"sandwich","section_label":"Open-Faced Roast Beef with Gravy","prep_method":"raw","cook_method":"boiled","cooking_method":"boiled","cooking_method_normalized":"boiled","yield_factor_water":0.87,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":277.22,"raw_water_grams":214.35,"raw_fat_grams":11.26,"final_grams":249.35}],"cookingMethod":"boiled"},
    recipeIngredients: [
      { name: 'Open-Faced Roast Beef with Gravy', quantity: 'custom (g)', foodWord: 'OPENFACEDROASTBEEF', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'white bread', quantity: '1 slice (30g)', section: 'sandwich', ndbNo: '18069', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'deli roast beef', quantity: '4 oz', section: 'sandwich', ndbNo: '7043', portionDesc: 'g', portionGrams: 113.4 },
      { name: 'salted butter', quantity: '½ tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 7.1 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '½ tbsp', section: 'sandwich', ndbNo: '20581', portionDesc: 'g', portionGrams: 4.0 },
      { name: 'beef broth', quantity: '½ cup', section: 'sandwich', ndbNo: '6008', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'Worcestershire sauce', quantity: '¼ tsp', section: 'sandwich', ndbNo: '6971', portionDesc: 'g', portionGrams: 1.42 },
      { name: 'onion powder', quantity: '⅛ tsp', section: 'sandwich', ndbNo: '2026', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'salt', quantity: '⅛ tsp', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.75 },
      { name: 'ground black pepper', quantity: '⅛ tsp', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.25 }
    ],
    recipeInstructions: [
      'Toast the bread slice and arrange it open-faced on a plate.',
      'Melt butter in a small saucepan over medium heat. Whisk in flour and cook 1–2 minutes until lightly golden.',
      'Gradually whisk in beef broth. Add Worcestershire sauce, onion powder, salt, and pepper. Bring to a simmer, stirring constantly, until gravy thickens, about 3–4 minutes.',
      'Add the sliced roast beef to the gravy and heat through, about 1 minute.',
      'Arrange the beef over the toasted bread and spoon the gravy generously over everything. Serve immediately.',
      '1 serving (249g): 287 cal | 25.7g protein | 11.3g fat | 19.3g carbs | 1.0g fiber | 2.2g sugar | 186.5g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Open-Faced Roast Beef with Gravy', cookingMethod: '', yieldFactorWater: 0.87 }
    ],
  },
  {
    id: 'SAND_018',
    name: 'Turkey Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 96,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":446.6,"pro":21.2,"fat":26.2,"carb":31.0,"fib":4.4,"h2o":138.2,"sug":4.8,"perServing":{"cal":446.6,"pro":21.2,"fat":26.2,"carb":31.0,"fib":4.4,"h2o":138.2,"sug":4.8,"AddedSugars":0.0,"IntrinsicSugars":4.8},"micros":{"vitaminA":9.37,"vitaminC":2.04,"vitaminD":3.17,"vitaminE":1.31,"vitaminK":25.25,"vitaminB6":0.23,"vitaminB12":0.16,"thiamin":0.13,"riboflavin":0.1,"niacin":4.11,"folate":18.28,"calcium":55.44,"iron":0.96,"magnesium":31.04,"phosphorus":163.96,"potassium":259.78,"sodium":556.3,"zinc":0.92,"copper":0.08,"selenium":12.7,"cholesterol":24.03,"saturatedFat":2.01,"monoFat":2.72,"polyFat":6.43,"omega3":0.72,"omega6":5.6},"gramsPerServing":221.6,"servings":1,"per100g":{"Energy_KCal":201.52,"Water":62.38,"Protein":9.58,"TotalLipidFat":11.82,"Carbohydrate":13.98,"FiberTotalDietary":1.98,"SugarsTotal":2.16,"Cholesterol":24.03,"FattyAcids_totalSaturated":2.01,"FattyAcids_totalMonounsaturated":2.72,"FattyAcids_totalPolyunsaturated":6.43,"LinoleicAcid":5.6,"alphaLinolenicAcid":0.72,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":9.37,"Retinol":1.87,"Carotene_beta":82.35,"VitaminD":3.17,"VitaminE_alphaTocopherol":1.31,"VitaminK_phylloquinone":25.25,"VitaminC_totalAscorbicAcid":2.04,"Thiamin":0.13,"Riboflavin":0.1,"Niacin":4.11,"PantothenicAcid":0.35,"VitaminB6":0.23,"Folate_total":18.28,"Folate_food":18.28,"Folate_DFE":18.28,"FolicAcid":0.0,"VitaminB12":0.16,"Choline_total":25.02,"Betaine":37.97,"LuteinZeaxanthin":62.02,"Lycopene":348.33,"Calcium_Ca":55.44,"Iron_Fe":0.96,"Magnesium_Mg":31.04,"Phosphorus_P":163.96,"Potassium_K":259.78,"Sodium_Na":556.3,"Zinc_Zn":0.92,"Copper_Cu":0.08,"Manganese_Mn":0.65,"Selenium_Se":12.7,"Tryptophan":0.07,"Threonine":0.29,"Isoleucine":0.29,"Leucine":0.53,"Lysine":0.57,"Methionine":0.19,"Cystine":0.07,"Phenylalanine":0.25,"Tyrosine":0.23,"Valine":0.3,"Arginine":0.46,"Histidine":0.19,"Alanine":0.4,"AsparticAcid":0.64,"GlutamicAcid":1.09,"Glycine":0.35,"Proline":0.28,"Serine":0.28,"omega3":0.72,"omega6":5.6,"AddedSugars":0.0,"IntrinsicSugars":2.16},"addedSugars":0.0,"intrinsicSugars":4.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18075","name":"Bread, whole-wheat, commercially prepared","grams":64.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":85.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":15.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":30.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":27.6}],"sections":[{"section_key":"sandwich","section_label":"Turkey Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":221.6,"raw_water_grams":138.23,"raw_fat_grams":26.18,"final_grams":221.6}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Turkey Sandwich', quantity: 'custom (g)', foodWord: 'TURKEYSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18075', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'deli turkey breast', quantity: '3 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'iceberg lettuce', quantity: '1 large leaf (15g)', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'tomato raw', quantity: '2 thin slices (30g)', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 27.6 }
    ],
    recipeInstructions: [
      'Spread mayonnaise evenly on both slices of whole wheat bread.',
      'Layer the turkey breast slices on one slice of bread.',
      'Top the turkey with the lettuce and tomato slices.',
      'Close the sandwich with the second bread slice, press gently, and cut in half to serve.',
      '1 serving (222g): 447 cal | 21.2g protein | 26.2g fat | 31.0g carbs | 4.4g fiber | 4.8g sugar | 138.2g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Turkey Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_019',
    name: 'Turkey with Provolone Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 97,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":645.6,"pro":35.7,"fat":41.3,"carb":32.2,"fib":4.4,"h2o":161.4,"sug":5.1,"perServing":{"cal":645.6,"pro":35.7,"fat":41.3,"carb":32.2,"fib":4.4,"h2o":161.4,"sug":5.1,"AddedSugars":0.0,"IntrinsicSugars":5.1},"micros":{"vitaminA":55.54,"vitaminC":1.63,"vitaminD":6.6,"vitaminE":1.09,"vitaminK":20.56,"vitaminB6":0.2,"vitaminB12":0.42,"thiamin":0.11,"riboflavin":0.15,"niacin":3.3,"folate":16.59,"calcium":198.17,"iron":0.87,"magnesium":30.42,"phosphorus":231.61,"potassium":234.97,"sodium":621.43,"zinc":1.39,"copper":0.07,"selenium":13.07,"cholesterol":33.19,"saturatedFat":5.08,"monoFat":3.67,"polyFat":5.28,"omega3":0.57,"omega6":4.46},"gramsPerServing":278.3,"servings":1,"per100g":{"Energy_KCal":231.97,"Water":58.01,"Protein":12.84,"TotalLipidFat":14.83,"Carbohydrate":11.57,"FiberTotalDietary":1.57,"SugarsTotal":1.84,"Cholesterol":33.19,"FattyAcids_totalSaturated":5.08,"FattyAcids_totalMonounsaturated":3.67,"FattyAcids_totalPolyunsaturated":5.28,"LinoleicAcid":4.46,"alphaLinolenicAcid":0.57,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":55.54,"Retinol":48.35,"Carotene_beta":79.43,"VitaminD":6.6,"VitaminE_alphaTocopherol":1.09,"VitaminK_phylloquinone":20.56,"VitaminC_totalAscorbicAcid":1.63,"Thiamin":0.11,"Riboflavin":0.15,"Niacin":3.3,"PantothenicAcid":0.37,"VitaminB6":0.2,"Folate_total":16.59,"Folate_food":16.59,"Folate_DFE":16.59,"FolicAcid":0.0,"VitaminB12":0.42,"Choline_total":23.06,"Betaine":30.24,"LuteinZeaxanthin":49.39,"Lycopene":277.36,"Calcium_Ca":198.17,"Iron_Fe":0.87,"Magnesium_Mg":30.42,"Phosphorus_P":231.61,"Potassium_K":234.97,"Sodium_Na":621.43,"Zinc_Zn":1.39,"Copper_Cu":0.07,"Manganese_Mn":0.52,"Selenium_Se":13.07,"Tryptophan":0.13,"Threonine":0.43,"Isoleucine":0.45,"Leucine":0.89,"Lysine":0.99,"Methionine":0.29,"Cystine":0.08,"Phenylalanine":0.46,"Tyrosine":0.49,"Valine":0.57,"Arginine":0.58,"Histidine":0.38,"Alanine":0.46,"AsparticAcid":0.86,"GlutamicAcid":2.14,"Glycine":0.36,"Proline":0.79,"Serine":0.52,"omega3":0.57,"omega6":4.46,"AddedSugars":0.0,"IntrinsicSugars":1.84},"addedSugars":0.0,"intrinsicSugars":5.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18075","name":"Bread, whole-wheat, commercially prepared","grams":64.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":85.0},{"ndb":"1035","name":"Cheese, provolone","grams":56.7},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":15.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":30.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":27.6}],"sections":[{"section_key":"sandwich","section_label":"Turkey with Provolone Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":278.3,"raw_water_grams":161.45,"raw_fat_grams":41.28,"final_grams":278.3}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Turkey with Provolone Sandwich', quantity: 'custom (g)', foodWord: 'TURKEYPROVOLONE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18075', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'deli turkey breast', quantity: '3 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'provolone cheese', quantity: '2 slices', section: 'sandwich', ndbNo: '1035', portionDesc: 'g', portionGrams: 56.7 },
      { name: 'iceberg lettuce', quantity: '1 large leaf (15g)', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'tomato raw', quantity: '2 thin slices (30g)', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 27.6 }
    ],
    recipeInstructions: [
      'Spread mayonnaise evenly on both slices of whole wheat bread.',
      'Layer the turkey breast slices on one slice of bread.',
      'Top the turkey with both slices of provolone, then add the lettuce and tomato.',
      'Close the sandwich with the second bread slice, press gently, and cut in half to serve.',
      '1 serving (278g): 646 cal | 35.7g protein | 41.3g fat | 32.2g carbs | 4.4g fiber | 5.1g sugar | 161.4g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Turkey with Provolone Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_020',
    name: 'Turkey & Avocado Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 98,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":577.0,"pro":22.8,"fat":38.1,"carb":38.0,"fib":9.7,"h2o":206.8,"sug":5.4,"perServing":{"cal":577.0,"pro":22.8,"fat":38.1,"carb":38.0,"fib":9.7,"h2o":206.8,"sug":5.4,"AddedSugars":0.0,"IntrinsicSugars":5.4},"micros":{"vitaminA":10.11,"vitaminC":4.05,"vitaminD":2.26,"vitaminE":1.43,"vitaminK":23.83,"vitaminB6":0.24,"vitaminB12":0.11,"thiamin":0.11,"riboflavin":0.11,"niacin":3.4,"folate":35.33,"calcium":43.12,"iron":0.85,"magnesium":29.48,"phosphorus":130.55,"potassium":316.27,"sodium":398.17,"zinc":0.83,"copper":0.1,"selenium":9.12,"cholesterol":17.12,"saturatedFat":1.96,"monoFat":4.31,"polyFat":5.06,"omega3":0.55,"omega6":4.03},"gramsPerServing":312.0,"servings":1,"per100g":{"Energy_KCal":184.95,"Water":66.28,"Protein":7.32,"TotalLipidFat":12.2,"Carbohydrate":12.18,"FiberTotalDietary":3.1,"SugarsTotal":1.72,"Cholesterol":17.12,"FattyAcids_totalSaturated":1.96,"FattyAcids_totalMonounsaturated":4.31,"FattyAcids_totalPolyunsaturated":5.06,"LinoleicAcid":4.03,"alphaLinolenicAcid":0.55,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":10.11,"Retinol":1.35,"Carotene_beta":92.82,"VitaminD":2.26,"VitaminE_alphaTocopherol":1.43,"VitaminK_phylloquinone":23.83,"VitaminC_totalAscorbicAcid":4.05,"Thiamin":0.11,"Riboflavin":0.11,"Niacin":3.4,"PantothenicAcid":0.6,"VitaminB6":0.24,"Folate_total":35.33,"Folate_food":35.33,"Folate_DFE":35.33,"FolicAcid":0.0,"VitaminB12":0.11,"Choline_total":21.55,"Betaine":27.14,"LuteinZeaxanthin":117.59,"Lycopene":329.87,"Calcium_Ca":43.12,"Iron_Fe":0.85,"Magnesium_Mg":29.48,"Phosphorus_P":130.55,"Potassium_K":316.27,"Sodium_Na":398.17,"Zinc_Zn":0.83,"Copper_Cu":0.1,"Manganese_Mn":0.5,"Selenium_Se":9.12,"Tryptophan":0.06,"Threonine":0.23,"Isoleucine":0.23,"Leucine":0.41,"Lysine":0.44,"Methionine":0.14,"Cystine":0.05,"Phenylalanine":0.2,"Tyrosine":0.17,"Valine":0.24,"Arginine":0.35,"Histidine":0.14,"Alanine":0.31,"AsparticAcid":0.52,"GlutamicAcid":0.86,"Glycine":0.27,"Proline":0.22,"Serine":0.23,"omega3":0.55,"omega6":4.03,"AddedSugars":0.0,"IntrinsicSugars":1.72},"addedSugars":0.0,"intrinsicSugars":5.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18075","name":"Bread, whole-wheat, commercially prepared","grams":64.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":85.0},{"ndb":"9038","name":"Avocados, raw, California","grams":75.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":20.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":40.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":28.0}],"sections":[{"section_key":"sandwich","section_label":"Turkey & Avocado Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":312.0,"raw_water_grams":206.79,"raw_fat_grams":38.07,"final_grams":312.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Turkey & Avocado Sandwich', quantity: 'custom (g)', foodWord: 'TURKEYAVOCADO', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18075', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'deli turkey breast', quantity: '3 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'avocado', quantity: '½ avocado', section: 'sandwich', ndbNo: '9038', portionDesc: 'g', portionGrams: 75.0 },
      { name: 'iceberg lettuce', quantity: '1 leaf', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'tomato raw', quantity: '2 slices', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 28.0 }
    ],
    recipeInstructions: [
      'Spread mayonnaise evenly on both slices of whole wheat bread.',
      'Slice or mash the avocado and layer it on one slice of bread.',
      'Top the avocado with the turkey breast slices.',
      'Add the lettuce and tomato slices.',
      'Close the sandwich with the second bread slice, press gently, and cut in half to serve.',
      '1 serving (298.0 g): 542 cal | 21.1g protein | 37.6g fat | 32.0g carbs | 8.8g fiber | 4.8g sugar | 201.3g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Turkey & Avocado Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_021',
    name: 'Turkey & Avocado with Provolone Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 99,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":773.6,"pro":37.1,"fat":53.0,"carb":39.2,"fib":9.7,"h2o":229.7,"sug":5.7,"perServing":{"cal":773.6,"pro":37.1,"fat":53.0,"carb":39.2,"fib":9.7,"h2o":229.7,"sug":5.7,"AddedSugars":0.0,"IntrinsicSugars":5.7},"micros":{"vitaminA":44.48,"vitaminC":3.43,"vitaminD":4.96,"vitaminE":1.25,"vitaminK":20.54,"vitaminB6":0.21,"vitaminB12":0.32,"thiamin":0.1,"riboflavin":0.14,"niacin":2.9,"folate":31.48,"calcium":151.6,"iron":0.8,"magnesium":29.26,"phosphorus":186.16,"potassium":289.14,"sodium":470.89,"zinc":1.19,"copper":0.09,"selenium":9.94,"cholesterol":25.01,"saturatedFat":4.26,"monoFat":4.78,"polyFat":4.41,"omega3":0.46,"omega6":3.41},"gramsPerServing":368.0,"servings":1,"per100g":{"Energy_KCal":210.21,"Water":62.43,"Protein":10.1,"TotalLipidFat":14.4,"Carbohydrate":10.65,"FiberTotalDietary":2.62,"SugarsTotal":1.55,"Cholesterol":25.01,"FattyAcids_totalSaturated":4.26,"FattyAcids_totalMonounsaturated":4.78,"FattyAcids_totalPolyunsaturated":4.41,"LinoleicAcid":3.41,"alphaLinolenicAcid":0.46,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":44.48,"Retinol":36.14,"Carotene_beta":89.05,"VitaminD":4.96,"VitaminE_alphaTocopherol":1.25,"VitaminK_phylloquinone":20.54,"VitaminC_totalAscorbicAcid":3.43,"Thiamin":0.1,"Riboflavin":0.14,"Niacin":2.9,"PantothenicAcid":0.58,"VitaminB6":0.21,"Folate_total":31.48,"Folate_food":31.48,"Folate_DFE":31.48,"FolicAcid":0.0,"VitaminB12":0.32,"Choline_total":20.61,"Betaine":23.01,"LuteinZeaxanthin":99.7,"Lycopene":279.67,"Calcium_Ca":151.6,"Iron_Fe":0.8,"Magnesium_Mg":29.26,"Phosphorus_P":186.16,"Potassium_K":289.14,"Sodium_Na":470.89,"Zinc_Zn":1.19,"Copper_Cu":0.09,"Manganese_Mn":0.43,"Selenium_Se":9.94,"Tryptophan":0.1,"Threonine":0.34,"Isoleucine":0.36,"Leucine":0.7,"Lysine":0.77,"Methionine":0.22,"Cystine":0.06,"Phenylalanine":0.37,"Tyrosine":0.38,"Valine":0.45,"Arginine":0.45,"Histidine":0.29,"Alanine":0.37,"AsparticAcid":0.7,"GlutamicAcid":1.68,"Glycine":0.3,"Proline":0.61,"Serine":0.41,"omega3":0.46,"omega6":3.41,"AddedSugars":0.0,"IntrinsicSugars":1.55},"addedSugars":0.0,"intrinsicSugars":5.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18075","name":"Bread, whole-wheat, commercially prepared","grams":64.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":85.0},{"ndb":"9038","name":"Avocados, raw, California","grams":75.0},{"ndb":"1035","name":"Cheese, provolone","grams":56.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":20.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":40.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":28.0}],"sections":[{"section_key":"sandwich","section_label":"Turkey & Avocado with Provolone Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":368.0,"raw_water_grams":229.73,"raw_fat_grams":52.98,"final_grams":368.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Turkey & Avocado with Provolone Sandwich', quantity: 'custom (g)', foodWord: 'TURKEYAVOCADOPROVOLONE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18075', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'deli turkey breast', quantity: '3 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'avocado', quantity: '½ avocado', section: 'sandwich', ndbNo: '9038', portionDesc: 'g', portionGrams: 75.0 },
      { name: 'provolone cheese', quantity: '2 slices', section: 'sandwich', ndbNo: '1035', portionDesc: 'g', portionGrams: 56.0 },
      { name: 'iceberg lettuce', quantity: '1 leaf', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'tomato raw', quantity: '2 slices', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 28.0 }
    ],
    recipeInstructions: [
      'Spread mayonnaise evenly on both slices of whole wheat bread.',
      'Slice or mash the avocado and layer it on one slice of bread.',
      'Top the avocado with the turkey breast slices, then layer both slices of provolone.',
      'Add the lettuce and tomato slices.',
      'Close the sandwich with the second bread slice, press gently, and cut in half to serve.',
      '1 serving (354.0 g): 738 cal | 35.4g protein | 52.5g fat | 33.2g carbs | 8.8g fiber | 5.1g sugar | 224.3g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Turkey & Avocado with Provolone Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_022',
    name: 'Turkey & Avocado with Bacon Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 100,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":684.7,"pro":30.6,"fat":46.1,"carb":38.4,"fib":9.7,"h2o":212.2,"sug":5.4,"perServing":{"cal":684.7,"pro":30.6,"fat":46.1,"carb":38.4,"fib":9.7,"h2o":212.2,"sug":5.4,"AddedSugars":0.0,"IntrinsicSugars":5.4},"micros":{"vitaminA":10.17,"vitaminC":3.77,"vitaminD":3.27,"vitaminE":1.36,"vitaminK":22.2,"vitaminB6":0.26,"vitaminB12":0.18,"thiamin":0.14,"riboflavin":0.12,"niacin":3.88,"folate":32.9,"calcium":40.91,"iron":0.85,"magnesium":29.59,"phosphorus":148.22,"potassium":328.81,"sodium":486.45,"zinc":0.98,"copper":0.1,"selenium":11.98,"cholesterol":22.74,"saturatedFat":2.64,"monoFat":5.08,"polyFat":5.14,"omega3":0.52,"omega6":4.11},"gramsPerServing":335.0,"servings":1,"per100g":{"Energy_KCal":204.38,"Water":63.35,"Protein":9.14,"TotalLipidFat":13.77,"Carbohydrate":11.46,"FiberTotalDietary":2.88,"SugarsTotal":1.61,"Cholesterol":22.74,"FattyAcids_totalSaturated":2.64,"FattyAcids_totalMonounsaturated":5.08,"FattyAcids_totalPolyunsaturated":5.14,"LinoleicAcid":4.11,"alphaLinolenicAcid":0.52,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":10.17,"Retinol":2.01,"Carotene_beta":86.45,"VitaminD":3.27,"VitaminE_alphaTocopherol":1.36,"VitaminK_phylloquinone":22.2,"VitaminC_totalAscorbicAcid":3.77,"Thiamin":0.14,"Riboflavin":0.12,"Niacin":3.88,"PantothenicAcid":0.63,"VitaminB6":0.26,"Folate_total":32.9,"Folate_food":32.9,"Folate_DFE":32.9,"FolicAcid":0.0,"VitaminB12":0.18,"Choline_total":26.22,"Betaine":25.84,"LuteinZeaxanthin":109.52,"Lycopene":307.22,"Calcium_Ca":40.91,"Iron_Fe":0.85,"Magnesium_Mg":29.59,"Phosphorus_P":148.22,"Potassium_K":328.81,"Sodium_Na":486.45,"Zinc_Zn":0.98,"Copper_Cu":0.1,"Manganese_Mn":0.47,"Selenium_Se":11.98,"Tryptophan":0.08,"Threonine":0.31,"Isoleucine":0.32,"Leucine":0.58,"Lysine":0.62,"Methionine":0.2,"Cystine":0.08,"Phenylalanine":0.29,"Tyrosine":0.25,"Valine":0.34,"Arginine":0.48,"Histidine":0.23,"Alanine":0.42,"AsparticAcid":0.7,"GlutamicAcid":1.16,"Glycine":0.36,"Proline":0.3,"Serine":0.31,"omega3":0.52,"omega6":4.11,"AddedSugars":0.0,"IntrinsicSugars":1.61},"addedSugars":0.0,"intrinsicSugars":5.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18075","name":"Bread, whole-wheat, commercially prepared","grams":64.0},{"ndb":"7081","name":"Turkey breast, sliced, prepackaged","grams":85.0},{"ndb":"9038","name":"Avocados, raw, California","grams":75.0},{"ndb":"10862","name":"Pork, cured, bacon, pre-sliced, cooked, pan-fried","grams":23.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":20.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":40.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":28.0}],"sections":[{"section_key":"sandwich","section_label":"Turkey & Avocado with Bacon Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":335.0,"raw_water_grams":212.23,"raw_fat_grams":46.14,"final_grams":335.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Turkey & Avocado with Bacon Sandwich', quantity: 'custom (g)', foodWord: 'TURKEYAVOCADOBACON', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18075', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'deli turkey breast', quantity: '3 oz', section: 'sandwich', ndbNo: '7081', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'avocado', quantity: '½ avocado', section: 'sandwich', ndbNo: '9038', portionDesc: 'g', portionGrams: 75.0 },
      { name: 'cooked bacon', quantity: '2 slices', section: 'sandwich', ndbNo: '10862', portionDesc: 'g', portionGrams: 23.0 },
      { name: 'iceberg lettuce', quantity: '1 leaf', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'tomato raw', quantity: '2 slices', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 28.0 }
    ],
    recipeInstructions: [
      'Cook the bacon in a skillet over medium heat until crispy. Drain on paper towels.',
      'Spread mayonnaise evenly on both slices of whole wheat bread.',
      'Slice or mash the avocado and layer it on one slice of bread.',
      'Top the avocado with the turkey breast slices and bacon.',
      'Add the lettuce and tomato slices.',
      'Close the sandwich with the second bread slice, press gently, and cut in half to serve.',
      '1 serving (321.0 g): 649 cal | 28.9g protein | 45.6g fat | 32.4g carbs | 8.8g fiber | 4.8g sugar | 206.8g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Turkey & Avocado with Bacon Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_023',
    name: 'Roast Beef Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 101,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":399.4,"pro":29.9,"fat":17.2,"carb":30.6,"fib":4.8,"h2o":172.4,"sug":4.7,"perServing":{"cal":399.4,"pro":29.9,"fat":17.2,"carb":30.6,"fib":4.8,"h2o":172.4,"sug":4.7,"AddedSugars":0.0,"IntrinsicSugars":4.7},"micros":{"vitaminA":10.81,"vitaminC":2.37,"vitaminD":0.82,"vitaminE":1.17,"vitaminK":14.71,"vitaminB6":0.27,"vitaminB12":0.91,"thiamin":0.13,"riboflavin":0.14,"niacin":3.68,"folate":17.73,"calcium":47.09,"iron":1.64,"magnesium":30.84,"phosphorus":168.39,"potassium":401.2,"sodium":548.12,"zinc":1.91,"copper":0.1,"selenium":13.7,"cholesterol":24.81,"saturatedFat":1.41,"monoFat":1.79,"polyFat":2.99,"omega3":0.34,"omega6":2.56},"gramsPerServing":256.0,"servings":1,"per100g":{"Energy_KCal":156.03,"Water":67.35,"Protein":11.66,"TotalLipidFat":6.7,"Carbohydrate":11.94,"FiberTotalDietary":1.86,"SugarsTotal":1.83,"Cholesterol":24.81,"FattyAcids_totalSaturated":1.41,"FattyAcids_totalMonounsaturated":1.79,"FattyAcids_totalPolyunsaturated":2.99,"LinoleicAcid":2.56,"alphaLinolenicAcid":0.34,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":10.81,"Retinol":2.14,"Carotene_beta":95.34,"VitaminD":0.82,"VitaminE_alphaTocopherol":1.17,"VitaminK_phylloquinone":14.71,"VitaminC_totalAscorbicAcid":2.37,"Thiamin":0.13,"Riboflavin":0.14,"Niacin":3.68,"PantothenicAcid":0.44,"VitaminB6":0.27,"Folate_total":17.73,"Folate_food":17.73,"Folate_DFE":17.73,"FolicAcid":0.0,"VitaminB12":0.91,"Choline_total":30.06,"Betaine":31.65,"LuteinZeaxanthin":65.47,"Lycopene":402.03,"Calcium_Ca":47.09,"Iron_Fe":1.64,"Magnesium_Mg":30.84,"Phosphorus_P":168.39,"Potassium_K":401.2,"Sodium_Na":548.12,"Zinc_Zn":1.91,"Copper_Cu":0.1,"Manganese_Mn":0.58,"Selenium_Se":13.7,"Tryptophan":0.0,"Threonine":0.01,"Isoleucine":0.01,"Leucine":0.02,"Lysine":0.01,"Methionine":0.0,"Cystine":0.0,"Phenylalanine":0.01,"Tyrosine":0.01,"Valine":0.01,"Arginine":0.01,"Histidine":0.01,"Alanine":0.01,"AsparticAcid":0.04,"GlutamicAcid":0.1,"Glycine":0.01,"Proline":0.01,"Serine":0.01,"omega3":0.34,"omega6":2.56,"AddedSugars":0.0,"IntrinsicSugars":1.83},"addedSugars":0.0,"intrinsicSugars":4.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18075","name":"Bread, whole-wheat, commercially prepared","grams":64.0},{"ndb":"7043","name":"Roast beef, deli style, prepackaged, sliced","grams":113.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":20.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":40.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":14.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":5.0}],"sections":[{"section_key":"sandwich","section_label":"Roast Beef Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":256.0,"raw_water_grams":172.42,"raw_fat_grams":17.16,"final_grams":256.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Roast Beef Sandwich', quantity: 'custom (g)', foodWord: 'ROASTBEEFSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'whole wheat bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18075', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'deli roast beef', quantity: '4 oz', section: 'sandwich', ndbNo: '7043', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'iceberg lettuce', quantity: '1 leaf', section: 'sandwich', ndbNo: '11252', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'tomato raw', quantity: '2 slices', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'mayonnaise', quantity: '1 tbsp', section: 'sandwich', ndbNo: '4025', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'yellow mustard', quantity: '1 tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 5.0 }
    ],
    recipeInstructions: [
      'Spread mayonnaise on one slice of whole wheat bread and mustard on the other.',
      'Layer the roast beef slices on the mustard side.',
      'Top with the lettuce and tomato slices.',
      'Close the sandwich with the mayo slice, press gently, and cut in half to serve.',
      '1 serving (242.0 g): 364 cal | 28.1g protein | 16.7g fat | 24.6g carbs | 3.9g fiber | 4.1g sugar | 167.0g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Roast Beef Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_024',
    name: 'Avocado with Sprouts & Tomato Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'vegan',
    levelNum: 102,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":283.8,"pro":9.6,"fat":14.1,"carb":32.8,"fib":9.9,"h2o":124.8,"sug":5.0,"perServing":{"cal":283.8,"pro":9.6,"fat":14.1,"carb":32.8,"fib":9.9,"h2o":124.8,"sug":5.0,"AddedSugars":0.0,"IntrinsicSugars":5.0},"micros":{"vitaminA":12.3,"vitaminC":7.98,"vitaminD":0.0,"vitaminE":1.04,"vitaminK":12.0,"vitaminB6":0.21,"vitaminB12":0.0,"thiamin":0.12,"riboflavin":0.1,"niacin":2.15,"folate":64.3,"calcium":40.33,"iron":1.11,"magnesium":39.18,"phosphorus":99.61,"potassium":333.53,"sodium":225.3,"zinc":0.87,"copper":0.17,"selenium":10.18,"cholesterol":0.0,"saturatedFat":1.13,"monoFat":4.22,"polyFat":1.34,"omega3":0.04,"omega6":0.0},"gramsPerServing":184.5,"servings":1,"per100g":{"Energy_KCal":153.82,"Water":67.63,"Protein":5.23,"TotalLipidFat":7.63,"Carbohydrate":17.79,"FiberTotalDietary":5.36,"SugarsTotal":2.71,"Cholesterol":0.0,"FattyAcids_totalSaturated":1.13,"FattyAcids_totalMonounsaturated":4.22,"FattyAcids_totalPolyunsaturated":1.34,"LinoleicAcid":0.0,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":12.3,"Retinol":0.0,"Carotene_beta":127.06,"VitaminD":0.0,"VitaminE_alphaTocopherol":1.04,"VitaminK_phylloquinone":12.0,"VitaminC_totalAscorbicAcid":7.98,"Thiamin":0.12,"Riboflavin":0.1,"Niacin":2.15,"PantothenicAcid":0.74,"VitaminB6":0.21,"Folate_total":64.3,"Folate_food":64.3,"Folate_DFE":64.3,"FolicAcid":0.0,"VitaminB12":0.0,"Choline_total":14.67,"Betaine":0.32,"LuteinZeaxanthin":165.77,"Lycopene":557.83,"Calcium_Ca":40.33,"Iron_Fe":1.11,"Magnesium_Mg":39.18,"Phosphorus_P":99.61,"Potassium_K":333.53,"Sodium_Na":225.3,"Zinc_Zn":0.87,"Copper_Cu":0.17,"Manganese_Mn":0.7,"Selenium_Se":10.18,"Tryptophan":0.05,"Threonine":0.12,"Isoleucine":0.14,"Leucine":0.24,"Lysine":0.15,"Methionine":0.05,"Cystine":0.06,"Phenylalanine":0.16,"Tyrosine":0.09,"Valine":0.17,"Arginine":0.18,"Histidine":0.08,"Alanine":0.15,"AsparticAcid":0.29,"GlutamicAcid":0.87,"Glycine":0.16,"Proline":0.25,"Serine":0.16,"omega3":0.04,"omega6":0.0,"AddedSugars":0.0,"IntrinsicSugars":2.71},"addedSugars":0.0,"intrinsicSugars":5.0,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"28397","name":"Bread, multi-grain (includes whole-grain)","grams":56.0},{"ndb":"9038","name":"Avocados, raw, California","grams":75.0},{"ndb":"11001","name":"Alfalfa seeds, sprouted, raw","grams":8.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":40.0},{"ndb":"9152","name":"Lemon juice, raw","grams":5.0},{"ndb":"2047","name":"Salt, table","grams":0.5}],"sections":[{"section_key":"sandwich","section_label":"Avocado with Sprouts & Tomato Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":184.5,"raw_water_grams":124.78,"raw_fat_grams":14.07,"final_grams":184.5}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Avocado with Sprouts & Tomato Sandwich', quantity: 'custom (g)', foodWord: 'AVOCADOSPROUTS', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'multigrain bread', quantity: '2 slices (28g each)', section: 'sandwich', ndbNo: '28397', portionDesc: 'g', portionGrams: 56.0 },
      { name: 'avocado', quantity: '½ avocado', section: 'sandwich', ndbNo: '9038', portionDesc: 'g', portionGrams: 75.0 },
      { name: 'alfalfa sprouts', quantity: '¼ cup', section: 'sandwich', ndbNo: '11001', portionDesc: 'g', portionGrams: 8.0 },
      { name: 'tomato raw', quantity: '2 slices', section: 'sandwich', ndbNo: '11529', portionDesc: 'g', portionGrams: 40.0 },
      { name: 'lemon juice', quantity: '1 tsp', section: 'sandwich', ndbNo: '9152', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'salt', quantity: 'pinch', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.5 }
    ],
    recipeInstructions: [
      'Mash the avocado with lemon juice and a pinch of salt until smooth.',
      'Spread the mashed avocado evenly on both slices of multigrain bread.',
      'Layer the alfalfa sprouts on one slice, then top with the tomato slices.',
      'Close the sandwich with the second bread slice, press gently, and cut in half to serve.',
      '1 serving (184.5 g): 284 cal | 9.6g protein | 14.1g fat | 32.8g carbs | 9.9g fiber | 5.0g sugar | 124.8g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Avocado with Sprouts & Tomato Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_025',
    name: 'Reuben Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 103,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":769.6,"pro":33.2,"fat":53.2,"carb":38.9,"fib":5.7,"h2o":146.0,"sug":8.1,"perServing":{"cal":769.6,"pro":33.2,"fat":53.2,"carb":38.9,"fib":5.7,"h2o":146.0,"sug":8.1,"AddedSugars":0.0,"IntrinsicSugars":8.1},"micros":{"vitaminA":63.57,"vitaminC":1.63,"vitaminD":1.16,"vitaminE":0.59,"vitaminK":10.38,"vitaminB6":0.09,"vitaminB12":0.82,"thiamin":0.2,"riboflavin":0.17,"niacin":1.51,"folate":25.43,"calcium":162.77,"iron":1.68,"magnesium":21.57,"phosphorus":161.7,"potassium":142.47,"sodium":741.34,"zinc":2.39,"copper":0.11,"selenium":21.95,"cholesterol":57.49,"saturatedFat":7.95,"monoFat":6.23,"polyFat":2.04,"omega3":0.02,"omega6":0.17},"gramsPerServing":278.8,"servings":1,"per100g":{"Energy_KCal":276.08,"Water":52.36,"Protein":11.91,"TotalLipidFat":19.09,"Carbohydrate":13.95,"FiberTotalDietary":2.04,"SugarsTotal":2.9,"Cholesterol":57.49,"FattyAcids_totalSaturated":7.95,"FattyAcids_totalMonounsaturated":6.23,"FattyAcids_totalPolyunsaturated":2.04,"LinoleicAcid":0.17,"alphaLinolenicAcid":0.02,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":63.57,"Retinol":61.41,"Carotene_beta":23.73,"VitaminD":1.16,"VitaminE_alphaTocopherol":0.59,"VitaminK_phylloquinone":10.38,"VitaminC_totalAscorbicAcid":1.63,"Thiamin":0.2,"Riboflavin":0.17,"Niacin":1.51,"PantothenicAcid":0.25,"VitaminB6":0.09,"Folate_total":25.43,"Folate_food":15.27,"Folate_DFE":32.49,"FolicAcid":13.54,"VitaminB12":0.82,"Choline_total":27.42,"Betaine":2.99,"LuteinZeaxanthin":52.14,"Lycopene":223.69,"Calcium_Ca":162.77,"Iron_Fe":1.68,"Magnesium_Mg":21.57,"Phosphorus_P":161.7,"Potassium_K":142.47,"Sodium_Na":741.34,"Zinc_Zn":2.39,"Copper_Cu":0.11,"Manganese_Mn":0.23,"Selenium_Se":21.95,"Tryptophan":0.12,"Threonine":0.44,"Isoleucine":0.56,"Leucine":1.02,"Lysine":0.92,"Methionine":0.29,"Cystine":0.13,"Phenylalanine":0.57,"Tyrosine":0.48,"Valine":0.69,"Arginine":0.58,"Histidine":0.38,"Alanine":0.55,"AsparticAcid":0.87,"GlutamicAcid":2.36,"Glycine":0.48,"Proline":1.04,"Serine":0.57,"omega3":0.02,"omega6":0.17,"AddedSugars":0.0,"IntrinsicSugars":2.9},"addedSugars":0.0,"intrinsicSugars":8.1,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.9,"yieldFactorFat":1.0,"sources":[{"ndb":"18060","name":"Bread, rye","grams":64.0},{"ndb":"13347","name":"Beef, cured, corned beef, brisket, cooked","grams":85.0},{"ndb":"1040","name":"Cheese, swiss","grams":42.0},{"ndb":"11439","name":"Sauerkraut, canned, solids and liquids","grams":60.0},{"ndb":"4017","name":"Salad dressing, thousand island, commercial, regular","grams":30.0},{"ndb":"1001","name":"Butter, salted","grams":14.0}],"sections":[{"section_key":"sandwich","section_label":"Reuben Sandwich","prep_method":"pan grilled","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.9,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":295.0,"raw_water_grams":162.18,"raw_fat_grams":53.22,"final_grams":278.78}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Reuben Sandwich', quantity: 'custom (g)', foodWord: 'REUBEN', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rye bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18060', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'corned beef', quantity: '3 oz', section: 'sandwich', ndbNo: '13347', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'Swiss cheese', quantity: '2 slices', section: 'sandwich', ndbNo: '1040', portionDesc: 'g', portionGrams: 42.0 },
      { name: 'sauerkraut', quantity: '¼ cup', section: 'sandwich', ndbNo: '11439', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'thousand island dressing', quantity: '2 tbsp', section: 'sandwich', ndbNo: '4017', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.0 }
    ],
    recipeInstructions: [
      'Butter one side of each rye bread slice.',
      'Spread thousand island dressing on the unbuttered side of each slice.',
      'Layer one slice of swiss cheese, then the corned beef, then drained sauerkraut and then the other slice of swiss cheese on one slice of bread.',
      'Close the sandwich butter-side out and pan grill over medium heat 3-4 minutes per side until the bread is golden and the cheese melts.',
      '1 serving (278.8 g): 770 cal | 33.2g protein | 53.2g fat | 38.9g carbs | 5.7g fiber | 8.1g sugar | 146.0g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Reuben Sandwich', cookingMethod: '', yieldFactorWater: 0.9 }
    ],
  },
  {
    id: 'SAND_026',
    name: 'Pastrami Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 104,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":450.9,"pro":38.2,"fat":17.9,"carb":32.6,"fib":4.3,"h2o":125.5,"sug":2.7,"perServing":{"cal":450.9,"pro":38.2,"fat":17.9,"carb":32.6,"fib":4.3,"h2o":125.5,"sug":2.7,"AddedSugars":0.0,"IntrinsicSugars":2.7},"micros":{"vitaminA":38.02,"vitaminC":0.29,"vitaminD":2.05,"vitaminE":0.26,"vitaminK":0.98,"vitaminB6":0.15,"vitaminB12":1.35,"thiamin":0.16,"riboflavin":0.22,"niacin":3.34,"folate":36.83,"calcium":143.94,"iron":2.09,"magnesium":27.84,"phosphorus":206.67,"potassium":175.68,"sodium":828.19,"zinc":3.49,"copper":0.11,"selenium":24.18,"cholesterol":46.76,"saturatedFat":3.89,"monoFat":2.64,"polyFat":0.52,"omega3":0.04,"omega6":0.12},"gramsPerServing":220.0,"servings":1,"per100g":{"Energy_KCal":204.96,"Water":57.06,"Protein":17.36,"TotalLipidFat":8.12,"Carbohydrate":14.82,"FiberTotalDietary":1.96,"SugarsTotal":1.23,"Cholesterol":46.76,"FattyAcids_totalSaturated":3.89,"FattyAcids_totalMonounsaturated":2.64,"FattyAcids_totalPolyunsaturated":0.52,"LinoleicAcid":0.12,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":38.02,"Retinol":36.02,"Carotene_beta":23.7,"VitaminD":2.05,"VitaminE_alphaTocopherol":0.26,"VitaminK_phylloquinone":0.98,"VitaminC_totalAscorbicAcid":0.29,"Thiamin":0.16,"Riboflavin":0.22,"Niacin":3.34,"PantothenicAcid":0.32,"VitaminB6":0.15,"Folate_total":36.83,"Folate_food":19.67,"Folate_DFE":48.76,"FolicAcid":17.16,"VitaminB12":1.35,"Choline_total":49.66,"Betaine":5.59,"LuteinZeaxanthin":30.08,"Lycopene":0.13,"Calcium_Ca":143.94,"Iron_Fe":2.09,"Magnesium_Mg":27.84,"Phosphorus_P":206.67,"Potassium_K":175.68,"Sodium_Na":828.19,"Zinc_Zn":3.49,"Copper_Cu":0.11,"Manganese_Mn":0.28,"Selenium_Se":24.18,"Tryptophan":0.15,"Threonine":0.65,"Isoleucine":0.79,"Leucine":1.43,"Lysine":1.34,"Methionine":0.42,"Cystine":0.23,"Phenylalanine":0.77,"Tyrosine":0.63,"Valine":0.94,"Arginine":0.94,"Histidine":0.54,"Alanine":0.88,"AsparticAcid":1.35,"GlutamicAcid":3.18,"Glycine":0.83,"Proline":1.28,"Serine":0.77,"omega3":0.04,"omega6":0.12,"AddedSugars":0.0,"IntrinsicSugars":1.23},"addedSugars":0.0,"intrinsicSugars":2.7,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18060","name":"Bread, rye","grams":64.0},{"ndb":"13355","name":"Beef, cured, pastrami","grams":113.0},{"ndb":"1040","name":"Cheese, swiss","grams":28.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":15.0}],"sections":[{"section_key":"sandwich","section_label":"Pastrami Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":220.0,"raw_water_grams":125.54,"raw_fat_grams":17.87,"final_grams":220.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Pastrami Sandwich', quantity: 'custom (g)', foodWord: 'PASTRAMI', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rye bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18060', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'pastrami', quantity: '4 oz', section: 'sandwich', ndbNo: '13355', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'Swiss cheese', quantity: '1 slice', section: 'sandwich', ndbNo: '1040', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'yellow mustard', quantity: '1 tbsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 15.0 }
    ],
    recipeInstructions: [
      'Spread yellow mustard on one side of each rye bread slice.',
      'Layer the swiss cheese on one slice of bread.',
      'Pile the pastrami on top of the swiss cheese.',
      'Close the sandwich with the second slice of bread, press gently, and cut in half to serve.',
      '1 serving (220.0 g): 451 cal | 38.2g protein | 17.9g fat | 32.6g carbs | 4.3g fiber | 2.7g sugar | 125.5g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Pastrami Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_027',
    name: 'Corned Beef Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 105,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":568.4,"pro":34.1,"fat":32.7,"carb":32.7,"fib":4.3,"h2o":114.5,"sug":2.6,"perServing":{"cal":568.4,"pro":34.1,"fat":32.7,"carb":32.7,"fib":4.3,"h2o":114.5,"sug":2.6,"AddedSugars":0.0,"IntrinsicSugars":2.6},"micros":{"vitaminA":37.0,"vitaminC":0.14,"vitaminD":2.05,"vitaminE":0.28,"vitaminK":1.39,"vitaminB6":0.15,"vitaminB12":1.23,"thiamin":0.15,"riboflavin":0.23,"niacin":2.71,"folate":36.83,"calcium":142.91,"iron":1.9,"magnesium":25.27,"phosphorus":180.99,"potassium":142.3,"sodium":774.26,"zinc":3.28,"copper":0.14,"selenium":31.94,"cholesterol":62.17,"saturatedFat":5.77,"monoFat":6.29,"polyFat":0.8,"omega3":0.04,"omega6":0.12},"gramsPerServing":220.0,"servings":1,"per100g":{"Energy_KCal":258.38,"Water":52.06,"Protein":15.49,"TotalLipidFat":14.88,"Carbohydrate":14.87,"FiberTotalDietary":1.96,"SugarsTotal":1.18,"Cholesterol":62.17,"FattyAcids_totalSaturated":5.77,"FattyAcids_totalMonounsaturated":6.29,"FattyAcids_totalPolyunsaturated":0.8,"LinoleicAcid":0.12,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":37.0,"Retinol":36.02,"Carotene_beta":12.4,"VitaminD":2.05,"VitaminE_alphaTocopherol":0.28,"VitaminK_phylloquinone":1.39,"VitaminC_totalAscorbicAcid":0.14,"Thiamin":0.15,"Riboflavin":0.23,"Niacin":2.71,"PantothenicAcid":0.41,"VitaminB6":0.15,"Folate_total":36.83,"Folate_food":19.67,"Folate_DFE":48.76,"FolicAcid":17.16,"VitaminB12":1.23,"Choline_total":43.29,"Betaine":4.76,"LuteinZeaxanthin":24.43,"Lycopene":0.13,"Calcium_Ca":142.91,"Iron_Fe":1.9,"Magnesium_Mg":25.27,"Phosphorus_P":180.99,"Potassium_K":142.3,"Sodium_Na":774.26,"Zinc_Zn":3.28,"Copper_Cu":0.14,"Manganese_Mn":0.28,"Selenium_Se":31.94,"Tryptophan":0.13,"Threonine":0.58,"Isoleucine":0.72,"Leucine":1.3,"Lysine":1.2,"Methionine":0.38,"Cystine":0.21,"Phenylalanine":0.71,"Tyrosine":0.58,"Valine":0.85,"Arginine":0.83,"Histidine":0.49,"Alanine":0.78,"AsparticAcid":1.2,"GlutamicAcid":2.93,"Glycine":0.73,"Proline":1.2,"Serine":0.71,"omega3":0.04,"omega6":0.12,"AddedSugars":0.0,"IntrinsicSugars":1.18},"addedSugars":0.0,"intrinsicSugars":2.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18060","name":"Bread, rye","grams":64.0},{"ndb":"13347","name":"Beef, cured, corned beef, brisket, cooked","grams":113.0},{"ndb":"1040","name":"Cheese, swiss","grams":28.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":15.0}],"sections":[{"section_key":"sandwich","section_label":"Corned Beef Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":220.0,"raw_water_grams":114.53,"raw_fat_grams":32.74,"final_grams":220.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Corned Beef Sandwich', quantity: 'custom (g)', foodWord: 'CORNEDBEEF', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rye bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18060', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'corned beef', quantity: '4 oz', section: 'sandwich', ndbNo: '13347', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'Swiss cheese', quantity: '1 slice', section: 'sandwich', ndbNo: '1040', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'yellow mustard', quantity: '1 tbsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 15.0 }
    ],
    recipeInstructions: [
      'Spread yellow mustard on one side of each rye bread slice.',
      'Layer the swiss cheese on one slice of bread.',
      'Pile the corned beef on top of the swiss cheese.',
      'Close the sandwich with the second slice of bread, press gently, and cut in half to serve.',
      '1 serving (220.0 g): 568 cal | 34.1g protein | 32.7g fat | 32.7g carbs | 4.3g fiber | 2.6g sugar | 114.5g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Corned Beef Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_028',
    name: 'Liverwurst Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 106,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":463.5,"pro":18.4,"fat":26.9,"carb":36.2,"fib":5.0,"h2o":126.8,"sug":3.8,"perServing":{"cal":463.5,"pro":18.4,"fat":26.9,"carb":36.2,"fib":5.0,"h2o":126.8,"sug":3.8,"AddedSugars":0.0,"IntrinsicSugars":3.8},"micros":{"vitaminA":3301.1,"vitaminC":1.15,"vitaminD":0.0,"vitaminE":0.13,"vitaminK":2.92,"vitaminB6":0.12,"vitaminB12":5.35,"thiamin":0.26,"riboflavin":0.52,"niacin":2.91,"folate":48.2,"calcium":46.71,"iron":3.56,"magnesium":22.01,"phosphorus":141.26,"potassium":157.87,"sodium":713.09,"zinc":1.33,"copper":0.16,"selenium":34.67,"cholesterol":62.76,"saturatedFat":4.42,"monoFat":5.84,"polyFat":1.34,"omega3":0.03,"omega6":0.02},"gramsPerServing":214.0,"servings":1,"per100g":{"Energy_KCal":216.57,"Water":59.27,"Protein":8.58,"TotalLipidFat":12.59,"Carbohydrate":16.94,"FiberTotalDietary":2.31,"SugarsTotal":1.76,"Cholesterol":62.76,"FattyAcids_totalSaturated":4.42,"FattyAcids_totalMonounsaturated":5.84,"FattyAcids_totalPolyunsaturated":1.34,"LinoleicAcid":0.02,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":3301.1,"Retinol":3299.91,"Carotene_beta":12.29,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.13,"VitaminK_phylloquinone":2.92,"VitaminC_totalAscorbicAcid":1.15,"Thiamin":0.26,"Riboflavin":0.52,"Niacin":2.91,"PantothenicAcid":1.36,"VitaminB6":0.12,"Folate_total":48.2,"Folate_food":30.56,"Folate_DFE":60.46,"FolicAcid":17.64,"VitaminB12":5.35,"Choline_total":6.98,"Betaine":0.02,"LuteinZeaxanthin":28.37,"Lycopene":0.0,"Calcium_Ca":46.71,"Iron_Fe":3.56,"Magnesium_Mg":22.01,"Phosphorus_P":141.26,"Potassium_K":157.87,"Sodium_Na":713.09,"Zinc_Zn":1.33,"Copper_Cu":0.16,"Manganese_Mn":0.35,"Selenium_Se":34.67,"Tryptophan":0.09,"Threonine":0.36,"Isoleucine":0.36,"Leucine":0.64,"Lysine":0.55,"Methionine":0.16,"Cystine":0.11,"Phenylalanine":0.38,"Tyrosine":0.22,"Valine":0.47,"Arginine":0.45,"Histidine":0.24,"Alanine":0.43,"AsparticAcid":0.63,"GlutamicAcid":1.75,"Glycine":0.54,"Proline":0.63,"Serine":0.41,"omega3":0.03,"omega6":0.02,"AddedSugars":0.0,"IntrinsicSugars":1.76},"addedSugars":0.0,"intrinsicSugars":3.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18060","name":"Bread, rye","grams":64.0},{"ndb":"7041","name":"Liver sausage, liverwurst, pork","grams":85.0},{"ndb":"11282","name":"Onions, raw","grams":20.0},{"ndb":"11937","name":"Pickles, cucumber, dill or kosher dill","grams":30.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":15.0}],"sections":[{"section_key":"sandwich","section_label":"Liverwurst Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":214.0,"raw_water_grams":126.84,"raw_fat_grams":26.95,"final_grams":214.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Liverwurst Sandwich', quantity: 'custom (g)', foodWord: 'LIVERWURST', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rye bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18060', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'liverwurst', quantity: '3 oz', section: 'sandwich', ndbNo: '7041', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'onion (20g)', quantity: '2 thin slices', section: 'sandwich', ndbNo: '11282', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'dill pickle sliced thin (30g)', quantity: '½', section: 'sandwich', ndbNo: '11937', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'yellow mustard', quantity: '1 tbsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 15.0 }
    ],
    recipeInstructions: [
      'Spread yellow mustard on one side of each rye bread slice.',
      'Spread the liverwurst evenly on top of the mustard on one slice.',
      'Top with the onion slices and dill pickle slices.',
      'Close the sandwich with the second slice of bread, press gently, and cut in half to serve.',
      '1 serving (214.0 g): 463 cal | 18.4g protein | 26.9g fat | 36.3g carbs | 4.9g fiber | 3.8g sugar | 126.8g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Liverwurst Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_029',
    name: 'Limburger Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 107,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '5 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":363.1,"pro":17.3,"fat":17.8,"carb":33.4,"fib":4.2,"h2o":73.5,"sug":3.6,"perServing":{"cal":363.1,"pro":17.3,"fat":17.8,"carb":33.4,"fib":4.2,"h2o":73.5,"sug":3.6,"AddedSugars":0.0,"IntrinsicSugars":3.6},"micros":{"vitaminA":132.91,"vitaminC":1.2,"vitaminD":7.81,"vitaminE":0.25,"vitaminK":1.53,"vitaminB6":0.08,"vitaminB12":0.41,"thiamin":0.23,"riboflavin":0.34,"niacin":1.76,"folate":73.71,"calcium":231.34,"iron":1.38,"magnesium":28.75,"phosphorus":215.9,"potassium":147.95,"sodium":615.01,"zinc":1.36,"copper":0.09,"selenium":20.42,"cholesterol":35.14,"saturatedFat":6.82,"monoFat":4.01,"polyFat":0.57,"omega3":0.01,"omega6":0.01},"gramsPerServing":146.0,"servings":1,"per100g":{"Energy_KCal":248.73,"Water":50.33,"Protein":11.83,"TotalLipidFat":12.21,"Carbohydrate":22.84,"FiberTotalDietary":2.91,"SugarsTotal":2.49,"Cholesterol":35.14,"FattyAcids_totalSaturated":6.82,"FattyAcids_totalMonounsaturated":4.01,"FattyAcids_totalPolyunsaturated":0.57,"LinoleicAcid":0.01,"alphaLinolenicAcid":0.01,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":132.91,"Retinol":132.35,"Carotene_beta":9.49,"VitaminD":7.81,"VitaminE_alphaTocopherol":0.25,"VitaminK_phylloquinone":1.53,"VitaminC_totalAscorbicAcid":1.2,"Thiamin":0.23,"Riboflavin":0.34,"Niacin":1.76,"PantothenicAcid":0.67,"VitaminB6":0.08,"Folate_total":73.71,"Folate_food":47.84,"Folate_DFE":91.68,"FolicAcid":25.86,"VitaminB12":0.41,"Choline_total":14.02,"Betaine":0.02,"LuteinZeaxanthin":28.09,"Lycopene":0.0,"Calcium_Ca":231.34,"Iron_Fe":1.38,"Magnesium_Mg":28.75,"Phosphorus_P":215.9,"Potassium_K":147.95,"Sodium_Na":615.01,"Zinc_Zn":1.36,"Copper_Cu":0.09,"Manganese_Mn":0.4,"Selenium_Se":20.42,"Tryptophan":0.15,"Threonine":0.4,"Isoleucine":0.61,"Leucine":1.08,"Lysine":0.77,"Methionine":0.3,"Cystine":0.12,"Phenylalanine":0.62,"Tyrosine":0.56,"Valine":0.73,"Arginine":0.43,"Histidine":0.31,"Alanine":0.39,"AsparticAcid":0.79,"GlutamicAcid":2.96,"Glycine":0.3,"Proline":1.36,"Serine":0.63,"omega3":0.01,"omega6":0.01,"AddedSugars":0.0,"IntrinsicSugars":2.49},"addedSugars":0.0,"intrinsicSugars":3.6,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":1.0,"yieldFactorFat":1.0,"sources":[{"ndb":"18060","name":"Bread, rye","grams":64.0},{"ndb":"1024","name":"Cheese, limburger","grams":57.0},{"ndb":"11282","name":"Onions, raw","grams":20.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":5.0}],"sections":[{"section_key":"sandwich","section_label":"Limburger Sandwich","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":146.0,"raw_water_grams":73.48,"raw_fat_grams":17.83,"final_grams":146.0}],"cookingMethod":"raw"},
    recipeIngredients: [
      { name: 'Limburger Sandwich', quantity: 'custom (g)', foodWord: 'LIMBURGERSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rye bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18060', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'limburger cheese', quantity: '2 oz', section: 'sandwich', ndbNo: '1024', portionDesc: 'g', portionGrams: 57.0 },
      { name: 'onion (20g)', quantity: '2 thin slices', section: 'sandwich', ndbNo: '11282', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'yellow mustard', quantity: '1 tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 5.0 }
    ],
    recipeInstructions: [
      'Spread mustard on one side of each rye bread slice.',
      'Lay the limburger cheese on top of the mustard on one slice.',
      'Top with the thin onion slices.',
      'Close the sandwich with the second bread slice, press gently, and serve.',
      '1 serving (146.0 g): 363 cal | 17.3g protein | 17.8g fat | 33.4g carbs | 4.2g fiber | 3.6g sugar | 73.5g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Limburger Sandwich', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_030',
    name: 'Patty Melt',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 108,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '10 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":806.0,"pro":41.0,"fat":53.5,"carb":39.4,"fib":5.2,"h2o":154.5,"sug":5.9,"perServing":{"cal":806.0,"pro":41.0,"fat":53.5,"carb":39.4,"fib":5.2,"h2o":154.5,"sug":5.9,"AddedSugars":0.0,"IntrinsicSugars":5.9},"micros":{"vitaminA":70.62,"vitaminC":1.04,"vitaminD":1.09,"vitaminE":0.27,"vitaminK":1.63,"vitaminB6":0.14,"vitaminB12":1.19,"thiamin":0.09,"riboflavin":0.17,"niacin":1.98,"folate":25.2,"calcium":198.82,"iron":1.45,"magnesium":24.33,"phosphorus":204.81,"potassium":194.36,"sodium":614.48,"zinc":2.72,"copper":0.08,"selenium":18.25,"cholesterol":54.8,"saturatedFat":8.9,"monoFat":6.17,"polyFat":0.58,"omega3":0.04,"omega6":0.19},"gramsPerServing":296.4,"servings":1,"per100g":{"Energy_KCal":271.94,"Water":52.13,"Protein":13.82,"TotalLipidFat":18.05,"Carbohydrate":13.29,"FiberTotalDietary":1.74,"SugarsTotal":1.98,"Cholesterol":54.8,"FattyAcids_totalSaturated":8.9,"FattyAcids_totalMonounsaturated":6.17,"FattyAcids_totalPolyunsaturated":0.58,"LinoleicAcid":0.19,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":70.62,"Retinol":69.35,"Carotene_beta":16.35,"VitaminD":1.09,"VitaminE_alphaTocopherol":0.27,"VitaminK_phylloquinone":1.63,"VitaminC_totalAscorbicAcid":1.04,"Thiamin":0.09,"Riboflavin":0.17,"Niacin":1.98,"PantothenicAcid":0.31,"VitaminB6":0.14,"Folate_total":25.2,"Folate_food":15.64,"Folate_DFE":31.84,"FolicAcid":12.74,"VitaminB12":1.19,"Choline_total":27.12,"Betaine":3.29,"LuteinZeaxanthin":9.56,"Lycopene":0.17,"Calcium_Ca":198.82,"Iron_Fe":1.45,"Magnesium_Mg":24.33,"Phosphorus_P":204.81,"Potassium_K":194.36,"Sodium_Na":614.48,"Zinc_Zn":2.72,"Copper_Cu":0.08,"Manganese_Mn":0.23,"Selenium_Se":18.25,"Tryptophan":0.13,"Threonine":0.51,"Isoleucine":0.65,"Leucine":1.2,"Lysine":1.09,"Methionine":0.34,"Cystine":0.13,"Phenylalanine":0.67,"Tyrosine":0.57,"Valine":0.81,"Arginine":0.69,"Histidine":0.45,"Alanine":0.65,"AsparticAcid":1.01,"GlutamicAcid":2.7,"Glycine":0.61,"Proline":1.23,"Serine":0.67,"omega3":0.04,"omega6":0.19,"AddedSugars":0.0,"IntrinsicSugars":1.98},"addedSugars":0.0,"intrinsicSugars":5.9,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"18060","name":"Bread, rye","grams":64.0},{"ndb":"23572","name":"Beef, ground, 80% lean meat / 20% fat, raw","grams":113.0},{"ndb":"1040","name":"Cheese, swiss","grams":56.0},{"ndb":"11282","name":"Onions, raw","grams":80.0},{"ndb":"1001","name":"Butter, salted","grams":14.0},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.3}],"sections":[{"section_key":"sandwich","section_label":"Patty Melt","prep_method":"pan grilled","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":7,"raw_grams":330.3,"raw_water_grams":188.41,"raw_fat_grams":53.51,"final_grams":296.39}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Patty Melt', quantity: 'custom (g)', foodWord: 'PATTYMELT', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'rye bread', quantity: '2 slices (32g each)', section: 'sandwich', ndbNo: '18060', portionDesc: 'g', portionGrams: 64.0 },
      { name: 'ground beef (80/20)', quantity: '4 oz', section: 'sandwich', ndbNo: '23572', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'Swiss cheese', quantity: '2 slices', section: 'sandwich', ndbNo: '1040', portionDesc: 'g', portionGrams: 56.0 },
      { name: 'onion', quantity: '1 medium (caramelized)', section: 'sandwich', ndbNo: '11282', portionDesc: 'g', portionGrams: 80.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'salt', quantity: '½ tsp', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: 'pinch', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Season the ground beef with salt and pepper, then form into a thin oval patty sized to fit the rye bread.',
      'Cook the patty in a dry skillet over medium-high heat, 3–4 minutes per side, until cooked through. Remove and set aside.',
      'In the same skillet over medium-low heat, cook the onion slices in the beef drippings, stirring occasionally, until golden and caramelized, about 15 minutes.',
      'Layer the Swiss cheese, cooked patty, caramelized onions, and second slice of Swiss cheese on one slice of rye bread. Close with the second slice.',
      'Melt the butter in the skillet over medium heat. Cook the assembled sandwich until golden-brown on both sides and the cheese is melted, about 2–3 minutes per side.',
      '1 serving (296.4 g): 806 cal | 41.0g protein | 53.5g fat | 39.4g carbs | 5.2g fiber | 5.9g sugar | 154.5g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Patty Melt', cookingMethod: '', yieldFactorWater: 0.82 }
    ],
  },
  {
    id: 'SAND_031',
    name: 'Sloppy Joe',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 109,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '20 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":419.3,"pro":20.4,"fat":22.7,"carb":33.7,"fib":2.4,"h2o":172.0,"sug":10.4,"perServing":{"cal":419.3,"pro":20.4,"fat":22.7,"carb":33.7,"fib":2.4,"h2o":172.0,"sug":10.4,"AddedSugars":0.0,"IntrinsicSugars":10.4},"micros":{"vitaminA":21.74,"vitaminC":4.82,"vitaminD":0.96,"vitaminE":0.42,"vitaminK":3.02,"vitaminB6":0.13,"vitaminB12":0.64,"thiamin":0.09,"riboflavin":0.11,"niacin":1.99,"folate":16.9,"calcium":40.37,"iron":1.59,"magnesium":16.09,"phosphorus":84.58,"potassium":236.73,"sodium":430.35,"zinc":1.63,"copper":0.08,"selenium":10.38,"cholesterol":27.81,"saturatedFat":3.66,"monoFat":3.5,"polyFat":0.42,"omega3":0.03,"omega6":0.25},"gramsPerServing":253.3,"servings":1,"per100g":{"Energy_KCal":165.54,"Water":67.9,"Protein":8.04,"TotalLipidFat":8.97,"Carbohydrate":13.29,"FiberTotalDietary":0.96,"SugarsTotal":4.12,"Cholesterol":27.81,"FattyAcids_totalSaturated":3.66,"FattyAcids_totalMonounsaturated":3.5,"FattyAcids_totalPolyunsaturated":0.42,"LinoleicAcid":0.25,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":21.74,"Retinol":14.98,"Carotene_beta":81.19,"VitaminD":0.96,"VitaminE_alphaTocopherol":0.42,"VitaminK_phylloquinone":3.02,"VitaminC_totalAscorbicAcid":4.82,"Thiamin":0.09,"Riboflavin":0.11,"Niacin":1.99,"PantothenicAcid":0.24,"VitaminB6":0.13,"Folate_total":16.9,"Folate_food":10.15,"Folate_DFE":21.61,"FolicAcid":9.0,"VitaminB12":0.64,"Choline_total":23.78,"Betaine":2.84,"LuteinZeaxanthin":28.25,"Lycopene":2101.17,"Calcium_Ca":40.37,"Iron_Fe":1.59,"Magnesium_Mg":16.09,"Phosphorus_P":84.58,"Potassium_K":236.73,"Sodium_Na":430.35,"Zinc_Zn":1.63,"Copper_Cu":0.08,"Manganese_Mn":0.16,"Selenium_Se":10.38,"Tryptophan":0.03,"Threonine":0.24,"Isoleucine":0.26,"Leucine":0.47,"Lysine":0.5,"Methionine":0.15,"Cystine":0.05,"Phenylalanine":0.25,"Tyrosine":0.18,"Valine":0.3,"Arginine":0.4,"Histidine":0.19,"Alanine":0.38,"AsparticAcid":0.6,"GlutamicAcid":1.08,"Glycine":0.4,"Proline":0.31,"Serine":0.25,"omega3":0.03,"omega6":0.25,"AddedSugars":0.0,"IntrinsicSugars":4.12},"addedSugars":0.0,"intrinsicSugars":10.4,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":1.0,"sources":[{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"23572","name":"Beef, ground, 80% lean meat / 20% fat, raw","grams":85.0},{"ndb":"11282","name":"Onions, raw","grams":22.0},{"ndb":"11333","name":"Peppers, sweet, green, raw","grams":22.0},{"ndb":"11935","name":"Catsup","grams":17.0},{"ndb":"11546","name":"Tomato products, canned, paste, without salt added","grams":16.0},{"ndb":"14411","name":"Water, tap, drinking","grams":80.0},{"ndb":"2046","name":"Mustard, prepared, yellow","grams":1.5},{"ndb":"6971","name":"Sauce, worcestershire","grams":2.5},{"ndb":"2020","name":"Spices, garlic powder","grams":0.8},{"ndb":"1001","name":"Butter, salted","grams":4.7},{"ndb":"2047","name":"Salt, table","grams":1.5},{"ndb":"2030","name":"Spices, pepper, black","grams":0.3}],"sections":[{"section_key":"sandwich","section_label":"Sloppy Joe","prep_method":"pan grilled","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.8,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":13,"raw_grams":296.3,"raw_water_grams":215.0,"raw_fat_grams":22.71,"final_grams":253.3}],"cookingMethod":"pan grilled"},
    recipeIngredients: [
      { name: 'Sloppy Joe', quantity: 'custom (g)', foodWord: 'SLOPPYJOE', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'hamburger bun', quantity: '1 bun', section: 'sandwich', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'ground beef (80/20)', quantity: '3 oz', section: 'sandwich', ndbNo: '23572', portionDesc: 'g', portionGrams: 85.0 },
      { name: 'onion', quantity: '2 tbsp minced', section: 'sandwich', ndbNo: '11282', portionDesc: 'g', portionGrams: 22.0 },
      { name: 'green bell pepper', quantity: '2 tbsp minced', section: 'sandwich', ndbNo: '11333', portionDesc: 'g', portionGrams: 22.0 },
      { name: 'ketchup', quantity: '1 tbsp', section: 'sandwich', ndbNo: '11935', portionDesc: 'g', portionGrams: 17.0 },
      { name: 'tomato paste', quantity: '1 tbsp', section: 'sandwich', ndbNo: '11546', portionDesc: 'g', portionGrams: 16.0 },
      { name: 'water', quantity: '⅓ cup', section: 'sandwich', ndbNo: '14411', portionDesc: 'g', portionGrams: 80.0 },
      { name: 'yellow mustard', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2046', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'Worcestershire sauce', quantity: '½ tsp', section: 'sandwich', ndbNo: '6971', portionDesc: 'g', portionGrams: 2.5 },
      { name: 'garlic powder', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2020', portionDesc: 'g', portionGrams: 0.8 },
      { name: 'salted butter', quantity: '1 tsp', section: 'sandwich', ndbNo: '1001', portionDesc: 'g', portionGrams: 4.7 },
      { name: 'salt', quantity: '¼ tsp', section: 'sandwich', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'ground black pepper', quantity: 'pinch', section: 'sandwich', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 }
    ],
    recipeInstructions: [
      'Melt the butter in a skillet over medium-high heat. Add the onion and bell pepper and cook, stirring, until softened, about 5 minutes.',
      'Add the ground beef and cook, breaking it up, until browned throughout, about 5–7 minutes. Drain any excess fat.',
      'Stir in the garlic powder, salt, and pepper.',
      'Push the meat to one side, add the tomato paste to the center of the pan, and cook for 1 minute, stirring, until it darkens slightly.',
      'Stir in the ketchup, water, Worcestershire sauce, and mustard. Reduce heat to medium-low and simmer, stirring occasionally, until the sauce thickens, about 8–10 minutes.',
      'Spoon the meat mixture onto the bottom bun and close with the top bun.',
      '1 serving (253.3 g): 419 cal | 20.4g protein | 22.7g fat | 33.7g carbs | 2.4g fiber | 10.4g sugar | 172.0g water'
    ],
    sections: [
      { key: 'sandwich', label: 'Sloppy Joe', cookingMethod: '', yieldFactorWater: 0.8 }
    ],
  },
  {
    id: 'SAND_032',
    name: 'Pulled Pork Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 110,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":516.5,"pro":28.4,"fat":27.4,"carb":39.0,"fib":3.1,"h2o":148.5,"sug":15.3,"perServing":{"cal":516.5,"pro":28.4,"fat":27.4,"carb":39.0,"fib":3.1,"h2o":148.5,"sug":15.3,"AddedSugars":0.0,"IntrinsicSugars":15.3},"micros":{"vitaminA":17.81,"vitaminC":9.1,"vitaminD":15.27,"vitaminE":0.58,"vitaminK":29.74,"vitaminB6":0.25,"vitaminB12":0.47,"thiamin":0.32,"riboflavin":0.25,"niacin":2.76,"folate":27.42,"calcium":49.68,"iron":1.51,"magnesium":20.37,"phosphorus":129.73,"potassium":274.83,"sodium":594.29,"zinc":1.84,"copper":0.08,"selenium":18.84,"cholesterol":34.83,"saturatedFat":3.13,"monoFat":3.73,"polyFat":3.7,"omega3":0.38,"omega6":3.23},"gramsPerServing":249.5,"servings":1,"per100g":{"Energy_KCal":207.01,"Water":59.54,"Protein":11.37,"TotalLipidFat":11.0,"Carbohydrate":15.62,"FiberTotalDietary":1.25,"SugarsTotal":6.12,"Cholesterol":34.83,"FattyAcids_totalSaturated":3.13,"FattyAcids_totalMonounsaturated":3.73,"FattyAcids_totalPolyunsaturated":3.7,"LinoleicAcid":3.23,"alphaLinolenicAcid":0.38,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":17.81,"Retinol":6.79,"Carotene_beta":112.05,"VitaminD":15.27,"VitaminE_alphaTocopherol":0.58,"VitaminK_phylloquinone":29.74,"VitaminC_totalAscorbicAcid":9.1,"Thiamin":0.32,"Riboflavin":0.25,"Niacin":2.76,"PantothenicAcid":0.83,"VitaminB6":0.25,"Folate_total":27.42,"Folate_food":18.28,"Folate_DFE":33.8,"FolicAcid":9.13,"VitaminB12":0.47,"Choline_total":42.82,"Betaine":2.25,"LuteinZeaxanthin":73.34,"Lycopene":547.17,"Calcium_Ca":49.68,"Iron_Fe":1.51,"Magnesium_Mg":20.37,"Phosphorus_P":129.73,"Potassium_K":274.83,"Sodium_Na":594.29,"Zinc_Zn":1.84,"Copper_Cu":0.08,"Manganese_Mn":0.19,"Selenium_Se":18.84,"Tryptophan":0.1,"Threonine":0.42,"Isoleucine":0.46,"Leucine":0.79,"Lysine":0.86,"Methionine":0.26,"Cystine":0.1,"Phenylalanine":0.4,"Tyrosine":0.35,"Valine":0.49,"Arginine":0.64,"Histidine":0.4,"Alanine":0.55,"AsparticAcid":0.94,"GlutamicAcid":1.55,"Glycine":0.42,"Proline":0.39,"Serine":0.41,"omega3":0.38,"omega6":3.23,"AddedSugars":0.0,"IntrinsicSugars":6.12},"addedSugars":0.0,"intrinsicSugars":15.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.6,"yieldFactorFat":0.88,"sources":[{"ndb":"10080","name":"Pork, fresh, shoulder, (Boston butt), blade (steaks), separable lean and fat, raw","grams":130.0},{"ndb":"2047","name":"Salt, table","grams":1.5},{"ndb":"2030","name":"Spices, pepper, black","grams":0.5},{"ndb":"2020","name":"Spices, garlic powder","grams":1.0},{"ndb":"2028","name":"Spices, paprika","grams":1.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"6150","name":"Sauce, barbecue","grams":30.0},{"ndb":"11109","name":"Cabbage, raw","grams":60.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":15.0},{"ndb":"2048","name":"Vinegar, cider","grams":5.0},{"ndb":"2047","name":"Salt, table","grams":0.5}],"sections":[{"section_key":"pork","section_label":"Pulled pork","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.6,"yield_factor_fat":0.88,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":134.0,"raw_water_grams":90.18,"raw_fat_grams":16.22,"final_grams":95.98},{"section_key":"slaw","section_label":"Coleslaw & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":153.5,"raw_water_grams":94.43,"raw_fat_grams":13.16,"final_grams":153.5}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Pulled Pork Sandwich', quantity: 'custom (g)', foodWord: 'PULLEDPORK', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'pork shoulder', quantity: '4½ oz', section: 'pork', ndbNo: '10080', portionDesc: 'g', portionGrams: 130.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'pork', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'ground black pepper', quantity: '⅛ tsp', section: 'pork', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'garlic powder', quantity: '¼ tsp', section: 'pork', ndbNo: '2020', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'paprika', quantity: '¼ tsp', section: 'pork', ndbNo: '2028', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'slaw', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'BBQ sauce', quantity: '2 tbsp', section: 'slaw', ndbNo: '6150', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'green cabbage', quantity: '¾ cup shredded', section: 'slaw', ndbNo: '11109', portionDesc: 'g', portionGrams: 60.0 },
      { name: 'mayonnaise', quantity: '1 tbsp', section: 'slaw', ndbNo: '4025', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'apple cider vinegar', quantity: '1 tsp', section: 'slaw', ndbNo: '2048', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'salt', quantity: 'pinch', section: 'slaw', ndbNo: '2047', portionDesc: 'g', portionGrams: 0.5 }
    ],
    recipeInstructions: [
      'Combine the salt, pepper, garlic powder, and paprika, then rub the mixture all over the pork shoulder.',
      'Place the pork in a covered Dutch oven or roasting pan. Roast at 300°F until fork-tender and falling apart, about 3–4 hours.',
      'Remove the pork and shred it using two forks, discarding any large pieces of fat.',
      'Toss the shredded cabbage with the mayonnaise, apple cider vinegar, and a pinch of salt until evenly coated.',
      'Spread the BBQ sauce over the bottom bun, pile on the pulled pork, and top with the slaw.',
      'Close with the top bun and serve.',
      '1 serving (250g): 516 cal | 28g protein | 27g fat | 39g carbs | 3g fiber | 15g sugar | 149g water'
    ],
    sections: [
      { key: 'pork', label: 'Pulled pork', cookingMethod: '', yieldFactorWater: 0.6, yieldFactorFat: 0.88 },
      { key: 'slaw', label: 'Coleslaw & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_033',
    name: 'Barbecue Brisket Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 111,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '45 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":573.0,"pro":33.2,"fat":28.5,"carb":45.7,"fib":2.6,"h2o":128.7,"sug":19.2,"perServing":{"cal":573.0,"pro":33.2,"fat":28.5,"carb":45.7,"fib":2.6,"h2o":128.7,"sug":19.2,"AddedSugars":0.0,"IntrinsicSugars":19.2},"micros":{"vitaminA":16.24,"vitaminC":1.1,"vitaminD":0.0,"vitaminE":0.31,"vitaminK":3.28,"vitaminB6":0.23,"vitaminB12":1.28,"thiamin":0.15,"riboflavin":0.16,"niacin":2.72,"folate":22.6,"calcium":47.13,"iron":1.99,"magnesium":21.95,"phosphorus":140.91,"potassium":285.97,"sodium":862.59,"zinc":2.54,"copper":0.09,"selenium":15.24,"cholesterol":41.76,"saturatedFat":4.8,"monoFat":5.13,"polyFat":0.7,"omega3":0.04,"omega6":0.29},"gramsPerServing":244.2,"servings":1,"per100g":{"Energy_KCal":234.63,"Water":52.69,"Protein":13.59,"TotalLipidFat":11.67,"Carbohydrate":18.7,"FiberTotalDietary":1.06,"SugarsTotal":7.87,"Cholesterol":41.76,"FattyAcids_totalSaturated":4.8,"FattyAcids_totalMonounsaturated":5.13,"FattyAcids_totalPolyunsaturated":0.7,"LinoleicAcid":0.29,"alphaLinolenicAcid":0.04,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":16.24,"Retinol":5.11,"Carotene_beta":116.35,"VitaminD":0.0,"VitaminE_alphaTocopherol":0.31,"VitaminK_phylloquinone":3.28,"VitaminC_totalAscorbicAcid":1.1,"Thiamin":0.15,"Riboflavin":0.16,"Niacin":2.72,"PantothenicAcid":0.33,"VitaminB6":0.23,"Folate_total":22.6,"Folate_food":13.27,"Folate_DFE":29.12,"FolicAcid":9.33,"VitaminB12":1.28,"Choline_total":48.04,"Betaine":7.12,"LuteinZeaxanthin":74.76,"Lycopene":838.4,"Calcium_Ca":47.13,"Iron_Fe":1.99,"Magnesium_Mg":21.95,"Phosphorus_P":140.91,"Potassium_K":285.97,"Sodium_Na":862.59,"Zinc_Zn":2.54,"Copper_Cu":0.09,"Manganese_Mn":0.18,"Selenium_Se":15.24,"Tryptophan":0.13,"Threonine":0.5,"Isoleucine":0.51,"Leucine":0.91,"Lysine":0.96,"Methionine":0.29,"Cystine":0.11,"Phenylalanine":0.45,"Tyrosine":0.38,"Valine":0.56,"Arginine":0.77,"Histidine":0.39,"Alanine":0.69,"AsparticAcid":1.08,"GlutamicAcid":1.78,"Glycine":0.63,"Proline":0.53,"Serine":0.44,"omega3":0.04,"omega6":0.29,"AddedSugars":0.0,"IntrinsicSugars":7.87},"addedSugars":0.0,"intrinsicSugars":19.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.62,"yieldFactorFat":0.92,"sources":[{"ndb":"13803","name":"Beef, brisket, whole, separable lean and fat, trimmed to 1/8\" fat, all grades, raw","grams":150.0},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.5},{"ndb":"2020","name":"Spices, garlic powder","grams":2.0},{"ndb":"2026","name":"Spices, onion powder","grams":2.0},{"ndb":"2028","name":"Spices, paprika","grams":1.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"6150","name":"Sauce, barbecue","grams":45.0},{"ndb":"11282","name":"Onions, raw","grams":15.0},{"ndb":"11937","name":"Pickles, cucumber, dill or kosher dill","grams":20.0}],"sections":[{"section_key":"brisket","section_label":"Barbecue brisket","prep_method":"raw","cook_method":"baked","cooking_method":"baked","cooking_method_normalized":"baked","yield_factor_water":0.62,"yield_factor_fat":0.92,"yield_factor_other":1.0,"ingredient_count":6,"raw_grams":158.5,"raw_water_grams":92.04,"raw_fat_grams":28.77,"final_grams":121.22},{"section_key":"assembly","section_label":"Toppings & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":4,"raw_grams":123.0,"raw_water_grams":71.62,"raw_fat_grams":2.04,"final_grams":123.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Barbecue Brisket Sandwich', quantity: 'custom (g)', foodWord: 'BBQBRISKET', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'beef brisket', quantity: '5¼ oz', section: 'brisket', ndbNo: '13803', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'salt', quantity: '½ tsp', section: 'brisket', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '¼ tsp', section: 'brisket', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'garlic powder', quantity: '½ tsp', section: 'brisket', ndbNo: '2020', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'onion powder', quantity: '½ tsp', section: 'brisket', ndbNo: '2026', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'paprika', quantity: '½ tsp', section: 'brisket', ndbNo: '2028', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'assembly', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'BBQ sauce', quantity: '3 tbsp', section: 'assembly', ndbNo: '6150', portionDesc: 'g', portionGrams: 45.0 },
      { name: 'onion', quantity: '15g', section: 'assembly', ndbNo: '11282', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'dill pickle', quantity: '20g', section: 'assembly', ndbNo: '11937', portionDesc: 'g', portionGrams: 20.0 }
    ],
    recipeInstructions: [
      'Combine the salt, pepper, garlic powder, onion powder, and paprika, then rub the mixture all over the brisket.',
      'Place the brisket fat-side up in a covered roasting pan or Dutch oven. Roast at 275°F until fork-tender and easily sliced, about 3½–4 hours.',
      'Remove the brisket from the pan and let it rest for 10 minutes, then slice thinly against the grain.',
      'Spread the BBQ sauce on the bottom bun and pile on the sliced brisket.',
      'Top with the sliced onion and pickle slices, then close with the top bun.',
      '1 serving (244g): 573 cal | 33g protein | 29g fat | 46g carbs | 3g fiber | 19g sugar | 129g water'
    ],
    sections: [
      { key: 'brisket', label: 'Barbecue brisket', cookingMethod: '', yieldFactorWater: 0.62, yieldFactorFat: 0.92 },
      { key: 'assembly', label: 'Toppings & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_034',
    name: 'Grilled Chicken Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 112,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":540.7,"pro":39.0,"fat":31.6,"carb":25.1,"fib":1.9,"h2o":180.8,"sug":4.8,"perServing":{"cal":540.7,"pro":39.0,"fat":31.6,"carb":25.1,"fib":1.9,"h2o":180.8,"sug":4.8,"AddedSugars":0.0,"IntrinsicSugars":4.8},"micros":{"vitaminA":17.01,"vitaminC":2.07,"vitaminD":1.2,"vitaminE":0.86,"vitaminK":22.37,"vitaminB6":0.35,"vitaminB12":0.14,"thiamin":0.13,"riboflavin":0.13,"niacin":4.81,"folate":23.33,"calcium":33.37,"iron":0.87,"magnesium":21.4,"phosphorus":138.18,"potassium":251.24,"sodium":428.12,"zinc":0.54,"copper":0.05,"selenium":16.63,"cholesterol":43.06,"saturatedFat":1.85,"monoFat":3.45,"polyFat":5.05,"omega3":0.56,"omega6":4.24},"gramsPerServing":281.6,"servings":1,"per100g":{"Energy_KCal":191.99,"Water":64.18,"Protein":13.86,"TotalLipidFat":11.21,"Carbohydrate":8.93,"FiberTotalDietary":0.66,"SugarsTotal":1.71,"Cholesterol":43.06,"FattyAcids_totalSaturated":1.85,"FattyAcids_totalMonounsaturated":3.45,"FattyAcids_totalPolyunsaturated":5.05,"LinoleicAcid":4.24,"alphaLinolenicAcid":0.56,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":17.01,"Retinol":9.75,"Carotene_beta":80.24,"VitaminD":1.2,"VitaminE_alphaTocopherol":0.86,"VitaminK_phylloquinone":22.37,"VitaminC_totalAscorbicAcid":2.07,"Thiamin":0.13,"Riboflavin":0.13,"Niacin":4.81,"PantothenicAcid":0.77,"VitaminB6":0.35,"Folate_total":23.33,"Folate_food":15.24,"Folate_DFE":28.98,"FolicAcid":8.09,"VitaminB12":0.14,"Choline_total":46.77,"Betaine":3.79,"LuteinZeaxanthin":42.31,"Lycopene":274.12,"Calcium_Ca":33.37,"Iron_Fe":0.87,"Magnesium_Mg":21.4,"Phosphorus_P":138.18,"Potassium_K":251.24,"Sodium_Na":428.12,"Zinc_Zn":0.54,"Copper_Cu":0.05,"Manganese_Mn":0.14,"Selenium_Se":16.63,"Tryptophan":0.15,"Threonine":0.54,"Isoleucine":0.6,"Leucine":1.01,"Lysine":1.17,"Methionine":0.31,"Cystine":0.11,"Phenylalanine":0.49,"Tyrosine":0.44,"Valine":0.63,"Arginine":0.83,"Histidine":0.45,"Alanine":0.71,"AsparticAcid":1.17,"GlutamicAcid":1.88,"Glycine":0.54,"Proline":0.39,"Serine":0.47,"omega3":0.56,"omega6":4.24,"AddedSugars":0.0,"IntrinsicSugars":1.71},"addedSugars":0.0,"intrinsicSugars":4.8,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.8,"yieldFactorFat":0.98,"sources":[{"ndb":"5062","name":"Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw","grams":150.0},{"ndb":"2047","name":"Salt, table","grams":1.5},{"ndb":"2030","name":"Spices, pepper, black","grams":0.5},{"ndb":"2020","name":"Spices, garlic powder","grams":1.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":5.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":25.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":30.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":28.0},{"ndb":"11937","name":"Pickles, cucumber, dill or kosher dill","grams":20.0}],"sections":[{"section_key":"chicken","section_label":"Grilled chicken","prep_method":"raw","cook_method":"pan grilled","cooking_method":"pan grilled","cooking_method_normalized":"fried","yield_factor_water":0.8,"yield_factor_fat":0.98,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":158.0,"raw_water_grams":110.98,"raw_fat_grams":8.95,"final_grams":135.62},{"section_key":"assembly","section_label":"Toppings & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":146.0,"raw_water_grams":91.96,"raw_fat_grams":22.79,"final_grams":146.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Grilled Chicken Sandwich', quantity: 'custom (g)', foodWord: 'GRILLEDCHICKENSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'chicken breast raw', quantity: '5¼ oz', section: 'chicken', ndbNo: '5062', portionDesc: 'g', portionGrams: 150.0 },
      { name: 'salt', quantity: '¼ tsp', section: 'chicken', ndbNo: '2047', portionDesc: 'g', portionGrams: 1.5 },
      { name: 'ground black pepper', quantity: '⅛ tsp', section: 'chicken', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'garlic powder', quantity: '¼ tsp', section: 'chicken', ndbNo: '2020', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'olive oil', quantity: '1 tsp', section: 'chicken', ndbNo: '4053', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'assembly', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'iceberg lettuce', quantity: '25g', section: 'assembly', ndbNo: '11252', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'tomato raw', quantity: '30g sliced', section: 'assembly', ndbNo: '11529', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'assembly', ndbNo: '4025', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'dill pickle', quantity: '20g sliced', section: 'assembly', ndbNo: '11937', portionDesc: 'g', portionGrams: 20.0 }
    ],
    recipeInstructions: [
      'Season the chicken breast with salt, pepper, and garlic powder.',
      'Heat a grill pan or skillet over medium-high heat with the olive oil. Grill the chicken for 5–6 minutes per side until cooked through and grill marks form (internal temperature 165°F).',
      'Spread mayonnaise on both buns, then layer the lettuce, sliced tomato, and sliced pickles on the bottom bun.',
      'Place the grilled chicken on top of the toppings.',
      'Close with the top bun and serve.',
      '1 serving (282g): 541 cal | 39g protein | 32g fat | 25g carbs | 2g fiber | 5g sugar | 181g water'
    ],
    sections: [
      { key: 'chicken', label: 'Grilled chicken', cookingMethod: '', yieldFactorWater: 0.8, yieldFactorFat: 0.98 },
      { key: 'assembly', label: 'Toppings & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_035',
    name: 'Fried Chicken Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 113,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":759.1,"pro":39.5,"fat":43.5,"carb":50.6,"fib":3.1,"h2o":200.1,"sug":6.3,"perServing":{"cal":759.1,"pro":39.5,"fat":43.5,"carb":50.6,"fib":3.1,"h2o":200.1,"sug":6.3,"AddedSugars":0.0,"IntrinsicSugars":6.3},"micros":{"vitaminA":31.08,"vitaminC":1.72,"vitaminD":9.9,"vitaminE":1.1,"vitaminK":20.2,"vitaminB6":0.26,"vitaminB12":0.18,"thiamin":0.16,"riboflavin":0.18,"niacin":3.75,"folate":33.82,"calcium":41.23,"iron":1.32,"magnesium":19.46,"phosphorus":127.29,"potassium":216.94,"sodium":534.39,"zinc":0.59,"copper":0.06,"selenium":17.31,"cholesterol":57.12,"saturatedFat":2.22,"monoFat":5.05,"polyFat":4.51,"omega3":0.46,"omega6":3.58},"gramsPerServing":340.8,"servings":1,"per100g":{"Energy_KCal":222.77,"Water":58.72,"Protein":11.61,"TotalLipidFat":12.77,"Carbohydrate":14.85,"FiberTotalDietary":0.91,"SugarsTotal":1.84,"Cholesterol":57.12,"FattyAcids_totalSaturated":2.22,"FattyAcids_totalMonounsaturated":5.05,"FattyAcids_totalPolyunsaturated":4.51,"LinoleicAcid":3.58,"alphaLinolenicAcid":0.46,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":31.08,"Retinol":19.25,"Carotene_beta":128.18,"VitaminD":9.9,"VitaminE_alphaTocopherol":1.1,"VitaminK_phylloquinone":20.2,"VitaminC_totalAscorbicAcid":1.72,"Thiamin":0.16,"Riboflavin":0.18,"Niacin":3.75,"PantothenicAcid":0.68,"VitaminB6":0.26,"Folate_total":33.82,"Folate_food":16.97,"Folate_DFE":45.62,"FolicAcid":20.25,"VitaminB12":0.18,"Choline_total":52.74,"Betaine":2.62,"LuteinZeaxanthin":99.61,"Lycopene":226.54,"Calcium_Ca":41.23,"Iron_Fe":1.32,"Magnesium_Mg":19.46,"Phosphorus_P":127.29,"Potassium_K":216.94,"Sodium_Na":534.39,"Zinc_Zn":0.59,"Copper_Cu":0.06,"Manganese_Mn":0.18,"Selenium_Se":17.31,"Tryptophan":0.13,"Threonine":0.44,"Isoleucine":0.49,"Leucine":0.84,"Lysine":0.88,"Methionine":0.26,"Cystine":0.11,"Phenylalanine":0.44,"Tyrosine":0.37,"Valine":0.54,"Arginine":0.67,"Histidine":0.35,"Alanine":0.57,"AsparticAcid":0.95,"GlutamicAcid":1.75,"Glycine":0.43,"Proline":0.44,"Serine":0.44,"omega3":0.46,"omega6":3.58,"AddedSugars":0.0,"IntrinsicSugars":1.84},"addedSugars":0.0,"intrinsicSugars":6.3,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"5062","name":"Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw","grams":120.0},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":30.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":25.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":23.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":14.0},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.5},{"ndb":"2020","name":"Spices, garlic powder","grams":2.0},{"ndb":"2028","name":"Spices, paprika","grams":1.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":25.0},{"ndb":"11529","name":"Tomatoes, red, ripe, raw, year round average","grams":30.0},{"ndb":"11937","name":"Pickles, cucumber, dill or kosher dill","grams":20.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":28.0}],"sections":[{"section_key":"chicken","section_label":"Fried chicken","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":9,"raw_grams":218.5,"raw_water_grams":131.87,"raw_fat_grams":20.72,"final_grams":194.76},{"section_key":"assembly","section_label":"Toppings & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":5,"raw_grams":146.0,"raw_water_grams":91.96,"raw_fat_grams":22.79,"final_grams":146.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Fried Chicken Sandwich', quantity: 'custom (g)', foodWord: 'FRIEDCHICKENSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'chicken breast raw', quantity: '4¼ oz', section: 'chicken', ndbNo: '5062', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '¼ cup', section: 'chicken', ndbNo: '20581', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'large egg', quantity: '½ egg', section: 'chicken', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'whole milk', quantity: '1½ tbsp', section: 'chicken', ndbNo: '1077', portionDesc: 'g', portionGrams: 23.0 },
      { name: 'olive oil', quantity: '1 tbsp olive oil (absorbed into crust)', section: 'chicken', ndbNo: '4053', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'salt', quantity: '½ tsp', section: 'chicken', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '¼ tsp', section: 'chicken', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'garlic powder', quantity: '½ tsp', section: 'chicken', ndbNo: '2020', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'paprika', quantity: '½ tsp', section: 'chicken', ndbNo: '2028', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'assembly', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'iceberg lettuce', quantity: '25g', section: 'assembly', ndbNo: '11252', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'tomato raw', quantity: '30g sliced', section: 'assembly', ndbNo: '11529', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'dill pickle', quantity: '20g sliced', section: 'assembly', ndbNo: '11937', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'mayonnaise', quantity: '2 tbsp', section: 'assembly', ndbNo: '4025', portionDesc: 'g', portionGrams: 28.0 }
    ],
    recipeInstructions: [
      'In a shallow bowl, whisk together the egg and milk. In a separate bowl, combine the flour, salt, pepper, garlic powder, and paprika.',
      'Dip the chicken breast in the egg wash, letting the excess drip off, then dredge thoroughly in the seasoned flour.',
      'Heat ½ inch of olive oil to 350°F in a deep skillet. Fry the chicken for 5–6 minutes per side until golden brown and cooked through (internal temperature 165°F). Transfer to a rack to drain.',
      'Spread mayonnaise on both buns, then layer the lettuce, sliced tomato, and sliced pickles on the bottom bun.',
      'Place the fried chicken on top of the toppings, close with the top bun, and serve.',
      '(Oil in the ingredient list reflects only the amount absorbed into the crust.)',
      '1 serving (341g): 759 cal | 39.6g protein | 43.5g fat | 50.6g carbs | 3.1g fiber | 6.3g sugar | 200g water'
    ],
    sections: [
      { key: 'chicken', label: 'Fried chicken', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'assembly', label: 'Toppings & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_036',
    name: 'Buffalo Chicken Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 114,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":785.3,"pro":39.8,"fat":46.5,"carb":50.7,"fib":2.7,"h2o":184.8,"sug":6.5,"perServing":{"cal":785.3,"pro":39.8,"fat":46.5,"carb":50.7,"fib":2.7,"h2o":184.8,"sug":6.5,"AddedSugars":0.0,"IntrinsicSugars":6.5},"micros":{"vitaminA":57.14,"vitaminC":0.59,"vitaminD":9.9,"vitaminE":1.07,"vitaminK":16.98,"vitaminB6":0.27,"vitaminB12":0.2,"thiamin":0.16,"riboflavin":0.2,"niacin":3.84,"folate":33.23,"calcium":42.12,"iron":1.44,"magnesium":20.24,"phosphorus":145.74,"potassium":212.27,"sodium":611.17,"zinc":0.61,"copper":0.06,"selenium":18.11,"cholesterol":66.91,"saturatedFat":4.08,"monoFat":5.48,"polyFat":3.17,"omega3":0.31,"omega6":2.35},"gramsPerServing":329.2,"servings":1,"per100g":{"Energy_KCal":238.53,"Water":56.14,"Protein":12.09,"TotalLipidFat":14.12,"Carbohydrate":15.4,"FiberTotalDietary":0.83,"SugarsTotal":1.97,"Cholesterol":66.91,"FattyAcids_totalSaturated":4.08,"FattyAcids_totalMonounsaturated":5.48,"FattyAcids_totalPolyunsaturated":3.17,"LinoleicAcid":2.35,"alphaLinolenicAcid":0.31,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":57.14,"Retinol":42.58,"Carotene_beta":161.59,"VitaminD":9.9,"VitaminE_alphaTocopherol":1.07,"VitaminK_phylloquinone":16.98,"VitaminC_totalAscorbicAcid":0.59,"Thiamin":0.16,"Riboflavin":0.2,"Niacin":3.84,"PantothenicAcid":0.7,"VitaminB6":0.27,"Folate_total":33.23,"Folate_food":15.72,"Folate_DFE":45.52,"FolicAcid":21.05,"VitaminB12":0.2,"Choline_total":54.37,"Betaine":2.75,"LuteinZeaxanthin":91.55,"Lycopene":0.02,"Calcium_Ca":42.12,"Iron_Fe":1.44,"Magnesium_Mg":20.24,"Phosphorus_P":145.74,"Potassium_K":212.27,"Sodium_Na":611.17,"Zinc_Zn":0.61,"Copper_Cu":0.06,"Manganese_Mn":0.19,"Selenium_Se":18.11,"Tryptophan":0.13,"Threonine":0.45,"Isoleucine":0.51,"Leucine":0.86,"Lysine":0.91,"Methionine":0.27,"Cystine":0.11,"Phenylalanine":0.45,"Tyrosine":0.38,"Valine":0.55,"Arginine":0.69,"Histidine":0.36,"Alanine":0.58,"AsparticAcid":0.98,"GlutamicAcid":1.77,"Glycine":0.44,"Proline":0.45,"Serine":0.46,"omega3":0.31,"omega6":2.35,"AddedSugars":0.0,"IntrinsicSugars":1.97},"addedSugars":0.0,"intrinsicSugars":6.5,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"5062","name":"Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw","grams":120.0},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":30.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":25.0},{"ndb":"1077","name":"Milk, whole, 3.25% milkfat, with added vitamin D","grams":23.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":14.0},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.5},{"ndb":"2020","name":"Spices, garlic powder","grams":2.0},{"ndb":"2028","name":"Spices, paprika","grams":1.0},{"ndb":"6169","name":"Sauce, ready-to-serve, pepper, TABASCO","grams":30.0},{"ndb":"1001","name":"Butter, salted","grams":14.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"4639","name":"Salad dressing, ranch dressing, regular","grams":28.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":25.0}],"sections":[{"section_key":"chicken","section_label":"Fried chicken","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":11,"raw_grams":262.5,"raw_water_grams":162.65,"raw_fat_grams":32.31,"final_grams":233.22},{"section_key":"assembly","section_label":"Toppings & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":96.0,"raw_water_grams":51.47,"raw_fat_grams":14.19,"final_grams":96.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Buffalo Chicken Sandwich', quantity: 'custom (g)', foodWord: 'BUFFALOCHICKENSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'chicken breast raw', quantity: '4¼ oz', section: 'chicken', ndbNo: '5062', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '¼ cup', section: 'chicken', ndbNo: '20581', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'large egg', quantity: '½ egg', section: 'chicken', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'whole milk', quantity: '1½ tbsp', section: 'chicken', ndbNo: '1077', portionDesc: 'g', portionGrams: 23.0 },
      { name: 'olive oil', quantity: '1 tbsp olive oil (absorbed into crust)', section: 'chicken', ndbNo: '4053', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'salt', quantity: '½ tsp', section: 'chicken', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '¼ tsp', section: 'chicken', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'garlic powder', quantity: '½ tsp', section: 'chicken', ndbNo: '2020', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'paprika', quantity: '½ tsp', section: 'chicken', ndbNo: '2028', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'hot sauce', quantity: '2 tbsp', section: 'chicken', ndbNo: '6169', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'chicken', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'assembly', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'ranch dressing', quantity: '2 tbsp', section: 'assembly', ndbNo: '4639', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'iceberg lettuce', quantity: '25g', section: 'assembly', ndbNo: '11252', portionDesc: 'g', portionGrams: 25.0 }
    ],
    recipeInstructions: [
      'In a shallow bowl, whisk together the egg and milk. In a separate bowl, combine the flour, salt, pepper, garlic powder, and paprika.',
      'Dip the chicken breast in the egg wash, letting the excess drip off, then dredge thoroughly in the seasoned flour.',
      'Heat ½ inch of olive oil to 350°F in a deep skillet. Fry the chicken for 5–6 minutes per side until golden brown and cooked through (internal temperature 165°F). Transfer to a rack to drain.',
      'Melt the butter in a small saucepan over low heat. Stir in the hot sauce until combined. Toss the fried chicken in the buffalo sauce to coat.',
      'Spread ranch dressing on both buns, then place the lettuce on the bottom bun.',
      'Place the buffalo chicken on top of the lettuce, close with the top bun, and serve.',
      '(Oil in the ingredient list reflects only the amount absorbed into the crust.)',
      '1 serving (329g): 785 cal | 39.8g protein | 46.5g fat | 50.7g carbs | 2.7g fiber | 6.5g sugar | 185g water'
    ],
    sections: [
      { key: 'chicken', label: 'Fried chicken', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'assembly', label: 'Toppings & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_037',
    name: 'Nashville Hot Chicken Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'all',
    levelNum: 115,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '30 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":784.2,"pro":39.4,"fat":44.8,"carb":55.2,"fib":3.3,"h2o":146.8,"sug":10.0,"perServing":{"cal":784.2,"pro":39.4,"fat":44.8,"carb":55.2,"fib":3.3,"h2o":146.8,"sug":10.0,"AddedSugars":4.8,"IntrinsicSugars":5.2},"micros":{"vitaminA":72.13,"vitaminC":0.74,"vitaminD":11.24,"vitaminE":1.36,"vitaminK":13.86,"vitaminB6":0.31,"vitaminB12":0.21,"thiamin":0.18,"riboflavin":0.22,"niacin":4.36,"folate":35.98,"calcium":49.19,"iron":1.56,"magnesium":22.65,"phosphorus":147.0,"potassium":239.07,"sodium":625.5,"zinc":0.68,"copper":0.06,"selenium":20.15,"cholesterol":74.7,"saturatedFat":4.5,"monoFat":6.1,"polyFat":3.27,"omega3":0.29,"omega6":2.38},"gramsPerServing":293.3,"servings":1,"per100g":{"Energy_KCal":267.34,"Water":50.06,"Protein":13.44,"TotalLipidFat":15.28,"Carbohydrate":18.83,"FiberTotalDietary":1.11,"SugarsTotal":3.42,"Cholesterol":74.7,"FattyAcids_totalSaturated":4.5,"FattyAcids_totalMonounsaturated":6.1,"FattyAcids_totalPolyunsaturated":3.27,"LinoleicAcid":2.38,"alphaLinolenicAcid":0.29,"EPA_20_5n3":0.0,"DPA_22_5n3":0.0,"DHA_22_6n3":0.0,"VitaminA_RAE":72.13,"Retinol":47.33,"Carotene_beta":261.96,"VitaminD":11.24,"VitaminE_alphaTocopherol":1.36,"VitaminK_phylloquinone":13.86,"VitaminC_totalAscorbicAcid":0.74,"Thiamin":0.18,"Riboflavin":0.22,"Niacin":4.36,"PantothenicAcid":0.77,"VitaminB6":0.31,"Folate_total":35.98,"Folate_food":16.4,"Folate_DFE":49.69,"FolicAcid":23.52,"VitaminB12":0.21,"Choline_total":59.72,"Betaine":2.99,"LuteinZeaxanthin":166.43,"Lycopene":0.03,"Calcium_Ca":49.19,"Iron_Fe":1.56,"Magnesium_Mg":22.65,"Phosphorus_P":147.0,"Potassium_K":239.07,"Sodium_Na":625.5,"Zinc_Zn":0.68,"Copper_Cu":0.06,"Manganese_Mn":0.21,"Selenium_Se":20.15,"Tryptophan":0.15,"Threonine":0.5,"Isoleucine":0.57,"Leucine":0.97,"Lysine":1.02,"Methionine":0.3,"Cystine":0.12,"Phenylalanine":0.5,"Tyrosine":0.43,"Valine":0.62,"Arginine":0.77,"Histidine":0.4,"Alanine":0.65,"AsparticAcid":1.08,"GlutamicAcid":1.98,"Glycine":0.49,"Proline":0.51,"Serine":0.51,"omega3":0.29,"omega6":2.38,"AddedSugars":1.65,"IntrinsicSugars":1.77},"addedSugars":4.8,"intrinsicSugars":5.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.82,"yieldFactorFat":1.0,"sources":[{"ndb":"5062","name":"Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw","grams":120.0},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":30.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":25.0},{"ndb":"1230","name":"Milk, buttermilk, fluid, whole","grams":23.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":14.0},{"ndb":"2047","name":"Salt, table","grams":3.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.5},{"ndb":"2020","name":"Spices, garlic powder","grams":2.0},{"ndb":"2028","name":"Spices, paprika","grams":1.0},{"ndb":"1001","name":"Butter, salted","grams":14.0},{"ndb":"2031","name":"Spices, pepper, red or cayenne","grams":3.0},{"ndb":"19334","name":"Sugars, brown","grams":5.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"11937","name":"Pickles, cucumber, dill or kosher dill","grams":20.0},{"ndb":"4025","name":"Salad dressing, mayonnaise, regular","grams":14.0}],"sections":[{"section_key":"chicken","section_label":"Fried chicken","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.82,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":12,"raw_grams":240.5,"raw_water_grams":134.35,"raw_fat_grams":32.61,"final_grams":216.32},{"section_key":"assembly","section_label":"Toppings & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":77.0,"raw_water_grams":36.67,"raw_fat_grams":12.22,"final_grams":77.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Nashville Hot Chicken Sandwich', quantity: 'custom (g)', foodWord: 'NASHVILLEHOTCHICKENSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'chicken breast raw', quantity: '4¼ oz', section: 'chicken', ndbNo: '5062', portionDesc: 'g', portionGrams: 120.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '¼ cup', section: 'chicken', ndbNo: '20581', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'large egg', quantity: '½ egg', section: 'chicken', ndbNo: '1123', portionDesc: 'g', portionGrams: 25.0 },
      { name: 'whole buttermilk', quantity: '1½ tbsp', section: 'chicken', ndbNo: '1230', portionDesc: 'g', portionGrams: 23.0 },
      { name: 'olive oil', quantity: '1 tbsp olive oil (absorbed into crust)', section: 'chicken', ndbNo: '4053', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'salt', quantity: '½ tsp', section: 'chicken', ndbNo: '2047', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'ground black pepper', quantity: '¼ tsp', section: 'chicken', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.5 },
      { name: 'garlic powder', quantity: '½ tsp', section: 'chicken', ndbNo: '2020', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'paprika', quantity: '½ tsp', section: 'chicken', ndbNo: '2028', portionDesc: 'g', portionGrams: 1.0 },
      { name: 'salted butter', quantity: '1 tbsp', section: 'chicken', ndbNo: '1001', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'red pepper flakes', quantity: '1 tsp cayenne', section: 'chicken', ndbNo: '2031', portionDesc: 'g', portionGrams: 3.0 },
      { name: 'brown sugar', quantity: '1 tsp', section: 'chicken', ndbNo: '19334', portionDesc: 'g', portionGrams: 5.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'assembly', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'dill pickle', quantity: '20g sliced', section: 'assembly', ndbNo: '11937', portionDesc: 'g', portionGrams: 20.0 },
      { name: 'mayonnaise', quantity: '1 tbsp', section: 'assembly', ndbNo: '4025', portionDesc: 'g', portionGrams: 14.0 }
    ],
    recipeInstructions: [
      'In a shallow bowl, whisk together the egg and buttermilk. In a separate bowl, combine the flour, salt, pepper, garlic powder, and paprika.',
      'Dip the chicken breast in the egg wash, letting the excess drip off, then dredge thoroughly in the seasoned flour.',
      'Heat ½ inch of olive oil to 350°F in a deep skillet. Fry the chicken for 5–6 minutes per side until golden brown and cooked through (internal temperature 165°F). Transfer to a rack to drain.',
      'Melt the butter in a small saucepan over low heat. Stir in the cayenne pepper and brown sugar until a smooth paste forms. Brush the hot paste over the fried chicken while still warm.',
      'Spread mayonnaise on both buns. Place the sliced pickles on the bottom bun.',
      'Place the Nashville hot chicken on top of the pickles, close with the top bun, and serve.',
      '(Oil in the ingredient list reflects only the amount absorbed into the crust.)',
      '1 serving (293g): 784 cal | 39.4g protein | 44.8g fat | 55.2g carbs | 3.3g fiber | 10.0g sugar | 147g water'
    ],
    sections: [
      { key: 'chicken', label: 'Fried chicken', cookingMethod: '', yieldFactorWater: 0.82 },
      { key: 'assembly', label: 'Toppings & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  },
  {
    id: 'SAND_038',
    name: 'Fish Sandwich',
    category: 'sandwiches & burgers',
    dietaryCategory: 'pesca',
    levelNum: 116,
    recipe: ['bread'],
    tools: [
      { type: 'wall', count: 6, emoji: '🧱' },
      { type: 'fence', count: 2, emoji: '🚧' },
      { type: 'scarecrow', count: 1, emoji: '🧹' }
    ],
    animalSpawns: [
      { type: 'mouse', delay: 3500 }
    ],
    foodSupply: { lettuce: 0, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 5, apple: 0, grapes: 0, bacon: 0, butter: 0, chicken: 0, fish: 0 },
    servings: '1 serving',
    prepTime: '25 min',
    linkType: 'dish',
    sr28Rule: 'Rule D',
    nutritionJson: {"cal":640.5,"pro":35.4,"fat":27.1,"carb":62.4,"fib":4.0,"h2o":168.3,"sug":5.2,"perServing":{"cal":640.5,"pro":35.4,"fat":27.1,"carb":62.4,"fib":4.0,"h2o":168.3,"sug":5.2,"AddedSugars":0.0,"IntrinsicSugars":5.2},"micros":{"vitaminA":33.0,"vitaminC":0.79,"vitaminD":26.22,"vitaminE":1.07,"vitaminK":9.94,"vitaminB6":0.14,"vitaminB12":0.45,"thiamin":0.17,"riboflavin":0.17,"niacin":1.79,"folate":33.02,"calcium":42.49,"iron":1.64,"magnesium":33.1,"phosphorus":160.38,"potassium":257.36,"sodium":443.12,"zinc":0.75,"copper":0.07,"selenium":25.15,"cholesterol":79.36,"saturatedFat":1.72,"monoFat":4.62,"polyFat":1.93,"omega3":0.07,"omega6":0.43},"gramsPerServing":298.1,"servings":1,"per100g":{"Energy_KCal":214.88,"Water":56.45,"Protein":11.88,"TotalLipidFat":9.11,"Carbohydrate":20.94,"FiberTotalDietary":1.35,"SugarsTotal":1.75,"Cholesterol":79.36,"FattyAcids_totalSaturated":1.72,"FattyAcids_totalMonounsaturated":4.62,"FattyAcids_totalPolyunsaturated":1.93,"LinoleicAcid":0.43,"alphaLinolenicAcid":0.03,"EPA_20_5n3":0.01,"DPA_22_5n3":0.0,"DHA_22_6n3":0.03,"VitaminA_RAE":33.0,"Retinol":29.58,"Carotene_beta":36.47,"VitaminD":26.22,"VitaminE_alphaTocopherol":1.07,"VitaminK_phylloquinone":9.94,"VitaminC_totalAscorbicAcid":0.79,"Thiamin":0.17,"Riboflavin":0.17,"Niacin":1.79,"PantothenicAcid":0.4,"VitaminB6":0.14,"Folate_total":33.02,"Folate_food":19.56,"Folate_DFE":42.43,"FolicAcid":15.4,"VitaminB12":0.45,"Choline_total":72.32,"Betaine":1.28,"LuteinZeaxanthin":171.92,"Lycopene":0.02,"Calcium_Ca":42.49,"Iron_Fe":1.64,"Magnesium_Mg":33.1,"Phosphorus_P":160.38,"Potassium_K":257.36,"Sodium_Na":443.12,"Zinc_Zn":0.75,"Copper_Cu":0.07,"Manganese_Mn":0.2,"Selenium_Se":25.15,"Tryptophan":0.11,"Threonine":0.44,"Isoleucine":0.47,"Leucine":0.87,"Lysine":0.81,"Methionine":0.29,"Cystine":0.12,"Phenylalanine":0.45,"Tyrosine":0.36,"Valine":0.56,"Arginine":0.62,"Histidine":0.29,"Alanine":0.61,"AsparticAcid":1.01,"GlutamicAcid":1.65,"Glycine":0.45,"Proline":0.47,"Serine":0.5,"omega3":0.07,"omega6":0.43,"AddedSugars":0.0,"IntrinsicSugars":1.75},"addedSugars":0.0,"intrinsicSugars":5.2,"isAddedSugarsEstimated":false,"addedSugarsBasis":"v3-classifier","nutrientVersion":"v3","retentionModelVersion":"v3-r6","sourceMatchVersion":"v3-greenfield","sourceNdbNo":"","sourceLongDesc":"","mergeBasis":"v3-build","yieldFactorWater":0.85,"yieldFactorFat":1.0,"sources":[{"ndb":"15015","name":"Fish, cod, Atlantic, raw","grams":113.0},{"ndb":"20581","name":"Wheat flour, white, all-purpose, enriched, unbleached","grams":15.0},{"ndb":"1123","name":"Egg, whole, raw, fresh","grams":50.0},{"ndb":"20020","name":"Cornmeal, whole-grain, yellow","grams":30.0},{"ndb":"4053","name":"Oil, olive, salad or cooking","grams":14.0},{"ndb":"2047","name":"Salt, table","grams":2.0},{"ndb":"2030","name":"Spices, pepper, black","grams":0.3},{"ndb":"2020","name":"Spices, garlic powder","grams":2.0},{"ndb":"18350","name":"Rolls, hamburger or hotdog, plain","grams":43.0},{"ndb":"27049","name":"Sauce, tartar, ready-to-serve","grams":28.0},{"ndb":"11252","name":"Lettuce, iceberg (includes crisphead types), raw","grams":21.0}],"sections":[{"section_key":"fish","section_label":"Fried cod","prep_method":"raw","cook_method":"fried","cooking_method":"fried","cooking_method_normalized":"fried","yield_factor_water":0.85,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":8,"raw_grams":226.3,"raw_water_grams":134.89,"raw_fat_grams":20.76,"final_grams":206.07},{"section_key":"assembly","section_label":"Toppings & bun","prep_method":"raw","cook_method":"raw","cooking_method":"raw","cooking_method_normalized":"raw","yield_factor_water":1.0,"yield_factor_fat":1.0,"yield_factor_other":1.0,"ingredient_count":3,"raw_grams":92.0,"raw_water_grams":53.61,"raw_fat_grams":6.39,"final_grams":92.0}],"cookingMethod":"multi"},
    recipeIngredients: [
      { name: 'Fish Sandwich', quantity: 'custom (g)', foodWord: 'FISHSANDWICH', portionDesc: 'custom (g)', portionGrams: 100.0, isDish: true },
      { name: 'cod fillet', quantity: '4 oz', section: 'fish', ndbNo: '15015', portionDesc: 'g', portionGrams: 113.0 },
      { name: 'all-purpose enriched unbleached white flour', quantity: '2 tbsp', section: 'fish', ndbNo: '20581', portionDesc: 'g', portionGrams: 15.0 },
      { name: 'large egg', quantity: '1 egg', section: 'fish', ndbNo: '1123', portionDesc: 'g', portionGrams: 50.0 },
      { name: 'cornmeal', quantity: '¼ cup', section: 'fish', ndbNo: '20020', portionDesc: 'g', portionGrams: 30.0 },
      { name: 'olive oil', quantity: '1 tbsp olive oil (absorbed into crust)', section: 'fish', ndbNo: '4053', portionDesc: 'g', portionGrams: 14.0 },
      { name: 'salt', quantity: '½ tsp', section: 'fish', ndbNo: '2047', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'ground black pepper', quantity: '¼ tsp', section: 'fish', ndbNo: '2030', portionDesc: 'g', portionGrams: 0.3 },
      { name: 'garlic powder', quantity: '½ tsp', section: 'fish', ndbNo: '2020', portionDesc: 'g', portionGrams: 2.0 },
      { name: 'hamburger bun', quantity: '1 bun', section: 'assembly', ndbNo: '18350', portionDesc: 'g', portionGrams: 43.0 },
      { name: 'tartar sauce', quantity: '2 tbsp', section: 'assembly', ndbNo: '27049', portionDesc: 'g', portionGrams: 28.0 },
      { name: 'iceberg lettuce', quantity: '1 leaf', section: 'assembly', ndbNo: '11252', portionDesc: 'g', portionGrams: 21.0 }
    ],
    recipeInstructions: [
      'Pat the cod fillet dry. In a shallow bowl, combine the cornmeal, salt, pepper, and garlic powder. In a second bowl, whisk the egg with 1 tablespoon of water until frothy. Place flour in a third bowl.',
      'Dredge the cod in flour, dip into the egg mixture, then coat in the seasoned cornmeal. Place on a rack until ready to fry.',
      'Heat ½ inch of olive oil to 350°F in a skillet. Fry the cod for 3–4 minutes per side until golden and the fish flakes easily. Transfer to a rack to drain.',
      'Spread tartar sauce on both halves of the bun.',
      'Place the lettuce on the bottom bun, top with the fried cod fillet, close with the top bun, and serve.',
      '(Oil in the ingredient list reflects only the amount absorbed into the crust.)',
      '1 serving (298g): 641 cal | 35.4g protein | 27.1g fat | 62.4g carbs | 4.0g fiber | 5.2g sugar | 168g water'
    ],
    sections: [
      { key: 'fish', label: 'Fried cod', cookingMethod: '', yieldFactorWater: 0.85 },
      { key: 'assembly', label: 'Toppings & bun', cookingMethod: '', yieldFactorWater: 1.0 }
    ],
  }
];
