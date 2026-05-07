#!/usr/bin/env python3
"""
generate_recipe_nutrition.py
============================
Reads recipes.csv + recipe_ingredients.csv, queries DataCentralCombo for each
dish-row NDB, and writes src/lib/data/recipe-nutrition.ts.

Rule A / Rule B recipes use the SR Legacy dish row as the nutrition source.
Rule C / Rule D recipes use the authored ingredient build, with recipe-level
yield factors from recipes_v2/data/recipes.csv and nutrient retention applied
without shrinking water twice.

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
V2_RECIPES_CSV = REPO_ROOT / 'recipes_v2' / 'data' / 'recipes.csv'
OUT_TS       = SCRIPT_DIR / 'recipe-nutrition.ts'
OUT_JSON     = SCRIPT_DIR / 'recipe-nutrition.json'
AUDIT_OUT    = SCRIPT_DIR / 'rule_b_fallback_audit.txt'

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

BUILD_RULES = {'Rule C', 'Rule D'}

COOKING_RETENTION = {
    'raw': {},
    'boiled': {
        'Protein': 0.94, 'TotalLipidFat': 1.00, 'Carbohydrate': 1.00, 'Cholesterol': 0.94,
        'VitaminA_RAE': 0.88, 'Retinol': 0.87, 'VitaminD': 1.00, 'VitaminE_alphaTocopherol': 0.92,
        'VitaminK_phylloquinone': 0.94, 'VitaminC_totalAscorbicAcid': 0.50, 'Thiamin': 0.80,
        'Riboflavin': 1.00, 'Niacin': 0.80, 'PantothenicAcid': 0.85, 'VitaminB6': 0.66,
        'Folate_total': 0.88, 'Folate_food': 0.88, 'Folate_DFE': 0.88, 'VitaminB12': 1.00,
        'Choline_total': 0.94, 'Betaine': 1.00, 'LuteinZeaxanthin': 0.66, 'Lycopene': 0.90,
        'Calcium_Ca': 0.84, 'Iron_Fe': 0.64, 'Magnesium_Mg': 0.78, 'Phosphorus_P': 0.82,
        'Potassium_K': 0.86, 'Sodium_Na': 0.82, 'Zinc_Zn': 0.77, 'Copper_Cu': 0.85,
        'Manganese_Mn': 0.94, 'Selenium_Se': 0.94, 'FattyAcids_totalSaturated': 0.98,
        'FattyAcids_totalMonounsaturated': 1.00, 'FattyAcids_totalPolyunsaturated': 0.69,
        'LinoleicAcid': 0.88, 'alphaLinolenicAcid': 0.78, 'EPA_20_5n3': 0.70,
        'DPA_22_5n3': 0.70, 'DHA_22_6n3': 0.56, 'omega3': 0.72, 'omega6': 0.88,
        'Tryptophan': 0.94, 'Threonine': 0.94, 'Isoleucine': 0.94, 'Leucine': 0.94,
        'Lysine': 0.94, 'Methionine': 0.94, 'Cystine': 0.90, 'Phenylalanine': 0.94,
        'Tyrosine': 0.94, 'Valine': 0.94, 'Arginine': 0.94, 'Histidine': 0.94,
    },
    'steamed': {
        'Protein': 0.95, 'VitaminA_RAE': 0.90, 'VitaminD': 1.00, 'VitaminE_alphaTocopherol': 0.94,
        'VitaminK_phylloquinone': 0.95, 'VitaminC_totalAscorbicAcid': 0.60, 'Thiamin': 0.85,
        'Riboflavin': 1.00, 'Niacin': 0.85, 'PantothenicAcid': 0.90, 'VitaminB6': 0.75,
        'Folate_total': 0.92, 'Folate_food': 0.92, 'Folate_DFE': 0.92, 'VitaminB12': 1.00,
        'Choline_total': 0.96, 'LuteinZeaxanthin': 0.70, 'Calcium_Ca': 0.92, 'Iron_Fe': 0.80,
        'Magnesium_Mg': 0.88, 'Phosphorus_P': 0.90, 'Potassium_K': 0.92, 'Sodium_Na': 0.92,
        'Zinc_Zn': 0.88, 'Copper_Cu': 0.90, 'Selenium_Se': 0.96, 'FattyAcids_totalPolyunsaturated': 0.72,
        'LinoleicAcid': 0.90, 'alphaLinolenicAcid': 0.80, 'DHA_22_6n3': 0.60, 'omega3': 0.75,
        'omega6': 0.90, 'Cystine': 0.92,
    },
    'baked': {
        'Protein': 0.94, 'TotalLipidFat': 1.00, 'Cholesterol': 0.94, 'VitaminA_RAE': 0.85,
        'Retinol': 0.84, 'Carotene_beta': 0.80, 'VitaminD': 0.95, 'VitaminE_alphaTocopherol': 0.88,
        'VitaminK_phylloquinone': 0.92, 'VitaminC_totalAscorbicAcid': 0.55, 'Thiamin': 0.75,
        'Riboflavin': 0.95, 'Niacin': 0.90, 'PantothenicAcid': 0.88, 'VitaminB6': 0.75,
        'Folate_total': 0.90, 'Folate_food': 0.90, 'Folate_DFE': 0.90, 'VitaminB12': 0.96,
        'Choline_total': 0.92, 'LuteinZeaxanthin': 0.62, 'Lycopene': 0.85, 'Calcium_Ca': 0.96,
        'Iron_Fe': 0.90, 'Magnesium_Mg': 0.94, 'Phosphorus_P': 0.94, 'Potassium_K': 0.92,
        'Sodium_Na': 0.96, 'Zinc_Zn': 0.92, 'Copper_Cu': 0.92, 'Selenium_Se': 0.96,
        'FattyAcids_totalSaturated': 0.98, 'FattyAcids_totalMonounsaturated': 0.96,
        'FattyAcids_totalPolyunsaturated': 0.65, 'LinoleicAcid': 0.82, 'alphaLinolenicAcid': 0.72,
        'EPA_20_5n3': 0.65, 'DPA_22_5n3': 0.65, 'DHA_22_6n3': 0.55, 'omega3': 0.68,
        'omega6': 0.82, 'Tryptophan': 0.93, 'Threonine': 0.93, 'Isoleucine': 0.93,
        'Leucine': 0.93, 'Lysine': 0.90, 'Methionine': 0.92, 'Cystine': 0.86,
        'Phenylalanine': 0.93, 'Tyrosine': 0.93, 'Valine': 0.93, 'Arginine': 0.90,
        'Histidine': 0.93,
    },
    'fried': {
        'Protein': 0.85, 'TotalLipidFat': 1.00, 'Cholesterol': 0.84, 'VitaminA_RAE': 0.84,
        'Retinol': 0.84, 'VitaminD': 0.84, 'VitaminE_alphaTocopherol': 0.88, 'VitaminK_phylloquinone': 0.92,
        'VitaminC_totalAscorbicAcid': 0.45, 'Thiamin': 0.78, 'Riboflavin': 0.90, 'Niacin': 0.88,
        'PantothenicAcid': 0.85, 'VitaminB6': 0.83, 'Folate_total': 0.85, 'Folate_food': 0.85,
        'Folate_DFE': 0.85, 'VitaminB12': 0.90, 'Choline_total': 0.84, 'LuteinZeaxanthin': 0.84,
        'Calcium_Ca': 0.84, 'Iron_Fe': 0.84, 'Magnesium_Mg': 0.85, 'Phosphorus_P': 0.85,
        'Potassium_K': 0.85, 'Sodium_Na': 0.85, 'Zinc_Zn': 0.84, 'Copper_Cu': 0.78,
        'Selenium_Se': 0.84, 'FattyAcids_totalSaturated': 0.95, 'FattyAcids_totalMonounsaturated': 0.95,
        'FattyAcids_totalPolyunsaturated': 0.60, 'LinoleicAcid': 0.76, 'alphaLinolenicAcid': 0.68,
        'EPA_20_5n3': 0.60, 'DPA_22_5n3': 0.78, 'DHA_22_6n3': 0.58, 'omega3': 0.59,
        'omega6': 0.78, 'Tryptophan': 0.85, 'Threonine': 0.85, 'Isoleucine': 0.85,
        'Leucine': 0.85, 'Lysine': 0.82, 'Methionine': 0.84, 'Cystine': 0.80,
        'Phenylalanine': 0.85, 'Tyrosine': 0.85, 'Valine': 0.85, 'Arginine': 0.82,
        'Histidine': 0.85,
    },
    'grilled': {
        'Protein': 0.85, 'TotalLipidFat': 0.90, 'VitaminA_RAE': 0.82, 'Retinol': 0.82,
        'Carotene_beta': 0.78, 'VitaminD': 0.88, 'VitaminE_alphaTocopherol': 0.82,
        'VitaminK_phylloquinone': 0.88, 'VitaminC_totalAscorbicAcid': 0.40, 'Thiamin': 0.70,
        'Riboflavin': 0.88, 'Niacin': 0.88, 'PantothenicAcid': 0.82, 'VitaminB6': 0.72,
        'Folate_total': 0.80, 'Folate_food': 0.80, 'Folate_DFE': 0.80, 'VitaminB12': 0.88,
        'Choline_total': 0.84, 'LuteinZeaxanthin': 0.60, 'Lycopene': 0.80, 'Calcium_Ca': 0.90,
        'Iron_Fe': 0.88, 'Magnesium_Mg': 0.88, 'Phosphorus_P': 0.88, 'Potassium_K': 0.88,
        'Sodium_Na': 0.90, 'Zinc_Zn': 0.88, 'Copper_Cu': 0.84, 'Selenium_Se': 0.90,
        'FattyAcids_totalSaturated': 0.88, 'FattyAcids_totalMonounsaturated': 0.88,
        'FattyAcids_totalPolyunsaturated': 0.55, 'LinoleicAcid': 0.72, 'alphaLinolenicAcid': 0.62,
        'EPA_20_5n3': 0.58, 'DPA_22_5n3': 0.58, 'DHA_22_6n3': 0.50, 'omega3': 0.60,
        'omega6': 0.72, 'Lysine': 0.80, 'Cystine': 0.76, 'Arginine': 0.80, 'Tryptophan': 0.84,
        'Threonine': 0.84, 'Methionine': 0.82,
    },
    'microwave': {
        'Protein': 0.96, 'VitaminA_RAE': 0.92, 'VitaminD': 1.00, 'VitaminE_alphaTocopherol': 0.94,
        'VitaminK_phylloquinone': 0.96, 'VitaminC_totalAscorbicAcid': 0.72, 'Thiamin': 0.84,
        'Riboflavin': 0.98, 'Niacin': 0.92, 'PantothenicAcid': 0.92, 'VitaminB6': 0.80,
        'Folate_total': 0.92, 'Folate_food': 0.92, 'Folate_DFE': 0.92, 'VitaminB12': 0.98,
        'Choline_total': 0.96, 'LuteinZeaxanthin': 0.78, 'Calcium_Ca': 0.96, 'Iron_Fe': 0.92,
        'Magnesium_Mg': 0.94, 'Phosphorus_P': 0.96, 'Potassium_K': 0.94, 'Selenium_Se': 0.96,
        'FattyAcids_totalPolyunsaturated': 0.78, 'LinoleicAcid': 0.88, 'alphaLinolenicAcid': 0.82,
        'DHA_22_6n3': 0.72, 'omega3': 0.80, 'omega6': 0.88,
    },
    'no_heat': {},
}

LOSS_COVERED_NUTRIENTS = {
    nutrient
    for factors in COOKING_RETENTION.values()
    for nutrient in factors.keys()
}

RAW_COOK_METHODS = {
    'Raw', 'raw', 'Unprepared', 'Uncooked', 'Unheated', 'Unroasted',
    'Not Prepared', 'Raw or Unheated', 'z', 'null', 'N/A',
}

COOKED_DESC_KEYWORDS = [
    'cooked', 'baked', 'roasted', 'fried', 'boiled', 'grilled', 'broiled',
    'steamed', 'smoked', 'canned', 'microwaved', 'sauteed', 'stewed',
    'braised', 'poached', 'heated', 'toasted', 'blanched', 'parboiled',
    'scrambled', 'kippered', 'pickled', 'prepared from recipe', 'commercially prepared',
    'restaurant,', 'restaurant', 'fast foods,', 'frozen entree', 'frozen, prepared',
    'home-prepared', 'ready-to-serve', 'ready-to-eat', 'ready to eat', ', prepared',
    'commercial', 'cookies,', 'doughnut', 'strudel', 'pie,', 'rolls,', ' salad',
    'shake', 'sandwich', 'submarine', 'burrito', 'sauce,',
]

def load_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def load_v2_recipe_meta(path):
    if not path.exists():
        return {}
    rows = load_csv(path)
    meta = {}
    for row in rows:
        recipe_id = (row.get('recipe_id') or '').strip()
        if not recipe_id:
            continue
        meta[recipe_id] = row
    return meta

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

def to_float(value, default=1.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

def map_recipe_cook_method(cook_method):
    if not cook_method:
        return 'raw'

    m = cook_method.lower()

    if 'microwav' in m:
        return 'microwave'
    if 'steam' in m:
        return 'steamed'
    if any(token in m for token in ('grill', 'broil', 'barbecue', 'bbq')):
        return 'grilled'
    if any(token in m for token in ('fry', 'fried', 'stir-fry', 'stir_fry', 'saute', 'saut', 'pan-fry', 'pan_fry')):
        return 'fried'
    if any(token in m for token in ('bake', 'baked', 'roast', 'roasted', 'oven', 'dry heat', 'dry_heat', 'toasted')):
        return 'baked'
    if any(token in m for token in ('boil', 'boiled', 'braise', 'braised', 'stew', 'stovetop', 'simmer', 'poach', 'parboil', 'blanch')):
        return 'boiled'

    return 'raw'

def get_retention_factor(method, nutrient_key):
    return COOKING_RETENTION.get(method, {}).get(nutrient_key, 1.0)

def resolve_ingredient_state(cook_method, cured_fresh, long_desc):
    if cured_fresh and 'canned' in cured_fresh.lower():
        return 'no_heat'

    method = cook_method or 'z'
    if method not in RAW_COOK_METHODS:
        return 'no_heat'

    if method in ('z', 'null'):
        desc = f'{long_desc} {cured_fresh or ""}'.lower()
        if any(keyword in desc for keyword in COOKED_DESC_KEYWORDS):
            return 'no_heat'

    return 'raw'

def apply_rule_b_missing_fallback(canonical_per100g, build_per100g):
    """
    Rule B policy: replace canonical-zero nutrients with the ingredient build
    value when one of:
      - the nutrient is in LOSS_COVERED_NUTRIENTS (cooking-retention modeled), OR
      - the nutrient is FiberTotalDietary / SugarsTotal — these are reliably
        present in raw ingredients (esp. fruit, sugar) and survive baking
        essentially unchanged, so the canonical 0 is a missing-data artifact
        rather than a real value.

    Returns (merged_dict, all_replaced, loss_covered_replaced):
      all_replaced          — any canonical-zero nutrient where built value > 0
      loss_covered_replaced — subset actually written into merged
    """
    fillable = LOSS_COVERED_NUTRIENTS | {'FiberTotalDietary', 'SugarsTotal'}
    merged = dict(canonical_per100g)
    all_replaced = []
    loss_covered_replaced = []
    for nutrient in NUTRIENT_COLS:
        canonical_value = float(canonical_per100g.get(nutrient) or 0.0)
        build_value = float(build_per100g.get(nutrient) or 0.0)
        if canonical_value <= 0.0 and build_value > 0.0:
            all_replaced.append(nutrient)
            if nutrient in fillable:
                merged[nutrient] = round2(build_value)
                loss_covered_replaced.append(nutrient)
    return merged, sorted(all_replaced), sorted(loss_covered_replaced)

def pick_canonical_serving_grams(food_row):
    if not food_row:
        return None
    fallback = None
    candidates = []
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
        candidates.append(grams)
    if candidates:
        # Prefer the smallest reasonable per-serving portion (>=5g) so we don't
        # accidentally pick whole-product entries like 'pie (9" dia)' = 1186g
        # when 'piece (1/8 of 9" dia)' = 144g is also available.
        viable = sorted(g for g in candidates if g >= 5)
        return viable[0] if viable else min(candidates)
    return fallback

def build_per_serving(sr28_row, portion_grams):
    """Scale SR28 per-100g values to per-serving using portion_grams."""
    scale = portion_grams / 100.0
    return {k: round2((sr28_row[k] or 0.0) * scale) for k in NUTRIENT_COLS}

def build_ingredient_sum(db, ingr_rows, cooking_method='raw', yield_factor_water=1.0, yield_factor_fat=1.0):
    """
    Sum nutrient contributions from dish_ingredient + ingredient rows.

    Finished mass is handled once at the recipe level using v2 yield factors.
    Water is reduced via yield_factor_water, not per-ingredient retention, so
    evaporation is not counted twice.

    Returns (totals_dict, cooked_total_grams) or (None, 0) if no rows have valid NBDs.
    """
    totals = {k: 0.0 for k in NUTRIENT_COLS}
    raw_total_grams = 0.0
    raw_water_total = 0.0
    raw_fat_total = 0.0
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
        raw_total_grams += grams
        raw_water_total += (sr28.get('Water') or 0.0) * scale
        raw_fat_total += (sr28.get('TotalLipidFat') or 0.0) * scale

        ingredient_state = resolve_ingredient_state(
            sr28.get('_cookMethod'),
            sr28.get('_curedFresh'),
            sr28.get('_Long_Desc') or '',
        )

        for k in NUTRIENT_COLS:
            amount = (sr28[k] or 0.0) * scale
            if k == 'Water':
                retained = amount * yield_factor_water
            elif k == 'TotalLipidFat':
                retained = amount * yield_factor_fat
            elif ingredient_state == 'no_heat':
                retained = amount
            else:
                retained = amount * get_retention_factor(cooking_method, k)

            totals[k] = round2(totals[k] + retained)
        hit += 1
    if hit == 0:
        return None, 0

    water_lost = raw_water_total * (1.0 - yield_factor_water)
    fat_lost = raw_fat_total * (1.0 - yield_factor_fat)
    cooked_total_grams = max(raw_total_grams - water_lost - fat_lost, 1e-6)
    return totals, round2(cooked_total_grams)

def main():
    print(f'Reading CSVs...')
    recipes = {r['recipe_id']: r for r in load_csv(RECIPES_CSV)}
    ingr_rows = load_csv(INGR_CSV)
    food_rows = load_csv(FOODS_CSV)
    v2_recipe_meta = load_v2_recipe_meta(V2_RECIPES_CSV)
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
    rule_b_audit = []

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

        sr_rule = (recipe.get('sr28_rule') or '').strip()
        v2_meta = v2_recipe_meta.get(recipe_id, {})
        if v2_meta.get('sr_rule'):
            sr_rule = v2_meta['sr_rule'].strip()

        ndb_no = dish_row.get('ndb_no', '').strip()
        link_type = recipe.get('link_type', 'dish').strip()
        servings_count = parse_servings(recipe.get('servings', '')) or 1
        rule_prefers_build = sr_rule in BUILD_RULES
        build_method_label = (v2_meta.get('cook_method') or '').strip() or None
        model_method = map_recipe_cook_method(build_method_label or None)
        yield_factor_water = to_float(v2_meta.get('yield_factor_water'), 1.0)
        yield_factor_fat = to_float(v2_meta.get('yield_factor_fat'), 1.0)

        if not ndb_no:
            totals, total_grams = build_ingredient_sum(
                db,
                rows,
                cooking_method=model_method,
                yield_factor_water=yield_factor_water,
                yield_factor_fat=yield_factor_fat,
            )
            if not totals:
                warnings.append(f'{recipe_id}: no ndb_no and no valid ingredient rows — skipped')
                continue
            eff_grams = round2(total_grams / servings_count) if total_grams > 0 else 0.0
            per_100g = {k: round2(totals[k] * 100.0 / total_grams) for k in NUTRIENT_COLS} if total_grams > 0 else {k: 0.0 for k in NUTRIENT_COLS}
            per_serving = {k: round2(per_100g[k] * eff_grams / 100.0) for k in NUTRIENT_COLS}
            output[recipe_id] = {
                'ndb': 'ingredient-sum',
                'long_desc': f'{recipe.get("recipe_name", recipe_id)} (ingredient-build)',
                'cook_method': build_method_label,
                'gramsPerServing': eff_grams,
                'servings': servings_count,
                'perServing': per_serving,
                'per100g': per_100g,
            }
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

        # Rule C / Rule D prefer the authored build even if a canonical dish row exists.
        # 'mixed' recipes always use the ingredient build.
        if rule_prefers_build or link_type == 'mixed':
            totals, total_grams = build_ingredient_sum(
                db,
                rows,
                cooking_method=model_method,
                yield_factor_water=yield_factor_water,
                yield_factor_fat=yield_factor_fat,
            )
            if not totals:
                warnings.append(f'{recipe_id}: build-preferred recipe but no valid ingredient rows — skipped')
                continue

            # Build-preferred recipes (Rule C / Rule D / mixed) own their own mass:
            # divide cooked recipe grams by recipe-level servings_count.  Avoid
            # pick_canonical_serving_grams here — it can return whole-product portions
            # (e.g. M2='pie (9" dia)' = 1186g) that don't match the recipe's serving plan.
            eff_grams = round2(total_grams / servings_count) if total_grams > 0 and servings_count else round2(portion_grams)
            per_100g = {k: round2(totals[k] * 100.0 / total_grams) for k in NUTRIENT_COLS} if total_grams > 0 else {k: 0.0 for k in NUTRIENT_COLS}
            per_serving = {k: round2(per_100g[k] * eff_grams / 100.0) for k in NUTRIENT_COLS}
            output[recipe_id] = {
                'ndb': ndb_no or 'ingredient-sum',
                'long_desc': f'{recipe.get("recipe_name", recipe_id)} (ingredient-build)',
                'cook_method': build_method_label,
                'gramsPerServing': eff_grams,
                'servings': servings_count,
                'perServing': per_serving,
                'per100g': per_100g,
            }
            continue

        sr28_row = query_ndb(db, ndb_no)
        if not sr28_row:
            # Fallback: sum dish_ingredient/ingredient rows
            totals, total_grams = build_ingredient_sum(
                db,
                rows,
                cooking_method=model_method,
                yield_factor_water=yield_factor_water,
                yield_factor_fat=yield_factor_fat,
            )
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
                'servings': servings_count,
                'perServing': per_serving,
                'per100g': per_100g,
            }
            continue

        canonical_food_row = foods_by_ndb.get(ndb_no) or foods_by_word.get(recipe.get('food_word', '').strip())
        serving_grams = pick_canonical_serving_grams(canonical_food_row) or portion_grams

        # Canonical SR rows are already per 100g; keep that basis independent of serving size.
        per_100g = {k: round2(float(sr28_row.get(k) or 0.0)) for k in NUTRIENT_COLS}

        # Rule B: fill only canonical-zero nutrients covered by cooking-loss model.
        if sr_rule == 'Rule B':
            build_totals, build_total_grams = build_ingredient_sum(
                db,
                rows,
                cooking_method=model_method,
                yield_factor_water=yield_factor_water,
                yield_factor_fat=yield_factor_fat,
            )
            if build_totals and build_total_grams > 0:
                build_per_100g = {
                    k: round2(build_totals[k] * 100.0 / build_total_grams)
                    for k in NUTRIENT_COLS
                }
                per_100g, all_replaced, loss_covered_replaced = apply_rule_b_missing_fallback(per_100g, build_per_100g)
                if all_replaced or loss_covered_replaced:
                    recipe_name = recipe.get('recipe_name', recipe_id)
                    line1 = (
                        f"{recipe_id} ({recipe_name}): All canonical-zero → built-non-zero ({len(all_replaced)}): "
                        f"{', '.join(all_replaced) if all_replaced else 'none'}"
                    )
                    line2 = (
                        f"{recipe_id} ({recipe_name}): Loss-covered replaced ({len(loss_covered_replaced)}): "
                        f"{', '.join(loss_covered_replaced) if loss_covered_replaced else 'none'}"
                    )
                    warnings.append(line1)
                    warnings.append(line2)
                    rule_b_audit.append(line1)
                    rule_b_audit.append(line2)

        per_serving = {k: round2(per_100g[k] * serving_grams / 100.0) for k in NUTRIENT_COLS}

        output[recipe_id] = {
            'ndb': ndb_no,
            'long_desc': sr28_row['_Long_Desc'],
            'cook_method': sr28_row['_cookMethod'],
            'gramsPerServing': round2(serving_grams),
            'servings': servings_count,
            'perServing': per_serving,
            'per100g': per_100g,
        }

    db.close()

    if warnings:
        print(f'\nWarnings ({len(warnings)}):')
        for w in warnings:
            print(f'  ⚠ {w}')

    # Persist Rule B fallback replacements for accounting/audit review.
    audit_lines = [
        'Rule B Fallback Audit',
        'Generated by generate_recipe_nutrition.py',
        f'Total Rule B fallback recipes this run: {len(rule_b_audit)}',
        '',
    ]
    if rule_b_audit:
        audit_lines.extend(rule_b_audit)
    else:
        audit_lines.append('No Rule B fallback replacements in this run.')
    audit_lines.append('')
    AUDIT_OUT.write_text('\n'.join(audit_lines), encoding='utf-8')
    print(f'Written → {AUDIT_OUT}')

    print(f'\nBuilt nutrition for {len(output)}/{len(recipes)} recipes.')

    # ── Write TypeScript output ────────────────────────────────────────────────
    lines = [
        '// Auto-generated by generate_recipe_nutrition.py — do not edit manually.',
        '// Rule A / Rule B use canonical dish rows; Rule C / Rule D use ingredient builds.',
        '// Build-preferred recipes use v2 cook method + yield factors and keep evaporation at recipe level only.',
        '// perServing: nutrients scaled to one serving.',
        '// per100g: nutrients per 100g of finished dish.',
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

    # ── Sidecar JSON for downstream pipelines (e.g. generate_levels.py) ────────
    OUT_JSON.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Written → {OUT_JSON}')

if __name__ == '__main__':
    main()
