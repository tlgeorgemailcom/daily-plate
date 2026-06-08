"""Schema-validated CSV + comboo.db loaders.

All CSV files are read once; data is returned as plain dicts/lists for
downstream modules. No globals, no mutation.
"""
from __future__ import annotations

import csv
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from config import COMBOO_DB, DATA_DIR, RECIPES_V3_ROOT

ROOT = RECIPES_V3_ROOT
DATA = DATA_DIR

# 7 macro nutrients (legacy MACROS tuple — preserved for back-compat with audit
# code that reasons only over macros). Names match comboo.db column names exactly.
MACROS = (
    "Energy_KCal",
    "Protein",
    "TotalLipidFat",
    "Carbohydrate",
    "FiberTotalDietary",
    "SugarsTotal",
    "Water",
)

# Full nutrient panel v3 builds for the Balanced Diet game (~60+ nutrients).
# Order matches the historical Turso nutrition_json.per100g key order from
# scripts/upload-dev-recipe.mjs so consumers see no key reordering.
# omega3 and omega6 are DERIVED in build.py (not direct comboo columns).
EXTENDED_NUTRIENTS = (
    "Energy_KCal",
    "Water",
    "Protein",
    "TotalLipidFat",
    "Carbohydrate",
    "FiberTotalDietary",
    "SugarsTotal",
    "Cholesterol",
    "FattyAcids_totalSaturated",
    "FattyAcids_totalMonounsaturated",
    "FattyAcids_totalPolyunsaturated",
    "LinoleicAcid",
    "alphaLinolenicAcid",
    "EPA_20_5n3",
    "DPA_22_5n3",
    "DHA_22_6n3",
    "VitaminA_RAE",
    "Retinol",
    "Carotene_beta",
    "VitaminD",
    "VitaminE_alphaTocopherol",
    "VitaminK_phylloquinone",
    "VitaminC_totalAscorbicAcid",
    "Thiamin",
    "Riboflavin",
    "Niacin",
    "PantothenicAcid",
    "VitaminB6",
    "Folate_total",
    "Folate_food",
    "Folate_DFE",
    "FolicAcid",
    "VitaminB12",
    "Choline_total",
    "Betaine",
    "LuteinZeaxanthin",
    "Lycopene",
    "Calcium_Ca",
    "Iron_Fe",
    "Magnesium_Mg",
    "Phosphorus_P",
    "Potassium_K",
    "Sodium_Na",
    "Zinc_Zn",
    "Copper_Cu",
    "Manganese_Mn",
    "Selenium_Se",
    "Tryptophan",
    "Threonine",
    "Isoleucine",
    "Leucine",
    "Lysine",
    "Methionine",
    "Cystine",
    "Phenylalanine",
    "Tyrosine",
    "Valine",
    "Arginine",
    "Histidine",
    "Alanine",
    "AsparticAcid",
    "GlutamicAcid",
    "Glycine",
    "Proline",
    "Serine",
)

# Derived nutrients computed from EXTENDED_NUTRIENTS in build.py.
DERIVED_NUTRIENTS = ("omega3", "omega6")


@dataclass(frozen=True)
class Recipe:
    recipe_id: str
    recipe_name: str
    food_word: str
    category: str
    canonical_ndb_no: str | None
    servings_label: str
    servings_count: int
    sr_rule: str
    cooking_method: str
    yield_factor_water: float
    yield_factor_fat: float
    yield_factor_protein: float
    yield_factor_carbohydrate: float
    yield_factor_other: float
    status: str
    audit_status: str = ""
    audit_notes: str = ""
    skip_macros: str = ""  # comma-sep USDA nutrient keys to exclude from scoring (defective canonical)


@dataclass(frozen=True)
class LedgerEntry:
    ingredient_key: str
    ndb_no: str
    food_word: str
    default_long_desc: str
    default_display_name: str


@dataclass(frozen=True)
class IngredientRow:
    recipe_id: str
    row_order: str  # e.g. "1", "1b", "12" — sorted naturally
    ingredient_key: str
    qty_display: str
    grams: float
    section: str          # FK → recipe_sections.csv::section_key (cooking math)
    ingredient_group: str  # display-only label shown in UI (may differ from section)
    is_optional: bool
    display_name_override: str | None


@dataclass(frozen=True)
class Section:
    """Per-section cooking override. Phase 8b (see docs/v3.md §18)."""
    recipe_id: str
    section_key: str
    section_label: str
    prep_method: str   # what the cook does — shown in UI (e.g. 'simmered', 'boiled')
    cook_method: str   # dominant heat stage for USDA retention table lookup
    yield_factor_water: float | None  # None = derive from filling_class + cook_stages
    yield_factor_fat: float
    yield_factor_protein: float
    yield_factor_carbohydrate: float
    yield_factor_other: float
    filling_class: str = ""   # e.g. 'dense_fruit' — selects BINDING coefficient in yield_calc
    cook_stages: str = ""     # e.g. '425:15,350:37' — temp_f:minutes pairs, comma-sep
    boil_stages: str = ""     # e.g. '8' — stovetop boil minutes (temp fixed at 212°F)
    source_recipe: str = ""   # Phase 8c: when non-empty, this section's nutrition is sourced
                              # from the named child recipe's already-built per100g panel.
                              # Validator requires matching @<child_id> ingredient row(s) and
                              # yfw=yff=1.0 (no double-applied retention/yield).

    @property
    def cooking_method(self) -> str:
        """Backward-compat alias — returns cook_method."""
        return self.cook_method


