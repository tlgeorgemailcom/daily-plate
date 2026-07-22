/**
 * Nutrient Heat-Retention Model
 *
 * Defines what fraction of each nutrient survives a given cooking method,
 * measured as a proportion of the ORIGINAL RAW WEIGHT of the ingredient.
 *
 * IMPORTANT — how to apply this model:
 *   retained_nutrient = raw_value_per_100g × (raw_weight_g / 100) × retention_factor
 *
 * The factors account for BOTH:
 *   1. Water loss (concentration effect — reduces cooked weight, irrelevant to total retained)
 *   2. Actual nutrient destruction / leaching
 *
 * Source derivation:
 *   Primary: SR28 DataCentralCombo — raw vs cooked entries for whole egg
 *     NDB 1123 (raw) vs 1129 (hard-boiled) → boiled factors
 *     NDB 1123 (raw) vs 1128 (fried)        → fried factors
 *   Secondary: USDA Food Data table 1 (Bowman et al. 2017) for data-gap nutrients
 *   Where SR28 cooked entry shows 0 for a nutrient that raw has a value,
 *   that is a DATA GAP (not measured), not actual destruction.
 *   Those positions are filled with conservative literature estimates marked *.
 *
 * Cooking methods:
 *   raw        — no heat applied (1.0 for all)
 *   boiled     — moist heat ~100°C (poaching, simmering, hard/soft boiling)
 *   steamed    — moist heat ~100°C, no water contact (less mineral leaching than boiled)
 *   baked      — dry heat ~175–230°C (cakes, roasting, casseroles)
 *   fried      — dry/fat heat ~160–190°C (pan-fried, sautéed, stir-fried)
 *   grilled    — high dry heat >200°C, short duration (grill marks, broiling)
 *   microwave  — rapid moist/dry heat (similar to steamed, shorter duration)
 *   no_heat    — canned, pickled, marinated — heat already applied pre-purchase
 *
 * Retention factor: 0.0 = total loss, 1.0 = fully retained
 * A factor > 1.0 is never used; small SR28 concentration artifacts are clamped to 1.0.
 *
 * Column names match DataCentralCombo exactly so this can be applied directly.
 */

export type CookingMethod =
  | 'raw'
  | 'boiled'
  | 'steamed'
  | 'baked'
  | 'fried'
  | 'grilled'
  | 'microwave'
  | 'no_heat'
  | 'finish';

