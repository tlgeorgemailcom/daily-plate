"""Cooking yield model: water, fat, protein, carbohydrate, and fiber mass loss during cooking.

Per v1 spec (mirrored exactly), extended with protein drain (Phase 8d),
carbohydrate drain (Phase 8e), and fiber drain (Phase 9):
    cooked_grams = raw_grams - water_lost - fat_lost - protein_lost - carb_lost - fiber_lost
    water_lost   = sum(ingredient_water_g)    * (1 - yield_factor_water)
    fat_lost     = sum(ingredient_fat_g)      * (1 - yield_factor_fat)
    protein_lost = sum(ingredient_protein_g)  * (1 - yield_factor_protein)
    carb_lost    = sum(ingredient_carb_g)     * (1 - yield_factor_carbohydrate)
    fiber_lost   = sum(ingredient_fiber_g)    * (1 - yield_factor_fiber)

yield_factor_protein, yield_factor_carbohydrate, and yield_factor_fiber default
to 1.0 (all retained) so all existing recipes behave identically.

yield_factor_fiber < 1.0 models recipes where the cooking/preparation removes
fibrous material from the dish (e.g. peeling potatoes after boiling — skin
carries most of the fiber away). Fiber has Atwater coefficient 0, so losing
fiber reduces mass but not energy.

This module is pure: takes scalars, returns scalars. No I/O.
"""
from __future__ import annotations


def water_lost_grams(raw_water_g: float, yield_factor_water: float) -> float:
    """Grams of water evaporated/lost during cooking."""
    return raw_water_g * (1.0 - yield_factor_water)


def fat_lost_grams(raw_fat_g: float, yield_factor_fat: float) -> float:
    """Grams of fat dripped/rendered out during cooking."""
    return raw_fat_g * (1.0 - yield_factor_fat)


def protein_lost_grams(raw_protein_g: float, yield_factor_protein: float) -> float:
    """Grams of protein removed with strained solids (e.g. stock bones discarded)."""
    return raw_protein_g * (1.0 - yield_factor_protein)


def carb_lost_grams(raw_carb_g: float, yield_factor_carbohydrate: float) -> float:
    """Grams of carbohydrate removed with strained solids (structural carbs stay in discarded vegetables)."""
    return raw_carb_g * (1.0 - yield_factor_carbohydrate)


def fiber_lost_grams(raw_fiber_g: float, yield_factor_fiber: float) -> float:
    """Grams of dietary fiber removed during cooking/prep (e.g. skin discarded after boiling).
    Fiber has Atwater coefficient 0 — losing fiber reduces mass but not energy."""
    return raw_fiber_g * (1.0 - yield_factor_fiber)


def cooked_total_grams(
    raw_total_g: float,
    raw_water_g: float,
    raw_fat_g: float,
    yield_factor_water: float,
    yield_factor_fat: float,
    raw_protein_g: float = 0.0,
    yield_factor_protein: float = 1.0,
    raw_carb_g: float = 0.0,
    yield_factor_carbohydrate: float = 1.0,
    raw_fiber_g: float = 0.0,
    yield_factor_fiber: float = 1.0,
) -> float:
    """Final cooked dish weight in grams. Floored at 1g to avoid divide-by-zero."""
    w_lost  = water_lost_grams(raw_water_g, yield_factor_water)
    f_lost  = fat_lost_grams(raw_fat_g, yield_factor_fat)
    p_lost  = protein_lost_grams(raw_protein_g, yield_factor_protein)
    c_lost  = carb_lost_grams(raw_carb_g, yield_factor_carbohydrate)
    fi_lost = fiber_lost_grams(raw_fiber_g, yield_factor_fiber)
    return max(raw_total_g - w_lost - f_lost - p_lost - c_lost - fi_lost, 1.0)
