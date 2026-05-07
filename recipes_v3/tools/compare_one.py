"""Compare SWEET_001 nutrition_json: bundle TS file vs Turso row vs v3 build."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))

from tools.upload import _connect  # noqa: E402

RECIPE_ID = sys.argv[1] if len(sys.argv) > 1 else "SWEET_001"

BUNDLE_TS = REPO_ROOT / "src/lib/farmers-basket/generated-levels.ts"
BUILD_JSON = ROOT / "output/builds" / f"{RECIPE_ID}.json"


def extract_bundle_nutrition(ts_path: Path, recipe_id: str) -> dict:
    text = ts_path.read_text()
    # Find recipe block start
    m = re.search(rf"id:\s*'{re.escape(recipe_id)}'", text)
    if not m:
        sys.exit(f"{recipe_id} not in bundle")
    # nutritionJson appears within ~500 chars after id; it's a single JSON-ish object literal
    # The generator writes nutritionJson: { ... } as JS object. Find balanced braces.
    nj_idx = text.find("nutritionJson:", m.end())
    if nj_idx == -1:
        sys.exit("nutritionJson not found near recipe")
    brace_start = text.find("{", nj_idx)
    depth = 0
    i = brace_start
    in_str = False
    esc = False
    while i < len(text):
        c = text[i]
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif c == '"' or c == "'":
            # toggle string state with matching quote
            if in_str == c:
                in_str = False
            elif not in_str:
                in_str = c
        elif not in_str:
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    break
        i += 1
    js_obj = text[brace_start : i + 1]
    # Convert JS object literal -> JSON.
    # The generator writes JSON.stringify output (so it's already valid JSON usually).
    try:
        return json.loads(js_obj)
    except json.JSONDecodeError as e:
        # Fall back: quote unquoted keys
        fixed = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', js_obj)
        fixed = fixed.replace("'", '"')
        return json.loads(fixed)


def fetch_turso(recipe_id: str) -> dict | None:
    conn = _connect()
    cur = conn.execute(
        "SELECT nutrition_json FROM dev_recipes WHERE recipe_id = ?", (recipe_id,)
    )
    row = cur.fetchone()
    if not row or not row[0]:
        return None
    return json.loads(row[0])


def flatten(d: dict, prefix: str = "") -> dict:
    out = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            out.update(flatten(v, key))
        elif isinstance(v, list):
            out[key] = json.dumps(v, sort_keys=True)
        else:
            out[key] = v
    return out


def diff(label_a: str, a: dict, label_b: str, b: dict, tol_pct: float = 0.01):
    fa = flatten(a)
    fb = flatten(b)
    keys = sorted(set(fa) | set(fb))
    diffs = []
    for k in keys:
        va = fa.get(k, "<missing>")
        vb = fb.get(k, "<missing>")
        if va == vb:
            continue
        if isinstance(va, (int, float)) and isinstance(vb, (int, float)):
            denom = max(abs(va), abs(vb), 1e-9)
            pct = abs(va - vb) / denom * 100
            if pct < tol_pct:
                continue
            diffs.append((k, va, vb, f"{pct:+.3f}%"))
        else:
            diffs.append((k, va, vb, ""))
    print(f"\n=== {label_a}  vs  {label_b}  ({len(diffs)} differences) ===")
    if not diffs:
        print("  (identical within tolerance)")
        return
    for k, va, vb, p in diffs[:80]:
        sa = str(va)[:40]
        sb = str(vb)[:40]
        print(f"  {k:<40} {sa:>40}  |  {sb:<40}  {p}")
    if len(diffs) > 80:
        print(f"  ... and {len(diffs) - 80} more")


def main():
    print(f"Comparing {RECIPE_ID}")
    build = json.loads(BUILD_JSON.read_text())
    # The bundle stores the to_turso_nutrition_json() shape. The build JSON
    # carries per100g/per_serving + ingredients + sources. Re-derive turso shape:
    from lib.build import to_turso_nutrition_json

    derived = to_turso_nutrition_json(build)

    bundle = extract_bundle_nutrition(BUNDLE_TS, RECIPE_ID)
    turso = fetch_turso(RECIPE_ID)
    if turso is None:
        print(f"WARN: no Turso row for {RECIPE_ID}")

    diff("v3 build (derived)", derived, "bundle TS", bundle)
    if turso is not None:
        diff("bundle TS", bundle, "Turso", turso)
        diff("v3 build (derived)", derived, "Turso", turso)


if __name__ == "__main__":
    main()
