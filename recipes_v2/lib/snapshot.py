"""Snapshot regression test for approved recipes."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from .build import BuildResult
from .data import SNAPSHOTS_DIR, RecipeIngredient, RecipeMeta
from .fingerprint import compute_fingerprint, canonical_payload


def write_snapshot(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    instructions: list[str],
    build_result: BuildResult,
    canonical_per100g: dict,
) -> Path:
    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "recipe_id": meta.recipe_id,
        "recorded_at": datetime.now(timezone.utc).isoformat(),
        "fingerprint": compute_fingerprint(meta, ingredients, instructions),
        "disclosure": meta.disclosure,
        "canonical_payload": canonical_payload(meta, ingredients, instructions),
        "canonical_per100g": canonical_per100g,
        "built": {
            "raw_grams_total": round(build_result.raw_grams_total, 2),
            "cooked_grams_total": round(build_result.cooked_grams_total, 2),
            "whole_cooked": {k: round(v, 4) for k, v in build_result.whole_cooked.items()},
            "per100g_cooked": {k: round(v, 4) for k, v in build_result.per100g_cooked.items()},
        },
    }
    out = SNAPSHOTS_DIR / f"{meta.recipe_id}.json"
    out.write_text(json.dumps(payload, indent=2))
    return out


def test_against_snapshot(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    instructions: list[str],
    build_result: BuildResult,
    tolerance_pct: float = 0.5,
) -> tuple[bool, list[str]]:
    """Return (ok, diffs). Tolerance is per-nutrient absolute percent."""
    p = SNAPSHOTS_DIR / f"{meta.recipe_id}.json"
    if not p.exists():
        return False, [f"no snapshot at {p}"]
    snap = json.loads(p.read_text())

    diffs: list[str] = []
    fp_now = compute_fingerprint(meta, ingredients, instructions)
    if fp_now != snap.get("fingerprint"):
        diffs.append(f"fingerprint mismatch: snapshot={snap.get('fingerprint')[:12]}... current={fp_now[:12]}...")

    snap_per100g = snap.get("built", {}).get("per100g_cooked", {})
    for k, v in build_result.per100g_cooked.items():
        snap_v = float(snap_per100g.get(k, 0.0))
        if snap_v == 0:
            if abs(v) > 0.01:
                diffs.append(f"{k}: snapshot=0 current={v:.4f}")
            continue
        pct = abs((v - snap_v) / snap_v) * 100.0
        if pct > tolerance_pct:
            diffs.append(f"{k}: snapshot={snap_v:.4f} current={v:.4f} ({pct:+.2f}%)")

    return len(diffs) == 0, diffs
