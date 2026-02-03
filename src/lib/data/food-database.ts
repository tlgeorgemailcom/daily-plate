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
  spice: 'Spices',
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
  'APRICOTOIL': {
    groups: ['fruit', 'fats'],
    facts: ['Extracted from apricot kernels', 'Used in cooking']
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

// Primary food group assignments (single identity)
const FOOD_GROUPS: Record<string, FoodGroup> = {
  // Vegetables
  'ABIYUCH': 'vegetable',
  'AGAVE': 'vegetable',
  'ALFALFA': 'vegetable',
  'ARROWHEAD': 'vegetable',
  'ARROWROOT': 'vegetable',
  'ARTICHOKE': 'vegetable',
  'ARUGULA': 'vegetable',
  'ASPARAGUS': 'vegetable',
  'BAMBOO': 'vegetable',
  'BEET': 'vegetable',
  'BOK': 'vegetable',
  'BORAGE': 'vegetable',
  'BROCCOLI': 'vegetable',
  'BRUSSELSPROUTS': 'vegetable',
  'BURDOCK': 'vegetable',
  'BUTTERBUR': 'vegetable',
  'CABBAGE': 'vegetable',
  'CARDOON': 'vegetable',
  'CARROT': 'vegetable',
  'CASSAVA': 'vegetable',
  'CATTAIL': 'vegetable',
  'CAULIFLOWER': 'vegetable',
  'CELERIAC': 'vegetable',
  'CELERY': 'vegetable',
  'CELTUCE': 'vegetable',
  'CHARD': 'vegetable',
  'CHAYOTE': 'vegetable',
  'CHICORY': 'vegetable',
  'CHOY': 'vegetable',
  'CHRYSANTHEMUM': 'vegetable',
  'COLLARD': 'vegetable',
  'CORNSALAD': 'vegetable',
  'CROOKNECK': 'vegetable',
  'DANDELION': 'vegetable',
  'DOCK': 'vegetable',
  'ENDIVE': 'vegetable',
  'EPPAW': 'vegetable',
  'ESCAROLE': 'vegetable',
  'FENNEL': 'vegetable',
  'FERN': 'vegetable',
  'FIDDLEHEAD': 'vegetable',
  'FIREWEED': 'vegetable',
  'FRENCHFRIES': 'vegetable',
  'GOURD': 'vegetable',
  'GRAPELEAVE': 'vegetable',
  'HYACINTH': 'vegetable',
  'JERUSALEM': 'vegetable',
  'JICAMA': 'vegetable',
  'JUTE': 'vegetable',
  'KALE': 'vegetable',
  'KANPYO': 'vegetable',
  'KELP': 'vegetable',
  'KOHLRABI': 'vegetable',
  'LAMBSQUARTERS': 'vegetable',
  'LEEK': 'vegetable',
  'LETTUCE': 'vegetable',
  'LOTUS': 'vegetable',
  'MOUNTAINYAM': 'vegetable',
  'MUSHROOM': 'vegetable',
  'MUSTARDGREEN': 'vegetable',
  'NAPA': 'vegetable',
  'NETTLES': 'vegetable',
  'NOPALES': 'vegetable',
  'OKRA': 'vegetable',
  'PARSNIP': 'vegetable',
  'POTATO': 'vegetable',
  'PURSLANE': 'vegetable',
  'RADICCHIO': 'vegetable',
  'RADISH': 'vegetable',
  'RUTABAGA': 'vegetable',
  'SALSIFY': 'vegetable',
  'SAVOY': 'vegetable',
  'SCALLION': 'vegetable',
  'SEAWEED': 'vegetable',
  'SHALLOT': 'vegetable',
  'SNAPBEAN': 'vegetable',
  'SORREL': 'vegetable',
  'SPINACH': 'vegetable',
  'SPIRULINA': 'vegetable',
  'SPROUT': 'vegetable',
  'SUCCOTASH': 'vegetable',
  'SWEETPOTATO': 'vegetable',
  'SWISSCHARD': 'vegetable',
  'TAPIOCA': 'vegetable',
  'TARO': 'vegetable',
  'TOMATILLO': 'vegetable',
  'TURNIP': 'vegetable',
  'VEGETABLE': 'vegetable',
  'WATERCRESS': 'vegetable',
  'YAM': 'vegetable',
  'YAMBEAN': 'vegetable',
  'YARDLONG': 'vegetable',

  // Fruits
  'ACEROLA': 'fruit',
  'APPLE': 'fruit',
  'APRICOT': 'fruit',
  'BALSAMPEAR': 'fruit',
  'BANANA': 'fruit',
  'BLACKBERRY': 'fruit',
  'BLUEBERRY': 'fruit',
  'BOYSENBERRY': 'fruit',
  'BREADFRUIT': 'fruit',
  'CANTALOUPE': 'fruit',
  'CARAMBOLA': 'fruit',
  'CARISSA': 'fruit',
  'CHERIMOYA': 'fruit',
  'CHERRY': 'fruit',
  'CHOKECHERRY': 'fruit',
  'CITRUS': 'fruit',
  'CLEMENTINE': 'fruit',
  'CLOUDBERRY': 'fruit',
  'CRABAPPLE': 'fruit',
  'CRANBERRY': 'fruit',
  'CURRANT': 'fruit',
  'DATE': 'fruit',
  'DRAGONFRUIT': 'fruit',
  'DURIAN': 'fruit',
  'ELDERBERRY': 'fruit',
  'FEIJOA': 'fruit',
  'FIG': 'fruit',
  'FRUIT': 'fruit',
  'GOJI': 'fruit',
  'GOOSEBERRY': 'fruit',
  'GRAPE': 'fruit',
  'GRAPEFRUIT': 'fruit',
  'GUANABANA': 'fruit',
  'GUAVA': 'fruit',
  'HONEYDEW': 'fruit',
  'HORNED': 'fruit',
  'HUCKLEBERRY': 'fruit',
  'JACKFRUIT': 'fruit',
  'JUJUBE': 'fruit',
  'KIWI': 'fruit',
  'KUMQUAT': 'fruit',
  'LEMON': 'fruit',
  'LICHEE': 'fruit',
  'LIME': 'fruit',
  'LINGONBERRY': 'fruit',
  'LITCHI': 'fruit',
  'LOGANBERRY': 'fruit',
  'LONGAN': 'fruit',
  'LOQUAT': 'fruit',
  'LYCHEE': 'fruit',
  'MAMEY': 'fruit',
  'MANGO': 'fruit',
  'MANGOSTEEN': 'fruit',
  'MARASCHINO': 'fruit',
  'MELON': 'fruit',
  'MULBERRY': 'fruit',
  'NANCE': 'fruit',
  'NECTARINE': 'fruit',
  'OHELOBERRY': 'fruit',
  'ORANGE': 'fruit',
  'PAPAYA': 'fruit',
  'PASSION': 'fruit',
  'PEACH': 'fruit',
  'PEAR': 'fruit',
  'PERSIMMON': 'fruit',
  'PINEAPPLE': 'fruit',
  'PITANGA': 'fruit',
  'PLAINTAIN': 'fruit',
  'PLUM': 'fruit',
  'POMEGRANATE': 'fruit',
  'PRICKLYPEAR': 'fruit',
  'PRUNE': 'fruit',
  'PUMMELO': 'fruit',
  'QUINCE': 'fruit',
  'RAISIN': 'fruit',
  'RASPBERRY': 'fruit',
  'RHUBARB': 'fruit',
  'ROSELLE': 'fruit',
  'SAPOTE': 'fruit',
  'SOURSOP': 'fruit',
  'STARFRUIT': 'fruit',
  'STRAWBERRY': 'fruit',
  'TAMARIND': 'fruit',
  'TANGERINE': 'fruit',
  'WATERMELON': 'fruit',
  'WAXGOURD': 'fruit',

  // Grains
  'BAGEL': 'grain',
  'BARLEY': 'grain',
  'BLUECORN': 'grain',
  'BUCKWHEAT': 'grain',
  'BULGUR': 'grain',
  'CEREAL': 'grain',
  'CORNMEAL': 'grain',
  'COUSCOUS': 'grain',
  'CRACKER': 'grain',
  'CROUTON': 'grain',
  'FARINA': 'grain',
  'FARRO': 'grain',
  'GRITS': 'grain',
  'HOMINY': 'grain',
  'INCAPARINA': 'grain',
  'MACARONI': 'grain',
  'MASA': 'grain',
  'MILLET': 'grain',
  'NOODLE': 'grain',
  'OATBRAN': 'grain',
  'OATMEAL': 'grain',
  'PASTA': 'grain',
  'PIKIBREAD': 'grain',
  'RICE': 'grain',
  'RYE': 'grain',
  'SEMOLINA': 'grain',
  'SORGHUM': 'grain',
  'SORGHUMFLOUR': 'grain',
  'SPAGHETTI': 'grain',
  'SPELT': 'grain',
  'TEFF': 'grain',
  'TRICALE': 'grain',
  'WHEAT': 'grain',

  // Proteins (Meat, Poultry, Fish, Seafood)
  'ABALONE': 'protein',
  'AGUTUK': 'protein',
  'ANCHOVY': 'protein',
  'ASCIDIANS': 'protein',
  'BACON': 'protein',
  'BASS': 'protein',
  'BEAR': 'protein',
  'BEAVER': 'protein',
  'BEEF': 'protein',
  'BEEFSTEW': 'protein',
  'BEERWURST': 'protein',
  'BISON': 'protein',
  'BLACKFISH': 'protein',
  'BLUEFIN': 'protein',
  'BLUEFISH': 'protein',
  'BOAR': 'protein',
  'BOCKWURST': 'protein',
  'BOLOGNA': 'protein',
  'BRAIN': 'protein',
  'BRATWURST': 'protein',
  'BRAUNSCHWEIGER': 'protein',
  'BREAST': 'protein',
  'BRISKET': 'protein',
  'BROILERS': 'protein',
  'BROTWURST': 'protein',
  'BUFFALO': 'protein',
  'CALAMARI': 'protein',
  'CARIBOU': 'protein',
  'CARP': 'protein',
  'CATFISH': 'protein',
  'CHICKEN': 'protein',
  'CHILCHEN': 'protein',
  'CHINOOK': 'protein',
  'CHITON': 'protein',
  'CHORIZO': 'protein',
  'CHUCKROAST': 'protein',
  'CHUM': 'protein',
  'CISCO': 'protein',
  'CLAM': 'protein',
  'COD': 'protein',
  'COHO': 'protein',
  'CONCH': 'protein',
  'CORNEDBEEF': 'protein',
  'CORNISH': 'protein',
  'CRAB': 'protein',
  'CRAWFISH': 'protein',
  'CRAYFISH': 'protein',
  'CROAKER': 'protein',
  'CRUSTACEAN': 'protein',
  'CURED': 'protein',
  'CUSK': 'protein',
  'CUTTLEFISH': 'protein',
  'DEER': 'protein',
  'DEVILFISH': 'protein',
  'DRUM': 'protein',
  'DRUMETTE': 'protein',
  'DUCK': 'protein',
  'EEL': 'protein',
  'EGG': 'protein',
  'ELK': 'protein',
  'EYEOFROUND': 'protein',
  'FILET': 'protein',
  'FISHSTICK': 'protein',
  'FLANKSTEAK': 'protein',
  'FLATFISH': 'protein',
  'FLOUNDER': 'protein',
  'FORESHANK': 'protein',
  'FRANKFURTER': 'protein',
  'FROG': 'protein',
  'FRYERS': 'protein',
  'GEFILTEFISH': 'protein',
  'GIBLETS': 'protein',
  'GIZZARD': 'protein',
  'GOAT': 'protein',
  'GOOSE': 'protein',
  'GROUPER': 'protein',
  'GUINEA': 'protein',
  'HADDOCK': 'protein',
  'HAKE': 'protein',
  'HALIBUT': 'protein',
  'HAM': 'protein',
  'HEART': 'protein',
  'HERRING': 'protein',
  'HINDSHANK': 'protein',
  'HORSE': 'protein',
  'JELLYFISH': 'protein',
  'KIDNEY': 'protein',
  'KIELBASA': 'protein',
  'LAMB': 'protein',
  'LAMBCHOP': 'protein',
  'LEG': 'protein',
  'LING': 'protein',
  'LINGCOD': 'protein',
  'LIVER': 'protein',
  'LIVERWURST': 'protein',
  'LOBSTER': 'protein',
  'LUNGS': 'protein',
  'MACKEREL': 'protein',
  'MAHI': 'protein',
  'MEATBALLS': 'protein',
  'MIGNON': 'protein',
  'MILKFISH': 'protein',
  'MOLLUSK': 'protein',
  'MONKFISH': 'protein',
  'MOOSE': 'protein',
  'MULLET': 'protein',
  'MUSKRAT': 'protein',
  'MUSSEL': 'protein',
  'MUTTON': 'protein',
  'NECK': 'protein',
  'OCTOPUS': 'protein',
  'OPOSSUM': 'protein',
  'OSTRICH': 'protein',
  'OYSTER': 'protein',
  'PANCREAS': 'protein',
  'PASTRAMI': 'protein',
  'PATE': 'protein',
  'PEPPERONI': 'protein',
  'PERCH': 'protein',
  'PHEASANT': 'protein',
  'PIGEON': 'protein',
  'PIKE': 'protein',
  'POKE': 'protein',
  'POLLOCK': 'protein',
  'POMPANO': 'protein',
  'PORK': 'protein',
  'PORKBELLY': 'protein',
  'PORKCHOP': 'protein',
  'POTPIE': 'protein',
  'POTROAST': 'protein',
  'POUT': 'protein',
  'PRAWN': 'protein',
  'PROSCIUTTO': 'protein',
  'QUAIL': 'protein',
  'RABBIT': 'protein',
  'RACCOON': 'protein',
  'RACK': 'protein',
  'RIBEYE': 'protein',
  'RIBS': 'protein',
  'ROAST': 'protein',
  'ROCKFISH': 'protein',
  'ROE': 'protein',
  'ROUGHY': 'protein',
  'ROUNDSTEAK': 'protein',
  'RUMP': 'protein',
  'SABLEFISH': 'protein',
  'SALISBURY': 'protein',
  'SALTPORK': 'protein',
  'SCALLOP': 'protein',
  'SCROD': 'protein',
  'SCUP': 'protein',
  'SEABASS': 'protein',
  'SEALION': 'protein',
  'SEATROUT': 'protein',
  'SHAD': 'protein',
  'SHANK': 'protein',
  'SHARK': 'protein',
  'SHEEFISH': 'protein',
  'SHEEPSHEAD': 'protein',
  'SHELLFISH': 'protein',
  'SHORTRIB': 'protein',
  'SHOULDER': 'protein',
  'SHRIMP': 'protein',
  'SIRLOIN': 'protein',
  'SMELT': 'protein',
  'SMOKED': 'protein',
  'SNAIL': 'protein',
  'SNAPPER': 'protein',
  'SOCKEYE': 'protein',
  'SOLE': 'protein',
  'SPLEEN': 'protein',
  'SPOT': 'protein',
  'SQUAB': 'protein',
  'SQUID': 'protein',
  'SQUIRREL': 'protein',
  'STEAK': 'protein',
  'STEELHEAD': 'protein',
  'STRIPSTEAK': 'protein',
  'STURGEON': 'protein',
  'SUCKER': 'protein',
  'SUET': 'protein',
  'SUNFISH': 'protein',
  'SURIMI': 'protein',
  'SWEETBREAD': 'protein',
  'SWORDFISH': 'protein',
  'TBONE': 'protein',
  'TENDERLOIN': 'protein',
  'TENDERS': 'protein',
  'THIGH': 'protein',
  'TILAPIA': 'protein',
  'TIPNUK': 'protein',
  'TONGUE': 'protein',
  'TRIPE': 'protein',
  'TROUT': 'protein',
  'TUNA': 'protein',
  'TURBOT': 'protein',
  'TURKEY': 'protein',
  'VEAL': 'protein',
  'VENISON': 'protein',
  'WALLEYE': 'protein',
  'WHELK': 'protein',
  'WHITEFISH': 'protein',
  'WHITING': 'protein',
  'WING': 'protein',
  'WOLFFISH': 'protein',
  'YELLOWTAIL': 'protein',
  'YOLK': 'protein',

  // Dairy
  'AMERICAN': 'dairy',
  'ASIAGO': 'dairy',
  'BLUECHEESE': 'dairy',
  'BREADCHEESE': 'dairy',
  'BRICK': 'dairy',
  'BRIE': 'dairy',
  'CAMEMBERT': 'dairy',
  'CASEIN': 'dairy',
  'CHEDDAR': 'dairy',
  'CHEESE': 'dairy',
  'CHESHIRE': 'dairy',
  'COLBY': 'dairy',
  'COTTAGE': 'dairy',
  'CREAM': 'dairy',
  'EDAM': 'dairy',
  'FETA': 'dairy',
  'FONTINA': 'dairy',
  'GJETOST': 'dairy',
  'GORGONZOLA': 'dairy',
  'GOUDA': 'dairy',
  'GRUYERE': 'dairy',
  'HAVARTI': 'dairy',
  'KEFIR': 'dairy',
  'MANCHEGO': 'dairy',
  'MASCARPONE': 'dairy',
  'MONTEREY': 'dairy',
  'MOZZARELLA': 'dairy',
  'MUENSTER': 'dairy',
  'NEUFCHATEL': 'dairy',
  'PARMESAN': 'dairy',
  'PECORINO': 'dairy',
  'PORTDESALUT': 'dairy',
  'PROVOLONE': 'dairy',
  'RICOTTA': 'dairy',
  'ROMANO': 'dairy',
  'ROQUEFORT': 'dairy',
  'SOURCREAM': 'dairy',
  'STILTON': 'dairy',
  'SWISSCHEESE': 'dairy',
  'WHEY': 'dairy',
  'WHIPPING': 'dairy',
  'YOGURT': 'dairy',

  // Legumes
  'ADZUKI': 'legume',
  'BLACKBEAN': 'legume',
  'BROADBEAN': 'legume',
  'COWPEA': 'legume',
  'EDAMAME': 'legume',
  'FAVABEAN': 'legume',
  'FRENCHBEAN': 'legume',
  'GREENBEAN': 'legume',
  'HUMMUS': 'legume',
  'KIDNEYBEAN': 'legume',
  'LIMABEAN': 'legume',
  'LUPINS': 'legume',
  'MOTHBEAN': 'legume',
  'MUNGBEAN': 'legume',
  'MUNGO': 'legume',
  'NATTO': 'legume',
  'NAVYBEAN': 'legume',
  'NORTHERNBEAN': 'legume',
  'OKARA': 'legume',
  'PEA': 'legume',
  'PIGEONPEAS': 'legume',
  'PINTOBEAN': 'legume',
  'REDBEAN': 'legume',
  'SHELLIEBEAN': 'legume',
  'SPLITPEA': 'legume',
  'SUNN': 'legume',
  'TURTLEBEANS': 'legume',
  'WHITEBEAN': 'legume',
  'WINGEDBEAN': 'legume',

  // Nuts and Seeds
  'ACORN': 'nuts',
  'ACORNFLOUR': 'nuts',
  'ALMONDPASTE': 'nuts',
  'ANISE': 'nuts',
  'BEECHNUT': 'nuts',
  'CAROB': 'nuts',
  'CASHEW': 'nuts',
  'CASHEWBUTTER': 'nuts',
  'CELERYSEED': 'nuts',
  'CHESTNUT': 'nuts',
  'CHIA': 'nuts',
  'FENGUGREEK': 'nuts',
  'FILBERT': 'nuts',
  'GINKGO': 'nuts',
  'HAZELNUT': 'nuts',
  'HEMP': 'nuts',
  'HICKORYNUT': 'nuts',
  'MACADAMIA': 'nuts',
  'MOUSENUT': 'nuts',
  'PECAN': 'nuts',
  'PILINUT': 'nuts',
  'PINE': 'nuts',
  'PINON': 'nuts',
  'PISTACHIO': 'nuts',
  'SESAME': 'nuts',
  'SESAMEFLOUR': 'nuts',

  // Fats/Oils
  'BABASSU': 'fats',
  'CANOLA': 'fats',
  'COCOABUTTER': 'fats',
  'COTTONSEED': 'fats',
  'CUPUASSU': 'fats',
  'GRAPESEED': 'fats',
  'HAZELNUTOIL': 'fats',
  'LARD': 'fats',
  'LECITHIN': 'fats',
  'MARGARINE': 'fats',
  'MENHADEN': 'fats',
  'OIL': 'fats',
  'PALM': 'fats',
  'SHEANUT': 'fats',
  'SHORTENING': 'fats',
  'SOYLECITHIN': 'fats',
  'SPRAYOIL': 'fats',
  'TALLOW': 'fats',
  'TEASEED': 'fats',
  'TOMATOSEED': 'fats',
  'UCUHUBA': 'fats',

  // Spices, Condiments
  'ALLSPICE': 'spice',
  'BARBECUE': 'spice',
  'BASIL': 'spice',
  'BAYLEAF': 'spice',
  'CAPER': 'spice',
  'CARAWAY': 'spice',
  'CARDAMOM': 'spice',
  'CATSUP': 'spice',
  'CAYENNE': 'spice',
  'CHERVIL': 'spice',
  'CHIVE': 'spice',
  'CILANTRO': 'spice',
  'CLOVE': 'spice',
  'CORIANDER': 'spice',
  'CORNSTARCH': 'spice',
  'CUMIN': 'spice',
  'CURRY': 'spice',
  'DILL': 'spice',
  'EPAZOTE': 'spice',
  'HOISIN': 'spice',
  'HONEY': 'spice',
  'JALAPENO': 'spice',
  'MAPLE': 'spice',
  'MARJORAM': 'spice',
  'MARMALADE': 'spice',
  'MAYO': 'spice',
  'MAYONNAISE': 'spice',
  'MINT': 'spice',
  'MISO': 'spice',
  'MOLASSES': 'spice',
  'OREGANO': 'spice',
  'PAPRIKA': 'spice',
  'PARSLEY': 'spice',
  'PEPPERMINT': 'spice',
  'PICKLE': 'spice',
  'PIMIENTO': 'spice',
  'PRESERVES': 'spice',
  'RANCHDRESSING': 'spice',
  'RANCHSTYLE': 'spice',
  'RELISH': 'spice',
  'ROSEMARY': 'spice',
  'SAFFRON': 'spice',
  'SAGE': 'spice',
  'SALT': 'spice',
  'SOYSAUCE': 'spice',
  'SPEARMINT': 'spice',
  'SRIRACHA': 'spice',
  'SUGAR': 'spice',
  'SWEETENER': 'spice',
  'SYRUP': 'spice',
  'TABASCO': 'spice',
  'TAHINI': 'spice',
  'TARRAGON': 'spice',
  'TERIYAKI': 'spice',
  'THYME': 'spice',
  'TURMERIC': 'spice',
  'VINEGAR': 'spice',
  'WASABI': 'spice',

  // Prepared Foods
  'ACORNSTEW': 'prepared',
  'ANGLEFOOD': 'prepared',
  'ANTELOPE': 'prepared',
  'APPLESAUCE': 'prepared',
  'BAKEDBEANS': 'prepared',
  'BEEFALO': 'prepared',
  'BISCUIT': 'prepared',
  'BREAD': 'prepared',
  'BURGER': 'prepared',
  'BURRITO': 'prepared',
  'BUTTERSCOTCH': 'prepared',
  'CAKE': 'prepared',
  'CARAMEL': 'prepared',
  'CHEESECAKE': 'prepared',
  'COFFEECAKE': 'prepared',
  'COOKIE': 'prepared',
  'CORNDOG': 'prepared',
  'CORNBREAD': 'prepared',
  'CROISSANT': 'prepared',
  'CUSTARD': 'prepared',
  'DANISH': 'prepared',
  'DIVINITY': 'prepared',
  'DOUGHNUT': 'prepared',
  'DUMPLING': 'prepared',
  'ECLAIR': 'prepared',
  'EGGROLL': 'prepared',
  'EMU': 'prepared',
  'FALAFEL': 'prepared',
  'FLAN': 'prepared',
  'FOCACCIA': 'prepared',
  'FONDANT': 'prepared',
  'FORTUNE': 'prepared',
  'FRENCHBREAD': 'prepared',
  'FRENCHTOAST': 'prepared',
  'FROSTING': 'prepared',
  'FUDGE': 'prepared',
  'GARLICBREAD': 'prepared',
  'GELATIN': 'prepared',
  'GINGERBREAD': 'prepared',
  'GRAHAM': 'prepared',
  'GRANOLA': 'prepared',
  'GRAVY': 'prepared',
  'GUMDROP': 'prepared',
  'HOTDOG': 'prepared',
  'ICING': 'prepared',
  'JAM': 'prepared',
  'JELLIES': 'prepared',
  'JELLYBEAN': 'prepared',
  'KETCHUP': 'prepared',
  'LADYFINGERS': 'prepared',
  'MACAROON': 'prepared',
  'MARSHMALLOW': 'prepared',
  'MATZO': 'prepared',
  'MELBA': 'prepared',
  'MUFFIN': 'prepared',
  'PANCAKE': 'prepared',
  'PANDULCE': 'prepared',
  'PAPAD': 'prepared',
  'PARATHA': 'prepared',
  'PASTRY': 'prepared',
  'PESTO': 'prepared',
  'PHYLLO': 'prepared',
  'PIE': 'prepared',
  'PITA': 'prepared',
  'PIZZA': 'prepared',
  'POLENTA': 'prepared',
  'POUNDCAKE': 'prepared',
  'PRETZEL': 'prepared',
  'PUDDING': 'prepared',
  'PUMPERNICKEL': 'prepared',
  'QUICHE': 'prepared',
  'RAVIOLI': 'prepared',
  'RENNIN': 'prepared',
  'ROLL': 'prepared',
  'RUSK': 'prepared',
  'SALSA': 'prepared',
  'SALTINE': 'prepared',
  'SANDWICH': 'prepared',
  'SAUCE': 'prepared',
  'SAUERKRAUT': 'prepared',
  'SHERBET': 'prepared',
  'SHORTBREAD': 'prepared',
  'SNACK': 'prepared',
  'SOUP': 'prepared',
  'SPONGECAKE': 'prepared',
  'STRUDEL': 'prepared',
  'SUBMARINE': 'prepared',
  'TACO': 'prepared',
  'TAMALES': 'prepared',
  'TART': 'prepared',
  'TORTILLA': 'prepared',
  'TRAILMIX': 'prepared',
  'TURNOVER': 'prepared',
  'WAFER': 'prepared',
  'WAFFLE': 'prepared',
  'WHOLEWHEAT': 'prepared',
  'WONTON': 'prepared',

  // Beverages
  'BEER': 'beverage',
  'CARBONATED': 'beverage',
  'COCONUTMILK': 'beverage',
  'COFFEE': 'beverage',
  'COLA': 'beverage',
  'JUICE': 'beverage',
  'LEMONADE': 'beverage',
  'LIMEADE': 'beverage',
  'MALTED': 'beverage',
  'PUNCH': 'beverage',
  'SMOOTHIE': 'beverage',
  'TEA': 'beverage',
  'WATER': 'beverage',
  'WINE': 'beverage',
  'WHISKEY': 'beverage',
};

// Build the complete food database
import foodWordsRaw from './food-words.json';

const foodWords: string[] = foodWordsRaw as string[];

export const FOOD_DATABASE: Map<string, FoodEntry> = new Map();

// Initialize database from word list
for (const word of foodWords) {
  const upperWord = word.toUpperCase();
  
  // Check if it's a dual-identity food
  if (DUAL_IDENTITY_FOODS[upperWord]) {
    FOOD_DATABASE.set(upperWord, {
      word: upperWord,
      groups: DUAL_IDENTITY_FOODS[upperWord].groups,
      facts: DUAL_IDENTITY_FOODS[upperWord].facts
    });
  } 
  // Check if it has a known single group
  else if (FOOD_GROUPS[upperWord]) {
    FOOD_DATABASE.set(upperWord, {
      word: upperWord,
      groups: [FOOD_GROUPS[upperWord]]
    });
  }
  // Default to protein (most common for unclassified foods)
  else {
    FOOD_DATABASE.set(upperWord, {
      word: upperWord,
      groups: ['protein'] // Default - can be refined later
    });
  }
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
