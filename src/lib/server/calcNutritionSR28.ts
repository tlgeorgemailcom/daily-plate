/**
 * calcNutritionSR28
 * =================
 * SR28-backed nutrition calculator that mirrors the v2 Python pipeline.
 *
 * Differences from calcNutritionJson (food-portions.ts subset):
 *  1. Queries DataCentralCombo via NDB number — full SR28 accuracy, not the 1,477-food subset.
 *  2. Applies the full cooking retention table from cookingLossModel (all nutrients).
 *  3. Applies yield factors (water loss + fat drip) to compute cooked serving weight,
 *     exactly as the v2 Python pipeline does for Rule C/D recipes.
 *  4. Detects already-cooked SR28 entries (cookMethod set to non-raw) and skips
 *     double-applying retention for those ingredients.
 *  5. Falls back gracefully to calcNutritionJson for any ingredient missing an NDB number.
 *
 * Used by: preview-nutrition endpoint, submit, draft, my save paths.
 */

import { getSR28Db } from '$lib/server/turso';
import { FOODS } from '$lib/data/food-portions';
import { mapDishMethodToCookingMethod, getRetentionFactor } from '$lib/data/cookingLossModel';
import type { NutritionJson, NutritionSource } from '$lib/server/calcNutrition';

// Fallback lookup for ingredients that only have foodWord (no ndbNo).
const FOOD_MAP_BY_WORD = new Map(FOODS.map(f => [f.word, f]));

// SR28 entries whose cookMethod indicates they are already-cooked products.
// Retention factors should NOT be double-applied to these.
const RAW_COOK_METHODS = new Set([
  'Raw', 'raw', 'Unprepared', 'Uncooked', 'Unheated', 'Unroasted',
  'Not Prepared', 'Raw or Unheated', 'z', 'null', 'N/A', '',
]);

export interface CalcSR28Options {
  /** Water-mass yield factor (0–1). Fraction of raw water retained after cooking.
   *  e.g. 0.70 means 30% of ingredient water evaporates. Default 1.0 (no loss). */
  yieldFactorWater?: number;
  /** Fat-mass yield factor (0–1). Fraction of raw fat retained after cooking.
   *  e.g. 0.95 means 5% fat drip. Default 1.0 (no loss). */
  yieldFactorFat?: number;
}

interface IngRow {
  ndbNo?: string;
  foodWord?: string;
  portionGrams?: number;
  servingCount?: number;
  exempt?: boolean;
  isDish?: boolean;
}

