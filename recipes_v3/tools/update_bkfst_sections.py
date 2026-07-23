"""
update_bkfst_sections.py
Apply all BKFST cook_stages annotations and section splits for recipes 11-52.
"""
import csv

BASE = "/Volumes/training/Daily Food Chain/daily-food-chain/recipes_v3/data"
SECTIONS_FILE = f"{BASE}/recipe_sections.csv"
INGREDIENTS_FILE = f"{BASE}/recipe_ingredients.csv"

# ── READ ──────────────────────────────────────────────────────────────────────
with open(SECTIONS_FILE, newline='') as f:
    sec_rows = list(csv.reader(f))
with open(INGREDIENTS_FILE, newline='') as f:
    ing_rows = list(csv.reader(f))

sec_header = sec_rows[0]
ing_header = ing_rows[0]
sec_data   = sec_rows[1:]
ing_data   = ing_rows[1:]

# ── HELPERS ───────────────────────────────────────────────────────────────────
def find_sec(data, recipe_id, section_key):
    for i, row in enumerate(data):
        if row[0] == recipe_id and row[1] == section_key:
            return i
    return -1

def make_sec(recipe_id, section_key, section_label,
             prep_method='', cook_method='raw',
             yfw='1.0', yff='1.0', yfp='', yfc='', yfo='1.0',
             yf_fiber='', filling_class='',
             cook_stages='', boil_stages='', source_recipe=''):
    return [recipe_id, section_key, section_label,
            prep_method, cook_method,
            yfw, yff, yfp, yfc, yfo, yf_fiber, filling_class,
            cook_stages, boil_stages, source_recipe]

def replace_section(data, recipe_id, old_key, new_rows):
    idx = find_sec(data, recipe_id, old_key)
    if idx < 0:
        print(f"  WARNING: section not found: {recipe_id}/{old_key}")
        return
    data.pop(idx)
    for i, row in enumerate(new_rows):
        data.insert(idx + i, row)

# ── TYPE 1: Add cook_stages only ──────────────────────────────────────────────
simple_stages = [
    # (recipe_id, section_key, cook_stages)
    ('BKFST_008', 'batter',     '0:3'),
    ('BKFST_009', 'batter',     '0:3'),
    ('BKFST_011', 'eggs',       '0:2'),
    ('BKFST_013', 'hashbrown',  '0:10'),
    ('BKFST_014', 'batter',     '0:4'),
    ('BKFST_023', 'omelette',   '0:4'),
    ('BKFST_024', 'omelette',   '0:4'),
    ('BKFST_025', 'crust',      '375:37'),
    ('BKFST_025', 'filling',    '375:37'),
    ('BKFST_026', 'crust',      '375:37'),
    ('BKFST_026', 'filling',    '375:37'),
    ('BKFST_027', 'crust',      '375:37'),
    ('BKFST_027', 'filling',    '375:37'),
    ('BKFST_028', 'crust',      '375:37'),
    ('BKFST_028', 'filling',    '375:37'),
    ('BKFST_029', 'filling',    '375:37'),
    ('BKFST_030', 'filling',    '375:37'),
    ('BKFST_031', 'filling',    '375:37'),
    ('BKFST_032', 'filling',    '375:37'),
    ('BKFST_036', 'eggs',       '0:2'),
    ('BKFST_037', 'eggs',       '0:3'),
    ('BKFST_038', 'eggs',       '0:2'),
    ('BKFST_042', 'scramble',   '0:7'),
    ('BKFST_043', 'migas',      '0:7'),
    ('BKFST_044', 'migas',      '0:7'),
    ('BKFST_046', 'waffle',     '0:5'),
    ('BKFST_047', 'salsa',      '0:13'),
    ('BKFST_048', 'strata',     '350:50'),
    ('BKFST_049', 'crepes',     '0:2'),
    ('BKFST_050', 'dutch_baby', '425:20'),
    ('BKFST_052', 'granola',    '325:30'),
    ('BKFST_054', 'granola',    '325:30'),
]