def is_component_ref(ingredient_key: str) -> bool:
    """Phase 8c: True if ingredient_key references a child recipe (e.g. '@BKFST_001').

    Component-ref ingredients pull nutrition from the named recipe's cooked
    per-100g panel rather than from a ledger NDB lookup. The grams column is
    the cooked weight of the component contribution per the parent recipe.
    """
    return ingredient_key.startswith("@")


def child_recipe_id(ingredient_key: str) -> str:
    """Strip the '@' prefix from a component-ref key. Returns '' for non-refs."""
    return ingredient_key[1:] if is_component_ref(ingredient_key) else ""


def _parse_float(s: str, default: float = 0.0) -> float:
    s = (s or "").strip()
    if not s:
        return default
    return float(s)


def _parse_float_opt(s: str | None) -> float | None:
    """Return None for blank/missing; float otherwise."""
    s = (s or "").strip()
    return float(s) if s else None


def _parse_int(s: str, default: int = 0) -> int:
    s = (s or "").strip()
    if not s:
        return default
    return int(float(s))


def load_recipes() -> dict[str, Recipe]:
    out: dict[str, Recipe] = {}
    with open(DATA / "recipes.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rid = row["recipe_id"].strip()
            out[rid] = Recipe(
                recipe_id=rid,
                recipe_name=row["recipe_name"].strip(),
                food_word=row.get("food_word", "").strip(),
                category=row.get("category", "").strip(),
                canonical_ndb_no=(row.get("canonical_ndb_no") or "").strip() or None,
                servings_label=row.get("servings_label", "").strip(),
                servings_count=_parse_int(row.get("servings_count", "1"), 1),
                sr_rule=row.get("sr_rule", "").strip(),
                cooking_method=(row.get("cooking_method") or row.get("cook_method") or "raw").strip().lower(),
                yield_factor_water=_parse_float(row.get("yield_factor_water"), 1.0),
                yield_factor_fat=_parse_float(row.get("yield_factor_fat"), 1.0),
                yield_factor_protein=_parse_float(row.get("yield_factor_protein"), 1.0),
                yield_factor_carbohydrate=_parse_float(row.get("yield_factor_carbohydrate"), 1.0),
                yield_factor_other=_parse_float(row.get("yield_factor_other"), 1.0),
                status=row.get("status", "").strip(),
                audit_status=row.get("audit_status", "").strip(),
                audit_notes=row.get("audit_notes", "").strip(),
                skip_macros=row.get("skip_macros", "").strip(),
            )
    return out


def load_ledger() -> dict[str, LedgerEntry]:
    out: dict[str, LedgerEntry] = {}
    with open(DATA / "ingredients_ledger.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            key = row["ingredient_key"].strip()
            out[key] = LedgerEntry(
                ingredient_key=key,
                ndb_no=row["ndb_no"].strip(),
                food_word=row.get("food_word", "").strip(),
                default_long_desc=row.get("default_long_desc", "").strip(),
                default_display_name=row.get("default_display_name", "").strip(),
            )
    return out


def load_ingredients() -> dict[str, list[IngredientRow]]:
    """Return {recipe_id: [rows...]}, rows sorted by row_order (natural)."""
    def sort_key(s: str) -> tuple[int, str]:
        # Natural sort: leading digits as int, trailing letters as suffix
        digits = ""
        rest = ""
        for i, ch in enumerate(s):
            if ch.isdigit():
                digits += ch
            else:
                rest = s[i:]
                break
        return (int(digits) if digits else 0, rest)

    out: dict[str, list[IngredientRow]] = {}
    with open(DATA / "recipe_ingredients.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rid = row["recipe_id"].strip()
            ingr = IngredientRow(
                recipe_id=rid,
                row_order=str(row.get("row_order", "")).strip(),
                ingredient_key=row["ingredient_key"].strip(),
                qty_display=row.get("qty_display", "").strip(),
                grams=_parse_float(row.get("grams"), 0.0),
                section=row.get("section", "main").strip(),
                ingredient_group=(row.get("ingredient_group") or row.get("section") or "").strip(),
                is_optional=row.get("is_optional", "false").strip().lower() == "true",
                display_name_override=(row.get("display_name_override") or "").strip() or None,
            )
            out.setdefault(rid, []).append(ingr)
    for rid in out:
        out[rid].sort(key=lambda r: sort_key(r.row_order))
    return out


def load_sections() -> dict[str, list[Section]]:
    """Return {recipe_id: [Section...]} from recipes_v3/data/recipe_sections.csv.

    Returns empty dict if the file doesn't exist (Phase 8b is opt-in;
    zero rows for a recipe = synthetic-default single-section path).
    """
    path = DATA / "recipe_sections.csv"
    out: dict[str, list[Section]] = {}
    if not path.exists():
        return out
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rid = (row.get("recipe_id") or "").strip()
            if not rid:
                continue
            section_key = (row.get("section_key") or "").strip()
            if not section_key:
                continue
            sec = Section(
                recipe_id=rid,
                section_key=section_key,
                section_label=(row.get("section_label") or "").strip(),
                prep_method=(row.get("prep_method") or row.get("cooking_method") or "raw").strip().lower(),
                cook_method=(row.get("cook_method") or row.get("cooking_method") or "raw").strip().lower(),
                yield_factor_water=_parse_float_opt(row.get("yield_factor_water")),
                yield_factor_fat=_parse_float(row.get("yield_factor_fat"), 1.0),
                yield_factor_protein=_parse_float(row.get("yield_factor_protein"), 1.0),
                yield_factor_carbohydrate=_parse_float(row.get("yield_factor_carbohydrate"), 1.0),
                yield_factor_other=_parse_float(row.get("yield_factor_other"), 1.0),
                filling_class=(row.get("filling_class") or "").strip(),
                cook_stages=(row.get("cook_stages") or "").strip(),
                boil_stages=(row.get("boil_stages") or "").strip(),
                source_recipe=(row.get("source_recipe") or "").strip(),
            )
            out.setdefault(rid, []).append(sec)
    return out


def load_instructions() -> dict[str, list[str]]:
    """Return {recipe_id: [step_text in order]}."""
    out: dict[str, list[str]] = {}
    with open(DATA / "recipe_instructions.csv", newline="", encoding="utf-8") as f:
        # Detect column names — v2 may use 'step_order'/'step_text' or other.
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        order_col = next((c for c in fieldnames if "order" in c.lower() or c.lower() == "row_order"), None)
        text_col = next((c for c in fieldnames if "text" in c.lower() or c.lower() in ("instruction", "step")), None)
        if not order_col or not text_col:
            raise RuntimeError(f"Unrecognized instruction columns: {fieldnames}")
        rows: list[tuple[str, str, str]] = []
        for r in reader:
            rid = r["recipe_id"].strip()
            order = str(r.get(order_col, "")).strip()
            text = r.get(text_col, "").strip()
            rows.append((rid, order, text))
        rows.sort(key=lambda x: (x[0], int(x[1]) if x[1].isdigit() else 0))
        for rid, _, text in rows:
            out.setdefault(rid, []).append(text)
    return out


def load_comboo_nutrients(ndb_nos: Iterable[str]) -> dict[str, dict[str, float]]:
    """Return {ndb_no: {macro_name: value_per_100g}} for the requested NDBs.

    Missing nutrients default to 0.0 (rare; comboo.db is dense for macros).
    """
    ndbs = sorted(set(str(n) for n in ndb_nos if n))
    if not ndbs:
        return {}
    # Build column list: include every EXTENDED nutrient PLUS Long_Desc (used for
    # added-sugar text-heuristic fallback). Wrap names in double quotes since
    # comboo.db uses quoted identifiers.
    conn = sqlite3.connect(str(COMBOO_DB))
    try:
        cur = conn.cursor()
        nutrient_cols = list(EXTENDED_NUTRIENTS)
        quoted = ['"NDB_NO"', '"Long_Desc"', '"bin"', *(f'"{c}"' for c in nutrient_cols)]
        placeholders = ",".join("?" * len(ndbs))
        sql = f"SELECT {', '.join(quoted)} FROM DataCentralCombo WHERE NDB_NO IN ({placeholders})"
        out: dict[str, dict[str, float]] = {}
        for row in cur.execute(sql, ndbs).fetchall():
            ndb = str(row[0])
            long_desc = row[1] or ""
            bin_raw = row[2]
            nuts: dict[str, float] = {}
            for i, m in enumerate(nutrient_cols):
                nuts[m] = float(row[i + 3] or 0.0)
            # Stash Long_Desc under a non-conflicting key for downstream use.
            nuts["_long_desc"] = long_desc  # type: ignore[assignment]
            # Stash bin absorption factor if present and numeric (e.g. '0.6213' for pasta).
            # Non-numeric legacy bin values (e.g. 'fridge', 'raw beans bin') are ignored.
            if bin_raw is not None:
                try:
                    nuts["_absorption_factor"] = float(bin_raw)  # type: ignore[assignment]
                except (ValueError, TypeError):
                    pass
            out[ndb] = nuts
        return out
    finally:
        conn.close()


def load_canonical_per100g(ndb_no: str) -> dict[str, float] | None:
    """Single canonical NDB lookup for Rule A/B audit."""
    if not ndb_no:
        return None
    nuts = load_comboo_nutrients([ndb_no])
    rec = nuts.get(str(ndb_no))
    if rec is None:
        return None
    # Strip the internal _long_desc key so callers receive a pure macro/nutrient dict.
    return {k: v for k, v in rec.items() if not k.startswith("_")}  # type: ignore[misc]
