#!/usr/bin/env python3
"""Generate src/lib/farmers-basket/generated-levels.ts from recipe CSVs."""

import csv
import json
import os
import re
import sqlite3

BASE = '/Volumes/training/Daily Food Chain/daily-food-chain'
RECIPES_CSV      = f'{BASE}/src/lib/data/recipes.csv'
INGREDIENTS_CSV  = f'{BASE}/src/lib/data/recipe_ingredients.csv'
INSTRUCTIONS_CSV = f'{BASE}/src/lib/data/recipe_instructions.csv'
OUTPUT           = f'{BASE}/src/lib/farmers-basket/generated-levels.ts'
COMBOO_DB        = '/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db'
DEV_DB           = f'{BASE}/recipes_dev.db'

CANONICAL_NUTRIENT_COLS = {
    'Energy_KCal': 'cal',
    'Protein': 'pro',
    'TotalLipidFat': 'fat',
    'Carbohydrate': 'carb',
    'FiberTotalDietary': 'fib',
    'SugarsTotal': 'sug',
    'Water': 'h2o',
}

ALL_FOODS = ['lettuce','tomato','carrot','cheese','egg','bread','apple','grapes','bacon','butter','chicken','fish']

FOOD_ANIMAL = {
    'lettuce': 'rabbit', 'carrot': 'rabbit',
    'cheese':  'mouse',  'bread':  'mouse',
    'grapes':  'bird',   'fish':   'bird',
    'egg':     'fox',    'bacon':  'fox',    'chicken': 'fox',
    'apple':   'squirrel',
    'tomato':  'raccoon', 'butter': 'raccoon',
}

