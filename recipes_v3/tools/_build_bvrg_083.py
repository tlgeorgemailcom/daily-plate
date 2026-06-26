"""Build script for BVRG_083 Martinez."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_083"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "MARTINEZ",
    "recipe_name": "Martinez",
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

# dry_gin 1½ oz: 1.5 × 27.0 = 40.5g
# sweet_vermouth 1½ oz: 1.5 × 29.57 = 44.355g
# maraschino_liqueur ¼ oz: 0.25 × 30.8 = 7.7g
# aromatic_bitters 2 dashes: 2 × 0.9 = 1.8g
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "dry_gin",
        "qty_display": "1\u00bd oz",
        "grams": "40.5",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "sweet_vermouth",
        "qty_display": "1\u00bd oz",
        "grams": "44.4",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "maraschino_liqueur",
        "qty_display": "\u00bc oz",
        "grams": "7.7",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "4",
        "ingredient_key": "aromatic_bitters",
        "qty_display": "2 dashes",
        "grams": "1.8",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
]

instructions_rows = [
    (RECIPE_ID, "1", "Combine gin, sweet vermouth, maraschino liqueur, and bitters in a mixing glass filled with ice."),
    (RECIPE_ID, "2", "Stir for 30\u201340 seconds until well chilled and diluted."),
    (RECIPE_ID, "3", "Strain into a chilled cocktail glass."),
    (RECIPE_ID, "4", "Suggestions (not included): Garnish with a lemon twist or maraschino cherry."),
]

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [recipes_row])
print(f"✓ recipes.csv — {RECIPE_ID}")

p = BASE / "recipe_sections.csv"
append_csv(p, get_fieldnames(p), [sections_row])
print("✓ recipe_sections.csv")

p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    for row in instructions_rows:
        w.writerow(row)
print(f"✓ recipe_instructions.csv — {len(instructions_rows)} steps")
