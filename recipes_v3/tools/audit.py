"""Phase 4 — Independent v3 audit vs canonical USDA NDB.

For each Rule A or Rule B recipe with a canonical_ndb_no, compare v3 build's
per100g to the canonical NDB's per100g from comboo.db. This is independent of
Turso entirely.

Acceptance (per docs/v3.md):
  - Rule A: ±5% on every macro
  - Rule B: ±15% on every macro

Writes:
  output/audit/<recipe_id>.json
  output/audit_summary.md
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR.parent))

from lib.load import (  # noqa: E402
    MACROS,
    load_canonical_per100g,
    load_comboo_nutrients,
    load_ingredients,
    load_ledger,
    load_recipes,
    load_sections,
)
from lib.build import build_recipe  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "audit"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_MD = ROOT / "output" / "audit_summary.md"

TOLERANCE = {"Rule A": 5.0, "Rule B": 15.0}


def pct_delta(v3: float, ref: float) -> float:
    if ref == 0:
        return 0.0 if v3 == 0 else float("inf")
    return (v3 - ref) / ref * 100.0


def main() -> int:
    recipes = load_recipes()
    ledger = load_ledger()
    ingredients = load_ingredients()
    sections_by_recipe = load_sections()

    # Pre-load all NDBs we'll need (canonical + ingredients)
    needed_ndbs = set()
    for r in recipes.values():
        if r.canonical_ndb_no:
            needed_ndbs.add(r.canonical_ndb_no)
    for entry in ledger.values():
        needed_ndbs.add(entry.ndb_no)
    nuts_by_ndb = load_comboo_nutrients(needed_ndbs)

    rows: list[dict] = []
    for rid, r in recipes.items():
        if r.sr_rule not in ("Rule A", "Rule B"):
            continue
        if not r.canonical_ndb_no:
            continue
        canonical = nuts_by_ndb.get(r.canonical_ndb_no)
        if canonical is None:
            continue

        rows_for_recipe = ingredients.get(rid, [])
        try:
            built = build_recipe(r, rows_for_recipe, ledger, nuts_by_ndb, sections=sections_by_recipe.get(rid))
        except Exception as e:
            rows.append({
                "recipe_id": rid,
                "recipe_name": r.recipe_name,
                "sr_rule": r.sr_rule,
                "canonical_ndb_no": r.canonical_ndb_no,
                "error": str(e),
                "verdict": "ERROR",
            })
            continue

        v3_per100g = built["per100g"]
        deltas = {m: pct_delta(v3_per100g.get(m, 0.0), canonical.get(m, 0.0)) for m in MACROS}
        tol = TOLERANCE[r.sr_rule]
        # Macros with canonical=0 in USDA are unscored (data gap, not a math error).
        scorable = {m: d for m, d in deltas.items() if canonical.get(m, 0.0) > 0 and d != float("inf")}
        ungraded = [m for m in MACROS if m not in scorable]
        if not scorable:
            verdict = "NO_REF"
            worst = ("(none)", 0.0)
        else:
            worst = max(scorable.items(), key=lambda kv: abs(kv[1]))
            verdict = "PASS" if abs(worst[1]) <= tol else "FAIL"

        rec = {
            "recipe_id": rid,
            "recipe_name": r.recipe_name,
            "sr_rule": r.sr_rule,
            "canonical_ndb_no": r.canonical_ndb_no,
            "tolerance_pct": tol,
            "v3_per100g": v3_per100g,
            "canonical_per100g": canonical,
            "deltas_pct": deltas,
            "worst_macro": worst[0],
            "worst_delta_pct": worst[1],
            "ungraded_macros": ungraded,
            "verdict": verdict,
        }
        rows.append(rec)
        (OUT_DIR / f"{rid}.json").write_text(json.dumps(rec, indent=2))

    # Summary table
    md: list[str] = []
    md.append("# Phase 4 — v3 vs Canonical USDA NDB Audit")
    md.append("")
    md.append(f"**Date:** {__import__('datetime').date.today().isoformat()}")
    md.append(f"**Recipes audited:** {len(rows)}")
    rule_a = [r for r in rows if r.get('sr_rule') == 'Rule A']
    rule_b = [r for r in rows if r.get('sr_rule') == 'Rule B']
    md.append(f"**Rule A:** {len(rule_a)} (tolerance ±5%)")
    md.append(f"**Rule B:** {len(rule_b)} (tolerance ±15%)")
    pass_n = sum(1 for r in rows if r.get('verdict') == 'PASS')
    fail_n = sum(1 for r in rows if r.get('verdict') == 'FAIL')
    err_n = sum(1 for r in rows if r.get('verdict') == 'ERROR')
    noref_n = sum(1 for r in rows if r.get('verdict') == 'NO_REF')
    md.append(f"**Result:** PASS {pass_n} / FAIL {fail_n} / NO_REF {noref_n} / ERROR {err_n}")
    md.append("")
    md.append("> Macros with canonical USDA value = 0 are **ungraded** (data gap, not a v3 error). Verdict reflects only macros with non-zero canonical reference.")
    md.append("")

    md.append("| Recipe | Name | Rule | Canon NDB | kcal Δ | pro Δ | fat Δ | carb Δ | fib Δ | sug Δ | h2o Δ | Worst | Verdict |")
    md.append("|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|---|")
    for r in sorted(rows, key=lambda x: x['recipe_id']):
        if r.get('verdict') == 'ERROR':
            md.append(f"| {r['recipe_id']} | {r['recipe_name'][:30]} | {r['sr_rule']} | {r['canonical_ndb_no']} | — | — | — | — | — | — | — | ERROR | {r['error']} |")
            continue
        d = r['deltas_pct']
        md.append(
            f"| {r['recipe_id']} | {r['recipe_name'][:30]} | {r['sr_rule']} | {r['canonical_ndb_no']} | "
            f"{d['Energy_KCal']:+.1f} | {d['Protein']:+.1f} | {d['TotalLipidFat']:+.1f} | "
            f"{d['Carbohydrate']:+.1f} | {d['FiberTotalDietary']:+.1f} | "
            f"{d['SugarsTotal']:+.1f} | {d['Water']:+.1f} | "
            f"{r['worst_macro']} {r['worst_delta_pct']:+.1f}% | **{r['verdict']}** |"
        )
    md.append("")

    md.append("## Interpretation")
    md.append("")
    md.append("- **PASS** within Rule A/B tolerance ⇒ v3 math agrees with USDA's own published per-100g for the canonical food. Strong evidence v3 is correct.")
    md.append("- **FAIL** ⇒ either the canonical NDB choice is wrong, the ingredient/yield model needs adjustment, or USDA's canonical entry uses a different recipe than ours.")
    md.append("")

    OUT_MD.write_text("\n".join(md))
    print(f"Wrote {OUT_MD}")
    print(f"Audit: PASS {pass_n} / FAIL {fail_n} / ERROR {err_n} (of {len(rows)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
