import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// GET /api/cartoon/archive?page=1&limit=20
// Returns paginated list of all published strips, newest first. Fully public.
export const GET: RequestHandler = async ({ url }) => {
  try {
    const db = getGameDb();
    const today = new Date().toISOString().slice(0, 10);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    const limit = Math.min(60, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20')));
    const offset = (page - 1) * limit;

    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM cartoon_strips WHERE publish_date <= ?`,
      args: [today]
    });
    const total = Number(countResult.rows[0].total);

    const result = await db.execute({
      sql: `SELECT publish_date, image_url, strip_type
            FROM cartoon_strips
            WHERE publish_date <= ?
            ORDER BY publish_date DESC
            LIMIT ? OFFSET ?`,
      args: [today, limit, offset]
    });

    return json({
      strips: result.rows,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('GET /api/cartoon/archive error:', err);
    return json({ strips: [], total: 0, page: 1, limit: 20, pages: 0 });
  }
};
