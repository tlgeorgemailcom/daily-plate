"""BVRG_128 Sidecar — cognac 2oz + triple sec ¾oz + lemon juice ¾oz."""
import csv, sys
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_128"

# ── recipes.csv ──────────────────────────────────────────────────────────────
with open(BASE / "recipes.csv", newline="") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

if any(r["recipe_id"] == ID for r in rows):
    print(f"{ID} already in recipes.csv — skipping"); sys.exit(0)

rows.append({
    "recipe_id": ID,
    "food_word": "SIDECAR",
    "recipe_name": "Sidecar",
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
    "audit_notes": "Rule D \u2014 no canonical; cognac 2oz + triple_sec \u00beoz + lemon_juice_raw \u00beoz; 100.3g \u00b7 ~205 kcal/100g",
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
    (10, "cognac",          "2 oz cognac",          "55.6"),
    (20, "triple_sec",      "\u00be oz triple sec",  "22.18"),
    (30, "lemon_juice_raw", "\u00be oz lemon juice", "22.5"),
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    writer = csv.writer(f)
    for row_order, key, qty, grams in ingredients:
        writer.writerow([ID, row_order, key, qty, grams,
                         "", "", "cocktail", "", "0", "", ""])
print(f"\u2713 recipe_ingredients.csv \u2014 {len(ingredients)} rows")

# ── recipe_instructions.csv ──────────────────────────────────────────────────
steps = [
    (1, "Chill a coupe or cocktail glass in the freezer, or fill it with ice water and set aside."),
    (2, "Combine the cognac, triple sec, and lemon juice in a cocktail shaker filled with ice."),
    (3, "Shake vigorously for 15 seconds until well chilled and diluted."),
    (4, "Discard the ice from the chilled glass. Optional: rim the edge with sugar by rubbing a lemon wedge around the rim and dipping in superfine sugar."),
    (5, "Double-strain into the chilled glass and garnish with a lemon or orange twist."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    writer = csv.writer(f)
    for step_num, text in steps:
        writer.writerow([ID, str(step_num), text])
print(f"\u2713 recipe_instructions.csv \u2014 {len(steps)} steps")
