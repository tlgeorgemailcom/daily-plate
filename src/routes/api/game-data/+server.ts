// Game Data API - Unified cloud storage for all game localStorage keys
// For premium users: stores all game progress, scores, streaks, etc.
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute, getGameDb } from '$lib/server/turso';

interface GameDataRow {
  player_id: string;
  data_key: string;
  data_value: string;
  updated_at: string;
}

// GET /api/game-data?player_id=xxx
// Returns all game data for the player
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  console.log('[API game-data GET] playerId:', playerId);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const db = getGameDb();
    const result = await db.execute({
      sql: 'SELECT data_key, data_value FROM game_data WHERE player_id = ?',
      args: [playerId]
    });
    
    // Convert to key-value object
    const data: Record<string, string> = {};
    for (const row of result.rows) {
      const key = row.data_key as string;
      const value = row.data_value as string;
      data[key] = value;
    }
    
    console.log('[API game-data GET] Found', Object.keys(data).length, 'keys');
    return json({ player_id: playerId, data });
  } catch (e) {
    console.error('[API game-data GET] Error:', e);
    throw error(500, 'Failed to fetch game data');
  }
};

// PUT /api/game-data - Upsert multiple key-value pairs
// Body: { player_id: string, data: Record<string, string> }
export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, data } = body;
  
  console.log('[API game-data PUT] playerId:', player_id, 'keys:', Object.keys(data || {}));
  
  if (!player_id) {
    throw error(400, 'Missing player_id');
  }
  
  if (!data || typeof data !== 'object') {
    throw error(400, 'Missing or invalid data object');
  }
  
  try {
    const db = getGameDb();
    
    // Batch upsert all key-value pairs
    const entries = Object.entries(data);
    
    for (const [key, value] of entries) {
      await db.execute({
        sql: `INSERT INTO game_data (player_id, data_key, data_value, updated_at)
              VALUES (?, ?, ?, datetime('now'))
              ON CONFLICT(player_id, data_key) DO UPDATE SET
                data_value = excluded.data_value,
                updated_at = datetime('now')`,
        args: [player_id, key, value as string]
      });
    }
    
    console.log('[API game-data PUT] Saved', entries.length, 'keys');
    return json({ success: true, saved: entries.length });
  } catch (e) {
    console.error('[API game-data PUT] Error:', e);
    throw error(500, 'Failed to save game data');
  }
};

// DELETE /api/game-data?player_id=xxx&key=xxx
// Optionally delete specific key, or all data for player
export const DELETE: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  const key = url.searchParams.get('key');
  
  console.log('[API game-data DELETE] playerId:', playerId, 'key:', key);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const db = getGameDb();
    
    if (key) {
      // Delete specific key
      await db.execute({
        sql: 'DELETE FROM game_data WHERE player_id = ? AND data_key = ?',
        args: [playerId, key]
      });
      console.log('[API game-data DELETE] Deleted key:', key);
    } else {
      // Delete all data for player
      await db.execute({
        sql: 'DELETE FROM game_data WHERE player_id = ?',
        args: [playerId]
      });
      console.log('[API game-data DELETE] Deleted all data for player');
    }
    
    return json({ success: true });
  } catch (e) {
    console.error('[API game-data DELETE] Error:', e);
    throw error(500, 'Failed to delete game data');
  }
};
