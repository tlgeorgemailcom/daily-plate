#!/usr/bin/env python3
"""
Group 7: resolve final 9 gaps from the full cocktail ingredient list.
  • 1 new food-portions entry  (NDB 14037 — plain vodka)
  • 9 new ledger rows (all aliases, zero new NDB inserts, zero Turso writes)
"""

import csv, os

ROOT = "/Volumes/training/Daily Food Chain/daily-food-chain"
BASE = f"{ROOT}/recipes_v3/data"

LEDGER = f"{BASE}/ingredients_ledger.csv"

# ── new ledger rows ───────────────────────────────────────────────────────────
# (ordered: food-portions row first so vodka fp entry exists before ledger write)
LEDGER_ROWS = [
    dict(key="vodka",               ndb="14037", fw="VODKA",             long_desc="Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", display="Vodka",                  notes=""),
    dict(key="smirnoff_vodka",      ndb="14037", fw="VODKA",             long_desc="Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", display="Smirnoff Vodka",          notes="alias"),
    dict(key="red_wine",            ndb="14096", fw="WINERED",           long_desc="Alcoholic beverage, wine, table, red",                                   display="Red Wine",                notes="alias"),
    dict(key="port_wine",           ndb="14057", fw="WINEDESSERTSWEET",  long_desc="Alcoholic beverage, wine, dessert, sweet",                               display="Red Tawny Port Wine",     notes="alias"),
    dict(key="creme_de_cacao_brown",ndb="14715", fw="CREMEDECACAO",      long_desc="Alcoholic beverage, liqueur, creme de cacao, 50 proof",                  display="Crème de Cacao (Brown)",  notes="alias"),
    dict(key="maraschino",          ndb="14702", fw="MARASCHINOLIQUER",  long_desc="Alcoholic beverage, liqueur, maraschino cherry, 64 proof",               display="Maraschino Liqueur",      notes="alias"),
    dict(key="creme_de_mure",       ndb="14713", fw="BLACKBERRYLIQUEUR", long_desc="Alcoholic beverage, liqueur, blackberry, creme de mure, 36 proof",       display="Crème de Mûre",           notes="alias"),
    dict(key="orgeat_syrup",        ndb="14718", fw="ORGEAT",            long_desc="Beverage, syrup, orgeat, almond, non-alcoholic",                         display="Orgeat Syrup",            notes="alias"),
    dict(key="passion_fruit_liqueur",ndb="14730",fw="PASSOA",            long_desc="Alcoholic beverage, liqueur, passoa, passion fruit, 34 proof",           display="Passion Fruit Liqueur",   notes="alias"),
]

# ── 1. food-portions entry for NDB 14037 (vodka) — all 3 copies ──────────────
print("=== 1. food-portions NDB 14037 (Vodka) ===")

VODKA_FP = dict(
    word="VODKA", display="Vodka",
    group1="beverage", group2="cocktail",
    ndb="14037",
    usda_desc="Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof",
    E=231, P=0, F=0, C=0, Fi=0, W=66.6, Su=0,
    # M0=100g, M1=1 fl oz (30g), M2=1.5 fl oz (45g)
    M0_Amt=1.0, M0_Desc="custom (g)", M0_Gm=100.0,
    M1_Amt=1.0, M1_Desc="fl oz",      M1_Gm=30.0,
    M2_Amt=1.5, M2_Desc="fl oz",      M2_Gm=45.0,
)

def fp_row_55(v):
    return [
        v["word"], v["display"], v["group1"], v["group2"], "", "", "",
        v["ndb"], v["usda_desc"],
        v["E"], v["P"], v["F"], v["C"], v["Fi"], v["W"], v["Su"],
        v["M0_Amt"], v["M0_Desc"], v["M0_Gm"],
        v["M1_Amt"], v["M1_Desc"], v["M1_Gm"],
        v["M2_Amt"], v["M2_Desc"], v["M2_Gm"],
        "", "", "",  # M3
        "", "", "",  # M4
        "", "", "",  # M5
        "", "", "",  # M6
        "", "", "",  # M7
        "", "", "",  # M8
        "", "", "",  # M9
        "", "", "",  # M10
        "", "", "",  # M11
        "", "", "",  # M12
    ]

def fp_row_56(v):
    r = fp_row_55(v)
    r.insert(2, "")  # synonyms at index 2
    return r

FP_FILES = [
    (f"{ROOT}/food-portions-complete.csv",              fp_row_55),
    (f"{ROOT}/docs/food-portions-complete.csv",         fp_row_55),
    (f"{ROOT}/src/lib/data/food-portions-complete.csv", fp_row_56),
]

# Check not already present before appending
with open(f"{ROOT}/food-portions-complete.csv") as f:
    existing_ndbs = {row[7] for row in csv.reader(f)}

if "14037" in existing_ndbs:
    print("  NDB 14037 already in food-portions — skipping")
else:
    for path, row_fn in FP_FILES:
        with open(path, "a", newline="") as fh:
            csv.writer(fh).writerow(row_fn(VODKA_FP))
        print(f"  appended VODKA row → {path.replace(ROOT+'/','')}")

# ── 2. Ledger rows ────────────────────────────────────────────────────────────
print("\n=== 2. Ledger ===")

# Read existing keys to avoid duplication
with open(LEDGER) as fh:
    existing_keys = {r["ingredient_key"] for r in csv.DictReader(fh)}
    fh.seek(0)
    fieldnames = csv.DictReader(fh).fieldnames

with open(LEDGER, "a", newline="") as fh:
    writer = csv.DictWriter(fh, fieldnames=fieldnames)
    for row in LEDGER_ROWS:
        if row["key"] in existing_keys:
            print(f"  SKIP (already exists): {row['key']}")
            continue
        writer.writerow({
            "ingredient_key":       row["key"],
            "ndb_no":               row["ndb"],
            "food_word":            row["fw"],
            "default_long_desc":    row["long_desc"],
            "default_display_name": row["display"],
            "common_unit":          "ml",
            "common_unit_grams":    "1",
            "notes":                row["notes"],
        })
        print(f"  ledger: {row['key']} → NDB {row['ndb']}")

print("\nDone. Run validate_ledger.py and convert_to_ts.py next.")
