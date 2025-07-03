import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  // Validate required fields
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['to', 'subject', 'html'],
      received: { to: !!to, subject: !!subject, html: !!html }
    });
  }

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'RESEND_API_KEY environment variable is not set',
      message: 'Please add RESEND_API_KEY to your Vercel environment variables'
    });
  }

  if (!from) {
    return res.status(500).json({ 
      error: 'RESEND_FROM_EMAIL environment variable is not set',
      message: 'Please add RESEND_FROM_EMAIL to your Vercel environment variables'
    });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', response.status, errorData);
      throw new Error(`Resend API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: err.message 
    });
  }
} 