#!/usr/bin/env python3
"""
Match food words from food-groups-edit.csv to NDB_NO in comboo.db
Outputs food-groups-with-ndb.csv for manual verification

Strategy (no fuzzy matching):
1. Exact keyword match (case-insensitive)
2. Compound word expansion (HALFANDHALF → "half and half")
3. Long_Desc starts with word
4. Long_Desc contains ", word" or "word," pattern
"""

import sqlite3
import csv
import re
from pathlib import Path

# Paths
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
INPUT_CSV = "/Volumes/training/Daily Food Chain/daily-food-chain/food-groups-edit.csv"
OUTPUT_CSV = "/Volumes/training/Daily Food Chain/daily-food-chain/food-groups-with-ndb-no.csv"

# Compound word mappings (manual overrides for tricky compounds)
COMPOUND_EXPANSIONS = {
    "HALFANDHALF": "half and half",
    "MACANDCHEESE": "macaroni and cheese",
    "PEANUTBUTTER": "peanut butter",
    "ALMONDBUTTER": "almond butter",
    "CASHEWBUTTER": "cashew butter",
    "SESAMEBUTTER": "sesame butter",
    "ALMONDMILK": "almond milk",
    "ALMONDPASTE": "almond paste",
    "OATMILK": "oat milk",
    "SOYMILK": "soymilk",
    "COCOMILK": "coconut milk",
    "COCONUTMILK": "coconut milk",
    "RICEMILK": "rice milk",
    "CASHEWMILK": "cashew milk",
    "GOATMILK": "goat milk",
    "SOURCREAM": "sour cream",
    "CREAMCHEESE": "cream cheese",
    "COTTAGECHEESE": "cottage cheese",
    "BLUECHEESE": "blue cheese",
    "SWISSCHEESE": "swiss cheese",
    "BREADCHEESE": "bread cheese",
    "ICECREAM": "ice cream",
    "GREENBEAN": "green beans",
    "GREENBEANS": "green beans",
    "BLACKBEAN": "black beans",
    "BLACKBEANS": "black beans",
    "KIDNEYBEAN": "kidney beans",
    "PINTOBEAN": "pinto beans",
    "PINTOBEANS": "pinto beans",
    "LIMABEAN": "lima beans",
    "LIMABEANS": "lima beans",
    "NAVYBEAN": "navy beans",
    "NAVYBEANS": "navy beans",
    "WHITEBEAN": "white beans",
    "REDBEAN": "red beans",
    "NORTHERNBEAN": "great northern",
    "FAVABEAN": "fava beans",
    "MUNGBEAN": "mung beans",
    "SNAPBEAN": "snap beans",
    "SHELLIEBEAN": "shellie beans",
    "FRENCHBEAN": "french beans",
    "TURTLEBEANS": "black turtle",
    "WINGEDBEAN": "winged beans",
    "CANNELLINI": "cannellini",
    "CHICKPEA": "chickpea",
    "BLACKEYED": "black-eyed",
    "SPLITPEA": "split peas",
    "SWEETPOTATO": "sweet potato",
    "BELLPEPPER": "bell pepper",
    "HOTDOG": "hot dog",
    "CORNDOG": "corn dog",
    "SUNFLOWER": "sunflower",
    "OLIVEOIL": "olive oil",
    "COCONUTOIL": "coconut oil",
    "SESAMEOIL": "sesame oil",
    "CANOLAOIL": "canola oil",
    "CORNOIL": "corn oil",
    "PEANUTOIL": "peanut oil",
    "HAZELNUTOIL": "hazelnut oil",
    "GRAPESEED": "grapeseed",
    "COCOABUTTER": "cocoa butter",
    "RICEBRAN": "rice bran",
    "OATBRAN": "oat bran",
    "BROWNRICE": "brown rice",
    "WHITERICE": "white rice",
    "WILDRICE": "wild rice",
    "FRIEDRICE": "fried rice",
    "OATMEAL": "oatmeal",
    "CORNMEAL": "cornmeal",
    "CORNFLAKES": "corn flakes",
    "BLUECORN": "blue corn",
    "RICEKRISPIES": "rice krispies",
    "CHEERIOS": "cheerios",
    "GRANOLA": "granola",
    "WHOLEGRAIN": "whole grain",
    "WHOLEWHEAT": "whole wheat",
    "SOURDOUGH": "sourdough",
    "PUMPERNICKEL": "pumpernickel",
    "FRENCHBREAD": "french bread",
    "WHITEBREAD": "white bread",
    "RYEBREAD": "rye bread",
    "PITABREAD": "pita bread",
    "PIKIBREAD": "piki bread",
    "FLATBREAD": "flatbread",
    "GARLICBREAD": "garlic bread",
    "TORTILLA": "tortilla",
    "CORNBREAD": "cornbread",
    "PANCAKE": "pancake",
    "WAFFLE": "waffle",
    "FRENCHTOAST": "french toast",
    "FRENCHFRIES": "french fries",
    "HASHBROWN": "hash brown",
    "ONIONRING": "onion rings",
    "POTATOCHIP": "potato chips",
    "EGGSALAD": "egg salad",
    "TUNASALAD": "tuna salad",
    "CHICKENSALAD": "chicken salad",
    "POTATOSALAD": "potato salad",
    "COLDSLAW": "coleslaw",
    "APPLECIDER": "apple cider",
    "APPLEJUICE": "apple juice",
    "ORANGEJUICE": "orange juice",
    "GRAPEJUICE": "grape juice",
    "GRAPEFRUIT": "grapefruit",
    "GRAPELEAVE": "grape leaves",
    "TOMATOJUICE": "tomato juice",
    "CRANBERRY": "cranberry",
    "POMEGRANATE": "pomegranate",
    "BLUEBERRY": "blueberry",
    "BLACKBERRY": "blackberry",
    "RASPBERRY": "raspberry",
    "STRAWBERRY": "strawberry",
    "BOYSENBERRY": "boysenberries",
    "GOOSEBERRY": "gooseberries",
    "MULBERRY": "mulberries",
    "ELDERBERRY": "elderberries",
    "HUCKLEBERRY": "huckleberries",
    "LINGONBERRY": "lingonberries",
    "LOGANBERRY": "loganberries",
    "OHELOBERRY": "ohelo berries",
    "CLOUDBERRY": "cloudberries",
    "PASSIONFRUIT": "passion fruit",
    "DRAGONFRUIT": "pitaya",
    "STARFRUIT": "carambola",
    "JACKFRUIT": "jackfruit",
    "BREADFRUIT": "breadfruit",
    "PRICKLYPEAR": "prickly pear",
    "HONEYDEW": "honeydew",
    "CANTALOUPE": "cantaloupe",
    "WATERMELON": "watermelon",
    "ROCKMELON": "rockmelon",
    "GROUNDBEEF": "ground beef",
    "BEEFSTEAK": "beef steak",
    "BEEFSTEW": "beef stew",
    "CORNEDBEEF": "corned beef",
    "RIBEYE": "ribeye",
    "FLANKSTEAK": "flank steak",
    "ROUNDSTEAK": "round steak",
    "STRIPSTEAK": "strip steak",
    "CHUCKROAST": "chuck roast",
    "POTROAST": "pot roast",
    "EYEOFROUND": "eye of round",
    "TBONE": "t-bone",
    "MIGNON": "filet mignon",
    "PORKLOIN": "pork loin",
    "PORKCHOP": "pork chop",
    "PORKBELLY": "pork belly",
    "SALTPORK": "salt pork",
    "HAMHOCK": "ham hock",
    "BABYBACK": "baby back ribs",
    "SPARERIBS": "spare ribs",
    "LAMBCHOP": "lamb chop",
    "CHICKENBREAST": "chicken breast",
    "CHICKENTHIGH": "chicken thigh",
    "CHICKENWING": "chicken wing",
    "CHICKENLIVER": "chicken liver",
    "DRUMETTE": "drumette",
    "TENDERS": "chicken tenders",
    "TURKEYBACON": "turkey bacon",
    "TURKEYBREAST": "turkey breast",
    "SEAFOOD": "seafood",
    "SHELLFISH": "shellfish",
    "FISHSTICK": "fish sticks",
    "CRABMEAT": "crab meat",
    "LOBSTERTAIL": "lobster tail",
    "CRAWFISH": "crayfish",
    "PRAWN": "prawns",
    "CALAMARI": "squid",
    "SWORDFISH": "swordfish",
    "CATFISH": "catfish",
    "WHITEFISH": "whitefish",
    "BLUEFISH": "bluefish",
    "ROCKFISH": "rockfish",
    "MONKFISH": "monkfish",
    "KINGFISH": "kingfish",
    "SUNFISH": "sunfish",
    "REDFISH": "redfish",
    "TILAPIA": "tilapia",
    "MAHI": "mahi",
    "MAHIMAHI": "mahi mahi",
    "SEABASS": "sea bass",
    "FLOUNDER": "flatfish",
    "SOLE": "flatfish, flounder and sole",
    "SCROD": "cod",
    "HAKE": "hake",
    "TOMATOSAUCE": "tomato sauce",
    "APPLESAUCE": "applesauce",
    "MAPLESYRUP": "maple syrup",
    "CORNSYRUP": "corn syrup",
    "HONEYCOMB": "honeycomb",
    "MOLASSES": "molasses",
    "AGAVE": "agave",
    "STEVIA": "stevia",
    "SPLENDA": "splenda",
    "CANESUGAR": "cane sugar",
    "BROWNSUGAR": "brown sugar",
    "POWDEREDSUGAR": "powdered sugar",
    "BAYLEAF": "bay leaf",
    "CURRYPOWDER": "curry powder",
    "CHILEPOWDER": "chile powder",
    "CHILIPOWDER": "chili powder",
    "CAYENNE": "cayenne",
    "GARLICPOWDER": "garlic powder",
    "ONIONPOWDER": "onion powder",
    "SESAMEPASTE": "sesame paste",
    "SESAMEFLOUR": "sesame flour",
    "FISHSAUCE": "fish sauce",
    "SOYSAUCE": "soy sauce",
    "TERIYAKI": "teriyaki",
    "WORCESTERSHIRE": "worcestershire",
    "HOTSAUCE": "hot sauce",
    "TOBASCO": "tabasco",
    "SRIRACHA": "sriracha",
    "BBQSAUCE": "bbq sauce",
    "MAYONNAISE": "mayonnaise",
    "MUSTARD": "mustard",
    "KETCHUP": "catsup",
    "RELISH": "pickle relish",
    "RANCHDRESSING": "ranch dressing",
    "HORSERADISH": "horseradish",
    "WASABI": "wasabi",
    "SEAWEED": "seaweed",
    "KELP": "kelp",
    "SPIRULINA": "spirulina",
    "NUTRITIONAL": "nutritional",
    "WHEATGERM": "wheat germ",
    "FLAXSEED": "flaxseed",
    "CHIASEED": "chia seeds",
    "HEMPSEED": "hemp seed",
    "PUMPKINSEED": "pumpkin seeds",
    "SUNFLOWERSEED": "sunflower seeds",
    "SESAMECEED": "sesame seeds",
    "CELERYSEED": "celery seed",
    "POPPY": "poppy",
    "POPPYSEED": "poppy seed",
    "CARAWAY": "caraway",
    "CORIANDER": "coriander",
    "CUMIN": "cumin",
    "FENNEL": "fennel",
    "FENUGREEK": "fenugreek",
    "FENGUGREEK": "fenugreek",
    "TAMARIND": "tamarind",
    "LEMONGRASS": "lemongrass",
    "GALANGAL": "galangal",
    "CARDAMOM": "cardamom",
    "CINNAMON": "cinnamon",
    "NUTMEG": "nutmeg",
    "ALLSPICE": "allspice",
    "CLOVE": "cloves",
    "GINGER": "ginger",
    "TURMERIC": "turmeric",
    "PAPRIKA": "paprika",
    "SAFFRON": "saffron",
    "VANILLA": "vanilla",
    "COCOAPOWDER": "cocoa powder",
    "BAKINGPOWDER": "baking powder",
    "BAKINGSODA": "baking soda",
    "CORNSTARCH": "cornstarch",
    "ARROWROOT": "arrowroot",
    "TAPIOCA": "tapioca",
    "GELATIN": "gelatin",
    "PECTIN": "pectin",
    "AGAR": "agar",
    "XANTHANGUM": "xanthan gum",
    "GUARGUM": "guar gum",
    "BRUSSELSPROUTS": "brussels sprouts",
    "MUSTARDGREEN": "mustard greens",
    "SWISSCHARD": "swiss chard",
    "BOK": "bok choy",
    "CHOY": "bok choy",
    "SCALLION": "scallion",
    "ANGLEFOOD": "angel food",
    "POUNDCAKE": "pound cake",
    "SPONGECAKE": "sponge cake",
    "EGGROLL": "egg roll",
    "POTPIE": "pot pie",
    "QUICHE": "quiche",
    "TRAILMIX": "trail mix",
    "ACORNFLOUR": "acorn flour",
    "SORGHUMFLOUR": "sorghum flour",
    "POLENTA": "polenta",
    "GRITS": "grits",
    "FARRO": "farro",
    "JICAMA": "jicama",
    "PLAINTAIN": "plantains",
    "MOUNTAINYAM": "mountain yam",
    "NETTLES": "stinging nettles",
    "SORREL": "sorrel",
    "FERN": "fern",
    "CHOKECHERRY": "chokecherries",
    "SOYNUT": "soybeans",
    "SOYLECITHIN": "soy lecithin",
    "LECITHIN": "lecithin",
    "CASEIN": "casein",
    "GHEE": "ghee",
    "TALLOW": "tallow",
    "SPRAYOIL": "cooking spray",
    "FILBERT": "hazelnuts",
    "LICHEE": "litchis",
    "LYCHEE": "litchis",
    "CUPUASSU": "cupuassu",
    "BALSAMPEAR": "balsam-pear",
    "PIMIENTO": "pimiento",
    "BAKEDBEANS": "baked beans",
    "RANCHSTYLE": "ranch style",
    "PROSCIUTTO": "ham, prosciutto",
    "APRICOTJAM": "jam, apricot",
    "APRICOTOIL": "apricot kernel oil",
    "ICING": "frosting",
    "PANDULCE": "pan dulce",
    "TRICALE": "triticale",
    "SUNN": "sunn hemp",
    "PINTOBEAN": "beans, pinto",
    "NAVYBEAN": "beans, navy",
    "WHITEBEAN": "beans, white",
    "SPLITPEA": "peas, split",
    "SNAPBEAN": "beans, snap",
    "FLANKSTEAK": "flank, steak",
    "CHUCKROAST": "chuck, under blade",
    "LAMBCHOP": "lamb, loin, chop",
    "PORKBELLY": "pork, fresh, belly",
    "BLUECHEESE": "cheese, blue",
    "GOATMILK": "milk, goat",
    "MIGNON": "tenderloin, steak",
    "FRENCHBREAD": "bread, french",
    "SHELLFISH": "crustaceans",
    "DRUMETTE": "chicken, wing, drumette",
    "FRYERS": "chicken, broilers or fryers",
    "BOK": "cabbage, chinese",
    "CHOY": "cabbage, chinese (pak-choi)",
    "LINGONBERRY": "cranberries",
    "SORREL": "dock",
    "SEALION": "sea lion",
    "SERANO": "peppers, serrano",
    "HAZELNUTOIL": "oil, hazelnut",
    "GRITS": "corn grits",
    "QUICHE": "quiche, bacon",
    "SPONGECAKE": "cake, sponge",
    "PROSCIUTTO": "ham, prosciutto",
    "PORTDESALUT": "cheese, port de salut",
    "BREADCHEESE": "cheese, pasteurized process",
    "SHELLIEBEAN": "beans, shellie",
    "FRENCHBEAN": "beans, french",
    "SOYLECITHIN": "soy lecithin",
    "FERN": "fiddlehead ferns",
    "OHELOBERRY": "ohelo berries",
    "MOUSENUT": "breadnut tree seeds",
    "ACORNSTEW": "acorn stew",
}

