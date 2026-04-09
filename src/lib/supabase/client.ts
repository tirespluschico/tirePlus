import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createMockClient } from "./mock";

let _supabase: SupabaseClient | null = null;

export const DEV_MODE = !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabase(): SupabaseClient {
  if (DEV_MODE) {
    return createMockClient() as unknown as SupabaseClient;
  }

  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

// Convenience export — use getSupabase() in server code
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
