"use client"

import Link from "next/link"
import { Search, Bell, Menu, User, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import { Home, Compass, Library, LineChart, X } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Library", href: "/library", icon: Library },
  { name: "Analytics", href: "/analytics", icon: LineChart },
]

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // Load user session
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    // Close notifications when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    
    // Close mobile menu on resize
    function handleResize() {
      if (window.innerWidth >= 768) setShowMobileMenu(false)
    }
    window.addEventListener("resize", handleResize)
    
    return () => {
      subscription.unsubscribe()
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-40 w-full glass bg-background/60 md:pl-64 border-b border-border">
      <div className="flex items-center justify-between px-6 h-16">
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-xl hidden md:flex items-center relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input 
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl leading-5 bg-muted/40 text-foreground placeholder-muted-foreground focus:outline-none focus:bg-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 sm:text-sm transition-all shadow-inner"
            placeholder="Search manga, tags, or users... (⌘K)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const query = (e.target as HTMLInputElement).value
                if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-all"
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Notifications</h3>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 p-2 rounded-xl hover:bg-accent transition-colors cursor-pointer">
                    <div className="w-2 h-2 mountain-pulse rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">New Chapter: Solo Leveling</p>
                      <p className="text-xs text-muted-foreground">Chapter 180 is now available</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">No more notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <Link href={user ? "/library" : "/login"} className="hidden sm:flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent-500 p-[2px]">
              <div className="w-full h-full bg-muted rounded-full flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-foreground" />
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-background border-r border-border p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-primary to-accent-500">
                ChapterOne
              </h1>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <Link
                href={user ? "/library" : "/login"}
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 p-4 rounded-xl glass-panel hover:bg-accent transition-all"
              >
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent-500 flex items-center justify-center text-white font-bold">
                    {user?.user_metadata?.name ? user.user_metadata.name[0] : <User className="w-5 h-5" />}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-foreground">{user?.user_metadata?.name || user?.email || "Sign In"}</p>
                   <p className="text-xs text-muted-foreground">{user ? "Pro Member" : "Join the journey"}</p>
                 </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
