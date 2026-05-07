#!/usr/bin/env python3
"""Export approved recipes_v2 rows into the app's legacy CSV contract.

The web app and several generators still read recipe data from src/lib/data/*.csv.
This script keeps that contract intact while sourcing the content from recipes_v2.
"""

from __future__ import annotations

import csv
import re
import sqlite3
from pathlib import Path


ROOT = Path("/Volumes/training/Daily Food Chain/daily-food-chain")
V2_DATA = ROOT / "recipes_v2" / "data"
APP_DATA = ROOT / "src" / "lib" / "data"
COMBOO_DB = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")

V2_RECIPES_CSV = V2_DATA / "recipes.csv"
V2_INGREDIENTS_CSV = V2_DATA / "recipe_ingredients.csv"
V2_INSTRUCTIONS_CSV = V2_DATA / "recipe_instructions.csv"
LEDGER_CSV = V2_DATA / "ingredients_ledger.csv"

APP_RECIPES_CSV = APP_DATA / "recipes.csv"
APP_INGREDIENTS_CSV = APP_DATA / "recipe_ingredients.csv"
APP_INSTRUCTIONS_CSV = APP_DATA / "recipe_instructions.csv"

APP_RECIPE_FIELDS = [
    "recipe_id",
    "food_word",
    "recipe_name",
    "category",
    "dietary_category",
    "link_type",
    "prep_time",
    "servings",
    "sr28_rule",
    "sr28_notes",
    "status",
]

APP_INGREDIENT_FIELDS = [
    "recipe_id",
    "recipe_name",
    "row_order",
    "row_type",
    "ing_name",
    "ing_qty",
    "sr28_long_desc",
    "ndb_no",
    "portion_desc",
    "portion_grams",
    "serving_count",
    "notes",
    "game_food",
    "animal",
]

APP_INSTRUCTION_FIELDS = ["recipe_id", "recipe_name", "step_order", "step_text"]

LEDGER_KEY_ALIASES = {
    "water": "water_tap",
}


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def normalize_category(raw: str) -> str:
    raw = (raw or "").strip()
    mapping = {
        "sweet": "Sweets & Desserts",
        "sweets & desserts": "Sweets & Desserts",
        "snack": "Snacks",
        "snacks": "Snacks",
        "breakfast": "Breakfast",
        "lunch": "Lunch",
        "dinner": "Dinner",
        "side": "Sides",
        "sides": "Sides",
        "salad": "Salads",
        "salads": "Salads",
        "beverage": "Beverages",
        "beverages": "Beverages",
    }
    if not raw:
        return "Other"
    lowered = raw.lower()
    return mapping.get(lowered, raw.title())


def normalize_dietary(raw: str) -> str:
    raw = (raw or "").strip()
    mapping = {
        "vegetarian": "veggie",
        "veggie": "veggie",
        "vegan": "vegan",
        "all": "all",
    }
    if not raw:
        return "all"
    return mapping.get(raw.lower(), raw)


def map_status(raw: str) -> str:
    raw = (raw or "").strip().lower()
    mapping = {
        "approved": "published",
        "published": "published",
        "review": "review",
        "draft": "draft",
        "todo": "todo",
    }
    return mapping.get(raw, "draft")


def format_float(value: str | float | int) -> str:
    number = float(value)
    return str(int(number)) if number.is_integer() else str(number)


def parse_bool(value: str) -> bool:
    return (value or "").strip().lower() == "true"


def tokenize(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.lower()))


def display_name(default_name: str, override: str) -> str:
    default_name = (default_name or "").strip()
    override = (override or "").strip()
    if not override:
        return default_name
    if not default_name:
        return override
    if tokenize(default_name) & tokenize(override):
        return override
    return f"{default_name} ({override})"


def note_string(section: str, is_optional: bool) -> str:
    notes: list[str] = []
    if is_optional:
        notes.append("optional")
    if section:
        notes.append(f"section={section}")
    return ";".join(notes)


def order_key(value: str) -> tuple[int, str]:
    value = (value or "").strip()
    match = re.match(r"^(\d+)(.*)$", value)
    if not match:
        return (10**9, value)
    return (int(match.group(1)), match.group(2))


class CanonicalLookup:
    def __init__(self, db_path: Path) -> None:
        self.connection = sqlite3.connect(str(db_path))
        self.cache: dict[str, str] = {}

    def long_desc(self, ndb_no: str) -> str:
        ndb_no = (ndb_no or "").strip()
        if not ndb_no:
            return ""
        if ndb_no not in self.cache:
            row = self.connection.execute(
                "SELECT Long_Desc FROM DataCentralCombo WHERE NDB_NO = ? LIMIT 1",
                (ndb_no,),
            ).fetchone()
            self.cache[ndb_no] = row[0] if row and row[0] else ""
        return self.cache[ndb_no]

    def close(self) -> None:
        self.connection.close()


