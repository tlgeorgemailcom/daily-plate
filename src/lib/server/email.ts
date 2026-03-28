import { env } from '$env/dynamic/private';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  const apiKey = env.SMTP_PASS?.trim();
  const fromAddress = env.SMTP_USER?.trim() || 'support@todaypage.com';
  if (!apiKey) {
    throw new Error('SMTP_PASS (ZeptoMail API key) is required');
  }

  const res = await fetch('https://api.zeptomail.com/v1.1/email', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-enczapikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { address: fromAddress },
      to: [{ email_address: { address: to } }],
      subject,
      htmlbody: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ZeptoMail error ${res.status}: ${body}`);
  }
}
