"""Recipe build orchestrator (v3, full nutrient panel).

Phase-6 widening: produces the ~60-nutrient panel needed by the Balanced
Diet game and the Turso-compatible ``nutrition_json`` shape consumed by
the web app.

Math contract (single source of truth, see docs/v3.md §4 + §5):

    For each ingredient:
        contrib[N] = nutrient[N] * (grams / 100)
    Whole-recipe sum:
        sum[N] = Σ contrib[N]
    Apply retention / yield to each nutrient:
        retained[Water] = sum[Water] * yield_factor_water
        retained[Fat]   = sum[Fat]   * yield_factor_fat
        retained[N]     = sum[N]     * get_retention(method, N)   # macros => 1.00
    Cooked mass:
        cooked_grams = raw - water_lost - fat_lost
    Final:
        per100g[N]     = retained[N] / cooked_grams * 100
        per_serving[N] = per100g[N]  * grams_per_serving / 100

Added/Intrinsic sugar split per ingredient (see lib/added_sugars.py):
    sum_added[g]    = Σ contrib[Sugar] * added_fraction(NDB, Long_Desc)
    sum_intrinsic[g] = sum[Sugar] - sum_added

Derived nutrients (not direct comboo columns):
    omega3 = ALA + EPA + DPA + DHA
    omega6 = LinoleicAcid (until further species are added)

Phase 8c — composite "recipe-within-recipe" support:
    Ingredient rows whose ``ingredient_key`` starts with ``@`` reference a
    previously-built child recipe (e.g. ``@BKFST_001`` = Biscuit). Their
    nutrition is sourced from the child's already-cooked per-100g panel and
    bypasses retention/yield (the child already applied them at its own build
    time). To keep the math passthrough-clean, the validator requires any
    section that hosts component-ref rows to set yfw=yff=yfo=1.0 and
    cook_method=raw (so all retention factors collapse to 1.0).
"""
from __future__ import annotations

PARBOILED_RICE_CUP_GRAMS = 200.0
PARBOILED_RICE_WATER_CUPS_PER_CUP = 1.05
WATER_GRAMS_PER_CUP = 236.588

import json
from typing import Any

from .added_sugars import classify, split_sugar
from .load import (
    EXTENDED_NUTRIENTS,
    MACROS,
    IngredientRow,
    LedgerEntry,
    Recipe,
    Section,
    child_recipe_id,
    is_component_ref,
    load_comboo_nutrients,
)
from .retention import get_retention, normalize_cooking_method
from .yield_calc import BINDING, calc_yield_water
from .yield_model import cooked_total_grams


def _method_stovetop_temp(method: str | None, *, bake_covered_temp: float | None = None) -> float:
    m = (method or "").strip().lower().replace("_", " ")
    if m in ("sub-simmer", "sub simmer"):
        return 180.0
    if m in ("scald", "scalded"):
        return 212.0
    if m == "simmer":
        return 195.0
    if m in ("braise", "braised"):
        return 185.0
    if m in ("saute", "sauté", "sauteed", "sautéed"):
        return 200.0
    if m in ("stir fry", "stir-fried", "stir fried"):
        return 220.0
    if m in ("pan sear", "pan seared", "pan-seared", "sear", "seared"):
        return 230.0
    if m == "parboiled long grain rice":
        return 212.0
    if m in ("bake covered", "baked covered") and bake_covered_temp is not None:
        return bake_covered_temp
    return 212.0


# ── Stock extraction yield factors ───────────────────────────────────────────
# When a section's fill_class is a stock class, these constants replace the
# load.py defaults of 1.0 for yfp/yff/yfc/yfo (which come from cleared CSV
# locks). Applied after all other resolution paths in _build_recipe_multi.
# Mirror: STOCK_EXTRACTION in src/lib/nutrition/buildRecipeCommunityV3.ts.
STOCK_EXTRACTION: dict[str, dict[str, float]] = {
    "chicken_stock": {"yfp": 0.366, "yff": 0.089, "yfc": 0.02, "yfo": 0.02},
    # STOCK_001 White Chicken Stock, STOCK_002 Brown Chicken Stock,
    # STOCK_003 Chicken Broth, STOCK_004 Beef Stock.
    # Calibrated: protein extraction 36.6%, fat rendered+skimmed 8.9%,
    # carb extraction 2%, fat-soluble vitamins leave with strained solids 2%.
    "bone_broth":    {"yfp": 0.395, "yff": 0.089, "yfc": 0.02, "yfo": 0.02},
    # STOCK_005 Beef Bone Broth: 24h simmer extracts 39.5% of raw protein
    # (vs 36.6% for standard 3–4h simmers). Calibrated vs Kettle & Fire label.
    "fish_stock":    {"yfp": 0.355, "yff": 1.000, "yfc": 0.293, "yfo": 0.02},
    # STOCK_006 Fish Stock: yff=1.000 (fat stays, no skimming); yfp=0.355 protein
    # extraction; yfc=0.293 captures wine carb evaporation/retention; yfo=0.02
    # fat-soluble vitamins leave with strained solids. Rule C — calibrated vs NDB 6963.
    "vegetable_stock": {"yfp": 0.484, "yff": 0.950, "yfc": 0.290, "yfo": 0.02},
    # STOCK_007 Vegetable Stock: yff=0.950 (minimal fat from veg); yfp=0.484 protein
    # extraction from vegetables; yfc=0.290 carb extraction; yfo=0.02.
    # Rule C — calibrated vs NDB 6700.
}


def _parse_stages(cook_stages: str) -> list[tuple[int, int]]:
    """Parse '425:15,350:37' → [(425, 15), (350, 37)]."""
    return [
        (int(p.split(":")[0]), int(p.split(":")[1]))
        for p in cook_stages.split(",")
        if ":" in p
    ]

_MACRO_SET = set(MACROS)

# Fat-soluble vitamins and carotenoids partition into fat/solids and leave
# with the discard when a stock or broth is strained. yield_factor_other (yfo)
# is multiplied against these nutrients only; all water-soluble vitamins and
# minerals are unaffected. Default yfo=1.0 preserves existing behaviour for
# all non-stock recipes.
_FAT_SOLUBLE_NUTRIENTS = {
    "VitaminA_RAE", "Retinol",
    "Carotene_beta", "Carotene_alpha", "Cryptoxanthin_beta",
    "LuteinZeaxanthin", "Lycopene",
    "VitaminD", "VitaminD2_ergocalciferol", "VitaminD3_cholecalciferol", "VitaminD2D3",
    "VitaminE_alphaTocopherol", "Tocopherol_beta", "Tocopherol_gamma", "Tocopherol_delta",
    "Tocotrienol_aplha", "Tocotrienol_beta", "Tocotrienol_gamma", "Tocotrienol_delta",
    "VitaminK_phylloquinone",
}


def _round(x: float, ndigits: int = 2) -> float:
    return round(float(x), ndigits)


def _round1(x: float) -> float:
    return round(float(x), 1)


def _derive_omegas(d: dict[str, float]) -> tuple[float, float]:
    o3 = (
        d.get("alphaLinolenicAcid", 0.0)
        + d.get("EPA_20_5n3", 0.0)
        + d.get("DPA_22_5n3", 0.0)
        + d.get("DHA_22_6n3", 0.0)
    )
    o6 = d.get("LinoleicAcid", 0.0)
    return o3, o6


