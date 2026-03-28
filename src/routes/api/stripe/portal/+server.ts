import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe } from '$lib/server/stripe';
import { queryOne } from '$lib/server/turso';
import { env } from '$env/dynamic/private';

interface PlayerRow {
  id: string;
  stripe_customer_id: string | null;
}

export const POST: RequestHandler = async ({ request }) => {
  const stripe = getStripe();
  if (!stripe) {
    return json({ error: 'Payments are not yet configured' }, { status: 503 });
  }

  try {
    const { playerId } = await request.json();

    if (!playerId) {
      return json({ error: 'Player ID required' }, { status: 400 });
    }

    const player = await queryOne<PlayerRow>(
      'SELECT id, stripe_customer_id FROM players WHERE id = ?',
      [playerId]
    );

    if (!player?.stripe_customer_id) {
      return json({ error: 'No billing account found. Please subscribe first.' }, { status: 404 });
    }

    const siteUrl = env.SITE_URL?.trim() || 'https://todaypage.com';

    const session = await stripe.billingPortal.sessions.create({
      customer: player.stripe_customer_id,
      return_url: siteUrl
    });

    return json({ url: session.url });

  } catch (err) {
    console.error('Stripe portal error:', err);
    return json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
};
