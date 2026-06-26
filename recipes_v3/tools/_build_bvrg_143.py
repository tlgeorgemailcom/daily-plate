"""Build script for BVRG_143 Three Dots and a Dash."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_143"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "THREEDOTSANDADASH",
    "recipe_name": "Three Dots and a Dash",
    "category": "cocktails",
    "dietary_category": "vegan",
    "link_type": "",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 glass (makes 1)",
    "servings_count": "1",
    "sr_rule": "Rule D",
    "cooking_method": "raw",
    "yield_factor_water": "1.0",
    "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0",
    "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0",
    "status": "approved",
    "fingerprint": "",
    "sr_notes": "dark rum 1.5oz + rhum agricole 0.5oz + lime 0.75oz + lemon 0.25oz + falernum 0.5oz + allspice dram 0.25oz + honey syrup 0.25oz + OJ 0.25oz + bitters 2d; 129.4g; vegan; Rule D",
    "disclosure": "",
    "audit_status": "PASS",
    "audit_notes": "",
    "skip_macros": "",
}

sections_row = {
    "recipe_id": RECIPE_ID,
    "section_key": "cocktail",
    "section_label": "Cocktail",
    "prep_method": "",
    "cook_method": "raw",
    "yield_factor_water": "1.0",
    "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0",
    "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0",
    "filling_class": "",
    "cook_stages": "",
    "boil_stages": "",
    "source_recipe": "",
}

ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "dark_rum", "qty_display": "1 1/2 oz",
        "grams": "41.7", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "rhum_agricole_blanc", "qty_display": "1/2 oz",
        "grams": "13.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "lime_juice_raw", "qty_display": "3/4 oz",
        "grams": "22.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "lemon_juice_raw", "qty_display": "1/4 oz",
        "grams": "7.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "5",
        "ingredient_key": "falernum", "qty_display": "1/2 oz",
        "grams": "16.6", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "6",
        "ingredient_key": "allspice_dram", "qty_display": "1/4 oz",
        "grams": "8.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "7",
        "ingredient_key": "honey_syrup", "qty_display": "1/4 oz",
        "grams": "10.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "8",
        "ingredient_key": "orange_juice_raw", "qty_display": "1/4 oz",
        "grams": "7.8", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "9",
        "ingredient_key": "angostura_bitters", "qty_display": "2 dashes",
        "grams": "1.8", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Combine all ingredients in a cocktail shaker with crushed ice."],
    [RECIPE_ID, "2", "Shake vigorously until well chilled."],
    [RECIPE_ID, "3", "Pour unstrained (with ice) into a tiki mug or highball glass."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with three cherries skewered on a cocktail pick (the dots) and a pineapple frond (the dash) — Morse code for \"V,\" a WWII victory symbol."],
]

def get_fieldnames(filename):
    with open(BASE / filename, newline="") as f:
        return csv.reader(f).__next__()

def append_dict(filename, row):
    with open(BASE / filename, "a", newline="") as f:
        csv.DictWriter(f, fieldnames=get_fieldnames(filename)).writerow(row)

for fname, row in [("recipes.csv", recipes_row), ("recipe_sections.csv", sections_row)]:
    append_dict(fname, row)
    print(f"✓ {fname}")

with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.DictWriter(f, fieldnames=get_fieldnames("recipe_ingredients.csv"))
    for r in ingredients_rows:
        w.writerow(r)
print("✓ recipe_ingredients.csv")

with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in instructions_rows:
        w.writerow(r)
print("✓ recipe_instructions.csv")
print("Done — BVRG_143 Three Dots and a Dash appended.")
