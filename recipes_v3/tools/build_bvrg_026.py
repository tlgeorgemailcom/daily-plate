"""
Build BVRG_026 — Angel Face
Equal parts gin, apricot brandy, calvados. Shaken, coupe.
Rule D — no SR Legacy canonical.
"""
import csv
import subprocess
import sys
import json
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_026"

recipes_path = BASE / "recipes.csv"
with open(recipes_path, newline="") as f:
    if any(row[0] == RECIPE_ID for row in csv.reader(f)):
        print(f"{RECIPE_ID} already in recipes.csv — nothing written.")
        sys.exit(0)

with open(recipes_path, "a", newline="") as f:
    csv.writer(f).writerow([
        RECIPE_ID, "ANGELFACE", "Angel Face", "cocktails", "vegan", "dish", "",
        "5", "1 cocktail (makes 1)", "1", "Rule D", "raw",
        "1.0", "1.0", "1.0", "1.0", "1.0", "approved", "",
        "Rule D — no canonical; equal parts gin, apricot brandy, calvados, shaken",
        "", "PASS", "", "",
    ])
print(f"  recipes.csv      ✓  {RECIPE_ID}")

with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    csv.writer(f).writerow([
        RECIPE_ID, "cocktail", "Angel Face", "raw", "raw",
        "1.0", "1.0", "1.0", "1.0", "1.0", "", "", "", "",
    ])
print(f"  recipe_sections  ✓")

# 1 oz gin (27.0g) + 1 oz apricot brandy (30.5g) + 1 oz calvados (27.8g)
# Total: 85.3g
ingredients = [
    (1, "dry_gin",        "1 oz", 27.0),
    (2, "apricot_brandy", "1 oz", 30.5),
    (3, "calvados",       "1 oz", 27.8),
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for row_order, key, qty, grams in ingredients:
        w.writerow([RECIPE_ID, row_order, key, qty, grams, "", "", "cocktail", "", "", "", ""])
print(f"  recipe_ingredients ✓  {len(ingredients)} rows")

steps = [
    (1, "Fill a cocktail shaker with ice."),
    (2, "Add the gin, apricot brandy, and calvados."),
    (3, "Shake vigorously for 10–15 seconds until well chilled."),
    (4, "Strain into a chilled coupe or cocktail glass."),
    (5, "Serve immediately."),
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
print(f"\n{RECIPE_ID} Angel Face — {d['grams_per_serving']:.0f}g per cocktail")
print(f"  {s['Energy_KCal']:.0f} kcal | {s['Protein']:.1f}g P | "
      f"{s['TotalLipidFat']:.1f}g F | {s['Carbohydrate']:.1f}g C | "
      f"{s['SugarsTotal']:.1f}g Su | {s['Water']:.1f}g W")
