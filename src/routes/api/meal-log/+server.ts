import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';

export interface MealLogEntry {
  id: string;               // UUID (matches AddedFood.id from the client)
  meal_category: string;    // 'breakfast' | 'snack' | 'lunch' | 'beverage' | 'dinner'
  food_id: string;          // USDA NDB number or USER_xxx
  food_name: string;
  brand_name?: string | null;
  quantity_grams: number;
  serving_description?: string | null;
  kcal: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  water?: number;
  sodium?: number;
  extended_nutrients?: string | null; // JSON blob (Jetcool micronutrients)
  serving_data?: string | null;       // JSON M1-M12 serving options
  notes?: string | null;
  is_favorite?: number;
  source?: string;          // 'web' | 'jetcool'
  logged_at: string;        // ISO-8601
}

// GET /api/meal-log?user_id=xxx&date=YYYY-MM-DD
//   → { rows: MealLogEntry[] } for that date
// GET /api/meal-log?user_id=xxx&from=YYYY-MM-DD&to=YYYY-MM-DD
//   → { rows: MealLogEntry[] } for a date range (Reports)
// GET /api/meal-log?user_id=xxx&dates=true
//   → { dates: string[] } distinct logged dates, most recent first
// GET /api/meal-log?user_id=xxx&category=breakfast&history=true&limit=30
//   → { days: Array<{ meal_date, entries, total_kcal }> } for Meal History per Slot
export const GET: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  if (!userId) throw error(400, 'Missing user_id');

  const date     = url.searchParams.get('date');
  const from     = url.searchParams.get('from');
  const to       = url.searchParams.get('to');
  const dates    = url.searchParams.get('dates');
  const category = url.searchParams.get('category');
  const history  = url.searchParams.get('history');

  // Meal History per Slot: grouped days for a specific meal category
  if (history === 'true' && category) {
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '30', 10), 90);
    const rows = await queryAll<MealLogEntry & { meal_date: string }>(
      `SELECT id, meal_date, meal_category, food_id, food_name,
              quantity_grams, serving_description, kcal, protein, carbohydrate,
              fat, sugar, fiber, water, logged_at
       FROM daily_meal_log
       WHERE user_id = ? AND meal_category = ?
       ORDER BY meal_date DESC, logged_at ASC
       LIMIT ?`,
      [userId, category, limit * 20]   // fetch enough rows to cover limit days
    );

    // Group by meal_date
    const dayMap = new Map<string, { meal_date: string; entries: (MealLogEntry & { meal_date: string })[]; total_kcal: number }>();
    for (const row of rows) {
      if (!dayMap.has(row.meal_date)) {
        dayMap.set(row.meal_date, { meal_date: row.meal_date, entries: [], total_kcal: 0 });
      }
      const day = dayMap.get(row.meal_date)!;
      day.entries.push(row);
      day.total_kcal += row.kcal;
    }

    const days = Array.from(dayMap.values()).slice(0, limit);
    return json({ days });
  }

  if (dates === 'true') {
    const rows = await queryAll<{ meal_date: string }>(
      `SELECT DISTINCT meal_date FROM daily_meal_log
       WHERE user_id = ?
       ORDER BY meal_date DESC
       LIMIT 365`,
      [userId]
    );
    return json({ dates: rows.map(r => r.meal_date) });
  }

  if (from && to) {
    // Validate date format to prevent injection
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
      throw error(400, 'Invalid date format');
    }
    const rows = await queryAll<MealLogEntry & { meal_date: string }>(
      `SELECT * FROM daily_meal_log
       WHERE user_id = ? AND meal_date >= ? AND meal_date <= ?
       ORDER BY meal_date ASC, logged_at ASC`,
      [userId, from, to]
    );
    return json({ rows });
  }

  if (!date) throw error(400, 'Missing date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw error(400, 'Invalid date format');

  const rows = await queryAll<MealLogEntry & { meal_date: string }>(
    `SELECT * FROM daily_meal_log
     WHERE user_id = ? AND meal_date = ?
     ORDER BY logged_at ASC`,
    [userId, date]
  );
  return json({ rows });
};

