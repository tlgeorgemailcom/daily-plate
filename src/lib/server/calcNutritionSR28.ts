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
  /** Fiber-mass yield factor (0–1). Fraction of raw dietary fiber retained after
   *  cooking/prep (e.g. 0.579 when potato skin is discarded after boiling).
   *  Fiber has Atwater coefficient 0 — losing fiber reduces mass but not energy.
   *  Default 1.0 (no loss). */
  yieldFactorFiber?: number;
}

interface IngRow {
  ndbNo?: string;
  foodWord?: string;
  portionGrams?: number;
  servingCount?: number;
  exempt?: boolean;
  isDish?: boolean;
  discarded?: boolean;
  discardPercent?: number;
}

function retainedIngredientFraction(ing: IngRow): number {
  if (!ing.discarded) return 1;
  const discardPercent = Number.isFinite(ing.discardPercent) ? ing.discardPercent! : 100;
  return Math.max(0, Math.min(1, 1 - discardPercent / 100));
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

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function parseServings(s: string | null | undefined): number {
  if (!s) return 1;
  // Extract from "(makes N)" pattern first — avoids "1 slice (makes 8)" → 18.
  const makesMatch = s.match(/\(makes\s+(\d+)\)/i);
  if (makesMatch) {
    const n = parseInt(makesMatch[1]);
    return n > 0 ? n : 1;
  }
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
  const yieldFactorFiber = options.yieldFactorFiber ?? 1.0;

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
        per100g: {
          Energy_KCal:       round2(food.Energy_KCal),
          Protein:           round2(food.Protein),
          TotalLipidFat:     round2(food.TotalLipidFat),
          Carbohydrate:      round2(food.Carbohydrate),
          FiberTotalDietary: round2(food.FiberTotalDietary),
          SugarsTotal:       round2(food.SugarsTotal),
          Water:             round2(food.Water),
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
    }
    return null;
  }

  // ── ingredient / mixed mode ──────────────────────────────────────────────────
  // Both 'ingredient' and 'mixed' modes sum individual ingredient rows.
  // In 'mixed' mode an isDish row may be present for UI purposes — skip it
  // so it is not double-counted in the ingredient sum.
  const dishRow = linkType === 'mixed' ? ingredients.find(i => i.isDish) : null;
  const servings = dishRow?.servingCount ?? parseServings(servingsStr);
  if (servings === 0) return null;

  const proFactor = getRetentionFactor(method, 'Protein');
  // TotalLipidFat is controlled by yieldFactorFat per v2 pipeline, not the retention table.
  // Other macros (cal, carb, fib, sug) have no retention loss entry → factor is 1.0.

  let totCal = 0, totPro = 0, totFat = 0, totCarb = 0, totFib = 0, totH2o = 0, totSug = 0;
  let rawTotalGrams = 0;
  // Raw water, fat, and fiber totals (BEFORE yield factors) — used to compute mass lost
  // during cooking, per v2/v3 spec:
  //   cooked_grams = raw - water_lost - fat_lost - fiber_lost
  //   water_lost   = sum(ing_water_g) * (1 - yieldFactorWater)
  //   fat_lost     = sum(ing_fat_g)   * (1 - yieldFactorFat)
  //   fiber_lost   = sum(ing_fiber_g) * (1 - yieldFactorFiber)
  let rawWaterTotal = 0;
  let rawFatTotal   = 0;
  let rawFiberTotal = 0;
  const sources: NutritionSource[] = [];

  for (const ing of ingredients) {
    if (ing.exempt) continue;
    if (ing.isDish) continue; // dish rows are handled above; skip in ingredient sum
    if (!ing.portionGrams || !ing.servingCount) continue;

    const g = ing.portionGrams * ing.servingCount * retainedIngredientFraction(ing);
    if (g <= 0) continue;
    const scale = g / 100;
    rawTotalGrams += g;

    if (ing.ndbNo && sr28Map.has(ing.ndbNo)) {
      const food = sr28Map.get(ing.ndbNo)!;

      // Already-cooked SR28 entries (e.g. canned goods, pre-made stock):
      // skip re-applying retention — the nutrient values already reflect cooking.
      const pf = food.alreadyCooked ? 1.0 : proFactor;

      totCal  += food.Energy_KCal       * scale;           // Energy: no retention entry → 1.0
      totPro  += food.Protein           * scale * pf;
      totFat  += food.TotalLipidFat     * scale * yieldFactorFat;
      totCarb += food.Carbohydrate      * scale;
      totFib  += food.FiberTotalDietary * scale * yieldFactorFiber;
      totH2o  += food.Water             * scale * yieldFactorWater;
      totSug  += food.SugarsTotal       * scale;
      rawWaterTotal += food.Water         * scale;
      rawFatTotal   += food.TotalLipidFat * scale;
      rawFiberTotal += food.FiberTotalDietary * scale;
      sources.push({ ndb: ing.ndbNo, name: food.longDesc, grams: round1(g / servings) });

    } else if (ing.foodWord) {
      // Fallback: food-portions.ts (less accurate but keeps incomplete recipes working).
      const food = FOOD_MAP_BY_WORD.get(ing.foodWord);
      if (!food) continue;
      const pf = proFactor;
      totCal  += food.cal  * scale;
      totPro  += food.pro  * scale * pf;
      totFat  += food.fat  * scale * yieldFactorFat;
      totCarb += food.carb * scale;
      totFib  += food.fib  * scale * yieldFactorFiber;
      totH2o  += food.h2o  * scale * yieldFactorWater;
      totSug  += food.sug  * scale;
      rawWaterTotal += food.h2o * scale;
      rawFatTotal   += food.fat * scale;
      rawFiberTotal += food.fib * scale;
      sources.push({ ndb: food.ndb, name: food.display, grams: round1(g / servings) });
    }
    // Skip ingredients with neither ndbNo nor foodWord.
  }

  if (rawTotalGrams === 0) return null;

  // Per v2 spec (docs/recipes_v2.md):
  //   "Each recipe is per-100g cooked to align with the canonical NDB row."
  //   cooked_grams = raw - water_lost - fat_lost
  // So per-100g divisor and gramsPerServing both use cooked mass. Per-serving
  // values are unaffected (per100g × gramsPS/100 cancels the divisor change).
  const waterLost = rawWaterTotal * (1 - yieldFactorWater);
  const fatLost   = rawFatTotal   * (1 - yieldFactorFat);
  const fiberLost = rawFiberTotal * (1 - yieldFactorFiber);
  const cookedTotalGrams = Math.max(rawTotalGrams - waterLost - fatLost - fiberLost, 1);
  const totalGrams = cookedTotalGrams;

  const gramsPS = round1(totalGrams / servings);
  const per100g = {
    Energy_KCal:       round2(totCal  * 100 / totalGrams),
    Protein:           round2(totPro  * 100 / totalGrams),
    TotalLipidFat:     round2(totFat  * 100 / totalGrams),
    Carbohydrate:      round2(totCarb * 100 / totalGrams),
    FiberTotalDietary: round2(totFib  * 100 / totalGrams),
    SugarsTotal:       round2(totSug  * 100 / totalGrams),
    Water:             round2(totH2o  * 100 / totalGrams),
  };
  const s = gramsPS / 100;
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
    gramsPerServing: gramsPS,
    servings,
    sources,
  };
}
