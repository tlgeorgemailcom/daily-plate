/**
 * types.ts — Shared interfaces for the community recipe nutrition pipeline.
 *
 * These types are used by both browser-side components (live preview) and
 * server-side endpoints (authoritative save-time build). Do not import from
 * $lib/server here — this file must be safe to import in the browser.
 *
 * See docs/vercel_pipeline.md for architecture overview.
 */

// ── Nutrient data ─────────────────────────────────────────────────────────────

/**
 * Per-100g nutrient profile for one NDB entry.
 * Column names match DataCentralCombo exactly.
 * Returned by fetchNutrientsByNdb() and embedded in ingredient search results.
 */
export interface NutrientRow {
  ndbNo: string;
  longDesc: string;
  fdGrpCd: string;           // USDA food group code, e.g. "09" = Fruits
  // Core macros
  energy_KCal: number;
  water: number;
  protein: number;
  totalLipidFat: number;
  carbohydrate: number;
  sugarsTotal: number;
  fiberTotalDietary: number;
  ash: number;
  // Fat detail
  fattyAcids_totalSaturated: number;
  fattyAcids_totalMonounsaturated: number;
  fattyAcids_totalPolyunsaturated: number;
  cholesterol: number;
  // Minerals
  calcium_Ca: number;
  iron_Fe: number;
  magnesium_Mg: number;
  phosphorus_P: number;
  potassium_K: number;
  sodium_Na: number;
  zinc_Zn: number;
  // Vitamins
  vitaminC_totalAscorbicAcid: number;
  thiamin: number;
  riboflavin: number;
  niacin: number;
  vitaminB6: number;
  folateDFE: number;
  vitaminB12: number;
  vitaminA_RAE: number;
  vitaminD: number;
  vitaminE_alphaTocopherol: number;
  vitaminK_phylloquinone: number;
}

// ── Recipe structure ──────────────────────────────────────────────────────────

/**
 * One player-defined section as stored in sections_json.
 * sectionKey is the FK used by CommunityIngredient.sectionKey.
 */
export interface CommunitySection {
  sectionKey: string;       // e.g. "crust", "filling", "topping"
  sectionLabel: string;     // display name shown in UI
  cookMethod: string;       // "baked" | "boiled" | "simmered" | "raw" | ...
  cookTempF?: number;       // oven temp °F — used when stages[] is absent
  cookMinutes?: number;     // oven time in minutes — used when stages[] is absent
  boilMinutes?: number;     // stovetop boil/simmer time in minutes
  /** Multi-stage oven sequence.  When present, overrides cookTempF/cookMinutes.
   *  Each element is one sequential oven stage: [tempF, minutes].
   *  Example: twice-baked potato — stage 1 [400,60] then stage 2 [375,30].
   */
  stages?: Array<{ tempF: number; minutes: number }>;
}

/**
 * One ingredient row as stored in recipe_ingredients_json.
 */
export interface CommunityIngredient {
  ndbNo: string;
  portionGrams: number;
  sectionKey?: string;      // FK → CommunitySection.sectionKey; null = unsectioned
  isOptional?: boolean;     // excluded from math when true (cook-may-omit)
  exempt?: boolean;         // no NDB nutrition data; excluded from math (e.g. garnish)
  displayName?: string;     // display only — does not affect calculation
}

// ── Build output ──────────────────────────────────────────────────────────────

/** Per-nutrient map keyed by NutrientRow field name */
export type MacroMap = Partial<Record<keyof Omit<NutrientRow, 'ndbNo' | 'longDesc' | 'fdGrpCd'>, number>>;

/** What was skipped and why, for transparency */
export interface SkippedIngredient {
  ndbNo: string;
  reason: 'optional' | 'exempt' | 'missing_ndb';
}

/** Build result for one section */
export interface SectionBuildResult {
  sectionKey: string;
  sectionLabel: string;
  fillingClass: string;       // BINDING key inferred or 'none'
  yieldFactorWater: number;   // applied yfw (1.0 = no water loss)
  cookMethod: string;         // normalised method used for retention lookup
  rawGrams: number;           // total raw grams of active ingredients
  cookedGrams: number;        // rawGrams minus water lost to heat
  retainedNutrients: MacroMap;
  skipped: SkippedIngredient[];
}

/** Full build output returned by buildRecipeCommunity() */
export interface BuildResult {
  per100g: MacroMap;
  gramsPerServing: number;
  totalRawGrams: number;
  totalCookedGrams: number;
  servings: number;
  sections: SectionBuildResult[];
  plausibility: PlausibilityResult;
}

// ── Plausibility ──────────────────────────────────────────────────────────────

export interface PlausibilityResult {
  passed: boolean;
  flags: string[];
  /**
   * true = unknown NDB key found; recipe must not be published until resolved.
   * false = plausibility issues are warnings only; recipe can be stored.
   */
  blocked: boolean;
}
