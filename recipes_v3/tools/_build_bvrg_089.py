"""Build script for BVRG_089 Missionary's Downfall."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_089"

def get_fieldnames(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames

def append_csv(path, fieldnames, rows):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            w.writerow(row)

# Add pineapple_raw to ledger
p = BASE / "ingredients_ledger.csv"
append_csv(p, get_fieldnames(p), [{
    "ingredient_key": "pineapple_raw", "ndb_no": "9266",
    "food_word": "PINEAPPLE",
    "default_long_desc": "Pineapple, raw, all varieties",
    "default_display_name": "pineapple",
    "common_unit": "cup, chunks", "common_unit_grams": "165.0",
    "notes": "",
}])
print("✓ ingredients_ledger.csv — pineapple_raw NDB 9266")

# rum_light 1 oz:        1 × 27.8g  = 27.8g
# peach_liqueur 1/2 oz:  0.5 × 29.57g = 14.79g
# honey_syrup 1/2 oz:    0.5 × 40.0g  = 20.0g
# lime_juice_raw 3/4 oz: (0.75/8) × 242g = 22.69g
# pineapple_raw 1/4 cup: 0.25 × 165g  = 41.25g
# mint_fresh 6 leaves:   6 × 0.3g     = 1.8g

p = BASE / "recipes.csv"
append_csv(p, get_fieldnames(p), [{
    "recipe_id": RECIPE_ID, "food_word": "MISSIONARYSDOWNFALL",
    "recipe_name": "Missionary's Downfall", "category": "cocktails",
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
     "qty_display": "1 oz", "grams": "27.8", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "peach_liqueur",
     "qty_display": "\u00bd oz", "grams": "14.79", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "honey_syrup",
     "qty_display": "\u00bd oz", "grams": "20.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "4", "ingredient_key": "lime_juice_raw",
     "qty_display": "\u00be oz", "grams": "22.69", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "5", "ingredient_key": "pineapple_raw",
     "qty_display": "\u00bc cup", "grams": "41.25", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "6", "ingredient_key": "mint_fresh",
     "qty_display": "6 leaves", "grams": "1.8", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "0",
     "display_name_override": "", "cook_section": ""},
]
p = BASE / "recipe_ingredients.csv"
append_csv(p, get_fieldnames(p), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

p = BASE / "recipe_instructions.csv"
with open(p, "a", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow((RECIPE_ID, "1", "Add pineapple chunks and mint leaves to a blender."))
    w.writerow((RECIPE_ID, "2", "Add rum, peach liqueur, honey syrup, and lime juice."))
    w.writerow((RECIPE_ID, "3", "Fill the blender with crushed ice and blend until smooth."))
    w.writerow((RECIPE_ID, "4", "Pour into a chilled glass."))
    w.writerow((RECIPE_ID, "5", "Suggestions (not included): Garnish with a fresh mint sprig and a pineapple wedge."))
print("✓ recipe_instructions.csv — 5 steps")
