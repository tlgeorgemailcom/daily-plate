"""Build script for BVRG_074 — Jungle Bird."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_074"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "JUNGLEBIRD",
    "recipe_name": "Jungle Bird",
    "category": "cocktails",
    "dietary_category": "vegan",
    "link_type": "cocktail",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)",
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

# dark_rum: 1.5 × 27.8 = 41.7g
# campari: 0.75 × 30.5 = 22.875g
# pineapple_juice_canned: 1.5 oz × 30g/oz = 45.0g (M1=tbsp/15, 2 tbsp/oz)
# lime_juice_raw: 0.75 oz × 30g/oz = 22.5g (M1=tbsp/15, 2 tbsp/oz)
# simple_syrup: 0.5 × 35.0 = 17.5g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "dark_rum", "qty_display": "1\u00bd oz", "grams": "41.7",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "campari", "qty_display": "\u00be oz", "grams": "22.875",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "pineapple_juice_canned", "qty_display": "1\u00bd oz", "grams": "45.0",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "lime_juice_raw", "qty_display": "\u00be oz", "grams": "22.5",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "5",
        "ingredient_key": "simple_syrup", "qty_display": "\u00bd oz", "grams": "17.5",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions = [
    (RECIPE_ID, "1", "Combine dark rum, Campari, pineapple juice, lime juice, and simple syrup in a cocktail shaker with ice."),
    (RECIPE_ID, "2", "Shake vigorously until well chilled, about 15 seconds."),
    (RECIPE_ID, "3", "Strain into a rocks glass over a large ice cube."),
    (RECIPE_ID, "4", "Suggestions (not included): Garnish with a pineapple wedge or pineapple leaf."),
]


def get_fieldnames(path):
    with open(path, newline="") as f:
        return csv.DictReader(f).fieldnames


def main():
    path = BASE / "recipes.csv"
    with open(path, "a", newline="") as f:
        csv.DictWriter(f, fieldnames=get_fieldnames(path)).writerow(recipes_row)
    print(f"✓ recipes.csv — {RECIPE_ID}")

    path = BASE / "recipe_sections.csv"
    with open(path, "a", newline="") as f:
        csv.DictWriter(f, fieldnames=get_fieldnames(path)).writerow(sections_row)
    print(f"✓ recipe_sections.csv")

    path = BASE / "recipe_ingredients.csv"
    with open(path, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=get_fieldnames(path))
        for row in ingredients_rows:
            w.writerow(row)
    print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

    path = BASE / "recipe_instructions.csv"
    with open(path, "a", newline="") as f:
        w = csv.writer(f)
        for row in instructions:
            w.writerow(row)
    print(f"✓ recipe_instructions.csv — {len(instructions)} steps")


if __name__ == "__main__":
    main()
