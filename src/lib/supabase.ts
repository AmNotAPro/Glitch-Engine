import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kqcrwudtamryurzznhlu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxY3J3dWR0YW1yeXVyenpuaGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTM3NDMsImV4cCI6MjA2OTI4OTc0M30.I3sMQs7bK3KFpo9FIh7MNxLga4LlFpmqadgV7mHP4j4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'glitch-engine@1.0.0'
    }
  }
});

// Connection health check
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }
});

export default supabase;

