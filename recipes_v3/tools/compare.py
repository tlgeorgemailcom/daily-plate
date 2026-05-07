"""Compare v3 builds vs Turso baseline. Read-only — writes JSON + summary table.

Usage:
    python tools/compare.py
    python tools/compare.py --recipe SWEET_001
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILDS_DIR = ROOT / "output" / "builds"
COMPARE_DIR = ROOT / "output" / "compare"
BASELINE_PATH = ROOT / "baselines" / "turso_locked2_baseline.json"

MACROS = (
    "Energy_KCal", "Protein", "TotalLipidFat", "Carbohydrate",
    "FiberTotalDietary", "SugarsTotal", "Water",
)
TOLERANCE_PCT = 0.5  # Phase 3 acceptance: ±0.5% per macro


def pct_delta(v3: float, turso: float) -> float:
    if turso == 0:
        return 0.0 if v3 == 0 else float("inf")
    return (v3 - turso) / turso * 100.0


def compare_one(rid: str, baseline: dict) -> dict | None:
    build_path = BUILDS_DIR / f"{rid}.json"
    if not build_path.exists():
        return None
    build = json.loads(build_path.read_text())
    base = baseline[rid]
    v3_p100 = build["per100g"]
    t_p100 = base["per100g"]

    deltas = {m: round(pct_delta(v3_p100[m], t_p100[m]), 2) for m in MACROS}
    violations = [m for m, d in deltas.items() if abs(d) > TOLERANCE_PCT]
    return {
        "recipe_id": rid,
        "recipe_name": build["recipe_name"],
        "sr_rule": build["sr_rule"],
        "v3_yield_factor_water": build["yield_factor_water"],
        "turso_yield_factor_water": base.get("yieldFactorWater"),
        "v3_grams_per_serving": build["grams_per_serving"],
        "turso_grams_per_serving": base.get("grams_per_serving"),
        "v3_per100g": v3_p100,
        "turso_per100g": t_p100,
        "deltas_pct": deltas,
        "tolerance_pct": TOLERANCE_PCT,
        "status": "MATCH" if not violations else "MISMATCH",
        "violations": violations,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--recipe", help="Compare a single recipe")
    args = ap.parse_args()

    if not BASELINE_PATH.exists():
        print(f"ERROR: missing {BASELINE_PATH}", file=sys.stderr)
        return 1
    baseline = json.loads(BASELINE_PATH.read_text())
    COMPARE_DIR.mkdir(parents=True, exist_ok=True)

    targets = [args.recipe] if args.recipe else sorted(baseline.keys())

    matches, mismatches, skipped = 0, 0, 0
    summary_rows: list[tuple[str, str, str, dict, float | None, float | None]] = []
    for rid in targets:
        if rid not in baseline:
            print(f"  {rid}  not in baseline (not locked=2)", file=sys.stderr)
            skipped += 1
            continue
        result = compare_one(rid, baseline)
        if result is None:
            print(f"  {rid}  no v3 build (run build_all.py first)", file=sys.stderr)
            skipped += 1
            continue
        (COMPARE_DIR / f"{rid}.json").write_text(json.dumps(result, indent=2))
        if result["status"] == "MATCH":
            matches += 1
        else:
            mismatches += 1
        summary_rows.append((
            rid,
            result["recipe_name"],
            result["status"],
            result["deltas_pct"],
            result["v3_yield_factor_water"],
            result["turso_yield_factor_water"],
        ))

    # Print summary table
    print()
    print(f"{'RECIPE':12s} {'NAME':32s} {'STATUS':10s} {'yfW v3/turso':14s}  "
          f"{'kcal':>7s} {'pro':>6s} {'fat':>6s} {'carb':>6s} {'fib':>6s} {'sug':>6s} {'h2o':>7s}")
    print("-" * 130)
    for rid, name, status, d, yfw_v3, yfw_t in summary_rows:
        yfw_str = f"{yfw_v3:.2f}/{yfw_t if yfw_t is not None else '—'}"
        print(f"{rid:12s} {name[:32]:32s} {status:10s} {yfw_str:14s}  "
              f"{d['Energy_KCal']:+7.2f} {d['Protein']:+6.2f} {d['TotalLipidFat']:+6.2f} "
              f"{d['Carbohydrate']:+6.2f} {d['FiberTotalDietary']:+6.2f} "
              f"{d['SugarsTotal']:+6.2f} {d['Water']:+7.2f}")
    print()
    print(f"MATCH: {matches}  MISMATCH: {mismatches}  SKIPPED: {skipped}  (tolerance ±{TOLERANCE_PCT}%)")
    return 0 if mismatches == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
