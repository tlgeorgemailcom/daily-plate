#!/usr/bin/env python3
"""Generate src/lib/farmers-basket/generated-levels.ts from recipe CSVs.

Phase 7 (v3): for any recipe with a build at recipes_v3/output/builds/<id>.json,
the bundled ``nutritionJson`` is sourced from the v3 pipeline instead of the
legacy CSV/canonical/Pipeline-B path. v3 owns the rich ~70-nutrient panel that
the Balanced Diet game needs. Non-v3 recipes continue on the existing path.
See docs/v3.md §14b.
"""

import csv
import json
import os
import re
import sqlite3
import sys

BASE = '/Volumes/training/Daily Food Chain/daily-food-chain'
RECIPES_V3_DIR = f'{BASE}/recipes_v3'
V3_BUILDS_DIR  = f'{RECIPES_V3_DIR}/output/builds'
sys.path.insert(0, RECIPES_V3_DIR)

# Phase 8a: all CSVs sourced from recipes_v3/data/. v1 src/lib/data/*.csv archived.
RECIPES_CSV      = f'{RECIPES_V3_DIR}/data/recipes.csv'
INGREDIENTS_CSV  = f'{RECIPES_V3_DIR}/data/recipe_ingredients.csv'
INSTRUCTIONS_CSV = f'{RECIPES_V3_DIR}/data/recipe_instructions.csv'
LEDGER_CSV       = f'{RECIPES_V3_DIR}/data/ingredients_ledger.csv'
OUTPUT           = f'{BASE}/src/lib/farmers-basket/generated-levels.ts'
# comboo.db is read only to look up SR-Legacy Long_Desc for the bundled dish row
# display name (preserves the v1 bundle's dish-row name shape). All nutrition
# math lives in recipes_v3/, not here.
COMBOO_DB        = '/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db'

# Long-form (SR28 column) → short (game) nutrition keys.
# Used when sourcing perServing from recipe-nutrition.json (Pipeline B output),
# which is the v2-spec authoritative builder (recipe-level yield factors,
# cooked-mass divisor, Rule A/B/C/D selection).
LONG_TO_SHORT_NUTRIENT = {
    'Energy_KCal': 'cal',
    'Protein': 'pro',
    'TotalLipidFat': 'fat',
    'Carbohydrate': 'carb',
    'FiberTotalDietary': 'fib',
    'SugarsTotal': 'sug',
    'Water': 'h2o',
}

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

# ── Load CSVs (Phase 8a: all from recipes_v3/data/) ───────────────────────────
recipes = list(csv.DictReader(open(RECIPES_CSV)))

ledger = {r['ingredient_key']: r for r in csv.DictReader(open(LEDGER_CSV))}

# Long_Desc lookup (dish-row display name only). Cached at startup.
_comboo = sqlite3.connect(COMBOO_DB)
_long_desc_by_ndb = {}
for _ndb, _ld in _comboo.execute('SELECT NDB_NO, Long_Desc FROM DataCentralCombo'):
    if _ndb is not None and _ld:
        _long_desc_by_ndb[str(_ndb).lstrip('0') or '0'] = _ld
_comboo.close()

ingredients_by_recipe = {}
for row in csv.DictReader(open(INGREDIENTS_CSV)):
    rid = row['recipe_id']
    ingredients_by_recipe.setdefault(rid, []).append(row)

instructions_by_recipe = {}
for row in csv.DictReader(open(INSTRUCTIONS_CSV)):
    rid = row['recipe_id']
    instructions_by_recipe.setdefault(rid, []).append(row)

authored_recipe_ids = set(ingredients_by_recipe) & set(instructions_by_recipe)

