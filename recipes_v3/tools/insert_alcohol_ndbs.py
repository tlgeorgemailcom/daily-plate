"""
insert_alcohol_ndbs.py
======================
Inserts 33 custom liqueur / spirits NDB entries (14700–14732) into
comboo.db (local) and syncs them to Turso SR28.

Run:
    python recipes_v3/tools/insert_alcohol_ndbs.py            # dry-run
    python recipes_v3/tools/insert_alcohol_ndbs.py --commit   # write
"""

import argparse
import os
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB   = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
ENV  = ROOT / ".env.local"

# ── env loader ───────────────────────────────────────────────────────────────
def _load_env(path: Path) -> dict:
    env = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip()
    return env


def _connect_turso():
    env = _load_env(ENV)
    url   = env.get("TURSO_SR28_URL")   or os.environ.get("TURSO_SR28_URL")
    token = env.get("TURSO_SR28_TOKEN") or os.environ.get("TURSO_SR28_TOKEN")
    if not url or not token:
        sys.exit("ERROR: TURSO_SR28_URL / TURSO_SR28_TOKEN missing in .env.local")
    try:
        import libsql_experimental as libsql  # type: ignore
    except ImportError:
        sys.exit("ERROR: pip install libsql-experimental")
    return libsql.connect(database=url, auth_token=token)


# ── nutrient computation ─────────────────────────────────────────────────────
def _compute(abv_pct: float, sugar_ml: float, fat_ml: float,
             protein_ml: float, density: float) -> dict:
    """
    Compute per-100g macros from per-100ml EU label values + density.

    AlcholEthyl  = (ABV/100 × 78.9) / density          [g ethanol per 100g]
    Carbohydrate = sugar_ml / density                   [= SugarsTotal; no fiber in spirits]
    Fat          = fat_ml / density
    Protein      = protein_ml / density
    Water        = 100 − AlcholEthyl − Carb − Fat − Protein − Ash
    Energy_KCal  = Alcohol×7 + Protein×4 + Fat×9 + Carbs×4  (Atwater incl. alcohol)
    """
    alc  = round((abv_pct / 100.0) * 78.9 / density, 2)
    carb = round(sugar_ml / density, 2)
    fat  = round(fat_ml / density, 2)
    prot = round(protein_ml / density, 2)
    ash  = 0.5  # typical mineral residue; negligible
    water = round(100.0 - alc - carb - fat - prot - ash, 2)
    kcal  = round(alc * 7.0 + prot * 4.0 + fat * 9.0 + carb * 4.0, 1)
    kj    = round(kcal * 4.184, 1)
    return {
        "AlcholEthyl": alc,
        "Carbohydrate": carb,
        "SugarsTotal": carb,       # equals carb; no starch/fiber in spirits
        "TotalLipidFat": fat,
        "Protein": prot,
        "FiberTotalDietary": 0.0,
        "Ash": ash,
        "Water": water,
        "Energy_KCal": kcal,
        "Energy_KJ": kj,
    }


# ── custom NDB dataset ───────────────────────────────────────────────────────
# Columns: (ndb, fdgrp, long_desc, keyword, key0, key1, key2,
#           key10, abv_pct, sugar_100ml, fat_100ml, protein_100ml, density)
# key10   = search-rank proxy (higher = more commonly used in cocktail recipes)
# sugar_100ml, fat_100ml, protein_100ml = EU manufacturer label values per 100ml
# density = g/ml estimate from ABV + sugar content

