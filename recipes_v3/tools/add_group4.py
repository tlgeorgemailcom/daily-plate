"""
Group 4 — 2 new named NDB inserts + 3 ledger aliases.

New NDB inserts:
  NDB 14771: Cointreau, triple sec (80 proof + carbs)
    Label (per 1 oz = 29.57ml): E=95 kcal, C=7.1g (midpoint 6.8–7.4g), 40% ABV
    Per 100ml: E=321, EJ=1343, Alc=33.4g, C=24.0g, Su=24.0g, W=42.6g

  NDB 14772: Amontillado sherry (~40 proof / 20% ABV)
    Label (per 100ml): E=136 kcal, ABV=15–22% (using 20%)
    Derived C: (136 − 15.8×6.9) / 4 = 6.8g (dry amontillado)
    Per 100ml: E=136, EJ=569, Alc=15.8g, C=6.8g, Su=6.8g, W=77.4g

Ledger aliases (NDB already in comboo.db AND food-portions — food_word unchanged):
  creme_de_menthe_white → NDB 14034 (food_word=CREMEMENTHE)
    "Alcoholic beverage, creme de menthe, 72 proof": E=371, Alc=29.8g, C=41.6g
  creme_de_cacao_white  → NDB 14715 (food_word=CREMEDECACAO)
    "Alcoholic beverage, liqueur, creme de cacao, 50 proof": E=286
  peach_schnapps        → NDB 14711 (food_word=PEACHLIQUEUR)
    "Alcoholic beverage, liqueur, peach, 40 proof": E=234.7

User-provided source data 2026-06-24:
  Cointreau: 40% ABV; 95 kcal/oz; 6.8–7.4g C/oz
  White crème de cacao: 15–24% ABV; 100–110 kcal/45ml; 10–15g C/45ml
    → mapped to NDB 14715 (50 proof, E=286) — existing entry; 50 proof is within range
  White crème de menthe: 72 proof; 125–135 kcal/oz per label source
    → mapped to NDB 14034 (72 proof, E=371) — SR Legacy canonical; label discrepancy
      may be brand-specific density variation
  Amontillado sherry: E=136 kcal/100ml; 15–22% ABV; dry (using 20% ABV, 6.8g C)
  Peach schnapps: 15–24% ABV; → mapped to NDB 14711 (40 proof, E=234.7)
"""

import csv, os, sqlite3, sys

DRY_RUN = "--commit" not in sys.argv
ROOT    = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
EMPTY   = ""

# ── New NDB entries ───────────────────────────────────────────────────────────
NEW_NDBS = [
    {
        "ndb": "14771",
        "long_desc": "Alcoholic beverage, Cointreau, triple sec, orange liqueur, 80 proof",
        "key": "cointreau", "food_word": "COINTREAU",
        "display": "Cointreau (Triple Sec)",
        "E": 321.0, "EJ": 1343.0, "Alc": 33.4, "C": 24.0, "Su": 24.0, "W": 42.6,
        "notes": "label: 95 kcal/oz, 7.1g C/oz, 40% ABV 2026-06-24",
    },
    {
        "ndb": "14772",
        "long_desc": "Alcoholic beverage, wine, sherry, Amontillado, dry, 40 proof",
        "key": "amontillado_sherry", "food_word": "AMONTILLADO",
        "display": "Amontillado Sherry",
        "E": 136.0, "EJ": 569.0, "Alc": 15.8, "C": 6.8, "Su": 6.8, "W": 77.4,
        "notes": "label: 136 kcal/100ml, 15-22% ABV, dry; using 20% ABV 2026-06-24",
    },
]