def main() -> None:
    recipes_rows = load_csv(V2_RECIPES_CSV)
    ingredient_rows = load_csv(V2_INGREDIENTS_CSV)
    instruction_rows = load_csv(V2_INSTRUCTIONS_CSV)
    ledger_rows = load_csv(LEDGER_CSV)

    ledger_by_key = {row["ingredient_key"]: row for row in ledger_rows}

    approved_recipes = [row for row in recipes_rows if row.get("status") == "approved"]
    recipe_meta = {row["recipe_id"]: row for row in approved_recipes}
    approved_ids = set(recipe_meta)

    lookup = CanonicalLookup(COMBOO_DB)
    app_recipe_rows: list[dict[str, object]] = []
    app_ingredient_rows: list[dict[str, object]] = []
    app_instruction_rows: list[dict[str, object]] = []

    for row in approved_recipes:
        app_recipe_rows.append(
            {
                "recipe_id": row["recipe_id"],
                "food_word": row.get("food_word", ""),
                "recipe_name": row.get("recipe_name", ""),
                "category": normalize_category(row.get("category", "")),
                "dietary_category": normalize_dietary(row.get("dietary_category", "")),
                "link_type": "dish",
                "prep_time": row.get("prep_time", ""),
                "servings": row.get("servings_label", ""),
                "sr28_rule": row.get("sr_rule", ""),
                "sr28_notes": row.get("disclosure") or row.get("sr_notes") or "",
                "status": map_status(row.get("status", "")),
            }
        )

        canonical_ndb = row.get("canonical_ndb_no", "")
        app_ingredient_rows.append(
            {
                "recipe_id": row["recipe_id"],
                "recipe_name": row.get("recipe_name", ""),
                "row_order": 0,
                "row_type": "dish",
                "ing_name": "",
                "ing_qty": "custom (g)",
                "sr28_long_desc": lookup.long_desc(canonical_ndb),
                "ndb_no": canonical_ndb,
                "portion_desc": "custom (g)",
                "portion_grams": "100.0",
                "serving_count": "1",
                "notes": "",
                "game_food": "",
                "animal": "",
                "_source_order": "0",
            }
        )

    for row in ingredient_rows:
        recipe_id = row.get("recipe_id", "")
        if recipe_id not in approved_ids:
            continue

        ingredient_key = row.get("ingredient_key", "")
        ledger_key = LEDGER_KEY_ALIASES.get(ingredient_key, ingredient_key)
        ledger = ledger_by_key.get(ledger_key)
        if not ledger:
            raise KeyError(f"Missing ledger row for ingredient_key={ingredient_key}")

        recipe_name = recipe_meta[recipe_id].get("recipe_name", "")
        app_ingredient_rows.append(
            {
                "recipe_id": recipe_id,
                "recipe_name": recipe_name,
                "row_order": row.get("row_order", ""),
                "row_type": "ingredient",
                "ing_name": display_name(
                    ledger.get("default_display_name", ""),
                    row.get("display_name_override", ""),
                ),
                "ing_qty": row.get("qty_display", ""),
                "sr28_long_desc": ledger.get("default_long_desc", ""),
                "ndb_no": ledger.get("ndb_no", ""),
                "portion_desc": "g",
                "portion_grams": format_float(row.get("grams", "0")),
                "serving_count": "1",
                "notes": note_string(row.get("section", ""), parse_bool(row.get("is_optional", ""))),
                "game_food": "",
                "animal": "",
                "_source_order": row.get("row_order", ""),
            }
        )

    for row in instruction_rows:
        recipe_id = row.get("recipe_id", "")
        if recipe_id not in approved_ids:
            continue
        app_instruction_rows.append(
            {
                "recipe_id": recipe_id,
                "recipe_name": recipe_meta[recipe_id].get("recipe_name", ""),
                "step_order": row.get("step_order", ""),
                "step_text": row.get("step_text", ""),
                "_source_order": row.get("step_order", ""),
            }
        )

    lookup.close()

    app_recipe_rows.sort(key=lambda row: row["recipe_id"])

    normalized_ingredient_rows: list[dict[str, object]] = []
    for recipe_id in sorted(approved_ids):
        recipe_rows = [row for row in app_ingredient_rows if row["recipe_id"] == recipe_id]
        dish_rows = [row for row in recipe_rows if row["row_type"] == "dish"]
        ingredient_only_rows = [row for row in recipe_rows if row["row_type"] != "dish"]

        for dish_row in dish_rows:
            dish_row["row_order"] = 0
            dish_row.pop("_source_order", None)
            normalized_ingredient_rows.append(dish_row)

        for index, ingredient_row in enumerate(
            sorted(ingredient_only_rows, key=lambda row: order_key(str(row.get("_source_order", "")))),
            start=1,
        ):
            ingredient_row["row_order"] = index
            ingredient_row.pop("_source_order", None)
            normalized_ingredient_rows.append(ingredient_row)

    normalized_instruction_rows: list[dict[str, object]] = []
    for recipe_id in sorted(approved_ids):
        recipe_rows = [row for row in app_instruction_rows if row["recipe_id"] == recipe_id]
        for index, instruction_row in enumerate(
            sorted(recipe_rows, key=lambda row: order_key(str(row.get("_source_order", "")))),
            start=1,
        ):
            instruction_row["step_order"] = index
            instruction_row.pop("_source_order", None)
            normalized_instruction_rows.append(instruction_row)

    app_ingredient_rows = normalized_ingredient_rows
    app_instruction_rows = normalized_instruction_rows

    write_csv(APP_RECIPES_CSV, app_recipe_rows, APP_RECIPE_FIELDS)
    write_csv(APP_INGREDIENTS_CSV, app_ingredient_rows, APP_INGREDIENT_FIELDS)
    write_csv(APP_INSTRUCTIONS_CSV, app_instruction_rows, APP_INSTRUCTION_FIELDS)

    print(f"Exported {len(app_recipe_rows)} approved recipes to {APP_DATA}")
    print(f"  ingredients rows: {len(app_ingredient_rows)}")
    print(f"  instruction rows: {len(app_instruction_rows)}")


if __name__ == "__main__":
    main()