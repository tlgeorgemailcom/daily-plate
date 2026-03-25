import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

// PUT /api/notes/[date]
// Body: { user_id, note_content, sentiment_flag? }
// Updates an existing note. 404 if no note exists for that date.
export const PUT: RequestHandler = async ({ params, request }) => {
  const { date } = params;
  const body = await request.json();
  const { user_id, note_content, sentiment_flag, symptoms } = body;

  if (!user_id)      throw error(400, 'Missing user_id');
  if (!date)         throw error(400, 'Missing date');
  if (!note_content) throw error(400, 'Missing note_content');

  const validSentiments = ['positive', 'negative', 'neutral'];
  if (sentiment_flag && !validSentiments.includes(sentiment_flag)) {
    throw error(400, 'Invalid sentiment_flag value');
  }

  const existing = await queryOne<{ id: number }>(
    'SELECT id FROM daily_notes WHERE user_id = ? AND note_date = ?',
    [user_id, date]
  );
  if (!existing) throw error(404, 'Note not found');

  await execute(
    `UPDATE daily_notes
     SET note_content = ?, sentiment_flag = ?, symptoms = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
     WHERE user_id = ? AND note_date = ?`,
    [note_content, sentiment_flag ?? null, symptoms ?? null, user_id, date]
  );

  return json({ ok: true });
};

// DELETE /api/notes/[date]?user_id=xxx
export const DELETE: RequestHandler = async ({ params, url }) => {
  const { date } = params;
  const userId = url.searchParams.get('user_id');

  if (!userId) throw error(400, 'Missing user_id');
  if (!date)   throw error(400, 'Missing date');

  const existing = await queryOne<{ id: number }>(
    'SELECT id FROM daily_notes WHERE user_id = ? AND note_date = ?',
    [userId, date]
  );
  if (!existing) throw error(404, 'Note not found');

  await execute(
    'DELETE FROM daily_notes WHERE user_id = ? AND note_date = ?',
    [userId, date]
  );

  return json({ ok: true });
};
