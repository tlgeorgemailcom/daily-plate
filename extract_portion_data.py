#!/usr/bin/env python3
"""
Extract portion and nutrient data from USDA comboo.db using NDB_NO as the unique identifier.

NDB_NO is the primary key for all foods in the USDA database. Each food word in our
game must have a verified NDB_NO to look up its nutrient values and portion data.

Output structure:
- 7 nutrient values per 100g (cal, pro, fat, carb, fib, h2o, sug)
- M0 = Standard 100g portion (always available)
- M1-M12 = USDA measured portions from database (desc + grams only)
- Calories are calculated at runtime: (grams / 100) * cal_100g
"""

import sqlite3
import csv
import re
from pathlib import Path

# Paths
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
INPUT_CSV = "/Volumes/training/Daily Food Chain/daily-food-chain/food-groups-with-ndb-no.csv"
OUTPUT_CSV = "/Volumes/training/Daily Food Chain/daily-food-chain/food-portions-complete.csv"

# M0 = 100g standard, M1-M12 from database
PORTION_NUMBERS = range(0, 13)  # M0 (100g) through M12

# Known compound word splits - synced from food-portions-complete.csv
# ONLY include entries where the display name has spaces or hyphens
# Entries with single-word display names should NOT be listed here
WORD_SPLITS = {
    # A
    'ACORNFLOUR': 'Acorn Flour',
    'ACORNSTEW': 'Acorn Stew',
    'ALMONDBUTTER': 'Almond Butter',
    'ANGLEFOOD': 'Angel Food',
    'ALMONDMILK': 'Almond Milk',
    'ALMONDPASTE': 'Almond Paste',
    'ALOEVERAJUICE': 'Aloe Vera Juice',
    'AMARANTHLEAVE': 'Amaranth Leave',
    'AMERICAN': 'American Cheese',
    'APPLEJUICE': 'Apple Juice',
    'APPLEPIE': 'Apple Pie',
    'APPLESTRUDEL': 'Apple Strudel',
    'APRICOTJAM': 'Apricot Jam',
    'APRICOTOIL': 'Apricot Oil',
    
    # B
    'BAKEDBEANS': 'Baked Beans',
    'BAKINGSODA': 'Baking Soda',
    'BALSAMPEAR': 'Balsam-Pear',
    'BANANAPIE': 'Banana Pie',
    'BAYLEAF': 'Bay Leaf',
    'BEEFGROUND': 'Beef Ground',
    'BEEFSTEW': 'Beef Stew',
    'BEETCOOKED': 'Beet Cooked',
    'BEETPICKLED': 'Beet Pickled',
    'BLACKBEAN': 'Black Bean',
    'BLACKEYEPEA': 'Black-eyed Pea',
    'BLUEBERRYPIE': 'Blueberry Pie',
    'BLUECHEESE': 'Blue Cheese',
    'BLUECORN': 'Blue Corn',
    'BOK CHOY': 'Bok Choy',
    'BOSTONBUTT': 'Boston Butt',
    'BREADCHEESE': 'Bread Cheese',
    'BREADRYE': 'Bread Rye',
    'BREADWHITE': 'Bread White',
    'BREADWHOLE': 'Bread Whole Wheat',
    'BRICKCHEESE': 'Brick Cheese',
    'BRIECHEESE': 'Brie Cheese',
    'BROCCOLICOOKED': 'Broccoli Cooked',
    'BROCCOLIRAAB': 'Broccoli Raab',
    'BRUSSELSPROUTS': 'Brussel Sprouts',
    'BUCKWHEATCOOKED': 'Buckwheat Cooked',
    'BUTTERSALTED': 'Butter Salted',
    'BUTTERUNSALTED': 'Butter Unsalted',
    
    # C
    'CABBAGECOOKED': 'Cabbage Cooked',
    'CAESARDRESSING': 'Caesar Dressing',
    'CAKEWHITE': 'Cake White',
    'CAKEYELLOW': 'Cake Yellow',
    'CARAWAYCHEESE': 'Caraway Cheese',
    'CAROBMILK': 'Carob Milk',
    'CARROTCOOKED': 'Carrot Cooked',
    'CARROTJUICE': 'Carrot Juice',
    'CASHEWBUTTER': 'Cashew Butter',
    'CAULIFLOWERCOOKED': 'Cauliflower Cooked',
    'CEERALGRAHMS': 'Cereal Honey Grahms',
    'CELERYSEED': 'Celery Seed',
    'CEREALCAPN': "Cereal Cap'n Crunch",
    'CEREALCHARMS': 'Cereal Lucky Charms',
    'CEREALCHERRIOS': 'Cereal Cherrios',
    'CEREALCORN': 'Cereal Corn Flakes',
    'CEREALCRUNCH': 'Cereal Cinnamon Crunch',
    'CEREALFROSTED': 'Cereal Frosted Flakes',
    'CEREALHONEY': 'Cereal Honey Nut Cheerios',
    'CEREALLOOPS': 'Cereal Fruit Loops',
    'CEREALPUFFS': 'Cereal Cocoa Puffs',
    'CEREALRAISIN': 'Cereal Raisin Bran',
    'CEREALRICE': 'Cereal Rice Krispies',
    'CEREALTRIX': 'Cereal Trix',
    'CHERRYFRIEDPIE': 'Cherry Fried Pie',
    'CHERRYPIE': 'Cherry Pie',
    'CHICKENBREAST': 'Chicken Breast',
    'CHICKENDRUMSTICK': 'Chicken Drumstick',
    'CHICKENLEG': 'Chicken Leg',
    'CHICKENLIVERPATE': 'Chicken Liver Pate',
    'CHICKENTHIGH': 'Chicken Thigh',
    'CHICKENWING': 'Chicken Wing',
    'CHILIBEANS': 'Chili Beans',
    'CHILIDOG': 'Chili Dog',
    'CHOCOLATECAKE': 'Chocolate Cake',
    'CHOCOLATEMILK': 'Chocolate Milk',
    'CHOCOLATEPIE': 'Chocolate Pie',
    'CHOCOLATESYRUP': 'Chocolate Syrup',
    'CHUCKROAST': 'Chuck Roast',
    'CINNAMONROLL': 'Cinnamon Roll',
    'CLUBSANDWICH': 'Club Sandwich',
    'COCOABUTTER': 'Cocoa Butter',
    'COCONUTMILK': 'Coconut Milk',
    'COCONUTPIE': 'Coconut Pie',
    'COFFEECAKE': 'Coffee Cake',
    'CORNDOG': 'Corn Dog',
    'CORNEDBEEF': 'Corned Beef',
    'CORNSALAD': 'Corn Salad',
    'COUNTRYSTYLERIB': 'Country Style Rib',
    'CRACKERWHOLE': 'Cracker Whole Wheat',
    'CRACKERCHEESE': 'Cracker Cheese',
    'CRACKERMATZO': 'Cracker Matzo',
    'CRACKERMEAL': 'Cracker Meal',
    'CRACKERMELBA': 'Cracker Melba',
    'CRACKERMULTI': 'Cracker Multi-Grain',
    'CRACKERRUSK': 'Cracker Rusk',
    'CRACKERRYE': 'Cracker Rye',
    'CRACKERSALTINES': 'Cracker Saltines',
    'CRACKERWHEAT': 'Cracker Wheat',
    'CRANBERRYJUICE': 'Cranberry Juice',
    'CRANBERRYSAUCE': 'Cranberry Sauce',
    'CREAMCHEESE': 'Cream Cheese',
    'CREAMOFTARTAR': 'Cream of Tartar',
    'CREAMOFWHEAT': 'Cream of Wheat',
    
    # D
    'DINNERROLL': 'Dinner Roll',
    'DOUGHNUTCAKE': 'Doughnut Cake',
    'DOUGHNUTYEAST': 'Doughnut Yeast',
    'DRESSINGBLUE': 'Dressing Blue',
    'DRESSINGBUTTERMILK': 'Dressing Buttermilk',
    'DRESSINGCAESAR': 'Dressing Caesar',
    'DRESSINGFRENCH': 'Dressing French',
    'DRESSINGGREENGODDESS': 'Dressing Green Goddess',
    'DRESSINGHONEYMUST': 'Dressing Honey Mustard',
    'DRESSINGITALIAN': 'Dressing Italian',
    'DRESSINGMAYO': 'Dressing Mayo',
    'DRESSINGRANCH': 'Dressing Ranch',
    'DRESSINGRUSSIAN': 'Dressing Tussian',
    'DRESSINGSESAME': 'Dressing Sesame',
    'DRESSINGTHOUSAND': 'Dressing Thousand',
    'DRYWHITECHEESE': 'Dry White Cheese',
    
    # E
    'DUCKEGG': 'Duck Egg',
    'EGGBOILED': 'Egg Boiled',
    'EGGFRIED': 'Egg Fried',
    'EGGOMELET': 'Egg Omelet',
    'EGGPOACHED': 'Egg Poached',
    'EGGROLL': 'Egg Roll',
    'EGGROLLCHICKEN': 'Egg Roll Chicken',
    'EGGROLLPORK': 'Egg Roll Pork',
    'EGGSCRAMBLED': 'Egg Scrambled',
    'EGGWHITE': 'Egg White',
    'EGGYOLK': 'Egg Yolk',
    'ENGLISHMUFFIN': 'English Muffin',
    'EYEOFROUND': 'Eye of Round',
    
    # F
    'FAVABEAN': 'Fava Bean',
    'FILETMIGNON': 'Filet Mignon',
    'FISHBROTH': 'Fish Broth',
    'FISHSTICK': 'Fish Stick',
    'FLANKSTEAK': 'Flank Steak',
    'FLAXSEEDOIL': 'Flaxseed Oil',
    'FORESHANKLAMB': 'Foreshank Lamb',
    'FORTUNECOOKIE': 'Fortune Cookie',
    'FRENCHBEAN': 'French Bean',
    'FRENCHBREAD': 'French Bread',
    'FRENCHFRIES': 'French Fries',
    'FRENCHTOAST': 'French Toast',
    'FRUITCOCKTAIL': 'Fruit Cocktail',
    'FRYBREAD': 'Fry Bread',
    
    # G
    'GARLICBREAD': 'Garlic Bread',
    'GEFILTEFISH': 'Gefilte Fish',
    'GOATCHEESE': 'Goat Cheese',
    'GOATMILK': 'Goat Milk',
    'GOOSEEGG': 'Goose Egg',
    'GOOSELIVER': 'Goose Liver',
    'GRAPEFRUITJUICE': 'Grapefruit Juice',
    'GRAPEJUICE': 'Grape Juice',
    'GRAPELEAVE': 'Grape Leave',
    'GRAPESEEDOIL': 'Grapeseed Oil',
    'GREENBEAN': 'Green Bean',
    
    # H
    'HALFANDHALF': 'Half and Half',
    'HASHBROWN': 'Hash Brown',
    'HAZELNUTOIL': 'Hazelnut Oil',
    'HEARTOFPALM': 'Heart of Palm',
    'HICKORYNUT': 'Hickory Nut',
    'HINDSHANKLAMB': 'Hindshank Lamb',
    'HOTDOG': 'Hot Dog',
    'HOTDOGBUN': 'Hot Dog Bun',
    'HUCKLEBERRIES': 'Huckleberries',
    
    # I
    'ICECREAM': 'Ice Cream',
    'ICECREAMCHOC': 'Ice Cream Chocolate',
    'ICECREAMSTRAW': 'Ice Cream Strawberry',
    
    # K
    'KIDNEYBEAN': 'Kidney Bean',
    
    # L
    'LAMBCHOP': 'Lamb Chop',
    'LAMBGROUND': 'Lamb Ground',
    'LAMBLEG': 'Lamb Leg',
    'LAMBRACK': 'Lamb Rack',
    'LAMBSHANK': 'Lamb Shank',
    'LASAGNAMEAT': 'Lasagna with Meat',
    'LEMONFRIEDPIE': 'Lemon Fried Pie',
    'LEMONJUICE': 'Lemon Juice',
    'LEMONPEEL': 'Lemon Peel',
    'LEMONPIE': 'Lemon Pie',
    'LIMABEAN': 'Lima Bean',
    'LIMEJUICE': 'Lime Juice',
    
    # M
    'MACARONICHEESE': 'Macaroni and Cheese',
    'MAPLESUGAR': 'Maple Sugar',
    'MAPLESYPUP': 'Maple Sypup',
    'MEATLESSBACON': 'Meatless Bacon',
    'MEXICANBLEND': 'Mexican Blend Cheese',
    'MILKCONDENSED': 'Milk Condensed',
    'MILKEVAPORATED': 'Milk Evaporated',
    'MOUNTAINYAM': 'Mountain Yam',
    'MUFFINCORN': 'Muffin Corn',
    'MUSTARDGREEN': 'Mustard Greens',
    
    # N
    'NAVYBEAN': 'Navy Bean',
    'NEWYORKSTRIP': 'New York Strip',
    'NOODLEEGG': 'Noodle Egg',
    'NOODLESOBA': 'Noodle Soba',
    'NOODLESOMEN': 'Noodle Somen',
    'NORTHERNBEAN': 'Northern Bean',
    
    # O
    'OATBRAN': 'Oat Bran',
    'OATBRANCOOKED': 'Oat Bran Cooked',
    'OLIVEBLACK': 'Olive Black',
    'OLIVEGREEN': 'Olive Green',
    'ONIONRING': 'Onion Ring',
    'ORANGEJUICE': 'Orange Juice',
    'OYSTERCOOKED': 'Oyster Cooked',
    'OYSTERMUSHROOM': 'Oyster Mushroom',
    'OYSTERRAW': 'Oyster Raw',
    
    # P
    'PALMOIL': 'Palm Oil',
    'PASTRYCHEESE': 'Pastry Cheese',
    'PEACHNECTAR': 'Peach Nectar',
    'PEACHPIE': 'Peach Pie',
    'PEANUTBUTTER': 'Peanut Butter',
    'PEANUTOIL': 'Peanut Oil',
    'PEARNECTAR': 'Pear Nectar',
    'PECANPIE': 'Pecan Pie',
    'PIKIBREAD': 'Piki Bread',
    'PINEAPPLEJUICE': 'Pineapple Juice',
    'PINTOBEAN': 'Pinto Bean',
    'POPTARTBLUE': 'Pop Tart Blueberry',
    'POPTARTFRSTBLUE': 'Pop Tart Frost Blueberry',
    'POPTARTFRSTBRWN': 'Pop Tart Frost Brown',
    'POPTARTFRSTCHERRY': 'Pop Tart Frost Cherry',
    'POPTARTFRSTCHOC': 'Pop Tart Frost Choc',
    'POPTARTFRSTRASP': 'Pop Tart Frost Raspberry',
    'POPTARTFRSTSTRAW': 'Pop Tart Frost Strawberry',
    'POPTARTFRSTWILD': 'Pop Tart Frost Wild Berry',
    'POPTARTSMORES': 'Pop Tart Smores',
    'POPTARTSTRAW': 'Pop Tart Strawberry',
    'PORKBACKRIB': 'Pork Back Rib',
    'PORKBELLY': 'Pork Belly',
    'PORKCHOP': 'Pork Chop',
    'PORKGROUND': 'Pork Ground',
    'PORKHAMLEG': 'Pork Ham Leg',
    'PORKPICNIC': 'Pork Picnic',
    'PORKSAUSAGE': 'Pork Sausage',
    'PORKSHOULDER': 'Pork Shoulder',
    'PORKTENDERLOIN': 'Pork Tenderloin',
    'PORTDESALUT': 'Port de Salut',
    'PORTERHOUSEBEEF': 'Porterhouse Beef',
    'PORTERHOUSEPORK': 'Porterhouse Pork',
    'POTATOCHIP': 'Potato Chip',
    'POTATOESAUGRATIN': 'Potatoes au Gratin',
    'POTATOESBAKED': 'Potatoes Baked',
    'POTATOESBOILED': 'Potatoes Boiled',
    'POTATOESMASHED': 'Potatoes Mashed',
    'POTATOESSCALLOPED': 'Potatoes Scalloped',
    'POTATOSALAD': 'Potato Salad',
    'POTPIEBEEF': 'Pot Pie Beef',
    'POTPIECHICKEN': 'Pot Pie Chicken',
    'POTPIETURKEY': 'Pot Pie Turkey',
    'POTROAST': 'Pot Roast',
    'POUNDCAKE': 'Pound Cake',
    'PRICKLYPEAR': 'Prickly Pear',
    'PRUNEJUICE': 'Prune Juice',
    'PUDDINGCHOC': 'Pudding Chocolate',
    'PUDDINGLEMON': 'Pudding Lemon',
    'PUDDINGRICE': 'Pudding Rice',
    'PUDDINGTAPICOA': 'Pudding Tapicoa',
    'PUDDINGVANILLA': 'Pudding Vanilla',
    'PUMPKINPIE': 'Pumpkin Pie',
    
    # Q
    'QUAILEGG': 'Quail Egg',
    'QUESOANEJO': 'Queso Anejo',
    'QUESOASADERO': 'Queso Asadero',
    'QUESOBLANCO': 'Queso Blanco',
    'QUESOCHIHUAHUA': 'Queso Chihuahua',
    'QUESOCOTIJA': 'Queso Cotija',
    
    # R
    'RAISINBREAD': 'Raisin Bread',
    'RANCHDRESSING': 'Ranch Dressing',
    'RANCHSTYLE': 'Ranch Style',
    'REDBEAN': 'Red Bean',
    'REFRIEDBEAN': 'Refried Bean',
    'RICEBRAN': 'Rice Bran',
    'RICEBROWN': 'Brown Rice',
    'RICEFLOURBROWN': 'Rice Flour Brown',
    'RICEFLOURWHITE': 'Rice Flour White',
    'RICEWHITE': 'White Rice',
    'ROASTBEEF': 'Roast Beef',
    'ROLLHAMBURGER': 'Roll Hamburger',
    'ROLLHOTDOG': 'Roll Hotdog',
    'ROUNDROASTBOTTOM': 'Round Roast Bottom',
    'ROUNDROASTTOP': 'Round Roast Top',
    'ROUNDSTEAK': 'Round Steak',
    
    # S
    'SALSAVERDE': 'Salsa Verde',
    'SALTPORK': 'Salt Pork',
    'SARDINEOIL': 'Sardine Oil',
    'SAUSAGEBEEF': 'Sausage Beef',
    'SEABASS': 'Sea Bass',
    'SEATROUT': 'Sea Trout',
    'SESAMEBUTTER': 'Sesame Butter',
    'SESAMEFLOUR': 'Sesame Flour',
    'SHEEPMILK': 'Sheep Milk',
    'SHELLIEBEAN': 'Shellie Bean',
    'SHANKPORK': 'Shank Pork',
    'SHORTRIB': 'Short Rib',
    'SNAPBEAN': 'Snap Bean',
    'SIRLOINMROAST': 'Sirloin Roast',
    'SKIRTSTAEK': 'Skirt Steak',
    'SORGHUMFLOUR': 'Sorghum Flour',
    'SORGHUMSYRUP': 'Sorghum Syrup',
    'SOUPBEEFBROTH': 'Soup Beef Broth',
    'SOUPBROCCOLI': 'Soup Broccoli',
    'SOUPCHICKBROTH': 'Soup Chicken Broth',
    'SOUPCHICKNOODLE': 'Soup Chicken Noodle',
    'SOUPCLAM': 'Soup Clam',
    'SOUPCLAMRED': 'Soup Clam Red',
    'SOUPMINESTRONE': 'Soup Minestrone',
    'SOUPMUSHROOM': 'Soup Mushroom',
    'SOUPTOMATO': 'Soup Tomato',
    'SOUPTORTILLA': 'Soup Tortilla',
    'SOUPVEG': 'Soup Vegetable',
    'SOURCREAM': 'Sour Cream',
    'SOYBEANOIL': 'Soy Bean Oil',
    'SOYLECITHIN': 'Soy Lecithin',
    'SOYMILK': 'Soy Milk',
    'SOYSAUCE': 'Soy Sauce',
    'SPARERIB': 'Spare Rib',
    'SPLITPEA': 'Split Pea',
    'SPONGECAKE': 'Sponge Cake',
    'SPRAYOIL': 'Spray Oil',
    'SQUASHACORN': 'Squash Acorn',
    'SQUASHSUMMER': 'Squash Summer',
    'SQUASHWINTER': 'Squash Winter',
    'STRIPSTEAK': 'Strip Steak',
    'SUGARBROWN': 'Sugar Brown',
    'SUGARMAPLE': 'Sugar Maple',
    'SUGARPOWDERED': 'Sugar Powdered',
    'SWEETPOTATO': 'Sweet Potato',
    'SWISSCHARD': 'Swiss Chard',
    'SWISSCHEESE': 'Swiss Cheese',
    'SYRUPAGAVE': 'Syrup Agave',
    'SYRUPCANE': 'Syrup Cane',
    'SYRUPCHOCOLATE': 'Syrup Chocolate',
    'SYRUPCORNDARK': 'Syrup Corn Dark',
    'SYRUPCORNLIGHT': 'Syrup Corn Light',
    'SYRUPHIGHFRUCTOSE': 'Syrup High Fructose',
    'SYRUPPANCAKE': 'Syrup Pancake',
    'SYRUPSORGHUM': 'Syrup Sorghum',
    
    # T
    'TAMALESCHEESE': 'Tamales Cheese',
    'TAMALESPORK': 'Tamales Pork',
    'TANGERINEJUICE': 'Tangerine Juice',
    'TEASEEDOIL': 'Tea Seed Oil',
    'TOASTMULTI': 'Toast Multi',
    'TOMATOSAUCE': 'Tomato Sauce',
    'TOMATOSEEDOIL': 'Tomato Seed Oil',
    'TOMATOSUNDRIED': 'Tomato Sun-dried',
    'TONQUEBEEF': 'Tongue Beef',
    'TONQUELAMB': 'Tongue Lamb',
    'TONQUEPORK': 'Tongue Pork',
    'TORTILLACHIP': 'Tortilla Chip',
    'TORTILLACORN': 'Tortilla Corn',
    'TORTILLAFLOUR': 'Tortilla Flour',
    'TRAILMIX': 'Trail Mix',
    'TUNABLUEFIN': 'Tuna Bluefin',
    'TUNALIGHT': 'Tuna Light',
    'TUNASALAD': 'Tuna Salad',
    'TUNASKIPJACK': 'Tuna Skipjack',
    'TUNAWHITE': 'Tuna White',
    'TUNAYELLOWFIN': 'Tuna Yellowfin',
    'TURKEYBREAST': 'Turkey Breast',
    'TURKEYDRUMSTICK': 'Turkey Drumstick',
    'TURKEYLEG': 'Turkey Leg',
    'TURKEYPOTPIE': 'Turkey Pot Pie',
    'TURKEYSANDWICH': 'Turkey Sandwich',
    'TURKEYSLICED': 'Turkey Sliced',
    'TURKEYWING': 'Turkey Wing',
    'TURNIPGREEN': 'Turnip Green',
    'TURTLEBEANS': 'Turtle Beans',

    # U
    'UCUHUBAOIL': 'Ucuuba Oil',
    
    # V
    'VANILLAPIE': 'Vanilla Pie',
    'VEALBREAST': 'Veal Breast',
    'VEALLOIN': 'Veal Loin',
    'VEALRIB': 'Veal Rib',
    'VEALSHANK': 'Veal Shank',
    'VEALSIRLOIN': 'Veal Sirloin',
    'VEGETABLEJUICE': 'Vegetable Juice',
    'VEGETABLEMIXED': 'Vegetables Mixed',
    'VEGETABLEOIL': 'Vegetable Oil',
    'VINEGARBALSAMIC': 'Vinegar Balsamic',
    'VINEGARCIDER': 'Vinegar Cider',
    'VINEGARDISTILLED': 'Vinegar Distilled',
    'VINEGARREDWINE': 'Vinegar Red Wine',
    
    # W
    'WALNUTOIL': 'Walnut Oil',
    'WATERCHESTNUT': 'Water Chestnut',
    'WHEATGERM': 'Wheat Germ',
    'WHEATGLUTEN': 'Wheat Gluten',
    'WHITEBEAN': 'White Bean',
    'WHOLEWHEAT': 'Whole Wheat',
    'WINGEDBEAN': 'Winged Bean',

   
}


