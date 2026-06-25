#!/usr/bin/env python3
"""
Build BVRG_024 — Alexander (Brandy Alexander)
Classic 1:1:1 brandy / crème de cacao (brown) / heavy cream.

Ingredients:
  1.5 oz brandy          → 41.7g  (27.8g/fl oz per ledger)
  1 oz  creme_de_cacao_brown → 30.0g
  1 oz  heavy_cream      → 30.0g
  1 pinch nutmeg_ground  →  0.3g  (garnish)

Rule D — no canonical NDB.
cooking_method = raw  (shaken, no heat)
yfw = 1.0
dietary_category = veggie  (dairy; no meat)
"""

import csv, os, subprocess

ROOT = "/Volumes/training/Daily Food Chain/daily-food-chain"
BASE = f"{ROOT}/recipes_v3/data"

RID = "BVRG_024"

# ── guard: abort if already present ──────────────────────────────────────────
with open(f"{BASE}/recipes.csv") as f:
    if any(r["recipe_id"] == RID for r in csv.DictReader(f)):
        print(f"{RID} already in recipes.csv — aborting to avoid duplication.")
        raise SystemExit(1)

# ── 1. recipes.csv ────────────────────────────────────────────────────────────
print("=== 1. recipes.csv ===")
with open(f"{BASE}/recipes.csv") as f:
    fieldnames = csv.DictReader(f).fieldnames

row = {
    "recipe_id":              RID,
    "food_word":              "ALEXANDER",
    "recipe_name":            "Alexander",
    "category":               "cocktails",
    "dietary_category":       "veggie",
    "link_type":              "dish",
    "canonical_ndb_no":       "",
    "prep_time":              "5",
    "servings_label":         "1 cocktail (makes 1)",
    "servings_count":         "1",
    "sr_rule":                "Rule D",
    "cooking_method":         "raw",
    "yield_factor_water":     "1.0",
    "yield_factor_fat":       "1.0",
    "yield_factor_protein":   "1.0",
    "yield_factor_carbohydrate": "1.0",
    "yield_factor_other":     "1.0",
    "status":                 "approved",
    "fingerprint":            "",
    "sr_notes":               "Rule D — no canonical; classic Brandy Alexander, shaken",
    "disclosure":             "",
    "audit_status":           "PASS",
    "audit_notes":            "",
    "skip_macros":            "",
}

with open(f"{BASE}/recipes.csv", "a", newline="") as f:
    csv.DictWriter(f, fieldnames=fieldnames).writerow(row)
print(f"  appended {RID}")

# ── 2. recipe_sections.csv ────────────────────────────────────────────────────
print("=== 2. recipe_sections.csv ===")
with open(f"{BASE}/recipe_sections.csv") as f:
    sec_fields = csv.DictReader(f).fieldnames

sec_row = {k: "" for k in sec_fields}
sec_row.update({
    "recipe_id":               RID,
    "section_key":             "cocktail",
    "section_label":           "Alexander",
    "prep_method":             "raw",
    "cook_method":             "raw",
    "yield_factor_water":      "1.0",
    "yield_factor_fat":        "1.0",
    "yield_factor_protein":    "1.0",
    "yield_factor_carbohydrate": "1.0",
    "yield_factor_other":      "1.0",
})

with open(f"{BASE}/recipe_sections.csv", "a", newline="") as f:
    csv.DictWriter(f, fieldnames=sec_fields).writerow(sec_row)
print(f"  appended section 'cocktail'")

# ── 3. recipe_ingredients.csv ─────────────────────────────────────────────────
print("=== 3. recipe_ingredients.csv ===")
with open(f"{BASE}/recipe_ingredients.csv") as f:
    ing_fields = csv.DictReader(f).fieldnames

def ing(order, key, qty, grams, override=""):
    r = {k: "" for k in ing_fields}
    r.update({
        "recipe_id":            RID,
        "row_order":            str(order),
        "ingredient_key":       key,
        "qty_display":          qty,
        "grams":                str(grams),
        "section":              "cocktail",
        "display_name_override": override,
    })
    return r

ingredients = [
    ing(1, "brandy",              "1.5 oz",                          41.7),
    ing(2, "creme_de_cacao_brown","1 oz",                            30.0),
    ing(3, "heavy_cream",         "1 oz",                            30.0),
    ing(4, "nutmeg_ground",       "1 pinch freshly grated nutmeg",    0.3, override="nutmeg"),
]

with open(f"{BASE}/recipe_ingredients.csv", "a", newline="") as f:
    w = csv.DictWriter(f, fieldnames=ing_fields)
    for r in ingredients:
        w.writerow(r)
        print(f"  {r['row_order']}. {r['ingredient_key']}  {r['qty_display']}  ({r['grams']}g)")

# ── 4. recipe_instructions.csv ───────────────────────────────────────────────
print("=== 4. recipe_instructions.csv ===")
steps = [
    "Fill a cocktail shaker with ice.",
    "Add the brandy, crème de cacao, and heavy cream.",
    "Shake vigorously for 10–15 seconds until well chilled and frothy.",
    "Double-strain into a chilled coupe or cocktail glass.",
    "Garnish with freshly grated nutmeg over the top. Serve immediately.",
]

with open(f"{BASE}/recipe_instructions.csv", "a", newline="") as f:
    w = csv.writer(f)
    for i, step in enumerate(steps, 1):
        w.writerow([RID, str(i), step])
        print(f"  step {i}: {step[:60]}")

# ── 5. build ──────────────────────────────────────────────────────────────────
print(f"\n=== 5. build_all.py --recipe {RID} ===")
result = subprocess.run(
    ["python3", "recipes_v3/tools/build_all.py", "--recipe", RID],
    cwd=ROOT, capture_output=True, text=True
)
print(result.stdout[-3000:] if len(result.stdout) > 3000 else result.stdout)
if result.returncode != 0:
    print("STDERR:", result.stderr[-1000:])
