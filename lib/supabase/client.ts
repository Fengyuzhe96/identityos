import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a dummy client during build/SSR when env vars are missing.
    // This should never be called in production without env vars.
    return null as any;
  }

  return createBrowserClient(url, key);
}
