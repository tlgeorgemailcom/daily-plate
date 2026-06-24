"""
Group 3 — 7 spirit NDBs (14764–14770), mixed proofs.

ABV sources 2026-06-24 (user-confirmed):
  gold_jamaican_rum    80 proof / 40% ABV — confirmed
  amber_jamaican_rum   80 proof / 40% ABV — confirmed
  ron_profundo         80 proof / 40% ABV — confirmed ("ron profundo smoky abv 40%")
  ron_smoky            80 proof / 40% ABV — confirmed ("ron profundo smoky abv 40%")
  lagavulin            86 proof / 43% ABV — Lagavulin 16yr confirmed
  rhum_agricole_blanc 100 proof / 50% ABV — traditional Ti' Punch style
                        (user: "40% to 55%"; using 50% to distinguish from 80-proof
                         white rums; SR Legacy NDB 14533 = 100 proof reference)
  overproof_jamaican_rum 126 proof / 63% ABV — confirmed "universally 63% ABV"

Per-100ml nutrition (treating 100ml ≈ 100g, USDA convention):
  80 proof  E=231, Alc=33.4, W=66.6  (from SR Legacy NDB 14037)
  86 proof  E=250, Alc=35.9, W=64.1  (from SR Legacy NDB 14052)
 100 proof  E=295, Alc=42.5, W=57.5  (from SR Legacy NDB 14533)
 126 proof  E=347, Alc=49.7, W=50.3  (Alc=63ml×0.789=49.7g; E=49.7×6.98≈347)
"""

import csv, os, sqlite3, sys

DRY_RUN = "--commit" not in sys.argv
ROOT    = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"

EMPTY = ""

ENTRIES = [
    # ── 80 proof (E=231, Alc=33.4g, W=66.6g) ─────────────────────────────────
    {
        "ndb": "14764", "proof": 80,
        "long_desc": "Alcoholic beverage, rum, gold, Jamaican, 80 proof",
        "key": "gold_jamaican_rum", "food_word": "GOLDJAMAICANRUM",
        "display": "Gold Jamaican Rum",
        "E": 231.0, "EJ": 967.0, "Alc": 33.4, "W": 66.6,
    },
    {
        "ndb": "14765", "proof": 80,
        "long_desc": "Alcoholic beverage, rum, amber, Jamaican, 80 proof",
        "key": "amber_jamaican_rum", "food_word": "AMBERRUM",
        "display": "Amber Rum",
        "E": 231.0, "EJ": 967.0, "Alc": 33.4, "W": 66.6,
    },
    {
        "ndb": "14766", "proof": 80,
        "long_desc": "Alcoholic beverage, rum, Havana Club Profundo, ron oscuro, 80 proof",
        "key": "ron_profundo", "food_word": "RONPROFUNDO",
        "display": "Havana Club Profundo",
        "E": 231.0, "EJ": 967.0, "Alc": 33.4, "W": 66.6,
    },
    {
        "ndb": "14767", "proof": 80,
        "long_desc": "Alcoholic beverage, rum, Havana Club Smoky, ron ahumado, 80 proof",
        "key": "ron_smoky", "food_word": "RONSMOKY",
        "display": "Havana Club Smoky",
        "E": 231.0, "EJ": 967.0, "Alc": 33.4, "W": 66.6,
    },
    # ── 86 proof (E=250, Alc=35.9g, W=64.1g) — SR Legacy NDB 14052 values ────
    {
        "ndb": "14768", "proof": 86,
        "long_desc": "Alcoholic beverage, whisky, Scotch, single malt, Lagavulin, 86 proof",
        "key": "lagavulin", "food_word": "LAGAVULIN",
        "display": "Lagavulin Single Malt Scotch",
        "E": 250.0, "EJ": 1046.0, "Alc": 35.9, "W": 64.1,
    },
    # ── 100 proof (E=295, Alc=42.5g, W=57.5g) — SR Legacy NDB 14533 values ──
    {
        "ndb": "14769", "proof": 100,
        "long_desc": "Alcoholic beverage, rhum agricole, blanc, Martinique, 100 proof",
        "key": "rhum_agricole_blanc", "food_word": "RHUMAGRICOLE",
        "display": "Rhum Agricole Blanc",
        "E": 295.0, "EJ": 1234.0, "Alc": 42.5, "W": 57.5,
    },
    # ── 126 proof (E=347, Alc=49.7g, W=50.3g) ────────────────────────────────
    {
        "ndb": "14770", "proof": 126,
        "long_desc": "Alcoholic beverage, rum, overproof, Jamaican, 126 proof",
        "key": "overproof_jamaican_rum", "food_word": "OVERPROOFJAMAICANRUM",
        "display": "Overproof Jamaican Rum",
        "E": 347.0, "EJ": 1452.0, "Alc": 49.7, "W": 50.3,
    },
]

