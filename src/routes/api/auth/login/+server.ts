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
  subscription_expires_at: string | null;
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
      'SELECT id, email, display_name, password_hash, subscription_tier, subscription_expires_at, created_at FROM players WHERE email = ?',
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

    // Auto-downgrade if subscription has expired
    let effectiveTier = user.subscription_tier;
    const expired = user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date();
    if (expired && effectiveTier !== 'free' && effectiveTier !== 'moderator') {
      effectiveTier = 'free';
    }

    const updateClauses: string[] = [`last_login_at = datetime('now')`];
    const updateArgs: unknown[] = [];
    if (newHash) { updateClauses.push('password_hash = ?'); updateArgs.push(newHash); }
    if (expired && effectiveTier === 'free') { updateClauses.push('subscription_tier = ?'); updateArgs.push('free'); }
    updateArgs.push(user.id);

    await execute(
      `UPDATE players SET ${updateClauses.join(', ')} WHERE id = ?`,
      updateArgs as import('@libsql/client').InValue[]
    );

    // Map subscription_tier to tier for client
    const TIER_MAP: Record<string, string> = { subscriber: 'premium', plus: 'plus', allin: 'allin', moderator: 'moderator' };
    const tier = TIER_MAP[effectiveTier] ?? 'free';

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
