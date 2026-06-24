#!/usr/bin/env python3
"""
Add 5 cocktail NDB entries with verified/estimated label data:

  14749 – Aromatic Bitters (Angostura type, 44.7% ABV / 89.4 proof)
            Values: label-verified (44.7% ABV, ~25g C/100ml)
  14750 – Peychaud's Bitters (35% ABV / 70 proof)
            Values: 2 kcal/dash (1ml), 35% ABV → E=200, Alc=27.6, C=1.7
  14751 – Cherry Sangue Morlacco, Luxardo (30% ABV / 60 proof)
            Values: 85 kcal/oz, 30% ABV → E=287, Alc=23.7, C=30.3 (by difference)
            Note: "1350g/L sugar" on label is inconsistent with 85 kcal/oz (that would be
            ~708 kcal/100ml). Using kcal-derived carbs (30.3g/100ml) as ground truth.
  14752 – Peach Brandy (54 proof / 27% ABV)
            Values: estimated from Arrow/Dekuyper 54-proof label (~110 kcal/1.5 oz)
            E=248, Alc=21.3, C=24.7 — label provided proof only.
  14753 – Honey Syrup, Monin (non-alcoholic)
            Values: 25g sugar/oz → 84.5g/100ml → E=338, C=84.5, W=15.5

Run: python recipes_v3/tools/add_label_batch_v2.py [--commit]
"""

import argparse
import csv
import sqlite3
from pathlib import Path

ROOT    = Path(__file__).resolve().parents[2]
DB_PATH = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
LEDGER  = ROOT / "recipes_v3/data/ingredients_ledger.csv"
FP_ROOT = ROOT / "food-portions-complete.csv"
FP_SRC  = ROOT / "src/lib/data/food-portions-complete.csv"
FP_DOCS = ROOT / "docs/food-portions-complete.csv"

# ─── New NDB definitions ──────────────────────────────────────────────────────

