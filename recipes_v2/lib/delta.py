"""Per-nutrient delta report between canonical and built per-100g values."""
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .data import DELTAS_DIR, MACRO_KEYS

# Status thresholds (delta_pct = (built - canonical) / canonical * 100)
TOLERANCE_MATCH = 5.0   # |delta_pct| <= 5%   -> "match"
TOLERANCE_MINOR = 15.0  # |delta_pct| <= 15%  -> "minor"
# Otherwise -> "major"


@dataclass
class NutrientDelta:
    macro_key: str
    canonical: float
    built: float
    delta_abs: float
    delta_pct: Optional[float]  # None when canonical is 0
    status: str                 # match / minor / major / canonical_zero


def compute_delta(canonical_per100g: dict, built_per100g: dict) -> list[NutrientDelta]:
    out: list[NutrientDelta] = []
    for k in MACRO_KEYS:
        c = float(canonical_per100g.get(k, 0.0) or 0.0)
        b = float(built_per100g.get(k, 0.0) or 0.0)
        delta_abs = b - c
        if c == 0:
            pct = None
            status = "canonical_zero" if b != 0 else "match"
        else:
            pct = (b - c) / c * 100.0
            ap = abs(pct)
            if ap <= TOLERANCE_MATCH:
                status = "match"
            elif ap <= TOLERANCE_MINOR:
                status = "minor"
            else:
                status = "major"
        out.append(NutrientDelta(
            macro_key=k,
            canonical=round(c, 4),
            built=round(b, 4),
            delta_abs=round(delta_abs, 4),
            delta_pct=round(pct, 2) if pct is not None else None,
            status=status,
        ))
    return out


def write_delta_report(
    recipe_id: str,
    canonical_per100g: dict,
    built_per100g: dict,
    canonical_source: str,
    extra: Optional[dict] = None,
) -> Path:
    DELTAS_DIR.mkdir(parents=True, exist_ok=True)
    deltas = compute_delta(canonical_per100g, built_per100g)
    payload = {
        "recipe_id": recipe_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "canonical_source": canonical_source,
        "canonical_per100g": canonical_per100g,
        "built_per100g": built_per100g,
        "deltas": [d.__dict__ for d in deltas],
        "summary": _summarize(deltas),
    }
    if extra:
        payload.update(extra)
    out_path = DELTAS_DIR / f"{recipe_id}.json"
    out_path.write_text(json.dumps(payload, indent=2))
    return out_path


def _summarize(deltas: list[NutrientDelta]) -> dict:
    counts = {"match": 0, "minor": 0, "major": 0, "canonical_zero": 0}
    for d in deltas:
        counts[d.status] = counts.get(d.status, 0) + 1
    return {
        **counts,
        "majors": [d.macro_key for d in deltas if d.status == "major"],
        "minors": [d.macro_key for d in deltas if d.status == "minor"],
        "canonical_zeros": [d.macro_key for d in deltas if d.status == "canonical_zero"],
    }


def format_delta_table(deltas: list[NutrientDelta]) -> str:
    """Human-readable delta table for terminal output."""
    rows = ["nutrient   canonical      built      delta      delta_pct   status"]
    rows.append("-" * 70)
    for d in deltas:
        pct = f"{d.delta_pct:+.2f}%" if d.delta_pct is not None else "  n/a "
        rows.append(
            f"{d.macro_key:8}  {d.canonical:>10.3f}  {d.built:>10.3f}  "
            f"{d.delta_abs:>+9.3f}  {pct:>9}   {d.status}"
        )
    return "\n".join(rows)
