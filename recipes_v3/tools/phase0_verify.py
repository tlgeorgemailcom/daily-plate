#!/usr/bin/env python3
"""Phase 0 — Pre-build data verification.

Checks:
  1. recipes.csv has all 40 SWEET recipes
  2. recipe_ingredients.csv has rows for every recipe in recipes.csv
  3. Every ingredient_key in recipe_ingredients.csv exists in ingredients_ledger.csv
  4. Every ndb_no in ingredients_ledger.csv exists in comboo.db::DataCentralCombo
  5. Every Rule A/B recipe has a canonical_ndb_no

Writes findings to stdout; intended to feed PHASE_0_REPORT.md.
"""
import csv
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
COMBOO_DB = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")


def load_csv(path: Path) -> list[dict]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main() -> int:
    print("=" * 70)
    print("PHASE 0 — Pre-Build Data Verification")
    print("=" * 70)

    recipes = load_csv(DATA / "recipes.csv")
    ledger = load_csv(DATA / "ingredients_ledger.csv")
    ings = load_csv(DATA / "recipe_ingredients.csv")
    instr = load_csv(DATA / "recipe_instructions.csv")

    print(f"\nLoaded:")
    print(f"  recipes.csv             {len(recipes):4d} rows")
    print(f"  ingredients_ledger.csv  {len(ledger):4d} rows")
    print(f"  recipe_ingredients.csv  {len(ings):4d} rows")
    print(f"  recipe_instructions.csv {len(instr):4d} rows")

    issues = []

    # Check 1 — SWEET coverage
    print("\n--- Check 1: SWEET recipe coverage ---")
    sweet_ids = sorted({r["recipe_id"] for r in recipes if r["recipe_id"].startswith("SWEET_")})
    print(f"  SWEET recipes in recipes.csv: {len(sweet_ids)}")
    expected = {f"SWEET_{i:03d}" for i in range(1, 41)}
    missing = expected - set(sweet_ids)
    extra = set(sweet_ids) - expected
    if missing:
        issues.append(f"Missing SWEET ids: {sorted(missing)}")
        print(f"  MISSING: {sorted(missing)}")
    if extra:
        print(f"  EXTRA (beyond 1-40): {sorted(extra)}")
    if not missing:
        print(f"  OK — all 40 SWEET recipes present")

    # Check 2 — every recipe has ingredient rows
    print("\n--- Check 2: recipes have ingredient rows ---")
    ing_by_recipe = defaultdict(list)
    for row in ings:
        ing_by_recipe[row["recipe_id"]].append(row)
    no_ings = [r["recipe_id"] for r in recipes if r["recipe_id"].startswith("SWEET_") and not ing_by_recipe.get(r["recipe_id"])]
    if no_ings:
        issues.append(f"SWEET recipes with NO ingredients: {no_ings}")
        print(f"  MISSING ingredients for: {no_ings}")
    else:
        print(f"  OK — every SWEET recipe has at least 1 ingredient row")
    counts = sorted([(rid, len(ing_by_recipe.get(rid, []))) for rid in sweet_ids], key=lambda x: x[1])
    print(f"  Min ingredients: {counts[0]}, Max: {counts[-1]}")

    # Check 3 — ingredient_key referential integrity
    print("\n--- Check 3: ingredient_key in ledger ---")
    ledger_keys = {row["ingredient_key"] for row in ledger}
    used_keys = {row["ingredient_key"] for row in ings}
    orphan_keys = used_keys - ledger_keys
    unused_ledger_keys = ledger_keys - used_keys
    if orphan_keys:
        issues.append(f"ingredient_keys in recipe_ingredients but NOT in ledger: {sorted(orphan_keys)}")
        print(f"  ORPHAN keys (used in recipes, missing in ledger): {len(orphan_keys)}")
        for k in sorted(orphan_keys):
            print(f"    - {k}")
    else:
        print(f"  OK — all {len(used_keys)} used keys exist in ledger")
    if unused_ledger_keys:
        print(f"  Unused ledger keys (informational): {len(unused_ledger_keys)}")

    # Check 4 — NDB referential integrity vs comboo.db
    print("\n--- Check 4: NDB numbers in comboo.db ---")
    if not COMBOO_DB.exists():
        issues.append(f"comboo.db missing at {COMBOO_DB}")
        print(f"  ERROR: {COMBOO_DB} not found")
    else:
        conn = sqlite3.connect(str(COMBOO_DB))
        cur = conn.cursor()
        # Discover table & NDB column
        tables = [r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
        print(f"  comboo.db tables: {tables[:5]}{'...' if len(tables) > 5 else ''}")
        # Try DataCentralCombo
        target_table = None
        for t in tables:
            if "datacentralcombo" in t.lower() or t.lower() == "datacentralcombo":
                target_table = t
                break
        if not target_table:
            # fallback — pick first table with NDB_No column
            for t in tables:
                cols = [c[1] for c in cur.execute(f"PRAGMA table_info({t})").fetchall()]
                if any(c.lower() == "ndb_no" for c in cols):
                    target_table = t
                    break
        if not target_table:
            issues.append("Could not find table with NDB_No column in comboo.db")
            print("  ERROR: no table with NDB_No found")
        else:
            print(f"  Using table: {target_table}")
            ndbs_in_db = {str(r[0]) for r in cur.execute(f"SELECT NDB_No FROM {target_table}").fetchall()}
            print(f"  comboo.db has {len(ndbs_in_db)} NDB numbers")
            ledger_ndbs = {row["ndb_no"] for row in ledger if row.get("ndb_no")}
            missing_ndbs = ledger_ndbs - ndbs_in_db
            if missing_ndbs:
                issues.append(f"NDBs in ledger NOT in comboo.db: {sorted(missing_ndbs)}")
                print(f"  MISSING NDBs ({len(missing_ndbs)}): {sorted(missing_ndbs)}")
            else:
                print(f"  OK — all {len(ledger_ndbs)} ledger NDBs present in comboo.db")
        conn.close()

    # Check 5 — Rule A/B has canonical_ndb_no
    print("\n--- Check 5: Rule A/B have canonical_ndb_no ---")
    rule_ab = [r for r in recipes if r.get("sr_rule", "").strip() in ("Rule A", "Rule B", "A", "B")]
    no_canon = [r["recipe_id"] for r in rule_ab if not r.get("canonical_ndb_no", "").strip()]
    if no_canon:
        issues.append(f"Rule A/B recipes missing canonical_ndb_no: {no_canon}")
        print(f"  MISSING canonical_ndb_no for {len(no_canon)} Rule A/B recipes:")
        for rid in no_canon:
            print(f"    - {rid}")
    else:
        print(f"  OK — all {len(rule_ab)} Rule A/B recipes have canonical_ndb_no")

    # Summary
    print("\n" + "=" * 70)
    if issues:
        print(f"PHASE 0: {len(issues)} ISSUE(S) FOUND")
        print("=" * 70)
        for i, msg in enumerate(issues, 1):
            print(f"  [{i}] {msg[:120]}{'...' if len(msg) > 120 else ''}")
        return 1
    else:
        print("PHASE 0: ALL CHECKS PASSED — ready to build")
        print("=" * 70)
        return 0


if __name__ == "__main__":
    sys.exit(main())
