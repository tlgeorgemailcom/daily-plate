import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, execute } from '$lib/server/turso';

export interface MealLogEntry {
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
  notes?: string | null;
  is_favorite?: number;
}

// GET /api/meal-log?user_id=xxx&date=YYYY-MM-DD
//   → { rows: MealLogEntry[] } for that date
// GET /api/meal-log?user_id=xxx&from=YYYY-MM-DD&to=YYYY-MM-DD
//   → { rows: MealLogEntry[] } for a date range (Reports)
// GET /api/meal-log?user_id=xxx&dates=true
//   → { dates: string[] } distinct logged dates, most recent first
// GET /api/meal-log?user_id=xxx&category=breakfast&history=true&limit=30
//   → { days: Array<{ meal_date, entries, total_kcal }> } for Meal History per Slot
// GET /api/meal-log?user_id=xxx&since=ISO8601
//   → { rows: MealLogEntry[], sync_at: string } rows updated after the watermark (bi-dir sync pull)
export const GET: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  if (!userId) throw error(400, 'Missing user_id');

  const date     = url.searchParams.get('date');
  const from     = url.searchParams.get('from');
  const to       = url.searchParams.get('to');
  const dates    = url.searchParams.get('dates');
  const category = url.searchParams.get('category');
  const history  = url.searchParams.get('history');
  const since    = url.searchParams.get('since');

  // Incremental pull for bi-directional sync.
  // Returns all rows updated after `since` (ISO-8601), plus a server-side
  // sync_at timestamp the client should store as its new watermark.
  if (since !== null) {
    // Basic sanity-check: must look like an ISO datetime, not user content
    if (!/^\d{4}-\d{2}-\d{2}T/.test(since)) throw error(400, 'Invalid since format');
    const syncAt = new Date().toISOString();
    const rows = await queryAll<MealLogEntry & { meal_date: string; deleted_at: string | null }>(
      `SELECT * FROM daily_meal_log
       WHERE user_id = ? AND updated_at > ?
       ORDER BY updated_at ASC
       LIMIT 2000`,
      [userId, since]
    );
    return json({ rows, sync_at: syncAt });
  }

  // Meal History per Slot: grouped days for a specific meal category
  if (history === 'true' && category) {
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '30', 10), 90);
    const rows = await queryAll<MealLogEntry & { meal_date: string }>(
      `SELECT meal_date, meal_category, food_id, food_name,
              quantity_grams, serving_description, kcal, protein, carbohydrate,
              fat, sugar, fiber, water
       FROM daily_meal_log
       WHERE user_id = ? AND meal_category = ?
       ORDER BY meal_date DESC, food_name ASC
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
       ORDER BY meal_date ASC`,
      [userId, from, to]
    );
    return json({ rows });
  }

  if (!date) throw error(400, 'Missing date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw error(400, 'Invalid date format');

  const rows = await queryAll<MealLogEntry & { meal_date: string }>(
    `SELECT * FROM daily_meal_log
     WHERE user_id = ? AND meal_date = ?
     ORDER BY meal_category ASC`,
    [userId, date]
  );
  return json({ rows });
};

// PUT /api/meal-log
// Body: { user_id: string, meal_date: string, entries: MealLogEntry[] }
// Upserts all entries by natural key (user_id, meal_date, meal_category, food_id).
// Any row for this user+date NOT in entries is deleted (full-day reconciliation).
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

  // Upsert each entry by natural key — last write wins.
  for (const e of entries) {
    await execute(
      `INSERT INTO daily_meal_log
         (user_id, meal_date, meal_category, food_id, food_name, brand_name,
          quantity_grams, serving_description, kcal, protein, carbohydrate, fat,
          sugar, fiber, water, sodium, extended_nutrients, notes, is_favorite, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
               strftime('%Y-%m-%dT%H:%M:%SZ','now'))
       ON CONFLICT(user_id, meal_date, meal_category, food_id) DO UPDATE SET
         food_name         = excluded.food_name,
         quantity_grams    = excluded.quantity_grams,
         kcal              = excluded.kcal,
         protein           = excluded.protein,
         carbohydrate      = excluded.carbohydrate,
         fat               = excluded.fat,
         sugar             = excluded.sugar,
         fiber             = excluded.fiber,
         water             = excluded.water,
         sodium            = excluded.sodium,
         extended_nutrients = excluded.extended_nutrients,
         serving_description = excluded.serving_description,
         notes             = excluded.notes,
         is_favorite       = excluded.is_favorite,
         updated_at        = strftime('%Y-%m-%dT%H:%M:%SZ','now')`,
      [
        user_id, meal_date, e.meal_category, e.food_id, e.food_name,
        e.brand_name ?? null, e.quantity_grams, e.serving_description ?? null,
        e.kcal, e.protein, e.carbohydrate, e.fat,
        e.sugar ?? 0, e.fiber ?? 0, e.water ?? 0, e.sodium ?? 0,
        e.extended_nutrients ?? null, e.notes ?? null, e.is_favorite ?? 0,
      ]
    );
  }

  // Delete rows no longer on the plate (identified by food_id + meal_category pair).
  if (entries.length > 0) {
    // Use string concatenation for the NOT IN check — avoids tuple syntax not supported
    // by all libSQL versions.
    const placeholders = entries.map(() => '?').join(',');
    const keys = entries.map(e => `${e.food_id}|${e.meal_category}`);
    await execute(
      `DELETE FROM daily_meal_log
       WHERE user_id = ? AND meal_date = ?
         AND food_id || '|' || meal_category NOT IN (${placeholders})`,
      [user_id, meal_date, ...keys]
    );
  } else {
    await execute(
      `DELETE FROM daily_meal_log WHERE user_id = ? AND meal_date = ?`,
      [user_id, meal_date]
    );
  }

  return json({ ok: true, count: entries.length });
};