NEW_NDBS = [
    {
        "NDB_NO": "14749",
        "Long_Desc": "Alcoholic beverage, bitters, aromatic, Angostura type, 89.4 proof",
        "FdGrp_Cd": "1400",
        # 44.7% ABV: 44.7ml × 0.789 = 35.3g EtOH; E = 35.3×7 + 25×4 = 247+100 = 347 ≈ 340 (minor components)
        "Energy_KCal": 340.0, "Energy_KJ": 1423.0,
        "Protein": 0.0, "TotalLipidFat": 0.0,
        "Carbohydrate": 25.0, "FiberTotalDietary": 0.0,
        "SugarsTotal": 25.0, "AlcholEthyl": 35.3, "Water": 39.7, "Ash": 0.0,
        # Bitters measured in dashes; 1 dash ≈ 0.9g
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "dash",      "M1_Gm_Wgt": 0.9,
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "tsp",       "M2_Gm_Wgt": 4.5,
        "M3_Seq": 3, "M3_Amt": 1.0, "M3_Desc": "oz",        "M3_Gm_Wgt": 27.8,
    },
    {
        "NDB_NO": "14750",
        "Long_Desc": "Alcoholic beverage, bitters, Peychaud's aromatic, 70 proof",
        "FdGrp_Cd": "1400",
        # 35% ABV: 35ml × 0.789 = 27.6g EtOH → 193.2 kcal; residual 6.8 kcal → 1.7g C
        # Label: 2 kcal per 1ml dash → 200 kcal/100ml
        "Energy_KCal": 200.0, "Energy_KJ": 837.0,
        "Protein": 0.0, "TotalLipidFat": 0.0,
        "Carbohydrate": 1.7, "FiberTotalDietary": 0.0,
        "SugarsTotal": 1.7, "AlcholEthyl": 27.6, "Water": 70.7, "Ash": 0.0,
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "dash",      "M1_Gm_Wgt": 0.9,
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "tsp",       "M2_Gm_Wgt": 4.5,
        "M3_Seq": 3, "M3_Amt": 1.0, "M3_Desc": "oz",        "M3_Gm_Wgt": 27.8,
    },
    {
        "NDB_NO": "14751",
        "Long_Desc": "Alcoholic beverage, liqueur, cherry, Sangue Morlacco, Luxardo, 60 proof",
        "FdGrp_Cd": "1400",
        # Label: 85 kcal/oz = 287 kcal/100ml; 30% ABV → Alc=23.7g → 165.9 kcal from EtOH
        # Residual: 287-165.9=121.1 kcal → C=30.3g (all sugar); W=100-23.7-30.3=46.0
        "Energy_KCal": 287.0, "Energy_KJ": 1201.0,
        "Protein": 0.0, "TotalLipidFat": 0.0,
        "Carbohydrate": 30.3, "FiberTotalDietary": 0.0,
        "SugarsTotal": 30.3, "AlcholEthyl": 23.7, "Water": 46.0, "Ash": 0.0,
        # Sweet liqueur density ~1.07 g/ml → 1 fl oz ≈ 31.6g ≈ 32g
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "fl oz",              "M1_Gm_Wgt": 32.0,
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "jigger (1.5 fl oz)", "M2_Gm_Wgt": 48.0,
        "M3_Seq": 3, "M3_Amt": 2.0, "M3_Desc": "fl oz",              "M3_Gm_Wgt": 64.0,
    },
    {
        "NDB_NO": "14752",
        "Long_Desc": "Alcoholic beverage, liqueur, peach brandy, 54 proof",
        "FdGrp_Cd": "1400",
        # 54 proof = 27% ABV → Alc=21.3g → 149.1 kcal; estimated ~110 kcal/1.5oz
        # = 248 kcal/100ml; residual 98.9 kcal → C=24.7g; W=54.0
        # ESTIMATED: label provided proof only; values from Arrow/Dekuyper 54-proof label
        "Energy_KCal": 248.0, "Energy_KJ": 1038.0,
        "Protein": 0.0, "TotalLipidFat": 0.0,
        "Carbohydrate": 24.7, "FiberTotalDietary": 0.0,
        "SugarsTotal": 24.7, "AlcholEthyl": 21.3, "Water": 54.0, "Ash": 0.0,
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "fl oz",              "M1_Gm_Wgt": 30.0,
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "jigger (1.5 fl oz)", "M2_Gm_Wgt": 45.0,
        "M3_Seq": 3, "M3_Amt": 2.0, "M3_Desc": "fl oz",              "M3_Gm_Wgt": 60.0,
    },
    {
        "NDB_NO": "14753",
        "Long_Desc": "Beverage, syrup, honey, Monin, non-alcoholic",
        "FdGrp_Cd": "1400",
        # Label: 25g sugar/oz = 84.5g sugar/100ml → E=338 kcal; W=15.5g
        "Energy_KCal": 338.0, "Energy_KJ": 1414.0,
        "Protein": 0.0, "TotalLipidFat": 0.0,
        "Carbohydrate": 84.5, "FiberTotalDietary": 0.0,
        "SugarsTotal": 84.5, "AlcholEthyl": 0.0, "Water": 15.5, "Ash": 0.0,
        # Honey syrup density ~1.35 g/ml → 1 fl oz ≈ 40g
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "fl oz",  "M1_Gm_Wgt": 40.0,
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "tbsp",   "M2_Gm_Wgt": 20.0,
        "M3_Seq": 3, "M3_Amt": 1.0, "M3_Desc": "cup",    "M3_Gm_Wgt": 320.0,
    },
]

# ─── New ledger entries (APPEND) ──────────────────────────────────────────────
# Format: (ingredient_key, ndb_no, food_word, long_desc, display_name,
#          common_unit, common_unit_grams, notes)

LEDGER_ENTRIES = [
    ("aromatic_bitters",       "14749", "AROMATICBITTERS",
     "Alcoholic beverage, bitters, aromatic, Angostura type, 89.4 proof",
     "aromatic bitters", "dash", "0.9",
     "cocktail ingredient; 44.7% ABV label-verified 2026-06-24"),
    ("peychauds_bitters",      "14750", "PEYCHAUDS",
     "Alcoholic beverage, bitters, Peychaud's aromatic, 70 proof",
     "Peychaud's bitters", "dash", "0.9",
     "cocktail ingredient; 35% ABV; 2 kcal/dash label 2026-06-24"),
    ("cherry_sangue_morlacco", "14751", "CHERRYMORLACCO",
     "Alcoholic beverage, liqueur, cherry, Sangue Morlacco, Luxardo, 60 proof",
     "cherry sangue morlacco", "fl oz", "32.0",
     "cocktail ingredient; 85 kcal/oz label; 30% ABV 2026-06-24"),
    ("peach_brandy",           "14752", "PEACHBRANDY",
     "Alcoholic beverage, liqueur, peach brandy, 54 proof",
     "peach brandy", "fl oz", "30.0",
     "cocktail ingredient; 54 proof label; kcal estimated Arrow/Dekuyper 2026-06-24"),
    ("honey_syrup",            "14753", "HONEYSYRUP",
     "Beverage, syrup, honey, Monin, non-alcoholic",
     "honey syrup", "fl oz", "40.0",
     "cocktail ingredient; 25g sugar/oz Monin label 2026-06-24"),
]

