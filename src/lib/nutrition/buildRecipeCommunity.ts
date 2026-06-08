/**
 * buildRecipeCommunity.ts — Section-aware nutrition build for community recipes.
 *
 * Entry point:  buildRecipeCommunity()
 *
 * Called from TWO places:
 *   1. Browser (live preview) — on every form change, Svelte reactive. NutrientRow
 *      data comes from ingredient search results embedded at search time.
 *   2. Server (save/submit) — authoritative calculation at POST/PATCH. NutrientRow
 *      data fetched fresh from Turso inside the endpoint.
 *
 * Both callers supply the same CommunityIngredient[] + NutrientRow lookup map,
 * so results are always identical given the same inputs.
 *
 * ALGORITHM OVERVIEW
 * ──────────────────
 * 1. Partition active ingredients by section.
 * 2. For each section:
 *    a. Look up NutrientRow for each ingredient.
 *    b. Infer fillingClass via inferFillingClass().
 *    c. Compute initialWaterG = Σ (water_per_100g / 100 × grams).
 *    d. Compute yieldWater via calcYieldWater().
 *    e. For each nutrient:
 *         retained = applyRetention(rawPer100g, grams, cookMethod, key)
 *    f. Scale retained totals by yieldWater (only Water column).
 * 3. Sum across all sections.
 * 4. Divide by total cooked grams → per-100g profile.
 * 5. Plausibility check.
 *
 * See docs/vercel_pipeline.md §5–§8 for full specification.
 */

import type {
  CommunitySection,
  CommunityIngredient,
  NutrientRow,
  BuildResult,
  SectionBuildResult,
  MacroMap,
  SkippedIngredient,
} from './types.js';
import { inferFillingClass } from './inferFillingClass.js';
import { calcYieldWater }    from './yieldCalc.js';
import { plausibilityCheck } from './plausibilityCheck.js';
import {
  applyRetention,
  mapDishMethodToCookingMethod,
  type CookingMethod,
} from '$lib/data/cookingLossModel.js';

// ── Nutrient keys we actually sum (all numeric keys of NutrientRow) ───────────
const MACRO_KEYS: Array<keyof Omit<NutrientRow, 'ndbNo' | 'longDesc' | 'fdGrpCd'>> = [
  'energy_KCal',
  'water',
  'protein',
  'totalLipidFat',
  'carbohydrate',
  'sugarsTotal',
  'fiberTotalDietary',
  'ash',
  'fattyAcids_totalSaturated',
  'fattyAcids_totalMonounsaturated',
  'fattyAcids_totalPolyunsaturated',
  'cholesterol',
  'calcium_Ca',
  'iron_Fe',
  'magnesium_Mg',
  'phosphorus_P',
  'potassium_K',
  'sodium_Na',
  'zinc_Zn',
  'vitaminC_totalAscorbicAcid',
  'thiamin',
  'riboflavin',
  'niacin',
  'vitaminB6',
  'folateDFE',
  'vitaminB12',
  'vitaminA_RAE',
  'vitaminD',
  'vitaminE_alphaTocopherol',
  'vitaminK_phylloquinone',
];

// Map NutrientRow camelCase keys → DataCentralCombo column names for applyRetention
const KEY_TO_COLUMN: Partial<Record<keyof Omit<NutrientRow, 'ndbNo' | 'longDesc' | 'fdGrpCd'>, string>> = {
  energy_KCal:                   'Energy_KCal',
  water:                         'Water',
  protein:                       'Protein',
  totalLipidFat:                 'TotalLipidFat',
  carbohydrate:                  'Carbohydrate',
  sugarsTotal:                   'SugarsTotal',
  fiberTotalDietary:             'FiberTotalDietary',
  ash:                           'Ash',
  fattyAcids_totalSaturated:    'FattyAcids_totalSaturated',
  fattyAcids_totalMonounsaturated: 'FattyAcids_totalMonounsaturated',
  fattyAcids_totalPolyunsaturated: 'FattyAcids_totalPolyunsaturated',
  cholesterol:                   'Cholesterol',
  calcium_Ca:                    'Calcium_Ca',
  iron_Fe:                       'Iron_Fe',
  magnesium_Mg:                  'Magnesium_Mg',
  phosphorus_P:                  'Phosphorus_P',
  potassium_K:                   'Potassium_K',
  sodium_Na:                     'Sodium_Na',
  zinc_Zn:                       'Zinc_Zn',
  vitaminC_totalAscorbicAcid:   'VitaminC_totalAscorbicAcid',
  thiamin:                       'Thiamin',
  riboflavin:                    'Riboflavin',
  niacin:                        'Niacin',
  vitaminB6:                     'VitaminB6',
  folateDFE:                     'Folate_DFE',
  vitaminB12:                    'VitaminB12',
  vitaminA_RAE:                  'VitaminA_RAE',
  vitaminD:                      'VitaminD',
  vitaminE_alphaTocopherol:     'VitaminE_alphaTocopherol',
  vitaminK_phylloquinone:       'VitaminK_phylloquinone',
};

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Build the nutrition profile for a community recipe.
 *
 * @param sections      Section metadata array (order matters for wrappedSection check).
 * @param ingredients   All recipe ingredients.
 * @param nutrientMap   NutrientRow keyed by ndbNo. Caller provides from search
 *                      results (browser) or Turso fetch (server).
 * @param servings      Number of servings — used for per-serving output.
 * @param gramsPerServing Expected grams per serving for density check.
 */
