"""Build script for BVRG_152 Sloe Gin Fizz."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_152"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "SLOEGINFIZZ",
    "recipe_name": "Sloe Gin Fizz",
    "category": "cocktails",
    "dietary_category": "vegan",
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
    "audit_notes": "Rule D — no canonical; 1.5 oz sloe gin + 1 oz lemon + 0.5 oz simple syrup + 3 oz club soda; 181.7g; vegan",
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
    # sloe gin 1.5 oz = 45.3g
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "sloe_gin",
        "qty_display": "1 1/2 oz", "grams": "45.3",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # lemon juice 1 oz = 30.0g
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "lemon_juice_raw",
        "qty_display": "1 oz", "grams": "30.0",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # simple syrup 1/2 oz = 17.5g
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "simple_syrup",
        "qty_display": "1/2 oz", "grams": "17.5",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # club soda 3 oz = 88.9g (237g/cup ÷ 8 × 3)
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "club_soda",
        "qty_display": "3 oz", "grams": "88.9",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Combine sloe gin, lemon juice, and simple syrup in a shaker with ice."],
    [RECIPE_ID, "2", "Shake until well chilled, then strain into a highball glass over fresh ice."],
    [RECIPE_ID, "3", "Top with club soda and stir gently."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with a lemon wheel or cherry."],
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

print(f"Done — {RECIPE_ID} Sloe Gin Fizz appended.")
