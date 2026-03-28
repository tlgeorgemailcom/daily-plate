// Stripe client - Server Side Only
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' });
  }
  return stripeClient;
}

// Price IDs are set in Stripe Dashboard and stored as env vars
export function getPriceId(tier: 'plus' | 'allin'): string | null {
  if (tier === 'plus') return env.STRIPE_PLUS_PRICE_ID?.trim() || null;
  if (tier === 'allin') return env.STRIPE_ALLIN_PRICE_ID?.trim() || null;
  return null;
}

export function getWebhookSecret(): string | null {
  return env.STRIPE_WEBHOOK_SECRET?.trim() || null;
}
