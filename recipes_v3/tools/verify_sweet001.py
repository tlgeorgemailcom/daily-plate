"""Verify the v3 math pipeline for any recipe.

Tests:
  A. Baseline build - section structure, yield, per100g, per_serving
  B. Atwater consistency - Energy ~ 4*Protein + 4*Carb + 9*Fat
  C. Ingredient-change - double the heaviest ingredient, confirm Fat/Energy rise
  D. cook_method vs prepMethod independence (skipped when prep==cook for all sections)

Usage:
    cd recipes_v3
    python3 tools/verify_sweet001.py              # default: SWEET_001
    python3 tools/verify_sweet001.py SWEET_006
    python3 tools/verify_sweet001.py --all        # run every recipe
"""
from __future__ import annotations

import dataclasses
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from lib.build import build_recipe
from lib.load import load_ingredients, load_ledger, load_recipes, load_sections
from lib.retention import get_retention, normalize_cooking_method

PASS = "  PASS"
FAIL = "  FAIL"
FAT  = "TotalLipidFat"
CARB = "Carbohydrate"
KCAL = "Energy_KCal"
PROT = "Protein"
FIBR = "FiberTotalDietary"
SUGR = "SugarsTotal"


def fmt(label: str, value: float, unit: str = "") -> str:
    return f"  {label:<42} {value:>10.4f} {unit}"


def run_build(recipe, ings, ledger, sections):
    return build_recipe(recipe, ings, ledger, sections=sections)


