"""
Insert sloe gin (NDB 14812) into:
  1. local comboo.db
  2. Turso comboo DB (TURSO_SR28_URL / TURSO_SR28_TOKEN)
  3. ingredients_ledger.csv
  4. all three food-portions-complete.csv files
"""
import csv
import os
import sqlite3
import sys
from pathlib import Path

# ── Nutrition values for sloe gin 26% ABV / 52 proof ─────────────────────────
# Plymouth/Hayman's label: ~29g sugar/100mL; density ~1.020 g/mL
# Per 100g: AlcEthyl=20.1, Carb=28.4, Sugar=28.4, Water=51.5, Energy=254 kcal
NDB_NO      = 14812
LONG_DESC   = "Alcoholic beverage, liqueur, sloe gin, 52 proof"
FD_GRP      = "1400"
ENERGY_KCAL = 254.0
ENERGY_KJ   = 1063.0
PROTEIN     = 0.0
FAT         = 0.0
CARB        = 28.4
SUGAR       = 28.4
FIBER       = 0.0
ALCOHOL     = 20.1
WATER       = 51.5
# M1: 1 fl oz = 29.574 mL × 1.020 = 30.17 → 30.2g
M1_AMT, M1_DESC, M1_GM = 1.0, "fl oz", 30.2
# M2: 1 tbsp = 14.787 mL × 1.020 = 15.1g
M2_AMT, M2_DESC, M2_GM = 1.0, "tbsp", 15.1

BASE = Path("recipes_v3/data")

# ── 1. Insert into local comboo.db ────────────────────────────────────────────
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
conn_local = sqlite3.connect(DB_PATH)
c = conn_local.cursor()

# Check not already present
c.execute("SELECT NDB_No FROM DataCentralCombo WHERE NDB_No = ?", (str(NDB_NO),))
if c.fetchone():
    print(f"NDB {NDB_NO} already in local comboo.db — skipping local insert")
else:
    c.execute("""
        INSERT INTO DataCentralCombo (
            NDB_NO, FdGrp_Cd, Long_Desc,
            Protein, TotalLipidFat, Carbohydrate, SugarsTotal,
            FiberTotalDietary, Energy_KCal, Energy_KJ,
            AlcholEthyl, Water,
            fat,
            M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt,
            M2_Seq, M2_Amt, M2_Desc, M2_Gm_Wgt
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        str(NDB_NO), FD_GRP, LONG_DESC,
        PROTEIN, FAT, CARB, SUGAR,
        FIBER, ENERGY_KCAL, ENERGY_KJ,
        ALCOHOL, WATER,
        "n",
        1, M1_AMT, M1_DESC, M1_GM,
        2, M2_AMT, M2_DESC, M2_GM,
    ))
    conn_local.commit()
    print(f"✓ Inserted NDB {NDB_NO} into local comboo.db")
conn_local.close()

# ── 2. Insert into Turso comboo DB ────────────────────────────────────────────
def load_env(path=".env.local"):
    env = {}
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    env[k.strip()] = v.strip()
    except FileNotFoundError:
        pass
    return env

env = load_env()
sr28_url   = env.get("TURSO_SR28_URL")   or os.environ.get("TURSO_SR28_URL")
sr28_token = env.get("TURSO_SR28_TOKEN") or os.environ.get("TURSO_SR28_TOKEN")

if not sr28_url or not sr28_token:
    sys.exit("ERROR: TURSO_SR28_URL / TURSO_SR28_TOKEN not found in .env.local")

try:
    import libsql_experimental as libsql
except ImportError:
    sys.exit("ERROR: pip install libsql-experimental")

conn_turso = libsql.connect(database=sr28_url, auth_token=sr28_token)
# Check if already present
rows = conn_turso.execute(
    "SELECT NDB_No FROM DataCentralCombo WHERE NDB_No = ?", (str(NDB_NO),)
).fetchall()
if rows:
    print(f"NDB {NDB_NO} already in Turso comboo DB — skipping Turso insert")
else:
    conn_turso.execute("""
        INSERT INTO DataCentralCombo (
            NDB_NO, FdGrp_Cd, Long_Desc,
            Protein, TotalLipidFat, Carbohydrate, SugarsTotal,
            FiberTotalDietary, Energy_KCal, Energy_KJ,
            AlcholEthyl, Water,
            fat,
            M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt,
            M2_Seq, M2_Amt, M2_Desc, M2_Gm_Wgt
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        str(NDB_NO), FD_GRP, LONG_DESC,
        PROTEIN, FAT, CARB, SUGAR,
        FIBER, ENERGY_KCAL, ENERGY_KJ,
        ALCOHOL, WATER,
        "n",
        1, M1_AMT, M1_DESC, M1_GM,
        2, M2_AMT, M2_DESC, M2_GM,
    ))
    conn_turso.commit()
    print(f"✓ Inserted NDB {NDB_NO} into Turso comboo DB")

