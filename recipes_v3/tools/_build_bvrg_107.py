"""BVRG_107 Pisco Punch — pisco 2oz + pineapple juice 1oz + lemon ¾oz + simple syrup ½oz"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_107"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PISCOPUNCH", "Pisco Punch", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# pisco 2oz: 2 × 27.8 = 55.6g
# pineapple_juice_canned 1oz: 2 tbsp × 15.0 = 30.0g
# lemon_juice_raw ¾oz: 1.5 tbsp × 15.0 = 22.5g
# simple_syrup ½oz: 0.5 × 35.0 = 17.5g
rows = [
    [ID, 1, "pisco",                 "2 oz",          55.6,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "pineapple_juice_canned","1 oz",           30.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "lemon_juice_raw",       "\u00be oz",      22.5,  "", "", "cocktail", "", "", "", ""],
    [ID, 4, "simple_syrup",          "\u00bd oz",      17.5,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine pisco, pineapple juice, lemon juice, and simple syrup in a cocktail shaker with ice."),
    (2, "Shake vigorously for 15 seconds until well chilled."),
    (3, "Strain into a chilled coupe or punch cup over a large ice cube."),
    (4, "Suggestions (not included): Garnish with a pineapple wedge or a thin lemon wheel."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
