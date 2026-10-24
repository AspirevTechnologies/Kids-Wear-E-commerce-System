import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jgbvdkaxjcigmmmfssjv.supabase.co';
// Provide a dummy JWT token for build-time evaluation so Next.js build never crashes when env vars are missing in CI
const DUMMY_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy_build_token';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DUMMY_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Public client for browser and standard queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Privileged service client for server actions and backend routes
export const getServiceSupabase = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DUMMY_KEY;
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
