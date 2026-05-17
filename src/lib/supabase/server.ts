import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";

/**
 * Anonymous server-side Supabase client.
 *
 * Use this from server actions / route handlers for public writes (e.g. waitlist signup).
 * RLS protects everything else — the anon key cannot SELECT/UPDATE/DELETE the waitlist table.
 *
 * Do NOT cache the client across cold-start contexts; cheap to instantiate.
 */
export function createServerSupabase(): SupabaseClient {
  return createClient(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "public" },
    global: { headers: { "x-application": "cakey-waitlist" } },
  });
}

/**
 * Service-role client. Bypasses RLS. NEVER expose to the browser.
 * Use only from trusted server contexts that need to read/export data.
 */
export function createServiceSupabase(): SupabaseClient {
  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for the service client.");
  }
  return createClient(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "public" },
  });
}
