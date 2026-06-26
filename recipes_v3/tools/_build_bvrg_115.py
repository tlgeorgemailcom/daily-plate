#!/usr/bin/env python3
"""Build script for BVRG_115 Rum Punch."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_115"

# ── recipes.csv ───────────────────────────────────────────────────────────────
recipes_fieldnames = [
    "recipe_id","food_word","recipe_name","category","dietary_category",
    "link_type","canonical_ndb_no","prep_time","servings_label","servings_count",
    "sr_rule","cooking_method","yield_factor_water","yield_factor_fat",
    "yield_factor_protein","yield_factor_carbohydrate","yield_factor_other",
    "status","fingerprint","sr_notes","disclosure","audit_status","audit_notes",
    "skip_macros",
]
recipes_row = {
    "recipe_id": ID, "food_word": "RUMPUNCH", "recipe_name": "Rum Punch",
    "category": "cocktails", "dietary_category": "vegan", "link_type": "",
    "canonical_ndb_no": "", "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
    "sr_rule": "Rule D", "cooking_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
    "sr_notes": "", "disclosure": "", "audit_status": "PASS",
    "audit_notes": (
        "Rule D — no canonical; dark rum 2oz + lime \u00beoz + OJ 2oz + "
        "pineapple juice 2oz + grenadine \u00bdoz; ~218.2g"
    ),
    "skip_macros": "",
}
with open(BASE / "recipes.csv", "a", newline="") as f:
    csv.DictWriter(f, fieldnames=recipes_fieldnames).writerow(recipes_row)
print(f"\u2713 recipes.csv \u2014 {ID}")

# ── recipe_sections.csv ───────────────────────────────────────────────────────
sections_fieldnames = [
    "recipe_id","section_key","section_label","prep_method","cook_method",
    "yield_factor_water","yield_factor_fat","yield_factor_protein",
    "yield_factor_carbohydrate","yield_factor_other","filling_class",
    "cook_stages","boil_stages","source_recipe",
]
section_row = {
    "recipe_id": ID, "section_key": "cocktail", "section_label": "Cocktail",
    "prep_method": "", "cook_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0", "filling_class": "", "cook_stages": "",
    "boil_stages": "", "source_recipe": "",
}
with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    csv.DictWriter(f, fieldnames=sections_fieldnames).writerow(section_row)
print("\u2713 recipe_sections.csv")

# ── recipe_ingredients.csv ────────────────────────────────────────────────────
# dark_rum              2 oz:   2 × 27.0    = 54.00g
# lime_juice_raw        ¾ oz:   ¾ × 29.57ml ≈ 22.18ml ≈ 22.2g (≈1½ tbsp)
# orange_juice_raw      2 oz:   2 × 31.0    = 62.00g
# pineapple_juice_canned 2 oz:  4 tbsp × 15 = 60.00g
# grenadine             ½ oz:   1 tbsp × 20 = 20.00g
#                                    TOTAL  = 218.20g
ing_rows = [
    [ID, 1, "dark_rum",                "2 oz",      54.00, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lime_juice_raw",          "\u00be oz",  22.20, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "orange_juice_raw",        "2 oz",      62.00, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "pineapple_juice_canned",  "2 oz",      60.00, "", "", "cocktail", "", "", "", ""],
    [ID, 5, "grenadine",               "\u00bd oz",  20.00, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

# ── recipe_instructions.csv ───────────────────────────────────────────────────
steps = [
    (1, "Add the dark rum, lime juice, orange juice, pineapple juice, and grenadine to a shaker filled with ice."),
    (2, "Shake well until chilled, about 15 seconds."),
    (3, "Strain into a tall glass over fresh ice."),
    (4, "Suggestions (not included): Garnish with an orange slice, maraschino cherry, and a mint sprig."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
