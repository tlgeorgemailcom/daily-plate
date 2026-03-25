import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne } from '$lib/server/turso';

interface PlayerRow {
  id: string;
  email: string;
  display_name: string | null;
  subscription_tier: string;
}

// GET: Validate a player session and return current tier
export const GET: RequestHandler = async ({ url }) => {
  try {
    const playerId = url.searchParams.get('id');
    
    if (!playerId) {
      return json({ valid: false, error: 'Missing player id' }, { status: 400 });
    }
    
    // Look up user in database
    const user = await queryOne<PlayerRow>(
      'SELECT id, email, display_name, subscription_tier FROM players WHERE id = ?',
      [playerId]
    );
    
    if (!user) {
      return json({ valid: false, error: 'Player not found' });
    }
    
    // Map subscription_tier to tier for client (same TIER_MAP as /api/auth/login)
    const TIER_MAP: Record<string, string> = {
      subscriber: 'premium',
      plus: 'plus',
      allin: 'allin',
      moderator: 'moderator',
    };
    const tier = TIER_MAP[user.subscription_tier] ?? 'free';
    
    return json({
      valid: true,
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      tier: tier
    }, {
      headers: { 'Cache-Control': 'private, max-age=30' }
    });
    
  } catch (err) {
    console.error('Session validation error:', err);
    return json({ error: 'Database unavailable' }, { status: 503 });
  }
};
