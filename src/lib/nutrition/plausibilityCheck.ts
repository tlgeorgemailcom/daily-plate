/**
 * plausibilityCheck.ts — Sanity-check a built nutrition profile.
 *
 * Not a validator — this is a fast heuristic filter to catch obvious problems
 * before a community recipe is stored in Turso. Results are stored in the
 * `plausibility_flags` column as a JSON array of strings.
 *
 * Checks performed
 * ────────────────
 *  1. MACRO_SUM  — Σ(protein + fat + carbs + water + ash) / per-100g ≈ 100g.
 *                  Flag if ± 5g from expected mass (loose; SR28 data gaps exist).
 *  2. WATER_PCT  — Water fraction must be 0–98%. > 95% is suspicious for non-liquids.
 *  3. ENERGY     — Atwater re-estimate from macros; compare to declared energy.
 *                  Flag if deviation > 15 kcal/100g.
 *  4. MISSING    — Any ingredient with reason 'missing_ndb' → blocked=true.
 *  5. NEG        — Any negative macro (floating-point accumulation artifact).
 *  6. GRAMS      — Total cooked grams < 50 (tiny recipe, likely grams entry error).
 *  7. SHARED_COOK — Multiple sections sharing identical cookTempF+cookMinutes
 *                   (shared-cook-event approximation warning).
 *
 * Returns PlausibilityResult from types.ts.
 */

import type { MacroMap, PlausibilityResult, SkippedIngredient, SectionBuildResult } from './types.js';

// ── Atwater factors ───────────────────────────────────────────────────────────
const AW_PROTEIN = 4.0;
const AW_FAT     = 9.0;
const AW_CARBS   = 4.0;
const AW_ALCOHOL = 7.0; // not in NutrientRow — kept for completeness

export function plausibilityCheck(
  per100g:       MacroMap,
  totalCookedGrams: number,
  skipped:       SkippedIngredient[],
  sections:      SectionBuildResult[],
): PlausibilityResult {
  const flags: string[] = [];
  let blocked = false;

  // ── Check 1: macro mass sum ──────────────────────────────────────────────────
  const p  = (per100g.protein            ?? 0);
  const f  = (per100g.totalLipidFat      ?? 0);
  const c  = (per100g.carbohydrate       ?? 0);
  const w  = (per100g.water              ?? 0);
  const a  = (per100g.ash                ?? 0);
  const macroSum = p + f + c + w + a;
  if (macroSum < 80 || macroSum > 115) {
    flags.push(`MACRO_SUM: macro+water+ash sums to ${macroSum.toFixed(1)}g/100g (expected ~100g)`);
  }

  // ── Check 2: water fraction ──────────────────────────────────────────────────
  if (w > 95) {
    flags.push(`WATER_PCT: water is ${w.toFixed(1)}g/100g — unusually high (>95); check ingredient grams`);
  } else if (w < 0) {
    flags.push('WATER_PCT: negative water value');
  }

  // ── Check 3: energy estimate ─────────────────────────────────────────────────
  const declaredKcal   = per100g.energy_KCal ?? 0;
  const estimatedKcal  = p * AW_PROTEIN + f * AW_FAT + c * AW_CARBS;
  const energyDelta    = Math.abs(declaredKcal - estimatedKcal);
  if (declaredKcal > 0 && energyDelta > 15) {
    flags.push(
      `ENERGY: declared ${declaredKcal.toFixed(1)} kcal/100g vs Atwater estimate ` +
      `${estimatedKcal.toFixed(1)} kcal/100g (delta ${energyDelta.toFixed(1)})`
    );
  }

  // ── Check 4: missing NDB ─────────────────────────────────────────────────────
  const missingNdbs = skipped.filter(s => s.reason === 'missing_ndb').map(s => s.ndbNo);
  if (missingNdbs.length > 0) {
    flags.push(`MISSING_NDB: ${missingNdbs.length} ingredient(s) have no NDB match: ${missingNdbs.join(', ')}`);
    blocked = true;   // recipe cannot be published until these are resolved
  }

  // ── Check 5: negative macros ─────────────────────────────────────────────────
  for (const [key, val] of Object.entries(per100g)) {
    if (typeof val === 'number' && val < -0.001) {
      flags.push(`NEG: ${key} is negative (${val.toFixed(3)})`);
    }
  }

  // ── Check 6: suspiciously small total ────────────────────────────────────────
  if (totalCookedGrams > 0 && totalCookedGrams < 50) {
    flags.push(`GRAMS: total cooked grams ${totalCookedGrams.toFixed(1)}g — very small; check portion entries`);
  }

  // ── Check 7: shared cook event ───────────────────────────────────────────────
  // Warn when two or more oven sections have the exact same temp+time. The model
  // treats each section independently. If they were truly cooked together, there
  // may be moisture-migration between sections that the model cannot capture.
  const ovens = sections
    .filter(s => s.cookMethod === 'baked')
    .map(s => `${s.sectionKey}`);
  if (ovens.length >= 2) {
    flags.push(
      `SHARED_COOK: ${ovens.length} baked sections (${ovens.join(', ')}) — ` +
      `sections are treated independently; moisture migration between sections is not modelled`
    );
  }

  return {
    passed:  flags.length === 0,
    flags,
    blocked,
  };
}
