// Game Scores Today API - Fetch today's scores only
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// GET /api/game-scores/today?player_id=xxx
// Returns all scores from today for the given player
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  
  console.log('[API game-scores/today GET] playerId:', playerId);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const db = getGameDb();
    
    // Get scores from today (UTC)
    const result = await db.execute({
      sql: `SELECT * FROM game_scores 
            WHERE player_id = ? 
            AND date(played_at) = date('now')
            ORDER BY played_at DESC`,
      args: [playerId]
    });
    
    // Parse JSON details
    const scores = result.rows.map(row => ({
      id: row.id,
      player_id: row.player_id,
      game: row.game,
      score: row.score,
      played_at: row.played_at,
      details: row.details ? JSON.parse(row.details as string) : null
    }));
    
    console.log('[API game-scores/today GET] Found', scores.length, 'scores for today');
    return json({ scores });
  } catch (e) {
    console.error('[API game-scores/today GET] Error:', e);
    throw error(500, 'Failed to fetch today\'s scores');
  }
};