# ── 3. Add to ingredients_ledger.csv ─────────────────────────────────────────
LEDGER = BASE / "ingredients_ledger.csv"
with open(LEDGER, newline="") as f:
    existing_keys = {row["ingredient_key"] for row in csv.DictReader(f)}

if "sloe_gin" in existing_keys:
    print("sloe_gin already in ingredients_ledger.csv — skipping")
else:
    fieldnames = None
    with open(LEDGER, newline="") as f:
        fieldnames = csv.DictReader(f).fieldnames
    with open(LEDGER, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writerow({
            "ingredient_key": "sloe_gin",
            "ndb_no": str(NDB_NO),
            "food_word": "SLOEGIN",
            "default_long_desc": LONG_DESC,
            "default_display_name": "sloe gin",
            "common_unit": "fl oz",
            "common_unit_grams": "30.2",
            "notes": f"custom NDB {NDB_NO}; Plymouth/Hayman's 26% ABV 52 proof; ~29g sugar/100mL; 2026-06-27",
        })
    print("✓ Added sloe_gin to ingredients_ledger.csv")

# ── 4. Add SLOEGIN to all three food-portions-complete.csv files ──────────────
PORTIONS_FILES = [
    ("food-portions-complete.csv", 55, False),       # root — no synonyms col
    ("docs/food-portions-complete.csv", 55, False),  # docs — no synonyms col
    ("src/lib/data/food-portions-complete.csv", 56, True),  # src — has synonyms
]

for fp, expected_cols, has_synonyms in PORTIONS_FILES:
    with open(fp, newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    if any(r["word"] == "SLOEGIN" for r in rows):
        print(f"SLOEGIN already in {fp} — skipping")
        continue

    new_row = {k: "" for k in fieldnames}
    new_row["word"]       = "SLOEGIN"
    new_row["display"]    = "Sloe Gin"
    new_row["group1"]     = "beverages"
    new_row["has_recipe"] = "FALSE"
    new_row["NDB_NO"]     = str(NDB_NO)
    new_row["usda_desc"]  = LONG_DESC
    new_row["cal_100g"]   = str(ENERGY_KCAL)
    new_row["pro_100g"]   = str(PROTEIN)
    new_row["fat_100g"]   = str(FAT)
    new_row["carb_100g"]  = str(CARB)
    new_row["fib_100g"]   = str(FIBER)
    new_row["h2o_100g"]   = str(WATER)
    new_row["sug_100g"]   = str(SUGAR)
    new_row["M1_Amt"]     = str(M1_AMT)
    new_row["M1_Desc"]    = M1_DESC
    new_row["M1_Gm"]      = str(M1_GM)
    new_row["M2_Amt"]     = str(M2_AMT)
    new_row["M2_Desc"]    = M2_DESC
    new_row["M2_Gm"]      = str(M2_GM)
    if has_synonyms:
        new_row["synonyms"] = ""

    with open(fp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
        w.writerow(new_row)
    print(f"✓ Added SLOEGIN to {fp}")

print("\nDone. Run validate_ledger.py to verify.")
