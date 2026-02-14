#!/usr/bin/env python3
"""Update extract_portion_data.py to include USDA_Desc"""

content = open('extract_portion_data.py', 'r').read()

# Fix 1: Update comment and add USDA_Desc to result
old1 = """            # Build clean result row (exclude Match_Type, Alt_Matches, USDA_Desc)
            result = {
                'word': word,
                'display': format_display_name(word),
                'group1': row.get('group1', ''),
                'group2': row.get('group2', ''),
                'group3': row.get('group3', ''),
                'group4': row.get('group4', ''),
                'NDB_NO': ndb_no,
            }"""

new1 = """            # Build clean result row (exclude Match_Type, Alt_Matches)
            result = {
                'word': word,
                'display': format_display_name(word),
                'group1': row.get('group1', ''),
                'group2': row.get('group2', ''),
                'group3': row.get('group3', ''),
                'group4': row.get('group4', ''),
                'NDB_NO': ndb_no,
                'USDA_Desc': row.get('USDA_Desc', ''),
            }"""

if old1 in content:
    content = content.replace(old1, new1)
    print('Fix 1: Added USDA_Desc to result')
else:
    print('Fix 1: Pattern not found')

# Fix 2: Update output_fieldnames
old2 = "output_fieldnames = ['word', 'display', 'group1', 'group2', 'group3', 'group4', 'NDB_NO'] + get_portion_columns()"
new2 = "output_fieldnames = ['word', 'display', 'group1', 'group2', 'group3', 'group4', 'NDB_NO', 'USDA_Desc'] + get_portion_columns()"

if old2 in content:
    content = content.replace(old2, new2)
    print('Fix 2: Added USDA_Desc to output_fieldnames')
else:
    print('Fix 2: Pattern not found')

open('extract_portion_data.py', 'w').write(content)
print('Done!')
