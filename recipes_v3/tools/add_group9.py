"""
add_group9.py — Create NDBs 14795–14799 to eliminate shared-NDB proxies.

  14795  prosecco              (= sparkling_wine values, own Long_Desc)
  14796  creme_de_menthe_white (= creme_de_menthe values, own Long_Desc)
  14797  creme_de_cacao_white  (= creme_de_cacao values, own Long_Desc)
  14798  light_rum             (= rum_80proof values, own Long_Desc)
  14799  peach_schnapps        (30 proof / DeKuyper label — distinct from 14711)

Also:
  - Adds prosecco ledger key
  - Updates 4 existing ledger keys to point at new NDBs
  - Updates BVRG_027 ingredient row from sparkling_wine → prosecco
  - Syncs all 5 new NDBs to Turso comboo DB
"""
import csv
import os
import sqlite3
from pathlib import Path

BASE = Path("recipes_v3/data")
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
LEDGER = BASE / "ingredients_ledger.csv"

# ── New NDB definitions ────────────────────────────────────────────────────
# Fields: NDB_NO, Long_Desc, Water, Energy_KCal, Energy_KJ, Carbohydrate,
#         SugarsTotal, TotalLipidFat, AlcholEthyl, Ash, M1_Amt, M1_Desc, M1_Gm

NEW_NDBS = [
    {
        "NDB_NO": "14795",
        "Long_Desc": "Alcoholic beverage, wine, sparkling, Prosecco, 11% ABV, brut",
        "Water": 88.9, "Energy_KCal": 73.0, "Energy_KJ": 305.0,
        "Carbohydrate": 1.5, "SugarsTotal": 0.9, "TotalLipidFat": 0.0,
        "AlcholEthyl": 9.5, "Ash": 0.1,
        "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 29.4,
    },
    {
        "NDB_NO": "14796",
        "Long_Desc": "Alcoholic beverage, creme de menthe, white (clear), 72 proof",
        "Water": 28.3, "Energy_KCal": 371.0, "Energy_KJ": 1552.0,
        "Carbohydrate": 41.6, "SugarsTotal": 41.6, "TotalLipidFat": 0.3,
        "AlcholEthyl": 29.8, "Ash": 0.0,
        "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 27.0,
    },
    {
        "NDB_NO": "14797",
        "Long_Desc": "Alcoholic beverage, liqueur, creme de cacao, white, 50 proof",
        "Water": 41.82, "Energy_KCal": 286.0, "Energy_KJ": 1197.0,
        "Carbohydrate": 39.25, "SugarsTotal": 39.25, "TotalLipidFat": 0.0,
        "AlcholEthyl": 18.43, "Ash": 0.0,
        "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 27.0,
    },
    {
        "NDB_NO": "14798",
        "Long_Desc": "Alcoholic beverage, distilled, rum, light (white), 80 proof",
        "Water": 66.6, "Energy_KCal": 231.0, "Energy_KJ": 967.0,
        "Carbohydrate": 0.0, "SugarsTotal": 0.0, "TotalLipidFat": 0.0,
        "AlcholEthyl": 33.4, "Ash": 0.0,
        "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 27.8,
    },
    {
        "NDB_NO": "14799",
        "Long_Desc": "Alcoholic beverage, liqueur, peach schnapps, 30 proof",
        "Water": 54.5, "Energy_KCal": 217.0, "Energy_KJ": 908.0,
        "Carbohydrate": 34.0, "SugarsTotal": 34.0, "TotalLipidFat": 0.0,
        "AlcholEthyl": 11.5, "Ash": 0.0,
        "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 27.0,
    },
]

