import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchSr28Foods, type Sr28SearchScope } from '$lib/server/sr28Search';
import { queryOne } from '$lib/server/turso';

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const scopeParam = url.searchParams.get('scope');
  const scope: Sr28SearchScope = scopeParam === 'baby' ? 'baby' : 'all';
  const limitParam = Number(url.searchParams.get('limit') ?? '80');
  const playerId = url.searchParams.get('playerId')?.trim() ?? '';

  if (!playerId) {
    return json({ foods: [], error: 'premium_required' }, { status: 401 });
  }

  const player = await queryOne<{ subscription_tier: string }>(
    'SELECT subscription_tier FROM players WHERE id = ?',
    [playerId]
  );

  if (!player || player.subscription_tier === 'free') {
    return json({ foods: [], error: 'premium_required' }, { status: 403 });
  }

  try {
    const foods = await searchSr28Foods(query, scope, limitParam);
    return json({ foods });
  } catch (error) {
    console.error('[/api/foods/search] sr28 search error:', error);
    return json({ foods: [], error: 'search_failed' }, { status: 500 });
  }
};