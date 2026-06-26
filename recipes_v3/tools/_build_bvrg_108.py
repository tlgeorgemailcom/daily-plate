"""BVRG_108 Pisco Sour — pisco 2oz + lemon 1oz + simple syrup ¾oz + egg white 1"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_108"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PISCOSOUR", "Pisco Sour", "cocktails", "veggie", "builtin",
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
# lemon_juice_raw 1oz: 2 tbsp × 15.0 = 30.0g
# simple_syrup ¾oz: 0.75 × 35.0 = 26.25g
# egg_white_raw 1 large: 33.0g
rows = [
    [ID, 1, "pisco",          "2 oz",          55.6,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lemon_juice_raw","1 oz",           30.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "simple_syrup",   "\u00be oz",      26.25, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "egg_white_raw",  "1 large white",  33.0,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine pisco, lemon juice, simple syrup, and egg white in a cocktail shaker without ice."),
    (2, "Dry shake vigorously for 15 seconds to emulsify the egg white."),
    (3, "Add ice and shake again for 15 seconds until well chilled."),
    (4, "Double-strain into a chilled coupe glass."),
    (5, "Suggestions (not included): Finish with 3 drops of Angostura bitters on the foam and a lemon twist."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
