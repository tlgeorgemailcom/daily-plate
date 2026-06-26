"""Build script for BVRG_082 Margarita."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_082"

# ── recipes.csv ──────────────────────────────────────────────────────────────
recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "MARGARITA",
    "recipe_name": "Margarita",
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

# ── recipe_sections.csv ───────────────────────────────────────────────────────
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

# ── recipe_ingredients.csv ────────────────────────────────────────────────────
# tequila 2 oz: 2 × 27.0g = 54.0g
# triple_sec ½ oz: 0.5 × 29.57g = 14.785g
# lime_juice_raw 1 oz: 1/8 cup × 242.0g = 30.25g
# agave_syrup ½ oz: 3 tsp × 6.9g = 20.7g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "tequila",
        "qty_display": "2 oz",
        "grams": "54.0",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "triple_sec",
        "qty_display": "\u00bd oz",
        "grams": "14.8",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "lime_juice_raw",
        "qty_display": "1 oz",
        "grams": "30.25",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "agave_syrup",
        "qty_display": "\u00bd oz",
        "grams": "20.7",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
]

# ── recipe_instructions.csv ───────────────────────────────────────────────────
instructions_rows = [
    (RECIPE_ID, "1", "Combine tequila, triple sec, lime juice, and agave syrup in a cocktail shaker filled with ice."),
    (RECIPE_ID, "2", "Shake vigorously for 15\u201320 seconds until well chilled."),
    (RECIPE_ID, "3", "Strain into a chilled cocktail glass with a salt-rimmed edge, if desired."),
    (RECIPE_ID, "4", "Suggestions (not included): Garnish with a lime wheel or wedge."),
]

# ── write ─────────────────────────────────────────────────────────────────────
def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

# recipes.csv
p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [recipes_row])
print(f"✓ recipes.csv — {RECIPE_ID}")

# recipe_sections.csv
p = BASE / "recipe_sections.csv"
append_csv(p, get_fieldnames(p), [sections_row])
print("✓ recipe_sections.csv")

# recipe_ingredients.csv
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

# recipe_instructions.csv
p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    for row in instructions_rows:
        w.writerow(row)
print(f"✓ recipe_instructions.csv — {len(instructions_rows)} steps")
