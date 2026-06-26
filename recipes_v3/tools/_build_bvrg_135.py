"""Build script for BVRG_135 Stinger."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_135"

# ── recipes.csv ──────────────────────────────────────────────────────────────
recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "STINGER",
    "recipe_name": "Stinger",
    "category": "cocktails",
    "dietary_category": "vegan",
    "link_type": "",
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
    "sr_notes": "cognac 2oz + white creme de menthe 1oz; 86.1g; vegan; Rule D",
    "disclosure": "",
    "audit_status": "PASS",
    "audit_notes": "",
    "skip_macros": "",
}

# ── recipe_sections.csv ───────────────────────────────────────────────────────
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

# ── recipe_ingredients.csv ────────────────────────────────────────────────────
ingredients_rows = [
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "cognac", "qty_display": "2 oz",
        "grams": "55.6", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "creme_de_menthe_white", "qty_display": "1 oz",
        "grams": "30.5", "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "", "display_name_override": "", "cook_section": "",
    },
]

# ── recipe_instructions.csv ───────────────────────────────────────────────────
instructions_rows = [
    [RECIPE_ID, "1", "Add the cognac and white crème de menthe to a cocktail shaker filled with ice."],
    [RECIPE_ID, "2", "Shake until well chilled, about 15 seconds."],
    [RECIPE_ID, "3", "Strain into a chilled cocktail glass."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with a fresh mint sprig."],
]

# ── Write ─────────────────────────────────────────────────────────────────────
def append_dict(filename, row, fieldnames):
    with open(BASE / filename, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writerow(row)

def get_fieldnames(filename):
    with open(BASE / filename, newline="") as f:
        return csv.reader(f).__next__()

for fname, row in [
    ("recipes.csv", recipes_row),
    ("recipe_sections.csv", sections_row),
]:
    fields = get_fieldnames(fname)
    append_dict(fname, row, fields)
    print(f"✓ {fname}")

fields_ing = get_fieldnames("recipe_ingredients.csv")
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fields_ing)
    for r in ingredients_rows:
        w.writerow(r)
print("✓ recipe_ingredients.csv")

with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in instructions_rows:
        w.writerow(r)
print("✓ recipe_instructions.csv")

print("Done — BVRG_135 Stinger appended.")
