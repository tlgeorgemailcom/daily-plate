"""Insert NDB 14811 dry amontillado sherry into local comboo.db and Turso."""
import sqlite3, re, libsql_experimental as libsql

LOCAL_DB = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
ENV_FILE = ".env.local"

# Dry amontillado sherry ~18% ABV
# Ethanol: 14.3g/100g  Carbs: 2.5g  Sugar: 2.0g  Water: 83.2g
# Energy: 14.3×7 + 2.5×4 = 100.1+10.0 = 110 kcal
ROW = {
    "NDB_No": "14811",
    "FdGrp_Cd": "1400",
    "Long_Desc": "Alcoholic beverage, wine, sherry, dry, amontillado",
    "keyword": None,
    "key0": None, "key1": None, "key2": None, "key3": None,
    "key4": None, "key5": None, "key6": None, "key7": None,
    "key8": None, "key9": None, "key10": None,
    "Protein": 0.0,
    "TotalLipidFat": 0.0,
    "Carbohydrate": 2.5,
    "SugarsTotal": 2.0,
    "Ash": None,
    "Energy_KCal": 110.0,
    "Starch": None, "Sucrose": None, "Glucose_Dextrose": None,
    "Fructose": None, "Lactose": None, "Maltose": None,
    "AlcholEthyl": 14.3,
    "Water": 83.2,
    "Adjusted_Protein": None, "Caffeine": None, "Theobromine": None,
    "Energy_KJ": 460.0,
    "Galactose": None,
    "FiberTotalDietary": 0.0,
    "M1_Desc": "fl oz",
    "M1_Gm_Wgt": 30.5,
    "fat": "n",
    "bin": None,
}

def local_insert():
    con = sqlite3.connect(LOCAL_DB)
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_No='14811'")
    if cur.fetchone()[0]:
        print("NDB 14811 already in local DB — skipping")
        con.close()
        return
    cur.execute("""
        INSERT INTO DataCentralCombo (NDB_No, FdGrp_Cd, Long_Desc,
            Protein, TotalLipidFat, Carbohydrate, SugarsTotal,
            Energy_KCal, AlcholEthyl, Water, FiberTotalDietary,
            Energy_KJ, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        ROW["NDB_No"], ROW["FdGrp_Cd"], ROW["Long_Desc"],
        ROW["Protein"], ROW["TotalLipidFat"], ROW["Carbohydrate"], ROW["SugarsTotal"],
        ROW["Energy_KCal"], ROW["AlcholEthyl"], ROW["Water"], ROW["FiberTotalDietary"],
        ROW["Energy_KJ"], ROW["M1_Desc"], ROW["M1_Gm_Wgt"], ROW["fat"],
    ))
    con.commit()
    con.close()
    print("✓ Inserted NDB 14811 into local comboo.db")

def turso_insert():
    token = None
    with open(ENV_FILE) as f:
        for line in f:
            m = re.match(r'TURSO_SR28_TOKEN=(.+)', line.strip())
            if m:
                token = m.group(1).strip('"').strip("'")
    url = "libsql://comboo-tlgeorge.aws-us-east-1.turso.io"
    conn = libsql.connect(url, auth_token=token)
    conn.execute("SELECT 1")  # ping
    res = conn.execute("SELECT COUNT(*) FROM DataCentralCombo WHERE NDB_No='14811'").fetchone()
    if res[0]:
        print("NDB 14811 already in Turso — skipping")
        return
    conn.execute("""
        INSERT INTO DataCentralCombo (NDB_No, FdGrp_Cd, Long_Desc,
            Protein, TotalLipidFat, Carbohydrate, SugarsTotal,
            Energy_KCal, AlcholEthyl, Water, FiberTotalDietary,
            Energy_KJ, M1_Desc, M1_Gm_Wgt, fat)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        ROW["NDB_No"], ROW["FdGrp_Cd"], ROW["Long_Desc"],
        ROW["Protein"], ROW["TotalLipidFat"], ROW["Carbohydrate"], ROW["SugarsTotal"],
        ROW["Energy_KCal"], ROW["AlcholEthyl"], ROW["Water"], ROW["FiberTotalDietary"],
        ROW["Energy_KJ"], ROW["M1_Desc"], ROW["M1_Gm_Wgt"], ROW["fat"],
    ))
    conn.commit()
    print("✓ Inserted NDB 14811 into Turso")

local_insert()
turso_insert()
