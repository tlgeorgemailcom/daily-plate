#!/usr/bin/env python3
"""
Group 8: Fix all 12 alias ledger entries by giving each its own NDB row.

For each of the 12 keys that were aliased in Groups 6 & 7, this script:
  1. Inserts a new NDB row into comboo.db (local)
  2. Syncs to Turso SR28
  3. Updates the existing ledger row in-place (ndb_no, food_word, default_long_desc, notes)
  4. Appends new food-portions rows (all 3 copies)

NDB range: 14783–14794
"""

import csv, os, re, sqlite3

ROOT   = "/Volumes/training/Daily Food Chain/daily-food-chain"
BASE   = f"{ROOT}/recipes_v3/data"
COMBOO = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"

# ── read .env.local ────────────────────────────────────────────────────────────
env = {}
with open(f"{ROOT}/.env.local") as fh:
    for line in fh:
        m = re.match(r'^(TURSO_\w+)=(.+)', line.strip())
        if m:
            env[m.group(1)] = m.group(2)

TURSO_URL   = env["TURSO_SR28_URL"]
TURSO_TOKEN = env["TURSO_SR28_TOKEN"]

# ── query old alias NDBs for their nutrient values (Group B copy-over) ─────────
conn_q = sqlite3.connect(COMBOO)
conn_q.row_factory = sqlite3.Row

def fetch_nutrients(ndb):
    r = conn_q.execute("""
        SELECT Energy_KCal, Energy_KJ, Protein, TotalLipidFat, Carbohydrate,
               FiberTotalDietary, SugarsTotal, AlcholEthyl, Water, Ash
        FROM DataCentralCombo WHERE NDB_NO=?
    """, (ndb,)).fetchone()
    if not r:
        raise ValueError(f"NDB {ndb} not found in comboo.db")
    return dict(r)

old = {
    "14702": fetch_nutrients("14702"),   # maraschino
    "14713": fetch_nutrients("14713"),   # creme_de_mure
    "14718": fetch_nutrients("14718"),   # orgeat_syrup
    "14730": fetch_nutrients("14730"),   # passion_fruit_liqueur
    "14096": fetch_nutrients("14096"),   # red_wine (USDA NDB)
}
conn_q.close()

def n(ndb):
    """Shorthand to get nutrient dict for an old alias NDB."""
    return old[ndb]

# ── new NDB definitions ────────────────────────────────────────────────────────
# spirits M-series: 1 fl oz (30g), 1.5 fl oz (45g), 2 fl oz (60g)
# liqueur M-series: same
# syrup/puree M-series: 1 fl oz (30g), 2 fl oz (60g), 4 fl oz (120g)

