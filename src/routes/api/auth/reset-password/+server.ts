import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { randomBytes } from 'crypto';
import { queryOne, execute } from '$lib/server/turso';
import { sendEmail } from '$lib/server/email';
import { env } from '$env/dynamic/private';

const TOKEN_TTL_HOURS = 1;

interface PlayerRow { id: string; email: string; }

// POST: Request a password reset link.
// Takes { email }. Always returns 200 to avoid email enumeration.
export const POST: RequestHandler = async ({ request }) => {
  try {
    let body: unknown;
    try { body = await request.json(); } catch { body = {}; }
    const { email } = body as Record<string, unknown>;

    if (!email || typeof email !== 'string') {
      return json({ error: 'Email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const player = await queryOne<PlayerRow>(
      'SELECT id, email FROM players WHERE email = ?',
      [normalizedEmail]
    );

    // Always return success — prevents email enumeration
    if (!player) return json({ ok: true });

    // Invalidate any existing tokens for this email
    await execute('DELETE FROM password_reset_tokens WHERE email = ?', [normalizedEmail]);

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000).toISOString();

    await execute(
      'INSERT INTO password_reset_tokens (token, email, expires_at) VALUES (?, ?, ?)',
      [token, normalizedEmail, expiresAt]
    );

    const siteUrl = env.SITE_URL?.trim() || 'https://todaypage.com';
    const resetLink = `${siteUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: normalizedEmail,
      subject: 'Reset your TodayPage password',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1b5e20;margin-bottom:8px">Reset your password</h2>
          <p style="color:#555">Click the link below to set a new password. This link expires in ${TOKEN_TTL_HOURS} hour.</p>
          <a href="${resetLink}"
            style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2e7d32;color:white;text-decoration:none;border-radius:8px;font-weight:600">
            Reset Password
          </a>
          <p style="color:#999;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#ccc;font-size:11px">Or copy this link: ${resetLink}</p>
        </div>
      `,
    });

    return json({ ok: true });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Password reset request error:', msg);
    return json({ error: msg }, { status: 500 });
  }
};
