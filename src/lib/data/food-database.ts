// Food database with groups for Daily Plate game
// Groups: vegetable, fruit, grain, protein, dairy, legume, nuts, fats, spice, prepared, beverage

export type FoodGroup = 
  | 'vegetable' 
  | 'fruit' 
  | 'grain' 
  | 'protein' 
  | 'dairy' 
  | 'legume' 
  | 'nuts' 
  | 'fats'
  | 'spice'
  | 'prepared'
  | 'beverage';

export interface FoodEntry {
  word: string;
  groups: FoodGroup[];
  facts?: string[];
}

// Group colors for display (backgrounds/badges)
export const GROUP_COLORS: Record<FoodGroup, string> = {
  vegetable: '#22c55e', // green
  fruit: '#ef4444',     // red
  grain: '#a16207',     // brown
  protein: '#a855f7',   // purple
  dairy: '#f5f5f5',     // white/cream
  legume: '#f97316',    // orange
  nuts: '#eab308',      // yellow
  fats: '#fbbf24',      // amber
  spice: '#dc2626',     // deep red
  prepared: '#64748b',  // slate gray
  beverage: '#3b82f6',  // blue
};

// Darker text colors for readability (for group names as text)
export const GROUP_TEXT_COLORS: Record<FoodGroup, string> = {
  vegetable: '#15803d', // darker green
  fruit: '#b91c1c',     // darker red
  grain: '#78350f',     // darker brown
  protein: '#7e22ce',   // darker purple
  dairy: '#525252',     // gray (since white won't work as text)
  legume: '#c2410c',    // darker orange
  nuts: '#a16207',      // darker yellow/amber
  fats: '#b45309',      // darker amber
  spice: '#991b1b',     // darker deep red
  prepared: '#334155',  // darker slate
  beverage: '#1d4ed8',  // darker blue
};

export const GROUP_EMOJI: Record<FoodGroup, string> = {
  vegetable: '🥬',
  fruit: '🍎',
  grain: '🌾',
  protein: '🍗',
  dairy: '🥛',
  legume: '🫘',
  nuts: '🥜',
  fats: '🫒',
  spice: '🧂',
  prepared: '🍽️',
  beverage: '🥤',
};

export const GROUP_NAMES: Record<FoodGroup, string> = {
  vegetable: 'Vegetable',
  fruit: 'Fruit',
  grain: 'Grain',
  protein: 'Protein',
  dairy: 'Dairy',
  legume: 'Legume',
  nuts: 'Nuts/Seeds',
  fats: 'Fats/Oils',
  spice: 'Spices/Condiments',
  prepared: 'Prepared',
  beverage: 'Beverage',
};

