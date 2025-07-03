import axios from 'axios';
import { EmailTemplate } from '../types';

const STORAGE_KEY = 'email-templates';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Check if we're on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use localStorage if in development or on localhost
const useLocalStorage = isDevelopment || isLocalhost;

console.log('Template Service initialized:', {
  isDevelopment,
  isLocalhost,
  useLocalStorage,
  hostname: window.location.hostname
});

export const templateService = {
  async loadTemplates(): Promise<EmailTemplate[]> {
    console.log('Loading templates, using localStorage:', useLocalStorage);
    
    if (useLocalStorage) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const templates = JSON.parse(stored);
          console.log('Loaded templates from localStorage:', templates.length);
          return templates;
        } else {
          console.log('No templates found in localStorage');
          return [];
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
      }
    }

    // Use Vercel Blob in production
    try {
      console.log('Attempting to load from Vercel Blob...');
      const response = await axios.get('/api/templates');
      if (response.data && response.data.templates) {
        console.log('Loaded templates from Vercel Blob:', response.data.templates.length);
        return response.data.templates;
      }
      console.log('No templates found in Vercel Blob');
      return [];
    } catch (error: any) {
      console.error('Error loading from Vercel Blob:', error);
      // Fallback to localStorage if Vercel Blob fails
      try {
        console.log('Falling back to localStorage...');
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const templates = JSON.parse(stored);
          console.log('Fallback: Loaded templates from localStorage:', templates.length);
          return templates;
        }
      } catch (localError) {
        console.error('Error loading from localStorage fallback:', localError);
      }
      return [];
    }
  },

  async saveTemplates(templates: EmailTemplate[]): Promise<void> {
    console.log('Saving templates, using localStorage:', useLocalStorage, 'count:', templates.length);
    
    if (useLocalStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        console.log('Saved templates to localStorage:', templates.length);
        return;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        throw new Error('Failed to save templates to localStorage');
      }
    }

    // Use Vercel Blob in production
    try {
      console.log('Attempting to save to Vercel Blob...');
      const response = await axios.post('/api/templates', { templates });
      console.log('Saved templates to Vercel Blob:', templates.length);
      // Also save to localStorage as backup
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        console.log('Backup saved to localStorage');
      } catch (localError) {
        console.warn('Could not save backup to localStorage:', localError);
      }
      return;
    } catch (error: any) {
      console.error('Error saving to Vercel Blob:', error);
      // Fallback to localStorage if Vercel Blob fails
      try {
        console.log('Falling back to localStorage...');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        console.log('Fallback: Saved templates to localStorage:', templates.length);
        return;
      } catch (localError) {
        console.error('Error saving to localStorage fallback:', localError);
        throw new Error('Failed to save templates to both Vercel Blob and localStorage');
      }
    }
  },

  getStorageInfo(): { type: 'localStorage' | 'vercel-blob' | 'fallback'; isLocal: boolean } {
    if (useLocalStorage) {
      return { type: 'localStorage', isLocal: true };
    }
    return { type: 'vercel-blob', isLocal: false };
  }
}; 