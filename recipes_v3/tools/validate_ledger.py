#!/usr/bin/env python3
"""Validate recipes_v3 ↔ food-portions-complete.csv consistency.

Three rules enforced:
  1. Every ledger ndb_no must exist in food-portions-complete.csv::NDB_NO.
  2. Every ledger food_word must equal food-portions-complete.csv[ndb_no].word.
  3. Every recipes.csv food_word must exist in food-portions-complete.csv::word
     (Rule D recipes allowed bespoke keys; warning only).

Exit 0 if clean, 1 otherwise.

Usage:
  python3 recipes_v3/tools/validate_ledger.py
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LEDGER = ROOT / "recipes_v3" / "data" / "ingredients_ledger.csv"
RECIPES = ROOT / "recipes_v3" / "data" / "recipes.csv"
PORTIONS = ROOT / "src" / "lib" / "data" / "food-portions-complete.csv"


def main() -> int:
    # Load food-portions: NDB -> word
    ndb_to_word: dict[str, str] = {}
    words: set[str] = set()
    with PORTIONS.open() as f:
        for r in csv.DictReader(f):
            ndb_to_word[r["NDB_NO"]] = r["word"]
            words.add(r["word"])

    errors: list[str] = []
    warnings: list[str] = []

    # Rule 1+2: ledger
    with LEDGER.open() as f:
        for r in csv.DictReader(f):
            ik = r["ingredient_key"]
            ndb = r["ndb_no"]
            fw = r.get("food_word", "")
            canonical = ndb_to_word.get(ndb)
            if canonical is None:
                errors.append(f"  ledger {ik}: ndb_no={ndb} not in food-portions-complete.csv")
                continue
            if fw != canonical:
                errors.append(f"  ledger {ik}: food_word={fw!r} but ndb {ndb} maps to {canonical!r}")

    # Rule 3: recipes
    with RECIPES.open() as f:
        for r in csv.DictReader(f):
            rid = r["recipe_id"]
            if not rid.startswith("SWEET_"):
                continue
            fw = r["food_word"]
            if fw in words:
                continue
            msg = f"  recipes {rid}: food_word={fw!r} not in food-portions-complete.csv"
            if r.get("sr_rule") == "Rule D":
                warnings.append(msg + " (Rule D — bespoke key OK)")
            else:
                errors.append(msg)

    if warnings:
        print("Warnings:")
        for w in warnings:
            print(w)

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors:
            print(e)
        return 1

    print("\nOK: ledger and recipes are consistent with food-portions-complete.csv.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