# Semantic mapping: recipe_id → FoodType[] for the game board
RECIPE_FOODS = {
    # Beverages
    'BEV_001': ['grapes', 'butter'],
    'BEV_002': ['grapes', 'butter'],
    # Breakfast
    'BFAST_001': ['carrot', 'butter'],
    'BFAST_002': ['egg', 'bread', 'butter'],
    'BFAST_003': ['egg', 'grapes', 'bread'],
    'BFAST_004': ['egg', 'butter', 'bread'],
    'BFAST_005': ['egg', 'grapes', 'bread'],
    'BFAST_006': ['egg', 'butter', 'bread'],
    'BFAST_007': ['egg', 'butter', 'bread'],
    # Dinner
    'DINR_001': ['bacon', 'carrot', 'butter'],
    'DINR_002': ['bacon', 'carrot', 'tomato'],
    'DINR_003': ['bacon', 'cheese', 'bread'],
    'DINR_004': ['cheese', 'bread', 'tomato'],
    'DINR_005': ['bacon', 'cheese', 'bread'],
    'DINR_006': ['bread', 'tomato'],
    'DINR_007': ['chicken', 'cheese', 'tomato'],
    'DINR_008': ['chicken', 'carrot', 'butter'],
    'DINR_009': ['chicken', 'tomato'],
    'DINR_010': ['chicken', 'carrot'],
    'DINR_011': ['bacon', 'tomato', 'carrot'],
    'DINR_012': ['tomato', 'carrot'],
    'DINR_013': ['bacon', 'carrot', 'tomato'],
    'DINR_014': ['chicken', 'carrot', 'bread'],
    'DINR_015': ['chicken', 'carrot'],
    'DINR_016': ['chicken', 'carrot', 'grapes'],
    'DINR_017': ['chicken', 'carrot'],
    'DINR_018': ['fish', 'carrot'],
    'DINR_019': ['chicken', 'grapes', 'carrot'],
    'DINR_020': ['bacon', 'grapes', 'carrot'],
    'DINR_021': ['carrot', 'lettuce', 'bread'],
    'DINR_022': ['carrot', 'lettuce', 'bread'],
    'DINR_023': ['cheese', 'bread', 'tomato'],
    'DINR_024': ['cheese', 'egg', 'tomato'],
    'DINR_025': ['bacon', 'cheese', 'tomato'],
    'DINR_026': ['bacon', 'egg', 'bread'],
    'DINR_027': ['chicken', 'tomato', 'butter'],
    'DINR_029': ['tomato', 'bread'],
    'DINR_031': ['cheese', 'egg', 'tomato'],
    'DINR_032': ['bacon', 'cheese', 'lettuce'],
    'DINR_033': ['chicken', 'cheese', 'lettuce'],
    'DINR_034': ['cheese', 'bread'],
    'DINR_035': ['bacon', 'bread'],
    'DINR_036': ['bacon', 'carrot'],
    'DINR_037': ['chicken', 'carrot', 'butter'],
    # Japan
    'JAPAN_003': ['bread', 'butter', 'carrot'],  # miso paste — fermented soybean
    # Lunch
    'LUNCH_001': ['bacon', 'cheese', 'bread'],
    'LUNCH_002': ['bacon', 'bread', 'tomato'],
    'LUNCH_003': ['bacon', 'bread', 'lettuce'],
    'LUNCH_004': ['carrot', 'egg', 'bread'],
    'LUNCH_005': ['bacon', 'bread', 'tomato'],
    'LUNCH_006': ['cheese', 'bread'],
    'LUNCH_007': ['bacon', 'lettuce', 'bread'],
    'LUNCH_008': ['egg', 'carrot'],
    'LUNCH_009': ['egg', 'carrot', 'tomato'],
    # Salads
    'SALAD_001': ['carrot', 'egg', 'tomato'],
    'SALAD_002': ['lettuce', 'bacon', 'tomato'],
    'SALAD_003': ['fish', 'carrot', 'tomato'],
    # Sides
    'SIDE_001': ['butter', 'bread'],
    'SIDE_002': ['egg', 'bread', 'butter'],
    'SIDE_003': ['egg', 'bread', 'butter'],
    'SIDE_004': ['cheese', 'butter', 'bread'],
    'SIDE_005': ['tomato', 'carrot'],
    'SIDE_006': ['butter', 'carrot'],
    'SIDE_007': ['carrot', 'butter'],
    'SIDE_008': ['egg', 'carrot', 'butter'],
    'SIDE_009': ['egg', 'butter', 'bread'],
    'SIDE_010': ['egg', 'butter', 'bread'],
    'SIDE_011': ['egg', 'butter', 'bread'],
    'SIDE_012': ['cheese', 'butter', 'bread'],
    # Snacks
    'SNACK_001': ['bacon', 'bread', 'egg'],
    'SNACK_002': ['carrot', 'bread', 'bacon'],
    'SNACK_003': ['chicken', 'carrot', 'bread'],
    'SNACK_004': ['bacon', 'carrot', 'bread'],
    'SNACK_005': ['carrot', 'butter'],
    # Sweets
    'SWEET_001': ['apple', 'bread'],
    'SWEET_002': ['apple', 'butter'],
    'SWEET_003': ['egg', 'bread'],
    'SWEET_004': ['egg', 'butter', 'cheese'],
    'SWEET_005': ['egg', 'butter', 'bread'],
    'SWEET_006': ['egg', 'butter', 'bread'],
    'SWEET_007': ['egg', 'butter', 'bread'],
    'SWEET_008': ['egg', 'butter', 'bread'],
    'SWEET_009': ['egg', 'grapes', 'butter'],
    'SWEET_010': ['egg', 'butter', 'bread'],
    'SWEET_011': ['egg', 'butter', 'bread'],
    'SWEET_012': ['egg', 'butter', 'bread'],
    'SWEET_013': ['egg', 'butter', 'bread'],
    'SWEET_014': ['egg', 'butter', 'bread'],
    'SWEET_015': ['egg', 'butter', 'bread'],
    'SWEET_016': ['egg', 'butter', 'bread'],
    'SWEET_017': ['egg', 'butter', 'bread'],
    'SWEET_018': ['butter', 'bread'],
    'SWEET_019': ['egg', 'butter', 'bread'],
    'SWEET_020': ['grapes', 'butter'],
    'SWEET_021': ['butter', 'bread'],
    'SWEET_022': ['egg', 'grapes'],
    'SWEET_023': ['butter', 'bread'],
    'SWEET_024': ['egg', 'butter', 'bread'],
    'SWEET_025': ['egg', 'grapes', 'butter'],
    'SWEET_026': ['butter', 'bread'],
    'SWEET_027': ['butter', 'bread'],
    'SWEET_028': ['egg', 'butter', 'bread'],
    'SWEET_029': ['egg', 'butter', 'bread'],
    'SWEET_030': ['grapes', 'butter'],
    'SWEET_031': ['grapes', 'butter'],
    'SWEET_032': ['egg', 'butter', 'bread'],
    'SWEET_033': ['grapes', 'butter'],
    'SWEET_034': ['egg', 'butter', 'bread'],
    'SWEET_035': ['grapes', 'butter'],
    'SWEET_036': ['apple', 'butter'],
    'SWEET_037': ['egg', 'butter'],
    'SWEET_038': ['grapes', 'butter'],
    'SWEET_039': ['grapes', 'butter'],
    'SWEET_040': ['grapes', 'butter'],
    'SWEET_041': ['egg', 'butter'],
}

