#!/usr/bin/env python3
"""
Generate food-micros.ts — full micronutrient profiles per food NDB number.

Source DB: jetcool DataCentralCombo (USDA SR Legacy + extensions)
Output:    src/lib/data/food-micros.ts

Run from the daily-food-chain directory:
  python3 src/lib/data/generate-food-micros.py

Units stored (all per 100g edible portion):
  Fatty acids, amino acids, alcohol, ash: g
  Vitamins: mcg (A_RAE, D, K, K2, folate, B12, iodine, selenium)
            mg  (E, C, B1, B2, B3, B5, B6, choline)
  Minerals: mg  (calcium, copper, fluoride, iron, magnesium, manganese,
                 phosphorus, potassium, sodium, zinc)
            mcg (iodine, selenium)
  Cholesterol: mg  |  Caffeine, theobromine, betaine: mg  |  GI/GL: index
"""

import re, sqlite3, json, os

DB_PATH     = '/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db'
PORTIONS_TS = os.path.join(os.path.dirname(__file__), 'food-portions.ts')
OUT_FILE    = os.path.join(os.path.dirname(__file__), 'food-micros.ts')

# app field name → DB column name
FIELDS = {
    # Fatty acids (g)
    'linoleic_acid':        'LinoleicAcid',
    'alpha_linolenic_acid': 'alphaLinolenicAcid',
    'saturated_fat':        'FattyAcids_totalSaturated',
    'trans_fat':            'FattyAcids_totalTrans',
    'monounsaturated_fat':  'FattyAcids_totalMonounsaturated',
    'polyunsaturated_fat':  'FattyAcids_totalPolyunsaturated',
    'omega3_total':         'omega3_total',
    'omega6_total':         'omega6_total',
    'epa':                  'EPA_20_5n3',
    'dpa':                  'DPA_22_5n3',
    'dha':                  'DHA_22_6n3',
    'gla':                  'PUFA_18_3_n6',
    'arachidonic':          'PUFA_20_4_n6',
    'trans_monoenoic':      'FattyAcids_totalTransMonoenoic',
    # Cholesterol (mg)
    'cholesterol':          'Cholesterol',
    # Vitamins
    'vitamin_a_rae':        'VitaminA_RAE',
    'vitamin_d':            'VitaminD',
    'vitamin_e':            'VitaminE_alphaTocopherol',
    'vitamin_k':            'VitaminK_phylloquinone',
    'vitamin_k2':           'Menaquinone4',
    'vitamin_c':            'VitaminC_totalAscorbicAcid',
    'thiamin':              'Thiamin',
    'riboflavin':           'Riboflavin',
    'niacin':               'Niacin',
    'pantothenic_acid':     'PantothenicAcid',
    'vitamin_b6':           'VitaminB6',
    'folate':               'Folate_DFE',
    'vitamin_b12':          'VitaminB12',
    'choline':              'Choline_total',
    # Minerals
    'calcium':              'Calcium_Ca',
    'copper':               'Copper_Cu',
    'fluoride':             'Flouride_F',    # note USDA typo
    'iodine':               'Iodine_I',
    'iron':                 'Iron_Fe',
    'magnesium':            'Magnesium_Mg',
    'manganese':            'Manganese_Mn',
    'phosphorus':           'Phosphorus_P',
    'potassium':            'Potassium_K',
    'selenium':             'Selenium_Se',
    'sodium':               'Sodium_Na',
    'zinc':                 'Zinc_Zn',
    # Sugars detail (g)
    'starch':               'Starch',
    'sucrose':              'Sucrose',
    'glucose':              'Glucose_Dextrose',
    'fructose':             'Fructose',
    'lactose':              'Lactose',
    'maltose':              'Maltose',
    'galactose':            'Galactose',
    # Amino acids (g)
    'tryptophan':           'Tryptophan',
    'threonine':            'Threonine',
    'isoleucine':           'Isoleucine',
    'leucine':              'Leucine',
    'lysine':               'Lysine',
    'methionine':           'Methionine',
    'phenylalanine':        'Phenylalanine',
    'valine':               'Valine',
    'histidine':            'Histidine',
    'arginine':             'Arginine',
    'alanine':              'Alanine',
    'aspartic_acid':        'AsparticAcid',
    'glutamic_acid':        'GlutamicAcid',
    'glycine':              'Glycine',
    'proline':              'Proline',
    'serine':               'Serine',
    # Other
    'alcohol':              'AlcholEthyl',
    'caffeine':             'Caffeine',
    'theobromine':          'Theobromine',
    'betaine':              'Betaine',
    'ash':                  'Ash',
}