def verify_recipe(recipe_id: str, recipes, all_ings, all_secs, ledger) -> list[str]:
    """Run all checks for one recipe. Returns list of failure messages (empty = all pass)."""
    if recipe_id not in recipes:
        return [f"{recipe_id} not found in recipes"]
    if recipe_id not in all_ings:
        return [f"{recipe_id} has no ingredients"]

    recipe   = recipes[recipe_id]
    ings     = all_ings[recipe_id]
    sections = all_secs.get(recipe_id, [])
    failures: list[str] = []

    print(f"\n{'=' * 55}")
    print(f"  RECIPE: {recipe_id}  ({recipe.sr_rule})")
    print(f"{'=' * 55}")

    failures: list[str] = []

    # ------------------------------------------------------------------
    # A. BASELINE STRUCTURE
    # ------------------------------------------------------------------
    print("\n=== A. BASELINE STRUCTURE ===")
    base = run_build(recipe, ings, ledger, sections)

    print(f"  recipe_id           : {base['recipe_id']}")
    print(f"  sr_rule             : {base['sr_rule']}")
    print(f"  raw_total_grams     : {base['raw_total_grams']:.1f} g")
    print(f"  cooked_total_grams  : {base['cooked_total_grams']:.2f} g")
    print(f"  water_lost_grams    : {base['water_lost_grams']:.2f} g")
    print(f"  grams_per_serving   : {base['grams_per_serving']:.2f} g")
    print(f"  servings_count      : {base['servings_count']}")
    print()

    for s in base.get("sections", []):
        key = s["section_key"]
        print(f"  Section [{key}]")
        print(f"    prep_method         : {s.get('prep_method', '-')}  (display only)")
        print(f"    cook_method         : {s.get('cook_method', '-')}  (retention driver)")
        print(f"    yield_factor_water  : {s['yield_factor_water']}")
        print(f"    raw_grams           : {s['raw_grams']:.1f} g")
        print(f"    final_grams         : {s['final_grams']:.2f} g")
        print()

    p  = base["per100g"]
    sv = base["per_serving"]
    print(fmt("per100g  Energy_KCal",  p[KCAL], "kcal"))
    print(fmt("per100g  Protein",       p[PROT], "g"))
    print(fmt("per100g  Fat",           p[FAT],  "g"))
    print(fmt("per100g  Carbohydrate",  p[CARB], "g"))
    print(fmt("per100g  Fiber",         p.get(FIBR, 0), "g"))
    print(fmt("per100g  Sugar",         p.get(SUGR, 0), "g"))
    print()
    print(fmt("per_serving  Energy_KCal", sv[KCAL], "kcal"))
    print(fmt("per_serving  Fat",          sv[FAT],  "g"))

    # ------------------------------------------------------------------
    # B. ATWATER CONSISTENCY
    # ------------------------------------------------------------------
    print("\n=== B. ATWATER CONSISTENCY ===")
    atwater = 4 * p[PROT] + 4 * p[CARB] + 9 * p[FAT]
    delta   = abs(atwater - p[KCAL])
    print(fmt("Atwater estimate (4P+4C+9F)", atwater, "kcal/100g"))
    print(fmt("Build Energy_KCal",            p[KCAL],  "kcal/100g"))
    print(fmt("Delta",                         delta,   "kcal"))
    # <= 5.0: PASS  |  5-15: WARN (may need audit)  |  > 15: FAIL
    if delta <= 5.0:
        print(PASS + f"  (delta={delta:.2f} <= 5.0 kcal tolerance)")
    elif delta <= 15.0:
        print(f"  WARN  per100g Atwater delta {delta:.2f} kcal (5-15 band, flag for audit)")
    else:
        msg = f"Atwater delta {delta:.2f} > 15.0 kcal/100g"
        print(FAIL + f"  {msg}")
        failures.append(msg)

    atwater_sv = 4 * sv[PROT] + 4 * sv[CARB] + 9 * sv[FAT]
    delta_sv   = abs(atwater_sv - sv[KCAL])
    if delta_sv <= 5.0:
        print(PASS + f"  per_serving Atwater (delta={delta_sv:.2f} kcal)")
    elif delta_sv <= 25.0:
        print(f"  WARN  per_serving Atwater delta {delta_sv:.2f} kcal (flag for audit)")
    else:
        msg = f"per_serving Atwater delta {delta_sv:.2f} > 25.0"
        print(FAIL + f"  {msg}")
        failures.append(msg)

    # ------------------------------------------------------------------
    # C. INGREDIENT CHANGE - double the highest-calorie ingredient.
    #    We pick by calorie contribution, not raw mass, so that diluting
    #    ingredients like water don't get chosen (doubling water would
    #    dilute per100g and all macros would fall).
    # ------------------------------------------------------------------
    def kcal_contrib(ing) -> float:
        row = ledger.get(ing.ndb_no if hasattr(ing, 'ndb_no') else 0, {})
        kcal_per100 = row.get(KCAL, 0) if row else 0
        return (ing.grams / 100.0) * kcal_per100

    # Get ingredient NDB mapping from the build output contributions
    ing_contribs = {i["ingredient_key"]: i["contribution"].get(KCAL, 0)
                    for i in base["ingredients"]}
    pivot = max(ings, key=lambda i: ing_contribs.get(i.ingredient_key, 0))
    print(f"\n=== C. INGREDIENT CHANGE: double highest-calorie ingredient "
          f"({pivot.ingredient_key}, {pivot.grams}g -> {pivot.grams * 2}g) ===")
    print(f"  (calorie contribution: {ing_contribs.get(pivot.ingredient_key, 0):.1f} kcal)")

    ings_mod = [
        dataclasses.replace(ing, grams=ing.grams * 2)
        if ing is pivot else ing
        for ing in ings
    ]
    mod = run_build(recipe, ings_mod, ledger, sections)
    mp  = mod["per100g"]
    msv = mod["per_serving"]

    # Doubling the top-calorie ingredient must raise per100g Energy.
    # (This holds for any non-water ingredient that is the caloric leader.)
    kcal_rose = mp[KCAL] > p[KCAL]

    print(f"  per100g Fat    {p[FAT]:.4f} -> {mp[FAT]:.4f}  ({mp[FAT]-p[FAT]:+.4f})")
    print(f"  per100g Carb   {p[CARB]:.4f} -> {mp[CARB]:.4f}  ({mp[CARB]-p[CARB]:+.4f})")
    print(f"  per100g Energy {p[KCAL]:.4f} -> {mp[KCAL]:.4f}  ({mp[KCAL]-p[KCAL]:+.4f})")

    if kcal_rose:
        print(PASS + f"  Energy rose when {pivot.ingredient_key} doubled")
    else:
        msg = f"Energy did not increase when {pivot.ingredient_key} (top-calorie) doubled"
        print(FAIL + f"  {msg}")
        failures.append(msg)

    atwater_m = 4 * mp[PROT] + 4 * mp[CARB] + 9 * mp[FAT]
    delta_m   = abs(atwater_m - mp[KCAL])
    if delta_m <= 15.0:
        print(PASS + f"  Modified Atwater consistent (delta={delta_m:.2f} kcal)")
    else:
        msg = f"Modified Atwater delta {delta_m:.2f} > 15.0"
        print(FAIL + f"  {msg}")
        failures.append(msg)

    # Section isolation: if there are multiple sections, doubling an ingredient
    # in one section must not change the final_grams of the others
    if len(sections) > 1 and pivot.section:
        other_secs_base = {
            s["section_key"]: s["final_grams"]
            for s in base.get("sections", [])
            if s["section_key"] != pivot.section
        }
        other_secs_mod = {
            s["section_key"]: s["final_grams"]
            for s in mod.get("sections", [])
            if s["section_key"] != pivot.section
        }
        unchanged = all(
            abs(other_secs_mod.get(k, 0) - v) < 0.001
            for k, v in other_secs_base.items()
        )
        if unchanged:
            print(PASS + "  Other section final_grams unchanged (section isolation confirmed)")
        else:
            msg = "Other section final_grams changed unexpectedly"
            print(FAIL + f"  {msg}")
            failures.append(msg)

    # ------------------------------------------------------------------
    # D. cook_method vs prepMethod independence
    #    Only meaningful when at least one section has prep_method != cook_method
    # ------------------------------------------------------------------
    diff_secs = [s for s in sections if s.prep_method != s.cook_method]
    if not diff_secs:
        print(f"\n=== D. cook_method vs prepMethod independence  (SKIPPED - "
              f"all {len(sections)} section(s) have prep==cook) ===")
    else:
        print("\n=== D. cook_method vs prepMethod independence ===")
        for sec in diff_secs:
            cm_enum  = normalize_cooking_method(sec.cook_method)
            vitc_ret = get_retention(cm_enum, "VitaminC_totalAscorbicAcid")
            b1_ret   = get_retention(cm_enum, "Thiamin")
            label    = sec.section_key
            print(f"\n  [{label}]")
            print(f"    prepMethod (display)    : {sec.prep_method}")
            print(f"    cook_method (retention) : {sec.cook_method} -> {cm_enum}")
            print(f"    VitaminC retention      : {vitc_ret:.3f}")
            print(f"    Thiamin retention       : {b1_ret:.3f}")

            if vitc_ret < 1.0:
                print(PASS + f"  VitC retention {vitc_ret:.3f} < 1.0 (heat losses applied)")
            else:
                msg = f"[{label}] VitC retention {vitc_ret:.3f} expected < 1.0 for {cm_enum}"
                print(FAIL + f"  {msg}")
                failures.append(msg)

    # ------------------------------------------------------------------
    # SUMMARY
    # ------------------------------------------------------------------
    print()
    if not failures:
        print(PASS + f"  All checks passed for {recipe_id}")
    else:
        print(FAIL + f"  {len(failures)} check(s) FAILED for {recipe_id}:")
        for f in failures:
            print(f"      - {f}")

    return failures


def main() -> int:
    recipes  = load_recipes()
    ledger   = load_ledger()
    all_ings = load_ingredients()
    all_secs = load_sections()

    args = sys.argv[1:]

    if "--all" in args:
        targets = sorted(recipes.keys())
    elif args:
        targets = [a for a in args if not a.startswith("-")]
        unknown = [t for t in targets if t not in recipes]
        if unknown:
            print(f"Unknown recipe(s): {', '.join(unknown)}")
            print(f"Available: {', '.join(sorted(recipes.keys()))}")
            return 1
    else:
        targets = ["SWEET_001"]

    all_failures: dict[str, list[str]] = {}
    for rid in targets:
        fails = verify_recipe(rid, recipes, all_ings, all_secs, ledger)
        if fails:
            all_failures[rid] = fails

    print(f"\n{'=' * 55}")
    if not all_failures:
        print(f"  All checks passed ({len(targets)} recipe(s))")
    else:
        print(f"  FAILED: {len(all_failures)} of {len(targets)} recipe(s)")
        for rid, fails in all_failures.items():
            for f in fails:
                print(f"    {rid}: {f}")
    print("=" * 55)

    return 0 if not all_failures else 1


if __name__ == "__main__":
    sys.exit(main())

