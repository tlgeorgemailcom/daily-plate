"""Canonical per-100g nutrient extraction and scaling.

Two sources, both authoritative:
- DataCentralCombo (SR Legacy 2018) for the canonical dish row.
- food-portions-complete.csv for per-100g targets and serving grams.
"""
from __future__ import annotations

from typing import Optional

from .data import (
    MACRO_KEYS,
    COMBO_TO_MACRO,
    PORTION_TO_MACRO,
    query_combo,
    query_food_portion,
)


def canonical_per100g_from_combo(ndb_no: str) -> Optional[dict]:
    """Return per-100g macro dict from DataCentralCombo, or None if NDB missing."""
    row = query_combo(ndb_no)
    if not row:
        return None
    out = {k: 0.0 for k in MACRO_KEYS}
    for combo_col, macro_key in COMBO_TO_MACRO.items():
        v = row.get(combo_col)
        try:
            out[macro_key] = float(v) if v is not None else 0.0
        except (TypeError, ValueError):
            out[macro_key] = 0.0
    return out


def canonical_per100g_from_food_portion(food_word: str) -> Optional[dict]:
    """Return per-100g macro dict from food-portions-complete.csv."""
    row = query_food_portion(food_word)
    if not row:
        return None
    out = {k: 0.0 for k in MACRO_KEYS}
    for col, macro_key in PORTION_TO_MACRO.items():
        v = row.get(col)
        try:
            out[macro_key] = float(v) if v else 0.0
        except (TypeError, ValueError):
            out[macro_key] = 0.0
    # food-portions-complete.csv does not have sodium per-100g universally
    return out


def canonical_serving_grams(food_word: str) -> Optional[float]:
    """pickCanonicalServingGrams equivalent: iterate M0..M12, skip 'oz',
    treat 'custom (g)' as fallback, return first real entry."""
    row = query_food_portion(food_word)
    if not row:
        return None
    fallback: Optional[float] = None
    for i in range(13):
        desc = (row.get(f"M{i}_Desc") or "").strip().lower()
        try:
            grams = float(row.get(f"M{i}_Gm") or "")
        except (TypeError, ValueError):
            continue
        if not desc or grams <= 0:
            continue
        if desc == "custom (g)":
            fallback = grams
            continue
        if desc == "oz":
            continue
        return grams
    return fallback


def scale_per100g_to_whole(per100g: dict, total_grams: float) -> dict:
    factor = total_grams / 100.0
    return {k: per100g.get(k, 0.0) * factor for k in MACRO_KEYS}


def scale_whole_to_per100g(whole: dict, total_grams: float) -> dict:
    if total_grams <= 0:
        return {k: 0.0 for k in MACRO_KEYS}
    return {k: whole.get(k, 0.0) * 100.0 / total_grams for k in MACRO_KEYS}
