import { FOODS } from '$lib/data/food-portions';

// Built once per cold start — avoids O(n) scan per ingredient
const FOOD_MAP = new Map(FOODS.map(f => [f.word, f]));

export interface NutritionJson {
  perServing: {
    cal: number; pro: number; fat: number;
    carb: number; fib: number; h2o: number; sug: number;
  };
  gramsPerServing: number;
  servings: number;
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
 */
export function calcNutritionJson(
  ingredients: IngRow[],
  linkType: string,
  servingsStr: string | null | undefined
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
      gramsPerServing: g,
      servings: dish.servingCount,
    };
  }

  // ingredient or mixed — determine serving count
  const dishRow = linkType === 'mixed' ? ingredients.find(i => i.isDish) : null;
  const servings = dishRow?.servingCount ?? parseServings(servingsStr);
  if (servings === 0) return null;

  let totals = { cal: 0, pro: 0, fat: 0, carb: 0, fib: 0, h2o: 0, sug: 0 };
  let totalGrams = 0;

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
    totalGrams     += g;
    totals.cal     += food.cal  * scale;
    totals.pro     += food.pro  * scale;
    totals.fat     += food.fat  * scale;
    totals.carb    += food.carb * scale;
    totals.fib     += food.fib  * scale;
    totals.h2o     += food.h2o  * scale;
    totals.sug     += food.sug  * scale;
  }

  if (totalGrams === 0) return null;

  return {
    perServing: {
      cal:  round1(totals.cal  / servings),
      pro:  round1(totals.pro  / servings),
      fat:  round1(totals.fat  / servings),
      carb: round1(totals.carb / servings),
      fib:  round1(totals.fib  / servings),
      h2o:  round1(totals.h2o  / servings),
      sug:  round1(totals.sug  / servings),
    },
    gramsPerServing: round1(totalGrams / servings),
    servings,
  };
}
