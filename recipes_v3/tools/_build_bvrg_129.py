"""Build BVRG_129 Singapore Sling."""
import csv, re
from pathlib import Path

BASE = Path("recipes_v3/data")

RID  = "BVRG_129"
WORD = "SINGAPORESLING"
NAME = "Singapore Sling"

# ── ingredients ──────────────────────────────────────────────────────────────
# M1 reference: dry_gin 27.0/fl oz, cherry_heering 30.8/fl oz,
#               triple_sec 30.2/fl oz, benedictine 30.5/fl oz,
#               grenadine 20.0/fl oz, pineapple_juice_canned 15.0/tbsp,
#               lime_juice_raw 15.0/tbsp, angostura_bitters 0.9/dash,
#               club_soda 237/cup → 1 oz = 29.625g

INGREDIENTS = [
    # row_order, key, qty_display, grams
    (1, "dry_gin",               "1\u00bd oz dry gin",           40.5),
    (2, "cherry_heering",        "\u00bd oz Cherry Heering",     15.4),
    (3, "triple_sec",            "\u00bc oz Cointreau",          7.55),   # 0.25×30.2
    (4, "benedictine",           "\u00bc oz B\u00e9n\u00e9dictine", 7.63), # 0.25×30.5
    (5, "grenadine",             "\u215b oz grenadine",          2.5),    # 0.125×20.0
    (6, "pineapple_juice_canned","4 oz pineapple juice",         120.0),  # 8 tbsp×15.0
    (7, "lime_juice_raw",        "\u00bd oz lime juice",         15.0),   # 1 tbsp
    (8, "angostura_bitters",     "1 dash Angostura bitters",     0.9),
    (9, "club_soda",             "1 oz club soda",               29.63),
]
TOTAL_G = sum(r[3] for r in INGREDIENTS)   # ≈239.1g

INSTRUCTIONS = [
    (1,  "Fill a cocktail shaker with ice."),
    (2,  "Add the gin, Cherry Heering, Cointreau, B\u00e9n\u00e9dictine, grenadine, "
         "pineapple juice, lime juice, and Angostura bitters to the shaker."),
    (3,  "Shake vigorously until well chilled, about 15 seconds."),
    (4,  "Strain into a tall glass (Collins glass) filled with fresh ice."),
    (5,  "Top with the club soda and stir briefly to combine."),
    (6,  "Suggestions (not included): Garnish with a pineapple wedge and a "
         "maraschino cherry on a skewer."),
]

# ── recipes.csv ──────────────────────────────────────────────────────────────
rp = BASE / "recipes.csv"
with open(rp) as f:
    rows = list(csv.DictReader(f))
if any(r["recipe_id"] == RID for r in rows):
    print(f"{RID} already in recipes.csv — skipping")
else:
    with open(rp, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writerow({
            "recipe_id": RID, "food_word": WORD, "recipe_name": NAME,
            "category": "cocktails", "dietary_category": "vegan",
            "link_type": "", "canonical_ndb_no": "", "prep_time": "5",
            "servings_label": "1 cocktail (makes 1)", "servings_count": "1",
            "sr_rule": "Rule D", "cooking_method": "raw",
            "yield_factor_water": "1.0", "yield_factor_fat": "1.0",
            "yield_factor_protein": "1.0", "yield_factor_carbohydrate": "1.0",
            "yield_factor_other": "1.0",
            "status": "approved", "fingerprint": "", "sr_notes": "",
            "disclosure": "", "audit_status": "PASS", "audit_notes": "", "skip_macros": "",
        })
    print(f"✓ recipes.csv: {RID} added")

# ── recipe_sections.csv ───────────────────────────────────────────────────────
sp = BASE / "recipe_sections.csv"
with open(sp) as f:
    srows = list(csv.reader(f))
if any(r[0] == RID for r in srows[1:]):
    print(f"{RID} already in recipe_sections.csv — skipping")
else:
    with open(sp, "a", newline="") as f:
        csv.writer(f).writerow([
            RID, "cocktail", "Cocktail", "", "raw",
            "1.0", "1.0", "1.0", "1.0", "1.0", "", "", "", "",
        ])
    print(f"✓ recipe_sections.csv: {RID} added")

# ── recipe_ingredients.csv ───────────────────────────────────────────────────
ip = BASE / "recipe_ingredients.csv"
with open(ip) as f:
    irows = list(csv.reader(f))
if any(r[0] == RID for r in irows[1:]):
    print(f"{RID} already in recipe_ingredients.csv — skipping")
else:
    with open(ip, "a", newline="") as f:
        w = csv.writer(f)
        for row_order, key, qty, grams in INGREDIENTS:
            w.writerow([RID, row_order, key, qty, grams, "", "", "cocktail",
                        "", "0", "", ""])
    print(f"✓ recipe_ingredients.csv: {RID} {len(INGREDIENTS)} rows added  (total≈{TOTAL_G:.1f}g)")

# ── recipe_instructions.csv ──────────────────────────────────────────────────
inst_path = BASE / "recipe_instructions.csv"
with open(inst_path) as f:
    existing = f.read()
if RID + "," in existing:
    print(f"{RID} already in recipe_instructions.csv — skipping")
else:
    with open(inst_path, "a", newline="") as f:
        w = csv.writer(f)
        for step, text in INSTRUCTIONS:
            w.writerow([RID, step, text])
    print(f"✓ recipe_instructions.csv: {len(INSTRUCTIONS)} steps added")

print(f"\nTotal raw weight: {TOTAL_G:.2f}g")
