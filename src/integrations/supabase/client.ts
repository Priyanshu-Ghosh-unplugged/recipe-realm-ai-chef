// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qqdnpfbwirtwxayedvis.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZG5wZmJ3aXJ0d3hheWVkdmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTIxNTgsImV4cCI6MjA1OTU4ODE1OH0.fqmCZHL0AWElDy3asKXCbzU1_7uvbiSwxG4_JGiZu3s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);