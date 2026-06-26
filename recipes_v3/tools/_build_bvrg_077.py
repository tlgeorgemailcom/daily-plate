"""Build script for BVRG_077 — Last Word."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_077"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "LASTWORD",
    "recipe_name": "Last Word",
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

# dry_gin: ¾ oz × 27.0g = 20.25g
# maraschino_liqueur: ¾ oz × 30.8g = 23.1g
# green_chartreuse: ¾ oz × 27.8g = 20.85g
# lime_juice_raw: ¾ oz ≈ 1½ tbsp × 15.0g = 22.5g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "dry_gin", "qty_display": "\u00be oz", "grams": "20.25",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "maraschino_liqueur", "qty_display": "\u00be oz", "grams": "23.1",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "green_chartreuse", "qty_display": "\u00be oz", "grams": "20.85",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "lime_juice_raw", "qty_display": "\u00be oz", "grams": "22.5",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions = [
    (RECIPE_ID, "1", "Combine the gin, maraschino liqueur, green Chartreuse, and lime juice in a cocktail shaker filled with ice."),
    (RECIPE_ID, "2", "Shake hard for 15 seconds until well chilled."),
    (RECIPE_ID, "3", "Double-strain into a chilled coupe glass."),
    (RECIPE_ID, "4", "Suggestions (not included): Garnish with a brandied cherry or a thin lime wheel."),
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
