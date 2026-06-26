"""BVRG_103 Paradise — gin 1oz + apricot brandy ¾oz + orange juice ½oz"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_103"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PARADISE", "Paradise", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# dry_gin 1oz: 27.0g
# apricot_brandy ¾oz: 0.75 × 30.5 = 22.875g
# orange_juice_raw ½oz: 0.5 × 31.0 = 15.5g
rows = [
    [ID, 1, "dry_gin",          "1 oz",       27.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "apricot_brandy",   "\u00be oz",  22.88, "", "", "cocktail", "", "", "", ""],
    [ID, 3, "orange_juice_raw", "\u00bd oz",  15.5,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine all ingredients in a cocktail shaker filled with ice."),
    (2, "Shake well until chilled, about 15 seconds."),
    (3, "Strain into a chilled coupe or cocktail glass."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
