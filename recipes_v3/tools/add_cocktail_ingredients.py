#!/usr/bin/env python3
"""
Add cocktail mixer/spirit ingredients:
  - 2 custom NDB inserts (14733 sparkling_wine, 14734 ginger_beer)
  - 20 ledger entries (spirit aliases + SR Legacy mixers)
  - 5 food-portions entries (14733, 14734, 14155, 11540, 14400)

Run: python recipes_v3/tools/add_cocktail_ingredients.py [--commit]
Default: dry-run (prints plan, writes nothing).
"""

import argparse
import csv
import os
import sys
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
LEDGER = ROOT / "recipes_v3/data/ingredients_ledger.csv"
FP_ROOT = ROOT / "food-portions-complete.csv"
FP_SRC  = ROOT / "src/lib/data/food-portions-complete.csv"
FP_DOCS = ROOT / "docs/food-portions-complete.csv"

# ─── Custom NDB definitions ──────────────────────────────────────────────────

CUSTOM_NDBS = [
    {
        "NDB_NO": "14733",
        "Long_Desc": "Alcoholic beverage, wine, sparkling, brut (champagne, prosecco)",
        "FdGrp_Cd": "1400",
        "Energy_KCal": 73.0,
        "Energy_KJ": 305.0,
        "Protein": 0.0,
        "TotalLipidFat": 0.0,
        "Carbohydrate": 1.5,
        "FiberTotalDietary": 0.0,
        "SugarsTotal": 0.9,
        "AlcholEthyl": 9.5,
        "Water": 88.9,
        "Ash": 0.1,
        # M1 = 1 fl oz (wine density ~0.99)
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 29.4,
        # M2 = 1 glass (5 fl oz)
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "glass (5 fl oz)", "M2_Gm_Wgt": 147.0,
        # M3 = 1 bottle (750 ml)
        "M3_Seq": 3, "M3_Amt": 1.0, "M3_Desc": "bottle (750 ml)", "M3_Gm_Wgt": 742.5,
    },
    {
        "NDB_NO": "14734",
        "Long_Desc": "Beverages, carbonated, ginger beer, non-alcoholic",
        "FdGrp_Cd": "1400",
        "Energy_KCal": 41.0,
        "Energy_KJ": 172.0,
        "Protein": 0.0,
        "TotalLipidFat": 0.0,
        "Carbohydrate": 9.8,
        "FiberTotalDietary": 0.0,
        "SugarsTotal": 9.8,
        "AlcholEthyl": 0.0,
        "Water": 90.2,
        "Ash": 0.1,
        # M1 = 1 fl oz (density ~1.04)
        "M1_Seq": 1, "M1_Amt": 1.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 30.8,
        # M2 = 1 can (12 fl oz)
        "M2_Seq": 2, "M2_Amt": 1.0, "M2_Desc": "can (12 fl oz)", "M2_Gm_Wgt": 370.0,
    },
]

# ─── Ledger entries ───────────────────────────────────────────────────────────
# Format: ingredient_key, ndb_no, food_word, default_long_desc, default_display_name,
#         common_unit, common_unit_grams, notes

