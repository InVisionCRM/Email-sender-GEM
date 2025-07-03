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

export async function loadTemplates(): Promise<EmailTemplate[]> {
  try {
    const response = await fetch('/api/templates');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.error('Error loading templates:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('emailTemplates');
    return stored ? JSON.parse(stored) : [];
  }
}

export async function saveTemplates(templates: EmailTemplate[]): Promise<void> {
  try {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ templates }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    // Also save to localStorage as backup
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates:', error);
    // Fallback to localStorage only
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
    throw error;
  }
}

export function getStorageInfo(): { type: 'localStorage' | 'vercel-blob' | 'fallback'; isLocal: boolean } {
  if (useLocalStorage) {
    return { type: 'localStorage', isLocal: true };
  }
  return { type: 'vercel-blob', isLocal: false };
} 