// Multi-identity foods with explanations
export const DUAL_IDENTITY_FOODS: Record<string, { groups: FoodGroup[], facts: string[] }> = {
  'ALMOND': {
    groups: ['nuts', 'fats'],
    facts: ['High in healthy fats', 'Good source of protein']
  },
  'ALMONDBUTTER': {
    groups: ['nuts', 'fats'],
    facts: ['Made from ground almonds', 'High in healthy fats']
  },
  'ALMONDMILK': {
    groups: ['nuts', 'beverage'],
    facts: ['Plant-based milk alternative', 'Made from almonds']
  },
  'AMARANTH': {
    groups: ['grain', 'vegetable'],
    facts: ['Ancient grain', 'Leaves eaten as vegetable']
  },
  'APRICOTJAM': {
    groups: ['fruit', 'spice'],
    facts: ['Made from apricots', 'Used as spread or condiment']
  },

  'AVOCADO': {
    groups: ['vegetable', 'fruit', 'fats'],
    facts: ['Botanically a berry', 'Used as a vegetable', 'Rich in healthy fats']
  },
  'BEAN': {
    groups: ['legume', 'protein'],
    facts: ['A legume', 'Good protein source']
  },
  'BUTTER': {
    groups: ['dairy', 'fats'],
    facts: ['Made from cream', 'High in saturated fat']
  },
  'BUTTERMILK': {
    groups: ['dairy', 'beverage'],
    facts: ['Fermented dairy drink', 'Used in baking']
  },
  'CHICKPEA': {
    groups: ['legume', 'protein'],
    facts: ['A legume', 'Excellent protein source']
  },
  'CHILI': {
    groups: ['spice', 'protein'],
    facts: ['Spicy dish with meat', 'Also a spice']
  },
  'CHOCOLATE': {
    groups: ['spice', 'beverage', 'prepared'],
    facts: ['From cacao beans', 'Used in drinks and desserts']
  },
  'CINNAMON': {
    groups: ['spice'],
    facts: ['From tree bark', 'Popular in sweet and savory dishes']
  },
  'COCOA': {
    groups: ['spice', 'beverage'],
    facts: ['From cacao beans', 'Used in drinks and baking']
  },
  'COCONUT': {
    groups: ['fruit', 'nuts', 'fats'],
    facts: ['Botanically a drupe (fruit)', 'Often grouped with nuts', 'High in saturated fat']
  },
  'COLESLAW': {
    groups: ['vegetable', 'prepared'],
    facts: ['Cabbage-based salad', 'Often dressed with mayo']
  },
  'CORN': {
    groups: ['vegetable', 'grain'],
    facts: ['Used as a vegetable', 'Botanically a grain']
  },
  'CUCUMBER': {
    groups: ['vegetable', 'fruit'],
    facts: ['Botanically a fruit', 'Eaten as a vegetable']
  },
  'DRUMSTICK': {
    groups: ['protein', 'vegetable'],
    facts: ['Chicken leg', 'Also a vegetable (moringa)']
  },
  'EGGPLANT': {
    groups: ['vegetable', 'fruit'],
    facts: ['Botanically a berry', 'Cooked as a vegetable']
  },
  'FLAX': {
    groups: ['nuts', 'fats'],
    facts: ['Rich in omega-3', 'Seeds and oil']
  },
  'FRYBREAD': {
    groups: ['prepared', 'grain'],
    facts: ['Native American bread', 'Deep fried dough']
  },
  'GARLIC': {
    groups: ['vegetable', 'spice'],
    facts: ['A bulb vegetable', 'Used as a flavoring/spice']
  },
  'GHEE': {
    groups: ['dairy', 'fats'],
    facts: ['Clarified butter', 'Used in cooking']
  },
  'GINGER': {
    groups: ['vegetable', 'spice'],
    facts: ['A root vegetable', 'Widely used as a spice']
  },
  'GOATMILK': {
    groups: ['dairy', 'beverage'],
    facts: ['From goats', 'Alternative to cow milk']
  },
  'HALFANDHALF': {
    groups: ['dairy', 'beverage'],
    facts: ['Half milk, half cream', 'Used in coffee']
  },
  'HASHBROWN': {
    groups: ['vegetable', 'prepared'],
    facts: ['Made from potatoes', 'Fried breakfast food']
  },
  'HORSERADISH': {
    groups: ['vegetable', 'spice'],
    facts: ['A root vegetable', 'Used as pungent condiment']
  },
  'ICECREAM': {
    groups: ['dairy', 'prepared'],
    facts: ['Frozen dairy dessert', 'Many flavors']
  },
  'KIMCHI': {
    groups: ['vegetable', 'prepared'],
    facts: ['Fermented vegetables', 'Korean staple']
  },
  'LENTIL': {
    groups: ['legume', 'protein'],
    facts: ['A legume', 'High in protein']
  },
  'MEATLESS': {
    groups: ['prepared', 'grain'],
    facts: ['Plant-based meat substitute', 'Often grain-based']
  },
  'MILK': {
    groups: ['dairy', 'beverage'],
    facts: ['From cows', 'Nutrient-rich drink']
  },
  'MORTADELLA': {
    groups: ['protein', 'prepared'],
    facts: ['Italian sausage', 'Processed meat']
  },
  'MULTIGRAIN': {
    groups: ['prepared', 'grain'],
    facts: ['Multiple grains', 'Often in bread']
  },
  'MUSTARD': {
    groups: ['spice', 'fats'],
    facts: ['From mustard seeds', 'Used as spice and condiment']
  },
  'NUTMEG': {
    groups: ['spice', 'fats'],
    facts: ['Aromatic spice', 'Contains natural oils']
  },
  'OAT': {
    groups: ['grain', 'fats'],
    facts: ['Whole grain', 'Contains healthy fats']
  },
  'OLIVE': {
    groups: ['fruit', 'fats'],
    facts: ['Botanically a fruit', 'Primary source of olive oil']
  },
  'ONION': {
    groups: ['vegetable', 'spice'],
    facts: ['A bulb vegetable', 'Base flavoring in cooking']
  },
  'ONIONRING': {
    groups: ['vegetable', 'prepared'],
    facts: ['Battered onion', 'Deep fried']
  },
  'PASILLA': {
    groups: ['fruit', 'spice'],
    facts: ['Dried chile pepper', 'Used as spice']
  },
  'PEANUT': {
    groups: ['legume', 'nuts', 'fats'],
    facts: ['Botanically a legume', 'Commonly grouped with nuts']
  },
  'PEPPER': {
    groups: ['vegetable', 'fruit', 'spice'],
    facts: ['Bell peppers are vegetables', 'Hot peppers are spices', 'Botanically a fruit']
  },
  'POPCORN': {
    groups: ['grain', 'prepared'],
    facts: ['Popped corn kernels', 'Popular snack']
  },
  'POTATOCHIP': {
    groups: ['vegetable', 'prepared'],
    facts: ['Sliced potatoes', 'Deep fried or baked']
  },
  'POPPYSEED': {
    groups: ['nuts', 'fats'],
    facts: ['Tiny seeds', 'Rich in oils']
  },
  'PUMPKIN': {
    groups: ['vegetable', 'fruit'],
    facts: ['Botanically a fruit', 'Used as a vegetable']
  },
  'QUINOA': {
    groups: ['grain', 'protein'],
    facts: ['A pseudo-grain', 'Complete protein source']
  },
  'RICEBRAN': {
    groups: ['grain', 'fats'],
    facts: ['From rice', 'Source of oil']
  },
  'SAFFLOWER': {
    groups: ['nuts', 'fats'],
    facts: ['Seeds used for oil', 'High in unsaturated fats']
  },
  'SALAMI': {
    groups: ['protein', 'prepared'],
    facts: ['Cured sausage', 'Italian origin']
  },
  'SALMON': {
    groups: ['protein', 'fats'],
    facts: ['Fatty fish', 'Rich in omega-3']
  },
  'SARDINE': {
    groups: ['protein', 'fats'],
    facts: ['Small oily fish', 'Rich in omega-3']
  },
  'SAUSAGE': {
    groups: ['protein', 'prepared'],
    facts: ['Ground meat in casing', 'Many varieties']
  },
  'SEAL': {
    groups: ['protein', 'fats'],
    facts: ['Marine mammal', 'Traditional Arctic food']
  },
  'SERANO': {
    groups: ['fruit', 'spice'],
    facts: ['Hot pepper', 'Used as spice']
  },
  'SESAMEBUTTER': {
    groups: ['nuts', 'spice'],
    facts: ['Ground sesame seeds', 'Also called tahini']
  },
  'SHAKE': {
    groups: ['dairy', 'beverage'],
    facts: ['Blended drink', 'Often with ice cream']
  },
  'SOYBEAN': {
    groups: ['legume', 'protein', 'fats'],
    facts: ['A legume', 'Complete protein source']
  },
  'SOYMILK': {
    groups: ['legume', 'beverage'],
    facts: ['Plant-based milk', 'Made from soybeans']
  },
  'SOYNUT': {
    groups: ['legume', 'nuts'],
    facts: ['A legume', 'Sometimes called a nut']
  },
  'SQUASH': {
    groups: ['vegetable', 'fruit'],
    facts: ['Botanically a fruit', 'Cooked as a vegetable']
  },
  'SUNDAE': {
    groups: ['dairy', 'prepared'],
    facts: ['Ice cream dessert', 'With toppings']
  },
  'SUNFLOWER': {
    groups: ['nuts', 'fats'],
    facts: ['Seeds used as snack', 'Source of oil']
  },
  'TEMPEH': {
    groups: ['protein', 'legume'],
    facts: ['Fermented soybeans', 'Rich in protein']
  },
  'TOFU': {
    groups: ['protein', 'legume'],
    facts: ['Made from soybeans', 'High in protein']
  },
  'TOMATO': {
    groups: ['vegetable', 'fruit'],
    facts: ['Botanically a fruit', 'Commonly used as a vegetable']
  },
  'VANILLA': {
    groups: ['spice', 'fruit'],
    facts: ['From orchid seed pods', 'Used as flavoring']
  },
  'WALNUT': {
    groups: ['nuts', 'fats'],
    facts: ['Tree nut', 'Rich in omega-3']
  },
  'WALRUS': {
    groups: ['protein', 'fats'],
    facts: ['Marine mammal', 'Traditional Arctic food']
  },
  'WHALE': {
    groups: ['protein', 'fats'],
    facts: ['Marine mammal', 'Traditional food in some cultures']
  },
  'WHEATGERM': {
    groups: ['grain', 'fats'],
    facts: ['Nutrient-rich part of wheat', 'Contains oils']
  },
  'ZUCCHINI': {
    groups: ['vegetable', 'fruit'],
    facts: ['Botanically a fruit', 'Used as a vegetable']
  },
  'ZWIEBACK': {
    groups: ['grain', 'prepared'],
    facts: ['Twice-baked bread', 'Crispy toast']
  },
};


