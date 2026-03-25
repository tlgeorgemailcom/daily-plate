import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, queryAll, execute } from '$lib/server/turso';

// GET /api/notes?user_id=xxx&date=YYYY-MM-DD
//   → returns single note (or null) for that date
// GET /api/notes?user_id=xxx&history=true&limit=30
//   → returns recent notes ordered by date DESC
export const GET: RequestHandler = async ({ url }) => {
  const userId  = url.searchParams.get('user_id');
  const date    = url.searchParams.get('date');
  const history = url.searchParams.get('history');
  if (!userId) throw error(400, 'Missing user_id');

  if (history === 'true') {
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '30', 10), 100);
    const rows = await queryAll<{
      id: number;
      note_date: string;
      note_content: string;
      sentiment_flag: string | null;
      symptoms: string | null;
      updated_at: string;
    }>(
      `SELECT id, note_date, note_content, sentiment_flag, symptoms, updated_at
       FROM daily_notes
       WHERE user_id = ?
       ORDER BY note_date DESC
       LIMIT ?`,
      [userId, limit]
    );
    return json(rows);
  }

  if (!date) throw error(400, 'Missing date');

  const row = await queryOne<{
    id: number;
    note_date: string;
    note_content: string;
    sentiment_flag: string | null;
    symptoms: string | null;
    life_stage_group: string | null;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, note_date, note_content, sentiment_flag, symptoms,
            life_stage_group, created_at, updated_at
     FROM daily_notes
     WHERE user_id = ? AND note_date = ?`,
    [userId, date]
  );

  return json(row ?? null);
};

// POST /api/notes
// Body: { user_id, note_date, note_content, sentiment_flag?, life_stage_group? }
// Upserts (INSERT OR REPLACE) so the client never needs to distinguish create vs update.
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { user_id, note_date, note_content, sentiment_flag, life_stage_group, symptoms } = body;

  if (!user_id)                        throw error(400, 'Missing user_id');
  if (!note_date)                      throw error(400, 'Missing note_date');
  if (note_content === undefined || note_content === null) throw error(400, 'Missing note_content');

  // Validate sentiment value if provided
  const validSentiments = ['positive', 'negative', 'neutral'];
  if (sentiment_flag && !validSentiments.includes(sentiment_flag)) {
    throw error(400, 'Invalid sentiment_flag value');
  }

  await execute(
    `INSERT INTO daily_notes (user_id, note_date, note_content, sentiment_flag, symptoms, life_stage_group, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
     ON CONFLICT(user_id, note_date) DO UPDATE SET
       note_content     = excluded.note_content,
       sentiment_flag   = excluded.sentiment_flag,
       symptoms         = excluded.symptoms,
       life_stage_group = excluded.life_stage_group,
       updated_at       = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')`,
    [user_id, note_date, note_content, sentiment_flag ?? null, symptoms ?? null, life_stage_group ?? null]
  );

  return json({ ok: true });
};
