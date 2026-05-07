"""Data access for recipes v2.

Loads CSVs and queries the SR Legacy DataCentralCombo SQLite table.
No side effects on import.
"""
from __future__ import annotations

import csv
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# Repo paths
V2_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = V2_ROOT / "data"
DELTAS_DIR = V2_ROOT / "deltas"
SNAPSHOTS_DIR = V2_ROOT / "snapshots"

# External canonical sources
DAILY_FOOD_CHAIN = V2_ROOT.parent
COMBOO_DB = Path("/Users/macminidata/vscode/jetfooddata/jetcool/assets/comboo.db")
FOOD_PORTIONS_CSV = DAILY_FOOD_CHAIN / "food-portions-complete.csv"
V1_RECIPES_DEV_DB = DAILY_FOOD_CHAIN / "recipes_dev.db"

# Canonical macro keys used everywhere downstream
MACRO_KEYS = ["cal", "pro", "fat", "carb", "fib", "h2o", "sug", "sodium"]

# DataCentralCombo column -> macro key
COMBO_TO_MACRO = {
    "Energy_KCal": "cal",
    "Protein": "pro",
    "TotalLipidFat": "fat",
    "Carbohydrate": "carb",
    "FiberTotalDietary": "fib",
    "Water": "h2o",
    "SugarsTotal": "sug",
    "Sodium_Na": "sodium",
}

# food-portions-complete.csv per-100g columns -> macro key
PORTION_TO_MACRO = {
    "cal_100g": "cal",
    "pro_100g": "pro",
    "fat_100g": "fat",
    "carb_100g": "carb",
    "fib_100g": "fib",
    "h2o_100g": "h2o",
    "sug_100g": "sug",
}


@dataclass
class RecipeMeta:
    recipe_id: str
    food_word: str
    recipe_name: str
    category: str
    dietary_category: str
    canonical_ndb_no: str
    prep_time: str
    servings_label: str
    servings_count: int
    sr_rule: str
    cook_method: str
    yield_factor_water: float
    yield_factor_fat: float
    yield_factor_other: float
    status: str
    fingerprint: str
    sr_notes: str
    disclosure: str


@dataclass
class LedgerEntry:
    ingredient_key: str
    ndb_no: str
    default_long_desc: str
    default_display_name: str
    common_unit: str
    common_unit_grams: float
    notes: str


@dataclass
class RecipeIngredient:
    recipe_id: str
    row_order: int
    ingredient_key: str
    qty_display: str
    grams: float
    grams_min: float
    grams_max: float
    section: str
    is_optional: bool
    display_name_override: str


def _to_float(v: str, default: float = 0.0) -> float:
    try:
        s = (v or "").strip()
        return float(s) if s else default
    except (TypeError, ValueError):
        return default


def _to_int(v: str, default: int = 0) -> int:
    try:
        s = (v or "").strip()
        return int(float(s)) if s else default
    except (TypeError, ValueError):
        return default


def _to_bool(v: str) -> bool:
    return (v or "").strip().lower() in {"1", "true", "yes", "y"}


def load_recipes() -> dict[str, RecipeMeta]:
    out: dict[str, RecipeMeta] = {}
    with (DATA_DIR / "recipes.csv").open(newline="") as f:
        for row in csv.DictReader(f):
            rid = row["recipe_id"].strip()
            if not rid:
                continue
            out[rid] = RecipeMeta(
                recipe_id=rid,
                food_word=row.get("food_word", "").strip(),
                recipe_name=row.get("recipe_name", "").strip(),
                category=row.get("category", "").strip(),
                dietary_category=row.get("dietary_category", "").strip(),
                canonical_ndb_no=row.get("canonical_ndb_no", "").strip(),
                prep_time=row.get("prep_time", "").strip(),
                servings_label=row.get("servings_label", "").strip(),
                servings_count=_to_int(row.get("servings_count"), 1),
                sr_rule=row.get("sr_rule", "").strip(),
                cook_method=row.get("cook_method", "raw").strip() or "raw",
                yield_factor_water=_to_float(row.get("yield_factor_water"), 1.0),
                yield_factor_fat=_to_float(row.get("yield_factor_fat"), 1.0),
                yield_factor_other=_to_float(row.get("yield_factor_other"), 1.0),
                status=row.get("status", "draft").strip() or "draft",
                fingerprint=row.get("fingerprint", "").strip(),
                sr_notes=row.get("sr_notes", "").strip(),
                disclosure=row.get("disclosure", "").strip(),
            )
    return out


