"""BVRG_112 Remember the Maine — rye 2oz + sweet vermouth ¾oz + cherry_heering 2 tsp + absinthe ½ tsp"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_112"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "REMEMBERTHEMAINE", "Remember the Maine", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# rye_whiskey 2oz: 2 × 27.8 = 55.6g
# sweet_vermouth ¾oz: 0.75 × 29.57 = 22.18g
# cherry_heering 2 tsp: 2 × (30.8/6) = 10.27g  (1 fl oz = 6 tsp)
# absinthe ½ tsp: 0.5 × (29.57/6) = 2.46g
rows = [
    [ID, 1, "rye_whiskey",    "2 oz",           55.6,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "sweet_vermouth", "\u00be oz",       22.18, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "cherry_heering", "2 tsp",           10.27, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "absinthe",       "\u00bd tsp",       2.46, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine rye whiskey, sweet vermouth, Cherry Heering, and absinthe in a mixing glass with ice."),
    (2, "Stir for 30 seconds until well chilled and diluted."),
    (3, "Strain into a chilled coupe or cocktail glass."),
    (4, "Suggestions (not included): Garnish with a brandied cherry."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