for recipe_id, section_key, stages in simple_stages:
    idx = find_sec(sec_data, recipe_id, section_key)
    if idx >= 0:
        sec_data[idx][12] = stages
    else:
        print(f"  WARNING: not found for cook_stages: {recipe_id}/{section_key}")

# ── TYPE 2: cook_method correction + cook_stages ─────────────────────────────
corrections = [
    # (recipe_id, section_key, new_cook_method, cook_stages)
    ('BKFST_033', 'frittata', 'pan seared', '0:6'),
    ('BKFST_037', 'sausage',  'pan seared', '0:3'),
    ('BKFST_038', 'ham',      'pan seared', '0:2'),
    ('BKFST_021', 'beef',     'pan seared', '0:6'),
]

for recipe_id, section_key, new_method, stages in corrections:
    idx = find_sec(sec_data, recipe_id, section_key)
    if idx >= 0:
        sec_data[idx][4]  = new_method
        sec_data[idx][12] = stages
    else:
        print(f"  WARNING: not found for correction: {recipe_id}/{section_key}")

# ── TYPE 3: Section splits ────────────────────────────────────────────────────

# BKFST_017: burrito → tortilla(pan seared 1min) + beans(pan seared 3min)
replace_section(sec_data, 'BKFST_017', 'burrito', [
    make_sec('BKFST_017', 'tortilla', 'Flour tortilla', '', 'pan seared', cook_stages='0:1'),
    make_sec('BKFST_017', 'beans',    'Beans',          '', 'pan seared', cook_stages='0:3'),
])

# BKFST_018: burrito → tortilla + beans + cheese(raw)
replace_section(sec_data, 'BKFST_018', 'burrito', [
    make_sec('BKFST_018', 'tortilla', 'Flour tortilla', '', 'pan seared', cook_stages='0:1'),
    make_sec('BKFST_018', 'beans',    'Beans',          '', 'pan seared', cook_stages='0:3'),
    make_sec('BKFST_018', 'cheese',   'Cheese',         '', 'raw'),
])

# BKFST_019: burrito → tortilla + cheese(raw)
replace_section(sec_data, 'BKFST_019', 'burrito', [
    make_sec('BKFST_019', 'tortilla', 'Flour tortilla', '', 'pan seared', cook_stages='0:1'),
    make_sec('BKFST_019', 'cheese',   'Cheese',         '', 'raw'),
])

# BKFST_020: burrito → tortilla + eggs(pan seared 3min)
replace_section(sec_data, 'BKFST_020', 'burrito', [
    make_sec('BKFST_020', 'tortilla', 'Flour tortilla', '', 'pan seared', cook_stages='0:1'),
    make_sec('BKFST_020', 'eggs',     'Scrambled eggs', '', 'pan seared', cook_stages='0:3'),
])

# BKFST_021: remove assembly, add tortilla + cheese(raw)
# (beef already updated in TYPE 2 above with pan seared + 0:6)
replace_section(sec_data, 'BKFST_021', 'assembly', [
    make_sec('BKFST_021', 'tortilla', 'Flour tortilla', '', 'pan seared', cook_stages='0:1'),
    make_sec('BKFST_021', 'cheese',   'Cheese',         '', 'raw'),
])

# BKFST_022: burrito → tortilla + eggs(fried 2min) + cheese(raw) + potatoes(fried 9min)
replace_section(sec_data, 'BKFST_022', 'burrito', [
    make_sec('BKFST_022', 'tortilla', 'Flour tortilla', '', 'pan seared', cook_stages='0:1'),
    make_sec('BKFST_022', 'eggs',     'Scrambled eggs', '', 'fried',       cook_stages='0:2'),
    make_sec('BKFST_022', 'cheese',   'Cheese',         '', 'raw'),
    make_sec('BKFST_022', 'potatoes', 'Potatoes',       '', 'fried',       cook_stages='0:9'),
])

# BKFST_035: toast → toast(raw) + egg(simmer 4min)
replace_section(sec_data, 'BKFST_035', 'toast', [
    make_sec('BKFST_035', 'toast', 'Avocado toast', 'raw', 'raw'),
    make_sec('BKFST_035', 'egg',   'Poached egg',   '',    'simmer', cook_stages='0:4'),
])

