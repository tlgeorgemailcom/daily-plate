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

  const { player_id, tier, expires_at, admin_notes } = body as Record<string, unknown>;

  if (!player_id || typeof player_id !== 'string') {
    return json({ error: 'player_id required' }, { status: 400 });
  }
  if (!tier || typeof tier !== 'string' || !VALID_TIERS.has(tier)) {
    return json({ error: `tier must be one of: ${[...VALID_TIERS].join(', ')}` }, { status: 400 });
  }

  // expires_at: ISO date string or null to clear
  const expiresAtVal = (expires_at === null || expires_at === '') ? null
    : typeof expires_at === 'string' ? expires_at
    : undefined; // undefined = don't touch it

  // admin_notes: string or null to clear
  const notesVal = admin_notes === null ? null
    : typeof admin_notes === 'string' ? admin_notes
    : undefined;

  // Build dynamic SET clause
  const setClauses: string[] = ['subscription_tier = ?'];
  const args: unknown[] = [tier];

  if (expiresAtVal !== undefined) {
    setClauses.push('subscription_expires_at = ?');
    args.push(expiresAtVal);
  }
  if (notesVal !== undefined) {
    setClauses.push('admin_notes = ?');
    args.push(notesVal);
  }
  args.push(player_id);

  const affected = await execute(
    `UPDATE players SET ${setClauses.join(', ')} WHERE id = ?`,
    args as import('@libsql/client').InValue[]
  );

  if (affected === 0) {
    return json({ error: 'Player not found' }, { status: 404 });
  }

  return json({ ok: true });
};
