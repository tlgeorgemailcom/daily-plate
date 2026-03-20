import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameDb } from '$lib/server/turso';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const eventName: string = body?.event ?? 'unknown';
    const data: Record<string, unknown> = body?.data ?? {};

    const deviceFp = typeof data.device_fp === 'string' ? data.device_fp : null;
    const localDate = typeof data.local_date === 'string' ? data.local_date : null;
    const ts = new Date().toISOString();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
             ?? request.headers.get('x-real-ip')
             ?? null;

    const db = getGameDb();
    await db.execute({
      sql: 'INSERT INTO analytics_events (event_name, device_fp, local_date, data_json, ts) VALUES (?, ?, ?, ?, ?)',
      args: [eventName, deviceFp, localDate, JSON.stringify({ ...data, ip }), ts],
    });

    return json({ ok: true });
  } catch {
    // Fail silently — analytics must never break the app
    return json({ ok: false }, { status: 200 });
  }
};