export function buildRecipeCommunity(
  sections: CommunitySection[],
  ingredients: CommunityIngredient[],
  nutrientMap: Map<string, NutrientRow>,
  servings: number,
  gramsPerServing: number,
): BuildResult {
  const sectionResults: SectionBuildResult[] = [];
  const globalSkipped: SkippedIngredient[]   = [];

  // ── Partition ingredients by section ────────────────────────────────────────
  // Ingredients without a sectionKey go into the implicit "__unsectioned__" bucket
  // which is treated as a single raw section.
  const sectionKeys = sections.map(s => s.sectionKey);
  const buckets = new Map<string, CommunityIngredient[]>();
  for (const sk of [...sectionKeys, '__unsectioned__']) {
    buckets.set(sk, []);
  }
  for (const ing of ingredients) {
    const key = ing.sectionKey ?? '__unsectioned__';
    const bucket = buckets.get(key) ?? buckets.get('__unsectioned__')!;
    bucket.push(ing);
  }

  // ── Determine which sections are "wrapped" (enclosed in a pastry section) ────
  // Heuristic: if there is a section with filling class pastry/crumb AND a
  // subsequent section labelled filling/fruit/custard, flag the latter as wrapped.
  // For community recipes we allow the user to flag wrappedSection explicitly
  // (future feature). For now: look for a pastry-named section before filling-named.
  const wrappedKeys = new Set<string>();
  let hasPastrySection = false;
  for (const sec of sections) {
    const lbl = sec.sectionLabel.toLowerCase();
    if (/crust|pastry|shell|wrapper/i.test(lbl)) {
      hasPastrySection = true;
    } else if (hasPastrySection && /fill|fruit|custard|top/i.test(lbl)) {
      wrappedKeys.add(sec.sectionKey);
    }
  }

  // ── Build each section ───────────────────────────────────────────────────────
  let totalCookedGrams = 0;
  let totalRawGrams    = 0;
  const globalTotals: MacroMap = {};
  for (const key of MACRO_KEYS) {
    (globalTotals as Record<string, number>)[key] = 0;
  }

  const allSections = [
    ...sections,
    ...(buckets.get('__unsectioned__')!.length > 0
      ? [{ sectionKey: '__unsectioned__', sectionLabel: 'Unsectioned', cookMethod: 'raw', cookTempF: undefined, cookMinutes: undefined, boilMinutes: undefined } as CommunitySection & { boilMinutes?: number }]
      : []),
  ];

  for (const sec of allSections) {
    const bucket = buckets.get(sec.sectionKey) ?? [];
    const cookMethod: CookingMethod = mapDishMethodToCookingMethod(sec.cookMethod);
    const skipped: SkippedIngredient[] = [];

    // Separate active from skipped
    const active: Array<{ grams: number; nutrients: NutrientRow }> = [];
    for (const ing of bucket) {
      if (ing.isOptional) { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'optional' }); continue; }
      if (ing.exempt)     { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'exempt'   }); continue; }
      const nr = nutrientMap.get(ing.ndbNo);
      if (!nr)            { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'missing_ndb' }); continue; }
      active.push({ grams: ing.portionGrams, nutrients: nr });
    }
    globalSkipped.push(...skipped);

    if (active.length === 0) continue;

    const isWrapped = wrappedKeys.has(sec.sectionKey);
    const fillingClass = inferFillingClass(active, isWrapped);

    // Compute initial water for yield calc
    const initialWaterG    = active.reduce((sum, a) =>
      sum + (a.nutrients.water / 100) * a.grams, 0
    );
    const totalSectionRawG = active.reduce((sum, a) => sum + a.grams, 0);

    // Build oven stages from section metadata.
    // If sec.stages[] is present use it (multi-stage sequential bake).
    // Otherwise fall back to the single cookTempF / cookMinutes pair.
    const stages: Array<[number, number]> =
      sec.stages && sec.stages.length > 0
        ? sec.stages
            .filter(st => st.tempF > 0 && st.minutes > 0)
            .map(st => [st.tempF, st.minutes] as [number, number])
        : sec.cookTempF && sec.cookMinutes && sec.cookTempF > 0
          ? [[sec.cookTempF, sec.cookMinutes]]
          : [];

    const boilMinutes = (sec as CommunitySection & { boilMinutes?: number }).boilMinutes ?? 0;

    // ── Submersion-boil absorption override ──────────────────────────────────
    // The evaporation model (calcYieldWater) is wrong when a boiled section
    // contains a pure-water ingredient (≥99.5% water) alongside dry ingredients
    // (avg moisture <20%) — e.g. dry pasta, rice, oats, or dried beans boiled
    // in a large volume of water. In these cases the food ABSORBS water rather
    // than losing it, and calcYieldWater returns 1.0 ('none' binding class),
    // massively overcounting moisture in the cooked result.
    //
    // Detection: cookMethod=boiled + has a near-pure-water ingredient + the
    // remaining ingredients are dry (avg water < 20%). This correctly excludes
    // sauces (milk 88%), stocks (chicken ~66%), and soups (vegetables ~93%).
    //
    // Model: conserve dry non-water solids; let them absorb water to reach the
    // standard cooked-grain water fraction of 62.13% (NDB 20521, calibrated for
    // pasta/rice/oats/legumes). yieldWater = retainedWater / initialWaterG.
    const BOIL_ABSORPTION_TARGET = 0.6213;
    const pureWaterG  = active
      .filter(a => a.nutrients.water >= 99.5)
      .reduce((sum, a) => sum + a.grams, 0);
    const dryIngredients = active.filter(a => a.nutrients.water < 99.5);
    const dryAvgWaterFrac = dryIngredients.length > 0 && totalSectionRawG > pureWaterG
      ? dryIngredients.reduce((sum, a) => sum + (a.nutrients.water / 100) * a.grams, 0) /
        dryIngredients.reduce((sum, a) => sum + a.grams, 0)
      : 1.0;

    let yieldWater: number;
    if (
      cookMethod === 'boiled' &&
      pureWaterG > 0 &&
      dryAvgWaterFrac < 0.20
    ) {
      // Absorption model: dry non-water solids absorb to TARGET water fraction.
      const dryNonWaterG   = totalSectionRawG - initialWaterG;
      const retainedWaterG = dryNonWaterG * BOIL_ABSORPTION_TARGET / (1 - BOIL_ABSORPTION_TARGET);
      yieldWater = Math.min(retainedWaterG / initialWaterG, 1.0);
    } else {
      yieldWater = calcYieldWater(stages, initialWaterG, fillingClass, boilMinutes);
    }

    // Sum retained nutrients across active ingredients
    const sectionTotals: MacroMap = {};
    let rawGrams    = 0;

    for (const { grams, nutrients } of active) {
      rawGrams += grams;
      for (const key of MACRO_KEYS) {
        const rawPer100g  = (nutrients as unknown as Record<string, number>)[key] ?? 0;
        const colName     = KEY_TO_COLUMN[key] ?? key;
        let retained: number;
        if (key === 'water') {
          // Water column: apply yield factor instead of retention (they model the same loss)
          retained = rawPer100g * (grams / 100) * yieldWater;
        } else {
          retained = applyRetention(rawPer100g, grams, cookMethod, colName);
        }
        (sectionTotals as Record<string, number>)[key] =
          ((sectionTotals as Record<string, number>)[key] ?? 0) + retained;
      }
    }

    // Cooked weight = rawGrams adjusted for water lost
    const waterLost  = initialWaterG * (1 - yieldWater);
    const cookedGrams = rawGrams - waterLost;

    // Accumulate into global totals
    for (const key of MACRO_KEYS) {
      (globalTotals as Record<string, number>)[key]! +=
        (sectionTotals as Record<string, number>)[key] ?? 0;
    }
    totalRawGrams    += rawGrams;
    totalCookedGrams += cookedGrams;

    sectionResults.push({
      sectionKey:         sec.sectionKey,
      sectionLabel:       sec.sectionLabel,
      fillingClass,
      yieldFactorWater:   yieldWater,
      cookMethod:         cookMethod,
      rawGrams,
      cookedGrams,
      retainedNutrients:  sectionTotals,
      skipped,
    });
  }

  // ── Per-100g profile ─────────────────────────────────────────────────────────
  const per100g: MacroMap = {};
  if (totalCookedGrams > 0) {
    for (const key of MACRO_KEYS) {
      (per100g as Record<string, number>)[key] =
        ((globalTotals as Record<string, number>)[key] ?? 0) / totalCookedGrams * 100;
    }
  }

  const plausibility = plausibilityCheck(per100g, totalCookedGrams, globalSkipped, sectionResults);

  return {
    per100g,
    gramsPerServing,
    totalRawGrams,
    totalCookedGrams,
    servings,
    sections: sectionResults,
    plausibility,
  };
}
