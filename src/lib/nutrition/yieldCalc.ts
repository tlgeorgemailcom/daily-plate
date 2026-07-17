/**
 * yieldCalc.ts — Physics-based water yield calculator.
 *
 * TypeScript port of recipes_v3/lib/yield_calc.py (Python, curator pipeline).
 * Constants seeded from yield_calc.py calibration values, 2026-05-14.
 * The two pipelines are independent — constants evolve separately.
 *
 * ALGORITHM
 * ─────────
 * Moisture loss follows first-order exponential decay applied only to the
 * "free" water fraction of the filling:
 *
 *   yield_water = (bound_water + free_water_after_stages) / initial_water
 *   free_water[i] = free_water[i-1] × exp(−k(T) × t)
 *   k(T) = K_REF × (T_°F / T_REF) ^ N_TEMP
 *
 * Processing order: stovetop boil first (Stage 0), then oven stages in sequence.
 *
 * See docs/vercel_pipeline.md §5 for full specification.
 */

// ── Calibration constants ─────────────────────────────────────────────────────

const K_REF      = 0.008;   // base evaporation rate constant at T_REF (per min)
const N_TEMP     = 1.8;     // temperature sensitivity exponent
const T_REF      = 350.0;   // reference temperature °F
const BOIL_K_REF = 0.236;   // open-pot stovetop evaporation rate constant
                             // ~29× higher than oven k — convective surface evap
const BOIL_T_REF = 212.0;   // rolling boil reference temperature °F

// Temperature-scaled stovetop evaporation rate.
//   boiled     (212 °F) → 0.236       (baseline)
//   simmer     (195 °F) → ≈ 0.198  (−16 %)
//   sub-simmer (180 °F) → ≈ 0.163  (−31 %)
//   braise (covered) uses BRAISE_LID_FACTOR regardless of temp
function stovetopRateConstant(tempF: number): number {
  return BOIL_K_REF * Math.pow(tempF / BOIL_T_REF, N_TEMP);
}
const BRAISE_LID_FACTOR = 0.05;  // lid traps ~95 % of steam; only ~5 % escapes

// ── Binding coefficients ──────────────────────────────────────────────────────
// Fraction of initial water that is free to evaporate (0 = none, 1 = all).
// Back-calculated from locked curated recipes (May 2026).