# ── v3 nutrition overrides (Phase 7) ───────────────────────────────────────────
# For any recipe with a v3 build JSON, source the bundled nutritionJson directly
# from v3. This delivers the full ~70-nutrient panel (vitamins, minerals, fatty
# acids, amino acids, derived omega-3/6, AddedSugars/IntrinsicSugars) used by
# the Balanced Diet game. Bundled v1 consumers (perServing 7-macro shorthand)
# remain compatible — v3's payload includes the same top-level cal/pro/fat/etc.
v3_nutrition_overrides = {}
v3_count = 0
if os.path.isdir(V3_BUILDS_DIR):
    try:
        from lib.build import to_turso_nutrition_json  # noqa: E402
    except ImportError as exc:
        print(f"WARN: cannot import v3 build module ({exc}); skipping v3 overrides", file=sys.stderr)
        to_turso_nutrition_json = None
    if to_turso_nutrition_json is not None:
        for fname in sorted(os.listdir(V3_BUILDS_DIR)):
            if not fname.endswith('.json'):
                continue
            rid = fname[:-5]
            try:
                build = json.loads(open(os.path.join(V3_BUILDS_DIR, fname)).read())
                v3_nutrition_overrides[rid] = to_turso_nutrition_json(build)
                v3_count += 1
            except Exception as exc:
                print(f"WARN: failed to load v3 build {rid}: {exc}", file=sys.stderr)
print(f"v3 overrides loaded: {v3_count} recipes")

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

    # Build recipeIngredients from v3 ledger + recipe_ingredients.
    # First entry is a synthesized "dish" row pointing at the recipe's
    # canonical NDB; subsequent entries are the per-ingredient rows.
    canonical_ndb_no = (recipe.get('canonical_ndb_no', '') or '').lstrip('0') or recipe.get('canonical_ndb_no', '')
    dish_long_desc = _long_desc_by_ndb.get(canonical_ndb_no, '') if canonical_ndb_no else ''
    recipe_ings = []
    recipe_ings.append({
        'name':        dish_long_desc or recipe.get('recipe_name', ''),
        'quantity':    'custom (g)',
        'foodWord':    recipe.get('food_word', ''),
        'ndbNo':       recipe.get('canonical_ndb_no', ''),
        'portionDesc': 'custom (g)',
        'portionGrams': 100.0,
        'isDish':      True,
    })
    for ing in ingredients_by_recipe.get(rid, []):
        led = ledger.get(ing['ingredient_key'], {})
        item = {
            'name':        ing.get('display_name_override') or led.get('default_display_name', ''),
            'quantity':    ing.get('qty_display', ''),
            'ndbNo':       led.get('ndb_no', ''),
            'portionDesc': 'g',
        }
        try:
            item['portionGrams'] = float(ing.get('grams', '') or 0) or None
            if item['portionGrams'] is None:
                del item['portionGrams']
        except ValueError:
            pass
        if ing.get('section'):
            item['section'] = ing['section']
        # Note: v3's is_optional is NOT mapped to bundle's `exempt` field.
        # `exempt` in v1 meant "row_type=exempt" (excluded from nutrition);
        # v3's is_optional means "may be omitted" — different semantics.
        if item['name'] or item.get('isDish'):
            recipe_ings.append(item)

    # Build recipeInstructions
    instr_rows = sorted(
        instructions_by_recipe.get(rid, []),
        key=lambda x: int(x.get('step_order', 0) or 0)
    )
    instr_texts = [r['step_text'] for r in instr_rows if r.get('step_text')]

    link_type = recipe.get('link_type', 'ingredient') or 'ingredient'
    servings_text = recipe.get('servings_label', '')
    sr_rule = recipe.get('sr_rule', '').strip()

    v3_payload = v3_nutrition_overrides.get(rid)
    if v3_payload is None:
        # Phase 8a hard requirement: every authored recipe must have a v3 build.
        # The legacy canonical / Pipeline-B / dev_db fallbacks were retired
        # together with the v1 CSVs.
        raise SystemExit(
            f"ERROR: {rid} has no v3 build at {V3_BUILDS_DIR}/{rid}.json. "
            f"Run `python3 recipes_v3/tools/build_one.py {rid}` first."
        )
    nutrition_json = json.dumps(v3_payload, ensure_ascii=False, separators=(',', ':'))

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
    servings: '{esc(servings_text)}',
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

print(f"Generated {len(level_blocks)} levels → {OUTPUT}")
