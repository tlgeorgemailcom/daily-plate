import urllib.request, json, re, os

url = 'https://daily-food-chain-tlgeorge.aws-us-east-1.turso.io/v2/pipeline'

# Read token from .env.local
env_text = open(os.path.join(os.path.dirname(__file__), '.env.local')).read()
token = re.search(r'TURSO_AUTH_TOKEN=(.+)', env_text).group(1).strip()

stmts = [
    {"type": "execute", "stmt": {"sql": "ALTER TABLE household_members ADD COLUMN custom_kcal TEXT NOT NULL DEFAULT ''"}},
    {"type": "execute", "stmt": {"sql": "ALTER TABLE household_members ADD COLUMN custom_water_cups TEXT NOT NULL DEFAULT ''"}},
    {"type": "execute", "stmt": {"sql": "ALTER TABLE household_members ADD COLUMN custom_sugar_max TEXT NOT NULL DEFAULT ''"}},
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
    print("Migration result:", json.dumps(data, indent=2))
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print("HTTP Error:", e.code, body)
