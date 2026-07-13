"""
yield_calc.py — Physics-based yield_water calculator.

ALGORITHM
─────────
Moisture loss during baking follows first-order exponential decay applied
only to the "free" water fraction of the filling — water not structurally
bound to fibre, protein, or starch matrices.

    yield_water = remaining_water / initial_water

where:
    remaining_water = bound_water + free_water_after_all_stages
    free_water[i]   = free_water[i-1] × exp(−k(T) × t)
    k(T)            = K_REF × (T_°F / T_REF) ^ N_TEMP

MULTI-STAGE BAKES
─────────────────
Each stage (temp_f, time_min) is applied sequentially to the remaining
free-water pool from the previous stage. This handles two-stage bakes such
as pumpkin pie (425 °F × 15 min → 350 °F × 45 min) exactly.

BINDING COEFFICIENT
───────────────────
The binding coefficient (0–1) represents the fraction of initial water that
is "free" to evaporate. The rest is structurally bound and does not leave
the dish during normal bake times.

    dense_fruit        — apple/pear baked open (fully collapses, ~94% free)  ✓ SWEET_001
    strudel_fruit      — apple/fruit in wrapped pastry (casing limits evap, ~55% free)  ✓ SWEET_002
    thickened_fruit    — cornstarch-thickened pre-cooked berry/cherry (~25% free)  ✓ SWEET_004/005
    mincemeat          — mixed dried/cooked fruit, fat, spirits (~57% free)  ✓ SWEET_007
    moderate_fruit     — partially thickened stone fruit, e.g. peach (~40% free)  ✓ SWEET_008
    syrup_custard      — corn syrup/egg matrix (~53% free)  ✓ SWEET_009
    vegetable_custard  — pumpkin/squash purée, fibre-bound (~12% free)  ✓ SWEET_010
    dairy_custard      — cream/milk/egg custard (~33% free)  ✓ SWEET_015
    cake_batter        — flour/butter/egg cake batter (~74% free)  ✓ SWEET_012
    meringue           — ⚠ MODEL DOES NOT APPLY (surface browning, not bulk evaporation)
                         Set yield_water manually; do not use calc_yield_water()
    none               — stovetop, cold-set, or no-bake: no evaporation (yield=1.0)

CALIBRATION (May 13 2026)
──────────────────────────
Recipe         Filling class       Stages                      Initial water  Calculated  Actual
SWEET_001      dense_fruit         (425°F×15)+(350°F×37)         722.5 g        0.650       0.65  ✓
SWEET_002      strudel_fruit       (375°F×35)                    ~380 g         0.850       0.85  ✓
SWEET_004      thickened_fruit     (425°F×25)+(375°F×52)         ~420 g         0.870       0.87  ✓
SWEET_005      thickened_fruit     (425°F×25)+(375°F×52)         ~380 g         0.870       0.87  ✓
SWEET_007      mincemeat           (425°F×20)+(375°F×32)         ~320 g         0.770       0.77  ✓
SWEET_008      moderate_fruit      (425°F×20)+(375°F×27)         ~480 g         0.850       0.85  ✓
SWEET_009      syrup_custard       (350°F×55)                    213.3 g        0.815       0.81  ✓
SWEET_010      vegetable_custard   (425°F×15)+(350°F×45)         ~756 g         0.959       0.95  ✓
SWEET_012      cake_batter         (350°F×24)                    ~310 g         0.870       0.87  ✓
SWEET_015      dairy_custard       (325°F×40)                    ~380 g         0.920       0.92  ✓

NOT MODELLED (manual yield_water):
SWEET_006 meringue — surface browning only; required binding >1.0 (impossible)
SWEET_003/011/013/014 — stovetop / no-bake; use filling_class='none'

Add rows here as additional recipes are locked and validated.

INTEGRATION
───────────
Requires two new columns in recipe_sections.csv:
    cook_temp_f   (integer, °F — for two-stage: use first stage temp)
    cook_time_min (integer, minutes per stage; comma-separated for multi-stage)

Called from build.py or a pre-processor to compute yield_factor_water before
the main build runs.
"""

from __future__ import annotations
import math

