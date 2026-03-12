import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

// Simple password hashing (in production, use bcrypt or argon2)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Add salt prefix for some security
  return 'h1_' + Math.abs(hash).toString(36);
}

interface PlayerRow {
  id: string;
  email: string;
  display_name: string | null;
  password_hash: string | null;
  subscription_tier: string;
  created_at: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return json({ error: 'Email and password required' }, { status: 400 });
    }
    
    // Look up user in database
    const user = await queryOne<PlayerRow>(
      'SELECT id, email, display_name, password_hash, subscription_tier, created_at FROM players WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    
    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Verify password
    const inputHash = simpleHash(password);
    if (inputHash !== user.password_hash) {
      console.log(`Login hash mismatch for ${email}: input=${inputHash} stored=${user.password_hash}`);
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Update last login (non-fatal — don't block login if this fails)
    try {
      await execute(
        'UPDATE players SET last_login_at = datetime("now") WHERE id = ?',
        [user.id]
      );
    } catch (updateErr) {
      console.warn('Non-fatal: last_login_at update failed:', updateErr);
    }
    
    // Map subscription_tier to tier for client
    const tier = user.subscription_tier === 'subscriber' ? 'premium' : 'free';
    
    // Return user data (without password)
    return json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      tier: tier,
      createdAt: user.created_at
    });
    
  } catch (err) {
    console.error('Login error:', err);
    return json({ error: 'Login failed' }, { status: 500 });
  }
};
