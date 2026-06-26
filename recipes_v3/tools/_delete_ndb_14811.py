"""Remove redundant NDB 14811 from local comboo.db and Turso (amontillado_sherry already at NDB 14772)."""
import sqlite3, re, libsql_experimental as libsql

LOCAL_DB = "/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db"
ENV_FILE = ".env.local"

def local_delete():
    con = sqlite3.connect(LOCAL_DB)
    con.execute("DELETE FROM DataCentralCombo WHERE NDB_No='14811'")
    con.commit()
    con.close()
    print("✓ Deleted NDB 14811 from local comboo.db")

def turso_delete():
    token = None
    with open(ENV_FILE) as f:
        for line in f:
            m = re.match(r'TURSO_SR28_TOKEN=(.+)', line.strip())
            if m:
                token = m.group(1).strip('"').strip("'")
    url = "libsql://comboo-tlgeorge.aws-us-east-1.turso.io"
    conn = libsql.connect(url, auth_token=token)
    conn.execute("DELETE FROM DataCentralCombo WHERE NDB_No='14811'")
    conn.commit()
    print("✓ Deleted NDB 14811 from Turso")

local_delete()
turso_delete()
