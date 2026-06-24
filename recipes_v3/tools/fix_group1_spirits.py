#!/usr/bin/env python3
"""
Fix Group 1 broken spirit ledger entries.

Problem: brandy, cognac, calvados, cachaca, tequila, pisco, mezcal all point to
NDB 14037 whose Long_Desc says "gin, rum, vodka, whiskey" — none of these names
are searchable by community users. bourbon, rye_whiskey, scotch_whisky point to
NDB 14052 "whiskey, 86 proof" — "bourbon", "scotch", "rye" are not findable.
dark_rum points to NDB 14050 "rum, 80 proof" — "dark rum" not findable.

Fix: create one named NDB per ingredient (14738-14748), update ledger entries,
update/add food-portions rows.

Run: python recipes_v3/tools/fix_group1_spirits.py [--commit]
Default: dry-run.
"""

import argparse
import csv
import os
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
LEDGER   = ROOT / "recipes_v3/data/ingredients_ledger.csv"
FP_ROOT  = ROOT / "food-portions-complete.csv"
FP_SRC   = ROOT / "src/lib/data/food-portions-complete.csv"
FP_DOCS  = ROOT / "docs/food-portions-complete.csv"

# ─── New named NDB entries (all 80 proof / 40% ABV) ──────────────────────────
# Values from SR Legacy NDB 14037: E=231, Alc=33.4, Water=66.6, all others 0.
# Stored as per-100ml (spirit density ~0.914 g/ml treated as ≈ 100g for pipeline).

_S80 = dict(
    FdGrp_Cd="1400",
    Energy_KCal=231.0, Energy_KJ=966.0,
    Protein=0.0, TotalLipidFat=0.0,
    Carbohydrate=0.0, FiberTotalDietary=0.0,
    SugarsTotal=0.0, AlcholEthyl=33.4, Water=66.6, Ash=0.0,
    # M1 = 1 fl oz ≈ 27.0g (29.57ml × 0.914 g/ml)
    M1_Seq=1, M1_Amt=1.0, M1_Desc="fl oz", M1_Gm_Wgt=27.0,
    # M2 = 1.5 fl oz jigger ≈ 40.5g
    M2_Seq=2, M2_Amt=1.0, M2_Desc="jigger (1.5 fl oz)", M2_Gm_Wgt=40.5,
    # M3 = 2 fl oz ≈ 54.0g
    M3_Seq=3, M3_Amt=2.0, M3_Desc="fl oz", M3_Gm_Wgt=54.0,
)

NEW_NDBS = [
    {"NDB_NO": "14738", "Long_Desc": "Alcoholic beverage, distilled, bourbon whiskey, 80 proof",       **_S80},
    {"NDB_NO": "14739", "Long_Desc": "Alcoholic beverage, distilled, rye whiskey, 80 proof",            **_S80},
    {"NDB_NO": "14740", "Long_Desc": "Alcoholic beverage, distilled, Scotch whisky, blended, 80 proof", **_S80},
    {"NDB_NO": "14741", "Long_Desc": "Alcoholic beverage, distilled, tequila, blanco, 80 proof",        **_S80},
    {"NDB_NO": "14742", "Long_Desc": "Alcoholic beverage, distilled, mezcal, agave, 80 proof",          **_S80},
    {"NDB_NO": "14743", "Long_Desc": "Alcoholic beverage, distilled, cognac, VS/VSOP, 80 proof",        **_S80},
    {"NDB_NO": "14744", "Long_Desc": "Alcoholic beverage, distilled, calvados, French apple brandy, 80 proof", **_S80},
    {"NDB_NO": "14745", "Long_Desc": "Alcoholic beverage, distilled, cachaca, Brazilian sugar cane spirit, 80 proof", **_S80},
    {"NDB_NO": "14746", "Long_Desc": "Alcoholic beverage, distilled, pisco, Peruvian, 80 proof",        **_S80},
    {"NDB_NO": "14747", "Long_Desc": "Alcoholic beverage, distilled, brandy, grape, 80 proof",          **_S80},
    {"NDB_NO": "14748", "Long_Desc": "Alcoholic beverage, distilled, rum, dark, aged, 80 proof",        **_S80},
]

