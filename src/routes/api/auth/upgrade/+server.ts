import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

interface PlayerRow {
  id: string;
  email: string;
  subscription_tier: string;
}

// Mock payment processing - validates mock card numbers
function validateMockPayment(cardNumber: string, expiry: string, cvc: string): { valid: boolean; error?: string } {
  // Accept any 16-digit card number starting with 4 (mock Visa)
  const cleanCard = cardNumber.replace(/\s/g, '');
  
  if (cleanCard.length !== 16) {
    return { valid: false, error: 'Card number must be 16 digits' };
  }
  
  if (!cleanCard.startsWith('4')) {
    return { valid: false, error: 'Only Visa cards accepted (start with 4)' };
  }
  
  // Special test card that always fails
  if (cleanCard === '4000000000000002') {
    return { valid: false, error: 'Card declined' };
  }
  
  // Validate expiry (MM/YY format)
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return { valid: false, error: 'Invalid expiry format (MM/YY)' };
  }
  
  // Validate CVC (3 digits)
  if (!/^\d{3}$/.test(cvc)) {
    return { valid: false, error: 'CVC must be 3 digits' };
  }
  
  return { valid: true };
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { playerId, cardNumber, expiry, cvc } = await request.json();
    
    if (!playerId) {
      return json({ error: 'Player ID required' }, { status: 400 });
    }
    
    if (!cardNumber || !expiry || !cvc) {
      return json({ error: 'Payment details required' }, { status: 400 });
    }
    
    // Validate mock payment
    const paymentResult = validateMockPayment(cardNumber, expiry, cvc);
    if (!paymentResult.valid) {
      return json({ error: paymentResult.error }, { status: 400 });
    }
    
    // Verify player exists
    const player = await queryOne<PlayerRow>(
      'SELECT id, email, subscription_tier FROM players WHERE id = ?',
      [playerId]
    );
    
    if (!player) {
      return json({ error: 'Player not found' }, { status: 404 });
    }
    
    if (player.subscription_tier === 'plus' || player.subscription_tier === 'allin' || player.subscription_tier === 'subscriber') {
      return json({ error: 'Already subscribed' }, { status: 400 });
    }
    
    // Calculate subscription expiry (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    // Update player subscription
    await execute(
      `UPDATE players 
       SET subscription_tier = 'plus', 
           subscription_expires_at = ? 
       WHERE id = ?`,
      [expiresAt.toISOString(), playerId]
    );
    
    console.log(`💳 Mock payment successful for ${player.email} - upgraded to Plus`);
    
    return json({
      success: true,
      tier: 'plus',
      expiresAt: expiresAt.toISOString(),
      message: 'Welcome to Plus! Your progress will now sync across devices.'
    });
    
  } catch (err) {
    console.error('Upgrade error:', err);
    return json({ error: 'Upgrade failed' }, { status: 500 });
  }
};

// GET endpoint to check subscription status
export const GET: RequestHandler = async ({ url }) => {
  try {
    const playerId = url.searchParams.get('playerId');
    
    if (!playerId) {
      return json({ error: 'Player ID required' }, { status: 400 });
    }
    
    const player = await queryOne<PlayerRow & { subscription_expires_at: string | null }>(
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
