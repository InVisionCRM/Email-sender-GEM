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
      console.log('Attempting to load templates from Vercel Blob...');
      const blob = await get(BLOB_KEY);
      
      if (!blob) {
        console.log('No templates found in Vercel Blob, returning empty array');
        return res.status(200).json({ templates: [] });
      }

      // Validate blob content
      if (!blob.text) {
        console.log('Blob has no text content, returning empty array');
        return res.status(200).json({ templates: [] });
      }

      const text = await blob.text();
      if (!text || text.trim() === '') {
        console.log('Blob is empty, returning empty array');
        return res.status(200).json({ templates: [] });
      }

      let templates;
      try {
        templates = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse templates JSON:', parseError);
        return res.status(200).json({ templates: [] });
      }

      // Validate templates structure
      if (!Array.isArray(templates)) {
        console.error('Templates is not an array:', typeof templates);
        return res.status(200).json({ templates: [] });
      }

      console.log('Templates loaded successfully:', templates.length);
      return res.status(200).json({ templates });
    } catch (err: any) {
      console.error('Error loading templates from Vercel Blob:', err);
      // Return empty array instead of error to prevent app crashes
      return res.status(200).json({ 
        templates: [],
        warning: 'Failed to load from cloud storage, using local storage'
      });
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

      if (!Array.isArray(templates)) {
        console.error('Templates is not an array:', typeof templates);
        return res.status(400).json({ error: 'Templates must be an array' });
      }

      console.log('Saving templates to Vercel Blob:', templates.length);
      
      const jsonString = JSON.stringify(templates);
      await put(BLOB_KEY, jsonString, { 
        contentType: 'application/json',
        access: 'public'
      });
      
      console.log('Templates saved successfully to Vercel Blob');
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('Error saving templates to Vercel Blob:', err);
      return res.status(500).json({ 
        error: 'Failed to save templates to cloud storage',
        details: err.message,
        suggestion: 'Templates will be saved locally instead'
      });
    }
  }
  
  res.status(405).json({ error: 'Method not allowed' });
} 