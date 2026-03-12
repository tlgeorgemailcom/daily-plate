// Players API - Registration, Login, Profile
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb, queryOne, queryAll, execute } from '$lib/server/turso';
import type { InValue } from '@libsql/client';

interface Player {
  id: string;
  email: string | null;
  display_name: string | null;
  subscription_tier: string;
  subscription_expires_at: string | null;
  created_at: string;
  last_login_at: string | null;
}

// GET /api/players - Get current player (by id query param)
export const GET: RequestHandler = async ({ url }) => {
  const playerId = url.searchParams.get('id');
  const email = url.searchParams.get('email');
  
  if (!playerId && !email) {
    throw error(400, 'Missing id or email parameter');
  }
  
  try {
    let player: Player | null;
    
    if (playerId) {
      player = await queryOne<Player>(
        'SELECT * FROM players WHERE id = ?',
        [playerId]
      );
    } else {
      player = await queryOne<Player>(
        'SELECT * FROM players WHERE email = ?',
        [email]
      );
    }
    
    if (!player) {
      throw error(404, 'Player not found');
    }
    
    return json(player);
  } catch (e) {
    if ((e as { status?: number }).status === 404) throw e;
    console.error('Failed to fetch player:', e);
    throw error(500, 'Database error');
  }
};

// POST /api/players - Register new player or login existing
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { id, email, display_name, action } = body;
  
  if (!id) {
    throw error(400, 'Missing player id');
  }
  
  try {
    // Check if player exists
    const existing = await queryOne<Player>(
      'SELECT * FROM players WHERE id = ?',
      [id]
    );
    
    if (action === 'login') {
      // Login - update last_login_at
      if (!existing) {
        throw error(404, 'Player not found');
      }
      
      await execute(
        "UPDATE players SET last_login_at = datetime('now') WHERE id = ?",
        [id]
      );
      
      return json({ ...existing, last_login_at: new Date().toISOString() });
    }
    
    // Register - create if not exists
    if (existing) {
      // Return existing player
      return json(existing);
    }
    
    // Create new player
    await execute(
      `INSERT INTO players (id, email, display_name, subscription_tier, created_at, last_login_at)
       VALUES (?, ?, ?, 'free', datetime('now'), datetime('now'))`,
      [id, email || null, display_name || null]
    );
    
    const newPlayer = await queryOne<Player>(
      'SELECT * FROM players WHERE id = ?',
      [id]
    );
    
    return json(newPlayer, { status: 201 });
  } catch (e) {
    if ((e as { status?: number }).status) throw e;
    console.error('Failed to create/login player:', e);
    throw error(500, 'Database error');
  }
};

// PATCH /api/players - Update player profile
export const PATCH: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { id, display_name, email } = body;
  
  if (!id) {
    throw error(400, 'Missing player id');
  }
  
  try {
    const updates: string[] = [];
    const values: InValue[] = [];
    
    if (display_name !== undefined) {
      updates.push('display_name = ?');
      values.push(display_name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    
    if (updates.length === 0) {
      throw error(400, 'No fields to update');
    }
    
    values.push(id);
    
    const affected = await execute(
      `UPDATE players SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    if (affected === 0) {
      throw error(404, 'Player not found');
    }
    
    const updated = await queryOne<Player>(
      'SELECT * FROM players WHERE id = ?',
      [id]
    );
    
    return json(updated);
  } catch (e) {
    if ((e as { status?: number }).status) throw e;
    console.error('Failed to update player:', e);
    throw error(500, 'Database error');
  }
};