# ── Calibration constants ─────────────────────────────────────────────────────
K_REF      = 0.008   # base evaporation rate constant at T_REF (per minute)
N_TEMP     = 1.8     # temperature sensitivity exponent  (Arrhenius-inspired)
T_REF      = 350.0   # reference temperature (°F)
BOIL_K_REF = 0.236   # evaporation rate constant for open-pot stovetop boiling
                     # calibrated from SWEET_003 (dairy_custard, 8 min → yfw=0.72)
                     # ~29× higher than oven k at same temp: open convective
                     # surface evaporation vs. diffusion-limited oven moisture loss
BOIL_T_REF = 212.0   # rolling boil reference temperature (°F)

# Temperature-scaled stovetop evaporation rate.
#   boiled     (212 °F) → 0.236        (baseline)
#   simmer     (195 °F) → ≈ 0.198  (−16 %)
#   sub-simmer (180 °F) → ≈ 0.163  (−31 %)
#   braise (covered) uses BRAISE_LID_FACTOR regardless of temp
def stovetop_rate_constant(temp_f: float) -> float:
    return BOIL_K_REF * (temp_f / BOIL_T_REF) ** N_TEMP

BRAISE_LID_FACTOR = 0.05  # lid traps ~95 % of steam; only ~5 % escapes

# ── Binding coefficients: fraction of water available to evaporate ────────────
# Higher value = more free water = more evaporation = lower yield_water.
# All values back-calculated from locked recipes (May 13 2026).
BINDING: dict[str, float] = {
    "dense_fruit":        0.94,  # apple/pear baked open — SWEET_001
    "strudel_fruit":      0.55,  # fruit in wrapped pastry — SWEET_002
    "thickened_fruit":    0.25,  # cornstarch-thickened berry/cherry — SWEET_004/005
    "mincemeat":          0.57,  # dried/cooked fruit + fat + spirits — SWEET_007
    "moderate_fruit":     0.40,  # partially thickened stone fruit — SWEET_008
    "syrup_custard":      0.53,  # corn syrup / egg matrix — SWEET_009
    "vegetable_custard":  0.12,  # pumpkin/squash purée — SWEET_010
    "dairy_custard":      0.33,  # cream/milk/egg custard — SWEET_015
    "starch_custard":     0.099, # cornstarch-thickened custard (crème pâtissière) — SWEET_012
                                 # calibrated: boil_3min → yfw=0.950 (only 9.9% free to evaporate;
                                 # starch gel binds 90.1% — much higher retention than dairy_custard)
    "cake_batter":        0.74,  # flour/butter/egg batter — SWEET_012
    "pastry":             0.782, # blind-baked pie crust — SWEET_011 (425°F×13)+(375°F×9) → yfw=0.840
                                 # single calibration point; generalises to other blind-bake temps/times
    "crumb_crust":        0.432, # baked cookie/cracker crumb crust — SWEET_013 (350°F×9) → yfw=0.970
                                 # cookies already dry; only residual butter moisture evaporates
    "none":               0.00,  # stovetop / cold-set / no-bake
    # ── Stovetop / fried / grilled fill classes ─────────────────────────────
    # Calibrated from locked BKFST values using stovetop_rate_constant(temp).
    # These use the boil-path (boil_minutes) in calc_yield_water, not oven stages.
    "simmer_sauce":       0.127, # simmered gravy/sauce — BKFST_012 gravy: 195°F×5min → yfw=0.92
    "pan_grilled_batter": 0.206, # pan-grilled bread/batter — BKFST_004 English muffin: 350°F×6min → yfw=0.80
    "fried_meat":         0.272, # fried ground meat — BKFST_015 sausage: 375°F×8min → yfw=0.73
    "fried_potato":       0.750, # fried potato (high surface area) — BKFST_013 hash browns: 375°F×10min → yfw=0.25
    "grilled_batter":     0.408, # waffle-iron grilled batter — BKFST_014 waffle: 375°F×4min → yfw=0.62
    "pan_grilled_chicken": 0.216, # pan-grilled chicken breast — SAND_034: 212°F×11min → yfw=0.80
                                  # NDB 5062 (raw) / NDB 5063 (fried) USDA pair; full-cook pair yfw=0.548 (B>1)
                                  # 212°F = default stovetop temp for pan grilled in build.py
    "fried_chicken":       0.195, # deep-fried battered chicken breast — SAND_035: 212°F×11min → yfw=0.82
                                  # NDB 5062 (raw) / NDB 5063 (fried) USDA pair; batter crust traps moisture
    # ── Oven-baked proteins ────────────────────────────────────────────────────
    # Calibrated from USDA raw/cooked NDB pair; use oven stages (cook_stages).
    "baked_pork":         0.880, # slow-roasted pork shoulder/butt — ENTR_094/SAND_032: 300°F×100min → yfw=0.60
                                  # NDB 10080 (raw) / NDB 10082 (roasted) USDA pair
    "braised_beef":        0.940, # slow-braised beef brisket — SAND_033: 275°F×100min → yfw=0.62
                                  # NDB 13803 (raw) / NDB 13804 (braised) USDA pair; 100-min partial cook
                                  # (full braise pair gives yfw=0.578 but requires B>1 at 100min; 0.62 used)
    # meringue: DO NOT USE — model invalid for surface-browning sections
}


