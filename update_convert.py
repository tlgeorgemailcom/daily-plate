#!/usr/bin/env python3
"""Update convert_to_ts.py to include usda_desc field"""

content = open('convert_to_ts.py', 'r').read()

# Fix 1: Add usda_desc to the food dictionary
old1 = """            food = {
                'word': row['word'],
                'display': row.get('display', row['word'].capitalize()),
                'groups': groups,
                'ndb': row.get('NDB_NO', ''),
                'portions': portions
            }"""

new1 = """            food = {
                'word': row['word'],
                'display': row.get('display', row['word'].capitalize()),
                'groups': groups,
                'ndb': row.get('NDB_NO', ''),
                'usda_desc': row.get('USDA_Desc', ''),
                'portions': portions
            }"""

if old1 in content:
    content = content.replace(old1, new1)
    print('Fix 1: Added usda_desc to food dictionary')
else:
    print('Fix 1: Pattern not found')

# Fix 2: Add usda_desc to Food interface
old2 = """export interface Food {
  word: string;
  display: string;  // Readable name (e.g., "Chicken Wing")
  groups: FoodGroup[];
  ndb: string;
  portions: Portion[];  // [0] is always custom (100g base)
}"""

new2 = """export interface Food {
  word: string;
  display: string;  // Readable name (e.g., "Chicken Wing")
  groups: FoodGroup[];
  ndb: string;
  usda_desc: string;  // Full USDA description (shown on long-press)
  portions: Portion[];  // [0] is always custom (100g base)
}"""

if old2 in content:
    content = content.replace(old2, new2)
    print('Fix 2: Added usda_desc to Food interface')
else:
    print('Fix 2: Pattern not found')

open('convert_to_ts.py', 'w').write(content)
print('Done!')
