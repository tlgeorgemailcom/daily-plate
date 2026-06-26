"""Build script for BVRG_097 New York Sour."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_097"

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

# bourbon 2 oz:          2 × 27.0       = 54.0g
# lemon_juice_raw ¾ oz:  0.75 × 30.0    = 22.5g
# simple_syrup ¾ oz:     0.75 × 35.0    = 26.25g
# egg_white_raw ½ white: 0.5 × 33.0     = 16.5g
# red_wine_dry ½ oz:     0.5 × 29.4     = 14.7g

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "food_word": "NEWYORKSOUR",
    "recipe_name": "New York Sour", "category": "cocktails",
    "dietary_category": "veggie", "link_type": "cocktail",
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
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "bourbon",
     "qty_display": "2 oz", "grams": "54.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "lemon_juice_raw",
     "qty_display": "\u00be oz", "grams": "22.5", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "simple_syrup",
     "qty_display": "\u00be oz", "grams": "26.25", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "4", "ingredient_key": "egg_white_raw",
     "qty_display": "\u00bd white", "grams": "16.5", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "5", "ingredient_key": "red_wine_dry",
     "qty_display": "\u00bd oz", "grams": "14.7", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "red wine (float)", "cook_section": ""},
]
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow((RECIPE_ID, "1", "Dry shake bourbon, lemon juice, simple syrup, and egg white without ice for 15 seconds to emulsify."))
    w.writerow((RECIPE_ID, "2", "Add ice and shake again until well chilled."))
    w.writerow((RECIPE_ID, "3", "Strain into a rocks glass over a large ice cube."))
    w.writerow((RECIPE_ID, "4", "Slowly pour the red wine over the back of a spoon to float it on top."))
print("✓ recipe_instructions.csv — 4 steps")
