/**
 * POST /api/match-ingredient
 *
 * Accepts a list of free-text ingredient strings and returns the top SR28
 * NDB matches for each, scored by the matchIngredient algorithm.
 *
 * Request body:
 *   { ingredients: string[] }           — up to 30 lines
 *
 * Response:
 *   { results: Record<string, IngredientMatch[]> }
 *   — keyed by the original ingredient string, value is top 5 matches
 *
 * Dev:  TURSO_SR28_URL=file:/absolute/path/to/comboo.db
 * Prod: TURSO_SR28_URL=libsql://your-db.turso.io  +  TURSO_SR28_TOKEN=...
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { matchIngredient } from '$lib/server/matchIngredient';

export const GET: RequestHandler = async () => {
  return json({
    endpoint: 'POST /api/match-ingredient',
    body: { ingredients: ['string', '...'], limit: '(optional, default 5, max 10)' },
    example: { ingredients: ['2 tbsp olive oil', '1 lb ground beef'] },
  });
};

const MAX_INGREDIENTS = 30;

export const POST: RequestHandler = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !Array.isArray((body as Record<string, unknown>).ingredients)
  ) {
    throw error(400, 'Body must be { ingredients: string[] }');
  }

  const ingredients: string[] = ((body as Record<string, unknown>).ingredients as unknown[])
    .filter((v) => typeof v === 'string' && (v as string).trim().length > 0)
    .slice(0, MAX_INGREDIENTS) as string[];

  if (ingredients.length === 0) {
    throw error(400, 'No valid ingredient strings provided');
  }

  try {
    const results: Record<string, Awaited<ReturnType<typeof matchIngredient>>> = {};

    // Run matches in parallel — each is an independent Turso query
    await Promise.all(
      ingredients.map(async (ing) => {
        results[ing] = await matchIngredient(ing, 5);
      }),
    );

    return json({ results });
  } catch (e) {
    console.error('[match-ingredient] Error:', e);
    throw error(500, 'SR28 match failed');
  }
};
