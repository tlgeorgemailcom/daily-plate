"""Migration 005: Create daily_notes table in Turso."""
import urllib.request, json, re, os

url = 'https://daily-food-chain-tlgeorge.aws-us-east-1.turso.io/v2/pipeline'

# Read token from .env.local
env_text = open(os.path.join(os.path.dirname(__file__), '.env.local')).read()
token = re.search(r'TURSO_AUTH_TOKEN=(.+)', env_text).group(1).strip()

stmts = [
    {
        "type": "execute",
        "stmt": {
            "sql": (
                "CREATE TABLE IF NOT EXISTS daily_notes ("
                "  id               INTEGER PRIMARY KEY AUTOINCREMENT,"
                "  user_id          TEXT NOT NULL,"
                "  note_date        TEXT NOT NULL,"
                "  note_content     TEXT NOT NULL,"
                "  sentiment_flag   TEXT CHECK(sentiment_flag IN ('positive', 'negative', 'neutral')),"
                "  symptoms         TEXT,"
                "  life_stage_group TEXT,"
                "  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),"
                "  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),"
                "  UNIQUE(user_id, note_date)"
                ")"
            )
        }
    },
    {"type": "close"}
]

req = urllib.request.Request(
    url,
    json.dumps({"requests": stmts}).encode(),
    {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
)
try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read().decode())
    print("Migration 005 result:", json.dumps(data, indent=2))
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print("HTTP Error:", e.code, body)
