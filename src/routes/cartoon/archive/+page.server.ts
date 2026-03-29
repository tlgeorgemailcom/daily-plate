import { getGameDb } from '$lib/server/turso';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  try {
    const db = getGameDb();
    const today = new Date().toISOString().slice(0, 10);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    const limit = 24;
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

    return {
      strips: result.rows.map(r => ({
        publish_date: r.publish_date as string,
        image_url:    r.image_url   as string,
        strip_type:   r.strip_type  as string
      })),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch {
    return { strips: [], total: 0, page: 1, pages: 0 };
  }
};
