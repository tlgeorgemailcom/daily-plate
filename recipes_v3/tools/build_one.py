"""Build a single recipe and write JSON to output/builds/<id>.json.

Usage:
    python tools/build_one.py SWEET_001
    python tools/build_one.py SWEET_022 --print   # also print summary to stdout
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow running as a script: add parent dir to path so 'lib' resolves
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from lib.build import build_recipe  # noqa: E402
from lib.load import load_ingredients, load_ledger, load_recipes  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "builds"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("recipe_id")
    ap.add_argument("--print", action="store_true", help="Print build summary to stdout")
    args = ap.parse_args()

    recipes = load_recipes()
    ledger = load_ledger()
    ings = load_ingredients()

    if args.recipe_id not in recipes:
        print(f"ERROR: {args.recipe_id} not found in recipes.csv", file=sys.stderr)
        return 1
    if args.recipe_id not in ings:
        print(f"ERROR: no ingredient rows for {args.recipe_id}", file=sys.stderr)
        return 1

    build = build_recipe(recipes[args.recipe_id], ings[args.recipe_id], ledger)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{args.recipe_id}.json"
    out_path.write_text(json.dumps(build, indent=2))
    print(f"Wrote {out_path}")

    if args.print:
        print()
        print(f"=== {build['recipe_id']}  {build['recipe_name']} ===")
        print(f"  rule={build['sr_rule']}  method={build['cooking_method']}→{build['cooking_method_normalized']}")
        print(f"  yfW={build['yield_factor_water']}  yfF={build['yield_factor_fat']}")
        print(f"  raw={build['raw_total_grams']}g  cooked={build['cooked_total_grams']}g  servings={build['servings_count']}  gps={build['grams_per_serving']}g")
        print(f"  water_lost={build['water_lost_grams']}g  fat_lost={build['fat_lost_grams']}g")
        print(f"  skipped={len(build['skipped_ingredients'])}")
        print(f"  per100g:")
        for k, v in build["per100g"].items():
            print(f"    {k:22s} {v:>8.2f}")
        print(f"  per_serving:")
        for k, v in build["per_serving"].items():
            print(f"    {k:22s} {v:>8.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
