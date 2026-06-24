#!/usr/bin/env python3
"""
Group 6: resolve the 7 remaining missing cocktail ingredients.
  • 3 new NDBs  → comboo.db + Turso + ledger + food-portions (all 3 copies)
  • 4 aliases   → ledger-only (NDB already exists)
"""

import csv, os, re, sqlite3

ROOT   = "/Volumes/training/Daily Food Chain/daily-food-chain"
BASE   = f"{ROOT}/recipes_v3/data"
COMBOO = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"

# ── read .env.local ───────────────────────────────────────────────────────────
env = {}
with open(f"{ROOT}/.env.local") as fh:
    for line in fh:
        m = re.match(r'^(TURSO_\w+)=(.+)', line.strip())
        if m:
            env[m.group(1)] = m.group(2)

TURSO_URL   = env["TURSO_SR28_URL"]
TURSO_TOKEN = env["TURSO_SR28_TOKEN"]

# ── new NDB definitions ───────────────────────────────────────────────────────
# M0 is always 100g reference; M1/M2 are 1 fl oz / 1.5 fl oz for spirits
NEW_NDBS = [
    dict(
        ndb="14779", long_desc="Gin, Old Tom, 80 proof", fdgrp="1400",
        E=251, EJ=round(251*4.184), P=0, F=0, C=5.0, Fi=0, Su=5.0,
        Alc=33.4, W=61.6, Ash=0,
        M1_seq=1, M1_amt="1 fl oz", M1_desc="1 jigger", M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 oz",  M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",  M3_desc="2 oz",     M3_gm=60,
        food_word="OLDTOMGIN", display="Old Tom Gin",
        key="old_tom_gin",
        fp_group1="beverage", fp_group2="cocktail",
        fp_M0_desc="custom (g)",
        fp_M1_amt=1.0, fp_M1_desc="fl oz",       fp_M1_gm=30.0,
        fp_M2_amt=1.5, fp_M2_desc="fl oz",       fp_M2_gm=45.0,
    ),
    dict(
        ndb="14780", long_desc="Rum, blackstrap, 80 proof", fdgrp="1400",
        E=235, EJ=round(235*4.184), P=0, F=0, C=0.5, Fi=0, Su=0.5,
        Alc=33.4, W=66.1, Ash=0,
        M1_seq=1, M1_amt="1 fl oz", M1_desc="1 jigger", M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 oz",  M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",  M3_desc="2 oz",     M3_gm=60,
        food_word="BLACKSTRAPRUM", display="Blackstrap Rum",
        key="blackstrap_rum",
        fp_group1="beverage", fp_group2="cocktail",
        fp_M0_desc="custom (g)",
        fp_M1_amt=1.0, fp_M1_desc="fl oz",       fp_M1_gm=30.0,
        fp_M2_amt=1.5, fp_M2_desc="fl oz",       fp_M2_gm=45.0,
    ),
    dict(
        ndb="14781", long_desc="Passion fruit, puree, unsweetened", fdgrp="0900",
        E=60, EJ=round(60*4.184), P=0.7, F=0.3, C=13.0, Fi=2.0, Su=10.5,
        Alc=0, W=85.0, Ash=0.5,
        M1_seq=1, M1_amt="1 fl oz", M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="2 fl oz", M2_desc="2 fl oz",  M2_gm=60,
        M3_seq=3, M3_amt="4 fl oz", M3_desc="4 fl oz",  M3_gm=120,
        food_word="PASSIONFRUITPUREE", display="Passion Fruit Puree",
        key="passion_fruit_puree",
        fp_group1="fruit", fp_group2="cocktail",
        fp_M0_desc="custom (g)",
        fp_M1_amt=1.0, fp_M1_desc="fl oz",  fp_M1_gm=30.0,
        fp_M2_amt=2.0, fp_M2_desc="fl oz",  fp_M2_gm=60.0,
    ),
]

# ── alias definitions (ledger-only, NDB already in comboo.db) ─────────────────
ALIASES = [
    dict(key="raspberry_liqueur",        ndb="14724", food_word="CHAMBORD",
         long_desc="Chambord, black raspberry liqueur", display="Raspberry Liqueur"),
    dict(key="espadin_mezcal",           ndb="14742", food_word="MEZCAL",
         long_desc="Mezcal, Espadin",                  display="Espadin Mezcal"),
    dict(key="palo_cortado",             ndb="14772", food_word="AMONTILLADO",
         long_desc="Sherry, Palo Cortado, dry",        display="Palo Cortado Sherry"),
    dict(key="martinique_molasses_rhum", ndb="14748", food_word="DARKRUM",
         long_desc="Rum, Martinique molasses",         display="Martinique Molasses Rhum"),
]

SQL = """
INSERT OR IGNORE INTO DataCentralCombo (
  NDB_NO, Long_Desc, FdGrp_Cd,
  Energy_KCal, Energy_KJ, Protein, TotalLipidFat, Carbohydrate, FiberTotalDietary, SugarsTotal,
  AlcholEthyl, Water, Ash,
  M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt,
  M2_Seq, M2_Amt, M2_Desc, M2_Gm_Wgt,
  M3_Seq, M3_Amt, M3_Desc, M3_Gm_Wgt,
  fat
) VALUES (?,?,?, ?,?,?,?,?,?,?, ?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, 'n')
"""

