"""
Insert NDB 14807 (grenadine) into local comboo.db and Turso comboo,
and append to ingredients_ledger.csv.
No food-portions-complete.csv entry — Rule D cocktail ingredient.
Source: label 80 kcal / 2 tbsp (30 mL); per-100g at 1 mL = 1g.
"""
import csv, os, sqlite3, sys
from pathlib import Path

REPO_ROOT = Path("/Volumes/training/Daily Food Chain/daily-food-chain")
BASE      = REPO_ROOT / "recipes_v3/data"
COMBOO_DB = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
ENV_FILE  = REPO_ROOT / ".env.local"

NDB_NO    = "14807"
LONG_DESC = "Cocktail mixer, grenadine syrup"
ENERGY    = 267.0
PROTEIN   = 0.0
FAT       = 0.0
CARB      = 66.7
SUGAR     = 66.7
WATER     = 33.3
ALCOHOL   = 0.0
M1_AMT    = 1.0
M1_DESC   = "fl oz"
M1_GM     = 30.0

def _load_env():
    env = {}
    if not ENV_FILE.exists(): return env
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line: continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def insert_local():
    conn = sqlite3.connect(COMBOO_DB)
    cur  = conn.cursor()
    cur.execute("SELECT NDB_NO FROM DataCentralCombo WHERE NDB_NO=?", (NDB_NO,))
    if cur.fetchone():
        print(f"  local comboo.db: NDB {NDB_NO} already exists — skipping")
        conn.close(); return
    cur.execute("""
        INSERT INTO DataCentralCombo
        (NDB_NO, FdGrp_Cd, Long_Desc, Energy_KCal, Protein, TotalLipidFat,
         Carbohydrate, SugarsTotal, Water, AlcholEthyl,
         M1_Amt, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (NDB_NO, "1400", LONG_DESC, ENERGY, PROTEIN, FAT,
          CARB, SUGAR, WATER, ALCOHOL, M1_AMT, M1_DESC, M1_GM, "n"))
    conn.commit(); conn.close()
    print(f"✓ local comboo.db — NDB {NDB_NO} inserted")

def insert_turso():
    env   = _load_env()
    url   = env.get("TURSO_SR28_URL")   or os.environ.get("TURSO_SR28_URL")
    token = env.get("TURSO_SR28_TOKEN") or os.environ.get("TURSO_SR28_TOKEN")
    if not url or not token:
        sys.exit("ERROR: TURSO_SR28_URL / TURSO_SR28_TOKEN not found in .env.local")
    try:
        import libsql_experimental as libsql
    except ImportError:
        sys.exit("ERROR: pip install libsql-experimental")
    conn = libsql.connect(database=url, auth_token=token)
    conn.execute("""
        INSERT OR IGNORE INTO DataCentralCombo
        (NDB_NO, FdGrp_Cd, Long_Desc, Energy_KCal, Protein, TotalLipidFat,
         Carbohydrate, SugarsTotal, Water, AlcholEthyl,
         M1_Amt, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (NDB_NO, "1400", LONG_DESC, ENERGY, PROTEIN, FAT,
          CARB, SUGAR, WATER, ALCOHOL, M1_AMT, M1_DESC, M1_GM, "n"))
    conn.commit()
    print(f"✓ Turso comboo — NDB {NDB_NO} synced")

def add_ledger():
    ledger = BASE / "ingredients_ledger.csv"
    with open(ledger, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    if any(r["ingredient_key"] == "grenadine" for r in rows):
        print("  ingredients_ledger.csv: grenadine already present — skipping"); return
    new_row = {
        "ingredient_key":       "grenadine",
        "ndb_no":               NDB_NO,
        "food_word":            "GRENADINE",
        "default_long_desc":    LONG_DESC,
        "default_display_name": "grenadine",
        "common_unit":          M1_DESC,
        "common_unit_grams":    str(M1_GM),
        "notes": (f"Custom NDB {NDB_NO}; label 80 kcal/2 tbsp (30 mL); "
                  f"{ENERGY} kcal/100g; {CARB}g carbs/sugars; no alcohol 2026-06-26"),
    }
    with open(ledger, "a", newline="", encoding="utf-8") as f:
        csv.DictWriter(f, fieldnames=fieldnames).writerow(new_row)
    print(f"✓ ingredients_ledger.csv — grenadine appended")

if __name__ == "__main__":
    insert_local()
    insert_turso()
    add_ledger()
    print("Done.")