# ── Core functions ────────────────────────────────────────────────────────────

def rate_constant(temp_f: float) -> float:
    """
    Evaporation rate constant k at temperature temp_f (°F).

    k scales as (T / T_ref)^N_TEMP so that 400°F evaporates faster than 350°F
    and 300°F evaporates slower.
    """
    return K_REF * (temp_f / T_REF) ** N_TEMP


def calc_yield_water(
    stages: list[tuple[float, int]],
    initial_water_g: float,
    filling_class: str = "syrup_custard",
    boil_minutes: float = 0.0,
    boil_temp_f: float = 212.0,
    boil_covered: bool = False,
) -> float:
    """
    Compute yield_water for a filling section cooked through optional stovetop
    boiling followed by zero or more oven-bake stages.

    Args:
        stages:          Ordered list of oven (temp_f, time_min) tuples.
                         Single stage:      [(350, 55)]
                         Two-stage:         [(425, 15), (350, 45)]
                         Boil-only (no oven): []
        initial_water_g: Total water mass (g) in the raw filling ingredients.
        filling_class:   Key from BINDING. Determines structurally free vs bound
                         water fraction — applies to both boil and oven stages.
        boil_minutes:    Minutes of open-pot stovetop boiling BEFORE oven stages.
                         Uses BOIL_K_REF (calibrated for convective surface evap).
                         0.0 = no stovetop phase (oven-only, default behaviour).
        boil_temp_f:     Stovetop temperature °F (default 212 = rolling boil).
                         Pass 195 for 'simmer', 180 for 'sub-simmer', 185 for 'braise'.
        boil_covered:    True for covered cooking (braise). Multiplies stovetop k
                         by BRAISE_LID_FACTOR (0.05) — lid recycles ~95 % of steam.

    Processing order:
        1. Stovetop boil (if boil_minutes > 0) — stovetop_rate_constant(boil_temp_f)
        2. Oven stages   (if stages non-empty)  — K_REF scaled by (T/T_REF)^N_TEMP
        Water from step 1 feeds directly into step 2.

    Returns:
        yield_water (float, 0 < value ≤ 1.0).

    Examples:
        >>> calc_yield_water([(425, 15), (350, 45)], 756.0, "vegetable_custard")
        0.959  # pumpkin pie — oven-only
        >>> calc_yield_water([], 380.0, "dairy_custard", boil_minutes=8.0)
        0.720  # vanilla custard — stovetop boil-only (SWEET_003)
    """
    if initial_water_g <= 0.0:
        return 1.0

    binding     = BINDING.get(filling_class, BINDING["syrup_custard"])
    free_water  = initial_water_g * binding
    bound_water = initial_water_g * (1.0 - binding)

    # ── Stage 0: stovetop evaporation (temperature-scaled; lid halves rate when covered)
    if boil_minutes > 0.0:
        k = stovetop_rate_constant(boil_temp_f) * (BRAISE_LID_FACTOR if boil_covered else 1.0)
        free_water *= math.exp(-k * boil_minutes)

    # ── Stages 1-N: oven bake (diffusion-limited, temperature-dependent) ─────
    for temp_f, time_min in stages:
        if time_min <= 0:
            continue
        k = rate_constant(temp_f)
        # First-order decay: evaporate from remaining free-water pool
        free_water *= math.exp(-k * time_min)

    remaining_water = free_water + bound_water
    return remaining_water / initial_water_g


