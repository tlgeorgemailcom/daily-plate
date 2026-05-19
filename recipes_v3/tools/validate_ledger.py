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
    recipe_status: dict[str, str] = {}
    with RECIPES.open() as f:
        for r in csv.DictReader(f):
            valid_recipe_ids.add(r["recipe_id"])
            recipe_status[r["recipe_id"]] = (r.get("status") or "").strip()

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
                    "cook_method": (r.get("cook_method") or "").strip().lower(),
                    "source_recipe": (r.get("source_recipe") or "").strip(),
                    "yield_factor_water": (r.get("yield_factor_water") or "").strip(),
                    "yield_factor_fat": (r.get("yield_factor_fat") or "").strip(),
                    "yield_factor_other": (r.get("yield_factor_other") or "").strip(),
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

        # Rules 10–14: Phase 8c component-ref ingredients (@<child_id>)
        # Build the dependency graph first so we can run cycle detection.
        dep_graph: dict[str, set[str]] = {}
        for rid, ings in ings_by_recipe.items():
            for r in ings:
                ik = (r.get("ingredient_key") or "").strip()
                if not ik.startswith("@"):
                    continue
                child = ik[1:]
                # 10: child must be a known recipe
                if child not in valid_recipe_ids:
                    errors.append(
                        f"  recipe_ingredients {rid}: component-ref @{child} "
                        f"does not match any recipe_id"
                    )
                    continue
                # 11: no self-reference
                if child == rid:
                    errors.append(
                        f"  recipe_ingredients {rid}: component-ref @{child} is a self-reference"
                    )
                    continue
                # 12: child must be approved (composites build only from approved children)
                cstatus = recipe_status.get(child, "")
                if cstatus != "approved":
                    errors.append(
                        f"  recipe_ingredients {rid}: component-ref @{child} status="
                        f"{cstatus!r} (must be 'approved')"
                    )
                dep_graph.setdefault(rid, set()).add(child)

        # 13: no circular references (DFS)
        WHITE, GRAY, BLACK = 0, 1, 2
        color: dict[str, int] = {n: WHITE for n in dep_graph}
        def _dfs(n: str, path: list[str]) -> bool:
            color[n] = GRAY
            for child in dep_graph.get(n, ()):
                if color.get(child, WHITE) == GRAY:
                    cycle = " → ".join(path + [n, child])
                    errors.append(f"  recipe_ingredients: composite cycle detected: {cycle}")
                    return True
                if color.get(child, WHITE) == WHITE and _dfs(child, path + [n]):
                    return True
            color[n] = BLACK
            return False
        for node in list(dep_graph):
            if color.get(node, WHITE) == WHITE:
                _dfs(node, [])

        # 14: section that hosts component-ref rows must be yfw=yff=yfo=1.0 + cook_method=raw,
        #     and its source_recipe (if set) must equal the @-ref child id.
        for rid, ings in ings_by_recipe.items():
            comp_rows = [r for r in ings if (r.get("ingredient_key") or "").startswith("@")]
            if not comp_rows:
                continue
            sec_index = {s["section_key"]: s for s in sections_by_recipe.get(rid, [])}
            for r in comp_rows:
                sec_key = (r.get("section") or "").strip()
                if not sec_key or sec_key not in sec_index:
                    errors.append(
                        f"  recipe_ingredients {rid}: component-ref {r.get('ingredient_key')} "
                        f"requires a matching recipe_sections row (section={sec_key!r})"
                    )
                    continue
                s = sec_index[sec_key]
                child = (r.get("ingredient_key") or "")[1:]
                if s.get("cook_method") and s["cook_method"] != "raw":
                    errors.append(
                        f"  recipe_sections {rid}/{sec_key}: hosts component-ref @{child} "
                        f"so cook_method must be 'raw' (got {s['cook_method']!r})"
                    )
                for fld in ("yield_factor_water", "yield_factor_fat", "yield_factor_other"):
                    v = s.get(fld, "")
                    if v not in ("", "1", "1.0", "1.00"):
                        try:
                            if abs(float(v) - 1.0) > 1e-9:
                                errors.append(
                                    f"  recipe_sections {rid}/{sec_key}: hosts component-ref "
                                    f"@{child} so {fld} must be 1.0 (got {v!r})"
                                )
                        except ValueError:
                            errors.append(
                                f"  recipe_sections {rid}/{sec_key}: {fld}={v!r} not numeric"
                            )
                src = s.get("source_recipe", "")
                if src and src != child:
                    errors.append(
                        f"  recipe_sections {rid}/{sec_key}: source_recipe={src!r} but "
                        f"component-ref row points at @{child}"
                    )

        for rid, ings in ings_by_recipe.items():
            section_keys = {s["section_key"] for s in sections_by_recipe.get(rid, [])}
            section_values = [(r.get("section") or "").strip() for r in ings]
            populated = [v for v in section_values if v]
            if not section_keys:
                # Rule 6b: ingredient rows reference section values but recipe has
                # no recipe_sections rows declared.
                if populated:
                    refd = sorted(set(populated))
                    errors.append(
                        f"  recipe_ingredients {rid}: ingredients reference section(s) "
                        f"{refd} but no matching rows exist in recipe_sections.csv"
                    )
                continue  # recipe has no sections defined → skip per-row checks
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
