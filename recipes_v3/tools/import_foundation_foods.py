#!/usr/bin/env python3
"""Import a USDA Foundation Foods JSON release into the local comboo.db.

This is intentionally local-only. Foundation records use a leading-zero
NDB_NO (for example, Foundation 100252 becomes ``0100252``), so they can
share DataCentralCombo without colliding with SR Legacy rows.

The command is dry-run by default. Use --commit to update the local SQLite
database; it never writes to Turso.
"""
from __future__ import annotations

import argparse
import csv
import json
import sqlite3
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB = ROOT / "docs" / "comboo.db"
FOUNDATION_DIR = ROOT / "data" / "foundation"
FOUNDATION_COLLISIONS = ROOT / "docs" / "foundation_ndb_collisions.csv"
FOUNDATION_APPROVED_SEMANTIC = ROOT / "docs" / "foundation_approved_semantic_pairs.csv"
PORTION_COLUMNS = tuple(
    f"M{index}_{suffix}"
    for index in range(1, 13)
    for suffix in ("Seq", "Amt", "Desc", "Gm_Wgt")
)


# Foundation nutrient names are descriptive; DataCentralCombo uses its own
# established column names. These aliases cover the names in current releases.
NUTRIENT_ALIASES: dict[str, str] = {
    "protein": "Protein",
    "total lipid (fat)": "TotalLipidFat",
    "carbohydrate, by difference": "Carbohydrate",
    "starch": "Starch",
    "fiber, total dietary": "FiberTotalDietary",
    "sugars, total including nlea": "SugarsTotal",
    "sugars, total": "SugarsTotal",
    "total sugars": "SugarsTotal",
    "water": "Water",
    "ash": "Ash",
    "calcium, ca": "Calcium_Ca",
    "iron, fe": "Iron_Fe",
    "magnesium, mg": "Magnesium_Mg",
    "phosphorus, p": "Phosphorus_P",
    "potassium, k": "Potassium_K",
    "sodium, na": "Sodium_Na",
    "zinc, zn": "Zinc_Zn",
    "copper, cu": "Copper_Cu",
    "iodine, i": "Iodine_I",
    "fluoride, f": "Flouride_F",
    "manganese, mn": "Manganese_Mn",
    "selenium, se": "Selenium_Se",
    "vitamin a, rae": "VitaminA_RAE",
    "vitamin a": "VitaminA_IU",
    "carotene, alpha": "Carotene_alpha",
    "carotene, beta": "Carotene_beta",
    "cryptoxanthin, beta": "Cryptoxanthin_beta",
    "lutein + zeaxanthin": "LuteinZeaxanthin",
    "lycopene": "Lycopene",
    "retinol": "Retinol",
    "vitamin d (d2 + d3)": "VitaminD2D3",
    "vitamin d": "VitaminD",
    "vitamin d2": "VitaminD2_ergocalciferol",
    "vitamin d3": "VitaminD3_cholecalciferol",
    "vitamin d2 (ergocalciferol)": "VitaminD2_ergocalciferol",
    "vitamin d3 (cholecalciferol)": "VitaminD3_cholecalciferol",
    "vitamin d (d2 + d3), international units": "VitaminD",
    "vitamin e (alpha-tocopherol)": "VitaminE_alphaTocopherol",
    "tocopherol, beta": "Tocopherol_beta",
    "tocopherol, gamma": "Tocopherol_gamma",
    "tocopherol, delta": "Tocopherol_delta",
    "tocotrienol, alpha": "Tocotrienol_aplha",
    "tocotrienol, beta": "Tocotrienol_beta",
    "tocotrienol, gamma": "Tocotrienol_gamma",
    "tocotrienol, delta": "Tocotrienol_delta",
    "vitamin k (phylloquinone)": "VitaminK_phylloquinone",
    "vitamin k (dihydrophylloquinone)": "Dihydrophylloquinone",
    "vitamin k (menaquinone-4)": "Menaquinone4",
    "vitamin c, total ascorbic acid": "VitaminC_totalAscorbicAcid",
    "thiamin": "Thiamin",
    "riboflavin": "Riboflavin",
    "niacin": "Niacin",
    "vitamin b-6": "VitaminB6",
    "folate, total": "Folate_total",
    "folate, dfe": "Folate_DFE",
    "vitamin b-12": "VitaminB12",
    "pantothenic acid": "PantothenicAcid",
    "choline, total": "Choline_total",
    "betaine": "Betaine",
    "cholesterol": "Cholesterol",
    "tryptophan": "Tryptophan",
    "threonine": "Threonine",
    "isoleucine": "Isoleucine",
    "leucine": "Leucine",
    "lysine": "Lysine",
    "methionine": "Methionine",
    "cystine": "Cystine",
    "phenylalanine": "Phenylalanine",
    "tyrosine": "Tyrosine",
    "valine": "Valine",
    "arginine": "Arginine",
    "histidine": "Histidine",
    "alanine": "Alanine",
    "aspartic acid": "AsparticAcid",
    "glutamic acid": "GlutamicAcid",
    "glycine": "Glycine",
    "proline": "Proline",
    "serine": "Serine",
    "hydroxyproline": "Hydroxyproline",
    "fatty acids, total saturated": "FattyAcids_totalSaturated",
    "fatty acids, total monounsaturated": "FattyAcids_totalMonounsaturated",
    "fatty acids, total polyunsaturated": "FattyAcids_totalPolyunsaturated",
    "fatty acids, total trans": "FattyAcids_totalTrans",
    "fatty acids, total trans-monoenoic": "FattyAcids_totalTransMonoenoic",
    "fatty acids, total trans-polyenoic": "FattyAcids_totalTransPolyenoic",
    "linoleic acid": "LinoleicAcid",
    "pufa 18:2 n-6 c,c": "LinoleicAcid",
    "alpha-linolenic acid": "alphaLinolenicAcid",
    "pufa 18:3 n-3 c,c,c (ala)": "alphaLinolenicAcid",
    "pufa 18:3 n-6 c,c,c": "PUFA_18_3_n6",
    "pufa 20:3 n-3": "PUFA_20_3_n3",
    "epa": "EPA_20_5n3",
    "pufa 20:5 n-3 (epa)": "EPA_20_5n3",
    "pufa 20:5c": "EPA_20_5n3",
    "dpa": "DPA_22_5n3",
    "pufa 22:5 n-3 (dpa)": "DPA_22_5n3",
    "pufa 22:5 c": "DPA_22_5n3",
    "dha": "DHA_22_6n3",
    "pufa 22:6 n-3 (dha)": "DHA_22_6n3",
    "pufa 22:6 c": "DHA_22_6n3",
    "beta-sitosterol": "BetaSitosterol",
    "campesterol": "Campesterol",
    "stigmasterol": "Stigmasterol",
}

