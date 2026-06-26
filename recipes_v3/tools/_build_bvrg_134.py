"""Build script for BVRG_134 Spritz (Aperol Spritz)."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_134"

recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "SPRITZ",
    "recipe_name": "Spritz",
    "category": "cocktails",
    "dietary_category": "vegan",
    "link_type": "dish",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 glass (makes 1)",
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
    "audit_notes": "Rule D — prosecco 3oz (88.2g) + aperol 2oz (62.0g) + club_soda 1oz (29.6g); 179.8g total",
    "skip_macros": "",
}

sections_rows = [
    {
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
    },
]

# prosecco:  3 oz = 3 × 29.4g = 88.2g  (M1 fl oz/29.4g)
# aperol:    2 oz = 2 × 31.0g = 62.0g  (M1 fl oz/31.0g)
# club_soda: 1 oz = 1 × 29.625g = 29.6g (M1 cup/237g → 237/8 = 29.625)
ingredients_rows = [
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "prosecco",
     "qty_display": "3 oz", "grams": "88.2", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "aperol",
     "qty_display": "2 oz", "grams": "62.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "club_soda",
     "qty_display": "1 oz splash", "grams": "29.6", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
]

instructions = [
    (RECIPE_ID, "1", "Fill a large wine glass with ice."),
    (RECIPE_ID, "2", "Pour the Aperol over the ice."),
    (RECIPE_ID, "3", "Add the Prosecco and stir gently."),
    (RECIPE_ID, "4", "Top with a splash of club soda."),
    (RECIPE_ID, "5", "Suggestions (not included): Garnish with a half-slice of orange."),
]

def append_to_csv(path, fieldnames, rows):
    with open(path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            writer.writerow(row)

def get_fieldnames(path):
    with open(path, newline="") as f:
        return csv.DictReader(f).fieldnames

def count_prefix(path, prefix):
    return sum(1 for line in open(path) if line.startswith(prefix + ","))

for label, path in [("recipes.csv", BASE/"recipes.csv"), ("recipe_sections.csv", BASE/"recipe_sections.csv"),
                    ("recipe_ingredients.csv", BASE/"recipe_ingredients.csv"), ("recipe_instructions.csv", BASE/"recipe_instructions.csv")]:
    print(f"  {label}: {sum(1 for _ in open(path)) - 1} rows before write")

print()
append_to_csv(BASE/"recipes.csv", get_fieldnames(BASE/"recipes.csv"), [recipes_row])
append_to_csv(BASE/"recipe_sections.csv", get_fieldnames(BASE/"recipe_sections.csv"), sections_rows)
append_to_csv(BASE/"recipe_ingredients.csv", get_fieldnames(BASE/"recipe_ingredients.csv"), ingredients_rows)
with open(BASE/"recipe_instructions.csv", "a", newline="") as f:
    writer = csv.writer(f)
    for row in instructions:
        writer.writerow(row)

print("Post-write verification:")
for label, path in [("recipes.csv", BASE/"recipes.csv"), ("recipe_sections.csv", BASE/"recipe_sections.csv"),
                    ("recipe_ingredients.csv", BASE/"recipe_ingredients.csv"), ("recipe_instructions.csv", BASE/"recipe_instructions.csv")]:
    print(f"  {label}: {count_prefix(path, RECIPE_ID)} rows for {RECIPE_ID}")
