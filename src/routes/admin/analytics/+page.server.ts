import type { PageServerLoad } from './$types';
import { getGameDb } from '$lib/server/turso';

interface EventRow extends Record<string, unknown> {
  id: number;
  event: string;
  device_fp: string;
  ts: string;
}

// Known owner device fingerprints — excluded from all stats
const OWNER_FPS = new Set(['fa1d3a62511d', '2373aabb0e3b']);

function isBot(data: Record<string, unknown>): boolean {
  return (
    data['screen'] === '800x600' &&
    data['timezone'] === 'UTC' &&
    String(data['visit_count'] ?? '') === '1' &&
    data['player_status'] === 'anonymous'
  );
}

function countBy(events: EventRow[], field: string): [string, number][] {
  const m: Record<string, number> = {};
  for (const e of events) {
    const v = String(e[field] ?? '');
    if (v) m[v] = (m[v] ?? 0) + 1;
  }
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

export const load: PageServerLoad = async ({ url }) => {
  // Auth is handled by +layout.server.ts — no check needed here

  const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  const filterFp = url.searchParams.get('fp') ?? null;

  const db = getGameDb();
  const result = await db.execute({
    sql: `SELECT id, event_name, device_fp, local_date, data_json, ts
          FROM analytics_events
          WHERE coalesce(local_date, substr(ts, 1, 10)) = ?
          ORDER BY ts`,
    args: [date],
  });

  const events: EventRow[] = [];
  for (const row of result.rows) {
    let data: Record<string, unknown> = {};
    try { data = JSON.parse(String(row['data_json'] ?? '{}')); } catch { /* skip */ }
    if (isBot(data)) continue;
    const fp = String(row['device_fp'] ?? data['device_fp'] ?? '');
    if (OWNER_FPS.has(fp)) continue;
    events.push({
      id:        Number(row['id']),
      event:     String(row['event_name']),
      device_fp: fp,
      ts:        String(row['ts']),
      ...data,
    });
  }

  const sessions   = events.filter(e => e.event === 'session_start');
  const enters     = events.filter(e => e.event.startsWith('enter:'));
  const exits      = events.filter(e => e.event.startsWith('exit:'));
  const uniqueFps  = [...new Set(events.map(e => e.device_fp).filter(Boolean))];

  // Game engagement table
  const gameMap = new Map<string, { enters: number; exits: number; buckets: Record<string, number> }>();
  for (const e of enters) {
    const g = e.event.replace('enter:', '');
    if (!gameMap.has(g)) gameMap.set(g, { enters: 0, exits: 0, buckets: {} });
    gameMap.get(g)!.enters++;
  }
  for (const e of exits) {
    const parts  = e.event.split(':');
    const g      = parts[1] ?? '?';
    const bucket = parts[2] ?? '?';
    if (!gameMap.has(g)) gameMap.set(g, { enters: 0, exits: 0, buckets: {} });
    const gd = gameMap.get(g)!;
    gd.exits++;
    gd.buckets[bucket] = (gd.buckets[bucket] ?? 0) + 1;
  }

  // Per-device game sessions (exit events = completed plays)
  const gameSessions = exits
    .filter(e => !filterFp || e.device_fp === filterFp)
    .map(e => {
      const parts = e.event.split(':');
      return {
        fp:       e.device_fp,
        game:     parts[1] ?? '?',
        bucket:   parts[2] ?? '?',
        duration: Number(e['duration_seconds'] ?? 0),
        ts:       e.ts,
      };
    });

  // fp → event count
  const fpCounts: Record<string, number> = {};
  for (const fp of uniqueFps) fpCounts[fp] = events.filter(e => e.device_fp === fp).length;

  // Player properties (session_start events only)
  const playerProps: Record<string, [string, number][]> = {};
  for (const field of ['player_status', 'player_tier', 'timezone', 'device_type', 'screen']) {
    playerProps[field] = countBy(sessions, field);
  }

  // Visit count distribution (session_start events only)
  const vcDist = countBy(sessions, 'visit_count');

  // All event type counts
  const allEventCounts: Record<string, number> = {};
  for (const e of events) allEventCounts[e.event] = (allEventCounts[e.event] ?? 0) + 1;

  return {
    date,
    filterFp,
    overview: {
      total:    events.length,
      sessions: sessions.length,
      enters:   enters.length,
      exits:    exits.length,
      devices:  uniqueFps.length,
    },
    uniqueFps,
    fpCounts,
    games: [...gameMap.entries()].map(([game, d]) => ({ game, ...d })),
    gameSessions,
    playerProps,
    vcDist,
    allEventCounts: Object.entries(allEventCounts).sort((a, b) => b[1] - a[1]),
  };
};
