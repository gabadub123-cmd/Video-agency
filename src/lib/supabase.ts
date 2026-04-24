import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = !!(supabaseUrl && 
                      supabaseAnonKey && 
                      !supabaseUrl.includes('placeholder'));

if (!isConfigured) {
  console.warn('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://tmp.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder'
);
