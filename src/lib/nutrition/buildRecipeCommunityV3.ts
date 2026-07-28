/**
 * buildRecipeCommunityV3.ts — TypeScript port of the recipes_v3 Python pipeline.
 *
 * This is a PARALLEL implementation of buildRecipeCommunity.ts that mirrors
 * recipes_v3/lib/build.py exactly:
 *
 *   1. prep_method is DISPLAY ONLY — never enters retention or yield calculations.
 *   2. yieldFactorWater is used DIRECTLY when provided (locked value from
 *      upload.py / sections_json). calcYieldWater() fires only as a fallback
 *      when the locked value is absent.
 *   3. yieldFactorFat, yieldFactorProtein, yieldFactorCarbohydrate, yieldFactorOther
 *      are applied as explicit post-retention multipliers to section totals
 *      (fat-drain, protein loss to stock, carbohydrate leaching, fat-soluble vitamins).
 *   4. Atwater energy recompute fires when any of yff/yfp/yfc < 1.0, matching
 *      the Python build.py behaviour.
 *   5. fillClass comes from section metadata (CommunitySectionV3.fillClass);
 *      inferFillingClass() is only a fallback when fillClass is absent.
 *
 * The existing buildRecipeCommunity.ts (V1) is unchanged — this runs alongside it.
 *
 * STATUS: parity testing in progress. Not yet wired into production paths.
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

// ── Stock extraction yield factors (file-level — shared by yfw and yfp/yff/yfc/yfo paths) ──
// Mirror of STOCK_EXTRACTION in recipes_v3/lib/build.py.
// Stock fill classes bypass the boiled-vegetable yfw model (which gives yfw≈1.0
// for stocks containing vegetables) and use calcYieldWater with the binding coefficient.
const STOCK_EXTRACTION: Record<string, { yfp: number; yff: number; yfc: number; yfo: number }> = {
  chicken_stock: { yfp: 0.366, yff: 0.089, yfc: 0.02, yfo: 0.02 },
  bone_broth:    { yfp: 0.395, yff: 0.089, yfc: 0.02, yfo: 0.02 },
  fish_stock:    { yfp: 0.355, yff: 1.000, yfc: 0.293, yfo: 0.02 },
  // STOCK_006 Fish Stock: yff=1.000 (no fat skimmed); yfc=0.293 (wine carbs); Rule C calibrated.
  vegetable_stock: { yfp: 0.484, yff: 0.950, yfc: 0.290, yfo: 0.02 },
  // STOCK_007 Vegetable Stock: minimal fat (yff=0.950); yfp=0.484; yfc=0.290; Rule C calibrated.
};

function retainedIngredientFraction(ing: CommunityIngredient): number {
  if (!ing.discarded) return 1;
  const discardPercent = Number.isFinite(ing.discardPercent) ? ing.discardPercent! : 100;
  return Math.max(0, Math.min(1, 1 - discardPercent / 100));
}

function methodStovetopTempF(method: string | undefined | null): number {
  const m = method?.trim().toLowerCase().replace(/_/g, ' ') ?? '';
  if (m === 'sub-simmer' || m === 'sub simmer') return 180;
  if (m === 'scald' || m === 'scalded') return 212;
  if (m === 'simmer') return 195;
  if (m === 'braise' || m === 'braised') return 185;
  if (m === 'saute' || m === 'sauté' || m === 'sauteed' || m === 'sautéed') return 200;
  if (m === 'stir fry' || m === 'stir-fried' || m === 'stir fried') return 220;
  if (m === 'pan sear' || m === 'pan seared' || m === 'pan-seared' || m === 'sear' || m === 'seared') return 230;
  return 212;
}
import {
  applyRetention,
  getRetentionFactor,
  mapDishMethodToCookingMethod,
  type CookingMethod,
} from '$lib/data/cookingLossModel.js';

// ── Nutrient key list (same as V1) ────────────────────────────────────────────
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
  energy_KCal:                    'Energy_KCal',
  water:                          'Water',
  protein:                        'Protein',
  totalLipidFat:                  'TotalLipidFat',
  carbohydrate:                   'Carbohydrate',
  sugarsTotal:                    'SugarsTotal',
  fiberTotalDietary:              'FiberTotalDietary',
  ash:                            'Ash',
  fattyAcids_totalSaturated:     'FattyAcids_totalSaturated',
  fattyAcids_totalMonounsaturated:'FattyAcids_totalMonounsaturated',
  fattyAcids_totalPolyunsaturated:'FattyAcids_totalPolyunsaturated',
  cholesterol:                    'Cholesterol',
  calcium_Ca:                     'Calcium_Ca',
  iron_Fe:                        'Iron_Fe',
  magnesium_Mg:                   'Magnesium_Mg',
  phosphorus_P:                   'Phosphorus_P',
  potassium_K:                    'Potassium_K',
  sodium_Na:                      'Sodium_Na',
  zinc_Zn:                        'Zinc_Zn',
  vitaminC_totalAscorbicAcid:    'VitaminC_totalAscorbicAcid',
  thiamin:                        'Thiamin',
  riboflavin:                     'Riboflavin',
  niacin:                         'Niacin',
  vitaminB6:                      'VitaminB6',
  folateDFE:                      'Folate_DFE',
  vitaminB12:                     'VitaminB12',
  vitaminA_RAE:                   'VitaminA_RAE',
  vitaminD:                       'VitaminD',
  vitaminE_alphaTocopherol:      'VitaminE_alphaTocopherol',
  vitaminK_phylloquinone:        'VitaminK_phylloquinone',
};

/**
 * Fat-soluble nutrient keys — yieldFactorOther (yfo) applies only to these.
 * Mirrors recipes_v3/lib/build.py::_FAT_SOLUBLE_NUTRIENTS.
 */