// PUT /api/meal-log
// Body: { user_id: string, meal_date: string, entries: MealLogEntry[] }
// Atomically replaces all rows for (user_id, meal_date) with the provided entries.
// Used by the web auto-save on every state change.
export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, meal_date, entries } = body as {
    user_id: string;
    meal_date: string;
    entries: MealLogEntry[];
  };

  if (!user_id)    throw error(400, 'Missing user_id');
  if (!meal_date)  throw error(400, 'Missing meal_date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meal_date)) throw error(400, 'Invalid date format');
  if (!Array.isArray(entries)) throw error(400, 'entries must be an array');
  if (entries.length > 200) throw error(400, 'Too many entries');

  // Delete existing rows for this user+date, then insert fresh
  await execute(
    `DELETE FROM daily_meal_log WHERE user_id = ? AND meal_date = ?`,
    [user_id, meal_date]
  );

  for (const e of entries) {
    await execute(
      `INSERT INTO daily_meal_log
         (id, user_id, meal_date, meal_category, food_id, food_name, brand_name,
          quantity_grams, serving_description, kcal, protein, carbohydrate, fat,
          sugar, fiber, water, sodium, extended_nutrients, serving_data, notes,
          is_favorite, source, logged_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
               strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`,
      [
        e.id,
        user_id,
        meal_date,
        e.meal_category,
        e.food_id,
        e.food_name,
        e.brand_name ?? null,
        e.quantity_grams,
        e.serving_description ?? null,
        e.kcal,
        e.protein,
        e.carbohydrate,
        e.fat,
        e.sugar ?? 0,
        e.fiber ?? 0,
        e.water ?? 0,
        e.sodium ?? 0,
        e.extended_nutrients ?? null,
        e.serving_data ?? null,
        e.notes ?? null,
        e.is_favorite ?? 0,
        e.source ?? 'web',
        e.logged_at,
      ]
    );
  }

  return json({ ok: true, count: entries.length });
};

// POST /api/meal-log
// Body: { user_id: string, meal_date: string, entry: MealLogEntry }
// Upserts a single row by id — used by Jetcool sync (last-write-wins on updated_at).
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, meal_date, entry } = body as {
    user_id: string;
    meal_date: string;
    entry: MealLogEntry;
  };

  if (!user_id)   throw error(400, 'Missing user_id');
  if (!meal_date) throw error(400, 'Missing meal_date');
  if (!entry?.id) throw error(400, 'Missing entry.id');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meal_date)) throw error(400, 'Invalid date format');

  await execute(
    `INSERT INTO daily_meal_log
       (id, user_id, meal_date, meal_category, food_id, food_name, brand_name,
        quantity_grams, serving_description, kcal, protein, carbohydrate, fat,
        sugar, fiber, water, sodium, extended_nutrients, serving_data, notes,
        is_favorite, source, logged_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
             strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
     ON CONFLICT(id) DO UPDATE SET
       kcal              = excluded.kcal,
       protein           = excluded.protein,
       carbohydrate      = excluded.carbohydrate,
       fat               = excluded.fat,
       sugar             = excluded.sugar,
       fiber             = excluded.fiber,
       water             = excluded.water,
       sodium            = excluded.sodium,
       quantity_grams    = excluded.quantity_grams,
       extended_nutrients = excluded.extended_nutrients,
       notes             = excluded.notes,
       is_favorite       = excluded.is_favorite,
       updated_at        = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')`,
    [
      entry.id,
      user_id,
      meal_date,
      entry.meal_category,
      entry.food_id,
      entry.food_name,
      entry.brand_name ?? null,
      entry.quantity_grams,
      entry.serving_description ?? null,
      entry.kcal,
      entry.protein,
      entry.carbohydrate,
      entry.fat,
      entry.sugar ?? 0,
      entry.fiber ?? 0,
      entry.water ?? 0,
      entry.sodium ?? 0,
      entry.extended_nutrients ?? null,
      entry.serving_data ?? null,
      entry.notes ?? null,
      entry.is_favorite ?? 0,
      entry.source ?? 'web',
      entry.logged_at,
    ]
  );

  return json({ ok: true });
};

// DELETE /api/meal-log?user_id=xxx&date=YYYY-MM-DD
// Removes all log entries for a user on a specific date.
// DELETE /api/meal-log?user_id=xxx&id=uuid
// Removes a single entry by id.
export const DELETE: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  if (!userId) throw error(400, 'Missing user_id');

  const id   = url.searchParams.get('id');
  const date = url.searchParams.get('date');

  if (id) {
    await execute(
      `DELETE FROM daily_meal_log WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return json({ ok: true });
  }

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw error(400, 'Invalid date format');
    await execute(
      `DELETE FROM daily_meal_log WHERE user_id = ? AND meal_date = ?`,
      [userId, date]
    );
    return json({ ok: true });
  }

  throw error(400, 'Provide id or date');
};
