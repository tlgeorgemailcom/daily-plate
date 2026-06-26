"""BVRG_111 Porto Flip — port wine 1½oz + cognac ½oz + egg yolk 1"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_111"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PORTOFLIP", "Porto Flip", "cocktails", "veggie", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# port_wine_sweet 1½oz: 1.5 × 30.5 = 45.75g
# cognac ½oz: 0.5 × 27.8 = 13.9g
# egg_yolk_raw 1 large yolk: 17.0g
rows = [
    [ID, 1, "port_wine_sweet", "1\u00bd oz",      45.75, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "cognac",          "\u00bd oz",        13.9,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "egg_yolk_raw",    "1 large yolk",     17.0,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine port wine, cognac, and egg yolk in a cocktail shaker with ice."),
    (2, "Shake vigorously for 15–20 seconds until well chilled and frothy."),
    (3, "Double-strain into a chilled coupe or small wine glass."),
    (4, "Suggestions (not included): Grate fresh nutmeg over the top to finish."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
