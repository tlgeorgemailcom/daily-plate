"""Build script for BVRG_150 Whiskey Sour."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_150"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "WHISKEYSOUR",
    "recipe_name": "Whiskey Sour",
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
    "audit_notes": "Rule D — no canonical; 1.5 oz bourbon + 3/4 oz lemon + 3/4 oz simple syrup + 1/2 oz egg white; 105.5g; veggie",
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
    # bourbon 1.5 oz = 41.7g
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "bourbon",
        "qty_display": "1 1/2 oz", "grams": "41.7",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # lemon juice 3/4 oz = 22.5g
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "lemon_juice_raw",
        "qty_display": "3/4 oz", "grams": "22.5",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # simple syrup 3/4 oz = 26.3g
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "simple_syrup",
        "qty_display": "3/4 oz", "grams": "26.3",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # egg white 1/2 oz = 15.0g
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "egg_white_raw",
        "qty_display": "1/2 oz", "grams": "15.0",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Combine bourbon, lemon juice, simple syrup, and egg white in a shaker without ice."],
    [RECIPE_ID, "2", "Dry shake vigorously for 15 seconds to emulsify the egg white."],
    [RECIPE_ID, "3", "Add ice and shake again until well chilled."],
    [RECIPE_ID, "4", "Strain into a rocks glass over a large ice cube."],
    [RECIPE_ID, "5", "Suggestions (not included): Garnish with an Angostura bitters dash and a cherry."],
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

print(f"Done — {RECIPE_ID} Whiskey Sour appended.")
