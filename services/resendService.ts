import axios from 'axios';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  await axios.post('/api/send-email', { to, subject, html });
} 