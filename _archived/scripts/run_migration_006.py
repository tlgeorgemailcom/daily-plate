"""Migration 006: Add cook_method column to player_recipes table."""
import urllib.request, json, re, os

url = 'https://daily-food-chain-tlgeorge.aws-us-east-1.turso.io/v2/pipeline'

# Read token from .env.local
env_text = open(os.path.join(os.path.dirname(__file__), '.env.local')).read()
token = re.search(r'TURSO_AUTH_TOKEN=(.+)', env_text).group(1).strip()

stmts = [
    {
        "type": "execute",
        "stmt": {
            "sql": "ALTER TABLE player_recipes ADD COLUMN cook_method TEXT"
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
    print('Migration 006 result:', json.dumps(data, indent=2))
except urllib.error.HTTPError as e:
    print('HTTP error:', e.code, e.read().decode())
