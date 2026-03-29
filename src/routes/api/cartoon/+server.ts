import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// GET /api/cartoon
// Returns today's strip, or the most recent published strip if none for today.
// Fully public — no auth required.
export const GET: RequestHandler = async () => {
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
      return json({ strip: null });
    }

    const strip = result.rows[0];
    const publishDate = strip.publish_date as string;

    // Prev strip
    const prevResult = await db.execute({
      sql: `SELECT publish_date FROM cartoon_strips
            WHERE publish_date < ?
            ORDER BY publish_date DESC LIMIT 1`,
      args: [publishDate]
    });

    // Next strip (only up to today)
    const nextResult = await db.execute({
      sql: `SELECT publish_date FROM cartoon_strips
            WHERE publish_date > ? AND publish_date <= ?
            ORDER BY publish_date ASC LIMIT 1`,
      args: [publishDate, today]
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
    console.error('GET /api/cartoon error:', err);
    return json({ strip: null });
  }
};
