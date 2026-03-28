import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.trim();
  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are required');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const res = await transporter.sendMail({
    from: `TodayPage <${user}>`,
    to,
    subject,
    html,
  });

  if (!res.accepted?.length) {
    throw new Error(`Email not accepted: ${JSON.stringify(res)}`);
  }
}
