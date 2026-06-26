"""Build script for BVRG_139 Tequila Sunrise."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_139"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "TEQUILASUNRISE",
    "recipe_name": "Tequila Sunrise",
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
    "sr_notes": "tequila 2oz + OJ 4oz + grenadine 0.5oz; 189.6g; vegan; Rule D",
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
        "ingredient_key": "tequila", "qty_display": "2 oz",
        "grams": "55.6", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "orange_juice_raw", "qty_display": "4 oz",
        "grams": "124.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "grenadine", "qty_display": "1/2 oz",
        "grams": "10.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Fill a highball glass with ice."],
    [RECIPE_ID, "2", "Pour the tequila and orange juice over the ice and stir to combine."],
    [RECIPE_ID, "3", "Slowly pour the grenadine down the inside of the glass — it will sink to the bottom, creating the sunrise effect. Do not stir."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with an orange slice and a maraschino cherry."],
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
print("Done — BVRG_139 Tequila Sunrise appended.")
