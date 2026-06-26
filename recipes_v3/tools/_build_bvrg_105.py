"""BVRG_105 Piña Colada — rum_light 2oz + coconut_cream 2tbsp + pineapple_juice 2oz"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_105"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PINACOLADA", "Piña Colada", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# rum_light 2oz: 2 × 27.8 = 55.6g
# coconut_cream_canned_sweetened 2 tbsp (≈1 oz): 2 × 19.0 = 38.0g
# pineapple_juice_canned 2oz: 4 tbsp × 15.0 = 60.0g
rows = [
    [ID, 1, "rum_light",                    "2 oz",         55.6,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "coconut_cream_canned_sweetened","2 tbsp (1 oz)",38.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "pineapple_juice_canned",        "2 oz",         60.0,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine the rum, coconut cream, and pineapple juice in a blender with 1 cup of crushed ice."),
    (2, "Blend on high until smooth and creamy."),
    (3, "Pour into a chilled hurricane or highball glass."),
    (4, "Suggestions (not included): Garnish with a pineapple wedge and a maraschino cherry."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