ENTRIES = [
    # ── High-priority (7+ cocktails) ─────────────────────────────────────────
    ("14700","1400","Alcoholic beverage, liqueur, triple sec, orange, 80 proof",
        "liqueur","triple","sec","orange",      8,  40.0, 28.0,  0.0, 0.0, 1.02),
    ("14701","1400","Alcoholic beverage, wine, vermouth, sweet",
        "vermouth","sweet","vermouth","",        7,  15.0, 14.0,  0.0, 0.0, 1.05),
    ("14702","1400","Alcoholic beverage, liqueur, maraschino cherry, 64 proof",
        "liqueur","maraschino","cherry","",      7,  32.0, 29.0,  0.0, 0.0, 1.04),
    ("14703","1400","Alcoholic beverage, campari bitters, 48 proof",
        "bitters","campari","","",              6,  25.0, 15.4,  0.0, 0.0, 1.03),
    ("14704","1400","Alcoholic beverage, distilled, absinthe, 136 proof",
        "absinthe","absinthe","","",            5,  68.0,  0.0,  0.0, 0.0, 0.88),
    # ── Mid-priority (3–6 cocktails) ─────────────────────────────────────────
    ("14705","1400","Alcoholic beverage, aperol, 22 proof",
        "liqueur","aperol","","",               5,  11.0, 17.3,  0.0, 0.0, 1.05),
    ("14706","1400","Alcoholic beverage, wine, vermouth, dry",
        "vermouth","dry","vermouth","",          4,  18.0,  2.9,  0.0, 0.0, 0.98),
    ("14707","1400","Alcoholic beverage, liqueur, chartreuse, green, 110 proof",
        "liqueur","chartreuse","green","",       4,  55.0, 10.7,  0.0, 0.0, 0.94),
    ("14708","1400","Alcoholic beverage, liqueur, apricot brandy, 60 proof",
        "liqueur","apricot","brandy","",         3,  30.0, 25.0,  0.0, 0.0, 1.03),
    ("14709","1400","Alcoholic beverage, liqueur, creme de cassis, blackcurrant, 30 proof",
        "liqueur","creme","cassis","blackcurrant",3,15.0, 52.0,  0.0, 0.0, 1.15),
    ("14710","1400","Alcoholic beverage, liqueur, falernum, 22 proof",
        "liqueur","falernum","","",              3,  11.0, 56.0,  0.0, 0.0, 1.12),
    ("14711","1400","Alcoholic beverage, liqueur, peach, 40 proof",
        "liqueur","peach","schnapps","",         3,  20.0, 34.0,  0.0, 0.0, 1.05),
    # ── Lower-priority (1–2 cocktails) ───────────────────────────────────────
    ("14712","1400","Alcoholic beverage, liqueur, benedictine, 80 proof",
        "liqueur","benedictine","","",           2,  40.0, 26.0,  0.0, 0.0, 1.03),
    ("14713","1400","Alcoholic beverage, liqueur, blackberry, creme de mure, 36 proof",
        "liqueur","creme","mure","blackberry",   2,  18.0, 45.0,  0.0, 0.0, 1.10),
    ("14714","1400","Alcoholic beverage, liqueur, cherry brandy, 48 proof",
        "liqueur","cherry","brandy","heering",   2,  24.0, 30.0,  0.0, 0.0, 1.04),
    ("14715","1400","Alcoholic beverage, liqueur, creme de cacao, 50 proof",
        "liqueur","creme","cacao","chocolate",   2,  25.0, 42.0,  0.0, 0.0, 1.07),
    ("14716","1400","Alcoholic beverage, liqueur, fernet-branca, 80 proof",
        "liqueur","fernet","branca","amaro",     2,  40.0, 17.0,  0.0, 0.0, 1.00),
    ("14717","1400","Alcoholic beverage, wine, lillet blanc, 34 proof",
        "wine","lillet","blanc","",              2,  17.0,  6.7,  0.0, 0.0, 1.00),
    ("14718","1400","Beverage, syrup, orgeat, almond, non-alcoholic",
        "syrup","orgeat","almond","",            2,   0.0, 60.0,  0.0, 0.0, 1.28),
    ("14719","1400","Alcoholic beverage, liqueur, allspice dram, 44 proof",
        "liqueur","allspice","dram","pimento",   1,  22.0, 37.0,  0.0, 0.0, 1.08),
    ("14720","1400","Alcoholic beverage, liqueur, amaretto, almond, 56 proof",
        "liqueur","amaretto","almond","",        1,  28.0, 28.3,  0.0, 0.0, 1.04),
    ("14721","1400","Alcoholic beverage, liqueur, amaro nonino, 70 proof",
        "liqueur","amaro","nonino","",           1,  35.0, 20.0,  0.0, 0.0, 1.01),
    ("14722","1400","Alcoholic beverage, liqueur, ancho reyes chile, 80 proof",
        "liqueur","ancho","reyes","chile",       1,  40.0, 16.7,  0.0, 0.0, 1.00),
    ("14723","1400","Alcoholic beverage, liqueur, banana, creme de banane, 40 proof",
        "liqueur","banana","creme","",           1,  20.0, 42.0,  0.0, 0.0, 1.08),
    ("14724","1400","Alcoholic beverage, liqueur, chambord, black raspberry, 33 proof",
        "liqueur","chambord","raspberry","",     1,  16.5, 31.0,  0.0, 0.0, 1.05),
    ("14725","1400","Alcoholic beverage, liqueur, creme de violette, 32 proof",
        "liqueur","creme","violette","violet",   1,  16.0, 42.0,  0.0, 0.0, 1.10),
    ("14726","1400","Alcoholic beverage, liqueur, drambuie, scotch honey, 80 proof",
        "liqueur","drambuie","scotch","honey",   1,  40.0, 27.0,  0.0, 0.0, 1.03),
    ("14727","1400","Alcoholic beverage, liqueur, elderflower, st germain, 40 proof",
        "liqueur","elderflower","st","germain",  1,  20.0, 50.7,  0.0, 0.0, 1.12),
    ("14728","1400","Alcoholic beverage, liqueur, grand marnier, orange, 80 proof",
        "liqueur","grand","marnier","orange",    1,  40.0, 22.0,  0.0, 0.0, 1.01),
    ("14729","1400","Alcoholic beverage, liqueur, orange curacao, 80 proof",
        "liqueur","orange","curacao","",         1,  40.0, 27.0,  0.0, 0.0, 1.01),
    ("14730","1400","Alcoholic beverage, liqueur, passoa, passion fruit, 34 proof",
        "liqueur","passoa","passion","fruit",    1,  17.0, 35.1,  0.0, 0.0, 1.06),
    ("14731","1400","Alcoholic beverage, liqueur, pimm's no. 1, 50 proof",
        "liqueur","pimms","","",                 1,  25.0, 12.0,  0.0, 0.0, 1.00),
    ("14732","1400","Alcoholic beverage, liqueur, chartreuse, yellow, 80 proof",
        "liqueur","chartreuse","yellow","",      1,  40.0, 28.0,  0.0, 0.0, 1.04),
]