ENERGY_NAMES = {
    "energy",
    "energy (atwater specific factors)",
    "energy (atwater general factors)",
}
ENERGY_PRIORITY = (
    "energy",
    "energy (atwater specific factors)",
    "energy (atwater general factors)",
)

SUGAR_TOTAL_NAMES = {
    "sugars, total including nlea",
    "sugars, total",
    "total sugars",
}
SUGAR_COMPONENT_NAMES = {
    "sucrose",
    "glucose",
    "fructose",
    "galactose",
    "lactose",
    "maltose",
}
FAT_COMPONENT_NAMES = {
    "fatty acids, total saturated",
    "fatty acids, total monounsaturated",
    "fatty acids, total polyunsaturated",
    "fatty acids, total trans",
}
FAT_COMPONENT_ABS_TOLERANCE = 0.01


def latest_release() -> Path:
    releases = sorted(FOUNDATION_DIR.glob("FoodData_Central_foundation_food_json_*.json"))
    if not releases:
        raise FileNotFoundError(f"No extracted Foundation JSON found in {FOUNDATION_DIR}")
    return releases[-1]


def foundation_ndb(record: dict[str, Any]) -> str:
    return f"0{int(record['ndbNumber'])}"


def nutrient_values(record: dict[str, Any]) -> dict[str, float]:
    values: dict[str, float] = {}
    energy_values: dict[str, float] = {}
    sugar_components: dict[str, float] = {}
    has_sugar_total = False
    fat_nlea: float | None = None
    fat_components: dict[str, float] = {}
    for entry in record.get("foodNutrients", []):
        nutrient = entry.get("nutrient") or {}
        name = str(nutrient.get("name") or "").strip().lower()
        unit = str(nutrient.get("unitName") or "").strip().lower()
        if name == "energy" and unit != "kcal":
            continue
        amount = entry.get("amount")
        if name in ENERGY_NAMES and amount is not None:
            try:
                energy_values[name] = float(amount)
            except (TypeError, ValueError):
                pass
            continue
        if amount is not None and name == "total fat (nlea)":
            try:
                fat_nlea = float(amount)
            except (TypeError, ValueError):
                pass
        elif amount is not None and name in FAT_COMPONENT_NAMES:
            try:
                fat_components[name] = float(amount)
            except (TypeError, ValueError):
                pass
        column = NUTRIENT_ALIASES.get(name)
        if not column or amount is None or column in values:
            if name in SUGAR_TOTAL_NAMES and amount is not None:
                has_sugar_total = True
            if name in SUGAR_COMPONENT_NAMES and amount is not None:
                try:
                    sugar_components[name] = float(amount)
                except (TypeError, ValueError):
                    pass
            continue
        try:
            values[column] = float(amount)
        except (TypeError, ValueError):
            continue
        if name in SUGAR_TOTAL_NAMES:
            has_sugar_total = True
        elif name in SUGAR_COMPONENT_NAMES:
            sugar_components[name] = values[column]

    if not has_sugar_total and sugar_components:
        values["SugarsTotal"] = sum(sugar_components.values())
    if "TotalLipidFat" not in values:
        if fat_nlea is not None:
            values["TotalLipidFat"] = fat_nlea
        elif FAT_COMPONENT_NAMES <= fat_components.keys():
            values["TotalLipidFat"] = sum(fat_components.values())
    for energy_name in ENERGY_PRIORITY:
        if energy_name in energy_values:
            values["Energy_KCal"] = energy_values[energy_name]
            break
    return values


