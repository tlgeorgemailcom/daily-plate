"""Build script for BVRG_146 VE.N.TE."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_146"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "VENTE",
    "recipe_name": "VE.N.TE",
    "category": "cocktails",
    "dietary_category": "veggie",
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
    "sr_notes": "grappa 1.5oz + lemon juice 0.75oz + honey syrup 0.5oz + chamomile cordial 0.5oz + egg white 0.33oz; 108.0g; veggie; Rule D",
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
        "ingredient_key": "grappa", "qty_display": "1 1/2 oz",
        "grams": "40.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "lemon_juice_raw", "qty_display": "3/4 oz",
        "grams": "22.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "honey_syrup", "qty_display": "1/2 oz",
        "grams": "20.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "chamomile_cordial", "qty_display": "1/2 oz",
        "grams": "15.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "5",
        "ingredient_key": "egg_white_raw", "qty_display": "1/3 oz",
        "grams": "10.0", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    [RECIPE_ID, "1", "Add all ingredients to a cocktail shaker without ice."],
    [RECIPE_ID, "2", "Dry shake vigorously for 10-15 seconds to emulsify the egg white."],
    [RECIPE_ID, "3", "Add ice and shake again until well chilled."],
    [RECIPE_ID, "4", "Strain into a shallow tumbler or Old Fashioned glass over ice."],
    [RECIPE_ID, "5", "Suggestions (not included): Garnish with a lemon zest twist and white grapes."],
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
print("Done — BVRG_146 VE.N.TE appended.")
