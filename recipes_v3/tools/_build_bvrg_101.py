"""BVRG_101 Paloma — tequila 2oz + grapefruit juice 2oz + lime ½oz + simple syrup ½oz + club soda 2oz"""
import csv, sys
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_101"

# ── recipes.csv ──────────────────────────────────────────────────────────────
with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PALOMA", "Paloma", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

# ── recipe_sections.csv ───────────────────────────────────────────────────────
with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "cocktail", "Cocktail", "", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "", "", "", ""
    ])
print("✓ recipe_sections.csv")

# ── recipe_ingredients.csv ───────────────────────────────────────────────────
# tequila 2oz: 2 × 27.0 = 54.0g
# grapefruit_juice 2oz: 2 × (247/8) = 61.75g
# lime_juice_raw ½oz: 0.5 × (242/8) = 15.13g
# simple_syrup ½oz: 0.5 × 35.0 = 17.5g
# club_soda 2oz: 2 × (237/8) = 59.25g
rows = [
    [ID, 1,  "tequila",          "\u00bd oz tequila (1 oz)",     54.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 2,  "tequila",          "\u00bd oz tequila (1 oz)",     27.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 3,  "grapefruit_juice", "2 oz",                         61.75, "", "", "cocktail", "", "", "", ""],
    [ID, 4,  "lime_juice_raw",   "\u00bd oz",                    15.13, "", "", "cocktail", "", "", "", ""],
    [ID, 5,  "simple_syrup",     "\u00bd oz",                    17.5,  "", "", "cocktail", "", "", "", ""],
    [ID, 6,  "club_soda",        "2 oz",                         59.25, "", "", "cocktail", "", "", "", ""],
]

# Actually tequila is 2 oz = 54.0g in one row
rows = [
    [ID, 1,  "tequila",          "2 oz",          54.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 2,  "grapefruit_juice", "2 oz",           61.75, "", "", "cocktail", "", "", "", ""],
    [ID, 3,  "lime_juice_raw",   "\u00bd oz",      15.13, "", "", "cocktail", "", "", "", ""],
    [ID, 4,  "simple_syrup",     "\u00bd oz",      17.5,  "", "", "cocktail", "", "", "", ""],
    [ID, 5,  "club_soda",        "2 oz",           59.25, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

# ── recipe_instructions.csv ──────────────────────────────────────────────────
steps = [
    (1, "Combine the tequila, grapefruit juice, lime juice, and simple syrup in a highball glass filled with ice."),
    (2, "Top with club soda and stir gently to combine."),
    (3, "Suggestions (not included): Garnish with a grapefruit or lime wedge. Optionally rim the glass with salt before building."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