INSERT_SQL = """
INSERT OR IGNORE INTO DataCentralCombo (
  NDB_NO, Long_Desc, FdGrp_Cd,
  Energy_KCal, Energy_KJ,
  Protein, TotalLipidFat, Carbohydrate, FiberTotalDietary, SugarsTotal,
  AlcholEthyl, Water, Ash,
  M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt,
  M2_Seq, M2_Amt, M2_Desc, M2_Gm_Wgt,
  M3_Seq, M3_Amt, M3_Desc, M3_Gm_Wgt,
  fat
) VALUES (?,?,'1400', ?,?, ?,?,?,?,?, ?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, 'n')
""".strip()

def make_vals(e: dict) -> tuple:
    return (
        e["ndb"], e["long_desc"],
        e["E"], e["EJ"],
        0.0, 0.0, 0.0, 0.0, 0.0,
        e["Alc"], e["W"], 0.0,
        1, "1.0", "fl oz", "27.0",
        2, "1.0", "jigger (1.5 fl oz)", "40.5",
        3, EMPTY, EMPTY, EMPTY,
    )

# ── Step 1: comboo.db ─────────────────────────────────────────────────────────
def step_local(dry: bool):
    print(f"\n=== Step 1: {'DRY RUN' if dry else 'INSERT'} 7 NDBs in comboo.db ===")
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()
    for e in ENTRIES:
        label = f"  {'(DRY) ' if dry else ''}INSERT {e['ndb']} ({e['proof']}p): {e['long_desc'][:60]}"
        if not dry:
            cur.execute(INSERT_SQL, make_vals(e))
            print(label + (" ✓" if cur.rowcount else " SKIP"))
        else:
            print(label)
    if not dry:
        conn.commit()
    conn.close()

# ── Step 2: Turso ─────────────────────────────────────────────────────────────
def _load_env():
    url = token = None
    with open(os.path.join(ROOT, ".env.local")) as f:
        for line in f:
            line = line.strip()
            if line.startswith("TURSO_SR28_URL="):
                url = line.split("=", 1)[1].strip().strip('"').strip("'")
            elif line.startswith("TURSO_SR28_TOKEN="):
                token = line.split("=", 1)[1].strip().strip('"').strip("'")
    return url, token

def step_turso(dry: bool):
    print(f"\n=== Step 2: {'DRY RUN' if dry else 'INSERT'} Turso SR28 ===")
    import libsql_experimental as libsql
    url, token = _load_env()
    if not url or not token:
        print("  WARNING: TURSO_SR28_URL/TOKEN not found — skipping"); return
    if dry:
        for e in ENTRIES:
            print(f"  (DRY) INSERT {e['ndb']} ({e['proof']}p): {e['long_desc'][:60]}")
        return
    tconn = libsql.connect("comboo_g3.db", sync_url=url, auth_token=token)
    tconn.sync()
    for e in ENTRIES:
        tconn.execute(INSERT_SQL, make_vals(e))
        print(f"  INSERT {e['ndb']} ({e['proof']}p): {e['long_desc'][:60]}")
    tconn.commit()
    print("  Turso sync done")

