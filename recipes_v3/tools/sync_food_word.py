#!/usr/bin/env python3
"""Reconcile dev_recipes.food_word with recipes_v3/data/recipes.csv.

CSV is source of truth. Optionally validates each food_word exists in
src/lib/data/food-portions-complete.csv (the canonical USDA word list).

Usage:
  python3 recipes_v3/tools/sync_food_word.py            # dry-run diff
  python3 recipes_v3/tools/sync_food_word.py --commit   # push CSV -> Turso
  python3 recipes_v3/tools/sync_food_word.py --check    # exit 1 on drift
"""
from __future__ import annotations

import argparse
import csv
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT / "recipes_v3" / "data" / "recipes.csv"
WORDS_PATH = ROOT / "src" / "lib" / "data" / "food-portions-complete.csv"


def load_csv_food_words() -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    with CSV_PATH.open() as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row["recipe_id"]
            if rid.startswith("SWEET_"):
                out[rid] = {"food_word": row["food_word"], "sr_rule": row.get("sr_rule", "")}
    return out


def load_canonical_words() -> set[str]:
    out: set[str] = set()
    with WORDS_PATH.open() as f:
        reader = csv.DictReader(f)
        for row in reader:
            w = row.get("word")
            if w:
                out.add(w)
    return out


def validate_canonical(csv_map: dict[str, dict[str, str]], canonical: set[str]) -> tuple[list[str], list[str]]:
    """Returns (errors, warnings). Rule D recipes are warnings (bespoke keys allowed)."""
    errors: list[str] = []
    warnings: list[str] = []
    for rid, info in csv_map.items():
        word = info["food_word"]
        if word in canonical:
            continue
        msg = f"  {rid} food_word={word!r} not in food-portions-complete.csv"
        if info["sr_rule"] == "Rule D":
            warnings.append(msg + " (Rule D — bespoke key OK)")
        else:
            errors.append(msg)
    return errors, warnings


def fetch_turso() -> dict[str, str]:
    import libsql_experimental as libsql
    url = os.environ.get("TURSO_DATABASE_URL")
    token = os.environ.get("TURSO_AUTH_TOKEN")
    if not url or not token:
        sys.exit("Need TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env (try: set -a && source .env.local && set +a)")
    conn = libsql.connect("local.db", sync_url=url, auth_token=token)
    conn.sync()
    cur = conn.execute("SELECT recipe_id, food_word FROM dev_recipes WHERE recipe_id LIKE 'SWEET_%'")
    return {row[0]: row[1] for row in cur.fetchall()}, conn


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--commit", action="store_true", help="Push CSV -> Turso")
    ap.add_argument("--check", action="store_true", help="Exit 1 if CSV/Turso drift or canonical-word problems")
    args = ap.parse_args()

    csv_map = load_csv_food_words()
    canonical = load_canonical_words()
    canon_errors, canon_warnings = validate_canonical(csv_map, canonical)
    if canon_warnings:
        print("Canonical-word warnings:")
        for w in canon_warnings:
            print(w)
    if canon_errors:
        print("Canonical-word errors (non-Rule-D recipes with food_word missing from food-portions-complete.csv):")
        for p in canon_errors:
            print(p)
        if args.check:
            return 1

    turso_map, conn = fetch_turso()
    drift = []
    for rid, info in csv_map.items():
        csv_w = info["food_word"]
        turso_w = turso_map.get(rid)
        if turso_w != csv_w:
            drift.append((rid, turso_w, csv_w))

    if not drift:
        print(f"OK: all {len(csv_map)} SWEET food_word values match between CSV and Turso.")
        return 0

    print(f"Drift: {len(drift)} rows differ between CSV and Turso.")
    print(f"{'recipe_id':<14} {'turso':<40} {'csv (truth)':<40}")
    for rid, t, c in drift:
        print(f"{rid:<14} {t!r:<40} {c!r:<40}")

    if args.check:
        return 1

    if not args.commit:
        print("\nDry-run. Re-run with --commit to push CSV values to Turso.")
        return 0

    print("\nCommitting...")
    for rid, _, csv_w in drift:
        conn.execute("UPDATE dev_recipes SET food_word=? WHERE recipe_id=?", (csv_w, rid))
    conn.commit()
    conn.sync()
    print(f"Updated {len(drift)} rows.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
