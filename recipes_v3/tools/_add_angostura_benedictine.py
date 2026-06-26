"""
Insert benedictine NDB 14811, add angostura_bitters + benedictine to ledger,
update all 3 food-portions-complete.csv copies, then regenerate food-portions.ts.
"""
import csv, re, sqlite3
from pathlib import Path
import libsql_experimental as libsql

LOCAL_DB = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
ENV_FILE = ".env.local"
BASE     = Path("recipes_v3/data")

# ── 1. Insert NDB 14811 (benedictine) into local + Turso ─────────────────────
BEN = {
    "NDB_No": "14811", "FdGrp_Cd": "1400",
    "Long_Desc": "Alcoholic beverage, liqueur, B\u00e9n\u00e9dictine, 40 proof",
    "Protein": 0.0, "TotalLipidFat": 0.0,
    "Carbohydrate": 25.7, "SugarsTotal": 25.7,
    "Energy_KCal": 313.0, "AlcholEthyl": 30.0,
    "Water": 44.3, "FiberTotalDietary": 0.0,
    "Energy_KJ": 1310.0, "M1_Desc": "fl oz", "M1_Gm_Wgt": 30.5, "fat": "n",
}
vals = (BEN["NDB_No"], BEN["FdGrp_Cd"], BEN["Long_Desc"],
        BEN["Protein"], BEN["TotalLipidFat"], BEN["Carbohydrate"], BEN["SugarsTotal"],
        BEN["Energy_KCal"], BEN["AlcholEthyl"], BEN["Water"], BEN["FiberTotalDietary"],
        BEN["Energy_KJ"], BEN["M1_Desc"], BEN["M1_Gm_Wgt"], BEN["fat"])
SQL = """INSERT INTO DataCentralCombo
  (NDB_No,FdGrp_Cd,Long_Desc,Protein,TotalLipidFat,Carbohydrate,SugarsTotal,
   Energy_KCal,AlcholEthyl,Water,FiberTotalDietary,Energy_KJ,M1_Desc,M1_Gm_Wgt,fat)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"""

con = sqlite3.connect(LOCAL_DB)
if con.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_No='14811'").fetchone()[0]:
    print("NDB 14811 already local — skipping")
else:
    con.execute(SQL, vals); con.commit()
    print("\u2713 NDB 14811 inserted local")
con.close()

token = None
with open(ENV_FILE) as f:
    for line in f:
        m = re.match(r'TURSO_SR28_TOKEN=(.+)', line.strip())
        if m: token = m.group(1).strip('"').strip("'")
conn = libsql.connect("libsql://comboo-tlgeorge.aws-us-east-1.turso.io", auth_token=token)
if conn.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_No='14811'").fetchone()[0]:
    print("NDB 14811 already Turso — skipping")
else:
    conn.execute(SQL, vals); conn.commit()
    print("\u2713 NDB 14811 inserted Turso")

# ── 2. Append ledger entries ──────────────────────────────────────────────────
LEDGER = BASE / "ingredients_ledger.csv"
with open(LEDGER) as f:
    existing = f.read()

new_rows = []
if "angostura_bitters" not in existing:
    new_rows.append("angostura_bitters,14749,ANGOSTURABITTERS,"
        '"Alcoholic beverage, bitters, aromatic, Angostura type, 89.4 proof",'
        "Angostura bitters,dash,0.9,cocktail ingredient; alias of aromatic_bitters NDB 14749 2026-06-26")
if "benedictine" not in existing:
    new_rows.append("benedictine,14811,BENEDICTINE,"
        '"Alcoholic beverage, liqueur, B\u00e9n\u00e9dictine, 40 proof",'
        "B\u00e9n\u00e9dictine,fl oz,30.5,"
        "label: 313 kcal/100g; 40% ABV; 25.7g sugar; NDB 14811 2026-06-26")

if new_rows:
    with open(LEDGER, "a") as f:
        for row in new_rows:
            f.write(row + "\n")
    print(f"\u2713 ledger: added {len(new_rows)} row(s)")
else:
    print("ledger: already present")

# ── 3. Append to food-portions-complete.csv (all 3 copies) ───────────────────
# Row data common to both new entries
# 55-col: word,display,group1,group2,group3,group4,has_recipe,NDB_NO,usda_desc,
#         cal,pro,fat,carb,fib,h2o,sug, M0×3, M1×3, M2–M12 empty (33 fields)
# 56-col: word,display,synonyms,group1,...  (synonyms='' added at index 2)

def fp_row_55(word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug,
              m1_amt, m1_desc, m1_gm):
    return ([word, display, "bar", "", "", "", "0", str(ndb), usda_desc,
             str(cal), str(pro), str(fat), str(carb), str(fib), str(h2o), str(sug),
             "", "", "",                       # M0
             str(m1_amt), m1_desc, str(m1_gm), # M1
             ] + [""] * 33)                    # M2–M12

def fp_row_56(word, display, ndb, usda_desc, cal, pro, fat, carb, fib, h2o, sug,
              m1_amt, m1_desc, m1_gm):
    return ([word, display, "", "bar", "", "", "", "0", str(ndb), usda_desc,
             str(cal), str(pro), str(fat), str(carb), str(fib), str(h2o), str(sug),
             "", "", "",                       # M0
             str(m1_amt), m1_desc, str(m1_gm), # M1
             ] + [""] * 33)                    # M2–M12

entries_55 = [
    fp_row_55("ANGOSTURABITTERS", "Angostura Bitters", 14749,
              "Alcoholic beverage, bitters, aromatic, Angostura type, 89.4 proof",
              340.0, 0.0, 0.0, 25.0, 0.0, 39.7, 25.0, 1.0, "dash", 0.9),
    fp_row_55("BENEDICTINE", "B\u00e9n\u00e9dictine", 14811,
              "Alcoholic beverage, liqueur, B\u00e9n\u00e9dictine, 40 proof",
              313.0, 0.0, 0.0, 25.7, 0.0, 44.3, 25.7, 1.0, "fl oz", 30.5),
]
entries_56 = [
    fp_row_56("ANGOSTURABITTERS", "Angostura Bitters", 14749,
              "Alcoholic beverage, bitters, aromatic, Angostura type, 89.4 proof",
              340.0, 0.0, 0.0, 25.0, 0.0, 39.7, 25.0, 1.0, "dash", 0.9),
    fp_row_56("BENEDICTINE", "B\u00e9n\u00e9dictine", 14811,
              "Alcoholic beverage, liqueur, B\u00e9n\u00e9dictine, 40 proof",
              313.0, 0.0, 0.0, 25.7, 0.0, 44.3, 25.7, 1.0, "fl oz", 30.5),
]

for fp_path, rows in [
    ("food-portions-complete.csv", entries_55),
    ("docs/food-portions-complete.csv", entries_55),
    ("src/lib/data/food-portions-complete.csv", entries_56),
]:
    path = Path(fp_path)
    content = path.read_text()
    added = []
    with open(path, "a", newline="") as f:
        writer = csv.writer(f)
        for row in rows:
            if row[0] not in content:
                writer.writerow(row)
                added.append(row[0])
    if added:
        print(f"\u2713 {fp_path}: added {added}")
    else:
        print(f"  {fp_path}: already present")

print("Done — run convert_to_ts.py next")
