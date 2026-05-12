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

  try {
    // Remove all child rows that reference this player before deleting.
    // household_members has ON DELETE CASCADE so it handles itself.
    await execute('UPDATE players SET billing_owner_id = NULL WHERE billing_owner_id = ?', [player_id]);
    await execute('DELETE FROM game_stats WHERE player_id = ?', [player_id]);
    await execute('DELETE FROM leaderboard WHERE player_id = ?', [player_id]);
    await execute('DELETE FROM player_settings WHERE player_id = ?', [player_id]);
    await execute('DELETE FROM custom_foods WHERE player_id = ?', [player_id]);
    await execute('DELETE FROM meal_logs WHERE player_id = ?', [player_id]);
    await execute('DELETE FROM recipes WHERE submitted_by = ?', [player_id]);
    await execute('DELETE FROM player_recipes WHERE submitted_by = ?', [player_id]);

    const affected = await execute('DELETE FROM players WHERE id = ?', [player_id]);

    if (affected === 0) {
      return json({ error: 'Player not found' }, { status: 404 });
    }

    return json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('delete-player error:', msg);
    return json({ error: msg }, { status: 500 });
  }
};
