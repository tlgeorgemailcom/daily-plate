"""Build script for BVRG_133 Spiked Hot Cocoa."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_133"

# ---------------------------------------------------------------------------
# recipes.csv
# ---------------------------------------------------------------------------
recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "SPIKEDHOTCOCOA",
    "recipe_name": "Spiked Hot Cocoa",
    "category": "cocktails",
    "dietary_category": "veggie",
    "link_type": "dish",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 mug (makes 1)",
    "servings_count": "1",
    "sr_rule": "Rule D",
    "cooking_method": "boiled",
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
    "audit_notes": "Rule D — milk 244g + cocoa 10g + sugar 12.6g + vanilla 1.05g + salt 0.75g + dark_rum 55.6g; 324.0g total",
    "skip_macros": "",
}

# ---------------------------------------------------------------------------
# recipe_sections.csv
# ---------------------------------------------------------------------------
sections_rows = [
    {
        "recipe_id": RECIPE_ID,
        "section_key": "cocktail",
        "section_label": "Cocktail",
        "prep_method": "",
        "cook_method": "boiled",
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

# ---------------------------------------------------------------------------
# recipe_ingredients.csv
# milk_whole:                 1 cup       = 244.0g  (M1 1 cup/244g)
# cocoa_powder_unsweetened:   2 tbsp      = 10.0g   (M1 1 tbsp/5g)
# sugar_granulated:           1 tbsp      = 12.6g   (M1 1 tbsp/12.6g)
# vanilla_extract:            1/4 tsp     = 1.05g   (M1 1 tsp/4.2g x 0.25)
# salt_table:                 1/8 tsp     = 0.75g   (M1 1 tsp/6.0g x 0.125)
# dark_rum:                   2 oz        = 55.6g   (M1 1 fl oz/27.8g x 2)
# Total: 324.0g
# ---------------------------------------------------------------------------
ingredients_rows = [
    {"recipe_id": RECIPE_ID, "row_order": "1", "ingredient_key": "milk_whole",
     "qty_display": "1 cup", "grams": "244.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "2", "ingredient_key": "cocoa_powder_unsweetened",
     "qty_display": "2 tbsp", "grams": "10.0", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "3", "ingredient_key": "sugar_granulated",
     "qty_display": "1 tbsp", "grams": "12.6", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "4", "ingredient_key": "vanilla_extract",
     "qty_display": "\u00bc tsp", "grams": "1.05", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "5", "ingredient_key": "salt_table",
     "qty_display": "\u215b tsp", "grams": "0.75", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
    {"recipe_id": RECIPE_ID, "row_order": "6", "ingredient_key": "dark_rum",
     "qty_display": "2 oz", "grams": "55.6", "grams_min": "", "grams_max": "",
     "section": "cocktail", "ingredient_group": "", "is_optional": "false",
     "display_name_override": "", "cook_section": ""},
]

# ---------------------------------------------------------------------------
# recipe_instructions.csv
# ---------------------------------------------------------------------------
instructions = [
    (RECIPE_ID, "1", "In a small saucepan, whisk together the cocoa powder, sugar, and salt."),
    (RECIPE_ID, "2", "Add a splash of the milk and whisk into a smooth paste."),
    (RECIPE_ID, "3", "Pour in the remaining milk and heat over medium heat, whisking frequently, until steaming and just beginning to simmer."),
    (RECIPE_ID, "4", "Remove from heat and stir in the vanilla extract."),
    (RECIPE_ID, "5", "Pour the dark rum into a mug, then add the hot cocoa and stir to combine."),
    (RECIPE_ID, "6", "Suggestions (not included): Top with whipped cream or marshmallows."),
]

# ---------------------------------------------------------------------------
# Writes
# ---------------------------------------------------------------------------
def append_to_csv(path, fieldnames, rows):
    with open(path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        for row in rows:
            writer.writerow(row)

def get_fieldnames(path):
    with open(path, newline="") as f:
        return csv.DictReader(f).fieldnames

def count_prefix(path, prefix):
    count = 0
    with open(path, newline="") as f:
        for line in f:
            if line.startswith(prefix + ","):
                count += 1
    return count

# Pre-write snapshot
for label, path in [
    ("recipes.csv", BASE / "recipes.csv"),
    ("recipe_sections.csv", BASE / "recipe_sections.csv"),
    ("recipe_ingredients.csv", BASE / "recipe_ingredients.csv"),
    ("recipe_instructions.csv", BASE / "recipe_instructions.csv"),
]:
    with open(path, newline="") as f:
        total = sum(1 for _ in f) - 1
    print(f"  {label}: {total} data rows before write")

print()

append_to_csv(BASE / "recipes.csv", get_fieldnames(BASE / "recipes.csv"), [recipes_row])
print(f"✓ recipes.csv")

append_to_csv(BASE / "recipe_sections.csv", get_fieldnames(BASE / "recipe_sections.csv"), sections_rows)
print(f"✓ recipe_sections.csv — {len(sections_rows)} row(s)")

append_to_csv(BASE / "recipe_ingredients.csv", get_fieldnames(BASE / "recipe_ingredients.csv"), ingredients_rows)
print(f"✓ recipe_ingredients.csv — {len(ingredients_rows)} rows")

with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    writer = csv.writer(f)
    for row in instructions:
        writer.writerow(row)
print(f"✓ recipe_instructions.csv — {len(instructions)} steps")

print("\nPost-write verification:")
for label, path in [
    ("recipes.csv", BASE / "recipes.csv"),
    ("recipe_sections.csv", BASE / "recipe_sections.csv"),
    ("recipe_ingredients.csv", BASE / "recipe_ingredients.csv"),
    ("recipe_instructions.csv", BASE / "recipe_instructions.csv"),
]:
    n = count_prefix(path, RECIPE_ID)
    print(f"  {label}: {n} rows for {RECIPE_ID}")
