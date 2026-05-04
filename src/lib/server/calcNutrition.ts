import { FOODS } from '$lib/data/food-portions';
import { mapDishMethodToCookingMethod, getRetentionFactor } from '$lib/data/cookingLossModel';

// Built once per cold start — avoids O(n) scan per ingredient
const FOOD_MAP = new Map(FOODS.map(f => [f.word, f]));

// Maps food-portions short keys to SR28 column names used by cookingLossModel.
const MACRO_SR_KEY = {
  cal:  'Energy_KCal',
  pro:  'Protein',
  fat:  'TotalLipidFat',
  carb: 'Carbohydrate',
  fib:  'FiberTotalDietary',
  h2o:  'Water',
  sug:  'SugarsTotal',
} as const;

export interface NutritionSource {
  ndb: string;   // USDA NDB number — use to query SR Legacy for deeper nutrients
  name: string;  // Readable ingredient name
  grams: number; // Grams per serving — scale factor: sr_value_per_100g × (grams / 100)
}

export interface NutritionJson {
  perServing: {
    cal: number; pro: number; fat: number;
    carb: number; fib: number; h2o: number; sug: number;
  };
  per100g: {
    Energy_KCal: number; Protein: number; TotalLipidFat: number;
    Carbohydrate: number; FiberTotalDietary: number; SugarsTotal: number; Water: number;
  };
  gramsPerServing: number;
  servings: number;
  sources: NutritionSource[];
  /** Fraction of raw water retained after cooking (0–1). Used by server-side recalculation. */
  yieldFactorWater?: number;
  /** Fraction of raw fat retained after cooking (0–1). Used by server-side recalculation. */
  yieldFactorFat?: number;
}

