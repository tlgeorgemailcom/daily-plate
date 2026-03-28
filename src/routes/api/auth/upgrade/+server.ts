import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne } from '$lib/server/turso';

interface PlayerRow {
  id: string;
  subscription_tier: string;
  subscription_expires_at: string | null;
}

// GET endpoint to check subscription status
export const GET: RequestHandler = async ({ url }) => {
  try {
    const playerId = url.searchParams.get('playerId');
    
    if (!playerId) {
      return json({ error: 'Player ID required' }, { status: 400 });
    }
    
    const player = await queryOne<PlayerRow>(
      'SELECT id, subscription_tier, subscription_expires_at FROM players WHERE id = ?',
      [playerId]
    );
    
    if (!player) {
      return json({ error: 'Player not found' }, { status: 404 });
    }
    
    const tierMap: Record<string, string> = { subscriber: 'allin', plus: 'plus', allin: 'allin', moderator: 'moderator' };
    const tier = tierMap[player.subscription_tier] ?? 'free';
    
    return json({
      tier,
      expiresAt: player.subscription_expires_at,
      isActive: tier !== 'free'
    });
    
  } catch (err) {
    console.error('Status check error:', err);
    return json({ error: 'Failed to check status' }, { status: 500 });
  }
};

// POST now redirects to Stripe checkout flow
export const POST: RequestHandler = async () => {
  return json(
    { error: 'Payment has moved to /api/stripe/checkout' },
    { status: 410 }
  );
};
