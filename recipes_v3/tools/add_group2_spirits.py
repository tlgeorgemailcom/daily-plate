"""
Group 2 — 10 named 80-proof spirit NDBs (14754–14763).

All are 40% ABV (80 proof). Values from SR Legacy NDB 14037 (gin/rum/vodka/whiskey, 80 proof):
  E = 231 kcal, Alc = 33.4g, W = 66.6g, C = 0, Su = 0, P = 0, F = 0

User-provided ABV confirmation 2026-06-24:
  white_rum         40% ABV (confirmed)
  goslings_rum      40% ABV / 80 proof (confirmed; 151-proof variant not included)
  cuban_rum         40% ABV — Havana Club Añejo Blanco / 3 Años (confirmed)
  jamaican_rum      40% ABV — Appleton Estate Signature (confirmed)
  irish_whiskey     40% ABV minimum by law (confirmed)
  dry_gin           40% ABV standard London Dry (confirmed)
  vanilla_vodka     40% ABV — Absolut Vanilia (confirmed; 38% variant used 40% here)
  vodka_citron      40% ABV (confirmed)
  grappa            40% ABV — majority at 40-45%; using 40% standard entry (confirmed)
  cuban_aguardiente 40% ABV (confirmed)
"""

import csv, os, sqlite3, sys

DRY_RUN = "--commit" not in sys.argv
ROOT    = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"

# ── 80-proof standard values (SR Legacy NDB 14037) ────────────────────────────
E80  = 231.0;  EJ80 = 967.0
ALC80 = 33.4;  W80  = 66.6
ZERO  = 0.0

# ── M-series (same as BOURBON row in food-portions) ──────────────────────────
M0_AMT="1.0"; M0_DESC="custom (g)";           M0_GM="100.0"
M1_AMT="1.0"; M1_DESC="fl oz";                M1_GM="27.0"
M2_AMT="1.0"; M2_DESC="jigger (1.5 fl oz)";   M2_GM="40.5"

EMPTY = ""

