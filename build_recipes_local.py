#!/usr/bin/env python3
"""
build_recipes_local.py
----------------------
Reads recipe CSVs + queries comboo.db for nutrition → inserts developer recipes
into recipes_dev.db (local SQLite for dev testing).

Only processes recipes where recipe_ingredients.csv has at least one 'ingredient'
row with a valid ndb_no and portion_grams. Recipes with only 'dish' or
'dish_ingredient' rows are skipped (not enough data yet).

Usage:
    python3 build_recipes_local.py [--reset]

    --reset   Delete and re-insert all developer recipes before building
              (otherwise only adds recipes not already present)

Output:
    Inserts rows into recipes_dev.db under submitted_by='dev-player-001',
    type='developer', status='approved'
"""

import sqlite3
import csv
import json
import os
import sys
import argparse
from collections import defaultdict

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE = os.path.dirname(__file__)
DEV_DB      = os.path.join(BASE, 'recipes_dev.db')
COMBOO_DB   = '/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db'
DATA_DIR    = os.path.join(BASE, 'src', 'lib', 'data')
RECIPES_CSV     = os.path.join(DATA_DIR, 'recipes.csv')
INGREDIENTS_CSV = os.path.join(DATA_DIR, 'recipe_ingredients.csv')
INSTRUCTIONS_CSV = os.path.join(DATA_DIR, 'recipe_instructions.csv')

# Nutrients to sum for nutrition_json (column name in comboo.db → output key)
NUTRIENT_COLS = {
    'Energy_KCal':              'kcal',
    'Protein':                  'protein',
    'TotalLipidFat':            'fat',
    'Carbohydrate':             'carbs',
    'FiberTotalDietary':        'fiber',
    'SugarsTotal':              'sugar',
    'Sodium_Na':                'sodium',
    'Calcium_Ca':               'calcium',
    'Iron_Fe':                  'iron',
    'Potassium_K':              'potassium',
    'VitaminC_totalAscorbicAcid': 'vitaminC',
    'VitaminA_RAE':             'vitaminA',
    'Water':                    'water',
    'Cholesterol':              'cholesterol',
    'FattyAcids_totalSaturated': 'saturatedFat',
    'FattyAcids_totalPolyunsaturated': 'polyFat',
    'FattyAcids_totalMonounsaturated': 'monoFat',
    'omega3_total':             'omega3',
    'omega6_total':             'omega6',
}

