#!/usr/bin/env python3
"""
generate_recipe_nutrition.py
============================
Reads recipes.csv + recipe_ingredients.csv, queries DataCentralCombo for each
dish-row NDB, and writes src/lib/data/recipe-nutrition.ts.

All 116 recipes are link_type='dish', so nutrition is derived from the SR28
dish-level NDB entry (already represents the cooked/finished state).
Cooking-loss retention factors apply when ingredient-type recipes are added.

Run:
    python3 src/lib/data/generate_recipe_nutrition.py
"""

import csv
import sqlite3
import json
import os
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
REPO_ROOT    = SCRIPT_DIR.parent.parent.parent  # daily-food-chain/
DB_PATH      = Path('/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db')
RECIPES_CSV  = SCRIPT_DIR / 'recipes.csv'
INGR_CSV     = SCRIPT_DIR / 'recipe_ingredients.csv'
FOODS_CSV    = REPO_ROOT / 'food-portions-complete.csv'
OUT_TS       = SCRIPT_DIR / 'recipe-nutrition.ts'

# ── Nutrient columns to extract from DataCentralCombo ─────────────────────────
# Ordered: macros → fat quality → fat-soluble vitamins → water-soluble vitamins
#          → carotenoids → minerals → amino acids
NUTRIENT_COLS = [
    # Core macros
    'Energy_KCal', 'Water', 'Protein', 'TotalLipidFat', 'Carbohydrate',
    'FiberTotalDietary', 'SugarsTotal', 'Cholesterol',
    # Fatty acids
    'FattyAcids_totalSaturated', 'FattyAcids_totalMonounsaturated',
    'FattyAcids_totalPolyunsaturated',
    'LinoleicAcid', 'alphaLinolenicAcid',
    'EPA_20_5n3', 'DPA_22_5n3', 'DHA_22_6n3', 'omega3', 'omega6',
    # Fat-soluble vitamins
    'VitaminA_RAE', 'Retinol', 'Carotene_beta',
    'VitaminD', 'VitaminE_alphaTocopherol', 'VitaminK_phylloquinone',
    # Water-soluble vitamins
    'VitaminC_totalAscorbicAcid', 'Thiamin', 'Riboflavin', 'Niacin',
    'PantothenicAcid', 'VitaminB6',
    'Folate_total', 'Folate_food', 'Folate_DFE', 'FolicAcid',
    'VitaminB12', 'Choline_total', 'Betaine',
    # Carotenoids
    'LuteinZeaxanthin', 'Lycopene',
    # Minerals
    'Calcium_Ca', 'Iron_Fe', 'Magnesium_Mg', 'Phosphorus_P',
    'Potassium_K', 'Sodium_Na', 'Zinc_Zn', 'Copper_Cu',
    'Manganese_Mn', 'Selenium_Se',
    # Amino acids
    'Tryptophan', 'Threonine', 'Isoleucine', 'Leucine',
    'Lysine', 'Methionine', 'Cystine', 'Phenylalanine',
    'Tyrosine', 'Valine', 'Arginine', 'Histidine',
    'Alanine', 'AsparticAcid', 'GlutamicAcid', 'Glycine', 'Proline', 'Serine',
]

def load_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def query_ndb(db, ndb_no):
    """Return nutrient row for a single NDB number, or None."""
    cols = ', '.join(NUTRIENT_COLS)
    row = db.execute(
        f'SELECT {cols}, Long_Desc, cookMethod, curedFresh '
        f'FROM DataCentralCombo WHERE NDB_NO = ? LIMIT 1',
        (str(ndb_no),)
    ).fetchone()
    if not row:
        return None
    result = {NUTRIENT_COLS[i]: (row[i] or 0.0) for i in range(len(NUTRIENT_COLS))}
    result['_Long_Desc']  = row[len(NUTRIENT_COLS)]
    result['_cookMethod'] = row[len(NUTRIENT_COLS) + 1]
    result['_curedFresh'] = row[len(NUTRIENT_COLS) + 2]
    return result

def parse_servings(s):
    if not s:
        return 1
    import re
    m = re.search(r'\d+', s)
    return int(m.group()) if m else 1

def round2(v):
    return round(v * 100) / 100

def pick_canonical_serving_grams(food_row):
    if not food_row:
        return None
    fallback = None
    for idx in range(13):
        desc = (food_row.get(f'M{idx}_Desc', '') or '').strip().lower()
        grams_str = (food_row.get(f'M{idx}_Gm', '') or '').strip()
        if not desc or not grams_str:
            continue
        try:
            grams = float(grams_str)
        except ValueError:
            continue
        if grams <= 0:
            continue
        if desc == 'custom (g)':
            fallback = grams
            continue
        if desc == 'oz':
            continue
        return grams
    return fallback

