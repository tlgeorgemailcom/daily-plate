import { getGameDb } from '$lib/server/turso';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const db = getGameDb();
    const today = new Date().toISOString().slice(0, 10);

    const result = await db.execute({
      sql: `SELECT id, publish_date, image_url, alt_text, strip_type
            FROM cartoon_strips
            WHERE publish_date <= ?
            ORDER BY publish_date DESC
            LIMIT 1`,
      args: [today]
    });

    if (result.rows.length === 0) {
      return { strip: null, prev: null, next: null };
    }

    const row = result.rows[0];
    const publishDate = row.publish_date as string;

    const prevResult = await db.execute({
      sql: `SELECT publish_date FROM cartoon_strips WHERE publish_date < ? ORDER BY publish_date DESC LIMIT 1`,
      args: [publishDate]
    });
    const nextResult = await db.execute({
      sql: `SELECT publish_date FROM cartoon_strips WHERE publish_date > ? AND publish_date <= ? ORDER BY publish_date ASC LIMIT 1`,
      args: [publishDate, today]
    });

    return {
      strip: {
        publish_date: row.publish_date as string,
        image_url:    row.image_url   as string,
        alt_text:     row.alt_text    as string,
        strip_type:   row.strip_type  as string
      },
      prev: (prevResult.rows[0]?.publish_date ?? null) as string | null,
      next: (nextResult.rows[0]?.publish_date ?? null) as string | null
    };
  } catch {
    return { strip: null, prev: null, next: null };
  }
};
