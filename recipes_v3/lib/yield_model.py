"""Cooking yield model: water and fat mass loss during cooking.

Per v1 spec (mirrored exactly):
    cooked_grams = raw_grams - water_lost - fat_lost
    water_lost   = sum(ingredient_water_g) * (1 - yield_factor_water)
    fat_lost     = sum(ingredient_fat_g)   * (1 - yield_factor_fat)

This module is pure: takes scalars, returns scalars. No I/O.
"""
from __future__ import annotations


def water_lost_grams(raw_water_g: float, yield_factor_water: float) -> float:
    """Grams of water evaporated/lost during cooking."""
    return raw_water_g * (1.0 - yield_factor_water)


def fat_lost_grams(raw_fat_g: float, yield_factor_fat: float) -> float:
    """Grams of fat dripped/rendered out during cooking."""
    return raw_fat_g * (1.0 - yield_factor_fat)


def cooked_total_grams(
    raw_total_g: float,
    raw_water_g: float,
    raw_fat_g: float,
    yield_factor_water: float,
    yield_factor_fat: float,
) -> float:
    """Final cooked dish weight in grams. Floored at 1g to avoid divide-by-zero."""
    w_lost = water_lost_grams(raw_water_g, yield_factor_water)
    f_lost = fat_lost_grams(raw_fat_g, yield_factor_fat)
    return max(raw_total_g - w_lost - f_lost, 1.0)
