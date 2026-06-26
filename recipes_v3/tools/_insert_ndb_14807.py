"""
Insert NDB 14807 (creme_de_cassis) into local comboo.db and Turso comboo,
add to all food-portions-complete.csv copies, and append to ingredients_ledger.csv.
"""
import csv
import os
import sqlite3
import sys
from pathlib import Path

REPO_ROOT = Path("/Volumes/training/Daily Food Chain/daily-food-chain")
BASE = REPO_ROOT / "recipes_v3/data"
COMBOO_DB = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
ENV_FILE = REPO_ROOT / ".env.local"

NDB_NO = "14807"
LONG_DESC = "Alcoholic beverage, liqueur, blackcurrant, creme de cassis, 36 proof"
ENERGY = 268.0
PROTEIN = 0.0
FAT = 0.0
CARB = 44.6
SUGAR = 44.6
WATER = 40.0
M1_AMT = 1.0
M1_DESC = "fl oz"
M1_GM = 33.0


def _load_env():
    env = {}
    if not ENV_FILE.exists():
        return env
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def insert_local():
    conn = sqlite3.connect(COMBOO_DB)
    cur = conn.cursor()
    cur.execute("SELECT NDB_NO FROM DataCentralCombo WHERE NDB_NO=?", (NDB_NO,))
    if cur.fetchone():
        print(f"  local comboo.db: NDB {NDB_NO} already exists — skipping")
        conn.close()
        return
    cur.execute("""
        INSERT INTO DataCentralCombo
        (NDB_NO, FdGrp_Cd, Long_Desc, Energy_KCal, Protein, TotalLipidFat,
         Carbohydrate, SugarsTotal, Water,
         M1_Amt, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (NDB_NO, "1400", LONG_DESC, ENERGY, PROTEIN, FAT,
          CARB, SUGAR, WATER, M1_AMT, M1_DESC, M1_GM, "n"))
    conn.commit()
    conn.close()
    print(f"✓ local comboo.db — NDB {NDB_NO} inserted")


def insert_turso():
    env = _load_env()
    url = env.get("TURSO_SR28_URL") or os.environ.get("TURSO_SR28_URL")
    token = env.get("TURSO_SR28_TOKEN") or os.environ.get("TURSO_SR28_TOKEN")
    if not url or not token:
        sys.exit("ERROR: TURSO_SR28_URL / TURSO_SR28_TOKEN not found in .env.local")
    try:
        import libsql_experimental as libsql  # type: ignore
    except ImportError:
        sys.exit("ERROR: pip install libsql-experimental")
    conn = libsql.connect(database=url, auth_token=token)
    conn.execute("""
        INSERT OR IGNORE INTO DataCentralCombo
        (NDB_NO, FdGrp_Cd, Long_Desc, Energy_KCal, Protein, TotalLipidFat,
         Carbohydrate, SugarsTotal, Water,
         M1_Amt, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (NDB_NO, "1400", LONG_DESC, ENERGY, PROTEIN, FAT,
          CARB, SUGAR, WATER, M1_AMT, M1_DESC, M1_GM, "n"))
    conn.commit()
    print(f"✓ Turso comboo — NDB {NDB_NO} synced")


def add_food_portions():
    # root (55 cols) and docs/ (55 cols) — no synonyms column
    for fp in [
        REPO_ROOT / "food-portions-complete.csv",
        REPO_ROOT / "docs/food-portions-complete.csv",
    ]:
        with open(fp, newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader)
            n_cols = len(header)
            rows = list(reader)
        # Check not already present
        if any(r[0] == "CREMECASSIS" for r in rows):
            print(f"  {fp.name} (root/docs): CREMECASSIS already present — skipping")
            continue
        new_row = [""] * n_cols
        new_row[0] = "CREMECASSIS"
        new_row[1] = "Crème de Cassis"
        new_row[2] = "beverage"  # group1
        new_row[7] = NDB_NO
        new_row[8] = LONG_DESC
        new_row[9] = str(ENERGY)
        new_row[10] = str(PROTEIN)
        new_row[11] = str(FAT)
        new_row[12] = str(CARB)
        new_row[13] = "0.0"   # Fiber
        new_row[14] = str(WATER)
        new_row[15] = str(SUGAR)
        new_row[20] = str(M1_AMT)
        new_row[21] = M1_DESC
        new_row[22] = str(M1_GM)
        with open(fp, "a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow(new_row)
        print(f"✓ {fp} — CREMECASSIS appended (55 cols)")

    # src/lib/data/ (56 cols) — has synonyms col after display
    fp = REPO_ROOT / "src/lib/data/food-portions-complete.csv"
    with open(fp, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        n_cols = len(header)
        rows = list(reader)
    if any(r[0] == "CREMECASSIS" for r in rows):
        print(f"  src/lib/data/food-portions-complete.csv: CREMECASSIS already present — skipping")
    else:
        new_row = [""] * n_cols
        new_row[0] = "CREMECASSIS"
        new_row[1] = "Crème de Cassis"
        # new_row[2] = "" (synonyms)
        new_row[3] = "beverage"  # group1
        new_row[8] = NDB_NO
        new_row[9] = LONG_DESC
        new_row[10] = str(ENERGY)
        new_row[11] = str(PROTEIN)
        new_row[12] = str(FAT)
        new_row[13] = str(CARB)
        new_row[14] = "0.0"   # Fiber
        new_row[15] = str(WATER)
        new_row[16] = str(SUGAR)
        new_row[21] = str(M1_AMT)
        new_row[22] = M1_DESC
        new_row[23] = str(M1_GM)
        with open(fp, "a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow(new_row)
        print(f"✓ src/lib/data/food-portions-complete.csv — CREMECASSIS appended (56 cols)")


def add_ledger():
    ledger_path = BASE / "ingredients_ledger.csv"
    with open(ledger_path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    if any(r[0] == "creme_de_cassis" for r in rows):
        print("  ingredients_ledger.csv: creme_de_cassis already present — skipping")
        return
    with open(ledger_path, "a", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow([
            "creme_de_cassis", NDB_NO, "CREMECASSIS", LONG_DESC,
            "Crème de Cassis", M1_DESC, str(M1_GM),
            "Custom NDB 14807; Lejay label: E=268 kcal C=44.6g Su=44.6g ABV=18%; cocktail ingredient 2026-06-26"
        ])
    print("✓ ingredients_ledger.csv — creme_de_cassis appended")


if __name__ == "__main__":
    insert_local()
    insert_turso()
    add_food_portions()
    add_ledger()
    print("\nDone. Run: python3 scripts/dev/convert_to_ts.py")
