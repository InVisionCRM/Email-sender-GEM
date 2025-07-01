import axios from 'axios';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  const from = import.meta.env.VITE_RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error('Missing VITE_RESEND_API_KEY or VITE_RESEND_FROM_EMAIL');
  }
  await axios.post(
    'https://api.resend.com/emails',
    {
      from,
      to,
      subject,
      html,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
} 