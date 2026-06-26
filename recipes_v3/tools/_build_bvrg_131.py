"""Build BVRG_131 Spicy Fifty."""
import csv
from pathlib import Path

BASE = Path("recipes_v3/data")
RID  = "BVRG_131"
WORD = "SPICYFIFTY"
NAME = "Spicy Fifty"

# M1 refs: vanilla_vodka 27.0/fl oz, elderflower_liqueur 33.1/fl oz,
#          lime_juice_raw 15.0/tbsp, honey cup/339.0 → ½oz=21.2g,
#          jalapeno_raw 14.0/pepper → 2 slices ≈ 7.0g
INGREDIENTS = [
    (1, "vanilla_vodka",        "2 oz vanilla vodka",                54.0),
    (2, "elderflower_liqueur",  "\u00bd oz elderflower liqueur",     16.55),
    (3, "lime_juice_raw",       "\u00bd oz lime juice",              15.0),
    (4, "honey",                "\u00bd oz honey",                   21.2),
    (5, "jalapeno_raw",         "2 slices fresh red chilli",          7.0),
]
TOTAL_G = sum(r[3] for r in INGREDIENTS)  # 113.75g

INSTRUCTIONS = [
    (1, "Place the chilli slices in a cocktail shaker and muddle lightly to release the heat."),
    (2, "Add the vanilla vodka, elderflower liqueur, lime juice, and honey."),
    (3, "Fill the shaker with ice."),
    (4, "Shake vigorously until well chilled, about 15 seconds."),
    (5, "Double-strain through a fine-mesh strainer into a chilled coupe glass."),
    (6, "Suggestions (not included): Garnish with a thin slice of red chilli on the rim."),
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
