import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

// PUT /api/household-members/[id]
// Updates DRI profile fields for a household member.
export const PUT: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  const body = await request.json();
  const { player_id, groupage, age, height, height_unit, weight, weight_unit, activity_level,
          custom_kcal, custom_water_cups, custom_sugar_max, custom_fiber_g } = body;

  if (!player_id) throw error(400, 'Missing player_id');
  if (!id)        throw error(400, 'Missing member id');

  const row = await queryOne<{ owner_id: string }>(
    'SELECT owner_id FROM household_members WHERE id = ?',
    [id]
  );

  if (!row) throw error(404, 'Member not found');
  if (row.owner_id !== player_id) throw error(403, 'Not your member');

  await execute(
    `UPDATE household_members
     SET groupage = ?, age = ?, height = ?, height_unit = ?,
         weight = ?, weight_unit = ?, activity_level = ?,
         custom_kcal = ?, custom_water_cups = ?, custom_sugar_max = ?, custom_fiber_g = ?
     WHERE id = ?`,
    [groupage, age, height ?? '', height_unit ?? 'cm',
     weight ?? '', weight_unit ?? 'kilos', activity_level ?? 'Sedentary',
     custom_kcal ?? '', custom_water_cups ?? '', custom_sugar_max ?? '', custom_fiber_g ?? '', id]
  );

  return json({ ok: true });
};

// DELETE /api/household-members/[id]?player_id=xxx
// Verifies ownership before deleting.
export const DELETE: RequestHandler = async ({ params, url }) => {
  const { id } = params;
  const playerId = url.searchParams.get('player_id');

  if (!playerId) throw error(400, 'Missing player_id');
  if (!id)       throw error(400, 'Missing member id');

  const row = await queryOne<{ owner_id: string }>(
    'SELECT owner_id FROM household_members WHERE id = ?',
    [id]
  );

  if (!row) throw error(404, 'Member not found');
  if (row.owner_id !== playerId) throw error(403, 'Not your member');

  await execute('DELETE FROM household_members WHERE id = ?', [id]);

  return json({ ok: true });
};
