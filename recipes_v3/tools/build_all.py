"""Build every recipe in recipes.csv and write JSON to output/builds/.

Usage:
    python tools/build_all.py
    python tools/build_all.py --quiet     # suppress per-recipe lines
"""
from __future__ import annotations

import argparse
import json
import sys
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from lib.build import build_recipe  # noqa: E402
from lib.load import (  # noqa: E402
    load_comboo_nutrients,
    load_ingredients,
    load_ledger,
    load_recipes,
    load_sections,
)

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "builds"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    recipes = load_recipes()
    ledger = load_ledger()
    ings = load_ingredients()
    sections_by_recipe = load_sections()

    # Pre-fetch all NDBs once
    all_ndbs = {entry.ndb_no for entry in ledger.values()}
    nutrients = load_comboo_nutrients(all_ndbs)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Phase 8c: topological order — recipes that reference @<child> in their ingredient
    # rows must be built after the children. Kahn's algorithm; ties broken alphabetically
    # so the output ordering stays deterministic.
    deps: dict[str, set[str]] = {rid: set() for rid in recipes}
    for rid, rows in ings.items():
        if rid not in deps:
            continue
        for r in rows:
            ik = r.ingredient_key
            if ik.startswith("@"):
                child = ik[1:]
                if child in deps:
                    deps[rid].add(child)
    indeg: dict[str, int] = {rid: len(deps[rid]) for rid in deps}
    ready = sorted([rid for rid, d in indeg.items() if d == 0])
    order: list[str] = []
    while ready:
        rid = ready.pop(0)
        order.append(rid)
        for parent in sorted(deps):
            if rid in deps[parent]:
                deps[parent].discard(rid)
                indeg[parent] -= 1
                if indeg[parent] == 0:
                    ready.append(parent)
                    ready.sort()
    if len(order) != len(recipes):
        missing = sorted(set(recipes) - set(order))
        print(f"ERROR: composite cycle prevents build of {missing}", file=sys.stderr)
        return 1

    ok, failed = 0, 0
    failures: list[tuple[str, str]] = []
    for rid in order:
        try:
            if rid not in ings:
                raise RuntimeError("no ingredient rows")
            build = build_recipe(recipes[rid], ings[rid], ledger, nutrients, sections=sections_by_recipe.get(rid))
            (OUT_DIR / f"{rid}.json").write_text(json.dumps(build, indent=2))
            if not args.quiet:
                p = build["per100g"]
                print(f"  {rid}  {build['recipe_name'][:34]:34s}  "
                      f"kcal={p['Energy_KCal']:6.1f}  "
                      f"gps={build['grams_per_serving']:6.1f}  "
                      f"yfW={build['yield_factor_water']:.2f}  skipped={len(build['skipped_ingredients'])}")
            ok += 1
        except Exception as e:
            failed += 1
            failures.append((rid, str(e)))
            print(f"  {rid}  FAILED: {e}", file=sys.stderr)
            if not args.quiet:
                traceback.print_exc()

    print()
    print(f"BUILT: {ok}/{len(recipes)}  FAILED: {failed}")
    if failures:
        print("Failures:")
        for rid, msg in failures:
            print(f"  {rid}: {msg}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
