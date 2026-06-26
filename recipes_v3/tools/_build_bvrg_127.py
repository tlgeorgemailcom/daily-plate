"""BVRG_127 Sherry Cobbler — amontillado sherry 3oz + simple syrup ¼oz + orange juice 1oz."""
import csv, sys
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_127"

# ── recipes.csv ──────────────────────────────────────────────────────────────
with open(BASE / "recipes.csv", newline="") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

if any(r["recipe_id"] == ID for r in rows):
    print(f"{ID} already in recipes.csv — skipping"); sys.exit(0)

rows.append({
    "recipe_id": ID,
    "food_word": "SHERRYCOBBLER",
    "recipe_name": "Sherry Cobbler",
    "category": "cocktails",
    "dietary_category": "vegan",
    "link_type": "",
    "canonical_ndb_no": "",
    "prep_time": "5",
    "servings_label": "1 cocktail (makes 1)",
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
    "audit_notes": "Rule D — no canonical; amontillado_sherry 3oz + simple_syrup \u00bcoz + orange_juice_raw 1oz; 120.75g \u00b7 ~117 kcal/100g",
    "skip_macros": "",
})

with open(BASE / "recipes.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
print(f"\u2713 recipes.csv \u2014 {ID}")

# ── recipe_sections.csv ───────────────────────────────────────────────────────
with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([ID, "cocktail", "Cocktail", "", "raw",
                     "1.0", "1.0", "1.0", "1.0", "1.0", "", "", "", ""])
print("\u2713 recipe_sections.csv")

# ── recipe_ingredients.csv ───────────────────────────────────────────────────
ingredients = [
    # row_order, key, qty_display, grams
    (10, "amontillado_sherry",  "3 oz amontillado sherry",           "81.0"),
    (20, "simple_syrup",        "\u00bc oz simple syrup",             "8.75"),
    (30, "orange_juice_raw",    "1 oz orange juice (from muddle)",   "31.0"),
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    writer = csv.writer(f)
    for row_order, key, qty, grams in ingredients:
        writer.writerow([ID, row_order, key, qty, grams,
                         "", "", "cocktail", "", "0", "", ""])
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ingredients)} rows")

# ── recipe_instructions.csv ──────────────────────────────────────────────────
steps = [
    (1, "Place 3 half-moon slices of fresh orange in a cocktail shaker. Add the simple syrup and muddle firmly to release the juice and aromatic oils \u2014 3 slices yields about 1 oz of expressed juice."),
    (2, "Add the amontillado sherry and fill the shaker with ice. Shake vigorously for about 15 seconds so the ice begins to break down the fruit."),
    (3, "Fill a highball glass completely with crushed ice."),
    (4, "Strain the cocktail over the ice. Top with more crushed ice, packing it to the brim so it forms a dome."),
    (5, "Garnish with a fresh orange slice and seasonal berries. Serve with a straw."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    writer = csv.writer(f)
    for step_num, text in steps:
        writer.writerow([ID, str(step_num), text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