LEDGER_ENTRIES = [
    # ── Spirit display aliases → NDB 14037 ──
    ("cognac",      "14037", "TEQUILA",  "Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", "cognac",   "fl oz", "27.8", "cocktail ingredient; proxy NDB 14037 (cognac ≈ 80-proof brandy) 2026-06-24"),
    ("pisco",       "14037", "TEQUILA",  "Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", "pisco",    "fl oz", "27.8", "cocktail ingredient; proxy NDB 14037 (pisco ≈ 80-proof distilled) 2026-06-24"),
    ("mezcal",      "14037", "TEQUILA",  "Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", "mezcal",   "fl oz", "27.8", "cocktail ingredient; proxy NDB 14037 (mezcal ≈ 80-proof agave spirit) 2026-06-24"),
    ("cachaca",     "14037", "TEQUILA",  "Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", "cachaça",  "fl oz", "27.8", "cocktail ingredient; proxy NDB 14037 (cachaça ≈ 80-proof cane spirit) 2026-06-24"),
    ("calvados",    "14037", "TEQUILA",  "Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof", "calvados", "fl oz", "27.8", "cocktail ingredient; proxy NDB 14037 (calvados ≈ 80-proof apple brandy) 2026-06-24"),
    # ── Whiskey display aliases → NDB 14052 ──
    ("scotch_whisky","14052","WHISKEY86","Alcoholic beverage, distilled, whiskey, 86 proof", "scotch whisky", "fl oz", "27.8", "cocktail ingredient; proxy NDB 14052 2026-06-24"),
    ("rye_whiskey", "14052", "WHISKEY86","Alcoholic beverage, distilled, whiskey, 86 proof", "rye whiskey",  "fl oz", "27.8", "cocktail ingredient; proxy NDB 14052 2026-06-24"),
    ("bourbon",     "14052", "WHISKEY86","Alcoholic beverage, distilled, whiskey, 86 proof", "bourbon",      "fl oz", "27.8", "cocktail ingredient; proxy NDB 14052 2026-06-24"),
    # ── Rum display aliases → NDB 14050 ──
    ("dark_rum",    "14050", "RUM",      "Alcoholic beverage, distilled, rum, 80 proof", "dark rum",  "fl oz", "27.8", "cocktail ingredient; proxy NDB 14050 2026-06-24"),
    ("light_rum",   "14050", "RUM",      "Alcoholic beverage, distilled, rum, 80 proof", "light rum", "fl oz", "27.8", "cocktail ingredient; proxy NDB 14050 2026-06-24"),
    # ── Custom NDB entries ──
    ("sparkling_wine","14733","SPARKLINGWINE","Alcoholic beverage, wine, sparkling, brut (champagne, prosecco)", "sparkling wine", "fl oz", "29.4", "custom NDB 14733; 12% ABV brut champagne/prosecco 2026-06-24"),
    ("ginger_beer", "14734", "GINGERBEER","Beverages, carbonated, ginger beer, non-alcoholic", "ginger beer", "fl oz", "30.8", "custom NDB 14734; non-alcoholic ginger beer (Fever-Tree) 2026-06-24"),
    # ── SR Legacy entries needing only a ledger row ──
    ("tonic_water",     "14155","TONICWATER",    "Beverages, Carbonated beverage, tonic water",                          "tonic water",     "fl oz", "30.2", "SR Legacy; cocktail ingredient 2026-06-24"),
    ("grapefruit_juice","9123", "GRAPEFRUITJUICE","Grapefruit juice, white, canned or bottled, unsweetened",              "grapefruit juice","fl oz", "30.8", "SR Legacy; cocktail ingredient 2026-06-24"),
    ("tomato_juice",    "11540","TOMATOJUICE",    "Tomato juice, canned, with salt added",                                "tomato juice",    "fl oz", "30.2", "SR Legacy; cocktail ingredient 2026-06-24"),
    ("cola",            "14148","COLA",           "Beverages, carbonated, cola, regular",                                 "cola",            "fl oz", "30.8", "SR Legacy; cocktail ingredient 2026-06-24"),
    ("sherry_dry",      "14536","WINEDESSERTDRY", "Alcoholic beverage, wine, dessert, dry",                               "sherry",          "fl oz", "29.3", "SR Legacy; cocktail ingredient 2026-06-24"),
    ("port_wine_sweet", "14057","WINEDESSERTSWEET","Alcoholic beverage, wine, dessert, sweet",                            "port wine",       "fl oz", "30.5", "SR Legacy; cocktail ingredient 2026-06-24"),
    # ── Bitters (angostura is significant in Trinidad Sour: 22.5 ml) ──
    # Trinidad Sour uses NDB 14037 proxy (same ABV ballpark); 44.7% ABV like generic 80-proof
    # Modeled via whiskey_86proof as closest match in proof-range
]

# ─── Food-portions rows (root/docs = 55 cols, src/lib/data = 56 cols) ────────
# Only needed for NDBs not already in food-portions: 14733, 14734, 14155, 11540, 14400

# Columns (root/docs, 55):
# word,display,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,
# cal_100g,pro_100g,fat_100g,carb_100g,fib_100g,h2o_100g,sug_100g,
# M0_Amt,M0_Desc,M0_Gm, M1_Amt,M1_Desc,M1_Gm, M2_Amt,M2_Desc,M2_Gm,
# M3–M12 (27 more empty cols)

