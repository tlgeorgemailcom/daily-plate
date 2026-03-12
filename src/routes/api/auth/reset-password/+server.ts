import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryOne, execute } from '$lib/server/turso';

// Same hash as login/register
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h1_' + Math.abs(hash).toString(36);
}

interface PlayerRow {
  id: string;
}

// POST: Reset password — requires email + new password
// No email verification (game app, low risk)
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return json({ error: 'Email and new password required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const player = await queryOne<PlayerRow>(
      'SELECT id FROM players WHERE email = ?',
      [normalizedEmail]
    );

    if (!player) {
      // Don't reveal whether email exists
      return json({ success: true });
    }

    const newHash = simpleHash(newPassword);

    await execute(
      'UPDATE players SET password_hash = ? WHERE email = ?',
      [newHash, normalizedEmail]
    );

    console.log(`🔑 Password reset for: ${normalizedEmail}`);

    return json({ success: true });

  } catch (err) {
    console.error('Password reset error:', err);
    return json({ error: 'Reset failed. Please try again.' }, { status: 500 });
  }
};
