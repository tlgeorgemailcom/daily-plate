"""Build script for BVRG_087 Mimosa."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_087"

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

# sparkling_wine 4 oz: 4 × 29.4g = 117.6g
# orange_juice_raw 2 oz: 2 × 31.0g = 62.0g

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "food_word": "MIMOSA",
    "recipe_name": "Mimosa", "category": "cocktails",
    "dietary_category": "vegan", "link_type": "cocktail",
    "canonical_ndb_no": "", "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
    "sr_rule": "Rule D", "cooking_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0", "status": "approved",
    "fingerprint": "", "sr_notes": "", "disclosure": "",
    "audit_status": "PASS", "audit_notes": "", "skip_macros": "",
}])
print(f"✓ recipes.csv — {RECIPE_ID}")

p = BASE / "recipe_sections.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "section_key": "cocktail", "section_label": "Cocktail",
    "prep_method": "", "cook_method": "raw",
    "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
    "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
    "yield_factor_other": "1.0",
    "filling_class": "", "cook_stages": "", "boil_stages": "", "source_recipe": "",
}])
print("✓ recipe_sections.csv")

ingredients_rows = [
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "sparkling_wine",
     "qty_display": "4 oz", "grams": "117.6", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "orange_juice_raw",
     "qty_display": "2 oz", "grams": "62.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
]
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow((RECIPE_ID, "1", "Chill a champagne flute in the freezer for a few minutes."))
    w.writerow((RECIPE_ID, "2", "Pour orange juice into the flute."))
    w.writerow((RECIPE_ID, "3", "Top with sparkling wine and stir gently."))
    w.writerow((RECIPE_ID, "4", "Suggestions (not included): Garnish with an orange slice or twist."))
print("✓ recipe_instructions.csv — 4 steps")