interface IngRow {
  foodWord?: string;
  portionGrams?: number;
  servingCount?: number;
  exempt?: boolean;
  isDish?: boolean;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function parseServings(s: string | null | undefined): number {
  if (!s) return 1;
  const n = parseInt(s.replace(/[^0-9]/g, ''));
  return n > 0 ? n : 1;
}

/**
 * Compute per-serving and per-gram nutrition from a linked recipe's ingredient
 * rows and linkType.  Returns null if insufficient linked data is present.
 *
 * dish mode  — uses the single isDish row; portionGrams = 1 serving; servingCount = total servings.
 * ingredient — sums all non-exempt, linked rows; divides by parsed servings string.
 * mixed      — sums isDish row + all non-exempt linked component rows; divides by isDish.servingCount.
 *
 * cookMethod — optional cooking method string (e.g. 'bake', 'boil').  When provided
 *   and linkType is 'ingredient' or 'mixed', USDA retention factors from cookingLossModel
 *   are applied to heat-sensitive macros (Protein, TotalLipidFat) before summing.
 *   Dish link type is skipped — dish rows point to already-cooked USDA entries.
 */
export function calcNutritionJson(
  ingredients: IngRow[],
  linkType: string,
  servingsStr: string | null | undefined,
  cookMethod?: string | null
): NutritionJson | null {
  if (linkType === 'dish') {
    const dish = ingredients.find(i => i.isDish);
    if (!dish?.foodWord || !dish.portionGrams || !dish.servingCount) return null;
    const food = FOOD_MAP.get(dish.foodWord);
    if (!food) return null;
    const g = dish.portionGrams; // grams per serving (one portion)
    const scale = g / 100;
    return {
      perServing: {
        cal:  round1(food.cal  * scale),
        pro:  round1(food.pro  * scale),
        fat:  round1(food.fat  * scale),
        carb: round1(food.carb * scale),
        fib:  round1(food.fib  * scale),
        h2o:  round1(food.h2o  * scale),
        sug:  round1(food.sug  * scale),
      },
      per100g: {
        Energy_KCal:       round2(food.cal),
        Protein:           round2(food.pro),
        TotalLipidFat:     round2(food.fat),
        Carbohydrate:      round2(food.carb),
        FiberTotalDietary: round2(food.fib),
        SugarsTotal:       round2(food.sug),
        Water:             round2(food.h2o),
      },
      gramsPerServing: g,
      servings: dish.servingCount,
      sources: [{ ndb: food.ndb, name: food.display, grams: round1(g) }],
    };
  }

  // ingredient or mixed — determine serving count
  const dishRow = linkType === 'mixed' ? ingredients.find(i => i.isDish) : null;
  const servings = dishRow?.servingCount ?? parseServings(servingsStr);
  if (servings === 0) return null;

  // Cooking method retention factors — applied to all macros.
  const method = mapDishMethodToCookingMethod(cookMethod ?? null);
  const factors = {
    cal:  getRetentionFactor(method, MACRO_SR_KEY.cal),
    pro:  getRetentionFactor(method, MACRO_SR_KEY.pro),
    fat:  getRetentionFactor(method, MACRO_SR_KEY.fat),
    carb: getRetentionFactor(method, MACRO_SR_KEY.carb),
    fib:  getRetentionFactor(method, MACRO_SR_KEY.fib),
    h2o:  getRetentionFactor(method, MACRO_SR_KEY.h2o),
    sug:  getRetentionFactor(method, MACRO_SR_KEY.sug),
  };

  let totals = { cal: 0, pro: 0, fat: 0, carb: 0, fib: 0, h2o: 0, sug: 0 };
  let totalRawGrams = 0;
  let rawH2o = 0, rawFat = 0; // pre-retention totals needed for cooked weight
  const sources: NutritionSource[] = [];

  for (const ing of ingredients) {
    if (ing.exempt) continue;
    if (!ing.foodWord || !ing.portionGrams || !ing.servingCount) {
      continue;
    }
    const food = FOOD_MAP.get(ing.foodWord);
    if (!food) {
      continue;
    }

    const g = ing.portionGrams * ing.servingCount; // total grams for whole recipe
    const scale = g / 100;
    totalRawGrams  += g;
    rawH2o         += food.h2o * scale;
    rawFat         += food.fat * scale;
    totals.cal     += food.cal  * scale * factors.cal;
    totals.pro     += food.pro  * scale * factors.pro;
    totals.fat     += food.fat  * scale * factors.fat;
    totals.carb    += food.carb * scale * factors.carb;
    totals.fib     += food.fib  * scale * factors.fib;
    totals.h2o     += food.h2o  * scale * factors.h2o;
    totals.sug     += food.sug  * scale * factors.sug;
    sources.push({ ndb: food.ndb, name: food.display, grams: round1(g / servings) });
  }

  if (totalRawGrams === 0) return null;

  // Cooked mass = raw mass minus evaporated water and fat drip.
  const waterLost   = rawH2o * (1 - factors.h2o);
  const fatLost     = rawFat  * (1 - factors.fat);
  const cookedGrams = Math.max(totalRawGrams - waterLost - fatLost, 1e-6);
  const gramsPerServing = round1(cookedGrams / servings);

  const per100g = {
    Energy_KCal:       round2(totals.cal  * 100 / cookedGrams),
    Protein:           round2(totals.pro  * 100 / cookedGrams),
    TotalLipidFat:     round2(totals.fat  * 100 / cookedGrams),
    Carbohydrate:      round2(totals.carb * 100 / cookedGrams),
    FiberTotalDietary: round2(totals.fib  * 100 / cookedGrams),
    SugarsTotal:       round2(totals.sug  * 100 / cookedGrams),
    Water:             round2(totals.h2o  * 100 / cookedGrams),
  };

  const s = gramsPerServing / 100;
  return {
    perServing: {
      cal:  round1(per100g.Energy_KCal       * s),
      pro:  round1(per100g.Protein           * s),
      fat:  round1(per100g.TotalLipidFat     * s),
      carb: round1(per100g.Carbohydrate      * s),
      fib:  round1(per100g.FiberTotalDietary * s),
      h2o:  round1(per100g.Water             * s),
      sug:  round1(per100g.SugarsTotal       * s),
    },
    per100g,
    gramsPerServing,
    servings,
    sources,
  };
}