# Preferred NDB selections for common words (when multiple matches exist)
# Format: word -> preferred NDB_NO (most generic/common form)
PREFERRED_NDB = {
    "APPLE": "9003",      # Apples, raw, with skin
    "BANANA": "9040",     # Bananas, raw
    "ORANGE": "9200",     # Oranges, raw, all commercial varieties
    "CHICKEN": "5064",    # Chicken, broilers or fryers, meat only, cooked, roasted
    "BEEF": "13364",      # Beef, ground, 85% lean meat / 15% fat, raw
    "PORK": "10062",      # Pork, fresh, loin, whole, separable lean only, raw
    "SALMON": "15076",    # Fish, salmon, Atlantic, wild, raw
    "TUNA": "15121",      # Fish, tuna, light, canned in water, drained solids
    "EGG": "1123",        # Egg, whole, raw, fresh
    "MILK": "1077",       # Milk, whole, 3.25% milkfat
    "CHEESE": "1009",     # Cheese, cheddar
    "BUTTER": "1001",     # Butter, salted
    "BREAD": "18069",     # Bread, white, commercially prepared
    "RICE": "20044",      # Rice, white, long-grain, regular, raw
    "PASTA": "20120",     # Pasta, dry, enriched
    "POTATO": "11352",    # Potatoes, flesh and skin, raw
    "CARROT": "11124",    # Carrots, raw
    "TOMATO": "11529",    # Tomatoes, red, ripe, raw, year round average
    "ONION": "11282",     # Onions, raw
    "BROCCOLI": "11090",  # Broccoli, raw
    "SPINACH": "11457",   # Spinach, raw
    "LETTUCE": "11252",   # Lettuce, iceberg (includes crisphead types), raw
    "CORN": "11167",      # Corn, sweet, yellow, raw
    "BEANS": "16014",     # Beans, black, mature seeds, raw
    "LENTILS": "16069",   # Lentils, raw
    "TOFU": "16126",      # Tofu, raw, regular, prepared with calcium sulfate
    "YOGURT": "1116",     # Yogurt, plain, whole milk
    "CREAM": "1049",      # Cream, fluid, half and half
    "SUGAR": "19335",     # Sugars, granulated
    "HONEY": "19296",     # Honey
    "SALT": "2047",       # Salt, table
    "PEPPER": "2030",     # Spices, pepper, black
    "GARLIC": "11215",    # Garlic, raw
    "OIL": "4053",        # Oil, olive, salad or cooking
    "VINEGAR": "2048",    # Vinegar, distilled
    "WATER": "14411",     # Water, bottled, generic
    "COFFEE": "14209",    # Coffee, brewed from grounds, prepared with tap water
    "TEA": "14355",       # Tea, brewed, prepared with tap water
    "JUICE": "9206",      # Orange juice, raw
    "WINE": "14106",      # Alcoholic beverage, wine, table, red
    "BEER": "14003",      # Alcoholic beverage, beer, regular, all
    # Additional common items
    "VENISON": "17164",   # Game meat, deer, raw
    "BRUSSELSPROUTS": "11098",  # Brussels sprouts, raw
    "FLOUNDER": "15029",  # Fish, flatfish (flounder and sole species), raw
    "SOLE": "15029",      # Fish, flatfish (flounder and sole species), raw
    "HAKE": "15036",      # Fish, hake, raw
    "CRAWFISH": "15144",  # Crustaceans, crayfish, mixed species, wild, raw
    "PRAWN": "15151",     # Crustaceans, shrimp, mixed species, raw
    "CALAMARI": "15174",  # Mollusks, squid, mixed species, raw
    "KETCHUP": "11935",   # Catsup
    "RELISH": "11944",    # Pickle relish, sweet
    "GHEE": "1003",       # Butter, clarified (ghee)
    "FILBERT": "12120",   # Nuts, hazelnuts or filberts
    "BOYSENBERRY": "9042",# Boysenberries, frozen, unsweetened
    "GOOSEBERRY": "9107", # Gooseberries, raw
    "MULBERRY": "9190",   # Mulberries, raw
    "ELDERBERRY": "9098", # Elderberries, raw
    "HUCKLEBERRY": "9044",# Blueberries, wild (closest)
    "DRAGONFRUIT": "9419",# Pitaya (dragonfruit), raw
    "STARFRUIT": "9060",  # Carambola (starfruit), raw
    "LICHEE": "9164",     # Litchis, raw
    "LYCHEE": "9164",     # Litchis, raw
    "JICAMA": "11603",    # Yambean (jicama), raw
    "GRITS": "8163",      # Corn, white, hominy, canned
    "POLENTA": "20022",   # Cornmeal, yellow, whole-grain
    "FARRO": "20076",     # Wheat, KAMUT khorasan (closest)
    "SCALLION": "11291",  # Onions, spring or scallions
    "SWISSCHARD": "11147",# Chard, swiss, raw
    "CAYENNE": "2031",    # Spices, pepper, red or cayenne
    "GORGONZOLA": "1004", # Blue cheese
    "MANCHEGO": "1040",   # Cheese, parmesan, hard
    "MASCARPONE": "1179", # Cheese, cream
    "HAVARTI": "1011",    # Cheese, brick
    "PECORINO": "1038",   # Cheese, parmesan, shredded
    "STILTON": "1004",    # Blue cheese
    "PORTDESALUT": "1150",# Cheese, port de salut
    "TALLOW": "4002",     # Beef tallow
    "LECITHIN": "4544",   # Lecithin, soy
    "CASEIN": "1099",     # Milk protein isolate (closest to casein)
    "PLAINTAIN": "9277",  # Plantains, raw
    "PRICKLYPEAR": "9287",# Prickly pears, raw
    "ICING": "19230",     # Frosting, vanilla, creamy, ready-to-eat
    "ANGLEFOOD": "18087", # Cake, angelfood, commercially prepared
    "POUNDCAKE": "18133", # Cake, pound, commercially prepared
    "SPONGECAKE": "18137",# Cake, sponge, commercially prepared
    "QUICHE": "18330",    # Quiche, cheese, commercial (using Lorraine)
    "EGGROLL": "43145",   # Egg rolls, vegetable, frozen
    "POTPIE": "22905",    # Pot pie, chicken, frozen entree
    "CORNDOG": "21138",   # Corn dog, frozen, prepared
    "FISHSTICK": "15027", # Fish, fish sticks, frozen, prepared
    "HASHBROWN": "11392", # Potatoes, hash brown, frozen, plain
    "FRENCHFRIES": "11403",# Potatoes, french fried, frozen, oven-heated
    "ONIONRING": "11289", # Onion rings, breaded, frozen, prepared
    "POTATOCHIP": "19411",# Potato chips, plain, salted
    "TRAILMIX": "19862",  # Trail mix, regular
    "BAKEDBEANS": "16006",# Beans, baked, canned, plain or vegetarian
    "OATBRAN": "20033",   # Oat bran, raw
    # Remaining unmatched items with manual NDB
    "APRICOTJAM": "19719",# Jams and preserves (closest)
    "APRICOTOIL": "4506", # Oil, apricot kernel
    "CUPUASSU": "9003",   # No exact match - use fruit placeholder
    "DRAGONFRUIT": "9421",# Pitaya (dragonfruit) - try alternate
    "DRUMETTE": "5308",   # Chicken, wing, drummette
    "LAMBCHOP": "17078",  # Lamb, New Zealand, loin chop
    "OHELOBERRY": "9192", # Oheloberries, raw
    "PIMIENTO": "11943",  # Pimento, canned
    "PROSCIUTTO": "7057", # Ham, sliced, prepackaged, deli meat
    "SOYLECITHIN": "4544",# Lecithin, soy
    "SUNN": "12012",      # Seeds, hemp seed, hulled (Sunn hemp closest)
    "CASEIN": "1068",     # Cream substitute with sodium caseinate (closest)
    "QUICHE": "18317",    # Pie, egg custard, commercially prepared (closest)
}


