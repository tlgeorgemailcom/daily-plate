"""
add_group5.py — Group 5: non-alcoholic cocktail mixers / sweeteners

  NDB 14773 — Syrup, demerara sugar, cocktail mixer          (DEMERARA)
    Label: 41 kcal / 11g C per 1 tbsp serving → 273 kcal / 73g C per 100ml
  NDB 14774 — Cordial, elderflower, non-alcoholic, undiluted  (ELDERFLOWERCORDIAL)
    Belvoir-style: ~215 kcal/100ml, ~53g sugar/100ml (user data: 17–45 kcal/100ml diluted → undiluted ×5–10)
  NDB 14775 — Cordial, chamomile, non-alcoholic, botanical    (CHAMOMILECORDIAL)
    Label: 30–60 kcal/fl oz, 8–15g C/fl oz → midpoint 45 kcal/fl oz → 152 kcal/100ml, 38g C/100ml
  NDB 14776 — Puree, white peach, unsweetened                 (WHITEPEACHPUREE)
    Label: ~45 kcal/100g, 9g C, 1.25g Fi, 8g Su, 0.5g P, 0g F
  NDB 14777 — Flavoring, orange flower water                  (ORANGEFLOWERWATER)
    Essentially water + trace aromatics → 0 kcal
  NDB 14778 — Sugar, vanilla, granulated, flavored            (VANILLASUGAR)
    Label: ~385 kcal/100g, 96g C, all sugars; identical to granulated sugar + vanilla

Usage:
  python recipes_v3/tools/add_group5.py            # dry run
  python recipes_v3/tools/add_group5.py --commit   # write
"""

import csv, os, sqlite3, sys

DRY_RUN  = "--commit" not in sys.argv
ROOT     = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH  = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
EMPTY    = ""
LEDGER   = os.path.join(ROOT, "recipes_v3", "data", "ingredients_ledger.csv")
FP_55    = [
    os.path.join(ROOT, "food-portions-complete.csv"),
    os.path.join(ROOT, "docs", "food-portions-complete.csv"),
]
FP_56    = os.path.join(ROOT, "src", "lib", "data", "food-portions-complete.csv")

