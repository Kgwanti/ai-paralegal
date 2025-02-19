
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables or direct values from your Supabase project
const SUPABASE_URL = "https://anljusqmhznrgqgkddes.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubGp1c3FtaHpucmdxZ2tkZGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MjEyNDYsImV4cCI6MjA1NDQ5NzI0Nn0.nKG_kSz1yMs78HYvndfwTln1GHX-KnJW-FMfRb_rXTk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