# Difficulty 1=easiest 4=hardest
CATEGORY_DIFFICULTY = {
    'Beverages':         1,
    'Breakfast':         2,
    'Salads':            2,
    'Sides':             2,
    'Snacks':            3,
    'Lunch':             3,
    'Sweets & Desserts': 3,
    'Dinner':            4,
    'Japan':             3,
}

def get_tools(difficulty):
    wall = min(3 + difficulty, 7)
    fence = 2 if difficulty >= 2 else 1
    tools = [
        {'type': 'wall',  'count': wall,  'emoji': '🧱'},
        {'type': 'fence', 'count': fence, 'emoji': '🚧'},
    ]
    if difficulty >= 3:
        tools.append({'type': 'scarecrow', 'count': 1, 'emoji': '🧹'})
    if difficulty >= 4:
        tools.append({'type': 'cat', 'count': 1, 'emoji': '🐱'})
    return tools

def get_animal_spawns(foods, difficulty):
    seen = set()
    spawns = []
    base_delay = max(8000 - difficulty * 1500, 2500)
    for food in foods:
        animal = FOOD_ANIMAL.get(food)
        if animal and animal not in seen:
            seen.add(animal)
            spawns.append({'type': animal, 'delay': base_delay})
            base_delay += 1500
    # Add raccoon on hardest if not already present
    if difficulty >= 4 and 'raccoon' not in seen and len(spawns) < 4:
        spawns.append({'type': 'raccoon', 'delay': base_delay + 1000})
    return spawns

def get_food_supply(foods, difficulty):
    supply = {f: 0 for f in ALL_FOODS}
    base = 2 + difficulty
    for i, food in enumerate(foods):
        supply[food] = max(2, base - i)
    return supply

def esc(s):
    """Escape a string for TypeScript single-quoted string."""
    return s.replace('\\', '\\\\').replace("'", "\\'")

def ts_string(s):
    return f"'{esc(str(s))}'"

def ts_string_array(arr):
    return '[' + ', '.join(ts_string(x) for x in arr) + ']'

def ts_food_supply(supply):
    parts = ', '.join(f"{k}: {v}" for k, v in supply.items())
    return '{ ' + parts + ' }'

def ts_tools(tools):
    lines = []
    for t in tools:
        lines.append(f"      {{ type: '{t['type']}', count: {t['count']}, emoji: '{t['emoji']}' }}")
    return '[\n' + ',\n'.join(lines) + '\n    ]'

def ts_animal_spawns(spawns):
    lines = []
    for s in spawns:
        lines.append(f"      {{ type: '{s['type']}', delay: {s['delay']} }}")
    return '[\n' + ',\n'.join(lines) + '\n    ]'

