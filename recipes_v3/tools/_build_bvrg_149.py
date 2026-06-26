"""Build script for BVRG_149 Vodka Tonic."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_149"

# ── recipes.csv ──────────────────────────────────────────────────────────────
recipes_row = {
    "recipe_id": RECIPE_ID,
    "food_word": "VODKATONIC",
    "recipe_name": "Vodka Tonic",
    "category": "cocktails",
    "dietary_category": "vegan",
    "link_type": "",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 cocktail",
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
    "audit_notes": "Rule D — no canonical; 2 oz vodka + 4 oz tonic + 1/4 oz lime; 183.9g; vegan",
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
    # vodka 2 oz = 55.6g
    {
        "recipe_id": RECIPE_ID, "row_order": "1",
        "ingredient_key": "vodka_80proof",
        "qty_display": "2 oz", "grams": "55.6",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # tonic water 4 oz = 120.8g
    {
        "recipe_id": RECIPE_ID, "row_order": "2",
        "ingredient_key": "tonic_water",
        "qty_display": "4 oz", "grams": "120.8",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
    # lime juice 1/4 oz = 7.5g
    {
        "recipe_id": RECIPE_ID, "row_order": "3",
        "ingredient_key": "lime_juice_raw",
        "qty_display": "1/4 oz", "grams": "7.5",
        "grams_min": "", "grams_max": "",
        "section": "cocktail", "ingredient_group": "",
        "is_optional": "0", "display_name_override": "", "cook_section": "",
    },
]

# ── recipe_instructions.csv ───────────────────────────────────────────────────
instructions_rows = [
    [RECIPE_ID, "1", "Fill a highball glass with ice."],
    [RECIPE_ID, "2", "Pour in the vodka and lime juice."],
    [RECIPE_ID, "3", "Top with tonic water and stir gently."],
    [RECIPE_ID, "4", "Suggestions (not included): Garnish with a lime wedge."],
]

# ── write ─────────────────────────────────────────────────────────────────────
def append_dict(path, row, fieldnames):
    with open(path, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writerow(row)

def get_fieldnames(path):
    with open(path, newline="") as f:
        return csv.DictReader(f).fieldnames

for path, row in [
    (BASE / "recipes.csv", recipes_row),
    (BASE / "recipe_sections.csv", sections_row),
]:
    append_dict(path, row, get_fieldnames(path))

with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    fn = get_fieldnames(BASE / "recipe_ingredients.csv")
    w = csv.DictWriter(f, fieldnames=fn)
    for r in ingredients_rows:
        w.writerow(r)

with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in instructions_rows:
        w.writerow(r)

print(f"Done — {RECIPE_ID} Vodka Tonic appended.")