# BKFST_047: remove assembly, add tortillas(fried 2min) + eggs(fried 2min) + assembly(raw)
# (salsa already has 0:13 from TYPE 1 above)
replace_section(sec_data, 'BKFST_047', 'assembly', [
    make_sec('BKFST_047', 'tortillas', 'Corn tortillas', '', 'fried',     cook_stages='0:2'),
    make_sec('BKFST_047', 'eggs',      'Eggs',           '', 'fried',     cook_stages='0:2'),
    make_sec('BKFST_047', 'assembly',  'Assembly',       '', 'raw'),
])

# ── INGREDIENT SECTION KEY UPDATES ────────────────────────────────────────────
# Map: (recipe_id, row_order_str) → new_section_key
ingredient_updates = {
    # BKFST_017: row1=tortilla→tortilla, rows2-4→beans
    ('BKFST_017', '1'): 'tortilla',
    ('BKFST_017', '2'): 'beans',
    ('BKFST_017', '3'): 'beans',
    ('BKFST_017', '4'): 'beans',
    # BKFST_018: row1→tortilla, rows2,3,5→beans, row4→cheese
    ('BKFST_018', '1'): 'tortilla',
    ('BKFST_018', '2'): 'beans',
    ('BKFST_018', '3'): 'beans',
    ('BKFST_018', '4'): 'cheese',
    ('BKFST_018', '5'): 'beans',
    # BKFST_019: row1→tortilla, row2→cheese
    ('BKFST_019', '1'): 'tortilla',
    ('BKFST_019', '2'): 'cheese',
    # BKFST_020: row1→tortilla, rows2-5→eggs
    ('BKFST_020', '1'): 'tortilla',
    ('BKFST_020', '2'): 'eggs',
    ('BKFST_020', '3'): 'eggs',
    ('BKFST_020', '4'): 'eggs',
    ('BKFST_020', '5'): 'eggs',
    # BKFST_021: row2→tortilla, row3(water)→beef, row4→cheese
    ('BKFST_021', '2'): 'tortilla',
    ('BKFST_021', '3'): 'beef',
    ('BKFST_021', '4'): 'cheese',
    # BKFST_022: row1→tortilla, row2→eggs, row3→potatoes,
    #            row4→cheese, row5(oil)→potatoes, row6(salt)→eggs
    ('BKFST_022', '1'): 'tortilla',
    ('BKFST_022', '2'): 'eggs',
    ('BKFST_022', '3'): 'potatoes',
    ('BKFST_022', '4'): 'cheese',
    ('BKFST_022', '5'): 'potatoes',
    ('BKFST_022', '6'): 'eggs',
    # BKFST_035: row6(poached egg)→egg section
    ('BKFST_035', '6'): 'egg',
    # BKFST_047: row8(tortilla)→tortillas, row9(eggs)→eggs,
    #            row10(olive_oil for frying)→tortillas, row11(cilantro)→assembly
    ('BKFST_047', '8'):  'tortillas',
    ('BKFST_047', '9'):  'eggs',
    ('BKFST_047', '10'): 'tortillas',
    # row 11 (cilantro) stays 'assembly' — no entry needed
}

for row in ing_data:
    key = (row[0], row[1])
    if key in ingredient_updates:
        row[7] = ingredient_updates[key]

# ── WRITE ─────────────────────────────────────────────────────────────────────
with open(SECTIONS_FILE, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(sec_header)
    writer.writerows(sec_data)

with open(INGREDIENTS_FILE, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(ing_header)
    writer.writerows(ing_data)

print("Done — both CSVs written.")

# ── VERIFY: show all changed BKFST sections ───────────────────────────────────
skip = {'BKFST_001','BKFST_002','BKFST_003','BKFST_004','BKFST_005',
        'BKFST_006','BKFST_007','BKFST_010','BKFST_012','BKFST_015','BKFST_016'}
print("\n=== Updated BKFST sections (recipes 11-52) ===")
for row in sec_data:
    if row[0].startswith('BKFST_') and row[0] not in skip:
        print(','.join(row))
