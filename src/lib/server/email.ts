import { env } from '$env/dynamic/private';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email via the Resend REST API.
 * Requires RESEND_API_KEY env var.
 * RESEND_FROM_EMAIL defaults to "noreply@todaypage.com" if not set.
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const from = env.RESEND_FROM_EMAIL?.trim() || 'TodayPage <noreply@todaypage.com>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}
