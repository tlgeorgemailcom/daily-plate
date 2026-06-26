#!/usr/bin/env python3
"""Build script for BVRG_121 Sangria, White."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_121"

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
        "recipe_id": ID, "food_word": "SANGRIAWHITE", "recipe_name": "Sangria, White",
        "category": "cocktails", "dietary_category": "vegan", "link_type": "",
        "canonical_ndb_no": "", "prep_time": "5",
        "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
        "sr_rule": "Rule D", "cooking_method": "raw",
        "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
        "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
        "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
        "sr_notes": "", "disclosure": "", "audit_status": "PASS",
        "audit_notes": (
            "Rule D — no canonical; white wine 4oz + brandy 1oz + peach liqueur "
            "\u00bdoz + lemon \u00bdoz + simple syrup \u00bdoz; ~192.7g"
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

# white_wine_dry  4 oz:   4 × 29.4  = 117.60g
# brandy          1 oz:   1 × 27.8  =  27.80g
# peach_liqueur  ½ oz: 0.5 × 29.57 =  14.79g
# lemon_juice_raw ½oz: 0.5 × 30.0  =  15.00g
# simple_syrup   ½ oz: 0.5 × 35.0  =  17.50g
#                              TOTAL = 192.69g
ing_rows = [
    [ID, 1, "white_wine_dry",   "4 oz",        117.60, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "brandy",           "1 oz",          27.80, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "peach_liqueur",    "\u00bd oz",     14.79, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "lemon_juice_raw",  "\u00bd oz",     15.00, "", "", "cocktail", "", "", "", ""],
    [ID, 5, "simple_syrup",     "\u00bd oz",     17.50, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

steps = [
    (1, "Combine the white wine, brandy, peach liqueur, lemon juice, and simple syrup in a large pitcher."),
    (2, "Stir well to combine."),
    (3, "Refrigerate for at least 1 hour (or overnight) to allow the flavors to meld."),
    (4, "Serve over ice in a wine glass."),
    (5, "Suggestions (not included): Add sliced peaches, lemons, and white grapes to the pitcher. A splash of sparkling water or ginger ale per glass adds effervescence."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