/** SR28 column name → display label */
export const NUTRIENT_LABELS: Record<string, string> = {
  Energy_KCal:                       'Energy (kcal)',
  Water:                             'Water',
  Protein:                           'Protein',
  TotalLipidFat:                     'Total Fat',
  Carbohydrate:                      'Carbohydrate',
  FiberTotalDietary:                 'Dietary Fibre',
  SugarsTotal:                       'Total Sugars',
  Cholesterol:                       'Cholesterol',
  // Fat quality
  FattyAcids_totalSaturated:        'Saturated Fat',
  FattyAcids_totalMonounsaturated:  'Monounsaturated Fat',
  FattyAcids_totalPolyunsaturated:  'Polyunsaturated Fat',
  LinoleicAcid:                      'Linoleic Acid (LA, ω-6)',
  alphaLinolenicAcid:               'Alpha-Linolenic Acid (ALA, ω-3)',
  EPA_20_5n3:                        'EPA (20:5 ω-3)',
  DPA_22_5n3:                        'DPA (22:5 ω-3)',
  DHA_22_6n3:                        'DHA (22:6 ω-3)',
  omega3:                            'Total Omega-3',
  omega6:                            'Total Omega-6',
  // Fat-soluble vitamins
  VitaminA_RAE:                      'Vitamin A (RAE)',
  Retinol:                           'Retinol',
  Carotene_beta:                     'Beta-Carotene',
  VitaminD:                          'Vitamin D',
  VitaminE_alphaTocopherol:         'Vitamin E (α-Tocopherol)',
  VitaminK_phylloquinone:           'Vitamin K',
  // Water-soluble vitamins
  VitaminC_totalAscorbicAcid:       'Vitamin C',
  Thiamin:                           'Thiamin (B1)',
  Riboflavin:                        'Riboflavin (B2)',
  Niacin:                            'Niacin (B3)',
  PantothenicAcid:                   'Pantothenic Acid (B5)',
  VitaminB6:                         'Vitamin B6',
  Folate_total:                      'Total Folate',
  Folate_food:                       'Food Folate',
  Folate_DFE:                        'Folate DFE',
  FolicAcid:                         'Folic Acid',
  VitaminB12:                        'Vitamin B12',
  Choline_total:                     'Choline',
  Betaine:                           'Betaine',
  // Carotenoids / antioxidants
  LuteinZeaxanthin:                  'Lutein + Zeaxanthin',
  Lycopene:                          'Lycopene',
  // Minerals
  Calcium_Ca:                        'Calcium',
  Iron_Fe:                           'Iron',
  Magnesium_Mg:                      'Magnesium',
  Phosphorus_P:                      'Phosphorus',
  Potassium_K:                       'Potassium',
  Sodium_Na:                         'Sodium',
  Zinc_Zn:                           'Zinc',
  Copper_Cu:                         'Copper',
  Manganese_Mn:                      'Manganese',
  Selenium_Se:                       'Selenium',
  // Amino acids
  Tryptophan:    'Tryptophan',   Threonine:   'Threonine',
  Isoleucine:    'Isoleucine',   Leucine:     'Leucine',
  Lysine:        'Lysine',       Methionine:  'Methionine',
  Cystine:       'Cystine',      Phenylalanine: 'Phenylalanine',
  Tyrosine:      'Tyrosine',     Valine:      'Valine',
  Arginine:      'Arginine',     Histidine:   'Histidine',
  Alanine:       'Alanine',      AsparticAcid: 'Aspartic Acid',
  GlutamicAcid:  'Glutamic Acid', Glycine:    'Glycine',
  Proline:       'Proline',      Serine:      'Serine',
};

/**
 * Retention factors keyed by [CookingMethod][NutrientColumn].
 *
 * A missing key means 1.0 (fully retained) — only losses are listed.
 * Values marked with a comment are literature estimates where SR28 has a data gap.
 *
 * DATA GAP NOTE: SR28 often omits fatty acid detail rows in cooked entries
 * (LinoleicAcid, alphaLinolenicAcid, omega6 show 0 in hard-boiled/fried) —
 * those are MEASUREMENT OMISSIONS, not real destruction.  Literature values used.
 */