def _load_child_build(child_id: str) -> dict[str, Any]:
    """Load a previously-built child recipe JSON for composite/component-ref use.

    Raises a clear error if the child has not been built yet.
    """
    # The build directory lives at recipes_v3/output/builds/ relative to this file.
    from pathlib import Path
    builds_dir = Path(__file__).resolve().parents[1] / "output" / "builds"
    path = builds_dir / f"{child_id}.json"
    if not path.exists():
        raise RuntimeError(
            f"Composite reference @{child_id} requires {path} to exist. "
            f"Build the child first: python3 recipes_v3/tools/build_one.py {child_id}"
        )
    return json.loads(path.read_text())


def _component_contribution(child_build: dict[str, Any], grams: float) -> dict[str, float]:
    """Return per-nutrient contribution of `grams` of an already-cooked child component.

    The child's per100g panel is treated as the authoritative nutrient density of
    the cooked product. We multiply by grams/100 — no retention, no yield.
    """
    p100 = child_build.get("per100g", {})
    scale = grams / 100.0
    return {n: float(p100.get(n, 0.0)) * scale for n in EXTENDED_NUTRIENTS}


def build_recipe(
    recipe: Recipe,
    ingredient_rows: list[IngredientRow],
    ledger: dict[str, LedgerEntry],
    nutrients_by_ndb: dict[str, dict[str, float]] | None = None,
    sections: list[Section] | None = None,
) -> dict[str, Any]:
    """Build a single recipe. Returns the v3 build JSON dict.

    When ``sections`` is None or empty, the build runs the original single-
    section math (byte-identical with pre-Phase-8b output). When sections
    are provided, retention and yield are applied per-section and summed
    (see docs/v3.md §18).
    """
    if nutrients_by_ndb is None:
        ndb_set = set()
        for row in ingredient_rows:
            entry = ledger.get(row.ingredient_key)
            if entry:
                ndb_set.add(entry.ndb_no)
        nutrients_by_ndb = load_comboo_nutrients(ndb_set)

    if sections:
        return _build_recipe_multi(recipe, ingredient_rows, ledger, nutrients_by_ndb, sections)
    return _build_recipe_single(recipe, ingredient_rows, ledger, nutrients_by_ndb)


def _build_recipe_single(
    recipe: Recipe,
    ingredient_rows: list[IngredientRow],
    ledger: dict[str, LedgerEntry],
    nutrients_by_ndb: dict[str, dict[str, float]],
) -> dict[str, Any]:
    """Original single-section pipeline. Preserved byte-identical for
    backward compatibility (acceptance gate per §18.3)."""
    ingredient_breakdown: list[dict[str, Any]] = []
    sums: dict[str, float] = {n: 0.0 for n in EXTENDED_NUTRIENTS}
    raw_total_grams = 0.0
    raw_water = 0.0
    raw_fat = 0.0
    sum_added_sugar = 0.0
    sum_intrinsic_sugar = 0.0
    skipped: list[dict[str, str]] = []

    for row in ingredient_rows:
        # is_optional means "cook may omit" — excluded from nutrition math
        # so the canonical nutrition panel reflects the base recipe only.
        # Display-only: the moderator UI still shows optional ingredients.
        if row.is_optional:
            skipped.append({"ingredient_key": row.ingredient_key, "reason": "optional"})
            continue
        # Phase 8c: component-ref ingredient (@<child_id>) — load child build,
        # contribute child.per100g[N] × grams/100 directly. Bypasses ledger/NDB
        # lookup, retention, and yield (child already applied them).
        if is_component_ref(row.ingredient_key):
            cid = child_recipe_id(row.ingredient_key)
            child = _load_child_build(cid)
            p100 = child.get("per100g", {})
            effective_grams = row.grams * row.retained_fraction
            scale = effective_grams / 100.0
            raw_total_grams += effective_grams
            raw_water += float(p100.get("Water", 0.0)) * scale
            raw_fat += float(p100.get("TotalLipidFat", 0.0)) * scale
            contrib_full: dict[str, float] = {}
            for n in EXTENDED_NUTRIENTS:
                c = float(p100.get(n, 0.0)) * scale
                contrib_full[n] = c
                sums[n] += c
            # Added/intrinsic sugars come straight from the child (already split).
            sum_added_sugar += float(p100.get("AddedSugars", 0.0)) * scale
            sum_intrinsic_sugar += float(p100.get("IntrinsicSugars", 0.0)) * scale
            ingredient_breakdown.append({
                "ingredient_key": row.ingredient_key,
                "component_ref": cid,
                "ndb_no": "",
                "long_desc": child.get("recipe_name", cid),
                "grams": _round(row.grams, 2),
                "effective_grams": _round(effective_grams, 2),
                "is_discarded": row.is_discarded,
                "discard_percent": _round(row.discard_percent, 2),
                "section": row.section,
                "ingredient_group": row.ingredient_group,
                "qty_display": row.qty_display,
                "contribution": {m: _round(contrib_full.get(m, 0.0), 3) for m in MACROS},
                "sugar_policy": "component",
                "added_sugar_g": _round(float(p100.get("AddedSugars", 0.0)) * scale, 3),
                "intrinsic_sugar_g": _round(float(p100.get("IntrinsicSugars", 0.0)) * scale, 3),
            })
            continue
        entry = ledger.get(row.ingredient_key)
        if not entry:
            skipped.append({"ingredient_key": row.ingredient_key, "reason": "missing_ledger"})
            continue
        nuts = nutrients_by_ndb.get(entry.ndb_no)
        if not nuts:
            skipped.append({"ingredient_key": row.ingredient_key, "reason": f"missing_ndb_{entry.ndb_no}"})
            continue

        effective_grams = row.grams * row.retained_fraction
        scale = effective_grams / 100.0
        raw_total_grams += effective_grams
        raw_water += nuts.get("Water", 0.0) * scale
        raw_fat += nuts.get("TotalLipidFat", 0.0) * scale

        contrib_full: dict[str, float] = {}
        for n in EXTENDED_NUTRIENTS:
            c = nuts.get(n, 0.0) * scale
            contrib_full[n] = c
            sums[n] += c

        long_desc = str(nuts.get("_long_desc", entry.default_long_desc))
        policy, _est = classify(entry.ndb_no, long_desc)
        ing_sugar = contrib_full.get("SugarsTotal", 0.0)
        added_g, intrinsic_g = split_sugar(ing_sugar, policy)
        sum_added_sugar += added_g
        sum_intrinsic_sugar += intrinsic_g

        ingredient_breakdown.append({
            "ingredient_key": row.ingredient_key,
            "ndb_no": entry.ndb_no,
            "long_desc": entry.default_long_desc,
            "grams": _round(row.grams, 2),
            "effective_grams": _round(effective_grams, 2),
            "is_discarded": row.is_discarded,
            "discard_percent": _round(row.discard_percent, 2),
            "section": row.section,
            "ingredient_group": row.ingredient_group,
            "qty_display": row.qty_display,
            "contribution": {m: _round(contrib_full.get(m, 0.0), 3) for m in MACROS},
            "sugar_policy": policy.get("policy", "none_added"),
            "added_sugar_g": _round(added_g, 3),
            "intrinsic_sugar_g": _round(intrinsic_g, 3),
        })

    if raw_total_grams <= 0:
        raise RuntimeError(f"Recipe {recipe.recipe_id} has no usable ingredients")

    method = normalize_cooking_method(recipe.cooking_method)
    yfw = recipe.yield_factor_water
    yff = recipe.yield_factor_fat
    yfp = recipe.yield_factor_protein
    yfc = recipe.yield_factor_carbohydrate
    yfo = recipe.yield_factor_other
    yfi = recipe.yield_factor_fiber

    retained: dict[str, float] = {}
    for n in EXTENDED_NUTRIENTS:
        if n == "Water":
            retained[n] = sums[n] * yfw
        elif n == "TotalLipidFat":
            retained[n] = sums[n] * yff
        elif n == "Protein":
            retained[n] = sums[n] * yfp
        elif n == "Carbohydrate":
            retained[n] = sums[n] * yfc
        elif n == "FiberTotalDietary":
            retained[n] = sums[n] * yfi
        elif n in _MACRO_SET:
            retained[n] = sums[n]
        elif n in _FAT_SOLUBLE_NUTRIENTS:
            retained[n] = sums[n] * get_retention(method, n) * yfo
        else:
            retained[n] = sums[n] * get_retention(method, n)

    # When fat, protein, or carbs drain out (yff/yfp/yfc < 1), the raw
    # Energy_KCal from the database overcounts calories. Recompute from Atwater.
    if yff < 1.0 or yfp < 1.0 or yfc < 1.0:
        retained["Energy_KCal"] = (
            retained.get("Protein", 0.0)       * 4.0
            + retained.get("TotalLipidFat", 0.0) * 9.0
            + retained.get("Carbohydrate", 0.0)  * 4.0
        )

    sugar_retention = get_retention(method, "SugarsTotal")
    retained_added = sum_added_sugar * sugar_retention
    retained_intrinsic = sum_intrinsic_sugar * sugar_retention

    final_grams = cooked_total_grams(raw_total_grams, raw_water, raw_fat, yfw, yff, sums.get("Protein", 0.0), yfp, sums.get("Carbohydrate", 0.0), yfc, sums.get("FiberTotalDietary", 0.0), yfi)
    grams_per_serving = final_grams / recipe.servings_count
    per100g_scale = 100.0 / final_grams
    serving_scale = grams_per_serving / 100.0

    per100g: dict[str, float] = {}
    per_serving: dict[str, float] = {}
    for n in EXTENDED_NUTRIENTS:
        v100 = retained[n] * per100g_scale
        per100g[n] = _round(v100, 2)
        per_serving[n] = _round(v100 * serving_scale, 2)

    o3_per100, o6_per100 = _derive_omegas(per100g)
    per100g["omega3"] = _round(o3_per100, 2)
    per100g["omega6"] = _round(o6_per100, 2)
    per_serving["omega3"] = _round(o3_per100 * serving_scale, 2)
    per_serving["omega6"] = _round(o6_per100 * serving_scale, 2)

    added_per100 = retained_added * per100g_scale
    intrinsic_per100 = retained_intrinsic * per100g_scale
    per100g["AddedSugars"] = _round(added_per100, 2)
    per100g["IntrinsicSugars"] = _round(intrinsic_per100, 2)
    per_serving["AddedSugars"] = _round(added_per100 * serving_scale, 2)
    per_serving["IntrinsicSugars"] = _round(intrinsic_per100 * serving_scale, 2)

    return {
        "recipe_id": recipe.recipe_id,
        "recipe_name": recipe.recipe_name,
        "sr_rule": recipe.sr_rule,
        "canonical_ndb_no": recipe.canonical_ndb_no,
        "cooking_method": recipe.cooking_method,
        "cooking_method_normalized": method,
        "yield_factor_water": yfw,
        "yield_factor_fat": yff,
        "yield_factor_protein": yfp,
        "yield_factor_carbohydrate": yfc,
        "yield_factor_fiber": yfi,
        "servings_count": recipe.servings_count,
        "audit_status": recipe.audit_status,
        "audit_notes": recipe.audit_notes,
        "raw_total_grams": _round(raw_total_grams, 2),
        "raw_water_grams": _round(raw_water, 2),
        "raw_fat_grams": _round(raw_fat, 2),
        "raw_protein_grams": _round(sums.get("Protein", 0.0), 2),
        "raw_carb_grams": _round(sums.get("Carbohydrate", 0.0), 2),
        "water_lost_grams": _round(raw_water * (1 - yfw), 2),
        "fat_lost_grams": _round(raw_fat * (1 - yff), 2),
        "protein_lost_grams": _round(sums.get("Protein", 0.0) * (1 - yfp), 2),
        "carb_lost_grams": _round(sums.get("Carbohydrate", 0.0) * (1 - yfc), 2),
        "fiber_lost_grams": _round(sums.get("FiberTotalDietary", 0.0) * (1 - yfi), 2),
        "cooked_total_grams": _round(final_grams, 2),
        "grams_per_serving": _round(grams_per_serving, 2),
        "ingredients": ingredient_breakdown,
        "skipped_ingredients": skipped,
        "per100g": per100g,
        "per_serving": per_serving,
    }


