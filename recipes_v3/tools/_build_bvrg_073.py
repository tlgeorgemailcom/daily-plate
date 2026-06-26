"""Build script for BVRG_073 — John Collins."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")

RECIPE_ID = "BVRG_073"

# ── recipes.csv ─────────────────────────────────────────────────────────────
recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "JOHNCOLLINS",
    "recipe_name": "John Collins",
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

# ── recipe_sections.csv ──────────────────────────────────────────────────────
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

# ── recipe_ingredients.csv ───────────────────────────────────────────────────
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "bourbon", "qty_display": "2 oz", "grams": "55.6",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "lemon_juice_raw", "qty_display": "1 oz", "grams": "30.0",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "simple_syrup", "qty_display": "\u00be oz", "grams": "26.25",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "club_soda", "qty_display": "2 oz", "grams": "59.25",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

# ── recipe_instructions.csv ──────────────────────────────────────────────────
instructions = [
    (RECIPE_ID, "1", "Combine bourbon, lemon juice, and simple syrup in a cocktail shaker with ice."),
    (RECIPE_ID, "2", "Shake vigorously until well chilled, about 15 seconds."),
    (RECIPE_ID, "3", "Strain into a Collins glass over fresh ice."),
    (RECIPE_ID, "4", "Top with club soda and stir gently."),
    (RECIPE_ID, "5", "Suggestions (not included): Garnish with a lemon slice and a maraschino cherry."),
]


def append_to_csv(path: Path, fieldnames: list, rows: list):
    with open(path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            writer.writerow(row)


def get_fieldnames(path: Path) -> list:
    with open(path, newline="") as f:
        return csv.DictReader(f).fieldnames


def main():
    # recipes.csv
    path = BASE / "recipes.csv"
    append_to_csv(path, get_fieldnames(path), [recipes_row])
    print(f"✓ recipes.csv — {RECIPE_ID}")

    # recipe_sections.csv
    path = BASE / "recipe_sections.csv"
    append_to_csv(path, get_fieldnames(path), [sections_row])
    print(f"✓ recipe_sections.csv — cocktail")

    # recipe_ingredients.csv
    path = BASE / "recipe_ingredients.csv"
    append_to_csv(path, get_fieldnames(path), ingredients_rows)
    print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

    # recipe_instructions.csv
    path = BASE / "recipe_instructions.csv"
    with open(path, "a", newline="") as f:
        writer = csv.writer(f)
        for row in instructions:
            writer.writerow(row)
    print(f"✓ recipe_instructions.csv — {len(instructions)} steps")


if __name__ == "__main__":
    main()
