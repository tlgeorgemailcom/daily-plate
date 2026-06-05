#!/usr/bin/env python3
"""Write SAUCE_009 Mayonnaise (Sabayon Method) to all pipeline CSVs."""
import csv
import os

BASE = "recipes_v3/data"
RECIPE_ID = "SAUCE_009"

# ---------------------------------------------------------------------------
# 1. Add grapeseed_oil to ingredients_ledger.csv
# ---------------------------------------------------------------------------
ledger_path = f"{BASE}/ingredients_ledger.csv"
with open(ledger_path, "r", newline="") as f:
    rows = list(csv.reader(f))

# Check if already present
keys = [r[0] for r in rows]
if "grapeseed_oil" not in keys:
    rows.append([
        "grapeseed_oil", "4517", "GRAPESEEDOIL",
        "Oil, grapeseed", "grapeseed oil", "tablespoon", "13.6",
        "1 tbsp grapeseed oil = 13.6g"
    ])
    with open(ledger_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print("Added grapeseed_oil to ingredients_ledger.csv")
else:
    print("grapeseed_oil already in ledger")

# ---------------------------------------------------------------------------
# 2. Append to recipes.csv
# ---------------------------------------------------------------------------
recipes_path = f"{BASE}/recipes.csv"
with open(recipes_path, "r", newline="") as f:
    existing = [r[0] for r in csv.reader(f)]

if RECIPE_ID not in existing:
    row = [
        "SAUCE_009", "MAYONNAISE", "Mayonnaise",
        "sauces & condiments", "veggie", "builtin",
        "", "",                          # canonical_ndb_no, col7
        "1 tbsp (makes 18)", "18",       # servings_label, servings_count
        "Rule D", "raw",                 # sr_rule, cooking_method
        "1.0", "1.0", "1.0", "1.0", "1.0",  # yfw, yff, yfp, yfc, yfo
        "approved", "",                  # status, col18
        "Mayonnaise (sabayon method); Rule D — no canonical; "
        "egg_yolk_raw(1125)+lemon_juice_raw(9152)+grapeseed_oil(4517)+"
        "salt_table(2047)+white_pepper_ground(2032); yfw=1.00 → 270.55g; "
        "18 servings x 15g (~1 tbsp)",  # notes
        "Mayonnaise computed from SR Legacy values only.",  # notes2
        "PASS", "", ""                   # audit_status, col22, col23
    ]
    with open(recipes_path, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(row)
    print("Added SAUCE_009 to recipes.csv")
else:
    print("SAUCE_009 already in recipes.csv")

# ---------------------------------------------------------------------------
# 3. Append to recipe_sections.csv
# ---------------------------------------------------------------------------
sections_path = f"{BASE}/recipe_sections.csv"
with open(sections_path, "r", newline="") as f:
    existing_s = [(r[0], r[1]) for r in csv.reader(f)]

if (RECIPE_ID, "sauce") not in existing_s:
    row = [
        "SAUCE_009", "sauce", "Sauce:", "",
        "raw", "1.0", "1.0", "1.0", "1.0", "1.0",
        "", "", "", ""
    ]
    with open(sections_path, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(row)
    print("Added SAUCE_009 to recipe_sections.csv")
else:
    print("SAUCE_009 already in recipe_sections.csv")

# ---------------------------------------------------------------------------
# 4. Append to recipe_ingredients.csv
# ---------------------------------------------------------------------------
# Quantities derived from food-portions-complete.csv M-series:
#   egg_yolk_raw (1125): 1 large = 17.0g  → 2 large = 34.0g
#   lemon_juice_raw (9152): 1 cup = 244g / 16 tbsp = 15.25g per tbsp
#   grapeseed_oil (4517): 1 cup = 218.0g
#   salt_table (2047): 1 tsp = 6.0g → ½ tsp = 3.0g
#   white_pepper_ground (2032): 1 tsp = 2.4g → pinch (⅛ tsp) = 0.3g
# Total raw: 34.0 + 15.25 + 218.0 + 3.0 + 0.3 = 270.55g
ingredients_path = f"{BASE}/recipe_ingredients.csv"
with open(ingredients_path, "r", newline="") as f:
    existing_i = [(r[0], int(r[1])) for r in csv.reader(f) if r[0] == RECIPE_ID]

if not existing_i:
    rows = [
        ["SAUCE_009", "1", "egg_yolk_raw",         "2 large",   "34.0", "", "", "sauce", "", "", ""],
        ["SAUCE_009", "2", "lemon_juice_raw",       "1 tbsp",    "15.25","", "", "sauce", "", "", ""],
        ["SAUCE_009", "3", "grapeseed_oil",         "1 cup",    "218.0", "", "", "sauce", "", "", ""],
        ["SAUCE_009", "4", "salt_table",            "½ tsp",     "3.0",  "", "", "sauce", "", "", ""],
        ["SAUCE_009", "5", "white_pepper_ground",   "pinch",     "0.3",  "", "", "sauce", "", "", ""],
    ]
    with open(ingredients_path, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print("Added SAUCE_009 to recipe_ingredients.csv (5 rows)")
else:
    print("SAUCE_009 already in recipe_ingredients.csv")

# ---------------------------------------------------------------------------
# 5. Append to recipe_instructions.csv
# ---------------------------------------------------------------------------
instructions_path = f"{BASE}/recipe_instructions.csv"
with open(instructions_path, "r", newline="") as f:
    existing_inst = [(r[0], r[1]) for r in csv.reader(f) if r[0] == RECIPE_ID]

if not existing_inst:
    steps = [
        (1, "In a small heatproof bowl, whisk together the egg yolks and lemon juice until smooth and combined."),
        (2, "Set the bowl over a saucepan of barely simmering water, ensuring the bottom of the bowl does not touch the water."),
        (3, "Whisk constantly over gentle heat until the yolk mixture thickens, turns pale yellow, and reaches 160°F (71°C), about 3–4 minutes. When the whisk is lifted, the mixture should ribbon and hold a trail briefly."),
        (4, "Remove from heat and continue whisking for 1 minute to cool slightly."),
        (5, "Begin adding the grapeseed oil one drop at a time, whisking constantly to establish the emulsion."),
        (6, "Once the mayonnaise begins to thicken and hold its shape, add the remaining oil in a thin, steady stream, whisking continuously."),
        (7, "Season with salt and white pepper. Taste and adjust seasoning."),
        (8, "Transfer to a jar and refrigerate immediately. Use within 5 days."),
    ]
    rows = [
        ["SAUCE_009", str(step), text, ""]
        for step, text in steps
    ]
    with open(instructions_path, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print(f"Added SAUCE_009 to recipe_instructions.csv ({len(steps)} steps)")
else:
    print("SAUCE_009 already in recipe_instructions.csv")

print("\nDone. Total raw: 34.0 + 15.25 + 218.0 + 3.0 + 0.3 = 270.55g")
print("yfw=1.00 → 270.55g cooked | 18 servings × 15g (1 tbsp)")
