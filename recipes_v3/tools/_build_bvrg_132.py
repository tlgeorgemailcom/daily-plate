"""Build script for BVRG_132 Spiked Eggnog — composite: @BVRG_019 + dark_rum."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_132"

# ---------------------------------------------------------------------------
# recipes.csv
# ---------------------------------------------------------------------------
recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "SPIKEDEGGNOG",
    "recipe_name": "Spiked Eggnog",
    "category": "cocktails",
    "dietary_category": "veggie",
    "link_type": "dish",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 cocktail (makes 3)",
    "servings_count": "3",
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
    "audit_notes": "Rule D — composite: @BVRG_019 (924.55g) + dark_rum 6oz (166.8g); 1091.35g total; 3 servings x 363.8g",
    "skip_macros": "",
}

# ---------------------------------------------------------------------------
# recipe_sections.csv  (2 sections)
# ---------------------------------------------------------------------------
sections_rows = [
    # eggnog section — component_ref to BVRG_019
    {
        "recipe_id": RECIPE_ID,
        "section_key": "eggnog",
        "section_label": "Eggnog",
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
        "source_recipe": "BVRG_019",
    },
    # rum section — standalone dark_rum
    {
        "recipe_id": RECIPE_ID,
        "section_key": "rum",
        "section_label": "Dark Rum",
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

# ---------------------------------------------------------------------------
# recipe_ingredients.csv
# BVRG_019 cooked batch = 924.55g (3 servings x 308.2g)
# dark_rum 6 fl oz = 6 x 27.8g = 166.8g
# ---------------------------------------------------------------------------
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID,
        "row_order": "1",
        "ingredient_key": "@BVRG_019",
        "qty_display": "1 recipe Eggnog (3 cups, 924.55g)",
        "grams": "924.55",
        "grams_min": "",
        "grams_max": "",
        "section": "eggnog",
        "ingredient_group": "",
        "is_optional": "false",
        "display_name_override": "Eggnog recipe",
        "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID,
        "row_order": "2",
        "ingredient_key": "dark_rum",
        "qty_display": "6 oz",
        "grams": "166.8",
        "grams_min": "",
        "grams_max": "",
        "section": "rum",
        "ingredient_group": "",
        "is_optional": "false",
        "display_name_override": "",
        "cook_section": "",
    },
]

# ---------------------------------------------------------------------------
# recipe_instructions.csv  (3-column: recipe_id, step_order, step_text)
# ---------------------------------------------------------------------------
instructions = [
    (RECIPE_ID, "1", "Make the Eggnog recipe (see the Eggnog recipe)."),
    (RECIPE_ID, "2", "Pour the prepared eggnog into a large pitcher."),
    (RECIPE_ID, "3", "Add the dark rum and stir gently to combine."),
    (RECIPE_ID, "4", "Serve chilled, divided among 3 glasses."),
    (RECIPE_ID, "5", "Suggestions (not included): Garnish each glass with a sprinkle of freshly grated nutmeg and a dollop of whipped cream."),
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

# Count rows before writing
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
        total = sum(1 for _ in f) - 1  # subtract header
    print(f"  {label}: {total} data rows before write")

print()

# Write recipes.csv
recipes_path = BASE / "recipes.csv"
append_to_csv(recipes_path, get_fieldnames(recipes_path), [recipes_row])
print(f"✓ recipes.csv — appended {RECIPE_ID}")

# Write recipe_sections.csv
sections_path = BASE / "recipe_sections.csv"
append_to_csv(sections_path, get_fieldnames(sections_path), sections_rows)
print(f"✓ recipe_sections.csv — appended {len(sections_rows)} rows")

# Write recipe_ingredients.csv
ingredients_path = BASE / "recipe_ingredients.csv"
append_to_csv(ingredients_path, get_fieldnames(ingredients_path), ingredients_rows)
print(f"✓ recipe_ingredients.csv — appended {len(ingredients_rows)} rows")

# Write recipe_instructions.csv
instructions_path = BASE / "recipe_instructions.csv"
with open(instructions_path, "a", newline="") as f:
    writer = csv.writer(f)
    for row in instructions:
        writer.writerow(row)
print(f"✓ recipe_instructions.csv — appended {len(instructions)} rows")

print()
print("Post-write verification:")
for label, path, prefix in [
    ("recipes.csv", BASE / "recipes.csv", RECIPE_ID),
    ("recipe_sections.csv", BASE / "recipe_sections.csv", RECIPE_ID),
    ("recipe_ingredients.csv", BASE / "recipe_ingredients.csv", RECIPE_ID),
    ("recipe_instructions.csv", BASE / "recipe_instructions.csv", RECIPE_ID),
]:
    n = count_prefix(path, prefix)
    print(f"  {label}: {n} rows for {RECIPE_ID}")
