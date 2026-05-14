import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchSr28FoodsWithNutrients } from '$lib/server/sr28Search';

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const limitParam = Number(url.searchParams.get('limit') ?? '20');

  if (query.length < 2) {
    return json({ foods: [] });
  }

  try {
    const foods = await searchSr28FoodsWithNutrients(query, 'all', limitParam);
    return json({ foods });
  } catch (error) {
    console.error('[/api/recipes/food-search] sr28 search error:', error);
    return json({ foods: [], error: 'search_failed' }, { status: 500 });
  }
};