"""Build script for BVRG_090 Mojito."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_090"

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

# rum_light 2 oz:       2 × 27.8g    = 55.6g
# lime_juice_raw 1 oz:  (1/8)*242g   = 30.25g
# simple_syrup 3/4 oz:  0.75*35.0g   = 26.25g
# mint_fresh 8 leaves:  8*0.3g       = 2.4g
# club_soda 3 oz:       (3/8)*237g   = 88.875g

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "food_word": "MOJITO",
    "recipe_name": "Mojito", "category": "cocktails",
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
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "rum_light",
     "qty_display": "2 oz", "grams": "55.6", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "lime_juice_raw",
     "qty_display": "1 oz", "grams": "30.25", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "simple_syrup",
     "qty_display": "\u00be oz", "grams": "26.25", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "4", "ingredient_key": "mint_fresh",
     "qty_display": "8 leaves", "grams": "2.4", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "5", "ingredient_key": "club_soda",
     "qty_display": "3 oz", "grams": "88.875", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
]
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow((RECIPE_ID, "1", "Add mint leaves and simple syrup to a highball glass and muddle gently to release the mint's aroma."))
    w.writerow((RECIPE_ID, "2", "Fill the glass with ice."))
    w.writerow((RECIPE_ID, "3", "Add rum and lime juice and stir to combine."))
    w.writerow((RECIPE_ID, "4", "Top with club soda and stir once gently."))
    w.writerow((RECIPE_ID, "5", "Suggestions (not included): Garnish with a mint sprig and a lime wheel."))
print("✓ recipe_instructions.csv — 5 steps")
