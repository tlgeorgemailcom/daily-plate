#!/usr/bin/env python3
"""
TodayPage Daily Analytics Report — powered by Turso
Usage:
  python3 daily_report.py              # yesterday
  python3 daily_report.py 2026-03-19   # specific date

Reads TURSO_DATABASE_URL and TURSO_AUTH_TOKEN from .env.local (or .env).
"""

import urllib.request
import json
import os
import sys
from datetime import datetime, timezone, timedelta
from collections import defaultdict

# ── Load env files (.env.local overrides .env) ───────────────────────────────
def _load_env_override(path):
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    os.environ[k.strip()] = v.strip()

_dir = os.path.dirname(os.path.abspath(__file__))
_load_env_override(os.path.join(_dir, '.env'))
_load_env_override(os.path.join(_dir, '.env.local'))   # .local wins

TURSO_URL   = os.environ.get('TURSO_DATABASE_URL', '').replace('libsql://', 'https://')
TURSO_TOKEN = os.environ.get('TURSO_AUTH_TOKEN', '')

if not TURSO_URL or not TURSO_TOKEN:
    print('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local')
    sys.exit(1)
SITE_ID = "818b6018-2a1a-4b1c-8c53-b13d6dcf541b"  # kept for reference / Umami dashboard

# ── Date range ───────────────────────────────────────────────────────────────
# Default = today in UTC (events are stored as UTC ISO timestamps)
if len(sys.argv) > 1:
    DATE_STR = sys.argv[1][:10]   # accept YYYY-MM-DD or full ISO
else:
    DATE_STR = datetime.now(timezone.utc).strftime('%Y-%m-%d')

