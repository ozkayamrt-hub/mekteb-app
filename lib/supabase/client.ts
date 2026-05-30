import { createBrowserClient } from '@supabase/ssr'

// Untyped client — Supabase types are generated via `supabase gen types` after connecting
// Application-level types are in types/database.ts
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