# ── 1. Insert into local comboo.db ─────────────────────────────────────────
db = sqlite3.connect(DB_PATH)
inserted = []
for n in NEW_NDBS:
    existing = db.execute(
        "SELECT NDB_NO FROM DataCentralCombo WHERE NDB_NO=?", (n["NDB_NO"],)
    ).fetchone()
    if existing:
        print(f"  NDB {n['NDB_NO']} already exists — skipping local insert")
        continue
    db.execute("""
        INSERT INTO DataCentralCombo
        (NDB_NO, FdGrp_Cd, Long_Desc, Protein, TotalLipidFat, Carbohydrate,
         SugarsTotal, Ash, Energy_KCal, Energy_KJ, AlcholEthyl, Water,
         M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        n["NDB_NO"], "1400", n["Long_Desc"],
        0.0, n["TotalLipidFat"], n["Carbohydrate"],
        n["SugarsTotal"], n["Ash"],
        n["Energy_KCal"], n["Energy_KJ"], n["AlcholEthyl"], n["Water"],
        "1", n["M1_Amt"], n["M1_Desc"], n["M1_Gm_Wgt"], "n",
    ))
    inserted.append(n["NDB_NO"])
    print(f"  Inserted NDB {n['NDB_NO']}: {n['Long_Desc']}")
db.commit()
db.close()
print(f"\nLocal comboo.db: {len(inserted)} new NDBs inserted")

# ── 2. Sync to Turso ───────────────────────────────────────────────────────
def _load_env(path):
    env = {}
    try:
        for line in open(path):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return env

_env = _load_env(".env.local")
sync_url = _env.get("TURSO_SR28_URL") or os.environ["TURSO_SR28_URL"]
auth_token = _env.get("TURSO_SR28_TOKEN") or os.environ["TURSO_SR28_TOKEN"]
sidecar = "comboo_gN.db"

import libsql_experimental as libsql
conn = libsql.connect(sidecar, sync_url=sync_url, auth_token=auth_token)
conn.sync()

for n in NEW_NDBS:
    existing = conn.execute(
        "SELECT NDB_NO FROM DataCentralCombo WHERE NDB_NO=?", (n["NDB_NO"],)
    ).fetchone()
    if existing:
        print(f"  Turso: NDB {n['NDB_NO']} already exists — skipping")
        continue
    conn.execute("""
        INSERT INTO DataCentralCombo
        (NDB_NO, FdGrp_Cd, Long_Desc, Protein, TotalLipidFat, Carbohydrate,
         SugarsTotal, Ash, Energy_KCal, Energy_KJ, AlcholEthyl, Water,
         M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        n["NDB_NO"], "1400", n["Long_Desc"],
        0.0, n["TotalLipidFat"], n["Carbohydrate"],
        n["SugarsTotal"], n["Ash"],
        n["Energy_KCal"], n["Energy_KJ"], n["AlcholEthyl"], n["Water"],
        "1", n["M1_Amt"], n["M1_Desc"], n["M1_Gm_Wgt"], "n",
    ))
    print(f"  Turso: inserted NDB {n['NDB_NO']}")

conn.commit()
os.remove(sidecar)
print("Turso sync complete.")

# ── 3. Update ingredients_ledger.csv ──────────────────────────────────────
# Ledger columns: ingredient_key, NDB_No, food_word, long_desc,
#                 display_name, common_unit, common_unit_grams, notes
LEDGER_UPDATES = {
    # key: (new_NDB, new_food_word, new_long_desc, new_display, new_notes)
    "creme_de_menthe_white": (
        "14796", "CREMEMENTHEWHITE",
        "Alcoholic beverage, creme de menthe, white (clear), 72 proof",
        "White Crème de Menthe",
        "new NDB 14796; white creme de menthe 72 proof 2026-06-25",
    ),
    "creme_de_cacao_white": (
        "14797", "CREMEDECACAOWHITE",
        "Alcoholic beverage, liqueur, creme de cacao, white, 50 proof",
        "White Crème de Cacao",
        "new NDB 14797; white creme de cacao 50 proof 2026-06-25",
    ),
    "light_rum": (
        "14798", "LIGHTRUM",
        "Alcoholic beverage, distilled, rum, light (white), 80 proof",
        "light rum",
        "new NDB 14798; light rum 80 proof 2026-06-25",
    ),
    "peach_schnapps": (
        "14799", "PEACHSCHNAPPS",
        "Alcoholic beverage, liqueur, peach schnapps, 30 proof",
        "Peach Schnapps",
        "new NDB 14799; 30 proof DeKuyper peach schnapps 2026-06-25",
    ),
}

# Read all ledger rows
with open(LEDGER, newline="") as f:
    rows = list(csv.reader(f))

changed = 0
for i, row in enumerate(rows):
    if not row:
        continue
    key = row[0]
    if key in LEDGER_UPDATES:
        ndb, fw, ld, disp, notes = LEDGER_UPDATES[key]
        row[1] = ndb
        row[2] = fw
        row[3] = ld
        row[4] = disp
        if len(row) >= 8:
            row[7] = notes
        rows[i] = row
        changed += 1
        print(f"  Ledger updated: {key} → NDB {ndb}")

# Add prosecco as a new row (append after sparkling_wine)
new_prosecco = [
    "prosecco", "14795", "PROSECCO",
    "Alcoholic beverage, wine, sparkling, Prosecco, 11% ABV, brut",
    "Prosecco", "fl oz", "29.4",
    "new NDB 14795; Prosecco brut sparkling wine 2026-06-25",
]
rows.append(new_prosecco)
print(f"  Ledger added: prosecco → NDB 14795")

with open(LEDGER, "w", newline="") as f:
    csv.writer(f).writerows(rows)
print(f"\nLedger: {changed} rows updated, 1 added")

# ── 4. Fix BVRG_027: sparkling_wine → prosecco (clear display_name_override) ──
ing_path = BASE / "recipe_ingredients.csv"
with open(ing_path, newline="") as f:
    ing_rows = list(csv.reader(f))

for i, row in enumerate(ing_rows):
    if row[0] == "BVRG_027" and row[2] == "sparkling_wine":
        row[2] = "prosecco"
        row[10] = ""   # clear display_name_override — ledger display is now correct
        ing_rows[i] = row
        print(f"  BVRG_027 row 1: sparkling_wine → prosecco, display_name_override cleared")

with open(ing_path, "w", newline="") as f:
    csv.writer(f).writerows(ing_rows)

print("\nAll done. Run validate_ledger.py to confirm.")
