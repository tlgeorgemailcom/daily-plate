#!/usr/bin/env python3
"""Build script for BVRG_114 Rosita."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID = "BVRG_114"

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
    "recipe_id": ID, "food_word": "ROSITA", "recipe_name": "Rosita",
    "category": "cocktails", "dietary_category": "vegan", "link_type": "",
    "canonical_ndb_no": "", "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
    "sr_rule": "Rule D", "cooking_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0", "status": "approved", "fingerprint": "",
    "sr_notes": "", "disclosure": "", "audit_status": "PASS",
    "audit_notes": (
        "Rule D — no canonical; tequila 1\u00bdoz + campari \u00bdoz + "
        "sweet vermouth \u00bdoz + dry vermouth \u00bdoz + bitters 1 dash; ~87.9g"
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
# tequila          1½ oz:  1.5 × 27.8  = 41.70g
# campari          ½ oz:   0.5 × 30.5  = 15.25g
# sweet_vermouth   ½ oz:   0.5 × 31.0  = 15.50g
# dry_vermouth     ½ oz:   0.5 × 29.0  = 14.50g
# aromatic_bitters 1 dash:              =  0.90g
#                                TOTAL  = 87.85g
ing_rows = [
    [ID, 1, "tequila",          "1\u00bd oz",  41.70, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "campari",          "\u00bd oz",   15.25, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "sweet_vermouth",   "\u00bd oz",   15.50, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "dry_vermouth",     "\u00bd oz",   14.50, "", "", "cocktail", "", "", "", ""],
    [ID, 5, "aromatic_bitters", "1 dash",       0.90, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    csv.writer(f).writerows(ing_rows)
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ing_rows)} rows")

# ── recipe_instructions.csv ───────────────────────────────────────────────────
steps = [
    (1, "Add the tequila, Campari, sweet vermouth, dry vermouth, and bitters to a mixing glass filled with ice."),
    (2, "Stir for 25\u201330 seconds until well chilled and diluted."),
    (3, "Strain into a rocks glass over a large ice cube."),
    (4, "Suggestions (not included): Garnish with a lemon or orange twist."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, step_text in steps:
        w.writerow([ID, str(step_num), step_text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
