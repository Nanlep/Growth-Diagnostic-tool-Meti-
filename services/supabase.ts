import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars in various build environments
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore - Vite specific
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    // Node/Webpack specific
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

// Production: Keys are injected via Environment Variables in Vercel/Netlify
// Fallback: If keys are missing, the app will run in "Mock Mode"
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;