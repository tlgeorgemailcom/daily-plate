"""Build script for BVRG_080 — Mai Tai."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_080"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "MAITAI",
    "recipe_name": "Mai Tai",
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

# gold_jamaican_rum: 1 oz × 27.0g = 27.0g
# dark_rum:         1 oz × 27.0g = 27.0g
# orange_curacao:   ½ oz × 29.57g = 14.8g
# lime_juice_raw:   ¾ oz = 1½ tbsp × 15.0g = 22.5g
# orgeat:           ¼ oz × 29.57g = 7.4g
# simple_syrup:     ¼ oz × 35.0g = 8.75g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "gold_jamaican_rum", "qty_display": "1 oz", "grams": "27.0",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "dark_rum", "qty_display": "1 oz", "grams": "27.0",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "orange_curacao", "qty_display": "\u00bd oz", "grams": "14.8",
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
        "ingredient_key": "orgeat", "qty_display": "\u00bc oz", "grams": "7.4",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "6",
        "ingredient_key": "simple_syrup", "qty_display": "\u00bc oz", "grams": "8.75",
        "grams_min": "", "grams_max": "", "section": "cocktail",
        "ingredient_group": "", "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

instructions = [
    (RECIPE_ID, "1", "Combine the gold Jamaican rum, dark rum, orange curaçao, lime juice, orgeat, and simple syrup in a cocktail shaker filled with crushed ice."),
    (RECIPE_ID, "2", "Shake briefly — about 5 seconds — just to combine and chill without over-diluting."),
    (RECIPE_ID, "3", "Pour unstrained (ice and all) into a double rocks glass or tiki mug."),
    (RECIPE_ID, "4", "Suggestions (not included): Garnish with a spent lime shell, fresh mint sprig, and a cocktail cherry. For a dramatic presentation, float a small amount of overproof dark rum on top."),
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
