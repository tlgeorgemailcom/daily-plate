/**
 * GET /api/admin/audit-recipes
 *
 * One-shot audit: re-computes live nutrition for every level in
 * generated-levels.ts using the current calcNutritionSR28 and reports
 * the gap between stored perServing and live perServing across all
 * 7 macros.
 *
 * Query params:
 *   threshold — % gap to flag (default 5)
 *   detail    — 'all' to include every recipe, otherwise only flagged ones
 *
 * Response shape:
 *   {
 *     summary: {
 *       totalLevels, withNutritionJson, withIngredients, computed,
 *       agree, drift, computeFailed,
 *       maxGapByMacro: { cal, pro, fat, ... },
 *       countByLinkType: { ingredient, dish, mixed }
 *     },
 *     flagged: [ { id, name, linkType, yieldW, yieldF, gaps: { cal: {stored, live, pctGap}, ... }, worst: { macro, pct } } ],
 *     allRecipes: [...]   (only if detail=all)
 *   }
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { LEVELS } from '$lib/farmers-basket/generated-levels';
import { calcNutritionSR28 } from '$lib/server/calcNutritionSR28';

const MACROS: Array<keyof StoredPerServing> = ['cal', 'pro', 'fat', 'carb', 'fib', 'h2o', 'sug'];

interface StoredPerServing {
  cal: number; pro: number; fat: number; carb: number; fib: number; h2o: number; sug: number;
}

interface MacroGap { stored: number; live: number; absDiff: number; pctGap: number; }

function withDefaultServingCount<T extends { servingCount?: number }>(row: T): T {
  const count = Number(row.servingCount ?? 1);
  return { ...row, servingCount: Number.isFinite(count) && count > 0 ? count : 1 };
}

function hasValidLink(row: { foodWord?: string; ndbNo?: string; portionGrams?: number }): boolean {
  const hasFood = (typeof row.foodWord === 'string' && row.foodWord.trim().length > 0)
    || (typeof row.ndbNo === 'string' && row.ndbNo.trim().length > 0);
  const portion = Number(row.portionGrams ?? 0);
  return hasFood && Number.isFinite(portion) && portion > 0;
}

function pct(stored: number, live: number): number {
  if (stored === 0 && live === 0) return 0;
  if (stored === 0) return Infinity;
  return Math.abs((live - stored) / stored) * 100;
}

function round2(v: number): number { return Math.round(v * 100) / 100; }

export const GET: RequestHandler = async ({ url }) => {
  const threshold = Number(url.searchParams.get('threshold') ?? '5');
  const wantAll = url.searchParams.get('detail') === 'all';

  let withNutritionJson = 0;
  let withIngredients = 0;
  let computed = 0;
  let agree = 0;
  let drift = 0;
  let computeFailed = 0;
  const countByLinkType: Record<string, number> = { ingredient: 0, dish: 0, mixed: 0, unknown: 0 };
  const maxGapByMacro: Record<string, { pct: number; recipeId: string; stored: number; live: number }> = {};
  for (const m of MACROS) maxGapByMacro[m] = { pct: 0, recipeId: '', stored: 0, live: 0 };

  const allReports: Array<Record<string, unknown>> = [];
  const flagged: Array<Record<string, unknown>> = [];

  for (const level of LEVELS) {
    const stored = level.nutritionJson?.perServing as StoredPerServing | undefined;
    if (!stored) continue;
    withNutritionJson++;

    const rawIngs = level.recipeIngredients ?? [];
    if (rawIngs.length === 0) continue;
    withIngredients++;

    // The Python generator that produced the stored nutritionJson always
    // computed values by SUMMING ingredient rows — even for recipes labeled
    // sr28Rule='Rule A'/'Rule B' with linkType='dish'. The isDish row and
    // sr28Rule label were stored as provenance, not as a computation directive.
    // (Verified: SWEET_019 chocolate glaze, Rule A, isDish NDB 19409 →
    //  dish-mode would give 324 cal/serving but stored=38.74, which matches
    //  ingredient-sum of 172g recipe / 16 tbsp servings.)
    // So we compare stored vs current ingredient-sum.
    const linkedIngs = rawIngs.filter(hasValidLink);
    const normalizedIngs = linkedIngs.map(withDefaultServingCount);
    const ingRows = normalizedIngs.filter(r => !r.isDish) as Parameters<typeof calcNutritionSR28>[0];
    const resolvedLinkType = 'ingredient';

    countByLinkType[resolvedLinkType] = (countByLinkType[resolvedLinkType] ?? 0) + 1;

    const yieldW = (level.nutritionJson as { yieldFactorWater?: number })?.yieldFactorWater ?? 1.0;
    const yieldF = (level.nutritionJson as { yieldFactorFat?: number })?.yieldFactorFat ?? 1.0;

    let live: StoredPerServing | null = null;
    let canonical: StoredPerServing | null = null;
    try {
      const result = await calcNutritionSR28(
        ingRows,
        resolvedLinkType,
        level.servings ?? null,
        level.cookingMethod ?? null,
        { yieldFactorWater: yieldW, yieldFactorFat: yieldF },
      );
      if (result?.perServing) {
        live = result.perServing as StoredPerServing;
        computed++;
      } else {
        computeFailed++;
      }

      // Also compute pure dish-mode (canonical NDB row × isDish portionGrams)
      // for Rule A/B comparison. This shows what the spec WOULD give if
      // Python had honored the rule labels.
      const dishRow = normalizedIngs.find(r => r.isDish);
      if (dishRow) {
        try {
          const dishResult = await calcNutritionSR28(
            [dishRow] as Parameters<typeof calcNutritionSR28>[0],
            'dish',
            level.servings ?? null,
            level.cookingMethod ?? null,
          );
          if (dishResult?.perServing) canonical = dishResult.perServing as StoredPerServing;
        } catch { /* ignore canonical errors */ }
      }
    } catch (err) {
      computeFailed++;
      const report = {
        id: level.id, name: level.name, linkType: resolvedLinkType,
        yieldW, yieldF, error: String(err),
      };
      allReports.push(report);
      flagged.push(report);
      continue;
    }

    if (!live) {
      const report = {
        id: level.id, name: level.name, linkType: resolvedLinkType,
        yieldW, yieldF, error: 'calcNutritionSR28 returned null',
      };
      allReports.push(report);
      flagged.push(report);
      continue;
    }

    const gaps: Record<string, MacroGap> = {};
    let worst: { macro: string; pct: number } = { macro: '', pct: 0 };
    for (const m of MACROS) {
      const s = Number(stored[m] ?? 0);
      const l = Number(live[m] ?? 0);
      const p = pct(s, l);
      gaps[m] = { stored: s, live: l, absDiff: round2(l - s), pctGap: round2(p) };
      if (p > worst.pct) worst = { macro: m, pct: p };
      if (p > maxGapByMacro[m].pct && Number.isFinite(p)) {
        maxGapByMacro[m] = { pct: round2(p), recipeId: level.id, stored: s, live: l };
      }
    }

    const isDrift = worst.pct > threshold;
    if (isDrift) drift++; else agree++;

    const report = {
      id: level.id,
      name: level.name,
      sr28Rule: level.sr28Rule,
      linkType: level.linkType,
      yieldW,
      yieldF,
      ingredientCount: ingRows.length,
      gaps,
      worst: { macro: worst.macro, pct: round2(worst.pct) },
      ...(canonical ? { canonical, canonicalCalGap: round2(pct(stored.cal, canonical.cal)) } : {}),
    };
    allReports.push(report);
    if (isDrift) flagged.push(report);
  }

  // Sort flagged by worst pct desc
  flagged.sort((a, b) => {
    const aw = (a.worst as { pct: number } | undefined)?.pct ?? Infinity;
    const bw = (b.worst as { pct: number } | undefined)?.pct ?? Infinity;
    return bw - aw;
  });

  return json({
    summary: {
      totalLevels: LEVELS.length,
      withNutritionJson,
      withIngredients,
      computed,
      agree,
      drift,
      computeFailed,
      threshold,
      maxGapByMacro,
      countByLinkType,
    },
    flagged,
    ...(wantAll ? { allRecipes: allReports } : {}),
  });
};
