"""Build script for BVRG_151 White Russian."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_151"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "WHITERUSSIAN",
    "recipe_name": "White Russian",
    "category": "cocktails",
    "dietary_category": "veggie",
    "link_type": "",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 cocktail",
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
    "sr_notes": "",
    "disclosure": "",
    "audit_status": "PASS",
    "audit_notes": "Rule D — no canonical; 2 oz vodka + 1 oz coffee liqueur + 1 oz heavy cream; 117.6g; veggie",
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
    # vodka 2 oz = 55.6g
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "vodka_80proof",
        "qty_display": "2 oz", "grams": "55.6",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # coffee liqueur 1 oz = 32.24g
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "coffee_liqueur",
        "qty_display": "1 oz", "grams": "32.24",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # heavy cream 1 oz = 29.75g (238g/cup ÷ 8)
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "heavy_cream",
        "qty_display": "1 oz", "grams": "29.75",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Fill a rocks glass with ice."],
    [RECIPE_ID, "2", "Pour in the vodka and coffee liqueur and stir briefly."],
    [RECIPE_ID, "3", "Float the heavy cream over the back of a spoon on top."],
    [RECIPE_ID, "4", "Suggestions (not included): Stir gently before drinking, or leave layered for presentation."],
]

def append_dict(path, row, fieldnames):
    with open(path, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writerow(row)

def get_fieldnames(path):
    with open(path, newline="") as f:
        return csv.DictReader(f).fieldnames

for path, row in [
    (BASE / "recipes.csv", recipes_row),
    (BASE / "recipe_sections.csv", sections_row),
]:
    append_dict(path, row, get_fieldnames(path))

with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    fn = get_fieldnames(BASE / "recipe_ingredients.csv")
    w = csv.DictWriter(f, fieldnames=fn)
    for r in ingredients_rows:
        w.writerow(r)

with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in instructions_rows:
        w.writerow(r)

print(f"Done — {RECIPE_ID} White Russian appended.")
