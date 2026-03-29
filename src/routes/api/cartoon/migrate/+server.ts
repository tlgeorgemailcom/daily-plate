import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// GET /api/cartoon/migrate  (admin only)
// Creates the cartoon_strips table if it doesn't already exist.
export const GET: RequestHandler = async ({ cookies }) => {
  if (cookies.get('admin_auth') !== 'ok') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getGameDb();
    const results: Record<string, unknown> = {};

    // Check if table exists
    const tableCheck = await db.execute(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='cartoon_strips'`
    );

    if (tableCheck.rows.length === 0) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS cartoon_strips (
          id           INTEGER PRIMARY KEY AUTOINCREMENT,
          publish_date TEXT    NOT NULL UNIQUE,
          image_url    TEXT    NOT NULL,
          alt_text     TEXT    NOT NULL DEFAULT '',
          strip_type   TEXT    NOT NULL DEFAULT 'weekday',
          created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
        )
      `);
      await db.execute(
        `CREATE INDEX IF NOT EXISTS idx_cartoon_publish_date ON cartoon_strips(publish_date DESC)`
      );
      results['cartoon_strips'] = 'created';
    } else {
      results['cartoon_strips'] = 'already exists';
    }

    return json({ success: true, results });
  } catch (err) {
    console.error('GET /api/cartoon/migrate error:', err);
    return json({ error: String(err) }, { status: 500 });
  }
};
