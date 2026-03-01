// Food data for Matching Containers game
// Based on canonical food-words.json with container/meal associations
// Each food has valid containers and valid meal categories

import type { Container } from '$lib/stores/gameStore';

export type MealCategory = 'breakfast' | 'snack' | 'lunch' | 'beverage' | 'dinner';

export interface MatchingFood {
  word: string;
  display: string;
  containers: Container[];
  meals: MealCategory[];
}

// Foods organized for the matching game
// Container logic:
//   Cup (☕) = Hot drinks, water, any drink you'd sip (mugs, paper cups)
//   Glass (🥛) = Cold drinks with ice, juice, milk, soda, cocktails
//   Bowl (🥣) = Soups, cereals, salads, loose items, desserts
//   Plate (🍽️) = Main meals, solid foods, entrees
//   Saucer (⚪) = Small pastries, sides, finger foods, snacks
//
// Word spellings match food-words.json canonical list

export const MATCHING_FOODS: MatchingFood[] = [
  // === HOT BEVERAGES - Cup only ===
  { word: 'TEA', display: 'Hot Tea', containers: ['cup'], meals: ['beverage'] },
  { word: 'LATTE', display: 'Latte', containers: ['cup'], meals: ['beverage'] },
  { word: 'CAPPUCCINO', display: 'Cappuccino', containers: ['cup'], meals: ['beverage'] },
  { word: 'CIDER', display: 'Hot Cider', containers: ['cup'], meals: ['beverage'] },
  { word: 'MOCHA', display: 'Mocha', containers: ['cup'], meals: ['beverage'] },
  
  // === WATER - Cup (you drink water from a cup/mug) ===
  { word: 'WATER', display: 'Water', containers: ['glass'], meals: ['beverage'] },
  
  // === COLD BEVERAGES - Glass (served in a glass cold) ===
  { word: 'MILK', display: 'Milk', containers: ['glass'], meals: ['beverage'] },
  { word: 'SMOOTHIE', display: 'Smoothie', containers: ['glass'], meals: ['beverage'] },
  { word: 'SHAKE', display: 'Milkshake', containers: ['glass'], meals: ['beverage'] },
  { word: 'PUNCH', display: 'Punch', containers: ['glass'], meals: ['beverage'] },
  { word: 'SOYMILK', display: 'Soy Milk', containers: ['glass'], meals: ['beverage'] },
  { word: 'EGGNOG', display: 'Eggnog', containers: ['glass'], meals: ['beverage'] },
  
  // === SOUPS - Bowl (or cup for small servings) ===
  { word: 'SOUP', display: 'Soup', containers: ['bowl', 'cup'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'CHILI', display: 'Chili', containers: ['bowl', 'cup'], meals: ['lunch', 'dinner'] },
  { word: 'RAMEN', display: 'Ramen', containers: ['bowl', 'cup'], meals: ['lunch', 'dinner'] },
  { word: 'BROTH', display: 'Broth', containers: ['bowl', 'cup'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'GUMBO', display: 'Gumbo', containers: ['bowl', 'cup'], meals: ['lunch', 'dinner'] },
  { word: 'CHOWDER', display: 'Chowder', containers: ['bowl', 'cup'], meals: ['lunch', 'dinner'] },
  { word: 'BISQUE', display: 'Bisque', containers: ['bowl', 'cup'], meals: ['lunch', 'dinner'] },
  { word: 'GAZPACHO', display: 'Gazpacho', containers: ['bowl', 'cup'], meals: ['lunch', 'dinner'] },
  
  // === CEREALS & BREAKFAST BOWLS - Bowl ===
  { word: 'CEREAL', display: 'Cereal', containers: ['bowl'], meals: ['breakfast'] },
  { word: 'OATMEAL', display: 'Oatmeal', containers: ['bowl'], meals: ['breakfast'] },
  { word: 'GRANOLA', display: 'Granola', containers: ['bowl'], meals: ['breakfast'] },
  { word: 'YOGURT', display: 'Yogurt', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'GRITS', display: 'Grits', containers: ['bowl'], meals: ['breakfast'] },
  { word: 'MUESLI', display: 'Muesli', containers: ['bowl'], meals: ['breakfast'] },
  
  // === MAIN MEALS - Plate ===
  { word: 'EGG', display: 'Egg', containers: ['plate'], meals: ['breakfast'] },
  { word: 'BACON', display: 'Bacon', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'SAUSAGE', display: 'Sausage', containers: ['saucer', 'plate'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'PANCAKE', display: 'Pancake', containers: ['plate'], meals: ['breakfast'] },
  { word: 'WAFFLE', display: 'Waffle', containers: ['plate'], meals: ['breakfast'] },
  { word: 'OMELET', display: 'Omelet', containers: ['plate'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'HASHBROWN', display: 'Hash Brown', containers: ['saucer'], meals: ['breakfast'] },
  { word: 'STEAK', display: 'Steak', containers: ['plate'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'CHICKEN', display: 'Chicken', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'SALMON', display: 'Salmon', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'TUNA', display: 'Tuna', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'TILAPIA', display: 'Tilapia', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'COD', display: 'Cod', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'TROUT', display: 'Trout', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'PORKCHOP', display: 'Pork Chop', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'MEATLOAF', display: 'Meatloaf', containers: ['plate'], meals: ['lunch','dinner'] },
  { word: 'PIZZA', display: 'Pizza', containers: ['plate'], meals: ['lunch', 'dinner', 'snack'] },
  { word: 'HAMBURGER', display: 'Hamburger', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'HOTDOG', display: 'Hot Dog', containers: ['plate'], meals: ['lunch', 'snack', 'dinner'] },
  { word: 'SANDWICH', display: 'Sandwich', containers: ['plate'], meals: ['lunch', 'snack', 'dinner'] },
  { word: 'TACO', display: 'Taco', containers: ['plate'], meals: ['lunch', 'dinner', 'snack', 'breakfast'] },
  { word: 'BURRITO', display: 'Burrito', containers: ['plate'], meals: ['lunch', 'dinner', 'snack', 'breakfast'] },
  { word: 'LASAGNA', display: 'Lasagna', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'TURKEY', display: 'Turkey', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'DUCK', display: 'Duck', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'LAMB', display: 'Lamb', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'SHRIMP', display: 'Shrimp', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'LOBSTER', display: 'Lobster', containers: ['plate'], meals: ['dinner'] },
  { word: 'CRAB', display: 'Crab', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'FALAFEL', display: 'Falafel', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'GYRO', display: 'Gyro', containers: ['plate'], meals: ['lunch', 'dinner', 'snack'] },
  { word: 'QUICHE', display: 'Quiche', containers: ['plate'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'FRITTATA', display: 'Frittata', containers: ['plate'], meals: ['breakfast', 'lunch', 'dinner'] },
  
  // === PASTA & NOODLES - Plate or Bowl ===
  { word: 'SPAGHETTI', display: 'Spaghetti', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'PASTA', display: 'Pasta', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'MACARONI', display: 'Mac & Cheese', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'RAVIOLI', display: 'Ravioli', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'LINGUINE', display: 'Linguine', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'GNOCCHI', display: 'Gnocchi', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'DUMPLING', display: 'Dumpling', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'MEATBALL', display: 'Meatball', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  
  // === SALADS - Bowl (or plate for large salads) ===
  { word: 'CAESARSALAD', display: 'Caesar Salad', containers: ['plate', 'bowl', 'saucer'], meals: ['lunch', 'dinner'] },
  { word: 'COLESLAW', display: 'Coleslaw', containers: ['plate', 'bowl', 'saucer'], meals: ['lunch', 'dinner'] },
  
  // === RICE & GRAINS - Bowl or Plate ===
  { word: 'RICE', display: 'Rice', containers: ['bowl', 'plate', 'saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'QUINOA', display: 'Quinoa', containers: ['bowl'], meals: ['breakfast'] },
  { word: 'COUSCOUS', display: 'Couscous', containers: ['bowl', 'plate'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'POLENTA', display: 'Polenta', containers: ['bowl', 'plate', 'saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'BULGUR', display: 'Bulgur', containers: ['bowl'], meals: ['lunch', 'breakfast', 'dinner'] },
  
  // === ASIAN DISHES - Plate or Bowl ===
  { word: 'SUSHI', display: 'Sushi', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'TEMPURA', display: 'Tempura', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'TERIYAKI', display: 'Teriyaki', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'POKE', display: 'Poke', containers: ['bowl', 'plate'], meals: ['lunch', 'dinner'] },
  { word: 'EDAMAME', display: 'Edamame', containers: ['bowl', 'saucer'], meals: ['snack', 'lunch', 'dinner'] },
  { word: 'TOFU', display: 'Tofu', containers: ['plate', 'saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  
  // === SMALL PASTRIES & BAKED GOODS - Saucer ===
  { word: 'TOAST', display: 'Toast', containers: ['saucer'], meals: ['breakfast'] },
  { word: 'ROLL', display: 'Roll', containers: ['saucer'], meals: ['dinner', 'lunch', 'breakfast'] },
  { word: 'BISCUIT', display: 'Biscuit', containers: ['saucer'], meals: ['breakfast', 'lunch','dinner'] },
  { word: 'MUFFIN', display: 'Muffin', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'COOKIE', display: 'Cookie', containers: ['saucer'], meals: ['snack'] },
  { word: 'DOUGHNUT', display: 'Doughnut', containers: ['saucer'], meals: ['breakfast', 'snack'] },
  { word: 'CROISSANT', display: 'Croissant', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'BROWNIE', display: 'Brownie', containers: ['saucer'], meals: ['snack'] },
  { word: 'CUPCAKE', display: 'Cupcake', containers: ['saucer'], meals: ['snack'] },
  { word: 'BAGEL', display: 'Bagel', containers: ['saucer'], meals: ['breakfast', 'snack'] },
  { word: 'CORNBREAD', display: 'Cornbread', containers: ['saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'BAGUETTE', display: 'Baguette', containers: ['saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'BRIOCHE', display: 'Brioche', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'PITA', display: 'Pita', containers: ['saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'NAAN', display: 'Naan', containers: ['saucer'], meals: ['lunch', 'dinner', 'breakfast'] },
  { word: 'TORTILLA', display: 'Tortilla', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  
  // === DESSERTS - Bowl or Saucer ===
  { word: 'ICECREAM', display: 'Ice Cream', containers: ['bowl'], meals: ['snack'] },
  { word: 'PUDDING', display: 'Pudding', containers: ['bowl'], meals: ['lunch', 'dinner'] },
  { word: 'CAKE', display: 'Cake', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'PIE', display: 'Pie', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'CUSTARD', display: 'Custard', containers: ['bowl'], meals: ['lunch', 'dinner'] },
  { word: 'SUNDAE', display: 'Sundae', containers: ['bowl'], meals: ['snack'] },
  { word: 'SHERBET', display: 'Sherbet', containers: ['bowl'], meals: ['snack'] },
  { word: 'MOUSSE', display: 'Mousse', containers: ['bowl'], meals: ['lunch', 'dinner'] },
  { word: 'FLAN', display: 'Flan', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'TART', display: 'Tart', containers: ['saucer'], meals: ['snack', 'breakfast'] },
  { word: 'COBBLER', display: 'Cobbler', containers: ['bowl', 'saucer'], meals: ['lunch', 'dinner'] },
  
  // === FRUITS - Saucer (whole) or Bowl (cut/multiple) ===
  { word: 'APPLE', display: 'Apple', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'BANANA', display: 'Banana', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'ORANGE', display: 'Orange', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'GRAPE', display: 'Grapes', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'STRAWBERRY', display: 'Strawberry', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'BLUEBERRY', display: 'Blueberry', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'RASPBERRY', display: 'Raspberry', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'BLACKBERRY', display: 'Blackberry', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'WATERMELON', display: 'Watermelon', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'MANGO', display: 'Mango', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'PINEAPPLE', display: 'Pineapple', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'PEACH', display: 'Peach', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'PEAR', display: 'Pear', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'KIWI', display: 'Kiwi', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'CANTALOUPE', display: 'Cantaloupe', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'HONEYDEW', display: 'Honeydew', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'PAPAYA', display: 'Papaya', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  { word: 'GRAPEFRUIT', display: 'Grapefruit', containers: ['bowl', 'saucer'], meals: ['breakfast', 'snack'] },
  
  // === SNACKS - Bowl or Saucer ===
  { word: 'POTATOCHIP', display: 'Chips', containers: ['bowl'], meals: ['snack', 'lunch', 'dinner'] },
  { word: 'POPCORN', display: 'Popcorn', containers: ['bowl'], meals: ['snack'] },
  { word: 'CASHEW', display: 'Cashews', containers: ['bowl'], meals: ['snack'] },
  { word: 'ALMOND', display: 'Almonds', containers: ['bowl'], meals: ['snack'] },
  { word: 'PEANUT', display: 'Peanuts', containers: ['bowl'], meals: ['snack'] },
  { word: 'WALNUT', display: 'Walnuts', containers: ['bowl'], meals: ['snack'] },
  { word: 'PISTACHIO', display: 'Pistachios', containers: ['bowl'], meals: ['snack'] },
  { word: 'CRACKER', display: 'Crackers', containers: ['saucer'], meals: ['snack'] },
  { word: 'PRETZEL', display: 'Pretzels', containers: ['bowl', 'saucer'], meals: ['snack'] },
  { word: 'TRAILMIX', display: 'Trail Mix', containers: ['bowl'], meals: ['snack'] },
  { word: 'NACHO', display: 'Nachos', containers: ['plate'], meals: ['snack', 'lunch', 'dinner'] },
  { word: 'HUMMUS', display: 'Hummus', containers: ['bowl'], meals: ['snack', 'lunch', 'dinner'] },
  { word: 'GUACAMOLE', display: 'Guacamole', containers: ['bowl'], meals: ['snack', 'lunch', 'dinner'] },
  { word: 'SALSA', display: 'Salsa', containers: ['bowl'], meals: ['snack', 'lunch', 'dinner'] },
  
  // === CHEESE - Saucer or Plate ===
  { word: 'CHEESE', display: 'Cheese', containers: ['saucer'], meals: ['snack', 'lunch', 'dinner', 'breakfast'] },
  { word: 'BRIE', display: 'Brie', containers: ['saucer'], meals: ['snack', 'lunch', 'dinner', 'breakfast'] },
  { word: 'CHEDDAR', display: 'Cheddar', containers: ['saucer'], meals: ['snack', 'lunch', 'dinner', 'breakfast'] },
  { word: 'MOZZARELLA', display: 'Mozzarella', containers: ['saucer'], meals: ['lunch', 'dinner', 'snack', 'breakfast'] },
  
  // === MORE BEVERAGES ===
  { word: 'COFFEE', display: 'Coffee', containers: ['cup'], meals: ['beverage'] },
  { word: 'JUICE', display: 'Juice', containers: ['glass'], meals: ['beverage'] },
  { word: 'LEMONADE', display: 'Lemonade', containers: ['glass'], meals: ['beverage'] },
  { word: 'LIMEADE', display: 'Limeade', containers: ['glass'], meals: ['beverage'] },
  { word: 'ICETEA', display: 'Iced Tea', containers: ['glass'], meals: ['beverage'] },
  { word: 'COLA', display: 'Cola', containers: ['glass'], meals: ['beverage'] },
  { word: 'KEFIR', display: 'Kefir', containers: ['glass'], meals: ['beverage'] },
  
  // === VEGETABLES ===
  { word: 'BROCCOLI', display: 'Broccoli', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'CAULIFLOWER', display: 'Cauliflower', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'CARROT', display: 'Carrot', containers: ['saucer'], meals: ['lunch', 'dinner', 'snack'] },
  { word: 'CELERY', display: 'Celery', containers: ['saucer'], meals: ['snack', 'lunch', 'dinner'] },
  { word: 'CORN', display: 'Corn', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'SPINACH', display: 'Spinach', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'LETTUCE', display: 'Lettuce', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'CABBAGE', display: 'Cabbage', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'ASPARAGUS', display: 'Asparagus', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'POTATO', display: 'Potato', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'SWEETPOTATO', display: 'Sweet Potato', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'ONION', display: 'Onion', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'TOMATO', display: 'Tomato', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'ZUCCHINI', display: 'Zucchini', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'SQUASH', display: 'Squash', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'MUSHROOM', display: 'Mushroom', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'PEPPER', display: 'Pepper', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'CUCUMBER', display: 'Cucumber', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'PEAS', display: 'Peas', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'KALE', display: 'Kale', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'BEET', display: 'Beet', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  
  // === MORE FRUITS ===
  { word: 'CHERRY', display: 'Cherry', containers: ['bowl'], meals: ['snack', 'breakfast'] },
  { word: 'PLUM', display: 'Plum', containers: ['bowl'], meals: ['snack', 'breakfast'] },
  { word: 'APRICOT', display: 'Apricot', containers: ['bowl'], meals: ['snack', 'breakfast'] },

  { word: 'FIG', display: 'Fig', containers: ['bowl'], meals: ['snack', 'breakfast'] },
  { word: 'POMEGRANATE', display: 'Pomegranate', containers: ['bowl'], meals: ['snack', 'breakfast'] },
  { word: 'COCONUT', display: 'Coconut', containers: ['bowl'], meals: ['snack', 'breakfast'] },
  { word: 'AVOCADO', display: 'Avocado', containers: ['plate'], meals: ['breakfast', 'lunch'] },
  { word: 'DATE', display: 'Date', containers: ['bowl'], meals: ['snack', 'breakfast'] },
  { word: 'CRANBERRY', display: 'Cranberry', containers: ['bowl'], meals: ['breakfast', 'snack'] },
  
  // === MORE PROTEINS ===
  { word: 'BEEF', display: 'Beef', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'PORK', display: 'Pork', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'HAM', display: 'Ham', containers: ['plate'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'SCALLOP', display: 'Scallop', containers: ['plate'], meals: ['dinner', 'dinner'] },
  { word: 'CLAM', display: 'Clam', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'MUSSEL', display: 'Mussel', containers: ['plate', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'OYSTER', display: 'Oyster', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'SARDINE', display: 'Sardine', containers: ['plate'], meals: ['lunch', 'snack', 'dinner'] },
  { word: 'HALIBUT', display: 'Halibut', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'ANCHOVY', display: 'Anchovy', containers: ['plate'], meals: ['lunch', 'dinner'] },
  
  // === MORE PREPARED FOODS ===
  { word: 'BREAD', display: 'Bread', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'FRENCHTOAST', display: 'French Toast', containers: ['plate', 'saucer'], meals: ['breakfast'] },
  { word: 'EGGROLL', display: 'Egg Roll', containers: ['plate', 'saucer'], meals: ['lunch', 'dinner'] },
  { word: 'WONTON', display: 'Wonton', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'TAMALES', display: 'Tamales', containers: ['plate'], meals: ['lunch', 'dinner'] },
  { word: 'CHEESECAKE', display: 'Cheesecake', containers: ['saucer'], meals: ['lunch', 'dinner'] },
  { word: 'ECLAIR', display: 'Eclair', containers: ['saucer'], meals: ['snack'] },
  { word: 'STRUDEL', display: 'Strudel', containers: ['saucer'], meals: ['breakfast'] },
  { word: 'TURNOVER', display: 'Turnover', containers: ['saucer'], meals: ['breakfast'] },
  
  // === LEGUMES & BEANS ===
  { word: 'LENTIL', display: 'Lentil', containers: ['saucer', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'CHICKPEA', display: 'Chickpea', containers: ['saucer', 'bowl'], meals: ['lunch', 'dinner'] },
  { word: 'BLACKBEAN', display: 'Black Bean', containers: ['saucer', 'bowl'], meals: ['lunch', 'dinner'] },
  
  // === MORE DAIRY ===
  { word: 'BUTTER', display: 'Butter', containers: ['saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  { word: 'CREAM', display: 'Cream', containers: ['cup'], meals: ['beverage', 'breakfast', 'lunch', 'dinner'] },
  { word: 'COTTAGE', display: 'Cottage Cheese', containers: ['bowl', 'saucer'], meals: ['breakfast', 'snack', 'lunch', 'dinner'] },
  { word: 'RICOTTA', display: 'Ricotta', containers: ['bowl', 'saucer'], meals: ['breakfast', 'lunch', 'dinner'] },
  
  // === MORE NUTS ===
  { word: 'PECAN', display: 'Pecan', containers: ['bowl'], meals: ['snack'] },
  { word: 'MACADAMIA', display: 'Macadamia', containers: ['bowl'], meals: ['snack'] },
  { word: 'HAZELNUT', display: 'Hazelnut', containers: ['bowl'], meals: ['snack'] },
];

// Get a random food for the game (avoids repeating the last few foods)
// History is persisted to localStorage to survive page refreshes
const RECENT_HISTORY = 50;  // Don't repeat any of the last 50 foods
const STORAGE_KEY = 'matching-recent-foods';

function loadRecentFoods(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRecentFoods(foods: string[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
  } catch {
    // Ignore storage errors
  }
}

let recentFoods: string[] = loadRecentFoods();

export function getRandomFood(): MatchingFood {
  // Reload from storage in case another tab/refresh occurred
  recentFoods = loadRecentFoods();
  
  let food: MatchingFood;
  let attempts = 0;
  
  do {
    const index = Math.floor(Math.random() * MATCHING_FOODS.length);
    food = MATCHING_FOODS[index];
    attempts++;
  } while (recentFoods.includes(food.word) && attempts < 100);
  
  // Track this food in recent history
  recentFoods.push(food.word);
  if (recentFoods.length > RECENT_HISTORY) {
    recentFoods.shift();
  }
  
  // Persist to localStorage
  saveRecentFoods(recentFoods);
  
  return food;
}

// Reset recent history (only called for debugging, not on game start)
export function resetFoodHistory(): void {
  recentFoods = [];
  saveRecentFoods(recentFoods);
}

// Check if a container can catch this food
export function canCatch(food: MatchingFood, container: Container): boolean {
  return food.containers.includes(container);
}

// Check if a meal category is valid for this food
export function isValidMeal(food: MatchingFood, meal: MealCategory): boolean {
  return food.meals.includes(meal);
}

// Get container emoji
export function getContainerEmoji(container: Container): string {
  const emojis: Record<Container, string> = {
    plate: '🍽️',
    bowl: '🥣',
    cup: '☕',
    glass: '🥛',
    saucer: '⚪'
  };
  return emojis[container];
}

// Get meal display name
export function getMealDisplay(meal: MealCategory): string {
  const names: Record<MealCategory, string> = {
    breakfast: 'Bkfst',
    snack: 'Snack',
    lunch: 'Lunch',
    beverage: 'Bev',
    dinner: 'Dinner'
  };
  return names[meal];
}
