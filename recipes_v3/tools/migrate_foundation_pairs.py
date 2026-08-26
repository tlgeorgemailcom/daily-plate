#!/usr/bin/env python3
"""Retire duplicate SR Legacy rows and point recipe data at Foundation IDs."""
from __future__ import annotations

import argparse
import csv
import shutil
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PAIRS = ROOT / "docs" / "foundation_ledger_pairs.csv"
DB = ROOT / "docs" / "comboo-foundation.db"
LEDGER = ROOT / "recipes_v3" / "data" / "ingredients_ledger.csv"
PORTIONS = (
    ROOT / "food-portions-complete.csv",
    ROOT / "docs" / "food-portions-complete.csv",
    ROOT / "src" / "lib" / "data" / "food-portions-complete.csv",
)


def load_pairs() -> tuple[dict[str, str], dict[str, str]]:
    with PAIRS.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    by_key = {row["ingredient_key"]: row["foundation_ndb"] for row in rows}
    by_legacy: dict[str, str] = {}
    for row in rows:
        legacy = row["legacy_ndb"]
        foundation = row["foundation_ndb"]
        if legacy in by_legacy and by_legacy[legacy] != foundation:
            raise ValueError("Foundation pair report has conflicting legacy NDB mappings")
        by_legacy[legacy] = foundation
    if len(by_key) != len(rows):
        raise ValueError("Foundation pair report has duplicate ingredient keys")
    if len(by_legacy) > len(rows):
        raise ValueError("Foundation pair report has conflicting legacy NDB mappings")
    return by_key, by_legacy


def rewrite_csv(
    path: Path, replacements: dict[str, str], match_field: str, target_field: str
) -> int:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        rows = list(reader)
    if not rows or match_field not in rows[0] or target_field not in rows[0]:
        raise ValueError(f"{path}: missing {match_field} or {target_field} column")
    match_index = rows[0].index(match_field)
    target_index = rows[0].index(target_field)
    changed = 0
    for row in rows:
        if len(row) <= max(match_index, target_index):
            raise ValueError(f"{path}: row is missing a required field")
        old = row[match_index].strip()
        new = replacements.get(old)
        if new is not None and row[target_index].strip() != new:
            row[target_index] = new
            changed += 1
    temp = path.with_suffix(path.suffix + ".tmp")
    with temp.open("w", newline="", encoding="utf-8") as handle:
        csv.writer(handle, lineterminator="\r\n").writerows(rows)
    temp.replace(path)
    return changed


def migrate(commit: bool) -> None:
    by_key, by_legacy = load_pairs()
    if not commit:
        print(f"Would migrate {len(by_key)} ledger keys and {len(by_legacy)} NDB identities")
        return

    backup = DB.with_name(DB.name + ".bak-foundation-pairs")
    if not backup.exists():
        shutil.copy2(DB, backup)

    ledger_before = LEDGER.read_bytes()
    portion_before = {path: path.read_bytes() for path in PORTIONS if path.exists()}
    try:
        ledger_changed = rewrite_csv(LEDGER, by_key, "ingredient_key", "ndb_no")
        portion_changed = sum(
            rewrite_csv(path, by_legacy, "NDB_NO", "NDB_NO")
            for path in PORTIONS
            if path.exists()
        )
        if ledger_changed not in (0, len(by_key)):
            raise ValueError(
                f"Expected either 0 or {len(by_key)} ledger changes, got {ledger_changed}"
            )

        with sqlite3.connect(DB) as conn:
            changed = conn.execute(
                """
                UPDATE DataCentralCombo
                   SET key10 = '0'
                 WHERE FdGrp_Cd <> 'FOUNDATION'
                   AND CAST(NDB_No AS INTEGER) IN (
                       SELECT CAST(NDB_No AS INTEGER)
                         FROM DataCentralCombo
                        WHERE FdGrp_Cd = 'FOUNDATION'
                   )
                """
            ).rowcount
            if changed not in (0, 204):
                raise ValueError(f"Expected either 0 or 204 database changes, got {changed}")
            conn.commit()
        print(
            f"Migrated {ledger_changed} ledger keys, {portion_changed} portion rows, "
            f"and {changed} SR Legacy database rows"
        )
    except Exception:
        LEDGER.write_bytes(ledger_before)
        for path, contents in portion_before.items():
            path.write_bytes(contents)
        raise


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--commit", action="store_true", help="apply the migration")
    args = parser.parse_args()
    migrate(args.commit)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())