export const BINDING: Record<string, number> = {
  dense_fruit:       0.94,   // apple/pear baked open
  strudel_fruit:     0.55,   // fruit in wrapped pastry
  thickened_fruit:   0.25,   // cornstarch-thickened berry/cherry
  mincemeat:         0.57,   // dried/cooked fruit + fat + spirits
  moderate_fruit:    0.40,   // partially thickened stone fruit
  syrup_custard:     0.53,   // corn syrup / egg matrix
  vegetable_custard: 0.12,   // pumpkin/squash purée
  dairy_custard:     0.33,   // cream/milk/egg custard
  starch_custard:    0.099,  // cornstarch-thickened custard (crème pâtissière)
  cake_batter:       0.74,   // flour/butter/egg batter
  pastry:            0.782,  // blind-baked pie crust
  crumb_crust:       0.432,  // baked cookie/cracker crumb crust
  none:              0.00,   // stovetop cold-set or no-bake — no evaporation
  // ── Stovetop / fried / grilled fill classes ─────────────────────────────
  // Calibrated from locked BKFST values using stovetop evaporation model.
  simmer_sauce:       0.127, // simmered gravy/sauce (195°F×5min → yfw=0.92)
  pan_grilled_batter: 0.206, // pan-grilled bread/batter (350°F×6min → yfw=0.80)
  fried_meat:         0.272, // fried ground meat patty/sausage (375°F×8min → yfw=0.73)
  fried_ground_beef:  0.544, // pan-browned ground beef crumbles (212°F×7min → yfw=0.5606)
                             // NDB 23572 (80% lean raw) / NDB 23575 (crumbles pan-browned) USDA pair
                             // Use for crumbled beef (tacos, bolognese, sloppy joe); NOT for patties
  pan_grilled_masa:   0.544, // pan-grilled thick masa cake (gordita, arepa) (212°F×11min → yfw=0.4968)
                             // NDB 20017 (masa harina raw) / NDB 36415 (arepa restaurant) USDA proxy
  fried_potato:       0.750, // fried potato high surface area (375°F×10min → yfw=0.25)
  deep_fried_potato: 1.280, // deep-fried potato strips (french fries) (212°F×4min → yfw=0.21)
                             // binding > 1.0 models rapid water displacement by hot-oil immersion at 325°F.
                             // Calibrated to SIDE_031 original locked yfw=0.21.
  deep_fried_battered_ring: 1.025, // deep-fried battered rings (onion rings) (212°F×5min → yfw=0.29)
                             // USDA NDB 21130 (fast-food onion rings) water=24.52% corroborates. Calibrated to SIDE_033 locked yfw=0.29.
  grilled_batter:     0.408, // waffle-iron grilled batter (375°F×4min → yfw=0.62)
  pan_grilled_chicken: 0.216, // pan-grilled chicken breast (212°F×11min → yfw=0.80)
                              // NDB 5062 (raw) / NDB 5063 (fried) USDA pair
  fried_chicken:       0.195, // deep-fried battered chicken breast (212°F×11min → yfw=0.82)
                              // NDB 5062 (raw) / NDB 5063 (fried); batter crust traps moisture
  fried_battered_vegetable: 0.493, // small battered-fried vegetable pieces (okra, squash) (212°F×3min → yfw=0.75)
                              // No USDA fried-okra NDB; calibrated to SIDE_022/023 locked yfw=0.75 (culinary estimate)
                              // FNDDS FC 75414500 (fried okra) corroborates rapid water loss from small high-surface-area pieces
  braised_leafy_vegetable: 0.350, // slow-braised leafy greens (collards, kale) (195°F×55min → yfw=0.65)
                              // No USDA raw/braised collard NDB pair; calibrated to SIDE_028 locked yfw=0.65
  glazed_vegetable:      0.280, // short-simmered glazed vegetables (carrots, etc.) (195°F×6min → yfw=0.80)
                              // carrot_raw boil_yfw=1.25 (absorbs water); fill_class required to override. Calibrated to SIDE_032 locked yfw=0.80.
  wilt_squeezed_spinach:  1.480, // pan-wilted then hand-squeezed spinach (180°F×3min → yfw=0.39)
                              // binding > 1.0 extrapolates beyond pure evaporation to model mechanical squeezing.
                              // spinach_raw boil_yfw=0.961 (natural boil); this fill_class overrides for wilt+squeeze.
  // ── Oven-baked proteins ──────────────────────────────────────────────────
  // Calibrated from USDA raw/cooked NDB pairs; use oven stages (cook_stages).
  baked_pork:         0.880, // slow-roasted pork shoulder/butt (300°F×100min → yfw=0.60)
                             // NDB 10080 (raw) / NDB 10082 (roasted) USDA pair
  braised_beef:        0.940, // slow-braised beef brisket (275°F×100min → yfw=0.62)
                             // NDB 13803 (raw) / NDB 13804 (braised) USDA pair; 100-min partial cook
  // ── Stock / broth classes ──────────────────────────────────────────────────
  // Binding drives yfw; STOCK_EXTRACTION in buildRecipeCommunityV3.ts handles yfp/yff/yfc/yfo.
  chicken_stock: 0.320, // clear stock 3–4h sub-simmer 180°F → yfw=0.680 (STOCK_001–004)
                        // back-calc: f=0.320, k×t converged at any t>60min
  bone_broth:    0.320, // 24h sub-simmer → same yfw=0.680 (deeper yfp=0.395 in STOCK_EXTRACTION)
  fish_stock:    0.101, // clear fish stock, 25min sub-simmer 180°F → yfw=0.900 (STOCK_006)
                        // back-calc: f=0.100, binding=0.100/(1-exp(-0.1758×25))=0.1013
  vegetable_stock: 0.180, // vegetable stock, 55min sub-simmer 180°F → yfw=0.820 (STOCK_007)
                          // back-calc: f=0.180, binding=0.180/(1-exp(-0.1758×55))=0.180
  // meringue: NOT included — model invalid for surface-browning sections.
  // Never pass 'meringue' to this function. inferFillingClass() never emits it.
};

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Evaporation rate constant k at temperature tempF (°F).
 */
export function rateConstant(tempF: number): number {
  return K_REF * Math.pow(tempF / T_REF, N_TEMP);
}

/**
 * Compute yield_water for a filling section cooked through optional stovetop
 * boiling followed by zero or more oven-bake stages.
 *
 * @param stages        Ordered list of oven [tempF, minutes] pairs.
 *                      Single stage:    [[350, 55]]
 *                      Two-stage:       [[425, 15], [350, 45]]
 *                      Boil-only:       []
 * @param initialWaterG Total water mass (g) in the raw filling ingredients.
 * @param fillingClass  Key from BINDING. Defaults to 'none' (yfw = 1.0).
 * @param boilMinutes   Minutes of open-pot stovetop boiling BEFORE oven stages.
 * @param boilTempF     Stovetop temperature °F (default 212 = rolling boil).
 *                      Pass 195 for 'simmer', 180 for 'sub-simmer', 185 for 'braise'.
 * @param lidOn         True for covered cooking (braise). Multiplies stovetop k
 *                      by BRAISE_LID_FACTOR (0.05) — lid recycles ~95 % of steam.
 *
 * @returns yield_water (0 < value ≤ 1.0)
 *
 * @example
 * // Pumpkin pie: two-stage bake, vegetable custard
 * calcYieldWater([[425, 15], [350, 45]], 756.0, 'vegetable_custard') // ≈ 0.959
 *
 * // Vanilla custard: stovetop boil only
 * calcYieldWater([], 380.0, 'dairy_custard', 8.0) // ≈ 0.720
 *
 * // Braise (covered) 60 min — almost no water loss
 * calcYieldWater([], 400.0, 'none', 60, 185, true) // ≈ 0.998
 */