# ── NDB definitions ───────────────────────────────────────────────────────────
# Each entry: ndb, long_desc, fdgrp, key, food_word, display,
#             E, EJ, P, F, C, Fi, Su, Alc, W, Ash,
#             m1_desc, m1_gm, m2_desc, m2_gm, m3_desc, m3_gm,
#             group1, notes
NEW_NDBS = [
    {
        "ndb": "14773",
        "long_desc": "Syrup, demerara sugar, cocktail mixer",
        "fdgrp": "1900",
        "key": "demerara_syrup",
        "food_word": "DEMERARA",
        "display": "Demerara Syrup",
        "E": 273.0, "EJ": 1142.0,
        "P": 0.0, "F": 0.0, "C": 73.0, "Fi": 0.0, "Su": 73.0,
        "Alc": 0.0, "W": 27.0, "Ash": 0.0,
        "m1_desc": "fl oz",             "m1_gm": 30.0,
        "m2_desc": "tbsp",              "m2_gm": 15.0,
        "m3_desc": "jigger (1.5 fl oz)","m3_gm": 45.0,
        "group1": "sweetener",
        "notes": "label: 41 kcal/tbsp, 11g C/tbsp → 1:1 simple syrup from demerara sugar 2026-06-24",
    },
    {
        "ndb": "14774",
        "long_desc": "Cordial, elderflower, non-alcoholic, undiluted",
        "fdgrp": "1400",
        "key": "elderflower_cordial",
        "food_word": "ELDERFLOWERCORDIAL",
        "display": "Elderflower Cordial",
        "E": 215.0, "EJ": 899.0,
        "P": 0.0, "F": 0.0, "C": 53.0, "Fi": 0.0, "Su": 53.0,
        "Alc": 0.0, "W": 45.0, "Ash": 2.0,
        "m1_desc": "fl oz",             "m1_gm": 30.0,
        "m2_desc": "tbsp",              "m2_gm": 15.0,
        "m3_desc": "jigger (1.5 fl oz)","m3_gm": 45.0,
        "group1": "bar",
        "notes": "non-alcoholic undiluted concentrate; user data 17-45 kcal/100ml diluted → undiluted ~215 2026-06-24",
    },
    {
        "ndb": "14775",
        "long_desc": "Cordial, chamomile, non-alcoholic, botanical",
        "fdgrp": "1400",
        "key": "chamomile_cordial",
        "food_word": "CHAMOMILECORDIAL",
        "display": "Chamomile Cordial",
        "E": 152.0, "EJ": 636.0,
        "P": 0.0, "F": 0.0, "C": 38.0, "Fi": 0.0, "Su": 38.0,
        "Alc": 0.0, "W": 62.0, "Ash": 0.0,
        "m1_desc": "fl oz",             "m1_gm": 30.0,
        "m2_desc": "tbsp",              "m2_gm": 15.0,
        "m3_desc": "jigger (1.5 fl oz)","m3_gm": 45.0,
        "group1": "bar",
        "notes": "label: 30-60 kcal/fl oz midpoint 45 → 152 kcal/100ml; 8-15g C/fl oz midpoint → 38g/100ml 2026-06-24",
    },
    {
        "ndb": "14776",
        "long_desc": "Puree, white peach, unsweetened",
        "fdgrp": "0900",
        "key": "white_peach_puree",
        "food_word": "WHITEPEACHPUREE",
        "display": "White Peach Puree",
        "E": 45.0, "EJ": 188.0,
        "P": 0.5, "F": 0.0, "C": 9.0, "Fi": 1.25, "Su": 8.0,
        "Alc": 0.0, "W": 90.0, "Ash": 0.25,
        "m1_desc": "fl oz",  "m1_gm": 30.0,
        "m2_desc": "tbsp",   "m2_gm": 15.0,
        "m3_desc": "cup",    "m3_gm": 240.0,
        "group1": "fruit",
        "notes": "label: ~45 kcal/100g, 9g C, 1.25g Fi, 8g Su, 0.5g P, 0g F 2026-06-24",
    },
    {
        "ndb": "14777",
        "long_desc": "Flavoring, orange flower water, orange blossom water",
        "fdgrp": "1400",
        "key": "orange_flower_water",
        "food_word": "ORANGEFLOWERWATER",
        "display": "Orange Flower Water",
        "E": 0.0, "EJ": 0.0,
        "P": 0.0, "F": 0.0, "C": 0.0, "Fi": 0.0, "Su": 0.0,
        "Alc": 0.0, "W": 100.0, "Ash": 0.0,
        "m1_desc": "tsp",    "m1_gm": 5.0,
        "m2_desc": "tbsp",   "m2_gm": 15.0,
        "m3_desc": "fl oz",  "m3_gm": 30.0,
        "group1": "bar",
        "notes": "orange blossom water; used in dashes/tsp; essentially water + trace aromatics 2026-06-24",
    },
    {
        "ndb": "14778",
        "long_desc": "Sugar, vanilla, granulated, flavored with vanilla",
        "fdgrp": "1900",
        "key": "vanilla_sugar",
        "food_word": "VANILLASUGAR",
        "display": "Vanilla Sugar",
        "E": 385.0, "EJ": 1611.0,
        "P": 0.0, "F": 0.0, "C": 96.0, "Fi": 0.0, "Su": 96.0,
        "Alc": 0.0, "W": 3.0, "Ash": 1.0,
        "m1_desc": "tsp",    "m1_gm": 4.2,
        "m2_desc": "tbsp",   "m2_gm": 12.6,
        "m3_desc": "cup",    "m3_gm": 200.0,
        "group1": "sweetener",
        "notes": "granulated sugar + vanilla; label: ~385 kcal/100g, 96g C 2026-06-24",
    },
]

