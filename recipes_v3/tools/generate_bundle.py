#!/usr/bin/env python3
"""Generate the SvelteKit bundle (`generated-levels.ts`) from v3 data.

Reads exclusively from ``recipes_v3/data/`` (CSVs + game_design.csv) and
``recipes_v3/output/builds/`` (per-recipe JSON). The only external file
touched is ``comboo.db``, used solely to look up SR-Legacy ``Long_Desc``
for the bundled dish-row display name. All paths come from
``recipes_v3.config``; no absolute paths in this file.

Phase 8b-1 (2026-05-07): moved from project root to recipes_v3/tools/;
game-design literals lifted to recipes_v3/lib/game_design.py +
recipes_v3/data/game_design.csv. See docs/v3.md.

Run:
    python3 recipes_v3/tools/generate_bundle.py
"""

import csv
import json
import os
import re
import sqlite3
import sys
from pathlib import Path

# Make recipes_v3/ (config + lib) importable when run as a script.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config import (  # noqa: E402
    BUILDS_DIR,
    BUNDLE_OUTPUT,
    COMBOO_DB,
    INGREDIENTS_LEDGER_CSV,
    RECIPE_INGREDIENTS_CSV,
    RECIPE_INSTRUCTIONS_CSV,
    RECIPE_SECTIONS_CSV,
    RECIPES_CSV,
)
from lib.game_design import (  # noqa: E402
    CATEGORY_DIFFICULTY,
    get_animal_spawns,
    get_food_supply,
    get_tools,
    load_recipe_foods,
)

# Local aliases preserved so the rest of the file reads unchanged.
V3_BUILDS_DIR    = str(BUILDS_DIR)
RECIPES_CSV      = str(RECIPES_CSV)
INGREDIENTS_CSV  = str(RECIPE_INGREDIENTS_CSV)
INSTRUCTIONS_CSV = str(RECIPE_INSTRUCTIONS_CSV)
SECTIONS_CSV     = str(RECIPE_SECTIONS_CSV)
LEDGER_CSV       = str(INGREDIENTS_LEDGER_CSV)
OUTPUT           = str(BUNDLE_OUTPUT)
COMBOO_DB        = str(COMBOO_DB)

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