# ── New NDB entries ───────────────────────────────────────────────────────────
ENTRIES = [
    {
        "ndb":       "14754",
        "long_desc": "Alcoholic beverage, rum, white, 80 proof",
        "key":       "white_rum",
        "food_word": "WHITERUM",
        "display":   "White Rum",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14755",
        "long_desc": "Alcoholic beverage, rum, dark, Goslings Black Seal, 80 proof",
        "key":       "goslings_rum",
        "food_word": "GOSLINGSRUM",
        "display":   "Goslings Black Seal Rum",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14756",
        "long_desc": "Alcoholic beverage, rum, Cuban, Havana Club, 80 proof",
        "key":       "cuban_rum",
        "food_word": "CUBANRUM",
        "display":   "Cuban Rum",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14757",
        "long_desc": "Alcoholic beverage, rum, Jamaican, Appleton, 80 proof",
        "key":       "jamaican_rum",
        "food_word": "JAMAICANRUM",
        "display":   "Jamaican Rum",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14758",
        "long_desc": "Alcoholic beverage, whiskey, Irish, 80 proof",
        "key":       "irish_whiskey",
        "food_word": "IRISHWHISKEY",
        "display":   "Irish Whiskey",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14759",
        "long_desc": "Alcoholic beverage, gin, London dry, 80 proof",
        "key":       "dry_gin",
        "food_word": "LONDONDRYGIN",
        "display":   "London Dry Gin",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14760",
        "long_desc": "Alcoholic beverage, vodka, vanilla, 80 proof",
        "key":       "vanilla_vodka",
        "food_word": "VANILLAVODKA",
        "display":   "Vanilla Vodka",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14761",
        "long_desc": "Alcoholic beverage, vodka, citron, lemon, 80 proof",
        "key":       "vodka_citron",
        "food_word": "CITRONVODKA",
        "display":   "Citron Vodka",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14762",
        "long_desc": "Alcoholic beverage, grappa, Italian pomace brandy, 80 proof",
        "key":       "grappa",
        "food_word": "GRAPPA",
        "display":   "Grappa",
        "notes":     "new named NDB 2026-06-24",
    },
    {
        "ndb":       "14763",
        "long_desc": "Alcoholic beverage, aguardiente, Cuban cane spirit, 80 proof",
        "key":       "cuban_aguardiente",
        "food_word": "AGUARDIENTE",
        "display":   "Cuban Aguardiente",
        "notes":     "new named NDB 2026-06-24",
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

# ── Step 1: comboo.db ─────────────────────────────────────────────────────────
def step_local(dry: bool):
    print(f"\n=== Step 1: {'DRY RUN' if dry else 'INSERT'} 10 NDBs in comboo.db ===")
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()
    for e in ENTRIES:
        vals = (
            e["ndb"], e["long_desc"],
            E80, EJ80,
            ZERO, ZERO, ZERO, ZERO, ZERO,
            ALC80, W80, ZERO,
            1, M1_AMT, M1_DESC, M1_GM,
            2, M2_AMT, M2_DESC, M2_GM,
            3, EMPTY, EMPTY, EMPTY,
        )
        label = f"  {'(DRY) ' if dry else ''}INSERT {e['ndb']}: {e['long_desc'][:60]}"
        if not dry:
            cur.execute(INSERT_SQL, vals)
            if cur.rowcount:
                print(label)
            else:
                print(f"  SKIP (already exists): {e['ndb']}")
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
            print(f"  (DRY) INSERT {e['ndb']}: {e['long_desc'][:60]}")
        return
    tconn = libsql.connect("comboo_g2.db", sync_url=url, auth_token=token)
    tconn.sync()
    for e in ENTRIES:
        vals = (
            e["ndb"], e["long_desc"],
            E80, EJ80,
            ZERO, ZERO, ZERO, ZERO, ZERO,
            ALC80, W80, ZERO,
            1, M1_AMT, M1_DESC, M1_GM,
            2, M2_AMT, M2_DESC, M2_GM,
            3, EMPTY, EMPTY, EMPTY,
        )
        tconn.execute(INSERT_SQL, vals)
        print(f"  INSERT {e['ndb']}: {e['long_desc'][:60]}")
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
        "bar", EMPTY, EMPTY, EMPTY,   # group1-4
        EMPTY,                         # has_recipe
        e["ndb"], e["long_desc"],
        str(E80), str(ZERO), str(ZERO), str(ZERO), str(ZERO),
        str(W80), str(ZERO),           # cal pro fat carb fib h2o sug
        M0_AMT, M0_DESC, M0_GM,       # M0
        M1_AMT, M1_DESC, M1_GM,       # M1
        M2_AMT, M2_DESC, M2_GM,       # M2
        EMPTY, EMPTY, EMPTY,           # M3
        EMPTY, EMPTY, EMPTY,           # M4
        EMPTY, EMPTY, EMPTY,           # M5
        EMPTY, EMPTY, EMPTY,           # M6
        EMPTY, EMPTY, EMPTY,           # M7
        EMPTY, EMPTY, EMPTY,           # M8
        EMPTY, EMPTY, EMPTY,           # M9
        EMPTY, EMPTY, EMPTY,           # M10
        EMPTY, EMPTY, EMPTY,           # M11
        EMPTY, EMPTY, EMPTY,           # M12
    ]

def make_row_56(e: dict) -> list:
    """56-col: inserts empty synonyms column after display."""
    r = make_row_55(e)
    return r[:2] + [EMPTY] + r[2:]

def _check_not_duplicate(path: str, words: set, col: int = 0) -> bool:
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.reader(f):
            if row and row[col] in words:
                print(f"  WARNING: {row[col]} already in {path} — skipping append")
                return False
    return True

def step_fp(dry: bool):
    print(f"\n=== Step 3: {'DRY RUN' if dry else 'APPEND'} food-portions-complete.csv ===")
    words = {e["food_word"] for e in ENTRIES}
    for path in FP_55:
        for e in ENTRIES:
            print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(path)}: {e['food_word']} → NDB {e['ndb']}")
        if not dry:
            with open(path, 'a', newline='', encoding='utf-8') as f:
                w = csv.writer(f)
                for e in ENTRIES:
                    w.writerow(make_row_55(e))
            print(f"  Appended {len(ENTRIES)} rows to {os.path.basename(path)}")
    for e in ENTRIES:
        print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(FP_56)}: {e['food_word']} → NDB {e['ndb']}")
    if not dry:
        with open(FP_56, 'a', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for e in ENTRIES:
                w.writerow(make_row_56(e))
        print(f"  Appended {len(ENTRIES)} rows to {os.path.basename(FP_56)}")

# ── Step 4: ingredients_ledger.csv ───────────────────────────────────────────
LEDGER = os.path.join(ROOT, "recipes_v3", "data", "ingredients_ledger.csv")

def step_ledger(dry: bool):
    print(f"\n=== Step 4: {'DRY RUN' if dry else 'APPEND'} ingredients_ledger.csv ===")
    for e in ENTRIES:
        print(f"  {'(DRY) ' if dry else ''}ADD: {e['key']} → NDB {e['ndb']}, food_word={e['food_word']}")
    if not dry:
        with open(LEDGER, 'a', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for e in ENTRIES:
                w.writerow([
                    e["key"], e["ndb"], e["food_word"],
                    e["long_desc"], e["display"],
                    "fl oz", "27.0", e["notes"],
                ])
        print(f"  Appended {len(ENTRIES)} rows to ledger")

# ── main ──────────────────────────────────────────────────────────────────────
label = "DRY RUN" if DRY_RUN else "COMMIT"
print(f"{label} — add_group2_spirits.py  (NDBs 14754–14763)")

step_local(DRY_RUN)
step_turso(DRY_RUN)
step_fp(DRY_RUN)
step_ledger(DRY_RUN)

if DRY_RUN:
    print("\nDry run complete. Re-run with --commit to apply.")
else:
    if os.path.exists("comboo_g2.db"):
        os.remove("comboo_g2.db")
    print("\nDone. Next: python3 scripts/dev/convert_to_ts.py && python recipes_v3/tools/validate_ledger.py")
