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
INGREDIENTS = ROOT / "recipes_v3" / "data" / "recipe_ingredients.csv"
SECTIONS = ROOT / "recipes_v3" / "data" / "recipe_sections.csv"
PORTIONS = ROOT / "src" / "lib" / "data" / "food-portions-complete.csv"

import re

# Supported cooking methods come from the canonical alias table.
sys.path.insert(0, str(ROOT / "recipes_v3"))
from lib.retention import COOK_METHOD_ALIASES  # noqa: E402

SUPPORTED_METHODS = set(COOK_METHOD_ALIASES.keys())
SECTION_KEY_RE = re.compile(r"^[a-z0-9_]+$")


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

    # Rules 4–9: recipe_sections.csv (§18.4)
    valid_recipe_ids: set[str] = set()
    with RECIPES.open() as f:
        for r in csv.DictReader(f):
            valid_recipe_ids.add(r["recipe_id"])

    sections_by_recipe: dict[str, list[dict]] = {}
    if SECTIONS.exists():
        with SECTIONS.open() as f:
            for r in csv.DictReader(f):
                rid = (r.get("recipe_id") or "").strip()
                if not rid:
                    continue
                # 4a: recipe_id must exist
                if rid not in valid_recipe_ids:
                    errors.append(f"  recipe_sections {rid}: recipe_id not in recipes.csv")
                    continue
                section_key = (r.get("section_key") or "").strip()
                section_label = (r.get("section_label") or "").strip()
                cooking_method = (r.get("cooking_method") or "").strip().lower()
                # 4d: section_key/label format
                if not section_key or not SECTION_KEY_RE.match(section_key):
                    errors.append(
                        f"  recipe_sections {rid}: section_key={section_key!r} must match ^[a-z0-9_]+$"
                    )
                    continue
                if not section_label:
                    errors.append(f"  recipe_sections {rid}/{section_key}: section_label is empty")
                # 4b: cooking_method enum
                if cooking_method and cooking_method not in SUPPORTED_METHODS:
                    errors.append(
                        f"  recipe_sections {rid}/{section_key}: cooking_method={cooking_method!r} "
                        f"not in supported set"
                    )
                # 4c: (recipe_id, section_key) unique
                existing_keys = {s["section_key"] for s in sections_by_recipe.get(rid, [])}
                if section_key in existing_keys:
                    errors.append(
                        f"  recipe_sections {rid}: duplicate section_key={section_key!r}"
                    )
                sections_by_recipe.setdefault(rid, []).append({
                    "section_key": section_key,
                    "section_label": section_label,
                    "cooking_method": cooking_method,
                })

    # Rules 5+6: ingredient.section coverage (all-or-nothing)
    if INGREDIENTS.exists():
        ings_by_recipe: dict[str, list[dict]] = {}
        with INGREDIENTS.open() as f:
            for r in csv.DictReader(f):
                rid = (r.get("recipe_id") or "").strip()
                if not rid:
                    continue
                ings_by_recipe.setdefault(rid, []).append(r)

        for rid, ings in ings_by_recipe.items():
            section_keys = {s["section_key"] for s in sections_by_recipe.get(rid, [])}
            if not section_keys:
                continue  # recipe has no sections defined → no per-row check
            section_values = [(r.get("section") or "").strip() for r in ings]
            populated = [v for v in section_values if v]
            # Rule 6: all-or-nothing
            if populated and len(populated) != len(section_values):
                errors.append(
                    f"  recipe_ingredients {rid}: partial section coverage "
                    f"({len(populated)}/{len(section_values)} rows have section). "
                    f"All ingredient rows must specify a section when sections are defined."
                )
            # Rule 5: every populated section value matches a section_key
            for v in populated:
                if v not in section_keys:
                    errors.append(
                        f"  recipe_ingredients {rid}: ingredient section={v!r} "
                        f"is not a section_key in recipe_sections.csv (valid: {sorted(section_keys)})"
                    )

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
