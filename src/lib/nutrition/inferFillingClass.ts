/**
 * inferFillingClass.ts — Rule-based filling class inference for community recipes.
 *
 * Given the active (non-exempt, non-optional) ingredients of a section,
 * returns the filling class key that best describes the dominant water-binding
 * structure.  The key maps directly to BINDING in yieldCalc.ts.
 *
 * RULES (evaluated in order; first match wins):
 *   1. dominant egg-white + sugar → none        (meringue: model invalid)
 *   2. vegetables by grams ≥ 60% AND eggs → vegetable_custard
 *   3. dairy (milk/cream) ≥ 40% AND eggs → dairy_custard
 *   4. corn-syrup / treacle ≥ 20% AND eggs → syrup_custard
 *   5. starch-thickened ≥ 20% starch → starch_custard
 *   6. cornstarch ≥ 5% AND fruit ≥ 50% → thickened_fruit
 *   7. mincemeat keyword in Long_Desc → mincemeat
 *   8. fruit ≥ 60% AND in wrapper (wrappedSection flag) → strudel_fruit
 *   9. fruit ≥ 60% → dense_fruit (open-faced) or moderate_fruit (<60%)
 *  10. flour ≥ 30% → pastry, crumb_crust if no wet eggs, cake_batter otherwise
 *  Fallback → none
 *
 * ⚠ CONSTRAINT: never returns 'meringue'. Rule 1 guards this specifically.
 *   The BINDING map in yieldCalc.ts has no 'meringue' key for this reason.
 */

import type { NutrientRow } from './types.js';

// ── Internal helpers ──────────────────────────────────────────────────────────

interface ScoredIngredient {
  ndbNo: string;
  longDesc: string;
  fdGrpCd: string;
  grams: number;
}

function fractionOfTotal(items: ScoredIngredient[], totalGrams: number): number {
  if (totalGrams <= 0) return 0;
  return items.reduce((s, i) => s + i.grams, 0) / totalGrams;
}

/** USDA FdGrp_Cd codes as stored in DataCentralCombo (3-4 digit codes) */
const FRUIT_GROUPS  = new Set(['900']);          // Fruits & Fruit Juices
const VEG_GROUPS    = new Set(['1100']);         // Vegetables & Vegetable Products
const DAIRY_GROUPS  = new Set(['100']);          // Dairy & Egg Products
const CEREAL_GROUPS = new Set(['800', '1800', '2000']); // Grain Products

/** Milk/cream keywords — broad match; sub-matched from Long_Desc */
const DAIRY_PATTERN      = /milk|cream|creamer|half.and.half|evaporat/i;
const EGG_PATTERN        = /\begg\b/i;
const EGG_WHITE_PATTERN  = /egg.white|white.*egg|albumin/i;
const SUGAR_PATTERN      = /\bsugar\b|powdered.sugar|confection/i;
const SYRUP_PATTERN      = /corn.syrup|golden.syrup|treacle|molasses|maple.syrup/i;
const FLOUR_PATTERN      = /flour|cracker|graham|cookie|biscuit|pastry/i;
const STARCH_PATTERN     = /cornstarch|corn.starch|arrowroot|tapioca|starch/i;
const THICKENER_PATTERN  = /cornstarch|corn.starch|arrowroot|tapioca/i;
const MINCEMEAT_PATTERN  = /mincemeat/i;

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Infer the filling class from the given active ingredients.
 *
 * @param ingredients    Active (non-exempt, non-optional) ingredients with grams.
 *                       nutrients must be provided so we can inspect fdGrpCd and
 *                       Long_Desc without extra DB calls.
 * @param wrappedSection true if this section is enclosed in pastry (strudel, etc.)
 * @returns              A key from BINDING in yieldCalc.ts, or 'none'.
 */
