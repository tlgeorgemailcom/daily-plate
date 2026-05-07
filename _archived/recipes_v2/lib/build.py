"""Built nutrition computation with cooking yield model.

Sums per-ingredient per-100g nutrients (from DataCentralCombo) by gram weight,
then applies a per-nutrient retention factor based on the recipe's cook_method.

Returns whole-recipe totals, raw and cooked total grams, and per-100g profile
on the cooked basis (to match canonical dish per-100g, which is already cooked).
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .canonical import canonical_per100g_from_combo, scale_whole_to_per100g
from .data import MACRO_KEYS, LedgerEntry, RecipeIngredient, RecipeMeta

# Nutrient categories used by the yield model
WATER_KEYS = {"h2o"}
FAT_KEYS = {"fat"}
# Everything else uses yield_factor_other


@dataclass
class BuildResult:
    raw_grams_total: float
    cooked_grams_total: float
    whole_raw: dict             # whole-recipe totals before yield
    whole_cooked: dict          # whole-recipe totals after yield
    per100g_cooked: dict        # cooked totals / cooked grams * 100
    per_ingredient: list[dict]  # diagnostic: each ingredient's contribution
    missing_ndb: list[str]      # ingredient_keys whose NDB lookup failed


def _retention_factor(macro_key: str, meta: RecipeMeta) -> float:
    if macro_key in WATER_KEYS:
        return meta.yield_factor_water
    if macro_key in FAT_KEYS:
        return meta.yield_factor_fat
    return meta.yield_factor_other


def build_recipe(
    meta: RecipeMeta,
    ingredients: list[RecipeIngredient],
    ledger: dict[str, LedgerEntry],
    include_optional: bool = True,
) -> BuildResult:
    raw_grams_total = 0.0
    whole_raw = {k: 0.0 for k in MACRO_KEYS}
    per_ingredient: list[dict] = []
    missing: list[str] = []

    for ri in ingredients:
        if ri.is_optional and not include_optional:
            continue
        entry = ledger.get(ri.ingredient_key)
        if not entry:
            missing.append(ri.ingredient_key)
            continue
        per100g = canonical_per100g_from_combo(entry.ndb_no)
        if per100g is None:
            missing.append(f"{ri.ingredient_key}(NDB={entry.ndb_no})")
            continue
        raw_grams_total += ri.grams
        contrib = {k: per100g[k] * (ri.grams / 100.0) for k in MACRO_KEYS}
        for k in MACRO_KEYS:
            whole_raw[k] += contrib[k]
        per_ingredient.append({
            "ingredient_key": ri.ingredient_key,
            "ndb_no": entry.ndb_no,
            "grams": ri.grams,
            "contrib": contrib,
        })

    # Apply yield factors per nutrient (cooked totals)
    whole_cooked = {k: whole_raw[k] * _retention_factor(k, meta) for k in MACRO_KEYS}

    # Cooked grams = raw grams - water lost (water is the only thing that
    # leaves the system as mass for typical bake/boil/roast). Fat retention
    # below 1.0 implies fat dripped out, which also reduces cooked mass.
    water_lost = whole_raw["h2o"] * (1.0 - meta.yield_factor_water)
    fat_lost = whole_raw["fat"] * (1.0 - meta.yield_factor_fat)
    cooked_grams_total = max(raw_grams_total - water_lost - fat_lost, 1e-6)

    per100g_cooked = scale_whole_to_per100g(whole_cooked, cooked_grams_total)

    return BuildResult(
        raw_grams_total=raw_grams_total,
        cooked_grams_total=cooked_grams_total,
        whole_raw=whole_raw,
        whole_cooked=whole_cooked,
        per100g_cooked=per100g_cooked,
        per_ingredient=per_ingredient,
        missing_ndb=missing,
    )
