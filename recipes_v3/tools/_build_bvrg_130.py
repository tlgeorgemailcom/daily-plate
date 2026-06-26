"""Build BVRG_130 South Side."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")

RID  = "BVRG_130"
WORD = "SOUTHSIDE"
NAME = "South Side"

# M1 refs: dry_gin 27.0/fl oz, lemon_juice_raw 15.0/tbsp,
#          simple_syrup 35.0/fl oz, mint_fresh 0.7/tsp
# ¾ oz lemon juice = 1.5 tbsp × 15.0 = 22.5g
# ¾ oz simple syrup = 0.75 × 35.0 = 26.25g
# 8 mint leaves ≈ 8 × 0.5g = 4.0g

INGREDIENTS = [
    (1, "dry_gin",          "2 oz dry gin",           54.0),
    (2, "lemon_juice_raw",  "\u00be oz lemon juice",  22.5),
    (3, "simple_syrup",     "\u00be oz simple syrup", 26.25),
    (4, "mint_fresh",       "8 leaves fresh mint",    4.0),
]
TOTAL_G = sum(r[3] for r in INGREDIENTS)  # 106.75g

INSTRUCTIONS = [
    (1, "Combine the gin, lemon juice, simple syrup, and mint leaves in a cocktail shaker."),
    (2, "Gently muddle the mint to bruise the leaves and release their oils."),
    (3, "Fill the shaker with ice."),
    (4, "Shake vigorously until well chilled, about 15 seconds."),
    (5, "Double-strain through a fine-mesh strainer into a chilled coupe glass."),
    (6, "Suggestions (not included): Garnish with a fresh mint sprig."),
]

rp = BASE / "recipes.csv"
with open(rp) as f:
    rows = list(csv.DictReader(f))
if not any(r["recipe_id"] == RID for r in rows):
    with open(rp, "a", newline="") as f:
        csv.DictWriter(f, fieldnames=rows[0].keys()).writerow({
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
    print(f"✓ recipes.csv: {RID}")

sp = BASE / "recipe_sections.csv"
with open(sp) as f:
    srows = list(csv.reader(f))
if not any(r[0] == RID for r in srows[1:]):
    with open(sp, "a", newline="") as f:
        csv.writer(f).writerow([RID, "cocktail", "Cocktail", "", "raw",
                                 "1.0", "1.0", "1.0", "1.0", "1.0", "", "", "", ""])
    print(f"✓ recipe_sections.csv: {RID}")

ip = BASE / "recipe_ingredients.csv"
with open(ip) as f:
    irows = list(csv.reader(f))
if not any(r[0] == RID for r in irows[1:]):
    with open(ip, "a", newline="") as f:
        w = csv.writer(f)
        for ro, key, qty, grams in INGREDIENTS:
            w.writerow([RID, ro, key, qty, grams, "", "", "cocktail", "", "0", "", ""])
    print(f"✓ recipe_ingredients.csv: {RID}  total={TOTAL_G}g")

inst = BASE / "recipe_instructions.csv"
with open(inst) as f:
    existing = f.read()
if RID + "," not in existing:
    with open(inst, "a", newline="") as f:
        w = csv.writer(f)
        for step, text in INSTRUCTIONS:
            w.writerow([RID, step, text])
    print(f"✓ recipe_instructions.csv: {len(INSTRUCTIONS)} steps")
