"""BVRG_104 Penicillin — scotch 2oz + lemon ¾oz + honey syrup ¾oz + ginger + islay float ¼oz"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_104"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PENICILLIN", "Penicillin", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# scotch_whisky 2oz: 2 × 27.8 = 55.6g
# lemon_juice_raw ¾oz: 0.75 × 30.0 = 22.5g
# honey_syrup ¾oz: 0.75 × 40.0 = 30.0g
# ginger_root_fresh ~3 slices: 3 × 6.0 = 18.0g  (M1=tablespoon/6.0)
# islay_scotch ¼oz float: 0.25 × 27.8 = 6.95g
rows = [
    [ID, 1, "scotch_whisky",    "2 oz",       55.6,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "lemon_juice_raw",  "\u00be oz",  22.5,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "honey_syrup",      "\u00be oz",  30.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 4, "ginger_root_fresh","3 slices",   18.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 5, "islay_scotch",     "\u00bc oz (float)", 6.95, "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Muddle the fresh ginger slices in a cocktail shaker."),
    (2, "Add the blended Scotch whisky, lemon juice, and honey syrup. Fill with ice and shake well until chilled."),
    (3, "Double-strain into a rocks glass over a large ice cube."),
    (4, "Float the Islay single malt Scotch by gently pouring it over the back of a spoon so it rests on top."),
    (5, "Suggestions (not included): Garnish with a piece of candied ginger and a lemon twist."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
