import { createClient } from '@supabase/supabase-js';

// Retrieve credentials with fallback checks to prevent system crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string || 'placeholder-anon-key';

// Log a warning in development mode if parameters are unconfigured
if (
  process.env.NODE_ENV !== 'production' && 
  (supabaseUrl.includes('placeholder-url') || supabaseAnonKey === 'placeholder-anon-key')
) {
  console.warn(
    '⚠️ ROOH Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are missing. Supabase database sync will use dummy placeholders.'
  );
}

// Instantiate and export Supabase client singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