def _build_recipe_multi(
    recipe: Recipe,
    ingredient_rows: list[IngredientRow],
    ledger: dict[str, LedgerEntry],
    nutrients_by_ndb: dict[str, dict[str, float]],
    sections: list[Section],
) -> dict[str, Any]:
    """Per-section retention + yield accumulator (Phase 8b, see §18.2).

    Each section S has its own cooking_method and yield factors. We:
      1. Group ingredients by section_key.
      2. Compute per-section sums, retention, yield, and final mass.
      3. Sum retained nutrients across sections; sum final masses.
      4. Convert to per-100g of the cooked dish.

    Validator (§18.4 rule 5/6) guarantees every ingredient's section value
    matches one of the section_keys before this function is called.
    """
    sections_by_key = {s.section_key: s for s in sections}
    primary_method_raw = recipe.cooking_method
    primary_method_norm = normalize_cooking_method(primary_method_raw) if primary_method_raw not in ("", "raw", "multi") else "raw"
    primary_stage_rows = [
        {
            "stage": 1,
            "method_raw": recipe.cooking_method,
            "method_norm": primary_method_norm,
            "minutes": recipe.cook_minutes,
            "temp_f": recipe.cook_temp_f,
            "fill_class": recipe.fill_class,
        },
        {
            "stage": 2,
            "method_raw": recipe.cook2_method,
            "method_norm": normalize_cooking_method(recipe.cook2_method) if recipe.cook2_method else "raw",
            "minutes": recipe.cook2_minutes,
            "temp_f": recipe.cook2_temp_f,
            "fill_class": recipe.cook2_fill_class,
        },
        {
            "stage": 3,
            "method_raw": recipe.cook3_method,
            "method_norm": normalize_cooking_method(recipe.cook3_method) if recipe.cook3_method else "raw",
            "minutes": recipe.cook3_minutes,
            "temp_f": recipe.cook3_temp_f,
            "fill_class": recipe.cook3_fill_class,
        },
    ]
    primary_stages = [s for s in primary_stage_rows if s["method_norm"] != "raw"]
    use_primary_cook_for_raw_sections = (
        primary_method_norm != "raw"
        and all(normalize_cooking_method(s.cook_method) == "raw" for s in sections if s.prep_method != "finish")
    )

    def _primary_entry_stage(section: Section) -> int:
        try:
            value = int(float(section.primary_entry_stage or "1"))
        except ValueError:
            return 1
        return 1 if value < 2 else min(value, 3)

    def _active_primary_stages(section: Section) -> list[dict[str, Any]]:
        entry_stage = _primary_entry_stage(section)
        return [s for s in primary_stages if s["stage"] >= entry_stage]

    def _uses_primary_timeline(section: Section) -> bool:
        if section.prep_method == "finish" or not primary_stages:
            return False
        method_norm = normalize_cooking_method(section.cook_method)
        return _primary_entry_stage(section) > 1 or use_primary_cook_for_raw_sections or method_norm in {s["method_norm"] for s in primary_stages}

    def _primary_stages(section: Section) -> list[tuple[int, int]]:
        if _uses_primary_timeline(section):
            stages = []
            for stage in _active_primary_stages(section):
                if stage["temp_f"] and stage["minutes"]:
                    stages.append((stage["temp_f"], stage["minutes"]))
            if stages:
                return stages
        if section.cook_stages:
            return _parse_stages(section.cook_stages)
        if use_primary_cook_for_raw_sections and recipe.cook_temp_f and recipe.cook_minutes:
            return [(recipe.cook_temp_f, recipe.cook_minutes)]
        return []

    def _primary_fill_class(section: Section) -> str:
        if section.filling_class:
            return section.filling_class
        if _uses_primary_timeline(section):
            for stage in _active_primary_stages(section):
                if stage["fill_class"]:
                    return stage["fill_class"]
        if recipe.fill_class and _primary_entry_stage(section) == 1:
            return recipe.fill_class
        if use_primary_cook_for_raw_sections and primary_method_norm == "baked":
            text = f"{section.section_key} {section.section_label}".lower()
            if any(token in text for token in ("crust", "pastry", "shell", "wrapper")):
                return "pastry"
        return "none"

    # Per-section accumulators
    sec_state: dict[str, dict[str, Any]] = {
        s.section_key: {
            "section": s,
            "sums": {n: 0.0 for n in EXTENDED_NUTRIENTS},
            "raw_total": 0.0,
            "raw_water": 0.0,
            "raw_fat": 0.0,
            "raw_protein": 0.0,
            "raw_carb": 0.0,
            "raw_fiber": 0.0,
            "added_sugar": 0.0,
            "intrinsic_sugar": 0.0,
            "ingredient_count": 0,
            # List of (grams, absorption_factor) for submersion-boil absorbers
            # (pasta, rice, oats, legumes). Populated from DataCentralCombo.bin.
            "absorbers": [],
            # List of (fat_contrib_g, fat_drain_factor) for ingredients whose fat
            # renders and drains during cooking (e.g. raw bacon, ground beef).
            # Populated from ingredients_ledger.csv::fat_drain.
            "fat_drainers": [],
            # List of (water_contrib_g, boil_yfw) for raw vegetables that change
            # water content when submerged-boiled. Populated from DataCentralCombo.boil_yfw.
            "boil_yfw_ingredients": [],
            # List of (dry_g, strain_retain) for ingredients that pass partially through
            # a fine strainer/cheesecloth when pressed. Populated from DataCentralCombo.strain_retain.
            # Used by build.py strained model to auto-derive yfw/yff/yfp/yfc.
            "strain_ingredients": [],
        }
        for s in sections
    }

    ingredient_breakdown: list[dict[str, Any]] = []
    skipped: list[dict[str, str]] = []

    for row in ingredient_rows:
        # is_optional means "cook may omit" — excluded from nutrition math.
        if row.is_optional:
            skipped.append({"ingredient_key": row.ingredient_key, "reason": "optional"})
            continue
        # Phase 8c: component-ref ingredient (@<child_id>).
        if is_component_ref(row.ingredient_key):
            # Phase 8d: cook_section overrides section for nutrient math (display uses section).
            math_section = row.cook_section if row.cook_section else row.section
            if math_section not in sec_state:
                raise RuntimeError(
                    f"Recipe {recipe.recipe_id}: component-ref {row.ingredient_key} has "
                    f"cook_section/section={math_section!r} but no matching section_key in recipe_sections.csv"
                )
            cid = child_recipe_id(row.ingredient_key)
            child = _load_child_build(cid)
            p100 = child.get("per100g", {})
            st = sec_state[math_section]
            effective_grams = row.grams * row.retained_fraction
            scale = effective_grams / 100.0
            st["raw_total"] += effective_grams
            st["raw_water"] += float(p100.get("Water", 0.0)) * scale
            st["raw_fat"] += float(p100.get("TotalLipidFat", 0.0)) * scale
            st["raw_protein"] += float(p100.get("Protein", 0.0)) * scale
            st["raw_carb"] += float(p100.get("Carbohydrate", 0.0)) * scale
            st["raw_fiber"] += float(p100.get("FiberTotalDietary", 0.0)) * scale
            if effective_grams > 0:
                st["ingredient_count"] += 1
            contrib_full: dict[str, float] = {}
            for n in EXTENDED_NUTRIENTS:
                c = float(p100.get(n, 0.0)) * scale
                contrib_full[n] = c
                st["sums"][n] += c
            st["added_sugar"] += float(p100.get("AddedSugars", 0.0)) * scale
            st["intrinsic_sugar"] += float(p100.get("IntrinsicSugars", 0.0)) * scale
            ingredient_breakdown.append({
                "ingredient_key": row.ingredient_key,
                "component_ref": cid,
                "ndb_no": "",
                "long_desc": child.get("recipe_name", cid),
                "grams": _round(row.grams, 2),
                "effective_grams": _round(effective_grams, 2),
                "is_discarded": row.is_discarded,
                "discard_percent": _round(row.discard_percent, 2),
                "section": row.section,
                "ingredient_group": row.ingredient_group,
                "qty_display": row.qty_display,
                "contribution": {m: _round(contrib_full.get(m, 0.0), 3) for m in MACROS},
                "sugar_policy": "component",
                "added_sugar_g": _round(float(p100.get("AddedSugars", 0.0)) * scale, 3),
                "intrinsic_sugar_g": _round(float(p100.get("IntrinsicSugars", 0.0)) * scale, 3),
            })
            continue
        entry = ledger.get(row.ingredient_key)
        if not entry:
            skipped.append({"ingredient_key": row.ingredient_key, "reason": "missing_ledger"})
            continue
        nuts = nutrients_by_ndb.get(entry.ndb_no)
        if not nuts:
            skipped.append({"ingredient_key": row.ingredient_key, "reason": f"missing_ndb_{entry.ndb_no}"})
            continue
        if row.section not in sec_state:
            raise RuntimeError(
                f"Recipe {recipe.recipe_id}: ingredient {row.ingredient_key} has "
                f"section={row.section!r} but no matching section_key in recipe_sections.csv"
            )
        # Phase 8d: cook_section overrides section for nutrient math (display uses section).
        math_section = row.cook_section if row.cook_section else row.section
        if math_section not in sec_state:
            raise RuntimeError(
                f"Recipe {recipe.recipe_id}: ingredient {row.ingredient_key} has "
                f"cook_section={math_section!r} but no matching section_key in recipe_sections.csv"
            )
        st = sec_state[math_section]
        effective_grams = row.grams * row.retained_fraction
        scale = effective_grams / 100.0
        st["raw_total"] += effective_grams
        st["raw_water"] += nuts.get("Water", 0.0) * scale
        st["raw_fat"] += nuts.get("TotalLipidFat", 0.0) * scale
        st["raw_protein"] += nuts.get("Protein", 0.0) * scale
        st["raw_carb"] += nuts.get("Carbohydrate", 0.0) * scale
        st["raw_fiber"] += nuts.get("FiberTotalDietary", 0.0) * scale
        if effective_grams > 0:
            st["ingredient_count"] += 1

        # Track submersion-boil absorbers (pasta, rice, oats, legumes).
        # _absorption_factor is populated from DataCentralCombo.bin by load_comboo_nutrients().
        absorb_factor = nuts.get("_absorption_factor")
        if absorb_factor is not None:
            st["absorbers"].append((effective_grams, absorb_factor))

        # Track fat-drain ingredients (raw bacon, etc.).
        # fat_drain is the fraction of fat *retained* after cooking (e.g. 0.33 for bacon).
        # Priority: ledger entry.fat_drain > DataCentralCombo._fat_drain > None.
        fat_drain_val = entry.fat_drain if entry.fat_drain is not None else nuts.get("_fat_drain")
        if fat_drain_val is not None:
            fat_contrib_g = nuts.get("TotalLipidFat", 0.0) * scale
            st["fat_drainers"].append((fat_contrib_g, fat_drain_val))

        # Track boiled-vegetable water-retention ingredients.
        # boil_yfw = fraction of this ingredient's water retained after submerged boiling.
        # Derived from USDA raw/cooked NDB pairs; stored in DataCentralCombo.boil_yfw.
        boil_yfw_val = nuts.get("_boil_yfw")
        if boil_yfw_val is not None:
            water_contrib_g = nuts.get("Water", 0.0) * scale
            st["boil_yfw_ingredients"].append((water_contrib_g, boil_yfw_val))

        # Track strained-blend ingredients.
        # strain_retain = fraction of dry solids that passes through pressed cheesecloth.
        # Calibrated from USDA and pressed-extraction data; stored in DataCentralCombo.strain_retain.
        strain_retain_val = nuts.get("_strain_retain")
        if strain_retain_val is not None:
            dry_g = (row.grams - nuts.get("Water", 0.0) * scale)
            fat_g   = nuts.get("TotalLipidFat", 0.0) * scale
            pro_g   = nuts.get("Protein", 0.0) * scale
            carb_g  = nuts.get("Carbohydrate", 0.0) * scale
            st["strain_ingredients"].append((dry_g, fat_g, pro_g, carb_g, strain_retain_val))

        contrib_full: dict[str, float] = {}
        for n in EXTENDED_NUTRIENTS:
            c = nuts.get(n, 0.0) * scale
            contrib_full[n] = c
            st["sums"][n] += c

        long_desc = str(nuts.get("_long_desc", entry.default_long_desc))
        policy, _est = classify(entry.ndb_no, long_desc)
        ing_sugar = contrib_full.get("SugarsTotal", 0.0)
        added_g, intrinsic_g = split_sugar(ing_sugar, policy)
        st["added_sugar"] += added_g
        st["intrinsic_sugar"] += intrinsic_g

        ingredient_breakdown.append({
            "ingredient_key": row.ingredient_key,
            "ndb_no": entry.ndb_no,
            "long_desc": entry.default_long_desc,
            "grams": _round(row.grams, 2),
            "effective_grams": _round(effective_grams, 2),
            "is_discarded": row.is_discarded,
            "discard_percent": _round(row.discard_percent, 2),
            "section": row.section,
            "ingredient_group": row.ingredient_group,
            "qty_display": row.qty_display,
            "contribution": {m: _round(contrib_full.get(m, 0.0), 3) for m in MACROS},
            "sugar_policy": policy.get("policy", "none_added"),
            "added_sugar_g": _round(added_g, 3),
            "intrinsic_sugar_g": _round(intrinsic_g, 3),
        })

    # Per-section retention + yield -> dish-level totals
    retained_dish: dict[str, float] = {n: 0.0 for n in EXTENDED_NUTRIENTS}
    retained_added_dish = 0.0
    retained_intrinsic_dish = 0.0
    final_grams = 0.0
    raw_total_grams = 0.0
    raw_water = 0.0
    raw_fat = 0.0
    sections_out: list[dict[str, Any]] = []

    for sec_key in (s.section_key for s in sections):
        st = sec_state[sec_key]
        if st["ingredient_count"] == 0:
            # Empty section is allowed (no ingredients assigned) — skip its mass/retention.
            sections_out.append({
                "section_key": sec_key,
                "section_label": st["section"].section_label,
                "prep_method": st["section"].prep_method,
                "cook_method": st["section"].cook_method,
                "cooking_method": st["section"].cook_method,  # backward-compat
                "ingredient_count": 0,
                "raw_grams": 0.0,
                "final_grams": 0.0,
            })
            continue

        s = st["section"]
        method = normalize_cooking_method(s.cook_method)
        uses_primary_cook = use_primary_cook_for_raw_sections and method == "raw" and s.prep_method != "finish"
        effective_method = primary_method_norm if uses_primary_cook else method
        # Two-pass retention: if prep_method is a real cook step (not raw/empty)
        # AND different from cook_method, apply prep retention first, then
        # cook_method retention. Macros (in _MACRO_SET) are handled via yield
        # factors — unaffected. Only micronutrients receive the chained factors.
        _prep_norm = normalize_cooking_method(s.prep_method) if s.prep_method else 'raw'
        _has_prep = _prep_norm not in ('raw',) and _prep_norm != effective_method
        _stages_for_yield = _primary_stages(s)
        _filling_class_for_yield = _primary_fill_class(s)
        # ── Yield factor for water ─────────────────────────────────────────
        # Priority order:
        #   1. Submersion-boil absorption model — fires when cook_method=boiled
        #      and the section contains dry absorbers (pasta, rice, oats, beans).
        #   1b. Boiled-vegetable water-retention model — fires when cook_method=boiled
        #      and the section contains raw vegetables with a numeric boil_yfw.
        #   1c. Strained-blend model — fires when filling_class='strained' AND the
        #      section contains ingredients with _strain_retain. Computes yfw from
        #      STRAIN_WATER_K (water absorbed per gram of discarded dry solids) AND
        #      also auto-derives yff/yfp/yfc/yfo from per-ingredient strain_retain.
        #   2. Manual yield_factor_water override from recipe_sections.csv.
        #   3. Physics-based evaporation model (calc_yield_water).
        #   4. Default yfw=1.0 (no water change).
        _strained = (s.filling_class == 'strained' and bool(st["strain_ingredients"]))
        # Stock extraction: must run BEFORE absorber / boil_yfw paths because stocks
        # contain boiled vegetables (which would otherwise trigger the per-ingredient
        # boil_yfw model and yield yfw≈1.0, ignoring the long-simmer evaporation).
        # The binding coefficient captures the net 4–24h reduction; individual
        # vegetable water retention is irrelevant at the stock scale.
        if _filling_class_for_yield in STOCK_EXTRACTION and (_stages_for_yield or s.boil_stages):
            boil_min = float(s.boil_stages) if s.boil_stages else 0.0
            _is_boil_covered = (primary_method_raw if uses_primary_cook else s.cook_method) in ('boil covered', 'boil_covered', 'boil (covered)', 'boiled covered', 'boiled_covered', 'boiled (covered)')
            _boil_temp = _method_stovetop_temp(primary_method_raw if uses_primary_cook else s.cook_method)
            yfw = calc_yield_water(_stages_for_yield, st["raw_water"], _filling_class_for_yield,
                                   boil_minutes=boil_min, boil_temp_f=_boil_temp,
                                   boil_covered=_is_boil_covered)
        elif (_filling_class_for_yield == 'parboiled_long_grain_rice'
              and st["absorbers"]):
            # Long-grain rice is parboiled in excess water, drained, then
            # finishes absorbing during the covered braise. Use the calibrated
            # partial-cook endpoint instead of the full-cook bin factor. The
            # parboil water is supplied by this method, not by an ingredient row.
            absorber_grams = sum(g for g, _ in st["absorbers"])
            parboil_water_g = (
                absorber_grams / PARBOILED_RICE_CUP_GRAMS
                * PARBOILED_RICE_WATER_CUPS_PER_CUP
                * WATER_GRAMS_PER_CUP
            )
            st["raw_total"] += parboil_water_g
            st["raw_water"] += parboil_water_g
            st["sums"]["Water"] += parboil_water_g
            partial_factor = BINDING[_filling_class_for_yield]
            dry_non_water_g = st["raw_total"] - st["raw_water"]
            retained_water_g = dry_non_water_g * partial_factor / (1.0 - partial_factor)
            yfw = retained_water_g / st["raw_water"] if st["raw_water"] > 0 else 1.0
        elif effective_method == 'boiled' and st["absorbers"]:
            total_absorber_g = sum(g for g, _ in st["absorbers"])
            weighted_factor  = sum(g * f for g, f in st["absorbers"]) / total_absorber_g
            dry_non_water_g  = st["raw_total"] - st["raw_water"]
            if st["raw_water"] > 0 and weighted_factor < 1.0:
                retained_water_g = dry_non_water_g * weighted_factor / (1.0 - weighted_factor)
                yfw = retained_water_g / st["raw_water"]
            else:
                yfw = 1.0
        elif _filling_class_for_yield and (_stages_for_yield or s.boil_stages):
            # Explicit fill_class takes priority over the per-vegetable boil_yfw model.
            # If the recipe author set a fill_class (e.g. simmer_sauce), use the physics
            # evaporation model rather than the ingredient-level vegetable retention
            # fallback. This ensures stewed dishes with okra/other absorbing veg still
            # correctly reduce under a simmer_sauce binding. (July 2026)
            boil_min = float(s.boil_stages) if s.boil_stages else 0.0
            _boil_method = s.prep_method if s.prep_method and _prep_norm not in ('raw',) else (primary_method_raw if uses_primary_cook else s.cook_method)
            _is_bake_covered = _boil_method in ('bake covered', 'bake_covered', 'baked covered')
            _is_boil_covered = _boil_method in ('boil covered', 'boil_covered', 'boil (covered)', 'boiled covered', 'boiled_covered', 'boiled (covered)')
            _boil_temp = _method_stovetop_temp(
                _boil_method,
                bake_covered_temp=(_stages_for_yield[0][0] if _stages_for_yield else 350.0) if _is_bake_covered else None,
            )
            _boil_covered = _boil_method in ('braise', 'braised') or _is_bake_covered or _is_boil_covered
            yfw = calc_yield_water(_stages_for_yield, st["raw_water"], _filling_class_for_yield,
                                   boil_minutes=boil_min, boil_temp_f=_boil_temp,
                                   boil_covered=_boil_covered)
        elif s.yield_factor_water is not None:
            # Explicit lock takes priority over the ingredient-level boil_yfw fallback.
            # Locks are set on unconverted sections pending fill_class + stages authoring.
            yfw = s.yield_factor_water
        elif effective_method == 'boiled' and st["boil_yfw_ingredients"]:
            # Fallback per-vegetable water-retention model — fires only when no
            # explicit fill_class is set. (Moved below fill_class check July 2026.)
            total_water = st["raw_water"]
            if total_water > 0:
                veg_water = sum(w for w, _ in st["boil_yfw_ingredients"])
                non_veg_water = total_water - veg_water
                retained = sum(w * y for w, y in st["boil_yfw_ingredients"]) + non_veg_water
                yfw = retained / total_water
            else:
                yfw = 1.0
        elif _strained:
            # Strained-blend model: blended then pressed through cheesecloth.
            from .yield_calc import STRAIN_WATER_K
            total_dry_discarded = sum(d * (1 - r) for d, _, _, _, r in st["strain_ingredients"])
            water_absorbed      = STRAIN_WATER_K * total_dry_discarded
            yfw = max(0.0, (st["raw_water"] - water_absorbed) / st["raw_water"]) if st["raw_water"] > 0 else 1.0
        else:
            yfw = 1.0
        yff = s.yield_factor_fat
        # Auto-derive yff from fat_drain ingredient factors when not explicitly set.
        # If the section has fat-draining ingredients (e.g. raw bacon) and no
        # explicit yield_factor_fat in recipe_sections.csv, compute a weighted yff:
        #   retained_fat = (drainer_fat × fat_drain) + non_drainer_fat
        #   yff = retained_fat / total_fat
        if _strained:
            # Strained-blend model: compute yff/yfp/yfc from per-ingredient strain_retain.
            # Strained ingredients: fraction of each nutrient that passes through the mesh.
            # Non-strained ingredients: all their nutrients pass through (retain=1.0).
            total_fat  = st["sums"].get("TotalLipidFat", 0.0)
            total_pro  = st["sums"].get("Protein", 0.0)
            total_carb = st["sums"].get("Carbohydrate", 0.0)
            ret_fat  = sum(f * r for _, f, _, _, r in st["strain_ingredients"])
            ret_pro  = sum(p * r for _, _, p, _, r in st["strain_ingredients"])
            ret_carb = sum(c * r for _, _, _, c, r in st["strain_ingredients"])
            # Add back contribution from non-strained ingredients (retain=1.0)
            strained_fat  = sum(f for _, f, _, _, _ in st["strain_ingredients"])
            strained_pro  = sum(p for _, _, p, _, _ in st["strain_ingredients"])
            strained_carb = sum(c for _, _, _, c, _ in st["strain_ingredients"])
            ret_fat  += (total_fat  - strained_fat)
            ret_pro  += (total_pro  - strained_pro)
            ret_carb += (total_carb - strained_carb)
            yff = ret_fat  / total_fat  if total_fat  > 0 else 1.0
            yfp_strained = ret_pro   / total_pro   if total_pro   > 0 else 1.0
            yfc_strained = ret_carb  / total_carb  if total_carb  > 0 else 1.0
        elif yff is None:
            total_fat = st["sums"].get("TotalLipidFat", 0.0)
            if st["fat_drainers"] and total_fat > 0:
                drainer_fat_total = sum(f for f, _ in st["fat_drainers"])
                retained_from_drainers = sum(f * d for f, d in st["fat_drainers"])
                retained_from_non_drainers = total_fat - drainer_fat_total
                yff = (retained_from_drainers + retained_from_non_drainers) / total_fat
            else:
                yff = 1.0
        st["resolved_yff"] = yff  # store for fat_lost_total summary below
        yfp = s.yield_factor_protein if not _strained else yfp_strained
        yfc = s.yield_factor_carbohydrate if not _strained else yfc_strained
        yfo_S = s.yield_factor_other
        yfi_S = s.yield_factor_fiber

        # Stock extraction model: when fill_class is a stock class, override
        # yfp/yff/yfc/yfo with calibrated extraction constants. This replaces
        # the load.py default of 1.0 for cleared CSV lock columns.
        _stock_ex = STOCK_EXTRACTION.get(_filling_class_for_yield or "") if not _strained else None
        if _stock_ex:
            yff   = _stock_ex["yff"]
            yfp   = _stock_ex["yfp"]
            yfc   = _stock_ex["yfc"]
            yfo_S = _stock_ex["yfo"]
        sums_S = st["sums"]
        retained_S: dict[str, float] = {}
        for n in EXTENDED_NUTRIENTS:
            if n == "Water":
                retained_S[n] = sums_S[n] * yfw
            elif n == "TotalLipidFat":
                retained_S[n] = sums_S[n] * yff
            elif n == "Protein":
                retained_S[n] = sums_S[n] * yfp
            elif n == "Carbohydrate":
                retained_S[n] = sums_S[n] * yfc
            elif n == "FiberTotalDietary":
                retained_S[n] = sums_S[n] * yfi_S
            elif n in _MACRO_SET:
                retained_S[n] = sums_S[n]
            elif n in _FAT_SOLUBLE_NUTRIENTS:
                retained_S[n] = sums_S[n] * (get_retention(_prep_norm, n) if _has_prep else 1.0) * get_retention(effective_method, n) * yfo_S
            else:
                retained_S[n] = sums_S[n] * (get_retention(_prep_norm, n) if _has_prep else 1.0) * get_retention(effective_method, n)
            retained_dish[n] += retained_S[n]

        # When fat, protein, or carbs drain out (yff/yfp/yfc < 1), patch
        # Energy_KCal from Atwater — calories that left with the drained mass
        # must not be counted.
        if yff < 1.0 or yfp < 1.0 or yfc < 1.0:
            atwater_S = (
                retained_S.get("Protein", 0.0)       * 4.0
                + retained_S.get("TotalLipidFat", 0.0) * 9.0
                + retained_S.get("Carbohydrate", 0.0)  * 4.0
            )
            retained_dish["Energy_KCal"] += atwater_S - retained_S["Energy_KCal"]
            retained_S["Energy_KCal"] = atwater_S

        sugar_retention_S = get_retention(effective_method, "SugarsTotal")
        retained_added_dish += st["added_sugar"] * sugar_retention_S
        retained_intrinsic_dish += st["intrinsic_sugar"] * sugar_retention_S

        final_S = cooked_total_grams(st["raw_total"], st["raw_water"], st["raw_fat"], yfw, yff, st["raw_protein"], yfp, st["raw_carb"], yfc, st["raw_fiber"], yfi_S)
        final_grams += final_S
        raw_total_grams += st["raw_total"]
        raw_water += st["raw_water"]
        raw_fat += st["raw_fat"]

        _parsed_stages = _parse_stages(s.cook_stages) if s.cook_stages else []
        section_out = {
            "section_key": sec_key,
            "section_label": s.section_label,
            "prep_method": s.prep_method,
            "cook_method": s.cook_method,
            "cooking_method": s.cook_method,  # backward-compat
            "cooking_method_normalized": method,
            "effective_cooking_method_normalized": effective_method,
            "yield_factor_water": yfw,
            "yield_factor_fat": yff,
            "yield_factor_protein": yfp,
            "yield_factor_carbohydrate": yfc,
            "yield_factor_fiber": yfi_S,
            "yield_factor_other": s.yield_factor_other,
            "ingredient_count": st["ingredient_count"],
            "raw_grams": _round(st["raw_total"], 2),
            "raw_water_grams": _round(st["raw_water"], 2),
            "raw_fat_grams": _round(st["raw_fat"], 2),
            "raw_protein_grams": _round(st["raw_protein"], 2),
            "raw_carb_grams": _round(st["raw_carb"], 2),
            "raw_fiber_grams": _round(st["raw_fiber"], 2),
            "final_grams": _round(final_S, 2),
            # Section physics metadata for the edit form (v3-build API path).
            "boil_minutes": float(s.boil_stages) if s.boil_stages else 0,
            "cook_stages": [{"tempF": t, "minutes": m} for t, m in _parsed_stages],
            "fill_class": s.filling_class or "",
        }
        if s.primary_entry_stage:
            section_out["primary_entry_stage"] = s.primary_entry_stage
        sections_out.append(section_out)

    if raw_total_grams <= 0:
        raise RuntimeError(f"Recipe {recipe.recipe_id} has no usable ingredients")

    final_grams = max(final_grams, 1.0)
    grams_per_serving = final_grams / recipe.servings_count
    per100g_scale = 100.0 / final_grams
    serving_scale = grams_per_serving / 100.0

    per100g: dict[str, float] = {}
    per_serving: dict[str, float] = {}
    for n in EXTENDED_NUTRIENTS:
        v100 = retained_dish[n] * per100g_scale
        per100g[n] = _round(v100, 2)
        per_serving[n] = _round(v100 * serving_scale, 2)

    o3_per100, o6_per100 = _derive_omegas(per100g)
    per100g["omega3"] = _round(o3_per100, 2)
    per100g["omega6"] = _round(o6_per100, 2)
    per_serving["omega3"] = _round(o3_per100 * serving_scale, 2)
    per_serving["omega6"] = _round(o6_per100 * serving_scale, 2)

    added_per100 = retained_added_dish * per100g_scale
    intrinsic_per100 = retained_intrinsic_dish * per100g_scale
    per100g["AddedSugars"] = _round(added_per100, 2)
    per100g["IntrinsicSugars"] = _round(intrinsic_per100, 2)
    per_serving["AddedSugars"] = _round(added_per100 * serving_scale, 2)
    per_serving["IntrinsicSugars"] = _round(intrinsic_per100 * serving_scale, 2)

    # Recipe-level cooking_method label: if all sections share one cook_method, use it;
    # otherwise emit "multi" (see §18.5). Uses cook_method (the retention driver),
    # not prep_method (the authoring label).
    # Phase 8c: composite recipes (any section sourced from a child build) are always
    # labelled "multi" even if every wrapper section reads cook_method=raw, so the UI
    # presents them as assembled dishes rather than a single raw food.
    has_composite_section = any(s.source_recipe for s in sections)
    # Finish sections (prep_method='finish') are "added after cooking" — their
    # cook_method='raw' must not bleed into the dish-level method label. Exclude
    # them so recipes like Croque Madame (finish egg) and Hot Brown (finish bacon)
    # correctly label as 'braise' / 'broil' rather than 'multi'.
    methods_used = sorted({s.cook_method for s in sections if s.prep_method != 'finish'})
    if (
        recipe.cooking_method not in ("raw", "multi", "")
        and recipe.cooking_method in methods_used
    ):
        # Declared primary cook method always wins — even for composite recipes
        # that reference a stock/sauce child (has_composite_section=True). Those
        # recipes are still simmered / baked / etc.; the component ref is just an
        # ingredient, not a structural assembly. Only fall through to the composite
        # 'multi' label when no primary method is declared.
        dish_method_label = recipe.cooking_method
    elif has_composite_section:
        # Phase 8c: composite recipes with no declared top-bar cook method are
        # labelled "multi" so the UI presents them as assembled dishes rather
        # than a single raw food.
        dish_method_label = "multi"
    elif (
        len(methods_used) == 1
        and methods_used[0] == "raw"
        and recipe.cooking_method not in ("raw", "multi", "")
    ):
        # All sections are assembly-only (cook_method=raw) but the recipe has a
        # whole-dish cook in recipes.csv (e.g. quiche: crust + filling each assembled
        # raw, then the whole quiche bakes at 375 °F).  Preserve the recipe-level
        # cooking_method so the primary cook bar in the edit form shows correctly.
        dish_method_label = recipe.cooking_method
    else:
        dish_method_label = methods_used[0] if len(methods_used) == 1 else "multi"
    dish_method_normalized = (
        normalize_cooking_method(dish_method_label) if dish_method_label != "multi" else "multi"
    )
    # Dish-level water-lost / fat-lost / protein-lost are sums of per-section losses.
    # Use resolved yfw from sections_out (not section.yield_factor_water, which may be None
    # for algorithm-derived sections).
    water_lost_total = sum(
        sec["raw_water_grams"] * (1 - sec["yield_factor_water"])
        for sec in sections_out if sec.get("ingredient_count", 0) > 0 and "yield_factor_water" in sec
    )
    fat_lost_total = sum(
        st["raw_fat"] * (1 - st.get("resolved_yff", 1.0))
        for st in sec_state.values() if st["ingredient_count"] > 0
    )
    protein_lost_total = sum(
        st["raw_protein"] * (1 - st["section"].yield_factor_protein)
        for st in sec_state.values() if st["ingredient_count"] > 0
    )
    carb_lost_total = sum(
        st["raw_carb"] * (1 - st["section"].yield_factor_carbohydrate)
        for st in sec_state.values() if st["ingredient_count"] > 0
    )
    fiber_lost_total = sum(
        st["raw_fiber"] * (1 - st["section"].yield_factor_fiber)
        for st in sec_state.values() if st["ingredient_count"] > 0
    )
    raw_protein_total = sum(
        st["raw_protein"] for st in sec_state.values()
    )
    raw_carb_total = sum(
        st["raw_carb"] for st in sec_state.values()
    )
    raw_fiber_total = sum(
        st["raw_fiber"] for st in sec_state.values()
    )

    return {
        "recipe_id": recipe.recipe_id,
        "recipe_name": recipe.recipe_name,
        "sr_rule": recipe.sr_rule,
        "canonical_ndb_no": recipe.canonical_ndb_no,
        "cooking_method": dish_method_label,
        "cooking_method_normalized": dish_method_normalized,
        "cook_minutes": recipe.cook_minutes,
        "cook_temp_f": recipe.cook_temp_f,
        "cook2_method": recipe.cook2_method,
        "cook2_minutes": recipe.cook2_minutes,
        "cook2_temp_f": recipe.cook2_temp_f,
        "cook3_method": recipe.cook3_method,
        "cook3_minutes": recipe.cook3_minutes,
        "cook3_temp_f": recipe.cook3_temp_f,
        "fill_class": recipe.fill_class,
        "cook2_fill_class": recipe.cook2_fill_class,
        "cook3_fill_class": recipe.cook3_fill_class,
        "yield_factor_water": recipe.yield_factor_water,
        "yield_factor_fat": recipe.yield_factor_fat,
        "yield_factor_protein": recipe.yield_factor_protein,
        "yield_factor_carbohydrate": recipe.yield_factor_carbohydrate,
        "yield_factor_fiber": recipe.yield_factor_fiber,
        "servings_count": recipe.servings_count,
        "audit_status": recipe.audit_status,
        "audit_notes": recipe.audit_notes,
        "raw_total_grams": _round(raw_total_grams, 2),
        "raw_water_grams": _round(raw_water, 2),
        "raw_fat_grams": _round(raw_fat, 2),
        "raw_protein_grams": _round(raw_protein_total, 2),
        "raw_carb_grams": _round(raw_carb_total, 2),
        "raw_fiber_grams": _round(raw_fiber_total, 2),
        "water_lost_grams": _round(water_lost_total, 2),
        "fat_lost_grams": _round(fat_lost_total, 2),
        "protein_lost_grams": _round(protein_lost_total, 2),
        "carb_lost_grams": _round(carb_lost_total, 2),
        "fiber_lost_grams": _round(fiber_lost_total, 2),
        "cooked_total_grams": _round(final_grams, 2),
        "grams_per_serving": _round(grams_per_serving, 2),
        "ingredients": ingredient_breakdown,
        "skipped_ingredients": skipped,
        "per100g": per100g,
        "per_serving": per_serving,
        "sections": sections_out,
    }