export function inferFillingClass(
  ingredients: Array<{ grams: number; nutrients: NutrientRow }>,
  wrappedSection = false,
): string {
  if (ingredients.length === 0) return 'none';

  const totalGrams = ingredients.reduce((s, i) => s + i.grams, 0);

  const scored: ScoredIngredient[] = ingredients.map(i => ({
    ndbNo:    i.nutrients.ndbNo,
    longDesc: i.nutrients.longDesc,
    fdGrpCd:  i.nutrients.fdGrpCd,
    grams:    i.grams,
  }));

  // Classify by keyword / food group
  const eggWhites = scored.filter(s => EGG_WHITE_PATTERN.test(s.longDesc));
  const eggs      = scored.filter(s => EGG_PATTERN.test(s.longDesc) && DAIRY_GROUPS.has(s.fdGrpCd));
  const dairyFluids = scored.filter(s =>
    DAIRY_GROUPS.has(s.fdGrpCd) && DAIRY_PATTERN.test(s.longDesc)
  );
  const syrupy    = scored.filter(s => SYRUP_PATTERN.test(s.longDesc));
  const starches  = scored.filter(s => STARCH_PATTERN.test(s.longDesc));
  const thickeners = scored.filter(s => THICKENER_PATTERN.test(s.longDesc));
  const fruits    = scored.filter(s => FRUIT_GROUPS.has(s.fdGrpCd));
  const veggies   = scored.filter(s => VEG_GROUPS.has(s.fdGrpCd));
  const flourItems = scored.filter(s =>
    (CEREAL_GROUPS.has(s.fdGrpCd) || FLOUR_PATTERN.test(s.longDesc)) &&
    !STARCH_PATTERN.test(s.longDesc)
  );

  const fEggWhite  = fractionOfTotal(eggWhites,   totalGrams);
  const fEgg       = fractionOfTotal(eggs,         totalGrams);
  const fDairy     = fractionOfTotal(dairyFluids,  totalGrams);
  const fSyrup     = fractionOfTotal(syrupy,       totalGrams);
  const fStarch    = fractionOfTotal(starches,     totalGrams);
  const fThickener = fractionOfTotal(thickeners,   totalGrams);
  const fFruit     = fractionOfTotal(fruits,       totalGrams);
  const fVeg       = fractionOfTotal(veggies,      totalGrams);
  const fFlour     = fractionOfTotal(flourItems,   totalGrams);

  const hasEggs   = fEgg  > 0.04;   // at least a small egg fraction
  const hasSugar  = scored.some(s => SUGAR_PATTERN.test(s.longDesc));

  // ── Rule 1: egg-white + sugar dominant → meringue → return 'none' ────────
  // BINDING map has no 'meringue' key; this rule prevents an invalid class being
  // passed downstream.
  if (fEggWhite > 0.30 && hasSugar) return 'none';

  // ── Rule 2: vegetable custard ─────────────────────────────────────────────
  if (fVeg >= 0.60 && hasEggs) return 'vegetable_custard';

  // ── Rule 3: dairy custard ─────────────────────────────────────────────────
  if (fDairy >= 0.40 && hasEggs) return 'dairy_custard';

  // ── Rule 4: syrup custard ─────────────────────────────────────────────────
  if (fSyrup >= 0.20 && hasEggs) return 'syrup_custard';

  // ── Rule 5: starch custard (thickened non-fruit) ──────────────────────────
  if (fStarch >= 0.20 && fFruit < 0.30) return 'starch_custard';

  // ── Rule 6: cornstarch-thickened fruit ────────────────────────────────────
  if (fThickener >= 0.05 && fFruit >= 0.50) return 'thickened_fruit';

  // ── Rule 7: mincemeat ─────────────────────────────────────────────────────
  if (scored.some(s => MINCEMEAT_PATTERN.test(s.longDesc))) return 'mincemeat';

  // ── Rule 8: strudel fruit (fruit in wrapped section) ──────────────────────
  if (fFruit >= 0.60 && wrappedSection) return 'strudel_fruit';

  // ── Rule 9: fruit-dominant ────────────────────────────────────────────────
  if (fFruit >= 0.60) return 'dense_fruit';
  if (fFruit >= 0.35) return 'moderate_fruit';

  // ── Rule 10: flour / pastry shell ────────────────────────────────────────
  if (fFlour >= 0.30) {
    if (hasEggs) return 'cake_batter';
    const isCrumb = scored.some(s => /cracker|graham|cookie|biscuit/i.test(s.longDesc));
    return isCrumb ? 'crumb_crust' : 'pastry';
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return 'none';
}