def save_recipes(recipes: dict[str, RecipeMeta]) -> None:
    fieldnames = [
        "recipe_id", "food_word", "recipe_name", "category", "dietary_category",
        "canonical_ndb_no", "prep_time", "servings_label", "servings_count",
        "sr_rule", "cook_method", "yield_factor_water", "yield_factor_fat",
        "yield_factor_other", "status", "fingerprint", "sr_notes", "disclosure",
    ]
    with (DATA_DIR / "recipes.csv").open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in recipes.values():
            w.writerow({
                "recipe_id": r.recipe_id,
                "food_word": r.food_word,
                "recipe_name": r.recipe_name,
                "category": r.category,
                "dietary_category": r.dietary_category,
                "canonical_ndb_no": r.canonical_ndb_no,
                "prep_time": r.prep_time,
                "servings_label": r.servings_label,
                "servings_count": r.servings_count,
                "sr_rule": r.sr_rule,
                "cook_method": r.cook_method,
                "yield_factor_water": f"{r.yield_factor_water:.2f}",
                "yield_factor_fat": f"{r.yield_factor_fat:.2f}",
                "yield_factor_other": f"{r.yield_factor_other:.2f}",
                "status": r.status,
                "fingerprint": r.fingerprint,
                "sr_notes": r.sr_notes,
                "disclosure": r.disclosure,
            })


def load_ledger() -> dict[str, LedgerEntry]:
    out: dict[str, LedgerEntry] = {}
    with (DATA_DIR / "ingredients_ledger.csv").open(newline="") as f:
        for row in csv.DictReader(f):
            key = row["ingredient_key"].strip()
            if not key:
                continue
            out[key] = LedgerEntry(
                ingredient_key=key,
                ndb_no=row.get("ndb_no", "").strip(),
                default_long_desc=row.get("default_long_desc", "").strip(),
                default_display_name=row.get("default_display_name", "").strip(),
                common_unit=row.get("common_unit", "").strip(),
                common_unit_grams=_to_float(row.get("common_unit_grams")),
                notes=row.get("notes", "").strip(),
            )
    return out


def load_recipe_ingredients(recipe_id: str) -> list[RecipeIngredient]:
    out: list[RecipeIngredient] = []
    with (DATA_DIR / "recipe_ingredients.csv").open(newline="") as f:
        for row in csv.DictReader(f):
            if row["recipe_id"].strip() != recipe_id:
                continue
            out.append(RecipeIngredient(
                recipe_id=recipe_id,
                row_order=_to_int(row.get("row_order")),
                ingredient_key=row.get("ingredient_key", "").strip(),
                qty_display=row.get("qty_display", "").strip(),
                grams=_to_float(row.get("grams")),
                grams_min=_to_float(row.get("grams_min")),
                grams_max=_to_float(row.get("grams_max")),
                section=row.get("section", "").strip(),
                is_optional=_to_bool(row.get("is_optional")),
                display_name_override=row.get("display_name_override", "").strip(),
            ))
    out.sort(key=lambda r: r.row_order)
    return out


def save_recipe_ingredients(recipe_id: str, rows: list[RecipeIngredient]) -> None:
    """Replace all rows for one recipe; preserves rows for other recipes."""
    path = DATA_DIR / "recipe_ingredients.csv"
    with path.open(newline="") as f:
        existing = list(csv.DictReader(f))
        fieldnames = list(csv.DictReader(open(path)).fieldnames or [])
    kept = [r for r in existing if r.get("recipe_id", "").strip() != recipe_id]
    new_dicts = [{
        "recipe_id": ri.recipe_id,
        "row_order": ri.row_order,
        "ingredient_key": ri.ingredient_key,
        "qty_display": ri.qty_display,
        "grams": f"{ri.grams:.2f}",
        "grams_min": f"{ri.grams_min:.2f}",
        "grams_max": f"{ri.grams_max:.2f}",
        "section": ri.section,
        "is_optional": "true" if ri.is_optional else "false",
        "display_name_override": ri.display_name_override,
    } for ri in rows]
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in kept + new_dicts:
            w.writerow(r)


def load_recipe_instructions(recipe_id: str) -> list[str]:
    out: list[tuple[int, str]] = []
    with (DATA_DIR / "recipe_instructions.csv").open(newline="") as f:
        for row in csv.DictReader(f):
            if row["recipe_id"].strip() != recipe_id:
                continue
            out.append((_to_int(row.get("step_order")), row.get("step_text", "")))
    out.sort(key=lambda x: x[0])
    return [text for _, text in out]


def query_combo(ndb_no: str) -> Optional[dict]:
    """Return per-100g nutrient row from DataCentralCombo for given NDB_NO."""
    cols = list(COMBO_TO_MACRO.keys()) + ["Long_Desc"]
    sql = f"SELECT {', '.join(cols)} FROM DataCentralCombo WHERE NDB_NO = ? LIMIT 1"
    with sqlite3.connect(str(COMBOO_DB)) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.execute(sql, (str(ndb_no),))
        row = cur.fetchone()
    if not row:
        return None
    return {k: row[k] for k in cols}


def query_food_portion(food_word: str) -> Optional[dict]:
    with FOOD_PORTIONS_CSV.open(newline="") as f:
        for row in csv.DictReader(f):
            if row["word"].strip() == food_word:
                return row
    return None
