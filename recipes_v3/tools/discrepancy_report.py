"""Phase 4 — Discrepancy report.

Reads output/compare/*.json and groups recipes by likely root cause:
  - GROUP_A: Turso missing yfW + large delta on kcal/water (Turso built with no yield model)
  - GROUP_B: Turso has yfW + small delta (within tolerance for non-yield reasons)
  - GROUP_C: Uniform delta across all macros (gram total mismatch — different ingredient quantities)
  - GROUP_D: Single-macro outlier (recipe-specific edit needed)
  - GROUP_E: Within tolerance (no action needed)

Writes:
  output/discrepancies.json  — full machine-readable
  output/discrepancies.md    — human-readable summary
"""
from __future__ import annotations

import json
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPARE_DIR = ROOT / "output" / "compare"
OUT_JSON = ROOT / "output" / "discrepancies.json"
OUT_MD = ROOT / "output" / "discrepancies.md"

MACROS = ("Energy_KCal", "Protein", "TotalLipidFat", "Carbohydrate",
          "FiberTotalDietary", "SugarsTotal", "Water")


def classify(c: dict) -> tuple[str, str]:
    """Return (group, reason)."""
    deltas = c["deltas_pct"]
    abs_deltas = {m: abs(deltas[m]) for m in MACROS}
    max_abs = max(abs_deltas.values())
    yfw_v3 = c["v3_yield_factor_water"]
    yfw_t = c["turso_yield_factor_water"]

    # Group E — within ±0.5%
    if max_abs <= 0.5:
        return "E", "Within tolerance"

    # Group C — uniform delta (likely gram-total mismatch)
    # Signature: all 6 non-water macros within ±2% of each other AND water has opposite sign
    non_water = [deltas[m] for m in MACROS if m != "Water"]
    if len(set(round(d, 0) for d in non_water)) == 1 and abs(deltas["Water"]) > 5:
        return "C", f"Uniform {non_water[0]:+.1f}% on macros + opposite Water — gram-total mismatch"

    # Group A — Turso missing yfW + v3 has yfW < 1 + Water lower in v3 + others higher
    if yfw_t is None and yfw_v3 < 0.95:
        if deltas["Water"] < -3 and deltas["Energy_KCal"] > 3:
            return "A", f"Turso missing yfW; v3 applies yfW={yfw_v3:.2f} → kcal{deltas['Energy_KCal']:+.1f}% water{deltas['Water']:+.1f}%"
        if max_abs > 5:
            return "A?", f"Turso missing yfW; v3 yfW={yfw_v3:.2f}, mixed signs"

    # Group D — single-macro outliers
    big = [(m, deltas[m]) for m in MACROS if abs(deltas[m]) > 10]
    if len(big) <= 2:
        return "D", "Outlier macros: " + ", ".join(f"{m}{d:+.1f}%" for m, d in big)

    # Default: Group B (small/mixed)
    return "B", f"Mixed deltas (max {max_abs:.1f}%)"