# ─── Ledger updates ───────────────────────────────────────────────────────────
# (ingredient_key → new_ndb, new_food_word, new_display_name, new_notes)
LEDGER_UPDATES = {
    "bourbon":      ("14738", "BOURBON",    "bourbon",       "80-proof named NDB; was proxy 14052 2026-06-24"),
    "rye_whiskey":  ("14739", "RYEWHISKEY", "rye whiskey",   "80-proof named NDB; was proxy 14052 2026-06-24"),
    "scotch_whisky":("14740", "SCOTCH",     "scotch whisky", "80-proof named NDB; was proxy 14052 2026-06-24"),
    "tequila":      ("14741", "TEQUILA",    "tequila",       "named NDB; was proxy 14037 2026-06-24"),
    "mezcal":       ("14742", "MEZCAL",     "mezcal",        "named NDB; was proxy 14037 2026-06-24"),
    "cognac":       ("14743", "COGNAC",     "cognac",        "named NDB; was proxy 14037 2026-06-24"),
    "calvados":     ("14744", "CALVADOS",   "calvados",      "named NDB; was proxy 14037 2026-06-24"),
    "cachaca":      ("14745", "CACHACA",    "cachaça",       "named NDB; was proxy 14037 2026-06-24"),
    "pisco":        ("14746", "PISCO",      "pisco",         "named NDB; was proxy 14037 2026-06-24"),
    "brandy":       ("14747", "BRANDY",     "brandy",        "named NDB; was proxy 14037 2026-06-24"),
    "dark_rum":     ("14748", "DARKRUM",    "dark rum",      "named NDB; was proxy 14050 2026-06-24"),
}

