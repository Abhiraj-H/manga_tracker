'use client'

import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Use in Client Components */
export function createBrowserClient() {
  return _createBrowserClient(supabaseUrl, supabaseAnonKey)
}