def ts_recipe_ingredients(ings):
    if not ings:
        return '[]'
    lines = []
    for ing in ings:
        parts = []
        if ing.get('name'):      parts.append(f"name: '{esc(ing['name'])}'")
        if ing.get('quantity'):  parts.append(f"quantity: '{esc(ing['quantity'])}'")
        if ing.get('section'):   parts.append(f"section: '{esc(ing['section'])}'")
        if ing.get('foodWord'):  parts.append(f"foodWord: '{esc(ing['foodWord'])}'")
        if ing.get('ndbNo'):     parts.append(f"ndbNo: '{esc(ing['ndbNo'])}'")
        if ing.get('portionDesc'): parts.append(f"portionDesc: '{esc(ing['portionDesc'])}'")
        if ing.get('portionGrams') is not None: parts.append(f"portionGrams: {ing['portionGrams']}")
        if ing.get('servingCount') is not None and ing['servingCount'] != 1: parts.append(f"servingCount: {ing['servingCount']}")
        if ing.get('isDish'):    parts.append('isDish: true')
        if ing.get('exempt'):    parts.append('exempt: true')
        lines.append('      { ' + ', '.join(parts) + ' }')
    return '[\n' + ',\n'.join(lines) + '\n    ]'

def ts_instructions(instr_list):
    if not instr_list:
        return '[]'
    lines = [f"      '{esc(t)}'" for t in instr_list]
    return '[\n' + ',\n'.join(lines) + '\n    ]'


def parse_notes(notes):
    flags = set()
    values = {}
    if not notes:
        return flags, values
    for part in notes.split(';'):
        token = part.strip()
        if not token:
            continue
        if '=' in token:
            key, value = token.split('=', 1)
            values[key.strip().lower()] = value.strip()
        else:
            flags.add(token.lower())
    return flags, values


def parse_servings_count(servings_text):
    if not servings_text:
        return None
    match = re.search(r'(\d+(?:\.\d+)?)', servings_text)
    if not match:
        return None
    try:
        value = float(match.group(1))
        return value if value > 0 else None
    except ValueError:
        return None


def ts_nutrition_json(nutrition_json, servings_count, grams_per_serving=None):
    if not nutrition_json:
        return 'null'
    payload = {
        'perServing': nutrition_json,
        'gramsPerServing': round(grams_per_serving, 2) if grams_per_serving else None,
        'servings': servings_count,
    }
    return json.dumps(payload, ensure_ascii=False)


def normalize_built_per_serving(nutrition_json, servings_count):
    if not nutrition_json or not servings_count:
        return None
    return {
        'cal': round(nutrition_json.get('kcal', 0) / servings_count, 2),
        'pro': round(nutrition_json.get('protein', 0) / servings_count, 2),
        'fat': round(nutrition_json.get('fat', 0) / servings_count, 2),
        'carb': round(nutrition_json.get('carbs', 0) / servings_count, 2),
        'fib': round(nutrition_json.get('fiber', 0) / servings_count, 2),
        'sug': round(nutrition_json.get('sugar', 0) / servings_count, 2),
        'h2o': round(nutrition_json.get('water', 0) / servings_count, 2),
    }


def normalize_built_whole_recipe(nutrition_json):
    if not nutrition_json:
        return None
    return {
        'cal': float(nutrition_json.get('kcal', 0) or 0),
        'pro': float(nutrition_json.get('protein', 0) or 0),
        'fat': float(nutrition_json.get('fat', 0) or 0),
        'carb': float(nutrition_json.get('carbs', 0) or 0),
        'fib': float(nutrition_json.get('fiber', 0) or 0),
        'sug': float(nutrition_json.get('sugar', 0) or 0),
        'h2o': float(nutrition_json.get('water', 0) or 0),
    }


def merge_canonical_with_built_fallback(canonical_per_serving, built_per_serving):
    if not canonical_per_serving:
        return built_per_serving
    if not built_per_serving:
        return canonical_per_serving
    merged = dict(canonical_per_serving)
    for key, canonical_value in canonical_per_serving.items():
        built_value = built_per_serving.get(key)
        if canonical_value == 0 and built_value not in (None, 0):
            merged[key] = built_value
    return merged