export const COOKING_RETENTION: Record<CookingMethod, Partial<Record<string, number>>> = {

  // ── raw ─────────────────────────────────────────────────────────────────────
  // No heat. All factors 1.0 — represented as empty object.
  raw: {},

  // ── boiled ──────────────────────────────────────────────────────────────────
  // SR28 source: NDB 1123 (raw whole egg) → NDB 1129 (hard-boiled)
  // Water-loss factor: 100g raw → 93.97g cooked (6% water lost into cooking water)
  // Nutrient losses are a combination of heat destruction + leaching into cooking water.
  // All values rounded to 2 d.p.
  boiled: {
    // Macros — essentially stable (apparent changes are concentration artefacts)
    Protein:                          0.94,
    TotalLipidFat:                    1.00,
    Carbohydrate:                     1.00,
    Cholesterol:                      0.94,
    // Fat-soluble vitamins — stable in absence of oxidation, slight leaching
    VitaminA_RAE:                     0.88,
    Retinol:                          0.87,
    VitaminD:                         1.00,
    VitaminE_alphaTocopherol:         0.92,
    VitaminK_phylloquinone:           0.94,
    // Water-soluble vitamins — most vulnerable
    VitaminC_totalAscorbicAcid:       0.50, // heat + leach (literature; eggs have <1mg anyway)
    Thiamin:                          0.80, // leaches into water (literature corrected from SR28 artefact)
    Riboflavin:                       1.00, // stable
    Niacin:                           0.80,
    PantothenicAcid:                  0.85,
    VitaminB6:                        0.66, // SR28-derived; significant loss in water
    Folate_total:                     0.88,
    Folate_food:                      0.88,
    Folate_DFE:                       0.88,
    VitaminB12:                       1.00, // SR28 shows ~117% — concentration artefact, clamped
    Choline_total:                    0.94,
    Betaine:                          1.00, // SR28 artefact, betaine is water-stable
    // Carotenoids — heat-sensitive in yolk
    LuteinZeaxanthin:                 0.66, // SR28-derived; oxidative destruction
    Lycopene:                         0.90, // literature (eggs have near-zero anyway)
    // Minerals — leach into cooking water
    Calcium_Ca:                       0.84,
    Iron_Fe:                          0.64, // SR28-derived; significant leaching
    Magnesium_Mg:                     0.78,
    Phosphorus_P:                     0.82,
    Potassium_K:                      0.86,
    Sodium_Na:                        0.82,
    Zinc_Zn:                          0.77,
    Copper_Cu:                        0.85, // * literature; SR28 0.13 is a data anomaly for in-shell egg
    Manganese_Mn:                     0.94,
    Selenium_Se:                      0.94,
    // Fatty acids — PUFA vulnerable to oxidation
    FattyAcids_totalSaturated:        0.98,
    FattyAcids_totalMonounsaturated:  1.00,
    FattyAcids_totalPolyunsaturated:  0.69, // SR28-derived
    LinoleicAcid:                     0.88, // * literature; SR28 has data gap (0) for HB
    alphaLinolenicAcid:               0.78, // * literature; SR28 data gap
    EPA_20_5n3:                       0.70, // * literature
    DPA_22_5n3:                       0.70, // * literature; SR28 data gap
    DHA_22_6n3:                       0.56, // SR28-derived; significant oxidation
    omega3:                           0.72, // * weighted average of ALA+EPA+DPA+DHA
    omega6:                           0.88, // * literature; SR28 data gap
    // Amino acids — heat-stable, minor denaturation only
    Tryptophan: 0.94, Threonine: 0.94, Isoleucine: 0.94, Leucine: 0.94,
    Lysine: 0.94,     Methionine: 0.94, Cystine: 0.90, // Cystine slightly more vulnerable
    Phenylalanine: 0.94, Tyrosine: 0.94, Valine: 0.94,
    Arginine: 0.94, Histidine: 0.94,
  },

  // ── steamed ─────────────────────────────────────────────────────────────────
  // Similar temperature to boiling but NO water contact → less mineral/vitamin leaching.
  // Slightly better retention for water-soluble nutrients than boiled.
  steamed: {
    Protein:                          0.95,
    VitaminA_RAE:                     0.90,
    VitaminD:                         1.00,
    VitaminE_alphaTocopherol:         0.94,
    VitaminK_phylloquinone:           0.95,
    VitaminC_totalAscorbicAcid:       0.60, // better than boil, less leaching
    Thiamin:                          0.85,
    Riboflavin:                       1.00,
    Niacin:                           0.85,
    PantothenicAcid:                  0.90,
    VitaminB6:                        0.75, // better than boil (no water leach)
    Folate_total:                     0.92,
    Folate_food:                      0.92,
    Folate_DFE:                       0.92,
    VitaminB12:                       1.00,
    Choline_total:                    0.96,
    LuteinZeaxanthin:                 0.70,
    Calcium_Ca:                       0.92,
    Iron_Fe:                          0.80, // less leaching than boiled
    Magnesium_Mg:                     0.88,
    Phosphorus_P:                     0.90,
    Potassium_K:                      0.92,
    Sodium_Na:                        0.92,
    Zinc_Zn:                          0.88,
    Copper_Cu:                        0.90,
    Selenium_Se:                      0.96,
    FattyAcids_totalPolyunsaturated:  0.72,
    LinoleicAcid:                     0.90,
    alphaLinolenicAcid:               0.80,
    DHA_22_6n3:                       0.60,
    omega3:                           0.75,
    omega6:                           0.90,
    Cystine:                          0.92,
  },

  // ── baked ───────────────────────────────────────────────────────────────────
  // Dry heat 175–230°C.  No water contact so minerals don't leach.
  // Higher temperature increases PUFA oxidation vs boiling.
  // Applies to: cakes, bread, muffins, roasted vegetables/meat, casseroles.
  // Sources: derived from SR28 boiled egg + USDA cooking loss tables for dry heat.
  baked: {
    Protein:                          0.94,
    TotalLipidFat:                    1.00,
    Cholesterol:                      0.94,
    VitaminA_RAE:                     0.85,
    Retinol:                          0.84,
    Carotene_beta:                    0.80,
    VitaminD:                         0.95,
    VitaminE_alphaTocopherol:         0.88, // oxidation at higher temp
    VitaminK_phylloquinone:           0.92,
    // Water-soluble vitamins: no water leaching → better than boiled
    VitaminC_totalAscorbicAcid:       0.55, // heat destruction only
    Thiamin:                          0.75, // heat labile, no leaching
    Riboflavin:                       0.95,
    Niacin:                           0.90,
    PantothenicAcid:                  0.88,
    VitaminB6:                        0.75, // heat loss only (no water bath)
    Folate_total:                     0.90,
    Folate_food:                      0.90,
    Folate_DFE:                       0.90,
    VitaminB12:                       0.96,
    Choline_total:                    0.92,
    // Carotenoids
    LuteinZeaxanthin:                 0.62, // similar heat oxidation to boiling
    Lycopene:                         0.85,
    // Minerals — no leaching, minimal loss
    Calcium_Ca:                       0.96,
    Iron_Fe:                          0.90,
    Magnesium_Mg:                     0.94,
    Phosphorus_P:                     0.94,
    Potassium_K:                      0.92,
    Sodium_Na:                        0.96,
    Zinc_Zn:                          0.92,
    Copper_Cu:                        0.92,
    Selenium_Se:                      0.96,
    // Fatty acids — more oxidation at higher temp
    FattyAcids_totalSaturated:        0.98,
    FattyAcids_totalMonounsaturated:  0.96,
    FattyAcids_totalPolyunsaturated:  0.65,
    LinoleicAcid:                     0.82,
    alphaLinolenicAcid:               0.72,
    EPA_20_5n3:                       0.65,
    DPA_22_5n3:                       0.65,
    DHA_22_6n3:                       0.55,
    omega3:                           0.68,
    omega6:                           0.82,
    // Amino acids
    Tryptophan: 0.93, Threonine: 0.93, Isoleucine: 0.93, Leucine: 0.93,
    Lysine: 0.90,     Methionine: 0.92, Cystine: 0.86,  // Maillard reaction (browning)
    Phenylalanine: 0.93, Tyrosine: 0.93, Valine: 0.93,
    Arginine: 0.90, Histidine: 0.93,
  },

  // ── fried ───────────────────────────────────────────────────────────────────
  // SR28 source: NDB 1123 (raw whole egg) → NDB 1128 (fried)
  // 100g raw → ~78g fried (22% water loss — much more than boiling).
  // Note: added cooking fat shifts total fat/kcal — account for that separately.
  fried: {
    Protein:                          0.85,
    TotalLipidFat:                    1.00,
    Cholesterol:                      0.84,
    VitaminA_RAE:                     0.84,
    Retinol:                          0.84,
    VitaminD:                         0.84,
    VitaminE_alphaTocopherol:         0.88,
    VitaminK_phylloquinone:           0.92,
    VitaminC_totalAscorbicAcid:       0.45, // high heat + oxidation
    Thiamin:                          0.78,
    Riboflavin:                       0.90,
    Niacin:                           0.88,
    PantothenicAcid:                  0.85,
    VitaminB6:                        0.83,
    Folate_total:                     0.85,
    Folate_food:                      0.85,
    Folate_DFE:                       0.85,
    VitaminB12:                       0.90,
    Choline_total:                    0.84,
    LuteinZeaxanthin:                 0.84,
    Calcium_Ca:                       0.84,
    Iron_Fe:                          0.84,
    Magnesium_Mg:                     0.85,
    Phosphorus_P:                     0.85,
    Potassium_K:                      0.85,
    Sodium_Na:                        0.85,
    Zinc_Zn:                          0.84,
    Copper_Cu:                        0.78,
    Selenium_Se:                      0.84,
    FattyAcids_totalSaturated:        0.95,
    FattyAcids_totalMonounsaturated:  0.95,
    FattyAcids_totalPolyunsaturated:  0.60,
    LinoleicAcid:                     0.76, // * literature
    alphaLinolenicAcid:               0.68, // * literature
    EPA_20_5n3:                       0.60,
    DPA_22_5n3:                       0.78,
    DHA_22_6n3:                       0.58,
    omega3:                           0.59,
    omega6:                           0.78, // * literature
    Tryptophan: 0.85, Threonine: 0.85, Isoleucine: 0.85, Leucine: 0.85,
    Lysine: 0.82,     Methionine: 0.84, Cystine: 0.80,
    Phenylalanine: 0.85, Tyrosine: 0.85, Valine: 0.85,
    Arginine: 0.82, Histidine: 0.85,
  },

  // ── grilled ─────────────────────────────────────────────────────────────────
  // High dry heat >200°C, shorter duration.
  // Intense surface heat causes more Maillard/charring on lysine, more PUFA oxidation.
  // Similar water loss to fried.
  grilled: {
    Protein:                          0.85,
    TotalLipidFat:                    0.90, // fat drips away
    VitaminA_RAE:                     0.82,
    Retinol:                          0.82,
    Carotene_beta:                    0.78,
    VitaminD:                         0.88,
    VitaminE_alphaTocopherol:         0.82,
    VitaminK_phylloquinone:           0.88,
    VitaminC_totalAscorbicAcid:       0.40,
    Thiamin:                          0.70,
    Riboflavin:                       0.88,
    Niacin:                           0.88,
    PantothenicAcid:                  0.82,
    VitaminB6:                        0.72,
    Folate_total:                     0.80,
    Folate_food:                      0.80,
    Folate_DFE:                       0.80,
    VitaminB12:                       0.88,
    Choline_total:                    0.84,
    LuteinZeaxanthin:                 0.60,
    Lycopene:                         0.80,
    Calcium_Ca:                       0.90,
    Iron_Fe:                          0.88,
    Magnesium_Mg:                     0.88,
    Phosphorus_P:                     0.88,
    Potassium_K:                      0.88,
    Sodium_Na:                        0.90,
    Zinc_Zn:                          0.88,
    Copper_Cu:                        0.84,
    Selenium_Se:                      0.90,
    FattyAcids_totalSaturated:        0.88,
    FattyAcids_totalMonounsaturated:  0.88,
    FattyAcids_totalPolyunsaturated:  0.55,
    LinoleicAcid:                     0.72,
    alphaLinolenicAcid:               0.62,
    EPA_20_5n3:                       0.58,
    DPA_22_5n3:                       0.58,
    DHA_22_6n3:                       0.50,
    omega3:                           0.60,
    omega6:                           0.72,
    Lysine: 0.80, Cystine: 0.76, Arginine: 0.80, // Maillard most severe
    Tryptophan: 0.84, Threonine: 0.84, Methionine: 0.82,
  },

  // ── microwave ───────────────────────────────────────────────────────────────
  // Rapid moist heat, typically 1–5 min. Short duration limits oxidation.
  // No water leaching (food stays in vessel). Minimal PUFA oxidation.
  // Generally best of all cooking methods for micronutrient retention.
  microwave: {
    Protein:                          0.96,
    VitaminA_RAE:                     0.92,
    VitaminD:                         1.00,
    VitaminE_alphaTocopherol:         0.94,
    VitaminK_phylloquinone:           0.96,
    VitaminC_totalAscorbicAcid:       0.72, // better than all other methods
    Thiamin:                          0.84,
    Riboflavin:                       0.98,
    Niacin:                           0.92,
    PantothenicAcid:                  0.92,
    VitaminB6:                        0.80,
    Folate_total:                     0.92,
    Folate_food:                      0.92,
    Folate_DFE:                       0.92,
    VitaminB12:                       0.98,
    Choline_total:                    0.96,
    LuteinZeaxanthin:                 0.78,
    Calcium_Ca:                       0.96,
    Iron_Fe:                          0.92,
    Magnesium_Mg:                     0.94,
    Phosphorus_P:                     0.96,
    Potassium_K:                      0.94,
    Selenium_Se:                      0.96,
    FattyAcids_totalPolyunsaturated:  0.78,
    LinoleicAcid:                     0.88,
    alphaLinolenicAcid:               0.82,
    DHA_22_6n3:                       0.72,
    omega3:                           0.80,
    omega6:                           0.88,
  },

  // ── no_heat ─────────────────────────────────────────────────────────────────
  // Ingredient was purchased already cooked/processed (canned, deli, rotisserie).
  // The cooking loss already happened before measurement.
  // Use the SR28 cooked entry directly — no further factor applied.
  no_heat: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility: apply retention to a single nutrient value
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the retained nutrient amount after cooking.
 *
 * @param rawValuePer100g   SR28 value for the nutrient (per 100g raw)
 * @param rawWeightGrams    Actual weight of the ingredient as measured in the recipe
 * @param method            Cooking method applied
 * @param nutrientKey       DataCentralCombo column name
 */
export function applyRetention(
  rawValuePer100g: number,
  rawWeightGrams: number,
  method: CookingMethod,
  nutrientKey: string,
): number {
  const factor = COOKING_RETENTION[method][nutrientKey] ?? 1.0;
  return rawValuePer100g * (rawWeightGrams / 100) * factor;
}

/**
 * Returns the retention factor for a nutrient + cooking method.
 * Returns 1.0 if not listed (nutrient is stable under that method).
 */
export function getRetentionFactor(method: CookingMethod, nutrientKey: string): number {
  return COOKING_RETENTION[method][nutrientKey] ?? 1.0;
}

/**
 * Nutrients that show significant loss (< 0.80) under the given method.
 * Useful for displaying warnings in the UI.
 */
export function getSignificantLosses(
  method: CookingMethod,
  threshold = 0.80,
): Array<{ key: string; label: string; retention: number }> {
  const entries = COOKING_RETENTION[method];
  return (Object.entries(entries) as [string, number][])
    .filter(([, v]) => v < threshold)
    .sort(([, a], [, b]) => a - b)
    .map(([key, retention]) => ({
      key,
      label: NUTRIENT_LABELS[key] ?? key,
      retention,
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SR28 DB integration helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * cookMethod values in DataCentralCombo that indicate the ingredient is in a
 * raw / unprocessed state.  Everything outside this set is already cooked.
 * 'z' is a null-placeholder used by the developer to normalise the column.
 */
const RAW_COOK_METHODS = new Set([
  'Raw', 'raw', 'Unprepared', 'Uncooked', 'Unheated', 'Unroasted',
  'Not Prepared', 'Raw or Unheated', 'z', 'null', 'N/A',
]);

/**
 * Long_Desc keywords that indicate the entry represents a cooked/finished state,
 * used as a fallback when cookMethod is 'z' (null-placeholder).
 *
 * Includes explicit cooking verbs AND SR28 provenance phrases that indicate the
 * entry was measured on a finished product:
 *   "prepared from recipe"  — recipe-level SR28 dish entry (already cooked)
 *   "commercially prepared" — manufactured product (already processed/baked/cooked)
 *   "Restaurant,"           — restaurant dish (already cooked and served)
 *   "Fast foods,"           — fast-food item (already cooked)
 *   "frozen entree"         — heat-and-eat product (pre-cooked)
 *
 * NOTE: `, prepared` (comma-space-prepared) intentionally does NOT match
 * "unprepared" — the comma guard is critical.
 */
const COOKED_DESC_KEYWORDS = [
  // Explicit cooking verbs
  'cooked', 'baked', 'roasted', 'fried', 'boiled', 'grilled', 'broiled',
  'steamed', 'smoked', 'canned', 'microwaved', 'sauteed', 'stewed',
  'braised', 'poached', 'heated', 'toasted', 'blanched', 'parboiled',
  'scrambled', 'kippered', 'pickled',
  // SR28 provenance phrases — finished/prepared products
  'prepared from recipe', 'commercially prepared', 'restaurant,', 'restaurant',
  'fast foods,', 'frozen entree', 'frozen, prepared', 'home-prepared',
  'ready-to-serve', 'ready-to-eat', 'ready to eat',
  // Additional patterns for processed/finished foods
  ', prepared',   // "box mix, prepared" — comma-guard prevents matching "unprepared"
  'commercial',   // "hummus, commercial" etc.
  'cookies,',     // "Cookies, fig bars", "Cookies, gingersnaps" etc.
  'doughnut',     // "Doughnuts, cake-type"
  'strudel',      // "Strudel, apple"
  'pie,',         // "Pie, peach", "Pie, apple" — SR28 dish entries
  'rolls,',       // "Rolls, dinner, sweet/wheat/plain"
  ' salad',       // "tuna salad", "taco salad"
  'shake',        // "Milk shakes, thick chocolate"
  'sandwich',     // any sandwich entry
  'submarine',    // "SUBWAY CLUB sub on white bread" — SR28 uses "submarine" in curedFresh
  'burrito',      // "Burrito, bean and cheese, frozen"
  'sauce,',       // "Sauce, peanut, made from ..." — prepared sauces
];

/**
 * Determines whether a DataCentralCombo row represents an ingredient that is
 * already in a cooked/processed state (returns 'no_heat') or is still raw
 * (returns 'raw') and should have cooking retention factors applied.
 *
 * Resolution order:
 *   1. curedFresh contains 'Canned'   → no_heat  (heat-processed during canning)
 *   2. cookMethod is an explicit cooked value  → no_heat
 *   3. cookMethod is 'z' (null-placeholder) AND Long_Desc contains cooked keyword → no_heat
 *   4. Otherwise                       → raw
 *
 * @param cookMethod  DataCentralCombo.cookMethod
 * @param curedFresh  DataCentralCombo.curedFresh
 * @param longDesc    DataCentralCombo.Long_Desc
 */
export function resolveIngredientState(
  cookMethod: string | null,
  curedFresh: string | null,
  longDesc: string,
): 'raw' | 'no_heat' {
  // 1. Canned always means already heat-processed
  if (curedFresh && curedFresh.toLowerCase().includes('canned')) return 'no_heat';

  const method = cookMethod ?? 'z';

  // 2. Explicit cooked cookMethod
  if (!RAW_COOK_METHODS.has(method)) return 'no_heat';

  // 3. 'z' placeholder — fall through to Long_Desc and curedFresh
  if (method === 'z' || method === 'null') {
    const desc = (longDesc + ' ' + (curedFresh ?? '')).toLowerCase();
    if (COOKED_DESC_KEYWORDS.some((kw) => desc.includes(kw))) return 'no_heat';
  }

  // 4. Raw
  return 'raw';
}

/**
 * Maps a dish-level DataCentralCombo.cookMethod string to a CookingMethod
 * for the retention model.
 *
 * Used to determine what retention factors to apply to the raw ingredients
 * of a recipe, based on the overall cooking method of the finished dish.
 *
 * Returns 'raw' (no adjustment) when the method cannot be determined — this
 * is the conservative "safe" default that matches what every other app does.
 *
 * @param cookMethod  DataCentralCombo.cookMethod from the dish-level NDB row
 */
export function mapDishMethodToCookingMethod(cookMethod: string | null): CookingMethod {
  if (!cookMethod) return 'raw';

  const m = cookMethod.toLowerCase();

  if (m === 'pan grilled' || m === 'pan_grilled') return 'fried';

  if (/microwav/.test(m)) return 'microwave';

  if (/steam/.test(m)) return 'steamed';

  if (
    /grill|broil|barbecue|bbq/.test(m)
  ) return 'grilled';

  if (
    /pan.?fr|stir.?fr|saut|scrambl|pan.?brow|pan.?broil|pan.?sear|\bsear|fast.?fr|fr.*flour|fr.*batt|batter.*fr|french.?fr|breaded.*fr|reheated.*bread|par.?fr|home.?prep/.test(m) ||
    m === 'fried' || m === 'fry' || m === 'sauté' || m === 'sautéed' || m === 'pan sear'
  ) return 'fried';

  if (
    /bak|roast|dry.?heat|oven|rotisserie|toasted|oil.?roast/.test(m)
  ) return 'baked'; // includes 'bake covered' via /bak/

  if (
    /boil|brais|stew|simmer|moist.?heat|cooked|poach|parboil|blanch/.test(m)
  ) return 'boiled';

  return 'raw';
}
