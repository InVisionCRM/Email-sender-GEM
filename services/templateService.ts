import { EmailTemplate } from '../types';

const STORAGE_KEY = 'emailTemplates';
const useLocalStorage = process.env.NODE_ENV === 'development';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Check if we're on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

console.log('Template Service initialized:', {
  isDevelopment,
  isLocalhost,
  useLocalStorage,
  hostname: window.location.hostname
});

export async function loadTemplates(): Promise<EmailTemplate[]> {
  try {
    console.log('Loading templates from API...');
    const response = await fetch('/api/templates');
    
    if (!response.ok) {
      console.warn('API request failed, falling back to localStorage');
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Handle warning about cloud storage failure
    if (data.warning) {
      console.warn('Cloud storage warning:', data.warning);
    }
    
    if (data.templates && Array.isArray(data.templates)) {
      console.log('Templates loaded from API:', data.templates.length);
      return data.templates;
    }
    
    console.log('No templates from API, falling back to localStorage');
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error loading templates from API:', error);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const templates = JSON.parse(stored);
        console.log('Templates loaded from localStorage:', templates.length);
        return Array.isArray(templates) ? templates : [];
      }
    } catch (localError) {
      console.error('Error loading from localStorage:', localError);
    }
    return [];
  }
}

export async function saveTemplates(templates: EmailTemplate[]): Promise<void> {
  // Always save to localStorage first as backup
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    console.log('Templates saved to localStorage:', templates.length);
  } catch (localError) {
    console.error('Error saving to localStorage:', localError);
  }

  try {
    console.log('Saving templates to API...');
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ templates }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('API save failed:', errorData.error || `HTTP ${response.status}`);
      // Don't throw error since localStorage backup succeeded
      return;
    }

    console.log('Templates saved to API successfully');
  } catch (error) {
    console.error('Error saving templates to API:', error);
    // Don't throw error since localStorage backup succeeded
  }
}

export function getStorageInfo(): { type: 'localStorage' | 'vercel-blob' | 'fallback'; isLocal: boolean } {
  if (useLocalStorage) {
    return { type: 'localStorage', isLocal: true };
  }
  return { type: 'vercel-blob', isLocal: false };
} 