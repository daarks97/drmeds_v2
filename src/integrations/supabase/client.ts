import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iootahgfzeyslupdookp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvb3RhaGdmemV5c2x1cGRvb2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDE1ODcsImV4cCI6MjA2MDQ3NzU4N30.itqqGoHZD5BRTgOLPQPzi5MCDyDZPRX7u3iWB7kQ1lo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