# ── Turso HTTP query helper ──────────────────────────────────────────────────
def turso_query(sql, args=None):
    """Execute a SQL query via Turso HTTP API. Returns list of row dicts."""
    stmt = {'sql': sql}
    if args:
        stmt['args'] = [{'type': 'text', 'value': str(a)} for a in args]
    payload = json.dumps({
        'requests': [
            {'type': 'execute', 'stmt': stmt},
            {'type': 'close'},
        ]
    }).encode()
    req = urllib.request.Request(
        f'{TURSO_URL}/v2/pipeline',
        data=payload,
        headers={
            'Authorization': f'Bearer {TURSO_TOKEN}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        resp = json.loads(r.read())

    result = resp['results'][0]
    if result['type'] == 'error':
        raise RuntimeError(f"Turso error: {result['error']['message']}")

    cols = [c['name'] for c in result['response']['result']['cols']]
    rows = result['response']['result']['rows']
    return [
        dict(zip(cols, [cell.get('value') if isinstance(cell, dict) else cell for cell in row]))
        for row in rows
    ]

# ── Fetch all events for the day ─────────────────────────────────────────────
# Filter by local_date (browser's calendar day) — falls back to UTC ts prefix for old rows
rows = turso_query(
    "SELECT event_name, device_fp, local_date, data_json, ts FROM analytics_events "
    "WHERE coalesce(local_date, substr(ts, 1, 10)) = ? ORDER BY ts",
    [DATE_STR],
)

events = []
for r in rows:
    try:
        data = json.loads(r['data_json'] or '{}')
    except (json.JSONDecodeError, TypeError):
        data = {}
    events.append({
        'event':     r['event_name'],
        'device_fp': r['device_fp'] or data.get('device_fp', ''),
        'ts':        r['ts'],
        **data,
    })

# ── Aggregate helpers ─────────────────────────────────────────────────────────
def count_by(key, filter_fn=None):
    counts = defaultdict(int)
    for e in events:
        if filter_fn and not filter_fn(e):
            continue
        v = e.get(key)
        if v is not None:
            counts[str(v)] += 1
    return dict(sorted(counts.items(), key=lambda x: -x[1]))

all_fps    = [e['device_fp'] for e in events if e.get('device_fp')]
unique_fps = set(all_fps)
sessions   = [e for e in events if e['event'] == 'session_start']
enter_evts = [e for e in events if e['event'].startswith('enter:')]
exit_evts  = [e for e in events if e['event'].startswith('exit:')]

# ── Build report ──────────────────────────────────────────────────────────────
lines = []
lines.append(f'# TodayPage Daily Report — {DATE_STR}')
lines.append(f'Generated: {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}')
lines.append(f'_Source: Turso `analytics_events` — {len(events)} total events_')
lines.append('')

# Overview
lines.append('## Day Overview')
lines.append('| Metric | Value |')
lines.append('|--------|-------|')
lines.append(f'| Total Events    | {len(events)} |')
lines.append(f'| Sessions        | {len(sessions)} |')
lines.append(f'| Game Enters     | {len(enter_evts)} |')
lines.append(f'| Game Exits      | {len(exit_evts)} |')
lines.append(f'| Unique Devices  | {len(unique_fps)} |')
lines.append('')

# Device fingerprints
if unique_fps:
    lines.append('## Device Fingerprints')
    lines.append('| device_fp | Events |')
    lines.append('|-----------|--------|')
    fp_counts = count_by('device_fp')
    for fp, cnt in list(fp_counts.items())[:20]:
        lines.append(f'| `{fp}` | {cnt} |')
    lines.append('')

# Game engagement
if enter_evts or exit_evts:
    lines.append('## Game Engagement')
    lines.append('| Game | Enters | Exits | Duration Buckets |')
    lines.append('|------|--------|-------|-----------------|')

    enter_counts = defaultdict(int)
    for e in enter_evts:
        game = e['event'].replace('enter:', '')
        enter_counts[game] += 1

    exit_by_game = defaultdict(lambda: defaultdict(int))
    for e in exit_evts:
        parts  = e['event'].split(':')
        game   = parts[1] if len(parts) > 1 else '?'
        bucket = parts[2] if len(parts) > 2 else '?'
        exit_by_game[game][bucket] += 1

    all_games = sorted(set(list(enter_counts.keys()) + list(exit_by_game.keys())))
    for game in all_games:
        enters      = enter_counts.get(game, 0)
        total_exits = sum(exit_by_game.get(game, {}).values())
        buckets     = '  '.join(f'`{b}` ×{n}' for b, n in sorted(exit_by_game.get(game, {}).items()))
        lines.append(f'| {game} | {enters} | {total_exits} | {buckets or "—"} |')
    lines.append('')

# Per-device game sessions
if unique_fps and exit_evts:
    lines.append('## Per-Device Game Sessions')
    lines.append('| device_fp | Game | Duration (s) | Bucket |')
    lines.append('|-----------|------|-------------|--------|')
    for e in sorted(exit_evts, key=lambda x: x['ts']):
        parts  = e['event'].split(':')
        game   = parts[1] if len(parts) > 1 else '?'
        bucket = parts[2] if len(parts) > 2 else '?'
        fp     = e.get('device_fp', '—')
        dur    = e.get('duration_seconds', '—')
        lines.append(f'| `{fp}` | {game} | {dur} | {bucket} |')
    lines.append('')

# Player breakdown
lines.append('## Player Breakdown')
for prop in ('player_status', 'player_tier', 'returning', 'timezone', 'device_type', 'screen', 'language'):
    vals = count_by(prop)
    if vals:
        summary = '  |  '.join(f'{v}: {c}' for v, c in vals.items())
        lines.append(f'- **{prop}**: {summary}')
lines.append('')

# Visit count distribution
vc = count_by('visit_count')
if vc:
    lines.append('## Visit Count Distribution')
    lines.append('| visit_count | Sessions |')
    lines.append('|-------------|----------|')
    for v, c in sorted(vc.items(), key=lambda x: int(x[0]) if str(x[0]).isdigit() else 9999):
        lines.append(f'| {v} | {c} |')
    lines.append('')

# All events summary
all_event_counts = defaultdict(int)
for e in events:
    all_event_counts[e['event']] += 1
if all_event_counts:
    lines.append('## All Events')
    lines.append('| Event | Count |')
    lines.append('|-------|-------|')
    for name, cnt in sorted(all_event_counts.items(), key=lambda x: -x[1]):
        lines.append(f'| {name} | {cnt} |')
    lines.append('')

report = '\n'.join(lines)

# Save
out_dir  = os.path.join(_dir, 'docs')
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, f'report_{DATE_STR}.md')
with open(out_path, 'w') as f:
    f.write(report)

print(f'Report saved: {out_path}')
print()
print(report)
