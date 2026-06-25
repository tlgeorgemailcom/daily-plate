"""
Build BVRG_025 — Americano
Campari + sweet vermouth + club soda, built over ice in a rocks glass.
Rule D — no SR Legacy canonical for this cocktail composition.
"""
import csv
import subprocess
import sys
from pathlib import Path

BASE = Path("recipes_v3/data")
RECIPE_ID = "BVRG_025"

# ── Guard: skip if already in recipes.csv ──────────────────────────────────
recipes_path = BASE / "recipes.csv"
with open(recipes_path, newline="") as f:
    if any(row[0] == RECIPE_ID for row in csv.reader(f)):
        print(f"{RECIPE_ID} already in recipes.csv — nothing written.")
        sys.exit(0)

# ── 1. recipes.csv ─────────────────────────────────────────────────────────
with open(recipes_path, "a", newline="") as f:
    csv.writer(f).writerow([
        RECIPE_ID, "AMERICANO", "Americano", "cocktails", "vegan", "dish", "",
        "5", "1 cocktail (makes 1)", "1", "Rule D", "raw",
        "1.0", "1.0", "1.0", "1.0", "1.0", "approved", "",
        "Rule D — no canonical; Campari + sweet vermouth + club soda, built over ice",
        "", "PASS", "", "",
    ])
print(f"  recipes.csv      ✓  {RECIPE_ID}")

# ── 2. recipe_sections.csv ─────────────────────────────────────────────────
with open(BASE / "recipe_sections.csv", "a", newline="") as f:
    csv.writer(f).writerow([
        RECIPE_ID, "cocktail", "Americano", "raw", "raw",
        "1.0", "1.0", "1.0", "1.0", "1.0", "", "", "", "",
    ])
print(f"  recipe_sections  ✓")

# ── 3. recipe_ingredients.csv ──────────────────────────────────────────────
# Americano: 1 oz Campari (30.5g) + 1 oz sweet vermouth (31.0g) + 2 oz club soda (59.1g)
# Total raw: 120.6g  |  yfw=1.0 (no ice melt; soda & spirits weighed as poured)
ingredients = [
    # row_order, ingredient_key, qty_display, grams
    (1, "campari",       "1 oz",    30.5),
    (2, "sweet_vermouth","1 oz",    31.0),
    (3, "club_soda",     "2 oz",    59.1),
]
with open(BASE / "recipe_ingredients.csv", "a", newline="") as f:
    w = csv.writer(f)
    for row_order, key, qty, grams in ingredients:
        w.writerow([
            RECIPE_ID, row_order, key, qty, grams, "", "", "cocktail", "", "", "", "",
        ])
print(f"  recipe_ingredients ✓  {len(ingredients)} rows")

# ── 4. recipe_instructions.csv ─────────────────────────────────────────────
steps = [
    (1, "Fill a rocks glass with ice."),
    (2, "Add the Campari and sweet vermouth directly over the ice."),
    (3, "Top with club soda and stir gently to combine."),
    (4, "Garnish with an orange slice or lemon twist. Serve immediately."),
]
with open(BASE / "recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for step_num, text in steps:
        w.writerow([RECIPE_ID, str(step_num), text])
print(f"  recipe_instructions ✓  {len(steps)} steps")

# ── 5. Build ───────────────────────────────────────────────────────────────
print(f"\nRunning build_all.py --recipe {RECIPE_ID} …")
result = subprocess.run(
    [sys.executable, "recipes_v3/tools/build_all.py", "--recipe", RECIPE_ID],
    capture_output=True, text=True,
)
print(result.stdout.strip())
if result.returncode != 0:
    print("STDERR:", result.stderr.strip())
    sys.exit(result.returncode)

# ── 6. Show macros ─────────────────────────────────────────────────────────
import json
out = Path("recipes_v3/output/builds") / f"{RECIPE_ID}.json"
d = json.loads(out.read_text())
s = d["per_serving"]
print(f"\n{RECIPE_ID} Americano — {d['grams_per_serving']:.0f}g per cocktail")
print(f"  {s['Energy_KCal']:.0f} kcal | {s['Protein']:.1f}g P | "
      f"{s['TotalLipidFat']:.1f}g F | {s['Carbohydrate']:.1f}g C | "
      f"{s['SugarsTotal']:.1f}g Su | {s['Water']:.1f}g W")