def expand_compound_word(word: str) -> str:
    """Expand compound words like HALFANDHALF to 'half and half'"""
    # Check manual mappings first
    if word in COMPOUND_EXPANSIONS:
        return COMPOUND_EXPANSIONS[word]
    
    # Try to split camelCase-like patterns (insert spaces before capitals)
    # e.g., ALMONDBUTTER isn't camelCase but we can try common splits
    
    # Return lowercase version as fallback
    return word.lower()


def find_ndb_matches(cursor, word: str) -> list:
    """
    Find NDB matches for a food word using exact matching strategies
    Returns list of (NDB_NO, Long_Desc, match_type) tuples
    """
    matches = []
    expanded = expand_compound_word(word)
    word_lower = word.lower()
    
    # Strategy 1: Check preferred NDB first
    if word in PREFERRED_NDB:
        cursor.execute(
            "SELECT NDB_NO, Long_Desc FROM DataCentralCombo WHERE NDB_NO = ?",
            (PREFERRED_NDB[word],)
        )
        row = cursor.fetchone()
        if row:
            return [(row[0], row[1], "PREFERRED")]
    
    # Strategy 2: Exact keyword match
    cursor.execute(
        "SELECT NDB_NO, Long_Desc FROM DataCentralCombo WHERE LOWER(keyword) = ? LIMIT 10",
        (word_lower,)
    )
    for row in cursor.fetchall():
        matches.append((row[0], row[1], "KEYWORD_EXACT"))
    
    # Strategy 3: Expanded compound match in Long_Desc
    if expanded != word_lower:
        cursor.execute(
            "SELECT NDB_NO, Long_Desc FROM DataCentralCombo WHERE LOWER(Long_Desc) LIKE ? LIMIT 10",
            (f"%{expanded}%",)
        )
        for row in cursor.fetchall():
            if (row[0], row[1], "KEYWORD_EXACT") not in matches:
                matches.append((row[0], row[1], "COMPOUND_MATCH"))
    
    # Strategy 4: Long_Desc starts with word
    cursor.execute(
        "SELECT NDB_NO, Long_Desc FROM DataCentralCombo WHERE LOWER(Long_Desc) LIKE ? LIMIT 10",
        (f"{word_lower}%",)
    )
    for row in cursor.fetchall():
        key = (row[0], row[1])
        if not any(m[0] == row[0] for m in matches):
            matches.append((row[0], row[1], "DESC_STARTS"))
    
    # Strategy 5: Long_Desc contains ", word" pattern (word as ingredient)
    cursor.execute(
        "SELECT NDB_NO, Long_Desc FROM DataCentralCombo WHERE LOWER(Long_Desc) LIKE ? LIMIT 5",
        (f"%, {word_lower}%",)
    )
    for row in cursor.fetchall():
        if not any(m[0] == row[0] for m in matches):
            matches.append((row[0], row[1], "DESC_CONTAINS"))
    
    return matches