def _fp_row_55(word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug,
               m1_amt, m1_desc, m1_gm, m2_amt="", m2_desc="", m2_gm=""):
    """Build a 55-column food-portions row (root/docs format)."""
    row = [
        word, display, "beverage", "", "", "", "",
        ndb, usda_desc,
        cal, pro, fat, carb, fib, h2o, sug,
        # M0 = custom (g) 100g standard
        "1.0", "custom (g)", "100.0",
        # M1
        str(m1_amt), m1_desc, str(m1_gm),
        # M2 (optional)
        str(m2_amt), m2_desc, str(m2_gm),
    ]
    # Pad to 55 columns with empty strings
    while len(row) < 55:
        row.append("")
    return row

def _fp_row_56(word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug,
               m1_amt, m1_desc, m1_gm, m2_amt="", m2_desc="", m2_gm=""):
    """Build a 56-column food-portions row (src/lib/data format, has 'synonyms' col at index 2)."""
    row = [
        word, display, "",  # word, display, synonyms
        "beverage", "", "", "",  # group1-4
        "",  # has_recipe
        ndb, usda_desc,
        cal, pro, fat, carb, fib, h2o, sug,
        "1.0", "custom (g)", "100.0",
        str(m1_amt), m1_desc, str(m1_gm),
        str(m2_amt), m2_desc, str(m2_gm),
    ]
    while len(row) < 56:
        row.append("")
    return row

NEW_FP_ENTRIES = [
    # (word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug, m1_amt, m1_desc, m1_gm, m2_amt, m2_desc, m2_gm)
    ("SPARKLINGWINE", "Sparkling Wine", "14733",
     "Alcoholic beverage, wine, sparkling, brut (champagne, prosecco)",
     73.0, 0.0, 0.0, 1.5, 0.0, 88.9, 0.9,
     1.0, "fl oz", 29.4, 1.0, "glass (5 fl oz)", 147.0),
    ("GINGERBEER", "Ginger Beer", "14734",
     "Beverages, carbonated, ginger beer, non-alcoholic",
     41.0, 0.0, 0.0, 9.8, 0.0, 90.2, 9.8,
     1.0, "fl oz", 30.8, 1.0, "can (12 fl oz)", 370.0),
    ("TONICWATER", "Tonic Water", "14155",
     "Beverages, Carbonated beverage, tonic water",
     34.0, 0.0, 0.0, 8.8, 0.0, 91.1, 8.8,
     1.0, "fl oz", 30.2, 1.0, "can (12 fl oz)", 362.0),
    ("TOMATOJUICE", "Tomato Juice", "11540",
     "Tomato juice, canned, with salt added",
     17.0, 0.76, 0.05, 3.53, 0.4, 94.24, 2.58,
     1.0, "fl oz", 30.2, 1.0, "cup", 243.0),
    # COLA (14148) already in food-portions — no entry needed here
]

# ─── DB helpers ──────────────────────────────────────────────────────────────

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

