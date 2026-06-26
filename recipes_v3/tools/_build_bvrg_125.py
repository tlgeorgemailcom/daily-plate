#!/usr/bin/env python3
"""Build script for BVRG_125 Sex on the Beach."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_125"

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
        "recipe_id": ID, "food_word": "SEXONTHEBEACH", "recipe_name": "Sex on the Beach",
        "category": "cocktails", "dietary_category": "vegan", "link_type": "",
        "canonical_ndb_no": "", "prep_time": "5",
        "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
        "sr_rule": "Rule D", "cooking_method": "raw",
        "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
        "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
        "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
        "sr_notes": "", "disclosure": "", "audit_status": "PASS",
        "audit_notes": (
            "Rule D — no canonical; vodka 1\u00bdoz + peach liqueur 1\u00bdoz + "
            "OJ 2oz + cranberry 1\u00bdoz; ~195.5g"
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

# vodka                    1½ oz: 1.5 × 27.8  =  41.70g
# peach_liqueur            1½ oz: 1.5 × 29.57 =  44.36g
# orange_juice_raw         2 oz:  2 × 31.0    =  62.00g
# cranberry_juice_cocktail 1½ oz: 1.5 × 31.6  =  47.40g
#                                    TOTAL     = 195.46g
ing_rows = [
    [ID, 1, "vodka",                    "1\u00bd oz", 41.70, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "peach_liqueur",            "1\u00bd oz", 44.36, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "orange_juice_raw",         "2 oz",       62.00, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "cranberry_juice_cocktail", "1\u00bd oz", 47.40, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

steps = [
    (1, "Fill a highball glass with ice."),
    (2, "Add the vodka, peach liqueur, and orange juice."),
    (3, "Pour the cranberry juice on top and stir lightly."),
    (4, "Suggestions (not included): Garnish with an orange slice and a maraschino cherry."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
