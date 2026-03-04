// Game Scores Stats API - Aggregate stats per player/game
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

// GET /api/game-scores/stats?player_id=xxx&game=xxx
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  const game = url.searchParams.get('game');
  
  console.log('[API game-scores/stats GET] playerId:', playerId, 'game:', game);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const db = getGameDb();
    
    let sql = `
      SELECT 
        game,
        COUNT(*) as games_played,
        MAX(score) as high_score,
        ROUND(AVG(score), 1) as avg_score,
        MIN(played_at) as first_played,
        MAX(played_at) as last_played
      FROM game_scores
      WHERE player_id = ?
    `;
    const args: (string | number)[] = [playerId];
    
    if (game) {
      sql += ' AND game = ?';
      args.push(game);
    }
    
    sql += ' GROUP BY game ORDER BY games_played DESC';
    
    const result = await db.execute({ sql, args });
    
    console.log('[API game-scores/stats GET] Found stats for', result.rows.length, 'games');
    return json({ stats: result.rows });
  } catch (e) {
    console.error('[API game-scores/stats GET] Error:', e);
    throw error(500, 'Failed to fetch stats');
  }
};
