"""BVRG_106 Pimm's Cup — pimms_no1 2oz + ginger_beer 4oz + lemon ½oz + cucumber 2 slices"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_106"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PIMMSCUP", "Pimm's Cup", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# pimms_no1 2oz: 2 × 29.6 = 59.2g
# ginger_beer 4oz: 4 × 30.8 = 123.2g
# lemon_juice_raw ½oz: 0.5 × 30.0 = 15.0g
# cucumber_peeled_raw 2 slices: 2 × 9.0 = 18.0g
rows = [
    [ID, 1, "pimms_no1",          "2 oz",      59.2,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "ginger_beer",        "4 oz",      123.2, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "lemon_juice_raw",    "\u00bd oz", 15.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 4, "cucumber_peeled_raw","2 slices",  18.0,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Fill a highball glass or jug with ice."),
    (2, "Pour in the Pimm's No. 1 and lemon juice."),
    (3, "Top with ginger beer and stir gently."),
    (4, "Suggestions (not included): Garnish with cucumber slices, a strawberry, a sprig of mint, and an orange wheel."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