# ─── Food-portions entries ────────────────────────────────────────────────────
# (word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug,
#  m1_amt, m1_desc, m1_gm, m2_amt, m2_desc, m2_gm)
# TEQUILA row: UPDATE NDB from 14037 → 14741 (no new row needed for tequila).
# All others: ADD new row.
NEW_FP_ROWS = [
    ("BOURBON",    "Bourbon Whiskey",   "14738",
     "Alcoholic beverage, distilled, bourbon whiskey, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("RYEWHISKEY", "Rye Whiskey",       "14739",
     "Alcoholic beverage, distilled, rye whiskey, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("SCOTCH",     "Scotch Whisky",     "14740",
     "Alcoholic beverage, distilled, Scotch whisky, blended, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("MEZCAL",     "Mezcal",            "14742",
     "Alcoholic beverage, distilled, mezcal, agave, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("COGNAC",     "Cognac",            "14743",
     "Alcoholic beverage, distilled, cognac, VS/VSOP, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("CALVADOS",   "Calvados",          "14744",
     "Alcoholic beverage, distilled, calvados, French apple brandy, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("CACHACA",    "Cachaça",           "14745",
     "Alcoholic beverage, distilled, cachaca, Brazilian sugar cane spirit, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("PISCO",      "Pisco",             "14746",
     "Alcoholic beverage, distilled, pisco, Peruvian, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("BRANDY",     "Brandy",            "14747",
     "Alcoholic beverage, distilled, brandy, grape, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
    ("DARKRUM",    "Dark Rum",          "14748",
     "Alcoholic beverage, distilled, rum, dark, aged, 80 proof",
     231.0, 0.0, 0.0, 0.0, 0.0, 66.6, 0.0,
     1.0, "fl oz", 27.0, 1.0, "jigger (1.5 fl oz)", 40.5),
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
    """Build a 55-column food-portions row (root + docs format, no synonyms col)."""
    trailing = [""] * (55 - 29)  # pad to 55 cols
    return [word, display, "bar", "", "", "", "", ndb, desc,
            cal, pro, fat, carb, fib, h2o, sug,
            m1_amt, "custom (g)", 100.0,
            m1_amt, m1_desc, m1_gm,
            m2_amt, m2_desc, m2_gm,
            "", "", "", ""] + trailing

def _fp_row_56(word, display, ndb, desc, cal, pro, fat, carb, fib, h2o, sug,
               m1_amt, m1_desc, m1_gm, m2_amt, m2_desc, m2_gm):
    """Build a 56-column food-portions row (src/lib/data format, has synonyms col)."""
    # synonyms col inserted at position 3 (after display, before group1)
    trailing = [""] * (56 - 30)
    return [word, display, "", "bar", "", "", "", "", ndb, desc,
            cal, pro, fat, carb, fib, h2o, sug,
            m1_amt, "custom (g)", 100.0,
            m1_amt, m1_desc, m1_gm,
            m2_amt, m2_desc, m2_gm,
            "", "", "", ""] + trailing


def _update_fp_file(fp_path, is_56col, dry):
    """Update TEQUILA NDB + append new rows in one food-portions file."""
    with open(fp_path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))

    header = rows[0]
    ndb_col = 7 if not is_56col else 8  # NDB_NO column index (0-based)

    updated = False
    new_rows = []
    for r in rows[1:]:
        if r[0] == "TEQUILA" and r[ndb_col] == "14037":
            if not dry:
                r[ndb_col] = "14741"
                r[ndb_col + 1] = "Alcoholic beverage, distilled, tequila, blanco, 80 proof"
            print(f"  UPDATE {fp_path.name}: TEQUILA NDB 14037 → 14741")
            updated = True
        new_rows.append(r)

    if not updated:
        print(f"  WARNING: TEQUILA/14037 row not found in {fp_path.name}")

    # Check which food_words already exist
    existing_words = {r[0] for r in new_rows}

    appended = 0
    for fp_entry in NEW_FP_ROWS:
        word = fp_entry[0]
        if word in existing_words:
            print(f"  SKIP (exists): {word} in {fp_path.name}")
            continue
        if is_56col:
            row = _fp_row_56(*fp_entry)
        else:
            row = _fp_row_55(*fp_entry)
        print(f"  APPEND {fp_path.name}: {word} → NDB {fp_entry[2]}")
        new_rows.append(row)
        appended += 1

    if not dry:
        with open(fp_path, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(new_rows)
        print(f"  Wrote {fp_path.name} ({len(new_rows)} data rows)")

    return appended


def _update_ledger(dry):
    """Replace NDB + food_word + notes for the 11 Group 1 ingredient keys."""
    with open(LEDGER, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))

    header = rows[0]
    # Ledger columns (0-based): ingredient_key=0, ndb_no=1, food_word=2,
    #   long_desc=3, display_name=4, common_unit=5, common_unit_grams=6, notes=7
    updated = 0
    for r in rows[1:]:
        key = r[0]
        if key in LEDGER_UPDATES:
            new_ndb, new_fw, new_disp, new_notes = LEDGER_UPDATES[key]
            # Look up the Long_Desc from NEW_NDBS
            new_desc = next(d["Long_Desc"] for d in NEW_NDBS if d["NDB_NO"] == new_ndb)
            old_ndb = r[1]
            print(f"  UPDATE ledger: {key} → NDB {new_ndb} (was {old_ndb}), food_word={new_fw}")
            if not dry:
                r[1] = new_ndb
                r[2] = new_fw
                r[3] = new_desc
                r[4] = new_disp
                r[7] = new_notes
            updated += 1

    missing = set(LEDGER_UPDATES.keys()) - {r[0] for r in rows[1:]}
    if missing:
        print(f"  WARNING: keys not found in ledger: {missing}")

    if not dry:
        with open(LEDGER, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(rows[1:])
        print(f"  Wrote ledger ({updated} rows updated)")

    return updated


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--commit", action="store_true", help="Apply changes (default: dry-run)")
    args = ap.parse_args()
    dry = not args.commit

    print(f"{'DRY RUN' if dry else 'COMMIT'} — fix_group1_spirits.py")
    print()

    # ── Step 1: Insert new NDBs in comboo.db ─────────────────────────────────
    print(f"=== Step 1: Insert {len(NEW_NDBS)} named NDBs in comboo.db ===")
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

    # ── Step 1b: Turso SR28 sync ──────────────────────────────────────────────
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
                    "SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_NO=?",
                    (d["NDB_NO"],)
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

    # ── Step 2: Update food-portions (all 3 copies) ───────────────────────────
    print()
    print("=== Step 2: Update food-portions-complete.csv (3 copies) ===")
    _update_fp_file(FP_ROOT,  is_56col=False, dry=dry)
    print()
    _update_fp_file(FP_DOCS,  is_56col=False, dry=dry)
    print()
    _update_fp_file(FP_SRC,   is_56col=True,  dry=dry)

    # ── Step 3: Update ledger ─────────────────────────────────────────────────
    print()
    print("=== Step 3: Update ingredients_ledger.csv ===")
    _update_ledger(dry=dry)

    print()
    print("Done." if not dry else "Dry run complete. Re-run with --commit to apply.")


if __name__ == "__main__":
    main()
