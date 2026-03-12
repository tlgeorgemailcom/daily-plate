import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// One-time migration: adds last_login_at column if missing
// Call once then this endpoint can be deleted
export const GET: RequestHandler = async () => {
  try {
    const db = getGameDb();

    // Check current schema
    const schema = await db.execute("PRAGMA table_info(players)");
    const columns = schema.rows.map((r: Record<string, unknown>) => r['name']);

    const results: Record<string, unknown> = { columns };

    if (!columns.includes('last_login_at')) {
      await db.execute("ALTER TABLE players ADD COLUMN last_login_at TEXT");
      results['added_last_login_at'] = true;
    } else {
      results['last_login_at_already_exists'] = true;
    }

    return json({ success: true, ...results });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
};
