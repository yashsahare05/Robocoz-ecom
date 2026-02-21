import { createClient } from "@supabase/supabase-js";

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const getAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const getServiceRoleKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const createServerClient = () => {
  const url = getSupabaseUrl();
  const anonKey = getAnonKey();
  if (!url || !anonKey) {
    return null;
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export const createAdminClient = () => {
  const url = getSupabaseUrl();
  const serviceRoleKey = getServiceRoleKey();
  if (!url || !serviceRoleKey) {
    return null;
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