# ── SQL ───────────────────────────────────────────────────────────────────────
INSERT_SQL = """
INSERT OR IGNORE INTO DataCentralCombo (
    NDB_NO, FdGrp_Cd, Long_Desc, keyword, key0, key1, key2, key10,
    Protein, TotalLipidFat, Carbohydrate, SugarsTotal, Ash,
    Energy_KCal, Energy_KJ, FiberTotalDietary, AlcholEthyl, Water,
    M1_Seq, M1_Amt, M1_Desc, M1_Gm_Wgt,
    M2_NDB_No, M2_Seq, M2_Amt, M2_Desc, M2_Gm_Wgt,
    M3_NDB_No, M3_Seq, M3_Amt, M3_Desc, M3_Gm_Wgt
) VALUES (
    ?,?,?,?,?,?,?,?,
    ?,?,?,?,?,
    ?,?,?,?,?,
    ?,?,?,?,
    ?,?,?,?,?,
    ?,?,?,?,?
)
"""


def _build_params(entry):
    (ndb, fdgrp, long_desc, keyword, key0, key1, key2,
     key10, abv_pct, sugar_ml, fat_ml, protein_ml, density) = entry
    n = _compute(abv_pct, sugar_ml, fat_ml, protein_ml, density)
    return (
        ndb, fdgrp, long_desc, keyword, key0, key1, key2, key10,
        n["Protein"], n["TotalLipidFat"], n["Carbohydrate"], n["SugarsTotal"], n["Ash"],
        n["Energy_KCal"], n["Energy_KJ"], n["FiberTotalDietary"], n["AlcholEthyl"], n["Water"],
        # M1: 1 fl oz = 29.57 g
        1, 1.0, "fl oz", 29.57,
        # M2: 1 tbsp = 14.79 g
        ndb, 2, 1.0, "tbsp", 14.79,
        # M3: 1 jigger (1.5 fl oz) = 44.36 g
        ndb, 3, 1.5, "jigger (1.5 fl oz)", 44.36,
    )


def _preview():
    print(f"{'NDB':>5}  {'Long_Desc':<58}  {'Kcal':>5}  {'Alc':>5}  {'Sug':>5}  {'H2O':>5}")
    print("-" * 92)
    for e in ENTRIES:
        n = _compute(e[8], e[9], e[10], e[11], e[12])
        print(f"{e[0]:>5}  {e[2]:<58}  {n['Energy_KCal']:>5.0f}  "
              f"{n['AlcholEthyl']:>5.1f}  {n['SugarsTotal']:>5.1f}  {n['Water']:>5.1f}")
    print(f"\n{len(ENTRIES)} entries to insert (NDB_NO 14700–14732).")


def _run(commit: bool):
    _preview()
    if not commit:
        print("\nDry-run — pass --commit to write.")
        return

    # ── local comboo.db ──────────────────────────────────────────────────────
    print(f"\nWriting to local {DB} …")
    con = sqlite3.connect(DB)
    inserted_local = 0
    for e in ENTRIES:
        cur = con.execute(INSERT_SQL, _build_params(e))
        inserted_local += cur.rowcount
    con.commit()
    con.close()
    print(f"  {inserted_local}/{len(ENTRIES)} rows inserted (OR IGNORE skips existing).")

    # ── Turso SR28 ───────────────────────────────────────────────────────────
    print("Syncing to Turso SR28 …")
    tcon = _connect_turso()
    inserted_turso = 0
    for e in ENTRIES:
        cur = tcon.execute(INSERT_SQL, _build_params(e))
        inserted_turso += cur.rowcount
    tcon.commit()
    print(f"  {inserted_turso}/{len(ENTRIES)} rows synced to Turso SR28.")
    print("Done.")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Insert custom liqueur NDB entries into comboo.db + Turso SR28")
    ap.add_argument("--commit", action="store_true", help="Write to DB (default is dry-run)")
    args = ap.parse_args()
    _run(args.commit)
