"""BVRG_110 Porn Star Martini — vanilla vodka 1½oz + passion fruit 1oz + passoa ½oz + lime ½oz + simple syrup ¼oz + sparkling wine 1oz side"""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
ID   = "BVRG_110"

with open(BASE / "recipes.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        ID, "PORNSTARMARTINI", "Porn Star Martini", "cocktails", "vegan", "builtin",
        "", 5, "1 cocktail (makes 1)", 1, "Rule D", "raw",
        1.0, 1.0, 1.0, 1.0, 1.0,
        "approved", "", "", "", "PASS", "", ""
    ])
print(f"✓ recipes.csv — {ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    w = csv.writer(f)
    w.writerow([ID, "cocktail", "Cocktail", "", "raw", 1.0, 1.0, 1.0, 1.0, 1.0, "", "", "", ""])
print("✓ recipe_sections.csv")

# vanilla_vodka 1½oz: 1.5 × 27.0 = 40.5g
# passion_fruit_puree 1oz (30ml): 30.0g  (M1=ml/1)
# passoa ½oz: 0.5 × 31.3 = 15.65g
# lime_juice_raw ½oz: 1 tbsp × 15.0 = 15.0g
# simple_syrup ¼oz: 0.25 × 35.0 = 8.75g
# sparkling_wine 1oz (side): 1 × 29.4 = 29.4g
rows = [
    [ID, 1, "vanilla_vodka",       "1\u00bd oz",    40.5,  "", "", "cocktail", "", "", "", ""],
    [ID, 2, "passion_fruit_puree", "1 oz (30 ml)",  30.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 3, "passoa",              "\u00bd oz",      15.65, "", "", "cocktail", "", "", "", ""],
    [ID, 4, "lime_juice_raw",      "\u00bd oz",      15.0,  "", "", "cocktail", "", "", "", ""],
    [ID, 5, "simple_syrup",        "\u00bc oz",       8.75, "", "", "cocktail", "", "", "", ""],
    [ID, 6, "sparkling_wine",      "1 oz (side)",    29.4,  "", "", "cocktail", "", "", "", ""],
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for r in rows:
        w.writerow(r)
print(f"✓ recipe_ingredients.csv — {len(rows)} rows")

steps = [
    (1, "Combine vanilla vodka, passion fruit purée, passoa, lime juice, and simple syrup in a cocktail shaker with ice."),
    (2, "Shake vigorously for 15 seconds until well chilled."),
    (3, "Double-strain into a chilled coupe glass."),
    (4, "Pour the sparkling wine into a separate shot glass and serve alongside the cocktail."),
    (5, "Suggestions (not included): Float half a fresh passion fruit on the surface of the cocktail as garnish."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([ID, str(step_num), text])
print(f"✓ recipe_instructions.csv — {len(steps)} steps")