# Map full per100g nutrient name -> shorthand key used in nutrition_json.perServing
# (mirrors scripts/upload-dev-recipe.mjs / src/lib/server/calcNutritionSR28.ts).
_SHORTHAND = {
    "Energy_KCal": "cal",
    "Protein": "pro",
    "TotalLipidFat": "fat",
    "Carbohydrate": "carb",
    "FiberTotalDietary": "fib",
    "Water": "h2o",
    "SugarsTotal": "sug",
}


def to_turso_nutrition_json(build: dict[str, Any]) -> dict[str, Any]:
    """Convert a v3 build dict into the Turso ``dev_recipes.nutrition_json`` shape.

    Mirrors the rich shape historically written by scripts/upload-dev-recipe.mjs:
    top-level macro shorthand, perServing, per100g (full panel), addedSugars,
    intrinsicSugars, plus the version/source provenance fields.
    """
    p100 = dict(build["per100g"])
    pserv = dict(build["per_serving"])
    grams_per_serving = build["grams_per_serving"]
    servings = build["servings_count"]

    top: dict[str, Any] = {}
    for full, short in _SHORTHAND.items():
        top[short] = _round1(pserv.get(full, 0.0))

    per_serving_out = {
        "cal": top["cal"],
        "pro": top["pro"],
        "fat": top["fat"],
        "carb": top["carb"],
        "fib": top["fib"],
        "h2o": top["h2o"],
        "sug": top["sug"],
        "AddedSugars": _round1(pserv.get("AddedSugars", 0.0)),
        "IntrinsicSugars": _round1(pserv.get("IntrinsicSugars", 0.0)),
    }

    micros = {
        "vitaminA": p100.get("VitaminA_RAE", 0.0),
        "vitaminC": p100.get("VitaminC_totalAscorbicAcid", 0.0),
        "vitaminD": p100.get("VitaminD", 0.0),
        "vitaminE": p100.get("VitaminE_alphaTocopherol", 0.0),
        "vitaminK": p100.get("VitaminK_phylloquinone", 0.0),
        "vitaminB6": p100.get("VitaminB6", 0.0),
        "vitaminB12": p100.get("VitaminB12", 0.0),
        "thiamin": p100.get("Thiamin", 0.0),
        "riboflavin": p100.get("Riboflavin", 0.0),
        "niacin": p100.get("Niacin", 0.0),
        "folate": p100.get("Folate_total", 0.0),
        "calcium": p100.get("Calcium_Ca", 0.0),
        "iron": p100.get("Iron_Fe", 0.0),
        "magnesium": p100.get("Magnesium_Mg", 0.0),
        "phosphorus": p100.get("Phosphorus_P", 0.0),
        "potassium": p100.get("Potassium_K", 0.0),
        "sodium": p100.get("Sodium_Na", 0.0),
        "zinc": p100.get("Zinc_Zn", 0.0),
        "copper": p100.get("Copper_Cu", 0.0),
        "selenium": p100.get("Selenium_Se", 0.0),
        "cholesterol": p100.get("Cholesterol", 0.0),
        "saturatedFat": p100.get("FattyAcids_totalSaturated", 0.0),
        "monoFat": p100.get("FattyAcids_totalMonounsaturated", 0.0),
        "polyFat": p100.get("FattyAcids_totalPolyunsaturated", 0.0),
        "omega3": p100.get("omega3", 0.0),
        "omega6": p100.get("omega6", 0.0),
    }

    sources = [
        {
            "ndb": ing["ndb_no"],
            "name": ing.get("long_desc", ""),
            "grams": _round1(ing["grams"] / max(servings, 1)),
        }
        for ing in build["ingredients"]
    ]

    return {
        **top,
        "perServing": per_serving_out,
        "micros": micros,
        "gramsPerServing": _round1(grams_per_serving),
        "servings": servings,
        "per100g": p100,
        "addedSugars": per_serving_out["AddedSugars"],
        "intrinsicSugars": per_serving_out["IntrinsicSugars"],
        "isAddedSugarsEstimated": False,
        "addedSugarsBasis": "v3-classifier",
        "nutrientVersion": "v3",
        "retentionModelVersion": "v3-r6",
        "sourceMatchVersion": "v3-greenfield",
        "sourceNdbNo": build.get("canonical_ndb_no") or "",
        "sourceLongDesc": "",
        "mergeBasis": "v3-build",
        "yieldFactorWater": build["yield_factor_water"],
        "yieldFactorFat": build["yield_factor_fat"],
        "sources": sources,
        **(
            {"sections": build["sections"], "cookingMethod": build.get("cooking_method", ""),
             "cookMinutes": build.get("cook_minutes")}
            if "sections" in build
            else {}
        ),
    }
