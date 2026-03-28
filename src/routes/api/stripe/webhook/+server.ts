import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe, getWebhookSecret } from '$lib/server/stripe';
import { queryOne, execute } from '$lib/server/turso';
import type Stripe from 'stripe';

interface PlayerRow {
  id: string;
  email: string;
  subscription_tier: string;
}

// Map Stripe price → app tier. Populated from subscription metadata.
function tierFromMetadata(metadata: Stripe.Metadata): string {
  return metadata.tier || 'plus';
}

export const POST: RequestHandler = async ({ request }) => {
  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();

  if (!stripe || !webhookSecret) {
    return json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Checkout completed → activate subscription
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const playerId = session.metadata?.player_id;
        const tier = session.metadata?.tier || 'plus';

        if (!playerId) {
          console.error('Webhook: No player_id in session metadata');
          break;
        }

        // Store the subscription ID; expiry will be set by invoice.paid
        await execute(
          `UPDATE players 
           SET subscription_tier = ?, 
               stripe_subscription_id = ?
           WHERE id = ?`,
          [tier, (session.subscription as string) || null, playerId]
        );

        console.log(`✅ Stripe: Player ${playerId} upgraded to ${tier}`);
        break;
      }

      // Recurring payment succeeded → set/extend subscription expiry
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.period_end) break;

        // In Stripe v21 (dahlia), subscription is under parent.subscription_details
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === 'string' ? subRef : subRef?.id;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        const playerId = sub.metadata?.player_id;
        const tier = tierFromMetadata(sub.metadata);

        if (!playerId) {
          console.error('Webhook: No player_id in subscription metadata');
          break;
        }

        const expiresAt = new Date(invoice.period_end * 1000).toISOString();

        await execute(
          `UPDATE players 
           SET subscription_tier = ?,
               subscription_expires_at = ?
           WHERE id = ?`,
          [tier, expiresAt, playerId]
        );

        console.log(`✅ Stripe: Renewed ${playerId} → ${tier} until ${expiresAt}`);
        break;
      }

      // Subscription cancelled or expired → downgrade to free
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const playerId = sub.metadata?.player_id;

        if (!playerId) {
          console.error('Webhook: No player_id in subscription metadata');
          break;
        }

        await execute(
          `UPDATE players 
           SET subscription_tier = 'free',
               stripe_subscription_id = NULL,
               subscription_expires_at = NULL
           WHERE id = ?`,
          [playerId]
        );

        console.log(`⬇️ Stripe: Player ${playerId} downgraded to free (subscription cancelled)`);
        break;
      }

      // Subscription updated (e.g. plan change)
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const playerId = sub.metadata?.player_id;
        const tier = tierFromMetadata(sub.metadata);

        if (!playerId) break;

        // If subscription goes past_due or unpaid, we keep tier but Stripe
        // will eventually fire 'customer.subscription.deleted' if it fails.
        if (sub.status === 'active' || sub.status === 'trialing') {
          await execute(
            `UPDATE players 
             SET subscription_tier = ?
             WHERE id = ?`,
            [tier, playerId]
          );
          console.log(`🔄 Stripe: Player ${playerId} subscription updated → ${tier}`);
        }
        break;
      }

      default:
        console.log(`Stripe webhook: unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return json({ received: true });
};
