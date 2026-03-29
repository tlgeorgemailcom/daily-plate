import { getGameDb } from '$lib/server/turso';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const db = getGameDb();

    const result = await db.execute(
      `SELECT id, publish_date, image_url, strip_type, created_at
       FROM cartoon_strips
       ORDER BY publish_date DESC
       LIMIT 60`
    );

    return {
      strips: result.rows.map(r => ({
        id:           r.id           as number,
        publish_date: r.publish_date as string,
        image_url:    r.image_url    as string,
        strip_type:   r.strip_type   as string,
        created_at:   r.created_at   as string
      }))
    };
  } catch {
    return { strips: [] };
  }
};