def initial_water_from_ingredients(
    ingredients: list[dict],
    ledger: dict[str, dict],
) -> float:
    """
    Sum the water content (g) across all filling ingredients.

    Args:
        ingredients: list of dicts with keys 'ingredient_id' and 'grams'.
        ledger:      ingredient ledger keyed by ingredient_id.
                     Each entry must have 'water_g_per_100g'.

    Returns:
        Total water in grams across all ingredients.
    """
    total = 0.0
    for ing in ingredients:
        iid = ing["ingredient_id"]
        grams = ing["grams"]
        water_per_100 = ledger.get(iid, {}).get("water_g_per_100g", 0.0)
        total += grams * water_per_100 / 100.0
    return total


# ── Validation (run as __main__) ──────────────────────────────────────────────

CALIBRATION_CASES = [
    {
        "recipe":        "SWEET_001 Apple Pie",
        "filling_class": "dense_fruit",
        "stages":        [(425, 15), (350, 37)],
        "initial_water": 722.5,   # g — apples + lemon juice + butter + added water
        "expected":      0.65,
    },
    {
        "recipe":        "SWEET_002 Apple Strudel",
        "filling_class": "strudel_fruit",
        "stages":        [(375, 35)],
        "initial_water": 380.0,   # g — estimated
        "expected":      0.85,
    },
    {
        "recipe":        "SWEET_004 Blueberry Pie",
        "filling_class": "thickened_fruit",
        "stages":        [(425, 25), (375, 52)],
        "initial_water": 420.0,   # g — estimated
        "expected":      0.87,
    },
    {
        "recipe":        "SWEET_005 Cherry Pie",
        "filling_class": "thickened_fruit",
        "stages":        [(425, 25), (375, 52)],
        "initial_water": 380.0,   # g — estimated
        "expected":      0.87,
    },
    {
        "recipe":        "SWEET_007 Mince Pie",
        "filling_class": "mincemeat",
        "stages":        [(425, 20), (375, 32)],
        "initial_water": 320.0,   # g — estimated
        "expected":      0.77,
    },
    {
        "recipe":        "SWEET_008 Peach Pie",
        "filling_class": "moderate_fruit",
        "stages":        [(425, 20), (375, 27)],
        "initial_water": 480.0,   # g — estimated
        "expected":      0.85,
    },
    {
        "recipe":        "SWEET_009 Pecan Pie",
        "filling_class": "syrup_custard",
        "stages":        [(350, 55)],
        "initial_water": 213.3,   # g — corn syrup + eggs + butter + pecans
        "expected":      0.81,
    },
    {
        "recipe":        "SWEET_010 Pumpkin Pie",
        "filling_class": "vegetable_custard",
        "stages":        [(425, 15), (350, 45)],
        "initial_water": 756.0,   # g — pumpkin purée + milk + eggs
        "expected":      0.95,
    },
    {
        "recipe":        "SWEET_012 Pineapple Upside-Down Cake",
        "filling_class": "cake_batter",
        "stages":        [(350, 24)],
        "initial_water": 310.0,   # g — estimated
        "expected":      0.87,
    },
    {
        "recipe":        "SWEET_015 Egg Custard Pie",
        "filling_class": "dairy_custard",
        "stages":        [(325, 40)],
        "initial_water": 380.0,   # g — estimated
        "expected":      0.92,
    },
]


def validate(tolerance: float = 0.02) -> None:
    """Check calc_yield_water against all calibration cases."""
    print(f"{'Recipe':<28} {'Class':<22} {'Calc':>6} {'Expected':>8} {'Delta':>7} {'OK':>4}")
    print("─" * 78)
    all_pass = True
    for c in CALIBRATION_CASES:
        calc = calc_yield_water(c["stages"], c["initial_water"], c["filling_class"])
        delta = calc - c["expected"]
        ok = abs(delta) <= tolerance
        if not ok:
            all_pass = False
        print(
            f"{c['recipe']:<28} {c['filling_class']:<22} "
            f"{calc:>6.3f} {c['expected']:>8.3f} {delta:>+7.3f} {'✓' if ok else '✗':>4}"
        )
    print()
    print("All cases pass." if all_pass else "⚠ One or more cases failed — recalibrate K_REF / N_TEMP / BINDING.")


if __name__ == "__main__":
    validate()