def esc(s):
    """Escape a string for TypeScript single-quoted string."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\r', '').replace('\n', '\\n')

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
        if ing.get('componentRef'): parts.append(f"componentRef: '{esc(ing['componentRef'])}'")
        if ing.get('exempt'):    parts.append('exempt: true')
        if ing.get('discarded'): parts.append('discarded: true')
        if ing.get('discardPercent') is not None: parts.append(f"discardPercent: {ing['discardPercent']}")
        lines.append('      { ' + ', '.join(parts) + ' }')
    return '[\n' + ',\n'.join(lines) + '\n    ]'

def ts_instructions(instr_list):
    if not instr_list:
        return '[]'
    lines = [f"      '{esc(t)}'" for t in instr_list]
    return '[\n' + ',\n'.join(lines) + '\n    ]'

def _parse_cook_stages(raw):
    """Parse '425:20,375:33' -> [{tempF:425,minutes:20},{tempF:375,minutes:33}]"""
    if not raw or not raw.strip():
        return []
    result = []
    for part in raw.strip().split(','):
        part = part.strip()
        if ':' in part:
            temp_str, min_str = part.split(':', 1)
            try:
                result.append({'tempF': int(temp_str.strip()), 'minutes': int(min_str.strip())})
            except ValueError:
                pass
    return result


def _parse_boil_stages(raw):
    """Parse '10' -> 10 (minutes). Returns None if absent."""
    if not raw or not raw.strip():
        return None
    try:
        return int(raw.strip())
    except ValueError:
        return None


def ts_sections(sections):
    """Format per-section cooking-method/yield rows for the bundle.

    Surfaces the data already in nutritionJson.sections[] at the top level
    of the Level so UI layouts can render section headers like
    'Crust — baked' grouping the matching recipeIngredients rows by
    `section` (which equals `key`).
    """
    if not sections:
        return '[]'
    lines = []
    for s in sections:
        parts = [
            f"key: '{esc(s['key'])}'",
            f"label: '{esc(s.get('label', ''))}'",
            f"cookingMethod: '{esc(s['cookingMethod'])}'",
        ]
        if s.get('prepMethod') is not None:  # always write, even empty string
            parts.append(f"prepMethod: '{esc(s['prepMethod'])}'")
        if s.get('stages'):
            stage_parts = ', '.join(
                f"{{ tempF: {st['tempF']}, minutes: {st['minutes']} }}"
                for st in s['stages']
            )
            parts.append(f"stages: [{stage_parts}]")
        if s.get('boilMinutes') is not None:
            parts.append(f"boilMinutes: {s['boilMinutes']}")
        if s.get('yieldFactorWater') is not None:
            parts.append(f"yieldFactorWater: {s['yieldFactorWater']}")
        if s.get('yieldFactorFat') is not None and s['yieldFactorFat'] != 1.0:
            parts.append(f"yieldFactorFat: {s['yieldFactorFat']}")
        if s.get('yieldFactorOther') is not None and s['yieldFactorOther'] != 1.0:
            parts.append(f"yieldFactorOther: {s['yieldFactorOther']}")
        lines.append('      { ' + ', '.join(parts) + ' }')
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

# Per-recipe board foods (game_design.csv, Phase 8b-1).
recipe_foods = load_recipe_foods()

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

sections_by_recipe = {}
try:
    for row in csv.DictReader(open(SECTIONS_CSV)):
        rid = (row.get('recipe_id') or '').strip()
        if not rid:
            continue
        sections_by_recipe.setdefault(rid, []).append(row)
except FileNotFoundError:
    pass

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
    foods = recipe_foods.get(rid, ['bread'])
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
        ing_key = ing['ingredient_key']
        # Phase 8c: component-ref ingredient (@<child_id>) — render as an isDish
        # row referencing the child recipe. The front-end already filters isDish
        # rows out of per-ingredient nutrition tallies; the parent's nutrition_json
        # already encodes the composite totals.
        if ing_key.startswith('@'):
            child_id = ing_key[1:]
            child_rec = next((r for r in recipes if r['recipe_id'] == child_id), None)
            child_name = (
                ing.get('display_name_override')
                or (child_rec.get('recipe_name', child_id) if child_rec else child_id)
            )
            item = {
                'name':        child_name,
                'quantity':    ing.get('qty_display', ''),
                'foodWord':    (child_rec.get('food_word', '') if child_rec else ''),
                'ndbNo':       (child_rec.get('canonical_ndb_no', '') if child_rec else ''),
                'portionDesc': 'g',
                'isDish':      True,
                'componentRef': child_id,
            }
            try:
                item['portionGrams'] = float(ing.get('grams', '') or 0) or None
                if item['portionGrams'] is None:
                    del item['portionGrams']
            except ValueError:
                pass
            if ing.get('section'):
                item['section'] = ing['section']
            if (ing.get('is_discarded') or '').strip().lower() in ('1', 'true', 'yes', 'y'):
                item['discarded'] = True
                item['discardPercent'] = float(ing.get('discard_percent') or 100)
            recipe_ings.append(item)
            continue
        led = ledger.get(ing_key, {})
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
        if (ing.get('is_discarded') or '').strip().lower() in ('1', 'true', 'yes', 'y'):
            item['discarded'] = True
            item['discardPercent'] = float(ing.get('discard_percent') or 100)
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
    # Auto-append the Suggestions step if it was not explicitly authored.
    _SUGGESTIONS_MARKER = "Suggestions (not included):"
    if instr_texts and not instr_texts[-1].startswith(_SUGGESTIONS_MARKER):
        instr_texts.append(_SUGGESTIONS_MARKER)

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

    # Per-section cooking methods (Phase 8b layout surfacing).
    # Built from recipe_sections.csv when present; empty otherwise.
    section_rows = sections_by_recipe.get(rid, [])
    sections_meta = [
        {
            'key':              (s.get('section_key') or '').strip(),
            'label':            (s.get('section_label') or '').strip(),
            'cookingMethod':    (s.get('cook_method') or '').strip().lower(),
            'prepMethod':       (s.get('prep_method') or '').strip(),
            'stages':           _parse_cook_stages(s.get('cook_stages', '')),
            'boilMinutes':      _parse_boil_stages(s.get('boil_stages', '')),
            'yieldFactorWater': (lambda v: float(v) if v not in (None, '') else None)(s.get('yield_factor_water')),
            'yieldFactorFat':   (lambda v: float(v) if v not in (None, '') else None)(s.get('yield_factor_fat')),
            'yieldFactorOther': (lambda v: float(v) if v not in (None, '') else None)(s.get('yield_factor_other')),
        }
        for s in section_rows
    ]
    sections_field = (
        f"\n    sections: {ts_sections(sections_meta)},"
        if sections_meta else ''
    )

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
    recipeInstructions: {ts_instructions(instr_texts)},{sections_field}
  }}"""
    level_blocks.append(block)

output = """// Auto-generated — do not edit. Run recipes_v3/tools/generate_bundle.py to regenerate.
import type { Level } from './types';

export const LEVELS: Level[] = [
""" + ',\n'.join(level_blocks) + """
];
"""

with open(OUTPUT, 'w') as f:
    f.write(output)

print(f"Generated {len(level_blocks)} levels → {OUTPUT}")