NEW_NDBS = [
    # ── Group A: genuinely broken for search ──────────────────────────────────
    dict(
        ndb="14783",
        long_desc="Alcoholic beverage, liqueur, raspberry, 34 proof",
        fdgrp="1400",
        E=205, EJ=858, P=0, F=0, C=29.5, Fi=0, Su=29.5, Alc=12.4, W=57.6, Ash=0.5,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="RASPBERRYLIQUEUR", display="Raspberry Liqueur",
        key="raspberry_liqueur",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14784",
        long_desc="Alcoholic beverage, distilled, mezcal, espadin agave, 80 proof",
        fdgrp="1400",
        E=231, EJ=967, P=0, F=0, C=0, Fi=0, Su=0, Alc=33.4, W=66.6, Ash=0,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="ESPADINMEZCAL", display="Espadin Mezcal",
        key="espadin_mezcal",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14785",
        long_desc="Alcoholic beverage, wine, sherry, palo cortado, dry, 40 proof",
        fdgrp="1400",
        E=138, EJ=577, P=0.2, F=0, C=5.5, Fi=0, Su=3.5, Alc=15.8, W=78.7, Ash=0.3,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="PALOCORTADO", display="Palo Cortado Sherry",
        key="palo_cortado",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14786",
        long_desc="Alcoholic beverage, distilled, rhum, Martinique, molasses, 80 proof",
        fdgrp="1400",
        E=231, EJ=967, P=0, F=0, C=0, Fi=0, Su=0, Alc=33.4, W=66.6, Ash=0,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="MARTINIQUERHUM", display="Martinique Molasses Rhum",
        key="martinique_molasses_rhum",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14787",
        long_desc="Alcoholic beverage, vodka, Smirnoff, 80 proof",
        fdgrp="1400",
        E=231, EJ=967, P=0, F=0, C=0, Fi=0, Su=0, Alc=33.4, W=66.6, Ash=0,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="VODKASMIRNOFF", display="Smirnoff Vodka",
        key="smirnoff_vodka",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14788",
        long_desc="Alcoholic beverage, wine, port, tawny, red, 20 proof",
        fdgrp="1400",
        E=160, EJ=669, P=0.2, F=0, C=13.7, Fi=0, Su=7.8, Alc=15.3, W=70.5, Ash=0.3,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="PORTWINE", display="Tawny Port Wine",
        key="port_wine",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14789",
        long_desc="Alcoholic beverage, liqueur, creme de cacao, brown, 50 proof",
        fdgrp="1400",
        E=286, EJ=1197, P=0, F=0.2, C=39.3, Fi=0, Su=39.3, Alc=18.4, W=41.8, Ash=0.3,
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="CREMEDECACAOBROWN", display="Crème de Cacao (Brown)",
        key="creme_de_cacao_brown",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    # ── Group B: copy nutrition from old alias NDB ─────────────────────────────
    dict(
        ndb="14790",
        long_desc="Alcoholic beverage, liqueur, maraschino, Luxardo, cherry, 64 proof",
        fdgrp="1400",
        E=n("14702")["Energy_KCal"], EJ=n("14702")["Energy_KJ"],
        P=n("14702")["Protein"], F=n("14702")["TotalLipidFat"],
        C=n("14702")["Carbohydrate"], Fi=n("14702")["FiberTotalDietary"],
        Su=n("14702")["SugarsTotal"], Alc=n("14702")["AlcholEthyl"],
        W=n("14702")["Water"], Ash=n("14702")["Ash"],
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="MARASCHINO", display="Maraschino Liqueur",
        key="maraschino",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14791",
        long_desc="Alcoholic beverage, liqueur, blackberry, creme de mure, 36 proof",
        fdgrp="1400",
        E=n("14713")["Energy_KCal"], EJ=n("14713")["Energy_KJ"],
        P=n("14713")["Protein"], F=n("14713")["TotalLipidFat"],
        C=n("14713")["Carbohydrate"], Fi=n("14713")["FiberTotalDietary"],
        Su=n("14713")["SugarsTotal"], Alc=n("14713")["AlcholEthyl"],
        W=n("14713")["Water"], Ash=n("14713")["Ash"],
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="CREMEDMURE", display="Crème de Mûre",
        key="creme_de_mure",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14792",
        long_desc="Beverage, syrup, orgeat, almond syrup, non-alcoholic",
        fdgrp="1400",
        E=n("14718")["Energy_KCal"], EJ=n("14718")["Energy_KJ"],
        P=n("14718")["Protein"], F=n("14718")["TotalLipidFat"],
        C=n("14718")["Carbohydrate"], Fi=n("14718")["FiberTotalDietary"],
        Su=n("14718")["SugarsTotal"], Alc=n("14718")["AlcholEthyl"],
        W=n("14718")["Water"], Ash=n("14718")["Ash"],
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="2 fl oz",   M2_desc="2 fl oz",  M2_gm=60,
        M3_seq=3, M3_amt="4 fl oz",   M3_desc="4 fl oz",  M3_gm=120,
        food_word="ORGEATYRUP", display="Orgeat Syrup",
        key="orgeat_syrup",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14793",
        long_desc="Alcoholic beverage, liqueur, passoa, passion fruit, 34 proof",
        fdgrp="1400",
        E=n("14730")["Energy_KCal"], EJ=n("14730")["Energy_KJ"],
        P=n("14730")["Protein"], F=n("14730")["TotalLipidFat"],
        C=n("14730")["Carbohydrate"], Fi=n("14730")["FiberTotalDietary"],
        Su=n("14730")["SugarsTotal"], Alc=n("14730")["AlcholEthyl"],
        W=n("14730")["Water"], Ash=n("14730")["Ash"],
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="1.5 fl oz", M2_desc="1.5 fl oz", M2_gm=45,
        M3_seq=3, M3_amt="2 fl oz",   M3_desc="2 fl oz",   M3_gm=60,
        food_word="PASSIONFRUITLEUR", display="Passion Fruit Liqueur",
        key="passion_fruit_liqueur",
        fp_group1="beverage", fp_group2="cocktail",
    ),
    dict(
        ndb="14794",
        long_desc="Alcoholic beverage, wine, table, red, dry",
        fdgrp="1400",
        E=n("14096")["Energy_KCal"], EJ=n("14096")["Energy_KJ"],
        P=n("14096")["Protein"], F=n("14096")["TotalLipidFat"],
        C=n("14096")["Carbohydrate"], Fi=n("14096")["FiberTotalDietary"],
        Su=n("14096")["SugarsTotal"], Alc=n("14096")["AlcholEthyl"],
        W=n("14096")["Water"], Ash=n("14096")["Ash"],
        M1_seq=1, M1_amt="1 fl oz",   M1_desc="1 fl oz",  M1_gm=30,
        M2_seq=2, M2_amt="3 fl oz",   M2_desc="3 fl oz",  M2_gm=90,
        M3_seq=3, M3_amt="5 fl oz",   M3_desc="5 fl oz (1 glass)", M3_gm=150,
        food_word="REDWINE", display="Red Wine",
        key="red_wine",
        fp_group1="beverage", fp_group2="cocktail",
    ),
]

# ── SQL INSERT ─────────────────────────────────────────────────────────────────
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

def sql_params(nd):
    return (
        nd["ndb"], nd["long_desc"], nd["fdgrp"],
        nd["E"], nd["EJ"], nd["P"], nd["F"], nd["C"], nd["Fi"], nd["Su"],
        nd["Alc"], nd["W"], nd["Ash"],
        nd["M1_seq"], nd["M1_amt"], nd["M1_desc"], nd["M1_gm"],
        nd["M2_seq"], nd["M2_amt"], nd["M2_desc"], nd["M2_gm"],
        nd["M3_seq"], nd["M3_amt"], nd["M3_desc"], nd["M3_gm"],
    )

# ── 1. Local comboo.db ─────────────────────────────────────────────────────────
print("=== 1. Local comboo.db ===")
conn = sqlite3.connect(COMBOO)
cur = conn.cursor()
for nd in NEW_NDBS:
    cur.execute(SQL, sql_params(nd))
    print(f"  NDB {nd['ndb']}  {nd['long_desc'][:55]}  → rowcount={cur.rowcount}")
conn.commit()
conn.close()

# ── 2. Turso SR28 ──────────────────────────────────────────────────────────────
print("\n=== 2. Turso SR28 ===")
import libsql_experimental as libsql
tconn = libsql.connect("comboo_g8.db", sync_url=TURSO_URL, auth_token=TURSO_TOKEN)
tconn.sync()
for nd in NEW_NDBS:
    tconn.execute(SQL, sql_params(nd))
    chg = tconn.execute("SELECT changes()").fetchone()[0]
    print(f"  NDB {nd['ndb']}  {nd['long_desc'][:45]}  → changes={chg}")
tconn.commit()
tconn.close()
os.remove("comboo_g8.db")
print("  Turso done, sidecar cleaned")

# ── 3. Ledger CSV — update in-place ───────────────────────────────────────────
print("\n=== 3. Ledger (update in-place) ===")
LEDGER = f"{BASE}/ingredients_ledger.csv"

# Build lookup: key → (new_ndb, new_food_word, new_long_desc)
UPDATES = {nd["key"]: (nd["ndb"], nd["food_word"], nd["long_desc"]) for nd in NEW_NDBS}

with open(LEDGER, newline="") as fh:
    reader = csv.DictReader(fh)
    fieldnames = reader.fieldnames
    rows = list(reader)

updated = 0
for row in rows:
    if row["ingredient_key"] in UPDATES:
        new_ndb, new_fw, new_desc = UPDATES[row["ingredient_key"]]
        row["ndb_no"]           = new_ndb
        row["food_word"]        = new_fw
        row["default_long_desc"] = new_desc
        row["notes"]            = ""   # clear "alias" tag
        print(f"  updated {row['ingredient_key']}  ndb={new_ndb}  fw={new_fw}")
        updated += 1

with open(LEDGER, "w", newline="") as fh:
    writer = csv.DictWriter(fh, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"  {updated} rows updated, {len(rows)} total rows written")

# ── 4. food-portions-complete.csv (all 3 copies) ──────────────────────────────
print("\n=== 4. food-portions-complete.csv ===")

def fp_row_55(nd):
    """55-col row for root/ and docs/ copies."""
    return [
        nd["food_word"],          # 0  word
        nd["display"],            # 1  display
        nd["fp_group1"],          # 2  group1
        nd["fp_group2"],          # 3  group2
        "",                       # 4  group3
        "",                       # 5  group4
        "",                       # 6  has_recipe
        nd["ndb"],                # 7  NDB_NO
        nd["long_desc"],          # 8  usda_desc
        nd["E"],                  # 9  cal_100g
        nd["P"],                  # 10 pro_100g
        nd["F"],                  # 11 fat_100g
        nd["C"],                  # 12 carb_100g
        nd["Fi"],                 # 13 fib_100g
        nd["W"],                  # 14 h2o_100g
        nd["Su"],                 # 15 sug_100g
        "1.0",                    # 16 M0_Amt
        "custom (g)",             # 17 M0_Desc
        "100.0",                  # 18 M0_Gm
        nd["M1_amt"],             # 19 M1_Amt
        nd["M1_desc"],            # 20 M1_Desc
        float(nd["M1_gm"]),       # 21 M1_Gm
        nd["M2_amt"],             # 22 M2_Amt
        nd["M2_desc"],            # 23 M2_Desc
        float(nd["M2_gm"]),       # 24 M2_Gm
        nd["M3_amt"],             # 25 M3_Amt
        nd["M3_desc"],            # 26 M3_Desc
        float(nd["M3_gm"]),       # 27 M3_Gm
        "", "", "",               # 28-30 M4
        "", "", "",               # 31-33 M5
        "", "", "",               # 34-36 M6
        "", "", "",               # 37-39 M7
        "", "", "",               # 40-42 M8
        "", "", "",               # 43-45 M9
        "", "", "",               # 46-48 M10
        "", "", "",               # 49-51 M11
        "", "", "",               # 52-54 M12
    ]

def fp_row_56(nd):
    """56-col row for src/lib/data copy (synonyms col at index 2)."""
    r = fp_row_55(nd)
    r.insert(2, "")  # synonyms
    return r

FP_FILES = [
    (f"{ROOT}/food-portions-complete.csv",              fp_row_55),
    (f"{ROOT}/docs/food-portions-complete.csv",         fp_row_55),
    (f"{ROOT}/src/lib/data/food-portions-complete.csv", fp_row_56),
]

for path, row_fn in FP_FILES:
    with open(path, "a", newline="") as fh:
        w = csv.writer(fh)
        for nd in NEW_NDBS:
            w.writerow(row_fn(nd))
    short = path.replace(ROOT + "/", "")
    print(f"  appended {len(NEW_NDBS)} rows → {short}")

# ── 5. Verify local comboo.db has all 12 ──────────────────────────────────────
print("\n=== 5. Verify ===")
conn = sqlite3.connect(COMBOO)
for nd in NEW_NDBS:
    row = conn.execute(
        "SELECT NDB_NO, Long_Desc FROM DataCentralCombo WHERE NDB_NO=?", (nd["ndb"],)
    ).fetchone()
    if row:
        print(f"  ✅ {row[0]}  {row[1][:55]}")
    else:
        print(f"  ❌ {nd['ndb']} MISSING from comboo.db!")
conn.close()

print("\nAll done. Run convert_to_ts.py and validate_ledger.py next.")
