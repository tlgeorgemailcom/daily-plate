import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryAll, queryOne, execute } from '$lib/server/turso';

// meal_data JSON shape — one key per meal slot, array of food entries per slot
export interface TemplateEntry {
  food_id: string;
  food_name: string;
  quantity_grams: number;
  serving_description: string;
  kcal: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  sugar: number;
  fiber: number;
}

export interface TemplateMealData {
  breakfast?: TemplateEntry[];
  snack?: TemplateEntry[];
  lunch?: TemplateEntry[];
  beverage?: TemplateEntry[];
  dinner?: TemplateEntry[];
  [key: string]: TemplateEntry[] | undefined;
}

export interface MealTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  meal_data: string;   // JSON TemplateMealData
  total_kcal: number;
  saved_from_date?: string | null;
  scheduled_for_date?: string | null;
  created_at: string;
  updated_at: string;
}

// GET /api/meal-templates?user_id=xxx
//   → { templates: MealTemplate[] } for that user, most recent first
// GET /api/meal-templates?user_id=xxx&id=uuid
//   → MealTemplate | null
export const GET: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  if (!userId) throw error(400, 'Missing user_id');

  const id           = url.searchParams.get('id');
  const scheduledFor = url.searchParams.get('scheduled_for'); // 'YYYY-MM-DD'

  if (id) {
    const row = await queryOne<MealTemplate>(
      `SELECT id, user_id, name, description, meal_data, total_kcal,
              saved_from_date, scheduled_for_date, created_at, updated_at
       FROM meal_templates WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return json(row ?? null);
  }

  // Return template(s) scheduled for a specific date — used for the auto-prompt
  if (scheduledFor) {
    const row = await queryOne<MealTemplate>(
      `SELECT id, user_id, name, description, meal_data, total_kcal,
              saved_from_date, scheduled_for_date, created_at, updated_at
       FROM meal_templates
       WHERE user_id = ? AND scheduled_for_date = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
      [userId, scheduledFor]
    );
    return json({ template: row ?? null });
  }

  const rows = await queryAll<MealTemplate>(
    `SELECT id, user_id, name, description, meal_data, total_kcal,
            saved_from_date, scheduled_for_date, created_at, updated_at
     FROM meal_templates
     WHERE user_id = ?
     ORDER BY updated_at DESC
     LIMIT 100`,
    [userId]
  );
  return json({ templates: rows });
};

// POST /api/meal-templates
// Body: { user_id, name, description?, meal_data (JSON string), total_kcal,
//         saved_from_date?, scheduled_for_date? }
// Creates a new template. Client generates the id.
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, id, name, description, meal_data, total_kcal,
          saved_from_date, scheduled_for_date } = body as {
    user_id: string;
    id: string;
    name: string;
    description?: string;
    meal_data: string;
    total_kcal: number;
    saved_from_date?: string;
    scheduled_for_date?: string;
  };

  if (!user_id)   throw error(400, 'Missing user_id');
  if (!id)        throw error(400, 'Missing id');
  if (!name?.trim()) throw error(400, 'Missing name');
  if (!meal_data) throw error(400, 'Missing meal_data');

  // Validate name length
  if (name.trim().length > 60) throw error(400, 'Name too long (max 60 chars)');

  await execute(
    `INSERT INTO meal_templates
       (id, user_id, name, description, meal_data, total_kcal,
        saved_from_date, scheduled_for_date, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`,
    [
      id,
      user_id,
      name.trim(),
      description?.trim() ?? null,
      meal_data,
      total_kcal ?? 0,
      saved_from_date ?? null,
      scheduled_for_date ?? null,
    ]
  );

  return json({ ok: true, id });
};

// PATCH /api/meal-templates
// Body: { user_id, id, name?, scheduled_for_date? }
// Renames a template and/or updates its scheduled date.
export const PATCH: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, id, name, scheduled_for_date } = body as {
    user_id: string; id: string; name?: string; scheduled_for_date?: string | null;
  };

  if (!user_id || !id) throw error(400, 'Missing required fields');
  if (name !== undefined) {
    if (!name.trim()) throw error(400, 'Name cannot be empty');
    if (name.trim().length > 60) throw error(400, 'Name too long (max 60 chars)');
  }

  // Build SET clause dynamically based on what was provided
  const sets: string[] = ["updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')"];
  const params: (string | null)[] = [];
  if (name !== undefined)               { sets.unshift('name = ?');               params.push(name.trim()); }
  if (scheduled_for_date !== undefined) { sets.unshift('scheduled_for_date = ?'); params.push(scheduled_for_date ?? null); }
  params.push(id, user_id);

  await execute(
    `UPDATE meal_templates SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
    params
  );

  return json({ ok: true });
};

// DELETE /api/meal-templates?user_id=xxx&id=uuid
export const DELETE: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('user_id');
  const id     = url.searchParams.get('id');

  if (!userId) throw error(400, 'Missing user_id');
  if (!id)     throw error(400, 'Missing id');

  await execute(
    `DELETE FROM meal_templates WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  return json({ ok: true });
};
