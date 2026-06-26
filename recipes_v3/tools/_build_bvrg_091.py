"""Build script for BVRG_091 Monkey Gland."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_091"

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

# dry_gin 1.5 oz:         1.5 × 27.0g  = 40.5g
# orange_juice_raw 1.5oz: 1.5 × 31.0g  = 46.5g
# grenadine 1/4 oz:       0.5 × 20.0g  = 10.0g  (1/4 oz ≈ 1/2 tbsp)
# absinthe 1/4 oz:        0.25 × 29.57g = 7.39g

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "food_word": "MONKEYGLAND",
    "recipe_name": "Monkey Gland", "category": "cocktails",
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
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "dry_gin",
     "qty_display": "1\u00bd oz", "grams": "40.5", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "orange_juice_raw",
     "qty_display": "1\u00bd oz", "grams": "46.5", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "grenadine",
     "qty_display": "\u00bc oz", "grams": "10.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "4", "ingredient_key": "absinthe",
     "qty_display": "\u00bc oz", "grams": "7.39", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
]
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow((RECIPE_ID, "1", "Combine gin, orange juice, grenadine, and absinthe in a cocktail shaker with ice."))
    w.writerow((RECIPE_ID, "2", "Shake well until chilled."))
    w.writerow((RECIPE_ID, "3", "Strain into a chilled cocktail glass."))
    w.writerow((RECIPE_ID, "4", "Suggestions (not included): Garnish with an orange twist."))
print("✓ recipe_instructions.csv — 4 steps")
