import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// GET /api/cartoon/[date]
// Returns the strip for a specific date. Fully public.
export const GET: RequestHandler = async ({ params }) => {
  try {
    const db = getGameDb();
    const { date } = params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: 'Invalid date format' }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);

    const result = await db.execute({
      sql: `SELECT id, publish_date, image_url, alt_text, strip_type
            FROM cartoon_strips
            WHERE publish_date = ?`,
      args: [date]
    });

    if (result.rows.length === 0) {
      return json({ strip: null }, { status: 404 });
    }

    const strip = result.rows[0];

    const prevResult = await db.execute({
      sql: `SELECT publish_date FROM cartoon_strips
            WHERE publish_date < ?
            ORDER BY publish_date DESC LIMIT 1`,
      args: [date]
    });

    const nextResult = await db.execute({
      sql: `SELECT publish_date FROM cartoon_strips
            WHERE publish_date > ? AND publish_date <= ?
            ORDER BY publish_date ASC LIMIT 1`,
      args: [date, today]
    });

    return json({
      strip: {
        id: strip.id,
        publish_date: strip.publish_date,
        image_url: strip.image_url,
        alt_text: strip.alt_text,
        strip_type: strip.strip_type
      },
      prev: prevResult.rows[0]?.publish_date ?? null,
      next: nextResult.rows[0]?.publish_date ?? null
    });
  } catch (err) {
    console.error('GET /api/cartoon/[date] error:', err);
    return json({ error: 'Server error' }, { status: 500 });
  }
};

// DELETE /api/cartoon/[date]  (admin only)
export const DELETE: RequestHandler = async ({ params, cookies }) => {
  if (cookies.get('admin_auth') !== 'ok') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getGameDb();
    await db.execute({
      sql: `DELETE FROM cartoon_strips WHERE publish_date = ?`,
      args: [params.date]
    });
    return json({ success: true });
  } catch (err) {
    console.error('DELETE /api/cartoon/[date] error:', err);
    return json({ error: 'Server error' }, { status: 500 });
  }
};
