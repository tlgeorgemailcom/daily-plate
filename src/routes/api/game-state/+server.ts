// Game State API - Current game progress (meals, added foods, etc.)
// Stores the entire game state as JSON for simplicity
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

interface GameStateRow {
  player_id: string;
  state: string;  // JSON string
  updated_at: string;
}

// GET /api/game-state?player_id=xxx
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  console.log('[API game-state GET] playerId:', playerId);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    const row = await queryOne<GameStateRow>(
      'SELECT * FROM game_state WHERE player_id = ?',
      [playerId]
    );
    
    if (!row) {
      console.log('[API game-state GET] No saved state for player');
      return json({ player_id: playerId, state: null });
    }
    
    console.log('[API game-state GET] Found saved state');
    return json({
      player_id: row.player_id,
      state: JSON.parse(row.state),
      updated_at: row.updated_at
    });
  } catch (e) {
    console.error('Failed to fetch game state:', e);
    throw error(500, 'Database error');
  }
};

// PUT /api/game-state - Create or update game state
export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { player_id, state } = body;
  
  console.log('[API game-state PUT] Received for player:', player_id);
  
  if (!player_id) {
    throw error(400, 'Missing player_id');
  }
  
  if (!state) {
    throw error(400, 'Missing state');
  }
  
  try {
    // Check if state exists
    const existing = await queryOne<GameStateRow>(
      'SELECT player_id FROM game_state WHERE player_id = ?',
      [player_id]
    );
    
    const stateJson = JSON.stringify(state);
    
    if (existing) {
      // Update existing
      await execute(
        `UPDATE game_state SET state = ?, updated_at = datetime('now') WHERE player_id = ?`,
        [stateJson, player_id]
      );
      console.log('[API game-state PUT] Updated existing state');
    } else {
      // Insert new
      await execute(
        `INSERT INTO game_state (player_id, state) VALUES (?, ?)`,
        [player_id, stateJson]
      );
      console.log('[API game-state PUT] Inserted new state');
    }
    
    return json({ success: true, player_id });
  } catch (e) {
    console.error('Failed to save game state:', e);
    throw error(500, 'Database error');
  }
};

// DELETE /api/game-state?player_id=xxx - Clear game state (for New Game)
export const DELETE: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('player_id');
  console.log('[API game-state DELETE] playerId:', playerId);
  
  if (!playerId) {
    throw error(400, 'Missing player_id parameter');
  }
  
  try {
    await execute(
      'DELETE FROM game_state WHERE player_id = ?',
      [playerId]
    );
    
    console.log('[API game-state DELETE] Cleared state');
    return json({ success: true });
  } catch (e) {
    console.error('Failed to delete game state:', e);
    throw error(500, 'Database error');
  }
};