// Build the complete food database from the shared CSV source of truth
import scrambledWordsCsv from './scrambled-words.csv?raw';

export const FOOD_DATABASE: Map<string, FoodEntry> = new Map();

for (const line of scrambledWordsCsv.trim().split('\n').slice(1)) {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.includes(',')) continue;
  const [rawWord, rawGroups] = trimmed.split(',', 2);
  const word = rawWord.trim().toUpperCase();
  const groups = rawGroups.trim().split('|').map(g => g.trim()).filter(g => g) as FoodGroup[];
  if (!word || groups.length === 0) continue;
  const facts = DUAL_IDENTITY_FOODS[word]?.facts;
  FOOD_DATABASE.set(word, { word, groups, ...(facts ? { facts } : {}) });
}

// Helper functions
export function isValidFood(word: string): boolean {
  return FOOD_DATABASE.has(word.toUpperCase());
}

export function getFoodEntry(word: string): FoodEntry | undefined {
  return FOOD_DATABASE.get(word.toUpperCase());
}

export function isDualIdentity(word: string): boolean {
  const entry = FOOD_DATABASE.get(word.toUpperCase());
  return entry ? entry.groups.length > 1 : false;
}

export function getWordsStartingWith(letter: string): string[] {
  const result: string[] = [];
  for (const word of FOOD_DATABASE.keys()) {
    if (word.startsWith(letter.toUpperCase())) {
      result.push(word);
    }
  }
  return result;
}

export function getAllFoodWords(): string[] {
  return Array.from(FOOD_DATABASE.keys());
}