APP_KEYS = list(FIELDS.keys())
DB_COLS  = [FIELDS[k] for k in APP_KEYS]

# ── 1. Extract NDB numbers from food-portions.ts ────────────────────────────
print('Reading food-portions.ts...')
with open(PORTIONS_TS, 'r') as f:
    content = f.read()
ndb_strs = re.findall(r'"ndb"\s*:\s*"([^"]+)"', content)
ndb_set  = set(ndb_strs)
print(f'  Found {len(ndb_set)} unique NDB numbers')

# ── 2. Query comboo.db ───────────────────────────────────────────────────────
print('Querying comboo.db...')
conn    = sqlite3.connect(DB_PATH)
# NDB_NO in DB is stored without leading zeros (integer-like string)
# ndb_strs may have leading zeros — strip them for matching, keep original as key
int_to_str = { str(int(n)): n for n in ndb_set if n.isdigit() }
placeholders = ','.join('?' * len(int_to_str))
sel_cols = ','.join(f'"{c}"' for c in DB_COLS)
query = f'SELECT NDB_NO, {sel_cols} FROM DataCentralCombo WHERE NDB_NO IN ({placeholders})'
rows  = conn.execute(query, list(int_to_str.keys())).fetchall()
conn.close()
print(f'  Matched {len(rows)} rows in DB (of {len(ndb_set)} requested)')

# ── 3. Build lookup dict: original ndb string → sparse micro dict ────────────
def fmt(v):
    """Round to at most 4 significant figures, strip trailing zeros."""
    if v is None or v == 0:
        return None
    r = float(v)
    if r == 0:
        return None
    # Use up to 4 significant figures
    from decimal import Decimal, ROUND_HALF_UP
    mag = len(str(int(abs(r)))) if abs(r) >= 1 else 0
    places = max(0, 4 - mag)
    rounded = round(r, places)
    return rounded if rounded != 0 else None

# Unit conversions applied at extraction time (DB unit → display/DRI unit)
# vitamin_d: DB stores IU, DRI uses mcg  →  ÷ 40
UNIT_CONVERSIONS = {
    'vitamin_d': 1 / 40,
}

micros = {}
for row in rows:
    db_ndb = str(row[0])
    orig_ndb = int_to_str.get(db_ndb)
    if not orig_ndb:
        continue
    sparse = {}
    for i, key in enumerate(APP_KEYS):
        raw = row[i + 1]
        if raw is not None and key in UNIT_CONVERSIONS:
            raw = raw * UNIT_CONVERSIONS[key]
        v = fmt(raw)
        if v is not None:
            sparse[key] = v
    micros[orig_ndb] = sparse

print(f'  Processed {len(micros)} foods')

# ── 4. Write TypeScript file ─────────────────────────────────────────────────
print('Writing food-micros.ts...')

