import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Temporary debug endpoint — delete after diagnosis
export const GET: RequestHandler = async () => {
  return json({
    SMTP_PASS: env.SMTP_PASS ? `set (${env.SMTP_PASS.length} chars)` : 'MISSING',
    SMTP_USER: env.SMTP_USER ? `set: ${env.SMTP_USER}` : 'MISSING',
    SITE_URL:  env.SITE_URL  ? `set: ${env.SITE_URL}`  : 'MISSING',
  });
};
