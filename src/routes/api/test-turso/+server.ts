import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
  const rawUrl = env.TURSO_DATABASE_URL || '';
  const rawToken = env.TURSO_AUTH_TOKEN || '';
  
  // Trim potential whitespace/newlines
  const url = rawUrl.trim();
  const authToken = rawToken.trim();
  
  const result: Record<string, unknown> = {
    hasUrl: !!url,
    hasToken: !!authToken,
    urlLength: url.length,
    rawUrlLength: rawUrl.length,
    tokenLength: authToken.length,
    rawTokenLength: rawToken.length,
    urlFull: url.substring(0, 60) + '...'
  };

  try {
    const { createClient } = await import('@libsql/client');
    
    if (!url || !authToken) {
      return json({ ...result, error: 'Missing env vars' });
    }
    
    const client = createClient({
      url,
      authToken
    });
    
    const res = await client.execute('SELECT COUNT(*) as count FROM recipes');
    result.recipeCount = res.rows[0]?.count;
    result.success = true;
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }
  
  return json(result);
};
