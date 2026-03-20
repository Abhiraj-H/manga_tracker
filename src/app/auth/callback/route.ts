import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Handles the OAuth redirect from Supabase.
 * Supabase redirects here with a ?code= param after social login.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/library'

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
