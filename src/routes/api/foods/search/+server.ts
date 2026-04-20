import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchSr28Foods, type Sr28SearchScope } from '$lib/server/sr28Search';

function classifySearchError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lowered = message.toLowerCase();

  if (lowered.includes('not configured') || lowered.includes('missing')) {
    return 'sr28_not_configured';
  }

  if (lowered.includes('datacentralcombo') && lowered.includes('no such table')) {
    return 'datacentralcombo_missing';
  }

  if (lowered.includes('auth') || lowered.includes('token') || lowered.includes('unauthorized')) {
    return 'sr28_auth_failed';
  }

  return message || 'search_failed';
}

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const scopeParam = url.searchParams.get('scope');
  const scope: Sr28SearchScope = scopeParam === 'baby' ? 'baby' : 'all';
  const limitParam = Number(url.searchParams.get('limit') ?? '80');

  try {
    const foods = await searchSr28Foods(query, scope, limitParam);
    return json({ foods });
  } catch (error) {
    console.error('[/api/foods/search] sr28 search error:', error);
    const detail = classifySearchError(error);
    return json({ foods: [], error: 'search_failed', detail }, { status: 500 });
  }
};