def pick_best_match(matches: list, word: str) -> tuple:
    """
    Pick the best match from candidates
    Prefer: raw > cooked, with skin > without, whole > parts
    Returns (NDB_NO, Long_Desc, match_type) or (None, None, None)
    """
    if not matches:
        return (None, None, "NO_MATCH")
    
    if len(matches) == 1:
        return matches[0]
    
    # Scoring heuristics
    def score_match(m):
        ndb, desc, match_type = m
        desc_lower = desc.lower()
        score = 0
        
        # Match type priority
        if match_type == "PREFERRED":
            score += 1000
        elif match_type == "KEYWORD_EXACT":
            score += 100
        elif match_type == "COMPOUND_MATCH":
            score += 80
        elif match_type == "DESC_STARTS":
            score += 50
        
        # Prefer COOKED over raw (people eat cooked food!)
        if "cooked" in desc_lower:
            score += 25
        if "roasted" in desc_lower:
            score += 20
        if "baked" in desc_lower:
            score += 18
        if "grilled" in desc_lower:
            score += 18
        if "broiled" in desc_lower:
            score += 15
        if "boiled" in desc_lower:
            score += 12
        if "fried" in desc_lower:
            score += 10
        
        # Raw is okay for fruits/vegetables but not proteins
        if ", raw" in desc_lower:
            score += 5  # Lower priority than cooked
        
        # Prefer with skin (more nutrients)
        if "with skin" in desc_lower:
            score += 5
        
        # Prefer whole forms
        if "whole" in desc_lower:
            score += 5
        
        # Penalize very specific preparations
        if "canned" in desc_lower:
            score -= 10
        if "dried" in desc_lower and "fruit" not in word.lower():
            score -= 5
        if "frozen" in desc_lower:
            score -= 8
        if "baby food" in desc_lower:
            score -= 50
        if "infant" in desc_lower:
            score -= 50
        if "unprepared" in desc_lower:
            score -= 5
        
        return score
    
    # Sort by score descending
    sorted_matches = sorted(matches, key=score_match, reverse=True)
    return sorted_matches[0]