const FAT_SOLUBLE_KEYS = new Set<string>([
  'vitaminK_phylloquinone',
  'vitaminA_RAE',
  'vitaminD',
  'vitaminE_alphaTocopherol',
]);

// ── Extended section interface ────────────────────────────────────────────────

/**
 * CommunitySection extended with the yield factors written by upload.py into
 * sections_json, and an explicit fillClass from recipe_sections.csv metadata.
 *
 * All new fields are optional — the function falls back gracefully when absent.
 * This interface is a strict superset of CommunitySection so it can be passed
 * wherever CommunitySection is accepted.
 */
export interface CommunitySectionV3 extends CommunitySection {
  /**
   * Pre-computed yield factor from the Python pipeline (sections_json).
   * When this is a finite number it is used directly — no call to calcYieldWater().
   * This is the primary path for all dev recipes imported from Turso.
   */
  yieldFactorWater?: number;

  /**
   * Fat drain factor.  < 1.0 when fat is physically discarded after cooking
   * (e.g. ground beef drained after browning, sausage fat drained from pan).
   * Applied to totalLipidFat and all fatty acid sub-columns after retention.
   */
  yieldFactorFat?: number;

  /**
   * Protein yield factor.  < 1.0 for stocks and broths where collagen and
   * myosin extract into the liquid but solids are strained out.
   * Applied to protein (and downstream amino acids) after retention.
   */
  yieldFactorProtein?: number;

  /**
   * Carbohydrate yield factor.  < 1.0 for stocks where wine or high-sugar
   * ingredients leach soluble carbs into the liquid phase (Phase 8e).
   * Applied to carbohydrate and sugarsTotal after retention.
   */
  yieldFactorCarbohydrate?: number;

  /**
   * Fat-soluble vitamin factor (Phase 8f).  < 1.0 for stocks — VitK, VitA,
   * VitD, VitE partition into fat/solids and leave with the strained discard.
   * Applied only to FAT_SOLUBLE_KEYS after retention.
   */
  yieldFactorOther?: number;

  /**
   * Explicit filling class from recipe_sections.csv (e.g. 'dense_fruit',
   * 'dairy_custard', 'pastry').  When present, used directly.  When absent,
   * inferFillingClass() fires as a fallback (same as V1 behaviour).
   */
  fillClass?: string;
}