# ── SQL ───────────────────────────────────────────────────────────────────────
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
) VALUES (?,?,?, ?,?, ?,?,?,?,?, ?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, 'n')
""".strip()

def make_vals(e):
    return (
        e["ndb"], e["long_desc"], e["fdgrp"],
        e["E"], e["EJ"],
        e["P"], e["F"], e["C"], e["Fi"], e["Su"],
        e["Alc"], e["W"], e["Ash"],
        1, "1.0", e["m1_desc"], str(e["m1_gm"]),
        2, "1.0", e["m2_desc"], str(e["m2_gm"]),
        3, "1.0", e["m3_desc"], str(e["m3_gm"]),
    )

# ── food-portions row builders ────────────────────────────────────────────────
def make_row_55(e):
    # 55-column format (root + docs/): no synonyms column
    return [
        e["food_word"], e["display"],
        e["group1"], EMPTY, EMPTY, EMPTY, EMPTY,   # group1-4, has_recipe
        e["ndb"], e["long_desc"],
        str(e["E"]), str(e["P"]), str(e["F"]),
        str(e["C"]), str(e["Fi"]), str(e["W"]), str(e["Su"]),
        "1.0", "custom (g)", "100.0",              # M0
        "1.0", e["m1_desc"], str(e["m1_gm"]),      # M1
        "1.0", e["m2_desc"], str(e["m2_gm"]),      # M2
        "1.0", e["m3_desc"], str(e["m3_gm"]),      # M3
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,   # M4-M5
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,   # M6-M7
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,   # M8-M9
        EMPTY, EMPTY, EMPTY,                        # M10
    ]

def make_row_56(e):
    # 56-column format (src/lib/data/): synonyms column at index 2
    r = make_row_55(e)
    return r[:2] + [EMPTY] + r[2:]

# ── helpers ───────────────────────────────────────────────────────────────────
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

# ── Step 1: comboo.db ─────────────────────────────────────────────────────────
def step_local(dry):
    print(f"\n=== Step 1: {'DRY RUN' if dry else 'INSERT'} {len(NEW_NDBS)} new NDBs in comboo.db ===")
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()
    for e in NEW_NDBS:
        label = f"  {'(DRY) ' if dry else ''}INSERT {e['ndb']}: {e['long_desc'][:70]}"
        if not dry:
            cur.execute(INSERT_SQL, make_vals(e))
            print(label + (" ✓" if cur.rowcount else " SKIP (already exists)"))
        else:
            print(label)
    if not dry:
        conn.commit()
    conn.close()

# ── Step 2: Turso ─────────────────────────────────────────────────────────────
def step_turso(dry):
    print(f"\n=== Step 2: {'DRY RUN' if dry else 'INSERT'} Turso ({len(NEW_NDBS)} new NDBs) ===")
    import libsql_experimental as libsql
    url, token = _load_env()
    if not url or not token:
        print("  WARNING: TURSO creds not found"); return
    if dry:
        for e in NEW_NDBS:
            print(f"  (DRY) INSERT {e['ndb']}: {e['long_desc'][:70]}")
        return
    tconn = libsql.connect("comboo_g5.db", sync_url=url, auth_token=token)
    tconn.sync()
    for e in NEW_NDBS:
        tconn.execute(INSERT_SQL, make_vals(e))
        print(f"  INSERT {e['ndb']}: {e['long_desc'][:70]}")
    tconn.commit()
    print("  Turso sync done")

# ── Step 3: food-portions rows ────────────────────────────────────────────────
def step_fp(dry):
    print(f"\n=== Step 3: {'DRY RUN' if dry else 'APPEND'} food-portions ({len(NEW_NDBS)} new NDBs) ===")
    for path in FP_55:
        for e in NEW_NDBS:
            print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(path)}: {e['food_word']} → NDB {e['ndb']}")
        if not dry:
            with open(path, 'a', newline='', encoding='utf-8') as f:
                csv.writer(f).writerows([make_row_55(e) for e in NEW_NDBS])
            print(f"  Appended {len(NEW_NDBS)} rows to {os.path.basename(path)}")
    for e in NEW_NDBS:
        print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(FP_56)}: {e['food_word']} → NDB {e['ndb']}")
    if not dry:
        with open(FP_56, 'a', newline='', encoding='utf-8') as f:
            csv.writer(f).writerows([make_row_56(e) for e in NEW_NDBS])
        print(f"  Appended {len(NEW_NDBS)} rows to {os.path.basename(FP_56)}")

# ── Step 4: ledger ────────────────────────────────────────────────────────────
def step_ledger(dry):
    print(f"\n=== Step 4: {'DRY RUN' if dry else 'APPEND'} ingredients_ledger.csv ===")
    for e in NEW_NDBS:
        print(f"  {'(DRY) ' if dry else ''}ADD: {e['key']} → NDB {e['ndb']}, food_word={e['food_word']}")
    if not dry:
        with open(LEDGER, 'a', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for e in NEW_NDBS:
                w.writerow([
                    e["key"], e["ndb"], e["food_word"],
                    e["long_desc"], e["display"],
                    e["m1_desc"], str(e["m1_gm"]),
                    e["notes"],
                ])
        print(f"  Appended {len(NEW_NDBS)} rows to ledger")

# ── main ──────────────────────────────────────────────────────────────────────
print(f"{'DRY RUN' if DRY_RUN else 'COMMIT'} — add_group5.py")
print(f"  {len(NEW_NDBS)} new NDB inserts: demerara syrup, elderflower/chamomile cordials, white peach puree, orange flower water, vanilla sugar")

step_local(DRY_RUN)
step_turso(DRY_RUN)
step_fp(DRY_RUN)
step_ledger(DRY_RUN)

if DRY_RUN:
    print("\nDry run complete. Re-run with --commit to apply.")
else:
    if os.path.exists("comboo_g5.db"):
        os.remove("comboo_g5.db")
    print("\nDone. Next: python3 scripts/dev/convert_to_ts.py && python recipes_v3/tools/validate_ledger.py")
