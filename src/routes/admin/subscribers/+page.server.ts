import type { PageServerLoad } from './$types';
import { queryAll } from '$lib/server/turso';

interface PlayerRow {
  id: string;
  email: string;
  display_name: string | null;
  subscription_tier: string;
  subscription_expires_at: string | null;
  admin_notes: string | null;
  created_at: string;
  last_login_at: string | null;
}

export const load: PageServerLoad = async () => {
  // Auth is handled by the parent +layout.server.ts
  let players: PlayerRow[];
  try {
    players = await queryAll<PlayerRow>(
      `SELECT id, email, display_name, subscription_tier, subscription_expires_at, admin_notes, created_at, last_login_at
       FROM players
       ORDER BY created_at DESC`
    );
  } catch {
    // Columns not yet migrated — fall back to base schema and pad nulls.
    // Fix by visiting /api/migrate once.
    type BaseRow = Omit<PlayerRow, 'subscription_expires_at' | 'admin_notes'>;
    const base = await queryAll<BaseRow>(
      `SELECT id, email, display_name, subscription_tier, created_at, last_login_at
       FROM players
       ORDER BY created_at DESC`
    );
    players = base.map(p => ({ ...p, subscription_expires_at: null, admin_notes: null }));
  }
  return { players };
};
