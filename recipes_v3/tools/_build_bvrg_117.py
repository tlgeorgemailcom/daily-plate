#!/usr/bin/env python3
"""Build script for BVRG_117 Russian Spring Punch."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_117"

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
    "recipe_id": ID, "food_word": "RUSSIANSPRINGPUNCH",
    "recipe_name": "Russian Spring Punch",
    "category": "cocktails", "dietary_category": "vegan", "link_type": "",
    "canonical_ndb_no": "", "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
    "sr_rule": "Rule D", "cooking_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
    "sr_notes": "", "disclosure": "", "audit_status": "PASS",
    "audit_notes": (
        "Rule D — no canonical; vodka 1\u00bdoz + lemon \u00beoz + "
        "simple syrup \u00bdoz + creme de cassis \u00bdoz + "
        "sparkling wine 2oz; ~155.0g"
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
# vodka             1½ oz:  1.5 × 27.8   = 41.70g
# lemon_juice_raw   ¾ oz:   ≈1½ tbsp     = 22.20g
# simple_syrup      ½ oz:   0.5 × 35.0   = 17.50g
# creme_de_cassis   ½ oz:   0.5 × 29.57  = 14.79g
# sparkling_wine    2 oz:   2 × 29.4     = 58.80g
#                                 TOTAL  = 154.99g
ing_rows = [
    [ID, 1, "vodka",            "1\u00bd oz",       41.70, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lemon_juice_raw",  "\u00be oz",         22.20, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "simple_syrup",     "\u00bd oz",         17.50, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "creme_de_cassis",  "\u00bd oz",         14.79, "", "", "cocktail", "", "", "", ""],
    [ID, 5, "sparkling_wine",   "2 oz (to top)",     58.80, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

# ── recipe_instructions.csv ───────────────────────────────────────────────────
steps = [
    (1, "Add the vodka, lemon juice, simple syrup, and cr\u00e8me de cassis to a shaker filled with ice."),
    (2, "Shake well until chilled, about 15 seconds."),
    (3, "Strain into a highball glass over fresh ice."),
    (4, "Top with sparkling wine and gently stir to combine."),
    (5, "Suggestions (not included): Garnish with a lemon slice and fresh raspberries."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
