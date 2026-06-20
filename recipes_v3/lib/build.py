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
from .yield_calc import calc_yield_water
from .yield_model import cooked_total_grams


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
            scale = row.grams / 100.0
            raw_total_grams += row.grams
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

        scale = row.grams / 100.0
        raw_total_grams += row.grams
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

    final_grams = cooked_total_grams(raw_total_grams, raw_water, raw_fat, yfw, yff, sums.get("Protein", 0.0), yfp, sums.get("Carbohydrate", 0.0), yfc)
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
            "added_sugar": 0.0,
            "intrinsic_sugar": 0.0,
            "ingredient_count": 0,
            # List of (grams, absorption_factor) for submersion-boil absorbers
            # (pasta, rice, oats, legumes). Populated from DataCentralCombo.bin.
            "absorbers": [],
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
            scale = row.grams / 100.0
            st["raw_total"] += row.grams
            st["raw_water"] += float(p100.get("Water", 0.0)) * scale
            st["raw_fat"] += float(p100.get("TotalLipidFat", 0.0)) * scale
            st["raw_protein"] += float(p100.get("Protein", 0.0)) * scale
            st["raw_carb"] += float(p100.get("Carbohydrate", 0.0)) * scale
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
        scale = row.grams / 100.0
        st["raw_total"] += row.grams
        st["raw_water"] += nuts.get("Water", 0.0) * scale
        st["raw_fat"] += nuts.get("TotalLipidFat", 0.0) * scale
        st["raw_protein"] += nuts.get("Protein", 0.0) * scale
        st["raw_carb"] += nuts.get("Carbohydrate", 0.0) * scale
        st["ingredient_count"] += 1

        # Track submersion-boil absorbers (pasta, rice, oats, legumes).
        # _absorption_factor is populated from DataCentralCombo.bin by load_comboo_nutrients().
        absorb_factor = nuts.get("_absorption_factor")
        if absorb_factor is not None:
            st["absorbers"].append((row.grams, absorb_factor))

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
        # ── Yield factor for water ─────────────────────────────────────────
        # Priority order:
        #   1. Submersion-boil absorption model — fires when cook_method=boiled
        #      and the section contains dry absorbers (pasta, rice, oats, beans)
        #      identified by a numeric _absorption_factor in DataCentralCombo.bin.
        #      Conserves dry non-water solids; absorbed water brings cooked
        #      moisture to the ingredient-specific target fraction.
        #   2. Manual yield_factor_water override from recipe_sections.csv.
        #   3. Physics-based evaporation model (calc_yield_water).
        #   4. Default yfw=1.0 (no water change).
        if s.cook_method in ('boiled', 'simmered') and st["absorbers"]:
            total_absorber_g = sum(g for g, _ in st["absorbers"])
            weighted_factor  = sum(g * f for g, f in st["absorbers"]) / total_absorber_g
            dry_non_water_g  = st["raw_total"] - st["raw_water"]
            if st["raw_water"] > 0 and weighted_factor < 1.0:
                retained_water_g = dry_non_water_g * weighted_factor / (1.0 - weighted_factor)
                # yfw may be >> 1.0 when there is no explicit water ingredient
                # (raw_water is only the moisture already in the dry ingredient).
                # cooked_total_grams() handles yfw > 1 correctly:
                # water_lost = raw_water*(1-yfw) becomes negative, i.e. water gained.
                yfw = retained_water_g / st["raw_water"]
            else:
                yfw = 1.0
        elif s.yield_factor_water is not None:
            # Manual override — used for locked recipes and meringue (algorithm doesn't apply).
            yfw = s.yield_factor_water
        elif s.filling_class and (s.cook_stages or s.boil_stages):
            # Derive yield_water from physics-based model.
            # boil_stages fires first (open-pot, BOIL_K_REF), then oven stages.
            # Handles: oven-only, boil-only, and boil-then-bake sequences.
            boil_min = float(s.boil_stages) if s.boil_stages else 0.0
            stages   = _parse_stages(s.cook_stages) if s.cook_stages else []
            yfw = calc_yield_water(stages, st["raw_water"], s.filling_class,
                                   boil_minutes=boil_min)
        else:
            yfw = 1.0
        yff = s.yield_factor_fat
        yfp = s.yield_factor_protein
        yfc = s.yield_factor_carbohydrate
        yfo_S = s.yield_factor_other
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
            elif n in _MACRO_SET:
                retained_S[n] = sums_S[n]
            elif n in _FAT_SOLUBLE_NUTRIENTS:
                retained_S[n] = sums_S[n] * get_retention(method, n) * yfo_S
            else:
                retained_S[n] = sums_S[n] * get_retention(method, n)
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

        sugar_retention_S = get_retention(method, "SugarsTotal")
        retained_added_dish += st["added_sugar"] * sugar_retention_S
        retained_intrinsic_dish += st["intrinsic_sugar"] * sugar_retention_S

        final_S = cooked_total_grams(st["raw_total"], st["raw_water"], st["raw_fat"], yfw, yff, st["raw_protein"], yfp, st["raw_carb"], yfc)
        final_grams += final_S
        raw_total_grams += st["raw_total"]
        raw_water += st["raw_water"]
        raw_fat += st["raw_fat"]

        sections_out.append({
            "section_key": sec_key,
            "section_label": s.section_label,
            "prep_method": s.prep_method,
            "cook_method": s.cook_method,
            "cooking_method": s.cook_method,  # backward-compat
            "cooking_method_normalized": method,
            "yield_factor_water": yfw,
            "yield_factor_fat": yff,
            "yield_factor_protein": yfp,
            "yield_factor_carbohydrate": yfc,
            "yield_factor_other": s.yield_factor_other,
            "ingredient_count": st["ingredient_count"],
            "raw_grams": _round(st["raw_total"], 2),
            "raw_water_grams": _round(st["raw_water"], 2),
            "raw_fat_grams": _round(st["raw_fat"], 2),
            "raw_protein_grams": _round(st["raw_protein"], 2),
            "raw_carb_grams": _round(st["raw_carb"], 2),
            "final_grams": _round(final_S, 2),
        })

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
    methods_used = sorted({s.cook_method for s in sections})
    if has_composite_section:
        dish_method_label = "multi"
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
        st["raw_fat"] * (1 - st["section"].yield_factor_fat)
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
    raw_protein_total = sum(
        st["raw_protein"] for st in sec_state.values()
    )
    raw_carb_total = sum(
        st["raw_carb"] for st in sec_state.values()
    )

    return {
        "recipe_id": recipe.recipe_id,
        "recipe_name": recipe.recipe_name,
        "sr_rule": recipe.sr_rule,
        "canonical_ndb_no": recipe.canonical_ndb_no,
        "cooking_method": dish_method_label,
        "cooking_method_normalized": dish_method_normalized,
        "yield_factor_water": recipe.yield_factor_water,
        "yield_factor_fat": recipe.yield_factor_fat,
        "yield_factor_protein": recipe.yield_factor_protein,
        "yield_factor_carbohydrate": recipe.yield_factor_carbohydrate,
        "servings_count": recipe.servings_count,
        "audit_status": recipe.audit_status,
        "audit_notes": recipe.audit_notes,
        "raw_total_grams": _round(raw_total_grams, 2),
        "raw_water_grams": _round(raw_water, 2),
        "raw_fat_grams": _round(raw_fat, 2),
        "raw_protein_grams": _round(raw_protein_total, 2),
        "raw_carb_grams": _round(raw_carb_total, 2),
        "water_lost_grams": _round(water_lost_total, 2),
        "fat_lost_grams": _round(fat_lost_total, 2),
        "protein_lost_grams": _round(protein_lost_total, 2),
        "carb_lost_grams": _round(carb_lost_total, 2),
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
            {"sections": build["sections"], "cookingMethod": build.get("cooking_method", "")}
            if "sections" in build
            else {}
        ),
    }