def build_per_serving(sr28_row, portion_grams):
    """Scale SR28 per-100g values to per-serving using portion_grams."""
    scale = portion_grams / 100.0
    return {k: round2((sr28_row[k] or 0.0) * scale) for k in NUTRIENT_COLS}

def build_ingredient_sum(db, ingr_rows):
    """
    Sum nutrient contributions from dish_ingredient + ingredient rows.
    Returns (totals_dict, total_grams) or (None, 0) if no rows have valid NBDs.
    """
    totals = {k: 0.0 for k in NUTRIENT_COLS}
    total_grams = 0.0
    hit = 0
    for row in ingr_rows:
        row_type = row.get('row_type', '')
        if row_type not in ('dish_ingredient', 'ingredient'):
            continue
        ndb = row.get('ndb_no', '').strip()
        if not ndb:
            continue
        pg_str = row.get('portion_grams', '').strip()
        sc_str = row.get('serving_count', '').strip()
        try:
            pg = float(pg_str) if pg_str else None
        except ValueError:
            pg = None
        try:
            sc = int(float(sc_str)) if sc_str else 1
        except ValueError:
            sc = 1
        if not pg or pg <= 0:
            continue
        sr28 = query_ndb(db, ndb)
        if not sr28:
            continue
        grams = pg * sc
        scale = grams / 100.0
        for k in NUTRIENT_COLS:
            totals[k] = round2(totals[k] + (sr28[k] or 0.0) * scale)
        total_grams += grams
        hit += 1
    if hit == 0:
        return None, 0
    return totals, total_grams