def sugar_component_fallback(record: dict[str, Any]) -> tuple[float, list[str]] | None:
    """Return the sugar-component fallback used when no total is reported."""
    names: list[str] = []
    total_reported = False
    amounts: list[float] = []
    for entry in record.get("foodNutrients", []):
        nutrient = entry.get("nutrient") or {}
        name = str(nutrient.get("name") or "").strip().lower()
        amount = entry.get("amount")
        if name in SUGAR_TOTAL_NAMES and amount is not None:
            total_reported = True
        elif name in SUGAR_COMPONENT_NAMES and amount is not None:
            try:
                amounts.append(float(amount))
                names.append(name)
            except (TypeError, ValueError):
                continue
    if total_reported or not amounts:
        return None
    return sum(amounts), names


def fat_component_check(record: dict[str, Any]) -> tuple[float, float | None, list[str]] | None:
    """Return the four-part fat subtotal and optional NLEA comparison value."""
    components: dict[str, float] = {}
    nlea: float | None = None
    for entry in record.get("foodNutrients", []):
        nutrient = entry.get("nutrient") or {}
        name = str(nutrient.get("name") or "").strip().lower()
        amount = entry.get("amount")
        if amount is None:
            continue
        try:
            numeric_amount = float(amount)
        except (TypeError, ValueError):
            continue
        if name in FAT_COMPONENT_NAMES:
            components[name] = numeric_amount
        elif name == "total fat (nlea)":
            nlea = numeric_amount
    if FAT_COMPONENT_NAMES <= components.keys():
        return sum(components.values()), nlea, sorted(components)
    return None


def portion_values(record: dict[str, Any]) -> dict[str, Any]:
    values: dict[str, Any] = {}
    for index, portion in enumerate(record.get("foodPortions", [])[:12], start=1):
        values[f"M{index}_Seq"] = str(index)
        values[f"M{index}_Amt"] = portion.get("amount")
        values[f"M{index}_Desc"] = portion.get("portionDescription") or portion.get("modifier") or ""
        values[f"M{index}_Gm_Wgt"] = portion.get("gramWeight")
    return values


def load_foundation_pairs() -> dict[str, str]:
    """Return numeric-collision and explicitly approved semantic pairs."""
    pairs: dict[str, str] = {}
    if FOUNDATION_COLLISIONS.exists():
        with FOUNDATION_COLLISIONS.open(newline="", encoding="utf-8") as handle:
            pairs.update(
                {
                    row["foundation_ndb"]: row["legacy_ndb"]
                    for row in csv.DictReader(handle)
                    if row.get("foundation_ndb") and row.get("legacy_ndb")
                }
            )
    if FOUNDATION_APPROVED_SEMANTIC.exists():
        with FOUNDATION_APPROVED_SEMANTIC.open(newline="", encoding="utf-8") as handle:
            pairs.update(
                {
                    row["foundation_ndb"]: row["legacy_ndb"]
                    for row in csv.DictReader(handle)
                    if row.get("foundation_ndb") and row.get("legacy_ndb")
                }
            )
    return pairs


def legacy_portion_values(row: sqlite3.Row | None) -> dict[str, Any]:
    if row is None:
        return {}
    return {column: row[column] for column in PORTION_COLUMNS}


def build_row(
    record: dict[str, Any],
    key10: int,
    serving_row: sqlite3.Row | None = None,
) -> dict[str, Any]:
    row: dict[str, Any] = {
        "NDB_NO": foundation_ndb(record),
        "FdGrp_Cd": "FOUNDATION",
        "Long_Desc": record.get("description") or "",
        "Shrt_Desc": record.get("description") or "",
        "key10": key10,
        "fat": "n",
    }
    row.update(nutrient_values(record))
    row.update(portion_values(record))
    row.update(legacy_portion_values(serving_row))
    return row