def format_display_name(word: str) -> str:
    """Convert CHICKENWING to 'Chicken Wing' for display"""
    # Check manual splits first
    if word in WORD_SPLITS:
        return WORD_SPLITS[word]
    
    # Simple title case for single words
    return word.capitalize()



# 7 nutrient columns per 100g (from USDA database)
NUTRIENT_COLUMNS_100G = ['cal_100g', 'pro_100g', 'fat_100g', 'carb_100g', 'fib_100g', 'h2o_100g', 'sug_100g']

# USDA database column names for the 7 nutrients
USDA_NUTRIENT_COLUMNS = {
    'cal_100g': 'Energy_KCal',
    'pro_100g': 'Protein',
    'fat_100g': 'TotalLipidFat',
    'carb_100g': 'Carbohydrate',
    'fib_100g': 'FiberTotalDietary',
    'h2o_100g': 'Water',
    'sug_100g': 'SugarsTotal',
}


def get_portion_columns():
    """Generate the list of portion column names for output (no _Cal - calculated at runtime)"""
    columns = []
    for n in PORTION_NUMBERS:
        columns.extend([
            f'M{n}_Amt',
            f'M{n}_Desc', 
            f'M{n}_Gm',
        ])
    return columns


def extract_nutrient_data(cursor, ndb_no: str) -> dict:
    """
    Extract 7 nutrient values per 100g and LONG_DESC for a given NDB_NO
    """
    nutrient_data = {col: '' for col in NUTRIENT_COLUMNS_100G}
    nutrient_data['usda_desc'] = ''  # USDA LONG_DESC
    
    if not ndb_no:
        return nutrient_data
    
    # Build query for nutrient columns + LONG_DESC
    usda_cols = ', '.join(USDA_NUTRIENT_COLUMNS.values()) + ', LONG_DESC'
    query = f"SELECT {usda_cols} FROM DataCentralCombo WHERE NDB_NO = ?"
    
    cursor.execute(query, (ndb_no,))
    row = cursor.fetchone()
    
    if not row:
        return nutrient_data
    
    # Map results to our column names
    for i, col in enumerate(NUTRIENT_COLUMNS_100G):
        value = row[i]
        nutrient_data[col] = round(value, 1) if value is not None else ''
    
    # Add LONG_DESC (last column in query)
    nutrient_data['usda_desc'] = row[len(NUTRIENT_COLUMNS_100G)] or ''
    
    return nutrient_data


