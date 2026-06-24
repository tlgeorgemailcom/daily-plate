"""
Fix NDB 14751 (Cherry Sangue Morlacco, Luxardo) energy value.

Previously stored: 287 kcal/100ml (based on 85 kcal/oz estimate — wrong source).
Correct label:     73 kcal/oz (theliquorbarn.com / fatsecret.com), 9g carbs/oz.

Derived per 100ml (1 oz = 29.57ml):
  E    = 73 / 29.57 × 100 = 246.9 → 247 kcal
  Alc  = 30% ABV × 0.789 = 23.7g        (unchanged)
  C    = 9 / 29.57 × 100 = 30.43 → 30.4g
  Su   = 30.4g
  W    = 100 - 23.7 - 30.4 = 45.9g      (was 46.0g)
  E_KJ = 247 × 4.184 = 1033.5 → 1034 kJ
"""

import csv, io, os, sys

DRY_RUN = "--commit" not in sys.argv
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
NDB_NO  = "14751"

E_KCAL = 247.0
E_KJ   = 1034.0
CARB   = 30.4
SUGAR  = 30.4
WATER  = 45.9

# ── comboo.db ──────────────────────────────────────────────────────────────────
import sqlite3

def fix_local_db(dry: bool):
    print(f"\n=== {'DRY RUN' if dry else 'COMMIT'} — comboo.db ===")
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()
    cur.execute("SELECT Energy_KCal, Carbohydrate, SugarsTotal, Water FROM DataCentralCombo WHERE NDB_NO=?", (NDB_NO,))
    row = cur.fetchone()
    if not row:
        print(f"  ERROR: NDB {NDB_NO} not found")
        conn.close(); return
    print(f"  Before: E={row[0]}, C={row[1]}, Su={row[2]}, W={row[3]}")
    if not dry:
        cur.execute("""
            UPDATE DataCentralCombo
            SET Energy_KCal=?, Energy_KJ=?, Carbohydrate=?, SugarsTotal=?, Water=?
            WHERE NDB_NO=?
        """, (E_KCAL, E_KJ, CARB, SUGAR, WATER, NDB_NO))
        conn.commit()
        cur.execute("SELECT Energy_KCal, Carbohydrate, SugarsTotal, Water FROM DataCentralCombo WHERE NDB_NO=?", (NDB_NO,))
        row2 = cur.fetchone()
        print(f"  After : E={row2[0]}, C={row2[1]}, Su={row2[2]}, W={row2[3]}")
    else:
        print(f"  Would  → E={E_KCAL}, C={CARB}, Su={SUGAR}, W={WATER}")
    conn.close()

# ── Turso ──────────────────────────────────────────────────────────────────────
def _load_env():
    """Parse .env.local manually (no python-dotenv dependency)."""
    env_path = "/Volumes/training/Daily Food Chain/daily-food-chain/.env.local"
    url = token = None
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("TURSO_SR28_URL="):
                url = line.split("=", 1)[1].strip().strip('"').strip("'")
            elif line.startswith("TURSO_SR28_TOKEN="):
                token = line.split("=", 1)[1].strip().strip('"').strip("'")
    return url, token

def fix_turso(dry: bool):
    print(f"\n=== {'DRY RUN' if dry else 'COMMIT'} — Turso ===")
    import libsql_experimental as libsql
    url, token = _load_env()
    if not url or not token:
        print("  WARNING: TURSO_SR28_URL/TOKEN not found — skipping")
        return
    if dry:
        print(f"  Would UPDATE NDB {NDB_NO}: E={E_KCAL}, C={CARB}, Su={SUGAR}, W={WATER}")
        return
    tconn = libsql.connect("comboo_fix.db", sync_url=url, auth_token=token)
    tconn.sync()
    tconn.execute("""
        UPDATE DataCentralCombo
        SET Energy_KCal=?, Energy_KJ=?, Carbohydrate=?, SugarsTotal=?, Water=?
        WHERE NDB_NO=?
    """, (E_KCAL, E_KJ, CARB, SUGAR, WATER, NDB_NO))
    tconn.commit()
    print(f"  Turso updated NDB {NDB_NO}")

# ── food-portions-complete.csv (3 copies) ─────────────────────────────────────
FILES_55 = [
    "food-portions-complete.csv",
    "docs/food-portions-complete.csv",
]
FILE_56 = "src/lib/data/food-portions-complete.csv"

def patch_fp_55(path: str, dry: bool):
    """55-col format: NDB_NO=7, cal_100g=9, carb_100g=12, h2o_100g=14, sug_100g=15"""
    rows = []
    found = False
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if row and row[0] == "CHERRYMORLACCO":
                found = True
                print(f"  {path}: CHERRYMORLACCO cal {row[9]} → {E_KCAL}")
                if not dry:
                    row[9]  = str(E_KCAL)
                    row[12] = str(CARB)
                    row[14] = str(WATER)
                    row[15] = str(SUGAR)
            rows.append(row)
    if not found:
        print(f"  WARNING: CHERRYMORLACCO not found in {path}")
        return
    if not dry:
        with open(path, 'w', newline='', encoding='utf-8') as f:
            csv.writer(f).writerows(rows)

def patch_fp_56(path: str, dry: bool):
    """56-col format: NDB_NO=8, cal_100g=10, carb_100g=13, h2o_100g=15, sug_100g=16"""
    rows = []
    found = False
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if row and row[0] == "CHERRYMORLACCO":
                found = True
                print(f"  {path}: CHERRYMORLACCO cal {row[10]} → {E_KCAL}")
                if not dry:
                    row[10] = str(E_KCAL)
                    row[13] = str(CARB)
                    row[15] = str(WATER)
                    row[16] = str(SUGAR)
            rows.append(row)
    if not found:
        print(f"  WARNING: CHERRYMORLACCO not found in {path}")
        return
    if not dry:
        with open(path, 'w', newline='', encoding='utf-8') as f:
            csv.writer(f).writerows(rows)

# ── main ───────────────────────────────────────────────────────────────────────
if DRY_RUN:
    print("DRY RUN — fix_14751_energy.py (pass --commit to apply)")
else:
    print("COMMIT — fix_14751_energy.py")

fix_local_db(DRY_RUN)
fix_turso(DRY_RUN)

print(f"\n=== {'DRY RUN' if DRY_RUN else 'COMMIT'} — food-portions-complete.csv ===")
for p in FILES_55:
    patch_fp_55(p, DRY_RUN)
patch_fp_56(FILE_56, DRY_RUN)

if DRY_RUN:
    print("\nDry run complete. Re-run with --commit to apply.")
else:
    print("\nDone. Run: python3 scripts/dev/convert_to_ts.py")
