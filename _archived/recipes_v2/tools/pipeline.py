#!/usr/bin/env python3
"""Recipes v2 pipeline orchestrator.

Usage:
    python3 tools/pipeline.py SWEET_001                    # build + delta report
    python3 tools/pipeline.py SWEET_001 --solve            # also optimize grams
    python3 tools/pipeline.py SWEET_001 --suggest          # suggest candidate ingredients
    python3 tools/pipeline.py SWEET_001 --to-status built  # transition status
    python3 tools/pipeline.py SWEET_001 --snapshot         # write snapshot
    python3 tools/pipeline.py SWEET_001 --test-snapshot    # verify against snapshot
    python3 tools/pipeline.py SWEET_001 --probe            # probe vs food-portions
    python3 tools/pipeline.py SWEET_001 --compare-v1       # probe vs v1 recipes_dev.db
    python3 tools/pipeline.py SWEET_001 --force            # bypass state machine gates

Run from /Volumes/training/Daily Food Chain/daily-food-chain/recipes_v2/.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Make the v2 root importable
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from lib.build import build_recipe                       # noqa: E402
from lib.canonical import (                              # noqa: E402
    canonical_per100g_from_combo,
    canonical_per100g_from_food_portion,
    canonical_serving_grams,
)
from lib.data import (                                    # noqa: E402
    load_ledger,
    load_recipe_ingredients,
    load_recipe_instructions,
    load_recipes,
    save_recipe_ingredients,
    save_recipes,
)
from lib.delta import format_delta_table, write_delta_report   # noqa: E402
from lib.fingerprint import compute_fingerprint, verify_fingerprint  # noqa: E402
from lib.probe import (                                   # noqa: E402
    compare_to_food_portions,
    compare_to_v1_recipes_dev,
    format_probe_table,
)
from lib.snapshot import test_against_snapshot, write_snapshot  # noqa: E402
from lib.state import transition                          # noqa: E402


def cmd(recipe_id: str, args: argparse.Namespace) -> int:
    recipes = load_recipes()
    if recipe_id not in recipes:
        print(f"ERROR: recipe_id {recipe_id!r} not in data/recipes.csv", file=sys.stderr)
        return 2
    meta = recipes[recipe_id]
    ledger = load_ledger()
    ingredients = load_recipe_ingredients(recipe_id)
    instructions = load_recipe_instructions(recipe_id)

    print(f"=== {meta.recipe_id}: {meta.recipe_name} ===")
    print(f"canonical NDB: {meta.canonical_ndb_no}   food_word: {meta.food_word}")
    print(f"cook_method: {meta.cook_method}   yield(h2o,fat,other): "
          f"{meta.yield_factor_water}/{meta.yield_factor_fat}/{meta.yield_factor_other}")
    print(f"status: {meta.status}   fingerprint: "
          f"{meta.fingerprint[:12] + '...' if meta.fingerprint else '(none)'}")
    print(f"ingredients: {len(ingredients)}   instructions: {len(instructions)}")

    # --- canonical -----------------------------------------------------------
    is_rule3 = (meta.sr_rule or "").strip() == "Rule 3"
    if is_rule3:
        canonical_per100g = None
        canonical_source = "none (Rule 3 — no canonical NDB)"
        serving_grams = None
        print(f"Rule 3: no canonical target — nutrients are ingredient-derived only")
    else:
        canonical_combo = canonical_per100g_from_combo(meta.canonical_ndb_no)
        canonical_portion = canonical_per100g_from_food_portion(meta.food_word)
        if canonical_combo is None and canonical_portion is None:
            print("ERROR: no canonical row found (combo or food-portions)", file=sys.stderr)
            return 3
        canonical_per100g = canonical_combo or canonical_portion
        canonical_source = "DataCentralCombo" if canonical_combo else "food-portions-complete.csv"
        serving_grams = canonical_serving_grams(meta.food_word)
        print(f"canonical_source: {canonical_source}   canonical_serving_grams: {serving_grams}")

    # --- build ---------------------------------------------------------------
    build_result = build_recipe(meta, ingredients, ledger)
    if build_result.missing_ndb:
        print(f"WARNING: missing NDB lookups: {build_result.missing_ndb}")
    print(f"raw_grams_total={build_result.raw_grams_total:.2f}  "
          f"cooked_grams_total={build_result.cooked_grams_total:.2f}")

    # --- delta report --------------------------------------------------------
    if not is_rule3:
        delta_path = write_delta_report(
            recipe_id=meta.recipe_id,
            canonical_per100g=canonical_per100g,
            built_per100g=build_result.per100g_cooked,
            canonical_source=canonical_source,
            extra={
                "raw_grams_total": round(build_result.raw_grams_total, 2),
                "cooked_grams_total": round(build_result.cooked_grams_total, 2),
                "cook_method": meta.cook_method,
            },
        )
        print(f"\nDelta report: {delta_path}")
        from lib.delta import compute_delta
        print(format_delta_table(compute_delta(canonical_per100g, build_result.per100g_cooked)))
    else:
        print(f"\nBuilt nutrients per 100g (ingredient-derived):")
        n = build_result.per100g_cooked
        def _fmt(v, fmt='.3f'): return format(v, fmt) if isinstance(v, (int, float)) else str(v)
        print(f"  cal={_fmt(n.get('cal','?'),'.1f')}  pro={_fmt(n.get('pro','?'))}  "
              f"fat={_fmt(n.get('fat','?'))}  carb={_fmt(n.get('carb','?'))}  "
              f"fib={_fmt(n.get('fib','?'))}  h2o={_fmt(n.get('h2o','?'))}  "
              f"sug={_fmt(n.get('sug','?'))}  sodium={_fmt(n.get('sodium','?'))}")

    # --- fingerprint ---------------------------------------------------------
    new_fp = compute_fingerprint(meta, ingredients, instructions)
    if new_fp != meta.fingerprint:
        print(f"\nFingerprint updated: {meta.fingerprint[:12] or '(none)'}... -> {new_fp[:12]}...")
        if meta.status == "approved" and meta.fingerprint and not args.force:
            print("ERROR: recipe is APPROVED but fingerprint changed. "
                  "Use --force to overwrite.", file=sys.stderr)
            return 4
        meta.fingerprint = new_fp
        save_recipes(recipes)

    # --- solver --------------------------------------------------------------
    if args.solve:
        if is_rule3:
            print("\nRule 3: --solve skipped (no canonical target)")
        else:
            from lib.solver import solve_grams
            print("\n--- Solver ---")
            try:
                optimized, diag = solve_grams(meta, ingredients, ledger, canonical_per100g)
            except RuntimeError as e:
                print(f"SOLVER UNAVAILABLE: {e}", file=sys.stderr)
            else:
                print(f"converged={diag['converged']}  iterations={diag['iterations']}")
                print(f"objective: {diag['initial_objective']:.4f} -> {diag['final_objective']:.4f}")
                for old, new in zip(ingredients, optimized):
                    if abs(old.grams - new.grams) > 0.5:
                        print(f"  {old.ingredient_key}: {old.grams:.2f} -> {new.grams:.2f}g")
                if args.write_solver:
                    save_recipe_ingredients(recipe_id, optimized)
                    build_after = build_recipe(meta, optimized, ledger)
                    write_delta_report(
                        recipe_id, canonical_per100g, build_after.per100g_cooked,
                        canonical_source, extra={"post_solver": True},
                    )
                    meta.fingerprint = compute_fingerprint(meta, optimized, instructions)
                    save_recipes(recipes)
                    print("Solver output written. Delta and fingerprint refreshed.")
                else:
                    print("(re-run with --write-solver to persist)")

    # --- suggest -------------------------------------------------------------
    if args.suggest:
        if is_rule3:
            print("\nRule 3: --suggest skipped (no canonical target)")
        else:
            from lib.suggest import format_suggestions_table, suggest_ingredients
            print("\n--- Candidate ingredients (top 15) ---")
            sugg = suggest_ingredients(canonical_per100g, top_n=15)
            print(format_suggestions_table(sugg))

    # --- snapshot ------------------------------------------------------------
    if args.snapshot:
        sp = write_snapshot(meta, ingredients, instructions, build_result,
                            canonical_per100g if not is_rule3 else {})
        print(f"\nSnapshot written: {sp}")

    if args.test_snapshot:
        ok, diffs = test_against_snapshot(meta, ingredients, instructions, build_result)
        print(f"\nSnapshot test: {'PASS' if ok else 'FAIL'}")
        for d in diffs:
            print(f"  {d}")

    # --- probes --------------------------------------------------------------
    if args.probe:
        if is_rule3:
            print("\nRule 3: --probe skipped (no canonical target)")
        else:
            print("\n--- Probe vs food-portions-complete.csv ---")
            probe = compare_to_food_portions(meta, build_result.per100g_cooked)
            print(format_probe_table(probe))

    if args.compare_v1:
        print("\n--- Compare vs v1 recipes_dev.db ---")
        cmp = compare_to_v1_recipes_dev(meta.recipe_id, build_result.per100g_cooked)
        print(format_probe_table(cmp))

    # --- state transition ----------------------------------------------------
    if args.to_status:
        ok, reason = transition(meta, args.to_status, force=args.force)
        if ok:
            save_recipes(recipes)
            print(f"\nStatus: -> {meta.status}  ({reason})")
        else:
            print(f"\nTransition refused: {reason}", file=sys.stderr)
            return 5

    # --- fingerprint verification at end -------------------------------------
    matches, current = verify_fingerprint(meta, ingredients, instructions)
    if not matches:
        print(f"\nNOTE: stored fingerprint differs from current ({current[:12]}...)")

    return 0


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("recipe_id")
    p.add_argument("--solve", action="store_true", help="run gram solver (requires scipy)")
    p.add_argument("--write-solver", action="store_true", help="persist solver output")
    p.add_argument("--suggest", action="store_true", help="suggest candidate ingredients")
    p.add_argument("--snapshot", action="store_true", help="write regression snapshot")
    p.add_argument("--test-snapshot", action="store_true", help="verify against snapshot")
    p.add_argument("--probe", action="store_true", help="probe vs food-portions-complete.csv")
    p.add_argument("--compare-v1", action="store_true", help="compare vs v1 recipes_dev.db")
    p.add_argument("--to-status", choices=["draft", "built", "reviewed", "approved", "published"],
                   help="transition to status")
    p.add_argument("--force", action="store_true", help="bypass state machine gates and fingerprint lock")
    args = p.parse_args()
    return cmd(args.recipe_id, args)


if __name__ == "__main__":
    sys.exit(main())
