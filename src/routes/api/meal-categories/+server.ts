import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';

const ALLIN_TIERS = new Set(['allin', 'premium', 'moderator']);
const MAX_CUSTOM_CATEGORIES = 10;

async function getPlayerTier(userId: string): Promise<string | null> {
  const rows = await queryAll<{ tier: string }>(
    'SELECT tier FROM players WHERE id = ?',
    [userId]
  );
  return rows[0]?.tier ?? null;
}

// GET /api/meal-categories?user_id=xxx
// Returns all active custom categories for the user, ordered by sort_order.
export const GET: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  if (!userId) throw error(400, 'Missing user_id');

  const rows = await queryAll<{
    id: number;
    name: string;
    label: string;
    emoji: string;
    color: string;
    sort_order: number;
    created_at: string;
  }>(
    `SELECT id, name, label, emoji, color, sort_order, created_at
     FROM meal_categories
     WHERE user_id = ? AND is_active = 1
     ORDER BY sort_order, created_at`,
    [userId]
  );

  return json(rows);
};

// POST /api/meal-categories
// Body: { user_id, name, label, emoji?, color? }
// Creates a new custom meal category (ALL·IN only).
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, name, label, emoji = '🍽️', color = '#6B7280' } = body;

  if (!user_id || !name || !label) throw error(400, 'Missing required fields');

  // Validate name is a safe slug (letters, numbers, hyphens, underscores only)
  if (!/^[a-z0-9_-]{1,40}$/i.test(name)) {
    throw error(400, 'name must be 1–40 alphanumeric/hyphen/underscore characters');
  }

  // Enforce label length
  if (label.length > 30) throw error(400, 'label must be ≤30 characters');

  // Check ALL·IN tier
  const tier = await getPlayerTier(user_id);
  if (!tier || !ALLIN_TIERS.has(tier)) throw error(403, 'ALL·IN required');

  // Enforce max categories
  const countRows = await queryAll<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM meal_categories WHERE user_id = ? AND is_active = 1',
    [user_id]
  );
  if ((countRows[0]?.cnt ?? 0) >= MAX_CUSTOM_CATEGORIES) {
    throw error(403, `Maximum of ${MAX_CUSTOM_CATEGORIES} custom categories reached`);
  }

  const sort_order = (countRows[0]?.cnt ?? 0);

  // Upsert: if a soft-deleted row with the same name exists, reactivate it
  await execute(
    `INSERT INTO meal_categories (user_id, name, label, emoji, color, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(user_id, name) DO UPDATE SET
       label = excluded.label,
       emoji = excluded.emoji,
       color = excluded.color,
       sort_order = excluded.sort_order,
       is_active = 1`,
    [user_id, name.toLowerCase(), label.trim(), emoji, color, sort_order]
  );

  const rows = await queryAll<{ id: number; name: string; label: string; emoji: string; color: string; sort_order: number }>(
    'SELECT id, name, label, emoji, color, sort_order FROM meal_categories WHERE user_id = ? AND name = ?',
    [user_id, name.toLowerCase()]
  );

  return json(rows[0], { status: 201 });
};

// PUT /api/meal-categories
// Body: { user_id, name, new_label?, new_emoji?, new_color? }
// Updates display fields of a custom category (does NOT rename the id key).
export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, name, new_label, new_emoji, new_color } = body;

  if (!user_id || !name) throw error(400, 'Missing required fields');

  const tier = await getPlayerTier(user_id);
  if (!tier || !ALLIN_TIERS.has(tier)) throw error(403, 'ALL·IN required');

  if (new_label !== undefined && new_label.length > 30) throw error(400, 'label must be ≤30 characters');

  const sets: string[] = [];
  const params: (string | number)[] = [];

  if (new_label !== undefined) { sets.push('label = ?'); params.push(new_label.trim()); }
  if (new_emoji !== undefined) { sets.push('emoji = ?'); params.push(new_emoji); }
  if (new_color !== undefined) { sets.push('color = ?'); params.push(new_color); }

  if (sets.length === 0) throw error(400, 'Nothing to update');

  params.push(user_id, name.toLowerCase());
  await execute(
    `UPDATE meal_categories SET ${sets.join(', ')} WHERE user_id = ? AND name = ? AND is_active = 1`,
    params
  );

  return json({ success: true });
};

// DELETE /api/meal-categories?user_id=xxx&name=xxx
// Soft-deletes a custom category (is_active = 0).
export const DELETE: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  const name   = url.searchParams.get('name');

  if (!userId || !name) throw error(400, 'Missing user_id or name');

  const tier = await getPlayerTier(userId);
  if (!tier || !ALLIN_TIERS.has(tier)) throw error(403, 'ALL·IN required');

  await execute(
    'UPDATE meal_categories SET is_active = 0 WHERE user_id = ? AND name = ?',
    [userId, name.toLowerCase()]
  );

  return json({ success: true });
};
