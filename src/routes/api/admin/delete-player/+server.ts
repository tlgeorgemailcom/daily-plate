import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { execute } from '$lib/server/turso';

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

  const { player_id } = body as Record<string, unknown>;

  if (!player_id || typeof player_id !== 'string') {
    return json({ error: 'player_id required' }, { status: 400 });
  }

  // Clear self-referencing billing_owner_id FK before deleting
  await execute('UPDATE players SET billing_owner_id = NULL WHERE billing_owner_id = ?', [player_id]);

  const affected = await execute('DELETE FROM players WHERE id = ?', [player_id]);

  if (affected === 0) {
    return json({ error: 'Player not found' }, { status: 404 });
  }

  return json({ ok: true });
};
