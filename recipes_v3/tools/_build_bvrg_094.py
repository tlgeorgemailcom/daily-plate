"""Build script for BVRG_094 Mulled Wine."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_094"

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

# red_wine_dry 5 oz:    5 × 29.4   = 147.0g
# orange_juice_raw ½oz: 0.5 × 31.0 = 15.5g
# honey 1 tbsp:         21.0g (M2=tbsp/21.0)
# cinnamon_ground ½tsp: 0.5 × 2.6  = 1.3g
# cloves_ground ⅛tsp:   0.125×2.1  = 0.2625g
# anise_seed ½tsp:      0.5 × 2.1  = 1.05g

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "food_word": "MULLEDWINE",
    "recipe_name": "Mulled Wine", "category": "cocktails",
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
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "red_wine_dry",
     "qty_display": "5 oz", "grams": "147.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "orange_juice_raw",
     "qty_display": "\u00bd oz", "grams": "15.5", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "honey",
     "qty_display": "1 tbsp", "grams": "21.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "4", "ingredient_key": "cinnamon_ground",
     "qty_display": "\u00bd tsp", "grams": "1.3", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "5", "ingredient_key": "cloves_ground",
     "qty_display": "\u215b tsp", "grams": "0.26", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "6", "ingredient_key": "anise_seed",
     "qty_display": "\u00bd tsp whole", "grams": "1.05", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
]
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow((RECIPE_ID, "1", "Combine red wine, orange juice, honey, cinnamon, cloves, and anise seed in a small saucepan."))
    w.writerow((RECIPE_ID, "2", "Heat over medium-low heat, stirring until honey dissolves. Do not boil."))
    w.writerow((RECIPE_ID, "3", "Reduce heat to low and simmer for 10 minutes to allow the spices to infuse."))
    w.writerow((RECIPE_ID, "4", "Strain into a mug or heatproof glass and serve warm."))
    w.writerow((RECIPE_ID, "5", "Suggestions (not included): Garnish with a cinnamon stick and an orange slice."))
print("✓ recipe_instructions.csv — 5 steps")
