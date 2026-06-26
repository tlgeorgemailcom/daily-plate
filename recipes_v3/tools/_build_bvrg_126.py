#!/usr/bin/env python3
"""Build script for BVRG_126 Shandy."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_126"

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
        "recipe_id": ID, "food_word": "SHANDY", "recipe_name": "Shandy",
        "category": "cocktails", "dietary_category": "vegan", "link_type": "",
        "canonical_ndb_no": "", "prep_time": "5",
        "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
        "sr_rule": "Rule D", "cooking_method": "raw",
        "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
        "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
        "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
        "sr_notes": "", "disclosure": "", "audit_status": "PASS",
        "audit_notes": (
            "Rule D — no canonical; beer 6oz + lemon \u00beoz + simple syrup "
            "\u00beoz + club soda 4\u00bdoz; ~360.9g"
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

# beer_regular     6 oz:   6 × 29.7   = 178.20g
# lemon_juice_raw  ¾ oz:   1.5 × 15.0 =  22.50g  (1.5 tbsp)
# simple_syrup     ¾ oz:   0.75 × 35.0 = 26.25g
# club_soda        4½ oz:  4.5 × 29.75 = 133.88g
#                               TOTAL  = 360.83g
ing_rows = [
    [ID, 1, "beer_regular",    "6 oz",          178.20, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lemon_juice_raw", "\u00be oz",       22.50, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "simple_syrup",    "\u00be oz",       26.25, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "club_soda",       "4\u00bd oz",     133.88, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

steps = [
    (1, "In a pint glass, stir together the lemon juice and simple syrup to make a quick lemonade."),
    (2, "Add the club soda and stir gently."),
    (3, "Pour in the beer, tilting the glass to preserve carbonation."),
    (4, "Stir once lightly and serve immediately."),
    (5, "Suggestions (not included): Garnish with a lemon wheel."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