export function calcYieldWater(
  stages: Array<[tempF: number, minutes: number]>,
  initialWaterG: number,
  fillingClass: string = 'none',
  boilMinutes: number = 0,
  boilTempF: number = 212,
  lidOn: boolean = false,
): number {
  if (initialWaterG <= 0) return 1.0;

  const binding    = BINDING[fillingClass] ?? BINDING['none'];
  let freeWater    = initialWaterG * binding;
  const boundWater = initialWaterG * (1.0 - binding);

  // Stage 0: stovetop evaporation (temperature-scaled; lid halves rate when covered)
  if (boilMinutes > 0) {
    const k = stovetopRateConstant(boilTempF) * (lidOn ? BRAISE_LID_FACTOR : 1);
    freeWater *= Math.exp(-k * boilMinutes);
  }

  // Stages 1-N: oven bake (diffusion-limited, temperature-dependent)
  for (const [tempF, minutes] of stages) {
    if (minutes <= 0) continue;
    const k = rateConstant(tempF);
    freeWater *= Math.exp(-k * minutes);
  }

  return (freeWater + boundWater) / initialWaterG;
}

// ── Validation (run with: npx tsx src/lib/nutrition/yieldCalc.ts) ─────────────

const CALIBRATION_CASES: Array<{
  recipe: string;
  fillingClass: string;
  stages: Array<[number, number]>;
  boilMinutes?: number;
  initialWater: number;
  expected: number;
}> = [
  { recipe: 'SWEET_001 Apple Pie',             fillingClass: 'thickened_fruit',   stages: [[425, 15], [350, 37]], boilMinutes: 5, initialWater: 722.5, expected: 0.807 },
  { recipe: 'SWEET_002 Apple Strudel',         fillingClass: 'strudel_fruit',     stages: [[375, 35]],            initialWater: 380.0, expected: 0.85 },
  { recipe: 'SWEET_004 Blueberry Pie',         fillingClass: 'thickened_fruit',   stages: [[425, 25], [375, 52]], initialWater: 420.0, expected: 0.87 },
  { recipe: 'SWEET_005 Cherry Pie',            fillingClass: 'thickened_fruit',   stages: [[425, 25], [375, 52]], initialWater: 380.0, expected: 0.87 },
  { recipe: 'SWEET_007 Mince Pie',             fillingClass: 'mincemeat',         stages: [[425, 20], [375, 32]], initialWater: 320.0, expected: 0.77 },
  { recipe: 'SWEET_008 Peach Pie',             fillingClass: 'moderate_fruit',    stages: [[425, 20], [375, 27]], initialWater: 480.0, expected: 0.85 },
  { recipe: 'SWEET_009 Pecan Pie',             fillingClass: 'syrup_custard',     stages: [[350, 55]],            initialWater: 213.3, expected: 0.81 },
  { recipe: 'SWEET_010 Pumpkin Pie',           fillingClass: 'vegetable_custard', stages: [[425, 15], [350, 45]], initialWater: 756.0, expected: 0.95 },
  { recipe: 'SWEET_012 Pineapple Upside-Down', fillingClass: 'cake_batter',       stages: [[350, 24]],            initialWater: 310.0, expected: 0.87 },
  { recipe: 'SWEET_015 Egg Custard Pie',       fillingClass: 'dairy_custard',     stages: [[325, 40]],            initialWater: 380.0, expected: 0.92 },
];

export function validateCalibration(tolerance = 0.02): void {
  const pad = (s: string, n: number) => s.padEnd(n);
  console.log(`${pad('Recipe', 30)} ${pad('Class', 22)} ${'Calc'.padStart(6)} ${'Exp'.padStart(6)} ${'Δ'.padStart(7)}  OK`);
  console.log('─'.repeat(78));
  let allPass = true;
  for (const c of CALIBRATION_CASES) {
    const calc  = calcYieldWater(c.stages, c.initialWater, c.fillingClass, c.boilMinutes ?? 0);
    const delta = calc - c.expected;
    const ok    = Math.abs(delta) <= tolerance;
    if (!ok) allPass = false;
    console.log(`${pad(c.recipe, 30)} ${pad(c.fillingClass, 22)} ${calc.toFixed(3).padStart(6)} ${c.expected.toFixed(3).padStart(6)} ${(delta >= 0 ? '+' : '') + delta.toFixed(3).padStart(6)}  ${ok ? '✓' : '✗'}`);
  }
  console.log();
  console.log(allPass ? 'All calibration cases pass.' : '⚠ One or more cases failed.');
}

// Allow running directly: npx tsx src/lib/nutrition/yieldCalc.ts
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('yieldCalc.ts')) {
  validateCalibration();
}
