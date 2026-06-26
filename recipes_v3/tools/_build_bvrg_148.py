"""Build script for BVRG_148 Vieux Carré."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_148"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "VIEUXCARRE",
    "recipe_name": "Vieux Carré",
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
    "sr_notes": "rye 1oz + cognac 1oz + sweet vermouth 1oz + benedictine 1 tsp + angostura 1d + peychauds 1d; 93.5g; vegan; Rule D",
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
        "ingredient_key": "rye_whiskey", "qty_display": "1 oz",
        "grams": "27.8", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "cognac", "qty_display": "1 oz",
        "grams": "27.8", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "sweet_vermouth", "qty_display": "1 oz",
        "grams": "31.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "benedictine", "qty_display": "1 tsp",
        "grams": "5.1", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "5",
        "ingredient_key": "angostura_bitters", "qty_display": "1 dash",
        "grams": "0.9", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "6",
        "ingredient_key": "peychauds_bitters", "qty_display": "1 dash",
        "grams": "0.9", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Combine all ingredients in a mixing glass with ice."],
    [RECIPE_ID, "2", "Stir until well chilled and diluted, about 30 seconds."],
    [RECIPE_ID, "3", "Strain into a rocks glass over a large ice cube."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with a lemon twist or cherry."],
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
print("Done — BVRG_148 Vieux Carré appended.")
