import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe, getPriceId } from '$lib/server/stripe';
import { queryOne, execute } from '$lib/server/turso';
import { env } from '$env/dynamic/private';

interface PlayerRow {
  id: string;
  email: string;
  subscription_tier: string;
  stripe_customer_id: string | null;
}

export const POST: RequestHandler = async ({ request }) => {
  const stripe = getStripe();
  if (!stripe) {
    return json({ error: 'Payments are not yet configured. Coming soon!' }, { status: 503 });
  }

  try {
    const { playerId, tier } = await request.json();

    if (!playerId) {
      return json({ error: 'Player ID required' }, { status: 400 });
    }
    if (!tier || !['plus', 'allin'].includes(tier)) {
      return json({ error: 'Invalid tier. Choose plus or allin.' }, { status: 400 });
    }

    const priceId = getPriceId(tier);
    if (!priceId) {
      return json({ error: `Price not configured for ${tier} tier` }, { status: 500 });
    }

    // Look up player
    const player = await queryOne<PlayerRow>(
      'SELECT id, email, subscription_tier, stripe_customer_id FROM players WHERE id = ?',
      [playerId]
    );

    if (!player) {
      return json({ error: 'Player not found' }, { status: 404 });
    }

    if (['plus', 'allin'].includes(player.subscription_tier)) {
      return json({ error: 'Already subscribed. Manage your plan from Account settings.' }, { status: 400 });
    }

    // Reuse or create Stripe Customer
    let customerId = player.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: player.email,
        metadata: { player_id: player.id }
      });
      customerId = customer.id;
      await execute(
        'UPDATE players SET stripe_customer_id = ? WHERE id = ?',
        [customerId, player.id]
      );
    }

    const siteUrl = env.SITE_URL?.trim() || 'https://todaypage.com';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}?upgraded=${tier}`,
      cancel_url: `${siteUrl}?upgrade_cancelled=1`,
      metadata: { player_id: player.id, tier },
      subscription_data: {
        metadata: { player_id: player.id, tier }
      }
    });

    return json({ url: session.url });

  } catch (err) {
    console.error('Stripe checkout error:', err);
    return json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
};
