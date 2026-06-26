"""Build script for BVRG_136 Strawberry Daiquiri."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_136"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "STRAWBERRYDAIQUIRI",
    "recipe_name": "Strawberry Daiquiri",
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
    "sr_notes": "white rum 2oz + lime juice 1oz + simple syrup 0.5oz + strawberries 60g + ice 118.5g; 279.6g; vegan; Rule D",
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
        "ingredient_key": "white_rum", "qty_display": "2 oz",
        "grams": "54.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "lime_juice_raw", "qty_display": "1 oz",
        "grams": "29.6", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "simple_syrup", "qty_display": "1/2 oz",
        "grams": "17.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "strawberries_raw", "qty_display": "4 medium strawberries, hulled",
        "grams": "60.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "5",
        "ingredient_key": "water", "qty_display": "1/2 cup crushed ice",
        "grams": "118.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "ice", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Add the white rum, lime juice, simple syrup, hulled strawberries, and crushed ice to a blender."],
    [RECIPE_ID, "2", "Blend until smooth and slushy."],
    [RECIPE_ID, "3", "Pour into a chilled cocktail glass."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with a fresh strawberry on the rim."],
]

def append_dict(filename, row, fieldnames):
    with open(BASE / filename, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writerow(row)

def get_fieldnames(filename):
    with open(BASE / filename, newline="") as f:
        return csv.reader(f).__next__()

for fname, row in [("recipes.csv", recipes_row), ("recipe_sections.csv", sections_row)]:
    append_dict(fname, row, get_fieldnames(fname))
    print(f"✓ {fname}")

fields_ing = get_fieldnames("recipe_ingredients.csv")
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fields_ing)
    for r in ingredients_rows:
        w.writerow(r)
print("✓ recipe_ingredients.csv")

with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in instructions_rows:
        w.writerow(r)
print("✓ recipe_instructions.csv")

print("Done — BVRG_136 Strawberry Daiquiri appended.")
