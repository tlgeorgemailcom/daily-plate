"""Quick check: verify daily_notes table schema and row count in Turso."""
import urllib.request, json, re, os

url = 'https://daily-food-chain-tlgeorge.aws-us-east-1.turso.io/v2/pipeline'
env_text = open(os.path.join(os.path.dirname(__file__), '.env.local')).read()
token = re.search(r'TURSO_AUTH_TOKEN=(.+)', env_text).group(1).strip()

stmts = [
    {"type": "execute", "stmt": {"sql": "PRAGMA table_info(daily_notes)"}},
    {"type": "execute", "stmt": {"sql": "SELECT COUNT(*) as total FROM daily_notes"}},
    {"type": "execute", "stmt": {"sql": "SELECT id, user_id, note_date, LEFT(note_content, 60) as preview, sentiment_flag, created_at FROM daily_notes ORDER BY created_at DESC LIMIT 5"}},
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
    labels = ['Table schema', 'Row count', 'Latest 5 notes']
    for i, result in enumerate(data['results']):
        if result['type'] == 'ok' and result['response']['type'] == 'execute':
            rows = result['response']['result']['rows']
            cols = [c['name'] for c in result['response']['result']['cols']]
            print(f"\n=== {labels[i]} ===")
            if rows:
                for row in rows:
                    print({col: (v.get('value') if isinstance(v, dict) else v) for col, v in zip(cols, row)})
            else:
                print("(no rows)")
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode())
