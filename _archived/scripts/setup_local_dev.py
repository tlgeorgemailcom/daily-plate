#!/usr/bin/env python3
"""
setup_local_dev.py
------------------
Clones the Turso schema (no user data) to a local SQLite file for recipe development.
Run once to set up, or re-run to reset the dev database.

Usage:
    python3 setup_local_dev.py

Output:
    recipes_dev.db  (local SQLite, used by SvelteKit when .env.local points to it)
"""

import sqlite3
import urllib.request
import json
import os
import sys

DEV_DB = os.path.join(os.path.dirname(__file__), 'recipes_dev.db')
ENV_FILE = os.path.join(os.path.dirname(__file__), '.env.local')

# ── Read credentials ──────────────────────────────────────────────────────────
env = {}
with open(ENV_FILE) as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, _, v = line.partition('=')
            env[k.strip()] = v.strip()

TURSO_URL = env.get('TURSO_DATABASE_URL', '')
TURSO_TOKEN = env.get('TURSO_AUTH_TOKEN', '')

if not TURSO_URL or not TURSO_TOKEN:
    print('ERROR: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN missing from .env.local')
    sys.exit(1)

# ── Query Turso for all CREATE TABLE statements ───────────────────────────────
def turso_query(sql):
    http_url = TURSO_URL.replace('libsql://', 'https://') + '/v2/pipeline'
    body = json.dumps({
        'requests': [
            {'type': 'execute', 'stmt': {'sql': sql}},
            {'type': 'close'}
        ]
    }).encode()
    req = urllib.request.Request(
        http_url,
        data=body,
        headers={'Authorization': f'Bearer {TURSO_TOKEN}', 'Content-Type': 'application/json'}
    )
    resp = json.loads(urllib.request.urlopen(req).read())
    result = resp['results'][0]['response']['result']
    cols = [c['name'] for c in result['cols']]
    return [dict(zip(cols, [v['value'] for v in row])) for row in result['rows']]

print('Fetching schema from Turso...')
tables = turso_query("SELECT name, sql FROM sqlite_master WHERE type='table' ORDER BY name")
print(f'Found {len(tables)} tables')

# ── Build local SQLite ────────────────────────────────────────────────────────
if os.path.exists(DEV_DB):
    os.remove(DEV_DB)
    print(f'Removed existing {DEV_DB}')

conn = sqlite3.connect(DEV_DB)
cur = conn.cursor()

# Recreate all tables
for t in tables:
    name = t['name']
    sql = t['sql']
    if not sql:
        continue
    # Skip sqlite internal tables
    if name.startswith('sqlite_'):
        continue
    try:
        cur.execute(sql)
        print(f'  ✓ {name}')
    except Exception as e:
        print(f'  ✗ {name}: {e}')

# Insert a test player so FK constraints on recipes table are satisfied
cur.execute("""
    INSERT OR IGNORE INTO players (id, display_name, subscription_tier, created_at)
    VALUES ('dev-player-001', 'Developer', 'moderator', datetime('now'))
""")

conn.commit()
conn.close()

print(f'\nDone. Local dev DB created: {DEV_DB}')
print('\nTo use locally, update .env.local:')
print(f'  TURSO_DATABASE_URL=file://{DEV_DB}')
print('  TURSO_AUTH_TOKEN=local')
print('\nThen run: npm run dev')