def extract_portion_data(cursor, ndb_no: str) -> dict:
    """
    Extract M1-M12 portion data for a given NDB_NO
    Only gram weights and descriptions - calories calculated at runtime
    """
    portion_data = {}
    
    if not ndb_no:
        return portion_data
    
    # Build query for M1-M12 columns (M0 is our 100g standard, not in DB)
    m_columns = []
    for n in range(1, 13):  # M1-M12 only from database
        m_columns.extend([f'M{n}_Amt', f'M{n}_Desc', f'M{n}_Gm_Wgt'])
    
    query = f"SELECT {', '.join(m_columns)} FROM DataCentralCombo WHERE NDB_NO = ?"
    
    cursor.execute(query, (ndb_no,))
    row = cursor.fetchone()
    
    if not row:
        return portion_data
    
    # M0 = Base 100g data for custom amount entry
    portion_data['M0_Amt'] = 1.0
    portion_data['M0_Desc'] = 'custom (g)'
    portion_data['M0_Gm'] = 100.0
    
    # Extract each portion's data (M1-M12) - Amt, Desc, and Gm
    col_idx = 0
    for n in range(1, 13):  # M1-M12 only from database
        amt = row[col_idx]
        desc = row[col_idx + 1]
        gm_wgt = row[col_idx + 2]
        col_idx += 3
        
        # Only include if we have valid data
        if desc and gm_wgt:
            portion_data[f'M{n}_Amt'] = amt if amt else 1.0
            portion_data[f'M{n}_Desc'] = desc
            portion_data[f'M{n}_Gm'] = gm_wgt
        else:
            # Empty values for missing portions
            portion_data[f'M{n}_Amt'] = ''
            portion_data[f'M{n}_Desc'] = ''
            portion_data[f'M{n}_Gm'] = ''
    
    return portion_data


