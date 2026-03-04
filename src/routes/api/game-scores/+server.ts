// Game Scores API - Store and retrieve score history
// Stores each completed game with score and JSON details
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

interface ScoreRow {
  id: number;
  player_id: string;
  game: string;
  score: number;
  played_at: string;
  details: string | null;
}

// GET /api/game-scores?player_id=xxx&game=xxx&limit=xxx
// Returns score history for player, optionally filtered by game
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  const game = url.searchParams.get('game');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  
  console.log('[API game-scores GET] playerId:', playerId, 'game:', game);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const db = getGameDb();
    let result;
    
    if (game) {
      result = await db.execute({
        sql: 'SELECT * FROM game_scores WHERE player_id = ? AND game = ? ORDER BY played_at DESC LIMIT ?',
        args: [playerId, game, limit]
      });
    } else {
      result = await db.execute({
        sql: 'SELECT * FROM game_scores WHERE player_id = ? ORDER BY played_at DESC LIMIT ?',
        args: [playerId, limit]
      });
    }
    
    // Parse JSON details
    const scores = result.rows.map(row => ({
      id: row.id,
      player_id: row.player_id,
      game: row.game,
      score: row.score,
      played_at: row.played_at,
      details: row.details ? JSON.parse(row.details as string) : null
    }));
    
    console.log('[API game-scores GET] Found', scores.length, 'scores');
    return json({ scores });
  } catch (e) {
    console.error('[API game-scores GET] Error:', e);
    throw error(500, 'Failed to fetch scores');
  }
};

// POST /api/game-scores - Save a new score
// Body: { player_id, game, score, details? }
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, game, score, details } = body;
  
  console.log('[API game-scores POST] playerId:', player_id, 'game:', game, 'score:', score);
  
  if (!player_id || !game || score === undefined) {
    throw error(400, 'Missing required fields: player_id, game, score');
  }
  
  try {
    const db = getGameDb();
    
    const result = await db.execute({
      sql: `INSERT INTO game_scores (player_id, game, score, details, played_at)
            VALUES (?, ?, ?, ?, datetime('now'))`,
      args: [player_id, game, score, details ? JSON.stringify(details) : null]
    });
    
    console.log('[API game-scores POST] Saved score, id:', result.lastInsertRowid);
    return json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    console.error('[API game-scores POST] Error:', e);
    throw error(500, 'Failed to save score');
  }
};


