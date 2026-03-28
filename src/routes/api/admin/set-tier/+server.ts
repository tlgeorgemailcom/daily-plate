import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute } from '$lib/server/turso';

const VALID_TIERS = new Set(['free', 'plus', 'allin', 'moderator']);

export const POST: RequestHandler = async ({ request, cookies }) => {
  if (cookies.get('admin_auth') !== 'ok') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { player_id, tier } = body as Record<string, unknown>;

  if (!player_id || typeof player_id !== 'string') {
    return json({ error: 'player_id required' }, { status: 400 });
  }
  if (!tier || typeof tier !== 'string' || !VALID_TIERS.has(tier)) {
    return json({ error: `tier must be one of: ${[...VALID_TIERS].join(', ')}` }, { status: 400 });
  }

  const affected = await execute(
    'UPDATE players SET subscription_tier = ? WHERE id = ?',
    [tier, player_id]
  );

  if (affected === 0) {
    return json({ error: 'Player not found' }, { status: 404 });
  }

  return json({ ok: true });
};
