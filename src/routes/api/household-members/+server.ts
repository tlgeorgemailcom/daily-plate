import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';

// GET /api/household-members?player_id=xxx
// Returns all household members owned by the given player, shaped for the UI.
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  if (!playerId) throw error(400, 'Missing player_id');

  const rows = await queryAll<{
    id: string;
    display_name: string;
    avatar_icon: string;
    avatar_color: string;
    groupage: string;
    age: string;
    height: string;
    height_unit: string;
    weight: string;
    weight_unit: string;
    activity_level: string;
    sort_order: number;
    custom_kcal: string;
    custom_water_cups: string;
    custom_sugar_max: string;
    custom_fiber_g: string;
  }>(
    `SELECT id, display_name, avatar_icon, avatar_color,
            groupage, age, height, height_unit, weight, weight_unit,
            activity_level, sort_order,
            custom_kcal, custom_water_cups, custom_sugar_max, custom_fiber_g
     FROM household_members
     WHERE owner_id = ?
     ORDER BY sort_order, created_at`,
    [playerId]
  );

  // Map DB column names to the UI field names used in the page
  return json(rows.map(r => ({
    id:            r.id,
    name:          r.display_name,
    icon:          r.avatar_icon,
    color:         r.avatar_color,
    groupage:      r.groupage,
    age:           r.age,
    height:        r.height,
    height_unit:   r.height_unit,
    weight:        r.weight,
    weight_unit:   r.weight_unit,
    activity_level: r.activity_level,
    custom_kcal:       r.custom_kcal       ?? '',
    custom_water_cups: r.custom_water_cups  ?? '',
    custom_sugar_max:  r.custom_sugar_max   ?? '',
    custom_fiber_g:    r.custom_fiber_g     ?? '',
  })));
};

// POST /api/household-members
// Body: { player_id, id, name, icon, color, groupage, age, height, height_unit,
//         weight, weight_unit, activity_level }
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, id, name, icon, color, groupage, age,
          height, height_unit, weight, weight_unit, activity_level } = body;

  if (!player_id || !id || !name || !groupage || !age) {
    throw error(400, 'Missing required fields');
  }

  // Enforce max 3 household members per owner
  const rows = await queryAll<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM household_members WHERE owner_id = ?',
    [player_id]
  );
  if ((rows[0]?.cnt ?? 0) >= 3) {
    throw error(403, 'Maximum of 3 household members reached');
  }

  await execute(
    `INSERT INTO household_members
       (id, owner_id, display_name, avatar_icon, avatar_color,
        groupage, age, height, height_unit, weight, weight_unit,
        activity_level, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))`,
    [id, player_id, name, icon ?? '👤', color ?? '#60a5fa',
     groupage, age, height ?? '', height_unit ?? 'inches',
     weight ?? '', weight_unit ?? 'pounds', activity_level ?? 'Sedentary']
  );

  return json({ ok: true, id });
};

// PATCH /api/household-members
// Body: { player_id, id, groupage, age, height, height_unit, weight, weight_unit, activity_level }
// Updates demographics for an existing household member. Silently no-ops if
// the member doesn't belong to player_id (ownership guard).
export const PATCH: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, id, groupage, age, height, height_unit,
          weight, weight_unit, activity_level } = body;

  if (!player_id || !id) throw error(400, 'Missing player_id or id');

  await execute(
    `UPDATE household_members
     SET groupage        = COALESCE(?, groupage),
         age             = COALESCE(?, age),
         height          = COALESCE(?, height),
         height_unit     = COALESCE(?, height_unit),
         weight          = COALESCE(?, weight),
         weight_unit     = COALESCE(?, weight_unit),
         activity_level  = COALESCE(?, activity_level),
         updated_at      = datetime('now')
     WHERE id = ? AND owner_id = ?`,
    [
      groupage ?? null, age ?? null,
      height ?? null, height_unit ?? null,
      weight ?? null, weight_unit ?? null,
      activity_level ?? null,
      id, player_id,
    ]
  );

  return json({ ok: true });
};