# ─── New food-portions rows ───────────────────────────────────────────────────
# (word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug,
#  m1_amt, m1_desc, m1_gm, m2_amt, m2_desc, m2_gm)

NEW_FP_ROWS = [
    ("AROMATICBITTERS", "Aromatic Bitters",        "14749",
     "Alcoholic beverage, bitters, aromatic, Angostura type, 89.4 proof",
     340.0, 0.0, 0.0, 25.0, 0.0, 39.7, 25.0,
     1.0, "dash", 0.9, 1.0, "tsp", 4.5),
    ("PEYCHAUDS",       "Peychaud's Bitters",      "14750",
     "Alcoholic beverage, bitters, Peychaud's aromatic, 70 proof",
     200.0, 0.0, 0.0, 1.7, 0.0, 70.7, 1.7,
     1.0, "dash", 0.9, 1.0, "tsp", 4.5),
    ("CHERRYMORLACCO",  "Cherry Sangue Morlacco",  "14751",
     "Alcoholic beverage, liqueur, cherry, Sangue Morlacco, Luxardo, 60 proof",
     287.0, 0.0, 0.0, 30.3, 0.0, 46.0, 30.3,
     1.0, "fl oz", 32.0, 1.0, "jigger (1.5 fl oz)", 48.0),
    ("PEACHBRANDY",     "Peach Brandy",            "14752",
     "Alcoholic beverage, liqueur, peach brandy, 54 proof",
     248.0, 0.0, 0.0, 24.7, 0.0, 54.0, 24.7,
     1.0, "fl oz", 30.0, 1.0, "jigger (1.5 fl oz)", 45.0),
    ("HONEYSYRUP",      "Honey Syrup",             "14753",
     "Beverage, syrup, honey, Monin, non-alcoholic",
     338.0, 0.0, 0.0, 84.5, 0.0, 15.5, 84.5,
     1.0, "fl oz", 40.0, 1.0, "tbsp", 20.0),
]

# ─── DB SQL ───────────────────────────────────────────────────────────────────

INSERT_SQL = """
INSERT OR IGNORE INTO DataCentralCombo
  (NDB_NO, Long_Desc, FdGrp_Cd,
   Energy_KCal, Energy_KJ, Protein, TotalLipidFat,
   Carbohydrate, FiberTotalDietary, SugarsTotal,
   AlcholEthyl, Water, Ash,
   M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt,
   M2_Seq, M2_Amt, M2_Desc, M2_Gm_Wgt,
   M3_Seq, M3_Amt, M3_Desc, M3_Gm_Wgt,
   fat)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'n')
"""

def _ndb_row(d):
    return (
        d["NDB_NO"], d["Long_Desc"], d["FdGrp_Cd"],
        d["Energy_KCal"], d["Energy_KJ"], d["Protein"], d["TotalLipidFat"],
        d["Carbohydrate"], d["FiberTotalDietary"], d["SugarsTotal"],
        d["AlcholEthyl"], d["Water"], d["Ash"],
        d.get("M1_Seq"), d.get("M1_Amt"), d.get("M1_Desc"), d.get("M1_Gm_Wgt"),
        d.get("M2_Seq"), d.get("M2_Amt"), d.get("M2_Desc"), d.get("M2_Gm_Wgt"),
        d.get("M3_Seq"), d.get("M3_Amt"), d.get("M3_Desc"), d.get("M3_Gm_Wgt"),
    )

# ─── Food-portions helpers ────────────────────────────────────────────────────

def _fp_row_55(word, display, ndb, desc, cal, pro, fat, carb, fib, h2o, sug,
               m1_amt, m1_desc, m1_gm, m2_amt, m2_desc, m2_gm):
    trailing = [""] * (55 - 29)
    return [word, display, "bar", "", "", "", "", ndb, desc,
            cal, pro, fat, carb, fib, h2o, sug,
            m1_amt, "custom (g)", 100.0,
            m1_amt, m1_desc, m1_gm,
            m2_amt, m2_desc, m2_gm,
            "", "", "", ""] + trailing

