"""Cooking-method nutrient retention table for v3.

GREENFIELD. Owned by v3. Not derived from v1 or v2 code.

Underlying composition data: USDA SR-Legacy (loaded into ``comboo.db``).
Retention factors: USDA Agricultural Research Service "Table of Nutrient
Retention Factors, Release 6" (USDA R6, 2007), with literature supplements
(FAO/INFOODS, Bognár 2002) for nutrients R6 does not cover (individual
fatty acids and omega-3/6 species).

DESIGN PRINCIPLES
-----------------
1. Mass loss is handled by ``yield_factor_water`` and ``yield_factor_fat``
   on the recipe row. NEVER apply a retention factor for the same effect.
2. Retention factors model TRUE per-nutrient losses only:
     - leaching of water-solubles into cooking water (boil)
     - heat destruction of labile vitamins (C, B1, B6, folate)
     - oxidation of PUFAs (esp. long-chain n-3) at dry-heat temperatures
3. Macros (Protein, Carbohydrate, Fat, Fiber, Sugar, Energy, Water) are
   NOT destroyed by heat. They denature, gelatinize, caramelize, melt --
   none of which removes mass from the dish. All macros = 1.00.
4. R6 publishes per-food-group retention. v3 uses single per-method
   defaults as a deliberate simplification suitable for mixed-ingredient
   recipes; food-group specificity is a Phase-9+ refinement.
5. Missing key -> 1.00 (full retention). Only LOSSES are listed.

DEPRECATED SOURCE
-----------------
v1's cookingLossModel.ts derived "Protein 0.94 (baked)" from a raw-vs-cooked
SR-Legacy egg comparison. That is a CONCENTRATION ARTIFACT (cooked SR-Legacy
entries are already per-100g of cooked mass), and double-counts the water
loss that v3 captures via yield_factor_water. R6 explicitly retains protein
at 1.00 across all cooking methods. v3 follows R6.
"""
from __future__ import annotations

# v2/v3 cook_method values -> canonical retention key.
COOK_METHOD_ALIASES = {
    "raw":        "raw",
    "no_heat":    "raw",
    "no heat":    "raw",
    "bake":       "baked",
    "baked":      "baked",
    "roast":      "baked",
    "roasted":    "baked",
    "boil":       "boiled",
    "boiled":     "boiled",
    "simmer":     "boiled",
    "stew":       "boiled",
    "poach":      "boiled",
    "blanch":     "boiled",
    "fry":        "fried",
    "fried":      "fried",
    "saute":      "fried",
    "stir_fry":   "fried",
    "pan_fry":      "fried",
    "pan_grilled":  "fried",
    "pan grilled":  "fried",
    "deep_fry":     "fried",
    "grill":      "grilled",
    "grilled":    "grilled",
    "broil":      "grilled",
    "broiled":    "grilled",
    "bbq":        "grilled",
    "steam":      "steamed",
    "steamed":    "steamed",
    "microwave":  "microwave",
    "microwaved": "microwave",
}

# ---------------------------------------------------------------------------
# RETENTION TABLE
# Keys are SR-Legacy column names as stored in comboo.db.
# Missing key  =>  1.00  (no loss).
# All values are USDA R6 mid-range or literature defaults (cited in comments).
# ---------------------------------------------------------------------------

