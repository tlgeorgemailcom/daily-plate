"""Build script for BVRG_075 — Kir."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_075"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "KIR",
    "recipe_name": "Kir",
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

# sparkling_wine: 4 oz × 29.4g = 117.6g
# creme_de_cassis (NDB 14709): ½ oz × 34.0g/fl oz = 17.0g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "sparkling_wine", "qty_display": "4 oz", "grams": "117.6",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "creme_de_cassis", "qty_display": "\u00bd oz", "grams": "17.0",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions = [
    (RECIPE_ID, "1", "Pour the crème de cassis into a chilled wine glass."),
    (RECIPE_ID, "2", "Slowly top with cold white wine, pouring gently down the side of the glass to preserve the bubbles."),
    (RECIPE_ID, "3", "Stir lightly and serve immediately."),
    (RECIPE_ID, "4", "Suggestions (not included): Use a dry Aligoté or Chablis; serve well chilled."),
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