def main():
    print(f"Opening database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print(f"Reading input: {INPUT_CSV}")
    
    results = []
    portion_counts = {i: 0 for i in PORTION_NUMBERS}
    
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            word = row['word']
            ndb_no = row.get('NDB_NO', '').strip()
            
            # NDB_NO is required - it's the unique ID in USDA database
            if not ndb_no:
                print(f"⚠ SKIPPED {word} - no NDB_NO (not in USDA database)")
                continue
            
            # Get nutrient data per 100g
            nutrient_data = extract_nutrient_data(cursor, ndb_no)
            
            # Get portion data from database
            portion_data = extract_portion_data(cursor, ndb_no)
            
            # Count how many portions each food has
            for n in PORTION_NUMBERS:
                if portion_data.get(f'M{n}_Desc'):
                    portion_counts[n] += 1
            
            # Build clean result row
            result = {
                'word': word,
                'display': format_display_name(word),
                'group1': row.get('group1', ''),
                'group2': row.get('group2', ''),
                'group3': row.get('group3', ''),
                'group4': row.get('group4', ''),
                'NDB_NO': ndb_no,
            }
            # Add nutrient data per 100g
            result.update(nutrient_data)
            # Add portion data
            result.update(portion_data)
            results.append(result)
            
            # Show progress with cal/pro/fat/carb
            portion_count = sum(1 for n in PORTION_NUMBERS if portion_data.get(f'M{n}_Desc'))
            cal = nutrient_data.get('cal_100g', '')
            pro = nutrient_data.get('pro_100g', '')
            print(f"✓ {word} → {result['display']} (NDB#{ndb_no}) → {cal}cal, {pro}g pro, {portion_count} portions")
    
    conn.close()
    
    # Output fieldnames: clean columns + nutrient columns + portion columns
    output_fieldnames = ['word', 'display', 'group1', 'group2', 'group3', 'group4', 'NDB_NO', 'usda_desc'] + NUTRIENT_COLUMNS_100G + get_portion_columns()
    
    # Write output CSV
    print(f"\nWriting output: {OUTPUT_CSV}")
    
    with open(OUTPUT_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=output_fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total foods:     {len(results)}")
    print(f"\nPortion coverage:")
    # M0 is always 100% (standard 100g)
    print(f"  M 0: {len(results):4d} foods (100.0%) ████████████████████ (100g standard)")
    for n in range(1, 13):  # M1-M12
        pct = 100 * portion_counts[n] / len(results) if results else 0
        bar = '█' * int(pct / 5) + '░' * (20 - int(pct / 5))
        print(f"  M{n:2d}: {portion_counts[n]:4d} foods ({pct:5.1f}%) {bar}")
    
    print(f"\nOutput saved to: {OUTPUT_CSV}")
    print(f"\nNutrient columns per 100g:")
    for col in NUTRIENT_COLUMNS_100G:
        usda_col = USDA_NUTRIENT_COLUMNS[col]
        print(f"  {col:12s} ← {usda_col}")
    print(f"\nColumn structure for each portion (M0-M12):")
    print(f"  M0      - Standard 100g portion (always available)")
    print(f"  M#_Desc - Description for dropdown (e.g., 'cup, sliced')")
    print(f"  M#_Gm   - Weight in grams")
    print(f"  (Calories calculated at runtime: grams / 100 * cal_100g)")


if __name__ == "__main__":
    main()
