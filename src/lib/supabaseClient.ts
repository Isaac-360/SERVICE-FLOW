import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Ensure .env is configured.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Creates a temporary Supabase client with no session persistence.
 * Useful for admin actions (like creating users) that shouldn't affect the current session.
 */
export const createTempClient = () => createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