# Letters to skip (already verified by user)
SKIP_LETTERS = {'A', 'B'}


def main():
    print(f"Opening database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Load existing verified data (A-B) from output file if it exists
    existing_data = {}
    try:
        with open(OUTPUT_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                word = row['word'].strip()
                first_letter = word[0].upper() if word else ''
                if first_letter in SKIP_LETTERS:
                    existing_data[word] = row
        print(f"Loaded {len(existing_data)} verified entries (A-B) from existing file")
    except FileNotFoundError:
        print("No existing output file found, processing all entries")
    
    print(f"Reading input: {INPUT_CSV}")
    
    results = []
    no_match_count = 0
    match_count = 0
    skipped_count = 0
    
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        
        for row in reader:
            word = row['word'].strip()
            first_letter = word[0].upper() if word else ''
            
            # Skip A-B, use existing verified data
            if first_letter in SKIP_LETTERS and word in existing_data:
                results.append(existing_data[word])
                skipped_count += 1
                print(f"⏭ {word} → (preserved from verified data)")
                continue
            
            # Find matches for C onwards
            matches = find_ndb_matches(cursor, word)
            best = pick_best_match(matches, word)
            
            ndb_no, long_desc, match_type = best
            
            # Add to results
            result = dict(row)
            result['NDB_NO'] = ndb_no or ""
            result['USDA_Desc'] = long_desc or ""
            result['Match_Type'] = match_type
            result['Alt_Matches'] = len(matches)
            
            results.append(result)
            
            if ndb_no:
                match_count += 1
                print(f"✓ {word} → {ndb_no} ({match_type})")
            else:
                no_match_count += 1
                print(f"✗ {word} → NO MATCH")
    
    conn.close()
    
    # Write output CSV
    print(f"\nWriting output: {OUTPUT_CSV}")
    
    output_fieldnames = fieldnames + ['NDB_NO', 'USDA_Desc', 'Match_Type', 'Alt_Matches']
    
    with open(OUTPUT_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=output_fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n{'='*50}")
    print(f"SUMMARY")
    print(f"{'='*50}")
    print(f"Total words:    {len(results)}")
    print(f"Preserved A-B:  {skipped_count}")
    print(f"Matched C+:     {match_count} ({100*match_count/(len(results)-skipped_count):.1f}%)")
    print(f"No match:       {no_match_count}")
    print(f"\nOutput saved to: {OUTPUT_CSV}")
    print(f"Please review and verify NDB_NO assignments.")


if __name__ == "__main__":
    main()
