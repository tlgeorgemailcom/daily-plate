#!/usr/bin/env python3
"""Write ledger-to-Foundation replacement pairs from a local comboo database."""
from __future__ import annotations

import argparse
import csv
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_LEDGER = ROOT / "recipes_v3" / "data" / "ingredients_ledger.csv"
DEFAULT_DB = ROOT / "docs" / "comboo-foundation.db"
DEFAULT_OUTPUT = ROOT / "docs" / "foundation_ledger_pairs.csv"


def build_pairs(ledger_path: Path, db_path: Path) -> list[dict[str, str]]:
    with ledger_path.open(newline="", encoding="utf-8") as handle:
        ledger_rows = list(csv.DictReader(handle))

    with sqlite3.connect(db_path) as conn:
        foundation_rows = {
            str(ndb): (str(description or ""), str(key10 or ""))
            for ndb, description, key10 in conn.execute(
                "SELECT NDB_NO, Long_Desc, key10 FROM DataCentralCombo "
                "WHERE NDB_NO LIKE '0%'"
            )
        }

    pairs: list[dict[str, str]] = []
    for ledger in ledger_rows:
        legacy_ndb = str(ledger["ndb_no"]).strip()
        foundation_ndb = f"0{int(legacy_ndb)}"
        foundation = foundation_rows.get(foundation_ndb)
        if foundation is None:
            continue
        pairs.append(
            {
                "ingredient_key": ledger["ingredient_key"],
                "food_word": ledger["food_word"],
                "legacy_ndb": legacy_ndb,
                "ledger_long_desc": ledger["default_long_desc"],
                "foundation_ndb": foundation_ndb,
                "foundation_long_desc": foundation[0],
                "foundation_key10": foundation[1],
            }
        )
    return pairs


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", type=Path, default=DEFAULT_LEDGER)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    pairs = build_pairs(args.ledger, args.db)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", newline="", encoding="utf-8") as handle:
        fieldnames = list(pairs[0]) if pairs else [
            "ingredient_key", "food_word", "legacy_ndb", "ledger_long_desc",
            "foundation_ndb", "foundation_long_desc", "foundation_key10",
        ]
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(pairs)
    print(f"Wrote {len(pairs)} ledger/Foundation pairs to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())