def sql_params(n):
    return (
        n["ndb"], n["long_desc"], n["fdgrp"],
        n["E"], n["EJ"], n["P"], n["F"], n["C"], n["Fi"], n["Su"],
        n["Alc"], n["W"], n["Ash"],
        n["M1_seq"], n["M1_amt"], n["M1_desc"], n["M1_gm"],
        n["M2_seq"], n["M2_amt"], n["M2_desc"], n["M2_gm"],
        n["M3_seq"], n["M3_amt"], n["M3_desc"], n["M3_gm"],
    )

# ── 1. local comboo.db ─────────────────────────────────────────────────────────
print("=== 1. Local comboo.db ===")
conn = sqlite3.connect(COMBOO)
cur = conn.cursor()
for n in NEW_NDBS:
    cur.execute(SQL, sql_params(n))
    print(f"  NDB {n['ndb']} {n['long_desc'][:40]} → rowcount={cur.rowcount}")
conn.commit()
conn.close()

# ── 2. Turso sync ─────────────────────────────────────────────────────────────
print("\n=== 2. Turso SR28 ===")
import libsql_experimental as libsql
tconn = libsql.connect("comboo_g6.db", sync_url=TURSO_URL, auth_token=TURSO_TOKEN)
tconn.sync()
for n in NEW_NDBS:
    tconn.execute(SQL, sql_params(n))
    chg = tconn.execute("SELECT changes()").fetchone()[0]
    print(f"  NDB {n['ndb']} → changes={chg}")
tconn.commit()
tconn.close()
os.remove("comboo_g6.db")
print("  Turso done, sidecar cleaned")

# ── 3. Ledger CSV ─────────────────────────────────────────────────────────────
print("\n=== 3. Ledger ===")
LEDGER = f"{BASE}/ingredients_ledger.csv"
with open(LEDGER) as fh:
    fieldnames = csv.DictReader(fh).fieldnames

rows_to_add = []
# new NDBs first
for n in NEW_NDBS:
    rows_to_add.append({
        "ingredient_key":      n["key"],
        "ndb_no":              n["ndb"],
        "food_word":           n["food_word"],
        "default_long_desc":   n["long_desc"],
        "default_display_name":n["display"],
        "common_unit":         "ml",
        "common_unit_grams":   "1",
        "notes":               "",
    })
# aliases
for a in ALIASES:
    rows_to_add.append({
        "ingredient_key":      a["key"],
        "ndb_no":              a["ndb"],
        "food_word":           a["food_word"],
        "default_long_desc":   a["long_desc"],
        "default_display_name":a["display"],
        "common_unit":         "ml",
        "common_unit_grams":   "1",
        "notes":               "alias",
    })

with open(LEDGER, "a", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=fieldnames)
    for row in rows_to_add:
        w.writerow(row)
        print(f"  ledger: {row['ingredient_key']}")

# ── 4. food-portions-complete.csv (all 3 copies) ──────────────────────────────
print("\n=== 4. food-portions-complete.csv ===")

def fp_row_55(n):
    """Build a 55-col food-portions row for root/docs copies."""
    return [
        n["food_word"],          # 0 word
        n["display"],            # 1 display
        n["fp_group1"],          # 2 group1
        n["fp_group2"],          # 3 group2
        "",                      # 4 group3
        "",                      # 5 group4
        "",                      # 6 has_recipe
        n["ndb"],                # 7 NDB_NO
        n["long_desc"],          # 8 usda_desc
        n["E"],                  # 9 cal_100g
        n["P"],                  # 10 pro_100g
        n["F"],                  # 11 fat_100g
        n["C"],                  # 12 carb_100g
        n["Fi"],                 # 13 fib_100g
        n["W"],                  # 14 h2o_100g
        n["Su"],                 # 15 sug_100g
        "1.0",                   # 16 M0_Amt
        n["fp_M0_desc"],         # 17 M0_Desc
        "100.0",                 # 18 M0_Gm
        n["fp_M1_amt"],          # 19 M1_Amt
        n["fp_M1_desc"],         # 20 M1_Desc
        n["fp_M1_gm"],           # 21 M1_Gm
        n["fp_M2_amt"],          # 22 M2_Amt
        n["fp_M2_desc"],         # 23 M2_Desc
        n["fp_M2_gm"],           # 24 M2_Gm
        "", "", "",              # 25-27 M3
        "", "", "",              # 28-30 M4
        "", "", "",              # 31-33 M5
        "", "", "",              # 34-36 M6
        "", "", "",              # 37-39 M7
        "", "", "",              # 40-42 M8
        "", "", "",              # 43-45 M9
        "", "", "",              # 46-48 M10
        "", "", "",              # 49-51 M11
        "", "", "",              # 52-54 M12
    ]

def fp_row_56(n):
    """Build a 56-col food-portions row for src/lib/data copy (synonyms at index 2)."""
    r = fp_row_55(n)
    r.insert(2, "")  # synonyms column at index 2
    return r

FP_FILES = [
    (f"{ROOT}/food-portions-complete.csv",          fp_row_55),
    (f"{ROOT}/docs/food-portions-complete.csv",     fp_row_55),
    (f"{ROOT}/src/lib/data/food-portions-complete.csv", fp_row_56),
]

for path, row_fn in FP_FILES:
    with open(path, "a", newline="") as fh:
        w = csv.writer(fh)
        for n in NEW_NDBS:
            row = row_fn(n)
            w.writerow(row)
    print(f"  appended {len(NEW_NDBS)} rows → {path.replace(ROOT+'/', '')}")

print("\nAll done. Run validate_ledger.py next.")
