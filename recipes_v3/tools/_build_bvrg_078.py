"""Build script for BVRG_078 — Lemon Drop Martini."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_078"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "LEMONDROPMARTINI",
    "recipe_name": "Lemon Drop Martini",
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

# vodka: 1½ oz × 27.8g = 41.7g
# triple_sec: ½ oz × 30.2g = 15.1g
# lemon_juice_raw: ¾ oz = 1½ tbsp × 15.0g = 22.5g
# simple_syrup: ½ oz × 35.0g = 17.5g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "vodka", "qty_display": "1\u00bd oz", "grams": "41.7",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "triple_sec", "qty_display": "\u00bd oz", "grams": "15.1",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "lemon_juice_raw", "qty_display": "\u00be oz", "grams": "22.5",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "simple_syrup", "qty_display": "\u00bd oz", "grams": "17.5",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions = [
    (RECIPE_ID, "1", "Optional: Rim a chilled martini glass with sugar by running a lemon wedge around the edge and dipping in fine sugar."),
    (RECIPE_ID, "2", "Combine the vodka, triple sec, lemon juice, and simple syrup in a cocktail shaker filled with ice."),
    (RECIPE_ID, "3", "Shake vigorously for 15 seconds until well chilled."),
    (RECIPE_ID, "4", "Double-strain into the chilled martini glass."),
    (RECIPE_ID, "5", "Suggestions (not included): Garnish with a thin lemon wheel or a twist of lemon peel."),
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
