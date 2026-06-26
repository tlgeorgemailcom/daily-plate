#!/usr/bin/env python3
"""Build script for BVRG_113 Ramos Fizz."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_113"

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
    "recipe_id": ID, "food_word": "RAMOSFIZZ", "recipe_name": "Ramos Fizz",
    "category": "cocktails", "dietary_category": "veggie", "link_type": "",
    "canonical_ndb_no": "", "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
    "sr_rule": "Rule D", "cooking_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
    "sr_notes": "", "disclosure": "", "audit_status": "PASS",
    "audit_notes": (
        "Rule D — no canonical; gin 2oz + lemon \u00bdoz + lime \u00bdoz + "
        "simple syrup 1oz + egg white 1 large + heavy cream 1oz + "
        "orange flower water 3 dashes + club soda 2oz; ~242.9g"
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
# dry_gin          2 oz:        2 × 27.0   = 54.00g
# lemon_juice_raw  ½ oz:        ≈ 1 tbsp   = 15.00g
# lime_juice_raw   ½ oz:        ≈ 1 tbsp   = 15.00g
# simple_syrup     1 oz:        1 × 35.0   = 35.00g
# egg_white_raw    1 large:                = 33.00g
# heavy_cream      1 oz:                   = 29.75g
# orange_flower_water  3 dashes: ≈ 3/8 tsp =  1.90g
# club_soda        2 oz to top: 2 × 29.625 = 59.25g
#                                  TOTAL  = 242.90g
ing_rows = [
    [ID, 1, "dry_gin",             "2 oz",          54.00, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lemon_juice_raw",     "\u00bd oz",      15.00, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "lime_juice_raw",      "\u00bd oz",      15.00, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "simple_syrup",        "1 oz",           35.00, "", "", "cocktail", "", "", "", ""],
    [ID, 5, "egg_white_raw",       "1 large",        33.00, "", "", "cocktail", "", "", "", ""],
    [ID, 6, "heavy_cream",         "1 oz",           29.75, "", "", "cocktail", "", "", "", ""],
    [ID, 7, "orange_flower_water", "3 dashes",        1.90, "", "", "cocktail", "", "", "", ""],
    [ID, 8, "club_soda",           "2 oz (to top)",  59.25, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

# ── recipe_instructions.csv ───────────────────────────────────────────────────
steps = [
    (1, "Combine the gin, lemon juice, lime juice, simple syrup, egg white, heavy cream, and orange flower water in a cocktail shaker without ice."),
    (2, "Dry shake vigorously for 30\u201360 seconds to emulsify the egg white and cream into a thick foam."),
    (3, "Add ice and shake vigorously for another 60 seconds to chill and dilute."),
    (4, "Strain into a chilled highball glass without ice."),
    (5, "Slowly pour the club soda over the back of a bar spoon to top the glass; the foam will rise above the rim."),
    (6, "Suggestions (not included): Garnish with a few drops of orange blossom water on the foam."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
