import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchSr28Foods, type Sr28SearchScope } from '$lib/server/sr28Search';

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
    return json({ foods: [], error: 'search_failed' }, { status: 500 });
  }
};