def compute_total_recipe_grams(ingredient_rows):
    total_grams = 0.0
    for ing in ingredient_rows:
        if ing.get('row_type') not in ('ingredient', 'dish_ingredient', 'exempt'):
            continue
        flags, note_values = parse_notes(ing.get('notes', ''))
        if 'optional' in flags:
            continue
        portion_grams = ing.get('portion_grams', '')
        if not portion_grams:
            continue
        try:
            grams = float(portion_grams)
        except ValueError:
            continue
        serving_count = ing.get('serving_count', '')
        try:
            count = float(serving_count) if serving_count else 1.0
        except ValueError:
            count = 1.0
        retained = note_values.get('retained')
        if retained:
            try:
                grams *= float(retained)
            except ValueError:
                pass
        total_grams += grams * count
    return total_grams


def get_canonical_per_serving(comboo_cur, dish_ndb_no, grams_per_serving):
    if not dish_ndb_no or not grams_per_serving:
        return None
    cols = ', '.join(CANONICAL_NUTRIENT_COLS.keys())
    comboo_cur.execute(
        f'SELECT {cols} FROM DataCentralCombo WHERE NDB_NO = ?',
        (dish_ndb_no,)
    )
    row = comboo_cur.fetchone()
    if not row:
        return None
    scale = grams_per_serving / 100.0
    return {
        out_key: round((row[index] or 0) * scale, 2)
        for index, out_key in enumerate(CANONICAL_NUTRIENT_COLS.values())
    }


def get_canonical_whole_recipe(comboo_cur, dish_ndb_no, total_recipe_grams):
    if not dish_ndb_no or not total_recipe_grams:
        return None
    cols = ', '.join(CANONICAL_NUTRIENT_COLS.keys())
    comboo_cur.execute(
        f'SELECT {cols} FROM DataCentralCombo WHERE NDB_NO = ?',
        (dish_ndb_no,)
    )
    row = comboo_cur.fetchone()
    if not row:
        return None
    scale = total_recipe_grams / 100.0
    return {
        out_key: round((row[index] or 0) * scale, 2)
        for index, out_key in enumerate(CANONICAL_NUTRIENT_COLS.values())
    }


def get_canonical_serving_grams(comboo_cur, dish_ndb_no, servings_count):
    if not dish_ndb_no or not servings_count:
        return None
    comboo_cur.execute(
        'SELECT M1_Amt, M1_Desc, M1_Gm_Wgt, M2_Amt, M2_Desc, M2_Gm_Wgt, M3_Amt, M3_Desc, M3_Gm_Wgt FROM DataCentralCombo WHERE NDB_NO = ?',
        (dish_ndb_no,)
    )
    row = comboo_cur.fetchone()
    if not row:
        return None
    serving_marker = f'1/{int(servings_count)}'
    for offset in (0, 3, 6):
        amount = row[offset]
        description = row[offset + 1]
        grams = row[offset + 2]
        if not grams:
            continue
        if amount == 1 and description and serving_marker in str(description):
            return float(grams)
    return None


def ingredient_sum_per_serving(comboo_cur, ingredient_rows, servings_count):
    """Sum macros from ingredient rows when no canonical dish NDB exists (Rule 3)."""
    if not servings_count or servings_count <= 0:
        return None
    cols = ', '.join(CANONICAL_NUTRIENT_COLS.keys())
    totals = {k: 0.0 for k in CANONICAL_NUTRIENT_COLS.values()}
    total_grams = 0.0
    hit = 0
    for row in ingredient_rows:
        if row.get('row_type') not in ('dish_ingredient', 'ingredient'):
            continue
        ndb = row.get('ndb_no', '').strip()
        if not ndb:
            continue
        try:
            grams = float(row.get('portion_grams', 0) or 0)
        except ValueError:
            grams = 0.0
        if grams <= 0:
            continue
        comboo_cur.execute(
            f'SELECT {cols} FROM DataCentralCombo WHERE NDB_NO = ?', (ndb,)
        )
        sr = comboo_cur.fetchone()
        if not sr:
            continue
        scale = grams / 100.0
        for i, out_key in enumerate(CANONICAL_NUTRIENT_COLS.values()):
            totals[out_key] += (sr[i] or 0.0) * scale
        total_grams += grams
        hit += 1
    if hit == 0:
        return None, 0.0
    return {k: round(v / servings_count, 2) for k, v in totals.items()}, total_grams / servings_count


