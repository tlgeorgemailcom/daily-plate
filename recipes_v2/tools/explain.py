#!/usr/bin/env python3
"""Side-by-side comparison: canonical vs built, with per-ingredient
contribution breakdown to estimate which ingredients are driving each gap.

Usage: python3 tools/explain.py SWEET_001
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from lib.build import build_recipe                                # noqa: E402
from lib.canonical import canonical_per100g_from_combo            # noqa: E402
from lib.data import (                                              # noqa: E402
    MACRO_KEYS,
    load_ledger,
    load_recipe_ingredients,
    load_recipes,
)


def fmt(x: float, w: int = 9, p: int = 2) -> str:
    return f"{x:>{w}.{p}f}"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: explain.py RECIPE_ID", file=sys.stderr)
        return 1
    recipe_id = sys.argv[1]

    recipes = load_recipes()
    if recipe_id not in recipes:
        print(f"Unknown recipe_id: {recipe_id}", file=sys.stderr)
        return 2
    meta = recipes[recipe_id]
    ledger = load_ledger()
    ingredients = load_recipe_ingredients(recipe_id)
    canonical = canonical_per100g_from_combo(meta.canonical_ndb_no)
    if canonical is None:
        print(f"No canonical row for NDB {meta.canonical_ndb_no}", file=sys.stderr)
        return 3
    br = build_recipe(meta, ingredients, ledger)

    # ---- Header ----
    print(f"=== {meta.recipe_id}: {meta.recipe_name} (NDB {meta.canonical_ndb_no}) ===")
    print(f"cook_method={meta.cook_method}  yield(h2o,fat,other)="
          f"{meta.yield_factor_water}/{meta.yield_factor_fat}/{meta.yield_factor_other}")
    print(f"raw_grams={br.raw_grams_total:.1f}  cooked_grams={br.cooked_grams_total:.1f}\n")

    # ---- Per-100g side-by-side with required adjustment ----
    print("PER 100G (cooked basis)")
    print(f"{'macro':<8} {'canonical':>10} {'built':>10} {'delta':>10} "
          f"{'delta_pct':>10} {'need_change':>14}")
    print("-" * 70)
    target_pct: dict[str, float] = {}
    for k in MACRO_KEYS:
        c = float(canonical.get(k, 0.0))
        b = float(br.per100g_cooked.get(k, 0.0))
        d = b - c
        if c > 0:
            pct = d / c * 100.0
            need = -pct  # the % change we need to apply to built to hit canonical
            target_pct[k] = need
            change_str = f"{need:+.1f}%"
        else:
            target_pct[k] = 0.0
            change_str = "n/a"
        print(f"{k:<8} {fmt(c)} {fmt(b)} {fmt(d, 10, 3):>10} "
              f"{fmt(pct if c > 0 else 0.0, 9, 2):>9}% {change_str:>14}")
    print()

    # ---- Per-ingredient contribution to each macro ----
    # Show whole-recipe (whole_raw) contribution so the reader can see
    # raw grams of each macro before yield. This is what they would adjust.
    print("PER-INGREDIENT CONTRIBUTION (whole recipe, raw, before yield)")
    cols = ["cal", "pro", "fat", "carb", "h2o", "sug", "sodium"]
    header = f"{'#':>2} {'grams':>7} {'ingredient':<35} " + " ".join(
        f"{c:>9}" for c in cols)
    print(header)
    print("-" * len(header))
    for i, row in enumerate(br.per_ingredient, 1):
        contrib = row["contrib"]
        line = (f"{i:>2} {row['grams']:>7.1f} {row['ingredient_key'][:35]:<35} "
                + " ".join(fmt(contrib[c]) for c in cols))
        print(line)
    print("-" * len(header))
    totals_raw = (f"{'':>2} {br.raw_grams_total:>7.1f} {'TOTAL_RAW':<35} "
                  + " ".join(fmt(br.whole_raw[c]) for c in cols))
    print(totals_raw)
    totals_cooked = (f"{'':>2} {br.cooked_grams_total:>7.1f} {'TOTAL_COOKED (after yield)':<35} "
                     + " ".join(fmt(br.whole_cooked[c]) for c in cols))
    print(totals_cooked)
    canonical_whole = {c: float(canonical.get(c, 0.0)) * br.cooked_grams_total / 100.0
                       for c in cols}
    target_line = (f"{'':>2} {br.cooked_grams_total:>7.1f} {'CANONICAL @ cooked_grams':<35} "
                   + " ".join(fmt(canonical_whole[c]) for c in cols))
    print(target_line)
    print()

    # ---- Per-macro: top ingredient drivers (>=10% of total) ----
    print("TOP DRIVERS PER MACRO (ingredients contributing >=10% of total)")
    for c in cols:
        total = br.whole_raw[c]
        if total < 0.001:
            continue
        rows = sorted(
            ((row["ingredient_key"], row["contrib"][c] / total * 100.0,
              row["contrib"][c], row["grams"])
             for row in br.per_ingredient),
            key=lambda r: -r[1],
        )
        rows = [r for r in rows if r[1] >= 10.0]
        if not rows:
            continue
        need = target_pct.get(c, 0.0)
        direction = "REDUCE" if need < -1 else ("INCREASE" if need > 1 else "OK")
        print(f"\n  {c.upper():<8} need={need:+.1f}%  [{direction}]")
        for key, pct, val, g in rows:
            print(f"    {key:<35} {pct:>5.1f}%  ({val:.2f} from {g:.1f}g)")

    # ---- Suggested gram adjustments ----
    print("\nSUGGESTED ADJUSTMENTS")
    print("(applies the macro's needed % change scaled by each top driver's share)")
    suggestions: dict[str, list[str]] = {}
    for c in cols:
        need = target_pct.get(c, 0.0)
        if abs(need) < 5.0:  # within match band
            continue
        total = br.whole_raw[c]
        if total < 0.001:
            continue
        rows = sorted(
            ((row["ingredient_key"], row["contrib"][c] / total, row["grams"])
             for row in br.per_ingredient),
            key=lambda r: -r[1],
        )
        # take ingredients providing >=20% of this macro
        top = [r for r in rows if r[1] >= 0.20]
        for key, share, g in top:
            # Naive: apply the macro change proportional to this ingredient's share
            # of the macro. Negative need means reduce grams.
            new_g = g * (1.0 + (need / 100.0) * share)
            delta_g = new_g - g
            if abs(delta_g) < 0.5:
                continue
            suggestions.setdefault(key, []).append(
                f"{c}({need:+.1f}% × share {share*100:.0f}%) -> {delta_g:+.1f}g"
            )
    if not suggestions:
        print("  (no macros outside match band; nothing to suggest)")
    else:
        for key, notes in suggestions.items():
            current = sum(r["grams"] for r in br.per_ingredient
                          if r["ingredient_key"] == key)
            print(f"  {key} (current total {current:.1f}g):")
            for n in notes:
                print(f"    {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