RETENTION: dict[str, dict[str, float]] = {

    # ── raw / no-heat ───────────────────────────────────────────────────────
    "raw": {},

    # ── boiled (water immersion, ~100 °C) ───────────────────────────────────
    # Dominant loss mechanism: water-soluble nutrients leach into cooking water.
    "boiled": {
        # Macros — all 1.00 by design (mass loss is yield-driven).
        # Fat-soluble vitamins — minor leaching only
        "VitaminA_RAE":                    0.90,   # R6
        "Retinol":                         0.90,   # R6
        "Carotene_beta":                   0.90,   # R6
        "Carotene_alpha":                  0.90,   # R6
        "VitaminD":                        1.00,   # R6: heat-stable
        "VitaminE_alphaTocopherol":        0.95,   # R6
        "VitaminK_phylloquinone":          0.95,   # R6
        # Water-soluble vitamins — significant leach + some heat destruction
        "VitaminC_totalAscorbicAcid":      0.50,   # R6 (vegetables boiled)
        "Thiamin":                         0.65,   # R6
        "Riboflavin":                      0.85,   # R6
        "Niacin":                          0.65,   # R6
        "PantothenicAcid":                 0.70,   # R6
        "VitaminB6":                       0.60,   # R6
        "Folate_total":                    0.65,   # R6
        "Folate_food":                     0.65,   # R6
        "Folate_DFE":                      0.65,   # R6
        "VitaminB12":                      0.85,   # R6
        "Choline_total":                   0.85,   # literature (Lewis 2014)
        "Betaine":                         1.00,   # water-stable
        # Carotenoids (heat-sensitive)
        "LuteinZeaxanthin":                0.75,   # R6
        "Lycopene":                        0.90,   # R6
        # Minerals — leach into cooking water
        "Calcium_Ca":                      0.85,   # R6
        "Iron_Fe":                         0.80,   # R6
        "Magnesium_Mg":                    0.80,   # R6
        "Phosphorus_P":                    0.85,   # R6
        "Potassium_K":                     0.80,   # R6
        "Sodium_Na":                       0.85,   # R6 (foods cooked w/o added salt)
        "Zinc_Zn":                         0.85,   # R6
        "Copper_Cu":                       0.85,   # R6
        "Manganese_Mn":                    0.95,   # R6
        "Selenium_Se":                     0.95,   # R6
        # Fatty acids — minor losses in water; long-chain n-3 most vulnerable
        "FattyAcids_totalSaturated":       1.00,
        "FattyAcids_totalMonounsaturated": 1.00,
        "FattyAcids_totalPolyunsaturated": 0.85,   # FAO/INFOODS
        "LinoleicAcid":                    0.90,   # Bognár 2002
        "alphaLinolenicAcid":              0.80,   # Bognár 2002
        "EPA_20_5n3":                      0.75,   # Bognár 2002
        "DPA_22_5n3":                      0.75,   # Bognár 2002
        "DHA_22_6n3":                      0.70,   # Bognár 2002
        "omega3":                          0.75,   # weighted of above
        "omega6":                          0.90,   # weighted
        # Amino acids — heat-stable (R6: AAs retain 1.00); cystine slightly labile
        "Cystine":                         0.95,
    },

    # ── steamed (water vapor, no immersion) ─────────────────────────────────
    # No leaching contact => better than boiled across the board.
    "steamed": {
        "VitaminA_RAE":                    0.95,
        "Retinol":                         0.95,
        "Carotene_beta":                   0.95,
        "Carotene_alpha":                  0.95,
        "VitaminD":                        1.00,
        "VitaminE_alphaTocopherol":        0.95,
        "VitaminK_phylloquinone":          0.95,
        "VitaminC_totalAscorbicAcid":      0.75,   # R6
        "Thiamin":                         0.85,   # R6
        "Riboflavin":                      0.95,
        "Niacin":                          0.85,
        "PantothenicAcid":                 0.85,
        "VitaminB6":                       0.85,
        "Folate_total":                    0.85,
        "Folate_food":                     0.85,
        "Folate_DFE":                      0.85,
        "VitaminB12":                      0.95,
        "Choline_total":                   0.95,
        "LuteinZeaxanthin":                0.85,
        "Lycopene":                        0.95,
        # Minerals nearly fully retained (no leach)
        "Calcium_Ca":                      0.95,
        "Iron_Fe":                         0.95,
        "Magnesium_Mg":                    0.95,
        "Phosphorus_P":                    0.95,
        "Potassium_K":                     0.95,
        "Sodium_Na":                       0.95,
        "Zinc_Zn":                         0.95,
        "Copper_Cu":                       0.95,
        "Manganese_Mn":                    1.00,
        "Selenium_Se":                     0.95,
        "FattyAcids_totalPolyunsaturated": 0.90,
        "LinoleicAcid":                    0.95,
        "alphaLinolenicAcid":              0.85,
        "EPA_20_5n3":                      0.80,
        "DPA_22_5n3":                      0.80,
        "DHA_22_6n3":                      0.75,
        "omega3":                          0.80,
        "omega6":                          0.95,
        "Cystine":                         0.95,
    },

    # ── baked (dry heat, 175–230 °C) ────────────────────────────────────────
    # No leaching; higher temperatures => more PUFA oxidation than steaming.
    # Applies to cakes, breads, muffins, casseroles.
    "baked": {
        "VitaminA_RAE":                    0.85,   # R6 (dry heat)
        "Retinol":                         0.85,
        "Carotene_beta":                   0.80,   # R6
        "Carotene_alpha":                  0.80,
        "VitaminD":                        0.95,
        "VitaminE_alphaTocopherol":        0.85,   # oxidation
        "VitaminK_phylloquinone":          0.95,
        "VitaminC_totalAscorbicAcid":      0.55,   # R6 — heat destruction only (no leach)
        "Thiamin":                         0.75,   # R6
        "Riboflavin":                      0.95,   # R6
        "Niacin":                          0.85,   # R6
        "PantothenicAcid":                 0.85,
        "VitaminB6":                       0.75,   # R6
        "Folate_total":                    0.80,   # R6
        "Folate_food":                     0.80,
        "Folate_DFE":                      0.80,
        "VitaminB12":                      0.90,
        "Choline_total":                   0.90,
        "LuteinZeaxanthin":                0.70,
        "Lycopene":                        0.85,
        # Minerals: no leaching => fully retained
        "Calcium_Ca":                      1.00,
        "Iron_Fe":                         1.00,
        "Magnesium_Mg":                    1.00,
        "Phosphorus_P":                    1.00,
        "Potassium_K":                     1.00,
        "Sodium_Na":                       1.00,
        "Zinc_Zn":                         1.00,
        "Copper_Cu":                       1.00,
        "Manganese_Mn":                    1.00,
        "Selenium_Se":                     1.00,
        # Fatty acids: dry-heat oxidation
        "FattyAcids_totalSaturated":       1.00,
        "FattyAcids_totalMonounsaturated": 0.95,
        "FattyAcids_totalPolyunsaturated": 0.80,
        "LinoleicAcid":                    0.85,
        "alphaLinolenicAcid":              0.75,
        "EPA_20_5n3":                      0.70,
        "DPA_22_5n3":                      0.70,
        "DHA_22_6n3":                      0.65,
        "omega3":                          0.70,
        "omega6":                          0.85,
        "Cystine":                         0.90,
    },

    # ── fried (oil contact, 175–200 °C) ─────────────────────────────────────
    # Similar dry-heat profile to baked + lipid exchange with frying oil.
    "fried": {
        "VitaminA_RAE":                    0.80,
        "Retinol":                         0.80,
        "Carotene_beta":                   0.80,
        "Carotene_alpha":                  0.80,
        "VitaminD":                        0.95,
        "VitaminE_alphaTocopherol":        0.75,   # significant oxidation in hot oil
        "VitaminK_phylloquinone":          0.90,
        "VitaminC_totalAscorbicAcid":      0.50,
        "Thiamin":                         0.75,
        "Riboflavin":                      0.90,
        "Niacin":                          0.80,
        "PantothenicAcid":                 0.80,
        "VitaminB6":                       0.75,
        "Folate_total":                    0.75,
        "Folate_food":                     0.75,
        "Folate_DFE":                      0.75,
        "VitaminB12":                      0.85,
        "Choline_total":                   0.90,
        "LuteinZeaxanthin":                0.65,
        "Lycopene":                        0.80,
        "Calcium_Ca":                      1.00,
        "Iron_Fe":                         1.00,
        "Magnesium_Mg":                    1.00,
        "Phosphorus_P":                    1.00,
        "Potassium_K":                     1.00,
        "Sodium_Na":                       1.00,
        "Zinc_Zn":                         1.00,
        "Copper_Cu":                       1.00,
        "Manganese_Mn":                    1.00,
        "Selenium_Se":                     1.00,
        "FattyAcids_totalPolyunsaturated": 0.75,   # hot-oil oxidation
        "LinoleicAcid":                    0.80,
        "alphaLinolenicAcid":              0.65,
        "EPA_20_5n3":                      0.60,
        "DPA_22_5n3":                      0.60,
        "DHA_22_6n3":                      0.55,
        "omega3":                          0.60,
        "omega6":                          0.80,
        "Cystine":                         0.85,
    },

    # ── grilled / broiled (radiant dry heat, 200–260 °C) ────────────────────
    # Highest surface temperatures; greatest fat oxidation losses.
    "grilled": {
        "VitaminA_RAE":                    0.80,
        "Retinol":                         0.80,
        "Carotene_beta":                   0.80,
        "Carotene_alpha":                  0.80,
        "VitaminD":                        0.95,
        "VitaminE_alphaTocopherol":        0.75,
        "VitaminK_phylloquinone":          0.90,
        "VitaminC_totalAscorbicAcid":      0.50,
        "Thiamin":                         0.70,
        "Riboflavin":                      0.90,
        "Niacin":                          0.80,
        "PantothenicAcid":                 0.80,
        "VitaminB6":                       0.70,
        "Folate_total":                    0.75,
        "Folate_food":                     0.75,
        "Folate_DFE":                      0.75,
        "VitaminB12":                      0.85,
        "Choline_total":                   0.90,
        "LuteinZeaxanthin":                0.65,
        "Lycopene":                        0.80,
        "Calcium_Ca":                      1.00,
        "Iron_Fe":                         1.00,
        "Magnesium_Mg":                    1.00,
        "Phosphorus_P":                    1.00,
        "Potassium_K":                     1.00,
        "Sodium_Na":                       1.00,
        "Zinc_Zn":                         1.00,
        "Copper_Cu":                       1.00,
        "Manganese_Mn":                    1.00,
        "Selenium_Se":                     1.00,
        "FattyAcids_totalPolyunsaturated": 0.75,
        "LinoleicAcid":                    0.80,
        "alphaLinolenicAcid":              0.65,
        "EPA_20_5n3":                      0.60,
        "DPA_22_5n3":                      0.60,
        "DHA_22_6n3":                      0.55,
        "omega3":                          0.60,
        "omega6":                          0.80,
        "Cystine":                         0.85,
    },

    # ── microwave (rapid heat, short time) ──────────────────────────────────
    # Best retention of water-soluble vitamins: short cook + minimal water.
    "microwave": {
        "VitaminA_RAE":                    0.95,
        "Retinol":                         0.95,
        "Carotene_beta":                   0.95,
        "Carotene_alpha":                  0.95,
        "VitaminD":                        1.00,
        "VitaminE_alphaTocopherol":        0.95,
        "VitaminK_phylloquinone":          0.95,
        "VitaminC_totalAscorbicAcid":      0.85,   # R6 (best of all methods)
        "Thiamin":                         0.90,
        "Riboflavin":                      0.95,
        "Niacin":                          0.90,
        "PantothenicAcid":                 0.90,
        "VitaminB6":                       0.90,
        "Folate_total":                    0.90,
        "Folate_food":                     0.90,
        "Folate_DFE":                      0.90,
        "VitaminB12":                      0.95,
        "Choline_total":                   0.95,
        "LuteinZeaxanthin":                0.85,
        "Lycopene":                        0.95,
        "Calcium_Ca":                      1.00,
        "Iron_Fe":                         1.00,
        "Magnesium_Mg":                    1.00,
        "Phosphorus_P":                    1.00,
        "Potassium_K":                     1.00,
        "Sodium_Na":                       1.00,
        "Zinc_Zn":                         1.00,
        "Copper_Cu":                       1.00,
        "Manganese_Mn":                    1.00,
        "Selenium_Se":                     1.00,
        "FattyAcids_totalPolyunsaturated": 0.90,
        "LinoleicAcid":                    0.95,
        "alphaLinolenicAcid":              0.90,
        "EPA_20_5n3":                      0.85,
        "DPA_22_5n3":                      0.85,
        "DHA_22_6n3":                      0.80,
        "omega3":                          0.85,
        "omega6":                          0.95,
    },
}

# Backwards-compatible alias used elsewhere in the codebase.
MACRO_RETENTION = RETENTION


def normalize_cooking_method(raw: str) -> str:
    """Map a freeform cooking_method string to a canonical key.

    Compound methods like 'bake+chill' collapse to the first heat-applying
    segment.
    """
    if not raw:
        return "raw"
    raw = raw.strip().lower()
    for part in raw.split("+"):
        part = part.strip()
        if part in COOK_METHOD_ALIASES:
            return COOK_METHOD_ALIASES[part]
    return "raw"


# Backwards-compatible alias for callers still using the old name.
normalize_cook_method = normalize_cooking_method


def get_retention(method: str, nutrient: str) -> float:
    """Return retention factor in [0..1] for (method, nutrient).

    Defaults to 1.00 when the nutrient is not listed for the method.
    Per design rule 1: macro nutrients always return 1.00 -- mass loss is
    handled by yield_factor_water and yield_factor_fat in build.py.
    """
    canonical = normalize_cooking_method(method)
    return RETENTION.get(canonical, {}).get(nutrient, 1.0)
