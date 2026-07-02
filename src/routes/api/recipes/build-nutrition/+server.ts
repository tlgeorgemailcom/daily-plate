/**
 * build-nutrition/+server.ts
 *
 * POST /api/recipes/build-nutrition
 *
 * Authoritative server-side nutrition calculation for community recipes.
 * Called by the submit endpoint after INSERT/UPDATE, and optionally
 * called directly from the frontend for a server-confirmed preview.
 *
 * Request body (JSON):
 * {
 *   ingredients: CommunityIngredient[],
 *   sections:    CommunitySection[],
 *   servings:    number,
 *   gramsPerServing: number
 * }
 *
 * Response (JSON):
 * {
 *   per100g:         MacroMap,
 *   gramsPerServing: number,
 *   totalCookedGrams: number,
 *   servings:        number,
 *   sections:        SectionBuildResult[],
 *   plausibility:    PlausibilityResult
 * }
 * or { error: string } on invalid input.
 *
 * HTTP status:
 *   200  — Build complete (plausibility may have flags).
 *   400  — Malformed request body.
 *   500  — DB error or unexpected failure.
 *
 * Auth: none required — this endpoint performs no writes and returns no personal
 * data.  Rate-limit at the CDN/edge layer if needed.
 *
 * See docs/vercel_pipeline.md §10 for specification.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import type { CommunityIngredient } from '$lib/nutrition/types.js';
import { buildRecipeCommunityV3, type CommunitySectionV3 } from '$lib/nutrition/buildRecipeCommunityV3.js';
import { fetchNutrientsByNdb }    from '$lib/server/nutrition/fetchNutrients.js';

// ── Input validation helpers ──────────────────────────────────────────────────

function isValidIngredient(x: unknown): x is CommunityIngredient {
  if (!x || typeof x !== 'object') return false;
  const obj = x as Record<string, unknown>;
  return (
    typeof obj.ndbNo        === 'string' &&
    obj.ndbNo.trim().length > 0 &&
    typeof obj.portionGrams === 'number' &&
    Number.isFinite(obj.portionGrams) &&
    obj.portionGrams >= 0
  );
}

function isValidSection(x: unknown): x is CommunitySectionV3 {
  if (!x || typeof x !== 'object') return false;
  const obj = x as Record<string, unknown>;
  return (
    typeof obj.sectionKey   === 'string' &&
    typeof obj.sectionLabel === 'string' &&
    typeof obj.cookMethod   === 'string'
  );
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return json({ error: 'Request body must be a JSON object' }, { status: 400 });
  }

  const {
    ingredients,
    sections,
    servings,
    gramsPerServing,
    dishCookMethod,
  } = body as Record<string, unknown>;

  // ── Validate ingredients ────────────────────────────────────────────────────
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return json({ error: 'ingredients must be a non-empty array' }, { status: 400 });
  }
  if (!ingredients.every(isValidIngredient)) {
    return json(
      { error: 'Each ingredient must have ndbNo (string) and portionGrams (number ≥ 0)' },
      { status: 400 }
    );
  }

  // ── Validate sections ────────────────────────────────────────────────────────
  const sectionsArr: CommunitySectionV3[] = [];
  if (Array.isArray(sections)) {
    if (!sections.every(isValidSection)) {
      return json(
        { error: 'Each section must have sectionKey, sectionLabel, and cookMethod strings' },
        { status: 400 }
      );
    }
    sectionsArr.push(...(sections as CommunitySectionV3[]));
  }
  // Sections are optional — a recipe with no sections is treated as fully unsectioned.

  // ── Validate numeric params ──────────────────────────────────────────────────
  const servingsNum        = Number(servings        ?? 1);
  const gramsPerServingNum = Number(gramsPerServing ?? 100);

  if (!Number.isFinite(servingsNum) || servingsNum < 1) {
    return json({ error: 'servings must be a positive number' }, { status: 400 });
  }
  if (!Number.isFinite(gramsPerServingNum) || gramsPerServingNum <= 0) {
    return json({ error: 'gramsPerServing must be a positive number' }, { status: 400 });
  }

  // ── Fetch nutrients from Turso (SR Legacy comboo.db) ───────────────────────────
  const ndbNos = (ingredients as CommunityIngredient[])
    .filter(i => !i.exempt && !i.isOptional)
    .map(i => i.ndbNo);

  let nutrientMap;
  try {
    nutrientMap = await fetchNutrientsByNdb(ndbNos);
  } catch (err) {
    console.error('[build-nutrition] fetchNutrientsByNdb failed:', err);
    return json({ error: 'Failed to fetch nutrient data from database' }, { status: 500 });
  }

  // ── Run build ────────────────────────────────────────────────────────────────
  const result = buildRecipeCommunityV3(
    sectionsArr,
    ingredients as CommunityIngredient[],
    nutrientMap,
    servingsNum,
    gramsPerServingNum,
    typeof dishCookMethod === 'string' ? dishCookMethod : undefined,
  );

  return json(result);
};