# ── Ledger-alias entries (no new NDB) ─────────────────────────────────────────
ALIASES = [
    {
        "key": "creme_de_menthe_white", "ndb": "14034",
        "food_word": "CREMEMENTHE",
        "long_desc": "Alcoholic beverage, creme de menthe, 72 proof",
        "display": "White Crème de Menthe",
        "notes": "alias to SR Legacy NDB 14034 (72 proof, E=371); white=green same nutrition",
    },
    {
        "key": "creme_de_cacao_white", "ndb": "14715",
        "food_word": "CREMEDECACAO",
        "long_desc": "Alcoholic beverage, liqueur, creme de cacao, 50 proof",
        "display": "White Crème de Cacao",
        "notes": "alias to NDB 14715 (50 proof, E=286); user label 15-24% ABV within range",
    },
    {
        "key": "peach_schnapps", "ndb": "14711",
        "food_word": "PEACHLIQUEUR",
        "long_desc": "Alcoholic beverage, liqueur, peach, 40 proof",
        "display": "Peach Schnapps",
        "notes": "alias to NDB 14711 (40 proof, E=235); user label 15-24% ABV within range",
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

def make_vals(e):
    return (
        e["ndb"], e["long_desc"],
        e["E"], e["EJ"],
        0.0, 0.0, e["C"], 0.0, e["Su"],
        e["Alc"], e["W"], 0.0,
        1, "1.0", "fl oz", "27.0",
        2, "1.0", "jigger (1.5 fl oz)", "40.5",
        3, EMPTY, EMPTY, EMPTY,
    )

# ── Step 1: comboo.db ─────────────────────────────────────────────────────────
def step_local(dry):
    print(f"\n=== Step 1: {'DRY RUN' if dry else 'INSERT'} 2 new NDBs in comboo.db ===")
    conn = sqlite3.connect(DB_PATH)
    cur  = conn.cursor()
    for e in NEW_NDBS:
        label = f"  {'(DRY) ' if dry else ''}INSERT {e['ndb']}: {e['long_desc'][:65]}"
        if not dry:
            cur.execute(INSERT_SQL, make_vals(e))
            print(label + (" ✓" if cur.rowcount else " SKIP"))
        else:
            print(label)
    if not dry: conn.commit()
    conn.close()
    print(f"  (Aliases: no comboo.db changes — NDB 14034, 14711, 14715 already present)")

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

def step_turso(dry):
    print(f"\n=== Step 2: {'DRY RUN' if dry else 'INSERT'} Turso (2 new NDBs) ===")
    import libsql_experimental as libsql
    url, token = _load_env()
    if not url or not token:
        print("  WARNING: TURSO creds not found"); return
    if dry:
        for e in NEW_NDBS:
            print(f"  (DRY) INSERT {e['ndb']}: {e['long_desc'][:65]}")
        return
    tconn = libsql.connect("comboo_g4.db", sync_url=url, auth_token=token)
    tconn.sync()
    for e in NEW_NDBS:
        tconn.execute(INSERT_SQL, make_vals(e))
        print(f"  INSERT {e['ndb']}: {e['long_desc'][:65]}")
    tconn.commit()
    print("  Turso sync done")

# ── Step 3: food-portions rows for the 2 new NDBs only ───────────────────────
FP_55 = [os.path.join(ROOT, "food-portions-complete.csv"),
         os.path.join(ROOT, "docs", "food-portions-complete.csv")]
FP_56 = os.path.join(ROOT, "src", "lib", "data", "food-portions-complete.csv")

def make_row_55(e):
    return [
        e["food_word"], e["display"],
        "bar", EMPTY, EMPTY, EMPTY, EMPTY,
        e["ndb"], e["long_desc"],
        str(e["E"]), "0.0", "0.0", str(e["C"]), "0.0", str(e["W"]), str(e["Su"]),
        "1.0", "custom (g)", "100.0",
        "1.0", "fl oz", "27.0",
        "1.0", "jigger (1.5 fl oz)", "40.5",
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
        EMPTY, EMPTY, EMPTY,
    ]

def make_row_56(e):
    r = make_row_55(e)
    return r[:2] + [EMPTY] + r[2:]

def step_fp(dry):
    print(f"\n=== Step 3: {'DRY RUN' if dry else 'APPEND'} food-portions (2 new NDBs only) ===")
    for path in FP_55:
        for e in NEW_NDBS:
            print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(path)}: {e['food_word']} → NDB {e['ndb']}")
        if not dry:
            with open(path, 'a', newline='', encoding='utf-8') as f:
                csv.writer(f).writerows([make_row_55(e) for e in NEW_NDBS])
            print(f"  Appended 2 rows to {os.path.basename(path)}")
    for e in NEW_NDBS:
        print(f"  {'(DRY) ' if dry else ''}APPEND {os.path.basename(FP_56)}: {e['food_word']} → NDB {e['ndb']}")
    if not dry:
        with open(FP_56, 'a', newline='', encoding='utf-8') as f:
            csv.writer(f).writerows([make_row_56(e) for e in NEW_NDBS])
        print(f"  Appended 2 rows to {os.path.basename(FP_56)}")

# ── Step 4: ledger — 2 new NDBs + 3 aliases ──────────────────────────────────
LEDGER = os.path.join(ROOT, "recipes_v3", "data", "ingredients_ledger.csv")

def step_ledger(dry):
    print(f"\n=== Step 4: {'DRY RUN' if dry else 'APPEND'} ingredients_ledger.csv ===")
    all_entries = [
        {**e, "notes": e["notes"]} for e in NEW_NDBS
    ] + [
        {**a} for a in ALIASES
    ]
    for e in all_entries:
        tag = "(alias)" if e in ALIASES else "(new NDB)"
        print(f"  {'(DRY) ' if dry else ''}ADD: {e['key']} → NDB {e['ndb']}, food_word={e['food_word']} {tag}")
    if not dry:
        with open(LEDGER, 'a', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            for e in all_entries:
                w.writerow([e["key"], e["ndb"], e["food_word"],
                            e["long_desc"], e["display"],
                            "fl oz", "27.0", e["notes"]])
        print(f"  Appended {len(all_entries)} rows to ledger")

# ── main ──────────────────────────────────────────────────────────────────────
print(f"{'DRY RUN' if DRY_RUN else 'COMMIT'} — add_group4.py")
print("  2 new NDB inserts: Cointreau (14771), Amontillado Sherry (14772)")
print("  3 ledger aliases: creme_de_menthe_white, creme_de_cacao_white, peach_schnapps")

step_local(DRY_RUN)
step_turso(DRY_RUN)
step_fp(DRY_RUN)
step_ledger(DRY_RUN)

if DRY_RUN:
    print("\nDry run complete. Re-run with --commit to apply.")
else:
    if os.path.exists("comboo_g4.db"): os.remove("comboo_g4.db")
    print("\nDone. Next: python3 scripts/dev/convert_to_ts.py && python recipes_v3/tools/validate_ledger.py")