# Build the TypeScript interface fields string
type_comments = {
    'linoleic_acid':        '// g (Ω6)',
    'alpha_linolenic_acid': '// g (Ω3)',
    'saturated_fat':        '// g',
    'trans_fat':            '// g',
    'monounsaturated_fat':  '// g',
    'polyunsaturated_fat':  '// g',
    'omega3_total':         '// g',
    'omega6_total':         '// g',
    'epa':                  '// g',
    'dpa':                  '// g',
    'dha':                  '// g',
    'gla':                  '// g  (GLA, Ω6)',
    'arachidonic':          '// g  (ARA, Ω6)',
    'trans_monoenoic':      '// g',
    'cholesterol':          '// mg',
    'vitamin_a_rae':        '// mcg RAE',
    'vitamin_d':            '// mcg',
    'vitamin_e':            '// mg',
    'vitamin_k':            '// mcg K1',
    'vitamin_k2':           '// mcg MK-4',
    'vitamin_c':            '// mg',
    'thiamin':              '// mg B1',
    'riboflavin':           '// mg B2',
    'niacin':               '// mg B3',
    'pantothenic_acid':     '// mg B5',
    'vitamin_b6':           '// mg',
    'folate':               '// mcg DFE B9',
    'vitamin_b12':          '// mcg',
    'choline':              '// mg',
    'calcium':              '// mg',
    'copper':               '// mg',
    'fluoride':             '// mg',
    'iodine':               '// mcg',
    'iron':                 '// mg',
    'magnesium':            '// mg',
    'manganese':            '// mg',
    'phosphorus':           '// mg',
    'potassium':            '// mg',
    'selenium':             '// mcg',
    'sodium':               '// mg',
    'zinc':                 '// mg',
    'starch':               '// g',
    'sucrose':              '// g',
    'glucose':              '// g',
    'fructose':             '// g',
    'lactose':              '// g',
    'maltose':              '// g',
    'galactose':            '// g',
    'tryptophan':           '// g',
    'threonine':            '// g',
    'isoleucine':           '// g',
    'leucine':              '// g',
    'lysine':               '// g',
    'methionine':           '// g',
    'phenylalanine':        '// g',
    'valine':               '// g',
    'histidine':            '// g',
    'arginine':             '// g',
    'alanine':              '// g',
    'aspartic_acid':        '// g',
    'glutamic_acid':        '// g',
    'glycine':              '// g',
    'proline':              '// g',
    'serine':               '// g',
    'alcohol':              '// g',
    'caffeine':             '// mg',
    'theobromine':          '// mg',
    'betaine':              '// mg',
    'ash':                  '// g',
}

iface_lines = []
for key in APP_KEYS:
    comment = type_comments.get(key, '')
    iface_lines.append(f'  {key}?: number; {comment}')

# Build data entries
data_lines = []
for ndb in sorted(micros.keys(), key=lambda x: int(x) if x.isdigit() else 0):
    d = micros[ndb]
    if not d:
        continue
    inner = ', '.join(f'{k}: {v}' for k, v in d.items())
    data_lines.append(f'  "{ndb}": {{{inner}}}')

ts_content = f'''// AUTO-GENERATED — do not edit manually.
// Run: python3 src/lib/data/generate-food-micros.py
// Source: jetcool DataCentralCombo (USDA SR Legacy), per 100g edible portion.
// Units: see interface comments.  Missing/zero values are absent (treated as 0).

/** Micronutrient profile for a single food item, per 100g edible portion. */
export interface FoodMicros {{
{chr(10).join(iface_lines)}
}}

/**
 * Lookup: USDA NDB string → FoodMicros per 100g.
 * Use getMicrosForGrams(ndb, grams) to scale by portion size.
 */
export const FOOD_MICROS: Record<string, FoodMicros> = {{
{(',' + chr(10)).join(data_lines)}
}};

/**
 * Return micronutrient totals for a given food+grams, scaled from per-100g values.
 * Returns null if the NDB is not in the database.
 */
export function getMicrosForGrams(ndb: string, grams: number): FoodMicros | null {{
  const base = FOOD_MICROS[ndb];
  if (!base) return null;
  const ratio = grams / 100;
  const result: FoodMicros = {{}};
  for (const key in base) {{
    const v = base[key as keyof FoodMicros];
    if (v !== undefined) {{
      (result as Record<string, number>)[key] = v * ratio;
    }}
  }}
  return result;
}}
'''

with open(OUT_FILE, 'w') as f:
    f.write(ts_content)

size_kb = os.path.getsize(OUT_FILE) // 1024
print(f'  Written {OUT_FILE} ({size_kb} KB)')
print('Done.')
