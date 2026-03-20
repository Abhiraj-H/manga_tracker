"use client"

// AuthProvider is kept for layout compatibility.
// With Supabase, session is read via server components and middleware — no client wrapper needed.
// This is a no-op passthrough.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