def get_canonical_per_serving_from_density(comboo_cur, dish_ndb_no, grams_per_serving):
    if not dish_ndb_no or not grams_per_serving:
        return None
    cols = ', '.join(CANONICAL_NUTRIENT_COLS.keys())
    comboo_cur.execute(
        f'SELECT {cols} FROM DataCentralCombo WHERE NDB_NO = ?',
        (dish_ndb_no,)
    )
    row = comboo_cur.fetchone()
    if not row:
        return None
    scale = grams_per_serving / 100.0
    return {
        out_key: round((row[index] or 0) * scale, 2)
        for index, out_key in enumerate(CANONICAL_NUTRIENT_COLS.values())
    }


def divide_nutrition_by_servings(nutrition_json, servings_count):
    if not nutrition_json or not servings_count:
        return None
    return {
        key: round(value / servings_count, 2)
        for key, value in nutrition_json.items()
    }

# ── Load CSVs ──────────────────────────────────────────────────────────────────
recipes = list(csv.DictReader(open(RECIPES_CSV)))

comboo = sqlite3.connect(COMBOO_DB)
comboo_cur = comboo.cursor()

dev_nutrition_by_recipe = {}
if os.path.exists(DEV_DB):
    dev = sqlite3.connect(DEV_DB)
    dev_cur = dev.cursor()
    dev_cur.execute("SELECT id, nutrition_json FROM recipes")
    for rid, nutrition_json in dev_cur.fetchall():
        if not nutrition_json:
            continue
        try:
            dev_nutrition_by_recipe[rid] = json.loads(nutrition_json)
        except json.JSONDecodeError:
            continue
    dev.close()

ingredients_by_recipe = {}
for row in csv.DictReader(open(INGREDIENTS_CSV)):
    rid = row['recipe_id']
    ingredients_by_recipe.setdefault(rid, []).append(row)

instructions_by_recipe = {}
for row in csv.DictReader(open(INSTRUCTIONS_CSV)):
    rid = row['recipe_id']
    instructions_by_recipe.setdefault(rid, []).append(row)

authored_recipe_ids = set(ingredients_by_recipe) & set(instructions_by_recipe)

