import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Infrastructure Configuration.
 * Retrieves sensitive connection strings and authentication keys from the environment 
 * to initialize the global database client.
 */
const dynamicSupabaseEndpoint = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dynamicSupabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Invariant: Ensure the infrastructure is correctly configured before runtime.
if (!dynamicSupabaseEndpoint || !dynamicSupabaseServiceKey) {
  console.error("❌ CRITICAL INFRASTRUCTURE ERROR: Supabase environment variables are missing. Please verify your .env.local configuration.");
}

/**
 * Global Enterprise Database Client.
 * Orchestrates all real-time data synchronization and CMS queries for the platform.
 */
export const supabase = createClient(
  dynamicSupabaseEndpoint || 'https://placeholder.supabase.co', 
  dynamicSupabaseServiceKey || 'placeholder'
);