def read_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def get_nutrients(comboo_cur, ndb_no, portion_grams, serving_count):
    """Return dict of nutrients scaled to (portion_grams * serving_count)."""
    cols = ', '.join(NUTRIENT_COLS.keys())
    comboo_cur.execute(
        f'SELECT {cols} FROM DataCentralCombo WHERE NDB_NO = ?',
        (ndb_no,)
    )
    row = comboo_cur.fetchone()
    if not row:
        return None
    scale = (portion_grams * serving_count) / 100.0
    return {
        out_key: round((row[i] or 0) * scale, 2)
        for i, out_key in enumerate(NUTRIENT_COLS.values())
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--reset', action='store_true', help='Remove all dev recipes before rebuilding')
    args = parser.parse_args()

    # ── Validate paths ────────────────────────────────────────────────────────
    for path, label in [(DEV_DB, 'recipes_dev.db'), (COMBOO_DB, 'comboo.db'),
                        (RECIPES_CSV, 'recipes.csv'), (INGREDIENTS_CSV, 'recipe_ingredients.csv'),
                        (INSTRUCTIONS_CSV, 'recipe_instructions.csv')]:
        if not os.path.exists(path):
            print(f'ERROR: {label} not found at {path}')
            sys.exit(1)

    # ── Load CSVs ─────────────────────────────────────────────────────────────
    recipes      = {r['recipe_id']: r for r in read_csv(RECIPES_CSV)}
    ingredients  = defaultdict(list)
    for row in read_csv(INGREDIENTS_CSV):
        ingredients[row['recipe_id']].append(row)
    instructions = defaultdict(list)
    for row in read_csv(INSTRUCTIONS_CSV):
        instructions[row['recipe_id']].append(row)

    # ── Open databases ────────────────────────────────────────────────────────
    comboo = sqlite3.connect(COMBOO_DB)
    comboo.row_factory = sqlite3.Row
    comboo_cur = comboo.cursor()

    dev = sqlite3.connect(DEV_DB)
    dev_cur = dev.cursor()

    if args.reset:
        dev_cur.execute("DELETE FROM recipes WHERE submitted_by = 'dev-player-001'")
        dev.commit()
        print('Reset: removed existing developer recipes')

    # ── Process each recipe ───────────────────────────────────────────────────
    inserted = 0
    skipped  = 0

    for recipe_id, meta in sorted(recipes.items()):
        ing_rows = ingredients.get(recipe_id, [])

        # Only build recipes that have at least one 'ingredient' row with data
        ingredient_rows = [
            r for r in ing_rows
            if r['row_type'] == 'ingredient' and r.get('ndb_no') and r.get('portion_grams')
        ]
        if not ingredient_rows:
            skipped += 1
            continue

        # ── Check if already exists ───────────────────────────────────────────
        dev_cur.execute("SELECT id FROM recipes WHERE id = ?", (recipe_id,))
        if dev_cur.fetchone():
            skipped += 1
            continue

        # ── Calculate nutrition totals ────────────────────────────────────────
        totals = defaultdict(float)
        missing_ndb = []

        for r in ingredient_rows:
            portion_grams = float(r['portion_grams'])
            serving_count = float(r['serving_count'] or 1)
            nutrients = get_nutrients(comboo_cur, r['ndb_no'].strip(), portion_grams, serving_count)
            if nutrients is None:
                missing_ndb.append(r['ndb_no'])
                continue
            for k, v in nutrients.items():
                totals[k] += v

        if missing_ndb:
            print(f'  WARNING {recipe_id}: NDB not found in comboo.db: {missing_ndb}')

        # Round totals
        nutrition_json = {k: round(v, 2) for k, v in totals.items()}

        # ── Build recipe_ingredients JSON ─────────────────────────────────────
        recipe_ingredients_json = []
        for r in sorted(ing_rows, key=lambda x: int(x['row_order'])):
            entry = {
                'row_order':    int(r['row_order']),
                'row_type':     r['row_type'],
                'ing_name':     r['ing_name'],
                'ing_qty':      r['ing_qty'],
                'ndb_no':       r['ndb_no'],
                'portion_desc': r['portion_desc'],
                'portion_grams': float(r['portion_grams']) if r['portion_grams'] else None,
                'serving_count': float(r['serving_count']) if r['serving_count'] else None,
                'notes':        r['notes'],
                'game_food':    r['game_food'],
                'animal':       r['animal'],
            }
            recipe_ingredients_json.append(entry)

        # ── Build instructions JSON ───────────────────────────────────────────
        recipe_instructions_json = [
            {'step': int(r['step_order']), 'text': r['step_text']}
            for r in sorted(instructions.get(recipe_id, []), key=lambda x: int(x['step_order']))
        ]

        # ── game foods list (unique game_food values from ingredient rows) ─────
        game_foods = list(dict.fromkeys(
            r['game_food'] for r in ing_rows if r.get('game_food')
        ))

        # ── Insert ────────────────────────────────────────────────────────────
        dev_cur.execute("""
            INSERT INTO recipes (
                id, type, name, category, dietary_category,
                link_type, prep_time, servings,
                recipe, recipe_ingredients, recipe_instructions,
                submitted_by, status,
                nutrition_json,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, (
            recipe_id,
            'developer',
            meta['recipe_name'],
            meta['category'],
            meta['dietary_category'],
            meta['link_type'],
            meta['prep_time'],
            meta['servings'],
            json.dumps(game_foods),
            json.dumps(recipe_ingredients_json),
            json.dumps(recipe_instructions_json),
            'dev-player-001',
            'approved',
            json.dumps(nutrition_json),
        ))
        inserted += 1
        print(f'  ✓ {recipe_id}: {meta["recipe_name"]} ({len(ingredient_rows)} ingredients, {round(nutrition_json.get("kcal",0))} kcal/serving)')

    dev.commit()
    dev.close()
    comboo.close()

    print(f'\nDone: {inserted} recipes inserted, {skipped} skipped (no ingredient data yet)')
    print(f'DB: {DEV_DB}')

if __name__ == '__main__':
    main()
