import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Redirect the old stale deployment to the current one
export const handle: Handle = async ({ event, resolve }) => {
  const host = event.request.headers.get('host') ?? '';
  if (host === 'daily-plate.vercel.app') {
    const url = new URL(event.request.url);
    url.host = 'daily-food-chain.vercel.app';
    throw redirect(301, url.toString());
  }
  return resolve(event);
};