def _ndb_values(d):
    return (
        d["NDB_NO"], d["Long_Desc"], d["FdGrp_Cd"],
        d["Energy_KCal"], d["Energy_KJ"], d["Protein"], d["TotalLipidFat"],
        d["Carbohydrate"], d["FiberTotalDietary"], d["SugarsTotal"],
        d["AlcholEthyl"], d["Water"], d["Ash"],
        d.get("M1_Seq"), d.get("M1_Amt"), d.get("M1_Desc"), d.get("M1_Gm_Wgt"),
        d.get("M2_Seq"), d.get("M2_Amt"), d.get("M2_Desc"), d.get("M2_Gm_Wgt"),
        d.get("M3_Seq"), d.get("M3_Amt"), d.get("M3_Desc"), d.get("M3_Gm_Wgt"),
    )

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--commit", action="store_true")
    args = ap.parse_args()
    dry = not args.commit

    print(f"{'DRY RUN' if dry else 'COMMIT'} — add_cocktail_ingredients.py")
    print()

    # ── 1. Custom NDB inserts ────────────────────────────────────────────────
    print("=== Step 1: Custom NDB inserts (14733, 14734) ===")
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()
    for d in CUSTOM_NDBS:
        cur.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_NO=?", (d["NDB_NO"],))
        exists = cur.fetchone()[0]
        if exists:
            print(f"  NDB {d['NDB_NO']} already exists — skip")
        else:
            print(f"  INSERT NDB {d['NDB_NO']}: {d['Long_Desc'][:60]}")
            if not dry:
                cur.execute(INSERT_SQL, _ndb_values(d))
    if not dry:
        conn.commit()
    conn.close()

    # Turso sync
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
        print("  WARNING: TURSO_SR28_URL/TOKEN not found in .env.local — skipping Turso sync")
    else:
        try:
            import libsql_experimental as libsql
            tconn = libsql.connect(turso_url, auth_token=turso_token)
            for d in CUSTOM_NDBS:
                row = tconn.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_NO=?", (d["NDB_NO"],)).fetchone()
                if row and row[0]:
                    print(f"  NDB {d['NDB_NO']} already in Turso — skip")
                else:
                    print(f"  Turso INSERT NDB {d['NDB_NO']}")
                    if not dry:
                        tconn.execute(INSERT_SQL, _ndb_values(d))
            if not dry:
                tconn.commit()
            print("  Turso sync done")
        except Exception as e:
            print(f"  ERROR syncing to Turso: {e}")

    # ── 2. Ledger entries ────────────────────────────────────────────────────
    print()
    print(f"=== Step 2: Ledger additions ({len(LEDGER_ENTRIES)} entries) ===")
    existing_keys = set()
    with open(LEDGER, newline="") as f:
        for row in csv.DictReader(f):
            existing_keys.add(row["ingredient_key"])

    to_add = []
    for entry in LEDGER_ENTRIES:
        key = entry[0]
        if key in existing_keys:
            print(f"  SKIP (exists): {key}")
        else:
            print(f"  ADD: {key} → NDB {entry[1]}, food_word={entry[2]}, display='{entry[4]}'")
            to_add.append(entry)

    if to_add and not dry:
        with open(LEDGER, "a", newline="") as f:
            w = csv.writer(f)
            for row in to_add:
                w.writerow(list(row))
        print(f"  Wrote {len(to_add)} rows to ledger")

    # ── 3. Food-portions additions ────────────────────────────────────────────
    print()
    print(f"=== Step 3: Food-portions additions ({len(NEW_FP_ENTRIES)} entries) ===")

    for fp_path, ncols, row_fn in [
        (FP_ROOT,  55, _fp_row_55),
        (FP_DOCS,  55, _fp_row_55),
        (FP_SRC,   56, _fp_row_56),
    ]:
        existing_words = set()
        existing_ndbs = set()
        with open(fp_path, newline="") as f:
            reader = csv.reader(f)
            next(reader)  # skip header
            for row in reader:
                if row:
                    existing_words.add(row[0])
                    ndb_col = 8 if ncols == 56 else 7
                    if len(row) > ndb_col:
                        existing_ndbs.add(row[ndb_col])

        print(f"  {fp_path.name} ({ncols} cols): {len(existing_words)} existing entries")
        added = 0
        rows_to_add = []
        for entry in NEW_FP_ENTRIES:
            word = entry[0]
            ndb = entry[2]
            if word in existing_words:
                print(f"    SKIP (word exists): {word}")
            elif ndb in existing_ndbs:
                print(f"    SKIP (NDB exists): {word} / {ndb}")
            else:
                print(f"    ADD: {word} (NDB {ndb})")
                rows_to_add.append(row_fn(*entry))
                added += 1

        if rows_to_add and not dry:
            with open(fp_path, "a", newline="") as f:
                w = csv.writer(f)
                for row in rows_to_add:
                    w.writerow(row)
            print(f"    Wrote {added} rows to {fp_path.name}")

    # ── 4. Regenerate food-portions.ts ───────────────────────────────────────
    print()
    print("=== Step 4: Regenerate food-portions.ts ===")
    convert_script = ROOT / "scripts/dev/convert_to_ts.py"
    if not dry:
        import subprocess
        result = subprocess.run(
            [sys.executable, str(convert_script)],
            capture_output=True, text=True, cwd=str(ROOT)
        )
        if result.returncode == 0:
            print("  food-portions.ts regenerated OK")
        else:
            print(f"  ERROR: {result.stderr[:200]}")
    else:
        print(f"  (dry run — would run {convert_script.name})")

    print()
    print("Done." if not dry else "Dry run complete. Re-run with --commit to apply.")


if __name__ == "__main__":
    main()