# ── Step 3: food-portions-complete.csv (3 copies) ────────────────────────────
FP_55 = [
    os.path.join(ROOT, "food-portions-complete.csv"),
    os.path.join(ROOT, "docs", "food-portions-complete.csv"),
]
FP_56 = os.path.join(ROOT, "src", "lib", "data", "food-portions-complete.csv")

def make_row_55(e: dict) -> list:
    return [
        e["food_word"], e["display"],
        "bar", EMPTY, EMPTY, EMPTY, EMPTY,   # group1-4, has_recipe
        e["ndb"], e["long_desc"],
        str(e["E"]), "0.0", "0.0", "0.0", "0.0", str(e["W"]), "0.0",
        "1.0", "custom (g)", "100.0",        # M0
        "1.0", "fl oz", "27.0",              # M1
        "1.0", "jigger (1.5 fl oz)", "40.5", # M2
        EMPTY, EMPTY, EMPTY,                  # M3
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY,                  # M12
    ]

def make_row_56(e: dict) -> list:
    r = make_row_55(e)
    return r[:2] + [EMPTY] + r[2:]

def step_fp(dry: bool):
    print(f"\n=== Step 3: {'DRY RUN' if dry else 'APPEND'} food-portions-complete.csv ===")
    for path in FP_55:
        for e in ENTRIES:
            print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(path)}: {e['food_word']} ({e['proof']}p) → NDB {e['ndb']}")
        if not dry:
            with open(path, 'a', newline='', encoding='utf-8') as f:
                csv.writer(f).writerows([make_row_55(e) for e in ENTRIES])
            print(f"  Appended {len(ENTRIES)} rows to {os.path.basename(path)}")
    for e in ENTRIES:
        print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(FP_56)}: {e['food_word']} ({e['proof']}p) → NDB {e['ndb']}")
    if not dry:
        with open(FP_56, 'a', newline='', encoding='utf-8') as f:
            csv.writer(f).writerows([make_row_56(e) for e in ENTRIES])
        print(f"  Appended {len(ENTRIES)} rows to {os.path.basename(FP_56)}")

# ── Step 4: ingredients_ledger.csv ───────────────────────────────────────────
LEDGER = os.path.join(ROOT, "recipes_v3", "data", "ingredients_ledger.csv")

def step_ledger(dry: bool):
    print(f"\n=== Step 4: {'DRY RUN' if dry else 'APPEND'} ingredients_ledger.csv ===")
    for e in ENTRIES:
        print(f"  {'(DRY) ' if dry else ''}ADD: {e['key']} → NDB {e['ndb']}, food_word={e['food_word']} ({e['proof']}p)")
    if not dry:
        with open(LEDGER, 'a', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for e in ENTRIES:
                w.writerow([
                    e["key"], e["ndb"], e["food_word"],
                    e["long_desc"], e["display"],
                    "fl oz", "27.0", f"new named NDB {e['proof']} proof 2026-06-24",
                ])
        print(f"  Appended {len(ENTRIES)} rows to ledger")

# ── main ──────────────────────────────────────────────────────────────────────
label = "DRY RUN" if DRY_RUN else "COMMIT"
print(f"{label} — add_group3_spirits.py  (NDBs 14764–14770)")

step_local(DRY_RUN)
step_turso(DRY_RUN)
step_fp(DRY_RUN)
step_ledger(DRY_RUN)

if DRY_RUN:
    print("\nDry run complete. Re-run with --commit to apply.")
else:
    if os.path.exists("comboo_g3.db"):
        os.remove("comboo_g3.db")
    print("\nDone. Next: python3 scripts/dev/convert_to_ts.py && python recipes_v3/tools/validate_ledger.py")