def _fp_row_56(word, display, ndb, desc, cal, pro, fat, carb, fib, h2o, sug,
               m1_amt, m1_desc, m1_gm, m2_amt, m2_desc, m2_gm):
    trailing = [""] * (56 - 30)
    return [word, display, "", "bar", "", "", "", "", ndb, desc,
            cal, pro, fat, carb, fib, h2o, sug,
            m1_amt, "custom (g)", 100.0,
            m1_amt, m1_desc, m1_gm,
            m2_amt, m2_desc, m2_gm,
            "", "", "", ""] + trailing

def _append_fp_file(fp_path, is_56col, dry):
    with open(fp_path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    existing_words = {r[0] for r in rows[1:]}

    to_add = []
    for entry in NEW_FP_ROWS:
        word = entry[0]
        if word in existing_words:
            print(f"  SKIP (exists): {word} in {fp_path.name}")
        else:
            fn = _fp_row_56 if is_56col else _fp_row_55
            to_add.append(fn(*entry))
            print(f"  APPEND {fp_path.name}: {word} → NDB {entry[2]}")

    if to_add and not dry:
        with open(fp_path, "a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerows(to_add)
        print(f"  Appended {len(to_add)} rows to {fp_path.name}")

def _append_ledger(dry):
    with open(LEDGER, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    existing_keys = {r[0] for r in rows[1:]}

    to_add = []
    for entry in LEDGER_ENTRIES:
        key = entry[0]
        if key in existing_keys:
            print(f"  SKIP (exists): {key}")
        else:
            print(f"  ADD: {key} → NDB {entry[1]}, food_word={entry[2]}")
            to_add.append(list(entry))

    if to_add and not dry:
        with open(LEDGER, "a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerows(to_add)
        print(f"  Appended {len(to_add)} rows to ledger")

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--commit", action="store_true")
    args = ap.parse_args()
    dry = not args.commit

    print(f"{'DRY RUN' if dry else 'COMMIT'} — add_label_batch_v2.py")
    print()

    # Step 1: comboo.db inserts
    print(f"=== Step 1: Insert {len(NEW_NDBS)} NDBs in comboo.db ===")
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()
    for d in NEW_NDBS:
        cur.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_NO=?", (d["NDB_NO"],))
        if cur.fetchone()[0]:
            print(f"  NDB {d['NDB_NO']} already exists — skip")
        else:
            print(f"  INSERT {d['NDB_NO']}: {d['Long_Desc']}")
            if not dry:
                cur.execute(INSERT_SQL, _ndb_row(d))
    if not dry:
        conn.commit()
    conn.close()

    # Step 1b: Turso sync
    print()
    print("=== Step 1b: Turso SR28 sync ===")
    env_file = ROOT / ".env.local"
    turso_url = turso_token = None
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("TURSO_SR28_URL="):
                turso_url = line.split("=", 1)[1].strip()
            elif line.startswith("TURSO_SR28_TOKEN="):
                turso_token = line.split("=", 1)[1].strip()
    if not turso_url or not turso_token:
        print("  WARNING: TURSO_SR28_URL/TOKEN not found — skipping Turso sync")
    else:
        try:
            import libsql_experimental as libsql
            tconn = libsql.connect(turso_url, auth_token=turso_token)
            for d in NEW_NDBS:
                row = tconn.execute(
                    "SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_NO=?", (d["NDB_NO"],)
                ).fetchone()
                if row and row[0]:
                    print(f"  NDB {d['NDB_NO']} already in Turso — skip")
                else:
                    print(f"  Turso INSERT {d['NDB_NO']}: {d['Long_Desc'][:60]}")
                    if not dry:
                        tconn.execute(INSERT_SQL, _ndb_row(d))
            if not dry:
                tconn.commit()
            print("  Turso sync done")
        except Exception as e:
            print(f"  ERROR syncing to Turso: {e}")

    # Step 2: food-portions
    print()
    print("=== Step 2: Append food-portions-complete.csv (3 copies) ===")
    _append_fp_file(FP_ROOT, is_56col=False, dry=dry)
    print()
    _append_fp_file(FP_DOCS, is_56col=False, dry=dry)
    print()
    _append_fp_file(FP_SRC,  is_56col=True,  dry=dry)

    # Step 3: ledger
    print()
    print("=== Step 3: Append ingredients_ledger.csv ===")
    _append_ledger(dry=dry)

    print()
    print("Done." if not dry else "Dry run complete. Re-run with --commit to apply.")

if __name__ == "__main__":
    main()
