"""BVRG_109 Planter's Punch — dark rum 2oz + lime ¾oz + pineapple 1oz + OJ 1oz + grenadine ½oz"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_109"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PLANTERSP", "Planter's Punch", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# dark_rum 2oz: 2 × 27.0 = 54.0g
# lime_juice_raw ¾oz: 1.5 tbsp × 15.0 = 22.5g
# pineapple_juice_canned 1oz: 2 tbsp × 15.0 = 30.0g
# orange_juice_raw 1oz: 1 × 31.0 = 31.0g
# grenadine ½oz: 1 tbsp × 20.0 = 20.0g
rows = [
    [ID, 1, "dark_rum",              "2 oz",          54.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lime_juice_raw",        "\u00be oz",      22.5,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "pineapple_juice_canned","1 oz",           30.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 4, "orange_juice_raw",      "1 oz",           31.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 5, "grenadine",             "\u00bd oz",      20.0,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Fill a highball glass with crushed or cubed ice."),
    (2, "Add dark rum, lime juice, pineapple juice, orange juice, and grenadine."),
    (3, "Stir gently to combine."),
    (4, "Suggestions (not included): Garnish with an orange wheel, a maraschino cherry, and a sprig of mint."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
