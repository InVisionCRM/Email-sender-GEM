import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, get } from '@vercel/blob';

const BLOB_KEY = 'templates.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Load templates
    try {
      const blob = await get(BLOB_KEY);
      if (!blob) {
        console.log('No templates found, returning empty array');
        return res.status(200).json({ templates: [] });
      }
      const templates = await blob.json();
      console.log('Templates loaded successfully:', templates.length);
      return res.status(200).json({ templates });
    } catch (err) {
      console.error('Error loading templates:', err);
      return res.status(500).json({ error: 'Failed to load templates', details: err.message });
    }
  }
  
  if (req.method === 'POST') {
    // Save templates
    try {
      const { templates } = req.body;
      if (!templates) {
        console.error('Missing templates in request body');
        return res.status(400).json({ error: 'Missing templates' });
      }
      console.log('Saving templates:', templates.length);
      await put(BLOB_KEY, JSON.stringify(templates), { contentType: 'application/json' });
      console.log('Templates saved successfully');
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error saving templates:', err);
      return res.status(500).json({ error: 'Failed to save templates', details: err.message });
    }
  }
  
  res.status(405).json({ error: 'Method not allowed' });
} 