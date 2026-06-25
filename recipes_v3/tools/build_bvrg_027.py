"""
Build BVRG_027 — Aperol Spritz
3 oz prosecco + 2 oz Aperol + 1 oz club soda. Built over ice in a wine glass.
Rule D — no SR Legacy canonical.
"""
import csv
import subprocess
import sys
import json
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_027"

recipes_path = BASE / "recipes.csv"
with open(recipes_path, newline="") as f:
    if any(row[0] == RECIPE_ID for row in csv.reader(f)):
        print(f"{RECIPE_ID} already in recipes.csv — nothing written.")
        sys.exit(0)

with open(recipes_path, "a", newline="") as f:
    csv.writer(f).writerow([
        RECIPE_ID, "APEROLSPRITZ", "Aperol Spritz", "cocktails", "vegan", "dish", "",
        "5", "1 cocktail (makes 1)", "1", "Rule D", "raw",
        "1.0", "1.0", "1.0", "1.0", "1.0", "approved", "",
        "Rule D — no canonical; prosecco + Aperol + club soda, built over ice",
        "", "PASS", "", "",
    ])
print(f"  recipes.csv      ✓  {RECIPE_ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    csv.writer(f).writerow([
        RECIPE_ID, "cocktail", "Aperol Spritz", "raw", "raw",
        "1.0", "1.0", "1.0", "1.0", "1.0", "", "", "", "",
    ])
print(f"  recipe_sections  ✓")

# 3 oz prosecco (3 × 29.4 = 88.2g) + 2 oz Aperol (2 × 31.0 = 62.0g) + 1 oz club soda (29.6g)
# Total raw: 179.8g
ingredients = [
    (1, "sparkling_wine", "3 oz",  88.2),
    (2, "aperol",         "2 oz",  62.0),
    (3, "club_soda",      "1 oz",  29.6),
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for row_order, key, qty, grams in ingredients:
        w.writerow([RECIPE_ID, row_order, key, qty, grams, "", "", "cocktail", "", "", "", ""])
print(f"  recipe_ingredients ✓  {len(ingredients)} rows")

steps = [
    (1, "Fill a large wine glass with ice."),
    (2, "Add the Prosecco."),
    (3, "Add the Aperol."),
    (4, "Top with a splash of club soda and stir gently to combine."),
    (5, "Garnish with an orange slice. Serve immediately."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([RECIPE_ID, str(step_num), text])
print(f"  recipe_instructions ✓  {len(steps)} steps")

print(f"\nRunning build_all.py --recipe {RECIPE_ID} …")
result = subprocess.run(
    [sys.executable, "recipes_v3/tools/build_all.py", "--recipe", RECIPE_ID],
    capture_output=True, text=True,
)
print(result.stdout.strip())
if result.returncode != 0:
    print("STDERR:", result.stderr.strip())
    sys.exit(result.returncode)

out = Path("recipes_v3/output/builds") / f"{RECIPE_ID}.json"
d = json.loads(out.read_text())
s = d["per_serving"]

print(f"\n{RECIPE_ID} Aperol Spritz — {d['grams_per_serving']:.0f}g per cocktail")
print(f"  {s['Energy_KCal']:.0f} kcal | {s['Protein']:.1f}g P | "
      f"{s['TotalLipidFat']:.1f}g F | {s['Carbohydrate']:.1f}g C | "
      f"{s['SugarsTotal']:.1f}g Su | {s['Water']:.1f}g W")

print()
print("INGREDIENTS:")
with open(BASE / "recipe_ingredients.csv") as f:
    for row in csv.reader(f):
        if row[0] == RECIPE_ID:
            print(f"  {row[1]}. [{row[2]}]  {row[3]}  ({row[4]}g)")

print()
print("INSTRUCTIONS:")
with open(BASE / "recipe_instructions.csv") as f:
    for row in csv.reader(f):
        if row[0] == RECIPE_ID:
            print(f"  {row[1]}. {row[2]}")
