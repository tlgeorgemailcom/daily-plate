#!/usr/bin/env python3
"""Build script for BVRG_123 Screwdriver."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_123"

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
        "recipe_id": ID, "food_word": "SCREWDRIVER", "recipe_name": "Screwdriver",
        "category": "cocktails", "dietary_category": "vegan", "link_type": "",
        "canonical_ndb_no": "", "prep_time": "5",
        "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
        "sr_rule": "Rule D", "cooking_method": "raw",
        "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
        "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
        "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
        "sr_notes": "", "disclosure": "", "audit_status": "PASS",
        "audit_notes": "Rule D — no canonical; vodka 2oz + OJ 4oz; ~179.6g",
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

# vodka            2 oz: 2 × 27.8  = 55.60g
# orange_juice_raw 4 oz: 4 × 31.0  = 124.00g
#                          TOTAL   = 179.60g
ing_rows = [
    [ID, 1, "vodka",            "2 oz", 55.60, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "orange_juice_raw", "4 oz", 124.00, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

steps = [
    (1, "Fill a highball glass with ice."),
    (2, "Pour the vodka over the ice, then add the orange juice."),
    (3, "Stir gently to combine."),
    (4, "Suggestions (not included): Garnish with an orange slice or wedge."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
