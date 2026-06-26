"""BVRG_102 Paper Plane — bourbon ¾oz + aperol ¾oz + amaro_nonino ¾oz + lemon ¾oz"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_102"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PAPERPLANE", "Paper Plane", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# bourbon ¾oz: 0.75 × 27.0 = 20.25g
# aperol ¾oz: 0.75 × 29.57 = 22.18g
# amaro_nonino ¾oz: 0.75 × 29.9 = 22.43g
# lemon_juice_raw ¾oz: 0.75 × 30.0 = 22.5g
rows = [
    [ID, 1, "bourbon",          "\u00be oz", 20.25, "", "", "cocktail", "", "", "", ""],
    [ID, 2, "aperol",           "\u00be oz", 22.18, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "amaro_nonino",     "\u00be oz", 22.43, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "lemon_juice_raw",  "\u00be oz", 22.5,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine all ingredients in a cocktail shaker filled with ice."),
    (2, "Shake well until chilled, about 15 seconds."),
    (3, "Double-strain into a chilled coupe glass."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