def main():
    print(f'Reading CSVs...')
    recipes = {r['recipe_id']: r for r in load_csv(RECIPES_CSV)}
    ingr_rows = load_csv(INGR_CSV)
    food_rows = load_csv(FOODS_CSV)
    foods_by_ndb = {row['NDB_NO']: row for row in food_rows if row.get('NDB_NO')}
    foods_by_word = {row['word']: row for row in food_rows if row.get('word')}

    # Group ingredient rows by recipe_id
    by_recipe = {}
    for row in ingr_rows:
        by_recipe.setdefault(row['recipe_id'], []).append(row)

    print(f'Opening SR28 DB at {DB_PATH}...')
    db = sqlite3.connect(str(DB_PATH))

    output = {}      # recipe_id → nutrition data
    warnings = []

    for recipe_id, recipe in recipes.items():
        rows = by_recipe.get(recipe_id, [])

        # Find the dish row (row_order=0 / row_type='dish')
        dish_row = next(
            (r for r in rows if r.get('row_type') == 'dish'),
            None
        )
        if not dish_row:
            warnings.append(f'{recipe_id}: no dish row found — skipped')
            continue

        ndb_no = dish_row.get('ndb_no', '').strip()
        if not ndb_no:
            warnings.append(f'{recipe_id}: dish row has no ndb_no — skipped')
            continue

        portion_grams_str = dish_row.get('portion_grams', '').strip()
        try:
            portion_grams = float(portion_grams_str) if portion_grams_str else None
        except ValueError:
            portion_grams = None

        serving_count_str = dish_row.get('serving_count', '').strip()
        try:
            serving_count = int(float(serving_count_str)) if serving_count_str else 1
        except ValueError:
            serving_count = 1

        if not portion_grams or portion_grams <= 0:
            warnings.append(f'{recipe_id}: invalid portion_grams={portion_grams_str!r} — skipped')
            continue

        link_type = recipe.get('link_type', 'dish').strip()

        # 'mixed' recipes: always use ingredient-sum (dish NDB is just a reference)
        if link_type == 'mixed':
            totals, total_grams = build_ingredient_sum(db, rows)
            if not totals:
                warnings.append(f'{recipe_id}: mixed link_type but no valid ingredient rows — skipped')
                continue
            per_serving = totals
            eff_grams = total_grams if total_grams > 0 else portion_grams
            per_100g = {k: round2(per_serving[k] * 100.0 / eff_grams) for k in NUTRIENT_COLS}
            sr28_ref = query_ndb(db, ndb_no)
            output[recipe_id] = {
                'ndb': ndb_no,
                'long_desc': sr28_ref['_Long_Desc'] if sr28_ref else f'{recipe_id} (ingredient-sum)',
                'cook_method': None,
                'gramsPerServing': round2(eff_grams),
                'servings': serving_count,
                'perServing': per_serving,
                'per100g': per_100g,
            }
            continue

        sr28_row = query_ndb(db, ndb_no)
        if not sr28_row:
            # Fallback: sum dish_ingredient/ingredient rows
            totals, total_grams = build_ingredient_sum(db, rows)
            if not totals:
                warnings.append(f'{recipe_id}: NDB {ndb_no} not found in SR28 and no ingredient fallback — skipped')
                continue
            per_serving = totals
            portion_grams = portion_grams if portion_grams and portion_grams > 0 else total_grams
            per_100g = {k: round2(per_serving[k] * 100.0 / portion_grams) for k in NUTRIENT_COLS} if portion_grams > 0 else {k: 0.0 for k in NUTRIENT_COLS}
            output[recipe_id] = {
                'ndb': ndb_no,
                'long_desc': f'{recipe_id} (ingredient-sum fallback)',
                'cook_method': None,
                'gramsPerServing': portion_grams,
                'servings': serving_count,
                'perServing': per_serving,
                'per100g': per_100g,
            }
            continue

        canonical_food_row = foods_by_ndb.get(ndb_no) or foods_by_word.get(recipe.get('food_word', '').strip())
        serving_grams = pick_canonical_serving_grams(canonical_food_row) or portion_grams
        per_serving = build_per_serving(sr28_row, serving_grams)

        # Canonical SR rows are already per 100g; keep that basis independent of serving size.
        per_100g = {k: round2(float(sr28_row.get(k) or 0.0)) for k in NUTRIENT_COLS}

        output[recipe_id] = {
            'ndb': ndb_no,
            'long_desc': sr28_row['_Long_Desc'],
            'cook_method': sr28_row['_cookMethod'],
            'gramsPerServing': round2(serving_grams),
            'servings': serving_count,
            'perServing': per_serving,
            'per100g': per_100g,
        }

    db.close()

    if warnings:
        print(f'\nWarnings ({len(warnings)}):')
        for w in warnings:
            print(f'  ⚠ {w}')

    print(f'\nBuilt nutrition for {len(output)}/{len(recipes)} recipes.')

    # ── Write TypeScript output ────────────────────────────────────────────────
    lines = [
        '// Auto-generated by generate_recipe_nutrition.py — do not edit manually.',
        '// Nutrient values are derived from SR28 DataCentralCombo dish-level NDB entries.',
        '// perServing: nutrients scaled to one serving (portion_grams).',
        '// per100g: nutrients per 100g of finished dish (for display/search normalisation).',
        '// All numerical values in the standard SR28 units (g, mg, µg, kcal, IU).',
        '',
        'export interface RecipeNutritionEntry {',
        '  ndb: string;',
        '  long_desc: string;',
        '  cook_method: string | null;',
        '  gramsPerServing: number;',
        '  servings: number;',
        '  perServing: Record<string, number>;',
        '  per100g: Record<string, number>;',
        '}',
        '',
        'export const RECIPE_NUTRITION: Record<string, RecipeNutritionEntry> = {',
    ]

    for recipe_id in sorted(output.keys()):
        entry = output[recipe_id]
        lines.append(f'  "{recipe_id}": {{')
        lines.append(f'    ndb: "{entry["ndb"]}",')
        escaped_desc = entry["long_desc"].replace('"', '\\"')
        lines.append(f'    long_desc: "{escaped_desc}",')
        cm = entry["cook_method"]
        if cm:
            escaped_cm = cm.replace('"', '\\"')
            lines.append(f'    cook_method: "{escaped_cm}",')
        else:
            lines.append(f'    cook_method: null,')
        lines.append(f'    gramsPerServing: {entry["gramsPerServing"]},')
        lines.append(f'    servings: {entry["servings"]},')

        # perServing — inline compact JSON-style
        ps_items = ', '.join(
            f'{k}: {v}' for k, v in entry['perServing'].items()
            if v != 0.0
        )
        lines.append(f'    perServing: {{ {ps_items} }},')

        p1_items = ', '.join(
            f'{k}: {v}' for k, v in entry['per100g'].items()
            if v != 0.0
        )
        lines.append(f'    per100g: {{ {p1_items} }},')

        lines.append('  },')

    lines.append('};')
    lines.append('')

    ts_content = '\n'.join(lines)
    OUT_TS.write_text(ts_content, encoding='utf-8')
    print(f'Written → {OUT_TS}')
    print(f'File size: {OUT_TS.stat().st_size:,} bytes')

if __name__ == '__main__':
    main()
