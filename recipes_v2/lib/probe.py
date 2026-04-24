"""Sanity probes:

1. compare_to_food_portions: built per-100g vs food-portions-complete.csv per-100g
2. compare_to_v1_recipes_dev: built per-100g vs v1 recipes_dev.db row

These probes do NOT mutate any data. They print diffs.
"""
from __future__ import annotations

import json
import sqlite3
from typing import Optional

from .canonical import canonical_per100g_from_food_portion
from .data import MACRO_KEYS, V1_RECIPES_DEV_DB, RecipeMeta


def compare_to_food_portions(
    meta: RecipeMeta,
    built_per100g: dict,
    tolerance_pct: float = 5.0,
) -> dict:
    """Compare built per-100g to the food-portions-complete.csv *_100g columns."""
    canonical = canonical_per100g_from_food_portion(meta.food_word)
    if canonical is None:
        return {"ok": False, "reason": f"food-portions row not found for {meta.food_word}"}

    diffs: list[dict] = []
    for k in MACRO_KEYS:
        c = float(canonical.get(k, 0.0))
        b = float(built_per100g.get(k, 0.0))
        if c == 0:
            within = abs(b) < 0.01
            pct = None
        else:
            pct = (b - c) / c * 100.0
            within = abs(pct) <= tolerance_pct
        diffs.append({
            "macro": k,
            "canonical_per100g": round(c, 4),
            "built_per100g": round(b, 4),
            "delta_pct": round(pct, 2) if pct is not None else None,
            "within_tolerance": within,
        })
    ok = all(d["within_tolerance"] for d in diffs)
    return {"ok": ok, "tolerance_pct": tolerance_pct, "diffs": diffs}


def compare_to_v1_recipes_dev(
    recipe_id: str,
    built_per100g: dict,
    tolerance_pct: float = 5.0,
) -> dict:
    """Compare to v1 recipes_dev.db row's nutrition_json (per-100g if present)."""
    if not V1_RECIPES_DEV_DB.exists():
        return {"ok": False, "reason": f"v1 db missing at {V1_RECIPES_DEV_DB}"}
    with sqlite3.connect(str(V1_RECIPES_DEV_DB)) as conn:
        cur = conn.execute(
            "SELECT nutrition_json FROM recipes WHERE id = ? LIMIT 1",
            (recipe_id,),
        )
        row = cur.fetchone()
    if not row:
        return {"ok": False, "reason": f"no v1 row for recipe_id={recipe_id}"}

    payload = json.loads(row[0] or "{}")
    # v1 recipes_dev.db stores macro keys at the top level (kcal, protein, etc.)
    v1_to_macro = {
        "kcal": "cal", "protein": "pro", "fat": "fat", "carbs": "carb",
        "fiber": "fib", "water": "h2o", "sugar": "sug", "sodium": "sodium",
    }
    # v1 stores totals + servings, not per-100g; compute per-100g from totals
    # only if totalRecipeGrams or grams_total field is present
    grams_total = payload.get("totalRecipeGrams") or payload.get("grams_total")
    if not grams_total:
        # Fall back to whole-recipe comparison (no per-100g normalization)
        v1_per100g: Optional[dict] = None
    else:
        v1_per100g = {}
        for v1_key, macro_key in v1_to_macro.items():
            try:
                v = float(payload.get(v1_key, 0.0) or 0.0)
            except (TypeError, ValueError):
                v = 0.0
            v1_per100g[macro_key] = v * 100.0 / float(grams_total)

    diffs: list[dict] = []
    for k in MACRO_KEYS:
        b = float(built_per100g.get(k, 0.0))
        if v1_per100g is None:
            v1v = float(payload.get({v: k for k, v in v1_to_macro.items()}.get(k, ""), 0.0) or 0.0)
            diffs.append({
                "macro": k,
                "v1_value_raw": round(v1v, 4),
                "v2_per100g": round(b, 4),
                "note": "v1 has no totalRecipeGrams; raw value shown",
            })
            continue
        v = v1_per100g[k]
        if v == 0:
            pct = None
            within = abs(b) < 0.01
        else:
            pct = (b - v) / v * 100.0
            within = abs(pct) <= tolerance_pct
        diffs.append({
            "macro": k,
            "v1_per100g": round(v, 4),
            "v2_per100g": round(b, 4),
            "delta_pct": round(pct, 2) if pct is not None else None,
            "within_tolerance": within,
        })
    ok = all(d.get("within_tolerance", True) for d in diffs)
    return {"ok": ok, "tolerance_pct": tolerance_pct, "diffs": diffs}


def format_probe_table(probe_result: dict) -> str:
    if not probe_result.get("diffs"):
        return f"PROBE FAILED: {probe_result.get('reason', 'unknown')}"
    rows = [f"PROBE OK={probe_result.get('ok')} tolerance={probe_result.get('tolerance_pct')}%"]
    for d in probe_result["diffs"]:
        rows.append(json.dumps(d, separators=(",", ":")))
    return "\n".join(rows)
