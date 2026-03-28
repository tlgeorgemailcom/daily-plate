import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';
import { hashPassword } from '$lib/server/password';

// Generate a simple unique ID
function generateId(): string {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

interface PlayerRow {
  id: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password, displayName } = await request.json();
    
    if (!email || !password) {
      return json({ error: 'Email and password required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Check if email already exists
    const existing = await queryOne<PlayerRow>(
      'SELECT id FROM players WHERE email = ?',
      [normalizedEmail]
    );
    
    if (existing) {
      return json({ error: 'Email already registered' }, { status: 409 });
    }
    
    // Create new player
    const playerId = generateId();
    const passwordHash = await hashPassword(password);
    const name = displayName?.trim() || normalizedEmail.split('@')[0];
    
    await execute(
      `INSERT INTO players (id, email, display_name, password_hash, subscription_tier, created_at, last_login_at)
       VALUES (?, ?, ?, ?, 'free', datetime('now'), datetime('now'))`,
      [playerId, normalizedEmail, name, passwordHash]
    );
    
    console.log(`✅ New player registered: ${normalizedEmail} (${playerId})`);
    
    return json({
      id: playerId,
      email: normalizedEmail,
      displayName: name,
      tier: 'free',
      createdAt: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    return json({ error: 'Registration failed' }, { status: 500 });
  }
};
