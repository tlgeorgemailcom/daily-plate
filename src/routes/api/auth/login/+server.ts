import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';
import { verifyPassword, hashPassword } from '$lib/server/password';

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

    if (!user || !user.password_hash) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password (handles both bcrypt and legacy h1_ hashes)
    const { valid, needsUpgrade } = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Silently upgrade legacy hash to bcrypt on successful login
    const newHash = needsUpgrade ? await hashPassword(password) : null;

    await execute(
      `UPDATE players SET last_login_at = datetime('now')${newHash ? ', password_hash = ?' : ''} WHERE id = ?`,
      newHash ? [newHash, user.id] : [user.id]
    );

    // Map subscription_tier to tier for client
    const TIER_MAP: Record<string, string> = { subscriber: 'premium', plus: 'plus', allin: 'allin', moderator: 'moderator' };
    const tier = TIER_MAP[user.subscription_tier] ?? 'free';

    return json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      tier,
      createdAt: user.created_at,
    });

  } catch (err) {
    console.error('Login error:', err);
    return json({ error: 'Login failed' }, { status: 500 });
  }
};
