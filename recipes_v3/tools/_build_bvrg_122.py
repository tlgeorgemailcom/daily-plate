#!/usr/bin/env python3
"""Build script for BVRG_122 Sazerac."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_122"

recipes_fieldnames = [
    "recipe_id","food_word","recipe_name","category","dietary_category",
    "link_type","canonical_ndb_no","prep_time","servings_label","servings_count",
    "sr_rule","cooking_method","yield_factor_water","yield_factor_fat",
    "yield_factor_protein","yield_factor_carbohydrate","yield_factor_other",
    "status","fingerprint","sr_notes","disclosure","audit_status","audit_notes",
    "skip_macros",
]
with open(BASE / "recipes.csv", "a", newline="") as f:
    csv.DictWriter(f, fieldnames=recipes_fieldnames).writerow({
        "recipe_id": ID, "food_word": "SAZERAC", "recipe_name": "Sazerac",
        "category": "cocktails", "dietary_category": "vegan", "link_type": "",
        "canonical_ndb_no": "", "prep_time": "5",
        "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
        "sr_rule": "Rule D", "cooking_method": "raw",
        "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
        "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
        "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
        "sr_notes": "", "disclosure": "", "audit_status": "PASS",
        "audit_notes": (
            "Rule D — no canonical; rye 2oz + simple syrup \u00bcoz + "
            "Peychaud\u2019s 3 dashes + absinthe \u00bcoz rinse; ~74.4g"
        ),
        "skip_macros": "",
    })
print(f"\u2713 recipes.csv \u2014 {ID}")

sections_fieldnames = [
    "recipe_id","section_key","section_label","prep_method","cook_method",
    "yield_factor_water","yield_factor_fat","yield_factor_protein",
    "yield_factor_carbohydrate","yield_factor_other","filling_class",
    "cook_stages","boil_stages","source_recipe",
]
with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    csv.DictWriter(f, fieldnames=sections_fieldnames).writerow({
        "recipe_id": ID, "section_key": "cocktail", "section_label": "Cocktail",
        "prep_method": "", "cook_method": "raw",
        "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
        "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
        "yield_factor_other": "1.0", "filling_class": "", "cook_stages": "",
        "boil_stages": "", "source_recipe": "",
    })
print("\u2713 recipe_sections.csv")

# rye_whiskey       2 oz:   2 × 27.8  = 55.60g
# simple_syrup      ¼ oz:   0.25 × 35.0 = 8.75g
# peychauds_bitters 3 dashes: 3 × 0.9  =  2.70g
# absinthe          ¼ oz rinse: 0.25 × 29.57 = 7.39g
#                                TOTAL = 74.44g
ing_rows = [
    [ID, 1, "rye_whiskey",       "2 oz",          55.60, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "simple_syrup",      "\u00bc oz",       8.75, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "peychauds_bitters", "3 dashes",        2.70, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "absinthe",          "\u00bc oz rinse",  7.39, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

steps = [
    (1, "Rinse a chilled rocks glass with the absinthe: add the absinthe, swirl to coat the inside of the glass, then discard the excess."),
    (2, "Combine the rye whiskey, simple syrup, and Peychaud\u2019s bitters in a mixing glass filled with ice."),
    (3, "Stir for 25\u201330 seconds until well chilled."),
    (4, "Strain into the absinthe-rinsed glass (no ice)."),
    (5, "Suggestions (not included): Garnish with a lemon twist, expressed over the glass and placed on the rim."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