def import_release(json_path: Path, db_path: Path, commit: bool) -> None:
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    records_raw = payload.get("FoundationFoods")
    if not isinstance(records_raw, list):
        raise ValueError("Expected top-level FoundationFoods array")
    records = [record for record in records_raw if isinstance(record, dict)]
    skipped = len(records_raw) - len(records)

    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        columns = {row[1] for row in conn.execute("PRAGMA table_info(DataCentralCombo)")}
        foundation_pairs = load_foundation_pairs()
        legacy_ndbs = sorted(set(foundation_pairs.values()))
        legacy_portions = {}
        if legacy_ndbs:
            placeholders = ", ".join("?" for _ in legacy_ndbs)
            legacy_portions = {
                row["NDB_NO"]: row
                for row in conn.execute(
                    f"SELECT NDB_NO, {', '.join(PORTION_COLUMNS)} "
                    f"FROM DataCentralCombo WHERE NDB_NO IN ({placeholders})",
                    legacy_ndbs,
                )
            }
        legacy_ranks = {
            str(ndb): int(rank)
            for ndb, rank in conn.execute(
                "SELECT NDB_NO, key10 FROM DataCentralCombo "
                "WHERE NDB_NO NOT LIKE '0%' AND key10 IS NOT NULL"
            )
            if str(rank).strip().lstrip("-").isdigit()
        }
        foundation_ranks = {
            str(ndb): int(rank)
            for ndb, rank in conn.execute(
                "SELECT NDB_NO, key10 FROM DataCentralCombo "
                "WHERE NDB_NO LIKE '0%' AND key10 IS NOT NULL"
            )
            if str(rank).strip().lstrip("-").isdigit() and int(rank) > 0
        }
        rows = [
            build_row(
                record,
                foundation_ranks.get(
                    foundation_ndb(record),
                    legacy_ranks.get(str(int(record["ndbNumber"])), 1),
                ),
                legacy_portions.get(foundation_pairs.get(foundation_ndb(record))),
            )
            for record in records
        ]
        sugar_fallbacks = [
            (record, sugar_component_fallback(record))
            for record in records
            if sugar_component_fallback(record) is not None
        ]
        fat_checks = [
            (record, fat_component_check(record))
            for record in records
            if fat_component_check(record) is not None
        ]
        invalid = sorted({key for row in rows for key in row if key not in columns})
        if invalid:
            raise RuntimeError(f"Mapped columns are absent from DataCentralCombo: {invalid}")

        existing = {
            row[0]
            for row in conn.execute(
                "SELECT NDB_NO FROM DataCentralCombo WHERE NDB_NO LIKE '0%'"
            )
        }
        print(f"Release: {json_path.name}")
        print(f"Records: {len(rows)}")
        print(f"Skipped null release entries: {skipped}")
        print(f"Existing Foundation rows: {len(existing)}")
        copied_portions = sum(
            foundation_ndb(record) in foundation_pairs for record in records
        )
        print(f"SR Legacy M1-M12 portion sets copied: {copied_portions}")
        print(f"Sugar totals reconstructed from individual sugars: {len(sugar_fallbacks)}")
        for record, fallback in sugar_fallbacks:
            assert fallback is not None
            amount, names = fallback
            print(
                f"  FLAG sugar fallback NDB {foundation_ndb(record)}: "
                f"{record.get('description') or ''} = {amount:g} g "
                f"from {', '.join(names)}"
            )
        print(f"Fat component checks with all four aggregates: {len(fat_checks)}")
        for record, check in fat_checks:
            assert check is not None
            subtotal, nlea, names = check
            if nlea is not None:
                difference = subtotal - nlea
                status = (
                    "PASS fat rounding"
                    if abs(difference) <= FAT_COMPONENT_ABS_TOLERANCE + 1e-9
                    else "FLAG fat component check"
                )
                print(
                    f"  {status} NDB {foundation_ndb(record)}: "
                    f"sum={subtotal:g} g vs NLEA={nlea:g} g "
                    f"diff={difference:+g} g from {', '.join(names)}"
                )
        print(f"Action: {'UPDATE local database' if commit else 'DRY RUN (use --commit to write)'}")

        if not commit:
            return

        for row in rows:
            names = list(row)
            placeholders = ", ".join("?" for _ in names)
            quoted_names = ", ".join(f'"{name}"' for name in names)
            sql = f"INSERT INTO DataCentralCombo ({quoted_names}) VALUES ({placeholders})"
            # NDB_NO is indexed but not UNIQUE in this legacy table, so an
            # explicit replacement is required for repeatable local releases.
            conn.execute("DELETE FROM DataCentralCombo WHERE NDB_NO = ?", (row["NDB_NO"],))
            conn.execute(sql, [row[name] for name in names])
        conn.commit()
        print(f"Imported: {len(rows)} Foundation rows into {db_path}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=None, help="Extracted Foundation JSON")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help="Local SQLite comboo.db")
    parser.add_argument("--commit", action="store_true", help="Write rows; default is dry-run")
    args = parser.parse_args()
    import_release(args.input or latest_release(), args.db, args.commit)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())