interface SR28NutrientRow {
  Energy_KCal: number;
  Water: number;
  Protein: number;
  TotalLipidFat: number;
  Carbohydrate: number;
  FiberTotalDietary: number;
  SugarsTotal: number;
  longDesc: string;
  alreadyCooked: boolean;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function parseServings(s: string | null | undefined): number {
  if (!s) return 1;
  const n = parseInt(s.replace(/[^0-9]/g, ''));
  return n > 0 ? n : 1;
}

/** Batch-fetch SR28 nutrient data for a set of NDB numbers. */
async function fetchSR28Rows(ndbNos: Set<string>): Promise<Map<string, SR28NutrientRow>> {
  if (ndbNos.size === 0) return new Map();

  const db = getSR28Db();
  const args = Array.from(ndbNos);
  const placeholders = args.map(() => '?').join(', ');

  const result = await db.execute({
    sql: `SELECT NDB_NO, Long_Desc, cookMethod,
                 Energy_KCal, Water, Protein, TotalLipidFat,
                 Carbohydrate, FiberTotalDietary, SugarsTotal
          FROM DataCentralCombo
          WHERE NDB_NO IN (${placeholders})`,
    args,
  });

  const map = new Map<string, SR28NutrientRow>();
  for (const row of result.rows) {
    const ndb = String(row.NDB_NO ?? '');
    const cm = row.cookMethod ? String(row.cookMethod).trim() : '';
    map.set(ndb, {
      Energy_KCal:      Number(row.Energy_KCal ?? 0),
      Water:            Number(row.Water ?? 0),
      Protein:          Number(row.Protein ?? 0),
      TotalLipidFat:    Number(row.TotalLipidFat ?? 0),
      Carbohydrate:     Number(row.Carbohydrate ?? 0),
      FiberTotalDietary: Number(row.FiberTotalDietary ?? 0),
      SugarsTotal:      Number(row.SugarsTotal ?? 0),
      longDesc:         String(row.Long_Desc ?? ''),
      alreadyCooked:    !RAW_COOK_METHODS.has(cm),
    });
  }
  return map;
}

/**
 * Compute per-serving nutrition using SR28 (DataCentralCombo) for full accuracy.
 *
 * Mirrors the v2 Python pipeline (build_ingredient_sum):
 *  - Protein retention factor applied for heat-sensitive nutrients.
 *  - Water and fat yield factors applied to compute cooked serving weight.
 *  - Already-cooked SR28 entries skip double-retention.
 *  - Falls back to food-portions.ts data when NDB is not provided.
 *
 * Returns null if no usable ingredient data is found.
 */
export async function calcNutritionSR28(
  ingredients: IngRow[],
  linkType: string,
  servingsStr: string | null | undefined,
  cookMethod?: string | null,
  options: CalcSR28Options = {},
): Promise<NutritionJson | null> {
  const yieldFactorWater = options.yieldFactorWater ?? 1.0;
  const yieldFactorFat   = options.yieldFactorFat   ?? 1.0;

  // Collect NDB numbers to batch-fetch.
  const ndbNos = new Set<string>();
  for (const ing of ingredients) {
    if (ing.ndbNo) ndbNos.add(ing.ndbNo);
  }
  const sr28Map = await fetchSR28Rows(ndbNos);

  const method = mapDishMethodToCookingMethod(cookMethod ?? null);

  // ── dish mode ───────────────────────────────────────────────────────────────
  if (linkType === 'dish') {
    const dish = ingredients.find(i => i.isDish);
    if (!dish?.portionGrams || !dish.servingCount) return null;

    if (dish.ndbNo && sr28Map.has(dish.ndbNo)) {
      const food = sr28Map.get(dish.ndbNo)!;
      const g = dish.portionGrams;
      const scale = g / 100;
      return {
        perServing: {
          cal:  round1(food.Energy_KCal      * scale),
          pro:  round1(food.Protein          * scale),
          fat:  round1(food.TotalLipidFat    * scale),
          carb: round1(food.Carbohydrate     * scale),
          fib:  round1(food.FiberTotalDietary * scale),
          h2o:  round1(food.Water            * scale),
          sug:  round1(food.SugarsTotal      * scale),
        },
        gramsPerServing: g,
        servings: dish.servingCount,
        sources: [{ ndb: dish.ndbNo, name: food.longDesc, grams: round1(g) }],
      };
    }

    // Fallback: food-portions.ts
    if (dish.foodWord) {
      const food = FOOD_MAP_BY_WORD.get(dish.foodWord);
      if (food) {
        const g = dish.portionGrams;
        const scale = g / 100;
        return {
          perServing: {
            cal: round1(food.cal * scale), pro: round1(food.pro * scale),
            fat: round1(food.fat * scale), carb: round1(food.carb * scale),
            fib: round1(food.fib * scale), h2o: round1(food.h2o * scale),
            sug: round1(food.sug * scale),
          },
          gramsPerServing: g,
          servings: dish.servingCount,
          sources: [{ ndb: food.ndb, name: food.display, grams: round1(g) }],
        };
      }
    }
    return null;
  }

  // ── ingredient / mixed mode ──────────────────────────────────────────────────
  const dishRow = linkType === 'mixed' ? ingredients.find(i => i.isDish) : null;
  const servings = dishRow?.servingCount ?? parseServings(servingsStr);
  if (servings === 0) return null;

  const proFactor = getRetentionFactor(method, 'Protein');
  // TotalLipidFat is controlled by yieldFactorFat per v2 pipeline, not the retention table.
  // Other macros (cal, carb, fib, sug) have no retention loss entry → factor is 1.0.

  let totCal = 0, totPro = 0, totFat = 0, totCarb = 0, totFib = 0, totH2o = 0, totSug = 0;
  let rawTotalGrams = 0;
  let rawWaterTotal = 0;
  let rawFatTotal   = 0;
  const sources: NutritionSource[] = [];

  for (const ing of ingredients) {
    if (ing.exempt) continue;
    if (!ing.portionGrams || !ing.servingCount) continue;

    const g = ing.portionGrams * ing.servingCount;
    const scale = g / 100;
    rawTotalGrams += g;

    if (ing.ndbNo && sr28Map.has(ing.ndbNo)) {
      const food = sr28Map.get(ing.ndbNo)!;
      rawWaterTotal += food.Water          * scale;
      rawFatTotal   += food.TotalLipidFat  * scale;

      // Already-cooked SR28 entries (e.g. canned goods, pre-made stock):
      // skip re-applying retention — the nutrient values already reflect cooking.
      const pf = food.alreadyCooked ? 1.0 : proFactor;

      totCal  += food.Energy_KCal       * scale;           // Energy: no retention entry → 1.0
      totPro  += food.Protein           * scale * pf;
      totFat  += food.TotalLipidFat     * scale * yieldFactorFat;
      totCarb += food.Carbohydrate      * scale;
      totFib  += food.FiberTotalDietary * scale;
      totH2o  += food.Water             * scale * yieldFactorWater;
      totSug  += food.SugarsTotal       * scale;
      sources.push({ ndb: ing.ndbNo, name: food.longDesc, grams: round1(g / servings) });

    } else if (ing.foodWord) {
      // Fallback: food-portions.ts (less accurate but keeps incomplete recipes working).
      const food = FOOD_MAP_BY_WORD.get(ing.foodWord);
      if (!food) continue;
      rawWaterTotal += food.h2o * scale;
      rawFatTotal   += food.fat * scale;
      const pf = proFactor;
      totCal  += food.cal  * scale;
      totPro  += food.pro  * scale * pf;
      totFat  += food.fat  * scale * yieldFactorFat;
      totCarb += food.carb * scale;
      totFib  += food.fib  * scale;
      totH2o  += food.h2o  * scale * yieldFactorWater;
      totSug  += food.sug  * scale;
      sources.push({ ndb: food.ndb, name: food.display, grams: round1(g / servings) });
    }
    // Skip ingredients with neither ndbNo nor foodWord.
  }

  if (rawTotalGrams === 0) return null;

  // Cooked mass = raw mass minus evaporated water minus fat drip.
  const waterLost = rawWaterTotal * (1.0 - yieldFactorWater);
  const fatLost   = rawFatTotal   * (1.0 - yieldFactorFat);
  const cookedTotalGrams = Math.max(rawTotalGrams - waterLost - fatLost, 1e-6);

  return {
    perServing: {
      cal:  round1(totCal  / servings),
      pro:  round1(totPro  / servings),
      fat:  round1(totFat  / servings),
      carb: round1(totCarb / servings),
      fib:  round1(totFib  / servings),
      h2o:  round1(totH2o  / servings),
      sug:  round1(totSug  / servings),
    },
    gramsPerServing: round1(cookedTotalGrams / servings),
    servings,
    sources,
  };
}
