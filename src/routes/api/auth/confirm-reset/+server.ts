import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';
import { hashPassword } from '$lib/server/password';

interface TokenRow {
  token: string;
  email: string;
  expires_at: string;
}

// POST: Confirm a password reset.
// Takes { token, newPassword }. Validates token, sets new bcrypt hash, deletes token.
export const POST: RequestHandler = async ({ request }) => {
  try {
    let body: unknown;
    try { body = await request.json(); } catch { body = {}; }
    const { token, newPassword } = body as Record<string, unknown>;

    if (!token || typeof token !== 'string') {
      return json({ error: 'Reset token required' }, { status: 400 });
    }
    if (!newPassword || typeof newPassword !== 'string') {
      return json({ error: 'New password required' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const row = await queryOne<TokenRow>(
      'SELECT token, email, expires_at FROM password_reset_tokens WHERE token = ?',
      [token]
    );

    if (!row) {
      return json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    if (new Date(row.expires_at) < new Date()) {
      await execute('DELETE FROM password_reset_tokens WHERE token = ?', [token]);
      return json({ error: 'Reset link has expired — please request a new one' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);

    await execute(
      'UPDATE players SET password_hash = ? WHERE email = ?',
      [newHash, row.email]
    );

    // Consume the token (single-use)
    await execute('DELETE FROM password_reset_tokens WHERE token = ?', [token]);

    return json({ ok: true });

  } catch (err) {
    console.error('Confirm reset error:', err);
    return json({ error: 'Reset failed. Please try again.' }, { status: 500 });
  }
};
