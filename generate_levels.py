#!/usr/bin/env python3
"""Generate src/lib/farmers-basket/generated-levels.ts from recipe CSVs."""

import csv
import json
import os

BASE = '/Volumes/training/Daily Food Chain/daily-food-chain'
RECIPES_CSV      = f'{BASE}/src/lib/data/recipes.csv'
INGREDIENTS_CSV  = f'{BASE}/src/lib/data/recipe_ingredients.csv'
INSTRUCTIONS_CSV = f'{BASE}/src/lib/data/recipe_instructions.csv'
OUTPUT           = f'{BASE}/src/lib/farmers-basket/generated-levels.ts'

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
    'SWEET_001': ['apple', 'butter'],
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

# ── Load CSVs ──────────────────────────────────────────────────────────────────
recipes = list(csv.DictReader(open(RECIPES_CSV)))

ingredients_by_recipe = {}
for row in csv.DictReader(open(INGREDIENTS_CSV)):
    rid = row['recipe_id']
    ingredients_by_recipe.setdefault(rid, []).append(row)

instructions_by_recipe = {}
for row in csv.DictReader(open(INSTRUCTIONS_CSV)):
    rid = row['recipe_id']
    instructions_by_recipe.setdefault(rid, []).append(row)

# ── Generate ───────────────────────────────────────────────────────────────────
level_blocks = []
for level_num, recipe in enumerate(recipes, start=1):
    rid = recipe['recipe_id']
    foods = RECIPE_FOODS.get(rid, ['bread'])
    difficulty = CATEGORY_DIFFICULTY.get(recipe.get('category', ''), 3)

    tools        = get_tools(difficulty)
    animal_spawns = get_animal_spawns(foods, difficulty)
    food_supply  = get_food_supply(foods, difficulty)

    # Build recipeIngredients
    recipe_ings = []
    for ing in ingredients_by_recipe.get(rid, []):
        rt = ing.get('row_type', '')
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
