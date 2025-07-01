import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, subject, html } = req.body;
  const apiKey = process.env.VITE_RESEND_API_KEY;
  const from = process.env.VITE_RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return res.status(500).json({ error: 'Missing API key or from email' });
  }

  try {
    await axios.post(
      'https://api.resend.com/emails',
      { from, to, subject, html },
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
} 