# ── Generate ───────────────────────────────────────────────────────────────────
level_blocks = []
level_num = 0
for recipe in recipes:
    rid = recipe['recipe_id']
    if rid not in authored_recipe_ids:
        continue
    level_num += 1
    foods = RECIPE_FOODS.get(rid, ['bread'])
    difficulty = CATEGORY_DIFFICULTY.get(recipe.get('category', ''), 3)

    tools        = get_tools(difficulty)
    animal_spawns = get_animal_spawns(foods, difficulty)
    food_supply  = get_food_supply(foods, difficulty)

    # Build recipeIngredients
    recipe_ings = []
    for ing in ingredients_by_recipe.get(rid, []):
        rt = ing.get('row_type', '')
        _, note_values = parse_notes(ing.get('notes', ''))
        item = {}
        if rt == 'dish':
            item['name'] = ing.get('sr28_long_desc') or recipe.get('recipe_name', '')
            item['quantity'] = ing.get('portion_desc', '')
            item['foodWord'] = ing.get('game_food', '') or recipe.get('food_word', '')
            item['ndbNo'] = ing.get('ndb_no', '')
            item['portionDesc'] = ing.get('portion_desc', '')
            pg = ing.get('portion_grams', '')
            if pg:
                try: item['portionGrams'] = float(pg)
                except: pass
            item['isDish'] = True
        elif rt in ('ingredient', 'dish_ingredient', 'exempt'):
            item['name'] = ing.get('ing_name', '')
            item['quantity'] = ing.get('ing_qty', '')
            if note_values.get('section'):
                item['section'] = note_values['section']
            if ing.get('ndb_no'):
                item['ndbNo'] = ing['ndb_no']
                item['portionDesc'] = ing.get('portion_desc', '')
                pg = ing.get('portion_grams', '')
                if pg:
                    try: item['portionGrams'] = float(pg)
                    except: pass
                sc = ing.get('serving_count', '')
                if sc:
                    try:
                        sc_f = float(sc)
                        if sc_f != 1.0: item['servingCount'] = sc_f
                    except: pass
                if ing.get('game_food'):
                    item['foodWord'] = ing['game_food']
            if rt == 'exempt':
                item['exempt'] = True
        else:
            continue
        if item.get('name') or item.get('isDish'):
            recipe_ings.append(item)

    # Build recipeInstructions
    instr_rows = sorted(
        instructions_by_recipe.get(rid, []),
        key=lambda x: int(x.get('step_order', 0) or 0)
    )
    instr_texts = [r['step_text'] for r in instr_rows if r.get('step_text')]

    link_type = recipe.get('link_type', 'ingredient')
    servings_text = recipe.get('servings', '')
    servings_count = parse_servings_count(servings_text)
    total_recipe_grams = compute_total_recipe_grams(ingredients_by_recipe.get(rid, []))
    grams_per_serving = round(total_recipe_grams / servings_count, 2) if servings_count and total_recipe_grams else None
    dish_row = next((row for row in ingredients_by_recipe.get(rid, []) if row.get('row_type') == 'dish'), None)
    dish_ndb_no = dish_row.get('ndb_no', '') if dish_row else ''
    canonical_serving_grams = get_canonical_serving_grams(comboo_cur, dish_ndb_no, servings_count)
    canonical_per_serving = get_canonical_per_serving_from_density(
        comboo_cur,
        dish_ndb_no,
        canonical_serving_grams or grams_per_serving,
    )
    sr_rule = recipe.get('sr28_rule', '').strip()
    built_per_serving = normalize_built_per_serving(dev_nutrition_by_recipe.get(rid), servings_count)
    # Rule A: full SR28 dish match — pure canonical (all macros lab-verified).
    # Rule B: partial SR28 dish match (fiber/sugar gaps) — canonical + built fills zeros.
    # Rule C: commercial NDB too far from homemade — built only, canonical discarded.
    # Rule D: no matching NDB — ingredient-sum fallback below.
    if sr_rule == 'Rule A':
        nutrition_per_serving = canonical_per_serving
    elif sr_rule == 'Rule B':
        nutrition_per_serving = merge_canonical_with_built_fallback(canonical_per_serving, built_per_serving)
    elif sr_rule == 'Rule C':
        nutrition_per_serving = built_per_serving
    else:
        nutrition_per_serving = None  # Rule D — falls through to ingredient-sum
    ingredient_sum_grams = None
    if not nutrition_per_serving and servings_count:
        nutrition_per_serving, ingredient_sum_grams = ingredient_sum_per_serving(
            comboo_cur, ingredients_by_recipe.get(rid, []), servings_count
        )
    nutrition_json = ts_nutrition_json(nutrition_per_serving, servings_count, ingredient_sum_grams)

    block = f"""  {{
    id: '{esc(rid)}',
    name: '{esc(recipe.get('recipe_name',''))}',
    category: '{esc(recipe.get('category',''))}',
    dietaryCategory: '{esc(recipe.get('dietary_category','all'))}',
    levelNum: {level_num},
    recipe: {ts_string_array(foods)},
    tools: {ts_tools(tools)},
    animalSpawns: {ts_animal_spawns(animal_spawns)},
    foodSupply: {ts_food_supply(food_supply)},
    servings: '{esc(recipe.get('servings',''))}',
    prepTime: '{esc(recipe.get('prep_time',''))}',
    linkType: '{esc(link_type)}',
    sr28Rule: '{esc(sr_rule)}',
    nutritionJson: {nutrition_json},
    recipeIngredients: {ts_recipe_ingredients(recipe_ings)},
    recipeInstructions: {ts_instructions(instr_texts)},
  }}"""
    level_blocks.append(block)

output = """// Auto-generated — do not edit. Run generate_levels.py to regenerate.
import type { Level } from './types';

export const LEVELS: Level[] = [
""" + ',\n'.join(level_blocks) + """
];
"""

with open(OUTPUT, 'w') as f:
    f.write(output)

comboo.close()

print(f"Generated {len(level_blocks)} levels → {OUTPUT}")