// POST /api/meal-log
// Body: { user_id: string, meal_date: string, entry: MealLogEntry }
// Upserts a single row by natural key — used by Jetcool incremental push.
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, meal_date, entry } = body as {
    user_id: string;
    meal_date: string;
    entry: MealLogEntry;
  };

  if (!user_id)   throw error(400, 'Missing user_id');
  if (!meal_date) throw error(400, 'Missing meal_date');
  if (!entry?.food_id) throw error(400, 'Missing entry.food_id');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meal_date)) throw error(400, 'Invalid date format');

  await execute(
    `INSERT INTO daily_meal_log
       (user_id, meal_date, meal_category, food_id, food_name, brand_name,
        quantity_grams, serving_description, kcal, protein, carbohydrate, fat,
        sugar, fiber, water, sodium, extended_nutrients, notes, is_favorite, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
             strftime('%Y-%m-%dT%H:%M:%SZ','now'))
     ON CONFLICT(user_id, meal_date, meal_category, food_id) DO UPDATE SET
       food_name         = excluded.food_name,
       quantity_grams    = excluded.quantity_grams,
       kcal              = excluded.kcal,
       protein           = excluded.protein,
       carbohydrate      = excluded.carbohydrate,
       fat               = excluded.fat,
       sugar             = excluded.sugar,
       fiber             = excluded.fiber,
       water             = excluded.water,
       sodium            = excluded.sodium,
       extended_nutrients = excluded.extended_nutrients,
       serving_description = excluded.serving_description,
       notes             = excluded.notes,
       is_favorite       = excluded.is_favorite,
       updated_at        = strftime('%Y-%m-%dT%H:%M:%SZ','now')`,
    [
      user_id, meal_date, entry.meal_category, entry.food_id, entry.food_name,
      entry.brand_name ?? null, entry.quantity_grams, entry.serving_description ?? null,
      entry.kcal, entry.protein, entry.carbohydrate, entry.fat,
      entry.sugar ?? 0, entry.fiber ?? 0, entry.water ?? 0, entry.sodium ?? 0,
      entry.extended_nutrients ?? null, entry.notes ?? null, entry.is_favorite ?? 0,
    ]
  );

  return json({ ok: true });
};

// DELETE /api/meal-log?user_id=xxx&date=YYYY-MM-DD
// Removes all log entries for a user on a specific date.
// DELETE /api/meal-log?user_id=xxx&date=YYYY-MM-DD&food_id=xxx&meal_category=xxx
// Removes a single entry by natural key.
export const DELETE: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  if (!userId) throw error(400, 'Missing user_id');

  const date       = url.searchParams.get('date');
  const foodId     = url.searchParams.get('food_id');
  const mealCat    = url.searchParams.get('meal_category');

  if (!date) throw error(400, 'Provide date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw error(400, 'Invalid date format');

  if (foodId && mealCat) {
    await execute(
      `DELETE FROM daily_meal_log
       WHERE user_id = ? AND meal_date = ? AND food_id = ? AND meal_category = ?`,
      [userId, date, foodId, mealCat]
    );
  } else {
    await execute(
      `DELETE FROM daily_meal_log WHERE user_id = ? AND meal_date = ?`,
      [userId, date]
    );
  }

  return json({ ok: true });
};