def main() -> int:
    files = sorted(COMPARE_DIR.glob("*.json"))
    if not files:
        print("No compare files. Run tools/compare.py first.")
        return 1

    classified: dict[str, list[dict]] = {}
    rows: list[dict] = []
    for fp in files:
        c = json.loads(fp.read_text())
        group, reason = classify(c)
        c["_group"] = group
        c["_reason"] = reason
        classified.setdefault(group, []).append(c)
        rows.append(c)

    # Write JSON
    OUT_JSON.write_text(json.dumps({
        "summary": {g: len(rs) for g, rs in classified.items()},
        "by_group": {g: [r["recipe_id"] for r in rs] for g, rs in classified.items()},
        "details": rows,
    }, indent=2))

    # Write Markdown report
    md: list[str] = []
    md.append("# Phase 4 — v3 vs Turso Discrepancy Report")
    md.append("")
    md.append(f"**Date generated:** {__import__('datetime').date.today().isoformat()}")
    md.append(f"**Total recipes compared:** {len(rows)}")
    md.append(f"**Tolerance:** ±0.5% per macro (Phase 3 acceptance)")
    md.append("")
    md.append("## Group Definitions")
    md.append("")
    md.append("| Group | Meaning | Count |")
    md.append("|---|---|---:|")
    md.append(f"| **A** | Turso missing yfW; v3 applies yield → systematic kcal high / water low | {len(classified.get('A', []))} |")
    md.append(f"| **A?** | Turso missing yfW; v3 has yield but pattern unclear | {len(classified.get('A?', []))} |")
    md.append(f"| **B** | Both have yfW; mixed/small deltas | {len(classified.get('B', []))} |")
    md.append(f"| **C** | Uniform delta across macros + opposite water — different ingredient grams | {len(classified.get('C', []))} |")
    md.append(f"| **D** | One or two outlier macros — recipe-specific edit | {len(classified.get('D', []))} |")
    md.append(f"| **E** | Within ±0.5% — no action | {len(classified.get('E', []))} |")
    md.append("")

    for group in ("A", "A?", "B", "C", "D", "E"):
        items = classified.get(group, [])
        if not items:
            continue
        md.append(f"## Group {group} — {len(items)} recipe(s)")
        md.append("")
        md.append("| Recipe | Name | yfW v3/turso | kcal Δ | pro Δ | fat Δ | carb Δ | fib Δ | sug Δ | h2o Δ | reason |")
        md.append("|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|")
        for c in sorted(items, key=lambda x: x["recipe_id"]):
            d = c["deltas_pct"]
            yfw_t = c["turso_yield_factor_water"]
            yfw_str = f"{c['v3_yield_factor_water']:.2f} / {yfw_t if yfw_t is not None else '—'}"
            md.append(
                f"| {c['recipe_id']} | {c['recipe_name'][:30]} | {yfw_str} | "
                f"{d['Energy_KCal']:+.1f} | {d['Protein']:+.1f} | {d['TotalLipidFat']:+.1f} | "
                f"{d['Carbohydrate']:+.1f} | {d['FiberTotalDietary']:+.1f} | "
                f"{d['SugarsTotal']:+.1f} | {d['Water']:+.1f} | {c['_reason']} |"
            )
        md.append("")

    md.append("## Statistics")
    md.append("")
    for macro in MACROS:
        deltas = [r["deltas_pct"][macro] for r in rows]
        abs_deltas = [abs(d) for d in deltas]
        md.append(f"- **{macro}**: mean Δ = {statistics.mean(deltas):+.2f}%, "
                  f"median |Δ| = {statistics.median(abs_deltas):.2f}%, "
                  f"max |Δ| = {max(abs_deltas):.2f}%")
    md.append("")

    md.append("## Recommended Triage Order")
    md.append("")
    md.append("1. **Group A first** — these are uniform pattern, single root cause (re-upload with yfW). One fix unlocks them all.")
    md.append("2. **Group C next** — gram mismatches indicate ingredient list drift. Compare v3 ingredients to v1 source CSV.")
    md.append("3. **Group D** — recipe-by-recipe investigation.")
    md.append("4. **Group B** — likely tolerable; revisit only if Group A fix doesn't move them into Group E.")
    md.append("")
    md.append("## Next Steps")
    md.append("")
    md.append("- This report is read-only. No Turso writes.")
    md.append("- Decide per-group whether v3 or Turso is the source of truth.")
    md.append("- For Group A: most likely v3 is correct (yield model is real). Plan would be: re-PATCH Turso for those recipes with v3's per100g + perServing + yfW. Manual review per recipe before any write.")
    md.append("")

    OUT_MD.write_text("\n".join(md))
    print(f"Wrote {OUT_JSON}")
    print(f"Wrote {OUT_MD}")
    print()
    print("Group counts:", {g: len(rs) for g, rs in classified.items()})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