export interface PrimaryCookStage {
  stage: 2 | 3;
  method?: string;
  tempF?: number;
  minutes?: number;
  fillClass?: string;
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Build the nutrition profile for a community recipe using the recipes_v3
 * Python pipeline math contract.
 *
 * Math contract (mandatory order):
 *   1. Partition active ingredients by section.
 *   2. For each section:
 *        a. Apply retention factors using cook_method only (prep_method ignored).
 *        b. Sum retained nutrients.
 *        c. Scale water column by yieldFactorWater (locked → direct; else computed).
 *        d. Scale fat by yieldFactorFat, protein by yieldFactorProtein,
 *           carbs by yieldFactorCarbohydrate, fat-soluble vitamins by yieldFactorOther.
 *        e. Recompute Atwater energy when any of yff/yfp/yfc < 1.0.
 *   3. Sum section totals → global totals.
 *   4. Divide by total cooked grams → per-100g profile.
 *   5. Plausibility check.
 *
 * @param sections        Array of CommunitySectionV3 (superset of CommunitySection).
 * @param ingredients     All recipe ingredients.
 * @param nutrientMap     NutrientRow keyed by ndbNo.
 * @param servings        Number of servings.
 * @param gramsPerServing Expected grams per serving for plausibility check.
 */
export function buildRecipeCommunityV3(
  sections: CommunitySectionV3[],
  ingredients: CommunityIngredient[],
  nutrientMap: Map<string, NutrientRow>,
  servings: number,
  gramsPerServing: number,
  dishCookMethod?: string,
  dishCookTempF?: number,
  dishCookMinutes?: number,
  primaryFillClass?: string,
  primaryCookStages: PrimaryCookStage[] = [],
): BuildResult {
  // ── Recipe-level (top bar) primary cook parameters ──────────────────────────
  // The top bar represents the final assembled-bake or primary cook applied to
  // the whole dish. When set it overrides each section’s own cook_method for
  // effectiveCookMethod. Sections without their own oven stages inherit the
  // top-bar temp/minutes as the oven stage source.
  const primaryCookMethod: CookingMethod | undefined = dishCookMethod
    ? mapDishMethodToCookingMethod(dishCookMethod)
    : undefined;
  const rawDish = dishCookMethod?.trim().toLowerCase() ?? '';
  const primaryIsBoilCovered = rawDish === 'boil covered' || rawDish === 'boil_covered' || rawDish === 'boiled covered' || rawDish === 'boiled_covered' || rawDish === 'boil (covered)' || rawDish === 'boiled (covered)';
  const primaryCookTempF = methodStovetopTempF(rawDish);
  const primaryCookLidOn = rawDish === 'braise' || primaryIsBoilCovered;
  const primaryTimeline = [
    {
      stage: 1,
      methodRaw: dishCookMethod,
      cookMethod: primaryCookMethod,
      tempF: dishCookTempF,
      minutes: dishCookMinutes,
      fillClass: primaryFillClass,
    },
    ...primaryCookStages.map(stage => {
      const methodRaw = stage.method;
      return {
        stage: stage.stage,
        methodRaw,
        cookMethod: methodRaw ? mapDishMethodToCookingMethod(methodRaw) : undefined,
        tempF: stage.tempF,
        minutes: stage.minutes,
        fillClass: stage.fillClass,
      };
    }),
  ].filter(stage => stage.cookMethod && stage.cookMethod !== 'raw');

  function primaryEntryStage(section: CommunitySectionV3): number {
    const raw = section.primaryEntryStage ?? '1';
    const parsed = Number.parseInt(String(raw), 10);
    if (!Number.isFinite(parsed)) return 1;
    return Math.max(1, Math.min(3, parsed));
  }

  function activePrimaryTimeline(section: CommunitySectionV3) {
    const entryStage = primaryEntryStage(section);
    return primaryTimeline.filter(stage => stage.stage >= entryStage);
  }

  const sectionResults: SectionBuildResult[] = [];
  const globalSkipped: SkippedIngredient[]   = [];

  // ── Partition ingredients by section ────────────────────────────────────────
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

  // ── Wrapped-section detection (same heuristic as V1) ────────────────────────
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

  // ── Global accumulators ──────────────────────────────────────────────────────
  let totalCookedGrams = 0;
  let totalRawGrams    = 0;
  const globalTotals: MacroMap = {};
  for (const key of MACRO_KEYS) {
    (globalTotals as Record<string, number>)[key] = 0;
  }

  const allSections: CommunitySectionV3[] = [
    ...sections,
    ...(buckets.get('__unsectioned__')!.length > 0
      ? [{ sectionKey: '__unsectioned__', sectionLabel: 'Unsectioned', cookMethod: dishCookMethod ?? 'raw' } as CommunitySectionV3]
      : []),
  ];

  // ── Section loop ─────────────────────────────────────────────────────────────
  for (const sec of allSections) {
    const bucket = buckets.get(sec.sectionKey) ?? [];
    const activePrimary = activePrimaryTimeline(sec);
    const firstPrimary = activePrimary[0];

    // effectiveCookMethod = this section's first active primary stage OR its own cook_method.
    // Sections entering at Cook2/Cook3 are not back-applied to earlier primary stages.
    const effectiveCookMethod: CookingMethod = firstPrimary?.cookMethod ?? mapDishMethodToCookingMethod(sec.cookMethod);
    // Stovetop temperature for evaporation model when effectiveCookMethod=‘boiled’.
    const secCookStr = sec.cookMethod.toLowerCase();
    const isBakeCovered = secCookStr === 'bake covered' || secCookStr === 'bake_covered' || secCookStr === 'baked covered';
    const isBoilCovered = secCookStr === 'boil covered' || secCookStr === 'boil_covered' || secCookStr === 'boiled covered' || secCookStr === 'boiled_covered' || secCookStr === 'boil (covered)' || secCookStr === 'boiled (covered)';
    const firstPrimaryRaw = firstPrimary?.methodRaw?.trim().toLowerCase().replace(/_/g, ' ') ?? '';
    const firstPrimaryIsBoilCovered = firstPrimaryRaw === 'boil covered' || firstPrimaryRaw === 'boiled covered' || firstPrimaryRaw === 'boil (covered)' || firstPrimaryRaw === 'boiled (covered)';
    const firstPrimaryIsBakeCovered = firstPrimaryRaw === 'bake covered' || firstPrimaryRaw === 'baked covered';
    const effectiveTempF = firstPrimary ? methodStovetopTempF(firstPrimaryRaw) : methodStovetopTempF(secCookStr);
    const effectiveLidOn = firstPrimary
      ? (firstPrimaryRaw === 'braise' || firstPrimaryIsBoilCovered || firstPrimaryIsBakeCovered)
      : (secCookStr === 'braise' || isBakeCovered || isBoilCovered);

    // Pre-step: section’s own prepMethod fires BEFORE the primary cook.
    // e.g. simmer the apple filling 5 min, then bake the assembled pie 52 min.
    // Only active when the pre-step resolves to a DIFFERENT cook method than the
    // primary (prevents double-counting when the section IS the primary cook,
    // e.g. a soup where prepMethod=‘simmer’ ≡ effectiveCookMethod=‘boiled’).
    const prepMethodStr = ((sec as any).prepMethod ?? (sec as any).prep_method ?? '') as string;
    const prepCookMethodRaw: CookingMethod | null =
      (prepMethodStr && prepMethodStr !== 'none' && prepMethodStr !== 'raw' && prepMethodStr !== 'finish')
        ? mapDishMethodToCookingMethod(prepMethodStr)
        : null;
    const hasPrepStep = prepCookMethodRaw !== null && prepCookMethodRaw !== effectiveCookMethod;
    const prepCookMethod: CookingMethod | null = hasPrepStep ? prepCookMethodRaw : null;
    const prepTempF = methodStovetopTempF(prepMethodStr);
    const prepLidOn = prepMethodStr === 'braise' || prepMethodStr === 'boil covered' || prepMethodStr === 'boil_covered' || prepMethodStr === 'boiled covered' || prepMethodStr === 'boiled_covered' || prepMethodStr === 'boil (covered)' || prepMethodStr === 'boiled (covered)';

    const skipped: SkippedIngredient[] = [];
    const active: Array<{ grams: number; nutrients: NutrientRow }> = [];
    for (const ing of bucket) {
      if (ing.isOptional) { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'optional'    }); continue; }
      if (ing.exempt)     { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'exempt'      }); continue; }
      const effectiveGrams = ing.portionGrams * retainedIngredientFraction(ing);
      if (effectiveGrams <= 0) { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'discarded' }); continue; }
      const nr = nutrientMap.get(ing.ndbNo);
      if (!nr && ing.componentPer100g) {
        // Component_ref ingredient: use pre-built per-100g values directly.
        // componentPer100g keys are USDA column names (Energy_KCal, Water, ...);
        // NutrientRow uses camelCase (energy_KCal, water, ...). Invert KEY_TO_COLUMN
        // to remap before setting so the downstream math reads correct fields.
        const colToKey = Object.fromEntries(
          Object.entries(KEY_TO_COLUMN).map(([k, v]) => [v, k])
        ) as Record<string, string>;
        const syntheticNr = { ndbNo: ing.ndbNo, longDesc: ing.displayName ?? '', fdGrpCd: '' } as NutrientRow;
        for (const [colName, v] of Object.entries(ing.componentPer100g)) {
          const nrKey = colToKey[colName] ?? colName;
          (syntheticNr as unknown as Record<string, unknown>)[nrKey] = v;
        }
        active.push({ grams: effectiveGrams, nutrients: syntheticNr });
        continue;
      }
      if (!nr)            { skipped.push({ ndbNo: ing.ndbNo, displayName: ing.displayName, reason: 'missing_ndb' }); continue; }
      active.push({ grams: effectiveGrams, nutrients: nr });
    }
    globalSkipped.push(...skipped);

    if (active.length === 0) continue;

    const isWrapped = wrappedKeys.has(sec.sectionKey);
    const HINT_COOK_MAP: Record<string, string[]> = {
      'pan_grilled_chicken': ['sauteed', 'sautéed', 'stir-fried', 'pan sear', 'pan seared', 'fried', 'grilled', 'broil', 'broiled'],
      'fried_chicken':       ['fried', 'deep-fried'],
      'fried_breaded_shrimp': ['fried', 'deep-fried'],
      'fried_breaded_chicken_tender': ['fried', 'deep-fried'],
      'fried_breaded_fish_fillet': ['fried', 'deep-fried'],
      'baked_pork':          ['baked', 'par-baked'],
      'braised_beef':        ['braise', 'braised', 'boiled', 'simmer', 'sub-simmer'],
      'fried_meat':          ['fried', 'deep-fried', 'sauteed', 'sautéed', 'stir-fried', 'pan sear', 'pan seared'],
    };
    const rawCookMethod = (firstPrimary?.methodRaw ?? sec.cookMethod ?? 'raw').trim().toLowerCase().replace(/_/g, ' ');
    let fillClass: string;
    if (sec.fillClass && sec.fillClass !== '') {
      fillClass = sec.fillClass;
    } else if (firstPrimary?.fillClass && firstPrimary.fillClass !== '') {
      fillClass = firstPrimary.fillClass;
    } else {
      let hintClass = '';
      let hintProtein = 0;
      for (const ing of active) {
        const hint = ing.nutrients.fillClassHint;
        if (!hint) continue;
        const validMethods = HINT_COOK_MAP[hint] ?? [];
        if (validMethods.includes(rawCookMethod)) {
          const protein = (ing.nutrients.protein ?? 0) * (ing.grams / 100);
          if (protein > hintProtein) {
            hintProtein = protein;
            hintClass = hint;
          }
        }
      }
      fillClass = hintClass || inferFillingClass(active, isWrapped);
    }

    // ── Water yield ────────────────────────────────────────────────────────────
    // Priority 1: locked value from Python pipeline (sections_json).
    // Priority 2: compute via calcYieldWater with fill class + oven stages.
    // Priority 3: 1.0 (no water loss — raw / unrecognised method).
    const initialWaterG = active.reduce((sum, a) =>
      sum + (a.nutrients.water / 100) * a.grams, 0
    );

    let yieldWater: number;

    if (typeof sec.yieldFactorWater === 'number' && isFinite(sec.yieldFactorWater)) {
      // ── Path A: locked value (dev recipe import from Turso sections_json) ──
      yieldWater = sec.yieldFactorWater;
    } else {
      // ── Path B: compute from filling class + oven stages ──────────────────
      // fillClass: prefer explicit metadata; fall back to fill_class_hint from
      // dominant protein ingredient; then inferFillingClass() for pastry detection.
      //
      // Build oven stages from section metadata (same logic as V1).
      const stages: Array<[number, number]> =
        activePrimary.length > 0
          ? activePrimary
              .filter(stage => typeof stage.tempF === 'number' && typeof stage.minutes === 'number' && stage.tempF > 0 && stage.minutes > 0)
              .map(stage => [stage.tempF!, stage.minutes!] as [number, number])
        : sec.stages && sec.stages.length > 0
          ? sec.stages
              .filter(st => st.tempF > 0 && st.minutes > 0)
              .map(st => [st.tempF, st.minutes] as [number, number])
          : sec.cookTempF && sec.cookMinutes && sec.cookTempF > 0
            ? [[sec.cookTempF, sec.cookMinutes]]
            : [];

      // For boiled sections: check absorption model first (pasta, legumes, grains).
      // Then check boiled-vegetable model (raw vegetables with boilYfw).
      // Matches the Python absorption/boil_yfw models in build.py.
      if (effectiveCookMethod === 'boiled') {
        // Stock fill classes bypass the absorber/vegBoiler models — the long-simmer
        // evaporation is captured by the binding coefficient, not per-ingredient retention.
        if (STOCK_EXTRACTION[fillClass]) {
          const boilMins = (sec as any).boilMinutes ?? (sec as any).boil_minutes ?? 0;
          const boilTempF = boilMins > 0 && prepCookMethod ? prepTempF : 180;
          const boilLidOn = boilMins > 0 && prepCookMethod ? prepLidOn : false;
          yieldWater = calcYieldWater(stages, initialWaterG, fillClass, boilMins, boilTempF, boilLidOn);
        } else {
        const absorbers = active.filter(a => a.nutrients.absorptionFactor != null);
        if (absorbers.length > 0) {
          const absorberGrams    = absorbers.reduce((s, a) => s + a.grams, 0);
          const weightedFactor   = absorbers.reduce((s, a) => s + (a.nutrients.absorptionFactor! * a.grams), 0) / absorberGrams;
          const totalRawG        = active.reduce((s, a) => s + a.grams, 0);
          const dryNonWaterG     = totalRawG - initialWaterG;
          const retainedWaterG   = dryNonWaterG * weightedFactor / (1 - weightedFactor);
          yieldWater = initialWaterG > 0 ? retainedWaterG / initialWaterG : 1.0;
        } else {
          // Boiled-vegetable model fires only when no explicit fill_class is set on
          // the section. An explicit fill_class (e.g. simmer_sauce) means the recipe
          // author wants the physics evaporation model, not the per-ingredient veg
          // retention fallback. (Priority change July 2026 — mirrors build.py.)
          const hasExplicitFillClass = !!(sec.fillClass && sec.fillClass !== '');
          const vegBoilers = !hasExplicitFillClass
            ? active.filter(a => typeof a.nutrients.boilYfw === 'number')
            : [];
          if (vegBoilers.length > 0) {
            const totalWater  = initialWaterG;
            const vegWater    = vegBoilers.reduce((s, a) => s + (a.nutrients.water ?? 0) * (a.grams / 100), 0);
            const nonVegWater = totalWater - vegWater;
            const retained    = vegBoilers.reduce((s, a) => s + (a.nutrients.water ?? 0) * (a.grams / 100) * a.nutrients.boilYfw!, 0) + nonVegWater;
            yieldWater = totalWater > 0 ? retained / totalWater : 1.0;
          } else {
            const boilMins = (sec as any).boilMinutes ?? (sec as any).boil_minutes ?? 0;
            const boilTempF = boilMins > 0 && prepCookMethod ? prepTempF : effectiveTempF;
            const boilLidOn = boilMins > 0 && prepCookMethod ? prepLidOn : effectiveLidOn;
            yieldWater = calcYieldWater(stages, initialWaterG, fillClass, boilMins, boilTempF, boilLidOn);
          }
        }
        } // end stock else
      } else if (fillClass === 'strained') {
        // Strained-blend model: blended then pressed through cheesecloth.
        // STRAIN_WATER_K=0.9 g water absorbed per g of discarded dry solids.
        // Mirrors Python build.py strained path exactly.
        const STRAIN_WATER_K = 0.9;
        const strainers = active.filter(a => typeof a.nutrients.strainRetain === 'number');
        if (strainers.length > 0) {
          const discardedDry = strainers.reduce((s, a) => {
            const dryG = a.grams - (a.nutrients.water ?? 0) * (a.grams / 100);
            return s + dryG * (1 - a.nutrients.strainRetain!);
          }, 0);
          const waterAbsorbed = STRAIN_WATER_K * discardedDry;
          yieldWater = initialWaterG > 0 ? Math.max(0, (initialWaterG - waterAbsorbed) / initialWaterG) : 1.0;
        } else {
          yieldWater = 1.0;
        }
      } else {
        const boilMins = (sec as any).boilMinutes ?? (sec as any).boil_minutes ?? 0;
        const boilTempF = boilMins > 0 && prepCookMethod ? prepTempF : effectiveTempF;
        const boilLidOn = boilMins > 0 && prepCookMethod ? prepLidOn : effectiveLidOn;
        yieldWater = calcYieldWater(stages, initialWaterG, fillClass, boilMins, boilTempF, boilLidOn);
      }
    }

    // ── Read yield factors (default 1.0 = no effect) ──────────────────────────
    // For strained sections: auto-derive yff/yfp/yfc from per-ingredient strainRetain.
    // Otherwise: yff from fatDrain auto-derive; yfp/yfc from section metadata or 1.0.
    const isStrained = fillClass === 'strained' && active.some(a => typeof a.nutrients.strainRetain === 'number');

    // yff: if explicitly set on the section, use it. Otherwise auto-derive from
    // ingredient fatDrain values (e.g. raw bacon: fatDrain=0.33 → drains 67% fat).
    // Formula mirrors Python build.py:
    //   retained_fat = (drainer_fat × fatDrain) + non_drainer_fat
    //   yff = retained_fat / total_fat
    let yff: number;
    if (isStrained) {
      // Strained model: use strainRetain for fat yield
      const totalFat = active.reduce((s, a) => s + (a.nutrients.totalLipidFat ?? 0) * (a.grams / 100), 0);
      const retainedFat = active.reduce((s, a) => {
        const fatG = (a.nutrients.totalLipidFat ?? 0) * (a.grams / 100);
        return s + fatG * (typeof a.nutrients.strainRetain === 'number' ? a.nutrients.strainRetain : 1.0);
      }, 0);
      yff = totalFat > 0 ? retainedFat / totalFat : 1.0;
    } else if (typeof sec.yieldFactorFat === 'number' && isFinite(sec.yieldFactorFat)) {
      yff = sec.yieldFactorFat;
    } else {
      const fatDrainers = active.filter(a => typeof a.nutrients.fatDrain === 'number');
      if (fatDrainers.length > 0) {
        const totalFat       = active.reduce((s, a) => s + (a.nutrients.totalLipidFat ?? 0) * (a.grams / 100), 0);
        const drainerFat     = fatDrainers.reduce((s, a) => s + (a.nutrients.totalLipidFat ?? 0) * (a.grams / 100), 0);
        const retainedFromDrainers    = fatDrainers.reduce((s, a) => s + (a.nutrients.totalLipidFat ?? 0) * (a.grams / 100) * a.nutrients.fatDrain!, 0);
        const retainedFromNonDrainers = totalFat - drainerFat;
        yff = totalFat > 0 ? (retainedFromDrainers + retainedFromNonDrainers) / totalFat : 1.0;
      } else {
        yff = 1.0;
      }
    }
    const yfp = isStrained
      ? (() => {
          const totalPro = active.reduce((s, a) => s + (a.nutrients.protein ?? 0) * (a.grams / 100), 0);
          const retainedPro = active.reduce((s, a) => {
            const proG = (a.nutrients.protein ?? 0) * (a.grams / 100);
            return s + proG * (typeof a.nutrients.strainRetain === 'number' ? a.nutrients.strainRetain : 1.0);
          }, 0);
          return totalPro > 0 ? retainedPro / totalPro : 1.0;
        })()
      : sec.yieldFactorProtein ?? 1.0;
    const yfc = isStrained
      ? (() => {
          const totalCarb = active.reduce((s, a) => s + (a.nutrients.carbohydrate ?? 0) * (a.grams / 100), 0);
          const retainedCarb = active.reduce((s, a) => {
            const carbG = (a.nutrients.carbohydrate ?? 0) * (a.grams / 100);
            return s + carbG * (typeof a.nutrients.strainRetain === 'number' ? a.nutrients.strainRetain : 1.0);
          }, 0);
          return totalCarb > 0 ? retainedCarb / totalCarb : 1.0;
        })()
      : sec.yieldFactorCarbohydrate ?? 1.0;
    const yfo = sec.yieldFactorOther        ?? 1.0;

    // ── Stock extraction model ────────────────────────────────────────────────
    // When fillClass is a stock class, override yfp/yff/yfc/yfo with calibrated
    // extraction constants. These replace the default 1.0 for empty CSV columns.
    // Mirror: STOCK_EXTRACTION in recipes_v3/lib/build.py.
    const _stockEx = !isStrained ? STOCK_EXTRACTION[fillClass] : undefined;
    if (_stockEx) {
      yff = _stockEx.yff;
    }
    const effectiveYfp = _stockEx?.yfp ?? yfp;
    const effectiveYfc = _stockEx?.yfc ?? yfc;
    const effectiveYfo = _stockEx?.yfo ?? yfo;
    // Two-pass when hasPrepStep: pre-step retention × primary cook retention.
    // Each cook method has its own factor table in COOKING_RETENTION.
    // Single-pass otherwise (primary cook only).
    const sectionTotals: Record<string, number> = {};
    let rawGrams = 0;

    for (const { grams, nutrients } of active) {
      rawGrams += grams;
      for (const key of MACRO_KEYS) {
        const rawPer100g = (nutrients as unknown as Record<string, number>)[key] ?? 0;
        const colName    = KEY_TO_COLUMN[key] ?? key;
        let retained: number;
        if (key === 'water') {
          // Water: yield factor applied via yieldWater below.
          retained = rawPer100g * (grams / 100);
        } else if (hasPrepStep && prepCookMethod) {
          // Two-pass: pre-step retention × primary cook retention.
          // e.g. simmer’s VitC 0.50 × baked’s VitC factor.
          const prepFactor    = getRetentionFactor(prepCookMethod, colName);
          const primaryFactor = getRetentionFactor(effectiveCookMethod, colName);
          retained = rawPer100g * (grams / 100) * prepFactor * primaryFactor;
        } else {
          retained = applyRetention(rawPer100g, grams, effectiveCookMethod, colName);
        }
        sectionTotals[key] = (sectionTotals[key] ?? 0) + retained;
      }
    }

    // ── Step 3: Apply water yield to water column ──────────────────────────────
    sectionTotals['water'] = (sectionTotals['water'] ?? 0) * yieldWater;

    // ── Step 4: Apply fat / protein / carb yield factors (post-retention) ──────
    if (yff !== 1.0) {
      sectionTotals['totalLipidFat']                  = (sectionTotals['totalLipidFat'] ?? 0) * yff;
      sectionTotals['fattyAcids_totalSaturated']      = (sectionTotals['fattyAcids_totalSaturated'] ?? 0) * yff;
      sectionTotals['fattyAcids_totalMonounsaturated']= (sectionTotals['fattyAcids_totalMonounsaturated'] ?? 0) * yff;
      sectionTotals['fattyAcids_totalPolyunsaturated']= (sectionTotals['fattyAcids_totalPolyunsaturated'] ?? 0) * yff;
      sectionTotals['cholesterol']                    = (sectionTotals['cholesterol'] ?? 0) * yff;
    }
    if (effectiveYfp !== 1.0) {
      sectionTotals['protein'] = (sectionTotals['protein'] ?? 0) * effectiveYfp;
    }
    if (effectiveYfc !== 1.0) {
      sectionTotals['carbohydrate'] = (sectionTotals['carbohydrate'] ?? 0) * effectiveYfc;
      sectionTotals['sugarsTotal']  = (sectionTotals['sugarsTotal']  ?? 0) * effectiveYfc;
      sectionTotals['fiberTotalDietary'] = (sectionTotals['fiberTotalDietary'] ?? 0) * effectiveYfc;
    }
    if (effectiveYfo !== 1.0) {
      for (const fatKey of FAT_SOLUBLE_KEYS) {
        sectionTotals[fatKey] = (sectionTotals[fatKey] ?? 0) * effectiveYfo;
      }
    }

    // ── Step 5: Atwater energy recompute (matches Python build.py) ─────────────
    // Fires when any macro yield factor < 1.0 to avoid overcounting drained calories.
    if (yff < 1.0 || effectiveYfp < 1.0 || effectiveYfc < 1.0) {
      sectionTotals['energy_KCal'] =
        (sectionTotals['protein']      ?? 0) * 4 +
        (sectionTotals['totalLipidFat']?? 0) * 9 +
        (sectionTotals['carbohydrate'] ?? 0) * 4;
    }

    // ── Cooked grams = raw grams minus water lost ──────────────────────────────
    const waterLost   = initialWaterG * (1 - yieldWater);
    const cookedGrams = rawGrams - waterLost;

    // ── Accumulate into global totals ──────────────────────────────────────────
    for (const key of MACRO_KEYS) {
      (globalTotals as Record<string, number>)[key]! += sectionTotals[key] ?? 0;
    }
    totalRawGrams    += rawGrams;
    totalCookedGrams += cookedGrams;

    // Infer fillClass for the result record (for plausibility + display) —
    // same hint-first logic as above.
    let fillingClass: string;
    if (sec.fillClass && sec.fillClass !== '') {
      fillingClass = sec.fillClass;
    } else if (firstPrimary?.fillClass && firstPrimary.fillClass !== '') {
      // The primary cook fill class is used for physics, but it is not section
      // metadata. Keep raw prep sections from rehydrating with Cook1's fill class.
      fillingClass = 'none';
    } else {
      let hintClass = '';
      let hintProtein = 0;
      for (const ing of active) {
        const hint = ing.nutrients.fillClassHint;
        if (!hint) continue;
        const validMethods = (HINT_COOK_MAP[hint] ?? []);
        if (validMethods.includes(rawCookMethod)) {
          const protein = (ing.nutrients.protein ?? 0) * (ing.grams / 100);
          if (protein > hintProtein) { hintProtein = protein; hintClass = hint; }
        }
      }
      fillingClass = hintClass || inferFillingClass(active, isWrapped);
    }

    sectionResults.push({
      sectionKey:        sec.sectionKey,
      sectionLabel:      sec.sectionLabel,
      fillingClass,
      yieldFactorWater:  yieldWater,
      cookMethod:        effectiveCookMethod,
      rawGrams,
      cookedGrams,
      retainedNutrients: sectionTotals as MacroMap,
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
