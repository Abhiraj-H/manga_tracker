"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, Loader2, User, Mail, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      // Supabase sends a confirmation email by default.
      // If email confirmation is disabled in your Supabase project, the user is logged in immediately.
      setSuccess("Account created! Check your email to confirm, then sign in.")
      setLoading(false)
      setTimeout(() => router.push("/login"), 3000)
    }
  }

  async function handleGoogleSignIn() {
    setOauthLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-background overflow-hidden -z-10 transition-colors duration-500">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-primary tracking-tight mb-2">
            Join ChapterOne
          </h1>
          <p className="text-muted-foreground">Create an account to start your library.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl p-3 mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-xl p-3 mb-6 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4.5 w-4.5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                name="name"
                type="text" 
                required
                className="w-full bg-muted/40 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                placeholder="Sung Jinwoo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-muted/40 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                placeholder="hunter@sololeveling.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4.5 w-4.5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                name="password"
                type="password" 
                required
                minLength={6}
                className="w-full bg-muted/40 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-primary hover:opacity-90 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 mt-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex items-center before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10">
          <span className="px-4 text-xs text-zinc-500 uppercase tracking-wider font-medium">Or continue with</span>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-3 bg-muted/40 border border-border hover:bg-muted/60 text-foreground py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {oauthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-blue-500 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
